import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/src/content/site";

export const metadata: Metadata = {
  title: "Screenshots",
  description: `Screenshots and UI gallery for ${site.name}.`,
  alternates: {
    canonical: "/screenshots",
  },
};

export default function ScreenshotsPage() {
  return (
    <main className="relative z-10 overflow-x-hidden pb-24 pt-32">
      {/* Background decoration (Stitch screenshots page) */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="cosmic-particle absolute"
          style={{ width: 2, height: 2, top: "15%", left: "10%" }}
        />
        <div
          className="cosmic-particle absolute"
          style={{ width: 1, height: 1, top: "45%", left: "85%" }}
        />
        <div
          className="cosmic-particle absolute"
          style={{ width: 3, height: 3, top: "75%", left: "25%" }}
        />
        <div
          className="cosmic-particle absolute"
          style={{ width: 2, height: 2, top: "25%", left: "65%" }}
        />
        <div
          className="cosmic-particle absolute"
          style={{ width: 1, height: 1, top: "85%", left: "75%" }}
        />
        <div className="absolute right-[-10%] top-[-20%] h-[600px] w-[600px] opacity-50 nebula-glow" />
        <div className="absolute bottom-[-10%] left-[-5%] h-[400px] w-[400px] opacity-30 nebula-glow" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        <header className="mb-20 text-center md:text-left">
          <div className="mb-6 inline-block rounded-full bg-surface-container-high px-4 py-1 font-headline text-xs font-extrabold uppercase tracking-widest text-primary">
            Visual Journey
          </div>
          <h1 className="mb-6 font-headline text-5xl font-extrabold leading-none tracking-tighter text-on-surface md:text-7xl">
            A Glimpse into <br />
            <span className="bg-linear-to-r from-primary to-on-primary-container bg-clip-text text-transparent">
              the Stars
            </span>
          </h1>
          <p className="max-w-2xl font-body text-lg leading-relaxed text-on-surface-variant">
            Explore the intuitive interface and cosmic aesthetics of {site.name}.
            Designed for depth, built for your digital celestial lifestyle.
          </p>
        </header>

        <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-2">
          {site.screenshotGallery.map((item, index) => {
            const wide = item.width > item.height;
            return (
              <div
                key={item.src}
                className={`group flex flex-col gap-6 ${wide ? "md:col-span-2" : ""}`}
              >
                <div
                  className={
                    wide
                      ? "relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-xl"
                      : "phone-frame relative w-full bg-black"
                  }
                  style={{
                    aspectRatio: `${item.width} / ${item.height}`,
                  }}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes={
                      wide
                        ? "(max-width: 768px) 100vw, 896px"
                        : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                    }
                    className="object-contain"
                    priority={index < 2}
                    unoptimized
                  />
                </div>
                <div className={wide ? "px-0 md:px-4" : "px-4"}>
                  <h2 className="mb-2 font-headline text-xl font-bold text-on-surface">
                    {item.title}
                  </h2>
                  <p className="text-sm leading-snug text-on-surface-variant">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <section className="relative mt-32 overflow-hidden rounded-2xl border border-white/10 bg-black p-12">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-20">
            <div className="h-full w-full bg-linear-to-l from-primary/30 to-transparent" />
          </div>
          <div className="relative z-10 max-w-xl">
            <h2 className="mb-4 font-headline text-3xl font-extrabold text-on-surface">
              Ready to reach for the stars?
            </h2>
            <p className="mb-8 font-body text-on-surface-variant">
              Download {site.name} today and begin your journey through the
              celestial digital landscape.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={site.storeLinks.ios}
                className="rounded-full bg-linear-to-br from-primary to-primary-container px-8 py-3 font-headline font-extrabold text-on-primary-fixed shadow-lg shadow-primary/10 transition-all hover:opacity-90"
              >
                App Store
              </a>
              <a
                href={site.storeLinks.android}
                className="rounded-full border border-outline-variant/30 px-8 py-3 font-headline font-extrabold text-primary transition-all hover:bg-surface-container-high"
              >
                Play Store
              </a>
              <Link
                href="/demo"
                className="inline-flex items-center rounded-full border border-outline-variant/30 px-8 py-3 font-headline font-extrabold text-on-surface-variant transition-all hover:border-primary/40 hover:text-primary"
              >
                Watch demo
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
