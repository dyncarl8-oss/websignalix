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
      if (firebaseUser) {
        // User is signed in
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
          
          setCurrentView('dashboard');
        } catch (e) {
          console.error("Error fetching user profile", e);
          setProcessingPayment(false);
        }
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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