// @vitest-environment jsdom
//
// FB-68 — the DEV rung-teleport must reach ANY rung in EITHER direction. `planRungJump` is the pure
// core of __qa.toRung: climbing UP promotes from the current state; a jump AT-OR-BELOW the current
// rung RESETS to a fresh game first, then re-climbs — so no stale higher-rung unlock/panel lingers.
// (jsdom env only so importing main.ts — which ends in `void boot()` — finds a `document`; boot
// early-returns with no #app, so nothing else runs.)
//
// RED-able: the expected unlocks are derived from ranks.ts (the source of truth), NOT copied magic
// strings. If the descend path forgot to reset, an R5→R3 jump would keep R4/R5's unlocks and land
// at R5 — both the rung assert and the "no stale higher-rung unlock" assert flip red.
import { describe, it, expect } from 'vitest';
import { planRungJump } from './main';
import { createInitialState, getRank, isUnlocked, type GameState } from '../core';

/** Climb a fresh game up to `rung` using the same pure engine the teleport uses (an upward jump,
 *  so no reset is involved — this is the honest "we are genuinely AT rung X" fixture to jump from). */
function climbedTo(rung: Parameters<typeof planRungJump>[1]): GameState {
  return planRungJump(createInitialState(1), rung).state;
}

const unlocksOf = (rung: Parameters<typeof getRank>[0]): readonly string[] =>
  getRank(rung).rewardOnReach?.unlock ?? [];

describe('planRungJump — DEV rung teleport, both directions (F68)', () => {
  it('climbs UP from the current state without resetting', () => {
    const r = planRungJump(createInitialState(1), 'R4');
    expect(r.reset).toBe(false);
    expect(r.state.rung).toBe('R4');
    // R4's own reveal (the durability/equipment beat) is present — DERIVED from the
    // latched rank flags the climb stamped (ADR-179; no stored unlocked latch to read).
    for (const u of unlocksOf('R4')) expect(isUnlocked(r.state, u)).toBe(true);
  });

  it('DESCENDS by resetting first, then re-climbing to the lower rung', () => {
    const high = climbedTo('R5');
    // sanity: the fixture really carries R5's exclusive unlock (else the test proves nothing).
    for (const u of unlocksOf('R5')) expect(isUnlocked(high, u)).toBe(true);

    const down = planRungJump(high, 'R3');
    expect(down.reset).toBe(true);
    expect(down.state.rung).toBe('R3');
    // R3's unlocks are re-granted…
    for (const u of unlocksOf('R3')) expect(isUnlocked(down.state, u)).toBe(true);
    // …and every stale higher-rung unlock (R4's durability/equip, R5's stance) is GONE —
    // the reset dropped the higher rank flags, so the derived set shrank with them (ADR-179).
    for (const u of [...unlocksOf('R4'), ...unlocksOf('R5')]) {
      expect(isUnlocked(down.state, u)).toBe(false);
    }
  });

  it('a self-jump (target === current rung) still resets then re-lands deterministically', () => {
    const r3 = climbedTo('R3');
    const again = planRungJump(r3, 'R3');
    expect(again.reset).toBe(true);
    expect(again.state.rung).toBe('R3');
  });

  it('an unknown rung is a no-op (returns the current state, no reset)', () => {
    const cur = climbedTo('R2');
    const r = planRungJump(cur, 'R99' as Parameters<typeof planRungJump>[1]);
    expect(r.reset).toBe(false);
    expect(r.state).toBe(cur);
  });
});
