import { NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { getNotificationSettingsSnapshot } from "@/lib/push-notification.service";
import { handleApiError } from "@/lib/api-error";

export async function GET() {
  try {
    await getAdminFromRequest();
    const state = await getNotificationSettingsSnapshot();
    return NextResponse.json({ success: true, data: state });
  } catch (err) {
    const { status, message } = handleApiError(err);
    return NextResponse.json(
      { success: false, error: { message } },
      { status },
    );
  }
}
