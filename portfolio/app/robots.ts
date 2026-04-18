import type { MetadataRoute } from "next";
import { site } from "@/src/content/site";

export default function robots(): MetadataRoute.Robots {
  const base = new URL(site.metadataBaseUrl);

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: new URL("/sitemap.xml", base).toString(),
  };
}

