# AGENTS.md — AI / developer context (Ao Horoscope monorepo)

**Start here** on a new machine or in a new Cursor workspace. For a longer handoff (URLs, SQL, troubleshooting), read **`PROJECT_OVERVIEW.md`** in this same folder.

## What this repo is

| Path | App | Stack | Deployed / prod |
|------|-----|--------|-----------------|
| `admin-dashboard2/` | Admin UI + **backend API** (public + authenticated routes) | Next.js App Router | `https://astradailyadmin.org` |
| `portfolio/` | Public marketing + horoscope site | Next.js App Router | `https://astradaily.app` |
| `mobile/` | Native app | React Native / Expo | Separate store releases |

The **database** (Postgres / Supabase) is owned by the **admin** app. The portfolio site **does not** talk to the DB directly; it calls admin (e.g. horoscopes, **`POST /api/public/analytics/track`** via portfolio’s `/api/track` proxy).

## Non-negotiable workflow (user preference)

1. **Ask before `git commit`.**
2. **Ask before any `git push`**, including **`git subtree push`**.

## Git: monorepo vs deployment repos

- **`origin`** points at the **full monorepo** mirror (e.g. `dashreview`). Use it for backing up the whole tree.
- **Deployable repos** are separate; changes go there with **`git subtree push`**, **not** by pushing the entire monorepo to those remotes.

Expected remotes (verify with `git remote -v`):

| Remote | Folder prefix | Typical branch |
|--------|----------------|----------------|
| `admindashboard` | `admin-dashboard2` | `main` |
| `astradailyportfolio` | `portfolio` | `main` |
| `astradailymobileapp` | `mobile` | `main` |

### Subtree push (happy path)

```bash
git add admin-dashboard2 && git commit -m "..."   # after user approval
git subtree push --prefix=admin-dashboard2 admindashboard main
```

Same pattern for `portfolio` → `astradailyportfolio`, `mobile` → `astradailymobileapp`.

### Non–fast-forward on subtree push

Remote `main` may be ahead. **Do not** force-push blindly. Use the project pattern: `fetch` remote `main`, **`git subtree split`** for the prefix, merge split into a branch from the remote with **`--allow-unrelated-histories`**, then push that result to `main`. Details: **`PROJECT_OVERVIEW.md`**.

### Hygiene

- Do **not** commit secrets into the **`admindashboard`** subtree repo; that repo is deploy-focused. Keep sensitive files in monorepo + secure sharing only.

## Analytics & time

- Portfolio events live in **`PortfolioEvent`** (Supabase), written by admin’s public track route.
- **Nepal timezone** **`Asia/Kathmandu`** is used for day/month buckets in SQL and dashboard copy.

## New laptop checklist (minimal)

1. Clone the **monorepo** (the repo that has all three folders).
2. `git remote -v` — confirm `admindashboard`, `astradailyportfolio`, `astradailymobileapp` if you subtree-push from this clone.
3. Copy **`.env`** into `admin-dashboard2/` (there is **`.env.example`**; admin uses **`.env` only**, not `.env.local` per project notes).
4. `cd admin-dashboard2 && npm install && npm run dev`
5. `cd portfolio && npm install && npm run dev` — set **`ASTRADAILY_API_BASE_URL`** for hosted tracking (see `PROJECT_OVERVIEW.md`).
6. Run Supabase migrations from `admin-dashboard2/supabase/` if the DB is fresh (order in `PROJECT_OVERVIEW.md`).
7. If **`next dev`** warns about **wrong inferred workspace root** / `ENOENT` scanning `app/`, ensure **`turbopack.root`** is set in that app’s `next.config` (portfolio already pins it; admin should match).

## Where detailed docs live

- **`PROJECT_OVERVIEW.md`** — migrations list, tracking flow, env vars, subtree recovery, production URLs.
