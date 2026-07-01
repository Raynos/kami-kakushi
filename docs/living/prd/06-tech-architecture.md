# §6 — Tech Architecture & Data Model

This section specifies, concretely and leanly: the **toolchain**; the **pure-core boundary** and module
layout; the **GameState** shape (stored vs. computed) — including the **three clean combat tracks**
(§6.4.1), the **intra-line dialogue** data model, and the **bounded per-skill labour→combat** channel — and
the `reduce`/`tick` contracts; the **one seeded RNG** (per-named-stream cursors + stateless day-keyed
derivations); **content as data registries** (data-as-code, single source of truth); the **save model**
(MULTI-BACKEND redundant atomic save — IndexedDB + localStorage + sessionStorage — an app-identity magic
field, an additive backwards-compatible schema, and a monotonic-counter newest-wins selector); the
**renderer contract** (thin DOM, multi-screen UI, responsive, active-only); the **DEV play API**
(`window.__qa`); **accessibility basics**; and how all of this satisfies the four project conventions
(pure-core, one RNG, generate-don't-duplicate, playtest-by-code).

> **ADR note:** §6 is **no longer ONLY an elaboration of D-013.** It still adds buildable detail to the
> already-locked tech canon (module layout, the `reduce`/`tick`/rewards contracts, the stored-vs-computed
> split, the registry set, the verifier + generated-docs gate, the `__qa` surface — recorded as a child ADR
> **D-013a — tech architecture detail**), **but it also now IMPLEMENTS the V2 decisions under ADR D-022
> (governing, most-recent-wins)** — real reversals / new locks, not just buildable detail: **multi-backend
> redundant save** (Q37/FU1), **additive backwards-compatible schema** (Q45/FU5), **per-named-stream RNG
> cursors + stateless day-keyed weather** (Q2/FU3), the **`Math.pow` ban → integer-pow** (Q36), the
> **bounded labour→combat verifier flip** (Q6/FU8), the **feature-rich data model** incl. **intra-line
> dialogue** (Q34/FU22) & **`estateWealth.subEngines`** (Q34/FU20), and the **no-runtime-reveal-queue**
> design rule (FU4). See §6.13.

---

## 6.1 Toolchain & build

**Stack (per D-013): Vite + TypeScript + Vitest, with ESLint + Prettier.** Committed `package.json` +
lockfile (the ad-hoc-toolchain weakness of the inspiration games is fixed by pinning everything). Output is
**fully static** — `vite build` → `dist/` → zipped and uploaded to itch.io, no server, no backend.

- **TypeScript: strict.** `"strict": true` plus `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`,
  `noImplicitOverride`. The core is typed end-to-end; content registries are typed data so the content
  verifier (§6.6) and the compiler share the work.
- **Vite** handles the dev server (HMR), TS compile, bundling, and cache-busting. The production bundle is a
  single static app; the DEV play API and any dev-only helpers are stripped via `import.meta.env.DEV`
  (dead-code-eliminated from the production build). The build also injects a **commit-SHA build stamp**
  (surfaced on the About/Credits surface, §6.1.1/§6.5).
- **Vitest** unit-tests the pure core (it imports cleanly in Node because it has zero DOM/canvas/window
  references — see §6.2). Determinism tests assert that a fixed seed + a fixed intent/tick script produces a
  byte-identical `GameState` (snapshot or structural hash).
- **ESLint** enforces the architectural rules as lint, not just convention:
  - **no `Math.random()` anywhere in `src/core/`** (custom `no-restricted-syntax` / `no-restricted-globals`
    rule) — all randomness flows through `core/rng` (convention: *one RNG*);
  - **no `Math.pow` / `Math.exp` / `Math.log` / trig (`sin`/`cos`/`tan`…) anywhere in `src/core/`** (a new
    `no-restricted-properties` rule; **`Math.sqrt` is whitelisted**) — every growth-curve power is computed
    by **integer-power-by-repeated-multiplication**, not floating transcendentals, accumulated in **ONE
    canonical left-to-right order** (`acc = 1; for i in 1..n: acc = acc · base` — a single pinned reduction
    order, **unit-asserted** so a refactor can't silently re-associate and diverge; D-Q-numeric / Q16+Q17).
    Rationale (Q36): this closes the **1-ULP cross-engine hole**, so a fixed seed replays **byte-identically**
    across engines/OSes and an **exported base64 save** is portable and re-importable everywhere (convention:
    *one RNG / determinism*);
  - **no DOM/canvas/window/`document`/`localStorage`/`indexedDB`/`Date.now`/`performance.now` in
    `src/core/`** (a `no-restricted-imports` + `no-restricted-globals` boundary rule) — keeps the core pure,
    deterministic, and Node-testable (convention: *pure-core*). **Documented save-layer exemption (FU2):**
    `Date.now`/`performance.now` stay **banned in `src/core/`**, but `src/persistence/` **may** call
    `Date.now` for the **save-layer timestamp** used **only** as the newest-wins **tiebreaker** (save
    *metadata*, **not** game logic — §6.8.1). This is a **named, recorded core-lint exemption**: the
    deterministic core stays clock-free; only the side-effectful persistence layer reads the wall clock;
  - the renderer (`src/ui/`) may use the DOM but may **not** import from another screen's internals or
    mutate `GameState` directly (it only dispatches intents).
- **Prettier** for formatting; **lint-staged + the existing `.githooks/pre-commit`** keep each commit
  green and journaled (the hook already requires a `journal/` entry; `SKIP_JOURNAL=1` for trivial commits).

### `npm run verify` (the single gate)

One command must pass before any commit and in CI:

```
npm run verify  =  tsc --noEmit
               && eslint .
               && prettier --check .
               && vitest run
               && node src/scripts/verify-content.ts      # the content verifier + V2 invariants (§6.6/§6.6.1)
               && node src/scripts/gen-docs.ts --check     # generated docs are up to date (§6.6)
```

`gen:docs --check` regenerates the balance/content docs into a temp buffer and fails if they differ from
what's committed — this is how *generate-don't-duplicate* is enforced mechanically: you cannot land a data
change without regenerating its docs. `npm run gen:docs` (without `--check`) writes them.

**Scripts:** `dev` (Vite dev server), `build` (`vite build` → `dist/`), `preview`, `test`, `test:watch`,
`verify`, `gen:docs`, `lint`, `format`. `build:itch` = `build` + zip `dist/` for upload.

---

## 6.1.1 Bundled assets (self-hosted OFL fonts · curated audio · inline SVG · build stamp)

> **Corrects the earlier "no asset pipeline" framing.** v1 *does* ship **one small, curated, fully-bundled
> asset set** — there is still no heavy art pipeline, but the build self-hosts a handful of static assets so
> the game works **offline and under itch's relative-base / cross-origin-iframe** sandbox. Everything below
> is committed into `dist/` at build time; nothing is fetched at runtime from a third-party CDN.

- **Self-hosted fonts (Q52).** The display/body typefaces are **SIL OFL** fonts **self-hosted** in
  `dist/` (woff2), **never** Google Fonts dynamic subsetting (which breaks offline play and the itch
  relative-base). The **OFL license text is bundled** alongside and credited on the About/Credits surface.
- **A small curated audio set (Q50).** "Good audio" = a mix of **synthesized Web Audio** (light ambient
  beds + UI/event SFX generated in code) **and a few original / CC0 samples**, bundled into `dist/`. This is
  the **one acknowledged small asset set.** A mute toggle is honoured (§6.11). The Web Audio **`AudioContext`
  starts SUSPENDED** and **resumes only on the first user gesture** (so there is **no ambient at the cold
  open** — effectively muted until the player opts in), and it **suspends again on backgrounding / pause**
  (§6.9 active-only loop).
- **Inline SVG for load-bearing period motifs (Q38).** Pillar / season / rarity / rank-seal marks that must
  read **identically across OSes** are **inline SVG** (in the DOM, themeable by CSS custom properties), not
  emoji. **Emoji are cosmetic-only** — never the sole carrier of a load-bearing meaning (ties to §6.9/§6.11).
- **Build stamp (Q54).** The build injects the **commit SHA** (and build date) as a compile-time constant,
  surfaced on the **About/Credits** surface (§6.5) together with authorship, the font/audio attributions,
  and the license note (Q51: **permissive code** — MIT/Apache-2.0 — **+ reserved game content**).

---

## 6.2 The pure-core boundary

**The single most valuable architectural rule (CLAUDE.md conventions): all game logic — rules, state,
math — lives in a pure core with ZERO DOM / canvas / window imports.** The renderer consumes the core as
plain data. This makes the core deterministic, unit-testable in Node, and headlessly drivable.

```
src/
  core/        ← PURE. No DOM/canvas/window. The whole game's logic & data.
  ui/          ← thin DOM renderer. Reads GameState, dispatches intents. No game logic.
  app/         ← composition root: wires core ↔ ui ↔ persistence; the tick loop; __qa in DEV.
               ←   The app loop ACCUMULATES the fractional dtTicks remainder and hands only
               ←   WHOLE-INTEGER ticks to core.tick(); while the tab is OPEN it drives auto-resolve
               ←   combat + auto-repeat labour (the "leave it running" feel, FU23) — still active-only.
  persistence/ ← MULTI-BACKEND redundant save (IndexedDB + localStorage + sessionStorage) + atomic write
               ←   + app-identity magic field + monotonic-counter newest-wins selector + the additive-schema
               ←   migration chain & raw backup + base64 codec. (Side-effectful; never imported BY core.)
src/scripts/       ← gen-docs.ts, verify-content.ts (Node entry points; import core data only).
```

**Dependency rule (one-directional):** `ui`, `app`, `persistence`, and `scripts` may import from `core`;
**`core` imports from none of them.** `core` exports only pure functions and data and the `GameState` type.
The lint boundary rule (§6.1) makes a violation a build failure, not a code-review catch.

### `core/` module layout

| Module | Responsibility | Pure? |
|---|---|---|
| `core/state` | The `GameState` type, `createInitialState(seed)`, and the **stored vs. computed** split (§6.4). | yes |
| `core/intents` | The typed `Intent` union (every player verb) + `reduce(state, intent) -> state` — the action reducer. | yes |
| `core/step` | `tick(state, dtTicks) -> state` — the deterministic clock advance (whole-integer ticks) + the per-tick / per-day / per-week / per-season scheduler. | yes |
| `core/rng` | The **one** seeded RNG: **splitmix64**, persisted as **per-named-stream cursors** `{ seed, cursors: { combat, loot, seasonal, worldgen } }` (NOT a single counter, NOT child-RNGs-by-splitting). Pure `next(rng, stream) -> [value, rng']`; helpers (`int`, `chance`, `pick`, `weighted`) thread the advanced cursor back into `GameState`. **Plus** a pure **stateless day-keyed** helper `deriveDayKeyed(seed, 'weather'|'festival', day)` for weather/festival rolls, and a pure `lunarPhase(day)` **ephemeris** (real ~29.5-day cycle, no RNG; D-Q6) — both derived on read, **NOT** a persisted cursor (§6.7/§6.7.1). | yes |
| `core/combat` | The deterministic, fixed-step auto-battler. **Feeds the character (combat) `level` track** (combat-XP from kills → `character.level`; Q1/FU14) and the **equipped weapon-line skill**; reads **per-mob `MobDef.level`** (FU15), **graded durability bands** on attackPower/defense (FU17), the **`satietyRate`** combat throttle on attackPower (FU16), and a **clean retreat** (Q16). Drives the **staggered reveal** of the stance / ability / item slots (FU12) over a **bigger weapon roster** (~9–10 across v1; each an archetype + signature ability — FU13). Saves & resumes mid-fight via `CombatEncounterState` (Q34). Stepped by `core/step`. | yes |
| `core/economy` | Producers, costs, resource flows (the *koku*/coin spine; the capped Estate & Wealth sub-engines: land / treasury / trade incl. the silk *meibutsu*, trade ≤⅓-capped per canon §D). Holds the **market-saturation** damper (the only non-derivable economy state; §6.4). | yes |
| `core/skills` | Per-skill XP curves, per-event caps, visibility thresholds, milestone web. **Each skill (labour included) carries a per-skill PERKS track** (~2–8 perks / small flat combat bonuses, unlocked by leveling that skill) — the **bounded labour→combat channel** (FU8). The real bound is **incremental skill unlock** (skills reveal per rung/tier) + small per-perk magnitudes (the §6.6 verifier asserts *each perk* is small — **not** `== 0`, **not** a single global cap). **Conditioning stays the ZERO-stat enablement gate** (weak→capable), orthogonal to and never bypassed by these perks (Q6/FU8). | yes |
| `core/rewards` | The universal **rewards/unlock bus** — `applyRewards(state, rewards) -> state` — the one funnel through which dialogue, **dialogue choices**, quests, thresholds, and combat grant items/xp/coin/locations/recipes/quests/**flags & unlocks**/`pillarDeltas`, and emit diegetic log lines. (`pillarDeltas` deed-accrual is **Phase-2-gated**, §6.5.) | yes |
| `core/unlock` | Predicate evaluation for the UI-reveal engine: each panel/screen/tab/row/area is data with an unlock predicate over `GameState`. **`reduce`/`tick` evaluate the predicates to ADD newly-earned surfaces to the stored write-once `unlocked` latch** (§6.3/§6.4); the reads `isUnlocked(state, id)` (per-id) and `unlockedSurfaces(state)` (the **ONE** set-selector name — replaces the old `visibleSurfaces`) are **pure projections of that stored Set**, never a live predicate re-eval. **Reveal staggering is a DESIGN property of the authored unlock schedule** (one-at-a-time **by construction**, FU4) — there is **NO** stored runtime reveal-queue; genuine multi-element single-feature reveals are bespoke one-offs designed per case. | yes |
| `core/influence` | The four House-Influence pillars (Arms / Estate & Wealth / Standing & Office / Name & Honour), achievement-jump + seasonal judged-result accrual (new-high-water-mark, up-only + per-pillar recoverable dents). **Tier-up is the scaled grade-gate** (D-049, the D-028 hybrid gate scaled by pillar-count): **1 EXCELLENT + 1 GREAT + (N−2) GOOD** over the tier's **N revealed** pillars, all ≥ GOOD (**T0 = 1 pillar → collapses to a single EXCELLENT**); **NO** overflow-substitution — §1.6.3/§1.6.4, Q7/FU10). Pillar **DEEDS accrue only in each tier's Phase 2** (post-final-rung; FU7). The **Estate & Wealth** pillar holds the nested `subEngines { land, treasury, trade }` with the **trade ≤⅓ HARD clamp**; **cross-pillar combos are computed POST-clamp** and excluded from the gate-threshold check (§4.3.1, FU20). | yes |
| `core/ranks` | The **per-tier rung ladder** + the **per-rung-RESET rung-meters**: `estateService` (labour) and `combatRank` (martial — fed by per-rung **CURATED** activities, **not** raw kills/XP; renamed from v1 "Combat Standing" per Q9). Each rung promotes on an **AND-gate** — the numeric meter **≥** that rung's threshold (back-solved from the ≥30-min floor × the rung's eligible-activity rate, FU6) **AND** the rung's **story flags** — surfacing "awaiting X" when one lags. Owns the **phase-1 (climb the rungs) → phase-2 (the estate-influence / pillar grind unlocks after the final rung)** gate per tier; the phase marker is **DERIVED from the current rung**, never a separate stored flag (FU7). | yes |
| `core/content` | The **data registries** (one module per content type; §6.5) + the registry index. Data-as-code. | yes |
| `core/log` | The event/story log model (append, severity/colour tag) — data only; the renderer paints it. A **true ring buffer** with a pinned hard cap **`LOG_RING_MAX ≈ 300`** (oldest entries evicted on overflow — never an unbounded list). | yes |
| `core/selectors` | Derived/computed reads (current production rates, effective stats, `satietyMax`, `durabilityBand`, the gate profile, what's unlocked, current tier). **Pure functions of `GameState`; nothing stored.** | yes |
| `core/format` | Pure display helpers — the shared **K/M/B** number formatter (`999,999 → '1.0M'`, etc.) + macron/label helpers — moved out of `src/ui/` so they're **table-driven boundary-tested under `npm run verify`**; the renderer imports them (§6.9). | yes |

**Public surface of `core`:** the `GameState` type, `createInitialState`, `reduce`, `tick`, the selectors,
the registries, and the RNG helpers. **Nothing else mutates state.** Everything is immutable-in/immutable-out
(structural sharing; never mutate the input `state`).

---

## 6.3 The two contracts: `reduce` and `tick`

Two pure functions are the *only* ways state changes. Both are deterministic given `(state, input)` because
all randomness is carried inside `state.rng` (§6.7), every weather/festival roll is re-derived stateless and
day-keyed, and lunar phase is a derived ephemeris off the absolute day (§6.7.1).

```ts
// Every player action is a typed intent. Discriminated union.
type Intent =
  | { type: 'rake_rice' }
  | { type: 'do_activity'; activityId: ActivityId }   // farm/forage/woodcut/fish/craft/...
  | { type: 'travel'; areaId: AreaId }
  | { type: 'buy_producer'; producerId: ProducerId }
  | { type: 'equip'; itemId: ItemId; slot: EquipSlot }
  | { type: 'set_stance'; stanceId: StanceId }
  | { type: 'use_item'; itemId: ItemId }
  | { type: 'combat_action'; action: CombatAction }   // ability/item/retreat — strategic, low-APM
  | { type: 'advance_dialogue'; lineId: DialogueLineId; choiceId?: ChoiceId }  // choiceId = an intra-line branch (FU22)
  | { type: 'accept_quest'; questId: QuestId }
  | { type: 'advance_quest'; questId: QuestId; event: QuestEventId }  // an order-free advance-event fires (D-Q-B14): adds `event` to the quest's `advancedBy` set, recomputes status; a no-op if already satisfied or the quest isn't active
  | { type: 'read_scroll'; scrollId: ScrollId }       // diegetic feature unlock (costs in-game time)
  | { type: 'set_allegiance'; lean: number }          // Tama ↔ farmhand, continuous, re-swingable
  // ...one variant per verb; the renderer NEVER mutates state, it only dispatches these.

// The action reducer: a player verb → new state. Pure; deterministic.
function reduce(state: GameState, intent: Intent): GameState;

// The clock advance: simulate dtTicks of abstract game-time. Pure; deterministic.
// dtTicks is a WHOLE INTEGER of ABSTRACT (active-play) ticks — the app loop accumulates the
// fractional remainder and hands core.tick() only integer ticks. The CORE never reads a clock;
// the app loop derives dtTicks from elapsed WALL-TIME WHILE THE TAB IS OPEN (it does NOT pause on
// `document.hidden` — a throttled background tab just catches up; the clock stops only when the tab
// is CLOSED). Active-only / no offline accrual (canon §H, D-053).
function tick(state: GameState, dtTicks: number): GameState;
```

**`reduce`** validates the intent against current state (e.g. enough *koku*, area reachable, rung high
enough), applies the change, runs any triggered rewards through `core/rewards`, and re-checks unlock and
tier-threshold predicates so newly-earned surfaces flip to unlocked and push their diegetic log line. An
illegal intent is a no-op (returns the same state) plus an optional rejection note — never a throw.
**`reduce`/`tick` are the SINGLE reveal authority and only ever ADD to the stored `unlocked` Set (write-once
latch — a surface, once entered, is never removed); the once-per-game reveal log-line is emitted by this same
latch transition, not by the renderer diff.**
**Intra-line dialogue is data, not scripting (FU22):** an `advance_dialogue` carrying a `choiceId` writes
**only chosen-flags** (the choice's `locksLineIds[]`/`flags` effects ride the *same* rewards bus) — it is
deterministic and **save-light** (only the chosen flag persists, in `flags`; §6.4/§6.5).

**`tick`** advances the abstract clock by `dtTicks` (a whole integer) and runs the scheduler in `core/step`:
- **per-tick:** the **auto-resolve combat** sub-step (the auto-battler) and **auto-repeat labour** (the
  "leave it running, check progress" loop, FU23 — runs unattended while the tab is open, still strictly
  active-only), satiety/energy drain (soft — slows, never hard-blocks), active-activity progress,
  auto-producer output (late-game / T4+ only). **It also decrements each `ActiveEffect`'s remaining duration
  and DROPS expired effects** — so `effects[]` is **length-bounded** (live buffs/injuries only), never an
  unbounded persisted collection.
- **per-day / per-week:** vendor restocks, food rot/ferment, the market-saturation damper recovering, and
  the **day-keyed weather / festival resolution** — `deriveDayKeyed(seed, 'weather', day)` produces the
  day's bounded **±10%** *(proposed v1 balance)* mechanical modifier with **nothing weather-related stored**
  (§6.7.1).
- **per-reckoning:** harvest resolution, the **judged Influence appraisal** (the autumn harvest the headline;
  it **raises a pillar only on a new high-water mark (up-only)**, never a maintenance trickle, per canon §D and
  PRD §1.6.2). **Cadence is a per-tier LEVER (D-094 — §4.2.2):** T1+ reckons roughly per **season** (~4×/year);
  the compressed **T0** showcase reckons on the shorter **`PHASE2_JUDGE_INTERVAL_DAYS`** (~3d), because a full
  28-day season never turns inside its ~5-day Phase-2 grind (battery #8). Per **FU7 (sequential per-tier)** this
  appraisal **accrues pillar DEEDS only in the tier's Phase 2** (after the final rung) — the judged result
  writes **nothing** to the pillars while the player is still climbing the rungs (which prevents the "half the
  rungs, maxed deeds" exploit). Weather/festivals modulate the judged result mechanically (bounded ±10%,
  day-keyed). Also: festival events. **Multi-boundary safety (B10):** the clock is folded **one day at a time**
  by `singleTick`, and each reckoning boundary fires in turn as the day rolls over — so a multi-interval
  `dtTicks` jump accrues **all N** appraisals with **no `pendingAppraisals` counter needed** (per-day folding
  supersedes the earlier counter design; a boolean would have silently collapsed N reckonings into one).

`dtTicks` is computed by the **app-layer** loop from real elapsed **wall-time while the tab is OPEN** (it does
**NOT** pause on `document.hidden` — a throttled background tab simply **catches up** on the elapsed wall-time
when it regains cycles; the clock advances while OPEN and **stops only when the tab is CLOSED**, D-053), then handed
to the pure `tick` as a **whole integer** (the loop accumulates the fractional remainder across frames). That
**fractional-tick remainder is intentionally EPHEMERAL** — it lives only in the app loop, never in
`GameState` and never in the save; `GameState` is **always tick-aligned at save**, so replay determinism is
unaffected. The core never reads a clock. **Active-only is enforced structurally:** there is no offline-accrual code path —
on load, the world resumes exactly where it was saved (no "while you were away"); the unattended
auto-resolve/auto-repeat runs **whenever the tab is open** (foreground or throttled-background), **never when closed**.

> **Tick-fold determinism (B10, testable).** `tick(state, dtTicks)` **folds `dtTicks` ONE abstract tick at a
> time** — it never batch-applies a multi-tick delta. Within each single tick the per-day / per-week /
> per-season scheduled plans each **fire exactly once, in a FIXED registry order** (a declared, stable list —
> not iteration order of a map), and a counter like `pendingAppraisals` is **drained in a loop** so nothing is
> dropped on a long jump. This makes the clock **split-invariant**: `tick(s, a + b) === tick(tick(s, a), b)`
> for all non-negative integers `a, b` — **unit-asserted** in Vitest. (Combined with the day-keyed weather and
> the lunar ephemeris being pure functions of `day`, a 1-tick step and an N-tick step reach byte-identical
> state.)

> **Determinism guarantee (testable):** `replay(initialState, [intents…], [tickScript…])` produces an
> identical `GameState` every run. This is asserted in Vitest and is what makes the DEV play API (§6.9) a
> regression harness for pacing and unlock timing.

---

## 6.4 GameState — stored vs. computed

`GameState` is a single immutable-ish tree reduced by `reduce`/`tick`. The cardinal rule (per the architecture
sketch and the *save-minimal* canon): **store only what is NOT derivable; recompute everything derivable on
read.** Derived values (effective stats, `satietyMax`, the gate profile, current production/sec, what's
unlocked, current tier, time-to-next) are **computed by `core/selectors`, never stored** — so they can never
go stale and never need a migration.

### Stored (non-derivable) — the persisted surface

```ts
interface GameState {
  schemaVersion: number;            // for the migration safety-net (§6.8.2)
  rng: { seed: number;
         cursors: { combat: number; loot: number; seasonal: number; worldgen: number } };  // per-named-stream MONOTONIC cursors — persisted (§6.7). Weather/lunar are NOT stored — derived day-keyed (§6.7.1).
  clock: { tick: number; day: number };  // abstract time — persist ONLY the absolute monotonic day + tick. createInitialState pins tick 0, day 1; the day index is 1-BASED. season/year are DERIVED (never stored) — see season(day)/year(day) below (D-Q6, resolved: derive-don't-store). Lunar phase is likewise DERIVED — a real ~29.5-day ephemeris off `day` (§6.7.1), not stored and not a per-day RNG roll.
  currentArea: AreaId;                            // where the player IS now (set by the `travel` intent) — non-derivable, persisted (§2.19 "current location")
  resources: Record<ResourceId, number>;         // koku, coin(mon), wood, fish, materials…
  producers: Record<ProducerId, number>;         // owned counts (late-game / T4+ only)
  market: { saturation: Record<ResourceId, number> };  // bulk-sale market-saturation damper — the ONLY non-derivable economy state (weather/lunar are derived; belief-beasts are content). Persist saturation ONLY. (§2/§4, Q3/Q42)
  skills: Record<SkillId, { xp: number }>;       // total xp per skill; levels + which perks are unlocked are DERIVED (the per-skill PERKS track, §6.5)
  character: { hp: number; satiety: number; attributePoints: number;
               level: number;                    // the COMBAT-fed character (combat) level (Q1/FU14) — fed ONLY by combat-XP; floor 1. HP & attribute-points scale off it; satietyMax is DERIVED from it (base + per-level growth, Q47) — NOT stored.
               combatXp: number;                 // total combat-XP toward the next level
               attributes: Record<AttrId, number> };  // base attrs stored; effective DERIVED
  inventory: Record<ItemId, number>;             // counts (quality folded into the item key)
  equipment: Partial<Record<EquipSlot, { equipDefId: EquipDefId; durability: number; qualityTier: QualityTier }>>;  // per-slot EquipState (§2.10) — durability(→band, derived)/quality persist HERE, not in the counts-only inventory
  influence: Record<PillarId, { value?: number; highWater: number; dent: Dent | null;
                                gateEligibleValue: number;
                                subEngines?: { land: SubEngine; treasury: SubEngine; trade: SubEngine } }>;
                                                 // 4 pillars; high-water + the (≤1) active recoverable dent (§4.2.4) + a `gateEligibleValue` accumulator. ESTATE & WEALTH value is PURELY DERIVED (D-Q-estate-dent): it nests `subEngines` (each { value, highWater }) and its pillar `value` is NOT stored — it is computed on read as land + treasury + trade (the subEngine value sum), so a dent on one strand can never desync the pillar total and the trade ≤⅓ HARD clamp holds BY CONSTRUCTION. (Non-Estate pillars store `value`; Estate omits it.) `gateEligibleValue` is the DEED-ONLY accumulator (D-Q5/Model-A): only recognised Phase-2 DEEDS add to it; cross-pillar combos do NOT write it — so a combo can never satisfy a required gate band nor breach trade-≤⅓. The gate check (§6.6.1) reads `gateEligibleValue`, never the combo-inflated `value`. (SubEngine = { value: number; highWater: number }.)
  tier: TierId;                                   // current macro tier T0..T5 (set by the tier-up intent; threshold-progress is DERIVED — §6.13 item 4)
  ranks: Record<TierId, { estateService: number; combatRank: number; rung: RankId }>;
                                                 // PER-RUNG-RESET rung-meters: estateService (labour) + combatRank (martial — fed by per-rung CURATED activities, NOT raw kills/XP; renamed from v1 "combatStanding" per Q9). The phase-1/phase-2 marker is DERIVED from `rung` — there is NO separate stored phase flag (FU7).
  reputation: Record<FactionNodeId, number>;     // village per-node meters; origin ties as the O0→O5 rung meter
  allegiance: number;                            // Tama ↔ farmhand lean, continuous
  flags: Set<FlagId>;                            // story/finished/one-shot flags (serialized as array) — also the home of dialogue CHOSEN-FLAGS (the only thing an intra-line choice persists; FU22)
  unlocked: Set<SurfaceId>;                       // panels/screens/areas the player has earned — the ONLY reveal state; a WRITE-ONCE latch (reduce/tick only ADD, never remove — see the no-revealQueue callout below + §6.6.1)
  quests: Record<QuestId, { status: QuestStatus; advancedBy: Set<QuestEventId> }>;
                                                 // ORDER-FREE quests (D-Q-B14): NO `step` cursor. `advancedBy` is the UNORDERED SET of advance-events already satisfied (a quest is a SET of advance-events with no fixed order). QuestStatus = 'taken' | 'active' | 'abandoned' | 'done' | 'failed' (serialized as array).
  counts: Record<CountId, number>;               // kills, clears, harvests — drive quest advancement & bestiary tallies (NOT a separate player "achievements" feature; pillar achievement-JUMPS are recognized deeds, §2.16, not these raw counts)
  seasonalAppraisal: { lastJudgedHighWater: Record<PillarId, number>; pendingAppraisals: number };
                                                 // the §2.2 SeasonalAppraisalState — `pendingAppraisals` is a COUNTER (NOT the old `pendingAppraisalDue` boolean; B10): each crossed season boundary increments it and the tick scheduler drains it one-per-count, so a multi-season jump accrues all N appraisals (§6.3).
  effects: ActiveEffect[];                        // active buffs/injuries with remaining duration
  combat?: CombatEncounterState;                  // present only while a fight is live; NON-derivable mid-fight (consumed RNG cursor, current HP/positions/statuses cannot be recomputed) — stored so a save resumes the exact encounter; cleared when the fight ends
  log: LogEntry[];                                // event/story log — a true ring buffer (LOG_RING_MAX ≈ 300, oldest evicted); only a small TAIL (~50 lines) is persisted (§6.8)
  settings: { textScale: number; colourblindMode: boolean; reducedMotion: boolean; muted: boolean };
                                                 // CANONICAL persisted settings shape = §2.21(c) A11ySettings + AudioSettings (textScale, colorblindMode, reduceMotion, paused, liveRegionScope · ambientVolume, sfxVolume, muted); this field references that shape.
}
```

> **NON-field callout — there is NO `revealQueue` in `GameState` (FU4, supersedes Q17).** Reveal staggering
> is a **design property of the authored unlock schedule** (one-at-a-time **by construction**) — **not**
> stored runtime state. `unlocked: Set<SurfaceId>` is the *only* reveal state; a surface flips when its
> predicate passes (§6.2 `core/unlock`). Genuine multi-element single-feature reveals are bespoke one-offs
> designed per case. This supersedes Q17's "deterministic one-per-beat queue."

> **Additive-schema note (Q45/FU5).** The **M0 skeleton** stores only `{ hp, satiety, attributePoints,
> character.level = 1 }` (plus `satietyMax`-at-floor derived). The heavier optional fields —
> `combat?` (`CombatEncounterState`), `influence[...].subEngines`, and the dialogue chosen-flags — are
> **ADDITIVE OPTIONAL fields added at their milestone** (M3/M5), **never** pre-declared in the M0 skeleton.
> New stored fields are always added **optional-with-defaults**, never removed/repurposed (§6.8.2).

> **Save envelope (metadata, not game logic).** The persisted blob is a thin envelope around `GameState` —
> `{ app: 'kami-kakushi', schemaVersion, saveCounter, savedAt, state: GameState }` — where `app` is the
> **app-identity magic field**, `saveCounter` is the **monotonic** newest-wins selector, and `savedAt` is
> the **save-layer timestamp tiebreaker** (a documented core-lint exemption — §6.1/§6.8.1). These agree
> byte-for-byte with the §6.8.1 selector and the §7 M0 DoD.

### Computed (never stored) — examples from `core/selectors`

`effectiveStats(state)` (base + additive + multiplier layers + equipment + milestones + the per-skill
`skillCombatBonus` perks, FU8); `satietyMax(state)` (base + per-level growth off `character.level`, Q47);
`durabilityBand(state, slot)` (maps the stored durability integer to the 4-band multiplier, Q33/FU17);
`gateProfile(state)` (the good/great/excellent distribution across the **revealed** pillars for the hybrid
tier-gate, Q7/FU10); `productionPerTick(state)`; `unlockedSurfaces(state)` (a pure projection of the stored `unlocked` Set — **not**
a live predicate re-eval); `currentTier(state)` and
`tierThresholdProgress(state)` (against the hybrid per-pillar-per-tier bands); `skillLevel(skillId, state)`
(from xp + curve); `timeToNextGoal(state)` (for the greyed next-purchase); and the clock derivations off the
**1-based** day index — `season(day) = floor((day − 1) / 30) mod 4` and `year(day) = 1 + floor((day − 1) / 120)`.
These are pure, cheap, memoizable per-snapshot, and **excluded from the save**.

> **Why this split matters:** it keeps the save tiny and forward-compatible (you only ever migrate
> non-derivable fields), makes the renderer a pure function of state, and means a balance retune (a curve
> change) instantly reflows every derived number with **no migration** — only stored facts ever migrate.
> Reinforced by the **additive-schema rule (§6.8.2):** new stored fields are added **optional with defaults**
> (never removed or repurposed), so most schema growth needs **no migration at all** — migrations are the
> rare safety-net, not the default.

---

## 6.4.1 Three combat tracks & the sequential per-tier phase gate (the data-model view)

This is the **data-level** restatement of the §1.6.4 canon — kept explicit here because conflating these is
the single likeliest regression (the superseded v1 model fused a "Combat Level = a Combat-Deeds pool" that
coupled all three). **The combat systems feed THREE clean, separately-stored tracks; they never collapse
into one bar.** Each writes to a *different* field, and **one kill** makes this concrete:

| # | Track | Stored in | Fed by — what **one kill** writes | Distinct from |
|---|---|---|---|---|
| 1 | **Character (combat) level** | `character.level` + `character.combatXp` | the kill's **combat-XP** (`MobDef.level · COMBAT_XP_K`, §4.6.5/FU15) → `combatXp` → `level`; **plus** the equipped **weapon-line skill** XP (in `skills`). HP, attribute-points, and (derived) `satietyMax` scale off `level`. | Arms (no pillar value) and the meter (no rung progress) |
| 2 | **The Arms pillar** | `influence[Arms]` (value/highWater) | **nothing** — *unless* the kill is a **recognised** clear/defend **deed**, and **only in the tier's Phase 2** (post-final-rung; FU7). A deed writes a `pillarDelta` via the rewards bus. | character level (kills don't grant pillar value) and the meter |
| 3 | **The Combat Rank rung-meter** | `ranks[tier].combatRank` (per-rung-RESET) | **nothing** — the meter is fed **only by per-rung CURATED activities** (a designed one-to-many set, FU6/FU7), not raw kills/XP. | character level and Arms |

**The sequential per-tier phase gate (FU7).** Each tier is climbed in two phases, and the phase marker is
**DERIVED from the current `rung`** — there is **no stored phase flag**:

- **Phase 1 — climb the rungs.** The two rung-meters (`estateService` labour, `combatRank` martial) advance
  on their **per-rung-RESET** thresholds; each promotion is the **AND-gate** (meter **≥** threshold **AND**
  the rung's story flags; FU6). Pillar **DEEDS do NOT accrue** here.
- **Phase 2 — grind the house up.** Reaching the tier's **final rung OPENS** the estate-influence / pillar
  grind; **now** `pillarDeltas` accrue (deeds + the seasonal judged result, up-only/new-high-water-mark).
  Clearing the **scaled grade-gate** (`gateProfile`, D-049/Q7/FU10 — `1 EXC + 1 GRT + (N−2) GOOD`) is what
  **tiers up** (sets `tier`). The revealed-pillar set grows **one per tier** (D-048) — **T0 = 1** (Estate),
  **T1 = 2** (+ Arms), **T2 = 3** (+ Office), **T3 = 4** (+ Name) — matching the §3 reveal schedule and the
  §2.16(e) four-bar-panel reveal (the gate never checks "good in ALL" against an unrevealed pillar). **Conditioning** stays the **ZERO-stat
  enablement gate** on the combat rungs, orthogonal to the bounded per-skill perks (§6.2 `core/skills`).

---

## 6.5 Content as data registries (data-as-code, single source of truth)

**All content is authored as plain, typed TypeScript data in `core/content`, one module per type** — consumed
by the pure core, never co-located with DOM or behaviour. This inverts both inspiration games' mistake of
binding data to the renderer, and it is the backbone of *generate-don't-duplicate*.

| Registry module | Holds | Keyed by |
|---|---|---|
| `content/resources.ts` | resources (koku, coin, wood, fish, materials…) + display/emoji + caps | `ResourceId` |
| `content/activities.ts` | jobs/labour nodes (farm/forage/woodcut/fish/craft) — yields, skill, season/area gates. **Plus per-rung CURATED activity sets** (tagged by rung) that feed the **rung-meter** (FU6/FU7) — authored **SEPARATELY** from the pillar-deed inventory (a designed one-to-many set, never a single repeat-counter). | `ActivityId` |
| `content/producers.ts` | late-game auto-producers — cost curve refs, output, unlock predicate | `ProducerId` |
| `content/skills.ts` | skills — xp curve refs, per-event cap, visibility threshold, milestones. **Plus a per-skill PERKS track** (~2–8 perks / small flat combat bonuses, **unlocked by leveling that skill**) — the bounded labour→combat channel (FU8). The §6.6 verifier asserts **each perk's magnitude is small** (not `== 0`, not a single global cap); **conditioning stays the ZERO-stat gate**. | `SkillId` |
| `content/items.ts` | items/equipment/consumables — slots, stats, rarity, quality rules. **Weapons are the growing V2 roster: ~9–10 across v1** (T0 **starts with 1**, then **+2 T0 / +3 T1 / +4 T2**; FU13), spread over **3 archetype lines (spear / sword / staff)**, **each weapon carrying archetype params (`baseSpeed` / `reach` / `targetCount`) + a signature ability** — byte-identical with §2.8/§2.10, §3 reveal rows, and §4.6. | `ItemId` |
| `content/recipes.ts` | crafting — inputs, station tier, quality-from-skill rules, disassembly | `RecipeId` |
| `content/enemies.ts` | the **grounded** bestiary (boars/wolves/monkeys/bandits/rōnin/smugglers — NO belief-creatures in spawn tables, canon §E) — stats, attackSpeed, loot tables, **and an explicit per-mob `level` field (`MobDef.level`, defaults ~ the dangerRing's expected character-level; FU15)** feeding the on-kill combat-XP path (§4.6.5). Belief-creatures live in `beliefBeasts.ts`, never here. | `EnemyId` |
| `content/world.ts` | the world-sim rules — `SeasonRules` / `Festival` / `WeatherHazard` — the bounded **±10%** *(proposed v1 balance)* mechanical modifiers, resolved **day-keyed** via `deriveDayKeyed` (§6.7.1), nothing stored (Q55/Q3/Q35) | `SeasonId` / `FestivalId` / `HazardId` |
| `content/beliefBeasts.ts` | the **belief-creatures** (the "one-eyed mountain god," "fox-fire fox," "yamanba/tengu") as **INVESTIGATE-then-confront one-shots** — deliberately kept **OUT of the grindable spawn tables** (canon §E); never a respawn population | `BeliefBeastId` |
| `content/areas.ts` | the full per-tier maps (T0–T2 in v1) — nodes, travel edges, conditioning gates, faction | `AreaId` |
| `content/dialogue.ts` | dialogue lines — text, display conditions, the rewards object, branch locks. **Plus `choices[]` + `ChoiceId`** with `locksLineIds[]` / `flags` effects — **intra-line branching as flat DATA (not scripting)**, deterministic; **only chosen-flags persist** (FU22/Q34). | `DialogueLineId` |
| `content/quests.ts` | quests — an **UNORDERED SET of advance-events** (`advanceEvents: QuestEventId[]`, **no `step` cursor, no fixed order**; D-Q-B14), rewards (open-ended, non-waypoint). A quest moves `taken → active` when accepted, completes (`done`) once its required advance-events are all in `advancedBy` **in any order**, and can `abandon`/`fail`; the `advance_quest` intent (§6.3) folds one event into the set. **NO quest-type budget** (Q23): the PEST/HUNT/CLEAR/DEFEND taxonomy is the **T0 starting set**, not a cap — author as many quests as fit each stage, more/interesting ones welcome (esp. later tiers). | `QuestId` |
| `content/scrolls.ts` | lore scrolls — in-game-time cost, the subsystem they unlock | `ScrollId` |
| `content/surfaces.ts` | every panel / screen / tab / row / button — its **unlock predicate** + which screen it lives on (drives the UI-reveal engine and multi-screen nav). **Includes the About/Credits surface** (authorship, the commit-SHA build stamp, font/audio attributions, the license note; Q54/Q51/Q50/Q52). | `SurfaceId` |
| `content/ranks.ts` | the **fresh rank ladder PER TIER** (T0/T1/T2 enumerated for v1) — rung, track (labour/combat/mixed), earn-condition, unlock. **Each rung carries its rung-meter threshold + the AND-gate (meter ≥ threshold AND story flags; FU6)** and references the per-rung **CURATED** activity set that feeds the meter. **Encodes the combat-reveal ladder** (R3 starter weapon + bare auto-resolve + retreat → R4 durability bands → R5 stance → first weapon-L10 ability/item slots → 2nd line T1 / 3rd line T2; FU12). | `RankId` |
| `content/influence.ts` | the four pillars + the **per-pillar-per-tier good/great/excellent band triples** (the V2 overhaul — *not* simple ratios; balanced against the fixed deed inventory; values cross-ref §4) + the **phase-2 deed gating** + the **cross-pillar combos** (**Model-A**, D-Q5: a combo credits **BOTH paired pillars'** display `value`, computed post trade-clamp; it does **NOT** write either pillar's deed-only `gateEligibleValue` — so a combo can never satisfy a required gate band nor breach trade-≤⅓; FU20/Q22) | `PillarId` / `DeedId` |
| `content/effects.ts` | buffs/injuries/status — magnitude, duration, stacking | `EffectId` |
| `content/balance.ts` | shared curve/constant definitions — the *single* home for tunables; §4 sets the values. The V2 set includes: **rung-meter thresholds** (FU6), the **good/great/excellent gate bands** (FU10), **per-skill perk magnitudes** (FU8), **durability bands** (75+/50+/1+/0 → 1.0/0.9/0.75/0.55; FU17), the **satiety throttle** (flat ≥~0.7 → ~0.5 floor; FU16/FU21), **weather ±10%** (Q35), the **combat-XP→level curve** + **`mobLevel` defaults** (FU14/FU15) — **all integer-pow only (no `Math.pow`, §6.1)**. *(All V2 magnitudes proposed v1 balance.)* | (named) |

**Rewards are one shape everywhere.** Dialogue, **dialogue choices**, quests, gathering thresholds, and
combat all grant the same `Rewards` object (`{ items?, xp?, resources?, unlocks?, areas?, recipes?, quests?,
flags?, dialogues?, pillarDeltas? }`), funnelled through `core/rewards.applyRewards`. Story flags and UI
reveals ride the *same* bus — so "story" and "UI growth" are one dependency graph (a reveal reads as plot,
not menu growth), exactly as §1/§3 require. **`pillarDeltas` (deed accrual) is PHASE-2-gated (FU7)** — deeds
write **no** pillar value during the rung-climb; they accrue only after the tier's final rung opens Phase 2.
The intra-line dialogue `choices[]` effects (chosen-flags / `locksLineIds[]`) ride this same bus (FU22).

---

## 6.6 The content verifier + generated docs (generate-don't-duplicate)

**Content verifier** (`src/scripts/verify-content.ts`, run in `npm run verify`): cross-checks every id/reference
across all registries (a recipe's inputs exist; an area's travel edges resolve; a quest's reward items exist;
a rank's unlock surface exists; every `SurfaceId` referenced by a screen is registered; no orphan ids). It
also asserts the **canon invariants** as machine checks so they cannot silently rot:

- no `EnemyId` in any spawn/population table is tagged `belief-creature` (canon §E); belief-creatures live
  **only** in `content/beliefBeasts.ts`, never in a grindable spawn table;
- the **trade** sub-engine of Estate & Wealth is capped at **≤⅓** of that pillar (canon §D) — and this holds
  **EVEN AFTER cross-pillar combos**: combos are **Model-A** (credit BOTH paired pillars' display `value`),
  computed **POST** the trade-clamp, and **never write the deed-only `gateEligibleValue`**, so the verifier
  **proves trade can never breach ⅓ via a combo** (the gate and the ≤⅓ denominator both read
  `gateEligibleValue` / the clamped sub-engines, not the combo-inflated display value; FU20/Q22; see §6.6.1);
- exactly **≤1** residual-ambiguity token exists across content (canon §A);
- no Influence path is a passive per-tick trickle or flat per-action increment (accrual is jump/judged only),
  and pillar **DEEDS accrue only in Phase 2** (no deed value before the tier's final rung; FU7);
- **the bounded labour→combat cross-feed (FLIPPED from the v1 wall, Q6/FU8):** **conditioning still grants
  ZERO combat stat / training-rate bonus** (the absolute check stays — conditioning is the weak→capable
  gate); BUT each **per-skill perk** grants a **SMALL** combat bonus — so the machine check is no longer
  "labour→combat `== 0`": the verifier asserts **each perk's MAGNITUDE is small** (a per-perk magnitude
  bound), **NOT** `== 0` and **NOT** a single global `≤ CAP` (see §6.6.1);
- **macron / no-plain-ASCII-romaji lint:** display/name strings use proper-Hepburn **macrons** (Tōkichi,
  Yagōemon, Kyūsuke, *gōshi*, *rōnin*, *kyō-masu*) — the verifier flags plain-ASCII romaji that should carry a
  macron, so no ASCII-slip can land in shipped text (canon §H). **Allow-list:** naturalized English exonyms —
  *shogun, yokai, samurai, Osaka, daimyō* (written with its macron) — plus the **invented-place
  allow-list incl. *Nihonbashi*** (Q12) are exempt and may stay in their common form. The lint examples track
  the **"Combat Standing" → "Combat Rank"** rename (Q9), and the lint cross-links the **real-name DENYLIST**
  (§6.6.1).

**Generated docs** (`src/scripts/gen-docs.ts`): a Node entry that imports the same registries the game runs on and
writes balance/content tables into `docs/` — aligned to **`docs/balance/`** (e.g. `docs/balance/curves.md`,
`docs/balance/gates.md`) and **`docs/content/`** (e.g. `docs/content/bestiary.md`, `docs/content/areas.md`,
`docs/content/ranks.md`, `docs/content/influence.md`). Run with `--check` in `verify` to fail the build if the
committed docs drift from the data. This is the convention *generate, don't duplicate* made literal:
balance/content tables are **never hand-maintained twice** — they are a build artifact of the one source of
truth. Any illustrative number duplicated **in prose** is tagged **"illustrative — see generated"** (Q41) so a
hand-typed derived value can never silently drift from its generated source.

---

## 6.6.1 V2 verifier invariants

The V2 decisions add a cluster of machine checks (collected here; run inside `verify-content.ts` alongside the
§6.6 canon invariants). These exist so the load-bearing V2 properties **cannot silently regress** — especially
the three-track separation and the hybrid gate.

- **Gate-monotonicity & ceiling (Q28).** No rung's rung-meter threshold and no tier's hybrid gate require
  **more than that tier can grant** (the meter target exists and is reachable from its eligible activities;
  the gate band is achievable from the tier's available deeds). Asserted against the **same ≥30-min floor**
  the §4.8 pacing model uses (FU6) — so the rung-meter thresholds and the §4.8 pacing curve cannot diverge.
- **Accrual tie-out (Q28).** The tier's **deed inventory sums to the gate share within tolerance** — the
  fixed Phase-2 deed inventory (e.g. T0's Estate/Arms deeds) ties out against the re-derived hybrid bands, so
  a balance edit on one side that breaks the other fails the build.
- **Per-rung-meter reachability (FU6).** Each rung's meter target is reachable from its **eligible curated
  activities** at the back-solved rate; an un-feedable meter is a build failure.
- **Per-skill-perk magnitude (the FLIP, Q6/FU8).** Each per-skill perk's `skillCombatBonus` is **small /
  bounded** (a per-perk magnitude check) — **not** `== 0` (the old absolute wall is removed) and **not** a
  single global `≤ CAP`; **conditioning is asserted ZERO** (still the gate). Each of the **three combat
  tracks sums INDEPENDENTLY** (a kill's XP never reaches Arms or the rung-meter; a deed never reaches level
  or the meter; a curated activity never reaches level or Arms) — FU14.
- **Trade-≤⅓-holds-post-combo proof (FU20/Q22 · D-Q5).** The verifier proves the **trade sub-engine ≤⅓ of
  Estate & Wealth even after cross-pillar combos**. Combos are **Model-A** (credit BOTH paired pillars'
  display `value`), computed post-clamp, and **never write the deed-only `gateEligibleValue`** — and since
  Estate's pillar value is itself **purely derived** from the clamped sub-engines (D-Q-estate-dent, never
  stored), a combo can **never** breach ⅓.
- **Scaled grade-gate distribution check (D-049/Q7/FU10).** The tier-gate is **`1 EXCELLENT + 1 GREAT +
  (N−2) GOOD`** over the **N revealed** pillars, all ≥ GOOD (**T0 = 1 pillar → a single EXCELLENT**), with
  **NO** overflow-substitution; and the gate reads each pillar's deed-only **`gateEligibleValue`** (NOT the
  combo-inflated display value), so a **combo can never** satisfy a required pillar or the gate. The
  revealed-pillar set grows **one per tier** (**T0 = 1 / T1 = 2 / T2 = 3 / T3 = 4** — Name is the 4th, gated
  at **T3 Region** per D-048; the full four are revealed by T3)
  must match the §3 reveal schedule and the §2.16(e) panel reveal (the gate never checks an unrevealed
  pillar).
- **`gatesSpine` always-false in v1 (B13/D-Q3 consequence).** The quest `gatesSpine` flag has **no v1
  consumer** — the verifier asserts **`gatesSpine === false` for every quest in v1 content** (no quest gates
  the main spine), so a stray `true` can't silently introduce a hard story-gate the v1 design never wired up.
- **Real-name DENYLIST lint (Q27/Q28/Q39/Q11).** A denylist flags **real surnames / places** (e.g. *Toyama*,
  *Konoe*, real daimyō / place names) so an invented-name slip can't land in shipped strings — maintained
  alongside the macron lint. **Allow-list:** naturalized exonyms + the **invented-place allow-list (incl.
  *Nihonbashi*, Q12)**. It also flags the **superseded** names **Mago** / **Naozane** / **Obaa Sato** so they can't be
  reintroduced; the shipped names are **Heita** / **Mosuke** / **Obaa Kuni** (field-lad **Heita** ≠ antagonist **Magobei**; clerk **Mosuke** ≠ heir **Naoyuki**; herbalist **Obaa Kuni** ≠ **Sayo**).
- **Tick split-invariance & full-drain (B10).** A determinism check asserts `tick(s, a + b) === tick(tick(s,
  a), b)` for non-negative integers `a, b` (the scheduler folds **one tick at a time**, per-day/week/season
  plans fire once each in **fixed registry order**), and that a multi-season `dtTicks` jump **drains the
  `pendingAppraisals` counter fully** (accrues all N appraisals, never collapsing them) — so a long jump can
  never silently skip an appraisal.
- **Unlock-latch monotonicity (FU4).** A guard asserts a surface **never leaves `unlocked` once entered** — `reduce`/`tick` only ever ADD to the latch (write-once); a scripted run that re-checks every prior unlock after each step proves no `SurfaceId` is ever removed.
- **Save-envelope-size budget.** The persisted envelope stays within a size budget (**≤ ~64 KB typical**), provable from the **bounded** collections — the persisted log **tail (~50 lines)**, capped inventory/equipment/quest/flag sets — so no field is an unbounded persisted growth (ties to the `LOG_RING_MAX ≈ 300` ring eviction, §6.4/§6.8).

---

## 6.7 The one seeded RNG

**One seeded RNG for the entire game** (canon §H, convention *one RNG*). A small, fast, well-distributed
generator — **splitmix64** (LOCKED, §6.13 #2), seeded at new-game from a stored seed.

> **Exact-arithmetic mandate (D-Q-numeric / Q16+Q17).** splitmix64's mixing needs full 64-bit integer
> arithmetic, which is **not exact** in a JS `number` (53-bit-safe integers only). To guarantee
> **byte-identical replay**, the seed + cursor state is held and advanced either **as `BigInt`** (exact 64-bit)
> **or** via a **53-bit-safe splitmix variant** whose every intermediate stays within ±2^53 — chosen so cursor
> arithmetic is **exact** with no silent precision loss. The choice is **unit-asserted** against a fixed
> reference sequence. Whichever is used, the *persisted* cursors serialize losslessly (a `BigInt` as a
> decimal/hex string in the envelope; a 53-bit-safe variant as plain integers).

- **It is part of `GameState`** as **per-named-stream MONOTONIC cursors** —
  `state.rng = { seed, cursors: { combat, loot, seasonal, worldgen } }` — and is **saved & loaded**, so
  resumed games stay deterministic and reproduce exactly. (This **replaces** the v1 `{ seed, counter }` shape
  *and* the "derive child RNGs by splitting" model: each named subsystem advances **its own** cursor, so
  combat rolls, loot rolls, seasonal rolls, and world-gen rolls are reproducible **without coupling**, still
  rooted in the one seed.)
- The API is **pure**: `next(rng, stream) -> [n, rng']` returns the value *and* the advanced RNG (only that
  stream's cursor moves); helpers (`rngInt`, `rngChance`, `rngPick`, `rngWeighted`) thread the new RNG back
  into `GameState` via `reduce`/`tick`. **Combat and loot** are the v1-active named streams; the **seasonal and
  worldgen** cursors are **declared for forward-compat** and **no v1 consumer advances them** (FU3 — so the
  cursor-usage verifier won't flag them as forever-zero). **Dialogue stays no-RNG** (§2.12).
- **`Math.random()` is banned in `core/` by lint** (§6.1) — there is no second, hidden source of randomness —
  and so are **`Math.pow` / `Math.exp` / `Math.log` / trig** (§6.1, Q36): every growth-curve power is
  integer-pow, so a fixed seed replays **byte-identically** across engines and an exported save is portable.
- **Weather / festival rolls are NOT a persisted cursor.** They are re-derived **stateless and
  day-keyed** via `deriveDayKeyed(seed, 'weather'|'festival', day)` (§6.7.1) — nothing weather-related is
  stored. **Lunar phase is NOT a roll at all** — it is a real continuous ~29.5-day ephemeris,
  `lunarPhase(day) = f(absoluteDay mod LUNAR_PERIOD)`, derived off the absolute monotonic day alone (no seed,
  no RNG; §6.7.1).
- **`tick` consumes whole-integer `dtTicks`** (the app loop accumulates the fractional remainder; §6.3) so
  the abstract clock advances in deterministic integer steps.

> This is what lets a saved fight resume identically, lets the DEV play API force a rare loot/crit outcome by
> seed, and lets Vitest assert byte-identical replays.

---

## 6.7.1 Stateless day-keyed derivations (weather / festivals) + the lunar ephemeris

Anything that is a **pure function of `(seed, day)`** is **derived on read, never stored** — so the save stays
minimal and replays stay byte-identical. The helper is:

```ts
// PURE & STATELESS — not a persisted cursor; no GameState mutation.
function deriveDayKeyed(seed: number, channel: 'weather' | 'festival', day: number): number;
// RETURNS a NORMALIZED fraction ∈ [0, 1) — e.g. (splitmix64(mix(seed, channel, day)) mod 2^53) / 2^53 —
// so the ±10% weather / judged bands are well-defined and replay-stable.

// Lunar phase is NOT a seed-keyed roll — it is a REAL continuous ~29.5-day ephemeris (D-Q6):
// PURE & STATELESS, a deterministic function of the absolute monotonic `day` ALONE (no seed, no RNG).
function lunarPhase(day: number): number;   // f(day mod LUNAR_PERIOD), LUNAR_PERIOD ≈ 29.5; ∈ [0, 1) — new→full→new, continuous
```

- **Weather / festival modifiers** are reproduced from `seed + day` whenever the per-day scheduler (§6.3) or
  a selector needs them — e.g. the bounded **±10%** *(proposed v1 balance)* mechanical modifier on the
  seasonal judged result, or the day's weather hazard. Because they are recomputed (not stored), they **cost
  nothing in the save**, **never go stale**, and **can never desync** from the seed.
- **Lunar phase is a real ephemeris, not a roll (D-Q6).** It is a **continuous ~29.5-day cycle** computed as
  `f(absoluteDay mod LUNAR_PERIOD)` — a smooth new→full→new progression, **deterministic off the absolute
  monotonic `day` alone** (no seed, no RNG cursor, no per-day randomness). This is why season/year (§6.4) and
  the moon are all **derived from `day`** rather than stored: they can never desync.
- This is **distinct** from the four persisted RNG cursors (§6.7): the cursors are *consumed* monotonically
  by gameplay (combat/loot/seasonal/worldgen draws), whereas `deriveDayKeyed` is a **stateless re-derivation**
  keyed by the calendar day and `lunarPhase` is a **deterministic ephemeris**. The **only** non-derivable
  economy state is `market.saturation` (§6.4) — weather, lunar phase, season and year are not stored at all.

---

## 6.8 Save model — multi-backend redundant atomic save, additive-schema minimal-state

Per **D-013 / canon §H** and the V2 decisions (Q37/Q44/Q45/Q46/FU1–FU2/FU5): robust, durable,
static-friendly, **no backend** — and now hardened to survive **itch's cross-origin-iframe partition /
eviction**. The **FULL layer is built in M0** (FU1); rich per-system fields are added additively later.

- **Multi-backend redundant store (Q37/FU1).** The save is written **redundantly to every available
  backend** — **IndexedDB (primary) + localStorage + sessionStorage** — behind a backend-abstraction. On
  load it reads **ALL** backends and **picks the newest** (§6.8.1). Redundancy hedges the *non*-partitioned
  failure cases (a single backend wiped or isolated) — but it is **NOT** failure-independent inside itch's
  cross-origin iframe, where the three may share **one partition** (redundancy degrades to ~1 effective
  there); the **real** durability guarantee is the crash-recovery last-known-good ring (§6.8.3) + export/import
  (Block N.1 #5, §6.8.1). Autosave fires on a debounced cadence (after meaningful intents and **on a tick
  interval** — also a §7 M0 DoD trigger) and on `visibilitychange`/`beforeunload`.
- **Atomic write (Q44).** Each backend gets **one atomic put** of the whole envelope — **never** a
  clear-then-rewrite (no torn/half-written save). On **any** write rejection (quota / private-mode /
  torn write) the app shows a **calm, persistent "couldn't save — export a backup" banner** — **no silent
  loss** (§6.8.1).
- **App-identity magic field (Q46).** Every blob carries `app: 'kami-kakushi'` for a fast reject of
  foreign/corrupt data; on a bad/foreign id the loader **rejects to recovery** (offer re-import / fresh
  start), never a silent half-load (§6.8.1).
- **Export / import: base64 to a text file (Q37).** The same serialized envelope is base64-encoded for
  copy-paste / file export and import — the player's **portable backup** (and a hand-off path for QA). It is
  kept as a **first-class, periodically-nudged backup** (the matrix-plus-nudge posture) so silent autosave
  loss is caught early. Import validates the magic field + migrates.
- **Persist only non-derivable state (§6.4).** The save is the **stored** surface of `GameState` wrapped in
  the metadata envelope `{ app, schemaVersion, saveCounter, savedAt, state }`: **RNG cursors** (`seed` +
  `cursors{combat,loot,seasonal,worldgen}` — *not* a single counter), **clock (absolute `day` + `tick` only —
  season/year/lunar are DERIVED, not stored; D-Q6)**, current area, resources, producer counts,
  **`market.saturation`**, skill xp, base attributes, current vitals (hp / satiety / attribute-points),
  **`character.level` + `combatXp`**, inventory, equipment, influence pillars (high-water + dents + the
  deed-only **`gateEligibleValue`**; non-Estate `value` — but **Estate value is DERIVED from
  `estateWealth.subEngines`, NOT stored**, §6.4/D-Q-estate-dent), stored tier, the **per-rung-reset
  rung-meters** (`estateService` / `combatRank`), reputation, allegiance, the **`seasonalAppraisal`**
  (`pendingAppraisals` counter + last-judged high-water; B10), flags (incl. **dialogue chosen-flags**),
  unlocked surfaces, **quest status (the order-free `advancedBy` set, no step cursor; D-Q-B14)**, counts, the
  live combat encounter (present only while a fight is live), **only a small TAIL (~50 lines) of the event-log
  ring** (`LOG_RING_MAX ≈ 300`, §6.4 — the rest is runtime-only), active-effect remainders, settings.
  **Heavier optional fields are added additively per milestone** (M3/M5), never pre-declared at M0. **All
  derived stats are recomputed on load** by the selectors — never serialized (weather is re-derived
  day-keyed, lunar is a derived ephemeris, season/year derive from `day`; §6.7.1).
- **Additive-schema-first, migrations as the safety net (Q45/FU5).** New stored fields are added as
  **optional with defaults** (never removed/repurposed) so **most schema growth needs no migration at all**;
  the ordered migration chain + raw pre-migration backup + future-version guard remain the **rare safety net**
  for unavoidable structural changes (§6.8.2).
- **Validate + degrade gracefully on load (`validateLoadedState()`, D-Q9).** A `validateLoadedState()` gate
  sits at the **persistence→core boundary** (after migration, before the state reaches the running core). It
  **clamps/defaults cosmetic out-of-range fields** (e.g. an off-range `settings.textScale`, a negative count)
  so a trivially-dirty field never becomes a wall; but a **structurally-broken / unsalvageable** state
  (NaN/missing-required/internal-bug residue, or a corrupt/unreadable/foreign-id save) is **routed to the
  existing §6.8 recovery flow** (offer re-import or a fresh start) — **never** a scary "save is kill" wall and
  **never** a dead end (it honours the Q44 calm **"couldn't save / export a backup"** posture). It also
  **re-asserts the load-bearing core invariants ON LOAD** — the **trade-≤⅓** sub-engine clamp and the
  **up-only / high-water-mark** pillar rule — re-establishing them from the loaded data (Estate value is
  re-derived from the clamped sub-engines, §6.4) so no hand-edited or bit-rotted save can smuggle in an
  out-of-contract pillar/trade state. A pre-migration backup of the raw bytes is kept so a failed migration is
  recoverable.
- **Save-safety on destructive actions (Q19).** Genuinely-destructive actions (import-over,
  fresh-start, and only truly-unrecoverable rare actions) require an **explicit confirm**, and an
  **automatic pre-overwrite snapshot** (an extra write in the multi-backend matrix) is taken **before** any
  overwrite — so a misclick is recoverable.
- **Multi-tab play is UNSUPPORTED in v1 (D-Q7).** There is **no leader-election / no cross-tab lock** — two
  tabs open on the same game is **last-writer-wins** (the most recent successful save overwrites). We accept
  this footgun for v1 (cheapest option) and **document it** rather than build coordination; revisit only if it
  bites. (The newest-wins `saveCounter` selector still picks the most recent blob on the next load, but
  concurrent tabs can still clobber each other's progress mid-session.)
- **No offline accrual on load.** Active-only: load restores the exact saved `GameState` and resumes; there is
  no time-skip catch-up.

**Persistence lives in `src/persistence/`** (the multi-backend access layer, the atomic write + magic field +
newest-wins selector, the base64 codec, the migration chain). It is side-effectful and is **never imported by
`core`** — `core` only produces the plain serializable `GameState`; the app layer wraps it in the envelope and
hands it to persistence. (The only wall-clock read in the whole app — `Date.now` for `savedAt` — lives here,
under the documented §6.1 save-layer exemption.)

---

## 6.8.1 Multi-backend redundant save + newest-wins arbitration

> Spec for the redundant write + the newest-wins **selector**. Built **in full at M0** (FU1) — only the itch
> cross-origin-iframe *acceptance test* is deferred to M7.

- **Redundant write.** On save, the app writes the **same envelope** atomically to **IndexedDB +
  localStorage + sessionStorage** (whichever are available). Each is **one atomic put** of the whole blob
  (never clear-then-rewrite). On any backend's rejection, the calm **"couldn't save — export a backup"**
  banner is shown and stays until a save succeeds — never silent loss (Q44).
- **Honesty about redundancy under itch's iframe (Block N.1 #5).** These three backends are **NOT
  failure-independent inside itch's cross-origin iframe**: there they may share **one storage partition**, so
  the redundancy can degrade to **~1 effective backend** (a partition eviction can take all three at once). We
  therefore make **no unqualified "3× redundant" claim**. The multi-backend write is a best-effort hedge
  across the *non*-partitioned cases; the **REAL durability guarantee** is the **crash-recovery
  last-known-good ring (§6.8.3) + the player-facing export/import backup** — which is why both are first-class
  and the export backup is periodically nudged.
- **App-identity magic field.** Each blob leads with `app: 'kami-kakushi'`; on load a blob whose `app`
  differs (foreign/corrupt) is **rejected to recovery**, never half-loaded (Q46).
- **Newest-wins selector (FU2).** On load the app reads **every** backend and selects the newest **readable**
  one by this order:
  1. **the monotonic `saveCounter` is the REAL selector** — it increments once per successful save and is
     immune to clock skew;
  2. the **save-layer `savedAt` timestamp is only the TIEBREAKER** (a documented **core-lint exemption** —
     *metadata, not game logic*, §6.1) when counters are equal;
  3. **NEVER load a forward-`schemaVersion` backend** (a future-version blob from a newer/CDN-stale build has
     no forward migration) — **fall through** to the newest *readable* lower-or-equal-version backend; if none
     is loadable, **reject to recovery** (preserve the raw bytes for re-import in a newer build) — never a
     silent half-load and never a downgrade that overwrites the real autosave.
- **Agreement.** This selector, the §6.4 stored envelope metadata (`app` / `saveCounter` / `savedAt`), the
  §6.1 save-layer lint exemption, and the §7 M0 Definition-of-Done describe **one** mechanism.

---

## 6.8.2 Additive backwards-compatible schema & migration safety net

> Makes the **additive-optional-fields** model the **PRIMARY** schema-growth mechanism (protobuf/thrift-style),
> with ordered migrations demoted to a rare safety net (Q45/FU5).

- **Primary mechanism — additive optional fields with defaults.** New stored fields are added **optional,
  with a default** applied on read, and existing fields are **never removed or repurposed**. An older save
  loaded by a newer build simply reads the new fields as their defaults — **no migration needed.** This is why
  the M0 skeleton (`{ hp, satiety, attributePoints, character.level }`) can grow into the full V2 state
  (`combat?`, `estateWealth.subEngines`, dialogue chosen-flags, the rung-meters…) **additively, per milestone
  (M3/M5)**, without a migration per field.
- **Safety net — ordered migrations (rare).** For the unavoidable **structural** change that additivity can't
  express, `schemaVersion` is stored and an ordered list of `migrate_vN_to_vN+1(save)` steps runs on load to
  bring an old save current (each migration a pure, unit-tested function, in `persistence/migrations/`). A
  **raw pre-migration backup** of the bytes is kept so a failed migration is recoverable.
- **Future-version guard.** A save whose `schemaVersion` **exceeds** the running build's takes the same calm
  degrade-gracefully recovery as a corrupt save (raw bytes preserved for re-import in a newer build) — never a
  silent half-load (ties to the §6.8.1 forward-version fall-through).
- **Pre-overwrite snapshot.** Before any overwrite of the live autosave (incl. import-over / fresh-start), an
  automatic snapshot is taken (Q19). We support ordered forward migrations indefinitely + the raw backup,
  but do **not** guarantee cross-major-rewrite compatibility — a future ground-up schema change may legitimately
  retire very old saves with a clear message.

---

## 6.8.3 Crash recovery — error boundary, last-known-good ring, safe-mode boot (D-Q-B12)

> A new lock (B12 → ADR): the save layer is durable, but a **poisoned in-memory state** (an internal bug that
> throws in `tick`/`render`, or a NaN that propagates) must not (a) hard-brick the app, nor (b) get autosaved
> over the last good state. This subsection is the **real durability guarantee** referenced by §6.8.1.

- **Error boundary around `tick`/`render`.** The app-layer loop wraps each `tick(state, dt)` and each
  `render(state, prev)` in an **error boundary**. An uncaught throw is **caught** (not a white-screen) — the
  app stops advancing the loop, surfaces a calm error surface, and enters the recovery path below instead of
  crashing the tab.
- **Crash-counter persisted OUTSIDE `GameState`.** A small `crashCounter` (+ last-crash marker) lives in its
  **own persistence key**, *not* inside `GameState` / the save envelope — so a poisoned save can't carry a
  reset/garbled counter, and the counter survives a failed load. It increments on a caught crash and resets on
  a clean run.
- **Rolling last-known-good save RING.** Beyond the single autosave, the persistence layer keeps a **small
  ring of recent KNOWN-GOOD snapshots** (states that completed a clean tick+render and passed
  `validateLoadedState`). Recovery / safe-mode can **roll back** to the newest good ring entry.
- **Autosave-poison suppression.** A state that just **threw** (or fails `validateLoadedState`) is **NEVER
  written over the good ring** — the autosave is **suppressed** for a poisoned state so the last-known-good
  entries stay intact. (This is the §6.8.1 durability guarantee in practice: even where backend redundancy
  collapses, the good ring + export/import are what actually saves the player.)
- **Repeated-crash → safe-mode boot.** If `crashCounter` exceeds a small threshold across boots, the app
  boots into **safe mode**: it does **not** auto-resume the (suspected-poison) live autosave but instead
  **offers a rollback** to the newest last-known-good ring entry (or a raw-bytes export / fresh start) — a
  calm, explained choice, never a silent loss and never an infinite crash-loop.

---

## 6.9 Renderer contract (thin DOM, multi-screen, responsive, active-only)

**The renderer is a thin DOM layer in `src/ui/` with zero game logic** (D-013). It is a (near-)pure function
of `GameState`: `render(state, prevState)` reconciles the DOM against the new snapshot; it does **not** compute
outcomes and does **not** mutate state — it only **dispatches intents** back to the core. The combat renderer
animates the deterministic result (filling bars, floating numbers); it never decides the fight.

**Reveal-on-load (no re-spam).** On load the renderer's `prevState` is set to the **loaded `GameState`**, so the
first `render(state, state)` yields an **empty reveal diff** — no re-animation, no re-played reveal lines.
Once-per-game reveal log-lines are emitted by the `unlocked` write-once latch **inside `reduce`/`tick`** (§6.3),
**not** by the renderer diff — so reloading a save never re-spams the log. *(Test note: `load(save)` →
`render(state, state)` produces **zero animations and zero new log lines**.)*

- **Data-driven surfaces.** Every panel/screen/tab/row/button is described by `core/content/surfaces.ts` with
  an unlock predicate; the renderer shows only `unlockedSurfaces(state)`. "The UI is incremental" is a tunable
  content table, **not** hardcoded view logic. **Reveals are DESIGN-staggered one-at-a-time** (the
  NO-UI-DUMPS principle) driven by the **authored unlock schedule** — there is **no runtime reveal-queue**
  (FU4/Q17); the renderer just shows the surfaces in `state.unlocked` (the stored write-once latch — §6.4),
  never a live predicate re-eval. Each first-time reveal pushes a diegetic line to the event log (the reveal
  reads as plot) — emitted by the `reduce`/`tick` latch transition (§6.3), not the renderer diff.
- **Multi-screen UI, progressively revealed (canon §H).** There is a real multi-screen shell with navigation
  (e.g. Estate / Village / Wilds / Skills / Combat / Influence / Map / Journal / Settings screens), but
  **nav and screens are revealed as earned** — so it *appears single-screen early* (minute one is one verb +
  the log) and grows into a full multi-screen app. The nav is itself driven by unlock predicates. **Distinct
  activities get their OWN top-level nav tabs (Q10) — Crafting and Quests are top-level tabs, NOT nested
  panels** — so the **main screen stays the active labour/deeds/combat loop**; any distinct non-critical
  activity gets its own top-level tab (still revealed one-at-a-time).
- **Responsive desktop + mobile, NOT hover-dependent (canon §H).** A fluid layout (CSS grid/flex,
  container/media queries) that reflows columns→stacked on narrow screens; **all information reachable without
  hover** — any hover tooltip has a tap/focus-equivalent, and "Shift for more detail" is an *enhancement*, never
  the only path to a value. Touch targets are comfortably sized. **Mobile IA rule (Q19):** the **per-tier
  PRIMARY tabs** (the current tier's core surfaces) sit on the **bottom bar**; older/secondary tabs move to an
  **overflow drawer in reveal order**, so the bottom bar never overflows as the app grows.
- **Art register = text + emoji + inline SVG + CSS + a small audio set (D-013 / canon §H; Q38/Q50).**
  Woodblock-style palette, kanji season tags, colour-coded rarities, CSS flourishes; **inline SVG for
  load-bearing period motifs** (pillar / season / rarity / rank-seal marks — identical across OSes; **emoji are
  COSMETIC-ONLY**), plus the **small curated audio set** (synthesized Web Audio + original/CC0 — §6.1.1). A
  small canvas is permitted ONLY for optional ambient FX (seasonal particles), **never for logic**. Colour is
  never the *sole* carrier of meaning (see §6.11).
- **Legible progression feedback (cross-ref `ui-design.md`; Q21/Q48).** **Pillar bars show distance-to-next-gate**;
  gain/loss **number-flash uses the §2 gain/loss tokens**; **vermilion is reserved for rank-up / seal beats**
  (not routine gains); **functional/hint text uses `--ink-soft`** (passes WCAG AA on every paper surface) while
  `--ink-faint` is decorative-only, and the meter fill is darkened for contrast.
- **Number formatting = abbreviated K/M/B (canon §H).** Large values display **human-scaled, abbreviated**
  (e.g. `12.4K`, `3.1M`, `2.7B`) — **not** scientific notation (`1.2e7`) and **not** myriad units
  (man/oku). A single shared display formatter **lives in `core/format`** (a pure helper — and the other pure
  display helpers — moved OUT of `src/ui/` into core, **table-driven boundary tests under `npm run verify`**:
  `999,999 → '1.0M'`, etc.); **the renderer imports it**. It keeps the scale legible as koku/coin/pillar
  numbers climb.
- **Active-only loop, with the "leave it running" feel (FU23).** The app-layer tick loop runs **whenever the
  tab is OPEN** (driven by `requestAnimationFrame` / a paced timer); it computes whole-integer `dtTicks` from
  **elapsed wall-time while open** and calls the pure `tick`. **While the tab is OPEN, auto-resolve combat +
  auto-repeat labour run unattended for hours** (the "leave it running, check progress" feel) — but it is
  **strictly active-only: no offline catch-up**, and auto-producers stay **T4+**. **Backgrounding does NOT
  pause** (D-053): a hidden tab is throttled by the browser but **catches up** on the elapsed wall-time when it
  regains cycles — the clock advances while OPEN and **stops only when the tab is CLOSED** (autosave fires on
  `visibilitychange`/`beforeunload`, §6.8, so a close is never lossy); an explicit user **pause** is still supported.
- **One render path.** Updates go through `render(state)` reconciliation — not scattered manual
  `update_displayed_*` push-calls — which kills the stale-UI class of bug by construction.
- **Log DOM-node lifecycle.** The log renderer **reconciles by keyed `id`** and **removes / virtualizes the
  DOM nodes for evicted ring entries** — so the **live log-node count stays ≤ the `LOG_RING_MAX ≈ 300` ring
  cap** (§6.4/`core/log`) over an hours-long unattended run; this **live log-node-count ≤ ring-cap** budget is
  an assertion in the M6 long-run perf/audit sweep.
- **XSS guardrail (untrusted-text safety).** Every **state-derived / persisted / IMPORTED** string — the
  **event log above all** — renders via **`textContent` / `createElement`'d fragments**, **never** `innerHTML`
  and **never** a markup parser run over persisted text. The log persists **`{ messageId, args }`**, not
  resolved markup, so text is templated at render time. The **imported save is the sole untrusted-text
  channel**, so this closes the only injection surface.

---

## 6.10 The DEV play API (`window.__qa`) — playtest by code

**A DEV-only play API on `window.__qa`** (canon: *playtest via code, not synthetic input*; the
`capture-game-states` skill consumes it). It is attached **only when `import.meta.env.DEV`** and is
dead-code-eliminated from the production bundle.

```ts
window.__qa = {
  state(): GameState,                       // read the current snapshot
  dispatch(intent: Intent): void,           // drive any player verb (same intents the UI uses)
  // convenience verb wrappers: rake(), activity(id), travel(id), buy(id), equip(id,slot), ...
  tick(dtTicks: number): void,              // advance the abstract clock by N ticks
  frames(n: number, dtPerFrame?: number): void,  // step N render frames (for capture/pacing)
  pause(): void, resume(): void,            // control the active loop
  newGame(seed?: number): void,             // deterministic fresh start from a seed
  save(): string, load(b64: string): void,  // round-trip the save (base64)
  forceState(patch: DeepPartial<GameState>): void,  // jump to a late unlock / rare outcome / terminal screen
  setSeed(seed: number): void,              // pin RNG for reproducible rare rolls
  pacing(): PacingTelemetry,                // accumulated fun-proxy metrics this run (qa-playtesting.md §3)
  reveals(): RevealLogEntry[],              // what unlocked + when (tick/season) — the reveal-cadence proxy (qa-playtesting.md §1)
  advanceSeason(): void, toRung(id: RankId): void, toTier(n: TierId): void,  // time-compression helpers — fast-forward to a checkpoint (qa-playtesting.md §1)
  selectors: { unlocked(): SurfaceId[]; tier(): TierId; production(): ... },  // read-only derived reads
};
```

This lets us **headlessly drive and observe** the game: assert that each unlock fires at the intended
`GameState`, that pacing milestones (reveal cadence; time-to-next-goal) hit on schedule, that a forced rare
outcome renders correctly, and capture screenshots/recordings of any state for QA — all without synthetic
mouse/keyboard input. The same typed `Intent`s the UI dispatches are what `__qa` drives, so a headless run
exercises the real code paths.

---

## 6.11 Accessibility basics

Solid basics (canon §H), wired so they cannot be an afterthought — and the **low-cost correctness items are
done now** (Q18):

- **Scalable text** (a `textScale` setting on `GameState.settings`, applied via CSS custom property; respects
  the browser/root font size). A **large-textScale reflow case** is included in the acceptance checks (the
  layout must not clip/overlap at the largest scale).
- **Colourblind-safe cues:** colour is *never* the sole signal — rarities/severities also carry an
  icon/inline-SVG and/or text label; a `colourblindMode` setting swaps to a safe palette.
- **Contrast (Q48):** **functional/hint text uses `--ink-soft`** (passes WCAG AA on every paper surface);
  **`--ink-faint` is decorative-only** (never carries a value); the meter fill is **darkened for contrast**.
- **Keyboard + touch:** full keyboard operability (focus order, visible focus ring, no hover-only controls —
  ties to §6.9's not-hover-dependent rule) **and** comfortable touch targets.
- **Reduced motion:** a `reducedMotion` setting (and `prefers-reduced-motion` honoured) downgrades the ambient
  canvas FX and number-float animations.
- **Pause:** the active loop can be paused (also an accessibility/comfort feature).
- **Semantic structure + live region (Q18):** the event/story log is an ARIA live region (with an accessible
  name), **scoped to narration + milestones (`polite`)** so reveals/important events are announced to
  assistive tech without spamming routine ticks; the shell uses **named ARIA landmarks** (`banner` header,
  `navigation` rail, `main` workspace) and labelled controls, plus a **skip-to-log / skip-to-content link**
  and a **persistent quiet a11y entry point from minute one** so keyboard and screen-reader users jump
  straight to the content instead of tabbing through the growing (~9-entry) nav on every screen. A
  **screen-reader acceptance pass** is part of the checklist.
- **Language of parts (WCAG 3.1.2):** every Japanese-script run (kanji pillar/rank/season labels, incl.
  *gōshi*/*rōnin* and the **"Combat Rank"** term) is marked `lang="ja"` and romanized terms `lang="ja-Latn"`,
  so assistive tech pronounces them instead of reading Unicode glyph names or skipping them; the §6.6
  romanization lint also flags any untagged CJK in rendered strings.
- **Mute:** light ambient beds + UI/event SFX (the §6.1.1 curated set) with a mute toggle (canon §H audio note).

---

## 6.12 How this satisfies the project conventions

| Convention (CLAUDE.md) | How §6 satisfies it |
|---|---|
| **Pure-core boundary** | All logic/state/math in `src/core/` with **zero DOM/canvas/window** — enforced by an ESLint boundary rule (build failure, not review). Renderer consumes plain data; one-directional dependency. The only wall-clock read (`Date.now` for the save-`savedAt` tiebreaker) is a **documented save-layer exemption** in `persistence/`, never in core. (§6.2, §6.1) |
| **Determinism: one RNG** | A single seeded RNG **in `GameState`** as **per-named-stream MONOTONIC cursors** `{ seed, cursors:{combat,loot,seasonal,worldgen} }`, saved/loaded; pure per-stream `next` (no child-RNG-by-splitting); **stateless day-keyed weather/lunar** (re-derived, not stored); **`Math.random()` AND `Math.pow`/`exp`/`log`/trig lint-banned** in core (integer-pow only). Replays are byte-identical (Vitest-asserted). (§6.7, §6.7.1, §6.3, §6.1) |
| **Single source of truth — generate, don't duplicate** | Content is typed data registries (`core/content`); a **hardened** content verifier cross-checks ids and the **V2 invariants** (gate-monotonicity/ceiling, accrual tie-out, **per-perk magnitude** [flipped from `==0`], **real-name denylist**, **trade-≤⅓-post-combo proof**, hybrid gate-distribution); balance/content docs are **generated** into `docs/balance/` + `docs/content/` from the same data and `gen:docs --check` fails the build on drift. (§6.5, §6.6, §6.6.1) |
| **Playtest via code, not synthetic input** | DEV-only `window.__qa` (read state, drive intents, tick/frames, pause, force-state, seed) drives the **real** typed intents headlessly; powers `capture-game-states` and pacing/unlock regression. (§6.10) |
| **Active-only, no offline (D-013/canon §H)** | `tick` takes **whole-integer abstract** ticks (the app loop accumulates the fractional remainder); the active-only loop lives in the app layer and runs **auto-resolve combat + auto-repeat labour while the tab is open** (the "leave it running" feel, FU23); load resumes the exact saved state with **no** offline accrual code path; auto-producers stay T4+. (§6.3, §6.8, §6.9) |
| **Lean / high-impact** | One `npm run verify` gate; minimal stored save (additive-optional growth, §6.8.2); no speculative subsystems — the module list maps 1:1 to systems already locked in §§1–5; anything bigger is parked for §7's roadmap. (§6.1, §6.4, §6.8.2) |

---

## 6.13 §6 decisions → ADR (proposed)

§6 is **no longer "elaboration only."** It still adds buildable detail that **refines** the already-locked
**D-013** (module layout, the `reduce`/`tick`/rewards contracts, the stored-vs-computed split, the registry
set, the verifier + generated-docs gate, the `__qa` surface — recordable as a child ADR **D-013a — tech
architecture detail**). **But §6 also IMPLEMENTS the V2 decisions under the governing ADR D-022**
(most-recent-wins) — real reversals / new locks, not just detail: **multi-backend redundant save** (Q37/FU1),
**additive backwards-compatible schema** (Q45/FU5), **per-named-stream RNG cursors + stateless day-keyed
weather** (Q2/FU3), the **`Math.pow` ban → integer-pow** (Q36), the **bounded labour→combat verifier flip**
(Q6/FU8), the **feature-rich data model** incl. **intra-line dialogue** (Q34/FU22) & **`estateWealth.subEngines`**
(Q34/FU20), the **no-runtime-reveal-queue** design rule (FU4), and the **bundled-asset-set correction**
(Q50/Q52/Q38). Final ADR numbering is set at integration.

### Flagged for the human — superseded resolutions annotated (newest-wins, don't-delete)

> The four 2026-06-25 resolutions below are **re-graded by the V2 decisions** (D-022 governing). Annotated,
> not deleted: IndexedDB single-autosave → **SUPERSEDED by multi-backend** (Q37); splitmix64 + named
> sub-streams → **REFINED to persisted per-named-stream cursors** (Q2); ordered forward migrations →
> **SUPERSEDED by additive-schema-first / migrations rare** (Q45); `tier` **stored** → **KEEP.**

1. **SUPERSEDED (Q37/FU1): IndexedDB single autosave → multi-backend redundant save.** The original
   resolution committed to IndexedDB + base64 export with a single autosave. **V2 supersedes this** with a
   **multi-backend redundant atomic save** (IndexedDB + localStorage + sessionStorage), an app-identity magic
   field, and a monotonic-counter newest-wins selector (§6.8/§6.8.1) — to survive itch's cross-origin-iframe
   partition/eviction. (The IndexedDB-vs-localStorage trade-off note is now moot: we use **all** backends.)
2. **REFINED (Q2): RNG = splitmix64 + named sub-streams → persisted per-named-stream cursors.** The algorithm
   stays **splitmix64** (low-stakes, reversible — it only affects seed→sequence mapping). V2 **refines** the
   seed format to **`{ seed, cursors:{combat,loot,seasonal,worldgen} }`** (monotonic per-stream cursors, not a
   single counter, not child-RNG-by-splitting) plus a **stateless day-keyed** weather/festival helper, with
   **lunar phase a real continuous ~29.5-day ephemeris** off the absolute day (not a seed-keyed roll; §6.7.1).
   The **`Math.pow` ban** (Q36) is added so the seed→sequence mapping is byte-identical across engines.
3. **SUPERSEDED (Q45/FU5): ordered forward migrations → additive-schema-first; migrations rare.** V2 makes
   **additive optional-fields-with-defaults** the PRIMARY schema-growth mechanism (protobuf/thrift-style), so
   **most schema growth needs no migration at all**; the ordered forward-migration chain + raw pre-migration
   backup + future-version guard remain only as the **rare safety net** (§6.8.2). We still do *not* guarantee
   cross-major-rewrite save compatibility (a future ground-up schema change may legitimately retire very old
   saves with a clear message).
4. **KEEP: `core/state.tier` stored vs. fully derived → stored.** Unchanged by V2. Tier is checkable from the
   influence thresholds, but a tier-up is also a story beat (it fires rewards/log). Store `tier` as the
   committed value (set by the tier-up intent) and treat threshold-progress (the hybrid `gateProfile`) as
   derived — rather than re-deriving tier purely from pillars on every load.

---
