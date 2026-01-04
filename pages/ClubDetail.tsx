import React, { useEffect } from 'react';
import { Club, User } from '../types';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Calendar, Award, UserPlus, Globe, Mail, Instagram, Linkedin, MessageSquare, ExternalLink } from 'lucide-react';
import { MOCK_EVENTS } from '../constants';

interface ClubDetailProps {
  club: Club;
  onBack: () => void;
  user: User | null;
}

const ClubDetail: React.FC<ClubDetailProps> = ({ club, onBack, user }) => {
  // Mock data specifically for this view
  const clubEvents = MOCK_EVENTS.slice(0, 2); // Just take first 2 as mock events for the club
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50 pb-20"
    >
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] rounded-b-[3rem] overflow-hidden shadow-md">
        <div className="absolute inset-0">
          <img 
            src={club.image} 
            alt={club.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]" />
        </div>

        <div className="absolute top-48 left-4 z-50">
          <button 
            onClick={onBack}
            className="bg-white/20 backdrop-blur-md border border-white/30 text-white p-3 rounded-full hover:bg-white/30 transition-all group"
          >
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Content Container */}
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 z-20 flex flex-col md:flex-row items-end justify-between gap-8">
          
          {/* Left Side: Title & Stats */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-1"
          >
            <span className="bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-100 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block shadow-sm">
              {club.category}
            </span>
            <h1 className="text-5xl md:text-7xl font-display text-white mb-4 tracking-tight drop-shadow-lg">{club.name}</h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90 font-medium">
              <div className="flex items-center gap-2">
                <Users size={20} className="text-blue-400" />
                <span>{club.memberCount} Members</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-purple-400" />
                <span>Founded 2018</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={20} className="text-yellow-400" />
                <span>Top Performer '23</span>
              </div>
            </div>
          </motion.div>

          {/* Right Side: CTA Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full md:w-auto"
          >
            <button className="px-8 py-3.5 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 whitespace-nowrap">
              Join Community
            </button>
            <button className="px-8 py-3.5 bg-black/30 backdrop-blur-md border border-white/20 text-white rounded-full font-bold hover:bg-black/50 transition-all flex items-center justify-center gap-2 whitespace-nowrap">
              Visit Website <ExternalLink size={16} />
            </button>
          </motion.div>

        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About Us</h2>
              <p className="text-slate-600 leading-relaxed text-lg mb-6">
                {club.description} This club provides a platform for students to explore their interests, enhance their technical skills, and connect with like-minded peers. We organize weekly workshops, hackathons, and industry interaction sessions to bridge the gap between academic learning and practical application.
              </p>
              <p className="text-slate-600 leading-relaxed text-lg">
                Whether you are a beginner looking to learn the basics or an expert aiming to master advanced concepts, our community supports your journey at every step. Join us to be part of an ecosystem that fosters innovation and leadership.
              </p>
              
              <div className="flex gap-4 mt-8">
                <button className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-all hover:shadow-lg flex items-center justify-center gap-2">
                  <UserPlus size={20} />
                  <span>Apply for Membership</span>
                </button>
                <button className="px-6 py-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all text-slate-700 font-bold">
                  <MessageSquare size={20} />
                </button>
              </div>
            </motion.div>

            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Upcoming Events</h2>
                <button className="text-blue-600 font-medium hover:underline">View All</button>
              </div>
              <div className="space-y-4">
                {clubEvents.map((event) => (
                  <div key={event.id} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-slate-100/50">
                    <div className="w-16 h-16 bg-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-600 shrink-0">
                      <span className="text-xs font-bold uppercase">{event.date.split(' ')[0]}</span>
                      <span className="text-xl font-bold">{event.date.split(' ')[1].replace(',', '')}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{event.title}</h3>
                      <p className="text-slate-500 text-sm">{event.location} • {event.organizer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
            >
              <h3 className="font-bold text-slate-900 mb-4">Connect</h3>
              <div className="space-y-3">
                <a href="#" className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg">
                  <Globe size={18} />
                  <span className="font-medium">Website</span>
                </a>
                <a href="#" className="flex items-center gap-3 text-slate-600 hover:text-pink-600 transition-colors p-2 hover:bg-pink-50 rounded-lg">
                  <Instagram size={18} />
                  <span className="font-medium">Instagram</span>
                </a>
                <a href="#" className="flex items-center gap-3 text-slate-600 hover:text-blue-700 transition-colors p-2 hover:bg-blue-50 rounded-lg">
                  <Linkedin size={18} />
                  <span className="font-medium">LinkedIn</span>
                </a>
                <a href="#" className="flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-colors p-2 hover:bg-slate-50 rounded-lg">
                  <Mail size={18} />
                  <span className="font-medium">Contact Lead</span>
                </a>
              </div>
            </motion.div>

            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 shadow-lg text-white"
            >
              <h3 className="font-bold text-lg mb-2">Lead's Corner</h3>
              <p className="text-blue-100 text-sm mb-4 leading-relaxed">
                "We believe in the power of community. Join us to transform your ideas into reality."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/20">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center font-bold">
                  JD
                </div>
                <div>
                  <div className="font-bold text-sm">John Doe</div>
                  <div className="text-blue-200 text-xs">Club Lead</div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default ClubDetail;