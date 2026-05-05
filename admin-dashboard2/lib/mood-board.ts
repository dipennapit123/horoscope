/**
 * Mood board for portfolio / app: three pillars with short visual copy + confidence.
 * Stored on each daily Horoscope row as JSONB.
 */
export type MoodBoardPillar = {
  headline: string;
  vibes: string[];
  palette: string;
  /** 40–95; synced with row love/wealth/health confidence for the pillar. */
  confidence?: number;
};

export type HoroscopeMoodBoard = {
  love: MoodBoardPillar;
  health: MoodBoardPillar;
  career: MoodBoardPillar;
};

export function clampHoroscopeConfidence(n: unknown): number {
  const raw =
    typeof n === "number" && !Number.isNaN(n)
      ? n
      : typeof n === "string"
        ? parseInt(String(n).trim(), 10)
        : NaN;
  if (Number.isNaN(raw)) return 72;
  return Math.min(95, Math.max(40, Math.round(raw)));
}

export function defaultMoodBoard(): HoroscopeMoodBoard {
  return {
    love: {
      headline: "Heart-forward",
      vibes: ["Warm", "Honest", "Present"],
      palette: "#FB7185",
      confidence: 72,
    },
    health: {
      headline: "Steady body",
      vibes: ["Rhythm", "Rest", "Fuel"],
      palette: "#38BDF8",
      confidence: 72,
    },
    career: {
      headline: "Focused drive",
      vibes: ["Clear", "Bold", "Practical"],
      palette: "#4ADE80",
      confidence: 72,
    },
  };
}

export function mergeMoodBoardWithResolvedConfidences(
  mb: HoroscopeMoodBoard,
  love: number,
  wealth: number,
  health: number,
): HoroscopeMoodBoard {
  return {
    love: { ...mb.love, confidence: mb.love.confidence ?? love },
    health: { ...mb.health, confidence: mb.health.confidence ?? health },
    career: { ...mb.career, confidence: mb.career.confidence ?? wealth },
  };
}

function normalizeMoodBoardRoot(raw: unknown): Record<string, unknown> | null {
  if (raw == null) return null;
  let obj: unknown = raw;
  if (typeof Buffer !== "undefined" && Buffer.isBuffer(obj)) {
    try {
      obj = JSON.parse(obj.toString("utf8")) as unknown;
    } catch {
      return null;
    }
  } else if (typeof raw === "string") {
    try {
      obj = JSON.parse(raw) as unknown;
    } catch {
      return null;
    }
  }
  if (typeof obj !== "object" || obj === null) return null;
  const o = obj as Record<string, unknown>;
  const inner = o.moodBoard ?? o.mood_board;
  if (
    inner &&
    typeof inner === "object" &&
    !Array.isArray(inner) &&
    (getChild(inner as Record<string, unknown>, "love") != null ||
      getChild(inner as Record<string, unknown>, "health") != null ||
      getChild(inner as Record<string, unknown>, "career") != null ||
      getChild(inner as Record<string, unknown>, "wealth") != null)
  ) {
    return inner as Record<string, unknown>;
  }
  return o;
}

function getChild(o: Record<string, unknown>, ...names: string[]): unknown {
  for (const name of names) {
    if (Object.prototype.hasOwnProperty.call(o, name)) return o[name];
    const hit = Object.keys(o).find((k) => k.toLowerCase() === name.toLowerCase());
    if (hit) return o[hit];
  }
  return undefined;
}

function normalizeHexColor(input: string): string | null {
  let s = input.trim();
  if (/^[0-9A-Fa-f]{6}$/.test(s)) s = `#${s}`;
  if (/^[0-9A-Fa-f]{3}$/.test(s)) s = `#${s}`;
  if (/^#[0-9A-Fa-f]{3,8}$/.test(s)) return s;
  return null;
}

function parsePillarBlock(pRaw: unknown): MoodBoardPillar | null {
  if (typeof pRaw !== "object" || pRaw === null) return null;
  const r = pRaw as Record<string, unknown>;
  const headline =
    (typeof r.headline === "string" ? r.headline.trim() : "") ||
    (typeof r.title === "string" ? r.title.trim() : "") ||
    (typeof r.tagline === "string" ? r.tagline.trim() : "") ||
    (typeof r.label === "string" ? r.label.trim() : "");
  let palette = "#94a3b8";
  for (const c of [r.palette, r.color, r.hex, r.accent]) {
    if (typeof c !== "string") continue;
    const hex = normalizeHexColor(c);
    if (hex) {
      palette = hex;
      break;
    }
  }
  let vibes: string[] = [];
  const vibesRaw = r.vibes;
  if (Array.isArray(vibesRaw)) {
    vibes = vibesRaw
      .map((v) => (typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : ""))
      .filter(Boolean)
      .slice(0, 6);
  } else if (typeof vibesRaw === "string") {
    vibes = vibesRaw
      .split(/[,|/]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 6);
  }
  if (!headline) return null;
  if (vibes.length === 0) vibes = ["Present", "Steady", "Open"];
  const confRaw = r.confidence ?? r.percentage ?? r.percent ?? r.score;
  const confidence =
    confRaw !== undefined && confRaw !== null ? clampHoroscopeConfidence(confRaw) : undefined;
  return { headline, vibes, palette, ...(confidence !== undefined ? { confidence } : {}) };
}

export function parseMoodBoard(raw: unknown): HoroscopeMoodBoard | null {
  const o = normalizeMoodBoardRoot(raw);
  if (!o) return null;
  const love = parsePillarBlock(getChild(o, "love"));
  const health = parsePillarBlock(getChild(o, "health"));
  const career = parsePillarBlock(getChild(o, "career", "wealth", "work", "money"));
  if (!love || !health || !career) return null;
  return { love, health, career };
}

export function parseMoodBoardLenient(raw: unknown): HoroscopeMoodBoard | null {
  const strict = parseMoodBoard(raw);
  if (strict) return strict;
  const o = normalizeMoodBoardRoot(raw);
  if (!o) return null;
  const d = defaultMoodBoard();
  const love = parsePillarBlock(getChild(o, "love"));
  const health = parsePillarBlock(getChild(o, "health"));
  const career = parsePillarBlock(getChild(o, "career", "wealth", "work", "money"));
  if (!love && !health && !career) return null;
  return {
    love: love ?? d.love,
    health: health ?? d.health,
    career: career ?? d.career,
  };
}

function rowKeyNormalized(k: string): string {
  return k.replace(/"/g, "").replace(/_/g, "").toLowerCase();
}

export function rawMoodBoardFromRow(row: Record<string, unknown>): unknown {
  if (row.moodBoard != null) return row.moodBoard;
  if (row.moodboard != null) return row.moodboard;
  const key = Object.keys(row).find((k) => rowKeyNormalized(k) === "moodboard");
  return key ? row[key] : undefined;
}
