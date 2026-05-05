import type { ReactNode } from "react";

export type MetricKey = "love" | "career" | "health";

const META: Record<
  MetricKey,
  { label: string; icon: string; trackFrom: string; trackTo: string; valueText: string }
> = {
  love: {
    label: "Love",
    icon: "favorite",
    trackFrom: "from-pink-400",
    trackTo: "to-rose-500",
    valueText: "text-rose-300",
  },
  career: {
    label: "Career",
    icon: "work",
    trackFrom: "from-emerald-400",
    trackTo: "to-teal-500",
    valueText: "text-emerald-300",
  },
  health: {
    label: "Health",
    icon: "monitor_heart",
    trackFrom: "from-sky-400",
    trackTo: "to-cyan-500",
    valueText: "text-sky-300",
  },
};

interface Props {
  metric: MetricKey;
  value: number;
  /** Happy / mild / sad emoji from confidence tier (optional). */
  mood?: { emoji: string; label: string };
}

/** Label + gradient bar + percent (+ optional mood emoji). */
export function MetricBar({ metric, value, mood }: Props): ReactNode {
  const { label, icon, trackFrom, trackTo, valueText } = META[metric];
  const clamped = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 py-2 sm:flex-nowrap sm:gap-4">
      <div className="order-1 flex min-w-0 flex-1 items-center gap-2 sm:w-28 sm:flex-none sm:shrink-0">
        <span className={`material-symbols-outlined shrink-0 text-base ${valueText}`} aria-hidden>
          {icon}
        </span>
        <span className="min-w-0 truncate text-sm font-semibold text-on-surface">
          {label}
        </span>
      </div>
      <div className="order-2 flex shrink-0 items-center gap-1.5 sm:order-3">
        <span
          className={`font-headline text-sm font-bold tabular-nums sm:w-10 sm:text-right ${valueText}`}
        >
          {clamped}%
        </span>
        {mood ? (
          <span
            className="text-lg leading-none sm:text-xl"
            role="img"
            aria-label={`${mood.label} for ${label}`}
          >
            {mood.emoji}
          </span>
        ) : null}
      </div>
      <div className="relative order-3 h-2 w-full basis-full overflow-hidden rounded-full bg-surface-container-highest sm:order-2 sm:w-0 sm:min-w-0 sm:flex-1 sm:basis-auto">
        <div
          className={`h-full rounded-full bg-linear-to-r ${trackFrom} ${trackTo} transition-[width] duration-700 ease-out`}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label} ${clamped}%`}
        />
      </div>
    </div>
  );
}
