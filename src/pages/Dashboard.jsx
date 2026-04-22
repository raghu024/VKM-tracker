import ProgressRing from '../components/ui/ProgressRing.jsx';
import TaskCard from '../components/ui/TaskCard.jsx';
import StatCard from '../components/ui/StatCard.jsx';
import WeekTimeline from '../components/ui/WeekTimeline.jsx';
import BroadcastBanner from '../components/dashboard/BroadcastBanner.jsx';
import PerformanceHeatmap from '../components/ui/PerformanceHeatmap.jsx';
import { Trophy, Flame, ChevronRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { WEEKS_DATA } from '../lib/mockData.js';
import { useAuth } from '../hooks/useAuth.jsx';
import { useUserStore } from '../stores/useUserStore.js';
import { useTaskStore } from '../stores/useTaskStore.js';
import { useLeaderboard } from '../hooks/useLeaderboard.js';

const CURRENT_WEEK = 1;

export default function Dashboard() {
  const { user } = useAuth();
  const { profile } = useUserStore();
  const { tasks, toggleTask, getTotalPoints } = useTaskStore();
  const { leaderboard } = useLeaderboard();

  const weekTasks = tasks[CURRENT_WEEK] || [];
  const completedCount = weekTasks.filter(t => t.is_completed).length;
  const progressPercentage = weekTasks.length > 0 ? (completedCount / weekTasks.length) * 100 : 0;
  const totalPoints = getTotalPoints();

  // Compute real rank from live leaderboard
  const myEntry = leaderboard.find(u => u.isCurrentUser);
  const myRank = myEntry ? myEntry.rank : '—';
  const topThree = leaderboard.slice(0, 3);

  const handleToggleTask = (id, isCompleted) => {
    toggleTask(CURRENT_WEEK, id, isCompleted);
  };

  return (
    <div className="space-y-6">
      <BroadcastBanner />
      
      <PerformanceHeatmap />
      
      {/* Welcome Card */}
      <div className="glass-strong rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold opacity-10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex-1 space-y-4 text-center md:text-left z-10 w-full">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-gold-dark via-gold to-gold-light p-1 shadow-lg shrink-0">
              <div className="w-full h-full rounded-full bg-bg-primary overflow-hidden border-2 border-transparent">
                <img src={`https://ui-avatars.com/api/?name=${profile.full_name}&background=1F2937&color=D4A853`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-display font-bold gold-text">Welcome, {profile.full_name.split(' ')[0]}! 🏆</h2>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-text-secondary font-medium">Q2 2026 Batch · Week 1 of 12</p>
                <span className="text-[10px] px-2 py-0.5 rounded bg-gold/10 text-gold font-bold uppercase tracking-tighter">6 Days Left</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
            <div className="flex items-center gap-2 bg-gold/10 px-4 py-2 rounded-full border border-gold/20">
              <Trophy size={16} className="text-gold" />
              <span className="font-semibold text-gold">Rank: #{myRank}</span>
            </div>
            <div className="flex items-center gap-2 bg-orange-500/10 px-4 py-2 rounded-full border border-orange-500/20">
              <Flame size={16} className="text-orange-500" />
              <span className="font-semibold text-orange-500">{profile.current_streak || 0}-Day Streak</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 z-10 p-4 shrink-0">
          <ProgressRing progress={progressPercentage} size={130} strokeWidth={10} />
          <p className="text-sm text-text-secondary font-medium animate-pulse-gold inline-block mt-2">{totalPoints} pts earned</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Trophy size={20} />} label="Total Points" value={totalPoints} suffix="pts" trend={totalPoints > 0 ? totalPoints : null} delay={0.1} />
        <StatCard icon={<Check size={20} />} label="Tasks Done" value={completedCount} suffix={`/ ${weekTasks.length}`} delay={0.2} />
        <StatCard icon={<Flame size={20} />} label="Current Streak" value={profile.current_streak || 0} suffix="Days" delay={0.3} />
        <StatCard icon={<Trophy size={20} />} label="Global Rank" value={`#${myRank}`} delay={0.4} />
      </div>

      {/* 12-Week Timeline */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold font-display">12-Week Journey</h3>
          <button className="text-sm font-semibold text-gold flex items-center hover:opacity-80 transition-opacity">
            View All <ChevronRight size={16} />
          </button>
        </div>
        <WeekTimeline weeks={WEEKS_DATA} currentWeek={CURRENT_WEEK} />
      </div>

      {/* Tasks & Leaderboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        
        {/* Tasks Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-display">Week 1: Lifestyle & OMM</h3>
            {progressPercentage === 100 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-success/20 text-success text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-success/30">
                <Check size={14} /> Perfect Week!
              </motion.span>
            )}
          </div>
          
          <div className="space-y-3">
            {weekTasks.map(task => (
              <TaskCard key={task.id} task={task} onToggle={handleToggleTask} week={CURRENT_WEEK} />
            ))}
          </div>
        </div>

        {/* Small Leaderboard */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold font-display">Top Performers</h3>
          <div className="glass-card rounded-2xl p-4 sm:p-5 space-y-3">

            {topThree.length === 0 ? (
              <p className="text-center text-text-secondary text-sm py-4">No other participants yet.</p>
            ) : (
              topThree.map((u, i) => {
                const rankColors = [
                  'from-[var(--color-rank-gold)]/10 border-[var(--color-rank-gold)]/30 text-[var(--color-rank-gold)]',
                  'from-[var(--color-rank-silver)]/10 border-[var(--color-rank-silver)]/30 text-[var(--color-rank-silver)]',
                  'from-[var(--color-rank-bronze)]/10 border-[var(--color-rank-bronze)]/30 text-[var(--color-rank-bronze)]',
                ];
                return (
                  <div key={u.id} className={`flex items-center gap-3 p-3 rounded-xl border bg-gradient-to-r to-transparent ${rankColors[i]} ${u.isCurrentUser ? 'ring-1 ring-gold/50' : ''}`}>
                    <span className={`font-display font-bold w-5 text-center ${rankColors[i].split(' ')[2]}`}>#{u.rank}</span>
                    <div className="w-8 h-8 rounded-full bg-bg-tertiary shadow-inner overflow-hidden shrink-0">
                      <img src={`https://ui-avatars.com/api/?name=${u.name}&background=374151&color=fff`} className="w-full h-full" alt={u.name} />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className={`text-sm font-semibold truncate ${u.isCurrentUser ? 'text-gold' : ''}`}>
                        {u.isCurrentUser ? 'You' : u.name}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-semibold opacity-80 whitespace-nowrap">{u.points} pt</span>
                  </div>
                );
              })
            )}

            {leaderboard.length > 3 && (
              <>
                <div className="flex items-center justify-center py-1">
                  <span className="text-text-secondary/50 font-bold">⋮</span>
                </div>
                {/* Current User position if outside top 3 */}
                {myEntry && myEntry.rank > 3 && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gold/10 border border-gold/40 shadow-[0_0_15px_rgba(212,168,83,0.1)]">
                    <span className="font-display font-bold w-5 text-center text-gold">#{myRank}</span>
                    <div className="w-8 h-8 rounded-full bg-bg-tertiary overflow-hidden shrink-0 border border-gold/50">
                      <img src={`https://ui-avatars.com/api/?name=${profile.full_name}&background=D4A853&color=0B1121`} className="w-full h-full" alt="you" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold text-gold truncate">You</span>
                    </div>
                    <span className="text-xs font-mono font-semibold text-gold whitespace-nowrap">{totalPoints} pt</span>
                  </div>
                )}
              </>
            )}

            <button className="w-full mt-2 py-2.5 rounded-xl bg-bg-tertiary/50 hover:bg-gold/20 transition-colors border border-bg-tertiary hover:border-gold/30 text-sm font-semibold text-text-primary hover:text-gold">
              View Full Leaderboard
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
