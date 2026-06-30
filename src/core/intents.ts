// The action reducer (PRD §6.3): every player verb is a typed Intent; reduce maps a
// verb → new state. Pure, deterministic, immutable-in/out. Mode-guarded — an intent
// that isn't currently legal is a no-op. The Intent union grows additively per
// milestone; M0–M1 cover the cold open + the T0 Phase-1 labour spine.

import type { GameState } from './state';
import { setFlag, hasFlag, withResource, withBanked, addSkillXp } from './state';
import { applyRewards } from './rewards';
import { revealPass } from './unlock';
import { advanceClock } from './step';
import { clamp } from './math';
import { satietyMax, hpMax, staminaRate, season, canDoActivity, estateYieldNum } from './selectors';
import { skillLevel, skillYieldNum } from './skills';
import { accrueRungMeter, promoteRungs } from './ranks';
import { applyEstateDeed } from './pillars';
import { ascend } from './ascension';
import { isUnlocked } from './unlock';
import { applyGrindFight, applyScriptedWolf } from './fight';
import {
  RICE_PER_RAKE,
  SATIETY_PER_ACT,
  SATIETY_PER_REST,
  TICKS_PER_ACT,
  HARVEST_AUTUMN_MULT_NUM,
  HARVEST_AUTUMN_MULT_DEN,
  REPAIR_WOOD_COST,
  SKILL_YIELD_DEN,
  COOK_SANSAI_COST,
  COOK_SATIETY_RESTORE,
  COOK_HP_RESTORE,
} from './content/balance';
import { ESTATE_STAGES } from './content/estate';
import { COLD_OPEN, rakeLine } from './content/coldOpen';
import { nextDialogueLines, COLD_OPEN_DIALOGUE_ID } from './content/dialogue';
import { getRecipe, canCraft } from './content/crafting';
import { acceptQuest, applyQuestEvent } from './quest-engine';
import { getItem, canBuy } from './content/market';
import { canMove, getNode } from './content/map';
import { CONDITIONING_GATE_LEVEL } from './content/balance';
import {
  getActivity,
  activityLine,
  type ActivityId,
  type LabourResource,
} from './content/activities';
import { getWeapon, type WeaponId } from './content/weapons';
import type { MobId } from './content/enemies';
import type { StanceId } from './content/balance';

export type Intent =
  | { type: 'open_eyes' }
  | { type: 'rake_rice' }
  | { type: 'rest' }
  | { type: 'do_activity'; activityId: ActivityId }
  | { type: 'set_auto'; activityId: ActivityId | null }
  | { type: 'face_wolf' }
  | { type: 'fight'; mobId: MobId }
  | { type: 'set_auto_combat'; mobId: MobId | null }
  | { type: 'repair_weapon' }
  | { type: 'equip_weapon'; weaponId: WeaponId }
  | { type: 'set_stance'; stance: StanceId }
  | { type: 'cook_meal' }
  | { type: 'improve_estate' }
  | { type: 'spend_attribute'; attr: 'might' | 'guard' | 'vigor' }
  | { type: 'craft_weapon'; recipeId: string }
  | { type: 'accept_quest'; questId: string }
  | { type: 'buy_item'; itemId: string }
  | { type: 'deposit'; resource: string }
  | { type: 'withdraw'; resource: string }
  | { type: 'move_to'; to: string }
  | { type: 'ascend' };

export type IntentType = Intent['type'];

/** The currently-legal no-arg meta verbs (the cold-open / rest loop). */
export function availableActions(state: GameState): ('open_eyes' | 'rake_rice' | 'rest')[] {
  if (!hasFlag(state, 'awake')) return ['open_eyes'];
  const acts: ('rake_rice' | 'rest')[] = [];
  if (!hasFlag(state, 'rank-r1')) acts.push('rake_rice'); // day-labour, before being kept on
  if (hasFlag(state, 'raked')) acts.push('rest');
  return acts;
}

function metaLegal(state: GameState, type: 'open_eyes' | 'rake_rice' | 'rest'): boolean {
  return availableActions(state).includes(type);
}

function adjustSatiety(state: GameState, delta: number): GameState {
  const satiety = clamp(state.character.satiety + delta, 0, satietyMax(state));
  return { ...state, character: { ...state.character, satiety } };
}

function finish(state: GameState): GameState {
  return revealPass(promoteRungs(state));
}

/** Deliver any not-yet-shown, gate-satisfied lines of a dialogue into the story log (the
 *  diegetic mentor, D-039/D-063 — the log IS the surface, never a popup). Advances the cursor. */
function deliverDialogue(state: GameState, dialogueId: string): GameState {
  const fresh = nextDialogueLines(dialogueId, new Set(state.deliveredDialogue), state.flags);
  if (fresh.length === 0) return state;
  const next: GameState = {
    ...state,
    deliveredDialogue: [...state.deliveredDialogue, ...fresh.map((l) => l.id)],
  };
  return applyRewards(next, {
    log: fresh.map((l) => ({ channel: 'narration' as const, text: l.text })),
  });
}

export function reduce(state: GameState, intent: Intent): GameState {
  let next = state;
  switch (intent.type) {
    case 'open_eyes': {
      if (!metaLegal(state, 'open_eyes')) return state;
      next = setFlag(next, 'awake', true);
      next = applyRewards(next, {
        flags: ['dream-1'],
        log: [
          { channel: 'narration', text: COLD_OPEN.wake },
          { channel: 'narration', text: COLD_OPEN.grounding },
          { channel: 'narration', text: COLD_OPEN.dream },
        ],
      });
      // the labour mentor Genemon greets you and teaches the rake→koku loop as STORY (T0-M1-F3).
      next = deliverDialogue(next, COLD_OPEN_DIALOGUE_ID);
      break;
    }
    case 'rake_rice': {
      if (!metaLegal(state, 'rake_rice')) return state;
      next = withResource(next, 'koku', RICE_PER_RAKE);
      next = adjustSatiety(next, -SATIETY_PER_ACT);
      next = applyRewards(next, {
        flags: ['raked'],
        log: [{ channel: 'reward', text: rakeLine(RICE_PER_RAKE) }],
      });
      // reveal-as-plot: once you've actually raked, Genemon's gated acknowledgment lands.
      next = deliverDialogue(next, COLD_OPEN_DIALOGUE_ID);
      next = accrueRungMeter(next, 'rake_rice');
      next = advanceClock(next, TICKS_PER_ACT);
      break;
    }
    case 'rest': {
      if (!metaLegal(state, 'rest')) return state;
      next = adjustSatiety(next, SATIETY_PER_REST);
      next = applyRewards(next, { log: [{ channel: 'system', text: COLD_OPEN.restAct }] });
      next = advanceClock(next, TICKS_PER_ACT);
      break;
    }
    case 'do_activity': {
      const act = getActivity(intent.activityId);
      if (!canDoActivity(next, act)) return state;
      const rate = staminaRate(next);
      const autumn = act.seasonHarvest === true && season(next) === 'autumn';
      // The skill→yield multiplier (audit #4). Skill level is read BEFORE this act's
      // addSkillXp on purpose: the leveling act uses the pre-level mult; the bump shows
      // on the NEXT act. skillYieldNum(1) === DEN → L1 yields are byte-identical to v0.1.
      const yNum = skillYieldNum(skillLevel(next, act.skill));
      // the estate flywheel (T0-M4-F2): a higher estate stage lifts every labour act's output,
      // so koku→upgrade→more output compounds. Identity (===DEN) at E0 — byte-identical pre-buy.
      const eNum = estateYieldNum(next);
      const gained: Partial<Record<LabourResource, number>> = {};
      for (const [res, amt] of Object.entries(act.yields) as [LabourResource, number][]) {
        let v = amt * rate;
        if (autumn) v = (v * HARVEST_AUTUMN_MULT_NUM) / HARVEST_AUTUMN_MULT_DEN;
        v = (v * yNum) / SKILL_YIELD_DEN;
        v = (v * eNum) / SKILL_YIELD_DEN;
        gained[res] = Math.max(1, Math.round(v));
      }
      const xpGain = Math.max(1, Math.round(act.xp * rate));
      next = addSkillXp(next, act.skill, xpGain);
      next = adjustSatiety(next, -act.satietyCost);
      const storyFlags: string[] = [];
      if (act.id === 'farm_paddy') storyFlags.push('farmed');
      next = applyRewards(next, {
        resources: gained as Record<string, number>,
        flags: storyFlags,
        log: [{ channel: 'reward', text: activityLine(act, gained) }],
      });
      next = accrueRungMeter(next, act.id);
      // Phase 2 (post-R7): estate labour also banks an Estate-pillar deed (no-op in Phase 1).
      next = applyEstateDeed(next);
      // quest advance tokens — 'gather:<resource>' for each thing the act yielded (D-037).
      for (const res of Object.keys(gained)) next = applyQuestEvent(next, `gather:${res}`);
      next = advanceClock(next, TICKS_PER_ACT);
      break;
    }
    case 'set_auto': {
      next = { ...next, autoActivity: intent.activityId };
      break;
    }
    case 'face_wolf': {
      if (!isUnlocked(next, 'verb-face-wolf') || hasFlag(next, 'first-fight-survived'))
        return state;
      next = applyScriptedWolf(next);
      break;
    }
    case 'fight': {
      if (!isUnlocked(next, 'tab-combat')) return state;
      next = applyGrindFight(next, intent.mobId);
      break;
    }
    case 'set_auto_combat': {
      next = { ...next, autoCombat: intent.mobId };
      break;
    }
    case 'set_stance': {
      if (!isUnlocked(next, 'tab-combat')) return state;
      next = { ...next, stance: intent.stance };
      break;
    }
    case 'repair_weapon': {
      if ((next.resources.wood ?? 0) < REPAIR_WOOD_COST) return state;
      const weapon = getWeapon(next.equippedWeapon);
      next = withResource(next, 'wood', -REPAIR_WOOD_COST);
      next = { ...next, weaponDurability: weapon.durabilityMax };
      next = applyRewards(next, {
        log: [
          {
            channel: 'system',
            text: `You repair the ${weapon.label.toLowerCase()}. (−${REPAIR_WOOD_COST} wood)`,
          },
        ],
      });
      break;
    }
    case 'equip_weapon': {
      // the wood_axe is now FOUND/CRAFTED (D-052) — gate equipping it on having forged it,
      // not on the retired drillmaster grant.
      if (intent.weaponId === 'wood_axe' && !hasFlag(next, 'crafted-wood_axe')) return state;
      const weapon = getWeapon(intent.weaponId);
      next = { ...next, equippedWeapon: intent.weaponId, weaponDurability: weapon.durabilityMax };
      next = applyRewards(next, {
        log: [{ channel: 'system', text: `You take up the ${weapon.label.toLowerCase()}.` }],
      });
      break;
    }
    case 'cook_meal': {
      // sansai → satiety AND HP (audit #5 + D-050). A 2-tick act that costs greens for a
      // refuel; eating is the ONLY thing that mends wounds, so it couples food ↔ combat.
      if (!isUnlocked(next, 'verb-cook')) return state;
      if ((next.resources.sansai ?? 0) < COOK_SANSAI_COST) return state;
      next = withResource(next, 'sansai', -COOK_SANSAI_COST);
      next = adjustSatiety(next, COOK_SATIETY_RESTORE);
      const hpBefore = next.character.hp;
      const hpAfter = Math.min(hpMax(next), hpBefore + COOK_HP_RESTORE);
      if (hpAfter !== hpBefore) next = { ...next, character: { ...next.character, hp: hpAfter } };
      const hpGain = hpAfter - hpBefore;
      next = applyRewards(next, {
        log: [
          {
            channel: 'system',
            text: `You boil the wild greens into a plain, hot meal. (−${COOK_SANSAI_COST} sansai, +${COOK_SATIETY_RESTORE} body${hpGain > 0 ? `, +${hpGain} HP` : ''})`,
          },
        ],
      });
      next = advanceClock(next, TICKS_PER_ACT);
      break;
    }
    case 'improve_estate': {
      // koku → estateStage (audit #5). A commissioning (no clock cost, like equipping).
      if (!isUnlocked(next, 'panel-estate')) return state;
      const target = ESTATE_STAGES.find((s) => s.stage === next.estateStage + 1);
      if (!target) return state;
      if ((next.resources.koku ?? 0) < target.kokuCost) return state;
      next = withResource(next, 'koku', -target.kokuCost);
      next = { ...next, estateStage: target.stage };
      next = applyRewards(next, { log: [{ channel: 'milestone', text: target.logLine }] });
      break;
    }
    case 'spend_attribute': {
      // attributePoints → a real combat stat (audit #5). No clock cost.
      const c = next.character;
      if (c.attributePoints <= 0) return state;
      const a = intent.attr;
      const upd =
        a === 'might'
          ? { ...c, might: c.might + 1 }
          : a === 'guard'
            ? { ...c, guard: c.guard + 1 }
            : { ...c, vigor: c.vigor + 1 };
      next = { ...next, character: { ...upd, attributePoints: c.attributePoints - 1 } };
      const line =
        a === 'might'
          ? 'You drill the cut until your shoulders burn. (Might +1)'
          : a === 'guard'
            ? 'You learn to turn the blow aside. (Guard +1)'
            : 'You harden to the work; your wind comes easier. (Vigor +1)';
      next = applyRewards(next, { log: [{ channel: 'system', text: line }] });
      break;
    }
    case 'craft_weapon': {
      // loot→craft (D-052): the FOUND/CRAFTED 2nd weapon, replacing the retired grant. Consume
      // the gathered materials, forge + take up the weapon. Gated on combat being live + the
      // materials being on hand (discover-by-doing: the panel surfaces once you've looted).
      if (!isUnlocked(next, 'tab-combat')) return state;
      const recipe = getRecipe(intent.recipeId);
      if (!canCraft(next.resources, recipe)) return state;
      for (const [mat, qty] of Object.entries(recipe.inputs)) next = withResource(next, mat, -qty);
      const crafted = getWeapon(recipe.outputWeapon);
      next = {
        ...next,
        equippedWeapon: recipe.outputWeapon,
        weaponDurability: crafted.durabilityMax,
      };
      next = applyRewards(next, {
        flags: [`crafted-${recipe.outputWeapon}`],
        log: [{ channel: 'milestone', text: recipe.blurb }],
      });
      break;
    }
    case 'accept_quest': {
      next = acceptQuest(next, intent.questId);
      break;
    }
    case 'buy_item': {
      // the tiny CAPPED market (TRADE taste, T0-M4-F3/D-008) — a commissioning, no clock cost.
      // Opens with the estate economy (panel-estate). The per-run stockCap is the minority clamp.
      if (!isUnlocked(next, 'panel-estate')) return state;
      const item = getItem(intent.itemId);
      const bought = next.marketBought[item.id] ?? 0;
      if (!canBuy(next.resources, item, bought)) return state;
      next = withResource(next, 'koku', -item.kokuCost);
      for (const [res, amt] of Object.entries(item.grants)) next = withResource(next, res, amt);
      next = { ...next, marketBought: { ...next.marketBought, [item.id]: bought + 1 } };
      next = applyRewards(next, {
        log: [
          {
            channel: 'system',
            text: `You barter ${item.kokuCost} koku for a ${item.label.toLowerCase()}.`,
          },
        ],
      });
      break;
    }
    case 'deposit': {
      // store CARRIED wealth in the kura storehouse — sheltered from a lost-fight penalty
      // (batch-2 call 7). Spending + earning still use carried; banked is a safe reserve. (Spatially
      // gated to the kura node in Step 5; for now it opens with the estate economy.) No clock cost.
      if (!isUnlocked(next, 'panel-estate')) return state;
      const have = next.resources[intent.resource] ?? 0;
      if (have <= 0) return state;
      next = withResource(next, intent.resource, -have);
      next = withBanked(next, intent.resource, have);
      next = applyRewards(next, {
        log: [
          {
            channel: 'system',
            text: `You store ${have} ${intent.resource} safe in the kura storehouse.`,
          },
        ],
      });
      break;
    }
    case 'withdraw': {
      if (!isUnlocked(next, 'panel-estate')) return state;
      const have = next.banked[intent.resource] ?? 0;
      if (have <= 0) return state;
      next = withBanked(next, intent.resource, -have);
      next = withResource(next, intent.resource, have);
      next = applyRewards(next, {
        log: [
          {
            channel: 'system',
            text: `You draw ${have} ${intent.resource} back out of the kura storehouse.`,
          },
        ],
      });
      break;
    }
    case 'move_to': {
      // walk the small estate map (T0-M4-F4 / D-065): adjacent + revealed (nodes reuse the
      // existing room-unlock surfaces), and the danger ring needs the conditioning gate.
      if (!canMove(next.location, intent.to, new Set(next.unlocked))) return state;
      const dest = getNode(intent.to);
      if (dest.dangerRing && skillLevel(next, 'conditioning') < CONDITIONING_GATE_LEVEL)
        return state;
      next = { ...next, location: intent.to };
      next = applyRewards(next, { log: [{ channel: 'narration', text: dest.blurb }] });
      break;
    }
    case 'ascend': {
      // the manual opt-in T0→T1 ascension (gate-checked inside `ascend` — a no-op if not ready).
      next = ascend(next);
      break;
    }
  }
  return finish(next);
}
