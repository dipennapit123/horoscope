"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { api } from "@/lib/api-client";

export default function MobileDashboardPage() {
  const [loaded, setLoaded] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    totalHoroscopes: number;
    publishedHoroscopes: number;
    draftHoroscopes: number;
    totalUsers: number;
  } | null>(null);
  const [analytics, setAnalytics] = useState<{
    dau: number;
    mau: number;
  } | null>(null);
  const mounted = useRef(true);

  const load = useCallback(async () => {
    setApiError(null);
    const [statsRes, analyticsRes] = await Promise.allSettled([
      api.get<typeof stats>("/admin/horoscopes/dashboard/stats"),
      api.get<typeof analytics>("/admin/users/analytics"),
    ]);
    if (!mounted.current) return;

    const failed = [statsRes, analyticsRes].find((r) => r.status === "rejected");
    if (failed && failed.status === "rejected") {
      setApiError(failed.reason?.message ?? "Failed to load dashboard data.");
    }
    if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
    if (analyticsRes.status === "fulfilled") setAnalytics(analyticsRes.value.data);
    setLoaded(true);
  }, []);

  useEffect(() => {
    mounted.current = true;
    const t = setTimeout(() => void load(), 0);
    return () => {
      mounted.current = false;
      clearTimeout(t);
    };
  }, [load]);

  const skeleton = <div className="mt-2 h-7 w-16 rounded-2xl bg-purple-900/40 animate-pulse" />;
  const todayRangeLabel = `${dayjs().subtract(30, "day").format("MMM D, YYYY")} - ${dayjs().format("MMM D, YYYY")}`;

  return (
    <div className="space-y-8">
      {apiError && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          <strong>API error:</strong> {apiError}
        </div>
      )}

      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Mobile Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Nepal-time active user stats for the mobile app.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-full border border-purple-900/40 bg-background/40 px-4 py-2 text-xs md:text-sm">
            <span className="material-symbols-outlined mr-2 text-purple-300">calendar_today</span>
            <span className="font-medium" suppressHydrationWarning>
              {todayRangeLabel || "—"}
            </span>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon="person_add" label="Daily active users" badge="Today">
          {!loaded ? skeleton : <p className="mt-2 text-2xl font-semibold">{analytics?.dau ?? 0}</p>}
        </StatCard>
        <StatCard icon="groups" label="Monthly active users" badge="30 days">
          {!loaded ? skeleton : <p className="mt-2 text-2xl font-semibold">{analytics?.mau ?? 0}</p>}
        </StatCard>
        <StatCard icon="verified_user" label="Total onboarded users">
          {!loaded ? skeleton : <p className="mt-2 text-2xl font-semibold">{stats?.totalUsers ?? 0}</p>}
        </StatCard>
        <StatCard icon="auto_stories" label="Published horoscopes" badge="Today">
          {!loaded ? skeleton : (
            <p className="mt-2 text-2xl font-semibold">
              {stats?.publishedHoroscopes ?? 0}
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                / {stats?.totalHoroscopes ?? 0}
              </span>
            </p>
          )}
        </StatCard>
      </section>

      <div className="text-xs text-muted-foreground">
        Charts are available under <strong>Mobile → Charts</strong>.
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  badge,
  children,
}: {
  icon: string;
  label: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-purple-900/40 bg-gradient-to-b from-purple-900/40 to-purple-950/20 p-5 shadow-lg shadow-purple-950/30">
      <div className="mb-3 flex items-start justify-between">
        <div className="rounded-lg bg-purple-500/20 p-2">
          <span className="material-symbols-outlined text-purple-200">{icon}</span>
        </div>
        {badge && (
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-300">
            {badge}
          </span>
        )}
      </div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

