// Fight resolution → GameState (PRD §4.6 / D-Q-idle-combat). Auto-resolve fights
// everything; a WIN grants combat-XP (→ character level) + koku; a LOSS is a soft,
// SELF-RECOVERING setback — the MC limps to safety and rests (a time cost) and never
// loses a level / gear / Influence (LOCKED shape, §4.6.6). The scripted grain-store
// wolf is a guaranteed-survival humbling beat that opens R3.

import { withResource, type GameState } from './state';
import type { MobId } from './content/enemies';
import { getMob } from './content/enemies';
import { mcCombatStats, mobCombatStats, resolveFight, combatLevelForXp } from './combat';
import { hpMax } from './selectors';
import { applyRewards } from './rewards';
import { advanceClock } from './step';
import { NAMES } from './content/names';
import { rollMaterialDrop, getMaterial, MATERIALS } from './content/crafting';
import { applyQuestEvent } from './quest-engine';
import {
  COMBAT_XP_K,
  SETBACK_HP,
  SETBACK_TICKS,
  FORCED_REST_TICKS,
  LOSS_KOKU_FRAC,
  LOSS_MATERIAL_FRAC,
  AUTO_RETREAT_FRAC,
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

/** A grindable fight: real outcome, self-recovering loss. `retreat` selects the auto-retreat-@20%
 *  mode (batch-2 call 6) — break off at the threshold instead of fighting to the end. */
export function applyGrindFight(state: GameState, mobId: MobId, retreat = false): GameState {
  const mob = getMob(mobId);
  const retreatHp = retreat ? Math.round(AUTO_RETREAT_FRAC * hpMax(state)) : 0;
  // Arming auto-flee while ALREADY at/below the retreat threshold (e.g. HP 1 right after a loss)
  // would make resolveFight "flee" on turn 1 — a phantom flee that logs "winded, blade up, but whole"
  // for a fight that never happened and silently un-arms. Refuse honestly instead: mend first. No
  // fight, no clock, no weapon wear; the autopilot stops.
  if (retreat && state.character.hp <= retreatHp) {
    return applyRewards(
      { ...state, autoCombat: null },
      {
        log: [
          {
            channel: 'combat',
            text: 'You are too hurt to hold the line — eat and mend before you take the field.',
          },
        ],
      },
    );
  }
  const result = resolveFight(state.rng, mcCombatStats(state), mobCombatStats(mob), retreatHp);
  let next: GameState = { ...state, rng: result.rng };
  next = wearWeapon(next);
  // bestiary fills by encounter; `combat-blooded` marks that you've stood real gate-watch
  // duty (the R3→R4 story gate, M2·2) — set on ANY grind fight, win or lose.
  next = applyRewards(next, { flags: [`mob-${mob.id}`, 'combat-blooded'] });

  if (result.won) {
    const hpBefore = state.character.hp;
    next = setHp(next, result.mcHpLeft);
    // loot→craft (D-052): roll the carcass drop FIRST (seeded LOOT stream, independent of the
    // combat cursor) so it folds into the SINGLE summarised outcome line below.
    const [drop, lootRng] = rollMaterialDrop(next.rng, mob.id);
    next = { ...next, rng: lootRng };
    const gained: Record<string, number> = { koku: mob.kokuReward };
    if (drop) gained[drop.material] = drop.qty;
    const lootStr = drop ? `, +${drop.qty} ${getMaterial(drop.material).label.toLowerCase()}` : '';
    // SUMMARISED log (D-076 / batch-1 call 2): ONE outcome line per fight, carrying the HP swing
    // + loot. The blow-by-blow is suppressed — the auto-grind fires this hundreds of times.
    next = applyRewards(next, {
      resources: gained,
      log: [
        {
          channel: 'combat',
          text: `You bring down the ${mob.label.toLowerCase()}. ✓ (HP ${hpBefore}→${result.mcHpLeft} · +${mob.kokuReward} koku${lootStr})`,
        },
      ],
    });
    next = gainCombatXp(next, mob.level * COMBAT_XP_K);
    // quest advance token — 'kill:<mob>' (D-037), e.g. 'kill:monkey' / 'kill:boar'.
    next = applyQuestEvent(next, `kill:${mob.id}`);
    next = advanceClock(next, FIGHT_TICKS);
  } else if (result.fled) {
    // auto-retreat (batch-2 call 6): you broke off at the retreat threshold — NO reward, NO loss
    // penalty (you chose to back off, you were not beaten), but you are hurt and the autopilot
    // STOPS (you mend by hand and re-engage deliberately). A burst foe that kills outright never
    // reaches here (that is a loss, below).
    const hpBefore = state.character.hp;
    next = setHp(next, result.mcHpLeft);
    next = { ...next, autoCombat: null };
    next = applyRewards(next, {
      log: [
        {
          channel: 'combat',
          text: `You break off the fight with the ${mob.label.toLowerCase()} and fall back — winded, blade up, but whole. (HP ${hpBefore}→${result.mcHpLeft})`,
        },
      ],
    });
    next = advanceClock(next, FIGHT_TICKS);
  } else {
    // soft setback (D-050/§4.6.6) + D-076: limp home at the HP floor (never losing level/xp/gear),
    // the autopilot STOPS, and you drop a slice of your CARRIED koku + materials in the rout — what
    // is BANKED in the kura storehouse stays safe (batch-2 call 7). Magnitude liquid (D-059).
    const hpBefore = state.character.hp;
    next = setHp(next, SETBACK_HP);
    next = { ...next, autoCombat: null };
    const lostKoku = Math.round((next.resources.koku ?? 0) * LOSS_KOKU_FRAC);
    if (lostKoku > 0) next = withResource(next, 'koku', -lostKoku);
    let lostMats = 0;
    for (const m of MATERIALS) {
      const lose = Math.floor((next.resources[m.id] ?? 0) * LOSS_MATERIAL_FRAC);
      if (lose > 0) {
        next = withResource(next, m.id, -lose);
        lostMats += lose;
      }
    }
    const drop =
      lostKoku > 0 || lostMats > 0
        ? ` You drop ${lostKoku} koku${lostMats > 0 ? ` and ${lostMats} of your spoils` : ''} in the rout.`
        : '';
    next = applyRewards(next, {
      log: [
        {
          channel: 'combat',
          text: `The ${mob.label.toLowerCase()} overcomes you; you limp home badly used. (HP ${hpBefore}→${SETBACK_HP})${drop} Eat and mend before you take the field again.`,
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
