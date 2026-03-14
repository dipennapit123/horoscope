import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { api } from "../services/api";
import type { DashboardStats, Horoscope, UserAnalytics } from "../types";

interface DashboardState {
  stats: DashboardStats | null;
  statsLoading: boolean;
  analytics: UserAnalytics | null;
  analyticsLoading: boolean;
  recent: Horoscope[];
  recentLoading: boolean;
}

export const DashboardPage = () => {
  const [state, setState] = useState<DashboardState>({
    stats: null,
    statsLoading: true,
    analytics: null,
    analyticsLoading: true,
    recent: [],
    recentLoading: true,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.get("/admin/horoscopes/dashboard/stats");
        setState((s) => ({ ...s, stats: res.data.data, statsLoading: false }));
      } catch {
        setState((s) => ({ ...s, statsLoading: false }));
      }
    };

    const loadAnalytics = async () => {
      try {
        const res = await api.get("/admin/users/analytics");
        setState((s) => ({
          ...s,
          analytics: res.data.data,
          analyticsLoading: false,
        }));
      } catch {
        setState((s) => ({ ...s, analyticsLoading: false }));
      }
    };

    const loadRecent = async () => {
      try {
        const res = await api.get("/admin/horoscopes", {
          params: { page: 1 },
        });
        const items: Horoscope[] = res.data.data ?? [];
        setState((s) => ({
          ...s,
          recent: items.slice(0, 4),
          recentLoading: false,
        }));
      } catch {
        setState((s) => ({ ...s, recentLoading: false }));
      }
    };

    void Promise.all([loadStats(), loadAnalytics(), loadRecent()]);
  }, []);

  const { stats, statsLoading, analytics, analyticsLoading, recent, recentLoading } =
    state;

  const todayRangeLabel = `${dayjs().subtract(30, "day").format(
    "MMM D, YYYY",
  )} - ${dayjs().format("MMM D, YYYY")}`;

  const skeletonNumber = (
    <div className="mt-2 h-7 w-16 rounded-2xl bg-purple-900/40 animate-pulse" />
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back. Here&apos;s how AstraDaily is performing today.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-full border border-purple-900/40 bg-background/40 px-4 py-2 text-xs md:text-sm">
            <span className="material-symbols-outlined mr-2 text-purple-300">
              calendar_today
            </span>
            <span className="font-medium">{todayRangeLabel}</span>
          </div>
        </div>
      </header>

      {/* KPI cards - DAU / MAU / Total users / Published horoscopes */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-purple-900/40 bg-gradient-to-b from-purple-900/40 to-purple-950/20 p-5 shadow-lg shadow-purple-950/30">
          <div className="mb-3 flex items-start justify-between">
            <div className="rounded-lg bg-purple-500/20 p-2">
              <span className="material-symbols-outlined text-purple-200">
                person_add
              </span>
            </div>
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-300">
              Today
            </span>
          </div>
          <p className="text-xs font-medium text-muted-foreground">
            Daily active users
          </p>
          {analyticsLoading || !analytics ? (
            skeletonNumber
          ) : (
            <p className="mt-2 text-2xl font-semibold">{analytics.dau}</p>
          )}
        </div>

        <div className="rounded-2xl border border-purple-900/40 bg-gradient-to-b from-purple-900/40 to-purple-950/20 p-5 shadow-lg shadow-purple-950/30">
          <div className="mb-3 flex items-start justify-between">
            <div className="rounded-lg bg-purple-500/20 p-2">
              <span className="material-symbols-outlined text-purple-200">
                groups
              </span>
            </div>
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-300">
              30 days
            </span>
          </div>
          <p className="text-xs font-medium text-muted-foreground">
            Monthly active users
          </p>
          {analyticsLoading || !analytics ? (
            skeletonNumber
          ) : (
            <p className="mt-2 text-2xl font-semibold">{analytics.mau}</p>
          )}
        </div>

        <div className="rounded-2xl border border-purple-900/40 bg-gradient-to-b from-purple-900/40 to-purple-950/20 p-5 shadow-lg shadow-purple-950/30">
          <div className="mb-3 flex items-start justify-between">
            <div className="rounded-lg bg-purple-500/20 p-2">
              <span className="material-symbols-outlined text-purple-200">
                verified_user
              </span>
            </div>
          </div>
          <p className="text-xs font-medium text-muted-foreground">
            Total onboarded users
          </p>
          {statsLoading || !stats ? (
            skeletonNumber
          ) : (
            <p className="mt-2 text-2xl font-semibold">{stats.totalUsers}</p>
          )}
        </div>

        <div className="rounded-2xl border border-purple-900/40 bg-gradient-to-b from-purple-900/40 to-purple-950/20 p-5 shadow-lg shadow-purple-950/30">
          <div className="mb-3 flex items-start justify-between">
            <div className="rounded-lg bg-purple-500/20 p-2">
              <span className="material-symbols-outlined text-purple-200">
                auto_stories
              </span>
            </div>
            <span className="text-xs font-semibold text-purple-200">
              Today
            </span>
          </div>
          <p className="text-xs font-medium text-muted-foreground">
            Published horoscopes
          </p>
          {statsLoading || !stats ? (
            skeletonNumber
          ) : (
            <p className="mt-2 text-2xl font-semibold">
              {stats.publishedHoroscopes}
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                / {stats.totalHoroscopes}
              </span>
            </p>
          )}
        </div>
      </section>

      {/* Chart + recent horoscopes */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr,minmax(0,1.3fr)]">
        {/* Simple static chart to match the design */}
        <div className="rounded-2xl border border-purple-900/40 bg-gradient-to-b from-[#100720] to-[#050316] p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">DAU / MAU growth</h2>
              <p className="text-xs text-muted-foreground">
                User retention trend over the last month.
              </p>
            </div>
          </div>
          <div className="relative h-64 w-full">
            <svg
              viewBox="0 0 1000 300"
              className="h-full w-full"
              preserveAspectRatio="none"
            >
              <line
                x1="0"
                x2="1000"
                y1="60"
                y2="60"
                className="text-purple-900/40"
                stroke="currentColor"
                strokeWidth="1"
              />
              <line
                x1="0"
                x2="1000"
                y1="150"
                y2="150"
                className="text-purple-900/40"
                stroke="currentColor"
                strokeWidth="1"
              />
              <line
                x1="0"
                x2="1000"
                y1="240"
                y2="240"
                className="text-purple-900/40"
                stroke="currentColor"
                strokeWidth="1"
              />

              <defs>
                <linearGradient
                  id="dashChartStroke"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#7f13ec" />
                  <stop offset="100%" stopColor="#b062ff" />
                </linearGradient>
                <linearGradient
                  id="dashChartFill"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#7f13ec" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>

              <path
                d="M0,240 Q80,210 160,220 T320,170 T480,140 T640,150 T760,100 T880,120 T1000,80"
                fill="none"
                stroke="url(#dashChartStroke)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M0,240 Q80,210 160,220 T320,170 T480,140 T640,150 T760,100 T880,120 T1000,80 V300 H0 Z"
                fill="url(#dashChartFill)"
                opacity="0.4"
              />
            </svg>
            <div className="mt-3 flex justify-between px-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              <span>Day 1</span>
              <span>Day 7</span>
              <span>Day 14</span>
              <span>Day 21</span>
              <span>Day 30</span>
            </div>
          </div>
        </div>

        {/* Recent horoscopes table (compact) */}
        <div className="rounded-2xl border border-purple-900/40 bg-gradient-to-b from-[#0b0515] to-[#050316] overflow-hidden">
          <div className="flex items-center justify-between border-b border-purple-900/40 px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold">Recent horoscopes</h2>
              <p className="text-[11px] text-muted-foreground">
                Latest generated or edited entries.
              </p>
            </div>
          </div>
          {recentLoading ? (
            <div className="space-y-2 p-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-10 rounded-xl bg-purple-900/30 animate-pulse"
                />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="p-4 text-xs text-muted-foreground">
              No recent horoscopes yet.
            </div>
          ) : (
            <table className="min-w-full text-xs">
              <thead className="bg-purple-900/40 text-[10px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Zodiac</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((h) => (
                  <tr key={h.id} className="border-t border-purple-900/40">
                    <td className="px-4 py-2">
                      {dayjs(h.date).format("MMM D, YYYY")}
                    </td>
                    <td className="px-4 py-2">{h.zodiacSign}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          h.isPublished
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "bg-yellow-500/10 text-yellow-300"
                        }`}
                      >
                        {h.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
};
