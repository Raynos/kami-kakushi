# Plans

Pre-canon **implementation plans / proposals / reel-backs** — sequenced build
steps awaiting or under execution. This directory holds **active plans only**.

- **A plan lives here while it's live** (proposed, approved-but-unstarted, or in
  progress). Add a new plan to the [reading queue](../../project/todo-human.md) in
  the same commit you author it (a pre-commit gate enforces this).
- **Filename = `<model>-<series>-<slug>.md`** (human, 2026-07-03): prefix with
  the model of the session that WROTE the plan — `fable-` or `opus-` (extend
  the set as models arrive) — so the human can tell provenance at a glance.
  This is the authoring session's model (what the `Assisted-by:` trailer
  records), NOT who should build the plan (that's the "Who builds this"
  section inside). A pre-commit WARN nags an unprefixed new plan.
  `<series>` is the date by default; a named wave may replace it — e.g. the
  2026-07-03 process mega-session's plans are `process-F{n}`, where `n` is
  the **build-order rank** from
  [`fable-process-master-plan.md`](fable-process-master-plan.md) (human
  call, 2026-07-03 — renamed from the original `S{n}`/`N{n}` retro
  numbering; the master plan carries the rename map, and old names survive
  in journals/brainstorms as history). This `F` is the wave's rank letter,
  not a feedback item — context disambiguates. The F1 rank is split
  `F1a`/`F1b`: one merged build lane (a builds first), two review surfaces.
- **When a plan is done, archive it** — `git mv` it to
  [`../../project/archive/`](../../project/archive) the moment its Status line
  reads ✅ done, so this directory never accumulates finished plans and its file
  list always reflects what's *actually active*. Update any links that pointed at
  the old `docs/plans/` path in the same commit (the `md-links` gate will catch a
  stale link).

## Status-line vocabulary

Every plan opens with a `**Status:**` line, and the session-start brief
(`src/scripts/session-brief.sh`) classifies each plan as **archivable** or
**active** by reading the **leading status token** — the word(s) immediately
after `Status:`, up to the first separator (`—`, `-`, `:`, `(`). The token is a
**word**; a leading glyph (✅ 🔧 📋 …) is decoration, not signal. Prose may
follow the token freely.

**The rule the brief enforces:** _only a leading DONE-class token is
archivable._ A `✅` glyph anywhere, or the word "done" appearing **mid-line**
(e.g. "…is DONE only when all ten land"), is **not** the signal — the parser
keys off the first word after `Status:`, nothing else.

Canonical leading tokens and what each means for archival:

- **`DONE`** (and the synonyms `COMPLETE` / `SHIPPED`) — built **and** verified;
  the work is finished. → graduate the plan to
  [`../../project/archive/`](../../project/archive) (the brief nudges this).
- **`SUPERSEDED`** / **`ARCHIVED`** — no longer the live plan (replaced or
  retired). → also graduates out of `docs/plans/`.
- **`LOCKED`** — decisions / scope / ordering **ratified**, but the work is
  **NOT built yet**. → **stays active.** (This is the case the old substring
  matcher mis-tagged as done because of the leading `✅` glyph.)
- **`IN PROGRESS`** / **`ACTIVE`** / **`BUILDING`** — being built right now. →
  active.
- **`DRAFT`** / **`PROPOSED`** — authored but pre-sign-off. → active.
- **`BLOCKED`** / **`PLACEHOLDER`** — parked, waiting on a trigger. → active.

Anything that is not a leading DONE-class token (DONE / COMPLETE / SHIPPED /
SUPERSEDED / ARCHIVED) is treated as **active** and left in `docs/plans/`. This
`README.md` has no `Status:` line, so it is never classified as a plan. (A
future machine-token convention with a single closed vocabulary is scoped in
[`fable-process-F1a-mechanical-checkpoint.md`](fable-process-F1a-mechanical-checkpoint.md)
§2.2; until it lands, this section is the authority.)

Settled design graduates to [`../living/`](../living); the chronological "how it
got here" log is [`../../project/journal/`](../../project/journal).

_(No active plans right now — the v0.3.1 build plan finished and was archived to
`project/archive/2026-06-30-v0.3.1-build.md`.)_
