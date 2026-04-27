import { create } from "zustand";

interface AppState {
  readNotificationIds: string[];
  markNotificationRead: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  readNotificationIds: [],
  markNotificationRead: (id) =>
    set((state) => ({
      readNotificationIds: [...state.readNotificationIds, id],
    })),
}));
