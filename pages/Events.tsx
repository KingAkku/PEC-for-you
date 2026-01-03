import React, { useState } from 'react';
import { MOCK_EVENTS } from '../constants';
import { User } from '../types';
import { Calendar, MapPin, Users, Plus, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface EventsProps {
  user: User;
}

const Events: React.FC<EventsProps> = ({ user }) => {
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Authorization check: Admin, Faculty, and Leads can create events
  const canCreateEvent = ['admin', 'faculty', 'lead'].includes(user.role);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="pt-32 px-4 max-w-7xl mx-auto min-h-screen"
    >
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-bold text-slate-900">Upcoming Events</h2>
          <p className="text-slate-500 mt-2">Discover workshops, seminars, and cultural fests.</p>
        </div>
        {canCreateEvent && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus size={18} />
            <span>Create Event</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group">
            <div className="h-48 overflow-hidden relative">
              <img 
                src={event.imageUrl} 
                alt={event.title} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-slate-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                {event.organizer}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">{event.title}</h3>
              <p className="text-slate-500 text-sm mb-4 line-clamp-2">{event.description}</p>
              
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center space-x-3">
                  <Calendar size={16} className="text-blue-500" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin size={16} className="text-red-500" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users size={16} className="text-green-500" />
                  <span>{event.registeredCount} registered</span>
                </div>
              </div>

              <div className="mt-6">
                <button className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all">
                  Register Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Mock Modal for Event Creation */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Create New Event</h3>
            <div className="space-y-4">
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Event Title</label>
                <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Hackathon 2024" />
               </div>
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input type="date" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
               </div>
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3}></textarea>
               </div>
            </div>
            <div className="flex justify-end space-x-3 mt-8">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-slate-500 hover:text-slate-800 font-medium">Cancel</button>
              <button onClick={() => { alert('Event Created!'); setShowCreateModal(false); }} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800">Publish Event</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Events;
