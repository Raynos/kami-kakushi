# Session 127 — 2026-07-09 — the authored-depth grill → Plan K (parked)

**Summary:** The human asked what separates real frontier-model work from
small tickets; of the big swings offered, they picked **authored depth** —
"the game only this can make." A full grill-me session locked the shape
(identity-bet-if-adopted, staged on T0 · investigation lane priced in the
idle economy · knowledge-web · question-accountability + ringed depth ·
exploration → plan → PARK, sequenced after v0.4.0) and the whole thing was
distilled into **Plan K**, written to Sonnet-5-buildable detail per the
human's directive. Nothing landed as canon — storywave and the current build
stay canon; un-park is the human's move.

## What changed

- `project/brainstorms/2026-07-09-authored-depth-direction.md` — NEW: the
  grill capture (Q1–Q7 + D1–D8, origin framing, outcome). The design
  authority behind the plan.
- `docs/plans/t0/fable-2026-07-09-authored-depth-demo.md` — NEW: Plan K,
  🧊 PARKED, in the tier subfolder so the active-plans scanners never nag it.
  Depth contract, core model (`threads.ts` / `threads-engine.ts` /
  `pursue_fact`), the `narrative/threads.md` grammar, the `verify-threads`
  gate, the kikigaki (聞書) tab, milestones K0–K6, two draft ADRs (identity
  bet; ADR-139 refinement) that land only at un-park.
- `project/todo-human.md` — reading-queue entry for Plan K (same-commit rule).
- `project/brainstorms/PARKED-THREADS.md` — pointer to the four unchosen big
  swings (ship-whole-game · studio inversion · thousand playtesters ·
  catalog) so they stay recallable.

## Next intended steps

1. Human reads Plan K (reading queue) — confirm the parked direction.
2. Everything else continues as before: storywave cutover (other agent),
   v0.4.0 work + human playtesting. Plan K sleeps until pulled forward.

## Landmines

- Plan K's K2 extends the FB-5 compiler — it must NOT be built concurrently
  with any other plan that owns compiler changes (storywave G3.5 precedent).
- ADR-139 stays canon as written; the refinement exists only as
  ADR-draft-K2 inside the parked plan. Don't cite it as policy yet.
- Shared tree during this session: another agent (w2:p2) had storywave G4
  src/ edits in flight; this session's commit is docs/project pathspec only.

---

## Addendum (same session) — the kikigaki feel-test prototype

The human asked for a standalone interactive mock of Plan K §U before judging
the concept ("the whole idea lives or dies by K4"). Built it as a claude.ai
artifact first, then brought it into the repo. It briefly targeted
`ui-demos/`, but the human called that dir a one-time ground and asked for it
DELETED — so the prototype landed in the NEW permanent home
`project/prototypes/kikigaki-depth/index.html` (rules in that dir's README:
self-contained, mock-only, lint-excluded, never imports `src/`), and
`ui-demos/` was retired to git history (ADR-127 carries the dated note; the
"01–09 stay" clause is superseded by the newer steer). The mock: all three §U variants
(book / ledger / scroll), the notebook beat, tick/coin-priced moves with
blocked-with-reason states, warmth gates, one resolution bite, one
authored-ambiguity bottom. Mock data throughout, Andon Steel tokens verbatim
from `styles.css`. Gallery + README + Plan K §U cross-linked. The human's
verdict on this mock is now the explicit gate on §U's shape at un-park time.

---

## Addendum 2 (same session) — verdict in; The Asking built

The human played the kikigaki mock and killed its interaction model, not its
layout ("book better; ledger/scroll bad" — but the move-list + priced clicks
+ warmth pumping = "a cheap UI" you click through blind). New surface brief:
work / stumble / no hints / no checklist / open-ended / only-Fable. Three
replacement concepts pitched; the human picked **The Asking** (free-text
questions, answers in voice, no menus) and rejected The Papers ("300 pages")
and The Overheard World ("don't feel the UI"). Built feel-test II at
`project/prototypes/the-asking/` — ~40-intent hand-built lexicon miniature,
hidden openness, deflections with a true-leak channel, buried 10th-vs-14th
aha-chain. Ten further concepts offered and captured in the brainstorm's
Round 2 section. Next: the human plays The Asking; verdict decides whether
Plan K §M/§U get rewritten around open input.

---

## Addendum 3 (session close) — five feel-tests, five fails; wrapped

The prototype loop ran to five: kikigaki (checklist — too cheap) → Asking I
(no direction — pointless) → Asking II + hints (synthesis: open input in,
clue-book out) → The Album (verdict: "a gacha hint button, no world
integration") → The Noticing (caught-not-vended anomaly-spotting in the
live log — verdict: "not fun lol"). Session wrapped there at the human's
call. The yield is real despite zero fun certs: a four-clause constraint
law any future depth-UI must satisfy (each clause paid for by a failure),
all five prototypes kept in `project/prototypes/` as the record to beat,
Plan K's §U re-marked as an OPEN problem with a warning not to build K4 as
written, and the Round-4 forest diagnosis on record (fragments may be
unable to carry the bet; the material, not the interface, may be the
missing ingredient). Plan K stays PARKED; canon untouched all evening.
Zoom-out lesson for future sessions, banked in the brainstorm: watch for
small-ball reconstituting itself inside a big swing via the
plan→prototype→iterate reflex.

---

## Addendum 4 (session close, part 2) — plan left in a good state

Final human steer before exit: prototypes regrouped per-plan
(`project/prototypes/authored-depth-demo/` — convention recorded in the
prototypes README), `the-asking` tagged ⭐ POTENTIAL / the rest REFERENCE,
and Plan K updated in place so it stands alone: §7/§U rewritten as the
Asking + clue-book synthesis (the combination the verdicts converged on),
§M amended (ask-driven latching; `availableMoves` internal-only), K2 gains
the `asking.md` intent-lexicon unit, K4 rewritten Sonnet-buildable with
K0-before-K4 binding, and a new §R section carries the five-feel-test
verdict table + the constraint law + the liked-fragments list. Plan stays
🧊 PARKED, sequenced after v0.4.0; un-park remains the human's move.
