# Item pictograms vs emoji — the honest 10-item A/B (#15)

**Status:** ✅ DONE (2026-07-18, session 216) — built + blind-passed;
A 10/11 PASS · B 8/11 FAIL; verdict is HR-48. Report:
`project/audit/reports/2026-07-18-pictogram-blind-pass.md`. Human
rulings at build time: 11-item roster (+hearth), bar ≥9/11, Fable
readers.
**Confidence:** ( 20% Opus, 80% Fable ) — the stroke grammar and the
slop verdict are taste-critical; the harness around them is mechanical.
**Template:** build

## Who builds this — Fable or Opus?

- **Grammar spec + the drawing module (steps 1–2): Fable.** One
  grammar carrying ten recognizable marks at row scale is the whole
  bet; this is the highest-judgment drawing since the map's roof
  pictograms.
- **Contact-sheet DEV surface (step 3): either** — plumbing on the
  `protos-pane` pattern.
- **Blind-pass readers (step 4): fresh-eyes subagents**, model
  inherited from the parent session (D-124).

## Why

Graphics register **#15** (`docs/living/graphics-concepts.md`, PARKED
SOON shelf) — pulled forward by the human 2026-07-18 ("Make a plan
for 1", the overnight-burn triage). The A/B design stands **verbatim**
from the 2026-07-08 triage
(`project/brainstorms/2026-07-08-novel-graphics-directions.md`, verdict
row 15): *"at risk of being slop too, I have no idea if they will be
better than emojis. Emojis are also slop lol"* → 10-item contact sheet
BOTH ways, blind-passed + taste-judged; **"both are slop, keep emoji"
is a pre-sanctioned valid outcome**; the register's ADR-127 note
amends only if pictograms WIN. Iconography canon today:
`docs/living/ui-design.md` §7 (one curated, cooled emoji set; one
mark per concept) and ADR-041 (emoji cosmetic-only, `aria-hidden`).

## What exists today

Surveyed **2026-07-18** at `9e2dff3c`:

- `docs/living/ui-design.md` §7 — the curated emoji table (~14
  concepts: 🌾 rice, 🪙 coin, 📜 edict, 🍶 sake, …) and the "one emoji
  per concept, extend only via this doc" law.
- The Inventory tab renders belongings **text-only** today —
  `src/ui/render/inventory.ts` uses no emoji (verified by grep);
  item-adjacent emoji live in `src/ui/render.ts` (season marks, the
  🌾 reward mark at line 263).
- Registries the roster draws from: `BELONGINGS` in
  `src/core/content/home.ts` (straw_mat · bowl · bedding · hearth ·
  chest), `src/core/content/weapons.ts`, and the resource trio
  (rice / wood / coin).
- The drawing toolkit: `src/ui/map-sheets/brush.ts` — the seeded brush
  primitives; the map's shared-hand roof pictograms are the precedent
  the pitch cites.
- DEV demo home pattern: `src/ui/dev/protos-pane.ts` (`⤢ Stamp book`,
  `⤢ Estate sheet` buttons) — prototype-first, DEV-only, stripped
  from prod.

## Steps

1. **The grammar spec** (anti-slop front-load) —
   `src/ui/pictograms/README.md`: the stroke grammar (≤5 strokes, one
   weight, fixed grid, seeded jitter via `brush.ts`), the 10-item
   roster with each item's emoji twin, and the blind-pass rubric
   ("name each mark", pass bar stated). Proposed roster — the goods a
   T0 player actually holds by R3: rice · coin · wood · sake · deed ·
   blade · straw mat · bowl · bedding · chest; swaps at spec time are
   fine with the reason recorded in the README.
2. **The drawing module** — `src/ui/pictograms/glyphs.ts`:
   `drawPictogram(id, seed)` — deterministic, Andon tokens only, no
   DOM reads; golden hash pin following
   `src/ui/estate-sheet/golden.test.ts`.
3. **The contact-sheet DEV surface** — `src/ui/pictograms/sheet.ts` +
   one `protoBtn` line in `src/ui/dev/protos-pane.ts`
   ("⤢ Pictogram A/B"): all 10 items BOTH ways side by side
   (pictogram column vs `.emoji`-cooled emoji column), shown at
   inventory-row scale AND enlarged, on the dark steel ground.
4. **The blind pass** — a Workflow of ≥3 fresh readers, blind to the
   roster, naming every mark in both columns at row scale; score per
   column; report to
   `project/audit/reports/2026-07-NN-pictogram-blind-pass.md`.
5. **Judgment + the HR item** — taste-scorecard Pass 2 per column;
   file ONE HR item framing the A/B verdict (pictograms win / emoji
   win / both slop — nothing ships from this plan either way); update
   the register row (Sync ripple below).

## Verification

- **Golden hash test** on the glyph set (could go RED on any drift;
  regen is a deliberate act).
- **Blind-pass report** with a named pass bar (proposed: ≥8/10 marks
  correctly named at row scale, else that column FAILS — the bar is
  in the spec so the check can go RED).
- **Player-reach (PH6):** DEV-only by design — the prototype-first law
  for graphics explorations (estate-sheet/stamp-book precedent).
  Reach proof = the DEV surface driven live + a capture committed
  into the blind-pass report. Nothing ships to the player from this
  plan; the shipping decision IS the A/B's output.

## Sync ripple

- **PRD:** none — DEV-only exploration; no shipped system changes.
- **Story-bible:** none — pictograms are mechanical UI marks, not
  fiction-voiced text (ADR-139 exempt; the blind-pass rubric is the
  quality bar instead).
- **Living docs / registries:** `docs/living/graphics-concepts.md`
  row 15 — status points at this plan while it runs, then at the
  verdict. A pictogram WIN (and only a win) amends `ui-design.md` §7 +
  the register's ADR-127 note — that edit belongs to the follow-up
  the HR verdict authorizes, not to this plan.
- **CHANGELOG:** none — no version bump ships here.

## Human-in-the-loop

- **Taste-scorecard Pass 1** before any drawing (constraint brief:
  §7 one-mark-per-concept · TST1 one idiom for the whole set · P2
  intentionality at row scale).
- Files **one HR item** at the end — the A/B verdict with the
  contact sheet + blind-pass report attached. No mid-plan asks; the
  kill switch ("both slop, keep emoji") is pre-sanctioned, so the
  plan never blocks on taste.

## Non-goals

- No Inventory-tab restyle and no swap of any shipped emoji — only
  the HR verdict can authorize that (as its own follow-up).
- No 50-item set — exactly the 10-item sheet the ruling names.
- No icon usage in new surfaces while the A/B is open.

## Risks

- **Slop risk is the point** — bounded by the pre-sanctioned kill
  outcome; two craft rounds max before the report ships as-is.
- **Seam (shared tree):** `src/ui/pictograms/` is new ground no live
  plan touches. Shared-file edits: one line in
  `src/ui/dev/protos-pane.ts`. The active talk-system plan owns
  `src/core/content/*` — this plan only READS registries. Check
  herdr peers before the protos-pane commit
  (`git diff --cached --name-only` first, pathspec only).
