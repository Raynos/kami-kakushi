import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  reduce,
  tick,
  isUnlocked,
  hasFlag,
  skillLevel,
  skillVisible,
  canDoActivity,
  getActivity,
  season,
  levelForXp,
  promoteRungs,
  phaseOf,
  mcCombatStats,
  hpMax,
  RANKS,
  type GameState,
  type Intent,
} from './index';
import { SKILL_XP_BASE, rungThreshold, RUNG_POINTS_PER_ACT } from './content/balance';

function run(s: GameState, intents: Intent[]): GameState {
  for (const i of intents) s = reduce(s, i);
  return s;
}
function repeat(type: 'rake_rice' | 'rest', n: number): Intent[] {
  return Array.from({ length: n }, () => ({ type }) as Intent);
}
function farm(n: number): Intent[] {
  return Array.from(
    { length: n },
    () => ({ type: 'do_activity', activityId: 'farm_paddy' }) as Intent,
  );
}
// Acts to fill the CURRENT rung's meter — flat RUNG_POINTS_PER_ACT/act, satiety-INDEPENDENT
// (ranks.ts). D-056 retired the tiny DEMO thresholds, so a promotion is driven by the rung's
// real point count, not a hand-tuned literal; deriving it keeps these tests threshold-agnostic.
const actsToPromote = (s: GameState): number =>
  Math.ceil(rungThreshold(s.rung) / RUNG_POINTS_PER_ACT);

describe('skill XP curve', () => {
  it('levels on the cumulative 1.3× table', () => {
    expect(levelForXp(0)).toBe(1);
    expect(levelForXp(SKILL_XP_BASE - 1)).toBe(1);
    expect(levelForXp(SKILL_XP_BASE)).toBe(2);
    expect(levelForXp(10_000)).toBeGreaterThan(2);
  });
});

describe('T0 Phase-1 rung climb', () => {
  it('raking the spilled stores earns the kept-hand rung (R0→R1) and opens the estate', () => {
    let s = reduce(createInitialState(1), { type: 'open_eyes' });
    expect(s.rung).toBe('R0');
    s = run(s, repeat('rake_rice', actsToPromote(s))); // raking fills the R0 meter → R1
    expect(s.rung).toBe('R1');
    expect(hasFlag(s, 'rank-r1')).toBe(true);
    expect(isUnlocked(s, 'verb-farm')).toBe(true);
    expect(isUnlocked(s, 'verb-haul')).toBe(true);
    expect(isUnlocked(s, 'readout-clock')).toBe(true);
    expect(isUnlocked(s, 'readout-stamina')).toBe(true);
    expect(isUnlocked(s, 'panel-rung-ladder')).toBe(true);
  });

  it('field work earns the trusted-hand rung (R1→R2): first nav, skills, the wider estate', () => {
    let s = reduce(createInitialState(1), { type: 'open_eyes' });
    s = run(s, repeat('rake_rice', actsToPromote(s))); // → R1
    s = run(s, farm(actsToPromote(s))); // fills the R1 meter → R2; first farm sets 'farmed'
    expect(s.rung).toBe('R2');
    expect(isUnlocked(s, 'tab-skills')).toBe(true); // the FIRST nav reveal
    expect(isUnlocked(s, 'verb-woodcut')).toBe(true);
    expect(isUnlocked(s, 'verb-forage')).toBe(true);
    expect(hasFlag(s, 'porters-knot')).toBe(true); // the ZERO-bonus Origin beat
    expect(skillVisible(s, 'farming')).toBe(true);
  });

  it('does not advance past R2 without the (M2a) combat gate', () => {
    let s = reduce(createInitialState(1), { type: 'open_eyes' });
    s = run(s, repeat('rake_rice', actsToPromote(s))); // → R1
    s = run(s, farm(actsToPromote(s))); // → R2
    s = run(s, farm(actsToPromote(s) + 10)); // pile the R2 meter well past its threshold
    expect(s.rung).toBe('R2'); // R2→R3 storyGate needs 'first-fight-survived' (built at M2a)
  });
});

// M2·2 — the thin R4→R7 ladder closes T0: the capstone opens Phase 2 (the macro-pillar grind).
describe('T0 ladder R4→R7 + the capstone (M2·2)', () => {
  it('the rung ladder is the contiguous T0 spine R0…R7', () => {
    expect(RANKS.map((r) => r.id)).toEqual(['R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7']);
    expect(RANKS.every((r) => r.tier === 0)).toBe(true);
  });

  it('R3→R4 needs real gate-watch duty (combat-blooded), not just the meter', () => {
    const base = createInitialState(1);
    const atR3 = (extra: Record<string, boolean>): GameState => ({
      ...base,
      rung: 'R3',
      rungMeter: 100000, // meter half of the AND-gate satisfied
      flags: { ...base.flags, awake: true, ...extra },
    });
    expect(promoteRungs(atR3({})).rung).toBe('R3'); // meter alone won't pass
    expect(promoteRungs(atR3({ 'combat-blooded': true })).rung).toBe('R4'); // duty done → promotes
  });

  it('the ladder climbs R0→R7 and the capstone opens Phase 2', () => {
    let s = createInitialState(1);
    s = {
      ...s,
      flags: {
        ...s.flags,
        awake: true,
        farmed: true, // R1→R2 story half
        'first-fight-survived': true, // R2→R3 story half
        'combat-blooded': true, // R3→R4 story half
      },
    };
    expect(phaseOf(s)).toBe(1);
    let guard = 0;
    while (s.rung !== 'R7' && guard++ < 20) {
      s = promoteRungs({ ...s, rungMeter: 100000 }); // refill the meter between promotions
    }
    expect(s.rung).toBe('R7');
    expect(hasFlag(s, 't0-capstone')).toBe(true);
    expect(phaseOf(s)).toBe(2); // the macro engine opens
  });
});

// T0-M1-F3 — the diegetic labour mentor Genemon greets + teaches, data-not-script, in the
// story LOG (not a popup, D-039/D-063/D-064); the gated acknowledgment is reveal-as-plot.
describe('diegetic mentor onboarding (Genemon) — T0-M1-F3', () => {
  it('Genemon greets on waking with a LEAN hook (greet + the stakes), not the whole monologue', () => {
    const s = reduce(createInitialState(1), { type: 'open_eyes' });
    expect(s.deliveredDialogue).toContain('gen-greet'); // the hook
    expect(s.deliveredDialogue).toContain('gen-stores'); // the stakes (why rake)
    expect(s.log.entries.some((e) => e.channel === 'narration' && e.text.includes('Genemon'))).toBe(
      true,
    );
    // the koku-teaching + promise + acknowledgment are reveal-as-plot — NOT on the first click
    expect(s.deliveredDialogue).not.toContain('gen-rake');
    expect(s.deliveredDialogue).not.toContain('gen-keep');
    expect(s.deliveredDialogue).not.toContain('gen-kept');
  });

  it('the koku-teaching + acknowledgment land only after you actually rake (reveal-as-plot)', () => {
    let s = reduce(createInitialState(1), { type: 'open_eyes' });
    s = reduce(s, { type: 'rake_rice' });
    expect(s.deliveredDialogue).toContain('gen-rake'); // the koku lesson, as +koku shows
    expect(s.deliveredDialogue).toContain('gen-keep');
    expect(s.deliveredDialogue).toContain('gen-kept'); // the acknowledgment
    // …and they never double-deliver
    const before = s.deliveredDialogue.length;
    s = reduce(s, { type: 'rake_rice' });
    expect(s.deliveredDialogue.length).toBe(before);
  });
});

// T0-M4-F4 — the small walkable estate map: areas you MOVE BETWEEN, gated by the existing
// room reveals + the conditioning danger-ring gate (D-065).
describe('walkable estate map (T0-M4-F4 / D-065)', () => {
  it('move_to walks to an adjacent revealed node, blocks non-adjacent + the danger gate', () => {
    const base = createInitialState(1);
    const atForecourt: GameState = {
      ...base,
      location: 'gate-forecourt',
      flags: { ...base.flags, awake: true },
      unlocked: [...base.unlocked, 'room-gate-forecourt', 'room-home-paddies'],
    };
    // adjacent + revealed → you move
    expect(reduce(atForecourt, { type: 'move_to', to: 'home-paddies' }).location).toBe(
      'home-paddies',
    );
    // non-adjacent (satoyama isn't off the forecourt) → no-op
    expect(reduce(atForecourt, { type: 'move_to', to: 'near-satoyama' })).toBe(atForecourt);
    // the danger ring needs the conditioning gate even when adjacent + revealed
    const atPaddies: GameState = {
      ...atForecourt,
      location: 'home-paddies',
      unlocked: [...atForecourt.unlocked, 'room-near-satoyama'],
    };
    expect(reduce(atPaddies, { type: 'move_to', to: 'near-satoyama' })).toBe(atPaddies);
  });
});

// PRD no-magic / mediocre-start acceptance criterion (battery #17): the porter's-knot Origin
// beat is FLAVOR — it grants ZERO mechanical bonus. A RED-able invariant: two states differing
// ONLY in the knot/dream flags produce byte-identical combat stats, HP ceiling, and labour yield.
// If anyone ever wires the dream to a stat, this flips RED.
describe("porter's-knot is mechanically inert (no-magic / mediocre-start)", () => {
  it('the origin-dream flags change no combat stat, HP ceiling, or labour yield', () => {
    const base = createInitialState(1);
    const plain: GameState = {
      ...base,
      rung: 'R2',
      flags: { ...base.flags, awake: true },
      unlocked: [...base.unlocked, 'verb-farm', 'tab-combat'],
    };
    const withKnot: GameState = {
      ...plain,
      flags: { ...plain.flags, 'porters-knot': true, 'dream-1': true },
    };
    // combat stats + HP ceiling are identical (the dream grants no might/guard/vigor/hp)
    expect(mcCombatStats(withKnot)).toEqual(mcCombatStats(plain));
    expect(hpMax(withKnot)).toBe(hpMax(plain));
    // labour yields the same koku (the dream is no productivity blessing either)
    const yKnot = reduce(withKnot, { type: 'do_activity', activityId: 'farm_paddy' });
    const yPlain = reduce(plain, { type: 'do_activity', activityId: 'farm_paddy' });
    expect(yKnot.resources.koku).toBe(yPlain.resources.koku);
  });
});

describe('conditioning enablement gate (the danger ring)', () => {
  it('foraging is locked until conditioning reaches the gate level', () => {
    let s = reduce(createInitialState(1), { type: 'open_eyes' });
    s = run(s, repeat('rake_rice', actsToPromote(s))); // → R1
    s = run(s, farm(actsToPromote(s))); // → R2 (forage revealed but conditioning still Lv1)
    expect(canDoActivity(s, getActivity('forage_satoyama'))).toBe(false);
    // top off the climb's fatigue so conditioning XP isn't stamina-throttled, then haul builds it to Lv2
    s = { ...s, character: { ...s.character, satiety: 100 } };
    s = run(
      s,
      Array.from(
        { length: 5 },
        () => ({ type: 'do_activity', activityId: 'haul_stores' }) as Intent,
      ),
    );
    expect(skillLevel(s, 'conditioning')).toBeGreaterThanOrEqual(2);
    expect(canDoActivity(s, getActivity('forage_satoyama'))).toBe(true);
  });
});

describe('soft stamina + season', () => {
  it('a drained body yields less but never zero (soft throttle)', () => {
    let s = reduce(createInitialState(1), { type: 'open_eyes' });
    s = run(s, repeat('rake_rice', actsToPromote(s))); // → R1
    s = run(s, farm(actsToPromote(s))); // → R2
    s = { ...s, character: { ...s.character, satiety: 100 } }; // a fed body for the fresh baseline
    const fresh = reduce(s, { type: 'do_activity', activityId: 'farm_paddy' });
    const freshKoku = (fresh.resources.koku ?? 0) - (s.resources.koku ?? 0);
    // drain satiety hard (40 hauls × 4 satiety → the floor)
    let drained = s;
    for (let i = 0; i < 40; i++)
      drained = reduce(drained, { type: 'do_activity', activityId: 'haul_stores' });
    expect(drained.character.satiety).toBeLessThan(20);
    const tired = reduce(drained, { type: 'do_activity', activityId: 'farm_paddy' });
    const tiredKoku = (tired.resources.koku ?? 0) - (drained.resources.koku ?? 0);
    expect(tiredKoku).toBeGreaterThan(0); // never zero
    expect(tiredKoku).toBeLessThanOrEqual(freshKoku);
  });

  it('the clock turns seasons deterministically', () => {
    const s = createInitialState(1);
    expect(season(s)).toBe('spring');
    expect(season(tick(s, 28 * 24 * 2))).toBe('autumn'); // day 56
  });
});
