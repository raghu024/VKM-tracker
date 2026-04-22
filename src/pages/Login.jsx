import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-gold/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-gold to-gold-light flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(212,168,83,0.3)]">
            <span className="text-bg-primary font-bold text-3xl">VK</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-text-primary mb-2">Welcome Back</h1>
          <p className="text-text-secondary">Sign in to your Mentorship Dashboard</p>
        </div>

        <div className="glass-strong rounded-3xl p-8 relative z-10">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-xl text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-secondary ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-bg-secondary border border-bg-tertiary focus:border-gold/50 rounded-xl outline-none text-text-primary transition-all"
                placeholder="you@company.com"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-text-secondary">Password</label>
                <a href="#" className="text-xs text-gold hover:text-gold-light transition-colors">Forgot password?</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-bg-secondary border border-bg-tertiary focus:border-gold/50 rounded-xl outline-none text-text-primary transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-bg-primary font-bold rounded-xl shadow-[0_4px_20px_rgba(212,168,83,0.2)] hover:opacity-90 transition-opacity flex items-center justify-center mt-2 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
