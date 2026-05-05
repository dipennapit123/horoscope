import type { ZodiacSign } from "./types";
import { env } from "./env";
import { ZODIAC_SIGNS } from "./types";

export type HoroscopeTone = "mystical" | "modern" | "friendly" | "premium";

export interface GenerateWeeklyInput {
  zodiacSign: ZodiacSign;
  weekStartDate: Date;
  tone: HoroscopeTone;
  notes?: string;
}

export interface GeneratedWeeklyContent {
  title: string;
  outlookText: string;
}

const signFlavors: Record<string, string> = {
  ARIES: "bold, direct fire-sign energy.",
  TAURUS: "steady, values-first earth energy.",
  GEMINI: "curious, communicative air energy.",
  CANCER: "protective, intuitive water energy.",
  LEO: "warm, expressive fire energy.",
  VIRGO: "refined, practical earth energy.",
  LIBRA: "relational, balance-seeking air energy.",
  SCORPIO: "deep, all-in water energy.",
  SAGITTARIUS: "expansive, honest fire energy.",
  CAPRICORN: "structured, long-game earth energy.",
  AQUARIUS: "independent, future-minded air energy.",
  PISCES: "fluid, empathetic water energy.",
};

const GROQ_MODEL = "llama-3.1-8b-instant";

function weekRangeLabel(weekStart: Date): string {
  const start = new Date(weekStart);
  const end = new Date(
    Date.UTC(
      start.getUTCFullYear(),
      start.getUTCMonth(),
      start.getUTCDate() + 6,
      12,
      0,
      0,
      0,
    ),
  );
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  return `${fmt(start)} – ${fmt(end)}, ${start.getUTCFullYear()} (UTC)`;
}

async function groqWeekly(input: GenerateWeeklyInput): Promise<GeneratedWeeklyContent> {
  const { default: axios } = await import("axios");
  const flavor =
    signFlavors[input.zodiacSign] ?? "classic sign strengths and tensions in a grounded way.";
  const weekLabel = weekRangeLabel(input.weekStartDate);

  const system = [
    "You are an expert astrology copywriter for AstraDaily.",
    "Write ONE weekly overview for the sign, not day-by-day.",
    "Simple, warm English. No em dashes or en dashes. No hype clichés.",
    "Return ONLY JSON: { \"title\": \"...\", \"outlookText\": \"...\" }.",
    "title: 2-5 words. outlookText: 4-7 sentences covering love, work/money, and vitality themes for the week.",
  ].join(" ");

  const user = [
    `Zodiac: ${input.zodiacSign}. ${flavor}`,
    `Tone: ${input.tone}.`,
    `Week (UTC): ${weekLabel}.`,
    input.notes ? `Notes: ${input.notes}` : "",
    "Weave a coherent weekly story the reader can return to all week.",
  ]
    .filter(Boolean)
    .join("\n");

  const res = await axios.post<{ choices?: Array<{ message?: { content?: string } }> }>(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.9,
      max_tokens: 700,
    },
    {
      headers: { Authorization: `Bearer ${env.groqApiKey}` },
      timeout: 30000,
    },
  );

  const raw = res.data.choices?.[0]?.message?.content ?? "{}";
  let parsed: Record<string, unknown>;
  try {
    const cleaned = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    parsed = JSON.parse(cleaned) as Record<string, unknown>;
  } catch {
    parsed = {};
  }
  const clean = (value: unknown): string | undefined => {
    if (typeof value !== "string") return undefined;
    return value
      .replace(/[—–]/g, ",")
      .replace(/\s{2,}/g, " ")
      .trim();
  };
  return {
    title: clean(parsed.title) ?? "Week ahead",
    outlookText:
      clean(parsed.outlookText) ??
      "This week favors steady pacing. Pick one priority each area, love, work, and body, and repeat small wins instead of big swings.",
  };
}

function mockWeekly(input: GenerateWeeklyInput): GeneratedWeeklyContent {
  const seed =
    input.weekStartDate.getUTCFullYear() * 100 +
    input.weekStartDate.getUTCMonth() * 10 +
    ZODIAC_SIGNS.indexOf(input.zodiacSign);
  return {
    title: seed % 2 === 0 ? "Steady arc" : "Opening moves",
    outlookText: [
      `For ${input.zodiacSign}, this UTC week invites clarity without rushing big decisions.`,
      "In relationships, favor honest check-ins over assumptions.",
      "At work, protect focus blocks and let small completions build trust.",
      "For health, rhythm beats intensity: sleep, hydration, and sunlight matter more than novelty.",
    ].join(" "),
  };
}

export async function generateWeeklyContent(
  input: GenerateWeeklyInput,
): Promise<GeneratedWeeklyContent> {
  if (env.groqApiKey) {
    try {
      return await groqWeekly(input);
    } catch (err) {
      console.warn(
        "[weekly-generator] Groq failed, mock:",
        err instanceof Error ? err.message : err,
      );
    }
  }
  return mockWeekly(input);
}
