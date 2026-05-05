import { randomUUID } from "crypto";
import { query } from "./db";
import type { WeeklyHoroscopeRow, ZodiacSign } from "./types";
import { generateWeeklyContent } from "./weekly-generator";
import type { HoroscopeTone } from "./weekly-generator";
import { formatUtcDateString, utcMondayWeekStartContaining } from "./week-utc";

export function mapWeeklyHoroscopeRow(row: Record<string, unknown>): WeeklyHoroscopeRow {
  const wsd = row.weekStartDate ?? row.weekstartdate;
  const weekStartDate =
    wsd instanceof Date
      ? wsd
      : typeof wsd === "string"
        ? new Date(`${wsd}T12:00:00.000Z`)
        : new Date(String(wsd));
  return {
    id: row.id as string,
    zodiacSign: row.zodiacSign as ZodiacSign,
    weekStartDate,
    title: (row.title as string) ?? "",
    outlookText: row.outlookText as string,
    isPublished: Boolean(row.isPublished),
    createdAt: row.createdAt instanceof Date ? row.createdAt : new Date(row.createdAt as string),
    updatedAt: row.updatedAt instanceof Date ? row.updatedAt : new Date(row.updatedAt as string),
  };
}

export async function listWeeklyHoroscopes(params: {
  zodiacSign?: ZodiacSign;
  page?: number;
  pageSize?: number;
}): Promise<WeeklyHoroscopeRow[]> {
  const page = params.page && params.page > 0 ? params.page : 1;
  const take = params.pageSize && params.pageSize > 0 ? params.pageSize : 20;
  const skip = (page - 1) * take;
  const conditions: string[] = [];
  const values: unknown[] = [];
  let idx = 1;
  if (params.zodiacSign) {
    conditions.push(`"zodiacSign" = $${idx++}`);
    values.push(params.zodiacSign);
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const limitIdx = idx++;
  const offsetIdx = idx++;
  const r = await query<Record<string, unknown>>(
    `SELECT * FROM "WeeklyHoroscope" ${where}
     ORDER BY "weekStartDate" DESC, "zodiacSign" ASC
     LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
    [...values, take, skip],
  );
  return r.rows.map((row) => mapWeeklyHoroscopeRow(row));
}

export async function getWeeklyHoroscopeById(id: string): Promise<WeeklyHoroscopeRow | null> {
  const r = await query<Record<string, unknown>>(
    `SELECT * FROM "WeeklyHoroscope" WHERE id = $1`,
    [id],
  );
  const row = r.rows[0];
  return row ? mapWeeklyHoroscopeRow(row) : null;
}

export async function getPublishedWeeklyForZodiacWeek(
  zodiacSign: ZodiacSign,
  weekStart: Date,
): Promise<WeeklyHoroscopeRow | null> {
  const dayStr = formatUtcDateString(utcMondayWeekStartContaining(weekStart));
  const r = await query<Record<string, unknown>>(
    `SELECT * FROM "WeeklyHoroscope"
     WHERE "zodiacSign" = $1 AND "weekStartDate" = $2::date AND "isPublished" = true
     LIMIT 1`,
    [zodiacSign, dayStr],
  );
  const row = r.rows[0];
  return row ? mapWeeklyHoroscopeRow(row) : null;
}

export async function upsertWeeklyDraft(params: {
  zodiacSign: ZodiacSign;
  weekStartDate: Date;
  title: string;
  outlookText: string;
}): Promise<WeeklyHoroscopeRow> {
  const id = randomUUID();
  const now = new Date().toISOString();
  const monday = utcMondayWeekStartContaining(params.weekStartDate);
  const dayStr = formatUtcDateString(monday);
  const r = await query<Record<string, unknown>>(
    `INSERT INTO "WeeklyHoroscope" (
      id, "zodiacSign", "weekStartDate", title, "outlookText", "isPublished", "createdAt", "updatedAt"
    ) VALUES ($1, $2, $3::date, $4, $5, false, $6::timestamptz, $6::timestamptz)
    ON CONFLICT ("zodiacSign", "weekStartDate") DO UPDATE SET
      title = EXCLUDED.title,
      "outlookText" = EXCLUDED."outlookText",
      "isPublished" = false,
      "updatedAt" = EXCLUDED."updatedAt"
    RETURNING *`,
    [id, params.zodiacSign, dayStr, params.title, params.outlookText, now],
  );
  const row = r.rows[0];
  if (!row) throw new Error("Weekly upsert failed");
  return mapWeeklyHoroscopeRow(row);
}

export async function updateWeeklyHoroscope(
  id: string,
  data: { title?: string; outlookText?: string; isPublished?: boolean },
): Promise<WeeklyHoroscopeRow> {
  const updates: string[] = [];
  const values: unknown[] = [];
  let idx = 1;
  const set = (col: string, val: unknown) => {
    updates.push(`"${col}" = $${idx++}`);
    values.push(val);
  };
  if (data.title !== undefined) set("title", data.title);
  if (data.outlookText !== undefined) set("outlookText", data.outlookText);
  if (data.isPublished !== undefined) set("isPublished", data.isPublished);
  if (updates.length === 0) {
    const row = await getWeeklyHoroscopeById(id);
    if (!row) throw new Error("Weekly not found");
    return row;
  }
  set("updatedAt", new Date().toISOString());
  values.push(id);
  await query(
    `UPDATE "WeeklyHoroscope" SET ${updates.join(", ")} WHERE id = $${idx}`,
    values,
  );
  const row = await getWeeklyHoroscopeById(id);
  if (!row) throw new Error("Weekly not found");
  return row;
}

export async function deleteWeeklyHoroscope(id: string) {
  await query(`DELETE FROM "WeeklyHoroscope" WHERE id = $1`, [id]);
}

export async function publishWeeklyHoroscope(
  id: string,
  isPublished: boolean,
): Promise<WeeklyHoroscopeRow> {
  return updateWeeklyHoroscope(id, { isPublished });
}

export async function generateWeeklyHoroscopeForSign(input: {
  zodiacSign: ZodiacSign;
  weekStartDate: Date;
  tone: HoroscopeTone;
  notes?: string;
}): Promise<WeeklyHoroscopeRow> {
  const content = await generateWeeklyContent({
    zodiacSign: input.zodiacSign,
    weekStartDate: utcMondayWeekStartContaining(input.weekStartDate),
    tone: input.tone,
    notes: input.notes,
  });
  return upsertWeeklyDraft({
    zodiacSign: input.zodiacSign,
    weekStartDate: input.weekStartDate,
    title: content.title,
    outlookText: content.outlookText,
  });
}
