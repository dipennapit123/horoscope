/**
 * Monday 12:00 UTC of the week containing `date` (tropical week boundary for admin + public API).
 */
export function utcMondayWeekStartContaining(date: Date): Date {
  const noon = new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      12,
      0,
      0,
      0,
    ),
  );
  const dow = noon.getUTCDay(); // 0 Sun .. 6 Sat
  const daysSinceMonday = (dow + 6) % 7; // Mon -> 0, Sun -> 6
  return new Date(
    Date.UTC(
      noon.getUTCFullYear(),
      noon.getUTCMonth(),
      noon.getUTCDate() - daysSinceMonday,
      12,
      0,
      0,
      0,
    ),
  );
}

/** `YYYY-MM-DD` for a UTC calendar date (from Date at UTC noon). */
export function formatUtcDateString(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
