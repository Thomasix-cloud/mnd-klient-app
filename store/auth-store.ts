import { create } from "zustand";
import { User } from "@/types";
import { mockUser } from "@/data/mock-user";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (email: string, password: string) => {
    // TODO: Replace with real API authentication
    if (!email.trim() || !password.trim()) return false;
    set({ isAuthenticated: true, user: mockUser });
    return true;
  },
  logout: () => {
    set({ isAuthenticated: false, user: null });
  },
}));
