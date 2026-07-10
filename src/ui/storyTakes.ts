// Story take-set registry (ADR-139) — types + re-export of the generated data.
//
// A bundle = one OPEN narrative diverge: its not-picked alternate takes, kept
// DEV-only so the human can compare them in the running game (the story
// set-switcher + the script-reader modal in the DEV panel). The picked take
// lives in canon; on sign-off the bundle's source dir is pruned and the
// committed review doc remains the archive.
//
// This module is imported ONLY from the `__DEV_TOOLS__`-gated dev fold
// (src/ui/dev.ts) — never by the pure core or the plain renderer — so in a
// strip build it dead-code-eliminates with the rest of the DEV panel.
// Source of truth: `src/core/content/narrative/takes/<bundle>/` →
// `pnpm run gen:narrative` → `storyTakes.gen.ts` (byte-compared by the gate).

import type { RankId } from '../core/content/ranks';
import type { RungScene } from '../core/content/rungBeats';
import type { DialogueScene } from '../core/content/intro';
import type { DialogueDef } from '../core/content/dialogue';

export interface StoryTake {
  readonly id: string;
  readonly label: string;
  /** The take's dramatic brief (one line — what this take commits to). */
  readonly brief: string;
  /** Compressed Pass-2 taste-scorecard verdict, e.g. "18✔ 2✘ 1—". */
  readonly scorecard?: string;
  readonly rungBeats?: Partial<Record<RankId, RungScene>>;
  readonly introScenes?: readonly DialogueScene[];
  /** ADR-139 — generalized scene-def bodies (season-exit / scripted VN beats), keyed by
   *  scene id. Swapped live at the active-VN render path via `dev.subScene` (identity when
   *  the set is 'canon'). The take carries only the RungScene body; trigger/once stay canon. */
  readonly scenes?: Partial<Record<string, RungScene>>;
  readonly dialogues?: readonly DialogueDef[];
  readonly coldOpen?: Readonly<Record<string, string>>;
  /** ADR-139 — fiction-voiced UI flavor lines (lock-hints, gate explainers) the
   *  renderer shows outside a VN scene; keyed by the `## prose flavor` key. */
  readonly flavor?: Readonly<Record<string, string>>;
  /** FB-121 — requirement-completion flavor lines, keyed by requirement id
   *  (`## prose req-flavor`). Swapped through the CORE overlay
   *  (`__setRequirementFlavorOverride`): FUTURE completions emit from the
   *  selected take; already-logged lines stay (T2 — history never rewrites). */
  readonly reqFlavor?: Readonly<Record<string, string>>;
}

export interface StoryTakeBundle {
  readonly id: string;
  readonly title: string;
  /** Repo-relative path of the bundle's review doc (the archive-of-record). */
  readonly review?: string;
  /** Why the canon take was picked (the pick itself lives in canon). */
  readonly rationale?: string;
  /** Short label for the CANON option pill ("Canon — <label>"); absent ⇒ "the pick". */
  readonly canonLabel?: string;
  /** The rung a player first meets this diverge's content (FB-307 — the Story pane
   *  groups bundles under `— rung RX —` headers, mirroring the Variants pane). A
   *  bundle no rung fits carries `rungReason` instead (FB-312 — no catch-all group:
   *  each reason renders as its own `— other · <reason> —` header). One of the two
   *  is always set (the takes generator requires it). */
  readonly rung?: number;
  readonly rungReason?: string;
  readonly takes: readonly StoryTake[];
}

export { STORY_TAKE_BUNDLES } from './storyTakes.gen';
