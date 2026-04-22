import { useState, useEffect } from 'react';
import { User, Mail, Building, MapPin, Edit3, Shield, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { supabase } from '../lib/supabase.js';
import { useUserStore } from '../stores/useUserStore.js';
import { sanitizeObject } from '../lib/security.js';

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { profile, updateProfile } = useUserStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profileData, setProfileData] = useState({ ...profile, email: '' });

  // Keep local form in sync with the persisted store whenever it changes
  useEffect(() => {
    setProfileData(prev => ({ ...prev, ...profile }));
  }, [profile]);

  useEffect(() => {
    if (user?.email) {
      setProfileData(prev => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Fallback
      await supabase.auth.signOut();
      navigate('/login');
    }
  };

  const handleSave = async () => {
    try {
      // ─── Sanitization & Validation ───
      const cleanData = sanitizeObject({
        full_name: profileData.full_name,
        business_name: profileData.business_name,
        city: profileData.city,
      });

      // Local store update
      updateProfile(cleanData);

      // Supabase DB update
      if (user?.id) {
        const { error } = await supabase
          .from('profiles')
          .update(cleanData)
          .eq('id', user.id);
        
        if (error) throw error;
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error.message);
      alert('Failed to save profile. Please check your connection or permissions.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20">
          <User className="text-gold" size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-text-primary">My Profile</h1>
          <p className="text-sm text-text-secondary">Manage your business owner profile.</p>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col sm:flex-row gap-8 items-center sm:items-start">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <div className="relative group shrink-0">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-bg-secondary shadow-[0_0_20px_rgba(212,168,83,0.15)] bg-bg-tertiary">
            <img src={`https://ui-avatars.com/api/?name=${profileData.full_name}&background=1F2937&color=D4A853`} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          {!isEditing && (
             <button onClick={() => setIsEditing(true)} className="absolute bottom-0 right-0 w-10 h-10 bg-gold rounded-full flex items-center justify-center text-bg-primary shadow-lg hover:scale-105 transition-transform border-4 border-bg-primary" title="Edit Profile">
               <Edit3 size={16} />
             </button>
          )}
        </div>

        <div className="flex-1 w-full space-y-5 z-10">
          <div className="flex items-start justify-between">
            {isEditing ? (
              <div className="space-y-1 w-full flex-1">
                <label className="text-xs text-text-secondary ml-1 font-semibold">Full Name</label>
                <input 
                  type="text" 
                  name="full_name"
                  value={profileData.full_name} 
                  onChange={handleChange}
                  className="w-full bg-bg-secondary border border-gold/40 rounded-xl px-3 py-2 text-text-primary focus:outline-none"
                />
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold font-display break-words">{profileData.full_name}</h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gold/10 border border-gold/20 text-gold text-[10px] font-bold uppercase tracking-wider mt-2">
                  <Shield size={12} /> {profileData.role === 'user' ? 'Business Owner' : profileData.role === 'admin' ? 'Mentor / Admin' : 'Super Admin'}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            
            {/* Business Field */}
            <div className="bg-bg-secondary/40 border border-bg-tertiary rounded-xl p-3 flex items-center gap-3">
              <Building size={18} className="text-text-secondary shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">Business</p>
                {isEditing ? (
                  <input 
                    name="business_name"
                    value={profileData.business_name} 
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-gold/40 text-sm font-medium text-text-primary focus:outline-none placeholder-text-secondary/50 mt-1"
                    placeholder="Enter Business Name"
                  />
                ) : (
                  <p className="text-sm font-medium text-text-primary truncate" title={profileData.business_name}>{profileData.business_name}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="bg-bg-secondary/40 border border-bg-tertiary rounded-xl p-3 flex items-center gap-3 opacity-70">
              <Mail size={18} className="text-text-secondary shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">Email</p>
                <p className="text-sm font-medium text-text-primary truncate" title={profileData.email}>{profileData.email}</p>
              </div>
            </div>

            {/* Location Field */}
            <div className="bg-bg-secondary/40 border border-bg-tertiary rounded-xl p-3 flex items-center gap-3 sm:col-span-2">
              <MapPin size={18} className="text-text-secondary shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">Location</p>
                {isEditing ? (
                  <input 
                    name="city"
                    value={profileData.city} 
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-gold/40 text-sm font-medium text-text-primary focus:outline-none placeholder-text-secondary/50 mt-1"
                    placeholder="E.g., Hyderabad"
                  />
                ) : (
                  <p className="text-sm font-medium text-text-primary truncate" title={`${profileData.city || 'City not set'}, Telangana`}>
                    {profileData.city || 'Enter City'}{profileData.city ? ', ' : ''}Telangana
                  </p>
                )}
              </div>
            </div>

          </div>
          
          <div className="pt-4 border-t border-bg-tertiary flex gap-3">
             {isEditing ? (
                <>
                  <button onClick={handleSave} className="px-5 py-2.5 bg-gold text-bg-primary font-bold text-sm rounded-xl hover:bg-gold-light transition-colors shadow-lg shadow-gold/20 flex items-center justify-center gap-2 flex-1">
                    <Check size={16} /> Save Profile
                  </button>
                  <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 bg-bg-secondary border border-bg-tertiary text-text-secondary font-bold text-sm rounded-xl hover:bg-bg-secondary/80 transition-colors flex items-center justify-center gap-2">
                    <X size={16} /> Cancel
                  </button>
                </>
             ) : (
               <div className="flex flex-col w-full gap-3">
                 {saveSuccess && (
                   <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-bold text-success text-center mb-1">
                     Changes saved successfully!
                   </motion.div>
                 )}
                 <button onClick={handleLogout} className="w-full px-5 py-2.5 bg-bg-secondary border border-error/50 text-error font-bold text-sm rounded-xl hover:bg-error/10 transition-colors">
                   Sign Out
                 </button>
               </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
}
