// Headless time-per-rung pacing report (audit G-PACING). Drives the focused-optimal
// auto-play path per rung on the single shipped profile (ADR-056 — the DEMO/REAL fork is
// retired) using the REAL engine (createInitialState + reduce — NOT a re-derived formula,
// so the "model" cannot drift from the game), converts dispatched intents → modeled
// wall-minutes via the 480ms active-loop cadence, prints a per-rung table, and flags any
// T0 climb rung OUT of the sane T0 band (T0 is ≥30-min-floor-EXEMPT; the floor gates from
// T1). `--check` is the G-PACING gate (in `pnpm run verify` via the pacing:check script).
//
// Model (ADR-148 — timed actions): each intent's wall cost comes from the SAME timing
// table the shell clock runs — timed intents cost durationMs + cooldownMs (move_to per
// edge via from/to); instant intents cost one AUTO_REPEAT_MS heartbeat (the auto loop's
// polling cadence). Modeled wall-time per rung = Σ per-intent cost. Intents = productive
// acts (cheapest eligible activity = focused-optimal) + rests (the auto-loop's
// satiety<25% rule) + per-rung meta verbs. In-game days are flavour; the FLOOR is on
// wall-minutes.
export {};

import {
  createInitialState,
  reduce,
  RANKS,
  balance,
  focusedOptimalIntent,
  rungRequirements,
  intentWallMs,
} from '../core';

const { AUTO_REPEAT_MS, RUNG_WALL_FLOOR_MIN, T0_PACING_BAND_MIN, T0_PACING_BAND_MAX } = balance;
const SEED = 20260626;

export interface RungPacing {
  rung: string;
  title: string;
  /** The rung's authored requirement count (FB-121 — the meter threshold is gone). */
  requirements: number;
  act: string;
  acts: number;
  rests: number;
  meta: number;
  intents: number;
  wallMin: number;
  inGameDays: number;
  terminal: boolean;
  /** T0 (ADR-056): true when a climb rung falls OUTSIDE the sane T0 band (too fast/too slow). */
  outOfBand: boolean;
}

interface RungTrack {
  acts: number;
  rests: number;
  meta: number;
  wallMs: number; // ADR-148 — Σ per-intent timing cost (not a flat cadence)
  startTick: number;
  endTick: number;
  act: string;
}

// The focused-optimal policy (`focusedOptimalIntent`) now lives in core/autoplay.ts — the single
// source both this pacing report and the playcheck reward-trace consume, so they can't desync.

export function walkPacing(seed = SEED): RungPacing[] {
  let s = createInitialState(seed);
  const t: Record<string, RungTrack> = {};
  const abs = (): number => s.clock.day * 24 + s.clock.tick;
  const touch = (r: string): RungTrack =>
    (t[r] ??= {
      acts: 0,
      rests: 0,
      meta: 0,
      wallMs: 0,
      startTick: abs(),
      endTick: abs(),
      act: '-',
    });
  let guard = 0;
  while (s.rung !== 'R3' && guard++ < 1_000_000) {
    const cur = touch(s.rung);
    const intent = focusedOptimalIntent(s);
    if (!intent) break;
    cur.wallMs += intentWallMs(intent, s.location, AUTO_REPEAT_MS); // cost BEFORE the move lands
    s = reduce(s, intent);
    if (intent.type === 'open_eyes') cur.meta++;
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
    const requirements = rungRequirements(rank.id).length;
    // R3 was terminal while its storyGate needed un-simulated combat; the FB-121 harness
    // drives kill-requirements, so terminality is now discovered (walk stops), not declared.
    const terminal = false;
    if (!c) {
      rows.push({
        rung: rank.id,
        title: rank.title,
        requirements,
        act: '-',
        acts: 0,
        rests: 0,
        meta: 0,
        intents: 0,
        wallMin: 0,
        inGameDays: 0,
        terminal,
        outOfBand: false,
      });
      continue;
    }
    const intents = c.acts + c.rests + c.meta;
    const wallMin = c.wallMs / 1000 / 60;
    rows.push({
      rung: rank.id,
      title: rank.title,
      requirements,
      act: c.act,
      acts: c.acts,
      rests: c.rests,
      meta: c.meta,
      intents,
      wallMin,
      inGameDays: (c.endTick - c.startTick) / 24,
      terminal,
      outOfBand: !terminal && (wallMin < T0_PACING_BAND_MIN || wallMin > T0_PACING_BAND_MAX),
    });
  }
  return rows;
}

// ── CLI: (no flag) print the table · --check (exit 1 if any T0 climb rung is OUT OF BAND).
//    ADR-056: ONE profile now — T0 is ≥30-floor-EXEMPT, gated instead on the sane T0 band
//    [T0_PACING_BAND_MIN, T0_PACING_BAND_MAX] = [3, 22] min. Guarded so importing this from a
//    test does NOT run the CLI. ──
// `typeof process` guard: the FB-8 DEV telemetry report imports walkPacing() in the BROWSER
// (the vs-sim column) — a bare `process.argv` there is a boot-time ReferenceError.
const RUN_AS_CLI =
  typeof process !== 'undefined' && (process.argv[1]?.includes('pacing-report') ?? false);
if (RUN_AS_CLI) {
  const check = process.argv.includes('--check');
  const rows = walkPacing();
  console.log(
    `Pacing report — single profile (D-056)  (T0 band ${T0_PACING_BAND_MIN}–${T0_PACING_BAND_MAX} min/climb-rung; ≥${RUNG_WALL_FLOOR_MIN}-floor gates from T1)`,
  );
  console.log(
    'rung  title          thr     act            acts   rests  intents  wall(min)  ~days  band',
  );
  for (const r of rows) {
    const flag = r.terminal ? 'TERMINAL' : r.intents === 0 ? '-' : r.outOfBand ? 'OUT' : 'OK';
    console.log(
      `${r.rung.padEnd(5)} ${r.title.padEnd(14)} ${String(r.requirements).padStart(6)} ${r.act.padEnd(13)} ${String(r.acts).padStart(6)} ${String(r.rests).padStart(6)} ${String(r.intents).padStart(8)} ${r.wallMin.toFixed(2).padStart(9)} ${r.inGameDays.toFixed(0).padStart(6)}  ${flag}`,
    );
  }
  const climb = rows.filter((r) => !r.terminal && r.intents > 0);
  const fails = climb.filter((r) => r.outOfBand);
  console.log(
    `SUMMARY: ${climb.length} climb rungs, min ${Math.min(...climb.map((r) => r.wallMin)).toFixed(2)} / max ${Math.max(...climb.map((r) => r.wallMin)).toFixed(2)} min; T0 band ${T0_PACING_BAND_MIN}–${T0_PACING_BAND_MAX}: ${fails.length ? 'FAIL (' + fails.map((r) => r.rung).join(',') + ')' : 'PASS'}`,
  );
  if (check) process.exit(fails.length ? 1 : 0);
}
