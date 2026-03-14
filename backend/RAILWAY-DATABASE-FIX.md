# Fix "Database connection refused" on Railway

Your backend returns 503 because it cannot connect to Postgres. Do the following **on the backend service** (the one that runs Node, not the Postgres service).

---

## Option A: Paste the URL manually (most reliable)

1. In Railway, click your **Postgres** service (the database).
2. Open the **Connect** or **Variables** tab.
3. Find the **connection string**. Railway may show:
   - **Public URL** or **Database URL** — copy the full string (starts with `postgresql://`).
   - Or separate fields: Host, Port, User, Password, Database — you’ll build the URL in step 5.
4. Click your **backend** service (the Node app).
5. Open **Variables**.
6. Click **+ New variable** or **Add variable**.
7. **Name (exactly):** `DATABASE_URL`  
   - No space before or after. One word.
8. **Value:** paste the full connection string, e.g.  
   `postgresql://postgres:PASSWORD@host.railway.app:5432/railway`  
   - If you only have Host/User/Password etc., use:  
     `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`  
     (replace USER, PASSWORD, HOST, PORT, DATABASE with the values from Postgres).
9. Save. Redeploy the backend (Deployments → Redeploy).

---

## Option B: Link variable from Postgres (if your Railway has it)

1. Click your **backend** service.
2. **Variables** → **+ New variable**.
3. Choose **“Add a reference”** or **“Link from another service”** or **“Reference”**.
4. Select the **Postgres** service.
5. Select the variable **`DATABASE_URL`** (or **Connection URL** / **Postgres URL**, whatever Railway shows).
6. Save. Redeploy the backend.

---

## Check that it worked

1. Backend service → **Deployments** → open the latest deployment.
2. Open **Logs**.
3. You should see:
   - `[db] Using host: ...` (e.g. `xxx.railway.internal` or `xxx.proxy.rlwy.net`)
   - `[db] Connection OK`
4. If you see `[db] DATABASE_URL is empty` → the variable is still not on the backend. Use Option A and paste the URL.
5. If you see `[db] Connection failed: ...` → the URL is set but wrong (e.g. wrong host or password). Copy the URL again from Postgres and fix the variable.

---

## Common mistakes

- **Variable on the wrong service** — `DATABASE_URL` must be on the **backend** service, not only on Postgres.
- **Name typo** — must be exactly `DATABASE_URL` (no `DATABASE_URL ` or ` DATABASE_URL`).
- **No redeploy** — after changing variables, redeploy the backend so the new value is loaded.
