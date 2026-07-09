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

---

> _Open reviews only. Closed reviews graduate to [`archive.md`](archive.md). The
> old **HR-2** cross-cutting item is split above into **HR-2A** (market) · **HR-2B**
> (House-Influence) · **HR-2C** (craft) · **HR-2D** (quests). Two of its surfaces
> were **removed as stale** (no live toggle in `dev.ts`): the **log filter bar**
> (ships as a single rendering, no pick) and the **walkable map** (resolved by
> HR-7, 2026-07-07 — the survey-plan map shipped; losing takes stripped). Recent
> closes: **HR-8/HR-10/HR-12/HR-14/HR-16/HR-17** (the storywave ship)._
