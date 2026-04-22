import { useState } from 'react';
import { Users, FileCheck, Shield, Award, Target, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ParticipantStats from '../components/admin/ParticipantStats.jsx';
import VerificationQueue from '../components/admin/VerificationQueue.jsx';
import UserDetailModal from '../components/admin/UserDetailModal.jsx';
import StatCard from '../components/ui/StatCard.jsx';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('participants');
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-text-primary">Mentorship Admin</h1>
          <p className="text-sm text-text-secondary">Track performance, verify tasks, and manage participants.</p>
        </div>
        
        <div className="flex bg-bg-secondary p-1 rounded-xl border border-bg-tertiary">
          <button 
            onClick={() => setActiveTab('participants')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'participants' ? 'bg-gold/10 text-gold border border-gold/20' : 'text-text-secondary hover:text-text-primary'}`}
          >
            <div className="flex items-center gap-2">
              <Users size={16} /> Participants
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('proofs')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'proofs' ? 'bg-gold/10 text-gold border border-gold/20' : 'text-text-secondary hover:text-text-primary'}`}
          >
            <div className="flex items-center gap-2">
              <FileCheck size={16} /> Verifications
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Activity size={20} />} label="Active Now" value="12" suffix="users" delay={0.1} />
        <StatCard icon={<Target size={20} />} label="Avg Progress" value="34" suffix="%" trend={5} delay={0.2} />
        <StatCard icon={<Award size={20} />} label="Total Points" value="14.2" suffix="k" trend={12} delay={0.3} />
        <StatCard icon={<Shield size={20} />} label="Pending" value="8" suffix="proofs" delay={0.4} />
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'participants' ? (
          <motion.div
            key="participants"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <ParticipantStats onViewUser={(user) => setSelectedUser(user)} />
          </motion.div>
        ) : (
          <motion.div
            key="proofs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <VerificationQueue />
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
