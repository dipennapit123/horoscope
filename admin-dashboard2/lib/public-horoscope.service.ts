import { query } from "./db";
import type { HoroscopeRow, ZodiacSign } from "./types";
import { mapHoroscopeRow } from "./admin-horoscope.service";

/** Published daily horoscope for a sign on a given UTC calendar day. */
export async function getPublishedHoroscopeByZodiacUtcDay(
  zodiacSign: ZodiacSign,
  utcDay: Date,
): Promise<HoroscopeRow | null> {
  const y = utcDay.getUTCFullYear();
  const m = utcDay.getUTCMonth() + 1;
  const d = utcDay.getUTCDate();
  const dayStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const r = await query<Record<string, unknown>>(
    `SELECT * FROM "Horoscope"
     WHERE "zodiacSign" = $1 AND "isPublished" = true
       AND (date AT TIME ZONE 'UTC')::date = $2::date
     ORDER BY date DESC
     LIMIT 1`,
    [zodiacSign, dayStr],
  );
  const row = r.rows[0];
  return row ? mapHoroscopeRow(row) : null;
}
