import React, { useState } from 'react';
import { MOCK_EVENTS } from '../constants';
import { User } from '../types';
import { Calendar, MapPin, Users, Plus, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface EventsProps {
  user: User | null;
}

const Events: React.FC<EventsProps> = ({ user }) => {
  const [events] = useState(MOCK_EVENTS);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Authorization check: Admin, Faculty, and Leads can create events
  const canCreateEvent = user && ['admin', 'faculty', 'lead'].includes(user.role);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="pt-32 px-4 max-w-7xl mx-auto min-h-screen pb-20"
    >
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div>
          <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-2 block">Calendar</span>
          <h2 className="text-5xl font-display text-slate-900">Upcoming Events</h2>
          <p className="text-slate-500 mt-4 text-lg max-w-lg">
            Join the most anticipated workshops, seminars, and cultural fests happening on campus.
          </p>
        </div>
        {canCreateEvent && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-3 bg-slate-900 text-white px-8 py-4 rounded-full hover:bg-black transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            <Plus size={20} />
            <span className="font-bold">Create Event</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {events.map((event, idx) => (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            key={event.id} 
            className="group bg-white rounded-3xl p-2 pr-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row items-center gap-6 md:gap-10"
          >
            {/* Image */}
            <div className="w-full md:w-64 h-64 md:h-48 rounded-[1.25rem] overflow-hidden shrink-0 relative">
               <img 
                src={event.imageUrl} 
                alt={event.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {event.organizer}
              </div>
            </div>

            {/* Date Block */}
            <div className="hidden md:flex flex-col items-center justify-center w-24 shrink-0 border-r border-slate-100 pr-6">
              <span className="text-3xl font-display text-slate-900">{event.date.split(' ')[1].replace(',', '')}</span>
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{event.date.split(' ')[0]}</span>
            </div>

            {/* Content */}
            <div className="flex-grow py-4 px-4 md:px-0 text-center md:text-left">
              <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{event.title}</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-2xl line-clamp-2">{event.description}</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium text-slate-500">
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg">
                  <Calendar size={16} className="text-slate-400" />
                  <span className="md:hidden">{event.date}</span>
                  <span className="hidden md:inline">Time TBA</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg">
                  <MapPin size={16} className="text-slate-400" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg">
                  <Users size={16} className="text-slate-400" />
                  <span>{event.registeredCount} Registered</span>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="shrink-0 pb-6 md:pb-0">
               <button 
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    user 
                      ? 'bg-slate-100 text-slate-900 hover:bg-slate-900 hover:text-white' 
                      : 'bg-slate-50 text-slate-300 cursor-not-allowed'
                  }`}
                  disabled={!user}
                >
                  <ArrowRight size={24} className={!user ? "opacity-50" : ""} />
                </button>
            </div>
          </motion.div>
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-md">
          <div className="bg-white rounded-[2rem] shadow-2xl p-8 w-full max-w-md animate-in zoom-in-95 duration-200 border border-white/50">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 font-display">Create New Event</h3>
            <div className="space-y-4">
               <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Event Title</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50" placeholder="e.g. Hackathon 2024" />
               </div>
               <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Date</label>
                <input type="date" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50" />
               </div>
               <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Description</label>
                <textarea className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50" rows={3}></textarea>
               </div>
            </div>
            <div className="flex justify-end space-x-3 mt-8">
              <button onClick={() => setShowCreateModal(false)} className="px-6 py-3 text-slate-500 hover:text-slate-900 font-bold text-sm">Cancel</button>
              <button onClick={() => { alert('Event Created!'); setShowCreateModal(false); }} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black shadow-lg">Publish</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Events;