# Mechanics & Architecture Design (synthesis checkpoint)

- **Date:** 2026-06-25
- **Type:** Raw discovery capture (archival distillation of a prior synthesis run)
- **Status:** Archival. **Mechanics & architecture still valid; story framing superseded.**
- **Story note:** The original story spine in this synthesis (tengu / spirits-as-real /
  reincarnation-flavored prestige / a protagonist who secretly fights better than a farmhand
  should) has been **rejected and redesigned**. The current grounded story (no magic, mediocre-start
  protagonist, pure Edo folk-mystery) lives in `2026-06-25-grounded-story-spine.md`. The
  story-specific material from this synthesis is preserved only under the clearly-labeled
  "⚠️ SUPERSEDED story framing" section at the end, for provenance.

This document captures the **mechanical and architectural** design — the parts that remain
authoritative: the design pillars about systems, the UI-reveal/unlock-ladder structure, the systems
catalog, the deterministic auto-resolving combat model, the progression & balance formulas, the tech
architecture, the M0–M12 milestone roadmap, the tech decisions to revisit, and the open balance
questions.

Working title at time of synthesis: **Kamikakushi** (low-stakes, revisit before deploy).

---

## Design pillars (mechanical)

1. **UI-as-progression — the interface is the reward.** Start with one verb and a story log; reveal
   each panel / tab / resource / skill exactly when first earned, and announce every reveal
   diegetically through the log so feature unlocks read as plot, not menu growth.
2. **Numbers-go-up on an authentic koku spine.** Rice (koku) is both the satisfying exponential
   currency and the historically real unit of wealth/tax. Manual click → purchased producer →
   upgrade → automation is the active→idle backbone, themed as a farmhand quietly earning standing.
3. **Story and systems are the same dependency graph.** A single rewards/unlock bus — emitted by
   dialogue, quests, gathering thresholds, and combat — drives BOTH the narrative flags and the UI
   reveals. Lore (read in-world scrolls/ledgers that cost in-game time) is how meta-features unlock.
4. **Lived-in folklore, not set-dressing.** *(Pillar text originally framed yokai as how rural
   people explain weather/luck/disappearances, with combat as the exception and the mystery resolved
   through real Edo folklore. The combat-is-the-exception / labor-is-the-daily-texture mechanical
   intent stands; the supernatural framing is superseded — see the grounded spine.)*
5. **Deterministic, testable, generated.** Pure-core boundary, one seeded RNG, save only
   non-derivable state, generate balance docs from the same data the game runs on, and a DEV play
   API so every unlock and pacing beat is headlessly regression-tested.

---

## First minute / first hour (UI shape)

### First minute
Black screen, then one line of narration fades in (you wake on cold straw in a storehouse that is
not yours; you do not know how you got here). Below it sits a persistent message/event log (present
from second one, so the screen is never dead) and a **single interactive element**: a button
labeled "Rake the spilled rice" with a counter showing 0 rice. Each click raises the number by 1,
with a tiny flavor line every few clicks. **No tabs, no stats, no menu** — just the verb, the
number, and the log. The first meaningful action happens within ~5 seconds. At ~10 rice, the log
announces footsteps and a door sliding, and the guide dialogue panel (Oharu, a kind senior
farmhand) fades in with the first dialogue — which reveals the second element. The empty screen is
the hook.

### First hour
Following A Dark Room's resource-reveals-panel cadence (a new "thing appeared" every 1–3 minutes
early), the first hour walks the player from one button to a small working estate dashboard:
- Guide dialogue reveals the **Estate location panel** (storehouse → forecourt → paddy belt).
- Gathering rice past a threshold reveals the **first auto-producer** (an idle rice/sec trickle)
  plus the grayed-out next purchase.
- Each new resource lights its own panel: foraging sansai in the satoyama reveals the **Foraging
  panel**; firewood reveals **Woodcutting**.
- First skill XP reveals the **Skills tab**.
- Reading the household Journal scroll reveals the **Journal / quest log**.
- The first crafted good (a sickle from the village smith) reveals the **Craft tab**.

Time advances on an abstract clock (day/season in kanji, weather, a soft satiety/energy gate). By
the hour's end: 5–8 distinct reveals, a handful of resources trickling idle, two or three NPCs
talked to, the first questline active, and the first locked teaser dangling. **No combat yet** — the
first fight is the Act I cliffhanger.

---

## Incremental unlock ladder

Each stage fires when its trigger crosses; every reveal is announced diegetically in the log. Stages
flagged with ⚠️ contain supernatural/late-game framing that must be **reframed to the grounded
story** (see `2026-06-25-grounded-story-spine.md`); the *structural* role of each stage is unchanged.

| Stage | Trigger | Unlocks |
|---|---|---|
| **S0 Cold open** | New game | Narration line · persistent event log · one verb: Rake the rice (manual counter) |
| **S1 The guide** | ~10 rice | Guide dialogue panel · Estate location panel (storehouse) · Rice resource row |
| **S2 First producer** | Rice cost of first helper | Auto-producer purchase (idle rice/sec) · grayed next-purchase goal · in-game clock + day/season display |
| **S3 Leaving the storehouse** | Guide quest "Earn your keep" step 1 | Travel: storehouse → forecourt → paddy belt · satiety/energy soft gate · Foraging panel (sansai) on entering satoyama |
| **S4 First skill** | First skill XP from any labor | Skills tab · skill visibility-threshold reveal (skills appear by doing) · first skill milestone perk |
| **S5 The Journal** | Read household Journal scroll (costs in-game time) | Journal tab (quests + lore) · quest log · Bestiary stub (empty until first encounter) |
| **S6 Tools & trade** | Visit village smith / first crafted item | Craft tab · Village location + market/trader · money (mon/coin) alongside koku |
| **S7 First danger (Act I close)** ⚠️ | Quest: investigate the neglected shrine grove at dusk | Combat panel (auto-resolving) · first weapon equip + Equipment panel · Bestiary first entry (originally a kappa at the paddy pond) · Inventory panel — **→ reframe:** first danger to a grounded threat (e.g. bandits / a wild animal / a human menace), not a yokai |
| **S8 Processing chains** | Stockpile raw materials past a threshold | Charcoal burning + smithing chains · component-based crafting · storehouse (kura) upgrades / capacity |
| **S9 The wider satoyama** | Act II begins (master grants standing) | Map/navigation menu (multiple sectors) · Fishing (river/ponds) · Reputation per faction (estate/village/shrine) · scheduler-driven seasonal festival events |
| **S10 Automation & QoL** | Skill milestones / quest rewards in Act II–III | Auto-gather toggles per node · auto-combat continue · offline-progress summary ("while you were away") · scientific/short-number formatting milestone |
| **S11 The mountains** ⚠️ | Act III: re-consecrate shrines, ascend toward the pass | Deep-mountain areas (orig. tengu/yamauba/oni) · Ki/Mastery system · memory-fragment mechanic (the mystery) · UI retheme for the otherworld threshold — **→ reframe:** grounded mountain dangers + a human investigation/evidence layer instead of memory-fragments-as-supernatural-mystery and the otherworld retheme |
| **S12 The threshold (prestige-as-plot)** ⚠️ | Act III climax at the pass | Diegetic reset/new-cycle carrying meta-progress · post-game free-play with all panels · achievements-as-checklist surfaced — **→ reframe:** the reset should read as a **season-cycle** reset, not reincarnation |

---

## Systems catalog

| System | Summary | When introduced |
|---|---|---|
| **UI-reveal engine** | First-class pure-core system: every panel, tab, resource row, button, skill and area is DATA with an unlock predicate over game state (flags, resources, level, story node, season). The renderer shows only what is currently unlocked. "The UI is incremental" is a tunable content table, not hardcoded view logic. Each first-time reveal pushes a diegetic line to the event log. | M0 (exists from the first build; controls everything that appears thereafter) |
| **Event/story log** | Persistent scrolling, color-coded, capped message feed present from second one. Doubles as narration channel and unlock announcer (every panel/tab arrives as an in-fiction message). Prevents the empty-screen bounce. | M0 |
| **Resource & producer economy (koku spine)** | Rice (koku) is the base exponential currency: manual click → auto-producers (helpers/upgrades) with cost = `base * 1.15^owned` and ~5x jumps between tiers; production grows linear/polynomial while cost grows exponential. Coin (mon) is the secondary trade currency. Each new resource lights its own panel on first acquisition. | M1 (rice), expanding M2–M5 (sansai, firewood, charcoal, fish, crafted goods, coin) |
| **Gathering nodes (labor)** | Tiered, season-gated nodes: farming (rice paddy cycle), foraging (sansai/mushrooms/herbs), woodcutting + bamboo, fishing, hunting. Clickable + idle: do it manually first, then earn an auto-gather toggle as a reward. Each yields resource + skill XP. | M3 (farming/foraging), expanding M6–M8 |
| **Skills + milestone web** | Per-skill `total_xp` with a steep curve and per-event XP caps (forces breadth). Skills hidden until `total_xp` crosses a small visibility threshold (discover by doing). Milestones at thresholds grant flat stats, multipliers, titles, and cross-skill XP bonuses — a cheap-to-author interconnected upgrade web. | M4 |
| **Dialogue + quests (story/unlock bus)** | Dialogue = textlines that grant a universal rewards object (items/xp/money/locations/dialogues/textlines/recipes/quests/flags/locks) and can lock other lines (branching). `display_conditions` gate lines on reputation/level/season/skills/flags. Quests = sequential tasks advanced by game events. Primary narrative + unlock delivery vehicle. | M2 (dialogue/guide), M5 (quest log + Journal) |
| **Lore scrolls (diegetic feature unlocks)** | Reading in-world texts (household Journal, ryu scrolls, temple sutras, merchant ledgers) costs in-game time and unlocks whole subsystems (Journal, Bestiary, recipes, the map). Time-gated so complexity is paced. | M5 |
| **Combat (auto-resolving)** | Deterministic, idle auto-battler driven by data (`attack_speed`) and the single seeded RNG. Reserved for dangerous encounters. See Combat model. | M7 |
| **Equipment + component crafting** | Equip slots with durability; component-based crafting (item = components; quality from crafter skill + component quality + station tier; quality folded into stack key). Processing chains: wood → charcoal → forge → tools → blades. Disassembly returns materials. | M7 (equip), M8 (component crafting + chains) |
| **World simulation (time/season/weather/lunar)** | Abstract in-game clock advanced by a single tick driver with per-tick/per-day/per-week scheduler (`plans[0..2]`). Drives day/night, seasons (kanji), weather hazards (cold/wet), lunar phases, food rotting/fermenting, vendor restocks, seasonal festival events. | M3 (clock), M9 (seasons/festivals/weather hazards) |
| **Reputation + economy damper** | Per-faction reputation (estate/village/shrine) gates dialogue and content. Market saturation depresses sell prices when you flood one good, recovering over in-game days — keeps grinding interesting. | M9 |
| **Memory-fragment / mystery system** ⚠️ | *(Originally: collectible memory fragments assembling the supernatural truth of your arrival, gated on active play.)* **→ reframe:** as the grounded human investigation/evidence layer (clues, testimony) that drives the late-game mystery; see the grounded spine. | M11 |
| **Save/load + offline progress** | Versioned save of ONLY non-derivable state (total_xp per skill, unlock/finished/story flags, inventory counts, kill/clear counts, current location/time, reputation, quest status, RNG seed+counter, prestige meta); recompute derived stats on load. Ordered version migrations. Capped offline grind (8–24h) with a "while you were away" summary; STORY never advances offline. base64 export/import to file. | M2 (minimal save), hardened across M5/M10 |
| **DEV play API + content verifier** | DEV-only `window.__qa` wrapping core verbs + read state + loop control (pause/resume/step/frames) + force-state helpers, for headless capture and pacing regression. A `Verify_Game_Objects()` cross-checks all ids/refs across registries; balance tables are generated into `docs/` from the same data. | M1 (skeleton), grows every milestone |

---

## Combat model

Idle / auto-resolving, **deterministic, data-driven — NOT twitch.** Combat is a pure-core
fixed-step simulation seeded by the single RNG, so every fight is reproducible and unit-testable.

- **Spawn:** entering a combat area (or a danger event firing) auto-spawns an enemy from a weighted
  population table.
- **Cadence is data:** each combatant has an `attack_speed`; the core advances an internal sub-tick
  counter and fires an attack when a combatant's bar fills — no real-time per-combatant timers, just
  deterministic accumulation in the step function.
- **Resolution per swing:** hit chance from attacker (dexterity-like stat) vs target evasion;
  damage = `attack_power ± small seeded variance`, reduced by defense with a damage floor; separate
  seeded crit and block rolls; status effects applied per-tick by an effect system.
- **On kill:** XP + skill XP + seeded loot roll + bestiary update + quest kill events.
- **Player verbs are strategic, not reflexive:** choose area, equip gear, pick a stance (data that
  shifts attack/speed/evasion/target-count), use a consumable, and (once unlocked) toggle
  auto-continue so cleared areas re-spawn idly. HP and satiety managed via rest/eat between fights.
- **Combat is rare** in the daily texture and is itself an unlock — the Combat panel appears only at
  the Act I close, so the early game is pure peaceful labor.
- **The renderer animates the deterministic result** (filling bars, floating numbers); it never
  computes outcomes.

---

## Progression & balance model

Three interlocking curves.

### (1) Resources
- Base currency rice/koku with producer **cost = `base * 1.15^owned`** and **~5x base-cost jumps
  between producer tiers**.
- Production grows linearly/polynomially per purchase while cost grows exponentially, so each
  purchase takes slightly longer — this widening gap paces the game.
- Secondary resources (sansai, wood, charcoal, fish, coin) each have their own producer/upgrade
  trees.

### (2) Skills
- Per-skill `total_xp` with a **steep curve (`xp_scaling ~1.8`)** and a **per-event XP cap**
  (combat **~0.1**, crafting **~0.25** of a level) to force breadth and repetition.
- Skills hidden until `total_xp` crosses a small visibility threshold (discover by doing).
- Milestones at set levels grant flat stats, stat multipliers, titles, and cross-skill/category XP
  multipliers — an emergent build web and long-tail goals.
- Categories: Farming/Labor, Gathering, Crafting, Combat, Weapon, Environmental.

### (3) Character
- Level + XP (**geometric ~1.6 curve**) granting HP, satiety capacity, attribute points
  (STR/AGI/INT/SPD-style), and a compounding skill-XP multiplier.
- Core stats layer base / additive / multiplier and recompute on load.
- Equipment adds quality tiers (component-based: crafter skill + component quality + station tier).

### Meta-progression
Diegetic prestige (the late-game reset) carries forward a permanent multiplier currency +
automation/QoL unlocks framed as story-justified capabilities. **→ reframe:** the reset is a
**season-cycle** reset in the grounded story, not reincarnation.

### Pacing targets
- First action **< 5s**; first auto-producer **< 30s**.
- **5–8 reveals in the first 20–30 min**.
- Act I in one **~1–2h** sitting; Act II over a few days of check-ins; full story over **2–4 weeks**
  of casual play.
- **Never let the next visible goal balloon past ~2–3x** the previous wait without injecting a new
  mechanic or multiplier.
- Capped offline grind (**8–24h**); story gated on active play.
- Balance tables (cost/income curves, time-to-milestone) are **generated into `docs/`** from the
  same data the game runs, so walls are auditable before players hit them.

---

## Tech architecture

### Build tooling
**Vite + TypeScript**, with **Vitest** for unit tests of the pure core; ESLint + Prettier. Matches a
static itch.io deploy via `vite build` → `dist/` zipped and uploaded. **Committed `package.json` +
lockfile** (fixing the ad-hoc-toolchain weakness seen in the inspiration games). Vite handles dev
server (HMR), TS compile, bundling, cache-busting; output is fully static (no server). A separate
`npm run gen:docs` script runs a Node entry that imports the core data and writes generated
balance/content tables into `docs/`. CI-friendly:
`npm run verify` = `tsc --noEmit && vitest run && content-verifier && gen:docs --check`.

### Core (pure-core boundary)
The project's load-bearing rule: all rules/state/math in `src/core/` with **zero DOM/canvas/window
imports**. Module layout:
- `core/state` — the `GameState` type + initial state
- `core/step` — the deterministic tick reducer + per-tick/per-day/per-week scheduler
- `core/combat` — fixed-step auto-battler
- `core/economy` — producers/costs
- `core/skills`
- `core/rewards` — the universal `process_rewards` unlock bus
- `core/unlock` — predicate evaluation for the UI-reveal engine
- `core/intents` — the verb/action dispatcher (every player action is a typed intent applied by a
  pure reducer)
- `core/rng` — the single seeded RNG
- `core/content` — data registries

The core exposes `reduce(state, intent) -> state` and `tick(state, dt) -> state`; nothing else
mutates state.

### RNG
**One seeded RNG for the entire game** (e.g. splitmix64/mulberry32), seeded at new-game and
persisted. All randomness — combat, loot, weather, dialogue flavor — draws from it via `core/rng` so
every run is reproducible. The RNG state (seed + counter/stream) is part of `GameState` and is
saved/loaded, so resumed games stay deterministic. **No `Math.random()` anywhere in the core
(lint-enforced).**

### State
A single immutable-ish `GameState` reduced by pure functions (`reduce`/`tick`). Derived values
(stats, current production rates, what's unlocked) are **computed, never stored**. The renderer
subscribes to state snapshots; updates are a single `render(state)` reconciliation against the
previous snapshot (not scattered manual `update_displayed_*` push calls — fixes the stale-UI risk).

### Save
**Versioned, minimal-state save to localStorage:** persist ONLY non-derivable state — RNG
seed+counter, current time, `total_xp` per skill, unlock/finished/story flags, inventory counts,
kill/clear counts, current location, reputation, quest/task status, active-effect remainders,
prestige meta — and **recompute all derived stats on load.** Ordered version migrations (store
`schemaVersion`; run compare-and-migrate steps). Validate on load and **degrade gracefully** (clear,
explained recovery — not a scary "save is kill" wall). base64 export/import to a text file. Autosave
on a counter; periodic backup slot.

### Render
**Thin DOM renderer in `src/ui/`** (no game logic). Static HTML shell + imperative DOM updates
driven by `render(state)`; panels/tabs/rows are described by the core's unlock data and the renderer
just shows/hides/populates them. Text + emoji + CSS (MS-Gothic-ish feel) for the bulk; a small
canvas only for optional ambient FX (seasonal particles), never for logic. Universal hover tooltips,
a Shift-for-extra-detail layer, color-coded rarities/messages.

### Play API
**DEV-only `window.__qa`** (stripped from production via Vite `import.meta.env.DEV` / `define`):
`state()` snapshot read, the game's verbs as drive methods (the same typed intents the UI
dispatches), `tick/step/frames(n,ms)`, `pause()/resume()`, `new()/load()/save()`, and force-state
helpers to jump to a late unlock / rare outcome / terminal screen. Powers the `capture-game-states`
skill and lets us headlessly regression-test that each unlock fires at the intended `GameState` and
that pacing milestones hit on schedule.

### Data
**Single source of truth:** content authored as plain TypeScript data registries in `core/content`
(one module per content type: items, enemies, locations, skills, dialogues, quests, recipes,
activities, effects, panels/unlocks) — data-as-code, consumed by the pure core (inverting both
inspirations' mistake of co-locating data with DOM/behavior). A content verifier
(`Verify_Game_Objects` equivalent) cross-checks all ids/refs at test time. Per "generate, don't
duplicate," balance/content docs in `docs/` are **generated** from these registries
(`npm run gen:docs`), never hand-maintained twice.

---

## Milestone roadmap M0–M12

Milestones flagged ⚠️ carry supernatural/late-game story scope that must be **reframed to the
grounded story** (see `2026-06-25-grounded-story-spine.md`); the engineering scope is unchanged.

### M0 — Wake up: one verb, one number, the log
- **Scope:** Vite+TS+Vitest scaffold (committed `package.json` + lockfile, `npm run verify`).
  Pure-core skeleton: `GameState`, seeded RNG, `reduce(state,intent)`, a tick driver, and the
  UI-reveal engine + event log as core abstractions. Renderer shows ONLY: the wake-up narration
  line, the persistent event log, and one "Rake the spilled rice" button that increments a rice
  counter. One Vitest test proving the reducer is deterministic.
- **Deliverable:** A static build that opens to black → narration → log + one button; clicking
  raises rice; reproducible from a seed. Recognizably the game (the cold open).

### M1 — The guide & the first reveal
- **Scope:** UI-reveal data table + unlock predicates. At ~10 rice, fade in the guide dialogue panel
  and the Estate location panel, each announced in the log. Stand up the dialogue system (textlines
  + the universal rewards/unlock bus) minimally. Skeleton DEV play API (`window.__qa`:
  state/drive/step). `gen:docs` script stub.
- **Deliverable:** Cold open → rake rice → guide appears as a story beat → first dialogue. Two
  panels reveal diegetically. Headlessly drivable via `__qa`.

### M2 — First producer + minimal save
- **Scope:** Economy module: rice auto-producer (cost=`base*1.15^owned`), grayed next-purchase goal,
  idle rice/sec on the tick. In-game clock display (day/season kanji). Versioned minimal-state
  save/load to localStorage with one migration scaffold + graceful-fail. Determinism test for the
  tick + producer.
- **Deliverable:** Numbers go up idly; buy a helper; reload and resume exactly. The active→idle
  spine exists.

### M3 — Leave the storehouse: travel, satiety, foraging
- **Scope:** Location graph + travel (storehouse→forecourt→paddy belt→satoyama). Satiety/energy soft
  gate on the tick. Second gathering node (foraging sansai) revealing the Foraging panel on first
  entry. Per-tick/per-day scheduler in place.
- **Deliverable:** Move between areas; a second resource lights its own panel; energy paces labor.
  4–5 distinct reveals in a natural run.

### M4 — Skills & the milestone web
- **Scope:** Skill registry + `total_xp` curves + per-event caps + visibility threshold (skills
  appear by doing) → reveals the Skills tab on first XP. First milestone perks (flat stat /
  cross-skill multiplier / title). Generate the skills balance table into `docs/`.
- **Deliverable:** Doing labor levels hidden skills that surface and grant perks; a generated
  `docs/skills` table proves single-source-of-truth.

### M5 — Journal, quests & lore scrolls
- **Scope:** Quest system (sequential tasks via game events) + Journal tab, unlocked by reading the
  household Journal scroll (time-gated, diegetic). Seed the spine quest ("Earn your keep / Who am
  I?"). Bestiary stub. Harden save to cover quests/flags.
- **Deliverable:** A readable in-world scroll unlocks the Journal; the first quest tracks and
  advances. Story + unlock graph is one system.

### M6 — Village, trade & coin
- **Scope:** Village location + smith + a trader (buy/sell), coin currency revealed alongside koku.
  Craft tab stub with one recipe (rice + iron → sickle) gating a gathering bonus. NPC roster
  dialogue (steward, heir, daughter, patriarch).
- **Deliverable:** Travel to the village, trade for coin, craft your first tool, talk to the
  household. Act I content largely playable.

### M7 — First danger: combat, equipment, the first enemy ⚠️
- **Scope:** Pure-core deterministic auto-battler (data-driven `attack_speed`, seeded
  hit/crit/block/damage/loot). Combat panel + Equipment + Inventory panels reveal at the Act I-close
  quest. First weapon equip; first bestiary entry (originally a kappa). Combat unit tests
  (reproducible fights). **→ reframe:** first danger to a grounded threat instead of a yokai.
- **Deliverable:** Act I closes with your first auto-resolving fight; combat, equipment and
  inventory all reveal as one story beat. End-to-end Act I committable and playable.

### M8 — Processing chains & component crafting
- **Scope:** Woodcutting + charcoal burning + smithing chains (wood→charcoal→forge→tools).
  Component-based crafting with quality from skill+component+station; disassembly. Storehouse (kura)
  capacity upgrades. Auto-gather toggle as a first automation reward.
- **Deliverable:** A real production tech-ladder; first automation toggle frees attention. Crafting
  depth from a small component vocabulary.

### M9 — Act II: the wider world, seasons, reputation ⚠️
- **Scope:** Map/navigation menu (sectors), fishing node, per-faction reputation gating
  dialogue/content, market saturation damper, seasonal/festival events via the scheduler, weather
  hazards (cold/wet). Shrine re-consecration drives map progression. Act II story beats. **→
  reframe:** the supernatural "thinning boundary"/kitsune-fragments beats to the grounded
  investigation; the map-progression and reputation mechanics stand.
- **Deliverable:** The world opens; seasons/festivals/weather feel alive; reputation and the economy
  damper add texture. Act II playable across check-ins.

### M10 — Idle polish: offline progress, automation, formatting
- **Scope:** Capped offline progress (8–24h) with a "while you were away" summary (story never
  advances offline). Background-tab-accurate timing (Web Worker tick). More auto-continue/auto-gather
  automation as milestone rewards. Number-formatting milestone (short/scientific) as its own reveal.
  Achievements-as-checklist scaffold.
- **Deliverable:** Honest idle behavior, smooth active→idle handoff, legible big numbers.
  Genre-correct retention loop in place.

### M11 — Act III: the mountains, mystery, memory fragments ⚠️
- **Scope (originally):** Deep-mountain areas (tengu/yamauba/oni), Ki/Mastery system,
  memory-fragment mechanic assembling the truth, UI retheme for the otherworld threshold. Act III
  story beats gated on active play + trust. **→ reframe:** grounded mountain dangers + the human
  investigation/evidence layer; drop the otherworld UI retheme and the supernatural fragments. The
  Ki/Mastery progression mechanic itself is reusable; the magical justification is not.
- **Deliverable:** The climb to the pass; the mystery resolves; story spine complete to the climax.

### M12 — The threshold: diegetic prestige & free-play ⚠️
- **Scope (originally):** Act III climax choice → diegetic reset/new-cycle carrying meta-progress
  (reincarnation/time-loop). Post-game free-play with all panels, achievements surfaced, optional
  liminal dungeons (gashadokuro/jorogumo/yurei) for the long tail. Final save-migration + balance
  pass; full docs generation; itch.io static deploy. **→ reframe:** the reset reads as a
  **season-cycle** reset, not reincarnation; replace the supernatural liminal dungeons with grounded
  long-tail content.
- **Deliverable:** A complete loop: story → diegetic prestige (season cycle) → meaningful free-play,
  deployable as a static build to itch.io.

---

## Tech decisions to revisit

Tech/format choices flagged for a quick human nod (story-nature decisions are intentionally omitted
here — they are superseded by the grounded spine).

- **Art/visual register.** Options: pure text + emoji + CSS; minimal hand/AI sprite art for key
  NPCs/areas; or a hybrid. **Recommendation:** *hybrid* — text-first for all systems/legibility,
  with tasteful kanji season tags, color-coded rarities, woodblock-palette CSS flourishes; defer
  real sprite art unless a human invests. (Keeps the pure-core/renderer split clean and the build
  trivially static; reversible.)
- **Time model.** Options: abstract clock advanced by the tick; real-time idle accrual; or hybrid.
  **Recommendation:** *hybrid* — abstract in-game clock for seasons/story/festivals, with idle
  accrual rates tuned to real check-in cadence and a capped offline summary. (Foundational; confirm
  before M2/M3 lock the tick and save schema.)
- **Prestige / reset.** Options: no reset; one diegetic reset carrying meta-progress; or a classic
  repeatable prestige loop. **Recommendation:** *one diegetic reset* read as a chapter break,
  carrying meta-progress forward; reserve repeatable prestige for an optional post-game mode only if
  the long tail needs it. (Affects late-game save fields — lock before M10–M12. **→ reframe:** the
  reset is now a season-cycle, not reincarnation.)
- **Working title.** Use *Kamikakushi* as the working title for now; revisit before the itch.io
  deploy (M12). Low-stakes and reversible. *(Note: the title carries the superseded
  "spirited-away" framing and should be reconsidered alongside the grounded story.)*

*(The synthesis also listed two story-nature decisions — the protagonist's true nature and the
strength of the isekai framing — both of which are resolved/superseded by the grounded spine and so
are not carried forward here.)*

---

## Open balance questions

- **Offline cap & idle-to-online ratio.** Exact cap (8h vs 24h) and what % of online rate best fits
  a story RPG where story is active-only. Needs a pacing playtest once M2–M3 exist.
- **First-session pacing numbers.** Confirm first-producer cost, the 1.15 multiplier vs a gentler
  `r`, and the precise reveal cadence (target 5–8 reveals in 20–30 min) via headless `__qa` pacing
  tests in M2–M4.
- **Combat frequency & difficulty.** How rare should fights be in the daily texture, and should
  there be a fail state (death penalty) or purely soft setbacks? Determines whether combat is real
  risk or flavor.
- **Satiety/energy.** Hard gate (blocks labor when depleted) or soft (slows it)? Research suggests
  avoiding energy timers that block play — likely soft, but confirm against the "hard labor" theme.
- **NPC roster & side-quest volume for v1 vs post-launch.** How many of the ~20 plausible NPCs and
  12 areas ship in the first complete story pass?
- **Authenticity / sensitivity read.** Shrines/kami/ancestor rites are living traditions with large
  regional/decade variation — when do we get a Japanese-history/folklore sensitivity pass, and on
  which content? *(Partially superseded as the story is regrounded; the general authenticity concern
  for Edo daily-life content still stands.)*
- **Number-formatting threshold.** At what magnitude do we switch to short/scientific notation —
  and does the koku economy even reach magnitudes that require it given a 2–4 week story length?
- **Diegetic prestige meta-progress.** Flat multiplier, unlocked automation, or narrative-only
  memory? Determines whether the post-game has mechanical teeth.
- **Web Worker tick** for background-tab accuracy (HackTimer-style): build our own or vendor one,
  and is it needed before M10 given the abstract-clock model?
- **Itch.io specifics.** Confirm static-HTML upload settings, viewport/embed size, and whether we
  want a downloadable + playable-in-browser dual listing.

---

## ⚠️ SUPERSEDED story framing (kept for provenance)

> **The story below has been rejected and redesigned.** It assumed a tengu / spirits-as-real world,
> a reincarnation-flavored prestige reset, and a protagonist who is secretly strong (a
> tengu-apprentice whose "hands fight better than a farmhand's should"). The **current** grounded
> direction — no magic, a mediocre-start protagonist, a pure Edo folk-mystery, and a season-cycle
> reset — lives in **`2026-06-25-grounded-story-spine.md`**. Use that for all story work; the below
> is retained only so the provenance of the mechanics above is legible.

**Superseded vision statement (narrative portion):** *Kamikakushi* — a story-driven incremental RPG
set on a rural goshi (country-samurai) estate in Edo-era Japan. You are a 17-year-old landless
farmhand who wakes in a storehouse with no memory of arriving; the village whispers you were
"spirited away" by a tengu years ago and have come back changed. The base loop is honest-Edo labor
(farm, forage, fish, woodcut, charcoal, craft) with idle combat reserved for yokai and the dangerous
mountains. The central mystery — who you really are and what the thinning boundary between worlds did
to you — is the retention engine. *(The mechanical/architectural half of the vision — UI-as-reward,
the koku spine, deterministic pure-core TS, static Vite/itch.io deploy — remains valid and is
captured above.)*

**Superseded story beats:**
- **Prologue — Waking.** Wake amnesiac in the Akiyama estate's storehouse; Oharu becomes your guide.
  The household took you in out of duty and superstition — the village believes you are the child the
  mountain (a tengu) spirited away years ago, returned aged and strange.
- **Act I — Earning your keep.** Work the estate; meet the roster (steward Yagoro, heir
  Shinnosuke, daughter Sayo, retired patriarch Soan, the old nanny). A zashiki-warashi presence
  shifted the night you appeared. Closes at the neglected shrine grove where a kappa forces your
  first fight — "your hands fight better than a farmhand's should."
- **Act II — Standing & the thinning boundary.** The master grants standing; the world opens. The
  local ujigami/Inari shrine was let fall and the boundary between worlds is thinning. Re-consecrating
  shrines structures map progression; a kitsune drops fragments of an old ancestral wrong. Are you a
  returnee, an impostor, a reincarnation, or something a tengu wears?
- **Act III — The mountains & the truth.** Trails climb into the okuyama; tengu, yamauba and oni
  guard the pass. A memory-fragment mechanic reassembles what the otherworld did to you (trained/
  altered by a tengu, explaining your skills). The climax forces a choice triggering a diegetic
  reset/new cycle (reincarnation/time-loop), carrying meta-progress forward.
- **Epilogue / free-play.** All panels unlocked; the estate restored or transformed; post-game
  free-play, achievements, optional liminal dungeons (gashadokuro/jorogumo/yurei).

**Superseded supernatural specifics elsewhere in this doc** (flagged inline with ⚠️ and "→ reframe"):
the yokai framing in pillar 4; unlock-ladder stages S7/S11/S12; the memory-fragment system; and the
story scope of milestones M7/M9/M11/M12.
