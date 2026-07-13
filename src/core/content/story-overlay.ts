// The ONE story-take overlay (step B of the session-200 take-system simplification,
// human-locked). Before this module, "swap a take" was implemented ~11 times — one
// declaring-module setter per concern (requirement flavor, discoveries, judge lines,
// rake-cap, rest, sleep, sleep-announce, works, intro titles, dialogue, the log's
// scene defs), each hand-mirrored by dev.ts on every switch, and every forgotten
// mirror was a silent "didn't flip live" bug. Now dev.ts flattens the EFFECTIVE
// takes into one contentKey → text map (plus the free-length narration-run
// sequences) and sets them HERE; every reader — emit-time, save-load, the DEV log
// repaint, and the render-read surfaces — asks `storyText`/`storySeq` and falls
// back to canon.
//
// Keys are the log's own addresses (`dialogue.<def>.<line>`, `beat.R3.opt.<id>.say`,
// `flavor.<k>`, `requirement.<k>`, …) plus the render-read classes (`.label`,
// `.prompt`, `req-objective.<k>`, `cold-open.<k>`, `intro-title.<sid>`) — exactly
// the map the takes compiler emits (gen-time canonicalized, prose-only gated).
//
// DEV-only: the sole setter caller is the DEV panel's switcher; prod never sets it,
// so every read folds to canon and the strip build carries no take data. A LEAF
// module (imports nothing) — safe for any content module or reducer to consult.

// TYPE-only import (erased at runtime) — the module stays a leaf.
import type { IntroSetupLine } from './intro';

let TEXT: Readonly<Record<string, string>> | null = null;
let SEQ: Readonly<Record<string, readonly IntroSetupLine[]>> | null = null;

/** DEV-only (the story set-switcher): install the effective takes' flat text map
 *  and narration-run sequences; null = all canon. */
export function __setStoryOverlay(
  text: Readonly<Record<string, string>> | null,
  seq: Readonly<Record<string, readonly IntroSetupLine[]>> | null = null,
): void {
  TEXT = text;
  SEQ = seq;
}

/** The active take's text for a content key, or undefined ⇒ canon. */
export function storyText(key: string): string | undefined {
  return TEXT?.[key];
}

/** The active take's narration-run sequence (`beat.R3.greeting`,
 *  `intro.dream.topic.<id>.answer`, …), or undefined ⇒ canon. */
export function storySeq(key: string): readonly IntroSetupLine[] | undefined {
  return SEQ?.[key];
}
