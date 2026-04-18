# Deploying AstraDaily

Each app can be deployed from this repo.

| Project | Role | Typical host |
|--------|------|----------------|
| **admin-dashboard2** | Admin UI + API (Next.js) | Vercel |
| **mobile** | Expo app | EAS / Play Store / App Store |
| **portfolio** | Site | Vercel / static host |

## Environment

- **Production API URL:** set in Vercel for `admin-dashboard2`, and in EAS / Expo env for `mobile` (`EXPO_PUBLIC_API_BASE_URL` and other `EXPO_PUBLIC_*` keys).
- Do not commit secrets; use each platform’s env UI or EAS secrets.

## Mobile snapshot repo (optional)

The mobile app is also pushed to a separate GitHub repo for a clean public tree when needed; see your deployment notes or `git remote -v` for `astradailymobileapp`.
