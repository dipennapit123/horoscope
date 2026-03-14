export type ZodiacSign =
  | "ARIES"
  | "TAURUS"
  | "GEMINI"
  | "CANCER"
  | "LEO"
  | "VIRGO"
  | "LIBRA"
  | "SCORPIO"
  | "SAGITTARIUS"
  | "CAPRICORN"
  | "AQUARIUS"
  | "PISCES";

export interface Horoscope {
  id: string;
  zodiacSign: ZodiacSign;
  date: string;
  title: string;
  summary: string;
  wealthText: string;
  loveText: string;
  healthText: string;
  wealthConfidence: number;
  loveConfidence: number;
  healthConfidence: number;
  wealthActionLabel?: string | null;
  loveActionLabel?: string | null;
  healthActionLabel?: string | null;
  weeklyOutlook?: string | null;
}

