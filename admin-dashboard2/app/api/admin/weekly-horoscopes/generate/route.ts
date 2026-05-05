import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { generateWeeklyHoroscopeForSign } from "@/lib/weekly-horoscope.service";
import type { ZodiacSign } from "@/lib/types";
import { handleApiError } from "@/lib/api-error";
import { utcMondayWeekStartContaining } from "@/lib/week-utc";
import type { HoroscopeTone } from "@/lib/weekly-generator";

const ZODIAC_SIGNS: ZodiacSign[] = [
  "ARIES", "TAURUS", "GEMINI", "CANCER", "LEO", "VIRGO",
  "LIBRA", "SCORPIO", "SAGITTARIUS", "CAPRICORN", "AQUARIUS", "PISCES",
];

function parseWeekStartAtUtcNoon(input: unknown): Date {
  if (typeof input !== "string" || !input.trim()) {
    return utcMondayWeekStartContaining(new Date());
  }
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.trim());
  if (m) {
    const year = Number(m[1]);
    const month = Number(m[2]);
    const day = Number(m[3]);
    const picked = new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));
    return utcMondayWeekStartContaining(picked);
  }
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) {
    return utcMondayWeekStartContaining(new Date());
  }
  return utcMondayWeekStartContaining(d);
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
    const weekStartDate = parseWeekStartAtUtcNoon(body.weekStartDate);
    const tone = (body.tone as HoroscopeTone) ?? "premium";
    const notes = body.notes as string | undefined;
    const targetZodiacs = allZodiacs || !zodiacSign ? ZODIAC_SIGNS : [zodiacSign];
    const generated: unknown[] = [];
    for (const z of targetZodiacs) {
      const row = await generateWeeklyHoroscopeForSign({
        zodiacSign: z,
        weekStartDate,
        tone,
        notes,
      });
      generated.push(row);
      if (targetZodiacs.length > 1) {
        await new Promise((r) => setTimeout(r, 800));
      }
    }
    return NextResponse.json({ success: true, data: generated });
  } catch (err) {
    const { status, message } = handleApiError(err);
    return NextResponse.json(
      { success: false, error: { message } },
      { status },
    );
  }
}
