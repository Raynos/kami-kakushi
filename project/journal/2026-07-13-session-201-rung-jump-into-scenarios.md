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

## Follow-up (same session) — the human killed `Jump` too

I parked the `Jump` section (`→ Phase 2`, `→ Ascend-ready`) as a BACKLOG
line and asked, because it was the *same* duplication one layer down
(`wealthy-idler` IS Phase 2, `pre-ascension` IS ascend-ready, both
already in Scenarios) but **not** the same case: unlike the rung
buttons, these two were still TRUE `applyPromotion`-style teleports, so
deleting them removed a real capability (an instant jump with no climb
behind it) rather than just a duplicate door.

The human's verdict: **delete it — Scenarios only.** So the whole
teleport block is gone from Settings, along with the `jumpToPhase2` /
`jumpToAscension` decls on `DevQa` and their `stubQa` mocks. The
BACKLOG line was pulled (answered, not parked).

`__qa.jumpToPhase2` / `jumpToAscension` / `toRung` **remain** in
main.ts — they're the headless driver API documented in
qa-playtesting.md §1, and they taint the run when used. Only the PANEL
doors closed. Verified live: zero `→`/`R0`–`R7` buttons in the panel,
Settings down to Speed · Inspect · Save health · Telemetry, all three
`__qa` methods still functions, and loading `pre-ascension` from
Scenarios lands R7 with `t0-capstone` set — i.e. the state the deleted
button used to reach.

Also corrected `qa-playtesting.md`'s fixture list, which claimed "Six"
and named six while eighteen sit on disk. It now points at the
Scenarios tab as the live roster (it reads `FIXTURE_SPECS`, so it can't
rot) and describes the library by group instead of hand-copying names.

## Landmine — the shared tree bit twice

A `verify` run mid-session went RED on two session-200 drag tests. It
was NOT my change: w1:p3's drag hunk (`dev.ts`) and its two tests
(`dev.test.ts`) were sitting uncommitted in the shared tree and my run
raced their write. `dev.test.ts` alone was 55/55 green; a re-run on the
settled tree was 20/20. **Do not paper over a red — but do check whose
red it is.**

Consequence for the commit: pathspec is whole-file, and my `DevQa`
change *forces* the `stubQa` edits to ride in `dev.test.ts` — the same
file as their tests. So this commit necessarily carries w1:p3's drag
hunk AND its tests. That is the only GREEN split (their tests are red
without their hunk in HEAD), and they signed off on it explicitly.
Credit theirs, noted in the commit body.
