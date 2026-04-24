-- One-time migration: legacy "User"."clerkUserId" → "User"."firebaseUid"
-- Run in Supabase: SQL Editor → New query → paste → Run
-- Safe to run multiple times (no-op if already migrated).

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'User' AND column_name = 'clerkUserId'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'User' AND column_name = 'firebaseUid'
  ) THEN
    ALTER TABLE public."User" RENAME COLUMN "clerkUserId" TO "firebaseUid";
  END IF;
END $$;

DROP INDEX IF EXISTS "User_clerkUserId_idx";

CREATE INDEX IF NOT EXISTS "User_firebaseUid_idx" ON public."User" ("firebaseUid");
