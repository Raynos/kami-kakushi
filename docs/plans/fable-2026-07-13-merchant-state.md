# Merchants get permanent state: a real purse, real stock, sagging prices

**Status:** 📋 PROPOSED (2026-07-13, session-187)
**Confidence:** ( 85% Opus, 15% Fable ) — engine + economy plumbing
under an already-ruled design; the only judgment is curve-shape
defaults, and those are sim-owned (ADR-132).
**Template:** build

## Who builds this — Fable or Opus?

**Opus.** The design is human-ruled (2026-07-13, verbatim below); the
work is a state shape, two reducers, one pure pricing fn, and the
ADR-132 sim flow. No fiction ships with this plan — if Yohei later gets
haggle lines, that is an ADR-139 diverge in its own right (non-goal
here).

## Why

**The human's ruling (2026-07-13 finding walk, H2):** merchants should
have **permanent state** — "what items it has, how much money it has.
Every buy/sell interaction with the merchant changes its inventory
state… it should also have RuneScape-general-store-like behavior where
as you sell it more and more of the same item it will pay you less and
less for that item."

This supersedes-and-extends **ADR-163 §5** (Yohei's purse "finite per
visit"), and fixes the live exploit the sweep found: `intents.ts:986`
clamps each **transaction** to `YOHEI_PURSE_MON`, and nothing tracks
spend across a market day — repeated `sell_rice` calls each draw a
fresh 120-mon purse. The soft cap the whole mon-lane design leans on
(ADR-158/163: the MON lane is *bounded*) does not hold today; it is an
unbounded coin faucet. Evidence: the archived sweep survey
(`project/archive/opus-2026-07-12-adr-embedded-work.md`, H2).

## What exists today

**Survey date: 2026-07-13 (session-187), source-verified.**

- `src/core/content/market.ts` — `YOHEI_MARKET_DAYS = [2, 5]`,
  `YOHEI_PURSE_MON = 120`, `YOHEI_BUYS = {'rice'}` (his `buys:`
  whitelist), `isMarketDay()`, `yohheiBuysResource()`-style helpers.
- `src/core/intents.ts:986` — the sell path computes `affordableSho`
  from `YOHEI_PURSE_MON / price` **per call**; no cross-call state.
- `src/core/state.ts` — **no** merchant/purse field anywhere in
  `GameState`.
- Prices come from the season-swinging rice price (ADR-107 Dōjima
  model); the displayed offer and the executed trade should share one
  pure fn (AC-6) — verify the current wiring when building.

## Steps

1. **The ADR + the state shape.** (ADR written by the log-truth plan;
   if this plan lands first, write it here instead — one home, don't
   double-enter.) Add `merchants: Record<MerchantId, MerchantState>`
   to `GameState`, `MerchantState = { mon: number; stock:
   Partial<Record<ResourceId, number>> }`, seeded for `yohei`.
   Schema bump + migration (old saves seed the initial state).
2. **Trades mutate the merchant.** The sell reducer debits his `mon`
   and credits his `stock`; a buy does the reverse. The per-visit cap
   emerges from state (he runs out of mon) instead of a clamp —
   `YOHEI_PURSE_MON` becomes his *seed/restock* purse, not a
   per-transaction ceiling.
3. **The restock rule (the fork this design creates).** Permanent
   state without replenishment is a merchant who dies rich in rice and
   broke in mon. **Proposed default (PH4, overridable):** each market
   day Yohei arrives having sold down his bought stock toward a base
   level and topped his purse back toward `YOHEI_PURSE_MON` — both
   *rates* sim-owned, neither a full reset (so dumping 40 shō of rice
   on Tuesday still depresses Friday's price). Magnitudes: ADR-132.
4. **The general-store curve.** One pure fn
   `merchantOffer(merchant, resource, basePrice)` returning the
   marginal price as a decreasing function of his current `stock` of
   that item (and symmetric buy-side markup) — consumed by BOTH the
   executed trade and the displayed offer (AC-6), so the shown price
   sags live as the player sells. Curve shape + floor sim-owned.
5. **Surface it (TST4 — the player never guesses state).** The market
   UI shows the offer *as priced by the curve* and a legible read of
   Yohei's remaining purse (e.g. the offer row greys when he cannot
   pay). Copy is mechanical UI text, no diverge needed.
6. **Balance pass (ADR-132).** `verify:balance` → `balance:report`;
   commit the regenerated `docs/content/t0-pacing.md` with the change;
   `balance-sim --summary` in the commit body. Read
   `project/telemetry/` first (FB-8) — 6 untainted reports exist as of
   this writing.

## Verification

- RED-able `economy.test.ts` cases: (a) N `sell_rice` calls on one
  market day draw **at most** his purse in total (today: N×120 — this
  test fails on main now, the proof the bug is real); (b) marginal
  sell price is monotonically non-increasing in his stock of that
  item; (c) the displayed offer equals the executed price (AC-6, same
  fn both sides).
- Save round-trip: v(n)→v(n+1) migration test — an old save loads with
  seeded merchant state.
- Sim: the pacing band stays green; the mon-lane envelope in
  `t0-pacing.md` is the before/after diff.
- **Player-reach proof (PH6):** drive the live `:5173` build — sell
  rice repeatedly on a market day, watch the offered price sag and
  Yohei's purse run dry in the UI, then return next market day and see
  partial recovery. Fixture: extend a market-day scenario save if none
  fits (`src/fixtures/specs.ts`).

## Sync ripple

- **PRD:** `docs/living/prd/` §4 economy spine — the mon-lane
  "bounded" claim gains its real mechanism (via `/prd-ripple`, then
  `pnpm run prd:drift`).
- **Story-bible:** none — Yohei's fiction (traveling merchant, market
  days) is unchanged; this mechanizes what the bible already says
  about his finite coin.
- **Living docs / registries:** `docs/content/t0-pacing.md`
  regenerated (ADR-132); fixtures regenerate (`fixtures:regen`) — the
  save shape changes.
- **CHANGELOG:** none — no version bump ships this plan (rides the
  next release's section).

## Human-in-the-loop

- The design is already ruled (2026-07-13) — no HD-item needed.
- **One open default surfaced, not blocking (PH4):** the restock rule
  in step 3. Building proceeds on the proposed default; the human can
  override async.
- No taste scorecard: the only UI change is rows inside the existing
  market surface (mechanical copy) — if it grows into a restyled
  surface, run Pass 1 first (ADR-135).

## Non-goals

- **No haggle/flavor fiction** — any Yohei voice lines are a separate
  ADR-139 diverge.
- **No second merchant** — the shape is generic (`MerchantId`) but
  only Yohei is seeded; T1+ merchants inherit it.
- **No buy-side catalog expansion** — his `buys:` whitelist and what
  he sells stay as shipped; this plan changes *pricing and persistence*,
  not assortment.
- **Not touching the rice-withdraw retirement (H3)** — that lands in
  the log-truth plan.

## Risks

- **Seam (shared tree):** owns `src/core/intents.ts` (sell/buy paths),
  `src/core/content/market.ts`, `src/core/state.ts` (schema bump),
  market UI in `src/ui/render.ts`. The sickroom plan
  (`fable-2026-07-13-sickroom-hp-mend.md`) also edits `intents.ts` and
  bumps the schema, and the active HD-41 plan
  (`opus-2026-07-12-rung-reward-legibility.md`) touches `intents.ts` +
  `render.ts` — **do not run these concurrently**; sequence them and
  re-check `herdr agent list` + `docs/plans/` at pickup.
- **Economy soft-lock:** if the curve floor is too harsh the player's
  mon income can starve mid-arc — the sim's no-stranding detector must
  stay green; the day-wage lane (fixed per game-day, ADR-158) is the
  floor that keeps mon flowing regardless.
- **Save migration:** seeding merchant state into old saves must not
  double-grant (idempotent migration, tested).
