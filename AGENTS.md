# AGENTS.md

A single-player **HTML5 browser game**, built agentically with Claude Code. The
game's vision lives in [README.md](README.md); this file is just how we work.

This file flows **general → specific**: **Philosophy**, **How to work here**, and
**Conventions** are largely portable agentic game-dev guidance; **Kami-kakushi
specifics** at the end gathers this repo's concrete bindings (paths, freeze state,
the directory map, the live-state pointer).

## Philosophy

The operating philosophy — _how, why, and what to reason_ here. (A mechanic,
tool-usage rule, or engineering guideline is **not** a philosophy; those live in
"How to work here" / "Conventions" / "Kami-kakushi specifics" below.) The full
register is
[`docs/philosophy/`](docs/philosophy/README.md); each is summarised here so none
gets lost. **When a tactic anywhere in this file conflicts with one of these, the
philosophy wins.**

- **R1 · No clock, and no shortcuts.** Correct & slow beats shitty & fast. You are
  never on a deadline — an overnight `/loop` is an invitation to do excellent
  work, not a countdown; never compress quality to "fit a window" or ship a "lite"
  shortcut. Partial-and-excellent beats complete-and-compromised. →
  [`no-clock-no-shortcuts.md`](docs/philosophy/no-clock-no-shortcuts.md) (D-080)
- **R2 · Verify, don't trust.** A maker is blind to their own gaps, and you can't
  trust provenance you can't see — so existing files, written canon, and other
  agents' work are _checked, not trusted_, against independent eyes / the gates /
  reality. The map is not the territory: where a doc and the build disagree, the
  build wins. (This is about work you did _not_ author.) →
  [`verify-dont-trust.md`](docs/philosophy/verify-dont-trust.md) (D-081)
- **R3 · Done is earned, not declared.** The self-facing twin of R2 — be skeptical
  of your _own_ green. Never claim done/shipped unless it's literally, verifiably
  true (lead with what's missing, never push red); a passing check counts only if
  it drives the real player path and _could have gone RED_. A false green is worse
  than no check. →
  [`done-is-earned-not-declared.md`](docs/philosophy/done-is-earned-not-declared.md) (D-082)
- **R4 · Bias to motion: act, self-vet, surface.** The human owns direction, taste
  & the irreversible; the agent owns execution — reversible progress by default,
  self-picked defaults, self-vetted work, every fork _surfaced for async override_
  rather than waited on. Never block; never silently decide. →
  [`bias-to-motion.md`](docs/philosophy/bias-to-motion.md) (D-083)
- **R5 · If it isn't fun, it isn't finished.** A compiling build is the floor; the
  bar is paced, genuinely fun, intentional (woodblock/ink, never AI-slop). Fun is a
  hypothesis tested by play — proxies prove its absence, only a human certifies its
  presence. Lock the design language first (constraint reads handmade, defaults
  read slop), and the player gets the real game, never the scaffolding. →
  [`if-it-isnt-fun-it-isnt-finished.md`](docs/philosophy/if-it-isnt-fun-it-isnt-finished.md) (D-084)
- **R6 · If a player can't reach it, it doesn't exist.** What counts as _built_ is
  what a human player can reach: a change living only in TypeScript — no UI, not
  reachable in the live MCP playtest — is _not done_. Build lean (everything earns
  its place), in fun-complete vertical slices a player can use, and diverge into
  real working alternatives before converging. →
  [`if-a-player-cant-reach-it-it-doesnt-exist.md`](docs/philosophy/if-a-player-cant-reach-it-it-doesnt-exist.md) (D-085)

## How to work here

- **Autonomous by default.** Pick the next task → build it → verify it → commit
  it → journal it → repeat. The human steers *direction*; you own *execution*.
  Don't ask permission for routine forward progress.
- **Bias to action.** When a routine choice has a sensible default, take it,
  note it, and move on — don't stall for confirmation.
- **Many small commits, straight to the working branch.** Don't branch for
  routine work — committing as you go *is* the workflow. *(This overrides the
  generic "branch off main / commit only when asked" default.)* Each commit runs
  the **full `npm run verify`** (the gate roster is owned by
  `src/scripts/verify-run.ts` — the single source of truth — and the gates run in
  **parallel**, comfortably under the soft 5s drift budget) and
  stages a `project/journal/` entry (enforced by `.githooks/pre-commit`;
  `SKIP_CODE_VERIFY=1` for a docs-only commit — skips the code lane, the
  docs gates still run (~1s); `SKIP_DOCS_VERIFY=1` is the code-lane mirror;
  `SKIP_VERIFY=1` skips *everything* — last resort;
  `SKIP_JOURNAL=1` for trivial commits. A push always verifies the FULL
  roster — the lane flags are commit-time only).
  A soft 5s **drift timer** warns (never blocks) as the gate slows;
  `npm run verify:budget` is the hard, on-demand budget check (D-072). Enable
  the hook once per clone: `git config core.hooksPath .githooks`.
- **Use Workflows for substantial / parallelizable work** (e.g. fan-out
  research, multi-file sweeps).
- **Model routing — inherit the parent's model by default.** Every subagent and
  `Workflow` agent runs on the **same model as the parent** unless the human
  explicitly routes otherwise. The **only** self-serve exception is dropping to a
  **smaller/cheaper model for exploration or trivial mechanical work** (broad
  file-finding, dead-link scans, boilerplate) where the cheaper tier is plainly
  sufficient — never a *lateral* switch to a different same-tier model. Concretely:
  **an Opus session does not spawn Fable (or any non-inherited model) unless the
  human says so.** A plan's "who builds this" section proposes routing for the
  human to approve; it does not license the agent to switch models on its own.
- **Stop and ask only for** (1) design decisions that change what the game *is*
  — lock these with the human and record them as ADRs in
  [`docs/living/decisions.md`](docs/living/decisions.md); and (2) anything
  outward-facing or hard to reverse (push, deploy, delete) — never without
  approval.
- **The human's intent is canon.** The newest human steer supersedes any prior
  ADR or lock; when a living doc disagrees with intent, the **doc** is what's
  wrong — fix it. (**D-022** governs; `created_date` disambiguates which call is
  current.)
- **The session is disposable; the repo is the memory — leave it resumable.** If
  it isn't a committed file, it doesn't exist: all state lives in commits + the
  `project/journal/` log + `project/status/project-status.md`, so a cold pickup
  or a context compaction never loses progress (journal ordering + the
  live-snapshot rule: see "Docs taxonomy" under Kami-kakushi specifics). The
  record is **append-only & lossless** — supersede with a strikethrough + forward
  pointer, park don't cut, archive don't remove; the *why* always survives. **The
  one exception — and the reason the rule is stated carefully — is
  `project/status/project-status.md`: it is a one-screen SNAPSHOT, REPLACED in
  place, NOT appended to.** Trimming or rewriting stale state there is *correct*,
  never a loss, *because* `journal/` is the lossless record that preserves it.
  Never add a dated "Phase update — (session-NN)" bullet to the snapshot — that's a
  journal entry; the leak of append-only history into the snapshot once bloated it
  to 326 lines, so a `pre-commit` line-cap gate now holds it to one screen.
- **Checkpoint = make the work resumable from disk *and on the remote*, right
  now.** When asked to "checkpoint" (or before exiting), run the loop: **commit
  completed work → stage a `journal/` entry → bring
  `project/status/project-status.md` current → `git push origin main` → confirm
  the tree is clean (or note exactly what's intentionally left).** **Pushing
  `main` is part of a checkpoint, not a separate ask** — this is the standing
  approval that overrides the generic "never push without approval" default *for
  the routine main checkpoint* (a destructive/outward action like a deploy or a
  force-push still needs explicit sign-off). The push is what makes the
  checkpoint trustworthy: it fires the **pre-push gate** (`.githooks/pre-push` —
  runs `npm run verify` on **every push, all branches**, and **refuses any red
  push**) — so a green `origin/main` is the proof the checkpoint is real. Three
  non-negotiables, all learned the hard way: **(1) Verify before you claim** —
  never say *pushed / green / done* without checking (`git status`,
  `git log origin/main..main`, the actual push succeeding); a clean working tree
  at checkpoint can go dirty a moment later. **(2) Shared-tree safety** — this
  repo may have **more than one agent editing the working tree at once**.
  **NEVER** `git stash`, `checkout`, `restore`, or otherwise mutate files you
  didn't author. Stage **only your own files, by explicit path**
  (`git add path/a path/b`, never `git add -A`/`git commit -a`), and leave
  everyone else's uncommitted WIP untouched. **(3) Don't fight someone else's
  red.** The pre-push gate verifies the **working tree**, so another agent's
  in-flight red WIP will (correctly) block your push. That's expected — leave
  your commit local, note it in `project-status.md`, and do **not**
  `SKIP_VERIFY=1`-override a red tree onto the remote. (`SKIP_VERIFY=1` is only
  for *committing* your own isolated change locally, never for pushing red to
  `main`.) Full checklist: working-agreements.md.
- **Session start → surface what's waiting on the human.** A `SessionStart` hook
  runs [`src/scripts/session-brief.sh`](src/scripts/session-brief.sh) (wired in
  `.claude/settings.json`), which prints the open **human queue** — the unticked
  **TODOs** + **reading queue**
  ([`project/todo-human.md`](project/todo-human.md)) plus open decisions
  (`H`-items) and reviews (`R`-items) in
  [`project/human-in-the-loop/`](project/human-in-the-loop). **Lead each fresh
  session by relaying that brief to the human** before diving into work, so
  blocking sign-offs don't sit unseen. The brief then **nudges the next
  autonomous work** — it surfaces recent commits + the live snapshot + the
  active plan(s)/journal/roadmap and asks you to **name the startable
  workstream(s)** — *often just the one active plan; "up to 3" is a cap for
  genuinely-parallel work, not a quota to pad to* (don't split one plan's steps
  into three tasks). Keep the brief **fast (≤5s)**: orient from the hook output +
  a peek at the active plan's Status line — **don't** read the full snapshot or
  run `verify` just to brief (save the deeper verify-against-git check for when
  you pick the work up). No stored task list to keep in sync; **done plans are
  archived to `project/archive/`** the moment they land, so `docs/plans/` lists only
  live plans (still trust each plan's Status line, not its filename). Run it by
  hand any time: `bash src/scripts/session-brief.sh`.

Full version:
[`project/status/working-agreements.md`](project/status/working-agreements.md).

## Conventions

- **Pure-core boundary.** Keep game logic (rules, state, math) in a **pure
  core** with no DOM/canvas imports, and let the renderer consume it as plain
  data. The core is then deterministic and unit-testable — the single most
  valuable architectural rule for a game. **Route derived feedback (forecasts,
  previews) through the SAME pure-core fn the action uses (A6)** — e.g.
  `mcCombatStats` feeds both the real fight and the shown forecast, so a hurt
  fighter's displayed win-rate drops for free: emergent UI legibility, zero extra
  UI code, and no drift between preview and reality.
- **Acyclic core — cross-cutting emitters go in shared glue (A20).** A concern
  that fires from more than one reducer (quests, achievements) lives in a
  **shared glue module both reducers import**, never as a reducer→reducer call —
  keeps the core dependency graph acyclic.
- **Determinism: one RNG.** All randomness flows through a single seeded RNG so
  runs reproduce.
- **Test discipline (the ambient rule — D-086…D-088 adoption).** A test earns its
  place only if it **could have gone RED**: a false green is worse than no test
  (R3). So, on **every** new test: **(1)** ask *"can this go RED?"* — a tautology
  or a dead-value ratchet is not a test; **(2)** derive fixtures from the
  **source of truth** (`rungThreshold`, the `balance` constants), **never** copied
  magic numbers (hard-coded act-counts broke ~6 tests at M2·8); **(3)** assert the
  **design lever** (atk/taken/wear multiplier, the monotonic *mechanism*), not a
  collapsed metric (win-rate conflates levers; 15% vs 35% both round to "5"). And
  **per D-088:** every **tier** ships a **full-arc e2e + an invariants test, named
  in its first milestone's DoD** (proves the seams between fragment tests hold) —
  *ration their gate-time* (A17). This lives here, **always-loaded**, on purpose:
  it's a rule that must fire every time, so it does **not** live only in the
  opt-in [`tdd` skill](.claude/skills/tdd/SKILL.md) (which stays the deep
  red→green→refactor *procedure* this bullet points to — a standing rule buried in
  a never-invoked skill doesn't fire). **Enforcement (human, 2026-06-30):** the
  *teeth* is the **milestone-integrity gate** (D-054, v0.3.1 Step 7 — every
  DoD-named test must resolve to a real test); per-test RED-ability stays a **norm**,
  deliberately **not** gated (a lint can't judge RED-ability without crying wolf — A11).
  **Balance changes get a machine verdict (D-132):** after touching balance/content
  magnitudes, run `npm run verify:balance` → `npm run balance:report` and commit the
  regenerated `docs/content/t0-pacing.md` WITH the change (its diff is the before/after;
  paste `balance-sim --summary` into the commit body) — the full flow lives in
  [`qa-playtesting.md` §2](docs/living/qa-playtesting.md).
- **Single source of truth — generate, don't duplicate.** Anything derivable
  from the game's data (balance tables, content lists) is **generated** into
  `docs/`, never hand-maintained twice. A **version label is a single-source
  invariant too (A21)** — derive it from one source, never hand-type it across
  docs (the v0.4.1→v0.3.1 mismatch). And when you **verify a content-preserving
  transform**, diff in **TEXT mode** (word-diff vs `HEAD`) **and** assert the
  output is **NUL-free (A15)** — a binary output gives a false-clean diff; count
  prose width by *characters*, not bytes.
- **PRD stays in sync via the ripple/compress flows (D-117).** The build is the
  territory; the PRD is the forward spec. After a **built-system** design change,
  run [`/prd-ripple`](.claude/skills/prd-ripple/SKILL.md) — classify it (balance
  number → no §4 edit · system/narrative → targeted ripple + ADR · intent → stop
  for the human · frontier → edit freely), then `npm run prd:drift` for the
  game→PRD punch-list. Derivable facts transclude as **gen-regions**
  (`gen-prd-regions.ts`, the `gen-prd-regions` gate) so they can't drift. The
  once-per-tier **compression** sweep (`/prd-compress`) is a separate,
  human-signed, **Fable-routed** event, dormant until that tier's taste R-item
  closes.
- **Keep a CHANGELOG — a version bump must be documented (A22).** The project
  keeps a top-level [`CHANGELOG.md`](CHANGELOG.md) (Keep-a-Changelog style,
  newest-first; the in-game footer + About modal link to it). The displayed
  version is single-sourced from `package.json` (A21) — and the **`verify-changelog`
  gate** binds the two: `package.json`'s `version` MUST have a matching
  `## [x.y.z]` section in `CHANGELOG.md`, or `verify` goes RED (at commit, push,
  and CI). So **bumping the version and forgetting the changelog entry fails the
  build** — it's a content invariant (highest sound rung, never cries wolf), not a
  diff heuristic. When you bump `package.json`, add the release section.
- **Playtest via code, not synthetic input.** Expose a DEV-only play API on
  `window` so the game can be driven and observed headlessly — see the
  `capture-game-states` skill and the
  [QA & playtesting guide](docs/living/qa-playtesting.md).
- **Playtest capture inbox — capture in-game, drain async (F3).** In a DEV
  build the `` ` `` hotkey pops a note box; ⌘/Ctrl+Enter drops a self-contained
  capture (note + deterministic save + a git-ignored screenshot) into
  [`project/playtest-inbox/pending/`](project/playtest-inbox) and vanishes. The
  human plays whenever; an agent drains whenever with **`/drain-inbox`**
  (reproduce from the save → triage → log an **Fnn** in `project/human-feedback/`
  → **`git mv` the capture to `archive/`** — completion is the archive move, not
  deletion). It's **agent-facing** (not the human queue); the session brief
  surfaces the `pending/` count. See the
  [`drain-inbox`](.claude/skills/drain-inbox/SKILL.md) skill.
- **Build to the taste standard — the four taste values (D-126).** Before
  building or restyling **any** UI surface, feature, or narrative beat, read
  [`docs/living/taste.md`](docs/living/taste.md) (snapshot-class, hard-capped,
  the human-locked bar) and score the finished work against its principles.
  When no principle covers, reason from the values — they predict the verdict:
  - **T1 · One home for everything** — one tab per capability, one shared
    primitive per idiom, one source per value; delete the old copy on a move.
  - **T2 · Never yank the ground from under the player** — a watched surface
    never flashes, resets, resizes, or rebuilds; even a crash reads composed.
  - **T3 · The fiction causes the mechanics** — discovered, not spawned; story
    promises exist in the game; the UI reveal follows the story beat.
  - **T4 · The player never guesses state** — speaker, changes, newness,
    progress: readable at a glance.
- **QA fun & visuals, not just function.** A compiling build isn't the bar — the
  game must be *paced and fun* and *look intentional* (woodblock/ink, **not**
  generic AI-slop). Three distinct living docs own this: **what fun *is* & how
  to keep it high** → [`docs/living/fun-factor.md`](docs/living/fun-factor.md);
  **how Claude drives / observes / screenshots the game to play-test it** (the
  harness + MCP tools + the fun-proxy *measurement*) →
  [`docs/living/qa-playtesting.md`](docs/living/qa-playtesting.md); **the visual
  language** → [`docs/living/ui-design.md`](docs/living/ui-design.md). The agent
  reviews its own screenshots with its own vision and iterates; the human is the
  final fun & taste arbiter.
- **Design by divergence (new/major UI surfaces) — D-075 (v2, refines D-073).**
  No new or majorly-restyled UI surface ships from a single idea — run the
  **`diverge`** skill for **FULL 2–3 distinct, *working* approaches**. **No
  "diverge-LITE" single-idea shortcut, and no buggy variants** — every variant
  must actually work. The variants live **in the codebase**, switchable live via
  the **DEV panel** (DEV-only, `import.meta.env.DEV`, stripped from prod), so
  the human reviews them **in the running UI** (not headless screenshots);
  **each variant gets its own line item in
  [`project/human-in-the-loop/review.md`](project/human-in-the-loop/review.md)**.
  The agent self-picks a coherent prod default (never blocks); the toggle keeps
  the alternates until the human confirms — **zero PROD flag-debt** (prod ships
  only the default). One-line tweaks are exempt. See **D-075** +
  [`.claude/skills/diverge/SKILL.md`](.claude/skills/diverge/SKILL.md).
- **Push each quality rule to the highest rung that can _soundly_ hold it** — a
  `verify`/CI **gate** > a git **hook** > a **skill** > a written **norm**,
  calibrated so a gate never cries wolf. Prefer the rung that can't be quietly
  forgotten (a green-or-red check beats a good intention).
- **Markdown prose width — wrap at ~80 (a SUGGESTION, not a gate).** The human
  prefers markdown prose and paragraphs hard-wrapped at **≈80 characters**
  (re-flowable in any editor, clean diffs, no horizontal scroll). It's a **soft
  norm**, deliberately **not** enforced by `verify` — markdown is excluded from
  the formatter (the `.oxfmtrc.json` ignore list), and 80 is impractical to hard-block everywhere
  (wide CJK glyphs, long URLs/paths, and **markdown tables** — whose rows can't
  wrap — are accepted exceptions; prefer bullet-sections over a wide table when
  the cells carry prose). Apply it to **new/edited** docs; don't mass-retrofit
  existing ones. Count by *characters*, not bytes (CJK inflates a byte count).
- **Durable by default — a plan/brainstorm/analysis is a FILE, not a chat
  message.** If it's substantial enough to *propose, review, or act on*, write
  it to a durable `.md` **before** you present it as a deliverable and
  **before** you implement a line of it — no matter the source (your own
  in-context reasoning, a subagent, or a `Workflow`). **Never** let a plan live
  only in the conversation (it dies at compaction) or only as a pointer in a
  human-feedback/ledger entry (a pointer is not the artifact). Homes:
  **discovery / Q&A / proposals →
  [`project/brainstorms/`](project/brainstorms)**; **implementation plans /
  reel-backs / option-maps → [`docs/plans/`](docs/plans)**; **settled design →
  [`docs/`](docs)**. The test before you act: *if this session vanished right
  now, is the idea still on disk?* If no, write it first.
- **Durable capture of workflow / subagent outputs.** `Workflow` results live
  only in ephemeral session scratch and **die with the session** — so after
  **every workflow**: **snapshot** the raw `.output` verbatim into
  [`project/brainstorms/raw/`](project/brainstorms/raw) (via
  `src/scripts/snapshot-research.sh`), **distill** the signal into **markdown** in
  the right living/discovery doc, and **commit the distillation**. The committed
  markdown is the source of truth; the raw `.json` is git-ignored, local-only
  resume-insurance (and **never** copy subagent `.output` JSONL transcripts).
  Full rule — the two-tier tradeoff + the subagent caveat:
  [`project/brainstorms/raw/README.md`](project/brainstorms/raw/README.md).

## Kami-kakushi specifics

This repo's concrete bindings — paths, state, and the directory map. The rules
above are the portable part; these are what's specific to kami-kakushi.

- **Live state lives in the snapshot, not here.** Current status — version,
  milestone progress, what's built / queued, the gate count — lives **only** in
  [`project/status/project-status.md`](project/status/project-status.md). Keep
  this file to *mechanisms that are always true*; never copy drifting state into it.
- **Docs taxonomy.** `docs/*.md` says what the game **is now** (living, edited
  in place); `project/journal/` says **how it got here** (a chronological log —
  append at the bottom, never prepend; the live snapshot is
  `project/status/project-status.md`). One doc per concern; edit living docs in
  place (don't fork copies).
- **Freeze = locked intent, not the plan.** "Freezing" the PRD scopes to
  **locked intent** — the §1 vision + the human-signed acceptance criteria —
  **not** the route there: the §4 balance numbers and §7 M2–M7 milestone detail
  stay **provisional** (revised by playtest), never frozen as locked canon. Full
  rule, rationale + current freeze state: **D-021** (refines D-020, refined by
  D-059) in [`decisions.md`](docs/living/decisions.md).
- **Temporary files → `./tmp/`.** Use the repo-local, git-ignored [`tmp/`](tmp)
  for all scratch / working files (intermediate output, throwaway scripts,
  scratch notes) — **not** the global system scratchpad. Anything worth keeping
  graduates to `docs/`, `project/brainstorms/`, `project/audit/`, or
  `project/journal/`.

The directory map — what lives where — is maintained in
[`repo-map.md`](repo-map.md) and `@`-included below so it stays in
always-loaded context:

@repo-map.md

## AI Commit Attribution (Required)

Every AI-generated commit **must end with an `Assisted-by: AGENT_NAME:MODEL_VERSION`
trailer** (after a blank line) — e.g. `Assisted-by: Claude Code:claude-opus-4-8[1m]`.
`MODEL_VERSION` is the **actual** model you're running, **never hardcoded** (`unknown`
if unavailable); the first colon is the delimiter, so `AGENT_NAME` must not contain
one. **Never** use `Co-Authored-By:` for AI agents or add emoji banners — this
**overrides the harness default**. Enforced by the **`.githooks/commit-msg`** gate
(`SKIP_ATTRIB=1` bypasses a genuinely human commit).

Canonical spec + full message **style** (50/72, Conventional-Commits subject, body
voice) — already loaded every session — lives in
[`.claude/rules/commit-message-style.md`](.claude/rules/commit-message-style.md).
