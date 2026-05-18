import { create } from "zustand";

interface UIState {
  // State
  sidebarOpen: boolean;

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  // Initial state
  sidebarOpen: false,

  // Toggle open/close
  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),

  // Set trực tiếp
  setSidebarOpen: (open) =>
    set({
      sidebarOpen: open,
    }),
}));