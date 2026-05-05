import { NextRequest, NextResponse } from "next/server";
import { zodiacSignFromSlug } from "@/lib/zodiac-slug";
import { getPublishedHoroscopeByZodiacUtcDay } from "@/lib/public-horoscope.service";
import { horoscopeToPublicJson } from "@/lib/public-horoscope-json";
import type { ZodiacSign } from "@/lib/types";

function utcNoonForDayOffset(offsetDays: number): Date {
  const now = new Date();
  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + offsetDays,
      12,
      0,
      0,
      0,
    ),
  );
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const signSlug = request.nextUrl.searchParams.get("sign") ?? "";
  const zodiac = zodiacSignFromSlug(signSlug);
  if (!zodiac) {
    return NextResponse.json(
      { success: false, error: { message: "Invalid sign." } },
      { status: 400 },
    );
  }

  const modes = ["yesterday", "today", "tomorrow"] as const;
  const payload: Record<string, ReturnType<typeof horoscopeToPublicJson> | null> = {};

  for (const mode of modes) {
    const offset = mode === "yesterday" ? -1 : mode === "tomorrow" ? 1 : 0;
    const day = utcNoonForDayOffset(offset);
    const row = await getPublishedHoroscopeByZodiacUtcDay(zodiac as ZodiacSign, day);
    payload[mode] = row ? horoscopeToPublicJson(row) : null;
  }

  return NextResponse.json({ success: true, data: payload });
}
