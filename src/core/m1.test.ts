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
  RANKS,
  type GameState,
  type Intent,
} from './index';
import { SKILL_XP_BASE } from './content/balance';

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
    s = run(s, repeat('rake_rice', 7)); // 7 × 2 meter points = the R0 threshold (14)
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
    s = run(s, repeat('rake_rice', 7)); // → R1
    s = run(s, farm(15)); // 15 × 2 = R1 threshold (30); first farm sets 'farmed'
    expect(s.rung).toBe('R2');
    expect(isUnlocked(s, 'tab-skills')).toBe(true); // the FIRST nav reveal
    expect(isUnlocked(s, 'verb-woodcut')).toBe(true);
    expect(isUnlocked(s, 'verb-forage')).toBe(true);
    expect(hasFlag(s, 'porters-knot')).toBe(true); // the ZERO-bonus Origin beat
    expect(skillVisible(s, 'farming')).toBe(true);
  });

  it('does not advance past R2 without the (M2a) combat gate', () => {
    let s = reduce(createInitialState(1), { type: 'open_eyes' });
    s = run(s, repeat('rake_rice', 7));
    s = run(s, [...farm(40)]); // pile on meter
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

describe('conditioning enablement gate (the danger ring)', () => {
  it('foraging is locked until conditioning reaches the gate level', () => {
    let s = reduce(createInitialState(1), { type: 'open_eyes' });
    s = run(s, repeat('rake_rice', 7));
    s = run(s, farm(15)); // → R2 (forage revealed but conditioning still Lv1)
    expect(canDoActivity(s, getActivity('forage_satoyama'))).toBe(false);
    // rest off the climb's fatigue, then haul builds conditioning to Lv2
    // (at full satiety the XP isn't stamina-throttled)
    s = run(s, repeat('rest', 5));
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
    s = run(s, repeat('rake_rice', 7));
    s = run(s, farm(15)); // R2
    const fresh = reduce(s, { type: 'do_activity', activityId: 'farm_paddy' });
    const freshKoku = (fresh.resources.koku ?? 0) - (s.resources.koku ?? 0);
    // drain satiety hard
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
