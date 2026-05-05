function randomId(): string {
  // Good-enough anonymous ID (crypto random UUID when available).
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return (crypto as Crypto).randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`;
}

export function getOrCreateVisitorId(): string {
  const name = "visitorId";
  const cookies = typeof document !== "undefined" ? document.cookie.split(";") : [];
  const found = cookies
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  if (found) return decodeURIComponent(found.slice(`${name}=`.length));

  const id = randomId();
  const maxAge = 60 * 60 * 24 * 365; // 1 year
  document.cookie = `${name}=${encodeURIComponent(id)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
  return id;
}

export function getOrCreateSessionId(): string {
  const KEY_ID = "portfolio_session_id";
  const KEY_AT = "portfolio_session_last_at";
  try {
    const now = Date.now();
    const last = Number(localStorage.getItem(KEY_AT) ?? "0");
    const idleMs = now - last;
    const shouldRotate = !last || idleMs > 30 * 60 * 1000; // 30 min
    let id = localStorage.getItem(KEY_ID);
    if (!id || shouldRotate) {
      id = randomId();
      localStorage.setItem(KEY_ID, id);
    }
    localStorage.setItem(KEY_AT, String(now));
    return id;
  } catch {
    return randomId();
  }
}

