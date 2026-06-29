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

- **Asking for:** the **fun & visual-taste verdict** on the full T0 experience — does the cold open hook (note:
  it's now **longer** — Genemon greets + teaches in the log; is that the right amount, or trim?); is the
  labour→wolf→combat→**spine→ascension**→breadth arc paced and fun; does the **BIG T0→T1 ascension** land as a
  payoff; do the breadth beats (quest, craft, walkable map, market) add fun or chrome; does it all look like an
  intentional woodblock game (not AI-slop)? Anything that breaks the spell.
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
  - (Base pacing is provisional/liquid (D-059); the DEV speed + teleports give review velocity.)
- **Galleries to skim:** `audit/screens/breadth/` (Genemon onboarding, craft panel, Quests tab),
  `audit/screens/diverge-influence/` (the live spine + the **ascension ceremony** `play-2-ceremony.png`),
  `audit/screens/diverge-map/` (the walkable map). The fidelity **battery** report
  (`audit/reports/2026-06-29-v03-*`) + the roadmap-respect report are the agent's self-vetting; this is the taste
  call they inform but can't replace.
- **Known, flagged for your call:** the cold-open length; the DEMO/REAL pacing fork is **not yet retired**
  (D-056 pending); diverge picks are **R2** (influence panel) + **R3** (breadth surfaces).
- **Verdict:** _(awaiting the human)_

### R2 🔲 — diverge pick: the live House-Influence panel (M2·6, D-073)

- **Asking for:** an override-or-confirm on the **self-picked winner** for the live House-Influence panel (the
  T0-M3 macro surface — active Estate 家産 pillar + grade bar + unnamed silhouettes D-055 + the Ascend CTA).
- **Self-pick:** **Variant A — a continuous ink grade-bar with ticks at Good/Great/Excellent** (vs Variant B's
  segmented 3-band boxes). A reads more woodblock-faithful (a single ink bar, the indigo→gold grade progression,
  the vermilion 朱 Ascend CTA as the one key action); B's labelled boxes read as generic game-UI and were buggy
  (fill used `color` not `background`). Winner is on `main` flag-free; the ascension ceremony reuses the
  rank-up-seal beat (bigger/gold, D-062).
- **How to look:** the contact sheet in [`audit/screens/diverge-influence/`](../audit/screens/diverge-influence)
  (`A-{1-teaser,2-great,3-excellent-ascend}.png` vs `B-*.png`) + the decision note `DECISION.md` there. Live:
  `npm run dev` → `__qa.forceState({rung:'R7',flags:{...,'t0-capstone':true},unlocked:[...,'panel-house-influence'],influence:{estate:{value:490,highWater:500,judged:480}}})`.
- **Verdict:** _(awaiting the human — non-blocking; A shipped per D-073 self-pick)_

### R3 🔲 — diverge picks: the T0-M4 breadth surfaces (D-073)

- **Asking for:** an override-or-confirm on the self-picked directions for the **T0-M4 breadth** UI surfaces
  added overnight (the build is on `main`, flag-free; all non-blocking).
- **Self-picks:**
  - **Walkable map (Estate 地図 tab)** — full diverge: **Variant A** (focused "you are here + paths", ink
    place-names) over **B** (whole-map grid). Contact: `audit/screens/diverge-map/` (A-forecourt.png + DECISION.md).
  - **Smaller breadth panels (craft, market, Quests tab) — diverge-LITE** (overnight time-box): each shipped on a
    single ui-design-faithful direction (small panels in existing tabs / one new tab), captured in
    `audit/screens/breadth/`. NOT a full 2–3 variant contact sheet — flagged here so you can request a re-diverge
    on any that don't land. (Mentor dialogue routes into the existing log → no new surface, no diverge owed.)
- **How to look:** play `npm run dev` (use `__qa.jumpToAscension()` / `__qa.speed(8)` to move fast) + the
  `audit/screens/diverge-map/` and `audit/screens/breadth/` galleries.
- **Verdict:** _(awaiting the human — non-blocking)_

### R4 🔲 — v0.3 fidelity-battery judgment queue (6 design/taste calls)

- **Asking for:** decisions only you can make, surfaced by the v0.3 fidelity battery
  ([report](../audit/reports/2026-06-29-v03-fidelity-battery.md)). The build is faithful to locked intent (prd 9 /
  adr 8.5 / human-feedback 8); these are the **design/taste** calls (the agent fixed the safe bugs + false-green
  tests separately — see the journal). Plain language:
  1. **The wall-time clock (D-053 vs D-013, MAJOR).** The build pauses the sim on `document.hidden` (`main.ts:205`);
     D-053 (`decisions.md:444`) says do the OPPOSITE (advance by wall-time, a hidden tab catches up), while
     `decisions.md:157` frames D-053 as *reaffirming* active-only. The two ADRs pull apart — **which is canon?**
     (Cost of inaction: a signed lock sits unbuilt while the code does its literal opposite.)
  2. **The shipped pace + fork (D-056 + the REAL T0 numbers, MAJOR).** DEMO ships by default (<1 min tutorial);
     REAL over-corrects (R0 ≈ 31 min / ~3500 rakes) vs the ~10–15 min/rung target + D-022's "R0 ≈ 5-min cold-open".
     **No reachable profile delivers the designed hook.** → approve retiring the fork (ship ONE profile) + sign off
     re-derived T0 thresholds (~10–15 min/rung, R0 ≈ 5 min) with the ≥30 floor gated from T1. (This is M2·8 + the
     pacing re-derivation — the agent deferred it as it needs your number sign-off.)
  3. **Auto-combat defuses the D-050 fight tension (MAJOR).** Auto-combat auto-heals + only fights the matchup you
     pick, so "a fight you might lose" becomes background maintenance. → keep autopilot fully autonomous, or make it
     strictly assistive / add a press-your-luck prompt?
  4. **Cold-open length.** *(The agent applied the suggested fix — gating Genemon's teaching lines to fire after the
     first rake — see the journal; confirm the new sequencing reads right, or tune further.)*
  5. **Breadth-as-chrome.** The map gates nothing mechanically; the lone quest + market are one-time reveals. → bless
     as deliberate T0 reveal-only beats, or fund making ≥1 load-bearing (a deed behind a map node, a quest branch)?
  6. **koku ↔ win-condition coupling.** Getting richer never brings ascension closer (the pillar deed is a flat
     `ESTATE_DEED_PER_ACT`, independent of koku/yield/stage) and koku runs out of sinks (~1378 lifetime). → approve
     coupling wealth to standing (a capped koku→deed commission, or deed scaling by estate stage)?
- **Verdict:** _(awaiting the human — non-blocking; balance is liquid D-059)_

