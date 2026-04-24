import { NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { sendHoroscopePillarNotifications } from "@/lib/push-notification.service";
import { handleApiError } from "@/lib/api-error";

export async function POST() {
  try {
    await getAdminFromRequest();
    const result = await sendHoroscopePillarNotifications();
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    const { status, message } = handleApiError(err);
    return NextResponse.json(
      { success: false, error: { message } },
      { status },
    );
  }
}
