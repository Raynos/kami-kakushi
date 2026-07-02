import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  reduce,
  tick,
  availableActions,
  isUnlocked,
  hasFlag,
  type Intent,
  type GameState,
} from './index';

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
    // waking no longer dumps the cold open — it starts Beat 0 (the wake line + Sōan's grounding),
    // revealed AFTER the click (F15). The dream + Genemon greet are now LATER beats, not on wake.
    expect(s.introBeat).toBe(0);
    expect(s.log.entries.some((e) => e.voice === 'physician' && e.text.includes('Sōan'))).toBe(
      true,
    );
    expect(s.log.entries.some((e) => e.text.includes('Genemon'))).toBe(false); // deferred to Beat 3
    // Genemon's greet is retired from the registry dump (marked delivered so it can't double-fire),
    // while the rake TEACHING stays deferred until you actually rake.
    expect(s.deliveredDialogue).toContain('gen-greet');
    expect(s.deliveredDialogue).not.toContain('gen-rake');
  });

  it('raking earns koku, drains satiety, and reveals rest', () => {
    let s = reduce(createInitialState(1), { type: 'open_eyes' });
    const koku0 = s.resources.koku ?? 0;
    const sat0 = s.character.satiety;
    s = reduce(s, { type: 'rake_rice' });
    expect(s.resources.koku ?? 0).toBeGreaterThan(koku0);
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
