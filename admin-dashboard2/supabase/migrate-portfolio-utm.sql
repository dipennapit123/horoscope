-- Extend PortfolioEvent with URL + UTM attribution fields.
-- Safe to run multiple times.

ALTER TABLE "PortfolioEvent" ADD COLUMN IF NOT EXISTS url TEXT;
ALTER TABLE "PortfolioEvent" ADD COLUMN IF NOT EXISTS "utmSource" TEXT;
ALTER TABLE "PortfolioEvent" ADD COLUMN IF NOT EXISTS "utmMedium" TEXT;
ALTER TABLE "PortfolioEvent" ADD COLUMN IF NOT EXISTS "utmCampaign" TEXT;
ALTER TABLE "PortfolioEvent" ADD COLUMN IF NOT EXISTS "utmContent" TEXT;

-- Helpful indexes for dashboard breakdowns
CREATE INDEX IF NOT EXISTS "PortfolioEvent_nepalDay_path_idx"
  ON "PortfolioEvent" ("nepalDay", path);

CREATE INDEX IF NOT EXISTS "PortfolioEvent_nepalMonth_path_idx"
  ON "PortfolioEvent" ("nepalMonth", path);

CREATE INDEX IF NOT EXISTS "PortfolioEvent_nepalDay_utmSource_idx"
  ON "PortfolioEvent" ("nepalDay", "utmSource");

CREATE INDEX IF NOT EXISTS "PortfolioEvent_nepalMonth_utmCampaign_idx"
  ON "PortfolioEvent" ("nepalMonth", "utmCampaign");

