# Session 189 — 2026-07-13 — one Review tab, and the HR ↔ V/SV link

## ☀️ SUMMARY (read this first)

The human asked why the ADR-184 zone-reveal toggle sat under
**Settings** instead of **Variants** (answer: commit `a4863592`, the
zone-reveal-law build — it is a behaviour *mode*, not a pane renderer,
so it did not fit the `SURFACES` registry and got hand-placed). That
opened the real question: **everything awaiting the human's verdict
should live in ONE tab.** Locked with the human:

1. strays (zone reveal) become first-class registry rows;
2. the Variants + Story panes fold into a single **Review** tab with an
   internal Story ⇄ Variants toggle;
3. the missing **HR ↔ V/SV link** gets built in **both** directions — HR
   numbers show in the DEV panel, V/SV tags show in `review.md` — held
   by a gate so it cannot drift.

This file is HISTORY. Live state: `project/status/project-status.md`.

---

## 1 · the zone-announce toggle joins the registry (ADR-184 / HR-32b)

`SurfaceDef` grows an optional **`apply(variantId)`** — the *MODE
surface*: a surface whose variants flip a declaring-module DEV setter
instead of rendering an alternate pane. (`earned-line` was already the
half-case — a registry row with no renderer arm, read by `render.ts` at
paint time. Zone reveal is the full case: the **core** reads
`zoneRevealMode()` when the reveal fires.)

- `apply` is called from `setVariant` **and once at hydration**, so a
  shared `?zone-reveal=zone-reveal-ink` link plays the mode it shows —
  without the hydration call the toggle would read B and the game would
  play A.
- The hand-rolled `section('Zone reveal')` block leaves the Settings
  pane; the surface appends at the **end** of `SURFACES` so no existing
  V-tag renumbers (they are registry-position-derived — the human quotes
  them, so they must not shift under her).
- Test: `setVariant` → the core's `zoneRevealMode()` actually changes.
  Proven RED-able by deleting the `apply` call from `setVariant` (the
  mode stays `'vn'`, the assert flips), then restored.

## 2 · the Review tab (Variants ⇄ Story under one roof)

Seven tabs became six: `Variants` and `Story` fold into one **Review**
tab, switched by a segmented row *inside* the pane. The two idioms stay
separate — a UI variant is a pane swap, a story take is a whole coherent
set — but they share one home (TST1), and the human stops hunting two
tabs for "what is waiting on me".

- Counts: each half carries its own (`Variants (10)` · `Story (22)`) and
  the tab carries the total (`Review (32)`), so the *collapsed* panel
  answers "how much is waiting on me" without a click.
- The tab bar is now an even 3×2 grid (Settings · Review · Scenarios /
  Rung info · Prototypes · Balance) — the fold cost a tab and bought a
  clean grid.
- Stable hooks: `data-dev-tab`, `data-review-half`, `data-review-pane`
  (the tab bar and the switch both render `<button>`s, so text matching
  was ambiguous). Two RED-able tests ride them — no Story/Variants
  top-level tab survives, and the half-switch actually swaps the panes.
  Proven RED by deleting the switch's display toggle.
- Shot headlessly at :5173, both halves: the zone-announce surface lands
  under `— rung R2 —` as **V9A**, and Settings holds only tools now.

### A shared-tree slip, logged

Copying a regenerated `project-status.md` back from a scratch worktree,
I overwrote the co-agent's UNSTAGED copy of it — I had checked
`git status` two minutes earlier, not immediately before the write.
No harm survived (w6:p1 rewrote the file, and their commit carries both
their prose and the gen line), and they were told. The rule that would
have caught it is the one already written down: **re-check the working
tree immediately before any write to a file you did not author.**

## Next intended steps

1. The HR ↔ V/SV link + its gate (HR numbers into the DEV panel, V/SV
   tags into `review.md`, a gate binding both directions).

## Landmines

- **V/SV tags are position-derived** (`V{registryIndex}{letter}` /
  `SV{bundleIndex}`). Appending is safe; **reordering or removing** a
  surface renumbers every later tag — and once `review.md` carries those
  tags (step 3), a reorder silently staled the doc. That is exactly what
  the step-3 gate is for.
