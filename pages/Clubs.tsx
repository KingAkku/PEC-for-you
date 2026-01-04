import React, { useState } from 'react';
import { MOCK_CLUBS } from '../constants';
import { User, Club } from '../types';
import { motion } from 'framer-motion';
import ClubCard from '../components/ClubCard';

interface ClubsProps {
  user: User | null;
  onViewClub: (club: Club) => void;
}

const Clubs: React.FC<ClubsProps> = ({ user, onViewClub }) => {
  const [clubs, setClubs] = useState(MOCK_CLUBS);

  const handleManage = (clubName: string) => {
     alert(`Opening management dashboard for ${clubName}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="pt-32 px-4 max-w-7xl mx-auto min-h-screen pb-20"
    >
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h2 className="text-4xl font-display text-slate-900">Student Communities</h2>
        <p className="text-slate-500 mt-4 text-lg">
          Join a club to develop your skills, network with peers, and make your college life memorable.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {clubs.map((club, index) => (
          <ClubCard 
            key={club.id} 
            club={club} 
            index={index}
            onJoin={onViewClub}
            isAdmin={user?.role === 'admin' || user?.role === 'lead'} 
            onManage={() => handleManage(club.name)}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default Clubs;