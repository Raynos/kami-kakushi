# Item pictograms — the stroke grammar and the A/B rubric

The #15 graphics exploration
(`docs/plans/fable-2026-07-18-pictogram-ab.md`): an honest A/B of
code-drawn item pictograms against the shipped cooled-emoji idiom
(`ui-design.md` §7). **Nothing here ships to the player** — the module
is DEV-only (imported by the protos-pane alone, riding the dev strip
fold); the A/B's HR verdict is the only thing that can promote it. "Both
are slop, keep emoji" is a pre-sanctioned outcome.

## The stroke grammar (anti-slop front-load)

One hand for the whole set — every glyph obeys ALL of these, so the
eleven read as one maker's marks, not clip-art:

- **Grid:** a fixed 32×32 unit cell. Marks fill ~24 units, centred;
  nothing touches the cell edge. Rendered at **16px row scale** (the
  test) and 96px (the craft view).
- **Stroke budget: ≤5 paths per glyph.** One emitted path element = one
  stroke (a multi-tick detail — weave lines, grain dots — is ONE stroke
  iff it is emitted as one path). Enforced by test.
- **One weight register:** every line stroke is `W = 2.0` grid units
  through `inkLine` — no hairline/heavy mixing inside the set. At most
  **one filled path** per glyph (a dot cluster or a solid accent),
  counted in the budget.
- **One colour:** `var(--ink)` only. No accents, no per-item colour —
  the cooled-emoji column is the colourful one; the A/B must not win by
  peacocking.
- **Seeded jitter:** all geometry goes through `map-sheets/brush.ts`
  (`inkLine`/`scrawl`/`rng`) with `amp = 0.7` — the shared brush hand
  (TST1: one jitter home), deterministic per seed (TST2; golden-pinned).
- **Silhouette first:** each item is drawn as the OBJECT's period
  silhouette, never a kanji (kanji is the text register's job, ADR-041)
  and never an emoji redraw.

## The 11-item roster (human ruling, session 216)

The plan's proposed 10 **plus hearth** — "All — the 10 plus deed plus
hearth". Emoji twins from `ui-design.md` §7 where curated; where the
period item has NO emoji, the nearest available stands in — **that
strain is itself A/B evidence** (recorded per row):

| id | item | kanji | pictogram (silhouette) | emoji twin |
|---|---|---|---|---|
| `rice` | rice (resource) | 米 | bowed grain ear: stem, leaf, grain-dot cluster | 🌾 §7 |
| `coin` | coin (mon) | 銭 | round coin, square hole | 🪙 §7 |
| `wood` | wood (material) | 木 | log end-on: side lines + end ring | 🪵 nearest |
| `sake` | sake flask | 酒 | tokkuri: narrow neck, swollen body + cup | 🍶 §7 |
| `deed` | a deed | 証文 | paper leaf, text ticks, solid seal square | 📜 §7 (edict) |
| `blade` | a blade | 刃 | curved blade, tsuba tick, wrapped grip | ⚔️ §7 (arms) |
| `straw_mat` | straw sleeping-mat | 筵 | rolled mat: spiral end + weave ticks | 🧺 nearest* |
| `bowl` | rice bowl | 椀 | bowl profile on a foot ring | 🍚 nearest* |
| `bedding` | futon | 布団 | folded stack: two soft slabs + fold line | 🛏️ nearest* |
| `hearth` | sunken hearth | 囲炉裏 | square pit, hanging jizaikagi hook + pot | 🔥 nearest* |
| `chest` | clothes chest | 長持 | long lidded box on feet, ring handle | 📦 nearest* |

\* no period emoji exists — the twin is the closest modern object
(basket / cooked-rice bowl / Western bed / bare fire / cardboard box).
If the emoji column passes the blind bar THROUGH these anachronisms,
that is a finding for emoji; if it fails ON them, that is the honest
cost of the emoji idiom for period items — either way the report calls
it out.

## The blind-pass rubric

- **Setup:** the contact sheet's **labels-off** mode, captured at row
  scale (the 16px columns) on the dark steel ground; ≥3 fresh readers,
  blind to the roster and to each other, model inherited (Fable, D-124).
- **Task:** name every mark in BOTH columns — "what object is this?" —
  one or two words per mark.
- **A hit** = the reader's word denotes the same object class as the
  item (chest/box/trunk → hit for `chest`; bed/bedding/futon → hit for
  `bedding`). Describing the drawing without naming the object
  ("squiggle", "some lines") or naming a different object class ("gift",
  "flag") = miss. Majority across readers decides each mark (≥2 of 3).
- **Pass bar (human ruling, session 216): at most 2 missed marks per
  column** — **≥9/11** majority-named, else that column FAILS. The bar
  applies to each column independently; the A/B verdict compares scores
  AND craft (taste-scorecard Pass 2).
- Report: `project/audit/reports/2026-07-18-pictogram-blind-pass.md`.

## Module layout

- `glyphs.ts` — `drawPictogram(parent, id, o: {seed})`: appends one
  `<g>` per glyph; pure SVG-DOM emitter (no DOM reads, no game imports,
  brush.ts idiom G-7); `PICTOGRAM_IDS` is the roster's single source.
- `glyphs.golden.test.ts` — the hash pin (estate-sheet pattern:
  `UPDATE_PICTO_GOLDEN=1` regenerates) + the grammar tests (≤5 paths,
  one-colour/one-weight, determinism).
- `sheet.ts` — `openPictogramSheet()`: the DEV contact-sheet modal
  (protos-pane launcher), all 11 rows × both columns × both scales,
  labels toggle for the blind capture.
