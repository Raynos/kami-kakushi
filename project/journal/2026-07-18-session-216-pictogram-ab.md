# 2026-07-18 · session 216 — the pictogram A/B (#15)

**Plan:** `docs/plans/fable-2026-07-18-pictogram-ab.md` (human go, this
session). **Model:** Fable (steps 1–2 are the taste-critical drawing).

## Human rulings (session start, AskUserQuestion)

- **Roster = 11 items**: the proposed 10 (rice · coin · wood · sake ·
  deed · blade · straw mat · bowl · bedding · chest) **plus hearth** —
  "All — the 10 plus deed plus hearth."
- **Pass bar = the plan's ≥8/10 tolerance** — at most 2 misses per
  column; scaled to the 11-item roster that is **≥9/11** named correctly
  at row scale, else that column FAILS.
- **Blind readers inherit Fable** (D-124 default; the 2026-07-11
  Opus-routing steer not re-applied).

## Taste Pass 1 — the constraint brief (before any drawing)

Full 21-principle walk. Applicable (one line each):

- **P2 (one primitive per idiom):** all pictogram ink goes through
  `map-sheets/brush.ts` (`rng`/`scrawl`/ink emitters) — never a second
  jitter/PRNG home; the emoji column uses the SAME shared `.emoji`
  cooled class the game ships, never a local filter fork.
- **P5 (frames are stable):** every glyph draws on one fixed grid in a
  fixed-size cell; the sheet's rows are fixed-height — no cell resizes
  with glyph complexity.
- **P6 (complete or absent):** the contact sheet paints all 11 rows
  fully at every width — both columns, both scales, no ghost cells; the
  modal scrolls internally.
- **P19 (two registers):** the contact sheet is CHROME (dense, tiny-type
  proto23 register — row scale is the test); the enlarged column exists
  to judge craft, not to become ceremony.
- **P20 (bounded container):** the sheet lives in the shared
  `modal-scrim`/`modal-card frame` shell (stamp-book precedent), never
  raw `vw` sizing.
- **TST1 (one home):** one new dir `src/ui/pictograms/`; the DEV door is
  ONE `protoBtn` line in the existing protos-pane — no second launcher,
  no inventory-tab wiring (non-goal).
- **TST2 (never yank ground):** seeded-deterministic — a given seed
  paints the identical sheet every open; golden hash pins it.
- **TST4 (never guess state):** each row is labelled (id + kanji +
  label) BESIDE the marks, so the human judges recognizability against
  the answer; the blind readers get the marks WITHOUT labels (the
  rubric's whole point).
- **V-a (derived from TST3/ADR-041):** marks stay decorative
  (`aria-hidden` twin discipline); kanji/word carries meaning in any
  eventual shipped use — the A/B never makes a pictogram load-bearing.
- **V-b (anti-slop, ADR-126/P19):** one stroke grammar for all 11 — ≤5
  strokes, ONE weight register, fixed grid, seeded jitter — a set that
  reads as one hand; constraint reads handmade, defaults read slop.

n/a silently: P1, P3, P4, P7–P18, P21 (no log/story/typewriter/tab
surface touched; DEV-only, nothing ships).

## What happened

- **Step 1** — `src/ui/pictograms/README.md`: the stroke grammar
  (32×32 grid · ≤5 paths · one weight 2.0 · one colour `var(--ink)` ·
  brush.ts seeded jitter amp 0.7 · silhouette-first), the 11-row
  roster with emoji twins (5 marks have NO period emoji — nearest
  stand-ins, recorded as A/B evidence), the blind rubric.
- **Step 2** — `glyphs.ts` (eleven painters over shared
  `rng`/`scrawl`; three emitters each appending ONE path) +
  `glyphs.golden.test.ts`: hash pin (`UPDATE_PICTO_GOLDEN=1` regen) +
  RED-able grammar laws (≤5 paths · one weight/colour · ≤1 filled ·
  seed determinism AND seed-reaches-ink) — 24 green.
- **Step 3** — `sheet.ts` contact-sheet modal + one protos-pane door
  (`⤢ Pictogram A/B`, new "Graphics A/B (#15)" shelf). Two registers:
  row-scale grid (all 11 at 16px at once — the test) over the 96px
  craft strip; **blind mode** strips names + craft strip for the
  capture. Live-driven headlessly (tmp/picto-shot.mjs → the shared
  :5264): captures in
  `project/audit/screens/2026-07-18-pictogram-ab/`.
- **Craft round 1 of 2** (from the first capture): the shared
  `.modal-card` `max-width` clipped the 96px columns (P6, briefed —
  fixed with an explicit max-width); `wood`/`straw_mat` were the same
  circle+body construction at 16px — mat redrawn as a flat woven
  panel in perspective; `rice`'s grain head densified. Pin
  regenerated deliberately with the round.
- **Step 4** — 3 blind Fable readers (Workflow `wf_e2292391-ad7`,
  ~169k tokens) named every mark at row scale. **A 10/11 PASS ·
  B 8/11 FAIL** (bar ≥9/11). Full table + secondary findings:
  `project/audit/reports/2026-07-18-pictogram-blind-pass.md`; raw
  snapshot `project/brainstorms/raw/2026-07-18-…-welcus92o.json`.
- **Step 5** — verdict **pictograms win row-scale legibility**;
  HR-48 filed with both Pass-2 scorecards; graphics register row 15
  re-pointed at the verdict; plan → ✅ → `project/archive/`.

## Taste Pass 2 — the full walks (compressed brief in HR-48)

**Column A (the pictogram set + its sheet):** 6✔ · 0✘ · 15— (n/a: P3,
P4, P7–P18, P21 — no log/story/typewriter/tab surface; DEV-only).
P1 ✔ one home (`src/ui/pictograms/`, one door) · P2 ✔ brush.ts is the
only ink/jitter home, `.emoji` untouched · P5 ✔ fixed grid, fixed
cells · P6 ✔ **after** the briefed catch (the max-width clip — fixed
before scoring, P6-fix rule) · P19 ✔ chrome register, dense · P20 ✔
shared modal shell, no raw vw. Values: V-a ✔ aria-hidden decorative;
V-b (one hand) ✔ as a SET — the `wood` blind miss is craft, not
grammar drift. No blind-spot ✘.

**Column B (the shipped cooled-emoji idiom, as measured):** 6✔ · 0✘ ·
15— on the same walk (it rides the same sheet and the shared `.emoji`
primitive). Its 8/11 blind FAIL is the A/B's measurement, not a
principle violation — but two findings feed any emoji-keeps verdict:
the grayscale cooling makes 🪙 read as a MOON (a TST4 hazard the
moment emoji carry item state), and the 5 no-period-emoji items cost
all 3 of B's misses.

## Next intended steps

- HR-48 is the human's: pictograms win / emoji win / both slop. A WIN
  verdict authorizes the follow-up (ui-design §7 + ADR-127 note
  amendment + any shipped use); `wood` has one craft round left under
  the plan's cap if she wants a re-test first.
- Shared-tree seam left deliberately UNCOMMITTED at first checkpoint:
  `src/ui/dev/protos-pane.ts` now carries BOTH my pictogram door and
  the bestiary co-agent's door (their `src/ui/bestiary-plates/` dep
  is uncommitted) — the file lands once both deps are in, sequenced
  via herdr.
