// The GENERALIZED VN scene registry (storywave G2) — the engine seam the bible's T0
// needs beyond promotions: scenes NOT tied to a rung (the Count, side-beats, lease day,
// nengu, season overlays, Bon) + the on-rails night-round frames. There is NO `VNScene`
// type and none is invented: the shared VN payload is the EXISTING `RungScene`
// (`rungBeats.ts`), reused verbatim — `RungOption` already carries every effect the
// staged prose declares (`memory`/`flags`/`statBonus`/`setStance`, all optional). The
// intro's `DialogueScene` keeps its own path (its perk/stat shape differs by design);
// unification happens at the RENDER layer only (one modal — TST1, deferred to G4.9).
//
// The registry is AUTHORED as prose in `narrative/scenes.md` (FB-5 — the source of truth) and
// compiled to `scenes.gen.ts` by `pnpm run gen:narrative`; this module keeps the hand-written
// TYPES + `sceneById` lookup and re-exports the generated `SCENES` array (mirrors how
// `rungBeats.ts` re-exports `RUNG_BEATS`). LIVE since G4 (+ the C4.1 dark-beat wiring): the
// nengu frame, the Count chain, the five side-beats, R2's silent beat, the R7 dream — every
// def's trigger is reachable (the scenes.test.ts reachability sweep guards the class).
// Pure-core: no DOM, no Math/Date — this module only carries DATA + a lookup.

import type { RungScene } from './rungBeats';
import type { RankId } from './ranks';
import type { Season } from '../constants';

export type SceneId = string;

/** How a scene enters the queue. A discriminated union on `kind`:
 *  - `rung` — promotion beats KEEP their current `begin_rung_beat` path (this trigger is
 *    the generalized mirror, not a second promotion channel).
 *  - `season-exit` — fired by the season exit pipeline (the per-season overlay / nengu).
 *  - `flag` — fired when a story flag is set (a discovered side-beat).
 *  - `verb` — opened by an explicit intent (a node action).
 *  - `scripted` — enqueued by engine code (the Count, the night-round frames). */
export type SceneTrigger =
  | { readonly kind: 'rung'; readonly rung: RankId }
  | { readonly kind: 'season-exit'; readonly season: Season }
  | { readonly kind: 'flag'; readonly flag: string }
  | { readonly kind: 'verb' }
  | { readonly kind: 'scripted' };

export interface SceneDef {
  readonly id: SceneId;
  /** The shared VN payload — a `RungScene`. `RungScene.rank` is OPTIONAL (widened at G3.5):
   *  non-promotion scene content (season overlays, side-beats, the nengu) carries no rank. A
   *  decision-less scene (the speakerless narration-only beat, ADR-165) carries an empty
   *  `decision` — the engine's `advanceSceneBeat` drives it via the empty-options path. */
  readonly scene: RungScene;
  readonly trigger: SceneTrigger;
  /** Play at most once — latched into `scenesPlayed` after `applySceneOption` (mirrors
   *  `unlocked`). Absent ⇒ repeatable. */
  readonly once?: boolean;
}

/** AUTHORED in `narrative/scenes.md`, compiled to `scenes.gen.ts` — the LIVE T0 scene
 *  content (the nengu frame, the Count chain, the side-beats, the R7 dream). Every def's
 *  trigger reaches the player (C4.1; the reachability sweep in scenes.test.ts is RED the
 *  moment someone ships an authored scene with no path to it). */
export { SCENES } from './scenes.gen';
import { SCENES } from './scenes.gen';

/** A scene by id, or undefined (the reducer arms no-op on an unknown id). */
export function sceneById(id: SceneId): SceneDef | undefined {
  return SCENES.find((s) => s.id === id);
}
