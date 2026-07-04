# Requirements-based rung progression (human proposal, F121)

**Status:** PROPOSED — a design direction from the human (playtest capture F121,
2026-07-05). Needs a design pass + a scope call before any build. Not started.

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
