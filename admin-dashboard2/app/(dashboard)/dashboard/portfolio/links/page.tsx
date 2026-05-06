"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/lib/api-client";

type Row = { label: string; pageviews: number; uniqueVisitors: number };
type RecentRow = {
  visitedAt: string;
  link: string;
  referrerHost: string;
  utmSource: string;
  utmCampaign: string;
};
type PortfolioOverview = {
  timezone: string;
  portfolioEventsReady: boolean;
  portfolio: {
    topLinksToday: Row[];
    topLinksMonth: Row[];
    recentPageviews: RecentRow[];
  };
};

type RecentPageviewsResponse = {
  timezone: string;
  portfolioEventsReady: boolean;
  rows: RecentRow[];
  nextCursor: string | null;
};

function isUrl(s: string) {
  return /^https?:\/\//i.test(s);
}

function LinksTable({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <section className="rounded-2xl border border-purple-900/40 bg-linear-to-b from-[#0b0515] to-[#050316] p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground">Shows full URL when available.</p>
      </div>
      <div className="overflow-hidden rounded-xl border border-purple-900/40">
        <table className="w-full text-sm">
          <thead className="bg-purple-950/40 text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Visited link</th>
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
    </section>
  );
}

function RecentVisitsTable({
  title,
  rows,
  canLoadMore,
  loading,
  onNext,
}: {
  title: string;
  rows: RecentRow[];
  canLoadMore: boolean;
  loading: boolean;
  onNext: () => void;
}) {
  return (
    <section className="rounded-2xl border border-purple-900/40 bg-linear-to-b from-[#0b0515] to-[#050316] p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground">
          Times are shown in <span className="font-medium">Asia/Kathmandu</span>.
        </p>
      </div>
      <div className="overflow-hidden rounded-xl border border-purple-900/40">
        <table className="w-full text-sm">
          <thead className="bg-purple-950/40 text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Visited at</th>
              <th className="px-3 py-2 text-left font-medium">Visited link</th>
              <th className="px-3 py-2 text-left font-medium">Referrer</th>
              <th className="px-3 py-2 text-left font-medium">Campaign</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={`${r.visitedAt}-${r.link}-${idx}`} className="border-t border-purple-900/30 bg-black/10">
                <td className="whitespace-nowrap px-3 py-2 tabular-nums text-muted-foreground">
                  {r.visitedAt}
                </td>
                <td className="max-w-0 px-3 py-2">
                  {isUrl(r.link) ? (
                    <a
                      href={r.link}
                      target="_blank"
                      rel="noreferrer"
                      className="block truncate font-medium text-on-surface hover:underline"
                      title={r.link}
                    >
                      {r.link}
                    </a>
                  ) : (
                    <div className="truncate font-medium text-on-surface" title={r.link}>
                      {r.link}
                    </div>
                  )}
                </td>
                <td className="px-3 py-2 text-muted-foreground">{r.referrerHost}</td>
                <td className="px-3 py-2 text-muted-foreground">
                  <div className="truncate" title={r.utmCampaign}>
                    {r.utmCampaign}
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr className="border-t border-purple-900/30 bg-black/10">
                <td className="px-3 py-6 text-center text-muted-foreground" colSpan={4}>
                  No recent pageviews yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={loading || !canLoadMore}
          className="rounded-lg border border-purple-900/40 bg-black/30 px-3 py-2 text-sm font-medium text-on-surface disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Loading…" : canLoadMore ? "Next" : "No more results"}
        </button>
      </div>
    </section>
  );
}

export default function PortfolioLinksPage() {
  const [data, setData] = useState<PortfolioOverview | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [recentRows, setRecentRows] = useState<RecentRow[]>([]);
  const [recentCursor, setRecentCursor] = useState<string | null>(null);
  const [recentLoading, setRecentLoading] = useState(false);
  const mounted = useRef(true);

  const recentCanLoadMore = useMemo(() => recentCursor !== null, [recentCursor]);

  const loadRecentFirstPage = useCallback(async () => {
    setRecentLoading(true);
    try {
      const res = await api.get<RecentPageviewsResponse>("/admin/analytics/recent-pageviews?limit=10");
      if (!mounted.current) return;
      setRecentRows(res.data.rows ?? []);
      setRecentCursor(res.data.nextCursor ?? null);
    } finally {
      if (mounted.current) setRecentLoading(false);
    }
  }, []);

  const loadNextRecent = useCallback(async () => {
    if (!recentCursor || recentLoading) return;
    setRecentLoading(true);
    try {
      const res = await api.get<RecentPageviewsResponse>(
        `/admin/analytics/recent-pageviews?limit=10&cursor=${encodeURIComponent(recentCursor)}`,
      );
      if (!mounted.current) return;
      setRecentRows(res.data.rows ?? []);
      setRecentCursor(res.data.nextCursor ?? null);
    } finally {
      if (mounted.current) setRecentLoading(false);
    }
  }, [recentCursor, recentLoading]);

  const load = useCallback(async () => {
    setApiError(null);
    try {
      const res = await api.get<PortfolioOverview>("/admin/analytics/overview?days=30");
      if (!mounted.current) return;
      setData(res.data);
    } catch (e: unknown) {
      if (!mounted.current) return;
      const msg =
        e && typeof e === "object" && "message" in e
          ? String((e as { message?: unknown }).message ?? "")
          : "";
      setApiError(msg || "Failed to load portfolio analytics.");
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    const t = setTimeout(() => {
      void load();
      void loadRecentFirstPage();
    }, 0);
    return () => {
      mounted.current = false;
      clearTimeout(t);
    };
  }, [load, loadRecentFirstPage]);

  const today = data?.portfolio.topLinksToday ?? [];
  const month = data?.portfolio.topLinksMonth ?? [];

  return (
    <div className="space-y-6">
      {apiError && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          <strong>API error:</strong> {apiError}
        </div>
      )}
      <header className="flex flex-col gap-1 border-b border-purple-900/40 pb-4">
        <h1 className="text-2xl font-semibold tracking-tight">Portfolio · Visited links</h1>
        <p className="text-sm text-muted-foreground">TZ: {data?.timezone ?? "Asia/Kathmandu"}</p>
      </header>

      {data?.portfolioEventsReady === false && (
        <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-sm text-sky-100">
          Portfolio analytics is not enabled yet. Run migrations in Supabase, then refresh.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <LinksTable title="Most visited (today)" rows={today} />
        <LinksTable title="Most visited (this month)" rows={month} />
      </div>

      <RecentVisitsTable
        title="Recent pageviews"
        rows={recentRows}
        canLoadMore={recentCanLoadMore}
        loading={recentLoading}
        onNext={loadNextRecent}
      />
    </div>
  );
}

