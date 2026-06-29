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
import { NAMES } from './content/names';
import { rollMaterialDrop, getMaterial } from './content/crafting';
import { applyQuestEvent } from './quest-engine';
import {
  COMBAT_XP_K,
  SETBACK_HP,
  SETBACK_TICKS,
  FORCED_REST_TICKS,
  DURABILITY_WEAR_PER_FIGHT,
  FIGHT_TICKS,
  STANCE_MODS,
} from './content/balance';

function setHp(state: GameState, hp: number): GameState {
  return { ...state, character: { ...state.character, hp } };
}

function wearWeapon(state: GameState): GameState {
  // Stance is the Aggressive cost axis: jodan 3 / chudan 2 / gedan 1 wear per fight.
  const wear = Math.max(
    1,
    Math.round(DURABILITY_WEAR_PER_FIGHT * STANCE_MODS[state.stance].wearMult),
  );
  return {
    ...state,
    weaponDurability: Math.max(0, state.weaponDurability - wear),
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
    // D-050: a level-up no longer free-heals — HP carries, and eating is the only mend.
    next = applyRewards(next, {
      log: [
        {
          channel: 'milestone',
          text: `Your body has hardened with the fighting. Combat level ${newLevel}.`,
        },
      ],
    });
  }
  return next;
}

/** A grindable fight: real outcome, self-recovering loss. */
export function applyGrindFight(state: GameState, mobId: MobId): GameState {
  const mob = getMob(mobId);
  const result = resolveFight(state.rng, mcCombatStats(state), mobCombatStats(mob));
  let next: GameState = { ...state, rng: result.rng };
  next = wearWeapon(next);
  // bestiary fills by encounter; `combat-blooded` marks that you've stood real gate-watch
  // duty (the R3→R4 story gate, M2·2) — set on ANY grind fight, win or lose.
  next = applyRewards(next, { flags: [`mob-${mob.id}`, 'combat-blooded'] });

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
    // loot→craft (D-052): strip crafting materials off the carcass through the seeded LOOT
    // stream (independent of the combat cursor). The 2nd weapon is now FOUND + CRAFTED, never gifted.
    const [drop, lootRng] = rollMaterialDrop(next.rng, mob.id);
    next = { ...next, rng: lootRng };
    if (drop) {
      next = applyRewards(next, {
        resources: { [drop.material]: drop.qty },
        log: [
          {
            channel: 'combat',
            text: `You strip ${drop.qty} ${getMaterial(drop.material).label.toLowerCase()} from the ${mob.label.toLowerCase()}.`,
          },
        ],
      });
    }
    // quest advance token — 'kill:<mob>' (D-037), e.g. 'kill:monkey' / 'kill:boar'.
    next = applyQuestEvent(next, `kill:${mob.id}`);
    next = advanceClock(next, FIGHT_TICKS);
  } else {
    // soft setback (D-050/§4.6.6): you limp away at the HP floor — never losing a
    // level/xp/gear — but you stay HURT. Recovery is a hot meal, not a free heal.
    next = setHp(next, SETBACK_HP);
    next = applyRewards(next, {
      log: [
        {
          channel: 'combat',
          text: `The ${mob.label.toLowerCase()} drives you back. You limp to safety, badly used — nothing lost but time, pride, and the strength in your limbs. Eat and mend before you take the field again.`,
        },
      ],
    });
    next = advanceClock(next, FIGHT_TICKS + SETBACK_TICKS + FORCED_REST_TICKS);
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
