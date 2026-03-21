# EAS build — environment variables (do not commit secrets)

Firebase and Google client IDs must **not** live in `eas.json` in git.

Use one of these:

## Option A — Expo dashboard (recommended)

1. Open [expo.dev](https://expo.dev) → your project → **Environment variables**
2. Add for **production** (and preview if needed):

   - `EXPO_PUBLIC_FIREBASE_API_KEY`
   - `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
   - `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `EXPO_PUBLIC_FIREBASE_APP_ID`
   - `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`
   - `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`

3. Rebuild the app.

## Option B — Local `.env` (not committed)

Copy `.env.example` → `.env`, fill values, then:

```bash
npx eas-cli build -p android --profile production
```

EAS will pick up `EXPO_PUBLIC_*` from your local env when using the EAS CLI from a machine that has `.env` (see Expo docs for exact behavior).

## Option C — EAS Secrets (CLI)

```bash
npx eas-cli secret:create --name EXPO_PUBLIC_FIREBASE_API_KEY --value "..." --scope project --type string
```

Repeat for each variable.
