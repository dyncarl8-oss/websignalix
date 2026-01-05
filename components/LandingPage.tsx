import React, { useEffect, useState } from 'react';
import { Activity, ArrowRight, Terminal, Cpu, Shield, Zap, Code2, Globe, Lock, ChevronRight } from 'lucide-react';

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
    <div className="min-h-screen bg-cyber-black text-gray-300 font-sans selection:bg-cyber-cyan selection:text-black overflow-hidden relative">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 cyber-grid opacity-40"></div>
         <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-cyber-cyan/5 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-purple-900/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrollY > 20 ? 'bg-cyber-black/90 backdrop-blur-md border-cyber-border' : 'bg-transparent border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center border border-cyber-cyan/30 rounded bg-cyber-cyan/5">
               <Activity className="text-cyber-cyan w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-wider text-white font-mono">SIGNALIX<span className="text-cyber-cyan">_AI</span></span>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-6 text-xs font-mono text-gray-500">
               <span className="hover:text-cyber-cyan cursor-pointer transition-colors">PROTOCOL</span>
               <span className="hover:text-cyber-cyan cursor-pointer transition-colors">INTELLIGENCE</span>
               <span className="hover:text-cyber-cyan cursor-pointer transition-colors">ACCESS</span>
            </div>
            <div className="flex items-center gap-4">
               <button onClick={onLogin} className="text-xs font-mono font-bold text-gray-400 hover:text-white transition-colors uppercase">
                 [ Login ]
               </button>
               <button 
                 onClick={onGetStarted}
                 className="px-4 py-2 bg-cyber-cyan hover:bg-cyan-400 text-black font-bold text-xs font-mono uppercase tracking-wider transition-all hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] clip-path-polygon"
               >
                 Initialize >
               </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Copy */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-cyber-cyan/30 rounded-full bg-cyber-cyan/5">
               <div className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse"></div>
               <span className="text-[10px] font-mono text-cyber-cyan tracking-widest uppercase">System Online v2.4.0</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white">
              SEE BEYOND <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-white to-cyber-magenta text-glow">CHARTS.</span>
            </h1>
            
            <p className="text-lg text-gray-400 max-w-lg leading-relaxed font-light">
              <span className="text-cyber-cyan font-mono">>_</span> Decrypt market noise. Real-time neural analysis for the modern trader. We process the data; you execute the trade.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={onGetStarted}
                className="px-8 py-4 bg-white text-black font-bold text-sm font-mono uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group"
              >
                Start Terminal <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="px-8 py-4 border border-gray-800 text-gray-400 font-mono text-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer hover:border-cyber-cyan/50 hover:text-cyber-cyan transition-colors">
                <Code2 className="w-4 h-4" /> View API Docs
              </div>
            </div>
          </div>

          {/* Right: Terminal Visual */}
          <div className="relative">
             <div className="absolute -inset-1 bg-gradient-to-r from-cyber-cyan to-purple-600 rounded-lg blur opacity-30"></div>
             <div className="relative bg-[#0a0a0f] border border-gray-800 rounded-lg overflow-hidden shadow-2xl">
                {/* Terminal Header */}
                <div className="h-8 bg-[#15151a] border-b border-gray-800 flex items-center justify-between px-4">
                   <span className="text-[10px] font-mono text-gray-500">root@signalix:~</span>
                   <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                   </div>
                </div>
                {/* Terminal Body */}
                <div className="p-6 font-mono text-xs h-[320px] overflow-hidden relative">
                   <div className="scanlines"></div>
                   <div className="space-y-2">
                      <div className="flex gap-2">
                         <span className="text-green-500">➜</span>
                         <span className="text-cyan-300">initialize_neural_engine --target=BTC-USD</span>
                      </div>
                      <div className="text-gray-500 pl-4">Loading modules... [OK]</div>
                      <div className="text-gray-500 pl-4">Connecting to exchange stream... [OK]</div>
                      
                      <div className="text-gray-400 pt-2">
                         <span className="text-purple-500">[ANALYSIS]</span> Fetching OHLCV data (1h timeframe)...
                      </div>
                      <div className="text-gray-400">
                         <span className="text-purple-500">[COMPUTE]</span> RSI(14): 32.5 <span className="text-green-500">[OVERSOLD]</span>
                      </div>
                      <div className="text-gray-400">
                         <span className="text-purple-500">[COMPUTE]</span> MACD: Bullish Divergence detected
                      </div>
                      <div className="text-gray-400">
                         <span className="text-purple-500">[AI_CORE]</span> Thinking...
                      </div>
                      
                      <div className="mt-4 p-3 bg-white/5 border-l-2 border-cyber-cyan">
                         <div className="text-cyber-cyan font-bold mb-1">VERDICT: ACCUMULATE</div>
                         <div className="text-gray-400 leading-relaxed opacity-80">
                            Market structure indicates a strong reversal zone. Volume profile supports upward momentum. Probability: 87%.
                         </div>
                      </div>

                      <div className="flex gap-2 pt-2 animate-pulse">
                         <span className="text-green-500">➜</span>
                         <span className="text-gray-500">awaiting_next_command<span className="text-white animate-blink">_</span></span>
                      </div>
                   </div>
                </div>
             </div>
             
             {/* Decorative Elements around Terminal */}
             <div className="absolute -right-12 top-10 text-cyber-dim text-[10px] font-mono vertical-text hidden lg:block">
                SYSTEM_STATUS::OPTIMAL
             </div>
          </div>

        </div>
      </section>

      {/* Ticker Section */}
      <div className="border-y border-gray-800 bg-[#0a0a0f] py-3 overflow-hidden">
         <div className="flex gap-12 animate-scan whitespace-nowrap w-max" style={{ animationDuration: '20s', animationDirection: 'reverse' }}>
            {[1,2,3,4,5].map(i => (
               <React.Fragment key={i}>
                  <span className="text-xs font-mono text-gray-500 flex items-center gap-2">
                     <span className="text-cyber-cyan">BTC/USD</span> <span className="text-green-500">LONG [92%]</span>
                  </span>
                  <span className="text-xs font-mono text-gray-500 flex items-center gap-2">
                     <span className="text-cyber-magenta">ETH/USD</span> <span className="text-gray-400">NEUTRAL [45%]</span>
                  </span>
                  <span className="text-xs font-mono text-gray-500 flex items-center gap-2">
                     <span className="text-blue-400">SOL/USD</span> <span className="text-red-500">SHORT [88%]</span>
                  </span>
                  <span className="text-xs font-mono text-gray-500 flex items-center gap-2">
                     <span className="text-yellow-400">XRP/USD</span> <span className="text-green-500">LONG [94%]</span>
                  </span>
               </React.Fragment>
            ))}
         </div>
      </div>

      {/* System Architecture Section */}
      <section className="py-24 px-6 relative">
         <div className="max-w-7xl mx-auto">
            <div className="mb-16">
               <h2 className="text-xs font-mono text-cyber-cyan tracking-widest uppercase mb-4">Architecture</h2>
               <h3 className="text-4xl font-bold text-white mb-2">HOW IT WORKS</h3>
               <p className="text-gray-400 max-w-xl">A transparent pipeline from chaos to clarity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
               {/* Connecting Line (Desktop) */}
               <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-gray-800 via-cyber-cyan/50 to-gray-800 border-t border-dashed border-gray-700 z-0"></div>

               <ArchitectureCard 
                  step="01"
                  title="Ingestion"
                  desc="Real-time OHLCV data stream aggregation from top-tier exchanges."
                  icon={<Globe className="w-5 h-5 text-gray-300" />}
               />
               <ArchitectureCard 
                  step="02"
                  title="Processing"
                  desc="30+ technical indicators computed instantly. Pattern recognition matrix applied."
                  icon={<Cpu className="w-5 h-5 text-cyber-cyan" />}
                  active
               />
               <ArchitectureCard 
                  step="03"
                  title="Synthesis"
                  desc="Generative AI (Gemini Pro) interprets data to formulate a strategic verdict."
                  icon={<Terminal className="w-5 h-5 text-gray-300" />}
               />
            </div>
         </div>
      </section>

      {/* Features / Modules Section */}
      <section className="py-24 px-6 bg-[#08080c] border-t border-gray-900">
        <div className="max-w-7xl mx-auto">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                 <h2 className="text-xs font-mono text-cyber-magenta tracking-widest uppercase mb-4">System Modules</h2>
                 <h3 className="text-4xl font-bold text-white mb-6">INTELLIGENCE <br/> UNLOCKED.</h3>
                 <p className="text-gray-400 mb-8 leading-relaxed">
                    Stop guessing. SignalixAI replaces intuition with raw computational power. 
                    Our neural engine doesn't just give you a signal; it explains the 
                    <span className="text-white"> why</span> behind every move.
                 </p>
                 <ul className="space-y-4">
                    <FeatureListItem text="Transparent reasoning logs" />
                    <FeatureListItem text="Institutional-grade risk management" />
                    <FeatureListItem text="Multi-timeframe analysis (Scalp to Swing)" />
                    <FeatureListItem text="Pro-active trend reversal detection" />
                 </ul>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <ModuleCard 
                    icon={<Terminal className="w-6 h-6 text-cyber-cyan" />}
                    title="Command Center"
                    desc="A unified terminal interface for all your market analysis needs."
                 />
                 <ModuleCard 
                    icon={<Zap className="w-6 h-6 text-yellow-400" />}
                    title="Instant Execution"
                    desc="Zero latency signal generation based on live price action."
                 />
                 <ModuleCard 
                    icon={<Shield className="w-6 h-6 text-green-400" />}
                    title="Risk Protocol"
                    desc="Dynamic stop-loss and take-profit zones calculated automatically."
                 />
                 <ModuleCard 
                    icon={<Lock className="w-6 h-6 text-purple-400" />}
                    title="Secure Core"
                    desc="Enterprise-grade encryption and privacy-first architecture."
                 />
              </div>
           </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-24 px-6 relative border-t border-gray-900 bg-[#050508] overflow-hidden">
         <div className="absolute inset-0 cyber-grid opacity-20"></div>
         
         <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter">
               TRADE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-blue-600">SMARTER.</span>
            </h2>
            <p className="text-gray-500 font-mono mb-10 text-sm">
               // JOIN THE ELITE TRADERS USING SIGNALIX_AI
            </p>
            <button 
               onClick={onGetStarted}
               className="px-10 py-5 bg-white text-black font-bold font-mono text-sm uppercase tracking-widest hover:bg-cyber-cyan transition-colors shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(0,243,255,0.3)]"
            >
               Create Free Account
            </button>

            <div className="mt-24 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600 font-mono uppercase tracking-wider border-t border-gray-900 pt-8">
               <div>© 2026 SIGNALIX_AI SYSTEMS</div>
               <div className="flex gap-6 mt-4 md:mt-0">
                  <span className="hover:text-cyber-cyan cursor-pointer">Terms</span>
                  <span className="hover:text-cyber-cyan cursor-pointer">Privacy</span>
                  <span className="hover:text-cyber-cyan cursor-pointer">Status</span>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
};

const ArchitectureCard = ({ step, title, desc, icon, active }: { step: string, title: string, desc: string, icon: React.ReactNode, active?: boolean }) => (
   <div className={`relative z-10 bg-[#0a0a0f] p-6 rounded-lg border ${active ? 'border-cyber-cyan shadow-[0_0_20px_rgba(0,243,255,0.15)]' : 'border-gray-800'} transition-all hover:border-gray-600 group`}>
      <div className="flex justify-between items-start mb-4">
         <div className={`p-3 rounded bg-white/5 ${active ? 'text-cyber-cyan' : 'text-gray-400'}`}>
            {icon}
         </div>
         <span className="text-4xl font-black text-gray-800 group-hover:text-gray-700 transition-colors">{step}</span>
      </div>
      <h4 className={`text-lg font-bold mb-2 ${active ? 'text-white' : 'text-gray-300'}`}>{title}</h4>
      <p className="text-xs text-gray-500 font-mono leading-relaxed">{desc}</p>
   </div>
);

const FeatureListItem = ({ text }: { text: string }) => (
   <li className="flex items-center gap-3 text-gray-400 text-sm">
      <div className="w-1.5 h-1.5 bg-cyber-cyan rounded-full"></div>
      {text}
   </li>
);

const ModuleCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
   <div className="p-6 bg-white/5 border border-white/5 hover:border-white/10 transition-colors hover:bg-white/10 cursor-default">
      <div className="mb-4">{icon}</div>
      <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">{title}</h4>
      <p className="text-xs text-gray-500 font-mono leading-relaxed">{desc}</p>
   </div>
);

export default LandingPage;