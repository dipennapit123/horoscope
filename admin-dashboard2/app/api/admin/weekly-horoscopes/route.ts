import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { listWeeklyHoroscopes } from "@/lib/weekly-horoscope.service";
import type { ZodiacSign } from "@/lib/types";
import { handleApiError } from "@/lib/api-error";

export async function GET(request: NextRequest) {
  try {
    await getAdminFromRequest();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10) || 1;
    const zodiac = searchParams.get("zodiacSign") as ZodiacSign | null;
    const data = await listWeeklyHoroscopes({
      zodiacSign: zodiac ?? undefined,
      page,
      pageSize: 24,
    });
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const { status, message } = handleApiError(err);
    return NextResponse.json(
      { success: false, error: { message } },
      { status },
    );
  }
}
