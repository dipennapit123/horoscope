import { Platform } from "react-native";
import Constants from "expo-constants";
import { api } from "./api";

export type ActivityAction =
  | "APP_OPEN"
  | "HOROSCOPE_VIEW"
  | "ZODIAC_SELECTED"
  | "SETTINGS_VIEW";

let sessionId: string | null = null;

function getSessionId(): string {
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }
  return sessionId;
}

export function getTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  } catch {
    return "";
  }
}

function getAppVersion(): string {
  const v =
    Constants.expoConfig?.version ??
    (Constants.manifest as { version?: string })?.version;
  return v ?? "1.0.0";
}

export async function recordActivity(
  clerkUserId: string,
  action: ActivityAction,
): Promise<void> {
  try {
    await api.post(
      "/users/activity",
      {
        action,
        sessionId: getSessionId(),
        timezone: getTimezone(),
        platform: Platform.OS,
        appVersion: getAppVersion(),
      },
      { headers: { "x-clerk-user-id": clerkUserId } },
    );
  } catch {
    // Fire-and-forget; don't block UI
  }
}
