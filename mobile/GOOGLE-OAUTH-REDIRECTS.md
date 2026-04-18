# Google Sign-In setup (native SDK)

The app now uses **`@react-native-google-signin/google-signin`** instead of a browser redirect flow.

That means:

- No `auth.expo.io` proxy
- No custom redirect URI workarounds
- No `astradaily://...` or `com.googleusercontent.apps...:/oauth2redirect` entries on the Web client

## What to keep on the Web OAuth client

Use the **Web OAuth client ID** as `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`.

Under **Authorized redirect URIs**, you can keep Firebase's default handler if it already exists:

`https://astradaily-4ad13.firebaseapp.com/__/auth/handler`

Remove the invalid custom-scheme entries you previously tried adding for the browser flow.

## What matters now

### Firebase Authentication
- **Google** provider enabled

### Android OAuth client
- Package name: `com.dipennapit.astradaily`
- SHA-1 includes:
  - local debug key if you test debug builds
  - Expo/EAS signing key if applicable
  - **Google Play App Signing** key for Play installs

### App config
- `app.json` includes the Expo plugin:
  - `@react-native-google-signin/google-signin`

## Important

Native Google Sign-In **will not work in Expo Go**.

Test it with:
- an **EAS Android build**
- a **development build**
- or the **Play testing** install
