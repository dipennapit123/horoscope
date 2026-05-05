"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { api } from "@/lib/api-client";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

type PortfolioOverview = {
  timezone: string;
  portfolioEventsReady: boolean;
  portfolio: {
    uniqueToday: number;
    uniqueMonth: number;
    trafficToday: number;
    trafficMonth: number;
    uniqueSeries30d: Array<{ date: string; value: number }>;
    trafficSeries30d: Array<{ date: string; value: number }>;
    topLinksToday: Array<{ label: string; pageviews: number; uniqueVisitors: number }>;
    topLinksMonth: Array<{ label: string; pageviews: number; uniqueVisitors: number }>;
    topSourcesToday: Array<{ label: string; pageviews: number; uniqueVisitors: number }>;
    topSourcesMonth: Array<{ label: string; pageviews: number; uniqueVisitors: number }>;
    topCampaignsMonth: Array<{ label: string; pageviews: number; uniqueVisitors: number }>;
  };
};

function TrafficTable({
  title,
  rows,
  emptyLabel,
}: {
  title: string;
  rows: Array<{ label: string; pageviews: number; uniqueVisitors: number }>;
  emptyLabel: string;
}) {
  const isUrl = (s: string) => /^https?:\/\//i.test(s);
  return (
    <section className="rounded-2xl border border-purple-900/40 bg-linear-to-b from-[#0b0515] to-[#050316] p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground">Nepal time bucketing.</p>
      </div>
      {rows.length === 0 ? (
        <div className="rounded-xl border border-purple-900/40 bg-purple-950/20 px-4 py-3 text-sm text-muted-foreground">
          {emptyLabel}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-purple-900/40">
          <table className="w-full text-sm">
            <thead className="bg-purple-950/40 text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Link / Source</th>
                <th className="px-3 py-2 text-right font-medium">Pageviews</th>
                <th className="px-3 py-2 text-right font-medium">Unique</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr
                  key={`${r.label}-${idx}`}
                  className="border-t border-purple-900/30 bg-black/10"
                >
                  <td className="max-w-0 px-3 py-2">
                    {isUrl(r.label) ? (
                      <a
                        href={r.label}
                        target="_blank"
                        rel="noreferrer"
                        className="block truncate font-medium text-on-surface hover:underline"
                        title={r.label}
                      >
                        {r.label}
                      </a>
                    ) : (
                      <div className="truncate font-medium text-on-surface" title={r.label}>
                        {r.label}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.pageviews}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.uniqueVisitors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default function PortfolioDashboardPage() {
  const [data, setData] = useState<PortfolioOverview | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const mounted = useRef(true);

  const load = useCallback(async () => {
    setApiError(null);
    try {
      const res = await api.get<PortfolioOverview>("/admin/analytics/overview?days=30");
      if (!mounted.current) return;
      setData(res.data);
      setLoaded(true);
    } catch (e: unknown) {
      if (!mounted.current) return;
      const msg =
        e && typeof e === "object" && "message" in e
          ? String((e as { message?: unknown }).message ?? "")
          : "";
      setApiError(msg || "Failed to load portfolio analytics.");
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    const t = setTimeout(() => {
      void load();
    }, 0);
    return () => {
      mounted.current = false;
      clearTimeout(t);
    };
  }, [load]);

  const chart = useMemo(() => {
    const pts = data?.portfolio.uniqueSeries30d ?? [];
    return {
      data: {
        labels: pts.map((p) => dayjs(p.date).format("MMM D")),
        datasets: [
          {
            label: "Unique visitors",
            data: pts.map((p) => p.value),
            borderColor: "#22c55e",
            backgroundColor: "rgba(34, 197, 94, 0.16)",
            tension: 0.35,
            pointRadius: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index" as const, intersect: false },
        plugins: { legend: { display: false }, tooltip: { enabled: true } },
        scales: {
          x: { grid: { color: "rgba(148, 163, 184, 0.12)" } },
          y: {
            grid: { color: "rgba(148, 163, 184, 0.12)" },
            beginAtZero: true,
          },
        },
      },
    };
  }, [data]);

  const skeleton = <div className="mt-2 h-7 w-16 rounded-2xl bg-purple-900/40 animate-pulse" />;

  return (
    <div className="space-y-8">
      {apiError && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          <strong>API error:</strong> {apiError}
        </div>
      )}

      <header className="flex flex-col gap-1 border-b border-purple-900/40 pb-4">
        <h1 className="text-2xl font-semibold tracking-tight">Portfolio Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Unique visitors (no login) • TZ: {data?.timezone ?? "Asia/Kathmandu"}
        </p>
      </header>

      {data?.portfolioEventsReady === false && (
        <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-sm text-sky-100">
          Portfolio analytics is not enabled yet. Run the migration
          <code className="mx-1 rounded bg-black/30 px-1">migrate-portfolio-events.sql</code>
          in Supabase, then refresh.
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-purple-900/40 bg-linear-to-b from-purple-900/40 to-purple-950/20 p-5 shadow-lg shadow-purple-950/30">
          <p className="text-xs font-medium text-muted-foreground">Unique visitors</p>
          {!loaded ? (
            skeleton
          ) : (
            <p className="mt-2 text-2xl font-semibold">{data?.portfolio.uniqueToday ?? 0}</p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">Today (Nepal day)</p>
        </div>

        <div className="rounded-2xl border border-purple-900/40 bg-linear-to-b from-purple-900/40 to-purple-950/20 p-5 shadow-lg shadow-purple-950/30">
          <p className="text-xs font-medium text-muted-foreground">Unique visitors</p>
          {!loaded ? (
            skeleton
          ) : (
            <p className="mt-2 text-2xl font-semibold">{data?.portfolio.uniqueMonth ?? 0}</p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">This month (Nepal)</p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-purple-900/40 bg-linear-to-b from-purple-900/40 to-purple-950/20 p-5 shadow-lg shadow-purple-950/30">
          <p className="text-xs font-medium text-muted-foreground">Total traffic</p>
          {!loaded ? (
            skeleton
          ) : (
            <p className="mt-2 text-2xl font-semibold">{data?.portfolio.trafficToday ?? 0}</p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">Pageviews today (Nepal day)</p>
        </div>
        <div className="rounded-2xl border border-purple-900/40 bg-linear-to-b from-purple-900/40 to-purple-950/20 p-5 shadow-lg shadow-purple-950/30">
          <p className="text-xs font-medium text-muted-foreground">Total traffic</p>
          {!loaded ? (
            skeleton
          ) : (
            <p className="mt-2 text-2xl font-semibold">{data?.portfolio.trafficMonth ?? 0}</p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">Pageviews this month (Nepal)</p>
        </div>
      </section>

      <section className="rounded-2xl border border-purple-900/40 bg-linear-to-b from-[#0b0515] to-[#050316] p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Unique visitors trend</h2>
          <p className="text-xs text-muted-foreground">Last 30 Nepal-days.</p>
        </div>
        <div className="relative h-72 w-full">
          {!loaded ? (
            <div className="h-full w-full animate-pulse rounded-xl bg-purple-900/30" />
          ) : (
            <Line data={chart.data} options={chart.options} />
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TrafficTable
          title="Most visited links (today)"
          rows={data?.portfolio.topLinksToday ?? []}
          emptyLabel="No pageview data yet."
        />
        <TrafficTable
          title="Most visited links (this month)"
          rows={data?.portfolio.topLinksMonth ?? []}
          emptyLabel="No pageview data yet."
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TrafficTable
          title="Top traffic sources (today)"
          rows={data?.portfolio.topSourcesToday ?? []}
          emptyLabel="No referrer data yet (direct traffic will show as (direct))."
        />
        <TrafficTable
          title="Top traffic sources (this month)"
          rows={data?.portfolio.topSourcesMonth ?? []}
          emptyLabel="No referrer data yet (direct traffic will show as (direct))."
        />
      </div>

      <TrafficTable
        title="Top campaigns (this month)"
        rows={data?.portfolio.topCampaignsMonth ?? []}
        emptyLabel="No UTM campaign data yet. Add ?utm_source=...&utm_campaign=... to your marketing links."
      />
    </div>
  );
}

