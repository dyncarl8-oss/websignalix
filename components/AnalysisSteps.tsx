import React, { useState, useEffect, useRef } from 'react';
import { Loader2, CheckCircle2, ChevronDown, ChevronUp, Database, Activity, Scale, Brain, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { OHLCData, TechnicalIndicators, AIAnalysisResult, AggregationResult } from '../types';

interface StepProps {
  status: 'loading' | 'complete' | 'error';
  title: string;
  icon: React.ReactNode;
  duration?: number;
  children?: React.ReactNode;
  errorMsg?: string;
  headerRight?: React.ReactNode;
}

const BaseStep: React.FC<StepProps> = ({ status, title, icon, duration, children, errorMsg, headerRight }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-[#0b0b10] border border-gray-800 rounded-xl overflow-hidden mb-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out shadow-xl">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors border-b border-gray-900/50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4 flex-1">
          {/* Icon Box */}
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-700 ${
            status === 'loading' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
            status === 'complete' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : 
             status === 'complete' ? <CheckCircle2 className="w-5 h-5" /> : icon}
          </div>

          {/* Title & Status */}
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-3">
              <h3 className={`font-bold text-sm tracking-wide transition-colors duration-500 ${
                status === 'loading' ? 'text-purple-400' : 'text-gray-200'
              }`}>
                {title}
              </h3>
              {duration && status === 'complete' && (
                <span className="text-xs font-mono font-bold text-gray-300 bg-gray-800/80 px-2 py-0.5 rounded border border-gray-700/50 shadow-sm animate-in fade-in zoom-in duration-500">
                   {duration.toFixed(2)}s
                </span>
              )}
            </div>
            
            <p className="text-xs text-gray-500 mt-1 truncate max-w-[200px] md:max-w-md font-mono">
              {status === 'loading' ? 'Processing...' : 
               status === 'complete' ? errorMsg || (children ? 'Complete' : 'Done') : 'Failed'} 
            </p>
          </div>
        </div>

        {/* Right Actions: Expand */}
        <div className="flex items-center gap-4">
          {headerRight}
          
          <div className={`text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {isExpanded && children && (
        <div className="p-4 bg-black/20 border-t border-gray-900/30 animate-in fade-in duration-700">
          {children}
        </div>
      )}
      
      {status === 'error' && (
        <div className="border-t border-red-900/30 p-4 bg-red-900/10 text-red-400 text-sm">
          Error: {errorMsg || 'Operation failed'}
        </div>
      )}
    </div>
  );
};

export const DataCollectionStep: React.FC<{
  status: 'loading' | 'complete' | 'error';
  data?: OHLCData[];
  pair: string;
  duration?: number;
}> = ({ status, data, pair, duration }) => {
  const lastCandle = data?.[data.length - 1];
  const firstCandle = data?.[0];
  
  let change = 0;
  let changePercent = 0;
  if (lastCandle && firstCandle) {
    change = lastCandle.close - firstCandle.open; 
    changePercent = (change / firstCandle.open) * 100;
  }

  return (
    <BaseStep 
      status={status} 
      title="Data Collection" 
      icon={<Database className="w-4 h-4" />}
      duration={duration}
    >
      {status === 'loading' && (
        <p className="text-gray-400 text-xs pl-1 font-mono animate-pulse">Fetching live market data from CryptoCompare...</p>
      )}
      {data && lastCandle && (
        <div className="grid grid-cols-2 gap-8 text-sm pt-1">
          <div>
            <div className="text-gray-500 text-[10px] uppercase font-bold mb-1">Current Price</div>
            <div className="text-2xl font-bold text-white tracking-tight font-mono">${lastCandle.close.toFixed(lastCandle.close < 1 ? 5 : 2)}</div>
             <div className="flex justify-between items-center mt-3 border-t border-gray-800/50 pt-2">
              <span className="text-gray-500 text-xs">Volume 24h</span>
              <span className="text-gray-300 font-mono text-xs">{(lastCandle.volumeto / 1000).toFixed(1)}K</span> 
            </div>
          </div>
          <div>
            <div className="text-gray-500 text-[10px] uppercase font-bold mb-1">Period Change</div>
            <div className={`text-xl font-mono flex items-center gap-1 font-bold ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {changePercent > 0 ? <Activity className="w-4 h-4" /> : <Activity className="w-4 h-4 rotate-180" />}
              {changePercent > 0 ? '+' : ''}{changePercent.toFixed(2)}%
            </div>
             <div className="flex justify-between items-center mt-3 border-t border-gray-800/50 pt-2">
              <span className="text-gray-500 text-xs">Data Points</span>
              <span className="text-purple-400 font-mono text-xs">{data.length} candles</span>
            </div>
          </div>
        </div>
      )}
    </BaseStep>
  );
};

// --- TECHNICAL INDICATOR ROW COMPONENT ---
const IndicatorRow = ({ name, signal, desc, value, strength }: { name: string, signal: string, desc: string, value: string | number, strength: number }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-800/50 last:border-0 group hover:bg-white/5 px-2 rounded transition-colors">
    <div className="flex flex-col gap-0.5 w-1/3">
      <span className="text-xs font-bold text-gray-200">{name}</span>
      <span className="text-[10px] text-gray-500">{desc}</span>
    </div>
    
    <div className="flex items-center gap-2 w-1/4">
       <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
         signal === 'UP' ? 'bg-purple-500/10 text-purple-300 border-purple-500/20' :
         signal === 'DOWN' ? 'bg-red-500/10 text-red-300 border-red-500/20' :
         'bg-gray-800 text-gray-400 border-gray-700'
       }`}>
         {signal}
       </span>
    </div>

    <div className="flex flex-col items-end w-1/3">
       <span className="text-xs font-mono text-gray-300 font-bold">{value}</span>
       <div className="flex items-center gap-1 mt-0.5">
          <div className="w-12 h-1 bg-gray-800 rounded-full overflow-hidden">
             <div className="h-full bg-blue-500" style={{ width: `${strength}%` }}></div>
          </div>
          <span className="text-[10px] text-gray-600">{strength}</span>
       </div>
    </div>
  </div>
);

const SectionHeader = ({ title }: { title: string }) => (
  <h4 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-4 mb-2 pl-2 flex items-center gap-2">
    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
    {title}
  </h4>
);

export const TechnicalStep: React.FC<{
  status: 'loading' | 'complete' | 'error';
  indicators?: TechnicalIndicators;
  duration?: number;
}> = ({ status, indicators, duration }) => {
  return (
    <BaseStep 
      status={status} 
      title="Technical Analysis" 
      icon={<Activity className="w-4 h-4" />}
      duration={duration}
    >
      {status === 'loading' && (
         <p className="text-xs text-gray-500 animate-pulse font-mono pl-1">Computing technical indicators...</p>
      )}
      {indicators && (
        <div className="pb-1">
           <SectionHeader title="Momentum Indicators" />
           <IndicatorRow name="RSI" signal={indicators.rsi.signal} desc={indicators.rsi.description} value={indicators.rsi.value} strength={indicators.rsi.strength} />
           <IndicatorRow name="Stochastic K/D" signal={indicators.stochastic.signal} desc="Neutral momentum" value={`${indicators.stochastic.k.toFixed(0)}/${indicators.stochastic.d.toFixed(0)}`} strength={indicators.stochastic.strength.toFixed(0) as any} />
           <IndicatorRow name="Momentum" signal={indicators.momentum.signal} desc={indicators.momentum.description} value={indicators.momentum.value} strength={indicators.momentum.strength} />
           <IndicatorRow name="ROC" signal={indicators.roc.signal} desc={indicators.roc.description} value={indicators.roc.value} strength={indicators.roc.strength.toFixed(0) as any} />

           <SectionHeader title="Trend Indicators" />
           <IndicatorRow name="MACD" signal={indicators.macd.signal} desc={indicators.macd.description} value={indicators.macd.value.toFixed(4)} strength={indicators.macd.strength.toFixed(0) as any} />
           <IndicatorRow name="ADX" signal={indicators.adx.signal} desc={indicators.adx.description} value={indicators.adx.value} strength={indicators.adx.strength.toFixed(0) as any} />
           <IndicatorRow name="SMA Structure" signal={indicators.trendSignal.signal} desc={indicators.trendSignal.description} value={indicators.sma50.toFixed(2)} strength={indicators.trendSignal.strength} />

           <SectionHeader title="Volatility & Volume" />
           <IndicatorRow name="Bollinger Bands" signal={indicators.bollinger.signal} desc="Band Width" value={`Width: ${indicators.bollinger.width.toFixed(2)}%`} strength={indicators.bollinger.strength} />
           <IndicatorRow name="Volume Trend" signal={indicators.volumeTrend.signal} desc={indicators.volumeTrend.description} value={indicators.volumeTrend.value} strength={indicators.volumeTrend.strength.toFixed(0) as any} />

        </div>
      )}
    </BaseStep>
  );
};

export const AggregationStep: React.FC<{
  status: 'loading' | 'complete' | 'error';
  results?: AggregationResult;
  duration?: number;
}> = ({ status, results, duration }) => {
  return (
    <BaseStep 
      status={status} 
      title="Signal Aggregation" 
      icon={<Scale className="w-4 h-4" />}
      duration={duration}
    >
      {status === 'loading' && <p className="text-xs text-gray-500 animate-pulse font-mono pl-1">Weighing signals for confidence score...</p>}
      {results && (
        <div className="space-y-6 pt-2">
          {/* Top Cards */}
          <div className="grid grid-cols-3 gap-2">
             <div className="bg-[#0f1a15] border border-green-900/30 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-500 mb-1">{results.upCount}</div>
                <div className="text-[9px] text-green-400/60 uppercase font-bold tracking-wider">UP Signals</div>
             </div>
             <div className="bg-[#1a0f0f] border border-red-900/30 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-500 mb-1">{results.downCount}</div>
                <div className="text-[9px] text-red-400/60 uppercase font-bold tracking-wider">DOWN Signals</div>
             </div>
             <div className="bg-[#121216] border border-gray-800 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-400 mb-1">{results.neutralCount}</div>
                <div className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Neutral</div>
             </div>
          </div>

          {/* Scores */}
          <div className="space-y-3 px-1">
             <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400">UP Score</span>
                <span className="text-sm font-mono font-bold text-green-400">{results.upScore.toFixed(0)}</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400">DOWN Score</span>
                <span className="text-sm font-mono font-bold text-red-400">{results.downScore.toFixed(0)}</span>
             </div>
             
             <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent my-3"></div>

             <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 uppercase font-bold">Signal Alignment</span>
                <span className="text-sm font-mono font-bold text-white">{results.alignment.toFixed(1)}%</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 uppercase font-bold">Market Regime</span>
                <span className={`text-[10px] uppercase px-2 py-0.5 rounded font-bold border ${
                   results.marketRegime === 'TRENDING' ? 'bg-purple-900/20 text-purple-400 border-purple-500/30' :
                   results.marketRegime === 'VOLATILE' ? 'bg-orange-900/20 text-orange-400 border-orange-500/30' :
                   'bg-gray-800 text-gray-400 border-gray-700'
                }`}>{results.marketRegime}</span>
             </div>
          </div>
        </div>
      )}
    </BaseStep>
  );
};

export const AIAnalysisStep: React.FC<{
  status: 'loading' | 'complete' | 'error';
  result?: AIAnalysisResult;
  partialThought?: string;
  duration?: number;
}> = ({ status, result, partialThought, duration }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll when partial thought updates
  useEffect(() => {
    if (scrollRef.current) {
       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [partialThought]);

  // Determine content to show: result thought, partial thought, or loading message
  const content = result?.thoughtProcess || partialThought;

  return (
    <BaseStep 
      status={status} 
      title="AI Deep Analysis" 
      icon={<Brain className="w-4 h-4" />}
      duration={duration}
    >
      {!content && status === 'loading' && (
        <div className="pl-1">
          <p className="text-xs text-purple-400 animate-pulse font-mono">AI is Analyzing...</p>
        </div>
      )}
      
      {content && (
        <div className="space-y-4">
           {/* Thinking Header */}
           <div className="flex items-center justify-between border-b border-gray-800/50 pb-2">
              <div className="flex items-center gap-2">
                <Brain className="w-3 h-3 text-purple-500" />
                <span className="text-xs font-bold text-purple-100">AI Thought Process</span>
              </div>
              <span className={`text-[9px] px-2 py-0.5 rounded border font-mono uppercase transition-colors duration-300 ${
                status === 'complete' 
                  ? 'bg-green-900/20 text-green-300 border-green-500/30' 
                  : 'bg-purple-900/20 text-purple-300 border-purple-500/30 animate-pulse'
              }`}>
                {status === 'complete' ? 'Analysis Complete' : 'Thinking Mode Active'}
              </span>
           </div>
           
           {/* Internal Monologue Content */}
           <div 
             ref={scrollRef}
             className="bg-[#08080a] border border-gray-800/50 p-4 rounded-lg max-h-60 overflow-y-auto custom-scrollbar relative"
           >
             {/* Scanline effect */}
             <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%] opacity-10"></div>
             
             <p className="font-mono text-[11px] text-gray-400 leading-relaxed opacity-90 whitespace-pre-line relative z-10">
               {content}
               {status === 'loading' && (
                 <span className="inline-block w-2 h-4 bg-purple-500 ml-1 animate-pulse align-middle"></span>
               )}
             </p>
           </div>
        </div>
      )}
    </BaseStep>
  );
};