# Deploying AstraDaily (separate repos)

Each part of the app is deployed from its own GitHub repo. You develop in this monorepo, then push each app to its repo when you want to deploy.

## Repos

| App   | GitHub repo | Deploy to      |
|-------|-------------|----------------|
| Backend | [AstraDaily-Backend](https://github.com/dipennapit123/AstraDaily-Backend) | Railway |
| Mobile  | [AstraDaily-Mobile](https://github.com/dipennapit123/AstraDaily-Mobile)   | EAS Build / Expo / app stores |
| Admin   | [AstraDaily-Admin](https://github.com/dipennapit123/AstraDaily-Admin)     | Vercel / Netlify |

## One-time: create empty GitHub repos

1. **Backend** – You already have [AstraDaily-Backend](https://github.com/dipennapit123/AstraDaily-Backend).
2. **Mobile** – Create a new repo: [github.com/new](https://github.com/new) named `AstraDaily-Mobile` (empty, no README).
3. **Admin** – Create a new repo named `AstraDaily-Admin` (empty, no README).

## Push to deploy

Run from the **monorepo root** (`ao-horoscope`):

```bash
# Backend → AstraDaily-Backend (then connect Railway to that repo)
./scripts/push-backend.sh

# Mobile → AstraDaily-Mobile (then connect EAS/Expo to that repo)
./scripts/push-mobile.sh

# Admin → AstraDaily-Admin (then connect Vercel/Netlify to that repo)
./scripts/push-admin.sh
```

Scripts clone the target repo, copy in the app code (excluding `node_modules`, `.env`, build output), commit, and push. Override repo URL or branch:

```bash
./scripts/push-backend.sh https://github.com/you/Your-Backend.git main
```

## After pushing

- **Backend:** Connect [Railway](https://railway.app) to `AstraDaily-Backend`, add Postgres, set env vars. See [backend/DEPLOY-RAILWAY.md](backend/DEPLOY-RAILWAY.md).
- **Mobile:** Connect [EAS](https://expo.dev) to `AstraDaily-Mobile` for builds; set `EXPO_PUBLIC_API_BASE_URL` to your Railway backend URL.
- **Admin:** Connect [Vercel](https://vercel.com) or Netlify to `AstraDaily-Admin`; set `VITE_API_BASE_URL` to your Railway backend URL.

## Env and API URL

- In **production**, point mobile and admin at the deployed backend (e.g. `https://your-app.up.railway.app`). Set this in each platform’s env (EAS env, Vercel env, etc.), not in the repo.
