# Roadmap — **Section → Milestones → Fun-slices** (LIVING)

> **The living v1 milestone tracker.** Canonical — **promoted 2026-06-29** from the re-axe proposal
> ([`../../project/archive/2026-06-29-roadmap-reaxe-proposal.md`](../../project/archive/2026-06-29-roadmap-reaxe-proposal.md), retained as
> the as-reviewed artifact) — and it **supersedes the old MS0–MS7 milestone tracker**. Edited in place as
> fun-slices land.
>
> **Governed by [`prd/07-roadmap-scope.md`](prd/07-roadmap-scope.md) (§7), this roadmap's contract.** §7 owns the
> *what* (the locked v1 = full T0–T3 scope, the cut-set, the pacing FLOOR, the hard guardrails, the release gate,
> the risk register); this file owns the *how / the order* (the replannable MS0…M-series build sequence). §7.2
> delegates the milestone roadmap **here** as the single source (generate-don't-duplicate — ADR-021 / ADR-059 / DS#9),
> so this is the only living copy. On any conflict: **§7 wins on locked scope & shape; this file wins on
> sequence.**
>
> Reflects the **2026-06-28 tier reshape** (ADR-048…ADR-055, 6 tiers) + the **2026-06-29 decision
> session** (ADR-056…ADR-069; [ledger](../../project/feedback-human/2026-06-29-decision-session.md)) + the **5
> finalized forks** ([ledger](../../project/feedback-human/2026-06-29-roadmap-forks-finalized.md)). Per **ADR-021**
> the roadmap is **re-planned after each playtest**: **T0/T1/T2 are detailed; T3 stays coarse** (re-detailed on
> approach), and **PRD §4 balance stays liquid** (ADR-059) — it re-tunes through the build. The 6-lens review that
> shaped this is at [`…/2026-06-29-roadmap-reaxe-review.md`](../../project/audit/reports/2026-06-29-roadmap-reaxe-review.md).
>
> **Why this shape (human steer, 2026-06-29):** flat slices aren't enough. Structure is **two-level, per
> section**: each **section** (a v1 tier **T0→T3**, or the **Ship** release section) gets **N milestones**;
> each milestone holds **N fun-slices**. A **fun-slice ships a *playable, fun* increment** (a thing the player
> can *do* that feels good), never just an internal feature. A **milestone** groups a few fun-slices into one
> coherent capability + a verify-green gate. **T0/T1/T2 are detailed; T3 stays coarse** (re-detailed on
> approach, per the freeze); a **Ship** section closes v1.

---

## Legend & conventions

- **IDs:** `T0-M2-F3` = section T0, Milestone 2, Fun-slice 3; `Ship-M1-F2` = Ship section, Milestone 1,
  Fun-slice 2. **Sections = the four tiers (T0→T3) + Ship.**
- **Status:** ✅ shipped · 🔧 shipped-needs-rework (reshape/tuning) · 🆕 new · ⏳ provisional (coarse).
- **DoD forward-contracts** baked into fun-slices (the audit §4#7 ask): **G-CURVE** (graded win-rate curve),
  **G-NO-DEAD-VALUES** (every value has a consumer), **≥30-min floor** (T1+ only — T0 is floor-exempt per
  ADR-049), **NO-STANCE-DOMINATED** (ADR-050), **DISPLAYED==TESTED** (fixed-seed win-rate, the blessed
  analytic-gate / sampled-display split), **DIVERGE** (mandatory UI-variant contact-sheet per new surface —
  human's 2026-06-29 call; the `diverge` skill is **built**, mandatory for new/majorly-restyled surfaces,
  one-line tweaks exempt), and **playcheck** (the pacing/fun ratchet — 4 proxies in `verify` — that
  machine-enforces the floor + fun DoD lines; op-model v2 FINAL, built). The consolidated whole-v1 versions of
  these are gated in **Ship-M1**.
- **Locked spine (ADR-048…ADR-055):** 6 tiers (T0 Estate-tutorial · T1 Estate-full · T2 Village · T3 Region ·
  T4 Castle-town · T5 Edo); **v1 = T0→T3**; **one pillar per tier** (T0→T1 Estate 家産 · T1→T2 Arms 武威
  unlocks Village · T2→T3 Office 官威 · T3→T4 Name 家格); **manual opt-in ascension** (hybrid grade-gate,
  T0 = EXCELLENT; overshoot → permanent boon); each ascension un-greys the **next, still-unnamed** silhouette
  (ADR-055); **HP carries + heals by eating** (ADR-050); **COIN compounding estate-upgrade flywheel** (ADR-051);
  **T0 = showcase-in-miniature** (ADR-052); **active pillar + locked silhouettes** + a **dream beat every tier**;
  **active-only "leave-it-running" clock** (ADR-079 — the sim **pauses on `document.hidden`**, no
  offline/background catch-up; the "leave it running" feel comes from tab-open auto-repeat while visible);
  **milestone-integrity** (ADR-054 — a milestone is SHIPPED only when every DoD line is met
  *or* ADR-amended before the commit; the CI manifest check asserts every named instrument resolves to a real
  test/tool; bans "SHIPPED (slice)").

---

## Already SHIPPED (do not re-list as todo) — MS0–M2b — **CARRY FORWARD + RETUNE** (decision #19)

> **Resolves OQ-4.** The shipped MS0–M2b foundation is **kept and retuned, NOT rebuilt** (human reversed an
> initial "rebuild fresh"). We layer the reshape *on top* of the working, play-tested slice — HP-carry/heal,
> found/crafted 2nd weapon, the pillar + ascension, SFX, dev tools, the humbling-friction tune, and **retiring
> the DEMO/REAL pacing-profile fork** (decision #1 / ADR-056 — real ADR-049 is the only profile; review velocity
> comes from the DEV-only 2×/4×/8× time multiplier). The reshape's schema bump **wipes dev/v0.2 saves**
> (decision #15 — pre-launch, no users); the real `migrate()` path is built + test-covered before launch, not
> exercised across dev churn.

| Was | Maps to | What's real |
|---|---|---|
| MS0 | foundation (cross-cutting) | toolchain, pure-core, one RNG, reveal engine, full multi-backend save + crash-recovery, the **cold open** |
| MS1 | **T0-M1** | rung-meter R0→R2, labour skills (discover-by-doing), season clock, soft stamina, first nav reveal, conditioning gate, porter's-knot zero-bonus beat |
| M2a | **T0-M2** | the humbling grain-store wolf @ R3, seeded auto-resolve, sampled win-rate forecasts, character leveling, satiety throttle, no self-recovery — a loss bites carried wealth + stops autopilot |
| M2b | **T0-M2** | grounded bestiary, equipment + graded 4-band durability + repair (wood + a soft coin fee, tightened in v0.3.1 · ADR-092), a found/crafted 2nd weapon, foe forecasts + auto-fight |

So the re-axe's **new work starts at the T0 tuning pass + R4→R7 + the spine** — the cold-open→labour→first-wolf
arc already exists and carries forward (MS0–M2b shipped at `8bf6ac9` · `248bf93` · `fc36172`; the retired MS0–MS7
tracker is preserved in git history).

---

# Tier T0 — Estate (intro / tutorial) — *DETAILED (next to build)*

**Frame:** learn the whole game in miniature; rungs **R0→R7**; **4 milestones** in **SPINE-FIRST build order**
(decision #18 — see the build-order box at the end of T0). Pacing = **real ADR-049** (~10–15 min/rung,
**floor-exempt**, decision #1) — the **DEMO/REAL profile fork is retired** (ADR-056); **fast but NOT easy**: the
mediocre-start bite + durability/satiety friction stay **humbling THROUGHOUT** within guardrails (winnable ·
soft-setback only · no permanent loss · no stranding) (decision #13). Onboarding is a **diegetic mentor** — the
**domain-split canon cast** teaches each system in-world as it unlocks (**Genemon** for labour/rice/coin · **Kihei**
for arms/combat · **Sōan** for healing), **never popups** (decisions #17, #22, ADR-015). The estate is a **small
WALKABLE map** (decision #23). DEV tools throughout: a **2×/4×/8× speed toggle + jump-to-rung/tier teleport**
(decision #16, stripped from prod) and a **dev save-wipe** on the reshape schema bump (decision #15). Ends at
the **BIG ceremonial T0→T1 one-pillar (Estate 家産) ascension** (decision #14).

### T0-M1 — Waking on the estate *(the hook)* — ✅ shipped (v0.3)
| Fun-slice | Status | The fun | DoD |
|---|---|---|---|
| **T0-M1-F1** Cold open & first rake | ✅ | the woodblock cold-open hook; log cascades in | first-interactable <5s; rake → RICE ticks (+ a little coin) → log line |
| **T0-M1-F2** Labour loop + estate inks in (R0→R2) | ✅ | numbers climb, nav/rooms reveal one-per-beat | R0→R2 AND-gate; reveal stagger; G-NO-DEAD-VALUES |
| **T0-M1-F3** **Meet your mentor (diegetic onboarding opens)** | ✅ | an in-world character greets you and teaches the labour loop as *story*, not a tooltip — adds a face to the estate | the labour mentor (**Genemon**, of the domain-split cast — Kihei teaches arms in T1-M2-F2, Sōan healing) greets you; dialogue is **data-not-script** (ADR-039); teaches by reveal-as-plot, **non-hand-holdy — no hint popups** (#17, ADR-015); **DIVERGE** on the dialogue panel |
| **T0-M1-F4** **Juice + dev-tools pass — minimal SFX + speed/teleport** | ✅ | per-deed hit cue, rice/coin tally-flash, rank-up flourish — *the biggest remaining fun lever* (#2) | **traditional-palette SFX** (#12 — taiko / shamisen-koto / shakuhachi / temple-bell 鈴; synth Web Audio, reduced-motion/mute-safe); DEV **speed toggle + jump-to-rung/tier teleport** (#16) gated out of prod; **DIVERGE** if any new surface |

### T0-M2 — First blood *(the humbling)* — ✅ shipped (v0.3); combat reworked *further* in v0.3.1 (ADR-076)
| Fun-slice | Status | The fun | DoD |
|---|---|---|---|
| **T0-M2-F1** Grain-store wolf, combat goes live @R3 | ✅ | the humbling, *winnable* first fight | first-fight **20–35% single-fight win-rate** (signed band kept, decision #5); G-CURVE; DISPLAYED==TESTED |
| **T0-M2-F2** Gear, durability & the found/crafted 2nd weapon | ✅ | equip choices; repair tension; *earn*, never gifted | graded durability; repair costs wood + a soft coin fee (waived if broke — ADR-092); **2nd weapon → found/crafted via a loot→craft loop** (retires the grant; **this is the ADR-052 showcase "one craftable" taste**); **DIVERGE** on the craft panel |
| **T0-M2-F3** **Combat becomes a real decision** | ✅ | HP-carry makes defensive stances matter; eat-to-heal couples food↔combat | **HP carries + heals by eating** (ADR-050); **NO-STANCE-DOMINATED** test (replace the dominance-enshrining test); touch-legible wear axis + stance/training reveal beat; combat SFX. *(v0.3.1 ADR-076 supersedes the auto-heal model → HP-attrition, no auto-heal, 0 HP = loss stops autopilot.)* |
| **T0-M2-F4** Keep the bite, within guardrails | ✅ | **humbling, not punishing** — the friction *stays* (#13), it just can't strand you | DO **not** smooth the durability/satiety bite (#13 revises the audit's "tame friction"); guardrails: winnable · soft-setback only · no permanent loss · no dead-ends; keep the **"fresh-L1-no-wood reaches L2 before Broken"** no-stranding test |

### T0-M3 — The spine awakens *(the macro engine — ONE pillar)* — ✅ shipped (v0.3; the macro spine closes — the audit's #1 item, delivered)
*The first proof the tier vision closes a loop; the **de-risking spike, built on MINIMAL content** (decision #18) before the MS4 breadth. The demo's first new beat = the spine landing.*
| Fun-slice | The fun | DoD |
|---|---|---|
| **T0-M3-F1** The Estate pillar goes live | the House-Influence panel — the House's **koku STANDING** (a kokudaka-like prestige score; re-assessed seasonally, NEVER spent, gates ascension) — un-greys the **active Estate pillar + locked unnamed silhouettes** (ADR-055) | R7 capstone **opens** Phase 2; `pillarDeltas` deeds accrue **only** post-R7 (FU7); additive `influence:{value,highWater}` state; **DIVERGE** on the influence panel |
| **T0-M3-F2** The seasonal judged result | a reckoning falls and *judges* your house — a high-water payoff beat that **re-assesses the koku standing** (the seasonal judge, never an income multiplier) | `onReckoning` fires on **new high-water only** (cadence keyed to `PHASE2_JUDGE_INTERVAL_DAYS`, T0 = 3d), ±10% via a day-keyed named RNG sub-stream; **70/30** deeds/seasonal |
| **T0-M3-F3** Graduate the tutorial → **the BIG ceremonial T0→T1** | a **manual opt-in ascension story event** that **always lands BIG on first contact** (#14, **NQ-1 = full ceremony in this DoD**) — title card, macro silhouettes stir, music swell, a **dream/mystery beat** (ADR-055), the grade-scaled boon revealed | hybrid gate (**T0 = EXCELLENT**); overshoot → better permanent boon (ADR-049); `tier` 0→1 stored (**D-013a**; enum 0..5 per ADR-048); grade-scaled reward bundle; **first SCHEMA_VERSION bump → dev save-WIPE (#15)** + the real `migrate()` path **built + test-covered before launch** (not run across dev churn); **DIVERGE** on the ascension surface |

### T0-M4 — The showcase in miniature *(the breadth taste — fills R4→R7 around the proven spine)* — ✅ shipped (v0.3); coin economy tightened *further* in v0.3.1 (ADR-077)
*ADR-052: a tiny taste of every system so a genre-literate player sees the whole game's shape early — built **after** the MS3 spine spike proves the loop.*
| Fun-slice | The fun | DoD |
|---|---|---|
| **T0-M4-F1** Your first quest | a goal beyond grinding — take & complete one PEST/HUNT/CLEAR | one quest end-to-end (order-free advance-event set); reveals as a top-level tab (ADR-037) |
| **T0-M4-F2** The coin flywheel taste (**LINEAR**) | spend coin on a first estate upgrade that *raises yield* → it compounds | **LINEAR** estate-upgrade taste now (decision #20 — **branches into LAND / TREASURY / TRADE sub-engines at T1**); U1→U4 yield-bearing kura-works (ADR-051; U4 "long-house" added in v0.3.1 as a deeper coin sink — ADR-092/§4.6.6d); work→rice/coin→upgrade→more output; G-NO-DEAD-VALUES guards a compounding sink |
| **T0-M4-F3** Talk & a tiny market | the **mentor's lore-talk** deepens; a tiny COIN-sink **market** (the TRADE taste) — where you also **sell surplus RICE for coin** | one NPC **lore-talk** line via the mentor (data-not-script, ADR-039); a tiny market (capped coin sink) that also lets you **sell rice for coin at a price that SWINGS BY SEASON** (rice is a real resource — eat it, store it, or sell it); **DIVERGE** on the dialogue/market panels |
| **T0-M4-F4** A place to explore — a small **WALKABLE map** | the estate is areas you **move between**, not a menu (decision #23 — delivers the §1 "areas to explore" promise) | a **small walkable T0 map** (not just organizational room-grouping; **NQ-3 = minimal here, grow in T1**, with a pinned node-count ceiling); navigable, reveal-per-beat; **DIVERGE** on the map surface |
| **T0-M4-F5** Stance & ability reveals (R5 / weapon-L10) | the combat decision deepens with a reveal beat | stance slot + ability/item slots reveal one-per-beat; touch-legible (no hover-only) |

> **✅ Build order inside T0 — SPINE-FIRST, LOCKED (decision #18; resolves OQ-2).** The milestone order above
> **is** the build order: after the **T0-M2 retune**, build **T0-M3 (the spine spike)** — one pillar, one
> season-judge, the BIG ascension — **on minimal content FIRST**, proving the macro loop closes (the audit's
> #1 gap), *then* fill **T0-M4's showcase breadth** around the proven spine. The small walkable map (#23) is
> the heaviest new T0 build and sits in MS4 specifically so it can't crowd out the spine-first cadence; grow it
> in T1 (NQ-3 = option a).

---

# Tier T1 — Estate (full) — *DETAILED*

**Frame:** the tutorial's over and the estate is no longer in miniature — **the real grind.** The full household, its land, its debt and its arms all **scale into real depth** (ADR-052), and the mediocre-start protagonist becomes a genuinely *capable estate man*. Rungs **R8→R15** (≈8 new rungs, ~16 estate rungs total; resolves OQ-6) — they **continue the T0 R-ladder** (T0 was R0→R7), still estate-scale, before any village. This is where the **≥30-min/rung floor BINDS for the first time** (ADR-049, ADR-056 — T0 was floor-exempt); Phase-1 runs a provisional **~5–8h** (≈8 rungs × ≥40 min/rung; re-derives at the MS6 6-tier ~28.5h rescale). The new pillar is **Arms 武威** — earned via recognised martial **deeds** + a seasonal-security judged result; its ascension **un-greys the next pillar silhouette + opens the Village (T2)**. Difficulty stays **humbling THROUGHOUT** within guardrails (winnable · soft-setback-only · no permanent loss · no stranding, ADR-061). The estate's domain is still **its own land** — the valley does NOT open until the Arms ascension fires at tier-end; the "first errands past the gate / valley in view" beat is the **T2 teaser shown at ascension**, not playable T1 content. **4 milestones** (vs the old coarse 3 — see the milestone-cut note).

> **⏳ Also builds in T1 — the deferred T0-capstone branch quests.** The R7 choice
> (devoted / ambitious / humble) ships in T0, but its three unique side quests (→ a
> unique item + a separate unlock each) are **T1 content** and were deferred here
> (T1 didn't exist at design time, R6). Full build-ready spec:
> [`capstone-t0-branch.md`](../plans/t1/opus-2026-07-03-t1-capstone-branch.md); pattern + board: **ADR-125** /
> PRD §3.0.2.

### T1-M1 — The real grind opens *(the full ladder + the 3-lane flywheel)* — 🆕
*the tutorial's off — eight full-estate rungs, the ≥30-min floor binds, the coin flywheel splits into three lanes, and the labour/skill web deepens.*

| Fun-slice | Status | The fun | DoD |
|---|---|---|---|
| **T1-M1-F1** Past the Bailiff's post — the full-estate ladder + the floor binds | 🆕 | you climb out of the tutorial into eight real estate roles — **Kura Warden → Field Reeve → Drill-yard Hand → Stable & Woodlot Master → Ledger-hand → Armsman of the House → Under-steward → Trusted Man of the House** — and for the first time a rung is a genuine *grind*, not a quick taste; the estate starts taking you seriously | R8→R15 ladder live on a **two-track rung-meter** — an **Estate-Service** (labour) sub-meter + a parallel **Combat-Rank** (martial) sub-meter; promotion on the **Phase-1 AND-gate** (both sub-meters ≥ floor AND the rung's story milestone, §4.1.1); thresholds back-solved from the **≥30-min floor** (≈40 min/rung) and the **floor regression test goes live here** (MS6 fails on undershoot only, ADR-056); G-CURVE extends to the T1 ladder; **DIVERGE** on the two-sub-meter rung/track panel |
| **T1-M1-F2** The coin flywheel branches — LAND (shinden reclamation) | 🆕 | your single coin line **splits** — pour surplus into **LAND** and you drain and reclaim the first *shinden* marsh into new paddy; the estate visibly grows (E1→E2) and the new yield compounds back into the engine | flywheel branches **LINEAR → three capped sub-engines** (LAND / TREASURY / TRADE, ADR-066/ADR-051/ADR-008); LAND = **shinden reclamation**, yield-bearing (ADR-051); **E1→E2 estate stage lands here** (resolves ambiguity #1); the **TRADE lane is present but hard-capped ≤⅓** of Estate & Wealth (ADR-008); G-NO-DEAD-VALUES extends to every new sub-engine currency/sink; **DIVERGE** on the branched flywheel panel + the reclamation surface |
| **T1-M1-F3** The TREASURY engine — debt → solvency | 🆕 | you sit with clerk **Tanomo** and start chipping at the **Inherited Debt** owed to pawnbroker **Tōkichi** — the debt meter falls toward solvency, *goyōkin* leverage opens, and the house's circumstance (not a villain) slowly lifts | **TREASURY** capped sub-engine (debt→solvency, *goyōkin*); the Inherited Debt stays a **CIRCUMSTANCE, not a conspirator** — the "rigged box" racket has **no fingerprints at the estate** (it first surfaces at T2); debt-paydown is a real COIN consumer so G-NO-DEAD-VALUES holds; **DIVERGE** on the debt / ledger panel |
| **T1-M1-F4** The deeper labour/skill web — component crafting | 🆕 | the labour loop stops being flat — you **discover deeper skill chains by doing them**, and simple crafts grow into **component → quality** chains (gather → component → finished good), so a better tool is something you *build up to*, not buy | deeper labour/skill web + **component/quality crafting chains** (§2.11); **discover-by-doing** (no skill menu); conditioning stays the zero-stat enablement gate; G-NO-DEAD-VALUES (every component has a downstream consumer); **DIVERGE if** the component-chain craft view is a new surface beyond the T0 craft panel |

### T1-M2 — Arms rising *(the 2nd pillar — Arms 武威)* — 🆕
*the Sword line opens, the drill yard trains you, stance becomes a real build, and the Arms 武威 lane lights up (deeds defined, accrual Phase-2-gated to the MS4 capstone).*

| Fun-slice | Status | The fun | DoD |
|---|---|---|---|
| **T1-M2-F1** The Sword line opens (Combat Line 2) | 🆕 | a whole second weapon family arrives — found or crafted, never gifted — each with a distinct feel: the quick **Kodachi** (Riposte), the Iai-draw **Uchigatana**, the heavy cleaving **Ōdachi**; you take them into the **Near Satoyama** against boar, monkey troop, the wolf-pack and the *mamushi* pit-viper | **Line 2 swords** on a Combat-Rank rung-gate, found/crafted via a loot→craft loop (not a grant): **Kodachi** (spd 1.25, Riposte), **Uchigatana** (1.10, Iai-draw crit), **Ōdachi** (0.90, cleave 2); signatures deepen at **L25/L50** (§4.6.9); bestiary stays **GROUNDED** estate + near-satoyama beasts — the **first HUMAN threat (bandits/nobushi) waits for T2** (resolves ambiguity #4); the **first-fight 20–35%** T0 anchor governs T1 combat tuning; **NO-STANCE-DOMINATED** across the new weapons (ADR-050); **DISPLAYED==TESTED** fixed-seed win-rate; G-CURVE extends; **DIVERGE if** the weapon/signature detail view is a new surface |
| **T1-M2-F2** The drill-yard training track | 🆕 | drillmaster **Kihei** takes you into the drill yard — curated training (forms, sparring, conditioning) that builds your **Combat-Rank** meter and grants small, bounded per-skill combat perks; the mentor teaches the martial systems as *story*, never a popup | drill-yard curated combat-activity set feeds the **Combat-Rank** sub-meter; conditioning stays the zero-stat enablement gate; small **BOUNDED** per-skill combat perks (§2.7.1, ADR-027); diegetic-mentor onboarding via **Kihei** (data-not-script ADR-039; ADR-063; no hint popups); **DIVERGE** on the drill-yard / training-track board |
| **T1-M2-F3** Stance becomes a real build | 🆕 | HP now **carries between fights** and only heals by eating, so an aggressive vs a defensive **stance** genuinely trades — you build a fighting style, and combat couples to the food/cook sink (a hungry fighter is a weak one) | **HP carries + heals by eating** (ADR-050); defensive vs aggressive stances genuinely trade with **NO stance dominated** — the NO-STANCE-DOMINATED curve test (not a dominance-enshrining one); couples combat ↔ food/cook sink; **DISPLAYED==TESTED** on the stance win-rate forecasts; **DIVERGE if** the stance/HP-carry readout is a new surface beyond the T0 stance slot |
| **T1-M2-F4** The Arms 武威 lane lights up | 🆕 | the second pillar lane appears on the influence board — you learn what counts as a martial *deed* (declare a road safe, clear a nest, defend the grain store, break a rival's enforcer) and that the season's security will be *judged* on a new high-water; the pillar is real, even before it pays out | the 2nd pillar silhouette (un-greyed at the T0→T1 ascension) **NAMES here as Arms 武威** + the lane appears; deed VOCABULARY taught (**DEFEND** = canonical Arms earner) + the seasonal-security **judged-on-new-high-water** mechanic shown — but **ACCRUAL is Phase-2-gated** (FU7) and **Phase 2 opens at the R15 capstone (T1-M4-F1)**, so deeds + the **70/30** seasonal split bank only there; bands Arms good 0.5K / great 0.72K / excellent 0.95K, per-deed cap 0.04·good = **20 ip**; Arms kept distinct from character-level (1 kill → level) and Combat-Rank (1 curated activity → rung-meter) — **1 recognised DEED → Arms**; **DIVERGE** on the Arms influence lane / deed-log surface |

### T1-M3 — The macro deepens *(the meaty engines mature)* — 🆕
*more shinden and a solvent house, your first paid retinue, the estate physically mends as the map grows, and a thin TRADE taste.*

| Fun-slice | Status | The fun | DoD |
|---|---|---|---|
| **T1-M3-F1** LAND matures — the estate fills out | 🆕 | you reclaim more *shinden* and push estate upgrades — patch the kura, clear the drill yard, reclaim further paddy — and watch the **LAND** lane compound into a real engine; the home fields become the estate's heartbeat | LAND sub-engine matures — more **shinden reclamation** + yield-bearing upgrades beyond the T0 linear taste (patch-the-kura / clear-the-drill-yard / reclaim-the-shinden, demo values, ADR-051); the estate **advances a stage (E1→E2)**; the compounding LAND lane stays **capped**; G-NO-DEAD-VALUES (every upgrade yields); reuses the T1-M1-F2 reclamation surface (no new DIVERGE); **E2→E3+ provisionally slips to T2+ per ambiguity #1 — flagged for the human** |
| **T1-M3-F2** TREASURY matures — the house turns solvent | 🆕 | the debt finally breaks — you cross from debt into **solvency** and *goyōkin* leverage becomes a tool, not a noose; the long shadow of grandfather **Sadamune's** failed flood-venture (Dowager **Toku's** grief) lifts | TREASURY lane matures to a **solvency** milestone (debt→solvency complete); *goyōkin* leverage as a capped engine; ties to the **Dowager Toku / Sadamune** backstory (flavour, not a sim); G-NO-DEAD-VALUES; the TRADE lane still hard-capped ≤⅓ (ADR-008); reuses the T1-M1-F3 debt/ledger panel (no new DIVERGE) |
| **T1-M3-F3** Your first paid retinue | 🆕 | you hire your first men-at-arms, **Gohei** and **Yatarō** — paid retainers who fight and work alongside you; the estate is no longer just *you*, and a wage becomes a new recurring coin sink to balance | **first paid retinue (Gohei & Yatarō)** arrives in T1, following E2 (resolves ambiguity #1); retinue **wage = a recurring COIN sink** (G-NO-DEAD-VALUES); retainers contribute to labour/combat **WITHOUT trivialising the humbling tune** (ADR-061); **DIVERGE** on the retinue roster panel |
| **T1-M3-F4** The estate mends + the map grows | 🆕 | the estate visibly mends — mended roofs, cleared yard, new paddy, flavour you can *see* — and the walkable map grows outward to the **Near Satoyama** danger ring you now patrol; more places to move between, not more menus | estate physical growth as **FLAVOUR, not a management sim** (§4.7.5); the small **walkable map** (ADR-065) grows to include the **Near Satoyama** (conditioning-gated) — the **NQ-3 default** (grow the T0 map in T1); reveal-per-beat nav; **DIVERGE** on the grown map / new satoyama area view |
| **T1-M3-F5** The thin TRADE taste | 🆕 | you sell the estate's surplus through a slightly deepened market — a touch more than T0's tiny coin-sink — but trade stays a **minority lane**; the real village market and the silk *meibutsu* are still locked past the gate | **TRADE is the THINNEST T1 lane** (estate-internal surplus + a deepened T0 tiny-market taste — **no broker standing yet, that's T2's rep web**); the silk *meibutsu* (weaver **Onatsu**) + the real village market **WAIT for T2**, where TRADE matures (resolves ambiguity #2); trade **hard-capped ≤⅓** of Estate & Wealth (ADR-008); G-NO-DEAD-VALUES; **DIVERGE if** the deepened market is a new surface beyond the T0 market |

### T1-M4 — Two-pillar ascension → the valley opens *(the two-pillar gate)* — 🆕
*the R15 capstone opens Phase 2, the two-pillar hybrid gate (1 GREAT + 1 EXCELLENT) lights up, and the Arms ascension un-greys the next pillar + opens the Village.*

| Fun-slice | Status | The fun | DoD |
|---|---|---|---|
| **T1-M4-F1** The R15 capstone → Phase 2 opens | 🆕 | you reach **Trusted Man of the House (R15)**, the top estate rung, and **Phase 2 opens** — now your recognised deeds across **Estate AND Arms** finally count, and the grind turns from climbing rungs to building a legacy | R15 capstone **opens Phase 2** on the AND-gate; pillar DEEDS accrue **only** post-capstone (FU7) for both Estate + Arms; Estate deed bands good 0.8K / great 1.1K / excellent 1.5K (per-deed cap 0.04·good); **70/30** deeds/seasonal; G-CURVE extends through the capstone; reuses the T0 Phase-2 / influence surface (no new DIVERGE) |
| **T1-M4-F2** The two-pillar hybrid gate | 🆕 | for the first time the ascension is a **two-pillar test** — you push Estate and Arms toward the grades until the gate reads **1 GREAT + 1 EXCELLENT**; overshooting either banks a better, **grade-scaled permanent boon**, so there's a reason to grind past the line | ascension gate = **exactly 1 GREAT + 1 EXCELLENT** across Estate + Arms, **NO OVERFLOW**, both pillars ≥ GOOD (two-pillar hybrid, ADR-049); overshoot → better grade-scaled permanent boon (ADR-049); **DISPLAYED==TESTED** on the gate-readiness forecast; G-CURVE; **DIVERGE** on the gate-readiness / ascension-eligibility surface |
| **T1-M4-F3** The Arms ascension → the Village opens (dream beat) | 🆕 | a **manual opt-in** ascension story event you choose the moment for — the **Arms ascension** fires, the **next** locked silhouette (the unnamed 3rd — T2 will name it Office) stirs, the valley comes into view past the estate gate, and a **dream/mystery** beat lands; the estate finally trusts you to carry its business beyond its own land | **manual opt-in** ascension, not auto-advance (ADR-049/ADR-062); the Arms pillar's ascension fires (Arms was named in T1-M2-F4) and **un-greys the NEXT (3rd, still-unnamed) silhouette** — T2 names it Office 官威 (ADR-055; the ascension reveals the *next* pillar, NOT Arms — Arms is already live); fires a **dream/mystery** beat (ADR-055, Origin stays dark); the "first errands past the gate / valley in view" is the **T2 TEASER** shown here, NOT playable T1 content; `tier` 1→2 stored (**D-013a**; enum 0..5 per ADR-048); `migrate()` chain extends with a covering test; difficulty stays humbling into T2 (ADR-061); **DIVERGE** on the ascension / valley-teaser / silhouette-reveal surface |

---

# Tier T2 — Village (Asagiri) — *the valley beyond your gate* — *DETAILED*

**Frame:** the Arms ascension has fired and the estate now **trusts you to carry its business past its own gate** into the valley — *the HOUSE rising.* T2 is the reputation **WEB** tier: Asagiri's chief, shops, artisans, inn & rumours board, shrine, and the *kamikakushi* legend open **AROUND** the spine — continuous multi-node standing meters tuned for frequent small dopamine, unlike the rung ladder. The spine is a **fresh ~8-rung house-service ladder in the valley, V0→V7** — the rung numbering **RESETS** (T0 was R0–R7, T1 R8–R15, T2 a *new* V-ladder, ADR-012); **the village web NEVER gates that climb** (HARD rule, §1.5.2/§1.5.4) — ignoring it is "poorer and lonelier," a **~10–15% accelerant at most**, never a wall. Provisional **~8–10h** (re-derives in the 6-tier rescale; per-rung ≈ ≥40 min — **the ≥30-min floor binds here too**, only T0 is floor-exempt). The **Tama-vs-farmhand** allegiance goes LIVE (Sayo names him "Tama" on sight). **Trade matures** into a real silk market; the **first HUMAN threat** (bandits / starving deserters, *nobushi*) drives road-security **and opens the 3rd weapon line (staff/polearm)**; the valley's "spirits" all turn out to be **people** — chief among them Foreman **Magobei** skimming rice with a doctored *masu* (the "**rigged box**" motif's first appearance). The **Office 官威** pillar names mid-tier, rival houses appear, and the capstone teases the Region (T3). Difficulty stays **humbling** within guardrails (ADR-061). **4 milestones**; rungs map **~3/2/2/1** (V0–V2 / V3–V4 / V5–V6 / V7) — see the milestone-cut note.

### T2-M1 — Into the village *(the gate opens — the rep web)* — 🆕
*the estate gate opens onto Asagiri — first valley errands, a real coin market, the reputation web inks in around the spine, branching village talk (Sayo names him "Tama"), the rumours board's kappa opener, and the first human threat on the road (V0→V2).*

| Fun-slice | Status | The fun | DoD |
|---|---|---|---|
| **T2-M1-F1** Errands past the gate (V0 errand-runner) | 🆕 | the estate gate finally opens onto **Asagiri** — you walk the shop row, the river-ford and the shrine for the first time, run the house's first errands into the valley, and see your **coin** purse thicken into a bigger denomination | the small walkable map (T0/T1) **EXTENDS into Asagiri** — Market/Shop Row, Chief's House, Inn & Rumours Board, Shrine/Temple, River-Ford-&-Weir as navigable nodes, reveal-per-beat; the **V0 errand-runner** rung opens the valley market (one shop) — coin's **higher DENOMINATIONS scale up here** (mon → **monme** revealed as wealth grows; coin itself has existed since T0, this is NOT its debut — ADR-108), so G-NO-DEAD-VALUES keeps the market sink as its concrete consumer; **≥30-min floor** on the V0 rung-meter (re-derives, per-rung ≈ ≥40 min); **the village web NEVER gates the spine** (HARD, §1.5.2) — V0 advances on the rung ladder, the errands are an optional accelerant; **DIVERGE** contact-sheet on the village-map expansion + the new location surfaces |
| **T2-M1-F2** The reputation web inks in | 🆕 | every shopkeeper and family in Asagiri gets a face and a **standing meter** you nudge up with small, frequent wins — a warm hum of belonging the rung ladder never gave you | the reputation **WEB** panel — continuous multi-node meters with gentle curves for frequent small dopamine, **UNLIKE the rung ladder** (§1.5.2/§2.15): per-shop patron standing (smith Gonta, broker, herbalist Obaa Kuni, brewer Tokuemon), per-family goodwill, the Chief's regard (**Yagōemon**); G-NO-DEAD-VALUES — each meter has a concrete consumer (patron discounts / recipe & component unlocks / errand access); side-faction speedup **CAPPED ~10–15%** (HD-6) and **NEVER a wall** — ignoring the web is "poorer and lonelier," never blocked; **DIVERGE** on the rep-web panel |
| **T2-M1-F3** Branching village talk — "Tama" goes live | 🆕 | real conversations with **choices** — you can play Asagiri peaceful or assertive, and the moment **Sayo** lays eyes on you she calls you "**Tama**," and the game quietly starts tracking who you let yourself be | branching NPC dialogue (ADR-039): data-not-script `choices[]` / `locksLineIds[]` / flags, deterministic; carries the **Peaceful/Assertive** route + the **Tama-vs-farmhand** leaning as flags (Sayo names him "Tama" on sight — the allegiance goes **LIVE** this tier); the diegetic mentor (ADR-063) extends into the village cast, no popups; **DIVERGE** on the branching-dialogue choice UI (the `choices[]` surface is new vs T0's linear lore-talk) |
| **T2-M1-F4** The inn & the rumours board (the kappa opener) | 🆕 | the inn's **rumours board** posts the valley's tall tales — your first is a "**kappa**" dragging folk under at the ford; chasing it is pure optional flavour with a thread of dread | **Inn & Rumours Board** surface (innkeeper **Sukezō**); the **kappa-of-the-ford OPENER** posts as the first yokai-debunk quest (§1.10/§2.13) — INVESTIGATE-then-confront, resolving **one-to-one to a human/natural cause** (undertow / smugglers at the weir) with dawning dread and **NO Scooby unmasking** (ADR-002); **OPTIONAL — never gates the spine**; **DIVERGE** on the rumours-board surface |
| **T2-M1-F5** Road-warden: the first human threat + the Staff line (V1→V2) | 🆕 | the valley's roads aren't safe — a starving band of deserters (**nobushi**) holds the ford road, and clearing them is the first time your blade is pointed at **PEOPLE**, not beasts; to hold a road you take up a whole new weapon family — the **staff & polearm line** | **V1 recognised-hand → V2 road-warden** rungs (combat gate): valley pest clears (hornet nest *suzumebachi*, wolf pack *ōkami*) then the **FIRST HUMAN THREAT — bandits / starving deserters (nobushi)** — the road-security core + new foe variety; the **3rd combat line OPENS here — Staff / polearm (Bō, Naginata, Kanabō, Tetsubō)**, found/crafted via a loot→craft loop (never gifted), signatures deepening at weapon-L25/L50 (§4.6.9) — *(human steer 2026-06-29: the Staff line is **pulled forward from T3 into T2**, so the roster is complete by end-of-T2 and T3 is combat depth, not a new line)*; the two existing lines (spear L1 / sword L2) also deepen via their L25/L50 signatures; NO-STANCE-DOMINATED across all three lines (ADR-050); DISPLAYED==TESTED fixed-seed win-rate; G-CURVE extends to nobushi; **≥30-min floor** on the V1/V2 rung-meter; **DIVERGE** on the new staff-weapon / signature surface |

### T2-M2 — The valley economy & the tanuki *(trade matures + the tanuki)* — 🆕
*trade matures into a real silk market (Onatsu's meibutsu), the valley's "spirits" come apart into people — chief among them the tanuki skimming the granary (Magobei's doctored masu, the rigged-box motif's first appearance) — and the foothills open as a second danger ring (V3→V4).*

| Fun-slice | Status | The fun | DoD |
|---|---|---|---|
| **T2-M2-F1** The silk road opens (TRADE matures) | 🆕 | the valley's real economy clicks on — you broker the district's **silk** (**Onatsu's** sericulture *meibutsu*) through a proper market, and watching a trade route **compound** is the meatiest money the game has offered yet | **V3 steward-of-the-valley-economy** rung; the **real village market** + the silk/sericulture *meibutsu* chain (weaver **Onatsu**) — broker standing meters, routes; **TRADE stays HARD-capped ≤⅓** of Estate & Wealth (ADR-008), the clamp now genuinely **EXERCISED** by the silk market; reconciles with T1's TRADE sub-engine (**T1 = estate-internal surplus + the deepened tiny-market taste; T2 = the real village market + broker standing the surplus plugs into** — broker standing is *this* tier's rep-web content, not T1's); G-NO-DEAD-VALUES — coin + silk both have consumers; **≥30-min floor** on the V3 rung-meter; **DIVERGE** on the silk-market / broker-trade surface |
| **T2-M2-F2** The tanuki at the granary (Magobei's skim surfaces) | 🆕 | the "**tanuki**" raiding the headman's granary is no spirit — it's Foreman **Magobei** skimming rice with a doctored measuring-box, and uncovering the **rigged box** is the first pull on a thread that runs all the way up | the tanuki rumour resolves to **ANTAGONIST Foreman Magobei** ("the tanuki") skimming rice with a doctored *masu* (**kyō-masu**) — the **FIRST APPEARANCE of the "rigged box" through-line motif**; INVESTIGATE-then-confront one-shot; the thread runs up to headman **Yagōemon** → **PARTIAL justice** (no clean win); building the case raises the **Chief's regard** — the **V4 "trusted-of-the-headman" rung that CULMINATES MS2**, and reaching V4 triggers the **Office pillar to NAME as the MS3 opener** (T2-M3-F1); OPTIONAL — never gates the spine; belief→cause one-to-one (ADR-002); **≥30-min floor** on the V4 rung-meter; **DIVERGE** on the investigation/evidence/case surface |
| **T2-M2-F3** The rumours resolve to people, not spirits | 🆕 | one by one the valley's hauntings come apart in your hands — the **fox-fire** on the ridge, the **ghost-bird** in the reeds — each a human or natural truth, leaving exactly one offering at the weir you can never quite explain | the remaining yokai-debunk quests: "**fox-fire**" = a hidden charcoal kiln (**SEEDS at T2, RESOLVES at T3**); "**ghost-bird**" = a night-heron; each resolves **one-to-one to a human/natural cause** with dawning dread (ADR-002, no unmasking gag); the **SINGLE capped residual-ambiguity token** game-wide = the **jizō-at-the-weir** offering (left genuinely unexplained); all **OPTIONAL** — none gate the spine; **DIVERGE** on any new quest/investigation surface |
| **T2-M2-F4** The foothills danger ring (charcoal grounds) | 🆕 | past the valley floor the **foothills** open — the charcoal grounds where the "fox-fire" burns, a second, nastier danger ring with a **rogue bear** that will end a careless climb | the **Foothills & Charcoal Grounds** open as the **2nd danger ring** (the "fox-fire" kiln location) — new map nodes, reveal-per-beat; an optional **rogue bear** as a humbling apex foe within guardrails (winnable / soft-setback-only / no stranding, ADR-061); NO-STANCE-DOMINATED; DISPLAYED==TESTED; G-CURVE extends to the foothills foe tier; **DIVERGE** on the foothills map expansion |

### T2-M3 — Office & the rivals appear *(the 3rd pillar — Office 官威)* — 🆕
*the Office 官威 pillar names + activates as the milestone opens (you reached V4 at MS2's end), rival houses (Tomita/Akagi) appear and the contest begins, cross-pillar combos surface as the Office pairs, and Naoyuki turns from rival to shoulder-to-shoulder (V5→V6).*

| Fun-slice | Status | The fun | DoD |
|---|---|---|---|
| **T2-M3-F1** Office 官威 reveals (the 3rd pillar goes live) | 🆕 | the headman grants you your first real **office** — and the House-Influence board **NAMES a third pillar, Office 官威**, the social power the rung ladder alone could never buy | with **V4 "trusted-of-the-headman" reached** (the MS2 culmination), the **Office 官威 (kan'i)** pillar **NAMES + activates** as the MS3 opener — the in-tier mechanical reveal of the silhouette un-greyed (still unnamed) at the **T1→T2 ascension** (ADR-055); earned via offices granted / territory secured / alliances sealed / rivals eclipsed (§1.6.1/§4.2.1); Office **DEEDS are Phase-2-GATED** (accrue ONLY post-V7 capstone, FU7) — MS3 reveals + builds standing, the grade banks in Phase 2; deed bands good 2K / great 3.2K / excellent 4.5K, per-deed cap 0.04·good = **80 ip**; **70/30** deeds/seasonal; **DIVERGE** on the Office-pillar panel |
| **T2-M3-F2** The rival houses appear + the contest begins | 🆕 | you're not the only house climbing — **Tomita** (money) and **Akagi** (honour) are in the valley too, and the first time a deed is **CONTESTED** you either eclipse a rival or watch them gain ground | rival houses **INTRODUCED** — House **Tomita** (money) + House **Akagi** (honour) — with light per-pillar rival stats (overtake **COMPUTED, not scripted**, §1.11); the **CONTEST BEGINS** + the **FIRST contested deed** lands at T2; the climax (G5 Naoyuki ally-flip, G7 dethroning) is **held for T3** — T2 only introduces + begins; contested Office/territory deeds; **DIVERGE** on the rival-house board + the contested-deed surface |
| **T2-M3-F3** Cross-pillar combos surface (the Office pairs) | 🆕 | a single bold deed can now feed **two ambitions at once** — break a rival's enforcer on a road you also hold office over, and both your **Arms** and your **Office** grow from the one act | cross-pillar combos surface as a **PARTIAL set** at T2 — **Office pairs ONLY (Arms×Office, Estate×Office)** — because the **Name** pillar isn't revealed until T3 (the full 4-pillar anti-slump set lands T3); combos computed **POST-trade-clamp**, **EXCLUDED from the gate-check AND from the trade ≤⅓ denominator** (ADR-031/§4.3.1); **DIVERGE** on the combo-credit display |
| **T2-M3-F4** Shoulder to shoulder with Naoyuki (the bridge beat) | 🆕 | the heir **Naoyuki** — your in-house rival since the estate — fights the valley watch **at your side**, and grudging respect replaces the rivalry; not friendship yet, but the door cracks open | **V5 sworn-man-at-arms → V6 right-hand-in-waiting** rungs; the valley watch / DEFEND core, with **your retinue (Gohei & Yatarō, hired in T1-M3-F3) deployed alongside you** — and able to take on valley men (an EXPANSION, not a "first" retinue — that was T1); the **Naoyuki rivalry→grudging-RESPECT BRIDGE** beat lands here (seeded T0, bridge at T2, ally-flip climax at T3-G5); branching dialogue (ADR-039) carries it; NO-STANCE-DOMINATED + DISPLAYED==TESTED on the watch combat; **≥30-min floor** on the V5/V6 rung-meter; **DIVERGE** on the retinue/watch surface |

### T2-M4 — Three-pillar ascension *(the three-pillar gate → the Region)* — 🆕
*the V7 capstone opens Phase 2, the three-pillar gate (1 EXC + 1 GRT + 1 GOOD across Estate+Arms+Office) lights up with an honest forecast, the manual opt-in ascension fires a dream beat + grade-scaled boon, and the Region + rival houses are revealed as the T3 teaser (V7).*

| Fun-slice | Status | The fun | DoD |
|---|---|---|---|
| **T2-M4-F1** The valley-anchored capstone (V7 → Phase 2 opens) | 🆕 | you become the house's anchor in the valley — the capstone rung that finally **OPENS the pillar grind**, where every deed across Estate, Arms and Office at last counts | **V7 "agent of the house, valley anchored"** capstone **OPENS Phase 2** (§1.6.4/§4.1.1); pillar DEEDS for all three revealed pillars (Estate, Arms, Office) accrue **ONLY now** (FU7); **≥30-min floor** on the V7 rung-meter (re-derives); **the village web has NEVER gated the climb** to here (HARD rule held throughout); reuses the Phase-2 / influence surface (no new DIVERGE) |
| **T2-M4-F2** The three-pillar gate | 🆕 | the ascension gate lights up — but this time it wants **THREE pillars** in balance, and the forecast tells you honestly how close each one is | the **T2→T3 gate = three-pillar hybrid 1 EXCELLENT + 1 GREAT + 1 GOOD** across Estate + Arms + Office, all ≥ GOOD, **NO overflow** (ADR-049); cross-pillar combos **EXCLUDED from the gate-check** (ADR-031); **DISPLAYED==TESTED** — the displayed gate-readiness forecast matches the fixed-seed analytic gate; G-CURVE extends to the 3-pillar grade curve; **DIVERGE** on the gate / ascension-readiness surface |
| **T2-M4-F3** The ascension story event → the Region opens | 🆕 | you choose your moment and trigger the rite — a new **dream** beat stirs, the next mountain's silhouette **un-greys**, and the valley walls fall away to reveal the wider **Region** you'll climb next | **MANUAL opt-in** ascension story event (ADR-049/ADR-062 — NOT auto-advance); clearing the gate **un-greys the NEXT (4th, still-unnamed) silhouette** (ADR-055 — foreshadows **Name 家格**, T3) + fires a **DREAM/MYSTERY** beat (Origin stays dark — opens T3, ADR-009); **grade-scaled permanent boon** (overshoot → better boon); `tier` 2→3 stored (**D-013a**; enum 0..5 per ADR-048); the ascension **UNLOCKS the Region (T3)**; `migrate()` chain extends with a covering test; **DIVERGE** on the ascension story surface |
| **T2-M4-F4** The Region + rival houses revealed (the T3 teaser) | 🆕 | the new map opens and there they are arrayed against you — **Tomita** and **Akagi** on the Region board, the rivals you'll actually have to **dethrone** next tier | clearing the gate opens the **Region MAP** + arrays the rival houses (Tomita, Akagi) as the **T3 antagonists** — the **T2→T3 TEASER** (the contest BEGAN at T2; the climax — G5 ally-flip, G7 dethroning — is T3); region travel / *sekisho* / the Name pillar all **deferred to T3**; **DIVERGE** on the region-map teaser surface |

---

# Tier T3 — Region — *COARSE (v1 finish — re-detailed on approach)*

**Frame:** (was T2) the wider canvas — region travel/sekisho, trade backbone, the **Origin** faction opens;
**+Name 家格** pillar; the **Otsuru/Tama origin payoff** (canon Region payoff); the weapon roster (spear/sword/staff) is **complete by T2** so T3 *deepens* combat (no new line); **v1 content ends here**
(`outcome: t3done`). *(The narrative close lives in T3-M3 below; the **technical release** is the **Ship**
section that follows.)*

| Milestone | Headline | Example fun-slices |
|---|---|---|
| **T3-M1** The wider canvas | region travel + sekisho + trade backbone; **Origin faction opens** | the Origin homecoming thread begins; a region-scale quest |
| **T3-M2** Name & the rivals dethroned | the **Name 家格** pillar; surpass the rival houses; the **full 4-pillar** cross-pillar combo set (anti-slump) | the rival-house climax (G5 Naoyuki ally-flip → G7 dethroning); the full 4-pillar board |
| **T3-M3** The origin payoff & v1 close | the **Otsuru/Tama truth** at Region; the four-pillar gate; the **bounded "v1 complete"** narrative surface → free-play | the missable name-reclaim (Origin O5); the G6 payoff; the bounded ending + free-play |

---

# Ship — v1 release readiness — *DETAILED*

**Frame:** v1 = the T0→T3 *content*; **Ship** is the section that actually **releases** it. It restores the old
roadmap's dropped back half — the **MS6** whole-v1 balance/fun/perf gate and the **MS7** itch.io release — that
the tier re-axe had folded away. The **narrative** ending (the Otsuru/Tama payoff, the four-pillar gate, the
bounded close → free-play) stays in **T3-M3**; Ship owns the **technical** release-readiness. Per the human's
2026-06-29 call: **per-slice DoD contracts run all through the build, AND a consolidated final gate runs here.**
**2 milestones.**

### Ship-M1 — The v1 quality gate *(the consolidated balance/fun/perf pass the old MS6 held)* — 🆕
*the whole game is balanced, instrumented and checked as one piece before it ships.*

| Fun-slice | Status | The fun | DoD |
|---|---|---|---|
| **Ship-M1-F1** Whole-v1 balance pass | 🆕 | the whole game is balanced as one piece — the graded win-rate curve holds from the first wolf to the four-pillar gate, every value still has a consumer, and no stance is a trap | one consolidated **G-CURVE** holds across ALL of T0→T3; the **G-NO-DEAD-VALUES** ledger is complete (every currency / sub-engine value has a consumer); **NO-STANCE-DOMINATED** across the full weapon roster (spear L1 + sword L2 + T3 line); **trade ≤⅓** + **70/30** verifier-green tier-wide; **DISPLAYED==TESTED** everywhere a win-rate shows |
| **Ship-M1-F2** Fun-proxies become a GATE + the floor regression | 🆕 | the pacing/fun instrumentation graduates from report-only into a hard gate — the build can't ship if a rung undershoots the floor or a fun-proxy regresses | promote the report-only **fun-proxies** (pacing / dead-time / first-action) → a **GATE** (the instrumentation MS1 shipped WITHOUT — ADR-071's motivating evidence); the **≥30-min floor REGRESSION** consolidated across T1–T3 (fails on undershoot only, ADR-056); the **§4.8 ~28.5h budget RE-DERIVED** across the 4 v1 tiers (T0 fast/floor-exempt + T1/T2/T3 floored) |
| **Ship-M1-F3** The perf budget gate | 🆕 | the game stays smooth and light — a frame/load/memory budget the build is held to | a **PERF budget gate** (frame-time / load-time / memory ceiling) + the perf test the old MS6 carried; runs in `verify`/CI; no UI surface (no DIVERGE) |
| **Ship-M1-F4** Accessibility acceptance pass | 🆕 | the whole game is checked for reach — reduced-motion, mute, touch-legible, readable contrast — across every surface | a11y **ACCEPTANCE** pass (PRD §2.21 / ADR-045): reduced-motion honored, mute-safe SFX, **touch-legible (NO hover-only)**, colour-contrast across every v1 surface T0→T3; closes the audit a11y gap; per-surface DIVERGE contact-sheets already enforce visual intent — this is the consolidated acceptance check |

### Ship-M2 — Cut the build & ship *(the old MS7)* — 🆕
*the save survives the real world, then the game actually goes out — the deliberate, human-approved way.*

| Fun-slice | Status | The fun | DoD |
|---|---|---|---|
| **Ship-M2-F1** Save durability at release | 🆕 | your save survives the real world — the itch.io cross-origin iframe, a mid-write crash, a poisoned record — verified on an actual build | the **cross-origin-iframe SAVE-SURVIVAL test** (PRD §6.8) on a real itch build; crash-recovery ring + safe-mode + poison-suppression verified; the **`migrate()` chain test-covered end-to-end** (ADR-067 / D-013a — the real forward-migration path exercised, not just the dev save-wipe); no new UI surface (no DIVERGE) |
| **Ship-M2-F2** Cut the itch.io build & ship | 🆕 | the game actually goes out — a stamped itch.io build, uploaded the deliberate, human-approved way | `pnpm run build:itch` (content descriptors + build stamp); the deliberate, **HUMAN-APPROVED itch.io upload** (ADR-017 — outward-facing, requires human sign-off, never auto); the bounded "v1 complete" narrative close already shipped in T3-M3 — Ship-M2 is the technical release |

---

## Cross-cutting (thread through every fun-slice, not a tier)

- **Diegetic-mentor onboarding** (decisions #22, #17, ADR-015, ADR-063): the **domain-split canon cast** —
  **Genemon** (labour/rice/coin, introduced in **T0-M1-F3**) · **Kihei** (arms/combat, **T1-M2-F2**) · **Sōan**
  (healing) — teaches each system in-world as it unlocks, **never popups**. Deepened by the village/region cast
  at T2+.
- **DEV tools** (decision #16, ADR-067): the **2×/4×/8× speed toggle + jump-to-rung/tier teleport** ship in
  **T0-M1-F4** and stay available all tiers; DEV-only, stripped from prod. Defer richer dev affordances until a
  test needs one.
- **Save policy** (decisions #15, D-013a, ADR-067): **wipe dev/v0.2 saves on the reshape schema bump**
  (pre-launch, no users); build + test-cover the real `migrate()` path **before launch** (the consolidated
  exercise is **Ship-M2-F1**), not across dev churn. D-013a forward-migration still governs shipped saves.
- **Active-only "leave-it-running" clock** (ADR-079): the sim **pauses on `document.hidden`** (no
  offline/background catch-up); the genre's "leave it running" fantasy (§1.1) comes from **tab-open
  auto-repeat while the tab is visible**. A behaviour every tier's clock inherits.
- **Milestone-integrity** (ADR-054): a milestone is SHIPPED only when **every DoD line is met OR ADR-amended
  before the commit**; a **CI manifest check** asserts every instrument a DoD names resolves to a real
  test/tool (bans "SHIPPED (slice)"). The per-milestone verify-green gate is the lighter, per-commit half;
  this is the full integrity rule. *(ADR-054 is the source; this re-axe bakes the contract in.)*
- **Process gates** — the **op-model v2 FINAL** ([`2026-06-29-operating-model-v2-final.md`](../../project/archive/2026-06-29-operating-model-v2-final.md),
  built by a concurrently-active op-model agent) is the **source of truth**: that plan *defines* the gates,
  this roadmap *bakes them in*. All three are now **BUILT**: (1) the **pre-commit gate runs the full `verify`**
  (drift-bounded ~5s budget, never time-blocking; `SKIP_VERIFY=1`/`SKIP_JOURNAL=1` escape hatches); (2) the
  **`playcheck` fun-vector ratchet** (4 pacing/fun proxies, in `verify`) — so the **≥30-min floor** + the
  pacing/fun DoD lines above are **machine-enforced**, not merely asserted; (3) the **mandatory `diverge`
  contact-sheet skill** (DS#10, human's 2026-06-29 steer — mandatory for new/major UI surfaces, one-line tweaks
  exempt), so the **DIVERGE** DoD lines reference a real skill. **DIVERGE + `playcheck` are the two forward DoD
  contracts** the fun-slices carry. *(The FINAL plan's ADR numbers are still being formalized into
  `decisions.md` — defer to that plan, not to a specific D-0NN here.)*
- **PRD stays liquid** (decision #7, ADR-059): no §1 freeze; the PRD is split into per-section files (decision #6)
  and rippled in one batch, then re-tuned by playtest through T0→T3; converted to living docs only once v1 is
  **fully built + playtested**.
- **Acceptance gates extend, never regress:** each new tier extends **G-CURVE**; each new currency extends the
  **G-NO-DEAD-VALUES** ledger; each ascension extends the **migrate()** chain with a covering test. The
  consolidated whole-v1 versions are gated in **Ship-M1**.

---

## Resolved open questions (the proposal's original 6 — now CLOSED)

All six of this proposal's original open questions are resolved by the 2026-06-29 decision session.

| # | Original question | Resolution | Source |
|---|---|---|---|
| **OQ-1** | Milestone count (N per section)? | **No fixed cut — agent's content-driven call** (human 2026-06-29: "as many milestones as you please"). The old "4/3/3/3" is fully retired; the current shape **4/4/4/3 (+ Ship's 2)** reflects the content and may grow/shrink as on-approach detailing warrants. | **human steer + agent design** |
| **OQ-2** | Within-T0 order — spine-spike first or breadth first? | **SPINE-FIRST, thin.** Embodied in the milestone order: **T0-M3 (spine, on minimal content) is built before T0-M4 (showcase breadth)**. | **decision #18** |
| **OQ-3** | Fun-slice granularity / grain? | **"One playable thing per fun-slice", ≈3–5 per milestone** — kept (T1/T2 run 4–5 per milestone). | delegated → agent call |
| **OQ-4** | Shipped T0 — rebuild or carry forward? | **CARRY FORWARD + RETUNE.** MS0–M2b is the kept, play-tested foundation; the reshape layers on top (NOT a rebuild). | **decision #19** |
| **OQ-5** | Naming — IDs or human-readable? | **Keep BOTH** — `T0-M3-F1`-style IDs *and* human-readable slice names. | delegated → agent call |
| **OQ-6** | T1 rung count? | **~8 rungs (≈R8→R15); ~16 estate rungs total.** | **ADR-052 + reshape** |

## Forks & open questions — ALL RESOLVED (2026-06-29)

**Resolved this round (2026-06-29 decision session):**
- **NQ-1 — Ceremony inside the thin spike → CONFIRMED (option A).** The full ceremonial polish (title card,
  silhouettes-stir, music swell, dream beat) stays in **T0-M3-F3's DoD** — it's content-independent, so the
  first ascension lands BIG even on thin content (#14/ADR-062).
- **NQ-2 — Diegetic-mentor cast → the DOMAIN-SPLIT CANON CAST.** Genemon (labour/rice/coin) · Kihei (arms/combat) ·
  Sōan (healing). Wired into T0-M1-F3, T1-M2-F2, and the cross-cutting bullet.
- **NQ-3 — Walkable-map scope → option (a).** Minimal walkable map in **T0-M4-F4**, grown in **T1-M3-F4** (Near
  Satoyama) and **T2** (Asagiri + Foothills), with a pinned node-count ceiling. (Option (c) would violate ADR-065.)
- **T2 weapon line → PULL THE STAFF LINE INTO T2** (human steer 2026-06-29). The 3rd combat line (Bō / Naginata
  / Kanabō / Tetsubō) opens at **T2-M1-F5**, found/crafted; the weapon roster is **complete by end-of-T2**, so
  **T3 is combat *depth*, not a new line**.
- **Cross-pillar combos → PARTIAL set at T2 (Office pairs only)** — Arms×Office + Estate×Office surface at
  **T2-M3-F3**; the full 4-pillar anti-slump set lands at T3 when Name reveals.
- **Milestone count → AGENT'S CONTENT-DRIVEN CALL, no fixed cut** (human: "as many milestones as you please").
  The current 4/4/4/3 (+ Ship's 2) reflects the content; expand or contract freely as on-approach detailing warrants.

**Finalized 2026-06-29 — all forks CLOSED (the human confirmed every default; none block the build).** Ledger:
[`2026-06-29-roadmap-forks-finalized.md`](../../project/feedback-human/2026-06-29-roadmap-forks-finalized.md).
1. **Per-tier hour floors** (#1) → **ACCEPTED AS PROVISIONAL.** T1 ~5–8h · T2 ~8–10h · per-rung ≈ ≥40 min set
   rung thresholds only; PRD §4 is liquid (ADR-059), playtest re-tunes, and the §4.8 ~28.5h budget **re-derives
   across all 4 v1 tiers together at Ship-M1-F2**.
2. **E-stage → tier mapping + retinue** (#2) → **DEFAULT.** E1→E2 lands in T1 (estate visibly grows once),
   E2→E3+ slips to T2+, and the first paid retinue (Gohei & Yatarō) belongs to T1 — so T2's V5 is a
   deployment/expansion, not a first.
3. **T1 R8→R15 rung titles + the two-track meter** (#3) → **ACCEPTED (both).** Keep the proposed titles (Kura
   Warden → … → Trusted Man of the House) and the two-track Estate-Service / Combat-Rank sub-meter split (the
   Phase-1 AND-gate); titles are easily restyled later.
4. **Rival-house T2/T3 split** (#4) → **DEFAULT.** Rivals INTRODUCED + the contest BEGINS + the first contested
   deed at T2; the climax (G5 Naoyuki ally-flip, G7 dethroning) at T3.
5. **Deed-band magnitudes** (#5) → **ACCEPTED AS PROVISIONAL.** T1 Arms 0.5K/0.72K/0.95K (cap 20 ip) + Estate
   0.8K/1.1K/1.5K; T2 Office 2K/3.2K/4.5K (cap 80 ip), Estate good 8K / Arms good 5K (PRD §4 liquid, ADR-059;
   re-confirm against ADR-049 on approach).
