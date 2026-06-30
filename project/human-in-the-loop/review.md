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
> toggling it in the running build (not screenshots). ⏳ The DEV panel + the full variant set are **being BUILT**
> (v0.3.1 steps 1–2, per `human-feedback/2026-06-30-r4-playtest-decisions.md`); items flip to "ready to toggle" as
> they land. Tick the variant you want as the prod default (or note changes).

- **House-Influence panel** (M2·6):
  - [ ] **A — continuous ink grade-bar** _(✅ shipped default)_ — indigo→gold bar, ticks at Good/Great/Excellent,
    vermilion 朱 Ascend CTA.
  - [ ] **B — segmented 3-band boxes** _(🐛 to FIX, then add to the toggle)_ — was buggy (fill used `color` not
    `background`); fix so you can compare live.
  - [ ] **C — (owed)** — a 3rd approach, per D-075's full-2–3 rule.
- **Walkable map** (Estate 地図, T0-M4-F4):
  - [ ] **A — "you are here + paths"** _(✅ shipped default)_ — focused, ink place-names.
  - [ ] **B — whole-map grid** _(⏳ to build into the toggle)_ — designed, not yet built.
  - [ ] **C — (owed)**.
- **Craft / Market / Quests panels** — _were "diverge-LITE" (a corner cut under the overnight time-box; now owed
  FULL variants per D-075):_
  - [ ] **Craft panel — variants 1 / 2 / 3** _(⏳ to build)_.
  - [ ] **Market panel — variants 1 / 2 / 3** _(⏳ to build)_.
  - [ ] **Quests tab — variants 1 / 2 / 3** _(⏳ to build)_.
- **How to review (once built):** `npm run dev` → open the **DEV panel** → toggle each variant live. The agent
  self-picks a default; you confirm/override per variant by ticking it here.
- **Verdict:** _(awaiting the human — per variant, via the live toggle)_

---

> _This queue holds **open** reviews only. Closed reviews graduate to
> [`archive.md`](archive.md) (Reviews section) — e.g. **R4** (v0.3 fidelity-battery judgment queue, 6 calls) was
> **RESOLVED 2026-06-30** via AskUserQuestion → ADRs **D-076…D-079** (+D-056); **R3** folded into R2 (**D-075**).
> The build the R4 decisions feed is `docs/plans/2026-06-30-v0.3.1-build.md`._

