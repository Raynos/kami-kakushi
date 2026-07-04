// The sim runner (F4 §1): drive the REAL engine (createInitialState + reduce — never a
// re-derived model) with one persona on one seed, cold open → ascension, collecting RunMetrics
// around every dispatch. Pure + deterministic: the persona is a pure function of state, all
// randomness lives in GameState.rng, so the same (persona, seed) reproduces byte-identically.

import type { GameState } from '../core';
import { createInitialState, reduce } from '../core';
import type { Persona } from './personas';
import { intentKey } from './personas';
import type { RunMetrics } from './metrics';
import { createCollector, madeProgress } from './metrics';

/** The runaway guard (mirrors t0-arc.test.ts) — a tripped guard is a structural RED, never
 *  silently truncated. The full greedy arc is ~15 k dispatches; this is ~65× headroom. */
export const SIM_GUARD_INTENTS = 1_000_000;

/** The soft-lock detector (F4 §2): RED when NO progress signal (rung/meter/wealth/xp/unlock/
 *  beat/hp-up — metrics.madeProgress) lands for this many CONSECUTIVE intents. Calibration
 *  (soundness before teeth, Ph3 DoD): the worst green run measured across all personas × the
 *  gating seeds is the explorer's novelty-tasting stretch at 11 intents
 *  (`maxIntentsWithoutProgress` in the committed report — greedy 3, idler 4); 500 is ~45× that
 *  ceiling while still catching a genuine stall in ~4 modeled minutes — it can NEVER fire on a
 *  green run's noise, only on a real dead-end (e.g. a persona ping-ponging no-op check-ins). */
export const SIM_SOFTLOCK_INTENTS = 500;

export interface RunResult {
  metrics: RunMetrics;
  final: GameState;
}

export function runPersona(persona: Persona, seed: number): RunResult {
  let s = createInitialState(seed);
  const collect = createCollector(persona.id, seed);
  const issued = new Set<string>();
  let softLock: RunMetrics['softLock'] = null;
  let sinceProgress = 0;
  let i = 0;
  while (s.tier === 0) {
    if (i >= SIM_GUARD_INTENTS) {
      softLock = { reason: 'guard', atIntent: i, rung: s.rung };
      break;
    }
    const intent = persona.decide(s, issued);
    if (!intent) {
      softLock = { reason: 'no-intent', atIntent: i, rung: s.rung };
      break;
    }
    const before = s;
    s = reduce(s, intent);
    issued.add(intentKey(intent));
    collect.record(before, s, intent, i);
    sinceProgress = madeProgress(before, s) ? 0 : sinceProgress + 1;
    if (sinceProgress >= SIM_SOFTLOCK_INTENTS) {
      softLock = { reason: 'no-progress', atIntent: i, rung: s.rung };
      break;
    }
    i++;
  }
  return { metrics: collect.finish(s, softLock), final: s };
}
