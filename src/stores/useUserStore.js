import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_USER } from '../lib/mockData.js';

export const useUserStore = create(
  persist(
    (set) => ({
      profile: {
        full_name: MOCK_USER.full_name,
        business_name: MOCK_USER.business_name,
        city: MOCK_USER.city,
        role: 'user', // Default role
      },
      updateProfile: (newProfile) => 
        set((state) => ({ 
          profile: { ...state.profile, ...newProfile } 
        })),
      clearProfile: () => set({ 
        profile: { full_name: '', business_name: '', city: '', role: 'user' } 
      }),
    }),
    {
      name: 'vkm-user-profile-storage',
    }
  )
);
