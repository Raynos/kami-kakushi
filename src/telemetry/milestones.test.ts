import { describe, it, expect } from 'vitest';
import { createInitialState, balance, type GameState } from '../core';
import { detectMilestones, autosArmed, snapshot } from './milestones';

// Detector proofs: fixtures start from the REAL createInitialState and mutate the public
// fields the detectors read — thresholds derived from the source of truth (rungThreshold,
// SETBACK_HP), never copied magic numbers (D-086 rule 2).

const base = createInitialState(20260705);
const patch = (s: GameState, p: Partial<GameState>): GameState => ({ ...s, ...p });

describe('milestone detectors — (prev, next) commit diffs', () => {
  it('a rung change emits rung-up with a next-state snapshot', () => {
    const next = patch(base, { rung: 'R1', resources: { coin: 7, rice: 12 } });
    const events = detectMilestones(base, next);
    const rungUp = events.find((e) => e.kind === 'rung-up');
    expect(rungUp).toMatchObject({
      from: base.rung,
      to: 'R1',
      snapshot: { rung: 'R1', coin: 7, rice: 12 },
    });
  });

  it('a tier increase emits ascension', () => {
    const next = patch(base, { tier: base.tier + 1 });
    expect(detectMilestones(base, next).find((e) => e.kind === 'ascension')).toMatchObject({
      fromTier: base.tier,
      toTier: base.tier + 1,
    });
  });

  it('hp dropping TO SETBACK_HP from above emits loss; sitting AT it does not re-emit', () => {
    const above = patch(base, { character: { ...base.character, hp: balance.SETBACK_HP + 5 } });
    const routed = patch(base, { character: { ...base.character, hp: balance.SETBACK_HP } });
    expect(detectMilestones(above, routed).some((e) => e.kind === 'loss')).toBe(true);
    expect(detectMilestones(routed, routed).some((e) => e.kind === 'loss')).toBe(false);
  });

  it('any auto arming/disarming emits auto; only the DISARM also emits a note', () => {
    const armed = patch(base, { autoRake: true });
    const arm = detectMilestones(base, armed);
    expect(arm.find((e) => e.kind === 'auto')).toMatchObject({ armed: true });
    expect(arm.some((e) => e.kind === 'note')).toBe(false);

    const disarm = detectMilestones(armed, base);
    expect(disarm.find((e) => e.kind === 'auto')).toMatchObject({ armed: false });
    expect(disarm.some((e) => e.kind === 'note')).toBe(true);
  });

  it('the rung meter crossing rungThreshold emits a promotion-ready note (no rung change)', () => {
    const threshold = balance.rungThreshold(base.rung);
    const below = patch(base, { rungMeter: threshold - 1 });
    const ready = patch(base, { rungMeter: threshold });
    expect(detectMilestones(below, ready).some((e) => e.kind === 'note')).toBe(true);
    // Already past it: no repeat note on every later commit.
    expect(
      detectMilestones(ready, patch(base, { rungMeter: threshold + 1 })).some(
        (e) => e.kind === 'note',
      ),
    ).toBe(false);
  });

  it('an unchanged commit emits nothing', () => {
    expect(detectMilestones(base, base)).toEqual([]);
  });
});

describe('autosArmed / snapshot', () => {
  it('any of the three auto modes counts as armed', () => {
    expect(autosArmed(base)).toBe(false);
    expect(autosArmed(patch(base, { autoRake: true }))).toBe(true);
    expect(autosArmed(patch(base, { autoCombat: 'wolf' as GameState['autoCombat'] }))).toBe(true);
  });

  it('tGame follows the day*24+tick __qa.pacing convention', () => {
    const s = patch(base, { clock: { day: 3, tick: 7 } });
    expect(snapshot(s).tGame).toBe(3 * 24 + 7);
  });
});
