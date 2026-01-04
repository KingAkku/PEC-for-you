import React, { useState } from 'react';
import { Notice, User } from '../types';
import { AlertCircle, Calendar, FileText, Zap, PlusCircle, X } from 'lucide-react';

const NoticeCard: React.FC<{ notice: Notice }> = ({ notice }) => {
  const getIcon = () => {
    switch (notice.category) {
      case 'urgent': return <AlertCircle className="text-red-500" />;
      case 'event': return <Zap className="text-yellow-500" />;
      case 'exam': return <FileText className="text-blue-500" />;
      default: return <Calendar className="text-slate-500" />;
    }
  };

  const getBorderColor = () => {
    switch (notice.category) {
      case 'urgent': return 'border-l-4 border-l-red-500';
      case 'event': return 'border-l-4 border-l-yellow-400';
      case 'exam': return 'border-l-4 border-l-blue-400';
      default: return 'border-l-4 border-l-slate-300';
    }
  };

  return (
    <div className={`group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-5 border border-slate-100 ${getBorderColor()}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="p-2 bg-slate-50 rounded-lg group-hover:scale-110 transition-transform">
          {getIcon()}
        </div>
        <span className="text-xs font-mono text-slate-400">{notice.date}</span>
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
        {notice.title}
      </h3>
      <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-line">
        {notice.content}
      </p>
    </div>
  );
};

interface NoticeBoardProps {
    user?: User | null;
    notices: Notice[];
    onAddNotice: (notice: Notice) => void;
}

const NoticeBoard: React.FC<NoticeBoardProps> = ({ user, notices, onAddNotice }) => {
  const canPost = user && (user.role === 'admin' || user.role === 'faculty');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
      title: '',
      content: '',
      category: 'general' as Notice['category'],
      date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newNotice: Notice = {
          id: `temp-${Date.now()}`,
          ...formData
      };
      onAddNotice(newNotice);
      setIsModalOpen(false);
      setFormData({
          title: '',
          content: '',
          category: 'general',
          date: new Date().toISOString().split('T')[0]
      });
  };

  return (
    <section id="notice-board" className="py-20 px-4 max-w-7xl mx-auto scroll-mt-24">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            </span>
            <h2 className="text-3xl font-display text-slate-900 tracking-tight">Digital Notice Board</h2>
          </div>
          <p className="text-slate-500 mt-2">Latest updates, emergency alerts, and scholarship deadlines.</p>
        </div>
        <div className="flex items-center gap-4">
            {canPost && (
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-black transition-colors shadow-md"
                >
                    <PlusCircle size={18} />
                    <span>Post Notice</span>
                </button>
            )}
            <button className="hidden md:block text-blue-600 font-medium hover:underline">View Archived &rarr;</button>
        </div>
      </div>
      
      {notices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {notices.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} />
            ))}
          </div>
      ) : (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
             <p className="text-slate-400 font-medium">No active notices.</p>
          </div>
      )}

      <div className="md:hidden mt-6 text-center">
         <button className="text-blue-600 font-medium hover:underline">View Archived &rarr;</button>
      </div>

      {/* Post Notice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-md">
            <div className="bg-white rounded-[2rem] shadow-2xl p-8 w-full max-w-md animate-in zoom-in-95 duration-200 border border-white/50 relative">
                <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                >
                    <X size={20} />
                </button>
                <h3 className="text-2xl font-bold text-slate-900 mb-6 font-display">Post New Notice</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Title</label>
                        <input 
                            type="text" 
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50" 
                            placeholder="e.g. Exam Rescheduled"
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
                                onChange={(e) => setFormData({...formData, category: e.target.value as Notice['category']})}
                            >
                                <option value="general">General</option>
                                <option value="urgent">Urgent</option>
                                <option value="exam">Exam</option>
                                <option value="event">Event</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Content</label>
                        <textarea 
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50 min-h-[100px]" 
                            rows={3}
                            placeholder="Enter notice details..."
                            value={formData.content}
                            onChange={(e) => setFormData({...formData, content: e.target.value})}
                        ></textarea>
                    </div>
                    <div className="flex justify-end space-x-3 mt-8 pt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-slate-500 hover:text-slate-900 font-bold text-sm">Cancel</button>
                        <button type="submit" className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black shadow-lg">Post Now</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </section>
  );
};

export default NoticeBoard;