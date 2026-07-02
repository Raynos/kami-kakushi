import { describe, it, expect } from 'vitest';
import {
  formatKMB,
  formatRate,
  formatCoin,
  MON_PER_MONME,
  MONME_PER_RYO,
  MON_PER_RYO,
} from './format';

describe('K/M/B formatter', () => {
  it('formats sub-thousand as integers', () => {
    expect(formatKMB(0)).toBe('0');
    expect(formatKMB(42)).toBe('42');
    expect(formatKMB(999)).toBe('999');
  });

  it('formats K/M/B with two decimals, fixed width', () => {
    expect(formatKMB(1000)).toBe('1.00K');
    expect(formatKMB(1234)).toBe('1.23K');
    expect(formatKMB(12_400)).toBe('12.40K');
    expect(formatKMB(3_100_000)).toBe('3.10M');
    expect(formatKMB(2_700_000_000)).toBe('2.70B');
  });

  it('carries at the unit boundary', () => {
    expect(formatKMB(999_999)).toBe('1.00M');
    expect(formatKMB(999_999_999)).toBe('1.00B');
  });

  it('never uses scientific notation', () => {
    expect(formatKMB(1.2e7)).not.toContain('e');
    expect(formatKMB(1.2e7)).toBe('12.00M');
  });

  it('formatRate prefixes a sign and a unit', () => {
    expect(formatRate(12, 'coin')).toBe('+12/coin');
    expect(formatRate(-3, 'tick')).toBe('-3/tick');
  });
});

describe('coin denominations (D-108 — mixed mon/monme/ryō)', () => {
  // The LOCKED fixed rate is the design lever every other case derives from, so it is
  // asserted first: 1 ryō = 50 monme = 4,000 mon (1 monme = 80 mon). If someone edits a
  // constant, this — and every fixture below (all built FROM the constants) — goes RED.
  it('holds the fixed-rate identities (the locked D-108 denomination math)', () => {
    expect(MON_PER_MONME).toBe(80);
    expect(MONME_PER_RYO).toBe(50);
    expect(MON_PER_RYO).toBe(4000);
    expect(MON_PER_RYO).toBe(MON_PER_MONME * MONME_PER_RYO); // 4000 === 80 × 50
  });

  it('shows mon only below one monme', () => {
    expect(formatCoin(0)).toBe('0 mon');
    expect(formatCoin(42)).toBe('42 mon');
    expect(formatCoin(MON_PER_MONME - 1)).toBe('79 mon'); // 79 mon = 1 monme − 1
  });

  it('shows an exact monme with no trailing "0 mon"', () => {
    expect(formatCoin(MON_PER_MONME)).toBe('1 monme'); // 80 mon
    expect(formatCoin(2 * MON_PER_MONME)).toBe('2 monme'); // clean drop of the zero mon part
  });

  it('breaks monme + mon (the human worked example: 500 mon)', () => {
    // 6 monme (6×80 = 480) + 20 mon = 500 mon — the exact example from D-108.
    expect(6 * MON_PER_MONME + 20).toBe(500);
    expect(formatCoin(6 * MON_PER_MONME + 20)).toBe('6 monme 20 mon');
  });

  it('breaks ryō + monme + mon', () => {
    // 1 ryō (4000) + 6 monme (480) + 20 mon = 4500 mon.
    expect(MON_PER_RYO + 6 * MON_PER_MONME + 20).toBe(4500);
    expect(formatCoin(MON_PER_RYO + 6 * MON_PER_MONME + 20)).toBe('1 ryō 6 monme 20 mon');
  });

  it('drops zero sub-parts cleanly at the ryō tier', () => {
    expect(formatCoin(MON_PER_RYO)).toBe('1 ryō'); // no "0 monme 0 mon"
    expect(formatCoin(MON_PER_RYO + 20)).toBe('1 ryō 20 mon'); // drops the zero monme column
    expect(formatCoin(MON_PER_RYO + MON_PER_MONME)).toBe('1 ryō 1 monme'); // drops the zero mon
  });

  it('reveals each denomination only once wealth reaches it (incremental reveal)', () => {
    // monme is hidden just below 80 mon, present at 80; ryō hidden below 4000, present at 4000.
    expect(formatCoin(MON_PER_MONME - 1)).not.toContain('monme');
    expect(formatCoin(MON_PER_MONME)).toContain('monme');
    expect(formatCoin(MON_PER_RYO - 1)).not.toContain('ryō');
    expect(formatCoin(MON_PER_RYO)).toContain('ryō');
  });

  it('conserves the total across the mixed-radix breakdown (no coin lost or gained)', () => {
    // Parse the rendered denominations back to a mon total, purely from the rate constants,
    // and assert it round-trips the input for a sweep spanning every reveal boundary. This is
    // the strongest RED-able lever: any wrong divisor/remainder in formatCoin breaks it.
    const parse = (s: string): number => {
      let total = 0;
      for (const m of s.matchAll(/(\d+)\s*(ryō|monme|mon)/g)) {
        const n = Number(m[1]);
        total += m[2] === 'ryō' ? n * MON_PER_RYO : m[2] === 'monme' ? n * MON_PER_MONME : n;
      }
      return total;
    };
    for (const v of [
      0,
      1,
      MON_PER_MONME - 1,
      MON_PER_MONME,
      MON_PER_MONME + 1,
      500,
      MON_PER_RYO - 1,
      MON_PER_RYO,
      MON_PER_RYO + 20,
      MON_PER_RYO + MON_PER_MONME,
      4500,
      12_345,
      100_000,
    ]) {
      expect(parse(formatCoin(v))).toBe(v);
    }
  });
});
