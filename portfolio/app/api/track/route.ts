import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

/** Accept `https://astradailyadmin.org` or `…/api` (App Router API lives under `/api`). */
function normalizeApiRoot(input: string): string {
  const s = stripTrailingSlash(input.trim());
  if (!s) return s;
  return /\/api$/i.test(s) ? s : `${s}/api`;
}

export async function POST(request: Request) {
  const baseRaw = process.env.ASTRADAILY_API_BASE_URL?.trim() ?? "";
  const base = baseRaw ? normalizeApiRoot(baseRaw) : "";
  if (!base) {
    return NextResponse.json(
      { success: false, error: { message: "Missing ASTRADAILY_API_BASE_URL." } },
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const url = `${base}/public/analytics/track`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const json = await res.json().catch(() => ({}));
  return NextResponse.json(json, { status: res.status });
}

