import { motion } from 'framer-motion';
import { Lock, Check, Zap } from 'lucide-react';

export default function WeekTimeline({ weeks, currentWeek = 1 }) {
  const getStatus = (week) => {
    if (week < currentWeek) return 'completed';
    if (week === currentWeek) return 'current';
    return 'locked';
  };

  return (
    <div className="w-full overflow-x-auto hide-scrollbar">
      <div className="flex items-center gap-1 min-w-max px-1 py-4">
        {weeks.map((w, i) => {
          const status = getStatus(w.week);
          return (
            <div key={w.week} className="flex items-center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.06, type: 'spring', stiffness: 300 }}
                className="flex flex-col items-center"
              >
                <button
                  disabled={status === 'locked'}
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 relative ${
                    status === 'completed'
                      ? 'bg-gradient-to-br from-gold/80 to-gold-dark text-bg-primary shadow-[0_0_12px_rgba(212,168,83,0.3)]'
                      : status === 'current'
                      ? 'bg-bg-tertiary border-2 border-gold text-gold animate-pulse-gold'
                      : 'bg-bg-tertiary/50 border border-bg-tertiary text-text-secondary/40 cursor-not-allowed'
                  }`}
                >
                  {status === 'completed' ? <Check size={16} strokeWidth={3} /> : status === 'locked' ? <Lock size={13} /> : w.week}
                </button>
                <span className={`mt-1.5 text-[10px] font-semibold max-w-[56px] text-center leading-tight ${
                  status === 'current' ? 'text-gold' : status === 'completed' ? 'text-gold/60' : 'text-text-secondary/40'
                }`}>
                  Wk {w.week}
                </span>
              </motion.div>

              {/* Connector line */}
              {i < weeks.length - 1 && (
                <div className={`w-3 sm:w-5 h-0.5 mx-0.5 rounded-full ${
                  getStatus(weeks[i+1].week) === 'locked' ? 'bg-bg-tertiary/40' : 'bg-gold/40'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
