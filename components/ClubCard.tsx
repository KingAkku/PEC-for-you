import React from 'react';
import { Users, ArrowUpRight, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { Club } from '../types';

interface ClubCardProps {
  club: Club;
  onJoin: (club: Club) => void;
  isAdmin?: boolean;
  onManage?: () => void;
  index?: number;
}

const ClubCard: React.FC<ClubCardProps> = ({ club, onJoin, isAdmin, onManage, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
    >
      {/* Image Banner */}
      <div className="h-64 overflow-hidden relative shrink-0 cursor-pointer" onClick={() => onJoin(club)}>
        <img 
          src={club.image} 
          alt={club.name} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 saturate-0 group-hover:saturate-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 transition-opacity" />
        
        <div className="absolute top-6 left-6 z-20">
          <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-900 shadow-sm border border-white">
            {club.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col flex-grow bg-white relative">
        {/* Floating Action Button */}
        <button 
          onClick={() => onJoin(club)}
          className="absolute -top-8 right-8 w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 hover:bg-black transition-all duration-300 z-30 group-hover:rotate-45"
        >
          <ArrowUpRight size={24} />
        </button>

        <div className="mb-4">
          <h2 className="text-3xl font-display text-slate-900 mb-2">{club.name}</h2>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium bg-slate-50 inline-flex px-3 py-1 rounded-full">
            <Users size={14} />
            <span>{club.memberCount} Members</span>
          </div>
        </div>

        <p className="text-slate-500 mb-8 line-clamp-3 text-sm leading-relaxed flex-grow">
          {club.description}
        </p>

        {isAdmin && (
          <div className="pt-6 border-t border-slate-50 mt-auto">
             <button 
              onClick={onManage}
              className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all text-sm font-bold flex items-center justify-center gap-2"
            >
              <Settings size={16} /> Manage Club
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ClubCard;