// The deterministic clock advance (PRD §6.3 / B10). `tick` folds dtTicks ONE tick
// at a time; each per-day/per-season scheduled plan fires once in a fixed registry
// order. This guarantees tick(s, a+b) === tick(tick(s, a), b) — unit-asserted.
// Active-only: there is NO offline catch-up path (the app loop computes whole
// dtTicks from active elapsed time only).

import type { GameState } from './state';
import { withResource, withBanked } from './state';
import { TICKS_PER_DAY, SEASONS } from './constants';
import { revealPass } from './unlock';
import { phaseOf } from './ranks';
import { seasonalJudge } from './pillars';
import { deriveDayKeyed } from './rng';
import { applyRewards } from './rewards';
import { riceSpoilage } from './content/balance';

function onReckoning(state: GameState): GameState {
  // The judged-appraisal (M2·4 / ADR-049), now fired from the SEASON-EXIT pipeline (storywave
  // G1 — the old PHASE2_JUDGE_INTERVAL_DAYS 3-day cadence is retired; seasons are manual, so
  // the judge fires once per `advance_season`). In Phase 2 (post-R7), when the Estate pillar
  // has reached a NEW high-water since the last judge, it pays the 30% seasonal share (±10%)
  // via the day-keyed `seasonal` substream — deterministic, no cursor mutation.
  if (phaseOf(state) !== 2) return state;
  const r = deriveDayKeyed(state.rng.seed, 'seasonal-estate', state.clock.day);
  const { pillar, bonus } = seasonalJudge(state.influence.estate, r);
  if (bonus <= 0) return state; // no new high-water → no judge this reckoning
  const judged: GameState = { ...state, influence: { ...state.influence, estate: pillar } };
  return applyRewards(judged, {
    log: [
      {
        channel: 'milestone',
        // ADR-107/ADR-109: the season re-assesses the House's worth "in waves" — the koku STANDING steps
        // up. (Keeps "accounts are reckoned"; the weightier "assessors arrive" tier-jump beat is
        // DEFERRED — a T1+ event, not built here.) Words live in log-content.ts (Stage C).
        contentKey: 'season.reckoned',
        params: { bonus },
      },
    ],
  });
}

function onSeasonTurn(state: GameState): GameState {
  // SPOILAGE (ADR-118 / ADR-163 soft-cap), now fired from the SEASON-EXIT pipeline (storywave
  // G1 — was the auto day-boundary). A fraction of ALL rice decays, CARRIED and BANKED alike
  // (each pile floors on its own, so splitting the hoard is no dodge) — the storage soft cap:
  // holding rice COSTS, so net stock converges where spoilage = inflow. Deterministic (no RNG),
  // fold-invariant with the clock (B10). (The full measured-kura-shō model is G4.5.)
  const carried = state.resources.rice ?? 0;
  const banked = state.banked.rice ?? 0;
  const lostCarried = riceSpoilage(carried);
  const lostBanked = riceSpoilage(banked);
  const total = lostCarried + lostBanked;
  if (total <= 0) return state;
  let next = state;
  if (lostCarried > 0) next = withResource(next, 'rice', -lostCarried);
  if (lostBanked > 0) next = withBanked(next, 'rice', -lostBanked);
  // Fleeting flavor (ephemeral → the "Now" view): a recurring bite the player should feel but that
  // must not spam the permanent Story log every season.
  return applyRewards(next, {
    log: [
      {
        channel: 'system',
        voice: 'narrator',
        ephemeral: true,
        contentKey: 'season.spoilage',
        params: { total },
      },
    ],
  });
}

/** The season-exit pipeline (storywave G1 / ADR-153): the seasonal judge (the Phase-2 share) →
 *  the spoilage pass → advance the wheel one step, incrementing `seasonsPassed`. Exit GATES (e.g.
 *  Autumn's nengu — `flag nengu-reckoned`) and the per-season VN overlay scene arrive with content
 *  (G2/G4); until then no season gates its exit and the clock readout is the turn's signal.
 *  Instant (ADR-148): the overlay, once authored, IS the time. The seasonal judge fires ONLY here
 *  now (post-R7 Phase 2), so a run must cross season boundaries to be reckoned before ascension. */
export function advanceSeason(state: GameState): GameState {
  let next = onReckoning(state);
  next = onSeasonTurn(next);
  const idx = SEASONS.indexOf(next.season);
  const nextSeason = SEASONS[(idx + 1) % SEASONS.length]!;
  return { ...next, season: nextSeason, seasonsPassed: next.seasonsPassed + 1 };
}

function singleTick(state: GameState): GameState {
  // Day/tick advance only — there is no per-day season plan any more (seasons are MANUAL,
  // ended by the `advance_season` intent → `advanceSeason`). The day-of-week clock still reads
  // from `day`; the daily consumption sink lands with the measured-rice model at G4.5.
  const tickNext = state.clock.tick + 1;
  if (tickNext >= TICKS_PER_DAY) {
    return { ...state, clock: { tick: 0, day: state.clock.day + 1 } };
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
