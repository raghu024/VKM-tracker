import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HealthLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if coming from VKM with a session token
    // In a real SSO, you would verify a token from URL or the session would already be shared via cookies across subdomains
    // For this simulation, we check auth state directly since it's the same supabase project
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/health/dashboard');
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/health/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background decorations - slightly different color scheme for Health Portal */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(52,211,153,0.3)]">
            <span className="text-white font-bold text-3xl">HP</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Health Portal</h1>
          <p className="text-slate-400">Sign in to track your baseline metrics</p>
        </div>

        <div className="bg-[#1e293b]/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 relative z-10">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-400 ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 focus:border-emerald-500/50 rounded-xl outline-none text-white transition-all"
                placeholder="you@company.com"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-slate-400">Password</label>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 focus:border-emerald-500/50 rounded-xl outline-none text-white transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-bold rounded-xl shadow-[0_4px_20px_rgba(52,211,153,0.2)] hover:opacity-90 transition-opacity flex items-center justify-center mt-2 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <div className="text-center pt-4">
              <a href="/login" className="text-sm text-slate-500 hover:text-white transition-colors">← Back to VKM Tracker</a>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
