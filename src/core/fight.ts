// Fight resolution → GameState (PRD §4.6 / D-Q-idle-combat). Auto-resolve fights
// everything; a WIN grants combat-XP (→ character level) + koku; a LOSS is a soft,
// SELF-RECOVERING setback — the MC limps to safety and rests (a time cost) and never
// loses a level / gear / Influence (LOCKED shape, §4.6.6). The scripted grain-store
// wolf is a guaranteed-survival humbling beat that opens R3.

import type { GameState } from './state';
import type { MobId } from './content/enemies';
import { getMob } from './content/enemies';
import { mcCombatStats, mobCombatStats, resolveFight, combatLevelForXp } from './combat';
import { applyRewards } from './rewards';
import { advanceClock } from './step';
import { hpMax, satietyMax } from './selectors';
import { NAMES } from './content/names';
import {
  COMBAT_XP_K,
  SETBACK_HP,
  SETBACK_TICKS,
  FORCED_REST_TICKS,
  DURABILITY_WEAR_PER_FIGHT,
  FIGHT_TICKS,
} from './content/balance';

function setHp(state: GameState, hp: number): GameState {
  return { ...state, character: { ...state.character, hp } };
}

function wearWeapon(state: GameState): GameState {
  return {
    ...state,
    weaponDurability: Math.max(0, state.weaponDurability - DURABILITY_WEAR_PER_FIGHT),
  };
}

function gainCombatXp(state: GameState, amount: number): GameState {
  const combatXp = state.character.combatXp + amount;
  let next: GameState = { ...state, character: { ...state.character, combatXp } };
  const newLevel = combatLevelForXp(combatXp);
  if (newLevel > state.character.level) {
    next = {
      ...next,
      character: {
        ...next.character,
        level: newLevel,
        attributePoints: next.character.attributePoints + (newLevel - state.character.level),
      },
    };
    next = setHp(next, hpMax(next)); // a level-up heals to full — a satisfying beat
    next = applyRewards(next, {
      log: [
        {
          channel: 'milestone',
          text: `Your body has hardened with the fighting. Combat rank ${newLevel}.`,
        },
      ],
    });
    if (newLevel >= 2 && state.flags['axe-offered'] !== true) {
      next = applyRewards(next, {
        flags: ['axe-offered'],
        unlock: ['verb-equip-axe'],
        log: [
          {
            channel: 'narration',
            text: `${NAMES.drillmaster} eyes your carrying-pole and tosses you a felling axe off the woodlot rack. "A real edge, for a real guard. Use it."`,
          },
        ],
      });
    }
  }
  return next;
}

/** A grindable fight: real outcome, self-recovering loss. */
export function applyGrindFight(state: GameState, mobId: MobId): GameState {
  const mob = getMob(mobId);
  const result = resolveFight(state.rng, mcCombatStats(state), mobCombatStats(mob));
  let next: GameState = { ...state, rng: result.rng };
  next = wearWeapon(next);
  next = applyRewards(next, { flags: [`mob-${mob.id}`] }); // bestiary fills by encounter

  if (result.won) {
    next = setHp(next, result.mcHpLeft);
    next = applyRewards(next, {
      resources: { koku: mob.kokuReward },
      log: [
        {
          channel: 'combat',
          text: `You fell the ${mob.label.toLowerCase()}. (+${mob.kokuReward} koku)`,
        },
      ],
    });
    next = gainCombatXp(next, mob.level * COMBAT_XP_K);
    next = advanceClock(next, FIGHT_TICKS);
  } else {
    // soft setback + forced rest — never lose level/xp/gear (no death-spiral)
    next = setHp(next, SETBACK_HP);
    next = applyRewards(next, {
      log: [
        {
          channel: 'combat',
          text: `The ${mob.label.toLowerCase()} drives you back. You limp to a safe place and rest off the worst of it — nothing lost but time and pride.`,
        },
      ],
    });
    next = advanceClock(next, FIGHT_TICKS + SETBACK_TICKS + FORCED_REST_TICKS);
    next = {
      ...next,
      character: { ...next.character, satiety: satietyMax(next), hp: hpMax(next) },
    };
  }
  return next;
}

/** The scripted grain-store wolf (R3 gate): always survived, by luck — the humbling beat. */
export function applyScriptedWolf(state: GameState): GameState {
  const mob = getMob('wolf_scripted');
  const result = resolveFight(state.rng, mcCombatStats(state), mobCombatStats(mob));
  let next: GameState = { ...state, rng: result.rng };
  next = wearWeapon(next);
  next = setHp(next, Math.max(SETBACK_HP, result.mcHpLeft));
  next = applyRewards(next, {
    flags: ['first-fight-survived', 'mob-wolf_scripted'],
    log: [
      {
        channel: 'combat',
        text: `The wolf comes out of the dark among the rice-sacks. You swing the pole, miss, swing again — and somehow, more luck than skill, it bolts bleeding into the night. You are alive. You should not be.`,
      },
      {
        channel: 'narration',
        text: `${NAMES.drillmaster} the drillmaster finds you shaking by the stores. He says nothing for a long moment. Then: "You lived. That's the only talent that matters in the end. Come to the yard at dawn — I'll teach you the rest."`,
      },
    ],
  });
  next = advanceClock(next, FIGHT_TICKS + SETBACK_TICKS);
  return next; // R2→R3 promotion fires in reduce's finish()
}
