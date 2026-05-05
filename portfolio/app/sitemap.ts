import type { MetadataRoute } from "next";
import { site, zodiacSigns } from "@/src/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.metadataBaseUrl.replace(/\/+$/, "");
  const now = new Date();

  const pages = [
    "/",
    "/features",
    "/screenshots",
    "/demo",
    "/about",
    "/contact",
    "/privacy",
    "/blog",
    "/horoscope",
  ];

  const staticEntries: MetadataRoute.Sitemap = pages.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));

  const signEntries: MetadataRoute.Sitemap = zodiacSigns.map((z) => ({
    url: `${base}/horoscope/${z.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticEntries, ...signEntries];
}

