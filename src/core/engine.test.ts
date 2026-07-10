import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  reduce,
  tick,
  availableActions,
  isUnlocked,
  hasFlag,
  INTRO_BEATS,
  type Intent,
  type GameState,
} from './index';
import { COLD_OPEN } from './content/coldOpen';

function play(seed: number, intents: Intent[]): GameState {
  let s = createInitialState(seed);
  for (const i of intents) s = reduce(s, i);
  return s;
}

describe('cold-open reducer flow', () => {
  it('starts with a single verb and no vitals revealed', () => {
    const s = createInitialState(1);
    expect(availableActions(s)).toEqual(['open_eyes']);
    expect(isUnlocked(s, 'readout-rice')).toBe(false);
    expect(isUnlocked(s, 'readout-body')).toBe(false);
    expect(s.log.entries.length).toBe(0);
  });

  it('open_eyes wakes, reveals the body/rice readouts, and STARTS the interactive intro', () => {
    let s = createInitialState(1);
    s = reduce(s, { type: 'open_eyes' });
    expect(hasFlag(s, 'awake')).toBe(true);
    expect(hasFlag(s, 'dream-1')).toBe(true);
    expect(isUnlocked(s, 'readout-body')).toBe(true);
    expect(isUnlocked(s, 'readout-rice')).toBe(true);
    // the rake verb is legal once awake (the intro is a parallel presentation layer, plan §4.4)
    expect(availableActions(s)).toEqual(['rake_rice']);
    // waking no longer dumps the cold open — it starts Beat 0, revealed AFTER the click (FB-15),
    // not a pre-run dump. HD-37: Beat 0 is the DREAM act (memory fragments before waking); the
    // wake line + Sōan's exam land when the sickroom scene (beat 1) is entered.
    expect(s.introBeat).toBe(0);
    expect(s.log.entries.some((e) => e.text === COLD_OPEN.dream)).toBe(true); // the dream landed
    expect(s.log.entries.some((e) => e.text === COLD_OPEN.wake)).toBe(false); // the wake waits for beat 1
    const atSoan = reduce(s, {
      type: 'choose_intro',
      optionId: INTRO_BEATS[0]!.options![0]!.id,
    });
    expect(atSoan.log.entries.some((e) => e.voice === 'physician')).toBe(true); // Sōan's exam
    expect(atSoan.log.entries.some((e) => e.text === COLD_OPEN.wake)).toBe(true); // the wake line landed
    // the registry's UNGATED Genemon greet/stakes are marked delivered so they can't double-fire,
    // while the rake TEACHING stays deferred until you actually rake.
    expect(s.deliveredDialogue).toContain('gen-greet');
    expect(s.deliveredDialogue).not.toContain('gen-rake');
  });

  it('raking earns rice, drains satiety, and reveals rest', () => {
    let s = reduce(createInitialState(1), { type: 'open_eyes' });
    // ADR-163: the raked spilled rice banks into the KURA (shō), never a carried pocket.
    const rice0 = s.banked.rice ?? 0;
    const sat0 = s.character.satiety;
    s = reduce(s, { type: 'rake_rice' });
    expect(s.banked.rice ?? 0).toBeGreaterThan(rice0);
    expect(s.character.satiety).toBeLessThan(sat0);
    expect(hasFlag(s, 'raked')).toBe(true);
    expect(availableActions(s)).toContain('rest');
  });

  it('an illegal intent is a no-op (same reference)', () => {
    const s = createInitialState(1);
    expect(reduce(s, { type: 'rake_rice' })).toBe(s); // not awake yet
    const awake = reduce(s, { type: 'open_eyes' });
    expect(reduce(awake, { type: 'open_eyes' })).toBe(awake); // already awake
  });

  it('rest restores satiety toward the max', () => {
    let s = play(1, [{ type: 'open_eyes' }, { type: 'rake_rice' }, { type: 'rake_rice' }]);
    const before = s.character.satiety;
    s = reduce(s, { type: 'rest' });
    expect(s.character.satiety).toBeGreaterThan(before);
  });
});

describe('determinism', () => {
  const script: Intent[] = [
    { type: 'open_eyes' },
    { type: 'rake_rice' },
    { type: 'rake_rice' },
    { type: 'rest' },
    { type: 'rake_rice' },
  ];

  it('a fixed seed + intent script yields a byte-identical state', () => {
    expect(JSON.stringify(play(123, script))).toBe(JSON.stringify(play(123, script)));
  });

  it('tick folds one at a time: tick(s, a+b) === tick(tick(s, a), b)', () => {
    const s = reduce(createInitialState(1), { type: 'open_eyes' });
    expect(JSON.stringify(tick(s, 5))).toBe(JSON.stringify(tick(tick(s, 2), 3)));
  });

  it('tick advances the clock and rolls over days', () => {
    const s = createInitialState(1);
    const t = tick(s, 30); // > 24 ticks/day
    expect(t.clock.day).toBe(1);
    expect(t.clock.tick).toBe(6);
  });
});
