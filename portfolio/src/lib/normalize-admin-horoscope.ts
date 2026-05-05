import type {
  SiteHoroscopeBundle,
  SiteHoroscopeDay,
  SiteHoroscopeMoodBoard,
  SiteWeekly,
  SiteMoodBoardPillar,
} from "@/src/types/site-horoscope";

function num(v: unknown, fallback: number): number {
  if (typeof v === "number" && Number.isFinite(v)) {
    return Math.max(0, Math.min(100, Math.round(v)));
  }
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    if (Number.isFinite(n)) return Math.max(0, Math.min(100, Math.round(n)));
  }
  return fallback;
}

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim().length > 0 ? v.trim() : null;
}

function parseVibes(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .slice(0, 6)
    .map((x) => (typeof x === "string" ? x.trim() : ""))
    .filter(Boolean);
}

function parseMoodPillar(raw: unknown): SiteMoodBoardPillar | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const headline = str(o.headline) ?? str(o.title) ?? str(o.tagline);
  if (!headline) return null;
  const vibes = parseVibes(o.vibes);
  const paletteRaw = typeof o.palette === "string" ? o.palette.trim() : "#94a3b8";
  const palette = /^#[0-9A-Fa-f]{3,8}$/.test(paletteRaw) ? paletteRaw : "#94a3b8";
  const confidence =
    o.confidence != null ? num(o.confidence, 72) : undefined;
  return { headline, vibes: vibes.length ? vibes : ["Present", "Steady", "Open"], palette, confidence };
}

function parseMoodBoard(raw: unknown): SiteHoroscopeMoodBoard | null {
  if (raw == null) return null;
  const obj: Record<string, unknown> =
    typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>) : {};

  const inner =
    typeof obj.moodBoard === "object" && obj.moodBoard !== null
      ? (obj.moodBoard as Record<string, unknown>)
      : obj;

  const love = parseMoodPillar(inner.love ?? inner.Love);
  const health = parseMoodPillar(inner.health ?? inner.Health);
  const career = parseMoodPillar(
    inner.career ?? inner.Career ?? inner.wealth ?? inner.Wealth,
  );
  if (!love || !health || !career) return null;
  return { love, health, career };
}

export function parseSiteHoroscopeDay(raw: unknown): SiteHoroscopeDay | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = str(o.id);
  const title = str(o.title);
  const summary = str(o.summary);
  const wealthText = str(o.wealthText);
  const loveText = str(o.loveText);
  const healthText = str(o.healthText);
  const date = str(o.date) ?? (typeof o.date === "string" ? o.date : null);
  const zodiacSign =
    typeof o.zodiacSign === "string" && o.zodiacSign.trim() ? o.zodiacSign.trim() : null;
  if (!id || !title || !summary || !wealthText || !loveText || !healthText || !date || !zodiacSign) {
    return null;
  }
  return {
    id,
    zodiacSign,
    date,
    title,
    summary,
    wealthText,
    loveText,
    healthText,
    loveConfidence: num(o.loveConfidence, 72),
    wealthConfidence: num(o.wealthConfidence, 72),
    healthConfidence: num(o.healthConfidence, 72),
    moodBoard: parseMoodBoard(o.moodBoard),
    weeklyOutlook:
      typeof o.weeklyOutlook === "string"
        ? o.weeklyOutlook
        : o.weeklyOutlook === null
          ? null
          : undefined,
  };
}

/** Safe parse — invalid/missing upstream payload yields all-null modes (not an HTTP error). */
export function parseSiteHoroscopeBundle(raw: unknown): SiteHoroscopeBundle {
  if (!raw || typeof raw !== "object") {
    return { yesterday: null, today: null, tomorrow: null };
  }
  const b = raw as Record<string, unknown>;
  return {
    yesterday: parseSiteHoroscopeDay(b.yesterday),
    today: parseSiteHoroscopeDay(b.today),
    tomorrow: parseSiteHoroscopeDay(b.tomorrow),
  };
}

export function parseSiteWeekly(raw: unknown): SiteWeekly {
  if (raw == null || typeof raw !== "object") return null;
  const w = raw as Record<string, unknown>;
  const weekStartDate = str(w.weekStartDate);
  const outlookText = str(w.outlookText);
  if (!weekStartDate || !outlookText) return null;
  const title = str(w.title) ?? undefined;
  return { weekStartDate, outlookText, ...(title ? { title } : {}) };
}
