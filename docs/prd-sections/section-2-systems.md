# §2 — Systems & Mechanics Catalog

> **DRAFT — awaiting human review.** Nothing here is locked until it is reviewed with the human and
> recorded as an ADR in [`../history/decisions.md`](../history/decisions.md). This section is authored
> directly from the **LOCKED CANON**
> ([`../../brainstorms/2026-06-25-locked-decisions.md`](../../brainstorms/2026-06-25-locked-decisions.md),
> both 2026-06-25 header blocks) and the **LOCKED §1** of this PRD
> ([`../prd.md`](../prd.md)), with concrete detail drawn from the three redesign brainstorms
> (estate-and-combat, world-expansion-factions, mechanics-and-architecture-design). Where any
> brainstorm conflicts with canon, **canon wins** (e.g. the brainstorms' 15-rung ladder / six estate
> stages / 18 expansion nodes / labour→combat cross-feed / permanent holding-loss are all superseded
> by canon's lean ~8-rung-per-tier, E0–E2 v1, ~6–8-node cut-set, ZERO cross-feed, never-a-wipe).

## How to read this section

§1 says **what the saga is**; §2 catalogs **every system that makes it run**, as a designer's parts
list. For each system we give: **(a) what it is**, **(b) its player-facing behaviour / loop**, **(c)
its rough DATA shape** (field names and relationships — *no exact numbers; balance values live in §4*),
**(d) how it ties to the four House Influence pillars** (Arms 武威 · Estate & Wealth 家産 · Standing &
Office · Name & Honour 家格), and **(e) when it is introduced** (which tier, and how it reveals
fractal-incrementally). Romanization is **macrons / proper Hepburn** throughout (Tōkichi, Yagōemon,
Jūbei, *kyō-masu*, *yōnin*). Everything is **pure-core, data-driven, deterministic under one seeded
RNG**, and **active-only (no offline progress)**, per §1.

**Canon constraints this whole catalog obeys** (re-affirmed so no system drifts): grounded / no magic
(every omen → human/natural cause); mediocre start (memory = *access*, not power; **no** hidden edge;
**no** labour→combat cross-feed); the core loop is **the MC's OWN actions** (combat / skills / jobs /
crafting) — **no people-management sim** (build/recruit = flavour); **four pillars** with
**achievement-jump + seasonal-judged-result** accrual (**up-only + rare recoverable per-pillar dents,
never a wipe, never a passive trickle, never a flat per-action increment**); combat is **first-class &
introduced EARLY (T0)** and **earns Arms standing**; tiers **T0–T4** with per-tier story gates and a
**fresh rank ladder per tier**; **full maps every tier**; **fractal incrementality** (everything
unlocks, never overload); **auto-producers are late-game only**; **trade ≤ ⅓ of Estate & Wealth**;
*meibutsu* = **silk / sericulture**; **soft stamina** (slows, never hard-blocks); residual ambiguity
**≤ 1**; martial scale **hard-capped** (small retinue, never an army).

### System inventory (the parts list)

| # | System | First introduced | Pillar(s) it feeds |
|---|--------|------------------|--------------------|
| 2.1 | UI-reveal engine + event log | T0 (M0; exists from build one) | — (the meta-spine that surfaces every other system) |
| 2.2 | Time, season & world clock (active-only) | T0 | feeds seasonal **judged results** for all four |
| 2.3 | Soft stamina / satiety | T0 | — (paces the day; no pillar) |
| 2.4 | Resources & currencies (koku, coin, pillars, materials) | T0 (koku); coin T1 | Estate & Wealth; pillars are the macro layer |
| 2.5 | Auto-producers (late-game only) | T3+ | Estate & Wealth (idle convenience, never early) |
| 2.6 | Gathering / labour nodes & jobs-as-offices | T0 | **Estate & Wealth**, **Standing & Office** |
| 2.7 | Attributes, per-skill levels & milestones | T0 (attributes/skills); web grows per tier | Arms (combat skills), Estate & Wealth (labour skills) |
| 2.8 | Combat (idle auto-resolve + active setup) | **T0 (R3)** | **Arms** |
| 2.9 | Bestiary & mobs (grounded) | T0 (R3) | Arms |
| 2.10 | Loot, equipment (FIND + CRAFT), gear & inventory | T0 (R3) | Arms; crafting overlaps Estate & Wealth |
| 2.11 | Crafting (hybrid: simple → component/quality) | T0 (simple); component system T1+ | Estate & Wealth (trade sub-engine); Arms (gear) |
| 2.12 | Dialogue & quests (open-ended) | T0 (dialogue); quest log ~R5 | all (the universal unlock/reward bus) |
| 2.13 | Lore, inn rumours & the belief→cause engine | T1 | Name & Honour (flavour); never gates the spine |
| 2.14 | World sim (seasons / weather / festivals) | T0 clock; seasons/festivals T1 | seasonal judged results for all four |
| 2.15 | Factions & reputation (estate ladder, village web, origin ties, allegiance) | T0 (estate); T1 (village); T2 (origin) | all four (via multipliers / standing) |
| 2.16 | House Influence — the four pillars (accrual + per-tier gating) | tracked visible at T0-R7 | the macro roll-up of all four |
| 2.17 | Estate growth (build / recruit = flavour) | T0 (E0→E2 in v1) | Estate & Wealth; Arms (defensive works) |
| 2.18 | The national *banzuke* / per-tier ranking | per-tier domain rank; national at T4 | reads all four pillars |
| 2.19 | Save / load (IndexedDB + export/import) | T0 (M2 minimal) | — (infrastructure) |
| 2.20 | The DEV play API + content verifier | T0 (M1 skeleton) | — (infrastructure/QA) |
| 2.21 | Accessibility, audio & presentation register | T0 | — (infrastructure) |

The rest of §2 details each. **Systems 2.1, 2.16, and the pillar accrual rules in 2.15 are the most
load-bearing** and are flagged for the human at the end (§2.22).

---

## 2.1 The UI-reveal engine + event log

**(a) What it is.** The signature first-class system and the spine of the entire game's presentation:
**every panel, tab, resource row, button, skill, area, and screen is DATA with an unlock predicate
over `GameState`.** The renderer shows only what is currently unlocked. "The UI is incremental" is a
tunable content table, not hardcoded view logic. Paired with it is the **persistent event log** — a
scrolling, colour-coded, capped message feed present from second one, which doubles as the narration
channel *and* the unlock announcer. Every reveal fires through a **universal rewards/unlock bus**
(`process_rewards`) as **one event** that simultaneously: pushes a diegetic log line, reveals the
next panel/tab/resource/area, grants the perk, and advances a story flag — so feature unlocks read as
**plot, never silent menu growth.**

**(b) Player-facing behaviour / loop.** Minute one is one verb ("Rake the spilled rice") + the log +
a counter. As the player acts, things *appear*, each announced in-fiction ("footsteps — a door
slides…"). The **UI shell is multi-screen navigation that appears single-screen early**: more
screens/nav unlock as the player progresses (responsive desktop + mobile, **not** hover-dependent).
Reveals follow the **per-tier rank ladders** (a fresh ladder per tier — §1.5.1, §2.15), never one
continuous staircase. The loop the player feels: *act → something new fades in with a log line →
explore it → act more.*

**(c) Rough DATA shape.**
- `RevealableEntry { id, kind ('panel'|'tab'|'resourceRow'|'button'|'screen'|'area'|'navLink'),
  unlockPredicate (expression over GameState: flags, resources, rank, skill levels, story node,
  season, pillar values), revealLogLineId, oncePerGame }`
- `RewardBundle { items?, xp?, coin?, koku?, materials?, locationsRevealed?, panelsRevealed?,
  dialoguesUnlocked?, recipesUnlocked?, questsStarted?, flagsSet?, pillarDeltas? }` — the universal
  object every dialogue/quest/threshold/combat-deed can emit.
- `LogMessage { id, text, channel ('narration'|'reward'|'combat'|'system'), colorClass, tICK }`,
  stored in a capped ring buffer.
- Unlock predicates are **pure functions**; the renderer subscribes to state snapshots and does one
  `render(state)` reconciliation (no scattered push-updates → kills stale UI).

**(d) Ties to the four pillars.** Indirect but total: the **House Influence panel (2.16) and many
late reveals are gated on pillar thresholds**, so "numbers go up" and "the world enlarges" are one
motion. The reveal engine is the surface on which all four pillars become *visible* (the four-bar
standing panel reveals at T0-R7).

**(e) When introduced / fractal reveal.** **T0, build one (M0).** It exists before any content and
governs everything thereafter. It is itself fractal: a drill yard reveals one post → a rack →
sparring slots; a new region reveals one road → one threat → one contact.

---

## 2.2 Time, season & world clock (active-only)

**(a) What it is.** An **abstract in-game clock advanced by active play** (a single tick driver with
per-tick / per-day / per-week scheduler). Drives day/season (kanji tags), weather, lunar phase,
festivals, vendor restocks, food rotting/fermenting, and — critically — the **seasonal *judged*
Influence results** (§2.16). **ACTIVE-ONLY: no offline progress; story never advances while away.**

**(b) Player-facing behaviour / loop.** Time passes as the player works; a day/season indicator (e.g.
春 spring) is always visible once revealed. Seasons gate which gathering nodes are productive (rice
cycle, foraging windows) and trigger festivals and the seasonal appraisal beats. There is **no
real-time idle accrual and no offline summary** — the clock only turns when the player plays.

**(c) Rough DATA shape.**
- `WorldClock { tick, day, season ('spring'|'summer'|'autumn'|'winter'), year, lunarPhase, weather }`
- `Scheduler { perTickPlans[], perDayPlans[], perWeekPlans[] }` — registry rows that fire effects on
  cadence (restock, rot, festival start, harvest appraisal).
- `SeasonalAppraisalState { lastJudgedHighWaterMark per pillar, pendingAppraisalDue }` — feeds 2.16's
  judged-result accrual (fires on a **new high-water mark**, never repeatable maintenance).

**(d) Ties to the four pillars.** The clock is the **timing source for accrual shape (B)** — periodic
**judged results** (a season's harvest, an autumn audit, a security appraisal) for **all four
pillars**. It never grants Influence by itself (no time-trickle).

**(e) When introduced / fractal reveal.** **T0** — the clock display reveals early (around R1, with
the *koku* heartbeat); seasons/weather/festivals deepen at **T1** (the world-sim layer, §2.14).

---

## 2.3 Soft stamina / satiety

**(a) What it is.** A **soft** energy/satiety meter that **slows** action when low — it **never
hard-blocks** play. Rest and eat to refill; it paces the day and gives food/cooking a purpose.

**(b) Player-facing behaviour / loop.** As the MC labours or fights, satiety/energy drains; depleted,
actions get slower / less efficient (a gentle nudge to rest, eat, or change activity), never a wall or
a punishing timer. Refill by resting (advances the clock) and eating cooked food (ties to the cooking
skill and provisioning economy). The convalescence framing of the cold open uses this meter (rest and
recover "a little" in the first hours — he is **not** a bedridden invalid).

**(c) Rough DATA shape.**
- `Vitals { hp, hpMax, satiety, satietyMax, fatigue }` (derived caps recomputed on load from
  attributes + gear + milestones).
- Action costs reference a `staminaCost` field; a soft-throttle function maps low satiety → a
  *rate multiplier* on labour/combat speed (never to zero).
- `FoodItem { restoreSatiety, buffs?, perishable, spoilTicks }`.

**(d) Ties to the four pillars.** None directly. It is a pacing system. (Cooking/provisioning that
feeds it sits under Estate & Wealth's labour, §2.6.)

**(e) When introduced / fractal reveal.** **T0** — the body/rest bar reveals at **R0** (in the *kura*,
alongside the rice counter). The satiety soft-gate surfaces as the player leaves the storehouse and
labour begins (R1–R2).

---

## 2.4 Resources & currencies (koku, coin, pillars, materials)

**(a) What it is.** The economic substrate. **Canon currencies:** **koku (rice)** = the base
exponential currency and historically real unit of wealth/tax (the *koku* heartbeat); **coin (mon)** =
the secondary trade currency; **the four House Influence pillars** = the macro standing layer (NOT
spendable like koku/coin — they are the cumulative score of what the house has *become*; see 2.16).
**Other resources** (wood, charcoal, fish, *sansai*/wild greens, herbs, hides, fibre/silk cocoons,
ore/iron, etc.) feed crafting and trade. Each new resource **lights its own panel/row** on first
acquisition (via 2.1).

**(b) Player-facing behaviour / loop.** Grind koku by farming; convert surplus to coin via trade
(brokers/shops); spend koku/coin/materials on crafting, gear, building, and tier-expansion. **Koku and
coin are inputs you spend and grind; Influence is what you become.** A **market-saturation damper**
(2.11/2.15) depresses sell prices when one good is flooded, recovering over in-game days — keeps
grinding interesting and stops trade running away (reinforced by the trade ≤ ⅓ cap).

**(c) Rough DATA shape.**
- `ResourceDef { id, name, kind ('currency'|'material'|'food'|'fibre'|'ore'…), revealPredicate,
  stackable, perishable?, spoilTicks? }`
- `GameState.resources: Record<resourceId, amount>` (counts only; derived rates computed, never
  stored).
- `MarketState { perGoodPriceIndex, saturationByGood, recoveryRate }` (numbers → §4).
- Pillar values live in `Influence` (2.16), kept structurally separate from `resources` so trade can
  never masquerade as standing.

**(d) Ties to the four pillars.** koku/coin/materials are the **inputs** the house spends to earn
recognition; **recorded yields and sealed contracts convert to Estate & Wealth** (via achievement
jumps / seasonal judged results). The **trade strand (routes / broker standing / the silk *meibutsu*)
is hard-capped to ≤ ⅓ of Estate & Wealth**, so a pure-trade run maxes ~⅓ of one of four pillars.

**(e) When introduced / fractal reveal.** **T0** — koku at **R0/R1** (rice counter → paddies). **Coin
(mon)** reveals at **T1** when the village market/shop row opens. Material resources reveal one at a
time as their nodes/crafts come online (foraging → *sansai*; woodcutting → wood → charcoal; fishing →
fish; sericulture → cocoons/silk at the silk sub-engine).

---

## 2.5 Auto-producers (LATE-GAME only)

**(a) What it is.** Idle helpers that produce a resource over time **without** the MC's active action.
**Canon: limited / late-game ONLY** — early game is the MC's own active grind. There is **no
assignment/management panel and no labour-gang to manage, ever** (that would be the rejected
people-management sim). Auto-producers are a late convenience surfaced as **seconded/recruited helpers**
(village allies, recruited origin friends) wired to existing idle-producer slots.

**(b) Player-facing behaviour / loop.** From late game, a recruited helper quietly trickles a resource
(e.g. a seconded hand tending a reclaimed paddy) so attention is freed for the active grind elsewhere.
Framed diegetically as a person joining the house's works — **flavour roster cards, not a managed
sub-economy.** Consistent with active-only: helpers produce **only while the game is being played**;
there is **no offline accrual.**

**(c) Rough DATA shape.**
- `AutoProducerDef { id, resourceProduced, baseRate, costToBuild (koku/coin/materials),
  rankFloor (LOW), pillarFloor, revealPredicate, rosterCardId }` — gated on Influence band + a LOW
  rank floor + cost (not the capstone), per the estate-growth rule.
- Cost curve scaffold mirrors the genre (`cost = base * r^owned`, ~5× jumps between tiers) — **values
  deferred to §4.**
- Bound to a `RosterMember` for the diegetic framing (the helper is a face, not a slider).

**(d) Ties to the four pillars.** **Estate & Wealth** (their output converts to recorded yield).
Defensive auto-producers (a standing watch) can feed **Arms** via security appraisals. They are an
*efficiency* layer, never a standing source in themselves.

**(e) When introduced / fractal reveal.** **T3+ (parked beyond v1's early surface).** v1's E0–E2 estate
stays an **active grind**; the first auto-producers belong to later tiers. Each arrives minimal (one
helper, one resource) and is announced as a recruitment beat.

---

## 2.6 Gathering / labour nodes & jobs-as-offices

**(a) What it is.** The peaceful-labour core — the **dominant daily texture** (labour-plurality). Two
faces: **gathering/labour nodes** (the MC's own active work) and **jobs-as-offices** (administrative
duties framed as *the MC's own quests/offices*, **not** a management layer). **Lean starter set
(canon):** farming, foraging, woodcutting, fishing, smithing, cooking; **more unlock as you climb
tiers/regions.** Nodes are **tiered and season-gated**; clickable now, idle later (active grind first;
an auto-gather toggle is a *late* automation reward, §2.5).

**(b) Player-facing behaviour / loop.** Do the work manually (rake rice, fell timber, forage the
near-*satoyama*, fish the ford); each action yields a **resource + skill XP + sometimes a quest event**.
Higher ranks/offices add **jobs-as-offices** — e.g. the bailiff of the home fields takes on field
administration as **his own duties/quests**, never a city-builder panel. The texture stays **grind
("the hero gets better at what he does")**, not micromanagement.

**(c) Rough DATA shape.**
- `LabourNode { id, skill, resourceYields[], seasonWindow, dangerRing?, staminaCost,
  revealPredicate, autoGatherUnlock? (LATE) }`
- `Job/OfficeDef { id, kind ('labour'|'admin-as-quest'), grantsResponsibilities[], questsOpened[],
  rankFloor, pillarContribution }` — admin offices emit **Standing & Office** recognition, not a sim.
- Yields reference `ResourceDef` (2.4) and grant `SkillXP` (2.7).

**(d) Ties to the four pillars.** **Estate & Wealth** primarily (LAND via *shinden* reclamation;
TREASURY via debt→solvency; TRADE via routes/broker/silk — the trade strand ≤ ⅓ capped). **Jobs-as-
offices** feed **Standing & Office** (offices granted, the bailiff duty, a dispute arbitrated). Recorded
yields and seasonal harvest appraisals are the canonical **achievement-jump / judged-result** sources.

**(e) When introduced / fractal reveal.** **T0.** Farming at **R1** (paddies, the *koku* heartbeat);
foraging + woodcutting + hauling at **R2** (Skills tab + near-*satoyama*); smithing/crafting chains and
fishing fold in across R5–R6 and the wilderness rings. **T1** adds village-facing labour (cash-crops,
the silk/sericulture sub-engine at V3); **T2** adds region-scale labour (post-town trade, Kuzuhara
river-works as a labour project). Jobs-as-offices begin at **T0-R7** (bailiff) and grow per tier.

---

## 2.7 Attributes, per-skill levels & milestones

**(a) What it is.** The **rich attribute system** + **per-skill levels** + a **milestone web**. Canon:
deep, interacting attributes (STR / AGI / INT / SPD / a luck-style stat) **+ per-skill `total_xp`
pools** (skills surface *by doing*, hidden until a small visibility threshold) **+ milestone perks**
(flat stats, multipliers, titles, cross-skill XP bonuses). **Lean core skills at T0; more unlock per
tier.** Character level + XP grants HP, satiety capacity, attribute points, and a compounding skill-XP
multiplier.

**(b) Player-facing behaviour / loop.** Doing labour/combat raises hidden skills until they **surface**
(a discover-by-doing reveal via 2.1), then keep levelling on a steep curve with **per-event XP caps**
(combat and crafting per-event caps force *breadth and grind*, never a quick spike). Milestones at
thresholds grant perks — an emergent build web and long-tail goals. Attributes layer base / additive /
multiplier and **recompute on load** (saved as `total_xp`, not derived stats).

**(c) Rough DATA shape.**
- `Attribute { id (STR|AGI|INT|SPD|luck), base, fromGear, fromMilestones }` (recomputed).
- `SkillDef { id, category ('Farming/Labour'|'Gathering'|'Crafting'|'Combat'|'Weapon'|
  'Environmental'), visibilityThreshold, xpCurveParams, perEventCap, milestones[] }`
- `Milestone { atLevel, perks: RewardBundle-like (flatStat | multiplier | title | crossSkillXp) }`
- `GameState.skills: Record<skillId, total_xp>`; character `Level + xp`.
- **No-hidden-edge guard encoded:** combat skills have **no input edge from labour skills** (no
  cross-feed field exists); milestones never read returning-memory/porter's-knot flags.

**(d) Ties to the four pillars.** Indirect: **combat skills → Arms** (better deeds), **labour/craft
skills → Estate & Wealth** (better yields/quality). Skills do **not** grant Influence directly; they
make the *deeds* that the authorities recognize more achievable. Milestone titles can feed **Name &
Honour** flavour (a recorded merit), but the pillar value comes from the recognized deed, not the level.

**(e) When introduced / fractal reveal.** **T0** — attributes exist from the open; the **Skills tab**
reveals at **R2** on first XP. Combat/weapon skills surface at **R3** (drill yard). Lean core lines at
T0 (farming, foraging, woodcutting, fishing, smithing, cooking; conditioning; 2–3 weapon lines); **more
skills unlock per tier** (e.g. sericulture/textile at T1, surveying/engineering and trade skills at T2).

---

## 2.8 Combat (idle auto-resolve + active setup)

**(a) What it is.** A **first-class core pillar from T0** (not a mid-ladder reveal). Style (canon):
**idle auto-resolve + active setup** — prepare gear/stance/area, a **deterministic seeded fight**
resolves, and the player intervenes with stance / ability / item / retreat. Low-APM, strategic, **NOT
twitch.** It carries a **character Combat Level** (a Combat Deeds pool: combat-XP + a deed-count of
kills / clears / defends), **weapon/martial skills** (2.7), the **bestiary** (2.9), **loot + equipment
FIND and CRAFT** (2.10), and **gear progression**. Combat **EARNS House Influence via the Arms pillar.**
**Mediocre-start preserved:** start near-zero; the **humbling, near-fatal first fight** is an early beat
(survived by luck / Jūbei's arrival, never skill); capacity is **earned through Jūbei's drills**, gated
behind labour-built **conditioning** (a one-way enablement gate that grants **ZERO combat stat or
training-rate bonus**). **Failure = soft setback** (lose HP/time, maybe drop carried loot or take an
injury to rest off) — **never** lose levels/gear/permanent progress.

**(b) Player-facing behaviour / loop.** Choose an area/danger ring, equip gear, pick a **stance** (data
shifting attack/speed/evasion/target-count), optionally bring consumables, then let the fight
auto-resolve on a fixed-step seeded sim; intervene mid-fight (swap stance, use ability/item, retreat).
On kill: XP + skill XP + seeded loot roll + bestiary update + quest events. Cleared areas can re-spawn
idly once an **auto-continue** toggle is earned (a later QoL reward). HP/satiety managed via rest/eat
between fights. **Texture stays peaceful-labour-dominant by volume**; combat is live and load-bearing.

**(c) Rough DATA shape.**
- `Combatant { hp, attackPower, attackSpeed, evasion, defense, critChance, blockChance, statuses[] }`
  (the MC's derived from attributes + weapon/martial skills + gear).
- `CombatSim` advances an internal sub-tick accumulator per `attackSpeed`; per swing: hit (attacker
  dex-like vs target evasion) → damage (`attackPower ± seeded variance` minus defense, with a floor) →
  separate seeded crit/block rolls → status effects applied per tick. All draws from the **one seeded
  RNG** (reproducible, unit-testable).
- `Stance { attackMod, speedMod, evasionMod, targetCount }`; `CombatInterventionIntent`
  (stance/ability/item/retreat).
- `CombatDeedsPool { combatXp, deedCounts (kills|clears|defends), perEventCap }` → the Combat Level
  and a gated **Arms** contribution.
- `InjuryState { kind, restTicksToHeal }` (the soft-setback model — temporary, recoverable).

**(d) Ties to the four pillars.** **Arms (武威)** — recognized martial deeds (a road declared safe, a
nest cleared, the grain store defended, a rival's enforcer broken) convert to Arms via **achievement
jumps** (per-event capped so no single fight spikes the pillar) + **seasonal security judged results**
(fired on a new high-water mark, **not** repeatable maintenance). A **lost battle dents Arms** (small,
scripted, recoverable — never a wipe).

**(e) When introduced / fractal reveal.** **T0, R3** — after the **humbling first fight** (a wolf at
the grain store), the drill yard + **Combat panel** + idle-combat/training reveal (combat is live this
early). Combat-earned **standing** first appears at **R5** (gate-guard). It then interleaves through
every per-tier ladder (V2 road-warden, V5 sworn man-at-arms at T1; road-captain / road-security detail
at T2). Reveals are woven throughout, **never dumped at one Act-close.**

---

## 2.9 Bestiary & mobs (grounded)

**(a) What it is.** A **grounded** bestiary across a **shared danger gradient** (near-*satoyama* →
foothills/charcoal grounds → river/ford → upstream Kuzuhara → high pass), gated by **conditioning**.
**Canon hard rule: NO belief-creatures in grindable spawn tables.** Grindable mobs are honestly-mundane
(**~5 in v1**: wild boar, crop-raiding monkeys, a giant-hornet nest, a wolf pack *or* rogue bear,
bandits/starving deserters). Any "yokai" (kappa, fox-fire fox/tanuki, yamanba/tengu, the "one-eyed
mountain god") is an **INVESTIGATE-then-confront one-shot** that resolves to a human/animal — **never a
respawn population** (surfaced through the optional rumour quests, §2.13).

**(b) Player-facing behaviour / loop.** Entering a danger ring (or a danger event firing) auto-spawns an
enemy from a **weighted population table** for that ring. The bestiary panel fills one entry at a time
(discover-by-encounter). Mobs map to quest types (boar → PEST CONTROL; bear → HUNT; bandit lean-to →
CLEAR; raiders → DEFEND). Human mobs (bandits/deserters) introduce mixed motives and CLEAR/CAPTURE
choices with consequences; some are reachable consciences, not pure villains.

**(c) Rough DATA shape.**
- `MobDef { id, kind ('animal'|'insect'|'human'|'wildlife'), dangerRing, stats (Combatant base),
  lootTableId, spawnWeightByRing, isGrindable (true), bestiaryEntryId }` — **isGrindable = honest-
  mundane only.**
- `BeliefBeast { id, rumourQuestId, resolvesToCause (human|animal|natural), oneShot: true }` — kept in
  a **separate registry** from grindable mobs (enforces the canon rule at the type level).
- `SpawnTable { ring, weightedEntries[] }`.

**(d) Ties to the four pillars.** **Arms** — clearing/securing against mobs is the recognized martial
service that converts to Arms. Loot also feeds Estate & Wealth (crafting materials, §2.10/2.11).

**(e) When introduced / fractal reveal.** **T0, R3** (the Bestiary reveals with the Combat panel; the
boar is the first grindable threat after the humbling fight). New rings/mobs reveal one at a time by
conditioning: near-*satoyama* (T0) → foothills/charcoal grounds + river (T1) → high mountains/pass and
human bandits/ronin (T2). Belief-beast one-shots arrive only via inn rumours (T1+).

---

## 2.10 Loot, equipment (FIND + CRAFT), gear & inventory

**(a) What it is.** The gear pipeline. **Equipment slots with durability** (weapon, body/*dō*, head,
hands, foot/*waraji*, charm) filled **two ways (canon): FIND** (dropped gear — a dropped *nata*, a
fallen rōnin's worn *kodachi*, a boar-hide vest) **AND CRAFT** (through the component chain — wood →
charcoal → Smith Gonta's forge → spearheads/blades/tools; hides → tanner → armour). **Gear progression**
is a measurable ladder (borrowed carrying-pole + crude hatchet → fitted *yari*, padded jacket,
smith-forged blade). Plus the **Inventory panel.**

**(b) Player-facing behaviour / loop.** Defeat mobs / work nodes → seeded loot rolls drop materials,
coin, occasional **found gear**. Equip gear into slots (with durability that wears and is repaired/
re-crafted). Craft better gear via the component chain (quality from crafter skill + component quality +
station tier, §2.11). Disassembly returns materials. Each gear tier is a clear power step on the combat
track (and tools improve labour yields).

**(c) Rough DATA shape.**
- `EquipDef { id, slot, statMods (attack/defense/etc.), durabilityMax, craftRecipeId?, foundOnly? }`
- `LootTable { entries: { itemOrMaterialId, weight, qtyRange }[] }` (seeded rolls via the one RNG).
- `EquipState { slot → { equipDefId, durability, qualityTier } }`; `Inventory: Record<itemId, count>`
  (quality folded into the stack key so quality tiers stack distinctly).
- `Durability { current, max, repairCost }`.

**(d) Ties to the four pillars.** **Arms** (gear enables the deeds that earn Arms). The crafting overlap
(tools, the silk/textile finishing chain) feeds **Estate & Wealth** (and the trade strand, ≤ ⅓ capped).
Gear itself is never a standing source — the *recognized deed* is.

**(e) When introduced / fractal reveal.** **T0, R3** — first crude weapon + **Equipment & Inventory**
panels reveal with the Combat panel. The **loot + craft loop** (Smith Gonta spearheads via the
component chain) comes online at **R5** (gate-guard). Better loot/craft tiers unlock per tier and per
danger ring (worn blades from rōnin at T2; Hanzaki's worn gear as a late FOUND prize).

---

## 2.11 Crafting (hybrid: simple → component/quality)

**(a) What it is.** **Canon: HYBRID** — **simple recipes early; the component/quality system unlocks
later.** Early crafting is a flat recipe (inputs → output). Later it becomes **component-based**: an item
is built from components, and **quality = crafter skill + component quality + station tier**, with
**processing chains** (wood → charcoal → forge → tools → blades; hides → tanner → armour; cocoons →
silk → woven textile). **Disassembly returns materials.**

**(b) Player-facing behaviour / loop.** Early: gather inputs, craft a tool/item at a station (a sickle,
a repaired tool) — simple and legible, gating a small bonus. Later: choose components of varying quality
and a station tier to influence the output's quality tier; build multi-step chains; disassemble to
recover materials. The **silk / sericulture *meibutsu*** is the signature late craft/trade chain
(cocoons → reeled silk → woven/graded textile), led by **Weaver Onatsu**, threading T1→T4 under the
trade ≤ ⅓ cap.

**(c) Rough DATA shape.**
- `RecipeDef { id, mode ('simple'|'component'), inputs[], output, stationTier, skillRequired,
  revealPredicate }`
- `ComponentCraft { componentSlots[], qualityFormula (crafterSkill + componentQuality + stationTier),
  outputQualityTier }` (the *shape*; numbers → §4).
- `StationDef { id, tier, recipesEnabled[] }`; `ChainStep` links processing stages.
- Quality tier is part of an item's stack key (so a fine *yari* and a crude one don't merge).

**(d) Ties to the four pillars.** **Estate & Wealth** — crafted trade goods (esp. the silk *meibutsu*)
convert to recorded trade/yield within the **TRADE sub-engine (≤ ⅓ of Estate & Wealth)**; proto-industry
levers feed the LAND/TREASURY strands. Crafted **gear** feeds **Arms** (via 2.10). A graded *meibutsu*
later feeds **Name & Honour** (a famous product celebrated up-tier).

**(e) When introduced / fractal reveal.** **T0** — simple crafting (the Craft tab / first tool) around
R5. The **component/quality system + processing chains** unlock at **T1+** (smithing chains, then the
silk sub-engine at V3). Each chain arrives minimal (one recipe, one station) and deepens fractally.

---

## 2.12 Dialogue & quests (open-ended, non-hand-holdy)

**(a) What it is.** The narrative + unlock delivery vehicle, and a core part of the **universal
rewards/unlock bus.** **Dialogue** = textlines that grant a `RewardBundle` and can lock other lines
(branching), gated by `display_conditions` (reputation / rank / season / skills / flags). **Quests** =
sequential tasks advanced by game events. **Canon quest design: open-ended, NON-hand-holdy** — a quest
is **a suggestion + a story you find out in the world**, never an A→B→C waypoint list; **fewer
checklists overall**; the dominant minute-to-minute behaviour is the **incremental grind.** **~4 v1
quest types** (combat- and labour-spanning, all open-ended): **PEST CONTROL, HUNT, CLEAR, DEFEND** (the
standing-earner). Escort/patrol/bounty/duel/expedition/siege/relief/investigate are **parked for T2+**.

**(b) Player-facing behaviour / loop.** Talk to NPCs (gatekeepers who do double duty as story threads);
lines unlock content and advance flags. Take a quest as an *aim + a rough where* (e.g. "something is in
the lower field at night"), then **read the world** to find the truth (one boar or a sounder? where does
it den?) — preparation and approach are the player's. Quest events drive the unlock graph. **Per-tier
side-quest lists are lean** (§1.9) and **never gate the spine.**

**(c) Rough DATA shape.**
- `Dialogue/TextLine { id, speaker, text, displayConditions (predicate), rewards: RewardBundle,
  locksLineIds[] }`
- `Quest { id, type ('PEST_CONTROL'|'HUNT'|'CLEAR'|'DEFEND'|…parked…), suggestionText, openEnded: true,
  advanceEvents[], rewards: RewardBundle, gatesSpine: false (for side-quests) }`
- `QuestTask { advancedBy (gameEvent), optionalDiscoveryNodes[] }` — discovery, not waypoints.

**(d) Ties to the four pillars.** All four, indirectly: quests are *how the player performs the deeds*
that the authorities recognize. **DEFEND** is the canonical combat **Arms** standing-earner; labour/
office quests feed **Estate & Wealth** / **Standing & Office**; recognition/petition quests feed **Name
& Honour**. The reward bus can carry `pillarDeltas` for recognized completions (achievement jumps,
per-event capped).

**(e) When introduced / fractal reveal.** **T0** — dialogue from the open (the guide/steward beats);
the **quest log** reveals around **R5** (with the pest-control/hunt/clear/defend types and the first
combat-earned standing). Quest scope grows per tier (valley-scale at T1, region-scale at T2 with the
personal-mystery payoff). Parked quest types reintroduce at T2+.

---

## 2.13 Lore, inn rumours & the belief→cause engine

**(a) What it is.** The **light-flavour folklore delivery system.** Folklore is **NOT the spine**; it
arrives as **optional tidbits via the village inn's rumours board** (Innkeeper Sukezō), each a
lightweight yokai story the player **may** investigate. **Canon hard rules:** every rumour-quest is
**optional** and **NONE gate tier progression**; each unlocks **organically** (conditions per tier; more
unlock as the estate & village grow — never an all-at-once dump); each resolves **one-to-one to a
concrete human/natural cause** with **dawning dread, never a Scooby-Doo unmasking** (the game lingers in
the unease before resolving). **Residual ambiguity is hard-capped at ≤ 1** unresolved, off-screen,
mundane-readable beat (the unidentified-hand offering at the **Asagiri boundary-stone**). Folk-religion
texture distinguishes **Shintō** (shrine, *shimenawa*, soul-calling rite) from **Buddhist** elements
(roadside *jizō*, Bon offerings, the temple register of the vanished — which becomes hard evidence). **No
rite ever mechanically "works"; nothing is confirmed supernatural; there is never player magic.**

**(b) Player-facing behaviour / loop.** Read the rumours board → optionally pick up a belief-beast
INVESTIGATE-then-confront one-shot (e.g. the "kappa" of the ford = undertow + a snapping turtle/large
catfish, tied to smugglers' sinking-spot; the "fox-fire" ridge = a hidden charcoal kiln; the "one-eyed
mountain god" = Hanzaki + fog-blind terrain). Investigate through ordinary work/travel; the unease
lingers, then resolves to a grounded cause. Also surfaces lore scrolls/registers (temple register, the
household Journal) read at the cost of in-game time. A **belief→cause table** is authored region-wide
before any node with new omens (so the ≤ 1 cap provably holds).

**(c) Rough DATA shape.**
- `Rumour { id, boardText, unlockPredicate (per-tier, organic), linkedBeliefBeastId?, optional: true,
  gatesSpine: false }`
- `BeliefBeast` (shared with 2.9's separate registry) `{ resolvesToCause, dread-beats[], oneShot }`.
- `BeliefCauseTableEntry { belief, groundedCause, isResidualAmbiguity: false }` — exactly **one** entry
  game-wide has `isResidualAmbiguity: true` (the boundary-stone), enforced by the content verifier.
- `LoreScroll { id, readCostTicks, unlocks: RewardBundle }`.

**(d) Ties to the four pillars.** **Name & Honour** lightly (a sponsored rite, a respected investigation
can colour the house's name), but folklore **never gates the spine and is never a primary pillar
source.** Most rumour payoff is *feeling, allies, and flavour*, not power.

**(e) When introduced / fractal reveal.** **T1** — the inn & rumours board reveal in the village; the
opener is the "kappa" of the ford. Rumours unlock **organically and per-tier** (more as the estate/
village grow). The residual-ambiguity boundary-stone beat is a T1 village node that **lingers
unresolved** by design.

---

## 2.14 World simulation (seasons / weather / festivals)

**(a) What it is.** The living-world layer on top of the clock (2.2): **seasons** (kanji tags driving
the rice cycle, foraging windows, and the seasonal judged results), **weather hazards** (cold/wet
affecting labour/combat), **lunar phases**, **festivals** (Bon, seasonal rites — social/economic hubs,
e.g. Brewer Tokuemon's festival hub), **vendor restocks**, and **food rotting/fermenting**. **Active-
only**, scheduler-driven, deterministic.

**(b) Player-facing behaviour / loop.** The world changes around the grind: plant/harvest by season;
weather nudges what's worth doing; festivals offer time-boxed social/economic beats; the **seasonal
appraisal** (harvest result, autumn audit, security appraisal) fires the **judged-result Influence**
when a new high-water mark is reached. Reinforces "the world enlarges as numbers go up."

**(c) Rough DATA shape.**
- `SeasonRules { perSeason: { activeNodes[], yieldModifiers, weatherWeights } }`
- `Festival { id, season/day, effects (vendorRestock | socialBeat | reputationOpportunity),
  revealPredicate }`
- `WeatherHazard { kind, rateModifiers (labour/combat) }` (soft, never hard-blocking — pairs with 2.3).
- Reuses `WorldClock` + `Scheduler` + `SeasonalAppraisalState` from 2.2.

**(d) Ties to the four pillars.** The **timing/source of the seasonal JUDGED RESULTS for all four
pillars** (harvest → Estate & Wealth; security appraisal → Arms; an inspector's seasonal report → Name &
Honour; an office's seasonal account → Standing & Office). Always **new-high-water-mark only**, never a
repeatable per-season maintenance trickle.

**(e) When introduced / fractal reveal.** **T0** clock first; **T1** brings seasons/weather/festivals to
life (and the village social calendar). Festivals/weather deepen per tier (regional Bon at T2, etc.).

---

## 2.15 Factions & reputation (estate ladder, village web, origin ties, allegiance)

**(a) What it is.** Three starter factions, **deliberately distinct in SHAPE** so they never read as
one bar painted three colours, plus the **Tama-vs-farmhand allegiance**. **More factions/zones bloom per
tier** (the §1.7.1 / world-expansion cut-set; **v1 ships only the three starters + the six cross-cutting
SEEDS** embedded in the starter region — porter's-knot, Ranpo/Obaa Sato, the artisans, the rice-broker,
Ryōa's shrine+register, Magobei/Yagōemon's skim).

- **ESTATE (main) — a fresh rank LADDER per tier.** The only faction structured as a discrete, gated
  ladder (rising through it *is* the perseverance fantasy and the dominant UI-reveal driver). **~8 rungs
  per tier** (T0 R0→R7, T1 V0→V7, T2 enumerated). **Rungs interleave LABOUR and COMBAT**; **combat is
  first-class from T0** and **earns standing.** Driven by **two earned standing meters (progress meters,
  NOT economy currencies): Estate Service** (gates labour promotions) and **Combat Standing** (gates
  martial ones); **labour conditioning is a one-way enablement gate** on combat rungs (ZERO combat stat/
  training-rate bonus). The capstone rung (chief steward / *yōnin* — the personal ceiling) **confirms**,
  does not first-open, the higher macro tiers (pillars gated those in parallel). The estate cast &
  buildings **grow per tier** as **flavour / light systems** (build/recruit — **NOT** a people-management
  sim; no labour-gang, no managed sub-economy, no assignment panel).
- **VILLAGE of Asagiri (side) — a static reputation WEB.** Continuous, **multi-node** meters (not a
  ladder): per-shop "patron/regular" standing (smith Gonta, dry-goods/rice broker, herbalist Obaa Sato,
  brewer Tokuemon, **weaver Onatsu — lead of the silk *meibutsu***), per-family goodwill (raised by
  **open-ended help**), an artisans'/craft-guild standing, and the **Village Chief's regard** (headman
  Yagōemon — a weighted roll-up). **Gentle curves** (linear/soft-cap) for frequent small dopamine.
  **Cast mostly STATIC.** **Village standing NEVER gates the UI ladder or the tier climb** (ignoring it
  leaves you poorer and lonelier — a viable-but-poorer playstyle, never a wall).
- **ORIGIN (side, memory-gated SUPPORT track) — discrete MILESTONES.** Tahei's **living** family/friends
  in **Sawatari-juku** (mother Oyuki, **father Jinpachi**, sister Okimi, employer Denbei, friend Kanta,
  sweetheart Ohana, the porter guild). **Opens at T2** (the dream foreshadows from early game). Per-
  contact **"restored ties"** one-time milestones. Payoff = **support, not local power**: pride/morale (a
  modest global skill-XP buff framed as a *present-day relationship*, never a retroactive gift), allies
  (recruited porter mates), trade ties (origin-town goods/routes plugging into expansion). **Hard
  guardrail: returning memory grants ACCESS only, ZERO mechanical bonus**; at least one origin beat is
  always available **without** reputation-gating (the thread never stalls).
- **The Tama-vs-farmhand allegiance** — a **continuous, re-swingable leaning** (village-leaning ↔
  estate-leaning, default neutral, never frozen). **Rebalances rates & flavour, NEVER availability** —
  both factions fully completable on either lean; neutral is a valid in-character stance. **Faction
  tension is light / flavour — no mechanical penalty.**

**(b) Player-facing behaviour / loop.** Climb the estate ladder (the spine); raise village per-node
meters by trade and open-ended help; restore origin ties as memory + travel-standing allow; nudge the
allegiance through dialogue and where you invest labour. **Separate earned standing meters** keep the
three from collapsing into one bar. Above them sits **House Influence** (2.16); village allies and
origin trade-ties act as **multipliers/feeders** (tuned so weaving both in roughly **halves** time-to-
next-tier — *felt, never a wall; never a new pillar*).

**(c) Rough DATA shape.**
- `EstateLadder { tier, rungs: RankDef[] }`; `RankDef { id, track ('labour'|'combat'|'mixed'|
  'admin-as-narration'), earnedBy (EstateService|CombatStanding thresholds + trustBeats),
  unlocks: RewardBundle }`. Two meters: `EstateService` (steep geometric), `CombatStanding`.
- `VillageWeb { nodes: { shopId|familyId|guildId → meter (gentle curve) }, chiefRegard (rollup) }`.
- `OriginTies { perContactMilestone: boolean, prideBuff (global skill-XP, access-framed),
  allies[], tradeTies[] }` — every asset still grind-built.
- `Allegiance { value (-1 village … +1 estate, default 0), affects: rates+flavour only }`.
- `FactionMultiplier { source (village|origin), influenceSpeedup, budgetShare (apportioned so the
  combined ≈ ½ time, never exceeded) }`.

**(d) Ties to the four pillars.** The **estate ladder generates Influence directly** (labour → Estate &
Wealth; combat → Arms; offices → Standing & Office; recognition → Name & Honour). **Village & origin are
multipliers/feeders into the pillars, never new pillars.** The allegiance shifts *gain rates and
flavour*, never which pillars are reachable.

**(e) When introduced / fractal reveal.** **T0** — the estate ladder (R0→R7) and its two standing
meters. **T1** — the village web (one contact/one shop first, then meters fan out) + the silk sub-engine.
**T2** — the origin support track opens (memory + travel-standing gated) and a fresh region ladder mints.
Each new faction/zone arrives **minimal** (one contact, one place, one verb) and unlocks fractally.

---

## 2.16 House Influence — the four pillars (accrual & per-tier gating)

**(a) What it is.** The **macro-resource** — the house's **recognized standing** in the eyes of
progressively wider authorities, and **the one thing the entire UI-reveal is ultimately gated on.** It
is **NOT** koku and **NOT** coin (those are inputs you spend/grind; Influence is the cumulative score of
what the house has *become*). It is the **umbrella roll-up of FOUR achievement-driven pillars** grown in
lockstep, each mapping to a distinct protagonist domain:

| Pillar | Kanji | Protagonist domain | Grows on |
|--------|-------|--------------------|----------|
| **Arms** | 武威 *bu-i* | combat / weapon-skills / men-at-arms leadership | recognized martial deeds + seasonal security judged results (new high-water mark) |
| **Estate & Wealth** | 家産 *kasan* | labour / jobs / skills / trades / crafting | three **capped sub-engines** — **LAND** (*shinden* reclamation) / **TREASURY** (debt→solvency→creditworthiness, *goyōkin*) / **TRADE** (routes, broker standing, the silk *meibutsu*) — **TRADE hard-capped to ≤ ⅓ of this pillar** |
| **Standing & Office** | *(plain-English label; exact kanji deferred to the §5 authenticity pass)* | jobs-as-offices / administration / quests | offices granted, territory secured, alliances sealed, rivals eclipsed |
| **Name & Honour** | 家格 *kakaku* | the recognition layer (reflects the other three + deeds/patronage/lineage) | the lord's recognition, off the foreclosure list, a sponsored rite, an inspector's report, a recorded merit-elevation |

**Accrual = two shapes only — never a passive time-trickle, never a flat per-action increment (canon):**
- **(A) Achievement JUMPS** — a concrete deed **recognized** by the relevant authority (a recorded
  yield, a granted title, a sealed contract, a road declared safe in the books, a won petition).
  **Per-event caps** so no single fight or harvest spikes a pillar.
- **(B) Periodic JUDGED RESULTS** — a season's harvest, an autumn audit, a security appraisal — a judged
  result of accumulated state, fired on a **new high-water mark** (NOT repeatable maintenance awards).

Influence is **up-only**, with a small, scripted, **per-pillar** set of **recoverable DENTS** (a lost
battle dents Arms; a scandal dents Name; a called debt dents Estate) — **small and NEVER a wipe** (no
permanent holding-loss; a failed defence damages/disables a holding *temporarily*, recoverable by
rebuild).

**Tier gating = PER-TIER REQUIRED PILLARS via SIMPLE THRESHOLDS (canon).** Each tier names the one or
two pillars that must clear a stated threshold to advance, and the **required pillars drift per tier**:
early tiers require **Arms + Estate** ("survive and get strong"); upper tiers require **Office + Name**
("win it socially"). **NO** global floor across all four; **NO** overflow-substitution arithmetic (the
floor+overflow formula is **REJECTED**). The only structural cap that survives is **trade ≤ ⅓ of Estate
& Wealth** (so trade can never carry a gate). **Plus a per-tier transition STORY GATE** (see table).

| Tier | Transition story gate (entry) | Required pillars (simple thresholds) |
|------|-------------------------------|--------------------------------------|
| **T0 Estate** | *(met at the open)* survive convalescence + first labour | **Arms + Estate** (humbling first fight survived; first *shinden* begun; kura solvent) |
| **T1 Village** | enough estate work + **basic repairs** → sent into the village | **Arms + Estate**, first **Office** (errand-authority; headman's regard; cash-crops online) |
| **T2 Region** | **"clean your room"** (estate healthy, village happy, fires out) → grow regional influence; rival houses appear | **Estate + Office** rising; **Arms** secures roads; the **personal-mystery payoff** lands here |
| **T3 Castle-town** *(stub in v1)* | **win the region** → rulers confer leadership + invite the house in | **Office + Name** dominant (won socially); Arms/Estate as leverage |
| **T4 Edo** *(roadmap)* | a **"taste of Edo"** — forced to build & fund an Edo estate → grow influence | **Name + Office** (the national *banzuke* on all four pillars) |

**(b) Player-facing behaviour / loop.** Perform recognized deeds → watch the relevant pillar JUMP (capped)
or rise on the seasonal appraisal → cross a tier's required-pillar thresholds **and** trigger its story
gate → the next tier's canvas opens (no reset). The four-bar standing panel makes the pillars legible
once revealed. Side factions visibly speed the climb (multipliers) without changing what's reachable.

**(c) Rough DATA shape.**
- `Influence { arms, estateWealth (subEngines: { land, treasury, trade(≤⅓ cap enforced) }), office,
  name }` — kept separate from `resources` (2.4).
- `AccrualEvent { kind ('jump'|'judged'), pillar, sourceDeedId, amount (capped), highWaterMarkCheck }`.
- `Dent { pillar, amount (small), scriptedSourceId, recoverable: true }`.
- `TierGate { tier, requiredPillarThresholds: Partial<Record<pillar, threshold>>, storyGateFlag }` —
  **simple thresholds; no floor/overflow fields exist.**
- `TradeCap { tradeStrand ≤ ⅓ * estateWealthTotal }` (structural invariant, verifier-checked).
- *(All thresholds/caps/weights/formulae → §4.)*

**(d) Ties to the four pillars.** This **IS** the four-pillar system — the macro roll-up everything else
feeds. Every other system's deeds funnel here through the accrual shapes (A)/(B).

**(e) When introduced / fractal reveal.** Pillars accrue from early deeds, but the **four-bar House
Influence panel becomes visible/tracked at T0-R7** (the capstone bridge to T1), so the player first
*does* deeds, then *sees* the standing they built. Per-tier required-pillar thresholds + story gates pace
the whole climb (T0→T4); v1 reaches the **T2** gate (T3 stub, T4 roadmap).

---

## 2.17 Estate growth (build / recruit = FLAVOUR, not a sim)

**(a) What it is.** The estate as a **persistent, visibly-mutating place** that grows per tier — an
economic fabric (kura → granary → workshops → …) and a martial fabric (rusty door-bar → cleared drill
yard → low palisade → men-at-arms rota → …). **Canon: building structures and recruiting a small named
retinue are FLAVOUR / LIGHT systems wired to the reveal bus — NOT a people-management sim** (no
labour-gang to assign, no managed sub-economy, no assignment/management panel; **martial scale
hard-capped** — a small named retinue + temporary corvée/levies for crises, **never a standing army**).
**v1 covers stages E0–E2** (E0 Foreclosure's Edge → E1 Stabilising → E2 Recovering); **E3–E5 parked.**

**(b) Player-facing behaviour / loop.** Spend koku / coin / materials / labour (sometimes a martial
prerequisite like "roads cleared") to raise the next structure — every build a **diegetic beat** ("the
frame is raised"), never silent menu inflation. Recruit/secondment adds **light roster cards** (role +
one-line hook + a data-driven contribution slotting into existing idle-producer/garrison systems). The
estate's physical growth runs **ahead** of top personal rank (buildings gate on the relevant **pillars**
— primarily **Estate & Wealth**, plus **Arms** for defensive works — **plus a LOW rank floor + cost, not
the capstone**). The minute-to-minute texture stays **labour + combat grind**, not estate
micromanagement (guards against city-builder/4X drift).

**(c) Rough DATA shape.**
- `EstateStage { id (E0…E2 in v1), econFabric[], martialFabric[], rosterCards[], pillarFloor, rankFloor
  (LOW) }`
- `BuildableStructure { id, costs (koku/coin/materials/labour), martialPrereq?, pillarFloor, rankFloor,
  revealBeatId, contributesTo (idleProducerSlot|garrisonStrength|stationTier) }`
- `RosterMember { id, role, hookLine, contributionSlot, firstAppearsTier }` — **light card by default**;
  only a few get full arcs (existing cast reused: village artisans seconded, origin friends recruited).
- **No** `assignmentPanel` / `labourGang` types (their absence is the canon guard).

**(d) Ties to the four pillars.** **Estate & Wealth** (economic fabric → recorded yields) and **Arms**
(martial fabric → defensive works / men-at-arms readiness, feeding security appraisals). Buildings are
*enablers/displays* of standing; the pillar value comes from the recognized output, not the structure.

**(e) When introduced / fractal reveal.** **T0** — E0 at the open (leaning gate, cracked *kura*, fallow
paddies, rusty door-bar); E1 (kura patched, first *shinden*, drill yard cleared, gate night-watch) and
E2 (granary, two workshops, low palisade, 2–3 men-at-arms on a rota) build across T0→T1. Each structure
reveals fractally (a drill yard = one post → a rack → sparring slots). E3–E5 parked for post-v1.

---

## 2.18 The national *banzuke* / per-tier ranking

**(a) What it is.** The endgame's legible win-display and a per-tier motif: a **ranking of the HOUSE**
(not the man) on all four pillars. **Per-tier rank ladders also rank the house at each tier** (a domain
*banzuke* precedes the national one). The **T4 Edo climax** is a **national multi-pillar *banzuke***.
**LOCKED presentation:** a **popular *mitate* / parody broadsheet** (woodblock, not an official register)
using **sumo-rank vocabulary** — **Maegashira / Komusubi** for the house's attainable band; **Ōzeki /
Yokozuna** for the **structurally sealed top** (the wall the truly powerful built, made the chart's
literal geometry). Honours the **indirect/mediated ceiling**: the house ranks; the MC's personal ceiling
stays **chief steward / *yōnin*** (no *hatamoto* / shogunal audience).

**(b) Player-facing behaviour / loop.** As pillars rise, the house climbs the chart from unranked toward
the attainable band; the top slots remain visibly out of reach (the honest ceiling). A domain *banzuke*
gives each tier a "where do we stand" read; the national chart is the T4 payoff. **One authored ending**
(house restored & ranked) + **post-game free-play (no reset)**; the long-tail is defending the top
attainable spot on the biennial *sankin-kōtai* heartbeat (recoverable, **never a decay-tax**), optional
grounded super-bosses, and per-pillar mastery goals.

**(c) Rough DATA shape.**
- `BanzukeChart { tier ('domain'|'national'), entries: { houseId, computedRankFromPillars }[],
  sealedTopRanks (Ōzeki|Yokozuna, unreachable), attainableBand (Maegashira…Komusubi) }`
- `HouseRank` is **derived from the four pillar values** (read-only display; never a stored stat).
- `PostGameGoal { id, kind ('defend-spot'|'super-boss'|'pillar-mastery'), recoverable: true }`.

**(d) Ties to the four pillars.** It **reads all four pillars** and renders them as a single legible
rank — the most visible expression of House Influence. Defending the spot is a recoverable Arms/Estate/
Office/Name appraisal, never a wipe.

**(e) When introduced / fractal reveal.** **Per-tier domain ranking** surfaces with the Influence panel
(T0-R7 onward, deepening each tier). The **national *banzuke* is the T4 (roadmap) payoff** (v1 stops at
T2 with T3 stubbed). It arrives as a single broadsheet artifact first (the chart that omits you), then
the house climbs it.

---

## 2.19 Save / load (IndexedDB + export/import)

**(a) What it is.** Persistence. **Canon: IndexedDB** (robust, durable, static-friendly — no backend) +
**base64 export/import to file**; **single autosave**; **versioned MINIMAL-STATE** (recompute derived on
load); **seeded RNG persisted.** (The mechanics brainstorm's localStorage note is superseded by canon's
IndexedDB choice.)

**(b) Player-facing behaviour / loop.** The game autosaves transparently; the player can export a save to
a text file and import it back (portability / backup). On load, derived stats are recomputed (so a bug in
derivation never corrupts the save). Versioned migrations run in order; on a bad/old save the game
**degrades gracefully** (clear, explained recovery — never a scary "save is dead" wall).

**(c) Rough DATA shape.**
- **Persist ONLY non-derivable state:** `{ schemaVersion, rngSeed + counter/stream, worldClock,
  total_xp per skill, character level/xp, unlock/finished/story flags, inventory counts (with quality
  keys), equip state + durability, kill/clear/deed counts, current location, reputation/meters
  (EstateService, CombatStanding, VillageWeb, OriginTies, Allegiance), Influence pillar values + dents +
  high-water marks, quest/task status, active-effect remainders, estate stage + built structures +
  roster, market saturation state }`.
- **Recompute on load:** attributes, derived combat stats, production rates, what's unlocked, banzuke
  rank.
- `MigrationStep { fromVersion, toVersion, transform }` (ordered).

**(d) Ties to the four pillars.** Persists the `Influence` pillar values, dents, and high-water marks so
the up-only macro-progress is durable (and the never-a-wipe rule survives reloads).

**(e) When introduced / fractal reveal.** **T0 (M2)** — minimal save first, hardened across milestones as
new state (quests, combat, factions, estate) is added.

---

## 2.20 The DEV play API + content verifier

**(a) What it is.** Two QA systems. **The DEV-only play API** (`window.__qa`, stripped from production
via the build's DEV flag): read state, drive the game's verbs (the same typed intents the UI dispatches),
loop control (`tick`/`step`/`frames(n,ms)`, `pause`/`resume`), `new`/`load`/`save`, and **force-state
helpers** (jump to a late unlock / rare outcome / terminal screen). **Canon: expose a DEV-only play API
on `window` so the game can be driven and observed headlessly** (used by the `capture-game-states` skill).
**The content verifier** (`Verify_Game_Objects` equivalent) cross-checks all ids/refs across registries at
test time, and **balance/content docs in `docs/` are GENERATED** from the same data the game runs
(`npm run gen:docs`) — single source of truth.

**(b) Player-facing behaviour / loop.** None (developer-facing). Powers **headless regression tests**:
force EstateService / CombatStanding / Influence / a story flag, fast-forward, and assert **each reveal
fires at the intended `GameState`**, that **pacing milestones hit on schedule**, that the **belief→cause
table holds the ≤ 1 ambiguity cap**, that **no rung/build/memory grants a hidden stat** (no-hidden-edge),
that **trade ≤ ⅓** holds, and that **no system ever wipes Influence/holdings**.

**(c) Rough DATA shape.**
- `QaApi { state(), drive(intent), tick/step/frames, pause/resume, new/load/save, force(partialState) }`.
- `VerifyReport { danglingRefs[], unreachableReveals[], capViolations[], hiddenEdgeViolations[],
  ambiguityCount }`.
- `gen:docs` reads `core/content` registries → writes balance/content tables into `docs/`.

**(d) Ties to the four pillars.** Indirect: it **regression-tests the pillar accrual rules** (caps,
high-water-mark gating, dents-not-wipes, trade ≤ ⅓) so the four-pillar invariants can't silently break.

**(e) When introduced / fractal reveal.** **T0 (M1 skeleton)**, grows every milestone. Developer
infrastructure, present from early build.

---

## 2.21 Accessibility, audio & presentation register

**(a) What it is.** Cross-cutting presentation. **Art register (canon): TEXT + EMOJI + CSS** (woodblock
palette; kanji season tags; colour-coded rarities; CSS flourishes; a small canvas only for optional
ambient FX, never logic). **Accessibility (canon):** solid basics — scalable text, colourblind-safe cues,
keyboard + touch, pause; **responsive desktop + mobile, NOT hover-dependent** (Shift-for-detail is an
*extra* layer, not the only way to read info). **Audio (canon):** light ambient beds + UI/event SFX +
mute toggle.

**(b) Player-facing behaviour / loop.** A legible, text-first interface that scales and reflows for
mobile; colour cues backed by text/shape (never colour-only); full keyboard and touch operation; a pause;
ambient seasonal audio with a mute toggle. One carefully-tuned **difficulty** (no modes).

**(c) Rough DATA shape.**
- `RarityStyle { tier → colorClass + label }` (colour + text, colourblind-safe).
- `A11ySettings { textScale, colorblindMode, reduceMotion, paused }` (persisted).
- `AudioSettings { ambientVolume, sfxVolume, muted }`.
- Tooltips: a base info layer always reachable without hover (tap/focus), Shift = extra detail.

**(d) Ties to the four pillars.** None directly (presentation infrastructure). It renders the pillar/
standing panels legibly (rarity-coded, scalable) so the four-pillar progress is readable on any device.

**(e) When introduced / fractal reveal.** **T0** — the text/emoji/CSS register and a11y/audio basics
exist from the first build; rarity colour-coding and season tags appear as the relevant systems (loot,
clock) reveal.

---

## 2.22 §2 — items flagged for the human (review checklist)

These are the load-bearing or genuinely-open calls in §2 that should be confirmed before §3:

1. **Pillar accrual & dent shape (2.16).** Confirm the **two-shape accrual** (achievement jumps +
   seasonal judged results, new-high-water-mark only, per-event capped) and the **per-pillar recoverable
   dents (never a wipe)** are correctly captured as *systems*, and that **simple per-tier required-pillar
   thresholds** (no floor/overflow) is the gate model to build against. *(Balance numbers themselves are
   §4.)*
2. **Trade ≤ ⅓ as a hard structural invariant (2.4 / 2.11 / 2.16).** Confirm enforcing it as a
   verifier-checked invariant (not just a tuning target) is desired.
3. **Auto-producers strictly T3+ (2.5).** Confirm v1's E0–E2 estate is **fully active grind** with **no**
   idle producers and **no** assignment/management panel surfaced in v1 (the people-management-sim guard).
4. **Estate build/recruit as light flavour (2.17).** Confirm building & recruiting ship as **diegetic
   reveal beats + light roster cards**, explicitly **not** a buildable management minigame — and that the
   **martial-scale hard-cap** (small named retinue, never an army) is the v1 ceiling.
5. **Belief→cause registry + ≤ 1 ambiguity (2.9 / 2.13).** Confirm keeping **belief-beasts in a separate
   registry** from grindable mobs (so canon's "no belief-creatures in spawn tables" is enforced at the
   type level) and that the **single residual-ambiguity token stays at the Asagiri boundary-stone**.
6. **Skill/quest-type lean-set for v1 (2.7 / 2.12).** Confirm the **lean core skills** (farming, foraging,
   woodcutting, fishing, smithing, cooking; conditioning; 2–3 weapon lines) and **~4 quest types** (PEST
   CONTROL, HUNT, CLEAR, DEFEND) are the v1 surface, with the rest parked.
7. **Standing & Office kanji (2.16).** Still deferred to the **§5 authenticity pass** (plain-English label
   only here) — noted, not an open §2 design question.

---

_§2 drafted from locked canon + LOCKED §1 + the three redesign brainstorms. Balance numbers are
deliberately deferred to §4. Next: §3 — the incremental unlock ladder (UI-as-progression)._
