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

### R1 🔲 — the M0–M2 demo: fun, pacing & look (the first human play/taste call)

- **Asking for:** the higher-level **fun & visual-taste verdict** on the playable T0 slice — does the
  cold open hook? does the reveal cadence (UI inking in) feel good? is the labour→wolf→combat arc paced
  and fun? does it look like an intentional woodblock game (not AI-slop)? Anything that breaks the spell.
- **How to look:** `npm run dev` → open the local URL and play (cold open → rake → labour to the rungs →
  face the wolf → combat). Or skim the gallery in [`audit/screens/`](../audit/screens)
  (`latest/qa-01…10-*.png`, `2026-06-27-log-cascade/log-cascade-*.png`,
  `2026-06-27-settings/settings-*.png`). The agent has self-vetted it against `ui-design.md`; this is the
  taste call the proxies + the agent's own review inform but can't replace.
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

