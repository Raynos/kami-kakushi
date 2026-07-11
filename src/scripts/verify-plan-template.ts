// verify-plan-template — the anti-lazy-plan gate (2026-07-11 plan audit).
//
// Every brand-NEW docs/plans/**/*.md must declare a template class and carry
// that class's mandatory sections, each non-trivially filled. The audit of all
// 78 historical plans found the failure mode of weak plans was *absent
// sections* (no grounding, no verification, no sync-ripple map) — exactly what
// a heading-level check CAN soundly hold, so it gates (AC-11: block only what
// can't cry wolf). Whether the grounding is TRUE and the tests RED-able stays
// a norm (PH2/PH3) — a regex can't judge that.
//
// Canon: docs/guides/plan-authoring.md (the three templates). The REQUIRED
// table below is the single source of the mandatory-section matrix; the guide
// describes it.
//
// Modes:
//   tsx verify-plan-template.ts <file...>         validate specific files (exit 1 on fail)
//   tsx verify-plan-template.ts --staged          validate staged ADDED docs/plans files
//   tsx verify-plan-template.ts --backtest        score the whole corpus (report, exit 0)
//   tsx verify-plan-template.ts --scaffold <cls>  print a compliant skeleton to stdout
//   tsx verify-plan-template.ts --scaffold-write  regenerate docs/plans/templates/*.md
//
// Invoked by .githooks/pre-commit (HARD block on new plans; escape:
// SKIP_PLAN_TEMPLATE=1). Not a verify gate: it is staged-set-aware, which only
// the hook rung can be — and archived/existing plans are grandfathered by
// construction (--diff-filter=A never re-fires on a graduation git mv).

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { parseStatusToken, CLOSED_TOKENS } from './checkpoint';

export type PlanClass = 'build' | 'process' | 'ops';

// ── section vocabulary ─────────────────────────────────────────────────────
// Alias regexes run against NORMALIZED heading text (lowercased, glyphs and
// markdown formatting stripped). Generous on purpose: the corpus writes
// "## Why", "## The problem", "## 0 · Problem & shape" for the same section.
const SECTIONS: Record<string, RegExp> = {
  routing: /who builds this/,
  why: /\b(why|problem|goal|diagnosis|premise|direction)\b/,
  grounding:
    /(what exists|context|current[- ]state|what to reuse|exists to reuse|what the build is|the locked design|what this is)/,
  steps:
    /\b(steps?|phases?|milestones?|implementation|execution|build order|the build|workstreams?|procedure|sequencing)\b/,
  verification:
    /(verification|definition of done|\bdod\b|done[- ]?when|acceptance|landing checklist|\btests?\b|verify)/,
  sync: /\b(sync|ripple)\b/,
  syncPrd: /\bprd\b/,
  syncBible: /story[- ]?bible/,
  hitl: /(open question|human|hitl|\bforks?\b|for the human)/,
  scope: /(non[- ]goals?|out of scope|\bscope\b|not in this plan|stays out|deferred|dropped)/,
  risks: /(risks?|landmines|caveats|what could make this wrong)/,
  teeth: /\bteeth\b/,
  rollback: /(rollback|escape hatch)/,
  goConditions: /(go conditions?|preconditions?|go[- ]?\/?no[- ]?go)/,
  aftermath: /(aftermath|follow[- ]?through|close[- ]?out|cleanup|migration)/,
};

// The mandatory matrix per class. `warn` items nag but never block.
export const REQUIRED: Record<PlanClass, { hard: string[]; warn: string[] }> = {
  build: {
    hard: [
      'routing',
      'why',
      'grounding',
      'steps',
      'verification',
      'sync',
      'hitl',
      'scope',
      'risks',
    ],
    warn: [],
  },
  process: {
    hard: [
      'routing',
      'why',
      'grounding',
      'steps',
      'verification',
      'sync',
      'teeth',
      'hitl',
      'scope',
      'risks',
    ],
    warn: ['rollback'],
  },
  ops: {
    hard: ['why', 'goConditions', 'steps', 'verification', 'sync', 'aftermath', 'risks'],
    warn: ['routing'],
  },
};

// Human-readable names for gate output (what to ADD when a check fails).
const SECTION_LABEL: Record<string, string> = {
  routing: '## Who builds this — Fable or Opus?',
  why: '## Why (the problem, cited: FB-/ADR-/HR-/HD-)',
  grounding: '## What exists today (source-verified paths/commits)',
  steps: '## Steps (sequenced, ≥3, each committable)',
  verification: '## Verification (checks that could go RED, named)',
  sync: '## Sync ripple (PRD · story-bible · living docs · CHANGELOG)',
  hitl: '## Human-in-the-loop (HR/HD items; open questions WITH defaults)',
  scope: '## Non-goals',
  risks: '## Risks',
  teeth: '## Teeth (which rung holds it + the RED-ability proof)',
  rollback: '## Rollback',
  goConditions: '## Go conditions (blocking preconditions)',
  aftermath: '## Aftermath (cleanup, comms, re-sync)',
};

// ── scaffold source (docs/plans/templates/ is GENERATED from these) ────────
// Clean canonical headings per section (each MUST match its own alias regex —
// the scaffold-sync vitest case proves it), with per-class overrides where a
// class reads better ("Goal"/"Procedure" for ops).
const SECTION_HEADING: Record<string, string> = {
  routing: 'Who builds this — Fable or Opus?',
  why: 'Why',
  grounding: 'What exists today',
  steps: 'Steps',
  verification: 'Verification',
  sync: 'Sync ripple',
  hitl: 'Human-in-the-loop',
  scope: 'Non-goals',
  risks: 'Risks',
  teeth: 'Teeth',
  rollback: 'Rollback',
  goConditions: 'Go conditions',
  aftermath: 'Aftermath',
};
const HEADING_OVERRIDE: Partial<Record<PlanClass, Record<string, string>>> = {
  ops: { why: 'Goal', steps: 'Procedure' },
};

// Guidance lives in HTML comments so an UNFILLED scaffold reads as EMPTY to
// the gate (stripNoise drops comments) — committing a skeleton fails loudly.
const SECTION_GUIDE: Record<string, string> = {
  routing:
    'Per-phase: where does judgment concentrate (taste, fiction, look) vs\n' +
    'mechanical execution? Doubt favors Fable.',
  why:
    "The problem in the player's / project's terms. Cite the record: FB-nn,\n" +
    'ADR-nnn, HR/HD items, human quotes with dates.',
  grounding:
    'Verify, do not trust (PH2): the current build, SOURCE-VERIFIED THIS\n' +
    'session — file paths, commit hashes, what is reusable, what this\n' +
    'replaces. State the survey DATE (grounding rots). Cited paths must\n' +
    'exist — the gate warns on any that do not.',
  steps:
    'Sequenced, file-level, >=3 steps, each independently committable +\n' +
    'verify-green. Name the ordering rationale where it matters.',
  verification:
    'Done is earned (PH3): checks that could go RED, named — which unit\n' +
    'test / e2e / sim envelope / golden pin. Build plans: also the\n' +
    'player-reach proof (PH6) — a capture, fixture, or live drive.',
  sync:
    'What ELSE moves — one line each, concrete edit or "none — <reason>":\n' +
    '- **PRD:** <section + edit, via /prd-ripple> | none — <reason>\n' +
    '- **Story-bible:** <section / tier sheet> | none — <reason>\n' +
    '- **Living docs / registries:** <roadmap, gen:narrative, fixtures,\n' +
    '  t0-pacing (ADR-132 if balance moves)> | none — <reason>\n' +
    '- **CHANGELOG:** <if a version bump ships this> | none',
  hitl:
    'Bias to motion (PH4): HR/HD items this files or closes; open questions\n' +
    'WITH proposed defaults (never blocking); taste-scorecard Pass 1/2 for\n' +
    'UI surfaces; diverge obligations (ADR-075 / ADR-139) named.',
  scope:
    'What this plan deliberately does NOT do — parked, deferred, or\nrejected, each with a pointer if it lives on.',
  risks:
    'Landmines, migration hazards, rollback story — and the SEAM: which\n' +
    'files this plan owns vs what in-flight plans / co-agents on this\n' +
    'shared tree touch (name them; check herdr peers + docs/plans/).',
  teeth:
    'Which rung holds each new invariant (gate > hook > skill > norm) and\n' +
    'the PROOF the gate can go RED. Budget: what it adds to the <=8s\n' +
    'commit lane (ADR-176).',
  rollback:
    'How this unwinds if it misfires: the flag, the revert seam, the\n' + 'escape hatch env var.',
  goConditions:
    'Blocking preconditions: coordination (other agents parked?), human\n' +
    'sign-offs already in hand, backups taken.',
  aftermath: 'Cleanup, comms to co-agents, what re-syncs, what gets archived.',
};

/** The compliant skeleton for a class — SINGLE-SOURCED from REQUIRED +
 *  SECTION_HEADING/GUIDE; docs/plans/templates/<class>.md is generated from
 *  this (--scaffold-write) and a vitest case REDs on drift. */
export function scaffoldTemplate(cls: PlanClass): string {
  const heading = (id: string): string => HEADING_OVERRIDE[cls]?.[id] ?? SECTION_HEADING[id] ?? id;
  const lines: string[] = [
    '# <imperative title — what lands when this plan is done>',
    '',
    '**Status:** 📋 PROPOSED (<YYYY-MM-DD>, <session>)',
    '**Confidence:** ( <X>% Opus, <Y>% Fable ) — <one clause: where judgment sits>',
    `**Template:** ${cls}`,
    '',
  ];
  const req = REQUIRED[cls];
  for (const id of [...req.hard, ...req.warn]) {
    const optional = req.warn.includes(id) ? ' <!-- optional (warn-rung) -->' : '';
    lines.push(`## ${heading(id)}${optional}`, '');
    lines.push(`<!-- ${SECTION_GUIDE[id] ?? ''} -->`, '');
  }
  return lines.join('\n');
}

const TEMPLATE_BANNER =
  '<!-- GENERATED — do not hand-edit. Source: src/scripts/verify-plan-template.ts\n' +
  '     (REQUIRED + SECTION_HEADING/GUIDE). Regenerate: pnpm exec tsx\n' +
  '     src/scripts/verify-plan-template.ts --scaffold-write. The vitest\n' +
  '     scaffold-sync case REDs on drift. To start a plan: copy this file (or\n' +
  '     run --scaffold <class>), fill EVERY section, delete the comments. -->\n\n';

export function templateFileContent(cls: PlanClass): string {
  return TEMPLATE_BANNER + scaffoldTemplate(cls) + '\n';
}

interface Section {
  ids: string[]; // ALL alias hits — one heading may serve several roles
  // ("Context — why now, what exists" is both why and grounding;
  //  "Phases + DoDs" is both steps and verification)
  heading: string;
  body: string;
}

/** Strip fenced code blocks + HTML comments so embedded examples can't
 *  satisfy (or break) heading/word checks — and so committing the guide's
 *  skeleton with only its `<!-- … -->` placeholders reads as EMPTY. */
function stripNoise(md: string): string {
  return md.replace(/^```[\s\S]*?^```/gm, '').replace(/<!--[\s\S]*?-->/g, '');
}

function normalizeHeading(h: string): string {
  return h
    .toLowerCase()
    .replace(/[`*_]/g, '')
    .replace(/[^\p{L}\p{N}\s/&-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Split into sections at #/##/### headings; body runs to the next heading of
 *  the same-or-higher level (### subsections stay inside their ##). */
export function splitSections(md: string): Section[] {
  const text = stripNoise(md);
  const lines = text.split('\n');
  const heads: { i: number; level: number; text: string }[] = [];
  lines.forEach((l, i) => {
    const m = /^(#{1,3})\s+(.*)$/.exec(l);
    if (m) heads.push({ i, level: (m[1] ?? '').length, text: m[2] ?? '' });
  });
  const out: Section[] = [];
  for (let h = 0; h < heads.length; h++) {
    const cur = heads[h];
    if (!cur) continue;
    let end = lines.length;
    for (let j = h + 1; j < heads.length; j++) {
      const nxt = heads[j];
      if (nxt && nxt.level <= cur.level) {
        end = nxt.i;
        break;
      }
    }
    const norm = normalizeHeading(cur.text);
    const ids = Object.entries(SECTIONS)
      .filter(([, rx]) => rx.test(norm))
      .map(([sid]) => sid);
    out.push({ ids, heading: cur.text, body: lines.slice(cur.i + 1, end).join('\n') });
  }
  return out;
}

const words = (s: string): number => (s.match(/\S+/g) ?? []).length;

/** A section counts as FILLED when it has real prose (≥15 words) or the
 *  explicit escape: a body leading with "none — <reason>" (≥4 words). */
function filled(body: string): boolean {
  const w = words(body);
  if (/^\s*[-*]?\s*\*{0,2}none\b/i.test(body)) return w >= 4;
  return w >= 15;
}

/** All sections matching `id` (a plan may satisfy 'sync' via several). */
function find(sections: Section[], id: string): Section[] {
  return sections.filter((s) => s.ids.includes(id));
}

export interface PlanVerdict {
  file: string;
  cls: PlanClass | null; // declared (or assumed) class
  failures: string[];
  warns: string[];
  formalitiesOnly: boolean; // fails ONLY on the new header formalities
}

export function validatePlan(
  content: string,
  file: string,
  assumeClass: PlanClass | null = null,
): PlanVerdict {
  const failures: string[] = [];
  const warns: string[] = [];

  // ── header triplet ──
  const st = parseStatusToken(content);
  if (!st) failures.push('header: no **Status:** line');
  else if (!(CLOSED_TOKENS as readonly string[]).includes(st.token))
    failures.push(`header: Status token "${st.token}" outside the closed vocabulary`);

  if (!/^\s*\*\*confidence\b/im.test(content))
    failures.push('header: no **Confidence:** ( X% Opus, Y% Fable ) line');

  const tm = /^\s*\*\*template:?\*?\*?\s*:?\s*(\w+)/im.exec(content);
  let cls: PlanClass | null = assumeClass;
  if (tm) {
    const declared = (tm[1] ?? '').toLowerCase();
    if (declared === 'build' || declared === 'process' || declared === 'ops') cls = declared;
    else failures.push(`header: Template class "${tm[1]}" is not build|process|ops`);
  } else if (!assumeClass) {
    failures.push('header: no **Template:** build|process|ops line');
  }
  const headerOnlySoFar = failures.length;

  // ── mandatory sections for the class ──
  const effective: PlanClass = cls ?? 'build';
  const sections = splitSections(content);
  const req = REQUIRED[effective];

  const check = (id: string, sink: string[]): void => {
    const hits = find(sections, id);
    const first = hits[0];
    if (first === undefined) {
      sink.push(`missing section — add: ${SECTION_LABEL[id] ?? id}`);
    } else if (!hits.some((s) => filled(s.body))) {
      sink.push(`empty section "${first.heading}" — fill it (or "none — <reason>")`);
    }
  };

  for (const id of req.hard) {
    // 'sync' is satisfiable two ways: one Sync-ripple section, OR the older
    // split shape — a PRD-named heading AND a story-bible-named heading.
    if (id === 'sync') {
      const syncSecs = find(sections, 'sync');
      const prdSecs = find(sections, 'syncPrd');
      const bibleSecs = find(sections, 'syncBible');
      const viaSingle = syncSecs.some((s) => filled(s.body));
      const viaSplit =
        effective !== 'build'
          ? prdSecs.some((s) => filled(s.body))
          : prdSecs.some((s) => filled(s.body)) && bibleSecs.some((s) => filled(s.body));
      if (!viaSingle && !viaSplit) {
        check('sync', failures);
        continue;
      }
      // Coverage: build/ops must speak to PRD and (build) story-bible even
      // inside a single Sync section — an explicit "none — reason" counts.
      if (viaSingle && !viaSplit && effective !== 'process') {
        const body = syncSecs.map((s) => s.body).join('\n');
        if (!/\bprd\b/i.test(body))
          failures.push('sync: no PRD line — name the § edit or "PRD: none — <reason>"');
        if (effective === 'build' && !/story[- ]?bible/i.test(body))
          failures.push(
            'sync: no story-bible line — name the section or "Story-bible: none — <reason>"',
          );
      }
      continue;
    }
    if (id === 'steps') {
      const hits = find(sections, 'steps');
      const first = hits[0];
      if (first === undefined) {
        failures.push(`missing section — add: ${SECTION_LABEL.steps ?? 'steps'}`);
        continue;
      }
      const body = hits.map((s) => s.body).join('\n');
      const items = (body.match(/^\s{0,3}(\d+[.)]|[-*])\s+\S/gm) ?? []).length;
      const subheads = (body.match(/^#{3}\s+/gm) ?? []).length;
      if (items + subheads < 3 && words(body) < 120)
        failures.push(
          `steps: "${first.heading}" has <3 discernible steps and little prose — sequence the work`,
        );
      continue;
    }
    check(id, failures);
  }
  for (const id of req.warn) check(id, warns);

  // ── verification must name something that can go RED ──
  const verifSecs = find(sections, 'verification');
  if (verifSecs.some((s) => filled(s.body))) {
    const body = verifSecs.map((s) => s.body).join('\n');
    if (
      !/(test|verif|gate|\bsim\b|e2e|\bpin\b|blind[- ]pass|screenshot|capture|smoke|\bred\b|green)/i.test(
        body,
      )
    )
      warns.push('verification: names no concrete check (test/gate/sim/e2e/capture)');
  }

  // ── grounding should cite the repo, not memory ──
  const groundSecs = find(sections, 'grounding');
  if (groundSecs.some((s) => filled(s.body))) {
    const body = groundSecs.map((s) => s.body).join('\n');
    if (
      !/(src\/|docs\/|project\/|\.claude\/|\.githooks|\.github|[\w-]+\.(ts|md|sh|css|json)\b|`[0-9a-f]{7,}`)/.test(
        body,
      )
    )
      warns.push("grounding: cites no file path or commit — verify, don't trust (PH2)");

    // First-principles (2026-07-11 fresh pass): grounding claims are only as
    // good as their verifiability. Two cheap, sound-at-warn checks:
    // (a) every repo path the grounding CITES must exist — a missing one is a
    //     hallucination or rot, exactly the PH2 failure a reviewer can't see;
    // (b) grounding ROTS — it should carry the date it was surveyed, so an
    //     executor weeks later knows to re-verify before building on it.
    const cited = body.match(/(?:src|docs|project|\.claude|\.githooks|\.github)\/[\w./-]+/g) ?? [];
    const missing = [
      ...new Set(
        cited
          .map((p) => p.replace(/[.,;:)]+$/, ''))
          .filter((p) => !p.includes('*') && !existsSync(p)),
      ),
    ];
    if (missing.length > 0)
      warns.push(
        `grounding: cited path(s) do not exist on disk — hallucination or rot (PH2): ${missing.join(', ')}`,
      );
    if (!/20\d{2}-\d{2}-\d{2}/.test(body))
      warns.push(
        'grounding: no survey date — state WHEN this was verified (grounding rots; an executor must know to re-check)',
      );
  }

  // ── a LOCKED plan implies a human ratified it — name them (PH4/ADR-022).
  //    Match attribution SHAPES ("(human, 2026-…)", "human call/ruling") —
  //    a bare /human/ would false-green on the Human-in-the-loop heading. ──
  if (
    st?.token === 'LOCKED' &&
    !/\(human|human[, ]+20\d\d|human call|human ruling|human steer|human-locked|human,/i.test(
      content,
    )
  )
    warns.push('status: LOCKED but no human attribution anywhere — locked by whom, when?');

  // ── build plans must prove the player can REACH the change (PH6) ──
  if (effective === 'build' && verifSecs.some((s) => filled(s.body))) {
    const vbody = verifSecs.map((s) => s.body).join('\n');
    if (
      !/(captures?|screenshots?|e2e|fixtures?|playtest|blind[- ]pass|headless|browser|\blive\b)/i.test(
        vbody,
      )
    )
      warns.push(
        'verification: unit checks only — name the player-reach proof (PH6): a capture, e2e, fixture, or live drive',
      );
  }

  // ── why should cite the record ──
  if (!/\b(FB-\d+|ADR-\d+|D-\d{3}|HR-\d+|HD-\d+)\b/.test(content))
    warns.push('why: no FB-/ADR-/HR-/HD- citation anywhere — what record demands this plan?');

  // ── filename convention (WARN, mirrors the hook's existing nag) ──
  const base = file.split('/').pop() ?? file;
  if (!/^(fable|opus|sonnet|haiku)-/.test(base))
    warns.push('filename: no model prefix (<model>-<series>-<slug>.md)');

  const formalitiesOnly =
    failures.length > 0 &&
    failures.length === headerOnlySoFar &&
    failures.every((f) => /Confidence|Template/.test(f));

  return { file, cls, failures, warns, formalitiesOnly };
}

// ── CLI ────────────────────────────────────────────────────────────────────

function stagedNewPlans(): string[] {
  const out = execFileSync('git', ['diff', '--cached', '--name-only', '--diff-filter=A'], {
    encoding: 'utf-8',
  });
  return out.split('\n').filter(
    (f) =>
      /^docs\/plans\/.+\.md$/.test(f) &&
      !f.endsWith('README.md') &&
      !f.startsWith('docs/plans/templates/'), // the skeletons are NOT plans
  );
}

function mdFilesUnder(dir: string): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...mdFilesUnder(p));
    else if (e.endsWith('.md') && e !== 'README.md') out.push(p);
  }
  return out;
}

function report(v: PlanVerdict): void {
  for (const f of v.failures) console.error(`  X plan-template: ${v.file} — ${f}`);
  for (const w of v.warns) console.log(`  ~ plan-template WARN: ${v.file} — ${w}`);
}

function main(): void {
  const argv = process.argv.slice(2);

  if (argv[0] === '--scaffold') {
    const cls = argv[1];
    if (cls !== 'build' && cls !== 'process' && cls !== 'ops') {
      console.error('usage: verify-plan-template.ts --scaffold build|process|ops');
      process.exit(1);
    }
    process.stdout.write(scaffoldTemplate(cls) + '\n');
    return;
  }

  if (argv[0] === '--scaffold-write') {
    for (const cls of ['build', 'process', 'ops'] as PlanClass[]) {
      const p = `docs/plans/templates/${cls}.md`;
      writeFileSync(p, templateFileContent(cls));
      console.log(`  ✓ plan-template: wrote ${p}`);
    }
    return;
  }

  if (argv[0] === '--backtest') {
    // Corpus sweep: classless plans are scored against all three classes and
    // take their BEST fit (fewest failures) — fair to pre-template eras.
    const roots = argv.slice(1).length ? argv.slice(1) : ['project/archive', 'docs/plans'];
    const skip = /prd-v1\.md$|prd-05-narrative-old-canon\.md$|docs\/plans\/templates\//;
    // The Confidence/Template header lines post-date most of the corpus —
    // split them out so the sweep measures SUBSTANCE: would this plan pass
    // if it merely declared its class?
    const formality = (f: string): boolean => /Confidence|Template/.test(f);
    let pass = 0;
    const rows: { file: string; cls: string; sub: string[] }[] = [];
    for (const root of roots) {
      for (const f of mdFilesUnder(root)) {
        if (skip.test(f)) continue;
        const content = readFileSync(f, 'utf-8');
        const best = (['build', 'process', 'ops'] as PlanClass[])
          .map((c) => validatePlan(content, f, c))
          .map((v) => ({ v, sub: v.failures.filter((x) => !formality(x)) }))
          .sort((a, b) => a.sub.length - b.sub.length)[0];
        if (!best) continue;
        rows.push({ file: f, cls: best.v.cls ?? '?', sub: best.sub });
        if (best.sub.length === 0) pass++;
      }
    }
    rows.sort((a, b) => b.sub.length - a.sub.length);
    for (const r of rows) {
      const mark = r.sub.length === 0 ? 'PASS' : `FAIL(${r.sub.length})`;
      console.log(`${mark.padEnd(9)} ${r.cls.padEnd(7)} ${r.file}`);
      for (const f of r.sub) console.log(`            - ${f}`);
    }
    console.log(
      `\n  backtest: ${pass}/${rows.length} plans pass on SUBSTANCE at today's bar` +
        ` (best-fit class; the new Template/Confidence header lines excluded).`,
    );
    return;
  }

  const files = argv[0] === '--staged' ? stagedNewPlans() : argv;
  if (files.length === 0) {
    console.log('  ✓ plan-template: no new plan files to check.');
    return;
  }
  let red = false;
  for (const f of files) {
    const v = validatePlan(readFileSync(f, 'utf-8'), f, null);
    report(v);
    if (v.failures.length > 0) red = true;
    else console.log(`  ✓ plan-template: ${f} (${v.cls}) — all mandatory sections present.`);
  }
  if (red) {
    console.error('');
    console.error('  X commit blocked - a NEW plan is missing its template obligations.');
    console.error('    The three templates + section guidance: docs/guides/plan-authoring.md');
    console.error('    (declare **Template:** build|process|ops in the header; every mandatory');
    console.error('    section filled, or an explicit "none - <reason>").');
    console.error('    Genuinely exempt (rare)?  SKIP_PLAN_TEMPLATE=1 git commit ...');
    process.exit(1);
  }
}

// tsx runs this file directly from the hook; the test imports the pure fns.
if (process.argv[1]?.includes('verify-plan-template')) main();
