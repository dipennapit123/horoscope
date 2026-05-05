import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/src/content/site";

export const metadata: Metadata = {
  title: "Features",
  description: `Features of ${site.name} — celestial insights, AI guidance, and your cosmic journey.`,
  alternates: {
    canonical: "/features",
  },
};

export default function FeaturesPage() {
  return (
    <main className="relative z-10 pt-24">
      <section className="mx-auto max-w-7xl px-8 pb-8 pt-8">
        <div className="mb-16 text-center lg:text-left">
          <h1 className="mb-4 font-headline text-4xl font-bold md:text-5xl">
            Celestial Insights
          </h1>
          <p className="max-w-2xl text-on-surface-variant">
            Discover how {site.name} translates the stars into actionable wisdom.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="glass-card group overflow-hidden rounded-2xl p-8 md:col-span-2">
            <div className="flex flex-col items-center gap-12 md:flex-row">
              <div className="flex-1 space-y-4">
                <span className="material-symbols-outlined text-4xl text-primary">
                  auto_awesome
                </span>
                <h2 className="font-headline text-2xl font-bold">
                  Daily Horoscope
                </h2>
                <p className="text-on-surface-variant">
                  Hyper-personalized readings calculated based on your exact
                  birth time and current planetary transits.
                </p>
              </div>
              <div className="w-full max-w-[280px] rounded-2xl border border-white/10 bg-black p-6 shadow-lg transition-transform group-hover:scale-105">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-headline text-lg font-bold">Leo</span>
                  <span className="text-xs uppercase tracking-widest text-on-surface-variant">
                    Today
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="h-1 overflow-hidden rounded-full bg-surface-container-highest">
                    <div className="h-full w-[85%] bg-primary" />
                  </div>
                  <p className="text-sm italic text-on-surface/80">
                    &ldquo;The Sun moves into your house of creativity. Today is
                    the day to start that project you&apos;ve been dreaming
                    of.&rdquo;
                  </p>
                  <div className="flex gap-2">
                    <span className="rounded-full border border-secondary/20 bg-secondary/10 px-2 py-0.5 text-[10px] text-secondary">
                      Love: 9/10
                    </span>
                    <span className="rounded-full border border-tertiary/20 bg-tertiary/10 px-2 py-0.5 text-[10px] text-tertiary">
                      Career: 7/10
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-8 transition-colors hover:bg-surface-container-highest">
            <span className="material-symbols-outlined mb-6 text-4xl text-secondary">
              psychology
            </span>
            <h2 className="mb-4 font-headline text-2xl font-bold">AI Insights</h2>
            <p className="text-sm text-on-surface-variant">
              Ask our AI oracle anything. From career moves to compatibility
              questions, get wisdom instantly.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 transition-colors hover:bg-surface-container-highest">
            <span className="material-symbols-outlined mb-6 text-4xl text-tertiary">
              history
            </span>
            <h2 className="mb-4 font-headline text-2xl font-bold">Your History</h2>
            <p className="text-sm text-on-surface-variant">
              Track your celestial journey over time and notice the recurring
              patterns in your cosmic cycle.
            </p>
          </div>

          <div className="relative flex items-center justify-between overflow-hidden rounded-2xl border border-white/10 bg-black p-8 md:col-span-2">
            <div className="relative z-10">
              <h2 className="mb-2 font-headline text-3xl font-bold">
                Ready to align?
              </h2>
              <p className="mb-6 text-on-surface-variant">
                Join half a million souls finding their way.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/#download" aria-label="Download on iOS">
                  <img
                    alt="App Store"
                    className="h-10 cursor-pointer"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5diR5SrJZl2s6NVsLzh2J10_crfuPQnzXK5SefRkVWJdmzjjRbOw1kaeoy1Q3cplM9gawQR1VFlzIU46Y10lh9A1tq_VXr65KC0AQxWUVGQWZZTLMFXDg9UQprtAWQD3E08b7cJ5oWpuq8hLK7FMcn1aUjcjgkY2ogUhfvoYseN2Rvwg1Lyg0yXB5mVyuT5jtE43S_jjxw_IBDpWH89gIfdw8Vc5wxn2w81RF9KtOewd_g9fYBFgnWo3FNVQGF_GZXJkzMOdLTQ"
                  />
                </Link>
                <Link href="/#download" aria-label="Download on Android">
                  <img
                    alt="Google Play"
                    className="h-10 cursor-pointer"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDE8XycG9CR8SpBvOWt6v6OtJIYecAjCpNBy4gpfsIJbwFBf6ZMNArZVW-faBFp-MyirwoiQY4fe_goTXjYdjpYRKV2fc3NqzpBZAzTNqgX9QXMgDzvQvKgOwYzxk8Su0EfsL30845DMGTpIc4rK27nYzPWZsh-tbID_SgAE31LW64VjCG--lHpx6ZCsNCurzZYbOJVSInfwyZgl_M8a1pL_GF75bb0kTZAaszByn1n6nGf8mSXYoaMnVvWGlRGFxr4e1vW6sarzA"
                  />
                </Link>
              </div>
            </div>
            <div className="absolute -bottom-5 -right-10 hidden opacity-20 sm:block">
              <span className="material-symbols-outlined rotate-12 text-[160px] text-primary">
                stars
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
          <Link
            href="/demo"
            className="pulsar-btn rounded-full px-8 py-3 font-headline font-bold text-on-primary-fixed"
          >
            Watch demo
          </Link>
          <Link
            href="/screenshots"
            className="rounded-full border border-outline-variant/30 px-8 py-3 font-headline font-bold text-primary transition-colors hover:bg-surface-container-high"
          >
            Screenshots
          </Link>
        </div>
      </section>
    </main>
  );
}
