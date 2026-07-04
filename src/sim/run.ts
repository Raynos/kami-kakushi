// The sim runner (F4 §1): drive the REAL engine (createInitialState + reduce — never a
// re-derived model) with one persona on one seed, cold open → ascension, collecting RunMetrics
// around every dispatch. Pure + deterministic: the persona is a pure function of state, all
// randomness lives in GameState.rng, so the same (persona, seed) reproduces byte-identically.

import type { GameState } from '../core';
import { createInitialState, reduce } from '../core';
import type { Persona } from './personas';
import type { RunMetrics } from './metrics';
import { createCollector } from './metrics';

/** The runaway guard (mirrors t0-arc.test.ts) — a tripped guard is a structural RED, never
 *  silently truncated. The full greedy arc is ~15 k dispatches; this is ~65× headroom. */
export const SIM_GUARD_INTENTS = 1_000_000;

export interface RunResult {
  metrics: RunMetrics;
  final: GameState;
}

export function runPersona(persona: Persona, seed: number): RunResult {
  let s = createInitialState(seed);
  const collect = createCollector(persona.id, seed);
  let softLock: RunMetrics['softLock'] = null;
  let i = 0;
  while (s.tier === 0) {
    if (i >= SIM_GUARD_INTENTS) {
      softLock = { reason: 'guard', atIntent: i, rung: s.rung };
      break;
    }
    const intent = persona.decide(s);
    if (!intent) {
      softLock = { reason: 'no-intent', atIntent: i, rung: s.rung };
      break;
    }
    const before = s;
    s = reduce(s, intent);
    collect.record(before, s, intent, i);
    i++;
  }
  return { metrics: collect.finish(s, softLock), final: s };
}
