"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AdminInfo {
  id: string;
  name: string;
  username?: string;
  role: string;
}

interface AuthState {
  token: string | null;
  admin: AdminInfo | null;
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  login: (payload: { token: string; admin: AdminInfo }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      admin: null,
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      login: ({ token, admin }) => set({ token, admin }),
      logout: () => set({ token: null, admin: null }),
    }),
    {
      name: "astradaily-admin-auth",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
