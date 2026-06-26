import { describe, it, expect } from 'vitest';
import { ipow, clamp } from './index';

describe('core math helpers', () => {
  it('ipow matches integer exponentiation', () => {
    expect(ipow(2, 10)).toBe(1024);
    expect(ipow(3, 0)).toBe(1);
    expect(ipow(5, 3)).toBe(125);
    expect(ipow(10, 6)).toBe(1_000_000);
  });

  it('ipow rejects non-integer / negative exponents', () => {
    expect(() => ipow(2, 1.5)).toThrow();
    expect(() => ipow(2, -1)).toThrow();
  });

  it('clamp bounds values', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(99, 0, 10)).toBe(10);
  });
});
