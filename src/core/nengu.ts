// The nengu (年貢) — Autumn's land-tax reckoning (ADR-163: a KURA sink; ADR-166: the
// REFUSING exit gate). The koku demand is met from the kura (converted to shō); the
// shortfall is the debt's FELT pressure — never numbered in T0 (no debt panel, flags only).
//
// ADR-166 (human-ruled 2026-07-09, reversing the shipped auto-reckon): the reckoning fires
// when the nengu SCENE completes (`nengu-autumn-frame` — enqueued by the REFUSED Autumn
// exit in the `advance_season` reducer arm), never inside the exit pipeline itself. The
// gate RE-ARMS every year via a per-year flag; the once-latched `nengu-reckoned` keeps
// serving the R7 rung gate unchanged. AC-20 glue: intents.ts (the refusal check) and
// scenes.ts (the completion effect) both import from HERE — no reducer→reducer call.
// Pure + deterministic (no RNG).

import type { GameState } from './state';
import { withBanked, setFlag, hasFlag } from './state';
import { applyRewards } from './rewards';
import { NENGU_KOKU_DEMAND } from './content/balance';
import { SEASONS, SHO_PER_KOKU } from './constants';

/** The per-year reckoning flag (`nengu-reckoned-y0`, `-y1`, …). Year = completed wheel
 *  turns / 6 — consistent for the check AND the latch because both happen DURING the same
 *  Autumn (the refused exit holds the wheel until the reckoning lands). */
export function nenguYearFlag(seasonsPassed: number): string {
  return `nengu-reckoned-y${Math.floor(seasonsPassed / SEASONS.length)}`;
}

/** Has THIS year's nengu been reckoned? (The ADR-166 gate predicate — the once-latched
 *  `nengu-reckoned` is deliberately NOT consulted: it serves R7, not the annual gate.) */
export function nenguReckonedThisYear(state: GameState): boolean {
  return hasFlag(state, nenguYearFlag(state.seasonsPassed));
}

/** Perform the reckoning: draw the koku demand from the kura, latch `nengu-reckoned`
 *  (the R7 seam), `nengu-short` on a shortfall, and this year's re-arm flag. Fired by the
 *  nengu scene's completion (scenes.ts). Defensive no-op outside Autumn. */
export function reckonNengu(state: GameState): GameState {
  if (state.season !== 'autumn') return state;
  const demandSho = NENGU_KOKU_DEMAND * SHO_PER_KOKU;
  const inKura = state.banked.rice ?? 0;
  const paid = Math.min(inKura, demandSho);
  let next = state;
  if (paid > 0) next = withBanked(next, 'rice', -paid);
  // The reckoning happened; the tax-day flag latches (felt, never numbered). `nengu-short`
  // marks the shortfall (the debt's pressure) for content to read — a flag seam, no number.
  next = setFlag(next, 'nengu-reckoned');
  next = setFlag(next, nenguYearFlag(next.seasonsPassed));
  if (paid < demandSho && !hasFlag(next, 'nengu-short')) next = setFlag(next, 'nengu-short');
  return applyRewards(next, {
    log: [
      {
        channel: 'milestone',
        voice: 'narrator',
        // HD-30 (2026-07-09): the nengu reckoning line — felt, never numbered (no koku/shō figure).
        text: 'The nengu is reckoned: the year measured against the house, the shortfall named plainly and let stand. No one at the board says the figure twice.',
      },
    ],
  });
}
