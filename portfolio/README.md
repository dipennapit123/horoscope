# Portfolio website

Marketing/portfolio site for the **AstraDaily** app. This is a standalone Next.js project under `portfolio/` (separate from `admin-dashboard2/`).

## Run locally

```bash
cd portfolio
npm install
npm run dev
```

Open `http://localhost:3000`.

## Update content

Most text/links live in:

- `src/content/site.ts`

In particular, update:

- `metadataBaseUrl`: your production domain (used for sitemap + canonical metadata)
- `storeLinks.ios` / `storeLinks.android`: your real App Store / Google Play URLs
- `demo.youtubeUrl`: a YouTube link (watch URLs are auto-converted to embed URLs)
- `heroScreens`: paths and dimensions for the **two overlapping phone images** on the home hero (files live in `public/hero/`)

## Screenshots

Screenshots are expected at:

- `public/screenshots/`

and are referenced from:

- `src/content/site.ts` (`site.screenshots`)

## Deploy (Vercel)

Create a new Vercel project and set the **Root Directory** to `portfolio/`.

- **Build Command**: `npm run build`
- **Output**: Next.js default

No environment variables are required by default.
