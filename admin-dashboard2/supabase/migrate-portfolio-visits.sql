-- Portfolio visits (anonymous, no login). Buckets are based on Nepal local day.
-- Run this migration in Supabase SQL editor.

CREATE TABLE IF NOT EXISTS "PortfolioVisit" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "nepalDay" DATE NOT NULL,
  "ipHash" TEXT NOT NULL,
  path TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Dedupe: unique visitor (IP hash) per Nepal calendar day.
CREATE UNIQUE INDEX IF NOT EXISTS "PortfolioVisit_nepalDay_ipHash_uq"
  ON "PortfolioVisit" ("nepalDay", "ipHash");

CREATE INDEX IF NOT EXISTS "PortfolioVisit_nepalDay_idx"
  ON "PortfolioVisit" ("nepalDay");

