import { useState, useEffect } from 'react';
import { Shield, Settings, Activity, Database, AlertCircle, Users, FileCheck, Megaphone, BookOpen, Plus, Trash2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ParticipantStats from '../components/admin/ParticipantStats.jsx';
import VerificationQueue from '../components/admin/VerificationQueue.jsx';
import UserDetailModal from '../components/admin/UserDetailModal.jsx';
import StatCard from '../components/ui/StatCard.jsx';
import { getGlobalStats, updateUserRole, createBroadcast, createResource, getBroadcasts, getResources, deleteBroadcast, deleteResource } from '../lib/admin.js';
import { sanitizeObject, checkPayloadSize } from '../lib/security.js';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../hooks/useAuth.jsx';

export default function SuperAdmin() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [broadcasts, setBroadcasts] = useState([]);
  const [resources, setResources] = useState([]);
  const { user } = useAuth();

  // Form states
  const [newBroadcast, setNewBroadcast] = useState({ title: '', content: '', type: 'info' });
  const [newResource, setNewResource] = useState({ title: '', description: '', file_url: '', type: 'document' });

  useEffect(() => {
    fetchGlobalStats();
    if (activeTab === 'admins') fetchAllUsers();
    if (activeTab === 'broadcasts') fetchAllBroadcasts();
    if (activeTab === 'library') fetchAllResources();
  }, [activeTab]);

  const fetchGlobalStats = async () => {
    const data = await getGlobalStats();
    setStats(data);
  };

  const fetchAllUsers = async () => {
    setLoadingUsers(true);
    const { data } = await supabase.from('profiles').select('*').order('full_name');
    setAllUsers(data || []);
    setLoadingUsers(false);
  };

  const fetchAllBroadcasts = async () => {
    const data = await getBroadcasts();
    setBroadcasts(data || []);
  };

  const fetchAllResources = async () => {
    const data = await getResources();
    setResources(data || []);
  };

  const handleCreateBroadcast = async (e) => {
    e.preventDefault();
    try {
      if (!user) return;
      
      const cleanBroadcast = sanitizeObject(newBroadcast);
      checkPayloadSize(cleanBroadcast);

      await createBroadcast(cleanBroadcast, user.id);
      setNewBroadcast({ title: '', content: '', type: 'info' });
      fetchAllBroadcasts();
    } catch (err) {
      alert(err.message || 'Failed to create broadcast');
    }
  };

  const handleCreateResource = async (e) => {
    e.preventDefault();
    try {
      const cleanResource = sanitizeObject(newResource);
      checkPayloadSize(cleanResource);

      await createResource(cleanResource);
      setNewResource({ title: '', description: '', file_url: '', type: 'document' });
      fetchAllResources();
    } catch (err) {
      alert(err.message || 'Failed to create resource');
    }
  };

  const handleDeleteBroadcast = async (id) => {
    if (!confirm('Are you sure you want to delete this broadcast?')) return;
    try {
      await deleteBroadcast(id);
      fetchAllBroadcasts();
    } catch (err) {
      alert('Failed to delete broadcast');
    }
  };

  const handleDeleteResource = async (id) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
      await deleteResource(id);
      fetchAllResources();
    } catch (err) {
      alert('Failed to delete resource');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      alert('Failed to update role');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-text-primary">Super Admin Console</h1>
          <p className="text-sm text-text-secondary">System-wide control, role management, and performance tracking.</p>
        </div>
        
        <div className="flex bg-bg-secondary p-1 rounded-xl border border-bg-tertiary overflow-x-auto hide-scrollbar">
          {[
            { id: 'overview', icon: <Activity size={16} />, label: 'Overview' },
            { id: 'participants', icon: <Users size={16} />, label: 'Progress' },
            { id: 'proofs', icon: <FileCheck size={16} />, label: 'Proofs' },
            { id: 'admins', icon: <Shield size={16} />, label: 'Roles' },
            { id: 'broadcasts', icon: <Megaphone size={16} />, label: 'Announce' },
            { id: 'library', icon: <BookOpen size={16} />, label: 'Library' },
            { id: 'config', icon: <Settings size={16} />, label: 'System' },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'bg-gold/10 text-gold border border-gold/20' : 'text-text-secondary hover:text-text-primary'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users size={20} />} label="Total Users" value={stats?.totalUsers || '0'} delay={0.1} />
        <StatCard icon={<Database size={20} />} label="Batches" value={stats?.totalBatches || '0'} delay={0.2} />
        <StatCard icon={<Activity size={20} />} label="Avg Score" value={stats?.avgPoints || '0'} suffix="pts" delay={0.3} />
        <StatCard icon={<AlertCircle size={20} />} label="System Status" value="Online" delay={0.4} />
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div className="glass-card rounded-2xl p-6 space-y-4">
                <h3 className="font-bold flex items-center gap-2 text-gold"><Activity size={18} /> Recent System Activity</h3>
                <div className="space-y-3">
                  <p className="text-sm text-text-secondary">Real-time logs will be integrated here.</p>
                </div>
             </div>
             <div className="glass-card rounded-2xl p-6 space-y-4">
                <h3 className="font-bold flex items-center gap-2 text-gold"><Settings size={18} /> Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-3 bg-bg-tertiary/50 rounded-xl text-xs font-semibold hover:bg-gold/10 hover:text-gold transition-all">Maintenance Mode</button>
                  <button className="p-3 bg-bg-tertiary/50 rounded-xl text-xs font-semibold hover:bg-gold/10 hover:text-gold transition-all">Export All Data</button>
                </div>
             </div>
          </motion.div>
        )}

        {activeTab === 'participants' && (
          <motion.div key="participants" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ParticipantStats onViewUser={(user) => setSelectedUser(user)} />
          </motion.div>
        )}

        {activeTab === 'proofs' && (
          <motion.div key="proofs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <VerificationQueue />
          </motion.div>
        )}

        {activeTab === 'admins' && (
          <motion.div key="admins" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card rounded-2xl overflow-hidden shadow-xl border-bg-tertiary">
             <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-tertiary/30 border-b border-bg-tertiary">
                  <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-widest">User</th>
                  <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-widest">Current Role</th>
                  <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-tertiary">
                {allUsers.map(u => (
                  <tr key={u.id} className="hover:bg-bg-tertiary/10 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-text-primary">{u.full_name}</p>
                      <p className="text-xs text-text-secondary">{u.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${u.role === 'admin' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : u.role === 'super_admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-bg-tertiary text-text-secondary'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                       {u.role !== 'admin' && (
                         <button onClick={() => handleRoleChange(u.id, 'admin')} className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-500/20 transition-all font-bold">Promote to Admin</button>
                       )}
                       {u.role === 'admin' && (
                         <button onClick={() => handleRoleChange(u.id, 'business_owner')} className="text-xs bg-error/10 text-error px-3 py-1.5 rounded-lg hover:bg-error/20 transition-all font-bold">Demote to Owner</button>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
             </table>
          </motion.div>
        )}

        {activeTab === 'broadcasts' && (
          <motion.div key="broadcasts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
               <div className="glass-card rounded-2xl p-6 border-gold/20 shadow-xl bg-bg-secondary/40">
                  <h3 className="font-bold flex items-center gap-2 text-gold mb-6"><Plus size={18} /> New Broadcast</h3>
                  <form onSubmit={handleCreateBroadcast} className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1 block">Title</label>
                      <input 
                        type="text" 
                        required
                        value={newBroadcast.title}
                        onChange={e => setNewBroadcast({...newBroadcast, title: e.target.value})}
                        className="w-full bg-bg-primary border border-bg-tertiary rounded-xl px-4 py-2.5 text-sm focus:border-gold/50 outline-none"
                        placeholder="e.g., Week 3 Live Session"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1 block">Content</label>
                      <textarea 
                        required
                        value={newBroadcast.content}
                        onChange={e => setNewBroadcast({...newBroadcast, content: e.target.value})}
                        className="w-full bg-bg-primary border border-bg-tertiary rounded-xl px-4 py-2.5 text-sm focus:border-gold/50 outline-none h-32 resize-none"
                        placeholder="Type your announcement here..."
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1 block">Type</label>
                      <select 
                        value={newBroadcast.type}
                        onChange={e => setNewBroadcast({...newBroadcast, type: e.target.value})}
                        className="w-full bg-bg-primary border border-bg-tertiary rounded-xl px-4 py-2.5 text-sm focus:border-gold/50 outline-none"
                      >
                        <option value="info">Information</option>
                        <option value="warning">Alert / Warning</option>
                        <option value="success">Success / Milestone</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full bg-gold text-bg-primary font-bold py-3 rounded-xl hover:opacity-90 transition-opacity">Post Announcement</button>
                  </form>
               </div>
            </div>
            <div className="lg:col-span-2 space-y-4">
               <h3 className="font-bold text-text-primary px-2">Recent Broadcasts</h3>
               {broadcasts.map(b => (
                 <div key={b.id} className="glass-card rounded-2xl p-4 border-bg-tertiary hover:border-gold/20 transition-all flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${b.type === 'warning' ? 'bg-error' : b.type === 'success' ? 'bg-success' : 'bg-blue-400'}`} />
                        <h4 className="font-bold text-text-primary">{b.title}</h4>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed">{b.content}</p>
                      <p className="text-[10px] text-text-secondary mt-3 uppercase tracking-tighter">Posted {new Date(b.created_at).toLocaleDateString()} by {b.profiles?.full_name}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteBroadcast(b.id)}
                      className="text-text-secondary hover:text-error transition-colors p-2"
                    >
                       <Trash2 size={16} />
                    </button>
                 </div>
               ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'library' && (
          <motion.div key="library" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
               <div className="glass-card rounded-2xl p-6 border-gold/20 shadow-xl bg-bg-secondary/40">
                  <h3 className="font-bold flex items-center gap-2 text-gold mb-6"><Plus size={18} /> Add Resource</h3>
                  <form onSubmit={handleCreateResource} className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1 block">Title</label>
                      <input 
                        type="text" required
                        value={newResource.title}
                        onChange={e => setNewResource({...newResource, title: e.target.value})}
                        className="w-full bg-bg-primary border border-bg-tertiary rounded-xl px-4 py-2.5 text-sm focus:border-gold/50 outline-none"
                        placeholder="e.g., Marketing Blueprint PDF"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1 block">URL</label>
                      <input 
                        type="url" required
                        value={newResource.file_url}
                        onChange={e => setNewResource({...newResource, file_url: e.target.value})}
                        className="w-full bg-bg-primary border border-bg-tertiary rounded-xl px-4 py-2.5 text-sm focus:border-gold/50 outline-none"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1 block">Type</label>
                      <select 
                        value={newResource.type}
                        onChange={e => setNewResource({...newResource, type: e.target.value})}
                        className="w-full bg-bg-primary border border-bg-tertiary rounded-xl px-4 py-2.5 text-sm focus:border-gold/50 outline-none"
                      >
                        <option value="document">Document</option>
                        <option value="video">Video Recording</option>
                        <option value="template">Blueprint / Template</option>
                        <option value="link">External Link</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full bg-gold text-bg-primary font-bold py-3 rounded-xl hover:opacity-90 transition-opacity">Add to Library</button>
                  </form>
               </div>
            </div>
            <div className="lg:col-span-2 space-y-4">
               {resources.map(r => (
                 <div key={r.id} className="glass-card rounded-2xl p-4 border-bg-tertiary flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-bg-tertiary flex items-center justify-center">
                        <BookOpen size={20} className="text-gold" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-text-primary">{r.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-gold uppercase bg-gold/5 px-1.5 py-0.5 rounded border border-gold/10">{r.type}</span>
                          <span className="text-[10px] text-text-secondary">Added {new Date(r.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={r.file_url} target="_blank" rel="noopener noreferrer" className="p-2 text-text-secondary hover:text-gold transition-colors"><ExternalLink size={18} /></a>
                      <button 
                        onClick={() => handleDeleteResource(r.id)}
                        className="p-2 text-text-secondary hover:text-error transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                 </div>
               ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'config' && (
          <motion.div key="config" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card rounded-2xl p-12 text-center text-text-secondary italic">
            Course curriculum and batch management logic is being ported to the DB.
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedUser && (
          <UserDetailModal 
            user={selectedUser} 
            onClose={() => setSelectedUser(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
