# session-182 — the zone-reveal law, built (ADR-184)

**Plan:** [`docs/plans/fable-2026-07-11-zone-rung-rebalance.md`](../../docs/plans/fable-2026-07-11-zone-rung-rebalance.md)
(signed mapping, human 2026-07-12) · **ADR:** ADR-184 · **Model:** Opus, throughout.

## What landed

**The law.** A zone opens only inside a VN; a rung-up VN opens **at most two**. It is a
**gate**, not a norm (`verify-content`: `room-*` ids per rank's `rewardOnReach.unlock`,
>2 is RED — proven RED-able by hanging a third zone on R4, then reverted). R1 used to
open four zones, three of them empty (FB-407/408/409); it now opens **one** — the paddy
its own requirement list demands.

**Five zones left the rung schedule for a VN of their own** (`src/core/reveals.ts`, the
AC-20 settle-pass glue beside `worksPass`):

| zone | fires when | beat |
|---|---|---|
| gate | R2+, at the board, holding coin ≥ the cheapest thing Yohei stocks | `sb-market` (new) |
| kitchen | R2+, at the board, carrying greens you can't eat raw | `sb-cook` (new) |
| field-margins | R3+, standing in the rows you work (the raided racks) | `sb-racks` (new) |
| weir-reeds | R3+, on the lease day | **`sb-lease` — already existed** |
| sickroom | the first hurt (`hp < hpMax`) | `sb-sickroom` (new) |

The survey's best find: **`sb-lease` was already this beat** (Matsuzō up from the river,
the screens rat-gnawed, *"send your man down"*). It needed a completion-effect flag, not
new prose. Four new VNs, not five.

**The woodshed MOVED, R1 → R4.** Its ceremony line — *"a mat, a bowl, a nail for the
coat: yours"* — was a lie: ADR-177 put the home grant on `tab-inventory` (R4), so R1
promised a bed you didn't get for three rungs. It is now true the moment it is spoken.
R1's Terms beat consequently says nothing about where you eat or sleep (mechanical
deletion, human-signed; the `r1-the-meals` topic went with the promises it hung on).

**Stage 1, the re-arm** (`unlock.ts`): a `room-*` id latched in `seenReveals` but no
longer visible drops out of the latch. w2 independently verified the asymmetry it fixes —
zone *access* already derives from the rung schedule (so an old save correctly loses a
re-rung zone), but the announce latch never un-latched, so the zone would have silently
re-granted with no ceremony. Zero new save fields; self-healing for every future re-map.

**The story wave** (ADR-139): three complete blind takes of the four-scene bundle
(`takes/zone-reveals/`), canon = take A. HR-33 has the live-review recipe and my honest
"where I'd expect you to overrule me" (take B answers the human's own *"the people are
pure flavor"* diagnosis better than canon does).

## The one thing that did NOT land, and why

The human picked **kitchen-only cooking** ("the pot is a place"). It is **built**
(`cookLoci`/`canCookHere`, the auto-loop's walk, the sim's) and **held** — one line in
`intents.ts` turns it on. The sim priced it: **R3 goes 22.7 → 31.6 wall-min, outside the
signed [3,25] band (ADR-056)**. The cost is pure walking and it is structural — every foe
is 3–4 hops from the only pot, and a fighter must mend between fights. Two player-model
fixes made it *worse*, not better (batching the greens bought 1 min; mending to
two-thirds sent the bot back out hurt, losing more and paying more trips). R3 was already
22.7 of a 25 ceiling, so any cost blows it.

Rather than fudge a signed band or push red, it is **HD-40** with the measurement and four
levers. Meanwhile the kitchen is not purposeless: **`verb-cook` now reveals WITH
`room-kitchen`**, so cooking exists at all only because O-Hisa taught you the pot (TST3) —
and that also fixed a real bug the sim caught, where the verb was visible at R2 with no
legal place to use it (the idler soft-locked trying to mend).

**Pacing verdict: exactly neutral.** Every rung within ±0.0 of HEAD — the zone law itself
costs nothing. (`balance-sim --summary` in the commit body.)

## Seams the build found (recorded because each changed a decision)

- **The works chain (ADR-177) sights the gate, the paddies AND the woodshed** — and the
  woodshed just moved to R4, which would have stalled the whole works ladder from R2 to
  R4. Fixed at the mechanism: the sighting counts only the zones you can **reach**
  (`works.ts` step 4, derived from the same visible set the map is gated by), and the
  un-walked zone still emits its own sighting line later, when it opens.
- **R3's kill requirements live in two VN-revealed zones** (`tanuki` at the margins,
  `river_rats` at the reeds — fights are spatial). So a side quest now gates a rung-up.
  The human ruled that is the design, not a defect: *"you don't have to force-feed
  players"* — the only failure is an obtuse trigger, so every reveal fires from labour the
  player (and the sim bot) is already doing at that rung.
- **A module-init import cycle** (surfaces → map → flavor) took the whole core down with a
  TDZ ReferenceError and reddened the shared tree for two other agents. The ink line is
  resolved at *announce* time now, never in the registry literal.

## The bug the SCREENSHOT found (and nothing else could)

The engine tests, the sim, the fixtures and the full arc were all green — and the game was
**broken at R1**. The Map tab is nav's sole home (FB-107) and the only travel affordance
there is, and it was keyed to `room-gate`, which used to be an R1 rung reward. The gate now
earns its own VN at R2, so at R1 **the Map tab did not exist**: the day-hand stood in the
forecourt with a 30-act farm requirement sited in a paddy he had no way to walk to.

Every test was right to stay green. `move_to` is a reducer intent and needs no tab to press,
so the arc, the sim and the fixtures all walked to the paddy quite happily. **Only
screenshotting the real game at R1 showed a screen with no way off it** — which is the whole
of PH6, learned the hard way: *what counts as built is what a human player can reach.*

Fixed by deriving the tab from the visible set — the map opens the moment a SECOND zone
exists (one zone means there is nowhere to go), so no future re-mapping can strand anyone
again. Shots: [`project/audit/screens/2026-07-12-zone-reveal-law/`](../audit/screens/2026-07-12-zone-reveal-law).

## Next intended steps

- HD-40 (the cook siting) and HR-33 (the story canon pick) are the two things waiting on
  the human; both are one-line flips once ruled.
- The re-voice plan (ADR-185, w6) authors against the R1 Terms beat this session emptied —
  **its final motivates list is `room-paddies, verb-farm, verb-haul, readout-clock,
  readout-stamina, panel-rung-ladder`**, and its prose must no longer promise meals at the
  threshold or a corner in the woodshed.
- PRD ripple (`/prd-ripple` + `prd:drift`) and the story-bible tier sheet's per-rung zone
  rows still owe this change; the `t0-pacing.md` + gen-region diffs rode in with it.
