import React, { useEffect, useState } from 'react';
import { Activity, ArrowRight, Brain, Zap, Shield, Cpu, Lock, Globe } from 'lucide-react';

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
    <div className="min-h-screen bg-[#050508] text-white overflow-hidden font-sans selection:bg-cyan-500/30">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
         <div className="absolute top-[-20%] left-0 w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[150px] animate-pulse-fast"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[150px]"></div>
         <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_4px,4px_100%] opacity-20"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrollY > 50 ? 'bg-[#050508]/80 backdrop-blur-md border-gray-800' : 'bg-transparent border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
               <Activity className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Signalix<span className="text-cyan-400">AI</span></span>
          </div>
          
          <div className="flex items-center gap-6">
            <button onClick={onLogin} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Log In</button>
            <button 
              onClick={onGetStarted}
              className="px-5 py-2 rounded-full bg-white text-black font-bold text-sm hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Start Trading
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900/50 border border-gray-700 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">System Online v2.4</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-200 to-gray-600 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            DECODE THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 neon-text-cyan">MARKET MATRIX</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            The world's first trading terminal that shows you its thought process. 
            Powered by <span className="text-white font-bold">Gemini Pro</span>, seeing beyond the charts with institutional-grade reasoning.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
            <button 
              onClick={onGetStarted}
              className="px-8 py-4 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-lg hover:brightness-110 transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)] flex items-center gap-2 group"
            >
              Launch Terminal <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-300 font-bold hover:bg-gray-800 transition-colors">
              View Live Demo
            </button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
           <FeatureCard 
             icon={<Brain className="w-8 h-8 text-purple-400" />}
             title="Transparent Thinking"
             desc="Don't trust black boxes. SignalixAI streams its internal monologue, showing you exactly how it reached a verdict."
           />
           <FeatureCard 
             icon={<Zap className="w-8 h-8 text-yellow-400" />}
             title="Real-Time Execution"
             desc="Live CryptoCompare data feeds combined with instant technical analysis across 30+ indicators."
           />
           <FeatureCard 
             icon={<Shield className="w-8 h-8 text-cyan-400" />}
             title="Risk Management"
             desc="Every analysis includes specific entry, exit, and stop-loss zones calculated for the current volatility regime."
           />
        </div>
      </section>

      {/* Interface Preview (Visual only) */}
      <section className="relative z-10 py-20 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto relative group">
           <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent z-10"></div>
           <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
           <div className="relative bg-[#0b0b10] border border-gray-800 rounded-xl overflow-hidden shadow-2xl transform group-hover:scale-[1.01] transition-transform duration-700">
              {/* Fake Terminal Header */}
              <div className="h-8 bg-[#1a1a20] flex items-center px-4 gap-2 border-b border-gray-800">
                 <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                 <div className="ml-4 h-4 w-32 bg-gray-800 rounded"></div>
              </div>
              {/* Fake Content Area */}
              <div className="p-8 grid grid-cols-12 gap-6 min-h-[400px]">
                 <div className="col-span-3 space-y-3">
                    <div className="h-10 w-full bg-gray-900 rounded border border-gray-800/50"></div>
                    <div className="h-10 w-full bg-gray-900 rounded border border-gray-800/50"></div>
                    <div className="h-10 w-full bg-gray-900 rounded border border-gray-800/50"></div>
                 </div>
                 <div className="col-span-9 space-y-4">
                    <div className="flex gap-4">
                       <div className="h-24 w-1/3 bg-gray-900/50 rounded border border-gray-800/30"></div>
                       <div className="h-24 w-1/3 bg-gray-900/50 rounded border border-gray-800/30"></div>
                       <div className="h-24 w-1/3 bg-gray-900/50 rounded border border-gray-800/30"></div>
                    </div>
                    <div className="h-64 w-full bg-[#050508] rounded border border-gray-800/50 p-4 font-mono text-xs text-green-500">
                       <span className="text-purple-400">{">"} Initializing Neural Network...</span><br/>
                       <span className="text-gray-500">{">"} Connecting to WebSocket feed... OK</span><br/>
                       <span className="text-gray-500">{">"} Fetching OHLC data for BTC/USD... OK</span><br/>
                       <span className="text-cyan-400">{">"} DETECTED: Bullish divergence on RSI(14)</span><br/>
                       <span className="text-gray-300 typing-cursor">_</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-900 py-12 bg-[#020204] relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
           <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="text-cyan-500 w-5 h-5" />
                <span className="font-bold text-lg text-white">SignalixAI</span>
              </div>
              <p className="text-gray-500 text-sm max-w-sm">
                 Advanced market intelligence for the modern trader. 
                 Data provided by CryptoCompare. Intelligence provided by Gemini.
              </p>
           </div>
           <div>
              <h4 className="font-bold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                 <li><button className="hover:text-cyan-400">Terminal</button></li>
                 <li><button className="hover:text-cyan-400">Pricing</button></li>
                 <li><button className="hover:text-cyan-400">API Access</button></li>
              </ul>
           </div>
           <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                 <li><button className="hover:text-cyan-400">Terms of Service</button></li>
                 <li><button className="hover:text-cyan-400">Privacy Policy</button></li>
                 <li><button className="hover:text-cyan-400">Risk Disclosure</button></li>
              </ul>
           </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-900 text-center text-xs text-gray-600">
           &copy; 2024 SignalixAI. All rights reserved. Trading involves risk.
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm group">
     <div className="w-12 h-12 rounded-lg bg-black/50 border border-gray-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
     </div>
     <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
     <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
  </div>
);

export default LandingPage;