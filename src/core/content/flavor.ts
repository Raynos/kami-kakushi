// UI flavor lines (ADR-139) — fiction-voiced micro-copy the renderer shows outside a VN
// scene (lock-hints, gate explainers). The PROSE is authored in `narrative/flavor.md`
// (FB-5 — the source of truth) and compiled to `flavor.gen.ts`; this module re-exports it.
// Each key is live-switchable in the DEV story set-switcher through the ONE story overlay
// (step B, session-200): every reader asks `flavorLine(key)`, which consults the active
// take's `flavor.<key>` entry and falls back to canon. The four per-concern setters that
// used to live here (judge / rest-open / sleep / sleep-announce) are retired.

export { FLAVOR } from './flavor.gen';
import { FLAVOR } from './flavor.gen';
import { storyText } from './story-overlay';
import type { Grade } from '../pillars';

/** A flavor key's effective prose — the active take's if set, else canon. The one
 *  funnel every flavor-keyed reader (emit-time, save-load, render-read) goes through. */
export function flavorLine(key: keyof typeof FLAVOR): string {
  return storyText(`flavor.${key}`) ?? FLAVOR[key];
}

// ── C5a unit 4 — the per-grade seasonal-judge line (ADR-159/ADR-167) ─────────────────

const JUDGE_KEY: Readonly<Record<Grade, keyof typeof FLAVOR>> = {
  FAIL: 'judgeLineFail',
  BAD: 'judgeLineBad',
  OK: 'judgeLineOk',
  GOOD: 'judgeLineGood',
  GREAT: 'judgeLineGreat',
  EXCELLENT: 'judgeLineExcellent',
};

/** The day-book's judge line for a grade — the valley's regard read at the season's
 *  close (TAKE C of the C5a diverge; TST3: koku standing IS outside regard). */
export function judgeLine(grade: Grade): string {
  return flavorLine(JUDGE_KEY[grade]);
}

// ── FB-402 — the open-rest line · ADR-187 — the slept-day + sleep-announce lines ─────
// Core-EMITTED text (intents.ts rest/sleep, reveals.ts first-stand); all three read
// through the overlay funnel, so a take flip reaches future emissions AND (via the
// log repaint's re-derive) the lines already in the log.

/** The line a rest away from your corner emits. */
export function restOpenLine(): string {
  return flavorLine('restOpen');
}

/** The line sleeping the day away emits. */
export function sleepLine(): string {
  return flavorLine('sleep');
}

/** The line the first stand at your corner emits. */
export function sleepAnnounceLine(): string {
  return flavorLine('sleepAnnounce');
}
