# Session 50 — 2026-07-03 — PRD diet (D-117) + three process plans

**Summary:** A 496-commit git-log retrospective yielded 5 process-improvement
proposals; three became subagent-authored plans now in `docs/plans/`
(mechanical checkpoint, playtest-capture inbox, balance-sim gates). A live
grill session then locked the PRD diet as **ADR D-117** (the frontier PRD:
forward-spec-of-the-unbuilt, per-tier human-signed compression, §4
ripple-freeze) — full capture in
`project/brainstorms/2026-07-03-prd-on-a-diet.md`. All four docs queued for
the human's morning read; the human went to bed mid-session and the wrap-up
ran autonomously (R4).

## What changed

- `docs/plans/fable-process-S1-mechanical-checkpoint.md` — NEW (Plan subagent):
  generate the process layer's derivable sections; checkpoint = one command +
  one commit; found live doc drift as receipts.
- `docs/plans/fable-process-S2-playtest-capture-inbox.md` — NEW (Plan subagent):
  in-game hotkey capture → dev-middleware → repo inbox → `/drain-inbox`.
- `docs/plans/fable-process-S4-balance-sim-gates.md` — NEW (Plan subagent):
  persona bots + pacing envelopes from `balance.ts` + `verify:balance`.
- `project/brainstorms/2026-07-03-prd-on-a-diet.md` — NEW: 6-round Q&A
  capture, derived flows (design-change / compression / onboarding / audit),
  2 open flags.
- `docs/living/decisions.md` — **D-117** appended.
- `docs/living/prd.md` — FRAMING 2: the frontier-line note (D-117).
- `docs/living/prd/04-combat-balance.md` — ripple-frozen banner (D-117).
- `project/todo-human.md` — 4 reading-queue entries.
- `project/status/project-status.md` — one "Where we are now" bullet (D-117
  + the three plans). *(Left unstaged — the file also carries the parallel
  session's snapshot rewrite; the bullet rides with the tree.)*
- All 4 queued docs — added a **"Who builds this — Fable or Opus?"** routing
  section at the top (human's ask, async): checkpoint → Opus; inbox → build
  Opus / drains either (Fable for taste triage); balance-sim → Opus except
  Ph2 envelope calibration (Fable-preferred); T0 compression sweep → Fable.

## Next intended steps

1. Human reads the 3 plans + the brainstorm (queued); overrides the 2
   flagged defaults if wanted.
2. On R1 close → draft the **T0 compression sweep** (D-117) as a
   `docs/plans/` reel-back + R-item.
3. The plans await the human read before building (all three are
   process-changing); the mechanical-checkpoint plan's Phase 1 is the
   natural first build — its gen-region machinery is shared infrastructure
   for D-117's generated-facts half.

## Landmines

- **Q5 was a human override of the recommendation** — only §4 is
  ripple-frozen; system/narrative changes KEEP rippling into the PRD until
  each tier's compression event. Don't over-apply the freeze.
- Two Claude-picked defaults live in the brainstorm's "Open flags" — treat
  as provisional until the human weighs in.
- Another session owns uncommitted `src/` WIP (constants / surfaces / state /
  migrate / validate / home.ts + `before.png`) — left untouched, not staged.
