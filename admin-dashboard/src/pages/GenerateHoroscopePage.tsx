import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../services/api";
import type { ZodiacSign } from "../types";
import { Button, Card, Input, TextArea } from "../components/ui";

const schema = z.object({
  zodiacSign: z.string().optional(),
  // react-hook-form sends "on" / "true" for checkboxes by default
  allZodiacs: z
    .preprocess(
      (val) => val === "on" || val === "true" || val === true,
      z.boolean(),
    )
    .optional(),
  date: z.string().min(1, "Date is required"),
  // Optional extra notes; backend already has full prompt logic so this is not required
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

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

interface GeneratedPreview {
  zodiacSign: ZodiacSign;
  title: string;
  summary: string;
  wealthText: string;
  loveText: string;
  healthText: string;
  weeklyOutlook?: string;
}

export const GenerateHoroscopePage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      allZodiacs: true,
    },
  });

  const [previews, setPreviews] = useState<GeneratedPreview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | "ALL">("ALL");
  const [selectedDetail, setSelectedDetail] = useState<GeneratedPreview | null>(null);

  const onSubmit = async (values: FormValues) => {
    setError(null);
    setPreviews([]);
    setIsGenerating(true);
    try {
      const res = await api.post("/admin/horoscopes/generate", values);
      const generated: GeneratedPreview[] = res.data.data ?? [];
      setPreviews(generated);

      // Immediately persist generated horoscopes as published entries
      await Promise.all(
        generated.map((p) =>
          api.post("/admin/horoscopes", {
            zodiacSign: p.zodiacSign,
            date: values.date,
            title: p.title,
            summary: p.summary,
            wealthText: p.wealthText,
            loveText: p.loveText,
            healthText: p.healthText,
            wealthConfidence: 80,
            loveConfidence: 80,
            healthConfidence: 80,
            weeklyOutlook: p.weeklyOutlook,
            isPublished: true,
          }),
        ),
      );
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message ??
          "Failed to generate horoscopes. Please try again.",
      );
    }
    setIsGenerating(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Generate horoscopes
        </h1>
        <p className="text-sm text-muted-foreground">
          Draft multiple sign-specific entries using the mock generator.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wide">
                Zodiac sign
              </label>
              <select
                className="rounded-xl bg-muted/60 border border-purple-500/30 px-3 py-2 text-sm"
                {...register("zodiacSign")}
                disabled={watch("allZodiacs")}
              >
                <option value="">Select one</option>
                {zodiacOptions.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
              {errors.zodiacSign && (
                <p className="text-xs text-red-400">
                  {errors.zodiacSign.message}
                </p>
              )}
            </div>
            <div className="space-y-1 flex flex-col justify-end">
              <label className="inline-flex items-center gap-2 text-xs">
                <input type="checkbox" {...register("allZodiacs")} />
                Generate for all zodiac signs
              </label>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wide">
                Date
              </label>
              <Input
                type="date"
                className="bg-white text-black"
                {...register("date")}
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}

          <Button type="submit" disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate"}
          </Button>
        </form>
      </Card>

      {previews.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Generated previews</h2>
            <select
              className="rounded-xl bg-muted/60 border border-purple-500/30 px-3 py-2 text-xs"
              value={selectedSign}
              onChange={(e) => setSelectedSign(e.target.value as any)}
            >
              <option value="ALL">All signs</option>
              {zodiacOptions.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {previews
              .filter((p) => selectedSign === "ALL" || p.zodiacSign === selectedSign)
              .map((p) => (
                <Card
                  key={p.zodiacSign}
                  className="p-4 space-y-2 cursor-pointer transition hover:border-purple-500/60 hover:bg-muted/40"
                  onClick={() => setSelectedDetail(p)}
                >
                  <p className="text-xs text-muted-foreground">
                    {p.zodiacSign} • {watch("date")}
                  </p>
                  <p className="text-sm font-semibold">{p.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {p.summary}
                  </p>
                  <p className="text-xs text-purple-400 pt-1">View full details →</p>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* Detailed horoscope view modal */}
      {selectedDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelectedDetail(null)}
        >
          <div
            className="bg-background border border-purple-500/30 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-purple-500/20 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-semibold">
                {selectedDetail.zodiacSign} • {watch("date")}
              </h3>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground text-2xl leading-none"
                onClick={() => setSelectedDetail(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                  Title
                </p>
                <p className="text-lg font-semibold">{selectedDetail.title}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                  Summary
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedDetail.summary}
                </p>
              </div>
              <div className="grid gap-4">
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <p className="text-xs font-medium uppercase tracking-wide text-purple-400 mb-2">
                    Wealth
                  </p>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedDetail.wealthText || "—"}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/20">
                  <p className="text-xs font-medium uppercase tracking-wide text-pink-400 mb-2">
                    Love
                  </p>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedDetail.loveText || "—"}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs font-medium uppercase tracking-wide text-emerald-400 mb-2">
                    Health
                  </p>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedDetail.healthText || "—"}
                  </p>
                </div>
              </div>
              {selectedDetail.weeklyOutlook && (
                <div className="p-4 rounded-xl bg-muted/60 border border-purple-500/20">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                    Weekly outlook
                  </p>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedDetail.weeklyOutlook}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

