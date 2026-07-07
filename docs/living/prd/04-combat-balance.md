# §4 — Combat, Progression & Balance Model

> **ADR-117 (2026-07-03) — ripple-frozen: no per-change hand-updates.** The
> illustrative magnitudes below are **no longer hand-updated as balance
> tunes**; `core/content/balance.ts` + the generated `docs/content/` tables
> are the live truth (R2: the build wins). This section's numbers refresh at
> the **T0 compression sweep** (ADR-117 — triggered when the R1 taste review
> closes), not per-change.

> This section is authored from the two-phase progression spine (§1.6.4 — the
> sequential two-phase model + the three combat tracks) and the system shapes fixed in
> §2 (the three tracks, the incremental weapon roster, the per-skill perk channel, the
> satiety-throttled / durability-banded combat).
>
> **Fixed shapes vs tunable magnitudes.** The **canon shapes** — the data types, the
> accrual *modes*, the trade ≤⅓ invariant, the hybrid tier-gate, the three clean
> tracks — are fixed; only the **magnitudes** (yields, levers, curves) are tunable,
> chosen here as a coherent, self-consistent set so the pacing targets (§4.8) hold. The
> duplicated/derived balance numbers below are **illustrative — the source of truth is
> the generated `balance.ts` and the `docs/balance/` / `docs/content/` tables**; no
> value is hand-maintained twice, and derived numbers reflow with no save migration.
> Every value lives in `core/content/balance.ts`, the single home for tunables.
>
> Two shapes carry designed nuance: **(1)** labour → combat is a **bounded per-skill
> combat-perk channel** (`skillCombatBonus`, ~2–8 small perks per skill, no hard global
> cap — §4.5.4), conditioning stays the zero-stat enablement gate, and the big combat
> power stays combat-fed only; **(2)** the tier-gate is the **hybrid
> good/great/excellent profile** — good in ALL revealed pillars, great in 2–3, excellent
> in 1–2, no overflow/substitution (§4.1). The **trade ≤⅓ cap** and the **achievement
> jumps + seasonal-judged-on-high-water-mark** accrual mode are canon.

> **The budget is a FLOOR, not a ceiling.** The **≈28.5 h figure is the v1 Phase-1
> climb FLOOR, not the total** — the rung-climb summed across the four v1 tiers T0–T3.
> The full **v1 saga ≈ ~60 h FLOOR = the ~28.5 h Phase-1 climb floor + a ~+32 h
> Phase-2 pillar-grind floor**. The **per-rank ≈30-min floor** (binding from T1) and the
> per-tier hour budgets are **MINIMUMS**: a long grind you settle into and leave
> auto-running, checking the progress. The saga can and should run **longer** than the
> ~60 h floor when content interleaves richly and players push pillars past *good* to
> great/excellent (§4.1); §4.8 is a minimum-grind model whose pacing regression **fails
> on UNDERSHOOT only** (a rung cleared too fast), never on overshoot.

## How to read this section

This is where the balance numbers parked in §§1–2 land. Each subsection states the
**shape** (canon, fixed), then a **number set**, then the **levers** to turn during
tuning. Units throughout: **rice** (the real labour RESOURCE — you eat it for
satiety, store it in the *kura*, or sell it for coin at a price that swings by
season; **not** a currency, **not** a synonym for koku), **coin** (the sole
spendable currency; one underlying value in base unit **mon** 文, displayed in
fixed mixed denominations **mon → monme → ryō** — 1 ryō = 50 monme = 4,000 mon,
1 monme = 80 mon — with the higher denominations revealed **incrementally** as
wealth grows: mon at T0–T1, monme from T2, ryō by T4–T5), **koku** (the House's
assessed **STANDING** — a kokudaka-like prestige SCORE, re-assessed seasonally,
**NEVER spent**, gating ascension/unlocks; it re-expresses the House's overall
Influence, it is **not** a spendable resource), **House Influence** in abstract
**Influence points (ip)** per pillar, displayed with **K/M/B** abbreviation (not
scientific, not myriad units). One **tick**
= the atomic active-play time-step; **1 action ≈ 1–4 ticks**; **1 day ≈ 200 ticks**;
**1 season = 28 days ≈ 5,600 ticks**; **1 year = 4 seasons = 112 days** (abstract,
active-only — §2.2). These tick/day mappings are themselves levers.

**Wall-clock anchor (the locked time budget reads as a FLOOR).** Because the saga
length and the per-rank ≥30-min floor are stated in real minutes, the balance commits a
**wall-clock ⇄ game-time binding**: at the intended active-play pace, **1 season ≈ 34
min of real play** in T0, stretching to **~60 min/season in T1** and **~120 min/season
in T2** (the player does more *per* season as the world enlarges, not more seasons).
This lets the §4.8 pacing table be read in minutes. The binding itself is a **lever**
(`SEASON_WALLCLOCK_MIN[tier]`), but the *floor* targets it serves (≥30 min/rank; the
per-tier hour budgets, as **minimums**) are locked.

---

## §4.0 The number spine — magnitudes per tier (the master scale)

Everything below hangs off one **per-tier magnitude band** so K/M/B abbreviation reads naturally and "the
next goal never balloons > ~2–3× the prior" (§1.2 pillar 3 / pacing §4.8). The house's
**total resource & Influence magnitudes** grow ~**one order of magnitude per tier** (≈10×), but **within a
tier** every individual step is a gentle **~1.15× geometric** so no single jump feels like a wall. The number
spine has **two independent axes** — a **RESOURCE scale** (rice you produce/hold/sell, coin you spend) and a
**STANDING ladder** (koku, the House's assessed prestige score, never spent) — sized separately below.

### §4.0a The RESOURCE scale — rice produced/held + coin spent

> **The T0 rice band (yields are already NET).** The T0 lifetime-produced band reads **~21K rice**, matching the
> §4.8.1 rung-by-rung sum exactly (R1…R7 = 0.75K+1.05K+1.2K+2.1K+3.2K+4.95K+8.25K = **21.5K ≈ 21K**). Because
> gathering yields are modelled **already net** of stamina/food/re-investment (§4.7.1), the **end-T0 HELD rice ≈
> 18–19K NET**. The two figures the player sees — lifetime-produced ~21K, held ~18–19K NET — differ only by the
> rice **eaten / re-invested** and the rice **sold to coin** to fund the genuine **coin sinks** (the U1/U2/U3
> kura-works, tools, craft inputs — §4.7.5), not by a hidden upkeep tax.

The **rice** bands are wide (a long-floor tier produces far more rice), while the **Influence-per-pillar** bands
stay close to the gate magnitudes — Influence is the *slow, judged* measure, deliberately lagging the raw
resource counters. The rice bands below come straight out of the §4.8 throughput model (end-T0
*lifetime-produced* rice ≈ 21K; end-T0 *held* rice ≈ 18–19K NET). **Coin** (the spendable currency) rides the
same scale — the player sells rice for coin at a season-swung price (§4.7.1) and spends it on the market /
estate / repair sinks — and is **displayed in mixed denominations that reveal incrementally**: **mon** at
T0–T1, **monme** unlocking from T2, **ryō** by T4–T5 (1 ryō = 50 monme = 4,000 mon).

| Tier | rice band (lifetime-produced → held NET) | coin display denom. | Influence-per-pillar band (display) | Typical single number the player sees |
|---|---|---|---|---|
| **T0 Estate** *(tutorial, R0–R7)* | tens → ~**21K** produced (~**18–19K** held NET) | mon | 0 → ~**1.5K** ip | "**3.4K rice**", "**Estate 1K**" |
| **T1 Estate-full** *(R8–R15)* | full-estate Phase-1 + first Arms/Estate deeds *(band between T0 and T2; per-rung values in the generated balance tables)* | mon | ~0 → ~**8K** ip *(the §4.1 T1 good bands)* | "**Estate 8K**", "**Arms 5K**" |
| **T2 Village** | ~10K → ~**250K** produced | mon → **monme** reveals | ~0.5K → ~**15K** ip | "**42K rice**", "**Estate 11K**" |
| **T3 Region** *(v1 end-gate)* | ~100K → low **M** | monme | ~5K → ~**110K** ip | "**1.8M rice**", "**Office 78K**" |
| **T4 Castle-town** *(beyond v1)* | low **M** → ~**100M** | monme → **ryō** reveals | ~50K → ~**900K** ip | "**240M rice**", "**Name 900K**" |
| **T5 Edo** *(beyond v1)* | ~100M → low **B** | ryō | ~1M → ~**12M** ip | "**3.4B rice**", "**Name 11M**" |

### §4.0b The STANDING ladder — koku, the assessed prestige SCORE (never spent)

**Koku is the House's assessed STANDING** — a kokudaka-like prestige score, **NEVER spent**, **not** an income
multiplier, re-expressing the House's overall Influence into a single figure. It is **re-assessed seasonally**
(the `seasonalJudge` reckoning, §4.2.2) and confirmed by a big **"the assessors arrive" event at each tier
jump**, and it **gates ascension / unlocks** rather than being a resource you accumulate and burn. Its ladder
is anchored to the **daimyō line — T4 = 10,000 koku** — and rises on its own coarse, **PROVISIONAL / liquid**
bands (distinct from the resource scale above):

| Tier | koku STANDING band | Note |
|---|---|---|
| **T0 Estate** | **tens** | first assessed standing; koku unrevealed until the first seasonal appraisal |
| **T1 Estate-full** | **~100 → 1,000** | the House becomes a named minor holding |
| **T2 Village** | **~1,000 → 5,000** | |
| **T3 Region** *(v1 end-gate)* | **~5,000 → 10,000** | approaches the daimyō line by the v1 end-gate |
| **T4 Castle-town** *(beyond v1)* | **10,000 (DAIMYŌ) → ~100,000** | 10,000 koku = the daimyō threshold; a **personal koku stipend** appears from T4+ (House-only before) |
| **T5 Edo** *(beyond v1)* | **~100,000 → 1,000,000+** | T5 caps the full parallel **Office / court-rank / favour** track (koku = scale, office = access) — T0 grants exactly ONE home status token; the surname→two-swords→gōshi ladder is T1–T5 (**ADR-122**) |

*(Recorded as ADRs **ADR-107** — the rice/coin/koku split, **ADR-108** — coin denominations, **ADR-109** — the
tier→koku ladder + office track + T4 stipend. The upper koku bands are provisional/liquid.)*

**Lever:** the **per-tier multiplier `TIER_MAG = 10`** (the order-of-magnitude step) and the
**intra-tier growth `r_intra = 1.15`** are the two master dials. The Influence bands still step ~**10×**
for Arms/Estate; the **Standing & Office** band steps **harder** (≈10× → ≈25× at the T1→T2 boundary) by
design, because the required-pillar gate **drifts** from "survive/get strong" to "win it socially" (§4.1).
**v1 spans T0–T3** (T4–T5 lie beyond v1), so the first four bands are load-bearing for launch tuning. The saga
is long because it **stretches wall-clock-per-rung** (the ≥30-min floor) and **fattens the *rice* counters**,
*not* by inflating `TIER_MAG` — the chapter-break feel of ~10× is preserved (a slower release of incremental
features, not bigger walls).

---

## §4.0.1 Progression architecture — three tracks, two phases

This is the conceptual hub the rest of §4 hangs off (the canonical statement is **§1.6.4**; the system shapes
are **§2.8.1 / §2.15.1 / §2.16**). Two structural facts drive every curve below.

**(1) THREE independent, separately-stored tracks — never one fused bar.** Reconflating them is the single
likeliest regression (a fused "Combat Level = a Combat Deeds pool" would collapse all three). What **one
kill / one recognised deed / one curated rung activity** writes makes the distinction concrete:

| Track | Fed by | Writes / scales | Gate role | §4 home for its curve |
|---|---|---|---|---|
| **Character (combat) level** | kills → **combat-XP** only (labour and deeds **never** raise it) | **HP** (`hpMax = 40 + 8·characterLevel`), **satietyMax** (base + per-level growth), **+1 attribute point / 2 levels** | personal **power**; per-mob `MobDef.level` sets on-kill XP | the curve is **§4.6.5** (one definition, referenced everywhere) |
| **The Arms pillar** (武威) | recognised martial **DEEDS** (a road declared safe; a nest cleared; the grain store defended) | one of the **four House-Influence pillars** | **Phase-2** tier-gate input (the hybrid profile) | §4.1 / §4.2 |
| **The Combat Rank rung-meter** | **per-rung CURATED** combat activities (not raw kills/XP) | the **per-rung-reset martial rung-meter** | **Phase-1** martial rung-gate | §4.1.1 |

So: **one kill → character-level combat-XP (only)**; **one recognised deed → Arms**; **one curated rung
activity → the Combat Rank meter.** Each stream **sums independently** (the §6.6 verifier asserts no leakage).
*(The martial rung-meter is **Combat Rank**; "**Standing**" means the **官威 Standing & Office** pillar
**only**.)* `character.level` is the **only** one of the three that scales personal power; the
other two are *standing*/*gate* meters. **No section may re-derive its own "level" concept** — the one
combat-fed character-level curve (§4.6.5) is the sole driver of `hpMax`, `satietyMax`, and attribute points.

**(2) TWO ordered phases per tier — Phase 1 (climb rungs) then Phase 2 (pillar grind).**

- **Phase 1 — climb the rungs (R0→R7 etc.).** Each rung promotes on **BOTH** the **per-rung-reset rung-meter**
  (§4.1.1) **AND** the rung's **story milestones** (an **AND-gate**; the UI reads "awaiting X" when one side
  lags). The meter is fed by **curated, story-consistent per-rung activities** (a designed one-to-many set,
  authored **separately from** the pillar-deed inventory). Two meters run in parallel: **Estate Service**
  (labour) and **Combat Rank** (martial). **Pillar DEEDS do NOT accrue in Phase 1.**
- **Phase 2 — grind the house up.** The **capstone (final) rung OPENS Phase 2** — the **estate-influence /
  four-pillar grind.** The tier's **pillar DEEDS accrue here and ONLY here** (gated post-final-rung),
  which structurally prevents the **"half the rungs, maxed deeds"** exploit. Clearing the tier's **hybrid
  good/great/excellent pillar profile** (§4.1) is what **tiers up.** *(There is **no stored "phase" flag** — the
  phase is **derivable from the current rung**: pre-capstone = Phase 1, post-capstone = Phase 2; §6.4.)*

**Consequence for the pacing tables (§4.8).** A tier's wall-clock = **Phase-1 rung climb + Phase-2 pillar
grind**, both ≥ their floors. The §4.8 rank-by-rank tables therefore split into a **Phase-1 rung block** (gated
on the rung-meter + story, §4.1.1) and a **Phase-2 grind block** (the deed + seasonal accrual to the hybrid
gate, §4.2). Every number ties out against the same **≥30-min-per-rung FLOOR** that §4.1.1 back-solves and that
the §6.6 gate-monotonicity verifier asserts.

---

## §4.1 The HYBRID good/great/excellent tier-gate (the Phase-2 tier-gate)

**Shape (canon §1.6.3/§1.6.4, §2.16 — fixed).** Tier-up is **not** "the named required pillar(s) each clear a
single stated threshold." It is a **HYBRID specialisation profile across the pillars REVEALED by that tier**:
you must be **good in ALL revealed pillars** (a **breadth floor**), **great in 2–3**, and **excellent in 1–2** —
**with NO overflow/substitution** (a surplus in one pillar can never stand in for a deficit in another). The
semantics are **authored levels, not ratios**: **good = the expected baseline · great = really strong ·
excellent = above-and-beyond**. This profile is the **Phase-2 tier-gate** — it is **ANDed with the Phase-1
capstone rung-meter + story gate** (§4.1.1), and it is **only ever checked against pillars REVEALED by that
tier** (never "good in ALL" against an unrevealed pillar).

**The revealed-pillar set grows per tier** (matching the §3 reveal schedule and the §2.16(e) four-bar-panel
reveal): **T0 = 2** (Arms + Estate — a **2-pillar special case**), **T1 = 3** (+ Office), **T2 = 4** (+ Name, a
real gated pillar). The required pillars still **drift** as they reveal — early tiers lean **Arms + Estate**
("survive and get
strong"), upper tiers lean **Office + Name** ("win it socially"). The only structural cap that survives is
**trade ≤⅓ of Estate & Wealth** (§4.2.3) — trade can never carry a gate, and cross-pillar combos (§4.3.1) are
computed **post-clamp** and **excluded** from this gate-check.

**The good/great/excellent bands** *(grounded per-pillar-per-tier in the §4.2.1 deed inventory; **NOT** uniform
0.2×/0.5× ratios — each band is grounded in a deed-count, so the great/excellent multipliers vary per
pillar/tier by design)*. The **good band is the reference magnitude** the routine Phase-2 grind delivers;
**great/excellent are reached by
allocating MORE deeds** (per-event cap still binds, so it is *quantity*, never bigger spikes — "above and
beyond," not "one huge act"):

| Tier (revealed pillars) | Pillar | **good** (baseline — required in ALL) | **great** (required in 2–3) | **excellent** (required in 1–2) |
|---|---|---|---|---|
| **T0 → T1** *(Arms + Estate; 2-pillar special: good in BOTH + excellent in 1)* | Arms | **0.5K** | **0.72K** | **0.95K** |
| | Estate | **0.8K** | **1.1K** | **1.5K** |
| **T1 → T2** *(Arms + Estate + Office; good in ALL 3 + great in 2)* | Arms | **5K** | **7.5K** | **10K** |
| | Estate | **8K** | **11K** | **15K** |
| | Office | **2K** | **3.2K** | **4.5K** |
| **T2 → T3** *(v1 end-gate; Arms + Estate + Office + Name → **4 revealed**; good in ALL 4 + Estate & Office great/excellent, Arms & Name good)* | Arms | **30K** | **42K** | **58K** |
| | Estate | **60K** | **84K** | **112K** |
| | Office | **50K** | **78K** | **110K** |
| | Name | **28K** | **42K** | **60K** |
| **T3 → T4** *(beyond v1; Office + Name excellent)* | Office | **600K** | **850K** | **1.2M** |
| | Name | **500K** | **720K** | **1.0M** |
| **T4** *(beyond v1; Name + Office excellent)* | Name | **6M** | **8.5M** | **12M** |
| | Office | **5M** | **7M** | **10M** |

> **How the bands tie out against the fixed deed inventory (the §6.6 accrual-tie-out check).** The §4.2.1 deed
> inventory + the §4.2.2 seasonal stream are sized to deliver the **good** band in every revealed pillar — that
> is the breadth floor every player reaches, and it is what the verifier ties out (deeds = 70 % of the *good*
> band, seasonal = 30 %, §4.2.1/§4.2.2). The **great/excellent** bands are then reached by the player
> **specialising** — pouring the Phase-2 window's *additional* recognised deeds into their chosen 1–2 pillars
> (each still per-event-capped at 0.04·good-band, so it is many small acts, not spikes). Because the base
> inventory only guarantees *good in all*, pushing 1–2 pillars to great/excellent **extends Phase 2 beyond its
> floor** — exactly the **budget-as-a-FLOOR** intent. A combo (§4.3.1) is **excluded** from this check:
> it can never satisfy "good in ALL revealed pillars."

**The great/excellent SURPLUS supply — the supra-good deed inventory.** Because the seasonal stream
tops out at 0.30·good (its `f` saturates at the good-band-top, §4.2.2), **ALL ip above the good band comes from
additional capped deeds.** Each revealed pillar therefore carries an authored *surplus* deed inventory beyond
its 70 %-good base (§4.2.1) — the supra-good supply a specialising player draws on. The counts below (surplus
ip = band − good, ÷ the pillar's representative deed base, every base still ≤ its 0.04·good cap) are the
**extra** recognised deeds to reach great / excellent in that pillar — and because each is done at the tier's
Phase-2 deed cadence (~5 min T0 · ~8 min T1 · ~13 min T2, §4.8.1b), **they ADD Phase-2 minutes on top of the
floor** (the budget-as-a-FLOOR intent):

| Tier · pillar | good→great surplus (ip / **deeds**) | good→excellent surplus (ip / **deeds**) |
|---|---|---|
| **T0 Arms** | 0.22K / **~18** | 0.45K / **~38** |
| **T0 Estate** | 0.30K / **~14** | 0.70K / **~32** |
| **T1 Arms** | 2.5K / **~25** | 5.0K / **~50** |
| **T1 Estate** | 3.0K / **~19** | 7.0K / **~44** |
| **T1 Office** | 1.2K / **~17** | 2.5K / **~36** |
| **T2 Arms** | 12K / **~12** | 28K / **~28** |
| **T2 Estate** | 24K / **~18** | 52K / **~39** |
| **T2 Office** | 28K / **~17** | 60K / **~36** |
| **T2 Name** | 14K / **~15** | 32K / **~34** |

So the gate's "great in 2–3 · excellent in 1–2" is *paid for in extra deeds*: e.g. pushing **two** T2 pillars to
great (~35 deeds × ~13 min ≈ **+7.5 h**) plus **one** to excellent stacks on T2's **~+20 h Phase-2 window**
(§4.8.1b/§4.8.4). The supra-good inventory is **authored beyond** the 70 %-good base, obeys the same per-event
cap, and never feeds the trade ratio or the gate-eligible accumulator (combos excluded, §4.3.1).

**Reading the drift & the special cases.** **T0** is the **2-pillar special case**: only Arms + Estate are
revealed, so the gate is **good in both + excellent in exactly one** (no phantom third pillar). **T1** reveals
Office, so the gate is **good in all three + great in two**. **T2** surfaces Name (**4 revealed**), with the
profile leaning **Estate + Office great/excellent, Arms & Name good** ("win it socially"). A pillar **not yet
revealed** for a tier is **never** checked (never "good in ALL" against it). **T2's Name is a real gated
pillar:** the gate is **good in all 4 + Estate/Office great/excellent, Arms & Name good** — Name's own **28K
good band** (§4.1 table) is a live breadth-floor consumer, not a free pass. Each good-band sits at roughly the
top of the prior tier's band (§4.0); T0→T1 good is ~**10×** T0's start; T1→T2 keeps ~**6–10×** on Arms/Estate
but the **Office good-band steps ~25×** (2K → 50K) — the deliberate "win it socially" steepening, NOT a
violation of the within-tier ≤2–3× rule (that rule binds *consecutive within-tier goals*, never the
chapter-break tier step).

**Levers:** the **good/great/excellent triple per revealed pillar per tier** (the table above — the first three
tier-up gates span v1), **plus the great/excellent COUNTS** per tier (how many pillars must be great vs
excellent). Tune each band independently against playtest time-to-tier (§4.8). Keeping a gate's **good band ≈
band-top** of that tier (§4.0) is the design invariant; the absolute values are free. The **per-tier hour
budget each gate must take to fill** (the §4.8 per-tier FLOORS) is **locked** — retune yields and band
magnitudes, never the floor, if a playtest time-to-tier *undershoots*.

---

## §4.1.1 The rung-meter accrual law (the third progression curve)

**Shape (canon §1.6.4, §2.15.1 — fixed).** Phase 1's two parallel rung-meters — **Estate Service** (labour) and
**Combat Rank** (martial) — are **numeric and PER-RUNG-RESET** (each rung starts its meter at 0). A rung
promotes on an **AND-gate**: `rungMeter ≥ thresholdForRung` **AND** all the rung's `requiredStoryFlags` are set
— the UI reads **"awaiting X"** when one side lags. The meter is
fed **only** by that rung's **curated, story-consistent activities** (a designed one-to-many set tagged by
`rungActivityTags`, authored **separately from** the pillar-deed inventory of §4.2.1) — **not** by raw
kills/XP (those feed the character level, §4.6.5) and **not** by pillar deeds (those are Phase-2, §4.2).

**The back-solve — the ≥30-min FLOOR is enforced on the METER POINTS.** Each rung's threshold is
back-solved against the **maximum** eligible-activity completion rate so that **even optimal FOCUSED play
cannot fill the rung's numeric-points objective in < 30 min** — the *meter threshold* is the runtime
enforcement of the ≥30-min floor (not a wall-clock check). **Unfocused play** (multi-skilling, side-quests,
off-objective wandering) earns the curated points more slowly and so takes **LONGER — ~60–120 min/rung**. The
§4.8.1 per-rung **wall-clock column** (35/40/45/55 min, etc.) is therefore **EXPECTED real, somewhat-unfocused
play — it sits ABOVE the 30-min focused-optimal floor and is NOT a contradiction with it.** The threshold is
in lockstep with the §4.8.1 rice column and asserted by the §6.6 gate-monotonicity verifier:

```
thresholdForRung(rung) = RUNG_FLOOR_MIN · eligibleActivityRate(rung)        // RUNG_FLOOR_MIN = 30 (min, a FLOOR)
//   eligibleActivityRate = curated activity-points the rung yields per minute at the intended pace
//   meter is measured in "rung activity-points (cap)"; per-event-capped like every other accrual
```

So the meter and the time floor are the **same constraint expressed two ways**: clear the curated activities
faster than the floor and the meter is *still* short of threshold (you cannot skip the floor); clear them at
pace and the meter and the floor land together. The activity *rate* drops slightly at higher rungs (their
curated activities are richer/slower), so the threshold falls gently (fewer activity-points fill the same ≥30-min floor as each activity is worth less per minute) while every rung stays ≥ 30 min.

> **SUPERSEDED for T0 (ADR-137/FB-121, built):** T0's ladder no longer uses a meter/threshold at all —
> each rung is an authored **hidden requirement list** (`requirements.md` → gen; counts are markdown
> numbers tuned edit → gen → sim, no balance.ts mirror), and the ADR-132 sim re-signs the per-rung
> wall-time bands. The threshold model below stands only as **frontier intent for T1+** until each
> tier's own design pass decides whether it adopts the requirement model.

**The T0 rung-meter thresholds** *(historical/frontier illustration — back-solved from 30 min × the rung's rate)*:

| Rung | Meter | curated-activity examples (the one-to-many set) | rate (pts/min) | threshold (= 30·rate) |
|---|---|---|---|---|
| **R1 Day-labourer** | Estate Service | rake/recover rice · clear the forecourt · first paddy turns | ~0.60 | **~18** |
| **R2 Bonded hand** | Estate Service | forage runs · woodcut · haul loads · stable chores | ~0.62 | **~19** |
| **R3 Yard-hand** | Combat Rank | survive the first fight · drill reps · first pest skirmishes | ~0.55 | **~17** |
| **R4 Trusted hand** | Estate Service | indoor errands · first *shinden* labour · craft a first tool | ~0.58 | **~17** |
| **R5 Gate-guard** | Combat Rank | stand a watch · pest-control / hunt / clear sweeps | ~0.55 | **~17** |
| **R6 Foreman** | Estate Service | drive workshop/granary works · proto-industry shifts | ~0.50 | **~15** |
| **R7 Bailiff** *(capstone → opens Phase 2)* | Estate Service | field-office duties · record the first reclamation | ~0.46 | **~14** |

The thresholds are deliberately **modest numbers** (the floor is enforced by *time*, not a huge meter): a player
who races the curated activities still cannot beat the ~30-min floor, because the rate ceiling is what the floor
is computed against. **Combat Rank** and **Estate Service** advance **independently** (a rung may gate on one,
the next on the other; both reset per rung). T1/T2 rung-meter thresholds scale the same way against their
longer per-rung floors (≥ ~40 min at T1, ≥ ~75 min at T2; §4.8.2/§4.8.3).

**Levers (T1+ frontier):** `RUNG_FLOOR_MIN = 30` *(a FLOOR — the value is the minimum, not a ceiling)*;
each rung's `eligibleActivityRate` and the curated-activity set that realises it. For **T0 (built)** the
levers are the authored requirement **counts** in `requirements.md` (ADR-137). The **per-rung-reset rule**
and the **≥30-min floor (T1+; T0 exempt — ADR-056)** stay canon; the AND-gate is superseded at T0 (100% of
the requirement list IS the gate).

---

## §4.2 The four-pillar ACCRUAL model (the PHASE-2 grind)

**Shape (canon §1.6.2, §2.16 — fixed).** Influence accrues in **exactly two shapes — never a passive
time-trickle, never a flat per-action increment — and ONLY on the PHASE-2 estate-influence track:** pillar
**DEEDS do not accrue while climbing the rungs** (gated post-final-rung; §4.0.1), which prevents the "half the
rungs, maxed deeds" state.

- **(A) Achievement JUMPS** — a concrete deed *recognized* by the relevant authority, **per-event capped**.
  **(PRIMARY growth driver — ≈70 % of each pillar's growth; deeds dominate.)**
- **(B) Periodic JUDGED RESULTS** — fired **every season** (4×/year; autumn harvest the headline), raising a
  pillar **only on a new high-water mark** (never repeatable maintenance). **(SMALLER top-up — ≈30 % of each
  pillar's growth; the appraisal seasons your deeds, it doesn't carry the tier.)** **Weather and festivals
  modulate these judged results mechanically, bounded ±10 %** (a day-keyed STATELESS derivation — §4.7.1), and
  **bulk sales** apply a **saturation damper progressively per-unit** (§2.4).

**The accrual split (locked):** **deeds ≈⅔–¾ (we use 70 %)**, **seasonal ≈¼–⅓ (30 %)** of every pillar's growth
toward its **good band** (the §4.1 reference). The split is a *design target*, realised by sizing the deed
inventory (§4.2.1) and the seasonal `JUDGE_K` (§4.2.2) so the two streams add to the **good band** in that
ratio; the **exact 70/30** is a tunable realisation of the locked "deeds dominate" shape. The
**great/excellent** bands above the good baseline are reached **predominantly by additional deeds** (the
specialisation surplus, §4.1) — the foreground stays the punchy deed stream throughout.

Up-only, with small scripted **per-pillar recoverable dents** (§4.2.4). The **trade ≤⅓** cap is a hard
invariant (§4.2.3). At **T2** the **PARTIAL Office-pairs cross-pillar combos** (§4.3.1 — Arms×Office,
Estate×Office, when Office reveals) open, **broadening to the FULL 4-pillar set at T3** (when Name reveals;
multiple pillar pairs, larger magnitude), and join seasonal-reward rotation as the late-game anti-slump device
— computed **post-trade-clamp**, **excluded from the trade-ratio denominator**, and **excluded from the
deed-only `gateEligibleValue`** the §4.1 gate checks (combos credit display `value`, never the gate).

### §4.2.1 Achievement JUMPS — concrete values + per-event caps

A jump fires when a recognized **Phase-2** deed completes (a recorded yield, a granted title, a sealed
contract, a road declared safe in the books, a won petition, a nest cleared, the grain store defended). Each
deed carries a **base jump value** and is subject to a **per-event cap** = a fraction of the *current tier's
pillar GOOD band* (the §4.1 reference magnitude), so **no single fight or harvest spikes a pillar**:

```
jump = min( deedBaseValue, PER_EVENT_CAP_FRACTION · goodBand(pillar, currentTier) )
```

**`PER_EVENT_CAP_FRACTION = 0.04`** (one deed can move a pillar at most ~**4 %** of the way across its good
band) — a deliberately small cap (canon "deed-jump size = SMALLER / STEADIER (grindier)": growth is the sum of
*many small acts*, never a few spikes). The cap is computed against
**that pillar's own GOOD band for the current tier** (= its §4.1 reference): T0 Estate cap = 0.04·0.8K =
**32 ip**, T0 Arms = 0.04·0.5K = **20 ip**, T1 Office = 0.04·2K = **80 ip**, T2 Arms = 0.04·30K = **1.2K**, T2
Office = 0.04·50K = **2K**, etc. **Every deed base in the table below sits at or under its own pillar/tier cap**
(a handful of intentional *at-cap* anchors — the DEFEND deed, the top road/alliance deeds — are labelled
*(cap)*). So **the cap virtually never silently clamps** a deed: bases were tuned *down* to fit under the cap —
the texture is *quantity of small deeds*, not a clamp on big ones. Reaching the **great/excellent** bands above
the good baseline is therefore a matter of **doing MORE of these small capped deeds in the specialised
pillar**, never of bigger jumps.

> **T0 has NO trade strand.** The TRADE sub-engine opens at the **Village tier** (its market is the first — there
> is no *trade engine* in T0; a small provisioning shop where the player buys for his own character is a personal
> coin sink, not the estate trading for profit, §2.4). T0's trade-contract ip is **itemized into LAND + TREASURY
> deeds** (below); trade contracts first appear from the Village tier.

| Deed class | Pillar | T0 base | T1 base | T2 base | per-deed cap (0.04·good-band) |
|---|---|---|---|---|---|
| Minor clear (boar/monkey nest) | Arms | 8 | 70 | 700 | T0 20 · T1 200 · T2 1.2K |
| Road/ford declared safe (in the books) | Arms | 18 | 150 | 1.2K *(cap)* | T0 20 · T1 200 · T2 1.2K |
| Grain-store / valley defended (DEFEND quest) | Arms | 20 *(cap)* | 200 *(cap)* | 1.2K *(cap)* | T0 20 · T1 200 · T2 1.2K |
| First *shinden* plot recorded | Estate (LAND) | 30 | — | — | T0 32 |
| Recorded seasonal yield milestone | Estate (LAND) | 16 | 130 | 1.3K | T0 32 · T1 320 · T2 2.4K |
| Debt tranche cleared → solvency step | Estate (TREASURY) | 26 | 200 | 2K | T0 32 · T1 320 · T2 2.4K |
| Sealed trade contract *(TRADE strand — ≤⅓ capped; opens T1)* | Estate (TRADE) | **— (no T0 trade)** | 90 | 900 | T1 320 · T2 2.4K |
| Office granted / bailiff duty / dispute arbitrated | Office | — | 60 | 1.3K | T1 80 · T2 2K |
| Valley allied / rival eclipsed | Office | — | 80 *(cap)* | 2K *(cap)* | T1 80 · T2 2K |
| Lord's recognition / off foreclosure list | Name | 20 | 160 | 1.0K | T0 40 · T1 400 · **T2 1.12K** *(0.04·28K)* |
| Sponsored rite / inspector's favourable report | Name | — | 180 | 0.8K | T0 40 · T1 400 · **T2 1.12K** *(0.04·28K)* |

**Deed-count sanity — the itemizations that PROVE the 70 % share lands the GOOD band.** Each revealed pillar's
deed inventory below sums **exactly** to 70 % of that pillar's **good** band (§4.1), within ~20–35 recognised
deeds, every base ≤ its cap. (The residual 30 % comes from the seasonal stream, §4.2.2.) **These deeds accrue in
PHASE 2 only** (post-final-rung), so their **cadence is read within the Phase-2 window** (~5 min/act at T0 ·
~8 min at T1 · ~13 min at T2), **not** spread across the whole tier.

**T0 — good-band 70 % = 560 ip Estate / 350 ip Arms (NO trade strand):**
- **Estate (560 ip, 26 deeds — LAND + TREASURY only):** **LAND** = 1 *shinden* (30) + 12 yield milestones
  (12×16 = 192) = 222; **TREASURY** = 13 solvency steps (13×26 = 338) = 338 → **222 + 338 = 560** ✔.
  *(No trade contracts at T0 — the LAND/TREASURY counts above absorb that ip.)*
- **Arms (350 ip, 30 deeds):** 20 minor clears (20×8 = 160) + 5 road-clears (5×18 = 90) + 5 defends
  (5×20 = 100) = **160 + 90 + 100 = 350** ✔.
- **Cadence (within T0's Phase-2 window):** ~26 Estate + ~30 Arms recognised deeds at **~5 min/act**.

**T1 — good-band 70 % = 5,600 ip Estate / 3,500 Arms / 1,400 Office (trade strand now OPEN):**
- **Estate (5,600, 35 deeds):** 9 yield (9×130 = 1,170) + 19 solvency (19×200 = 3,800) + 7 trade
  (7×90 = 630) = **5,600** ✔ (trade = 630 ip = **11.25 %** of the Estate deed-ip — well under ≤⅓, §4.2.3).
- **Arms (3,500, 35 deeds):** 25 minor (25×70 = 1,750) + 5 road (5×150 = 750) + 5 defend (5×200 = 1,000) =
  **3,500** ✔.
- **Office (1,400, 20 deeds):** 10 granted (10×60 = 600) + 10 allied (10×80 = 800) = **1,400** ✔.

**T2 — good-band 70 % = 42,000 ip Estate / 21,000 Arms / 35,000 Office / 19,600 Name** *(Name is a real T2
gate — its 70 % = 0.70·28K = 19,600)***:**
- **Estate (42,000, 31 deeds):** 16 yield (16×1.3K = 20,800) + 7 solvency (7×2K = 14,000) + 8 trade
  (8×900 = 7,200) = **42,000** ✔ (trade 17.1 %).
- **Arms (21,000, 20 deeds):** 6 minor (6×700 = 4,200) + 7 road (7×1.2K = 8,400) + 7 defend (7×1.2K = 8,400) =
  **21,000** ✔.
- **Office (35,000, 21 deeds):** 10 granted (10×1.3K = 13,000) + 11 allied (11×2K = 22,000) = **35,000** ✔.
- **Name (19,600, 21 deeds):** 14 recognition (14×1.0K = 14,000) + 7 sponsored rite
  (7×0.8K = 5,600) = **19,600** ✔ (every base ≤ the **0.04·28K = 1.12K** cap; the residual 30 % = 8,400 is the
  seasonal stream, §4.2.2). Name's deed inventory accrues in **Phase 2**, post-G7, like every other pillar.

Every line above sums to exactly **70 %** of its **good** band (the residual **30 %** is the seasonal stream,
§4.2.2). The **great/excellent** bands are reached by **the same small capped deeds, done more often** in the
specialised pillars (§4.1). **There is NO fixed quest-type / deed-type budget** — the inventory above is the
*minimum* that ties out; more and more-interesting recognised deeds are welcome, especially at later tiers, and
any added deed still obeys the per-event cap and ties out to the gate.

**Levers:** `PER_EVENT_CAP_FRACTION` *(0.04 — a small cap is the locked direction)*; each deed's per-tier base
value; the deed→tier scaling (~**9–10×** per tier within a deed class,
≈`TIER_MAG`, with the seasonal stream supplying the residual 30 %); the **great/excellent specialisation
deed-counts** above the good baseline.

### §4.2.2 Seasonal JUDGED RESULT — the reckoning formula (high-water-mark only)

**Shape (canon — fixed).** On each **reckoning** the scheduler (§2.2/§6.3 hook) computes a **judged score**
per pillar from *accumulated state*, and **raises the pillar only if the score exceeds its stored
`highWater`** — then sets the pillar to that new score (Δ = newScore − highWater) and records the new
high-water mark. If the score does **not** beat the high-water mark, **nothing accrues** (no maintenance
trickle). Autumn is the headline (harvest), and **all revealed pillars are appraised each reckoning.**

> **The same reckoning RE-ASSESSES the koku STANDING (§4.0b).** `seasonalJudge` is also where the House's
> **koku standing** is re-assessed: the reckoning re-expresses the aggregate four-pillar Influence into the
> single kokudaka-like koku score (the ladder of §4.0b), which is **never spent** and only ever **gates
> ascension**. Koku standing tracks the pillars but is **not** one of them and **not** a resource — it is the
> outward *rank* the world reads. A big **"the assessors arrive"** event confirms the new standing at each tier
> jump. (Koku standing is immune to combat loss — the loss-bite is on carried **coin/rice**, §4.6.6b, never on
> standing.)

> **Cadence is a LEVER, not the shape.** The *shape* above is canon; how OFTEN a reckoning fires is a per-tier
> lever. In the compressed **T0** tail a full **28-day season never turns** inside the ~5-day Phase-2
> deed-grind, so T0 reckons on the shorter **`PHASE2_JUDGE_INTERVAL_DAYS`** (~3 d) — tuned ≤ the grind's
> day-span so a reckoning is actually felt. **T1+, when Phase 2 is a long game, scales the reckoning back toward
> the real season.** The 28-day `season()` **calendar** is unchanged — only the JUDGE cadence decouples from it.

> **Phase reconciliation.** The seasonal pillar **CREDIT posts only in PHASE 2** (deeds-gated; pillars do
> not accrue in Phase 1). The *basis* (the house's holdings — land reclaimed, treasury, secured danger) grows
> across the **whole tier** via labour (Phase 1 builds the holdings; the appraisal merely doesn't *credit* the
> pillar yet), so when Phase 2 opens the basis is already near band-top and the Phase-2 appraisals post the
> accumulated seasonal share quickly (a large first high-water jump, then diminishing). Seasons still **tick in
> Phase 1** for weather/festival flavour; they just don't move pillars there. The worked 8-season tie-out below
> reads as the appraisal sequence as the basis ramps to band-top.

```
// 1. Read the pillar's raw judged basis from accumulated state (domain-specific, any scale).
rawBasis = b_pillar(accumulatedState)
// 2. NORMALIZE by the tier reference magnitude so the basis is O(1) at the GOOD band-top.
fracBasis = clamp( rawBasis / TIER_REF[pillar][tier], 0, 1 )
// 3. Sub-linear (sqrt) shaping AFTER normalization, so f_pillar ∈ [0,1].
f_pillar  = sqrt( fracBasis )                                   // integer-pow / whitelisted sqrt only (§6.1)
// 4. The seasonal score; JUDGE_K is the pillar's seasonal ip budget for this tier (see back-solve below).
seasonalScore = JUDGE_K[pillar][tier] · f_pillar
if seasonalScore > influence[pillar].highWater:
    Δ = seasonalScore - influence[pillar].highWater
    influence[pillar].value    += Δ
    influence[pillar].highWater  = seasonalScore   // up-only; never decreases here
```

> **The seasonal basis is DIMENSIONALLY CONTROLLED for every pillar.** An **explicit named normalizer
> `TIER_REF[pillar][tier]`** (a reference magnitude = the pillar's **good** band in that tier, in the basis's
> own units) is applied to **all revealed pillars** *before* the `sqrt` shaping, so every `f_pillar ∈ [0,1]` and
> reaches **1.0 only at the good-band-top**. With `f` bounded in [0,1], the seasonal stream is bounded and
> back-solvable (below).

Where `b_pillar(state)` reads the house's *current standing* in that domain (a slowly-growing function of
holdings, not a per-action counter), and `TIER_REF` is its band-top reference (in the basis's own units):

| Pillar | `b_pillar(state)` — raw judged basis | `TIER_REF[tier]` (basis units; the normalizer) |
|---|---|---|
| **Arms** | `securedNodeCount · avgClearedDanger + retinueReadiness` (a "secured-danger" index) | T0 `ARMS_REF` · T1 10·ref · T2 100·ref (the secured-danger reachable at each good-band) |
| **Estate & Wealth** | `landReclaimed + treasurySolvency + min(tradeIndex, ⅓·estateTotal)` (an estate-value index over rice-producing land + coin treasury; **no trade term at T0**) | T0 `ESTATE_REF` · T1 10× · T2 100× (the estate-value index reachable at each good-band) |
| **Standing & Office** | `officesHeld·officeWeight + alliancesSealed·allianceWeight` (a standing index) | T0 — *(Office not revealed)* · T1 `OFFICE_REF` · T2 10× |
| **Name & Honour** | `armsHW + estateHW + officeHW + deedsPatronageBonus` (reflects the other three + deeds) | `TIER_REF_NAME[tier] = armsGood + estateGood + officeGood` (T1 = 15K · T2 = 140K) |

> **Name uses the SAME scheme as every other pillar.** Its normalizer is the **explicit**
> `TIER_REF_NAME = armsGood + estateGood + officeGood` (so `f_Name = sqrt((armsHW+estateHW+officeHW) /
> TIER_REF_NAME) ∈ [0,1]`), and its seasonal budget is the same back-solved `JUDGE_K[Name][tier]`. There is
> **no** magic `JUDGE_NAME_BLEND` scaler — the effective Name coefficient is `JUDGE_K[Name][tier] /
> TIER_REF_NAME[tier]`, fully explicit and intended.

**Back-solving `JUDGE_K` (so each pillar's seasonal stream = exactly 30 % of its GOOD band).** Because the basis
is monotone-rising over the tier and `f_pillar` is normalized to reach **1.0 at the good-band-top (the tier's
final season)**, the **cumulative high-water seasonal gain** telescopes to `JUDGE_K · max(f) = JUDGE_K · 1`. So
the back-solve is exact and dimensionless:

```
JUDGE_K[pillar][tier]  =  SEASONAL_SHARE · goodBand[pillar][tier]          // SEASONAL_SHARE = 0.30
```

i.e. `JUDGE_K` **is** the pillar's seasonal ip headroom this tier — one constant (`SEASONAL_SHARE = 0.30`)
applied to the §4.1 **good-band** table. (**Name & Honour is a real gated pillar at T2**, so — exactly
like every other pillar — its seasonal budget is **`0.30 · its own good band` = 0.30·28K = 8.4K** at T2. Its
*basis* still normalizes against `TIER_REF_NAME = armsGood + estateGood + officeGood` (T2 = 140K) because the
Name basis is the derivative roll-up of the other three; the **8.4K ip budget** comes off Name's own 28K good
band, not off `TIER_REF_NAME`. At **T1 Name is NOT yet revealed/gated**, so its T1 0.30 is taken of its
reference `TIER_REF_NAME` = 15K = 4,500 — a pre-reveal basis-credit, not a gate.)

| `JUDGE_K[pillar][tier]` = 0.30 · goodBand (Name: 0.30 · `TIER_REF_NAME`) | T0 | T1 | T2 |
|---|---|---|---|
| **Arms** | **150** | **1,500** | **9,000** |
| **Estate & Wealth** | **240** | **2,400** | **18,000** |
| **Standing & Office** | — (not revealed at T0) | **600** | **15,000** |
| **Name & Honour** | — (not revealed) | **4,500** *(pre-reveal; 0.30·TIER_REF_NAME)* | **8,400** *(gated: 0.30·28K good band)* |

The **`sqrt`** shaping is deliberate: each pillar's judged score grows **sub-linearly** in raw holdings, so
doubling your land does *not* double the appraisal — the high-water mark advances in **diminishing, earned
steps**, and the **autumn headline** (Estate gets a ~12 % harvest bump to its basis on autumn seasons) is the
one most likely to set a fresh mark. **Seasonal results supply the SMALLER ~30 % of pillar growth; deed jumps
(§4.2.1) supply the punchy ~70 % foreground.**

**WORKED 8-SEASON TIE-OUT (proves each `JUDGE_K` lands the seasonal stream on exactly 30 % of its good band).**
The basis fraction `rawBasis/TIER_REF` ramps from ~4 % (first appraisal) to **100 %** (final appraisal, as the
basis reaches the good-band-top); Estate's autumn seasons (**3 & 7**, marked Au) carry a ~12 % harvest bump.
`f = sqrt(frac)`; score `= JUDGE_K·f`; Δ accrues only on a new high-water mark; the **accumulated** column is
the running cumulative seasonal ip. Each table ends at exactly **30 % of the good band** (because `f` ends at
1.0 ⇒ cumulative = `JUDGE_K`). Seasons read Sp→Su→**Au**→Wi ×2 (Au = autumn headline).

*T0 Estate — `JUDGE_K = 240`, target 30 % of good-band 0.8K = **240 ip*** ✔

| season | basis% | f | score | Δ | accumulated |
|---|---|---|---|---|---|
| 1 Sp | 4 % | 0.200 | 48.0 | 48.0 | 48.0 |
| 2 Su | 18 % | 0.421 | 101.0 | 53.0 | 101.0 |
| 3 **Au** | 31 % | 0.561 | 134.5 | 33.5 | 134.5 |
| 4 Wi | 51 % | 0.711 | 170.7 | 36.1 | 170.7 |
| 5 Sp | 59 % | 0.767 | 184.1 | 13.5 | 184.1 |
| 6 Su | 73 % | 0.852 | 204.5 | 20.3 | 204.5 |
| 7 **Au** | 86 % | 0.929 | 222.9 | 18.5 | 222.9 |
| 8 Wi | 100 % | 1.000 | **240.0** | 17.1 | **240.0** |

*T0 Arms — `JUDGE_K = 150`, target 30 % of good-band 0.5K = **150 ip*** ✔ (smooth ramp, no autumn bump):
season Δs 30.0 → 33.1 → 21.0 → 16.7 → 14.3 → 12.7 → 11.6 → 10.7, **accumulated = 150.0**.

The same scheme back-solves every revealed pillar at every tier (each ends on its 30 % target by construction):

| Pillar / tier | `JUDGE_K` | per-season accumulated (s1 … s8) | end = 30 % good-band |
|---|---|---|---|
| **T1 Estate** | 2,400 | 480 · 1,010 · 1,346 · 1,707 · 1,841 · 2,045 · 2,229 · **2,400** | **2,400** ✔ |
| **T1 Arms** | 1,500 | 300 · 631 · 841 · 1,008 · 1,151 · 1,278 · 1,393 · **1,500** | **1,500** ✔ |
| **T1 Office** | 600 | 120 · 253 · 336 · 403 · 460 · 511 · 557 · **600** | **600** ✔ |
| **T2 Estate** | 18,000 | 3,600 · 7,576 · 10,091 · 12,799 · 13,809 · 15,334 · 16,720 · **18,000** | **18,000** ✔ |
| **T2 Arms** | 9,000 | 1,800 · 3,788 · 5,046 · 6,047 · 6,905 · 7,667 · 8,360 · **9,000** | **9,000** ✔ |
| **T2 Office** | 15,000 | 3,000 · 6,313 · 8,409 · 10,078 · 11,508 · 12,778 · 13,934 · **15,000** | **15,000** ✔ |
| **T2 Name** *(gated; smooth ramp — derivative basis, no autumn bump)* | 8,400 | 1,680 · 3,536 · 4,712 · 5,645 · 6,443 · 7,157 · 7,804 · **8,400** | **8,400** = 30 % of 28K ✔ |

So at every tier — **including the gated T2 Name pillar** — the seasonal stream is **exactly 30 %**
of each **good** band, the deed inventory (§4.2.1) supplies the other **70 %**, and the two add to the §4.1
good band (Name: 8,400 seasonal + 19,600 deeds = 28K) — the locked 70/30 split, verifiable line-by-line.
*(The season-1 Δ is the largest because the high-water mark starts at 0; the **autumn** marks are
the diegetic headlines even when their numeric Δ is mid-pack — though Name, whose basis is the derivative
roll-up of the other three pillars, takes **no** autumn harvest bump. This tie-out is headlessly
regression-testable via §6.10.)* The **per-season hook also runs the §4.2.4 below-high-water dent-restore
branch** — a small seasonal restore lifting a dented value toward its untouched high-water *without* advancing
high-water.

**Levers:** `SEASONAL_SHARE = 0.30` (the one dial that sets the whole seasonal stream — its 30 % value realises
the LOCKED deeds-dominate split); `JUDGE_K[pillar][tier]` (the derived seasonal-ip table above = `SEASONAL_SHARE
· goodBand`); the **`TIER_REF[pillar][tier]`** normalizers (incl. `TIER_REF_NAME = armsGood+estateGood+
officeGood`) that make each `f_pillar` O(1) at good-band-top; the **autumn-basis bump** (~12 %); the exponents
inside each `f_pillar` (default `0.5`; lower = harsher diminishing returns). The high-water-mark rule, the
every-season cadence, the **phase-2-only credit**, **and the locked ≈30 %-seasonal / ≈70 %-deeds split
direction** are not free to invert; only the magnitudes that realise it are levers.

### §4.2.3 The trade ≤⅓ cap (HARD INVARIANT — not a lever)

**Shape (canon §1.6.1 — fixed, verifier-enforced §6.6).** Within Estate & Wealth's three sub-engines
(LAND / TREASURY / TRADE), the **TRADE strand's contribution is hard-clamped to ≤ ⅓ of the Estate & Wealth
pillar total**, applied at **every** accrual point (both jump and judged):

```
// WORKING FORM (non-circular — this is the implementation):
tradeAllowed = 0.5 · (land + treasury)
trade        = min( rawTrade, tradeAllowed )
estateTotal  = land + treasury + trade

// PROOF the working form yields trade ≤ ⅓ of the Estate total (the HARD INVARIANT):
//   at the cap, trade = 0.5·(land+treasury)
//   ⇒ estateTotal = (land+treasury) + 0.5·(land+treasury) = 1.5·(land+treasury)
//   ⇒ trade / estateTotal = 0.5·(land+treasury) / 1.5·(land+treasury) = 1/3   (exactly, at the cap)
//   below the cap trade is smaller, so trade/estateTotal < 1/3 always. ✔
```

A pure-trade run therefore maxes **~⅓ of one of four pillars** (≈ **8 %** of total House Influence) and can
**never carry a tier gate** (nor satisfy "good in ALL revealed pillars"). The signature *meibutsu* (**silk /
sericulture**, LOCKED) lives entirely inside this capped strand. **The ⅓ ratio is canon and NOT tunable**; the
*raw* trade yields feeding into it (§4.7) are levers.

> **Two clarifications.** **(1) T0 has NO trade strand at all** — the TRADE sub-engine opens at the **Village
> tier** (its market is the first). **(2) The §4.3.1 cross-pillar combos are computed AFTER this trade clamp AND
> are EXCLUDED from the trade-ratio denominator.** The `estateTotal` in the ratio above
> is computed **without** any combo-sourced ip, so a combo can **neither** push trade past ⅓ **nor** inflate the
> denominator to admit more raw trade — the §6.6 verifier proves a combo can neither breach ⅓ in either
> direction, nor write the deed-only `gateEligibleValue` that satisfies a required pillar (a narrow, no-leakage
> exception). Trade ≤⅓ stays a HARD structural cap regardless of combos.

### §4.2.4 Recoverable DENTS (up-only with minor, scripted, per-pillar dips)

**Shape (canon §1.6.2 — fixed).** Up-only **except** rare, scripted, **per-pillar** dents (scandal→Name, called
debt→Estate, lost battle→Arms), **MINOR & quickly recoverable**, **never a wipe**, and the dent **never touches
`highWater`** (so it self-heals as play resumes the appraisal).

A dent removes **`DENT_FRACTION = 0.10`** of the *current pillar `value`* (max one dent active per pillar).
**Dent self-heal — the below-high-water restore branch:** the per-season hook
(§4.2.2) regrows a dented `value` back toward its **untouched `highWater`** at a small seasonal restore rate
**WITHOUT advancing `highWater`** — so the dent **self-heals within ~1–2 seasons** ("never a wipe, never
over-credits"). Dents are scripted story beats only (a finite authored list per tier), **never**
procedural/random.

**Levers:** `DENT_FRACTION` (default 0.10); the seasonal restore rate (clawed back within ≤2 seasons); the
authored dent list per tier (count & which pillar). The "never a wipe / never below 0 / never touches highWater
/ recoverable in ≤2 seasons" rules are **canon.**

---

## §4.3 Pillar conversion weights (labour / combat / office / deeds → pillar gains)

**Shape (canon — fixed).** Each *protagonist domain* funnels into **one primary pillar** via the accrual
shapes above; there is **no cross-pillar leakage except** the explicit roll-ups (Name reflects the other
three; trade folds into Estate under the ⅓ cap) **and the narrow T2 cross-pillar combos (§4.3.1, computed
post-clamp, excluded from the gate-check).** Skills/levels never grant Influence **directly** — they make the
*recognized deed* more achievable (§2.7d). The "weights" below are the **multipliers applied to a deed's base
value** based on *how well it was performed* (quality/scale), then capped per §4.2.1.

> **`combatLevel` = the single combat-fed CHARACTER level.** The `combatLevel` term below is the **one**
> combat-fed character level (§4.6.5) — not a separate concept, never raised by labour or deeds. **The bounded
> labour→combat per-skill perk is a SEPARATE additive channel (`skillCombatBonus`, §4.5.4), NOT a §4.3
> conversion weight** — §4.3 still routes deeds→pillars with **no skill/level→Influence-direct edge**.

| Domain → pillar | Conversion weight (multiplier on deed base) | Notes |
|---|---|---|
| **Combat** → **Arms** | `1.0 + 0.05·(characterLevel) + 0.10·(dangerRingClearedAbove)` | scale of the threat clears more Arms; **per-event cap (0.04) still binds** |
| **Labour (LAND/TREASURY)** → **Estate** | `1.0 + 0.04·(skillLevel of the labour skill)` | better farmer → bigger recorded yield jump (still capped at 0.04·good-band) |
| **Trade** → **Estate(trade strand)** | `1.0 + 0.04·(tradeSkill)`, then **⅓-clamped** (§4.2.3) *(trade opens at the Village tier; no T0 term)* | silk *meibutsu* graded quality raises the raw, both caps still bind |
| **Office/admin** → **Standing & Office** | `1.0 + 0.06·(officeRank) + 0.15·(allianceSealed?1:0)` | alliances (incl. the marriage/adoption lever, a later-tier feature) weigh heaviest |
| **Recognition/deeds/patronage** → **Name** | `1.0 + 0.25·((armsHW+estateHW+officeHW) / TIER_REF_NAME)` *(normalized by the same explicit `TIER_REF_NAME` as §4.2.2)* | Name is *derivative* — it lags the other three by design |

**The marriage/adoption lever (a later-tier feature):** a one-time **alliance** deed with an unusually large
base (roughly **a full per-event cap** into *both* Office and Name simultaneously) — the real late-game lever.
Its numbers are detailed with the later tiers.

**Interaction with the locked deeds-dominate split.** These multipliers grow a deed's *base* with how well
it was performed, but **every result is still clamped by the §4.2.1 per-event cap of 0.04**. So even a
high-skill master cannot turn one deed into a spike — the cap keeps growth in the *many-small-acts* regime
the human locked. The conversion weights therefore tune **which deeds feel rewarding to specialise in** (and
which pillars are easiest to push to great/excellent, §4.1), not the overall deeds-vs-seasonal balance (that's
fixed by §4.2.1/§4.2.2 sizing).

**Levers:** the per-domain coefficients (the `0.04`–`0.25` multipliers). The **structural routing** (which
domain → which pillar, no cross-feed except the named roll-ups + the §4.3.1 combos, Name-as-derivative) and the
**deeds-dominate split** are **not levers**; the coefficients that realise them are.

### §4.3.1 Cross-pillar combos — the T2/T3 anti-slump exception (PARTIAL at T2, FULL at T3)

**Shape (canon §1.6.1, §2.16 — fixed).** Cross-pillar combos arrive in **two waves keyed to pillar reveals**: a
**PARTIAL Office-pairs set opens at T2 (Village, when Office reveals)**, broadening to the **FULL 4-pillar set at
T3 (Region, when Name reveals)**. A recognised deed that **genuinely satisfies two domains at once** (a secured
road that is also a chartered office; a famed product that is also a treasury win) emits a small **cross-pillar
combo** bonus into **both** pillars of the pair — the late-game **anti-slump device**, paired with
seasonal-reward **rotation** (§2.16). It spans **multiple pillar pairs** with a **larger magnitude**, and is a
**narrow, no-leakage exception** to the §4.3 "one domain → one pillar" routing, fenced by four hard rules:

1. **Computed AFTER the trade-≤⅓ clamp (§4.2.3), and EXCLUDED from the trade-ratio denominator.**
   A combo's Estate component is added to the **already-clamped** Estate total **for display only**; the
   `estateTotal` used to compute the trade ratio (§4.2.3 denominator) is taken **without** any combo-sourced ip,
   so a combo can **neither** push the trade strand past ⅓ **nor** inflate the denominator to let *more* raw
   trade in — it cannot bend the cap in **either** direction (verifier-proven, §6.6).
2. **Counted INSIDE the deeds budget + the 0.04 per-event cap.** A combo is not free extra ip — each side is a
   capped deed-jump (≤ 0.04·good-band of its pillar), so the 70/30 split and the band tie-outs (§4.2.1) hold.
3. **EXCLUDED from the §4.1 gate-threshold check — combos never write the `gateEligibleValue` accumulator.**
   Each pillar carries a **deed-only additive `gateEligibleValue`** accumulator that
   **combos do NOT write**; the §4.1 gate ("good in ALL revealed pillars · great in 2–3 · excellent in 1–2") is
   evaluated against `gateEligibleValue`, so **combo-sourced ip is not counted** — a combo can **NEVER**
   substitute for being good/great/excellent in a pillar on its own merits. It raises the pillar's displayed
   `value` and smooths the *grind feel*, never the gate.
4. **Bounded as a rebate within the envelope.** A combo's two sides sum to **≤ one per-event cap total**
   (split across the pair), so the broadened magnitude stays inside the 70/30 + 0.04 envelope.

**The combo pairs — split by reveal wave:** the **PARTIAL set at T2 (Office reveals)** = **Arms × Office** (a
road secured *and* a route chartered) · **Estate × Office** (a chartered trade office); the set **completes at
T3 (Name reveals)** = **+ Estate × Name** (a celebrated *meibutsu*) · **+ Arms × Name** (a famed clearing that
burnishes the house). Each combo deed splits **≈0.02·good-band into each pillar** (≈ half a per-event cap each,
≤ one cap total). The **§6.6 verifier proves** a combo can never breach the ⅓ trade cap nor satisfy a
required-pillar gate.

**Levers:** which pillar pairs combo, the per-pair magnitude (within the ≤-one-cap envelope), the **two-wave
onset (Office-pairs at T2, the Name-pairs completing the set at T3)**. The **post-clamp computation, the
gate-check exclusion, and the ≤⅓-unbreachable proof** are **not levers** (canon).

---

## §4.4 The rich ATTRIBUTE system (STR / AGI / INT / SPD / LUCK)

**Shape (canon §2.7 — fixed).** Five interacting attributes, **stored as base values** (recompute effective on
load = base + gear + milestones, §6.4). Attributes start **near-mediocre** and rise only via the combat-fed
**character level** / milestones / gear (mediocre-start). Each attribute has **labour effects and combat
effects** so it is never a dump stat.

> **The cross-feed wall.** Attributes are **combat-fed only** — **labour skills never grant STR/AGI** (or any
> attribute that feeds a combat-derived stat). The one bounded exception is a **separate channel**: per-skill
> perks may add a small **`skillCombatBonus`** addend (NOT an attribute, NOT character level — §4.5.4). So the
> *attribute* math below is gift-free of labour; the small labour→combat polish lives entirely in
> `skillCombatBonus`. **The combat-fed character level (§4.6.5)** grants **+1 attribute point / 2 levels** + HP +
> satietyMax.

| Attr | Combat effect | Labour effect |
|---|---|---|
| **STR** (力) | `attackPower += 1.2·STR` (melee); `defense += 0.5·STR`; `hpMax += 2·STR` (§4.6.1); raises carry/durability damage | labour yield `+0.8%·STR`; hauling capacity `+2·STR`; lower stamina cost on heavy work |
| **AGI** (敏) | `evasion += 0.6·AGI`; `critChance += 0.2%·AGI`; hit-accuracy `+0.4·AGI` | gathering speed `+0.6%·AGI` (forage/fish); craft success `+0.3%·AGI` |
| **INT** (智) | `+0.5%` damage vs known bestiary entries; better stance/ability effects | craft quality `+0.7%·INT`; recipe unlock thresholds eased; office/admin deed weight `+0.5%·INT` |
| **SPD** (速) | `attackSpeed += 0.5%·SPD` (faster swings — see cadence §4.6.2); turn-order/first-strike | action tick-cost `−0.3%·SPD` (faster labour cycles, floored) |
| **LUCK** (運) | `critChance += 0.1%·LUCK`; `blockChance += 0.1%·LUCK`; rare-loot weight `+0.5%·LUCK` | better gather/forage rare-drop odds; market price-swing favourability |

**Starting attributes (mediocre-start contract):** all five start at **5** (out of an early soft-cap of ~30
by end-T0, ~80 by end-T2). The MC's only edge is *temperament* (narrative), **never a stat** (§1.4).
**Attribute points:** **+1 point every 2 character levels** (§4.6.5), plus milestone grants.

> **NO RESPEC IN v1.** Attribute-point allocations are **committed** — there is **no reset / re-spend lever**.
> Every point spent on STR/AGI/INT/SPD/LUCK is permanent; the build you grow is the build you keep. This makes
> the dual labour+combat purpose of each attribute load-bearing: because you can't undo a choice, no attribute
> may be a dump stat — which the §4.4 table already guarantees.

**Levers:** every coefficient in the table; starting value (5); points-per-level cadence; the soft-caps per
tier. The **five-attribute identity, the dual labour+combat purpose of each, the no-attribute-cross-feed rule
(distinct from the bounded `skillCombatBonus` channel), and the no-respec-in-v1 rule** are **not levers**.

---

## §4.5 Per-skill XP curves, per-event caps & milestone perks

**Shape (canon §2.7 — fixed).** Per-skill `total_xp` pools (stored), **levels derived** from a curve;
skills are **hidden until a small visibility threshold** (discover-by-doing); **per-event XP caps force
breadth** (no single action spikes a skill); **milestone perks** at thresholds; **plus a per-skill PERK track**
(§4.5.4). Lean core skills at T0; more unlock per tier — **this incremental per-rung/per-tier skill unlock is
itself the real bound** on the labour→combat cross-feed (you cannot front-load perks).

### §4.5.1 The XP→level curve

A standard incremental geometric curve, shared by all skills (one curve, per-skill *speed* differs):

```
xpForLevel(L)      = round( XP_BASE · XP_GROWTH^(L-1) )        // integer-pow by repeated multiply (no Math.pow; §6.1)
totalXpForLevel(L) = sum_{i=1..L} xpForLevel(i)
```

`XP_BASE = 50`, `XP_GROWTH = 1.18`. So L1→L2 costs 50 xp, L10 cumulatively ~**1.2K**,
L25 ~**17K**, L50 ~**1.1M** xp. **Visibility threshold** = a skill surfaces in the UI at **cumulative 30 xp**
(~one good session) so it reads as a discovery, not a pre-listed menu. **Soft level cap per tier**: T0 ≈
**L15**, T1 ≈ **L30**, T2 ≈ **L50** (you *can* exceed, but XP cost makes the next tier's content the efficient
path — this is what stops a player grinding T0 to god-tier).

### §4.5.2 Per-event XP caps (breadth-forcing)

```
xpGain = min( actionXp, PER_EVENT_XP_CAP_FRACTION · xpForLevel(currentLevel+1) )
```

`PER_EVENT_XP_CAP_FRACTION = 0.25` — **one action can advance a skill at most ¼ of the way to its
next level**, so leveling always takes **≥4 actions** and a lucky big harvest/kill can't one-shot a level.
This is the same per-event-cap discipline canon mandates for combat *and* Influence.

### §4.5.3 Milestone perks (the build web)

Milestones at **levels 5 / 10 / 25 / 50** per skill (lever). Perk magnitudes:

| Milestone | Typical perk | Example |
|---|---|---|
| **L5** | small flat stat or `+5%` skill efficiency | Farming L5: `+5%` rice/harvest |
| **L10** | a title (feeds Name flavour) + a recipe unlock **or** a small combat perk *(see the perk model below)* | Smithing L10 (labour): unlocks component-craft tier + a small `skillCombatBonus`; Swordsmanship L10 (combat): `+1 STR` |
| **L25** | a `×1.10` multiplier or a cross-skill XP bonus (`+5%` to a *sibling* skill) | Foraging L25: `+5%` XP to Cooking |
| **L50** | a `×1.25` capstone multiplier + a marquee unlock | Combat-weapon L50: stance slot / signature ability |

**No milestone ever reads a returning-memory or porter's-knot flag** (the no-hidden-edge guard, §1.4/§2.7c —
encoded at the type level). Cross-**skill** XP bonuses go skill→sibling-skill **only**.

> **The cross-feed callout — the bounded per-skill-perk model.** **Every skill (labour AND combat) carries a
> perk track** of **~2–8 perks** (or small flat bonuses) **unlocked by levelling that skill** (§4.5.4). A
> **labour-skill perk MAY include a small `skillCombatBonus`** — a **separate additive term, NOT an attribute
> and NOT character level**. The hard line: a labour-skill milestone **may not grant STR/AGI** (or any
> combat-feed *attribute*) — the bounded polish lives only in the `skillCombatBonus` channel, never in the
> attribute math. Only **combat-skill** milestones (weapon lines, conditioning's combat facet) may grant
> STR/AGI. So a milled-out labourer is **a little** more combat-capable, but **big combat power stays
> combat-only**, and the §6.6 verifier asserts **each perk magnitude is small/bounded** (per-perk smallness;
> §4.5.4). **Conditioning stays the ZERO-stat enablement gate** and the perk channel must never bypass it.

> **NO RESPEC IN v1.** Where a milestone offers a *choice* (a branch perk, a stance slot, a "pick one of two"),
> that choice is **committed** — there is **no reset / re-pick lever**. Skills still level freely by doing; a
> milestone *selection* once taken is permanent. Mirrors the attribute no-respec rule (§4.4).

### §4.5.4 Per-skill perk tracks — the bounded labour→combat channel

**Shape (canon §2.7.1 — fixed).** **Every skill** (labour skills included) carries a **perk / flat-bonus
track** — **~2–8 perks** per skill — **unlocked by levelling that skill.** Each perk may add a **small combat
bonus** through a **dedicated `skillCombatBonus` channel**, kept **off** the attribute/level math (it is summed
independently and applied to `attackPower` in the combat sim, §4.6.1). This is the **gift-vs-work** line, not
labour-vs-combat: nothing is *given* by birth/memory; reps *earn* small bonuses.

**Boundedness without a hard global cap.** Perks are **stackable with NO hard global cap**. They stay bounded
by **three soft levers** instead:

1. **Small per-perk magnitude** — individually tiny *(each combat-relevant perk adds ~`+0.5` to `+2` flat
   `attackPower`-equivalent, or a ~`+0.5%` to `+1.5%` modifier — see the table)*.
2. **Incremental skill unlock** — perks reveal **per rung/tier**, never front-loadable (the real bound;
   §2.7.1(b)/§4.5).
3. **Holistic enemy/drop scaling** — encounter difficulty is tuned against the *expected total* perk stack
   (gear/level/attrs/enemy-scaling grow together); the modest power-creep risk is **accepted**.

**Perk magnitudes:**

| Skill kind | Example perks (unlocked by levelling) | `skillCombatBonus` magnitude (each) |
|---|---|---|
| **Labour** (Farming, Foraging, Woodcut, Fishing) | "calloused grip" `+attackPower`; "long wind" `+stamina-in-fight` | `+0.5 … +1.5` flat `attackPower`-equiv (2–4 perks/skill) |
| **Crafting** (Smithing, Cooking) | "smith's eye" `+0.5%` crit; "field rations" `+satiety floor in combat` | `+0.5%` crit / small satiety-floor lift (2–4 perks) |
| **Combat / Weapon lines** | weapon-line milestones (the *primary* combat power) | the large combat power — **combat-only**, NOT this channel |
| **Conditioning** | **NONE — the ZERO-stat enablement gate (the one exception)** | **0** (it grants no combat stat; §4.6.1) |

**(The conditioning exception.)** **Conditioning** alone stays the **ZERO-stat one-way enablement gate** (the
weak→capable gate that *unlocks* the combat track) — it grants **no** combat stat or training-rate bonus, and
the `skillCombatBonus` channel must **never** become a back-door past it: conditioning (enablement) and
`skillCombatBonus` (small polish) are **orthogonal**.

**Verifier.** The §6.6 content verifier asserts **each `PerkDef.combatBonus` is small/bounded** (`0 < magnitude
≤ PER_PERK_MAX`, a small per-perk ceiling — *not* a single global aggregate cap) and that **conditioning's perks
are exactly 0** (§2.20).

**Levers:** the per-perk magnitudes; the per-skill perk counts (~2–8); the unlock-level cadence;
`PER_PERK_MAX`. The **conditioning-stays-zero rule, the separate-channel rule, and the no-attribute/no-level
routing** are **not levers** (canon).

---

## §4.6 The COMBAT math (idle auto-resolve)

**Shape (canon §2.8 — fixed).** Idle auto-resolve + active setup: prepare gear/stance/area → a **deterministic
seeded fight** resolves on a fixed-step sub-tick sim (one RNG, §6.7) → intervene with stance/ability/item/
retreat. **INCREMENTAL** (T0 opens combat with a single starter weapon; a growing roster on the combat-reveal
ladder, §4.6.9). **Mediocre-start preserved** (start near-zero; humbling near-fatal first fight; earned via
grind; conditioning the zero-stat gate). **Failure = soft setback** (HP/time, a bite of carried wealth, a
rest-off injury) — **never** lose levels/gear/permanent progress.

> **HP CARRIES between fights + heals by EATING.** A fight starts at the MC's **carried HP** (never reset to
> `hpMax`); the ONLY mend is eating (satiety) — there is **no auto-heal** (§4.6.1b/§4.6.6b), so HP retention is
> a **real between-fight resource**. This makes the **tank stance's lower damage-taken genuinely trade against
> the glass-cannon's higher damage — so NO stance is strictly dominated** and Balanced is no longer a trap
> (§4.6.10); a **"no stance strictly dominated" curve invariant** (§6.6) holds. **The 20–35 % SINGLE-fight
> win-rate band holds under HP-carry:** HP-carry shapes the *grind* (a run of fights), **not** the discrete
> first-fight moment — a **real foe is tuned into the 20–35 % band** at realistic durability/satiety, backed by
> a **RED-able foe-in-band test** (§4.6.6/§4.6.7). No re-expression of the first-fight criterion.

### §4.6.1 Combatant model & derived stats

The MC's effective combatant is derived from **attributes + the combat-fed character level + the equipped
weapon's archetype + the `skillCombatBonus` aggregate (§4.5.4) + gear**, then scaled by the **durability band**
(§4.6.1c), the **satiety `satietyRate`** multiplier (§4.6.1b), and the **active stance** (§4.6.10):

```
skillCombatBonus = Σ( unlocked per-skill perk combat addends )         // §4.5.4 — bounded, no global cap, conditioning = 0
attackPower  = ( weaponBase + 1.2·STR + gearAtk + 0.3·weaponSkillLevel + skillCombatBonus ) · stance.atkMod · satietyRate · durabilityBand(weapon)
attackSpeed  = weapon.baseSpeed · (1 + 0.005·SPD) · satietyRateSpeed   // PER-WEAPON baseSpeed (§4.6.9); lighter satiety touch
evasion      = 0.6·AGI + gearEva                                        // an evasion *rating*, not a flat %
accuracy     = 10 + 0.4·AGI + 0.3·weaponSkillLevel                     // an accuracy rating
defense      = ( gearDef + 0.5·STR ) · durabilityBand(armour)          // armour band applies identically
critChance   = 0.02 + 0.002·AGI + 0.001·LUCK   (cap 0.50)
blockChance  = gearBlock + 0.001·LUCK          (cap 0.40, requires a shield/guard)
hpMax        = 40 + 8·characterLevel + 2·STR + gearHp                  // characterLevel = the COMBAT-FED level (§4.6.5)
satietyMax   = SATIETY_BASE + SATIETY_PER_LEVEL·characterLevel         // base + per-level growth off the combat-fed level
// stance.atkMod scales the damage the MC DEALS; stance.takenMod scales the damage the MC RECEIVES (glass
// cannon > 1, tank < 1) — applied in the §4.6.3/§4.6.4 damage exchange. The glass-cannon↔tank axis is §4.6.10.
```

`SATIETY_BASE = 100`, `SATIETY_PER_LEVEL = 4`. Every `characterLevel` above is the **single combat-fed character
level** (§4.6.5 — the one curve; never raised by labour or deeds). `skillCombatBonus` is the **bounded**
per-skill-perk channel (§4.5.4); `satietyRate` / `durabilityBand` are **combat-only** scalers (below);
`stance.atkMod` / `stance.takenMod` are the glass-cannon↔tank stance mods (§4.6.10). **Conditioning contributes
ZERO** to any term here (the enablement gate only *unlocks* the track).

### §4.6.1b Satiety → combat throttle

**Shape (canon §2.3/§2.8 — fixed).** Combat is **satiety-throttled** ("eat before you fight"). A
**`satietyRate` multiplier** scales `attackPower` (a lighter `satietyRateSpeed` on `attackSpeed`) — a **SEPARATE
combat coefficient** from the labour `STAMINA_RATE_FLOOR` (§4.7.1), so the two tune independently:

```
satietyFrac = satiety / satietyMax
satietyRate = ( satietyFrac ≥ 0.7 ) ? 1.0
            : lerp( SATIETY_COMBAT_FLOOR, 1.0, satietyFrac / 0.7 )      // flat above ~0.7, knee down to the floor
SATIETY_COMBAT_FLOOR = 0.5     // a rate multiplier, never to zero
satietyRateSpeed = 0.5·(1 - satietyRate) + satietyRate                  // lighter touch on attackSpeed
```

**"Adequate satiety" = `satietyFrac ≥ ~0.7`** (`satietyRate = 1.0`). The **locked 20–35 % first-fight win-rate
is measured AT adequate satiety** (§4.6.6) — an underfed protagonist fares worse still. The throttle is
**bounded** so the floor only costs a few win-rate points (**never pushes win-rate below ~15 %**). **Levers:**
`SATIETY_COMBAT_FLOOR` (0.5), the 0.7 knee, the speed-touch weight. The **separate-
coefficient rule, the "win-rate measured at ≥0.7" reference, and the ≥~15 % floor** are **not levers** (canon).

### §4.6.1c Graded durability bands

**Shape (canon §2.8(b)/§2.10 — fixed).** Weapon `attackPower` is scaled by **4 graded durability bands**, and
**armour `defense` by the same bands**, with **FIXED wear per FIGHT** (cheap, replay-stable — not per swing):

| Band | durability fraction of `durabilityMax` | multiplier |
|---|---|---|
| Fresh | **≥ 75 %** | **1.0** |
| Worn | **≥ 50 %** | **0.9** |
| Battered | **≥ 1 %** | **0.75** |
| Broken | **= 0** | **0.55** |

`WEAR_PER_FIGHT ≈ 3 %` of `durabilityMax` per resolved fight. A weapon is **NEVER
auto-unequipped**: it stays equipped and functional even at 0 (the **0.55 floor**) — the MC is **never
weaponless** (auto-battler safety). **Repair / re-craft restores durability to max** (§2.10/§2.11). **Levers:**
the 4 band thresholds & multipliers; `WEAR_PER_FIGHT`. The **never-auto-unequip / never-weaponless rule, the
fixed-per-fight wear, and the band count** are **not levers** (canon).

### §4.6.1d Enemy (MobDef) derived stats — the `level → {attackPower, defense, HP}` rule

**Shape (canon §2.9 — fixed; required by the analytic win-rate).** §4.6.1 derives the MC's combatant fully;
**the enemy uses the SAME curve family**, derived from a single hand-tunable per-mob field **`MobDef.level`**
(§2.9). One linear-in-level rule per stat (mirroring the MC's `40 + 8·level` HP / STR-
scaled attack & defence shapes), so a fight is **two derived stat blocks** and the win-probability is computable
in **closed form** (no sampling):

```
// MobDef.level = L  (hand-tunable; DEFAULTS to the mob's dangerRing expected character-level — §2.9)
mob.HP          = MOB_HP_BASE  + MOB_HP_K ·L          // same family as hpMax = 40 + 8·characterLevel
mob.attackPower = MOB_ATK_BASE + MOB_ATK_K·L          // same family as the MC weaponBase + 1.2·STR block
mob.defense     = MOB_DEF_BASE + MOB_DEF_K·L          // same family as gearDef + 0.5·STR
mob.accuracy    = MOB_ACC_BASE + MOB_ACC_K·L
mob.evasion     = MOB_EVA_BASE + MOB_EVA_K·L
mob.attackSpeed = mob.baseSpeed · (1 + 0.005·MOB_SPD) // mob.baseSpeed = its archetype cadence (default 1.0)
mob.critChance  = MOB_CRIT      (default 0.02)        // mob.blockChance = MOB_BLOCK (default 0 — most beasts)
```

`MOB_HP_BASE = 24`, `MOB_HP_K = 8` (the MC's HP slope); `MOB_ATK_BASE = 8`,
`MOB_ATK_K = 3`; `MOB_DEF_BASE = 1`, `MOB_DEF_K = 1`; `MOB_ACC_BASE = 10`, `MOB_ACC_K = 2`; `MOB_EVA_BASE = 2`,
`MOB_EVA_K = 2`; `MOB_SPD = 0`, `MOB_CRIT = 0.05`, `MOB_BLOCK = 0`. **Defaults are set so the R3 first wolf
(`MobDef.level ≈ 2`, the R3 dangerRing's expected character-level; wolf `baseSpeed 1.3`) lands the LOCKED
20–35 % first-fight win-rate** (§4.6.6/§4.6.7) under the closed-form win-prob (§4.6.4b):

> **Worked R3 check (closed-form, no sampling).** Fresh MC (level 1, attrs 5, yari `weaponBase 3`, weaponSkill 0):
> `attackPower 9 · defense 2.5 · HP 58 · accuracy 12 · evasion 3 · attackSpeed 1.025 · crit 0.035`. R3 wolf
> (`level 2`): HP 40 · attackPower 14 · defense 3 · accuracy 14 · evasion 6 · attackSpeed 1.3 · crit 0.05. Then
> `DPS(MC→wolf) ≈ 4.17 → TTK ≈ 9.6`; `DPS(wolf→MC) ≈ 12.6 → TTK ≈ 4.6`; **`P_win(MC) = 4.6/(9.6+4.6) ≈ 0.32`**
> ✔ (in the 20–35 % band). After ~a season's training (attrs 10, weaponSkill 5, a forged blade + light armour,
> ~level 4) the same wolf gives **`P_win ≈ 0.86`** ✔ (the ~85 %+ comfortable band, §4.6.7).

Any `MobDef.level` may be hand-overridden per mob (a tougher named foe, a chip-damage swarm). **Levers:** every
`MOB_*` coefficient and per-mob `level`/`baseSpeed` override. The **same-curve-family rule** (so the analytic
win-rate is closed-form) is **not a lever** (canon).

### §4.6.2 Attack-speed cadence (PER-WEAPON baseSpeed)

Combat runs on an internal **sub-tick accumulator** (§2.8c). **`baseSpeed` is PER-WEAPON** — each weapon's
`baseSpeed` is its archetype identity (§4.6.9). A weapon's
`baseSpeed` swing fires per **20 combat sub-ticks at SPD 0**, scaled by `weapon.baseSpeed`; the `(1 +
0.005·SPD)` factor is 1.0 at SPD 0, ≈1.025 at the starting SPD 5; each point of SPD shaves cadence per the
`+0.5%·SPD` of §4.4. A typical T0 fight is **~6–12 swings** (a handful of real ticks). **Lever:** each weapon's
`baseSpeed` and the `0.005·SPD` coefficient set how twitchy-vs-grindy fights feel (canon: low-APM, strategic —
keep fights short).

### §4.6.3 Hit vs evasion, damage minus defence (with a floor)

```
hitChance = clamp( accuracy / (accuracy + evasion), 0.15, 0.95 )      // logistic; never auto-miss/auto-hit
rawDamage = attackPower · rngVariance(0.85 … 1.15)                    // seeded ±15% (combat RNG cursor, §6.7)
mitigated = rawDamage − defense                                      // PRE-floor; crit & block apply next (§4.6.4)
DAMAGE_FLOOR = max( 1, 0.10·attackPower )                            // chip damage always lands → fights end
```

The **damage floor** (`max(1, 10% of attackPower)`) guarantees even a heavily-armoured foe takes chip damage,
so a fight always resolves (no infinite stalemate) — the canon "damage minus defence (with a floor)". **The
floor is NOT applied here** — it is clamped on the **FINAL post-crit/post-block damage** in §4.6.4 (below), so a
block can never push final damage under the floor *or* a pre-floored value get re-inflated by a crit. Note
`attackPower` already carries the **durability-band × satietyRate** scaling (§4.6.1).

### §4.6.4 Crit / block — and the FINAL damage-floor clamp

```
on hit:  dmg = mitigated                                             // from §4.6.3 (rawDamage − defense, NOT yet floored)
         if rngChance(critChance)            → dmg ·= CRIT_MULT       (CRIT_MULT = 1.5)
         if defender rngChance(blockChance)  → dmg ·= (1 − BLOCK_REDUCTION)   (BLOCK_REDUCTION = 0.5)
         damage = max( DAMAGE_FLOOR, dmg )                            // CLAMP THE FINAL POST-MITIGATION DAMAGE
```
Crit and block are **separate seeded rolls** (§2.8c). **The damage floor is applied ONCE, LAST** — after both
crit and block have multiplied `mitigated` — so the chip-damage guarantee always holds on the value the
defender actually loses, and neither a block can drop the final hit below the floor nor a crit re-inflate a
floored value. **Levers:** `CRIT_MULT` (1.5), `BLOCK_REDUCTION`
(0.5), the chance caps (0.50 / 0.40). The **floor-applied-last ordering** is **not a lever** (canon).

### §4.6.4b Expected win-probability — ANALYTIC for the gate / fixed-seed SAMPLED (n=400) for the display

**Shape (fixed — the analytic/sampled split).** The win-rate is computed **two ways for two consumers:** the
**tier/gate threshold check is ANALYTIC** — computed
in closed form from the formulae above (no seed-set / N needed; deterministic by construction) — while the
**DISPLAYED win-rate** the player sees (and the §4.6.7 band guard-test asserts) is a **fixed-seed Monte-Carlo
SAMPLE (n = 400)** drawn from the same combat resolver (`combat.foeForecasts`). The codified invariant is
**displayed == tested == same-for-every-player**: one **fixed** seed for everyone, so the number a player is
shown is exactly the number the guard test asserts. With both combatants reduced to derived stat blocks
(§4.6.1 MC, §4.6.1d mob), expected damage-per-swing, time-to-kill, and the **analytic gate** win-probability are
all closed-form:

```
// expected damage X→Y per landed swing (E[rngVariance] = 1.0; crit & block in expectation; floored LAST per §4.6.4):
E_dmg(X→Y)  = max( DAMAGE_FLOOR_X,
                   (attackPower_X − defense_Y) · (1 + critChance_X·(CRIT_MULT − 1)) · (1 − blockChance_Y·BLOCK_REDUCTION) )
hitChance(X→Y) = clamp( accuracy_X / (accuracy_X + evasion_Y), 0.15, 0.95 )
DPS(X→Y)    = attackSpeed_X · hitChance(X→Y) · E_dmg(X→Y)            // expected damage per combat tick
TTK(X→Y)    = HP_Y / DPS(X→Y)                                       // expected ticks for X to kill Y

// closed-form win-probability for the MC (the "who reaches 0 HP first" race, normalised to [0,1]):
P_win(MC)   = TTK(mob→MC) / ( TTK(MC→mob) + TTK(mob→MC) )
```

`P_win(MC)` is **1.0** when the mob can never kill the MC, **0.5** at equal time-to-kill, and falls toward 0 as
the mob out-races the MC — a single monotone expression in the §4.6.1/§4.6.1d stats. This analytic `P_win(MC)`
is the **GATE-check** value. The **§4.6.7 DISPLAYED bands**, by contrast, are the **fixed-seed sampled (n = 400)
forecast** (`combat.foeForecasts`) evaluated at each combat-entry rung's intended MC stats vs the rung mob's
`MobDef.level`; the fun-proxy harness produces both, and the §6.10 regression asserts the **displayed (sampled)**
value the player sees is the value the guard test asserts (**displayed == tested == same-for-every-player**).
**Levers:** none here — both the analytic `P_win` and the fixed-seed sample are fully determined by the §4.6
stat formulae + the fixed seed; tuning happens on those inputs (`MOB_*`, gear, `MobDef.level`). The
**analytic-for-gate / fixed-seed-sampled(n=400)-for-display split** is **canon**.

### §4.6.5 On-kill rewards & the ONE combat-fed character-level curve (THREE-track separation)

**The single combat-fed character-level curve (defined ONCE here; referenced by §4.0.1/§4.4/§4.6.1).** A kill
writes **combat-XP** to `character.combatXp` only; the level is derived from cumulative combat-XP:

```
combatXpForLevel(L)      = round( CL_BASE · CL_GROWTH^(L-1) )          // integer-pow (no Math.pow; §6.1)
totalCombatXpForLevel(L) = sum_{i=1..L} combatXpForLevel(i)
//   level → drives: hpMax = 40 + 8·characterLevel (§4.6.1)
//                   satietyMax = SATIETY_BASE + SATIETY_PER_LEVEL·characterLevel (§4.6.1)
//                   +1 attribute point every 2 character levels (§4.4)
```

`CL_BASE = 60`, `CL_GROWTH = 1.18`. **This is the ONLY "level" concept in the game** — labour skills and pillar
deeds **never** raise it; no other section re-derives a "level."

**A kill writes exactly:**
- **Combat XP → the CHARACTER level** = `mobLevel · COMBAT_XP_K`, then per-event capped (§4.5.2). `COMBAT_XP_K =
  12`. **`mobLevel` = the explicit per-mob `MobDef.level` field** (hand-tunable; defaults ~ the
  `dangerRing`'s expected character-level; §2.9).
- **Skill XP → the equipped weapon line** (separately per-event capped).
- **It does NOT bump the rung-meter** (per-rung *curated activities* do that, §4.1.1) and **does NOT accrue a
  pillar deed** — **EXCEPT** a *recognized* clear/defend, which fires an **Arms** achievement jump (§4.2.1,
  per-event capped) **in Phase 2 only.** So grinding boars does **not** balloon Arms; the *recognized* road-
  cleared deed does — and only post-final-rung.
- **Loot** = one seeded roll on the mob's `LootTable` (§4.7.3); rare-tier weight scaled by `+0.5%·LUCK`.

This is the clean THREE-track separation (§4.0.1): **one kill → character-level XP (only); one recognised deed →
Arms (Phase 2); one curated rung activity → the Combat Rank meter** — the three sum independently (verifier-
asserted, §6.6). **Levers:** `CL_BASE`, `CL_GROWTH`, `COMBAT_XP_K`, `MobDef.level` defaults, the HP/satiety/
attr-point coefficients (§4.4/§4.6.1). The **combat-XP-only feed, the three-track separation, and the single
level curve** are **not levers** (canon).

### §4.6.6 The mediocre-start curve & the soft-setback-on-loss rule

- **Start near-zero, earned only by grind.** At R3 (first drills) the MC has weaponSkill 0, attributes 5, the
  single starter weapon (a **yari**, `weaponBase ≈ 3`; §4.6.9), `skillCombatBonus ≈ 0`. The **humbling first
  fight** (a wolf, §2.8/§2.9) is tuned so a fresh MC wins only **~20–35 %** of the time **(locked —
  humbling-but-winnable, drives the player to train), measured AT adequate satiety
  (`satietyFrac ≥ ~0.7`, §4.6.1b)** — survivable by luck/stubbornness, never skill; meant to be *barely*
  survived, then motivate training (an underfed MC fares worse still). After ~a season of drills (weaponSkill
  ~5, attrs ~10, a smith-forged blade), win-rate against that same wolf is **~85 %+**. **Conditioning enters
  none of these numbers** — it is a one-way *enablement gate* only; and the first-fight numbers are measured
  **without heavy per-skill-perk stacking** (the small `skillCombatBonus`, §4.5.4, exists but is not yet milled
  out at R3). Under the longer saga (a FLOOR), "~a season of drills" is ~30–40 min of real R3 play — the climb
  from ~25 % to ~85 % is felt as *earned over real time*.
- **Soft setback on loss (locked):** a lost fight → MC drops to **1 HP** (not death), advances **~½ a day** of
  clock (the recovery), takes a **random light injury** (`InjuryState`, heals in ~**1–2 days** of rest, a small
  `−10%` to one stat meanwhile), and **drops a real bite of CARRIED wealth** (§4.6.6b: ~20% of carried coin +
  ~⅓ of carried materials/rice; **what's BANKED in the kura storehouse is SAFE**, §4.6.6c), **never equipped gear,
  never levels, never Influence, never koku standing** (the only Influence movement on a loss is a *scripted* Arms dent if the lost
  fight was a defence-deed, §4.2.4/§4.6.8). **Never** a level/gear/permanent loss. The **severity SHAPE** (1 HP +
  ~½-day + light injury + a **carried-wealth bite**, never permanent progress) is **locked**; the bite-fraction
  magnitudes are levers.
  **Levers (magnitudes only):** the bite fractions, injury severity/duration, the ½-day clock cost. The
  **first-fight win-rate target (20–35 %, at adequate satiety)** and the **soft-setback shape** are **locked,
  not levers.**

### §4.6.6b Unattended combat — accumulating HP + two auto-modes

**Shape (canon §2.8 — fixed).** Combat is **full-auto while the tab is open** (active-only), but **HP
ACCUMULATES** — it carries between fights and the ONLY mend is eating; there is **no auto-heal**. So a
foe that deals **≥1 damage** grinds you down across a run, and the **only** foe safe to auto-grind forever is a
**0-damage** one. The player owns the risk by picking, **per foe**, one of **two auto-modes**:

1. **Auto-fight (to the end).** Grind until you win or **die**. A lost fight is a real outcome (below).
2. **Auto-fight, retreat @20%.** Break off on a **turn** where HP drops **below `AUTO_RETREAT_FRAC` (~20%) of
   max** — a **per-turn** check, so a burst foe that one-shots you past the threshold still **kills** you (a
   killing blow is a loss, not a flee). A flee earns no reward and **no penalty**, but you're hurt and the
   **autopilot STOPS** (mend + re-engage deliberately).

**A lost fight (0 HP)** — the `applyGrindFight` loss path: the soft setback (§4.6.6: **1 HP**, ~½-day) **AND**
the **autopilot STOPS** (no auto-resume) **AND** you **drop a real bite of ALL THREE carried resources —
coin + rice + materials** (**ADR-113**) — `LOSS_COIN_FRAC` (~20%) of carried coin + `LOSS_MATERIAL_FRAC` (~⅓,
floored) of carried rice + materials. **What's BANKED in the kura storehouse (§4.6.6c) is safe.** Still **never** a level/gear/Influence/koku-standing loss. The autopilot stopping (not
auto-resuming) means the player **feels** the loss and chooses to recover, rather than the loop papering over
it.

**Levers (magnitudes only):** `LOSS_COIN_FRAC` / `LOSS_MATERIAL_FRAC` / `AUTO_RETREAT_FRAC`, the setback clock
cost. The **no-auto-heal / accumulating-HP rule, the two-auto-mode shape, loss-stops-the-autopilot, and
loss-bites-carried-but-not-banked** are **canon, not levers.** The combat log is **summarised** — one outcome
line per fight (the auto-grind fires it hundreds of times).

### §4.6.6c The kura storehouse — carried vs banked wealth

Wealth here means **coin + rice + materials** — it splits into **carried** (`state.resources` — on you, at RISK
on a lost fight) and **banked** (`state.banked` — sheltered in the kura storehouse, SAFE from the loss
penalty). *(Koku standing is **not** wealth — it is never carried, banked, or at risk; it is the assessed
prestige score of §4.0b.)* **Deposit/withdraw** move a
resource between the two; spending + earning use carried (banked is a safe reserve). **Banked coin stays
free/safe, but stored RICE now carries a cost** (spoilage / cap / holding fee — mechanism TBD, **ADR-118**), so
store-vs-sell is a real choice rather than a free hoard. **Deposit/withdraw are
gated to the kura node** — so banking your haul means physically returning home, and fighting far afield with a
full purse becomes the gamble. The risk/reward — bank before a risky fight, or carry it and chance the bite —
is the point.

### §4.6.6d T0 coin sinks — scarcity by design

The T0 coin economy is deliberately **tight** (scarcity is the default; the coin you earn selling rice stays
low through T0, rich only at T5). The sinks span all three directions: a **repair FEE** (`REPAIR_COIN_COST`
coin on top of wood — a **soft** fee, WAIVED when you can't pay, so combat upkeep bites but never softlocks),
the **kura-works ladder** (U1–U4 — the main coin sink + the yield flywheel), and a **capped provisioning shop**
where the player buys for his own character (a MINORITY lane — total spend ≤ ⅓ of the kura-works sink). *(Koku
standing is never a sink — it is not spent; it is re-assessed, §4.0b.)*

### §4.6.7 Win-rate bands — the 2nd pacing proxy

**Shape (fixed).** Beyond the §4.8 time floor, a second headless **fun-proxy** asserts the combat difficulty
curve at each tier's combat-entry rungs: **fresh-at-rung** (just reached, before that rung's intended
training/gear) should be **humbling** (~30–45 %, with R3's **20–35 %** the anchor), and **comfortable** after
that rung's intended training/gear (**~80 %+**), tightening slightly per tier. The **displayed** band values are
the **fixed-seed sampled (n = 400) forecast** (`combat.foeForecasts`); the **gate** check uses the **analytic
closed-form `P_win(MC)`** (§4.6.4b) — the **analytic-for-gate / sampled-for-display split**, with
**displayed == tested == same-for-every-player** — evaluated **at adequate satiety (≥~0.7)** *(the R3 anchor is
locked; the rest are tunable)*:

| Combat-entry rung | fresh-at-rung win-rate | after intended training/gear |
|---|---|---|
| **R3** (first fight, **T0** Estate-tutorial) | **20–35 %** *(the LOCKED anchor)* | ~85 %+ |
| **Sword-line opening** (**T1** Estate-full — first T1 combat-entry rung) | ~30–40 % *(humbling)* | ~80 %+ |
| **V2** (road-warden, **T2** Village — first HUMAN threat) | ~35–45 % | ~80 %+ |
| **V5** (sworn man-at-arms, **T2** Village) | ~35–45 % | ~80 %+ |
| **G1** (road-captain, **T3** Region) | ~30–40 % | ~80 %+ |
| **G5** (road-detail / Hanzaki, **T3** Region) | ~30–40 % *(survived, not won)* | ~75–80 % |

These are wired into the fun-proxy harness (§7) **alongside** the §4.8 pacing floor — together the two proxies
are the playable bar (not just "it compiles"). **Levers:** every band magnitude (mob stats, gear tiers,
`MobDef.level`). The **R3 20–35 % anchor** is **locked**; the rest are tunable.

### §4.6.8 Retreat resolution

**Shape (canon §2.8 — fixed).** Retreat is a **CLEAN escape valve**: you **keep HP + carried loot**, pay a
**modest clock cost**, and it **NEVER dents Influence.** Retreat costs ~**¼ day** of
clock (less than a loss's ~½ day) and no HP/loot penalty. **The one exception:** **abandoning a DEFEND /
defence-deed mid-fight counts as a *failed defend*** — the only Influence movement on a retreat — a small,
recoverable **Arms dent** (§4.2.4), never a wipe. **Levers:** the retreat clock cost. The **keep-HP/loot,
never-dents-Influence (except the abandoned-defend) shape** is **not a lever** (canon).

### §4.6.9 Weapon roster & archetype params + the combat-reveal ladder

**Shape (canon §2.8/§2.10.1 — fixed).** A **growing, period-appropriate weapon roster** spanning **3 archetype
LINES** (Spear / Sword / Staff-&-polearm). **T0 ships 3 weapons — the improvised carrying-pole (the start) + 2
more (at least one craftable)**; the roster grows **+3 at T1** and **+4 at T2** — **~9–10 weapons across v1**
(the crude **carrying-pole is a 0th IMPROVISED weapon**, not a line). Each weapon is an **archetype** — its
**per-weapon** `baseSpeed` / `reach` / `targetCount` / `attackProfile` — **+ a signature ability.** New weapons
are **FOUND and CRAFTED, never gifted**, and reveal **one at a time** on the combat-reveal ladder (no UI-dump).

> **Line → tier.** **Line 1 Spear = T0** (Estate-tutorial) · **Line 2 Sword opens at T1** (Estate-full) · **Line
> 3 Staff/polearm (Bō・Naginata・Kanabō・Tetsubō) = T2 (Village)** — so the roster is **complete by end-of-T2
> (Village)** and **T3 Region adds combat DEPTH, no new line.**

**The weapon table** *(authored consistently with §2.8/§2.10, the §3 reveal rows, and `content/items.ts`
§6.5)*:

| Weapon | Line | First reveal | `baseSpeed` | `reach` | `targetCount` | signature ability |
|---|---|---|---|---|---|---|
| Carrying-pole *(0th improvised)* | — | T0 convalescence | 0.80 | 2 | 1 | — *(no signature)* |
| **Woodlot axe** *(found/crafted 2nd)* | — *(found tool)* | T0 *(crafted; §3 R4–R5)* | 0.85 | 1 | 1 | — *(heavy bite, no signature)* |
| **Forged yari** *(Line-1 spear — the graduation weapon)* | 1 Spear | T0 *(§3 R3→R6)* | 1.00 | 3 | 1 | **Thrust-through** *(pierce — T1 ability slot)* |
| Kodachi *(short sword)* | 2 Sword | T1 | 1.25 | 1 | 1 | **Riposte** (counter on evade) |
| Uchigatana | 2 Sword | T1 | 1.10 | 2 | 1 | **Iai draw** (crit on opening swing) |
| Ōdachi *(great sword)* | 2 Sword | T1 | 0.90 | 2 | 2 | **Wide arc** (cleave 2) |
| Bō *(staff)* | 3 Staff | T2 *(Village)* | 1.20 | 2 | 1 | **Stagger** (applies slow) |
| Naginata | 3 Staff | T2 *(Village)* | 1.00 | 3 | 2 | **Reaping arc** (cleave + reach) |
| Kanabō *(spiked club)* | 3 Staff | T2 *(Village)* | 0.75 | 1 | 1 | **Crush** (block-break, defense shred) |
| Tetsubō *(iron club)* | 3 Staff | T2 *(Village)* | 0.70 | 1 | 1 | **Earthbreaker** (heavy single-target burst) |

Count: **2 line weapons in Line 1 by end-T0** (the starter yari + 1 more) plus the improvised pole = **3 T0
weapons**; **+3 at T1** (Line 2 Sword opens — Estate-full), **+4 at T2** (Line 3 Staff opens — Village) =
**10 weapons across v1** ≈ **9–10** ✔; **T3 Region adds no new line** (combat DEPTH). The improvised pole
carries a minimal archetype (slow, short, single-target) and **no** signature.

**The combat-reveal ladder (one reveal per beat).** Combat is a real **incremental progression surface**,
staggered one beat at a time (no R3 UI-dump):

| Beat (trigger kind) | What reveals |
|---|---|
| **R3** — combat rung | The **single starter weapon (yari)** + the **bare auto-resolve loop** + **retreat** + the **Bestiary** (character (combat) **level** begins). Combat stats start near-zero. |
| **R4** — loot→craft loop | **Graded weapon-durability bands** (§4.6.1c) surface with the simple Crafting loop + **Equipment/Inventory** (never auto-unequipped). |
| **R5** — combat rung | The **stance** slot. *(Curated combat activities feed the **Combat Rank** rung-meter; **Arms PILLAR deeds do NOT accrue yet** — Phase 2.)* |
| **First weapon-line L10 milestone** — weapon-skill milestone | The **ability + item** intervention slots. |
| **T1** *(Estate-full)* — combat rung | The **2nd archetype line (Sword)** opens on a Combat Rank rung-gate; **+3 weapons across T1.** |
| **T2** *(Village)* — combat rung | The **3rd archetype line (Staff/polearm)** opens; **+4 weapons across T2.** *(T3 Region adds combat DEPTH, no new line.)* |

Weapon **signature abilities** deepen at higher weapon-line milestones (richer signatures ~**L25 / L50**). These
feed the **three clean tracks** (§4.0.1), never one fused bar. **Levers:** the roster count & each weapon's
archetype params + signatures; the reveal-beat placement. The **T0 = pole + 2, the +3/+4 at T1/T2 cadence, the
3-line shape, the FOUND/CRAFTED-not-gifted rule, and one-reveal-per-beat** are **not levers** (canon).

### §4.6.10 The LIGHT ACTIVE LAYER — optional mid-fight intervention

**Shape (canon §2.8 — fixed).** **Auto-resolve stays the spine** (§4.6.6b — it fights everything, unattended):
the active layer is **optional**, for engaged players and hard fights, and **changes the closed-form inputs
(§4.6.4b), never replaces the auto-resolve.** Three lightweight, low-APM interventions (no twitch-combat —
strategic, not reflex):

- **(1) Stance** *(set BEFORE the fight or swapped mid-fight; the slot reveals at R5 — §4.6.9).* A stance sits on
  the **glass-cannon ↔ tank** axis — **damage dealt vs damage taken** — applying its `stance.atkMod` (dealt) and
  `stance.takenMod` (taken) to the §4.6.1 combatant model. Three default stances: **Aggressive** (glass cannon —
  `atkMod 1.35`, `takenMod 1.15`: deal more, take more), **Balanced** (`atkMod 1.0`, `takenMod 1.0` — the
  auto-resolve default), **Defensive** (tank — `atkMod 0.80`, `takenMod 0.85`: take less, deal less). Weapon
  **wear is NOT the stance axis** — it stays a plain durability mechanic (§4.6.1c). Swapping stance mid-fight
  costs **one swing's cadence** (no free instant swap). Because HP **carries between fights** (§4.6), the tank's
  lower damage-taken genuinely trades against the glass-cannon's higher damage — so **NO stance is strictly
  dominated and Balanced is no longer a trap pick.** This is a **canon curve invariant** (asserted by §6.6).
- **(2) Ability slot** *(reveals at the first weapon-line L10 milestone — §4.6.9).* A **timed** trigger of the
  equipped weapon's **signature ability** (§4.6.9 — e.g. *Iai draw* = guaranteed crit on the next swing;
  *Crush* = `−defense` shred on the target; *Stagger* = apply slow). On a **cooldown** (`ABILITY_CD ≈ 8 combat
  ticks`); if the player never triggers it, the auto-resolver fires it on cooldown at a sensible
  default — so it **helps, never punishes** the hands-off player.
- **(3) Item slot** *(reveals alongside the ability slot — §4.6.9).* A **consumable** mid-fight: a **ration**
  (restore satiety → lifts `satietyRate`, §4.6.1b), a **salve** (heal a chunk of HP), or a **whetstone**
  (restore a durability band, §4.6.1c). Each is a one-shot consumable on a short cooldown; the auto-resolver
  uses a held item automatically when HP/satiety crosses a low threshold.

**Net effect on the math.** Every intervention resolves to a **change in the §4.6.1 derived stats** (stance
mods, an ability's crit/defense/slow, an item's satiety/HP/durability restore), so the fight stays a
deterministic seeded sim and the **closed-form win-prob (§4.6.4b) still holds** for the chosen stance/loadout.
The §4.6.7 win-rate bands are computed for the **Balanced (default) stance**; active play only **improves** the
hard-fight odds. **Levers:** the per-stance mod magnitudes, `ABILITY_CD`, the item-slot effects/cooldowns, the
auto-resolver's default-trigger thresholds. The **auto-resolve-is-the-spine / interventions-only-help rule** and
the **low-APM (no twitch) constraint** are **canon, not levers.**

---

## §4.7 Producer / cost curves (gathering yields, crafting, late-game auto-producers, building costs)

**Shape (fixed).** **Auto-producers are a LATE-GAME feature (beyond v1)** (§2.5) and **ACTIVE-ONLY** (no offline
accrual) — v1's T0–T3 is the MC's own **active grind**, so for v1 the load-bearing curves are **gathering
yields**, **crafting costs/quality**, and **building/upgrade costs**. The genre-standard `cost = base · r^owned`
is used **only** for the late-game auto-producers and repeatable upgrades, **never** to fake an early idle
layer. **Yields are modelled already NET** of stamina/food/re-investment, which is why end-T0
*lifetime-produced* rice ≈ **21K** but *held* rice ≈ **18–19K NET** (§4.0a) — the gap is rice eaten / sold to
coin to fund the genuine **coin sinks** (the U1/U2/U3 kura-works, tools, craft inputs), not a hidden upkeep tax.

### §4.7.1 Gathering / labour yields (active — already NET)

```
weatherMod   = 1 + 0.10·( 2·deriveDayKeyed(seed,'weather',day) − 1 )   // STATELESS day-keyed ±10%, NOT persisted (§2.19/§6.7)
satietyFrac  = satiety / satietyMax                                    // satietyMax = SATIETY_BASE + SATIETY_PER_LEVEL·characterLevel (§4.6.1)
staminaRate  = ( satietyFrac ≥ 0.7 ) ? 1.0
             : lerp( STAMINA_RATE_FLOOR, 1.0, satietyFrac / 0.7 )      // flat above ~0.7·satietyMax, knee down to the floor
yieldPerAction = baseYield · (1 + 0.04·skillLevel) · toolMult · seasonMult · weatherMod · staminaRate
ticksPerAction = baseTicks · (1 − 0.003·SPD)                          (floored at 1)
```

**`STAMINA_RATE_FLOOR = 0.5`** — the **labour** rate multiplier, never to zero (modest drain per action;
rest/eat refills, §2.3). It is a **SEPARATE coefficient from the combat `SATIETY_COMBAT_FLOOR`** (§4.6.1b), so
labour-throttle and combat-throttle tune **independently**. The **±10 % weather/festival** modifier is a
bounded, **MECHANICAL** effect derived from a **stateless, day-keyed** `deriveDayKeyed(seed,'weather',day)`
helper (§2.19/§6.7) — it is **NOT stored** (only market-saturation persists), so two saves on the same day at
the same seed see the same weather.

*(base yields, rice/material per action — labour yields **rice** as its headline plus **a little coin**
directly, and the rice sells for coin at the season-swung price (below); the longer saga is paid in TIME at the
per-rung FLOOR, not in shrunk yields)*:

| Node | baseYield | baseTicks | toolMult range | season gate |
|---|---|---|---|---|
| Rake/farm rice (paddy) | 2 rice *(+ a little coin)* | 3 | 1.0 → 2.5 (sickle→fine tools) | grows spring/summer, **harvest autumn** |
| Forage *sansai* | 1 greens | 2 | 1.0 → 1.8 | spring/summer windows |
| Woodcut | 2 wood | 3 | 1.0 → 2.2 | year-round |
| Fish (ford) | 1 fish | 2 | 1.0 → 2.0 | year-round, peak autumn |
| Sericulture (silk) | 1 cocoon | 4 | 1.0 → 3.0 | **summer** (mulberry); **TRADE strand opens at the Village tier**, never T0 (§4.2.3) |

**Throughput tie-out (how these yields produce the §4.8 pacing).** A T0 rice action runs
`2·(1+0.04·skill)·toolMult` rice. At **R1** (skill ~1, crude tools 1.0) that's **~2.1 rice/action**; at **R7**
(skill ~12, fine tools 2.0) it's **~5.9 rice/action**. At the intended active pace, the *net rice throughput*
(already net of stamina/food/re-investment) rises across T0's rungs roughly: **R1 ~25 → R2
~35 → R3 ~40 → R4 ~60 → R5 ~80 → R6 ~110 → R7 ~150 rice/min** (combat rungs trade some labour minutes for loot
value; crafting/cash-crop rungs add value per action). Multiplying each by its rung's wall-clock minutes
(§4.8.1) gives **lifetime-produced rice over the T0 rung-climb ≈ 21K**, of which **~18–19K is HELD NET** at the
T0→T1 gate (after rice eaten / sold to coin to fund the U1/U2 kura-works + tools/craft — §4.7.5). **This
throughput table is the bridge between
the yields here and the rank-time table in §4.8.1; retune the `0.04·skillLevel` slope and tool multipliers,
never the per-rung time FLOOR, to fix pacing drift.**

**Seasonal headline:** the autumn rice harvest is a **`×3` season multiplier** on paddy yield (drives the
Estate judged-result high-water mark, §4.2.2 — the autumn appraisal is the one most likely to set a fresh
mark). **Levers:** every baseYield/baseTicks, the `0.04·skillLevel` and `0.003·SPD` coefficients, tool
multipliers, season multipliers, the autumn `×3`, `STAMINA_RATE_FLOOR` (0.5) and its 0.7 knee, the weather
`±10 %` band, and the **per-rung net-throughput assumptions** (§4.8.1). The **stateless-day-keyed weather
rule, the yields-already-NET model, and the separate labour/combat throttle coefficients** are **not levers**
(canon).

### §4.7.2 Crafting cost & quality (hybrid: simple → component)

- **Simple recipes (early):** flat `inputs → output`; cost a fixed small material bundle; success ~100 %.
- **Component recipes (T1+):** a **proper 0–1 quality SCORE** — a weighted blend of **each input normalised to
  [0,1]** (weights sum to 1, so **NO spurious divisor**) — then mapped to a quality tier:
  ```
  qualityScore = 0.4·norm(crafterSkill) + 0.4·avgComponentQuality + 0.2·norm(stationTier)   // ∈ [0,1], weights sum to 1
  //   norm(crafterSkill) = clamp( crafterSkill / SKILL_REF, 0, 1 )    // SKILL_REF = the skill's tier soft-cap (§4.5)
  //   norm(stationTier)  = stationTier / MAX_STATION_TIER             // station tier as a fraction of the best station
  //   avgComponentQuality already ∈ [0,1] (recursive — a component's own qualityScore)
  outputQualityTier = floor( qualityScore · QUALITY_TIERS )           // QUALITY_TIERS = 5 → tiers 0–5 (crude → masterwork)
  ```
  Each quality tier multiplies the item's stat/value by **`1.25^tier`** (integer-pow, no `Math.pow`; §6.1).
  Disassembly returns **~60 %** of materials. The weighted blend needs **no divisor** — the weights sum to 1, so
  the score is already in [0,1].

**Resource counts are UNBOUNDED** (no caps; K/M/B abbreviation reads them, §4.0) — **except stored RICE now
carries a cost** (spoilage / cap / holding fee — mechanism TBD, **ADR-118**), so a banked rice hoard is no longer
free/safe and store-vs-sell stays a real choice; **coin remains unbounded and safe.** **Coin exists from T0** (base
unit mon; higher denominations reveal later, §4.0a) — but the **market opens a real coin SINK from the Village
tier:** the market row lets the player **spend coin on market purchases and component-buying** (buying
inputs/finished components the trade strand needs) — a genuine ongoing coin *sink*, not a vestigial counter. The
**coin/market MAGNITUDES** — the **rice→coin sale price** (season-swung, §4.7.1), the per-purchase prices,
`MarketState` — are tunable (§2.4).
**Bulk sales** apply the **saturation damper PROGRESSIVELY per-unit** (each unit walks the price down — legible,
un-gameable; §2.4), feeding the trade strand under the ≤⅓ clamp (§4.2.3). **Levers:** the 0.4/0.4/0.2 quality
weights, `QUALITY_TIERS` (5) + the `SKILL_REF`/`MAX_STATION_TIER` normalisers, the `1.25^tier` value step, the
60 % disassembly return, the rice→coin sale price / per-purchase prices and the coin-sink magnitudes.
*(Crafting value-add is folded into the rising per-rung throughput, §4.7.1/§4.8.1.)*

### §4.7.3 Loot tables (seeded)

A mob/node drops on a weighted table; **rarity tiers common/uncommon/rare/fine** with default weights
**70 / 22 / 6 / 2** (rare/fine weight scaled by `+0.5 %·LUCK`), rolled on the **`loot` RNG cursor** (§6.7) so
drops replay byte-identically. **Levers:** the rarity weights and the LUCK coefficient. The **seeded-single-
cursor rule and the 70/22/6/… shape** are **not levers** (canon).

### §4.7.4 Auto-producers (beyond v1 — active-only, no offline; scaffold only)

```
cost(n)  = producerBase · PRODUCER_GROWTH^owned          (PRODUCER_GROWTH = 1.5, ~5× per few buys)
output   = producerBaseRate · (1 + 0.1·tier)             (per ACTIVE tick — NO offline accrual)
```

Gated on **Influence band + a LOW rank floor + cost** (NOT the capstone — §1.5.1 estate-growth rule), bound to
a `RosterMember` (a face, not a slider; §2.5). **All values parked until the later tiers are authored**; only
the **shape/`PRODUCER_GROWTH` scaffold** is fixed here.

> **The v1 "leave it running" feel is NOT an idle/offline layer.** v1's estate is a **fully active grind**; the
> "set it going and check the progress" texture comes entirely from **tab-open AUTO-RESOLVE combat + AUTO-REPEAT
> labour** while the tab is open and active (§2.8/§2.6) — **not** from offline accrual or early auto-producers
> (beyond v1, §2.5). Closing the tab pauses the world. This is the canon **active-only / no-offline** rule, and
> it is what makes the **budget-as-a-FLOOR** grind (§4.8) feel like an idler without being one.

### §4.7.5 Building / upgrade costs — the kura-works purchase ladder (U1–U4)

The estate advances through its narrative CONDITION stages (**E0 Foreclosure's Edge → E3 Prosperous** in v1;
E4–E5 stay parked for later tiers) by buying discrete **kura-works** (U1–U4) for **coin + materials** (the coin
funded by selling rice, §4.7.1). Each kura-work
gates on **Estate & Wealth (+ Arms for defensive works) + a LOW rank floor + cost** (§1.5.1 — never the
capstone; §2.17). The top kura-work (**U4 → raise the long-house**) folds into the later G-rungs as a coin/Arms sink (no new rung; a deeper flywheel step that does not advance the E-condition):

| Kura-work → condition reached | Gate (pillar floor + rank) | coin cost | material cost |
|---|---|---|---|
| — *(start: E0 Foreclosure's Edge)* | start | — | — |
| **U1 → E1 Stabilising** (kura patched, first *shinden*, drill yard, night-watch) | Estate ≥ 0.3K, rank ≥ R4 | 400 coin | 30 wood |
| **U2 → E2 Recovering** (granary, 2 workshops, low palisade, men-at-arms rota) | Estate ≥ 0.6K + Arms ≥ 0.3K, rank ≥ R6 | 2K coin | 120 wood, 40 stone |
| **U3 → E3 Prosperous** (3rd workshop + full granary, closed perimeter, standing 4–5-man rota, *shinden* reclamation paying out) | **Estate ≥ 40K + Arms ≥ 15K, rank ≥ G4** | **40K coin** *(staged across the river-works)* | **800 wood, 400 stone** *(+ corvée labour)* |

*(The `Estate ≥` / `Arms ≥` gates are Influence-pillar ip floors, the `rank ≥` gates are rung rank — neither is
koku standing, which is never a build gate; only the **coin cost** is a spendable price here.)*

**Affordability tie-out (vs the §4.7.1/§4.8.1 throughput).** **U1's 400 coin** falls due around **R4**, by
which point lifetime-produced rice ≈ **5.1K** — sold at the season price for ample coin, comfortably affordable
while the held NET rice balance keeps climbing. **U2's 2K coin** falls due around **R6**, by which point
lifetime-produced rice ≈ **13.3K**. After both T0 coin sinks (2.4K coin) plus tools/craft inputs, the T0→T1
gate holds **~18–19K rice NET** out of ~21K produced (§4.0a). **U3's 40K coin** falls due at **G4** (the
Kuzuhara river-works) — by which point T2 lifetime production is well into the **100K+** band (§4.0a), so U3 is
**paced to be reached, not trivially pre-bought**, and its **Estate ≥ 40K + Arms ≥ 15K floors sit BELOW the T2
good-bands** (Estate 60K / Arms 30K, §4.1) and its **rank floor G4 is far below the G7 capstone** — keeping
building gated on standing, never the capstone (§1.5.1).
**Levers:** every cost & pillar/rank floor above; the U3 staging (one lump vs the multi-stage *seki*).

---

## §4.8 PACING — the budget is a FLOOR, not a ceiling

These are the **playtest acceptance criteria** the numbers above are derived *backward from*; they are
headlessly regression-tested via the DEV play API (§2.20/§6.10) so a retune that breaks pacing fails CI.
Canon hard rules: **first action < 5 s**, **the next goal never balloons > ~2–3× the prior** (within a tier;
§1.2), and — a **FLOOR, not a ceiling** — **every grind rung takes ≥ ~30 min, a floor that BINDS FROM T1** (**T0
is a floor-exempt tutorial**; its pacing is the gentle ramp of §4.8.1). The per-tier Phase-1 climb FLOORS run
across the four v1 tiers **T0–T3**: **T0 floor-exempt**; **T1 ~5–8 h · T2 ~8–10 h · T3 sized so the four-tier
sum lands ≈28.5 h**. Difficulty stays **humbling THROUGHOUT incl. T0** (fast ≠ easy; the mediocre-start bite
stays within the winnable / soft-setback / no-dead-end guardrails). **The ≈28.5 h figure is the v1 PHASE-1 climb
FLOOR, NOT the total** — the FLOOR sum across the 4 v1 tiers T0–T3: the full **v1 saga ≈ ~60 h FLOOR = ~28.5 h
Phase-1 climb + a ~+32 h Phase-2 pillar-grind floor** (§4.8.1b/§4.8.4).

> **The ≥30-min floor is enforced on the RUNG-METER POINTS, not the wall-clock.** The runtime floor is the
> per-rung meter threshold (§4.1.1), back-solved so that **even optimal FOCUSED play cannot fill a rung's
> numeric-points objective in < 30 min** — the meter is the enforcement, the time follows. **Unfocused play**
> (multi-skilling, side-quests, off-objective wandering) takes **LONGER — ~60–120 min/rung**. The per-rung
> **wall-clock column** in the tables below is **EXPECTED real, somewhat-unfocused play — NOT a contradiction**
> with the 30-min focused-optimal floor: it sits *above* the floor by design.

> **These figures are FLOORS / MINIMUMS, not ceilings.** §4.8 is a **minimum-grind model**: the ≥30-min/rung
> floor and the per-tier hour figures are the **least** a player spends, and the **two-phase tier (Phase-1 rung
> climb + Phase-2 pillar grind) runs LONGER** than its Phase-1 climb FLOOR. The saga **can and should run
> longer** when content interleaves richly (a long, OSRS-rough grind you leave **auto-resolving / auto-repeating**
> and check on). The **pacing regression FAILS ON UNDERSHOOT ONLY** — a rung cleared *too fast* — **never on
> overshoot** (§4.8.4).

### §4.8.0 Headline beats

| Beat | Target | Lock status | How measured |
|---|---|---|---|
| **First action available** | **< 5 s** from load (rake spilled rice in the *kura*) | canon | time-to-first-interactable |
| **First meaningful reveal** | **< 30 s** (rice counter ticks → then the coin row lights its own panel, §3.1) | design intent | first `unlock` event |
| **Standing (koku) first revealed** | at the **first seasonal appraisal** (the `seasonalJudge` reckoning), confirmed by the **"the assessors arrive"** beat at tier jumps (§4.0b/§4.2.2) | design intent | first `seasonalJudge` / assessors event |
| **Per-rung minimum** | **≥ ~30 min per rung** *(a FLOOR — **binds from T1**; **T0 tutorial floor-exempt**, R0 cold-open exempt)* | **LOCKED — FLOOR (from T1)** | per-rung tick-count floor (undershoot fails) |
| **Humbling first fight (R3, T0)** | **~60–75 min** in (start of R3), **win-rate 20–35 % at adequate satiety (≥~0.7)** | **LOCKED anchor** | tick-count to the wolf + win-rate proxy (§4.6.6/§4.6.7) |
| **Win-rate bands** *(2nd fun-proxy)* | fresh-at-rung humbling (~20–45 %), comfortable after that rung's training/gear (~80 %+) — **at adequate satiety** | design intent (R3 anchor LOCKED) | the §4.6.7 win-rate-band harness |
| **Phase-1 climb — T0 Estate-tutorial** | **floor-EXEMPT** (the gentle ramp of §4.8.1) | tutorial — not floor-bound | tick-count to the T0 capstone (opens Phase 2) |
| **Phase-1 climb — T1 Estate-full** | **~5–8 h** *(FLOOR)* | **LOCKED — FLOOR (binds from T1)** | tick-count to the T1 capstone |
| **Phase-1 climb — T2 Village** | **~8–10 h** *(FLOOR)* | **LOCKED — FLOOR** | tick-count to the T2 capstone |
| **Phase-1 climb — T3 Region** | **~16 h** *(FLOOR — the widest tier, the v1 end-gate)* | **LOCKED — FLOOR** | tick-count to the T3 capstone (v1 end-gate) |
| **v1 Phase-1 FLOOR** | **≈ 28.5 h** *(the locked Phase-1 climb floor — the minimum; the four-tier climb runs at or above it)* | **LOCKED — FLOOR** | cumulative tick-count |
| **v1 TOTAL FLOOR** *(Phase-1 + Phase-2)* | **≈ ~60 h** *(≈28.5 h climb + ~+32 h Phase-2 grind; a minimum, runs longer)* | **LOCKED — FLOOR** | cumulative tick-count incl. Phase-2 |
| **Goal-to-goal step ratio** | **≤ 2–3×** between consecutive within-tier goals | canon | max ratio of consecutive costs |
| **Tier-to-tier step** | **~10×** (Arms/Estate) — a chapter, not a wall; Office steepens (~25× at T1→T2) | design intent | band-top ratio across tiers |
| **Side-faction speedup** | village+origin weaving **shaves ~10–15 %** off time-to-next-tier (felt, never required) | LOCKED | with/without multipliers |

### §4.8.1 ⭐ T0 PHASE-1 rank-by-rank pacing table (the centrepiece — all 8 rungs, full resolution)

**T0 is the FLOOR-EXEMPT tutorial** (Estate pillar only; combat-as-activity — the R3 first fight — lives here,
but the Arms pillar DEEDS bank only from T1). Its rungs escalate from a ~5-min cold open up to the ~55-min
capstone — a real but gentle ramp; the **≥30-min per-rung FLOOR (the CI acceptance gate) binds from T1**, and T0
is exempt from it.

This is the table the rest of §4 is tuned to satisfy. **It is the PHASE-1 rung climb** (§4.0.1/§4.1.1): each
rung promotes on an **AND-gate** — its **per-rung-reset rung-meter ≥ threshold** (fed by that rung's **curated
activities**, §4.1.1) **AND** its **story flags** (the UI reads "awaiting X" when one side lags) — **NOT** on
accumulating pillar deeds (those are **Phase 2**, §4.8.1b). Each grind rung's expected wall-clock escalates
toward the capstone, **summing to ≈4.5 h**. The **rice column is lifetime-produced** (the labour RESOURCE,
already NET, §4.7.1 — sold for coin to fund the sinks; rice is **not** a currency); the **meter threshold** is
in rung activity-points (§4.1.1); "throughput" is the
net rice/min from §4.7.1. *(The exact times, costs & thresholds are tunable; the ≥30-min floor — binding
from T1, T0 exempt — and the per-tier hour FLOORS are locked.)*

| Rung (what it gates — from §3) | Meter + story gate to LEAVE it (Phase 1) | Throughput | rice (rung) | ⏱ wall-clock |
|---|---|---|---|---|
| **R0 Stray** — cold open done; bare estate dashboard | *(story only — the cold open §3.1)*; meter n/a | n/a (tutorial) | ~0 | **~5 min** *(cold open)* |
| **R1 Day-labourer** — paddies, basic labour loop, world-clock | **Estate Service ≥ ~18** (rake/recover rice · clear forecourt · first paddy turns) + Genemon assigns real work | ~25 rice/min | ~0.75K | **~30 min** |
| **R2 Bonded hand** — Skills tab, foraging/woodcut/haul, near *satoyama* | **Estate Service ≥ ~19** (forage · woodcut · haul · stable chores) + first season turns | ~35 rice/min | ~1.05K | **~30 min** |
| **R3 Yard-hand under arms** — COMBAT LIVE; humbling first fight; drill yard, Bestiary, the starter **yari** | **Combat Rank ≥ ~17** (survive the **scripted** first wolf [a **guaranteed-survival** beat — win-or-soft-setback, the R3 story trigger] · drill reps · the **grindable** wolf/sparring + first pest skirmishes [where the **LOCKED 20–35 % win @ ≥0.7 satiety** is measured, §4.8.0/§4.6.7]) + drill-yard story | ~40 rice/min | ~1.2K | **~30 min** |
| **R4 Trusted hand** — Main House, domestic economy, **first *shinden* (U1)**, **loot→craft loop + durability bands** | **Estate Service ≥ ~17** (indoor errands · first *shinden* labour · craft a first tool) + invited to the Main House; **build U1 (400 coin)** | ~60 rice/min | ~2.1K | **~35 min** |
| **R5 Gate-guard** — Quest log + quest types; the **stance** slot | **Combat Rank ≥ ~17** (stand a watch · pest-control / hunt / clear sweeps) + posted to the gate | ~80 rice/min | ~3.2K | **~40 min** |
| **R6 Foreman of works** — Workshops/Granary (U2), proto-industry, **village tier seed** | **Estate Service ≥ ~15** (drive workshop/granary works · proto-industry shifts) + works commissioned; **build U2 (2K coin)** | ~110 rice/min | ~4.95K | **~45 min** |
| **R7 Bailiff** *(capstone → OPENS Phase 2)* — lord's study, four-bar Influence panel | **Estate Service ≥ ~14** (field-office duties · record the first reclamation) + the Lord's recognition — **the capstone OPENS the Phase-2 pillar grind (§4.8.1b)** | ~150 rice/min | ~8.25K | **~55 min** |

**Totals & checks (T0 Phase 1):** wall-clock **5 + 30 + 30 + 30 + 35 + 40 + 45 + 55 = 270 min = 4.5 h** ✔
(escalating ✔; T0 is exempt from the ≥30-min gate, which binds from T1). Lifetime rice produced ≈ **0.75K +
1.05K + 1.2K + 2.1K + 3.2K + 4.95K + 8.25K = 21.5K ≈ ~21K** ✔ (the **same round figure** as the §4.0a T0 band;
its coin sales clear U1@R4 and U2@R6 ✔; held ≈ **18–19K rice NET** at the gate after sinks). Consecutive within-rung *cost* ratios
stay ≤ ~2× (0.75K→1.05K→1.2K→2.1K…), honouring the ≤2–3× rule ✔. **No pillar deeds appear in this table** — the
~560 Estate / ~350 Arms deed-ip (§4.2.1) accrue **only in Phase 2** (§4.8.1b), which is what prevents the
"half the rungs, maxed deeds" state.

> **R0 is the ~5-min cold-open story rung** (the *kura* cold open, §3.1) — a scripted beat, not a grind rung,
> exempt from any per-rung floor.

### §4.8.1b PHASE-2 pillar-grind block (the deeds + seasonal grind, per tier)

When the **capstone rung opens Phase 2** (§4.0.1), the tier's **pillar DEEDS begin accruing** (§4.2.1) and the
**seasonal appraisals begin crediting** (§4.2.2) toward the **HYBRID good/great/excellent gate** (§4.1) across
the tier's **REVEALED pillars** (T0 = 2 · T1 = 3 · T2 = 4 — Name gated). The basis was **built across Phase 1**
by labour (holdings near band-top), so Phase 2's first appraisal posts a large high-water jump, then diminishes
(§4.2.2). **This grind is ADDED on top of the Phase-1 climb FLOOR** — the realisation of the budget-as-a-FLOOR
intent: the two-phase tier runs **longer** than its Phase-1 floor. Deed cadence is **tier-relative**
(~5 min/recognised act at T0 · ~8 min at T1 · ~13 min at T2), interleaved with the continuing auto-resolve /
auto-repeat loop. *(The Phase-2 window minutes are tunable; only the §4.2.1/§4.2.2 deed/seasonal tie-outs and
the §4.1 hybrid bands are the load-bearing invariants the §6.6 verifier asserts.)*

| Tier (revealed pillars → hybrid gate) | Phase-2 deeds (§4.2.1) → 70 % | Seasonal (§4.2.2) → 30 % | great/excellent reached by | ⏱ Phase-2 window *(ADDS to the floor)* |
|---|---|---|---|---|
| **T0** *(Arms + Estate; **good in BOTH + excellent in 1**)* | **30 Arms (350 ip) + 26 Estate (560 ip)** = ~56 deeds @ ~5 min | Arms 150 · Estate 240 (8-season back-credit) | excellent in **one** (Estate→1.5K *or* Arms→0.95K) via additional capped deeds | **~4.5–5 h** |
| **T1** *(Arms + Estate + Office; **good in ALL 3 + great in 2**)* | **35 Arms (3,500) + 35 Estate (5,600) + 20 Office (1,400)** = ~90 deeds @ ~8 min | Arms 1,500 · Estate 2,400 · Office 600 | great in **two** (e.g. Estate→11K + Arms→7.5K) | **~12 h** |
| **T2** *(Arms + Estate + Office + Name → **4 revealed**; **good in ALL 4 + Estate/Office great/excellent, Arms & Name good**)* | **20 Arms (21,000) + 31 Estate (42,000) + 21 Office (35,000) + 21 Name (19,600)** = ~93 deeds @ ~13 min | Arms 9,000 · Estate 18,000 · Office 15,000 · **Name 8,400** *(0.30·28K)* | Estate/Office to great/excellent (their surplus-deed counts §4.1); **cross-pillar combos** (§4.3.1) smooth the grind + the **U3 sink** (G4) folds in | **~20 h** *(incl. Name)* |

**Tie-out (Phase 2).** Each tier's deed inventory sums to **exactly 70 %** of every revealed pillar's **good**
band — **including the gated T2 Name pillar** (19,600 deeds + 8,400 seasonal = 28K) — and the seasonal stream
supplies the **30 %** residual (the line-by-line proof is in §4.2.1/§4.2.2) — the two add to the §4.1 **good**
band, the breadth floor every player reaches. **great/excellent** are reached by **specialising** the Phase-2
surplus into the chosen 1–2 pillars (each still per-event-capped at 0.04·good, many small acts, never spikes —
§4.1/§4.2.1), which **extends Phase 2 beyond its floor**. **T2 layers in the cross-pillar combos** (multiple
pillar pairs, post-trade-clamp, **excluded from the gate-check**; §4.3.1) as the anti-slump device and the **U3
"Prosperous" kura-work** (40K coin + materials, §4.7.5) as a Phase-2 coin/Arms sink. **The whole tier = Phase-1
climb (≥ its per-tier FLOOR) + this Phase-2 grind**, so the realised tier always runs **above** its floor (the
pacing regression fails on **undershoot only**, §4.8.4).

### §4.8.2 The Village tier (T2) — Phase-1 rung pacing

The Village tier's Phase-1 (V0→V7) spends its **~8–10 h** floor on **wider** content (market, coin, component
crafting, silk *meibutsu*, rumours board, valley-scale combat, the **3rd weapon line — Staff/polearm**) at
**~60 min/season** wall-clock. Throughput rises ~10× over the prior tier (rice into the tens-of-thousands). Each
rung gates on the **rung-meter + story** (not deeds); **Office is revealed** here and becomes a *required*
Phase-2 gate (§4.1). The **first HUMAN threat** (bandits / *nobushi*) and the rival-house contest also begin
here. Each grind rung ≥ ~40 min (the ≥30-min floor binds from T1); capstone longest.

| Rung (§3.4) | Meter + story gate to leave it (summary) | ⏱ wall-clock |
|---|---|---|
| **V0 Errand-runner** — market/coin opens (one shop first) | Estate Service ≥ thr + first valley errands; coin row lit | **~40 min** |
| **V1 Recognised hand** — chief's house, inn & rumours board | Estate Service ≥ thr + shop+headman standing | **~55 min** |
| **V2 Road-warden** — HUNT/CLEAR at valley scale; first HUMAN threat (*nobushi*); ford safe; **Staff/polearm line opens** *(3rd line)* | **Combat Rank ≥ thr** (valley clears; road-safe curated activities) + the ford story | **~60 min** |
| **V3 Steward of the valley economy** — silk *meibutsu* + component crafting | Estate Service ≥ thr + recorded seasonal result; **TRADE strand opens** (≤⅓-capped, §4.2.3) | **~65 min** |
| **V4 Trusted of the headman** — **Office bar lights** (first Office reveal) | Estate Service ≥ thr + the headman's trust beat | **~70 min** |
| **V5 Sworn man-at-arms** — paid retinue (flavour), DEFEND quests; **Naoyuki beat** | **Combat Rank ≥ thr** (valley DEFEND watches) + the man-at-arms oath | **~70 min** |
| **V6 Right-hand-in-waiting** — authority across the valley; region seed | Estate Service ≥ thr + STORY (alliance/standing) | **~55 min** |
| **V7 Agent of the house** *(capstone → OPENS Phase 2)* — "clean your room"; region opens | Estate Service ≥ thr + the Lord sends you to the region — **opens the Village Phase-2 grind to the hybrid gate (§4.8.1b)** | **~65 min** |

**Totals & checks (Village Phase 1):** **40+55+60+65+70+70+55+65 = 480 min = 8.0 h** ✔ (the Phase-1 FLOOR). The
**Phase-2 deeds** (Estate 5,600 / Arms 3,500 / Office 1,400 ip — §4.2.1) + seasonal (2,400 / 1,500 / 600)
accrue **after V7** (§4.8.1b), to the hybrid **good-in-3 + great-in-2** gate. Tier step Arms/Estate ≈10×;
**Office is a fresh required gate** (0 before → good-band 2K here). Season ≈ 60 min ⇒ ~8 seasons span the
Village Phase-1 floor.

### §4.8.3 The Region tier (T3) — Phase-1 rung pacing (the v1 end-gate)

The Region tier (G0→G7) is the **v1 END-gate** (`outcome: t3done`). Its Phase-1 is the longest, widest: region
map, *sekisho* travel, region-scale human mobs (rōnin/bandits), the Origin faction + both personal payoffs,
Kuzuhara river-works (the **U3** lever), the rival houses, and **combat DEPTH on the completed roster (no new
weapon line — the roster completed at the Village tier)**. **~120 min/season** wall-clock. Required Phase-2
pillars drift to **Estate + Office** (Arms secures roads); **Name** reveals (**4 revealed** — Name gated), and
the **FULL 4-pillar cross-pillar combo set** completes here (§4.3.1). Each grind rung ≥ ~75 min; capstone among
the longest. The Region tier's **Phase 2** weaves in the **full 4-pillar cross-pillar combos** (§4.3.1) and
lands **U3 "Prosperous"** (§4.7.5).

| Rung (§3.6) | Meter + story gate to leave it (summary) | ⏱ wall-clock |
|---|---|---|
| **G0 Valley-envoy** — trade backbone opens minimally; first Origin contact | Estate Service ≥ thr + first off-the-books consignment | **~75 min** |
| **G1 Road-captain** — *sekisho* layer; region-scale combat (rōnin/bandits); **combat DEPTH on the completed roster (no new line — the roster completed at the Village tier)** | **Combat Rank ≥ thr** (secure cluster roads — curated combat) + first pass obtained | **~110 min** |
| **G2 Broker of the post-town** *(Origin OPENS)* — Sawatari-juku, *toiya* | Estate Service ≥ thr + **STORY (dream) AND travel-standing** (the doubly-earned Origin gate, §3.6.2) | **~120 min** |
| **G3 Arbiter between valleys** — Hibara + Tōge-mura (capped at 2) | Estate Service ≥ thr + out-supply/arbitrate story | **~130 min** |
| **G4 Recognised regional retainer** — Kuzuhara river-works (LAND mega-lever) | Estate Service ≥ thr **+ STORY** (commit the multi-stage *seki*) — **lands the U3 "Prosperous" kura-work** (40K coin sink, §4.7.5) | **~140 min** |
| **G5 Captain of the road-detail** — brigand roost; **Hanzaki survived**; **Naoyuki ally-flip** | **Combat Rank ≥ thr** (secure the trade pass — curated combat) + the roost broken | **~140 min** |
| **G6 Alliance-broker** *(Otsuru/Tama TRUTH — spine-guaranteed)* — Tahei-name-reclaim is **Origin-O5 missable** (§3.6.2) | Estate Service ≥ thr + STORY (alliance) | **~120 min** |
| **G7 Leading house of the region** *(capstone → OPENS Phase 2)* — rivals eclipsed | Estate Service ≥ thr + the Lord names the house first of the region — **opens the Region Phase-2 grind to the v1 end-gate (§4.8.1b)** | **~125 min** |

**Totals & checks (Region Phase 1):** **75+110+120+130+140+140+120+125 = 960 min = 16.0 h** ✔ (the Phase-1
FLOOR). The **Phase-2 deeds** (Estate 42,000 / Arms 21,000 / Office 35,000 / **Name 19,600** ip — §4.2.1) +
seasonal (18,000 / 9,000 / 15,000 / **Name 8,400**, the gated Name 30 %) accrue **after G7** (§4.8.1b), to the
hybrid **good-in-all-4 + Estate/Office great/excellent, Arms & Name good** end-gate, **plus the cross-pillar
combos** (§4.3.1). Tier step Arms 5K→30K (6×), Estate 8K→60K (7.5×), **Office 2K→50K (25× — the locked "win it
socially" steepening**, §4.0/§4.1). Season ≈ 120 min ⇒ ~8 seasons span the Region Phase-1 floor.

### §4.8.4 The v1 budget at a glance (all figures FLOORS)

The v1 saga spans four tiers: a floor-exempt **T0 tutorial** + a net-new **T1 Estate-full** (R8→R15) + **T2
Village** + **T3 Region** (the v1 end-gate).

| Tier | rungs (Phase 1) | per-rung avg | season wall-clock | **Phase-1 FLOOR** | + Phase-2 grind (§4.8.1b) | lock |
|---|---|---|---|---|---|---|
| **T0 Estate-tutorial** | R0–R7 (8) | ~30–55 min *(floor-EXEMPT)* | — | **~4.5 h** *(floor-exempt)* | Estate-only gate | tutorial — not floor-bound |
| **T1 Estate-full** | R8–R15 (~8) | ≥ ~40 min | ~60 min | **~5–8 h** | +Arms | LOCKED FLOOR *(binds from T1)* |
| **T2 Village** | V0–V7 (8) | ~60 min | ~60 min | **~8–10 h** | +Office | LOCKED FLOOR |
| **T3 Region** | G0–G7 (8) | ~120 min | ~120 min | **~16 h** | +Name; incl. combos | LOCKED FLOOR |
| **v1 total (T0–T3)** | ~32 | — | — | **≈ 28.5 h (the locked Phase-1 climb FLOOR; the four-tier climb runs at or above it)** | **+ ~+32–36 h Phase-2 ⇒ ~60 h v1 FLOOR (~65 h with the Name gate + great/excellent)** | LOCKED FLOOR |

**The three single most important invariants:** (1) **every grind rung ≥ ~30 min** (LOCKED FLOOR — **binds from
T1**; the **T0 tutorial is floor-exempt**) — enforced as a CI pacing floor: if a headless playthrough clears any
**T1+** rung in < ~28 min the pacing test **fails** (undershoot); (2) the **budget figures are FLOORS** — the
pacing regression **fails on UNDERSHOOT ONLY, never on overshoot**, because the two-phase tier (climb + grind)
is *meant* to run past its Phase-1 floor; and (3) the **goal-to-goal ratio ≤ 2–3×** *within* a tier (canon) —
the gentle intra-tier growth keeps consecutive costs soft, while the ~10× tier step (Office ~25×) is the
deliberate chapter break. **Levers:** all per-rung *times / costs / meter-thresholds* and the Phase-2 window
minutes are tunable, but the **< 5 s first action**, the **≤2–3× never-balloon rule**, the **≥30-min per-rung
FLOOR (from T1; T0 exempt)**, and the **per-tier hour FLOORS** (T0 floor-exempt · T1 ~5–8 h · T2 ~8–10 h · T3
~16 h) are constraints the tuning must always satisfy (the last two are locked FLOORS).

---

## §4.9 Levers index (the tuning dashboard) & the LOCKED-constants index

**Master dials:** `TIER_MAG = 10`, `r_intra = 1.15`, `SEASON_WALLCLOCK_MIN[tier]` (T0≈34 / T1≈60 / T2≈120 — a
binding that *serves* the FLOORs, itself a lever). **Rung-meter — the third curve (§4.1.1):** `RUNG_FLOOR_MIN
= 30` *(a FLOOR — the value is the minimum, not a ceiling)*, each rung's `eligibleActivityRate` + its curated-
activity set + the per-rung thresholds (T0 ~14–19). **Accrual:** **`PER_EVENT_CAP_FRACTION = 0.04`** *(a small
cap is the locked direction)*, the **deeds/seasonal split ≈ 70/30** *(deeds-dominate is locked; the exact 70/30
is tunable)*, the **deed-base table** (§4.2.1, every base ≤ its 0.04·good-band cap), **`SEASONAL_SHARE =
0.30`** (the single dial setting the whole seasonal stream), the derived **`JUDGE_K[pillar][tier] =
SEASONAL_SHARE · goodBand`** table, the **`TIER_REF[pillar][tier]`** + **`TIER_REF_NAME = armsGood + estateGood
+ officeGood`** normalizers, the **autumn-basis bump** (~12 %), `f_pillar` exponents (0.5), `DENT_FRACTION =
0.10` + the dent self-heal rate. **HYBRID gate (§4.1):** the **good/great/excellent triple per revealed pillar
per tier** **+ the great/excellent COUNTS** (how many pillars must be great vs excellent); the revealed-pillar
set (T0=2 / T1=3 / T2=4 — Name gated). **Gating:** the hybrid profile **ANDed with** the Phase-1 capstone
rung-meter + story gate, **+ the per-tier hour FLOORS the gates must take to fill**. **Skills:** `XP_BASE = 50`,
`XP_GROWTH
= 1.18`, `PER_EVENT_XP_CAP_FRACTION = 0.25`, visibility 30, per-tier soft caps, milestone levels/perks.
**Per-skill perks (§4.5.4):** each perk's `combatBonus` magnitude, the per-skill perk counts (~2–8), the
unlock-level cadence, `PER_PERK_MAX`. **Conversion weights (§4.3):** `0.05·combatLevel`, `0.10·dangerRing`,
`0.04·skillLevel`, `0.04·tradeSkill`, `0.06·officeRank`, `0.15·allianceSealed`, `0.25·Name-blend`.
**Cross-pillar combos (§4.3.1):** which pillar pairs combo, the per-pair magnitude (≤ one cap), the **two-wave onset (PARTIAL Office-pairs at T2 · FULL 4-pillar set at T3)**.
**Attributes (§4.4):** all coefficients, start = 5, +1 pt / 2 levels, per-tier soft caps. **Character level
(§4.6.5):** `CL_BASE = 60`, `CL_GROWTH = 1.18`, `COMBAT_XP_K = 12`, `MobDef.level` defaults, `hpMax = 40 +
8·characterLevel`, `satietyMax = SATIETY_BASE(100) + SATIETY_PER_LEVEL(4)·characterLevel`. **Combat (§4.6):**
each weapon's `baseSpeed`/`reach`/`targetCount`/signature (§4.6.9), SPD coeff 0.005, `DAMAGE_FLOOR = max(1,
0.10·atk)` *(floored LAST, post crit/block — §4.6.4)*, `CRIT_MULT = 1.5`, `BLOCK_REDUCTION = 0.5`, chance caps
0.50/0.40, `skillBonus = 0.3·weaponSkill`, accuracy base 10, crit base 0.02; the **enemy `MobDef.level →
{attackPower, defense, HP, …}` curve** (§4.6.1d — `MOB_HP_BASE 24`/`MOB_HP_K 8`, `MOB_ATK_BASE 8`/`MOB_ATK_K 3`,
`MOB_DEF_BASE 1`/`MOB_DEF_K 1`, `MOB_ACC 10/+2L`, `MOB_EVA 2/+2L`, `MOB_CRIT 0.05`); the **closed-form
`P_win(MC)`** (§4.6.4b — **analytic for the GATE / fixed-seed sampled n=400 for the DISPLAY**;
displayed == tested == same-for-every-player); the **light active layer** (§4.6.10 — stance mods, `ABILITY_CD`,
item slots); `SATIETY_COMBAT_FLOOR = 0.5` + the 0.7 knee + the attackSpeed-touch weight;
the 4 durability bands (75/50/1/0 → 1.0/0.9/0.75/0.55) + `WEAR_PER_FIGHT ≈ 3 %`; the **win-rate bands**
(§4.6.7) per combat-entry rung; the **retreat clock cost** + the **0-HP forced-rest** loop (§4.6.6b/§4.6.8). **Pacing (§4.8):** all per-rung times /
costs / meter-thresholds + the Phase-2 window minutes under the **≥30-min FLOOR (binds from T1; T0
tutorial exempt) + the per-tier hour FLOORS (T0 exempt · T1 ~5–8 h · T2 ~8–10 h · T3 ~16 h; LOCKED as FLOORS)**.
**Producers/costs (§4.7):** gather base yields/ticks + per-rung net throughput, autumn `×3`,
`STAMINA_RATE_FLOOR = 0.5` + the 0.7 knee, the weather `±10 %` band, crafting quality weights (0.4/0.4/0.2,
0–1 score) + `QUALITY_TIERS = 5` + the `SKILL_REF`/`MAX_STATION_TIER` normalisers + `1.25^tier` + 60 %
disassembly + the **coin sink** (from the Village tier — market/component-buying), loot rarity 70/22/6/2 +
`0.5 %·LUCK`, `PRODUCER_GROWTH = 1.5` (beyond v1), the **U1 / U2 / U3** kura-work costs & floors (§4.7.5).

**LOCKED-constants index (the fixed v1 dial values, for quick reference — self-consistent):** `TIER_MAG 10` ·
`r_intra 1.15` · `RUNG_FLOOR_MIN 30` · `PER_EVENT_CAP_FRACTION 0.04` ·
`SEASONAL_SHARE 0.30` · `DENT_FRACTION 0.10` · `XP_BASE 50` · `XP_GROWTH 1.18` · `PER_EVENT_XP_CAP_FRACTION
0.25` · `CL_BASE 60` · `CL_GROWTH 1.18` · `COMBAT_XP_K 12` · `SATIETY_BASE 100` · `SATIETY_PER_LEVEL 4` ·
`SATIETY_COMBAT_FLOOR 0.5` (knee 0.7) · `STAMINA_RATE_FLOOR 0.5` (knee 0.7) · `WEAR_PER_FIGHT 3 %` ·
durability bands `1.0/0.9/0.75/0.55` · `CRIT_MULT 1.5` · `BLOCK_REDUCTION 0.5` · crit/block caps `0.50/0.40` ·
`DAMAGE_FLOOR max(1, 0.10·atk)` (floored LAST, post crit/block) · `hpMax 40 + 8·level` · `QUALITY_TIERS 5` (0–1 score, no divisor) · quality step `1.25^tier` ·
disassembly `0.60` · loot `70/22/6/2` + `0.5 %·LUCK` · weather `±10 %` · autumn paddy `×3` · `PRODUCER_GROWTH
1.5` (beyond v1) · `SEASON_WALLCLOCK_MIN[tier]` (34/60/120) · tier Phase-1 FLOORS (T0 ~4.5 h floor-exempt · T1
~5–8 h · T2 ~8–10 h · T3 ~16 h; v1 Phase-1 `≈28.5 h` FLOOR; v1 TOTAL `~60 h` incl. ~+32 h Phase-2).

**Locked (shape fixed, not free to invert; only the realising magnitudes are tunable):** saga length / per-tier
hour budget **as FLOORS** (**T0 floor-exempt** · the ≥30-min floor + the per-tier hour FLOORS **bind from T1**;
**T1 ~5–8 h · T2 ~8–10 h · T3 ~16 h** · **v1 ≥ 28.5 h Phase-1 climb** / v1 ≥ ~60 h TOTAL incl. ~+32 h Phase-2;
runs longer) · the **≥30-min per-rung FLOOR (from T1)** · **first-fight win-rate 20–35 % at adequate satiety
(≥~0.7)** *(a SINGLE fight; holds under HP-carry)* · **soft-setback severity shape** (1 HP + ~½-day + light
injury + **a real bite of carried wealth** — ~20 % coin + ~⅓ materials/rice, banked wealth in the kura is safe;
never levels/gear/Influence) · **deeds-dominate accrual split (~70 % deeds / ~30 % seasonal)** · **deed-jump
size small (a per-event cap well under 0.08)** · **no respec in v1** · the **HYBRID good/great/excellent
tier-gate** (breadth floor + no overflow) · the **THREE clean combat tracks** (character level / Arms pillar /
Combat Rank meter — never reconflated) · the **SEQUENTIAL two-phase model** (rungs → pillar grind; deeds
Phase-2-only) · **graded durability bands, never auto-unequip / never weaponless** · **satiety throttles
combat** (floor never below ~15 % win-rate).

**HARD INVARIANTS (canon — NOT levers):** trade ≤⅓ of Estate & Wealth (post-combo-clamp, §4.2.3/§4.3.1); the
**HYBRID good/great/excellent gate — good in ALL revealed pillars (breadth floor) · great in 2–3 · excellent
in 1–2, NO overflow/substitution**; accrual = achievement jumps + seasonal-judged-on-high-water-mark only (no
time-trickle, no flat per-action), **PHASE-2 only** (deeds don't accrue on the rungs); up-only with minor
recoverable per-pillar dents (never a wipe, never touches `highWater`); the **bounded per-skill combat-perk
channel** (`skillCombatBonus`, ~2–8 small perks/skill, no hard global cap — conditioning stays the **ZERO-stat
enablement gate**); auto-producers **beyond v1 & ACTIVE-ONLY (no offline)**; combat first-class & EARLY
(T0-R3); **one combat-fed character level** (never raised by labour or deeds); mediocre-start (start near-zero,
grind-only); K/M/B display; macron romanization.

---
