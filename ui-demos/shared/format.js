// ui-demos/shared/format.js — number formatting, mirroring src/core/format.ts
// exactly so the mock reads like the live game.

// K/M/B fixed-width, ≤2 decimals — rice, wood, sansai (e.g. "1.20K").
export function formatKMB(n) {
  const v = Math.floor(n);
  if (v < 1000) return String(v);
  if (v < 1_000_000) return trim2(v / 1000) + 'K';
  if (v < 1_000_000_000) return trim2(v / 1_000_000) + 'M';
  return trim2(v / 1_000_000_000) + 'B';
}

function trim2(x) {
  // ≤2 decimals, no trailing zeros beyond what fixed-width needs ("1.20", "12.4", "123")
  if (x >= 100) return String(Math.floor(x));
  if (x >= 10) return (Math.floor(x * 10) / 10).toFixed(1);
  return (Math.floor(x * 100) / 100).toFixed(2);
}

// Coin: mixed mon → monme → ryō with incremental reveal (src/core/format.ts).
// 1 ryō = 50 monme = 4,000 mon; 1 monme = 80 mon.
// < 80 mon        → "N mon"
// 80–3,999 mon    → "M monme K mon"   (zero sub-parts dropped)
// ≥ 4,000 mon     → "R ryō M monme K mon" (zero sub-parts dropped)
export const MON_PER_MONME = 80;
export const MON_PER_RYO = 4000;

export function formatCoin(mon) {
  const v = Math.floor(mon);
  if (v < MON_PER_MONME) return `${v} mon`;
  const parts = [];
  let rest = v;
  if (rest >= MON_PER_RYO) {
    parts.push(`${Math.floor(rest / MON_PER_RYO)} ryō`);
    rest %= MON_PER_RYO;
  }
  if (rest >= MON_PER_MONME) {
    parts.push(`${Math.floor(rest / MON_PER_MONME)} monme`);
    rest %= MON_PER_MONME;
  }
  if (rest > 0) parts.push(`${rest} mon`);
  return parts.join(' ');
}
