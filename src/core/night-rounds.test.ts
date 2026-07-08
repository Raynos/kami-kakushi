import { describe, it, expect } from 'vitest';
import { createInitialState, type GameState } from './index';
import { resolveNightStage, nightStageReward, beginNightRound } from './night-rounds';
import type { NightRoundDef } from './content/nightRounds';
import { mcCombatStats, mobCombatStats, resolveFight } from './combat';
import { getMob } from './content/enemies';

// storywave G2 — the NIGHT-ROUND engine proof. NIGHT_ROUNDS ships EMPTY at G2, so these drive a
// CONSTRUCTED NightRoundDef through the engine directly. The invariants under test: a seeded round
// resolves stage-by-stage; a `scripted:'survive'` stage cannot kill OR win; a fall ENDS the round
// (→ the sickroom path at G3); a finish carries MATERIALS, never coin (RED if anyone adds coin).

/** A STRONG MC that reliably wins a weak fight — makes the win branch deterministic across seeds. */
function strongMc(seed = 1): GameState {
  const s = createInitialState(seed);
  return {
    ...s,
    character: {
      ...s.character,
      hp: 500,
      level: 20,
      attrs: { str: 30, agi: 30, int: 20, spd: 30, luck: 20 },
    },
  };
}

/** A WEAK MC that reliably LOSES to a strong foe — makes the fall / survive branches meaningful. */
function weakMc(seed = 1): GameState {
  const s = createInitialState(seed);
  return { ...s, character: { ...s.character, hp: 4 } };
}

describe('G2 night-round engine — a seeded round resolves stage by stage', () => {
  it('advances the cursor 0→1→…→done, one stage per resolve', () => {
    const def: NightRoundDef = {
      id: 'round-test',
      stages: [
        { id: 's0', areaId: 'gate-forecourt', foe: 'rice_rats' },
        { id: 's1', areaId: 'gate-forecourt', foe: 'rice_rats' },
      ],
    };
    let s = beginNightRound(strongMc(1), def);
    expect(s.roundState).toEqual({ roundId: def.id, stage: 0 });
    s = resolveNightStage(s, def);
    expect(s.roundState).toEqual({ roundId: def.id, stage: 1 }); // won stage 0 → advanced
    s = resolveNightStage(s, def);
    expect(s.roundState).toBeNull(); // won the last stage → round finished
  });

  it('finishing yields MATERIALS only — never coin', () => {
    const def: NightRoundDef = {
      id: 'round-coinless',
      stages: [{ id: 's0', areaId: 'deep-satoyama', foe: 'boar' }], // boar has a rich material drop
    };
    const start = strongMc(2);
    const end = resolveNightStage(beginNightRound(start, def), def);
    expect(end.roundState).toBeNull(); // won → round done
    // no coin was minted by the round (started at 0, still 0) — RED if anyone adds a coin reward
    expect(end.resources.coin ?? 0).toBe(start.resources.coin ?? 0);
    // and the reward SHAPE itself carries no coin key (materials-only by construction)
    const { reward } = nightStageReward(start.rng, def.stages[0]!);
    expect('coin' in reward.materials).toBe(false);
  });
});

describe("G2 night-round engine — a `scripted:'survive'` stage cannot kill or win", () => {
  it('the fighter survives and the round advances even when the real fight would be a LOSS', () => {
    const def: NightRoundDef = {
      id: 'round-wolf',
      stages: [
        { id: 'wolf', areaId: 'kura', foe: 'bandit', scripted: 'survive' }, // bandit = strong foe
        { id: 'after', areaId: 'kura', foe: 'rice_rats' },
      ],
    };
    const start = beginNightRound(weakMc(3), def);
    // PRECONDITION: the underlying real fight IS a loss — so the survive guarantee is doing work.
    const real = resolveFight(start.rng, mcCombatStats(start), mobCombatStats(getMob('bandit')));
    expect(real.won).toBe(false);

    const after = resolveNightStage(start, def);
    // survived (HP > 0, never a death) AND advanced (NOT a round-ending fall) — RED if the survive
    // handling is removed (a loss would clear roundState instead of advancing to the next stage).
    expect(after.character.hp).toBeGreaterThan(0);
    expect(after.roundState).toEqual({ roundId: def.id, stage: 1 });
    // never a win: no material reward was granted (a survive stage yields nothing)
    expect(after.resources).toEqual(start.resources);
  });
});

describe('G2 night-round engine — a fall ends the round (→ sickroom at G3)', () => {
  it('a lost non-scripted stage clears roundState (the round is over)', () => {
    const def: NightRoundDef = {
      id: 'round-fall',
      stages: [{ id: 's0', areaId: 'woodlot-edge', foe: 'bandit' }],
    };
    const start = beginNightRound(weakMc(4), def);
    const real = resolveFight(start.rng, mcCombatStats(start), mobCombatStats(getMob('bandit')));
    expect(real.won).toBe(false); // precondition: this stage is a loss
    const after = resolveNightStage(start, def);
    expect(after.roundState).toBeNull(); // the fall ended the round
  });
});
