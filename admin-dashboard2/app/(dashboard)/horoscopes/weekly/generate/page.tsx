"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
import { api } from "@/lib/api-client";
import { Card, Button, Input } from "@/components/ui";
import type { ZodiacSign } from "@/lib/types";

const schema = z.object({
  weekStartDate: z.string().min(1, "Week is required"),
  allZodiacs: z.boolean().optional(),
  zodiacSign: z.string().optional(),
  notes: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

const ZODIAC_OPTIONS: ZodiacSign[] = [
  "ARIES", "TAURUS", "GEMINI", "CANCER", "LEO", "VIRGO",
  "LIBRA", "SCORPIO", "SAGITTARIUS", "CAPRICORN", "AQUARIUS", "PISCES",
];

interface WeeklyGenerated {
  id: string;
  zodiacSign: string;
  weekStartDate: string;
  title: string;
  outlookText: string;
  isPublished: boolean;
}

export default function GenerateWeeklyPage() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { weekStartDate: "", allZodiacs: true },
  });

  useEffect(() => {
    const monday = dayjs.utc().day(1);
    setValue("weekStartDate", monday.format("YYYY-MM-DD"));
  }, [setValue]);

  const [previews, setPreviews] = useState<WeeklyGenerated[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSign, setSelectedSign] = useState<string>("ALL");
  const [selected, setSelected] = useState<WeeklyGenerated | null>(null);

  const onSubmit = async (values: FormValues) => {
    setError(null);
    setPreviews([]);
    setIsGenerating(true);
    try {
      const res = await api.post<WeeklyGenerated[]>("/admin/weekly-horoscopes/generate", {
        weekStartDate: values.weekStartDate,
        allZodiacs: values.allZodiacs ?? true,
        zodiacSign: values.zodiacSign || undefined,
        notes: values.notes || undefined,
      });
      setPreviews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate weekly horoscopes.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Generate weekly</h1>
          <p className="text-sm text-muted-foreground">
            One outlook per sign for the UTC week that contains the date you pick (week anchored on
            Monday UTC).
          </p>
        </div>
        <Link
          href="/horoscopes/weekly"
          className="text-sm text-purple-400 hover:text-purple-300"
        >
          ← Weekly list
        </Link>
      </div>

      <Card className="space-y-4 p-6">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wide">Zodiac sign</label>
              <select
                className="w-full rounded-xl border border-purple-500/30 bg-muted/60 px-3 py-2 text-sm"
                {...register("zodiacSign")}
                disabled={watch("allZodiacs")}
              >
                <option value="">Select one</option>
                {ZODIAC_OPTIONS.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col justify-end space-y-1">
              <label className="inline-flex items-center gap-2 text-xs">
                <input type="checkbox" {...register("allZodiacs")} />
                All 12 signs
              </label>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wide">
                Week (any day in week, stored as Monday UTC)
              </label>
              <Input
                type="date"
                className="bg-white text-black"
                {...register("weekStartDate")}
              />
              {errors.weekStartDate && (
                <p className="text-xs text-red-400">{errors.weekStartDate.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wide">Notes (optional)</label>
            <textarea
              {...register("notes")}
              rows={2}
              className="w-full rounded-xl border border-purple-500/30 bg-muted/60 px-3 py-2 text-sm"
              placeholder="Tone hints, campaign angle…"
            />
          </div>
          {error && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}
          <Button type="submit" disabled={isGenerating}>
            {isGenerating ? "Generating…" : "Generate"}
          </Button>
        </form>
      </Card>

      {previews.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Results</h2>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Filter:</span>
            <select
              className="rounded-xl border border-purple-500/30 bg-muted/60 px-3 py-2 text-xs"
              value={selectedSign}
              onChange={(e) => setSelectedSign(e.target.value)}
            >
              <option value="ALL">All</option>
              {ZODIAC_OPTIONS.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {previews
              .filter((p) => selectedSign === "ALL" || p.zodiacSign === selectedSign)
              .map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelected(p)}
                  className="rounded-xl border border-purple-500/30 bg-muted/30 p-4 text-left transition hover:border-purple-500/60"
                >
                  <p className="text-xs text-muted-foreground">{p.zodiacSign}</p>
                  <p className="mt-1 font-semibold">{p.title}</p>
                  <p className="mt-2 line-clamp-3 text-xs text-muted-foreground">{p.outlookText}</p>
                  <p className="mt-2 text-xs text-purple-400">Draft · click to preview</p>
                </button>
              ))}
          </div>
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-purple-500/30 bg-background p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground">{selected.zodiacSign}</p>
                <h3 className="text-xl font-semibold">{selected.title}</h3>
              </div>
              <button
                type="button"
                className="text-2xl text-muted-foreground hover:text-foreground"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {selected.outlookText}
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                href={`/horoscopes/weekly/${selected.id}`}
                className="rounded-full bg-primary/20 px-4 py-2 text-sm font-bold text-primary hover:bg-primary hover:text-white"
              >
                Open editor
              </Link>
              <Link
                href="/horoscopes/weekly"
                className="rounded-full border border-purple-500/30 px-4 py-2 text-sm"
              >
                Weekly list
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
