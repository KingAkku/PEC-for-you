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

  const getRoleBadgeColor = (role: Role) => {
    switch(role) {
      case 'admin': return 'bg-red-100 text-red-700 border-red-200';
      case 'faculty': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'lead': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <nav className={`fixed top-4 left-4 right-4 z-50 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-lg px-6 transition-all duration-300 ${isMobileMenuOpen ? 'h-auto' : 'h-[72px]'}`}>
      <div className="relative flex items-center justify-between h-[72px]">
        
        {/* Left: Logo */}
        <div 
          className="flex items-center space-x-2 cursor-pointer z-10 flex-shrink-0" 
          onClick={() => onChangeView('home')}
        >
          <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white font-display text-xl pt-1 shadow-md">
            P
          </div>
          <span className="font-display text-xl text-slate-900 tracking-tight hidden sm:block">PEC Portal</span>
        </div>

        {/* Center: Nav Links (Absolutely Positioned) */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center p-1.5 bg-slate-100/50 rounded-xl border border-white/50 backdrop-blur-sm">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onChangeView(link.id)}
              className={`flex items-center space-x-2 text-sm font-medium px-5 py-2 rounded-lg transition-all duration-200 ${
                currentView === link.id 
                  ? 'bg-white text-slate-900 shadow-sm font-semibold' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <link.icon size={18} strokeWidth={2} />
              <span>{link.name}</span>
            </button>
          ))}
        </div>

        {/* Right: User Actions or Auth Buttons */}
        <div className="flex items-center justify-end space-x-3 z-10 flex-shrink-0">
          {!currentUser ? (
            <div className="hidden md:flex items-center space-x-3">
              <button 
                onClick={onLoginClick}
                className="text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md"
              >
                Log In
              </button>
              <button 
                onClick={onSignupClick}
                className="text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <>
              <button className="p-2 text-slate-500 hover:text-slate-900 transition-colors relative hover:bg-slate-100 rounded-full">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 pl-2 py-1 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 shadow-inner border border-white">
                    <UserIcon size={18} />
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-semibold text-slate-800 leading-none">{currentUser.name}</p>
                    <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">
                      {currentUser.role}
                    </span>
                  </div>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-4 w-64 bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 ring-1 ring-black/5">
                    <div className="px-3 py-2 border-b border-slate-100 mb-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Switch User (Demo)</p>
                    </div>
                    <div className="space-y-0.5">
                      {DEMO_USERS.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            onSwitchUser(u);
                            setIsProfileOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors flex items-center justify-between group ${
                            currentUser.id === u.id 
                              ? 'bg-slate-100 text-slate-900 font-bold' 
                              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <span>{u.name}</span>
                          {currentUser.id === u.id && <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-slate-100 mt-2 pt-2">
                      <button 
                        onClick={() => {
                          onLogoutClick();
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 flex items-center space-x-2 font-medium transition-colors"
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
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/60 animate-in slide-in-from-top-4 pb-4">
          <div className="flex flex-col space-y-2 pt-4">
             {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onChangeView(link.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-3 text-left px-4 py-3 rounded-xl font-medium transition-colors ${
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
                   className="px-4 py-3 rounded-xl font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 text-center"
                 >
                   Log In
                 </button>
                 <button 
                   onClick={() => { onSignupClick(); setIsMobileMenuOpen(false); }}
                   className="px-4 py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 text-center"
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