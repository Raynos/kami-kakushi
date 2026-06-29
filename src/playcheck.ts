// playcheck — the fun-factor §3 vector, asserted headlessly (op-model v2 FINAL, Workstream D).
//
// Scoped per the v2-lite reel-back: RATCHET mode, the few proxies that are pure wiring over the
// REAL engine (createInitialState → reduce). It deliberately does NOT re-gate what's already
// gated elsewhere — `minutesPerRung` is owned by `pacing:check` and the combat win-curve by
// `m2.test` (both already in `npm run verify`). playcheck's JOB is the two §3 proxies that
// NOTHING else measures — the first-action HOOK and DEAD-TIME — plus presenting the whole §3
// vector in one place as a dashboard.
//
//   firstActionMs   §3 "first-5-min hook"   — wall-ms (intents × AUTO_REPEAT_MS) to the first reward
//   maxDeadTimeMs   §3 "no dead time"       — longest run of reward-less intents, in wall-ms
//   combatWinCurve  §3 "combat band"        — monkey win-rate L1..L5 (DISPLAY; gated by m2.test)
//   minutesPerRung  §3 "≥30-min floor"      — via walkPacing() (DISPLAY; gated by pacing:check)
//
// CLI:  (no flag) print the vector · --check ratchet-gate the two owned proxies vs the baseline
//       · --bless (re)write playcheck.baseline.json from the current engine.
// The baseline rises deliberately (--bless) at a green slice-ship; a silent regression is RED.
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
  foeForecasts,
  balance,
  type GameState,
  type BalanceProfile,
  type ActivityId,
  type Intent,
} from './core';
import { walkPacing } from './scripts/pacing-report';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const { AUTO_REPEAT_MS, rungThreshold } = balance;
const SEED = 20260626;
const FIRST_ACTION_CAP_MS = 5000; // §3 absolute: first reward inside 5s
const RATCHET_SLACK = 1.5; // a proxy may not regress to >1.5× its blessed value
const DEAD_TIME_FLOOR_MS = 3000; // below this, dead-time is never a problem (don't trip on noise)
const CURVE_LEVELS = [1, 2, 3, 4, 5];

export interface ProxyVector {
  firstActionMs: number;
  maxDeadTimeMs: number;
  combatWinCurve: number[];
  minutesPerRung: Record<string, number>;
}

export interface Baseline {
  seed: number;
  firstActionMs: number;
  maxDeadTimeMs: number;
  combatWinCurve: number[];
  minutesPerRung: Record<string, number>;
}

const baselineUrl = new URL('../playcheck.baseline.json', import.meta.url);

/** Cheapest eligible labour for the current rung — focused-optimal (mirrors pacing-report). */
function cheapestEligible(s: GameState): ActivityId | null {
  const elig = new Set(getRank(s.rung).eligible);
  const o = availableLabours(s)
    .filter((x) => x.available && elig.has(x.activity.id))
    .sort((a, b) => a.activity.satietyCost - b.activity.satietyCost);
  return o.length ? o[0]!.activity.id : null;
}

/** The focused-optimal next intent (the SAME policy walkPacing drives). */
function nextIntent(s: GameState, profile: BalanceProfile): Intent | null {
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

/** A state at combat level `lvl`, full satiety — the seed-robust win-curve probe (mirrors m2.test mc()). */
function mcAtLevel(lvl: number): GameState {
  const s = createInitialState(1);
  return { ...s, character: { ...s.character, level: lvl, satiety: 100 } };
}

/** Trace the cold-open → play loop, recording whether each intent produced a reward. */
function rewardTrace(profile: BalanceProfile, seed = SEED): boolean[] {
  let s = createInitialState(seed, profile);
  const rewarded: boolean[] = [];
  let guard = 0;
  while (s.rung !== 'R3' && guard++ < 1_000_000) {
    const intent = nextIntent(s, profile);
    if (!intent) break;
    const koku = s.resources.koku ?? 0;
    const meter = s.rungMeter;
    const reveals = s.unlocked.length;
    s = reduce(s, intent);
    rewarded.push(
      (s.resources.koku ?? 0) > koku || s.rungMeter > meter || s.unlocked.length > reveals,
    );
  }
  return rewarded;
}

export function computeProxies(profile: BalanceProfile = 'real', seed = SEED): ProxyVector {
  const rewarded = rewardTrace(profile, seed);

  const firstIdx = rewarded.indexOf(true);
  const firstActionMs = firstIdx < 0 ? Infinity : (firstIdx + 1) * AUTO_REPEAT_MS;

  let maxGap = 0;
  let gap = 0;
  for (const r of rewarded) {
    if (r) gap = 0;
    else maxGap = Math.max(maxGap, ++gap);
  }
  const maxDeadTimeMs = maxGap * AUTO_REPEAT_MS;

  const combatWinCurve = CURVE_LEVELS.map(
    (l) => foeForecasts(mcAtLevel(l)).find((f) => f.mob.id === 'monkey')?.winRate ?? 0,
  );

  const minutesPerRung: Record<string, number> = {};
  for (const r of walkPacing(profile, seed)) {
    if (!r.terminal && r.intents > 0) minutesPerRung[r.rung] = Number(r.wallMin.toFixed(2));
  }

  return { firstActionMs, maxDeadTimeMs, combatWinCurve, minutesPerRung };
}

const sec = (ms: number): string => (ms === Infinity ? '∞' : `${(ms / 1000).toFixed(2)}s`);

/** The gate: returns the list of failure messages (empty = pass). Pure → unit-testable (teeth). */
export function evaluate(v: ProxyVector, base: Baseline): string[] {
  const fails: string[] = [];

  // firstActionMs: the §3 absolute cap is the gate (first reward must land inside 5s).
  if (v.firstActionMs > FIRST_ACTION_CAP_MS) {
    fails.push(`firstActionMs ${sec(v.firstActionMs)} > ${sec(FIRST_ACTION_CAP_MS)} cap (§3 hook)`);
  }

  // maxDeadTimeMs: ratchet against the blessed value, but never trip below an absolute floor
  // (a sub-3s reward gap is never a fun problem — don't fail on integer-intent noise).
  const deadLimit = Math.max(base.maxDeadTimeMs * RATCHET_SLACK, DEAD_TIME_FLOOR_MS);
  if (v.maxDeadTimeMs > deadLimit) {
    fails.push(
      `maxDeadTimeMs ${sec(v.maxDeadTimeMs)} > limit ${sec(deadLimit)} (max of ${RATCHET_SLACK}× baseline ${sec(base.maxDeadTimeMs)}, ${sec(DEAD_TIME_FLOOR_MS)} floor)`,
    );
  }

  return fails;
}

// ── CLI ──
const RUN_AS_CLI = process.argv[1]?.includes('playcheck') ?? false;
if (RUN_AS_CLI) {
  const check = process.argv.includes('--check');
  const bless = process.argv.includes('--bless');
  const v = computeProxies('real');
  const curve = v.combatWinCurve.map((r) => r.toFixed(2)).join('/');

  console.log('playcheck — fun-factor §3 vector (profile: real)');
  console.log(
    `  firstActionMs : ${sec(v.firstActionMs)}   (§3 hook; cap ${sec(FIRST_ACTION_CAP_MS)})  [OWNED]`,
  );
  console.log(
    `  maxDeadTimeMs : ${sec(v.maxDeadTimeMs)}   (§3 no-dead-time; ratchet)               [OWNED]`,
  );
  console.log(`  combatWinCurve: ${curve}   (monkey L1..5; gated by m2.test)`);
  console.log(
    `  minutesPerRung: ${Object.entries(v.minutesPerRung)
      .map(([k, m]) => `${k}=${m}`)
      .join(' ')}   (gated by pacing:check)`,
  );

  if (bless) {
    const baseline: Baseline = { seed: SEED, ...v };
    writeFileSync(fileURLToPath(baselineUrl), JSON.stringify(baseline, null, 2) + '\n');
    console.log('\n  blessed -> playcheck.baseline.json');
    process.exit(0);
  }

  if (check) {
    let base: Baseline;
    try {
      base = JSON.parse(readFileSync(fileURLToPath(baselineUrl), 'utf8')) as Baseline;
    } catch {
      console.error('\n  X no playcheck.baseline.json — run `npm run playcheck -- --bless` first.');
      process.exit(2);
    }
    const fails = evaluate(v, base);

    if (fails.length) {
      console.error('\n  X playcheck FAILED (the build got less fun):');
      for (const f of fails) console.error(`    - ${f}`);
      console.error(
        '  If this is an intentional, accepted change, re-bless: npm run playcheck -- --bless',
      );
      process.exit(1);
    }
    console.log('\n  OK — owned proxies within ratchet.');
    process.exit(0);
  }
}
