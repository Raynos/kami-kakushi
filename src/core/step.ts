// The deterministic clock advance (PRD §6.3 / B10). `tick` folds dtTicks ONE tick
// at a time; each per-day/per-season scheduled plan fires once in a fixed registry
// order. This guarantees tick(s, a+b) === tick(tick(s, a), b) — unit-asserted.
// Active-only: there is NO offline catch-up path (the app loop computes whole
// dtTicks from active elapsed time only).

import type { GameState } from './state';
import { withBanked } from './state';
import { TICKS_PER_DAY, SEASONS } from './constants';
import { revealPass } from './unlock';
import { phaseOf } from './ranks';
import { seasonalJudge } from './pillars';
import { deriveDayKeyed } from './rng';
import { applyRewards } from './rewards';
import { riceSpoilage, CONSUMPTION_SHO_PER_DAY } from './content/balance';
import { refillSitePools } from './content/activities';
import { triggerScenes } from './scenes';

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

/** The season-exit pipeline (storywave G1 / ADR-153): the seasonal judge (the Phase-2 share) →
 *  the spoilage pass → advance the wheel one step, incrementing `seasonsPassed`. Instant
 *  (ADR-148): the overlay, once authored, IS the time. The seasonal judge fires ONLY here
 *  (post-R7 Phase 2), so a run must cross season boundaries to be reckoned before ascension.
 *  ADR-166: Autumn's REFUSING exit gate lives in the `advance_season` reducer arm — a caller
 *  only reaches this pipeline once the year's nengu is reckoned (the reckoning itself moved
 *  to the nengu scene's completion: nengu.ts / scenes.ts). By construction the nengu draw
 *  precedes this exit's spoilage pass (the tax is met first, as ADR-163 orders it). */
export function advanceSeason(state: GameState): GameState {
  let next = onReckoning(state);
  next = onSeasonTurn(next);
  // G4 — the per-season VN overlay: queue any scene whose season-exit trigger matches the season NOW
  //   ending (before the wheel turns) — e.g. the Bon `sb-bon` beat. Enqueued here; the queue opens
  //   at the render layer (G4.9). (The nengu frame is NOT season-exit-keyed since ADR-166 — the
  //   REFUSED Autumn attempt enqueues it instead.)
  next = triggerScenes(next, { kind: 'season-exit', season: next.season });
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
