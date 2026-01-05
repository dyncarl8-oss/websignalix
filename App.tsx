import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import { userService } from './services/userService';
import { UserProfile } from './types';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { Loader2 } from 'lucide-react';

type ViewState = 'landing' | 'auth' | 'dashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [user, setUser] = useState<UserProfile | null>(null);
  // We initialize loading to true to cover the initial Firebase handshake.
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // NOTE: We do NOT set loading(true) here unconditionally. 
      // Doing so causes the AuthPage to unmount/remount, losing the "Verify Email" state.

      if (firebaseUser) {
        // User is signed in with Firebase.
        try {
          await firebaseUser.reload();
        } catch (e) {
          // ignore reload error
        }

        if (firebaseUser.emailVerified) {
          // Only show loader if we are actually proceeding to fetch data/dashboard
          setLoading(true); 
          try {
            // Check for payment success param in URL
            const params = new URLSearchParams(window.location.search);
            const paymentSuccess = params.get('payment') === 'success';

            if (paymentSuccess) {
              setProcessingPayment(true);
              const upgradedUser = await userService.upgradeToPro();
              setUser(upgradedUser);
              window.history.replaceState({}, '', window.location.pathname);
              setProcessingPayment(false);
            } else {
               const profile = await userService.getCurrentUserProfile();
               setUser(profile);
            }
            
            // Switch to dashboard if authenticated
            setCurrentView('dashboard');
          } catch (e) {
            console.error("Error fetching user profile", e);
            setUser(null);
            setProcessingPayment(false);
          } finally {
            setLoading(false);
          }
        } else {
          // Email not verified. 
          // We treat this as "no user" for the app state, but we DO NOT show a loader.
          // This keeps the AuthPage mounted so it can display the "Check Email" or error messages.
          setUser(null);
          setLoading(false); 
        }
      } else {
        // User is signed out
        setUser(null);
        // If we were on dashboard, go back to landing
        setCurrentView(prev => prev === 'dashboard' ? 'landing' : prev);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []); // Removed currentView dependency to prevent double-loading on view change

  const handleLoginSuccess = (userData: UserProfile) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = async () => {
    await userService.logout();
    setCurrentView('landing'); 
  };

  // Only show full screen loader if we are doing significant data fetching or initial load
  if (loading || processingPayment) {
    return (
      <div className="min-h-screen bg-[#050508] flex flex-col gap-4 items-center justify-center">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
        {processingPayment && (
           <p className="text-gray-400 font-mono text-sm animate-pulse">Confirming Pro Subscription...</p>
        )}
      </div>
    );
  }

  return (
    <>
      {currentView === 'landing' && (
        <LandingPage 
          onGetStarted={() => {
             if (user) setCurrentView('dashboard');
             else setCurrentView('auth');
          }}
          onLogin={() => {
             if (user) setCurrentView('dashboard');
             else setCurrentView('auth');
          }}
        />
      )}

      {currentView === 'auth' && (
        <AuthPage 
          onLoginSuccess={handleLoginSuccess}
          onBack={() => setCurrentView('landing')}
        />
      )}

      {currentView === 'dashboard' && user && (
        <Dashboard 
          user={user} 
          onLogout={handleLogout} 
        />
      )}
    </>
  );
}