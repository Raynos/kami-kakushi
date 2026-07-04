// Persona bots (F4 §1) — PURE decision policies over player-visible state, OUTSIDE the core
// (a player model, not game rules). No cheating, by construction: a persona only ever issues
// `Intent`s through `reduce` (never applyGrindFight, never forced flags, never state surgery),
// and reads state only through the same public selectors the UI renders from (a review norm,
// not a lint — A11). Ph1 ships greedy; idler + explorer land in Ph3.

import type { GameState, Intent, IntentType } from '../core';
import {
  ascensionAvailable,
  availableActions,
  balance,
  canDoActivity,
  durabilityBand,
  focusedOptimalIntent,
  getActivity,
  getMob,
  getWeapon,
  hasFlag,
  hpMax,
  isUnlocked,
  nextHopToward,
  satietyMax,
} from '../core';

// The ONE runtime list of all intent types (F4 §1). When the game grows an intent, `tsc`
// (already in `verify`) goes RED here until the map is updated; each persona's skip-list
// (ALL_INTENTS − persona.knows) is then printed as a SKIPPED INTENTS table in every report —
// a loud, standing admission, never a silent gap.
export const ALL_INTENTS = {
  open_eyes: true,
  advance_intro: true,
  ask_topic: true,
  choose_intro: true,
  begin_rung_beat: true,
  advance_rung_beat: true,
  ask_rung_topic: true,
  choose_rung_option: true,
  rake_rice: true,
  rest: true,
  do_activity: true,
  set_auto: true,
  set_auto_rake: true,
  face_wolf: true,
  fight: true,
  set_auto_combat: true,
  repair_weapon: true,
  equip_weapon: true,
  set_stance: true,
  cook_meal: true,
  eat_rice: true,
  sell_rice: true,
  improve_estate: true,
  spend_attribute: true,
  craft_weapon: true,
  accept_quest: true,
  buy_item: true,
  buy_belonging: true,
  deposit: true,
  withdraw: true,
  move_to: true,
  ascend: true,
} satisfies Record<IntentType, true>;

export const ALL_INTENT_TYPES = Object.keys(ALL_INTENTS) as IntentType[];

export interface Persona {
  readonly id: 'greedy' | 'idler' | 'explorer';
  /** Intent types this policy knows how to issue (the complement prints as the skip-list). */
  readonly knows: readonly IntentType[];
  /** PURE: next intent from player-visible state, or null (nothing to do — a soft-lock). */
  decide(s: GameState): Intent | null;
}

/** The intent types a persona never issues — the loud SKIPPED INTENTS table in every report. */
export function skippedIntents(persona: Persona): IntentType[] {
  const knows = new Set(persona.knows);
  return ALL_INTENT_TYPES.filter((t) => !knows.has(t));
}

// ── greedy-grinder ────────────────────────────────────────────────────────────────────────────
// `focusedOptimalIntent` (the canonical optimal route — pacing report / playcheck / arc tests all
// share it) extended with the real combat leg it stops at today: at R3 without `combat-blooded`,
// manage readiness, walk to the monkey's node, and issue real `fight` intents through the spatial
// + `tab-combat` gates until blooded (a strictly STRONGER arc proof than t0-arc.test.ts's direct
// applyGrindFight call). Rung beats + Phase-2 deed labour are already in the shared policy;
// `ascend` fires the moment the gate opens.

/** Mend before a fight when HP is under this fraction of max — a readiness knob of the PLAYER
 *  MODEL (what a sensible grinder does), not canon: it shapes the greedy bot's pre-fight prep,
 *  never an envelope fixture. Half health ≈ "hurt enough to eat first". */
const GREEDY_MEND_HP_FRAC = 0.5;

/** The R3 blooding readiness + approach sub-policy (only active while un-blooded at R3). */
function combatLegIntent(s: GameState): Intent | null {
  // (1) mend the blade when it drops into Battered/Broken (the wear bands bite attackPower).
  const weapon = getWeapon(s.equippedWeapon);
  const band = durabilityBand(s.weaponDurability, weapon.durabilityMax);
  if (band.name === 'Battered' || band.name === 'Broken') {
    if ((s.resources.wood ?? 0) >= balance.REPAIR_WOOD_COST) return { type: 'repair_weapon' };
    const wood = getActivity('woodcut_edge');
    if (canDoActivity(s, wood)) return { type: 'do_activity', activityId: 'woodcut_edge' };
    const hop = nextHopToward(s.location, wood.area, new Set(s.unlocked));
    if (hop) return { type: 'move_to', to: hop };
    // can't reach wood — fall through and fight with what's in hand rather than stall.
  }
  // (2) mend the body when hurt and a hot meal is on hand (eating is the ONLY HP heal, D-050).
  if (
    s.character.hp < hpMax(s) * GREEDY_MEND_HP_FRAC &&
    isUnlocked(s, 'verb-cook') &&
    (s.resources.sansai ?? 0) >= balance.COOK_SANSAI_COST
  ) {
    return { type: 'cook_meal' };
  }
  // (3) top up work-stamina below the throttle knee (the same STAMINA_FLAT_ABOVE the engine uses)
  //     so the fight lands at full combat-satiety attackPower.
  if (
    s.character.satiety < satietyMax(s) * balance.STAMINA_FLAT_ABOVE &&
    availableActions(s).includes('rest')
  ) {
    return { type: 'rest' };
  }
  // (4) walk to the monkey's ground and stand the watch (one real grind fight sets the flag).
  const foe = getMob('monkey');
  if (s.location === foe.area) return { type: 'fight', mobId: 'monkey' };
  const hop = nextHopToward(s.location, foe.area, new Set(s.unlocked));
  return hop ? { type: 'move_to', to: hop } : null;
}

export const greedy: Persona = {
  id: 'greedy',
  knows: [
    'open_eyes',
    'choose_intro',
    'begin_rung_beat',
    'choose_rung_option',
    'rake_rice',
    'rest',
    'do_activity',
    'face_wolf',
    'move_to',
    'fight',
    'repair_weapon',
    'cook_meal',
    'ascend',
  ],
  decide(s) {
    if (ascensionAvailable(s)) return { type: 'ascend' };
    if (s.rung === 'R3' && !hasFlag(s, 'combat-blooded') && isUnlocked(s, 'tab-combat')) {
      const leg = combatLegIntent(s);
      if (leg) return leg;
    }
    return focusedOptimalIntent(s);
  },
};

/** The Ph1 roster (idler + explorer join in Ph3). */
export const PERSONAS: readonly Persona[] = [greedy];
