/** Mood pillar payload from admin `Horoscope.moodBoard` JSONB. */
export type SiteMoodBoardPillar = {
  headline: string;
  vibes: string[];
  palette: string;
  confidence?: number;
};

export type SiteHoroscopeMoodBoard = {
  love: SiteMoodBoardPillar;
  health: SiteMoodBoardPillar;
  career: SiteMoodBoardPillar;
};

/** One published daily row (admin public API / bundle). */
export type SiteHoroscopeDay = {
  id: string;
  zodiacSign: string;
  date: string;
  title: string;
  summary: string;
  wealthText: string;
  loveText: string;
  healthText: string;
  loveConfidence: number;
  wealthConfidence: number;
  healthConfidence: number;
  moodBoard: SiteHoroscopeMoodBoard | null;
  weeklyOutlook?: string | null;
};

export type SiteHoroscopeBundle = {
  yesterday: SiteHoroscopeDay | null;
  today: SiteHoroscopeDay | null;
  tomorrow: SiteHoroscopeDay | null;
};

export type SiteWeekly = {
  weekStartDate: string;
  outlookText: string;
  /** Weekly row title from admin (optional UI accent). */
  title?: string;
} | null;
