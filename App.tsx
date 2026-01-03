import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import Clubs from './pages/Clubs';
import { DEMO_USERS } from './constants';
import { User } from './types';
import { AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User>(DEMO_USERS[3]); // Default to student
  const [currentView, setCurrentView] = useState('home');

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home />;
      case 'events':
        return <Events user={currentUser} />;
      case 'clubs':
        return <Clubs user={currentUser} />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="font-sans text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
      <Navbar 
        currentUser={currentUser} 
        onSwitchUser={setCurrentUser} 
        currentView={currentView}
        onChangeView={setCurrentView}
      />
      
      <main>
        <AnimatePresence mode="wait">
          {renderView()}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default App;
