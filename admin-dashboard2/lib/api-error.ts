export class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

const DB_UNAVAILABLE_MSG =
  "Database unavailable. Set DATABASE_URL (and DATABASE_URL_POOLER on Vercel) in Environment Variables and ensure Supabase project is not paused.";

/** True if this looks like a Postgres / pg driver connection problem (not Expo Push, not generic fetch). */
function isDbConnectionError(msg: string, code: string | undefined): boolean {
  const lower = msg.toLowerCase();

  // Never classify these as DB — common false positives (otherwise we return 503 with the wrong hint).
  if (
    lower.includes("exp.host") ||
    lower.includes("expo push") ||
    lower.includes("exponentpushtoken") ||
    (lower.includes("fetch") && !lower.includes("postgres") && !lower.includes("5432"))
  ) {
    return false;
  }

  // Actionable pooler misconfiguration — return 500 with full text from db.ts, not generic 503.
  if (lower.startsWith("supabase pooler rejected the database user")) return false;

  const pgHints =
    lower.includes("postgres") ||
    lower.includes("postgresql") ||
    lower.includes("supabase") ||
    lower.includes("pooler.supabase") ||
    lower.includes(":5432") ||
    lower.includes(":6543") ||
    lower.includes("password authentication failed") ||
    lower.includes("role \"") ||
    lower.includes("tenant or user not found") ||
    lower.includes("database \"") ||
    lower.includes("pg_hba") ||
    lower.includes("no pg_hba") ||
    lower.includes("server closed the connection") ||
    lower.includes("connection terminated") ||
    lower.includes("database not configured") ||
    lower.includes("ssl connection") ||
    lower.includes("self signed certificate") ||
    lower.includes("certificate verify failed");

  const strongPg = [
    "tenant or user not found",
    "connection terminated",
    "database not configured",
    "password authentication failed",
  ].some((p) => lower.includes(p));

  if (strongPg) return true;

  if (
    code &&
    ["ECONNREFUSED", "ENOTFOUND", "ECONNRESET", "ETIMEDOUT"].includes(code) &&
    pgHints
  ) {
    return true;
  }

  if (
    (lower.includes("connect econnrefused") ||
      lower.includes("connect etimedout") ||
      lower.includes("getaddrinfo enotfound")) &&
    pgHints
  ) {
    return true;
  }

  return false;
}

export function handleApiError(err: unknown): { status: number; message: string } {
  if (err instanceof ApiError) {
    return { status: err.statusCode, message: err.message };
  }
  const msg = err instanceof Error ? err.message : "Unexpected server error.";
  const code = (err as NodeJS.ErrnoException)?.code;
  const fullStr = String(err);
  // Log full error server-side so Vercel/debugging shows the real cause (Project → Logs)
  console.error("[api-error] message=", msg, "code=", code ?? "(none)", "full=", fullStr);
  if (err instanceof Error && err.stack) {
    console.error("[api-error] stack:", err.stack);
  }
  if (isDbConnectionError(msg, code) || isDbConnectionError(fullStr, code)) {
    return { status: 503, message: DB_UNAVAILABLE_MSG };
  }
  return { status: 500, message: msg };
}
