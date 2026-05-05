"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api-client";
import type { ZodiacSign } from "@/lib/types";
import type { HoroscopeMoodBoard } from "@/lib/mood-board";
import { HoroscopeMoodGlance } from "@/components/HoroscopeMoodGlance";

const ZODIAC_SIGNS: ZodiacSign[] = [
  "ARIES", "TAURUS", "GEMINI", "CANCER", "LEO", "VIRGO",
  "LIBRA", "SCORPIO", "SAGITTARIUS", "CAPRICORN", "AQUARIUS", "PISCES",
];

interface Horoscope {
  id: string;
  zodiacSign: ZodiacSign;
  date: string;
  title: string;
  summary: string;
  wealthText: string;
  loveText: string;
  healthText: string;
  wealthConfidence: number;
  loveConfidence: number;
  healthConfidence: number;
  weeklyOutlook: string | null;
  moodBoard?: HoroscopeMoodBoard | null;
  isPublished: boolean;
}

export default function HoroscopeEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [h, setH] = useState<Horoscope | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<Horoscope>>({});

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get<Horoscope>(`/admin/horoscopes/${id}`);
        const found = res.data;
        if (found) {
          setH(found);
          setForm({
            title: found.title,
            summary: found.summary,
            wealthText: found.wealthText,
            loveText: found.loveText,
            healthText: found.healthText,
            wealthConfidence: found.wealthConfidence,
            loveConfidence: found.loveConfidence,
            healthConfidence: found.healthConfidence,
            weeklyOutlook: found.weeklyOutlook ?? "",
          });
        } else {
          setH(null);
        }
      } catch {
        setH(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSave = async () => {
    if (!id || !h) return;
    setSaving(true);
    try {
      await api.patch(`/admin/horoscopes/${id}`, {
        ...form,
        weeklyOutlook: form.weeklyOutlook || null,
      });
      router.push("/horoscopes/daily");
    } finally {
      setSaving(false);
    }
  };

  if (!id) {
    router.replace("/horoscopes/daily");
    return null;
  }
  if (loading) return <div className="text-slate-400">Loading...</div>;
  if (!h) return <div className="text-slate-400">Horoscope not found.</div>;

  return (
    <div className="space-y-6">
      <Link href="/horoscopes/daily" className="text-sm text-purple-400 hover:text-purple-300">
        ← Daily horoscopes
      </Link>
      <h1 className="text-2xl font-semibold">Edit: {h.zodiacSign} · {h.date}</h1>
      <HoroscopeMoodGlance
        moodBoard={h.moodBoard}
        loveConfidence={h.loveConfidence}
        wealthConfidence={h.wealthConfidence}
        healthConfidence={h.healthConfidence}
      />
      <p className="max-w-2xl text-xs text-muted-foreground">
        Mood board JSON is generated with each daily draft. To change headlines or vibes, re-run
        generation or PATCH the row via API with a <code className="rounded bg-muted px-1">moodBoard</code>{" "}
        object.
      </p>
      <div className="space-y-4 max-w-2xl">
        <div>
          <label className="text-sm font-medium">Title</label>
          <input
            value={form.title ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-purple-500/30 bg-purple-900/10 px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Summary</label>
          <textarea
            value={form.summary ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
            rows={2}
            className="mt-1 w-full rounded-lg border border-purple-500/30 bg-purple-900/10 px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Wealth</label>
          <textarea
            value={form.wealthText ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, wealthText: e.target.value }))}
            rows={2}
            className="mt-1 w-full rounded-lg border border-purple-500/30 bg-purple-900/10 px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Love</label>
          <textarea
            value={form.loveText ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, loveText: e.target.value }))}
            rows={2}
            className="mt-1 w-full rounded-lg border border-purple-500/30 bg-purple-900/10 px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Health</label>
          <textarea
            value={form.healthText ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, healthText: e.target.value }))}
            rows={2}
            className="mt-1 w-full rounded-lg border border-purple-500/30 bg-purple-900/10 px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Weekly outlook (optional, legacy)</label>
          <p className="mt-1 text-xs text-muted-foreground">
            Daily generation no longer fills this. Prefer clearing it unless you are backfilling old
            content. A separate weekly generator will publish week-level copy later.
          </p>
          <textarea
            value={form.weeklyOutlook ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, weeklyOutlook: e.target.value }))}
            rows={3}
            placeholder="Leave empty for daily-only rows"
            className="mt-2 w-full rounded-lg border border-purple-500/30 bg-purple-900/10 px-3 py-2"
          />
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-primary px-4 py-2 font-medium hover:bg-purple-500 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
