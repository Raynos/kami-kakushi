# stamp-book/ — the seal-strip record (E3, compact)

The **shuinchō stamp book + ink thread** (concepts #8 ❤️ + #10, folded
at the 2026-07-08 triage), re-scoped by ADR-201: the run's progression
as a **compact seal-strip** — a small in-page section (≤20% of the
screen, gym-badge register) showing one pressed seal per rung
ceremony, strung on the run's single ink-thread stroke, with the
future rungs as empty slots still to collect. **Not a full-screen
modal** — the human's ruling, verbatim in
`project/brainstorms/2026-07-18-stamp-book-decisions.md`.

**Status:** building (plan
`docs/plans/fable-2026-07-18-stamp-book-resume.md`, session 214).
The original full-screen `book.ts` prototype is retired to
DEV-reference (Protos pane) — its drawing craft (seal press, thread
grammar) is the quarry the compact variants mine.

## E3.1 spec

### The document fiction (ADR-201 ruling 3)

The book is **the MC's own seal-book** — a pocket shuinchō he
carries, the one thing on his body that accumulates. Whoever grants
a rung presses their seal into HIS book; the book is the run's
memory from the MC's side of the table (the day-book is the house's
side — TST1: two documents, two owners, no overlap).

The granting hands, grounded in the bible's T0 ladder
(`docs/story-bible/tiers/t0.md`):

| Rung | Seal | The hand that presses it |
|---|---|---|
| R0 | 堰 the man from the weir | **Genemon** — terms over the open day-book; the book's first page |
| R1 | 日 the day-hand | **Genemon** — terms at the board, witnessed |
| R2 | 庭 the yard-hand | **no hand** — the silent rung ("a task simply not taken back"): the seal is the MC's own thumb-print in ink, unwitnessed |
| R3 | 蔵 the grain-watch | **Kihei** — he sets the watch; pressed after the wolf |
| R4 | 弟 the pupil | **Kihei** — the drill yard opens as his need |
| R5 | 疑 the accused | **the day-book itself** — Genemon presses; the book cleared him, no apology |
| R6 | 信 the trusted hand | **Genemon** — counted back to the mon under his finger |
| R7 | 名 the named hand | **Genemon** — the hand-me-down name, written then sealed |

R2's thumb-print and R5's day-book framing are FICTION READINGS of
existing bible facts, not new canon; if the HR read finds they
overreach, they soften to "Genemon, after the fact". Any genuinely
NEW bible fact (e.g. "hired hands carry seal-books") is proposed in
the HR bundle, never written into the bible by this surface.

### The compact grammar (what ≤20% of a screen must still say)

- **One strip, reading right → left** (the genre's rule survives
  the shrink): the earliest seal at the right edge, the run growing
  leftward toward the unpressed future.
- **Pressed seals** — small vermillion impressions (hand-rotated
  ±5°, press-patchiness), each carrying its rung glyph. The craft
  quarried from `book.ts` `pressStamp`, scaled down.
- **The thread** — ONE continuous ink stroke strung under/through
  the seals: knots where the run knotted (dated defeats between
  rungs), thin dry ink through lean stretches (long day-gaps
  between presses, derived — no stored "lean" mark).
- **The next slot** — the immediate next rung shows its NAME and an
  empty seal frame (ADR-201 ruling 5): you always know what you're
  climbing toward.
- **Future slots** — beyond the next: blank silhouettes only
  (mystery), pressure without spoilers.
- **Per-seal inspect (ruling 4)** — tap/click a pressed seal → a
  small popover: the hand that pressed it, the season + day, what
  the book remembers (the rung note). Tap the next slot → what it
  will take (the rung's requirement summary, TST4). No popover
  grows past a small card; there is NO expanded book view.
- **The afterglow (ruling 1)** — after a rank ceremony resolves,
  the strip presents itself once with the fresh seal pressing in
  (the reveal follows the story beat, TST3), then returns to its
  home. Choreography is per-variant craft.

### The home (ruling 2)

A **Record panel on the Character tab** — the backward-looking
"who am I / what have I done" surface. DEV-only behind the variants
toggle until the HR closes; prod integration is its own step.

### The blind-reader rubric (grades the built strip)

A fresh reader, given only the rendered strip at `rung-R7` (and at
a mid-run fixture), must be able to answer:

1. How far along is this run, and how much remains?
2. What is the player climbing toward NEXT (by name)?
3. Which stretch of the run was hardest (knots)?
4. Which stretch was lean (thin ink)?
5. Whose book is this — does it read as a carried personal record,
   or as a UI widget? (Andon Steel tokens only; no slop.)

Report to `project/audit/reports/`; failures route back into the
variant, not into the rubric.

## Files

- `book.ts` — the RETIRED full-screen prototype (`openStampBook()`),
  DEV Protos pane reference only. Reads the static `fixture.ts` run.
- `fixture.ts` — the static R0–R7 fixture history (kept as the
  DEV-demo fallback and the reference run).
- `from-state.ts` — the live derivation: `GameState` → the strip's
  data (pressed seals from the rung record, knots from dated
  defeats, next/future from the ranks registry). The SAME data
  feeds every variant (AC-6-shaped: one derivation, N renderings).
- `compact/` — the ADR-075 variants (one module per variant).

Story text obligations: any fiction-voiced caption a variant adds
is an ADR-139 narrative-diverge unit, not a freehand line.
