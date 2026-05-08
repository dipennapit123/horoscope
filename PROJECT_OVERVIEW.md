# Ao Horoscope (Monorepo) — Project overview & laptop handoff

**For Cursor / AI:** read **`AGENTS.md`** in this folder first (short rules + checklist). This file is the **long** reference.

This repository is a **monorepo** containing 3 apps:

- `admin-dashboard2/` — Admin dashboard + backend API (Next.js App Router). Production: `https://astradailyadmin.org`
- `portfolio/` — Public marketing / horoscope website (Next.js App Router). Production: `https://astradaily.app`
- `mobile/` — Mobile app (React Native / Expo)

---

## Golden rules (IMPORTANT)

1) **Monorepo vs deploy repos**
   - Do **not** push the entire monorepo to the **admin**, **portfolio**, or **mobile** GitHub repos.
   - Push **only the matching subfolder** with **`git subtree push`**.

2) **Workflow (user requirement)**
   - Always **ask** before **`git commit`**.
   - Always **ask** before **`git push`** (including **subtree** pushes).

3) **Secrets**
   - Treat **`admindashboard`** as a deploy-facing repo: avoid committing env files, local credentials, or one-off bundles into that subtree history.

---

## Git remotes

| Remote | URL (expected) | Used for |
|--------|----------------|----------|
| `origin` | e.g. `dashreview` — **full monorepo** backup | Whole tree |
| `admindashboard` | `https://github.com/dipennapit123/admindashboard.git` | **`admin-dashboard2/`** only |
| `astradailyportfolio` | `https://github.com/dipennapit123/AstraDailyPortfolio.git` | **`portfolio/`** only |
| `astradailymobileapp` | `https://github.com/dipennapit123/astradailymobileapp.git` | **`mobile/`** only |

Check:

```bash
git remote -v
```

---

## Commit & push (subtree) — happy path

### Admin (`admin-dashboard2/`) → `admindashboard`

```bash
git add admin-dashboard2
# Ask user, then commit
git commit -m "..."
# Ask user, then push subtree
git subtree push --prefix=admin-dashboard2 admindashboard main
```

### Portfolio (`portfolio/`) → `astradailyportfolio`

```bash
git add portfolio
git commit -m "..."
git subtree push --prefix=portfolio astradailyportfolio main
```

### Mobile (`mobile/`) → `astradailymobileapp`

```bash
git add mobile
git commit -m "..."
git subtree push --prefix=mobile astradailymobileapp main
```

---

## Subtree push rejected (non–fast-forward)

The deployment repo’s `main` may have commits you do not have in your split history. **Do not** `--force` push unless the user explicitly asks.

**Pattern that works in this project:**

1. `git fetch <remote> main`
2. `git subtree split --prefix=<folder> -b <local-split-branch>` — e.g. `admin-subtree-local`
3. `git branch -f <remote-snapshot-branch> FETCH_HEAD`
4. `git checkout -b <sync-branch> <remote-snapshot-branch>`
5. `git merge <local-split-branch> --no-edit --allow-unrelated-histories`
6. `git push <remote> HEAD:main`
7. Return to your normal branch (`git checkout main`).

Replace `<folder>` / branch names per app. Keep merges **subfolder-only** (the merge happens inside the split branch’s file layout).

---

## New laptop / new Cursor machine — checklist

1. **Clone** the monorepo (the repo that contains all three directories).
2. **`git remote -v`** — ensure subtree remotes exist if you push from this clone.
3. **Admin env:** copy **`.env`** into `admin-dashboard2/`. See `admin-dashboard2/.env.example` and `admin-dashboard2/VERCEL-DEPLOY.md`. This project uses **`.env` only** for admin (not `.env.local`, per inline docs).
4. **Install & run:**
   ```bash
   cd admin-dashboard2 && npm install && npm run dev
   cd ../portfolio && npm install && npm run dev
   cd ../mobile && npm install
   ```
5. **Database:** if the Supabase project is new or missing tables, run SQL migrations (order below) in the Supabase SQL editor.
6. **Portfolio (hosted):** set **`ASTRADAILY_API_BASE_URL=https://astradailyadmin.org`** on the portfolio host (e.g. Vercel) so `/api/track` can reach the admin public API.
7. **Cursor / AI context:** open the repo root so Cursor loads **`.cursor/rules/`** and **`AGENTS.md`**.

### Next.js dev: wrong “workspace root” / `ENOENT` on `app/`

If **`next dev`** warns that it picked **`/Users/<you>/package-lock.json`** as the workspace root, Turbopack may scan the wrong tree and errors like **`scandir .../admin-dashboard2/app`** can appear.

- **`portfolio/`** already sets **`turbopack.root`** in `next.config.ts`.
- **`admin-dashboard2/`** should do the same (pin root to that app directory). If you still see the warning, remove or relocate stray `package-lock.json` files **above** the app directory that are not part of this monorepo.

---

## Local dev commands

### Admin

```bash
cd admin-dashboard2
npm install
npm run dev
```

### Portfolio

```bash
cd portfolio
npm install
npm run dev
```

### Mobile

```bash
cd mobile
npm install
# then your usual Expo command
```

---

## Production URLs

- Admin: `https://astradailyadmin.org`
- Portfolio: `https://astradaily.app`

---

## Website analytics (portfolio traffic)

### Goal

Track **website page visits** and show:

- **DAU (website):** unique visitors today (**Nepal** calendar day)
- **MAU (website):** unique visitors last **30** Nepal days (rolling)
- Pageviews, “visited links” (full URL when stored), referrer “sources”, UTM campaigns

### Data model (admin DB)

Table: **`PortfolioEvent`**

Notable columns:

- `visitorId`, `sessionId`
- `eventName` — e.g. `pageview`, `horoscope_view`, `store_click`
- `path`, `url`, `referrer`
- `utmSource`, `utmMedium`, `utmCampaign`, `utmContent`
- `nepalDay`, `nepalMonth` — bucketing in **`Asia/Kathmandu`**
- `createdAt` — exact event time (timestamptz)

### Tracking flow

1. Portfolio client posts to **`POST /api/track`** (same origin).
2. `portfolio/app/api/track/route.ts` proxies to admin: **`POST {ASTRADAILY_API_BASE_URL}/api/public/analytics/track`**.
3. Admin inserts into **`PortfolioEvent`**.
4. Admin dashboard reads aggregates + **recent pageviews** (cursor-paginated admin API: `/api/admin/analytics/recent-pageviews`).

### Required env var (portfolio deployment)

On the **portfolio** host:

- **`ASTRADAILY_API_BASE_URL=https://astradailyadmin.org`**

Redeploy after changing env.

---

## DB migrations (Supabase)

Run in **Supabase → SQL Editor**. Files live under `admin-dashboard2/supabase/`.

**Order:**

1. **`schema.sql`** — baseline / full schema (or your existing migrations if you maintain history that way).
2. **`migrate-portfolio-events.sql`** — ensures **`PortfolioEvent`** exists (required for web analytics).
3. **`migrate-portfolio-utm.sql`** — adds `url` + UTM columns + indexes (needed for full link + campaign breakdown).

Most migration scripts are written to be **safe to re-run** (check file headers).

---

## Key documentation files

| File | Purpose |
|------|---------|
| **`AGENTS.md`** | Short AI/developer context at repo root |
| **`.cursor/rules/ao-horoscope-monorepo.mdc`** | Cursor always-on rules (subtree + ask-before-push) |
| **`PROJECT_OVERVIEW.md`** | This file — deep handoff |
| `admin-dashboard2/README.md`, `VERCEL-DEPLOY.md`, `MOBILE-CONNECT.md` | App-specific ops |
