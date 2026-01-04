import React from 'react';
import { SUPPORTED_PAIRS, TIMEFRAMES } from '../constants';
import { CryptoPair } from '../types';
import { Zap, Activity, Lock, Coins, BarChart2 } from 'lucide-react';

interface SidebarProps {
  selectedPair: CryptoPair;
  onSelectPair: (pair: CryptoPair) => void;
  selectedTimeframe: string;
  onSelectTimeframe: (tf: string) => void;
  credits: number;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  onOpenPricing: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedPair,
  onSelectPair,
  selectedTimeframe,
  onSelectTimeframe,
  credits,
  onAnalyze,
  isAnalyzing,
  onOpenPricing
}) => {
  return (
    <div className="w-full lg:w-80 flex flex-col gap-6 p-4 border-r border-cyber-border bg-cyber-dark/50 overflow-y-auto h-full scrollbar-hide">
      
      {/* Brand */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-cyber-cyan to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.3)]">
          <Activity className="text-white w-5 h-5" />
        </div>
        <h1 className="text-2xl font-bold tracking-tighter text-white">
          SIGNALIX<span className="text-cyber-cyan">AI</span>
        </h1>
      </div>

      {/* Credit Status */}
      <div className="glass-panel p-4 rounded-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
          <Zap className="w-12 h-12" />
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400 text-xs font-mono uppercase">Neural Credits</span>
          <Coins className="w-4 h-4 text-yellow-500" />
        </div>
        <div className="text-2xl font-bold font-mono text-white mb-1">{credits} <span className="text-sm text-gray-500 font-sans font-normal">available</span></div>
        <button 
          onClick={onOpenPricing}
          className="text-xs text-cyber-cyan hover:text-white transition-colors underline decoration-dotted"
        >
          Get Unlimited Access &rarr;
        </button>
      </div>

      {/* Pair Selector */}
      <div>
        <label className="text-xs text-gray-500 font-mono uppercase mb-2 block">Market Asset</label>
        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
          {SUPPORTED_PAIRS.map(pair => (
            <button
              key={pair.symbol}
              onClick={() => onSelectPair(pair)}
              className={`flex items-center justify-between p-3 rounded border transition-all duration-200 text-sm ${
                selectedPair.symbol === pair.symbol
                  ? 'bg-cyber-cyan/10 border-cyber-cyan/50 text-white shadow-[0_0_10px_rgba(0,243,255,0.1)]'
                  : 'bg-cyber-panel border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-200'
              }`}
            >
              <div className="flex flex-col items-start">
                <span className="font-bold">{pair.base}</span>
                <span className="text-[10px] opacity-60">{pair.name}</span>
              </div>
              <span className="text-xs font-mono text-gray-500">{pair.quote}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Timeframe Selector */}
      <div>
        <label className="text-xs text-gray-500 font-mono uppercase mb-2 block">Time Horizon</label>
        <div className="grid grid-cols-4 gap-2">
          {TIMEFRAMES.map(tf => (
            <button
              key={tf.value}
              onClick={() => onSelectTimeframe(tf.value)}
              className={`p-2 rounded border text-xs font-mono transition-all duration-200 ${
                selectedTimeframe === tf.value
                  ? 'bg-cyber-magenta/10 border-cyber-magenta/50 text-white shadow-[0_0_10px_rgba(255,0,255,0.1)]'
                  : 'bg-cyber-panel border-transparent text-gray-400 hover:border-gray-600'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1"></div>

      {/* Action Button */}
      <button
        onClick={onAnalyze}
        disabled={isAnalyzing || credits <= 0}
        className={`w-full py-4 rounded font-bold text-sm tracking-widest uppercase transition-all duration-300 relative overflow-hidden group ${
          isAnalyzing 
            ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700' 
            : credits > 0 
              ? 'bg-cyber-cyan/10 border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-black shadow-[0_0_20px_rgba(0,243,255,0.15)] hover:shadow-[0_0_30px_rgba(0,243,255,0.4)]'
              : 'bg-red-900/20 border border-red-800 text-red-500 cursor-not-allowed'
        }`}
      >
        {isAnalyzing ? (
          <span className="flex items-center justify-center gap-2">
            <BarChart2 className="animate-bounce w-4 h-4" /> Processing...
          </span>
        ) : credits > 0 ? (
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" /> Initiate Scan
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" /> Insufficient Credits
          </span>
        )}
      </button>

    </div>
  );
};

export default Sidebar;
