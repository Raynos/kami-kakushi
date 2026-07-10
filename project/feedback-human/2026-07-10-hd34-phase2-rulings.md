# HD-34 rulings — Phase-2 ratio + idler ascension (2026-07-10, session 137)

The human opened the session asking HD-34 be fixed, with two clarifying
questions first (answered in-chat before the ruling):

> HD-34 You'll need to fix this, I dont know in which way you fix the phase-2
> ratio breach;
>
> Is it that R0 - R7 is too fast or phase 2 is too slow ? What was the goal for
> both and what was the ratio goal ?
>
> 2. "idler ascends T0" i dont know what that means, i dont what the issue is,
> what do you mean an idler does not ascend ?

Clarification given: Phase 1 sits inside its own signed band (ADR-056), so
against the signed ≈1:1 law (ADR-133/HD-19, band [0.8, 1.2]) Phase 2 is the
side out of spec — ~4.4× too slow, because `ESTATE_DEED_PER_ACT` was tuned
against the old pre-rewrite climb. "An idler ascends T0" = the idle-play
persona completing the tier (R7 + Estate EXCELLENT + `ascend`); it climbs the
full ladder but banks essentially no estate deeds idling, so it never ascends.

## Rulings (via AskUserQuestion, both the recommended options)

1. **Phase-2 ratio breach → "Re-tune Phase 2 to ≈1:1"** — honor the signed
   law; raise the deed magnitude so Phase 2 ≈ Phase 1 again, sim-verified into
   [0.8, 1.2]. (Alternatives declined: re-sign the band to ~4–5×, a ~2×
   middle target, or defer to a cockpit sitting.)
2. **"Is 'an idler ascends T0' a design promise?" → "No — attention-priced"**
   — idling gets you to R7 but not through ascension; the sim expectation
   re-signs to full-ladder for the idler.

B8 (the zero-cost season-turn pool refill) was not separately ruled; per the
HD-34 evidence it shows no pacing breakage, so it stays no-action with the
mechanism options available if the human's own play feels the wheel-spin cheap.

Applied as **ADR-170**; the R3–R6 band-scope remainder filed as **HD-35**.
