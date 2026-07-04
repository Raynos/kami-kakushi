// The balance-sim seed sets (F4 §4). SIM_SEEDS is the FIXED gating matrix — 20260626 is the
// canonical arc seed every existing arc proof uses (t0-arc / invariants / walkPacing); the rest
// are the already-familiar small test seeds. Same seed ⇒ byte-identical run (the determinism
// assert in balance-sim --selftest). Fuzz seeds are DERIVED deterministically from a base via the
// core's one splitmix RNG family (deriveDayKeyed — no Math.random anywhere), so a fuzz sweep
// reproduces from its base seed; fuzz never gates envelopes (structural breaks only).

import { deriveDayKeyed } from '../core';

/** The canonical arc seed (shared with t0-arc.test.ts + walkPacing). */
export const CANONICAL_SEED = 20260626;

/** The gating matrix seeds — every persona runs each of these in `--check` mode. */
export const SIM_SEEDS: readonly number[] = [CANONICAL_SEED, 1, 7, 11, 13];

/** N deterministic fuzz seeds derived from `base` (the `--fuzz N` sweep). */
export function fuzzSeeds(base: number, n: number): number[] {
  return Array.from({ length: n }, (_, i) => deriveDayKeyed(base, 'sim-fuzz', i));
}
