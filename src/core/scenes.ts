// The generalized-scene ENGINE (storywave G2) — pure `(GameState, …) -> GameState`
// functions that drive a `SceneDef` through the same greeting/decide/memory/flags
// semantics as the intro + rung-beat VN reducer arms, but with NO promotion (a scene
// never advances a rank; the `rung` trigger keeps `begin_rung_beat`'s promotion path).
// The reducer arms (`begin_scene` / `advance_scene_beat` / `choose_scene_option`) look a
// def up via `sceneById` and call these; the registry ships EMPTY at G2, so the arms are
// dormant live and the tests drive a CONSTRUCTED `SceneDef` through these functions
// directly. Pure-core: no DOM, no Math/Date — determinism rides the caller's state.

import type { GameState } from './state';
import { deepenNpc } from './state';
import { applyRewards } from './rewards';
import { SCENES, type SceneDef, type SceneId, type SceneTrigger } from './content/scenes';
import { rungOption, type RungScene } from './content/rungBeats';
import {
  NPC_VOICE,
  NPC_NAME,
  playerSpeaker,
  type NpcId,
  type VoiceCategory,
} from './content/voices';

/** Append a scene id to the queue — unless it is already queued, currently active, or a
 *  write-once played scene (mirrors the `unlocked` latch). The lower-level primitive both
 *  `triggerScenes` and the `verb` intent post through. */
export function enqueueScene(state: GameState, id: SceneId): GameState {
  if (state.sceneQueue.includes(id)) return state;
  if (state.activeScene?.id === id) return state;
  if (state.scenesPlayed.includes(id)) return state;
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
 *  `scenesPlayed` (a played `once` scene never re-fires). DORMANT at G2: `SCENES` is empty,
 *  so this is a live no-op — the machinery is exercised in tests via `enqueueScene` on a
 *  constructed def. */
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
  const opened: GameState = { ...state, activeScene: { id: def.id, beat: 0 } };
  return applyRewards(opened, {
    log: def.scene.greeting.map((l) => ({
      channel: 'narration' as const,
      text: l.text,
      voice: l.voice,
      speaker: l.speaker,
    })),
  });
}

/** Advance the beat cursor of a NARRATION-only / multi-line scene. Inert when the scene
 *  carries a decision with options (that terminal node is `applySceneOption`'s job) —
 *  mirrors `advance_rung_beat`. (A decision-less scene's terminal latch is G4 content; the
 *  registry is empty here, so no such scene exists yet.) */
export function advanceSceneBeat(state: GameState, def: SceneDef): GameState {
  if (state.activeScene === null || state.activeScene.id !== def.id) return state;
  if (def.scene.decision.options.length > 0) return state;
  return { ...state, activeScene: { id: def.id, beat: state.activeScene.beat + 1 } };
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
  let next = applyRewards(state, {
    log: [
      { channel: 'narration', text: opt.say, voice: 'player', speaker: playerSpeaker(state) },
      { channel: 'narration', text: opt.react, voice: react.voice, speaker: react.speaker },
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
      log: [{ channel: 'system', text: opt.statBonus.note, voice: 'narrator' }],
    });
  }
  // (e) the story-DEFAULT opening stance (if the pick sets one).
  if (opt.setStance) next = { ...next, stance: opt.setStance };
  // NO promotion — scenes never advance a rank (the rung trigger keeps begin_rung_beat's path).
  // Latch the write-once played record, then clear the cursor (the world reveals post-scene).
  next = latchScenePlayed(next, def.id);
  return { ...next, activeScene: null };
}

/** Append a scene id to the write-once `scenesPlayed` latch (idempotent, mirrors `unlocked`). */
function latchScenePlayed(state: GameState, id: SceneId): GameState {
  if (state.scenesPlayed.includes(id)) return state;
  return { ...state, scenesPlayed: [...state.scenesPlayed, id] };
}
