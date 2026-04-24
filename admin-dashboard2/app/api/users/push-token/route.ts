import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserIdFromRequest } from "@/lib/user-auth";
import {
  clearUserExpoPushToken,
  updateUserExpoPushToken,
} from "@/lib/user.service";
import { handleApiError } from "@/lib/api-error";

const schema = z.object({
  expoPushToken: z.string().min(1),
  platform: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const firebaseUid = await getUserIdFromRequest();
    const body = schema.parse(await request.json());
    await updateUserExpoPushToken(
      firebaseUid,
      body.expoPushToken,
      body.platform,
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    const { status, message } = handleApiError(err);
    return NextResponse.json(
      { success: false, error: { message } },
      { status },
    );
  }
}

/** Call on logout so pillar pushes no longer target this account (motivational still uses PushDevice). */
export async function DELETE() {
  try {
    const firebaseUid = await getUserIdFromRequest();
    await clearUserExpoPushToken(firebaseUid);
    return NextResponse.json({ success: true });
  } catch (err) {
    const { status, message } = handleApiError(err);
    return NextResponse.json(
      { success: false, error: { message } },
      { status },
    );
  }
}
