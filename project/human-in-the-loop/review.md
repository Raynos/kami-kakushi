# Reviews (HR-items)

Things needing a human's judgment an automated check can't make — playtest feel,
look, tone, pacing. IDs `HR-1…HR-n`, never reused. Status: 🔲 open · ⏳ waiting on
Claude prep · ✅ done.

> **Organised by RUNG** (2026-07-09) — each item sits under the rung where you
> first meet the surface, so the queue tracks a rung-by-rung QA of the live
> v0.4.0 build. Rungs are **source-verified** against `src/ui/dev.ts` `SURFACES`
> + the tab-reveal schedule (`render.ts`), so nothing here is stale. Each item
> keeps a stable `HR-n` id + a `[rung]` tag; the old cross-cutting **HR-2** is
> split into per-surface **HR-2A…HR-2D** under their rungs.

---

<!-- Format:
### HR-1 🔲 [rung] — {what to review}
  - **Asking for:** {the specific verdict needed}
  - **How to look:** {dev URL / steps}
  - **Verdict:** {filled in by the human}
-->

## ▸ The whole arc — play it through

### HR-1 🔲 [R0 → R7] — the live v0.4.0 T0: fun, pacing & look

The storywave rewrite is **live (v0.4.0)** — the taste call on the WHOLE new T0,
played through. (Supersedes the old v0.3 MS0–MS4 framing; that build is git
history.)

  - **Asking for:** the fun & visual verdict on the full storywave T0 —
    - does the **cold open** hook, and the **R0→R7 climb** pace well across the
      **six-season year** (Winter → New Year → Spring → Summer → Bon → Autumn)?
    - do the **kura/rice economy** + the **day-wage in mon** read clearly?
    - do the **two body economies** land — a hurt/hungry man works worse, and a
      lost fight puts you on the **sickroom** pallet?
    - do the **season-exit beats** + the **Autumn nengu reckoning** feel earned?
    - does it all look **intentional** (Andon Steel), never AI-slop?
  - **How to look:** `pnpm run dev` (use **`?dev=no`** for the true player layout).
    `__qa.speed(8)` to grind fast · `__qa.toRung('R3')` etc. to jump. Pacing is
    **LIQUID** (ADR-059) — tell me to nudge any rung.
  - **Verdict:** _(awaiting the human)_

## ▸ R1 · the estate opens (Map/Estate tab reveals)

### HR-2A 🔲 [~R1] — Travelling market — pick a variant (ADR-075)

The pedlar **Yohei** at the gate on market-days (soft-gated by coin + day-of-week,
no rung lock). A deliberate MINORITY lane (ADR-008) that never out-claims Estate &
Wealth. Three live takes ("VARIANT · Travelling market"):

  - [ ] **market-a — price-button list** _(default)_ — flat name + faint grant +
    a bare `{n} koku` buy-button; sold-out rows disable. Calmest, lowest-weight.
  - [ ] **market-b — 品書 posted price-board** _(built)_ — justified ledger lines
    with dotted leaders; name … grant · price · 求/尽; stock + shortfall beneath.
  - [ ] **market-c — pedlar's ground-cloth** _(built)_ — good-emoji + a "take 取"
    verb, remaining stock as shortening ochre ink. Most diegetic, busiest.
  - **How to look:** `pnpm run dev` → the market (Yohei at the gate on a market
    day) → DEV → Variants → "Travelling market".
  - **Verdict:** _(awaiting your pick)_

> **HR-9 + HR-11 resolved (interim), 2026-07-10** — the human picked **V0A ·
> estate-a** (Estate section) and **V1A · tracker-a** (Build tracker), *"for
> now"*, explicitly flagging that **the whole Estate section + upgrades needs a
> lot of love and thought**. Both picks are the shipped defaults, so prod is
> unchanged and the DEV alternates are KEPT as reference (NOT stripped) pending
> the redesign. Archived to `archive.md`; the redesign direction is parked in
> [`../brainstorms/2026-07-10-estate-upgrades-redesign.md`](../brainstorms/2026-07-10-estate-upgrades-redesign.md)
> + [`../BACKLOG.md`](../BACKLOG.md).

## ▸ R3 · combat & the wider house (Combat/Inventory tabs reveal)

### HR-2B 🔲 [R3 · fills R7] — House-Influence panel (家威 grade) — pick a variant (ADR-075)

The 家威 grade panel — appears as a MACRO_TEASER at R3, fills in Phase 2 (R7).
Three live takes ("VARIANT · House-Influence grade"):

  - [ ] **influence-a — continuous ink grade-bar** _(default; a11y-100, shipped)_
    — indigo→gold bar, ticks at Good/Great/Excellent.
  - [ ] **influence-b — segmented 3-band boxes** _(built)_ — Good 良 / Great 優 /
    Excellent 秀, the current band filling.
  - [ ] **influence-c — standing marks** _(built)_ — a row of ◆◇ ink marks filling
    toward Excellent (a diegetic tally).
  - **How to look:** `pnpm run dev` → reach R3 → DEV → Variants → "House-Influence
    grade"; the grade means most once Phase 2 is banking (R7).
  - **Verdict:** _(awaiting your pick)_

### HR-5 🔲 [R3] — Bestiary panel (combat field-guide) — pick a variant (ADR-075)

The **Bestiary** reveals at R3 (Combat tab): a faced foe shows its kanji seal, its
**tell** (fast / evasive / heavy / unerring), a **win-rate forecast**, and where it
haunts; an un-faced foe stays **fogged** (scout-by-fighting).

  - [ ] **bestiary-a — field-guide cards** _(default; shipped)_ — one card per foe:
    name + seal, a win-rate pip (◆ Steady/Even/Risky), the tell, the node. Calmest;
    reuses the combat-tab foe-row chrome.
  - [ ] **bestiary-b — danger ledger** _(DEV-only)_ — a ranked ink table (危険帳),
    foes easiest→deadliest, a continuous danger-gauge (A19) that heats; unfaced
    hatched. Most at-a-glance threat read.
  - [ ] **bestiary-c — 図鑑 scroll** _(DEV-only)_ — a kanji portrait that inks in
    once faced (a faint ？ before), field-note prose beneath; unfaced reads as a
    rumour. Most in-world.
  - **How to look:** `pnpm run dev` → reach R3 (`__qa.toRung('R3')`) → **Combat**
    tab → toggle "VARIANT · Bestiary"; fight a foe to see an entry ink in.
  - **Verdict:** _(awaiting the human)_

### HR-6 🔲 [R3] — home / Inventory panel — pick a variant (ADR-111, ADR-075)

The home / belongings / comfort surface (Inventory tab, reveals R3); three working
variants, each reading the same home data through the reducer's selectors (every
buy wired to the real `buy_belonging` intent):

  - [ ] **home-a — functional list** _(default)_ — inked belonging rows + a
    comfort-in-effect tally + a "Settle your corner" acquire list. The calm default.
  - [ ] **home-b — 一間 room cutaway** — a diegetic woodblock room; belongings sit
    **in situ** (bowl on the mat, futon over the straw); acquire list = "what the
    room still lacks."
  - [ ] **home-c — 持ち物帳 possessions ledger** — a household register: owned
    pieces as ruled ledger lines, a 合計 foot, buyables as 未入 lines you ink in.
  - **How to look:** `pnpm run dev` → reach R3 → **Inventory** tab → DEV → toggle
    the Home/Inventory variant. All three work live.
  - **Verdict:** _(awaiting your pick)_

## ▸ R4 · the smithy (craft opens)

### HR-2C 🔲 [R4] — Craft panel — pick a variant (ADR-075)

Loot→craft the woodlot axe (the R4 equipment/durability unlock). Three live takes
("VARIANT · Crafting"):

  - [ ] **craft-a — smith's work-order checklist** _(default; shipped)_ — each
    material a have/need row (green once met) under the recipe; one Forge button
    disabled-with-its-reason until every input is met.
  - [ ] **craft-b — the smith's measures** _(DEV-only)_ — each material a
    continuous ink fill-gauge (A19) toward the needed amount, tabular have/need
    beside it; a foot line flips to "strike the smithy" once craftable.
  - [ ] **craft-c — what the axe waits on** _(DEV-only)_ — each material as the
    part it becomes, a 整/未 verdict at the foot.
  - **How to look:** `pnpm run dev` → reach R4 → the Combat/craft card → DEV →
    Variants → "Crafting".
  - **Verdict:** _(awaiting your pick)_

## ▸ R5 · commissions (Quests tab opens)

### HR-2D 🔲 [R5] — Quests tab (用) — pick a variant (ADR-075)

The commissions board (reveals R5). Three live takes ("VARIANT · Quests"):

  - [ ] **quests-a — per-quest woodblock cards** _(default)_ — title + kind tag,
    the full blurb, a ☑/☐ deed checklist, a reward line, "Take this on".
  - [ ] **quests-b — 高札場 notice-board** _(built)_ — commission bills, a brushed
    kind stamp (害/狩/掃) + one continuous "deeds answered" stroke (A19).
  - [ ] **quests-c — 用帳 steward's field-ledger** _(built)_ — one aligned row per
    commission, an ink deeds-tally, the koku in a right-aligned tabular column, a
    合計 foot.
  - **How to look:** `pnpm run dev` → reach R5 → **Quests** tab → DEV → Variants →
    "Quests".
  - **Verdict:** _(awaiting your pick)_

### HR-18 🔲 [R2+ · seasons] — the five season-turn overlays (C5a unit 1, ADR-139/ADR-167)

The 05-world per-season-overlay lock, closed: `turn-winter/-new-year/-spring/
-summer/-bon` scene-defs (narration-only, once, firing as each season first
ENDS). **Pick: TAKE C "the land first"** (18✔2✘ — people enter each beat late
and small; redlined per Pass-2: one stacked ornament cut, the season-handoff
closing template broken in 3 of 5). Alternates: A "the ledger turns" (12✔7✘),
B "the household's body" (3✔3✘ — its Bon scene near-duplicated sb-bon).
Canon: `narrative/scenes.md` (the continuous read: `docs/content/t0-story.md`);
alternates + briefs: `takes/c5a-overlays/`.

  - **How to look LIVE:** `pnpm run dev` → any R2+ run (e.g. `?fixture=rung-R4`)
    → DEV → **Story** → set-switcher entry **c5a-overlays** → End a season —
    the overlay plays the selected take. (Each is once-per-run: replay via New
    game/`toRung`, or read all five in "⤢ Explore story".)
  - **Verdict:** _(awaiting your read)_

### HR-19 🔲 [R1–R2 · discoveries] — the three hidden discoveries' fiction (C5a unit 2)

The tiers/t0.md locked roster wired + voiced: the weir REEDS bundle (the
water-ruined paper — reveals `search_reeds`), the silted SLUICE (reveals
`clear_sluice`), the SETT under the ruined wall (seed-only — T2 pays it).
**Pick: TAKE A "found by hand"** (11✔1✘; the settFound rope-maxim cut).
Alternates: B "the estate remembers" (10✔2✘), C "nobody says" (9✔3✘).
Canon keys `reeds*/sluice*/sett*` in `narrative/flavor.md`; alternates:
`takes/c5a-discoveries/`.

  - **How to look LIVE:** DEV → Story → **c5a-discoveries**; walk to the
    weir/woodlot/field-margins — the hint ladder shows in the you-are-here
    card and swaps with the take; keep working the node and the found line
    lands in the log voicing the selected take (future latches swap; logged
    history stays).
  - **Verdict:** _(awaiting your read)_

### HR-20 🔲 [R7 · Phase 2] — the per-grade day-book judge lines (C5a unit 4, ADR-159)

Six lines, one per grade of the locked six-step ladder, replacing the single
"accounts are reckoned" string. **Pick: TAKE C "as the valley sees it"** (tied
5✔1✘ with B; C wins on TST3 — koku standing IS outside regard; the
counted-twice canon echo redlined). Alternates: A "the board's arithmetic"
(4✔2✘), B "the house as body" (5✔1✘ — a genuinely close second; read it).
Canon keys `judgeLine*` in `narrative/flavor.md`; alternates: `takes/c5a-judge/`.

  - **How to look LIVE:** DEV → Story → **c5a-judge**; DEV → Rungs →
    "→ Phase 2", bank some estate growth, End the season — the day-book's
    judge line voices the selected take at your current grade.
  - **Verdict:** _(awaiting your read)_

### HR-21 🔲 [all rungs · seasons] — the per-season node reads, 16 zones × 6 seasons (C5a unit 5)

Every zone's you-are-here card + arrival line now breathes by season
(05-world: "nodes carry per-season flavor"); the survey SHEET stays static (a
drawn document). SIX bundles, one per season (your per-season-unit ruling):
picks — Winter A (work-first 14✔2✘) · New Year B (senses 12✔4✘) · Spring B
(senses 14✔2✘) · Summer A (work 11✔5✘) · Bon B (senses 12✔4✘) · Autumn B
(senses 11✔5✘); every flagged anchor-span duplication redlined before landing.
Canon keys `node<X>Blurb<Season>` in `narrative/flavor.md`; alternates:
`takes/c5a-nodes-<season>/` (per-take briefs + scorecards in each bundle.md).

  - **How to look LIVE:** DEV → Story → the **c5a-nodes-<season>** entries;
    open the Map tab and walk a few zones — the you-are-here card reads the
    standing season's take and swaps with the toggle; End seasons to walk the
    year through one node.
  - **Verdict:** _(awaiting your read — bundle-level verdicts are fine: pick
    per SEASON, never per line)_

### HR-25 🔲 [R7 · story] — the lord unstaged: R7's two {lord} lines (HD-36, ADR-139)

Your HD-36 (a) ruling applied: the two R7 house-standing lines re-derived so
Munemasa is never staged in T0 (canon: a voice through a wall, never met — his
one scene stays T1's capstone). Three blind takes; **pick: TAKE B "the voice
through the wall"** — his own damaged voice overheard through the shoji,
unanswered, never met. The canon lines now read:

> "The fields keep a man's hours now, and not mine — if mine ever held them,"
> comes {lord}'s voice through the shoji of the inner house, unanswered; the
> yard knows whose hours he means.

> "There is rice against winter. There was a saying for that — I had it once,"
> {lord} is heard saying to the dark of the inner house, and nobody who hears
> it goes in.

B ties C (6✔) and wins on TST3 — R7's title ("Trusted of the house") needs the
summit's notice, delivered inside the bible's own device, pre-sounding the
voice T1's shoin capstone pays off. Alternates: A "the word comes down the
wall" (relayed via Genemon/Chiyo, 5✔1✘) · C "the house answers for him"
(lordless-institutional, 6✔ — a genuinely close second; read it). Canon in
`narrative/requirements.md`; alternates: `takes/hd36-lord-unstaged/`.

  - **Taste brief (pass 1):** P3 speaker readable via {tokens} · P9
    recognition follows the labor · P10 only established motifs (shoji, inner
    house, day-book) · P13 diegetic completion lines · V-canon: Munemasa
    unstaged, felt-never-numbered, MC never named/quoted, maxims fail upward.
  - **Scorecard (B · canon):** 6✔ · 0✘ · 15— (the granary maxim fails
    on-page — "I had it once" — exactly his register).
  - **Scorecard (A):** 5✔ · 1✘ · 15— — ✘ TST4 [briefed]: the granary line
    lands two inferences from the banked rice and centers the carrier.
  - **Scorecard (C):** 6✔ · 0✘ · 15— (withholds the lord's notice — TST3
    tie-break loser, not a defect).
  - **How to look LIVE:** DEV → Story → **hd36-lord-unstaged**; then
    `__qa.toRung('R7')` + `__qa.speed(8)`, farm the paddy / bank rice — the
    completion lines voice the selected take (future emissions only; logged
    history stays).
  - **Verdict:** _(awaiting your read)_

---

> _Open reviews only. Closed reviews graduate to [`archive.md`](archive.md). The
> old **HR-2** cross-cutting item is split above into **HR-2A** (market) · **HR-2B**
> (House-Influence) · **HR-2C** (craft) · **HR-2D** (quests). Two of its surfaces
> were **removed as stale** (no live toggle in `dev.ts`): the **log filter bar**
> (ships as a single rendering, no pick) and the **walkable map** (resolved by
> HR-7, 2026-07-07 — the survey-plan map shipped; losing takes stripped). Recent
> closes: **HR-8/HR-10/HR-12/HR-14/HR-16/HR-17** (the storywave ship)._

### HR-27 🔲 [R2+ · estate] — the works discovery chain (estate Phase 1, works-cause, ADR-139/ADR-177)

FB-338's fix, built: the estate projects are now DISCOVERED, not spawned. The
day-book names a concern → you walk the zone and SEE the damage (a sighting
line lands) → Genemon's beat prices the work → only then does the ladder show
a name, cost, and button. Five new scene-defs (`works-intro` at the board R2+,
`works-u1..u4` pricing beats, ladder-ordered) + 14 flavor keys (naming lines,
sighting lines, the card's unnamed/named hints, U1's re-sited strings). U1
moves from the weir screens to **first repairs in the three R1 zones** (gate ·
bunds · woodshed roof); the weir lease stays a NAMED concern — and the weir
node is **locked until the day-book names it** (FB-342's fix, live).
**Pick: TAKE C "the land keeps its own book"** (19✔2✘ — the sighting lines
catch the damage mid-act, which IS the FB-338 answer; naming lines are
location-free; the land-first register matches your c5a-overlays pick.
Redlined per Pass-2: the cold-open "his sill" ambiguity → "the weir"; the
kura fullness claim softened). Alternates: A "the ledger's mercy" (17✔4✘ —
the deepest conceit, being entered is being kept; read its works-u4), B "the
household knows" (16✔5✘ — the warmest; the plum dish and the beam-marks).
Canon: `narrative/scenes.md` + `narrative/flavor.md` (continuous read:
`docs/content/t0-story.md`); alternates + briefs + Pass-1 constraint brief:
`takes/works-cause/`.

  - **How to look LIVE:** `?fixture=rung-R2` → move once and return to the
    forecourt — **works-intro** auto-plays (the naming; the weir path opens —
    and the **Works 普請 tab lights**, Schedule A); Works reads "go and see
    them where they stand" with NO buy button;
    walk gate → paddies → woodshed (sighting lines land in Story); the
    **works-u1** beat fires → the ladder inks in "Stem the first rot" priced.
    DEV → Story → **works-cause** swaps every unit live (`?story-works-cause=a`
    boots straight into take A — the ladder label flips to "Close the oldest
    lines"). U2–U4 beats: `toRung('R5'/'R6'/'R7')` with the prior stage built.
  - **Verdict:** _(awaiting your read)_

### HR-28 🔲 [cold open · story] — the three intro scene heads (FB-362, ADR-139)

The cold open now splits into one 幕 card per VN scene (FB-362, `cd10b315`);
the three scene heads are new fiction-voiced text, diverged per ADR-139
(bundle `fb362-intro-titles`, 3 blind takes):

- **Pick: TAKE B "taken · unnamed · entered"** (20✔0✘1—) — dream = **what the
  water takes** · sickroom = **no name to give** · ledger = **entered in the
  book**. Each head names its act's literal on-screen event; the ledger head
  points at the day-book entry the R7 name-writing pays off.
- Alternates: A "the ground it happens on" (19✔1✘ — place-anchored; ✘ "the
  book room" names a place the game doesn't have), C "the counted week"
  (19✔1~ — time-anchored; two clock-shaped heads blur).

  - **How to look LIVE:** new game → play the cold open — the Story view now
    shows three cards with take B's heads. DEV → Story → **fb362-intro-titles**
    swaps takes live; `?story-fb362-intro-titles=a|c` boots into an alternate.
    Old saves keep their baked single "— the cold open —" card (TST2).
  - **Verdict:** _(awaiting your read)_

### HR-29 🔲 [R2+ · works] — Works 普請 tab surface — pick a variant (ADR-075, estate Phase 2)

The projects' new home (Schedule A). All three read the SAME estateBuild/works
chain and drive the real `improve_estate`:

- **Works 普請** (the projects/upgrades surface) — ✅ **all three LIVE in the DEV panel**:
  - **Taste brief (pass 1):** P9/TST3 nothing named before its beat (unnamed rows stay
    unruled) · P15 no future-zone previews · P19 chrome register — tight, ruled, ink
    tokens only · TST4 the chain's position always readable (unnamed → named → priced) ·
    P4/TST2 signature-gated rebuild, zero idle churn · AC-6 price/gate reads = reducer's.
  - [ ] **A — the day-book page** _(self-picked prod default; ships)_ — projects as
    ledger lines: closed entries ruled through in gold, the open entry priced with
    payoff + button, the future faint and unruled. The works-cause fiction as chrome.
    - **Scorecard (A):** 19✔ · 2✘ — P6 [blind spot] the price column can crowd at
      390px (nowrap; watch it); P17 [briefed] closed entries rely on strikethrough
      alone for their explored-state read.
  - [ ] **B — the work-site board** _(built; DEV-only)_ — one site card per project,
    anchored on the zones you walk (門田薪 → 園 → 蔵 → 庭), the open site carrying
    the commissioning.
    - **Scorecard (B):** 16✔ · 5✘ — P6 [briefed] pre-discovery sites read as
      near-empty ghost frames; P15 [blind spot] the future sites' zone kanji preview
      where later works land (the ladder forms never leak this); P19 frame-in-frame.
  - [ ] **C — the build ladder (interim)** _(built; DEV-only)_ — the pre-ADR-177
    tracker shape, kept for live comparison.
    - **Scorecard (C):** 17✔ · 4✘ — the twice-bounced shape (FB-157 "border soup"
      lineage): ladder, blurb, payoff, and button stack as four unrelated bands.
  - **How to review:** `?fixture=works-u1-priced` → the Works 普請 tab → DEV panel →
    "Works 普請 (projects home)" toggle. The fixture holds U1 priced-and-affordable
    so every variant shows its full read (and the commissioning actually works).
    **Phase 3 note:** the buy is now a two-step WORK (F3): Commission pays coin +
    wood, then "Work the repairs 普請" at the site (`?fixture=works-u1-underway`
    boots mid-work at the gate). The commissioning log line is mechanical register,
    not diverged fiction — bounce it here if it reads as story.
  - **Verdict:** _(awaiting your read)_

### HR-30 🔲 [R6 · estate] — Estate 家 tab surface (the E1 fold-in) — pick a variant (ADR-075, F5, HR-16)

Estate 家 at R6: the house itself. The E1 okoshi-ezu cutaway FOLDS IN as the
shipped anchor (HR-16's "needs more work" iteration happened here — the sheet
is now state-driven: rooms ink in as they reopen; the freshest commissioned
work wears the gold 新):

- **Estate 家** (the house surface) — ✅ **all three LIVE in the DEV panel**:
  - **Taste brief (pass 1):** P9/TST3 rooms appear on their reveal beats, never as a
    menu (locked rooms unnamed everywhere) · TST1 one home — the sheet replaces the
    rooms list, never duplicates it · P14 the drawing owns the ceremony register ·
    TST4 a caption carries the glance-read the drawing can't · TST2 repaint only when
    the house moves (signature-gated).
  - [ ] **A — the house, drawn** _(self-picked prod default; ships)_ — the survey
    sheet as the tab's one anchor (paintSheetA over live state), reopened rooms
    listed in the caption; the influence pane sits beneath.
    - **Scorecard (A):** 18✔ · 3✘ — P20 [briefed] the tall sheet compresses on a
      phone (labels go small; the caption is the mitigation); TST4 [briefed] shutter
      marks are a subtle open/shut read; P2 [blind spot] the sheet's legend/cartouche
      idiom is prototype-native (shared with map-sheets' brush, but not the app's
      card idiom).
  - [ ] **B — the steward's reckoning** _(built; DEV-only)_ — the rooms as day-book
    lines (open rooms named, shut rooms unnamed silhouettes) with the standing as
    the page's footing. Redlined in Pass 2: locked rooms no longer named (P15).
    - **Scorecard (B):** 17✔ · 4✘ — TST1 [blind spot] the koku footing duplicates
      the influence pane's number on the same tab; the register overlaps the Works
      ledger (two book-pages, one app).
  - [ ] **C — the rooms list (interim)** _(built; DEV-only)_ — the pre-ADR-177 plain
    reopened-rooms card.
    - **Scorecard (C):** 15✔ · 4✘ — no anchor; the tab reads as a leftover staple
      (exactly the FB-157 complaint the redesign answers).
  - **How to review:** `?fixture=rung-R6` (or R7/wealthy-idler for more rooms) → the
    Estate 家 tab → DEV panel → "Estate 家 (the house)" toggle.
  - **Verdict:** _(awaiting your read)_

