// The ONE seeded RNG (PRD §6.7 / D-038). splitmix64, exposed as per-named-stream
// cursors so different concerns (combat / loot / seasonal / worldgen) advance
// independently and a save restores the exact sequence position.
//
// Determinism contract (D-Q-numeric / Q16+Q17): the 64-bit splitmix arithmetic is
// done in BigInt (exact), but the STORED cursor is a plain draw-COUNT integer — so
// cursor arithmetic in JS `number` is exact (well under 2^53 draws) and the state
// is trivially JSON-serializable. value(i) = splitmix64_mix(seed^salt + (i+1)·GAMMA),
// which is splitmix64's own `state += GAMMA each draw`, re-derived from the counter.
//
// Pure: no Math.random, no Math.pow/exp/log/trig (integer/BigInt only). The renderer
// never calls this; all randomness flows through here and lives in GameState.

export type RngStream = 'combat' | 'loot' | 'seasonal' | 'worldgen';

export interface Rng {
  readonly seed: number;
  readonly cursors: Readonly<Record<RngStream, number>>;
}

const MASK64 = (1n << 64n) - 1n;
const GAMMA = 0x9e3779b97f4a7c15n;

// Distinct per-stream salts so the streams don't correlate (fixed constants — part
// of the determinism contract; never change these or saves replay differently).
const STREAM_SALT: Record<RngStream, bigint> = {
  combat: 0x243f6a8885a308d3n,
  loot: 0x13198a2e03707344n,
  seasonal: 0xa4093822299f31d0n,
  worldgen: 0x082efa98ec4e6c89n,
};

function mix64(x: bigint): bigint {
  let z = x & MASK64;
  z = ((z ^ (z >> 30n)) * 0xbf58476d1ce4e5b9n) & MASK64;
  z = ((z ^ (z >> 27n)) * 0x94d049bb133111ebn) & MASK64;
  z = z ^ (z >> 31n);
  return z & MASK64;
}

/** The raw 64-bit splitmix output for (seed, stream, cursor) — exact, BigInt. */
function rawAt(seed: number, stream: RngStream, cursor: number): bigint {
  const base = (BigInt(seed >>> 0) ^ STREAM_SALT[stream]) & MASK64;
  const state = (base + GAMMA * BigInt(cursor + 1)) & MASK64;
  return mix64(state);
}

export function createRng(seed: number): Rng {
  return {
    seed: seed >>> 0,
    cursors: { combat: 0, loot: 0, seasonal: 0, worldgen: 0 },
  };
}

function advance(rng: Rng, stream: RngStream): Rng {
  return {
    seed: rng.seed,
    cursors: { ...rng.cursors, [stream]: rng.cursors[stream] + 1 },
  };
}

/** A float in [0, 1) from the stream's current cursor; returns the advanced Rng. */
export function nextFloat(rng: Rng, stream: RngStream): [number, Rng] {
  const z = rawAt(rng.seed, stream, rng.cursors[stream]);
  // top 53 bits → an exact double in [0, 1)
  const v = Number(z >> 11n) / 9007199254740992; // 2^53
  return [v, advance(rng, stream)];
}

/** A uniform integer in [0, n) (n > 0). */
export function nextInt(rng: Rng, stream: RngStream, n: number): [number, Rng] {
  if (!Number.isInteger(n) || n <= 0)
    throw new Error(`nextInt: n must be a positive integer, got ${n}`);
  const z = rawAt(rng.seed, stream, rng.cursors[stream]);
  // Use the full 64-bit value modulo n via BigInt (no float bias).
  const v = Number(z % BigInt(n));
  return [v, advance(rng, stream)];
}

/** True with probability `p` (clamped to [0,1]). */
export function nextChance(rng: Rng, stream: RngStream, p: number): [boolean, Rng] {
  const [v, rng2] = nextFloat(rng, stream);
  return [v < p, rng2];
}

/** Pick one element uniformly from a non-empty array. */
export function nextPick<T>(rng: Rng, stream: RngStream, items: readonly T[]): [T, Rng] {
  if (items.length === 0) throw new Error('nextPick: empty array');
  const [i, rng2] = nextInt(rng, stream, items.length);
  return [items[i]!, rng2];
}

/** Weighted pick: `weights[i]` is the relative weight of `items[i]`. */
export function nextWeighted<T>(
  rng: Rng,
  stream: RngStream,
  items: readonly T[],
  weights: readonly number[],
): [T, Rng] {
  if (items.length === 0 || items.length !== weights.length) {
    throw new Error('nextWeighted: items/weights mismatch or empty');
  }
  let total = 0;
  for (const w of weights) total += w;
  const [r, rng2] = nextFloat(rng, stream);
  let acc = 0;
  const target = r * total;
  for (let i = 0; i < items.length; i++) {
    acc += weights[i]!;
    if (target < acc) return [items[i]!, rng2];
  }
  return [items[items.length - 1]!, rng2];
}

// ── Stateless day-keyed derivations (PRD §6.7.1) ────────────────────────────────
// Weather / lunar / festival rolls are DERIVED ON READ from (seed, label, day),
// never stored. Same inputs → same output, with no cursor to persist.

function hashLabel(label: string): bigint {
  // FNV-1a-ish over the label, into 64 bits — deterministic, no Math.* transcendentals.
  let h = 0xcbf29ce484222325n;
  for (let i = 0; i < label.length; i++) {
    h = (h ^ BigInt(label.charCodeAt(i))) & MASK64;
    h = (h * 0x100000001b3n) & MASK64;
  }
  return h;
}

/** A stateless float in [0,1) keyed by (seed, label, day). Not stored (PRD §6.7.1). */
export function deriveDayKeyed(seed: number, label: string, day: number): number {
  const base = (BigInt(seed >>> 0) ^ hashLabel(label)) & MASK64;
  const state = (base + GAMMA * BigInt(day + 1)) & MASK64;
  const z = mix64(state);
  return Number(z >> 11n) / 9007199254740992;
}
