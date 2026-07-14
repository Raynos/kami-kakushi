# Session 204 — 2026-07-14 — merchant permanent state lands (ADR-194)

**Summary:** Built `fable-2026-07-13-merchant-state.md` fully: Yohei
now has a persistent purse + stock mutated by every trade, a per-unit
sagging offer (to REFUSAL at 0 — human ruling this session), an explicit
purse readout in the market UI, and partial-drift restock on market
days. The H2 exploit (each `sell_rice` drew a fresh 120-mon purse) is
dead — proven by a test that was RED on main. Landing balance pass under
ADR-132 re-tuned `ESTATE_DEED_PER_ACT` 0.6 → 0.8 (the exploit's spam
sells were banking ~100 koku of zero-clock treasury deeds; the D-133
ratio drifted to 1.37 without them) plus stage-cost seeds and the
merchant seeds; ratio back in band at 1.07–1.15, Phase-1 rungs
byte-identical. PRD §2 mon-lane ripple applied (`prd:drift` clean).

**Human rulings walked at session start (recorded in the plan):**
restock = partial drift (the proposed default) · sell curve reaches
ZERO, not a floor · purse shown as an explicit number.

## What changed

- `src/core/content/market.ts` — `MerchantState` (purse + stock),
  `initialMerchants()`, `merchantOffer()` (the sag curve, step 24
  shō/mon), `merchantRestock()` (3/4-gap drift), `YOHEI_PURSE_MON`
  120 → 160 (now the SEED/RESTOCK level, not a per-visit draw).
- `src/core/state.ts` — `merchants` field, seeded in
  `createInitialState`.
- `src/core/constants.ts` — `SCHEMA_VERSION` 13 → 14.
- `src/persistence/migrate.ts` — v13→v14 identity (additive);
  `validate.ts` — `validateMerchants` hydration (absent → seeded roster;
  present kept verbatim — idempotent, no double-grant).
- `src/core/selectors.ts` — `riceSellQuote()` — the ONE quote (AC-6)
  behind the executed sale AND the displayed offer.
- `src/core/intents.ts` — `sell_rice` executes the quote and mutates
  Yohei; `buy_item` credits his purse (the trade is two-sided).
- `src/core/step.ts` — market-day restock drift fires at the day
  boundary (fold-invariant, B10).
- `src/core/autoplay.ts` — policy loops mirror the merchant no-op
  guards (`riceSellQuote(s).sho > 0`); `PHASE2_SELL_RICE_AT` 20 → 10.
- `src/core/content/balance.ts` — `ESTATE_DEED_PER_ACT` 0.6 → 0.8
  (ADR-194 landing note in place).
- `src/core/content/estate.ts` — U2/U3/U4 coin seeds 300/700/1400 →
  250/500/900 (priced under the pre-merchant exploit lane).
- `src/ui/render/market.ts` — quote-driven sell row: sagging price
  line + `Yohei's purse: N` (TST4 explicit) + refusal/dry-purse
  disabled states with reasons.
- `src/core/economy.test.ts` — new ADR-194 describe (exploit-dead ≤
  purse, monotonic curve to 0, AC-6 quote==trade, partial-drift
  restock, v13 hydration idempotence, two-sided buy); old sell tests
  re-derived from the quote.
- `src/fixtures/specs.ts` — wealthy-idler mirrors the merchant guards;
  `src/fixtures/saves/*` regenerated (schema bump).
- `docs/content/t0-pacing.md` + `t0-content.md` — regenerated (ADR-132).
- `docs/living/prd/02-systems.md` — §2 mon-lane bound now names the
  ADR-194 mechanism; the "damper NOT built in T0" claim corrected.
- `docs/plans/fable-2026-07-13-merchant-state.md` — rulings recorded,
  Status ✅, archived to `project/archive/`.

## Verification

- Full `VERIFY_FULL=1 pnpm run verify` — 20 gates green;
  `verify:balance` GREEN (3 personas × 5 seeds).
- PH6 player-reach proof on the live `:5173` (headless, e2e market-loop
  pattern): offer 5 mon → sell 34 shō → offer sags to 4 with the
  "store is heavy" gloss, purse reads 0, button greys at "0 shō → 0
  mon"; next market day purse 120 (partial, not the 160 seed), stock
  34 → 8, stall live again. Shots in `tmp/merchant-proof/` (scratch).
- Telemetry (FB-8) read: no untainted attended reports cover the mon
  lane / R7 window (one R0 row, capture-tainted) — nothing to quote.

## Entry 2 — the stall speaks (ADR-139 diverge, same session)

The human ruled "do it now" on the deferred Yohei voice: the six
merchant-state flavor reads (four price glosses · refusal · dry purse)
diverged as bundle `yohei-stall` — three blind takes (A the pedlar's
own mouth · B the day-book · C the market road), Pass-1 constraint
brief + per-take scorecards in `bundle.md`. **Canon = C** (the only
take whose fiction CAUSES the ADR-194 mechanics — the villages down
the road ARE the restock drift). Canon landed in
`narrative/flavor.md` (`stallGloss*`, `stallRefusal`,
`stallPurseEmpty`); `ui/render/market.ts` reads them via
`dev.subFlavor` (live-swappable, ADR-143); alternates in
`takes/yohei-stall/`; **HR-44** filed with the live review path.
Verified: gen-narrative + full verify green; headless re-proof shows
the road voice rendering in the live card.

## Next intended steps

1. HR-44 awaits the human's take verdict (DEV → Review → Story →
   yohei-stall). Nothing else owed by this plan.

## Landmines

- `YOHEI_PURSE_MON` is now the restock TARGET; a buy can push his live
  purse above it (intended — player coin is his to keep).
- The greedy/fixture drivers MUST mirror `riceSellQuote(s).sho > 0`
  before proposing `sell_rice`, or they spin on no-op sells (this bit
  three drivers this session: autoplay ×2, wealthy-idler).
- Phase-2 pacing now leans on `ESTATE_DEED_PER_ACT` 0.8 — if a future
  change touches sell cadence again, expect the D-133 ratio gate to
  move (its comment documents this session's rescale).
