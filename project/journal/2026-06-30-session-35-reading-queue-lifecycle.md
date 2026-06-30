# Session 35 — 2026-06-30 — Reading-queue sign-off goes implicit (D-089)

**Summary:** Cleared the signed-off stale-markdown-sweep report from the reading
queue, then — on a human steer — reworked the reading-queue lifecycle: sign-off
is now **implicit** (reading or discussing a doc = signed off) and the **agent
owns keeping `todo-human.md` clean**, with `/prepare-to-exit` doing a batch
AskUserQuestion reconciliation. Recorded as **D-089**.

## What changed
- `project/todo-human.md` — cleared the stale-markdown-sweep reading-queue item
  (human confirmed read); rewrote the header + reading-queue lifecycle to encode
  implicit sign-off + agent-owned cleanup (D-089).
- `repo-map.md` — updated the reading-queue description ("remove when the human
  signs off" → implicit sign-off + agent cleanup + `/prepare-to-exit` reconcile).
- `project/status/working-agreements.md` — added Checkpoint **step 4**: reconcile
  the reading queue (interactive AskUserQuestion at `/prepare-to-exit`; autonomous
  checkpoint clears only clearly-engaged docs). Renumbered Push→5, Confirm→6.
- `docs/living/decisions.md` — new **D-089** (supersedes the manual-sign-off
  lifecycle per D-022; preserves R3 via the `/prepare-to-exit` certification).

## What changed (follow-ups)
- `project/todo-human.md` — focused rewrite: de-duplicated the D-089 lifecycle
  (was stated in both blockquotes), dropped the stale HTML comment + the
  closed-this-session footer (41→31 lines, cat-readable).
- `project/status/project-status.md` — added D-089 to the process-canon bullet.

## Checkpoint note (shared-tree event — corrected)
- Mid-session a concurrent agent/session committed two AGENTS.md-restructuring
  commits (`927902c` extract-dir-map→`repo-map.md`, `f8a27da` regroup) **directly
  on top of my `beee966`** and pushed them — which is why `origin/main` had
  advanced and AGENTS.md/`repo-map.md` changed under me.
- **No rebase/reset occurred and nothing was dropped.** The history is fully
  linear (`beee966 ← 927902c ← f8a27da ← f258c61 ← 233df44 ← de5a196`). My initial
  "dropped `beee966`" read during the checkpoint was wrong — an artifact of
  `git log -4` not reaching the 5th commit and `origin/main` already being ahead.
  `beee966` is and always was in `origin/main`. Push was a clean fast-forward.

## Next intended steps
1. Active workstream remains `docs/plans/2026-06-30-v0.3.1-build.md` (unchanged).

## Landmines
- The `prepare-to-exit` skill is deliberately **copy-free** — it inherits the new
  step from the working-agreements Checkpoint ritual; don't paste the step into
  the skill.
- `repo-map.md` now lives at the **repo root** (not `docs/`); it's `@`-included
  into AGENTS.md from there.
