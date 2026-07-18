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

---

## Follow-up — the audit the dead season wheel demands

Filed
[`docs/plans/opus-2026-07-18-unreachable-verb-audit.md`](../../docs/plans/opus-2026-07-18-unreachable-verb-audit.md)
(reading queue) rather than leaving the finding as a "next steps" line
here — a journal is a record, not a queue.

Two things surfaced while grounding it:

- **The sim leans on `advance_season` structurally**, not incidentally.
  `autoplay.ts:444` turns the wheel to refill a drained paddy pool and
  states the R7 granary target climbs *because* of it; `:568` collects
  the Phase-2 seasonal judge the same way. The sim dispatches the intent
  directly, so it exercised a verb no player could reach. Most likely no
  band actually moved (the sim never went through the UI), but per
  ADR-132 that is a machine verdict nobody has taken.
- **Why nothing caught it.** `affordance-coverage.test.ts` lists
  `advance_season` in `PLAYER_INTENTS` and passed throughout. Its
  `sweep()` mounts into **jsdom** and calls `.click()` on queried
  elements — jsdom does no layout and no hit-testing, so
  `pointer-events`, occlusion and zero size are invisible to it. The
  ratchet proves a handler is wired to an element that exists, never
  that a real click reaches it. The reachability half belongs in the e2e
  lane, where Playwright's actionability checks honour all three.

That second point is the durable one, and it generalises past this bug:
**every** control the ratchet "covers" carries the same blind spot.
