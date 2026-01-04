import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from "@google/genai";

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable JSON body parsing
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// --- GEMINI AI ANALYSIS ENDPOINT ---
const MODEL_CHAIN = [
  'gemini-2.5-pro',            // 1. Primary High-IQ Model
  'gemini-flash-latest',       // 2. Standard Flash
  'gemini-2.5-flash',          // 3. New Flash
  'gemini-flash-lite-latest'   // 4. Ultimate Fallback
];

// Helper to reliably parse JSON even if the model adds markdown or junk
const cleanAndParseJSON = (text) => {
  if (!text) return null;
  
  // 1. Try direct parse
  try {
    return JSON.parse(text);
  } catch (e) {
    // 2. Strip markdown code blocks (```json ... ```)
    let cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    try {
      return JSON.parse(cleaned);
    } catch (e2) {
      // 3. Extract strictly between first { and last }
      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleaned = text.substring(firstBrace, lastBrace + 1);
        try {
          return JSON.parse(cleaned);
        } catch (e3) {
          throw new Error("Failed to extract valid JSON object from response.");
        }
      }
      throw new Error("Response did not contain a JSON object.");
    }
  }
};

app.post('/api/analyze', async (req, res) => {
  const { pairName, timeframe, ohlc, indicators } = req.body;
  
  // Clean Time log
  const timeLog = new Date().toISOString().split('T')[1].substring(0,8);
  console.log(`[${timeLog}] [Analysis] Starting for ${pairName} (${timeframe})...`);

  if (!process.env.API_KEY) {
    console.error("[Server] Critical Error: API Key is missing.");
    return res.status(500).json({ error: "Server configuration error: API Key missing" });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Prepare condensed OHLC data
  const recentOHLC = ohlc.slice(-15).map(d => ({
    t: new Date(d.time * 1000).toISOString().split('T')[1].substring(0,5),
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
    
    Technical Indicators:
    - RSI (14): ${indicators.rsi.value}
    - SMA (20): ${indicators.sma20.toFixed(2)}
    - SMA (50): ${indicators.sma50.toFixed(2)}
    - Bollinger Bands: Width ${indicators.bollinger.width.toFixed(2)}%
    - MACD: ${indicators.macd.value.toFixed(4)}

    Recent Price Action (Last 15 candles):
    ${JSON.stringify(recentOHLC)}

    Your Goal: Provide a clear, institutional-grade market analysis.

    CRITICAL RESPONSE RULES:
    1. Return ONLY a valid JSON object.
    2. Do NOT write any conversational text, markdown, or 'Thought Process:' headers outside the JSON.
    3. Put your internal reasoning inside the 'thoughtProcess' field of the JSON.
    4. Verdict MUST be one of: 'UP', 'DOWN', or 'NEUTRAL'.
    
    Return ONLY valid JSON matching the schema.
  `;

  // Helper function to try models in sequence
  const tryGenerate = async (modelIndex) => {
    if (modelIndex >= MODEL_CHAIN.length) {
      console.error("[Server] All models exhausted. Analysis failed.");
      throw new Error("All AI models failed to respond or were rate limited.");
    }

    const currentModel = MODEL_CHAIN[modelIndex];
    
    try {
      const config = {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            thoughtProcess: { type: Type.STRING, description: "Your internal monologue analysis." },
            verdict: { type: Type.STRING, enum: ['UP', 'DOWN', 'NEUTRAL'] },
            confidence: { type: Type.NUMBER },
            timeHorizon: { type: Type.STRING },
            predictionDuration: { type: Type.STRING },
            summary: { type: Type.STRING },
            keyFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
            riskWarnings: { type: Type.ARRAY, items: { type: Type.STRING } },
            entryZone: { type: Type.STRING },
            targetZone: { type: Type.STRING },
            stopLoss: { type: Type.STRING }
          },
          required: ['thoughtProcess', 'verdict', 'confidence', 'summary', 'keyFactors', 'riskWarnings', 'predictionDuration']
        }
      };

      console.log(`[Server] Requesting ${currentModel} [${modelIndex + 1}/${MODEL_CHAIN.length}]...`);
      
      const response = await ai.models.generateContent({
        model: currentModel,
        contents: prompt,
        config: config
      });

      const resultText = response.text;
      if (!resultText) throw new Error("Empty response text");

      // Robust Parsing
      const parsed = cleanAndParseJSON(resultText);
      console.log(`[Server] Success: ${currentModel} -> Verdict: ${parsed.verdict}`);
      return parsed;

    } catch (error) {
       const errorMsg = error.message || "Unknown error";
       
       // Handle specific error types for better logging
       let failReason = "Unknown";
       if (errorMsg.includes("429") || errorMsg.includes("quota")) failReason = "Rate Limit/Quota";
       else if (errorMsg.includes("JSON")) failReason = "JSON Parse Error";
       else if (errorMsg.includes("503") || errorMsg.includes("500")) failReason = "Model Overloaded";
       else failReason = errorMsg;

       console.warn(`[Server] Failed: ${currentModel} -> ${failReason}`);
       
       // Stop if it's an Auth error (no point retrying)
       if (errorMsg.includes("API key") || errorMsg.includes("403")) {
          throw new Error("Invalid API Key configuration.");
       }

       // Retry with next model
       return tryGenerate(modelIndex + 1);
    }
  };

  try {
    const result = await tryGenerate(0);
    res.json(result);
  } catch (error) {
    console.error("[Server] Final Failure:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// API Endpoint to create Polar Checkout
app.post('/api/create-checkout', async (req, res) => {
  try {
    const { customerEmail, userId } = req.body;
    
    // Load Token from Env
    const polarToken = process.env.POLAR_ACCESS_TOKEN;
    
    if (!polarToken) {
      console.error('Missing POLAR_ACCESS_TOKEN in .env file');
      return res.status(500).json({ error: 'Server configuration error: Missing Payment Token' });
    }

    const productId = '19c116dd-58c2-4df0-8904-c1cb6d617e95';
    
    let origin = process.env.BASE_URL;
    
    if (!origin) {
      if (req.headers.origin) {
        origin = req.headers.origin;
      } else {
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.headers['x-forwarded-host'] || req.get('host');
        origin = `${protocol}://${host}`;
      }
    }

    const response = await fetch('https://sandbox-api.polar.sh/v1/checkouts/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${polarToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product_id: productId,
        success_url: `${origin}?payment=success`,
        customer_email: customerEmail,
        metadata: {
          userId: userId
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Polar API Error:', errorText);
      return res.status(response.status).json({ error: 'Failed to create checkout' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});