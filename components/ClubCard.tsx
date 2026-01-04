import React from 'react';
import { Users, UserPlus, Settings, ExternalLink } from 'lucide-react';
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
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Banner */}
      <div className="h-48 overflow-hidden relative shrink-0 cursor-pointer" onClick={() => onJoin(club)}>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-80 z-10" />
        <img 
          src={club.image} 
          alt={club.name} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-5 left-5 z-20">
          <span className="bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-900 shadow-sm">
            {club.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-7 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3 cursor-pointer" onClick={() => onJoin(club)}>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{club.name}</h2>
          <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
            <Users size={16} className="text-gray-400" />
            <span>{club.memberCount}</span>
          </div>
        </div>

        <p className="text-gray-500 mb-8 line-clamp-3 text-sm leading-relaxed flex-grow cursor-pointer" onClick={() => onJoin(club)}>
          {club.description}
        </p>

        {/* Action Area */}
        <div className="flex gap-3 mt-auto pt-6 border-t border-gray-50">
          <button 
            onClick={() => onJoin(club)}
            className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-xl font-medium text-sm hover:bg-black transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95 flex items-center justify-center gap-2"
          >
            <UserPlus size={18} /> 
            <span>Join Club</span>
          </button>
          
          {isAdmin ? (
            <button 
              onClick={onManage}
              className="p-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 transition-all active:scale-95"
              title="Manage Club"
            >
              <Settings size={20} />
            </button>
          ) : (
            <button 
              onClick={() => onJoin(club)}
              className="p-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 transition-all active:scale-95"
            >
               <ExternalLink size={20} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ClubCard;