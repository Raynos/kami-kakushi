// The one-command blind-pass loop for the T0/T1 map sheets (s115 review T-3,
// built 2026-07-08): capture → blind describe (one fresh agent per sheet, images
// ONLY) → judge vs map-spec §5 → committed report. Invoke via the Workflow tool:
//   { name: 'map-blind-pass' }                          — full both-sheet pass
//   { name: 'map-blind-pass', args: { sheets: ['T1'] } } — the edited sheet only
//                                                          (the DEFAULT GUIDANCE for
//                                                          single-sheet edits; run the
//                                                          full pass when layout.ts
//                                                          geometry moved, at HR/
//                                                          milestone closes, or a new
//                                                          tier's acceptance)
//   args.url / args.outdir override the dev-server URL / capture dir.
// Prereq: the dev server is running (pnpm run dev). The caller commits the report.
// Loop agents run on SONNET (human-blessed routing, 2026-07-08 — blindness matters,
// model size doesn't; D-124 satisfied by the explicit blessing).
export const meta = {
  name: 'map-blind-pass',
  description:
    'Capture the T0/T1 map sheets, blind-describe each with fresh eyes, judge against the map-spec §5 rubric, write a scored report',
  whenToUse:
    'After any look-bearing map-sheets change (map-authoring.md §5); required before calling a map change done.',
  phases: [
    { title: 'Capture', detail: 'headless shots of both sheets (map-audit-shots.mjs)' },
    { title: 'Describe', detail: 'one blind reader per sheet — images only' },
    { title: 'Judge', detail: 'score each description against the §5 rubric' },
    { title: 'Report', detail: 'write the scored report to project/audit/reports/' },
  ],
};

const url = (args && args.url) || 'http://localhost:5173/';
const outdirArg = (args && args.outdir) || '';
const sheets = ['T0', 'T1', 'T2'].filter((t) =>
  args && args.sheets ? args.sheets.includes(t) : true,
);
if (sheets.length === 0) {
  return { failed: 'args', detail: "args.sheets must name 'T0', 'T1' and/or 'T2'" };
}

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

// capture is local playwright (token-free), so both sheets are always shot —
// the sheets arg scopes only the AGENT work below (where the tokens are)
const results = await pipeline(
  sheets,
  // stage 1 — the blind reader: images only, no repo access
  (tier) =>
    agent(
      `You are a fresh-eyes reader given ONLY screenshots of a hand-drawn map sheet.
Read (view) these image files and nothing else — do NOT open, grep, or explore any
other project file; your blindness is the point of this exercise.

Images: ${filesFor(tier).join(' · ')}

Describe, concretely and at length, the PLACE this sheet depicts: the geography
(relief, water and its flow direction, land use), the settlement(s) and their
relationship, what reads as old vs new vs abandoned, the roads and where they go,
the document itself (what kind of map, who might have made it, scale/legend), and
anything that strikes you as WRONG, oversized, unexplained, or deliberately
mysterious. State only what you can see. Return the description as plain text.`,
      { label: `describe:${tier}`, phase: 'Describe', model: 'sonnet' },
    ),
  // stage 2 — the judge: rubric vs description
  (description, tier) =>
    agent(
      `Judge a blind reader's description of the ${tier} map sheet against the
blind-reader rubric. Read docs/guides/map-spec.md and use ONLY the rubric section
named next. ${RUBRIC_NOTE[tier]}

A rubric line PASSES only if the description actually recovers it (paraphrase is
fine; the reader inferring the opposite, or simply not mentioning it, is a MISS).
Judge conservatively — a false pass is worse than a false miss (PH3).

The blind description:
---
${description}
---

Return JSON: per-line verdicts with a one-line reason for every MISS.`,
      {
        label: `judge:${tier}`,
        phase: 'Judge',
        model: 'sonnet',
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
    ).then((j) => ({ tier, description, judge: j })),
);

const scored = results.filter(Boolean).map((r) => {
  const m = r.judge.lines.filter((l) => l.kind === 'M');
  const s = r.judge.lines.filter((l) => l.kind === 'S');
  return {
    tier: r.tier,
    mPass: m.filter((l) => l.pass).length,
    mTotal: m.length,
    sPass: s.filter((l) => l.pass).length,
    sTotal: s.length,
    misses: r.judge.lines.filter((l) => !l.pass),
    description: r.description,
  };
});
const pass =
  scored.length === sheets.length &&
  scored.every((t) => t.mPass === t.mTotal && t.sPass * 2 >= t.sTotal);
for (const t of scored) log(`${t.tier}: M ${t.mPass}/${t.mTotal} · S ${t.sPass}/${t.sTotal}`);

phase('Report');
const report = await agent(
  `Write the blind-pass report for the map sheet(s) ${sheets.join('+')} to a new file
project/audit/reports/<YYYY-MM-DD>-${sheets.join('').toLowerCase()}-map-blind-pass.md (compute the date with
the "date +%F" shell command; if the file exists, suffix -2, -3, …). Markdown,
~80-char wrap, in this shape: a header naming the capture dir (${cap.outdir}),
the sheets covered (${sheets.join(', ')} — a scoped run is NOT a full pass), and
the overall verdict (${pass ? 'PASS' : 'FAIL'}); per sheet a scores line, a
verbatim MISS table (id · kind · why), and the full blind description quoted in a
collapsible/quote block. Data (JSON): ${JSON.stringify(scored.map(({ description: _description, ...rest }) => rest))}
Full descriptions:
${scored.map((t) => `--- ${t.tier} ---\n${t.description}`).join('\n')}
Return only the path of the file you wrote.`,
  { label: 'report', model: 'sonnet' },
);
return {
  pass,
  sheets,
  report: (report || '').trim(),
  scores: scored.map(({ description: _description, ...rest }) => rest),
  capturedTo: cap.outdir,
};
