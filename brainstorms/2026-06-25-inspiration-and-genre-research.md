# Inspiration & Genre Research — Discovery Capture

**Status:** Archival — raw discovery capture, distilled from a prior parallel research pass. Informs the PRD; not a design doc.
**Date:** 2026-06-25

This is a faithful checkpoint of research into two inspiration games (Proto23, Yet Another Idle
RPG), the incremental/idle genre and its UI-incrementality patterns, and Edo-era Japan as a setting.
Reorganized for readability; facts, numbers, and file references are preserved as captured.

> **Architecture note threaded throughout:** our project's load-bearing rule is a **pure-core
> boundary** — game logic (rules, state, math) with **zero DOM/canvas/window imports**, consumed by a
> thin renderer as plain data. **Both inspiration games VIOLATE this** (their logic is entangled with
> the DOM, not unit-testable in isolation). So the recurring "lessons for us" verdict is: **adopt
> their content/data patterns and authoring ergonomics, but invert that one mistake** — put the data
> in the pure core and keep the renderer as a passive consumer.

> **Research gap:** a sixth research agent tasked with itch.io **deployment** research failed
> (StructuredOutput retry cap exceeded; `findings.deploy` is `null`). That topic is not covered here
> and remains open for the PRD.

---

## Inspiration #1 — Proto23

**Game:** Proto23 (GitHub repo `23html/23html.github.io`, page title "Proto23"). First committed
2022-10-21, still updated in 2026; internal version number **470** (shown bottom-corner, links to the
changelog). All observations made directly from source, not inferred.

### Tech stack
- Pure vanilla web: **zero frameworks, zero build tooling, zero dependencies.**
- The **entire game is ONE file**: `index.html` (~838 KB, **~14,768 lines**), served from GitHub Pages.
  - Lines 1–139: inline CSS.
  - A single inline `<script>` from line 143 to end-of-file holds **ALL** logic and content.
- Other repo files are just `changelog/`, `changelog.html`, `favicon.ico`, `ctst.png`, `laugh6.wav`.
- No JS modules, no JSON data files, no `package.json`. GitHub reports language as "HTML".
- Rendering is DOM-driven: **516 `innerHTML` assignments**; a tiny `addElement(parent, tag, id, cls)`
  `createElement` helper. Canvas barely used (a dev-only dungeon "map" preview ~line 14238 and a
  commented-out snow effect).
- Font is **MS Gothic**; UI is text/emoji + CSS gradients, no sprite art. Persistence via `localStorage`.

### Code architecture
- **NOT pure-core; logic and DOM are deeply intertwined** (the opposite of our rule). No model/view
  separation: content callbacks (`use`/`onLevel`/`onStay`) directly call `msg()`, `dom.*.update()`,
  `appear()`, and combat resolution writes to the DOM mid-loop.
- All state lives in a handful of **global namespace objects** created at top (lines 144–196): `global`
  (flags/stats/config), `you` (player), `creature`, `item`/`wpn`/`eqp`/`acc`/`sld`, `skl`, `abl`,
  `rcp`, `area`, `sector`, `vendor`, `quest`, `act`, `effect`, `furniture`, `ttl` (titles), `chss`
  (scenes/dialogue), `home`, `container`, `mastery`, `timers`, `dom` (cached element refs).
- Content uses **constructor functions as lightweight "classes"**: `You`, `Creature`, `Item`, `Eqp`,
  `Skill`, `Quest`, `Title`, `Furniture`, `Recipe`, `Container`, `Sector`, `Area`, `Vendor`, `Action`,
  `Weather`, `Effect`, `Ability`, `Mastery`, `Chs`, `Plan`, `Time`.
- Every content instance is **hand-authored inline** (e.g. `item.bstr = new Item(); item.bstr.id=...;
  item.bstr.use=function(){...}`) — data and behavior co-located per entity, but **no central data
  table**, lots of duplication, one giant file.
- The "engine" (constructors + core functions like `fght`/`attack`/`giveItem`/`giveSkExp`/`save`/
  `load`/`ontick`) is ~10–15% of the file; the other ~85% is hand-written content.
- One master tick driver: an IIFE `(function update(){ setTimeout(()=>{update();ontick();},
  1000/global.fps); })()` at ~line 13879 (fps default 1), plus many ad-hoc `setInterval` timers
  stashed on the `timers` object, individually cleared on load/death.

### Core loop
- **Minute-to-minute:** stand in a location ("scene" = a `Chs` object) and click text choices.
  Combat areas auto-spawn an enemy (`area_init` picks from a weighted population table); combat is
  fully automatic on a timer loop (`fght`/`attack` at lines 10379/10428) driven by **SPD differential**
  (faster combatant lands extra "multi-hits" proportional to the speed gap), repeating while
  `global.flags.btl` is true. Kills grant EXP, drops, skill EXP; heal/eat to manage HP and **SAT**
  (satiety/energy, which constantly drains via `you.mods.sdrate`, worsened by cold/wet weather).
- **Hour-to-hour:** every tick advances in-game time (`time.minute += timescale`), cycling day/night,
  weather (`wManager`), seasons, lunar phases — gating events, vendor restocks, item changes (food
  rots, alcohol ferments, power sources charge). Loop between hunting areas (XP/loot), home
  (rest/sleep/cook/store), and town vendors (buy/sell with reputation). Progress spent leveling many
  skills, crafting/disassembling, reading books (consume in-game time, unlock features), scouting
  areas, doing menial jobs, pushing a light questline. A slow doom timer
  (`global.offline_evil_index`, "Evil slowly consumes the world") ticks up over real calendar time.

### UI structure
- Single-screen dashboard from absolutely-positioned panels referenced `dom.d0..d8` (plus sub-panels
  like `d5_1_1`, `d7m`).
- Top bars: name/title, HP/EXP/SAT meters, location header (`d_loc`), a clock with day-of-week,
  season tag (kanji 春夏秋冬), lunar-phase emoji, weather/rain/snow indicators.
- Center-left: location/scene with clickable choice lines (`chs()` renderer). Center: combat (your
  stats vs enemy, effect icons). Bottom-left: scrolling message log (**capped at `global.msgs_max=36`**).
- Right-hand inventory/equipment panel uses grid "slots" with hover tooltips (`addDesc` floating box;
  hold **Shift** for extra info).
- A row of ~5 main tabs (`ct_bt1..ct_bt6`: assemble/skills/actions/options/.../journal) switches the
  right pane. Separate map/navigation menu (`mn_1..mn_4`) for travel. Windows draggable
  (`draggable()` at line 14015). Fixed bottom bar holds save/load + version number. Full-screen
  LOADING overlay; a dramatic red **"SOMETHING BROKE"** overlay on load failure.

### UI-unlock mechanics (the standout feature)
- Game opens almost **EMPTY**: the entire main UI (`dom.d0`, `d1m`, inventory, message log, controls,
  location) is hidden behind `global.flags.aw_u` until the scripted intro reveals it.
- The intro (`chss.t1`, line 11532) is a dialogue where each click **fades in exactly ONE more UI
  element** in sequence via `appear()` (a 0→1 opacity tween): first `ctr_1`, then `d0`, then inventory
  + location bar, then the controls bar — only then sets `aw_u=true` and hands you your first weapon
  (a stick, `wpn.stk1`) and herbs.
- After that, tabs are **earned by DOING** the relevant activity for the first time:
  - first skill gained → `global.flags.sklu` → placeholder tab becomes "skills" (line 13752)
  - first craft → `asbu` → "assemble" (line 10893)
  - first action → `actsu` → "actions" (line 9055)
  - reading the Journal book → `jnlu` → "journal" (line 5584)
  - another item → `m_un` reveals map/navigation (line 4944; `mn_1` further gated behind
    `stat.mndrgnu`)
- **Whole subsystems unlock via consumable BOOKS:** reading the Hunter's Encyclopedia (`item.bstr`)
  sets `global.flags.bstu` → Bestiary; the Journal book → Journal; recipe books → recipes.
- Areas/passages unlock via per-scene boolean flags set when scouted (e.g. `frstnscgr` reveals a
  hidden path). **Reading takes real in-game time** (`data.time = HOUR*17` etc.), so unlocks are paced.
- On `load()`, every flag is re-checked to re-show correct UI state, so unlocks persist.
- Net effect: the player is **never overwhelmed**; complexity is revealed exactly when first used.

### Progression systems
- Player level + EXP, steep curve (`expnext = lvl*((lvl*2)^2)+lvl^2`); leveling raises core stats.
- **~60 skills** (`skl.*`), each with its own EXP/level curve, gained on first performing the action,
  trained by repeated use (`giveSkExp`); includes combat, weapon masteries, cooking, reading,
  meditation, scouting, dodging, cold/wet resistance, etc.
- **Skill MILESTONES (perks):** each skill has an `mlstn` array firing functions at specific levels —
  permanent stat boosts, new Titles, cross-skill EXP multipliers (`skl.x.p += ...`) — a deeply
  interconnected upgrade web.
- **108 Titles** (`ttl.*`) from milestones/achievements; some carry permanent "talents" (passives
  re-applied on load).
- Core stats STR/AGL/INT/SPD plus HP, SAT, luck, karma, crit; base/additive/multiplier layering
  (`str_r`/`stra`/`strm`, recomputed in `you.stat_r()`).
- Resistances (poison/burn/frost/paralyze/blind/sleep/curse/death/bleed/venom…) and elemental
  affinities/classes.
- Ki accumulation + a Mastery system (`Mastery` constructor, level-capped nodes).
- Equipment with durability (`dp`/`dpmax`), 10 equip slots, gear that tracks kills made with it.
- Shop reputation per vendor; menial jobs for money; light questline (**5 quests**).
- Long-horizon decay meter (`offline_evil_index`) slowly "consumes the world" over calendar time.

### Content systems
- **Combat:** automatic, SPD-differential multi-hit (`fght`/`attack`), hit/crit/miss, status effects
  both sides, **~38 creatures** via `mon_gen` with random level in an area's range.
- **Items:** ~351 plain items + ~195 equipment/weapons/accessories/shields (**~546 total**), each with
  id, rarity, description, `use()`; consumables, food, herbs, materials, books.
- **Crafting:** `rcp.*`, **62 recipes** via an "assemble" tab, repeatable, auto-prioritizing broken
  gear; plus DISASSEMBLE back into materials (skill-scaled yields).
- **Cooking/food** with satiety restoration and food that **ROTS** over time (rotting generalized to
  any time-changing item: fermenting, charging, etc.).
- **Books:** read over in-game time to unlock features (Bestiary, Journal), grant recipes, or one-time
  stat boosts; books recycle.
- **Locations:** **69 scenes** (`Chs`), **21 combat areas**, **5 sectors** (areas can belong to
  multiple); home, dojo, forest, town.
- **Vendors (5)** with stock, conditional spawns, periodic restock, reputation.
- Storage **containers** (generalized: bags, chests, altars) that can trigger events.
- **Furniture (14)** placed in home with passive per-tick effects (`use()`).
- Weather/seasons/day-night/lunar phases driving hazards (cold, rain → wet) and synergies.
- **Effects (29)** typed by tick-phase, applied to player and enemies.
- Actions (scout/run/etc.), Abilities, a **Planner/Plan scheduler** (`plans[0]`=per-tick,
  `plans[1]`=per-day, `plans[2]`=per-week), Bestiary, Journal, Quests, deep Statistics screen.

### Save system
- Single `localStorage` slot under hardcoded key **`"v0.3"`** (NOT derived from `global.ver=470`).
- `save()` serializes **~20 sub-structures** (player, effects, skills+milestones, global skills, global
  stats/flags, recipes, inventory partitioned by item-class via `id/10000`, area sizes, world data,
  furniture, vendors+stock, titles, home layout, quests, actions, sectors, containers, scene data, a
  tget-titles list) by JSON-stringifying each and joining with `'|'`, inserting a literal `'savevalid'`
  sentinel near the end, then base64-encoding the whole (`utf8_to_b64`).
- Autosave every 30s (`setInterval save(true), 30000`). `load()` base64-decodes, splits on `'|'`,
  JSON-parses each segment back onto live objects by id.
- **Essentially NO migration system:** a parse/structure mismatch shows the full-screen red
  **"SOMETHING BROKE / PERHAPS DUE TO STUPIDITY OR DATA STRUCTURE CHANGES / DELETING THE SAVE IS
  ADVISED"** overlay; the changelog literally records **"save is kill"** when structure changed.
- Manual import/export to text files supported (download/upload of the same base64 blob, tagged with
  version + timestamp). `global.stat.lastver` is stored so the game knows the prior version, but no
  automatic upgrade path is implemented.

### Strengths
- Outstanding **progressive UI disclosure**: starts nearly blank, reveals each panel/tab/subsystem
  exactly when first used — never overwhelming despite enormous depth.
- **Diegetic unlocks:** features (Bestiary, Journal, recipes) gained by reading in-world books that
  cost in-game time — meta-progression feels part of the fiction.
- Huge, interconnected content for a hobby project (~546 items, 60 skills with cross-multiplying perk
  webs, 108 titles, 38 creatures, 62 recipes, 69 scenes).
- Rich systemic simulation: time/seasons/weather/lunar phases feed hazards, food rotting, fermenting,
  vendor restocks, a long-horizon doom meter.
- Zero-friction tech: one static HTML file, no build, instant deploy to GitHub Pages, trivially forkable.
- Clean per-content "class" pattern makes adding an item/skill/area a small, local, copy-paste edit.
- Strong info UX: hover tooltips + Shift-for-extra-detail layer, color-coded rarities/messages, deep
  statistics screen.
- Sensible global tick architecture with per-tick / per-day / per-week "plans" scheduler and
  accumulating idle-style time.

### Weaknesses
- **No pure-core / no model-view separation:** logic calls DOM directly → not unit-testable or
  deterministic in isolation (**directly violates the rule we want to follow**).
- Everything in one 14.7k-line file with global mutable state and cryptic short names (`d5_1_1`,
  `asbu`, `frstnscgr`, `ddd_1`) — very hard to navigate, refactor, or onboard.
- Fragile saves with no migration: structure changes brick old saves ("save is kill"); error UX is a
  scary red wall of text.
- **Determinism not enforced:** uses `Math.random()` directly (`random()`/`rand()`), not a single
  seeded RNG → runs not reproducible.
- Massive content duplication (data + behavior hand-written per entity, no shared tables/generators).
- Many independent `setInterval` timers manually cleared in several places — easy to leak or
  double-register (changelog repeatedly mentions culling memory leaks and a "recursive timer" purge).
- Magic-number conventions (`item id / 10000` picks class/array) are brittle and undocumented.
- No accessibility, no responsive layout (fixed pixel panels), desktop-mouse-and-hover centric.

### Lessons for us
- **Adopt progressive-UI-reveal as a core design pillar:** near-empty first screen; fade in one
  panel/tab per first-use milestone (Proto23 gates the whole UI behind an "awake" flag, earns tabs via
  `sklu`/`asbu`/`actsu`/`jnlu`/`m_un`). The single most reusable idea here.
- **Make unlocks diegetic and time-gated:** unlock Bestiary/Journal/recipes/quests by reading in-world
  scrolls/manuals that cost in-game time — fits Edo perfectly (temple texts, ryu scrolls, merchant
  ledgers).
- Keep the per-content "class" pattern (one constructor/factory per content type) but **invert their
  mistake** — put the DATA in plain tables/JSON in the **pure core**, let the renderer consume it, so
  we get their easy authoring AND our testability.
- **Steal the skill-milestone web:** perks at thresholds give stats, titles, cross-skill multipliers —
  cheap to author, emergent build depth, long-tail goals.
- **Single tick driver with per-tick/per-day/per-week scheduler** (their `plans[0..2]`) so
  seasonal/festival/lunar Edo events and idle accrual fall out naturally; abstract clock decoupled
  from real time.
- Borrow satiety/energy as a soft pacing gate plus the systemic flavor layer (kanji seasons, weather,
  lunar phases, food rotting) — **but route ALL randomness through one seeded RNG** (which they did not).
- **Fix their save mistakes:** versioned schema with explicit migration up front, validate on load,
  degrade gracefully (no red "save is kill" wall); keep their base64 import/export-to-file feature.
- Their one-file approach is great for instant deploy but doesn't scale for agentic multi-file work;
  split into pure-core modules + thin DOM renderer, **but preserve their no-build static-hosting
  simplicity** (plain ES modules, no bundler needed).
- Adopt their info UX: universal hover tooltips, Shift-for-extra-detail, color-coded
  rarities/messages, capped scrolling message log, deep statistics screen.

---

## Inspiration #2 — Yet Another Idle RPG

**Game:** Yet Another Idle RPG (by **miktaew**). Hosted on GitHub Pages; `master` = dev code,
`gh-pages` = live release.

### Tech stack
- **IMPORTANT CORRECTION:** this is **NOT a Vue app.** It is plain **vanilla JavaScript** (ES modules,
  `"use strict"`), with **NO framework, NO reactivity library, NO virtual DOM.**
- UI is hand-written **static HTML** in `index.html`, styled by `style.css`, mutated imperatively via
  direct DOM calls (`getElementById`, `element.style`, `classList`) and **CSS custom properties**
  (e.g. `document.documentElement.style.setProperty('--inventory_div_display', ...)`).
- **Build: esbuild only.** `src/build.js` calls `esbuild.build` with entry `src/main.js`,
  `bundle:true`, `minify:true`, `sourcemap:true`, `format:'iife'`, `target es2020` → `dist/bundle.js`.
- **NO `package.json` committed**; esbuild run ad-hoc (README mentions `npm run build` / `live-server`).
  `build.js` also rewrites the `?version=` query string on the script/link tags in `index.html` from
  `src/game_version.js` (`game_version = "v0.5.5.29"`) so cache-busting tracks the version constant.
- **Scale: ~35,600 lines of JS** across ~30 `src` modules. Largest: `main.js` (5,979), `display.js`
  (5,723), `items.js` (5,034), `locations.js` (3,762), `skills.js` (3,380), `dialogues.js` (2,349),
  `crafting_recipes.js` (1,861).
- Third-party: **HackTimer** (keeps `setTimeout`/`setInterval` accurate in background tabs via a Web
  Worker — essential for an idle game) and an `Inkfree.ttf` font.

### Code architecture
Clear two-layer split, but **NOT the pure-core boundary our CLAUDE.md wants** — logic and DOM are
entangled in `main.js`.

1. **DATA/CONTENT modules — one file per content type, each exporting a plain object keyed by id whose
   values are class instances** (the registry pattern, content as data-as-code): `items.js`
   (`item_templates`), `enemies.js` (`enemy_templates`), `locations.js` (`locations`), `skills.js`,
   `dialogues.js`, `quests.js`, `activities.js`, `crafting_recipes.js` (`recipes`), `combat_stances.js`
   (`stances`), `traders.js`, `active_effects.js` (`effect_templates`). Each defines a class
   (`Item`/`Enemy`/`Location`/`Skill`/`Dialogue`/`Quest`…) plus a giant literal that instantiates
   dozens of entries, e.g. `enemy_templates["Wolf"] = new Enemy({...})`,
   `locations["Infested field"] = new Combat_zone({...})`.
2. **`display.js` — the entire rendering/DOM layer (~5,700 lines).** All `update_displayed_*` functions
   live here (`update_displayed_health`, `update_displayed_character_inventory`,
   `update_displayed_stats`, `update_character_attack_bar`, `update_displayed_enemies`,
   `create_displayed_crafting_recipes`…). Logic in `main.js` calls these explicitly after every state
   change; **no observer/binding — updates are manual push.**
3. **`main.js` — the orchestrator / God file (~6,000 lines):** imports everything, holds mutable global
   state (`current_location`, `current_enemies`, `current_activity`, `global_flags`, `active_effects`,
   `total_kills`…), runs the loops, contains save/load. It both mutates state AND calls `display.js`,
   so **logic is not DOM-free.**

Support modules: `misc.js` (helpers incl. `compare_game_version`, `get_hit_chance`, `random_range`),
`rewards.js`, `pathfinding.js` (fast-travel between unlocked locations), `market_saturation.js` +
`trade.js` + `traders.js` (economy that depresses prices when over-selling), `reputation.js`,
`weather.js` + `game_time.js` (day/season/temperature), `particles.js` (canvas snow/rain/stars),
`verifier.js` (`Verify_Game_Objects()` — content-integrity checker callable from console, validates
ids/refs across registries), `translation.js` + `locales/english.js` (i18n via key lookup).
`src/mods/glassmaking.js` shows a mod-extension seam. Inheritance used in content classes (`Hero
extends InventoryHaver`; `Combat_zone`/`Challenge_zone extends Location`; `Gathering extends Activity`;
many `*Recipe` subclasses).

### Core loop
**Two decoupled clocks:**
- **(a) 1-second world tick:** `update()` reschedules itself with `setTimeout(...,1000/tickrate)`; each
  tick advances game time, applies weather/temperature, regenerates HP/stamina while resting/sleeping,
  ticks active-effect durations, recovers market prices on day change, auto-saves on a counter.
- **(b) Combat on SEPARATE self-rescheduling `setTimeout` loops, one per combatant, paced by
  `attack_speed`** — NOT on the world tick. `set_new_combat` sets per-enemy cooldowns;
  `do_character_attack_loop`/`do_enemy_attack_loop` count 0..60 sub-ticks to animate the attack bar,
  then fire `do_character_combat_action`/`do_enemy_combat_action`. Both self-correct timing drift via a
  variance accumulator capped at `maximum_time_correction`.

**Minute-to-minute:** pick a location → if a `Combat_zone`, auto-combat starts and repeats until
`enemy_count` clears (XP + skill XP + loot per kill); if a safe `Location`, choose an activity (job for
money, training for stats, gathering for materials), talk to NPCs, craft, trade, sleep, or read books.
Everything is idle/auto once started.

**Hour-to-hour:** clear a zone enough to trigger `rewards_with_clear_requirement` → unlock connected
locations, reputation, recipes, activities, or quest progress; level skills past milestones; craft
better gear from gathered + smelted + forged components; advance the questline via dialogue. The
fresh-start flow (bottom of `main.js`) seeds the player at **"Village"** with starter items + **102
money** and starts the quest **"Lost memory"** (the narrative spine).

### UI structure
- Single static HTML page, **all panels authored up front**. A `loading_screen` (title, whimsical
  progress messages, PLAY button) gates a `main_content` area.
- Panels: character info (name + XP/HP/stamina/mana bars), character stats, equipment
  (head/torso/arms/legs/feet/ring/amulet/artifact/cape + weapon/off-hand + tool slots), combat
  management (stance picker, attack bar), location info, combat area (up to **8 enemy slots** with HP
  bars), inventory (money + filterable/sortable items), trade/storage overlays (reuse the inventory
  area), skills list (sortable, hide-max-level toggle), stances table, magic list, a journal with tabs
  (Quests, Bestiary, Anthology/books, Data/reputation+item-log), a crafting window with **7 categories**
  (tinkering, butchering, cooking, woodworking, smelting, forging, alchemy) each with
  items/components/equipment subpages, a filterable message log, time/weather display, options overlay.
- **Heavy use of CSS custom properties for show/hide** (`--inventory_div_display` vs
  `--character_combat_div_display`, `--equipment_display`, `--options_display`) and a `content_stack`
  for nested modal flows (dialogue → action → result with clean back-navigation).

### UI-unlock mechanics
Two distinct mechanisms, both **data-driven** rather than hard-coded screens:
1. **CONTENT-FILTERED LISTS (the dominant pattern).** Fixed panels always exist; what they show is
   recomputed on demand. On location change, `display.js` rebuilds action/dialogue/trader/activity/
   connection lists by **FILTERING the location's content to entries that are
   `is_unlocked && !is_finished`** (and for activities, whose required skills are themselves unlocked).
   So a dialogue line, trader, crafting station, neighbouring location, or activity simply "appears"
   the moment its `is_unlocked` flag flips. Connected locations also hide once `is_finished`, pruning
   the map as zones are exhausted.
2. **GLOBAL FEATURE FLAGS for whole subsystems.** `global_flags` (e.g. `is_gathering_unlocked`,
   `is_crafting_unlocked`, `is_strength_proved`) gate categories; when set, a templated `unlock_text`
   message is logged ("You have gained the ability to craft items and equipment!") and the relevant
   options start passing filter checks. **Skills are progressively revealed:** a `Skill` stays hidden
   until `total_xp` exceeds its `visibility_treshold` (**default 10**), so you discover skills by
   accidentally using them. **Dialogue/quest rewards are the engine** that flips all these flags —
   selecting a textline grants a `rewards` object that can unlock locations, dialogues, textlines,
   items, quests, recipes, activities, AND lock other lines (`locks`/`locks_lines`) — branching,
   self-revealing progression with almost no imperative UI code.

### Progression systems
- **Character XP/level:** geometric curve (`xp_scaling 1.6`); each level grants HP (`10*ceil(level/10)`),
  +5 stamina, attribute points (odd/even level split), a compounding skill-XP multiplier (1.03/level).
- **Skills (the core depth):** `Skill` class with `current`/`total_xp`; per-level total-XP formula
  `base_xp_cost*(1 - xp_scaling^n)/(1 - xp_scaling)` with `xp_scaling` **default 1.8 (steep)**. Single
  XP gains **CAPPED per event** (`skill_xp_gains_cap` 0.1 for combat, 0.25 for crafting) so no skill
  levels in one action — forces repetition. Milestones grant flat stats (+1 dexterity), stat
  multipliers (x1.05 strength), or XP multipliers to other skills/categories
  (`category_Combat:1.05`). Categories: Combat, Weapon, Stance, Activity, Crafting, Environmental.
- **Combat stances:** level a related skill to strengthen multipliers / soften penalties; stances
  change `attack_power`/`speed`/`evasion`/`block` and `target_count` (multi-target).
- **Zone clears:** `enemy_count` per zone; `first_reward` (one-time), `repeatable_reward`, tiered
  `rewards_with_clear_requirement` (e.g. after 4 clears unlock a hidden tunnel + reputation).
- **Reputation per faction** (e.g. Village) gates dialogue/content via `display_conditions`.
- Equipment quality/rarity tiers (trash→mythical, x1→x2.5 multiplier) from crafting skill.
- Quests/questlines with sequential tasks tracked via game events.
- Books grant passive XP bonuses while reading; an "export reward" nudges players to back up saves on
  a timer.

### Content systems
- **Combat:** stat-based auto-battler. Hit chance from `get_hit_chance` (attacker
  `dexterity*sqrt(intuition)` vs target `evasion_points`). Damage = `attack_power` ±20% variance,
  reduced by `max(defense - armor_penetration)` with a **10% damage floor**; crits multiply by
  `crit_multiplier` (enemy crit fixed 0.1 chance / x2). Block and evade are separate rolls.
  Multi-target via stance `target_count`. On kill: XP scaled by group size, loot rolled, bestiary
  updated, quest `kill`/`kill_any` (by tag) events fired.
- **Enemies:** `Enemy` class with stats `{health, attack, agility, dexterity, intuition, magic,
  attack_speed, defense}`, `xp_value` (1..300), rank, size (SMALL/MEDIUM/LARGE), tags (beast/living),
  `loot_list` of `{item_name, chance, optional count range}`; `get_loot` applies skill-based droprate
  modifiers (e.g. Butchering on beasts).
- **Locations:** `Location` (safe) vs `Combat_zone` vs `Challenge_zone` (one-time);
  `connected_locations` form a directed graph with `travel_time` and optional skill gates;
  `LocationType` adds environmental modifiers (dark/narrow/bright) whose penalties shrink as the
  related environmental skill levels.
- **Items/equipment:** class hierarchy `Item -> OtherItem/Material/ItemComponent/UsableItem/
  Equippable/Book`. Equipment is **COMPONENT-BASED**: weapons = head+handle, armor = internal+external,
  shields = base+handle; quality computed from crafter skill + component quality.
  `inventory_key = JSON.stringify({id,components,quality})` so different qualities stack separately.
- **Crafting:** recipes nested as `recipes[category][subcategory][id]`; categories
  crafting/cooking/smelting/forging/alchemy/butchering/woodworking; success chance and output quality
  scale with relevant skill and station tier (quality formula folds skill level, component quality, tier).
- **Dialogue/story:** `Dialogue` holds `Textlines`; selecting a line shows text, grants a `rewards`
  object, can lock other lines (branching). `display_conditions`/`required_flags` gate lines on
  reputation/level/season/skills/flags — the primary story + unlock delivery vehicle.
- **Quests:** `Quest` with sequential `QuestTasks`; conditions (any/all → type
  kill/reach_skill/enter → target → current/target) advanced by `catchQuestEvent`; `finishQuest`
  grants rewards.
- **Economy:** traders refresh inventory on a timer; `market_saturation` depresses sell prices when
  you flood a region with one item, recovering over in-game days.
- **Activities:** `Job` (money), `Training` (continuous skill XP), `Gathering` (needs a tool, yields
  loot + skill XP on completion).
- **Weather/time:** day/season cycle with dynamic temperature; cold/wet active effects from being
  outside; canvas particle FX.

### Save system
- `localStorage`, manual + auto. `create_save()` builds a plain object, returns it as a JSON STRING.
  **Design principle: save ONLY the minimal non-derivable state and recompute everything else on load.**
- Stored: game version, `current_game_time`, language, lifetime stats
  (playtime/deaths/kills/crits/hits/strongest_hit), `global_flags`; character = `{name, titles, money,
  xp.total_xp, hp_to_full & stamina_to_full as deltas, reputation, inventory as {key:{count}},
  equipment}` — **NOTE stats are NOT saved** (comment: recalculated on load); per-skill **ONLY
  `{total_xp}`** (level re-derived); per-location only `is_unlocked`/`is_finished` +
  `enemy_groups_killed` + `unlocked_activities` + per-action `is_unlocked`/`is_finished`/`progress`;
  per-dialogue/textline/action `is_unlocked`/`is_finished`; recipes `is_unlocked`/`is_finished`;
  traders (with refresh timestamp, skipping inventory if it would refresh anyway); books
  `accumulated_time`; quests `is_active`/`is_finished` + `task_status`; `player_storage`; favourites;
  `current_activity` progress.
- **Persistence:** `save_to_localStorage({key})` writes the JSON string; keys are `"save data"` /
  `"dev save data"` plus `"backup save"` / `"dev backup save"`. Auto-save off a counter
  (`save_period ~60`), backups on `backup_period ~3600`.
- **Export:** `save_to_file()` returns `btoa(create_save())` (base64), grants a periodic "export
  reward" to incentivize backups; `load_from_file` does `atob` → `JSON.parse` → `load()`.
- **Versioning/migration:** `load()` runs many `compare_game_version(...)` checks against
  `save_data["game version"]` to migrate old saves (e.g. x100 quality before the quality rework,
  renaming `is_deep_forest_beaten` → `is_strength_proved` pre-0.5, economy rework before v0.3.5).
  `compare_game_version` (in `misc.js`) splits on dots, zero-pads, compares numerically.

### Strengths
- **Data-as-code content registries:** every system is a `{id: new ClassInstance({...})}` table —
  adding content (enemy, location, recipe, dialogue) is a localized, declarative edit with no engine
  changes — huge for agentic/incremental authoring.
- **Minimal-state save model:** persist only `total_xp` + unlock/finished flags + item counts + kill
  counts, recompute derived stats on load → tiny, forward-compatible, migration-friendly saves; balance
  retuning of formulas doesn't corrupt old saves.
- **Reward object as a universal unlock bus:** one `rewards` schema
  (items/xp/money/locations/dialogues/textlines/recipes/quests/flags/locks) processed by one
  `process_rewards()`, emitted from kills, dialogue, quests, actions — progression wired declaratively.
- **Progressive reveal for free:** panels static; visibility is just filtering on
  `is_unlocked && !is_finished` plus a skill `visibility_treshold`. UI "grows" with almost no UI-state code.
- **Combat decoupled from the world tick** onto per-combatant self-correcting timers paced by
  `attack_speed` — clean; naturally supports different speeds and multi-target.
- **Built-in content integrity verifier** (`Verify_Game_Objects`) cross-checks all cross-references.
- **HackTimer integration** for accurate idle progress in background tabs (easy to forget).
- Thoughtful idle UX: per-action skill XP caps force breadth, export-reward nudges backups, market
  saturation discourages mindless grinding.

### Weaknesses
- **No pure-core boundary:** `main.js` (6k lines) mixes state mutation, combat math, save/load, AND
  direct `display.js` calls → logic not DOM-free → **NOT unit-testable in isolation** (contrary to our
  rule).
- `main.js` and `display.js` are God files (~6k and ~5.7k lines); hard to navigate/review.
- **Manual push-rendering:** every logic path must remember the right `update_displayed_*` call — easy
  to miss → stale UI; no single `render()` reconciliation.
- **Determinism violated:** randomness uses `Math.random()` scattered everywhere (combat, loot,
  dialogue flavor), not a single seeded RNG → runs not reproducible (contrary to our rule).
- No `package.json` / locked toolchain committed; build is ad-hoc esbuild.
- Content tables are enormous hand-written literals (`items.js` 5k lines) — balance tables live in
  code, not generated; cross-referencing/tuning manual (mitigated only by the verifier).
- Heavy reliance on stringly-typed ids and CSS-custom-property toggles makes refactors fragile.
- No automated tests; correctness rests on the runtime verifier + playtesting.
- Acknowledged WIP balance; steep skill curve (`xp_scaling 1.8`) + per-gain caps can feel grindy.

### Lessons for us
- Adopt the **content-registry pattern** (one module per content type, `{id: data}` tables) for
  Edo-era content — but author it as **PURE DATA consumed by our pure core** (the one place to
  deliberately diverge from their architecture).
- **Steal the minimal-state save model wholesale:** persist only `total_xp` per skill, unlock/finished
  flags, inventory counts, kill/clear counts, current location/time; recompute every derived stat on
  load. Pair with version-tagged migration (store version, run ordered `compare_game_version`
  migrations).
- **Use one universal `rewards` object + one `process_rewards()` as the unlock bus**
  (locations/skills/dialogues/textlines/recipes/quests/flags/locks), emitted by combat, quests,
  dialogue, actions — collapses all progression wiring into declarative data.
- **Progressive UI reveal the cheap way:** author panels once, render by filtering content on
  `is_unlocked && !is_finished`, hide skills until a small `visibility_treshold` so players discover
  mechanics by doing. Avoid bespoke per-feature reveal code.
- **Decouple combat from the world tick:** run a fixed-step pure-core simulation, but let attack
  cadence be data (`attack_speed`). Drive it from our **seeded RNG** and a deterministic step function
  (their `Math.random()` everywhere is the anti-pattern).
- **Centralize randomness through a single seeded RNG from day one** — the one thing this game gets
  wrong and our CLAUDE.md explicitly requires.
- Port two idle-genre essentials they nailed: (a) **background-tab-accurate timers** (HackTimer or our
  own Web Worker tick); (b) an **export/backup affordance** (base64 string export) with a gentle
  incentive.
- **Build a content verifier early** (their `Verify_Game_Objects`). Per our "generate, don't duplicate"
  rule, go further and **GENERATE balance tables into `docs/`** from the same data, instead of
  hand-maintaining 5k-line literals.
- **Make dialogue the story+unlock delivery vehicle:** Textlines with rewards + locks +
  `display_conditions` (reputation/level/season/skills/flags) give branching narrative with almost no
  code; seed a single starter quest at new-game to anchor direction.
- **Borrow component-based crafting** (item = combination of components; quality from skill + component
  quality + station tier; quality folded into stack key) for deep gear progression from a small
  component vocabulary — and add an economy damper like `market_saturation`.
- **Avoid their God-file trap:** keep our core split into small, single-concern, DOM-free modules with
  the renderer a separate consumer of plain core state, so we stay reviewable/testable toward their
  35k-line scale.

---

## The incremental/idle genre

A brief on the genre and (especially) its UI-incrementality patterns.

### Defining traits
- **Numbers-go-up core loop:** an exponentially scaling currency/stat is the heartbeat; satisfaction
  comes from watching a number cross thresholds and accelerate. The genre is fundamentally about the
  **DERIVATIVE** (rate of growth), not the absolute number.
- **Layered automation:** manual action (clicking) → purchased producers → upgrades → automation
  systems; each layer removes the prior's chore. The **active→idle transition is the spine.**
- **Progressive content reveal as the primary "fun" delivery mechanism:** the signature pleasure is the
  "wait, there's MORE?" moment when a new system/tab/mechanic appears. New mechanics, not bigger
  numbers, re-hook players. (Most relevant trait for a UI-incremental story RPG.)
- **Threshold-gated unlocks:** features appear when a resource/level/story-flag crosses a value, never
  on an invisible timer. Unlocks feel earned because they're tied to player progress.
- **Compounding/multiplicative systems:** producers feed upgrades that multiply producers; late game is
  a web of cross-multipliers (Cookie Clicker grandma synergies, NGU resource interplay).
- **Goal-laddering / known-unknowns:** the player can always see the next 1–2 things they're saving
  toward (a grayed building, a locked tab with a teaser). Never a "what do I do now?" moment.
- **Determinism + reproducibility friendly:** the best ones are pure-state machines (state + tick +
  RNG-from-seed) — exactly the pure-core architecture our CLAUDE.md mandates.
- **Long, asymptotic tail with reset loops (prestige)** to recycle content; the best wrap it in a
  fiction so the grind has meaning (A Dark Room, Universal Paperclips).

### UI-incrementality patterns
- **RESOURCE-REVEALS-PANEL (A Dark Room's signature — steal first):** UI is panels each bound to a
  resource/flag; a panel doesn't exist until its trigger resource is first acquired. In ADR: 1 Fur →
  Trading Post + Tannery; first Meat → Lodge + Smokehouse; first Leather → Workshop; Iron+Coal →
  Steelworks. Implementation: render `panels.filter(p => state.flags.has(p.unlockFlag))`; set the flag
  on first appearance. Each new resource line in "stores" is itself a micro-reveal.
- **ONE-BUTTON COLD OPEN:** start with a SINGLE interactive element and nothing else (ADR = "light
  fire"; Paperclips = "make paperclip"; AD = buy 1st dimension). The empty screen IS the hook. No tabs,
  stats, or menus yet; reveal the second element only after the first is used.
- **GHOST/GRAYED NEXT ITEM (Cookie Clicker):** the very next purchasable is shown grayed-out with cost
  visible BEFORE you can buy it (a visible savings goal); the item after that is hidden entirely — so
  the player always sees exactly one "locked but known" item (a tight known-unknown horizon).
- **TAB-PER-SYSTEM, UNLOCKED BY TRIGGER (Kittens / NGU):** each major system is a tab, hidden until
  unlocked, appearing with a subtle "new" badge. Kittens: Workshop tab on first minerals; Time tab on
  Calendar research. NGU: a new tab per boss defeated. The **tab BAR itself grows** — navigation chrome
  is part of the reveal.
- **WHOLESALE UI METAMORPHOSIS AT PHASE BOUNDARIES (Universal Paperclips):** at major story/prestige
  beats, replace the screen, don't just add a panel. Paperclips: business sim → resource-allocation
  strategy (Ops/Trust/Projects, sliders) → abstract space game (drones, probes, von Neumann combat).
  For a story RPG: each Act can retheme/relayout the whole UI, making progression feel like chapters.
- **PROJECT/UPGRADE GRID THAT FILLS IN (Paperclips "Projects", AD upgrades row):** a grid of one-time
  unlocks where new cells pop in when prerequisites are met. Each project can itself unlock a new
  mechanic or panel — upgrades that unlock UI, not just multipliers.
- **CAPACITY-GATED REVEAL (Paperclips "Trust" / memory slots):** a meta-resource limits how many
  systems can be active/visible at once, so UI growth becomes a player decision.
- **NARRATIVE-MESSAGE LOG AS THE BRIDGE (ADR's most important lesson):** a scrolling event feed sits
  beside the sparse early UI so the screen is never truly empty even with one button. Amir Rajan (ADR
  iOS) specifically added timed story messages early to stop players bouncing off the lone "stoke fire"
  button and leaving 1-star reviews. For a story RPG this log is also the narration channel.
- **UNLOCK-AS-DIEGETIC-EVENT:** announce each new panel/tab in-fiction through the message log ("A
  ragged stranger stumbles in…" precedes the build menu). The mechanic reveal and the story beat are
  the same event, so UI growth feels like plot, not menu inflation.
- **PROGRESSIVE AUTOMATION REVEAL (Trimps/NGU):** the chore done manually gets an "automate this"
  toggle as a reward, freeing screen attention for the next manual system. Automation unlocks are
  permanent and framed as upgrades, pacing the active→idle shift.
- **SMALL-NUMBER FORMATTING UNTIL IT MATTERS:** keep early numbers in plain integers/short form; only
  introduce scientific/engineering notation (AD-style `1.8e308`) once magnitudes demand it, and treat
  that switch as its own "you've leveled up" reveal.
- **DON'T REMOVE, RELOCATE:** when an early mechanic becomes obsolete (manual clicking), keep it
  available but shrink/collapse it rather than deleting, so the player feels growth, not loss.

### Pacing and numbers
- **Cost curve:** genre-standard exponential `price = base * r^owned` with **r in the 1.07–1.15 band**
  (Cookie Clicker 1.15 for all buildings; Clicker Heroes 1.07; AdVenture Capitalist 1.07–1.15).
  **r=1.15 is a safe default.**
- **Income/production grows LINEARLY or polynomially per purchase while cost grows exponentially** — the
  widening gap is what naturally paces the game (each purchase takes a bit longer).
- **Between building TIERS:** Cookie Clicker uses roughly a **5x base-cost jump** (15, 100, 1100, …).
- **First-session targets (make-or-break):** first meaningful action **<5 seconds**; first automated
  producer purchasable in **15–30 seconds** (Cookie Clicker's first cursor = 15 cookies; ADR's stranger
  within ~1 min of stoking); a NEW system/panel/tab reveal **roughly every 1–3 minutes for the first
  10–15 min**, then stretching to every 5–15 min. ADR reveals fire→stranger→wood→cart→hut→villagers→
  traps→trading post in the first ~10–30 min. A good first session delivers **5–8 distinct "new thing
  appeared" moments in the first 20–30 minutes.**
- **Time-to-milestone for prestige/Act boundaries:** first prestige/Act-end reachable in a single
  sitting of **~1–3 hours**; subsequent loops faster on first pass, then the NEXT layer markedly longer
  — Antimatter Dimensions' published pacing: **first Infinity <1 day, first Eternity <1 week, first
  Reality ~1 month**, each layer ~5–10x the previous in wall-clock.
- **For a story RPG, compress this:** Act 1 in one session (**~1–2h**), Act 2 over a few days of
  check-ins, full story over **2–4 weeks** of casual play.
- **Offline cap:** grant offline progress but cap it (commonly **8–24h** of accrual, or a fixed % of
  online rate).
- **Avoid hard numeric walls:** never let the next visible goal be more than **~2–3x** the wait of the
  previous one without giving a new mechanic; introduce a new mechanic or a multiplier reset rather
  than asking for raw patience.

### Retention mechanics
- **OFFLINE/IDLE PROGRESS (use, but tune for a story RPG):** grant accrual while away but CAP it
  (8–24h or a %); show a "while you were away…" summary — a documented operant-conditioning hook for
  daily re-checks. **Gate STORY beats on active play** (don't let plot advance offline) while letting
  GRIND advance offline.
- **STORY/CONTENT UNLOCKS AS THE PRIMARY RETENTION DRIVER (best fit):** the strongest lever for a
  narrative incremental is the next chapter/panel/mechanic, not a leaderboard. Always keep one visible
  locked thing dangling. New MECHANICS re-hook far more than bigger numbers — schedule a fresh system
  at every Act.
- **ACHIEVEMENTS that double as a checklist/guide** (Cookie Clicker, Melvor, AD): quietly teach
  mechanics ("own 10 huts", "survive a thief raid"), provide secondary goals during slow stretches;
  some give small permanent bonuses. Cheap, high value — recommended.
- **PRESTIGE/RESET LOOPS — USE CAREFULLY:** classic prestige (wipe for a permanent multiplier) is the
  endgame engine but can clash with narrative. **DIEGETIC prestige works** (A Dark Room loops to a new
  beginning as plot; Paperclips' phase resets ARE the story). Make resets narrative events
  (reincarnation, time loop, new map/era) carrying meta-progress forward; reserve the first prestige
  until AFTER the first arc resolves so it reads as a chapter break.
- **DAILY/SESSION RITUAL** via the return-summary + a couple of time-gated systems so there's always a
  reason to open the tab daily — but **AVOID hard daily-login streak FOMO** (free-to-play mobile, not a
  self-contained story RPG; feels manipulative).
- **PERMANENT META-PROGRESSION / automation unlocks** (Trimps, NGU, AD perks): keep the long tail
  engaging and signal "you've grown." Strongly recommended — frame each as a story-justified capability.
- **AVOID for a story RPG:** competitive leaderboards, PvP, gacha/lootbox randomness on core
  progression, energy/stamina timers that block play, aggressive daily-streak guilt loops.

### Exemplars (what to steal)
- **A Dark Room** — *THE blueprint.* (1) Resource-reveals-panel (UI literally grows out of play).
  (2) One-button cold open ("stoke the fire") with a scrolling event log so the screen is never dead.
  (3) Mechanic reveals delivered AS story beats through that log (the stranger arriving = the build menu
  appearing). (4) Whole-game genre shift (idle survival → village sim → RPG world map + combat → sci-fi
  reveal). (5) The Amir Rajan lesson: seed timed narrative messages in the sparse early minutes or
  players bounce off the empty screen.
- **Universal Paperclips** — Wholesale UI metamorphosis at phase boundaries (three completely different
  interfaces mapping onto story Acts). The "Projects" grid that fills in. The "Trust" capacity-gating
  (UI growth as a player choice). Tight fiction giving the numbers meaning end to end.
- **Cookie Clicker** — Cost-curve math (1.15 multiplier, ~5x jumps between tiers, base costs
  15/100/1100…). The grayed-out next-building pattern. Achievements-as-guide with small permanent
  bonuses. Building synergies (cross-multipliers). Two-buttons-at-start restraint.
- **Kittens Game** — Tab-per-system reveal with precise resource/research triggers (minerals →
  Workshop tab; Calendar research → Time tab). The growing tab BAR as part of the UI. Deep simulation
  behind a simple text UI — but ALSO a cautionary tale on complexity creep.
- **Trimps** — Progressive AUTOMATION as the reward structure: do something manually, then earn the
  toggle to automate it, freeing attention for the next manual layer (how to pace active→idle).
  Permanent automation unlocks as you climb zones. Natural session break points.
- **NGU Idle** — "Modular ever-expanding UI where new tabs unlock per boss defeated" —
  milestone-gated tab proliferation. Resource-allocation as the core decision (Energy/Magic split).
  The namesake infinite-but-diminishing upgrade sink for the long tail. Bosses (story beats) as the
  unlock currency.
- **Melvor Idle** — Skill/feature unlocks gated behind level AND an increasing GP cost (Adventure
  Mode), forcing a deliberate unlock ORDER. Skills that feed each other (mine ore → smith gear →
  combat). Explicitly non-competitive, set-your-own-goals framing.
- **Antimatter Dimensions** — Sequential reveal of a row of producers (dimension 1 → … → 8), then
  second-order systems (Dimension Boosts, Galaxies, Tickspeed) only once you've mastered the first,
  then the Infinity prestige. Clean nested prestige layers (Infinity/Eternity/Reality) with published,
  deliberately escalating pacing (<1 day / <1 week / ~1 month). Scientific notation "turning on" as its
  own milestone.

### Pitfalls
- **Empty-screen bounce:** the cold-open minimalism that makes ADR great nearly tanked its iOS launch.
  If early UI is sparse, you MUST fill the void with narrative/event messages and a fast first reveal,
  or players quit in the first 60 seconds.
- **Progression walls:** too tight → multi-hour waits with nothing new → churn; too generous → maxed
  out, nothing to chase. Never let the next visible goal balloon to many multiples of the previous wait
  without a NEW mechanic.
- **Automation timing errors:** automate a chore too early → player disengages; too late → churn from
  tedium. The active→idle handoff must be tuned per system.
- **Prestige-reset feel-bad:** context-free "reset everything for a multiplier" clashes with narrative.
  In a story RPG, resets must be diegetic and carry meaning, or skipped early.
- **Complexity creep / spreadsheet syndrome** (Kittens Game's own community flags this): late-game
  optimal play degenerating into monstrous calculations alienates casual/story-seeking players. Keep
  decisions legible; don't stack interacting multipliers faster than you teach them.
- **Mistaking bigger numbers for content:** players re-hook on NEW mechanics, not larger values. A long
  stretch of "same loop, bigger number" with no new panel is where idle games lose people.
- **Narrative-mechanic desync:** if story advances on a separate track from systems, the fiction feels
  bolted-on. ADR/Paperclips work because each mechanic reveal IS a story beat.
- **Offline progress that trivializes the story:** if plot or key unlocks accrue offline, players
  return to find decisions already made and tension drained. Let grind idle; gate STORY on active play.
- **Notation/legibility shock:** dumping scientific notation or dozens of resources at once is
  overwhelming. Reveal magnitude and resource count gradually; the formatting change should be a
  celebrated milestone, not a sudden wall of e-notation.
- **Tutorial over-explaining:** the genre's joy is discovery ("revelatory moments are more fulfilling
  when not spelled out" — ADR's Townsend). Heavy hand-holding kills the surprise the UI-reveal design
  exists to create. Teach through the reveal itself.

### Lessons for us
- **Make the UI-reveal engine a first-class system in the pure core:** represent every
  panel/tab/resource-row/button as DATA with an `unlock` predicate over game state (flags, resources,
  level, story node). The renderer just shows what's currently unlocked. Satisfies the pure-core
  boundary AND makes "the UI is incremental" a tunable content table rather than hardcoded view logic.
- **Adopt A Dark Room's resource-reveals-panel as the default unlock idiom:** the first time a
  resource/stat appears, it lights its associated panel — and announce that reveal as a story event in
  a persistent message/log component present from second one (so the screen is never empty).
- **Open with literally one interactive element plus the event log.** First action **<5s**, first
  automated producer **<~30s**, and **5–8 distinct reveals in the first 20–30 minutes.** This window
  decides retention.
- **Fuse every mechanic reveal to a story beat.** A panel/tab/automation should never appear silently;
  it arrives because something happened in the narrative. Treat the unlock table and the story-flag
  graph as the **same dependency graph.**
- **Use the genre's proven math as defaults:** producer cost `base * 1.15^owned`, ~5x base-cost jumps
  between tiers, linear/polynomial production vs exponential cost. **Generate** the resulting
  balance/time-to-milestone tables into `docs/` (per "generate, don't duplicate") so pacing is
  auditable and walls are spotted before players hit them.
- **Structure the whole game as Acts that can RE-LAYOUT the UI** (Paperclips-style), not just append
  panels. Each Act = a chapter with its own dominant systems and possibly a diegetic reset carrying
  meta-progress — turning prestige into plot.
- **Pace automation unlocks as Trimps does:** let the player do each new thing manually first, then
  GIVE automation as a story-justified reward (the active→idle dial).
- **Pick retention mechanics that fit single-player story:** capped offline grind + "while you were
  away" summary, achievements-as-guide with small permanent bonuses, diegetic prestige. Explicitly
  avoid leaderboards, gacha, energy timers, daily-streak FOMO.
- **Gate STORY on active play, GRIND on idle:** never advance plot or hand out narrative unlocks
  offline, so returning players still make the meaningful choices themselves.
- **Lean on discovery over tutorials:** teach through the reveal, keep one known-unknown dangling at all
  times, and let players feel clever. Build a **DEV-only `window` play-API** (per the
  capture-game-states skill) to headlessly fast-forward and verify each unlock fires at the intended
  state — regression-testing the reveal pacing.

---

## Edo-era setting research

Edo-era Japan (**1603–1868**) as a setting: social structure, the estate, trades, folklore, geography,
story hooks, names, and authenticity notes.

### Social structure
- Popularly framed by **shi-no-ko-sho**: samurai (warriors/officials), *no* (farmers), *ko* (artisans),
  *sho* (merchants). **IMPORTANT for authenticity:** modern scholarship (since ~1995, now in Japanese
  textbooks) treats this **NOT as a rigid four-rung ladder** but as a **Confucian conceptual ordering.**
- The real hard line ran between the **ruling warrior class (~5–7% of the population**, the only ones
  allowed a public surname plus the **daisho** pair of swords) and everyone else, the commoners.
  Farmer/artisan/merchant were a **classification of commoners**, not a strict pecking order.
- The load-bearing relationship: **samurai-ruler vs peasant-producer.** Peasants were **~80–85%** of
  the population and paid tax in **RICE (measured in koku)**; rice yield was the literal basis of
  samurai power (domain wealth and samurai stipends both denominated in koku). → **Farming is the
  natural incremental base resource** that everything else taxes or feeds off.
- The nuance that fits the premise: the **GOSHI (country samurai)** and the rural landed elite, who
  blur the warrior/commoner line. A countryside estate is most plausibly headed by a goshi or a wealthy
  landholder with samurai-adjacent privilege (surname, sword, partial tax exemption), earned through
  service or inherited from a warrior ancestor who settled the land generations ago.
- Below him the village self-administered through **three commoner offices**: the **nanushi/shoya**
  (village headman, usually the richest farmer; collected tax, relayed the lord's orders); the
  **kumigashira** (ward/group heads); the **hyakushodai** (peasant representative who watched the
  headman on the villagers' behalf).
- Peasant society was itself stratified: **honbyakusho** (landholding "main" peasants with village
  voting rights) above **mizunomi-byakusho** ("water-drinking", i.e. landless tenants and
  day-laborers) and indentured servant households (**genin/fudai**).
- A **17-year-old farmhand belongs near the bottom**: a hired hand or servant with no land, no public
  surname, no sword. That low status is **good design fuel** — the arc is about quietly earning
  standing, trust, and eventually privileges normally reserved for those above you.

### The estate
- A countryside warrior residence is a **buke yashiki**, but a **rural goshi estate is humbler and more
  farm-like** than famous castle-town samurai blocks.
- Picture a walled/hedged compound: an earthen or plastered mud wall (or thick living hedge / bamboo
  grove) enclosing the grounds, entered through a **roofed gate (mon)** whose scale signals rank.
- Inside: a swept earth/gravel forecourt; the main house (**omoya**) with a thatched (**kayabuki**) or
  tiled roof; raised tatami rooms; a large earthen-floored work area (**doma**) with the **kamado**
  cooking hearth and a sunken **irori** hearth in the living room.
- Surrounding: a **kura** (thick-walled, fire-resistant storehouse for rice, tools, valuables);
  stables/byre for an ox or horse; a well; a vegetable garden and persimmon/plum trees; a small private
  garden; a household shrine (**kamidana** inside, plus a small outdoor **inari** or **ujigami**
  shrine). A homestead woodland (**yashikirin**) of useful trees often rings the house. Just beyond lie
  the estate's own rice paddies and dry fields worked by tenants and hired hands.
- **Plausible NPC roster:** the master / goshi family head (distant authority, the mystery's center);
  his wife / **okamisan** (runs the household economy); the heir son (rival or ally); a daughter
  (possible confidante); the retired patriarch (**inkyo**, keeper of family history/secrets); the head
  retainer / steward (**banto**); a swordmaster or guard; the village headman (**nanushi**) liaising
  with the estate; senior farmhands and tenant-farmer families; kitchen maids and a head housekeeper;
  the stable hand / oxherd; a gardener; a wet-nurse or old nanny full of folk tales; a resident or
  visiting priest (**kannushi**) and a Buddhist monk from the family temple (**bodaiji**); itinerants
  (peddler/**gyosho**, medicine seller, a **komuso** flute-monk, a ronin); craft specialists (village
  smith, charcoal-burner, sake/miso brewer). **The GUIDE** is most naturally a kind senior farmhand,
  the old nanny, or the headman's child who takes pity on the confused newcomer.

### Daily life & trades
- **FARMING (core gathering loop):** wet-rice paddy cultivation as the centerpiece — seedling beds,
  flooding/transplanting (**taue**), weeding, harvest, threshing, hulling. Dry fields add barley,
  millet, soybeans, daikon, vegetables. **Rice doubles as the world's base currency (koku).**
  Green/leaf-litter fertilizer from the satoyama and night-soil/ash recycling fit a "nothing wasted"
  upgrade tree.
- **FORAGING / sansai (mountain vegetables):** seasonal — warabi/zenmai (bracken ferns), bamboo shoots,
  mushrooms (**matsutake** a rare high-value drop), wild greens (fuki, seri), chestnuts, walnuts,
  persimmons, medicinal herbs. Maps to tiered, season-gated gathering nodes.
- **FISHING & river/coast harvest:** river/pond fishing (ayu/sweetfish, carp, eel, loach), weirs and
  traps, freshwater shellfish, duck/waterfowl. Eel and ayu prized; a fishing minigame or node tier fits.
- **WOODCUTTING & forestry:** coppicing the village woodland for firewood and timber, with judicious
  thinning (an Edo-era sustainable-forestry practice). Bamboo harvesting a distinct, fast-renewing
  resource (baskets, tools, building).
- **CHARCOAL BURNING (sumiyaki):** converting cordwood in earth kilns to charcoal — an essential fuel
  and classic remote-forest trade; a "processing" craft turning wood into a higher-value good (and
  powering the smithy).
- **SMITHING / metalwork:** the village blacksmith makes/repairs farm tools, sickles, hoes, knives,
  nails; charcoal feeds the forge. A tree from raw iron/charcoal → tools → fine blades (gates later
  weapons).
- **WEAVING, SPINNING & DYEING:** women spun hemp/ramie (and silk where sericulture existed) and
  hand-loomed cloth; **INDIGO (ai)** dyeing was iconic and practical (believed to repel snakes/insects,
  hide field stains; one of the few colors commoners were permitted). Boro patchwork mending fits a
  thrift/repair mechanic. A textile chain: fiber → thread → woven cloth → dyed garments.
- **SERICULTURE (silkworm raising):** seasonal mulberry-leaf gathering and silkworm tending → raw silk,
  a high-value regional cash crop; a good mid-game economic upgrade.
- **PAPERMAKING (washi):** kozo/mulberry-bark → handmade paper, useful for trade goods, lanterns, shoji.
- **POTTERY & LACQUERWARE:** clay-dug ceramics (everyday bowls/jars + storage urns for the kura) and
  urushi lacquerwork — slow high-skill crafts yielding prestige goods.
- **BREWING & food processing:** sake (rice + koji), miso, soy sauce, pickling (tsukemono);
  rice-hulling and milling — convert farm output into stored, tradeable value (a "food/processing"
  crafting branch).
- **HUNTING & trapping:** in mountain districts, matagi-style hunting of boar, deer, game birds (meat,
  hide, antler) + snaring small game — a higher-risk frontier trade bridging gathering into the
  dangerous folklore-rich uplands.
- **CARPENTRY & thatching:** woodworking for tools, furniture, buildings, and roof-thatch (kaya grass
  cut from managed grasslands) — a construction craft that can gate base/estate upgrades.

### Folklore & myth
- **KAPPA:** river/pond water-imp with a water-filled dish on its head; drowns the careless, steals
  cucumbers. Ideal **early water-area mob** and source of cautionary lore around paddies/ponds.
- **KITSUNE (fox spirits):** shapeshifting tricksters AND divine messengers of **Inari** (the rice
  deity) — tie directly to the farming theme and local shrine. Illusion puzzles, benevolent-or-malevolent
  quest-giver, a possible thread in the central mystery.
- **TANUKI:** jovial shapeshifting raccoon-dog of the satoyama; mischief, disguise. Comic-relief mob or
  a transforming NPC.
- **TENGU:** mountain spirits, bird/long-nosed, masters of swordsmanship, guardians of high passes and
  the boundary to the otherworld. Classic **late-game mountain boss** and, critically, the folkloric
  agent of being "spirited away" — a direct hook to the protagonist's arrival.
- **YAMAUBA / YAMANBA (mountain hag)** and **YAMABITO (mountain hermits):** deep-forest dwellers
  (dangerous old-woman witch; reclusive mountain folk). Eerie deep-forest area boss/encounter.
- **ONI:** horned ogre-demons, heavy-hitter brutes of the uplands and old battlefields; staple
  dungeon/boss enemy, target of ritual purification (setsubun bean-throwing) lore.
- **INARI / UJIGAMI and the kami of the land:** the local tutelary kami and rice god venerated at the
  estate's shrine — not enemies but the spiritual backbone (blessings, festivals, omikuji, quests to
  restore neglected shrines).
- **ZASHIKI-WARASHI:** a child-like house spirit that brings fortune to the home it haunts and ruin
  when it leaves — perfect estate-bound mystery presence and a soft tie to household luck and your
  arrival.
- **YUREI (vengeful ghosts):** white-robed spirits with unfinished business; haunted-site quests,
  graveyard areas, emotionally weighted late-game mysteries.
- **NOPPERA-BO (faceless ghost)** and **ROKUROKUBI (long-necked woman):** unsettling night-road and
  household yokai for atmospheric scares and "something is wrong with this NPC" reveals.
- **NURIKABE:** an invisible wall yokai blocking night travelers — an environmental/obstacle yokai
  gating a path until solved.
- **JOROGUMO:** spider-woman who lures victims to her web — a seductive-trap boss for a deep-forest or
  abandoned-house lair.
- **GASHADOKURO:** a giant skeleton assembled from the bones of the war-dead and starved — an
  apocalyptic late-game boss tied to old battlefields and famine lore.
- **KAMIKAKUSHI / TENGU-KAKUSHI ("hidden by the kami/tengu"):** not a monster but the **FOLK
  EXPLANATION** for sudden disappearances, recorded in **Yanagita Kunio's *Tono Monogatari*.** Victims
  sometimes return years later, utterly changed. **The single best folkloric frame for the
  isekai-flavored central mystery.**

### Geography & areas
- **THE ESTATE & grounds (hub):** walled compound, forecourt, kura, household shrine, garden, well —
  safe home base and quest hub.
- **THE PADDY & FIELD belt (sato):** wet-rice paddies, dry fields, irrigation channels, tenant cottages
  — first gathering zone (farming), home to kappa/paddy-spirit lore.
- **THE VILLAGE (mura):** clustered farmhouses around the headman's house, the smith, a small
  market/crossroads, the communal well — social/trade hub with NPCs, rumors, festival ground.
- **THE CHINJU-NO-MORI (sacred shrine grove):** wooded local Shinto shrine at a hill's foot, torii
  gate, fox/Inari statues, ema plaques — spiritual node for blessings, omens, kitsune encounters.
- **THE SATOYAMA WOODLAND (coppice forest):** managed secondary forest for firewood, charcoal,
  foraging mushrooms/sansai, bamboo groves — mid-tier gathering zone where tanuki and minor yokai dwell.
- **THE RIVER & PONDS:** irrigation source, fishing weirs, a watermill, a bridge and ferry crossing —
  fishing zone and kappa territory; follow it upstream toward the mountains.
- **THE FAMILY TEMPLE (bodaiji) & graveyard:** the Buddhist temple the estate is registered to, with
  its monk, bell, ancestral graves — ties to death/ghost (yurei) content and family-history clues.
- **THE HIGHWAY / KAIDO & post-stop:** a nearby road with a teahouse, a stone jizo statue, milestones,
  travelers (peddlers, monks, ronin) — conduit for outside news, trade, and wandering NPCs.
- **THE FOOTHILLS & TERRACED slopes:** terraced paddies climbing into rougher land, abandoned fields,
  hunting trails — transition into wilder, more dangerous territory.
- **THE DEEP MOUNTAINS (okuyama) & PASS (toge):** misty high forest, waterfalls, a derelict mountain
  shrine, charcoal-burners' huts, a treacherous pass — late-game frontier of tengu, yamauba, oni, and
  the threshold of the "otherworld" where kamikakushi happens; fitting place for the mystery's climax.
- **ABANDONED / liminal sites:** a ruined manor, a plague-emptied hamlet, an old battlefield, or a cave
  — optional dungeon-like areas hosting yurei, gashadokuro, jorogumo, and darker lore.

### Story hooks
- **KAMIKAKUSHI return:** the protagonist is locally believed to be a child "spirited away" by a
  tengu/kami years ago, now mysteriously returned, aged and amnesiac. The estate took them in out of
  duty/superstition; the mystery is whether they truly are that lost child and what the otherworld did
  to them. Grounds the isekai hook in genuine Edo folklore (Yanagita's *Tono Monogatari*).
- **The zashiki-warashi bargain:** the estate's fortunes have been quietly held up by a house spirit;
  the protagonist arrived the same night its presence shifted. Restoring/appeasing it (and learning why
  YOU appeared in its place) becomes the through-line — tying the mystery to household prosperity (an
  incremental-friendly fortune mechanic).
- **The shrine that was let fall:** the local ujigami/Inari shrine has been neglected and a boundary
  between worlds is thinning, which is why you slipped through. Re-consecrating shrines area by area
  both explains your arrival and structures map progression toward the mountain where the breach is
  widest.
- **The fox's debt:** a kitsune (Inari's messenger) pulled or sent you to settle an old wrong the
  estate's ancestors did to the land/foxes; the guide and the master each know fragments. Trickster-fox
  quests reveal the truth in pieces and let folklore drive the plot.
- **The double / the missing heir:** you wear the face of a family member who vanished (the kamikakushi
  victim, a dead heir, or the master's runaway child). Whether you are a returnee, an impostor, a
  reincarnation, or something a tengu wears is the central question; NPC trust and earned standing gate
  the reveals.
- **Across a famine/disaster threshold:** you "woke" having crossed from a time of famine, fire, or
  plague (real Edo calamities). The estate is on the eve of, or recovering from, such a disaster, and
  your foreknowledge / out-of-place memories are both a resource and the clue to how/why you crossed over.
- **The tengu's apprentice:** you were taken to the mountains, trained/altered by a tengu, and released
  with skills you don't remember learning (explaining how a farmhand can fight/level). Reclaiming those
  memories pulls you back up the mountain toward a final confrontation at the pass.

### Naming examples
> **Note:** in public, Edo commoners used a **given name plus their village or trade** (e.g. "Tasuke of
> Mizuho village"); only the warrior/landed family bore a surname.

**People**
- **Men (peasant/servant):** Tarokichi, Sahei, Kanbei, Rokusuke, Yasukichi, Tasuke, Heita, Gonzo,
  Matakichi, Kyubei. (Birth-order names — Taro/first, Jiro/second, Saburo/third — are very common.)
- **Women (peasant/servant):** often one or two syllables, sometimes with the polite **O-** prefix:
  Oharu, Okiku, Osen, Onatsu, Oyuki, Otami, Okane, Oshige, Otsuyu.
- **Estate/goshi family (surname allowed):** Akiyama Genzaemon (head), wife Onobu, heir Akiyama
  Shinnosuke, daughter Akiyama Sayo, retired patriarch Akiyama Soan (a Buddhist retirement name),
  steward Yagoro.
- **Religious/wandering:** shrine priest Kannushi Mitsuomi; temple monk Ryokai or Tetsugen; a komuso
  flute-monk; a ronin named Kuranosuke or Hanbei; a peddler called Tokubei.
- **Plausible estate surnames** (land/nature-derived, farmer-name tradition): Akiyama, Sugimoto,
  Kuroda, Nogami, Mizuno, Tachibana, Yamashiro, Sakai, Hara, Fuyuki.

**Places**
- **Villages (suffix -mura/-sato):** Mizuho-mura ("abundant rice"), Inaba-mura, Kasuga-mura,
  Yamanaka-mura, Kogarashi-mura, Higashiyama-mura, Tobishima-mura.
- **Natural/landscape:** Tsukikage Pond, Kappa-buchi (kappa pool), Senzu River, Hotaru-no-sawa
  (firefly marsh), Akinashi Plain, Kareha Woods, Susuki-no-hara (pampas grassland).
- **Uplands/passes:** Ookami-toge (Wolf Pass), Tengu-dake (Tengu Peak), Kumo-no-taira, Yamiyama
  ("dark mountain"), Shirakumo Falls, Oku-no-mori (the deep forest).
- **Sacred/built sites:** Inari-jinja (the fox shrine), Chinju-no-mori (the tutelary grove),
  Komorebi-an (a hermitage), Jizo-zaka (the jizo slope on the highway), Kanezawa-ji (the family
  temple), Furumiya ("the old shrine").
- **The estate itself** could be known simply as "the Akiyama yashiki" or by its locale, e.g. "the
  manor at Mizuho".

### Authenticity notes
- **Don't present shi-no-ko-sho as a hard caste ladder;** it was a Confucian ideal and a classification
  of commoners. The real divide was warrior vs commoner. Showing the goshi/village-headman gray zone is
  more accurate and richer.
- **Religion was syncretic (shinbutsu shugo):** the same household honored Shinto kami (kamidana, the
  ujigami/Inari shrine) AND Buddhist ancestors (the bodaiji temple, butsudan altar). Don't split them
  into rival "factions"; villagers used both as one continuous practice.
- **Yokai and the supernatural were genuinely woven into ordinary belief,** not just spooky
  set-dressing. Treat them as how rural people explained weather, illness, disappearances, and luck —
  making the folklore feel lived-in rather than gimmicky.
- **Avoid samurai-fantasy cliches at a farm estate:** a rural goshi is closer to landed gentry/yeoman
  than to a katana-duelist; most "samurai" by mid-Edo were impoverished bureaucrats, and a country
  estate runs on agriculture, not constant swordfights. **Let combat be the exception** (yokai,
  bandits, the mountains), not the daily texture.
- **Get the economy right:** tax and wealth are reckoned in rice (koku); coins coexist but rice is the
  deep unit. Both authentic and great incremental scaffolding.
- **Respect the labor:** peasant life was hard, communal, and dignified, not quaint. Foraging, mending
  (boro), recycling night-soil and ash, sustainable coppicing reflect real ingenuity — lean into that
  rather than romanticizing poverty or playing it for misery.
- **Be careful with sacred/sensitive elements:** shrines, kami, ancestor rites, and burial customs are
  living traditions for many people today. Represent rituals respectfully; avoid turning real deities
  (e.g. Inari) into trivial "loot pinatas."
- **Naming:** keep public commoner identification as given-name-plus-place/trade, reserve surnames for
  the warrior/landed family, and use a Buddhist "retirement name" (e.g. *-an* / *-soan*) for a formally
  retired elder (inkyo). This small detail signals real social literacy.
- **Geography:** anchor the world in the satoyama mosaic (village + paddies + managed woodland + sacred
  grove + mountains) — the historically correct rural template that conveniently maps to tiered game
  zones.
- **Source caveat:** many details here come from general/secondary web sources; before locking lore,
  sanity-check specifics (regional variation is large — sericulture, fishing, and crops differed a lot
  by region and decade across the 265-year period) and consider a sensitivity read from someone versed
  in Japanese history/folklore.
