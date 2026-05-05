import type { Metadata } from "next";
import { site } from "@/src/content/site";
import { ZodiacGrid } from "@/src/components/horoscope/ZodiacGrid";

export const metadata: Metadata = {
  title: "Free daily horoscopes",
  description: `Pick your zodiac sign to read today's free daily horoscope on ${site.name}. Switch between yesterday, today, and tomorrow, with Love, Career, and Health. Entertainment only.`,
  alternates: {
    canonical: "/horoscope",
  },
  openGraph: {
    title: `Free daily horoscopes | ${site.name}`,
    description: `Pick your zodiac sign to read today's free daily horoscope on ${site.name}.`,
    url: `${site.metadataBaseUrl.replace(/\/+$/, "")}/horoscope`,
    type: "website",
  },
};

export default function HoroscopeIndexPage() {
  return (
    <main className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 sm:pb-24 sm:pt-28 md:pt-32 text-on-surface">
      <header className="mb-8 text-center sm:mb-12">
        <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl md:text-5xl">
          Free Daily Horoscopes
        </h1>
        <p className="mt-2 font-headline text-xs font-bold uppercase tracking-[0.2em] text-primary sm:mt-3 sm:text-sm sm:tracking-[0.24em]">
          Choose your zodiac sign
        </p>
        <p className="mx-auto mt-3 max-w-2xl px-1 text-sm leading-relaxed text-on-surface-variant sm:mt-4 sm:text-base">
          Tap a sign to read today&apos;s forecast — flip between yesterday, today,
          and tomorrow, with Love, Career, and Health in one calm view.
        </p>
      </header>

      <ZodiacGrid />
    </main>
  );
}
