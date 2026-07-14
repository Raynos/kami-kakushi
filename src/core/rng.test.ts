import { describe, it, expect } from 'vitest';
import {
  createRng,
  nextFloat,
  nextInt,
  nextChance,
  nextPick,
  deriveDayKeyed,
} from './rng';

describe('seeded RNG (splitmix64, per-stream cursors)', () => {
  it('is deterministic: same seed → same sequence', () => {
    const a = drawN(createRng(42), 'combat', 20);
    const b = drawN(createRng(42), 'combat', 20);
    expect(a).toEqual(b);
  });

  it('different seeds diverge', () => {
    const a = drawN(createRng(1), 'combat', 10);
    const b = drawN(createRng(2), 'combat', 10);
    expect(a).not.toEqual(b);
  });

  it('streams advance independently', () => {
    let rng = createRng(7);
    const [c] = nextFloat(rng, 'combat');
    // advancing loot must not change the next combat draw
    [, rng] = nextFloat(rng, 'loot');
    const [c2] = nextFloat(rng, 'combat');
    expect(c2).toBe(c);
  });

  it('cursors are plain integers (JSON-safe, exact)', () => {
    let rng = createRng(7);
    for (let i = 0; i < 5; i++) [, rng] = nextFloat(rng, 'combat');
    expect(rng.cursors.combat).toBe(5);
    expect(JSON.parse(JSON.stringify(rng))).toEqual(rng);
  });

  it('nextInt stays in range', () => {
    let rng = createRng(99);
    for (let i = 0; i < 200; i++) {
      const [v, next] = nextInt(rng, 'loot', 6);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(6);
      rng = next;
    }
  });

  it('nextChance is monotone at the extremes', () => {
    const rng = createRng(3);
    expect(nextChance(rng, 'combat', 1)[0]).toBe(true);
    expect(nextChance(rng, 'combat', 0)[0]).toBe(false);
  });

  it('nextPick returns an element', () => {
    const [v] = nextPick(createRng(5), 'worldgen', ['a', 'b', 'c'] as const);
    expect(['a', 'b', 'c']).toContain(v);
  });

  it('deriveDayKeyed is stateless & reproducible', () => {
    expect(deriveDayKeyed(42, 'weather', 10)).toBe(
      deriveDayKeyed(42, 'weather', 10),
    );
    expect(deriveDayKeyed(42, 'weather', 10)).not.toBe(
      deriveDayKeyed(42, 'weather', 11),
    );
    expect(deriveDayKeyed(42, 'weather', 10)).not.toBe(
      deriveDayKeyed(42, 'lunar', 10),
    );
  });

  it('floats are in [0,1)', () => {
    let rng = createRng(123);
    for (let i = 0; i < 100; i++) {
      const [v, next] = nextFloat(rng, 'seasonal');
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
      rng = next;
    }
  });
});

function drawN(
  rng: ReturnType<typeof createRng>,
  stream: 'combat' | 'loot',
  n: number,
): number[] {
  const out: number[] = [];
  let r = rng;
  for (let i = 0; i < n; i++) {
    const [v, next] = nextFloat(r, stream);
    out.push(v);
    r = next;
  }
  return out;
}
