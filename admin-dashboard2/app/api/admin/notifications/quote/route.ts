import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminFromRequest } from "@/lib/auth";
import { sendMotivationalQuoteNotifications } from "@/lib/push-notification.service";
import { handleApiError } from "@/lib/api-error";

const schema = z.object({
  quoteId: z.string().uuid().optional(),
});

export async function POST(request: Request) {
  try {
    await getAdminFromRequest();
    const json = await request.json().catch(() => ({}));
    const body = schema.parse(json);
    const result = await sendMotivationalQuoteNotifications({
      quoteId: body.quoteId,
    });
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    const { status, message } = handleApiError(err);
    return NextResponse.json(
      { success: false, error: { message } },
      { status },
    );
  }
}
