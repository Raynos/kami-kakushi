// Persona-bot balance sim CLI (F4 §5) — drives the REAL engine with the persona roster over the
// gating seed matrix and reports pacing shape. Modes:
//   (no flag)    per-rung pacing table + per-seed summaries (console)
//   --report     regenerate docs/content/t0-pacing.md (gen-docs pattern: committed, diffable)
//   --selftest   the Ph1 DoD asserts (walkPacing R0–R2 equality · determinism · all seeds ascend)
//   --fuzz N     N derived seeds, STRUCTURAL checks only (soft-locks are bugs at any seed);
//                fuzz never gates envelopes. Output → console only.
//   --check      the `verify:balance` gating matrix (F4 §5a): greedy per-rung bands +
//                structural gates for every persona × seed, margins printed beside every
//                band, non-zero exit on any RED.
//   --check-fresh the staleness gate (F4 §5b): recompute the input fingerprint (imports +
//                hash, NO sim run, <1 s) and compare to the committed report's header —
//                fires exactly when a balance VALUE changed without a fresh report.
//   --summary    the paste-into-the-commit-body block (F4 §5b flow step 4): greedy per-rung
//                medians + band verdicts + the delta vs the HEAD-committed report.
export {};

import { writeFileSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  ACTIVITIES,
  ESTATE_STAGES,
  MARKET_ITEMS,
  MOBS,
  RANKS,
  RECIPES,
  WEAPONS,
  balance,
} from '../core';
import { PERSONAS, greedy, skippedIntents, type Persona } from '../sim/personas';
import { runPersona } from '../sim/run';
import type { RunMetrics, RungMetric } from '../sim/metrics';
import { wallMinutes } from '../sim/metrics';
import { SIM_SEEDS, CANONICAL_SEED, fuzzSeeds } from '../sim/seeds';
import { greedyBandVerdicts, structuralVerdict, phase2RatioVerdict } from '../sim/envelopes';
import { walkPacing } from './pacing-report';

const OUT = 'docs/content/t0-pacing.md';

// ── input fingerprint (F4 §5b) — a stable hash of the EVALUATED design inputs the sim consumes:
// values, not file text, so comment/formatting edits never change it. Sorted keys ⇒ stable JSON. ──

function stable(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(stable);
  if (v && typeof v === 'object') {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(v as Record<string, unknown>).sort()) {
      const x = (v as Record<string, unknown>)[k];
      if (typeof x === 'function') continue; // helpers (rungThreshold, riceSellPrice…) — not values
      out[k] = stable(x);
    }
    return out;
  }
  return v;
}

export function inputFingerprint(): string {
  const inputs = stable({
    balance: { ...balance },
    ranks: RANKS.map((r) => ({ id: r.id, threshold: r.meterThreshold, eligible: r.eligible })),
    activities: ACTIVITIES,
    mobs: MOBS,
    weapons: WEAPONS,
    estateStages: ESTATE_STAGES,
    market: MARKET_ITEMS,
    recipes: RECIPES,
  });
  return createHash('sha256').update(JSON.stringify(inputs)).digest('hex').slice(0, 16);
}

const FINGERPRINT_PREFIX = '- Input fingerprint: `';

function reportFingerprint(): string | null {
  let text: string;
  try {
    text = readFileSync(OUT, 'utf-8');
  } catch {
    return null;
  }
  const line = text.split('\n').find((l) => l.startsWith(FINGERPRINT_PREFIX));
  return line ? (line.slice(FINGERPRINT_PREFIX.length).split('`')[0] ?? null) : null;
}

// ── run the matrix ────────────────────────────────────────────────────────────────────────────

interface PersonaRuns {
  persona: Persona;
  runs: RunMetrics[]; // one per SIM_SEEDS entry, in order
}

function runMatrix(): PersonaRuns[] {
  return PERSONAS.map((persona) => ({
    persona,
    runs: SIM_SEEDS.map((seed) => runPersona(persona, seed).metrics),
  }));
}

function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid]! : (s[mid - 1]! + s[mid]!) / 2;
}

function rungRow(runs: RunMetrics[], rung: string): RungMetric[] {
  return runs
    .map((r) => r.rungs.find((x) => x.rung === rung))
    .filter((x): x is RungMetric => x !== undefined);
}

const min1 = (n: number): string => n.toFixed(1);
const r2 = (n: number): string => n.toFixed(2);
const RUNG_ORDER = ['R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7'] as const;

// ── report / table rendering ──────────────────────────────────────────────────────────────────

function personaSection(pr: PersonaRuns): string[] {
  const L: string[] = [];
  const canonical = pr.runs[SIM_SEEDS.indexOf(CANONICAL_SEED)]!;

  L.push(`## ${pr.persona.id} — time-to-rung`);
  L.push('');
  L.push(
    `Wall-minutes per rung: median [min–max] across seeds ${SIM_SEEDS.join(', ')}; ` +
      `acts/rests/moves from the canonical seed ${CANONICAL_SEED}.`,
  );
  L.push('');
  L.push(
    '| rung | threshold | acts | rests | moves | intents | wall-min | across seeds | cum med |',
  );
  L.push('|---|---|---|---|---|---|---|---|---|');
  let cum = 0;
  for (const rung of RUNG_ORDER) {
    const rows = rungRow(pr.runs, rung);
    if (rows.length === 0) continue;
    const c = canonical.rungs.find((x) => x.rung === rung);
    const mins = rows.map((r) => r.wallMin);
    const med = median(mins);
    cum += med;
    L.push(
      `| ${rung} | ${rows[0]!.threshold} | ${c?.acts ?? '—'} | ${c?.rests ?? '—'} | ` +
        `${c?.moves ?? '—'} | ${c?.intents ?? '—'} | ${min1(med)} | ` +
        `[${min1(Math.min(...mins))}–${min1(Math.max(...mins))}] | ${min1(cum)} |`,
    );
  }
  L.push('');

  L.push(`## ${pr.persona.id} — arc + economy (per seed)`);
  L.push('');
  L.push(
    '| seed | ascended | intents | wall-min | Phase-2 min | first-coin min | end coin | end rice | estate |',
  );
  L.push('|---|---|---|---|---|---|---|---|---|');
  for (const r of pr.runs) {
    const p2 = r.economy.phase2Intents;
    const fc = r.economy.firstCoinIntent;
    L.push(
      `| ${r.seed} | ${r.ascended ? '✅' : '❌ ' + (r.softLock?.reason ?? 'no')} | ` +
        `${r.totalIntents} | ${min1(r.totalWallMin)} | ${p2 === null ? '—' : min1(wallMinutes(p2))} | ` +
        `${fc === null ? '—' : min1(wallMinutes(fc))} | ${r.economy.endCoin} | ${r.economy.endRice} | ` +
        `${r.economy.endEstate} |`,
    );
  }
  L.push('');

  L.push(`## ${pr.persona.id} — combat · starvation · durability (per seed)`);
  L.push('');
  L.push(
    '| seed | fights | W/L/R | coin bled | rice bled | satiety-0 | below-knee | battered | max no-progress |',
  );
  L.push('|---|---|---|---|---|---|---|---|---|');
  for (const r of pr.runs) {
    L.push(
      `| ${r.seed} | ${r.combat.fights} | ${r.combat.wins}/${r.combat.losses}/${r.combat.retreats} | ` +
        `${r.combat.lossCoinBled} | ${r.combat.lossRiceBled} | ${r.starvation.zeroSatietyIntents} | ` +
        `${r.starvation.belowKneeIntents} | ${r.durability.batteredIntents} | ` +
        `${r.maxIntentsWithoutProgress} |`,
    );
  }
  L.push('');
  return L;
}

function generateReport(matrix: PersonaRuns[]): string {
  const L: string[] = [];
  L.push('# T0 pacing report (GENERATED)');
  L.push('');
  L.push('> GENERATED by `npm run balance:report` (`src/scripts/balance-sim.ts`) — persona bots');
  L.push('> driving the REAL engine over the gating seed matrix. Do not edit by hand; change');
  L.push('> balance/content and regenerate. `git diff` on this file IS the before/after of a');
  L.push('> balance change (F4 §5b).');
  L.push('');
  L.push(`- Seeds: ${SIM_SEEDS.join(', ')} (canonical: ${CANONICAL_SEED})`);
  L.push(`- Personas: ${PERSONAS.map((p) => p.id).join(', ')}`);
  L.push(`${FINGERPRINT_PREFIX}${inputFingerprint()}\` (the evaluated design inputs —`);
  L.push('  `balance-sim --check-fresh` compares this against the live constants, so a balance');
  L.push(
    '  VALUE change without a regenerated report is caught; comments/formatting never fire it)',
  );
  L.push(
    `- Wall model: one intent per ${balance.AUTO_REPEAT_MS} ms (the active-loop cadence) — ` +
      `wall-min = intents × ${balance.AUTO_REPEAT_MS} / 60000. Every dispatch counts (moves and`,
  );
  L.push('  story beats included), so the model reflects what the auto-loop actually issues.');
  L.push(
    `- T0 climb band (D-056): [${balance.T0_PACING_BAND_MIN}, ${balance.T0_PACING_BAND_MAX}] ` +
      'wall-min per climb rung. Envelope VERDICTS land with `verify:balance` (F4 Ph2);',
  );
  L.push('  this report is the measurement.');
  L.push('');
  for (const pr of matrix) L.push(...personaSection(pr));

  L.push('## Skipped intents (per persona — loud, never a silent gap)');
  L.push('');
  for (const p of PERSONAS) {
    L.push(`- **${p.id}** never issues: ${skippedIntents(p).join(', ')}`);
  }
  L.push('');
  return L.join('\n');
}

// ── self-test (the Ph1 DoD, machine-checkable) ────────────────────────────────────────────────

function selftest(): number {
  let failures = 0;
  const fail = (msg: string): void => {
    failures++;
    console.error(`SELFTEST FAIL: ${msg}`);
  };
  const ok = (msg: string): void => console.log(`selftest ok: ${msg}`);

  // (1) greedy reproduces the KNOWN current pacing: R0–R2 buckets equal walkPacing() exactly
  //     on the canonical seed (same shared policy ⇒ equality, not tolerance).
  const walk = walkPacing(CANONICAL_SEED);
  const sim = runPersona(greedy, CANONICAL_SEED).metrics;
  for (const rung of ['R0', 'R1', 'R2'] as const) {
    const w = walk.find((r) => r.rung === rung)!;
    const s = sim.rungs.find((r) => r.rung === rung);
    if (!s) {
      fail(`${rung}: missing from sim run`);
      continue;
    }
    const walkCompat = s.acts + s.rests + s.meta;
    if (s.acts !== w.acts || s.rests !== w.rests || s.meta !== w.meta || walkCompat !== w.intents) {
      fail(
        `${rung}: sim acts/rests/meta ${s.acts}/${s.rests}/${s.meta} (=${walkCompat}) ≠ ` +
          `walkPacing ${w.acts}/${w.rests}/${w.meta} (=${w.intents})`,
      );
    } else ok(`${rung} equals walkPacing (${w.acts} acts, ${w.rests} rests, ${w.meta} meta)`);
  }

  // (2) determinism: the same seed twice ⇒ byte-identical RunMetrics.
  const again = runPersona(greedy, CANONICAL_SEED).metrics;
  if (JSON.stringify(sim) !== JSON.stringify(again))
    fail('same seed produced different RunMetrics');
  else ok(`deterministic on seed ${CANONICAL_SEED} (${sim.totalIntents} intents)`);

  // (3) the full arc closes on every gating seed (tier 0 → 1, no soft-lock) — cross-checks
  //     t0-arc.test.ts's result through real `fight` intents instead of applyGrindFight.
  for (const seed of SIM_SEEDS) {
    const m = seed === CANONICAL_SEED ? sim : runPersona(greedy, seed).metrics;
    if (!m.ascended || m.softLock) {
      fail(`seed ${seed}: did not ascend (softLock=${JSON.stringify(m.softLock)})`);
    } else ok(`seed ${seed} ascends (${m.totalIntents} intents, ${min1(m.totalWallMin)} min)`);
  }
  return failures;
}

// ── the gating matrix (`verify:balance`) ──────────────────────────────────────────────────────

function check(): number {
  const started = performance.now();
  const matrix = runMatrix();
  let reds = 0;

  // (1) greedy per-rung bands (the per-lever gate), margins printed beside every band.
  const greedyRuns = matrix.find((pr) => pr.persona.id === 'greedy')!.runs;
  console.log(
    `greedy per-rung wall-min vs the T0 band [${balance.T0_PACING_BAND_MIN}, ` +
      `${balance.T0_PACING_BAND_MAX}] (D-056), measured across seeds ${SIM_SEEDS.join(', ')}:`,
  );
  for (const v of greedyBandVerdicts(greedyRuns)) {
    const margin = `margin −${min1(v.measuredMin - v.bandMin)}/+${min1(v.bandMax - v.measuredMax)}`;
    if (v.ok) {
      console.log(
        `  ✓ ${v.rung}: [${min1(v.measuredMin)}–${min1(v.measuredMax)}] in band (${margin})`,
      );
    } else {
      reds++;
      console.error(
        `  ✗ RED ${v.rung}: measured [${min1(v.measuredMin)}–${min1(v.measuredMax)}] min ` +
          `OUTSIDE the band [${v.bandMin}, ${v.bandMax}] — the ${v.rung} lever ` +
          `(rungThreshold) moved outside signed intent; a human decision is required ` +
          `(re-derive the threshold or re-sign the band in balance.ts — never a test-side fudge).`,
      );
    }
  }

  // Phase 2 ≈ Phase 1 (D-133/H19): greedy's phase2/phase1 wall-time ratio vs the signed band.
  const rv = phase2RatioVerdict(greedyRuns);
  const p2 = greedyRuns.map((r) => r.economy.phase2Intents ?? 0);
  const p2min = `[${min1(wallMinutes(Math.min(...p2)))}–${min1(wallMinutes(Math.max(...p2)))}] min`;
  if (rv.built === 0) {
    console.log(`  · Phase-2 ratio: no built Phase-2 economy in the matrix — gate no-op.`);
  } else if (rv.ok) {
    console.log(
      `  ✓ Phase-2 ≈ Phase-1: ratio [${r2(rv.measuredMin)}–${r2(rv.measuredMax)}] in band ` +
        `[${rv.bandMin}, ${rv.bandMax}] (window ${p2min})`,
    );
  } else {
    reds++;
    console.error(
      `  ✗ RED Phase-2 ratio: measured [${r2(rv.measuredMin)}–${r2(rv.measuredMax)}] ` +
        `OUTSIDE the band [${rv.bandMin}, ${rv.bandMax}] (window ${p2min}) — Phase 2's wall-time ` +
        `drifted from ~1:1 with Phase 1 (D-133); a human decision is required (re-tune the ` +
        `Phase-2 economy or re-sign PHASE2_PHASE1_RATIO_* in balance.ts — never a test-side fudge).`,
    );
  }

  // (2) structural gates — every persona × seed: full ladder, ascension, zero soft-locks.
  for (const pr of matrix) {
    for (const m of pr.runs) {
      const s = structuralVerdict(m);
      if (s.ok) {
        console.log(`  ✓ ${s.personaId} seed ${s.seed}: ladder + ascension, no soft-lock`);
      } else {
        reds++;
        console.error(
          `  ✗ RED ${s.personaId} seed ${s.seed}: ascended=${s.ascended} ` +
            `fullLadder=${s.fullLadder} softLock=${JSON.stringify(s.softLock)}`,
        );
      }
    }
  }

  // (3) freshness — the committed report must match the live design inputs.
  const live = inputFingerprint();
  const committed = reportFingerprint();
  if (committed === live) console.log(`  ✓ report fresh (fingerprint ${live})`);
  else {
    reds++;
    console.error(
      `  ✗ RED report stale: ${OUT} header says ${committed ?? '(missing)'}, live inputs ` +
        `hash ${live} — run \`npm run balance:report\` and commit the diff.`,
    );
  }

  const secs = ((performance.now() - started) / 1000).toFixed(1);
  console.log(
    `verify:balance — ${reds ? `${reds} RED` : 'GREEN'} ` +
      `(${PERSONAS.length} persona(s) × ${SIM_SEEDS.length} seeds in ${secs}s)`,
  );
  return reds;
}

// ── --summary: the commit-body block (per-rung medians + deltas vs HEAD + verdicts) ──────────

/** Parse the greedy time-to-rung wall-min medians out of a committed report's markdown. */
function parseReportMedians(text: string): Map<string, number> {
  const out = new Map<string, number>();
  const lines = text.split('\n');
  const start = lines.findIndex((l) => l.startsWith('## greedy — time-to-rung'));
  if (start < 0) return out;
  for (let i = start; i < lines.length && !lines[i + 1]?.startsWith('## greedy — arc'); i++) {
    const m = /^\| (R\d) \| \d+ \|(?:[^|]*\|){4} ([\d.]+) \|/.exec(lines[i] ?? '');
    if (m) out.set(m[1]!, Number(m[2]));
  }
  return out;
}

function summary(): void {
  let before = new Map<string, number>();
  try {
    before = parseReportMedians(
      execFileSync('git', ['show', `HEAD:${OUT}`], { encoding: 'utf-8' }),
    );
  } catch {
    // no committed report to diff against — deltas print as “—”.
  }
  const runs = SIM_SEEDS.map((seed) => runPersona(greedy, seed).metrics);
  console.log('balance-sim --summary (greedy medians vs the HEAD-committed report):');
  console.log('```');
  console.log('rung   wall-min   Δ vs HEAD   band verdict');
  for (const v of greedyBandVerdicts(runs)) {
    const med = median(runs.map((r) => r.rungs.find((x) => x.rung === v.rung)?.wallMin ?? 0));
    const prev = before.get(v.rung);
    const delta = prev === undefined ? '—' : `${med >= prev ? '+' : ''}${(med - prev).toFixed(1)}`;
    console.log(
      `${v.rung.padEnd(6)} ${min1(med).padStart(8)} ${String(delta).padStart(11)}   ` +
        `${v.ok ? 'in' : 'OUT OF'} [${v.bandMin}, ${v.bandMax}]`,
    );
  }
  const p2 = runs.map((r) => r.economy.phase2Intents ?? 0);
  const rv = phase2RatioVerdict(runs);
  console.log(
    `Phase-2 window ${min1(wallMinutes(median(p2)))} min · ratio ` +
      `[${r2(rv.measuredMin)}–${r2(rv.measuredMax)}] ${rv.ok ? 'in' : 'OUT OF'} ` +
      `[${rv.bandMin}, ${rv.bandMax}] (D-133); fingerprint ${inputFingerprint()}`,
  );
  console.log('```');
}

// ── CLI ───────────────────────────────────────────────────────────────────────────────────────

const RUN_AS_CLI = process.argv[1]?.includes('balance-sim') ?? false;
if (RUN_AS_CLI) {
  const args = process.argv.slice(2);
  if (args.includes('--check-fresh')) {
    const live = inputFingerprint();
    const committed = reportFingerprint();
    if (committed === live) {
      console.log(`balance report fresh (fingerprint ${live})`);
      process.exit(0);
    }
    console.error(
      `balance report STALE: ${OUT} header says ${committed ?? '(missing)'}, live design ` +
        `inputs hash ${live}. Run \`npm run balance:report\`, eyeball the diff (it IS the ` +
        'before/after), and commit it with the balance change.',
    );
    process.exit(1);
  } else if (args.includes('--check')) {
    process.exit(check() ? 1 : 0);
  } else if (args.includes('--summary')) {
    summary();
  } else if (args.includes('--selftest')) {
    const failures = selftest();
    process.exit(failures ? 1 : 0);
  } else if (args.includes('--fuzz')) {
    const n = Number(args[args.indexOf('--fuzz') + 1] ?? 10);
    const seeds = fuzzSeeds(CANONICAL_SEED, n);
    let broken = 0;
    for (const seed of seeds) {
      const m = runPersona(greedy, seed).metrics;
      const flag = m.ascended && !m.softLock ? 'ok' : 'STRUCTURAL RED';
      if (flag !== 'ok') broken++;
      console.log(
        `fuzz seed ${String(seed).padStart(10)}: ${flag} — ${m.totalIntents} intents, ` +
          `${min1(m.totalWallMin)} min, ${m.combat.wins}/${m.combat.losses}/${m.combat.retreats} W/L/R`,
      );
    }
    console.log(`FUZZ: ${seeds.length} seeds, ${broken} structural break(s)`);
    process.exit(broken ? 1 : 0);
  } else if (args.includes('--report')) {
    const started = performance.now();
    const matrix = runMatrix();
    writeFileSync(OUT, generateReport(matrix));
    console.log(
      `wrote ${OUT} (${PERSONAS.length} persona(s) × ${SIM_SEEDS.length} seeds in ` +
        `${((performance.now() - started) / 1000).toFixed(1)}s)`,
    );
  } else {
    // console table — the quick look (the report is the committed artifact).
    const matrix = runMatrix();
    for (const pr of matrix) {
      console.log(generateReport([pr]));
    }
  }
}
