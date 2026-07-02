# Session 45 — 2026-07-02 — playtest round-3: ship the quick wins, plan the big rocks

## ☀️ SUMMARY (read this first)

Round-3 of the live human-steered playtest (continuing the F1–F85 arc from
sessions 42/44). This session **captured F86–F115** into
`project/human-feedback/2026-07-02-playtest.md`, **shipped + pushed the reachable
subset** (the quick, self-contained wins → **v0.3.3**), and **wrote three design
plans** for the big rocks that need a human scope call before any build. In
parallel, the concurrent koku-worker's economy re-core plan was **verified this
session** (verdict: GO) and its Phase 1 is the next build — so the render/design
queue is deliberately **held behind the economy ripple**.

Live state is the snapshot, not this file — see
[`../status/project-status.md`](../status/project-status.md). **This file is
HISTORY, not live state.**

Key output docs:
- `docs/plans/2026-07-02-append-only-rendering-engine.md` (uncommitted → human review)
- `docs/plans/2026-07-02-rung-up-story-transitions.md` (uncommitted → human review)
- `project/brainstorms/2026-07-02-narrative-coherence-home-belongings.md`
  (uncommitted → human review)

---

## 1 · The round-3 arc (F86–F115)

Continued the inline playtest loop. Captured F86–F115 in the round-3 feedback doc.
The items split cleanly into **reachable quick wins** (shipped this session) and
**big design rocks** (planned, not built — they need a human scope call and, in
most cases, wait behind the economy ripple because they land in `render.ts`).

## 2 · Shipped + pushed to origin/main (v0.3.3)

Four commits to `origin/main` (`06ec6f3` / `564ac8a` / `33b4061` / `ed27169`),
all green through the pre-push gate:

- **Intro polish (F86–F90):** auto-advance + gray-out asked topics + NPC
  speaker-prefix + a **proven flicker-free reconcile**.
- **Byōbu Work-fold flex fix + estate-upgrade moved to the Estate tab** (F94/F100).
- **DEV New-Game backup/restore + half-width button + variant reorder**
  (F95/F96/F101).
- **Pure-core flavor-voice consistency** (F91/F93).
- **v0.3.3** version bump + a top-level `CHANGELOG.md` (F104/F105).

## 3 · Authored for human review (uncommitted this session)

Three durable design docs, each awaiting a **human scope call** (queued in
`project/todo-human.md`):

- **`docs/plans/2026-07-02-append-only-rendering-engine.md`** — generalize the
  intro's append-only render to kill the whole flash/repaint class app-wide.
  **5 open questions** for the human.
- **`docs/plans/2026-07-02-rung-up-story-transitions.md`** (F97/F99/F103) —
  rung-ups become **player-initiated VN story beats** that motivate the unlocks
  + entity discovery. Ties D-104.
- **`project/brainstorms/2026-07-02-narrative-coherence-home-belongings.md`**
  (F89) — narrative coherence for the estate's home / belongings / furniture.

## 4 · Economy re-core: verified (verdict GO)

Reviewed the concurrent koku-worker's plan
`docs/plans/2026-07-02-koku-economy-t0-build.md` this session. **Verdict: GO.**
One correction noted: the plan's file map missed `fight.ts` / `enemies.ts` /
`quests.ts` / `dev.ts` (to be corrected by the worker). **Phase 1** (pure-core
rename koku→coin + rice + the v4→v5 save migration) is the **next build**.

## 5 · The design/render queue (post-economy)

Held behind the economy ripple because they all funnel through `render.ts` (see
Landmines): **F92** footer · **F106** rung-in-header · **F111** Chat-log tab ·
**F114** nav-flavor-out-of-Story · **F115** Now-timer · **F107/F108/F112** tab IA
(Map / Estate / Inventory) · the about-modal · the **estate-map redesign** (F102)
· **F113** map bug.

---

## Next intended steps (current)

1. Human scope-calls the three new design docs (rendering engine, rung-up story
   beats, home/belongings).
2. Build the economy Phase 1 (koku→coin + rice + v4→v5 migration) — the
   concurrent worker's plan, verified GO this session.
3. After the economy ripple lands, work the render/design queue (§5) serially
   through `render.ts`.

## Landmines (current)

- **Everything funnels through `render.ts` — serial work only.** The whole
  render/design queue touches one file; don't fan it out in parallel.
- **The economy is a ripple in flight — no parallel builds during it** (per the
  standing memory rule). Hold the render queue behind it.
- **HMR is OFF** (`vite.config.ts`) — hit **F5** to see dev changes.
- **Shared working tree with the concurrent koku-worker.** Stage only your own
  files by explicit path; never `git add -A`, never touch the worker's WIP.
