import React, { useState, useEffect } from 'react';
import { User, Club } from '../types';
import { motion } from 'framer-motion';
import ClubCard from '../components/ClubCard';
import { supabase } from '../lib/supabase';
import { Search } from 'lucide-react';
import { MOCK_CLUBS } from '../constants';

interface ClubsProps {
  user: User | null;
  onViewClub: (club: Club) => void;
}

const Clubs: React.FC<ClubsProps> = ({ user, onViewClub }) => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      // 1. Fetch Clubs
      const { data: clubsData, error: clubsError } = await supabase
        .from('clubs')
        .select('*');
      
      if (clubsError) throw clubsError;

      // 2. Fetch Profiles to calculate real member counts
      // We fetch all profiles that have a club_id assigned
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('club_id')
        .not('club_id', 'is', null);

      if (profilesError) console.warn("Error fetching profile counts:", profilesError);

      // 3. Aggregate Counts
      const memberCounts: Record<string, number> = {};
      if (profilesData) {
        profilesData.forEach((p: any) => {
          if (p.club_id) {
            memberCounts[p.club_id] = (memberCounts[p.club_id] || 0) + 1;
          }
        });
      }

      // 4. Map Data
      const mappedClubs = (clubsData || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        logoInitial: c.logo_initial || c.name.charAt(0),
        memberCount: memberCounts[c.id] || 0, // Use real calculated count
        category: c.category,
        image: c.image
      }));
      
      setClubs(mappedClubs);
    } catch (error) {
      console.error("Unexpected error fetching clubs:", error);
      setClubs(MOCK_CLUBS);
    } finally {
      setLoading(false);
    }
  };

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

      {loading ? (
        <div className="text-center py-20 text-slate-500">
             <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-4"></div>
             Loading communities...
        </div>
      ) : clubs.length > 0 ? (
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
      ) : (
        <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-slate-200">
            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                <Search size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No clubs found</h3>
            <p className="text-slate-500 mt-2">There are currently no active clubs listed.</p>
        </div>
      )}
    </motion.div>
  );
};

export default Clubs;