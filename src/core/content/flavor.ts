// UI flavor lines (ADR-139) — fiction-voiced micro-copy the renderer shows outside a VN
// scene (lock-hints, gate explainers). The PROSE is authored in `narrative/flavor.md`
// (FB-5 — the source of truth) and compiled to `flavor.gen.ts`; this module re-exports it.
// Each key is live-switchable in the DEV story set-switcher: a diverge on a flavor line
// ships its alternates as a `takes/` bundle (the mend-hint is HR-10's first user).

export { FLAVOR } from './flavor.gen';
import { FLAVOR } from './flavor.gen';
import type { Grade } from '../pillars';

// ── C5a unit 4 — the per-grade seasonal-judge line (ADR-159/ADR-167) ─────────────────
// Core-EMITTED text (step.ts onReckoning), so the DEV story switcher swaps it through
// the declaring-module setter (the requirements.ts __setRequirementFlavorOverride
// pattern): future emissions voice the selected take; logged history stays (TST2).

let JUDGE_OVERRIDE: Readonly<Record<string, string>> | null = null;

/** DEV-only (the story set-switcher): override the judge lines by FLAVOR key, or null
 *  to restore canon. */
export function __setJudgeFlavorOverride(map: Readonly<Record<string, string>> | null): void {
  JUDGE_OVERRIDE = map;
}

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
  const key = JUDGE_KEY[grade];
  return JUDGE_OVERRIDE?.[key] ?? FLAVOR[key];
}

// ── FB-402 — the open-rest line (bundle fb402-rest-open) ─────────────────────────────
// Core-EMITTED text (intents.ts `rest`, away from the woodshed corner), so the DEV
// story switcher swaps it through the declaring-module setter (the rakeCapLine pattern):
// future emissions voice the selected take; logged history stays (TST2).

let REST_OPEN_OVERRIDE: string | null = null;

/** DEV-only: overlay the open-rest line by its `restOpen` flavor key (null = canon). */
export function __setRestOpenLineOverride(text: string | null): void {
  REST_OPEN_OVERRIDE = text;
}

/** The line a rest away from your corner emits — the DEV overlay's take if set, else canon. */
export function restOpenLine(): string {
  return REST_OPEN_OVERRIDE ?? FLAVOR.restOpen;
}

// ── ADR-187 — the slept-day line (bundle adr187-sleep) ───────────────────────────────
// Core-EMITTED text (intents.ts `sleep`, at your woodshed corner), so the DEV story
// switcher swaps it through the declaring-module setter (the restOpenLine pattern above):
// future emissions voice the selected take; logged history stays (TST2).

let SLEEP_OVERRIDE: string | null = null;

/** DEV-only: overlay the slept-day line by its `sleep` flavor key (null = canon). */
export function __setSleepLineOverride(text: string | null): void {
  SLEEP_OVERRIDE = text;
}

/** The line sleeping the day away emits — the DEV overlay's take if set, else canon. */
export function sleepLine(): string {
  return SLEEP_OVERRIDE ?? FLAVOR.sleep;
}

// ── ADR-187 follow-up — the sleep-announce beat (bundle sleep-announce) ──────────────
// Core-EMITTED text (reveals.ts, first stand at the corner with the verb live), so the
// DEV story switcher swaps it through the declaring-module setter (the sleepLine pattern
// above): future emissions voice the selected take; logged history stays (TST2).

let SLEEP_ANNOUNCE_OVERRIDE: string | null = null;

/** DEV-only: overlay the sleep-announce beat by its `sleepAnnounce` flavor key (null = canon). */
export function __setSleepAnnounceLineOverride(text: string | null): void {
  SLEEP_ANNOUNCE_OVERRIDE = text;
}

/** The line the first stand at your corner emits — the DEV overlay's take if set, else canon. */
export function sleepAnnounceLine(): string {
  return SLEEP_ANNOUNCE_OVERRIDE ?? FLAVOR.sleepAnnounce;
}
