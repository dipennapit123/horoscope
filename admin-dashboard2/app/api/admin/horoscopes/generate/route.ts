import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import {
  generateHoroscopeContent,
  createHoroscope,
} from "@/lib/admin-horoscope.service";
import type { ZodiacSign } from "@/lib/types";
import { handleApiError } from "@/lib/api-error";

const ZODIAC_SIGNS: ZodiacSign[] = [
  "ARIES", "TAURUS", "GEMINI", "CANCER", "LEO", "VIRGO",
  "LIBRA", "SCORPIO", "SAGITTARIUS", "CAPRICORN", "AQUARIUS", "PISCES",
];

function parseDateAtUtcNoon(input: unknown): Date {
  if (typeof input !== "string" || !input.trim()) {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 12, 0, 0, 0));
  }

  // Common UI format from <input type="date"> is YYYY-MM-DD.
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.trim());
  if (m) {
    const year = Number(m[1]);
    const month = Number(m[2]);
    const day = Number(m[3]);
    return new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));
  }

  // Fallback: parse full ISO string; still normalize to UTC noon of that parsed day.
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 12, 0, 0, 0));
  }
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 12, 0, 0, 0));
}

export async function POST(request: NextRequest) {
  try {
    await getAdminFromRequest();
    const body = await request.json().catch(() => ({}));
    const zodiacSign = body.zodiacSign as ZodiacSign | undefined;
    const allZodiacsRaw = body.allZodiacs;
    const allZodiacs =
      typeof allZodiacsRaw === "boolean"
        ? allZodiacsRaw
        : allZodiacsRaw === "true" || allZodiacsRaw === "on";
    const date = parseDateAtUtcNoon(body.date);
    const tone = (body.tone as "mystical" | "modern" | "friendly" | "premium") ?? "premium";
    const notes = body.notes as string | undefined;
    const targetZodiacs = allZodiacs || !zodiacSign ? ZODIAC_SIGNS : [zodiacSign];
    const generated: Array<{ zodiacSign: ZodiacSign; [key: string]: unknown }> = [];
    for (const z of targetZodiacs) {
      const content = await generateHoroscopeContent({
        zodiacSign: z,
        date,
        tone,
        notes,
      });
      const created = await createHoroscope({
        zodiacSign: z,
        date,
        title: content.title,
        summary: content.summary,
        wealthText: content.wealthText,
        loveText: content.loveText,
        healthText: content.healthText,
        wealthConfidence: content.wealthConfidence,
        loveConfidence: content.loveConfidence,
        healthConfidence: content.healthConfidence,
        weeklyOutlook: null,
        moodBoard: content.moodBoard,
        isPublished: false,
      });
      generated.push({ ...created, zodiacSign: z });
      if (targetZodiacs.length > 1) {
        await new Promise((r) => setTimeout(r, 800));
      }
    }
    return NextResponse.json({ success: true, data: generated });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    const errCode = (err as NodeJS.ErrnoException)?.code;
    console.error("[generate] Error:", errMsg, errCode ?? "");
    const { status, message } = handleApiError(err);
    return NextResponse.json(
      { success: false, error: { message } },
      { status }
    );
  }
}
