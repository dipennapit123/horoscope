"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("[portfolio global error]", error);

  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full bg-black text-white">
        <main className="mx-auto max-w-4xl px-4 pb-20 pt-24 sm:px-6 sm:pb-28">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/70">
              Error
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              App failed to load
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
              Try again or return to the homepage.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => reset()}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-black"
              >
                Try again
              </button>
              <Link
                href="/"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 bg-transparent px-5 py-3 text-sm font-bold text-white hover:bg-white/5"
              >
                Home
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}

