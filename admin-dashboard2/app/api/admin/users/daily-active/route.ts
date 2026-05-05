import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { getDailyActiveUsersReport } from "@/lib/admin-users.service";
import { handleApiError } from "@/lib/api-error";

function parseUtcDateParam(s: string | null): Date {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    return new Date();
  }
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export async function GET(request: NextRequest) {
  try {
    await getAdminFromRequest();
    const { searchParams } = new URL(request.url);
    // Treat this date param as a *Nepal calendar date* (YYYY-MM-DD).
    // We keep it as a Date at UTC midnight only as a carrier for y-m-d.
    const date = parseUtcDateParam(searchParams.get("date"));
    const page = parseInt(searchParams.get("page") ?? "1", 10) || 1;
    const pageSize = parseInt(searchParams.get("pageSize") ?? "25", 10) || 25;
    const data = await getDailyActiveUsersReport({ date, page, pageSize });
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const { status, message } = handleApiError(err);
    return NextResponse.json(
      { success: false, error: { message } },
      { status }
    );
  }
}
