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
  withSitePool,
  adjustHunger,
  addSkillXp,
  rememberNpc,
  deepenNpc,
  markTopicAsked,
} from './state';
import { applyRewards } from './rewards';
import { announcePass, visibleSet } from './unlock';
import { worksPass, stageOpen, stageLogLine, stageLabel, canWorkProject } from './works';
import { discoveryPass } from './discovery';
import { advanceClock, advanceSeason } from './step';
import { clamp } from './math';
import {
  satietyMax,
  hpMax,
  season,
  canDoActivity,
  canAffordAct,
  rakeExhausted,
  activityForecast,
  restRefill,
  ownsBelonging,
  peopleHere,
} from './selectors';
import { getPerson, PEOPLE_IDS } from './content/people';
import { getBelonging, homeRestLine } from './content/home';
import { skillLevel } from './skills';
import { applyPromotion, promotionReady, pendingPromotionTarget, rungNumber } from './ranks';
import { nenguReckonedThisYear } from './nengu';
import { bankEstateDeed } from './pillars';
import { ascend } from './ascension';
import { isUnlocked } from './unlock';
import { applyGrindFight } from './fight';
import {
  RICE_PER_RAKE,
  SATIETY_PER_ACT,
  TICKS_PER_ACT,
  REPAIR_WOOD_COST,
  REPAIR_COIN_COST,
  COOK_SANSAI_COST,
  COOK_HP_RESTORE,
  COOK_HUNGER_RESTORE,
  EAT_RICE_COST,
  EAT_RICE_HUNGER,
  riceSellPrice,
  kuraRiceCap,
  ESTATE_STAGE_DEED_GATES,
  WORKS_ACT_SATIETY,
} from './content/balance';
import { DAY_WAGE_MON, isWaged } from './content/wage';
import { ESTATE_STAGES, MAX_ESTATE_STAGE } from './content/estate';
import { FLAVOR, restOpenLine } from './content/flavor';
import { rakeLine, rakeCapLine } from './content/coldOpen';
import { nextDialogueLines, COLD_OPEN_DIALOGUE_ID } from './content/dialogue';
import {
  INTRO_SCENE_COUNT,
  introActive,
  introSceneAt,
  introTopic,
  introSceneOption,
  introSceneTitle,
  introPerkLine,
  beatReactVoice,
  beatReactSpeaker,
  type IntroStat,
} from './content/intro';
import { playerSpeaker } from './content/voices';
import { RUNG_BEATS, rungTopic, rungOption, type RungScene } from './content/rungBeats';
import { sceneById } from './content/scenes';
import { nightRoundById } from './content/nightRounds';
import {
  beginScene,
  advanceSceneBeat,
  applySceneOption,
  enqueueScene,
  triggerScenes,
  triggerFlagScenes,
} from './scenes';
import { beginNightRound } from './night-rounds';
import { NPC_VOICE, NPC_NAME, type NpcId, type VoiceCategory } from './content/voices';
import { getRank, type RankId } from './content/ranks';
import { getRecipe, canCraft } from './content/crafting';
import { acceptQuest } from './quest-engine';
import { applyProgressEvent, settleRequirements } from './progress-events';
import {
  getItem,
  canBuy,
  isMarketDay,
  itemInSeason,
  yoheiBuys,
  YOHEI_PURSE_MON,
} from './content/market';
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
  | { type: 'begin_scene'; sceneId: string } // storywave G2: open a generalized VN scene (dormant)
  | { type: 'advance_scene_beat' } // storywave G2: continue a narration-only scene (inert on decisions)
  | { type: 'choose_scene_option'; optionId: string } // storywave G2: the terminal scene decision
  | { type: 'begin_night_round'; roundId: string } // storywave G2: start the on-rails night round
  | { type: 'talk_to'; personId: string } // C4.2: a vn person's talk delivers their next authored line
  | { type: 'rake_rice' }
  | { type: 'rest' }
  | { type: 'do_activity'; activityId: ActivityId }
  | { type: 'set_auto'; activityId: ActivityId | null }
  | { type: 'set_auto_rake'; on: boolean }
  | { type: 'fight'; mobId: MobId; retreat?: boolean }
  | { type: 'set_auto_combat'; mobId: MobId | null; retreat?: boolean; reason?: 'weapon-broken' }
  | { type: 'repair_weapon' }
  | { type: 'equip_weapon'; weaponId: WeaponId }
  | { type: 'set_stance'; stance: StanceId }
  | { type: 'cook_meal' }
  | { type: 'eat_rice' } // kura rice → satiety (ADR-163 — the plain-rice meal path, shō from stores)
  | { type: 'sell_rice' } // kura rice → coin at Yohei's stall (ADR-163 — market-day + purse clamped)
  | { type: 'collect_wage' } // MON lane (ADR-163): collect the accrued day-wage at the board (R5+)
  | { type: 'advance_season' } // storywave G1: end the season (the manual six-season wheel)
  | { type: 'improve_estate' }
  | { type: 'work_project' }
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
  // FB-121: the requirement settle pass — atomic (state/flag) requirements latch against the
  // post-intent snapshot, so a flag set or a purse filled ANYWHERE is noticed the same tick.
  // ADR-110 still holds: the hot path NO LONGER auto-promotes. A ready promotion HOLDS (the bar
  // sits at 100%); the rung advances ONLY through the player-triggered beat (begin_rung_beat →
  // choose_rung_option → applyPromotion). Then the reveal pass runs as before.
  // G4 — the flag side-beat pass: any scene whose FLAG trigger is now set queues here (sb-dog on
  // orchard-reclaimed, sb-dog-coda on sb-dog-fed), so a flag latching anywhere is noticed this tick.
  // ADR-177 — the works discovery pass runs FIRST so a naming/sighting latched this
  // tick is seen by the same tick's flag-scene pass (the pricing beat enqueues at once).
  return announcePass(triggerFlagScenes(settleRequirements(worksPass(state))));
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
      // The save persists the LINE'S ID; the words re-render from the dialogue registry.
      contentKey: `dialogue.${dialogueId}.${l.id}`,
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
    log: scene.greeting.map((l, i) => ({
      channel: 'narration' as const,
      text: l.text,
      voice: l.voice,
      speaker: l.speaker,
      contentKey: `intro.${scene.id}.greeting.${i}`,
      // FB-262 — every VN line carries its scene label so the Story log can GROUP it
      // (the bordered "VN unit" treatments; the render-time scene-group stamps read this).
      // FB-362 — the label is PER SCENE (introSceneTitle), so each intro act is its own
      // 幕 card instead of one fused "the cold open" card. Old saves keep their baked
      // contexts (TST2 — no migration).
      context: introSceneTitle(scene),
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
  // The forecourt reveals HERE, not at R0-start: the outer court exists on your
  // map only once Genemon has put you to its work (the fiction causes the map,
  // TST3 — the FB-381/382 pattern). FB-401 (human, 2026-07-11, superseding the
  // same-day wake-in-the-kura call): the run now STANDS on the forecourt from
  // t=0 — the rake's authored ground — but the zone still INKS IN here, and
  // R0 has no map, so nothing player-visible predates this reveal. ADR-179 — the
  // cursor passing the last scene IS the fact; room-forecourt's predicate
  // (surfaces.ts, awake + !introActive) derives from it, so nothing to push.
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
    log: scene.greeting.map((l, i) => ({
      channel: 'narration' as const,
      text: l.text,
      voice: l.voice,
      speaker: l.speaker,
      contentKey: `beat.${target}.greeting.${i}`,
      context: `${getRank(target).title} promotion`, // FB-262 — the beat is one VN group
    })),
  });
}

/** The voice + nameplate a rung-beat option's `react` line speaks in. A per-option `reactNpc` wins
 *  (two-voice R4 — a second speaker answers option 2); else the scene's decision speaker/voice. */
function rungReactVoiceSpeaker(
  scene: RungScene,
  reactNpc: NpcId | undefined,
): { voice: VoiceCategory; speaker: string | undefined } {
  const npc = reactNpc ?? scene.speaker;
  if (npc) return { voice: NPC_VOICE[npc], speaker: NPC_NAME[npc] };
  return { voice: scene.voice, speaker: undefined };
}

/** Apply a promotion INTO `target` and fire its post-promotion scene hooks — the shared tail both
 *  the beat path (`choose_rung_option`) AND the SILENT path (`begin_rung_beat` on a beatless rung)
 *  run, so a rung's scenes enqueue however it was reached: the Count on R5, the first dream on R7,
 *  and the generalized rung-trigger mirror (R2's silent yard-hand beat). */
function promoteInto(state: GameState, target: RankId): GameState {
  let next = applyPromotion(state, target);
  if (target === 'R5') next = enqueueScene(next, 'count');
  if (target === 'R7') next = enqueueScene(next, 'r7-dream');
  next = triggerScenes(next, { kind: 'rung', rung: target });
  return next;
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
      // FB-269 — an already-asked topic re-asks for FREE in the live VN transcript (it's derived
      // from askedTopics, deduped by key), but must NOT re-append the Q+A to the permanent log:
      // refresh-replays and double-clicks were stacking duplicate exchanges in Chat.
      if (state.askedTopics.includes(topic.id)) return state;
      // FB-399 — THE FLIP fires before any post-flip MC line renders: the sickroom scene's
      // linear beats carry the name-question ("Nothing comes."), and every MC line after it —
      // the hub's asks and the decide — reads `Nameless:` (intro.md's flip comment is canon).
      // Latching here (and in choose_intro) puts the ladder ahead of the say-line emit.
      if (scene.id === 'soan') next = setFlag(next, 'label-nameless');
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
            speaker: playerSpeaker(next),
            chat: true,
            contentKey: `intro.${scene.id}.topic.${topic.id}.ask`,
            context: introSceneTitle(scene), // FB-270/FB-362 — the chat kicker names the SCENE
          },
          ...topic.answer.map((l, i) => ({
            channel: 'narration' as const,
            text: l.text,
            voice: l.voice,
            speaker: l.speaker,
            chat: true,
            contentKey: `intro.${scene.id}.topic.${topic.id}.answer.${i}`,
            context: introSceneTitle(scene), // FB-316 — the answer shares the question's scene group
          })),
        ],
      });
      // 3) mark asked (FB-269 — the guard above makes a re-ask a full no-op). Drives the
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
      // FB-399 — the flip precedes the decide's say line too (see ask_topic above).
      if (scene.id === 'soan') next = setFlag(next, 'label-nameless');
      // 1) the MC's spoken reply, then 2) the NPC's / narrator's reaction (voice-tagged, FB-23/FB-26)
      next = applyRewards(next, {
        log: [
          {
            channel: 'narration',
            text: opt.say,
            voice: 'player',
            speaker: playerSpeaker(next),
            contentKey: `intro.${scene.id}.opt.${intent.optionId}.say`,
            context: introSceneTitle(scene), // FB-262/FB-362 — the pick lands in ITS act's card
          },
          {
            channel: 'narration',
            text: opt.react,
            voice: beatReactVoice(scene),
            speaker: beatReactSpeaker(scene),
            contentKey: `intro.${scene.id}.opt.${intent.optionId}.react`,
            context: introSceneTitle(scene), // FB-316 — the react stays inside the scene's 幕 card
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
      // The perk line is DERIVED from the option (name + desc + the ± the reducer actually
      // applies), so it persists as a key and re-renders — a reworded perk blurb reaches old saves.
      next = applyRewards(next, {
        log: [
          {
            channel: 'milestone',
            text: introPerkLine(opt),
            contentKey: `intro.${scene.id}.opt.${intent.optionId}.perk`,
          },
        ],
      });
      // (G4's post-answer latch moved ABOVE the say-line emit — FB-399: the flip must
      //  precede every post-flip MC line, per intro.md's flip comment.)
      // 6) advance to the next beat, or fire the intro-complete tail
      next = enterNextBeat(next, state.introBeat + 1);
      break;
    }
    case 'begin_rung_beat': {
      // ADR-110: player-TRIGGERED promotion. Guard: a promotion is ready (the rung's requirement list
      // is 100% done — ADR-137/ADR-182; there is no separate story gate), no beat
      // is already live, and the intro is done (the VN surfaces never overlap). Opens the target
      // rung's beat — reveals its greeting into the Story channel. A ready promotion HOLDS until this
      // fires; the player may ignore it and grind on. No-op on a rank with no registered beat.
      if (!promotionReady(state)) return state;
      if (state.rungBeat !== null) return state;
      if (introActive(state.introBeat)) return state;
      const target = pendingPromotionTarget(state);
      if (target === null) return state;
      // SILENT rungs (R2 the yard-hand, R5 the accused) carry NO rung beat — their story is a
      // generalized SCENE (r2-yard-hand / the Count), not a promotion beat. Promote them STRAIGHT
      // through here (the scene enqueues inside promoteInto); only a rung WITH a beat opens the VN.
      // Without this the beatless rungs deadlocked the ladder (nothing could advance into them).
      if (!RUNG_BEATS[target]) {
        next = promoteInto(next, target);
        break;
      }
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
      if (state.askedTopics.includes(topic.id)) return state; // FB-269 — no duplicate log Q+A
      // FB-111 — an OPTIONAL rung-beat question is `chat` (routes to the Chat tab, off the Story tab).
      next = applyRewards(next, {
        log: [
          {
            channel: 'narration',
            text: topic.label,
            voice: 'player',
            speaker: playerSpeaker(next),
            chat: true,
            contentKey: `beat.${target}.topic.${topic.id}.ask`,
            // FB-270 — the chat kicker names the beat ("The day-hand promotion")
            context: `${getRank(target).title} promotion`,
          },
          ...topic.answer.map((l, i) => ({
            channel: 'narration' as const,
            text: l.text,
            voice: l.voice,
            speaker: l.speaker,
            chat: true,
            contentKey: `beat.${target}.topic.${topic.id}.answer.${i}`,
            // FB-316 — the answer shares the question's scene group
            context: `${getRank(target).title} promotion`,
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
      const beatCtx = `${getRank(target).title} promotion`; // FB-262 — same group as the greeting
      next = applyRewards(next, {
        log: [
          {
            channel: 'narration',
            text: opt.say,
            voice: 'player',
            speaker: playerSpeaker(next),
            contentKey: `beat.${target}.opt.${intent.optionId}.say`,
            context: beatCtx,
          },
          {
            channel: 'narration',
            text: opt.react,
            contentKey: `beat.${target}.opt.${intent.optionId}.react`,
            voice: react.voice,
            speaker: react.speaker,
            context: beatCtx,
          },
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
      // (e/f) APPLY the promotion + fire its post-promotion scene hooks (the Count on R5, the first
      //       dream on R7, the generalized rung-trigger mirror) — the shared `promoteInto` tail, so a
      //       beat-reached rung and a silent rung enqueue their scenes identically.
      next = promoteInto(next, target);
      // (g) clear the cursor — the beat is done; the shell/world reveals post-scene.
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
      if (!canAffordAct(next)) return state; // FB-265 — empty satiety refuses the act (rest first)
      if (rakeExhausted(next)) return state; // FB-324 — the spill is finite; the boards are clean
      // ADR-163: the raked spilled rice goes into the KURA (in shō), never a carried pocket — the
      // household's grain is a kura commodity from the first handful.
      next = withBanked(next, 'rice', RICE_PER_RAKE);
      next = adjustSatiety(next, -SATIETY_PER_ACT);
      next = { ...next, rakesDone: next.rakesDone + 1 };
      // F58a — the per-rake +rice OUTPUT line is fleeting flavor: it lands in the "Now" view and
      // fades, so repetitive rake output no longer spams Work (the human's log-v2 revision — rake
      // joins do_activity's labour output as ephemeral). The rice still banks; only the line fades.
      next = applyRewards(next, {
        flags: ['raked'],
        // FB-91/FB-93 — the rake RESULT line is scene narration, so it carries the `narrator` voice
        // (matching the intro's narration convention), never plain/unstyled.
        log: [
          {
            channel: 'reward',
            text: rakeLine(RICE_PER_RAKE),
            voice: 'narrator',
            ephemeral: true,
            contentKey: 'coldOpen.rake',
            params: { amount: RICE_PER_RAKE },
          },
        ],
      });
      // FB-324 — the rake that clears the LAST of the spill says so, once (a durable
      // narration line, not ephemeral — the "why the button died" record; TST4).
      if (rakeExhausted(next)) {
        next = applyRewards(next, {
          log: [{ channel: 'narration', text: rakeCapLine(), voice: 'narrator' }],
        });
      }
      // reveal-as-plot, ONE line per rake (not the whole raked-gated monologue on the first click):
      // gen-rake lands on rake #1, gen-keep on #2, gen-kept on #3 — the teach paces with the work.
      next = deliverDialogue(next, COLD_OPEN_DIALOGUE_ID, 1);
      next = applyProgressEvent(next, 'act:rake_rice'); // FB-121: the requirement stream
      next = advanceClock(next, TICKS_PER_ACT);
      break;
    }
    case 'rest': {
      if (!metaLegal(state, 'rest')) return state;
      // ADR-111 / FB-89 / FB-402+FB-409 — rest is SITED: the home lines (and the comfort
      // bonus, homeRestBonus) belong to your woodshed corner ONLY — resting there once
      // "a place here is yours" (panel-home) reads and restores as home; resting anywhere
      // else (any rung, pre- or post-home) is the open rest — base refill, the restOpen
      // flavor line (canon in narrative/flavor.md; ADR-139 bundle fb402-rest-open).
      const atHome = isUnlocked(next, 'panel-home') && next.location === 'woodshed';
      // ADR-178 — the refill routes through restRefill (base + comfort, × the belly's rest
      // quality): a hungry rest is a POOR rest — the belly's only teeth. AC-6: the shown
      // rest forecast reads the SAME selector, so a degraded rest never surprises.
      next = adjustSatiety(next, restRefill(next));
      const restLine = atHome ? homeRestLine(ownsBelonging(next, 'bedding')) : restOpenLine();
      // FB-53 — resting is fleeting flavor: it lands in the "Now" view and fades, never clutters
      // the permanent Work/All channels.
      // FB-91/FB-93 — the rest RESULT line is scene narration → `narrator` voice, consistent with
      // the intro's narration (not an un-voiced/plain line).
      // The save persists WHICH rest line + the fact that chose it (bedding), never the prose.
      const restKey = atHome ? 'home.rest' : 'flavor.restOpen';
      next = applyRewards(next, {
        log: [
          {
            channel: 'system',
            text: restLine,
            voice: 'narrator',
            ephemeral: true,
            contentKey: restKey,
            ...(atHome ? { params: { bedding: ownsBelonging(next, 'bedding') } } : {}),
          },
        ],
      });
      next = advanceClock(next, TICKS_PER_ACT);
      break;
    }
    case 'do_activity': {
      const act = getActivity(intent.activityId);
      if (!canDoActivity(next, act)) return state;
      // The whole reward math (G3 throttle × autumn × skill × estate over the ADR-163 site-pool
      // draw) lives in `activityForecast` — the SAME selector the DEV hover forecast reads
      // (FB-264, AC-6 — forecast == reality). This case keeps only the state writes.
      const { rawDraw, gained, xp: xpGain } = activityForecast(next, act);
      // the pool depletes by the raw draw (before skill/estate bonuses — the site gives what it
      // gives); it refills at season-turn (step.advanceSeason).
      if (rawDraw > 0) next = withSitePool(next, act.area, -rawDraw);
      // ADR-163: rice is a KURA commodity (shō) — it deposits into the house stores (banked), NEVER
      // the carried pocket. Split it out of the carried-resources reward.
      const riceSho = gained.rice ?? 0;
      const carried: Partial<Record<LabourResource, number>> = { ...gained };
      delete carried.rice;
      if (riceSho > 0) next = withBanked(next, 'rice', riceSho);
      next = addSkillXp(next, act.skill, xpGain);
      next = adjustSatiety(next, -act.satietyCost);
      // MON lane (ADR-163): a game-day on which ≥1 timed labour act completes accrues one day-wage,
      // once waged (R5+). Dedupe on the day (`lastWageDay`) so many acts in a day count once.
      if (isWaged(next.rung) && next.clock.day !== next.lastWageDay) {
        next = { ...next, wageDaysAccrued: next.wageDaysAccrued + 1, lastWageDay: next.clock.day };
      }
      const storyFlags: string[] = [];
      if (act.id === 'farm_paddy') storyFlags.push('farmed');
      next = applyRewards(next, {
        resources: carried as Record<string, number>,
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
            // The activity's PROSE re-renders from its def; the gains it actually paid are the
            // dynamic part, so they ride as params.
            contentKey: `activity.${act.id}`,
            params: gained as Record<string, number>,
          },
        ],
      });
      // one token stream (AC-20 glue): 'act:<id>' feeds the rung requirements (FB-121);
      // 'gather:<resource>' per yielded thing feeds quests AND requirements (ADR-037).
      next = applyProgressEvent(next, `act:${act.id}`);
      // Phase 2 (post-R7): ESTATE-RELEVANT labour banks its source's Estate deed (ADR-145 —
      // multi-source; woodcut/forage carry no deedSource and bank nothing; no-op in Phase 1).
      next = bankEstateDeed(next, act.deedSource);
      for (const res of Object.keys(gained)) next = applyProgressEvent(next, `gather:${res}`);
      // ADR-146 — a repeat attempt at this node's work can surface a hidden discovery (the
      // seeded repeat-action roll; a no-op when nothing here watches this activity).
      next = discoveryPass(next, { kind: 'activity', activityId: act.id });
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
    // G4.3 — the scripted grain-store wolf beat is deleted; the wolf lives only in the R3 night round.
    case 'fight': {
      if (!isUnlocked(next, 'tab-combat')) return state;
      // v0.3.1 Step 5b: foes are spatial — you must stand on the foe's node to fight it.
      if (getMob(intent.mobId).area !== next.location) return state;
      // B6 — "the wolf is survived, never won" is ENGINE law: a nightRoundOnly foe can never
      // be day-fought (the UI's GRINDABLE_MOBS filter was the only guard before).
      if (getMob(intent.mobId).nightRoundOnly) return state;
      next = applyGrindFight(next, intent.mobId, intent.retreat ?? false);
      break;
    }
    case 'set_auto_combat': {
      // Spatial (Step 5b): you can only ARM an auto-grind for a foe you stand with (mirrors the
      // `fight` gate); clearing (mobId null) works from anywhere. move_to also clears it when you walk off.
      if (intent.mobId !== null && getMob(intent.mobId).area !== next.location) return state;
      // B6 — a nightRoundOnly foe can't be ARMED for the day-grind either (the same invariant).
      if (intent.mobId !== null && getMob(intent.mobId).nightRoundOnly) return state;
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
      next = applyProgressEvent(next, 'act:repair_weapon'); // FB-121 (the R4 mend requirement)
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
      // ADR-178 — a meal is FOOD, so it also feeds the belly (never the work bar): the mend
      // stays the verb's primary job; the belly gain is the side of the same bowl.
      next = adjustHunger(next, COOK_HUNGER_RESTORE);
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
      // rice → BELLY (ADR-178: food feeds the belly, never the work bar — the FB-345 split; was
      // rice → satiety under ADR-107 Phase 2). The plain-rice FOOD path beside `rest` (free body)
      // + `cook_meal` (sansai → HP + belly). A deliberate meal RAISES the belly where the daily
      // kura ration only maintains it (EAT_RICE_HUNGER > HUNGER_MEAL_RESTORE), so eating your OWN
      // harvest buys rest quality ahead. Opens with the estate economy (verb-eat-rice), where
      // rice first gains its eat/sell/store uses. A no-op without the rice on hand.
      // ADR-163: the meal is drawn from the KURA (shō), never a carried pocket — rice lives only in
      // the house stores. A no-op without enough rice in the kura.
      if (!isUnlocked(next, 'verb-eat-rice')) return state;
      if ((next.banked.rice ?? 0) < EAT_RICE_COST) return state;
      next = withBanked(next, 'rice', -EAT_RICE_COST);
      const bellyBefore = next.character.hunger;
      next = adjustHunger(next, EAT_RICE_HUNGER);
      const bellyGain = next.character.hunger - bellyBefore;
      next = applyRewards(next, {
        log: [
          {
            channel: 'system',
            voice: 'narrator', // FB-91/FB-93 — player-action narration, consistent narrator voice
            contentKey: 'food.eatRice',
            params: { rice: EAT_RICE_COST, bellyGain },
            ephemeral: true, // FB-156 — fleeting consumption flavor → "Now", never Work spam
          },
        ],
      });
      next = advanceClock(next, TICKS_PER_ACT);
      break;
    }
    case 'sell_rice': {
      // ADR-163 — kura rice → COIN at Yohei's stall. Sell from the KURA (shō) at the SEASON-swinging
      // coin-per-shō rate, but CLAMPED: the stall is open only on his MARKET DAYS, and his finite
      // per-visit PURSE bounds how much he'll buy (the kind-overflow soft cap on mon inflow). He buys
      // only whitelisted goods (rice). A transaction (no clock cost). A no-op off a market day, with
      // no kura rice, or once his purse is spent.
      if (!isUnlocked(next, 'panel-estate')) return state;
      if (!isMarketDay(next.clock.day)) return state; // stall shut this weekday
      if (!yoheiBuys('rice')) return state;
      const riceStock = next.banked.rice ?? 0;
      if (riceStock <= 0) return state;
      const price = riceSellPrice(season(next));
      // clamp to Yohei's purse: he buys only as many shō as his coin covers.
      const affordableSho = price > 0 ? Math.floor(YOHEI_PURSE_MON / price) : riceStock;
      const soldSho = Math.min(riceStock, affordableSho);
      if (soldSho <= 0) return state;
      const coinGain = soldSho * price;
      next = withBanked(next, 'rice', -soldSho);
      next = withResource(next, 'coin', coinGain);
      // ADR-179 — "has ever earned coin" is a progression FACT (readout-coin derives
      // from it; raw coin fluctuates, so the balance alone can't carry the reveal).
      next = setFlag(next, 'coin-earned', true);
      next = applyRewards(next, {
        log: [
          {
            channel: 'system',
            voice: 'narrator', // FB-91/FB-93 — player-action narration, consistent narrator voice
            contentKey: 'market.sellRice',
            params: { rice: soldSho, price, coinGain },
          },
        ],
      });
      // ADR-145 — the sale enters the house books: a TREASURY Estate deed (Phase-2 only). The
      // store-vs-sell timing lever (Q3) is thus a real Phase-2 decision, not ambient economy.
      next = bankEstateDeed(next, 'treasury');
      break;
    }
    case 'collect_wage': {
      // MON lane (ADR-163) — the tactile collect-at-the-board verb: the accrued day-wage is HANDED
      // to the MC as coin (never auto-credited). Fixed per day worked (no compounding) — the bounded
      // faucet. A no-op with nothing owed.
      if (next.wageDaysAccrued <= 0) return state;
      const pay = next.wageDaysAccrued * DAY_WAGE_MON;
      next = withResource(next, 'coin', pay);
      next = setFlag(next, 'coin-earned', true); // ADR-179 — the first-wage FACT (readout-coin)
      next = { ...next, wageDaysAccrued: 0 };
      next = applyRewards(next, {
        log: [
          {
            channel: 'reward',
            voice: 'narrator',
            // HD-30 (2026-07-09): the wage-collect beat — the day-wage counted into the hand.
            text: `You are handed ${pay} mon at the board, counted once into your palm — the first the house has paid you in coin, and yours to keep.`,
            contentKey: 'wage.first',
            params: { pay },
            ephemeral: true,
          },
        ],
      });
      break;
    }
    case 'improve_estate': {
      // ADR-177 F3 — the COMMISSIONING half: coin + wood are paid up front; the stage
      // then completes through sited `work_project` acts (projects are WORK, not buys).
      if (!isUnlocked(next, 'panel-estate')) return state;
      if (next.estateCommission > 0) return state; // one work under way at a time
      const target = ESTATE_STAGES.find((s) => s.stage === next.estateStage + 1);
      if (!target) return state;
      // ADR-177 (TST3) — a stage is commissionable only after its discovery chain
      // closed (day-book named it → damage seen → the pricing beat played).
      if (!stageOpen(next, target.stage)) return state;
      // ADR-145 (the B half) — the build is STAGED against banked Estate standing: stage U<k>
      // also needs the house's recognised deeds at its gate, so U1–U4 land as paced Phase-2
      // build beats (U1's gate is 0 — Phase-1 purchasable as before).
      if (next.influence.estate.value < (ESTATE_STAGE_DEED_GATES[target.stage - 1] ?? 0))
        return state;
      if ((next.resources.coin ?? 0) < target.coinCost) return state;
      if ((next.resources.wood ?? 0) < target.woodCost) return state;
      next = withResource(next, 'coin', -target.coinCost);
      next = withResource(next, 'wood', -target.woodCost);
      next = { ...next, estateCommission: target.stage, estateWorkDone: 0 };
      // mechanical marker (inventory register, not fiction): the entry opens; the
      // COMPLETION line (stageLogLine, fiction-voiced canon) still lands at the close.
      next = applyRewards(next, {
        log: [
          {
            channel: 'milestone',
            text: `Commissioned: ${stageLabel(target)} — timber and coin set aside; the work waits at the site.`,
            contentKey: 'estate.commissioned',
            params: { stage: stageLabel(target) },
            voice: 'narrator',
          },
        ],
      });
      break;
    }
    case 'work_project': {
      // ADR-177 F3 — one sited act of the commissioned work. Same predicate the UI
      // affordance and the sim read (canWorkProject — AC-6).
      if (!canWorkProject(next)) return state;
      const target = ESTATE_STAGES.find((s) => s.stage === next.estateCommission);
      if (!target) return state;
      if (next.character.satiety < WORKS_ACT_SATIETY) return state;
      next = adjustSatiety(next, -WORKS_ACT_SATIETY);
      const done = next.estateWorkDone + 1;
      if (done < target.workActs) {
        next = { ...next, estateWorkDone: done };
        next = applyRewards(next, {
          log: [
            {
              channel: 'reward',
              text: `The work goes forward — ${stageLabel(target)}, ${done} of ${target.workActs}.`,
              contentKey: 'estate.workProgress',
              params: { stage: stageLabel(target), done, total: target.workActs },
              voice: 'narrator',
              ephemeral: true,
            },
          ],
        });
        next = applyProgressEvent(next, 'act:work_project');
        break;
      }
      // the closing act — the stage completes: the ladder advances and the canon
      // completion line lands (stageLogLine — take-aware, ADR-143).
      next = { ...next, estateStage: target.stage, estateCommission: 0, estateWorkDone: 0 };
      next = applyRewards(next, {
        log: [
          {
            channel: 'milestone',
            text: stageLogLine(target),
            contentKey: `estate.stage.${target.stage}.done`,
          },
        ],
      });
      next = applyProgressEvent(next, 'act:work_project');
      // ADR-145 — the E1 build-complete beat: the estate STANDS (fires exactly once, at U4).
      if (target.stage === MAX_ESTATE_STAGE && !hasFlag(next, 'estate-stands')) {
        next = applyRewards(next, {
          flags: ['estate-stands'],
          log: [
            {
              channel: 'milestone',
              text: FLAVOR.estateStands,
              voice: 'narrator',
              contentKey: 'flavor.estateStands',
            },
          ],
        });
      }
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
        log: [
          { channel: 'milestone', text: recipe.blurb, contentKey: `recipe.${recipe.id}.blurb` },
        ],
      });
      // ADR-145 — the workshop's recorded yield: a WORKSHOP Estate deed (Phase-2 only).
      next = bankEstateDeed(next, 'workshop');
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
      // ADR-163 — Yohei's stall clamps: open only on his MARKET DAYS, and each item is STOCKED only
      // in its seasons (one straw coat this winter). Off a market day or out of season → no buy.
      if (!isMarketDay(next.clock.day)) return state;
      const item = getItem(intent.itemId);
      if (!itemInSeason(item, season(next))) return state;
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
            ? {
                channel: 'milestone',
                voice: 'narrator',
                text: def.acquireLine,
                contentKey: `belonging.${def.id}.acquire`,
              }
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
      // ADR-145 — stocking the granary: a rice deposit banks a STORES Estate deed (Phase-2 only).
      if (intent.resource === 'rice') next = bankEstateDeed(next, 'stores');
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
      if (!canMove(next.location, intent.to, visibleSet(next))) return state;
      const dest = getNode(intent.to);
      if (dest.dangerRing && skillLevel(next, 'conditioning') < CONDITIONING_GATE_LEVEL)
        return state;
      // Walking away from a foe's node ends the auto-grind on it (Step 5b — foes are spatial, so
      // you can't keep auto-fighting a foe you've left behind). autoCombatRetreat is inert here.
      next = { ...next, location: intent.to, autoCombat: null };
      // FB-406 (supersedes ADR-116's arrival-line half) — a move emits NO flavor at all:
      // the human doesn't want zone reads floating through Now on every walk. The description
      // is a RENDERED read, not a log line: the Map's you-are-here card and (since HR-32's
      // locked variant D) the Zone banner both resolve the same seasonal blurb source
      // (nodeSeasonalBlurb — one value, two reads; TST1 holds) — nothing is lost.
      // ADR-146 — arriving can stumble onto a hidden discovery (the seeded visit roll; a no-op
      // when this node has no visit-triggered discovery).
      next = discoveryPass(next, { kind: 'visit' });
      // C4.1 — the authored side-beats fire from their AUTHORED moments (the scenes.md
      // notes are the spec): the grove patrol beat "between R2 and R4", the crest question
      // "at the kura after R3". enqueueScene dedupes + once-guards, so these are no-ops
      // once played; a run that never walks the window simply misses the OPTIONAL beat.
      {
        const rn = rungNumber(next.rung);
        if (intent.to === 'grove' && rn >= 2 && rn <= 4) next = enqueueScene(next, 'sb-grove');
        if (intent.to === 'kura' && rn >= 4) next = enqueueScene(next, 'sb-crest');
      }
      break;
    }
    case 'advance_season': {
      // storywave G1 + C1.4: end the current season — the exit pipeline (seasonal judge →
      // spoilage → wheel turn, instant per ADR-148). ENGINE LAW, not render law: refused
      // while any VN owns the surface (the surfaces never overlap) and before R2 (the manual
      // wheel arrives with the season readout — the vitals gate mirrors this; the reducer is
      // the source of truth).
      if (introActive(state.introBeat)) return state;
      if (state.activeScene !== null) return state;
      if (rungNumber(state.rung) < 2) return state;
      // ADR-166 — the Autumn REFUSING gate (human-ruled 2026-07-09): the year does not turn
      // until THIS year's nengu is reckoned. The refused attempt opens the reckoning itself:
      // the nengu scene enqueues (completing it draws the kura + latches the flags —
      // scenes.ts/nengu.ts), and the exit passes on the next attempt. Re-arms every year.
      if (state.season === 'autumn' && !nenguReckonedThisYear(state)) {
        next = enqueueScene(next, 'nengu-autumn-frame');
        break;
      }
      next = advanceSeason(next);
      // C4.1 — "the season's lease day after R3" (the scenes.md note): the first season
      // turn at R3+ opens Matsuzō's weir-lease collection beat (once; dedupe in enqueue).
      if (rungNumber(next.rung) >= 3) next = enqueueScene(next, 'sb-lease');
      break;
    }
    case 'ascend': {
      // the manual opt-in T0→T1 ascension (gate-checked inside `ascend` — a no-op if not ready).
      next = ascend(next);
      break;
    }
    case 'begin_scene': {
      // storywave G2 engine, LIVE since G4: open a generalized VN scene by id. No-op when the
      // id isn't in the registry, or when a scene is already live (the VN surfaces never overlap).
      const def = sceneById(intent.sceneId);
      if (!def) return state;
      if (state.activeScene !== null) return state;
      next = beginScene(next, def);
      break;
    }
    case 'advance_scene_beat': {
      // Continue past a NARRATION-only scene (inert on a decision scene) — mirrors advance_rung_beat.
      if (state.activeScene === null) return state;
      const def = sceneById(state.activeScene.id);
      if (!def) return state;
      next = advanceSceneBeat(next, def);
      break;
    }
    case 'choose_scene_option': {
      // The TERMINAL scene node: apply the pick (memory/flags/stat/stance — NO promotion), latch
      // the write-once played record, and clear the cursor.
      if (state.activeScene === null) return state;
      const def = sceneById(state.activeScene.id);
      if (!def) return state;
      next = applySceneOption(next, def, intent.optionId);
      break;
    }
    case 'begin_night_round': {
      // storywave G2 engine, LIVE since G4 (the R3 grain-watch): start the on-rails night
      // round. No-op when the id isn't in the registry, or when a round is already running.
      const def = nightRoundById(intent.roundId);
      if (!def) return state;
      if (state.roundState !== null) return state;
      next = beginNightRound(next, def);
      break;
    }
    case 'talk_to': {
      // C4.2 — the vn-depth cast is CONVERSABLE: talking delivers the person's next
      // gate/memory-satisfied authored line into the log through the SAME diegetic-mentor
      // cursor the cold open uses (deliverDialogue — one home, TST1; the log IS the surface,
      // never a popup). One line per ask ("one teach per moment"); talk again for the next;
      // exhausted or absent → a clean no-op. Presence is engine-checked (peopleHere).
      if (!PEOPLE_IDS.has(intent.personId)) return state;
      const person = getPerson(intent.personId);
      if (person.depth !== 'vn' || !person.sceneId) return state;
      if (!peopleHere(state).some((p) => p.id === intent.personId)) return state;
      next = deliverDialogue(next, person.sceneId, 1);
      break;
    }
  }
  return finish(next);
}
