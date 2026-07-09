# Session 135 — 2026-07-09 — map-sheets fixes: trustworthy loop, then the sheets

## ☀️ SUMMARY (read this first)

Executing `docs/plans/fable-2026-07-09-map-sheets-fixes.md` end-to-end
(human signed off via pre-build Q&A; all forks locked on the plan's
defaults, plus two mid-build rulings: blind-pass reader+judge agents →
**Opus medium**; **Fable executes the whole plan this session**, map
authoring included). Runs in parallel with session 134 (storywave
closure) in the SAME shared tree — coordination notes below. This file
is HISTORY; live state is `project/status/project-status.md`.

---

## 1 · P0 — the ensemble blind-pass loop

The audit's Finding 0 (one fresh reader flips M-lines on identical
pixels) → rebuilt `.claude/workflows/map-blind-pass.js`: **3
independent blind readers per sheet**, each description judged
**separately**, per-line verdict = **strict majority (2/3)**, report
carries a **vote-spread column** (`3/3 · 2/3 · 1/3 · 0/3`) as the
redraw-priority signal. Reader+judge routed **Opus medium** (human
ruling this session, supersedes the 2026-07-08 Sonnet blessing);
capture/report stay Sonnet (mechanical). `map-authoring.md` §5 gained
the variance paragraph (single-reader run = SAMPLE, never a verdict);
§6's routing note updated.

**Smoke run (T0 alone, DoD):** 8 agents green end-to-end; report
`project/audit/reports/2026-07-09-t0-map-blind-pass.md`. T0 scored
**M 6/7 · S 2/4** with spreads — vs 3/7 on today's single sample: the
ensemble verdict is visibly saner. Lone M-fail: **R5 at 1/3** (readers
see ruin + house as separate neighbours, not the house within the
ruin's own ground) — the same communication gap family as T2's
suspected V3. R7 marginal-pass 2/3.

**Gotcha paid for:** launching the workflow by `{name:}` served a
STALE session-cached copy of the old single-reader script (its stray
report was deleted, uncommitted); launch by `{scriptPath:}` after
editing a workflow file in-session.

## 2 · P1 — mechanical canon fixes (S1–S4)

- **S1** `nodes.ts` — `RUNG_LADDER` is now **DERIVED** from core
  `content/ranks.ts` `rewardOnReach.unlock` `room-*` flags (single
  source, TST1; the plan's "try derive first" turned out clean). One
  literal remains: `night-rounds: 3` (activity chip, no core map node —
  rides combat's R3). Absent = present from the start: the R0 four
  (weir/sickroom/forecourt/kitchen, no `revealFlag`) + `ruined` (locked
  scenery all tier). Derived values verified:
  gate/paddies/woodshed 1 · woodlot/field-margins 2 ·
  kura/weir-reeds/night-rounds 3 · drill-yard 4 · shrine/orchard 5 ·
  grove 7. Dead `SheetNode.rung` field deleted (never set, never
  read). `sheet.ts` pill now cycles EVERY rung R1–R7 (fog = nearest
  REVEAL stage at-or-below; stages stay sparse placeholder data).
- **S2** "Otoku-class village women" → "village women" (no Otoku in
  04-cast; harvest women are unnamed ambient).
- **S3** macrons: Kyūbei ×3, Ganzō ×1.
- **S4** one status story: `sheet.ts` is the DEV survey-sheet viewer;
  its geometry is player-bound through `map-variants/sheet-map.ts`
  (ADR-151) — both the `:610` comment and the player-readable aside.

Pin GREEN (no regen — nothing look-bearing changed on the committed
sheets); integrity green; full verify 17 gates green.

## 3 · Shared-tree coordination (session 134 runs in parallel)

Session 134 (storywave closure) had ALREADY fixed the O-Sato ×4 in
`nodes.ts` (its C1.1) and built `RETIRED_NAMES` (`names.ts`, 7 names)
+ the map-sheets denylist test (`integrity.test.ts`) — all uncommitted
in the shared tree when P1 landed. Rulings applied: the human's
pre-build Q&A blessed the O-Sato fix riding THIS plan's commit, so
`nodes.ts` was committed WHOLE (their 4 O-Sato→O-Hisa hunks folded in,
credited in the commit body) — removing the mutual pathspec-sweep
hazard on the one mixed-authorship file. Their coupled uncommitted
pair (`names.ts` + `integrity.test.ts`) was left strictly alone for
their own commit; this plan's P2 (extend `RETIRED_NAMES` to the full
04-cast docket + RED-proof) waits until theirs lands.

## Next intended steps

1. P2: after s134 commits the denylist pair → extend `RETIRED_NAMES`
   with the docket's missing names; RED-proof via isolated worktree.
2. P3: ensemble re-measure T0+T1+T2 → the robust-fail set.
3. P4: redraw majority-fail M-lines (T2 V3/V6 the candidates); P5
   close-out.

## Landmines

- Workflow-by-name serves a session-cached script — use `scriptPath`
  after editing `.claude/workflows/*.js` mid-session.
- `RUNG_LADDER` now imports `RANKS` from core — `nodes.ts` is no
  longer a zero-import data module (fine: UI→core is the allowed
  direction; the pin/integrity tests still pass in jsdom).
- The DEV pill's R2/R4/R6 stages reuse the nearest lower REVEAL fog
  poly — the fog GEOGRAPHY is still ADR-151 placeholder data; only the
  seal gating is real.
