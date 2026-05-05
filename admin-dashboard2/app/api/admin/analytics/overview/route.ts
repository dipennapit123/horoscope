import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { getAnalyticsOverview } from "@/lib/admin-analytics.service";
import { handleApiError } from "@/lib/api-error";

export async function GET(request: NextRequest) {
  try {
    await getAdminFromRequest();
    const daysParam = request.nextUrl.searchParams.get("days") ?? "";
    const days = daysParam ? parseInt(daysParam, 10) : undefined;
    const data = await getAnalyticsOverview({
      days: Number.isFinite(days) ? days : undefined,
    });
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const { status, message } = handleApiError(err);
    return NextResponse.json(
      { success: false, error: { message } },
      { status }
    );
  }
}

