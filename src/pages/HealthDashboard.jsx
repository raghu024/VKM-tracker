import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Activity, Droplets, Moon, Coffee, ArrowLeft } from 'lucide-react';

export default function HealthDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/health');
      } else {
        setUser(user);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/health');
  };

  const handleBackToVKM = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.2)]">
              <span className="text-white font-bold text-xl">HP</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Health Portal</h1>
              <p className="text-sm text-slate-400">Week 1 Baseline Tracking</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button 
                onClick={handleBackToVKM}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg text-sm text-emerald-400 hover:bg-slate-700 transition-colors"
                title="Back to VKM Tracker"
             >
                <ArrowLeft size={16} /> Return to VKM
             </button>
            <button 
              onClick={handleLogout}
              className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <HealthMetricCard title="Daily Water" icon={<Droplets size={24} className="text-blue-400" />} value="2.5" unit="L" target="3L" />
            <HealthMetricCard title="Sleep Quality" icon={<Moon size={24} className="text-indigo-400" />} value="7.5" unit="hrs" target="8hrs" />
            <HealthMetricCard title="OMM Practice" icon={<Coffee size={24} className="text-amber-400" />} value="5" unit="days" target="7days" />
            <HealthMetricCard title="Active Minutes" icon={<Activity size={24} className="text-emerald-400" />} value="45" unit="min" target="60min" />
          </div>

          <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold text-white">Daily Health Log</h2>
               <button className="px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-600 transition-colors shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                 + Add Entry
               </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 border border-slate-700 rounded-xl bg-[#0f172a] opacity-60 text-center py-10 text-slate-500">
                Start tracking your baseline habits for week 1.<br/> Entries will appear here.
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function HealthMetricCard({ title, icon, value, unit, target }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-5 shadow-lg relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
         {icon}
      </div>
      <div className="flex items-center gap-3 mb-3 relative z-10">
        <div className="p-2.5 bg-[#0f172a] rounded-lg">
          {icon}
        </div>
        <h3 className="text-slate-300 font-medium">{title}</h3>
      </div>
      <div className="flex items-baseline gap-2 relative z-10 mb-1">
        <span className="text-4xl font-bold text-white tracking-tight">{value}</span>
        <span className="text-slate-400 font-medium">{unit}</span>
      </div>
      <div className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-md inline-block">
        Target: {target}
      </div>
    </motion.div>
  );
}
