import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/src/content/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name} — what the app does: sign in, pick your zodiac, and read daily horoscopes.`,
  alternates: {
    canonical: "/about",
  },
};

const HERO_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDQXXI98jJkI6CftOKmm3IQnhUr9en54Gg3VPYXEF7juu9UK4szEPJk5hi5-t3cj0f_TZB_RQ4kLd5xA_WyIrJTqCGA2sGcsE4F3GomidrTHPUFxYGBZVpUNx3xk6rnj8dr4Jo7d69ELti8mc7xC53UYz41e00Wa1yns_Z-cy67TJgtf8jWTC3C5jWRZ7TpqP5NDdeRM20hxEys8f_LWgjCUTAfnybMV7rYVsCn-0XyeUmKAmGJuW4s8O7aSvSZM5dZw19dpfcTKA";

const STAR_MAP_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBf0or9e66dewgMkr7vII7g7bKYNwDETmjdVCOGSku5KVEtnNQ8W7osm4Awrsc2KhbmOsyhE_5IkzoQwTxIwdRzskJStaxAHE_fqWFeQGNqcYrgsx6pCiIfUs8_lCJ0eML4_MT4OlYeL1-RRqsxjaRHI62hftMsTEeDMTHPAN4FW3cG6iDPvcBG_HVzrKNKJR2dBmb8bTnVo-LXvbBk9cPuIpBxDuD3CF0G1QeoeqLYuYPc8JgEMjm5F7tJ0kiwcEW6hN1UMffB5Q";

const appCapabilities = [
  {
    icon: "login" as const,
    title: "Google sign-in",
    body: "Create an account with Google so your sign and history stay with you.",
  },
  {
    icon: "stars" as const,
    title: "Zodiac selection",
    body: "Choose your sun sign once; your reading is tailored to that sign.",
  },
  {
    icon: "calendar_today" as const,
    title: "Yesterday, today & tomorrow",
    body: "Jump between adjacent days to compare or catch up on your daily text.",
  },
  {
    icon: "favorite" as const,
    title: "Wealth, love & health",
    body: "Each day’s reading includes separate blocks for wealth, love, and health alongside the main summary.",
  },
  {
    icon: "history" as const,
    title: "History",
    body: "Pull past horoscopes from your account so you can scroll what you’ve already read.",
  },
  {
    icon: "tune" as const,
    title: "Settings",
    body: "Adjust theme and your default day (for example opening on today vs. tomorrow).",
  },
];

export default function AboutPage() {
  return (
    <main className="relative z-10 overflow-hidden pt-32">
      <div className="pointer-events-none fixed inset-0 cosmic-particles" />
      <div className="pointer-events-none fixed right-[-5%] top-[-10%] h-[500px] w-[500px] nebula-glow" />
      <div className="pointer-events-none fixed bottom-[-10%] left-[-5%] h-[600px] w-[600px] nebula-glow" />

      <section className="relative mx-auto mb-32 max-w-7xl px-8">
        <div className="flex flex-col items-center gap-16 md:flex-row">
          <div className="w-full md:w-3/5">
            <span className="mb-4 block font-label text-xs uppercase tracking-widest text-tertiary">
              About the app
            </span>
            <h1 className="mb-8 font-headline text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
              Daily horoscopes for{" "}
              <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                your sign
              </span>
              .
            </h1>
            <p className="max-w-2xl text-xl font-light leading-relaxed text-on-surface-variant">
              {site.name} is a mobile app for reading a daily horoscope after you sign in and
              pick a zodiac sign. It does not build natal charts, calculate houses, or ask for
              birth time and place—only the sign you select drives the text you see.
            </p>
          </div>
          <div className="flex w-full justify-center md:w-2/5">
            <div className="group relative">
              <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-primary to-primary-container opacity-25 blur transition duration-1000 group-hover:opacity-40 group-hover:duration-200" />
              <Image
                src={HERO_IMG}
                alt="Abstract cosmic sculpture with violet neon light"
                width={560}
                height={400}
                className="relative h-[400px] w-full rounded-2xl border border-outline-variant/15 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mb-32 bg-black py-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-8 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black p-12 transition-colors duration-300 hover:bg-neutral-950">
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-container">
              <span className="material-symbols-outlined text-primary">
                auto_awesome
              </span>
            </div>
            <h2 className="mb-6 font-headline text-3xl font-bold">What we focus on</h2>
            <p className="leading-relaxed text-on-surface-variant">
              A clear daily reading, simple navigation between days, and a calm interface—so
              you can open the app, see your sign’s text, and move on. Content is presented for
              entertainment; it is not medical, legal, or financial advice.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black p-12 transition-colors duration-300 hover:bg-neutral-950">
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-container">
              <span className="material-symbols-outlined text-secondary">
                info
              </span>
            </div>
            <h2 className="mb-6 font-headline text-3xl font-bold">What isn’t in the app</h2>
            <p className="leading-relaxed text-on-surface-variant">
              There are no birth charts, transits, compatibility scores, or paid tiers described
              here—because the product today is a sign-based daily horoscope with history and
              settings, not a full astrology studio.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mb-32 max-w-7xl px-8">
        <div className="flex flex-col items-center gap-20 md:flex-row-reverse">
          <div className="w-full md:w-1/2">
            <h2 className="mb-10 font-headline text-4xl font-extrabold leading-tight md:text-5xl">
              What <span className="text-tertiary">{site.name}</span> does
            </h2>
            <div className="space-y-10">
              {appCapabilities.map((item) => (
                <div key={item.title} className="flex gap-6">
                  <div className="shrink-0">
                    <span className="material-symbols-outlined text-3xl text-primary">
                      {item.icon}
                    </span>
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                    <p className="text-on-surface-variant">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black p-4">
              <Image
                src={STAR_MAP_IMG}
                alt="Glowing purple star map"
                width={560}
                height={560}
                className="h-full w-full rounded-xl object-cover opacity-80 transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-8 pb-24 text-center md:text-left">
        <p className="text-on-surface-variant">
          Explore more:{" "}
          <Link href="/demo" className="font-semibold text-primary hover:underline">
            Demo
          </Link>
          {" · "}
          <Link
            href="/screenshots"
            className="font-semibold text-primary hover:underline"
          >
            Screenshots
          </Link>
          {" · "}
          <Link
            href="/contact"
            className="font-semibold text-primary hover:underline"
          >
            Contact
          </Link>
        </p>
      </section>
    </main>
  );
}
