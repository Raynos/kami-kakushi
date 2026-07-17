# Session 212 — 2026-07-18 — estate-sheet craft pass: rulings + build

**Summary:** The human walked the estate-sheet craft-pass plan's forks
directly (AskUserQuestion) and the pass moved from PROPOSED to ACTIVE.
Rulings: craft-only scope (the three recorded ✘s, confirmed);
tap-to-maximize for the P20 mobile fix; **FULL Andon furniture** for
the P2 legend/cartouche (human override of the smallest-change
default); the fixture-era DEV proto door retires (TST1). One grounding
correction: the 凡例 already decodes shutters, so the TST4 fix targets
mark strength, not a missing legend row.

## What changed

- `docs/plans/fable-2026-07-18-estate-sheet-craft-pass.md` — Status →
  ACTIVE; new Rulings section (R1–R4 + the shutter-legend grounding
  correction); steps 3a/3b/3c rewritten to the rulings; step 3d added
  (proto-door retirement); the step-2 async check struck as RESOLVED.

- `docs/living/graphics-concepts.md` — row 5's forward track
  rewritten honestly (step 1): integration already happened (家 tab
  variant A, state-driven); remaining work = the craft pass.

## Taste Pass 1 — constraint brief (before step 3)

Applicable principles (skipped ones n/a for a drawn-sheet craft
pass; full standard walked):

- **P1** — the fixture-era DEV proto door DELETES when this lands;
  the 家 tab is the one home (no "kept as reference" secondary cue).
- **P2** — mobile maximize REUSES the map viewer's ⛶ primitive
  (CSS blow-up, pan/zoom, exit chip, Esc); legend + cartouche
  rebuild on the app's shared card idiom + tokens — extend, never
  fork a local variant.
- **P5** — the inline preview is a stable frame: entering/exiting
  maximize never rebuilds the 家 tab around it; the sheet repaints
  only on its state signature.
- **P6** — at every width ≤920px the preview paints complete: no
  clipped cartouche, no label collisions, no ghost furniture.
- **P17** — tap-to-maximize is an ADVERTISED control (a visible
  affordance on/near the preview), not a secret gesture.
- **P19** — the sheet is ceremony register (it breathes); the
  Andon-card furniture must not drag it into chrome-dense tight
  type.
- **P20** — maximize stays the map idiom's normal-stacking CSS
  blow-up: no page scrollbar, no raw `vw`.
- **V-TST2** — additive under the OPEN HR-30: variant A keeps its
  identity; the golden-pin regen is the one deliberate look change,
  recorded in a dated addendum.
- **V-TST3** — the furniture stays diegetic through the rebuild
  (母屋起絵図 cartouche + hanko, the 凡例); the H4 honesty rule
  holds — the ruin never enters the legend.
- **V-TST4** — the closed-but-kept read survives a cold reader:
  shutter marks legible at arm's length, the legend row decodes
  them without squinting.

- Dev-server law amended (human): if `:5264` is dead, the agent
  restarts it in the herdr dev-server pane itself — AGENTS.md +
  qa-playtesting.md §0/§7 updated (uncommitted pending green window;
  both files carry co-agent WIP). Server relaunched in `w5:p1`.
- `project/audit/reports/2026-07-18-estate-craft-baseline.md` — NEW
  (step 2): two zero-context blind readers over 9 captures
  (git-ignored under `screens/2026-07-18-estate-craft-baseline/`),
  judged vs E1–E9. Baseline **4/5 M · 3/4 S** (E3 marginal, E6 ✘);
  all three recorded ✘s confirmed with sharper mechanisms (closure
  renders as HATCHING while the legend decodes ||| boards; the 凡例
  is 8.4px in-SVG type; phone = "decorative, not readable", no zoom
  affordance). Three out-of-scope phone-layout defects recorded in
  the report, to be named in the HR-30 addendum.

## Next intended steps

1. Step 1 — register truth fix (graphics-concepts row 5).
2. Step 2 — blind-pass baseline on TODAY'S from-state sheet
   (`?fixture=rung-R6` / `rung-R7` / `wealthy-idler`).
3. Step 3a–d — the four fixes, each independently committable behind
   the golden pin, taste-scorecard Pass 1 first.
4. Step 4 — re-verify (blind pass + re-scorecard variant A).
5. Step 5 — HR-30 dated addendum + deliberate pin regen.
