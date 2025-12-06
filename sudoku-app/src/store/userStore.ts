import { create } from 'zustand';
import type { UserProfile } from '../types/user';

interface UserState {
  user: UserProfile | null;
  isLoading: boolean;
  setUser: (user: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clearUser: () => void;
  reset: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => set({ user, isLoading: false }),

  updateProfile: (updates) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            ...updates,
          }
        : null,
    })),

  clearUser: () => set({ user: null, isLoading: false }),
  
  reset: () => set({ user: null, isLoading: false }),
}));
