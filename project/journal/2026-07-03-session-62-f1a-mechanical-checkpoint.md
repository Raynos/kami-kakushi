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

## Next intended steps

1. Phase 2 — migrate the process-wave plans' Status lines to the six closed
   tokens (§2.2); build the auto-archive mover + link/queue path fixups + enable
   strict token validation in `--check`. Handle the co-agent-owned ui-demos plan
   (now committed `✅ BUILT + verified`) carefully — don't auto-archive it.
2. Phase 3 — `--journal` scaffold + end-of-run report.
3. Phase 4 — add `checkpoint` to GATES (14th); record `verify:budget` headroom.
4. Phase 5 — converge `session-brief.sh` + README vocab on the closed tokens;
   trim working-agreements / prepare-to-exit / pre-commit; retire the stale
   roster comment. Then flip F1a to DONE + let checkpoint auto-archive itself.

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
