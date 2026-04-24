import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import { handleApiError } from "@/lib/api-error";

// Public endpoint (no auth) — stores Expo push tokens for every device, even
// those that haven't signed in. Motivational broadcasts read from this table.
// If a Firebase UID is provided (signed-in user) we attach it so the token
// can also be linked to a User row for pillar notifications.
const schema = z.object({
  expoPushToken: z.string().min(1),
  platform: z.string().min(1),
  firebaseUid: z.string().min(1).optional().nullable(),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    await query(
      `INSERT INTO "PushDevice" ("expoPushToken", platform, "firebaseUid")
       VALUES ($1, $2, $3)
       ON CONFLICT ("expoPushToken") DO UPDATE
         SET platform = EXCLUDED.platform,
             "firebaseUid" = COALESCE(EXCLUDED."firebaseUid", "PushDevice"."firebaseUid"),
             "updatedAt" = now()`,
      [body.expoPushToken, body.platform, body.firebaseUid ?? null],
    );

    // If the app is registering this token while logged out, ensure we are not
    // still targeting this device for pillar pushes via a stale User.expoPushToken.
    // Motivational broadcasts are device-level (PushDevice) and should still work.
    if (!body.firebaseUid) {
      await query(
        `UPDATE "User"
         SET "expoPushToken" = NULL,
             "expoPushPlatform" = NULL,
             "expoPushUpdatedAt" = NULL,
             "updatedAt" = now()
         WHERE "expoPushToken" = $1`,
        [body.expoPushToken],
      );
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    const { status, message } = handleApiError(err);
    return NextResponse.json(
      { success: false, error: { message } },
      { status },
    );
  }
}
