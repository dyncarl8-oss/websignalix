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

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        try {
          const profile = await userService.getCurrentUserProfile();
          setUser(profile);
          // Auto-redirect to dashboard on login
          setCurrentView('dashboard');
        } catch (e) {
          console.error("Error fetching user profile", e);
        }
      } else {
        // User is signed out
        setUser(null);
        // CRITICAL FIX: Do NOT force navigation to 'landing' here.
        // This allows the 'auth' view to remain active while the user is typing their credentials.
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []); // Empty dependency array ensures this only runs once on mount

  const handleLoginSuccess = (userData: UserProfile) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = async () => {
    await userService.logout();
    setCurrentView('landing'); // Explicitly navigate to landing on logout
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
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