import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../services/api";
import type { Horoscope, ZodiacSign } from "../types";
import { Button, Card, Input, TextArea } from "../components/ui";

const schema = z.object({
  zodiacSign: z.string(),
  date: z.string(),
  title: z.string(),
  summary: z.string(),
  wealthText: z.string(),
  loveText: z.string(),
  healthText: z.string(),
  wealthConfidence: z.coerce.number().min(0).max(100),
  loveConfidence: z.coerce.number().min(0).max(100),
  healthConfidence: z.coerce.number().min(0).max(100),
  wealthActionLabel: z.string().optional(),
  loveActionLabel: z.string().optional(),
  healthActionLabel: z.string().optional(),
  weeklyOutlook: z.string().optional(),
  isPublished: z.boolean().optional(),
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

interface Props {
  mode: "create" | "edit";
}

export const HoroscopeFormPage = ({ mode }: Props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(mode === "edit");
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      wealthConfidence: 80,
      loveConfidence: 80,
      healthConfidence: 80,
      isPublished: false,
    },
  });

  const handleGenerateWithAI = async () => {
    setGenerateError(null);

    const zodiacSign = watch("zodiacSign");
    const date = watch("date");

    if (!zodiacSign || !date) {
      setGenerateError(
        "Please select a zodiac sign and date before generating.",
      );
      return;
    }
    setGenerating(true);
    try {
      const res = await api.post("/admin/horoscopes/generate", {
        zodiacSign,
        date,
        tone: "premium",
      });

      const first = (res.data?.data ?? [])[0] as
        | {
            title: string;
            summary: string;
            wealthText: string;
            loveText: string;
            healthText: string;
            weeklyOutlook?: string;
          }
        | undefined;

      if (!first) {
        setGenerateError("AI did not return any content. Please try again.");
        return;
      }

      reset((current) => ({
        ...current,
        title: first.title,
        summary: first.summary,
        wealthText: first.wealthText,
        loveText: first.loveText,
        healthText: first.healthText,
        weeklyOutlook: first.weeklyOutlook ?? current.weeklyOutlook,
      }));
    } catch (err: any) {
      setGenerateError(
        err.response?.data?.error?.message ??
          "Failed to generate with AI. Please try again.",
      );
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (mode === "edit" && id) {
      const load = async () => {
        setLoading(true);
        const res = await api.get<{ success: boolean; data: Horoscope[] }>(
          "/admin/horoscopes",
          { params: { id } },
        );
        const found = res.data.data.find((h) => h.id === id);
        if (found) {
          reset({
            ...found,
            date: found.date.slice(0, 10),
          });
        }
        setLoading(false);
      };
      void load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, mode]);

  const onSubmit = async (values: FormValues) => {
    if (mode === "create") {
      await api.post("/admin/horoscopes", {
        ...values,
        zodiacSign: values.zodiacSign as ZodiacSign,
      });
    } else if (id) {
      await api.patch(`/admin/horoscopes/${id}`, values);
    }
    navigate("/horoscopes");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === "create" ? "Create horoscope" : "Edit horoscope"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Craft or refine the forecast before publishing.
          </p>
        </div>
      </div>

      <Card className="p-6 space-y-4">
        {loading ? (
          <div className="h-32 animate-pulse rounded-2xl bg-purple-900/30" />
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase tracking-wide">
                  Zodiac sign
                </label>
                <select
                  className="rounded-xl bg-muted/60 border border-purple-500/30 px-3 py-2 text-sm"
                  {...register("zodiacSign")}
                >
                  <option value="">Select</option>
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
              <div className="space-y-1 flex items-end">
                <label className="inline-flex items-center gap-2 text-xs">
                  <input type="checkbox" {...register("isPublished")} />
                  Publish immediately
                </label>
              </div>
            </div>

            {mode === "create" && (
              <div className="flex items-center justify-between rounded-2xl bg-purple-950/40 px-3 py-2 text-xs">
                <span className="text-muted-foreground">
                  Use Gemini to draft wealth, love, and health sections.
                </span>
                <Button
                  type="button"
                  disabled={generating}
                  className="px-3 py-1 text-xs"
                  onClick={handleGenerateWithAI}
                >
                  {generating ? "Generating…" : "Generate with AI"}
                </Button>
              </div>
            )}

            {generateError && (
              <p className="text-xs text-red-400">{generateError}</p>
            )}

            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wide">
                Title
              </label>
              <Input {...register("title")} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wide">
                Summary
              </label>
              <TextArea rows={3} {...(register("summary") as any)} />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2 rounded-2xl bg-purple-950/40 p-3">
                <p className="text-xs font-semibold text-emerald-300">Wealth</p>
                <TextArea rows={4} {...(register("wealthText") as any)} />
                <Input
                  type="number"
                  min={0}
                  max={100}
                  {...register("wealthConfidence")}
                />
                <Input
                  placeholder="Action label"
                  {...register("wealthActionLabel")}
                />
              </div>
              <div className="space-y-2 rounded-2xl bg-purple-950/40 p-3">
                <p className="text-xs font-semibold text-pink-300">Love</p>
                <TextArea rows={4} {...(register("loveText") as any)} />
                <Input
                  type="number"
                  min={0}
                  max={100}
                  {...register("loveConfidence")}
                />
                <Input
                  placeholder="Action label"
                  {...register("loveActionLabel")}
                />
              </div>
              <div className="space-y-2 rounded-2xl bg-purple-950/40 p-3">
                <p className="text-xs font-semibold text-sky-300">Health</p>
                <TextArea rows={4} {...(register("healthText") as any)} />
                <Input
                  type="number"
                  min={0}
                  max={100}
                  {...register("healthConfidence")}
                />
                <Input
                  placeholder="Action label"
                  {...register("healthActionLabel")}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wide">
                Weekly outlook
              </label>
              <TextArea rows={3} {...(register("weeklyOutlook") as any)} />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                className="bg-transparent border border-purple-500/40"
                onClick={() => navigate("/horoscopes")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {mode === "create" ? "Create" : "Save changes"}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

