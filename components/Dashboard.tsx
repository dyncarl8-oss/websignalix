import React, { useState, useRef, useEffect } from 'react';
import { Activity, Coins, RefreshCw, Zap, LogOut, User, ChevronDown, Crown, CreditCard } from 'lucide-react';
import { CryptoPair, FeedItem, AggregationResult, UserProfile } from '../types';
import { COST_PER_ANALYSIS } from '../constants';
import { fetchOHLCData } from '../services/cryptoService';
import { computeIndicators } from '../services/indicatorService';
import { analyzeMarket } from '../services/geminiService';
import { userService } from '../services/userService';

// Components
import VerdictCard from './VerdictCard';
import PricingModal from './PricingModal';
import SubscriptionModal from './SubscriptionModal'; // Import the new modal
import { PairSelector, TimeframeSelector } from './SelectionUI';
import { DataCollectionStep, TechnicalStep, AggregationStep, AIAnalysisStep } from './AnalysisSteps';

interface DashboardProps {
  user: UserProfile;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  // Initialize credits from the user profile passed in
  const [credits, setCredits] = useState<number>(user.credits);
  
  const [sessionState, setSessionState] = useState<'pair-select' | 'timeframe-select' | 'analyzing' | 'complete'>('pair-select');
  const [selectedPair, setSelectedPair] = useState<CryptoPair | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string | null>(null);
  const [showPricing, setShowPricing] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false); // State for sub modal
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Sync credits to persistent storage whenever they change (Only if not Pro)
  useEffect(() => {
    if (!user.isPro) {
      userService.updateCredits(user.email, credits);
    }
  }, [credits, user.email, user.isPro]);

  // Aggressive auto-scroll on feed update
  useEffect(() => {
    scrollToBottom();
  }, [feed, sessionState]);

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Initial greeting
  useEffect(() => {
    if (feed.length === 0) {
      addFeedItem('system-message', {
        text: `Welcome back, ${user.name.split(' ')[0]}. SignalixAI is ready to decode the market. Select a pair to begin.`
      });
    }
  }, []);

  const addFeedItem = (type: FeedItem['type'], data: any = {}, status: FeedItem['status'] = 'complete') => {
    const id = Math.random().toString(36).substr(2, 9);
    setFeed(prev => [...prev, { id, type, data, status, timestamp: Date.now() }]);
    return id;
  };

  const updateFeedItem = (id: string, updates: Partial<FeedItem>) => {
    setFeed(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const resetSession = () => {
    setSessionState('pair-select');
    setSelectedPair(null);
    setSelectedTimeframe(null);
    setFeed([]);
    addFeedItem('system-message', {
      text: "New session started. Select a trading pair."
    });
  };

  const handlePairSelect = (pair: CryptoPair) => {
    setSelectedPair(pair);
    addFeedItem('user-selection', { text: `${pair.symbol} selected` });
    addFeedItem('system-message', { text: "Great choice. Now select your trading timeframe." });
    setSessionState('timeframe-select');
  };

  const handleTimeframeSelect = (tf: string) => {
    setSelectedTimeframe(tf);
    addFeedItem('user-selection', { text: `${tf} timeframe` });
    setSessionState('analyzing');
    runAnalysis(selectedPair!, tf);
  };

  // Helper for consistent delays
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const runAnalysis = async (pair: CryptoPair, tf: string) => {
    // Pro users bypass credit check
    if (!user.isPro && credits < COST_PER_ANALYSIS) {
      setShowPricing(true);
      setSessionState('pair-select');
      return;
    }

    // 1. Data Collection
    const step1Id = addFeedItem('step-data', { pair: pair.symbol }, 'loading');
    
    try {
      const startTime = Date.now();
      
      // Delay: Data Fetching (2.5 seconds)
      await wait(2500);
      
      const ohlc = await fetchOHLCData(pair.base, pair.quote, tf);
      const dataDuration = (Date.now() - startTime) / 1000;
      
      updateFeedItem(step1Id, { 
        status: 'complete', 
        data: { pair: pair.symbol, rawData: ohlc, duration: dataDuration } 
      });
      setTimeout(scrollToBottom, 100);

      // --- TRANSITION DELAY 1 ---
      // Smooth pause before next step appears
      await wait(1500);

      // 2. Technical Analysis
      const step2Id = addFeedItem('step-technical', {}, 'loading');
      setTimeout(scrollToBottom, 200);

      // Delay: Calculating Indicators (3.5 seconds)
      await wait(3500); 
      
      const techStartTime = Date.now();
      const indicators = computeIndicators(ohlc);
      const techDuration = (Date.now() - techStartTime) / 1000;

      updateFeedItem(step2Id, { 
        status: 'complete', 
        data: { indicators, duration: techDuration } 
      });
      setTimeout(scrollToBottom, 100);

      // --- TRANSITION DELAY 2 ---
      await wait(1500);

      // 3. Signal Aggregation
      const step3Id = addFeedItem('step-aggregation', {}, 'loading');
      setTimeout(scrollToBottom, 200);

      // Delay: Weighing Signals (3 seconds)
      await wait(3000); 
      
      // Calculate aggregation locally
      let up = 0, down = 0, neutral = 0;
      let upScore = 0, downScore = 0;
      
      const checkSignal = (sig: string, strength: number) => {
        if (sig === 'UP') { up++; upScore += strength; }
        else if (sig === 'DOWN') { down++; downScore += strength; }
        else neutral++;
      };

      checkSignal(indicators.rsi.signal, indicators.rsi.strength);
      checkSignal(indicators.stochastic.signal, indicators.stochastic.strength);
      checkSignal(indicators.macd.signal, indicators.macd.strength);
      checkSignal(indicators.trendSignal.signal, indicators.trendSignal.strength);
      checkSignal(indicators.momentum.signal, indicators.momentum.strength);
      checkSignal(indicators.bollinger.signal, indicators.bollinger.strength);
      checkSignal(indicators.volumeTrend.signal, indicators.volumeTrend.strength);

      const totalSignals = up + down + neutral;
      const alignment = (Math.max(up, down) / totalSignals) * 100;
      const regime = Number(indicators.adx.value) > 25 ? 'TRENDING' : indicators.bollinger.width > 3 ? 'VOLATILE' : 'RANGING';

      const aggResults: AggregationResult = {
        upCount: up,
        downCount: down,
        neutralCount: neutral,
        upScore,
        downScore,
        alignment,
        marketRegime: regime as any
      };

      updateFeedItem(step3Id, {
        status: 'complete',
        data: { results: aggResults, duration: 0.5 }
      });
      setTimeout(scrollToBottom, 100);

      // --- TRANSITION DELAY 3 ---
      await wait(1500);

      // 4. AI Deep Analysis
      const step4Id = addFeedItem('step-ai', {}, 'loading');
      setTimeout(scrollToBottom, 200);
      
      const aiStartTime = Date.now();
      const analysis = await analyzeMarket(pair.name, tf, ohlc, indicators);
      const aiDuration = (Date.now() - aiStartTime) / 1000;

      // Simulate streaming thought process
      // SLOWED DOWN SIGNIFICANTLY for "Thoughtful" effect
      const fullThought = analysis.thoughtProcess || analysis.summary;
      let currentText = "";
      const chars = fullThought.split('');
      
      // Reduced chunk size and increased delay for smoother, slower typing
      const chunkSize = 2; 
      
      for (let i = 0; i < chars.length; i += chunkSize) {
        currentText += chars.slice(i, i + chunkSize).join('');
        updateFeedItem(step4Id, {
          data: { partialThought: currentText }
        });
        
        if (i % 10 === 0) scrollToBottom();
        
        // Random delay between 20ms and 50ms per small chunk
        const delay = 20 + Math.random() * 30;
        await wait(delay);
      }

      // Add a small pause after thinking finishes before marking complete
      await wait(800);

      updateFeedItem(step4Id, {
        status: 'complete',
        data: { result: analysis, duration: aiDuration }
      });
      setTimeout(scrollToBottom, 100);

      // CHECK VERDICT
      if (analysis.verdict === 'NEUTRAL') {
        await wait(1000);
        addFeedItem('system-message', { 
          text: `Analysis Inconclusive: Market conditions are completely flat. No actionable signal detected.` 
        });
        setSessionState('complete');
        setTimeout(scrollToBottom, 100);
      } else {
        // Only deduct credits if NOT Pro
        if (!user.isPro) {
          setCredits(prev => prev - COST_PER_ANALYSIS);
        }

        // --- FINAL VERDICT TRANSITION ---
        
        // 1. Show "Generating..." message
        await wait(500);
        addFeedItem('system-message', { 
          text: "Synthesizing data points. Generating final verdict strategy..." 
        });
        scrollToBottom();

        // 2. Wait for the user to read it (Believable delay)
        await wait(2500); 
        
        // 3. Show Result
        addFeedItem('step-verdict', { result: analysis });
        setSessionState('complete');
        setTimeout(scrollToBottom, 100);
      }

    } catch (error: any) {
      console.error(error);
      updateFeedItem(step1Id, { status: 'error', data: { error: error.message } });
      addFeedItem('system-message', { text: `Analysis failed: ${error.message}.` });
      setSessionState('pair-select');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#050508] text-gray-200 font-sans selection:bg-purple-500/30 selection:text-white overflow-hidden">
      
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-gray-900 bg-[#050508] relative z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.3)]">
            <Activity className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">Signalix<span className="text-purple-500">AI</span></span>
        </div>

        <div className="flex items-center gap-4">
           {user.isPro ? (
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-900/40 to-yellow-600/10 border border-yellow-700/50">
               <Crown className="w-4 h-4 text-yellow-500" />
               <span className="text-xs font-mono font-bold text-yellow-500">PRO MEMBER</span>
             </div>
           ) : (
             <button 
               onClick={() => setShowPricing(true)}
               className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900 border border-gray-800 hover:border-purple-500/50 transition-colors"
             >
               <Coins className="w-4 h-4 text-yellow-500" />
               <span className="text-xs font-mono font-bold hidden md:inline">{credits} credits</span>
               <span className="text-[10px] uppercase bg-purple-500 text-white px-1.5 rounded ml-1">Get Pro</span>
             </button>
           )}
           
           <div className="h-6 w-px bg-gray-800 mx-1"></div>

           <button 
             onClick={resetSession}
             className="text-gray-500 hover:text-white transition-colors p-2"
             title="New Session"
           >
             <RefreshCw className="w-5 h-5" />
           </button>

           <div className="h-6 w-px bg-gray-800 mx-1"></div>

           {/* Profile Dropdown */}
           <div className="relative">
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 hover:bg-gray-800/50 p-1 rounded-full transition-all pr-2 border border-transparent hover:border-gray-700 focus:outline-none"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.name} className="w-8 h-8 rounded-full border border-gray-600 object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600 flex items-center justify-center">
                     <span className="text-xs font-bold text-gray-300">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                )}
                <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isProfileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)}></div>
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[#0b0b10] border border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                     <div className="p-4 border-b border-gray-800 bg-gray-900/30">
                        <p className="text-sm font-bold text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate font-mono mt-0.5">{user.email}</p>
                        {user.isPro && <p className="text-[10px] text-yellow-500 font-bold mt-1">★ PRO PLAN</p>}
                     </div>
                     <div className="p-1 space-y-1">
                       {user.isPro && (
                         <button
                           onClick={() => {
                             setIsProfileMenuOpen(false);
                             setShowSubscription(true); // Open internal modal
                           }}
                           className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors flex items-center gap-2"
                         >
                           <CreditCard className="w-4 h-4" />
                           Manage Subscription
                         </button>
                       )}
                       <button 
                         onClick={onLogout}
                         className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-900/10 hover:text-red-300 rounded-lg transition-colors flex items-center gap-2"
                       >
                         <LogOut className="w-4 h-4" />
                         Sign Out
                       </button>
                     </div>
                  </div>
                </>
              )}
           </div>
        </div>
      </header>

      {/* Main Feed Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative scroll-smooth">
        {/* Background Ambient */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-3xl mx-auto relative z-10 flex flex-col gap-6 pb-20">
          {feed.map((item) => (
            <div key={item.id} className="w-full">
              {item.type === 'system-message' && (
                <div className="flex gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
                   <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0 border border-gray-700 mt-1">
                      <span className="text-purple-500 font-bold text-xs">AI</span>
                   </div>
                   <div className="bg-gray-900/80 border border-gray-800 p-4 rounded-r-xl rounded-bl-xl text-sm text-gray-300 leading-relaxed shadow-lg">
                     {item.data.text}
                   </div>
                </div>
              )}
              {item.type === 'user-selection' && (
                <div className="flex justify-end animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="bg-purple-600 text-white px-4 py-2 rounded-l-xl rounded-br-xl text-sm font-medium shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                    {item.data.text}
                  </div>
                </div>
              )}
              {item.type === 'step-data' && (
                <DataCollectionStep status={item.status} data={item.data?.rawData} pair={item.data?.pair} duration={item.data?.duration} />
              )}
              {item.type === 'step-technical' && (
                <TechnicalStep status={item.status} indicators={item.data?.indicators} duration={item.data?.duration} />
              )}
              {item.type === 'step-aggregation' && (
                <AggregationStep status={item.status} results={item.data?.results} duration={item.data?.duration} />
              )}
              {item.type === 'step-ai' && (
                <AIAnalysisStep status={item.status} result={item.data?.result} partialThought={item.data?.partialThought} duration={item.data?.duration} />
              )}
              {item.type === 'step-verdict' && (
                <div className="mt-4 mb-8"><VerdictCard result={item.data.result} /></div>
              )}
            </div>
          ))}

          <div className="mt-4">
             {sessionState === 'pair-select' && (<PairSelector onSelect={handlePairSelect} />)}
             {sessionState === 'timeframe-select' && (<TimeframeSelector onSelect={handleTimeframeSelect} />)}
             {sessionState === 'complete' && (
               <div className="text-center animate-in fade-in duration-700 delay-500">
                 <button onClick={resetSession} className="px-8 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full text-sm font-bold text-white transition-all hover:scale-105">Analyze Another Pair</button>
               </div>
             )}
          </div>
          <div ref={bottomRef} className="h-10" />
        </div>
      </main>

      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} user={user} />
      <SubscriptionModal isOpen={showSubscription} onClose={() => setShowSubscription(false)} user={user} />
    </div>
  );
}