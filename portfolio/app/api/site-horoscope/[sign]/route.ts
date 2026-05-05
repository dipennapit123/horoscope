import { NextResponse } from "next/server";
import {
  parseSiteHoroscopeBundle,
  parseSiteWeekly,
} from "@/src/lib/normalize-admin-horoscope";
import type {
  SiteHoroscopeBundle,
  SiteWeekly,
} from "@/src/types/site-horoscope";

export const dynamic = "force-dynamic";

const FETCH_TIMEOUT_MS = 20_000;

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

async function fetchWithTimeout(url: string): Promise<Response | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, {
      cache: "no-store",
      next: { revalidate: 0 },
      signal: ctrl.signal,
    });
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Accept `https://admin.example.com` or `…/api` (App Router API lives under `/api`). */
function normalizeApiRoot(input: string): string {
  const s = stripTrailingSlash(input.trim());
  if (!s) return s;
  return /\/api$/i.test(s) ? s : `${s}/api`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sign: string }> },
) {
  const { sign: signParam } = await params;
  const signSlug = decodeURIComponent(signParam ?? "").trim().toLowerCase();
  const baseRaw = process.env.ASTRADAILY_API_BASE_URL?.trim() ?? "";
  const base = baseRaw ? normalizeApiRoot(baseRaw) : "";

  if (!base) {
    return NextResponse.json({
      success: true,
      configured: false,
      liveData: false,
      upstreamError: false,
      bundle: null,
      weekly: null,
    });
  }

  let upstreamError = false;
  let bundle: SiteHoroscopeBundle = {
    yesterday: null,
    today: null,
    tomorrow: null,
  };
  let weekly: SiteWeekly = null;

  const bundleUrl = `${base}/public/horoscopes/bundle?sign=${encodeURIComponent(signSlug)}`;
  const bundleRes = await fetchWithTimeout(bundleUrl);
  if (!bundleRes?.ok) {
    upstreamError = true;
  } else {
    const json = (await bundleRes.json().catch(() => ({}))) as {
      success?: boolean;
      data?: unknown;
    };
    if (!json.success) {
      upstreamError = true;
    } else {
      bundle = parseSiteHoroscopeBundle(json.data ?? null);
    }
  }

  const weeklyUrl = `${base}/public/horoscopes/weekly?sign=${encodeURIComponent(signSlug)}`;
  const weeklyRes = await fetchWithTimeout(weeklyUrl);
  if (!weeklyRes?.ok) {
    upstreamError = true;
  } else {
    const wj = (await weeklyRes.json().catch(() => ({}))) as {
      success?: boolean;
      data?: unknown;
    };
    if (!wj.success) {
      upstreamError = true;
    } else if (wj.data != null && typeof wj.data === "object") {
      weekly = parseSiteWeekly(wj.data);
    }
  }

  const modes = [bundle.yesterday, bundle.today, bundle.tomorrow];
  const liveData = modes.some((row) => row != null && typeof row === "object");

  return NextResponse.json({
    success: true,
    configured: true,
    liveData,
    upstreamError,
    bundle,
    weekly,
  });
}
