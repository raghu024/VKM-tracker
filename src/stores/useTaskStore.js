import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_TASKS } from '../lib/mockData.js';

export const useTaskStore = create(
  persist(
    (set, get) => ({
      tasks: { ...MOCK_TASKS },

      toggleTask: async (week, taskId, isCompleted, proofUrls = []) => {
        // Update local state first for responsiveness
        set((state) => ({
          tasks: {
            ...state.tasks,
            [week]: state.tasks[week].map(t =>
              t.id === taskId ? { ...t, is_completed: isCompleted, proof_urls: proofUrls } : t
            ),
          },
        }));

        // Sync to Supabase if possible
        try {
          const { data: { user } } = await import('../lib/supabase.js').then(m => m.supabase.auth.getUser());
          if (user) {
            const { supabase } = await import('../lib/supabase.js');
            
            // 1. Fetch current profile for streak logic
            const { data: profile } = await supabase
              .from('profiles')
              .select('current_streak, last_activity_date')
              .eq('id', user.id)
              .single();

            let newStreak = profile?.current_streak || 0;
            const lastActivity = profile?.last_activity_date ? new Date(profile.last_activity_date) : null;
            const now = new Date();
            
            if (isCompleted) {
              if (!lastActivity) {
                newStreak = 1;
              } else {
                const diffDays = Math.floor((now - lastActivity) / (1000 * 60 * 60 * 24));
                if (diffDays === 1) {
                  newStreak += 1; // Consecutive day
                } else if (diffDays > 1) {
                  newStreak = 1; // Streak broken, restart
                }
                // If diffDays === 0, keep current streak (already active today)
              }
            }

            // 2. Update profile with new streak and activity date
            await supabase
              .from('profiles')
              .update({ 
                current_streak: newStreak, 
                last_activity_date: now.toISOString() 
              })
              .eq('id', user.id);

            // 3. Upsert completion record
            await supabase
              .from('task_completions')
              .upsert({
                user_id: user.id,
                task_id: taskId,
                is_completed: isCompleted,
                proof_urls: proofUrls,
                completed_at: isCompleted ? now.toISOString() : null,
                verification_status: isCompleted ? 'pending' : 'approved',
                batch_id: 'batch-1'
              }, { onConflict: 'task_id,user_id,batch_id' });
          }
        } catch (error) {
          console.error('Failed to sync to Supabase:', error);
        }
      },

      getWeekTasks: (week) => get().tasks[week] || [],

      getTotalPoints: () => {
        const { tasks } = get();
        return Object.values(tasks)
          .flat()
          .filter(t => t.is_completed)
          .reduce((sum, t) => sum + t.points, 0);
      },

      getCompletedCount: (week) => {
        const weekTasks = get().tasks[week] || [];
        return weekTasks.filter(t => t.is_completed).length;
      },
    }),
    {
      name: 'vkm-tasks-storage', // key in localStorage
    }
  )
);

