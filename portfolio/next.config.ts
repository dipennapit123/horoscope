import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

/** Pin Turbopack root to this app (avoids wrong root + broken cache when parent dirs have other lockfiles). */
const turbopackRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: turbopackRoot,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
