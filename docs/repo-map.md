# Repo map

Where things live — the directory map for this repo. This is the canonical layout
reference; it is `@`-included into [`AGENTS.md`](../AGENTS.md) so it stays in
always-loaded context while being editable on its own.

- [README.md](../README.md) — the game's vision.
- [CHANGELOG.md](../CHANGELOG.md) — the release log (Keep-a-Changelog, newest-first;
  the footer/About modal link to it). A version bump in `package.json` **must** add
  its `## [x.y.z]` section — the `verify-changelog` gate enforces it (AC-22).
- [`docs/story-bible/`](../docs/story-bible) — **the story bible doc-set** (living,
  the single home of story canon; born in the 2026-07-07 story reboot): README
  index + split sections (00-kernel · 01-laws · 02-house · 03-tiers · 04-cast ·
  05-world) + [`tiers/`](../docs/story-bible/tiers) per-tier detail sheets.
  `docs/living/story-bible.md` is a SYMLINK to its README (links inside are
  written to resolve from both places).
- [`docs/guides/`](../docs/guides) — **how-to guides** (living, but process not
  canon): [qa-playtesting.md](../docs/guides/qa-playtesting.md) (how Claude
  play-tests — harness, MCP tools, balance flows),
  [sfx-spec.md](../docs/guides/sfx-spec.md) (the audio contract),
  [plan-authoring.md](../docs/guides/plan-authoring.md) (the three plan
  templates — `build`/`process`/`ops` — whose mandatory sections the
  pre-commit `verify-plan-template` gate enforces on NEW plans), and the **map
  set**: [map-spec.md](../docs/guides/map-spec.md) (what T0/T1 depict + the
  blind-pass rubric), [map-authoring.md](../docs/guides/map-authoring.md) (build/
  edit/verify procedures — pin discipline, blind-pass loop, model routing),
  [map-styles.md](../docs/guides/map-styles.md) (scale classes mura-ezu→kuniezu +
  designing NEW tier sheets, spec→HR→build). Code-adjacent orientation:
  [`src/ui/map-sheets/README.md`](../src/ui/map-sheets/README.md).
  Moved out of `docs/living/` 2026-07-07 so living holds only core canon.
- [`project/status/`](../project/status) — **live operational state** + **live
  trackers** (mutable, edited in place; this is where a checkbox tracker
  belongs, **not** `docs/plans/`, which is pre-canon proposals):
  [working-agreements](../project/status/working-agreements.md) (cadence +
  autonomy) and [project-status](../project/status/project-status.md) (live
  snapshot + how to resume). *(A transient `pending-prd-changes` ripple tracker
  lived here through the 6-tier reshape; it was **retired 2026-06-29** once the
  ripple landed in the PRD — the pattern, a "locked-ADRs-not-yet-rippled"
  checklist deleted when empty, may recur.)*
- [`docs/`](../docs) — design docs (living, edited in place), under
  **[`docs/living/`](../docs/living)**: **[prd.md](../docs/living/prd.md)** (the PRD
  index/preamble — the body is split per-section under
  [`docs/living/prd/`](../docs/living/prd)), **[decisions.md](../docs/living/decisions.md)** (the
  **ADR log** — *why* the design is the way it is),
  **[roadmap.md](../docs/living/roadmap.md)** (the milestone tracker),
  **[ui-design.md](../docs/living/ui-design.md)** (the woodblock/ink UI bible),
  **[fun-factor.md](../docs/living/fun-factor.md)** (what fun is),
  **[qa-playtesting.md](../docs/guides/qa-playtesting.md)** (how Claude
  play-tests). Generated content/balance tables live under
  **[`docs/content/`](../docs/content)** (e.g. t0-content.md), produced by
  `src/scripts/gen-docs.ts`. Reviewable **implementation plans / proposals /
  reel-backs** (pre-canon, awaiting sign-off) live under
  **[`docs/plans/`](../docs/plans)** — **active only**; a plan **graduates to
  [`project/archive/`](../project/archive)** once it's done (Status line ✅), so
  `docs/plans/` never accumulates finished plans.
- [`project/feedback-human/`](../project/feedback-human) — the human's **direct
  feedback** (a live inbox; one dated file per session); closed records stay
  alongside (e.g. `2026-06-26-prd-human-feedback.md`, the PRD-feedback log, now
  applied to the PRD).
- [`project/human-in-the-loop/`](../project/human-in-the-loop) — the human's queue:
  **open** decisions (`HD`-items) and reviews (`HR`-items) only a person can
  action; closed `HD`-items **and** `HR`-items graduate to a one-line row in
  [`archive.md`](../project/human-in-the-loop/archive.md) (two sections —
  **Decisions** + **Reviews**; HD-items also graduate to an ADR), and leave the
  live `decisions.md`/`review.md` open-only (see that dir's `README` for the
  lifecycle). **Every HR-item has ONE home in the game (2026-07-13): the
  DEV panel's `Review` tab** — Variants ⇄ Story behind one switch. The
  diverged-surface registry lives in
  [`src/ui/dev-surfaces.ts`](../src/ui/dev-surfaces.ts) (moved out of
  `dev.ts` so a gate can import it); story bundles declare theirs in
  `takes/*/bundle.md`. Each DEV row carries its **HR-n** chip; each
  HR-item names the surface/bundle **id** to click (`market`,
  `sleep-announce` — stable, never renumbered; the old positional
  `V<n>`/`SV<n>` tags are dead, ADR-192); the **`review-link`** gate
  ([`verify-review-link.ts`](../src/scripts/verify-review-link.ts))
  binds both directions, so a pruned or re-homed toggle goes RED
  instead of sending the human to a missing row. A surface she has settled keeps no
  toggle (ADR-075 zero flag-debt); a bundle she asked to KEEP declares
  `hr: none · <why>` and is left out of the queue counts.
  [`project/todo-human.md`](../project/todo-human.md) is the companion
  list: loose **TODOs** for the human plus the **reading queue**. **The `## TODO`
  section is HUMAN-authored — an agent NEVER appends to it** (human, 2026-07-06):
  an agent-surfaced finding or question is an **HD-item** (`decisions.md`) or
  **HR-item** (`review.md`) in `human-in-the-loop/`; a pre-commit gate hard-blocks
  added TODO lines (`SKIP_HUMAN_TODO=1` only for a TODO the human dictated
  verbatim);
  [`project/BACKLOG.md`](../project/BACKLOG.md) holds work the human has
  deliberately parked — never nagged by the session brief. **What belongs
  in the reading queue** — *any durable doc whose purpose is for the human to
  read / review / sign off*: an implementation **plan** or proposal
  (`docs/plans/`), a **brainstorm or retrospective put up for adoption**
  (`project/brainstorms/`), an **audit / battery report** or **changelog**
  (`project/audit/reports/`), or a **design doc awaiting a taste call**. Add it
  **in the same commit you author it**. **Sign-off is implicit and the agent owns
  the cleanup (ADR-089):** the human never ticks these off — once they've read a
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
- [`project/brainstorms/`](../project/brainstorms) — raw discovery / Q&A capture
  (the `grill-me` skill writes here); settled designs graduate to `docs/`. See its
  [`README`](../project/brainstorms/README.md);
  [PARKED-THREADS.md](../project/brainstorms/PARKED-THREADS.md) indexes tangents.
  [`raw/`](../project/brainstorms/raw) holds **verbatim** `Workflow`-output JSON
  snapshots — **git-ignored, local-disk-only session-resume insurance**; its
  [`README`](../project/brainstorms/raw/README.md) is the canonical detail.
- `src/scripts/` — repo dev/maintenance scripts (e.g.
  [`snapshot-research.sh`](../src/scripts/snapshot-research.sh),
  [`session-brief.sh`](../src/scripts/session-brief.sh) — the session-start
  human-queue brief).
- [`src/core/content/narrative/`](../src/core/content/narrative) — **FB-5 narrative
  authoring sources**: the T0 story as structured markdown (`rung-beats.md`,
  `intro.md`, `dialogue.md`, `cold-open.md` — prose-first, readable as a script;
  spec in its [`README`](../src/core/content/narrative/README.md)). `gen-narrative`
  (`gen:narrative`, the `gen-narrative` gate) compiles them to `*.gen.ts`
  registries the hand-written modules re-export, plus the one-page reading
  script [`docs/content/t0-story.md`](../docs/content/t0-story.md). Story edits
  land HERE, never in the `.gen.ts`.
- [`src/tests/e2e/`](../src/tests/e2e) — the **mobile e2e lane**: Playwright specs (`mobile-layout` /
  `mobile-journey` + `helpers`) driven by root `playwright.config.ts` on two real
  mobile profiles (Android Chrome + iOS-floor WebKit) against the DEV server.
  `pnpm run test:e2e` locally; gates in CI via `.github/workflows/e2e.yml` (NOT a
  `verify` gate — the commit budget, 5s soft / 8s hard, ADR-072/ADR-176). Spec + rationale:
  [qa-playtesting.md §1 "Mobile e2e lane"](../docs/guides/qa-playtesting.md).
- `.github/workflows/` — the CI fan-out: `verify` (push/PR — the gate roster) ·
  `verify-nightly` (clean-clone canary + prod build + strip check +
  `verify:tooling`, the process-scaffolding meta-suite) · `build` · `lint` ·
  `test` · `typecheck` · `e2e`.
- [`src/fixtures/`](../src/fixtures) — **FB-6 scenario-save library**: named,
  GENERATED start-states so "reproduce X" is "load X, look". `specs.ts` drives the
  REAL engine to each waypoint (nothing hand-authored); `gen-fixtures.ts`
  (`fixtures:regen`/`:check`, the `fixtures` gate) writes `saves/*.json`; the DEV
  panel **Scenarios** tab + `__qa.loadFixture` + `?fixture=` load them (DEV-only,
  strip-gated). Consumed by the QA harness — see qa-playtesting.md §1.
- `project/journal/` — per-session chronological **LOG** (history, not live
  state); one file per session (ordering rule: see AGENTS.md → "Kami-kakushi
  specifics" → "Docs taxonomy"). See [`README`](../project/journal/README.md) +
  [`_TEMPLATE.md`](../project/journal/_TEMPLATE.md).
- [`project/archive/`](../project/archive) — superseded markdown docs kept for
  reference (archive, don't delete). **Completed `docs/plans/` plans graduate
  here** the moment they're done, keeping `docs/plans/` active-only.
- [`project/audit/`](../project/audit) — QA outputs: written findings/reports under
  `reports/` + screenshots/ recordings under `screens/` (one dated pass-folder
  each; `screens/latest/` is the live `qa-shots.mjs` gallery).
- [`project/prototypes/`](../project/prototypes) — **standalone interactive
  feel-tests** (permanent; born 2026-07-09): self-contained single-file HTML
  mocks a human plays to judge a proposed mechanic/surface before its plan is
  judged — **grouped one folder per OWNING PLAN** (human, 2026-07-09), one
  self-contained dir per prototype inside, each tagged ⭐ POTENTIAL or
  REFERENCE in the README; mock-data-only, lint-excluded, never imports
  `src/`. Replaced the retired
  one-time `ui-demos/` ground (deleted 2026-07-09; its UI-remaster field lives
  in git history — see the ADR-127 note). Rules:
  [`README`](../project/prototypes/README.md).
- [`project/playtest-inbox/`](../project/playtest-inbox) — **agent-facing** transport
  queue for in-game playtest captures (FB-3): `pending/` holds captures waiting to
  be drained (`/drain-inbox`), `archive/` keeps drained ones long-term. The `.md`
  (note + deterministic save) is committed; the `.png` screenshot is git-ignored.
  Not the human queue — see its [`README`](../project/playtest-inbox/README.md).
- [`project/telemetry/`](../project/telemetry) — **git-ignored** real-play
  attended-time reports (FB-8): one `<runId>.md` per game run, auto-dropped on
  session-end by the DEV telemetry (`src/telemetry/` + the `telemetry-drop`
  vite dev-middleware). Local sensor data agents read before balance work —
  never committed; the [`README`](../project/telemetry/README.md) (committed)
  carries the contract incl. the diary rule (distill conclusions into
  committed notes).
- [`project/raw/`](../project/raw) — **committed reference material from outside the repo**:
  [`screenshots/`](../project/raw/screenshots) holds the human-captured shots of the two
  README inspiration games (proto23, yet-another-idle-rpg — the ADR-126 density
  references), one folder per game, annotated in its
  [`README`](../project/raw/screenshots/README.md). *(Distinct from
  `project/brainstorms/raw/`, which is git-ignored scratch.)*
- [`tmp/`](../tmp) — repo-local scratchpad for throwaway working files (git-ignored
  except its README).
- `.claude/skills/` — `grill-me` (stress-test a design / extract one into a
  doc), `capture-game-states` (drive the game headlessly and screenshot/record
  its states), `battery` (run a multi-lens fresh-eyes stress-test battery over
  the spec/design/build), `tdd` (test-first authoring — red→green→refactor
  through the pure-core public contract; adopted ~1:1 from
  [mattpocock/skills](https://github.com/mattpocock/skills)), `diverge` (FULL
  2–3 working UI variants live behind a DEV-panel toggle → self-pick + a
  per-variant HR-item; zero PROD flag-debt; mandatory for new/major UI
  surfaces — ADR-075 v2), `handoff`
  (compact the session into a `/handoff` doc for a fresh agent to resume;
  adopted ~1:1), `distill-taste` (triage a new feedback corpus into the CAPPED
  taste standard — five moves, never append; budgets + coverage + prediction
  test; top-layer changes human-locked; user-invoked only via
  `/distill-taste`), `prepare-to-exit` (the runnable form of the **checkpoint
  ritual** — commit own work → journal → snapshot → push `main` → confirm clean;
  user-invoked only via `/prepare-to-exit`), and `ship` (the one-command
  **release train** — bump → CHANGELOG → tagged release commit → push →
  `src/scripts/ship.sh` isolated build + gh-pages push, fast & bounded, done
  at the push; user-invoked only via `/ship`, never agent-initiated — FB-9),
  and `map-sheets` (THE map-work entry point — routes edit / zone / primitive /
  new-tier-sheet jobs to the map guides under the golden-pin + blind-pass
  laws; built so non-Fable sessions do map work safely).
- `.claude/workflows/` — committed Workflow-tool scripts:
  [`map-blind-pass.js`](../.claude/workflows/map-blind-pass.js) (one-command map
  verification: capture → blind describe per sheet → judge vs map-spec §5 →
  scored report into `project/audit/reports/`).
