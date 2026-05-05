import { query } from "./db";
import type { UserActivityRow } from "./types";

const NEPAL_TZ = "Asia/Kathmandu";

export async function listUsers(params?: { page?: number; pageSize?: number }) {
  const page = params?.page && params.page > 0 ? params.page : 1;
  const pageSize = params?.pageSize && params.pageSize > 0 ? params.pageSize : 50;
  const skip = (page - 1) * pageSize;
  const [usersResult, totalResult] = await Promise.all([
    query<{
      id: string;
      email: string;
      fullName: string | null;
      zodiacSign: string | null;
      timezone: string | null;
      createdAt: Date;
      lastActiveAt: Date | null;
      activity_count: string;
    }>(
      `SELECT u.id, u.email, u."fullName", u."zodiacSign", u.timezone, u."createdAt", u."lastActiveAt",
              (SELECT COUNT(*) FROM "UserActivity" a WHERE a."userId" = u.id)::text as activity_count
       FROM "User" u
       ORDER BY u."createdAt" DESC
       LIMIT $1 OFFSET $2`,
      [pageSize, skip]
    ),
    query<{ count: string }>('SELECT COUNT(*)::text as count FROM "User"'),
  ]);
  const total = parseInt(totalResult.rows[0]?.count ?? "0", 10);
  return {
    users: usersResult.rows.map((u) => ({
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      zodiacSign: u.zodiacSign,
      timezone: u.timezone ?? null,
      onboardedAt: u.createdAt,
      activityCount: parseInt(u.activity_count, 10),
      lastActiveAt: u.lastActiveAt ?? null,
    })),
    total,
    page,
    pageSize,
  };
}

export async function getUserAnalytics() {
  // Mobile DAU/MAU are based on Nepal local day boundaries.
  // We scope to mobile activity by requiring platform to be present.
  const [dauRes, mauRes, monthlyRes] = await Promise.all([
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

  const dau = parseInt(dauRes.rows[0]?.n ?? "0", 10);
  const mau = parseInt(mauRes.rows[0]?.n ?? "0", 10);
  const yearly = monthlyRes.rows.map((r) => {
    const d = new Date(`${r.monthStart}T00:00:00.000Z`);
    return {
      year: d.getUTCFullYear(),
      month: d.getUTCMonth() + 1,
      activeUsers: parseInt(r.n ?? "0", 10),
    };
  });
  return { dau, mau, yearly };
}

export type DailyActiveUsersReport = {
  date: string;
  dau: number;
  users: {
    id: string;
    email: string;
    fullName: string | null;
    zodiacSign: string | null;
    activityCount: number;
    lastActivityAt: string;
  }[];
  total: number;
  page: number;
  pageSize: number;
};

/** Users with ≥1 UserActivity row on the given Nepal calendar day, paginated. */
export async function getDailyActiveUsersReport(params: {
  date: Date;
  page: number;
  pageSize: number;
}): Promise<DailyActiveUsersReport> {
  const page = params.page > 0 ? params.page : 1;
  const pageSize =
    params.pageSize > 0 ? Math.min(params.pageSize, 100) : 25;
  const skip = (page - 1) * pageSize;
  const dateStr = params.date.toISOString().slice(0, 10);

  const [countResult, rowsResult] = await Promise.all([
    query<{ n: string }>(
      `SELECT COUNT(*)::text AS n FROM (
         SELECT a."userId" FROM "UserActivity" a
         WHERE (a."createdAt" AT TIME ZONE $1)::date = $2::date
         GROUP BY a."userId"
       ) t`,
      [NEPAL_TZ, dateStr],
    ),
    query<{
      id: string;
      email: string;
      fullName: string | null;
      zodiacSign: string | null;
      activity_count: string;
      last_activity: Date;
    }>(
      `SELECT u.id, u.email, u."fullName", u."zodiacSign",
              COUNT(a.id)::text AS activity_count,
              MAX(a."createdAt") AS last_activity
       FROM "UserActivity" a
       INNER JOIN "User" u ON u.id = a."userId"
       WHERE (a."createdAt" AT TIME ZONE $1)::date = $2::date
       GROUP BY u.id, u.email, u."fullName", u."zodiacSign"
       ORDER BY MAX(a."createdAt") DESC
       LIMIT $3 OFFSET $4`,
      [NEPAL_TZ, dateStr, pageSize, skip],
    ),
  ]);

  const total = parseInt(countResult.rows[0]?.n ?? "0", 10);

  return {
    date: dateStr,
    dau: total,
    users: rowsResult.rows.map((r) => ({
      id: r.id,
      email: r.email,
      fullName: r.fullName,
      zodiacSign: r.zodiacSign,
      activityCount: parseInt(r.activity_count, 10),
      lastActivityAt:
        r.last_activity instanceof Date
          ? r.last_activity.toISOString()
          : new Date(r.last_activity).toISOString(),
    })),
    total,
    page,
    pageSize,
  };
}

export async function getUserActivity(
  userId: string,
  params?: { limit?: number }
) {
  const limit =
    params?.limit && params.limit > 0 ? Math.min(params.limit, 200) : 50;
  const [userResult, activitiesResult] = await Promise.all([
    query<{
      id: string;
      email: string;
      fullName: string | null;
      zodiacSign: string | null;
      timezone: string | null;
      createdAt: Date;
    }>(
      `SELECT id, email, "fullName", "zodiacSign", timezone, "createdAt"
       FROM "User" WHERE id = $1`,
      [userId]
    ),
    query<UserActivityRow>(
      `SELECT id, "userId", action, "sessionId", platform, "appVersion", "createdAt"
       FROM "UserActivity" WHERE "userId" = $1
       ORDER BY "createdAt" DESC LIMIT $2`,
      [userId, limit]
    ),
  ]);
  const user = userResult.rows[0];
  if (!user) return null;
  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      zodiacSign: user.zodiacSign,
      timezone: user.timezone ?? null,
      onboardedAt: user.createdAt,
    },
    activities: activitiesResult.rows.map((a) => ({
      ...a,
      createdAt: a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt),
    })),
  };
}
