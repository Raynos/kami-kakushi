import { describe, it, expect } from 'vitest';
import { formatKMB, formatRate } from './format';

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
    expect(formatRate(12, 'koku')).toBe('+12/koku');
    expect(formatRate(-3, 'tick')).toBe('-3/tick');
  });
});
