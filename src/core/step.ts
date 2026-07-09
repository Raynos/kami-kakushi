// The deterministic clock advance (PRD §6.3 / B10). `tick` folds dtTicks ONE tick
// at a time; each per-day/per-season scheduled plan fires once in a fixed registry
// order. This guarantees tick(s, a+b) === tick(tick(s, a), b) — unit-asserted.
// Active-only: there is NO offline catch-up path (the app loop computes whole
// dtTicks from active elapsed time only).

import type { GameState } from './state';
import { withBanked, setFlag, hasFlag } from './state';
import { TICKS_PER_DAY, SEASONS, SHO_PER_KOKU } from './constants';
import { revealPass } from './unlock';
import { phaseOf } from './ranks';
import { seasonalJudge } from './pillars';
import { deriveDayKeyed } from './rng';
import { applyRewards } from './rewards';
import { riceSpoilage, CONSUMPTION_SHO_PER_DAY, NENGU_KOKU_DEMAND } from './content/balance';
import { refillSitePools } from './content/activities';

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
  // SPOILAGE (ADR-118 / ADR-163 soft-cap) — the storage cap, fired at season-exit. Rice now lives
  // ONLY in the kura (shō), so spoilage decays the BANKED pile alone (carried rice no longer exists
  // — a lost fight can't touch the grain). Net stock converges where spoilage = inflow. Deterministic
  // (no RNG), fold-invariant with the clock (B10).
  const banked = state.banked.rice ?? 0;
  const total = riceSpoilage(banked);
  if (total <= 0) return state;
  const next = withBanked(state, 'rice', -total);
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

/** The nengu (年貢) — Autumn's land-tax reckoning (ADR-163, a KURA sink). At the AUTUMN season-exit
 *  the koku demand is met from the kura (converted to shō); the shortfall is the debt's FELT pressure
 *  — never numbered in T0 (no debt panel, flags only). Latches `nengu-reckoned` (the Autumn exit-gate
 *  seam + the T1 debt hook). */
function onNengu(state: GameState): GameState {
  if (state.season !== 'autumn') return state;
  const demandSho = NENGU_KOKU_DEMAND * SHO_PER_KOKU;
  const inKura = state.banked.rice ?? 0;
  const paid = Math.min(inKura, demandSho);
  let next = state;
  if (paid > 0) next = withBanked(next, 'rice', -paid);
  // The reckoning happened; the tax-day flag latches (felt, never numbered). `nengu-short` marks the
  // shortfall (the debt's pressure) for content to read — a flag seam, no number surfaced.
  next = setFlag(next, 'nengu-reckoned');
  if (paid < demandSho && !hasFlag(next, 'nengu-short')) next = setFlag(next, 'nengu-short');
  return applyRewards(next, {
    log: [
      {
        channel: 'milestone',
        voice: 'narrator',
        // TODO(g4-tests): HD-30 — the nengu reckoning prose is authored at G4.6; a bracketed dev
        // placeholder until then (felt, never numbered — no koku/shō count in the player line).
        text: '[dev — the nengu is reckoned; the year is measured against the house]',
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
  next = onNengu(next); // Autumn's nengu draws the kura BEFORE spoilage (the tax is met first)
  next = onSeasonTurn(next);
  const idx = SEASONS.indexOf(next.season);
  const nextSeason = SEASONS[(idx + 1) % SEASONS.length]!;
  // ADR-163 — the production pools REFILL to the incoming season's peak (this is *why* seasons are
  // manual containers): each labour site's remaining-yield scalar resets to its (site, season) pool.
  return {
    ...next,
    season: nextSeason,
    seasonsPassed: next.seasonsPassed + 1,
    sitePools: refillSitePools(nextSeason),
  };
}

/** The daily CONSUMPTION sink (ADR-163) — the household eats a steady shō/day drawn from the kura,
 *  fired once per day-boundary. A constant background drain that makes rice working capital, never a
 *  score. Clamped at the kura floor (you can't eat what isn't there — the shortfall is felt as
 *  hunger via the satiety loop, not a negative store). Pure + deterministic. */
function onDayBoundary(state: GameState): GameState {
  const inKura = state.banked.rice ?? 0;
  const eaten = Math.min(inKura, CONSUMPTION_SHO_PER_DAY);
  if (eaten <= 0) return state;
  return withBanked(state, 'rice', -eaten);
}

function singleTick(state: GameState): GameState {
  // Day/tick advance — seasons are MANUAL (ended by `advance_season`), but the DAY boundary still
  // fires the daily consumption sink (ADR-163): the household eats a steady shō/day from the kura.
  const tickNext = state.clock.tick + 1;
  if (tickNext >= TICKS_PER_DAY) {
    const rolled: GameState = { ...state, clock: { tick: 0, day: state.clock.day + 1 } };
    return onDayBoundary(rolled);
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
