import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/src/content/site";
import { toYoutubeEmbedUrl } from "@/src/lib/embed-youtube";

export const metadata: Metadata = {
  title: "Demo",
  description: `Watch a short demo of ${site.name}.`,
  alternates: {
    canonical: "/demo",
  },
};

export default function DemoPage() {
  const embedUrl = toYoutubeEmbedUrl(site.demo.youtubeUrl);

  return (
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-32 md:px-12">
      <header className="mb-16 text-center md:text-left">
        <h1 className="mb-4 font-headline text-5xl font-extrabold tracking-tighter text-on-surface md:text-7xl">
          Experience {site.name}{" "}
          <span className="bg-linear-to-r from-primary to-on-primary-container bg-clip-text text-transparent">
            in Action
          </span>
        </h1>
        <p className="max-w-2xl font-body text-xl leading-relaxed text-on-surface-variant">
          Step into the celestial interface and witness how we ground the
          infinite cosmos into your daily routine.
        </p>
      </header>

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
        <div className="group relative lg:col-span-8">
          <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-primary/30 to-primary-container/30 blur-2xl transition-all duration-500 group-hover:blur-3xl" />
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_0_50px_-12px_rgba(225,182,255,0.2)]">
            <iframe
              className="h-full w-full"
              src={embedUrl}
              title={`${site.name} demo`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-6">
              <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-white/20">
                <div className="relative h-full w-1/3 rounded-full bg-primary">
                  <div className="absolute -top-1 right-0 h-3 w-3 rounded-full bg-white shadow-lg" />
                </div>
              </div>
              <div className="flex justify-between font-label text-xs uppercase tracking-widest text-on-surface-variant">
                <span>04:12 / 12:45</span>
                <span>4K Cinematic</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:col-span-4">
          <div className="rounded-2xl border border-white/10 bg-black p-8">
            <h2 className="mb-8 font-headline text-2xl font-bold tracking-tight text-on-surface">
              What you&apos;ll see
            </h2>
            <ul className="space-y-10">
              {[
                {
                  icon: "auto_awesome",
                  title: "Personalized readings",
                  body: "Deep dives into your natal chart mapped against real-time planetary transits.",
                },
                {
                  icon: "psychology",
                  title: "AI generation process",
                  body: "Watch our proprietary LLM synthesize centuries of wisdom into actionable daily insights.",
                },
                {
                  icon: "fluid_med",
                  title: "Smooth UI transitions",
                  body: 'Experience the friction-less "Celestial Anchor" design system in motion.',
                },
              ].map((i) => (
                <li key={i.title} className="group flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-container-high text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-on-primary">
                    <span className="material-symbols-outlined">{i.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-on-surface transition-colors group-hover:text-primary">
                      {i.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                      {i.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black p-8">
            <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition-all duration-700 group-hover:bg-primary/20" />
            <h4 className="mb-2 font-headline text-lg font-bold text-primary">
              Ready to explore?
            </h4>
            <p className="mb-6 text-sm text-on-surface-variant">
              Join 50k+ seekers grounding their daily journey in cosmic rhythm.
            </p>
            <Link
              href="/#download"
              className="block w-full rounded-xl bg-primary py-3 text-center font-bold text-on-primary-fixed transition-transform hover:scale-[1.02]"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

