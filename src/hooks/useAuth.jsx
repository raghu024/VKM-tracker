import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';
import { useUserStore } from '../stores/useUserStore.js';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { updateProfile, clearProfile } = useUserStore();

  const fetchProfile = async (userId) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Supabase RLS/Fetch Error:', error);
        throw error;
      }
      
      if (data) {
        console.log('Profile fetched successfully:', data);
        updateProfile(data);
      } else {
        console.warn('No profile found for user:', userId);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error.message);
    }
  };

  useEffect(() => {
    // Get initial session
    const fetchUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (user) {
          setUser(user);
          await fetchProfile(user.id);
        }
      } catch (error) {
        console.error('Error fetching user:', error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          await fetchProfile(currentUser.id);
        } else {
          clearProfile();
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    // ─── Rate Limiting / Brute Force Protection ───
    const lockoutKey = `vkm_auth_lockout_${email}`;
    const lockoutData = JSON.parse(localStorage.getItem(lockoutKey) || '{"count": 0, "lastAttempt": 0}');
    const now = Date.now();
    const LOCKOUT_REASON_MINS = 15;
    const MAX_ATTEMPTS = 5;

    // Check if currently locked out
    if (lockoutData.count >= MAX_ATTEMPTS && now - lockoutData.lastAttempt < LOCKOUT_REASON_MINS * 60 * 1000) {
      const remainingMins = Math.ceil((LOCKOUT_REASON_MINS * 60 * 1000 - (now - lockoutData.lastAttempt)) / 60000);
      throw new Error(`Too many failed attempts. Please try again in ${remainingMins} minutes for security.`);
    }

    // Reset if window has passed
    if (now - lockoutData.lastAttempt > LOCKOUT_REASON_MINS * 60 * 1000) {
      lockoutData.count = 0;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        // Track failed attempt
        const updatedLockout = {
          count: lockoutData.count + 1,
          lastAttempt: now
        };
        localStorage.setItem(lockoutKey, JSON.stringify(updatedLockout));
        throw error;
      }

      // Success - Clear lockout
      localStorage.removeItem(lockoutKey);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    clearProfile();
  };

  return { user, loading, signIn, signOut };
}
