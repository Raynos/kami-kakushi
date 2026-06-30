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
  asked" default.)* Each commit runs the **full `npm run verify`** (~1.7s — its 9 gates [tsc, lint, tests,
  content, pacing, playcheck, …] run in **parallel** via `src/scripts/verify-run.ts`) and stages a
  `project/journal/` entry (enforced by `.githooks/pre-commit`; `SKIP_VERIFY=1` for a docs-only commit,
  `SKIP_JOURNAL=1` for trivial commits). A soft 5s **drift timer** warns (never blocks) as the gate slows;
  `npm run verify:budget` is the hard, on-demand budget check (D-072). Enable the hook once per clone:
  `git config core.hooksPath .githooks`.
- **Use Workflows for substantial / parallelizable work** (e.g. fan-out research, multi-file sweeps).
- **Stop and ask only for** (1) design decisions that change what the game *is* — lock these with the
  human and record them as ADRs in [`docs/living/decisions.md`](docs/living/decisions.md); and
  (2) anything outward-facing or hard to reverse (push, deploy, delete) — never without approval.
- **Leave it resumable.** All state lives in commits + the `project/journal/` log (chronological — summary at top,
  entries appended at the **bottom**) + `project/status/project-status.md` (the **live snapshot**) + the task list, so a
  cold pickup or a context compaction never loses progress.
- **Checkpoint = make the work resumable from disk *and on the remote*, right now.** When asked to "checkpoint" (or
  before exiting), run the loop: **commit completed work → stage a `journal/` entry → bring
  `project/status/project-status.md` current → `git push origin main` → confirm the tree is clean (or note exactly
  what's intentionally left).** **Pushing `main` is part of a checkpoint, not a separate ask** — this is the standing
  approval that overrides the generic "never push without approval" default *for the routine main checkpoint* (a
  destructive/outward action like a deploy or a force-push still needs explicit sign-off). The push is what makes the
  checkpoint trustworthy: it fires the **pre-push gate** (`.githooks/pre-push` — runs `npm run verify` on **every push,
  all branches**, and **refuses any red push**) — so a green `origin/main` is the proof the checkpoint is real. Three
  non-negotiables, all learned the hard way:
  **(1) Verify before you claim** — never say *pushed / green / done* without checking (`git status`, `git log
  origin/main..main`, the actual push succeeding); a clean working tree at checkpoint can go dirty a moment later.
  **(2) Shared-tree safety** — this repo may have **more than one agent editing the working tree at once**. **NEVER**
  `git stash`, `checkout`, `restore`, or otherwise mutate files you didn't author. Stage **only your own files, by
  explicit path** (`git add path/a path/b`, never `git add -A`/`git commit -a`), and leave everyone else's uncommitted
  WIP untouched. **(3) Don't fight someone else's red.** The pre-push gate verifies the **working tree**, so another
  agent's in-flight red WIP will (correctly) block your push. That's expected — leave your commit local, note
  it in `project-status.md`, and do **not** `SKIP_VERIFY=1`-override a red tree onto the remote. (`SKIP_VERIFY=1` is
  only for *committing* your own isolated change locally, never for pushing red to `main`.) Full checklist:
  working-agreements.md.
- **Session start → surface what's waiting on the human.** A `SessionStart` hook runs
  [`src/scripts/session-brief.sh`](src/scripts/session-brief.sh) (wired in `.claude/settings.json`), which prints the
  open **human queue** — the unticked **TODOs** + **reading queue** ([`project/todo-human.md`](project/todo-human.md))
  plus open decisions (`H`-items) and reviews (`R`-items) in [`project/human-in-the-loop/`](project/human-in-the-loop).
  **Lead each fresh session by relaying that brief to the human** before diving into work, so blocking sign-offs
  don't sit unseen. Run it by hand any time: `bash src/scripts/session-brief.sh`.

Full version: [`project/status/working-agreements.md`](project/status/working-agreements.md).

## Conventions

- **Pure-core boundary.** Keep game logic (rules, state, math) in a **pure core** with no DOM/canvas
  imports, and let the renderer consume it as plain data. The core is then deterministic and
  unit-testable — the single most valuable architectural rule for a game.
- **Determinism: one RNG.** All randomness flows through a single seeded RNG so runs reproduce.
- **Single source of truth — generate, don't duplicate.** Anything derivable from the game's data
  (balance tables, content lists) is **generated** into `docs/`, never hand-maintained twice.
- **Playtest via code, not synthetic input.** Expose a DEV-only play API on `window` so the game can
  be driven and observed headlessly — see the `capture-game-states` skill and the
  [QA & playtesting guide](docs/living/qa-playtesting.md).
- **QA fun & visuals, not just function.** A compiling build isn't the bar — the game must be *paced
  and fun* and *look intentional* (woodblock/ink, **not** generic AI-slop). Three distinct living docs
  own this: **what fun *is* & how to keep it high** → [`docs/living/fun-factor.md`](docs/living/fun-factor.md); **how
  Claude drives / observes / screenshots the game to play-test it** (the harness + MCP tools + the
  fun-proxy *measurement*) → [`docs/living/qa-playtesting.md`](docs/living/qa-playtesting.md); **the visual
  language** → [`docs/living/ui-design.md`](docs/living/ui-design.md). The agent reviews its own screenshots with its
  own vision and iterates; the human is the final fun & taste arbiter.
- **Design by divergence (new/major UI surfaces) — D-075 (v2, refines D-073).** No new or majorly-restyled UI
  surface ships from a single idea — run the **`diverge`** skill for **FULL 2–3 distinct, *working* approaches**.
  **No "diverge-LITE" single-idea shortcut, and no buggy variants** — every variant must actually work. The
  variants live **in the codebase**, switchable live via the **DEV panel** (DEV-only, `import.meta.env.DEV`,
  stripped from prod), so the human reviews them **in the running UI** (not headless screenshots); **each variant
  gets its own line item in [`project/human-in-the-loop/review.md`](project/human-in-the-loop/review.md)**. The
  agent self-picks a coherent prod default (never blocks); the toggle keeps the alternates until the human
  confirms — **zero PROD flag-debt** (prod ships only the default). One-line tweaks are exempt. See **D-075** +
  [`.claude/skills/diverge/SKILL.md`](.claude/skills/diverge/SKILL.md).
- **Push each quality rule to the highest rung that can hold it** — a `verify`/CI **gate** > a git **hook** > a
  **skill** > a written **norm**. Prefer the rung that can't be quietly forgotten (a green-or-red check beats a
  good intention).
- **Docs taxonomy.** `docs/*.md` says what the game **is now** (living, edited in place); `project/journal/`
  says **how it got here** (a chronological log — append at the bottom, never prepend; the live snapshot is
  `project/status/project-status.md`). One doc per concern; edit living docs in place (don't fork copies).
- **Markdown prose width — wrap at ~80 (a SUGGESTION, not a gate).** The human prefers markdown prose and
  paragraphs hard-wrapped at **≈80 characters** (re-flowable in any editor, clean diffs, no horizontal scroll).
  It's a **soft norm**, deliberately **not** enforced by `verify` — markdown is excluded from Prettier
  (`.prettierignore`), and 80 is impractical to hard-block everywhere (wide CJK glyphs, long URLs/paths, and
  **markdown tables** — whose rows can't wrap — are accepted exceptions; prefer bullet-sections over a wide table
  when the cells carry prose). Apply it to **new/edited** docs; don't mass-retrofit existing ones. Count by
  *characters*, not bytes (CJK inflates a byte count).
- **Freeze = locked intent, not the plan.** "Freezing" the PRD scopes to **locked intent** — the
  §1 vision + the human-signed acceptance criteria (no-magic / mediocre-start / trade ≤⅓ /
  active-only, the four pillars + estate spine, the ≥30-min-per-rank / 70-30 / ~28.5h / tier-gate
  targets) — **not** the route there: the §4 balance numbers and §7 M2–M7 milestone detail stay
  **provisional** (already tagged "proposed v1 balance") and are revised by playtest. Build M0+M1
  against the current [prd.md](docs/living/prd.md) **first**, playtest, **then** explode it — freeze §1 as a
  tagged vision snapshot, move the roadmap to a **living** `docs/living/roadmap.md`, and **generate** balance
  into `docs/content/`. Never freeze M2–M7 as locked canon; the v1 scope (T0–T2) lock is unchanged.
  (M0–M2b are built & play-tested; `docs/content/` + `docs/living/roadmap.md` exist; the remaining freeze of
  §1 + §4→generated is the queued next step.) See **D-021** (refines D-020).
- **Temporary files → `./tmp/`.** Use the repo-local, git-ignored [`tmp/`](tmp) for all scratch /
  working files (intermediate output, throwaway scripts, scratch notes) — **not** the global system
  scratchpad. Anything worth keeping graduates to `docs/`, `project/brainstorms/`, `project/audit/`, or `project/journal/`.
- **Durable by default — a plan/brainstorm/analysis is a FILE, not a chat message.** If it's substantial
  enough to *propose, review, or act on*, write it to a durable `.md` **before** you present it as a
  deliverable and **before** you implement a line of it — no matter the source (your own in-context
  reasoning, a subagent, or a `Workflow`). **Never** let a plan live only in the conversation (it dies at
  compaction) or only as a pointer in a human-feedback/ledger entry (a pointer is not the artifact). Homes:
  **discovery / Q&A / proposals → [`project/brainstorms/`](project/brainstorms)**; **implementation plans /
  reel-backs / option-maps → [`docs/plans/`](docs/plans)**; **settled design → [`docs/`](docs)**. The test
  before you act: *if this session vanished right now, is the idea still on disk?* If no, write it first.
- **Durable capture of workflow / subagent outputs.** `Workflow` results live only in ephemeral session
  scratch (`<session>/tasks/<id>.output`) and **die with the session** — never leave research stranded
  there. After **every workflow**: (1) **snapshot the raw `.output` JSON verbatim** into
  [`project/brainstorms/raw/`](project/brainstorms/raw) (timestamped) via `src/scripts/snapshot-research.sh <output-file>
  <slug>`; (2) **distill** the useful parts into the right living doc (`docs/`) or discovery doc
  (`project/brainstorms/`) as **markdown**; (3) **commit the distillation immediately** (a small checkpoint).
  Subagent (Agent-tool) results are returned to the main agent — capture their substance in a doc, but do
  **not** copy subagent `.output` files (huge JSONL transcripts).
  - **Two tiers, and the tradeoff between them (the rule):**
    - **Raw `.json` snapshots are git-ignored** (`project/brainstorms/raw/*.json`) — **local-disk only,
      never committed**. Their *only* job is **local session-resume insurance**: if the internet drops, a
      bug hits, or you accidentally `Ctrl+C` mid-run, the raw output is still on disk to pick back up
      from. They survive session end but **do not reach the remote**, so they're **lost on machine loss** —
      do **not** treat a raw snapshot as durable archival.
    - **The markdown distillation is the durable, committed source of truth.** Anything that must survive
      (reach the remote, be reviewed, be acted on) **must be written as markdown** and committed — never
      left only as a raw `.json`. The distillation should be **far smaller** than the `.json` it came from
      (curated signal, not the verbatim transcript). If it isn't smaller, you haven't distilled — you've
      copied.

## Layout

- [README.md](README.md) — the game's vision.
- [`project/status/`](project/status) — **live operational state** + **live trackers** (mutable, edited in place;
  this is where a checkbox tracker belongs, **not** `docs/plans/`, which is pre-canon proposals):
  [working-agreements](project/status/working-agreements.md) (cadence + autonomy) and
  [project-status](project/status/project-status.md) (live snapshot + how to resume). *(A transient
  `pending-prd-changes` ripple tracker lived here through the 6-tier reshape; it was **retired 2026-06-29** once
  the ripple landed in the PRD — the pattern, a "locked-ADRs-not-yet-rippled" checklist deleted when empty, may
  recur.)*
- [`docs/`](docs) — design docs (living, edited in place), under **[`docs/living/`](docs/living)**:
  **[prd.md](docs/living/prd.md)** (the merged PRD / vision spec), **[decisions.md](docs/living/decisions.md)**
  (the **ADR log** — *why* the design is the way it is), **[roadmap.md](docs/living/roadmap.md)** (the
  milestone tracker), **[ui-design.md](docs/living/ui-design.md)** (the woodblock/ink UI bible),
  **[fun-factor.md](docs/living/fun-factor.md)** (what fun is), **[qa-playtesting.md](docs/living/qa-playtesting.md)**
  (how Claude play-tests). Generated content/balance tables live under **[`docs/content/`](docs/content)**
  (e.g. t0-content.md), produced by `src/scripts/gen-docs.ts`. Reviewable **implementation plans / proposals
  / reel-backs** (pre-canon, awaiting sign-off) live under **[`docs/plans/`](docs/plans)**.
- [`project/human-feedback/`](project/human-feedback) — the human's **direct feedback** (a live inbox; one dated file per session);
  closed records stay alongside (e.g. `2026-06-26-prd-human-feedback.md`, the PRD-feedback log, now applied to the PRD).
- [`project/human-in-the-loop/`](project/human-in-the-loop) — the human's queue: **open** decisions (`H`-items) and
  reviews (`R`-items) only a person can action; closed `H`-items **and** `R`-items graduate to a one-line row in
  [`archive.md`](project/human-in-the-loop/archive.md) (two sections — **Decisions** + **Reviews**; H-items also
  graduate to an ADR), and leave the live `decisions.md`/`review.md` open-only (see that dir's `README` for the lifecycle).
  [`project/todo-human.md`](project/todo-human.md) is the companion list: loose **TODOs** for the human plus
  the **reading queue** (brainstorms / audits / plans awaiting a "read & reviewed" sign-off). Both are
  auto-surfaced at session start by the `session-brief.sh` hook (see "How to work here").
- [`project/brainstorms/`](project/brainstorms) — raw discovery / Q&A capture (the `grill-me` skill writes here);
  settled designs graduate to `docs/`. [PARKED-THREADS.md](project/brainstorms/PARKED-THREADS.md) indexes tangents.
  [`raw/`](project/brainstorms/raw) holds **verbatim** `Workflow`-output JSON snapshots — **git-ignored,
  local-disk-only session-resume insurance** (see the "Durable capture" convention; the committed
  source of truth is the markdown distillation, not the `.json`).
- `src/scripts/` — repo dev/maintenance scripts (e.g. [`snapshot-research.sh`](src/scripts/snapshot-research.sh),
  [`session-brief.sh`](src/scripts/session-brief.sh) — the session-start human-queue brief).
- `project/journal/` — per-session chronological **LOG** (history, not live state): **summary at top, entries appended
  at the BOTTOM (never prepend)**; one file per session; the live snapshot is `project/status/project-status.md`. See
  [`README`](project/journal/README.md) + [`_TEMPLATE.md`](project/journal/_TEMPLATE.md).
- [`project/archive/`](project/archive) — superseded markdown docs kept for reference (archive, don't delete).
- [`project/audit/`](project/audit) — QA outputs: written findings/reports under `reports/` + screenshots/
  recordings under `screens/` (one dated pass-folder each; `screens/latest/` is the live `qa-shots.mjs` gallery).
- [`tmp/`](tmp) — repo-local scratchpad for throwaway working files (git-ignored except its README).
- `.claude/skills/` — `grill-me` (stress-test a design / extract one into a doc),
  `capture-game-states` (drive the game headlessly and screenshot/record its states),
  `battery` (run a multi-lens fresh-eyes stress-test battery over the spec/design/build),
  `tdd` (test-first authoring — red→green→refactor through the pure-core public contract; adopted ~1:1 from
  [mattpocock/skills](https://github.com/mattpocock/skills)),
  `diverge` (2–3 UI variants → contact sheet → self-pick + R-item; branch-preserved, zero `main` flag-debt;
  mandatory for new/major UI surfaces — D-073), and
  `handoff` (compact the session into a `/handoff` doc for a fresh agent to resume; adopted ~1:1).

## AI Commit Attribution (Required)

Every AI-generated commit **must end with an `Assisted-by:` trailer**, after a blank line:

```
Assisted-by: AGENT_NAME:MODEL_VERSION
```

- **AGENT_NAME** — the tool driving the commit (e.g. `Claude Code`).
- **MODEL_VERSION** — the **actual** model you're running, **never hardcoded** (e.g.
  `claude-opus-4-8[1m]`); use `unknown` if unavailable. The **first colon** is the delimiter between
  the two fields, so `AGENT_NAME` must not contain a colon.
- **Do NOT** use `Co-Authored-By:` for AI agents (GitHub renders it as a co-author/committer — the
  thing we're moving away from), and **do NOT** add emoji banners (e.g.
  `🤖 Generated with [Claude Code]`).

Example: `Assisted-by: Claude Code:claude-opus-4-8[1m]`

This convention **overrides the harness default**, which would otherwise append a
`Co-Authored-By: Claude … <noreply@anthropic.com>` trailer. (Existing history still carries the old
`Co-Authored-By` trailers; this changes commits **going forward** — a history rewrite to strip them
is a separate, human-approved step.)

**Enforced** (highest-rung principle) by the **`.githooks/commit-msg`** gate — a commit lacking a
well-formed `Assisted-by:` trailer is **blocked**. The `commit-msg` hook (not `pre-commit`) is the
right rung: `pre-commit` runs before the message exists and can't see it; `commit-msg` receives the
message and still blocks before the commit finalizes. Bypass a genuinely human-authored commit with
`SKIP_ATTRIB=1`. The full commit-message **style** (50/72, Conventional-Commits subject, body
voice) lives in [`.claude/rules/commit-message-style.md`](.claude/rules/commit-message-style.md).
