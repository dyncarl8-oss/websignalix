import React, { useEffect, useState } from 'react';
import { Activity, ArrowRight, Brain, Zap, Shield, Terminal as TerminalIcon, ChevronRight } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#030304] text-white overflow-hidden font-sans selection:bg-cyan-500/30 relative">
      
      {/* Background Gradients & Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         {/* Subtle Grid */}
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
         
         {/* Ambient Glows */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] opacity-40"></div>
         <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-600/5 rounded-full blur-[120px] opacity-30"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 20 ? 'bg-[#030304]/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
               <Activity className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Signalix<span className="text-cyan-500">AI</span></span>
          </div>
          
          <div className="flex items-center gap-6">
            <button onClick={onLogin} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Log in</button>
            <button 
              onClick={onGetStarted}
              className="px-5 py-2 rounded-full bg-white text-black font-bold text-sm hover:bg-gray-200 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-48 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-mono font-medium text-gray-300 tracking-wide">SYSTEM OPERATIONAL v2.5</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 text-white leading-[1.1]">
            Trade Smarter.
          </h1>
          
          <p className="text-xl text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed font-medium">
             The world's first trading terminal that shows you its thought process. 
             <span className="text-white"> See beyond the charts.</span>
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            <button 
              onClick={onGetStarted}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 group transform hover:scale-105"
            >
              Start AI Analysis <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Terminal Preview */}
      <section className="relative z-10 py-12 px-6">
        <div className="max-w-5xl mx-auto relative">
           {/* Glow behind terminal */}
           <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur-lg opacity-20"></div>
           
           <div className="relative rounded-xl overflow-hidden border border-gray-800 bg-[#0a0a0f] shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              
              {/* Terminal Header */}
              <div className="h-10 bg-[#15151a] flex items-center px-4 justify-between border-b border-gray-800">
                 <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                 </div>
                 <div className="text-xs font-mono text-gray-500 flex items-center gap-1.5">
                    <TerminalIcon className="w-3 h-3" /> signalix_core --preview
                 </div>
                 <div className="w-10"></div> {/* Spacer for alignment */}
              </div>

              {/* Terminal Content */}
              <div className="p-6 md:p-8 font-mono text-sm md:text-base grid md:grid-cols-12 gap-8 bg-black/50 backdrop-blur-sm">
                 
                 {/* Left Panel: Logs */}
                 <div className="md:col-span-7 space-y-3">
                    <div className="flex gap-3">
                       <span className="text-gray-500 shrink-0">10:42:01</span>
                       <span className="text-green-400">CONNECTING_TO_FEED</span>
                       <span className="text-gray-400">... OK</span>
                    </div>
                    <div className="flex gap-3">
                       <span className="text-gray-500 shrink-0">10:42:02</span>
                       <span className="text-blue-400">FETCHING_OHLC</span>
                       <span className="text-white">symbol="BTC/USD" timeframe="4h"</span>
                    </div>
                    <div className="flex gap-3">
                       <span className="text-gray-500 shrink-0">10:42:03</span>
                       <span className="text-purple-400">NEURAL_ENGINE</span>
                       <span className="text-gray-300">Analyzing RSI(14) divergence...</span>
                    </div>
                    <div className="flex gap-3">
                       <span className="text-gray-500 shrink-0">10:42:04</span>
                       <span className="text-purple-400">NEURAL_ENGINE</span>
                       <span className="text-gray-300">Detecting support zone at $64,200...</span>
                    </div>
                    <div className="flex gap-3 mt-4 pl-4 border-l-2 border-cyan-500/30">
                       <span className="text-cyan-400 typing-cursor">{">"} GENERATING STRATEGY...</span>
                    </div>
                 </div>

                 {/* Right Panel: Result */}
                 <div className="md:col-span-5 bg-[#121218] rounded-lg border border-gray-800 p-5 flex flex-col justify-between h-full">
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Live Verdict</div>
                      <div className="text-3xl font-bold text-green-400 mb-4 flex items-center gap-2">
                        <ArrowRight className="-rotate-45 w-6 h-6" /> BULLISH
                      </div>
                      <div className="space-y-2">
                         <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Confidence</span>
                            <span className="text-white font-bold">94%</span>
                         </div>
                         <div className="w-full bg-gray-800 rounded-full h-1.5">
                            <div className="bg-green-500 h-1.5 rounded-full w-[94%] shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                         </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-800">
                       <div className="flex justify-between items-center text-xs text-gray-400">
                          <span>Target: <span className="text-green-400">$68,500</span></span>
                          <span>Stop: <span className="text-red-400">$63,800</span></span>
                       </div>
                    </div>
                 </div>

              </div>
           </div>
        </div>
      </section>

      {/* Minimal Feature Grid */}
      <section className="relative z-10 py-24 px-6 border-t border-white/5 bg-[#050508]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
           <FeatureCard 
             icon={<Brain className="w-6 h-6 text-purple-400" />}
             title="Glass Box AI"
             desc="No more black boxes. Watch the AI reason through market structure, liquidity, and momentum in real-time."
           />
           <FeatureCard 
             icon={<Zap className="w-6 h-6 text-yellow-400" />}
             title="Instant Execution"
             desc="Live data feeds meet instant neural processing. Get institutional-grade analysis in seconds, not hours."
           />
           <FeatureCard 
             icon={<Shield className="w-6 h-6 text-cyan-400" />}
             title="Risk First"
             desc="Every analysis comes with precise invalidation levels and position sizing recommendations."
           />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
           
           <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gray-800 flex items-center justify-center">
                 <Activity className="text-cyan-500 w-3 h-3" />
              </div>
              <span className="font-semibold text-sm text-gray-300">
                 &copy; 2026 SignalixAI. All rights reserved. <span className="text-gray-600 mx-2">|</span> Trading involves risk.
              </span>
           </div>
           
           <div className="flex items-center gap-6">
              <button className="text-xs font-medium text-gray-500 hover:text-white transition-colors">Terms</button>
              <button className="text-xs font-medium text-gray-500 hover:text-white transition-colors">Privacy</button>
              <button className="text-xs font-medium text-gray-500 hover:text-white transition-colors">Risk</button>
           </div>

        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300">
     <div className="mb-4 p-3 rounded-lg bg-black border border-gray-800 w-fit group-hover:scale-110 transition-transform duration-300">
        {icon}
     </div>
     <h3 className="text-lg font-bold mb-3 text-white flex items-center gap-2">
       {title} <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-gray-500" />
     </h3>
     <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;