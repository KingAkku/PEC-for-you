import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { DEPARTMENTS } from '../constants';
import { motion } from 'framer-motion';
import { Users, GraduationCap, Building2, Search, Download, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [selectedDept, setSelectedDept] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching students:', error);
      } else if (data) {
        // Map DB snake_case to App camelCase
        const mappedUsers: User[] = data.map((p: any) => ({
            id: p.id,
            name: p.name,
            email: p.email,
            role: p.role,
            department: p.department,
            clubId: p.club_id
        }));
        setStudents(mappedUsers);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filteredStudents = students.filter(student => {
    const matchesDept = selectedDept === 'All' || student.department === selectedDept;
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (student.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="pt-32 px-4 max-w-7xl mx-auto min-h-screen pb-20"
    >
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block">
            {user.role === 'admin' ? 'Administrator' : 'Faculty'} View
            </span>
            <h1 className="text-4xl font-display text-slate-900">Academic Dashboard</h1>
            <p className="text-slate-500 mt-2">Welcome back, {user.name}. Here is an overview of the campus.</p>
        </div>
        <button 
            onClick={fetchStudents}
            className="p-3 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all"
            title="Refresh Data"
        >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">{students.length}</div>
              <div className="text-sm text-slate-500 font-medium">Total Users</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <Building2 size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">{DEPARTMENTS.length}</div>
              <div className="text-sm text-slate-500 font-medium">Departments</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <GraduationCap size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">98%</div>
              <div className="text-sm text-slate-500 font-medium">Attendance Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Student Database Section */}
      <div className="bg-white rounded-[2rem] shadow-lg border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h2 className="text-xl font-bold text-slate-900">User Database</h2>
                <p className="text-slate-500 text-sm">Manage and view registered users across departments.</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors text-sm font-bold">
                <Download size={16} />
                Export CSV
            </button>
        </div>
        
        {/* Filters */}
        <div className="p-4 bg-slate-50/50 flex flex-col md:flex-row gap-4 border-b border-slate-100">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search by name or email..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
            </div>
            <select 
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
                <option value="All">All Departments</option>
                {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                ))}
            </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                        <th className="px-6 py-4 border-b border-slate-100">Name</th>
                        <th className="px-6 py-4 border-b border-slate-100">Department</th>
                        <th className="px-6 py-4 border-b border-slate-100">Email</th>
                        <th className="px-6 py-4 border-b border-slate-100">Role</th>
                        <th className="px-6 py-4 border-b border-slate-100 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {loading ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                <div className="flex justify-center items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
                                    <span>Loading data...</span>
                                </div>
                            </td>
                        </tr>
                    ) : filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                            <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="px-6 py-4 font-bold text-slate-900">{student.name}</td>
                                <td className="px-6 py-4 text-slate-600 text-sm">
                                    <span className="bg-slate-100 px-2 py-1 rounded text-xs font-medium">
                                        {student.department || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-sm">{student.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`capitalize px-2 py-1 rounded text-xs font-bold ${
                                        student.role === 'admin' ? 'bg-red-100 text-red-600' :
                                        student.role === 'faculty' ? 'bg-purple-100 text-purple-600' :
                                        student.role === 'lead' ? 'bg-blue-100 text-blue-600' :
                                        'bg-gray-100 text-gray-600'
                                    }`}>
                                        {student.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-blue-600 font-bold text-xs hover:underline">View Profile</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                No users found matching your criteria.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;