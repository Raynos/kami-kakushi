// verify-doc-budgets — snapshot-class docs hold their hard line caps (ADR-126).
//
// A hard budget turns "append" into "displace": to add a line, cull a weaker
// one, so the doc sharpens instead of growing (project-status.md once bloated
// to 326 lines under a cap-less norm). The caps live ONLY here — the pre-commit
// snapshot gate's own count check was absorbed into this table. Runs as a
// docs-lane verify gate (see verify-run.ts), so it fires at commit (including
// SKIP_CODE_VERIFY docs-only commits), push, and CI; pre-commit also invokes it
// standalone under a full SKIP_VERIFY=1 so the caps can't be dodged there.
//
// WARN-only genre tripwire: a `(session-NN)` reference inside taste/ui-design,
// or a "Phase update" bullet in the status snapshot, is the journal genre
// leaking into a replace-in-place doc — loud, never blocking (AC-11).
export {};

import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

// `warn` (optional) is the SOFT line — an early "start displacing" nudge,
// loud but never blocking (same two-tier shape as the 5s drift timer vs
// verify:budget). The hard `cap` raises only via a human-reviewed edit here;
// SKIP_DOCBUDGET=1 stays the same-day escape while that edit is discussed.
const BUDGETS: ReadonlyArray<{
  path: string;
  cap: number;
  warn?: number;
  genreLeak: RegExp;
}> = [
  // taste.md + project-status.md live PINNED at their caps by design (the cap
  // IS the displacement pressure) — a soft warn there would fire on every run
  // forever, teaching deafness (AC-11). Warns go only where headroom is the norm.
  { path: 'docs/living/taste.md', cap: 150, genreLeak: /\(session-\d+\)/ },
  {
    path: 'docs/living/ui-design.md',
    cap: 400,
    warn: 360,
    genreLeak: /\(session-\d+\)/,
  },
  {
    path: 'project/status/project-status.md',
    cap: 120,
    genreLeak: /^\s*-\s+\*\*Phase update/m,
  },
  // The ALWAYS-LOADED layer (context-hardening P4c4, thresholds re-set with
  // the human 2026-07-06): AGENTS.md + repo-map.md are injected into every
  // session's context, so growth there taxes every turn of every agent —
  // but the hard cap is deliberately generous (a co-agent adding a bullet
  // mid-flight must never hit a wall); the warn is the working pressure.
  { path: 'AGENTS.md', cap: 500, warn: 420, genreLeak: /\(session-\d+\)/ },
  {
    path: 'docs/repo-map.md',
    cap: 250,
    warn: 220,
    genreLeak: /\(session-\d+\)/,
  },
];

let red = false;
for (const { path, cap, warn, genreLeak } of BUDGETS) {
  if (!existsSync(path)) {
    console.error(`  X doc-budgets: budgeted doc missing: ${path}`);
    red = true;
    continue;
  }
  const text = readFileSync(path, 'utf-8');
  const lines = text.split('\n').length - (text.endsWith('\n') ? 1 : 0);
  if (lines > cap) {
    console.error(
      `  X doc-budgets: ${path} is ${lines} lines — over its ${cap}-line cap.`,
    );
    console.error(
      '    SNAPSHOT-CLASS doc (ADR-126): replace in place — to add a line, displace a weaker',
    );
    console.error(
      '    one. Cull, do not bypass (SKIP_DOCBUDGET=1 is a human-blessed cap raise only).',
    );
    red = true;
  } else if (warn !== undefined && lines > warn) {
    console.log(
      `  ~ doc-budgets WARN: ${path} is ${lines} lines — past its ${warn}-line soft line (hard cap ${cap}). Start displacing.`,
    );
  }
  if (genreLeak.test(text)) {
    console.log(
      `  ~ doc-budgets WARN: ${path} carries a journal-genre marker — per-session history belongs in project/journal/.`,
    );
  }
}
// ── rewrite-debt counter (human, 2026-07-09) ────────────────────────────────
// project-status.md is snapshot-class and gets lossily COMPRESSED to fit its
// cap; repeated compression degrades it invisibly (this session compressed it
// ~5× before the counter existed). So EVERY edit must bump a debt counter — "any
// edit that doesn't bump the number is a scam" — and at the threshold the doc is
// REWRITTEN fresh (debt → 0), restoring the clarity compression eroded. This is
// git-aware: it compares the working tree to HEAD, so it only requires a bump
// when the HAND-WRITTEN body changed — a mechanical gen-region regen is exempt
// (see below). The counter is one comment line in the doc.
const RD_PATH = 'project/status/project-status.md';
const RD_THRESHOLD = 20;
const parseDebt = (s: string): { n: number; max: number } | null => {
  const m = /rewrite-debt:\s*(\d+)\s*\/\s*(\d+)/.exec(s);
  return m ? { n: Number(m[1]), max: Number(m[2]) } : null;
};
if (existsSync(RD_PATH)) {
  const cur = readFileSync(RD_PATH, 'utf-8');
  const curDebt = parseDebt(cur);
  if (!curDebt) {
    console.error(
      `  X doc-budgets: ${RD_PATH} is missing its rewrite-debt counter.`,
    );
    console.error(
      `    Add a last line: <!-- rewrite-debt: N/${RD_THRESHOLD} · last full rewrite: YYYY-MM-DD -->`,
    );
    red = true;
  } else {
    // A bump is required ONLY when the doc's HAND-WRITTEN body changed. A mechanical
    // `checkpoint` gen-region regen (the journal pointer, the gate roster) is NOT a
    // "compression" and must not demand a bump — else every journal-adding session
    // cries wolf (AC-11). So compare with the `gen:begin…gen:end` blocks STRIPPED. No
    // HEAD blob (new file / detached bootstrap) skips the check gracefully.
    const stripGen = (s: string): string =>
      s.replace(/<!-- gen:begin[\s\S]*?gen:end[^>]*-->/g, '');
    let head = '';
    try {
      head = execFileSync('git', ['show', `HEAD:${RD_PATH}`], {
        encoding: 'utf-8',
      });
    } catch {
      head = '';
    }
    const headDebt = head ? parseDebt(head) : null;
    // The sanctioned reset: a FULL rewrite sets the counter to 0 AND advances
    // the `last full rewrite:` date — that pair is what the threshold WARN
    // instructs, so it must pass (the plain monotonic check would block the
    // very reset it demands). A 0 without a new date is still a scam.
    const parseRewriteDate = (s: string): string | null =>
      /last full rewrite:\s*(\d{4}-\d{2}-\d{2})/.exec(s)?.[1] ?? null;
    const isFullRewrite =
      curDebt.n === 0 &&
      parseRewriteDate(cur) !== null &&
      parseRewriteDate(cur) !== parseRewriteDate(head);
    if (
      head &&
      headDebt &&
      stripGen(cur) !== stripGen(head) &&
      curDebt.n <= headDebt.n &&
      !isFullRewrite
    ) {
      console.error(
        `  X doc-budgets: ${RD_PATH} body changed but rewrite-debt did not rise (${headDebt.n} → ${curDebt.n}).`,
      );
      console.error(
        `    Snapshot-class doc: EVERY hand edit must bump the counter (human 2026-07-09) — a` +
          ` gen-region regen is exempt. Set it to ${headDebt.n + 1}/${curDebt.max}.`,
      );
      red = true;
    }
    if (curDebt.n >= RD_THRESHOLD) {
      console.log(
        `  ~ doc-budgets WARN: ${RD_PATH} rewrite-debt ${curDebt.n}/${curDebt.max} — time to REWRITE it as a fresh living doc (restore the clarity lost to repeated compression) and reset to 0/${curDebt.max}.`,
      );
    }
  }
}

if (red) process.exit(1);
console.log(
  `  ✓ doc-budgets: ${BUDGETS.length} snapshot docs within their caps.`,
);
