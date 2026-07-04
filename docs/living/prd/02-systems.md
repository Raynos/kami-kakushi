# §2 — Systems & Mechanics Catalog

This section catalogues the game's systems as *shapes* — the parts list plus each
system's data sketch. Balance numbers live in §4; the *why* behind each design lives
in the decision log, and the milestone order in the roadmap.

### System inventory (the parts list)

| # | System | First introduced | Pillar(s) it feeds |
|---|--------|------------------|--------------------|
| 2.1 | UI-reveal engine + event log | T0 (exists from build one) | — (the meta-spine that surfaces every other system) |
| 2.2 | Time, season & world clock (active-only) | T0 | feeds seasonal **judged results** for all four |
| 2.3 | Soft stamina / satiety (throttles labour **and** combat) | T0 | — (paces the day; no pillar) |
| 2.4 | Resources & currencies (coin, rice, pillars, materials) | T0 (coin + rice); coin denominations reveal per tier | Estate & Wealth; pillars are the macro layer |
| 2.5 | Auto-producers (late-game only) | T4+ | Estate & Wealth (idle convenience, never early) |
| 2.6 | Gathering / labour nodes & jobs-as-offices | T0 | **Estate & Wealth**, **Standing & Office** |
| 2.7 | Attributes, per-skill levels & milestones (character level **combat-fed only**; per-skill perks add small combat texture) | T0 (attributes/skills); web grows per tier | Arms (combat skills + perks), Estate & Wealth (labour skills) |
| 2.8 | Combat (idle auto-resolve + active setup) — **INCREMENTAL** (starts with the carrying-pole); **THREE clean tracks** | **T0 (R3)** | **Arms** |
| 2.9 | Bestiary & mobs (grounded) | T0 (R3) | Arms |
| 2.10 | Loot, equipment (FIND + CRAFT), gear & inventory — a **growing ~9–10-weapon roster** | T0 (R3) | Arms; crafting overlaps Estate & Wealth |
| 2.11 | Crafting (hybrid: simple → component/quality) | T0 (simple); component system T1+ | Estate & Wealth (trade sub-engine); Arms (gear) |
| 2.12 | Dialogue & quests (open-ended; intra-line branching; no quest-type budget) | T0 (dialogue); quest log ~R5 | all (the universal unlock/reward bus) |
| 2.13 | Lore, inn rumours & the belief→cause engine | T2 | Name & Honour (flavour); never gates the spine |
| 2.14 | World sim (seasons / weather / festivals — bounded ±10% mechanical) | T0 clock; seasons/festivals T2 | seasonal judged results for all four |
| 2.15 | Factions & reputation (estate ladder, village web, origin ties, allegiance) | T0 (estate); T2 (village); T3 (origin) | all four (via multipliers / standing) |
| 2.16 | House Influence — the four pillars (accrual + **HYBRID good/great/excellent** tier-gating) | tracked visible at T0-R7 | the macro roll-up of all four |
| 2.17 | Estate growth (build / recruit = flavour) | T0 (E0→E3 in v1) | Estate & Wealth; Arms (defensive works) |
| 2.17.1 | Housing — personal home, belongings & comfort (DEEP; prestige-not-power) | T0 (dry corner → quarters) | — (comfort + status-mirror; feeds NO pillar directly) |
| 2.18 | The national *banzuke* / per-tier ranking | per-tier domain rank; national at T5 | reads all four pillars |
| 2.19 | Save / load (**MULTI-BACKEND** redundant + export/import) | T0 (built full) | — (infrastructure) |
| 2.20 | The DEV play API + content verifier | T0 | — (infrastructure/QA) |
| 2.21 | Accessibility, audio & presentation register | T0 | — (infrastructure) |

The rest of §2 details each. **Systems 2.1, 2.8, 2.16, 2.19, and the pillar accrual
rules in 2.15 are the most load-bearing.**

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

**Design-staggered reveals — a general NO-UI-DUMPS principle.** Reveal cadence is a
**gameplay/UI DESIGN responsibility, not runtime machinery.** The unlock schedule is
**authored so reveals are inherently one-at-a-time** — beats are spaced across the rank ladders so no two
collide on a single tick. There is **NO runtime `revealQueue` field** in `GameState`: staggering is a
property of the *authored* schedule, not stored runtime state. The rare genuine multi-element
single-feature reveal (a panel that legitimately ships two controls at once) is a **bespoke one-off
designed per case**, not a generic queue. Everything obeys the general NO-UI-DUMPS rule (stagger
everything, slowly and gently).

**(b) Player-facing behaviour / loop.** Minute one is one verb ("Rake the spilled rice") + the log +
a counter. As the player acts, things *appear*, each announced in-fiction ("footsteps — a door
slides…"). The **UI shell is multi-screen navigation that appears single-screen early**: more
screens/nav unlock as the player progresses (responsive desktop + mobile, **not** hover-dependent).
Reveals follow the **per-tier rank ladders** (a fresh ladder per tier — §1.5.1, §2.15), never one
continuous staircase. **Distinct activities (e.g. Crafting, Quests) surface as their own TOP-LEVEL nav
tabs, not nested panels** — so the main screen stays the active labour/deeds/combat loop. The loop
the player feels: *act → something new fades in with a log line → explore it → act more.*

**(c) Rough DATA shape.**
- `RevealableEntry { id, kind ('panel'|'tab'|'navLink'|'resourceRow'|'button'|'screen'|'area'),
  unlockPredicate (expression over GameState: flags, resources, rank, skill levels, story node,
  season, pillar values), revealLogLineId, oncePerGame }` — the `'tab'`/`'navLink'` kinds carry the
  **top-level activities** (Crafting, Quests) that reveal as their own nav rows, not nested panels.
- `RewardBundle { items?, xp?, coin?, rice?, materials?, locationsRevealed?, panelsRevealed?,
  dialoguesUnlocked?, recipesUnlocked?, questsStarted?, flagsSet?, pillarDeltas? }` — the universal
  object every dialogue/quest/threshold/combat-deed can emit.
- `LogMessage { id, text, channel ('narration'|'reward'|'combat'|'system'|'milestone'), colorClass, tick }`,
  stored in a **true ring buffer** with a pinned hard cap (`LOG_RING_MAX ≈ 300`, oldest evicted; only a
  ~50-line tail persists — §6.4/§6.8).
- Unlock predicates are **pure functions**; the renderer subscribes to state snapshots and does one
  `render(state)` reconciliation (no scattered push-updates → kills stale UI). **No reveal-queue state is
  persisted** (the schedule is authored, not buffered at runtime).

**(d) Ties to the four pillars.** Indirect but total: the **House Influence panel (2.16) and many
late reveals are gated on pillar thresholds**, so "numbers go up" and "the world enlarges" are one
motion. The reveal engine is the surface on which all four pillars become *visible* (the standing
panel — the active Estate bar plus locked silhouettes — reveals at T0-R7).

**(e) When introduced / fractal reveal.** **T0, build one.** It exists before any content and
governs everything thereafter. It is itself fractal: a drill yard reveals one post → a rack →
sparring slots; a new region reveals one road → one threat → one contact. Reveals are
**design-staggered one-at-a-time** (no runtime queue).

---

## 2.2 Time, season & world clock (active-only)

**(a) What it is.** An **abstract in-game clock advanced by active play** (a single tick driver with
per-tick / per-day / per-week scheduler). Drives day/season (kanji tags), weather, lunar phase,
festivals, vendor restocks, food rotting/fermenting, and — critically — the **seasonal *judged*
Influence results** (§2.16). **ACTIVE-ONLY:** the clock advances **only while the game is open and
visible**, and **PAUSES on `document.hidden`** — there is **no offline or background accrual and no
wall-time catch-up**. The story never advances while the tab is backgrounded or the game is closed.

**(b) Player-facing behaviour / loop.** Time passes as the player works; a day/season indicator (e.g.
春 spring) is always visible once revealed. Seasons gate which gathering nodes are productive (rice
cycle, foraging windows) and trigger festivals and the reckoning beats. There is **no offline accrual
and no offline summary**: the clock **pauses the moment the tab is hidden** and halts when the game is
closed. The "leave it running, check the progress" feel comes from **tab-open auto-resolve combat +
auto-repeat labour** — active-only loops that keep ticking **while you watch** — not from any
background or wall-time accrual.

**(c) Rough DATA shape.**
- `WorldClock { tick, day, season ('spring'|'summer'|'autumn'|'winter'), year }` — **only the day index
  and tick persist.** Weather and lunar phase are **NOT stored fields**: they are **DERIVED on read** via a
  pure stateless helper `deriveDayKeyed(seed, 'weather'|'lunar', day)` over the day-keyed RNG sub-stream,
  so nothing weather/lunar ever serialises (only `day` does). This keeps the clock replay-stable
  and the save minimal.
- A **fractional-tick remainder** accumulates in the app tick loop (not in core) so `tick()` only ever
  receives **whole integer ticks** — the deterministic core never sees a fractional `dtTicks`.
- `Scheduler { perTickPlans[], perDayPlans[], perWeekPlans[] }` — registry rows that fire effects on
  cadence (restock, rot, festival start, harvest reckoning).
- The seasonal **JUDGE** folds pillar state **one day at a time** on a per-tier **reckoning cadence**
  (`PHASE2_JUDGE_INTERVAL_DAYS` — a per-tier lever, decoupled from the 28-day season calendar; at T0 the
  house reckons ~every 3 days). Each pillar carries a `PillarState { value, highWater, judged }` (§2.16);
  a reckoning fires a judged result only on a **new high-water mark**, never a repeatable maintenance
  award. There is **no `pendingAppraisals` counter** — the judge advances one day per tick.

**(d) Ties to the four pillars.** The clock is the **timing source for accrual shape (B)** — periodic
**judged results** (a season's harvest, an autumn audit, a security appraisal) for **all four
pillars**. It never grants Influence by itself (no time-trickle).

**(e) When introduced / fractal reveal.** **T0** — the clock display reveals early (around R1, with
the *rice* heartbeat); seasons/weather/festivals deepen at **T2** (the world-sim layer, §2.14).

---

## 2.3 Soft stamina / satiety (throttles labour AND combat)

**(a) What it is.** A **soft** energy/satiety meter that **slows** action when low — it **never
hard-blocks** play. It throttles **BOTH labour AND combat**. Rest and eat to refill; it paces the day
and gives food/cooking a purpose, and adds the "eat before you fight" texture to combat.

**(b) Player-facing behaviour / loop.** As the MC labours or fights, satiety/energy drains; depleted,
actions get slower / less efficient (a gentle nudge to rest, eat, or change activity), never a wall or
a punishing timer. The throttle curve is **flat above ~0.7** of `satietyMax`, then **knees down toward a
~0.5 floor** (`STAMINA_RATE_FLOOR ≈ 0.5`) — a rate multiplier, never to zero.
**Combat uses a SEPARATE `satietyRate` coefficient** from the labour floor (so the two can be tuned
independently; §2.8/§4), and "**adequate satiety**" = **≥~0.7** — the level at which the **locked 20–35%
first-fight win-rate** is measured (§2.8/§4.6.6), so an underfed protagonist fares worse still. Refill by
resting (advances the clock) and eating cooked food (ties to the cooking skill and provisioning economy).
The convalescence framing of the cold open uses this meter (rest and recover "a little" in the first
hours — he is **not** a bedridden invalid).

**(c) Rough DATA shape.**
- `Vitals { hp, hpMax, satiety, satietyMax, fatigue }` (derived caps recomputed on load; `satietyMax = base
  + per-(combat-)level growth`, scaling off the character (combat) level, §2.7/§4.4).
- Action costs reference a `staminaCost` field; a soft-throttle function maps low satiety → a *rate
  multiplier* on labour/combat speed (never to zero), using the **labour floor** for work and the
  **separate `satietyRate` combat coefficient** for fights (floor ~0.5; bounded so the floor only costs a
  few win-rate points, never below ~15%).
- `FoodItem { restoreSatiety, buffs?, perishable, spoilTicks }`.

**(d) Ties to the four pillars.** None directly. It is a pacing/throttle system. (Cooking/provisioning that
feeds it sits under Estate & Wealth's labour, §2.6; combat's satiety throttle is detailed at §2.8/§4.6.)

**(e) When introduced / fractal reveal.** **T0** — the body/rest bar reveals at **R0** (in the *kura*,
alongside the rice counter). The satiety soft-gate surfaces as the player leaves the storehouse and
labour begins (R1–R2); the **combat** throttle surfaces with the first fight at **R3**.

---

## 2.4 Resources & currencies (coin, rice, pillars, materials)

**(a) What it is.** The economic substrate. **COIN is the sole spendable currency** — one underlying
value (base unit **mon 文**) held as a single integer count, **DISPLAYED in fixed mixed denominations**
(mon → monme → ryō; **1 ryō = 50 monme = 4,000 mon**, **1 monme = 80 mon**), with the higher
denominations **revealed INCREMENTALLY as wealth grows** (mon at T0–T1 → monme → ryō by T4–T5). There is
**no moneychanger and no floating forex** — the mixed read is pure display over the one `mon` count, and
**held coin reads as a comfortable NET figure, not gross.** **RICE is a real, first-class RESOURCE** (its
own counter — the *rice* heartbeat — **NOT** a currency and **NOT** a synonym for koku): labour yields
rice (+ a little coin), and you **EAT it** (satiety, §2.3), **STORE it** (the *kura*), or **SELL it for
coin** at a **price that SWINGS BY SEASON** (the season rice price, §4). **Storing rice now COSTS
something** (spoilage / a capacity cap / a small storehouse fee — the exact mechanism is a build-time
call, **D-118**), so *store-vs-sell* is a real decision rather than free, unbounded, risk-free hoarding;
**carried/banked COIN is unaffected** (still uncapped and safe). **KOKU is neither of these** — it
is the house's assessed **STANDING** (a kokudaka-like prestige SCORE re-expressing House Influence),
**never spent, never a resource**; it lives in §2.16 and is kept OUT of `resources`. **The four House
Influence pillars** = the macro standing layer (NOT spendable — they are the cumulative score of what the
house has *become*; see 2.16). **Other resources** (wood, charcoal, fish, *sansai*/wild greens, herbs,
hides, fibre/silk cocoons, ore/iron, etc.) feed crafting and trade. Each new resource **lights its own
panel/row** on first acquisition (via 2.1). Coin / market numbers (the coin denominations, the seasonal
rice price, sinks, the silk *meibutsu* economics, `MarketState`) are detailed in §4.

**Two finance lanes — PLAYER vs ESTATE.** The protagonist's **personal** coin (what he spends on his own
character — gear, provisions, tools) is a **distinct lane** from the **estate's** coin/wealth (the estate
economy and, later, the trade engine). A personal coin **SINK** — a small, capped **provisioning shop**
where the player buys goods for himself, priced in **coin (mon)** — is live from **T0** (reached by talking
to a **trader** at a map node, on the vendor-as-person spectrum, **not** a bare inline menu — D-114/§2.12); the estate-scale
**TRADE engine** (selling the estate's surplus rice and crafted goods for coin) opens at **T2**. Early
spending and grinding run on the player lane; the estate lane grows as the house recovers.

**Carried vs BANKED.** Wealth also splits by RISK: **carried** wealth (`state.resources` — coin, rice,
materials) rides with the protagonist and is **at risk** — a lost fight bites a slice of it (§2.8) — while
**banked** wealth (`state.banked`, the *kura* storehouse) is **sheltered and safe**. Deposit/withdraw move
wealth between the two, and you bank only at the *kura* node (§2.6), so fighting far from home with a full
purse is the gamble. (**koku STANDING is immune** — it is a score, not carried wealth, so a loss never
touches it; §2.8/§2.16.)

**(b) Player-facing behaviour / loop.** Grind **rice** (+ a little coin) by farming; **eat it, store it,
or sell it for coin** at the season price; spend **coin** + materials on crafting, gear, building, and
tier-expansion. A **small capped provisioning shop** is the **T0 personal coin sink**; the **estate TRADE
engine** (converting surplus rice/goods to coin via brokers/shops) opens at **T2** — there is **no trade
engine in T0 or T1**. **Rice and coin are what you grind and spend; koku STANDING and Influence are what
you become.** A **market-saturation damper** (2.11/2.15) applies **PROGRESSIVELY per-unit** on bulk sales
— **each unit walks the price down** (legible, un-gameable) — and recovers over in-game days, keeping
grinding interesting and stopping trade running away (reinforced by the trade ≤ ⅓ cap).

**(c) Rough DATA shape.**
- `ResourceDef { id, name, kind ('currency'|'rice'|'material'|'food'|'fibre'|'ore'…), revealPredicate,
  stackable, perishable?, spoilTicks? }` — **`coin` is the sole `'currency'` def** (stored as one integer
  `mon` count; the mon → monme → ryō mixed denominations are a **DISPLAY** concern, §4, not separate
  resources). **`rice` is a first-class `'rice'` ResourceDef** — eaten (§2.3), stored (banked), or sold
  for coin at the season price; it is **NOT** koku.
- `GameState.resources: Record<resourceId, amount>` — **carried** wealth (coin, rice, materials — at risk
  in combat); **counts only, UNBOUNDED — no caps**; derived rates computed, never stored.
- `GameState.banked: Record<resourceId, amount>` — the **kura storehouse** (rice, coin, materials),
  sheltered from combat loss; deposit/withdraw only at the *kura* node (§2.6/§2.8). **Banked RICE now
  carries a holding cost** (spoilage / capacity cap / storehouse fee — mechanism TBD at build, **D-118**),
  so stored rice is no longer free/unbounded/safe; **banked COIN stays uncapped and safe.**
- `MarketState { perGoodPriceIndex, saturationByGood, recoveryRate, seasonalRicePrice }` — the **per-unit
  progressive** damper **plus the season-swinging rice price**; numbers → §4.
- **KOKU standing is NOT a resource.** Pillar values (and the derived koku standing score) live in
  `Influence` (2.16), kept structurally separate from `resources` so trade can never masquerade as
  standing and so koku can never be spent. The **Estate & Wealth pillar value is DERIVED** — summed
  `land + treasury + trade` on read, **never a stored aggregate** (a strand-dent can't desync it —
  §2.16/§6.4).

**(d) Ties to the four pillars.** coin/rice/materials are the **inputs** the house spends and produces to
earn recognition; **recorded yields and sealed contracts convert to Estate & Wealth** (via achievement
jumps / seasonal judged results). The **trade strand (routes / broker standing / the silk *meibutsu*)
is hard-capped to ≤ ⅓ of Estate & Wealth**, so a pure-trade run maxes ~⅓ of one of four pillars.

**(e) When introduced / fractal reveal.** **T0** — the **rice counter** (the rice heartbeat) at **R0/R1**
(rice counter → paddies), with **coin (mon)** alongside from the first labour (labour yields rice + a
little coin). The **provisioning shop** (the personal coin sink) opens in T0. **Coin exists from T0 in
mon**; the **higher DENOMINATIONS reveal INCREMENTALLY** (monme as wealth grows, ryō by T4–T5), and the
estate **trade engine** opens at **T2** (not a new currency — the same coin, now earned at estate scale).
Material resources reveal one at a time as their nodes/crafts come online (foraging → *sansai*;
woodcutting → wood → charcoal; fishing → fish; sericulture → cocoons/silk at the silk sub-engine).

---

## 2.5 Auto-producers (LATE-GAME only)

**(a) What it is.** Idle helpers that produce a resource over time **without** the MC's active action.
**Limited / late-game ONLY** — early game is the MC's own active grind. There is **no
assignment/management panel and no labour-gang to manage, ever** (that would be the rejected
people-management sim). Auto-producers are a late convenience surfaced as **seconded/recruited helpers**
(village allies, recruited origin friends) wired to existing idle-producer slots.

> **Auto-producers are NOT the "leave it running, check the progress" feel.** That feel comes from
> **tab-open AUTO-RESOLVE combat + AUTO-REPEAT labour** — active-only loops that keep ticking while
> you watch — **not** from offline accrual or early idle producers. Auto-producers remain a distinct
> *late* convenience; v1 stays active-only (no offline progress).

**(b) Player-facing behaviour / loop.** From late game, a recruited helper quietly trickles a resource
(e.g. a seconded hand tending a reclaimed paddy) so attention is freed for the active grind elsewhere.
Framed diegetically as a person joining the house's works — **flavour roster cards, not a managed
sub-economy.** Consistent with active-only: helpers produce **only while the game is being played**;
there is **no offline accrual.**

**(c) Rough DATA shape.**
- `AutoProducerDef { id, resourceProduced, baseRate, costToBuild (coin/materials),
  rankFloor (LOW), pillarFloor, revealPredicate, rosterCardId }` — gated on Influence band + a LOW
  rank floor + cost (not the capstone), per the estate-growth rule.
- Cost curve scaffold mirrors the genre (`cost = base * r^owned`, ~5× jumps between tiers; **integer-pow,
  not `Math.pow`** — §2.19/§6) — values → §4.
- Bound to a `RosterMember` for the diegetic framing (the helper is a face, not a slider).

**(d) Ties to the four pillars.** **Estate & Wealth** (their output converts to recorded yield).
Defensive auto-producers (a standing watch) can feed **Arms** via security appraisals. They are an
*efficiency* layer, never a standing source in themselves.

**(e) When introduced / fractal reveal.** **T4+ (parked beyond v1's early surface).** v1's E0–E3 estate
stays an **active grind**; the first auto-producers belong to later tiers. Each arrives minimal (one
helper, one resource) and is announced as a recruitment beat.

---

## 2.6 Gathering / labour nodes & jobs-as-offices

**(a) What it is.** The peaceful-labour core — the **dominant daily texture** (labour-plurality). Two
faces: **gathering/labour nodes** (the MC's own active work) and **jobs-as-offices** (administrative
duties framed as *the MC's own quests/offices*, **not** a management layer). **Lean starter set:**
farming, foraging, woodcutting, fishing, smithing, cooking; **more unlock as you climb
tiers/regions.** Nodes are **tiered and season-gated**; clickable now, idle later. A **tab-open AUTO-REPEAT
labour** convenience (active-only — repeats the chosen action while the tab is open) is the grind
convenience, **distinct from** the *late* auto-gather toggle / auto-producer (§2.5).

**(b) Player-facing behaviour / loop.** Do the work manually (rake rice, fell timber, forage the
near-*satoyama*, fish the ford), or leave the **tab-open auto-repeat** running and check the progress;
each action yields a **resource + skill XP + sometimes a quest event**. Higher ranks/offices add
**jobs-as-offices** — e.g. the bailiff of the home fields takes on field administration as **his own
duties/quests**, never a city-builder panel. The texture stays **grind ("the hero gets better at what he
does")**, not micromanagement. **Grind depth is a FLOOR, not a ceiling** — a longer OSRS-rough grind with
**enough grinding content, interleaved, never brick-walled**; §4.8 is a **minimum-grind** model
(the pacing regression fails on **undershoot only**).

**(c) Rough DATA shape.**
- `LabourNode { id, skill, area (map-node binding — the SPATIAL model), resourceYields[],
  seasonWindow, dangerRing?, staminaCost, revealPredicate, autoRepeatable (tab-open, active-only),
  autoGatherUnlock? (LATE) }`
- `Job/OfficeDef { id, kind ('labour'|'admin-as-quest'), grantsResponsibilities[], questsOpened[],
  rankFloor, pillarContribution }` — admin offices emit **Standing & Office** recognition, not a sim.
- Yields reference `ResourceDef` (2.4) and grant `SkillXP` (2.7).

**(d) Ties to the four pillars.** **Estate & Wealth** primarily (LAND via *shinden* reclamation;
TREASURY via debt→solvency; TRADE via routes/broker/silk — the trade strand ≤ ⅓ capped). **Jobs-as-
offices** feed **Standing & Office** (offices granted, the bailiff duty, a dispute arbitrated). Recorded
yields and seasonal harvest appraisals are the canonical **achievement-jump / judged-result** sources
(accruing in **Phase 2** — §2.15.1/§2.16).

**(e) When introduced / fractal reveal.** **T0.** Farming at **R1** (paddies, the *rice* heartbeat);
foraging + woodcutting + hauling at **R2** (Skills tab + near-*satoyama*); smithing/crafting chains and
fishing fold in across R5–R6 and the wilderness rings. **T2** adds village-facing labour (cash-crops,
the silk/sericulture sub-engine at V3); **T3** adds region-scale labour (post-town trade, Kuzuhara
river-works as a labour project). Jobs-as-offices begin at **T0-R7** (bailiff) and grow per tier.

**(f) The map is SPATIAL — every activity is on ONE node, you walk there to do it (T0).** The
"small walkable map" (§1) is **load-bearing**, not chrome: each labour is **bound to a map node**
(`area`), there is **no default node**, and the work tab lists only the **current node's** labours — so
you start at the *kura* (rake rice), then **walk** to the paddies to farm, the woodlot to cut, the
near-*satoyama* to forage. The same spine binds **combat** (foes live on nodes — you walk to a foe's
ground to fight it; the scripted grain-store wolf is faced at the *kura*; §2.8/§2.9) and the **storehouse
/ bank** (deposit/withdraw only at the *kura*; §2.4). A **load-bearing node gates a richer
yield** — the **deep-*satoyama*** (奥山) past the danger ring returns a materially better forage — so walking
farther *pays* (tying the map to the coin economy §4 and the combat cook-loop). The map presents as a
walkable **paths list** along the 道 (with a schematic 絵地図 and a traveller's-ledger 道中記 as alternate
views).

---

## 2.7 Attributes, per-skill levels & milestones

**(a) What it is.** The **rich attribute system** + **per-skill levels** + a **milestone web**:
deep, interacting attributes (STR / AGI / INT / SPD / a luck-style stat) **+ per-skill `total_xp`
pools** (skills surface *by doing*, hidden until a small visibility threshold) **+ milestone perks**
(flat stats, multipliers, titles, cross-skill XP bonuses). **Lean core skills at T0; more unlock per
tier.** The **character (combat) level is its OWN stored track, fed by COMBAT XP ONLY** (labour and deeds
**never** raise it; §2.8.1): it grants **HP** (`hpMax`), **satiety capacity** (`satietyMax`),
and **attribute points** (the curves are §4 numbers). To keep the tracks from coupling, the
**compounding skill-XP multiplier is scoped out (or kept tiny)** so combat level can never drive labour XP
(that would re-open a combat→labour loop).

**(b) Player-facing behaviour / loop.** Doing labour/combat raises hidden skills until they **surface**
(a discover-by-doing reveal via 2.1), then keep levelling on a steep curve with **per-event XP caps**
(combat and crafting per-event caps force *breadth and grind*, never a quick spike). Milestones at
thresholds grant perks — an emergent build web and long-tail goals; **every skill (labour included) also
has a small per-skill perk track that adds a few bounded combat bonuses** (§2.7.1). Attributes layer base
/ additive / multiplier and **recompute on load** (saved as `total_xp`, not derived stats).

**(c) Rough DATA shape.**
- `Attribute { id (STR|AGI|INT|SPD|luck), base, fromGear, fromMilestones }` (recomputed).
- `SkillDef { id, category ('Farming/Labour'|'Gathering'|'Crafting'|'Combat'|'Weapon'|
  'Environmental'), visibilityThreshold, xpCurveParams, perEventCap, milestones[], perks[] }` — **every
  `SkillDef` carries a `perks[]` track** (§2.7.1).
- `Milestone { atLevel, perks: RewardBundle-like (flatStat | multiplier | title | crossSkillXp) }`
- `GameState.skills: Record<skillId, total_xp>`; `character.level + xp` (the **combat-fed** level track,
  §2.8.1).
- **No-hidden-edge guard.** Every skill (labour included) grants a **few small combat perks** through a
  **separate `skillCombatBonus` channel** (NOT an attribute, NOT character level) — see §2.7.1. **Conditioning
  stays the ZERO-stat enablement gate** (the one exception that grants no combat stat at all). Milestones
  never read returning-memory/porter's-knot flags (the no-edge-of-BIRTH/GIFT/MEMORY line holds; the line is
  **gift-vs-work**, not labour-vs-combat). The **big** combat power (character level + attribute points)
  stays **combat-sourced ONLY**.

**(d) Ties to the four pillars.** Indirect: **combat skills → Arms** (better deeds), **labour/craft
skills → Estate & Wealth** (better yields/quality) and, via per-skill perks, a little extra combat
**capability**. Skills do **not** grant Influence directly; they make the *deeds* that the authorities
recognize more achievable. Milestone titles can feed **Name & Honour** flavour (a recorded merit), but the
pillar value comes from the recognized deed, not the level.

**(e) When introduced / fractal reveal.** **T0** — attributes exist from the open; the **Skills tab**
reveals at **R2** on first XP. Combat/weapon skills surface at **R3** (drill yard) — starting with the
**carrying-pole**: the weapon roster grows **incrementally** (T0 opens at 3 weapons — pole + 2 — then +3
at T1 / +4 at T2; **~9–10 across v1** — §2.10.1). Lean core lines at T0 (farming, foraging, woodcutting,
fishing, smithing, cooking; conditioning); **more skills unlock per tier** (e.g. sericulture/textile at T2,
surveying/engineering and trade skills at T3). This **incremental per-rung/per-tier skill unlock is itself
the real bound** on the labour→combat cross-feed — you can't front-load perks.

### 2.7.1 Per-skill perks — the bounded labour→combat cross-feed

**(a) What it is.** A **bounded, earned** cross-feed: **every skill** (labour skills included) has a
**perk / flat-bonus track** — **~2–8 perks** (or ~3–8 small flat stat bonuses) per skill — **unlocked by
levelling that skill.** Each perk adds a **small combat bonus** through a **dedicated `skillCombatBonus`
channel** (kept off the attribute/level math). So a milled-out labourer is **a little** more
combat-capable — *capable→a-bit-more-capable* — but **big combat power stays combat-only.** This is the
**gift-vs-work** line, not labour-vs-combat: nothing is *given* by birth/memory; reps *earn* small bonuses.

**(b) Boundedness (how it stays honest without a hard global cap).** Perks are **stackable with NO hard
global cap.** They stay bounded by three soft levers instead: **(1)** a **small per-perk magnitude**
(individually tiny — §4); **(2)** the **incremental skill unlock** (perks reveal per rung/tier, never
front-loadable); and **(3)** **holistic enemy/drop scaling** (encounter difficulty is tuned against the
expected total — the modest power-creep risk is **accepted**). The content verifier asserts each
perk is **small-magnitude (not zero, not a single global ≤CAP)** (§2.20).

**(c) The conditioning exception.** **Conditioning** alone stays the **ZERO-stat one-way enablement
gate** (the weak→capable gate that *unlocks* the combat track) — it grants **no** combat stat or
training-rate bonus, and the per-skill perk channel must **never** become a back-door past it: conditioning
(enablement) and `skillCombatBonus` (small polish) are **orthogonal** (§2.8(a)/§4.5/§4.6.1).

**(d) Rough DATA shape.**
- `SkillDef.perks: PerkDef[]`; `PerkDef { id, unlockAtSkillLevel, combatBonus (small flat/%, via
  skillCombatBonus channel), isConditioningException: false }`.
- `GameState` derives a single `skillCombatBonus` aggregate (summed independently of attributes and
  character level) applied in the combat sim (§2.8(c)). *(Magnitudes → §4.5.4.)*

**(e) When introduced / fractal reveal.** **T0+** — perks reveal as their parent skill levels, **one at a
time**, interleaved with the combat-reveal ladder (§2.8.2). The conditioning enablement gate is the T0-R3
combat-unlock beat; the small per-skill polish accrues gradually thereafter.

---

## 2.8 Combat (idle auto-resolve + active setup)

**(a) What it is.** A **first-class core pillar from T0** and an **INCREMENTAL progression surface.**
Style: **idle auto-resolve + active setup** — prepare gear/stance/node, a **deterministic seeded fight**
resolves. Low-APM, strategic, **NOT twitch.** T0 opens with the **carrying-pole** and grows to **3 weapons
across the tier** (the pole + 2 more, **at least one craftable**); a **growing roster** unlocks
rung-to-rung along the **combat-reveal ladder** (§2.8.2; ~9–10 weapons across v1 — §2.10.1). Combat feeds
**THREE clean, separately-stored tracks** (never one fused bar — §2.8.1): **character (combat) level**
(kills/combat-XP), the **Arms pillar** (recognised deeds, Phase-2-gated), and the **Combat Rank rung-meter**
(per-rung curated activities). **Mediocre-start preserved:** start near-zero; the **humbling, near-fatal
first fight** is an early beat (survived by luck / sheer stubbornness, never skill — and never *rescued*:
you survive it, THEN beg Kihei for drills); capacity is **earned through Kihei's drills**, gated behind
labour-built **conditioning** (a one-way enablement gate that grants **ZERO combat stat or training-rate
bonus** — orthogonal to the small per-skill perks of §2.7.1). Combat is **satiety-throttled** ("eat before
you fight"; §2.3). **Failure = soft setback** (lose HP / a bite of carried wealth / time, maybe an injury
to rest off) — **never** lose levels/gear/permanent progress.

**(b) Player-facing behaviour / loop.** **Walk to a foe's node** (§2.6), equip gear, pick a **stance**
(glass cannon ↔ tank — trading damage dealt against damage taken), optionally bring consumables, then let
the fight **auto-resolve** on a fixed-step seeded sim. On kill: combat-XP → **character level** + skill XP +
seeded loot roll + bestiary update + quest events. **A weapon's `attackPower` is scaled by its current
durability BAND and by the satiety `satietyRate` coefficient** (below). A node's foes can re-spawn idly
under a **tab-open auto-resolve** loop (the "leave it running, check the progress" feel). **HP accumulates
between fights and is mended only by eating** (§2.3) — there is no auto-heal. **Texture stays
peaceful-labour-dominant by volume**; combat is live and load-bearing. (Interactive, resumable **mid-fight**
intervention — swapping stance or spending an ability/item turn-by-turn — is a **forward-tier (T1/T2) depth
layer**; the T0 spine is atomic auto-resolve.)

- **Graded durability bands.** Weapon `attackPower` is scaled by **4 graded durability bands**
  — **75 %+ / 50 %+ / 1 %+ / 0** of `durabilityMax` → multipliers **1.0 / 0.9 / 0.75 / 0.55** — with
  **FIXED wear per FIGHT** (cheap, replay-stable). A weapon is **NEVER auto-unequipped**: it stays equipped
  and functional even at 0 (the 0.55 floor) — **never weaponless** (auto-battler safety).
  **Armour bands apply identically on `defense`.** Repair / re-craft restores durability to max (§2.10/§2.11).
- **Satiety → combat throttle.** A **`satietyRate` multiplier** scales `attackPower`
  (lighter touch on `attackSpeed`) — **flat above ~0.7** of `satietyMax`, kneeing to a **~0.5 floor** — a
  **SEPARATE combat coefficient** from the labour throttle (§2.3). "**Adequate satiety**" = **≥~0.7**, where
  the **locked 20–35% first-fight win-rate is measured**; the throttle is bounded so the floor only costs a
  few win-rate points (**never below ~15%**).
- **HP accumulates; no auto-heal (the fight keeps its stakes).** A fight is a visible **HP-attrition
  exchange** — you attack, the enemy attacks back, both lose HP until one reaches 0. HP **carries between
  fights and never auto-heals**: the only mend is **eating** (§2.3), so healing is a real pre-fight decision.
  Reaching **0 HP is a lost fight** — it sets **HP → 1**, **bites a real slice of ALL THREE carried
  resources — coin + rice + materials** (D-113; ~20% of carried **coin** + ~⅓ of carried **rice + materials**,
  floored), and **STOPS the autopilot** (no grinding at the floor — you mend by hand and re-engage). **BANKED
  wealth sheltered in the *kura* storehouse is safe** (§2.4) — so banking before a risky fight is the play.
  A loss never costs levels, gear, or Influence (**koku STANDING is immune** — it is a score, not
  carried wealth; §2.16).
- **Two auto-combat modes.** Left running, the auto-resolver fights the foes on the current node under one
  of two per-foe modes: **(1) fight to the end** (grind until you win or die — a loss bites, above), or
  **(2) auto-retreat at ~20% HP** — break off on a **turn** where HP drops below the threshold but is still
  > 0. The check is **per-turn**, so a burst foe that one-shots you past the threshold still **kills** you
  (a killing blow is a loss, not a flee). A flee earns **no reward and no penalty**, but you are hurt and the
  **autopilot stops**. The shown win-rate forecast keeps the to-death odds (retreat off), so the odds you see
  stay honest. (Abandoning a **DEFEND** deed counts as a *failed defend* — a small, recoverable **Arms**
  dent, never a wipe.)

**(c) Rough DATA shape.**
- `Combatant { hp, attackPower, attackSpeed, evasion, defense, critChance, blockChance, statuses[] }`
  — the MC's derived from **attributes + character (combat) level + the equipped weapon's archetype +
  the `skillCombatBonus` aggregate (§2.7.1) + gear**, then scaled by the **durability band** and the
  **`satietyRate`** multiplier.
- `WeaponArchetype { baseSpeed, reach, targetCount, attackProfile, signatureAbilityId }` — **distinct
  combat identity lives on the WEAPON** (per §2.10.1), not on the Stance; **`baseSpeed`, `reach`, and
  `targetCount` are per-weapon.** The crude carrying-pole is a **0th IMPROVISED weapon** (not a line).
- `CombatSim` advances an internal sub-tick accumulator per `attackSpeed`; per swing: hit (attacker
  accuracy vs target evasion) → damage (`attackPower ± seeded variance` minus defense, with a floor; the
  `attackPower` already carries the **durability-band × satietyRate** scaling) → separate seeded crit/block
  rolls → status effects applied per tick. All draws from the **combat RNG cursor** (`cursors.combat`; §2.19)
  — reproducible, unit-testable, **integer-pow only** (no `Math.pow`; §6).
- `Stance { atkMult, takenMult }` — the **glass-cannon ↔ tank** axis, three named stances: **jodan**
  (aggressive — more damage dealt + more taken), **gedan** (defensive — less dealt + less taken), and
  **chudan** (balanced — the identity default). `CombatInterventionIntent`
  (stance/ability/item/retreat). **Weapon `speed`/`reach`/`targetCount` live on the WEAPON archetype, not the
  stance.**
- **A kill writes to `character.level`'s combat-XP ONLY** — *never* the Combat Rank rung-meter, *never* the
  Arms pillar directly (the three tracks are summed independently; §2.8.1). Recognised **deeds** write to
  **Arms** (§2.16); per-rung **curated activities** write to the **Combat Rank rung-meter** (§2.15).
- `CombatEncounterState` — the in-fight working state for **interactive, resumable mid-fight combat**, a
  **forward-tier (T1/T2)** depth layer (not part of the T0 auto-resolve spine).
- `InjuryState { kind, restTicksToHeal }` (the soft-setback model — temporary, recoverable).

**(d) Ties to the four pillars.** **Arms (武威)** — recognized martial deeds (a road declared safe, a
nest cleared, the grain store defended, a rival's enforcer broken) convert to Arms via **achievement
jumps** (per-event capped so no single fight spikes the pillar) + **seasonal security judged results**
(fired on a new high-water mark, **not** repeatable maintenance). **These DEEDS accrue in each tier's
Phase 2 ONLY** (post-final-rung — §2.15.1) — *not* while climbing the rungs. A **lost battle dents
Arms** (small, scripted, recoverable — never a wipe).

**(e) When introduced / fractal reveal — the staggered combat-reveal ladder.**
**T0, R3** — after the **humbling first fight** (a wolf at the grain store), combat opens **incrementally,
one reveal per beat**: **R3** = the drill yard + Combat panel + the **carrying-pole starter weapon** +
Equipment/Inventory + the **Bestiary** + the **bare auto-resolve loop + retreat** (character (combat)
**level** begins). The full staggered order is tabulated at **§2.8.2**. Curated combat activities feed the
**Combat Rank rung-meter** from **R5** (gate-guard); the **Arms PILLAR deeds** do **not** accrue until
**Phase 2** (post-R7; §2.15.1). Combat then interleaves through every per-tier ladder (V2 road-warden, V5
sworn man-at-arms at T2; road-captain / road-security detail at T3), the **2nd combat line opening at T1**
and the **3rd at T2**. Reveals are woven throughout, **never dumped at one Act-close.**

### 2.8.1 The three clean combat tracks

The combat systems feed **three INDEPENDENT, separately-stored tracks** that must **never collapse into one
bar** (reconflating them is the single likeliest regression). What **one kill / one deed / one curated rung
activity** writes makes the distinction concrete:

| Track | Fed by | Writes / scales | Gate role |
|---|---|---|---|
| **Character (combat) level** | kills → **combat-XP** (labour and deeds **never** raise it) | **HP** (`hpMax`), **satietyMax**, **+attribute points** (curves → §4) | personal power; per-mob `MobDef.level` sets on-kill XP (§2.9/§4) |
| **The Arms pillar** (武威) | recognised martial **DEEDS** (a road declared safe; a nest cleared; the grain store defended) | one of the **four House-Influence pillars** (§2.16) | **Phase-2** tier-gate input (the hybrid profile) |
| **The Combat Rank rung-meter** | **per-rung CURATED** combat activities (not raw kills/XP) | the **per-rung-reset martial rung-meter** (§2.15) | **Phase-1** martial rung-gate |

So: **one kill** → character-level combat-XP (only); **one recognised deed** → Arms; **one curated rung
activity** → the Combat Rank meter. Each stream **sums independently** (the verifier asserts no leakage —
§2.20). **"Combat Rank"** is the martial rung-meter; **"Standing"** means the **官威 Standing & Office**
pillar **only**. `character.level` is the only one of the three that scales personal power; the other two
are *standing*/*gate* meters, not power.

### 2.8.2 The combat-reveal ladder (incremental — one reveal per beat)

Combat is a real **incremental progression surface**. The reveals are **staggered, one per beat**, with the
trigger kind noted per step:

| Beat (trigger kind) | What reveals |
|---|---|
| **R3** — combat rung | The **carrying-pole starter weapon** + the **bare auto-resolve loop** + **retreat** + the **Bestiary** (character (combat) **level** begins). Combat stats start near-zero. |
| **R4** — loot→craft loop | **Graded weapon-durability bands** surface with the simple Crafting loop (a weapon degrades but is **never auto-unequipped**; §2.8(b)/§2.10). |
| **R5** — combat rung | The **stance** slot. *(Curated combat activities now feed the **Combat Rank** rung-meter; **Arms PILLAR deeds do NOT accrue yet** — gated to Phase 2.)* |
| **First weapon-line L10 milestone** — weapon-skill milestone | The **ability + item** intervention slots. |
| **T1** — combat rung | The **2nd combat line** (a Combat Rank rung-gate); **+3 weapons across T1.** |
| **T2** — combat rung | The **3rd combat line**; **+4 weapons across T2.** |

Weapon **signature abilities** deepen at higher weapon-line milestones (e.g. **L25 / L50**). The **weapon
roster grows incrementally** alongside (pole + 2 across T0 / +3 T1 / +4 T2; ~9–10 across v1 — §2.10.1). These
feed the **three clean tracks** (§2.8.1), never one fused bar; curves and per-weapon params live in §4.6.

---

## 2.9 Bestiary & mobs (grounded)

**(a) What it is.** A **grounded** bestiary arranged along a **danger gradient** of map nodes
(near-*satoyama* → foothills/charcoal grounds → river/ford → upstream Kuzuhara → high pass) — deeper nodes
hold tougher foes, gated by **conditioning**. **Hard rule: NO belief-creatures live on grindable nodes.**
Grindable mobs are honestly-mundane (**~5 in v1**: wild boar, crop-raiding monkeys, a giant-hornet nest, a
wolf pack *or* rogue bear, bandits/starving deserters). Any "yokai" (kappa, fox-fire fox/tanuki,
yamanba/tengu, the "one-eyed mountain god") is an **INVESTIGATE-then-confront one-shot** that resolves to a
human/animal — **never a respawn population** (surfaced through the optional rumour quests, §2.13).

**(b) Player-facing behaviour / loop.** **Foes LIVE ON NODES** — each enemy is bound to a map node, and you
**walk to its ground to fight it** (the combat "watch" shows only the foes present on the current node). The
bestiary panel fills one entry at a time (discover-by-encounter). Mobs map to quest types (boar → PEST
CONTROL; bear → HUNT; bandit lean-to → CLEAR; raiders → DEFEND). Human mobs (bandits/deserters) introduce
mixed motives and CLEAR/CAPTURE choices with consequences; some are reachable consciences, not pure villains.

**(c) Rough DATA shape.**
- `MobDef { id, kind ('animal'|'insect'|'human'|'wildlife'), level, area (map-node binding), stats
  (Combatant base), lootTableId, isGrindable (true), bestiaryEntryId }` — **isGrindable = honest-
  mundane only.** Each foe is **bound to a node** (`area`): the `fight` intent no-ops off the foe's node, and
  walking away (`move_to`) ends the auto-grind. The explicit per-mob **`level`** field (hand-tunable;
  defaults ~ the node's expected character-level) **feeds the on-kill combat-XP path** (on-kill XP =
  `MobDef.level · COMBAT_XP_K`, §4.6.5) into the character (combat) level (§2.8.1).
- `BeliefBeast { id, rumourQuestId, resolvesToCause (human|animal|natural), oneShot: true }` — kept in
  a **separate registry, `content/beliefBeasts.ts`** (separate from grindable mobs; enforces the
  "no belief-creatures on grindable nodes" rule at the type level).
- Foes are placed on nodes as a **node population** (which foes stand on which node); `foesHere` is the
  location-filtered live set the combat watch reads, while the win-rate CURVE the balance gates read stays
  location-INDEPENDENT.

<!-- gen:begin t0-bestiary (npm run gen:prd-regions — do not edit inside) -->
> **The T0 bestiary, as the build ships it** — GENERATED from `MOBS`
> ([`enemies.ts`](../../../src/core/content/enemies.ts)) by `npm run
> gen:prd-regions`; **do not edit between the markers**. T0-reachable foes
> only — the road bandit is canon-held for T2 (§5) and excluded here (A10);
> per-mob `level` is §4.6 tuning, kept out. Adding or renaming a T0 mob in
> `MOBS` without regenerating turns the `gen-prd-regions` gate RED.
>
> | Foe | 漢字 | Found on |
> |---|---|---|
> | Grain-store wolf | 狼 | kura |
> | Grain-rat swarm | 稲鼠 | gate forecourt |
> | Crop-raiding monkey | 猿 | home paddies |
> | Crop-raiding troop | 猿群 | home paddies |
> | Lean wolf | 狼 | near satoyama |
> | Mamushi (pit viper) | 蝮 | near satoyama |
> | Wild boar | 猪 | deep satoyama |
<!-- gen:end t0-bestiary -->

**(d) Ties to the four pillars.** **Arms** — clearing/securing against mobs is the recognized martial
service that converts to Arms (as **Phase-2 deeds**; §2.8(d)/§2.15.1). Loot also feeds Estate & Wealth
(crafting materials, §2.10/2.11).

**(e) When introduced / fractal reveal.** **T0, R3** (the Bestiary reveals with the Combat panel; the
boar is the first grindable threat after the humbling fight, denned at the deep-*satoyama*). New nodes/mobs
reveal one at a time by conditioning: near-*satoyama* and the grounded estate beasts (T0–T1) →
foothills/charcoal grounds + river, with the **first HUMAN threat — bandits/starving deserters — arriving at
the village** (T2) → high mountains/pass and rōnin (T3). Belief-beast one-shots arrive only via inn rumours
(T2+).

---

## 2.10 Loot, equipment (FIND + CRAFT), gear & inventory

**(a) What it is.** The gear pipeline. **Equipment slots with durability** (weapon, body/*dō*, head,
hands, foot/*waraji*, charm) filled **two ways: FIND** (dropped gear — a dropped *nata*, a
fallen rōnin's worn *kodachi*, a boar-hide vest) **AND CRAFT** (through the component chain — wood →
charcoal → Smith Gonta's forge → spearheads/blades/tools; hides → tanner → armour). **Gear progression**
is a measurable ladder (borrowed carrying-pole + crude hatchet → fitted *yari*, padded jacket,
smith-forged blade), and the **weapon roster GROWS incrementally** (~9–10 across v1; T0 opens at 3 — pole +
2, at least one craftable — then +3 / +4 per tier — §2.10.1). New weapons/styles are **FOUND and CRAFTED,
never gifted.** Plus the **Inventory panel.**

**(b) Player-facing behaviour / loop.** Defeat mobs / work nodes → seeded loot rolls drop materials,
coin, occasional **found gear**. Equip gear into slots (with **graded durability bands** that wear a
**fixed amount per fight** and are repaired/re-crafted). Craft better gear via the component chain (quality
from crafter skill + component quality + station tier, §2.11). Disassembly returns materials. Each gear
tier is a clear power step on the combat track (and tools improve labour yields).

**(c) Rough DATA shape.**
- `EquipDef { id, slot, statMods (attack/defense/etc.), durabilityMax, craftRecipeId?, foundOnly?,
  archetype? (WeaponArchetype: baseSpeed/reach/targetCount/attackProfile + signatureAbilityId, for weapons)
  }` — **weapons carry archetype params + a signature ability** (§2.8(c)/§2.10.1).
- `LootTable { entries: { itemOrMaterialId, weight, qtyRange }[] }` (seeded rolls via the **loot RNG
  cursor**, `cursors.loot`; §2.19).
- `EquipState { slot → { equipDefId, durability, qualityTier } }`; `Inventory: Record<itemId, count>`
  (quality folded into the stack key so quality tiers stack distinctly).
- `Durability { current, max, repairCost }` — read through the **4 graded bands** (75 %+ / 50 %+ / 1 %+ / 0
  → 1.0 / 0.9 / 0.75 / 0.55) on `attackPower` (weapons) / `defense` (armour); **NEVER auto-unequip**;
  repair / re-craft restores to max (§2.8(b), §2.11).

**(d) Ties to the four pillars.** **Arms** (gear enables the deeds that earn Arms). The crafting overlap
(tools, the silk/textile finishing chain) feeds **Estate & Wealth** (and the trade strand, ≤ ⅓ capped).
Gear itself is never a standing source — the *recognized deed* is.

**(e) When introduced / fractal reveal.** **T0, R3** — first crude weapon + **Equipment & Inventory**
panels reveal with the Combat panel. The **loot + craft loop** (Smith Gonta spearheads via the
component chain) comes online at **R4** (trusted hand & houseman) — **graded durability bands reveal here**
with it. Better loot/craft tiers + new weapons unlock per tier and per danger node (worn blades from rōnin
at T3; Hanzaki's worn gear as a late FOUND prize).

### 2.10.1 The weapon roster (incremental, ~9–10 across v1)

**(a) What it is.** A **growing, period-appropriate weapon roster** spanning **3 archetype lines**. **T0
opens with the carrying-pole and grows to 3 weapons** (pole + 2, **at least one craftable**); the roster
grows **+3 at T1** and **+4 at T2** — **~9–10 weapons across v1.** Each weapon is an **archetype** (its
`baseSpeed` / `reach` / `targetCount` / `attackProfile`) **+ a signature ability** — so distinct combat
identity lives on the **weapon**, not on the stance. The crude **carrying-pole is a 0th IMPROVISED weapon**
(the convalescence-era stick), **not a line of its own.**

**(b) How it grows.** New weapons are **FOUND** (drops) and **CRAFTED** (the component chain, §2.11), never
gifted, and reveal **one at a time** on the combat-reveal ladder (§2.8.2). The **2nd archetype line opens at
T1**, the **3rd at T2** (each on a Combat Rank rung-gate). Signature abilities deepen at weapon-line
milestones (L10 unlocks the ability/item slots; richer signatures ~L25/L50).

**(c) Rough DATA shape.**
- `WeaponArchetype { id, line ('1'|'2'|'3'), baseSpeed, reach, targetCount, attackProfile,
  signatureAbilityId, foundOrCrafted }` — the **per-weapon** `baseSpeed`/`reach`/`targetCount` are the
  single source of a weapon's identity (not the stance; §4.6.1/§4.6.2). These params are authored
  **byte-identical** to §4.6 and `content/items.ts` (§6.5).
- A weapon's improvised 0th entry carries a minimal archetype (slow, short, single-target) and **no**
  signature. *(Exact per-weapon numbers → §4.6.)*

<!-- gen:begin t0-weapon-roster (npm run gen:prd-regions — do not edit inside) -->
> **The T0 weapon roster, as the build ships it** — GENERATED from `WEAPONS`
> ([`weapons.ts`](../../../src/core/content/weapons.ts)) by `npm run
> gen:prd-regions`; **do not edit between the markers**. Identity only — the
> per-weapon `baseAttack`/`baseSpeed`/durability tuning lives in §4.6.9 (the
> ripple-frozen provisional numbers, D-021), never here. Adding or renaming a
> weapon in `WEAPONS` without regenerating turns the `gen-prd-regions` gate RED.
>
> | Weapon | 漢字 | Archetype | Note |
> |---|---|---|---|
> | Worn carrying-pole | 天秤棒 | reach · blunt | A porter's shoulder-pole. Not a weapon — but it has reach, and it is what you have. |
> | Woodlot axe | 斧 | heavy · single | A felling axe off the woodlot rack — heavy, slow, and it bites deep. |
> | Forged yari | 槍 | reach · thrust | A spear forged and lashed at the woodlot smithy — a straight ash haft and a keen head. Not a farm tool turned to fighting, but a real weapon, made to a soldier’s pattern. |
<!-- gen:end t0-weapon-roster -->

**(d) Ties to the four pillars.** **Arms** (better weapons → more achievable deeds). Crafted weapons also
exercise the smithing chain that feeds **Estate & Wealth** (tools/trade goods, ≤ ⅓ trade cap).

**(e) When introduced / fractal reveal.** **T0-R3** the carrying-pole; **+2** more across T0 (at least one
craftable); the roster then grows **+3 (T1) / +4 (T2)** across the tier ladders, each weapon a one-at-a-time
reveal beat.

---

## 2.11 Crafting (hybrid: simple → component/quality)

**(a) What it is.** **HYBRID** — **simple recipes early; the component/quality system unlocks
later.** Early crafting is a flat recipe (inputs → output). Later it becomes **component-based**: an item
is built from components, and **quality = crafter skill + component quality + station tier**, with
**processing chains** (wood → charcoal → forge → tools → blades; hides → tanner → armour; cocoons →
silk → woven textile). **Disassembly returns materials.** Crafting is a capability **homed within the
seven-tab IA** (Work · Map · Estate · Inventory · Character · Combat · Quests — **D-119**; crafting stays a
**section of Character**, the exact placement is `ui-design.md`'s call), revealed as its own beat — **not**
its own top-level tab (superseding the earlier per-activity-tab framing).

**(b) Player-facing behaviour / loop.** Early: gather inputs, craft a tool/item at a station (a sickle,
a repaired tool) — simple and legible, gating a small bonus; **repair / re-craft restores a weapon's or
armour's durability to max** (the graded-band system, §2.8(b)/§2.10). Later: choose components of
varying quality and a station tier to influence the output's quality tier; build multi-step chains;
disassemble to recover materials. **Bulk sales of a crafted good apply the saturation damper PROGRESSIVELY
per-unit** (each unit walks the price down; §2.4). The **silk / sericulture *meibutsu*** is the
signature late craft/trade chain (cocoons → reeled silk → woven/graded textile), led by **Weaver Onatsu**,
threading T2→T5 under the trade ≤ ⅓ cap; its trade/coin economics are detailed in §4 (§2.4).

**(c) Rough DATA shape.**
- `RecipeDef { id, mode ('simple'|'component'), inputs[], output, stationTier, skillRequired,
  revealPredicate }`
- `ComponentCraft { componentSlots[], qualityFormula (crafterSkill + componentQuality + stationTier),
  outputQualityTier }` (the *shape*; numbers → §4).
- `StationDef { id, tier, recipesEnabled[] }`; `ChainStep` links processing stages.
- `RepairAction { equipId, restoresDurabilityToMax: true }` (the graded-band restore).
- Quality tier is part of an item's stack key (so a fine *yari* and a crude one don't merge).

**(d) Ties to the four pillars.** **Estate & Wealth** — crafted trade goods (esp. the silk *meibutsu*)
convert to recorded trade/yield within the **TRADE sub-engine (≤ ⅓ of Estate & Wealth)**; proto-industry
levers feed the LAND/TREASURY strands. Crafted **gear** feeds **Arms** (via 2.10). A graded *meibutsu*
later feeds **Name & Honour** (a famous product celebrated up-tier).

**(e) When introduced / fractal reveal.** **T0** — simple crafting (the **Craft section of Character** / first
tool) around R4, with the graded-durability bands. The **component/quality system + processing chains**
unlock at **T1+** (smithing chains, then the silk sub-engine at V3). Each chain arrives minimal (one recipe,
one station) and deepens fractally.

---

## 2.12 Dialogue & quests (open-ended, non-hand-holdy)

**(a) What it is.** The narrative + unlock delivery vehicle, and a core part of the **universal
rewards/unlock bus.** **Dialogue** = textlines that grant a `RewardBundle` and can lock other lines
(branching), gated by `display_conditions` (reputation / rank / season / skills / flags), **with
intra-line BRANCHING in v1.** **Quests** = an **order-free SET of advance-events** (no fixed order, no
`step` cursor) advanced by game events. **Open-ended, NON-hand-holdy** — a quest is **a suggestion + a story
you find out in the world**, never an A→B→C waypoint list; **fewer checklists overall**; the dominant
minute-to-minute behaviour is the **incremental grind.** **No fixed quest-type budget:** **PEST CONTROL,
HUNT, CLEAR, DEFEND** (the deeds-earner) are the **T0 STARTING set**, *not a cap* — author **whatever quest
types fit each stage**, more/interesting welcome especially at later tiers
(escort/patrol/bounty/duel/investigate/etc.).

**Intra-line dialogue branching.** A node carries a **flat `choices[]` list**; picking a
choice applies its effect — `locksLineIds[]` (closes off other lines) and/or `flags` set — and the
conversation branches. It is **DATA, not scripting**, and **deterministic (no RNG)**; **only the chosen
flags persist** (save-light). Authored in **`content/dialogue.ts`**.

**Meeting a character = a full-screen VN scene, with per-NPC memory (D-104).** When the player **first
meets** an NPC who is **story-significant AND interactive** (touches the story, offers **choices**, or has
real discussion), the meeting plays as a **full-screen VN dialogue scene** that **hides the rest of the game
UI** — a kanji ink-seal nameplate (coloured per voice), the NPC's lines revealed with the GBA typewriter,
diegetic choice replies — reinforcing the incremental-reveal signature (the world inks back in **after** the
scene). **The same scene engine frames every player-triggered rung-up beat** (D-110, §1.6.4). Minor /
ambient NPCs (no story weight, no choices) stay **inline in the event log**, never blown up to a scene — the
scene is reserved for characters who matter and can be answered. Each such NPC **independently REMEMBERS how
you treated them** — a durable **`npcMemory`** (per-NPC relationship + story flags) that **persists across
ascension**, distinct from and longer-lived than the save-light per-line flags above.

**Every vendor is a PERSON on a spectrum, not a bare menu (D-114).** A shop is someone you talk to at a map
node's "who's here" list (§2.9 / the Map tab), arranged on an interaction spectrum: **(a) full VN characters**
(a D-104 scene + quests + ongoing dialogue), **(b) small people** (a line or two of dialogue + a trade), and
**(c) tiny traders** (zero questions to ask — talking opens straight into the trade / market menu; a face on
a shop). A vendor may also be **place-gated** — you must **reach or BUILD** the location first (e.g. the
smithery before the smith), so the vendor's shop reveals only when its node is reached/built (reuse the
surface-reveal + estate-build gating). So **a vendor = (person on the spectrum) + (optional place-gate)** — no
shop is a bare inline menu (this reframes the "provisioning shop", §2.4, as a talkable trader). *(The full
presentation of the VN scene + the "who's here" map model are `ui-design.md`'s domain — §2.12 owns the DATA +
the rule.)*

**(b) Player-facing behaviour / loop.** Talk to NPCs (gatekeepers who do double duty as story threads);
lines unlock content, advance flags, and **offer in-line choices** that lock/branch. Take a quest as an
*aim + a rough where* (e.g. "something is in the lower field at night"), then **read the world** to find
the truth (one boar or a sounder? where does it den?) — preparation and approach are the player's. Quest
events drive the unlock graph. The **quest log REGAINS its OWN top-level tab** — **Quests**, the seventh in
the **seven-tab IA** (Work · Map · Estate · Inventory · Character · Combat · Quests — **D-119**, reinstating
**D-037** and superseding **D-112**'s homed-in-Character framing). **Per-tier side-quest lists
never gate the spine** (§1.9).

**(c) Rough DATA shape.**
- `Dialogue/TextLine { id, speaker, text, displayConditions (predicate), rewards: RewardBundle,
  locksLineIds[], choices?: ChoiceId[] }` — `choices[]` carries the intra-line branches.
- `Choice { id (ChoiceId), label, effect: { locksLineIds[]?, flagsSet[]? } }` — **deterministic; only
  chosen flags persist.**
- `NpcMemory: Record<NpcId, { relationship: number; flags: Set<StoryFlagId> }>` — the **durable per-NPC
  memory** (D-104/D-110); each story-NPC independently remembers how you treated them, **persisting across
  ascension** (part of the saved `GameState`, §6.4). A `Vendor { npcId, tier ('vn'|'small'|'tiny'),
  placeGate?: NodeId|BuildId }` binds a shop to its person + optional place-gate (D-114).
- `Quest { id, type ('PEST_CONTROL'|'HUNT'|'CLEAR'|'DEFEND'|…author-as-needed…), suggestionText,
  openEnded: true, advanceEvents[], rewards: RewardBundle, gatesSpine: false (for side-quests),
  repeatable?: boolean, maxAwards?: number }` — **the type union is OPEN** (no parked cap; author
  whatever fits). **Repeatable deeds:** a deed/quest may set `repeatable: true` with a
  `maxAwards: N` ceiling, so the same recognized deed can pay its `RewardBundle` (incl. `pillarDeltas`)
  **up to N times** — the schema that supplies the **great/excellent supra-good surplus** deed-counts per
  pillar/tier (§4.1/§4.2; a non-repeatable deed is the `maxAwards: 1` default).
- **Runtime quest state (§6.4):** `{ status: QuestStatus; advancedBy: Set<QuestEventId> }` where
  `QuestStatus = 'taken' | 'active' | 'abandoned' | 'done' | 'failed'` — **NO `step` cursor;** `advancedBy`
  is the **UNORDERED SET** of advance-events already satisfied (a quest is a SET of advance-events with **no
  fixed order**), completing (`done`) once its required `advanceEvents[]` are all in the set **in any
  order**. Each event may carry `optionalDiscoveryNodes[]` — discovery, not waypoints.

**(d) Ties to the four pillars.** All four, indirectly: quests are *how the player performs the deeds*
that the authorities recognize. **DEFEND** remains the canonical combat **Arms** standing-earner.
Crucially, **a quest/deed plays into one of two tracks by PHASE (§2.15.1):** some completions are the
**per-rung CURATED activities** that feed the **Combat Rank rung-meter in PHASE 1**, while the recognised
**pillar DEEDS** (incl. DEFEND-as-Arms) accrue in **PHASE 2** — never on the rungs. Labour/office
quests feed **Estate & Wealth** / **Standing & Office**; recognition/petition quests feed **Name & Honour**.
The reward bus can carry `pillarDeltas` for recognized completions (achievement jumps, per-event capped) —
applied only in Phase 2.

**(e) When introduced / fractal reveal.** **T0** — dialogue from the open (the guide/steward beats);
the **quest log (top-level tab)** reveals around **R5** (with the pest-control/hunt/clear/defend types;
**curated combat activities begin feeding the Combat Rank rung-meter here** — but the **Arms PILLAR deeds
do not accrue until Phase 2**, post-R7). Quest scope grows per tier (valley-scale at T2, region-scale at T3
with the personal-mystery payoff). New quest types are authored wherever they fit (no budget).

---

## 2.13 Lore, inn rumours & the belief→cause engine

**(a) What it is.** The **light-flavour folklore delivery system.** Folklore is **NOT the spine**; it
arrives as **optional tidbits via the village inn's rumours board** (Innkeeper Sukezō), each a
lightweight yokai story the player **may** investigate. **Hard rules:** every rumour-quest is
**optional** and **NONE gate tier progression**; each unlocks **organically and design-staggered** (per
tier; more unlock as the estate & village grow — never an all-at-once dump); each resolves
**one-to-one to a concrete human/natural cause** with **dawning dread, never a Scooby-Doo unmasking** (the
game lingers in the unease before resolving). **Residual ambiguity is hard-capped at ≤ 1** unresolved,
off-screen, mundane-readable beat — **the unidentified-hand offering at the jizō at the weir/ford** (the
**single co-located find-spot** where he was pulled from the river). Folk-religion texture
distinguishes **Shintō** (shrine, *shimenawa*, soul-calling rite) from **Buddhist** elements (roadside/
boundary *jizō*, Bon offerings, the temple register of the vanished — which becomes hard evidence). **No
rite ever mechanically "works"; nothing is confirmed supernatural; there is never player magic.**

**(b) Player-facing behaviour / loop.** Read the rumours board → optionally pick up a belief-beast
INVESTIGATE-then-confront one-shot (e.g. the "kappa" of the ford = undertow + a snapping turtle/large
catfish, tied to smugglers' sinking-spot; the "fox-fire" ridge = a hidden charcoal kiln; the "one-eyed
mountain god" = Hanzaki + fog-blind terrain). Investigate through ordinary work/travel; the unease
lingers, then resolves to a grounded cause. Also surfaces lore scrolls/registers (temple register, the
household Journal) read at the cost of in-game time. A **belief→cause table** is authored region-wide
before any node with new omens (so the ≤ 1 cap provably holds).

**(c) Rough DATA shape.**
- `Rumour { id, boardText, unlockPredicate (per-tier, organic/design-staggered), linkedBeliefBeastId?,
  optional: true, gatesSpine: false }`
- `BeliefBeast` (in its **separate registry `content/beliefBeasts.ts`** — §2.9) `{ resolvesToCause,
  dread-beats[], oneShot }`.
- `BeliefCauseTableEntry { belief, groundedCause, isResidualAmbiguity: false }` — exactly **one** entry
  game-wide has `isResidualAmbiguity: true` (the **jizō at the weir/ford** — the single find-spot),
  enforced by the content verifier.
- `LoreScroll { id, readCostTicks, unlocks: RewardBundle }`.

**(d) Ties to the four pillars.** **Name & Honour** lightly (a sponsored rite, a respected investigation
can colour the house's name), but folklore **never gates the spine and is never a primary pillar
source.** Most rumour payoff is *feeling, allies, and flavour*, not power.

**(e) When introduced / fractal reveal.** **T2** — the inn & rumours board reveal in the village; the
opener is the "kappa" of the ford. Rumours unlock **organically, design-staggered and per-tier** (more as
the estate/village grow). The residual-ambiguity **jizō at the weir/ford** beat is a T0–T1 boundary node
(the find-spot) that **lingers unresolved** by design.

---

## 2.14 World simulation (seasons / weather / festivals)

**(a) What it is.** The living-world layer on top of the clock (2.2): **seasons** (kanji tags driving
the rice cycle, foraging windows, and the seasonal judged results), **weather hazards** (cold/wet
affecting labour/combat), **lunar phases**, **festivals** (Bon, seasonal rites — social/economic hubs,
e.g. Brewer Tokuemon's festival hub), **vendor restocks**, and **food rotting/fermenting**. Weather hazards
and festivals carry **MECHANICAL effects, bounded ±10%** on labour/combat rates (plus festival economic
beats). **Active-only**, scheduler-driven, deterministic. **Weather and lunar phase are DERIVED** from
the **day-keyed RNG sub-stream** (`deriveDayKeyed`, §2.2/§2.19), **not stored.**

**(b) Player-facing behaviour / loop.** The world changes around the grind: plant/harvest by season;
weather nudges what's worth doing (a **bounded ±10%** rate swing, never a hard block); festivals offer
time-boxed social/economic beats; the **seasonal reckoning** (harvest result, autumn audit, security
appraisal) fires the **judged-result Influence** when a new high-water mark is reached (weather/festivals
modulate that judged result **±10%**; §2.16). Reinforces "the world enlarges as numbers go up." (The
reckoning CADENCE is a per-tier lever, decoupled from the 28-day season calendar — §2.2.)

**Seasonal-reward ROTATION — the 2nd T2 anti-slump lever.** From **T2**, each
season features a **rotating featured deed / bonus** — a per-season highlighted recognized-deed (or an
accrual bonus on a chosen pillar/activity) — that refreshes *what is most rewarding to chase* as the
seasons turn, so the Phase-2 grind never flattens into one optimal loop. It is the **2nd late-game
anti-slump device alongside the cross-pillar combos** (§2.16/§4.3.1). The featured bonus rides the normal
accrual shapes (capped jumps / judged results) — it **never** bypasses the per-event cap, the trade-≤⅓
cap, or the gate-threshold check (it changes *which* deed pays most this season, not the gate maths).

**(c) Rough DATA shape.**
- `SeasonRules { perSeason: { activeNodes[], yieldModifiers, weatherWeights } }`
- `Festival { id, season/day, effects (vendorRestock | socialBeat | reputationOpportunity |
  economicBeat), revealPredicate }`
- `SeasonalRotation { season, featuredDeedId? , accrualBonus? (pillar/activity + bounded magnitude),
  revealTier: 'T2' }` — the per-season featured deed/bonus (the 2nd T2 anti-slump lever; obeys all caps).
- `WeatherHazard { kind, rateModifiers (labour/combat, bounded ±10%) }` (soft, never hard-blocking —
  pairs with 2.3; the **active weather/lunar phase is derived day-keyed, not a stored field**).
- World-sim content (`SeasonRules` / `Festival` / `WeatherHazard`) is authored in **`content/world.ts`**
  (with a **`content/festivals.ts`** row), generated/verified like the other registries.
- Reuses `WorldClock` + `Scheduler` from 2.2.

**(d) Ties to the four pillars.** The **timing/source of the seasonal JUDGED RESULTS for all four
pillars** (harvest → Estate & Wealth; security appraisal → Arms; an inspector's seasonal report → Name &
Honour; an office's seasonal account → Standing & Office), each **modulated ±10% by weather/festivals**.
Always **new-high-water-mark only**, never a repeatable per-season maintenance trickle.

**(e) When introduced / fractal reveal.** **T0** clock first; **T2** brings seasons/weather/festivals to
life (and the village social calendar). Festivals/weather deepen per tier (regional Bon at T3, etc.).

---

## 2.15 Factions & reputation (estate ladder, village web, origin ties, allegiance)

**(a) What it is.** Three starter factions, **deliberately distinct in SHAPE** so they never read as
one bar painted three colours, plus the **Tama-vs-farmhand allegiance**. **More factions/zones bloom per
tier** (the §1.7.1 / world-expansion cut-set; **v1 ships only the three starters + the six cross-cutting
SEEDS** embedded in the starter region — porter's-knot, Sōan/Obaa Kuni, the artisans, the rice-broker,
Ryōa's shrine+register, Magobei/Yagōemon's skim).

- **ESTATE (main) — a fresh rank LADDER per tier, climbed in TWO SEQUENTIAL PHASES (§2.15.1).** The only
  faction structured as a discrete, gated ladder (rising through it *is* the perseverance fantasy and the
  dominant UI-reveal driver). **~8 rungs per tier** (T0 R0→R7, T1 R8→R15, T2 V0→V7, T3 enumerated). **Rungs interleave
  LABOUR and COMBAT**; **combat is first-class from T0** (incremental — the carrying-pole, then a growing roster).
  **Phase 1 (climb the rungs)** is driven by **two earned RUNG-METERS (per-rung progress meters, NOT economy
  currencies): Estate Service** (the labour rung-meter) and **Combat Rank** (the martial rung-meter). Each meter
  is **numeric and PER-RUNG-RESET**, fed by **curated per-rung activities** (a designed one-to-many set, not a
  single repeat-counter), and each rung promotes on an **AND-gate** (the rung-meter ≥ threshold **AND** the
  rung's story milestones — the UI reads "awaiting X" when one side lags). **Phase 2 (grind the house up)** —
  the estate-influence / four-pillar grind — opens **after the final rung**, and the tier's **pillar DEEDS
  accrue there and ONLY there.** **Labour conditioning is a one-way enablement gate** on the combat rungs
  (**ZERO** combat stat / training-rate bonus; the **per-skill perks of §2.7.1 are a separate, small channel**
  — conditioning alone grants zero). The estate cast & buildings **grow per tier** as **flavour / light
  systems** (build/recruit — **NOT** a people-management sim; no labour-gang, no managed sub-economy, no
  assignment panel).
- **VILLAGE of Asagiri (side) — a static reputation WEB.** Continuous, **multi-node** meters (not a
  ladder): per-shop "patron/regular" standing (smith Gonta, dry-goods/rice broker, herbalist **Obaa Kuni**,
  brewer Tokuemon, **weaver Onatsu — lead of the silk *meibutsu***), per-family goodwill (raised by
  **open-ended help**), an artisans'/craft-guild standing, and the **Village Chief's regard** (headman
  Yagōemon — a weighted roll-up). **Gentle curves** (linear/soft-cap) for frequent small dopamine.
  **Cast mostly STATIC.** **Village standing NEVER gates the UI ladder or the tier climb** (ignoring it
  leaves you poorer and lonelier — a viable-but-poorer playstyle, never a wall).
- **ORIGIN (side, memory-gated SUPPORT track) — a ONE-TIER standalone rep ladder (`O0→O5`).** Tahei's
  **living** family/friends in **Sawatari-juku** (mother Oyuki, **father Jinpachi**, sister Okimi, employer
  Denbei, friend Kanta, sweetheart Osen, the porter guild). **Opens at T3-G2** on the **doubly-earned** gate
  (dream-memory **AND** travel-standing); the dream foreshadows it from early game. A **proper one-tier
  reputation side-track with its own short rung ladder** (`O0→O5`, §3.6.2 — kept LIGHT, 6 rungs, never a
  second spine), tracking the MC's standing with his origin community. Payoff = **support, not local power**:
  pride/morale (a modest global skill-XP buff framed as a *present-day relationship*), allies (recruited
  porter mates), trade ties (origin-town goods/routes plugging into expansion, shaving **~10–15%** off
  time-to-next-tier). **Hard guardrail:** **returning MEMORY (the backstory reveal) grants
  ZERO retroactive bonus** — no stat, recipe, tool, or combat bonus; it grants **access** only. But the
  **present-day relationships** you then build **are legitimate mechanics that STAY** (the morale buff + the
  ~10–15% trade-tie speedup are *earned new relationships, not gifts from remembering*). At least one origin
  beat is always available **without** reputation-gating (the thread never stalls); the track **NEVER gates
  the spine**. **Reclaiming the name "Tahei" is the Origin O5 capstone — EARNED and MISSABLE** (a player who
  skips the Origin track may never reclaim it), **separate from** the lost-child **TRUTH** (that he
  is *not* Tama; **Otsuru** is), which stays **spine-guaranteed at G6 for every player** (§5).
- **The Tama-vs-farmhand allegiance** — a **continuous, re-swingable leaning** (village-leaning ↔
  estate-leaning, default neutral, never frozen). **Rebalances rates & flavour, NEVER availability** —
  both factions fully completable on either lean; neutral is a valid in-character stance. **Faction
  tension is light / flavour — no mechanical penalty.**

**(b) Player-facing behaviour / loop.** Climb the estate ladder (the spine) **two phases per tier** — climb
the rungs (Phase 1), then grind the pillars (Phase 2); raise village per-node meters by trade and
open-ended help; restore origin ties as memory + travel-standing allow; nudge the allegiance through
dialogue and where you invest labour. **Separate earned rung-meters + the separate four-pillar grind** keep
the tracks from collapsing into one bar. Above them sits **House Influence** (2.16); village allies and
origin trade-ties act as **multipliers/feeders** (tuned so weaving both in shaves **~10–15%** off time-to-
next-tier — *felt, never a wall; never a new pillar*).

**(c) Rough DATA shape.**
- `EstateLadder { tier, rungs: RankDef[] }`; `RankDef { id, track ('labour'|'combat'|'mixed'|
  'admin-as-narration'), earnedBy (rungMeter ≥ threshold AND storyFlags — an AND-gate), rungActivityTags[]
  (which curated activities advance which rung-meter), unlocks: RewardBundle }`. Two **per-rung-reset**
  meters: `EstateService` (labour) and `CombatRank` (martial) — each numeric, threshold = **(≥30-min floor ×
  that rung's eligible-activity rate)**, back-solved like the coin column so meter and floor stay in lockstep
  (§2.15.1; numbers → §4). **Double-counting across streams is allowed, but each stream sums independently.**
- `VillageWeb { nodes: { shopId|familyId|guildId → meter (gentle curve) }, chiefRegard (rollup) }`.
- `OriginLadder { tier:'T3', rungs: RankDef[] (O0–O5), meter: OriginTies (gentle), prideBuff (global
  skill-XP, present-day-relationship-framed), allies[], tradeTies[], nameReclaimAtO5 (earned + MISSABLE) }`
  — a one-tier standalone rep ladder; every asset still grind-built; never a spine trigger.
- `Allegiance { value (-1 village … +1 estate, default 0), affects: rates+flavour only }`.
- `FactionMultiplier { source (village|origin), influenceSpeedup, budgetShare (apportioned so the
  combined ≈ 10–15% off time-to-next-tier, never exceeded) }`.

**(d) Ties to the four pillars.** The **estate ladder generates Influence directly** (labour → Estate &
Wealth; combat → Arms; offices → Standing & Office; recognition → Name & Honour) — but **only the Phase-2
DEEDS accrue to the pillars** (the Phase-1 rungs feed the rung-meters, not the pillars; §2.15.1). **Village
& origin are multipliers/feeders into the pillars, never new pillars.** The allegiance shifts *gain rates
and flavour*, never which pillars are reachable.

**(e) When introduced / fractal reveal.** **T0** — the **estate-*tutorial*** ladder (R0→R7) and the
rung-meter spine (Phase 1), then the **Estate-pillar grind** (Phase 2 — the single revealed pillar) after
R7. **T1** — the **full estate ladder (R8→R15)** on its two **rung-meters** (Estate Service + Combat Rank,
the AND-gate; **Arms** reveals). **T2** — the village web (one contact/one shop first, then meters fan out)
+ the silk sub-engine (**Office** reveals). **T3** — the origin support track opens at G2 (memory +
travel-standing gated) as its own one-tier rep ladder (`O0→O5`, §3.6.2) and a fresh region estate ladder
(`G0→G7`) mints alongside. Each new faction/zone arrives **minimal** (one contact, one place, one verb) and
unlocks fractally.

### 2.15.1 Sequential per-tier progression — rungs (Phase 1) → pillar grind (Phase 2)

This is the **shared home** for the progression spine that §2.15 and §2.16 both build on (the canonical
conceptual statement is §1.6.4; exact curves/thresholds are §4).

**(a) The two ordered phases.** Each tier is climbed **sequentially**:

- **Phase 1 — climb the rungs (R0→R7 etc.).** Driven by **curated per-rung activities** (a designed
  **one-to-many** set per rung, **NOT** a single repeat-counter) tracked by the **per-rung-reset
  rung-meter** + the rung's **story milestones**. Promotion is an **AND-gate**: `rungMeter ≥ threshold`
  **AND** `storyFlags satisfied` (the UI surfaces "awaiting X" when one side lags). Two rung-meters run
  in parallel: **Estate Service** (labour) and **Combat Rank** (martial). **Pillar DEEDS do NOT accrue here**
  (the structural fix against "half the rungs, maxed deeds").
- **Phase 2 — grind the house up.** The **capstone (final) rung OPENS Phase 2** — the **estate-influence /
  four-pillar grind** — and the tier's **pillar DEEDS accrue here and ONLY there.** Clearing the tier's
  **hybrid good/great/excellent pillar profile** (§2.16) is then what **tiers up.** The capstone confirms
  **Phase 1**; the **Phase-2 hybrid pillar gate is the actual tier-gate**, ANDed with the capstone rung.
  *(The **T0→T1 (R7) capstone now carries a mechanical BRANCH** — a player-facing capstone choice, not a
  bare confirm — **D-121**; its content lives where the R7 capstone is authored.)*

**(b) The rung-meter accrual law.** Both meters are **numeric and PER-RUNG-RESET**; each rung's
threshold = **(≥30-min-per-rung floor × that rung's eligible curated-activity rate)** — **back-solved from
the same ≥30-min floor** the §4.8 pacing model and the §6.6 gate-monotonicity verifier use, so the meter and
the floor stay in lockstep. The **Combat Rank** rung-meter is fed by **per-rung CURATED combat activities,
NOT raw kills/XP** — kills feed the character (combat) level instead (§2.8.1). **`rungActivityTags`**
tag which activities advance which rung; double-counting across streams is allowed, but **each stream sums
independently** (verifier-asserted, §2.20).

**(c) There is NO stored "phase" flag.** The current phase is **derivable from the current rung**
(pre-capstone = Phase 1; post-capstone = Phase 2) — no extra `GameState` field (§6.4).

**(d) Rough DATA shape.**
- `RungMeter { id ('EstateService'|'CombatRank'), value, perRungReset: true, thresholdForRung (back-solved
  ≥30-min floor × rate) }`.
- `RungGate { rungId, rungMeterThreshold, requiredStoryFlags[] }` — the **AND-gate**.
- *(Phase derived: `phaseOf(currentRung) = currentRung === capstone ? 'phase2' : 'phase1'`.)*

---

## 2.16 House Influence — the four pillars (accrual & per-tier gating)

**(a) What it is.** The **macro-resource** — the house's **recognized standing** in the eyes of
progressively wider authorities, and **the one thing the entire UI-reveal is ultimately gated on.** It
is **NOT** coin and **NOT** rice (those are what you spend/grind; Influence is the cumulative score of
what the house has *become*) — and it is **RE-EXPRESSED as the house's koku STANDING** (a kokudaka-like
prestige SCORE: koku **IS** this standing, re-assessed seasonally and at tier jumps, **never spent, never
an income multiplier**; §2.4). It is the **umbrella roll-up of FOUR achievement-driven pillars** grown in
lockstep, each mapping to a distinct protagonist domain:

| Pillar | Kanji | Protagonist domain | Grows on |
|--------|-------|--------------------|----------|
| **Arms** | 武威 *bu-i* | combat / weapon-skills / men-at-arms leadership | recognized martial deeds + seasonal security judged results (new high-water mark) |
| **Estate & Wealth** | 家産 *kasan* | labour / jobs / skills / trades / crafting | three **capped sub-engines** — **LAND** (*shinden* reclamation) / **TREASURY** (debt→solvency→creditworthiness, *goyōkin*) / **TRADE** (routes, broker standing, the silk *meibutsu*) — **TRADE hard-capped to ≤ ⅓ of this pillar** |
| **Standing & Office** | 官威 *kan'i* | jobs-as-offices / administration / quests | offices granted, territory secured, alliances sealed (incl. the **marriage / adoption lever**, 2.16.1 — T4+ parked), rivals eclipsed |
| **Name & Honour** | 家格 *kakaku* | the recognition layer (reflects the other three + deeds/patronage/lineage) | the lord's recognition, off the foreclosure list, a sponsored rite, an inspector's report, a recorded merit-elevation |

**KOKU = the house's assessed STANDING score.** The four-pillar roll-up is **RE-EXPRESSED as a single
kokudaka-like koku figure** — the house's prestige *read*, **never a spendable currency and never an
income multiplier.** It is **RE-ASSESSED** by the seasonal JUDGE (`seasonalJudge`, §2.2) and by a big
**"the assessors arrive"** event at each tier jump, and it **gates ascension / unlocks.** The
**tier→koku ladder** runs T0 (tens) → T1 (~100–1,000) → T2 (~1,000–5,000) → T3 (~5,000–10,000) → **T4 =
10,000 (DAIMYŌ) → ~100,000** → T5 (~100,000–1,000,000+) — bands **PROVISIONAL/liquid** (§4). A **personal
koku STIPEND** appears only from **T4+** (House-only before); **T5** adds a **full parallel Office /
court-rank / favour track** (koku = scale, office = access), and rank milestones grant **visible STATUS
TOKENS** (surname → the two swords → *gōshi* rank) — that **full ladder is T1–T5 planning**, though **T0
already grants exactly ONE home status token** (across R1→R7), shown by the housing status-mirror
(§2.17.1). (ADRs **D-107 / D-108 / D-109 / D-122**.)

**Accrual = two shapes only — never a passive time-trickle, never a flat per-action increment — and ONLY on
the PHASE-2 estate-influence track:** pillar **DEEDS do not accrue while climbing the rungs** (they
are gated **post-final-rung**; §2.15.1), which prevents a "half the rungs, maxed deeds" state.
- **(A) Achievement JUMPS** — a concrete deed **recognized** by the relevant authority (a recorded
  yield, a granted title, a sealed contract, a road declared safe in the books, a won petition).
  **Per-event caps** so no single fight or harvest spikes a pillar.
- **(B) Periodic JUDGED RESULTS** — a season's harvest, an autumn audit, a security appraisal — a judged
  result of accumulated state, fired on a **new high-water mark** (NOT repeatable maintenance awards).
  **Weather and festivals modulate these judged results mechanically, bounded ±10%** (day-keyed; §2.14);
  **bulk sales** apply the **saturation damper PROGRESSIVELY per-unit** (§2.4).

Influence is **up-only**, with a small, scripted, **per-pillar** set of **recoverable DENTS** (a lost
battle dents Arms; a scandal dents Name; a called debt dents Estate) — **small and NEVER a wipe** (no
permanent holding-loss; a failed defence damages/disables a holding *temporarily*, recoverable by
rebuild). **Dent self-heal:** a small **below-high-water seasonal RESTORE** lifts a dented pillar back
toward its untouched high-water mark **WITHOUT advancing the high-water** ("self-heals, never a wipe,
never over-credits").

**Tier gating = the HYBRID good/great/excellent pillar PROFILE.** Tier-up is **not** "one or two pillars
clear a stated threshold". Instead, each tier gates on a **specialisation profile across the pillars
REVEALED by that tier**: you must be **good in ALL revealed pillars · great in 2–3 · excellent in 1–2**
(**NO overflow-substitution** — breadth required, specialisation rewarded). Semantics: **good = the expected
baseline · great = really strong · excellent = above-and-beyond.** The **revealed-pillar set grows one per
tier on the reveal ramp 1→2→3→4→4** — **T0 = 1** (Estate alone — the profile **collapses to a
single pillar**: EXCELLENT in Estate), **T1 = 2** (+ Arms; the **2-pillar case**: good in both, **one**
excellent), **T2 = 3** (+ Office), **T3 = 4** (+ Name), **T4/T5 = 4** (deepen the four — no new pillar) —
and the gate is **only ever checked against revealed pillars** (never
"good in ALL" against an unrevealed one). The required pillars still **drift** as they reveal (early tiers
lean Estate then Arms, "survive and get strong"; upper tiers lean Office + Name, "win it socially"). The
**per-pillar-per-tier threshold set** is **back-solved against the fixed §4 deed inventory** — so exact
numbers are in §4. The hybrid profile sits in **Phase 2** and is **ANDed with the capstone rung-meter +
story** (§2.15.1). The **only structural cap is trade ≤ ⅓ of Estate & Wealth** (so trade can never carry a
gate). **Plus a per-tier transition STORY GATE** (see table).

| Tier | Transition story gate (entry) | Phase-2 pillar profile (good/great/excellent) |
|------|-------------------------------|-----------------------------------------------|
| **T0 Estate-*tutorial*** | *(met at the open)* survive convalescence + first labour | **1-pillar** (revealed: **Estate** alone — the gate **collapses to EXCELLENT in Estate**): the humbling first fight is survived as an *activity* (**Arms deeds don't bank yet** — Phase 2 from T1); first *shinden* begun; *kura* stabilising — the **LINEAR rice/coin taste**; **no trade engine** (the personal provisioning shop is the coin sink). |
| **T1 Estate-*full*** | **tutorial cleared** → the **first ascension lands BIG**; the full estate ladder (R8→R15) opens | Revealed: Estate **+ Arms** (the **2-pillar case**: **good in both, one excellent**) — the real estate grind; **Arms deeds now bank**; **E1→E2** + the first paid retinue; the coin/rice flywheel **branches into LAND/TREASURY/TRADE** (trade ≤⅓). |
| **T2 Village** | enough estate work + **basic repairs** → sent into the village | Revealed: Estate + Arms + **Office**. **Good in all three**, **great in 2** (errand-authority; headman's regard; cash-crops + the village silk market online). |
| **T3 Region** | **"clean your room"** (estate healthy, village happy, fires out) → grow regional influence; the rival-house contest climaxes | Revealed: Estate + Arms + Office (+ **Name** surfacing → 4). **Estate + Office great/excellent, Arms good**; the **personal-mystery payoff** lands here. **v1 ends here** (`outcome: t3done`). |
| **T4 Castle-town** *(stub in v1)* | **win the region** → the castle-town rulers confer regional leadership + **invite the house in** (the **castle-town / Daikan's-Office first-contact** beat) | **Office + Name excellent** (won socially); Arms/Estate as leverage. |
| **T5 Edo** *(roadmap)* | a **"taste of Edo"** — staff & run the *domain's* Edo establishment (the *rusui-yaku* under the daimyō's *sankin-kōtai*, never its own) → grow influence | **Name + Office excellent** (the national *banzuke* on all four pillars). |

**Cross-pillar combos — the T2 anti-slump.** From T2, **broader cross-pillar combos** (multiple pillar
pairs, larger magnitude) join the **seasonal-reward rotation** (§2.14) as the late-game anti-slump device.
**A combo credits BOTH pillars of its pair** (never a phantom "third" Name pillar). Combos are **computed
AFTER the trade-≤⅓ clamp** and counted **inside** the deeds budget + per-event cap, **but they do NOT write
the additive deed-only `gateEligibleValue` accumulator** — so they are **EXCLUDED from the gate-threshold
check** (a combo can **NEVER** substitute for being "good in ALL revealed pillars") **and EXCLUDED from the
trade ratio / ≤⅓ denominator.** The **§6.6 verifier proves a combo can never breach the ⅓ trade cap nor
satisfy a required gate band** (a narrow, no-leakage §4.3 exception). Trade ≤ ⅓ stays a **HARD** structural
cap.

**(b) Player-facing behaviour / loop.** Perform recognized **Phase-2** deeds → watch the relevant pillar
JUMP (capped) or rise on the seasonal appraisal → clear the tier's **hybrid good/great/excellent profile
over its revealed pillars** **and** the capstone rung + story gate → the next tier's canvas opens (no
reset). The **standing panel** makes the active pillars legible once revealed — **the not-yet-revealed
pillars show as locked, unnamed silhouettes**; **each bar shows DISTANCE-TO-NEXT-GATE**. **The breadth gate
stays HARD — no substitution, no overflow** — but the **per-pillar shortfall is surfaced EARLY +
CONTINUOUSLY from early Phase 2** (the lagging pillar reads plainly, e.g. *"Name is behind"*), so a breadth
shortfall is **never an end-of-Phase-2 surprise**. Number-flash uses the §2.21 gain/loss tokens (**gain =
`--ai`, loss = `--beni`**; vermilion reserved for rank-up / seal beats). Side factions visibly speed the
climb (multipliers) without changing what's reachable.

**(c) Rough DATA shape.**
- `Influence { arms, estateWealth (subEngines: { land, treasury, trade(≤⅓ cap enforced) }), office,
  name }` — kept separate from `resources` (2.4). **Per-strand high-water marks** live under
  `estateWealth.subEngines` (for the trade-≤⅓ clamp + the dent-restore branch). **The Estate & Wealth
  pillar value is PURELY DERIVED — `land + treasury + trade` summed on read, NEVER a stored aggregate
  field** (so a dent on one strand can never desync the roll-up and trade-≤⅓ holds by construction —
  cross-ref §6.4).
- `PillarState { value, highWater, judged }` per pillar — the judge folds one day at a time and fires a
  judged result only on a **new high-water mark** (§2.2).
- **`kokuStanding` is a DERIVED read** over the four-pillar roll-up (a kokudaka-like score, read-only —
  like the banzuke rank, §2.18), **never a stored field, never spent, never in `resources`** (§2.4). The
  seasonal JUDGE re-assesses it; the personal koku **stipend** (T4+) and the T5 **office track** hang off
  it (D-107/D-109).
- `AccrualEvent { kind ('jump'|'judged'), pillar, sourceDeedId, amount (capped), highWaterMarkCheck,
  phase: 'phase2' (deeds only ever accrue in Phase 2) }` — **deeds also write the additive deed-only
  `gateEligibleValue` accumulator per pillar (the value the gate-band check reads); combos do NOT.**
- `Dent { pillar, amount (small), scriptedSourceId, recoverable: true, seasonalRestoreBelowHighWater: true
  }` (restore lifts toward — never past — the untouched high-water).
- `TierGate { tier, revealedPillars[], pillarBands: Record<pillar, { good, great, excellent } thresholds>,
  distributionPredicate (good in ALL revealed · great in 2–3 · excellent in 1–2; NO overflow),
  capstoneRungAnd (the Phase-1 capstone rung + story), storyGateFlag }` — **the hybrid distribution is the
  gate; there is no floor/overflow field.**
- `CrossPillarCombo { pillarPair, magnitude, creditsBothPillars: true, computedPostTradeClamp:
  true, writesGateEligibleValue: false, excludedFromGateCheck: true, excludedFromTradeRatio: true }`.
- `TradeCap { tradeStrand ≤ ⅓ * estateWealthTotal }` (structural invariant, verifier-checked — combos
  cannot breach it).
- *(All thresholds/caps/weights/formulae → §4.)*

**(d) Ties to the four pillars.** This **IS** the four-pillar system — the macro roll-up everything else
feeds. Every other system's **Phase-2** deeds funnel here through the accrual shapes (A)/(B).

**(e) When introduced / fractal reveal.** Pillars accrue from **Phase-2** deeds, but the **standing panel —
the active Estate bar plus locked, unnamed silhouettes — becomes visible/tracked at T0-R7** (the capstone
that opens Phase 2), so the player first *climbs the rungs*, then *grinds and sees* the standing they build.
The **revealed-pillar set grows per tier** (T0 = Estate alone → T1 + Arms → T2 + Office → T3 + Name) — the
panel's bars reveal **one at a time** in step with §3's reveal schedule (no "good in ALL" check against an
unrevealed pillar). The **hybrid Phase-2 profile + capstone rung + story gate** pace the whole climb
(T0→T5); v1 reaches the **T3** gate (T4 stub, T5 roadmap).

### 2.16.1 Marriage / adoption-into-higher-status (T4+ parked alliance/status lever)

**(a) What it is.** A **late-game (T4/T5) alliance/status lever**: a **marriage**
or **adoption-into-higher-status** match that lifts **Standing & Office** + **Name & Honour** and serves
as one of the **castle-town takeover routes** (the "office / economy / **marriage** / out-maneuvering
rivals" set). It is a **real, lean** strategic move — **explicitly NOT a relationship / people-management
sim** (no courtship minigame, no spouse/heir-management screen, no dating mechanics): it is a brokered
alliance that, once secured, emits a one-time **Name & Honour + Standing & Office** jump and unlocks
takeover leverage. Brokered diegetically via the go-between (e.g. T4's Omiya-no-Sahei, §5.T4.5).

**(b) Player-facing behaviour / loop.** *(T4+ only — not in v1.)* At castle-town scale, a brokered match
becomes available as a discrete alliance deed: meet its standing prerequisites → secure it through the
go-between → it lands as a capped achievement jump into the two upper pillars and opens a takeover route
against the rivals (an alternative to pure office/economy/martial paths).

**(c) Rough DATA shape (one line).**
- `AllianceLever { id, kind ('marriage'|'adoption'), prerequisitePillars (Standing/Name thresholds),
  pillarJump ({ office, name } capped), takeoverRouteUnlocked, brokeredByNpcId }` — **T4+ parked (not in v1).**

**(d) Ties to the four pillars.** **Standing & Office** + **Name & Honour** (a one-time, capped achievement
jump into both); never Arms/Estate, never a recurring trickle.

**(e) When introduced / fractal reveal.** **T4+ parked (not in v1)** — the lever matures in the **T4**
castle-town arc (§5.T4.2/§5.T4.5) and pays an optional callback at **T5**; v1 (**T0–T3**) does **not** surface it.

---

## 2.17 Estate growth (build / recruit = FLAVOUR, not a sim)

**(a) What it is.** The estate as a **persistent, visibly-mutating place** that grows per tier — an
economic fabric (kura → granary → workshops → …) and a martial fabric (rusty door-bar → cleared drill
yard → low palisade → men-at-arms rota → …). Building structures and recruiting a small named
retinue are **FLAVOUR / LIGHT systems wired to the reveal bus — NOT a people-management sim** (no
labour-gang to assign, no managed sub-economy, no assignment/management panel; **martial scale
hard-capped** — a small named retinue + temporary corvée/levies for crises, **never a standing army**).
**v1 covers condition stages E0–E3** (E0 Foreclosure's Edge → E1 Stabilising → E2 Recovering → **E3
Prosperous / Recovering+**); **E4–E5 parked.**

**(b) Player-facing behaviour / loop.** Spend coin / materials / labour (sometimes a martial
prerequisite like "roads cleared") to raise the next structure — every build a **diegetic beat** ("the
frame is raised"), never silent menu inflation. Recruit/secondment adds **light roster cards** (role +
one-line hook + a data-driven contribution slotting into existing idle-producer/garrison systems). The
estate's physical growth runs **ahead** of top personal rank (buildings gate on the relevant **pillars**
— primarily **Estate & Wealth**, plus **Arms** for defensive works — **plus a LOW rank floor + cost, not
the capstone**). **The estate builds E1/E2/E3 are PHASE-2 content/beats per tier** — they land in
**each tier's Phase 2**, where the pillar-Influence floors that gate them are reachable (§2.15.1), **NOT
Phase-1 rung content** (the builds become Phase-2 reveals that keep the back half alive — §4.7.5/§3.x). The
minute-to-minute texture stays **labour + combat grind**, not estate micromanagement (guards against
city-builder/4X drift). **E3 "Prosperous" is authored as a coin/Arms sink folded into the G-rungs** (build
/ authoring cost only — the play-time budget is a **FLOOR**).

**(c) Rough DATA shape.**
- `EstateStage { id (E0…E3 in v1 — the narrative CONDITION ladder), econFabric[], martialFabric[],
  rosterCards[], pillarFloor, rankFloor (LOW) }`
- `BuildableStructure { id, costs (coin/materials/labour), martialPrereq?, pillarFloor, rankFloor,
  revealBeatId, contributesTo (idleProducerSlot|garrisonStrength|stationTier) }` — the coin PURCHASE
  upgrades (the flywheel "kura-works", `U1–U4`) are a distinct axis from the E# condition stage (§6).
- `RosterMember { id, role, hookLine, contributionSlot, firstAppearsTier }` — **light card by default**;
  only a few get full arcs (existing cast reused: village artisans seconded, origin friends recruited).
- **No** `assignmentPanel` / `labourGang` types (their absence is the guard).

**(d) Ties to the four pillars.** **Estate & Wealth** (economic fabric → recorded yields) and **Arms**
(martial fabric → defensive works / men-at-arms readiness, feeding security appraisals). Buildings are
*enablers/displays* of standing; the pillar value comes from the recognized output, not the structure.

**(e) When introduced / fractal reveal.** **T0** — E0 at the open (leaning gate, cracked *kura*, fallow
paddies, rusty door-bar); E1 (kura patched, first *shinden*, drill yard cleared, gate night-watch) and
E2 (granary, two workshops, low palisade, 2–3 men-at-arms on a rota) build across T0→T1; **E3 Prosperous /
Recovering+** (a third workshop + full granary, the palisade closed into a proper perimeter, a standing
4–5-man rota, the *shinden* reclamation paying out — the house visibly **back on its feet**) is authored in
v1 (folded into the G-rungs). Each structure reveals fractally (a drill yard = one post → a rack →
sparring slots). **E4–E5 parked** for post-v1.

### 2.17.1 Housing — the personal home, belongings & comfort (DEEP; D-111)

**(a) What it is.** The protagonist's **own home** — a DISTINCT system from the estate fabric (§2.17): the
estate is the *house's* economic/martial shell (no-sim flavour); **housing is the MC's personal quarters, and
it is DEEP.** It has three parts: (1) a **furnishable home that grows with the player's rung** — the cold
open's **dry corner → your quarters → the inner rooms**; (2) a **belongings inventory** distinct from
resources and equipment (the **bowl** Genemon promises, a robe, a keepsake — things you *own and keep*),
homed in the **Inventory tab** (§2.10 / D-119); and (3) **furniture + belongings that carry comfort bonuses
with set/synergy.** The register is **PRESTIGE OVER POWER — NOT RPG stat-gear** and **never a combat power
lane**: it is the domestic half of the "look how far you've come" fantasy. This system exists to cash T0's
sharpest narrative-coherence debt — the home the story *names* three times (the promised corner, the bowl,
"a place here is yours") now mechanically **exists** (F89; the narrative-coherence brainstorm).

**(b) Player-facing behaviour / loop.** Spend **coin** (+ materials) to furnish and upgrade your quarters —
every acquisition a **diegetic beat**, never silent menu inflation. Bonuses are **Edo-flavoured COMFORT**,
and comfort is **ONLY three things: better rest recovery** (feeds the §2.3 satiety/rest loop), **satiety**,
and **storage** — plus **set/synergy** bonuses when belongings complement each other. **There is NO morale
and NO upkeep system** (**D-120**): housing comfort never becomes a chore-meter to feed. Two furnishings
carry real VERBS / capacity, not stats: the **HEARTH homes the COOK verb** — `cook_meal` happens at the
hearth (the domestic anchor of the §2.3 satiety loop) — and the **chest / *nagamochi* is REAL STORAGE**, a
belongings buffer / capacity you actually fill, not a number. **PLUS** the home is a **VISIBLE STATUS-MIRROR
of your rise**: it physically *shows* the climb — and in **T0 it shows exactly ONE home status token** (the
**surname**), **not** the full ladder; the **surname → two swords on the wall → *gōshi*** ladder is **T1–T5
planning** (**D-122**; the same D-109 status tokens the economy grants, §2.16). Home tiers **ride the rung
ladder**, so a home upgrade is one of the rewards a **rung-up beat** (D-110) can motivate. The status-mirror
layer makes every "you're more than a servant now" rung *shown*, not just titled.

**(c) Rough DATA shape.**
- `HomeStage { id, rungFloor, rooms[], revealBeatId }` — the personal-quarters ladder (dry corner → quarters
  → inner rooms), gated on **rung**, distinct from `EstateStage` (§2.17).
- `Belonging { id, name, kind ('furniture'|'keepsake'|'robe'|…), comfortBonus (restRecovery|satiety|storage),
  setId?, coinCost }` — owned items, **kept in the Inventory tab**, separate from `ResourceDef` (§2.4) and
  equipment (§2.10). `setId` drives set/synergy bonuses. **No `morale` / `upkeep` field** — those systems
  do not exist (**D-120**). The **HEARTH** furnishing **homes the `cook_meal` verb** (§2.3), and the
  **chest / *nagamochi*** is a **storage-capacity buffer**, not a comfort stat.
- `HomeState { stageId, ownedBelongings: Set<BelongingId>, comfort: derived }` — **comfort is DERIVED** from
  the owned set + stage (never a stored aggregate), and feeds §2.3 (rest + satiety) / storage; the
  status-mirror read is derived from the D-109 status tokens (§2.16), **never** a pillar or combat stat —
  and in **T0 it resolves to exactly ONE token** (the surname; the full ladder is T1–T5, **D-122**).

**(d) Ties to the four pillars.** **Indirect and prestige-only.** Housing feeds **NO pillar directly and NO
combat stat** — that separation is the guardrail that keeps the home from becoming a power lane competing with
gear. Its comfort bonuses ease the *loop* (**rest, satiety, storage** — **no upkeep**, D-120); its
status-mirror **reflects** the standing the pillars already earned (via the D-109 tokens) — **one token in
T0** (D-122) — never generating standing itself.

**(e) When introduced / fractal reveal.** **T0** — the **dry corner** at the cold open becomes a real
rest-place at **R1** (the "sleeping-place"); the first belongings (the bowl) and the first comfort furniture
land across the T0 rungs; **your own quarters** open as the MC's standing rises, the **inner rooms** later.
The belongings inventory reveals with the **Inventory tab** (D-119). A new home panel is a new UI surface, so
it runs a **D-075 diverge** pass. Furniture/belongings deepen per tier alongside the estate stages (§2.17),
staying **comfort + prestige** throughout.

---

## 2.18 The national *banzuke* / per-tier ranking

**(a) What it is.** The endgame's legible win-display and a per-tier motif: a **ranking of the HOUSE**
(not the man) on all four pillars. **Per-tier rank ladders also rank the house at each tier** (a domain
*banzuke* precedes the national one). The **T5 Edo climax** is a **national multi-pillar *banzuke***.
**LOCKED presentation:** a **popular *mitate* / parody broadsheet** (woodblock, not an official register)
using **sumo-rank vocabulary** — **Maegashira / Komusubi** for the house's attainable band; **Ōzeki /
Yokozuna** for the **structurally sealed top** (the wall the truly powerful built, made the chart's
literal geometry). Honours the **indirect/mediated ceiling**: the house ranks; the MC's personal ceiling
stays **chief steward / *yōnin*** (no *hatamoto* / shogunal audience).

**(b) Player-facing behaviour / loop.** As pillars rise, the house climbs the chart from unranked toward
the attainable band; the top slots remain visibly out of reach (the honest ceiling). A domain *banzuke*
gives each tier a "where do we stand" read; the national chart is the T5 payoff. **One authored ending**
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
(T0-R7 onward, deepening each tier). The **national *banzuke* is the T5 (roadmap) payoff** (v1 stops at
T3 with T4 stubbed). It arrives as a single broadsheet artifact first (the chart that omits you), then
the house climbs it.

---

## 2.19 Save / load (MULTI-BACKEND redundant + export/import)

**(a) What it is.** Persistence: **a MULTI-BACKEND redundant save layer** — **IndexedDB (primary) +
localStorage + sessionStorage** — written **ATOMICALLY** (one `put`, never clear-then-rewrite), plus
**base64 export/import to file**. On save, write **all available backends**; on load, **read ALL backends
and pick the NEWEST** by a **monotonic SAVE-COUNTER** (the real selector) with a **save-layer timestamp
tiebreaker** (a **documented core-lint exemption** — metadata, NOT game logic; the deterministic core stays
clock-free). Each save carries an **app-identity MAGIC field** (`app: 'kami-kakushi'`). The schema is
**BACKWARDS-COMPATIBLE / ADDITIVE** (new fields optional with defaults, never removed/repurposed), with
**raw-backup + rollback + a forward-version guard** as the safety net. **Versioned MINIMAL-STATE**
(recompute derived on load); **the seeded RNG (`{seed, cursors}`) persisted.**

**(b) Player-facing behaviour / loop.** The game autosaves transparently across the redundant backends; the
player can export a save to a text file and import it back (portability / backup). On load, the newest valid
backend wins (counter, then timestamp); derived stats are recomputed (so a bug in derivation never corrupts
the save). On any rejection a **calm "couldn't save — export a backup" notice** appears (never a scary "save
is dead" wall). **Explicit CONFIRM on destructive / genuinely-unrecoverable actions** — import / fresh-start,
plus the rare no-respec attribute allocation, rare-material consume, and narrative-route choices — with an
**auto pre-overwrite snapshot.** Because **`Math.pow` is banned in core (integer-pow; §6)**, exported
saves **replay byte-identically cross-engine.**

**(c) Rough DATA shape.**
- **Persist ONLY non-derivable state:** `{ schemaVersion, app:'kami-kakushi' (magic), saveCounter
  (monotonic), savedAtTimestamp (tiebreaker only), rng: { seed, cursors: { combat, loot, seasonal,
  worldgen } }, worldClock: { tick, day, season, year } (weather/lunar DERIVED, NOT stored), total_xp per
  skill, character.level + xp (the combat-fed track), skill perks unlocked, attributePoints,
  unlock/finished/story flags, chosen dialogue-flags, inventory counts (with quality keys), equip state +
  durability, kill/clear/deed counts, current location, reputation/meters (EstateService, CombatRank,
  VillageWeb, OriginTies, Allegiance), Influence pillar values + subEngines{land,treasury,trade} + dents +
  per-pillar/per-strand high-water marks, quest/task status, active-effect remainders, carried resources +
  banked storehouse, estate condition stage (E0…E3) + built kura-works (U#) + roster, market-saturation
  state (the ONLY world-sim thing persisted) }`.
- **Recompute on load:** attributes, derived combat stats, production rates, what's unlocked, banzuke
  rank, **weather/lunar (`deriveDayKeyed`)**, and the current **phase** (derived from the current rung).
- The schema is **additive**: forward-tier fields (e.g. `CombatEncounterState` for interactive combat,
  §2.8) and later sub-engines arrive as optional fields with defaults, never pre-declared or removed.
- `MigrationStep { fromVersion, toVersion, transform }` (ordered; rare, given the additive schema).

**(d) Ties to the four pillars.** Persists the `Influence` pillar values, sub-engines, dents, and
per-strand high-water marks so the up-only macro-progress is durable (and the never-a-wipe rule survives
reloads), across all redundant backends.

**(e) When introduced / fractal reveal.** **T0 (built FULL)** — the multi-backend redundant save +
newest-wins arbitration + magic field + additive schema ship from the first build. Hardened as new state
is added.

### 2.19.1 The multi-backend save layer

**(a) Backend abstraction.** A `SaveBackend` interface over **IndexedDB (primary) + localStorage +
sessionStorage**; each implements `read()` / `write(blob)` / `available()`. The save service writes to **all
available** backends (best-effort, **atomic single put** per backend — never clear-then-rewrite) and reads
**all** on load.

**(b) Newest-wins arbitration.** The selector picks the candidate with the **highest monotonic
`saveCounter`** (the **real** newest-wins selector); the **`savedAtTimestamp` is only a tiebreaker** when
counters are equal — and it is the **one documented core-lint exemption** (a save-layer metadata clock, NOT
game logic, so the deterministic core remains clock-free). The **`app` magic field** must equal
`'kami-kakushi'`; a bad/foreign id → **reject-to-recovery**.

**(c) Forward-version & integrity guard.** **Never load a forward-version backend** — fall through to the
newest *readable* one, then **reject-to-recovery** with a calm export-a-backup notice. Keep the **raw-backup
+ rollback** safety net. The **additive, backwards-compatible schema** (protobuf/thrift-style: new fields
optional with defaults; never remove/repurpose) keeps migrations rare.

**(d) Resilience target.** Survives the **itch.io cross-origin-iframe** partition / eviction (a backend may
be wiped or read-only in the iframe sandbox) — redundancy across three backends + export/import is the
hedge.

**(e) Rough DATA shape.**
- `SaveBackend { id ('idb'|'local'|'session'), read(): Blob?, write(blob): ok, available(): bool }`.
- `SaveEnvelope { app:'kami-kakushi', schemaVersion, saveCounter, savedAtTimestamp, payload }`.
- `selectNewest(candidates) → max by saveCounter, then savedAtTimestamp` (the lint-exempt tiebreaker).

---

## 2.20 The DEV play API + content verifier

**(a) What it is.** Two QA systems. **The DEV-only play API** (`window.__qa`, stripped from production
via the build's DEV flag): read state, drive the game's verbs (the same typed intents the UI dispatches),
loop control (`tick`/`step`/`frames(n,ms)`, `pause`/`resume`), `new`/`load`/`save`, and **force-state
helpers** (jump to a late unlock / rare outcome / terminal screen). Expose a DEV-only play API
on `window` so the game can be driven and observed headlessly (used by the `capture-game-states` skill).
**The content verifier** (`Verify_Game_Objects` equivalent) cross-checks all ids/refs across registries at
test time, and **balance/content docs are GENERATED** from the same data the game runs (`npm run gen:docs`
→ **`docs/balance/`** + **`docs/content/`**; duplicated derived values are tagged "illustrative — see
generated"; the `content/world.ts` world-sim registry is generated/verified like the others).

**(b) Player-facing behaviour / loop.** None (developer-facing). Powers **headless regression tests**:
force EstateService / **CombatRank** / character (combat) level / Influence / a story flag, fast-forward,
and assert **each reveal fires at the intended `GameState`**, that **pacing milestones hit on schedule**,
and the invariants below. **Verifier checks (§6.6):**
- **Gate-monotonicity & ceiling** — no rung needs more than its tier can grant; rung-meter thresholds tie
  out against the shared **≥30-min floor** (§2.15.1/§4.8).
- **Accrual tie-out** — the Phase-2 deeds sum to each pillar's gate share within tolerance (the fixed deed
  inventory backs the hybrid bands).
- **Each combat track sums INDEPENDENTLY** — kills→character level, deeds→Arms, curated activities→Combat
  Rank meter; no cross-leakage (the three-track invariant, §2.8.1).
- **Per-skill-perk magnitude** — assert **each per-skill perk is SMALL-magnitude** (not zero, not a single
  global ≤CAP), **with conditioning still asserted == 0** (the zero-stat enablement exception).
- **Trade-can-never-breach-⅓-via-combo** — a cross-pillar combo (computed post-clamp, excluded from the
  gate-check) can never push the trade strand over ⅓ of Estate & Wealth, nor satisfy a required pillar
  (§2.16).
- **Belief→cause ≤ 1 ambiguity** — exactly one game-wide residual-ambiguity token (the jizō at the weir/
  ford; §2.13).
- **No system ever wipes Influence/holdings** (dents are recoverable; the seasonal restore never advances
  the high-water).
- **Real-name DENYLIST lint** — fictionalised-names guard (Toyama/Konoe and Mago/Naozane/Obaa Sato renamed;
  the retired Yagyū/Edogawa echoes **Munenori/Jūbei/Ranpo** likewise denied (→ Shigemasa/Kihei/Sōan);
  Nihonbashi allow-listed).
- **`Math.pow`/`exp`/`log`/trig lint** (§6.1) — banned in core (integer-pow; **`sqrt` whitelisted**).

**(c) Rough DATA shape.**
- `QaApi { state(), drive(intent), tick/step/frames, pause/resume, new/load/save, force(partialState) }`.
- `VerifyReport { danglingRefs[], unreachableReveals[], capViolations[], gateMonotonicityViolations[],
  accrualTieOutDeltas[], trackLeakageViolations[], perkMagnitudeViolations[], tradeComboViolations[],
  hiddenEdgeViolations[], realNameDenylistHits[], mathPowLintHits[], ambiguityCount }`.
- `gen:docs` reads `core/content` registries → writes balance/content tables into `docs/balance/` +
  `docs/content/`.

**(d) Ties to the four pillars.** Indirect: it **regression-tests the pillar accrual rules** (caps,
high-water-mark gating, dents-not-wipes, the hybrid gate, trade ≤ ⅓ even via combos) so the four-pillar
invariants can't silently break.

**(e) When introduced / fractal reveal.** **T0**, grows every milestone. Developer
infrastructure, present from early build; the verifier invariants land as their systems do (§6.6/§7).

---

## 2.21 Accessibility, audio & presentation register

**(a) What it is.** Cross-cutting presentation. **Art register: TEXT + EMOJI + CSS + a small curated asset
set.** Woodblock palette; kanji season tags; colour-coded rarities; CSS flourishes; a small canvas only for
optional ambient FX, never logic. **Load-bearing period motifs** (pillar / season / rarity marks) are
**INLINE SVG** (consistent across OSes); **emoji are COSMETIC-only.** **Audio:** a **small curated set**
mixing **synthesized Web Audio + original/CC0 samples** (light ambient beds + UI/event SFX), with a **mute
toggle** and surfaced licensing/credits (§2.21.1). **Fonts: self-hosted OFL fonts** (kill Google dynamic-
subsetting — it breaks offline + the itch relative-base; bundle the OFL license; clear the Reserved-Font-Name
rule). **Accessibility:** solid basics — scalable text, colourblind-safe cues, keyboard + touch, pause;
**responsive desktop + mobile, NOT hover-dependent** (Shift-for-detail is an *extra* layer, not the only way
to read info); plus the correctness items in (b)/(c).

**(b) Player-facing behaviour / loop.** A legible, text-first interface that scales and reflows for
mobile; colour cues backed by text/shape (never colour-only); full keyboard and touch operation; a pause;
ambient seasonal audio with a mute toggle. One carefully-tuned **difficulty** (no modes). **A11y
correctness:** a **persistent quiet a11y entry point from minute one**; an **ARIA live-region
scoped to narration + milestone** ("polite"); a **large-textScale reflow case** + a **screen-reader
acceptance pass**. **Identity HUES are FILLS / ACCENTS only** — woodblock identity lives in chrome (fills,
bars, pips, borders), **never as the sole carrier of meaning**; **ALL meaning-bearing TEXT renders in
AA-passing ink (`--ink-soft`, contrast ratio ~7.3)** on the paper surfaces it sits on. **There
is NO coloured WIN/LOSS word-as-text and NO coloured label-text** — outcome words and labels render in
`--ink-soft`; **`--ink-faint` is decorative-only**; the meter fill is darkened for contrast. **Number-flash
tokens:** **gain = `--ai`, loss = `--beni`** are an **accent on the ± number** (its sign/shape carries the
meaning, not the hue); vermilion reserved for rank-up / seal beats (§2.16(b)). The guarantee is
meaning-bearing text in `--ink-soft`; ui-design.md §5.1/§5.3 own the chrome detail.

**(c) Rough DATA shape.**
- `RarityStyle { tier → colorClass + label + inlineSvgMotifId }` (colour + text + inline-SVG motif,
  colourblind-safe; emoji cosmetic-only).
- `A11ySettings { textScale, colorblindMode, reduceMotion, paused, liveRegionScope ('narration+milestone')
  }` (persisted).
- `AudioSettings { ambientVolume, sfxVolume, muted }`.
- Tooltips: a base info layer always reachable without hover (tap/focus), Shift = extra detail. **Each
  system is explained inline via contextual TOOLTIP / first-reveal copy as it unlocks — there is NO
  dedicated codex / glossary screen in v1** (relies on the staggered onboarding).

**(d) Ties to the four pillars.** None directly (presentation infrastructure). It renders the pillar/
standing panels legibly (rarity-coded, scalable, AA-contrast) so the four-pillar progress is readable on
any device.

**(e) When introduced / fractal reveal.** **T0** — the text/emoji/CSS register, the self-hosted fonts, the
inline-SVG motifs, and a11y/audio basics exist from the first build; rarity colour-coding and season tags
appear as the relevant systems (loot, clock) reveal. The a11y correctness items, the curated audio set, and
the finalised fonts/license/credits ship with the polished release (§7).

### 2.21.1 About / Credits surface

**(a) What it is.** A small, always-reachable **About / Credits surface**: authorship, a **build
stamp**, **font/audio attributions**, and a **clean-room attestation**. It carries the **license split**
note — **permissive code (MIT / Apache-2.0)** + **reserved game content** — and links the **itch content
descriptors** (the deploy-checklist; detail in §7).

**(b) Player-facing behaviour / loop.** Reachable from the persistent a11y/settings entry point; purely
informational (no gameplay effect). Shows the build stamp so a player/QA can identify exactly which build
they are running.

**(c) Rough DATA shape (one line).**
- `AboutCredits { authorship, buildStamp, fontAttributions[], audioAttributions[], cleanRoomAttestation,
  licenseSplit ({ code:'MIT|Apache-2.0', content:'reserved' }), itchContentDescriptorsRef }`.

**(d) Ties to the four pillars.** None (infrastructure / deploy compliance).

**(e) When introduced / fractal reveal.** Stubbed early; finalised with the self-hosted fonts, LICENSE, and
itch content descriptors (§7.3.2).
