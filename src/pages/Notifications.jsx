import { Bell, CheckCircle, Info, AlertTriangle, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const NOTIFICATIONS = [
  {
    id: 1,
    type: 'success',
    title: 'Proof Approved',
    message: 'Mentor has approved your "Ideal Daily Routine" proof. +30 Points awarded!',
    time: '2 hours ago',
    read: false,
    category: 'Task Result'
  },
  {
    id: 2,
    type: 'info',
    title: 'New Week Unlocked',
    message: 'Week 2: "Team Aspiration & Goal Setting" is now available for early access.',
    time: '5 hours ago',
    read: true,
    category: 'System'
  },
  {
    id: 3,
    type: 'warning',
    title: 'Task Deadline Approaching',
    message: 'Your SMART Goals for Q2 are due in 24 hours. Don\'t forget to upload proof!',
    time: '1 day ago',
    read: true,
    category: 'Reminder'
  },
  {
    id: 4,
    type: 'success',
    title: 'Rank Increased!',
    message: 'Congratulation! You moved up to Rank #4 on the Leaderboard.',
    time: '2 days ago',
    read: true,
    category: 'Milestone'
  }
];

export default function Notifications() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-text-primary">Notifications</h1>
          <p className="text-sm text-text-secondary">Stay updated with your mentorship progress and alerts.</p>
        </div>
        <button className="text-xs font-semibold text-gold hover:text-gold-light transition-colors">
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {NOTIFICATIONS.map((notif, index) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`glass-card p-4 rounded-2xl flex gap-4 items-start border transition-all hover:bg-bg-tertiary/30 ${notif.read ? 'opacity-70 border-bg-tertiary/50' : 'border-gold/20 shadow-[0_0_15px_rgba(212,168,83,0.05)]'}`}
          >
            <div className={`mt-1 p-2 rounded-xl border ${
              notif.type === 'success' ? 'bg-success/10 text-success border-success/20' :
              notif.type === 'warning' ? 'bg-error/10 text-error border-error/20' :
              'bg-blue-500/10 text-blue-400 border-blue-500/20'
            }`}>
              {notif.type === 'success' ? <CheckCircle size={18} /> :
               notif.type === 'warning' ? <AlertTriangle size={18} /> :
               <Info size={18} />}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider font-bold text-gold opacity-80">{notif.category}</span>
                <span className="text-[10px] text-text-secondary flex items-center gap-1">
                  <Clock size={10} /> {notif.time}
                </span>
              </div>
              <h3 className="text-sm font-bold text-text-primary">{notif.title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{notif.message}</p>
            </div>

            {!notif.read && (
              <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_8px_rgba(212,168,83,0.8)] mt-2"></div>
            )}
            
            <button className="self-center p-1 text-text-secondary hover:text-gold transition-colors">
              <ChevronRight size={16} />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="pt-4 text-center">
        <button className="text-xs font-bold text-text-secondary hover:text-text-primary transition-all">
          View Older Notifications
        </button>
      </div>
    </div>
  );
}
