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

import type { IntroSetupLine } from '../core/content/intro';

export interface StoryTake {
  readonly id: string;
  readonly label: string;
  /** The take's dramatic brief (one line — what this take commits to). */
  readonly brief: string;
  /** Compressed Pass-2 taste-scorecard verdict, e.g. "18✔ 2✘ 1—". */
  readonly scorecard?: string;
  /** Steps A+B (session-200, human-locked) — the take IS a FLAT contentKey → text map,
   *  canonicalized against canon at gen time behind the hard prose-only gate: the keys are
   *  the addresses the log persists (`dialogue.<def>.<line>`, `beat.R3.opt.<id>.say`,
   *  `flavor.<k>`, …) plus the render-read classes (`.label`, `.prompt`, `req-objective.<k>`,
   *  `cold-open.<k>`, `intro-title.<sid>`). Step B migrates every consumer onto this map and
   *  retires the def-shaped fields above. */
  readonly text?: Readonly<Record<string, string>>;
  /** The narration-run sequences (greetings + topic answers), keyed `<ns>.<unit>.greeting` (`beat.R1.greeting`,
   *  `intro.dream.greeting`, `scene.works-intro.greeting`). A narration run's line count is
   *  PACING — part of the take's voice — so it keeps its own length and per-line voice; the
   *  log re-voices positionally up to min(canon, take), a fresh VN run plays the take. */
  readonly seq?: Readonly<Record<string, readonly IntroSetupLine[]>>;
}

// A bundle's reference — in the DEV panel, in review.md, in chat — is its `id`
// (`sleep-announce`). The positional `SV<n>` tag is DEAD (2026-07-13, ADR-192): it numbered
// registry positions, so any insert/prune renumbered every tag after it and sent the human to
// the wrong row. An id never renumbers; a take within a bundle is its letter (`take b`).

export interface StoryTakeBundle {
  readonly id: string;
  readonly title: string;
  /** The HR-item this bundle awaits (`HR-33`), or `none · <why>` when it awaits nobody — a
   *  settled bundle the human asked to KEEP for comparison (hd30-nengu after HR-17,
   *  fb324-rake-cap after its drain). Authored as `hr:` in bundle.md, required by the takes
   *  generator; the `review-link` gate binds the HR- form to an OPEN item in review.md. The
   *  Review tab renders it as the row's chip, and counts only the HR- ones. */
  readonly hr: string;
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
