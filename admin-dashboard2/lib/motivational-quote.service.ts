import { randomUUID } from "crypto";
import { query } from "./db";

export async function listMotivationalQuotes() {
  const r = await query(
    `SELECT id, body, "isActive", "createdAt" FROM "MotivationalQuote" ORDER BY "createdAt" DESC`,
  );
  return r.rows as {
    id: string;
    body: string;
    isActive: boolean;
    createdAt: string;
  }[];
}

export async function createMotivationalQuote(body: string, isActive = true) {
  const id = randomUUID();
  const now = new Date().toISOString();
  await query(
    `INSERT INTO "MotivationalQuote" (id, body, "isActive", "createdAt") VALUES ($1, $2, $3, $4)`,
    [id, body.trim(), isActive, now],
  );
  const r = await query(
    `SELECT id, body, "isActive", "createdAt" FROM "MotivationalQuote" WHERE id = $1`,
    [id],
  );
  return r.rows[0];
}
