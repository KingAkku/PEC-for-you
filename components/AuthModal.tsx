import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, ArrowRight, ChevronRight, BookOpen, CheckCircle, Shield, GraduationCap } from 'lucide-react';
import { User, Role } from '../types';
import { DEPARTMENTS, DEMO_USERS } from '../constants';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  initialMode?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDept, setSelectedDept] = useState(DEPARTMENTS[0]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Sync mode if initialMode changes when reopening
  React.useEffect(() => {
    setMode(initialMode);
    setErrorMessage('');
    setSuccessMessage('');
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  // Manual Demo Login Helper
  const handleDemoLogin = (role: 'admin' | 'student') => {
    const demoUser = DEMO_USERS.find(u => u.role === role);
    if (demoUser) {
      setSuccessMessage(`Welcome back, ${demoUser.name}!`);
      setTimeout(() => {
          onLogin(demoUser);
          onClose();
      }, 800);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (mode === 'signup') {
        // Attempt Supabase Signup
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: fullName,
              role: selectedRole,
              department: selectedDept,
            }
          }
        });

        if (authError) throw authError;

        if (authData.user) {
          // Attempt Profile Creation
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: authData.user.id,
                email: email,
                name: fullName,
                role: selectedRole,
                department: selectedDept,
                club_id: selectedRole === 'lead' ? 'c1' : null, 
              },
            ]);

          if (profileError) console.warn("Profile creation warning:", profileError);

          // Success Logic
          onLogin({
              id: authData.user.id,
              name: fullName,
              role: selectedRole,
              email: email,
              department: selectedDept,
              clubId: selectedRole === 'lead' ? 'c1' : undefined
          });
          setSuccessMessage("Account created successfully!");
          setTimeout(() => onClose(), 1500);
        }
      } else {
        // Login Logic
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        setSuccessMessage("Login successful!");
        setTimeout(() => onClose(), 1000);
      }
    } catch (error: any) {
      console.error("Auth Error:", error);

      // --- OFFLINE / FALLBACK MODE ---
      // If network fails or Supabase is not configured, we allow the user to proceed 
      // with the details they just entered.
      
      const isNetworkError = error.message?.includes("Failed to fetch") || error.message?.includes("network");
      const isPlaceholderError = error.message?.includes("apikey");

      if (isNetworkError || isPlaceholderError) {
        if (mode === 'signup') {
            // Create a local user session from the form data
            const localUser: User = {
                id: `local-${Date.now()}`,
                name: fullName, // Use the name exactly as typed (e.g., Akhil Kumar S)
                role: selectedRole,
                email: email,
                department: selectedDept,
                clubId: selectedRole === 'lead' ? 'c1' : undefined
            };
            onLogin(localUser);
            setSuccessMessage("Offline Mode: Account created locally!");
            setTimeout(() => onClose(), 1500);
        } else {
            // For login, if they use the special password or match a demo user
            const demoUser = DEMO_USERS.find(u => u.email === email);
            if (demoUser || password === 'password123') {
                 const fallbackUser = demoUser || {
                     id: 'temp-admin',
                     name: 'Administrator',
                     role: 'admin',
                     email: email,
                     department: 'Computer Science'
                 };
                 onLogin(fallbackUser as User);
                 setSuccessMessage("Offline Mode: Logged in locally!");
                 setTimeout(() => onClose(), 1500);
            } else {
                 setErrorMessage("Connection failed. Try 'password123' for demo access.");
            }
        }
      } else {
         setErrorMessage(error.message || "An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white/90 backdrop-blur-xl border border-white/50 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          {successMessage ? (
            <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Success!</h2>
              <p className="text-slate-600">{successMessage}</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-display text-slate-900 mb-2">
                  {mode === 'login' ? 'Welcome Back' : 'Join PEC Portal'}
                </h2>
                <p className="text-slate-500 text-sm">
                  {mode === 'login' 
                    ? 'Enter your credentials to access your account.' 
                    : 'Create an account to connect with clubs and events.'}
                </p>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-start gap-2">
                  <div className="w-1 h-4 bg-red-400 rounded-full mt-0.5"></div>
                  {errorMessage}
                </div>
              )}

              {/* Demo Login Buttons */}
              {mode === 'login' && (
                <div className="mb-6 grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => handleDemoLogin('admin')}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all text-xs font-bold"
                  >
                    <Shield size={16} className="text-purple-600" />
                    Demo Admin
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleDemoLogin('student')}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all text-xs font-bold"
                  >
                    <GraduationCap size={16} className="text-blue-600" />
                    Demo Student
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Full Name</label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="text" 
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Akhil Kumar S"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Department</label>
                      <div className="relative">
                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select
                          value={selectedDept}
                          onChange={(e) => setSelectedDept(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none text-slate-700"
                        >
                          {DEPARTMENTS.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 rotate-90" size={16} />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="name@pec.edu.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="password" 
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Role Selector */}
                {mode === 'signup' && (
                  <div className="pt-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-2">
                      Select Role
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['student', 'lead', 'faculty', 'admin'] as Role[]).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setSelectedRole(r)}
                          className={`text-xs py-2 rounded-lg border capitalize transition-all ${
                            selectedRole === r 
                              ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center space-x-2 mt-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-slate-500 text-sm">
                  {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                  <button 
                    onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    {mode === 'login' ? 'Sign Up' : 'Log In'}
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;