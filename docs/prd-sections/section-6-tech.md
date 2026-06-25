# §6 — Tech Architecture & Data Model

> **DRAFT — awaiting human review.** Nothing here is locked until it is reviewed with the human and
> recorded as an ADR in [`../history/decisions.md`](../history/decisions.md). This section refines and
> makes **buildable** the tech canon already locked in **D-013** (Vite + TS + Vitest; pure-core + thin
> DOM renderer; one seeded RNG; IndexedDB + base64 export/import; responsive desktop+mobile, not
> hover-dependent; **active-only, no offline progress**; static itch.io build; art = text + emoji + CSS).
> It is authored from the canon
> ([`../../brainstorms/2026-06-25-locked-decisions.md`](../../brainstorms/2026-06-25-locked-decisions.md) §H),
> the architecture sketch
> ([`../../brainstorms/2026-06-25-mechanics-and-architecture-design.md`](../../brainstorms/2026-06-25-mechanics-and-architecture-design.md)),
> and the project conventions in [`../../CLAUDE.md`](../../CLAUDE.md). Balance **numbers** are out of scope
> here — they live in §4; this section gives the **shapes, contracts, and module layout** the rest of the
> build hangs on. No code is written until §7 (the roadmap) is approved.

This section specifies, concretely and leanly: the **toolchain**; the **pure-core boundary** and module
layout; the **GameState** shape (stored vs. computed) and the `reduce`/`tick` contracts; the **one seeded
RNG**; **content as data registries** (data-as-code, single source of truth); the **save model** (IndexedDB
+ base64, versioned minimal-state, migrations); the **renderer contract** (thin DOM, multi-screen UI,
responsive, active-only); the **DEV play API** (`window.__qa`); **accessibility basics**; and how all of
this satisfies the four project conventions (pure-core, one RNG, generate-don't-duplicate, playtest-by-code).

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
  (dead-code-eliminated from the production build).
- **Vitest** unit-tests the pure core (it imports cleanly in Node because it has zero DOM/canvas/window
  references — see §6.2). Determinism tests assert that a fixed seed + a fixed intent/tick script produces a
  byte-identical `GameState` (snapshot or structural hash).
- **ESLint** enforces the architectural rules as lint, not just convention:
  - **no `Math.random()` anywhere in `src/core/`** (custom `no-restricted-syntax` / `no-restricted-globals`
    rule) — all randomness flows through `core/rng` (convention: *one RNG*);
  - **no DOM/canvas/window/`document`/`localStorage`/`indexedDB`/`Date.now`/`performance.now` in
    `src/core/`** (a `no-restricted-imports` + `no-restricted-globals` boundary rule) — keeps the core pure,
    deterministic, and Node-testable (convention: *pure-core*);
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
               && node scripts/verify-content.ts      # the content verifier (§6.6)
               && node scripts/gen-docs.ts --check     # generated docs are up to date (§6.6)
```

`gen:docs --check` regenerates the balance/content docs into a temp buffer and fails if they differ from
what's committed — this is how *generate-don't-duplicate* is enforced mechanically: you cannot land a data
change without regenerating its docs. `npm run gen:docs` (without `--check`) writes them.

**Scripts:** `dev` (Vite dev server), `build` (`vite build` → `dist/`), `preview`, `test`, `test:watch`,
`verify`, `gen:docs`, `lint`, `format`. `build:itch` = `build` + zip `dist/` for upload.

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
  persistence/ ← IndexedDB + base64 codec + migrations. (Side-effectful; never imported BY core.)
scripts/       ← gen-docs.ts, verify-content.ts (Node entry points; import core data only).
```

**Dependency rule (one-directional):** `ui`, `app`, `persistence`, and `scripts` may import from `core`;
**`core` imports from none of them.** `core` exports only pure functions and data and the `GameState` type.
The lint boundary rule (§6.1) makes a violation a build failure, not a code-review catch.

### `core/` module layout

| Module | Responsibility | Pure? |
|---|---|---|
| `core/state` | The `GameState` type, `createInitialState(seed)`, and the **stored vs. computed** split (§6.4). | yes |
| `core/intents` | The typed `Intent` union (every player verb) + `reduce(state, intent) -> state` — the action reducer. | yes |
| `core/step` | `tick(state, dtTicks) -> state` — the deterministic clock advance + the per-tick / per-day / per-week / per-season scheduler. | yes |
| `core/rng` | The **one** seeded RNG: pure `next(rng) -> [value, rng']`, derivations, helpers (`int`, `chance`, `pick`, `weighted`). Persisted in `GameState`. | yes |
| `core/combat` | The deterministic, fixed-step auto-battler (data-driven `attackSpeed`; seeded hit/crit/block/damage/loot). Stepped by `core/step`. | yes |
| `core/economy` | Producers, costs, resource flows (the *koku*/coin spine; the capped Estate & Wealth sub-engines: land / treasury / trade incl. the silk *meibutsu*, trade ≤⅓-capped per canon §D). | yes |
| `core/skills` | Per-skill XP curves, per-event caps, visibility thresholds, milestone web. | yes |
| `core/rewards` | The universal **rewards/unlock bus** — `applyRewards(state, rewards) -> state` — the one funnel through which dialogue, quests, thresholds, and combat grant items/xp/coin/locations/recipes/quests/**flags & unlocks**, and emit diegetic log lines. | yes |
| `core/unlock` | Predicate evaluation for the UI-reveal engine: each panel/screen/tab/row/area is data with an unlock predicate over `GameState`; `isUnlocked(state, id)` and `visibleSurfaces(state)`. | yes |
| `core/influence` | The four House-Influence pillars (Arms / Estate & Wealth / Standing & Office / Name & Honour), achievement-jump + seasonal judged-result accrual (new-high-water-mark, up-only + per-pillar recoverable dents), and **simple per-tier required-pillar thresholds** for tier-up (canon §D — no floor/overflow formula). | yes |
| `core/content` | The **data registries** (one module per content type; §6.5) + the registry index. Data-as-code. | yes |
| `core/log` | The event/story log model (append, cap, severity/colour tag) — data only; the renderer paints it. | yes |
| `core/selectors` | Derived/computed reads (current production rates, effective stats, what's unlocked, current tier). **Pure functions of `GameState`; nothing stored.** | yes |

**Public surface of `core`:** the `GameState` type, `createInitialState`, `reduce`, `tick`, the selectors,
the registries, and the RNG helpers. **Nothing else mutates state.** Everything is immutable-in/immutable-out
(structural sharing; never mutate the input `state`).

---

## 6.3 The two contracts: `reduce` and `tick`

Two pure functions are the *only* ways state changes. Both are deterministic given `(state, input)` because
all randomness is carried inside `state.rng` (§6.7).

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
  | { type: 'advance_dialogue'; lineId: DialogueLineId; choiceId?: ChoiceId }
  | { type: 'accept_quest'; questId: QuestId }
  | { type: 'read_scroll'; scrollId: ScrollId }       // diegetic feature unlock (costs in-game time)
  | { type: 'set_allegiance'; lean: number }          // Tama ↔ farmhand, continuous, re-swingable
  // ...one variant per verb; the renderer NEVER mutates state, it only dispatches these.

// The action reducer: a player verb → new state. Pure; deterministic.
function reduce(state: GameState, intent: Intent): GameState;

// The clock advance: simulate dtTicks of abstract game-time. Pure; deterministic.
// dtTicks is ABSTRACT (active-play ticks), never wall-clock. Active-only, no offline (canon §H).
function tick(state: GameState, dtTicks: number): GameState;
```

**`reduce`** validates the intent against current state (e.g. enough *koku*, area reachable, rung high
enough), applies the change, runs any triggered rewards through `core/rewards`, and re-checks unlock and
tier-threshold predicates so newly-earned surfaces flip to unlocked and push their diegetic log line. An
illegal intent is a no-op (returns the same state) plus an optional rejection note — never a throw.

**`tick`** advances the abstract clock by `dtTicks` and runs the scheduler in `core/step`:
- **per-tick:** combat sub-step (the auto-battler), satiety/energy drain (soft — slows, never hard-blocks),
  active-activity progress, auto-producer output (late-game only).
- **per-day / per-week:** vendor restocks, food rot/ferment, the market-saturation damper recovering.
- **per-season:** harvest resolution, the **seasonal judged Influence results** (fired only on a new
  high-water mark, per canon §D and PRD §1.6.2), weather/festival events.

`dtTicks` is computed by the **app-layer** loop from real elapsed time *while the tab is active*, then handed
to the pure `tick`. The core never reads a clock. **Active-only is enforced structurally:** there is no
offline-accrual code path — on load, the world resumes exactly where it was saved (no "while you were away").

> **Determinism guarantee (testable):** `replay(initialState, [intents…], [tickScript…])` produces an
> identical `GameState` every run. This is asserted in Vitest and is what makes the DEV play API (§6.9) a
> regression harness for pacing and unlock timing.

---

## 6.4 GameState — stored vs. computed

`GameState` is a single immutable-ish tree reduced by `reduce`/`tick`. The cardinal rule (per the architecture
sketch and the *save-minimal* canon): **store only what is NOT derivable; recompute everything derivable on
read.** Derived values (effective stats, current production/sec, what's unlocked, current tier, time-to-next)
are **computed by `core/selectors`, never stored** — so they can never go stale and never need a migration.

### Stored (non-derivable) — the persisted surface

```ts
interface GameState {
  schemaVersion: number;            // for ordered migrations (§6.8)
  rng: RngState;                    // seed + counter/stream — persisted (§6.7)
  clock: { tick: number; day: number; season: Season; year: number };  // abstract time
  resources: Record<ResourceId, number>;         // koku, coin(mon), wood, fish, materials…
  producers: Record<ProducerId, number>;         // owned counts (late-game only)
  skills: Record<SkillId, { xp: number }>;       // total xp per skill; levels DERIVED
  character: { hp: number; satiety: number; attributePoints: number;
               attributes: Record<AttrId, number> };  // base attrs stored; effective DERIVED
  inventory: Record<ItemId, number>;             // counts (quality folded into the item key)
  equipment: Partial<Record<EquipSlot, ItemInstanceId>>;
  influence: Record<PillarId, { value: number; highWater: number }>;  // 4 pillars; dents recorded here
  tier: TierId;                                   // current macro tier T0..T4 (DERIVED-checkable, stored for clarity)
  ranks: Record<TierId, { estateService: number; combatStanding: number; rung: RankId }>;
  reputation: Record<FactionNodeId, number>;     // village per-node meters; origin ties as milestones
  allegiance: number;                            // Tama ↔ farmhand lean, continuous
  flags: Set<FlagId>;                            // story/finished/one-shot flags (serialized as array)
  unlocked: Set<SurfaceId>;                       // panels/screens/areas the player has earned
  quests: Record<QuestId, { status: QuestStatus; step: number }>;
  counts: Record<CountId, number>;               // kills, clears, harvests — drive achievements/quests
  effects: ActiveEffect[];                        // active buffs/injuries with remaining duration
  combat?: CombatEncounterState;                  // present only while a fight is live (also derived-ish but stored mid-fight for save-resume)
  log: LogEntry[];                                // capped event/story log
  settings: { textScale: number; colourblindMode: boolean; reducedMotion: boolean; muted: boolean };
}
```

### Computed (never stored) — examples from `core/selectors`

`effectiveStats(state)` (base + additive + multiplier layers + equipment + milestones); `productionPerTick(state)`;
`unlockedSurfaces(state)`; `currentTier(state)` and `tierThresholdProgress(state)` (against the simple
required-pillar thresholds); `skillLevel(skillId, state)` (from xp + curve); `timeToNextGoal(state)` (for the
greyed next-purchase). These are pure, cheap, memoizable per-snapshot, and **excluded from the save**.

> **Why this split matters:** it keeps the save tiny and forward-compatible (you only ever migrate
> non-derivable fields), makes the renderer a pure function of state, and means a balance retune (a curve
> change) instantly reflows every derived number with **no migration** — only stored facts ever migrate.

---

## 6.5 Content as data registries (data-as-code, single source of truth)

**All content is authored as plain, typed TypeScript data in `core/content`, one module per type** — consumed
by the pure core, never co-located with DOM or behaviour. This inverts both inspiration games' mistake of
binding data to the renderer, and it is the backbone of *generate-don't-duplicate*.

| Registry module | Holds | Keyed by |
|---|---|---|
| `content/resources.ts` | resources (koku, coin, wood, fish, materials…) + display/emoji + caps | `ResourceId` |
| `content/activities.ts` | jobs/labour nodes (farm/forage/woodcut/fish/craft) — yields, skill, season/area gates | `ActivityId` |
| `content/producers.ts` | late-game auto-producers — cost curve refs, output, unlock predicate | `ProducerId` |
| `content/skills.ts` | skills — xp curve refs, per-event cap, visibility threshold, milestones | `SkillId` |
| `content/items.ts` | items/equipment/consumables — slots, stats, rarity, quality rules | `ItemId` |
| `content/recipes.ts` | crafting — inputs, station tier, quality-from-skill rules, disassembly | `RecipeId` |
| `content/enemies.ts` | the **grounded** bestiary (boars/wolves/monkeys/bandits/ronin/smugglers — NO belief-creatures in spawn tables, canon §E) — stats, attackSpeed, loot tables | `EnemyId` |
| `content/areas.ts` | the full per-tier maps (T0–T2 in v1) — nodes, travel edges, conditioning gates, faction | `AreaId` |
| `content/dialogues.ts` | dialogue lines — text, display conditions, the rewards object, branch locks | `DialogueLineId` |
| `content/quests.ts` | quests — sequential steps, advance events, rewards (open-ended, non-waypoint) | `QuestId` |
| `content/scrolls.ts` | lore scrolls — in-game-time cost, the subsystem they unlock | `ScrollId` |
| `content/surfaces.ts` | every panel / screen / tab / row / button — its **unlock predicate** + which screen it lives on (drives the UI-reveal engine and multi-screen nav) | `SurfaceId` |
| `content/ranks.ts` | the **fresh rank ladder PER TIER** (T0/T1/T2 enumerated for v1) — rung, track (labour/combat/mixed), earn-condition, unlock | `RankId` |
| `content/influence.ts` | the four pillars + per-tier required-pillar thresholds (shapes; values cross-ref §4) + accrual deeds | `PillarId` / `DeedId` |
| `content/effects.ts` | buffs/injuries/status — magnitude, duration, stacking | `EffectId` |
| `content/balance.ts` | shared curve/constant definitions (cost growth, xp scaling, etc.) — the *single* home for tunables; §4 sets the values | (named) |

**Rewards are one shape everywhere.** Dialogue, quests, gathering thresholds, and combat all grant the same
`Rewards` object (`{ items?, xp?, resources?, unlocks?, areas?, recipes?, quests?, flags?, dialogues? }`),
funnelled through `core/rewards.applyRewards`. Story flags and UI reveals ride the *same* bus — so "story" and
"UI growth" are one dependency graph (a reveal reads as plot, not menu growth), exactly as §1/§3 require.

---

## 6.6 The content verifier + generated docs (generate-don't-duplicate)

**Content verifier** (`scripts/verify-content.ts`, run in `npm run verify`): cross-checks every id/reference
across all registries (a recipe's inputs exist; an area's travel edges resolve; a quest's reward items exist;
a rank's unlock surface exists; every `SurfaceId` referenced by a screen is registered; no orphan ids). It
also asserts the **canon invariants** as machine checks so they cannot silently rot:

- no `EnemyId` in any spawn/population table is tagged `belief-creature` (canon §E);
- the **trade** sub-engine of Estate & Wealth is capped at **≤⅓** of that pillar (canon §D);
- exactly **≤1** residual-ambiguity token exists across content (canon §A);
- no Influence path is a passive per-tick trickle or flat per-action increment (accrual is jump/judged only);
- no content grants a combat stat/training-rate bonus from labour conditioning (no labour→combat cross-feed).

**Generated docs** (`scripts/gen-docs.ts`): a Node entry that imports the same registries the game runs on and
writes balance/content tables into `docs/` (e.g. `docs/balance/curves.md`, `docs/content/bestiary.md`,
`docs/content/areas.md`, `docs/content/ranks.md`, `docs/content/influence.md`). Run with `--check` in
`verify` to fail the build if the committed docs drift from the data. This is the convention *generate, don't
duplicate* made literal: balance/content tables are **never hand-maintained twice** — they are a build
artifact of the one source of truth.

---

## 6.7 The one seeded RNG

**One seeded RNG for the entire game** (canon §H, convention *one RNG*). A small, fast, well-distributed
generator (e.g. **mulberry32** or **splitmix64**), seeded at new-game from a stored seed.

- **It is part of `GameState`** (`state.rng = { seed, counter }`) and is **saved & loaded**, so resumed games
  stay deterministic and reproduce exactly.
- The API is **pure**: `next(rng) -> [n, rng']` returns the value *and* the advanced RNG; helpers
  (`rngInt`, `rngChance`, `rngPick`, `rngWeighted`) thread the new RNG back into `GameState` via `reduce`/
  `tick`. Combat, loot, weather, and dialogue flavour all draw from this one stream.
- **`Math.random()` is banned in `core/` by lint** (§6.1) — there is no second, hidden source of randomness.
- For independent sub-streams (e.g. a fight's rolls vs. weather) we **derive child RNGs by splitting** from
  the parent counter, so each subsystem is reproducible without coupling — still all rooted in the one seed.

> This is what lets a saved fight resume identically, lets the DEV play API force a rare loot/crit outcome by
> seed, and lets Vitest assert byte-identical replays.

---

## 6.8 Save model — IndexedDB + base64, versioned minimal-state

Per **D-013 / canon §H**: robust, durable, static-friendly, **no backend**.

- **Primary store: IndexedDB.** A single object store holds **one autosave slot** (canon: *single autosave*).
  IndexedDB is chosen over `localStorage` for robustness and capacity (structured data, no 5 MB string wall,
  survives better). Autosave fires on a debounced cadence (after meaningful intents and on a tick interval)
  and on `visibilitychange`/`beforeunload`.
- **Export / import: base64 to a text file.** The same serialized save is base64-encoded for copy-paste / file
  export and import — the player's portable backup (and a hand-off path for QA). Import validates + migrates.
- **Persist only non-derivable state (§6.4).** The save is the **stored** surface of `GameState`: schemaVersion,
  RNG (seed + counter), clock, resources, producer counts, skill xp, base attributes, inventory, equipment,
  influence pillars (value + high-water + dents), ranks, reputation, allegiance, flags, unlocked surfaces,
  quest status, counts, active-effect remainders, settings. **All derived stats are recomputed on load** by
  the selectors — never serialized.
- **Versioned with ordered migrations.** `schemaVersion` is stored; on load, an ordered list of
  `migrate_vN_to_vN+1(save)` steps runs in sequence to bring an old save current (each migration is a pure
  function, unit-tested). Migrations live in `persistence/migrations/`.
- **Validate + degrade gracefully on load.** A corrupt/unreadable save shows a calm, explained recovery (offer
  re-import or a fresh start), **never** a scary "save is kill" wall. A pre-migration backup of the raw bytes
  is kept so a failed migration is recoverable.
- **No offline accrual on load.** Active-only: load restores the exact saved `GameState` and resumes; there is
  no time-skip catch-up.

**Persistence lives in `src/persistence/`** (IndexedDB access, the base64 codec, the migration chain). It is
side-effectful and is **never imported by `core`** — `core` only produces the plain serializable `GameState`;
the app layer hands it to persistence.

---

## 6.9 Renderer contract (thin DOM, multi-screen, responsive, active-only)

**The renderer is a thin DOM layer in `src/ui/` with zero game logic** (D-013). It is a (near-)pure function
of `GameState`: `render(state, prevState)` reconciles the DOM against the new snapshot; it does **not** compute
outcomes and does **not** mutate state — it only **dispatches intents** back to the core. The combat renderer
animates the deterministic result (filling bars, floating numbers); it never decides the fight.

- **Data-driven surfaces.** Every panel/screen/tab/row/button is described by `core/content/surfaces.ts` with
  an unlock predicate; the renderer shows only `unlockedSurfaces(state)`. "The UI is incremental" is a tunable
  content table, **not** hardcoded view logic. Each first-time reveal pushes a diegetic line to the event log
  (the reveal reads as plot).
- **Multi-screen UI, progressively revealed (canon §H).** There is a real multi-screen shell with navigation
  (e.g. Estate / Village / Wilds / Skills / Combat / Influence / Map / Journal / Settings screens), but
  **nav and screens are revealed as earned** — so it *appears single-screen early* (minute one is one verb +
  the log) and grows into a full multi-screen app. The nav is itself driven by unlock predicates.
- **Responsive desktop + mobile, NOT hover-dependent (canon §H).** A fluid layout (CSS grid/flex,
  container/media queries) that reflows columns→stacked on narrow screens; **all information reachable without
  hover** — any hover tooltip has a tap/focus-equivalent, and "Shift for more detail" is an *enhancement*, never
  the only path to a value. Touch targets are comfortably sized.
- **Art register = text + emoji + CSS (D-013 / canon §H).** Woodblock-style palette, kanji season tags,
  colour-coded rarities, CSS flourishes; a small canvas is permitted ONLY for optional ambient FX (seasonal
  particles), **never for logic**. Colour is never the *sole* carrier of meaning (see §6.10).
- **Active-only loop.** The app-layer tick loop runs only while the tab is active (driven by
  `requestAnimationFrame` / a paced timer); it computes `dtTicks` from elapsed active time and calls the pure
  `tick`. Backgrounding pauses; there is no offline catch-up. A user **pause** is supported.
- **One render path.** Updates go through `render(state)` reconciliation — not scattered manual
  `update_displayed_*` push-calls — which kills the stale-UI class of bug by construction.

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

Solid basics (canon §H), wired so they cannot be an afterthought:

- **Scalable text** (a `textScale` setting on `GameState.settings`, applied via CSS custom property; respects
  the browser/root font size).
- **Colourblind-safe cues:** colour is *never* the sole signal — rarities/severities also carry an icon/emoji
  and/or text label; a `colourblindMode` setting swaps to a safe palette.
- **Keyboard + touch:** full keyboard operability (focus order, visible focus ring, no hover-only controls —
  ties to §6.9's not-hover-dependent rule) **and** comfortable touch targets.
- **Reduced motion:** a `reducedMotion` setting (and `prefers-reduced-motion` honoured) downgrades the ambient
  canvas FX and number-float animations.
- **Pause:** the active loop can be paused (also an accessibility/comfort feature).
- **Semantic structure + live region:** the event/story log is an ARIA live region so reveals/important events
  are announced to assistive tech; screens/panels use semantic landmarks and labelled controls.
- **Mute:** light ambient beds + UI/event SFX with a mute toggle (canon §H audio note).

---

## 6.12 How this satisfies the project conventions

| Convention (CLAUDE.md) | How §6 satisfies it |
|---|---|
| **Pure-core boundary** | All logic/state/math in `src/core/` with **zero DOM/canvas/window** — enforced by an ESLint boundary rule (build failure, not review). Renderer consumes plain data; one-directional dependency. (§6.2) |
| **Determinism: one RNG** | A single seeded RNG **in `GameState`**, saved/loaded; pure `next`; child streams by splitting; **`Math.random()` lint-banned** in core. Replays are byte-identical (Vitest-asserted). (§6.7, §6.3) |
| **Single source of truth — generate, don't duplicate** | Content is typed data registries (`core/content`); a content verifier cross-checks ids and canon invariants; balance/content docs are **generated** into `docs/` from the same data and `gen:docs --check` fails the build on drift. (§6.5, §6.6) |
| **Playtest via code, not synthetic input** | DEV-only `window.__qa` (read state, drive intents, tick/frames, pause, force-state, seed) drives the **real** typed intents headlessly; powers `capture-game-states` and pacing/unlock regression. (§6.10) |
| **Active-only, no offline (D-013/canon §H)** | `tick` takes **abstract** ticks; the active-only loop lives in the app layer; load resumes the exact saved state with **no** offline accrual code path. (§6.3, §6.8, §6.9) |
| **Lean / high-impact** | One `npm run verify` gate; minimal stored save; no speculative subsystems — the module list maps 1:1 to systems already locked in §§1–5; anything bigger is parked for §7's roadmap. (§6.1, §6.4) |

---

## 6.13 §6 decisions → ADR (proposed)

§6 **refines** the already-locked **D-013** rather than opening new design questions; it adds buildable
detail (module layout, the `reduce`/`tick`/rewards contracts, the stored-vs-computed split, the registry set,
the verifier + generated-docs gate, the `__qa` surface). Proposed: record §6 as an **elaboration of D-013**
(or a child ADR **D-013a — Tech architecture detail**), not a new design reversal. Final ADR numbering is set
at integration.

### Flagged for the human

1. **IndexedDB vs. localStorage.** Canon/D-013 say IndexedDB; this section commits to it (single autosave +
   base64 export) for robustness. Confirm we accept IndexedDB's small async/boilerplate cost over
   localStorage's simpler-but-fragile sync API for a single-slot save.
2. **RNG algorithm choice (mulberry32 vs. splitmix64) and the sub-stream split scheme.** Low-stakes and
   reversible (it only affects the seed→sequence mapping, not any contract), but it pins save reproducibility
   once content ships — worth a nod before we lock a seed format.
3. **`schemaVersion` / migration policy ceiling.** Proposed: support ordered forward migrations indefinitely
   + a pre-migration raw backup; confirm we will *not* guarantee cross-major-rewrite save compatibility (so a
   future ground-up schema change may legitimately retire very old saves with a clear message).
4. **`core/state.tier` stored vs. fully derived.** Tier is checkable from the influence thresholds, but a
   tier-up is also a story beat (it fires rewards/log). Proposed: store `tier` as the committed value (set by
   the tier-up intent) and treat threshold-progress as derived — confirm this stored/derived split is right
   rather than re-deriving tier purely from pillars on every load.
