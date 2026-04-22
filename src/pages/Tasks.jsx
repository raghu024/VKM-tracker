import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from '../components/ui/TaskCard.jsx';
import { CheckSquare } from 'lucide-react';
import { useTaskStore } from '../stores/useTaskStore.js';

export default function Tasks() {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const { tasks, toggleTask } = useTaskStore();

  const handleToggleTask = (id, isCompleted, proofUrls = []) => {
    toggleTask(selectedWeek, id, isCompleted, proofUrls);
  };

  const currentTasks = tasks[selectedWeek] || [];
  const completedCount = currentTasks.filter(t => t.is_completed).length;
  const earnedPoints = completedCount * 30;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20">
          <CheckSquare className="text-gold" size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-text-primary">Weekly Tasks</h1>
          <p className="text-sm text-text-secondary">Complete your actions to earn points.</p>
        </div>
      </div>

      {/* Week Selector Pill Scroller */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 py-2">
        {[1,2,3,4,5,6,7,8,9,10,11,12].map(wk => (
          <button
            key={wk}
            onClick={() => setSelectedWeek(wk)}
            disabled={wk > 3}
            className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
              selectedWeek === wk
                ? 'bg-gold/20 text-gold border-gold/40 shadow-[0_0_12px_rgba(212,168,83,0.15)]'
                : wk > 3
                ? 'bg-bg-tertiary/30 text-text-secondary/40 border-transparent cursor-not-allowed'
                : 'bg-bg-tertiary/60 text-text-secondary border-bg-tertiary hover:bg-bg-tertiary hover:text-text-primary'
            }`}
          >
            Week {wk}
          </button>
        ))}
      </div>

      <div className="glass-card rounded-3xl p-5 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-bold text-gold font-display">Week {selectedWeek} Focus</h2>
            <p className="text-sm text-text-secondary mt-1">Complete all {currentTasks.length} tasks to earn a perfect week.</p>
          </div>
          <div className="flex items-center gap-3 bg-bg-secondary px-4 py-2 rounded-xl border border-bg-tertiary">
            <div>
              <p className="text-[10px] text-text-secondary font-semibold uppercase tracking-wider">Points</p>
              <p className="text-lg font-bold font-mono text-gold">{earnedPoints} pts</p>
            </div>
            <div className="w-px h-8 bg-bg-tertiary"></div>
            <div>
              <p className="text-[10px] text-text-secondary font-semibold uppercase tracking-wider">Done</p>
              <p className="text-lg font-bold font-mono text-text-primary">{completedCount}/{currentTasks.length}</p>
            </div>
            <div className="w-24 h-2 bg-bg-tertiary rounded-full overflow-hidden ml-2">
              <motion.div
                className="h-full bg-gradient-to-r from-gold-dark to-gold"
                initial={{ width: 0 }}
                animate={{ width: `${currentTasks.length > 0 ? (completedCount/currentTasks.length)*100 : 0}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {currentTasks.map(task => (
              <TaskCard key={task.id} task={task} onToggle={handleToggleTask} />
            ))}
          </AnimatePresence>
          {selectedWeek === 1 && currentTasks.length === 0 && (
            <div className="text-center py-10 bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl border border-emerald-500/30 relative overflow-hidden group">
              <div className="absolute top-[-50%] left-[-10%] w-64 h-64 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none transition-transform group-hover:scale-150 duration-700"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 border border-emerald-500/30 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                  <span className="text-2xl">🌱</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Week 1: Baseline Health Tracking</h3>
                <p className="text-slate-400 max-w-md mx-auto mb-8">
                  For your first week, you will log into the entirely separate Health Portal to update your baseline habits and wellness metrics.
                </p>
                <a 
                  href="/health" 
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-bold rounded-xl shadow-[0_4px_20px_rgba(52,211,153,0.2)] hover:opacity-90 transition-opacity"
                >
                  Access Health Portal
                  <span className="text-xl">→</span>
                </a>
              </div>
            </div>
          )}
          {selectedWeek !== 1 && currentTasks.length === 0 && (
            <div className="text-center py-10 text-text-secondary bg-bg-secondary/50 rounded-2xl border border-dashed border-bg-tertiary">
              Tasks for this week are not available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
