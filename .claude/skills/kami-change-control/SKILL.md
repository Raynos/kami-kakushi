---
name: kami-change-control
description: >-
  The change-class → procedure → sign-off → gate routing table for
  kami-kakushi. Load this BEFORE changing anything when you are unsure
  what procedure applies or whether you may act without the human —
  "can I just change this?", "do I need an ADR / HR-item for this?",
  "is this agent-safe or human-gated?". Fires for: committing or
  pushing in the shared tree, writing/reserving an ADR, editing the
  PRD, touching balance numbers or a slider export, authoring or
  editing story text, building/restyling a UI surface, map edits,
  save-schema bumps, releases/deploys, milestone done-claims,
  deferring work, or touching the human's TODO list. Also covers
  standing approvals vs always-human calls and the supersede-chain
  proof that change control itself changes only via the human.
---

# kami-change-control

This skill answers ONE question: *"I am about to change X — what
procedure applies, who signs off, which gate has teeth, and where does
the record go?"* It is a ROUTER: the procedures themselves live in the
named skills and guides; never re-derive them from memory.

Jargon (full glossary: sibling skill `kami-domain-reference`):

- **ADR** — a numbered entry in the append-only decision log
  (`docs/living/decisions.md` index + `decisions/` band files).
- **HD / HR-item** — an open decision / review in
  `project/human-in-the-loop/` that only the human can close.
- **Gate** — a check in `pnpm run verify` (roster owned solely by
  `src/scripts/gates.ts`; count it, never hand-type it:
  `grep -c "name: '" src/scripts/gates.ts` — 21 as of 2026-07-18).
- **Hook** — a `.githooks/` git hook or `.claude/hooks/` PreToolUse
  guard; enforcement that fires outside `verify`.
- **Shared tree** — several agents share ONE checkout: HEAD, index,
  and working tree are all shared (ADR-196/199).

**Weighting (human, 2026-07-18): the costliest failure class in this
repo's history is SLOP/TASTE.** (The quote awaits its committed
record — see kami-cohesion-campaign's Provenance for the
feedback-human/ADR obligation.) The rows that exist to prevent it —
diverge, narrative-diverge, taste-scorecard, map blind-pass — are the
load-bearing ones. "diverge-LITE" (one idea instead of 2–3 full
working variants) is banned by name (ADR-075); shipping it once under
an imaginary deadline is the incident that minted PH1.

## §1 · The change-class table

The routing index (procedure detail per class follows below — the
prose was moved OUT of the cells so the rows stay scannable,
per the repo's own wide-table norm):

| Change class | Sign-off | Teeth (gate/hook) | Record |
|---|---|---|---|
| **Design intent** (what the game IS) | HUMAN only; newest human steer supersedes any prior ADR or lock | norm — no gate can force the ask; `deferred-work` catches unhomed rulings | ADR-022 |
| **New / major UI surface** | Agent self-picks the default (never blocks); human overrides in the DEV panel Review tab | `review-link` gate (both directions); `verify-dev-strip.sh` | ADR-073→075, ADR-135, ADR-192 |
| **Fiction-voiced text** | Agent self-picks; human signs the coherent bundle via HR-item | `gen-narrative` gate; take-count is a norm (AC-11) | ADR-139, ADR-198; typo/name-sync exempt |
| **Balance / content magnitude** | Transcription: agent-safe. FEEL numbers: human-only (cockpit slider) | `verify:balance` — ON-DEMAND, not rostered; commit-time tooth is only the freshness WARN | ADR-132/133/134, ADR-059 |
| **Map / survey sheet** | Human is the taste gate (HR-item) | golden-hash pin test + roster↔layout integrity test | ADR-149, ADR-151 |
| **PRD edit** | Intent: human. Sync-to-shipped: agent-safe (freeze CANCELLED) | `gen-prd-regions` gate; `prd:drift` reporter | ADR-117, ADR-168 |
| **Save schema** | Agent-safe; wiping saves (`APP_GENERATION`) human-gated | vitest persistence tests; `fixtures` gate | ADR-161, ADR-179 |
| **Commit** (shared tree) | Agent-safe | pre-commit (verify+budget+journal+queue); `guard-git-add-all.sh`; `commit-msg` trailer | ADR-196, ADR-199 |
| **Push `main`** | Standing-approved at checkpoint — "not a per-push ask" | pre-push FULL suite refuses red; bare `git push` hook-blocked | ADR-196; working-agreements.md |
| **Release / deploy** | HUMAN invokes `/ship` — "the invocation is the sign-off" | `verify-changelog` gate (AC-22); `verify-dev-strip.sh` | FB-9, AC-21/22, ADR-096, ADR-138 |
| **Deferred / leftover work** | — | `deferred-work` gate; `/prepare-to-exit` leftover sweep | ADR-195; human ruling, s183 |
| **Milestone done-claim** | — | `milestone-integrity` gate | ADR-054, ADR-088 |
| **Human TODO list** | Human-authored only | pre-commit hard-block on added TODO lines; `human-todo` gate | human, 2026-07-06; repo-map.md |

The required procedure, per class:

- **Design intent** — STOP; put the fork to the human (`grill-me` /
  HD-item / AskUserQuestion); lock the answer as an ADR (§4). No
  gate can force the ask — the norm carries it.
- **New / major UI surface** — `diverge` skill: Pass-1 taste brief →
  2–3 FULL working variants behind the DEV-panel toggle → Pass-2
  per-variant scorecard → self-pick prod default → one HR-item per
  variant, id-referenced.
- **Fiction-voiced text** (beats, dialogue, flavor, names,
  descriptions) — `narrative-diverge` skill: 3+ blind takes, one
  agent per take, live-switchable in the DEV Story switcher (wiring
  the swap is PART of the diverge); alternates DEV-only until
  sign-off; never 25+ atomized picks.
- **Balance / content magnitude** — read `project/telemetry/` first
  if reports exist (FB-8); `pnpm run verify:balance` →
  `pnpm run balance:report`; commit the regenerated
  `docs/content/t0-pacing.md` WITH the change, `balance-sim
  --summary` in the commit body. Honest teeth note: `verify:balance`
  is deliberately NOT in the verify roster and its nightly step is
  commented out — YOU must run it; the only automatic commit-time
  tooth is the walk-past-able freshness WARN (the `pacing` /
  `playcheck` gates catch gross drift). The agent never moves a
  slider into canon — it TRANSCRIBES the human's exported old→new
  diff.
- **Map / survey sheet** — `map-sheets` skill only, never freehand;
  golden pin; `map-blind-pass` after any look-bearing change; NEW
  tier sheet = spec-first → human HR read → build. The committed
  look changes only with a deliberately regenerated pin.
- **PRD edit** — `/prd-ripple` Flow-1 classify: balance number → NO
  §4 edit · system/narrative → targeted ripple + ADR · **intent →
  STOP** · frontier → edit freely; then `pnpm run prd:drift`. A
  rename also updates the hand-maintained RETIRED list in
  `src/scripts/prd-drift.ts` same-commit (norm).
- **Save schema** — read the CURRENT `SCHEMA_VERSION` from
  `src/core/constants.ts` (never trust a remembered number — it
  moved mid-day on 2026-07-18), bump it, add an ordered forward
  migration in `src/persistence/migrate.ts`, test it — full recipe:
  sibling `kami-save-and-schema` (+ `src/persistence/README.md`).
- **Commit (shared tree)** — pathspec-only: `git add` NEW files
  only, `git commit -m "…" -- path/a path/b` (file-level, never
  dir-level); journal entry staged; full verify runs (§3).
- **Push `main`** — `pnpm run push` (the push mutex,
  `src/scripts/push-main.sh`) as part of a checkpoint; lane held by
  a live agent → commits stay LOCAL and that is the designed
  outcome.
- **Release / deploy** — `/ship` only (draft CHANGELOG section →
  `src/scripts/ship.sh`: bump → tagged commit → push → isolated
  build → gh-pages). Never `pnpm version` in the shared tree;
  agents never self-invoke `/ship` or run `ship.sh` autonomously.
- **Deferred / leftover work** — give it a home the human READS:
  `docs/plans/` (via `write-plan`) · HR/HD-item ·
  `project/BACKLOG.md`. ADR bullets, journal lines, and snapshot
  prose are a RECORD, not a QUEUE; the `deferred-work` gate REDs a
  shouted `NOT built` that cites no home-path within 4 lines.
- **Milestone done-claim** — every DoD line met, or formally
  ADR-amended BEFORE the claim commits (`milestone-integrity.ts` —
  every DoD-named test must resolve to a real test).
- **Human TODO list** — NEVER append to `project/todo-human.md`
  `## TODO`; an agent finding becomes an HD/HR-item instead
  (`SKIP_HUMAN_TODO=1` only for a TODO the human dictated
  verbatim).

The incident behind each row (full chronicle: sibling
`kami-failure-archaeology`):

- **Design intent** — ADR-119: ADR-112's own DoD said the quest-home
  fork "must be resolved WITH the human"; it shipped on an agent
  default and was overridden in the audit.
- **UI surface** — the diverge-LITE incident: three single-idea panels
  shipped under a self-imposed, nonexistent deadline (ADR-075, PH1 /
  ADR-080). Human: "full 2–3 variants or nothing."
- **Fiction text** — ADR-190: a content rewrite silently deleted the
  game's one asymmetric stat-bonus mechanic and **every gate stayed
  green**; ADR-188: 2 of 12 reviewer redlines evaporated because they
  lived only in context.
- **Balance** — pre-play balance canon "has a poor survival rate"
  (ADR-132); the slider law exists because feel is the human's taste
  organ, not the agent's (ADR-134).
- **PRD** — the freeze chain (§5): five ADRs of trying to freeze text
  before ADR-168 conceded the PRD must track the shipped game.
- **Save schema** — ADR-179: an old save pinned dead tabs ("the tabs
  visible to me are based on the save file … not the actual game").
- **Commit** — `f84aff9` and `0e10d96`: bare commits swept a
  co-agent's staged files (cited in working-agreements.md §Checkpoint).
- **Push** — 218 push rejects in 548 sessions before the mutex
  (`src/scripts/push-main.sh:4-6`).
- **Release** — ADR-096: three disagreeing version numbers on one
  build; `package.json` became the single source.
- **Deferred work** — session 183: a fresh human ruling recorded in
  ADR + snapshot + journal + HR-item still counted as LOST — "if it's
  not in docs/plans/ it will be lost and not built."
- **Milestone** — ADR-054 exists because DoD lines were being
  narratively rounded up to "done" (PH3: done is earned).

## §2 · Standing approvals vs always-human

Standing-approved (do it, note it, move on — PH4):

- `pnpm run push` to `main` **as part of a checkpoint**
  (working-agreements.md: "not a per-push ask"); the pre-push gate
  refusing red is the safety.
- Routine build → verify → pathspec commit → journal on the working
  branch; reversible self-picked defaults, surfaced async.
- PRD text fixes where it describes a game that no longer ships
  (ADR-168) — intent changes still stop.
- Applying inbox fixes AFTER the human's per-batch go-ahead
  (`drain-inbox` §4).
- Save-schema bumps with a proper migration (row above) — this one
  is INFERRED FROM PRACTICE, not a written approval: v13→v15 all
  landed agent-side under their feature plans (a bump always rides
  its feature's plan — kami-save-and-schema §3d).

Always the human's call — never route around these:

- **Deploy / release** — `/ship` is human-invoked only (FB-9).
- **Force-push, delete, anything outward-facing or hard to reverse.**
- **Design decisions changing what the game is** (ADR-022).
- **Taste picks**: balance sliders into canon (ADR-134), diverge /
  story-take final verdicts (HR-items), feature retirement, the map's
  committed look (pin regeneration is deliberate, human-reviewed).
- **Appending to `todo-human.md ## TODO`** (gated).
- **Relaunching a dead `:5264` dev server** — ask; never respawn
  (`guard-dev-server.sh`).
- **Model routing** — no lateral / non-inherited model switch without
  explicit steer; plans PROPOSE routing (AGENTS.md).
- **Wiping player saves** (`APP_GENERATION`, ADR-161 precedent).

Escape flags (`SKIP_*`) are documented next to what they escape; the
full catalog is owned by sibling `kami-config-and-flags`. Two hard
lines: `SKIP_VERIFY=1` combined with a push is hook-blocked (never
push red), and tree-wide destructive git ops have NO escape var —
naming explicit paths IS the escape (`guard-bash-safety.sh`).

## §3 · The shared-tree commit contract (brief)

Depth, incidents, and the `GIT_INDEX_FILE` rescue recipe live in
`docs/guides/shared-tree-git.md` — read it before your first commit
here. The contract in five lines:

1. `git add path/to/new-file.ts` — for NEW files ONLY. Never `git add`
   a tracked file; edits commit directly.
2. `git commit -m "…" -- path/a path/b` — always an explicit pathspec,
   file-level not dir-level (dir pathspecs sweep co-agents' dirty
   files). The `--` triggers git's `--only` semantics: the shared
   index is never consulted.
3. Never `git commit -p` (seeds from the SHARED index — verified to
   commit a co-agent's staged file), never bare `git commit`, never
   `-A`/`-a`/`-u`, never `stash`/`checkout`/`restore` on files you
   didn't author. Guard-blocked; bypasses are ledgered to
   `project/status/sweepguard-ledger.md`.
4. Re-check the staged set right before every commit
   (`git diff --cached --name-only`) — another agent may have staged
   files in the window.
5. Residual hazard you must carry in your head: `verify` tests the
   WORKING tree (everyone's WIP) but you commit HEAD + your paths —
   different trees. A green gate does not prove the committed tree is
   green; don't fight someone else's red, leave commits local.

Every AI commit ends with the `Assisted-by: AGENT_NAME:MODEL_VERSION`
trailer (real model, never hardcoded; never `Co-Authored-By:`) —
enforced by `.githooks/commit-msg`.

## §4 · ADR authoring mechanics

An ADR is how a locked decision becomes durable. Mechanics
(decisions.md index + ADR-196):

1. **Reserve the number first** — two sessions must not take the same
   one:

   ```bash
   pnpm exec tsx src/scripts/tree-claim.ts adr      # reserve 1
   pnpm exec tsx src/scripts/tree-claim.ts adr 3    # reserve 3
   ```

   The allocator reserves above the high-water mark — every
   `### ADR-nnn` heading across the index + all band files, plus
   live reservations (the heading scan, tree-claim.ts ~:140); the
   CLI surface is the header usage block
   (`src/scripts/tree-claim.ts:19-25`).
2. **Write the entry in the LIVE (newest) band** —
   `docs/living/decisions/150.md` as of 2026-07-18 (bands shard by
   number: 000/050/100/150; the index in `docs/living/decisions.md`
   names the live one). Copy the template from the index: title line
   `### ADR-nnn ✅ — {title}`, first bullet `- **created_date:**` —
   the date is what disambiguates under newest-steer-wins.
3. **Never delete or rewrite a superseded entry.** Mark the old one
   `⛔ REVERSED by …` (or 🔁 Amended for a clause), strike the dead
   claim with `~~strikethrough~~`, add a forward pointer, and write
   the NEW ADR with the new call. History stays intact (decisions.md
   header, "Reversing a decision").
4. **Precedence** (decisions.md header): on *current state* a living
   doc beats an ADR (fix the stale one); on *why*, the ADR wins.
5. A rename-class ADR (retires a player-visible term) also updates the
   RETIRED list in `src/scripts/prd-drift.ts` in the same commit
   (norm — no gate can soundly know a rename happened).
6. An HD-item the human just answered graduates: rationale-bearing →
   ADR; purely mechanical → archive row only ("ADR-ing a no-op
   dilutes the log", `project/human-in-the-loop/README.md`).

(The 4bfb3ba3-era gap-note correction is RETIRED: the index now
correctly names **ADR-147** as the one never-written number — fixed
in place 2026-07-18. Re-verify any time:
`grep -rn "### ADR-14[678]" docs/living/decisions/` — 146 and 148
hit, 147 never does. Visual canon is Andon Steel, ADR-127 — owner:
kami-domain-reference §5.)

## §5 · Change control itself changes only via the human

The supersede chains are the proof. Nobody — no agent — relaxed a
control by interpretation; each step is a dated, human-locked ADR:

- **PRD freeze:** ADR-020 (freeze the PRD) → ADR-021 (freeze locked
  intent only) → ADR-022 (decisions resolve BEFORE coding) → ADR-059
  (freeze deferred to end-of-v1) → **ADR-168: freeze CANCELLED — the
  PRD tracks the shipped game; locked intent binds as intent, not
  text** (`decisions/150.md:556`).
- **Diverge:** ADR-073 (branch-preserved variants + screenshots) →
  ADR-075 (in-codebase DEV toggle, diverge-LITE banned, per-variant
  HR-items) → ADR-192 (positional V/SV tags dead; stable ids, gated
  by `review-link`).
- **Verify cadence:** ADR-070/071 (deferred/lean subset) → reversed
  same day by ADR-072 (full verify pre-commit) → ADR-176 (5s soft /
  8s HARD budget + the `@slow` lane split) after the 3s→33s rot.

The lesson to act on: when a control chafes, the move is an HD-item
proposing the change — never a quiet workaround, never `SKIP_*` as a
lifestyle. Every supersession above made the control BOTH looser where
it was theater and harder where it had no teeth.

## When NOT to use this skill

- **Executing a procedure this table routes to** — use the owning
  skill directly: `diverge`, `narrative-diverge`, `taste-scorecard`,
  `map-sheets`, `prd-ripple`, `prd-compress`, `write-plan`,
  `drain-inbox`, `prepare-to-exit`, `ship`, `tdd`, `battery`.
- **Per-gate RED diagnosis / fix recipes** → `kami-verify-gates`.
- **The full SKIP_*/flag catalog** → `kami-config-and-flags`.
- **Fresh clone, verify anatomy, CI map, dev-server law** →
  `kami-build-and-env`.
- **The schema-bump recipe in depth** → `kami-save-and-schema`.
- **The full incident chronicle** → `kami-failure-archaeology`.
- **"To add feature X, touch which files?"** →
  `kami-extension-recipes`.
- **Debugging a broken behavior** (no change-permission question) →
  `kami-debugging-playbook`.

## Provenance and maintenance

Authored 2026-07-18 from repo state at HEAD `4bfb3ba3` (all file:line
citations checked against that tree; committed canon read via
`git show HEAD:<path>` because a co-agent's talk-system WIP was in
flight — and indeed `SCHEMA_VERSION` moved 14→15 between the morning
discovery pass and this authoring, which is why this skill teaches
reads, not numbers).

Volatile facts + one-line re-verification:

- Gate count (21 @ 2026-07-18):
  `grep -c "name: '" src/scripts/gates.ts`
- Live ADR band (150.md @ 2026-07-18):
  `grep -n "LIVE" docs/living/decisions.md`
- ADR gap (147 @ 2026-07-18):
  `grep -rn "### ADR-14[678]" docs/living/decisions/`
- tree-claim CLI surface: `sed -n '20,27p' src/scripts/tree-claim.ts`
- Checkpoint ritual steps (canon, not this file):
  `project/status/working-agreements.md` §Checkpoint
- Standing-approval wording: `sed -n '24,36p'
  project/status/working-agreements.md`
- Push-mutex behavior: `sed -n '1,30p' src/scripts/push-main.sh`
- Pre-commit escape flags: `grep -n "SKIP_" .githooks/pre-commit`

If any row's teeth or sign-off changes, the change will itself be an
ADR in the live band — re-read the newest band before trusting this
table after a long gap.
