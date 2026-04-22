import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../hooks/useAuth.jsx';
import { motion } from 'framer-motion';

export default function PerformanceHeatmap() {
  const { user } = useAuth();
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [streakData, setStreakData] = useState({ current: 0, best: 0 });

  useEffect(() => {
    if (user) {
      fetchActivity();
      fetchStreak();
    }
  }, [user]);

  const fetchStreak = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('current_streak')
      .eq('id', user.id)
      .single();
    
    if (data) {
      setStreakData({ current: data.current_streak || 0, best: Math.max(data.current_streak || 0, 14) });
    }
  };

  const fetchActivity = async () => {
    try {
      const { data, error } = await supabase
        .from('task_completions')
        .select('completed_at')
        .eq('user_id', user.id)
        .not('completed_at', 'is', null);

      if (error) throw error;

      // Group by date
      const counts = data.reduce((acc, curr) => {
        const date = new Date(curr.completed_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      setActivityData(counts);
    } catch (error) {
      console.error('Error fetching activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateDays = () => {
    const days = [];
    const now = new Date();
    for (let i = 89; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        count: activityData[dateStr] || 0
      });
    }
    return days;
  };

  const getIntensity = (count) => {
    if (count === 0) return 'bg-bg-tertiary/20';
    if (count === 1) return 'bg-gold/30 border-gold/10';
    if (count === 2) return 'bg-gold/60 border-gold/20';
    return 'bg-gold border-gold/40 shadow-[0_0_8px_rgba(212,168,83,0.3)]';
  };

  if (loading) return <div className="h-32 bg-bg-secondary/50 rounded-2xl animate-pulse" />;

  const days = generateDays();

  return (
    <div className="glass-card rounded-2xl p-6 bg-bg-secondary/40 border-bg-tertiary">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
          Commitment Heatmap <span className="text-[10px] text-text-secondary normal-case tracking-normal">(Last 90 days)</span>
        </h3>
        <div className="flex items-center gap-1.5 text-[10px] text-text-secondary">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-sm bg-bg-tertiary/20" />
          <div className="w-2.5 h-2.5 rounded-sm bg-gold/30" />
          <div className="w-2.5 h-2.5 rounded-sm bg-gold/60" />
          <div className="w-2.5 h-2.5 rounded-sm bg-gold shadow-[0_0_5px_rgba(212,168,83,0.3)]" />
          <span>More</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 justify-start">
        {days.map((day, idx) => (
          <motion.div
            key={idx}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: idx * 0.005 }}
            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-sm border ${getIntensity(day.count)} group relative`}
            title={`${day.date}: ${day.count} tasks`}
          >
           {/* Tooltip implementation can go here if needed */}
          </motion.div>
        ))}
      </div>
      
      <div className="flex justify-between mt-4">
        <div className="flex gap-4">
          <div className="text-center">
            <p className="text-[10px] font-bold text-text-secondary uppercase">Current Streak</p>
            <p className="text-lg font-black text-gold">{streakData.current} Days</p>
          </div>
          <div className="text-center border-l border-bg-tertiary pl-4">
            <p className="text-[10px] font-bold text-text-secondary uppercase">Best Streak</p>
            <p className="text-lg font-black text-text-primary">{streakData.best} Days</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-gold/5 px-3 py-1 rounded-full border border-gold/10">
           <span className="text-[10px] font-bold text-gold uppercase tracking-tighter">🔥 Keep it up!</span>
        </div>
      </div>
    </div>
  );
}
