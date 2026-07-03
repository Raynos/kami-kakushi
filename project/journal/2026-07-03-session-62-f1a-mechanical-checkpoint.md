# Session 62 — 2026-07-03 — F1a: the mechanical checkpoint

## ☀️ SUMMARY (read this first)

Building **F1a — the mechanical checkpoint** (`docs/plans/fable-process-F1a-mechanical-checkpoint.md`),
Opus, phase by phase (each its own verify-green commit). Applies the repo's own
"generate, don't duplicate" convention to the PROCESS layer: a `checkpoint.ts`
regenerates the derivable process-doc regions (gate roster + count, active-plans
list) from their single sources (`gates.ts`, the `docs/plans/` listing), so
doc-vs-doc drift becomes impossible-by-construction rather than policed after the
fact. This file is HISTORY, not live state — the live snapshot is
[`../status/project-status.md`](../status/project-status.md).

Human ratified routing (Opus) + all defaults; see the plan's "Decisions already
ratified" preamble. WARN→block promotion of the DONE-not-archived check is
explicitly deferred to the human.

---

## 1 · Phase 1 — core script + region splicer + status parser

Landed the machinery:

- `src/scripts/gates.ts` (new) — extracted the `GATES` roster out of
  `verify-run.ts` (which executes top-level on import, so a consumer couldn't
  import the list). Now the SINGLE SOURCE for the gate list; both `verify-run.ts`
  and `checkpoint.ts` import it. Zero behaviour change.
- `src/scripts/gen-regions.ts` (new) — the shared fenced-region splicer
  (`<!-- gen:begin/end <id> -->`). Byte-idempotent, preserves every byte outside
  the markers, hard `MissingRegionError` on an absent/malformed marker pair, a
  short-id-never-matches-a-longer-id guard, and a deterministic `wrap()`. Shared
  infra — the F1b ripple tooling imports it too.
- `src/scripts/checkpoint.ts` (new) — write + `--check` modes (mirrors
  `gen-docs.ts`). Regenerates three regions: `gate-roster` in project-status.md
  §Toolchain + working-agreements.md §Commit-gate (the live 11→13 drift, now
  fixed as proof-of-value), and `active-plans` in docs/plans/README.md (replaced
  the stale "(No active plans right now…)" closer). Lenient status-token parser
  (`parseStatusToken`) used for active-plans classification; a main-guard keeps
  the CLI from running when a test imports the pure exports.
- npm scripts `checkpoint` / `checkpoint:check`.
- Marker migration (§4.1–4.3): project-status.md stayed at EXACTLY its 120-line
  cap (I traded the hooks-enable one-liner — which lives in AGENTS.md — for the 2
  marker lines, and dropped the hand-copied "13 gates" mention in How-to-resume
  so it can't re-drift at 14). working-agreements + README have no cap.
- Vitest: `gen-regions.test.ts` (9) + `checkpoint.test.ts` (10) — splice
  preserves-outside / idempotent / missing-marker-throws / short-id guard, and
  token parsing incl. the two RED-able traps the live session-brief hit: a
  two-word "IN PROGRESS" must fold to `IN-PROGRESS` (not "IN"), and a leading
  "✅ LOCKED" must NOT be tagged archivable (glyph is decoration). Caught + fixed
  a real bug mid-build: the token regex greedily grabbed "SUPERSEDED by" →
  `SUPERSEDED-BY`; now only the specific `IN PROGRESS` two-worder folds.

**DoD met (RED-then-GREEN):** `checkpoint` twice = no-op the 2nd time;
`checkpoint --check` goes RED (exit 1, names the two stale gate-roster docs) when
a gate is added to `gates.ts` without regenerating — the exact 11→12 bug, now
impossible — and GREEN again on revert. `npm run verify` green (13 gates, ~7.6s;
checkpoint joins GATES in Phase 4).

## 2 · Phase 2 — plan tokens + auto-archive

- **Token migration (§4.4):** migrated every live plan's `**Status:` line to the
  six closed tokens (§2.2), preserving prose. F1a → `🔨 IN-PROGRESS` (being built);
  F1b/F2/F4–F9 normalised `**Status: … **` → `**Status:** 📋 PROPOSED …`; F10
  `⏸️ PLACEHOLDER` → `🧊 PARKED`; master-plan `🔧 IN PROGRESS` → `🔨 IN-PROGRESS`
  (glyph reconciliation, human intent prose preserved; also fixed its in-prose
  "DONE / COMPLETE / SHIPPED" archival note to the closed set's "DONE / SUPERSEDED").
  F3 + emergent-node-actions were already canonical `📋 PROPOSED`.
- **Co-agent shared-tree call:** the ui-demos plan had been committed to `main`
  mid-build as `✅ BUILT + verified — awaiting R9`. `BUILT` is not a closed token,
  and marking it `✅ DONE` would AUTO-ARCHIVE a co-agent's under-review plan. So I
  mapped it to `🔨 IN-PROGRESS` (non-destructive: stays in `docs/plans/`), keeping
  the "BUILT + verified … awaiting the human's R9" prose. Surfaced in the report.
- **Auto-archive mover (§2.3–2.4)** in `checkpoint.ts`: a DONE/SUPERSEDED plan is
  moved to `project/archive/`, every intra-repo markdown link that pointed at it is
  recomputed (scanning check-md-links' roots), and its reading-queue backtick path
  is rewritten + tagged `(archived — done)` — KEPT, never removed (D-089). No index
  mutation by default; `--stage` opts into `git mv` + `git add` (own paths only).
- **Strict token gate:** `checkpoint --check` now RED on any plan whose token is
  outside the closed set (this comes online as a real gate in Phase 4). Green now
  that all 14 plans are migrated.
- Unit tests: `rewriteQueuePath` (tag once / idempotent / leaves others) +
  `relinkTarget` (recompute / null / skip external / preserve #anchor). 26 tests.

**DoD met (one command):** a throwaway fixture plan marked `✅ DONE` + one
`npm run checkpoint` → `git`-detectable move to `project/archive/`, the queue
backtick rewritten + tagged AND a markdown link relinked to `./archive/…`,
`md-links` GREEN (76 files), zero trace after cleanup. `npm run verify` green.

## Next intended steps

1. Phase 3 — `--journal "<topic>"` scaffold (create-only, next NN, refuses to
   touch an existing file) + the end-of-run report.
2. Phase 4 — add `checkpoint` to GATES (becomes the 14th); the gate-roster regions
   self-update in the same commit; record `verify:budget` headroom;
   DONE-not-archived = WARN.
3. Phase 5 — converge `session-brief.sh` + README vocab on the closed tokens;
   trim working-agreements / prepare-to-exit / pre-commit roster comment. Then
   flip F1a to DONE + let checkpoint auto-archive itself.

## Landmines

- **Shared tree, live.** A co-agent committed to `main` mid-build (the ui-demos
  plan BUILDING→BUILT). Stage ONLY my own paths by explicit pathspec; re-check
  `git diff --cached --name-only` before every commit.
- **project-status.md is at the 120-line cap** — zero headroom; any net line add
  fails `doc-budgets`. The gate-roster region is budgeted to stay 3 body lines
  even at 14 gates.
- The closed six-token vocabulary has no "built-but-awaiting-review" state; the
  co-agent's ui-demos plan sits there. Phase 2 must not force it to DONE (that
  would auto-archive their file).
