# Economy re-core — balance watch (for playtest tuning)

**Status:** 🟡 for the human's playtest review. Surfaced by the 14-agent adversarial
audit of the complete T0 economy re-core (Ph1–4, 2026-07-02). These are **balance /
pacing** observations, NOT code defects — they're **D-059 liquid** (tune by playtest),
and balance is the human's feel-call (R5). The audit's adversarial pass REFUTED them as
"not hard defects" (all tunable), but they matter for tension (D-086), so they're parked
here rather than silently changed. The two real *defects* the audit confirmed (load-path
reveal; coin log-line denomination) were fixed separately.

## The watch-items

1. **Rice out-produces its sinks → coin trivially abundant.** Rice accrues faster (rake
   + paddy) than eat/sell/store can absorb, and selling clears every T0 coin sink
   (market/estate/repair) in a small fraction of the run. Net: coin becomes a dead,
   infinitely-accumulating resource for most of T0 — the opposite of the intended
   store-vs-sell tension. *Levers:* smaller rice yields, larger/ongoing coin sinks, a
   rice cap/spoilage, or gating big sinks higher.

2. **The seasonal store-vs-sell "decision" is dominated → always-hold-until-spring.**
   Kura storage is free, lossless, and loss-safe, so against the ~2× spring/autumn price
   swing the optimal policy is trivially "hold all rice, sell in spring." *Levers:* a
   holding cost (spoilage/vermin), a storage cap, or a narrower price swing.

3. **`eat_rice` is dominated by the free `rest` for a coin-optimiser.** Eating spends
   rice (which has sell value) for satiety that `rest` gives free; it only "wins" on an
   isolated satiety-per-action metric that ignores rice's coin value. *Levers:* make rest
   cost something, or give eat a distinct benefit (faster/uncapped recovery, a small
   buff) beyond raw satiety.

4. **The koku-standing capstone is reached too fast (pacing).** The macro engine the
   whole tier builds toward hits its EXCELLENT ascension gate in ~60 labour acts
   (~25–30s of play), an anticlimax against the intended ~85-minute climb. *Levers:*
   raise the ESTATE_BANDS thresholds, slow the estate-works yield, or lengthen the labour
   curve. (This is the biggest *feel* item — the capstone should be earned.)

## Recommendation

Play T0 end-to-end and tune numbers by feel (all liquid). The structural questions —
whether rice/coin need a hard sink or cap, and whether the capstone thresholds want a
re-derivation — are design calls for you; I did not pre-empt them. The mechanics
(sell/eat/store, season price, loss-bite, koku standing) are sound; it's the *magnitudes*
that want your playtest.
