# Implementation plan — actioning the decision backlog

> **What this is.** How we take action on (a) the **23 decisions** from the 2026-06-29 session
> ([`../../project/feedback/2026-06-29-decision-session.md`](../../project/feedback/2026-06-29-decision-session.md)),
> (b) the **past-but-unactioned reshape** D-048…D-055
> ([`../../project/status/pending-prd-reshape.md`](../../project/status/pending-prd-reshape.md)), and (c) the
> **op-model v2-lite** ([`operating-model-v2-lite-reelback.md`](operating-model-v2-lite-reelback.md), pending
> your review). **Living plan — pre-canon; supersedes nothing until executed.**

## 1 · The backlog (everything unactioned)

| # | Body of work | Source | Status |
|---|---|---|---|
| 1 | **23 game/process decisions** | the 2026-06-29 ledger | locked, **not yet ADR'd or rippled** |
| 2 | **The 6-tier reshape ripple** (PRD §1.6/1.7/4.6/4.8/5/7 + living docs + code) | D-048…D-055 / pending-prd-reshape | ADR'd, **not rippled** (PRD body still 5-tier & STALE) |
| 3 | **Op-model v2-lite** (verify-hook, playcheck, diverge, roadmap re-axe) | the reel-back | **awaiting your review** |
| 4 | **Housekeeping** (H-item queue cleanup, status, journal) | accumulated | small, ongoing |

## 2 · Workstreams (the decisions → concrete actions)

- **A · Lock decisions → ADRs (D-056+).** Turn the ~15 *game-design* decisions into ADRs in
  `decisions.md` (annotate-don't-delete: #1 supersedes D-047's demo-default; #3 amends signed D-043; #7
  refines D-020/21/46; #20 refines D-051/33). *Process/op-model decisions (#10 diverge, #15 save, #21
  durable-by-default [already in CLAUDE.md]) fold into the op-model ADRs — held for your review.*
- **B · The ripple (the big one).** H8 **PRD-split** → `prd/§1…§7.md`; then apply the reshape + this
  session's design across PRD body, living docs (qa-playtesting tier 0..5, ui-design, fun-factor,
  working-agreements), **regen `docs/content/`**, and **code** (tier enum · `ranks.ts` · `state.ts`
  pillars/tier/carried-HP · `step.ts` season/gate/wall-time · `rewards.ts` pillarDeltas/ascension ·
  `combat.ts` carried-HP/heal-by-eating/non-dominated stance · estate flywheel · content registries
  [market, found-crafted weapon, NPC line, **walkable T0 map**, diegetic mentor] · save-wipe vs migrate ·
  CI manifest). **Gated on your "more PRD feedback."**
- **C · Roadmap re-axe finalize.** [`2026-06-29-roadmap-reaxe-proposal.md`](2026-06-29-roadmap-reaxe-proposal.md)
  → `docs/living/roadmap.md` (nested per-tier; carry-forward T0; spine-first; v0.2 gates baked as DoD).
- **D · Op-model v2-lite adopt.** Pre-commit `verify` hook → `playcheck` ratchet → mandatory `diverge`
  skill → CLAUDE.md norms. **Gated on your review (~1 hr).**
- **E · The build.** Carry-forward T0 + reshape (HP-carry/heal, found-crafted weapon, Estate pillar +
  ascension, flywheel, SFX, dev tools, walkable map, mentor, humbling tune), **spine-first** (ascension on
  thin content) → then breadth. **Gated on B's code + C + D's process.**
- **F · Housekeeping.** Mark resolved H-items (H1–H6 by reshape; H1/H2 by this session); update
  `project-status.md`; journal the session.

## 3 · Gates — what's actionable NOW vs blocked on you

- ✅ **Ungated (can do immediately):** **A** (game-design ADRs) · **C** (roadmap finalize) · **F** (housekeeping).
- ⏸ **Gated on your "more PRD feedback":** **B** (the batched ripple).
- ⏸ **Gated on your op-model review:** **D**, and **E**'s build *process*.
- ⏸ **Gated on B+C+D:** **E** (the build).

## 4 · Sequencing options

**Option 1 — Layered & verify-green (RECOMMENDED).** Do the ungated work now (A + C + F, checkpoint-commit),
while you do R1 + the op-model review + gather PRD feedback. Then D (op-model) → **B** (batched ripple via a
Workflow) → **E** (build spine-first). Each layer committed & verify-green. *Pro:* steady progress, low-risk,
resumable, never builds on shifting ground. *Con:* several passes.

**Option 2 — Wait & one coordinated push.** Hold ALL execution until your PRD feedback + op-model review land,
then sequence everything in one go. *Pro:* cleanest single push. *Con:* nothing moves until you're done; the
big batch carries more risk at once.

**Option 3 — Aggressive build-first.** ADRs are source-of-truth while pending (D-022) → start the
carry-forward T0 build now, ripple docs lazily, retrofit op-model. *Pro:* fastest to a playable spine. *Con:*
docs stay stale; risks building before the process (verify-gate/playcheck/diverge) is set → possible rework.

## 5 · The ripple mechanism (for B, when unblocked)

A **multi-agent Workflow** (pending-prd-reshape itself recommends this): **phase 1** map every reshape/decision
site across PRD + living docs + code → **phase 2** pipeline edits per file with a convergence critic →
**phase 3** regen `docs/content/` + run `npm run verify`. Handles the scale + the truncation risk the
PRD-split removes.

## 6 · Recommended next 3 steps (Option 1)

1. **Write the ~15 game-design ADRs (D-056+)** + checkpoint-commit (locks canon; unblocks B/C/E).
2. **Finalize `docs/living/roadmap.md`** from the proposal (the spine everything sequences against).
3. **Housekeeping** (H-item queue + status) + commit. → *In parallel: you do R1 + op-model + PRD feedback.*

Then, once your inputs land: **D → B (Workflow ripple) → E (build, spine-first).**
