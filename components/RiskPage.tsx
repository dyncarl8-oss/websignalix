import React, { useEffect } from 'react';
import { ArrowLeft, AlertTriangle, Cpu, Activity, ShieldOff, Wifi } from 'lucide-react';

interface RiskPageProps {
  onBack: () => void;
}

const RiskPage: React.FC<RiskPageProps> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-cyber-black text-gray-300 font-sans selection:bg-cyber-cyan selection:text-black relative">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 cyber-grid opacity-20"></div>
         <div className="absolute top-[-20%] right-[20%] w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-24">
        
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 font-mono text-xs uppercase tracking-widest">
           <ArrowLeft className="w-4 h-4" /> Return to Terminal
        </button>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-800 pb-8 mb-12 gap-6">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-900/20 rounded-lg flex items-center justify-center border border-red-900/50">
                 <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter">RISK PROTOCOLS</h1>
                <p className="text-red-400 font-mono text-xs mt-1 uppercase tracking-wider">Mandatory User Acknowledgment</p>
              </div>
           </div>
        </div>

        {/* Primary Warning Box */}
        <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-xl mb-12 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
           <h3 className="text-sm font-bold text-red-100 mb-2 uppercase tracking-wide flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Capital at Risk
           </h3>
           <p className="text-sm text-red-200/70 leading-relaxed font-light">
              Trading financial instruments involves a high degree of risk. You may lose your entire principal amount. 
              Do not trade with funds you cannot afford to lose.
           </p>
        </div>

        {/* Grid Layout for Specifics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
           <RiskCard 
              icon={<Cpu className="w-5 h-5 text-purple-400" />}
              title="Probabilistic AI"
              text="Our Neural Engine provides statistical probabilities, not certainties. An 89% confidence score still carries an 11% failure rate. AI can hallucinate patterns in noise."
           />

           <RiskCard 
              icon={<Activity className="w-5 h-5 text-orange-400" />}
              title="Market Volatility"
              text="Crypto markets operate 24/7 with extreme variance. Flash crashes, regulatory news, or exchange outages can invalidate technical analysis in milliseconds."
           />

           <RiskCard 
              icon={<ShieldOff className="w-5 h-5 text-gray-400" />}
              title="Zero Liability"
              text="SignalixAI is an analysis tool, not a financial advisor. We accept no liability for any loss or damage, including without limitation to, any loss of profit."
           />

           <RiskCard 
              icon={<Wifi className="w-5 h-5 text-blue-400" />}
              title="Technical Latency"
              text="Real-time data feeds may experience latency. Execution prices may differ from analysis prices due to slippage, spread, or internet connectivity issues."
           />

        </div>

        <div className="mt-16 text-center border-t border-gray-900 pt-8">
           <p className="text-[10px] text-gray-600 font-mono uppercase tracking-[0.2em]">
              By using SignalixAI, you accept these risks.
           </p>
        </div>

      </div>
    </div>
  );
};

const RiskCard = ({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) => (
   <div className="bg-[#0b0b10] border border-gray-800 p-6 rounded-xl hover:border-gray-700 transition-colors group">
      <div className="flex items-center gap-3 mb-3">
         <div className="p-2 bg-gray-900 rounded-lg group-hover:bg-gray-800 transition-colors">
            {icon}
         </div>
         <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wide">{title}</h3>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed font-mono">
         {text}
      </p>
   </div>
);

export default RiskPage;