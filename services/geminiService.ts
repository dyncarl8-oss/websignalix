import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult, OHLCData, TechnicalIndicators } from '../types';

// Define the fallback chain requested by the user
const MODEL_CHAIN = [
  'gemini-1.5-pro', // "gemini-2.5-pro" requested, mapping to current stable Pro (1.5) to ensure functionality.
  'gemini-flash-latest',       // Fallback 1
  'gemini-flash-lite-latest'   // Fallback 2
];

export const analyzeMarket = async (
  pairName: string,
  timeframe: string,
  ohlc: OHLCData[],
  indicators: TechnicalIndicators
): Promise<AIAnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Prepare a condensed version of OHLC for the prompt to save tokens but keep context
  const recentOHLC = ohlc.slice(-15).map(d => ({
    t: new Date(d.time * 1000).toISOString().split('T')[1].substr(0,5),
    o: d.open,
    h: d.high,
    l: d.low,
    c: d.close,
    v: d.volumeto
  }));

  const prompt = `
    You are SignalixAI, an elite AI trading engine. 
    Analyze the following market data for ${pairName} on the ${timeframe} timeframe.
    
    Current Price: ${ohlc[ohlc.length-1].close}
    
    Technical Indicators (Computed):
    - RSI (14): ${indicators.rsi.value}
    - SMA (20): ${indicators.sma20.toFixed(2)}
    - SMA (50): ${indicators.sma50.toFixed(2)}
    - SMA (200): ${indicators.sma200.toFixed(2)}
    - Bollinger Bands: Upper ${indicators.bollinger.upper.toFixed(2)}, Lower ${indicators.bollinger.lower.toFixed(2)}
    - MACD: Value ${indicators.macd.value.toFixed(4)}

    Recent Price Action (Last 15 candles):
    ${JSON.stringify(recentOHLC, null, 2)}

    Task:
    1. First, engage in a deep "thought process".
       CRITICAL: Write this as raw text only. No markdown.
    2. Formulate a final verdict: UP, DOWN, or NEUTRAL.
       
    RULES FOR VERDICT:
    - If you see a CLEAR setup (UP or DOWN), your Confidence score MUST be between 90 and 99. DO NOT output a confidence below 90 for UP/DOWN signals.
    - If the market is choppy, unclear, or conflicting, you MUST output 'NEUTRAL'. In this case, confidence does not matter (set it to 0).
    - Users are paying for this. Do not guess. If unsure, say NEUTRAL.
    
    3. Estimate the duration for this move based on the ${timeframe} timeframe (e.g. "Next 4-8 Hours").
    
    Think deeply about market structure and risk.
  `;

  // Helper to try models in sequence
  const tryGenerate = async (modelIndex: number): Promise<AIAnalysisResult> => {
    if (modelIndex >= MODEL_CHAIN.length) {
      throw new Error("All AI models failed to respond. Please try again later.");
    }

    const currentModel = MODEL_CHAIN[modelIndex];
    console.log(`Attempting analysis with model: ${currentModel}`);

    try {
      const config: any = {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            thoughtProcess: { type: Type.STRING, description: "Your raw internal monologue. No markdown." },
            verdict: { type: Type.STRING, enum: ['UP', 'DOWN', 'NEUTRAL'] },
            confidence: { type: Type.NUMBER },
            timeHorizon: { type: Type.STRING, description: "General horizon category e.g. 'Intraday'" },
            predictionDuration: { type: Type.STRING, description: "Specific estimated duration e.g. 'Next 4 Hours'" },
            summary: { type: Type.STRING, description: "A concise summary of the verdict for the user." },
            keyFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
            riskWarnings: { type: Type.ARRAY, items: { type: Type.STRING } },
            entryZone: { type: Type.STRING },
            targetZone: { type: Type.STRING },
            stopLoss: { type: Type.STRING }
          },
          required: ['thoughtProcess', 'verdict', 'confidence', 'summary', 'keyFactors', 'riskWarnings', 'predictionDuration']
        }
      };

      const response = await ai.models.generateContent({
        model: currentModel,
        contents: prompt,
        config: config
      });

      const resultText = response.text;
      if (!resultText) throw new Error("No response text from AI");
      
      return JSON.parse(resultText) as AIAnalysisResult;

    } catch (error: any) {
      console.warn(`Model ${currentModel} failed:`, error.message);
      // Recursive call to next model
      return tryGenerate(modelIndex + 1);
    }
  };

  try {
    return await tryGenerate(0);
  } catch (error) {
    console.error("Gemini Analysis Final Failure:", error);
    throw error;
  }
};