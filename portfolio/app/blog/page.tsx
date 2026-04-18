import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/src/content/site";

export const metadata: Metadata = {
  title: "Blog",
  description: `Updates and articles from ${site.name}.`,
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
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
        Blog
      </h1>
      <p className="mt-4 text-lg text-on-surface-variant">
        Product updates, tips, and stories from the {site.name} team. New posts
        are coming soon.
      </p>
    </main>
  );
}
