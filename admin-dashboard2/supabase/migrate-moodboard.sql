-- Add mood board JSON for portfolio / app glance UI (Love / Career / Health pillars).
ALTER TABLE "Horoscope" ADD COLUMN IF NOT EXISTS "moodBoard" JSONB;
