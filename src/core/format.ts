// Pure display helpers (PRD §6.4 core/format, §6.9): the shared K/M/B number
// formatter, moved OUT of the renderer so it's table-driven boundary-tested under
// `npm run verify`. Letter notation the whole game — never scientific, never myriad
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
        return sign + (Math.round((abs / bigger.value) * 100) / 100).toFixed(2) + bigger.suffix;
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
