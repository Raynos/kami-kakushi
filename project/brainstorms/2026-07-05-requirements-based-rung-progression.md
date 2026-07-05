# Requirements-based rung progression (human proposal, F121)

**Status:** ~~PROPOSED — needs a design pass + a scope call~~ → **DIRECTION
LOCKED** (human grill, 2026-07-05 — outcomes below). ADR **D-137**; plan:
[`docs/plans/fable-2026-07-05-requirements-rung-progression.md`](../../docs/plans/fable-2026-07-05-requirements-rung-progression.md).

## The human's proposal (verbatim intent)

The rung progress meter (e.g. Day-labourer, **476/1100**) renders raw points as
a percentage bar. The human's read: **too much raw info** — _"a random ass
number that has to go up"_. Proposed instead:

- Each rung has a **finite list of named requirements**, completable in **any
  order**. As you complete them, the bar fills.
- Worked example (R0): 5 requirements — Rake **100 / 200 / 300 / 400 / 500**
  spilled rice → the meter jumps **20 / 40 / 60 / 80 / 100%**. At 100%, rung-up
  proceeds as today.
- **Move away from** "every activity yields N points; X points → rung up"
  (`RUNG_POINTS_PER_ACT` / `rungThreshold`) **toward** a checklist of concrete
  goals.

## Why it's a design fork (not a quick fix)

Today a rung is a **single points meter**: `balance.ts` `rungThreshold(rung)`
sets the points needed, every act adds `RUNG_POINTS_PER_ACT`, and `render.ts`
draws the `rung-head` bar + the `.rung-head-card` detail (the `476/1100`
readout). Requirements-based progression replaces that scalar with a **structured
list per rung** — a real change to the progression model, the balance sim, and
the meter UI.

## Open questions (for the human / a grill-me pass)

1. **Replace or wrap?** Do requirements REPLACE the points model, or is the
   points total derived from requirement completion (a presentation-only change
   over the same pacing)?
2. **Per-rung requirement lists.** R0–R7 each need an authored list. Who/what
   defines them — and do they stay tunable like the balance numbers (D-059)?
3. **Pacing / the F4 balance sim.** The sim (`verify:balance`, the `[3,22]`-min
   bands) measures time-to-rung off the points model. Requirements need to keep
   the same pacing envelope (or the bands re-derive). Does each requirement map
   to a known act-count so the sim still holds?
4. **Reveal cadence & fiction (T3).** Requirements are discovered/story-driven,
   not spawned? Do they read as diegetic goals, not a checklist HUD?
5. **Arbitrary-order UI.** How does the meter show partial completion across
   several open requirements (segments? a filled fraction? a list with ticks)?

## Next step

A **grill-me / diverge** design pass to lock Q1–Q5, then a plan. Touches
`balance.ts` (the rung model), `render.ts` (the rung-head UI), and the F4 sim.
Do NOT build until the human confirms the direction (R4).

## Grill outcomes (2026-07-05) — Q1–Q5 answered, direction LOCKED

Three AskUserQuestion rounds with the human; every open question above closed.
The plan + ADR D-137 carry the build spec — this is the decision record.

1. **Q1 replace-or-wrap → FULL REPLACE.** `RUNG_POINTS_PER_ACT`,
   `RUNG_METER_THRESHOLDS`, `rungThreshold()`, `state.rungMeter` all die.
2. **Q2 vocabulary → ANYTHING.** Counted acts, quest-token goals,
   economy/state predicates, story/social beats — the human, verbatim:
   *"anything. that's the point … it's not a stupid score, it's actually
   something meaningful to leveling up within your rung, and it can be gated
   by anything that's internally consistent for the game and the story."*
3. **Q3 pacing → RE-DERIVE the bands.** Author for fun/fiction first; the F4
   sim measures the new time-to-rung and the band numbers re-sign from it.
4. **Q4 fiction/reveal → HIDDEN requirements + flavor.** No checklist, no
   task-list HUD — *"you play the game, and as you play the game you make
   progress to the rungs based on your activities in the game and the world
   and the story."* Each completion fires a diegetic flavor log line. An
   optional hint system is DEFERRED; a **DEV-only cheatlist** ships now.
5. **Q5 meter UI → a rounded integer % bar** ("a score out of 100"). Counted
   requirements move it in **5–10 quantized chunks** across their span (not
   per-act ticks, not one atomic jump); atomic requirements jump whole.
6. **Gate shape (new, surfaced in grilling):** 100% ALONE unlocks the rung
   beat — `RankDef.storyGate` is deleted; story preconditions become
   requirements in the list; the D-110 hold + rung-up screen stay: *"once you
   hit 100% you unlock the story gate, then you can do a bit of story and the
   bit of story ends up with the rung UP screen … it explains within the
   story why you got promoted."*
7. **Authoring → F5 narrative markdown** (`requirements.md` → gen'd
   registry); counts live in the md, no balance.ts mirror (the cockpit's rung
   sliders retire). **Scope → all eight rungs R0–R7 in one pass.**
