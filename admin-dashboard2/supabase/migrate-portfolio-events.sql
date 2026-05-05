-- Portfolio analytics events (anonymous, no login).
-- This powers per-day + per-month unique visitors and total traffic in Nepal time.

CREATE TABLE IF NOT EXISTS "PortfolioEvent" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "visitorId" TEXT NOT NULL,
  "sessionId" TEXT NOT NULL,
  "eventName" TEXT NOT NULL,
  path TEXT,
  referrer TEXT,
  "userAgent" TEXT,
  "nepalDay" DATE NOT NULL,
  "nepalMonth" DATE NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fast daily unique visitors + traffic
CREATE INDEX IF NOT EXISTS "PortfolioEvent_nepalDay_idx" ON "PortfolioEvent" ("nepalDay");
CREATE INDEX IF NOT EXISTS "PortfolioEvent_nepalDay_event_idx" ON "PortfolioEvent" ("nepalDay", "eventName");
CREATE INDEX IF NOT EXISTS "PortfolioEvent_nepalDay_visitor_idx" ON "PortfolioEvent" ("nepalDay", "visitorId");

-- Fast monthly unique visitors + traffic
CREATE INDEX IF NOT EXISTS "PortfolioEvent_nepalMonth_idx" ON "PortfolioEvent" ("nepalMonth");
CREATE INDEX IF NOT EXISTS "PortfolioEvent_nepalMonth_event_idx" ON "PortfolioEvent" ("nepalMonth", "eventName");
CREATE INDEX IF NOT EXISTS "PortfolioEvent_nepalMonth_visitor_idx" ON "PortfolioEvent" ("nepalMonth", "visitorId");

