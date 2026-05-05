"use client";

import type { HoroscopeMoodBoard } from "@/lib/mood-board";

/** Avoid `n || 70` so valid 0 and NaN from bad JSON are handled. */
function readPillarScore(raw: unknown, fallback = 72): number {
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return Math.max(0, Math.min(100, Math.round(raw)));
  }
  if (typeof raw === "string" && raw.trim() !== "") {
    const n = Number(raw);
    if (Number.isFinite(n)) return Math.max(0, Math.min(100, Math.round(n)));
  }
  return fallback;
}

function moodFromConfidence(value: number): { emoji: string; label: string } {
  const n = Math.max(0, Math.min(100, Math.round(Number(value))));
  if (n >= 70) return { emoji: "😊", label: "Strong day" };
  if (n >= 45) return { emoji: "😐", label: "Mixed or mild" };
  return { emoji: "😔", label: "Challenging or low energy" };
}

function pillarPercent(
  moodBoard: HoroscopeMoodBoard | null | undefined,
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

const ROW_META: Record<
  "love" | "career" | "health",
  { label: string; track: string; accent: string }
> = {
  love: {
    label: "Love",
    track: "from-pink-400 to-rose-500",
    accent: "text-pink-400",
  },
  career: {
    label: "Career",
    track: "from-emerald-400 to-teal-500",
    accent: "text-emerald-400",
  },
  health: {
    label: "Health",
    track: "from-sky-400 to-cyan-500",
    accent: "text-sky-400",
  },
};

type Props = {
  moodBoard: HoroscopeMoodBoard | null | undefined;
  loveConfidence?: number | null;
  wealthConfidence?: number | null;
  healthConfidence?: number | null;
};

/** Matches portfolio “at a glance” metrics for admin previews. */
export function HoroscopeMoodGlance({
  moodBoard,
  loveConfidence,
  wealthConfidence,
  healthConfidence,
}: Props) {
  const love = readPillarScore(loveConfidence);
  const wealth = readPillarScore(wealthConfidence);
  const health = readPillarScore(healthConfidence);
  const rows: Array<{
    key: "love" | "career" | "health";
    value: number;
    headline?: string;
    vibes?: string[];
  }> = [
    {
      key: "love",
      value: pillarPercent(moodBoard, "love", love),
      headline: moodBoard?.love?.headline,
      vibes: moodBoard?.love?.vibes,
    },
    {
      key: "career",
      value: pillarPercent(moodBoard, "career", wealth),
      headline: moodBoard?.career?.headline,
      vibes: moodBoard?.career?.vibes,
    },
    {
      key: "health",
      value: pillarPercent(moodBoard, "health", health),
      headline: moodBoard?.health?.headline,
      vibes: moodBoard?.health?.vibes,
    },
  ];

  return (
    <div className="rounded-xl border border-purple-500/25 bg-purple-950/30 p-4">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Mood metrics (site + app)
      </p>
      <div className="space-y-4">
        {rows.map(({ key, value, headline, vibes }) => {
          const meta = ROW_META[key];
          const mood = moodFromConfidence(value);
          return (
            <div key={key}>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className={`material-symbols-outlined text-base ${meta.accent}`} aria-hidden>
                  {key === "love" ? "favorite" : key === "career" ? "work" : "monitor_heart"}
                </span>
                <span className="text-sm font-semibold text-slate-100">{meta.label}</span>
                <span className={`ml-auto text-sm font-bold tabular-nums ${meta.accent}`}>
                  {value}%
                </span>
                <span className="text-lg leading-none" role="img" aria-label={mood.label}>
                  {mood.emoji}
                </span>
              </div>
              {(headline || (vibes && vibes.length > 0)) && (
                <p className="mt-1 pl-8 text-xs text-muted-foreground">
                  {headline ? <span className="font-medium text-slate-300">{headline}</span> : null}
                  {headline && vibes?.length ? " · " : null}
                  {vibes?.length ? vibes.join(", ") : null}
                </p>
              )}
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full bg-linear-to-r ${meta.track}`}
                  style={{ width: `${value}%` }}
                  role="progressbar"
                  aria-valuenow={value}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${meta.label} ${value}%`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
