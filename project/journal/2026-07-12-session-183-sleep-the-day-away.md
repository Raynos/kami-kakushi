# Session 183 — 2026-07-12 — you may sleep the day away, but only in a bed you own

**Summary:** built the wait-a-day lever from
[`fable-2026-07-11-wait-a-day.md`](../../docs/plans/fable-2026-07-11-wait-a-day.md).
The human ruled the plan's Phase-0 option map (**ADR-187**): **option D alone** — a
`sleep` verb sited at the woodshed corner, **R4+**, one day boundary per press, with
**teeth**; F (a wait-button on the gate) is dead and the balance sim stays
**skip-blind**. The plan's core balance claim — *"the existing day-boundary sink is
price enough"* — was **checked and found false** before a line was written, and the
teeth exist because of it.

## What changed

- `docs/living/decisions.md` — **ADR-187**: the day-skip is a HOME verb; an idle day
  is a hungrier day; sleep is INSTANT; the sim stays skip-blind (a standing ruling, so
  this build cannot stall on a band violation the way HD-40 did).
- `docs/plans/fable-2026-07-11-wait-a-day.md` — Phase 0 closed. Status → LOCKED &
  BUILDING; the self-picked **D + F** recommendation struck and superseded; the ruling,
  the real price of a slept day, and the retired risks recorded.

## The survey finding that shaped the build (PH2 — verify, don't trust)

The plan asserted the price of a skipped day was already paid by the existing
day-boundary sink (ADR-163/ADR-178). It is not. `HUNGER_MEAL_RESTORE (25) ==
HUNGER_PER_DAY (25)` **by design** — a stocked kura *maintains* the belly — so on a
full kura a skipped day would have cost **3 shō and nothing else**. Near-free, and
the market rhythm would have collapsed into a menu. Surfaced to the human, who ruled
for teeth on both levers.

The second finding, which reversed the human's first instinct: **`panel-home` chains
to `tab-inventory`, which ADR-184 put at R4.** So "sleep at your corner" cannot reach
the R1 player who asked for it (FB-408, at the gate). Offered the rest-siting law as
a fix (sleep rough anywhere, better at home); the human **declined** — and ADR-184
had already signed the fiction that makes the refusal right: *"R1 never says where
you sleep — you are a nobody; you have no bed."* A man with no bed cannot sleep the
day away. **R1 goes unserved on purpose**; that itch is a content problem for the
zone-rung rebalance, not a skip.

## Next intended steps

1. Core: the `sleep` intent + `SLEEP_MEAL_FRACTION` seed + the `sleepForecast`
   selector (one source for reducer + hover, AC-6).
2. UI: Sleep joins the meta-verb row beside Rest, at the woodshed only.
3. Narrative: the sleep line, ADR-139 3-take diverge → HR-36.
4. Balance: `verify:balance` + `balance:report` — `t0-pacing.md` must come back
   **byte-identical** (the skip-blind ruling's proof).

## Landmines

- **Body ≠ belly.** `satiety` is the **body 体** (rest refills it); `hunger` is the
  **belly** (the kura ration refills it). The ruling's phrase "no rest refill → the
  belly slides" is not implementable literally — withholding a rest refill touches the
  *body*. The belly's only lever is the day-boundary ration, so that is where the
  teeth went (`SLEEP_MEAL_FRACTION`).
- The missed-pot belly loss is **pro-rated by what the kura could actually serve** — an
  empty kura serves no meal to sleep through, so a starving player is not
  double-punished.
