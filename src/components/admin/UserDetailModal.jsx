import { X, Calendar, Target, Award, CheckCircle2, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase.js';

export default function UserDetailModal({ user, onClose }) {
  const [completions, setCompletions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchUserCompletions();
  }, [user]);

  const fetchUserCompletions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('task_completions')
        .select(`
          *,
          tasks:task_id (*)
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      setCompletions(data || []);
    } catch (error) {
      console.error('Error fetching completions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-bg-primary/80 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl bg-bg-secondary border border-bg-tertiary rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-bg-tertiary flex items-center justify-between bg-bg-secondary/50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-xl border border-gold/20">
              {user.full_name?.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">{user.full_name}</h2>
              <p className="text-sm text-text-secondary">{user.business_name} • {user.city}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-bg-tertiary rounded-full transition-colors text-text-secondary hover:text-text-primary"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox icon={<Target className="text-gold" />} label="Overall Progress" value={`${user.progress}%`} />
            <StatBox icon={<CheckCircle2 className="text-success" />} label="Tasks Done" value={`${user.completedCount}/36`} />
            <StatBox icon={<Award className="text-gold" />} label="Points Earned" value={user.totalPoints} />
            <StatBox icon={<Calendar className="text-blue-400" />} label="Current Week" value="Week 4" />
          </div>

          {/* 12-Week Grid */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary">Progress Timeline</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(wk => {
                const weekCompletions = completions.filter(c => c.tasks?.week_id === `week-${wk}`); // This is simplified logic
                const isCompleted = weekCompletions.length >= 3; // Placeholder logic
                
                return (
                  <div key={wk} className="bg-bg-tertiary/30 border border-bg-tertiary rounded-2xl p-4 flex items-center justify-between hover:bg-bg-tertiary/50 transition-all cursor-default">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                        wk <= 4 ? 'bg-gold/10 border-gold/20 text-gold' : 'bg-bg-secondary border-bg-tertiary text-text-secondary'
                      }`}>
                        <span className="font-bold text-xs">W{wk}</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text-primary">Week {wk}</p>
                        <p className="text-[10px] text-text-secondary">
                          {wk <= 4 ? '3/3 Tasks' : 'Locked'}
                        </p>
                      </div>
                    </div>
                    {wk <= 4 ? <CheckCircle2 size={18} className="text-success" /> : <Circle size={18} className="text-bg-tertiary" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StatBox({ icon, label, value }) {
  return (
    <div className="bg-bg-tertiary/50 border border-bg-tertiary p-4 rounded-2xl text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <p className="text-[10px] uppercase font-bold text-text-secondary tracking-widest">{label}</p>
      <p className="text-xl font-bold text-text-primary mt-1">{value}</p>
    </div>
  );
}
