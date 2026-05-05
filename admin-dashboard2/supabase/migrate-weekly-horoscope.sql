-- One weekly outlook per zodiac per ISO week (week starts Monday UTC, stored as DATE).
CREATE TABLE IF NOT EXISTS "WeeklyHoroscope" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "zodiacSign" TEXT NOT NULL CHECK ("zodiacSign" IN (
    'ARIES','TAURUS','GEMINI','CANCER','LEO','VIRGO',
    'LIBRA','SCORPIO','SAGITTARIUS','CAPRICORN','AQUARIUS','PISCES'
  )),
  "weekStartDate" DATE NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  "outlookText" TEXT NOT NULL,
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE ("zodiacSign", "weekStartDate")
);

CREATE INDEX IF NOT EXISTS "WeeklyHoroscope_weekStart_idx" ON "WeeklyHoroscope" ("weekStartDate");
CREATE INDEX IF NOT EXISTS "WeeklyHoroscope_zodiac_week_idx" ON "WeeklyHoroscope" ("zodiacSign", "weekStartDate");
