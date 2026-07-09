// playcheck — the fun-factor §3 vector, asserted headlessly (op-model v2 FINAL, Workstream D).
//
// Scoped per the v2-lite reel-back: RATCHET mode, the few proxies that are pure wiring over the
// REAL engine (createInitialState → reduce). It deliberately does NOT re-gate what's already
// gated elsewhere — `minutesPerRung` is owned by `pacing:check` and the combat win-curve by
// `m2.test` (both already in `pnpm run verify`). playcheck's JOB is the two §3 proxies that
// NOTHING else measures — the first-action HOOK and DEAD-TIME — plus presenting the whole §3
// vector in one place as a dashboard.
//
//   firstActionMs   §3 "first-5-min hook"   — wall-ms (intents × AUTO_REPEAT_MS) to the first reward
//   maxDeadTimeMs   §3 "no dead time"       — longest run of reward-less intents, in wall-ms
//   combatWinCurve  §3 "combat band"        — monkey win-rate L1..L5 (DISPLAY; gated by m2.test)
//   minutesPerRung  §3 pacing               — via walkPacing() (DISPLAY; gated by pacing:check —
//                                              T0 band [3,22] min, D-056; the ≥30 floor binds from T1)
//
// CLI:  (no flag) print the vector · --check ratchet-gate the two owned proxies vs the baseline
//       · --bless (re)write playcheck.baseline.json from the current engine.
// The baseline rises deliberately (--bless) at a green slice-ship; a silent regression is RED.
export {};

import {
  createInitialState,
  reduce,
  foeForecasts,
  focusedOptimalIntent,
  balance,
  type GameState,
  rungProgress,
} from './core';
import { walkPacing } from './scripts/pacing-report';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const { AUTO_REPEAT_MS } = balance;
const SEED = 20260626;
const FIRST_ACTION_CAP_MS = 5000; // §3 absolute hard cap: first reward must land inside 5s
const RATCHET_MULT = 3; // a proxy regressing past 3× its blessed value is RED…
const RATCHET_FLOOR_MS = 2000; // …but never below this absolute floor (don't trip on integer-intent noise)
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

const baselineUrl = new URL('./playcheck.baseline.json', import.meta.url);

/** A state at combat level `lvl`, full satiety — the seed-robust win-curve probe (mirrors m2.test mc()). */
function mcAtLevel(lvl: number): GameState {
  const s = createInitialState(1);
  return { ...s, character: { ...s.character, level: lvl, satiety: 100 } };
}

/**
 * Trace the cold-open → play loop (driving the SHARED focused-optimal policy), recording whether
 * each intent produced a reward. A "reward" = any visible forward beat: wealth up (rice or coin),
 * rung-meter up, a new reveal, or a level-up. (If a future content type rewards in another
 * currency, extend here.)
 */
function rewardTrace(seed = SEED): boolean[] {
  let s = createInitialState(seed);
  const rewarded: boolean[] = [];
  let guard = 0;
  // A forward beat is ANY carried pile growing — rice/coin (D-107) AND wood/sansai: every
  // labour act's +N is a visible reward line the player watches land (FB-121 made long
  // woodcut/forage stretches part of the required climb, so the proxy must see them too —
  // counting only rice+coin read a 450-woodcut requirement as 20s of "dead" time that the
  // player actually experiences as +3 wood every act).
  const wealth = (st: typeof s): number =>
    (st.resources.rice ?? 0) +
    (st.resources.coin ?? 0) +
    (st.resources.wood ?? 0) +
    (st.resources.sansai ?? 0);
  while (s.rung !== 'R3' && guard++ < 1_000_000) {
    const intent = focusedOptimalIntent(s);
    if (!intent) break;
    const w = wealth(s);
    const pct = rungProgress(s).percent;
    const reveals = s.unlocked.length;
    const level = s.character.level;
    s = reduce(s, intent);
    rewarded.push(
      wealth(s) > w ||
        rungProgress(s).percent > pct ||
        s.unlocked.length > reveals ||
        s.character.level > level,
    );
  }
  return rewarded;
}

export function computeProxies(seed = SEED): ProxyVector {
  const rewarded = rewardTrace(seed);

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
  for (const r of walkPacing(seed)) {
    if (!r.terminal && r.intents > 0) minutesPerRung[r.rung] = Number(r.wallMin.toFixed(2));
  }

  return { firstActionMs, maxDeadTimeMs, combatWinCurve, minutesPerRung };
}

const sec = (ms: number): string => (ms === Infinity ? '∞' : `${(ms / 1000).toFixed(2)}s`);

/** The gate: returns the list of failure messages (empty = pass). Pure → unit-testable (teeth). */
export function evaluate(v: ProxyVector, base: Baseline): string[] {
  const fails: string[] = [];

  // The ratchet limit for a "lower-is-better" proxy: regress past RATCHET_MULT× the blessed value
  // and it's RED — but never trip below an absolute floor (so tiny baselines don't fail on noise).
  const ratchetLimit = (blessed: number): number =>
    Math.max(blessed * RATCHET_MULT, RATCHET_FLOOR_MS);

  // firstActionMs: the §3 hard cap (first reward inside 5s) AND a ratchet vs the blessed hook.
  if (v.firstActionMs > FIRST_ACTION_CAP_MS) {
    fails.push(`firstActionMs ${sec(v.firstActionMs)} > ${sec(FIRST_ACTION_CAP_MS)} §3 hard cap`);
  } else if (v.firstActionMs > ratchetLimit(base.firstActionMs)) {
    fails.push(
      `firstActionMs ${sec(v.firstActionMs)} > ${sec(ratchetLimit(base.firstActionMs))} ratchet (${RATCHET_MULT}× baseline ${sec(base.firstActionMs)}, floor ${sec(RATCHET_FLOOR_MS)})`,
    );
  }

  // maxDeadTimeMs: ratchet vs the blessed longest reward-gap (lower is better).
  if (v.maxDeadTimeMs > ratchetLimit(base.maxDeadTimeMs)) {
    fails.push(
      `maxDeadTimeMs ${sec(v.maxDeadTimeMs)} > ${sec(ratchetLimit(base.maxDeadTimeMs))} ratchet (${RATCHET_MULT}× baseline ${sec(base.maxDeadTimeMs)}, floor ${sec(RATCHET_FLOOR_MS)})`,
    );
  }

  return fails;
}

// ── CLI ──
const RUN_AS_CLI = process.argv[1]?.includes('playcheck') ?? false;
if (RUN_AS_CLI) {
  const check = process.argv.includes('--check');
  const bless = process.argv.includes('--bless');
  const v = computeProxies();
  const curve = v.combatWinCurve.map((r) => r.toFixed(2)).join('/');

  console.log('playcheck — fun-factor §3 vector (single profile, D-056)');
  console.log(
    `  firstActionMs : ${sec(v.firstActionMs)}   (§3 hook; ${sec(FIRST_ACTION_CAP_MS)} cap + ${RATCHET_MULT}× ratchet)  [OWNED]`,
  );
  console.log(
    `  maxDeadTimeMs : ${sec(v.maxDeadTimeMs)}   (§3 no-dead-time; ${RATCHET_MULT}× ratchet)            [OWNED]`,
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
      console.error(
        '\n  X no playcheck.baseline.json — run `pnpm run playcheck -- --bless` first.',
      );
      process.exit(2);
    }
    // Guard against a stale baseline: a different blessing seed means the proxies aren't comparable.
    if (base.seed !== SEED) {
      console.error(
        `\n  X baseline seed ${base.seed} != current ${SEED} — re-bless: pnpm run playcheck -- --bless`,
      );
      process.exit(2);
    }
    const fails = evaluate(v, base);

    if (fails.length) {
      console.error('\n  X playcheck FAILED (the build got less fun):');
      for (const f of fails) console.error(`    - ${f}`);
      console.error(
        '  If this is an intentional, accepted change, re-bless: pnpm run playcheck -- --bless',
      );
      process.exit(1);
    }
    console.log('\n  OK — owned proxies within ratchet.');
    process.exit(0);
  }
}
