import React from 'react';
import { AIAnalysisResult } from '../types';
import { ArrowUpRight, ArrowDownRight, Minus, ShieldAlert, Target, TrendingUp, Clock, Hourglass, Gavel } from 'lucide-react';

interface VerdictCardProps {
  result: AIAnalysisResult | null;
}

const VerdictCard: React.FC<VerdictCardProps> = ({ result }) => {
  if (!result) return null;

  const isBullish = result.verdict === 'UP';
  const isBearish = result.verdict === 'DOWN';
  
  const mainColor = isBullish ? 'text-cyber-green' : isBearish ? 'text-cyber-red' : 'text-yellow-400';
  const bgGlow = isBullish ? 'shadow-[0_0_30px_rgba(0,255,157,0.1)]' : isBearish ? 'shadow-[0_0_30px_rgba(255,42,42,0.1)]' : 'shadow-[0_0_30px_rgba(250,204,21,0.1)]';
  const borderColor = isBullish ? 'border-cyber-green/30' : isBearish ? 'border-cyber-red/30' : 'border-yellow-400/30';
  
  // Icon styling to match AnalysisSteps
  const iconStyle = isBullish 
    ? 'bg-green-500/10 text-green-400 border-green-500/20' 
    : isBearish 
      ? 'bg-red-500/10 text-red-400 border-red-500/20' 
      : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';

  return (
    <div className={`glass-panel rounded-xl border ${borderColor} ${bgGlow} animate-in zoom-in-95 duration-500 overflow-hidden`}>
      
      {/* Header Section (Matching Step Style) */}
      <div className="p-4 flex items-center gap-4 border-b border-gray-800/50 bg-black/20">
         <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${iconStyle}`}>
            <Gavel className="w-5 h-5" />
         </div>
         <div>
            <div className="flex items-center gap-2">
               <h3 className="font-bold text-sm tracking-wide text-gray-200">Final Verdict</h3>
               <span className="text-[10px] bg-gray-800/80 text-gray-400 px-1.5 py-0.5 rounded font-mono border border-gray-700/50">COMPLETE</span>
            </div>
            <p className="text-xs text-gray-500 font-mono mt-0.5">Strategic execution plan generated</p>
         </div>
      </div>

      {/* Top Header: Verdict & Score */}
      <div className="p-6 pb-4 flex flex-col justify-between items-start gap-4 relative">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           {isBullish ? <TrendingUp className="w-32 h-32" /> : isBearish ? <TrendingUp className="w-32 h-32 rotate-180" /> : <Minus className="w-32 h-32" />}
        </div>

        <div className="relative z-10 w-full">
          <h3 className="text-gray-400 text-[10px] font-mono uppercase tracking-widest mb-1 opacity-70">AI Predicted Direction</h3>
          <div className="flex items-center justify-between">
            <div className={`text-6xl font-black tracking-tighter ${mainColor} flex items-center gap-1`}>
              {isBullish && <ArrowUpRight className="w-12 h-12" />}
              {isBearish && <ArrowDownRight className="w-12 h-12" />}
              {!isBullish && !isBearish && <Minus className="w-12 h-12" />}
              {result.verdict}
            </div>
            
            <div className="flex items-end flex-col">
              <span className={`text-5xl font-mono font-bold ${result.confidence >= 90 ? 'text-cyber-cyan' : 'text-gray-300'}`}>
                {result.confidence}%
              </span>
              <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Confidence</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Bar: Duration & Strategy (Fixed Layout) */}
      <div className="bg-black/30 border-y border-gray-800/50 flex flex-wrap">
         <div className="flex-1 p-3 border-r border-gray-800/50 flex items-center justify-center md:justify-start gap-3 min-w-[200px]">
            <div className="w-8 h-8 rounded bg-gray-800/50 flex items-center justify-center shrink-0">
               <Hourglass className="w-4 h-4 text-gray-400" />
            </div>
            <div>
               <div className="text-[9px] text-gray-500 font-mono uppercase">Expected Duration</div>
               <div className="text-sm text-gray-200 font-bold">{result.predictionDuration}</div>
            </div>
         </div>
         <div className="flex-1 p-3 flex items-center justify-center md:justify-start gap-3 min-w-[200px]">
             <div className="w-8 h-8 rounded bg-gray-800/50 flex items-center justify-center shrink-0">
               <Clock className="w-4 h-4 text-gray-400" />
            </div>
            <div>
               <div className="text-[9px] text-gray-500 font-mono uppercase">Strategy Type</div>
               <div className="text-sm text-cyber-cyan font-mono font-bold">{result.timeHorizon || 'Intraday'}</div>
            </div>
         </div>
      </div>

      <div className="p-6 pt-4">
        {/* Summary */}
        <div className="mb-6 p-4 rounded bg-gray-900/40 border border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-70"></div>
          <p className="text-gray-300 leading-relaxed text-sm font-medium pl-2">{result.summary}</p>
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900/30 p-4 rounded border border-gray-800/50 hover:bg-gray-900/50 transition-colors">
            <h4 className="flex items-center gap-2 text-cyber-cyan text-xs font-bold uppercase mb-3">
              <TrendingUp className="w-3 h-3" /> Key Confirmations
            </h4>
            <ul className="space-y-2">
              {result.keyFactors.slice(0, 3).map((f, i) => (
                <li key={i} className="text-gray-400 text-xs border-l-2 border-gray-700 pl-3 py-0.5 leading-snug">{f}</li>
              ))}
            </ul>
          </div>
          
          <div className="bg-gray-900/30 p-4 rounded border border-gray-800/50 hover:bg-gray-900/50 transition-colors">
            <h4 className="flex items-center gap-2 text-cyber-magenta text-xs font-bold uppercase mb-3">
              <Target className="w-3 h-3" /> Trade Targets
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                <span className="text-gray-500 font-bold tracking-wide">ENTRY</span>
                <span className="text-gray-200 font-mono">{result.entryZone || 'MARKET'}</span>
              </div>
              <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                <span className="text-gray-500 font-bold tracking-wide">TARGET</span>
                <span className="text-cyber-green font-mono">{result.targetZone || 'OPEN'}</span>
              </div>
              <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                <span className="text-gray-500 font-bold tracking-wide">STOP</span>
                <span className="text-cyber-red font-mono">{result.stopLoss || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/30 p-4 rounded border border-gray-800/50 hover:bg-gray-900/50 transition-colors">
            <h4 className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase mb-3">
              <ShieldAlert className="w-3 h-3" /> Risk Factors
            </h4>
            <ul className="space-y-2">
              {result.riskWarnings.slice(0, 2).map((w, i) => (
                <li key={i} className="text-gray-400 text-xs border-l-2 border-orange-900/50 pl-3 py-0.5 leading-snug">{w}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerdictCard;