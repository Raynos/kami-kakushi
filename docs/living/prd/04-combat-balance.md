# §4 — Combat, Progression & Balance Model

> **STATUS: PRD V2.3 — numbers provisional.** This section incorporates the human-signed **Block L (Q1–Q56)**
> and **Block M (FU1–FU23)** (2026-06-26), governed by **ADR D-022 (newest-block-wins; annotate-don't-delete)**.
> The **balance SHAPE the human signed** (saga length as a **FLOOR** / per-tier hour budget / per-rank ≥30-min
> floor / first-fight win-rate / soft-setback severity / deeds-dominate split / no-respec / the **hybrid
> good/great/excellent tier-gate** / the **three clean combat tracks**) is **LOCKED INTENT (ADR D-021)**; the
> §4 magnitudes (yields/levers/curves) and the §7 M2–M7 milestone detail stay **PROVISIONAL** and are re-planned
> after each playtest. This section is authored from the V2 spine in **§1.6.4** (the sequential two-phase model +
> the three combat tracks) and the system *shapes* fixed in **§2** (the three tracks, the incremental weapon
> roster, the per-skill perk channel, the satiety-throttled / durability-banded combat).
>
> **⚠️ ALL NUMBERS IN THIS SECTION ARE TAGGED `proposed v1 balance` EXCEPT the pacing/gate SHAPE the human
> signed off on** (saga length as a **FLOOR** / per-tier hour budget / per-rank ≥30-min floor / first-fight
> win-rate / soft-setback severity / deeds-dominate split / no-respec / the **hybrid good/great/excellent gate**),
> which are tagged **`LOCKED by human`**. Everything else is a *coherent first-pass*, chosen so the whole curve
> is self-consistent and the locked targets (§4.8) hold; **every proposed number is a lever, tunable later**
> without touching architecture. Per canon §H + §6.4, every value lives in `core/content/balance.ts` (the single
> home for tunables) and derived numbers reflow with **no save migration**. The duplicated/derived balance
> numbers below are **illustrative — the source of truth is the generated `balance.ts` / `docs/balance/` /
> `docs/content/` tables** (Q41); no value is hand-maintained twice.
>
> **The CANON shapes (data types, accrual *modes*, the trade ≤⅓ invariant) are NOT tunable; only the
> magnitudes are.** Two former "canon shapes" are **explicitly REVERSED by the V2 decisions (D-022 governing):**
> (1) **"no labour→combat cross-feed" is RELAXED** to a **bounded per-skill combat-perk channel**
> (`skillCombatBonus`, ~2–8 small perks per skill, no hard global cap; Q6/FU8 — §4.5.4); conditioning stays the
> **zero-stat enablement gate**. (2) **"simple per-tier thresholds, no floor/overflow" is REPLACED** by the
> **HYBRID good/great/excellent tier-gate** (good in ALL revealed pillars · great in 2–3 · excellent in 1–2; no
> overflow; Q7/FU10 — §4.1). The **trade ≤⅓ cap** and the **jumps + seasonal-judged-on-high-water-mark** accrual
> mode remain canon and unchanged.
>
> **REBALANCE NOTE — the budget is a FLOOR, not a ceiling (FU18; annotates D-016 / D-Q1).** The **≈28.5 h
> figure is the v1 PHASE-1 climb FLOOR, NOT the total** (T0 ≈ 4.5 h + T1 ≈ 8 h + T2 ≈ 16 h of rung-climbing).
> The full **v1 saga ≈ ~60 h FLOOR = the ~28.5 h Phase-1 climb floor + a ~+32 h Phase-2 pillar-grind floor**
> (T0 ~+4.5–5 h · T1 ~+12 h · T2 ~+20 h — the T2 figure now carries the new **Name gate** good-band deeds,
> D-Q3, which compounds the ~60 h floor toward ~65 h, accepted; §4.8.1b). Every one of these is a **FLOOR, not a ceiling**: the
> **per-rank ≈30-min floor** and the per-tier hour targets are **MINIMUMS** — a long, OSRS-rough grind you
> settle into and *leave auto-running, checking the progress* (FU23: tab-open auto-resolve combat + auto-repeat
> labour, active-only). The saga **can and should run LONGER** than the ~60 h floor when content interleaves
> richly and players push pillars past *good* to great/excellent (§4.1); §4.8 is a **minimum-grind model** and
> the M6 pacing regression **fails on UNDERSHOOT only** (a rung cleared *too fast*), never on overshoot. The old
> "leave T0 in ~45–75 min, v1 ~12–20 h" targets stay superseded; the figures below are the floor the curve is
> derived *backward from*.

> **🔁 RESHAPE NOTE — the 6-tier split (D-048…D-069; Part-1 markdown ripple).** The locked reshape (**D-048**)
> **splits the old Estate tier in two** and shifts the rest up one, so this section's tier vocabulary re-maps:
> **old-T0 Estate → new-T0 (tutorial, R0→R7) + new-T1 (full estate, R8→R15)** · **old-T1 Village → new-T2** ·
> **old-T2 Region → new-T3** (v1 **ends here**, `outcome: t3done`) · old-T3 Castle-town → new-T4 · old-T4 Edo →
> new-T5. The **pillar reveal is now one per tier** (D-048/D-049): **T0 = Estate 家産 (1)** · **T1 = + Arms 武威
> (2)** · **T2 = + Office 官威 (3)** · **T3 = + Name & Honour 家格 (4)**, ramp **1→2→3→4→4**; the scaled grade-gate
> is **1 EXCELLENT + 1 GREAT + (N−2) GOOD** for N revealed pillars, all ≥ GOOD (**T0 collapses to EXCELLENT**).
> Combat-as-*activity* still lives in **T0** (the humbling first fight @ **R3**), but the **Arms pillar DEEDS
> (Phase 2) bank only from T1**.
>
> **What THIS file's Part-1 ripple LANDS (the net-new combat/balance locks):** **(a)** combat **HP carries
> between fights + heals by EATING (satiety)**, and **no stance strictly dominates** (D-050 — §4.6/§4.6.10,
> replacing the v0.2 dominance-enshrining test); **(b)** the human-signed **20–35 % SINGLE-fight win-rate band
> STANDS** under HP-carry (D-058 — HP-carry shapes the *grind*, not the discrete first fight; a real foe is
> tuned into band, backed by a **RED-able foe-in-band test**); **(c)** win-rate is **ANALYTIC for the gate /
> fixed-seed SAMPLED (n = 400) for the display**, with **displayed == tested == same-for-every-player** (D-057
> — §4.6.4b/§4.6.7); **(d)** difficulty is **humbling THROUGHOUT incl. T0** (D-061 — fast ≠ easy, guardrails
> intact); **(e)** **T0 is floor-exempt** (gentle ~10–15 min/rung) and the **≥30-min/rung floor binds from T1**
> (D-049/D-056); **(f)** the **Staff/polearm line is pulled FORWARD from Region into Village (new-T2)** so the
> roster completes by end-of-T2 and **new-T3 Region = combat DEPTH, no new line** (§4.6.9); **(g)** cross-pillar
> combos split into **PARTIAL Office-pairs at new-T2 + the FULL 4-pillar set at new-T3** (§4.3.1).
>
> **The full §4 6-tier ripple is scheduled in the [v0.3.1 build plan](../../plans/2026-06-30-v0.3.1-build.md)**
> (moved here from Ship-M1-F2 by the human 2026-06-30, so it rides the v0.3.1 koku re-derivation, D-077). It is a
> single **coupled balance re-derivation** — the **§4.1** bands + revealed-pillar set, the **§4.2** deed/seasonal
> tie-outs, the **§4.8** per-rung FLOORS, the **post-v1 "T4+" labels** (auto-producers / marriage-adoption /
> Castle-town / Edo), AND the **new T1 Estate-full band split** — coupled because the T1 split needs the per-tier
> FLOORS that re-derive with it (provisional starts **T1 ~5–8 h · T2 ~8–10 h · ≈40 min/rung**, fork #1/#5; the
> **~28.5 h Phase-1 floor re-derives across the 4 v1 tiers T0–T3**). **Done now (this ripple):** the **§4.0
> magnitude table above is relabeled to the 6-tier spine** (T0 keeps the tutorial ~21K; new-T1 Estate-full band
> = TBD; Village→T2 / Region→T3 / Castle→T4 / Edo→T5). **Still OLD-numbered until the v0.3.1 pass — map through
> this key:** **§4.1 / §4.2 / §4.3–4.7** bare tier-refs read **old-3-tier (T0 Estate / T1 Village / T2 Region;
> T3+ Castle-town/Edo)**; **§4.8 is already new-numbered**. The **kanji**, the **20–35 % band**, **trade ≤⅓**,
> and the **70/30** deeds/seasonal split are invariants and do **not** move.

## How to read this section

This is where the **parked balance numbers** from §§1–2 finally land. Each subsection states the **shape**
(canon, fixed), then a **proposed v1 number set** (tunable), then the **levers** to turn during tuning.
Units throughout: **koku** (rice, base currency), **coin/mon** (trade currency), **House Influence** in
abstract **Influence points (ip)** per pillar, displayed with **K/M/B** abbreviation (canon §H — not
scientific, not myriad units). One **tick** = the atomic active-play time-step; **1 action ≈ 1–4 ticks**;
**1 day ≈ 200 ticks**; **1 season ≈ 30 days ≈ 6,000 ticks**; **1 year = 4 seasons = 120 days** (abstract,
active-only — §2.2). These tick/day mappings are themselves levers.

**Wall-clock anchor (required by the locked time budget, now read as a FLOOR).** Because the saga length and
the per-rank ≥30-min floor are stated in real minutes, the balance commits a **wall-clock ⇄ game-time
binding**: at the intended active-play pace, **1 season ≈ 34 min of real play** in T0 (so T0's ~8 seasons span
its ~4.5 h *floor*), stretching to **~60 min/season in T1** and **~120 min/season in T2** (the player does more
*per* season as the world enlarges, not more seasons). This binding lets the §4.8 pacing table be read in
minutes. The binding itself is a **lever** (`SEASON_WALLCLOCK_MIN[tier]`), but the *floor* targets it serves
(≥30 min/rank; 4.5/8/16 h tiers, as **minimums**) are **LOCKED by human** as FLOORS (FU18).

---

## §4.0 The number spine — magnitudes per tier (the master scale)

Everything below hangs off one **per-tier magnitude band** so K/M/B abbreviation reads naturally and "the
next goal never balloons > ~2–3× the prior" (canon §G / §1.2 pillar 3 / pacing §4.8). The house's
**total resource & Influence magnitudes** grow ~**one order of magnitude per tier** (≈10×), but **within a
tier** every individual step is a gentle **~1.15× geometric** so no single jump feels like a wall.

> **T0 koku band reconciled (Q14 — yields are already NET).** The T0 lifetime-produced band reads **~21K** to
> match the §4.8.1 rung-by-rung sum exactly (R1…R7 = 0.75K+1.05K+1.2K+2.1K+3.2K+4.95K+8.25K = **21.5K ≈ 21K**).
> Because gathering yields are modelled **already net** of stamina/food/re-investment (Q14 — §4.7.1), the
> **end-T0 HELD koku ≈ 18–19K NET** (the earlier draft's "~3–5K held" double-counted a spend that the net-yield
> model already absorbed). The two figures the player sees — lifetime-produced ~21K, held ~18–19K NET — differ
> only by the genuine koku **sinks** (E1/E2/E3 builds, tools, craft inputs), not by a hidden upkeep tax.

**Rebalanced for the LONGER saga (FU18 — a FLOOR).** "More grind, more numbers" means the *koku* bands are
**wider** than the old draft (you produce far more over a 4.5-h-floor tier than over a 45-min one), while the
**Influence-per-pillar** bands stay close to the old gate magnitudes — Influence is the *slow, judged*
measure, deliberately lagging the raw resource counters. The widened *koku* bands below come straight out of
the §4.8 throughput model (end-T0 *lifetime-produced* koku ≈ 21K; end-T0 *held* koku ≈ 18–19K NET).

| Tier | koku band (lifetime-produced → held NET) | Influence-per-pillar band (display) | Typical single number the player sees |
|---|---|---|---|
| **T0 Estate** *(tutorial, R0–R7)* | tens → ~**21K** produced (~**18–19K** held NET) | 0 → ~**1.5K** ip | "**3.4K koku**", "**Estate 1K**" |
| **T1 Estate-full** *(R8–R15 — the net-new tier)* | **TBD — derives in the v0.3.1 §4 re-derivation** (full-estate Phase-1 + the first Arms/Estate Phase-2 deeds) | **TBD** | **TBD** |
| **T2 Village** *(was T1)* | ~10K → ~**250K** produced | ~0.5K → ~**15K** ip | "**42K koku**", "**Estate 11K**" |
| **T3 Region** *(was T2)* | ~100K → low **M** | ~5K → ~**110K** ip | "**1.8M koku**", "**Office 78K**" |
| **T4 Castle-town** *(stub; was T3)* | low **M** → ~**100M** | ~50K → ~**900K** ip | "**240M koku**", "**Name 900K**" |
| **T5 Edo** *(roadmap; was T4)* | ~100M → low **B** | ~1M → ~**12M** ip | "**3.4B koku**", "**Name 11M**" |

**Lever:** the **per-tier multiplier `TIER_MAG = 10`** (the order-of-magnitude step) and the
**intra-tier growth `r_intra = 1.15`** are the two master dials. The Influence bands still step ~**10×**
for Arms/Estate; the **Standing & Office** band steps **harder** (≈10× → ≈25× at the T1→T2 boundary) by
design, because the required-pillar gate **drifts** from "survive/get strong" to "win it socially" (§4.1).
**v1 only ships T0–T2** fully (T3 stub, T4 roadmap), so only the first three bands are load-bearing for
launch tuning. Note: lengthening the saga was done by **stretching wall-clock-per-rung** (the ≥30-min floor)
and **fattening the *koku* counters**, *not* by inflating `TIER_MAG` — the chapter-break feel of ~10× is
preserved ("a slower release of incremental features," not bigger walls).

---

## §4.0.1 Progression architecture — three tracks, two phases *(the V2 master reframe — D-023/D-025)*

This is the conceptual hub the rest of §4 hangs off (the canonical statement is **§1.6.4**; the system shapes
are **§2.8.1 / §2.15.1 / §2.16**). Two structural facts drive every curve below.

**(1) THREE independent, separately-stored tracks (FU14/Q1) — never one fused bar.** Reconflating them is the
single likeliest regression (the old §2.8 "Combat Level = a Combat Deeds pool" fused all three). What **one
kill / one recognised deed / one curated rung activity** writes makes the distinction concrete:

| Track | Fed by | Writes / scales | Gate role | §4 home for its curve |
|---|---|---|---|---|
| **Character (combat) level** | kills → **combat-XP** only (labour and deeds **never** raise it; Q1) | **HP** (`hpMax = 40 + 8·characterLevel`), **satietyMax** (base + per-level growth; Q47), **+1 attribute point / 2 levels** | personal **power**; per-mob `MobDef.level` sets on-kill XP | the curve is **§4.6.5** (one definition, referenced everywhere) |
| **The Arms pillar** (武威) | recognised martial **DEEDS** (a road declared safe; a nest cleared; the grain store defended) | one of the **four House-Influence pillars** | **Phase-2** tier-gate input (the hybrid profile) | §4.1 / §4.2 |
| **The Combat Rank rung-meter** | **per-rung CURATED** combat activities (not raw kills/XP; FU14) | the **per-rung-reset martial rung-meter** | **Phase-1** martial rung-gate | §4.1.1 |

So: **one kill → character-level combat-XP (only)**; **one recognised deed → Arms**; **one curated rung
activity → the Combat Rank meter.** Each stream **sums independently** (the §6.6 verifier asserts no leakage).
*("**Combat Rank**" renames the old "Combat Standing", Q9; "**Standing**" now means the **官威 Standing &
Office** pillar **only**.)* `character.level` is the **only** one of the three that scales personal power; the
other two are *standing*/*gate* meters. **No section may re-derive its own "level" concept** — the one
combat-fed character-level curve (§4.6.5) is the sole driver of `hpMax`, `satietyMax`, and attribute points.

**(2) TWO ordered phases per tier (FU7) — Phase 1 (climb rungs) then Phase 2 (pillar grind).**

- **Phase 1 — climb the rungs (R0→R7 etc.).** Each rung promotes on **BOTH** the **per-rung-reset rung-meter**
  (§4.1.1) **AND** the rung's **story milestones** (an **AND-gate**; the UI reads "awaiting X" when one side
  lags). The meter is fed by **curated, story-consistent per-rung activities** (a designed one-to-many set,
  authored **separately from** the pillar-deed inventory). Two meters run in parallel: **Estate Service**
  (labour) and **Combat Rank** (martial). **Pillar DEEDS do NOT accrue in Phase 1.**
- **Phase 2 — grind the house up.** The **capstone (final) rung OPENS Phase 2** — the **estate-influence /
  four-pillar grind.** The tier's **pillar DEEDS accrue here and ONLY here** (gated post-final-rung; FU7),
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

**Shape (canon §1.6.3/§1.6.4, §2.16 — fixed; supersedes the old "simple bands, no floor/overflow", Q7/FU10/
D-028).** Tier-up is **no longer** "the named required pillar(s) each clear a single stated threshold." It is a
**HYBRID specialisation profile across the pillars REVEALED by that tier**: you must be **good in ALL revealed
pillars** (a **breadth floor** — this half *reverses* the old "no global floor"), **great in 2–3**, and
**excellent in 1–2** — **with NO overflow/substitution** (that half of the old rule *survives*: a surplus in one
pillar can never stand in for a deficit in another). The semantics are **authored levels, not ratios**:
**good = the expected baseline · great = really strong · excellent = above-and-beyond** (FU10). This profile is
the **Phase-2 tier-gate** — it is **ANDed with the Phase-1 capstone rung-meter + story gate** (§4.1.1/FU11), and
it is **only ever checked against pillars REVEALED by that tier** (never "good in ALL" against an unrevealed
pillar).

**The revealed-pillar set grows per tier** (matching the §3 reveal schedule and the §2.16(e) four-bar-panel
reveal): **T0 = 2** (Arms + Estate — a **2-pillar special case**), **T1 = 3** (+ Office), **T2 = 4** (+ Name —
Name is a REAL gated pillar at T2, D-Q3).
The required pillars still **drift** as they reveal — early tiers lean **Arms + Estate** ("survive and get
strong"), upper tiers lean **Office + Name** ("win it socially"). The only structural cap that survives is
**trade ≤⅓ of Estate & Wealth** (§4.2.3) — trade can never carry a gate, and cross-pillar combos (§4.3.1) are
computed **post-clamp** and **excluded** from this gate-check.

**Proposed v1 good/great/excellent bands** *(proposed v1 balance — re-derived per-pillar-per-tier against the
FIXED §4.2.1 deed inventory; **NOT** uniform 0.2×/0.5× ratios — each band is grounded in a deed-count, so the
great/excellent multipliers vary per pillar/tier by design)*. The **good band is the reference magnitude** the
routine Phase-2 grind delivers (= roughly the old single threshold); **great/excellent are reached by
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
| **T3 → T4** *(stub; Office + Name excellent)* | Office | **600K** | **850K** | **1.2M** |
| | Name | **500K** | **720K** | **1.0M** |
| **T4** *(roadmap; Name + Office excellent)* | Name | **6M** | **8.5M** | **12M** |
| | Office | **5M** | **7M** | **10M** |

> **How the bands tie out against the fixed deed inventory (the §6.6 accrual-tie-out check).** The §4.2.1 deed
> inventory + the §4.2.2 seasonal stream are sized to deliver the **good** band in every revealed pillar — that
> is the breadth floor every player reaches, and it is what the verifier ties out (deeds = 70 % of the *good*
> band, seasonal = 30 %, §4.2.1/§4.2.2). The **great/excellent** bands are then reached by the player
> **specialising** — pouring the Phase-2 window's *additional* recognised deeds into their chosen 1–2 pillars
> (each still per-event-capped at 0.04·good-band, so it is many small acts, not spikes). Because the base
> inventory only guarantees *good in all*, pushing 1–2 pillars to great/excellent **extends Phase 2 beyond its
> floor** — exactly the **budget-as-a-FLOOR** intent (FU18). A combo (§4.3.1) is **excluded** from this check:
> it can never satisfy "good in ALL revealed pillars."

**The great/excellent SURPLUS supply — the supra-good deed inventory (D-Q3(a)).** Because the seasonal stream
tops out at 0.30·good (its `f` saturates at the good-band-top, §4.2.2), **ALL ip above the good band comes from
additional capped deeds.** Each revealed pillar therefore carries an authored *surplus* deed inventory beyond
its 70 %-good base (§4.2.1) — the supra-good supply a specialising player draws on. The counts below (surplus
ip = band − good, ÷ the pillar's representative deed base, every base still ≤ its 0.04·good cap) are the
**extra** recognised deeds to reach great / excellent in that pillar — and because each is done at the tier's
Phase-2 deed cadence (~5 min T0 · ~8 min T1 · ~13 min T2, §4.8.1b), **they ADD Phase-2 minutes on top of the
floor** (the budget-as-a-FLOOR intent, FU18):

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
great (~35 deeds × ~13 min ≈ **+7.5 h**) plus **one** to excellent stacks on T2's **~+20 h Phase-2
window** (§4.8.1b/§4.8.4 — already inflated by the new Name gate, D-Q3). The supra-good inventory is **authored beyond** the 70 %-good base, obeys the same
per-event cap, and never feeds the trade ratio or the gate-eligible accumulator (combos excluded, §4.3.1).

**Reading the drift & the special cases.** **T0** is the **2-pillar special case**: only Arms + Estate are
revealed, so the gate is **good in both + excellent in exactly one** (no phantom third pillar). **T1** reveals
Office, so the gate is **good in all three + great in two**. **T2** surfaces Name (**4 revealed**), with the
profile leaning **Estate + Office great/excellent, Arms & Name good** ("win it socially"). A pillar **not yet
revealed** for a tier is **never** checked (never "good in ALL" against it). **T2 reveals Name as the 4th
gated pillar (D-Q3):** the gate is **good in all 4 + Estate/Office great/excellent, Arms & Name good** — Name's
own **28K good band** (§4.1 table) is a live breadth-floor consumer, not a free pass. Each good-band sits at roughly the
top of the prior tier's band (§4.0); T0→T1 good is ~**10×** T0's start; T1→T2 keeps ~**6–10×** on Arms/Estate
but the **Office good-band steps ~25×** (2K → 50K) — the deliberate "win it socially" steepening, NOT a
violation of the within-tier ≤2–3× rule (that rule binds *consecutive within-tier goals*, never the
chapter-break tier step).

**Levers:** the **good/great/excellent triple per revealed pillar per tier** (the table above — only the first
three tiers ship in v1), **plus the great/excellent COUNTS** per tier (how many pillars must be great vs
excellent). Tune each band independently against playtest time-to-tier (§4.8). Keeping a gate's **good band ≈
band-top** of that tier (§4.0) is the design invariant; the absolute values are free. The **per-tier hour
budget each gate must take to fill** (T0 ≈ 4.5 h, T1 ≈ 8 h, T2 ≈ 16 h — as **FLOORS**, FU18) is **LOCKED by
human** — retune yields and band magnitudes, never the floor, if a playtest time-to-tier *undershoots*.

---

## §4.1.1 The rung-meter accrual law (the third progression curve — D-024/FU6)

**Shape (canon §1.6.4, §2.15.1 — fixed).** Phase 1's two parallel rung-meters — **Estate Service** (labour) and
**Combat Rank** (martial; *renamed from "Combat Standing"*, Q9) — are **numeric and PER-RUNG-RESET** (each rung
starts its meter at 0). A rung promotes on an **AND-gate**: `rungMeter ≥ thresholdForRung` **AND** all the
rung's `requiredStoryFlags` are set — the UI reads **"awaiting X"** when one side lags (FU6/Q30). The meter is
fed **only** by that rung's **curated, story-consistent activities** (a designed one-to-many set tagged by
`rungActivityTags`, authored **separately from** the pillar-deed inventory of §4.2.1) — **not** by raw
kills/XP (those feed the character level, §4.6.5) and **not** by pillar deeds (those are Phase-2, §4.2).

**The back-solve (the ≥30-min FLOOR is enforced on the METER POINTS — D-Q2).** Each rung's threshold is
back-solved against the **maximum** eligible-activity completion rate so that **even optimal FOCUSED play
cannot fill the rung's numeric-points objective in < 30 min** — the *meter threshold* is the runtime
enforcement of the ≥30-min floor (not a wall-clock check). **Unfocused play** (multi-skilling, side-quests,
off-objective wandering) earns the curated points more slowly and so takes **LONGER — ~60–120 min/rung**. The
§4.8.1 per-rung **wall-clock column** (35/40/45/55 min, etc.) is therefore **EXPECTED real, somewhat-unfocused
play — it sits ABOVE the 30-min focused-optimal floor and is NOT a contradiction with it.** The threshold is
in lockstep with the §4.8.1 koku column and asserted by the §6.6 gate-monotonicity verifier:

```
thresholdForRung(rung) = RUNG_FLOOR_MIN · eligibleActivityRate(rung)        // RUNG_FLOOR_MIN = 30 (min, a FLOOR)
//   eligibleActivityRate = curated activity-points the rung yields per minute at the intended pace
//   meter is measured in "rung activity-points (cap)"; per-event-capped like every other accrual
```

So the meter and the time floor are the **same constraint expressed two ways**: clear the curated activities
faster than the floor and the meter is *still* short of threshold (you cannot skip the floor); clear them at
pace and the meter and the floor land together. The activity *rate* drops slightly at higher rungs (their
curated activities are richer/slower), so the threshold falls gently (fewer activity-points fill the same ≥30-min floor as each activity is worth less per minute) while every rung stays ≥ 30 min.

**Proposed v1 T0 rung-meter thresholds** *(proposed v1 balance — back-solved from 30 min × the rung's rate)*:

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

**Levers:** `RUNG_FLOOR_MIN = 30` *(a FLOOR — LOCKED direction; the value is the minimum, not a ceiling)*; each
rung's `eligibleActivityRate` and the curated-activity set that realises it; the per-rung thresholds above. The
**per-rung-reset rule, the AND-gate with story, the curated-activities-not-kills feed, and the ≥30-min floor**
are **not levers** (canon).

---

## §4.2 The four-pillar ACCRUAL model (the PHASE-2 grind)

**Shape (canon §1.6.2, §2.16 — fixed).** Influence accrues in **exactly two shapes — never a passive
time-trickle, never a flat per-action increment — and ONLY on the PHASE-2 estate-influence track (FU7):**
pillar **DEEDS do not accrue while climbing the rungs** (gated post-final-rung; §4.0.1), which prevents the
"half the rungs, maxed deeds" state.

- **(A) Achievement JUMPS** — a concrete deed *recognized* by the relevant authority, **per-event capped**.
  **(PRIMARY growth driver — ≈70 % of each pillar's growth; LOCKED by human as "more from deeds.")**
- **(B) Periodic JUDGED RESULTS** — fired **every season** (4×/year; autumn harvest the headline), raising a
  pillar **only on a new high-water mark** (never repeatable maintenance). **(SMALLER top-up — ≈30 % of each
  pillar's growth; the appraisal seasons your deeds, it doesn't carry the tier.)** **Weather and festivals
  modulate these judged results mechanically, bounded ±10 %** (a day-keyed STATELESS derivation, Q35/FU3 —
  §4.7.1), and **bulk sales** apply a **saturation damper progressively per-unit** (Q42 — §2.4).

**The accrual split is LOCKED by human:** **deeds ≈⅔–¾ (we use 70 %)**, **seasonal ≈¼–⅓ (30 %)** of every
pillar's growth toward its **good band** (the §4.1 reference). The split is a *design target*, realised by
sizing the deed inventory (§4.2.1) and the seasonal `JUDGE_K` (§4.2.2) so the two streams add to the **good
band** in that ratio; the **exact 70/30** is a tunable *(proposed)* realisation of the locked "deeds dominate"
shape. The **great/excellent** bands above the good baseline are reached **predominantly by additional deeds**
(the specialisation surplus, §4.1) — the foreground stays the punchy deed stream throughout.

Up-only, with small scripted **per-pillar recoverable dents** (§4.2.4). The **trade ≤⅓** cap is a hard
invariant (§4.2.3). From **new-T2** the **PARTIAL Office-pairs cross-pillar combos** (§4.3.1 — Arms×Office,
Estate×Office, when Office reveals), **broadening to the FULL 4-pillar set at new-T3** (when Name reveals;
multiple pillar pairs, larger magnitude; D-Q31), join seasonal-reward rotation as the late-game anti-slump
device — computed
**post-trade-clamp**, **excluded from the trade-ratio denominator**, and **excluded from the deed-only
`gateEligibleValue`** the §4.1 gate checks (combos credit display `value`, never the gate; D-Q-meibutsu).

### §4.2.1 Achievement JUMPS — concrete values + per-event caps

A jump fires when a recognized **Phase-2** deed completes (a recorded yield, a granted title, a sealed
contract, a road declared safe in the books, a won petition, a nest cleared, the grain store defended). Each
deed carries a **base jump value** and is subject to a **per-event cap** = a fraction of the *current tier's
pillar GOOD band* (the §4.1 reference magnitude), so **no single fight or harvest spikes a pillar**:

```
jump = min( deedBaseValue, PER_EVENT_CAP_FRACTION · goodBand(pillar, currentTier) )
```

*(proposed v1 balance)* — **`PER_EVENT_CAP_FRACTION = 0.04`** (one deed can move a pillar at most ~**4 %** of
the way across its good band). **This is HALF the old draft's `0.08`** (canon "deed-jump size = SMALLER /
STEADIER (grindier)": growth is the sum of *many small acts*, never a few spikes). The cap is computed against
**that pillar's own GOOD band for the current tier** (= its §4.1 reference): T0 Estate cap = 0.04·0.8K =
**32 ip**, T0 Arms = 0.04·0.5K = **20 ip**, T1 Office = 0.04·2K = **80 ip**, T2 Arms = 0.04·30K = **1.2K**, T2
Office = 0.04·50K = **2K**, etc. **Every deed base in the table below sits at or under its own pillar/tier cap**
(a handful of intentional *at-cap* anchors — the DEFEND deed, the top road/alliance deeds — are labelled
*(cap)*). So **the cap virtually never silently clamps** a deed: bases were tuned *down* to fit under the cap —
the texture is *quantity of small deeds*, not a clamp on big ones. Reaching the **great/excellent** bands above
the good baseline is therefore a matter of **doing MORE of these small capped deeds in the specialised
pillar**, never of bigger jumps.

> **T0 has NO trade strand (Q29).** The TRADE sub-engine opens at **T1** (the village shop row is the first
> market — there is no market in T0; §2.4). The old T0 "Sealed trade contract" deeds are **deleted** and their
> ip **re-itemized into LAND + TREASURY deeds** (below). Trade contracts first appear in the T1/T2 columns.

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
PHASE 2 only** (post-final-rung; FU7), so their **cadence is read within the Phase-2 window** (Q20: ~5 min/act
at T0 · ~8 min at T1 · ~13 min at T2), **not** spread across the whole tier.

**T0 — good-band 70 % = 560 ip Estate / 350 ip Arms (NO trade strand):**
- **Estate (560 ip, 26 deeds — LAND + TREASURY only):** **LAND** = 1 *shinden* (30) + 12 yield milestones
  (12×16 = 192) = 222; **TREASURY** = 13 solvency steps (13×26 = 338) = 338 → **222 + 338 = 560** ✔.
  *(No trade contracts at T0 — the 6 old trade deeds, 72 ip, are absorbed into the LAND/TREASURY counts above;
  Q29.)*
- **Arms (350 ip, 30 deeds):** 20 minor clears (20×8 = 160) + 5 road-clears (5×18 = 90) + 5 defends
  (5×20 = 100) = **160 + 90 + 100 = 350** ✔.
- **Cadence (within T0's Phase-2 window):** ~26 Estate + ~30 Arms recognised deeds at **~5 min/act** (Q20).

**T1 — good-band 70 % = 5,600 ip Estate / 3,500 Arms / 1,400 Office (trade strand now OPEN):**
- **Estate (5,600, 35 deeds):** 9 yield (9×130 = 1,170) + 19 solvency (19×200 = 3,800) + 7 trade
  (7×90 = 630) = **5,600** ✔ (trade = 630 ip = **11.25 %** of the Estate deed-ip — well under ≤⅓, §4.2.3).
- **Arms (3,500, 35 deeds):** 25 minor (25×70 = 1,750) + 5 road (5×150 = 750) + 5 defend (5×200 = 1,000) =
  **3,500** ✔.
- **Office (1,400, 20 deeds):** 10 granted (10×60 = 600) + 10 allied (10×80 = 800) = **1,400** ✔.

**T2 — good-band 70 % = 42,000 ip Estate / 21,000 Arms / 35,000 Office / 19,600 Name** *(Name is now a REAL T2
gate, D-Q3 — its 70 % = 0.70·28K = 19,600)***:**
- **Estate (42,000, 31 deeds):** 16 yield (16×1.3K = 20,800) + 7 solvency (7×2K = 14,000) + 8 trade
  (8×900 = 7,200) = **42,000** ✔ (trade 17.1 %).
- **Arms (21,000, 20 deeds):** 6 minor (6×700 = 4,200) + 7 road (7×1.2K = 8,400) + 7 defend (7×1.2K = 8,400) =
  **21,000** ✔.
- **Office (35,000, 21 deeds):** 10 granted (10×1.3K = 13,000) + 11 allied (11×2K = 22,000) = **35,000** ✔.
- **Name (19,600, 21 deeds — the new T2 gate consumer):** 14 recognition (14×1.0K = 14,000) + 7 sponsored rite
  (7×0.8K = 5,600) = **19,600** ✔ (every base ≤ the **0.04·28K = 1.12K** cap; the residual 30 % = 8,400 is the
  seasonal stream, §4.2.2). Name's deed inventory accrues in **Phase 2**, post-G7, like every other pillar.

Every line above sums to exactly **70 %** of its **good** band (the residual **30 %** is the seasonal stream,
§4.2.2). The **great/excellent** bands are reached by **the same small capped deeds, done more often** in the
specialised pillars (§4.1). **(Q23: there is NO fixed quest-type / deed-type budget** — the inventory above is
the *minimum* that ties out; more and more-interesting recognised deeds are welcome, especially at later tiers,
and any added deed still obeys the per-event cap and ties out to the gate.)*

**Levers:** `PER_EVENT_CAP_FRACTION` *(now 0.04 — proposed; the **direction** "smaller than 0.08" is LOCKED by
human)*; each deed's per-tier base value; the deed→tier scaling (~**9–10×** per tier within a deed class,
≈`TIER_MAG`, with the seasonal stream supplying the residual 30 %); the **great/excellent specialisation
deed-counts** above the good baseline.

### §4.2.2 Seasonal JUDGED RESULT — the per-season formula (fires every season; high-water-mark only)

**Shape (canon — fixed).** Every season the scheduler (§2.2/§6.3 per-season hook) computes a **judged score**
per pillar from *accumulated state*, and **raises the pillar only if the score exceeds its stored
`highWater`** — then sets the pillar to that new score (Δ = newScore − highWater) and records the new
high-water mark. If the score does **not** beat the high-water mark, **nothing accrues** (no maintenance
trickle). Autumn is the headline (harvest), but **all revealed pillars are appraised every season.**

> **Phase reconciliation (FU7).** The seasonal pillar **CREDIT posts only in PHASE 2** (deeds-gated; pillars do
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
| **Estate & Wealth** | `landReclaimedKoku + treasurySolvency + min(tradeIndex, ⅓·estateTotal)` (a koku-scaled index; **no trade term at T0**) | T0 `ESTATE_REF_KOKU` · T1 10× · T2 100× (the koku-index reachable at each good-band) |
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
applied to the §4.1 **good-band** table. (**Name & Honour is a REAL gated pillar at T2 (D-Q3)**, so — exactly
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
| **Name & Honour** | — (not revealed) | **4,500** *(pre-reveal; 0.30·TIER_REF_NAME)* | **8,400** *(GATED: 0.30·28K good band, D-Q3)* |

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
| **T2 Name** *(GATED, D-Q3; smooth ramp — derivative basis, no autumn bump)* | 8,400 | 1,680 · 3,536 · 4,712 · 5,645 · 6,443 · 7,157 · 7,804 · **8,400** | **8,400** = 30 % of 28K ✔ |

So at every tier — **now including the GATED T2 Name pillar (D-Q3)** — the seasonal stream is **exactly 30 %**
of each **good** band, the deed inventory (§4.2.1) supplies the other **70 %**, and the two add to the §4.1
good band (Name: 8,400 seasonal + 19,600 deeds = 28K) — the locked 70/30 split, verifiable line-by-line.
*(The season-1 Δ is the largest because the high-water mark starts at 0; the **autumn** marks are
the diegetic headlines even when their numeric Δ is mid-pack — though Name, whose basis is the derivative
roll-up of the other three pillars, takes **no** autumn harvest bump. This tie-out is headlessly
regression-testable via §6.10.)* The **per-season hook also runs the §4.2.4 below-high-water dent-restore branch** (Q32 — a small
seasonal restore lifting a dented value toward its untouched high-water *without* advancing high-water).

**Levers:** `SEASONAL_SHARE = 0.30` (the one dial that sets the whole seasonal stream — its 30 % value realises
the LOCKED deeds-dominate split); `JUDGE_K[pillar][tier]` (the derived seasonal-ip table above = `SEASONAL_SHARE
· goodBand`); the **`TIER_REF[pillar][tier]`** normalizers (incl. `TIER_REF_NAME = armsGood+estateGood+
officeGood`) that make each `f_pillar` O(1) at good-band-top; the **autumn-basis bump** (~12 %); the exponents
inside each `f_pillar` (default `0.5`; lower = harsher diminishing returns). The high-water-mark rule, the
every-season cadence, the **phase-2-only credit**, **and the ≈30 %-seasonal / ≈70 %-deeds split direction
(LOCKED by human)** are not free to invert; only the magnitudes that realise it are levers.

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

> **Two V2 clarifications.** **(1) T0 has NO trade strand at all** — the TRADE sub-engine opens at **T1** (the
> village shop row is the first market; Q29). **(2) The §4.3.1 cross-pillar combos are computed AFTER this trade
> clamp AND are EXCLUDED from the trade-ratio denominator (D-Q-meibutsu).** The `estateTotal` in the ratio above
> is computed **without** any combo-sourced ip, so a combo can **neither** push trade past ⅓ **nor** inflate the
> denominator to admit more raw trade — the §6.6 verifier proves a combo can neither breach ⅓ in either
> direction, nor write the deed-only `gateEligibleValue` that satisfies a required pillar (a narrow, no-leakage
> exception). Trade ≤⅓ stays a HARD structural cap regardless of combos.

### §4.2.4 Recoverable DENTS (up-only with minor, scripted, per-pillar dips)

**Shape (canon §1.6.2 — fixed).** Up-only **except** rare, scripted, **per-pillar** dents (scandal→Name, called
debt→Estate, lost battle→Arms), **MINOR & quickly recoverable**, **never a wipe**, and the dent **never touches
`highWater`** (so it self-heals as play resumes the appraisal).

*(proposed v1 balance)*: a dent removes **`DENT_FRACTION = 0.10`** of the *current pillar `value`* (max one dent
active per pillar). **Dent self-heal (Q32) — the explicit below-high-water restore branch:** the per-season hook
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

> **`combatLevel` = the single combat-fed CHARACTER level (Q1/FU14).** The `combatLevel` term below is the
> **one** combat-fed character level (§4.6.5) — not a separate concept, never raised by labour or deeds.
> **The bounded labour→combat per-skill perk (FU8) is a SEPARATE additive channel (`skillCombatBonus`,
> §4.5.4), NOT a §4.3 conversion weight** — §4.3 still routes deeds→pillars with **no skill/level→Influence-
> direct edge**.

| Domain → pillar | Conversion weight (multiplier on deed base) *(proposed)* | Notes |
|---|---|---|
| **Combat** → **Arms** | `1.0 + 0.05·(characterLevel) + 0.10·(dangerRingClearedAbove)` | scale of the threat clears more Arms; **per-event cap (0.04) still binds** |
| **Labour (LAND/TREASURY)** → **Estate** | `1.0 + 0.04·(skillLevel of the labour skill)` | better farmer → bigger recorded yield jump (still capped at 0.04·good-band) |
| **Trade** → **Estate(trade strand)** | `1.0 + 0.04·(tradeSkill)`, then **⅓-clamped** (§4.2.3) *(trade opens T1; no T0 term)* | silk *meibutsu* graded quality raises the raw, both caps still bind |
| **Office/admin** → **Standing & Office** | `1.0 + 0.06·(officeRank) + 0.15·(allianceSealed?1:0)` | alliances (incl. marriage/adoption lever, T3+) weigh heaviest |
| **Recognition/deeds/patronage** → **Name** | `1.0 + 0.25·((armsHW+estateHW+officeHW) / TIER_REF_NAME)` *(normalized by the same explicit `TIER_REF_NAME` as §4.2.2)* | Name is *derivative* — it lags the other three by design |

**The marriage/adoption lever (T3+, parked):** a one-time **alliance** deed with an unusually large base
(roughly **a full per-event cap** into *both* Office and Name simultaneously) — canon's "real late-game lever."
Numbers detailed when T3 is authored.

**Interaction with the locked deeds-dominate split.** These multipliers grow a deed's *base* with how well
it was performed, but **every result is still clamped by the §4.2.1 per-event cap of 0.04**. So even a
high-skill master cannot turn one deed into a spike — the cap keeps growth in the *many-small-acts* regime
the human locked. The conversion weights therefore tune **which deeds feel rewarding to specialise in** (and
which pillars are easiest to push to great/excellent, §4.1), not the overall deeds-vs-seasonal balance (that's
fixed by §4.2.1/§4.2.2 sizing).

**Levers:** the per-domain coefficients (the `0.04`–`0.25` multipliers). The **structural routing** (which
domain → which pillar, no cross-feed except the named roll-ups + the §4.3.1 combos, Name-as-derivative) and the
**deeds-dominate split** are **not levers**; the coefficients that realise them are.

### §4.3.1 Cross-pillar combos — the T2/T3 anti-slump exception (PARTIAL at new-T2, FULL at new-T3) (D-031 / Q22 / FU20)

**Shape (canon §1.6.1, §2.16 — fixed; BROADER than the lean proposal).** Cross-pillar combos arrive in **two
waves keyed to pillar reveals** (the reshape splits the old single "T2" onset, D-048): a **PARTIAL Office-pairs
set opens at new-T2 (Village, when Office reveals)**, broadening to the **FULL 4-pillar set at new-T3 (Region,
when Name reveals)**. A recognised deed that **genuinely satisfies two domains at once** (a secured road that is
also a chartered office; a famed product that is also a treasury win) emits a small **cross-pillar combo** bonus
into **both** pillars of the pair — the late-game **anti-slump device**, paired with seasonal-reward **rotation**
(§2.16). V2 makes this **broader than the old single Name-only rebate**: **multiple pillar pairs** and a
**larger magnitude** (Q22/FU20). It is a **narrow, no-leakage exception** to the §4.3 "one domain → one pillar"
routing, fenced by four hard rules:

1. **Computed AFTER the trade-≤⅓ clamp (§4.2.3), and EXCLUDED from the trade-ratio denominator (D-Q-meibutsu).**
   A combo's Estate component is added to the **already-clamped** Estate total **for display only**; the
   `estateTotal` used to compute the trade ratio (§4.2.3 denominator) is taken **without** any combo-sourced ip,
   so a combo can **neither** push the trade strand past ⅓ **nor** inflate the denominator to let *more* raw
   trade in — it cannot bend the cap in **either** direction (verifier-proven, §6.6).
2. **Counted INSIDE the deeds budget + the 0.04 per-event cap.** A combo is not free extra ip — each side is a
   capped deed-jump (≤ 0.04·good-band of its pillar), so the 70/30 split and the band tie-outs (§4.2.1) hold.
3. **EXCLUDED from the §4.1 gate-threshold check — combos never write the `gateEligibleValue` accumulator
   (D-Q5/D-Q-meibutsu).** Each pillar carries a **deed-only additive `gateEligibleValue`** accumulator that
   **combos do NOT write**; the §4.1 gate ("good in ALL revealed pillars · great in 2–3 · excellent in 1–2") is
   evaluated against `gateEligibleValue`, so **combo-sourced ip is not counted** — a combo can **NEVER**
   substitute for being good/great/excellent in a pillar on its own merits. It raises the pillar's displayed
   `value` and smooths the *grind feel*, never the gate.
4. **Bounded as a rebate within the envelope.** A combo's two sides sum to **≤ one per-event cap total**
   (split across the pair), so the broadened magnitude stays inside the 70/30 + 0.04 envelope.

**Proposed v1 combo pairs — split by reveal wave** *(proposed v1 balance)*: the **PARTIAL set at new-T2
(Office reveals)** = **Arms × Office** (a road secured *and* a route chartered) · **Estate × Office** (a
chartered trade office); the set **completes at new-T3 (Name reveals)** = **+ Estate × Name** (a celebrated
*meibutsu*) · **+ Arms × Name** (a famed clearing that burnishes the house). Each combo deed splits
**≈0.02·good-band into each pillar** (≈ half a per-event cap each, ≤ one cap total). The **§6.6 verifier
proves** a combo can never breach the ⅓ trade cap nor satisfy a required-pillar gate.

**Levers:** which pillar pairs combo, the per-pair magnitude (within the ≤-one-cap envelope), the **two-wave
onset (Office-pairs at new-T2, the Name-pairs completing the set at new-T3)**. The **post-clamp computation, the
gate-check exclusion, and the ≤⅓-unbreachable proof** are **not levers** (canon).

---

## §4.4 The rich ATTRIBUTE system (STR / AGI / INT / SPD / LUCK)

**Shape (canon §G, §2.7 — fixed).** Five interacting attributes, **stored as base values** (recompute
effective on load = base + gear + milestones, §6.4). Attributes start **near-mediocre** and rise only via the
combat-fed **character level** / milestones / gear (mediocre-start). Each attribute has **labour effects and
combat effects** so it is never a dump stat.

> **The cross-feed wall — what STAYS and what RELAXES (Q6/FU8).** The **no-labour→combat-VIA-ATTRIBUTES wall
> STAYS**: attributes remain **combat-fed only** — **labour skills never grant STR/AGI** (or any attribute that
> feeds a combat-derived stat). What *relaxes* is a **separate, bounded channel**: per-skill perks may add a
> small **`skillCombatBonus`** addend (NOT an attribute, NOT character level — §4.5.4). So the *attribute* math
> below is still gift-free of labour; the small labour→combat polish lives entirely in `skillCombatBonus`.
> **The combat-fed character level (§4.6.5)** grants **+1 attribute point / 2 levels** + HP + satietyMax.

| Attr | Combat effect *(proposed)* | Labour effect *(proposed)* |
|---|---|---|
| **STR** (力) | `attackPower += 1.2·STR` (melee); `defense += 0.5·STR`; `hpMax += 2·STR` (§4.6.1); raises carry/durability damage | labour yield `+0.8%·STR`; hauling capacity `+2·STR`; lower stamina cost on heavy work |
| **AGI** (敏) | `evasion += 0.6·AGI`; `critChance += 0.2%·AGI`; hit-accuracy `+0.4·AGI` | gathering speed `+0.6%·AGI` (forage/fish); craft success `+0.3%·AGI` |
| **INT** (智) | `+0.5%` damage vs known bestiary entries; better stance/ability effects | craft quality `+0.7%·INT`; recipe unlock thresholds eased; office/admin deed weight `+0.5%·INT` |
| **SPD** (速) | `attackSpeed += 0.5%·SPD` (faster swings — see cadence §4.6.2); turn-order/first-strike | action tick-cost `−0.3%·SPD` (faster labour cycles, floored) |
| **LUCK** (運) | `critChance += 0.1%·LUCK`; `blockChance += 0.1%·LUCK`; rare-loot weight `+0.5%·LUCK` | better gather/forage rare-drop odds; market price-swing favourability |

**Starting attributes (mediocre-start contract):** all five start at **5** (out of an early soft-cap of ~30
by end-T0, ~80 by end-T2). The MC's only edge is *temperament* (narrative), **never a stat** (canon §A,
§1.4). **Attribute points:** **+1 point every 2 character levels** (§4.6.5), plus milestone grants.

> **NO RESPEC IN v1 (LOCKED by human, canon §I-bal).** Attribute-point allocations are **committed** — there is
> **no reset / re-spend lever in v1**. Every point spent on STR/AGI/INT/SPD/LUCK is permanent; the build you
> grow is the build you keep. (A late-game respec may be reconsidered post-v1, but it is explicitly **out** of
> the v1 balance lock and must NOT be implemented as a v1 dial.) This makes the dual labour+combat purpose of
> each attribute load-bearing: because you can't undo a choice, no attribute may be a dump stat — which the
> §4.4 table already guarantees.

**Levers:** every coefficient in the table; starting value (5); points-per-level cadence; the soft-caps per
tier. The **five-attribute identity, the dual labour+combat purpose of each, the no-attribute-cross-feed rule
(distinct from the bounded `skillCombatBonus` channel), and the no-respec-in-v1 rule** are **not levers** (the
last is LOCKED by human).

---

## §4.5 Per-skill XP curves, per-event caps & milestone perks

**Shape (canon §G, §2.7 — fixed).** Per-skill `total_xp` pools (stored), **levels derived** from a curve;
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

*(proposed v1 balance)*: `XP_BASE = 50`, `XP_GROWTH = 1.18`. So L1→L2 costs 50 xp, L10 cumulatively ~**1.2K**,
L25 ~**17K**, L50 ~**1.1M** xp. **Visibility threshold** = a skill surfaces in the UI at **cumulative 30 xp**
(~one good session) so it reads as a discovery, not a pre-listed menu. **Soft level cap per tier**: T0 ≈
**L15**, T1 ≈ **L30**, T2 ≈ **L50** (you *can* exceed, but XP cost makes the next tier's content the efficient
path — this is what stops a player grinding T0 to god-tier).

### §4.5.2 Per-event XP caps (breadth-forcing)

```
xpGain = min( actionXp, PER_EVENT_XP_CAP_FRACTION · xpForLevel(currentLevel+1) )
```

*(proposed)* `PER_EVENT_XP_CAP_FRACTION = 0.25` — **one action can advance a skill at most ¼ of the way to its
next level**, so leveling always takes **≥4 actions** and a lucky big harvest/kill can't one-shot a level.
This is the same per-event-cap discipline canon mandates for combat *and* Influence.

### §4.5.3 Milestone perks (the build web)

Milestones at **levels 5 / 10 / 25 / 50** per skill (lever). Perk magnitudes *(proposed)*:

| Milestone | Typical perk | Example |
|---|---|---|
| **L5** | small flat stat or `+5%` skill efficiency | Farming L5: `+5%` koku/harvest |
| **L10** | a title (feeds Name flavour) + a recipe unlock **or** a small combat perk *(see the perk model below)* | Smithing L10 (labour): unlocks component-craft tier + a small `skillCombatBonus`; Swordsmanship L10 (combat): `+1 STR` |
| **L25** | a `×1.10` multiplier or a cross-skill XP bonus (`+5%` to a *sibling* skill) | Foraging L25: `+5%` XP to Cooking |
| **L50** | a `×1.25` capstone multiplier + a marquee unlock | Combat-weapon L50: stance slot / signature ability |

**No milestone ever reads a returning-memory or porter's-knot flag** (no-hidden-edge guard, §1.4/§2.7c —
canon, encoded at the type level). Cross-**skill** XP bonuses go skill→sibling-skill **only**.

> **The cross-feed callout — FLIPPED to the bounded per-skill-perk model (Q6/FU8 — supersedes the old `==0`
> type-wall).** The old draft enforced "a LABOUR skill can **NEVER** grant a combat-feed attribute (STR/AGI),
> labour→combat == 0." V2 **relaxes** this: **every skill (labour AND combat) carries a perk track** of
> **~2–8 perks** (or small flat bonuses) **unlocked by levelling that skill** (§4.5.4). A **labour-skill perk MAY
> include a small `skillCombatBonus`** — a **separate additive term, NOT an attribute and NOT character level**.
> The hard line that **stays**: a labour-skill milestone **still may not grant STR/AGI** (or any combat-feed
> *attribute*) — the bounded polish lives only in the `skillCombatBonus` channel, never in the attribute math.
> Only **combat-skill** milestones (weapon lines, conditioning's combat facet) may grant STR/AGI. So a milled-out
> labourer is **a little** more combat-capable (capable→a-bit-more-capable), but **big combat power stays
> combat-only**, and the §6.6 verifier flips from asserting the cross-feed `== 0` to asserting **each perk
> magnitude is small/bounded** (no single global ≤CAP — per-perk smallness; §4.5.4 / Q28). **Conditioning stays
> the ZERO-stat enablement gate** and the perk channel must never bypass it.

> **NO RESPEC IN v1 (LOCKED by human, canon §I-bal).** Where a milestone offers a *choice* (a branch perk, a
> stance slot, a "pick one of two"), that choice is **committed** — there is **no reset / re-pick lever in v1**.
> Skills still level freely by doing; a milestone *selection* once taken is permanent. Mirrors the attribute
> no-respec rule (§4.4). A post-v1 respec is explicitly **out** of the v1 balance lock.

### §4.5.4 Per-skill perk tracks — the bounded labour→combat channel (NEW — D-027 / FU8)

**Shape (canon §2.7.1 — V2-fixed).** **Every skill** (labour skills included) carries a **perk / flat-bonus
track** — **~2–8 perks** per skill — **unlocked by levelling that skill.** Each perk may add a **small combat
bonus** through a **dedicated `skillCombatBonus` channel**, kept **off** the attribute/level math (it is summed
independently and applied to `attackPower` in the combat sim, §4.6.1). This is the **gift-vs-work** line, not
labour-vs-combat: nothing is *given* by birth/memory; reps *earn* small bonuses.

**Boundedness without a hard global cap.** Perks are **stackable with NO hard global cap** (FU8 supersedes Q6's
"small CAPPED"). They stay bounded by **three soft levers** instead:

1. **Small per-perk magnitude** — individually tiny *(proposed: each combat-relevant perk adds ~`+0.5` to `+2`
   flat `attackPower`-equivalent, or a ~`+0.5%` to `+1.5%` modifier — see the table)*.
2. **Incremental skill unlock** — perks reveal **per rung/tier**, never front-loadable (the real bound;
   §2.7.1(b)/§4.5).
3. **Holistic enemy/drop scaling** — encounter difficulty is tuned against the *expected total* perk stack
   (gear/level/attrs/enemy-scaling grow together); the modest power-creep risk is **accepted** (Q6/FU8).

**Proposed v1 perk magnitudes** *(proposed v1 balance)*:

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

**Verifier (Q28).** The §6.6 content verifier **flips** from asserting the labour→combat edge `== 0` to
asserting **each `PerkDef.combatBonus` is small/bounded** (`0 < magnitude ≤ PER_PERK_MAX`, a small per-perk
ceiling — *not* a single global aggregate cap) and that **conditioning's perks are exactly 0** (§2.20).

**Levers:** the per-perk magnitudes; the per-skill perk counts (~2–8); the unlock-level cadence;
`PER_PERK_MAX`. The **conditioning-stays-zero rule, the separate-channel rule, and the no-attribute/no-level
routing** are **not levers** (canon).

---

## §4.6 The COMBAT math (idle auto-resolve)

**Shape (canon §E, §2.8 — fixed).** Idle auto-resolve + active setup: prepare gear/stance/area → a
**deterministic seeded fight** resolves on a fixed-step sub-tick sim (one RNG, §6.7) → intervene with
stance/ability/item/retreat. **INCREMENTAL** (T0 starts with **exactly one** weapon; a growing roster on the
combat-reveal ladder, §4.6.9). **Mediocre-start preserved** (start near-zero; humbling near-fatal first fight;
earned via grind; conditioning the zero-stat gate). **Failure = soft setback** (HP/time, maybe drop carried
loot, take a rest-off injury) — **never** lose levels/gear/permanent progress.

> **HP CARRIES between fights + heals by EATING (D-050).** A fight starts at the MC's **carried HP** (never
> reset to `hpMax`); the auto-loop **rests and eats (satiety) to recover** (§4.6.1b/§4.6.6b), so HP retention is
> a **real between-fight resource**. This makes the **Defensive stance's HP-retention genuinely trade against
> Aggressive's speed/damage — so NO stance is strictly dominated** and Balanced is no longer a trap (§4.6.10);
> the v0.2 test that *enshrined* stance dominance is **replaced** by a **"no stance strictly dominated" curve
> invariant** (§6.6). **The signed 20–35 % SINGLE-fight win-rate band is UNCHANGED under HP-carry (D-058):**
> HP-carry shapes the *grind* (a run of fights), **not** the discrete first-fight moment — a **real foe is tuned
> into the 20–35 % band** at realistic durability/satiety, backed by a **RED-able foe-in-band test** (§4.6.6/
> §4.6.7). No re-expression of the first-fight criterion.

### §4.6.1 Combatant model & derived stats

The MC's effective combatant is derived from **attributes + the combat-fed character level + the equipped
weapon's archetype + the `skillCombatBonus` aggregate (§4.5.4) + gear**, then scaled by the **durability band**
(§4.6.1c) and the **satiety `satietyRate`** multiplier (§4.6.1b):

```
skillCombatBonus = Σ( unlocked per-skill perk combat addends )         // §4.5.4 — bounded, no global cap, conditioning = 0
attackPower  = ( weaponBase + 1.2·STR + gearAtk + 0.3·weaponSkillLevel + skillCombatBonus ) · satietyRate · durabilityBand(weapon)
attackSpeed  = weapon.baseSpeed · (1 + 0.005·SPD) · stance.speedMod · satietyRateSpeed   // PER-WEAPON baseSpeed (§4.6.9); lighter satiety touch
evasion      = 0.6·AGI + gearEva + stance.evasionMod                   // an evasion *rating*, not a flat %
accuracy     = 10 + 0.4·AGI + 0.3·weaponSkillLevel                     // an accuracy rating
defense      = ( gearDef + 0.5·STR + stance.defMod ) · durabilityBand(armour)   // armour band applies identically
critChance   = 0.02 + 0.002·AGI + 0.001·LUCK   (cap 0.50)
blockChance  = gearBlock + 0.001·LUCK          (cap 0.40, requires a shield/guard)
hpMax        = 40 + 8·characterLevel + 2·STR + gearHp                  // characterLevel = the COMBAT-FED level (§4.6.5)
satietyMax   = SATIETY_BASE + SATIETY_PER_LEVEL·characterLevel         // Q47 — base + per-level growth off the combat-fed level
```

*(proposed v1 balance)*: `SATIETY_BASE = 100`, `SATIETY_PER_LEVEL = 4`. Every `characterLevel` above is the
**single combat-fed character level** (§4.6.5 — the one curve; never raised by labour or deeds, Q1/FU14).
`skillCombatBonus` is the **bounded** per-skill-perk channel (§4.5.4); `satietyRate` / `durabilityBand` are
**combat-only** scalers (below). **Conditioning contributes ZERO** to any term here (the enablement gate only
*unlocks* the track).

### §4.6.1b Satiety → combat throttle (NEW — D-035 / Q31 / FU16)

**Shape (canon §2.3/§2.8 — V2-fixed).** Combat is **satiety-throttled** ("eat before you fight"). A
**`satietyRate` multiplier** scales `attackPower` (a lighter `satietyRateSpeed` on `attackSpeed`) — a **SEPARATE
combat coefficient** from the labour `STAMINA_RATE_FLOOR` (§4.7.1), so the two tune independently:

```
satietyFrac = satiety / satietyMax
satietyRate = ( satietyFrac ≥ 0.7 ) ? 1.0
            : lerp( SATIETY_COMBAT_FLOOR, 1.0, satietyFrac / 0.7 )      // flat above ~0.7, knee down to the floor
SATIETY_COMBAT_FLOOR = 0.5     // *(proposed v1 balance)* — a rate multiplier, never to zero
satietyRateSpeed = 0.5·(1 - satietyRate) + satietyRate                  // lighter touch on attackSpeed
```

**"Adequate satiety" = `satietyFrac ≥ ~0.7`** (`satietyRate = 1.0`). The **locked 20–35 % first-fight win-rate
is measured AT adequate satiety** (§4.6.6) — an underfed protagonist fares worse still. The throttle is
**bounded** so the floor only costs a few win-rate points (**never pushes win-rate below ~15 %** — *proposed v1
balance*). **Levers:** `SATIETY_COMBAT_FLOOR` (0.5), the 0.7 knee, the speed-touch weight. The **separate-
coefficient rule, the "win-rate measured at ≥0.7" reference, and the ≥~15 % floor** are **not levers** (canon).

### §4.6.1c Graded durability bands (NEW — D-034 / Q33 / FU17)

**Shape (canon §2.8(b)/§2.10 — V2-fixed).** Weapon `attackPower` is scaled by **4 graded durability bands**, and
**armour `defense` by the same bands**, with **FIXED wear per FIGHT** (cheap, replay-stable — not per swing):

| Band | durability fraction of `durabilityMax` | multiplier |
|---|---|---|
| Fresh | **≥ 75 %** | **1.0** |
| Worn | **≥ 50 %** | **0.9** |
| Battered | **≥ 1 %** | **0.75** |
| Broken | **= 0** | **0.55** |

*(proposed v1 balance)* `WEAR_PER_FIGHT ≈ 3 %` of `durabilityMax` per resolved fight. A weapon is **NEVER
auto-unequipped**: it stays equipped and functional even at 0 (the **0.55 floor**) — the MC is **never
weaponless** (auto-battler safety). **Repair / re-craft restores durability to max** (§2.10/§2.11). **Levers:**
the 4 band thresholds & multipliers; `WEAR_PER_FIGHT`. The **never-auto-unequip / never-weaponless rule, the
fixed-per-fight wear, and the band count** are **not levers** (canon).

### §4.6.1d Enemy (MobDef) derived stats — the `level → {attackPower, defense, HP}` rule (NEW — Block N.1 #1)

**Shape (canon §2.9 — V2-fixed; required by the analytic win-rate, D-Q-winrate).** §4.6.1 derives the MC's
combatant fully; **the enemy uses the SAME curve family**, derived from a single hand-tunable per-mob field
**`MobDef.level`** (FU15 — §2.9). One linear-in-level rule per stat (mirroring the MC's `40 + 8·level` HP / STR-
scaled attack & defence shapes), so a fight is **two derived stat blocks** and the win-probability is computable
in **closed form** (no sampling):

```
// MobDef.level = L  (hand-tunable; DEFAULTS to the mob's dangerRing expected character-level — §2.9/FU15)
mob.HP          = MOB_HP_BASE  + MOB_HP_K ·L          // same family as hpMax = 40 + 8·characterLevel
mob.attackPower = MOB_ATK_BASE + MOB_ATK_K·L          // same family as the MC weaponBase + 1.2·STR block
mob.defense     = MOB_DEF_BASE + MOB_DEF_K·L          // same family as gearDef + 0.5·STR
mob.accuracy    = MOB_ACC_BASE + MOB_ACC_K·L
mob.evasion     = MOB_EVA_BASE + MOB_EVA_K·L
mob.attackSpeed = mob.baseSpeed · (1 + 0.005·MOB_SPD) // mob.baseSpeed = its archetype cadence (default 1.0)
mob.critChance  = MOB_CRIT      (default 0.02)        // mob.blockChance = MOB_BLOCK (default 0 — most beasts)
```

*(proposed v1 balance)*: `MOB_HP_BASE = 24`, `MOB_HP_K = 8` (the MC's HP slope); `MOB_ATK_BASE = 8`,
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

Combat runs on an internal **sub-tick accumulator** (§2.8c). **`baseSpeed` is now PER-WEAPON** (the old single
`baseSpeed = 1.0` is **superseded** — each weapon's `baseSpeed` is its archetype identity, §4.6.9). A weapon's
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
floor is NOT applied here** — it is clamped on the **FINAL post-crit/post-block damage** in §4.6.4 (the ordering
fix below), so a block can never push final damage under the floor *or* a pre-floored value get re-inflated by a
crit. Note `attackPower` already carries the **durability-band × satietyRate** scaling (§4.6.1).

### §4.6.4 Crit / block — and the FINAL damage-floor clamp (ordering fix)

```
on hit:  dmg = mitigated                                             // from §4.6.3 (rawDamage − defense, NOT yet floored)
         if rngChance(critChance)            → dmg ·= CRIT_MULT       (CRIT_MULT = 1.5)
         if defender rngChance(blockChance)  → dmg ·= (1 − BLOCK_REDUCTION)   (BLOCK_REDUCTION = 0.5)
         damage = max( DAMAGE_FLOOR, dmg )                            // CLAMP THE FINAL POST-MITIGATION DAMAGE (D-Q fix)
```
Crit and block are **separate seeded rolls** (§2.8c). **The damage floor is applied ONCE, LAST** — after both
crit and block have multiplied `mitigated` — so the chip-damage guarantee always holds on the value the
defender actually loses (the old draft floored *before* crit/block, letting a block drop the final hit below the
floor and a crit re-inflate a floored value — both fixed). **Levers:** `CRIT_MULT` (1.5), `BLOCK_REDUCTION`
(0.5), the chance caps (0.50 / 0.40). The **floor-applied-last ordering** is **not a lever** (canon).

### §4.6.4b Expected win-probability — ANALYTIC for the gate / fixed-seed SAMPLED (n=400) for the display (NEW — D-Q-winrate; AMENDED D-057)

**Shape (V2-fixed; AMENDED 2026-06-29 by D-057 — the analytic/sampled SPLIT).** The win-rate is computed **two
ways for two consumers (D-057, amends signed D-043):** the **tier/gate threshold check is ANALYTIC** — computed
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
`MobDef.level`; the M3/M6 harness produces both, and the §6.10 regression asserts the **displayed (sampled)**
value the player sees is the value the guard test asserts (**displayed == tested == same-for-every-player**).
**Levers:** none here — both the analytic `P_win` and the fixed-seed sample are fully determined by the §4.6
stat formulae + the fixed seed; tuning happens on those inputs (`MOB_*`, gear, `MobDef.level`). The
**analytic-for-gate / fixed-seed-sampled(n=400)-for-display SPLIT** (D-057) is **canon**.

### §4.6.5 On-kill rewards & the ONE combat-fed character-level curve (THREE-track separation)

**The single combat-fed character-level curve (defined ONCE here; referenced by §4.0.1/§4.4/§4.6.1).** A kill
writes **combat-XP** to `character.combatXp` only; the level is derived from cumulative combat-XP:

```
combatXpForLevel(L)      = round( CL_BASE · CL_GROWTH^(L-1) )          // integer-pow (no Math.pow; §6.1)
totalCombatXpForLevel(L) = sum_{i=1..L} combatXpForLevel(i)
//   level → drives: hpMax = 40 + 8·characterLevel (§4.6.1)
//                   satietyMax = SATIETY_BASE + SATIETY_PER_LEVEL·characterLevel (§4.6.1, Q47)
//                   +1 attribute point every 2 character levels (§4.4)
```

*(proposed v1 balance)*: `CL_BASE = 60`, `CL_GROWTH = 1.18`. **This is the ONLY "level" concept in the game** —
labour skills and pillar deeds **never** raise it (Q1/FU14); no other section re-derives a "level."

**A kill writes exactly:**
- **Combat XP → the CHARACTER level** = `mobLevel · COMBAT_XP_K`, then per-event capped (§4.5.2). `COMBAT_XP_K =
  12` *(proposed)*. **`mobLevel` = the explicit per-mob `MobDef.level` field** (hand-tunable; defaults ~ the
  `dangerRing`'s expected character-level; FU15 — §2.9).
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
  fight** (a wolf, §2.8/§2.9) is tuned so a fresh MC wins only **~20–35 %** of the time **(LOCKED by human,
  canon §I-bal — "humbling-but-winnable; drives the player to train"), measured AT adequate satiety
  (`satietyFrac ≥ ~0.7`, §4.6.1b)** — survivable by luck/stubbornness, never skill; meant to be *barely*
  survived, then motivate training (an underfed MC fares worse still). After ~a season of drills (weaponSkill
  ~5, attrs ~10, a smith-forged blade), win-rate against that same wolf is **~85 %+**. **Conditioning enters
  none of these numbers** — it is a one-way *enablement gate* only; and the first-fight numbers are measured
  **without heavy per-skill-perk stacking** (the small `skillCombatBonus`, §4.5.4, exists but is not yet milled
  out at R3). Under the longer saga (a FLOOR), "~a season of drills" is ~30–40 min of real R3 play — the climb
  from ~25 % to ~85 % is felt as *earned over real time*.
- **Soft setback on loss (LOCKED by human "as proposed", canon §I-bal):** a lost fight → MC drops to **1 HP**
  (not death), advances **~½ a day** of clock (the recovery), takes a **random light injury** (`InjuryState`,
  heals in ~**1–2 days** of rest, a small `−10%` to one stat meanwhile), and **drops a real bite of CARRIED
  wealth** (the v0.3.1 loss penalty — §4.6.6b: ~20% of carried koku + ~⅓ of carried materials; **what's BANKED
  in the kura storehouse is SAFE**, §4.6.6c), **never equipped gear, never levels, never Influence** (the only
  Influence movement on a loss is a *scripted* Arms dent if the lost fight was a defence-deed, §4.2.4/§4.6.8).
  **Never** a level/gear/permanent loss (canon §E). The **severity SHAPE** (1 HP + ~½-day + light injury + a
  **carried-wealth bite**, never permanent progress) is **LOCKED**; the bite-fraction magnitudes are levers
  (D-059). _(D-076 + batch-2 turned the old "possible loot drop" into a defined bite — D-086 tension.)_
  **Levers (magnitudes only):** the drop-loot chance, injury severity/duration, the ½-day clock cost. The
  **first-fight win-rate target (20–35 %, at adequate satiety)** and the **soft-setback shape** are **LOCKED,
  not levers.**

### §4.6.6b Unattended combat — accumulating HP + two auto-modes (REVISED — D-076 + batch-2, v0.3.1)

> **⚠ SUPERSEDES the original "self-recovering auto-retreat loop" (D-076 + the 2026-07-01 batch-2 calls;
> ADRs D-090/D-091).** The old model auto-retreated by default and auto-rested back to full, so a loss never
> really bit — the **tension-over-generosity** reread (D-086) reverses that. Built + shipped in v0.3.1 Step 3.

**Shape (canon §2.8 — D-076).** Combat is **full-auto while the tab is open** (active-only, FU23), but **HP
ACCUMULATES** — it carries between fights and the ONLY mend is eating (D-050); there is **no auto-heal**. So a
foe that deals **≥1 damage** grinds you down across a run, and the **only** foe safe to auto-grind forever is a
**0-damage** one. The player owns the risk by picking, **per foe**, one of **two auto-modes**:

1. **Auto-fight (to the end).** Grind until you win or **die**. A lost fight is a real outcome (below).
2. **Auto-fight, retreat @20%.** Break off on a **turn** where HP drops **below `AUTO_RETREAT_FRAC` (~20%) of
   max** — a **per-turn** check, so a burst foe that one-shots you past the threshold still **kills** you (a
   killing blow is a loss, not a flee). A flee earns no reward and **no penalty**, but you're hurt and the
   **autopilot STOPS** (mend + re-engage deliberately).

**A lost fight (0 HP)** — the `applyGrindFight` loss path: the soft setback (§4.6.6: **1 HP**, ~½-day) **AND**
the **autopilot STOPS** (no auto-resume) **AND** you **drop a real bite of CARRIED wealth** — `LOSS_KOKU_FRAC`
(~20%) of carried koku + `LOSS_MATERIAL_FRAC` (~⅓, floored) of carried materials. **What's BANKED in the kura
storehouse (§4.6.6c) is safe.** Still **never** a level/gear/Influence loss (canon §E). The autopilot stopping
(not auto-resuming) is the D-076 reversal: the player **feels** the loss and chooses to recover, rather than the
loop papering over it.

**Levers (magnitudes only):** `LOSS_KOKU_FRAC` / `LOSS_MATERIAL_FRAC` / `AUTO_RETREAT_FRAC`, the setback clock
cost (D-059, liquid). The **no-auto-heal / accumulating-HP rule, the two-auto-mode shape,
loss-stops-the-autopilot, and loss-bites-carried-but-not-banked** are **canon, not levers.** The combat log is
**summarised** — one outcome line per fight (the auto-grind fires it hundreds of times; batch-1 call 2).

### §4.6.6c The kura storehouse — carried vs banked wealth (NEW — batch-2 call 7, v0.3.1; D-090)

Wealth splits into **carried** (`state.resources` — on you, at RISK on a lost fight) and **banked**
(`state.banked` — sheltered in the kura storehouse, SAFE from the loss penalty). **Deposit/withdraw** move a
resource between the two; spending + earning use carried (banked is a safe reserve). Today deposit/withdraw open
with the estate economy; **Step 5 gates them to the kura node** — so banking your haul means physically
returning home, and fighting far afield with a full purse becomes the gamble. The risk/reward — bank before a
risky fight, or carry it and chance the bite — is the point (D-086 tension). _Exact magnitudes liquid (D-059)._

### §4.6.6d T0 koku sinks — scarcity by design (NEW — v0.3.1 Step 4; D-092 / D-086)

The T0 koku economy is deliberately **tight** (D-086 — scarcity is the default; net koku stays low
through T0, rich only at T5). The sinks span all three directions: a **repair FEE**
(`REPAIR_KOKU_COST` koku on top of wood — a **soft** fee, WAIVED when you can't pay, so combat
upkeep bites but never softlocks, D-061), the **estate ladder** (E1–E4 — the main koku sink + the
yield flywheel), and a **capped market** (a MINORITY lane — total spend ≤ ⅓ of the estate sink,
D-008). _All magnitudes liquid (D-059). The §4 6-tier balance re-derivation (T1 Estate-full bands +
per-tier floors) is a separate final-pass concern; battery #15's material sink is a Step-7 item._

### §4.6.7 Win-rate bands — the 2nd pacing proxy (NEW — Q16 / FU19)

**Shape (V2-fixed).** Beyond the §4.8 time floor, a second headless **fun-proxy** asserts the combat difficulty
curve at each tier's combat-entry rungs: **fresh-at-rung** (just reached, before that rung's intended
training/gear) should be **humbling** (~30–45 %, with R3's **20–35 %** the anchor), and **comfortable** after
that rung's intended training/gear (**~80 %+**), tightening slightly per tier. The **displayed** band values are
the **fixed-seed sampled (n = 400) forecast** (`combat.foeForecasts`); the **gate** check uses the **analytic
closed-form `P_win(MC)`** (§4.6.4b) — the **analytic-for-gate / sampled-for-display split** (D-057), with
**displayed == tested == same-for-every-player** — evaluated **at adequate satiety (≥~0.7)**. *(proposed v1
balance — tune-later magnitudes; rung tiers below are the **new** spine, §4 RESHAPE NOTE)*:

| Combat-entry rung | fresh-at-rung win-rate | after intended training/gear |
|---|---|---|
| **R3** (first fight, **T0** Estate-tutorial) | **20–35 %** *(the LOCKED anchor)* | ~85 %+ |
| **Sword-line opening** (**T1** Estate-full — first T1 combat-entry rung) | *(band re-derives at Ship-M1-F2 under the new spine; humbling per D-061)* | ~80 %+ |
| **V2** (road-warden, **T2** Village — first HUMAN threat) | ~35–45 % | ~80 %+ |
| **V5** (sworn man-at-arms, **T2** Village) | ~35–45 % | ~80 %+ |
| **G1** (road-captain, **T3** Region) | ~30–40 % | ~80 %+ |
| **G5** (road-detail / Hanzaki, **T3** Region) | ~30–40 % *(survived, not won)* | ~75–80 % |

These are wired into the M3/M6 fun-proxy harness (§7) **alongside** the §4.8 pacing floor — together the two
proxies are the playable bar (not just "it compiles"). **Levers:** every band magnitude (mob stats, gear tiers,
`MobDef.level`). The **R3 20–35 % anchor** is **LOCKED**; the rest are proposed.

### §4.6.8 Retreat resolution (NEW — Q16)

**Shape (canon §2.8 — V2-fixed).** Retreat is a **CLEAN escape valve**: you **keep HP + carried loot**, pay a
**modest clock cost**, and it **NEVER dents Influence.** *(proposed v1 balance)*: retreat costs ~**¼ day** of
clock (less than a loss's ~½ day) and no HP/loot penalty. **The one exception:** **abandoning a DEFEND /
defence-deed mid-fight counts as a *failed defend*** — the only Influence movement on a retreat — a small,
recoverable **Arms dent** (§4.2.4), never a wipe. **Levers:** the retreat clock cost. The **keep-HP/loot,
never-dents-Influence (except the abandoned-defend) shape** is **not a lever** (canon).

### §4.6.9 Weapon roster & archetype params + the combat-reveal ladder (NEW — D-026 / FU13 / FU12 / Q15)

**Shape (canon §2.8/§2.10.1 — V2-fixed).** A **growing, period-appropriate weapon roster** spanning **3
archetype LINES** (Spear / Sword / Staff-&-polearm). **T0 starts with exactly ONE weapon** and unlocks **+2
across the tier**; the roster grows **+3 at T1** and **+4 at T2** — **~9–10 weapons across v1** (the crude
**carrying-pole is a 0th IMPROVISED weapon**, not a line). Each weapon is an **archetype** — its **per-weapon**
`baseSpeed` / `reach` / `targetCount` / `attackProfile` — **+ a signature ability.** New weapons are **FOUND and
CRAFTED, never gifted**, and reveal **one at a time** on the combat-reveal ladder (no UI-dump; FU4/FU12).

> **Line → tier under the 6-tier spine (§4 RESHAPE NOTE).** **Line 1 Spear = T0** (Estate-tutorial) · **Line 2
> Sword opens at T1** (Estate-full) · **Line 3 Staff/polearm (Bō・Naginata・Kanabō・Tetsubō) is PULLED FORWARD
> from Region into T2 (Village)** (D-052 / roadmap T2-M1-F5) — so the roster is **complete by end-of-T2
> (Village)** and **new-T3 Region adds combat DEPTH, no new line.** The **+2 / +3 / +4 at T0 / T1 / T2** cadence
> is unchanged in absolute tier-number; only the Staff line's *place* moves (Region → Village).

**Proposed v1 weapon table** *(proposed v1 balance — authored **byte-identical** to §2.8/§2.10, the §3 reveal
rows, and `content/items.ts` §6.5; the single per-weapon `baseSpeed` supersedes the old global 1.0)*:

| Weapon | Line | First reveal | `baseSpeed` | `reach` | `targetCount` | signature ability |
|---|---|---|---|---|---|---|
| Carrying-pole *(0th improvised)* | — | T0 convalescence | 0.80 | 2 | 1 | — *(no signature)* |
| **Yari** *(starter)* | 1 Spear | **T0-R3** | 1.00 | 3 | 1 | **Thrust-through** (partial armour pierce) |
| Kama-yari *(cross-spear)* | 1 Spear | T0 | 0.95 | 3 | 2 | **Sweep** (strikes 2 targets) |
| Nagae-yari *(long spear)* | 1 Spear | T0 | 0.85 | 4 | 2 | **Set-spear** (first-strike vs chargers) |
| Kodachi *(short sword)* | 2 Sword | T1 | 1.25 | 1 | 1 | **Riposte** (counter on evade) |
| Uchigatana | 2 Sword | T1 | 1.10 | 2 | 1 | **Iai draw** (crit on opening swing) |
| Ōdachi *(great sword)* | 2 Sword | T1 | 0.90 | 2 | 2 | **Wide arc** (cleave 2) |
| Bō *(staff)* | 3 Staff | T2 *(Village)* | 1.20 | 2 | 1 | **Stagger** (applies slow) |
| Naginata | 3 Staff | T2 *(Village)* | 1.00 | 3 | 2 | **Reaping arc** (cleave + reach) |
| Kanabō *(spiked club)* | 3 Staff | T2 *(Village)* | 0.75 | 1 | 1 | **Crush** (block-break, defense shred) |
| Tetsubō *(iron club)* | 3 Staff | T2 *(Village)* | 0.70 | 1 | 1 | **Earthbreaker** (heavy single-target burst) |

Count: **3 weapons in Line 1 by end-T0** (1 starter + 2), **+3 at T1** (Line 2 Sword opens — Estate-full),
**+4 at T2** (Line 3 Staff opens — **Village**, pulled forward from Region) = **10 weapons** (+ the 0th
improvised pole) ≈ **9–10 across v1** ✔; **new-T3 Region adds no new line** (combat DEPTH). The improvised pole
carries a minimal archetype (slow, short, single-target) and **no** signature.

**The combat-reveal ladder (one reveal per beat; FU12).** Combat is a real **incremental progression surface**,
staggered one beat at a time (kills the old R3 UI-dump):

| Beat (trigger kind) | What reveals |
|---|---|
| **R3** — combat rung | The **single starter weapon (yari)** + the **bare auto-resolve loop** + **retreat** + the **Bestiary** (character (combat) **level** begins). Combat stats start near-zero. |
| **R4** — loot→craft loop | **Graded weapon-durability bands** (§4.6.1c) surface with the simple Crafting loop + **Equipment/Inventory** (never auto-unequipped). |
| **R5** — combat rung | The **stance** slot. *(Curated combat activities feed the **Combat Rank** rung-meter; **Arms PILLAR deeds do NOT accrue yet** — Phase 2.)* |
| **First weapon-line L10 milestone** — weapon-skill milestone | The **ability + item** intervention slots. |
| **T1** *(Estate-full)* — combat rung | The **2nd archetype line (Sword)** opens on a Combat Rank rung-gate; **+3 weapons across T1.** |
| **T2** *(Village)* — combat rung | The **3rd archetype line (Staff/polearm)** opens — **pulled FORWARD from the Region tier**; **+4 weapons across T2.** *(new-T3 Region adds combat DEPTH, no new line.)* |

Weapon **signature abilities** deepen at higher weapon-line milestones (richer signatures ~**L25 / L50** —
*proposed v1 balance*). These feed the **three clean tracks** (§4.0.1), never one fused bar. **Levers:** the
roster count & each weapon's archetype params + signatures; the reveal-beat placement. The **T0-starts-1 /
+2/+3/+4 cadence, the 3-line shape, the FOUND/CRAFTED-not-gifted rule, and one-reveal-per-beat** are **not
levers** (canon).

### §4.6.10 The LIGHT ACTIVE LAYER — optional mid-fight intervention (NEW — D-Q-active-combat)

**Shape (canon §2.8 — V2-fixed).** **Auto-resolve stays the spine** (§4.6.6b — it fights everything,
unattended): the active layer is **optional**, for engaged players and hard fights, and **changes the closed-
form inputs (§4.6.4b), never replaces the auto-resolve.** Three lightweight, low-APM interventions (no
twitch-combat — canon §E "strategic, not reflex"):

- **(1) Stance** *(set BEFORE the fight or swapped mid-fight; the slot reveals at R5 — §4.6.9).* A stance applies
  the `stance.*` modifiers already wired into §4.6.1 (`defMod` / `atkMod` / `speedMod` / `evasionMod`). Three
  default stances *(proposed v1 balance)*: **Aggressive** (`atkMod +0.20`, `defMod −0.15`, `speedMod +0.05`),
  **Balanced** (all mods 0 — the auto-resolve default), **Defensive** (`defMod +0.25`, `evasionMod +0.15`,
  `atkMod −0.15`). Swapping stance mid-fight costs **one swing's cadence** (no free instant swap). **Because HP
  now CARRIES between fights (D-050, §4.6), Defensive's HP-retention genuinely trades against Aggressive's
  speed/damage — so NO stance is strictly dominated and Balanced is no longer a trap pick.** This is a **canon
  curve invariant** (asserted by §6.6): it **replaces** the v0.2 test that enshrined Aggressive's dominance.
- **(2) Ability slot** *(reveals at the first weapon-line L10 milestone — §4.6.9).* A **timed** trigger of the
  equipped weapon's **signature ability** (§4.6.9 — e.g. *Iai draw* = guaranteed crit on the next swing;
  *Crush* = `−defense` shred on the target; *Stagger* = apply slow). On a **cooldown** (`ABILITY_CD ≈ 8 combat
  ticks`, *proposed*); if the player never triggers it, the auto-resolver fires it on cooldown at a sensible
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

## §4.7 Producer / cost curves (gathering yields, crafting, T3+ auto-producers, building costs)

**Shape (canon §G — fixed; V2-reconciled).** **Auto-producers are LATE-GAME (T3+) ONLY** (§2.5) and
**ACTIVE-ONLY** (no offline accrual; FU23) — v1's T0–T2 is the MC's own **active grind**, so for v1 the
load-bearing curves are **gathering yields**, **crafting costs/quality**, and **building/upgrade costs**. The
genre-standard `cost = base · r^owned` is used **only** for the late-game auto-producers and repeatable
upgrades, **never** to fake an early idle layer. **Yields are modelled already NET** of stamina/food/
re-investment (Q14), which is why end-T0 *lifetime-produced* koku ≈ **21K** but *held* koku ≈ **18–19K NET**
(§4.0) — the gap is genuine **sinks** (E1/E2/E3 builds, tools, craft inputs), not a hidden upkeep tax.

### §4.7.1 Gathering / labour yields (active — already NET)

```
weatherMod   = 1 + 0.10·( 2·deriveDayKeyed(seed,'weather',day) − 1 )   // STATELESS day-keyed ±10%, NOT persisted (Q35/FU3; §2.19/§6.7)
satietyFrac  = satiety / satietyMax                                    // satietyMax = SATIETY_BASE + SATIETY_PER_LEVEL·characterLevel (§4.6.1, Q47)
staminaRate  = ( satietyFrac ≥ 0.7 ) ? 1.0
             : lerp( STAMINA_RATE_FLOOR, 1.0, satietyFrac / 0.7 )      // flat above ~0.7·satietyMax, knee down to the floor (FU21)
yieldPerAction = baseYield · (1 + 0.04·skillLevel) · toolMult · seasonMult · weatherMod · staminaRate
ticksPerAction = baseTicks · (1 − 0.003·SPD)                          (floored at 1)
```

*(proposed v1 balance)*: **`STAMINA_RATE_FLOOR = 0.5`** — the **labour** rate multiplier, never to zero
(modest drain per action; rest/eat refills, §2.3). It is a **SEPARATE coefficient from the combat
`SATIETY_COMBAT_FLOOR`** (§4.6.1b), so labour-throttle and combat-throttle tune **independently** (FU16/FU21).
The **±10 % weather/festival** modifier is a bounded, **MECHANICAL** effect derived from a **stateless,
day-keyed** `deriveDayKeyed(seed,'weather',day)` helper (§2.19/§6.7) — it is **NOT stored** (only
market-saturation persists; Q3/FU3), so two saves on the same day at the same seed see the same weather.

*(proposed v1 base yields, koku/material per action — magnitudes UNCHANGED; the longer saga is paid in TIME at
the per-rung FLOOR, not in shrunk yields)*:

| Node | baseYield | baseTicks | toolMult range | season gate |
|---|---|---|---|---|
| Rake/farm rice (paddy) | 2 koku | 3 | 1.0 → 2.5 (sickle→fine tools) | grows spring/summer, **harvest autumn** |
| Forage *sansai* | 1 greens | 2 | 1.0 → 1.8 | spring/summer windows |
| Woodcut | 2 wood | 3 | 1.0 → 2.2 | year-round |
| Fish (ford) | 1 fish | 2 | 1.0 → 2.0 | year-round, peak autumn |
| Sericulture (silk, T1+) | 1 cocoon | 4 | 1.0 → 3.0 | **summer** (mulberry); **TRADE strand opens T1**, never T0 (§4.2.3) |

**Throughput tie-out (how these yields produce the §4.8 pacing).** A T0 rice action runs
`2·(1+0.04·skill)·toolMult` koku. At **R1** (skill ~1, crude tools 1.0) that's **~2.1 koku/action**; at **R7**
(skill ~12, fine tools 2.0) it's **~5.9 koku/action**. At the intended active pace, the *net koku-equivalent
throughput* (already net of stamina/food/re-investment, Q14) rises across T0's rungs roughly: **R1 ~25 → R2
~35 → R3 ~40 → R4 ~60 → R5 ~80 → R6 ~110 → R7 ~150 koku/min** (combat rungs trade some labour minutes for loot
value; crafting/cash-crop rungs add value per action). Multiplying each by its rung's wall-clock minutes
(§4.8.1) gives **lifetime-produced koku over the T0 rung-climb ≈ 21K**, of which **~18–19K is HELD NET** at the
T0→T1 gate (after the E1/E2 build sinks + tools/craft — §4.7.5). **This throughput table is the bridge between
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
  [0,1]** (weights sum to 1, so **NO spurious divisor**; D-Q-craft) — then mapped to a quality tier:
  ```
  qualityScore = 0.4·norm(crafterSkill) + 0.4·avgComponentQuality + 0.2·norm(stationTier)   // ∈ [0,1], weights sum to 1
  //   norm(crafterSkill) = clamp( crafterSkill / SKILL_REF, 0, 1 )    // SKILL_REF = the skill's tier soft-cap (§4.5)
  //   norm(stationTier)  = stationTier / MAX_STATION_TIER             // station tier as a fraction of the best station
  //   avgComponentQuality already ∈ [0,1] (recursive — a component's own qualityScore)
  outputQualityTier = floor( qualityScore · QUALITY_TIERS )           // QUALITY_TIERS = 5 → tiers 0–5 (crude → masterwork)
  ```
  Each quality tier multiplies the item's stat/value by **`1.25^tier`** (integer-pow, no `Math.pow`; §6.1).
  Disassembly returns **~60 %** of materials. *(The old `/ QUALITY_DIVISOR = 10` divisor is **removed** — it
  conflated a 0–1 weighted blend with an unnormalised raw-skill scale; the normalised score above is the fix.)*

**Resource counts are UNBOUNDED** (Q13 — strike any "+caps"; K/M/B abbreviation reads them, §4.0). **Coin is a
REAL T1+ sink (D-Q-craft+coin):** from **T1** the market row lets the player **spend coin on market purchases
and component-buying** (buying inputs/finished components the trade strand needs) — a genuine ongoing coin
*sink*, not a vestigial counter. The **coin/market MAGNITUDES** — the koku↔coin spread, the per-purchase prices,
`MarketState` — stay **M4-tunable** (Q13; §2.4), but the **sink itself is now load-bearing**, not a placeholder.
**Bulk sales** apply the **saturation damper PROGRESSIVELY per-unit** (each unit walks the price down — legible,
un-gameable; Q42 — §2.4), feeding the trade strand under the ≤⅓ clamp (§4.2.3). **Levers:** the 0.4/0.4/0.2
quality weights, `QUALITY_TIERS` (5) + the `SKILL_REF`/`MAX_STATION_TIER` normalisers, the `1.25^tier` value
step, the 60 % disassembly return, the coin spread/prices and the T1+ coin-sink magnitudes. *(Crafting magnitudes are
unchanged by the rebalance — the value-add they provide is folded into the rising per-rung throughput in
§4.7.1/§4.8.1.)*

### §4.7.3 Loot tables (seeded)

A mob/node drops on a weighted table; **rarity tiers common/uncommon/rare/fine** with default weights
**70 / 22 / 6 / 2** (rare/fine weight scaled by `+0.5 %·LUCK`), rolled on the **`loot` RNG cursor** (§6.7) so
drops replay byte-identically. **Levers:** the rarity weights and the LUCK coefficient. The **seeded-single-
cursor rule and the 70/22/6/… shape** are **not levers** (canon).

### §4.7.4 Auto-producers (T3+ ONLY — active-only, no offline; parked, scaffold only)

```
cost(n)  = producerBase · PRODUCER_GROWTH^owned          (PRODUCER_GROWTH = 1.5, ~5× per few buys)
output   = producerBaseRate · (1 + 0.1·tier)             (per ACTIVE tick — NO offline accrual, canon §H / FU23)
```

Gated on **Influence band + a LOW rank floor + cost** (NOT the capstone — §1.5.1 estate-growth rule), bound to
a `RosterMember` (a face, not a slider; §2.5). **All values parked until T3 is authored**; only the
**shape/`PRODUCER_GROWTH` scaffold** is fixed here.

> **The v1 "leave it running" feel is NOT an idle/offline layer (FU23).** v1's E0–E3 estate is a **fully
> active grind**; the "set it going and check the progress" texture comes entirely from **tab-open
> AUTO-RESOLVE combat + AUTO-REPEAT labour** while the tab is open and active (§2.8/§2.6) — **not** from
> offline accrual or early auto-producers (T3+ only, §2.5). Closing the tab pauses the world. This is the
> canon **active-only / no-offline** rule (D-013a), and it is what makes the **budget-as-a-FLOOR** grind
> (§4.8) feel like an idler without being one.

### §4.7.5 Building / upgrade costs (estate stages E0→E3, v1)

Estate physical stages gate on **Estate & Wealth (+ Arms for defensive works) + a LOW rank floor + cost**
(§1.5.1 — never the capstone; §2.17). **V2 un-parks E3 "Prosperous"** (Q8 — estate grows **E0→E3** in v1;
E4–E5 stay parked), folded into the **later G-rungs as a koku/Arms sink** (NO new rung; M5). *(proposed)*:

| Stage | Gate (pillar floor + rank) | koku cost | material cost |
|---|---|---|---|
| **E0 Foreclosure's Edge** | start | — | — |
| **E1 Stabilising** (kura patched, first *shinden*, drill yard, night-watch) | Estate ≥ 0.3K, rank ≥ R4 | 400 koku | 30 wood |
| **E2 Recovering** (granary, 2 workshops, low palisade, men-at-arms rota) | Estate ≥ 0.6K + Arms ≥ 0.3K, rank ≥ R6 | 2K koku | 120 wood, 40 stone |
| **E3 Prosperous** (3rd workshop + full granary, closed perimeter, standing 4–5-man rota, *shinden* reclamation paying out) | **Estate ≥ 40K + Arms ≥ 15K, rank ≥ G4** | **40K koku** *(staged across the river-works)* | **800 wood, 400 stone** *(+ corvée labour)* |

**Affordability tie-out (vs the §4.7.1/§4.8.1 throughput).** **E1's 400 koku** falls due around **R4**, by
which point lifetime-produced koku ≈ **5.1K** — comfortably affordable while the held NET balance keeps
climbing. **E2's 2K koku** falls due around **R6**, by which point lifetime-produced koku ≈ **13.3K**. After
both T0 sinks (2.4K koku) plus tools/craft inputs, the T0→T1 gate holds **~18–19K NET** out of ~21K produced
(§4.0). **E3's 40K koku** falls due at **G4** (the Kuzuhara river-works, M5) — by which point T2 lifetime
production is well into the **100K+** band (§4.0), so E3 is **paced to be reached, not trivially pre-bought**,
and its **Estate ≥ 40K + Arms ≥ 15K floors sit BELOW the T2 good-bands** (Estate 60K / Arms 30K, §4.1) and its
**rank floor G4 is far below the G7 capstone** — keeping building gated on standing, never the capstone
(§1.5.1). **Levers:** every cost & pillar/rank floor above (all *proposed*); the E3 staging (one lump vs the
multi-stage *seki*).

---

## §4.8 PACING — the budget is a FLOOR, not a ceiling

These are the **playtest acceptance criteria** the numbers above are derived *backward from*; they are
headlessly regression-tested via the DEV play API (§2.20/§6.10) so a retune that breaks pacing fails CI.
Canon hard rules: **first action < 5 s**, **the next goal never balloons > ~2–3× the prior** (within a tier;
canon §G, §1.2), and — **LOCKED by human (canon §I-bal), now read as a FLOOR (FU18)** — **every grind rung
takes ≥ ~30 min, a floor that BINDS FROM T1** (the reshape makes **T0 a floor-exempt tutorial**, gentle
~10–15 min/rung, D-049/D-056). Under the **6-tier reshape (§4 RESHAPE NOTE)** the per-tier Phase-1 climb FLOORS
**re-map onto the 4 v1 tiers T0–T3** — **T0 floor-exempt**; provisional starting floors **T1 ~5–8 h · T2
~8–10 h** (fork #1/#5, LIQUID per D-059); **T3 TBD** — and the precise rung-by-rung tables **re-derive at
Ship-M1-F2** ("more grind, more numbers, a slower release of incremental features"). Difficulty stays
**humbling THROUGHOUT incl. T0** (D-061 — fast ≠ easy; the mediocre-start bite stays within the winnable /
soft-setback / no-dead-end guardrails). **The ≈28.5 h figure is the v1 PHASE-1 climb FLOOR, NOT the total
(D-Q1)** — now **the FLOOR sum re-derived across the 4 v1 tiers T0–T3** at Ship-M1-F2: the full **v1 saga ≈
~60 h FLOOR = ~28.5 h Phase-1 climb + a ~+32 h Phase-2 pillar-grind floor** (§4.8.1b/§4.8.4).

> **The ≥30-min floor is enforced on the RUNG-METER POINTS, not the wall-clock (D-Q2).** The runtime floor is
> the per-rung meter threshold (§4.1.1), back-solved so that **even optimal FOCUSED play cannot fill a rung's
> numeric-points objective in < 30 min** — the meter is the enforcement, the time follows. **Unfocused play**
> (multi-skilling, side-quests, off-objective wandering) takes **LONGER — ~60–120 min/rung**. The per-rung
> **wall-clock column** in the tables below (35/40/45/55 min at T0, etc.) is **EXPECTED real, somewhat-unfocused
> play — NOT a contradiction** with the 30-min focused-optimal floor: it sits *above* the floor by design.

> **REBALANCE — these figures are FLOORS / MINIMUMS, not ceilings (FU18; annotates D-016).** §4.8 is a
> **minimum-grind model**: the ≥30-min/rung floor and the 4.5/8/16-h tier figures are the **least** a player
> spends, and the **two-phase tier (Phase-1 rung climb + Phase-2 pillar grind) runs LONGER** than the
> historical "tier budget," which now anchors the **Phase-1 climb FLOOR**. The saga **can and should run
> longer** when content interleaves richly (a long, OSRS-rough grind you leave **auto-resolving / auto-
> repeating** and check on, FU23). The **M6 pacing regression FAILS ON UNDERSHOOT ONLY** — a rung cleared
> *too fast* — **never on overshoot** (§4.8.4). The old "leave T0 in ~45–75 min, v1 ~12–20 h" targets stay
> deleted.

### §4.8.0 Headline beats

| Beat | Target | Lock status | How measured |
|---|---|---|---|
| **First action available** | **< 5 s** from load (rake spilled rice in the *kura*) | canon | time-to-first-interactable |
| **First meaningful reveal** | **< 30 s** (rice counter ticks → the koku row lights its own panel, §3.1) | proposed | first `unlock` event |
| **Per-rung minimum** | **≥ ~30 min per rung** *(a FLOOR — **binds from T1**; **T0 tutorial floor-exempt**, R0 cold-open exempt)* | **LOCKED — FLOOR (from T1)** | per-rung tick-count floor (undershoot fails) |
| **Humbling first fight (R3, T0)** | **~60–75 min** in (start of R3), **win-rate 20–35 % at adequate satiety (≥~0.7)** | **LOCKED anchor** | tick-count to the wolf + win-rate proxy (§4.6.6/§4.6.7) |
| **Win-rate bands** *(2nd fun-proxy, NEW)* | fresh-at-rung humbling (~20–45 %), comfortable after that rung's training/gear (~80 %+) — **at adequate satiety** | proposed (R3 anchor LOCKED) | the §4.6.7 win-rate-band harness |
| **Phase-1 climb — T0 Estate-tutorial** | **floor-EXEMPT** (gentle ~10–15 min/rung, D-049/D-056) | tutorial — not floor-bound | tick-count to the T0 capstone (opens Phase 2) |
| **Phase-1 climb — T1 Estate-full** | **~5–8 h** *(FLOOR; provisional fork #1/#5 — re-derives Ship-M1-F2)* | **LOCKED — FLOOR (binds from T1)** | tick-count to the T1 capstone |
| **Phase-1 climb — T2 Village** | **~8–10 h** *(FLOOR; provisional — re-derives Ship-M1-F2)* | **LOCKED — FLOOR** | tick-count to the T2 capstone |
| **Phase-1 climb — T3 Region** | **TBD** *(FLOOR — re-derives Ship-M1-F2)* | **LOCKED — FLOOR** | tick-count to the T3 capstone (v1 end-gate) |
| **v1 Phase-1 FLOOR sum** | **≈ 28.5 h** *(the Phase-1 climb floor — NOT the total; D-Q1; re-derived across the **4 v1 tiers T0–T3** at Ship-M1-F2)* | **LOCKED — FLOOR** | cumulative tick-count |
| **v1 TOTAL FLOOR** *(Phase-1 + Phase-2)* | **≈ ~60 h** *(≈28.5 h climb + ~+32 h Phase-2 grind; minimum, runs longer; re-derives Ship-M1-F2)* | **LOCKED — FLOOR** | cumulative tick-count incl. Phase-2 |
| **Goal-to-goal step ratio** | **≤ 2–3×** between consecutive within-tier goals | canon | max ratio of consecutive costs |
| **Tier-to-tier step** | **~10×** (Arms/Estate) — a chapter, not a wall; Office steepens (~25× at T1→T2) | proposed | band-top ratio across tiers |
| **Side-faction speedup** | village+origin weaving **shaves ~10–15 %** off time-to-next-tier (felt, never required) | LOCKED (H6) | with/without multipliers |

> The old draft's "leave T0 in ~45–75 min; v1 ~12–20 h" row is **deleted** — superseded by the locked
> longer **FLOOR** budget above (FU18).

### §4.8.1 ⭐ T0 PHASE-1 rank-by-rank pacing table (the centrepiece — all 8 rungs, full resolution)

> **🔁 RESHAPE — T0 is now the FLOOR-EXEMPT tutorial (D-049/D-056).** Under the 6-tier split (§4 RESHAPE NOTE),
> **new-T0 = the tutorial** (Estate pillar only; the old Estate tier's full 30-min-floor grind moves to the
> net-new **T1 Estate-full**, R8→R15). So T0's per-rung wall-clock becomes a **gentle ~10–15 min/rung ramp
> (floor-EXEMPT)**, not the ≥30-min floor — and the **≥30-min/rung floor + the per-tier hour FLOOR now bind from
> T1**. The rung-by-rung numbers below are the **OLD-scheme worked example** (4.5 h / 30-min-floor); the **T0
> tutorial pace + the net-new T1 Estate-full rung block (fork #3 titles: Kura Warden → Field Reeve → Drill-yard
> Hand → … → Trusted Man of the House) re-derive at Ship-M1-F2** (LIQUID, D-059). Combat-as-activity (R3 first
> fight) stays in T0; **Arms pillar DEEDS bank only from T1**.

This is the table the rest of §4 is tuned to satisfy. **It is the PHASE-1 rung climb** (§4.0.1/§4.1.1): each
rung promotes on an **AND-gate** — its **per-rung-reset rung-meter ≥ threshold** (fed by that rung's **curated
activities**, §4.1.1) **AND** its **story flags** (the UI reads "awaiting X" when one side lags) — **NOT** on
accumulating pillar deeds (those are **Phase 2**, §4.8.1b). **[OLD-scheme worked example — see the §4.8.1
RESHAPE banner: T0 is now the floor-EXEMPT tutorial (~10–15 min/rung); these ≥30-min / ≈4.5 h figures re-derive
at Ship-M1-F2.]** Each grind rung's expected wall-clock **≥ ~30 min (R0 aside, the cold-open story rung)**,
escalating toward the capstone, **summing to ≈4.5 h (the OLD-scheme Phase-1 floor — now the floor-exempt
tutorial pace)**. The **koku column is lifetime-produced** (the labour/economy currency, already NET, §4.7.1);
the **meter threshold** is in rung activity-points (§4.1.1); "throughput" is the net koku-equiv/min from §4.7.1.
*(Times, costs & thresholds: **proposed**, re-derive at Ship-M1-F2; the ≥30-min floor — **now binding from T1**,
T0 exempt — and the per-tier hour FLOORS: **LOCKED as FLOORS**.)*

| Rung (what it gates — from §3) | Meter + story gate to LEAVE it (Phase 1) | Throughput | koku (rung) | ⏱ wall-clock |
|---|---|---|---|---|
| **R0 Stray** — cold open done; bare estate dashboard | *(story only — the cold open §3.1)*; meter n/a | n/a (tutorial) | ~0 | **~5 min** *(floor-exempt)* |
| **R1 Day-labourer** — paddies, basic labour loop, world-clock | **Estate Service ≥ ~18** (rake/recover rice · clear forecourt · first paddy turns) + Genemon assigns real work | ~25 koku/min | ~0.75K | **~30 min** *(floor)* |
| **R2 Bonded hand** — Skills tab, foraging/woodcut/haul, near *satoyama* | **Estate Service ≥ ~19** (forage · woodcut · haul · stable chores) + first season turns | ~35 koku/min | ~1.05K | **~30 min** *(floor)* |
| **R3 Yard-hand under arms** — COMBAT LIVE; humbling first fight; drill yard, Bestiary, the starter **yari** | **Combat Rank ≥ ~17** (survive the **scripted** first wolf [a **guaranteed-survival** beat — win-or-soft-setback, the R3 story trigger] · drill reps · the **grindable** wolf/sparring + first pest skirmishes [where the **LOCKED 20–35 % win @ ≥0.7 satiety** is measured, §4.8.0/§4.6.7]) + drill-yard story | ~40 koku/min | ~1.2K | **~30 min** *(floor)* |
| **R4 Trusted hand** — Main House, domestic economy, **first *shinden* (E1)**, **loot→craft loop + durability bands** | **Estate Service ≥ ~17** (indoor errands · first *shinden* labour · craft a first tool) + invited to the Main House; **build E1 (400 koku)** | ~60 koku/min | ~2.1K | **~35 min** |
| **R5 Gate-guard** — Quest log + quest types; the **stance** slot | **Combat Rank ≥ ~17** (stand a watch · pest-control / hunt / clear sweeps) + posted to the gate | ~80 koku/min | ~3.2K | **~40 min** |
| **R6 Foreman of works** — Workshops/Granary (E2), proto-industry, **village tier seed** | **Estate Service ≥ ~15** (drive workshop/granary works · proto-industry shifts) + works commissioned; **build E2 (2K koku)** | ~110 koku/min | ~4.95K | **~45 min** |
| **R7 Bailiff** *(capstone → OPENS Phase 2)* — lord's study, four-bar Influence panel | **Estate Service ≥ ~14** (field-office duties · record the first reclamation) + the Lord's recognition — **the capstone OPENS the Phase-2 pillar grind (§4.8.1b)** | ~150 koku/min | ~8.25K | **~55 min** |

**Totals & checks (T0 Phase 1):** wall-clock **5 + 30 + 30 + 30 + 35 + 40 + 45 + 55 = 270 min = 4.5 h** ✔
(every grind rung ≥ 30 min ✔; escalating ✔; the Phase-1 FLOOR). Lifetime koku produced ≈ **0.75K + 1.05K +
1.2K + 2.1K + 3.2K + 4.95K + 8.25K = 21.5K ≈ ~21K** ✔ (the **same round figure** as the §4.0 T0 band; clears
E1@R4 and E2@R6 ✔; held ≈ **18–19K NET** at the gate after sinks). Consecutive within-rung *cost* ratios stay
≤ ~2× (0.75K→1.05K→1.2K→2.1K…), honouring the ≤2–3× rule ✔. **No pillar deeds appear in this table** — the
~560 Estate / ~350 Arms deed-ip (§4.2.1) accrue **only in Phase 2** (§4.8.1b), which is what prevents the
"half the rungs, maxed deeds" state (FU7).

> **R0 floor carve-out — blessed by the human (2026-06-25).** The ≥30-min per-rung floor (canon §I-bal)
> applies to the **7 grind rungs R1–R7**; **R0 is the exempt ~5-min cold-open story rung** (the *kura* cold
> open §3.1 — a scripted beat, not a grind rung). So T0's **4.5 h Phase-1 floor** comes from *floor +
> escalation across R1–R7*, **not** a literal "8 rungs × 30 min." A settled, deliberate carve-out.

### §4.8.1b PHASE-2 pillar-grind block (the deeds + seasonal grind, per tier — NEW)

> **🔁 RESHAPE — reads in OLD numbering; the pillar-reveal renumber + deed re-derivation land at Ship-M1-F2.**
> The per-tier rows below (T0 = 2 pillars · T1 = 3 · T2 = 4) are the **OLD reveal schedule**. Under the new
> one-pillar-per-tier reveal (§4 RESHAPE NOTE: **T0 = Estate (1) · T1 = +Arms (2) · T2 = +Office (3) · T3 =
> +Name (4)**) this block re-derives **coupled to §4.1/§4.2** (the band tables + deed/seasonal tie-outs):
> the old-T0 "Arms+Estate" splits into **new-T0 Estate-only (gate = EXCELLENT in Estate)** + **new-T1
> Estate+Arms**; old-T1 (Village) → **new-T2 (+Office)**; old-T2 (Region) → **new-T3 (+Name)**. The deed-band
> magnitudes, the per-event caps, and the 70/30 tie-outs are a **single Ship-M1-F2 re-derivation** (LIQUID,
> D-059); the **70/30 deeds-dominate split, trade ≤⅓, and the per-event-cap shape are invariants** carried
> through unchanged.

When the **capstone rung opens Phase 2** (§4.0.1), the tier's **pillar DEEDS begin accruing** (§4.2.1) and the
**seasonal appraisals begin crediting** (§4.2.2) toward the **HYBRID good/great/excellent gate** (§4.1) across
the tier's **REVEALED pillars** (T0 = 2 · T1 = 3 · T2 = 4 — Name gated, D-Q3). The basis was **built across Phase 1** by labour
(holdings near band-top), so Phase 2's first appraisal posts a large high-water jump, then diminishes (§4.2.2).
**This grind is ADDED on top of the Phase-1 climb FLOOR** — the realisation of the budget-as-a-FLOOR intent
(FU18): the two-phase tier runs **longer** than its Phase-1 floor. Deed cadence is **tier-relative** (Q20:
~5 min/recognised act at T0 · ~8 min at T1 · ~13 min at T2), interleaved with the continuing auto-resolve /
auto-repeat loop (FU23). *(All Phase-2 window minutes are **proposed**; only the §4.2.1/§4.2.2 deed/seasonal
tie-outs and the §4.1 hybrid bands are the load-bearing invariants the §6.6 verifier asserts.)*

| Tier (revealed pillars → hybrid gate) | Phase-2 deeds (§4.2.1) → 70 % | Seasonal (§4.2.2) → 30 % | great/excellent reached by | ⏱ Phase-2 window *(proposed, ADDS to the floor)* |
|---|---|---|---|---|
| **T0** *(Arms + Estate; **good in BOTH + excellent in 1**)* | **30 Arms (350 ip) + 26 Estate (560 ip)** = ~56 deeds @ ~5 min | Arms 150 · Estate 240 (8-season back-credit) | excellent in **one** (Estate→1.5K *or* Arms→0.95K) via additional capped deeds | **~4.5–5 h** |
| **T1** *(Arms + Estate + Office; **good in ALL 3 + great in 2**)* | **35 Arms (3,500) + 35 Estate (5,600) + 20 Office (1,400)** = ~90 deeds @ ~8 min | Arms 1,500 · Estate 2,400 · Office 600 | great in **two** (e.g. Estate→11K + Arms→7.5K) | **~12 h** |
| **T2** *(Arms + Estate + Office + Name → **4 revealed**; **good in ALL 4 + Estate/Office great/excellent, Arms & Name good**)* | **20 Arms (21,000) + 31 Estate (42,000) + 21 Office (35,000) + 21 Name (19,600)** = ~93 deeds @ ~13 min | Arms 9,000 · Estate 18,000 · Office 15,000 · **Name 8,400** *(0.30·28K)* | Estate/Office to great/excellent (their surplus-deed counts §4.1); **cross-pillar combos** (§4.3.1) smooth the grind + the **E3 sink** (G4) folds in | **~20 h** *(now incl. Name, D-Q3)* |

**Tie-out (Phase 2).** Each tier's deed inventory sums to **exactly 70 %** of every revealed pillar's **good**
band — **including the now-GATED T2 Name pillar** (19,600 deeds + 8,400 seasonal = 28K, D-Q3) — and the
seasonal stream supplies the **30 %** residual (the line-by-line proof is in §4.2.1/§4.2.2) — the
two add to the §4.1 **good** band, the breadth floor every player reaches. **great/excellent** are reached by
**specialising** the Phase-2 surplus into the chosen 1–2 pillars (each still per-event-capped at 0.04·good,
many small acts, never spikes — §4.1/§4.2.1), which **extends Phase 2 beyond its floor** (FU18). **T2 layers in
the cross-pillar combos** (multiple pillar pairs, post-trade-clamp, **excluded from the gate-check**; §4.3.1)
as the anti-slump device and the **E3 "Prosperous" build** (40K koku + materials, §4.7.5) as a Phase-2 koku/
Arms sink. **The whole tier = Phase-1 climb (≥ its 4.5/8/16-h FLOOR) + this Phase-2 grind**, so the realised
tier always runs **above** its floor (the M6 regression fails on **undershoot only**, §4.8.4).

### §4.8.2 The VILLAGE tier PHASE-1 rung pacing — old-T1 = **new-T2** (lower resolution — old FLOOR ≈ 8 h → re-derives ~8–10 h, Ship-M1-F2)

> **🔁 RESHAPE — this is the Village tier (V0→V7); old-T1 → new-T2.** Floor figures re-derive at Ship-M1-F2
> (provisional **~8–10 h**, fork #1/#5). The **Office pillar reveals here (new-T2)** ✔ and — per the §3
> re-placement — the **3rd weapon line (Staff/polearm) is PULLED FORWARD into the Village tier** (the Sword/2nd
> line opened earlier at the **Estate-full** tier, new-T1). The **first HUMAN threat** (bandits / *nobushi*) and
> the rival-house contest also begin here.

The Village tier's Phase-1 spends its longer floor on **wider** content (market, coin, component crafting, silk
*meibutsu*, rumours board, valley-scale combat, the **3rd weapon line — Staff/polearm, pulled forward**) at
**~60 min/season** wall-clock. Throughput rises ~10× over the prior tier (koku into the tens-of-thousands). Each
rung gates on the **rung-meter + story** (not deeds); **Office is revealed** here and becomes a *required*
Phase-2 gate (§4.1). Each grind rung ≥ ~40 min (the ≥30-min floor binds from T1); capstone longest. *(Combat
Standing → **Combat Rank** throughout; Q9.)*

| Rung (§3.4) | Meter + story gate to leave it (summary) | ⏱ wall-clock |
|---|---|---|
| **V0 Errand-runner** — market/coin opens (one shop first) | Estate Service ≥ thr + first valley errands; coin row lit | **~40 min** |
| **V1 Recognised hand** — chief's house, inn & rumours board | Estate Service ≥ thr + shop+headman standing | **~55 min** |
| **V2 Road-warden** — HUNT/CLEAR at valley scale; first HUMAN threat (*nobushi*); ford safe; **Staff/polearm line opens** *(3rd line, pulled forward to the Village tier)* | **Combat Rank ≥ thr** (valley clears; road-safe curated activities) + the ford story | **~60 min** |
| **V3 Steward of the valley economy** — silk *meibutsu* + component crafting | Estate Service ≥ thr + recorded seasonal result; **TRADE strand opens** (≤⅓-capped, §4.2.3) | **~65 min** |
| **V4 Trusted of the headman** — **Office bar lights** (first Office reveal) | Estate Service ≥ thr + the headman's trust beat | **~70 min** |
| **V5 Sworn man-at-arms** — paid retinue (flavour), DEFEND quests; **Naoyuki beat** | **Combat Rank ≥ thr** (valley DEFEND watches) + the man-at-arms oath | **~70 min** |
| **V6 Right-hand-in-waiting** — authority across the valley; region seed | Estate Service ≥ thr + STORY (alliance/standing) | **~55 min** |
| **V7 Agent of the house** *(capstone → OPENS Phase 2)* — "clean your room"; region opens | Estate Service ≥ thr + the Lord sends you to the region — **opens the T1 Phase-2 grind to the hybrid gate (§4.8.1b)** | **~65 min** |

**Totals & checks (T1 Phase 1):** **40+55+60+65+70+70+55+65 = 480 min = 8.0 h** ✔ (the Phase-1 FLOOR). The
**Phase-2 deeds** (Estate 5,600 / Arms 3,500 / Office 1,400 ip — §4.2.1) + seasonal (2,400 / 1,500 / 600)
accrue **after V7** (§4.8.1b), to the hybrid **good-in-3 + great-in-2** gate. Tier step Arms/Estate ≈10×;
**Office is a fresh required gate** (0 at T0 → good-band 2K at T1). Season ≈ 60 min ⇒ ~8 seasons span the T1
Phase-1 floor.

### §4.8.3 The REGION tier PHASE-1 rung pacing — old-T2 = **new-T3** (lower resolution — old FLOOR ≈ 16 h → re-derives, Ship-M1-F2)

> **🔁 RESHAPE — this is the Region tier (G0→G7); old-T2 → new-T3, the v1 END-gate** (`outcome: t3done`). Floor
> re-derives at Ship-M1-F2 (the old 16 h must come **down** so the v1 Phase-1 sum re-lands ≈ 28.5 h across the
> 4 v1 tiers T0–T3, fork #1/#5, LIQUID). Per §3, **Region adds combat DEPTH — NO new weapon line** (the roster
> completed at the Village tier; the Staff line is no longer introduced here). The **Name pillar reveals here
> (new-T3, 4 revealed)** ✔ and the **FULL 4-pillar cross-pillar combo set** completes here (§4.3.1).

The Region tier's Phase-1 is the longest, widest: region map, *sekisho* travel, region-scale human mobs
(rōnin/bandits), the Origin faction + both personal payoffs, Kuzuhara river-works (the **E3** lever), the rival
houses, and **combat DEPTH on the completed roster (no new weapon line)**. **~120 min/season** wall-clock.
Required Phase-2 pillars drift to **Estate + Office** (Arms secures roads); **Name** reveals (**4 revealed** —
Name gated, D-Q3). Each grind rung ≥ ~75 min; capstone among the longest. The Region tier's **Phase 2** weaves
in the **full 4-pillar cross-pillar combos** (§4.3.1) and lands **E3 "Prosperous"** (§4.7.5).

| Rung (§3.6) | Meter + story gate to leave it (summary) | ⏱ wall-clock |
|---|---|---|
| **G0 Valley-envoy** — trade backbone opens minimally; first Origin contact | Estate Service ≥ thr + first off-the-books consignment | **~75 min** |
| **G1 Road-captain** — *sekisho* layer; region-scale combat (rōnin/bandits); **combat DEPTH on the completed roster (no new line — the Staff line opened back at the Village tier)** | **Combat Rank ≥ thr** (secure cluster roads — curated combat) + first pass obtained | **~110 min** |
| **G2 Broker of the post-town** *(Origin OPENS)* — Sawatari-juku, *toiya* | Estate Service ≥ thr + **STORY (dream) AND travel-standing** (the doubly-earned Origin gate, §3.6.2) | **~120 min** |
| **G3 Arbiter between valleys** — Hibara + Tōge-mura (capped at 2) | Estate Service ≥ thr + out-supply/arbitrate story | **~130 min** |
| **G4 Recognised regional retainer** — Kuzuhara river-works (LAND mega-lever) | Estate Service ≥ thr **+ STORY** (commit the multi-stage *seki*) — **lands estate stage E3 "Prosperous"** (40K koku sink, §4.7.5) | **~140 min** |
| **G5 Captain of the road-detail** — brigand roost; **Hanzaki survived**; **Naoyuki ally-flip** | **Combat Rank ≥ thr** (secure the trade pass — curated combat) + the roost broken | **~140 min** |
| **G6 Alliance-broker** *(Otsuru/Tama TRUTH — spine-guaranteed)* — Tahei-name-reclaim is **Origin-O5 missable** (§3.6.2/Q5) | Estate Service ≥ thr + STORY (alliance) | **~120 min** |
| **G7 Leading house of the region** *(capstone → OPENS Phase 2 → T3 stub)* — rivals eclipsed | Estate Service ≥ thr + the Lord names the house first of the region — **opens the T2 Phase-2 grind to the v1 end-gate (§4.8.1b)** | **~125 min** |

**Totals & checks (T2 Phase 1):** **75+110+120+130+140+140+120+125 = 960 min = 16.0 h** ✔ (the Phase-1 FLOOR).
The **Phase-2 deeds** (Estate 42,000 / Arms 21,000 / Office 35,000 / **Name 19,600** ip — §4.2.1) + seasonal
(18,000 / 9,000 / 15,000 / **Name 8,400**, the gated Name 30 % — D-Q3) accrue **after G7** (§4.8.1b), to the
hybrid **good-in-all-4 + Estate/Office great/excellent, Arms & Name good** end-gate, **plus the cross-pillar
combos** (§4.3.1). Tier step Arms 5K→30K (6×), Estate
8K→60K (7.5×), **Office 2K→50K (25× — the locked "win it socially" steepening**, §4.0/§4.1). Season ≈ 120 min
⇒ ~8 seasons span the T2 Phase-1 floor.

### §4.8.4 The v1 budget at a glance (all figures FLOORS — re-mapped to the 6-tier spine)

> **🔁 RESHAPE — re-mapped to the 4 v1 tiers (T0–T3); precise floors re-derive at Ship-M1-F2 (LIQUID, D-059).**
> The old Estate tier **splits** into a floor-exempt **T0 tutorial** + a net-new **T1 Estate-full** (R8→R15);
> Village → **T2**; Region → **T3** (the v1 end-gate). Provisional starting floors are the fork #1/#5 numbers;
> the **~28.5 h Phase-1 climb FLOOR re-derives as the sum across T0–T3** (the old 16 h Region floor must come
> **down** to keep the sum). Phase-2 columns are equally coupled to the §4.8.1b/§4.1/§4.2 re-derivation.

| Tier (new spine) | rungs (Phase 1) | per-rung avg | season wall-clock | **Phase-1 FLOOR** | + Phase-2 grind (§4.8.1b) | lock |
|---|---|---|---|---|---|---|
| **T0 Estate-tutorial** | R0–R7 (8) | ~10–15 min *(floor-EXEMPT)* | — | **floor-exempt** | re-derives *(Estate-only gate)* | tutorial — not floor-bound |
| **T1 Estate-full** | R8–R15 (~8) | ≥ ~40 min | ~60 min | **~5–8 h** *(provisional, fork)* | re-derives *(+Arms)* | LOCKED FLOOR *(binds from T1)* |
| **T2 Village** | V0–V7 (8) | ~60 min | ~60 min | **~8–10 h** *(provisional)* | re-derives *(+Office)* | LOCKED FLOOR |
| **T3 Region** | G0–G7 (8) | ~120 min | ~120 min | **TBD** *(re-derives)* | re-derives *(+Name; incl. combos, D-Q3)* | LOCKED FLOOR |
| **v1 total (T0–T3)** | ~32 | — | — | **≈ 28.5 h (Phase-1 FLOOR sum, re-derived across the 4 v1 tiers at Ship-M1-F2)** | **+ ~+32–36 h Phase-2 ⇒ ~60 h v1 FLOOR (D-Q1; ~65 h with the Name gate + great/excellent, D-Q3)** | LOCKED FLOOR |

**The three single most important invariants now:** (1) **every grind rung ≥ ~30 min** (LOCKED FLOOR — **binds
from T1**; the **T0 tutorial is floor-exempt**, D-049/D-056) — enforced as a CI pacing floor: if a headless
playthrough clears any **T1+** rung in < ~28 min the pacing test **fails** (undershoot); (2) the **budget
figures are FLOORS** — the M6 regression **fails on UNDERSHOOT ONLY, never on
overshoot** (FU18), because the two-phase tier (climb + grind) is *meant* to run past its Phase-1 floor; and
(3) the **goal-to-goal ratio ≤ 2–3×** *within* a tier (canon) — the gentle intra-tier growth keeps consecutive
costs soft, while the ~10× tier step (Office ~25×) is the deliberate chapter break. **Levers:** all per-rung
*times / costs / meter-thresholds* and the Phase-2 window minutes are tunable *proposed* numbers, but the
**< 5 s first action**, the **≤2–3× never-balloon rule**, the **≥30-min per-rung FLOOR (from T1; T0 exempt)**,
and the **per-tier hour FLOORS** (T0 floor-exempt · T1 ~5–8 h · T2 ~8–10 h · T3 TBD — re-derived across the
4 v1 tiers T0–T3 at Ship-M1-F2, fork #1/#5) are constraints the tuning must always satisfy (the last two LOCKED
by human as FLOORS, FU18).

---

## §4.9 Levers index (the tuning dashboard) & the LOCKED-constants index + open questions

**Master dials:** `TIER_MAG = 10`, `r_intra = 1.15`, `SEASON_WALLCLOCK_MIN[tier]` (T0≈34 / T1≈60 / T2≈120 — a
binding that *serves* the FLOORs, itself a lever). **Rung-meter — the third curve (§4.1.1):** `RUNG_FLOOR_MIN
= 30` *(a FLOOR — the value is the minimum, not a ceiling)*, each rung's `eligibleActivityRate` + its curated-
activity set + the per-rung thresholds (T0 ~14–19). **Accrual:** **`PER_EVENT_CAP_FRACTION = 0.04`** *(halved
from 0.08; "smaller than 0.08" is LOCKED)*, the **deeds/seasonal split ≈ 70/30** *(deeds-dominate LOCKED; exact
70/30 proposed)*, the **deed-base table** (§4.2.1, every base ≤ its 0.04·good-band cap), **`SEASONAL_SHARE =
0.30`** (the single dial setting the whole seasonal stream), the derived **`JUDGE_K[pillar][tier] =
SEASONAL_SHARE · goodBand`** table, the **`TIER_REF[pillar][tier]`** + **`TIER_REF_NAME = armsGood + estateGood
+ officeGood`** normalizers, the **autumn-basis bump** (~12 %), `f_pillar` exponents (0.5), `DENT_FRACTION =
0.10` + the dent self-heal rate. **HYBRID gate (§4.1):** the **good/great/excellent triple per revealed pillar
per tier** **+ the great/excellent COUNTS** (how many pillars must be great vs excellent); the revealed-pillar
set (OLD: T0=2 / T1=3 / T2=4 — Name gated, D-Q3; **re-derives to the new one-per-tier reveal T0=1 / T1=2 / T2=3 /
T3=4 at Ship-M1-F2, coupled to §4.1**). **Gating:** the hybrid profile **ANDed with** the Phase-1 capstone rung-meter +
story gate, **+ the per-tier hour FLOORS the gates must take to fill**. **Skills:** `XP_BASE = 50`, `XP_GROWTH
= 1.18`, `PER_EVENT_XP_CAP_FRACTION = 0.25`, visibility 30, per-tier soft caps, milestone levels/perks.
**Per-skill perks (§4.5.4):** each perk's `combatBonus` magnitude, the per-skill perk counts (~2–8), the
unlock-level cadence, `PER_PERK_MAX`. **Conversion weights (§4.3):** `0.05·combatLevel`, `0.10·dangerRing`,
`0.04·skillLevel`, `0.04·tradeSkill`, `0.06·officeRank`, `0.15·allianceSealed`, `0.25·Name-blend`.
**Cross-pillar combos (§4.3.1):** which pillar pairs combo, the per-pair magnitude (≤ one cap), the **two-wave onset (PARTIAL Office-pairs at new-T2 · FULL 4-pillar set at new-T3)**.
**Attributes (§4.4):** all coefficients, start = 5, +1 pt / 2 levels, per-tier soft caps. **Character level
(§4.6.5):** `CL_BASE = 60`, `CL_GROWTH = 1.18`, `COMBAT_XP_K = 12`, `MobDef.level` defaults, `hpMax = 40 +
8·characterLevel`, `satietyMax = SATIETY_BASE(100) + SATIETY_PER_LEVEL(4)·characterLevel`. **Combat (§4.6):**
each weapon's `baseSpeed`/`reach`/`targetCount`/signature (§4.6.9), SPD coeff 0.005, `DAMAGE_FLOOR = max(1,
0.10·atk)` *(floored LAST, post crit/block — §4.6.4)*, `CRIT_MULT = 1.5`, `BLOCK_REDUCTION = 0.5`, chance caps
0.50/0.40, `skillBonus = 0.3·weaponSkill`, accuracy base 10, crit base 0.02; the **enemy `MobDef.level →
{attackPower, defense, HP, …}` curve** (§4.6.1d — `MOB_HP_BASE 24`/`MOB_HP_K 8`, `MOB_ATK_BASE 8`/`MOB_ATK_K 3`,
`MOB_DEF_BASE 1`/`MOB_DEF_K 1`, `MOB_ACC 10/+2L`, `MOB_EVA 2/+2L`, `MOB_CRIT 0.05`); the **closed-form
`P_win(MC)`** (§4.6.4b — **analytic for the GATE / fixed-seed sampled n=400 for the DISPLAY**, D-057;
displayed == tested == same-for-every-player); the **light active layer** (§4.6.10 — stance mods, `ABILITY_CD`,
item slots); `SATIETY_COMBAT_FLOOR = 0.5` + the 0.7 knee + the attackSpeed-touch weight;
the 4 durability bands (75/50/1/0 → 1.0/0.9/0.75/0.55) + `WEAR_PER_FIGHT ≈ 3 %`; the **win-rate bands**
(§4.6.7) per combat-entry rung; the **retreat clock cost** + the **0-HP forced-rest** loop (§4.6.6b/§4.6.8). **Pacing (§4.8):** all per-rung times /
costs / meter-thresholds + the Phase-2 window minutes (proposed) under the **≥30-min FLOOR (binds from T1; T0
tutorial exempt) + the per-tier hour FLOORS (T0 exempt · T1 ~5–8 h · T2 ~8–10 h · T3 TBD — re-derive across the
4 v1 tiers at Ship-M1-F2; LOCKED as FLOORS)**. **Producers/costs (§4.7):** gather base yields/ticks + per-rung net throughput, autumn `×3`,
`STAMINA_RATE_FLOOR = 0.5` + the 0.7 knee, the weather `±10 %` band, crafting quality weights (0.4/0.4/0.2,
0–1 score) + `QUALITY_TIERS = 5` + the `SKILL_REF`/`MAX_STATION_TIER` normalisers + `1.25^tier` + 60 %
disassembly + the **T1+ coin sink** (market/component-buying), loot rarity 70/22/6/2 + `0.5 %·LUCK`,
`PRODUCER_GROWTH = 1.5` (T3+),
the **E1 / E2 / E3** costs & floors (§4.7.5).

**LOCKED-constants index (the fixed v1 dial values, for quick reference — all *proposed v1 balance* but
self-consistent):** `TIER_MAG 10` · `r_intra 1.15` · `RUNG_FLOOR_MIN 30` · `PER_EVENT_CAP_FRACTION 0.04` ·
`SEASONAL_SHARE 0.30` · `DENT_FRACTION 0.10` · `XP_BASE 50` · `XP_GROWTH 1.18` · `PER_EVENT_XP_CAP_FRACTION
0.25` · `CL_BASE 60` · `CL_GROWTH 1.18` · `COMBAT_XP_K 12` · `SATIETY_BASE 100` · `SATIETY_PER_LEVEL 4` ·
`SATIETY_COMBAT_FLOOR 0.5` (knee 0.7) · `STAMINA_RATE_FLOOR 0.5` (knee 0.7) · `WEAR_PER_FIGHT 3 %` ·
durability bands `1.0/0.9/0.75/0.55` · `CRIT_MULT 1.5` · `BLOCK_REDUCTION 0.5` · crit/block caps `0.50/0.40` ·
`DAMAGE_FLOOR max(1, 0.10·atk)` (floored LAST, post crit/block) · `hpMax 40 + 8·level` · `QUALITY_TIERS 5` (0–1 score, no divisor) · quality step `1.25^tier` ·
disassembly `0.60` · loot `70/22/6/2` + `0.5 %·LUCK` · weather `±10 %` · autumn paddy `×3` · `PRODUCER_GROWTH
1.5` (T3+ *(old label; → T4+ post-renumber, deferred)*) · `SEASON_WALLCLOCK_MIN[tier]` (old 34/60/120) · tier Phase-1 FLOORS `4.5/8/16 h` **(OLD 3-tier; under the reshape T0 is floor-exempt and the floors re-map onto the 4 v1 tiers T0–T3, re-derived at Ship-M1-F2)** (v1 Phase-1 `≈28.5 h` re-derived across T0–T3; v1 TOTAL `~60 h` incl. ~+32 h Phase-2).

**LOCKED by human (§I-bal + the V2 Block-L/M signs — shape fixed, not free to invert; only the realising
magnitudes are tunable):** saga length / per-tier hour budget **as FLOORS** (under the reshape: **T0
floor-exempt** · the ≥30-min floor + the per-tier hour FLOORS **bind from T1**; provisional **T1 ~5–8 h · T2
~8–10 h · T3 TBD**, re-derived across the 4 v1 tiers at Ship-M1-F2 · **v1 ≥ 28.5 h Phase-1 climb** / v1 ≥ ~60 h
TOTAL incl. ~+32 h Phase-2; runs longer, FU18/D-Q1) · the **≥30-min per-rung FLOOR (from T1)** · **first-fight
win-rate 20–35 % at adequate satiety (≥~0.7)** *(SINGLE-fight; stands under HP-carry, D-058)* · **soft-setback severity shape** (1 HP + ~½-day + light injury
+ possible carried-loot drop; never levels/gear/Influence) · **deeds-dominate accrual split (~70 % deeds /
~30 % seasonal)** · **deed-jump size smaller than the old 0.08 cap** · **no respec in v1** · the **HYBRID
good/great/excellent tier-gate** (breadth floor + no overflow) · the **THREE clean combat tracks** (character
level / Arms pillar / Combat Rank meter — never reconflated) · the **SEQUENTIAL two-phase model** (rungs →
pillar grind; deeds Phase-2-only) · **graded durability bands, never auto-unequip / never weaponless** ·
**satiety throttles combat** (floor never below ~15 % win-rate).

**HARD INVARIANTS (canon — NOT levers):** trade ≤⅓ of Estate & Wealth (post-combo-clamp, §4.2.3/§4.3.1); the
**HYBRID good/great/excellent gate — good in ALL revealed pillars (breadth floor) · great in 2–3 · excellent
in 1–2, NO overflow/substitution** *(REPLACES the old "simple per-tier thresholds, no floor/overflow", Q7/
FU10/D-028)*; accrual = achievement jumps + seasonal-judged-on-high-water-mark only (no time-trickle, no flat
per-action), **PHASE-2 only** (deeds don't accrue on the rungs; FU7); up-only with minor recoverable per-pillar
dents (never a wipe, never touches `highWater`); the **bounded per-skill combat-perk channel**
(`skillCombatBonus`, ~2–8 small perks/skill, no hard global cap — conditioning stays the **ZERO-stat
enablement gate**) *(RELAXES the old "no labour→combat cross-feed", Q6/FU8/D-027)*; auto-producers **T3+ only &
ACTIVE-ONLY (no offline)**; combat first-class & EARLY (T0-R3); **one combat-fed character level** (never
raised by labour or deeds); mediocre-start (start near-zero, grind-only); K/M/B display; macron romanization.

**RESOLVED — now LOCKED (do NOT re-open):** all of the above + the full **Block L (Q1–Q56)** + **Block M
(FU1–FU23)** signs (2026-06-26), **D-022 governing (most-recent-block-wins; annotate-don't-delete)**. The
budget is now a **FLOOR** (FU18 supersedes the old "ceiling/target" reading of D-016); the hybrid gate
supersedes the simple thresholds (D-028); the bounded perks relax the cross-feed wall (D-027); the three
clean tracks de-conflate the old fused "Combat Deeds pool" (D-025). **These are settled.**

**Open questions (PROVISIONAL per D-021 — tune at M6 against playtest, the §4 magnitudes only):** the Phase-2
window minutes (§4.8.1b) and the great/excellent **counts** (§4.1); the per-skill perk magnitudes &
`PER_PERK_MAX` (§4.5.4); the `MobDef.level` defaults & win-rate-band magnitudes (§4.6.7); the cross-pillar
combo pairs & per-pair magnitude (§4.3.1); the **E3** cost & staging (§4.7.5); the deferred **coin/market**
numbers (M4 — §4.7.2/§2.4); the `SEASON_WALLCLOCK_MIN` binding. **None of these touch the LOCKED shapes
above** — they are the liquid plan-layer (D-021), re-planned after each playtest; the FLOORS, the gate shape,
the three tracks, and the accrual invariants are the frozen intent.

---
