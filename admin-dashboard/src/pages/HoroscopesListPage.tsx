import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { api } from "../services/api";
import type { Horoscope, ZodiacSign } from "../types";

dayjs.extend(relativeTime);

const zodiacOptions: ZodiacSign[] = [
  "ARIES",
  "TAURUS",
  "GEMINI",
  "CANCER",
  "LEO",
  "VIRGO",
  "LIBRA",
  "SCORPIO",
  "SAGITTARIUS",
  "CAPRICORN",
  "AQUARIUS",
  "PISCES",
];

const zodiacInitial: Record<ZodiacSign, string> = {
  ARIES: "A",
  TAURUS: "T",
  GEMINI: "G",
  CANCER: "C",
  LEO: "L",
  VIRGO: "V",
  LIBRA: "L",
  SCORPIO: "S",
  SAGITTARIUS: "S",
  CAPRICORN: "C",
  AQUARIUS: "A",
  PISCES: "P",
};

type StatusFilter = "all" | "draft" | "published";

const PAGE_SIZE = 12;

export const HoroscopesListPage = () => {
  const [items, setItems] = useState<Horoscope[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [zodiacFilter, setZodiacFilter] = useState<ZodiacSign | "">("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [viewingHoroscope, setViewingHoroscope] = useState<Horoscope | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [aiDate, setAiDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [aiZodiac, setAiZodiac] = useState<ZodiacSign | "">("");
  const [aiTone, setAiTone] = useState<"mystical" | "modern" | "friendly" | "premium">("mystical");
  const [aiNotes, setAiNotes] = useState("");
  const [generating, setGenerating] = useState(false);
  const [recentGenerations, setRecentGenerations] = useState<{ label: string; tone: string; when: string }[]>([]);

  const load = async () => {
    setLoading(true);
    try {
      const isPublished =
        statusFilter === "all"
          ? undefined
          : statusFilter === "published";
      const res = await api.get("/admin/horoscopes", {
        params: {
          search: search || undefined,
          zodiacSign: zodiacFilter || undefined,
          date: dateFilter || undefined,
          isPublished,
          page,
          pageSize: PAGE_SIZE,
        },
      });
      const data = res.data.data;
      const list = Array.isArray(data) ? data : [];
      setItems(list);
      setTotal(list.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [page, statusFilter]);

  const handleApplyFilters = () => {
    setPage(1);
    void load();
  };

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    await api.patch(`/admin/horoscopes/${id}/publish`, { isPublished });
    void load();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this horoscope?")) return;
    await api.delete(`/admin/horoscopes/${id}`);
    void load();
  };

  const handleGenerateFromPanel = async () => {
    setGenerating(true);
    try {
      const res = await api.post("/admin/horoscopes/generate", {
        date: aiDate,
        zodiacSign: aiZodiac || undefined,
        allZodiacs: !aiZodiac,
        tone: aiTone,
        notes: aiNotes || undefined,
      });
      const generated = res.data?.data ?? [];
      if (Array.isArray(generated) && generated.length > 0) {
        await Promise.all(
          generated.map((p: { zodiacSign: ZodiacSign; title: string; summary: string; wealthText: string; loveText: string; healthText: string; weeklyOutlook?: string }) =>
            api.post("/admin/horoscopes", {
              zodiacSign: p.zodiacSign,
              date: aiDate,
              title: p.title,
              summary: p.summary,
              wealthText: p.wealthText,
              loveText: p.loveText,
              healthText: p.healthText,
              wealthConfidence: 80,
              loveConfidence: 80,
              healthConfidence: 80,
              weeklyOutlook: p.weeklyOutlook,
              isPublished: false,
            }),
          ),
        );
      }
      setRecentGenerations((prev) => [
        { label: `${aiDate} – ${aiZodiac ? aiZodiac : "All signs"}`, tone: aiTone, when: "Just now" },
        ...prev.slice(0, 4),
      ]);
      void load();
    } catch {
      // silent; could add toast
    }
    setGenerating(false);
  };

  const start = items.length ? (page - 1) * PAGE_SIZE + 1 : 0;
  const end = (page - 1) * PAGE_SIZE + items.length;
  const hasMore = items.length >= PAGE_SIZE;

  return (
    <div className="flex min-h-0 flex-1 min-w-0">
      <div className="min-w-0 flex-1 text-slate-100">
      {/* Header */}
      <header className="mb-6 flex flex-col gap-4 border-b border-purple-900/40 pb-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-bold">Horoscopes</h2>
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block md:w-64">
            <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
              placeholder="Search entries..."
              className="w-full rounded-full bg-purple-950/40 py-2 pl-10 pr-4 text-sm outline-none ring-1 ring-purple-900/60 placeholder:text-slate-500 focus:ring-primary/70"
            />
          </div>
          <Link
            to="/generate"
            className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:opacity-90"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Create New
          </Link>
        </div>
      </header>

      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-full border border-purple-900/60 bg-purple-950/40 px-3 py-1.5">
            <span className="material-symbols-outlined mr-2 text-sm text-slate-400">
              calendar_today
            </span>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-28 border-none bg-transparent p-0 text-sm text-slate-200 outline-none"
            />
          </div>
          <select
            value={zodiacFilter}
            onChange={(e) => setZodiacFilter((e.target.value || "") as ZodiacSign | "")}
            className="min-w-[140px] appearance-none rounded-full border border-purple-900/60 bg-purple-950/40 px-4 py-1.5 text-sm text-slate-200 outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Zodiacs</option>
            {zodiacOptions.map((z) => (
              <option key={z} value={z}>
                {z.charAt(0) + z.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          <div className="mx-1 h-6 w-px bg-purple-900/40" />
          <div className="flex rounded-full bg-purple-900/30 p-1">
            {(["all", "draft", "published"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`rounded-full px-4 py-1 text-xs font-bold capitalize transition-colors ${
                  statusFilter === s
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-400 hover:text-primary"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <Link
          to="/generate"
          className="flex items-center gap-2 rounded-full border border-primary bg-primary/10 px-4 py-2 text-sm font-bold text-primary transition-all hover:bg-primary hover:text-white"
        >
          <span className="material-symbols-outlined text-sm">auto_fix_high</span>
          Generate with AI
        </Link>
      </div>

      {/* Apply filters */}
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => {
            setSearch("");
            setZodiacFilter("");
            setDateFilter("");
            setStatusFilter("all");
            setPage(1);
          }}
          className="rounded-full border border-purple-500/50 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-purple-900/40"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={handleApplyFilters}
          className="rounded-full bg-primary/20 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white"
        >
          Apply
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-purple-900/60 bg-purple-950/40 shadow-lg shadow-purple-950/30">
        {loading ? (
          <div className="space-y-3 p-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-14 w-full animate-pulse rounded-lg bg-purple-900/40"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">
            No horoscopes found for the current filters.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-purple-900/60 bg-purple-950/60 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Zodiac Sign</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Last Edited</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/40">
                  {items.map((h) => (
                    <tr
                      key={h.id}
                      className="transition-colors hover:bg-purple-900/30"
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {dayjs(h.date).format("MMM D, YYYY")}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
                            {zodiacInitial[h.zodiacSign]}
                          </span>
                          <span className="text-sm font-medium">
                            {h.zodiacSign.charAt(0) + h.zodiacSign.slice(1).toLowerCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">{h.title}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                            h.isPublished
                              ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-400"
                              : "border-slate-500/30 bg-slate-500/20 text-slate-400"
                          }`}
                        >
                          {h.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                        {dayjs(h.updatedAt).fromNow()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex justify-end gap-3 text-xs font-bold text-primary">
                          <Link
                            to={`/horoscopes/${h.id}`}
                            className="hover:underline"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => setViewingHoroscope(h)}
                            className="hover:underline"
                          >
                            Preview
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTogglePublish(h.id, !h.isPublished)}
                            className="hover:underline"
                          >
                            {h.isPublished ? "Unpublish" : "Publish"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(h.id)}
                            className="text-red-400 hover:underline"
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

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-purple-900/40 bg-purple-950/60 px-6 py-4">
              <span className="text-xs text-slate-500">
                Showing {start} to {end}
                {hasMore ? "+" : ""} of {hasMore ? "many" : end} entries
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-purple-900/60 text-slate-400 transition-colors hover:text-primary disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">
                    chevron_left
                  </span>
                </button>
                <span className="flex h-8 min-w-[2rem] items-center justify-center rounded-full bg-primary px-2 text-xs font-bold text-white">
                  {page}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasMore}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-purple-900/60 text-slate-400 transition-colors hover:text-primary disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      </div>
      {/* Right panel: AI Assistant */}
      {panelOpen && (
        <aside className="w-80 shrink-0 overflow-y-auto border-l border-purple-900/40 bg-[#0d0618]/80 custom-scrollbar">
          <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-base font-bold">
                <span className="material-symbols-outlined text-primary">auto_fix_high</span>
                AI Assistant
              </h3>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="text-slate-400 transition-colors hover:text-slate-200"
                aria-label="Close panel"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select Date
                </label>
                <div className="flex items-center rounded-xl border border-purple-900/60 bg-purple-950/40 px-4 py-2.5">
                  <span className="material-symbols-outlined mr-2 text-sm text-slate-400">event</span>
                  <input
                    type="date"
                    value={aiDate}
                    onChange={(e) => setAiDate(e.target.value)}
                    className="w-full border-none bg-transparent p-0 text-sm text-slate-200 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Zodiac Sign
                </label>
                <select
                  value={aiZodiac}
                  onChange={(e) => setAiZodiac((e.target.value || "") as ZodiacSign | "")}
                  className="w-full appearance-none rounded-xl border border-purple-900/60 bg-purple-950/40 px-4 py-2.5 text-sm text-slate-200 outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">All 12 signs</option>
                  {zodiacOptions.map((z) => (
                    <option key={z} value={z}>
                      {z.charAt(0) + z.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Content Tone
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["mystical", "modern", "friendly", "premium"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setAiTone(t)}
                      className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold capitalize transition-colors ${
                        aiTone === t
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-purple-900/60 text-slate-400 hover:border-primary/40"
                      }`}
                    >
                      {t === "mystical" && <span className="material-symbols-outlined text-xs">auto_awesome</span>}
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Context & Notes
                </label>
                <textarea
                  value={aiNotes}
                  onChange={(e) => setAiNotes(e.target.value)}
                  placeholder="Mention lunar eclipse, focus on career growth or relationship stability..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-purple-900/60 bg-purple-950/40 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleGenerateFromPanel}
                  disabled={generating}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-white shadow-xl shadow-primary/25 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
                >
                  <span className="material-symbols-outlined">bolt</span>
                  {generating ? "Generating…" : "Generate Horoscopes"}
                </button>
                <p className="mt-4 text-center text-[10px] leading-relaxed text-slate-500">
                  AI will generate horoscopes for all 12 signs based on the selected tone and planetary context for the date.
                </p>
              </div>
            </div>
            <div className="mt-8 border-t border-purple-900/40 pt-8">
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                Recent Generations
              </h4>
              <div className="space-y-3">
                {recentGenerations.length === 0 ? (
                  <p className="text-[10px] text-slate-500">No generations yet.</p>
                ) : (
                  recentGenerations.map((r, i) => (
                    <div
                      key={i}
                      className="cursor-pointer rounded-xl border border-transparent bg-purple-950/40 p-3 transition-colors hover:border-primary/20"
                    >
                      <p className="mb-1 text-xs font-bold">{r.label}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>Tone: {r.tone}</span>
                        <span>{r.when}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </aside>
      )}

      {!panelOpen && (
        <button
          type="button"
          onClick={() => setPanelOpen(true)}
          className="fixed right-4 top-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-primary/20 text-primary shadow-lg hover:bg-primary/30"
          aria-label="Open AI Assistant"
        >
          <span className="material-symbols-outlined">auto_fix_high</span>
        </button>
      )}

      {/* Preview modal */}
      {viewingHoroscope && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setViewingHoroscope(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-purple-500/30 bg-purple-950/95 shadow-xl flex"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-purple-500/20 p-4">
              <h3 className="text-lg font-semibold">
                {viewingHoroscope.zodiacSign} •{" "}
                {dayjs(viewingHoroscope.date).format("MMM D, YYYY")}
              </h3>
              <button
                type="button"
                className="text-2xl leading-none text-slate-400 hover:text-white"
                onClick={() => setViewingHoroscope(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="space-y-6 overflow-y-auto p-6">
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Title
                </p>
                <p className="text-lg font-semibold">{viewingHoroscope.title}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Summary
                </p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
                  {viewingHoroscope.summary}
                </p>
              </div>
              <div className="grid gap-4">
                <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-purple-400">
                    Wealth
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {viewingHoroscope.wealthText || "—"}
                  </p>
                </div>
                <div className="rounded-xl border border-pink-500/20 bg-pink-500/10 p-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-pink-400">
                    Love
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {viewingHoroscope.loveText || "—"}
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-emerald-400">
                    Health
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {viewingHoroscope.healthText || "—"}
                  </p>
                </div>
              </div>
              {viewingHoroscope.weeklyOutlook && (
                <div className="rounded-xl border border-purple-500/20 bg-purple-900/30 p-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                    Weekly outlook
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {viewingHoroscope.weeklyOutlook}
                  </p>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    viewingHoroscope.isPublished
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-yellow-500/10 text-yellow-400"
                  }`}
                >
                  {viewingHoroscope.isPublished ? "Published" : "Draft"}
                </span>
                <Link
                  to={`/horoscopes/${viewingHoroscope.id}`}
                  className="rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary hover:bg-primary hover:text-white"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
