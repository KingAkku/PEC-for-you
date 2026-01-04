import React from 'react';
import Hero from '../components/Hero';
import NoticeBoard from '../components/NoticeBoard';
import { motion } from 'framer-motion';
import { Bell, Calendar, Users, ArrowRight } from 'lucide-react';

interface HomeProps {
  onNavigate: (view: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      <Hero onNavigate={onNavigate} />
      {/* Removed negative margin so NoticeBoard starts below the full-screen Hero */}
      <div className="relative z-10 bg-white/30 backdrop-blur-sm">
        <NoticeBoard />
      </div>
      
      {/* Quick Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Active Students', value: '1,200+' },
              { label: 'Registered Clubs', value: '15' },
              { label: 'Events Hosted', value: '340+' },
              { label: 'Awards Won', value: '45' },
            ].map((stat, idx) => (
              <div key={idx} className="p-4">
                <div className="text-3xl md:text-4xl font-black text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500 uppercase tracking-widest font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-24 bg-slate-50/50 border-t border-slate-100 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight font-display">
              Everything you need, all in one place.
            </h2>
            <p className="text-slate-500 text-lg">
              Access campus resources, join communities, and stay updated with the latest happenings at PEC.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: Live Notices */}
            <motion.div 
               whileHover={{ y: -5 }}
               className="p-8 rounded-3xl bg-white shadow-sm border border-gray-100 relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Bell size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Live Notices</h3>
                  <p className="text-slate-500 leading-relaxed mb-6">
                      Real-time updates from administration and departments. Never miss a deadline again.
                  </p>
                  <button className="flex items-center text-red-600 font-bold text-sm group-hover:gap-2 transition-all gap-1">
                      Read Updates <ArrowRight size={16} />
                  </button>
                </div>
            </motion.div>

            {/* Feature 2: Event Registration */}
            <motion.div 
               whileHover={{ y: -5 }}
               onClick={() => onNavigate('events')}
               className="p-8 rounded-3xl bg-white shadow-sm border border-gray-100 relative overflow-hidden group cursor-pointer"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Calendar size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Event Registration</h3>
                  <p className="text-slate-500 leading-relaxed mb-6">
                      Discover workshops, hackathons, and seminars. One-click registration for students.
                  </p>
                  <button className="flex items-center text-blue-600 font-bold text-sm group-hover:gap-2 transition-all gap-1">
                      View Events <ArrowRight size={16} />
                  </button>
                </div>
            </motion.div>

            {/* Feature 3: Club Communities */}
            <motion.div 
               whileHover={{ y: -5 }}
               onClick={() => onNavigate('clubs')}
               className="p-8 rounded-3xl bg-white shadow-sm border border-gray-100 relative overflow-hidden group cursor-pointer"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Users size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Club Communities</h3>
                  <p className="text-slate-500 leading-relaxed mb-6">
                      Join active technical and cultural clubs. Manage memberships and showcase projects.
                  </p>
                  <button className="flex items-center text-purple-600 font-bold text-sm group-hover:gap-2 transition-all gap-1">
                      Find a Club <ArrowRight size={16} />
                  </button>
                </div>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;