"use client";

import type { SiteHoroscopeDay } from "@/src/types/site-horoscope";
import { MetricBar } from "./MetricBar";
import { moodFromConfidence } from "./confidenceMood";

type Props = {
  moodBoard: SiteHoroscopeDay["moodBoard"];
  loveConfidence: number;
  wealthConfidence: number;
  healthConfidence: number;
};

function pillarPercent(
  moodBoard: SiteHoroscopeDay["moodBoard"],
  pillar: "love" | "career" | "health",
  fallback: number,
): number {
  const p = moodBoard?.[pillar];
  const c = p?.confidence;
  if (typeof c === "number" && Number.isFinite(c)) {
    return Math.max(0, Math.min(100, Math.round(c)));
  }
  return Math.max(0, Math.min(100, Math.round(fallback)));
}

/**
 * “Today’s reading at a glance”: Love / Career / Health bars with backend confidence
 * (prefer moodBoard pillar values when present) and mood emojis from those percentages.
 */
export function ReadingAtGlance({
  moodBoard,
  loveConfidence,
  wealthConfidence,
  healthConfidence,
}: Props) {
  const rows = [
    {
      metric: "love" as const,
      value: pillarPercent(moodBoard, "love", loveConfidence),
    },
    {
      metric: "career" as const,
      value: pillarPercent(moodBoard, "career", wealthConfidence),
    },
    {
      metric: "health" as const,
      value: pillarPercent(moodBoard, "health", healthConfidence),
    },
  ];

  return (
    <section className="glass-card rounded-3xl p-4 sm:p-6">
      <div className="mb-3 flex flex-col gap-1 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-headline text-base font-bold text-on-surface sm:text-lg">
          Today&apos;s reading at a glance
        </h3>
        <span className="text-[10px] font-medium uppercase tracking-wide text-on-surface-variant sm:text-xs">
          Confidence
        </span>
      </div>
      <div className="divide-y divide-white/5">
        {rows.map(({ metric, value }) => (
          <div key={metric} className="py-1 first:pt-0 last:pb-0">
            <MetricBar metric={metric} value={value} mood={moodFromConfidence(value)} />
          </div>
        ))}
      </div>
    </section>
  );
}
