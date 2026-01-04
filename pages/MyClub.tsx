import React, { useState, useEffect } from 'react';
import { User, Club } from '../types';
import { MOCK_CLUBS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Users, Plus, Save, Upload, X, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface MyClubProps {
  user: User;
}

const MyClub: React.FC<MyClubProps> = ({ user }) => {
  const [clubData, setClubData] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  // New Member Form State
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Member');

  const [members, setMembers] = useState<{id: string, name: string, role: string, joined: string}[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchClubData();
  }, [user.clubId]);

  const fetchClubData = async () => {
    if (!user.clubId) {
        setLoading(false);
        return;
    }

    try {
        // 1. Fetch Club Details
        const { data: club, error: clubError } = await supabase
            .from('clubs')
            .select('*')
            .eq('id', user.clubId)
            .single();

        if (clubError) throw clubError;

        // 2. Fetch Real Member Count
        const { count, error: countError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('club_id', user.clubId);

        // 3. Set Club Data
        setClubData({
            id: club.id,
            name: club.name,
            description: club.description,
            logoInitial: club.logo_initial,
            memberCount: count || 0, // Real Count
            category: club.category,
            image: club.image
        });

        // 4. Fetch Members List
        const { data: membersData } = await supabase
            .from('profiles')
            .select('id, name, role, created_at')
            .eq('club_id', user.clubId);

        if (membersData) {
            setMembers(membersData.map((m: any) => ({
                id: m.id,
                name: m.name,
                role: m.role === 'lead' ? 'Club Lead' : 'Member',
                joined: new Date(m.created_at).toLocaleDateString()
            })));
        }

    } catch (e) {
        console.error("Error fetching my club:", e);
        // Fallback to mock if absolutely necessary
        const mock = MOCK_CLUBS.find(c => c.id === user.clubId);
        if (mock) setClubData(mock);
    } finally {
        setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!clubData) return;

    try {
        const { error } = await supabase
            .from('clubs')
            .update({
                description: clubData.description,
                image: clubData.image
            })
            .eq('id', clubData.id);

        if (error) throw error;
        
        setIsEditing(false);
        triggerToast();
    } catch (e) {
        console.error("Error updating club:", e);
        alert("Failed to save changes.");
    }
  };

  const triggerToast = () => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddMember = async (e: React.FormEvent) => {
      e.preventDefault();
      // In a real app, this would probably invite a user via email.
      // For this demo, we'll just show the toast as if we added them to the UI list locally
      // since we can't create a 'Auth User' from here without admin API.
      
      if(newMemberName) {
          // Just update local state for demo purposes as we can't generate real users on the fly easily
          setMembers([...members, { 
              id: `temp-${Date.now()}`, 
              name: newMemberName, 
              role: newMemberRole, 
              joined: new Date().toLocaleDateString() 
          }]);
          setNewMemberName('');
          setShowAddMemberModal(false);
          triggerToast();
      }
  };

  if (loading) {
      return (
        <div className="pt-32 flex justify-center">
             <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
        </div>
      );
  }

  if (!clubData) {
      return (
          <div className="pt-32 px-4 text-center">
              <h2 className="text-2xl font-bold text-slate-900">Club Not Found</h2>
              <p className="text-slate-500">You do not seem to be assigned to a club.</p>
          </div>
      );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="pt-32 px-4 max-w-7xl mx-auto min-h-screen pb-20 relative"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
           <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block">
             Lead Dashboard
           </span>
           <h1 className="text-4xl font-display text-slate-900">Manage {clubData.name}</h1>
           <p className="text-slate-500 mt-2">Oversee club activities, update details, and manage members.</p>
        </div>
        <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${isEditing ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-green-500/25' : 'bg-slate-900 text-white hover:bg-black shadow-lg'}`}
        >
            {isEditing ? <Save size={18} /> : <Settings size={18} />}
            <span>{isEditing ? 'Save Changes' : 'Edit Club Details'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Club Details Form */}
          <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">General Information</h2>
                  
                  <div className="space-y-6">
                      <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Club Name (Read Only)</label>
                          <input 
                            type="text" 
                            value={clubData.name} 
                            disabled 
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 font-bold cursor-not-allowed"
                          />
                          <p className="text-xs text-slate-400 mt-1">Contact Admin to change club name.</p>
                      </div>

                      <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Description</label>
                          <textarea 
                            value={clubData.description}
                            onChange={(e) => setClubData({...clubData, description: e.target.value})}
                            disabled={!isEditing}
                            rows={4}
                            className={`w-full px-4 py-3 rounded-xl border transition-all outline-none focus:ring-2 focus:ring-blue-500 ${isEditing ? 'bg-white border-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                          />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Category (Read Only)</label>
                                <input 
                                    type="text" 
                                    value={clubData.category} 
                                    disabled 
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 cursor-not-allowed"
                                />
                           </div>
                           <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Member Count</label>
                                <input 
                                    type="text" 
                                    value={clubData.memberCount} 
                                    disabled 
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 cursor-not-allowed"
                                />
                           </div>
                      </div>

                      {isEditing && (
                          <div className="pt-4 border-t border-slate-100 animate-in slide-in-from-top-2">
                              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Banner Image</label>
                              <div className="flex items-center gap-4">
                                  <div className="w-24 h-16 rounded-lg overflow-hidden bg-slate-100">
                                      <img src={clubData.image} alt="Club Banner" className="w-full h-full object-cover" />
                                  </div>
                                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-bold text-sm">
                                      <Upload size={16} />
                                      Change Image
                                  </button>
                              </div>
                          </div>
                      )}
                  </div>
              </div>

              {isEditing && (
                <div className="flex justify-end">
                    <button 
                        onClick={handleSave} 
                        className="px-8 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg"
                    >
                        Save All Changes
                    </button>
                </div>
              )}
          </div>

          {/* Members Sidebar */}
          <div className="space-y-6">
              <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 h-full flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-slate-900">Members</h2>
                      <button 
                        onClick={() => setShowAddMemberModal(true)}
                        className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                        title="Add Member"
                      >
                          <Plus size={20} />
                      </button>
                  </div>
                  
                  <div className="space-y-4 flex-grow overflow-y-auto max-h-[500px] pr-2">
                      {members.length > 0 ? members.map((member) => (
                          <div key={member.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 font-bold text-sm shrink-0">
                                      {member.name.charAt(0)}
                                  </div>
                                  <div className="min-w-0">
                                      <div className="font-bold text-slate-900 text-sm truncate">{member.name}</div>
                                      <div className="text-xs text-slate-400">{member.role}</div>
                                  </div>
                              </div>
                              {/* Remove button (mock for now) */}
                              <button className="text-xs text-slate-300 hover:text-red-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Remove</button>
                          </div>
                      )) : (
                          <div className="text-center py-8 text-slate-400 text-sm">No members found</div>
                      )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                    <span className="text-xs text-slate-400">Total: {members.length}</span>
                  </div>
              </div>
          </div>
      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-md">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200 border border-white/50 relative">
                <button 
                    onClick={() => setShowAddMemberModal(false)}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                >
                    <X size={20} />
                </button>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Add New Member</h3>
                <form onSubmit={handleAddMember} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Full Name</label>
                        <input 
                            type="text" 
                            required
                            autoFocus
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50" 
                            placeholder="e.g. Jane Doe"
                            value={newMemberName}
                            onChange={(e) => setNewMemberName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Role</label>
                        <select 
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50"
                            value={newMemberRole}
                            onChange={(e) => setNewMemberRole(e.target.value)}
                        >
                            <option value="Member">Member</option>
                            <option value="Executive">Executive</option>
                            <option value="Treasurer">Treasurer</option>
                            <option value="Secretary">Secretary</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-colors shadow-lg">
                        Add Member
                    </button>
                </form>
            </div>
        </div>
      )}

      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-3"
            >
                <div className="bg-green-500 rounded-full p-0.5">
                    <Check size={14} strokeWidth={3} />
                </div>
                <span className="font-bold text-sm">Action Successful</span>
            </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MyClub;