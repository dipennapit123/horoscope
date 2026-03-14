## AstraDaily Monorepo

This monorepo contains three apps:

- `backend` – Express + Prisma API for users, horoscopes, and admin tools
- `admin-dashboard` – React + Vite admin panel to manage horoscope content
- `mobile` – Expo React Native app for end users

### 1. Backend

1. Create `.env` from the example and point `DATABASE_URL` to a PostgreSQL database.
2. From `backend`:

```bash
npm install
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

API base URL: `http://localhost:4000/api`.

### 2. Admin dashboard

1. Create `.env` from `.env.example` and set `VITE_API_BASE_URL` if needed.
2. From `admin-dashboard`:

```bash
npm install
npm run dev
```

Log in with the seeded admin user: `admin@example.com` / `admin123`.

### 3. Mobile app

1. Create `.env` from `.env.example` and set `EXPO_PUBLIC_API_BASE_URL`.
2. From `mobile`:

```bash
npm install
npm start
```

The mobile app currently uses a mock Clerk login; replace the placeholder in `LoginScreen.tsx` with real Clerk + Google Sign-In when you are ready.

