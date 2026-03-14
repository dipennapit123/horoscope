# Railway: Variables not reaching the container

Your logs show `[startup] DATABASE_URL or SUPABASE_DB_URL: NOT SET` — the **backend service** is not receiving the variables. Follow this exactly.

## Step 1: Open the backend service

1. Go to [railway.app](https://railway.app) → your project.
2. Click the **service** that was created from **AstraDaily-Backend** (the one that runs `node dist/server.js`).
3. Do **not** use:
   - A "Postgres" or "Database" service
   - "Project Settings" or project-level variables

## Step 2: Add variables on that service

1. With the **backend** service selected, open the **Variables** tab (or **Settings** → **Variables**).
2. Use **Raw Editor** or **Bulk add** if available — then paste one variable per line, no quotes, no spaces around `=`:

```env
DATABASE_URL=postgresql://postgres:Laxmibasnet%401@db.tkfdajsukbgrgipvrbly.supabase.co:5432/postgres
ADMIN_JWT_SECRET=U961ViNx7epiXE6BLSo7eox5GkXM62MlBiaCYb32H9E=
NODE_ENV=production
```

(Replace the Supabase URL if yours is different; keep `%40` for `@` in the password. Use your real `ADMIN_JWT_SECRET` from your local `.env`.)

3. If there is no Raw Editor, add **each variable one by one**:
   - Click **+ New variable** or **Add variable**.
   - **Name:** `DATABASE_URL` (copy-paste so there’s no space or typo).
   - **Value:** paste your full Supabase URL (with `%40` for `@` in password).
   - Save, then add `ADMIN_JWT_SECRET` the same way.

## Step 3: Confirm they’re on the right service

In the Variables list you should see at least:

- `DATABASE_URL`
- `ADMIN_JWT_SECRET`

If you don’t see them, you’re likely on the wrong service (e.g. Postgres). Go back to Step 1 and select the backend service.

## Step 4: Redeploy

1. Open the **Deployments** tab for the **same backend** service.
2. Click the **⋮** or **Redeploy** on the latest deployment.
3. Wait for the new deployment to finish and check **Logs**.

## Step 5: Check logs

You should see:

- `[startup] DATABASE_URL or SUPABASE_DB_URL: set`
- `[db] Using host: db.tkfdajsukbgrgipvrbly.supabase.co`
- `[db] Connection OK`

If you still see `NOT SET`, the container is not getting the variables. Then:

- Confirm again you’re on the **backend** service (not Postgres, not another service).
- If Railway has **Environments** (e.g. Production / Preview), add the variables in the environment that’s used for this deployment.
- Try removing `DATABASE_URL` and adding it again, then redeploy once more.
