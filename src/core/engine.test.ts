import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  reduce,
  tick,
  availableActions,
  isUnlocked,
  hasFlag,
  INTRO_BEATS,
  introActive,
  introSceneAt,
  type Intent,
  type GameState,
} from './index';
import { SURFACES } from './content/surfaces';
import { COLD_OPEN, RAKE_CAP_LINE } from './content/coldOpen';
import { balance, satietyMax } from './index';
import { autoModeIntent } from './autoplay';

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

  it('open_eyes wakes and STARTS the interactive intro; the readouts WAIT for its end', () => {
    let s = createInitialState(1);
    s = reduce(s, { type: 'open_eyes' });
    expect(hasFlag(s, 'awake')).toBe(true);
    expect(hasFlag(s, 'dream-1')).toBe(true);
    // FB-318/FB-319 — the body/rice reveals hold until the cold-open VN ENDS (they read
    // as post-scene beats, never mid-VN noise); mid-intro they stay locked.
    expect(isUnlocked(s, 'readout-body')).toBe(false);
    expect(isUnlocked(s, 'readout-rice')).toBe(false);
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

  it('completing the intro reveals the body/rice readouts + lands their lines (FB-318/FB-319)', () => {
    let s = reduce(createInitialState(1), { type: 'open_eyes' });
    // march the intro to its end (first option each scene — fixtures derive from the registry)
    while (introActive(s.introBeat)) {
      const scene = introSceneAt(s.introBeat)!;
      s = reduce(s, { type: 'choose_intro', optionId: scene.decision.options[0]!.id });
    }
    expect(isUnlocked(s, 'readout-body')).toBe(true);
    expect(isUnlocked(s, 'readout-rice')).toBe(true);
    // the reveal LINES land on the intro-completing reduce — after the VN, never mid-scene
    for (const id of ['readout-body', 'readout-rice'] as const) {
      const line = SURFACES.find((d) => d.id === id)!.revealLine!.text;
      expect(
        s.log.entries.some((e) => e.text === line),
        `${id} reveal line missing post-intro`,
      ).toBe(true);
    }
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

// ── FB-324 (inbox drain 2026-07-10) — the spill is FINITE: RAKE_CAP rakes total, then the
//    rake refuses for good and auto-rake stops. Fixtures derive from balance.RAKE_CAP /
//    RICE_PER_RAKE (the source of truth, ADR-086) — never copied magic numbers.
describe('FB-324 — the rice spill exhausts at RAKE_CAP', () => {
  it('the capping rake still pays + speaks the line once; past it the act refuses', () => {
    let s = createInitialState(1);
    s = reduce(s, { type: 'open_eyes' });
    // one shy of the cap, body topped up (derived, not typed)
    s = {
      ...s,
      rakesDone: balance.RAKE_CAP - 1,
      introBeat: INTRO_BEATS.length, // intro done (auto pauses under a live VN — FB-266)
      character: { ...s.character, satiety: satietyMax(s) },
    };
    const before = s.banked.rice ?? 0;
    s = reduce(s, { type: 'rake_rice' });
    expect(s.rakesDone).toBe(balance.RAKE_CAP);
    expect(s.banked.rice).toBe(before + balance.RICE_PER_RAKE); // the capping rake still pays
    expect(s.log.entries.filter((e) => e.text === RAKE_CAP_LINE).length).toBe(1); // spoken once
    const refused = reduce(s, { type: 'rake_rice' });
    expect(refused).toBe(s); // refused outright: no rice, no body spent, no second line
    // and auto-rake disarms instead of spinning dead against the refusal
    const auto = reduce(s, { type: 'set_auto_rake', on: true });
    expect(autoModeIntent(auto)).toEqual({ type: 'set_auto_rake', on: false });
  });
});
