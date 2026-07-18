# Pictogram A/B blind pass — 11 marks, both ways (#15)

**Plan:** `docs/plans/fable-2026-07-18-pictogram-ab.md` · **Session:**
216 (2026-07-18) · **Spec + rubric:** `src/ui/pictograms/README.md`.

## Method

- **Surface:** the DEV contact sheet (`src/ui/pictograms/sheet.ts`,
  protos-pane `⤢ Pictogram A/B`), **blind mode** — unlabeled marks at
  row scale (16px cells), craft strip stripped. Capture:
  `project/audit/screens/2026-07-18-pictogram-ab/blind.png`
  (labeled twin `labeled.png` beside it; deviceScaleFactor 2).
  *Screens are local-only by the standing `.gitignore` policy (only
  `screens/latest/` tracks) — the committed reach-proof is this
  table, the golden pin, and the live DEV door; re-capture any time
  with the sheet's blind mode.*
- **Readers:** 3 fresh subagents (Fable-inherited, D-124 — the human's
  session-216 ruling), independent and blind to the roster; instructed
  to read ONLY the image and name the object each mark depicts, per
  row and column ("unclear" allowed; describing the drawing = miss).
- **Scoring:** a hit = the reader's word denotes the item's object
  class (majority ≥2/3 decides each mark). **Pass bar (human ruling):
  at most 2 misses per column — ≥9/11**, else that column FAILS.
- **Craft rounds used:** 1 of the plan's 2 — after the first capture:
  the card-width clip fixed, `wood`/`straw_mat` de-twinned (same
  circle+body construction at 16px), `rice`'s grain head densified.
  Golden pin regenerated deliberately with that round.

## Results

Three readers (r1 · r2 · r3), majority-scored. Raw output:
`project/brainstorms/raw/2026-07-18-pictogram-blind-pass-s216-welcus92o.json`
(git-ignored local insurance; this table is the committed record).

| # | item | A names (r1 · r2 · r3) | A | B names (r1 · r2 · r3) | B |
|---|---|---|---|---|---|
| 1 | rice | flowering branch · grain stalk · grain stalk | ✓ | rice plant ×3 | ✓ |
| 2 | coin | coin ×3 | ✓ | moon · moon · coin | ✗ |
| 3 | wood | key · key · log | ✗ | log(s) ×3 | ✓ |
| 4 | sake flask | bottle · sake bottle · bottle and cup | ✓ | sake bottle · sake set ×2 | ✓ |
| 5 | a deed | document ×3 | ✓ | scroll ×3 | ✓ |
| 6 | a blade | sword ×3 | ✓ | crossed swords ×3 | ✓ |
| 7 | straw mat | mat · woven mat · book | ✓ | basket ×3 | ✗ |
| 8 | rice bowl | bowl ×3 | ✓ | rice bowl ×3 | ✓ |
| 9 | futon | futon · futon · tray | ✓ | bed ×3 | ✓ |
| 10 | hearth | stamp · stove · stove | ✓* | fire ×3 | ✗ |
| 11 | chest | cabinet · chest · chest | ✓ | cardboard box ×3 | ✓ |

\* borderline, ruled a hit: "stove" names the same object class as the
irori (a cooking-fire fixture); the symmetric strictness rules B's
"fire" a miss — 🔥 depicts the fire, not the fixture.

**Column A (pictograms): 10/11 — PASSES the ≥9/11 bar.** The one miss
is `wood` (the log end-on + long body reads as a KEY at 16px).
**Column B (emoji): 8/11 — FAILS the bar** (3 misses):

- `coin` 🪙 → "moon" (2/3): the shipped `.emoji` grayscale cool
  strips the gold that makes the coin read — a finding about the
  cooled-emoji idiom itself, on a CURATED §7 mark.
- `straw_mat` 🧺 → "basket" (3/3) and `hearth` 🔥 → "fire" (3/3): the
  pre-stated anachronism cost — no period emoji exists, and the
  nearest stand-ins do not denote the item.

## Verdict

**Pictograms win the row-scale legibility test, A 10/11 vs B 8/11.**
Craft/taste (does the set look intentional, one hand, Andon?) is
scored in the HR item's taste Pass 2; the shipping decision is the
human's — HR-48. Nothing ships from this plan either way (ADR-127's
emoji clause amends only via the HR verdict's follow-up).

Notable secondary findings:

- The `.emoji` cooling (grayscale 0.7) actively damages legibility of
  colour-dependent emoji (the coin). Any emoji-keeps verdict may want
  a per-mark cooling exception list.
- The A-column's one miss (`wood`-as-key) is a drawable fix (side-on
  split billet instead of end-on log) — one craft round remains under
  the plan's two-round cap if the human wants a re-test.
