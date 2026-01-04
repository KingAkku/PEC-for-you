import React from 'react';
import { User, Role } from '../types';
import { Menu, X, Bell, User as UserIcon, LogOut, ChevronDown, LayoutGrid, Calendar, Users } from 'lucide-react';
import { DEMO_USERS } from '../constants';

interface NavbarProps {
  currentUser: User | null;
  onSwitchUser: (user: User) => void;
  currentView: string;
  onChangeView: (view: string) => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onLogoutClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  currentUser, 
  onSwitchUser, 
  currentView, 
  onChangeView,
  onLoginClick,
  onSignupClick,
  onLogoutClick
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const navLinks = [
    { name: 'Home', id: 'home', icon: LayoutGrid },
    { name: 'Events', id: 'events', icon: Calendar },
    { name: 'Clubs', id: 'clubs', icon: Users },
  ];

  return (
    <nav className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 rounded-full bg-white/60 backdrop-blur-xl border border-white/60 shadow-glass transition-all duration-300 w-[95%] max-w-7xl ${isMobileMenuOpen ? 'h-auto rounded-3xl' : 'h-[72px]'}`}>
      <div className="relative flex items-center justify-between h-[72px] px-2 pl-4 pr-2">
        
        {/* Left: Logo */}
        <div 
          className="flex items-center space-x-3 cursor-pointer z-10 flex-shrink-0 group" 
          onClick={() => onChangeView('home')}
        >
          <img 
            src="/P.svg" 
            alt="PEC Portal" 
            className="w-10 h-10 shadow-sm rounded-lg group-hover:scale-105 transition-transform duration-300" 
          />
          <span className="font-display text-xl text-slate-900 tracking-tight hidden sm:block opacity-90 group-hover:opacity-100 transition-opacity">
            PEC Portal
          </span>
        </div>

        {/* Center: Nav Links */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center p-1 bg-slate-100/50 rounded-full border border-white/50 backdrop-blur-md">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onChangeView(link.id)}
              className={`flex items-center space-x-2 text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-300 ${
                currentView === link.id 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <span>{link.name}</span>
            </button>
          ))}
        </div>

        {/* Right: User Actions */}
        <div className="flex items-center justify-end space-x-2 z-10 flex-shrink-0">
          {!currentUser ? (
            <div className="hidden md:flex items-center space-x-2">
              <button 
                onClick={onLoginClick}
                className="text-sm font-bold text-slate-600 hover:text-slate-900 px-5 py-2.5 transition-colors"
              >
                Log In
              </button>
              <button 
                onClick={onSignupClick}
                className="text-sm font-bold text-white bg-slate-900 hover:bg-black px-6 py-2.5 rounded-full transition-all shadow-lg hover:shadow-slate-900/20 hover:-translate-y-0.5"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <>
              <button className="p-2.5 text-slate-500 hover:text-slate-900 transition-colors relative hover:bg-white rounded-full">
                <Bell size={20} />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 pl-1 pr-3 py-1 rounded-full hover:bg-white transition-all border border-transparent hover:border-slate-100 hover:shadow-sm"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-100 border border-white shadow-sm flex items-center justify-center text-slate-600">
                    <UserIcon size={18} />
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-bold text-slate-800 leading-none">{currentUser.name.split(' ')[0]}</p>
                  </div>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-4 w-64 bg-white/80 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-glass p-3 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 border-b border-slate-100/50 mb-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Demo User Switch</p>
                    </div>
                    <div className="space-y-1">
                      {DEMO_USERS.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            onSwitchUser(u);
                            setIsProfileOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 rounded-2xl text-sm transition-colors flex items-center justify-between group ${
                            currentUser.id === u.id 
                              ? 'bg-slate-100 text-slate-900 font-bold' 
                              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <span>{u.name}</span>
                          {currentUser.id === u.id && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>}
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-slate-100/50 mt-2 pt-2">
                      <button 
                        onClick={() => {
                          onLogoutClick();
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 rounded-2xl text-sm text-rose-500 hover:bg-rose-50 flex items-center space-x-2 font-medium transition-colors"
                      >
                          <LogOut size={16} />
                          <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-3 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 px-4 pb-6 pt-2">
          <div className="flex flex-col space-y-2 pt-4">
             {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onChangeView(link.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-4 text-left px-6 py-4 rounded-2xl font-medium transition-colors ${
                  currentView === link.id
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <link.icon size={20} />
                <span>{link.name}</span>
              </button>
            ))}
            {!currentUser && (
               <div className="pt-4 mt-2 border-t border-slate-100 grid grid-cols-2 gap-3">
                 <button 
                   onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }}
                   className="px-4 py-3 rounded-2xl font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 text-center"
                 >
                   Log In
                 </button>
                 <button 
                   onClick={() => { onSignupClick(); setIsMobileMenuOpen(false); }}
                   className="px-4 py-3 rounded-2xl font-bold text-white bg-slate-900 hover:bg-slate-800 text-center"
                 >
                   Sign Up
                 </button>
               </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;