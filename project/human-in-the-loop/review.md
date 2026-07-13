# Reviews (HR-items)

Things needing a human's judgment an automated check can't make —
playtest feel, look, tone, pacing. IDs `HR-1…HR-n`, never reused.
Status: 🔲 open · ⏳ waiting on Claude prep · ✅ done.

> **Organised by RUNG** (2026-07-09) — each item sits under the rung
> where you first meet the surface, so the queue tracks a rung-by-rung
> QA of the live v0.4.0 build. Rungs are **source-verified** against
> `src/ui/dev-surfaces.ts` `SURFACES`
> + the tab-reveal schedule (`render.ts`), so nothing here is stale.
>   Each item keeps a stable `HR-n` id + a `[rung]` tag; the old
>   cross-cutting **HR-2** is split into per-surface **HR-2A…HR-2D**
>   under their rungs.

> **Everything here has ONE home in the game (2026-07-13)** — the DEV
> panel's **Review** tab (Variants ⇄ Story, one switch). Each item's
> **In the DEV panel:** line names the **V**/**SV** tags to click, and
> each DEV row carries its **HR-n** chip back to this file. The two are
> bound by the **`review-link`** gate: a toggle naming a closed or
> missing item, an item naming a stale tag, or a tag cited under the
> wrong item all go RED. So don't hand-edit a tag — if the registry
> order moved, run `npx tsx src/scripts/verify-review-link.ts` and it
> names every one, old → new.

---

<!-- Format:
### HR-1 🔲 [rung] — {what to review}
  - **Asking for:** {the specific verdict needed}
  - **How to look:** {dev URL / steps}
  - **In the DEV panel:** Review → Variants|Story → **V-tag** (the
    review-link gate keeps this true — see the note above)
  - **Verdict:** {filled in by the human} -->

## ▸ The whole arc — play it through

### HR-1 🔲 [R0 → R7] — the live v0.4.0 T0: fun, pacing & look

The storywave rewrite is **live (v0.4.0)** — the taste call on the WHOLE
new T0, played through. (Supersedes the old v0.3 MS0–MS4 framing; that
build is git history.)

  - **Asking for:** the fun & visual verdict on the full storywave T0 —
    - does the **cold open** hook, and the **R0→R7 climb** pace well
      across the **six-season year** (Winter → New Year → Spring →
      Summer → Bon → Autumn)?
    - do the **kura/rice economy** + the **day-wage in mon** read
      clearly?
    - do the **two body economies** land — a hurt/hungry man works
      worse, and a lost fight puts you on the **sickroom** pallet?
    - do the **season-exit beats** + the **Autumn nengu reckoning** feel
      earned?
    - does it all look **intentional** (Andon Steel), never AI-slop?
  - **How to look:** `pnpm run dev` (use **`?dev=no`** for the true
    player layout). `__qa.speed(8)` to grind fast · `__qa.toRung('R3')`
    etc. to jump. Pacing is **LIQUID** (ADR-059) — tell me to nudge any
    rung.
  - **Verdict:** _(awaiting the human)_

## ▸ R0 · the first climb (the earned line)

### HR-41 🔲 [R0+ · story/TST4] — the objective line (what Progress SAYS) — pick a take, then HD-41 locks (ADR-139)

**The treatment is settled — you picked B, the ruled entry (2026-07-13),
and it now ships as the only one** (the A/C toggle is pruned, ADR-075
zero flag-debt). Two things changed on your word, and both are live:

  - **the meter's flash now MEANS something.** It rode the rounded
    percent, which grows on nearly every rake — so it flashed constantly
    and said nothing. It now fires when a rung **objective completes**.
    R0 has three; R0 flashes three times.
  - **Progress no longer speaks story.** Story keeps the overheard
    flavor line; **Progress states the work you just finished** — its own
    authored line, one per requirement (31, R0→R7), so the register never
    stamps the same sentence twice.

What is left for you is the **voice of that Progress line** — 3 blind
takes (ADR-139), authored across all 31 requirements, swappable live.
Your verdict here **writes the HD-41 ADR**.

  - [ ] **canon · A "the house's book"** _(self-picked; ships)_ — the
    day-book entry: dry, nominal, the work and its measure as a clerk
    would set it down. R0 reads: _"The spilled stores, the first rows
    raked back in."_ → _"The spill, worked past the hour of the ox."_ →
    _"The spill taken up entire, the floor bare by dawn."_
    - **Why it was picked:** it is the only one of the three that reads
      as a **record** rather than as more prose — and it ties Progress to
      the day-book fiction the cold open and the works pages already own
      (TST1: one record fiction).
  - [ ] **take b · "the world, changed"** _(DEV-only)_ — the changed
    physical fact is the only evidence; the man never appears. _"The
    spill by the granary door lies raked into heaps."_
  - [ ] **take c · "the hands keep the account"** _(DEV-only)_ — the work
    read off the body: palms, back, the habit worn in. _"He raked the
    first rows until both palms blistered."_
  - **The call you are actually making:** A records, B describes, C
    confesses. A is the coldest and the most legible (kernel #3 — praise
    stays scarce); C is the warmest and the closest to the Story voice we
    just separated Progress FROM. If C reads better to you, that is a
    real signal that the two tabs should sound closer than I judged.
  - **How to look:** load the **post-cold-open** scenario (DEV →
    Scenarios) → rake ~10 rows → the line lands in **Story** as Genemon's
    remark and in **Progress** as the record of the work; the meter
    pulses once, there. DEV → Story → `hd41-progress-objective` to swap
    takes — the whole visible Progress register re-reads on the flip, so
    you can compare without replaying.
  - **In the DEV panel:** Review → Story → **SV18**
    <!-- dev-tags: kept true by the review-link gate -->
  - **Verdict:** _(awaiting your pick — this verdict writes the HD-41
    ADR)_

## ▸ R1 · the estate opens (Map/Estate tab reveals)

### HR-2A 🔲 [~R1] — Travelling market — pick a variant (ADR-075)

The pedlar **Yohei** at the gate on market-days (soft-gated by coin +
day-of-week, no rung lock). A deliberate MINORITY lane (ADR-008) that
never out-claims Estate & Wealth. Three live takes ("VARIANT ·
Travelling market"):

  - [ ] **market-a — price-button list** _(default)_ — flat name + faint
    grant + a bare `{n} koku` buy-button; sold-out rows disable.
    Calmest, lowest-weight.
  - [ ] **market-b — 品書 posted price-board** _(built)_ — justified
    ledger lines with dotted leaders; name … grant · price · 求/尽; stock
    + shortfall beneath.
  - [ ] **market-c — pedlar's ground-cloth** _(built)_ — good-emoji + a
    "take 取" verb, remaining stock as shortening ochre ink. Most
    diegetic, busiest.
  - **How to look:** `pnpm run dev` → the market (Yohei at the gate on a
    market day) → DEV → Variants → "Travelling market".
  - **In the DEV panel:** Review → Variants → **V4** <!-- dev-tags: kept
    true by the review-link gate -->
  - **Verdict:** _(awaiting your pick)_

> **HR-9 + HR-11 resolved (interim), 2026-07-10** — the human picked
> **V0A · estate-a** (Estate section) and **V1A · tracker-a** (Build
> tracker), *"for now"*, explicitly flagging that **the whole Estate
> section + upgrades needs a lot of love and thought**. Both picks are
> the shipped defaults, so prod is unchanged and the DEV alternates are
> KEPT as reference (NOT stripped) pending the redesign. Archived to
> `archive.md`; the redesign direction is parked in
> [`../brainstorms/2026-07-10-estate-upgrades-redesign.md`](../brainstorms/2026-07-10-estate-upgrades-redesign.md)
> + [`../BACKLOG.md`](../BACKLOG.md).

## ▸ R3 · combat & the wider house (Combat/Inventory tabs reveal)

### HR-2B 🔲 [R3 · fills R7] — House-Influence panel (家威 grade) — pick a variant (ADR-075)

The 家威 grade panel — appears as a MACRO_TEASER at R3, fills in Phase 2
(R7). Three live takes ("VARIANT · House-Influence grade"):

  - [ ] **influence-a — continuous ink grade-bar** _(default; a11y-100,
    shipped)_ — indigo→gold bar, ticks at Good/Great/Excellent.
  - [ ] **influence-b — segmented 3-band boxes** _(built)_ — Good 良 /
    Great 優 / Excellent 秀, the current band filling.
  - [ ] **influence-c — standing marks** _(built)_ — a row of ◆◇ ink
    marks filling toward Excellent (a diegetic tally).
  - **How to look:** `pnpm run dev` → reach R3 → DEV → Variants →
    "House-Influence grade"; the grade means most once Phase 2 is
    banking (R7).
  - **In the DEV panel:** Review → Variants → **V0** <!-- dev-tags: kept
    true by the review-link gate -->
  - **Verdict:** _(awaiting your pick)_

### HR-5 🔲 [R3] — Bestiary panel (combat field-guide) — pick a variant (ADR-075)

The **Bestiary** reveals at R3 (Combat tab): a faced foe shows its kanji
seal, its **tell** (fast / evasive / heavy / unerring), a **win-rate
forecast**, and where it haunts; an un-faced foe stays **fogged**
(scout-by-fighting).

  - [ ] **bestiary-a — field-guide cards** _(default; shipped)_ — one
    card per foe: name + seal, a win-rate pip (◆ Steady/Even/Risky), the
    tell, the node. Calmest; reuses the combat-tab foe-row chrome.
  - [ ] **bestiary-b — danger ledger** _(DEV-only)_ — a ranked ink table
    (危険帳), foes easiest→deadliest, a continuous danger-gauge (A19) that
    heats; unfaced hatched. Most at-a-glance threat read.
  - [ ] **bestiary-c — 図鑑 scroll** _(DEV-only)_ — a kanji portrait that
    inks in once faced (a faint ？ before), field-note prose beneath;
    unfaced reads as a rumour. Most in-world.
  - **How to look:** `pnpm run dev` → reach R3 (`__qa.toRung('R3')`) →
    **Combat** tab → toggle "VARIANT · Bestiary"; fight a foe to see an
    entry ink in.
  - **In the DEV panel:** Review → Variants → **V6** <!-- dev-tags: kept
    true by the review-link gate -->
  - **Verdict:** _(awaiting the human)_

### HR-6 🔲 [R3] — home / Inventory panel — pick a variant (ADR-111, ADR-075)

The home / belongings / comfort surface (Inventory tab, reveals R3);
three working variants, each reading the same home data through the
reducer's selectors (every buy wired to the real `buy_belonging`
intent):

  - [ ] **home-a — functional list** _(default)_ — inked belonging rows
    + a comfort-in-effect tally + a "Settle your corner" acquire list.
      The calm default.
  - [ ] **home-b — 一間 room cutaway** — a diegetic woodblock room;
    belongings sit **in situ** (bowl on the mat, futon over the straw);
    acquire list = "what the room still lacks."
  - [ ] **home-c — 持ち物帳 possessions ledger** — a household register:
    owned pieces as ruled ledger lines, a 合計 foot, buyables as 未入 lines
    you ink in.
  - **How to look:** `pnpm run dev` → reach R3 → **Inventory** tab → DEV
    → toggle the Home/Inventory variant. All three work live.
  - **In the DEV panel:** Review → Variants → **V7** <!-- dev-tags: kept
    true by the review-link gate -->
  - **Verdict:** _(awaiting your pick)_

## ▸ R4 · the smithy (craft opens)

### HR-2C 🔲 [R4] — Craft panel — pick a variant (ADR-075)

Loot→craft the woodlot axe (the R4 equipment/durability unlock). Three
live takes ("VARIANT · Crafting"):

  - [ ] **craft-a — smith's work-order checklist** _(default; shipped)_
    — each material a have/need row (green once met) under the recipe;
    one Forge button disabled-with-its-reason until every input is met.
  - [ ] **craft-b — the smith's measures** _(DEV-only)_ — each material
    a continuous ink fill-gauge (A19) toward the needed amount, tabular
    have/need beside it; a foot line flips to "strike the smithy" once
    craftable.
  - [ ] **craft-c — what the axe waits on** _(DEV-only)_ — each material
    as the part it becomes, a 整/未 verdict at the foot.
  - **How to look:** `pnpm run dev` → reach R4 → the Combat/craft card →
    DEV → Variants → "Crafting".
  - **In the DEV panel:** Review → Variants → **V1** <!-- dev-tags: kept
    true by the review-link gate -->
  - **Verdict:** _(awaiting your pick)_

## ▸ R5 · commissions (Quests tab opens)

### HR-2D 🔲 [R5] — Quests tab (用) — pick a variant (ADR-075)

The commissions board (reveals R5). Three live takes ("VARIANT ·
Quests"):

  - [ ] **quests-a — per-quest woodblock cards** _(default)_ — title +
    kind tag, the full blurb, a ☑/☐ deed checklist, a reward line, "Take
    this on".
  - [ ] **quests-b — 高札場 notice-board** _(built)_ — commission bills, a
    brushed kind stamp (害/狩/掃) + one continuous "deeds answered" stroke
    (A19).
  - [ ] **quests-c — 用帳 steward's field-ledger** _(built)_ — one aligned
    row per commission, an ink deeds-tally, the koku in a right-aligned
    tabular column, a 合計 foot.
  - **How to look:** `pnpm run dev` → reach R5 → **Quests** tab → DEV →
    Variants → "Quests".
  - **In the DEV panel:** Review → Variants → **V5** <!-- dev-tags: kept
    true by the review-link gate -->
  - **Verdict:** _(awaiting your pick)_

### HR-18 🔲 [R2+ · seasons] — the five season-turn overlays (C5a unit 1, ADR-139/ADR-167)

The 05-world per-season-overlay lock, closed:
`turn-winter/-new-year/-spring/ -summer/-bon` scene-defs
(narration-only, once, firing as each season first ENDS). **Pick: TAKE C
"the land first"** (18✔2✘ — people enter each beat late and small;
redlined per Pass-2: one stacked ornament cut, the season-handoff
closing template broken in 3 of 5). Alternates: A "the ledger turns"
(12✔7✘), B "the household's body" (3✔3✘ — its Bon scene near-duplicated
sb-bon). Canon: `narrative/scenes.md` (the continuous read:
`docs/content/t0-story.md`); alternates + briefs: `takes/c5a-overlays/`.

  - **How to look LIVE:** `pnpm run dev` → any R2+ run (e.g.
    `?fixture=rung-R4`) → DEV → **Story** → set-switcher entry
    **c5a-overlays** → End a season — the overlay plays the selected
    take. (Each is once-per-run: replay via New game/`toRung`, or read
    all five in "⤢ Explore story".)
  - **In the DEV panel:** Review → Story → **SV9** <!-- dev-tags: kept
    true by the review-link gate -->
  - **Verdict:** _(awaiting your read)_

### HR-19 🔲 [R1–R2 · discoveries] — the three hidden discoveries' fiction (C5a unit 2)

The tiers/t0.md locked roster wired + voiced: the weir REEDS bundle (the
water-ruined paper — reveals `search_reeds`), the silted SLUICE (reveals
`clear_sluice`), the SETT under the ruined wall (seed-only — T2 pays
it). **Pick: TAKE A "found by hand"** (11✔1✘; the settFound rope-maxim
cut). Alternates: B "the estate remembers" (10✔2✘), C "nobody says"
(9✔3✘). Canon keys `reeds*/sluice*/sett*` in `narrative/flavor.md`;
alternates: `takes/c5a-discoveries/`.

  - **How to look LIVE:** DEV → Story → **c5a-discoveries**; walk to the
    weir/woodlot/field-margins — the hint ladder shows in the
    you-are-here card and swaps with the take; keep working the node and
    the found line lands in the log voicing the selected take (future
    latches swap; logged history stays).
  - **In the DEV panel:** Review → Story → **SV1** <!-- dev-tags: kept
    true by the review-link gate -->
  - **Verdict:** _(awaiting your read)_

### HR-20 🔲 [R7 · Phase 2] — the per-grade day-book judge lines (C5a unit 4, ADR-159)

Six lines, one per grade of the locked six-step ladder, replacing the
single "accounts are reckoned" string. **Pick: TAKE C "as the valley
sees it"** (tied 5✔1✘ with B; C wins on TST3 — koku standing IS outside
regard; the counted-twice canon echo redlined). Alternates: A "the
board's arithmetic" (4✔2✘), B "the house as body" (5✔1✘ — a genuinely
close second; read it). Canon keys `judgeLine*` in
`narrative/flavor.md`; alternates: `takes/c5a-judge/`.

  - **How to look LIVE:** DEV → Story → **c5a-judge**; DEV → Rungs → "→
    Phase 2", bank some estate growth, End the season — the day-book's
    judge line voices the selected take at your current grade.
  - **In the DEV panel:** Review → Story → **SV2** <!-- dev-tags: kept
    true by the review-link gate -->
  - **Verdict:** _(awaiting your read)_

### HR-21 🔲 [all rungs · seasons] — the per-season node reads, 16 zones × 6 seasons (C5a unit 5)

Every zone's you-are-here card + arrival line now breathes by season
(05-world: "nodes carry per-season flavor"); the survey SHEET stays
static (a drawn document). SIX bundles, one per season (your
per-season-unit ruling): picks — Winter A (work-first 14✔2✘) · New Year
B (senses 12✔4✘) · Spring B (senses 14✔2✘) · Summer A (work 11✔5✘) · Bon
B (senses 12✔4✘) · Autumn B (senses 11✔5✘); every flagged anchor-span
duplication redlined before landing. Canon keys `node<X>Blurb<Season>`
in `narrative/flavor.md`; alternates: `takes/c5a-nodes-<season>/`
(per-take briefs + scorecards in each bundle.md).

  - **How to look LIVE:** DEV → Story → the **c5a-nodes-<season>**
    entries; open the Map tab and walk a few zones — the you-are-here
    card reads the standing season's take and swaps with the toggle; End
    seasons to walk the year through one node.
  - **In the DEV panel:** Review → Story → **SV3** · **SV4** · **SV5**
    **SV6** · **SV7** · **SV8** <!-- dev-tags: kept true by the
    review-link gate -->
  - **Verdict:** _(awaiting your read — bundle-level verdicts are fine:
    pick per SEASON, never per line)_

### HR-25 🔲 [R7 · story] — the lord unstaged: R7's two {lord} lines (HD-36, ADR-139)

Your HD-36 (a) ruling applied: the two R7 house-standing lines
re-derived so Munemasa is never staged in T0 (canon: a voice through a
wall, never met — his one scene stays T1's capstone). Three blind takes;
**pick: TAKE B "the voice through the wall"** — his own damaged voice
overheard through the shoji, unanswered, never met. The canon lines now
read:

> "The fields keep a man's hours now, and not mine — if mine ever held
> them," comes {lord}'s voice through the shoji of the inner house,
> unanswered; the yard knows whose hours he means.

> "There is rice against winter. There was a saying for that — I had it
> once," {lord} is heard saying to the dark of the inner house, and
> nobody who hears it goes in.

B ties C (6✔) and wins on TST3 — R7's title ("Trusted of the house")
needs the summit's notice, delivered inside the bible's own device,
pre-sounding the voice T1's shoin capstone pays off. Alternates: A "the
word comes down the wall" (relayed via Genemon/Chiyo, 5✔1✘) · C "the
house answers for him" (lordless-institutional, 6✔ — a genuinely close
second; read it). Canon in `narrative/requirements.md`; alternates:
`takes/hd36-lord-unstaged/`.

  - **Taste brief (pass 1):** P3 speaker readable via {tokens} · P9
    recognition follows the labor · P10 only established motifs (shoji,
    inner house, day-book) · P13 diegetic completion lines · V-canon:
    Munemasa unstaged, felt-never-numbered, MC never named/quoted,
    maxims fail upward.
  - **Scorecard (B · canon):** 6✔ · 0✘ · 15— (the granary maxim fails
    on-page — "I had it once" — exactly his register).
  - **Scorecard (A):** 5✔ · 1✘ · 15— — ✘ TST4 [briefed]: the granary
    line lands two inferences from the banked rice and centers the
    carrier.
  - **Scorecard (C):** 6✔ · 0✘ · 15— (withholds the lord's notice — TST3
    tie-break loser, not a defect).
  - **How to look LIVE:** DEV → Story → **hd36-lord-unstaged**; then
    `__qa.toRung('R7')` + `__qa.speed(8)`, farm the paddy / bank rice —
    the completion lines voice the selected take (future emissions only;
    logged history stays).
  - **In the DEV panel:** Review → Story → **SV14** <!-- dev-tags: kept
    true by the review-link gate -->
  - **Verdict:** _(awaiting your read)_

---

> _Open reviews only. Closed reviews graduate to
> [`archive.md`](archive.md). The old **HR-2** cross-cutting item is
> split above into **HR-2A** (market) · **HR-2B** (House-Influence) ·
> **HR-2C** (craft) · **HR-2D** (quests). Two of its surfaces were
> **removed as stale** (no live toggle in `dev.ts`): the **log filter
> bar** (ships as a single rendering, no pick) and the **walkable map**
> (resolved by HR-7, 2026-07-07 — the survey-plan map shipped; losing
> takes stripped). Recent closes: **HR-8/HR-10/HR-12/HR-14/HR-16/HR-17**
> (the storywave ship)._

### HR-27 🔲 [R2+ · estate] — the works discovery chain (estate Phase 1, works-cause, ADR-139/ADR-177)

> ⚠️ **SUPERSEDED by HR-36 (2026-07-12) — do not review the takes
> below.** All three `works-cause` takes were authored BEFORE ADR-185,
> so every one of them is written in the land-as-ledger metaphor that
> the ADR retired — and that the cast sheet already forbade ("he has
> never in his life reached for a metaphor"). Picking among them would
> mean judging against a bar that no longer exists. W2 of the re-voice
> re-authored these five scenes from scratch under the new laws; **HR-36
> is the live review.** The DISCOVERY MECHANISM described below is
> untouched and still correct — it is only the PROSE that was replaced.
> If you'd rather keep one of the old takes, say so and I'll restore it.

FB-338's fix, built: the estate projects are now DISCOVERED, not
spawned. The day-book names a concern → you walk the zone and SEE the
damage (a sighting line lands) → Genemon's beat prices the work → only
then does the ladder show a name, cost, and button. Five new scene-defs
(`works-intro` at the board R2+, `works-u1..u4` pricing beats,
ladder-ordered) + 14 flavor keys (naming lines, sighting lines, the
card's unnamed/named hints, U1's re-sited strings). U1 moves from the
weir screens to **first repairs in the three R1 zones** (gate · bunds ·
woodshed roof); the weir lease stays a NAMED concern — and the weir node
is **locked until the day-book names it** (FB-342's fix, live). **Pick:
TAKE C "the land keeps its own book"** (19✔2✘ — the sighting lines catch
the damage mid-act, which IS the FB-338 answer; naming lines are
location-free; the land-first register matches your c5a-overlays pick.
Redlined per Pass-2: the cold-open "his sill" ambiguity → "the weir";
the kura fullness claim softened). Alternates: A "the ledger's mercy"
(17✔4✘ — the deepest conceit, being entered is being kept; read its
works-u4), B "the household knows" (16✔5✘ — the warmest; the plum dish
and the beam-marks). Canon: `narrative/scenes.md` +
`narrative/flavor.md` (continuous read: `docs/content/t0-story.md`);
alternates + briefs + Pass-1 constraint brief: `takes/works-cause/`.

  - **How to look LIVE:** `?fixture=rung-R2` → move once and return to
    the forecourt — **works-intro** auto-plays (the naming; the weir
    path opens — and the **Works 普請 tab lights**, Schedule A); Works
    reads "go and see them where they stand" with NO buy button; walk
    gate → paddies → woodshed (sighting lines land in Story); the
    **works-u1** beat fires → the ladder inks in "Stem the first rot"
    priced. DEV → Story → **works-cause** swaps every unit live
    (`?story-works-cause=a` boots straight into take A — the ladder
    label flips to "Close the oldest lines"). U2–U4 beats:
    `toRung('R5'/'R6'/'R7')` with the prior stage built.
  - **In the DEV panel:** Review → Story → **SV20** <!-- dev-tags: kept
    true by the review-link gate -->
  - **Verdict:** _(awaiting your read)_

### HR-28 🔲 [cold open · story] — the three intro scene heads (FB-362, ADR-139)

The cold open now splits into one 幕 card per VN scene (FB-362,
`cd10b315`); the three scene heads are new fiction-voiced text, diverged
per ADR-139 (bundle `fb362-intro-titles`, 3 blind takes):

- **Pick: TAKE B "taken · unnamed · entered"** (20✔0✘1—) — dream =
  **what the water takes** · sickroom = **no name to give** · ledger =
  **entered in the book**. Each head names its act's literal on-screen
  event; the ledger head points at the day-book entry the R7
  name-writing pays off.
- Alternates: A "the ground it happens on" (19✔1✘ — place-anchored; ✘
  "the book room" names a place the game doesn't have), C "the counted
  week" (19✔1~ — time-anchored; two clock-shaped heads blur).

  - **How to look LIVE:** new game → play the cold open — the Story view
    now shows three cards with take B's heads. DEV → Story →
    **fb362-intro-titles** swaps takes live;
    `?story-fb362-intro-titles=a|c` boots into an alternate. Old saves
    keep their baked single "— the cold open —" card (TST2).
  - **In the DEV panel:** Review → Story → **SV11** <!-- dev-tags: kept
    true by the review-link gate -->
  - **Verdict:** _(awaiting your read)_

### HR-31 🔲 [all rungs · story] — the open-rest line (FB-402, ADR-139)

Rest is now SITED (FB-402/FB-409): the woodshed-corner lines + the
comfort bonus fire only when resting AT the woodshed; resting anywhere
else emits the new **open-rest** line — diverged per ADR-139 (bundle
`fb402-rest-open`, 3 blind takes):

- **Pick: TAKE C "the tool set down"** (20✔0✘1—) — _"You find a stretch
  of wall out of the wind, set your back to it, and let your arms hang.
  The work will keep. So will you."_ Most location-proof (a wall exists
  on every ground), matches your suggested standing rest, flat
  double-closer in the FB-91 rest register.
- Alternates: A "the body ledger" (19✔1✘ — strong daybook register, but
  lies him down mid-court), B "borrowed ground" (18✔2✘ — the stacked
  bale is zone-specific; the closer swells lyrical).

  - **How to look LIVE:** any save → rest anywhere but the woodshed —
    the Now view shows take C. DEV → Story → **fb402-rest-open** swaps
    takes live for future rests; `?story-fb402-rest-open=a|b` boots into
    an alternate.
  - **In the DEV panel:** Review → Story → **SV12** <!-- dev-tags: kept
    true by the review-link gate -->
  - **Verdict:** _(awaiting your read)_

### HR-29 🔲 [R2+ · works] — Works 普請 tab surface — pick a variant (ADR-075, estate Phase 2)

The projects' new home (Schedule A). All three read the SAME
estateBuild/works chain and drive the real `improve_estate`:

- **Works 普請** (the projects/upgrades surface) — ✅ **all three LIVE in
  the DEV panel**:
  - **Taste brief (pass 1):** P9/TST3 nothing named before its beat
    (unnamed rows stay unruled) · P15 no future-zone previews · P19
    chrome register — tight, ruled, ink tokens only · TST4 the chain's
    position always readable (unnamed → named → priced) · P4/TST2
    signature-gated rebuild, zero idle churn · AC-6 price/gate reads =
    reducer's.
  - [ ] **A — the day-book page** _(self-picked prod default; ships)_ —
    projects as ledger lines: closed entries ruled through in gold, the
    open entry priced with payoff + button, the future faint and
    unruled. The works-cause fiction as chrome.
    - **Scorecard (A):** 19✔ · 2✘ — P6 [blind spot] the price column can
      crowd at 390px (nowrap; watch it); P17 [briefed] closed entries
      rely on strikethrough alone for their explored-state read.
  - [ ] **B — the work-site board** _(built; DEV-only)_ — one site card
    per project, anchored on the zones you walk (門田薪 → 園 → 蔵 → 庭), the
    open site carrying the commissioning.
    - **Scorecard (B):** 16✔ · 5✘ — P6 [briefed] pre-discovery sites
      read as near-empty ghost frames; P15 [blind spot] the future
      sites' zone kanji preview where later works land (the ladder forms
      never leak this); P19 frame-in-frame.
  - [ ] **C — the build ladder (interim)** _(built; DEV-only)_ — the
    pre-ADR-177 tracker shape, kept for live comparison.
    - **Scorecard (C):** 17✔ · 4✘ — the twice-bounced shape (FB-157
      "border soup" lineage): ladder, blurb, payoff, and button stack as
      four unrelated bands.
  - **How to review:** `?fixture=works-u1-priced` → the Works 普請 tab →
    DEV panel → "Works 普請 (projects home)" toggle. The fixture holds U1
    priced-and-affordable so every variant shows its full read (and the
    commissioning actually works). **Phase 3 note:** the buy is now a
    two-step WORK (F3): Commission pays coin + wood, then "Work the
    repairs 普請" at the site (`?fixture=works-u1-underway` boots mid-work
    at the gate). The commissioning log line is mechanical register, not
    diverged fiction — bounce it here if it reads as story.
  - **In the DEV panel:** Review → Variants → **V2** <!-- dev-tags: kept
    true by the review-link gate -->
  - **Verdict:** _(awaiting your read)_

### HR-30 🔲 [R6 · estate] — Estate 家 tab surface (the E1 fold-in) — pick a variant (ADR-075, F5, HR-16)

Estate 家 at R6: the house itself. The E1 okoshi-ezu cutaway FOLDS IN as
the shipped anchor (HR-16's "needs more work" iteration happened here —
the sheet is now state-driven: rooms ink in as they reopen; the freshest
commissioned work wears the gold 新):

- **Estate 家** (the house surface) — ✅ **all three LIVE in the DEV
  panel**:
  - **Taste brief (pass 1):** P9/TST3 rooms appear on their reveal
    beats, never as a menu (locked rooms unnamed everywhere) · TST1 one
    home — the sheet replaces the rooms list, never duplicates it · P14
    the drawing owns the ceremony register · TST4 a caption carries the
    glance-read the drawing can't · TST2 repaint only when the house
    moves (signature-gated).
  - [ ] **A — the house, drawn** _(self-picked prod default; ships)_ —
    the survey sheet as the tab's one anchor (paintSheetA over live
    state), reopened rooms listed in the caption; the influence pane
    sits beneath.
    - **Scorecard (A):** 18✔ · 3✘ — P20 [briefed] the tall sheet
      compresses on a phone (labels go small; the caption is the
      mitigation); TST4 [briefed] shutter marks are a subtle open/shut
      read; P2 [blind spot] the sheet's legend/cartouche idiom is
      prototype-native (shared with map-sheets' brush, but not the app's
      card idiom).
  - [ ] **B — the steward's reckoning** _(built; DEV-only)_ — the rooms
    as day-book lines (open rooms named, shut rooms unnamed silhouettes)
    with the standing as the page's footing. Redlined in Pass 2: locked
    rooms no longer named (P15).
    - **Scorecard (B):** 17✔ · 4✘ — TST1 [blind spot] the koku footing
      duplicates the influence pane's number on the same tab; the
      register overlaps the Works ledger (two book-pages, one app).
  - [ ] **C — the rooms list (interim)** _(built; DEV-only)_ — the
    pre-ADR-177 plain reopened-rooms card.
    - **Scorecard (C):** 15✔ · 4✘ — no anchor; the tab reads as a
      leftover staple (exactly the FB-157 complaint the redesign
      answers).
  - **How to review:** `?fixture=rung-R6` (or R7/wealthy-idler for more
    rooms) → the Estate 家 tab → DEV panel → "Estate 家 (the house)"
    toggle.
  - **In the DEV panel:** Review → Variants → **V3** <!-- dev-tags: kept
    true by the review-link gate -->
  - **Verdict:** _(awaiting your read)_

### HR-32b 🔲 [R2+ · zones] — how a zone ANNOUNCES itself: VN-only, or VN + map-ink (ADR-184)

You asked me to **"diverge and implement both"** — both are in, live,
one click apart.

**How to review (DEV panel → Review → Variants → "Zone announce (reveal
mode)"):**
1. Load the `rung-R2` scenario (DEV → Scenarios), stand at the forecourt
   and haul until you hold 10 mon — Genemon's **`sb-market`** VN fires
   and opens the gate.
2. Watch the **Story log right after the scene closes**, then flip the
   toggle and do the same for the kitchen (forage, then stand at the
   board → O-Hisa's **`sb-cook`**).

| mode | what happens when the VN closes | the case for it |
|---|---|---|
| **VN only** (prod default) | Nothing. The scene said it; the zone is simply on your map now. | One home per reveal (TST1). The VN *is* the ceremony — a line after it is the game explaining a story you just watched. |
| **VN + map-ink** | One narrator line inks the zone in (the node's own map blurb). | The player never guesses state (TST4): the map grew, and the log says so. It is also the shape the rung-reward zones already use. |

I shipped **VN-only** as the default because a second line felt like the
game under-trusting its own scene. Say the word and the ink ships
instead — it is a one-constant flip, no rework.

  - **In the DEV panel:** Review → Variants → **V8** <!-- dev-tags: kept
    true by the review-link gate -->

### HR-33 🔲 [R2–R3 · story] — the four zone-reveal VNs (`zone-reveals` bundle, ADR-139/ADR-184)

Four new side-quest VNs, each of which is now the ONLY way its zone
opens — the gate (`sb-market`), the kitchen threshold (`sb-cook`), the
field margins (`sb-racks`) and Sōan's sickroom (`sb-sickroom`). Three
complete blind takes; **canon is take A**.

**How to review LIVE (DEV panel → Story → bundle `zone-reveals`):** pick
a take, then play to the beat — load `rung-R2`, haul at the board to 10
mon (the gate VN), forage then stand at the board (the kitchen VN); the
margins and sickroom fire at R3 (work the rows; take the night round's
wolf). The switcher swaps the scene body live.

| take | what it commits the story to | scorecard |
|---|---|---|
| **A · the house tells you what it needs** *(canon)* | Every zone opens because the estate has an **open account** and you are the instrument that closes it. Nobody asks how you are; the warmth is that four people bothered to explain their account to you at all. Genemon prices a sack of greens at ten mon so you can be trusted with a purse that isn't yours; Sōan enters you in his book *"the same as the mule."* | 21✔ 0✘ |
| **B · somebody notices you** | Every zone opens because **a person breaks their own protocol** to look at you. Genemon has bought one thing from Yohei in thirty-one years and still has it; O-Hisa crosses a yard she never crosses; Rokusuke has watched where you put your feet for a season; Sōan knows what your ribs were like when they were whole. | 21✔ 0✘ 1— |
| **C · the thing itself is wrong** | Every reveal opens on a **material fact already wrong** — copper that buys nothing, bracken that is poison raw, gnawed rack-cords and a furrow to a hole in the bank, a sleeve bled through twice — and the person arrives second. Best single scene in the bundle (its `sb-racks`). | 19✔ 2✘ (P10 ×2) |

**Why A, and where I'd expect you to overrule me.** These four beats are
the player's only teaching for coin, the pot, the hunt and the wound — A
states the account, so nobody is left guessing (TST4), and it speaks the
register the surrounding canon already speaks (works-intro, sb-lease,
the Terms). **But B is the take that answers your own diagnosis** —
*"the people and the talking is weak as implemented in R1; it's pure
flavor with no gameplay/story purpose"* — because in B the people
**cause** things and have lives that predate you. If you want the estate
to feel peopled rather than administered, B is the pick and I'll swap
canon to it. C I ruled out on P10: it promises a gateyard-sweeping duty
and an overnight ash-steep that exist nowhere in the game (story
promises are contracts) — but its `sb-racks` is the best scene any of
the three wrote, and it can be grafted.

  - **In the DEV panel:** Review → Story → **SV21** <!-- dev-tags: kept
    true by the review-link gate -->

### HR-34 🔲 [R1 · story] — the Terms scene, re-voiced (W1 of the T0 re-voice, ADR-185)

**Your original complaint, fixed.** You flagged "Genemon at the R0
rung-up" — which is this beat, the one that fires at the R0→R1 rung-up.
Canon's Terms speech was six verbless fragments with **"No coin"** — the
most consequential fact in the scene — buried in a subordinate clause,
at the exact moment the player must learn what deal they have just
accepted.

- **Pick: TAKE B "man to man"** — which is **the take you picked live**,
  and a blind fresh-reader paraphrase pass then reached the same verdict
  *independently*, winning on **both** clarity and pull (a rare
  non-trade). Genemon sets the brush down, looks at you (the only man in
  the room who does), and leads with the arithmetic that is the sole
  reason you are standing there. His coldness becomes **candor**.
- **Canon = take B + two transplants from take A**: the brush stalling
  on the wage line, and *"There is no line for where you eat, and none
  for where you sleep. Written out, a man comes to very little."*
- **Authored against w3's new R1** (same day): R1 opens the paddy and
  nothing else — so the Terms promise **no meals and no bed**, and
  Genemon now says it out loud: *"I have no bed for you either. Five
  hands sleep here, and there is no sixth place."* The six-hands
  arithmetic that is his reason for hiring you is the same arithmetic
  that has no room for you.
- **The finding worth your attention:** the *minimum-change* take (C)
  turned out to be the **least clear** of the three, not the safest. The
  blind reader: *"C is the version in which a 15-year-old can finish the
  tutorial not knowing they are working for NOTHING and sleeping
  NOWHERE. In a tutorial, that isn't restraint — it's a bug."* That
  retroactively justifies your best-read-wins rule.
- Alternates: **A** "the book speaks" (the terms read aloud as a ledger
  entry — owns the best passage anyone wrote, but opens on canon's
  hardest line and leaves the no-bed fact to inference) · **C** "minimum
  change" (the rollback path).

  - **How to look LIVE:** new game → play to the R1 rung-up (or DEV →
    Scenarios → `rung-R1`). DEV → Story → **hd38-w1-terms** swaps takes
    live.
  - **The acceptance test is yours:** play R0→R1 and tell me whether the
    original complaint is dead.
  - **In the DEV panel:** Review → Story → **SV15** <!-- dev-tags: kept
    true by the review-link gate -->
  - **Verdict:** _(awaiting your read)_

### HR-35 🔲 [R0 · story] — Intro 1: the game's first choice (W4, ADR-185)

**This was a structural bug, not a prose one** — which is why re-voicing
alone could never have fixed it, and why your "reframe the choice, keep
the mechanics" ruling was the one that mattered.

The dream names **three things**: *one knot, one road, one load*. The
menu then offered **Hold the knot / Strike the list / Take up the load**
— the **road had no option**, and "Strike the list" was not one of the
three things at all. Meanwhile the perk that option grants is *"The
Clear Room — senses sharpened to **the way out**"* — which describes the
road exactly. The game's first choice, which hands out a permanent stat
and a permanent perk, has been one word away from coherent this whole
time.

- **Pick: TAKE C + redlines.** The three options now map one-to-one onto
  the three things the dream actually names, and the labels became
  **body verbs** — **Hold** the knot / **Kick** for the road /
  **Shoulder** the load — so a 14-year-old can see they are choosing
  between the thinker, the runner and the ox *before* they click.
- **The load option failed the what-test in ALL THREE takes** — a hole
  in the original design, not a versioning problem. Its siblings each
  told you what you had permanently become; it handed you a strap and a
  step and let you guess. It now gets its plain "from now on…" sentence
  like the others.
- **Mechanics are byte-identical**, as you ruled: the three ids, both
  stat deltas each, and all three perk lines (name *and* description)
  are untouched. Zero engine change.
- Also fixed: the shared dream line was a garden-path — *"What surfaces
  is counted"* reads "surfaces" as a **noun** on first pass. Now
  *"Whatever surfaces is counted"*.
- Alternates: **A** "three things, one hand" (has a continuity break —
  *"You come out coughing, alive"* resolves the rescue three scenes
  early, in only one of three options) · **B** "the body chooses first"
  (**the best prose in the set — and it loses**: it fails the what-test
  3/3, resolving every option into an abstract noun, "the asking / the
  aim / the carrying", so the player cannot say what their perk *does*).
- **One thing I want from you:** take B wrote *"The head arrives late,
  the way it always will."* It is the best line any of these agents
  produced and it is not in canon. Say the word and I will find it a
  home.

  - **How to look LIVE:** new game → the cold open → act 1. DEV → Story
    → **hd38-w4-intro** swaps takes live.
  - **In the DEV panel:** Review → Story → **SV17** <!-- dev-tags: kept
    true by the review-link gate -->
  - **Verdict:** _(awaiting your read)_

### HR-36 🔲 [R2+ · story] — the works pages, re-voiced (W2, ADR-185) — SUPERSEDES HR-27

**A bug fix, not a taste call.** The shipped works pages ran
wall-to-wall on a land-as-ledger metaphor — *"the land keeps the better
book"*, *"the autumn will inspect the work for us"*, *"mend one and the
water keeps its other appointments"* — from the man your own cast sheet
says **"has never in his life reached for a metaphor."** The build and
the doc disagreed, and the build was wrong. They were also the densest,
hardest-reading text in the tier.

- **Pick: TAKE B "the page he never shows anyone."** It is the only take
  that gives Genemon a *reason* to be doing this. The ruled-off page is
  not a work order — it is thirty-one years of everything he watched
  fail and could not pay to save, kept in his own hand and shown to
  nobody. Handing it to a penniless stranger is a confession he has no
  procedure for and will never name: *"Thirty-one years I have written
  this house's losses on this page, in this hand, and shown it to
  nobody."*
- His *"Do not take my word for any of it. Go and see."* stops being
  procedure and becomes a man who cannot bear to be taken on trust about
  this. And his answer to *why now* is the best line in the batch:
  **"Because there is a man in this yard with two hands who owes nothing
  to anyone else. That is new. The page is not."**
- The blind reader: *"A and C are one man at two volumes. B is a
  different man."* Same shape as W1 — the bolder take won on both axes.

**Two structural bugs the blind read found in ALL THREE takes** (so:
holes in the original design, not versioning):
1. **The no-wage fact lived only inside an OPTIONAL ask.** A player who
   never clicked it was never told they'd be working for nothing. It's
   now in the main speech.
2. **Every take had Genemon call you "Gonbei"** — the name the house
   doesn't write until **R7**. That would have spent the naming payoff
   two rungs early. Redlined out of canon *and* the alternates.

**Plus the continuity bug w3 and I both caught:** `works-intro` said the
woodshed roof leaks *"over where you sleep."* Under ADR-184 you have
**no bed** — the woodshed isn't yours until R4. Genemon now names it as
a failing building of the house, which is what it is.

- Grafted from the losers: take A's clearest explanation (*"Because all
  three are the same fault: water where it should not be"*) and take C's
  best epigram (*"Rot shows better by daylight"*).
- Alternates: **A** "the land is not a metaphor" (clearest, flattest —
  and it commits the worst violation in the batch: *"Your face says the
  page did not lie to you"* gives the **book** intent) · **C** "minimum
  change" (hallucinated a callback that exists nowhere).

  - **How to look LIVE:** reach R2+ and cross the forecourt (or DEV →
    Scenarios). DEV → Story → **hd38-w2-works** swaps takes live.
  - **In the DEV panel:** Review → Story → **SV16** <!-- dev-tags: kept
    true by the review-link gate -->
  - **Verdict:** _(awaiting your read)_

### HR-39 🔲 [R4 · story] — the slept-day line (`adr187-sleep` bundle, ADR-139/ADR-187)

> *(Renumbered HR-36 → HR-39 by w6, 2026-07-12: this item and the
> works-pages re-voice were filed under the same id by concurrent
> agents. HR-36 landed first (01:56 vs 02:09), so this one moved. Its
> content is untouched; only the id changed. Note the authoring commit
> `b92b859c` and its bundle still cite HR-36 — this line is the
> crosswalk.)*

The one line the new **Sleep till morning** verb emits (ADR-187 — the
day-skip you ruled: option D alone, at your corner, R4+). It fires
**every** press, and a player waiting for a market day may press it
three times in a row — so it has to survive repetition, which is the one
thing a single read cannot tell you. That is the acceptance test.

The line must carry the whole price **without a number in it**: the day
is gone, the house ate anyway, you were not up for the pot (so you wake
hungrier), and sleeping gave the body nothing back.

- **Pick: TAKE C** — *"the coat keeps its nail"*. It is the only take
  whose fiction **causes** the mechanic (TST3): sleep exists at R4 and
  nowhere else because the corner is the only bed in the game, and C is
  built from the exact three props the R4 ceremony line grants you — *"a
  mat, a bowl, a nail for the coat: yours"* (ADR-184). The coat that
  never leaves its nail **is** the forfeited day; the bowl that stays
  dry **is** the pot you slept through. The corner you finally earned,
  spent on nothing.

  > The coat stays on its nail; you lie down on the mat that is yours,
  > in the corner that is yours, and the day's work goes on outside
  > without you. You wake at dawn with the ache you lay down with. The
  > bowl by your head is dry: the house ate at its hours, as it always
  > does, and you rise hungrier than you lay down.

- Alternates: **A** *"the day spent like coin"* (the deliberate spender
  — a day entered in the debit column of his own life; strong ledger
  register, but it says the design out loud: *"spend it the way you
  would spend a coin — on a thing you want more than the hours"*) ·
  **B** *"the day heard from sleep"* (the estate's working day as the
  sound-track of your absence — **the best prose in the bundle**, and
  the worst fit: it never once touches the bed, and the bed is the
  entire reason this verb exists).

  - **How to look LIVE:** DEV → Scenarios → `rung-R4` → walk to the
    woodshed → **Sleep till morning** (hover it first — the forecast
    reads the exact price). DEV → Story → **adr187-sleep** swaps takes
    live.
  - **The thing I could not test for you:** press it three times running
    and see whether the line wears out. If it does, the fix is a shorter
    canon line, not a different take.
  - **(2026-07-13, session 188):** the P9 ✘ below is now CLOSED — the
    sleep-announce beat is built and live (see **HR-40**, the
    `sleep-announce` bundle).

  - **Taste scorecard (ADR-135) — PASS 2 ONLY, and that is a miss I am
    owning.** The two-pass flow wants a constraint brief BEFORE the
    build; I did not run one, and retro-writing a "before" brief would
    be a lie. So this is the after-scorecard alone, on the surface as
    shipped (the button, its hover forecast, the line's routing): **14 ✔
    · 1 ✘ · 6 —**.
    - ✔ **P1/P2 (one home, one primitive):** `sleep` has exactly one
      entry point — the meta-verb row, at the corner. It reuses the
      existing verb-button + `title` idiom that Rest uses (same keyed
      row, patched not rebuilt); no new control was forked.
    - ✔ **P3/P16 (voice at the source, routed by weight):** the line is
      core-emitted with `voice: narrator` and a `flavor.sleep`
      descriptor, and lands **fleeting → the Now channel** — exactly
      where Rest's line lands, never cluttering the permanent channels.
      Verified live, not assumed.
    - ✔ **P10 (story promises are contracts):** the strongest mark on
      the card. The R4 ceremony promised *"a mat, a bowl, a nail for the
      coat"* — and canon take C is built from those three objects, so
      the promise is what the mechanic is made of.
    - ✔ **P17 (controls advertise their state):** the hover reads the
      exact price off the same selector the reducer spends (AC-6). A
      day-skip is instant and irreversible, so legibility is the only
      safety it gets — and it is honest.
    - ✘ **P9 (discover, don't spawn) — [blind spot]. NOTHING TELLS THE
      PLAYER THE VERB EXISTS.** The corner is granted in the R4 beat,
      and the button quietly appears in the verb row from then on. A
      player who never idles at the woodshed may never learn they can
      end a day at all — which would leave FB-408's itch alive for the
      very player this shipped for. It is *visible* (it sits under "Rest
      a moment" wherever you already look), just **unannounced**. The
      fix is one clause in a beat the human owns, so I am **not**
      writing it unilaterally. **RULED (2026-07-12): its own tiny beat
      at the corner** — a one-off moment the first time you stand in
      your corner after R4, so the verb is discovered in place rather
      than promised in advance. **Not built yet** (it is fiction-voiced
      → a 3-take diverge + a first-visit trigger/flag); recorded on
      ADR-187 as the follow-up, and it is the named next task.
    - — **P7 · P8 · P11 · P13 · P14 · P21** — not applicable (no type
      scaling, no crash path, no VN, no reward box, no full-screen
      reveal, no app-info surface).
  - **In the DEV panel:** Review → Story → **SV0** <!-- dev-tags: kept
    true by the review-link gate -->
  - **Verdict:** _(awaiting your read)_

### HR-40 🔲 [R4 · story] — the sleep-announce beat (`sleep-announce` bundle, ADR-139/ADR-187 follow-up)

The beat you ruled (2026-07-12, re-confirmed 2026-07-13: "(a) narration
beat"): a **one-off log line the first time you stand in your woodshed
corner at R4+**, so the Sleep verb is **discovered in place** instead of
shipping unannounced. Closes the **P9 ✘ on HR-39's scorecard** (the
"nothing tells the player the verb exists" blind spot). The trigger is
`canSleep` itself (announced == available — the beat can never promise a
verb the row does not offer), latched once, fired on ARRIVAL, never the
promotion tick. PH6-proven live: loaded `rung-R4`, walked to the
woodshed, the line landed exactly once with the Sleep button in the same
view; a re-visit stays silent.

- **Taste brief (pass 1, before authoring):** P9 fires standing in the
  room, never at the grant · P10 the button is live in the same view
  (`canSleep` IS the trigger) · P13 no button name, no mechanics voice ·
  P16 narration channel · P2/P3 existing idioms only (seen-flag latch,
  FLAVOR key, narrator voice, contentKey) · TST3 the bed causes the
  verb; mat/bowl/nail canon respected · derived: the line must read true
  at ANY tick of day (first arrival can be morning).

- **Pick: TAKE A** — *"the corner keeps your hours"* (ownership
  register: the night becomes property).

  > The house keeps its hours; this corner keeps yours. The day ends
  > when you lie down on your own mat, and not a breath before.

  The only take that is simultaneously **legible** (the verb is
  unmistakable), **time-proof** (asserts no hour), and at your ruled
  weight ("a tiny beat"). "The house keeps its hours" quietly
  foreshadows the slept-day line's "the house ate at its hours" without
  stealing it.

- Alternates: **B** *"the house's indifference"* (negative space — no
  summons will cross the yard; the most atmospheric and the most oblique
  — the exact "player still does not learn the verb" risk) · **C** *"the
  body meets the bed"* (fatigue meeting furniture; lands the verb
  clearly but at twice the ruled weight — kept for a read that wants the
  beat to breathe).

- **Scorecard (A):** 20✔ · 0✘ · 1—
- **Scorecard (B):** 19✔ · 1✘ · 1—
  - ✘ [blind spot] "Dusk settles" asserted an hour but the beat fires on
    first arrival (can be morning); **fixed in Pass 2** (future tense).
    Residual borderline ✔ on P9 obliqueness.
- **Scorecard (C):** 19✔ · 1✘ · 1—
  - ✘ [briefed] weight — ~2× the ruled "tiny beat"; purple opener
    trimmed in Pass 2, residual length kept as the take's character.

- **How to look LIVE:** DEV → Scenarios → `rung-R4` → walk to the
  woodshed — the line lands in the log on arrival (once, ever; walk away
  and back to confirm the silence). DEV → Story → **sleep-announce**
  swaps takes live — reload the fixture (or `rung-R3` → climb) to replay
  the first-arrival moment under a different take.
- **The fallback you approved:** if all three read as tutorial on your
  screen, the honest verdict is *ship no beat* — say so and the trigger
  comes out clean (one flag, no state migration).
- **Verdict:** _(awaiting your read)_

  - **In the DEV panel:** Review → Story → **SV19** <!-- dev-tags: kept
    true by the review-link gate -->

### HR-37 🔲 [R1–R7 · story] — the MC's inner line (W5, ADR-185 D3)

**The change that alters who your protagonist is.** He had no inner
voice at all — a camera. He now has eight interior lines across the
whole tier, sparse exactly as you ruled: many scenes carry none, and the
empty scenes were argued for as hard as the written ones.

- **Pick: TAKE C "the body knows and the head does not"** — a man
  estranged from his own hands. He ties knots nobody taught him; he sets
  a load exactly right; the head arrives afterwards and finds the work
  already done by a man it cannot name. Blind reader: *"A is a man, but
  a narrow one. B is a device — its through-line is a null act. **C is a
  person**, and the one I'd follow ten hours."*
- **It produced a rule I want in canon, and I'd like your blessing on
  it:**
  > **The hands may testify; only the dream may translate.**

  That is your never-memory bound restated so an author can actually
  apply it. Every C line hands the body a capability and then *refuses
  the account* — so it **feeds** the dream rather than pre-spending it,
  which was the exact risk you were protecting against.
- **Three grafts from the losers:** take A's opener at R1 (*"Six hands
  wanted. Five sleep here. You are the sixth, and there is no sixth
  place — the sum was short before you stood in this kitchen."*) · take
  B's R4 line, the only one in any take where he **acts against his own
  interest** (*"He had taken the loss off your name. Two words put it
  back. There is no wage for it to come out of, and you said them
  anyway."*) · and C's own R3 line **cut**, because R3 already carries
  the model line.
- The close, at the naming: *"The book has your hands in it: the loads,
  the counts that came out even, the night at the sill. It has never had
  anything else of you. Neither have you."*

**Four bugs these takes found in the shipped corpus** (one fixed, three
are findings for you):

1. ✅ **FIXED — `ask r7-what-changes` narrated the MC's interior in THIRD
   person** (*"The question costs **him** something to ask"*). A direct
   §0.5.8 violation, in canon, locked the same morning we locked the
   law.
2. 🔲 **The Count's only stated price is behind an OPTIONAL click.** A
   player who never opens `r5-accused` stands accused in the middle of
   the floor all night and is charged nothing.
3. 🔲 **Pre-R7 scenes keep saying "against your name"** — the house
   doesn't write him one until R7. Same class as the "Gonbei" bug W2
   fixed.
4. 🔲 **Intro 2's *"What name did I give? When they pulled me out."*** is
   the first question he ever asks, it is about himself, and it is
   completely unpriced.

  - **How to look LIVE:** just play — these are ordinary narration in
    their scenes. R1, R4 (both halves), R6, R7, the Count's resolution,
    the grove, the sickroom.
  - **NOT a DEV toggle, and here's why:** the other waves replaced whole
    scenes, so their alternates swap live. W5 *inserts* lines into eight
    different scenes — a "take" is a set of insertions, not a scene, and
    wiring it as a swap would mean forking every host scene. The two
    not-picked takes are archived in full at
    [`project/brainstorms/2026-07-12-hd38-w5-interiority-takes.md`](../brainstorms/2026-07-12-hd38-w5-interiority-takes.md).
  - **Verdict:** _(awaiting your read)_

### HR-38 🔲 [whole tier · story] — the full sweep, and the seam question (W6, ADR-185)

The close-out you asked for: *"worst-first, **then a full sweep**"* — a
cold read of the whole regenerated tier, front to back, by a reader who
had never seen it.

**The question that mattered was the seam**, not the redline list. ~40%
of T0 was rewritten yesterday and ~60% was not. **A fresh reader could
see the join — and it was not where I expected.**

> *"Character voice does NOT seam. Genemon, Kihei, Sōan, O-Hisa and
> Rokusuke are consistent across touched and untouched scenes. **The
> drift is entirely in the connective tissue.**"*

Specifically: **re-voiced scenes close on an object; untouched scenes
close on an abstraction.** R1 ends on *"The wage is the shortest line on
the page"*; `nengu` ended on *"You are learning the house's true size by
what it will let itself be seen without."* Read one straight into the
other and the gear-change is audible. That's a useful, generalizable
finding about this game's prose, and it's now the sweep's redline rule.

**The worst scene in the tier was one I never touched — and it's a major
beat.** `nengu-autumn-frame`, the annual tax reckoning. A 14-year-old
finishes it **not knowing what happened**: the word "nengu" appears only
in a section heading the player never sees, and the scene never says
what is owed or to whom. Worse, **it contradicts its own R7 reward
line**, which claims *"the reckoning read out, the gap named plainly and
once"* — while the scene insists nobody says it aloud. Genemon now names
it once, plainly (*"the land tax, owed to the lord in rice"*), and then
the room goes still exactly as before. The WHY stays hidden; the WHAT no
longer does.

**Twelve redlines applied**, including two in text *I* shipped yesterday
— my own R1 closer had a pronoun collision (*"a man"* = you, *"him"* =
Genemon), which is exactly the kind of thing the author cannot see and a
cold reader catches instantly.

**A surviving Genemon metaphor**, found at last: *"a man who counts
before he lifts keeps his feet under him."* From the man who has never
in his life reached for one. Now literal.

**The `r7-dream` call — I want your eye on this one.** The reader
flagged the whole scene as a person violation (it narrates *"his straw
coat… He carries it in"* and tags the MC as `Gonbei:`). I
**half-agreed**: the *waking* half was a genuine slip and is now second
person — but I kept the **dream itself** in third person, because the
distance is the point (he does not recognise himself), and earned it
with a cue line the reader proposed:

> **"The book has a name in it now. The dream does not use it."**

If you'd rather the dream be "you" throughout, say so and I'll convert
it.

**The calibration set passed, and I touched almost nothing in it** (your
no-silent-edits rule): the five season turns are called *"the cleanest
prose in the file"*. Two ambient lines were redlined and both are named
here: Sōan's *"The house physics its own"* → *"doctors"* ("physics" as a
verb is 18th-century English), and Iori's *"Two bowls, one mouth"* → a
plain sentence. Nothing else in the U9 pool was altered.

  - **The reader's verdict:** *"Reading as a 14-year-old… I was never
    bored."* Best passage in the tier: **`count` → `count-resolve`** —
    *"This is the law executed perfectly, and it should be the reference
    the rest of the tier is tuned against."*
  - **Verdict:** _(awaiting your read)_
