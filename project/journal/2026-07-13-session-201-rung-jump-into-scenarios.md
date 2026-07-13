# 2026-07-13 · session 201 — the rung jump folds into Scenarios

## What the human asked

> in the dev menu we both have "scenarios" and "settings => rungs" … I
> think its about time to kill the whole jump to a rung in settings, and
> ensure we have at least one scenario for each rung in scenarios and
> then remove the rungs section from settings

## What I found first

The "ensure we have a scenario per rung" half was **already done**.
Since FB-68 (2026-07-07) the Settings→Rung buttons had stopped
teleporting: each one already called `qa.loadFixture('rung-RX')`. The
`rung-R0`…`rung-R7` specs exist in `src/fixtures/specs.ts` — the REAL
climb driven to the first tick at each rung — and their envelopes are on
disk.

They were simply marked `hidden: true`, which `qa.fixtures()` filtered
out of the Scenarios pane. So this was never two mechanisms; it was
**one mechanism behind two doors**, and the second door was the only
thing worth killing.

## What landed

- `fixtures/specs.ts` — dropped the `hidden` field from `FixtureSpec`
  and from the R0–R7 set; renamed the group `Rung starts (R0–R7) · DEV`
  → `Rung starts (R0–R7)` (the whole pane is DEV; the suffix said
  nothing). Re-voiced the eight blurbs for a list a human actually
  reads: `無名 The man from the weir — the real climb driven to the first
  tick at R0.`
- `fixtures/index.ts` + `app/main.ts` — `hidden` off `FixtureEntry`, and
  the `.filter((f) => !f.hidden)` out of `qa.fixtures()`. The group
  already sat 2nd in `FIXTURE_GROUP_ORDER`, so the set renders right
  after "Fresh start" with no sort work.
- `ui/dev.ts` — deleted the Settings→Rung strip (the `RANKS` loop,
  `rungBtns`, `markRung`), the now-dead `RANKS` import, and the dead
  `toRung` decl on the `DevQa` interface. `__qa.toRung` **stays** in
  main.ts — it's still the headless driver API; only the panel's use of
  it is gone.
- The gold current-rung mark **moved rather than died** (TST4): the rung
  rows in Scenarios now render `rung-R5 · now` in `#b08d4f` for the rung
  the run is at, re-marking after every load. That was the one real
  affordance the strip had.

No fixture regen needed — the saves JSON carries only the envelope, so
blurb/group/hidden are spec-side metadata.

## Verification (PH6 — driven in the live panel, not just typechecked)

`pnpm run verify` 20/20 green in 4.58 s. Then headless against the
shared `:5173` server:

- Whole-panel DOM scan: **zero** `R0`–`R7` buttons, **no** `Rung`
  section label.
- Settings keeps Speed · Inspect · Jump · Save health · Telemetry, and
  Jump keeps its two real teleports (`→ Phase 2`, `→ Ascend-ready`).
- Scenarios lists all eight rung starts under `RUNG STARTS (R0–R7)`.
- Clicking `Load` on the `rung-R5` row → `__qa.selectors.rung()` = `R5`,
  and the `· now` mark follows to that row.

(First pass of that check had a fragile pane-locator that scanned the
wrong DOM node and reported a meaningless "0 buttons" — redone against
the whole panel before I trusted it. PH3: the green has to be one that
could have gone red.)

## Landmines

- Shared tree: w1:p3 hit my mid-edit red (the unused `RANKS` import) and
  pinged. Cleared it and confirmed green so their render.ts scroll-fix
  could land.

## Next intended steps

- **Not built, left for the human:** the `Jump` section's `→ Phase 2`
  and `→ Ascend-ready` are the *same* duplication one layer down —
  `wealthy-idler` IS Phase 2 and `pre-ascension` IS ascend-ready, both
  already in Scenarios, and unlike the rung buttons these two are still
  true `applyPromotion`-style teleports (the incoherent-state class
  FB-68 complained about). Folding them in would finish the TST1 sweep.
  Not done — outside the ask, and it's the human's call whether the
  teleports have QA value the fixtures don't. Queued as a BACKLOG line
  rather than left in this prose.
