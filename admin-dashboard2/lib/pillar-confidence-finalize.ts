import { clampHoroscopeConfidence } from "./mood-board";

/**
 * Light heuristic: nudge pillar score from tone words in that pillar's copy
 * (same language as the model, no second LLM).
 */
export function keywordToneDelta(text: string): number {
  const t = text.toLowerCase();
  const hard =
    t.match(
      /\b(challeng|tension|strain|friction|avoid|cautious|difficult|heavy|stuck|worry|drain|block|clash|rift|delay|risk|stress|uncertain|tough)\b/g,
    )?.length ?? 0;
  const soft =
    t.match(
      /\b(open|ease|flow|support|gentle|kind|lift|soft|steady|repair|warm|clear|aligned|relief|renew|calm|bright|small win|progress)\b/g,
    )?.length ?? 0;
  return Math.min(10, Math.max(-10, (soft - hard) * 2));
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** If the triplet is too flat, widen to at least `minSpread` using a stable salt. */
export function ensureMinimumPillarSpread(
  love: number,
  wealth: number,
  health: number,
  salt: string,
  minSpread = 9,
): { love: number; wealth: number; health: number } {
  const l = clampHoroscopeConfidence(love);
  const w = clampHoroscopeConfidence(wealth);
  const h = clampHoroscopeConfidence(health);
  if (Math.max(l, w, h) - Math.min(l, w, h) >= minSpread) {
    return { love: l, wealth: w, health: h };
  }
  const base = Math.round((l + w + h) / 3);
  const h0 = hashString(salt);
  const spreads: Array<[number, number, number]> = [
    [7, 0, -7],
    [-5, 8, -3],
    [6, -4, -2],
    [-3, 5, -2],
  ];
  const [dl, dw, dh] = spreads[h0 % spreads.length]!;
  return {
    love: clampHoroscopeConfidence(base + dl),
    wealth: clampHoroscopeConfidence(base + dw),
    health: clampHoroscopeConfidence(base + dh),
  };
}

export function finalizePillarConfidences(params: {
  love: number;
  wealth: number;
  health: number;
  loveText: string;
  wealthText: string;
  healthText: string;
  /** Zodiac + date + snippet for stable spread when the model is flat. */
  salt: string;
}): { loveConfidence: number; wealthConfidence: number; healthConfidence: number } {
  const l = clampHoroscopeConfidence(params.love + keywordToneDelta(params.loveText));
  const w = clampHoroscopeConfidence(params.wealth + keywordToneDelta(params.wealthText));
  const h = clampHoroscopeConfidence(params.health + keywordToneDelta(params.healthText));
  const spread = ensureMinimumPillarSpread(l, w, h, params.salt);
  return {
    loveConfidence: spread.love,
    wealthConfidence: spread.wealth,
    healthConfidence: spread.health,
  };
}
