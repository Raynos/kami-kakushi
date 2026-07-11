// The NIGHT-ROUND ENGINE (storywave G2) — pure `(GameState, …) -> GameState` stage
// resolution for the on-rails night round. The CURRENT stage's foe is resolved through
// the EXISTING combat resolver (`resolveFight`) on the seeded `combat` stream, so a round
// is a deterministic replay like every other fight. Outcomes:
//   - a WON stage → MATERIALS-ONLY reward (NEVER coin — the bible: night-round spoils are
//     salvage, not pay) → advance to the next stage; finishing the last stage ends the round.
//   - a `scripted: 'survive'` stage (the R3 wolf) → GUARANTEED survival, NEVER a win: the
//     fighter lives (HP floored), the foe flees bleeding, no death and no victory reward.
//   - a FALL (loss) → the round ends here: the setback HP floor, the shared carried-loss
//     bleed + defeat→sickroom consequence (defeat.ts), cursor cleared.
// LIVE since G4: `NIGHT_ROUNDS` ships the R3 grain-watch round (content/nightRounds.ts);
// the gate post + quest wiring drive it in the real arc, and the registry sweep in
// night-rounds.test.ts guards every shipped round's invariants.

import type { GameState } from './state';
import { withResource, setFlag } from './state';
import { getMob } from './content/enemies';
import { mcCombatStats, mobCombatStats, resolveFight } from './combat';
import { rollMaterialDrop } from './content/crafting';
import { hasFlag } from './state';
import { SETBACK_HP } from './content/balance';
import { FLAVOR } from './content/flavor';
import { isNewMoon } from './selectors';
import { applyCarriedLossBleed, applyDefeatConsequences } from './defeat';
import { applyRewards } from './rewards';
import { enqueueScene } from './scenes';
import type { NightRoundDef, NightRoundStage } from './content/nightRounds';

/** The in-flight round cursor (mirrors `GameState['roundState']`). */
export type RoundState = { readonly roundId: string; readonly stage: number };

/** A won stage's reward — MATERIALS ONLY, never coin (bible). Exposed as a typed shape so a
 *  test can assert the reward carries no coin (RED the moment anyone adds a coin reward). */
export interface NightStageReward {
  readonly materials: Readonly<Record<string, number>>;
}

function setHp(state: GameState, hp: number): GameState {
  return { ...state, character: { ...state.character, hp } };
}

/** Roll a won stage's MATERIALS-ONLY reward off the foe's carcass (seeded LOOT stream). No
 *  coin path exists by construction — the return shape has only `materials`. */
export function nightStageReward(
  rng: GameState['rng'],
  stage: NightRoundStage,
): {
  reward: NightStageReward;
  rng: GameState['rng'];
} {
  const [drop, r] = rollMaterialDrop(rng, stage.foe);
  const materials: Record<string, number> = {};
  if (drop) materials[drop.material] = drop.qty;
  return { reward: { materials }, rng: r };
}

/** Advance the round cursor one stage; clearing `roundState` when the last stage is done
 *  (the round is FINISHED — its rewards were materials-only, granted per stage). */
function advanceStage(state: GameState, def: NightRoundDef): GameState {
  const cur = state.roundState;
  if (cur === null) return state;
  const nextStage = cur.stage + 1;
  if (nextStage >= def.stages.length) return { ...state, roundState: null };
  return { ...state, roundState: { roundId: cur.roundId, stage: nextStage } };
}

/** Resolve the CURRENT stage of an in-flight round through the seeded combat resolver. */
export function resolveNightStage(state: GameState, def: NightRoundDef): GameState {
  if (state.roundState === null || state.roundState.roundId !== def.id) return state;
  const stageIndex = state.roundState.stage;
  const stage = def.stages[stageIndex];
  if (!stage) return state; // no stage under the cursor (round already past its last)
  const mob = getMob(stage.foe);
  const result = resolveFight(state.rng, mcCombatStats(state), mobCombatStats(mob));
  let next: GameState = { ...state, rng: result.rng };

  if (stage.scripted === 'survive') {
    // The R3 wolf: GUARANTEED survival, NEVER a win. Ignore the sim's win/loss verdict —
    // force a survive-and-advance: HP floored at the setback floor (never 0, never a death),
    // and NO reward (a survive stage is never a victory). Blood on the sill, mostly his.
    next = setHp(next, Math.max(SETBACK_HP, result.mcHpLeft));
    // G4 — latch the R3→R4 requirement flag (requirements.gen R3 `the-wolf-survived-not-won`): the
    // survive stage IS the beat, replacing the deleted `applyScriptedWolf`/`first-fight-survived` path.
    next = setFlag(next, 'wolf-survived-not-won');
    // C4.4 — the stage's authored encounter read (u3-B's night-round-wolf), the beat this
    // return used to name and never emit. The dawn aftermath is the R3 rung beat's.
    next = emitStageNarration(next, stage, def.id, stageIndex);
    return advanceStage(next, def);
  }

  if (result.won) {
    next = setHp(next, result.mcHpLeft);
    // MATERIALS-ONLY reward (never coin — bible), rolled on the LOOT stream (independent of
    // the combat cursor) so it folds cleanly into the round's seeded replay.
    const { reward, rng: lootRng } = nightStageReward(next.rng, stage);
    next = { ...next, rng: lootRng };
    for (const [id, qty] of Object.entries(reward.materials)) next = withResource(next, id, qty);
    next = emitStageNarration(next, stage, def.id, stageIndex); // C4.4 — the won stage's aftermath
    return advanceStage(next, def);
  }

  // FALL (loss): the round ENDS here — HP at the setback floor, cursor cleared, the shared
  // carried-loss BLEED (defeat.ts, ONE home with the grind-fight loss — B2/ADR-164: a night
  // fall costs what a day-fight loss costs in like state), and the SHARED defeat→sickroom
  // consequence: Sōan's ledger grows, SICKROOM_DAYS_LOST whole days are lost, and the MC
  // relocates to the sickroom node once it exists. Logged through the same `combat.loss`
  // line the day loss uses (TST1 — one wording for the rout).
  const hpBefore = state.character.hp;
  next = setHp(next, SETBACK_HP);
  const bled = applyCarriedLossBleed(next);
  next = bled.next;
  next = applyRewards(next, {
    log: [
      {
        channel: 'combat',
        contentKey: 'combat.loss',
        params: {
          mob: mob.label.toLowerCase(),
          hpBefore,
          hpAfter: SETBACK_HP,
          lostCoin: bled.lostCoin,
          lostMats: bled.lostMats,
        },
      },
      // C4.4 — the authored sickroom-wake read (u3-B's night-round-fall) rides WITH the
      // mechanical cost line above (which carries the numbers; this carries the fiction).
      {
        channel: 'narration',
        voice: 'narrator',
        text: FLAVOR.nightRoundFall,
        contentKey: 'flavor.nightRoundFall',
      },
    ],
  });
  next = applyDefeatConsequences(next);
  return { ...next, roundState: null };
}

/** Emit a stage's authored LOG narration (C4.4 — u3-B's staged native lines). A stage
 *  without one stays silent (nothing invented — bible §0.5). */
function emitStageNarration(
  state: GameState,
  stage: NightRoundStage,
  roundId: string,
  index: number,
): GameState {
  if (!stage.narration) return state;
  return applyRewards(state, {
    log: [
      {
        channel: 'narration',
        voice: 'narrator',
        text: stage.narration,
        contentKey: `nightRound.${roundId}.stage.${index}`,
      },
    ],
  });
}

/** Begin a round: seat the cursor at stage 0 (the `begin_night_round` reducer arm), read
 *  the authored watch-post line, and key the NEW-MOON beats (C4.4): on the dark of the
 *  moon, the round either opens the fed-dog's bark coda (the sb-dog-coda VN — once, only
 *  after the dog beat's fed branch) or logs the hooded-lantern sighting; never both in
 *  one round (one lantern moment — TST1). */
export function beginNightRound(state: GameState, def: NightRoundDef): GameState {
  let next: GameState = { ...state, roundState: { roundId: def.id, stage: 0 } };
  next = applyRewards(next, {
    log: [
      {
        channel: 'narration',
        voice: 'narrator',
        text: FLAVOR.nightRoundPost,
        ephemeral: true,
        contentKey: 'flavor.nightRoundPost',
      },
    ],
  });
  if (isNewMoon(next)) {
    const codaFresh = hasFlag(next, 'sb-dog-fed') && !next.scenesPlayed.includes('sb-dog-coda');
    if (codaFresh) {
      next = enqueueScene(next, 'sb-dog-coda');
    } else {
      next = applyRewards(next, {
        log: [
          {
            channel: 'narration',
            voice: 'narrator',
            text: FLAVOR.nightRoundNewMoon,
            contentKey: 'flavor.nightRoundNewMoon',
          },
        ],
      });
    }
  }
  return next;
}
