import { useState, useEffect } from 'react';
import { Search, User, Target, Award, ChevronRight, Loader2 } from 'lucide-react';
import { getParticipantsProgress } from '../../lib/admin.js';
import { motion } from 'framer-motion';

export default function ParticipantStats({ onViewUser }) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getParticipantsProgress();
      setParticipants(data);
    } catch (error) {
      console.error('Error fetching participant stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = participants.filter(p => 
    p.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    p.business_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-text-secondary">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p>Loading participant performance data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input 
          type="text"
          placeholder="Search by participant name or business..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-bg-secondary border border-bg-tertiary rounded-xl text-sm focus:outline-none focus:border-gold/50 text-text-primary"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p, i) => (
          <motion.div 
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card rounded-2xl p-5 hover:border-gold/30 transition-all cursor-pointer group"
            onClick={() => onViewUser(p)}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold/50 to-gold text-bg-primary flex items-center justify-center font-bold text-lg">
                {p.full_name?.charAt(0)}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-text-primary truncate">{p.full_name}</h3>
                <p className="text-xs text-text-secondary truncate">{p.business_name}</p>
              </div>
              <ChevronRight size={18} className="ml-auto text-text-secondary group-hover:text-gold transition-colors" />
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1">
                  <span>Course Progress</span>
                  <span>{p.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-bg-tertiary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gold transition-all duration-1000" 
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-bg-tertiary">
                <div className="text-center">
                  <p className="text-[10px] text-text-secondary uppercase font-bold">Tasks</p>
                  <p className="text-sm font-mono text-text-primary">{p.completedCount}/36</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-text-secondary uppercase font-bold">Points</p>
                  <p className="text-sm font-mono text-gold">{p.totalPoints}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-text-secondary uppercase font-bold">Pending</p>
                  <p className={`text-sm font-mono ${p.pendingCount > 0 ? 'text-blue-400' : 'text-text-secondary'}`}>
                    {p.pendingCount}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center text-text-secondary">
            No participants match your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}
