import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/src/content/site";
import { StoreBadgeButtons } from "@/src/components/StoreBadgeButtons";

export const metadata: Metadata = {
  title: {
    absolute: site.seo.homeTitle,
  },
  description: site.seo.homeDescription,
  alternates: {
    canonical: "/",
  },
};

const heroShowcase =
  site.screenshotGallery.find((s) => s.title === "Daily horoscope") ??
  site.screenshotGallery[0];

export default function Home() {
  return (
    <main className="relative z-10 pt-24">
      {/* Hero — high-contrast dark + store badges + single phone + floating callouts */}
      <section
        id="download"
        className="relative isolate scroll-mt-28 overflow-hidden bg-black px-6 py-16 text-white sm:px-8 sm:py-20 lg:py-28"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(225,182,255,0.12),transparent)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 flex flex-col items-center space-y-8 text-center lg:order-1 lg:items-start lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-black sm:text-xs">
              <span className="material-symbols-outlined text-lg text-black">
                bolt
              </span>
              Read your day at a glance
            </div>
            <h1 className="max-w-xl font-headline text-[clamp(2.25rem,6vw,3.75rem)] font-extrabold leading-[1.05] tracking-tight">
              <span className="block uppercase">Your sign.</span>
              <span className="block uppercase">Your daily read.</span>
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-neutral-300 sm:text-lg">
              {site.name} is a calm horoscope app: sign in with Google, pick your
              zodiac, and read today&apos;s forecast—with yesterday and tomorrow
              a tap away. Entertainment only.
            </p>
            <div className="w-full max-w-md">
              <StoreBadgeButtons className="justify-center lg:justify-start" />
            </div>
          </div>

          <div className="relative order-1 mx-auto flex w-full max-w-[320px] justify-center sm:max-w-[360px] lg:order-2 lg:max-w-none">
            {/* Floating callouts — reference-style colored pills */}
            <div className="hero-float absolute -left-2 top-[8%] z-20 flex max-w-[140px] items-center gap-2 rounded-xl bg-red-600/95 px-2.5 py-2 text-[11px] font-bold leading-tight shadow-lg shadow-red-900/40 ring-1 ring-white/10 sm:-left-4 sm:max-w-[160px] sm:px-3 sm:text-xs lg:left-0">
              <span className="material-symbols-outlined shrink-0 text-lg text-white">
                local_fire_department
              </span>
              <span>Today&apos;s focus</span>
            </div>
            <div className="hero-float-delay-1 absolute -right-2 top-[18%] z-20 flex max-w-[150px] items-center gap-2 rounded-xl bg-sky-600/95 px-2.5 py-2 text-[11px] font-bold leading-tight shadow-lg shadow-sky-900/40 ring-1 ring-white/10 sm:-right-4 sm:max-w-[170px] sm:px-3 sm:text-xs lg:right-0">
              <span className="material-symbols-outlined shrink-0 text-lg text-white">
                calendar_month
              </span>
              <span>Yesterday · Today · Tomorrow</span>
            </div>
            <div className="hero-float-delay-2 absolute -bottom-1 right-0 z-20 flex max-w-[155px] items-center gap-2 rounded-xl bg-amber-600/95 px-2.5 py-2 text-[11px] font-bold leading-tight shadow-lg shadow-amber-900/40 ring-1 ring-white/10 sm:bottom-2 sm:max-w-[175px] sm:px-3 sm:text-xs lg:right-4">
              <span className="material-symbols-outlined shrink-0 text-lg text-white">
                auto_awesome
              </span>
              <span>Love · Wealth · Health</span>
            </div>

            <div className="relative z-10 w-full max-w-[280px] sm:max-w-[300px]">
              <div
                className="overflow-hidden rounded-[2.25rem] border-[10px] border-neutral-800 bg-neutral-950 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.06)] ring-1 ring-white/10"
                style={{
                  aspectRatio: `${heroShowcase.width} / ${heroShowcase.height}`,
                }}
              >
                <Image
                  src={heroShowcase.src}
                  alt={heroShowcase.alt}
                  width={heroShowcase.width}
                  height={heroShowcase.height}
                  className="h-full w-full object-cover object-top"
                  priority
                  unoptimized
                  sizes="(max-width: 640px) 72vw, 300px"
                />
              </div>
              <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[3rem] bg-primary/15 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* What the app does — bento (copy matches real AstraDaily features) */}
      <section className="mx-auto max-w-7xl px-8 py-24">
        <div className="mb-14 text-center lg:text-left">
          <p className="mb-2 font-headline text-xs font-bold uppercase tracking-[0.2em] text-primary/90">
            What AstraDaily does
          </p>
          <h2 className="mb-4 font-headline text-4xl font-bold md:text-5xl">
            Celestial Insights
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-on-surface-variant lg:mx-0">
            A calm daily horoscope app: pick your sign, read an AI-generated
            forecast, and flip between days—without noise or clutter.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="glass-card group overflow-hidden rounded-3xl p-8 md:col-span-2">
            <div className="flex flex-col items-stretch gap-10 lg:flex-row lg:items-center">
              <div className="min-w-0 flex-1 space-y-4">
                <span className="material-symbols-outlined text-4xl text-primary">
                  auto_awesome
                </span>
                <h3 className="font-headline text-2xl font-bold">
                  Daily horoscope for your sign
                </h3>
                <p className="leading-relaxed text-on-surface-variant">
                  Read a fresh AI-generated forecast tailored to the zodiac sign
                  you choose. Switch between{" "}
                  <span className="font-medium text-on-surface/90">
                    yesterday, today, and tomorrow
                  </span>{" "}
                  to see the day you care about—then pull down to refresh when
                  new content is available.
                </p>
                <p className="text-xs leading-relaxed text-on-surface-variant/75">
                  Entertainment only—not medical, legal, or financial advice.
                </p>
              </div>

              <div className="w-full shrink-0 rounded-2xl border border-white/10 bg-black p-5 shadow-inner ring-1 ring-white/5 transition-transform duration-300 group-hover:scale-[1.02] lg:max-w-[300px]">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="font-headline text-lg font-bold tracking-tight">
                    Aries
                  </span>
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                    Horoscope
                  </span>
                </div>
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {(["Yesterday", "Today", "Tomorrow"] as const).map((d) => (
                    <span
                      key={d}
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        d === "Today"
                          ? "bg-primary text-on-primary-fixed shadow-sm shadow-primary/30"
                          : "bg-surface-container-highest text-on-surface-variant"
                      }`}
                    >
                      {d}
                    </span>
                  ))}
                </div>
                <div className="mb-3 h-1 overflow-hidden rounded-full bg-surface-container-highest">
                  <div className="h-full w-[72%] rounded-full bg-linear-to-r from-primary to-primary-container" />
                </div>
                <p className="text-sm italic leading-relaxed text-on-surface/85">
                  &ldquo;Energy is high—channel it into one meaningful move
                  today, not ten half-finished ones.&rdquo;
                </p>
                <p className="mt-3 text-[10px] leading-snug text-on-surface-variant/70">
                  Ai-generated for entertainment only.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card flex flex-col rounded-3xl p-8 transition-colors hover:bg-surface-container-highest/80">
            <span className="material-symbols-outlined mb-6 text-4xl text-secondary">
              nights_stay
            </span>
            <h3 className="mb-3 font-headline text-2xl font-bold">
              Your zodiac sign
            </h3>
            <p className="text-sm leading-relaxed text-on-surface-variant">
              Select your sign when you start, and change it any time in
              Settings. Forecasts follow the sign you have selected—simple and
              consistent.
            </p>
          </div>
        </div>
      </section>

      {/* Screenshots — motto + centered gallery */}
      <section
        id="screenshots-home"
        className="scroll-mt-28 bg-black py-24"
      >
        <div className="mx-auto mb-16 max-w-3xl px-8 text-center">
          <h2 className="font-headline text-3xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            See {site.name} in action
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base font-normal leading-relaxed text-white/75 md:text-lg">
            Read your sign with a calm, intuitive app—daily forecasts, yesterday
            and tomorrow at a glance, and love, wealth, and health in one flow.
          </p>
        </div>
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-x-6 gap-y-10 px-8 pb-12 sm:gap-x-8">
          {site.screenshotGallery.map((shot, idx) => (
            <div
              key={shot.src}
              className="w-[min(72vw,240px)] shrink-0 sm:w-[260px] md:w-[280px]"
            >
              <div
                className="relative mx-auto w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
                style={{
                  aspectRatio: `${shot.width} / ${shot.height}`,
                }}
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes="(max-width: 640px) 72vw, 280px"
                  className="object-contain"
                  priority={idx < 2}
                  unoptimized
                />
              </div>
              <p className="mt-3 text-center font-headline text-sm font-semibold text-on-surface">
                {shot.title}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
