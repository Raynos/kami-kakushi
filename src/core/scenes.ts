// The generalized-scene ENGINE (storywave G2) — pure `(GameState, …) -> GameState`
// functions that drive a `SceneDef` through the same greeting/decide/memory/flags
// semantics as the intro + rung-beat VN reducer arms, but with NO promotion (a scene
// never advances a rank; the `rung` trigger keeps `begin_rung_beat`'s promotion path).
// The reducer arms (`begin_scene` / `advance_scene_beat` / `choose_scene_option`) look a
// def up via `sceneById` and call these; the registry ships the LIVE T0 content (G4 +
// C4.1), and the engine tests still drive CONSTRUCTED `SceneDef`s through these functions
// directly. Pure-core: no DOM, no Math/Date — determinism rides the caller's state.

import type { GameState } from './state';
import { deepenNpc, setFlag } from './state';
import { applyRewards } from './rewards';
import {
  SCENES,
  sceneById,
  type SceneDef,
  type SceneId,
  type SceneTrigger,
} from './content/scenes';
import { reckonNengu } from './nengu';
import { rungOption, type RungScene } from './content/rungBeats';
import {
  NPC_VOICE,
  NPC_NAME,
  playerSpeaker,
  type NpcId,
  type VoiceCategory,
} from './content/voices';

/** Append a scene id to the queue — unless it is already queued, currently active, or a
 *  played `once` scene. The lower-level primitive both `triggerScenes` and the `verb`
 *  intent post through. C1.4: the replay-block keys on `def.once` (it used to block EVERY
 *  played id, silently making the SceneDef "absent ⇒ repeatable" contract false) — the
 *  annual nengu frame (ADR-166) re-enters the queue each Autumn through here. */
export function enqueueScene(state: GameState, id: SceneId): GameState {
  if (state.sceneQueue.includes(id)) return state;
  if (state.activeScene?.id === id) return state;
  // An id OUTSIDE the registry (constructed test defs) conservatively keeps the old
  // once-only behavior — only a REGISTERED repeatable may re-enter the queue.
  const def = sceneById(id);
  const once = def ? def.once === true : true;
  if (once && state.scenesPlayed.includes(id)) return state;
  return { ...state, sceneQueue: [...state.sceneQueue, id] };
}

/** Does a scene's trigger match a fired event? Same `kind`, and the kind's key equal. */
function triggerMatches(def: SceneTrigger, event: SceneTrigger): boolean {
  if (def.kind !== event.kind) return false;
  switch (def.kind) {
    case 'rung':
      return def.rung === (event as { kind: 'rung'; rung: string }).rung;
    case 'season-exit':
      return def.season === (event as { kind: 'season-exit'; season: string }).season;
    case 'flag':
      return def.flag === (event as { kind: 'flag'; flag: string }).flag;
    case 'verb':
    case 'scripted':
      return true;
  }
}

/** Enqueue every registered scene whose trigger matches `event`, respecting `once` vs
 *  `scenesPlayed` (a played `once` scene never re-fires). Live callers: the season-exit
 *  pipeline (the Bon beat) and `promoteInto`'s rung mirror. */
export function triggerScenes(state: GameState, event: SceneTrigger): GameState {
  let next = state;
  for (const def of SCENES) {
    if (!triggerMatches(def.trigger, event)) continue;
    if (def.once && next.scenesPlayed.includes(def.id)) continue;
    next = enqueueScene(next, def.id);
  }
  return next;
}

/** Enqueue every FLAG-triggered scene whose flag is now set (and which isn't a played `once` scene).
 *  Called centrally from the reduce settle pass (`finish`), so a side-beat's flag latching ANYWHERE
 *  — a quest completion, a rung reward, a choice — queues its scene the same tick, with no per-flag
 *  wiring at each setter. G4: this makes `sb-dog` (orchard-reclaimed) + `sb-dog-coda` (sb-dog-fed)
 *  and any future flag side-beat reachable. Idempotent (enqueueScene dedupes). */
export function triggerFlagScenes(state: GameState): GameState {
  let next = state;
  for (const def of SCENES) {
    if (def.trigger.kind !== 'flag') continue;
    if (state.flags[def.trigger.flag] !== true) continue;
    if (def.once && next.scenesPlayed.includes(def.id)) continue;
    next = enqueueScene(next, def.id);
  }
  return next;
}

/** Open a scene: set `activeScene` at beat 0 and reveal its greeting lines into the log
 *  (mirrors `revealRungBeat` — the Story/narration channel, each line's authored
 *  voice/nameplate carried so a two-voice scene reads correctly). */
export function beginScene(state: GameState, def: SceneDef): GameState {
  // DEQUEUE the scene as it opens (FIFO drain) — else the queue keeps re-serving the same id and
  // the arc re-plays it forever. Filter (not shift) so opening a non-head id still removes exactly it.
  const opened: GameState = {
    ...state,
    activeScene: { id: def.id, beat: 0 },
    sceneQueue: state.sceneQueue.filter((id) => id !== def.id),
  };
  return applyRewards(opened, {
    log: def.scene.greeting.map((l) => ({
      channel: 'narration' as const,
      text: l.text,
      voice: l.voice,
      speaker: l.speaker,
      context: def.id.replace(/-/g, ' '), // FB-262 — the scene is one VN group in Story
      // The save persists the KEY; the words re-render from THIS scene's def on load, so a
      // reworded beat updates every existing save (save-format plan, step 1).
      contentKey: `scene.${def.id}.greeting.${l.id}`,
    })),
  });
}

/** Advance a NARRATION-only scene (a decision with no options — the Count-resolve, the nengu
 *  frame, the Bon beat, the R7 dream, R2's silent yard-hand beat). Inert when the scene carries
 *  a decision WITH options (that terminal node is `applySceneOption`'s job) — mirrors
 *  `advance_rung_beat`. G4 — `beginScene` reveals the WHOLE greeting at once (a single beat), so
 *  the first `advance` on a decision-less scene is its TERMINAL: it latches the write-once played
 *  record and clears `activeScene` (the world reveals post-scene), exactly like a decision scene's
 *  close but with no pick to apply. Without this the arc's narration-only scenes never drain. */
export function advanceSceneBeat(state: GameState, def: SceneDef): GameState {
  if (state.activeScene === null || state.activeScene.id !== def.id) return state;
  if (def.scene.decision.options.length > 0) return state;
  let next = applySceneCompletionEffects(state, def);
  next = latchScenePlayed(next, def.id);
  return { ...next, activeScene: null };
}

/** Scene-completion EFFECTS (AC-20-style glue): id-keyed engine consequences that fire when
 *  a scene closes, whichever terminal closed it (a decision pick or the narration drain).
 *  ADR-166: the nengu frame IS the reckoning — completing it draws the kura + latches the
 *  flags (nengu.ts). Content-keyed effects live HERE, never inline in a reducer arm, so the
 *  two terminals can't drift. */
function applySceneCompletionEffects(state: GameState, def: SceneDef): GameState {
  if (def.id === 'nengu-autumn-frame') return reckonNengu(state);
  // C4.1 — the Count's CHAINED second beat (scenes.md: "split at the seam into a chained
  // second beat"): closing `count` queues `count-resolve` (the tally, Toku, the morning
  // wage). It was authored but had no enqueuer — dark until now.
  if (def.id === 'count') return enqueueScene(state, 'count-resolve');
  // ADR-184 — `sb-lease` IS the weir-reeds' reveal VN (Matsuzō up from the river: the screens are
  // rat-gnawed, "send your man down while the year turns"). It is a narration-only beat, so it has
  // no decision option to carry the fact — the CLOSE latches it, and room-weir-reeds derives.
  if (def.id === 'sb-lease') return setFlag(state, 'screens-charged');
  return state;
}

/** The voice + nameplate a scene option's `react` line speaks in (mirrors the rung-beat
 *  helper): a per-option `reactNpc` wins, else the scene's decision speaker/voice. */
function sceneReactVoiceSpeaker(
  scene: RungScene,
  reactNpc: NpcId | undefined,
): { voice: VoiceCategory; speaker: string | undefined } {
  const npc = reactNpc ?? scene.speaker;
  if (npc) return { voice: NPC_VOICE[npc], speaker: NPC_NAME[npc] };
  return { voice: scene.voice, speaker: undefined };
}

/** The TERMINAL scene node — apply a decision option EXACTLY like `choose_rung_option`, but
 *  with NO promotion: (a) voice the MC `say` + the speaker `react`; (b) DEEPEN each memory
 *  write; (c) set the story flags; (d) the rare `statBonus`; (e) `setStance`; then latch
 *  `def.id` into `scenesPlayed` (write-once) and clear `activeScene`. */
export function applySceneOption(state: GameState, def: SceneDef, optionId: string): GameState {
  if (state.activeScene === null || state.activeScene.id !== def.id) return state;
  const opt = rungOption(def.scene, optionId);
  if (!opt) return state;
  // (a) the exchange → Story: the MC's reply, then the speaker's reaction.
  const react = sceneReactVoiceSpeaker(def.scene, opt.reactNpc);
  const sceneCtx = def.id.replace(/-/g, ' '); // FB-262 — same VN group as the greeting
  let next = applyRewards(state, {
    log: [
      {
        channel: 'narration',
        text: opt.say,
        voice: 'player',
        speaker: playerSpeaker(state),
        context: sceneCtx,
        contentKey: `scene.${def.id}.opt.${optionId}.say`,
      },
      {
        channel: 'narration',
        text: opt.react,
        voice: react.voice,
        speaker: react.speaker,
        context: sceneCtx,
        contentKey: `scene.${def.id}.opt.${optionId}.react`,
      },
    ],
  });
  // (b) ACCUMULATING relationship write(s) — deepenNpc, identical to the rung-beat path.
  if (opt.memory) {
    for (const m of opt.memory) {
      next = deepenNpc(next, m.npc, {
        warmthDelta: m.warmthDelta,
        ...(m.regard !== undefined ? { regard: m.regard } : {}),
      });
    }
  }
  // (c) the durable story flags.
  if (opt.flags && opt.flags.length > 0) next = applyRewards(next, { flags: opt.flags });
  // (d) the rare small stat nudge + its delight line.
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
      log: [
        {
          channel: 'system',
          text: opt.statBonus.note,
          voice: 'narrator',
          contentKey: `scene.${def.id}.opt.${optionId}.bonus`,
        },
      ],
    });
  }
  // (e) the story-DEFAULT opening stance (if the pick sets one).
  if (opt.setStance) next = { ...next, stance: opt.setStance };
  // NO promotion — scenes never advance a rank (the rung trigger keeps begin_rung_beat's path).
  // Completion effects (the id-keyed glue), then latch the played record + clear the cursor.
  next = applySceneCompletionEffects(next, def);
  next = latchScenePlayed(next, def.id);
  return { ...next, activeScene: null };
}

/** Append a scene id to the write-once `scenesPlayed` latch (idempotent, mirrors `unlocked`). */
function latchScenePlayed(state: GameState, id: SceneId): GameState {
  if (state.scenesPlayed.includes(id)) return state;
  return { ...state, scenesPlayed: [...state.scenesPlayed, id] };
}
