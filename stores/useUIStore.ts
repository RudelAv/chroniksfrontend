import { create } from 'zustand'

interface UIState {
  isMenuOpen: boolean;
  isDarkMode: boolean;
  toggleMenu: () => void;
  toggleTheme: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMenuOpen: false,
  isDarkMode: false,
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
})) 