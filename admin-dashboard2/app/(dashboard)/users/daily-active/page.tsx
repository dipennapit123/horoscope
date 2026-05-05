"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { api } from "@/lib/api-client";

dayjs.extend(utc);

const NEPAL_TZ = "Asia/Kathmandu";

function formatNepalDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    timeZone: NEPAL_TZ,
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

interface DauUser {
  id: string;
  email: string;
  fullName: string | null;
  zodiacSign: string | null;
  activityCount: number;
  lastActivityAt: string;
}

interface Report {
  date: string;
  dau: number;
  users: DauUser[];
  total: number;
  page: number;
  pageSize: number;
}

export default function DailyActiveUsersPage() {
  const [dateStr, setDateStr] = useState(() =>
    // Date input is treated as Nepal calendar date in the API.
    dayjs().format("YYYY-MM-DD")
  );
  const [page, setPage] = useState(1);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("date", dateStr);
      params.set("page", String(page));
      params.set("pageSize", "25");
      const res = await api.get<Report>(`/admin/users/daily-active?${params}`);
      setReport(res.data);
    } catch {
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, [dateStr, page]);

  useEffect(() => {
    void load();
  }, [load]);

  const totalPages = useMemo(() => {
    if (!report || report.pageSize <= 0) return 1;
    return Math.max(1, Math.ceil(report.total / report.pageSize));
  }, [report]);

  return (
    <div className="min-h-screen bg-background/5 text-slate-100">
      <header className="mb-6 flex flex-col gap-4 border-b border-purple-900/40 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2 text-xs text-slate-500">
            <Link href="/users" className="hover:text-primary">
              Users
            </Link>
            <span>/</span>
            <span className="text-slate-400">Daily active users</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Daily active users
          </h1>
          <p className="text-xs text-muted-foreground">
            Users who recorded at least one activity on the selected Nepal day (Asia/Kathmandu).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 rounded-full border border-purple-900/60 bg-purple-950/40 px-3 py-1.5 text-sm">
            <span className="material-symbols-outlined text-sm text-slate-400">
              calendar_today
            </span>
            <input
              type="date"
              value={dateStr}
              onChange={(e) => {
                setPage(1);
                setDateStr(e.target.value);
              }}
              className="border-none bg-transparent p-0 text-slate-200 outline-none"
            />
          </label>
          <button
            type="button"
            onClick={() => void load()}
            className="rounded-full bg-primary/20 px-4 py-2 text-sm font-bold text-primary hover:bg-primary hover:text-white"
          >
            Refresh
          </button>
        </div>
      </header>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-purple-900/60 bg-purple-950/60 p-5 shadow-lg shadow-purple-950/40">
          <p className="text-xs font-medium text-slate-400">DAU (selected day)</p>
          {loading && !report ? (
            <div className="mt-3 h-8 w-16 animate-pulse rounded bg-purple-900/40" />
          ) : (
            <p className="mt-2 text-3xl font-bold">{report?.dau ?? 0}</p>
          )}
          <p className="mt-1 text-[11px] text-slate-500">
            Distinct users with activity · Nepal date {dateStr}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-purple-900/60 bg-purple-950/40 shadow-lg shadow-purple-950/30">
        {loading && !report ? (
          <div className="space-y-3 p-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-12 w-full animate-pulse rounded-lg bg-purple-900/40"
              />
            ))}
          </div>
        ) : !report || report.users.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">
            No active users for this day. Activity is logged when the app records
            events (e.g. app open, horoscope view).
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-purple-900/60 bg-purple-950/60 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Zodiac</th>
                    <th className="px-6 py-4">Events (day)</th>
                    <th className="px-6 py-4">Last activity (Nepal)</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/40">
                  {report.users.map((u) => (
                    <tr
                      key={u.id}
                      className="transition-colors hover:bg-purple-900/30"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium">{u.fullName || u.email}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {u.zodiacSign ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {u.activityCount}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-slate-400">
                        {formatNepalDateTime(u.lastActivityAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/users/${u.id}/activity`}
                          className="text-xs font-bold text-primary hover:underline"
                        >
                          View activity
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {report.total > report.pageSize && (
              <div className="flex items-center justify-between border-t border-purple-900/40 bg-purple-950/60 px-6 py-4">
                <span className="text-xs text-slate-500">
                  Page {report.page} of {totalPages} · {report.total} users
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="rounded-full border border-purple-900/60 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-full border border-purple-900/60 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
