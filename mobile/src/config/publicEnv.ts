import Constants from "expo-constants";

/**
 * Read public env from expo.extra (set in app.config.js from .env / EAS).
 * Falls back to process.env for web or tests.
 */
function read(key: string): string | undefined {
  const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, unknown>;
  const fromExtra = extra[key];
  const fromProcess = process.env[key as keyof typeof process.env];
  const raw =
    (typeof fromExtra === "string" ? fromExtra : undefined) ??
    (typeof fromProcess === "string" ? fromProcess : undefined);
  const t = raw?.trim();
  return t?.length ? t : undefined;
}

export const publicEnv = {
  apiBaseUrl: () =>
    read("EXPO_PUBLIC_API_BASE_URL") ?? "http://localhost:3000/api",
  firebaseApiKey: () => read("EXPO_PUBLIC_FIREBASE_API_KEY"),
  firebaseAuthDomain: () => read("EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  firebaseProjectId: () => read("EXPO_PUBLIC_FIREBASE_PROJECT_ID"),
  firebaseStorageBucket: () => read("EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  firebaseMessagingSenderId: () => read("EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  firebaseAppId: () => read("EXPO_PUBLIC_FIREBASE_APP_ID"),
  googleWebClientId: () => read("EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID"),
  googleAndroidClientId: () => read("EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID"),
  googleIosClientId: () => read("EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID"),
};

export function getMissingPublicEnvKeys(): string[] {
  const checks: [string, () => string | undefined][] = [
    ["EXPO_PUBLIC_FIREBASE_API_KEY", publicEnv.firebaseApiKey],
    ["EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN", publicEnv.firebaseAuthDomain],
    ["EXPO_PUBLIC_FIREBASE_PROJECT_ID", publicEnv.firebaseProjectId],
    ["EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET", publicEnv.firebaseStorageBucket],
    ["EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", publicEnv.firebaseMessagingSenderId],
    ["EXPO_PUBLIC_FIREBASE_APP_ID", publicEnv.firebaseAppId],
    ["EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID", publicEnv.googleWebClientId],
    // Android OAuth client is optional for expo-auth-session + custom scheme: we use Web client ID in the browser flow.
  ];
  return checks.filter(([, fn]) => !fn()).map(([k]) => k);
}
