# Session 57 — 2026-07-03 — taste-transfer architecture (the ⭐ redo, strategy pass)

**Summary:** Opened the ⭐ "redo taste-distillation + ui-design WITH Fable"
TODO. The human's opening ask was the zoom-out — *what's the best way to
distill my feedback so future agents build the game as if I wrote it, in
gameplay, UI and fun?* — so before touching `taste.md`, this session verified
the first cut and wrote the strategy as a durable brainstorm.

## What changed

- `project/brainstorms/2026-07-03-taste-transfer-architecture.md` — NEW: the
  strategy. Pipeline framing (capture → distill → deliver → measure);
  pyramid model (verdicts → principles → values + touchstones); delivery
  rungs (AGENTS.md taste register / read-at-build / N7 scorecards /
  mechanical-gate subset); measurement (prediction test + repeat-feedback
  rate); failure modes; a 4-step redo process; open forks with defaults.
- `project/todo-human.md` — queued the brainstorm (being discussed live;
  clear once talked through).

## Verifications run (R2, receipts)

- F-coverage set-diff between `2026-07-02-playtest.md` headings and
  `taste.md` citations: only **F9, F21, F102** uncited; **F72** cited but
  matches no corpus heading. First cut's gap is architectural, not coverage.
- The wider feedback corpus (~1,400 lines across the other dated docs, incl.
  the 629-line PRD feedback) is NOT distilled into taste.md — that's where
  the gameplay/fun taste lives.
- N7 (taste-bar enforcement) confirmed parked with its re-plan trigger =
  this TODO closing.

## Human steers received (turn 2) — recorded in the brainstorm §2/§8/§9

- **Corpus = `2026-07-02-playtest.md` ONLY** (the first and only playtest);
  the wider-docs sweep is struck.
- **Lock the top layer** — approved. AGENTS.md taste register — approved.
- **Rewrite must be lightweight/culled**: high-level taste hints, never
  100s of lines; the corpus holds the examples. New brainstorm **§9**:
  snapshot-class declaration, displacement editing, budgets
  (taste.md ≤150 / ui-design.md ≤400, targets ~110/~300 on the snapshot
  gate's 1.33× headroom ratio), and the hard lock — one
  `verify-doc-budgets.ts` as BOTH a 13th verify gate and a standalone
  pre-commit call outside `SKIP_VERIFY` (docs-only commits are exactly
  when SKIP_VERIFY is used, so the standalone rung closes that loophole);
  checks the index blob; `SKIP_DOCBUDGET=1` = human-blessed cap raise only.
- Checklist **leaves taste.md** → becomes N7's generated per-surface
  scorecard.

## Next intended steps

1. Human answers the remaining lock inputs: values in their words,
   touchstones confirmed/extended, THE reference idle-RPG named.
2. Step 1 of the redo: playtest-only re-derivation + substance diff vs the
   current taste.md, pre-culled to the §9 budgets.
3. Steps 2–4: lock → pyramid rewrite + ui-design cull (+ generated
   ui-tokens doc) + AGENTS.md register + `verify-doc-budgets` gate + N7
   full rewrite → prediction test.

## Landmines

- Do NOT edit `taste.md` in place before the re-derivation diff exists —
  verify-don't-trust applies to the first cut.
- N7 explicitly forbids wiring scorecards against the *draft* taste.md.
- Journal numbering: two session-55 files exist for 2026-07-03; this file
  takes 57 (56 = ui-demos-mobile).
