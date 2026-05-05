"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import dayjs from "dayjs";
import { api } from "@/lib/api-client";

interface Weekly {
  id: string;
  zodiacSign: string;
  weekStartDate: string;
  title: string;
  outlookText: string;
  isPublished: boolean;
}

export default function WeeklyEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [row, setRow] = useState<Weekly | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [outlookText, setOutlookText] = useState("");

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await api.get<Weekly>(`/admin/weekly-horoscopes/${id}`);
        if (cancelled) return;
        const w = res.data;
        setRow(w);
        setTitle(w.title ?? "");
        setOutlookText(w.outlookText ?? "");
      } catch {
        if (!cancelled) setRow(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await api.patch(`/admin/weekly-horoscopes/${id}`, {
        title: title.trim(),
        outlookText: outlookText.trim(),
      });
      router.push("/horoscopes/weekly");
    } finally {
      setSaving(false);
    }
  };

  if (!id) {
    router.replace("/horoscopes/weekly");
    return null;
  }
  if (loading) return <div className="text-slate-400">Loading…</div>;
  if (!row) return <div className="text-slate-400">Weekly horoscope not found.</div>;

  return (
    <div className="mx-auto max-w-2xl space-y-6 text-slate-100">
      <Link href="/horoscopes/weekly" className="text-sm text-purple-400 hover:text-purple-300">
        ← Weekly horoscopes
      </Link>
      <h1 className="text-2xl font-semibold">
        Edit weekly · {row.zodiacSign} · week of{" "}
        {dayjs(row.weekStartDate).format("MMM D, YYYY")}
      </h1>
      <p className="text-xs text-muted-foreground">
        Status:{" "}
        <span className={row.isPublished ? "text-emerald-400" : "text-yellow-300"}>
          {row.isPublished ? "Published" : "Draft"}
        </span>
        . Use the list page to publish or unpublish.
      </p>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-purple-500/30 bg-purple-900/10 px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Outlook</label>
          <textarea
            value={outlookText}
            onChange={(e) => setOutlookText(e.target.value)}
            rows={10}
            className="mt-1 w-full rounded-lg border border-purple-500/30 bg-purple-900/10 px-3 py-2"
          />
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-primary px-4 py-2 font-medium hover:bg-purple-500 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
