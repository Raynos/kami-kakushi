// The GENERALIZED VN scene registry (storywave G2) — the engine seam the bible's T0
// needs beyond promotions: scenes NOT tied to a rung (the Count, side-beats, lease day,
// nengu, season overlays, Bon) + the on-rails night-round frames. There is NO `VNScene`
// type and none is invented: the shared VN payload is the EXISTING `RungScene`
// (`rungBeats.ts`), reused verbatim — `RungOption` already carries every effect the
// staged prose declares (`memory`/`flags`/`statBonus`/`setStance`, all optional). The
// intro's `DialogueScene` keeps its own path (its perk/stat shape differs by design);
// unification happens at the RENDER layer only (one modal — TST1, deferred to G4.9).
//
// DORMANT at G2: the registry is EMPTY. G3.5's compiler + G4 content fill it later (the
// module then switches from this hand-written empty registry to re-exporting the gen
// registry). Pure-core: no DOM, no Math/Date — this module only carries DATA + a lookup.

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
  /** The shared VN payload. NOTE: `scene` is a plain `RungScene` with its REQUIRED `rank`.
   *  The plan's rank-optional widening (`rank?: RankId` for non-promotion content) is
   *  DEFERRED to G4 — it destabilizes the rung system, and at G2 the registry is empty so
   *  nothing supplies a dummy rank (tests construct a `RungScene` with a rank). */
  readonly scene: RungScene;
  readonly trigger: SceneTrigger;
  /** Play at most once — latched into `scenesPlayed` after `applySceneOption` (mirrors
   *  `unlocked`). Absent ⇒ repeatable (G4 content; at G2 the registry is empty). */
  readonly once?: boolean;
}

/** EMPTY at G2 — dormant. Nothing here is reachable in the live arc (the season overlays,
 *  side-beats, and night-round frames land as content at G4). */
export const SCENES: readonly SceneDef[] = [];

/** A scene by id, or undefined (the reducer arms no-op on undefined — dormant here). */
export function sceneById(id: SceneId): SceneDef | undefined {
  return SCENES.find((s) => s.id === id);
}
