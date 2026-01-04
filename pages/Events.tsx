import React, { useState, useMemo, useEffect } from 'react';
import { User, Event } from '../types';
import { MOCK_CLUBS } from '../constants';
import { Calendar, MapPin, Users, Plus, ArrowRight, Search, Filter, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EventsProps {
  user: User | null;
  events: Event[];
  onAddEvent: (event: Event) => void;
}

const CATEGORIES = ['All', 'Technical', 'Cultural', 'Workshop', 'Seminar', 'Hackathon'];

const Events: React.FC<EventsProps> = ({ user, events, onAddEvent }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClub, setSelectedClub] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
      title: '',
      date: '',
      description: '',
      location: '',
      category: 'Technical' as Event['category'],
      organizer: '',
      imageUrl: 'https://picsum.photos/400/205' // Default random placeholder
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Reset success state when modal opens/closes
  useEffect(() => {
    if (!showCreateModal) setIsSuccess(false);
  }, [showCreateModal]);

  // Set default organizer based on user role when modal opens
  useEffect(() => {
      if (showCreateModal && user) {
          let defaultOrganizer = '';
          if (user.role === 'lead' && user.clubId) {
             const club = MOCK_CLUBS.find(c => c.id === user.clubId);
             defaultOrganizer = club ? club.name : '';
          } else if (user.role === 'faculty') {
              defaultOrganizer = user.department || 'Faculty';
          }
          setFormData(prev => ({ ...prev, organizer: defaultOrganizer }));
      }
  }, [showCreateModal, user]);

  // Authorization check: Admin, Faculty, and Leads can create events
  const canCreateEvent = user && ['admin', 'faculty', 'lead'].includes(user.role);

  // Extract unique organizers for filter
  const organizers = useMemo(() => {
    const orgs = new Set(events.map(e => e.organizer));
    return ['All', ...Array.from(orgs)];
  }, [events]);

  // Filter events based on search query, selected club, and selected category
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClub = selectedClub === 'All' || event.organizer === selectedClub;
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    
    return matchesSearch && matchesClub && matchesCategory;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newEvent: Event = {
          id: Date.now().toString(),
          title: formData.title,
          date: formData.date, // In real app, format this nicely
          description: formData.description,
          location: formData.location,
          category: formData.category,
          organizer: formData.organizer || 'Unknown',
          imageUrl: formData.imageUrl,
          registeredCount: 0
      };
      
      onAddEvent(newEvent);
      setIsSuccess(true);
      
      // Close modal after success animation
      setTimeout(() => {
        setShowCreateModal(false);
        // Reset form
        setFormData({
            title: '',
            date: '',
            description: '',
            location: '',
            category: 'Technical',
            organizer: '',
            imageUrl: 'https://picsum.photos/400/205'
        });
      }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="pt-32 px-4 max-w-7xl mx-auto min-h-screen pb-20"
    >
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
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

      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-6 mb-12">
        <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
                type="text" 
                placeholder="Search for events..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 shadow-sm transition-all text-slate-700 placeholder:text-slate-400 font-medium"
            />
            </div>
            
            <div className="relative min-w-[240px]">
                <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <select 
                    value={selectedClub}
                    onChange={(e) => setSelectedClub(e.target.value)}
                    className="w-full pl-14 pr-12 py-4 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 shadow-sm appearance-none cursor-pointer transition-all text-slate-700 font-medium"
                >
                    {organizers.map(org => (
                        <option key={org} value={org}>
                            {org === 'All' ? 'All Organizers' : org}
                        </option>
                    ))}
                </select>
                {/* Custom chevron */}
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
            </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-3">
            {CATEGORIES.map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${
                        selectedCategory === cat 
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, idx) => (
              <motion.div 
                layout
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
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
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm text-slate-900">
                    {event.organizer}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur text-white px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                    {event.category}
                  </div>
                </div>

                {/* Date Block */}
                <div className="hidden md:flex flex-col items-center justify-center w-24 shrink-0 border-r border-slate-100 pr-6">
                  {/* Handle potentially unformatted dates gracefully */}
                  <span className="text-xl font-display text-slate-900 break-words text-center">{event.date}</span>
                </div>

                {/* Content */}
                <div className="flex-grow py-4 px-4 md:px-0 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{event.title}</h3>
                  <p className="text-slate-500 text-sm mb-6 max-w-2xl line-clamp-2">{event.description}</p>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium text-slate-500">
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      <MapPin size={16} className="text-slate-400" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
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
                          ? 'bg-slate-100 text-slate-900 hover:bg-slate-900 hover:text-white shadow-sm hover:shadow-md' 
                          : 'bg-slate-50 text-slate-300 cursor-not-allowed'
                      }`}
                      disabled={!user}
                      title={!user ? "Login to register" : "Register for event"}
                    >
                      <ArrowRight size={24} className={!user ? "opacity-50" : ""} />
                    </button>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-slate-200"
            >
                <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                    <Search size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No events found</h3>
                <p className="text-slate-500 mt-2">We couldn't find any events matching your filters.</p>
                <button 
                    onClick={() => { setSearchQuery(''); setSelectedClub('All'); setSelectedCategory('All'); }}
                    className="mt-6 text-slate-900 font-bold hover:underline"
                >
                    Clear Filters
                </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-md">
          <div className="bg-white rounded-[2rem] shadow-2xl p-8 w-full max-w-lg animate-in zoom-in-95 duration-200 border border-white/50 relative overflow-y-auto max-h-[90vh]">
            <button 
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
                <X size={20} />
            </button>
            
            {isSuccess ? (
              <div className="py-20 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-3xl font-display text-slate-900 mb-2">Published!</h3>
                <p className="text-slate-500">Your event is now live on the calendar.</p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-slate-900 mb-6 font-display">Create New Event</h3>
                <form onSubmit={handleCreateSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Event Title</label>
                    <input 
                        type="text" 
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50" 
                        placeholder="e.g. Hackathon 2024" 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Date</label>
                        <input 
                            type="date" 
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50" 
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Category</label>
                        <select
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50"
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value as Event['category']})}
                        >
                            {CATEGORIES.filter(c => c !== 'All').map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                      </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Location</label>
                    <input 
                        type="text" 
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50" 
                        placeholder="e.g. Main Auditorium"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Organizer</label>
                    <input 
                        type="text" 
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50" 
                        placeholder="Club or Dept Name"
                        value={formData.organizer}
                        onChange={(e) => setFormData({...formData, organizer: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Description</label>
                    <textarea 
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50" 
                        rows={3}
                        placeholder="Event details..."
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                  </div>

                  <div className="flex justify-end space-x-3 mt-8">
                      <button type="button" onClick={() => setShowCreateModal(false)} className="px-6 py-3 text-slate-500 hover:text-slate-900 font-bold text-sm">Cancel</button>
                      <button type="submit" className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black shadow-lg">Publish</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Events;