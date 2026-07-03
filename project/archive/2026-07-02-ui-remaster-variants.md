# UI-remaster variants — five full T0 remasters in `ui-demos/`

**Status: ✅ BUILT — awaiting the R9 taste call (session 47).** All five
variants live at <https://kami-kakushi-ui-demos.vercel.app>; verdict per
variant in `project/human-in-the-loop/review.md` (R9). Scope was locked
interactively (directions, depth, language, target all human-picked); the
plan archives once the pick lands and the port path is decided.

## 1 · Goal & calibration

The seven `prototype/` frames answered *"what could the screen be?"* — novel,
but they lost all resemblance to the actual game. The human's steer (canon,
D-022): the target is a **remaster/remake** — the midpoint between "change the
CSS" and "reinvent the UI."

- It must **read as the same game**: the text-based incremental idle RPG we
  have today — same tabs, same panels, same verbs, same numbers, log-centric.
- It must be **a generation better**: layout composition, component language,
  type system, hierarchy, juice — think FF7 → FF7 Remake menus.
- Golden-age JRPG feel (FF7–FF10 era) meets polished indie/AA.
- **English UI only** — zero kanji/kana anywhere; romanized canon terms stay
  (koku, mon/monme/ryō, kura, sansai, kami). Like FF's "gil."
- **No placeholder art.** No empty SVG blobs. CSS-that-looks-finished:
  gradients, borders, texture, typography — or nothing.
- Desktop-first (~1280–1920px). No mobile effort.
- **The resemblance test** every variant must pass: someone who played the
  game recognizes it in two seconds — and asks "when did it get this good?"

## 2 · The midpoint contract — invariant vs. re-imagined

**Invariant across all five (the game's shape):**

- The 6-tab IA (D-112): Work · Map · Estate · Inventory · Character · Combat,
  with the R0→R3 incremental reveal (R0 = Work+log only, no nav; R1 = +Map
  +Estate +Inventory + nav appears; R2 = +Character; R3 = +Combat).
- Header vitals: house mark, rice, coin (mon→monme→ryō), clock/season, HP,
  stamina, wood, sansai, rung head with "Answer the summons."
- The event log as a first-class hero surface, with its channel filters
  (Story · Progress · Combat · Work · All · Now) and voiced/typewriter lines.
- All T0 R0–R3 content verbatim (from the recon inventory): rake/rest + auto,
  the five labours, cook/eat, the wolf beat, rung ladder, map nodes + move
  strip + who's-here, the pedlar's market + sell-rice, estate improve card +
  locked house rooms + locked House-Influence teaser, the kura bank,
  skills/training/bestiary/undertakings, combat XP/weapon/watch,
  cold open → intro VN → rank-up seal → rung-up story beats.
- Real balance numbers (rice 3/rake, haul 2 coin, thresholds 1100/2150/2600/
  2800, HP 58, etc.) so it *feels* like the live game.

**Re-imagined per variant:** composition (where the log lives, how tabs
present, what anchors the screen), component language (how an action row /
progress bar / tab / readout / seal is *built*), palette, type system,
texture, motion. Palette difference alone = failure.

## 3 · The five variants

Each direction is a *spin that fits this game*, never a costume of its source.

### 01 · Moonlit Menu — PSX classic (FF7/FF8 DNA)

- **Composition:** far-left vertical menu rail (the tabs, as a classic JRPG
  main-menu column with a crest cursor); center = active tab content as
  floating menu boxes; log as the big dialogue-box band (right/bottom-right).
- **Components:** classic bevel-bordered gradient boxes (charcoal-indigo
  night gradient, not FF royal blue); menu rows with cursor + tabular gold
  numbers; costs/yields read like SP costs; damage/reward flashes.
- **Type:** bold condensed sans with the crisp PSX drop shadow.

### 02 · Candlelit Ledger — warm storybook (FF9 DNA)

- **Composition:** an open journal spread on a dark wood desk — left page =
  active tab content, right page = the log as a handwritten record; tabs as
  bookmarks along the top edge.
- **Components:** parchment panels; ornament is **kumiko joinery** cornerwork
  (never European filigree); wax/ink stamps as buttons; quill-annotated
  action entries; candlelit ambers.
- **Type:** warm serif headers, journal-hand accents.

### 03 · Vermillion — modern indie polish (Hades/StS DNA)

- **Composition:** left icon rail or bottom tab bar (chunky); oversized
  header strip; log as a bold feed column; diagonal panel cuts.
- **Components:** large action cards with thick progress fills and juicy
  hover/press states; big confident numerals; torii-vermillion + sumi black +
  gold leaf palette. The loudest, most "gamer" of the five.
- **Type:** heavy display face + clean UI sans.

### 04 · Lacquer & Gold — the direct remaster (own idea)

- **Composition:** closest to today's screen (header / work left / log right)
  — this is the conservative anchor — but inverted: dark urushi-lacquer
  ground, floating panels with fine gold keylines (maki-e), paper-textured
  content wells inside dark frames.
- **Components:** vermillion seal-stamps as primary CTAs; gold-inlaid
  segmented tab bar; Octopath-adjacent premium restraint.
- **Type:** elegant serif + tabular numerals.

### 05 · Aizome — indigo textile (own idea)

- **Composition:** log takes center stage as the hero column; actions as a
  right rail; tabs as cloth tags/swatches.
- **Components:** deep aizome-indigo dyed-cloth panels with subtle woven/
  shibori texture; **sashiko running-stitch** as the component language —
  stitched panel seams, stitch-dash progress bars; undyed-cotton text;
  brass/copper coin numerals.
- **Type:** humanist sans, soft but precise.

### 06 · Washi & Ink — the faithful baseline (human-requested, 2026-07-03)

The comparison anchor: the CURRENT v0.3.5 design language kept faithfully —
same washi/ink/indigo/vermilion tokens, same woodblock material, same
composition (header vitals / work left / log right ≥⅓) — with everything
**UX-polished** to the same bar as the other five. "My current game, its
best self." Unlike 04 (which inverts to dark), 06 stays on paper.

- **Composition:** today's, unchanged. The improvement budget goes to
  spacing rhythm, alignment, hierarchy, component finish, and juice.
- **Components:** the current `.frame`/`.paper` grammar (triple-rule
  keylines, paper grain, brush rules, bokashi washes, hanko seals) rebuilt
  clean and consistent; meters, rows, pills tightened; states (hover/press/
  disabled-with-reason) made uniform; the log's typography given real care.
- **Palette/type:** the game's own tokens from `src/ui/styles.css`
  (`--washi #f3e9d2`, `--ink #26221e`, `--ai #27496d`, `--shu #d7402c`, the
  earth secondaries) and its self-hosted Shippori Mincho subsets (copied
  into the variant — no external requests). English-only like its siblings:
  the kanji accents are replaced by typographic/crest equivalents, which is
  itself part of the comparison question.

## 4 · Staging ground & tech

Another agent owns `src/` right now — this work never touches it.

```
ui-demos/
  README.md          what this is + how to serve/review
  index.html         gallery hub (links the five, states the brief)
  shared/
    data.js          ALL canon T0 content, English-only (verbs, areas, map,
                     people, market, foes, quests, rungs, balance, VN beats)
    engine.js        the mock engine (below)
  01-moonlit/        index.html + style.css + main.js
  02-candlelit/      "
  03-vermillion/     "
  04-lacquer/        "
  05-aizome/         "
```

Plain HTML/CSS/ES-modules, no build step, served by any static server
(`npx serve ui-demos` / Vercel, like `prototype/` was). Not wired into the
`src/` DEV panel — **a human-steered deviation from D-075 mechanics** (the
variants are a staging-ground exploration, reviewed via URL, not in-game);
the D-075 *spirit* holds: full working variants, per-variant R-items, human
picks, no flag-debt (nothing ships to prod from here).

## 5 · Mock engine contract (shared, one per page)

- `createEngine(stageId)` → `{ state, dispatch(intent), subscribe(fn) }` +
  a 480ms tick loop (mirrors `AUTO_REPEAT_MS`; auto-rake / auto-labour /
  auto-fight, satiety drain/rest, clock/season advance).
- **Staged states** (the review affordance, per the human's depth pick):
  `cold-open`, `R0` (rake loop), `R1`, `R2`, `R3` — faithful snapshots of
  `GameState` fields the UI reads (resources, banked, flags, unlocked, rung,
  rungMeter, location, character, log seed…). A small, styled stage-selector
  strip per variant (bottom corner) jumps between them and triggers moments:
  intro beat, wolf fight, rung-up ceremony. **No other dev tools.**
- **Live verbs** (fake but honest): rake/rest/labours tick real numbers, log
  lines append through the channel filters, meters fill, fight plays a short
  scripted resolution, "Answer the summons" runs the rank-up seal + a
  condensed VN beat. Intents beyond R3 scope are not implemented.
- Numbers/formatting reproduce `formatKMB` + `formatCoin` (mon/monme/ryō)
  exactly.

## 6 · Build order

1. **Plan + queue + journal committed** (this doc).
2. **`shared/data.js` + `shared/engine.js` + gallery hub** — built by the
   main session first, so every variant renders the same truth.
3. **Fan out five variant builders** (individual background Agent-tool
   agents, one per variant — resumable, per the working norm), each fed:
   the recon inventory, this plan's §2 contract + its own §3 brief, and the
   shared modules. Each returns a complete `0N-*/` directory.
4. **QA pass by the main session**: serve, screenshot every variant at every
   stage (R0→R3 + moments), self-review against §1's bar (resemblance test,
   no-placeholder rule, polish), fix or bounce back to the builder.
5. **Ship for review**: commit, R-item per variant in
   `project/human-in-the-loop/review.md`, reading-queue entry, offer a
   Vercel deploy of `ui-demos/`.

## 7 · Out of scope

- Anything in `src/` (the other agent's turf) — and any prod wiring.
- R4+ surfaces: smith, equipment/durability UI, craft, stance, seasonal
  judge, live koku standing, ascension. (Locked teasers visible ≤R3 — the
  House-Influence silhouette panel, empty house rooms — ARE in scope.)
- Mobile layouts, SFX, save/persistence, offline progress, real balance sim.
- Japanese glyphs of any kind, including decorative seals — replaced by
  English/crest equivalents per variant.
