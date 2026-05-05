import type { ZodiacSign } from "./types";

const SLUG_TO_SIGN: Record<string, ZodiacSign> = {
  aries: "ARIES",
  taurus: "TAURUS",
  gemini: "GEMINI",
  cancer: "CANCER",
  leo: "LEO",
  virgo: "VIRGO",
  libra: "LIBRA",
  scorpio: "SCORPIO",
  sagittarius: "SAGITTARIUS",
  capricorn: "CAPRICORN",
  aquarius: "AQUARIUS",
  pisces: "PISCES",
};

export function zodiacSignFromSlug(slug: string): ZodiacSign | null {
  return SLUG_TO_SIGN[slug.trim().toLowerCase()] ?? null;
}
