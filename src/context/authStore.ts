import { create } from "zustand";
import { persist } from "zustand/middleware";

interface user{ userId: number; userName: string; imageData: string; email: string; lock: boolean }

interface AuthState {
  isAuthenticated: boolean;
  user: user | null;
  login: (userData: user) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (userData) => set({ isAuthenticated: true, user: userData }),
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: "auth-storage", // 🔑 key in localStorage
    }
  )
);

