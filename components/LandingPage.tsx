import React, { useEffect, useState } from 'react';
import { Activity, ArrowRight, Brain, Zap, Shield } from 'lucide-react';

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
      <div className="fixed inset-0 z-0 pointer-events-none">
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
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-48 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 leading-[0.95] text-white">
            Trade Smarter. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">The AI Advantage.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 max-w-xl mx-auto mb-10 leading-snug font-medium">
             Instant analysis. Transparent reasoning. <br/>Professional grade.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
            <button 
              onClick={onGetStarted}
              className="px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)] flex items-center gap-2 group"
            >
              Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
           <FeatureCard 
             icon={<Brain className="w-6 h-6 text-purple-400" />}
             title="Transparent Logic"
             desc="See exactly how the AI thinks. No black boxes."
           />
           <FeatureCard 
             icon={<Zap className="w-6 h-6 text-yellow-400" />}
             title="Instant Data"
             desc="Live technical analysis across 30+ market indicators."
           />
           <FeatureCard 
             icon={<Shield className="w-6 h-6 text-cyan-400" />}
             title="Risk First"
             desc="Smart entry, exit, and stop-loss zones calculated instantly."
           />
        </div>
      </section>

      {/* Interface Preview (Visual only) */}
      <section className="relative z-10 py-10 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto relative group">
           <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent z-10"></div>
           <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-xl blur-lg opacity-40"></div>
           <div className="relative bg-[#0b0b10] border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
              {/* Fake Terminal Header */}
              <div className="h-10 bg-[#15151a] flex items-center px-4 gap-2 border-b border-gray-800">
                 <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                 </div>
              </div>
              {/* Fake Content Area */}
              <div className="p-8 grid grid-cols-12 gap-6 min-h-[300px] opacity-80">
                 <div className="col-span-4 space-y-3">
                    <div className="h-8 w-full bg-gray-900 rounded"></div>
                    <div className="h-8 w-3/4 bg-gray-900 rounded"></div>
                    <div className="h-32 w-full bg-gray-900/50 rounded mt-4 border border-gray-800"></div>
                 </div>
                 <div className="col-span-8 space-y-4">
                    <div className="h-16 w-full bg-gray-900/30 rounded border border-gray-800 flex items-center p-4 gap-4">
                       <div className="w-10 h-10 rounded bg-cyan-900/20"></div>
                       <div className="h-2 w-32 bg-gray-800 rounded"></div>
                    </div>
                    <div className="h-48 w-full bg-[#050508] rounded border border-gray-800 p-4 font-mono text-xs text-green-500">
                       <span className="text-purple-400">{">"} Analyzing market structure...</span><br/>
                       <span className="text-gray-500">{">"} Trend Strength: STRONG (ADX 42)</span><br/>
                       <span className="text-cyan-400">{">"} Verdict: LONG OPPORTUNITY</span><br/>
                       <span className="text-gray-300 typing-cursor">_</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-900 py-12 bg-[#020204] relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
           
           <div className="flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-2">
                <Activity className="text-cyan-500 w-5 h-5" />
                <span className="font-bold text-lg text-white">SignalixAI</span>
              </div>
              <p className="text-gray-600 text-xs">
                 &copy; 2026 SignalixAI. All rights reserved. <br/> Trading involves risk.
              </p>
           </div>
           
           <div className="flex items-center gap-8">
              <button className="text-sm text-gray-500 hover:text-white transition-colors">Terms</button>
              <button className="text-sm text-gray-500 hover:text-white transition-colors">Privacy</button>
              <button className="text-sm text-gray-500 hover:text-white transition-colors">Risk</button>
           </div>

        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors backdrop-blur-sm">
     <div className="mb-4">
        {icon}
     </div>
     <h3 className="text-lg font-bold mb-2 text-white">{title}</h3>
     <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
  </div>
);

export default LandingPage;