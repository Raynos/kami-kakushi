// Headless time-per-rung pacing report (audit G-PACING). Drives the focused-optimal
// auto-play path per rung against a chosen balance profile using the REAL engine
// (createInitialState + reduce — NOT a re-derived formula, so the "model" cannot drift
// from the game), converts dispatched intents → modeled wall-minutes via the 480ms
// active-loop cadence, prints a per-rung table, and flags any climb rung under the
// signed ≥30-min wall floor. `--check` is the G-PACING CI gate (recommended at M3; NOT
// wired into `npm run verify` in v0.2 to avoid making the H1 policy call).
//
// Model: the active-only loop dispatches exactly ONE intent per AUTO_REPEAT_MS while
// focused, so modeled wall-time per rung = (intents to clear that rung) × AUTO_REPEAT_MS.
// Intents = productive acts (cheapest eligible activity = focused-optimal) + rests
// (the auto-loop's satiety<25% rule) + per-rung meta verbs (open_eyes at R0; face_wolf
// at R2 to satisfy the storyGate). In-game days are flavour; the FLOOR is on wall-minutes.
export {};

import {
  createInitialState,
  reduce,
  availableActions,
  availableLabours,
  canDoActivity,
  getActivity,
  satietyMax,
  getRank,
  RANKS,
  balance,
  type GameState,
  type BalanceProfile,
  type ActivityId,
  type Intent,
} from '../core';

const { AUTO_REPEAT_MS, RUNG_WALL_FLOOR_MIN, rungThreshold } = balance;
const SEED = 20260626;

export interface RungPacing {
  rung: string;
  title: string;
  threshold: number;
  act: string;
  acts: number;
  rests: number;
  meta: number;
  intents: number;
  wallMin: number;
  inGameDays: number;
  terminal: boolean;
  underFloor: boolean;
}

interface RungTrack {
  acts: number;
  rests: number;
  meta: number;
  startTick: number;
  endTick: number;
  act: string;
}

/** Cheapest (lowest-satiety) eligible labour for the current rung — the focused-optimal pick. */
function cheapestEligible(s: GameState): ActivityId | null {
  const elig = new Set(getRank(s.rung).eligible);
  const o = availableLabours(s)
    .filter((x) => x.available && elig.has(x.activity.id))
    .sort((a, b) => a.activity.satietyCost - b.activity.satietyCost);
  return o.length ? o[0]!.activity.id : null;
}

/**
 * The focused-optimal next intent for the auto-play harness (returns null when stuck/terminal).
 * The SINGLE source of this policy — both `walkPacing` (here) and `playcheck`'s reward trace drive
 * it, so the two can never silently desync. Order: open_eyes > rest-if-starving > rake_rice >
 * face_wolf@R2 > cheapest-eligible labour.
 */
export function focusedOptimalIntent(s: GameState, profile: BalanceProfile): Intent | null {
  const acts = availableActions(s);
  if (acts.includes('open_eyes')) return { type: 'open_eyes' };
  if (s.character.satiety < satietyMax(s) * 0.25 && acts.includes('rest')) return { type: 'rest' };
  if (acts.includes('rake_rice')) return { type: 'rake_rice' };
  if (
    s.rung === 'R2' &&
    !s.flags['first-fight-survived'] &&
    s.rungMeter >= rungThreshold('R2', profile)
  ) {
    return { type: 'face_wolf' };
  }
  const c = cheapestEligible(s);
  if (c && canDoActivity(s, getActivity(c))) return { type: 'do_activity', activityId: c };
  return null;
}

export function walkPacing(profile: BalanceProfile, seed = SEED): RungPacing[] {
  let s = createInitialState(seed, profile);
  const t: Record<string, RungTrack> = {};
  const abs = (): number => s.clock.day * 24 + s.clock.tick;
  const touch = (r: string): RungTrack =>
    (t[r] ??= { acts: 0, rests: 0, meta: 0, startTick: abs(), endTick: abs(), act: '-' });
  let guard = 0;
  while (s.rung !== 'R3' && guard++ < 1_000_000) {
    const cur = touch(s.rung);
    const intent = focusedOptimalIntent(s, profile);
    if (!intent) break;
    s = reduce(s, intent);
    if (intent.type === 'open_eyes' || intent.type === 'face_wolf') cur.meta++;
    else if (intent.type === 'rest') cur.rests++;
    else if (intent.type === 'rake_rice') {
      cur.acts++;
      cur.act = 'rake_rice';
    } else if (intent.type === 'do_activity') {
      cur.acts++;
      cur.act = intent.activityId;
    }
    cur.endTick = abs();
  }

  const rows: RungPacing[] = [];
  for (const rank of RANKS) {
    const c = t[rank.id];
    const threshold = rungThreshold(rank.id, profile);
    const terminal = rank.id === 'R3' && rank.storyGate({}) === false;
    if (!c) {
      rows.push({
        rung: rank.id,
        title: rank.title,
        threshold,
        act: '-',
        acts: 0,
        rests: 0,
        meta: 0,
        intents: 0,
        wallMin: 0,
        inGameDays: 0,
        terminal,
        underFloor: false,
      });
      continue;
    }
    const intents = c.acts + c.rests + c.meta;
    const wallMin = (intents * AUTO_REPEAT_MS) / 1000 / 60;
    rows.push({
      rung: rank.id,
      title: rank.title,
      threshold,
      act: c.act,
      acts: c.acts,
      rests: c.rests,
      meta: c.meta,
      intents,
      wallMin,
      inGameDays: (c.endTick - c.startTick) / 24,
      terminal,
      underFloor: !terminal && wallMin < RUNG_WALL_FLOOR_MIN,
    });
  }
  return rows;
}

// ── CLI: --profile=demo|real (default real), --check (exit 1 if any climb rung under
//    floor on REAL). Guarded so importing this module from a test does NOT run the CLI. ──
const RUN_AS_CLI = process.argv[1]?.includes('pacing-report') ?? false;
if (RUN_AS_CLI) {
  const profileArg = process.argv.find((a) => a.startsWith('--profile='))?.split('=')[1];
  const profile: BalanceProfile =
    profileArg === 'demo' || profileArg === 'real' ? profileArg : 'real';
  const check = process.argv.includes('--check');
  const rows = walkPacing(profile);
  console.log(
    `Pacing report — profile: ${profile}  (floor ≥ ${RUNG_WALL_FLOOR_MIN.toFixed(1)} min/climb-rung)`,
  );
  console.log(
    'rung  title          thr     act            acts   rests  intents  wall(min)  ~days  floor',
  );
  for (const r of rows) {
    const flag = r.terminal ? 'TERMINAL' : r.intents === 0 ? '-' : r.underFloor ? 'UNDER' : 'OK';
    console.log(
      `${r.rung.padEnd(5)} ${r.title.padEnd(14)} ${String(r.threshold).padStart(6)} ${r.act.padEnd(13)} ${String(r.acts).padStart(6)} ${String(r.rests).padStart(6)} ${String(r.intents).padStart(8)} ${r.wallMin.toFixed(2).padStart(9)} ${r.inGameDays.toFixed(0).padStart(6)}  ${flag}`,
    );
  }
  const climb = rows.filter((r) => !r.terminal && r.intents > 0);
  const fails = climb.filter((r) => r.underFloor);
  console.log(
    `SUMMARY: ${climb.length} climb rungs, min ${Math.min(...climb.map((r) => r.wallMin)).toFixed(2)} / max ${Math.max(...climb.map((r) => r.wallMin)).toFixed(2)} min; floor ≥ ${RUNG_WALL_FLOOR_MIN}: ${fails.length ? 'FAIL (' + fails.map((r) => r.rung).join(',') + ')' : 'PASS'}`,
  );
  if (check) {
    if (profile === 'real' && fails.length) process.exit(1);
    process.exit(0);
  }
}
