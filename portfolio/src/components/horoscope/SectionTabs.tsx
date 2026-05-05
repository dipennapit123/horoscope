"use client";

import type { Dispatch, SetStateAction } from "react";

export type SectionId = "sun" | "love" | "career" | "health";

interface SectionMeta {
  id: SectionId;
  label: string;
  icon: string;
  active: string;
  inactive: string;
}

const SECTIONS: SectionMeta[] = [
  {
    id: "sun",
    label: "Sun sign",
    icon: "auto_awesome",
    active: "border-primary/70 bg-primary/15 text-primary shadow-lg shadow-primary/20",
    inactive: "border-white/10 bg-black/40 text-on-surface-variant hover:text-on-surface",
  },
  {
    id: "love",
    label: "Love",
    icon: "favorite",
    active: "border-rose-400/70 bg-rose-500/15 text-rose-300 shadow-lg shadow-rose-500/20",
    inactive: "border-white/10 bg-black/40 text-on-surface-variant hover:text-on-surface",
  },
  {
    id: "career",
    label: "Career",
    icon: "work",
    active: "border-emerald-400/70 bg-emerald-500/15 text-emerald-300 shadow-lg shadow-emerald-500/20",
    inactive: "border-white/10 bg-black/40 text-on-surface-variant hover:text-on-surface",
  },
  {
    id: "health",
    label: "Health",
    icon: "monitor_heart",
    active: "border-sky-400/70 bg-sky-500/15 text-sky-300 shadow-lg shadow-sky-500/20",
    inactive: "border-white/10 bg-black/40 text-on-surface-variant hover:text-on-surface",
  },
];

interface Props {
  value: SectionId;
  onChange: Dispatch<SetStateAction<SectionId>>;
}

/** Mirrors the mobile HoroscopeCard tab pattern (Sun sign / Love / Career / Health). */
export function SectionTabs({ value, onChange }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Horoscope sections"
      className="-mx-1 hide-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:pb-0 md:grid-cols-4 md:gap-3"
    >
      {SECTIONS.map((s) => {
        const active = value === s.id;
        return (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(s.id)}
            className={`flex min-h-12 shrink-0 snap-center items-center justify-center gap-2 rounded-full border px-4 py-3 text-xs font-bold uppercase tracking-wide transition-all duration-200 touch-manipulation sm:min-h-0 sm:flex-1 sm:px-4 sm:py-2.5 sm:text-sm ${
              active ? s.active : s.inactive
            }`}
          >
            <span className="material-symbols-outlined text-[18px] sm:text-[18px]" aria-hidden>
              {s.icon}
            </span>
            <span className="whitespace-nowrap">{s.label}</span>
          </button>
        );
      })}
    </div>
  );
}
