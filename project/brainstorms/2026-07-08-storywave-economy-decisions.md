# Storywave Plan B — open-question walkthrough (human rulings)

**Date:** 2026-07-08 · **Source:** live walkthrough of the 13 open questions
in [`docs/plans/fable-2026-07-07-storywave-game.md`](../../docs/plans/fable-2026-07-07-storywave-game.md)
§ "Open questions for the human".

**Status:** COMPLETE — all 13 open questions ruled (2026-07-08). Plus the
soft-caps principle + rice/anti-grind economy shape surfaced live.

**Next:** Plan A transcribes the economy rulings into the **A0 economy
docket-ADR** (and the calendar / clean-break ADRs); this doc is the ruling
source. Several rulings **override the plan's executor-defaults** (flagged
below) — the plan body + its "Open questions" section want updating to match
(a Plan-B-executor / Plan-A transcription task, not done here).

**What this is:** the human's rulings, captured durably so they survive
compaction and feed the A0 economy docket-ADR (Plan A transcribes rulings
into `docs/living/decisions.md`; this doc is the raw ruling record). Where a
ruling overrides the plan's executor-default, it's flagged.

---

## Soft caps — the stated economy principle (human, 2026-07-08)

> "SOFT CAPS THE GLORIOUS SYSTEM THAT AUTO BALANCES ALL IDLE GRINDER GAMES"

The economy self-balances through **soft caps** (diminishing returns / rising
costs / decay), never hand-tuned hard walls. You set a **curve**; the economy
finds its own equilibrium. Grind-proof by construction — every axis flattens,
so the optimal player self-limits; pushing past equilibrium is wasted effort.
Tune exponents and rates, not `max_x = 9999` walls.

The soft-cap map — each axis auto-balances a *different* way:

| Axis | The soft cap | Auto-balances by |
|------|-------------|------------------|
| Rice/goods production | Diminishing returns as the season pool depletes | Grinding a worked field yields ever-less → per-season output self-limits |
| The kura (storage) | **Spoilage** | Bigger pile → more rot; net stock converges where spoilage = inflow (no storage cap to tune) |
| HP recovery (free) | The slow "rest at sickroom" trickle | Costs days; self-limits leaning on free healing vs paying |
| Standing / deeds (progress) | Rising rung thresholds | Each rung wants more than the last → grind buys ever-less progress |
| Mon inflow | Fixed day-wage + Yohei's finite purse | Flow-capped by design |

---

## Cluster A — economy rulings

### Q3 · Day-wage collection moment
**Ruling:** **Collect-at-the-board verb** (he walks to the board, is handed the
coin — tactile). Overrides the plan default (auto-credit at rollover).
- Cadence (daily vs weekly collection) is just a `×7 / ÷7` scalar on the
  amount — doesn't matter mechanically; tune by pacing.
- Autoplay must learn the verb (was a listed cost of this option).

### Q4 · Kind-lane overflow sink
**Ruling:** **Yohei's finite per-visit purse is the cap; raw materials are not
sellable in T0** (plan default). He buys rice + named goods only (`buys:`
whitelist); overflow feeds house stores + crafting, never coin. Keeps the mon
lane scarce.

### Q5 · House stores vs `banked`
**Ruling:** **Reframe `banked` AS house stores** (plan default). Deposits are
one-way barn-filling at T0 (raise stores, bank deeds, feed the nengu fiction);
no withdrawal verb. One ledger, one fiction; the one-way-ness is the T0
constraint. His own keeping = carried + the woodshed chest.

### Q8 · Defeat's carried-loss bleed
**Ruling:** **KEEP the bleed** — combat must have real danger; a loss bleeds
what he's *carrying* (coin + goods/materials). Overrides the plan default
(retire the bleed).
- Combines with the rice reframe below: rice lives in the kura and is *not*
  pocketed, so a defeat naturally bleeds coin + carried goods/materials, not
  rice.
- Needs a sim-check at G4 — double-cost (bleed + sickroom days) could over-
  punish; that's a balance dial, not a design blocker (ADR-132 verdict).

### NEW · Rice as a currency — units & where it lives
Surfaced by the human on Q8: "what even is '100 rice'? 100 grams? 100 grains?"
An abstract `rice` integer is immersion-breaking.

**Ruling:** **Measured units, lives in the kura, never pocketed.**
- Counted in period units: **shō** (wages/meals) → **bales (俵)** (stores/sales)
  → **koku (石)** (the nengu reckoning). Historically rice *was* money, but it
  was measured and never carried loose as a heap.
- Rice accrues to **house stores (the kura)**; the player never carries loose
  rice. Grounds the granary-filling fiction ("three bales past this winter's
  need").

### NEW · The anti-grind spine (the economy loop)
Human's problem statement: an append-only kura just balloons as you grind —
where are the sinks, how do you avoid forever-grinding?

**Ruling:** **A season is a finite production pool, depleting by DIMINISHING
RETURNS** (chosen over a hard "field closed" stop — softer, no jarring wall; a
determined player always eeks a trickle).
- **Sources (bounded per season):** each labour site yields a bounded amount
  per season (the paddy's harvest, the woodlot's kindling). Work it out and the
  yield thins toward ~zero until the season turns — which is *why* seasons are
  manual containers. No infinite tap.
- **Sinks (the kura goes DOWN):** consumption (steady daily draw) · spoilage
  (the storage soft cap — overstock rots) · the **nengu** (autumn's big
  reckoning, the Autumn exit-gate) · debt / the lease · seed (next season's
  planting).
- **Progress ≠ the rice count.** Rice is *working capital* that oscillates
  (fills through growing seasons, drops at consumption + spoilage + nengu).
  What you *keep* is **deeds / rung standing** — earned by proving you can run
  the house through a full year. That's the bounded, meaningful score.

---

## Cluster B — content & scenes

### Q6 · The R2 "silent rung"
**Ruling:** **Every rung-up opens a VN — R2 included.** Overrides the plan
default (narration-only, no modal).
- Structural consistency: the promotion is always the same ritual moment (one
  uniform "rung → VN" engine path); what goes *inside* is rung-specific.
- R2's VN *content* is the silent/narration treatment — no granter, quiet —
  but the frame is present like every other rung. Cleaner for the engine than
  a special no-modal path.

### Q7 · Chiyo's scene budget
**Ruling:** **Nengu scene + board ambient dialogue only, no granter beat**
(plan default). Matches the bible's R6/R7 → Genemon reassignment; needs no new
prose.

### Q11 · The old `takes/estate-build-beats/` bundle
**Ruling:** **Resolve its open HR-item as superseded, delete at G4.1** (plan
default) — the rewrite voids the old-canon beats it diverges.
- **Coupling the human flagged:** the NEW bible-shaped estate projects (mend
  the weir screens · reclaim the orchard · the granary past this-winter's
  need) are new fiction-voiced beats → **must be re-diverged** (3+ takes →
  VERDICT pick, ADR-139). Already scoped: this is **G0 known-uncovered item
  #6** ("estate repair-project lines + the day-book seasonal-judge grade
  lines"), riding the supplemental prose mini-wave in the same `t0v2/` shape.
  Alternates archive unwired (one-version ruling). Not executor fiction.

## Cluster C — UI / surfaces

### Q2 · The old node-graph map render (`ezu.ts`)
**Ruling:** **Retire it whole** (plan default). The sheet's zone seals get
real button/aria semantics (that IS the a11y answer — baked into the sheet,
not a second renderer). One map home, one code path (TST1).

### Q13 · `readout-seasons`
**Ruling:** **A new surface row, unlocking at R2**, beside the kept
day-of-week `readout-clock` (plan default). Two facts, two reveal moments
(TST4); the R2 season reveal lands as its own story beat.

### Q12 · The retirement-notice interim
**Ruling:** **Ship the notice frame with a bracketed `[dev — save retired; text
lands with the wave]` placeholder** (plan default) — deliberately out-of-
fiction, never fake prose (§0.5). Prod is gated: G7 won't ship until the
fiction-gap HD-item closes, so no placeholder reaches players. Decouples the
G1 persistence break from prose delivery.

## Cluster D — scope & ship

### Q10 · Shipped features the bible never mentions
**Ruling:** **Keep all five, re-fictioned** (plan default): skills registry
(conditioning → drill-yard/night-round readiness) · crafting-lite (carrying-
pole origin-true) · belongings/home comforts (→ the Woodshed) · the lacquer
discovery (→ woodlot) · attribute points / ascension boon (pending the economy
ADR review). Anything found beyond these: keep + re-fiction + journal; a
*contradiction* of the bible is an HD-item.

### Q1 · Version semantics
**Ruling:** **v0.4.0** (plan default) — a milestone on the road, not feature-
completeness; the ladder to 1.0 (the whole 6-tier game) stays honest.

---

## Summary — overrides vs defaults

**Overrode the plan's executor-default (3 + the economy shape):**
- Q3 wage → **collect-at-the-board verb** (not auto-credit)
- Q6 R2 → **every rung-up gets a VN** (not narration-only)
- Q8 defeat → **keep the carried-loss bleed** (not retire it)
- NEW: rice = **measured units in the kura, never pocketed**; anti-grind =
  **finite seasonal pool w/ diminishing returns**; **soft caps** as the
  stated self-balancing principle.

**Took the plan default (10):** Q4, Q5, Q7, Q9*, Q10, Q11, Q2, Q13, Q12, Q1.
*(Q9 refined: treatment mends + a manual "rest at sickroom" trickle; **no**
auto HP trickle.)*
