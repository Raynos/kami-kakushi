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
- **Leave it resumable.** All state lives in commits + `journal/` (newest summary at the top) + the
  task list, so a cold pickup or a context compaction never loses progress.

Full version: [`memory/working-agreements.md`](memory/working-agreements.md).

## Conventions

- **Pure-core boundary.** Keep game logic (rules, state, math) in a **pure core** with no DOM/canvas
  imports, and let the renderer consume it as plain data. The core is then deterministic and
  unit-testable — the single most valuable architectural rule for a game.
- **Determinism: one RNG.** All randomness flows through a single seeded RNG so runs reproduce.
- **Single source of truth — generate, don't duplicate.** Anything derivable from the game's data
  (balance tables, content lists) is **generated** into `docs/`, never hand-maintained twice.
- **Playtest via code, not synthetic input.** Expose a DEV-only play API on `window` so the game can
  be driven and observed headlessly — see the `capture-game-states` skill.
- **Docs taxonomy.** `docs/*.md` says what the game **is now** (living, edited in place); `journal/`
  says **how it got here**. One doc per concern; edit living docs in place (don't fork copies).

## Layout

- [README.md](README.md) — the game's vision.
- [`memory/`](memory/) — durable per-fact notes: [working-agreements](memory/working-agreements.md)
  (cadence + autonomy) and [project-status](memory/project-status.md) (live snapshot + how to resume).
- [`docs/`](docs/) — design docs (living, edited in place). Empty until we start designing the game.
- [`docs/history/`](docs/history/) — the **ADR log** ([decisions.md](docs/history/decisions.md)) +
  changelogs: *why* the design is the way it is (not current state).
- [`human-in-the-loop/`](human-in-the-loop/) — the human's queue: decisions (`H`-items) and reviews
  (`R`-items) only a person can action.
- [`brainstorms/`](brainstorms/) — raw discovery / Q&A capture (the `grill-me` skill writes here);
  settled designs graduate to `docs/`. [PARKED-THREADS.md](brainstorms/PARKED-THREADS.md) indexes tangents.
- `journal/` — one short markdown log per work session (newest summary at the top); see
  [`_TEMPLATE.md`](journal/_TEMPLATE.md).
- [`archive/`](archive/) — superseded markdown docs kept for reference (archive, don't delete).
- [`audit/`](audit/) — QA screenshots/recordings + findings, from the `capture-game-states` skill.
- `.claude/skills/` — `grill-me` (stress-test a design / extract one into a doc) and
  `capture-game-states` (drive the game headlessly and screenshot/record its states).
