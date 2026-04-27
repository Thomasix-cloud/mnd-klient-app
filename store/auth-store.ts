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
  login: (_email: string, _password: string) => {
    // Mock login — any credentials work
    set({ isAuthenticated: true, user: mockUser });
    return true;
  },
  logout: () => {
    set({ isAuthenticated: false, user: null });
  },
}));
