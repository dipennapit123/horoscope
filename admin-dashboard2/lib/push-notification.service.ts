import { query } from "./db";
import { getLatestHoroscopeForZodiac } from "./horoscope-user.service";
import type { ZodiacSign } from "./types";

export type Pillar = "WEALTH" | "LOVE" | "HEALTH";

const PILLAR_ORDER: Pillar[] = ["WEALTH", "LOVE", "HEALTH"];

function nextPillar(current: Pillar): Pillar {
  const i = PILLAR_ORDER.indexOf(current);
  return PILLAR_ORDER[(i + 1) % PILLAR_ORDER.length];
}

function truncate(s: string, max = 180): string {
  const t = s.trim();
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`;
}

function zodiacLabel(z: string): string {
  return z.charAt(0) + z.slice(1).toLowerCase();
}

async function ensureCampaignRow(): Promise<{
  id: string;
  nextPillar: Pillar;
  updatedAt: string;
}> {
  const r = await query<{ id: string; nextPillar: string; updatedAt: string }>(
    `SELECT id, "nextPillar", "updatedAt" FROM "NotificationCampaignState" LIMIT 1`,
  );
  if (r.rows.length > 0) {
    const row = r.rows[0];
    return {
      id: row.id,
      nextPillar: row.nextPillar as Pillar,
      updatedAt: row.updatedAt,
    };
  }
  await query(`INSERT INTO "NotificationCampaignState" ("nextPillar") VALUES ('WEALTH')`);
  const r2 = await query<{ id: string; nextPillar: string; updatedAt: string }>(
    `SELECT id, "nextPillar", "updatedAt" FROM "NotificationCampaignState" LIMIT 1`,
  );
  const row = r2.rows[0];
  return {
    id: row.id,
    nextPillar: row.nextPillar as Pillar,
    updatedAt: row.updatedAt,
  };
}

type ExpoMessage = {
  to: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  /** Must match the channel created in the app (`PushNotificationsSetup`). */
  channelId?: string;
  priority?: "default" | "normal" | "high";
  sound?: string | null;
};

type ExpoPushTicket =
  | { status: "ok"; id: string }
  | {
      status: "error";
      message?: string;
      details?: { error?: string };
    };

function buildExpoPayload(m: ExpoMessage): Record<string, unknown> {
  return {
    ...m,
    channelId: m.channelId ?? "default",
    priority: m.priority ?? "high",
  };
}

/**
 * Sends via Expo Push API and parses push tickets. HTTP 200 can still include
 * per-message errors (e.g. DeviceNotRegistered) — those are returned, not thrown.
 */
async function sendExpoPush(messages: ExpoMessage[]): Promise<{
  ticketsAccepted: number;
  ticketErrors: string[];
}> {
  if (messages.length === 0) {
    return { ticketsAccepted: 0, ticketErrors: [] };
  }
  const ticketErrors: string[] = [];
  let ticketsAccepted = 0;
  const CHUNK = 80;
  const payload = messages.map((m) => buildExpoPayload(m));

  for (let i = 0; i < payload.length; i += CHUNK) {
    const chunk = payload.slice(i, i + CHUNK);
    const res = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
      },
      body: JSON.stringify(chunk),
    });
    const text = await res.text();
    if (!res.ok) {
      throw new Error(`Expo push failed: ${res.status} ${text}`);
    }

    let parsed: {
      data?: ExpoPushTicket[] | ExpoPushTicket;
      errors?: { code?: string; message?: string }[];
    };
    try {
      parsed = JSON.parse(text) as typeof parsed;
    } catch {
      throw new Error("Expo push: response was not valid JSON.");
    }

    if (parsed.errors && parsed.errors.length > 0) {
      throw new Error(
        parsed.errors.map((e) => e.message ?? e.code ?? "unknown").join("; "),
      );
    }

    const raw = parsed.data;
    const tickets: ExpoPushTicket[] = Array.isArray(raw)
      ? raw
      : raw
        ? [raw]
        : [];

    for (const t of tickets) {
      if (t.status === "ok") {
        ticketsAccepted += 1;
      } else {
        const code = t.details?.error;
        const msg = t.message ?? code ?? "Unknown ticket error";
        ticketErrors.push(code ? `${code}: ${msg}` : msg);
      }
    }
  }

  return { ticketsAccepted, ticketErrors };
}

export async function getNotificationCampaignState() {
  const row = await ensureCampaignRow();
  return { nextPillar: row.nextPillar };
}

export type NotificationSettingsSnapshot = {
  nextPillar: Pillar;
  campaignUpdatedAt: string | null;
  /** Distinct Expo tokens eligible for motivational sends (PushDevice ∪ User, deduped). */
  devicesWithPushToken: number;
  /** Only signed-in users who also have a zodiac set. */
  usersEligibleForPillarPush: number;
  activeQuote: {
    id: string;
    body: string;
    createdAt: string;
  } | null;
};

/** Full picture of what is configured for push (for admin dashboard). */
export async function getNotificationSettingsSnapshot(): Promise<NotificationSettingsSnapshot> {
  const row = await ensureCampaignRow();

  const cDevices = await query<{ n: string }>(
    `SELECT COUNT(*)::text AS n FROM (
       SELECT "expoPushToken" FROM "PushDevice"
       UNION
       SELECT "expoPushToken" FROM "User"
       WHERE "expoPushToken" IS NOT NULL AND TRIM("expoPushToken") <> ''
     ) t`,
  );
  // User-level count (only signed-in users with zodiac receive pillar pushes).
  const cPillar = await query<{ n: string }>(
    `SELECT COUNT(*)::text AS n FROM "User" WHERE "expoPushToken" IS NOT NULL AND "zodiacSign" IS NOT NULL`,
  );
  const devicesWithPushToken = Number(cDevices.rows[0]?.n ?? 0);
  const usersEligibleForPillarPush = Number(cPillar.rows[0]?.n ?? 0);

  const quote = await query<{ id: string; body: string; createdAt: string }>(
    `SELECT id, body, "createdAt" FROM "MotivationalQuote"
     WHERE "isActive" = true ORDER BY "createdAt" DESC LIMIT 1`,
  );
  const q = quote.rows[0];
  const activeQuote = q
    ? { id: q.id, body: q.body, createdAt: q.createdAt }
    : null;

  return {
    nextPillar: row.nextPillar,
    campaignUpdatedAt: row.updatedAt,
    devicesWithPushToken,
    usersEligibleForPillarPush,
    activeQuote,
  };
}

export async function sendHoroscopePillarNotifications(): Promise<{
  sent: number;
  pillar: Pillar;
  nextPillar: Pillar;
  expoTicketsAccepted: number;
  expoTicketErrors: string[];
}> {
  const row = await ensureCampaignRow();
  const pillar = row.nextPillar;

  const users = await query<{
    expoPushToken: string;
    zodiacSign: string;
  }>(
    `SELECT "expoPushToken", "zodiacSign" FROM "User"
     WHERE "expoPushToken" IS NOT NULL AND "zodiacSign" IS NOT NULL`,
  );

  const messages: ExpoMessage[] = [];

  for (const u of users.rows) {
    const zodiac = u.zodiacSign as ZodiacSign;
    const h = (await getLatestHoroscopeForZodiac(zodiac)) as {
      wealthText?: string;
      loveText?: string;
      healthText?: string;
    } | null;
    if (!h) continue;

    let text = "";
    let label = "";
    if (pillar === "WEALTH") {
      text = h.wealthText ?? "";
      label = "Wealth";
    } else if (pillar === "LOVE") {
      text = h.loveText ?? "";
      label = "Love";
    } else {
      text = h.healthText ?? "";
      label = "Health";
    }
    if (!text) continue;

    const title = `${zodiacLabel(zodiac)} · ${label}`;
    messages.push({
      to: u.expoPushToken,
      title: truncate(title, 60),
      body: truncate(text),
      data: {
        type: "horoscope_pillar",
        pillar: pillar.toLowerCase(),
      },
    });
  }

  const { ticketsAccepted, ticketErrors } = await sendExpoPush(messages);

  const advanced = nextPillar(pillar);
  await query(
    `UPDATE "NotificationCampaignState" SET "nextPillar" = $1, "updatedAt" = now() WHERE id = $2`,
    [advanced, row.id],
  );

  return {
    sent: messages.length,
    pillar,
    nextPillar: advanced,
    expoTicketsAccepted: ticketsAccepted,
    expoTicketErrors: ticketErrors,
  };
}

export async function sendMotivationalQuoteNotifications(params?: {
  quoteId?: string;
}): Promise<{
  sent: number;
  expoTicketsAccepted: number;
  expoTicketErrors: string[];
}> {
  let body: string | null = null;

  if (params?.quoteId) {
    const r = await query<{ body: string }>(
      `SELECT body FROM "MotivationalQuote" WHERE id = $1`,
      [params.quoteId],
    );
    body = r.rows[0]?.body ?? null;
  } else {
    const r = await query<{ body: string }>(
      `SELECT body FROM "MotivationalQuote" WHERE "isActive" = true ORDER BY "createdAt" DESC LIMIT 1`,
    );
    body = r.rows[0]?.body ?? null;
  }

  if (!body) {
    throw new Error("No motivational quote available. Add an active quote first.");
  }

  // Distinct tokens from anonymous device registration (PushDevice) and from
  // signed-in users (User.expoPushToken), so quotes reach installs that never
  // hit /devices/push-token as well as logged-out devices that did.
  const devices = await query<{ expoPushToken: string }>(
    `SELECT "expoPushToken" FROM "PushDevice"
     UNION
     SELECT "expoPushToken" FROM "User"
     WHERE "expoPushToken" IS NOT NULL AND TRIM("expoPushToken") <> ''`,
  );

  const messages: ExpoMessage[] = devices.rows.map((d) => ({
    to: d.expoPushToken,
    title: "AstraDaily message",
    body: truncate(body!, 200),
    data: { type: "motivational_quote" },
  }));

  const { ticketsAccepted, ticketErrors } = await sendExpoPush(messages);
  return {
    sent: messages.length,
    expoTicketsAccepted: ticketsAccepted,
    expoTicketErrors: ticketErrors,
  };
}
