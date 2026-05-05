import { query } from "./db";

const NEPAL_TZ = "Asia/Kathmandu";

export type DayPoint = { date: string; value: number };
export type MonthPoint = { monthStart: string; value: number };

export type AnalyticsOverview = {
  timezone: string;
  portfolioEventsReady: boolean;
  mobile: {
    dauToday: number;
    mau30d: number;
    dauSeries30d: DayPoint[];
    mauSeries12m: MonthPoint[];
  };
  portfolio: {
    uniqueToday: number;
    uniqueMonth: number;
    trafficToday: number;
    trafficMonth: number;
    uniqueSeries30d: DayPoint[];
    trafficSeries30d: DayPoint[];
  };
};

function toDayPoints(rows: { date: string; n: string }[]): DayPoint[] {
  return rows.map((r) => ({ date: r.date, value: parseInt(r.n ?? "0", 10) }));
}

function toMonthPoints(rows: { monthStart: string; n: string }[]): MonthPoint[] {
  return rows.map((r) => ({
    monthStart: r.monthStart,
    value: parseInt(r.n ?? "0", 10),
  }));
}

export async function getAnalyticsOverview(params?: { days?: number }) {
  const days = params?.days && params.days > 0 ? Math.min(params.days, 120) : 30;

  const [mobileTodayRes, mobileMauRes, mobileDauSeriesRes, mobileMauSeriesRes] =
    await Promise.all([
      query<{ n: string }>(
        `SELECT COUNT(DISTINCT "userId")::text AS n
         FROM "UserActivity"
         WHERE COALESCE(platform, '') <> ''
           AND ("createdAt" AT TIME ZONE $1)::date = (now() AT TIME ZONE $1)::date`,
        [NEPAL_TZ],
      ),
      query<{ n: string }>(
        `SELECT COUNT(DISTINCT "userId")::text AS n
         FROM "UserActivity"
         WHERE COALESCE(platform, '') <> ''
           AND ("createdAt" AT TIME ZONE $1)::date >= ((now() AT TIME ZONE $1)::date - 29)
           AND ("createdAt" AT TIME ZONE $1)::date <= (now() AT TIME ZONE $1)::date`,
        [NEPAL_TZ],
      ),
      query<{ date: string; n: string }>(
        `SELECT (date_trunc('day', "createdAt" AT TIME ZONE $1)::date)::text AS date,
                COUNT(DISTINCT "userId")::text AS n
         FROM "UserActivity"
         WHERE COALESCE(platform, '') <> ''
           AND ("createdAt" AT TIME ZONE $1)::date >= ((now() AT TIME ZONE $1)::date - ($2::int - 1))
           AND ("createdAt" AT TIME ZONE $1)::date <= (now() AT TIME ZONE $1)::date
         GROUP BY 1
         ORDER BY 1 ASC`,
        [NEPAL_TZ, days],
      ),
      query<{ monthStart: string; n: string }>(
        `SELECT date_trunc('month', "createdAt" AT TIME ZONE $1)::date::text AS "monthStart",
                COUNT(DISTINCT "userId")::text AS n
         FROM "UserActivity"
         WHERE COALESCE(platform, '') <> ''
           AND "createdAt" >= (now() - interval '400 days')
         GROUP BY 1
         ORDER BY 1 ASC`,
        [NEPAL_TZ],
      ),
    ]);

  const existsRes = await query<{ reg: string | null }>(
    `SELECT to_regclass('public."PortfolioEvent"')::text AS reg`,
  );
  const portfolioEventsReady = Boolean(existsRes.rows[0]?.reg);

  let uniqueToday = 0;
  let uniqueMonth = 0;
  let trafficToday = 0;
  let trafficMonth = 0;
  let uniqueSeries30d: DayPoint[] = [];
  let trafficSeries30d: DayPoint[] = [];

  if (portfolioEventsReady) {
    const [uniqueTodayRes, trafficTodayRes, uniqueMonthRes, trafficMonthRes, uniqueSeriesRes, trafficSeriesRes] =
      await Promise.all([
        query<{ n: string }>(
          `SELECT COUNT(DISTINCT "visitorId")::text AS n
           FROM "PortfolioEvent"
           WHERE "nepalDay" = (now() AT TIME ZONE $1)::date`,
          [NEPAL_TZ],
        ),
        query<{ n: string }>(
          `SELECT COUNT(*)::text AS n
           FROM "PortfolioEvent"
           WHERE "nepalDay" = (now() AT TIME ZONE $1)::date
             AND "eventName" = 'pageview'`,
          [NEPAL_TZ],
        ),
        query<{ n: string }>(
          `SELECT COUNT(DISTINCT "visitorId")::text AS n
           FROM "PortfolioEvent"
           WHERE "nepalMonth" = date_trunc('month', now() AT TIME ZONE $1)::date`,
          [NEPAL_TZ],
        ),
        query<{ n: string }>(
          `SELECT COUNT(*)::text AS n
           FROM "PortfolioEvent"
           WHERE "nepalMonth" = date_trunc('month', now() AT TIME ZONE $1)::date
             AND "eventName" = 'pageview'`,
          [NEPAL_TZ],
        ),
        query<{ date: string; n: string }>(
          `SELECT "nepalDay"::text AS date, COUNT(DISTINCT "visitorId")::text AS n
           FROM "PortfolioEvent"
           WHERE "nepalDay" >= ((now() AT TIME ZONE $1)::date - ($2::int - 1))
             AND "nepalDay" <= (now() AT TIME ZONE $1)::date
           GROUP BY 1
           ORDER BY 1 ASC`,
          [NEPAL_TZ, days],
        ),
        query<{ date: string; n: string }>(
          `SELECT "nepalDay"::text AS date, COUNT(*)::text AS n
           FROM "PortfolioEvent"
           WHERE "eventName" = 'pageview'
             AND "nepalDay" >= ((now() AT TIME ZONE $1)::date - ($2::int - 1))
             AND "nepalDay" <= (now() AT TIME ZONE $1)::date
           GROUP BY 1
           ORDER BY 1 ASC`,
          [NEPAL_TZ, days],
        ),
      ]);

    uniqueToday = parseInt(uniqueTodayRes.rows[0]?.n ?? "0", 10);
    trafficToday = parseInt(trafficTodayRes.rows[0]?.n ?? "0", 10);
    uniqueMonth = parseInt(uniqueMonthRes.rows[0]?.n ?? "0", 10);
    trafficMonth = parseInt(trafficMonthRes.rows[0]?.n ?? "0", 10);
    uniqueSeries30d = toDayPoints(uniqueSeriesRes.rows);
    trafficSeries30d = toDayPoints(trafficSeriesRes.rows);
  }

  const overview: AnalyticsOverview = {
    timezone: NEPAL_TZ,
    portfolioEventsReady,
    mobile: {
      dauToday: parseInt(mobileTodayRes.rows[0]?.n ?? "0", 10),
      mau30d: parseInt(mobileMauRes.rows[0]?.n ?? "0", 10),
      dauSeries30d: toDayPoints(mobileDauSeriesRes.rows),
      mauSeries12m: toMonthPoints(mobileMauSeriesRes.rows).slice(-12),
    },
    portfolio: {
      uniqueToday,
      uniqueMonth,
      trafficToday,
      trafficMonth,
      uniqueSeries30d,
      trafficSeries30d,
    },
  };

  return overview;
}

