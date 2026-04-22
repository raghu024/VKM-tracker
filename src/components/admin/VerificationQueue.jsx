import { useState, useEffect } from 'react';
import { Check, X, ExternalLink, Image as ImageIcon, FileText, Play, Loader2, AlertCircle } from 'lucide-react';
import { getPendingProofs, verifyCompletion } from '../../lib/admin.js';
import { useAuth } from '../../hooks/useAuth.jsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function VerificationQueue() {
  const [proofs, setProofs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchProofs();
  }, []);

  const fetchProofs = async () => {
    try {
      const data = await getPendingProofs();
      setProofs(data);
    } catch (error) {
      console.error('Error fetching proofs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (completionId, status, points) => {
    setProcessingId(completionId);
    try {
      await verifyCompletion(completionId, status, points, user.id, adminNote);
      setProofs(prev => prev.filter(p => p.id !== completionId));
      setAdminNote('');
    } catch (error) {
      console.error('Error verifying completion:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-text-secondary">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p>Fetching pending verifications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold font-display text-text-primary flex items-center gap-2">
          Pending Verifications <span className="bg-gold/20 text-gold px-2 py-0.5 rounded text-xs">{proofs.length}</span>
        </h2>
      </div>

      <AnimatePresence mode="popLayout">
        {proofs.map((proof) => (
          <motion.div
            key={proof.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card rounded-2xl overflow-hidden border-bg-tertiary flex flex-col lg:flex-row"
          >
            {/* User & Task Info */}
            <div className="p-5 lg:w-1/3 border-b lg:border-b-0 lg:border-r border-bg-tertiary bg-bg-secondary/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold">
                  {proof.profiles?.full_name?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-text-primary text-sm">{proof.profiles?.full_name}</p>
                  <p className="text-xs text-text-secondary">{proof.profiles?.business_name}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold text-gold tracking-widest">Task</p>
                <h4 className="font-semibold text-text-primary leading-tight">{proof.tasks?.title}</h4>
                <p className="text-xs text-text-secondary line-clamp-2">{proof.tasks?.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] bg-bg-tertiary px-2 py-0.5 rounded text-text-secondary uppercase font-bold">
                    {proof.tasks?.points} Points at stake
                  </span>
                </div>
              </div>
            </div>

            {/* Proofs Display */}
            <div className="p-5 lg:flex-1 bg-bg-primary/20">
              <p className="text-[10px] uppercase font-bold text-text-secondary tracking-widest mb-3">Submitted Proofs</p>
              <div className="flex flex-wrap gap-3">
                {proof.proof_urls && proof.proof_urls.length > 0 ? (
                   proof.proof_urls.map((url, i) => (
                    <a 
                      key={i} 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group relative w-24 h-24 rounded-xl overflow-hidden border border-bg-tertiary hover:border-gold/50 transition-all bg-bg-secondary flex items-center justify-center"
                    >
                      {url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                        <img src={url} alt="Proof" className="w-full h-full object-cover group-hover:scale-110 transition-all" />
                      ) : url.match(/\.(mp4|webm|mov)$/i) ? (
                        <Play size={24} className="text-gold" />
                      ) : (
                        <FileText size={24} className="text-blue-400" />
                      )}
                      <div className="absolute inset-0 bg-bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ExternalLink size={16} className="text-gold" />
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="flex items-center gap-2 text-text-secondary italic text-sm">
                    <AlertCircle size={16} /> No visual proof attached (Self-certified)
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="p-5 lg:w-64 flex flex-col justify-center gap-3 bg-bg-secondary/50 border-t lg:border-t-0 lg:border-l border-bg-tertiary">
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase font-bold text-text-secondary tracking-widest px-1">Verification Note</p>
                <textarea 
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Add feedback for user..."
                  className="w-full p-2.2 text-xs bg-bg-primary border border-bg-tertiary rounded-xl focus:outline-none focus:border-gold/50 text-text-primary h-20 resize-none"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  disabled={processingId === proof.id}
                  onClick={() => handleVerify(proof.id, 'approved', proof.tasks?.points)}
                  className="flex-1 flex items-center justify-center gap-2 bg-success/10 text-success border border-success/20 hover:bg-success/20 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                >
                  {processingId === proof.id ? <Loader2 className="animate-spin" size={16} /> : <Check size={18} />} Approve
                </button>
                <button
                  disabled={processingId === proof.id}
                  onClick={() => handleVerify(proof.id, 'rejected', 0)}
                  className="flex-1 flex items-center justify-center gap-2 bg-error/10 text-error border border-error/20 hover:bg-error/20 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                >
                  {processingId === proof.id ? <Loader2 className="animate-spin" size={16} /> : <X size={18} />} Reject
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {proofs.length === 0 && (
          <div className="glass-card rounded-2xl p-16 text-center border-dashed border-2 border-bg-tertiary">
            <div className="w-16 h-16 bg-bg-tertiary/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="text-text-secondary" size={32} />
            </div>
            <h3 className="text-xl font-bold text-text-primary">All caught up!</h3>
            <p className="text-text-secondary mt-2">There are no pending proofs to verify right now.</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
