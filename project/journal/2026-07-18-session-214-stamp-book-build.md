# Session 214 — 2026-07-18 — stamp book: live rulings + the compact build

**Summary:** The human picked the stamp-book resume plan off the
queue and asked to be grilled on its open decisions directly. Five
rulings landed live (grill capture:
`project/brainstorms/2026-07-18-stamp-book-decisions.md`, locked as
**ADR-201**): afterglow + Character-tab Record panel home (the
step-3 HD closed live, never filed); the MC's OWN seal-book; the big
re-scope — **compact, ≤20% of screen, gym-badge style with future
slots**, not the prototype's full-screen modal; per-seal inspect
popover for depth; next-rung-named / rest-mystery future slots. Then
BUILD: the plan went ACTIVE and the compact stamp-book build started.

## What changed

- `project/brainstorms/2026-07-18-stamp-book-decisions.md` — NEW:
  the grill capture (Q1–Q5, verbatim scale steer).
- `docs/living/decisions/150.md` — ADR-201 (the five rulings).
- `docs/plans/fable-2026-07-18-stamp-book-resume.md` — Status →
  ACTIVE; Rulings section added; step 3 struck CLOSED; the step-2
  core-seam risk re-surveyed (talk-system core is committed — clear).

## Steps 1+2 landed (same session)

- `src/ui/stamp-book/README.md` → the full E3.1 spec at compact
  scale (fiction table with the granting hands bible-grounded, the
  compact grammar, the blind rubric).
- **SCHEMA_VERSION 15→16 (ADR-201 run record):** additive
  `rungRecord` (dated presses; appended only in `applyPromotion`,
  R0 seeded at creation) + `defeatDays` (appended where
  `soanLedger` grows). Identity migration; hydration defaults `[]`
  (old saves' pressed set derives from ladder position — seals
  render undated, never synthesized). Fixtures regenerated in the
  same commit.
- `src/ui/stamp-book/from-state.ts` — the ONE derivation feeding
  every variant; the data shape itself enforces ruling 5 (future
  slots carry no identity). 7 tests in `from-state.test.ts`
  (registry-derived expectations; real engine drives, no pokes).

## Next intended steps

1. Step 1 — E3.1 spec in `src/ui/stamp-book/README.md`, rewritten to
   the compact ruling (fiction + stamp grammar + blind rubric).
2. Step 2 — the state feed: minimal additive rung-date record in
   core (promotions are currently undated), schema bump + migration
   + fixtures regen in ONE commit.
3. Step 4 — the compact diverge (2–3 working variants, DEV Review
   toggle, dev-surfaces row) + the HR bundle.
4. Golden pin per variant, derivation test, blind pass.
