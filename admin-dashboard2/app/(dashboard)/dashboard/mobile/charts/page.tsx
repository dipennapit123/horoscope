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

type MobileCharts = {
  timezone: string;
  mobile: {
    dauSeries30d: Array<{ date: string; value: number }>;
    mauSeries12m: Array<{ monthStart: string; value: number }>;
  };
};

export default function MobileChartsPage() {
  const [data, setData] = useState<MobileCharts | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const mounted = useRef(true);

  const load = useCallback(async () => {
    setApiError(null);
    try {
      const res = await api.get<MobileCharts>("/admin/analytics/overview?days=30");
      if (!mounted.current) return;
      setData(res.data);
      setLoaded(true);
    } catch (e: unknown) {
      if (!mounted.current) return;
      const msg =
        e && typeof e === "object" && "message" in e
          ? String((e as { message?: unknown }).message ?? "")
          : "";
      setApiError(msg || "Failed to load mobile charts.");
      setLoaded(true);
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

  const dauChart = useMemo(() => {
    const pts = data?.mobile.dauSeries30d ?? [];
    return {
      data: {
        labels: pts.map((p) => dayjs(p.date).format("MMM D")),
        datasets: [
          {
            label: "DAU",
            data: pts.map((p) => p.value),
            borderColor: "#b062ff",
            backgroundColor: "rgba(176, 98, 255, 0.18)",
            tension: 0.35,
            pointRadius: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index" as const, intersect: false },
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: "rgba(148, 163, 184, 0.12)" } },
          y: { grid: { color: "rgba(148, 163, 184, 0.12)" }, beginAtZero: true },
        },
      },
    };
  }, [data]);

  const mauChart = useMemo(() => {
    const pts = data?.mobile.mauSeries12m ?? [];
    return {
      data: {
        labels: pts.map((p) => dayjs(p.monthStart).format("MMM YYYY")),
        datasets: [
          {
            label: "MAU",
            data: pts.map((p) => p.value),
            borderColor: "#7f13ec",
            backgroundColor: "rgba(127, 19, 236, 0.16)",
            tension: 0.25,
            pointRadius: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index" as const, intersect: false },
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: "rgba(148, 163, 184, 0.12)" } },
          y: { grid: { color: "rgba(148, 163, 184, 0.12)" }, beginAtZero: true },
        },
      },
    };
  }, [data]);

  return (
    <div className="space-y-8">
      {apiError && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          <strong>API error:</strong> {apiError}
        </div>
      )}

      <header className="flex flex-col gap-1 border-b border-purple-900/40 pb-4">
        <h1 className="text-2xl font-semibold tracking-tight">Mobile charts</h1>
        <p className="text-sm text-muted-foreground">All buckets are Nepal time • TZ: {data?.timezone ?? "Asia/Kathmandu"}</p>
      </header>

      <section className="rounded-2xl border border-purple-900/40 bg-gradient-to-b from-[#100720] to-[#050316] p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">DAU (last 30 Nepal-days)</h2>
        </div>
        <div className="relative h-72 w-full">
          {!loaded ? (
            <div className="h-full w-full animate-pulse rounded-xl bg-purple-900/30" />
          ) : (
            <Line data={dauChart.data} options={dauChart.options} />
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-purple-900/40 bg-gradient-to-b from-[#0b0515] to-[#050316] p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">MAU (last 12 months)</h2>
        </div>
        <div className="relative h-72 w-full">
          {!loaded ? (
            <div className="h-full w-full animate-pulse rounded-xl bg-purple-900/30" />
          ) : (
            <Line data={mauChart.data} options={mauChart.options} />
          )}
        </div>
      </section>
    </div>
  );
}

