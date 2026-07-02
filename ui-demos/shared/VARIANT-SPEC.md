# VARIANT-SPEC — what every remaster variant must build

The shared contract for the five `ui-demos/` variants. Each variant is a
complete, working, desktop-first remaster of the ACTUAL game's T0 (R0–R3) UI
on top of the shared mock engine. Read this whole file before writing a line.

Plan & taste brief: `docs/plans/2026-07-02-ui-remaster-variants.md` (§1–§3).

## 0 · The three laws

1. **Same game.** Someone who played kami-kakushi must recognize it in two
   seconds: same 6 tabs, same verbs, same numbers, same log-centric shape.
   You are remastering, not reinventing. (And not reskinning: your variant's
   §3 brief re-imagines composition + component language, not just colors.)
2. **English only.** ZERO Japanese glyphs (no kanji, no kana) anywhere —
   including decorative seals. Romanized terms are fine and canon: koku, mon,
   monme, ryō, kura, sansai, satoyama, kami. All content strings come from
   `shared/data.js` — never invent content, never re-add kanji.
3. **No placeholder art.** No empty SVG blobs, no gray boxes, no stick
   figures, no "imagine art here." Build finish out of CSS: gradients,
   borders, layered shadows, texture (CSS/SVG-filter noise is fine as
   *texture*), typography, motion. If a decoration can't look DONE, leave it
   out — restraint reads as polish.

## 1 · Files & wiring

```
ui-demos/0N-<name>/
  index.html    loads ../shared/{data,format,engine}.js as ES modules
  style.css     all styling (design tokens in :root)
  main.js       render + reconcile + engine wiring
```

- Serve from repo root (`npx serve ui-demos` or any static server) — pages
  are opened at `/0N-<name>/`. Use relative imports (`../shared/engine.js`).
- No build step, no external requests (fonts: system stacks or none;
  `@font-face` only if self-hosted — prefer system stacks).
- Desktop-first ~1280–1920px. No page scrollbar: fixed chrome, panes scroll
  internally (mirrors the real game's shell).

```js
import { createEngine, sel } from '../shared/engine.js';
import * as D from '../shared/data.js';
import { formatKMB, formatCoin } from '../shared/format.js';

const eng = createEngine('R1'); // default landing stage: R1
eng.subscribe((state, events) => render(state, events));
// verbs: eng.dispatch({type:'rake_rice'}) etc. — see engine.js header
// stage jumps: eng.setStage('R2')
```

Re-render however you like (full innerHTML re-render is acceptable at this
scale, but preserve scroll positions of the log + input focus; reconcile
smarter where juice needs it).

## 2 · The screen inventory (what must exist, per stage)

Everything below reads from `state` + `sel.*` + `D.*`. Numbers/formatting:
rice/wood/sansai via `formatKMB`, coin via `formatCoin`.

### Header vitals (persistent chrome, revealed incrementally)
- House mark: `D.HOUSE_MARK` — always (once past cold open).
- Rice readout — always. Coin — once `resources.coin + banked.coin > 0`.
- Clock — `sel.isUnlocked(s,'readout-clock')`: season (label+emoji via
  `sel.seasonOf`), `Year N · day M` (`sel.yearOf`, `sel.dayOfSeason`).
- Life (HP) bar — once `sel.isUnlocked(s,'verb-face-wolf')` (R2+): value/max
  (`sel.hpMax`), low-state styling ≤30%.
- Body (satiety) bar — `readout-stamina` (R1+): value/`sel.satietyMax`.
- Wood pill — `row-wood` (R2+). Sansai pill — `row-sansai` (R2+).
- **Rung head** (top-right): rung title + meter toward next threshold; when
  `sel.summonsReady(state)` it becomes the **"Answer the summons ›"** action
  → `dispatch({type:'begin_rung_beat'})`. This affordance must feel special.

### The log (hero surface — every variant keeps it first-class)
- Header `D.LOG_HEADER` ("The house remembers").
- Lines via `sel.logView(state, filter)`: bullet per channel
  (`D.CHANNEL_BULLET`), speaker prefix + per-voice color when `l.voice`,
  repeat-count badge when `l.count > 1` (the real game coalesces).
- Filter bar: `D.LOG_FILTERS` with labels `D.LOG_FILTER_LABELS` — default
  `story`. The `now` filter shows ephemeral lines (they expire ~15s).
- New narration should FEEL alive (typewriter or fade-in — your variant's
  motion language; honor `prefers-reduced-motion`).

### Nav (tabs)
- `sel.visibleTabs(state)`; hide the whole nav until ≥2 tabs qualify
  (`sel.navVisible`) — at R0 there is NO nav, the Work surface is alone.
- Tab reveal is part of the drama: a newly available tab should announce
  itself (glint, ink-in — your language).

### Work tab
- R0 meta verbs: Rake (`rake_rice`) + Rest (`rest`); rake gains an
  auto-toggle once `rungMeter ≥ D.BALANCE.RAKE_AUTO_REVEAL_METER` or
  `flags.raked` → `set_auto_rake`.
- Wolf beat (R2, until `flags['first-fight-survived']`): at the kura a
  primary **"Face the wolf at the grain store"** (`face_wolf`) — the most
  dramatic button on the screen; away from the kura, `D.COPY.wolfAway`.
- Labour rows: `sel.laboursHere(state)` — verb button + yield/cost readout +
  auto-toggle (`set_auto`); when none: `D.COPY.noWorkHere`.
- Cook (`verb-cook`, R2+): `cook_meal` (2 sansai → +14 life) — emphasize when
  hurt. Eat rice (`panel-estate`, R1+): `eat_rice` (3 rice → +30 body).
- Rung ladder card (from first rake): rung title, meter bar, `Estate service
  · into/needed`, `advanceHint` when meter full but story-gated, `Next: R+1`.

### Map tab (gate: `room-gate-forecourt`, R1+)
- You-are-here card: node label + blurb (`sel.nodeOf`).
- Move strip: `sel.reachable(state)` → terse destination buttons
  (`move_to`); blocked danger-ring nodes visibly disabled with
  `D.COPY.needsConditioning`.
- Who's here: `sel.peopleHere(state)` → name + tell + Speak/Leave toggle
  (`talk`/`leave`).
- The pedlar's trade panel while `openPersonId === 'pedlar'`:
  `D.MARKET_ITEMS` rows (label, grant, blurb, price via `formatCoin`,
  disabled when unaffordable or `marketBought[id] ≥ stockCap`) → `buy_item`;
  plus sell-rice: price line (`sel.ricePrice` + `D.RICE_SELL_GLOSS[season]`)
  and "Sell all rice (N → coin)" → `sell_rice`.

### Estate tab (gate: `panel-estate`, R1+)
- Improve card: `D.ESTATE_STAGE_NAMES[state.estateStage]` + next stage
  (label, blurb, payoff `+X% labour output · +Y max body`, cost) →
  `improve_estate`; at U4: a "risen" terminal state.
- "The house reopens": `D.HOUSE_ROOMS` — ALL still-locked silhouette rows
  ≤R3 (locked styling, no invented content).
- House standing (gate `panel-house-influence`, R3): the LOCKED teaser —
  header/blurb/4 silhouette rows/`lockedFoot` from `D.HOUSE_INFLUENCE`.

### Inventory tab (gate: `panel-estate`, R1+)
- The storehouse: `D.STOREHOUSE` copy + carried/stored balance line +
  deposit/withdraw-all buttons for coin & rice (`deposit`/`withdraw`) —
  ONLY while `location === 'kura'`; else `D.STOREHOUSE.offNodeBlurb`.

### Character tab (gate: `tab-skills`, R2+)
- Skills: visible-by-doing — show a skill once `skills[id].xp > 0 or level >
  1` (conditioning always at R2+): label, `Lv N`, blurb, `+4%/lvl` yield
  hint, xp meter.
- Training (gate `readout-combat-level`, R3): `attributePoints` to spend +
  the 5 `D.ATTRS` rows (label, name, gloss, value, `+1` → `spend_attribute`).
- Bestiary (gate `panel-bestiary`, R3): count line; per-foe card — faced:
  name, win-band pip + `sel.winRate`%, blurb, `Tell —`, `Haunts —`; unfaced:
  fogged "Unknown foe / ◇ Not yet faced".
- Undertakings (gate `tab-combat`, R3): `D.QUESTS` cards — kind badge,
  title, blurb, step checklist (done via `quests.progress`), reward, "Take
  this on" (`accept_quest`) / accepted / completed states.

### Combat tab (gate: `tab-combat`, R3+)
- XP card: `Combat level N` + meter (`combatXp / sel.combatXpNeeded`).
- Weapon card: the carrying-pole (label, archetype, blurb). No durability ≤R3.
- The watch: `sel.foesHere(state)` rows — name (fogged if not in
  `bestiaryFaced`), win pip + %, blurb, **Fight** (`fight`) + the two auto
  toggles (`set_auto_combat`); empty state `D.COPY.watchEmpty`.

### Full-screen moments
- **Cold open** (`phase === 'cold-open'`): title card — `D.COLD_OPEN`
  title/subtitle/lede + the single "Open your eyes" verb (`open_eyes`).
  Slow, confident reveal. This is the variant's first impression — nail it.
- **VN scenes** (`phase === 'vn'`, `state.vn`): full-screen scene over the
  shell — nameplate (speaker + per-voice color; use `sealText`/`plateLabel`,
  NEVER kanji), greeting lines revealed via `vn_next` (shown count =
  `vn.shown`), then ask-hub (`topics`, dim asked ones, `vn_ask`, gated topic
  via `gateTopic`) → "Done questioning" (`vn_done_asking`) → decision
  (`vn_choose`) → resolved: say/react lines + perk box (name/desc/±stat — a
  JRPG "learned" moment) → Continue (`vn_continue`). Intro = 3 scenes
  (`D.INTRO_SCENES`); rung beats = `D.RUNG_BEATS[target]`.
- **Rank-up ceremony** (`state.ceremony`): a held overlay (~2s) — "Promoted"
  + the rung title, in your variant's most celebratory language (no kanji
  seal; invent an English/crest equivalent) → `dismiss_ceremony`.

### Stage selector (the review affordance — small, discreet, styled)
- Bottom-right strip: the five `D.STAGES` + a "Summon" trigger that force-
  fills the meter for the demo: `eng.state.rungMeter = sel.rung(eng.state)
  .threshold` is NOT exposed — instead call `eng.setStage(id)` for jumps and
  provide "moments": Play intro (from cold-open), Face wolf (R2 @ kura),
  Fight (R3), Rung-up (sets meter via provided helper below).
- Helper for the rung-up moment: dispatch nothing — just
  `eng.state.rungMeter = 99999; eng.dispatch({type:'begin_rung_beat'})` is
  acceptable in the demo strip ONLY (documented hack, keep it in one place).
  NOTE: `sel.summonsReady` also checks the CURRENT rung's `storyGateFlag`
  (`farmed` at R1, `first-fight-survived` at R2) — the demo strip must set
  that flag too (`eng.state.flags.farmed = true` etc.), or the summons stays
  earned-only, which is correct in play but wrong for a demo jump.
- Keep it unobtrusive (~28px collapsed); it must not fight the variant's art.

## 3 · Fidelity & polish bar (the QA gate you'll be reviewed against)

- The two-second resemblance test (§0.1) at every stage R0→R3.
- Stage R0 must feel SPARSE (one column, no nav) — emptiness is intentional;
  R3 must feel INHABITED (six tabs, combat live) without clutter.
- Interactive juice: hover/press states on every clickable; meter fills
  animate; number pops on gain; log lines arrive alive. Reduced-motion safe.
- Type hierarchy: at least 3 clear levels (display / heading / body / micro
  is better); tabular-nums on all live numbers.
- Consistent design tokens in `:root` — a reviewer should be able to read
  your palette + spacing scale from the CSS top.
- Nothing broken: every button does its thing or is visibly disabled with a
  reason. No console errors. No dead tabs.
- The variant's §3 brief (plan doc) drives composition + components — follow
  it, and where you improvise, improvise INSIDE that direction.
