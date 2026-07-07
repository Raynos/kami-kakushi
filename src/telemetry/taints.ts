// The taint taxonomy (FB-8) — one home for what each honesty-ledger entry MEANS, so the
// report formatter and the drop transport can't drift apart. Three classes (human-locked
// 2026-07-07, the telemetry-distill session):
//   · HARNESS — an agent drives the game (fixture loads, __qa drives, forceState): the run
//     is QA exhaust, never the human playing. It stays in the localStorage ring but never
//     auto-drops a report FILE into project/telemetry/ (the 54-stub flood). The DEV
//     panel's manual drop button still writes — that's explicit intent.
//   · ORIGIN MARK — the run's STARTING STATE is unknown (a save-import), but the clock is
//     honest: attended time and the vs-sim comparison stay valid; only the per-rung
//     economy columns read unknown-origin.
//   · TIME TAINT — everything else (speed>1, DEV jumps, instant-actions): the clock itself
//     was distorted — excluded from vs-sim, the original FB-8 rule.

/** Agent-harness taints: a run carrying any of these never auto-drops a report file. */
export const HARNESS_TAINTS: ReadonlySet<string> = new Set([
  'fixture',
  'qa-drive',
  'forceState',
  'qa.tick',
]);

/** Origin marks: starting state unknown, clock honest — soften, don't taint. */
export const ORIGIN_MARKS: ReadonlySet<string> = new Set(['save-import']);

export const isHarnessRun = (taints: Iterable<string>): boolean =>
  [...taints].some((t) => HARNESS_TAINTS.has(t));

/** The time-distorting subset — what the vs-sim exclusion keys on. */
export const timeTaints = (taints: readonly string[]): string[] =>
  taints.filter((t) => !ORIGIN_MARKS.has(t));

export const originMarks = (taints: readonly string[]): string[] =>
  taints.filter((t) => ORIGIN_MARKS.has(t));
