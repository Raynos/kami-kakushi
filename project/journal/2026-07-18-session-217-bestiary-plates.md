# 2026-07-18 — session 217 — bestiary plates (the drawn field guide, #4)

**Plan:** `docs/plans/fable-2026-07-18-bestiary-plates.md` (engaged
live; the human answered the three open forks via AskUserQuestion and
went AFK, authorizing the full autonomous build).

## Rulings (human, live)

1. **The hand is not Sōan** — invent a new document fiction that fits
   the story bible; still PROPOSED (non-canon) in the spec, the HR
   rules finally.
2. **Field-note prose is IN scope** — fiction-voiced plate prose ships
   in this build, 3+ blind takes per line (ADR-139).
3. **Blind readers / subagents inherit Fable** (D-124 confirmed).

## Log

- Rulings recorded in the plan (Status → IN PROGRESS); the plan left
  the reading queue (engaged live, same move as the stamp-book plan).
- Taste Pass 1 walk: below, before any drawing.

## Taste Pass 1 — the full walk (before drawing)

Values first: TST1 one home (plates render INSIDE the bestiary panel
family, fed by the ONE `bestiaryEntries` derivation; brush.ts is the
one ink toolkit — no second brush idiom) · TST2 solid ground (seeded
determinism — the same state always paints the identical plate; no
re-render flicker) · TST3 the fiction causes the mechanics (the
register only re-inks what the household can attest — scout-by-
fighting IS the fiction) · TST4 never guess state (faced vs unfaced
vs newly-confirmed readable at a glance; threat marks legible, not
decorative).

Per principle (n/a skipped): P1 — plates are the bestiary's look,
not a new capability home; the DEV contact sheet is a review
surface, not a second home. P2 — reuse brush.ts emitters + Andon
tokens; no local palette, no forked RNG. P3 — field-note prose is
authored in narrative .md with the register as speaker; renderer
only presents. P4/P5 — plate frames fixed-size; panel swaps in
place; contact sheet static. P6 — complete at every width incl.
390px; the unfaced plate is a DELIBERATE hatched blank, never a
ghost box. P9 — an unfaced plate leaks no silhouette (no spoil);
the reveal follows the first fight. P10 — the album the fiction
names IS the surface the player holds; it names no place/person
outside the built game. P13 — threat reads as in-document marks
(diegetic), with the panel's plain numbers kept where variant d
needs legibility. P15 — "sighted at" names only the foe's own
ground, no destination preview. P17 — faced/unfaced/fresh-confirm
distinct at a glance. P19 — the plate is ceremony (breathes);
surrounding chrome stays dense. P20 — bounded panel, internal
scroll, no raw vw. V-derived (from the values + the map AA bar):
**V-craft** — brush-alive tapered strokes under a stroke BUDGET per
silhouette; never uniform CAD lines, never emoji-slop; **V-seed** —
`rng(seed)` only, golden-pinned once kept.

## Build log (steps 1–3)

- Spec written (`src/ui/bestiary-plates/README.md`): the invented
  fiction is the **Kurosawa beast register 獣譜** — an old-house album
  by a retainer whose seal wore past reading (a nameless hand's book
  passing to a nameless man); ruined plates re-ink only as the house
  can ATTEST each beast (scout-by-fighting caused by the fiction,
  TST3). H5: the register keeps no men — the bandit stays a blank.
- `plates.ts` + `threatGrade` (AC-6: ordinal over
  `mobCombatStats` danger mass) + `ac6.test.ts` + golden pin (30
  hashes: 10 foes × faced/unfaced/blind) + `contact-sheet.ts` with
  the blind-crop toggle; protos-pane launcher wired.
- **Craft rounds 0–1 (self, before any blind reader):** round 0 —
  outline-only strokes read as stick figures; round 1 — fat
  brushStrokes for mass render as angular slabs (resample step w×1.8
  leaves 2–3 points). The keeper technique: hand-cut FILLED
  silhouette polygons (`wash`) + substrate-colored carves (mask,
  ribs, stripes) + thin detail strokes. Round 2 tunes: tanuki ears/
  mask/teardrop tail, rat scale. Lessons recorded in the plates.ts
  header so the next hand doesn't rediscover them.
- Leak fixes the golden test caught: the hover `<title>` named the
  beast on blind AND ruined plates (B2/B5/P9) — both neutralized,
  pinned.
