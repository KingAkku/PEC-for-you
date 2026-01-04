import React from 'react';
import { MOCK_NOTICES } from '../constants';
import { Notice } from '../types';
import { AlertCircle, Calendar, FileText, Zap, ChevronRight } from 'lucide-react';

const NoticeCard: React.FC<{ notice: Notice }> = ({ notice }) => {
  const getIcon = () => {
    switch (notice.category) {
      case 'urgent': return <AlertCircle className="text-rose-500" size={20} />;
      case 'event': return <Zap className="text-amber-500" size={20} />;
      case 'exam': return <FileText className="text-blue-500" size={20} />;
      default: return <Calendar className="text-slate-400" size={20} />;
    }
  };

  return (
    <div className="group relative bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-sm hover:shadow-glass-hover transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${
          notice.category === 'urgent' ? 'bg-rose-50' : 
          notice.category === 'event' ? 'bg-amber-50' : 
          notice.category === 'exam' ? 'bg-blue-50' : 'bg-slate-50'
        }`}>
          {getIcon()}
        </div>
        <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100">
          {notice.date}
        </span>
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">
        {notice.title}
      </h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-4">
        {notice.content}
      </p>
      <div className="flex items-center text-xs font-bold text-slate-400 group-hover:text-slate-900 transition-colors uppercase tracking-wider cursor-pointer">
        Read More <ChevronRight size={14} className="ml-1" />
      </div>
    </div>
  );
};

const NoticeBoard: React.FC = () => {
  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-display text-slate-900 tracking-tight mb-3">Notice Board</h2>
          <p className="text-slate-500 max-w-md text-lg">Stay updated with the latest announcements, schedules, and alerts from the campus.</p>
        </div>
        <button className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm">
          View Archives <ChevronRight size={16} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_NOTICES.map((notice) => (
          <NoticeCard key={notice.id} notice={notice} />
        ))}
      </div>
      
      <div className="md:hidden mt-8 text-center">
         <button className="text-slate-900 font-bold underline">View Archives</button>
      </div>
    </section>
  );
};

export default NoticeBoard;