// The action reducer (PRD §6.3): every player verb is a typed Intent; reduce maps a
// verb → new state. Pure, deterministic, immutable-in/out. Mode-guarded — an intent
// that isn't currently legal is a no-op. The Intent union grows additively per
// milestone; M0–M1 cover the cold open + the T0 Phase-1 labour spine.

import type { GameState } from './state';
import {
  setFlag,
  hasFlag,
  withResource,
  withBanked,
  addSkillXp,
  rememberNpc,
  markTopicAsked,
} from './state';
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
  REPAIR_KOKU_COST,
  SKILL_YIELD_DEN,
  COOK_SANSAI_COST,
  COOK_SATIETY_RESTORE,
  COOK_HP_RESTORE,
} from './content/balance';
import { ESTATE_STAGES } from './content/estate';
import { COLD_OPEN, rakeLine } from './content/coldOpen';
import { nextDialogueLines, COLD_OPEN_DIALOGUE_ID } from './content/dialogue';
import {
  INTRO_SCENE_COUNT,
  introSceneAt,
  introTopic,
  introSceneOption,
  introOutcomeLine,
  beatReactVoice,
  beatReactSpeaker,
  PLAYER_SPEAKER,
  type IntroStat,
} from './content/intro';
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
import { getMob, type MobId } from './content/enemies';
import type { StanceId, AttrId } from './content/balance';
import { ATTR_META } from './content/balance';

export type Intent =
  | { type: 'open_eyes' }
  | { type: 'advance_intro' } // Continue past a narration-only intro scene
  | { type: 'ask_topic'; topicId: string } // ASK a hub topic — reveal its answer, mark it asked
  | { type: 'choose_intro'; optionId: string } // the DECISION: pick a balanced closer at a scene
  | { type: 'rake_rice' }
  | { type: 'rest' }
  | { type: 'do_activity'; activityId: ActivityId }
  | { type: 'set_auto'; activityId: ActivityId | null }
  | { type: 'set_auto_rake'; on: boolean }
  | { type: 'face_wolf' }
  | { type: 'fight'; mobId: MobId; retreat?: boolean }
  | { type: 'set_auto_combat'; mobId: MobId | null; retreat?: boolean; reason?: 'weapon-broken' }
  | { type: 'repair_weapon' }
  | { type: 'equip_weapon'; weaponId: WeaponId }
  | { type: 'set_stance'; stance: StanceId }
  | { type: 'cook_meal' }
  | { type: 'improve_estate' }
  | { type: 'spend_attribute'; attr: AttrId }
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
function deliverDialogue(state: GameState, dialogueId: string, cap?: number): GameState {
  // `cap` limits how many newly-eligible lines land in ONE call — so a single rake doesn't dump the
  // whole raked-gated monologue at once (fun-factor "one teach per moment; never a monologue dump").
  const all = nextDialogueLines(
    dialogueId,
    new Set(state.deliveredDialogue),
    state.flags,
    state.npcMemory,
  );
  const fresh = cap !== undefined ? all.slice(0, cap) : all;
  if (fresh.length === 0) return state;
  const next: GameState = {
    ...state,
    deliveredDialogue: [...state.deliveredDialogue, ...fresh.map((l) => l.id)],
  };
  return applyRewards(next, {
    log: fresh.map((l) => ({ channel: 'narration' as const, text: l.text, voice: l.voice })),
  });
}

// ── The interactive intro (plan §3.5) — pure reducer helpers for the beat sequence. ──────────────

/** Reveal one scene's greeting lines into the log NOW (F15 — after the advancing click, never
 *  pre-run behind a curtain). Each line carries its authored voice + optional nameplate. */
function revealIntroBeat(state: GameState, index: number): GameState {
  const scene = introSceneAt(index);
  if (!scene) return state;
  return applyRewards(state, {
    log: scene.greeting.map((l) => ({
      channel: 'narration' as const,
      text: l.text,
      voice: l.voice,
      speaker: l.speaker,
    })),
  });
}

/** The +1/−1 net-zero attribute trade-off (plan decision 2). Reuses the immutable attrs write path;
 *  no attributePoints cost — the intro grants the lean directly. Data guarantees up ≠ down. */
function applyIntroStat(state: GameState, stat: IntroStat): GameState {
  const c = state.character;
  return {
    ...state,
    character: {
      ...c,
      attrs: {
        ...c.attrs,
        [stat.up]: (c.attrs[stat.up] ?? 0) + 1,
        [stat.down]: (c.attrs[stat.down] ?? 0) - 1,
      },
    },
  };
}

/** The intro-complete tail (plan §4.4): hand off to the estate. The "take stock / spilled rice"
 *  closing narration (COLD_OPEN.bodyReveal / .riceReveal) is ALREADY emitted by the surface-reveal
 *  path when readout-body / readout-rice reveal on `awake` (revealPass), so the tail must NOT
 *  re-emit it (that would double the lines). The cursor is now at INTRO_BEAT_COUNT (intro done);
 *  the rake verb is already legal (`awake`), and Genemon's rake TEACHING (gen-rake/keep/kept,
 *  raked-gated) proceeds one-per-rake as today. Phase 3 (render) can defer the reveal timing.
 *  (Self-picked deviation from the plan's §4.4 "reveal the closing narration in the tail" — the
 *  lines pre-exist on the surface-reveal path, so emitting them here would duplicate, not add.) */
function completeIntroTail(state: GameState): GameState {
  return state;
}

/** Move the cursor to `newIndex`, revealing the next scene's greeting — or firing the tail once the
 *  intro is over (newIndex === INTRO_SCENE_COUNT). */
function enterNextBeat(state: GameState, newIndex: number): GameState {
  const advanced: GameState = { ...state, introBeat: newIndex };
  return newIndex < INTRO_SCENE_COUNT
    ? revealIntroBeat(advanced, newIndex)
    : completeIntroTail(advanced);
}

export function reduce(state: GameState, intent: Intent): GameState {
  let next = state;
  switch (intent.type) {
    case 'open_eyes': {
      if (!metaLegal(state, 'open_eyes')) return state;
      next = setFlag(next, 'awake', true);
      next = applyRewards(next, { flags: ['dream-1'] });
      // The interactive intro STARTS here (plan §3.5): reveal Beat 0's setup (the wake line + Sōan's
      // grounding) NOW — after the click, never a pre-run dump (F15). The old grounding/dream/Genemon
      // dump is gone; those are BEATS now, revealed on advance.
      next = { ...next, introBeat: 0 };
      next = revealIntroBeat(next, 0);
      // Beat 3 carries Genemon's greeting and the tail covers the spilled-stores stakes, so retire the
      // registry's UNGATED greet/stakes lines (mark delivered) to avoid a double greet. The rake
      // TEACHING (gen-rake/keep/kept, raked-gated) still flows one-per-rake exactly as today.
      next = {
        ...next,
        deliveredDialogue: [...next.deliveredDialogue, 'gen-greet', 'gen-stores'],
      };
      break;
    }
    case 'advance_intro': {
      // Continue past a NARRATION-only scene; a scene with a decision must be answered
      // (choose_intro), so a Continue on a scene that has options is a no-op. Illegal outside the
      // intro ⇒ no-op. (Every authored scene carries a decision today, so this is inert but kept.)
      const scene = introSceneAt(state.introBeat);
      if (!scene) return state;
      if (scene.decision.options.length > 0) return state;
      next = enterNextBeat(next, state.introBeat + 1);
      break;
    }
    case 'ask_topic': {
      // ASK a hub topic (npc-dialogue-tree plan §3.3). Exploratory + FREE: reveal the answer, mark
      // the topic asked — NO stat, NO memory, NO scene advance (the player stays in the hub, and may
      // re-ask). Guard discipline mirrors choose_intro's.
      const scene = introSceneAt(state.introBeat);
      if (!scene) return state; // not in the intro ⇒ no-op
      const topic = introTopic(scene, intent.topicId);
      if (!topic) return state; // a topic id not on THIS scene ⇒ no-op
      if (topic.gate && !topic.gate(new Set(state.askedTopics))) return state; // gate unmet ⇒ no-op
      // 1) VOICE the MC's question (a `player` line, "You: …"), THEN 2) the NPC's answer line(s),
      //    each in its own authored voice + nameplate — the scrollback reads as a two-sided exchange.
      next = applyRewards(next, {
        log: [
          { channel: 'narration', text: topic.label, voice: 'player', speaker: PLAYER_SPEAKER },
          ...topic.answer.map((l) => ({
            channel: 'narration' as const,
            text: l.text,
            voice: l.voice,
            speaker: l.speaker,
          })),
        ],
      });
      // 3) mark asked (idempotent — a re-ask re-emits above but doesn't grow the set). Drives the
      //    hub's DIM state + the branch gates; touches NOTHING else.
      next = markTopicAsked(next, topic.id);
      break;
    }
    case 'choose_intro': {
      // The DECISION (npc-dialogue-tree plan §3.3): unchanged behaviour, now reading
      // scene.decision.options. Applies the ±1/∓1 + memory + advances the scene.
      const scene = introSceneAt(state.introBeat);
      if (!scene) return state;
      const opt = introSceneOption(scene, intent.optionId);
      if (!opt) return state; // an option id that isn't on THIS scene's decision ⇒ no-op
      // 1) the MC's spoken reply, then 2) the NPC's / narrator's reaction (voice-tagged, F23/F26)
      next = applyRewards(next, {
        log: [
          { channel: 'narration', text: opt.say, voice: 'player', speaker: PLAYER_SPEAKER },
          {
            channel: 'narration',
            text: opt.react,
            voice: beatReactVoice(scene),
            speaker: beatReactSpeaker(scene),
          },
        ],
      });
      // 3) the balanced +1/−1 net-zero stat trade-off
      next = applyIntroStat(next, opt.stat);
      // 4) the per-NPC memory write (independent key — Sōan's scene writes only `soan`, Genemon's `genemon`)
      if (opt.memory) {
        next = rememberNpc(next, opt.memory.npc, {
          regard: opt.memory.regard,
          warmth: opt.memory.warmth,
        });
      }
      // 5) the diegetic post-pick OUTCOME line — the option's flavor + the exact ±, landing AFTER
      //    the pick on the MILESTONE channel so it reads under Progress, not Work (F41/F42).
      next = applyRewards(next, { log: [{ channel: 'milestone', text: introOutcomeLine(opt) }] });
      // 6) advance to the next beat, or fire the intro-complete tail
      next = enterNextBeat(next, state.introBeat + 1);
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
      // reveal-as-plot, ONE line per rake (not the whole raked-gated monologue on the first click):
      // gen-rake lands on rake #1, gen-keep on #2, gen-kept on #3 — the teach paces with the work.
      next = deliverDialogue(next, COLD_OPEN_DIALOGUE_ID, 1);
      next = accrueRungMeter(next, 'rake_rice');
      next = advanceClock(next, TICKS_PER_ACT);
      break;
    }
    case 'rest': {
      if (!metaLegal(state, 'rest')) return state;
      next = adjustSatiety(next, SATIETY_PER_REST);
      // F53 — resting is fleeting flavor: it lands in the "Now" view and fades, never clutters
      // the permanent Work/All channels.
      next = applyRewards(next, {
        log: [{ channel: 'system', text: COLD_OPEN.restAct, ephemeral: true }],
      });
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
      // so koku→upgrade→more output compounds. Identity (===DEN) at U0 — byte-identical pre-buy.
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
        // F53 — the per-activity labour output line is fleeting flavor ("you worked / +N"): it
        // shows only in the "Now" view and fades. The gained resources still bank on the state;
        // only the noisy line is transient (crafts/purchases/rung-ups stay permanent).
        log: [{ channel: 'reward', text: activityLine(act, gained), ephemeral: true }],
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
    case 'set_auto_rake': {
      next = { ...next, autoRake: intent.on };
      break;
    }
    case 'face_wolf': {
      if (!isUnlocked(next, 'verb-face-wolf') || hasFlag(next, 'first-fight-survived'))
        return state;
      // v0.3.1 Step 5b: the humbling first fight is SPATIAL — the wolf is cornered in the kura
      // where you woke, so you walk back to the grain store to face it.
      if (next.location !== getMob('wolf_scripted').area) return state;
      next = applyScriptedWolf(next);
      break;
    }
    case 'fight': {
      if (!isUnlocked(next, 'tab-combat')) return state;
      // v0.3.1 Step 5b: foes are spatial — you must stand on the foe's node to fight it.
      if (getMob(intent.mobId).area !== next.location) return state;
      next = applyGrindFight(next, intent.mobId, intent.retreat ?? false);
      break;
    }
    case 'set_auto_combat': {
      // Spatial (Step 5b): you can only ARM an auto-grind for a foe you stand with (mirrors the
      // `fight` gate); clearing (mobId null) works from anywhere. move_to also clears it when you walk off.
      if (intent.mobId !== null && getMob(intent.mobId).area !== next.location) return state;
      next = { ...next, autoCombat: intent.mobId, autoCombatRetreat: intent.retreat ?? false };
      // The auto-loop stops the grind when the blade breaks and there's no wood to mend it — say so,
      // else the "leave it running" mode just halts silently and reads as a freeze (R3 false-silence).
      if (intent.mobId === null && intent.reason === 'weapon-broken') {
        next = applyRewards(next, {
          log: [
            {
              channel: 'system',
              text: `Your ${getWeapon(next.equippedWeapon).label.toLowerCase()} is broken and there's no wood to mend it — the watch breaks off. Gather wood and repair before you fight on.`,
            },
          ],
        });
      }
      break;
    }
    case 'set_stance': {
      if (!isUnlocked(next, 'tab-combat')) return state;
      next = { ...next, stance: intent.stance };
      break;
    }
    case 'repair_weapon': {
      // v0.3.1 Step 4: repair costs wood (the HARD requirement) + a koku FEE up to REPAIR_KOKU_COST,
      // WAIVED when you can't pay (the smith extends a broke goshi credit). A recurring combat-upkeep
      // koku sink (D-086 / batch-1 call 4) that can NEVER softlock (the no-stranding guardrail —
      // D-061, held inside D-086's "tension never pushes the player out").
      if ((next.resources.wood ?? 0) < REPAIR_WOOD_COST) return state;
      const kokuFee = Math.min(next.resources.koku ?? 0, REPAIR_KOKU_COST);
      const weapon = getWeapon(next.equippedWeapon);
      next = withResource(next, 'wood', -REPAIR_WOOD_COST);
      if (kokuFee > 0) next = withResource(next, 'koku', -kokuFee);
      next = { ...next, weaponDurability: weapon.durabilityMax };
      next = applyRewards(next, {
        log: [
          {
            channel: 'system',
            text: `You repair the ${weapon.label.toLowerCase()}. (−${REPAIR_WOOD_COST} wood${kokuFee > 0 ? `, −${kokuFee} koku` : ''})`,
          },
        ],
      });
      break;
    }
    case 'equip_weapon': {
      // the wood_axe is now FOUND/CRAFTED (D-052) — gate equipping it on having forged it,
      // not on the retired drillmaster grant.
      if (intent.weaponId === 'wood_axe' && !hasFlag(next, 'crafted-wood_axe')) return state;
      if (intent.weaponId === next.equippedWeapon) return state; // re-equip = no-op
      const weapon = getWeapon(intent.weaponId);
      // Switching CARRIES the current durability (clamped to the new weapon's max) — it must NOT
      // refill to full: an equip-to-repair loop was a free-repair exploit that voided the whole
      // wood+koku repair economy. A fresh weapon gets full durability at CRAFT time (craft_weapon),
      // never on a swap. (A per-weapon durability Record is the fuller fix; the clamp kills the
      // exploit for T0's two-weapon roster.)
      next = {
        ...next,
        equippedWeapon: intent.weaponId,
        weaponDurability: Math.min(next.weaponDurability, weapon.durabilityMax),
      };
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
      // attributePoints → one of the 5 attributes (§4.6.1). No clock cost.
      const c = next.character;
      if (c.attributePoints <= 0) return state;
      const a = intent.attr;
      next = {
        ...next,
        character: {
          ...c,
          attrs: { ...c.attrs, [a]: (c.attrs[a] ?? 0) + 1 },
          attributePoints: c.attributePoints - 1,
        },
      };
      next = applyRewards(next, { log: [{ channel: 'system', text: ATTR_META[a].log }] });
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
      // (batch-2 call 7). Spending + earning still use carried; banked is a safe reserve. Spatial
      // (Step 5c): the storehouse IS the kura, so you bank only while standing there. No clock cost.
      if (!isUnlocked(next, 'panel-estate')) return state;
      if (next.location !== 'kura') return state;
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
      if (next.location !== 'kura') return state; // Step 5c: draw from the storehouse only at the kura
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
      // Walking away from a foe's node ends the auto-grind on it (Step 5b — foes are spatial, so
      // you can't keep auto-fighting a foe you've left behind). autoCombatRetreat is inert here.
      next = { ...next, location: intent.to, autoCombat: null };
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
