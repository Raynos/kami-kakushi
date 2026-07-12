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

## The build (core + UI)

`sleep` is one intent, one seed, one selector and one button:

- `content/balance.ts` — `SLEEP_MEAL_FRACTION = 0.5` (SIM-OWNED SEED): what a *slept*
  day's ration restores, as a fraction of a worked day's. THE teeth.
- `selectors.ts` — `canSleep` (a bed, at your corner, R4+, not mid-VN) and
  `sleepForecast` (ticks to dawn · shō the house eats · the belly you lose). **One
  source** — the reducer spends exactly what the hover shows (AC-6).
- `intents.ts` — the `sleep` arm: advance to dawn through the SAME `advanceClock`
  every act uses (so exactly one `onDayBoundary` fires and the ration draw is
  today's code, untouched), then pay the missed pot on top. No body refill.
- `content/timing.ts` — `sleep: INSTANT` (a waiting bar would be dead *real* time).
- `render.ts` — "Sleep till morning", beside Rest in the meta-verb row, at the
  woodshed only; its hover reads the full price off `sleepForecast`.
- `sim/personas.ts` — `sleep` enters the intent census but **no persona `knows` it**:
  the skip-blind ruling, encoded where it can be violated.

**Three taxonomies caught it before I did** — the typecheck went RED at `INTENT_TIMING`
(classify it), `ALL_INTENTS` (the sim census) and `affordance-coverage` (the PH6 net:
every player intent must be dispatched by a real clickable control, or the sweep fails).
That last one now mounts the `rung-R4` fixture *standing in the woodshed* and clicks
the button for real — 19s, push-lane, green.

**RED-proof (PH3).** Stripped `adjustHunger(next, -f.missedMeal)` from the reducer and
re-ran: exactly three tests went RED — "a full-kura sleep is NOT belly-neutral", "the
belly slides on a run of sleeps", and the AC-6 forecast==reality test. The empty-kura
test stayed green, which is correct (no pot to sleep through). The teeth are load-bearing
and the tests can see them.

## The balance pass — and a stale report that was NOT mine (ADR-132)

The pacing report came back with **33 moved table rows**, which should have been
impossible: the sim is skip-blind by ruling, so `sleep` cannot move a single number.
Rather than assume, I proved the attribution — regenerated `t0-pacing.md` from a
**git worktree at `9b692a61`** (the tree *without* the sleep commit) and diffed:

- **Every pacing table is byte-identical** to the one my tree produces. The sleep verb
  moved **nothing** in the sim. The skip-blind ruling holds, demonstrably.
- My change contributes exactly **two lines**: the input fingerprint (a new design
  input), and each persona's never-issues list now ending in `sleep` — the ruling,
  printed in the report itself.
- **The 33 moved rows are session 182's.** ADR-184 re-mapped which zones open at which
  rungs, which changes travel and act counts across the whole ladder, and the report
  was never regenerated with it (the ADR-132 step was missed). This session's commit
  finally reports it. `verify:balance` GREEN; every climb rung is inside the signed
  [3,25] band (greedy R3 = 22.7, the ceiling).

**Landmine for the next session:** the balance-freshness gate only WARNS at commit time
(it does not block), so a content change that shifts pacing can land without its report.
That is how 182's drift went unreported for a session. The warn is easy to walk past.

## Next intended steps

1. Narrative: the sleep line, ADR-139 3-take diverge → HR-36.
2. Live playtest at the R4 corner (the real PH6 proof), then `/prd-ripple` §6.3.

## Landmines

- **Body ≠ belly.** `satiety` is the **body 体** (rest refills it); `hunger` is the
  **belly** (the kura ration refills it). The ruling's phrase "no rest refill → the
  belly slides" is not implementable literally — withholding a rest refill touches the
  *body*. The belly's only lever is the day-boundary ration, so that is where the
  teeth went (`SLEEP_MEAL_FRACTION`).
- The missed-pot belly loss is **pro-rated by what the kura could actually serve** — an
  empty kura serves no meal to sleep through, so a starving player is not
  double-punished.
