# Session 219 — 2026-07-18 — the three 390px shell defects, and a dead season wheel

**Summary:** Built
[`docs/plans/fable-2026-07-18-phone-shell-defects.md`](../../docs/plans/fable-2026-07-18-phone-shell-defects.md)
end to end, autonomously. All three defects the estate blind readers
caught reproduce at 390×844 and are fixed. Diagnosing defect 2 turned up
a **fourth, worse one: the `End the … 季` button was unclickable at every
viewport** — the season wheel, a core R2+ verb, had never been
reachable. Full diagnosis, before/after evidence and the two-pass taste
scorecard live in
[`project/audit/reports/2026-07-18-phone-shell-defects.md`](../audit/reports/2026-07-18-phone-shell-defects.md).

## What changed

- `src/ui/styles/shell-layout.css` — four fixes. (1) `.season-end` gets
  `pointer-events: auto` back inside the passive dock. (2) the ≤920px
  grid gains a `clock` row so the dock stops sharing the footer's cell.
  (3) the collapsed log band becomes a fixed two-line `height` (was
  `max-height`) and keeps — deepened to a full line box — the top-fade
  mask the FB-168 rule used to null out. (4) the `.bar.low` alarm rule
  now names each meter so it can actually win.
- `src/ui/styles/footer-modals.css` — phone footer fit: the roman
  transliteration drops at ≤920px, both remaining labels pinned nowrap.
- `src/ui/styles/header-nav-rung.css` — deleted the duplicate flat
  `--rokusho` health fill that was silently beating the alarm colour.
- `src/ui/render/vitals.ts` — new `fillWidth()`: all three meters share
  a 3% visibility floor so a non-zero value can never paint invisibly.
- `src/ui/render/log.ts` — the fold path re-pins the band to the foot,
  as the expand path already did.
- `src/ui/render.test.ts`, `src/ui/render/log.test.ts` — one test each,
  both mutation-checked (made to fail by reverting the fix, then
  restored).
- `project/audit/reports/2026-07-18-phone-shell-defects.md` +
  `project/audit/screens/2026-07-18-phone-shell-defects/` — the report
  and the before/after captures on three fixtures.

## Landmines

- **The bugs were all cascade/geometry, not logic.** Two of the four
  were rules losing on **specificity** while looking correct in source,
  and one was two grid items quietly sharing one area. Reading the CSS
  would not have found them — every one was caught by *measuring* the
  live DOM (`getBoundingClientRect`, `getComputedStyle`,
  `elementFromPoint`). Keep `tmp/phone-shell-diagnose.mjs` in mind
  before eyeballing any layout defect.
- **`pointer-events: none` on a container with a live control.** The
  dock needs to stay passive (it overlays the nav rail), so the button
  is re-armed individually. Anything interactive added to `.clock-dock`
  in future needs the same treatment or it will be silently dead.
- **The season wheel being dead means no shipped build's manual season
  turn was ever exercised by a human through the UI.** Worth a look at
  whether the R2+ pacing assumptions rested on it.
- The `.bar` track's outer `silver-faint` ring still outlines an empty
  groove; left alone deliberately (shared token, wide blast radius) and
  recorded in the report.

## Next intended steps

1. The plan is done — archive it to `project/archive/` and drop it from
   the reading queue.
2. The report is worth the human's eye specifically for the dead season
   wheel: it is a *gameplay* regression surfaced by a layout plan.
