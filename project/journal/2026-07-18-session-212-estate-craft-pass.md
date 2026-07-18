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

- **3b landed** — plan-view closure now draws the SAME vertical
  shutter-board + tie convention the 凡例 and the wall faces teach
  (was a 45° hatch the legend never decoded); boards inked stronger
  (`ink-soft` .6 vs `ink-faint` .55). Deliberate pin regen included
  (`UPDATE_ESTATE_GOLDEN=1`), recapture eyeballed: 局/書院 read as
  shuttered-kept.
- The tree went GREEN mid-session (talk WIP + skill library landed);
  the dev-server law fix committed clean, no skip.

- **3a + 3c landed** (with 3b in one craft commit — the working tree
  merged them in sheet-a.ts): the 凡例 left the sheet and is an
  Andon strip beside the drawing (brush-drawn marks, app type; the
  study overlay reuses the same helper); the diegetic cartouche +
  ken bar stay on the document (H1). Tap-to-maximize ships: an
  advertised ⛶ study chip + the preview itself open a full-viewport
  blow-up on the SHARED sheet-viewer engine (map-sheets/viewer.ts),
  the live map's maximize idiom. Headless drive proves: overlay
  opens (desktop + phone), zoom legible at 390px, Esc closes.
- **3d landed**: the fixture-era DEV proto door deleted
  (protos-pane button + `estate-sheet/demo.ts`); estate-sheet
  README header un-staled (shipped state + craft-pass deltas
  recorded beside the rules).

## Taste Pass 2 — scorecard (variant A, post-craft)

Full 21-walk. **13✔ · 1✘ · 7—** (n/a: P3 P8 P13 P14 P15 P16 P18
P21 → 7 with P7 scored ✔-borderline below).

- ✘ **P2 [briefed] — NAMED CUT:** the study/zoom chip style
  (`estate-sheet-chip`) is a THIRD copy of the small-chip rule
  (`t0v2-zoom` in the DEV modal, `sheetmap-zoom` in the live map's
  scoped CSS) — mirrored byte-for-byte, not shared-sourced.
  Consolidating means touching both map modules mid-open-review
  (seam + TST2 risk), so it ships named; recorded in the HR-30
  addendum for the human's call.
- ✔-borderline **P7**: the legend strip's 12px/11px chrome type is
  fixed-px like the map chips it mirrors — A−/A+ scales the reading
  registers, not chrome; consistent with the shipped idiom.
- Everything the brief named otherwise holds: P1 (door deleted),
  P5/TST2 (overlay is its own layer; card never rebuilds on
  open/close), P6 (phone card paints complete — capture proof),
  P17 (chip + zoom-in cursor + aria), P19 (chip tight, sheet
  breathes), P20 (normal-stacking blow-up, no page scrollbar),
  TST3 (cartouche + 凡例 stay diegetic), TST4 (one closed
  convention, legend-decoded).

## Close-out (all five steps landed)

- **Step 4** — after blind pass with FRESH readers: **5/5 M · 4/4 S**
  (baseline 4/5 · 3/4; E3 + E6 now land). Post-read nits fixed in
  the craft commit (portrait opens on the compound; pinch hint;
  Reopened line + legend ride the study view; plate clears DEV).
  Report: `project/audit/reports/2026-07-18-estate-craft-after.md`.
- **Step 5** — HR-30 dated addendum filed (rulings, per-✘ fixes,
  re-scorecard 20✔ · 1✘ named cut, the 工房/板倉 caption/drawing
  mismatch as an open human call). Pin regen rode the craft commit.
- Discovered out-of-scope work homed per the queue law:
  `docs/plans/fable-2026-07-18-phone-shell-defects.md` (three 390px
  shell defects) — queued for the human, NOT started this session
  (one-session-per-plan).
- Commits: e86c08e2 (rulings) · 631a54fe (register) · d79588c0
  (dev-server law v2 + guard fix) · f41f6e9e (baseline) · f675f81e
  (craft trio) · c3d18bd1 (proto door) · + this checkpoint.

## Next intended steps

1. The phone-shell-defects plan (fresh session).
2. HR-30 stays with the human — variant pick + the two addendum
   calls (chip-CSS consolidation · the works-not-drawn caption).
