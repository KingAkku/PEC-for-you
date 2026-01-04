import React, { useState } from 'react';
import { MOCK_CLUBS } from '../constants';
import { User } from '../types';
import { Users, Shield, UserPlus, Star, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface ClubsProps {
  user: User | null;
}

const Clubs: React.FC<ClubsProps> = ({ user }) => {
  const [clubs, setClubs] = useState(MOCK_CLUBS);

  // Logic for buttons based on role
  const canMentor = user?.role === 'faculty';
  const canAddMembers = user?.role === 'admin' || user?.role === 'lead';
  
  const handleJoin = (clubName: string) => {
    alert(`Request sent to join ${clubName}`);
  };

  const handleMentor = (clubName: string) => {
    alert(`You are now mentoring ${clubName}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="pt-32 px-4 max-w-7xl mx-auto min-h-screen"
    >
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h2 className="text-4xl font-display text-slate-900">Student Communities</h2>
        <p className="text-slate-500 mt-4 text-lg">
          Join a club to develop your skills, network with peers, and make your college life memorable.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((club) => (
          <div key={club.id} className="relative bg-white/60 backdrop-blur-md border border-white/50 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group">
            
            {/* Glass decoration */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent rounded-2xl pointer-events-none"></div>

            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-lg mb-6 z-10 transform group-hover:-translate-y-2 transition-transform duration-300 ${
              club.name === 'Mulearn' ? 'bg-orange-500' :
              club.name === 'IEEE' ? 'bg-blue-600' :
              club.name === 'IEDC' ? 'bg-indigo-600' :
              club.name === 'CSI' ? 'bg-sky-500' :
              'bg-emerald-500'
            }`}>
              {club.logoInitial}
            </div>

            <h3 className="text-2xl font-bold text-slate-800 z-10">{club.name}</h3>
            <p className="text-slate-500 mt-3 mb-6 text-sm leading-relaxed z-10">
              {club.description}
            </p>

            <div className="flex items-center space-x-2 text-slate-400 text-sm font-medium mb-8 z-10">
              <Users size={16} />
              <span>{club.membersCount} Active Members</span>
            </div>

            <div className="mt-auto w-full z-10 space-y-3">
              {user ? (
                <button 
                  onClick={() => handleJoin(club.name)}
                  className="w-full py-3 rounded-xl bg-slate-900 text-white font-medium shadow-lg hover:bg-slate-800 hover:shadow-slate-900/20 transition-all flex items-center justify-center space-x-2"
                >
                  <UserPlus size={18} />
                  <span>Join Club</span>
                </button>
              ) : (
                <button 
                  disabled
                  className="w-full py-3 rounded-xl bg-slate-100 text-slate-400 font-medium cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Lock size={16} />
                  <span>Login to Join</span>
                </button>
              )}

              {canMentor && (
                <button 
                  onClick={() => handleMentor(club.name)}
                  className="w-full py-3 rounded-xl border border-purple-200 text-purple-700 font-medium hover:bg-purple-50 transition-all flex items-center justify-center space-x-2"
                >
                  <Star size={18} />
                  <span>Become Mentor</span>
                </button>
              )}

              {canAddMembers && (
                 <button className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-all flex items-center justify-center space-x-2">
                  <Shield size={18} />
                  <span>Manage Members</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Clubs;