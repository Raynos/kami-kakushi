# Reviews (R-items)

Things needing a human's judgment that an automated check can't make — playtest feel, look, tone,
pacing. IDs `R1…Rn`, never reused. Status: 🔲 open · ⏳ waiting on Claude prep · ✅ done.

---

<!-- Format:
### R1 🔲 — {what to review}
- **Asking for:** {the specific verdict needed}
- **How to look:** {dev URL / screenshot / steps to reproduce}
- **Verdict:** {filled in by the human}
-->

### R1 🔲 — the **v0.3 T0 M0–M4 demo**: fun, pacing & look (the human play/taste call)

> **Updated 2026-06-29 (overnight) from the M0–M2 slice → the whole T0 (M0–M4).** v0.3 built the macro spine
> (which now CLOSES) + the T0-M4 breadth. This is the taste call on the full T0 arc.

- **Asking for:** the **fun & visual-taste verdict** on the full T0 experience — does the **cold-open hook** land
  (note: the battery flagged it as over-teaching and the agent **applied a fix** — Genemon now greets with only
  **greet + the stakes** on wake, and the koku-teaching + promise land *after* your first rake (reveal-as-plot);
  see the refreshed `v03-gallery/01-cold-open-genemon.png` — confirm the new sequencing reads right or tune
  further, R4#4); is the labour→wolf→combat→**spine→ascension**→breadth arc paced and fun; does the **BIG T0→T1
  ascension** land as a payoff (the ceremony seal now sits on a proper scrim — `v03-gallery/04-ascension-ceremony.png`);
  do the breadth beats (quest, craft, walkable map, market) add fun or chrome; does it all look like an intentional
  woodblock game (not AI-slop)? Anything that breaks the spell.
- **The arc to play:** cold open (Genemon onboarding) → rake → labour up the **R0→R7** ladder → the humbling
  grain-store wolf → combat (HP **carries** + heals by **eating**; stances trade; **loot→craft** the woodlot axe);
  → **Phase 2 opens at R7**: your estate deeds bank into the live **House-Influence 家威** pillar; the **season
  judges** your high-water; reach **Excellent** → the **manual Ascend** → the T0→T1 ceremony. Plus the **Quests**
  tab (drive off the crop-raiders), the tiny **market**, and the walkable **Estate 地図** map.
- **How to look — `npm run dev`, then in the browser console use the DEV tools** (DEV-only, stripped from prod):
  - `__qa.speed(8)` — run the auto-loop 8× to grind fast. `__qa.auto('farm_paddy')` / `__qa.autoCombat('monkey')`
    set an auto-target.
  - `__qa.jumpToPhase2()` — jump to the R7 capstone (the live macro spine, Phase 2 open).
  - `__qa.jumpToAscension()` — jump to Estate **Excellent**, the **Ascend** button live (click it for the ceremony).
  - `__qa.toRung('R3')` — fast-forward via real intents to a rung; `__qa.faceWolf()` the humbling fight.
  - **⏱ Pacing note (M2·8, NEW):** the DEMO/REAL fork is **retired** — the build now runs at the **real** pace
    (R0 ≈ **5-min** cold-open of raking, the climb rungs ≈ **10–15 min** each; the full T0 ladder ≈ 1.5–2 h).
    So **use `__qa.speed(8)`** (or the teleports) to review without real-time grinding. The numbers are **liquid
    (D-059)** — tell me to nudge any rung if the feel is off. (An end-to-end test proves the whole arc closes
    under real play: `src/core/t0-arc.test.ts`.)
- **Galleries to skim:** **`audit/screens/v03-gallery/` (the curated 8-shot v0.3 tour — START HERE;** cold-open →
  live spine → ascension-ready → the ceremony → quests → combat+craft → market → map; shots 01 & 04 re-captured
  post-fix). Plus `audit/screens/breadth/` (Genemon onboarding, craft panel, Quests tab),
  `audit/screens/diverge-influence/` (the live spine + ascension), `audit/screens/diverge-map/` (the walkable map).
  The fidelity **battery** report (`audit/reports/2026-06-29-v03-fidelity-battery.md`) + the roadmap-respect report
  are the agent's self-vetting; this is the taste call they inform but can't replace.
- **Known, flagged for your call:** the cold-open sequencing (now re-sequenced — confirm or tune, R4#4); the
  DEMO/REAL pacing fork is now **RETIRED** (M2·8 — R4#2 closed; the real ~5-min/~10–15-min pace is liquid, confirm
  the feel by playtest); the **UI-variant review** is now **R2** (each variant its own line item, reviewed live
  in the DEV panel — D-075). The full battery judgment queue is **R4** (design/taste calls).
- **⚠ a11y contrast darkening (confirm or tune the shades):** a Lighthouse audit found the new v0.3 panels at
  **a11y 95** — 3 text colours failed WCAG AA contrast on the washi-shade panels (the muted market-grant text, the
  vermilion **家威** kanji at 3.2:1, and the gold **"Excellent 秀"** grade at 2.2:1). I **darkened just those text
  colours** to in-palette deeper tones (→ **a11y 100**, the v0.2 standard); the grade-bar fill stays bright gold.
  These touch hues you saw in the **R2** diverge — tell me if you want them lighter (and I'll find another way to
  hit AA, e.g. a darker panel bg) or they're fine as-is. The R2 grade shots (`v03-qa-sweep/10–12`) are **re-captured**
  to the new colours; the curated `v03-gallery/` tour shots predate it (cosmetic only — you'll see the live build in play).
- **Verdict:** _(awaiting the human)_

### R2 🔲 — UI variants (review each LIVE in the DEV panel — D-075)

> **New process (D-075, supersedes the old R2/R3 single-pick).** Every diverged surface ships **FULL 2–3 working
> variants**, switchable live in the **DEV panel**; **each variant is its own line item below**, reviewed by
> toggling it in the running build (not screenshots). ✅ The **DEV panel is BUILT** (v0.3.1 Step 1) — `npm run dev`
> and it sits top-right with a **VARIANT** section per surface; **House-Influence A/B/C are LIVE now**. The
> craft / market / quests variants land in **Step 2** (items flip to "live" as they land). Tick the variant you
> want as the prod default (or note changes).

- **House-Influence panel** (M2·6) — ✅ **all three LIVE in the DEV panel** ("VARIANT · House-Influence grade"):
  - [ ] **A — continuous ink grade-bar** _(self-picked prod default)_ — indigo→gold bar, ticks at
    Good/Great/Excellent.
  - [ ] **B — segmented 3-band boxes** _(built; the old `color`-vs-`background` bug is fixed)_ — three lacquer
    boxes (Good 良 / Great 優 / Excellent 秀), the current band filling.
  - [ ] **C — standing marks** _(built)_ — a row of ink marks ◆◇ filling toward Excellent (a diegetic tally).
  - _a11y note: A is a11y-100 (shipped). B/C are DEV-only until you pick one — if you do, I'll re-check WCAG
    contrast (B's dark ink label on the indigo "Good 良" box is the one to watch)._
- **Walkable map** (Estate 地図, T0-M4-F4):
  - [ ] **A — "you are here + paths"** _(✅ shipped default)_ — focused, ink place-names.
  - [ ] **B — whole-map grid** _(⏳ to build into the toggle)_ — designed, not yet built.
  - [ ] **C — (owed)**.
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
    rendering — keeps the market a deliberate MINORITY lane (D-008) that never out-claims Estate & Wealth.
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
- _a11y: each surface's A ships a11y-100. B/C are DEV-only until picked; if you pick one I'll re-check WCAG
  contrast (the `--rokusho` grant + `--ochre`/gold accents on washi are the ones to watch)._
- **How to review:** `npm run dev` → the **DEV panel** sits top-right in a reserved right gutter (it never covers
  the content) → toggle each surface's variant and the surface updates instantly. The agent self-picks a default
  (every prod default = **A**); you confirm/override per variant by ticking it here.
- **Verdict:** _(awaiting the human — per variant, via the live toggle)_

---

> _This queue holds **open** reviews only. Closed reviews graduate to
> [`archive.md`](archive.md) (Reviews section) — e.g. **R4** (v0.3 fidelity-battery judgment queue, 6 calls) was
> **RESOLVED 2026-06-30** via AskUserQuestion → ADRs **D-076…D-079** (+D-056); **R3** folded into R2 (**D-075**).
> The build the R4 decisions feed is `docs/plans/2026-06-30-v0.3.1-build.md`._

