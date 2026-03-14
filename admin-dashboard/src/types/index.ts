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
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalHoroscopes: number;
  publishedHoroscopes: number;
  draftHoroscopes: number;
  totalUsers: number;
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string | null;
  zodiacSign: ZodiacSign | null;
  timezone: string | null;
  onboardedAt: string;
  activityCount: number;
  lastActiveAt: string | null;
}

export interface UsersListResponse {
  users: AdminUser[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UserAnalytics {
  dau: number;
  mau: number;
  yearly: { year: number; month: number; activeUsers: number }[];
}

export type UserActivityAction =
  | "APP_OPEN"
  | "HOROSCOPE_VIEW"
  | "ZODIAC_SELECTED"
  | "SETTINGS_VIEW";

export interface UserActivityRecord {
  id: string;
  userId: string;
  action: UserActivityAction;
  sessionId: string | null;
  platform: string | null;
  appVersion: string | null;
  createdAt: string;
}

export interface UserActivityResponse {
  user: {
    id: string;
    email: string;
    fullName: string | null;
    zodiacSign: ZodiacSign | null;
    timezone: string | null;
    onboardedAt: string;
  };
  activities: UserActivityRecord[];
}

