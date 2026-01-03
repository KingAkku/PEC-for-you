import React from 'react';
import { MOCK_NOTICES } from '../constants';
import { Notice } from '../types';
import { AlertCircle, Calendar, FileText, Zap } from 'lucide-react';

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
      <p className="text-slate-500 text-sm leading-relaxed">
        {notice.content}
      </p>
    </div>
  );
};

const NoticeBoard: React.FC = () => {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Digital Notice Board</h2>
          <p className="text-slate-500 mt-2">Latest updates from the administration desk.</p>
        </div>
        <button className="hidden md:block text-blue-600 font-medium hover:underline">View Archived &rarr;</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_NOTICES.map((notice) => (
          <NoticeCard key={notice.id} notice={notice} />
        ))}
      </div>
      <div className="md:hidden mt-6 text-center">
         <button className="text-blue-600 font-medium hover:underline">View Archived &rarr;</button>
      </div>
    </section>
  );
};

export default NoticeBoard;
