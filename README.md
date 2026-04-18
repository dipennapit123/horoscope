## AstraDaily

This repo contains three projects:

- **`admin-dashboard2`** — Next.js app: admin UI, user API, and backend logic (deployed to Vercel).
- **`mobile`** — Expo React Native app for end users (EAS / app stores).
- **`portfolio`** — Marketing / portfolio site.

### Admin + API (`admin-dashboard2`)

```bash
cd admin-dashboard2
npm install
npm run dev
```

Configure environment variables per `admin-dashboard2` docs (`.env.local`, Vercel env).

### Mobile (`mobile`)

```bash
cd mobile
npm install
npx expo start
```

Set `EXPO_PUBLIC_*` variables (see Expo / EAS docs). Point `EXPO_PUBLIC_API_BASE_URL` at your deployed admin API.

### Portfolio (`portfolio`)

```bash
cd portfolio
npm install
npm run dev
```
