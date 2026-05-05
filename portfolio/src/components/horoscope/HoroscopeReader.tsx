"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { site, type ZodiacEntry, type ZodiacSlug } from "@/src/content/site";
import {
  getMockHoroscope,
  type DayMode,
  type MockHoroscope,
} from "@/src/content/zodiac-mock";
import type {
  SiteHoroscopeBundle,
  SiteHoroscopeDay,
  SiteWeekly,
} from "@/src/types/site-horoscope";
import { ReadingAtGlance } from "./ReadingAtGlance";
import { SectionTabs, type SectionId } from "./SectionTabs";
import { ZodiacAvatar } from "./ZodiacAvatar";

interface Props {
  sign: ZodiacEntry;
}

const DAYS: { id: DayMode; label: string }[] = [
  { id: "yesterday", label: "Yesterday" },
  { id: "today", label: "Today" },
  { id: "tomorrow", label: "Tomorrow" },
];

const LONG_DATE = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

type DisplayHoroscope = MockHoroscope & {
  moodBoard?: SiteHoroscopeDay["moodBoard"];
};

const SECTION_META: Record<
  SectionId,
  { heading: string; accent: string; getText: (h: DisplayHoroscope) => string }
> = {
  sun: {
    heading: "Sun sign",
    accent: "text-primary",
    getText: (h) => h.summary,
  },
  love: {
    heading: "Love",
    accent: "text-rose-300",
    getText: (h) => h.loveText,
  },
  career: {
    heading: "Career",
    accent: "text-emerald-300",
    getText: (h) => h.wealthText,
  },
  health: {
    heading: "Health",
    accent: "text-sky-300",
    getText: (h) => h.healthText,
  },
};

function apiRowToDisplay(
  slug: ZodiacSlug,
  row: SiteHoroscopeDay,
): DisplayHoroscope {
  return {
    zodiacSign: slug,
    date: row.date,
    title: row.title,
    summary: row.summary,
    loveText: row.loveText,
    wealthText: row.wealthText,
    healthText: row.healthText,
    loveConfidence: row.loveConfidence,
    wealthConfidence: row.wealthConfidence,
    healthConfidence: row.healthConfidence,
    moodBoard: row.moodBoard,
  };
}

export function HoroscopeReader({ sign }: Props) {
  const [day, setDay] = useState<DayMode>("today");
  const [section, setSection] = useState<SectionId>("sun");
  const [bundle, setBundle] = useState<SiteHoroscopeBundle | null>(null);
  const [weekly, setWeekly] = useState<SiteWeekly>(null);
  /** Admin API URL is set (server env). */
  const [apiConfigured, setApiConfigured] = useState<boolean | null>(null);
  /** At least one of yesterday / today / tomorrow returned from admin. */
  const [liveData, setLiveData] = useState(false);
  /** Fetch to admin failed (wrong port, admin down, etc.). */
  const [upstreamError, setUpstreamError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setUpstreamError(false);
        const res = await fetch(`/api/site-horoscope/${encodeURIComponent(sign.slug)}`, {
          cache: "no-store",
        });
        const json = (await res.json()) as {
          success?: boolean;
          configured?: boolean;
          liveData?: boolean;
          upstreamError?: boolean;
          bundle?: SiteHoroscopeBundle | null;
          weekly?: SiteWeekly;
        };
        if (cancelled) return;
        setApiConfigured(Boolean(json.configured));
        setLiveData(Boolean(json.liveData));
        setUpstreamError(Boolean(json.upstreamError));
        if (json.configured && json.liveData && json.bundle) {
          setBundle(json.bundle);
        } else {
          setBundle(null);
        }
        setWeekly(json.weekly ?? null);
      } catch {
        if (!cancelled) {
          setApiConfigured(false);
          setLiveData(false);
          setUpstreamError(true);
          setBundle(null);
          setWeekly(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sign.slug]);

  const horoscope = useMemo((): DisplayHoroscope => {
    const mock = getMockHoroscope(sign.slug, day);
    const row = bundle?.[day];
    if (row) return apiRowToDisplay(sign.slug, row);
    return { ...mock, moodBoard: null };
  }, [sign.slug, day, bundle]);

  const formattedDate = useMemo(
    () => LONG_DATE.format(new Date(horoscope.date)),
    [horoscope.date],
  );

  const weeklyHeading = useMemo(() => {
    if (!weekly?.weekStartDate) return "";
    const d = new Date(`${weekly.weekStartDate}T12:00:00.000Z`);
    if (Number.isNaN(d.getTime())) return weekly.weekStartDate;
    return LONG_DATE.format(d);
  }, [weekly]);

  const meta = SECTION_META[section];
  const activeText = meta.getText(horoscope);

  return (
    <div className="space-y-6 sm:space-y-8">
      {apiConfigured === false && (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center text-xs text-amber-100 sm:text-sm">
          Showing sample copy. Add{" "}
          <code className="rounded bg-black/30 px-1">ASTRADAILY_API_BASE_URL</code> to{" "}
          <code className="rounded bg-black/30 px-1">portfolio/.env.local</code>{" "}
          (see <code className="rounded bg-black/30 px-1">.env.example</code>) pointing at the admin
          app (different port than this site), e.g.{" "}
          <code className="rounded bg-black/30 px-1">http://127.0.0.1:3001</code> or{" "}
          <code className="rounded bg-black/30 px-1">http://127.0.0.1:3001/api</code> when portfolio
          runs on 3000 and admin runs{" "}
          <code className="rounded bg-black/30 px-1">npm run dev:3001</code>. Restart{" "}
          <code className="rounded bg-black/30 px-1">npm run dev</code> after editing env.
        </p>
      )}

      {upstreamError && (
        <p className="rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-center text-xs text-red-100 sm:text-sm">
          Could not reach the admin API. Run the admin app on a different port than this site
          (e.g. <code className="rounded bg-black/30 px-1">cd admin-dashboard2 && npm run dev:3001</code>
          ), and set{" "}
          <code className="rounded bg-black/30 px-1">ASTRADAILY_API_BASE_URL</code> to that origin +
          <code className="rounded bg-black/30 px-1">/api</code> (e.g.{" "}
          <code className="rounded bg-black/30 px-1">http://127.0.0.1:3001/api</code> when portfolio
          uses port 3000).
        </p>
      )}

      {apiConfigured && !liveData && !upstreamError && (
        <p className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-center text-xs text-sky-100 sm:text-sm">
          API is configured, but no published horoscopes matched this sign for UTC
          yesterday / today / tomorrow. Publish drafts in the admin app for this zodiac, then
          refresh.
        </p>
      )}

      {/* Sign header */}
      <section className="glass-card flex flex-col items-center gap-4 rounded-3xl p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        <ZodiacAvatar sign={sign} size="lg" />
        <div className="w-full flex-1 text-center sm:text-left">
          <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl md:text-5xl">
            {sign.label}
          </h1>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-variant sm:text-sm sm:tracking-[0.18em]">
            {sign.dateRange}
          </p>
          <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-start">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl ring-2 ring-primary/30 shadow-md shadow-primary/20 sm:h-11 sm:w-11">
              <Image
                src="/icon.png"
                alt={`${site.name} app icon`}
                width={44}
                height={44}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="leading-tight">
              <p className="font-headline text-base font-extrabold text-on-surface sm:text-lg">
                {site.name}
              </p>
              <p className="text-xs font-medium text-on-surface-variant sm:text-sm">
                Download this app for reminders and saved readings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Day pills */}
      <section className="space-y-3">
        <h2 className="text-center font-headline text-base font-bold text-on-surface sm:text-lg">
          Daily Horoscope
        </h2>
        <div
          role="tablist"
          aria-label="Pick a day"
          className="flex flex-wrap justify-center gap-2 px-0.5"
        >
          {DAYS.map((d) => {
            const active = day === d.id;
            return (
              <button
                key={d.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setDay(d.id)}
                className={`min-h-12 touch-manipulation rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-wide transition-all duration-200 sm:min-h-0 sm:px-5 sm:py-2 sm:text-sm ${
                  active
                    ? "bg-primary text-on-primary-fixed shadow-lg shadow-primary/30"
                    : "bg-surface-container-highest text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Adaptive reading panel + section tabs below (matches mobile HoroscopeCard) */}
      <section className="space-y-3 sm:space-y-4">
        <div className="glass-card rounded-3xl p-4 sm:p-6">
          <p className="wrap-break-word text-[11px] font-bold uppercase leading-snug tracking-[0.12em] text-primary/90 sm:text-xs sm:tracking-[0.18em]">
            {formattedDate}
          </p>
          <h3
            className={`mt-2 font-headline text-lg font-bold uppercase tracking-wide sm:text-xl ${meta.accent}`}
          >
            {meta.heading}
          </h3>
          {section === "sun" && (
            <p className="mt-1 font-headline text-xl font-bold text-on-surface sm:text-2xl">
              {horoscope.title}
            </p>
          )}
          <p className="mt-3 text-sm leading-relaxed text-on-surface-variant sm:mt-4 sm:text-base">
            {activeText}
          </p>
        </div>
        <SectionTabs value={section} onChange={setSection} />
      </section>

      <ReadingAtGlance
        moodBoard={horoscope.moodBoard ?? null}
        loveConfidence={horoscope.loveConfidence}
        wealthConfidence={horoscope.wealthConfidence}
        healthConfidence={horoscope.healthConfidence}
      />

      {weekly && (
        <section className="glass-card rounded-3xl p-4 sm:p-6">
          <h3 className="font-headline text-base font-bold text-on-surface sm:text-lg">
            Week of {weeklyHeading}
          </h3>
          {weekly.title ? (
            <p className="mt-2 text-sm font-semibold text-primary/90">{weekly.title}</p>
          ) : null}
          <p className="mt-3 text-sm leading-relaxed text-on-surface-variant sm:text-base">
            {weekly.outlookText}
          </p>
        </section>
      )}
    </div>
  );
}
