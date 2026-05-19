import { create } from "zustand";
import type { User } from "../types/user.type";
import { persist } from "zustand/middleware";



interface AuthStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "auth-storage", // clave en localStorage
    }
  )
);
