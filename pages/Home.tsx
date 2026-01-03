import React from 'react';
import Hero from '../components/Hero';
import NoticeBoard from '../components/NoticeBoard';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      <Hero />
      <div className="relative z-10 -mt-20">
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
    </motion.div>
  );
};

export default Home;
