# Reviews (HR-items)

Things needing a human's judgment that an automated check can't make — playtest feel, look, tone,
pacing. IDs `HR-1…HR-n`, never reused. Status: 🔲 open · ⏳ waiting on Claude prep · ✅ done.

---

<!-- Format:
### HR-1 🔲 — {what to review}
- **Asking for:** {the specific verdict needed}
- **How to look:** {dev URL / screenshot / steps to reproduce}
- **Taste brief (pass 1):** {mandatory for surface/feature HR-items — the pre-build
  constraint lines per applicable taste.md principle (FB-10, ADR-135)}
- **Scorecard:** N✔ · N✘ · N— {mandatory — the post-build 21-walk verdict, per variant
  in a diverge; ✘ lines below, each tagged [briefed] or [blind spot]}
- **Verdict:** {filled in by the human}
-->

### HR-1 🔲 — the **v0.3 T0 MS0–MS4 demo**: fun, pacing & look (the human play/taste call)

> **Updated 2026-06-29 (overnight) from the MS0–MS2 slice → the whole T0 (MS0–MS4).** v0.3 built the macro spine
> (which now CLOSES) + the T0-M4 breadth. This is the taste call on the full T0 arc.

- **Asking for:** the **fun & visual-taste verdict** on the full T0 experience — does the **cold-open hook** land
  (note: the battery flagged it as over-teaching and the agent **applied a fix** — Genemon now greets with only
  **greet + the stakes** on wake, and the koku-teaching + promise land *after* your first rake (reveal-as-plot);
  see the refreshed `v03-gallery/01-cold-open-genemon.png` — confirm the new sequencing reads right or tune
  further, HR-4#4); is the labour→wolf→combat→**spine→ascension**→breadth arc paced and fun; does the **BIG T0→T1
  ascension** land as a payoff (the ceremony seal now sits on a proper scrim — `v03-gallery/04-ascension-ceremony.png`);
  do the breadth beats (quest, craft, walkable map, market) add fun or chrome; does it all look like an intentional
  woodblock game (not AI-slop)? Anything that breaks the spell.
- **The arc to play:** cold open (Genemon onboarding) → rake → labour up the **R0→R7** ladder → the humbling
  grain-store wolf → combat (HP **carries** + heals by **eating**; stances trade; **loot→craft** the woodlot axe);
  → **Phase 2 opens at R7**: your estate deeds bank into the live **House-Influence 家威** pillar; the **season
  judges** your high-water; reach **Excellent** → the **manual Ascend** → the T0→T1 ceremony. Plus the **Quests**
  tab (drive off the crop-raiders), the tiny **market**, and the walkable **Estate 地図** map.
- **How to look — `pnpm run dev`, then in the browser console use the DEV tools** (DEV-only, stripped from prod):
  - `__qa.speed(8)` — run the auto-loop 8× to grind fast. `__qa.auto('farm_paddy')` / `__qa.autoCombat('monkey')`
    set an auto-target.
  - `__qa.jumpToPhase2()` — jump to the R7 capstone (the live macro spine, Phase 2 open).
  - `__qa.jumpToAscension()` — jump to Estate **Excellent**, the **Ascend** button live (click it for the ceremony).
  - `__qa.toRung('R3')` — fast-forward via real intents to a rung; `__qa.faceWolf()` the humbling fight.
  - **⏱ Pacing note (MS2·8, NEW):** the DEMO/REAL fork is **retired** — the build now runs at the **real** pace
    (R0 ≈ **5-min** cold-open of raking, the climb rungs ≈ **10–15 min** each; the full T0 ladder ≈ 1.5–2 h).
    So **use `__qa.speed(8)`** (or the teleports) to review without real-time grinding. The numbers are **liquid
    (ADR-059)** — tell me to nudge any rung if the feel is off. (An end-to-end test proves the whole arc closes
    under real play: `src/core/t0-arc.test.ts`.)
- **Galleries to skim:** **`audit/screens/v03-gallery/` (the curated 8-shot v0.3 tour — START HERE;** cold-open →
  live spine → ascension-ready → the ceremony → quests → combat+craft → market → map; shots 01 & 04 re-captured
  post-fix). Plus `audit/screens/breadth/` (Genemon onboarding, craft panel, Quests tab),
  `audit/screens/diverge-influence/` (the live spine + ascension), `audit/screens/diverge-map/` (the walkable map).
  The fidelity **battery** report (`audit/reports/2026-06-29-v03-fidelity-battery.md`) + the roadmap-respect report
  are the agent's self-vetting; this is the taste call they inform but can't replace.
- **Known, flagged for your call:** the cold-open sequencing (now re-sequenced — confirm or tune, HR-4#4); the
  DEMO/REAL pacing fork is now **RETIRED** (MS2·8 — HR-4#2 closed; the real ~5-min/~10–15-min pace is liquid, confirm
  the feel by playtest); the **UI-variant review** is now **HR-2** (each variant its own line item, reviewed live
  in the DEV panel — ADR-075). The full battery judgment queue is **HR-4** (design/taste calls).
- **⚠ a11y contrast darkening (confirm or tune the shades):** a Lighthouse audit found the new v0.3 panels at
  **a11y 95** — 3 text colours failed WCAG AA contrast on the washi-shade panels (the muted market-grant text, the
  vermilion **家威** kanji at 3.2:1, and the gold **"Excellent 秀"** grade at 2.2:1). I **darkened just those text
  colours** to in-palette deeper tones (→ **a11y 100**, the v0.2 standard); the grade-bar fill stays bright gold.
  These touch hues you saw in the **HR-2** diverge — tell me if you want them lighter (and I'll find another way to
  hit AA, e.g. a darker panel bg) or they're fine as-is. The HR-2 grade shots (`v03-qa-sweep/10–12`) are **re-captured**
  to the new colours; the curated `v03-gallery/` tour shots predate it (cosmetic only — you'll see the live build in play).
- **Verdict:** _(awaiting the human)_

### HR-2 🔲 — UI variants (review each LIVE in the DEV panel — ADR-075)

> **New process (ADR-075, supersedes the old HR-2/HR-3 single-pick).** Every diverged surface ships **FULL 2–3 working
> variants**, switchable live in the **DEV panel**; **each variant is its own line item below**, reviewed by
> toggling it in the running build (not screenshots). ✅ The **DEV panel is BUILT** (v0.3.1 Step 1) — `pnpm run dev`
> and it sits top-right with a **VARIANT** section per surface; **House-Influence A/B/C are LIVE now**. The
> craft / market / quests variants land in **Step 2** (items flip to "live" as they land). Tick the variant you
> want as the prod default (or note changes).

- **House-Influence panel** (MS2·6) — ✅ **all three LIVE in the DEV panel** ("VARIANT · House-Influence grade"):
  - [ ] **A — continuous ink grade-bar** _(self-picked prod default)_ — indigo→gold bar, ticks at
    Good/Great/Excellent.
  - [ ] **B — segmented 3-band boxes** _(built; the old `color`-vs-`background` bug is fixed)_ — three lacquer
    boxes (Good 良 / Great 優 / Excellent 秀), the current band filling.
  - [ ] **C — standing marks** _(built)_ — a row of ink marks ◆◇ filling toward Excellent (a diegetic tally).
  - _a11y note: A is a11y-100 (shipped). B/C are DEV-only until you pick one — if you do, I'll re-check WCAG
    contrast (B's dark ink label on the indigo "Good 良" box is the one to watch)._
- **Walkable map** (Estate 地図, now the load-bearing spatial spine — v0.3.1 Step 5) — ✅ **all three
  LIVE in the DEV panel** ("VARIANT · Estate map"):
  - [ ] **A — "you are here + paths list"** _(self-picked prod default; ✅ shipped)_ — the you-are-here
    card (node blurb) + a plain "Paths lead to →" list of move buttons, danger ⚠ + the conditioning
    lock inline. The calmest, most accessible rendering.
  - [ ] **B — 絵地図 estate schematic** _(built; DEV-only)_ — the estate as a spatial TRAIL: revealed
    nodes laid out in columns by their distance from the kura (a left→right path outward), you-are-here
    lit gold, walkable neighbours live buttons ("Walk here →"), danger-gated nodes marked ⚠ + their
    conditioning need. Derived from the graph by BFS, so it never drifts from the real map.
  - [ ] **C — 道中記 traveller's ledger** _(built; DEV-only)_ — INFORMED routes: each path onward is a
    row showing the destination's blurb AND what awaits there (⛏ the labours to work, ⚔ the foes to
    fight, ⚠ danger), so you choose your road from the map instead of walking in blind; "Set out 発つ →"
    (or the conditioning lock). The most information-dense.
- **Craft panel** (loot→craft the woodlot axe, T0-M2-F2) — ✅ **all three LIVE in the DEV panel** ("VARIANT ·
  Crafting"):
  - [ ] **A — smith's work-order checklist** _(self-picked prod default; the shipped panel)_ — each material a
    "name kanji … have/need" row (green once met) under the recipe title + blurb, closed by one Forge button
    disabled-with-its-reason ("Fell more foes for materials.") until every input is met.
  - [ ] **B — the smith's measures** _(built; DEV-only)_ — each material a single CONTINUOUS ink fill-gauge (A19)
    filling toward the needed amount, the exact tabular have/need kept beside it; gold when full, ochre while
    short, with a foot line that flips to "strike the smithy" once craftable.
  - [ ] **C — what the axe waits on** _(built; DEV-only)_ — a focused diegetic assembly: each material shown as the
    part it becomes (its blurb names the role), a left ink-rule gold-when-gathered / indigo-while-wanting, stamped
    with a 整 (set) / 未 (wanting) verdict at the foot.
- **Travelling market** (the pedlar's wares, T0-M4-F3) — ✅ **all three LIVE in the DEV panel** ("VARIANT ·
  Travelling market"):
  - [ ] **A — price-button list** _(self-picked prod default)_ — each good a flat row: name + faint grant left, a
    bare `{n} koku` buy-button right; sold-out rows append "· sold out" and disable. The calmest, lowest-weight
    rendering — keeps the market a deliberate MINORITY lane (ADR-008) that never out-claims Estate & Wealth.
  - [ ] **B — posted price-board (品書 shinagaki)** _(built)_ — one notice; each good a justified ledger line with
    a dotted leader: name … grant · price · 求 (buy / 尽 sold out); stock + any koku shortfall as plain ink beneath
    ("two left · need 6 more koku"). Hierarchy from alignment, not shadows.
  - [ ] **C — pedlar's ground-cloth** _(built)_ — your purse up top, each good led by one curated good-emoji
    (🌿🪵🪨🧺), price + a "take 取" verb, the remaining stock as continuous ochre ink (a bar that shortens as the
    cloth empties, A19); unaffordable goods name the shortfall. The most diegetic, also the busiest.
- **Quests tab** (用, T0-M4-F1) — ✅ **all three LIVE in the DEV panel** ("VARIANT · Quests"):
  - [ ] **A — per-quest woodblock cards** _(self-picked prod default)_ — a vertical stack of square `.frame` cards;
    each carries the title + kind tag (or **Done ✓**), the full blurb, a per-deed ☑/☐ checklist, and a reward
    line; an un-taken quest shows a **Take this on** verb. The most room per quest.
  - [ ] **B — 高札場 notice-board** _(built)_ — quests posted as commission-**bills** on a board; a brushed **kind
    stamp** (害/狩/掃 + word) and progress as ONE **continuous-ink "deeds answered" stroke** (A19) above the deed
    list; reward a gold koku slip, accept reads **請ける — Take the commission**.
  - [ ] **C — 用帳 steward's field-ledger** _(built)_ — one **aligned ledger row** per commission: kind stamp ·
    name + terse note · an **ink deeds-tally** (┃┃· 2/3) · the **koku in a right-aligned tabular column** · a
    status (**Take on** / in hand / 果 done ✓), with a 合計 foot totalling koku in hand.
- **Cold-open reveal** (the waking title card — playtest FB-14, NEW 2026-07-02) — ✅ **all three LIVE in the
  DEV panel** ("Cold-open reveal", the top entry of the Variants tab):
  - [x] **B — GBA typewriter** _(**APPROVED — shipped prod default**)_ — the lede types out
    character-by-character like an old Pokémon game, then the CTA. The closest to the human's "slow GBA
    scroll" reference.
  - ~~**A — staged fade**~~ — cut (unpicked); dead code stripped (ADR-075).
  - ~~**C — line-by-line 間 (ma)**~~ — cut (unpicked); dead code stripped (ADR-075).
  - _Verdict (human, 2026-07-02): B · GBA typewriter — shipped; A/C removed._
  - _Reduced-motion → everything reveals at once (no wait)._
- **Log filter bar** (the story/event log's bottom channel filter — playtest FB-9, NEW 2026-07-02) — ✅
  **all three LIVE in the DEV panel** ("Log filter bar", top of the Variants tab). Default view =
  **Story** (only the narration shows; Work / Combat / Progress / All a tap away):
  - [ ] **A — bottom tabs** _(self-picked prod default)_ — an underlined tab row at the log foot; the
    active channel underlined in seal-red.
  - [ ] **B — toggle chips** _(built; DEV-only)_ — rounded pill chips; the active channel fills indigo.
  - [ ] **C — segmented control** _(built; DEV-only)_ — one joined segmented bar, the active segment inked.
  - _Channels: Story = narration · Work = labour/koku + mundane · Combat · Progress = rung-ups/unlocks ·
    All. The mapping is unit-tested (`src/ui/log-filter.test.ts`). To review: toggle A/B/C in the DEV
    panel's Variants tab, then click the filter tabs at the log foot._
- _a11y: each surface's A ships a11y-100. B/C are DEV-only until picked; if you pick one I'll re-check WCAG
  contrast (the `--rokusho` grant + `--ochre`/gold accents on washi are the ones to watch)._
- **How to review:** `pnpm run dev` → the **DEV panel** floats at the bottom-right (click **DEV** to expand) →
  open its **Variants** tab and toggle each surface's variant; the surface updates live. The agent self-picks a
  default (every prod default = **A**); you confirm/override per variant by ticking it here.
- **Verdict:** _(awaiting the human — per variant, via the live toggle)_

---

### HR-5 🔲 — Bestiary panel (A7 · combat field-guide) — review each LIVE in the DEV panel (ADR-075)

The new **Bestiary** (reveals at R3, in the Combat tab) records the foes you've faced: a faced foe
shows its kanji seal, its **tell** (fast / evasive / heavy / unerring, derived from its archetype
knobs), its **win-rate forecast**, and where it haunts; an **un-faced foe stays fogged** (scout-by-
fighting, mirroring the combat-tab fog). Three FULL working takes are live behind the DEV toggle
("VARIANT · Bestiary"):

- [ ] **A — field-guide cards** _(self-picked prod default; shipped)_ — one woodblock `.frame` card
  per foe: name + kanji seal, a win-rate pip (◆ Steady/Even/Risky), the tell, and the node it
  haunts; unfaced foes read "Unknown foe · Not yet faced". The calmest, most legible take — it
  reuses the combat-tab foe-row chrome so the two panels feel of a piece.
- [ ] **B — danger ledger** _(built; DEV-only)_ — a ranked ink table (危険帳), foes ordered
  easiest→deadliest, each carrying a single **continuous danger-gauge** (A19: ink over pips) that
  fills + heats (rokusho→ochre→beni) as the odds worsen; unfaced foes are a hatched, silhouetted
  row. The most at-a-glance threat read.
- [ ] **C — 図鑑 scroll** _(built; DEV-only)_ — diegetic bestiary entries: each foe led by a kanji
  **portrait** that inks in once faced (a faint ？ silhouette before), with field-note prose + its
  tell/odds beneath; unfaced foes read as a rumour, not a stat-line. The most in-world, least tabular.

- **Asking for:** which take ships as the prod default (I self-picked **A**), or a tune to any.
- **How to look:** `pnpm run dev` → reach R3 (`__qa.toRung('R3')` then `__qa.faceWolf()`, or just
  play in) → the **Combat** tab → toggle "VARIANT · Bestiary" A/B/C in the DEV panel (top-right).
  Fight a foe (or `__qa.fight('monkey')`) to see an entry ink in from its fogged state.
- _a11y: A ships a11y-legible (pip hue is never the only signal — the word + % carry it). B/C are
  DEV-only until you pick one; if you pick one I'll re-check WCAG contrast (B's beni/ochre danger
  fills on washi are the ones to watch)._
- **Verdict:** _(awaiting the human — per variant, via the live toggle)_

---

### HR-6 🔲 — home/Inventory panel — pick among the 3 built ADR-075 variants

The **deep-housing T0 pass** (ADR-111, FB-89) shipped a prod default for the home /
belongings / comfort surface (in the **Inventory** tab); the owed **ADR-075 diverge**
is now **BUILT** — three genuinely-distinct WORKING variants behind the DEV-panel
toggle, each reading the same home data through the same selectors the reducer uses
(no preview/reality drift; every buy wired to the real `buy_belonging` intent):

- **A · functional list** _(current prod default)_ — inked belonging rows +
  comfort-in-effect tally + a "Settle your corner" acquire list.
- **B · 一間 room cutaway** — a diegetic woodblock room; belongings sit **in situ**
  (bowl on the mat, futon over the straw, hearth in the floor); acquire list reframed
  as "what the room still lacks."
- **C · 持ち物帳 possessions ledger** — a household register: owned pieces as ruled
  ledger lines with marginal comfort notes, a 合計 foot line, buyables as 未入 lines
  you ink in.

- **Asking for:** pick the presentation you want as prod (A/B/C) — then I strip the
  other two (zero flag-debt). B/C are the bolder diegetic bets; A is the calm default.
- **How to look:** `pnpm run dev` → the **Inventory** tab → DEV panel → toggle the
  **Home/Inventory** variant (V…A/B/C). All three work live.
- **Verdict:** _(awaiting your pick)_

---

### HR-7 🔲 — Estate-map redesign — pick among the live variants (FB-102, ADR-075)

The estate map was **redesigned + diverged** per FB-102 (a bordered "where you are
now" flavor panel split from a terse click-to-navigate map that hints nothing
about the next zone). **Seven** working takes (**V5A–V5G**) ship behind the DEV
toggle for a live pick; the agent self-picked a coherent prod default.

- **Asking for:** ~~which of V5A–V5G ships~~ → **RE-SCOPED (human verdicts,
  2026-07-06):** A disliked · **C/D/E/F REJECTED and stripped** (not map-like
  enough / disorienting) · **B & G survive** as the only takes with real 2D
  what-is-where navigation, held as interim candidates. The human's direction:
  **a REAL illustrated 2D estate map** that grows per tier and changes with
  estate improvements — 10 candidate directions are written up in
  [`docs/plans/fable-2026-07-06-estate-real-map-options.md`](../archive/fable-2026-07-06-estate-real-map-options.md);
  the human picks 3, each built by a Fable-5 xhigh subagent (ADR-075).
  Also: the Map tab goes two-column (flavour card | map).
- **UPDATE (2026-07-06, same day): ALL FIVE picked takes are BUILT and LIVE** —
  the human picked 1/4/6/8/9 ("I know I said 3 but 5 is great"); five Fable-5
  xhigh subagents built them in parallel, one module each:
  - **H · 絵図 survey plan** — title cartouche, terraced parcels, walled
    compound, north mark + legend + scale bar; U-stage amendments redraw the
    sheet; rooms stamp their seals.
  - **I · model board** — a true tilted CSS-3D diorama: raised plates with
    side-faces, standing cutout scenery, museum plaques, shōgi koma (people =
    silver koma; YOU = the lone vermillion 主, walks on travel).
  - **J · cadastral kokudaka** — the survey drawing + a paired 検地帳 register
    (kanji-numeral seals key rows to parcels); 改 red-seal amendments margin.
  - **K · the lantern map** — the whole estate etched on one dark plate,
    revealed by warm lamplight pools per visited node; standing andon lanterns;
    the gated lamp GUTTERS; rooms light windows in the house.
  - **L · kamon medallions** — coin-like struck dies with real engraved scenes
    (reeding, burin hatching), damascened gold-wire roads, stage rings.
  All five: real move_to travel (click-verified), conditioning gate + reason,
  fog-of-war (unnamed frontier), per-node labour/foe/people marks, estate-stage
  + house-room evolution. **How to look:** `pnpm run dev` → Map 地図 tab → DEV
  panel → Variants → "Estate map" (H–L; B/G remain as interim schematics), or
  `?map=map-h` … `?map=map-l`.
- **NARROWED (human, 2026-07-06):** finalists are **H · 絵図 survey plan** and
  **I · model board** — the two most opposed takes (flat authored sheet vs.
  tilted 3-D diorama). All five stay live (J/K/L not stripped yet); the human
  makes the final H-vs-I pick live in the DEV panel.
- **Verdict:** _(awaiting the human — final pick between H and I)_

> **UI-v2 note (M6, 2026-07-06):** ALL open variant surfaces (HR-2/5/6/7/9)
> now render **Andon-Steel-native** — the M1 token flip re-skinned every
> variant in place (they are token-built; an M6 sweep verified all 14 takes
> headlessly, zero washi leftovers). Make your picks in the NEW look.

---

### HR-9 🔲 — Estate SECTION redesign — pick among the 3 built variants (FB-157, ADR-075)

The human called the estate section (the Estate tab's improve + house-rooms
cards) **border soup** and asked for a diverge. Three working takes ship
behind the DEV toggle; each drives the real `improve_estate` intent + live
stage/coin/rooms data:

- **A · quiet sections** (prod default, self-picked) — the de-framed key-dim
  sections the FB-157 quick-fix shipped.
- **B · ledger strip** — one dense ledger row (stage ··· dotted leader ···
  Improve), payoff beneath, opened rooms as gold kanji chips.
- **C · bimetal plaque** — a centred engraved plaque: stage in gold serif,
  payoff etched silver, rooms as a mini-plaque rail.

- **Asking for:** which of A/B/C ships (or a tune).
- **How to look:** `pnpm run dev` → **Estate 家** tab → DEV panel → Variants →
  "Estate section (FB-157)"; or `?estate-section=estate-b` / `estate-c`.
- **Verdict:** _(awaiting the human — per variant, via the live toggle)_

---

### HR-8 🔲 — Rung-up cast + R0→R7 story beats — read & sign off (FB-97/FB-103, ADR-110)

Rung promotions are now **player-triggered VN story beats** (ADR-110) — each
narratively motivates the unlocks it grants. The **cast** (three invented faces:
pedlar Tokubei, Rokusuke, smith Tōzō) and the **R0→R7 beat script** are drafted
for your read in
[`project/archive/opus-2026-07-02-rung-up-story-transitions.md`](../../project/archive/opus-2026-07-02-rung-up-story-transitions.md)
(§6.6 cast / §7 beats).

- **Asking for:** a taste/read pass on the cast + the per-rung beats — do the
  faces + the transition prose land, or do you want any recast / retuned?
- **How to look:** read the ONE-PAGE generated script
  [`docs/content/t0-story.md`](../../docs/content/t0-story.md) (FB-5 — cold open →
  intro → R1…R7 in play order, choices + effects inline); or play it live —
  `pnpm run dev`, then `__qa.toRung('R1')`… to trigger each rung's beat in the VN
  modal. Prose edits now land directly in
  [`src/core/content/narrative/`](../../src/core/content/narrative/) (the FB-5
  authoring source — you can mark up those files yourself).
- **Verdict:** _(awaiting the human)_

---

### HR-10 🔲 — Phase-2 build beats (deed-source reveals + E1) — pick the take bundle (ADR-145, ADR-139)

The ADR-145 Phase-2 economy fires **six one-time log beats**: a reveal the
first time each of the five deed sources banks (fields / stores / workshop /
watch / treasury) and the **E1 "the estate stands" build-complete beat** at U4.
Three blind takes were authored (ADR-139); canon carries the self-pick:

- **CANON · a "steward's ledger"** — Genemon's dry book-keeping voice; each
  line is the moment a thing becomes worth recording (the mechanic itself —
  recognised deeds — voiced as fiction). In
  [`flavor.md`](../../src/core/content/narrative/flavor.md).
- **b · "the land remembers"** — third-person earth-and-weather narrator.
  ✘ lusher/longer in repeated log real estate (TST4).
- **c · "the heir's private reckoning"** — MC inward diary, closes on the
  mendHint vow kept. ✘ first-person "I" clashes with the log's narrator-voice
  convention (FB-91/93).

- **Asking for:** keep the ledger take, or override to b / c (or per-line mix).
- **How to look:** read the bundle —
  [`takes/estate-build-beats/`](../../src/core/content/narrative/takes/estate-build-beats/)
  (bundle.md + take-b/c.md; canon in flavor.md). NOTE these beats are
  **core-emitted log lines** — the DEV story switcher lists the bundle but a
  live in-log swap is not wired (same reader-only class as dialogue/cold-open
  takes); to see one land in play: load a Phase-2 fixture and trigger the
  source's first bank (e.g. farm once / sell rice / win a fight).
- **Verdict:** _(awaiting the human)_

---

### HR-11 🔲 — Build-progress tracker (ADR-145 Phase 4) — pick among the 3 live variants (ADR-075)

The staged E0→E1 build now has a **tracker read** inside the Estate tab's
improve card — all three re-present the SAME pure-core `estateBuild` selector
(AC-6; the reducer enforces the same gates, so the shown distance can't lie).

- **Taste brief (pass 1):** P1 the tracker EXTENDS the improve card — no second
  home for the build read; the improve CTA stays put · P2 reuse frame/meter/
  gold-value idioms, no new primitives · P4/P5 keyed rows patched in place,
  card never resizes on stage change · P15/TST3 locked future stages stay
  UNNAMED ("the works continue") — the U4 reveal is a story beat, not a menu
  spoiler · P19/P20 chrome register, plain tabular numbers
  ("standing N / M koku") · TST4 gate distance readable at a glance.
- [ ] **A — ladder rows** _(self-picked prod default; ships)_ — one compact row
  per stage: built ◆ gold · next ▹ with a standing gauge · locked ▢ unnamed.
  - **Scorecard (A):** 19✔ · 0✘ · 2— (P12 typewriter, P21 app-info: n/a)
- [ ] **B — milestone rail** _(built; DEV-only)_ — a horizontal 4-pip rail, the
  gold standing thread filling toward the next pip; next-stage line beneath.
  - **Scorecard (B):** 18✔ · 1✘ · 2— — ✘P15 [briefed]: pips reveal the total
    stage COUNT even while locked (names stay hidden via hover-title only).
- [ ] **C — ledger entries** _(built; DEV-only)_ — the steward's-ledger
  register (matches the ADR-145 beat canon): built stages as closed "Entered:"
  lines, the next as an open entry with a dotted-leader "wants" line; locked
  stages absent entirely.
  - **Scorecard (C):** 19✔ · 0✘ · 2— — strictest no-spoiler; boldest register.

- **Asking for:** which of A/B/C ships (or a tune).
- **How to look:** `pnpm run dev` → **Estate 家** tab → DEV panel → Variants →
  "Build tracker (ADR-145)". NOTE: the tracker lives in the DEFAULT estate
  section (variant A of "Estate section (FB-157)"); under estate-section B/C
  it doesn't render — pick that surface first (HR-9) if you want them merged.
- **Verdict:** _(awaiting the human — per variant, via the live toggle)_

---

> _This queue holds **open** reviews only. Closed reviews graduate to
> [`archive.md`](archive.md) (Reviews section) — e.g. **HR-4** (v0.3 fidelity-battery judgment queue, 6 calls) was
> **RESOLVED 2026-06-30** via AskUserQuestion → ADRs **ADR-076…ADR-079** (+ADR-056); **HR-3** folded into HR-2 (**ADR-075**).
> The build the HR-4 decisions feed is `project/archive/2026-06-30-v0.3.1-build.md` (done — archived)._

