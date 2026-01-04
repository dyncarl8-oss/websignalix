import React, { useState } from 'react';
import { Activity, Mail, Lock, ArrowRight, CheckCircle2, ArrowLeft, KeyRound, AlertTriangle } from 'lucide-react';
import { userService } from '../services/userService';
import { UserProfile } from '../types';

interface AuthPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  onBack: () => void;
}

type AuthMode = 'login' | 'signup' | 'forgot-password' | 'verify-sent';

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, onBack }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const user = await userService.login(email, password);
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await userService.register(email, undefined, password);
      setMode('verify-sent');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      await userService.resetPassword(email);
      setSuccessMsg('Password reset link sent to your email.');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link');
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
          
          {/* VERIFY SENT MODE */}
          {mode === 'verify-sent' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                 <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
              <p className="text-gray-400 text-sm mb-6">
                 We've sent a verification link to <span className="text-white font-mono">{email}</span>. Please check your inbox (and spam) to activate your account.
              </p>
              <button 
                 onClick={() => setMode('login')}
                 className="w-full h-12 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-bold transition-colors"
              >
                 Return to Login
              </button>
            </div>
          )}

          {/* FORGOT PASSWORD MODE */}
          {mode === 'forgot-password' && (
            <div>
               <button onClick={() => setMode('login')} className="flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-6 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Login
               </button>
               <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
               <p className="text-gray-400 text-sm mb-6">Enter your email to receive password reset instructions.</p>

               {successMsg ? (
                 <div className="p-4 bg-green-900/30 border border-green-500/30 rounded text-green-400 text-sm text-center mb-4">
                    {successMsg}
                 </div>
               ) : (
                 <form onSubmit={handleForgotPassword} className="space-y-4">
                    {error && (
                      <div className="p-3 bg-red-900/30 border border-red-500/30 rounded text-red-400 text-xs text-center flex items-center justify-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> {error}
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
                    <button 
                       type="submit"
                       disabled={isLoading}
                       className="w-full h-12 rounded-lg bg-cyber-cyan hover:bg-cyan-400 text-black font-bold text-sm transition-all shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2"
                    >
                       {isLoading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> : 'Send Reset Link'}
                    </button>
                 </form>
               )}
            </div>
          )}

          {/* LOGIN & SIGNUP MODES */}
          {(mode === 'login' || mode === 'signup') && (
            <>
               <h2 className="text-2xl font-bold text-white mb-2 text-center">
                  {mode === 'login' ? 'Welcome Back' : 'Create Account'}
               </h2>
               <p className="text-gray-400 text-sm text-center mb-8">
                  {mode === 'login' ? 'Enter the matrix of market intelligence' : 'Start your journey with 3 free credits'}
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

                  <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
                     {error && (
                       <div className="p-3 bg-red-900/30 border border-red-500/30 rounded text-red-400 text-xs text-center flex items-center justify-center gap-2">
                         <AlertTriangle className="w-3 h-3" /> {error}
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

                     {mode === 'login' && (
                        <div className="flex justify-end">
                           <button 
                              type="button"
                              onClick={() => setMode('forgot-password')}
                              className="text-xs text-cyan-500 hover:text-cyan-400 transition-colors"
                           >
                              Forgot Password?
                           </button>
                        </div>
                     )}

                     <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2"
                     >
                        {isLoading ? (
                           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                           <>
                              {mode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight className="w-4 h-4" />
                           </>
                        )}
                     </button>
                  </form>
               </div>

               <div className="mt-6 text-center">
                  <button 
                     onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
                     className="text-sm text-gray-500 hover:text-cyan-400 transition-colors"
                  >
                     {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                  </button>
               </div>
            </>
          )}

        </div>
        
        <p className="text-center text-xs text-gray-600 mt-8">
           Protected by institutional-grade encryption.
        </p>

      </div>
    </div>
  );
};

export default AuthPage;