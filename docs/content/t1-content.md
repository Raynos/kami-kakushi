# T1 content (PROVISIONAL — hand-authored)

> PROVISIONAL / PROPOSED content — hand-authored from the roadmap re-axe proposal + the T1/T2 content digest, NOT generated. Unlike t0-content.md (generated from `src/core/content/*`), T1 is not built yet; once built, this regenerates from the typed registries (generate-don't-duplicate). Numbers are 'proposed v1 balance' (PRD §4 liquid, D-059) and re-tune by playtest. Source roadmap: `docs/plans/2026-06-29-roadmap-reaxe-proposal.md` (§ Tier T1).

**Tier frame.** The tutorial is over; the estate is no longer in miniature — *the real grind.* The full household, its land, its debt and its arms all scale into real depth (D-052), and the mediocre-start protagonist becomes a genuinely capable estate man. Rungs **R8→R15** *continue* the T0 ladder (T0 = R0→R7), still estate-scale, before any village opens. The estate's domain is still **its own land** — the valley does not open until the **Arms 武威** ascension fires at tier-end. **Pillar earned this tier: Arms 武威** (its ascension un-greys the next, still-unnamed silhouette and opens the Village/T2). **Weapon line introduced: the Sword line (Line 2).** **Koku flywheel branches** from one linear line into three capped sub-engines (LAND / TREASURY / TRADE — TRADE thin at T1). This is where the **≥30-min/rung floor binds for the first time** (D-049, D-056 — T0 was floor-exempt). Built across **4 milestones** (T1-M1…T1-M4).

> **Legend.** "(to-author)" = copy/value not yet written; "(proposed)" = a sensible default from the proposal, easily restyled on build. Titles, kanji, rung story-milestones, curated-activity sets and any value tagged demo/proposed are **provisional v1 balance** and re-tune by playtest (D-059).

---

## 1. Rung ladder (T1 — Estate, full)

Eight new full-estate rungs (R8→R15, ~16 estate rungs total; D-052 + reshape, resolves OQ-6). Promotion is the **Phase-1 AND-gate** (§1.6.4 / §2.15.1 / §4.1.1): a rung promotes only when **both** rung sub-meters are ≥ their per-rung-reset threshold **AND** the rung's story milestone is met. Thresholds are **back-solved from the ≥30-min floor × eligible-activity rate** — T1 per-rung floor ≈ **≥40 min** (§4.1.1). The **two sub-meters**: **Estate Service** 家役 (labour) + **Combat Rank** 武鍛 (martial). "Track focus" = which sub-meter the rung's curated activities chiefly feed; **both sub-meters still gate every rung**. The capstone **R15 opens Phase 2** (the pillar grind) — pillar DEEDS accrue only in Phase 2 (FU7).

| rung | title (proposed) | kanji (proposed) | track focus | story milestone / gate (to-author, proposed) | granter |
|---|---|---|---|---|---|
| R8 | Kura Warden | 蔵番 | Estate Service | secure & inventory the storehouse; **patch the kura (E1)** | Genemon |
| R9 | Field Reeve | 田司 | Estate Service | oversee the home paddies; **open the first shinden reclamation (LAND)** | Genemon |
| R10 | Drill-yard Hand | 稽古方 | Combat Rank | **clear the drill yard (E2)**; first drill-yard training under Kihei | Kihei |
| R11 | Stable & Woodlot Master | 厩司 | Estate Service | run the stables & woodlot; **first component-craft chain** | Genemon |
| R12 | Ledger-hand | 勘定方 | Estate Service | sit with Tanomo; **open the debt ledger (TREASURY)**; first *goyōkin* | Tanomo / Genemon |
| R13 | Armsman of the House | 武者 | Combat Rank | **take up the Sword line (Line 2)**; first recognised DEFEND | Kihei |
| R14 | Under-steward | 用人 | Estate Service | **hire the first retinue (Gohei & Yatarō)**; patrol the Near Satoyama | Genemon |
| R15 | **Trusted Man of the House** (capstone) | 家宰 | both (AND-gate) | the estate names you its trusted man — **OPENS Phase 2** | Lord Shigemasa |

*Build mapping (loose, system-themed not rung-banded): the ladder + floor land in T1-M1; the Sword line / drill-yard / stance / Arms-lane in T1-M2; LAND/TREASURY maturation + retinue + map growth in T1-M3; the R15 capstone → Phase 2 → two-pillar gate → ascension in T1-M4. Rung↔milestone exact split is to-author.*

### T1 labour & training activities (proposed — extends the T0 set)

T0 shipped `farm_paddy · haul_stores · woodcut_edge · forage_satoyama`. T1 deepens the labour/skill web (discover-by-doing, no skill menu) and adds curated drill-yard activities feeding **Combat Rank**. Yields/satiety/xp are **(to-author)**.

| id (proposed) | skill | feeds | area | note |
|---|---|---|---|---|
| `reclaim_shinden` | farming / conditioning | Estate Service + LAND | home paddies & dry fields | drains/reclaims marsh → new yield-bearing paddy |
| `tally_ledger` | clerking (to-author skill) | Estate Service + TREASURY | main house / study | debt-paydown & *goyōkin* bookkeeping |
| `craft_component` | woodcutting / smithing (to-author) | Estate Service | woodlot / kura | gather → component → finished good (§2.11) |
| `drill_forms` | conditioning / martial | **Combat Rank** | drill yard | curated forms; bounded per-skill combat perk |
| `spar_drillyard` | martial | **Combat Rank** | drill yard | sparring under Kihei |
| `patrol_satoyama` | conditioning / martial | **Combat Rank** | near satoyama | conditioning-gated; seeds DEFEND deeds |

**Skills:** T0's `farming · foraging · woodcutting · conditioning` carry forward; **conditioning stays the zero-stat enablement gate** (D-027). New skills for the deeper web + component chains (e.g. **clerking**, **smithing/crafting**) are **(to-author)**. Bounded labour→combat cross-feed only (each skill grants a small capped combat perk; big combat power stays combat-sourced — D-027).

---

## 2. The pillar — Arms 武威 (NEW this tier)

| field | value |
|---|---|
| pillar | **Arms** |
| kanji | **武威** (*bui*) |
| added | T1 — **named in T1-M2-F4** (the silhouette un-greyed at the T0→T1 ascension is named here) |
| unlocks | its ascension opens the **Village (T2)** (D-048) |
| earned via | recognised martial **DEEDS only** + a **seasonal-security judged result** on a new high-water (§1.6.1 / §2.16 / §4.2.1) |
| accrual | **Phase-2-gated** (FU7) — deeds + the 70/30 seasonal split bank **only** after the **R15 capstone** opens Phase 2 (T1-M4-F1) |

**Deed vocabulary (what counts as an Arms deed):** a road **declared safe**; a **nest cleared**; the **grain store defended**; a **rival's enforcer broken**. **DEFEND is the canonical Arms earner.** Plus the season's security is *judged* on a new high-water.

**Arms kept distinct from the two other combat tracks (the likeliest regression):**

| signal | feeds |
|---|---|
| one **kill** | character level |
| one **curated rung activity** (drill-yard) | the **Combat-Rank** rung sub-meter |
| one **recognised DEED** | **Arms 武威** influence |

### Deed bands & per-deed cap (proposed v1 balance — D-059; re-confirm vs D-049)

Both Estate and Arms accrue in T1's Phase 2 (post-R15). Per-deed cap = **0.04 · good-band** (anti-grind clamp).

| pillar | good | great | excellent | per-deed cap |
|---|---|---|---|---|
| **Arms 武威** | 0.5K | 0.72K | 0.95K | 0.04·0.5K = **20 ip** |
| **Estate 家産** | 0.8K | 1.1K | 1.5K | 0.04·0.8K = **32 ip** |

*Cross-tier scaling: both good-bands step ~10× into T2 (Arms 0.5K→5K, Estate 0.8K→8K); see t2-content.md §2.*

### Ascension gate (T1→T2) — two-pillar hybrid

| field | value |
|---|---|
| gate | **exactly 1 GREAT + 1 EXCELLENT** across **Estate + Arms**, both pillars ≥ GOOD, **no overflow** (D-049) |
| overshoot | grinding past the line banks a better **grade-scaled permanent boon** (D-049) |
| trigger | **manual opt-in** ascension story event — *not* auto-advance (D-049 / D-062) |
| reveals | un-greys the **NEXT (3rd, still-unnamed) silhouette** — T2 names it **Office 官威** (D-055); the rite reveals the *next* pillar, **not** Arms (Arms is already live) |
| beat | fires a **dream / mystery** beat (D-055; Origin stays dark — opens at T3, D-009); the "first errands past the gate / valley in view" is the **T2 teaser shown here**, not playable T1 content |
| state | `tier` 1→2 stored (D-013a; enum 0..5 per D-048); `migrate()` chain extends with a covering test |

---

## 3. Weapons — the Sword line (Combat Line 2, NEW this tier)

Found or **crafted** via a loot→craft loop (never gifted — honours "weapons never gifted as power", D-052), opened on a **Combat-Rank rung-gate** (R13 Armsman of the House). Three swords, each a distinct feel; signatures **deepen at weapon-L25/L50** (§4.6.9). `atk` / `durability` are **(to-author)**; `speed` + signature are from the proposal.

| id (proposed) | label | kanji | atk | speed | durability | archetype | signature ability |
|---|---|---|---|---|---|---|---|
| `kodachi` | Kodachi | 小太刀 | (to-author) | 1.25 | (to-author) | quick · light | **Riposte** (counter on defend) |
| `uchigatana` | Uchigatana | 打刀 | (to-author) | 1.10 | (to-author) | balanced | **Iai-draw crit** (opening-strike crit) |
| `ōdachi` | Ōdachi | 大太刀 | (to-author) | 0.90 | (to-author) | heavy · sweeping | **Cleave 2** (hits 2 foes) |

**Tuning bars:** **NO-STANCE-DOMINATED** across the new swords (D-050); **DISPLAYED==TESTED** fixed-seed win-rate; **G-CURVE** extends; the **first-fight 20–35%** T0 anchor governs T1 combat tuning.

**Weapon lines that exist by end of T1:** **Line 1 — Spear** (Yari / Kama-yari / Nagae-yari, per §4.6.9; the T0 build ships the improvised carrying-pole + woodlot-axe as starting gear ahead of the spear roster) **+ Line 2 — Sword** (this tier). **Line 3 — Staff / polearm** (Bō / Naginata / Kanabō / Tetsubō) is **T2** (pulled forward from T3 by the 2026-06-29 human steer; roster complete by end-of-T2, so T3 is combat *depth*, not a new line).

---

## 4. Economy / sub-engines — the koku flywheel branches

T0 = a single **LINEAR** estate-upgrade line. **T1 branches it into three capped sub-engines** (D-066, refining D-051/D-033). `G-NO-DEAD-VALUES` now guards a *compounding* consumer per lane.

| lane | kanji / term | T1 content | cap / guardrail |
|---|---|---|---|
| **LAND** | 新田 *shinden* | drain & reclaim the first *shinden* marsh → new paddy; yield-bearing estate stages compound (D-051) | capped; every upgrade yields (G-NO-DEAD-VALUES) |
| **TREASURY** | 御用金 *goyōkin* | chip the **Inherited Debt** (owed to pawnbroker **Tōkichi**) toward **solvency**; *goyōkin* leverage opens; debt-paydown is a real koku consumer | every koku has a sink (G-NO-DEAD-VALUES) |
| **TRADE** | (thin) | the **THINNEST T1 lane** — estate-internal surplus + a deepened T0 tiny-market taste; **no broker standing yet** | **hard-capped ≤⅓** of Estate & Wealth (D-008) |

**TRADE timing (resolves digest ambiguity #2):** T1 = estate-internal surplus + the deepened tiny-market taste only. The **silk/sericulture *meibutsu*** (weaver **Onatsu**), broker standing meters, and the real village market all **WAIT for T2**, where TRADE matures and the ≤⅓ clamp is genuinely exercised.

### Estate improvements (koku sink — now yield-bearing, D-051)

From the T0 registry; in T1 the stages become real depth. **E1→E2 land in T1** (the estate visibly grows once; resolves digest ambiguity #1). **E2→E3+ provisionally slips to T2+** — flagged for the human (proposal open-fork #2).

| stage | label | koku (demo) | effect | tier |
|---|---|---|---|---|
| E1 | Patch the kura | 100 | +20 satietyMax + yield (D-051) | **T1** |
| E2 | Clear the drill yard | 300 | +20 satietyMax + yield | **T1** |
| E3 | Reclaim the first shinden | 700 | +30 satietyMax + LAND yield | **T2+ (flagged)** |

### Other economy systems

- **Component / quality crafting** (§2.11): simple crafts grow into **gather → component → finished good** chains; a better tool is something you *build up to*, discovered by doing.
- **First paid retinue** (T1-M3-F3): **Gohei & Yatarō** hired in T1 following E2 (resolves ambiguity #1). Their **wage = a recurring koku sink** (G-NO-DEAD-VALUES); they contribute labour/combat **without trivialising the humbling tune** (D-061).
- **HP-carry / stance as a real decision** (D-050): HP carries between fights and only heals by **eating** — defensive vs aggressive stances genuinely trade, **no stance dominated**; couples combat ↔ the food/cook sink (a hungry fighter is a weak one).
- **Estate physical growth** (§4.7.5): mended roofs, cleared yard, new paddy — **flavour you can see**, *not* a management sim.

---

## 5. Cast / NPCs (household, estate-scale)

Canonical force-fictionalised display names carry forward from the T0 registry (house **Kurosawa**, lord **Shigemasa**, heir **Naoyuki**, **Genemon**, **Kihei**, **Chiyo**, **Sōan**). T1 adds the deeper household.

| name | role | function in T1 |
|---|---|---|
| Lord **Kurosawa Shigemasa** | head of house | recognises the R15 capstone |
| Heir **Naoyuki** | in-house rival | rivalry **carried from T0** (→respect bridge at T2, ally-flip at T3-G5) |
| Lady **Chiyo** | lady of the house | household / domestic anchor |
| Dowager **Toku** | grandmother | grief over **Sadamune's** failed flood-venture (TREASURY backstory) |
| Chief Steward **Genemon** | **rank-gatekeeper** | grants the Estate-Service rungs; labour/koku mentor (diegetic, D-063) |
| Clerk **Tanomo** | koku / debt | the TREASURY / ledger NPC (debt → solvency) |
| Drillmaster **Kihei** | **the mentor** (D-063) | grants Combat-Rank rungs; teaches the Sword line, drill-yard & stance as *story* |
| Physician **Sōan** | healer | healing/eat-to-heal mentor (diegetic) |
| Groom **Sota** | stables hand | stable & woodlot flavour |
| Field-lad **Heita** | field hand | home-paddy / shinden flavour |
| Head maid **Oai** | household | main-house flavour |
| Cook **Kyūsuke** | kitchen | the food/cook sink that couples to combat |
| Green recruit **Tokujirō** | **growth-mirror** | shows how far the protagonist has come |
| Men-at-arms **Gohei** & **Yatarō** | **first paid retinue** | hired in T1 (following E2); fight/work alongside you |
| Pawnbroker **Tōkichi** | debt-holder (off-estate) | the face of the Inherited Debt (a circumstance, not a conspirator) |
| **Sadamune** | grandfather (deceased) | backstory only — the failed flood-venture behind the debt |

**Antagonist (T1):** **The Inherited Debt** — a **circumstance, not a conspirator** (held by pawnbroker **Tōkichi**). The "rigged box" racket has **no fingerprints at the estate** — that motif first surfaces at T2 (Magobei). **Side-threads:** the **dream** keeps cadence (foreshadowing only — Origin opens at T3); the porter's-knot zero-bonus beat carries; **no one speaks "Tama" yet** (the allegiance goes live in T2).

---

## 6. Locations / map

A small **WALKABLE map** (D-065), grown in T1 (the **NQ-3 default** — grow the T0 map; pinned node-count ceiling). Reveal-per-beat navigation.

| area | kanji / term | role | note |
|---|---|---|---|
| Kura Storehouse | 蔵 *kura* | TREASURY / LAND surplus, E1 | R8 home |
| Gate & Forecourt | 玄関 *genkan* | arrivals; haul_stores | from T0 |
| Home Paddies & Dry Fields | 田畑 | koku heartbeat + **shinden** reclamation | LAND lane |
| Stables & Woodlot Edge | 厩・木戸 | groom Sota; woodcut / components | R11 home |
| **Drill Yard** | 稽古場 | Kihei's training; Combat-Rank | E2; T1-M2 |
| Main House / *Omoya* | 母屋 | kitchen, shrine, study/**ledgers** | Tanomo / TREASURY |
| **Near Satoyama** | 里山 | conditioning-gated danger ring | **map grows here in T1-M3-F4** (boar, monkey troop, mamushi, wolves) |

The valley does **not** open at T1 — Asagiri / Shop Row / the Weir are **T2** (shown only as the ascension teaser).

---

## 7. Bestiary / enemies (grounded — no belief-creatures, D-011)

Estate + near-satoyama beasts only. The **first HUMAN threat (bandits / starving deserters, *nobushi*) waits for T2** (resolves digest ambiguity #4) — T1 combat is entirely grounded beasts. Levels carry from the T0 registry where shared; T1-new levels/koku are **(to-author)**. Tuning anchors: first-fight **20–35%** win-rate, G-CURVE, DISPLAYED==TESTED, NO-STANCE-DOMINATED.

| id | label | kanji / term | level | koku | note |
|---|---|---|---|---|---|
| `boar` | Wild boar | 猪 *inoshishi* | 3 | 8 | from T0 registry; near-satoyama |
| `monkey` | Crop-raiding monkey | 猿 *saru* | 1 | 3 | from T0; **troop variant** new in T1 (to-author) |
| `wolf` | Lean wolf | 狼 | 2 | 5 | from T0; **wolf-pack** grindable (the R3 humbling deepens) |
| `rice_rat` | Rice-rat | 鼠 | (to-author) | (to-author) | **NEW** — kura/granary PEST |
| `mamushi` | Pit-viper | 蝮 *mamushi* | (to-author) | (to-author) | **NEW** — near-satoyama HUNT |

*(The T0 registry also defines `bandit` lv5 as a planned foe; per the proposal the first human threat is held for T2 — T1 spawn tables stay grounded beasts.)*

---

## 8. Quests

No fixed quest-type budget (D-032); an **order-free advance-event set** surfaced under a **top-level Quests tab** (D-037). Quest TYPES carry from T0; T1 quests are largely **(to-author)**, grounded in the Arms deed vocabulary. **No yokai-debunk at T1** — the inn rumours board + belief→cause quests are a **T2** system.

| type | role | Arms relevance |
|---|---|---|
| **PEST** | clear vermin/raiders (rice-rats, monkey troop) | a **nest cleared** → Arms deed |
| **HUNT** | take a named beast (boar, mamushi, wolf) | character level + curated activity |
| **CLEAR** | make a route/area safe | a **road declared safe** → Arms deed |
| **DEFEND** | hold a position under threat | **canonical Arms earner** (grain store defended; rival's enforcer broken) |

**Named T1 quests (proposed / to-author), mapped to the deed vocabulary:**

| quest (proposed) | type | deed it earns (Phase 2) |
|---|---|---|
| Clear the kura of rice-rats | PEST | nest cleared |
| Drive off the monkey troop | PEST/HUNT | nest cleared |
| Make the satoyama path safe | CLEAR | road declared safe |
| Defend the grain store | DEFEND | grain store defended |
| Break the rival's enforcer | DEFEND/HUNT | rival's enforcer broken |

---

## 9. Balance & acceptance criteria binding at T1

| criterion | T1 binding |
|---|---|
| **≥30-min/rung floor** | **BINDS for the first time** (T0 floor-exempt; D-049, D-056). T1 per-rung floor ≈ **≥40 min**; thresholds back-solved on rung-meter points (§4.1.1). The **floor regression test goes live at T1-M1** (M6 fails on undershoot only). |
| **Phase-1 hour budget** | provisional **~5–8h** (≈8 rungs × ≥40 min/rung); re-derives at the Ship-M1 6-tier **~28.5h** rescale (§4.8). |
| **70/30** | deeds / seasonal split (Phase-2-gated). |
| **per-deed cap** | **0.04 · good** — Arms **20 ip**, Estate **32 ip**. |
| **trade ≤⅓** | TRADE lane hard-capped at ⅓ of Estate & Wealth from when it branches (D-008). |
| **NO-STANCE-DOMINATED** | across the new Sword line + HP-carry/stance (D-050). |
| **first-fight 20–35%** | the signed T0 anchor governs T1 combat tuning. |
| **DISPLAYED==TESTED** | fixed-seed win-rate on combat + stance forecasts. |
| **G-CURVE** | the graded win-rate curve extends to the T1 ladder + the two-pillar gate. |
| **G-NO-DEAD-VALUES** | every new sub-engine currency / sink / component has a downstream consumer (now guards a compounding consumer). |
| **ascension gate** | **1 GREAT + 1 EXCELLENT** across Estate + Arms, both ≥ GOOD, no overflow (D-049). |
| **pillar DEEDS Phase-2-gated** | accrue only post-**R15** capstone (FU7). |
| **difficulty** | **humbling THROUGHOUT** within guardrails — winnable · soft-setback-only · no permanent loss · no stranding (D-061). |

---

## Open items flagged for the human (defaults applied; none block the build)

1. **Per-tier hour floor** — T1 ~5–8h provisional; the §4.8 ~28.5h budget re-derives across all 4 v1 tiers at Ship-M1-F2. *(proposal open-fork #1)*
2. **E-stage → tier mapping + retinue** — default: **E1→E2 in T1**, E2→E3+ slips to T2+, first paid retinue (Gohei & Yatarō) belongs to T1. *(proposal open-fork #2; digest ambiguity #1)*
3. **R8→R15 rung titles + two-track sub-meter split** — proposed shape accepted; titles/kanji easily restyled. *(proposal open-fork #3; digest ambiguity #3)*
4. **Deed-band magnitudes** — Arms 0.5K/0.72K/0.95K (cap 20 ip) + Estate 0.8K/1.1K/1.5K (cap 32 ip); provisional (PRD §4 liquid, D-059), re-confirm vs D-049. *(proposal open-fork #5)*
5. **T1 TRADE vs silk timing** — T1 = estate-internal surplus + deepened tiny-market; silk *meibutsu* + broker standing wait for T2. *(digest ambiguity #2)*
6. **T1 bestiary breadth** — grounded beasts only; first human threat (nobushi/bandits) held for T2. *(digest ambiguity #4)*
