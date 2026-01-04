import React, { useState } from 'react';
import { Activity, Mail, Lock, ArrowRight, Github } from 'lucide-react';
import { userService } from '../services/userService';
import { UserProfile } from '../types';

interface AuthPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  onBack: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      let user;
      if (isLogin) {
        user = await userService.login(email, password);
      } else {
        // Pass password to register
        user = await userService.register(email, undefined, password);
      }
      // Session is handled by onAuthStateChanged in App.tsx
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const user = await userService.googleLogin();
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
       setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center relative overflow-hidden p-4">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
         <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px]"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Logo */}
        <div className="flex justify-center mb-8 cursor-pointer" onClick={onBack}>
          <div className="flex items-center gap-2">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Activity className="text-white w-6 h-6" />
             </div>
             <span className="font-bold text-2xl text-white">Signalix<span className="text-cyan-400">AI</span></span>
          </div>
        </div>

        {/* Card */}
        <div className="glass-panel p-8 rounded-2xl border border-gray-800 bg-[#0b0b10]/60 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in-95 duration-500">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
             {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-400 text-sm text-center mb-8">
             {isLogin ? 'Enter the matrix of market intelligence' : 'Start your journey with 3 free credits'}
          </p>

          <div className="space-y-4">
             <button 
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full h-12 rounded-lg bg-white text-black font-bold flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors"
             >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                {isLoading ? 'Connecting...' : 'Continue with Google'}
             </button>

             <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-800"></div>
                <span className="flex-shrink-0 mx-4 text-gray-600 text-xs uppercase">Or continue with email</span>
                <div className="flex-grow border-t border-gray-800"></div>
             </div>

             <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-900/30 border border-red-500/30 rounded text-red-400 text-xs text-center">
                    {error}
                  </div>
                )}
                
                <div>
                   <label className="block text-xs font-mono text-gray-500 mb-1 ml-1">EMAIL ADDRESS</label>
                   <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-600" />
                      <input 
                         type="email" 
                         required
                         value={email}
                         onChange={e => setEmail(e.target.value)}
                         className="w-full h-12 bg-black/40 border border-gray-800 rounded-lg pl-10 pr-4 text-white placeholder-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                         placeholder="trader@signalix.ai"
                      />
                   </div>
                </div>
                
                <div>
                   <label className="block text-xs font-mono text-gray-500 mb-1 ml-1">PASSWORD</label>
                   <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-600" />
                      <input 
                         type="password" 
                         required
                         value={password}
                         onChange={e => setPassword(e.target.value)}
                         className="w-full h-12 bg-black/40 border border-gray-800 rounded-lg pl-10 pr-4 text-white placeholder-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                         placeholder="••••••••••••"
                      />
                   </div>
                </div>

                <button 
                   type="submit"
                   disabled={isLoading}
                   className="w-full h-12 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2"
                >
                   {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   ) : (
                      <>
                         {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight className="w-4 h-4" />
                      </>
                   )}
                </button>
             </form>
          </div>

          <div className="mt-6 text-center">
             <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-sm text-gray-500 hover:text-cyan-400 transition-colors"
             >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
             </button>
          </div>
        </div>
        
        <p className="text-center text-xs text-gray-600 mt-8">
           Protected by institutional-grade encryption.
        </p>

      </div>
    </div>
  );
};

export default AuthPage;