# IA tab reorg — the six-tab set (build plan)

> **📦 ARCHIVED 2026-07-03 — BUILT & verified** (6 tabs shipped; commits
> `57370b8` / `bebc1f2`). Two §8 forks were **overridden** in the agent-default
> audit — **Quests → its own tab (6→7)** and **stagger Inventory to R3** — now in
> [`../../docs/plans/opus-2026-07-03-v0.3.5-build-plan.md`](../../docs/plans/opus-2026-07-03-v0.3.5-build-plan.md)
> §3–§4. The Status line below is stale.

**Status:** 📋 PROPOSED — spec only, awaiting a later code lane. DOCS ONLY (this
document defines the reorg; it writes no code and touches no runtime).
**created_date:** 2026-07-02
**Owns:** D-112 (the six-tab set) · F107 (nav's single home) · F108 (kura →
Inventory) · F109 (the pedlar as a person) · F100 (estate upgrades → Estate) ·
F110 (the Map "who's here").
**Composes with (does NOT own — adjacent lanes):** D-110/F106 (the rung → the
header) · D-111/F89 (deep housing → the Inventory belongings section) · D-114
(vendors-as-people) · D-115 (the Map presentation diverge) · D-116 (location
flavor → the Map node + a Now line) · D-104 (the VN scene, reused for rich
vendors) · D-106 (the multi-panel byōbu layout, later applied *within* a tab).

---

## 0. Scope & non-goals

**In scope.** Redistribute the existing render panes into the **six locked
top-level tabs** (D-112), revealed **incrementally** as each unlocks; make
**Map** navigation's sole home (F107); reshape the pedlar from an inline menu
into a **talkable person** at a Map node (F109/D-114); re-channel
location/navigation flavor off the Story log (D-116); split the character sheet
(attrs/skills/bestiary) out of Combat into **Character**.

**Non-goals (explicitly left to their own lanes — do not build here).**

- **The rung meter's move to the header** (F106/D-110). `renderLadder` STAYS on
  the Work tab for this reorg; the header migration belongs to the D-110
  rung-up-VN build. Touching it here would collide with a parallel lane.
- **The Map's *visual* presentation** (D-115). This plan specs the Map tab's
  **data + default functional rendering** (description + nav + who's-here);
  the 3–4 auditioned visual variants are D-115's diverge, behind the DEV toggle.
- **The deep-housing belongings system** (D-111). The Inventory tab gets the
  kura bank now; belongings is a **later section stub**, built by the deep-housing
  plan.
- **Rebalancing reveal rungs.** Default tab-reveal gates reuse the *existing*
  surface-unlock predicates (§3). Any deliberate re-pacing is a surfaced fork
  (§8), not a silent change.

**The through-line (D-112):** *every capability lives in exactly one thematic
tab*, and *no tab appears before it has content* (the incremental-reveal
signature — §1 of the vision — must survive intact).

---

## 1. Current → target at a glance

Today the shell has **five** tabs — `type Tab = 'work' | 'skills' | 'combat' |
'quests' | 'map'` (render.ts) — with a lot cross-loaded onto **Work**
(labour + the ladder + market + storehouse + House Influence) and onto **Map**
(nav *and* the estate-improve card), plus navigation **duplicated** as a "Walk
on 道" strip inside the Work tab (F107). The target is the **six-tab set**:

| Tab | Holds | Was |
| --- | --- | --- |
| **Work** | labour actions only (rake/rest, per-area labour, cook) | Work, minus nav + market + storehouse + estate + influence |
| **Map** | node **description** (D-116) · **navigation** (F107) · **who's here** (D-114) | the old `map` tab (nav + estate card) + the Work "Walk on" strip + the pedlar |
| **Estate** | house upgrades (kura-works flywheel) + House Influence (koku) | the estate-improve card (was map-gated) + influence (was Work) |
| **Inventory** | the kura **bank** (carried vs stored) + *(later)* belongings | the storehouse (was Work) |
| **Character** | **attrs** · **skills** · **bestiary** *(+ later status tokens)* | skills (own tab) + attrs & bestiary (were in Combat) |
| **Combat** | the fight surface: foe **watch**, **XP/level**, weapon/durability/repair/equip, **stance**, craft | the old `combat` tab, minus attrs + bestiary |

`renderVitals` (the header pills/clock/HP) and `renderLog` (the Story/Now/…
filter panel) are **not tabs** and are untouched by the reorg.

---

## 2. Panel → tab map

Every current `render*` pane and its destination. **MOVES** = the pane changes
its owning tab; **SPLIT** = the pane is divided; **RESHAPE** = its form changes,
not just its home.

| Current pane (render fn) | DOM node | Today gates on | New tab | Change |
| --- | --- | --- | --- | --- |
| `renderActions` (labour) | `actions` | `activeTab==='work'` | **Work** | stays — but see next row |
| `renderActions` "Walk on 道" strip | `actions` → `walkOn`/`walkStrip` | `work` + `room-gate-forecourt` | **Map** | **MOVES** — delete the Work-tab strip; Map is nav's sole home (F107) |
| `renderActions` wolf beat | `actions` → `wolfBox` | `work` + `verb-face-wolf` | **Work** (interim) | stays; its "walk back" hint re-points at Map. Future home = Map who's-here (a foe *is* "who's here") — flagged, not built here |
| `renderLadder` (rung meter) | `ladder` | `work` + ladder unlock | **Work** (interim) | **stays** — final home is the header (D-110), NOT this lane |
| `renderEstate` (kura-works + house-rooms) | `estatePane` | `activeTab==='map'` | **Estate** | **MOVES** — re-gate `map`→`estate`; already self-gated + build-once (F100 did half the work) |
| `renderMarket` (pedlar) | `marketPane` | `work` + `panel-estate` | **Map** | **MOVES + RESHAPE** — becomes a "who's here" person; talk → inline trade panel (§4) |
| `renderStorehouse` (kura bank) | `storehousePane` | `work` + `panel-estate` | **Inventory** | **MOVES** — clean lift; re-gate `work`→`inventory` |
| `renderHouseInfluence` (koku) | `influence` | `work` + `panel-house-influence` | **Estate** | **MOVES** — koku = House standing → the house-management tab (default; minor fork §8) |
| `renderSkills` | `skillsPane` | `skills` + `tab-skills` | **Character** | **MOVES** — becomes the Character tab's Skills section |
| `renderCombat` | `combatPane` | `combat` + `tab-combat` | **Combat** | **SPLIT** — keeps XP/level, weapon+durability+repair+equip, stance, craft, watch |
| ↳ training (the 5 attr rows + "points to spend") | `combatRefs.train` | in combat | **Character** | **SPLIT-OUT** — attrs live on Character; points are still *earned* in Combat |
| ↳ bestiary | `combatRefs.bestiary*` | in combat | **Character** | **SPLIT-OUT** — the field-guide sits with the sheet |
| `renderQuests` | `questsPane` | `activeTab==='quests'` | **Character** (default) | **MOVES** — folds as an "Undertakings 用" section; the six-tab set has no Quests tab (fork §8) |
| `renderMap` | `mapPane` | `activeTab==='map'` | **Map** | node description + nav + who's-here (§5) |
| `renderVitals` | header | — | header | unchanged |
| `renderLog` | `logSection` | — | log slice | unchanged (Now channel gains the move line — §5/§6) |

**Net effect on Work:** the R1 Work tab gets *simpler* — labour only. The
surfaces that used to crowd it (market/storehouse/estate/influence) light up as
their own **tab chips** instead of stacked slices; the same number of surfaces
unlock at the same rungs, better organised.

---

## 3. Incremental reveal — when each tab first appears

A tab's chip appears the render its **primary content** first unlocks, and never
before (the reveal signature). Gates **reuse existing surface predicates**
(surfaces.ts / the rung rewards in ranks.ts) — no new flags for the default.

| Order | Tab | Reveal signal (existing surface) | Rung | Content present at reveal |
| --- | --- | --- | --- | --- |
| 1 | **Work** | always | R0 | rake/rest → labour → cook |
| 2 | **Map** | `room-gate-forecourt` (the gate opens; first walkable) | R1 | node description + nav; who's-here fills in as people arrive |
| 3 | **Estate** | `panel-estate` (predicate keyed to `panel-rung-ladder`, an R1 reward) | R1 | the kura-works improve card; House-Influence teaser joins at R3 (`panel-house-influence`); house-rooms list inks in R4→R7 |
| 4 | **Inventory** | `panel-estate` *(default)* — see the pacing fork §8 | R1 | the kura bank (carried vs stored coin). Belongings = a later D-111 section |
| 5 | **Character** | `tab-skills` | R2 | Skills; **attrs + bestiary join at R3** (`readout-combat-level` / `panel-bestiary`) |
| 6 | **Combat** | `tab-combat` | R3 | watch + XP + weapon; durability/repair/equip R4; stance R5 (the A7 staggering inside the tab is untouched) |

**Reveal-signature rule (non-negotiable):** the nav bar shows only once ≥2 tabs
qualify (unchanged: appears at R1 when Map joins). Each tab chip is gated by
`hasVisibleChild(itsContainer)` — a chip **must not render while its tab is
empty** (§7 is where this is tested). Character deliberately reveals at R2 with
**only Skills**, then *grows* (attrs + bestiary at R3) — that in-tab growth is
itself a reveal beat, and is the reason its gate is `tab-skills` (the earliest
Character content), not `tab-combat`.

---

## 4. Vendors-as-people (D-114)

**Rule:** no shop is a bare inline menu — every vendor is a **person you talk
to**, met at a Map node's "who's here" list, on a **spectrum** of depth, with an
**optional place-gate**. `vendor = (person on the spectrum) + (optional
place-gate)`.

### 4.1 The data model (pure-core: a new `content/people.ts` registry)

```ts
type PersonDepth = 'vn' | 'small' | 'tiny';

interface NodePerson {
  readonly id: string;              // 'pedlar', 'smith', …
  readonly name: string;            // NPC_NAME id or an inline label
  readonly voice: VoiceCategory;    // colours the who's-here row + any dialogue
  readonly node: MapNodeId;         // where they stand (content/map.ts)
  readonly depth: PersonDepth;      // the D-114 spectrum (a/b/c)

  /** (D-114 place-gate) a surface/flag the LOCATION needs before this person is
   *  reachable — you must REACH or BUILD the place first. Undefined = no gate. */
  readonly placeGate?: SurfaceId;

  /** Is this person here right now? (e.g. the pedlar "passes now and then").
   *  Pure predicate over GameState; undefined = always present once place-gated. */
  readonly presence?: (s: GameState) => boolean;

  // depth-specific payloads —
  readonly sceneId?: string;        // 'vn'   → the D-104 DialogueScene to open
  readonly greeting?: string;       // 'small'/'tiny' → a line or two
  readonly shopId?: string;         // 'small'/'tiny' → the trade set (MARKET_ITEMS)
  // 'vn'/'small' may also carry quest offers / dialogue topics (folds with D-110).
}
```

Depths map straight onto D-114's spectrum:

- **`vn` — full VN character (a).** A **D-104** full-screen scene: nameplate,
  GBA typewriter, diegetic choices, per-NPC memory (`npcMemory`), quest offers,
  ongoing topics. Talk **reuses the existing intro VN engine** (`introBeat` /
  `DialogueScene` / `syncIntroScene`) via a generalised "meet a person" trigger
  keyed off the person id — the reusable trigger D-104 already anticipated.
- **`small` — small person (b).** A line or two (`greeting`) **plus** a trade;
  talk opens a compact dialogue + an inline trade panel (real voice, light
  presence).
- **`tiny` — tiny trader (c).** Zero questions; talk opens **straight into the
  trade panel** (`shopId` → `MARKET_ITEMS` rows) — a face on a shop, no tree.

### 4.2 The place-gate (worked example: the smith)

A vendor tied to a place is unavailable until the place is **reached or built**.
The **smith** stands at `woodlot-edge`, `placeGate: 'panel-equipment'` — the
smithy that opens at **R4** ("the woodlot smithy is yours to use…",
surfaces.ts). Before R4 the smith is simply **not in `peopleHere`**; the reveal
reuses the existing surface-reveal gating — no new machinery, and the shop feels
**earned and sited** rather than blinking into existence.

### 4.3 Talk → open shop / dialogue (UI)

- A pure selector **`peopleHere(state)`** (mirrors `foesHere`) returns the
  persons at `state.location` whose `placeGate` is satisfied and `presence`
  holds. Pure, deterministic, unit-testable.
- The Map tab renders a **"Who's here 衆"** section — a `reconcileList` of talk
  affordances (each a person row: seal-coloured name + a one-line tell).
- **Talk** dispatches by depth: `vn` → open the VN scene (the shared engine);
  `tiny` → toggle an **inline trade panel** in the Map tab (reusing
  `buildMarketRow`/`patchMarketRow`, already build-once + patch); `small` →
  the greeting line(s) + that same trade panel.

### 4.4 The pedlar — the first worked example (F109)

- **Depth:** `tiny` (default) — the current market is a bare price list, so the
  cleanest first cut is a face-on-a-shop: talk → the trade panel (the existing
  `MARKET_ITEMS`, `buy_item` intent, per-run `stockCap`s, all unchanged). Give
  him **one greeting line** so he reads as a person, not a menu (a hair toward
  `small`; easy to promote later).
- **Node:** `gate-forecourt` (stores come and go there). **Presence:** "passes
  now and then" — a light `presence` predicate (e.g. present once
  `panel-estate` is unlocked; a season/day cadence is a later tuning knob, not
  required for the first cut).
- **Place-gate:** none (he comes to you). Contrast the smith (place-gated on the
  smithy) — the two examples together cover both halves of D-114.
- **Migration:** `renderMarket` stops being a Work-tab pane. Its rows become the
  pedlar's trade panel, opened from his who's-here row on the Map tab. The
  `MARKET_BLURB` / market DEV variants ride along (§6).

---

## 5. The Map tab (D-116 + F107 + D-114 + the D-115 seam)

The Map tab is the **current node**, three parts:

1. **Location description (D-116a).** The standing *"you are looking around"*
   blurb of the current node — persists while you're there — read from
   `getNode(state.location).blurb` (already rendered by `renderMap`). D-116 also
   wants it to **carry hints** (toward people, actions, things). The hint copy
   the move buttons carry today (`moveStrip` "what's here": yields, a foe, the
   storehouse) folds into the standing description — a **content task** on
   map.ts (a `hints`/richer `blurb` field), specced here, authored in the code
   lane.
2. **Navigation (F107) — the sole home.** The `moveStrip`/`patchStrip` "Paths
   lead to" list. The **duplicate** Work-tab "Walk on 道" strip is **deleted**;
   "walk back to the kura" hints (storehouse, wolf) re-point at the Map tab.
3. **Who's here (D-114/F110).** The `peopleHere(state)` talk list (§4).

**Move = a Now line, not Story spam (D-116b).** Today `move_to`
(intents.ts ~L634) emits the destination blurb as a **`narration`** entry →
the **Story** log (the F114 bug). Fix (pure-core, one reducer): emit the arrival
line as **`ephemeral: true`** so it surfaces as a transient **Now** line and
**fades** — reusing the existing `now` LogFilter + `renderNowView` fade/prune
machinery (log-filter.ts already routes ephemeral entries to `now` only and
hides them from Story/All). Net: the **Story log stops carrying nav flavor**
(D-116's core demand), the **Map node** owns the standing description, and a
**light Now line** marks the arrival.

**The D-115 seam.** This plan delivers the Map tab's **data + a default
functional rendering** (the you-are-here card + paths + who's-here, as today's
`renderMap` default variant). The **3–4 auditioned visual variants** (2D
spatial / 巻物 ledger / node list / node-graph) are **D-115's diverge**, wired
behind the DEV toggle. Keep the two lanes distinct: the reorg makes the Map tab
*correct*; D-115 makes it *beautiful*.

---

## 6. Migration / implementation notes

### 6.1 Tab plumbing (UI)

- **`type Tab`** → `'work' | 'map' | 'estate' | 'inventory' | 'character' |
  'combat'` (drop `'skills'`/`'quests'`; add `'estate'`/`'inventory'`/
  `'character'`; `'map'` now means the node-map, not "Estate 地図").
- **`TAB_LABEL`** → `Work` · `Map 地図` · `Estate 家` · `Inventory 蔵` ·
  `Character 己` · `Combat 武` (kanji per ui-design's English+kanji pairing;
  final glyphs are a taste call — surfaced, not locked).
- **`renderNav`** builds the ordered list, each chip gated by its §3 signal:
  `['work']`, then push `map` (`room-gate-forecourt`), `estate`
  (`panel-estate`), `inventory` (`panel-estate`, or the §8 fork), `character`
  (`tab-skills`), `combat` (`tab-combat`). `nav.hidden = tabs.length < 2`
  (unchanged). The `activeTab`-not-in-list fallback → `'work'` (unchanged). The
  nav rebuild stays wholesale (a handful of buttons, only when the set changes)
  — cheap and acceptable.
- **`setTab`/`activeTab`** are unchanged in shape.

### 6.2 Reveal-gating extends to tab-visibility

The existing pane pattern already carries the reorg: **each pane self-gates**
`toggle(pane, activeTab===X && isUnlocked(...))`, and slices hide via
`hasVisibleChild`. Two extensions:

- Re-target each moved pane's `activeTab` check (the table §2).
- Add the **per-tab empty-guard**: a tab chip renders only when
  `hasVisibleChild(itsContainer)` — the same predicate that guards slices today,
  lifted to guard **tabs** (§7 tests this; it's the anti-empty-tab teeth).

### 6.3 Containers vs the byōbu slices (D-106) — phased

Today all non-Work panes are children of `sliceDo` and self-gate by
`activeTab`; the byōbu multi-panel spread is effectively a **Work-tab** feature.
Two-phase to stay safe:

- **Phase A (functional, low-risk, reversible):** keep the current DOM; only
  **re-target pane `activeTab` gates** + wire the tab chips. Panes show/hide on
  the right tab immediately; `hasVisibleChild` keeps empty containers collapsed.
  This lands the six tabs with the smallest diff and no layout regression.
- **Phase B (cleanup):** give each tab its **own container `<section>`** (so the
  §2 "sliceEstate now spans three tabs" muddiness goes away and D-106's byōbu
  layout can later apply *within* a tab). Cosmetic/structural, done after A is
  green.

### 6.4 Pure-core vs UI split

- **Pure-core (small, testable):**
  - `move_to` reducer → arrival line `ephemeral: true` (D-116b).
  - `content/people.ts` — the `NodePerson` registry (pure data + predicates).
  - `peopleHere(state)` selector (pure, like `foesHere`).
  - Everything place/presence-gated reuses existing surface flags; **no new
    unlock flags** for the default reveal schedule.
- **UI-only:** the Tab type / `renderNav` / labels; pane re-gating; the
  `renderCombat` **split** (move the `train` attr-rows + the bestiary sub-refs
  into a new **Character** container with its own build-once refs — preserve the
  F81 build-once/patch discipline so meter transitions + focus survive); the Map
  who's-here list + talk→trade/VN; deleting the Work "Walk on" strip; hint copy.
- **Append-only reconcile (F81) everywhere:** every relocated/added surface keeps
  the build-once-then-patch contract (`reconcileList` for the who's-here list,
  the quest cards, the skill/attr/bestiary rows). No wholesale teardown on an
  idle tick; the DEV wholesale paths stay DEV-only.

### 6.5 DEV / `?dev` handling

`renderCombat`, `renderMarket`, `renderMap`, `renderQuests` each have an
`import.meta.env.DEV && dev` **wholesale** branch (the variant-toggle path). When
a surface moves tab, its DEV branch **moves with it** (the market DEV variants →
the pedlar trade panel; the map DEV variants stay the D-115 seam). Keep prod
(and tests — `dev` undefined) on the incremental path; the DEV branch must not
drift from the prod default (a known F81 hazard). The `?dev` panel's variant
registry (`ui/dev.ts`) updates its surface keys to the new homes.

### 6.6 Phased build order (safest-first)

1. **Tab scaffolding** — extend `Tab`/`renderNav`/`TAB_LABEL`; split the old
   `map` tab into `map` + `estate` (the estate card is *already* map-self-gated
   → re-gate to `estate`). Lowest risk; unlocks the frame.
2. **Storehouse → Inventory** — a clean, self-contained lift.
3. **House Influence → Estate** — a clean lift (default home; §8 fork).
4. **Skills → Character** + **Combat split** (attrs + bestiary → Character).
   Medium risk: careful with `renderCombat`'s incremental refs.
5. **Nav consolidation (F107)** — delete the Work "Walk on" strip; re-point
   the walk-back hints at Map.
6. **Pedlar → Map person (D-114/F109)** + **`peopleHere`** + the who's-here
   list + talk→trade + the **D-116** move-line re-channel. Highest risk; last.
7. **Quests fold** — resolve the §8 fork, then relocate `renderQuests`.

Each step is a **verify-green vertical slice** (R6): after each, a player can
still reach a coherent, non-empty tab set.

---

## 7. Test discipline (D-086…D-088)

Every test must be able to go **RED**; fixtures derive from source of truth
(`rungThreshold`, the surface predicates), never copied magic numbers.

- **Reveal order (per tab).** For each tab: assert the chip is **ABSENT** at the
  rung *before* its signal and **PRESENT** at/after it. Drive the state through
  the real rung path (or set the exact surface flag from `RANKS`/`SURFACES`), so
  a mis-gated tab (wrong rung) fails. *Could-go-RED:* gate Combat on `tab-skills`
  by mistake → the R2 assertion catches it.
- **No revealed-but-empty tab (the #1 risk).** For every tab chip that renders,
  assert `hasVisibleChild(itsContainer)` is true at that rung. *Could-go-RED:*
  reveal Inventory before the storehouse pane has content → fails.
- **Combat split.** At R3: attrs + bestiary render under **Character**, absent
  from **Combat**; Combat still shows watch + XP + weapon. Attribute-point
  *earning* still fires from combat leveling (the coupling holds).
- **Nav single home (F107).** Post-reorg the Work tab has **no** move strip; the
  move buttons exist on **Map**; `move_to` still works from Map.
- **D-116 channel discipline.** `move_to` adds **no** non-ephemeral `narration`
  (Story) entry; it **does** add an `ephemeral` entry; the Story/All filters
  hide it; the Now filter shows it; the Map node description reads
  `getNode(location).blurb`. *Could-go-RED:* the old narration line would fail
  the "no Story entry" assertion.
- **Vendors-as-people.** `peopleHere` includes the pedlar at his node once
  present; talking (`tiny`) opens the trade panel; the **place-gated smith** is
  **absent** until `panel-equipment` (R4), present after. Derive the R4 gate
  from the surface, not a literal.
- **Full-arc e2e + invariants (D-088, named in the milestone DoD).** One test
  walks **R0→R7** and asserts the **tab set grows in the §3 order** (the reveal
  signature) and that **no tab is ever revealed empty** — the seam-proof between
  the fragment tests above. Ration its gate-time (A17).

---

## 8. Risks & open forks

**Risks.**

- **Revealed-but-empty tab** — the sharpest failure mode; mitigated by the
  per-tab `hasVisibleChild` guard + its test (§7).
- **`renderCombat` split regression** — it's a big build-once composite; moving
  attrs/bestiary out risks focus loss / meter-transition strobe if the F81
  refs aren't preserved. Mitigate: give Character its own build-once refs; keep
  each moved sub-list a `reconcileList`.
- **Log/Now interplay** — making the move line ephemeral must not disturb other
  narration, and the Now fade/prune timers must stay leak-free (the F53
  teardown discipline on reset/filter-switch).
- **DEV variant drift** — moved DEV branches must track their prod default (§6.5).
- **Adjacent-lane collision** — do **not** move the rung to the header (D-110's
  lane), do **not** build belongings (D-111), do **not** lock a Map visual
  (D-115). Leave those seams open (§0).

**Open forks (agent picks a default; human overrides async — R4).**

1. **Quests' home (the biggest — D-112 names no Quests tab).** *Default:* fold
   `renderQuests` into **Character** as an "Undertakings 用" section (a personal
   journal of goals taken on) — the cleanest single home, and D-112 (newest
   steer) supersedes D-037's "Quests is its own tab." *Alternatives:* site the
   **givers** on the Map (D-114 VN characters *offer* quests) while a tracker
   stays in Character (a split); or a transitional Quests tab (violates the
   locked six — off the table for prod). **Needs a taste call before step 7.**
2. **R1 triple-reveal pacing.** With the default gates, **Map + Estate +
   Inventory** all light up at R1 (their content unlocks there today). *Default:*
   keep the faithful content-unlock gating (the reveal *count* is unchanged from
   today — surfaces just become chips). *Cheap stagger lever if playtest finds
   it a slam:* hold **Inventory** to `tab-combat` (R3) — the kura's
   shelter-your-coin value is a combat-era concern (D-113), so R3 is diegetically
   clean. Flagged for the pacing sim / the human.
3. **House Influence (koku) home.** *Default:* **Estate** (koku = House
   standing → house-management tab). *Alternative:* its own surface, or beside
   the personal status tokens on Character (but those tokens are *personal*
   status, koku is *House* standing — the split argues for Estate).
4. **Tab kanji glyphs / order** — the labels in §6.1 are a first cut; final
   glyph choices are a ui-design taste call.

---

## 9. Definition of done

- The six tabs exist, gated in the §3 order; the nav grows R0→R7 with **no empty
  tab** ever shown (§7 e2e green).
- Nav lives **only** on Map (F107); the Work "Walk on" strip is gone.
- The kura bank is on **Inventory**; the estate-improve card + House Influence
  are on **Estate**; skills + attrs + bestiary are on **Character**; the fight
  surface is on **Combat**.
- The pedlar is a **talkable person** at a Map node (F109/D-114); the smith
  demonstrates the **place-gate**; `peopleHere` + the `NodePerson` registry are
  pure-core + tested.
- `move_to` flavor is a **Now line**, not Story (D-116); the Map node owns the
  standing description.
- The quest fork (§8.1) is resolved with the human; `renderQuests` relocated
  accordingly.
- `npm run verify` green; every surface stays on the append-only reconcile
  engine; DEV paths track prod.
