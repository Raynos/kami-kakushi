import { describe, it, expect } from 'vitest';
import { createInitialState, type GameState } from './index';
import {
  resolveNightStage,
  nightStageReward,
  beginNightRound,
} from './night-rounds';
import type { NightRoundDef } from './content/nightRounds';
import { NIGHT_ROUNDS } from './content/nightRounds';
import { mcCombatStats, mobCombatStats, resolveFight } from './combat';
import { getMob } from './content/enemies';
import { LOSS_COIN_FRAC, LOSS_MATERIAL_FRAC } from './content/balance';
import { MATERIALS } from './content/crafting';

// storywave G2 engine proof + the B3 registry sweep. The engine invariants drive a CONSTRUCTED
// NightRoundDef directly (a seeded round resolves stage-by-stage; a `scripted:'survive'` stage
// cannot kill OR win; a fall ENDS the round). The REGISTRY sweep below then walks the REAL,
// LIVE `NIGHT_ROUNDS` (shipping since G4) so a future coin reward or bleed regression in any
// shipped round goes RED — the constructed defs alone were registry-blind (the B3 finding).

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
        { id: 's0', areaId: 'forecourt', foe: 'store_rats' },
        { id: 's1', areaId: 'forecourt', foe: 'store_rats' },
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
      stages: [{ id: 's0', areaId: 'grove', foe: 'wolf' }], // boar has a rich material drop
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
        { id: 'after', areaId: 'kura', foe: 'store_rats' },
      ],
    };
    const start = beginNightRound(weakMc(3), def);
    // PRECONDITION: the underlying real fight IS a loss — so the survive guarantee is doing work.
    const real = resolveFight(
      start.rng,
      mcCombatStats(start),
      mobCombatStats(getMob('bandit')),
    );
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
      stages: [{ id: 's0', areaId: 'woodlot', foe: 'bandit' }],
    };
    const start = beginNightRound(weakMc(4), def);
    const real = resolveFight(
      start.rng,
      mcCombatStats(start),
      mobCombatStats(getMob('bandit')),
    );
    expect(real.won).toBe(false); // precondition: this stage is a loss
    const after = resolveNightStage(start, def);
    expect(after.roundState).toBeNull(); // the fall ended the round
  });
});

/** Load the MC's pockets so the bleed has something real to bite. */
function withCarried(s: GameState): GameState {
  const mats = Object.fromEntries(MATERIALS.map((m) => [m.id, 9]));
  return { ...s, resources: { ...s.resources, coin: 25, ...mats } };
}

describe('the REAL NIGHT_ROUNDS registry (B3) — every shipped round holds the invariants', () => {
  it('every stage of every shipped round rewards MATERIALS only — never coin', () => {
    expect(NIGHT_ROUNDS.length).toBeGreaterThan(0); // the sweep is live, never vacuous
    const materialIds = new Set(MATERIALS.map((m) => m.id));
    for (const def of NIGHT_ROUNDS) {
      for (const stage of def.stages) {
        // roll on several streams so a coin drop can't hide behind one seed
        for (const seed of [1, 2, 3, 4, 5]) {
          const { reward } = nightStageReward(
            createInitialState(seed).rng,
            stage,
          );
          expect('coin' in reward.materials).toBe(false);
          for (const key of Object.keys(reward.materials)) {
            // every rolled key is a real MATERIAL id (coin is not one) — RED the moment a
            // stage's drop table mints anything that isn't salvage
            expect(
              materialIds.has(key),
              `${def.id}/${stage.id} rolled '${key}'`,
            ).toBe(true);
          }
        }
      }
    }
  });

  it("a losable stage's fall bleeds EXACTLY what the day-fight loss bleeds (derived, like state)", () => {
    for (const def of NIGHT_ROUNDS) {
      const idx = def.stages.findIndex((st) => !st.scripted);
      if (idx === -1) continue; // a round with no losable stage has no fall to test
      const stage = def.stages[idx]!;
      // find a seed where the weak MC genuinely LOSES this stage's real fight (deterministic
      // search — the precondition guarantees the fall branch is the one under test)
      let start: GameState | null = null;
      for (let seed = 1; seed <= 200 && start === null; seed++) {
        const s = withCarried(weakMc(seed));
        const real = resolveFight(
          s.rng,
          mcCombatStats(s),
          mobCombatStats(getMob(stage.foe)),
        );
        if (!real.won) start = s;
      }
      expect(
        start,
        `${def.id}: no losing seed found for '${stage.foe}'`,
      ).not.toBeNull();
      let s = beginNightRound(start!, def);
      s = { ...s, roundState: { roundId: def.id, stage: idx } };
      const before = s.resources;
      const after = resolveNightStage(s, def);
      expect(after.roundState).toBeNull(); // the fall ended the round
      // the bleed derives from the balance constants — never copied fractions (test law #2)
      const coinHad = before.coin ?? 0;
      expect(after.resources.coin ?? 0).toBe(
        coinHad - Math.round(coinHad * LOSS_COIN_FRAC),
      );
      for (const m of MATERIALS) {
        const had = before[m.id] ?? 0;
        expect(after.resources[m.id] ?? 0).toBe(
          had - Math.floor(had * LOSS_MATERIAL_FRAC),
        );
      }
    }
  });
});
