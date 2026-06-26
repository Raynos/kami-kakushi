// The deterministic clock advance (PRD §6.3 / B10). `tick` folds dtTicks ONE tick
// at a time; each per-day/per-season scheduled plan fires once in a fixed registry
// order. This guarantees tick(s, a+b) === tick(tick(s, a), b) — unit-asserted.
// Active-only: there is NO offline catch-up path (the app loop computes whole
// dtTicks from active elapsed time only).

import type { GameState } from './state';
import { TICKS_PER_DAY, DAYS_PER_SEASON } from './constants';
import { revealPass } from './unlock';

function onSeasonBoundary(state: GameState): GameState {
  // The per-season judged-appraisal hook. Scaffold at M0 — pillar accrual is
  // Phase-2-gated and lands at M3; here the boundary is just a deterministic seam.
  // (When live: drain a `pendingAppraisals` counter in a loop so multi-season jumps
  // accrue all N appraisals — B10.)
  return state;
}

function onDayRollover(state: GameState): GameState {
  // Per-day plans fire once, in fixed order (B10). Season boundary first.
  let next = state;
  if (next.clock.day > 0 && next.clock.day % DAYS_PER_SEASON === 0) {
    next = onSeasonBoundary(next);
  }
  return next;
}

function singleTick(state: GameState): GameState {
  const tickNext = state.clock.tick + 1;
  if (tickNext >= TICKS_PER_DAY) {
    const rolled: GameState = { ...state, clock: { tick: 0, day: state.clock.day + 1 } };
    return onDayRollover(rolled);
  }
  return { ...state, clock: { tick: tickNext, day: state.clock.day } };
}

/** Advance the clock by N whole ticks, folding ONE at a time (B10). No reveal pass. */
export function advanceClock(state: GameState, ticks: number): GameState {
  if (!Number.isInteger(ticks) || ticks < 0) {
    throw new Error(`advanceClock: ticks must be a non-negative integer, got ${ticks}`);
  }
  let next = state;
  for (let i = 0; i < ticks; i++) next = singleTick(next);
  return next;
}

/** The clock advance contract (PRD §6.3): advance then run the reveal pass. */
export function tick(state: GameState, dtTicks: number): GameState {
  return revealPass(advanceClock(state, dtTicks));
}
