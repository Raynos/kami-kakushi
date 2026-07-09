# Reviews (HR-items)

Things needing a human's judgment an automated check can't make — playtest feel,
look, tone, pacing. IDs `HR-1…HR-n`, never reused. Status: 🔲 open · ⏳ waiting on
Claude prep · ✅ done.

> **Organised by RUNG** (2026-07-09) — each item sits under the rung where you
> first meet the surface, so the queue tracks a rung-by-rung QA of the live
> v0.4.0 build. Cross-cutting surfaces (present across many rungs) sit in their
> own section at the end. Each item keeps its stable `HR-n` id + a `[rung]` tag.

---

<!-- Format:
### HR-1 🔲 [rung] — {what to review}
  - **Asking for:** {the specific verdict needed}
  - **How to look:** {dev URL / steps to reproduce}
  - **Taste brief (pass 1):** {surface/feature items — the pre-build constraint
    lines per applicable taste.md principle (FB-10, ADR-135)}
  - **Scorecard:** N✔ · N✘ · N— {post-build 21-walk verdict, per variant}
  - **Verdict:** {filled in by the human}
-->

## ▸ The whole arc — play it through

### HR-1 🔲 [R0 → R7] — the live v0.4.0 T0: fun, pacing & look

The storywave rewrite is **live (v0.4.0)** — this is the taste call on the WHOLE
new T0, played through. (Supersedes the old v0.3 MS0–MS4 framing; that build is
git history.)

  - **Asking for:** the fun & visual verdict on the full storywave T0 —
    - does the **cold open** hook, and the **R0→R7 climb** pace well across the
      **six-season year** (Winter → New Year → Spring → Summer → Bon → Autumn)?
    - do the **kura/rice economy** + the **day-wage in mon** read clearly?
    - do the **two body economies** land — a hurt/hungry man works worse, and a
      lost fight puts you on the **sickroom** pallet?
    - do the **season-exit beats** + the **Autumn nengu reckoning** feel earned?
    - does it all look **intentional** (Andon Steel), never AI-slop? Anything
      that breaks the spell.
  - **How to look:** `pnpm run dev` (use **`?dev=no`** for the true player layout).
    - `__qa.speed(8)` to grind fast · `__qa.toRung('R3')` etc. to jump · the
      season wheel advances by hand at each season-exit.
    - Pacing is **LIQUID** (ADR-059) — tell me to nudge any rung; a full-arc e2e
      proves the climb closes under real play.
  - **Verdict:** _(awaiting the human)_

## ▸ R3 · combat opens

### HR-5 🔲 [R3] — Bestiary panel (combat field-guide) — pick a variant (ADR-075)

The **Bestiary** reveals at R3 (Combat tab): a faced foe shows its kanji seal, its
**tell** (fast / evasive / heavy / unerring), a **win-rate forecast**, and where it
haunts; an un-faced foe stays **fogged** (scout-by-fighting). Three working takes
live behind the DEV toggle ("VARIANT · Bestiary"):

  - [ ] **A — field-guide cards** _(self-picked default; shipped)_
    - one woodblock `.frame` card per foe: name + seal, a win-rate pip
      (◆ Steady/Even/Risky), the tell, the node it haunts; unfaced = "Not yet
      faced". Calmest/most legible — reuses the combat-tab foe-row chrome.
  - [ ] **B — danger ledger** _(built; DEV-only)_
    - a ranked ink table (危険帳), foes easiest→deadliest, each a single
      **continuous danger-gauge** (A19) that fills + heats as odds worsen;
      unfaced foes hatched/silhouetted. Most at-a-glance threat read.
  - [ ] **C — 図鑑 scroll** _(built; DEV-only)_
    - diegetic entries: a kanji **portrait** that inks in once faced (a faint ？
      before), field-note prose + tell/odds beneath; unfaced reads as a rumour,
      not a stat-line. Most in-world, least tabular.

  - **Asking for:** which take ships (I self-picked **A**), or a tune.
  - **How to look:** `pnpm run dev` → reach R3 (`__qa.toRung('R3')`) → **Combat**
    tab → toggle "VARIANT · Bestiary" A/B/C; fight a foe to see an entry ink in.
  - _a11y: A ships legible (pip hue never the only signal). B/C re-checked for WCAG
    if picked (B's beni/ochre fills on washi are the ones to watch)._
  - **Verdict:** _(awaiting the human — per variant, via the live toggle)_

## ▸ R5 · a home of your own

### HR-6 🔲 [R5] — home / Inventory panel — pick a variant (ADR-111, ADR-075)

The deep-housing pass shipped a home / belongings / comfort surface (Inventory
tab); the owed diverge is **built** — three working variants behind the DEV toggle,
each reading the same home data through the reducer's selectors (every buy wired to
the real `buy_belonging` intent):

  - [ ] **A · functional list** _(current default)_
    - inked belonging rows + comfort-in-effect tally + a "Settle your corner"
      acquire list. The calm default.
  - [ ] **B · 一間 room cutaway**
    - a diegetic woodblock room; belongings sit **in situ** (bowl on the mat,
      futon over the straw, hearth in the floor); acquire list = "what the room
      still lacks."
  - [ ] **C · 持ち物帳 possessions ledger**
    - a household register: owned pieces as ruled ledger lines with marginal
      comfort notes, a 合計 foot, buyables as 未入 lines you ink in.

  - **Asking for:** pick A/B/C for prod (then I strip the other two). B/C are the
    bolder diegetic bets; A is the calm default.
  - **How to look:** `pnpm run dev` → **Inventory** tab → DEV panel → toggle the
    Home/Inventory variant. All three work live.
  - **Verdict:** _(awaiting your pick)_

## ▸ R7 · Phase 2 — the estate stands

### HR-9 🔲 [R7] — Estate SECTION redesign — pick a variant (FB-157, ADR-075)

The estate section (the Estate tab's improve + house-rooms cards) was called
"border soup"; three takes ship behind the DEV toggle, each driving the real
`improve_estate` intent + live stage/coin/rooms data:

  - [ ] **A · quiet sections** _(default, self-picked)_ — the de-framed key-dim
    sections the FB-157 quick-fix shipped.
  - [ ] **B · ledger strip** — one dense ledger row (stage ··· dotted leader ···
    Improve), payoff beneath, opened rooms as gold kanji chips.
  - [ ] **C · bimetal plaque** — a centred engraved plaque: stage in gold serif,
    payoff etched silver, rooms as a mini-plaque rail.

  - **Asking for:** which of A/B/C ships (or a tune).
  - **How to look:** `pnpm run dev` → **Estate 家** tab → DEV → Variants →
    "Estate section (FB-157)"; or `?estate-section=estate-b` / `estate-c`.
  - **Verdict:** _(awaiting the human — per variant, via the live toggle)_

### HR-11 🔲 [R7] — Build-progress tracker — pick a variant (ADR-145, ADR-075)

The staged E0→E1 build has a **tracker read** inside the Estate tab's improve card;
all three re-present the SAME pure-core `estateBuild` selector (AC-6 — the shown
distance can't lie).

  - **Taste brief (pass 1):** P1 the tracker EXTENDS the improve card (no second
    home; the CTA stays put) · P2 reuse frame/meter/gold idioms · P4/P5 keyed rows
    patched in place, card never resizes · P15/TST3 locked future stages stay
    UNNAMED ("the works continue") · P19/P20 chrome register, plain numbers · TST4
    gate distance readable at a glance.
  - [ ] **A — ladder rows** _(self-picked default; ships)_ — one compact row per
    stage: built ◆ gold · next ▹ with a standing gauge · locked ▢ unnamed.
    - **Scorecard (A):** 19✔ · 0✘ · 2—
  - [ ] **B — milestone rail** _(built; DEV-only)_ — a horizontal 4-pip rail, the
    gold thread filling toward the next pip; next-stage line beneath.
    - **Scorecard (B):** 18✔ · 1✘ · 2— — ✘P15 [briefed]: pips reveal the total
      stage COUNT even while locked (names hidden via hover-title only).
  - [ ] **C — ledger entries** _(built; DEV-only)_ — built stages as closed
    "Entered:" lines, the next as an open entry with a dotted-leader "wants" line;
    locked stages absent entirely.
    - **Scorecard (C):** 19✔ · 0✘ · 2— — strictest no-spoiler; boldest register.

  - **Asking for:** which of A/B/C ships (or a tune).
  - **How to look:** `pnpm run dev` → **Estate 家** tab → DEV → Variants → "Build
    tracker (ADR-145)". NOTE: it renders inside the DEFAULT estate section (HR-9
    variant A); pick that surface first if you want them merged.
  - **Verdict:** _(awaiting the human — per variant, via the live toggle)_

## ▸ Cross-cutting surfaces (present across many rungs)

### HR-2 🔲 [various] — UI-variant surfaces — pick each LIVE in the DEV panel (ADR-075)

Every diverged surface ships **2–3 working variants**, switchable live in the DEV
panel's **Variants** tab (reviewed by toggling, not screenshots). The agent
self-picks a default (always **A**); you confirm/override per surface. Grouped by
the rung you first meet each surface:

  - **[R0, always on] Log filter bar** — the log's bottom channel filter
    (Story · Work · Combat · Progress · All; default **Story**):
    - [ ] **A — bottom tabs** _(default)_ · [ ] **B — toggle chips** · [ ] **C —
      segmented control** _(B/C DEV-only)_. Mapping unit-tested (`log-filter.test.ts`).
  - **[~R2] Walkable map** (Estate 地図 — the spatial spine):
    - [ ] **A — "you are here + paths list"** _(default; shipped)_ — you-are-here
      card + a plain "Paths lead to →" move list, danger ⚠ + conditioning lock
      inline. Calmest.
    - [ ] **B — 絵地図 estate schematic** _(DEV-only)_ — revealed nodes in columns
      by distance from the kura, you-are-here gold, "Walk here →" neighbours.
    - [ ] **C — 道中記 traveller's ledger** _(DEV-only)_ — each path a row showing
      the destination + what awaits (⛏ labours · ⚔ foes · ⚠ danger). Densest.
  - **[R4] Craft panel** (loot→craft the woodlot axe):
    - [ ] **A — smith's work-order checklist** _(default; shipped)_ — have/need
      rows + one Forge button disabled-with-its-reason until met.
    - [ ] **B — the smith's measures** _(DEV-only)_ — a continuous ink fill-gauge
      per material (A19), tabular have/need beside it.
    - [ ] **C — what the axe waits on** _(DEV-only)_ — each material as the part it
      becomes, a 整/未 verdict at the foot.
  - **[R4] Travelling market** (the pedlar's wares — a deliberate MINORITY lane,
    ADR-008):
    - [ ] **A — price-button list** _(default)_ — flat name + `{n} koku` rows.
    - [ ] **B — 品書 posted price-board** _(built)_ — justified ledger lines,
      dotted leaders, 求/尽 verbs.
    - [ ] **C — pedlar's ground-cloth** _(built)_ — good-emoji + "take 取", stock
      as shortening ochre ink. Most diegetic, busiest.
  - **[R4] Quests tab** (用):
    - [ ] **A — per-quest woodblock cards** _(default)_ — title + kind tag,
      blurb, ☑/☐ deed checklist, reward, "Take this on".
    - [ ] **B — 高札場 notice-board** _(built)_ — commission bills, a kind stamp
      + one continuous "deeds answered" stroke (A19).
    - [ ] **C — 用帳 steward's field-ledger** _(built)_ — one aligned row per
      commission, tabular koku column, a 合計 foot.
  - **[R7] House-Influence panel** (the 家威 grade):
    - [ ] **A — continuous ink grade-bar** _(default; a11y-100, shipped)_.
    - [ ] **B — segmented 3-band boxes** (Good 良 / Great 優 / Excellent 秀).
    - [ ] **C — standing marks** — ◆◇ filling toward Excellent.

  - **Asking for:** per surface, tick the variant you want as prod (or note a
    tune). The agent strips the alternates on your pick — zero prod flag-debt.
  - **How to look:** `pnpm run dev` → DEV panel (bottom-right) → **Variants** tab →
    toggle each surface. All render Andon-Steel-native (M6 sweep, 2026-07-06).
  - _a11y: each surface's A ships a11y-100; B/C re-checked for WCAG on pick._
  - **Verdict:** _(awaiting the human — per surface, via the live toggle)_

---

> _Open reviews only. Closed reviews graduate to [`archive.md`](archive.md)
> (Reviews section) — recently **HR-8/HR-12/HR-14/HR-16/HR-17** (the storywave
> ship) and **HR-10** (Phase-2 build beats — superseded by the storywave rewrite,
> 2026-07-09). Older: **HR-4** → ADR-076…079; **HR-3** folded into HR-2 (ADR-075)._
