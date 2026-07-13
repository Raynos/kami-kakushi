// Fight resolution → GameState (PRD §4.6 / D-Q-idle-combat). Auto-resolve fights
// everything; a WIN grants combat-XP (→ character level) + coin; a LOSS is a soft,
// SELF-RECOVERING setback — the MC limps to safety and rests (a time cost) and never
// loses a level / gear / Influence (LOCKED shape, §4.6.6). The scripted grain-store
// wolf is a guaranteed-survival humbling beat that opens R3.

import { hasFlag, type GameState } from './state';
import type { MobId } from './content/enemies';
import { getMob } from './content/enemies';
import { mcCombatStats, mobCombatStats, resolveFight, combatLevelForXp } from './combat';
import { hpMax } from './selectors';
import { applyRewards } from './rewards';
import { advanceClock } from './step';
import { rollMaterialDrop, getMaterial } from './content/crafting';
import { applyProgressEvent } from './progress-events';
import { bankEstateDeed } from './pillars';
import { applyCarriedLossBleed, applyDefeatConsequences } from './defeat';
import {
  COMBAT_XP_K,
  SETBACK_HP,
  SETBACK_TICKS,
  FORCED_REST_TICKS,
  AUTO_RETREAT_FRAC,
  DURABILITY_WEAR_PER_FIGHT,
  FIGHT_TICKS,
  ATTR_POINTS_PER_LEVELS,
} from './content/balance';

function setHp(state: GameState, hp: number): GameState {
  return { ...state, character: { ...state.character, hp } };
}

function wearWeapon(state: GameState): GameState {
  // A2: wear is no longer stance-dependent — a flat cost per fight (§4.6.10).
  return {
    ...state,
    weaponDurability: Math.max(0, state.weaponDurability - DURABILITY_WEAR_PER_FIGHT),
  };
}

/** Attribute points earned by reaching character level `l` — +1 every ATTR_POINTS_PER_LEVELS
 *  levels (§4.4). Total (not per-level) so a multi-level jump grants the correct delta. */
function attrPointsAt(level: number): number {
  return Math.floor(level / ATTR_POINTS_PER_LEVELS);
}

function gainCombatXp(state: GameState, amount: number): GameState {
  const combatXp = state.character.combatXp + amount;
  let next: GameState = { ...state, character: { ...state.character, combatXp } };
  const newLevel = combatLevelForXp(combatXp);
  if (newLevel > state.character.level) {
    const pointsGained = attrPointsAt(newLevel) - attrPointsAt(state.character.level);
    next = {
      ...next,
      character: {
        ...next.character,
        level: newLevel,
        attributePoints: next.character.attributePoints + pointsGained,
      },
    };
    // ADR-050: a level-up no longer free-heals — HP carries, and eating is the only mend.
    next = applyRewards(next, {
      log: [{ channel: 'milestone', contentKey: 'combat.levelUp', params: { level: newLevel } }],
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
        log: [{ channel: 'combat', contentKey: 'combat.tooHurt' }],
      },
    );
  }
  // INT bestiary bonus applies only if the foe was ALREADY encountered BEFORE this fight (the
  // `mob-<id>` flag is set below, so read it now against the incoming state).
  const foeKnown = hasFlag(state, `mob-${mob.id}`);
  const result = resolveFight(
    state.rng,
    mcCombatStats(state, foeKnown),
    mobCombatStats(mob),
    retreatHp,
  );
  let next: GameState = { ...state, rng: result.rng };
  next = wearWeapon(next);
  // bestiary fills by encounter; `combat-blooded` marks that you've stood real gate-watch
  // duty (the R3→R4 story gate, M2·2) — set on ANY grind fight, win or lose.
  next = applyRewards(next, { flags: [`mob-${mob.id}`, 'combat-blooded'] });

  if (result.won) {
    const hpBefore = state.character.hp;
    next = setHp(next, result.mcHpLeft);
    // loot→craft (ADR-052): roll the carcass drop FIRST (seeded LOOT stream, independent of the
    // combat cursor) so it folds into the SINGLE summarised outcome line below.
    const [drop, lootRng] = rollMaterialDrop(next.rng, mob.id);
    next = { ...next, rng: lootRng };
    const gained: Record<string, number> = { coin: 0 }; // G4: combat drops materials, never coin (KIND lane, bible)
    if (drop) gained[drop.material] = drop.qty;
    // SUMMARISED log (ADR-076 / batch-1 call 2): ONE outcome line per fight, carrying the HP swing
    // + loot. The blow-by-blow is suppressed — the auto-grind fires this hundreds of times. The
    // loot-tally + coin wording live in the log-content registry (Stage C); pass raw pieces.
    next = applyRewards(next, {
      resources: gained,
      log: [
        {
          channel: 'combat',
          contentKey: 'combat.win',
          params: {
            mob: mob.label.toLowerCase(),
            hpBefore,
            hpAfter: result.mcHpLeft,
            coin: 0, // G4: no coin from beasts
            lootQty: drop ? drop.qty : 0,
            lootLabel: drop ? getMaterial(drop.material).label.toLowerCase() : '',
          },
        },
      ],
    });
    next = gainCombatXp(next, mob.level * COMBAT_XP_K);
    // quest advance token — 'kill:<mob>' (ADR-037), e.g. 'kill:monkey' / 'kill:boar'.
    next = applyProgressEvent(next, `kill:${mob.id}`);
    // ADR-145 — standing the watch: a WON fight banks a WATCH Estate deed in Phase 2 (the house
    // is safer; Arms stays T1-gated, so at T0 this feeds Estate standing, not a new pillar).
    next = bankEstateDeed(next, 'watch');
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
          contentKey: 'combat.flee',
          params: { mob: mob.label.toLowerCase(), hpBefore, hpAfter: result.mcHpLeft },
        },
      ],
    });
    next = advanceClock(next, FIGHT_TICKS);
  } else {
    // soft setback (ADR-050/§4.6.6) + ADR-076 + ADR-113: limp home at the HP floor (never losing
    // level/xp/gear), the autopilot STOPS, and you drop a slice of ALL THREE carried resources —
    // COIN + RICE + materials — in the rout. What is BANKED in the kura storehouse stays safe
    // (batch-2 call 7). koku (House standing) is never carried, so a loss never touches it (ADR-107).
    // Magnitude liquid (ADR-059).
    const hpBefore = state.character.hp;
    next = setHp(next, SETBACK_HP);
    next = { ...next, autoCombat: null };
    // G3 (ADR-164): the carried-loss bleed is KEPT (a defeat must sting in the moment). The
    // bleed's ONE home is defeat.ts (shared with the night-round fall — B2 closure); rice is
    // kura-only (ADR-163) and cannot bleed by construction.
    const bled = applyCarriedLossBleed(next);
    next = bled.next;
    // The rout-loss wording (which carried resources you drop, and the grammar that joins
    // them) lives in the log-content registry (Stage C); pass the raw amounts.
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
      ],
    });
    next = advanceClock(next, FIGHT_TICKS + SETBACK_TICKS + FORCED_REST_TICKS);
    // G3 (ADR-155/ADR-164): the defeat ALSO routes to the sickroom — Sōan's ledger grows and
    // SICKROOM_DAYS_LOST whole days are lost, ON TOP of the carried-loss bleed above (the
    // double-cost curve). This never mends HP: food stays satiety-only and HP has no auto-trickle;
    // mending is the deliberate `treat` / `rest_sickroom` spend at the node you wake in
    // (ADR-164/ADR-197, intents.ts).
    next = applyDefeatConsequences(next);
  }
  return next;
}

// G4.3 — `applyScriptedWolf` (the scripted grain-store wolf, old R3 gate) is DELETED. The wolf
// now lives only in the R3 night round (G2's engine, content/nightRounds.ts). The
// `combat.wolfScripted` / `combat.drillmaster` log keys retire with it.
