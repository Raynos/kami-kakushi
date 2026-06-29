// The deterministic clock advance (PRD §6.3 / B10). `tick` folds dtTicks ONE tick
// at a time; each per-day/per-season scheduled plan fires once in a fixed registry
// order. This guarantees tick(s, a+b) === tick(tick(s, a), b) — unit-asserted.
// Active-only: there is NO offline catch-up path (the app loop computes whole
// dtTicks from active elapsed time only).

import type { GameState } from './state';
import { TICKS_PER_DAY, DAYS_PER_SEASON } from './constants';
import { revealPass } from './unlock';
import { phaseOf } from './ranks';
import { seasonalJudge } from './pillars';
import { deriveDayKeyed } from './rng';
import { applyRewards } from './rewards';

function onSeasonBoundary(state: GameState): GameState {
  // The per-season judged-appraisal (M2·4 / D-049). In Phase 2 (post-R7), when the Estate
  // pillar has reached a NEW high-water since the last judge, the season pays out the 30%
  // seasonal share (±10%) via the day-keyed `seasonal` substream — deterministic, no cursor
  // mutation. Folded ONE day at a time by singleTick, so a multi-season jump fires each
  // boundary's judge in turn (no pendingAppraisals counter needed, B10).
  if (phaseOf(state) !== 2) return state;
  const r = deriveDayKeyed(state.rng.seed, 'seasonal-estate', state.clock.day);
  const { pillar, bonus } = seasonalJudge(state.influence.estate, r);
  if (bonus <= 0) return state; // no new high-water → no judge this season
  const judged: GameState = { ...state, influence: { ...state.influence, estate: pillar } };
  return applyRewards(judged, {
    log: [
      {
        channel: 'milestone',
        text: `The season turns and the accounts are reckoned. The house is judged the better for your hand on it — its standing rises. (家産 +${bonus})`,
      },
    ],
  });
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
