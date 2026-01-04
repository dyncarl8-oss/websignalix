import React from 'react';
import { X, Check } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-md rounded-2xl p-8 relative border border-cyber-cyan/30 shadow-[0_0_50px_rgba(0,243,255,0.1)]">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Upgrade to Pro</h2>
          <p className="text-gray-400 text-sm">Unlock the full power of the Neural Engine.</p>
        </div>

        <div className="bg-gradient-to-b from-cyber-panel to-transparent p-6 rounded-xl border border-cyber-border mb-8">
          <div className="flex justify-center items-baseline mb-4">
            <span className="text-3xl font-bold text-white">$35</span>
            <span className="text-gray-500">/month</span>
          </div>
          <ul className="space-y-3 mb-6">
            {[
              "Unlimited AI Analysis",
              "Access to Gemini Pro Thinking Mode",
              "Real-time Indicator Calculations",
              "Priority Processing Queue",
              "Forex & Crypto Support"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-5 h-5 rounded-full bg-cyber-cyan/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-cyber-cyan" />
                </div>
                {item}
              </li>
            ))}
          </ul>
          
          <a 
            href="https://polar.sh" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full py-3 bg-cyber-cyan hover:bg-cyan-400 text-black font-bold text-center rounded transition-colors shadow-[0_0_20px_rgba(0,243,255,0.3)]"
          >
            Subscribe via Polar.sh
          </a>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
