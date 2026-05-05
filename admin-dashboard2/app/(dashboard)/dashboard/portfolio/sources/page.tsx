"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api-client";

type Row = { label: string; pageviews: number; uniqueVisitors: number };
type PortfolioOverview = {
  timezone: string;
  portfolioEventsReady: boolean;
  portfolio: {
    topSourcesToday: Row[];
    topSourcesMonth: Row[];
  };
};

function Table({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <section className="rounded-2xl border border-purple-900/40 bg-linear-to-b from-[#0b0515] to-[#050316] p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground">
          Referrer domains. Social apps may show as (direct).
        </p>
      </div>
      <div className="overflow-hidden rounded-xl border border-purple-900/40">
        <table className="w-full text-sm">
          <thead className="bg-purple-950/40 text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Source</th>
              <th className="px-3 py-2 text-right font-medium">Pageviews</th>
              <th className="px-3 py-2 text-right font-medium">Unique</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={`${r.label}-${idx}`} className="border-t border-purple-900/30 bg-black/10">
                <td className="max-w-0 px-3 py-2">
                  <div className="truncate font-medium text-on-surface" title={r.label}>
                    {r.label}
                  </div>
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

export default function PortfolioSourcesPage() {
  const [data, setData] = useState<PortfolioOverview | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const mounted = useRef(true);

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
    const t = setTimeout(() => void load(), 0);
    return () => {
      mounted.current = false;
      clearTimeout(t);
    };
  }, [load]);

  return (
    <div className="space-y-6">
      {apiError && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          <strong>API error:</strong> {apiError}
        </div>
      )}
      <header className="flex flex-col gap-1 border-b border-purple-900/40 pb-4">
        <h1 className="text-2xl font-semibold tracking-tight">Portfolio · Sources</h1>
        <p className="text-sm text-muted-foreground">TZ: {data?.timezone ?? "Asia/Kathmandu"}</p>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Table title="Top sources (today)" rows={data?.portfolio.topSourcesToday ?? []} />
        <Table title="Top sources (this month)" rows={data?.portfolio.topSourcesMonth ?? []} />
      </div>
    </div>
  );
}

