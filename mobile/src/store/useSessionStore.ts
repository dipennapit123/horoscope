import { create } from "zustand";
import type { Horoscope, ZodiacSign } from "../types";

interface SessionState {
  clerkUserId: string | null;
  token: string | null;
  zodiacSign: ZodiacSign | null;
  todayHoroscope: Horoscope | null;
  history: Horoscope[];
  theme: "dark" | "system";
  defaultDayMode: "yesterday" | "today" | "tomorrow";
  setAuth: (payload: { clerkUserId: string; token: string }) => void;
  setZodiacSign: (sign: ZodiacSign) => void;
  setTodayHoroscope: (h: Horoscope | null) => void;
  setHistory: (items: Horoscope[]) => void;
  setTheme: (theme: "dark" | "system") => void;
  setDefaultDayMode: (mode: "yesterday" | "today" | "tomorrow") => void;
  logout: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  clerkUserId: null,
  token: null,
  zodiacSign: null,
  todayHoroscope: null,
  history: [],
  theme: "dark",
  defaultDayMode: "today",
  setAuth: ({ clerkUserId, token }) => set({ clerkUserId, token }),
  setZodiacSign: (zodiacSign) => set({ zodiacSign }),
  setTodayHoroscope: (todayHoroscope) => set({ todayHoroscope }),
  setHistory: (history) => set({ history }),
  setTheme: (theme) => set({ theme }),
  setDefaultDayMode: (defaultDayMode) => set({ defaultDayMode }),
  logout: () =>
    set({
      clerkUserId: null,
      token: null,
      zodiacSign: null,
      todayHoroscope: null,
      history: [],
      theme: "dark",
      defaultDayMode: "today",
    }),
}));

