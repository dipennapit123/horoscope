import { NextRequest, NextResponse } from "next/server";
import { zodiacSignFromSlug } from "@/lib/zodiac-slug";
import { getPublishedWeeklyForZodiacWeek } from "@/lib/weekly-horoscope.service";
import type { ZodiacSign } from "@/lib/types";
import { formatUtcDateString } from "@/lib/week-utc";

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
  const now = new Date();
  const row = await getPublishedWeeklyForZodiacWeek(zodiac as ZodiacSign, now);
  if (!row) {
    return NextResponse.json({ success: true, data: null });
  }
  return NextResponse.json({
    success: true,
    data: {
      weekStartDate: formatUtcDateString(row.weekStartDate),
      title: row.title,
      outlookText: row.outlookText,
    },
  });
}
