import { useState, useEffect } from 'react';
import { Megaphone, X, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getBroadcasts } from '../../lib/admin.js';

export default function BroadcastBanner() {
  const [broadcasts, setBroadcasts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchBroadcasts = async () => {
      try {
        const data = await getBroadcasts();
        setBroadcasts(data || []);
      } catch (error) {
        console.error('Error fetching broadcasts:', error);
      }
    };
    fetchBroadcasts();
  }, []);

  if (broadcasts.length === 0 || !isVisible) return null;

  const current = broadcasts[currentIndex];

  const getIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="text-error" size={18} />;
      case 'success': return <CheckCircle className="text-success" size={18} />;
      default: return <Info className="text-blue-400" size={18} />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'warning': return 'bg-error/10 border-error/20';
      case 'success': return 'bg-success/10 border-success/20';
      default: return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`relative overflow-hidden rounded-2xl border p-4 mb-6 ${getBgColor(current.type)}`}
      >
        <div className="flex items-start gap-4 pr-8">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <Megaphone size={18} className="text-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
              {getIcon(current.type)} {current.title}
            </h4>
            <p className="text-xs text-text-secondary mt-1 leading-relaxed">
              {current.content}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] text-text-secondary font-medium">
                Posted by {current.profiles?.full_name} • {new Date(current.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors"
        >
          <X size={16} />
        </button>

        {broadcasts.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-3">
            {broadcasts.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${currentIndex === idx ? 'bg-gold w-3' : 'bg-text-secondary/30'}`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
