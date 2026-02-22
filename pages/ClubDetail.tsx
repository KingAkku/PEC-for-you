
import React, { useEffect, useState } from 'react';
import { Club, User, Event } from '../types';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Calendar, Award, UserPlus, Globe, Mail, Instagram, Linkedin, MessageSquare, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ClubDetailProps {
  club: Club;
  onBack: () => void;
  user: User | null;
}

const ClubDetail: React.FC<ClubDetailProps> = ({ club, onBack, user }) => {
  const [clubEvents, setClubEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchClubEvents();
  }, [club.name]);

  const fetchClubEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('club_id', club.id)
        .order('date', { ascending: true });
      
      if (error) throw error;
      
      const mappedEvents = (data || []).map((e: any) => ({
        id: e.id,
        title: e.title,
        description: e.description,
        date: e.date,
        location: e.location,
        organizer: e.organizer,
        imageUrl: e.image_url,
        registeredCount: e.registered_count,
        category: e.category,
        clubId: e.club_id
      }));
      
      setClubEvents(mappedEvents);
    } catch (e) {
      console.error("Error fetching club events:", e);
    } finally {
      setLoadingEvents(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50 pb-20"
    >
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

        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 z-20 flex flex-col md:flex-row items-end justify-between gap-8">
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
                <span>Active Community</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full md:w-auto"
          >
            <button className="px-8 py-3.5 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 whitespace-nowrap">
              Join Community
            </button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About Us</h2>
              <p className="text-slate-600 leading-relaxed text-lg mb-6">
                {club.description}
              </p>
            </motion.div>

            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Events by {club.name}</h2>
              </div>
              
              {loadingEvents ? (
                <div className="text-center py-10 text-slate-400">Loading events...</div>
              ) : clubEvents.length > 0 ? (
                <div className="space-y-4">
                  {clubEvents.map((event) => (
                    <div key={event.id} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-slate-100/50">
                      <div className="w-16 h-16 bg-slate-900 rounded-xl flex flex-col items-center justify-center text-white shrink-0">
                        <Calendar size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">{event.title}</h3>
                        <p className="text-slate-500 text-sm">{event.date} • {event.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
                  No events listed for this club yet.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
            >
              <h3 className="font-bold text-slate-900 mb-4">Connect</h3>
              <div className="space-y-3">
                <a href="#" className="flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-colors p-2 hover:bg-slate-50 rounded-lg">
                  <Globe size={18} />
                  <span className="font-medium">Official Website</span>
                </a>
                <a href="#" className="flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-colors p-2 hover:bg-slate-50 rounded-lg">
                  <Instagram size={18} />
                  <span className="font-medium">Instagram</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ClubDetail;
