// Persona bots (FB-4 §1) — PURE decision policies over player-visible state, OUTSIDE the core
// (a player model, not game rules). No cheating, by construction: a persona only ever issues
// `Intent`s through `reduce` (never applyGrindFight, never forced flags, never state surgery),
// and reads state only through the same public selectors the UI renders from (a review norm,
// not a lint — AC-11).
//
// Contract note (a self-picked deviation from the plan's `decide(s)`): `decide(s, issued)` also
// receives the run's issued (type:payload) key set, maintained by the runner. The explorer's
// novelty preference NEEDS the history, GameState deliberately doesn't store it, and a stateful
// persona object would break the pure-reproducible contract — a runner-maintained digest keeps
// decide a deterministic function of (state, history) with zero new randomness. Greedy and the
// idler ignore it.

import type { GameState, Intent, IntentType, ActivityId } from '../core';
import {
  ACTIVITIES,
  ATTR_IDS,
  BELONGING_IDS,
  MAP_NODES,
  MARKET_ITEMS,
  MOBS,
  QUESTS,
  RECIPES,
  STANCE_ORDER,
  WEAPONS,
  ascensionAvailable,
  availableActions,
  balance,
  canDoActivity,
  canMove,
  durabilityBand,
  focusedOptimalIntent,
  autoModeIntent,
  getActivity,
  getMob,
  getWeapon,
  canRestSickroom,
  canTreat,
  hasFlag,
  hpMax,
  SICKROOM_NODE,
  introActive,
  introSceneAt,
  isUnlocked,
  nextHopToward,
  pendingPromotionTarget,
  promotionReady,
  reduce,
  sceneById,
  RUNG_BEATS,
  rungNumber,
  satietyMax,
  remainingRequirements,
  GRINDABLE_MOBS,
  visibleSet,
} from '../core';

// The ONE runtime list of all intent types (FB-4 §1). When the game grows an intent, `tsc`
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
  begin_scene: true,
  ask_scene_topic: true,
  advance_scene_beat: true,
  choose_scene_option: true,
  begin_night_round: true,
  rake_rice: true,
  rest: true,
  do_activity: true,
  set_auto: true,
  set_auto_rake: true,
  fight: true,
  set_auto_combat: true,
  repair_weapon: true,
  equip_weapon: true,
  set_stance: true,
  cook_meal: true,
  treat: true, // ADR-164/ADR-197 — the paid sickroom mend (mon-only)
  rest_sickroom: true, // ADR-164 — the free pallet-day trickle
  eat_rice: true,
  sell_rice: true,
  collect_wage: true,
  improve_estate: true,
  spend_attribute: true,
  craft_weapon: true,
  accept_quest: true,
  buy_item: true,
  buy_belonging: true,
  deposit: true,
  withdraw: true,
  move_to: true,
  work_project: true,
  ascend: true,
  advance_season: true,
  // FB-415 — `ask` is census-complete here but, like `sleep`, no persona `knows` it: an ask
  // is free info (D7 — no clock, no resources), so it can't move the pacing bands the sim
  // measures. It prints in every persona's skip-list, deliberately. (`talk_to` retired with
  // the step-4 re-homing — the u9 lines answer through asks now.)
  ask: true,
  // ADR-187 — `sleep` is in the REGISTRY (this map is the total intent census, not a policy),
  // but NO persona `knows` it: the balance sim is SKIP-BLIND by standing ruling, so the pacing
  // bands go on measuring REAL play and a convenience the sim doesn't model can never drag a
  // rung under the signed 3-minute floor. It prints in every persona's skip-list, deliberately.
  sleep: true,
} satisfies Record<IntentType, true>;

export const ALL_INTENT_TYPES = Object.keys(ALL_INTENTS) as IntentType[];

export interface Persona {
  readonly id: 'greedy' | 'idler' | 'explorer';
  /** What this persona's run PROMISES (ADR-170 / HD-34): 'ascend' — the arc closes tier 0 → 1
   *  (the default when omitted); 'ladder' — the full rung ladder is climbed, but ascension is
   *  NOT promised (Phase 2 is attention-priced by design, and idle play doesn't buy it), so the
   *  run ends cleanly on reaching the final rung instead of burning to the runaway guard. */
  readonly promise?: 'ascend' | 'ladder';
  /** Intent types this policy knows how to issue (the complement prints as the skip-list). */
  readonly knows: readonly IntentType[];
  /** PURE + deterministic: next intent from player-visible state (+ the run's issued-intent
   *  digest — see the contract note above), or null (nothing to do — a soft-lock). */
  decide(s: GameState, issued: ReadonlySet<string>): Intent | null;
}

/** The (type, payload-id) novelty key the runner records per dispatched intent. */
export function intentKey(intent: Intent): string {
  switch (intent.type) {
    case 'do_activity':
      return `do_activity:${intent.activityId}`;
    case 'move_to':
      return `move_to:${intent.to}`;
    case 'fight':
      return `fight:${intent.mobId}`;
    case 'ask_topic':
      return `ask_topic:${intent.topicId}`;
    case 'ask_rung_topic':
      return `ask_rung_topic:${intent.topicId}`;
    case 'ask_scene_topic':
      return `ask_scene_topic:${intent.topicId}`;
    case 'choose_intro':
      return `choose_intro:${intent.optionId}`;
    case 'choose_rung_option':
      return `choose_rung_option:${intent.optionId}`;
    case 'accept_quest':
      return `accept_quest:${intent.questId}`;
    case 'buy_item':
      return `buy_item:${intent.itemId}`;
    case 'buy_belonging':
      return `buy_belonging:${intent.belongingId}`;
    case 'craft_weapon':
      return `craft_weapon:${intent.recipeId}`;
    case 'equip_weapon':
      return `equip_weapon:${intent.weaponId}`;
    case 'set_stance':
      return `set_stance:${intent.stance}`;
    case 'spend_attribute':
      return `spend_attribute:${intent.attr}`;
    case 'deposit':
      return `deposit:${intent.resource}`;
    case 'withdraw':
      return `withdraw:${intent.resource}`;
    default:
      return intent.type;
  }
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

/** The sickroom mend leg (ADR-164/ADR-197 — the ONLY HP mend): walk to Sōan's pallet; pay the
 *  treatment when the coin allows (the fast chunk), else give the day to the free trickle.
 *  Null when already full or the sickroom is unreachable (pre-reveal) — fight on hurt. */
function sickroomMendLeg(s: GameState): Intent | null {
  if (s.character.hp >= hpMax(s)) return null;
  if (s.location === SICKROOM_NODE) {
    if (canTreat(s)) return { type: 'treat' };
    if (canRestSickroom(s)) return { type: 'rest_sickroom' };
    return null;
  }
  const hop = nextHopToward(s.location, SICKROOM_NODE, visibleSet(s));
  return hop ? { type: 'move_to', to: hop } : null;
}

/** The R3 blooding readiness + approach sub-policy (only active while un-blooded at R3). */
function combatLegIntent(s: GameState): Intent | null {
  // (1) mend the blade when it drops into Battered/Broken (the wear bands bite attackPower).
  const weapon = getWeapon(s.equippedWeapon);
  const band = durabilityBand(s.weaponDurability, weapon.durabilityMax);
  if (band.name === 'Battered' || band.name === 'Broken') {
    if ((s.resources.wood ?? 0) >= balance.REPAIR_WOOD_COST)
      return { type: 'repair_weapon' };
    const wood = getActivity('woodcut_edge');
    if (canDoActivity(s, wood))
      return { type: 'do_activity', activityId: 'woodcut_edge' };
    const hop = nextHopToward(s.location, wood.area, visibleSet(s));
    if (hop) return { type: 'move_to', to: hop };
    // can't reach wood — fall through and fight with what's in hand rather than stall.
  }
  // (2) mend the body when hurt (the sickroom lane — ADR-164/ADR-197: treat when the coin
  //     allows, else the pallet day; food no longer heals).
  if (s.character.hp < hpMax(s) * GREEDY_MEND_HP_FRAC) {
    const mend = sickroomMendLeg(s);
    if (mend) return mend;
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
  const hop = nextHopToward(s.location, foe.area, visibleSet(s));
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
    'move_to',
    'fight',
    'repair_weapon',
    'cook_meal',
    'treat', // ADR-164/ADR-197 — the paid sickroom mend
    'rest_sickroom', // ADR-164 — the free pallet-day trickle
    'ascend',
  ],
  decide(s) {
    if (ascensionAvailable(s)) return { type: 'ascend' };
    if (
      s.rung === 'R3' &&
      !hasFlag(s, 'combat-blooded') &&
      isUnlocked(s, 'tab-combat')
    ) {
      const leg = combatLegIntent(s);
      if (leg) return leg;
    }
    return focusedOptimalIntent(s);
  },
};

// ── idler ─────────────────────────────────────────────────────────────────────────────────────
// Minimal input, the auto-modes do the work (FB-4 §1). Everything between check-ins is LITERALLY
// the shipped auto-loop (`autoModeIntent` — the same pure function the app loop dispatches from,
// extracted in this phase), so the idler measures what "leave it running" actually paces like.
// Check-ins fire only when the auto-mode has nothing to do or a promotion/intro/beat affordance
// is showing: answer the beat, set the next auto-labour, arm auto-combat for the blooding.

export const idler: Persona = {
  id: 'idler',
  // ADR-170 (HD-34, human 2026-07-10): "an idler ascends T0" is NOT a design promise — Phase 2
  // is deliberately attention-priced, so idle play climbs the full ladder and stops there.
  promise: 'ladder',
  knows: [
    'open_eyes',
    'choose_intro',
    'begin_rung_beat',
    'choose_rung_option',
    'rest',
    'rake_rice',
    'do_activity',
    'fight',
    'repair_weapon',
    'treat', // ADR-164/ADR-197 — the paid sickroom mend
    'rest_sickroom', // ADR-164 — the free pallet-day trickle
    'move_to',
    'set_auto_rake',
    'set_auto',
    'set_auto_combat',
    'advance_season',
    'begin_night_round',
    'begin_scene',
    'advance_scene_beat',
    'choose_scene_option',
    'ascend',
  ],
  decide(s) {
    // C5b — the manual six-season wheel (ADR-153) made advance_season a SURVIVAL verb:
    // a labour site's (site, season) pool runs dry and every act yields nothing until the
    // wheel turns. Even an idler ends the season when the labour under their auto-loop is
    // farming a dead pool (engine-refused pre-R2, so guard the rung like the vitals gate).
    const poolDry = (id: ActivityId): boolean =>
      (s.sitePools[getActivity(id).area] ?? 0) <= 0;
    const canTurnWheel = rungNumber(s.rung) >= 2;
    if (ascensionAvailable(s)) return { type: 'ascend' };
    const acts = availableActions(s);
    if (acts.includes('open_eyes')) return { type: 'open_eyes' };
    // (a0) drain any live/queued generalized VN scene FIRST (mirrors autoplay): a scene owns
    // the surface — and under ADR-166 the refused Autumn exit QUEUES the nengu scene, whose
    // completion is the only way the wheel turns again (C5b: the no-op advance_season loop).
    if (s.activeScene !== null) {
      const def = sceneById(s.activeScene.id);
      const opts = def?.scene.decision.options ?? [];
      if (opts.length > 0)
        return { type: 'choose_scene_option', optionId: opts[0]!.id };
      return { type: 'advance_scene_beat' };
    }
    if (s.sceneQueue.length > 0)
      return { type: 'begin_scene', sceneId: s.sceneQueue[0]! };
    // check-in: a VN affordance is showing — answer it (first option, deterministically).
    if (introActive(s.introBeat)) {
      const opt = introSceneAt(s.introBeat)?.decision.options[0];
      if (opt) return { type: 'choose_intro', optionId: opt.id };
    }
    if (s.rungBeat !== null) {
      const opt = RUNG_BEATS[s.rungBeat]?.decision.options[0];
      if (opt) return { type: 'choose_rung_option', optionId: opt.id };
    }
    if (promotionReady(s) && !introActive(s.introBeat)) {
      const target = pendingPromotionTarget(s);
      // C5b: dispatch for BEATLESS rungs too — the reducer promotes a silent rung (R2, R5)
      // straight through begin_rung_beat (its own comment says so). The old `RUNG_BEATS[target]`
      // filter skipped exactly that case, so the idler ground haul_stores forever at a ready
      // R1→R2 promotion: the soft-lock every seed showed since the rewrite.
      if (target !== null) return { type: 'begin_rung_beat' };
    }
    // R2: the scripted wolf blocks the ladder — even an idler must walk back and face it
    // (FB-121: "the countable work is done" = the flag req is the only one remaining).
    // G4.3 — the scripted-wolf persona drive is deleted (wolf → R3 night round, later chunk).
    // FB-121 — point the auto-modes at the CURRENT rung's requirement list.
    const rem = remainingRequirements(s);
    // kill requirements: arm the auto-combat watch on the (level-laddered) foe and let the
    // shipped loop fight; the check-in mends first — a hurt watch is a loss loop. Training
    // below level parity mirrors the focused driver's ladder.
    const killReq = rem.find(
      (r) => r.type === 'count' && r.token.startsWith('kill:'),
    );
    if (killReq && killReq.type === 'count' && isUnlocked(s, 'tab-combat')) {
      // mend HP FIRST (the sickroom lane, ADR-164/ADR-197 — mirrors the night-round branch
      // below): arming the watch at 1 HP is the loss-loop the HD-35 re-pace exposed on
      // seeds 1/7; the pallet day is always walkable, so a broke idler still mends. The
      // GREEDY_MEND_HP_FRAC threshold matters here now: the mend is a WALK away (not the
      // old in-field cook), and a sensible player doesn't cross the estate for a scratch.
      if (s.character.hp < hpMax(s) * GREEDY_MEND_HP_FRAC) {
        const mend = sickroomMendLeg(s);
        if (mend) return mend;
      }
      // ADR-148 — the divided targets leave no wood SURPLUS: a Battered/Broken blade
      // provisions (repair when the wood allows, else cut it) before arming the watch —
      // the same rule the focused driver gained; an idler with a broken pole otherwise
      // loops the auto-combat stop forever and never closes the arc.
      const kw = getWeapon(s.equippedWeapon);
      const kband = durabilityBand(s.weaponDurability, kw.durabilityMax);
      if (kband.name === 'Battered' || kband.name === 'Broken') {
        if ((s.resources.wood ?? 0) >= balance.REPAIR_WOOD_COST)
          return { type: 'repair_weapon' };
        // a dry woodlot pool yields nothing — turn the wheel first (C5b; the exact loop
        // that soft-locked the idler: 27k zero-yield cuts against a dead seasonal pool)
        if (poolDry('woodcut_edge') && canTurnWheel)
          return { type: 'advance_season' };
        const woodlot = getActivity('woodcut_edge');
        if (s.location === woodlot.area)
          return { type: 'do_activity', activityId: 'woodcut_edge' };
        const hop = nextHopToward(s.location, woodlot.area, visibleSet(s));
        if (hop) return { type: 'move_to', to: hop };
      }
      const target = getMob(
        killReq.token.slice('kill:'.length) as Parameters<typeof getMob>[0],
      );
      const foe =
        s.character.level >= target.level
          ? target
          : (GRINDABLE_MOBS.filter((m) => m.level <= s.character.level).sort(
              (a, b) => b.level - a.level,
            )[0] ?? target);
      if (s.autoCombat === null) {
        if (s.location === foe.area) {
          const retreatHp = Math.round(balance.AUTO_RETREAT_FRAC * hpMax(s));
          return {
            type: 'set_auto_combat',
            mobId: foe.id,
            retreat: s.character.hp > retreatHp,
          };
        }
        const hop = nextHopToward(s.location, foe.area, visibleSet(s));
        if (hop) return { type: 'move_to', to: hop };
      }
    } else if (s.autoCombat !== null) {
      // no kill requirement stands: stand the watch down and go back to labour.
      return { type: 'set_auto_combat', mobId: null };
    }
    // C5b — the R3 night round: the wolf is survived INSIDE the round, so an idler must post
    // the watch too (the runner resolves live stages). Fires only once the COUNTABLE work is
    // done (rem is flags-only — the FB-121 shape), so the rat/tanuki grinding has already
    // levelled the fighter; prep mirrors the focused driver: mended HP, full belly, a sound
    // blade — the round is back-to-back fights with no mend inside it.
    const wolfReq = rem.find(
      (r) => r.type === 'flag' && r.flag === 'wolf-survived-not-won',
    );
    if (
      wolfReq &&
      rem.every((r) => r.type === 'flag') &&
      isUnlocked(s, 'tab-combat') &&
      s.roundState === null
    ) {
      // mend HP FIRST (no auto-trickle — ADR-164/ADR-197: the sickroom lane) — beginning
      // at the setback floor is the fall-loop this branch exists to avoid.
      {
        const mend = sickroomMendLeg(s);
        if (mend) return mend;
      }
      if (s.character.satiety < satietyMax(s) * 0.9 && acts.includes('rest')) {
        return { type: 'rest' };
      }
      const ww = getWeapon(s.equippedWeapon);
      const wband = durabilityBand(s.weaponDurability, ww.durabilityMax);
      if (
        (wband.name === 'Battered' || wband.name === 'Broken') &&
        (s.resources.wood ?? 0) >= balance.REPAIR_WOOD_COST
      ) {
        return { type: 'repair_weapon' };
      }
      return { type: 'begin_night_round', roundId: 'first-night-round' };
    }
    // the armed labour finished its requirement while others remain — re-point the loop
    // (otherwise autoModeIntent farms forever and the check-in below never fires).
    if (
      s.autoActivity !== null &&
      rem.length > 0 &&
      !rem.some(
        (r) => r.type === 'count' && r.token === `act:${s.autoActivity}`,
      )
    ) {
      return { type: 'set_auto', activityId: null };
    }
    // between check-ins: the shipped auto-loop IS the play — but never against a dead
    // seasonal pool (C5b): end the season so the armed labour has something to yield.
    if (s.autoActivity !== null && poolDry(s.autoActivity) && canTurnWheel) {
      return { type: 'advance_season' };
    }
    const auto = autoModeIntent(s);
    if (auto) return auto;
    // check-in: the auto-mode is idle — arm the next REQUIRED labour…
    if (acts.includes('rake_rice') && !s.autoRake)
      return { type: 'set_auto_rake', on: true };
    const actReq = rem.find(
      (r) =>
        r.type === 'count' &&
        r.token.startsWith('act:') &&
        ACTIVITIES.some((a) => `act:${a.id}` === r.token),
    );
    if (actReq && actReq.type === 'count') {
      const id = actReq.token.slice('act:'.length) as ActivityId;
      const act = getActivity(id);
      if (act.area === s.location && s.autoActivity !== id) {
        return { type: 'set_auto', activityId: id };
      }
      if (act.area !== s.location) {
        const hop = nextHopToward(s.location, act.area, visibleSet(s));
        if (hop) return { type: 'move_to', to: hop };
      }
    }
    // …and everything the autos can't do (state reqs, the wolf walk, the Phase-2 deed
    // grind) gets one attended minute: the focused driver's move.
    return focusedOptimalIntent(s);
  },
};

// ── explorer ──────────────────────────────────────────────────────────────────────────────────
// Breadth before optimisation (FB-4 §1): prefer any LEGAL never-yet-issued (type, payload-id) pair
// in deterministic registry order — ask every topic, walk every revealed node, taste every verb —
// falling back to greedy when nothing novel is legal. Legality is probed against the real
// reducer (an illegal intent returns the SAME state reference — the mode-guard contract), so the
// explorer can never "cheat" past a gate the player couldn't. No extra RNG: registry order is
// fixed, so runs reproduce.

/** Every candidate the explorer would enjoy trying, in fixed registry order for this state. */
function explorerCandidates(s: GameState): Intent[] {
  const out: Intent[] = [];
  // topics first (the plan's "ask every intro/rung topic before choosing")
  if (introActive(s.introBeat)) {
    const scene = introSceneAt(s.introBeat);
    for (const t of scene?.topics ?? [])
      out.push({ type: 'ask_topic', topicId: t.id });
  }
  if (s.rungBeat !== null) {
    const scene = RUNG_BEATS[s.rungBeat];
    for (const t of scene?.topics ?? [])
      out.push({ type: 'ask_rung_topic', topicId: t.id });
  }
  if (s.activeScene !== null) {
    const def = sceneById(s.activeScene.id);
    for (const t of def?.scene.topics ?? [])
      out.push({ type: 'ask_scene_topic', topicId: t.id });
  }
  // walk every revealed, adjacent node (registry order)
  const revealed = visibleSet(s);
  for (const n of MAP_NODES) {
    if (n.id !== s.location && canMove(s.location, n.id, revealed)) {
      out.push({ type: 'move_to', to: n.id });
    }
  }
  for (const a of ACTIVITIES)
    out.push({ type: 'do_activity', activityId: a.id });
  for (const m of MOBS)
    if (!m.scripted) out.push({ type: 'fight', mobId: m.id });
  for (const q of QUESTS) out.push({ type: 'accept_quest', questId: q.id });
  for (const i of MARKET_ITEMS) out.push({ type: 'buy_item', itemId: i.id });
  for (const b of BELONGING_IDS)
    out.push({ type: 'buy_belonging', belongingId: b });
  for (const r of RECIPES) out.push({ type: 'craft_weapon', recipeId: r.id });
  for (const w of WEAPONS) out.push({ type: 'equip_weapon', weaponId: w.id });
  for (const st of STANCE_ORDER) out.push({ type: 'set_stance', stance: st });
  for (const a of ATTR_IDS) out.push({ type: 'spend_attribute', attr: a });
  out.push({ type: 'eat_rice' });
  out.push({ type: 'sell_rice' });
  out.push({ type: 'improve_estate' });
  for (const res of ['rice', 'coin'] as const) {
    out.push({ type: 'deposit', resource: res });
    out.push({ type: 'withdraw', resource: res });
  }
  return out;
}

export const explorer: Persona = {
  id: 'explorer',
  knows: [
    // greedy's whole repertoire (the fallback) + every breadth verb above
    ...greedy.knows,
    'ask_topic',
    'ask_rung_topic',
    'ask_scene_topic',
    'eat_rice',
    'sell_rice',
    'improve_estate',
    'spend_attribute',
    'craft_weapon',
    'equip_weapon',
    'set_stance',
    'accept_quest',
    'buy_item',
    'buy_belonging',
    'deposit',
    'withdraw',
  ],
  decide(s, issued) {
    if (ascensionAvailable(s)) return { type: 'ascend' };
    for (const intent of explorerCandidates(s)) {
      if (issued.has(intentKey(intent))) continue;
      if (reduce(s, intent) !== s) return intent; // legal (the mode-guard no-op contract)
    }
    return greedy.decide(s, issued); // nothing novel is legal — optimise like greedy
  },
};

/** The full FB-4 roster (Ph3). */
export const PERSONAS: readonly Persona[] = [greedy, idler, explorer];
