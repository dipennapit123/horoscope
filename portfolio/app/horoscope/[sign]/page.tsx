import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  site,
  zodiacSigns,
  getZodiacBySlug,
} from "@/src/content/site";
import { HoroscopeReader } from "@/src/components/horoscope/HoroscopeReader";
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
  const description = `Free ${z.label} daily horoscope in the ${site.name} app. Read today's forecast, switch between yesterday and tomorrow, and explore Love, Career, and Health.`;
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
    <main className="relative z-10 mx-auto max-w-3xl px-4 pb-16 pt-24 lg:max-w-4xl sm:px-6 sm:pb-24 sm:pt-28 md:pt-32 text-on-surface">
      <p className="mb-6 sm:mb-8">
        <Link
          href="/horoscope"
          className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-on-surface-variant touch-manipulation transition-colors hover:text-primary"
        >
          <span aria-hidden>&larr;</span> Back to all signs
        </Link>
      </p>

      <HoroscopeReader sign={z} />

      <section className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4 text-center sm:mt-16 sm:rounded-3xl sm:p-8">
        <h2 className="font-headline text-xl font-bold text-on-surface sm:text-2xl md:text-3xl">
          Get the full experience
        </h2>
        <p className="mx-auto mt-2 max-w-xl px-1 text-sm leading-relaxed text-on-surface-variant sm:text-base">
          Read your sign every day in the {site.name} app — calm UI, gentle reminders,
          and your forecast saved for later.
        </p>

        {/* Combined phone screenshots — stack on narrow phones, side-by-side from sm */}
        <div className="relative mx-auto mt-6 flex max-w-xl flex-col items-center gap-8 sm:mt-8 sm:flex-row sm:items-end sm:justify-center sm:gap-6">
          <div className="w-[min(72vw,260px)] -rotate-3 transition-transform duration-300 sm:w-[46%] sm:max-w-none sm:-rotate-6 sm:hover:rotate-0">
            <Image
              src="/promo/app-splash.png"
              alt={`${site.name} app splash with zodiac wheel`}
              width={488}
              height={1024}
              className="h-auto w-full drop-shadow-2xl"
              unoptimized
              sizes="(max-width: 640px) 72vw, 230px"
            />
          </div>
          <div className="w-[min(72vw,260px)] rotate-3 transition-transform duration-300 sm:w-[46%] sm:max-w-none sm:translate-y-4 sm:rotate-6 sm:hover:translate-y-0 sm:hover:rotate-0">
            <Image
              src="/promo/app-reading.png"
              alt={`${site.name} app horoscope reading screen`}
              width={488}
              height={1024}
              className="h-auto w-full drop-shadow-2xl"
              unoptimized
              sizes="(max-width: 640px) 72vw, 230px"
            />
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-md sm:mt-8">
          <StoreBadgeButtons />
        </div>
      </section>
    </main>
  );
}
