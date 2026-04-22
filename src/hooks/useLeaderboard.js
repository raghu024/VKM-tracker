import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from './useAuth.jsx';
import { useUserStore } from '../stores/useUserStore.js';
import { useTaskStore } from '../stores/useTaskStore.js';

export function useLeaderboard() {
  const { user } = useAuth();
  const { profile } = useUserStore();
  const { getTotalPoints } = useTaskStore();

  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const myPoints = getTotalPoints();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Try fetching from Supabase profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, business_name, total_points, city')
          .order('total_points', { ascending: false });

        if (error || !data || data.length === 0) {
          // No real users yet — show only the current user
          const currentUserEntry = {
            id: user?.id || 'current',
            rank: 1,
            name: profile.full_name,
            business: profile.business_name,
            points: myPoints,
            tasks_done: Math.floor(myPoints / 30),
            total: 3,
            isCurrentUser: true,
          };
          setLeaderboard([currentUserEntry]);
        } else {
          // Build real leaderboard from Supabase
          const ranked = data.map((u, i) => ({
            id: u.id,
            rank: i + 1,
            name: u.full_name || 'User',
            business: u.business_name || '—',
            points: u.total_points || 0,
            tasks_done: Math.floor((u.total_points || 0) / 30),
            total: 3,
            isCurrentUser: u.id === user?.id,
          }));
          setLeaderboard(ranked);
        }
      } catch (err) {
        // Supabase unavailable — show only current user
        const currentUserEntry = {
          id: user?.id || 'current',
          rank: 1,
          name: profile.full_name,
          business: profile.business_name,
          points: myPoints,
          tasks_done: Math.floor(myPoints / 30),
          total: 3,
          isCurrentUser: true,
        };
        setLeaderboard([currentUserEntry]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [user, myPoints, profile.full_name, profile.business_name]);

  return { leaderboard, loading };
}
