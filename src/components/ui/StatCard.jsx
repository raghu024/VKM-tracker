import { motion } from 'framer-motion';

export default function StatCard({ icon, label, value, suffix = '', trend = null, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass-card rounded-2xl p-4 sm:p-5 group hover:border-gold/25 transition-all duration-300 cursor-default"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-bg-tertiary/80 flex items-center justify-center text-gold group-hover:bg-gold/10 transition-colors">
          {icon}
        </div>
        {trend !== null && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            trend > 0 ? 'bg-success/10 text-success' : trend < 0 ? 'bg-error/10 text-error' : 'bg-bg-tertiary text-text-secondary'
          }`}>
            {trend > 0 ? '▲' : trend < 0 ? '▼' : '—'} {Math.abs(trend)}
          </span>
        )}
      </div>
      <p className="text-[11px] text-text-secondary font-medium uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl sm:text-3xl font-bold font-mono text-text-primary">
        {value}<span className="text-sm text-text-secondary font-normal ml-1">{suffix}</span>
      </p>
    </motion.div>
  );
}
