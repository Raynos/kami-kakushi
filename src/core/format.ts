// Pure display helpers (PRD §6.4 core/format, §6.9): the shared K/M/B number
// formatter, moved OUT of the renderer so it's table-driven boundary-tested under
// `pnpm run verify`. Letter notation the whole game — never scientific, never myriad
// man/oku (ui-design.md §5.7). Fixed to 2 decimals max, fixed width (1.20K), so
// digits don't jitter as values tick.

const UNITS: readonly { value: number; suffix: string }[] = [
  { value: 1_000_000_000, suffix: 'B' },
  { value: 1_000_000, suffix: 'M' },
  { value: 1_000, suffix: 'K' },
];

/** Format a (non-negative) number as fixed-width K/M/B with ≤2 decimals. */
export function formatKMB(n: number): string {
  if (!Number.isFinite(n)) return '—';
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);

  // Below 1000: plain integer-ish (no suffix). Round to avoid float dust.
  if (abs < 1000) {
    return sign + String(Math.round(abs));
  }

  for (let i = 0; i < UNITS.length; i++) {
    const unit = UNITS[i]!;
    if (abs >= unit.value) {
      const rounded = Math.round((abs / unit.value) * 100) / 100;
      // Boundary carry: 999_999 rounds to 1000.00K → bump to 1.00M.
      if (rounded >= 1000 && i > 0) {
        const bigger = UNITS[i - 1]!;
        return (
          sign +
          (Math.round((abs / bigger.value) * 100) / 100).toFixed(2) +
          bigger.suffix
        );
      }
      return sign + rounded.toFixed(2) + unit.suffix;
    }
  }
  // Unreachable for finite input ≥ 1000, but keep total:
  return sign + (abs / 1_000_000_000).toFixed(2) + 'B';
}

/** Format a per-unit rate, e.g. `+12/tick` (ui-design.md §5.7 "always show the rate"). */
export function formatRate(perTick: number, unit = 'tick'): string {
  const sign = perTick >= 0 ? '+' : '';
  return `${sign}${formatKMB(perTick)}/${unit}`;
}

// ── Coin denominations (ADR-108, LOCKED) ─────────────────────────────────────────
// Money is ONE quantity — base unit **mon** — rendered in MIXED fixed-denomination
// notation (like £·s·d / a mixed radix). The rate is FIXED for the whole game:
// **1 ryō = 50 monme = 4,000 mon** (so 1 monme = 80 mon). These constants are the
// SINGLE SOURCE for that math — never hard-code the magic numbers a second time; the
// formatter AND its tests derive from them (matches the Bank-of-Japan 1601 primary
// source + the human's worked example, ADR-108). Kept HERE (the pure display module),
// not in balance.ts, because the rate is display-only: it never affects a mechanic.
export const MON_PER_MONME = 80;
export const MONME_PER_RYO = 50;
export const MON_PER_RYO = MON_PER_MONME * MONME_PER_RYO; // 4_000

/**
 * Format a coin amount (base unit **mon**) in MIXED mon→monme→ryō denominations with
 * INCREMENTAL REVEAL (ADR-108) — the notation itself signals the player's rise:
 *   - below 1 monme  (< 80 mon):            `"N mon"`
 *   - 1 monme … <1 ryō (80 … 3,999 mon):    `"M monme K mon"`
 *   - at/above 1 ryō  (≥ 4,000 mon):        `"R ryō M monme K mon"`
 * A higher denomination stays HIDDEN until wealth reaches it (monme at ≥ 80 mon, ryō
 * at ≥ 4,000 mon), and a ZERO sub-part is dropped cleanly — `"6 monme"` not
 * `"6 monme 0 mon"`, `"1 ryō"` not `"1 ryō 0 monme 0 mon"`, `"1 ryō 20 mon"` not
 * `"1 ryō 0 monme 20 mon"`. Non-coin big numbers keep `formatKMB` (koku standing, etc.).
 */
export function formatCoin(mon: number): string {
  if (!Number.isFinite(mon)) return '—';
  const sign = mon < 0 ? '-' : '';
  const abs = Math.round(Math.abs(mon)); // coin is integer mon; round off any float dust
  let rest = abs;
  const parts: string[] = [];

  // ryō — the top column, revealed only once total wealth reaches 1 ryō.
  if (abs >= MON_PER_RYO) {
    const ryo = Math.floor(rest / MON_PER_RYO);
    parts.push(`${ryo} ryō`);
    rest -= ryo * MON_PER_RYO;
  }
  // monme — revealed once total wealth reaches 1 monme; a zero-monme residue is dropped
  // (so "1 ryō 20 mon" keeps its columns in order without a bare "0 monme").
  if (abs >= MON_PER_MONME) {
    const monme = Math.floor(rest / MON_PER_MONME);
    if (monme > 0) parts.push(`${monme} monme`);
    rest -= monme * MON_PER_MONME;
  }
  // mon — the base residue; shown unless it's zero AND a higher column already prints.
  if (rest > 0 || parts.length === 0) parts.push(`${rest} mon`);

  return sign + parts.join(' ');
}
