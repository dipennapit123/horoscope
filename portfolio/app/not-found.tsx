import Link from "next/link";
import { site } from "@/src/content/site";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-4xl px-4 pb-20 pt-32 sm:px-6 sm:pb-28">
      <div className="glass-card rounded-3xl border border-white/10 bg-black/40 p-6 text-center sm:p-10">
        <p className="font-headline text-xs font-bold uppercase tracking-[0.24em] text-primary/90">
          404
        </p>
        <h1 className="mt-3 font-headline text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl">
          Page not found
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-on-surface-variant sm:text-base">
          The link you opened doesn’t exist. Head back to the homepage or pick your sign.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 py-3 font-headline text-sm font-bold text-on-primary-fixed"
          >
            Home
          </Link>
          <Link
            href="/horoscope"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-headline text-sm font-bold text-on-surface hover:bg-white/10"
          >
            Horoscope
          </Link>
        </div>

        <p className="mt-6 text-xs text-on-surface-variant">
          {site.name} • Entertainment only
        </p>
      </div>
    </main>
  );
}

