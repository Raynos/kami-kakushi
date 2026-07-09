# Session 132 — 2026-07-09 — v0.4.0 ship + the rung-reorg batch

## ☀️ SUMMARY (read this first)

This file is HISTORY, not live state — the snapshot is
[`../status/project-status.md`](../status/project-status.md).

Two big arcs in one long session:

1. **Shipped v0.4.0** — the storywave T0 rewrite went LIVE on gh-pages via
   `/ship` (minor, human-invoked). Then the full post-ship cascade: all THREE
   storywave plans archived (Plan B game, Plan A docs incl. the A5 closure,
   story-bible-finish), HR-8 closed moot, HR-17 signed off (Take C canon, the
   `hd30-nengu` diverge KEPT by human steer). Plus the **rewrite-debt counter
   gate** on the snapshot + its inaugural rewrite.

2. **The rung-reorg batch** — the human is doing rung-by-rung QA and asked for a
   pile of things: reorganize the review queue + DEV variants by rung, move
   `e2e/`, a combat retune, T2 rungs/fog, and misc tidy. Fanned the
   investigation to 4 read-only subagents, applied their findings sequentially
   in the main thread.

---

## 1 · v0.4.0 ship + post-ship cascade

- `/ship minor` → **v0.4.0 "the storywave release"** live at
  raynos.github.io/kami-kakushi (release commit `4ac1ead`, tag `v0.4.0`,
  gh-pages served). CHANGELOG section authored (player-facing house voice).
- **Cascade:** closed HR-17 + HD-30 (archived); HR-8 moot on ship; HR-10
  superseded → archive. **Plan A A5 closure** (`23fcb71`): stripped 11 PRD
  forward-spec banners, `shigemasa→munemasa`, §5.6 → a bible pointer, added the
  shipped T0 map-nodes/quests → **`prd:drift` CLEAN**; qa-playtesting harness
  lines (0..6 tiers, Tokubei→Yohei); archived the parked T1 capstone plan.
  **All three storywave plans archived**; `docs/plans/` holds no storywave plan.

## 2 · The rewrite-debt counter (a gate the human requested)

- `project-status.md` is snapshot-class + hard-capped, so adding a line means
  lossily COMPRESSING (I did it ~5× in one session). The human: "every edit that
  doesn't bump the number is a scam." Built it into the **doc-budgets gate**
  (git-aware): RED if the snapshot changed vs HEAD but `rewrite-debt` didn't rise;
  loud WARN at ≥20 → rewrite fresh. Threshold tunable in `verify-doc-budgets.ts`.
  RED-proved (edit-no-bump → red; bump → green). Inaugural full rewrite: snapshot
  120 → 100 lines, counter seeded `0/20`.
  - **Landmine:** the gate fires on ANY snapshot change vs HEAD — including a
    `checkpoint` gen-region regen (the journal pointer). So a session that adds a
    journal must bump the counter too. If that turns into wolf-crying, exempt
    gen-region-only diffs.

## 3 · The rung-reorg batch (4 subagents → sequential apply)

Fanned read-only research to 4 subagents; applied each in the main thread:

- **review.md** — rewritten by rung, re-indented; HR-1 re-framed to the live
  v0.4.0 arc; **HR-2 split into per-rung HR-2A–2D**; cross-referenced against
  `dev.ts` SURFACES → removed 2 STALE variant groups (log-filter ships as one
  rendering; walkable map resolved by HR-7). Rung corrections (home R5→R3, quests
  R4→R5, market→~R1, influence→R3, estate/tracker→R1·fills-R7). Content names
  checked current.
- **DEV Variants tab** grouped by rung (`SurfaceDef.rung` + a rung-sorted display
  with headers; V-tags stay registry-ordered so they don't shift).
- **`e2e/` → `src/tests/e2e/`** — the standing TODO. Config/CI/pre-push/tsconfig/
  docs updated; 82 specs green. TODO cleared.
- **`test-results/` → `./tmp/test-results`** — repo-local (CI artifact path
  updated so upload-artifact still resolves it).
- **Combat R4+ retune — INVESTIGATED then REVERTED.** The agent's `wood`-for-
  `hardwood` axe fix breaks the material closed-loop invariant (recipes use
  MATERIALS, not base resources); and the "chicken-and-egg" is the intended
  loot→craft loop (beat the bandit → hardwood → axe). The real in-loop wall is a
  decayed-state satiety×durability cliff — arguably the intended "mend first"
  mechanic. → a genuine balance-design call for the playtest inbox, NOT a fix.
- **T2 rungs/fog** — the build is DEFERRED (wants live map-geometry iteration);
  the agent's full plan is captured at
  [`../../docs/plans/t2/opus-2026-07-09-t2-rungs-fog.md`](../../docs/plans/t2/opus-2026-07-09-t2-rungs-fog.md)
  (mechanics-only, no pin/HR). Queued for the human's read.

## 4 · Tooling + misc

- **Guard-hook fix** (`a73019d`) — the shared-index guard false-blocked
  `git commit -m "multi\nline" -- path` (per-line grep saw only the message's
  first line, missing the trailing pathspec). Flatten newlines + strip quotes
  before isolating the commit segment; 9 cases tested; dogfooded live.
- **Telemetry runId → real-date prefix** (`caad385`) — the `20260626-…`
  filenames read like stale June data but 20260626 is the default SEED. Now leads
  with the day PLAYED (`20260709-<ts>`); seed stays in the report body.
- Reading queue cleared (estate-sheet readme + G0 fiction-gap, both closed);
  decisions.md rung-tag convention noted.

## Next intended steps (current)
1. **T2 rungs/fog build** — execute the captured plan (focused pass, live
   `?t2-map-demo` iteration).
2. **Human QA** — rung-by-rung on v0.4.0; the review queue + DEV Variants tab are
   now rung-ordered to track it. Combat balance rides the QA → inbox.
3. Optional: the graphics-concept shelves, T2 §6.1 fog prose diverge.

## Landmines (current)
- The rewrite-debt gate fires on every snapshot change — see §2.
- `hd30-nengu` bundle is KEPT (human steer) — do NOT auto-prune; DEV Story shows
  "Story (1)" by design.
- Combat is a design call, not a bug — don't "fix" the axe recipe (breaks the
  material closed-loop invariant).
