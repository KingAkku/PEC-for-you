
import React, { useState, useEffect } from 'react';
import { User, Club } from '../types';
import { MOCK_CLUBS } from '../constants';
import { motion } from 'framer-motion';
import { Settings, Users, Plus, Save, Upload } from 'lucide-react';

interface MyClubProps {
  user: User;
}

const MyClub: React.FC<MyClubProps> = ({ user }) => {
  // Simulate fetching the club managed by this user
  const initialClub = MOCK_CLUBS.find(c => c.id === user.clubId) || MOCK_CLUBS[0];
  const [clubData, setClubData] = useState<Club>(initialClub);
  const [isEditing, setIsEditing] = useState(false);
  const [members, setMembers] = useState([
    { id: 1, name: 'Alice Johnson', role: 'Member', joined: '2023-09-01' },
    { id: 2, name: 'Bob Smith', role: 'Executive', joined: '2023-08-15' },
    { id: 3, name: 'Charlie Brown', role: 'Member', joined: '2023-09-10' },
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSave = () => {
    setIsEditing(false);
    alert("Club details updated successfully!");
  };

  const handleAddMember = () => {
      const name = prompt("Enter new member name:");
      if(name) {
          setMembers([...members, { id: Date.now(), name, role: 'Member', joined: new Date().toISOString().split('T')[0] }]);
      }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="pt-32 px-4 max-w-7xl mx-auto min-h-screen pb-20"
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
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${isEditing ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-slate-900 text-white hover:bg-black'}`}
        >
            {isEditing ? <Save size={18} /> : <Settings size={18} />}
            <span>{isEditing ? 'Save Changes' : 'Edit Club Details'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Club Details Form */}
          <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
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
                          <div className="pt-4 border-t border-slate-100">
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
              <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 h-full">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-slate-900">Members</h2>
                      <button 
                        onClick={handleAddMember}
                        className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                      >
                          <Plus size={20} />
                      </button>
                  </div>
                  
                  <div className="space-y-4">
                      {members.map((member) => (
                          <div key={member.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 font-bold text-sm">
                                      {member.name.charAt(0)}
                                  </div>
                                  <div>
                                      <div className="font-bold text-slate-900 text-sm">{member.name}</div>
                                      <div className="text-xs text-slate-400">{member.role}</div>
                                  </div>
                              </div>
                              <button className="text-xs text-slate-400 hover:text-red-500 font-medium">Remove</button>
                          </div>
                      ))}
                  </div>
                  
                  <button className="w-full mt-6 py-3 border border-slate-200 rounded-xl text-slate-500 font-bold text-sm hover:bg-slate-50 transition-colors">
                      View All Members
                  </button>
              </div>
          </div>
      </div>
    </motion.div>
  );
};

export default MyClub;
