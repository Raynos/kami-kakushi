// The one-command blind-pass loop for the T0/T1/T2 map sheets (s115 review T-3,
// built 2026-07-08; ENSEMBLE rebuild 2026-07-09 per the map-sheets audit Finding 0):
// capture → blind describe (THREE independent fresh agents per sheet, images ONLY)
// → judge each description separately vs the map-spec rubric → per-line MAJORITY
// verdict with a visible vote spread → committed report.
//
// Why an ensemble: on 2026-07-08/09 the SAME unchanged T0/T1 pixels scored
// all-M-green then 3/7 · 4/11 under identical rubric + capture — one fresh reader
// is a single sample of a noisy measurement (reader recall + judge scoring both
// vary). A single-reader run is a SAMPLE, never a verdict; the 2/3 majority is the
// verdict, and the vote-spread column (3/3 · 2/3 · 1/3 · 0/3) is the
// redraw-priority signal — a 2/3 line is visibly marginal.
//
// args.sheets is MANDATORY — you MUST name which sheet(s) to grade. Invoke via the
// Workflow tool, passing args as an OBJECT (never a JSON string):
//   { name: 'map-blind-pass', args: { sheets: ['T2'] } }        — one sheet
//   { name: 'map-blind-pass', args: { sheets: ['T0', 'T1'] } }  — several
// Judged against: T0/T1 → map-spec §5 · T2 → map-spec §6.4. args.url / args.outdir
// override the dev-server URL / capture dir. Prereq: the dev server is running
// (pnpm run dev). The caller commits the report. Reader + judge agents run on
// OPUS at MEDIUM effort (human ruling 2026-07-09, superseding the 2026-07-08
// Sonnet blessing — the ensemble carries the variance measurement, the model tier
// removes recall/scoring noise); capture + report stay Sonnet (mechanical work).
export const meta = {
  name: 'map-blind-pass',
  description:
    'Blind-describe the named map sheet(s) with fresh eyes and judge against the map-spec rubric (T0/T1 §5 · T2 §6.4). REQUIRES args.sheets, e.g. { sheets: ["T2"] }.',
  whenToUse:
    'After any look-bearing map-sheets change (map-authoring.md §5); required before calling a map change done. Always pass args.sheets naming the sheet(s) to grade.',
  phases: [
    { title: 'Capture', detail: 'headless shots (map-audit-shots.mjs)' },
    {
      title: 'Describe',
      detail: '3 independent blind readers per sheet — images only',
      model: 'opus',
    },
    {
      title: 'Judge',
      detail: 'score each description separately against its rubric',
      model: 'opus',
    },
    { title: 'Report', detail: 'write the scored report to project/audit/reports/' },
  ],
};

// ── HARD BAIL on a missing/malformed sheets arg, BEFORE spawning any agent (zero
//    token cost). The old code SILENTLY defaulted a bad arg to "all sheets" — which
//    is exactly how three runs graded the wrong tier. Never guess which sheet. ──
let a = args;
if (typeof a === 'string') {
  // tolerate a JSON-encoded object (a common caller slip), then validate it anyway
  try {
    a = JSON.parse(a);
  } catch {
    a = null;
  }
}
const VALID = ['T0', 'T1', 'T2'];
const sheets = a && Array.isArray(a.sheets) ? a.sheets : null;
if (!sheets || sheets.length === 0 || sheets.some((s) => !VALID.includes(s))) {
  return {
    failed: 'args',
    detail:
      "map-blind-pass requires args.sheets = a non-empty Array<'T0'|'T1'|'T2'> — " +
      "e.g. { sheets: ['T2'] }. Pass args as an OBJECT, not a JSON string. Got: " +
      JSON.stringify(args),
  };
}
const url = a.url || 'http://localhost:5173/';
const outdirArg = a.outdir || '';
const READERS = 3; // per sheet; verdict = strict majority of judged descriptions

phase('Capture');
const cap = await agent(
  `Run the map-sheet capture script from the repo root:
  QA_URL=${url} node src/scripts/map-audit-shots.mjs ${outdirArg || '"project/audit/screens/$(date +%F)-map-blind-pass"'}
(If the command fails because the dev server is down, report that clearly and return files as empty arrays.)
Then list the produced PNG files. Return JSON only: the output directory and the
absolute-or-repo-relative file paths grouped per sheet — T0 files contain "t0" in
the filename, T1 files contain "t1", T2 files contain "t2".`,
  {
    label: 'capture',
    model: 'sonnet',
    schema: {
      type: 'object',
      properties: {
        outdir: { type: 'string' },
        t0: { type: 'array', items: { type: 'string' } },
        t1: { type: 'array', items: { type: 'string' } },
        t2: { type: 'array', items: { type: 'string' } },
        error: { type: 'string' },
      },
      required: ['outdir', 't0', 't1'],
    },
  },
);
const filesFor = (t) =>
  (t === 'T0' ? cap && cap.t0 : t === 'T1' ? cap && cap.t1 : cap && cap.t2) || [];
if (!cap || sheets.some((t) => filesFor(t).length === 0)) {
  return {
    failed: 'capture',
    detail: (cap && cap.error) || 'no shots produced for a requested sheet — is the dev server up?',
  };
}
log(sheets.map((t) => `${filesFor(t).length} ${t}`).join(' + ') + ` shots → ${cap.outdir}`);

// which map-spec rubric section + cross-sheet comparison each tier is judged by
const RUBRIC_NOTE = {
  T0: 'Use the §5 rubric. Apply the "Both sheets" lines R1–R11 only.',
  T1: 'Use the §5 rubric. Apply the "Both sheets" lines R1–R11 AND the "T1 additions" R12–R18. For R12 (no landmark moved) you may additionally Read the T0 images listed for comparison.',
  T2: 'Use the §6.4 rubric (the T2 valley sheet). Apply the V-lines V1–V12. For V5 (same world as T1, no landmark moved) you may additionally Read the T1 images for comparison.',
};

const readerPrompt = (tier) =>
  `You are a fresh-eyes reader given ONLY screenshots of a hand-drawn map sheet.
Read (view) these image files and nothing else — do NOT open, grep, or explore any
other project file; your blindness is the point of this exercise.

Images: ${filesFor(tier).join(' · ')}

Describe, concretely and at length, the PLACE this sheet depicts: the geography
(relief, water and its flow direction, land use), the settlement(s) and their
relationship, what reads as old vs new vs abandoned, the roads and where they go,
the document itself (what kind of map, who might have made it, scale/legend), and
anything that strikes you as WRONG, oversized, unexplained, or deliberately
mysterious. State only what you can see. Return the description as plain text.`;

const judgeOne = (tier, description, n) =>
  agent(
    `Judge a blind reader's description of the ${tier} map sheet against the
blind-reader rubric. Read docs/guides/map-spec.md and use ONLY the rubric section
named next. ${RUBRIC_NOTE[tier]}

A rubric line PASSES only if the description actually recovers it (paraphrase is
fine; the reader inferring the opposite, or simply not mentioning it, is a MISS).
Judge conservatively — a false pass is worse than a false miss (PH3). Return a
verdict for EVERY line in the rubric section — never omit a line.

The blind description:
---
${description}
---

Return JSON: per-line verdicts with a one-line reason for every MISS.`,
    {
      label: `judge:${tier}:${n}`,
      phase: 'Judge',
      model: 'opus',
      effort: 'medium',
      schema: {
        type: 'object',
        properties: {
          lines: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                kind: { type: 'string', enum: ['M', 'S'] },
                pass: { type: 'boolean' },
                why: { type: 'string' },
              },
              required: ['id', 'kind', 'pass'],
            },
          },
        },
        required: ['lines'],
      },
    },
  );

// capture is local playwright (token-free), so both sheets are always shot —
// the sheets arg scopes only the AGENT work below (where the tokens are).
// Per sheet: READERS independent describe→judge chains run concurrently; the
// per-sheet barrier is genuine (the majority verdict needs all votes).
const results = await pipeline(sheets, (tier) =>
  parallel(
    Array.from(
      { length: READERS },
      (_, i) => () =>
        agent(readerPrompt(tier), {
          label: `describe:${tier}:${i + 1}`,
          phase: 'Describe',
          model: 'opus',
          effort: 'medium',
        }).then((description) =>
          description == null
            ? null
            : judgeOne(tier, description, i + 1).then((j) =>
                j == null ? null : { description, judge: j },
              ),
        ),
    ),
  ).then((chains) => ({ tier, chains: chains.filter(Boolean) })),
);

// ── Aggregate: per rubric-line MAJORITY across the judged descriptions. A judge
//    omitting a line counts as a MISS vote (conservative, PH3); a dead chain
//    shrinks the electorate (logged). Majority = strict (>half of judges). ──
const scored = results.filter(Boolean).map(({ tier, chains }) => {
  const judges = chains.length;
  const byId = new Map();
  for (const c of chains) {
    for (const l of c.judge.lines) {
      const e = byId.get(l.id) || { id: l.id, kind: l.kind, passVotes: 0, missWhy: [] };
      if (l.pass) e.passVotes += 1;
      else if (l.why) e.missWhy.push(l.why);
      if (l.kind === 'M') e.kind = 'M'; // conservative on kind disagreement
      byId.set(l.id, e);
    }
  }
  const lines = [...byId.values()].map((e) => ({
    id: e.id,
    kind: e.kind,
    spread: `${e.passVotes}/${judges}`,
    pass: e.passVotes * 2 > judges,
    marginal: e.passVotes > 0 && e.passVotes < judges,
    missWhy: e.missWhy,
  }));
  const m = lines.filter((l) => l.kind === 'M');
  const s = lines.filter((l) => l.kind === 'S');
  return {
    tier,
    judges,
    mPass: m.filter((l) => l.pass).length,
    mTotal: m.length,
    sPass: s.filter((l) => l.pass).length,
    sTotal: s.length,
    lines,
    failLines: lines.filter((l) => !l.pass),
    descriptions: chains.map((c) => c.description),
  };
});
const degraded = scored.filter((t) => t.judges < READERS);
for (const t of degraded) log(`⚠ ${t.tier}: only ${t.judges}/${READERS} reader chains survived`);
const pass =
  scored.length === sheets.length &&
  scored.every((t) => t.judges >= 2 && t.mPass === t.mTotal && t.sPass * 2 >= t.sTotal);
for (const t of scored)
  log(
    `${t.tier}: M ${t.mPass}/${t.mTotal} · S ${t.sPass}/${t.sTotal} · marginal ${t.lines.filter((l) => l.marginal).length}`,
  );

phase('Report');
const report = await agent(
  `Write the ENSEMBLE blind-pass report for the map sheet(s) ${sheets.join('+')} to a new
file project/audit/reports/<YYYY-MM-DD>-${sheets.join('').toLowerCase()}-map-blind-pass.md (compute the date
with the "date +%F" shell command; if the file exists, suffix -2, -3, …). Markdown,
~80-char wrap, in this shape: a header naming the capture dir (${cap.outdir}), the
sheets covered (${sheets.join(', ')} — a scoped run is NOT a full pass), the ensemble
design (${READERS} independent blind readers per sheet, each judged separately, per-line
verdict = strict majority; a single-reader run is a SAMPLE, never a verdict), and
the overall verdict (${pass ? 'PASS' : 'FAIL'}); then per sheet: a scores line, a FULL
per-line vote table (id · kind · spread · verdict — the spread column is the
redraw-priority signal; flag marginal lines, i.e. any non-unanimous spread), a MISS
detail table for majority-fail lines quoting the judges' miss reasons verbatim,
and all ${READERS} blind descriptions each in its own quote block. Data (JSON):
${JSON.stringify(scored.map(({ descriptions: _d, ...rest }) => rest))}
Full descriptions:
${scored.map((t) => t.descriptions.map((d, i) => `--- ${t.tier} reader ${i + 1} ---\n${d}`).join('\n')).join('\n')}
Return only the path of the file you wrote.`,
  { label: 'report', model: 'sonnet' },
);
return {
  pass,
  sheets,
  report: (report || '').trim(),
  scores: scored.map(({ descriptions: _d, ...rest }) => rest),
  capturedTo: cap.outdir,
};
