"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getOrCreateSessionId, getOrCreateVisitorId } from "@/src/lib/analyticsIds";

type TrackPayload = {
  visitorId: string;
  sessionId: string;
  eventName: "pageview" | "horoscope_view" | "store_click";
  path?: string;
  url?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
};

function clamp(v: string | null, max: number) {
  if (!v) return undefined;
  const s = v.trim();
  if (!s) return undefined;
  return s.length > max ? s.slice(0, max) : s;
}

async function track(payload: TrackPayload) {
  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
      keepalive: true,
    });
  } catch {
    // Best-effort only; never block UI.
  }
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryString = useMemo(() => {
    const s = searchParams?.toString() ?? "";
    return s ? `?${s}` : "";
  }, [searchParams]);

  useEffect(() => {
    const visitorId = getOrCreateVisitorId();
    const sessionId = getOrCreateSessionId();

    const url = clamp(`${window.location.origin}${pathname ?? ""}${queryString}`, 1000);
    const path = clamp(`${pathname ?? ""}${queryString}`, 500);

    const utmSource = clamp(searchParams?.get("utm_source") ?? null, 120);
    const utmMedium = clamp(searchParams?.get("utm_medium") ?? null, 120);
    const utmCampaign = clamp(searchParams?.get("utm_campaign") ?? null, 160);
    const utmContent = clamp(searchParams?.get("utm_content") ?? null, 160);

    void track({
      visitorId,
      sessionId,
      eventName: "pageview",
      path,
      url,
      referrer: clamp(document.referrer || null, 500),
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, queryString]);

  return null;
}

