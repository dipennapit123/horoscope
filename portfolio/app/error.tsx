"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[portfolio error]", error);
  }, [error]);

  return (
    <main className="mx-auto max-w-4xl px-4 pb-20 pt-32 sm:px-6 sm:pb-28">
      <div className="glass-card rounded-3xl border border-white/10 bg-black/40 p-6 text-center sm:p-10">
        <p className="font-headline text-xs font-bold uppercase tracking-[0.24em] text-primary/90">
          500
        </p>
        <h1 className="mt-3 font-headline text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl">
          Something went wrong
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-on-surface-variant sm:text-base">
          Please try again. If the problem persists, come back in a bit.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 py-3 font-headline text-sm font-bold text-on-primary-fixed"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-headline text-sm font-bold text-on-surface hover:bg-white/10"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}

