# E1 estate-sheet blind pass — 2026-07-08 (session 123)

The rubric loop for the E1 okoshi-ezu prototype (a **standalone
experiment** — judged against the E-line rubric in
[`src/ui/estate-sheet/README.md`](../../../src/ui/estate-sheet/README.md),
NOT the map-spec §5 rubric; the committed `map-blind-pass` workflow does
not apply here). Method: headless captures (both variants × 3 fixture
eras — local-only in the git-ignored
`project/audit/screens/2026-07-08-e1-estate-sheet/`; the review artifact
is the LIVE DEV toggle per ADR-075, and the drawing is reproducible from
the pinned code) → one fresh
blind-describe agent per variant, images only, zero context → the
E-lines scored against their verbatim descriptions by this session
(scoring was mechanical — every line below quotes its evidence; a
separate judge agent was skipped to honor the human's cost steer).

## Verdict

| | E1 M | E2 M | E3 M | E4 M | E5 M | E6 S | E7 S | E8 S | E9 S |
|---|---|---|---|---|---|---|---|---|---|
| **A fold-up** (iter 2) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **B section-cut** (iter 1) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

Both variants: **all 5 M + 4/4 applicable S — PASS.** Pin regenerated
at the final look (`golden.hash.json`).

## Evidence highlights (verbatim from the blind reads)

- **E1 (genre):** A — named the genre unprompted: "an *okie-zu*
  (起絵図…) the Edo-period drafting genre that combines a measured plan
  view with fold-up elevations"; B — "the projection carpenters
  actually used."
- **E2 (winged house):** B — "廊下 (rōka, corridor)… the covered
  passage tying the wings together." A iter 2 — "west wing — central
  母屋 — east wing, all strung on the single 廊下 corridor."
- **E3 (the compression wrongness):** A iter 1 — "The stables are
  absurdly large for one horse… Decline." A iter 2 — "a shrine marker
  *inside the house*, in the hallway… the single strangest interior
  feature." B — "a household shrine, drawn in the 'new work' color
  permanently: the one thing always maintained."
- **E4 (the ruin at scale):** B — "The ratio is the story… camping in
  the corner of something that used to be vastly larger." A — "drawn
  bigger than anything they currently inhabit."
- **E5 (the working document):** both recovered the full grammar
  (gold = season's work · shu = the reviser · closed-kept) AND the era
  arc; B — "the work-front has migrated across the house west→east."
- **E8 (honesty rule):** B — "The document doesn't dramatize this; it
  corrects it, coldly, in vermilion — which is far more chilling."
- **E9 (quality):** A — "an *illustrated place*… not a CAD diagram";
  B — "decisively NOT a CAD diagram or generic computer graphic."

## Iterations

- **Iter 0 (own eyes, pre-blind):** tatami bond read as brickwork →
  fainter/sparser; closed rooms de-masonried to diagonal shut-hatch;
  kura lost its (wrong) mats; ruin walls gained masonry courses + foot
  rubble; B's ruin ground raised clear of the lived ridgeline.
- **Iter 1 (blind):** B passed everything. A missed E2's corridor
  sub-clause (corridor buried under floor texture; alcove read as "a
  tiny gold door"; rake arcs read as scrub).
- **Iter 2 (fix + fresh reader on A):** corridor re-inked over the
  floors + 廊下 label; alcove redrawn as a post-and-lintel shrine
  glyph; rake arcs made orderly broom rows ("raked gravel… the tending
  stops exactly at the wall" — the intended read, exactly); kitchen
  attached to the house's west flank (bible fidelity). PASS.
- **Post-pass polish (not rubric-gated):** the well gained its 井 mark
  (A's readers took the bare ring for a lone stone/marker).

## Known residuals (accepted, surfaced for HR-16)

- B state 1: the fresh-gold kitchen standing in FRONT of the west wing
  was once attributed to the wing (depth overlap); mitigated by seating
  the foreground row lower. Honest architecture — accepted.
- Both readers note the two deliberate modern departures: the
  aizuri-night inversion (the game's locked substrate) and the small
  bilingual glosses (the sheets' established caption grammar).
- A's loose pieces read as "elevation vignettes" rather than fold-up
  cutouts to one reader (E6 partial); the tabs + cut-marks carry it for
  the other. Acceptable.
