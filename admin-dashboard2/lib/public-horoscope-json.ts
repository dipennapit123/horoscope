import type { HoroscopeRow } from "./types";

export type PublicHoroscopeJson = {
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
  moodBoard: HoroscopeRow["moodBoard"];
  weeklyOutlook: string | null;
};

export function horoscopeToPublicJson(row: HoroscopeRow): PublicHoroscopeJson {
  return {
    id: row.id,
    zodiacSign: row.zodiacSign,
    date: row.date.toISOString(),
    title: row.title,
    summary: row.summary,
    wealthText: row.wealthText,
    loveText: row.loveText,
    healthText: row.healthText,
    loveConfidence: row.loveConfidence,
    wealthConfidence: row.wealthConfidence,
    healthConfidence: row.healthConfidence,
    moodBoard: row.moodBoard,
    weeklyOutlook: row.weeklyOutlook,
  };
}
