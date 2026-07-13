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

## Next intended steps

1. The Review tab: fold the Story pane in behind a Story ⇄ Variants
   toggle; Settings/Story stop carrying review content.
2. The HR ↔ V/SV link + its gate.

## Landmines

- **V/SV tags are position-derived** (`V{registryIndex}{letter}` /
  `SV{bundleIndex}`). Appending is safe; **reordering or removing** a
  surface renumbers every later tag — and once `review.md` carries those
  tags (step 3), a reorder silently staled the doc. That is exactly what
  the step-3 gate is for.
