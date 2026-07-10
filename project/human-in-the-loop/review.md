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

### HR-9 🔲 [R1 · build fills R7] — Estate SECTION redesign — pick a variant (FB-157, ADR-075)

The Estate tab's improve + house-rooms cards (called "border soup"); the section
is visible from R1, though the Phase-2 build content fills at R7. Three takes drive
the real `improve_estate` intent + live stage/coin/rooms data:

  - [ ] **estate-a — quiet sections** _(default)_ — the de-framed key-dim sections
    the FB-157 quick-fix shipped.
  - [ ] **estate-b — ledger strip** — one dense row (stage ··· dotted leader ···
    Improve), payoff beneath, opened rooms as gold kanji chips.
  - [ ] **estate-c — bimetal plaque** — a centred engraved plaque: stage in gold
    serif, payoff etched silver, rooms as a mini-plaque rail.
  - **How to look:** `pnpm run dev` → **Estate 家** tab → DEV → Variants → "Estate
    section (FB-157)"; or `?estate-section=estate-b` / `estate-c`.
  - **Verdict:** _(awaiting the human)_

### HR-11 🔲 [R1 · tracker meaningful R7] — Build-progress tracker — pick a variant (ADR-145, ADR-075)

A **tracker read** inside the Estate improve card; all three re-present the SAME
pure-core `estateBuild` selector (AC-6 — the shown distance can't lie). The card is
there from R1; the E0→E1 build it tracks runs in Phase 2 (R7).

  - **Taste brief (pass 1):** P1 EXTENDS the improve card (no second home; CTA
    stays put) · P2 reuse frame/meter/gold idioms · P4/P5 rows patched in place,
    card never resizes · P15/TST3 locked future stages stay UNNAMED · P19/P20
    chrome register, plain numbers · TST4 gate distance readable at a glance.
  - [ ] **tracker-a — ladder rows** _(default; ships)_ — built ◆ gold · next ▹
    with a standing gauge · locked ▢ unnamed. **Scorecard:** 19✔ · 0✘ · 2—
  - [ ] **tracker-b — milestone rail** _(DEV-only)_ — a horizontal 4-pip rail, the
    gold thread filling toward the next pip. **Scorecard:** 18✔ · 1✘ · 2— —
    ✘P15 [briefed]: pips reveal the total stage COUNT while locked.
  - [ ] **tracker-c — ledger entries** _(DEV-only)_ — built stages as closed
    "Entered:" lines, the next an open dotted-leader "wants" line; locked absent.
    **Scorecard:** 19✔ · 0✘ · 2— — strictest no-spoiler; boldest register.
  - **How to look:** `pnpm run dev` → **Estate 家** tab → DEV → Variants → "Build
    tracker (ADR-145)". NOTE: renders inside the DEFAULT estate section (HR-9
    estate-a); pick that surface first if you want them merged.
  - **Verdict:** _(awaiting the human)_

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

### HR-22 🔲 [R0 · cold open] — the memory act + title card (HD-37 unit A, ADR-139)

The rearc's first act (dream → soan → genemon is live; three picks per run) +
the title card's lede/CTA, reworked to fit memory-first (your "rework the
card line" ruling; the card's fiction moved out of render.ts hard-codes into
`cold-open.md` and now swaps live — new `dev.subColdOpen`). **Pick: TAKE A
"the inventory of what is left"** (12✔0✘, score 9): the memory surfaces as
counted items, the name a blank entry — the counting register seeds the
house's ledger faith, and "the kept item goes under, the habit stays" makes
the verdicted wake echo read true after every pick. Card: *"A man is in the
river above the weir…"* / CTA **"Make the count"**. Alternates: B "the grasp
against the current" (8.5 — the name lost ON SCREEN; card CTA "Reach for
it"), C "what the river keeps" (8.5 — the loss already finished; stillness).
Canon: `cold-open.md` lede/cta/dream + `intro.md` scene dream; alternates:
`takes/hd37-cold-open-a/`.

  - **How to look LIVE:** DEV → Story → **The memory act — what the water
    keeps**; the TITLE CARD re-inks in place as you toggle (lede + button).
    For the act itself: New game → click through — the act swaps via the
    same toggle (intro:dream), decide-only, straight into the choice grid.
  - **Verdict:** _(awaiting your read)_

### HR-23 🔲 [R0 · cold open] — Genemon's scene (HD-37 unit B, ADR-139)

The restored third act, re-authored from the pre-C4.9 seed (which broke his
locked voice — "a great name gone to seed" is a metaphor he'd never say).
**Pick: TAKE C "the first entry is yours"** (8.5, zero blockers; won the
tie-break on canon seams): probation in ink — he withholds everything not
asked, every react is a ledger entry read aloud, "Day four; the book said
three" locks onto Sōan's "Day four, by mine", the gen-work answer carries
"Rakes; hauls. Wage: meals" as an already-written line, and "the entry is
not closed" seeds the R7 name-writing payoff. Alternates: A "the intake
entry" (8.5 — the condition-column scene; a strong twin, read it), B "the
arithmetic of the house" (7.5 — rooms ten six shut; its three voice-law
breaches literalized per the judge). Canon: `intro.md` scene genemon +
`dialogue.md` gen-greet; alternates: `takes/hd37-cold-open-b/`.

  - **How to look LIVE:** DEV → Story → **Genemon's scene — the entry is not
    closed**; New game → play to the third act (two picks in) — the whole
    scene (greeting, asks, the gated "Is the work safe?", reacts) voices the
    selected take.
  - **Verdict:** _(awaiting your read)_

---

### HR-24 🔲 [R0+ · Story log] — VN grouping units — pick a variant (FB-262, ADR-075)

The Story log's fix for "just random linear scroll": consecutive lines from one
VN scene (a rung beat, a generalized scene, the cold open) now read as ONE
bordered unit with the scene's name as its header — scrolling back reads as VN
blocks with ambient story between them. Three treatments, all working, all
live-switchable. **Self-picked prod default: A · 幕 card.**

  - **A · 幕 card** — a hairline gold box around the scene, its name as the
    lintel. Quietest full enclosure; the "proper border VN section" as asked.
  - **B · margin rail** — a 2px gold rail down the scene's left margin, the
    name as a small ink side label. Lightest touch; groups without boxing.
  - **C · raised plate** — the scene sits on its own steel plate (rounded,
    inset), physically lifted off the ambient flow. Strongest separation.
  - **How to look LIVE:** DEV → Variants → **Story log · VN groups**; play any
    rung beat (or `?fixture=rung-beat-ready` → answer the summons) and open
    Story. NOTE: lines from saves made before 2026-07-10 carry no scene tag —
    grouping shows on new play.
  - **Verdict:** _(awaiting your read)_

---

> _Open reviews only. Closed reviews graduate to [`archive.md`](archive.md). The
> old **HR-2** cross-cutting item is split above into **HR-2A** (market) · **HR-2B**
> (House-Influence) · **HR-2C** (craft) · **HR-2D** (quests). Two of its surfaces
> were **removed as stale** (no live toggle in `dev.ts`): the **log filter bar**
> (ships as a single rendering, no pick) and the **walkable map** (resolved by
> HR-7, 2026-07-07 — the survey-plan map shipped; losing takes stripped). Recent
> closes: **HR-8/HR-10/HR-12/HR-14/HR-16/HR-17** (the storywave ship)._
