// The log-content registry (shrink-save-file Stage C, 2026-07-05). Every diegetic log
// line's WORDS live here as one pure function of (contentKey, params) — the single
// source for a line's text (T1). Emit sites hand a `contentKey` + `params`; the rewards
// bus derives the text via `renderLogLine`. This lets the log persist as compact
// descriptors (contentKey + params) instead of prose, and lets a later reword update all
// history on next load ("re-derivation is fine", the human's 2026-07-05 call).
//
// A leaf module: imports nothing from core, so it never closes a dependency cycle.
// Populated incrementally as emit sites migrate (Stage C2…C8), grouped by source file.

export type LogParamValue = string | number | boolean;
export type LogParams = Readonly<Record<string, LogParamValue>>;

/** A line template: a pure function of its params → the diegetic text. */
export type LogTemplate = (p: LogParams) => string;

export const LOG_CONTENT: Record<string, LogTemplate> = {
  // ── step.ts — season boundaries ──────────────────────────────────────────────
  'season.reckoned': (p) =>
    `The season's accounts are reckoned. The house is judged the better for your hand on it — its koku standing rises. (+${p.bonus} koku)`,
  'season.spoilage': (p) =>
    `The season turns, and some of your rice has spoiled in the store. (−${p.total} rice)`,
};

/** Render a line's text from its content-key + params. Throws on an unknown key —
 *  a migration/emit-site bug is better LOUD than a silently blank hero-surface line. */
export function renderLogLine(contentKey: string, params: LogParams = {}): string {
  const tmpl = LOG_CONTENT[contentKey];
  if (tmpl === undefined) {
    throw new Error(`log-content: unknown contentKey "${contentKey}"`);
  }
  return tmpl(params);
}
