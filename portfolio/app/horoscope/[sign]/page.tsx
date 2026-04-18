import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  site,
  zodiacSigns,
  getZodiacBySlug,
} from "@/src/content/site";
import { StoreBadgeButtons } from "@/src/components/StoreBadgeButtons";

type PageProps = {
  params: Promise<{ sign: string }>;
};

export function generateStaticParams() {
  return zodiacSigns.map((z) => ({ sign: z.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { sign } = await params;
  const z = getZodiacBySlug(sign);
  if (!z) {
    return {};
  }
  const signLower = z.label.toLowerCase();
  const title = `${z.label} daily horoscope`;
  const description = `Free ${z.label} daily horoscope in the ${site.name} app. Read today’s forecast, switch between yesterday and tomorrow, and explore love, wealth, and health—entertainment only.`;
  const keywords = [
    `${signLower} horoscope`,
    `${signLower} daily horoscope`,
    "daily horoscope",
    "free daily horoscope",
    "free horoscope app",
  ];
  const origin = site.metadataBaseUrl.replace(/\/+$/, "");
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/horoscope/${z.slug}`,
    },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: `${origin}/horoscope/${z.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
    },
  };
}

export default async function HoroscopeSignPage({ params }: PageProps) {
  const { sign } = await params;
  const z = getZodiacBySlug(sign);
  if (!z) {
    notFound();
  }

  return (
    <main className="relative z-10 mx-auto max-w-3xl px-6 pb-24 pt-32 text-on-surface">
      <p className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
        >
          <span aria-hidden>←</span> Back to Home
        </Link>
      </p>

      <h1 className="font-headline text-4xl font-extrabold tracking-tight text-white md:text-5xl">
        {z.label} daily horoscope
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-on-surface-variant">
        Looking for a <strong className="text-on-surface">free daily horoscope</strong>{" "}
        for {z.label}? {site.name} delivers a calm reading for your sign—flip between
        yesterday, today, and tomorrow, with love, wealth, and health in one place.
        Entertainment only.
      </p>

      <div className="mt-10 max-w-md">
        <StoreBadgeButtons />
      </div>

      <section className="mt-16">
        <h2 className="mb-4 font-headline text-lg font-bold text-primary">
          More zodiac signs
        </h2>
        <ul className="flex flex-wrap gap-2">
          {zodiacSigns.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/horoscope/${item.slug}`}
                className="inline-block rounded-full border border-white/10 bg-black px-3 py-1.5 text-sm text-on-surface-variant transition-colors hover:border-primary/50 hover:text-primary"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
