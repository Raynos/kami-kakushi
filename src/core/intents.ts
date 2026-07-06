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
  deepenNpc,
  markTopicAsked,
} from './state';
import { applyRewards } from './rewards';
import { revealPass } from './unlock';
import { advanceClock } from './step';
import { clamp } from './math';
import {
  satietyMax,
  hpMax,
  staminaRate,
  season,
  canDoActivity,
  estateYieldNum,
  homeRestBonus,
  ownsBelonging,
} from './selectors';
import { getBelonging, homeRestLine } from './content/home';
import { skillLevel, skillYieldNum } from './skills';
import { accrueRungMeter, applyPromotion, promotionReady, pendingPromotionTarget } from './ranks';
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
  REPAIR_COIN_COST,
  SKILL_YIELD_DEN,
  COOK_SANSAI_COST,
  COOK_HP_RESTORE,
  EAT_RICE_COST,
  EAT_RICE_SATIETY,
  riceSellPrice,
  kuraRiceCap,
} from './content/balance';
import { ESTATE_STAGES } from './content/estate';
import { COLD_OPEN, rakeLine } from './content/coldOpen';
import { nextDialogueLines, COLD_OPEN_DIALOGUE_ID } from './content/dialogue';
import {
  INTRO_SCENE_COUNT,
  introActive,
  introSceneAt,
  introTopic,
  introSceneOption,
  introPerkLine,
  beatReactVoice,
  beatReactSpeaker,
  PLAYER_SPEAKER,
  type IntroStat,
} from './content/intro';
import { RUNG_BEATS, rungTopic, rungOption, type RungScene } from './content/rungBeats';
import { NPC_VOICE, NPC_NAME, type NpcId, type VoiceCategory } from './content/voices';
import type { RankId } from './content/ranks';
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
  | { type: 'begin_rung_beat' } // ADR-110: trigger the ready rung-up story beat (player-initiated)
  | { type: 'advance_rung_beat' } // Continue past a narration-only rung beat (inert today)
  | { type: 'ask_rung_topic'; topicId: string } // ASK a rung-beat hub topic (full VN meets R3/R6/R7)
  | { type: 'choose_rung_option'; optionId: string } // the terminal beat choice → apply the promotion
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
  | { type: 'eat_rice' } // rice → satiety (ADR-107 Phase 2 — the plain-rice food path)
  | { type: 'sell_rice' } // rice → coin at the season price (ADR-107 Phase 2 — the coin faucet)
  | { type: 'improve_estate' }
  | { type: 'spend_attribute'; attr: AttrId }
  | { type: 'craft_weapon'; recipeId: string }
  | { type: 'accept_quest'; questId: string }
  | { type: 'buy_item'; itemId: string }
  | { type: 'buy_belonging'; belongingId: string } // ADR-111: buy a comfort furniture piece for the home
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
  // ADR-110: the hot path NO LONGER auto-promotes. A ready promotion HOLDS (the meter caps visually);
  // the rung advances ONLY through the player-triggered beat (begin_rung_beat → choose_rung_option →
  // applyPromotion). `finish` just runs the reveal pass, so filling the meter never bumps the rung.
  return revealPass(state);
}

/** Deliver any not-yet-shown, gate-satisfied lines of a dialogue into the story log (the
 *  diegetic mentor, ADR-039/ADR-063 — the log IS the surface, never a popup). Advances the cursor. */
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
  // FB-91/FB-93 — carry the line's VOICE *and* its speaker nameplate through to the log, so a
  // steward/physician line renders "Genemon: …" / "Sōan: …" in that voice's colour. A narrator
  // line (third-person prose) suppresses the nameplate — it is not "spoken by" a named NPC.
  return applyRewards(next, {
    log: fresh.map((l) => ({
      channel: 'narration' as const,
      text: l.text,
      voice: l.voice,
      speaker: l.voice === 'narrator' ? undefined : l.speaker,
    })),
  });
}

// ── The interactive intro (plan §3.5) — pure reducer helpers for the beat sequence. ──────────────

/** Reveal one scene's greeting lines into the log NOW (FB-15 — after the advancing click, never
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

// ── The rung-up story beats (ADR-110) — pure reducer helpers, mirroring the intro's. ────────────────

/** Reveal one rung beat's greeting lines into the log NOW (the Story/narration channel — FB-103). Each
 *  line carries its authored voice + optional nameplate, so a two-voice beat (R4/R5) reads correctly. */
function revealRungBeat(state: GameState, target: RankId): GameState {
  const scene = RUNG_BEATS[target];
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

/** The voice + nameplate a rung-beat option's `react` line speaks in. A per-option `reactNpc` wins
 *  (two-voice R4 — Tōzō answers option 2); else the scene's decision speaker/voice. */
function rungReactVoiceSpeaker(
  scene: RungScene,
  reactNpc: NpcId | undefined,
): { voice: VoiceCategory; speaker: string | undefined } {
  const npc = reactNpc ?? scene.speaker;
  if (npc) return { voice: NPC_VOICE[npc], speaker: NPC_NAME[npc] };
  return { voice: scene.voice, speaker: undefined };
}

export function reduce(state: GameState, intent: Intent): GameState {
  let next = state;
  switch (intent.type) {
    case 'open_eyes': {
      if (!metaLegal(state, 'open_eyes')) return state;
      next = setFlag(next, 'awake', true);
      next = applyRewards(next, { flags: ['dream-1'] });
      // The interactive intro STARTS here (plan §3.5): reveal Beat 0's setup (the wake line + Sōan's
      // grounding) NOW — after the click, never a pre-run dump (FB-15). The old grounding/dream/Genemon
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
      //    FB-111 — this is OPTIONAL Q&A the player chose to ask, so it's flagged `chat`: it routes to
      //    the "Chat" tab, keeping the mandatory "Story" tab to scene beats you must see.
      next = applyRewards(next, {
        log: [
          {
            channel: 'narration',
            text: topic.label,
            voice: 'player',
            speaker: PLAYER_SPEAKER,
            chat: true,
          },
          ...topic.answer.map((l) => ({
            channel: 'narration' as const,
            text: l.text,
            voice: l.voice,
            speaker: l.speaker,
            chat: true,
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
      // 1) the MC's spoken reply, then 2) the NPC's / narrator's reaction (voice-tagged, FB-23/FB-26)
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
      // 5) the post-pick PERK-UNLOCK line (FB-56) — the granted perk's name + standalone desc + the
      //    exact ±, landing AFTER the pick on the MILESTONE channel so it reads under Progress, not
      //    Work (FB-41). The UI renders it as a JRPG-style perk box in a later pass.
      next = applyRewards(next, { log: [{ channel: 'milestone', text: introPerkLine(opt) }] });
      // 6) advance to the next beat, or fire the intro-complete tail
      next = enterNextBeat(next, state.introBeat + 1);
      break;
    }
    case 'begin_rung_beat': {
      // ADR-110: player-TRIGGERED promotion. Guard: a promotion is ready (meter + storyGate), no beat
      // is already live, and the intro is done (the VN surfaces never overlap). Opens the target
      // rung's beat — reveals its greeting into the Story channel. A ready promotion HOLDS until this
      // fires; the player may ignore it and grind on. No-op on a rank with no registered beat.
      if (!promotionReady(state)) return state;
      if (state.rungBeat !== null) return state;
      if (introActive(state.introBeat)) return state;
      const target = pendingPromotionTarget(state);
      if (target === null || !RUNG_BEATS[target]) return state;
      next = { ...next, rungBeat: target };
      next = revealRungBeat(next, target);
      break;
    }
    case 'ask_rung_topic': {
      // ASK a rung-beat hub topic (full VN meets R3/R6/R7). Exploratory + FREE — mirrors ask_topic:
      // reveal the answer to Story, mark it asked; NO stat, NO memory, NO promotion (re-askable).
      const target = state.rungBeat;
      if (target === null) return state;
      const scene = RUNG_BEATS[target];
      if (!scene) return state;
      const topic = rungTopic(scene, intent.topicId);
      if (!topic) return state;
      if (topic.gate && !topic.gate(new Set(state.askedTopics))) return state;
      // FB-111 — an OPTIONAL rung-beat question is `chat` (routes to the Chat tab, off the Story tab).
      next = applyRewards(next, {
        log: [
          {
            channel: 'narration',
            text: topic.label,
            voice: 'player',
            speaker: PLAYER_SPEAKER,
            chat: true,
          },
          ...topic.answer.map((l) => ({
            channel: 'narration' as const,
            text: l.text,
            voice: l.voice,
            speaker: l.speaker,
            chat: true,
          })),
        ],
      });
      next = markTopicAsked(next, topic.id);
      break;
    }
    case 'choose_rung_option': {
      // The TERMINAL beat node (ADR-110) — the SOLE place a rung advances. In order: (a) voice the MC's
      // say + the speaker's react to Story; (b) DEEPEN each memory write; (c) set the story flags;
      // (d) the rare statBonus / the R5 stance default; (e) applyPromotion (the ONLY rewardOnReach
      // application + the terse Progress marker); (f) clear the cursor — the world inks in on teardown.
      const target = state.rungBeat;
      if (target === null) return state;
      const scene = RUNG_BEATS[target];
      if (!scene) return state;
      const opt = rungOption(scene, intent.optionId);
      if (!opt) return state;
      // (a) the exchange → Story (FB-103): the MC's reply, then the speaker's reaction.
      const react = rungReactVoiceSpeaker(scene, opt.reactNpc);
      next = applyRewards(next, {
        log: [
          { channel: 'narration', text: opt.say, voice: 'player', speaker: PLAYER_SPEAKER },
          { channel: 'narration', text: opt.react, voice: react.voice, speaker: react.speaker },
        ],
      });
      // (b) ACCUMULATING relationship write(s) — Genemon's trust deepens across rungs (deepenNpc).
      if (opt.memory) {
        for (const m of opt.memory) {
          next = deepenNpc(next, m.npc, {
            warmthDelta: m.warmthDelta,
            ...(m.regard !== undefined ? { regard: m.regard } : {}),
          });
        }
      }
      // (c) the durable story flags (the pick + any flag-backed bonus — pedlar-favour / smith-whetstone).
      if (opt.flags && opt.flags.length > 0) next = applyRewards(next, { flags: opt.flags });
      // (d) the rare small stat nudge (R3) + its delight line; the R5 stance DEFAULT (a story default).
      if (opt.statBonus) {
        const c = next.character;
        next = {
          ...next,
          character: {
            ...c,
            attrs: {
              ...c.attrs,
              [opt.statBonus.attr]: (c.attrs[opt.statBonus.attr] ?? 0) + opt.statBonus.amount,
            },
          },
        };
        next = applyRewards(next, {
          log: [{ channel: 'system', text: opt.statBonus.note, voice: 'narrator' }],
        });
      }
      if (opt.setStance) next = { ...next, stance: opt.setStance };
      // (e) APPLY the promotion — the sole place rewardOnReach fires (rank-rN flags + unlocks + the
      //     terse marker). No rung ever advances without this beat completing (the ADR-110 invariant).
      next = applyPromotion(next, target);
      // (f) clear the cursor — the beat is done; the shell/world reveals post-scene.
      next = { ...next, rungBeat: null };
      break;
    }
    case 'advance_rung_beat': {
      // Continue past a NARRATION-only rung beat (no decision). Every authored beat carries a
      // decision today, so this is inert — kept for symmetry with advance_intro. On a decision-less
      // beat it would apply the promotion + clear the cursor.
      const target = state.rungBeat;
      if (target === null) return state;
      const scene = RUNG_BEATS[target];
      if (!scene) return state;
      if (scene.decision.options.length > 0) return state;
      next = applyPromotion(next, target);
      next = { ...next, rungBeat: null };
      break;
    }
    case 'rake_rice': {
      if (!metaLegal(state, 'rake_rice')) return state;
      next = withResource(next, 'rice', RICE_PER_RAKE);
      next = adjustSatiety(next, -SATIETY_PER_ACT);
      // F58a — the per-rake +rice OUTPUT line is fleeting flavor: it lands in the "Now" view and
      // fades, so repetitive rake output no longer spams Work (the human's log-v2 revision — rake
      // joins do_activity's labour output as ephemeral). The rice still banks; only the line fades.
      next = applyRewards(next, {
        flags: ['raked'],
        // FB-91/FB-93 — the rake RESULT line is scene narration, so it carries the `narrator` voice
        // (matching the intro's narration convention), never plain/unstyled.
        log: [
          { channel: 'reward', text: rakeLine(RICE_PER_RAKE), voice: 'narrator', ephemeral: true },
        ],
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
      // ADR-111 / FB-89 — rest is RE-SITED to your home once the corner exists (T0-A). Pre-home it's the
      // cold-open post ("against the cool post"); once "a place here is yours" (panel-home, R1) it's
      // your corner, and bedding/the settled-home set add to the satiety it restores (homeRestBonus —
      // 0 pre-home + for a bare corner, so the base rest is byte-identical until you earn comfort).
      const atHome = isUnlocked(next, 'panel-home');
      next = adjustSatiety(next, SATIETY_PER_REST + homeRestBonus(next));
      const restLine = atHome ? homeRestLine(ownsBelonging(next, 'bedding')) : COLD_OPEN.restAct;
      // FB-53 — resting is fleeting flavor: it lands in the "Now" view and fades, never clutters
      // the permanent Work/All channels.
      // FB-91/FB-93 — the rest RESULT line is scene narration → `narrator` voice, consistent with
      // the intro's narration (not an un-voiced/plain line).
      next = applyRewards(next, {
        log: [{ channel: 'system', text: restLine, voice: 'narrator', ephemeral: true }],
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
      // so coin→upgrade→more output compounds. Identity (===DEN) at U0 — byte-identical pre-buy.
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
        // FB-53 — the per-activity labour output line is fleeting flavor ("you worked / +N"): it
        // shows only in the "Now" view and fades. The gained resources still bank on the state;
        // only the noisy line is transient (crafts/purchases/rung-ups stay permanent).
        // FB-91/FB-93 — the labour RESULT line is scene narration → `narrator` voice, consistent
        // with the intro's narration convention.
        log: [
          {
            channel: 'reward',
            text: activityLine(act, gained),
            voice: 'narrator',
            ephemeral: true,
          },
        ],
      });
      next = accrueRungMeter(next, act.id);
      // Phase 2 (post-R7): estate labour also banks an Estate-pillar deed (no-op in Phase 1).
      next = applyEstateDeed(next);
      // quest advance tokens — 'gather:<resource>' for each thing the act yielded (ADR-037).
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
              voice: 'narrator', // FB-91/FB-93 — scene narration, consistent narrator voice
              contentKey: 'combat.weaponBroken',
              params: { weapon: getWeapon(next.equippedWeapon).label.toLowerCase() },
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
      // v0.3.1 Step 4: repair costs wood (the HARD requirement) + a COIN FEE up to REPAIR_COIN_COST,
      // WAIVED when you can't pay (the smith extends a broke goshi credit). A recurring combat-upkeep
      // coin sink (ADR-086 / batch-1 call 4 / ADR-107) that can NEVER softlock (the no-stranding
      // guardrail — ADR-061, held inside ADR-086's "tension never pushes the player out").
      if ((next.resources.wood ?? 0) < REPAIR_WOOD_COST) return state;
      const coinFee = Math.min(next.resources.coin ?? 0, REPAIR_COIN_COST);
      const weapon = getWeapon(next.equippedWeapon);
      next = withResource(next, 'wood', -REPAIR_WOOD_COST);
      if (coinFee > 0) next = withResource(next, 'coin', -coinFee);
      next = { ...next, weaponDurability: weapon.durabilityMax };
      next = applyRewards(next, {
        log: [
          {
            channel: 'system',
            voice: 'narrator', // FB-91/FB-93 — player-action narration, consistent narrator voice
            contentKey: 'craft.repair',
            params: { weapon: weapon.label.toLowerCase(), wood: REPAIR_WOOD_COST, coinFee },
          },
        ],
      });
      break;
    }
    case 'equip_weapon': {
      // the wood_axe is now FOUND/CRAFTED (ADR-052) — gate equipping it on having forged it,
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
        // FB-91/FB-93 — player-action narration, consistent narrator voice.
        log: [
          {
            channel: 'system',
            voice: 'narrator',
            contentKey: 'craft.equip',
            params: { weapon: weapon.label.toLowerCase() },
          },
        ],
      });
      break;
    }
    case 'cook_meal': {
      // sansai → HP, the HEALTH-recovery action (FB-22 + ADR-050). Eating is the ONLY mend
      // for combat wounds (couples food ↔ combat), and it recovers HEALTH *only* — it does
      // NOT refill work-stamina (satiety). Work-stamina is the SEPARATE `rest` action's job
      // (FB-22: "rest from work" ≠ "recover from a fight" — one action must not refill both).
      // Costs greens, so a heal always costs something (ADR-076: no free/auto-heal).
      if (!isUnlocked(next, 'verb-cook')) return state;
      if ((next.resources.sansai ?? 0) < COOK_SANSAI_COST) return state;
      next = withResource(next, 'sansai', -COOK_SANSAI_COST);
      const hpBefore = next.character.hp;
      const hpAfter = Math.min(hpMax(next), hpBefore + COOK_HP_RESTORE);
      if (hpAfter !== hpBefore) next = { ...next, character: { ...next.character, hp: hpAfter } };
      const hpGain = hpAfter - hpBefore;
      next = applyRewards(next, {
        log: [
          {
            channel: 'system',
            // FB-91/FB-93 — cook RESULT flavor is scene narration → `narrator` voice.
            voice: 'narrator',
            contentKey: 'food.cook',
            params: { sansai: COOK_SANSAI_COST, hpGain },
            // FB-156 — repetitive consumption output is fleeting flavor (the F58a
            // rake/labour precedent): it lives in "Now" and fades, never spams Work.
            ephemeral: true,
          },
        ],
      });
      next = advanceClock(next, TICKS_PER_ACT);
      break;
    }
    case 'eat_rice': {
      // rice → satiety (ADR-107 Phase 2): the plain-rice FOOD path, a light rice SINK beside `rest`
      // (free satiety) + `cook_meal` (sansai → HP). A proper meal refuels MORE than a mere rest
      // (EAT_RICE_SATIETY > SATIETY_PER_REST), so eating your OWN harvest trades rice for a faster
      // refuel — never a strictly-worse rest. Opens with the estate economy (verb-eat-rice), where
      // rice first gains its eat/sell/store uses. A no-op without the rice on hand.
      if (!isUnlocked(next, 'verb-eat-rice')) return state;
      if ((next.resources.rice ?? 0) < EAT_RICE_COST) return state;
      next = withResource(next, 'rice', -EAT_RICE_COST);
      const satBefore = next.character.satiety;
      next = adjustSatiety(next, EAT_RICE_SATIETY);
      const satGain = next.character.satiety - satBefore;
      next = applyRewards(next, {
        log: [
          {
            channel: 'system',
            voice: 'narrator', // FB-91/FB-93 — player-action narration, consistent narrator voice
            contentKey: 'food.eatRice',
            params: { rice: EAT_RICE_COST, satGain },
            ephemeral: true, // FB-156 — fleeting consumption flavor → "Now", never Work spam
          },
        ],
      });
      next = advanceClock(next, TICKS_PER_ACT);
      break;
    }
    case 'sell_rice': {
      // rice → COIN (ADR-107 Phase 2 / §14): the coin FAUCET. Sell your whole carried rice pile to the
      // pedlar at the SEASON-swinging coin-per-rice rate (dear spring, cheap autumn) — the light
      // store-vs-sell timing decision (hold the cheap-autumn haul in the kura, sell into dear
      // spring). A transaction (no clock cost, like buy_item). Opens with the estate economy
      // (panel-estate — the pedlar arrives). A no-op with no carried rice.
      if (!isUnlocked(next, 'panel-estate')) return state;
      const rice = next.resources.rice ?? 0;
      if (rice <= 0) return state;
      const price = riceSellPrice(season(next));
      const coinGain = rice * price;
      next = withResource(next, 'rice', -rice);
      next = withResource(next, 'coin', coinGain);
      next = applyRewards(next, {
        log: [
          {
            channel: 'system',
            voice: 'narrator', // FB-91/FB-93 — player-action narration, consistent narrator voice
            contentKey: 'market.sellRice',
            params: { rice, price, coinGain },
          },
        ],
      });
      break;
    }
    case 'improve_estate': {
      // coin → estateStage (audit #5 / ADR-107). A commissioning (no clock cost, like equipping).
      if (!isUnlocked(next, 'panel-estate')) return state;
      const target = ESTATE_STAGES.find((s) => s.stage === next.estateStage + 1);
      if (!target) return state;
      if ((next.resources.coin ?? 0) < target.coinCost) return state;
      next = withResource(next, 'coin', -target.coinCost);
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
      // FB-91/FB-93 — attribute-gain flavor is scene narration → consistent narrator voice.
      next = applyRewards(next, {
        log: [{ channel: 'system', text: ATTR_META[a].log, voice: 'narrator' }],
      });
      break;
    }
    case 'craft_weapon': {
      // loot→craft (ADR-052): the FOUND/CRAFTED 2nd weapon, replacing the retired grant. Consume
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
      // the tiny CAPPED market (TRADE taste, T0-M4-F3/ADR-008) — a commissioning, no clock cost.
      // Opens with the estate economy (panel-estate). The per-run stockCap is the minority clamp.
      if (!isUnlocked(next, 'panel-estate')) return state;
      const item = getItem(intent.itemId);
      const bought = next.marketBought[item.id] ?? 0;
      if (!canBuy(next.resources, item, bought)) return state;
      next = withResource(next, 'coin', -item.coinCost);
      for (const [res, amt] of Object.entries(item.grants)) next = withResource(next, res, amt);
      next = { ...next, marketBought: { ...next.marketBought, [item.id]: bought + 1 } };
      next = applyRewards(next, {
        log: [
          {
            channel: 'system',
            voice: 'narrator', // FB-91/FB-93 — player-action narration, consistent narrator voice
            contentKey: 'market.buyItem',
            params: { coin: item.coinCost, item: item.label.toLowerCase() },
          },
        ],
      });
      break;
    }
    case 'buy_belonging': {
      // ADR-111 / FB-89 — buy one comfort furniture piece for the home (a personal-COIN sink, parallel to
      // the market lane). A commissioning: no clock cost. Gated on the home existing (panel-home, R1);
      // a granted keepsake can't be bought, and each piece is owned ONCE (no stacking). The bonus is
      // COMFORT (rest/warmth), never a combat stat (prestige-not-power, ADR-111).
      if (!isUnlocked(next, 'panel-home')) return state;
      const def = getBelonging(intent.belongingId);
      if (def.source.kind !== 'buy') return state; // the mat/bowl arrive with the home, never bought
      if (next.belongings.includes(def.id)) return state; // already owned — no double-buy
      if ((next.resources.coin ?? 0) < def.source.coinCost) return state;
      next = withResource(next, 'coin', -def.source.coinCost);
      next = { ...next, belongings: [...next.belongings, def.id] };
      // the acquire line is a PERMANENT Progress beat (you settled your corner a little more) — not
      // fleeting like a labour line; furnishing your home is a small milestone, FB-41.
      next = applyRewards(next, {
        // A granted keepsake carries its own authored acquire line (content, kept as text); a
        // plain buy uses the registry template (Stage C).
        log: [
          def.acquireLine !== undefined
            ? { channel: 'milestone', voice: 'narrator', text: def.acquireLine }
            : {
                channel: 'milestone',
                voice: 'narrator',
                contentKey: 'belonging.acquire',
                params: { item: def.label.toLowerCase() },
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
      // ADR-118 / build-plan §1 lever (b) — the KURA CAP: only RICE is capped (the hoard governor); coin
      // banks freely. You can store only up to the room left under the cap; a full kura stores nothing
      // (raise the cap by improving the estate). Uncapped resources take the whole pile as before.
      let stored = have;
      if (intent.resource === 'rice') {
        const room = Math.max(0, kuraRiceCap(next.estateStage) - (next.banked.rice ?? 0));
        stored = Math.min(have, room);
        if (stored <= 0) return state; // the kura is full — nothing to deposit
      }
      next = withResource(next, intent.resource, -stored);
      next = withBanked(next, intent.resource, stored);
      // ADR-108 — coin denominates (mon/monme/ryō) to match the pills; rice/materials stay plain
      // counts. The denomination now lives in the log-content registry (bank.deposit, Stage C).
      next = applyRewards(next, {
        log: [
          {
            channel: 'system',
            voice: 'narrator', // FB-91/FB-93 — player-action narration, consistent narrator voice
            contentKey: 'bank.deposit',
            params: { amount: stored, resource: intent.resource },
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
      // ADR-108 — coin denominates (mon/monme/ryō) to match the pills; rice/materials stay plain
      // counts. The denomination now lives in the log-content registry (bank.withdraw, Stage C).
      next = applyRewards(next, {
        log: [
          {
            channel: 'system',
            voice: 'narrator', // FB-91/FB-93 — player-action narration, consistent narrator voice
            contentKey: 'bank.withdraw',
            params: { amount: have, resource: intent.resource },
          },
        ],
      });
      break;
    }
    case 'move_to': {
      // walk the small estate map (T0-M4-F4 / ADR-065): adjacent + revealed (nodes reuse the
      // existing room-unlock surfaces), and the danger ring needs the conditioning gate.
      if (!canMove(next.location, intent.to, new Set(next.unlocked))) return state;
      const dest = getNode(intent.to);
      if (dest.dangerRing && skillLevel(next, 'conditioning') < CONDITIONING_GATE_LEVEL)
        return state;
      // Walking away from a foe's node ends the auto-grind on it (Step 5b — foes are spatial, so
      // you can't keep auto-fighting a foe you've left behind). autoCombatRetreat is inert here.
      next = { ...next, location: intent.to, autoCombat: null };
      // ADR-116 (resolves FB-114) — location/navigation flavor does NOT belong in the Story log. The
      // STANDING "you are looking around" description lives on the Map node (the renderer reads
      // `getNode(location).blurb`); the ARRIVAL line is a light TRANSIENT "Now" line that FADES.
      // Emit it `ephemeral: true` → log-filter routes ephemeral entries to the `now` view ONLY and
      // hides them from Story/All, so the Story log keeps only mandatory beats (no nav noise).
      next = applyRewards(next, {
        log: [{ channel: 'narration', text: dest.blurb, voice: 'narrator', ephemeral: true }],
      });
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
