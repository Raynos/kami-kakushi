# Session 62 — 2026-07-03 — F1a: the mechanical checkpoint

## ☀️ SUMMARY (read this first)

**Built F1a — the mechanical checkpoint** (spec now archived at
`project/archive/fable-process-F1a-mechanical-checkpoint.md`), Opus, phase by phase
(each its own verify-green commit). **DONE — all 5 phases + completion landed; the
tool auto-archived its own plan.** Applies the repo's own "generate, don't
duplicate" convention to the PROCESS layer: a `checkpoint.ts` regenerates the
derivable process-doc regions (gate roster + count, active-plans list) from their
single sources (`gates.ts`, the `docs/plans/` listing) + graduates DONE plans, so
doc-vs-doc drift becomes impossible-by-construction rather than policed after the
fact. `checkpoint` is now the **14th verify gate**. This file is HISTORY, not live
state — the live snapshot is [`../status/project-status.md`](../status/project-status.md).

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

## 3 · Phase 3 — journal scaffold + report

- `checkpoint -- --journal "<topic>"` CREATES a dated skeleton from _TEMPLATE.md's
  shape-A block (generated from the template, not hard-copied), NN = max existing
  + 1, slugged topic. Create-only: it never opens/appends an existing journal, so
  append-only-lossless holds.
- End-of-run report is now "**wrote / moved / flagged**": scaffolded file, archive
  moves + relinks + queue rewrites, region writes, and flagged non-closed tokens;
  a bare run just names the newest journal.
- Unit tests: `nextSessionNumber` (max+1, empty→1), `slugify`, `fillJournalSkeleton`
  (shape-A only, placeholders replaced). 21 tests in the checkpoint suite.

**DoD met:** scaffold lands at the correct next NN (63) with the shape-A skeleton
filled; a forced path-collision proved create-only — with `session-63` pre-existing
the scaffold targets `session-64` and leaves the existing file byte-unchanged; a
bare `checkpoint` only reports (creates nothing). `npm run verify` green.

## 4 · Phase 4 — teeth (checkpoint joins GATES)

- Added `checkpoint` (`tsx checkpoint.ts --check`, scope `both`) to `gates.ts` —
  the **14th** gate (not "13th"; `doc-budgets` had already landed post-plan). The
  system now maintains its own docs: adding the gate made the gate-roster regions
  regenerate to "14 gates … checkpoint" in the SAME commit (dogfood). project-status
  held at its exact 120-line cap (the 3-line body absorbed the 14th name).
- DONE-not-archived: a loud **WARN** in `--check` (never blocks; exit 0). Promotion
  WARN→block after a clean soak week is **DEFERRED to the human** (their call, per
  the ratified defaults) — I left it WARN and did not promote it.
- **`verify:budget` recorded:** 14 gates, median **4.94s**, **0.06s headroom**
  under the 5.00s budget (PASS). The checkpoint gate is **0.25s** — nowhere near the
  critical path (vitest 4.94s · prettier 4.83s · eslint 4.76s · tsc 4.63s dominate;
  everything else < 0.85s). fs-only, no compile, invisible in parallel.

**DoD met:** 14 gates green in parallel; a deliberately-staled region turns `verify`
RED via the checkpoint gate (1/14 failed → commit would be blocked); a clean tree
emits no WARN; the DONE-not-archived WARN fires on a probe DONE plan without
blocking (check exit 0). `npm run verify` green.

## 5 · Phase 5 — the simplification payoff

Converged the process layer on the ONE closed vocabulary + delegated the mechanicals:

- **`session-brief.sh`** now classifies archivable as exactly `^(done|superseded)$`
  (was a 6-word list incl. complete/completed/shipped/archived) — agreeing with
  `checkpoint.ts`, which I tightened to `ARCHIVABLE = {DONE, SUPERSEDED}` (the
  migration-parity synonyms are no longer needed). Two parsers, one vocabulary.
- **`working-agreements.md` § Checkpoint** folded steps 3+4 into one: "run
  `npm run checkpoint` (regenerates regions + graduates DONE plans), then finish the
  judgment half" — net deletion of a step.
- **`prepare-to-exit/SKILL.md`** gained one line naming `npm run checkpoint`.
- **`.githooks/pre-commit`** retired its stale 7-gate roster comment → points at
  `gates.ts` (the single source; that copy had drifted — §0.4).
- **`docs/plans/README.md`** vocabulary section rewritten to the closed six tokens
  (glyphs shown; archivable = DONE/SUPERSEDED), dropping the word-synonym list and
  the "future convention" note (it landed). Removed the now-obsolete link to the
  F1a plan (which archives itself next).
- **KEPT** (complementary, own invariants): the reading-queue gate, the snapshot
  line-cap, the journal gate.
- **WARN→block promotion of DONE-not-archived is DEFERRED to the human** — left as
  WARN; I did not promote it (their call after a clean soak week).

**DoD met:** a `✅ LOCKED` probe tags **▶️ active** in the brief (not DONE — the
exact §0.6 glyph mis-tag, fixed); the agreements/skill/hook diffs are net deletions;
`npm run verify` green (14 gates).

## 6 · F1a completion — the tool archives itself

Flipped `fable-process-F1a-mechanical-checkpoint.md`'s Status to `✅ DONE` and ran
`npm run checkpoint`: it MOVED the plan to `project/archive/`, regenerated the
active-plans region (13 active plans, F1a excluded), and rewrote the reading-queue
backtick path to `project/archive/…` tagged `(archived — done)` — the cleanest
possible dogfood of Phase 2, proving the tool works on a real plan. `md-links` green
(75 files), `checkpoint --check` green (13 tokens valid), `npm run verify` green.

**F1a is DONE.** All 5 phases + completion landed as verify-green commits:
Ph1 `59910ee` · Ph2 `a05e8d2` · Ph3 `571166f` · Ph4 `0545d43` · Ph5 `9e27732` ·
completion (this). F1b is a SEPARATE later builder — untouched beyond its Ph2
Status-token normalization.

## Landmines

- **Shared tree, live.** A co-agent held `docs/plans/opus-2026-07-03-ui-demos-…md`
  dirty/committing throughout (its Status is my Ph2 `🔨 IN-PROGRESS`; its body is
  their WIP). I never staged it. Re-check `git diff --cached --name-only` before
  every commit.
- **project-status.md is at the 120-line cap** — zero headroom; any net line add
  fails `doc-budgets`. The gate-roster region is budgeted to 3 body lines even at
  14 gates (verified: "…doc-budgets, checkpoint." still fits).
- **Closed vocabulary has no "built-but-awaiting-review" state.** The ui-demos plan
  (built + verified, awaiting R9) is parked at `🔨 IN-PROGRESS` — NOT DONE, so
  checkpoint won't auto-archive a co-agent's under-review plan out from under them.
- **Archived F1a's queue entry is KEPT (tagged), per the ratified default (D-089).**
  This is a known tension with `todo-human.md`'s "archived docs never belong here"
  prose — the human clears it after reading (checkpoint only tags mechanically).

- **Shared tree, live.** A co-agent committed to `main` mid-build (the ui-demos
  plan BUILDING→BUILT). Stage ONLY my own paths by explicit pathspec; re-check
  `git diff --cached --name-only` before every commit.
- **project-status.md is at the 120-line cap** — zero headroom; any net line add
  fails `doc-budgets`. The gate-roster region is budgeted to stay 3 body lines
  even at 14 gates.
- The closed six-token vocabulary has no "built-but-awaiting-review" state; the
  co-agent's ui-demos plan sits there. Phase 2 must not force it to DONE (that
  would auto-archive their file).
