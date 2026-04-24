import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminFromRequest } from "@/lib/auth";
import {
  listMotivationalQuotes,
  createMotivationalQuote,
} from "@/lib/motivational-quote.service";
import { handleApiError } from "@/lib/api-error";

const createSchema = z.object({
  body: z.string().min(1),
  isActive: z.boolean().optional(),
});

export async function GET() {
  try {
    await getAdminFromRequest();
    const rows = await listMotivationalQuotes();
    return NextResponse.json({ success: true, data: rows });
  } catch (err) {
    const { status, message } = handleApiError(err);
    return NextResponse.json(
      { success: false, error: { message } },
      { status },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await getAdminFromRequest();
    const body = createSchema.parse(await request.json());
    const row = await createMotivationalQuote(body.body, body.isActive ?? true);
    return NextResponse.json({ success: true, data: row });
  } catch (err) {
    const { status, message } = handleApiError(err);
    return NextResponse.json(
      { success: false, error: { message } },
      { status },
    );
  }
}
