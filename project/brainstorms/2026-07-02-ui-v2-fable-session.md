# UI V2 — Fable session working doc (living; updated as the session runs)

**Status:** ✅ DONE (2026-07-02, ~22:45). Seven living prototypes shipped in
`prototype/` + gallery + briefs; QA'd to zero console errors, all demo beats
playable & persistent, no mobile h-scroll. Final verdicts + recommendation
below ("Final self-review"). Awaiting the human's taste pass — open
`prototype/index.html`.

**Human steer (2026-07-02, canon):** rethink what the UI should be — zoom out,
think big, see the forest through the trees. 5+ standalone prototypes in
**`prototype/`** (root, new dir — `src/` is locked by the other agent), HTML5 +
mock data, no game engine. Ignore `ui-design.md` defaults. Quality bar: a
really good **indie/AA studio** shipped this, for the HTML5 incremental-RPG
category. **Provenance rule:** an earlier Opus-authored exploration brief was
deleted as tainted — all concepts derived from it were discarded; the set
below was re-derived independently by Fable, and two of its framings (the
hand-scroll, the village/estate map) were additionally cut for overlapping
that brief's list.

## Diagnosis (why the current UI reads as slop)

The current UI is a *document about the world*: header bar + resource numbers,
tabs, a bordered prose-log column, buttons beside it. Competent typography,
zero framing thesis — and literally the #1 AI-default look (warm cream +
high-contrast serif + terracotta). The fix is not better CSS on that shape; it
is choosing **what the screen IS**, then executing that ontology with
studio-grade craft.

**Zoom-out map of the design space** (the forest, not one grove): great
incremental/indie UIs live in distinct regions — (a) **artifact-as-interface**
(Pentiment: a period object IS the screen); (b) **living-world / ant-farm**
(Fallout Shelter, Tiny Tower: watching the world fill with life is the
payoff); (c) **tactile numbers** (Balatro, Universal Paperclips: the numbers
themselves are the toy); (d) **character cinema** (Banner Saga: cast and
staging carry feel); (e) **physical accumulation** (show the hoard). A good
divergence samples the regions, not six flavours of one region. Additional
levers native to the genre: UI-as-progression is the game's own signature
(minute one = one verb against the dark; every reveal a story beat), locked
affordances shown as visible mysteries, tabs as territory, UI phase-changes
over content additions, tooltips that carry mechanisms.

## The six framings (Fable's, independent; being sharpened by the panel)

1. **SHUSSE SUGOROKU 出世双六 — the promotion board.** A real Edo print genre:
   a board game of climbing ranks. The screen IS that board; rungs R0–R7 are
   illustrated squares; your marker hops at each rung-up; detour squares hold
   combat/quests/market; tiers unfold a LARGER board around the old one; Edo
   is a distant square, always visible. Goal-gradient as literal distance.
2. **NISHIKI-E IN PROGRESS 摺 — the print being made.** The screen is one
   ukiyo-e print of the estate still being printed: minute one is key-block
   line art; every unlock prints a new colour plate; rung-up pulls a richer
   impression; margins accumulate real print furniture (cartouche, censor
   seal, registration marks). The UI's own fidelity IS the progress bar.
3. **YASHIKI CUTAWAY 屋敷断面 — the living house section.** Hand-inked
   architectural cross-section / dollhouse of the estate; you visibly walk
   between rooms; U1–U4 repairs are visible carpentry; ruined rooms relight
   as they unlock. The house physically healing IS the progress bar.
4. **DAIFUKUCHŌ 大福帳 — the steward's desk.** Top-down desk; objects are the
   UI: the account book (living log), a soroban whose beads animate the
   numbers, hanko stamps as action buttons, quest slips, the kura key, the
   pedlar's bill. Seasonal judge = the audit ruled off in red. Balatro-feel
   on beads/stamps/slips.
5. **THE HOUSEHOLD STAGE — character cinema.** The cast and ceremony copy are
   the game's strongest assets; put people on screen. Wide sumi-e scene,
   Banner-Saga side staging; your figure works in-scene; at rung-up the
   granter walks INTO frame and speaks the real ceremony line. Systems live
   in one disciplined, earned dock. Watchable like a fish tank.
6. **THE FILLING KURA 蔵 — the hoard made visible.** The storehouse interior;
   resources are physical heaps (rice mounds, hundred-mon coin strings on
   pegs, cordwood, hanging sansai); deeds physically add; storage furniture
   arriving = UI-as-progression; the rung meter is a rice-bale stack; the
   judge chalks koku on the beam; the wolf comes among the sacks.

Plus two **unseeded wildcards** (no candidate lists given): one must centre
combat + the bestiary; one fully free (artifact or bold non-artifact
interaction model).

## Curation (post-panel verdicts — Fable's taste call)

**Building 7:** the six above **plus the combat wildcard — KAGE-E 影絵, the
guard-post shoji wall**: the world only ever appears as shadows on paper
(thesis: a game about mis-seeing never shows the world); the bestiary is a
shadow-album whose silhouettes sharpen from smudge → crisp profile over
repeat encounters; stance = your silhouette's pose; the seasonal judge is
the one moment a panel slides open and you see through the paper. Strongest
thesis of the eight.

Standout moves the panel added: sugoroku's **outward spiral** (period boards
spiral in to the goal; ours spirals out — no goal square, the world widens)
+ 正 tally strokes as the rung meter; printshop's **karazuri** (locked UI =
inkless blind-emboss — visible mystery with zero grey boxes) + the
progressive **proof strip** as rung meter; cutaway's "**rooms are the
menus**" camera-lean; the desk's stamp→slip→bead→ink causality chain + day
slips speared on the harigata spike at dusk; the stage's granter
**lingering in-scene** as the meter fills (goal gradient = a person waiting
for you); the kura's **Hundred-Mon Knot** (coins string and swing; the
100th is knotted and hung — a mini-ceremony you play toward).

**Not built:** the free wildcard independently re-derived the **handscroll**
(third independent derivation — evidence it's a natural fit, not
Opus-slop); skipped because its virtues already live in the stage concept
and it overlapped the discarded brief's list. Brief kept at
`prototype/briefs/99-wildcard-emaki-not-built.md` — cheap to build later if
the human wants an eighth.

One curator's reframe: the stage brief drifted toward scroll furniture; its
builder was instructed to build it as a **theatre you pan**, not a scroll
document (Entrance & Address + engawa dock + empty mortises are the core).

## Scout distillations (inputs — facts from code/docs, not design ideas)

### Vision + fun essentials (from PRD §1 / fun-factor.md)

- 1780 (An'ei 9), rural Edo Japan. Nameless ~18yo farmhand, half-drowned,
  taken in by the threadbare gōshi **Kurosawa house 黒沢家**. Fantasy: the
  dignity of a nobody — and a dying house — becoming real by hand. No reset
  ever; tiers T0 estate → T1 estate-full → T2 village Asagiri → T3 region.
- **Kami-kakushi is belief, not magic** — nothing supernatural ever happens;
  the village thinks you are their lost "Tama"; memory returns via dreams.
- Rungs R0–R7: 日雇 → 下人 → 手代 → 門番 → 蔵番 → 家人 → 用人 → 内衆. Then
  four pillars (武威 Arms · 家産 Estate · 官威 Standing · 家格 Name) → House
  Influence 家威 → seasonal judge restates **koku** (a standing score, never
  spent; never labour-earned).
- Fun pillars for the UI: deed loop (<5s feedback; value + rate + eased
  count-up + living log) · rung meter (goal gradient) · **UI-as-progression
  is THE signature** (reveals narrated as story beats) · seasonal judge
  (anticipated audit) · combat tension (first fight ~29% win) ·
  significance-gating (routine quiet; milestones get the seal).

### Taste contract (banned-list retained; material systems freed per concept)

Banned: purple/blue gradients, glassmorphism, glow/neon, rounded card grids,
pill radii, uniform drop-shadows, raw #FFF/#000, ad-hoc type sizes, static
number walls, number jitter, dead grey locks, per-tick particles/shake,
emoji-as-icon-system, colour as sole signal. Required: material system derived
FROM each concept's frame; warm period-true colour; depth from material + ink
weight; fixed type scale; eased count-ups; one rare accent reserved for
milestones. Each concept owns its 4–6-hex palette.

### Inspiration lessons (proto23, YAIRPG, genre classics — from code/READMEs)

- proto23: boot into darkness and deal the UI out via the cold open;
  `???????` mystery tabs (locked affordances as visible mysteries); tooltips
  carry *mechanisms* (rates, multipliers), not restatements.
- YAIRPG: one data-declared unlock pipeline (every unlock gets its log line +
  UI ripple); location prose as a function of state; log category filters.
- Classics: Paperclips — UI phase changes > content additions; total
  diegesis. Kittens/Trimps — tabs as territory; name-tease the next tab.
  Melvor — if the frame is a ledger, commit to ledger virtues. Meta-pattern:
  **the interface is the content; panels/tabs are the loot table** — spend
  the novelty budget on revealing interface at a controlled rhythm.

### Mock-data pack (abridged — full pack embedded in the ideation script under
### `~/.claude/projects/.../workflows/scripts/ui-v2-ideation-v3-*.js`)

- Resources: rice, coin (mon), wood, sansai, hardwood 堅木, beast sinew 腱;
  carried vs banked-in-kura pools. Estate ladder U1 patch the kura (100 coin)
  → U2 drill yard (300) → U3 first shinden (700) → U4 long-house (1400).
- Activity log lines: "You rake the spilled rice back toward the basket.
  (+3 rice)" · "Work the home paddies. (+4 rice)" · "Haul stores at the
  forecourt. (+2 coin)" · woodcut +3 wood · forage +2 sansai +1 coin.
- Map: 7 nodes — kura 蔵 · gate 門前 · paddies 田圃 · woodlot 杣 · near
  satoyama 里山 · deep satoyama 奥山 · drill yard 稽古場; walk between
  adjacent nodes; satoyama = danger rings.
- Combat: STR/AGI/INT/SPD/LUCK (start 5); HP 58 at L1; stances gedan/chudan/
  jodan; monkey 猿 L1 (win 29%), wolf 狼 L2, mamushi 蝮 L2, boar 猪 L3,
  bandit 野伏 L5; win line "You bring down the crop-raiding monkey. ✓
  (HP 58→41 · +3 coin, +1 beast sinew)"; loss = limp home at 1 HP, drop some
  carried goods. Weapons: carrying-pole 天秤棒 → woodlot axe 斧 → yari 槍;
  durability Pristine/Worn/Battered/Broken.
- Quests: Drive off the crop-raiders (+30 coin) · Hunt the satoyama predators
  (+24) · Clear the satoyama trails (+40) · Defend the grain-store (+28).
- Calendar: 24 ticks/day, 28-day seasons, lunar phase; autumn ×1.3 harvest.
- NPCs: Genemon (steward), Kihei (master-at-arms), Sōan (physician), Lady
  Chiyo, lord Shigemasa; village Asagiri, girl Sayo, borrowed name "Tama".
- Ceremony copy (R3): "Kihei sets you to the estate's defence — pests,
  beasts, and the masterless men on the woodlot road. A weapon, a yard to
  train in, and a duty that is yours. You are the gate-watch now."

## QA round 1 (vision review of 7 built prototypes — 2026-07-02 ~20:45)

All 7 built, zero console errors, all dev hooks present. Verdicts:

- **07-kagee — front-runner.** The fight shot (monkey shadow crouched on the
  shoji, chalk forecast slip, stance tags) is the AA moment of the round.
  Light fixes only (persist rung/judge state).
- **03-cutaway** — best cold open (night, one candle pool, one verb); day
  view wastes ~45% on empty sky; ink anemic. Density/contrast pass.
- **02-printshop** — coherent and charming; rung didn't advance the print;
  paddies float; stick-figure. Medium pass.
- **04-daifukucho** — desk + soroban + fight report slip excellent; mobile
  h-scroll; dark slabs read modern; verso page empty. Medium-light pass.
- **06-kura** — objects lovely (coin string!), room architecture empty; the
  fight modal blocked the next trigger. Medium pass.
- **05-stage — weakest vs own brief:** empty panorama, ant-sized figures,
  Entrance & Address never visibly fires, dock collides with dev strip.
  Major restage.
- **01-sugoroku — critical:** the board itself never renders (empty washi +
  a koma). Rebuild board rendering.
- Cross-cutting: demo beats must force-resolve each other; rung/judge must
  persist state (rank chip, koku figure, season tint).

Fix round 1 dispatched (`wf_cee29294-a5c`, 7 agents with per-file re-shoot
verify loops via `tmp/ui-v2-shots.mjs <prefix>`). Build workflow was stopped
after harvesting 6/7 builder reports (`tmp/ui-v2-briefs/build-reports.jsonl`;
one builder hung on its final report — all 7 FILES were written fine).

**Fix round 1 ratchet log (usage limits keep biting; each resume ratchets):**
- attempt 1 (~21:10): ✅ 02-printshop, 04-daifukucho, 07-kagee · ❌ 4 others.
- attempt 2 (~22:05, after re-login): ✅ 06-kura (+ the 3 cached) ·
  ❌ 01-sugoroku, 03-cutaway, 05-stage — limit again, reported reset 2:30am.
- attempt 3 (~22:06): resumed, then STOPPED per human cost-steer ("this
  child workflow guzzles usage"). Workflow approach retired for the tail —
  a failed workflow agent restarts from zero each resume, while plain
  Agent-tool agents keep context and are individually continuable.
- attempt 4 (~22:12, current): 3 individual agents dispatched for the
  survivors — 01-sugoroku (sonnet, board-render fix), 03-cutaway (sonnet,
  density/ink pass), 05-stage (opus, major restage). Screenshot driver
  `tmp/ui-v2-shots.mjs` cut to deviceScaleFactor 1 (4× cheaper vision
  reads); agents capped at 2 verify rounds, ≤3 shot Reads each.
- **Wind-down agreed with the human:** once all 7 are fixed → full QA
  re-shoot → wrap-up (docs, journal, queue, commit, careful push).

**RECOVERY COMMAND (works after any limit/session death; each resume
ratchets forward — completed agents come from cache):**
`Workflow({scriptPath:
"~/.claude/projects/-Users-raynos-projects-games-kami-kakushi/8e7007a7-7bc2-4042-97b2-836df911938f/workflows/scripts/ui-v2-fix-round-1-wf_cee29294-a5c.js",
resumeFromRunId: "wf_cee29294-a5c"})`
After all 7 report done: full QA re-shoot (`node tmp/ui-v2-shots.mjs`),
vision re-review, then wrap-up per "How to resume" below.

## Build spec (locked before build phase)

- Each prototype = ONE self-contained `prototype/NN-slug.html`. Zero network
  (works via file:// and as an Artifact): system fonts only (mac JP faces:
  Hiragino Mincho ProN, Toppan Bunkyu (Midashi) Mincho, Yu Mincho, Klee,
  Hiragino Kaku/Maru Gothic; Latin: Iowan, Baskerville, Hoefler, Palatino,
  Optima, Seravek, Charter), inline SVG/CSS/canvas only.
- **Living mock**, not a wireframe: ticking numbers, streaming log with real
  copy, a scripted fight, the rung-up ceremony, the seasonal judge, a panel
  REVEAL moment. A small uniform dev-strip (bottom corner) with triggers:
  auto-tick on/off · Fight · Rung-up · Season judge · Reveal next · Reset ·
  stage selector (minute-one / hour-three / hour-ten).
- Real copy only (from the pack). Tabular nums. Reduced-motion respected.
  1440×900 primary; 390×844 must not break. No console errors.
- Gallery: `prototype/index.html` + `prototype/README.md`.

## QA plan (after build)

Screenshot each prototype (playwright, file://, desktop + mobile), review
with vision against the taste contract + each brief's signature move,
dispatch fix agents, iterate. Then self-review per concept + a
recommendation paragraph, reading-queue entry, journal entry, commit
`prototype/` + docs by explicit path (`SKIP_VERIFY=1` — isolated non-src
change; never push a red tree).

## Final self-review & recommendation (Fable, post-QA — R4 self-pick)

Per-prototype verdicts after the fix rounds (all 7: zero console errors,
beats force-resolve each other, rung/judge state persists, minute-one cold
opens work, 390px usable):

1. **01-sugoroku** — the board finally reads: sealed rung squares, 正 tally
   meter, place squares with verbs, ghost squares + distant 江戸. Honest
   verdict: the *cleanest information design* of the seven, but the least
   atmospheric — reads closer to a beautiful diagram than a place. Best
   organ: goal-gradient as countable distance.
2. **02-printshop** — coherent and charming; the karazuri blind-emboss and
   proof-strip rung meter are the round's best "locked = visible mystery"
   and "meter = material" answers. The scene art is the weakest link (needs
   a real illustrator pass to sing).
3. **03-cutaway** — the best minute-one in the set (night, one candle, one
   verb) and the fantasy-aligned frame: *the house healing IS the save
   file*. Day view now dense; still the palest of the seven at a glance.
4. **04-daifukuchō** — the most incremental-native: numbers as soroban
   beads, actions as stamps, the **seasonal audit** (red rule, koku
   restated, beads swept) is the single best judge realization. Desk
   ontology slightly caps immersion in the *world* (you see paper, not the
   estate).
5. **05-stage** — after the restage, genuinely inhabited; **Entrance &
   Address** (granter walks in, ceremony hangs vertical in the sky) is the
   most theatrical milestone moment of the round. Highest asset-quality
   ceiling to reach "AA" (needs pose library + scene dressing).
6. **06-kura** — the hoard made visible works: coin strings on pegs, bale
   stack as rung meter, the wolf among your own sacks. The room is the most
   *tactile* space; scope-wise it frames T0 perfectly but needs an answer
   for what it becomes at T2+ (village/region scale).
7. **07-kagee — the pick.** Strongest thesis (a game about mis-seeing never
   shows the world, only its shadow on paper), combat/bestiary-central
   (stance = pose, forecast = charcoal on the post, bestiary = sharpening
   shadow-album), cheapest to render at quality, and the most
   screenshot-memorable. The fight beat is the closest thing to "a real
   studio shipped this" in the set.

**Recommendation (self-picked default, human overrides freely):** converge
on **kage-e (07) as the lead frame**, with **03-cutaway as runner-up** if
the human wants daylight/world-visibility over atmosphere. Graft the best
organs regardless of winner: the **audit ritual** from 04 as the seasonal
judge, **Entrance & Address** from 05 for rung ceremonies, the
**hundred-mon knot** from 06 for coin feel, the **karazuri emboss** from 02
for locked surfaces, and 01's board as a *secondary* progression-map screen
(the sugoroku IS the tier map). Next step when the human picks: run the
real `diverge` skill (D-075) to wire the chosen frame into the live game as
2–3 working variants behind the DEV panel.

## How to resume (if this session ends here)

1. Ideation v3 done — all 8 briefs committed under `prototype/briefs/`
   (raw JSON snapshot in `project/brainstorms/raw/`).
2. Build workflow `wf_a3fc1757-a3d` (7 builders → `prototype/NN-slug.html`;
   shared inputs `prototype/briefs/{DATA,SPEC}.md` + per-concept briefs).
   Script persists at
   `~/.claude/projects/-Users-raynos-projects-games-kami-kakushi/8e7007a7-7bc2-4042-97b2-836df911938f/workflows/scripts/ui-v2-build-wf_a3fc1757-a3d.js`
   — resume with `Workflow({scriptPath, resumeFromRunId:"wf_a3fc1757-a3d"})`
   if any builder died (e.g. on a usage-limit window; limits reset ~19:20).
3. QA loop: screenshot each prototype via playwright at `file://` (drive the
   uniform `data-dev` buttons: tick/fight/rung/judge/reveal/season/stage-*),
   desktop 1440×900 + 390px; vision-review vs SPEC taste contract + each
   brief's signature move; dispatch fix agents; iterate.
4. Wrap-up: self-review + recommendation into this doc; reading-queue line
   in `project/todo-human.md`; journal entry; commit `prototype/` + this doc
   by explicit path (`SKIP_VERIFY=1`, isolated non-src change; no push if
   the shared tree is red).
