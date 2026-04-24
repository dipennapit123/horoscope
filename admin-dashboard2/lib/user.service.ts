import { randomUUID } from "crypto";
import { query } from "./db";
import type { ZodiacSign, UserActivityAction } from "./types";

export async function syncFirebaseUser(params: {
  firebaseUid: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  timezone?: string;
}) {
  const avatarUrl =
    params.avatarUrl && params.avatarUrl.startsWith("http")
      ? params.avatarUrl
      : null;
  const fullName = params.fullName?.trim() || null;
  const r = await query<{ id: string }>(
    `SELECT id FROM "User" WHERE "firebaseUid" = $1`,
    [params.firebaseUid],
  );
  const existing = r.rows[0];
  const now = new Date().toISOString();

  if (existing) {
    await query(
      `UPDATE "User" SET email = $1, "fullName" = $2, "avatarUrl" = $3, timezone = $4, "updatedAt" = $5
       WHERE "firebaseUid" = $6`,
      [
        params.email,
        fullName,
        avatarUrl,
        params.timezone ?? null,
        now,
        params.firebaseUid,
      ],
    );
    const u = await query(
      `SELECT id, "firebaseUid", email, "fullName", "avatarUrl", "zodiacSign", timezone, "lastActiveAt", "createdAt", "updatedAt"
       FROM "User" WHERE "firebaseUid" = $1`,
      [params.firebaseUid],
    );
    return u.rows[0] as Record<string, unknown>;
  }

  const id = randomUUID();
  await query(
    `INSERT INTO "User" (id, "firebaseUid", email, "fullName", "avatarUrl", timezone, "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $7)`,
    [
      id,
      params.firebaseUid,
      params.email,
      fullName,
      avatarUrl,
      params.timezone ?? null,
      now,
    ],
  );
  const u = await query(
    `SELECT id, "firebaseUid", email, "fullName", "avatarUrl", "zodiacSign", timezone, "lastActiveAt", "createdAt", "updatedAt"
     FROM "User" WHERE id = $1`,
    [id],
  );
  return u.rows[0] as Record<string, unknown>;
}

export async function getCurrentUser(firebaseUid: string) {
  const r = await query(
    `SELECT id, "firebaseUid", email, "fullName", "avatarUrl", "zodiacSign", timezone, "lastActiveAt", "createdAt", "updatedAt"
     FROM "User" WHERE "firebaseUid" = $1`,
    [firebaseUid],
  );
  return r.rows[0] ?? null;
}

/** Clears the token on User so pillar/horoscope pushes stop after logout. PushDevice is unchanged for motivational broadcasts. */
export async function clearUserExpoPushToken(firebaseUid: string) {
  const now = new Date().toISOString();
  await query(
    `UPDATE "User" SET "expoPushToken" = NULL, "expoPushPlatform" = NULL, "expoPushUpdatedAt" = NULL, "updatedAt" = $1 WHERE "firebaseUid" = $2`,
    [now, firebaseUid],
  );
}

export async function updateUserExpoPushToken(
  firebaseUid: string,
  expoPushToken: string,
  platform: string,
) {
  const now = new Date().toISOString();
  const updated = await query(
    `UPDATE "User" SET "expoPushToken" = $1, "expoPushPlatform" = $2, "expoPushUpdatedAt" = $3, "updatedAt" = $3
     WHERE "firebaseUid" = $4`,
    [expoPushToken, platform, now, firebaseUid],
  );
  if (updated.rowCount > 0) return;

  // Push registration can run before /users/sync-firebase-user; plain UPDATE would affect 0 rows silently.
  const id = randomUUID();
  await query(
    `INSERT INTO "User" (id, "firebaseUid", email, "expoPushToken", "expoPushPlatform", "expoPushUpdatedAt", "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, $6, $6, $6)`,
    [
      id,
      firebaseUid,
      `${firebaseUid}@astradaily.local`,
      expoPushToken,
      platform,
      now,
    ],
  );
}

export async function updateUserZodiac(
  firebaseUid: string,
  zodiac: ZodiacSign,
) {
  const r = await query(
    `UPDATE "User" SET "zodiacSign" = $1, "updatedAt" = $2 WHERE "firebaseUid" = $3
     RETURNING id, "firebaseUid", email, "fullName", "avatarUrl", "zodiacSign", timezone, "lastActiveAt", "createdAt", "updatedAt"`,
    [zodiac, new Date().toISOString(), firebaseUid],
  );
  if (r.rows.length > 0) return r.rows[0] as Record<string, unknown>;

  const id = randomUUID();
  const now = new Date().toISOString();
  await query(
    `INSERT INTO "User" (id, "firebaseUid", email, "zodiacSign", "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, $5)`,
    [id, firebaseUid, `${firebaseUid}@astradaily.local`, zodiac, now],
  );
  const u = await query(
    `SELECT id, "firebaseUid", email, "fullName", "avatarUrl", "zodiacSign", timezone, "lastActiveAt", "createdAt", "updatedAt"
     FROM "User" WHERE id = $1`,
    [id],
  );
  return u.rows[0] as Record<string, unknown>;
}

const DEDUPE_WINDOW_MS = 5 * 60 * 1000;

export async function recordActivity(
  firebaseUid: string,
  action: UserActivityAction,
  meta?: {
    sessionId?: string;
    timezone?: string;
    platform?: string;
    appVersion?: string;
  },
) {
  const userResult = await query(
    `SELECT id FROM "User" WHERE "firebaseUid" = $1`,
    [firebaseUid],
  );
  const user = userResult.rows[0] as { id: string } | undefined;
  if (!user) return null;

  const now = new Date();
  const since = new Date(now.getTime() - DEDUPE_WINDOW_MS);

  const recentResult = await query(
    `SELECT id, "userId", action, "sessionId", platform, "appVersion", "createdAt"
     FROM "UserActivity"
     WHERE "userId" = $1 AND action = $2 AND "createdAt" >= $3
     ORDER BY "createdAt" DESC LIMIT 1`,
    [user.id, action, since.toISOString()],
  );
  const recentSame = recentResult.rows[0];
  if (recentSame) {
    await query(
      `UPDATE "User" SET "lastActiveAt" = $1, "updatedAt" = $1 WHERE id = $2`,
      [now.toISOString(), user.id],
    );
    return recentSame as Record<string, unknown>;
  }

  const activityId = randomUUID();
  await query(
    `INSERT INTO "UserActivity" (id, "userId", action, "sessionId", platform, "appVersion")
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      activityId,
      user.id,
      action,
      meta?.sessionId ?? null,
      meta?.platform ?? null,
      meta?.appVersion ?? null,
    ],
  );
  if (meta?.timezone) {
    await query(
      `UPDATE "User" SET "lastActiveAt" = $1, "updatedAt" = $1, timezone = $3 WHERE id = $2`,
      [now.toISOString(), user.id, meta.timezone],
    );
  } else {
    await query(
      `UPDATE "User" SET "lastActiveAt" = $1, "updatedAt" = $1 WHERE id = $2`,
      [now.toISOString(), user.id],
    );
  }

  const created = await query(
    `SELECT id, "userId", action, "sessionId", platform, "appVersion", "createdAt"
     FROM "UserActivity" WHERE id = $1`,
    [activityId],
  );
  return created.rows[0] as Record<string, unknown>;
}
