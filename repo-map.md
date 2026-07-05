# Repo map

Where things live — the directory map for this repo. This is the canonical layout
reference; it is `@`-included into [`AGENTS.md`](AGENTS.md) so it stays in
always-loaded context while being editable on its own.

- [README.md](README.md) — the game's vision.
- [CHANGELOG.md](CHANGELOG.md) — the release log (Keep-a-Changelog, newest-first;
  the footer/About modal link to it). A version bump in `package.json` **must** add
  its `## [x.y.z]` section — the `verify-changelog` gate enforces it (A22).
- [`project/status/`](project/status) — **live operational state** + **live
  trackers** (mutable, edited in place; this is where a checkbox tracker
  belongs, **not** `docs/plans/`, which is pre-canon proposals):
  [working-agreements](project/status/working-agreements.md) (cadence +
  autonomy) and [project-status](project/status/project-status.md) (live
  snapshot + how to resume). *(A transient `pending-prd-changes` ripple tracker
  lived here through the 6-tier reshape; it was **retired 2026-06-29** once the
  ripple landed in the PRD — the pattern, a "locked-ADRs-not-yet-rippled"
  checklist deleted when empty, may recur.)*
- [`docs/`](docs) — design docs (living, edited in place), under
  **[`docs/living/`](docs/living)**: **[prd.md](docs/living/prd.md)** (the
  merged PRD / vision spec), **[decisions.md](docs/living/decisions.md)** (the
  **ADR log** — *why* the design is the way it is),
  **[roadmap.md](docs/living/roadmap.md)** (the milestone tracker),
  **[ui-design.md](docs/living/ui-design.md)** (the woodblock/ink UI bible),
  **[fun-factor.md](docs/living/fun-factor.md)** (what fun is),
  **[qa-playtesting.md](docs/living/qa-playtesting.md)** (how Claude
  play-tests). Generated content/balance tables live under
  **[`docs/content/`](docs/content)** (e.g. t0-content.md), produced by
  `src/scripts/gen-docs.ts`. Reviewable **implementation plans / proposals /
  reel-backs** (pre-canon, awaiting sign-off) live under
  **[`docs/plans/`](docs/plans)** — **active only**; a plan **graduates to
  [`project/archive/`](project/archive)** once it's done (Status line ✅), so
  `docs/plans/` never accumulates finished plans.
- [`project/human-feedback/`](project/human-feedback) — the human's **direct
  feedback** (a live inbox; one dated file per session); closed records stay
  alongside (e.g. `2026-06-26-prd-human-feedback.md`, the PRD-feedback log, now
  applied to the PRD).
- [`project/human-in-the-loop/`](project/human-in-the-loop) — the human's queue:
  **open** decisions (`H`-items) and reviews (`R`-items) only a person can
  action; closed `H`-items **and** `R`-items graduate to a one-line row in
  [`archive.md`](project/human-in-the-loop/archive.md) (two sections —
  **Decisions** + **Reviews**; H-items also graduate to an ADR), and leave the
  live `decisions.md`/`review.md` open-only (see that dir's `README` for the
  lifecycle). [`project/todo-human.md`](project/todo-human.md) is the companion
  list: loose **TODOs** for the human plus the **reading queue**. **What belongs
  in the reading queue** — *any durable doc whose purpose is for the human to
  read / review / sign off*: an implementation **plan** or proposal
  (`docs/plans/`), a **brainstorm or retrospective put up for adoption**
  (`project/brainstorms/`), an **audit / battery report** or **changelog**
  (`project/audit/reports/`), or a **design doc awaiting a taste call**. Add it
  **in the same commit you author it**. **Sign-off is implicit and the agent owns
  the cleanup (D-089):** the human never ticks these off — once they've read a
  doc or it comes up in discussion, the agent removes it; `/prepare-to-exit`
  reconciles the queue and asks the human to confirm uncertain removals. The
  test is *"do I need a human to read this?"* — raw discovery dumps /
  agent-internal notes don't qualify. A pre-commit **gate** enforces this only
  as high as each path *soundly* holds (so it never cries wolf): a new
  `docs/plans/*.md` missing from the queue **hard-blocks** (the queue's history
  shows ~every plan is queued); a new `project/brainstorms/` or
  `project/audit/reports/` doc missing from it is a **loud warn** (those dirs
  are mostly agent-internal). `SKIP_QUEUE=1` bypasses for the rare
  not-for-the-human plan. Both lists are auto-surfaced at session start by the
  `session-brief.sh` hook (see AGENTS.md "How to work here").
- [`project/brainstorms/`](project/brainstorms) — raw discovery / Q&A capture
  (the `grill-me` skill writes here); settled designs graduate to `docs/`. See its
  [`README`](project/brainstorms/README.md);
  [PARKED-THREADS.md](project/brainstorms/PARKED-THREADS.md) indexes tangents.
  [`raw/`](project/brainstorms/raw) holds **verbatim** `Workflow`-output JSON
  snapshots — **git-ignored, local-disk-only session-resume insurance**; its
  [`README`](project/brainstorms/raw/README.md) is the canonical detail.
- `src/scripts/` — repo dev/maintenance scripts (e.g.
  [`snapshot-research.sh`](src/scripts/snapshot-research.sh),
  [`session-brief.sh`](src/scripts/session-brief.sh) — the session-start
  human-queue brief).
- [`src/core/content/narrative/`](src/core/content/narrative) — **F5 narrative
  authoring sources**: the T0 story as structured markdown (`rung-beats.md`,
  `intro.md`, `dialogue.md`, `cold-open.md` — prose-first, readable as a script;
  spec in its [`README`](src/core/content/narrative/README.md)). `gen-narrative`
  (`gen:narrative`, the `gen-narrative` gate) compiles them to `*.gen.ts`
  registries the hand-written modules re-export, plus the one-page reading
  script [`docs/content/t0-story.md`](docs/content/t0-story.md). Story edits
  land HERE, never in the `.gen.ts`.
- [`src/fixtures/`](src/fixtures) — **F6 scenario-save library**: named,
  GENERATED start-states so "reproduce X" is "load X, look". `specs.ts` drives the
  REAL engine to each waypoint (nothing hand-authored); `gen-fixtures.ts`
  (`fixtures:regen`/`:check`, the `fixtures` gate) writes `saves/*.json`; the DEV
  panel **Scenarios** tab + `__qa.loadFixture` + `?fixture=` load them (DEV-only,
  strip-gated). Consumed by the QA harness — see qa-playtesting.md §1.
- `project/journal/` — per-session chronological **LOG** (history, not live
  state); one file per session (ordering rule: see AGENTS.md → "Kami-kakushi
  specifics" → "Docs taxonomy"). See [`README`](project/journal/README.md) +
  [`_TEMPLATE.md`](project/journal/_TEMPLATE.md).
- [`project/archive/`](project/archive) — superseded markdown docs kept for
  reference (archive, don't delete). **Completed `docs/plans/` plans graduate
  here** the moment they're done, keeping `docs/plans/` active-only.
- [`project/audit/`](project/audit) — QA outputs: written findings/reports under
  `reports/` + screenshots/ recordings under `screens/` (one dated pass-folder
  each; `screens/latest/` is the live `qa-shots.mjs` gallery).
- [`project/playtest-inbox/`](project/playtest-inbox) — **agent-facing** transport
  queue for in-game playtest captures (F3): `pending/` holds captures waiting to
  be drained (`/drain-inbox`), `archive/` keeps drained ones long-term. The `.md`
  (note + deterministic save) is committed; the `.png` screenshot is git-ignored.
  Not the human queue — see its [`README`](project/playtest-inbox/README.md).
- [`project/telemetry/`](project/telemetry) — **git-ignored** real-play
  attended-time reports (F8): one `<runId>.md` per game run, auto-dropped on
  session-end by the DEV telemetry (`src/telemetry/` + the `telemetry-drop`
  vite dev-middleware). Local sensor data agents read before balance work —
  never committed; the [`README`](project/telemetry/README.md) (committed)
  carries the contract incl. the diary rule (distill conclusions into
  committed notes).
- [`raw/`](raw) — **committed reference material from outside the repo**:
  [`screenshots/`](raw/screenshots) holds the human-captured shots of the two
  README inspiration games (proto23, yet-another-idle-rpg — the D-126 density
  references), one folder per game, annotated in its
  [`README`](raw/screenshots/README.md). *(Distinct from
  `project/brainstorms/raw/`, which is git-ignored scratch.)*
- [`tmp/`](tmp) — repo-local scratchpad for throwaway working files (git-ignored
  except its README).
- `.claude/skills/` — `grill-me` (stress-test a design / extract one into a
  doc), `capture-game-states` (drive the game headlessly and screenshot/record
  its states), `battery` (run a multi-lens fresh-eyes stress-test battery over
  the spec/design/build), `tdd` (test-first authoring — red→green→refactor
  through the pure-core public contract; adopted ~1:1 from
  [mattpocock/skills](https://github.com/mattpocock/skills)), `diverge` (FULL
  2–3 working UI variants live behind a DEV-panel toggle → self-pick + a
  per-variant R-item; zero PROD flag-debt; mandatory for new/major UI
  surfaces — D-075 v2), `handoff`
  (compact the session into a `/handoff` doc for a fresh agent to resume;
  adopted ~1:1), `distill-taste` (triage a new feedback corpus into the CAPPED
  taste standard — five moves, never append; budgets + coverage + prediction
  test; top-layer changes human-locked; user-invoked only via
  `/distill-taste`), `prepare-to-exit` (the runnable form of the **checkpoint
  ritual** — commit own work → journal → snapshot → push `main` → confirm clean;
  user-invoked only via `/prepare-to-exit`), and `ship` (the one-command
  **release train** — bump → CHANGELOG → tagged release commit → push →
  `src/scripts/ship.sh` isolated build + gh-pages push, fast & bounded, done
  at the push; user-invoked only via `/ship`, never agent-initiated — F9).
