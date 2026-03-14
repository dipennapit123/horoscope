import { Router } from "express";
import { ping } from "../db";
import { userRouter } from "../modules/user/user.routes";
import { horoscopeRouter } from "../modules/horoscope/horoscope.routes";
import { adminHoroscopeRouter } from "../modules/admin/admin-horoscope.routes";
import { adminUsersRouter } from "../modules/admin/admin-users.routes";

export const router = Router();

/** Health check: verifies API and DB. GET /api/health — when database is "connected", user data is available. */
router.get("/health", async (_req, res) => {
  let database: "connected" | "disconnected" = "disconnected";
  try {
    await ping();
    database = "connected";
  } catch {
    // leave database as disconnected
  }
  // Expose deploy commit so you can verify Vercel is running the latest push (Vercel sets VERCEL_GIT_COMMIT_SHA)
  const commit = process.env.VERCEL_GIT_COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_REF || null;
  res.json({
    success: true,
    data: {
      status: "ok",
      database,
      deployCommit: commit || undefined,
      message:
        database === "connected"
          ? "Database connected; horoscopes and user data will be served."
          : "Database not connected; set DATABASE_URL and ensure Postgres is running.",
    },
  });
});

router.use("/users", userRouter);
router.use("/horoscopes", horoscopeRouter);
router.use("/admin/horoscopes", adminHoroscopeRouter);
router.use("/admin/users", adminUsersRouter);

