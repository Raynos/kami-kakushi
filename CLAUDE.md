# CLAUDE.md

A single-player **HTML5 browser game**, built agentically with Claude Code. The game's vision lives
in [README.md](README.md); this file is just how we work.

## How to work here

- **Autonomous by default.** Pick the next task → build it → verify it → commit it → journal it →
  repeat. The human steers *direction*; you own *execution*. Don't ask permission for routine
  forward progress.
- **Bias to action.** When a routine choice has a sensible default, take it, note it, and move on —
  don't stall for confirmation.
- **Many small commits, straight to the working branch.** Don't branch for routine work — committing
  as you go *is* the workflow. *(This overrides the generic "branch off main / commit only when
  asked" default.)* Each commit leaves the build working and stages a `journal/` entry (enforced by
  `.githooks/pre-commit`; `SKIP_JOURNAL=1` for trivial commits). Enable the hook once per clone:
  `git config core.hooksPath .githooks`.
- **Use Workflows for substantial / parallelizable work** (e.g. fan-out research, multi-file sweeps).
- **Stop and ask only for** (1) design decisions that change what the game *is* — lock these with the
  human and record them as ADRs in [`docs/history/decisions.md`](docs/history/decisions.md); and
  (2) anything outward-facing or hard to reverse (push, deploy, delete) — never without approval.
- **Leave it resumable.** All state lives in commits + the `journal/` log (chronological — summary at top,
  entries appended at the **bottom**) + `memory/project-status.md` (the **live snapshot**) + the task list, so a
  cold pickup or a context compaction never loses progress.

Full version: [`memory/working-agreements.md`](memory/working-agreements.md).

## Conventions

- **Pure-core boundary.** Keep game logic (rules, state, math) in a **pure core** with no DOM/canvas
  imports, and let the renderer consume it as plain data. The core is then deterministic and
  unit-testable — the single most valuable architectural rule for a game.
- **Determinism: one RNG.** All randomness flows through a single seeded RNG so runs reproduce.
- **Single source of truth — generate, don't duplicate.** Anything derivable from the game's data
  (balance tables, content lists) is **generated** into `docs/`, never hand-maintained twice.
- **Playtest via code, not synthetic input.** Expose a DEV-only play API on `window` so the game can
  be driven and observed headlessly — see the `capture-game-states` skill and the
  [QA & playtesting plan](docs/plans/qa-playtesting.md).
- **QA fun & visuals, not just function.** A compiling build isn't the bar — the game must be *paced
  and fun* and *look intentional* (woodblock/ink, **not** generic AI-slop). Three distinct living docs
  own this: **what fun *is* & how to keep it high** → [`docs/fun-factor.md`](docs/fun-factor.md); **how
  Claude drives / observes / screenshots the game to play-test it** (the harness + MCP tools + the
  fun-proxy *measurement*) → [`docs/plans/qa-playtesting.md`](docs/plans/qa-playtesting.md); **the visual
  language** → [`docs/ui-design.md`](docs/ui-design.md). The agent reviews its own screenshots with its
  own vision and iterates; the human is the final fun & taste arbiter.
- **Docs taxonomy.** `docs/*.md` says what the game **is now** (living, edited in place); `journal/`
  says **how it got here** (a chronological log — append at the bottom, never prepend; the live snapshot is
  `memory/project-status.md`). One doc per concern; edit living docs in place (don't fork copies).
- **Freeze = locked intent, not the plan.** "Freezing" the PRD scopes to **locked intent** — the
  §1 vision + the human-signed acceptance criteria (no-magic / mediocre-start / trade ≤⅓ /
  active-only, the four pillars + estate spine, the ≥30-min-per-rank / 70-30 / ~28.5h / tier-gate
  targets) — **not** the route there: the §4 balance numbers and §7 M2–M7 milestone detail stay
  **provisional** (already tagged "proposed v1 balance") and are revised by playtest. Build M0+M1
  against the current [prd.md](docs/prd.md) **first**, playtest, **then** explode it — freeze §1 as a
  tagged vision snapshot, move the roadmap to a **living** `docs/roadmap.md`, and **generate** balance
  into `docs/content/`. Never freeze M2–M7 as locked canon; the v1 scope (T0–T2) lock is unchanged.
  See **D-021** (refines D-020).
- **Temporary files → `./tmp/`.** Use the repo-local, git-ignored [`tmp/`](tmp/) for all scratch /
  working files (intermediate output, throwaway scripts, scratch notes) — **not** the global system
  scratchpad. Anything worth keeping graduates to `docs/`, `brainstorms/`, `audit/`, or `journal/`.
- **Durable capture of workflow / subagent outputs.** `Workflow` results live only in ephemeral session
  scratch (`<session>/tasks/<id>.output`) and **die with the session** — never leave research stranded
  there. After **every workflow**: (1) **snapshot the raw `.output` JSON verbatim** into
  [`brainstorms/raw/`](brainstorms/raw/) (timestamped) via `scripts/snapshot-research.sh <output-file>
  <slug>` — cheap, lossless insurance; (2) **distill** the useful parts into the right living doc
  (`docs/`) or discovery doc (`brainstorms/`); (3) **commit immediately** (a small checkpoint). Subagent
  (Agent-tool) results are returned to the main agent — capture their substance in a doc, but do **not**
  copy subagent `.output` files (huge JSONL transcripts). Raw snapshots are verbatim insurance; the
  distillations are the source of truth.

## Layout

- [README.md](README.md) — the game's vision.
- [`memory/`](memory/) — durable per-fact notes: [working-agreements](memory/working-agreements.md)
  (cadence + autonomy) and [project-status](memory/project-status.md) (live snapshot + how to resume).
- [`docs/`](docs/) — design docs (living, edited in place): **[prd.md](docs/prd.md)** (the merged PRD /
  vision spec), **[prd_human_feedback.md](docs/prd_human_feedback.md)** (the consolidated human-steering &
  QA-answers audit record), **[plans/qa-playtesting.md](docs/plans/qa-playtesting.md)** (how Claude
  play-tests the game), **[fun-factor.md](docs/fun-factor.md)** (what fun is & how to keep it high),
  **[ui-design.md](docs/ui-design.md)** (the woodblock/ink UI design-language bible). Generated
  content/balance tables will land under `docs/content/`.
- [`docs/history/`](docs/history/) — the **ADR log** ([decisions.md](docs/history/decisions.md)) +
  changelogs: *why* the design is the way it is (not current state).
- [`human-in-the-loop/`](human-in-the-loop/) — the human's queue: decisions (`H`-items) and reviews
  (`R`-items) only a person can action.
- [`brainstorms/`](brainstorms/) — raw discovery / Q&A capture (the `grill-me` skill writes here);
  settled designs graduate to `docs/`. [PARKED-THREADS.md](brainstorms/PARKED-THREADS.md) indexes tangents.
  [`raw/`](brainstorms/raw/) holds **verbatim** `Workflow`-output JSON snapshots (durable insurance).
- `scripts/` — repo dev/maintenance scripts (e.g. [`snapshot-research.sh`](scripts/snapshot-research.sh)).
- `journal/` — per-session chronological **LOG** (history, not live state): **summary at top, entries appended
  at the BOTTOM (never prepend)**; one file per session; the live snapshot is `memory/project-status.md`. See
  [`README`](journal/README.md) + [`_TEMPLATE.md`](journal/_TEMPLATE.md).
- [`archive/`](archive/) — superseded markdown docs kept for reference (archive, don't delete).
- [`audit/`](audit/) — QA screenshots/recordings + findings, from the `capture-game-states` skill.
- [`tmp/`](tmp/) — repo-local scratchpad for throwaway working files (git-ignored except its README).
- `.claude/skills/` — `grill-me` (stress-test a design / extract one into a doc) and
  `capture-game-states` (drive the game headlessly and screenshot/record its states).
