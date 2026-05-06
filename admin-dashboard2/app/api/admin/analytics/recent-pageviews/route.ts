import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { getRecentPortfolioPageviews } from "@/lib/admin-analytics.service";
import { handleApiError } from "@/lib/api-error";

export async function GET(request: NextRequest) {
  try {
    await getAdminFromRequest();
    const limitParam = request.nextUrl.searchParams.get("limit") ?? "";
    const cursor = request.nextUrl.searchParams.get("cursor") ?? undefined;
    const limitRaw = limitParam ? parseInt(limitParam, 10) : 50;
    const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 200) : 50;

    const data = await getRecentPortfolioPageviews({ limit, cursor });
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const { status, message } = handleApiError(err);
    return NextResponse.json({ success: false, error: { message } }, { status });
  }
}

