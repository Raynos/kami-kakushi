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

- **PH1 · No clock, and no shortcuts.** Correct & slow beats shitty & fast. You are
  never on a deadline — an overnight `/loop` is an invitation to do excellent
  work, not a countdown; never compress quality to "fit a window" or ship a "lite"
  shortcut. Partial-and-excellent beats complete-and-compromised. →
  [`no-clock-no-shortcuts.md`](docs/philosophy/no-clock-no-shortcuts.md) (ADR-080)
- **PH2 · Verify, don't trust.** A maker is blind to their own gaps, and you can't
  trust provenance you can't see — so existing files, written canon, and other
  agents' work are _checked, not trusted_, against independent eyes / the gates /
  reality. The map is not the territory: where a doc and the build disagree, the
  build wins. (This is about work you did _not_ author.) →
  [`verify-dont-trust.md`](docs/philosophy/verify-dont-trust.md) (ADR-081)
- **PH3 · Done is earned, not declared.** The self-facing twin of PH2 — be skeptical
  of your _own_ green. Never claim done/shipped unless it's literally, verifiably
  true (lead with what's missing, never push red); a passing check counts only if
  it drives the real player path and _could have gone RED_. A false green is worse
  than no check. →
  [`done-is-earned-not-declared.md`](docs/philosophy/done-is-earned-not-declared.md) (ADR-082)
- **PH4 · Bias to motion: act, self-vet, surface.** The human owns direction, taste
  & the irreversible; the agent owns execution — reversible progress by default,
  self-picked defaults, self-vetted work, every fork _surfaced for async override_
  rather than waited on. Never block; never silently decide. →
  [`bias-to-motion.md`](docs/philosophy/bias-to-motion.md) (ADR-083)
- **PH5 · If it isn't fun, it isn't finished.** A compiling build is the floor; the
  bar is paced, genuinely fun, intentional (woodblock/ink, never AI-slop). Fun is a
  hypothesis tested by play — proxies prove its absence, only a human certifies its
  presence. Lock the design language first (constraint reads handmade, defaults
  read slop), and the player gets the real game, never the scaffolding. →
  [`if-it-isnt-fun-it-isnt-finished.md`](docs/philosophy/if-it-isnt-fun-it-isnt-finished.md) (ADR-084)
- **PH6 · If a player can't reach it, it doesn't exist.** What counts as _built_ is
  what a human player can reach: a change living only in TypeScript — no UI, not
  reachable in the live MCP playtest — is _not done_. Build lean (everything earns
  its place), in fun-complete vertical slices a player can use, and diverge into
  real working alternatives before converging. →
  [`if-a-player-cant-reach-it-it-doesnt-exist.md`](docs/philosophy/if-a-player-cant-reach-it-it-doesnt-exist.md) (ADR-085)

## How to work here

- **Autonomous by default.** Pick the next task → build it → verify it → commit
  it → journal it → repeat. The human steers *direction*; you own *execution*.
  Don't ask permission for routine forward progress.
- **Bias to action.** When a routine choice has a sensible default, take it,
  note it, and move on — don't stall for confirmation.
- **Many small commits, straight to the working branch.** Don't branch for
  routine work — committing as you go *is* the workflow. *(This overrides the
  generic "branch off main / commit only when asked" default.)* Each commit runs
  the **full `pnpm run verify`** (the gate roster is owned by
  `src/scripts/gates.ts` — the single source of truth — and the gates run in
  **parallel**, comfortably under the soft 5s drift budget) and
  stages a `project/journal/` entry (enforced by `.githooks/pre-commit`;
  `SKIP_CODE_VERIFY=1` for a docs-only commit — skips the code lane, the
  docs gates still run (~1s); `SKIP_DOCS_VERIFY=1` is the code-lane mirror;
  `SKIP_VERIFY=1` skips *everything* — last resort;
  `SKIP_JOURNAL=1` for trivial commits. A push always verifies the FULL
  roster — the lane flags are commit-time only).
  A soft 5s **drift timer** warns (never blocks) as the gate slows;
  `pnpm run verify:budget` is the hard, on-demand budget check (ADR-072). Enable
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
  wrong — fix it. (**ADR-022** governs; `created_date` disambiguates which call is
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
  now:** commit (pathspec) → journal → snapshot current → `git push origin
  main` → confirm clean. **Pushing `main` is part of a checkpoint, not a
  separate ask** (standing approval; a deploy/force-push still needs sign-off);
  the pre-push gate refuses any red push, so green `origin/main` is the proof.
  Three non-negotiables: **(1) verify before you claim** done/pushed/green;
  **(2) shared-tree safety** — never mutate/stage files you didn't author;
  **(3) don't fight someone else's red** — leave your commit local, never
  `SKIP_VERIFY=1` a red tree onto `main`. Full checklist + the exact commands:
  [`working-agreements.md → Checkpoint`](project/status/working-agreements.md).
- **Session start → surface what's waiting on the human.** A `SessionStart` hook
  runs [`src/scripts/session-brief.sh`](src/scripts/session-brief.sh) (wired in
  `.claude/settings.json`), which prints the open **human queue** — the unticked
  **TODOs** + **reading queue**
  ([`project/todo-human.md`](project/todo-human.md)) plus open decisions
  (`HD`-items) and reviews (`HR`-items) in
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
  previews) through the SAME pure-core fn the action uses (AC-6)** — e.g.
  `mcCombatStats` feeds both the real fight and the shown forecast, so a hurt
  fighter's displayed win-rate drops for free: emergent UI legibility, zero extra
  UI code, and no drift between preview and reality.
- **Acyclic core — cross-cutting emitters go in shared glue (AC-20).** A concern
  that fires from more than one reducer (quests, achievements) lives in a
  **shared glue module both reducers import**, never as a reducer→reducer call —
  keeps the core dependency graph acyclic.
- **Determinism: one RNG.** All randomness flows through a single seeded RNG so
  runs reproduce.
- **Test discipline (the ambient rule — ADR-086…ADR-088 adoption).** A test earns its
  place only if it **could have gone RED**: a false green is worse than no test
  (PH3). So, on **every** new test: **(1)** ask *"can this go RED?"* — a tautology
  or a dead-value ratchet is not a test; **(2)** derive fixtures from the
  **source of truth** (`rungThreshold`, the `balance` constants), **never** copied
  magic numbers (hard-coded act-counts broke ~6 tests at MS2·8); **(3)** assert the
  **design lever** (atk/taken/wear multiplier, the monotonic *mechanism*), not a
  collapsed metric (win-rate conflates levers; 15% vs 35% both round to "5"). And
  **per ADR-088:** every **tier** ships a **full-arc e2e + an invariants test, named
  in its first milestone's DoD** (proves the seams between fragment tests hold) —
  *ration their gate-time* (AC-17). This lives here, **always-loaded**, on purpose:
  it's a rule that must fire every time, so it does **not** live only in the
  opt-in [`tdd` skill](.claude/skills/tdd/SKILL.md) (which stays the deep
  red→green→refactor *procedure* this bullet points to — a standing rule buried in
  a never-invoked skill doesn't fire). **Enforcement (human, 2026-06-30):** the
  *teeth* is the **milestone-integrity gate** (ADR-054, v0.3.1 Step 7 — every
  DoD-named test must resolve to a real test); per-test RED-ability stays a **norm**,
  deliberately **not** gated (a lint can't judge RED-ability without crying wolf — AC-11).
  **Balance changes get a machine verdict (ADR-132):** after touching balance/content
  magnitudes, run `pnpm run verify:balance` → `pnpm run balance:report` and commit the
  regenerated `docs/content/t0-pacing.md` WITH the change (its diff is the before/after;
  paste `balance-sim --summary` into the commit body) — the full flow lives in
  [`qa-playtesting.md` §2](docs/living/qa-playtesting.md).
  **The human tunes by slider; an agent only transcribes (ADR-134 / ADR-059).** The
  DEV **balance cockpit** (DEV panel → Balance tab) lets the *human* drag a lever
  live and **export** a committable diff to `project/playtest-inbox/`. An **agent
  never moves a slider into canon on the human's behalf** — it reads the exported
  artifact and applies the exact old→new edits (stale-canon guard first), per the
  apply-flow in [`qa-playtesting.md` §1](docs/living/qa-playtesting.md).
- **Story is authored as text — registries are generated (FB-5).** T0 narrative
  content (rung beats, intro scenes, dialogue lines, the cold open) is authored
  as prose-first markdown in
  [`src/core/content/narrative/`](src/core/content/narrative/README.md) — the
  source of truth — and compiled by `pnpm run gen:narrative` into `*.gen.ts`
  registries (+ the readable script `docs/content/t0-story.md`). **Never edit a
  `*.gen.ts`** — the `gen-narrative` verify gate byte-compares and its error
  names the `.md` to edit. Real logic (helpers, gates beyond the declared
  grammar) stays hand-written TS; a beat needing real code uses the plan's
  `native:` escape hatch rather than growing the grammar.
- **Single source of truth — generate, don't duplicate.** Anything derivable
  from the game's data (balance tables, content lists) is **generated** into
  `docs/`, never hand-maintained twice. A **version label is a single-source
  invariant too (AC-21)** — derive it from one source, never hand-type it across
  docs (the v0.4.1→v0.3.1 mismatch). And when you **verify a content-preserving
  transform**, diff in **TEXT mode** (word-diff vs `HEAD`) **and** assert the
  output is **NUL-free (AC-15)** — a binary output gives a false-clean diff; count
  prose width by *characters*, not bytes.
- **PRD stays in sync via the ripple/compress flows (ADR-117).** The build is the
  territory; the PRD is the forward spec. After a **built-system** design change,
  run [`/prd-ripple`](.claude/skills/prd-ripple/SKILL.md) — classify it (balance
  number → no §4 edit · system/narrative → targeted ripple + ADR · intent → stop
  for the human · frontier → edit freely), then `pnpm run prd:drift` for the
  game→PRD punch-list. Derivable facts transclude as **gen-regions**
  (`gen-prd-regions.ts`, the `gen-prd-regions` gate) so they can't drift. The
  once-per-tier **compression** sweep (`/prd-compress`) is a separate,
  human-signed, **Fable-routed** event, dormant until that tier's taste HR-item
  closes.
- **Keep a CHANGELOG — a version bump must be documented (AC-22).** The project
  keeps a top-level [`CHANGELOG.md`](CHANGELOG.md) (Keep-a-Changelog style,
  newest-first; the in-game footer + About modal link to it). The displayed
  version is single-sourced from `package.json` (AC-21) — and the **`verify-changelog`
  gate** binds the two: `package.json`'s `version` MUST have a matching
  `## [x.y.z]` section in `CHANGELOG.md`, or `verify` goes RED (at commit, push,
  and CI). So **bumping the version and forgetting the changelog entry fails the
  build** — it's a content invariant (highest sound rung, never cries wolf), not a
  diff heuristic. When you bump `package.json`, add the release section.
  **A version bump also gets a git tag `vX.Y.Z` on the release commit**
  (human, 2026-07-05): the tag is what lets `git describe --tags` version
  the gh-pages deploy messages. Prefer `pnpm version x.y.z` (bump + commit +
  tag in one move) in a single-agent clone — but in THIS shared tree it
  bare-commits the shared index and rewrites the pinned-at-`0.0.0` lockfile
  root, so releases go through **`/ship`**, which does the safe explicit
  equivalent (`pnpm pkg set` → pathspec commit → `git tag`).
- **Playtest via code, not synthetic input.** Expose a DEV-only play API on
  `window` so the game can be driven and observed headlessly — see the
  `capture-game-states` skill and the
  [QA & playtesting guide](docs/living/qa-playtesting.md).
- **Real-play telemetry — read `project/telemetry/` before touching balance
  (FB-8).** The human's DEV sessions auto-drop attended-time pacing reports
  (git-ignored, local sensor data) there; the ADR-132 balance flow's step 0
  ([qa-playtesting.md §2](docs/living/qa-playtesting.md)) is: if untainted
  reports exist, quote attended-vs-sim for the touched rungs in the commit
  body, and distill any pacing conclusion into a committed note (the folder
  README's diary rule). Human pacing data never gates.
- **Playtest capture inbox — capture in-game, drain async (FB-3).** In a DEV
  build the `` ` `` hotkey enters **pick mode** (hover-highlight → click the
  element you're commenting on, or click empty / Esc for a general note); a note
  box opens and ⌘/Ctrl+Enter appends a **lean** entry (note + picked-element
  descriptor + links) to **that game session's file** in
  [`project/playtest-inbox/pending/`](project/playtest-inbox) — one `<session>.md`
  per browser-tab sitting — while the heavy machine data (deterministic save +
  logs + context) goes to a committed `<stamp>.json` and the full-page screenshot
  *with the highlight baked in* to a git-ignored `<stamp>.png`, both in a sibling
  folder. Every capture is auto-committed to git on write. The human plays
  whenever; an agent drains whenever with
  **`/drain-inbox`** — an **interactive** pass, batches of ≤5: reproduce each
  from the save → triage → **propose, and wait for the human's go-ahead** before
  any fix lands → log a **FB-nn** in `project/feedback-human/` → **`git mv` the
  capture to `archive/`** (completion is the archive move, not deletion). It's **agent-facing** (not the human queue); the session brief
  surfaces the `pending/` count. See the
  [`drain-inbox`](.claude/skills/drain-inbox/SKILL.md) skill.
- **Build to the taste standard — the four taste values (ADR-126).** Before
  building or restyling **any** UI surface, feature, or narrative beat, read
  [`docs/living/taste.md`](docs/living/taste.md) (snapshot-class, hard-capped,
  the human-locked bar) and run the **two-pass
  [`taste-scorecard`](.claude/skills/taste-scorecard/SKILL.md) flow (FB-10,
  ADR-135)**: **Pass 1** — a constraint brief BEFORE building (one line per
  applicable principle: what this work must do to honor it); **Pass 2** — the
  full 21-walk scorecard AFTER (per variant in a diverge), each ✘ tagged
  [briefed] or [blind spot]; brief + verdicts attach to the HR-item (the
  diverge flow bakes both in as its §2 steps 2 + 8).
  When no principle covers, reason from the values — they predict the verdict:
  - **TST1 · One home for everything** — one tab per capability, one shared
    primitive per idiom, one source per value; delete the old copy on a move.
  - **TST2 · Never yank the ground from under the player** — a watched surface
    never flashes, resets, resizes, or rebuilds; even a crash reads composed.
  - **TST3 · The fiction causes the mechanics** — discovered, not spawned; story
    promises exist in the game; the UI reveal follows the story beat.
  - **TST4 · The player never guesses state** — speaker, changes, newness,
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
- **Design by divergence (new/major UI surfaces) — ADR-075 (v2, refines ADR-073).**
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
  only the default). One-line tweaks are exempt. See **ADR-075** +
  [`.claude/skills/diverge/SKILL.md`](.claude/skills/diverge/SKILL.md).
- **Story diverges too — every narrative element ships from 3+ takes (ADR-139).**
  ALL new story elements and ALL feedback-driven story improvements come with
  **3+ options** — any **fiction-voiced text** the player reads (beats,
  dialogue, flavor lines, names, descriptions), at its own unit size;
  mechanical UI copy and typo/name-sync edits exempt. Options are **distinct
  dramatic choices** (register / reveal / stance — a paraphrase is not an
  option), authored by independent blind agents, **one agent per complete
  take**; the agent self-picks (per-option taste scorecard + canon fit) and
  the human overrides from **coherent bundles** — never 25+ atomized taste
  calls. Alternates stay DEV-only until sign-off; canon carries only the pick.
  **Every diverge reviews LIVE in the DEV menu's Story switcher** (human,
  2026-07-07) — if the unit can't swap yet, wiring the swap is PART of the
  diverge (core-emitted text uses the declaring-module DEV-setter pattern);
  a doc-only review is not a review.
  Procedure:
  [`.claude/skills/narrative-diverge/SKILL.md`](.claude/skills/narrative-diverge/SKILL.md).
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
  feedback-human/ledger entry (a pointer is not the artifact). Homes:
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
  **not** the route there: the §4 balance numbers and §7 MS2–MS7 milestone detail
  stay **provisional** (revised by playtest), never frozen as locked canon. Full
  rule, rationale + current freeze state: **ADR-021** (refines ADR-020, refined by
  ADR-059) in [`decisions.md`](docs/living/decisions.md).
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
