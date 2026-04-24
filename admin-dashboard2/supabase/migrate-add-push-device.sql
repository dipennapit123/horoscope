-- Adds the "PushDevice" table so motivational notifications can go to devices
-- that have not signed in yet. Safe to run multiple times.
-- Supabase → SQL Editor → New query → paste → Run.

CREATE TABLE IF NOT EXISTS "PushDevice" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "expoPushToken" TEXT NOT NULL UNIQUE,
  platform TEXT,
  "firebaseUid" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "PushDevice_firebaseUid_idx" ON "PushDevice" ("firebaseUid");

-- Backfill: copy every existing token currently stored on User into PushDevice
-- so already signed-in devices don't have to wait for the next app open.
INSERT INTO "PushDevice" ("expoPushToken", platform, "firebaseUid")
SELECT "expoPushToken", "expoPushPlatform", "firebaseUid"
FROM "User"
WHERE "expoPushToken" IS NOT NULL
ON CONFLICT ("expoPushToken") DO UPDATE
  SET platform = EXCLUDED.platform,
      "firebaseUid" = EXCLUDED."firebaseUid",
      "updatedAt" = now();
