export type SiteFeature = {
  title: string;
  description: string;
};

export type SiteScreenshot = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type SiteScreenshotGalleryItem = {
  title: string;
  description: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type SiteHeroScreen = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/**
 * Twelve signs for `/horoscope` (selector grid) and `/horoscope/[sign]` (reading page).
 *
 * - `slug` is the URL segment (lowercase).
 * - `label` is the display name.
 * - `dateRange` is the human-readable range shown on the selector card and reading header.
 * - `glyph` is the Unicode astrology character used as a fallback in `ZodiacAvatar`
 *   when no `imageSrc` is provided.
 * - `imageSrc` (optional) — drop a PNG into `public/horoscope/<slug>.png` and set
 *   this to `/horoscope/<slug>.png` to swap the gradient placeholder for real art.
 */
export const zodiacSigns = [
  { slug: "aries", label: "Aries", dateRange: "Mar 21 - Apr 19", glyph: "\u2648" },
  { slug: "taurus", label: "Taurus", dateRange: "Apr 20 - May 20", glyph: "\u2649" },
  { slug: "gemini", label: "Gemini", dateRange: "May 21 - Jun 20", glyph: "\u264A" },
  { slug: "cancer", label: "Cancer", dateRange: "Jun 21 - Jul 22", glyph: "\u264B" },
  { slug: "leo", label: "Leo", dateRange: "Jul 23 - Aug 22", glyph: "\u264C" },
  { slug: "virgo", label: "Virgo", dateRange: "Aug 23 - Sept 22", glyph: "\u264D" },
  { slug: "libra", label: "Libra", dateRange: "Sept 23 - Oct 22", glyph: "\u264E" },
  { slug: "scorpio", label: "Scorpio", dateRange: "Oct 23 - Nov 21", glyph: "\u264F" },
  { slug: "sagittarius", label: "Sagittarius", dateRange: "Nov 22 - Dec 21", glyph: "\u2650" },
  { slug: "capricorn", label: "Capricorn", dateRange: "Dec 22 - Jan 19", glyph: "\u2651" },
  { slug: "aquarius", label: "Aquarius", dateRange: "Jan 20 - Feb 18", glyph: "\u2652" },
  { slug: "pisces", label: "Pisces", dateRange: "Feb 19 - Mar 20", glyph: "\u2653" },
] as const satisfies ReadonlyArray<{
  slug: string;
  label: string;
  dateRange: string;
  glyph: string;
  imageSrc?: string;
}>;

export type ZodiacSlug = (typeof zodiacSigns)[number]["slug"];
export type ZodiacEntry = (typeof zodiacSigns)[number];

export function getZodiacBySlug(slug: string): ZodiacEntry | undefined {
  return zodiacSigns.find((z) => z.slug === slug);
}

export const site = {
  name: "AstraDaily",
  tagline: "Daily horoscopes with a calm, modern UI.",
  description:
    "AstraDaily is a horoscope app for quick daily insights, personalized by your zodiac sign.",
  /**
   * Production site origin (no trailing slash). Used for metadataBase, canonical URLs,
   * Open Graph, sitemap, and robots. Set to your real domain (e.g. Vercel URL) before launch.
   */
  metadataBaseUrl: "https://astradaily.app",
  /** SEO — titles, descriptions, and meta keywords (supporting signal; unique page copy matters most). */
  seo: {
    defaultTitle: "AstraDaily — Free daily horoscope app",
    defaultDescription:
      "Get a free daily horoscope in a calm, modern app. Read yesterday, today, and tomorrow for your zodiac sign—Aries through Pisces. Entertainment only.",
    homeTitle: "Free daily horoscope app | AstraDaily",
    homeDescription:
      "AstraDaily: free daily horoscope for every sign. Quick readings, love, wealth, and health sections, and a clear UI. Download on the App Store or Google Play.",
    /** Default Open Graph / Twitter preview image (path under public/). */
    ogImagePath: "/hero/app-splash.png",
    ogImageWidth: 508,
    ogImageHeight: 1024,
    keywords: [
      "daily horoscope",
      "free daily horoscope",
      "horoscope app",
      "zodiac horoscope",
      "today horoscope",
      "aries horoscope",
      "taurus horoscope",
      "gemini horoscope",
      "cancer horoscope",
      "leo horoscope",
      "virgo horoscope",
      "libra horoscope",
      "libra daily horoscope",
      "scorpio horoscope",
      "sagittarius horoscope",
      "capricorn horoscope",
      "aquarius horoscope",
      "pisces horoscope",
      "aries daily horoscope",
      "taurus daily horoscope",
      "gemini daily horoscope",
      "cancer daily horoscope",
      "leo daily horoscope",
      "virgo daily horoscope",
      "scorpio daily horoscope",
      "sagittarius daily horoscope",
      "capricorn daily horoscope",
      "aquarius daily horoscope",
      "pisces daily horoscope",
    ],
  },
  contactEmail: "dipennapit45@gmail.com",
  /** Blog — use `/blog` for the on-site page or an external URL (e.g. Medium, Substack) */
  blogUrl: "/blog",
  storeLinks: {
    ios: "https://example.com/ios",
    /** Google Play — listing opens when the app is published under this applicationId */
    android:
      "https://play.google.com/store/apps/details?id=com.dipennapit.astradaily",
  },
  demo: {
    title: "Product demo",
    /** Replace with your product demo watch URL */
    youtubeUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
  },
  /** Home hero — two overlapping phone screenshots (source files in public/hero/) */
  /** Home hero: left-to-right = splash, then select-sign (see app/page.tsx) */
  heroScreens: [
    {
      src: "/hero/app-splash.png",
      alt: "AstraDaily — free daily horoscope splash with zodiac wheel",
      width: 508,
      height: 1024,
    },
    {
      src: "/hero/app-select-sign.png",
      alt: "AstraDaily — select your zodiac sign",
      width: 499,
      height: 1024,
    },
  ] satisfies SiteHeroScreen[],
  screenshots: [
    {
      src: "/screenshots/screenshot-1.svg",
      alt: "Daily horoscope screen",
      width: 1200,
      height: 800,
    },
    {
      src: "/screenshots/screenshot-2.svg",
      alt: "Zodiac selection screen",
      width: 1200,
      height: 800,
    },
    {
      src: "/screenshots/screenshot-3.svg",
      alt: "Settings screen",
      width: 1200,
      height: 800,
    },
  ] satisfies SiteScreenshot[],
  /** Home + /screenshots gallery (local marketing captures) */
  screenshotGallery: [
    {
      title: "Splash",
      description:
        "A calm entry with the zodiac wheel, loading state, and clear AI entertainment disclaimer.",
      src: "/screenshots/gallery/splash.png",
      alt: "AstraDaily splash screen with zodiac wheel",
      width: 576,
      height: 1024,
    },
    {
      title: "Select sign",
      description:
        "Pick from all twelve signs—your choice drives the horoscope you see.",
      src: "/screenshots/gallery/select-sign.png",
      alt: "AstraDaily select zodiac sign screen",
      width: 576,
      height: 1024,
    },
    {
      title: "Daily horoscope",
      description:
        "Read for your sign and switch between yesterday, today, and tomorrow.",
      src: "/screenshots/gallery/daily-horoscope.png",
      alt: "AstraDaily daily horoscope with day toggle",
      width: 576,
      height: 1024,
    },
    {
      title: "Love, career & wealth",
      description:
        "Structured sections for the areas that matter—still AI-generated for entertainment.",
      src: "/screenshots/gallery/love-career-wealth.png",
      alt: "AstraDaily horoscope sections for love, career, and wealth",
      width: 576,
      height: 1024,
    },
  ] satisfies SiteScreenshotGalleryItem[],
  features: [
    {
      title: "Fast daily read",
      description: "A clear daily horoscope without the noise.",
    },
    {
      title: "Personalized by sign",
      description: "Choose your zodiac sign and keep it synced.",
    },
    {
      title: "Modern, calm design",
      description: "Readable typography and a dark-first aesthetic.",
    },
    {
      title: "Built for mobile",
      description: "Simple flows for sign selection, reading, and settings.",
    },
  ] satisfies SiteFeature[],
} as const;

