# Session 203 — 2026-07-13 — the render-split job: rulings locked, then the run

## ☀️ SUMMARY (read this first)

The human walked the open decisions of
`docs/plans/fable-2026-07-13-render-split.md` and ruled: **start
now if quiet** (not overnight), **render-split lands before
merchant-state**, **all Fable, no Opus delegation**. This session
transcribes the rulings, waits for the quiet window (w1:p3 to
finish), then runs the four-file split job to completion. This
file is HISTORY; live state is `project/status/project-status.md`.

---

## 1 · Rulings transcribed

Verified the go-condition facts first (all four files clean;
dialogue-live-swap + contention-locks landed & archived; w1:p3
still live). Then via AskUserQuestion the human ruled the three
open forks. Edits:

- `docs/plans/fable-2026-07-13-render-split.md` — Status →
  ▶️ IN PROGRESS; new **Rulings** section; go-condition check
  noted; routing section's Opus-subagent allowance struck
  (superseded by Ruling 3).
- `docs/plans/fable-2026-07-13-merchant-state.md` — sequencing
  stamp: builds only after render-split lands (it edits the
  market UI inside render.ts).

## Next intended steps (current)

1. Watch for the quiet window (w1:p3 done, four files clean).
2. Baseline: full verify green, e2e lane, golden screenshots.
3. Worktree job: dev.ts → render.ts → styles.css →
   render.test.ts, per the plan's procedure.
4. Prove nothing changed (FULL verify + pixel diff), land
   atomically through the push mutex, announce, archive the plan.

## Landmines (current)

- w1:p3 ("take-B2") is live in this tree — do NOT start the
  split, and do NOT commit anything beyond these docs, until it
  finishes; its WIP would poison the atomic rebase.
- Merchant-state is sequencing-blocked on this plan — an agent
  picking it up early recreates the render.ts contention.
