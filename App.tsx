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

  // Real Data State
  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  // Initialize Supabase Auth & Fetch Data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 1. Check Session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (session) {
          await fetchUserProfile(session.user.id, session.user.email);
        }

        // 2. Fetch Content (Notices & Events)
        await Promise.all([fetchNotices(), fetchEvents()]);
        
      } catch (err) {
        console.error("Initialization failed:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();

    // Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        if (event === 'SIGNED_IN') {
           setTimeout(() => fetchUserProfile(session.user.id, session.user.email), 500);
        } else {
           await fetchUserProfile(session.user.id, session.user.email);
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchNotices = async () => {
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data && data.length > 0) {
      setNotices(data);
    } else {
      // Fallback to mock data if DB is empty or error occurs
      if (error) console.warn("Supabase fetch error (Notices):", error.message);
      setNotices(MOCK_NOTICES);
    }
  };

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data && data.length > 0) {
       // Map DB snake_case to camelCase
       const mappedEvents = data.map((e: any) => ({
         id: e.id,
         title: e.title,
         description: e.description,
         date: e.date,
         location: e.location,
         organizer: e.organizer,
         imageUrl: e.image_url,
         registeredCount: e.registered_count,
         category: e.category
       }));
       setEvents(mappedEvents);
    } else {
       // Fallback to mock data if DB is empty or error occurs
       if (error) console.warn("Supabase fetch error (Events):", error.message);
       setEvents(MOCK_EVENTS);
    }
  };

  const fetchUserProfile = async (userId: string, email?: string, retryCount = 0) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && retryCount < 3) {
        // If error is strictly about connection, retry. If 406 or row missing, don't retry.
        setTimeout(() => fetchUserProfile(userId, email, retryCount + 1), 500);
        return;
      }

      if (data) {
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
    }
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleNavigateToClub = (club: Club) => {
    setSelectedClub(club);
    handleViewChange('club-detail');
  };

  // Create Notice in DB
  const handleAddNotice = async (notice: Notice) => {
    // Optimistic update
    setNotices(prev => [notice, ...prev]);

    const { error } = await supabase
        .from('notices')
        .insert([{
            title: notice.title,
            content: notice.content,
            date: notice.date,
            category: notice.category
        }]);
    
    if (error) {
        console.error("Failed to save notice:", error.message);
        // We don't revert here to keep the UI snappy for the demo, 
        // but in prod you would revert the state or show a toast
    }
  };

  // Create Event in DB
  const handleAddEvent = async (event: Event) => {
    // Optimistic update
    setEvents(prev => [event, ...prev]);

    const { error } = await supabase
        .from('events')
        .insert([{
            title: event.title,
            description: event.description,
            date: event.date,
            location: event.location,
            organizer: event.organizer,
            image_url: event.imageUrl,
            category: event.category,
            registered_count: 0
        }]);

    if (error) {
        console.error("Failed to save event:", error.message);
    }
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
        onLogin={(user) => setCurrentUser(user)} 
      />

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />

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