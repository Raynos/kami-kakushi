# bestiary-plates — the beast register 獣譜 (the drawn field guide)

**Graphics register #4** (plan:
[`fable-2026-07-18-bestiary-plates.md`](../../../docs/plans/fable-2026-07-18-bestiary-plates.md)),
**NOT part of the map-sheets system**: it reuses the seeded ink
toolkit (`map-sheets/brush.ts`) but extends neither `map-spec.md`
nor the map golden pin — this README is the experiment's whole
spec, per the estate-sheet precedent
([`../estate-sheet/README.md`](../estate-sheet/README.md)). Home:
the Combat-tab Bestiary panel (HR-5, open) — plates enter as a
DEV-only `bestiary-d` option; the shipped default does not change
here.

World facts derive from the story bible; the bible wins every
disagreement. **The document fiction below is PROPOSED, not canon**
(human ruling 2026-07-18: not Sōan — an invented hand): adopting it
is the HR-5 call, and its voiced text routes through ADR-139.

## The document fiction (PROPOSED — the H-lines)

- **H1 · The album.** The **Kurosawa beast register 獣譜** — a bound
  album of survey plates, one per beast on the house's grounds,
  drawn in the house's great days by a retainer's hand. The colophon
  carries a seal **worn past reading**: the register's author has no
  name the living can recover. (The house keeps registers the way it
  keeps faith — Genemon's creed; and a nameless hand's book passing
  to a nameless man is shown, never said.)
- **H2 · The fall took the plates.** Nobody kept the album through
  the decline: damp and worms have taken most plates. A ruined plate
  is ILLEGIBLE — foxed paper, a worm-hatched blank, only the plate
  number surviving. This is the unfaced state.
- **H3 · Re-ink only what the house can attest.** The household will
  not put ink to the register on hearsay: a plate is restored only
  when the beast is CONFIRMED — faced in the field by the house's
  own hand. Facing a foe re-inks its plate: the old hand's drawing
  and field note recovered beneath the foxing (silver), the current
  confirmation entered over it (gold accents, shu threat marks).
  The mechanic (scout by fighting) is CAUSED by the fiction (TST3).
- **H4 · The beasts held their grounds.** Each plate names the
  beast's ground, and it is the same node you fight it on today —
  the beasts kept their territories better than the house kept its.
  Derived from `enemies.ts` `area` (AC-6's spatial cousin).
- **H5 · The register keeps no men.** The bandit (野伏, T2-held)
  gets no drawing: a beast register does not enter men. Its page
  stays a blank — which also spoils nothing (kernel #1 stays plain;
  no human combat shown in T0).
- **H6 · Grounded, always.** The old hand drew only what was skinned
  and measured — no belief-creatures, no folk framing (kernel #1).
  The tanuki is round, low, and gone at a shout; nothing more.

## Ink grammar (inherits the AA bar)

Same hand as the map/estate sheets: aizuri-night substrate, Andon
tokens only, brush-alive tapered strokes, seeded determinism
(`rng(seed)` — the same state always paints the identical plate,
TST2). Ink states carry meaning, one convention with the estate
sheet (TST1):

- **silver** — the old hand: silhouette, measurement marks, the
  field note's rule lines, the frame.
- **gold** — the current confirmation: the re-ink accents, the
  sighted-at entry.
- **shu** — threat marks and stamps (the 済 confirm mark).
- **foxing/hatch** — the ruined (unfaced) plate: paper-blemish
  wash + worm-hatch, NO recoverable silhouette (no spoil, P9).

## Plate grammar (per foe)

Each plate composes, top to bottom:

1. **Header** — plate number 其ノ一…, the foe's kanji title (from
   `enemies.ts`), the label as reading gloss.
2. **The silhouette** — a side-profile naturalist study under a
   STROKE BUDGET (the craft discipline: ~10–22 tapered strokes per
   beast; a swarm plate draws 3–5 small bodies, never a mass fill).
   Pose states the foe's character: the badger low and planted, the
   monkey mid-slip, the wolf standing with no wasted line.
3. **Measurement marks** — a scale rule in period units (寸/尺) with
   tick callouts to nose/tail — presentation geometry owned by this
   module; never game data.
4. **Threat marks** — shu grade ticks (一/二/三…) DERIVED from
   `mobCombatStats(mob)` — the same fn the fight and forecast use
   (AC-6 at the ink layer; the vitest gate REDs a hand-copied
   table).
5. **Tell callouts** — `foeTell(mob)` words rendered as marks: fast
   → motion strokes trailing the figure · heavy → a ground-weight
   line under it · evasive → a dodge arc · unerring → a single
   straight strike line. The tell word itself prints as a small
   mechanical label (ADR-139-exempt).
6. **Ground line** — 出ル所 + the node's kanji/label from `area`
   (mechanical, derived).
7. **The field note** — ONE fiction-voiced line by the old hand
   (ADR-139: 3+ blind takes, own bundle, DEV story switcher).

**Sources:** `enemies.ts` (kanji, label, level, area, knobs) +
`mcCombatStats`/`mobCombatStats`/`foeTell` via the core public
index. No new game data; no data-model changes (plan non-goal).

## Coverage

All 10 `MOBS` get a plate slot on the contact sheet: 9 beasts drawn
+ the bandit's H5 blank. The night-round trio (内鼠 · 貂 · 狼) have
plates even though today's `bestiaryEntries` (grindable-only) omits
them from the panel — the contact sheet shows the full album; the
`bestiary-d` variant renders what the panel derivation knows (no
data-model change here; widening the panel roster is its own later
call).

## The blind-reader rubric (B-lines — the pass bar)

A fresh reader given ONLY captures must recover these. **M** =
must-say (fail the round if missed) · **S** = should-say. Written
before any drawing; the naming test crops the silhouette ALONE (no
kanji header — the drawing must carry the identification).

- **B1 M** — each plate reads as a hand-drawn period album page
  (a naturalist's survey plate), NOT a game icon, sticker, or
  clipart.
- **B2 M** — every faced beast is NAMED from its silhouette alone
  (animal kind suffices: "a badger", "a wolf"). Pass bar: each foe
  named by **≥2 of 3** cold readers.
- **B3 M** — the hard pairs read APART: tanuki ≠ badger, dog ≠
  wolf, monkey ≠ troop big-male (scale/king marks), river rats ≠
  store rats (reed-ground vs wall-line context marks).
- **B4 M** — threat marks rank-order MATCHES the stats' danger
  order (the AC-6 derivation, visible).
- **B5 M** — an unfaced plate yields NO silhouette — readers can
  say only "a ruined page".
- **B6 S** — tells read as behavior: fast/heavy/evasive/unerring
  recovered from the marks.
- **B7 S** — the ground line is noticed and matches the foe's map
  node.
- **B8 S** — the document fiction reads: an old hand, a worn seal,
  fresh confirmations over older ink.
- **B9 S** — craft: brush-alive strokes, zoom pays, not slop.

Iteration loop: capture → ≥3 fresh blind readers → judge scores
these B-lines → fix → repeat. **Two craft rounds max** (plan kill
switch): if the pass bar can't clear, PARK with the report as the
verdict record.

## Module shape

- `plates.ts` — `drawPlate(parent, enemyId, o: PlateOpts)` with
  `{seed, faced}` — the one drawing entry; per-foe pose tables are
  presentation data local to this module.
- `contact-sheet.ts` — the DEV review surface: every foe × faced +
  unfaced, panel scale + enlarged (opened from the DEV protos
  pane).
- `golden.test.ts` + `golden.hash.json` — this module's own pin
  (separate from the map pin), frozen once a look is kept.
- `ac6.test.ts` — threat marks derive from `mobCombatStats`
  (COMMIT lane).

Laws inherited from the graphics-exploration rules: seeded
determinism only, Andon tokens only, taste two-pass, pin once kept,
blind pass before "done".
