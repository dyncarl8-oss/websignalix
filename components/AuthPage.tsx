import React, { useState } from 'react';
import { Activity, Mail, Lock, ArrowRight, CheckCircle2, ArrowLeft, AlertTriangle, RefreshCw, Loader2, Info } from 'lucide-react';
import { userService } from '../services/userService';
import { UserProfile } from '../types';

interface AuthPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  onBack: () => void;
}

type AuthMode = 'login' | 'signup' | 'forgot-password' | 'verify-sent';

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, onBack }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  
  // Separate loading states to prevent UI flicker on unrelated buttons
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Specific state for the "Email Unverified" scenario
  const [showResend, setShowResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Helper to clear messages when switching modes
  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError('');
    setSuccessMsg('');
    setShowResend(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailLoading(true);
    setError('');
    setShowResend(false);
    
    try {
      const user = await userService.login(email, password);
      onLoginSuccess(user);
    } catch (err: any) {
      if (err.message === 'EMAIL_NOT_VERIFIED') {
        setError('Email not verified yet.');
        setShowResend(true);
      } else {
        // The error message is already cleaned by userService
        setError(err.message);
      }
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailLoading(true);
    setError('');

    try {
      await userService.register(email, undefined, password);
      setMode('verify-sent');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    try {
      await userService.resendVerification(email, password);
      setSuccessMsg("Verification email resent! Please check your inbox and spam folder.");
      setShowResend(false);
      setError('');
    } catch (err: any) {
      if (err.message === 'ALREADY_VERIFIED') {
         setError('Account is already verified. Please try logging in.');
         setShowResend(false);
      } else {
         setError(err.message);
      }
    } finally {
      setResendLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      await userService.resetPassword(email);
      // Improved message to manage user expectations regarding security privacy (Enumeration Protection)
      setSuccessMsg('If an account exists with this email, a reset link has been sent. Please check your inbox and spam folder.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError('');
    try {
      const user = await userService.googleLogin();
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
       setIsGoogleLoading(false);
    }
  }

  const isLoading = isEmailLoading || isGoogleLoading;

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
          
          {/* VERIFY SENT MODE (Post-Signup) */}
          {mode === 'verify-sent' && (
            <div className="text-center animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                 <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Check Your Inbox</h2>
              <p className="text-gray-400 text-sm mb-4">
                 We've sent a verification link to
              </p>
              
              <div className="bg-black/40 border border-gray-800 rounded py-2 px-4 inline-block mb-6">
                 <span className="text-white font-mono text-sm">{email}</span>
              </div>
              
              <p className="text-xs text-green-400/70 mb-8 flex items-center justify-center gap-2">
                 If you don't see it, please check your spam folder.
              </p>

              <button 
                 onClick={() => switchMode('login')}
                 className="w-full h-12 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-bold transition-colors border border-gray-700 hover:border-gray-600"
              >
                 Return to Login
              </button>
            </div>
          )}

          {/* FORGOT PASSWORD MODE */}
          {mode === 'forgot-password' && (
            <div>
               <button onClick={() => switchMode('login')} className="flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-6 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Login
               </button>
               <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
               <p className="text-gray-400 text-sm mb-6">Enter your email to receive password reset instructions.</p>

               {successMsg ? (
                 <div className="p-4 bg-green-900/30 border border-green-500/30 rounded text-green-400 text-sm text-center mb-4 leading-relaxed">
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
                       disabled={isEmailLoading}
                       className="w-full h-12 rounded-lg bg-cyber-cyan hover:bg-cyan-400 text-black font-bold text-sm transition-all shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2"
                    >
                       {isEmailLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
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
                     {isGoogleLoading ? (
                       <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                     ) : (
                       <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                     )}
                     {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
                  </button>

                  <div className="relative flex items-center py-2">
                     <div className="flex-grow border-t border-gray-800"></div>
                     <span className="flex-shrink-0 mx-4 text-gray-600 text-xs uppercase">Or continue with email</span>
                     <div className="flex-grow border-t border-gray-800"></div>
                  </div>

                  {successMsg && (
                    <div className="p-3 bg-green-900/30 border border-green-500/30 rounded text-green-400 text-xs text-center flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> {successMsg}
                    </div>
                  )}

                  <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
                     {error && (
                       <div className="p-3 bg-red-900/30 border border-red-500/30 rounded flex flex-col items-center justify-center gap-2 animate-in fade-in zoom-in duration-300">
                         <div className="text-red-400 text-xs text-center flex items-center gap-2 font-bold">
                            <AlertTriangle className="w-3 h-3" /> {error}
                         </div>
                         {showResend && (
                            <div className="w-full mt-2 pt-2 border-t border-red-500/20">
                               <div className="flex items-start gap-2 mb-2 px-2">
                                  <Info className="w-3 h-3 text-red-300 mt-0.5" />
                                  <p className="text-[10px] text-red-200/70 text-left leading-tight">
                                     Check your <strong>Spam folder</strong> if you don't see the email.
                                  </p>
                               </div>
                               <button
                                 type="button"
                                 onClick={handleResendVerification}
                                 disabled={resendLoading}
                                 className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs rounded border border-red-500/30 flex items-center justify-center gap-2 transition-colors font-bold"
                               >
                                 {resendLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                                 Resend Verification Email
                               </button>
                            </div>
                         )}
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
                              onClick={() => switchMode('forgot-password')}
                              className="text-xs text-cyan-500 hover:text-cyan-400 transition-colors"
                           >
                              Forgot Password?
                           </button>
                        </div>
                     )}

                     <button 
                        type="submit"
                        disabled={isEmailLoading}
                        className="w-full h-12 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2"
                     >
                        {isEmailLoading ? (
                           <Loader2 className="w-5 h-5 animate-spin" />
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
                     onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
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