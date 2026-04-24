import type { ZodiacSign } from "./types";
import { env } from "./env";
import * as Astronomy from "astronomy-engine";

export type HoroscopeTone = "mystical" | "modern" | "friendly" | "premium";

export interface GenerateHoroscopeInput {
  zodiacSign: ZodiacSign;
  date: Date;
  tone: HoroscopeTone;
  notes?: string;
}

export interface GeneratedHoroscopeContent {
  title: string;
  summary: string;
  wealthText: string;
  loveText: string;
  healthText: string;
  weeklyOutlook?: string;
}

export interface HoroscopeGeneratorService {
  generate(input: GenerateHoroscopeInput): Promise<GeneratedHoroscopeContent>;
}

// Richer sign flavors (match backend) so each zodiac gets distinct, trait-based copy
const signFlavors: Record<string, string> = {
  ARIES: "bold, impulsive, pioneering fire-sign energy that prefers action over hesitation.",
  TAURUS: "steady, sensual, earth-bound energy that values comfort, stability, and tangible results.",
  GEMINI: "curious, quick-thinking, air-sign energy that loves conversation, ideas, and mental variety.",
  CANCER: "intuitive, protective, water-sign energy that prioritizes emotional safety and home.",
  LEO: "radiant, dramatic, heart-led fire-sign energy that wants to be seen and shine authentically.",
  VIRGO: "precise, service-oriented, earth-sign energy that refines details and optimizes routines.",
  LIBRA: "harmonizing, relationship-focused air-sign energy that seeks balance, beauty, and fairness.",
  SCORPIO: "intense, transformative water-sign energy that moves beneath the surface and craves depth.",
  SAGITTARIUS: "expansive, truth-seeking fire-sign energy that craves freedom, travel, and big perspectives.",
  CAPRICORN: "ambitious, disciplined earth-sign energy that patiently builds long-term structures.",
  AQUARIUS: "futuristic, unconventional air-sign energy that innovates and values community.",
  PISCES: "dreamy, empathetic water-sign energy that blurs boundaries between imagination and reality.",
};

const sampleTitles = [
  "Cosmic Alignment", "Stellar Shift", "Lunar Guidance", "Planetary Pulse",
  "Star Path", "Celestial Moment", "Transit Day",
];
const sampleSummaries = [
  "Today stretches like a quiet threshold: subtle choices around timing, pacing, and who you answer first ripple farther than you expect.",
  "The day asks you to zoom out; when you remember the longer story you're trying to live, the small frictions suddenly make more sense.",
  "You're standing at a fork between familiar comfort and aligned discomfort—choosing the latter plants the seeds for real momentum.",
];
const sampleWealth = [
  "Treat your finances like a project, not a problem. Spend twenty focused minutes reviewing recurring costs.",
  "A conversation about value—your rates, your role—can shift the way money flows toward you.",
];
const sampleLove = [
  "Slow down enough to really hear the people you care about.",
  "If tension has been building, name the feeling without blame.",
];
const sampleHealth = [
  "Your nervous system is the real MVP today—nourish it with rhythm.",
  "Notice where your body whispers before it has to shout.",
];

const pick = (arr: string[], seed: number) => arr[seed % arr.length];
const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
};

class MockGenerator implements HoroscopeGeneratorService {
  async generate(input: GenerateHoroscopeInput): Promise<GeneratedHoroscopeContent> {
    const dayKey =
      input.date.getUTCFullYear() * 10000 +
      (input.date.getUTCMonth() + 1) * 100 +
      input.date.getUTCDate();
    const seed = dayKey + hashString(input.zodiacSign) * 17;
    return {
      title: pick(sampleTitles, seed),
      summary: pick(sampleSummaries, seed),
      wealthText: pick(sampleWealth, seed),
      loveText: pick(sampleLove, seed * 7),
      healthText: pick(sampleHealth, seed * 11),
      weeklyOutlook: undefined,
    };
  }
}

const ZODIAC_SIGNS_TROPICAL = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
] as const;

function normalizeToUtcNoon(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12, 0, 0, 0));
}

function norm360(deg: number): number {
  const x = deg % 360;
  return x < 0 ? x + 360 : x;
}

function zodiacFromLongitude(lonDeg: number): { sign: string; degInSign: number; absDeg: number } {
  const absDeg = norm360(lonDeg);
  const idx = Math.floor(absDeg / 30) % 12;
  const degInSign = absDeg - idx * 30;
  return { sign: ZODIAC_SIGNS_TROPICAL[idx] ?? "Aries", degInSign, absDeg };
}

function fmtDeg(n: number): string {
  return `${n.toFixed(1)}°`;
}

function getGeoEclipticLongitude(body: Astronomy.Body, date: Date): number {
  const v = Astronomy.GeoVector(body, date, true);
  const ecl = Astronomy.Ecliptic(v);
  return ecl.elon;
}

function getMoonPhaseLabel(sunLon: number, moonLon: number): string {
  const phase = norm360(moonLon - sunLon); // 0=new, 180=full
  if (phase < 22.5) return "New Moon";
  if (phase < 67.5) return "Waxing Crescent";
  if (phase < 112.5) return "First Quarter";
  if (phase < 157.5) return "Waxing Gibbous";
  if (phase < 202.5) return "Full Moon";
  if (phase < 247.5) return "Waning Gibbous";
  if (phase < 292.5) return "Last Quarter";
  if (phase < 337.5) return "Waning Crescent";
  return "New Moon";
}

type AspectKind = "conjunct" | "sextile" | "square" | "trine" | "opposite";
const ASPECTS: Array<{ kind: AspectKind; angle: number; orb: number }> = [
  { kind: "conjunct", angle: 0, orb: 8 },
  { kind: "sextile", angle: 60, orb: 4 },
  { kind: "square", angle: 90, orb: 6 },
  { kind: "trine", angle: 120, orb: 6 },
  { kind: "opposite", angle: 180, orb: 8 },
];

function angleDistance(a: number, b: number): number {
  const d = Math.abs(norm360(a - b));
  return d > 180 ? 360 - d : d;
}

function computeTopAspects(
  positions: Array<{ name: string; lon: number }>,
  max: number
): Array<{ a: string; kind: AspectKind; b: string; orb: number }> {
  const found: Array<{ a: string; kind: AspectKind; b: string; orb: number }> = [];
  for (let i = 0; i < positions.length; i += 1) {
    for (let j = i + 1; j < positions.length; j += 1) {
      const p1 = positions[i];
      const p2 = positions[j];
      if (!p1 || !p2) continue;
      const d = angleDistance(p1.lon, p2.lon);
      for (const asp of ASPECTS) {
        const orb = Math.abs(d - asp.angle);
        if (orb <= asp.orb) {
          found.push({ a: p1.name, kind: asp.kind, b: p2.name, orb });
          break;
        }
      }
    }
  }
  return found.sort((x, y) => x.orb - y.orb).slice(0, max);
}

// Real ephemeris snapshot for a date (UTC noon): placements + moon phase + major aspects.
function getDailyAstroContext(date: Date, zodiac: string): string {
  const t = normalizeToUtcNoon(date);
  const dateStr = t.toISOString().slice(0, 10);

  const bodies: Array<{ name: string; body: Astronomy.Body }> = [
    { name: "Sun", body: Astronomy.Body.Sun },
    { name: "Moon", body: Astronomy.Body.Moon },
    { name: "Mercury", body: Astronomy.Body.Mercury },
    { name: "Venus", body: Astronomy.Body.Venus },
    { name: "Mars", body: Astronomy.Body.Mars },
    { name: "Jupiter", body: Astronomy.Body.Jupiter },
    { name: "Saturn", body: Astronomy.Body.Saturn },
    { name: "Uranus", body: Astronomy.Body.Uranus },
    { name: "Neptune", body: Astronomy.Body.Neptune },
    { name: "Pluto", body: Astronomy.Body.Pluto },
  ];

  const longitudes = bodies.map(({ name, body }) => ({
    name,
    lon: norm360(getGeoEclipticLongitude(body, t)),
  }));

  const lonByName = new Map(longitudes.map((p) => [p.name, p.lon]));
  const sunLon = lonByName.get("Sun") ?? 0;
  const moonLon = lonByName.get("Moon") ?? 0;
  const moonPhase = getMoonPhaseLabel(sunLon, moonLon);

  const placements = longitudes.map(({ name, lon }) => {
    const z = zodiacFromLongitude(lon);
    return `${name}: ${fmtDeg(z.degInSign)} ${z.sign}`;
  });

  const topAspects = computeTopAspects(
    // aspects with the personal planets are most “felt”
    longitudes.filter((p) => ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"].includes(p.name)),
    4
  ).map((a) => `• ${a.a} ${a.kind} ${a.b} (orb ${fmtDeg(a.orb)})`);

  return [
    `SKY SNAPSHOT for ${zodiac} on ${dateStr} (tropical zodiac; computed at 12:00 UTC):`,
    "",
    `Moon phase: ${moonPhase}.`,
    "",
    "Planet placements:",
    ...placements.map((p) => `- ${p}`),
    "",
    "Major aspects:",
    ...(topAspects.length ? topAspects : ["• No tight major aspects within typical orbs today."]),
    "",
    "Constraints:",
    "- Do NOT mention houses or rising signs (location/time not provided).",
  ].join("\n");
}

function buildMessages(input: GenerateHoroscopeInput): { role: "system" | "user"; content: string }[] {
  const signFlavor =
    signFlavors[input.zodiacSign] ??
    "use the sign's classic strengths and challenges in a grounded way.";
  const astroContext = getDailyAstroContext(input.date, input.zodiacSign);

  const system = {
    role: "system" as const,
    content: [
      "You are an expert astrology copywriter for AstraDaily, a premium mobile horoscope app.",
      "You write personalized daily horoscopes that feel genuinely different each day because you base them on the planetary positions and aspects provided below.",
      "Write in simple, warm, easy-to-read language. Friendly advice, not abstract poetry.",
      "",
      "STRICT RULES:",
      "1. Your horoscope MUST reference the specific planet placements, aspects, and moon phase given in the SKY SNAPSHOT. Do not ignore them.",
      "2. WEALTH advice must connect to the planets affecting finances/career for this sign today (e.g. Jupiter, Saturn, 2nd/10th house).",
      "3. LOVE advice must connect to the planets affecting relationships today (e.g. Venus, Moon, 7th house).",
      "4. HEALTH advice must connect to the planets affecting vitality today (e.g. Mars, Moon phase, 6th house).",
      "5. The title must be a creative 2-4 word phrase that captures THIS day's unique energy—never generic.",
      "6. The summary must mention at least ONE specific planet or aspect from today's sky.",
      "7. weeklyOutlook should tie the day's themes to broader patterns for the week ahead.",
      "8. Each field: 2-3 sentences. Simple English. No filler.",
      "9. Do NOT mention houses or rising signs unless they are explicitly provided in the SKY SNAPSHOT.",
      "",
      "STYLE RULES:",
      "A. Do NOT use em dashes or en dashes (— or –). Use periods or commas instead.",
      "B. Avoid AI-sounding phrases like: 'cosmic alignment', 'the universe wants', 'as the week unfolds', 'dynamic alignment', 'stellar shift'.",
      "C. Use concrete, natural language. Write like a good human editor. No hype.",
    ].join("\n"),
  };

  const user = {
    role: "user" as const,
    content: [
      astroContext,
      "",
      `Zodiac sign: ${input.zodiacSign} – ${signFlavor}`,
      `Tone: ${input.tone}.`,
      input.notes ? `Astrologer's notes: ${input.notes}` : "",
      "",
      "Using the planetary positions and aspects above, write a horoscope that could ONLY apply to this exact sign on this exact date.",
      "If you removed the sign name and date, a reader should still be able to tell it apart from yesterday's or another sign's horoscope because the planetary references and advice are different.",
      "",
      "Return ONLY a JSON object, no markdown, no explanation:",
      '{ "title": "...", "summary": "...", "wealthText": "...", "loveText": "...", "healthText": "...", "weeklyOutlook": "..." }',
    ]
      .filter(Boolean)
      .join("\n"),
  };

  return [system, user];
}

const MAX_RETRIES = 3;
const MAX_RETRY_WAIT_MS = 15000;
// llama-3.1-8b-instant has much higher rate limits on Groq free tier (131k tokens/min vs 6k for 70b)
const GROQ_MODEL = "llama-3.1-8b-instant";

async function groqGenerate(
  input: GenerateHoroscopeInput
): Promise<GeneratedHoroscopeContent> {
  const { default: axios } = await import("axios");
  const messages = buildMessages(input);

  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await axios.post<{ choices?: Array<{ message?: { content?: string } }> }>(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: GROQ_MODEL,
          messages,
          temperature: 0.95,
          top_p: 0.9,
          max_tokens: 700,
        },
        {
          headers: { Authorization: `Bearer ${env.groqApiKey}` },
          timeout: 30000,
        }
      );

      const raw = res.data.choices?.[0]?.message?.content ?? "{}";
      let parsed: Record<string, string>;
      try {
        const cleaned = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
        parsed = JSON.parse(cleaned);
      } catch {
        parsed = {};
      }
      const clean = (value: unknown): string | undefined => {
        if (typeof value !== "string") return undefined;
        return value
          .replace(/[—–]/g, ",")
          .replace(/\s+,/g, ",")
          .replace(/,\s*,+/g, ",")
          .replace(/\s{2,}/g, " ")
          .trim();
      };
      return {
        title: clean(parsed.title) ?? "Daily Focus",
        summary: clean(parsed.summary) ?? "Today is a good day to keep things simple and act on one clear priority.",
        wealthText: clean(parsed.wealthText) ?? "Take one practical step with money or work today. Review a bill, a plan, or a message you have been avoiding.",
        loveText: clean(parsed.loveText) ?? "Be direct and kind. Say what you need and ask one good question instead of guessing.",
        healthText: clean(parsed.healthText) ?? "Choose something you can actually repeat. A walk, water, and an earlier bedtime will do more than a big reset.",
        weeklyOutlook: clean(parsed.weeklyOutlook) ?? "This week rewards steady effort. Small consistent choices add up.",
      };
    } catch (err: unknown) {
      lastError = err;
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 429 && attempt < MAX_RETRIES) {
        const waitMs = Math.min(3000 * Math.pow(2, attempt), MAX_RETRY_WAIT_MS);
        console.warn(`[groq] 429 rate limited, waiting ${waitMs}ms (attempt ${attempt + 1}/${MAX_RETRIES})`);
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

const mockGenerator = new MockGenerator();

export function getGenerator(): HoroscopeGeneratorService {
  if (env.groqApiKey) {
    return {
      async generate(input) {
        try {
          return await groqGenerate(input);
        } catch (err) {
          console.warn("[generator] Groq failed, using mock:", err instanceof Error ? err.message : err);
          return mockGenerator.generate(input);
        }
      },
    };
  }
  return mockGenerator;
}
