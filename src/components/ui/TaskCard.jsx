import { CheckCircle2, Circle, Clock, Star, Paperclip, X, File, Image as ImageIcon, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useUserStore } from '../../stores/useUserStore.js';

export default function TaskCard({ task, onToggle, week }) {
  const [showPoints, setShowPoints] = useState(false);
  const [proofFiles, setProofFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleToggle = () => {
    if (!task.is_completed) {
      setShowPoints(true);
      setTimeout(() => setShowPoints(false), 900);
    }
    onToggle(task.id, !task.is_completed, proofFiles.map(f => f.url));
  };

  const { user } = useAuth();
  const { profile } = useUserStore();

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const uploadedFiles = [];
      for (const file of newFiles) {
        // Build storage path: user folder / week-{week} / filename
        const folderName = profile.full_name?.replace(/\s+/g, '_') || 'anonymous';
        const path = `${folderName}/week-${week}/${file.name}`;
        const { data, error } = await supabase.storage.from('proofs').upload(path, file);
        if (error) {
          console.error('Upload error:', error);
        } else {
          // Get public URL (assuming bucket is public)
          const { data: urlData } = supabase.storage.from('proofs').getPublicUrl(data.path);
          uploadedFiles.push({ name: file.name, type: file.type, url: urlData.publicUrl });
        }
      }
      
      const updatedProofs = [...proofFiles, ...uploadedFiles];
      setProofFiles(updatedProofs);

      // Automatically complete task and trigger celebration upon proof upload
      if (!task.is_completed) {
        setShowPoints(true);
        setTimeout(() => setShowPoints(false), 2000); // 2 second celebration
        onToggle(task.id, true, updatedProofs.map(f => f.url));
      }
    }
  };

  const removeFile = (indexToRemove) => {
    setProofFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return <ImageIcon size={14} className="text-blue-400" />;
    if (file.type.startsWith('video/')) return <Video size={14} className="text-purple-400" />;
    return <File size={14} className="text-gold" />;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-2xl transition-all duration-300 border ${
        task.is_completed
          ? 'bg-gold/5 border-gold/25 shadow-[0_0_20px_rgba(212,168,83,0.06)]'
          : 'bg-bg-secondary/60 border-bg-tertiary/50 hover:border-gold/20 hover:bg-bg-secondary/80'
      }`}
    >
      {/* Shimmer effect on completed */}
      {task.is_completed && <div className="absolute inset-0 animate-shimmer pointer-events-none"></div>}

      <div className="p-4 sm:p-5 flex items-start gap-4 relative z-10">
        {/* Checkbox — 48x48 mobile-friendly tap target */}
        <button
          onClick={handleToggle}
          className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200 active:scale-90 focus:outline-none"
          aria-label={task.is_completed ? 'Mark incomplete' : 'Mark complete'}
        >
          <AnimatePresence mode="wait">
            {task.is_completed ? (
              <motion.div
                key="checked"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <CheckCircle2 size={30} className="text-gold drop-shadow-[0_0_8px_rgba(212,168,83,0.5)]" />
              </motion.div>
            ) : (
              <motion.div
                key="unchecked"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Circle size={30} className="text-bg-tertiary hover:text-text-secondary transition-colors" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Task content */}
        <div className="flex-1 min-w-0 space-y-2">
          <h3 className={`text-[15px] sm:text-base font-semibold leading-snug transition-all duration-300 ${
            task.is_completed ? 'text-gold/80 line-through decoration-gold/30' : 'text-text-primary'
          }`}>
            {task.title}
          </h3>

          {task.description && (
            <p className="text-[13px] text-text-secondary leading-relaxed line-clamp-2">{task.description}</p>
          )}

          {/* Admin Feedback Note */}
          {task.notes && (
            <div className={`p-3 rounded-xl border flex items-start gap-3 mt-2 ${
              task.verification_status === 'rejected' 
                ? 'bg-error/5 border-error/20 text-error' 
                : 'bg-bg-tertiary/50 border-bg-tertiary text-text-secondary'
            }`}>
              <div className="shrink-0 mt-0.5">
                {task.verification_status === 'rejected' ? <X size={14} /> : <div className="w-3.5 h-3.5 rounded-full bg-gold/20 flex items-center justify-center text-[10px] font-bold text-gold">i</div>}
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-70 mb-1">Mentor Feedback</p>
                <p className="text-xs italic font-medium">"{task.notes}"</p>
              </div>
            </div>
          )}

          {/* Uploaded Files Display */}
          {proofFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {proofFiles.map((file, idx) => (
                <div key={idx} className="flex items-center gap-1.5 bg-bg-tertiary/70 border border-bg-tertiary px-2.5 py-1 rounded-md max-w-[200px]">
                  {getFileIcon(file)}
                  <a href={file.url || '#'} target="_blank" rel="noopener noreferrer" className="text-xs text-text-primary truncate underline">
                    {file.name}
                  </a>
                  {!task.is_completed && (
                    <button onClick={() => removeFile(idx)} className="text-text-secondary hover:text-error ml-1 transition-colors">
                      <X size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-1.5">
            {/* Points badge */}
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
              task.is_completed
                ? 'bg-gold/15 text-gold border border-gold/20'
                : 'bg-bg-tertiary/60 text-text-secondary border border-bg-tertiary'
            }`}>
              <Star size={12} className={task.is_completed ? 'text-gold fill-gold' : ''} />
              {task.points} pts {task.is_completed ? '✓' : ''}
            </span>

            {/* Attach Proof Button */}
            {!task.is_completed && (
              <div className="relative">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.csv"
                  className="hidden"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                >
                  <Paperclip size={12} /> Attach Proof
                </button>
              </div>
            )}

            {/* Due date */}
            {task.due_date && !task.is_completed && (
              <span className="inline-flex items-center gap-1 text-xs text-text-secondary ml-auto border border-bg-tertiary px-2 py-0.5 rounded-full">
                <Clock size={12} /> {task.due_date}
              </span>
            )}

            {task.is_completed && (
              <span className="text-xs font-semibold text-success ml-auto flex items-center gap-1">
                Completed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Grand Celebration Animation */}
      <AnimatePresence>
        {showPoints && (
          <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center overflow-visible">
            {/* Main Floating Points */}
            <motion.div
              className="absolute text-gold font-black font-mono text-4xl drop-shadow-[0_0_20px_rgba(212,168,83,0.8)]"
              initial={{ opacity: 0, y: 20, scale: 0.5 }}
              animate={{ opacity: [0, 1, 1, 0], y: -80, scale: [0.5, 1.3, 1, 1.1] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            >
              +{task.points} PTS!
            </motion.div>

            {/* Star Burst Particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                style={{
                  backgroundColor: ['#D4A853', '#F5DEB3', '#10B981', '#3B82F6', '#F59E0B'][i % 5],
                  boxShadow: `0 0 10px ${['#D4A853', '#F5DEB3', '#10B981', '#3B82F6', '#F59E0B'][i % 5]}`
                }}
                initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                animate={{ 
                  opacity: [1, 1, 0], 
                  scale: [0, 1.5, 0], 
                  x: (Math.random() - 0.5) * 300, 
                  y: (Math.random() - 0.5) * 200 - 50,
                }}
                transition={{ duration: 1.2, delay: 0.1, ease: 'easeOut' }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
