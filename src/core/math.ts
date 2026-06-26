// Pure integer/clamp helpers for the deterministic core.
//
// The core BANS Math.pow / exp / log / trig (ESLint-enforced, PRD §6.1 / Q36):
// every growth-curve power is integer-pow-by-repeated-multiplication so a fixed
// seed replays byte-identically across engines and an exported save is portable.
// Math.sqrt is the one whitelisted transcendental.

/** Integer power by repeated squaring. `exp` must be a non-negative integer. */
export function ipow(base: number, exp: number): number {
  if (!Number.isInteger(exp) || exp < 0) {
    throw new Error(`ipow: exponent must be a non-negative integer, got ${exp}`);
  }
  let result = 1;
  let b = base;
  let e = exp;
  while (e > 0) {
    if ((e & 1) === 1) result *= b;
    e >>= 1;
    if (e > 0) b *= b;
  }
  return result;
}

/** Clamp `x` to the inclusive range [lo, hi]. */
export function clamp(x: number, lo: number, hi: number): number {
  if (x < lo) return lo;
  if (x > hi) return hi;
  return x;
}
