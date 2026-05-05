import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminFromRequest } from "@/lib/auth";
import {
  getWeeklyHoroscopeById,
  updateWeeklyHoroscope,
  deleteWeeklyHoroscope,
} from "@/lib/weekly-horoscope.service";
import { handleApiError } from "@/lib/api-error";

const patchSchema = z.object({
  title: z.string().optional(),
  outlookText: z.string().optional(),
  isPublished: z.boolean().optional(),
}).partial();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await getAdminFromRequest();
    const { id } = await params;
    const row = await getWeeklyHoroscopeById(id);
    if (!row) {
      return NextResponse.json(
        { success: false, error: { message: "Weekly horoscope not found." } },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: row });
  } catch (err) {
    const { status, message } = handleApiError(err);
    return NextResponse.json(
      { success: false, error: { message } },
      { status },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await getAdminFromRequest();
    const { id } = await params;
    const body = await request.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid payload." } },
        { status: 400 },
      );
    }
    const updated = await updateWeeklyHoroscope(id, parsed.data);
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    const { status, message } = handleApiError(err);
    return NextResponse.json(
      { success: false, error: { message } },
      { status },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await getAdminFromRequest();
    const { id } = await params;
    await deleteWeeklyHoroscope(id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    const { status, message } = handleApiError(err);
    return NextResponse.json(
      { success: false, error: { message } },
      { status },
    );
  }
}
