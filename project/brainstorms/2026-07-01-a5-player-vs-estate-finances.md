# A5 — Player vs estate finances: the design note (Plan B / v0.3.2)

**Status:** design note (the "design-first" half of Plan B task A5). Backing ADR:
**D-099**. Governs what v0.3.2 codes vs. what it defers to T2.

## The question

D-099 locked that **player finances ≠ estate finances** — two separate lanes. The
plan asks: today's `resources` (carried) vs `banked` (kura) is an **at-risk-vs-safe**
axis, **not** a player-vs-estate axis — reconcile the two, and decide how much lands
in v0.3.2.

## The two axes are ORTHOGONAL (this is the whole insight)

There are *two independent* ways koku can be split, and the build only models one:

| Axis | Poles | Purpose | Where it lives today |
|---|---|---|---|
| **A · risk** | carried ↔ banked (kura) | a lost fight bites *carried* wealth; the kura shelters it (D-076/§4.6.6c) | **built** — `state.resources` vs `state.banked` |
| **B · ownership** | player (personal) ↔ estate (house) | the character's own purse vs the house's treasury & trade economy (D-099) | **NOT built** — one fused koku pool |

They compose into a 2×2 (carried-personal, banked-personal, carried-estate,
banked-estate), but **at T0 three of those cells are empty** — see below.

## Why T0 collapses axis B (player ≈ estate at the tutorial tier)

At T0 the protagonist is a **penniless servant rebuilding the house from his own
labour**. He has no personal fortune distinct from what he earns serving the
Kurosawa — his koku *is* the estate's recovery fund. So at T0:

- **Earning** (labour, fight spoils) → the player's carried koku.
- **The kura-works ladder** (U1–U4, the estate koku sink / flywheel) is the player
  spending *his* koku to rebuild the *house* — player-funds-estate, the two lanes
  **fused by narrative**.
- **The provisioning shop** (market.ts, 6 capped items) is the player buying goods
  for *his own character* — a **personal koku SINK** (D-099 blesses it). Total spend
  is a capped MINORITY lane (≤ ⅓ of the kura-works sink, §4.6.6d).

There is **no estate treasury, no trade income, no estate-scale wealth** at T0 — the
estate "economy" is just the flywheel of *player koku → kura-works → higher yields →
more player koku*. Axis B has nothing to separate yet.

## Where axis B actually SPLITS: T2, with the trade engine

D-099 + D-066: the **TRADE ENGINE** (trade work *on the estate's behalf*, for profit)
opens at **T2 Village**. That is the first time the *estate* holds and grows wealth
independent of the player's purse — the estate sells its *meibutsu* (silk), banks a
treasury, and the trade strand feeds the Estate & Wealth pillar (capped ≤ ⅓, §4.2.3).
Only then does "the player's personal koku" become meaningfully distinct from "the
estate's koku." The **end-state model** (v1.0.0):

- **Player lane** — personal purse; character purchases (vendors/shops, gear,
  consumables). The risk axis (carried/banked) lives *inside* this lane.
- **Estate lane** — the house treasury; kura-works, trade income, the pillar economy.
  Grows on the estate's behalf (trade engine, deeds), not from the player's pocket.
- The player may *invest* personal koku into the estate (as at T0), and later *draw a
  stipend* from the estate — but the two ledgers are tracked separately.

## Decision for v0.3.2 (what A5 actually ships)

**No structural finance split in v0.3.2 — it is a T2 feature (needs the trade
engine, which does not exist until Village).** Forcing a second koku ledger at T0
would model a distinction the tutorial tier has no content for — an empty lane is
worse than no lane (R6: if a player can't reach it, it doesn't exist). Concretely:

1. **Keep the single koku pool** (carried/banked) at T0. It is correct for the tier.
2. **Bless the provisioning shop as the personal koku sink** (already ships; D-099) —
   a one-line doc/label pass so its intent reads as "buy for *yourself*," distinct
   from the kura-works estate sink. No mechanic change.
3. **Record the two-lane end-state** in the PRD's resource model (§2.4 / §6) as the
   T2 target — so the design is on disk and T2 builds to it. (Plan A already reframed
   "no market in T0" → "no *trade engine* in T0"; this note is the deeper model.)
4. **Carry the split to the T2 build** as a scheduled item (Plan B §B / roadmap T2),
   *not* v0.3.2.

**Net v0.3.2 code:** minimal — a clarifying label/blurb pass on the shop vs. the
kura-works so the *player-sink vs estate-sink* distinction is legible now, and the
end-state two-lane model documented for T2. The real ledger split is T2 canon.

## Follow-ups

- PRD §2.4/§6 resource-model paragraph on the two lanes (end-state) — verify Plan A's
  reframe covers it; extend if thin.
- Roadmap T2: "player/estate finance split + trade engine" as a scheduled slice.
