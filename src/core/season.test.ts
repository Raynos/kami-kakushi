// C1.4 (B7 closure) — the season-wheel suite the storywave plan named and never created.
// ADR-153 (the stored, MANUAL six-season wheel) + ADR-166 (the Autumn REFUSING exit gate,
// human-ruled 2026-07-09). Everything derives from the sources of truth — SEASONS, the
// balance constants, refillSitePools — never copied literals (test law #2). The scattered
// pipeline coverage in m1/economy/pillars stays where it tests its OWN lever (spoilage,
// the judge); THIS suite owns the wheel order, the reducer guards, and the refusing gate.

import { describe, expect, it } from 'vitest';
import { SEASONS, SHO_PER_KOKU, type Season } from './constants';
import {
  createInitialState,
  reduce,
  refillSitePools,
  type GameState,
} from './index';
import { hasFlag } from './state';
import { nenguYearFlag } from './nengu';
import { NENGU_KOKU_DEMAND } from './content/balance';

const DEMAND_SHO = NENGU_KOKU_DEMAND * SHO_PER_KOKU;

/** An R2+, intro-done, sceneless state — the minimum ground on which the manual wheel is
 *  engine-legal (the C1.4 reducer guards). Seam-forced fixtures (rung), mirroring the
 *  economy suite's withKura style; the full real-path climb lives in t0-arc.test.ts. */
function wheelReady(seed = 1): GameState {
  const s = createInitialState(seed);
  return { ...s, rung: 'R2', banked: { ...s.banked, rice: DEMAND_SHO + 37 } };
}

/** Run the ADR-166 refusal flow to completion: the refused exit enqueues the nengu frame,
 *  the scene plays (narration-only → advance_scene_beat is its terminal), completion
 *  reckons. Returns the reckoned state, still in Autumn. */
function reckonViaScene(s: GameState): GameState {
  let next = reduce(s, { type: 'advance_season' }); // REFUSED — the wheel must not turn
  expect(next.season).toBe('autumn');
  expect(next.seasonsPassed).toBe(s.seasonsPassed);
  expect(next.sceneQueue).toContain('nengu-autumn-frame');
  next = reduce(next, { type: 'begin_scene', sceneId: 'nengu-autumn-frame' });
  next = reduce(next, { type: 'advance_scene_beat' }); // terminal → the reckoning fires
  expect(next.activeScene).toBeNull();
  return next;
}

describe('the six-season wheel (ADR-153) — order derived from SEASONS itself', () => {
  it('turns SEASONS[i] → SEASONS[(i+1) % n] for every season, +1 seasonsPassed each', () => {
    for (const [i, se] of SEASONS.entries()) {
      let s: GameState = { ...wheelReady(1), season: se };
      if (se === 'autumn') s = reckonViaScene(s); // the gated exit needs the year's reckoning
      const after = reduce(s, { type: 'advance_season' });
      expect(after.season).toBe(SEASONS[(i + 1) % SEASONS.length]);
      expect(after.seasonsPassed).toBe(s.seasonsPassed + 1);
    }
  });

  it('the exit refills the site pools to the INCOMING season (source: refillSitePools)', () => {
    const s = wheelReady(2); // winter — an ungated exit
    const after = reduce(s, { type: 'advance_season' });
    expect(after.sitePools).toEqual(refillSitePools(after.season as Season));
  });
});

describe('advance_season is ENGINE law (C1.4) — the guards the render used to own', () => {
  it('refuses before R2 (the wheel arrives with the season readout)', () => {
    const s = createInitialState(3); // rung R0
    const after = reduce(s, { type: 'advance_season' });
    expect(after.season).toBe(s.season);
    expect(after.seasonsPassed).toBe(s.seasonsPassed);
  });

  it('refuses while the intro owns the surface', () => {
    const s: GameState = { ...wheelReady(4), introBeat: 0 }; // scene 0 live
    expect(reduce(s, { type: 'advance_season' })).toBe(s);
  });

  it('refuses while a generalized scene owns the surface', () => {
    const s: GameState = {
      ...wheelReady(5),
      activeScene: { id: 'count', beat: 0 },
    };
    expect(reduce(s, { type: 'advance_season' })).toBe(s);
  });
});

describe("the Autumn REFUSING gate (ADR-166) — the year doesn't turn until the nengu is reckoned", () => {
  it('the refused attempt opens the reckoning; completion draws the kura + latches the flags', () => {
    const s: GameState = { ...wheelReady(6), season: 'autumn' };
    const before = s.banked.rice ?? 0;
    const reckoned = reckonViaScene(s);
    // the kura paid the demand (derived — never a copied magnitude)
    expect(reckoned.banked.rice ?? 0).toBe(
      before - Math.min(before, DEMAND_SHO),
    );
    expect(hasFlag(reckoned, 'nengu-reckoned')).toBe(true); // the R7 seam
    expect(hasFlag(reckoned, nenguYearFlag(reckoned.seasonsPassed))).toBe(true);
    expect(hasFlag(reckoned, 'nengu-short')).toBe(false); // the pile covered it
    // and NOW the exit passes
    const out = reduce(reckoned, { type: 'advance_season' });
    expect(out.season).toBe(
      SEASONS[(SEASONS.indexOf('autumn') + 1) % SEASONS.length],
    );
  });

  it('a shortfall latches nengu-short (the debt felt, never numbered)', () => {
    const s: GameState = {
      ...wheelReady(7),
      season: 'autumn',
      banked: { rice: Math.max(0, DEMAND_SHO - 1) },
    };
    const reckoned = reckonViaScene(s);
    expect(hasFlag(reckoned, 'nengu-short')).toBe(true);
  });

  it('the gate RE-ARMS the next year; nengu-reckoned stays latched for R7', () => {
    // year 1: reckon + exit autumn
    let s = reckonViaScene({ ...wheelReady(8), season: 'autumn' });
    s = reduce(s, { type: 'advance_season' });
    // walk the wheel back around to autumn (5 ungated exits, derived from SEASONS length)
    for (let i = 0; i < SEASONS.length - 1; i++) {
      expect(s.season).not.toBe('autumn');
      s = reduce(s, { type: 'advance_season' });
    }
    expect(s.season).toBe('autumn');
    // year 2: the exit refuses AGAIN (the per-year flag is fresh) …
    const refused = reduce(s, { type: 'advance_season' });
    expect(refused.season).toBe('autumn');
    expect(refused.sceneQueue).toContain('nengu-autumn-frame'); // the frame REPLAYS annually
    expect(hasFlag(refused, nenguYearFlag(refused.seasonsPassed))).toBe(false);
    // … while the once-latched R7 seam is untouched
    expect(hasFlag(refused, 'nengu-reckoned')).toBe(true);
  });
});
