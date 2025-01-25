import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  user: {
    id: string;
    email: string;
    name: string;
    bio?: string;
    image?: string;
  } | null;
  setUser: (user: UserState['user']) => void;
  clearUser: () => void;
}

export const useStore = create(
  persist<UserState>(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
    }
  )
) 