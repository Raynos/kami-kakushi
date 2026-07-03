# Session 51 — 2026-07-03 — PRD ripple tooling plan (D-117 Phase 0)

**Summary:** The human asked whether the PRD diet has a buildable-now slice —
can rippling from the game back into the PRD be partially automated, or
failing that, become a skill? Answer: both. Authored
`docs/plans/fable-process-S5-prd-ripple-tooling.md`: a `prd:drift` fact reporter
(the game's typed registries — the same ones `gen-docs.ts` already exports —
diffed against PRD prose, plus a retired-terms tripwire), one pilot
gen-region (§3 T0 rung names) reusing the mechanical-checkpoint plan's
splicer module, and two skills (`/prd-ripple` for Flow 1 routing,
`/prd-compress` dormant until R1 closes). Grounded first: `verify-prd` is
structural-only today (no fact checks), so the drift tool is genuinely new
surface.

## What changed

- `docs/plans/fable-process-S5-prd-ripple-tooling.md` — NEW: the plan (4 phases,
  Opus-routable; the eventual compression sweep stays Fable + human-signed).
- `project/todo-human.md` — queued the plan (same-commit queue gate).

## Next intended steps

1. Human reads the plan (queued); Ph1 (`prd:drift`) is independently
   buildable on sign-off — or autonomously, since it adds only a report.
2. Coordinate `gen-regions.ts` ownership with the mechanical-checkpoint
   plan: first-lander owns, the other imports.

## Landmines

- The semantic prose ripple is deliberately NOT automated — Flow 1 routing
  + the punch-list is the honest ceiling; don't let a future session
  auto-write PRD prose from diffs.
- Bulk PRD transclusion waits for the human-signed compression sweep (Q3);
  the pilot region is one already-shipped fact slice, filed as a queued
  diff.

---

## 1b · Ph1 BUILT — `prd:drift` live, 19 real gaps found (same session, later)

Built Ph1 autonomously (report-only, no canon): `src/scripts/prd-drift.ts`
+ `npm run prd:drift` (+ `--strict`) + a warn-only pre-commit nudge
(content-registry commits without a PRD touch; `balance.ts` excluded — §4
magnitudes are ripple-frozen, so nudging there would push against D-117).

- **Findings:** 19 presence gaps — §3's pre-reshape rung titles (6/8
  missing), §4's weapon roster diverges from the build (axe vs kama-yari),
  4/8 mobs, stance ids, and the R8-pending cast trio. All in T0-sweep
  territory → left as the quantified sweep backlog, NOT hand-rippled
  (deliberate DoD deviation, noted in the plan's Ph1 build notes).
- **The tool cried wolf on run #1:** the retired-terms tripwire hit §2's
  real-name DENYLIST — the one line where retired names belong. Calibrated:
  a hit line that names the successor is a documented rename, not drift.
  Retired-terms now genuinely clean (3 allowed lines).
- **Could-go-RED proof:** `--strict` exits 1 today on real data.
- **⚠️ Shared-index sweep (f84aff9):** the Ph1 commit unintentionally
  carried 4 files the PARALLEL session had staged between my `git add` and
  my retry-after-prettier-fail: `src/core/content/voices.ts` + new
  `voices.test.ts`, `src/ui/render.ts`, `src/ui/styles.css` (their 'lord'-
  voice work). Their content is intact, verify-green, and pushed — only
  the commit attribution is mixed; no action needed by them (git sees no
  diff on their next commit). Lesson recorded to memory: in this shared
  tree, re-check `git diff --cached --name-only` immediately before EVERY
  commit retry — the index is shared and moves under you.

## 1c · Sweep-guard: pathspec commits enforced (same session, later)

The human asked what hook can stop the co-agent commit-sweep class
(f84aff9). Key fact: git's index records WHAT is staged, not WHO — no git
hook can tell an agent's files apart. So two rungs, both landed:

- **PreToolUse guard (the teeth):** `guard-git-add-all.sh` now BLOCKS a
  bare `git commit` — the canonical form is `git commit -m "…" --
  path/a path/b` (git `--only` semantics: temp index from HEAD + named
  paths → co-agents' staged work untouchable by construction). Escapes:
  `--amend`, merge-in-progress (`.git/MERGE_HEAD`), `SKIP_SWEEPGUARD=1`.
  Known false-allow: a commit MESSAGE containing ' -- ' (rare; backstopped
  by the echo). Applies to every agent session via the tracked
  `.claude/settings.json`.
- **Staged-set echo (visibility):** `.githooks/pre-commit` prints exactly
  what THIS commit contains, first thing — a swept file is loud, not
  silent (would have caught f84aff9). Covers humans + `--amend` too.
- **Canon:** working-agreements Checkpoint step 1 rewritten to the
  pathspec-commit form. The fuller structural fix (per-agent worktrees +
  branches) is top-10 candidate #9 — kills tree-level contention too,
  which pathspec commits do not.

Tested live (see the commit): a canary file staged alongside a pathspec
commit stayed OUT of the commit and REMAINED staged; a bare `git commit`
was blocked by the guard.

## 1d · Plan filenames now carry the authoring model (same session, later)

Human ask (sanity): plan files in `docs/plans/` are prefixed by the MODEL
of the session that WROTE them — `fable-`/`opus-` — provenance at a
glance, distinct from the in-file "Who builds this" routing. Verified via
each plan's authoring-commit `Assisted-by:` trailer (R2, not guessed): the
six 2026-07-02 plans → `opus-`, the four 2026-07-03 plans → `fable-`. All
ten `git mv`'d; every inbound path reference rewritten repo-wide (queue,
decisions, journals, brainstorms, archive, snapshot, `prd-drift.ts`,
ui-demos); convention codified in `docs/plans/README.md` + a WARN-only
pre-commit nag for unprefixed new plans. NOT retrofitted onto
`project/archive/` (don't mass-retrofit history).

## 2 · Second-wave suggestions: 25 → top 10 (same session, later)

The human asked for a wider ideation pass: 25 process-improvement
candidates, ranked, top 10 kept, 15 discarded. Authored
`project/brainstorms/2026-07-03-process-top10.md` (ranked by human-time
leverage × compounding × feasibility × non-overlap with the four in-flight
plans; discards summarized by category at the bottom) and queued it. The
human intends to pick 1–2; each pick becomes a full `docs/plans/` plan
before any build. Recommended pair: #1 balance-tuning cockpit + #3 CI.

## 3 · Top10 verdicts + the plan wave (same session, later)

The human went far past 1–2 picks. Verdicts (recorded in the brainstorm's
table): **picked** #1 cockpit, #3 CI (spec: parallel jobs per commit, ~5min
wall target, evaluate eslint→oxlint + prettier→oxc), #5 scenario saves,
#6 real-play telemetry (the human dictated the crux: attended-time
correctness — tab/user active vs idle; 5min+20min-away+5min must count as
10min of play, not 30), #8 narrative authoring format (read story as prose,
generate the code), #10 /ship; **rejected** #2 review tour + #9 worktrees
("don't care right now"); #7 picked as a deliberate PLACEHOLDER
(`fable-process-N7-taste-bar-enforcement.md`) gated on the taste.md lock.
Six Plan subagents dispatched across the wave; landed so far:
`fable-process-N10-ship-skill.md` (temp-worktree isolated build of HEAD +
live-site version proof as the R3 heart),
`fable-process-N1-balance-cockpit.md` (live-binding override layer
verified against real access patterns; URL-persisted overrides; export-
diff artifact; agents never tune — D-059 kept), and the
`fable-process-N7-taste-bar-enforcement.md` placeholder (authored
directly, not subagent — deliberately thin until taste.md locks). Still
in flight: #3 CI, #5 scenario saves, #6 telemetry, #8 narrative format.
Explanations of #2/#3/#5/#6/#7/#8 were given in-chat; the WIP-cap and CI
cases are summarized in the brainstorm verdicts.

## 4 · Series rename + all six plans landed + confidence lines (later)

Three human asks executed in one wave:

- **Series prefix:** the process mega-session's plans renamed to
  `fable-process-S{n}-` (the retro suggestions 1–5) and
  `fable-process-N{n}-` (the top-10 numbers) — `S`/`N` chosen because
  `R/H/D/F/A` already number reviews/decisions/feedback/rules. Convention
  generalized in `docs/plans/README.md` (`<model>-<series>-<slug>`);
  repo-wide reference sweep (incl. `prd-drift.ts`).
- **All six subagent plans landed:** N3 CI (web-grounded oxlint/oxfmt
  verdicts: two-tier lint — oxlint can't express the `new Date()` core
  ban; oxfmt behind a zero-diff parity proof; 2 parallel jobs ≈ 1.5 min
  vs the 5-min target), N5 scenario saves (byte-stable generated
  fixtures), N6 telemetry (pure sessionizer; the 5/20/5 case is a named
  unit test; grounded: hidden pauses the sim, blur does NOT), N8
  narrative format (real R3 beat as the worked example; found the R7
  'official'-vs-'lord' voice drift), after N1 cockpit + N10 ship earlier.
- **Confidence lines:** every fable plan's "Who builds" section now
  opens with `( X% Opus, Y% Fable )` per the human's ask —
  doubt-favors-Fable. Spread: 90/10 (checkpoint, cockpit, saves, ship),
  85/15 (ripple, telemetry), 80/20 (inbox), 70/30 (CI), 65/35 (sim),
  70% FABLE (taste-bar), 60% FABLE (narrative format).
- **Repair:** the other session's decisions.md linked the v0.3.5 build
  plan at `project/archive/` while the file lives in `docs/plans/` —
  repointed (it was blocking every commit via md-links).
- A first-attempt perl quoting error double-inserted 5 confidence lines
  (silently succeeded before the chain errored); caught by grep -c and
  deduped — the staged-set echo isn't the only place counts matter.
