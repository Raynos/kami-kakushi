# Session 54 — 2026-07-03 — the agent-default decision audit

**Summary:** Verified (don't trust) the build status of the six T0-build plans,
then walked the human interactively through every place the agent had picked a
"default" and shipped it. Recorded the outcomes, archived the five genuinely-built
plans, and authored two follow-up plans (`v0.3.5-build-plan`, `v0.3.5-cleanup-docs`).
No game code changed — this is doc/record work only.

## What happened

1. **Verified six plans** via six parallel `Explore` agents (one per plan),
   grounding build status in git commits + source, not the stale Status headers.
   Result: five BUILT (rung-up, append-only, deep-housing, ia-tab-reorg,
   economy-rediagnosis-superseded); **`koku-economy-t0` only Ph1–4** — Phase 5
   (status tokens) was never built (confirmed by session-49's journal).
2. **Interactive walk-through** (AskUserQuestion, 5 rounds) of every agent-picked
   default. 8 overrides + 7 ratifications. Full ledger in the audit doc's
   "Decisions recorded" table. Notable human calls: Quests → its **own** tab
   (6→7); Inventory reveal **staggered to R3**; hearth **homes the cook verb** &
   chest **becomes real storage** (both off-plan defaults reversed); **no morale
   system**; R7 capstone **must matter mechanically**; status ladder is **one T0
   home token, full ladder = T1–T5 PRD planning**.
3. **Archived** the five built plans + the superseded diagnosis to
   `project/archive/` with honest "BUILT & verified" banners (the stale "no code
   changed" headers were false); fixed the three inbound links this broke.

## What changed
- `project/audit/reports/2026-07-03-agent-default-decision-audit.md` — **new**;
  the verification report + the decision ledger.
- `docs/plans/opus-2026-07-03-v0.3.5-build-plan.md` — **new**; the 8 code deltas.
- `docs/plans/opus-2026-07-03-v0.3.5-cleanup-docs.md` — **new**; ADRs + PRD ripples.
- `project/archive/opus-2026-07-02-{economy-koku-rediagnosis,koku-economy-t0-build,
  ia-tab-reorg-build,deep-housing-build,rung-up-story-transitions,
  append-only-rendering-engine}.md` — **moved** from `docs/plans/`, banners added.
- `docs/living/decisions.md`, `project/human-in-the-loop/review.md` — inbound
  links repointed to the archived paths (md-links green, 65 files).
- `project/todo-human.md` — reading queue: audit marked walked-through, two new
  plans added, archived paths fixed, footnote updated.
- `ui-demos/README.md`, `ui-demos/shared/VARIANT-SPEC.md` — ui-remaster path
  fixes (completing the archive move session-53 committed).

## Next intended steps
1. Human reads the two `v0.3.5-*` plans.
2. `cleanup-docs`: draft the 7 ADRs (Opus), then the Fable + human-signed PRD ripple.
3. `build-plan`: work the 8 deltas (1–3 are cheap/isolated; 4 rides the PRD ripple).

## Landmines
- **`koku-economy-t0` is NOT fully done** — Ph5 lives on in build-plan §8. Don't
  let the "archived" state read as "status tokens shipped."
- Shared tree: session-53 ran concurrently (plan filename prefixing, snapshot
  hygiene). Staged only own files by path. Re-check `git diff --cached` before commit.
- The 8 overrides each invalidate a test that asserted the old default — update
  those tests (they should have been able to go RED) as each delta lands.

---

## Update — the v0.3.5-cleanup-docs plan executed & archived (same session)

Human directed: "do the whole cleanup-docs plan then archive it," + a new model
rule (subagents inherit the parent's model; no Opus→Fable unless told). Executed
all three sections as **Opus** (no Fable), the PRD sweep fanned to per-file Opus
editors, each verified by the parent:

- **AGENTS.md** — added the model-routing rule ("How to work here").
- **§1 ADRs** — wrote **D-118…D-124** to `decisions.md` (economy, IA/7-tabs
  superseding D-112, housing, story/capstone, status-tokens, render, model-routing).
- **§2 PRD ripple** — 6 parallel Opus editors, one per `docs/living/prd/*.md`:
  7-tab IA (Quests regains its own tab, D-119 supersedes D-112 & reinstates
  D-037), Inventory staggered to R3, housing semantics (hearth→cook, chest→storage,
  **no morale/upkeep**), rice storage cost (D-118, mechanism TBD), T0-one-token
  status split (D-122), R7 capstone-branch forward-note (D-121). Verified: no
  stale "six-tab"/"morale" left in-scope; "seven-tab" in all 7 docs.
- **§3 reconcile** — `ui-design.md` (§4.9 rewrite) + `fun-factor.md` aligned.
- Archived the plan to `project/archive/` (Status ✅); fixed the build-plan's
  inbound link + the audit doc's link (the latter a false-green — md-links doesn't
  scan `project/audit/reports/`, so it was fixed by hand).

**Landmines (this update):**
- **`prd:drift` is NOT clean** — 19 items (mobs/stances/cast not in PRD). These
  are **pre-existing broad content-coverage drift, NOT from this ripple** — don't
  read them as a cleanup failure.
- **Quests tab reveals at R3** (grouped with the Combat+Inventory wave) — this was
  an agent inference from "quests open with combat," NOT an explicit human call.
  R3 now reveals 3 tabs, in mild tension with "one-reveal-per-beat." If the human
  prefers, Quests can move to R5 (gentler R3, faithful to D-037's old cadence) —
  flagged for override; the docs are internally consistent at R3 for now.
- Another agent was active concurrently (prd-drift.ts, ui-demos, a mobile-ui-demos
  plan) — staged only own files by explicit path.

---

## Update 2 — Quests→R5, build-plan sub-decisions locked, R7 capstone split out

Human review of the build plan. Resolved:
- **Quests tab → R5** (not R3): the human chose the gentler cadence — R3 is now
  just Combat + Inventory; Quests reveals as its own R5 beat (D-037's cadence).
  Rippled through D-119, ui-design (§4.9/§5.6/reconcile note), and prd/03 (the §3.0
  cadence line, the R3 + R5 rung rows, the §3.5 nav table). *(Supersedes the
  Update-1 landmine that had it at R3.)*
- **Build-plan design sub-decisions LOCKED** (AskUserQuestion): #1 rice = spoilage
  on ALL rice (carried + stored) **+** an upgradeable kura capacity cap; #6 chest =
  belongings-only modest buffer (not rice/goods); #7 (now the status token) = a
  **weapon mounted on the wall** — the weapon you wield at **R5** — NOT a surname
  (that's the T3 origin beat). Rippled into D-122 + fun-factor.
- **R7 capstone branch SPLIT OUT** of the build plan into its own STUB design plan
  (`opus-2026-07-03-r7-capstone-branch-design.md`) — the human wants it designed
  first (grill-me/diverge → signed design), so the remaining **seven** locked
  deltas can be built by a subagent in parallel. Build plan renumbered 8→7 tasks
  (the old §8 status-token is now §7; the Update-1 "build-plan §8" pointer above is
  stale — it's §7 now). D-121 repointed to the new design plan.

**Next:** hand the seven-task v0.3.5 build plan to a build subagent (Opus, per
D-124); separately run the R7 capstone design pass.

---

## Update 3 — parallel tracks: v0.3.5 built (worktree) + R7 capstone designed

- **Track A — v0.3.5 build subagent DONE** (worktree branch
  `worktree-agent-a125ef980e547d3ef`, 5 commits, 591 tests + 12-gate verify +
  playcheck green). All 7 tasks landed. Honest R6 caveat: reachability proven at
  the JSDOM-renderer + core-sim level, not a live browser screenshot. Merge
  landmines flagged (cook verb NOT hard-gated on the hearth so pre-hearth combat
  healing survives; chest storage is a shown buffer not yet a binding wall;
  md-links cries wolf from the *shared* checkout because it recurses into
  `.claude/worktrees/*`). **NOT yet merged — parent to review-then-merge (R2/R3).**
- **Track B — R7 capstone DESIGNED** via grill-me + diverge
  (`project/brainstorms/2026-07-03-r7-capstone-branch.md`). The three-way
  (devoted/ambitious/humble) each keeps its regard/warmth AND unlocks a unique T1
  side quest → a unique equippable item + a separate unlock. Human picked **A2 /
  B1 / C2** from a 9-option board. Promoted to the (now un-stubbed) design plan.
  One PENDING: all 3 items are weapons — offer to reflavour one.

**Next:** (1) review + merge the v0.3.5 worktree branch to main; (2) push; (3) the
R7 capstone build is post-v0.3.5.

---

## Update 4 — v0.3.5 MERGED; R7 capstone designed, deferred to T1 + graduated

- **v0.3.5 merged to main** (`f2f5b99`, verify green) — the 7 tasks + the Issue-A
  fix (home reveal → R3, adjusting D-111). Adversarially reviewed (591 tests, all
  new tests RED-able); the two minor concerns (cook double-locus, non-binding chest)
  accepted for T0.
- **R7 capstone fully designed** (grill-me + diverge): the 3-way keeps its
  regard/warmth + each unlocks a unique T1 side quest → item + a separate unlock.
  Picks A2/B1/C2; ADR **D-125** (the reusable pattern for T1–T5) + PRD **§3.0.2**
  (pattern + full 3×3 board + ratings).
- **Capstone build DEFERRED to T1 (R6 catch):** T1 (R8→R15) doesn't exist —
  `RankId` is `R0…R7`. Building the T1 side quests now = unreachable scaffolding, so
  we stopped. The settled design **graduated to durable canon**
  `docs/living/capstone-t0-branch.md`; the plan **archived**; roadmap T1 + D-125 +
  PRD §3.0.2 all point to it. Build when T1 lands.

**Next:** push the session (v0.3.5 + all the design docs are unpushed); clean the
merged worktree; the capstone build waits for T1.

---

## Update 5 — checkpoint / exit (pushed + DEPLOYED + cleaned)

- **Archived** both done opus-2026-07-03 plans (v0.3.5-build ✅ built+merged,
  cleanup-docs) + the r7-capstone plan; **graduated** the capstone design to
  `docs/living/capstone-t0-branch.md` (build deferred to T1).
- **Reconciled todo-human** hard: dropped every signed-off / archived / stale /
  duplicated-in-review.md item; codified "archived docs never belong in the queue";
  the balance-watch report was **read** by the human → all 4 items are D-059
  feel-calls (best tuned by playing) → cleared from the queue, left as the report.
- **`emergent-node-actions`** brainstorm → an implementation plan (Phase-0 design
  pass first).
- **PUSHED** `origin/main` (pre-push verify green) and **DEPLOYED to gh-pages** —
  the v0.3.5 build (7-tab IA, rice spoilage, wall-weapon, …) is now **live** at
  raynos.github.io/kami-kakushi (`bef8b5c`, DEV-cheats-stripped gate passed).
- **Removed** the merged agent worktree + branch. Snapshot brought current.
- **State at exit:** `main` == `origin/main`, tree clean, verify green.
