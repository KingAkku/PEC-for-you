
import React, { useState } from 'react';
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
import { User, Club } from './types';
import { AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  // Start with no user (null) instead of a demo user
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('home');
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Wrapper to handle view changes and scroll reset
  const handleViewChange = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleNavigateToClub = (club: Club) => {
    setSelectedClub(club);
    handleViewChange('club-detail');
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home onNavigate={handleViewChange} user={currentUser} />;
      case 'events':
        return <Events user={currentUser} />;
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
        return <Home onNavigate={handleViewChange} user={currentUser} />;
      case 'my-club':
        // Protected route for Lead
        if (currentUser && currentUser.role === 'lead') {
           return <MyClub user={currentUser} />;
        }
        return <Home onNavigate={handleViewChange} user={currentUser} />;
      default:
        return <Home onNavigate={handleViewChange} user={currentUser} />;
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

  const handleLogout = () => {
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
        onLogin={setCurrentUser}
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
