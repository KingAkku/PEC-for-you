import React from 'react';
import { User, Role } from '../types';
import { Menu, X, Bell, User as UserIcon, LogOut } from 'lucide-react';
import { DEMO_USERS } from '../constants';

interface NavbarProps {
  currentUser: User;
  onSwitchUser: (user: User) => void;
  currentView: string;
  onChangeView: (view: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, onSwitchUser, currentView, onChangeView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Events', id: 'events' },
    { name: 'Clubs', id: 'clubs' },
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
    <nav className="fixed top-4 left-4 right-4 z-50 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg px-6 py-4 transition-all duration-300">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={() => onChangeView('home')}
        >
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-display text-xl pt-1">
            P
          </div>
          <span className="font-display text-xl text-slate-800 tracking-tight hidden sm:block">PEC Portal</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onChangeView(link.id)}
              className={`text-sm font-medium transition-colors duration-200 ${
                currentView === link.id 
                  ? 'text-slate-900 bg-white/50 px-3 py-1.5 rounded-lg shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          <button className="p-2 text-slate-500 hover:text-slate-900 transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 pl-2 border-l border-slate-200"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 shadow-inner">
                <UserIcon size={16} />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-800">{currentUser.name}</p>
                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getRoleBadgeColor(currentUser.role)} uppercase tracking-wider font-bold`}>
                  {currentUser.role}
                </span>
              </div>
            </button>

            {/* Profile Dropdown / User Switcher */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-4 w-64 bg-white/90 backdrop-blur-xl border border-white/50 rounded-xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-slate-100 mb-2">
                  <p className="text-xs font-bold text-slate-400 uppercase">Switch User (Demo)</p>
                </div>
                {DEMO_USERS.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      onSwitchUser(u);
                      setIsProfileOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${
                      currentUser.id === u.id 
                        ? 'bg-slate-100 text-slate-900 font-medium' 
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {u.name} <span className="opacity-50">({u.role})</span>
                  </button>
                ))}
                <div className="border-t border-slate-100 mt-2 pt-2">
                   <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 flex items-center space-x-2">
                      <LogOut size={14} />
                      <span>Sign Out</span>
                   </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-slate-200 animate-in slide-in-from-top-4">
          <div className="flex flex-col space-y-2">
             {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onChangeView(link.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left px-4 py-3 rounded-xl font-medium ${
                  currentView === link.id
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
