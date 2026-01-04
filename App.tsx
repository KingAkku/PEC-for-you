import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import Clubs from './pages/Clubs';
import ClubDetail from './pages/ClubDetail';
import Dashboard from './pages/Dashboard';
import MyClub from './pages/MyClub';
import AuthModal from './components/AuthModal';
import FeedbackModal from './components/FeedbackModal';
import { User, Club, Notice, Event } from './types';
import { MOCK_NOTICES, MOCK_EVENTS } from './constants';
import { AnimatePresence } from 'framer-motion';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  // State for Data Persistence
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('home');
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(true);

  // Lifted State for Dynamic Updates
  const [notices, setNotices] = useState<Notice[]>(MOCK_NOTICES);
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);

  // Initialize Supabase Auth Listener
  useEffect(() => {
    // 1. Check active session on startup
    const checkUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (data.session) {
          await fetchUserProfile(data.session.user.id, data.session.user.email);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Auth initialization failed:", err);
        setLoading(false); // Allow app to load even if auth fails
      }
    };

    checkUser();

    // 2. Listen for changes (Login, Logout, Auto-refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        // If SIGNED_IN (especially from signup), wait a moment for profile creation
        if (event === 'SIGNED_IN') {
           // Small delay to allow profile insertion to complete if this was a new signup
           setTimeout(() => fetchUserProfile(session.user.id, session.user.email), 500);
        } else {
           await fetchUserProfile(session.user.id, session.user.email);
        }
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string, email?: string, retryCount = 0) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && retryCount < 3) {
        // If error (likely 'no rows found' during fast signup), retry a few times
        setTimeout(() => fetchUserProfile(userId, email, retryCount + 1), 500);
        return;
      }

      if (data) {
        // Map Supabase profile to our App's User type
        const appUser: User = {
          id: data.id,
          name: data.name,
          role: data.role,
          email: data.email || email,
          department: data.department,
          clubId: data.club_id
        };
        setCurrentUser(appUser);
      }
    } catch (error) {
      console.error("Unexpected error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // Wrapper to handle view changes and scroll reset
  const handleViewChange = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleNavigateToClub = (club: Club) => {
    setSelectedClub(club);
    handleViewChange('club-detail');
  };

  // Handlers for creating content
  const handleAddNotice = (notice: Notice) => {
    setNotices(prev => [notice, ...prev]);
  };

  const handleAddEvent = (event: Event) => {
    setEvents(prev => [event, ...prev]);
  };

  const renderView = () => {
    if (loading) {
      return (
        <div className="h-screen flex items-center justify-center bg-slate-50">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
        </div>
      );
    }

    switch (currentView) {
      case 'home':
        return (
          <Home 
            onNavigate={handleViewChange} 
            user={currentUser} 
            notices={notices}
            onAddNotice={handleAddNotice}
          />
        );
      case 'events':
        return (
          <Events 
            user={currentUser} 
            events={events}
            onAddEvent={handleAddEvent}
          />
        );
      case 'clubs':
        return <Clubs user={currentUser} onViewClub={handleNavigateToClub} />;
      case 'club-detail':
        return selectedClub ? (
          <ClubDetail 
            club={selectedClub} 
            onBack={() => handleViewChange('clubs')} 
            user={currentUser} 
          />
        ) : (
          <Clubs user={currentUser} onViewClub={handleNavigateToClub} />
        );
      case 'dashboard':
        // Protected route for Admin/Faculty
        if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'faculty')) {
           return <Dashboard user={currentUser} />;
        }
        return (
          <Home 
            onNavigate={handleViewChange} 
            user={currentUser} 
            notices={notices} 
            onAddNotice={handleAddNotice} 
          />
        );
      case 'my-club':
        // Protected route for Lead
        if (currentUser && currentUser.role === 'lead') {
           return <MyClub user={currentUser} />;
        }
        return (
          <Home 
            onNavigate={handleViewChange} 
            user={currentUser} 
            notices={notices} 
            onAddNotice={handleAddNotice} 
          />
        );
      default:
        return (
          <Home 
            onNavigate={handleViewChange} 
            user={currentUser} 
            notices={notices} 
            onAddNotice={handleAddNotice} 
          />
        );
    }
  };

  const handleOpenLogin = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const handleOpenSignup = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    handleViewChange('home');
  };

  return (
    <div className="font-sans text-slate-900 antialiased selection:bg-slate-900 selection:text-white relative">
      <Navbar 
        currentUser={currentUser} 
        onSwitchUser={setCurrentUser} 
        currentView={currentView}
        onChangeView={handleViewChange}
        onLoginClick={handleOpenLogin}
        onSignupClick={handleOpenSignup}
        onLogoutClick={handleLogout}
      />
      
      <main>
        <AnimatePresence mode="wait">
          {renderView()}
        </AnimatePresence>
      </main>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authMode}
        onLogin={(user) => setCurrentUser(user)} // AuthModal now handles Supabase calls internally
      />

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />

      {/* Floating Feedback Button */}
      <button 
        onClick={() => setIsFeedbackModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer group"
        aria-label="Feedback"
      >
        <svg 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="group-hover:rotate-12 transition-transform duration-500"
        >
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
        </svg>
      </button>

      <Footer />
    </div>
  );
};

export default App;