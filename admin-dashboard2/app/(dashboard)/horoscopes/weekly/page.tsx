"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { api } from "@/lib/api-client";
import type { ZodiacSign } from "@/lib/types";

const ZODIAC_SIGNS: ZodiacSign[] = [
  "ARIES", "TAURUS", "GEMINI", "CANCER", "LEO", "VIRGO",
  "LIBRA", "SCORPIO", "SAGITTARIUS", "CAPRICORN", "AQUARIUS", "PISCES",
];

interface WeeklyRow {
  id: string;
  zodiacSign: string;
  weekStartDate: string;
  title: string;
  outlookText: string;
  isPublished: boolean;
  updatedAt?: string;
}

export default function WeeklyHoroscopesPage() {
  const [items, setItems] = useState<WeeklyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [zodiacFilter, setZodiacFilter] = useState<string>("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("pageSize", "48");
      if (zodiacFilter) params.set("zodiacSign", zodiacFilter);
      const res = await api.get<WeeklyRow[]>(`/admin/weekly-horoscopes?${params}`);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [zodiacFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const togglePublish = async (id: string, isPublished: boolean) => {
    await api.patch(`/admin/weekly-horoscopes/${id}/publish`, { isPublished });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this weekly horoscope?")) return;
    await api.delete(`/admin/weekly-horoscopes/${id}`);
    load();
  };

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col text-slate-100">
      <header className="mb-6 flex flex-col gap-4 border-b border-purple-900/40 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-bold">Weekly horoscopes</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            One draft per sign per UTC week (Monday start). Publish to expose on the site weekly
            block.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={zodiacFilter}
            onChange={(e) => setZodiacFilter(e.target.value)}
            className="rounded-xl border border-purple-500/30 bg-muted/60 px-3 py-2 text-sm"
          >
            <option value="">All signs</option>
            {ZODIAC_SIGNS.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => load()}
            className="rounded-full border border-purple-500/30 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-purple-900/40"
          >
            Refresh
          </button>
          <Link
            href="/horoscopes/weekly/generate"
            className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:opacity-90"
          >
            <span className="material-symbols-outlined text-sm">auto_fix_high</span>
            Generate weekly
          </Link>
        </div>
      </header>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No weekly rows yet. Use <strong>Generate weekly</strong> for the current UTC week (or pick
          a week on that screen).
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-purple-900/40">
          <table className="min-w-full text-sm">
            <thead className="bg-purple-900/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Week start (UTC)</th>
                <th className="px-4 py-3">Sign</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((w) => (
                <tr key={w.id} className="border-t border-purple-900/40">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {dayjs(w.weekStartDate).format("MMM D, YYYY")}
                  </td>
                  <td className="px-4 py-3 font-medium">{w.zodiacSign}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">
                    {w.title || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${w.isPublished ? "bg-emerald-500/20 text-emerald-300" : "bg-yellow-500/15 text-yellow-200"}`}
                    >
                      {w.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => togglePublish(w.id, !w.isPublished)}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        {w.isPublished ? "Unpublish" : "Publish"}
                      </button>
                      <Link
                        href={`/horoscopes/weekly/${w.id}`}
                        className="text-xs font-bold text-purple-300 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(w.id)}
                        className="text-xs font-bold text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
