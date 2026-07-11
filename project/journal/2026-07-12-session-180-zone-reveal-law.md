# Session 180 — the zone-reveal law (sign-off pass on the zone-rung rebalance)

**Date:** 2026-07-12
**Branch:** main (shared tree — 3 other agents live)

## What happened

The human asked to be walked through every open decision in
`docs/plans/fable-2026-07-11-zone-rung-rebalance.md` before building it. The
walk-through turned the plan inside out: what was a "re-time three reveals"
proposal is now a **reveal-architecture change**, signed.

### The steer that raised the ceiling

> _"A zone should open up only in a VN — lock that in as a guideline. We can
> unlock a max of two zones per rung-up VN. If it's better to reveal a zone
> through a side quest with its own VN, I'm more than happy to do that."_ …
> _"The more side quests the better."_

And the diagnosis under the kitchen call, recorded because it outlives this plan:
_"the people and the talking is also weak as implemented in R1 — pure flavor with
no gameplay/story purpose atm."_ That indicts the **talk system**, not the zone
map; parked as its own thread, deliberately kept out of this plan.

### Signed mapping

Rung-up VNs (≤2 each): R1 paddies · R2 woodlot · R3 kura · R4 drill-yard +
**woodshed** · R5 shrine + orchard · R6 none · R7 grove. **No floor.**
Five zones leave the rung schedule for fact/quest VN reveals: **gate**
(first-market side quest), **kitchen** (learn-to-cook, after forage),
**field-margins** (pest beat), **sickroom** (first-hurt), **weir-reeds**
(Matsuzō's leased screen) — joining `room-forecourt` and `room-weir`, which
already work this way.

## Four source corrections (PH2 — the draft was checked, not trusted)

1. **`ranks.ts:60` is stale/wrong** — it claims R1 opens the gate "for haul";
   `haul_stores` sites at the **forecourt** (`activities.ts:62`). Moving the gate
   never endangered the R1→R2 requirement. Dies in Stage 2.
2. **Zone access is NOT a latched save fact** — correction from the concurrent
   save-format session, re-verified here. `unlock.ts:6`: the save's only
   reveal-shaped field is `seenReveals`; access derives from `grantedByRung()`
   each move. So old saves **snap to the new pacing for free** and the planned
   save-migration hand-off **dissolves**. The real residual is the inverse: the
   latch never un-arms, so a moved zone would **silently** re-grant with no
   ceremony.
3. **`verb-cook` already exists** (`unlock.ts:71`, `intents.ts:819`) gated on
   `row-sansai`. The cooking loop is **built but homeless** — the kitchen work
   shrank from "build a feature" to "site a verb + author its VN".
4. **The kitchen has three people**, not two (O-Yae, `people.ts:196`) — the
   densest talk node in the game. The gate has Iori twice a year on top of
   Yohei's 2-in-7.

## The one design call I originated

The human found the re-arm trade-off hard to read (a general save-stamped
mechanism vs. a one-shot strip). Proposed a third door and it was signed: **derive
the re-arm** — on load, drop from `seenReveals` any `room-*` no longer in the
visible set. Zero new save fields (no collision with the live save-format
rework), self-healing for every future re-mapping. It works *because* of
correction 2: visibility is always recomputed from `src/`, so the latch can simply
answer to the derivation.

## Also found

`canMove` (`map.ts:294`) checks only the destination's reveal, not the origin — a
player standing in a de-revealed kitchen can still walk out. No soft-lock, but
they'd stand in a zone absent from their map. Flagged as a required test.

## Next intended steps

Build Stage 0 (the ADR + the ≤2 verify gate, proven RED-able) → Stage 1 (the
derived re-arm) → Stage 2 (rewire `ranks.ts`/`surfaces.ts`). Stage 3 is the
five-VN content wave (ADR-139, one HR bundle); nothing ships until it lands
(human's "one plan, staged" call). Opus throughout.
