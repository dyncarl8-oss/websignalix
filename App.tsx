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
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        // User is signed in with Firebase, but we need to check if they are verified.
        // We reload the user to get the latest emailVerified status just in case.
        try {
          await firebaseUser.reload();
        } catch (e) {
          // ignore reload error (network etc)
        }

        if (firebaseUser.emailVerified) {
          try {
            // Check for payment success param in URL
            const params = new URLSearchParams(window.location.search);
            const paymentSuccess = params.get('payment') === 'success';

            if (paymentSuccess) {
              setProcessingPayment(true);
              const upgradedUser = await userService.upgradeToPro();
              setUser(upgradedUser);
              // Clean URL
              window.history.replaceState({}, '', window.location.pathname);
              setProcessingPayment(false);
            } else {
               const profile = await userService.getCurrentUserProfile();
               setUser(profile);
            }
            
            // Only switch to dashboard if we weren't already there or landing
            if (currentView === 'auth' || currentView === 'landing') {
               setCurrentView('dashboard');
            }
          } catch (e) {
            console.error("Error fetching user profile", e);
            setUser(null);
            setProcessingPayment(false);
          }
        } else {
          // Email not verified. Treat as logged out for the app state, 
          // allowing AuthPage to handle the "Verify Sent" view or Login errors.
          setUser(null);
          // We do not force setCurrentView here, preserving the user's location (e.g. AuthPage)
        }
      } else {
        // User is signed out
        setUser(null);
        // If they were on dashboard, kick them to landing
        if (currentView === 'dashboard') {
          setCurrentView('landing');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentView]); // Add currentView as dep to correctly handle redirections

  const handleLoginSuccess = (userData: UserProfile) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = async () => {
    await userService.logout();
    setCurrentView('landing'); 
  };

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