# Stamp book (E3) resume — decision grill

Date: 2026-07-18 · Goal: surface and resolve the open decisions in
`docs/plans/fable-2026-07-18-stamp-book-resume.md` so the build can
start (session 212, live grill instead of async HD/HR filing).

## Summary / key decisions

- **Home = ceremony afterglow + a revisitable home.** The book opens
  itself after each rank ceremony (the fresh seal still wet) AND
  stays revisitable from a fixed panel. This CLOSES the plan's
  step-3 HD live — no async HD-item needed; record as an ADR when
  the surface ships. The revisitable half lives in a **Record panel
  opened from the Character tab** (Q1b — plan default confirmed).
- **Fiction = the MC's own seal-book** (shuinchō register the
  player carries; each rank-granter presses their own seal). Spec
  still grounds every named hand in bible canon; any NEW bible fact
  goes through the HR proposal, not freehand (Q2).
- **Scale = compact: ≤20% of the screen, an in-page section** (gym-
  badge style), pressed seals + empty future slots, NOT a
  full-screen modal; the current prototype is the wrong scale (Q3).
- **Depth = per-seal inspect popover** (hand / day-season / knots);
  no large modal anywhere; the full-screen prototype retires to
  DEV reference (Q4).
- **Future slots = next named, rest mystery** — the next rung
  always reads; beyond it, blank silhouettes until you approach
  (Q5).

## Q&A log

### Q1 — the home (the plan's step-3 HD)
- Asked: where does the stamp book live for a real player?
  Plan default: a Record panel opened from the Character tab;
  alternates: Progress tab · rank-ceremony afterglow (moment vs
  place), or afterglow + a home combined.
- Captured: **"Ceremony afterglow + a home"** — both: the book
  opens on the rank-ceremony beat (TST3, the reveal follows the
  story beat) and remains revisitable any time. (First tap said
  "afterglow only"; the human re-asked and corrected to the
  combined option — the combined answer is the ruling.)
- Flags: none.

### Q1b — which tab hosts the revisitable home
- Asked: Character-tab Record panel (plan default) vs Progress tab.
- Captured: **Character tab → Record panel** — the plan default,
  confirmed; the book sits with the backward-looking "who am I /
  what have I done" surface, Progress stays the forward tracker.
- Flags: none.

### Q2 — the document fiction (whose book / whose hand)
- Asked: MC's own seal-book vs the house's official register vs
  derive-from-bible in the spec pass (plan default).
- Captured: **The MC's own seal-book** — personal shuinchō-style
  register the player carries; whoever grants each rank presses
  their own seal into it. Intimate register: knots and dry
  stretches read as *your* lean seasons.
- Flags: the spec must still GROUND this in bible canon (02-house /
  03-tiers — who actually grants each T0 rung, so each seal has a
  named hand). If the bible lacks "the MC carries a seal-book",
  that's a new-fact proposal in the HR, per the plan's sync-ripple
  rule → spec author + HR.

### Q3 — the look-diverge directions
- Asked: which of the plan's three variants (A concertina · B
  page-per-rung · C cover-first reveal) to build.
- Captured: **"All three as planned"** — BUT with a major scale
  steer, in her words: *"the current prototype is huge, its a huge
  UI element … I was thinking that the seal book section or the
  actual stamp collection would be a smaller UI element … maybe 20%
  of the screen or less, its basically a section you can see
  somewhere and see you progress, and see the rungs your going to
  collect in the future, like pokemon gym badges. It's not like a
  full screen or huge modal thing with huge UI elements."*
- Decisions this carries:
  - **Scale: compact — ≤20% of the screen**, an in-page section,
    NOT a full-screen modal. The current `openStampBook()`
    full-screen prototype is the wrong scale; the three variant
    directions reinterpret at compact scale.
  - **Future rungs visible**: empty seal-slots for rungs not yet
    earned (gym-badge case) — the element shows the whole ladder,
    pressed + unpressed.
- Flags: resolved by Q4.

### Q4 — where per-seal detail lives at compact scale
- Asked: compact only vs compact + per-seal inspect popover vs
  compact + tap-to-expand full book.
- Captured: **Compact + per-seal inspect** — tap a single seal for
  a small popover (whose hand pressed it, day/season, crisis
  knots). The section stays glanceable; depth on demand; NO large
  modal anywhere. The full-screen `openStampBook()` prototype
  retires to DEV-reference status.
- Flags: none.

### Q5 — how unearned future slots present
- Asked: named slots vs mystery silhouettes vs next-named-rest-
  mystery.
- Captured: **Next named, rest mystery** — the immediate next rung
  reads (you always know what you're climbing toward); slots beyond
  it are blank seal silhouettes until you approach. Keeps the
  discovery cadence (TST3) while the gym-badge pull stays real.
- Flags: none.

## Wrap (2026-07-18, same session)

The human said **BUILD**. All five rulings promoted to **ADR-201**
(decisions band 150) and into the plan's new Rulings section
(`docs/plans/fable-2026-07-18-stamp-book-resume.md`, Status →
ACTIVE). Execution defaults self-picked and noted in chat: variants
reinterpret at compact scale; afterglow choreography is diverge
craft; core state-feed lands once the talk-system seam is clear
(re-surveyed: it already is). No open flags remain — Q2's
bible-grounding flag is an obligation on the spec author, carried
into the plan, not a pending human input.

## Parking lot (tangents / parallel threads)

## Open flags (pending input)
