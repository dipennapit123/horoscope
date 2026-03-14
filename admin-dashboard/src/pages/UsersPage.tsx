import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { api } from "../services/api";

dayjs.extend(relativeTime);
import type { AdminUser, UserAnalytics } from "../types";

export const UsersPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users", {
        params: { page, pageSize: 20 },
      });
      setUsers(res.data.data.users);
      setTotal(res.data.data.total);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const res = await api.get("/admin/users/analytics");
      setAnalytics(res.data.data);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, [page]);

  useEffect(() => {
    void loadAnalytics();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.trim().toLowerCase();
    return users.filter((u) => u.email.toLowerCase().includes(q));
  }, [users, search]);

  const yearly = analytics?.yearly.slice(-12) ?? [];
  const maxActive =
    yearly.length > 0
      ? yearly.reduce((max, m) => Math.max(max, m.activeUsers), 0)
      : 0;

  const monthLabel = (month: number) =>
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][
      month - 1
    ];

  return (
    <div className="min-h-screen bg-background-light/5 text-slate-100">
      {/* Header */}
      <header className="mb-6 flex flex-col gap-4 border-b border-purple-900/40 pb-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-3xl text-primary">
            cloud_queue
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
            <p className="text-xs text-muted-foreground">
              Onboarded users, DAU/MAU and yearly activity. DAU/MAU = users with at
              least one app open or action in that period.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user by email..."
              className="w-full rounded-full bg-purple-950/40 pl-10 pr-4 py-2 text-sm outline-none ring-1 ring-purple-900/60 placeholder:text-slate-500 focus:ring-primary/70"
            />
          </div>
        </div>
      </header>

      <div className="space-y-8">
        {/* Summary cards */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-purple-900/60 bg-purple-950/60 p-5 shadow-lg shadow-purple-950/40">
            <p className="text-xs font-medium text-slate-400">
              Daily active users
            </p>
            {analyticsLoading || !analytics ? (
              <div className="mt-3 h-8 w-20 animate-pulse rounded bg-purple-900/40" />
            ) : (
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold">{analytics.dau}</span>
              </div>
            )}
          </div>
          <div className="rounded-lg border border-purple-900/60 bg-purple-950/60 p-5 shadow-lg shadow-purple-950/40">
            <p className="text-xs font-medium text-slate-400">
              Monthly active users
            </p>
            {analyticsLoading || !analytics ? (
              <div className="mt-3 h-8 w-20 animate-pulse rounded bg-purple-900/40" />
            ) : (
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold">{analytics.mau}</span>
              </div>
            )}
          </div>
          <div className="rounded-lg border border-purple-900/60 bg-purple-950/60 p-5 shadow-lg shadow-purple-950/40">
            <p className="text-xs font-medium text-slate-400">Total users</p>
            {loading && page === 1 ? (
              <div className="mt-3 h-8 w-20 animate-pulse rounded bg-purple-900/40" />
            ) : (
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold">{total}</span>
              </div>
            )}
          </div>
          <div className="rounded-lg border border-purple-900/60 bg-purple-950/60 p-5 shadow-lg shadow-purple-950/40">
            <p className="text-xs font-medium text-slate-400">
              30‑day retention (concept)
            </p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold">—</span>
              <span className="text-xs text-slate-500">
                (configure once metric is available)
              </span>
            </div>
          </div>
        </section>

        {/* Yearly bar chart */}
        {yearly.length > 0 && (
          <section className="rounded-lg border border-purple-900/60 bg-purple-950/60 p-6 shadow-lg shadow-purple-950/40">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Monthly active users</h2>
                <p className="text-xs text-slate-400">
                  Historical engagement trends over the last 12 months.
                </p>
              </div>
            </div>
            <div className="flex h-64 items-end justify-between gap-3 px-1">
              {yearly.map((m, idx) => {
                const heightPct =
                  maxActive > 0 ? Math.max((m.activeUsers / maxActive) * 100, 8) : 0;
                const isLast = idx === yearly.length - 1;
                return (
                  <div
                    key={`${m.year}-${m.month}`}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <div
                      className={`w-full rounded-t-lg transition-colors ${
                        isLast
                          ? "bg-primary shadow-lg shadow-primary/30"
                          : "bg-primary/30 hover:bg-primary/50"
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                    <span
                      className={`text-[11px] ${
                        isLast ? "font-semibold text-primary" : "text-slate-400"
                      }`}
                    >
                      {monthLabel(m.month)}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* User directory */}
        <section className="rounded-lg border border-purple-900/60 bg-purple-950/60 shadow-lg shadow-purple-950/40">
          <div className="flex items-center justify-between border-b border-purple-900/40 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold">User directory</h2>
              <p className="text-xs text-slate-400">
                Email, timezone, onboard time and last activity. Click to inspect
                activity timeline.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="rounded bg-purple-900/40 px-4 py-2 text-xs font-medium text-slate-100 hover:bg-purple-800/60">
                Export CSV
              </button>
            </div>
          </div>

          {loading && page === 1 ? (
            <div className="space-y-3 p-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-10 w-full animate-pulse rounded bg-purple-900/40"
                />
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">
              No users match your filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-purple-900/40 bg-purple-950/40 text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-6 py-3">User email</th>
                    <th className="px-6 py-3">Timezone</th>
                    <th className="px-6 py-3">Zodiac</th>
                    <th className="px-6 py-3">Onboarded</th>
                    <th className="px-6 py-3">Last active</th>
                    <th className="px-6 py-3">Activity</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/40">
                  {filteredUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-purple-900/40 transition-colors"
                    >
                      <td className="whitespace-nowrap px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 items-center justify-center rounded-full bg-primary/25 text-xs font-semibold text-primary">
                            {(u.email[0] + (u.email[1] ?? "")).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium">{u.email}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-3 text-xs text-slate-400">
                        {u.timezone ?? "—"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-3 text-xs">
                        {u.zodiacSign ? (
                          <span className="inline-flex items-center rounded-full bg-purple-900/40 px-2 py-1 text-[11px] font-medium text-purple-200">
                            {u.zodiacSign}
                          </span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-3 text-xs text-slate-400">
                        {dayjs(u.onboardedAt).format("MMM D, YYYY")}
                      </td>
                      <td className="whitespace-nowrap px-6 py-3 text-xs text-slate-400">
                        {u.lastActiveAt
                          ? dayjs(u.lastActiveAt).fromNow()
                          : "—"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-3 text-xs">
                        <div className="flex flex-col">
                          <span className="font-semibold">
                            {u.activityCount}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            events
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-3 text-right">
                        <Link
                          to={`/users/${u.id}/activity`}
                          className="rounded bg-primary/20 px-3 py-1 text-[11px] font-semibold text-primary hover:bg-primary hover:text-white"
                        >
                          Activity
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {total > 20 && (
            <div className="flex items-center justify-between border-t border-purple-900/40 bg-purple-950/60 px-6 py-4">
              <span className="text-xs text-slate-400">
                Page {page} of {Math.ceil(total / 20)}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-full border border-purple-500/60 px-3 py-1 text-xs disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.ceil(total / 20)}
                  className="rounded-full border border-purple-500/60 px-3 py-1 text-xs disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

