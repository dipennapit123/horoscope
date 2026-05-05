import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { ApiError, handleApiError } from "@/lib/api-error";

export const dynamic = "force-dynamic";

const NEPAL_TZ = "Asia/Kathmandu";

type TrackBody = {
  visitorId?: string;
  sessionId?: string;
  eventName?: string;
  path?: string;
  url?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
};

function isLikelyBot(userAgent: string | null): boolean {
  const ua = (userAgent ?? "").toLowerCase();
  if (!ua) return false;
  return (
    ua.includes("bot") ||
    ua.includes("spider") ||
    ua.includes("crawler") ||
    ua.includes("headless") ||
    ua.includes("lighthouse")
  );
}

function clampText(v: unknown, maxLen: number): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (!s) return null;
  return s.length > maxLen ? s.slice(0, maxLen) : s;
}

function requireId(value: string | null, name: string) {
  if (!value) throw new ApiError(400, `Missing ${name}.`);
  if (value.length < 8 || value.length > 120) {
    throw new ApiError(400, `Invalid ${name}.`);
  }
  return value;
}

const ALLOWED_EVENTS = new Set(["pageview", "horoscope_view", "store_click"]);

export async function POST(request: NextRequest) {
  try {
    const ua = request.headers.get("user-agent");
    if (isLikelyBot(ua)) {
      return NextResponse.json({ success: true, data: { recorded: false, reason: "bot" } });
    }

    const raw = (await request.json().catch(() => ({}))) as TrackBody;
    const visitorId = requireId(clampText(raw.visitorId, 120), "visitorId");
    const sessionId = requireId(clampText(raw.sessionId, 120), "sessionId");
    const eventName = clampText(raw.eventName, 40) ?? "pageview";
    if (!ALLOWED_EVENTS.has(eventName)) throw new ApiError(400, "Invalid eventName.");

    const path = clampText(raw.path, 500);
    const urlText = clampText(raw.url, 1000);
    const referrer = clampText(raw.referrer, 500);
    const utmSource = clampText(raw.utmSource, 120);
    const utmMedium = clampText(raw.utmMedium, 120);
    const utmCampaign = clampText(raw.utmCampaign, 160);
    const utmContent = clampText(raw.utmContent, 160);
    const userAgent = clampText(ua ?? "", 400);

    await query(
      `INSERT INTO "PortfolioEvent"
        ("visitorId","sessionId","eventName",path,url,referrer,"utmSource","utmMedium","utmCampaign","utmContent","userAgent","nepalDay","nepalMonth")
       VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,
         (now() AT TIME ZONE $12)::date,
         date_trunc('month', now() AT TIME ZONE $12)::date
        )`,
      [
        visitorId,
        sessionId,
        eventName,
        path,
        urlText,
        referrer,
        utmSource,
        utmMedium,
        utmCampaign,
        utmContent,
        userAgent,
        NEPAL_TZ,
      ],
    );

    return NextResponse.json({ success: true, data: { recorded: true } });
  } catch (err) {
    const { status, message } = handleApiError(err);
    return NextResponse.json({ success: false, error: { message } }, { status });
  }
}

export async function GET(request: NextRequest) {
  // Allow quick testing: GET /api/public/analytics/track?path=/...&eventName=pageview&visitorId=...&sessionId=...
  const url = new URL(request.url);
  const visitorId = url.searchParams.get("visitorId") ?? undefined;
  const sessionId = url.searchParams.get("sessionId") ?? undefined;
  const eventName = url.searchParams.get("eventName") ?? undefined;
  const path = url.searchParams.get("path") ?? undefined;
  const fullUrl = url.searchParams.get("url") ?? undefined;
  const referrer = url.searchParams.get("referrer") ?? undefined;
  const utmSource = url.searchParams.get("utm_source") ?? url.searchParams.get("utmSource") ?? undefined;
  const utmMedium = url.searchParams.get("utm_medium") ?? url.searchParams.get("utmMedium") ?? undefined;
  const utmCampaign = url.searchParams.get("utm_campaign") ?? url.searchParams.get("utmCampaign") ?? undefined;
  const utmContent = url.searchParams.get("utm_content") ?? url.searchParams.get("utmContent") ?? undefined;
  return POST(
    new NextRequest(request.url, {
      method: "POST",
      headers: request.headers,
      body: JSON.stringify({
        visitorId,
        sessionId,
        eventName,
        path,
        url: fullUrl,
        referrer,
        utmSource,
        utmMedium,
        utmCampaign,
        utmContent,
      }),
    }),
  );
}

