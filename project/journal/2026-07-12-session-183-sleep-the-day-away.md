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

## The line (ADR-139 diverge → HR-36)

Three blind authors, three distinct dramatic briefs (the deliberate spender · the day
heard from sleep · the bed turned against him). **Canon = take C, "the coat keeps its
nail"** — the only take whose fiction *causes* the mechanic: it is built from the exact
three props the R4 ceremony line grants (*"a mat, a bowl, a nail for the coat: yours"*,
ADR-184), so the coat that never leaves its nail IS the forfeited day and the dry bowl
IS the pot he slept through. Take B was the best prose in the bundle and the worst fit —
it never touches the bed, and the bed is the entire reason the verb exists. All three
swap live in DEV → Story (`__setSleepLineOverride`, the `restOpenLine` pattern).

## Live playtest — the real PH6 proof (and the scare it gave me)

Drove the actual game headlessly at `:5173` (the shared herdr server, reused): loaded
`rung-R4`, walked to the corner, pressed the button. Everything the ADR promised is true
in the running game — button reachable only at the corner; day +1 waking at dawn; the
house eats 3 shō; the belly slides **12.5**; the body is untouched. Three presses in a
row (the market-day wait) = 3 days, **−9 shō, −37.5 belly** — exactly the price the ADR
predicted, and a real decision on a short kura.

**The scare:** my first DOM check said the sleep line *was not rendering*. The state had
the descriptor (`flavor.sleep`, correct prose) but `document.body.innerText` did not.
Before touching anything I ran the control — pressed **Rest**, the shipped verb — and its
line did not render either. The line lands on the log's **Now** channel (FB-53: fleeting
flavor never clutters the permanent channels) and the pane was filtered to **Story**. Not
a bug; my check was reading a filtered view. Switching the filter shows it, in the same
dimmed fleeting style as the rest line directly above it.

## Landmines

- **Body ≠ belly.** `satiety` is the **body 体** (rest refills it); `hunger` is the
  **belly** (the kura ration refills it). The ruling's phrase "no rest refill → the
  belly slides" is not implementable literally — withholding a rest refill touches the
  *body*. The belly's only lever is the day-boundary ration, so that is where the
  teeth went (`SLEEP_MEAL_FRACTION`).
- The missed-pot belly loss is **pro-rated by what the kura could actually serve** — an
  empty kura serves no meal to sleep through, so a starving player is not
  double-punished.
- **Do not "fix" a missing log line before running the control.** An ephemeral push at
  the ring cap evicts the OLDEST ephemeral entry, so a naive `entries.slice(before)`
  window silently shifts and hides the new line. Compare against a shipped verb first.
- The **balance-freshness gate only WARNS** at commit; it does not block. That is how
  session 182's pacing drift went a whole session unreported.
- **A co-agent's commit RESURRECTED a file I had archived.** `aa6a86ad` re-added
  `docs/plans/fable-2026-07-11-wait-a-day.md` — a *stale, mid-session* copy of a plan I
  had `git mv`'d to `project/archive/` — because a commit taken from the SHARED INDEX
  carried an entry my rename had superseded. It reds the `checkpoint` gate at HEAD (the
  plans region counts 2, the README says 1) while the working tree looks perfectly clean.
  **This is only visible from the committed tree**: `pnpm run verify` in the working tree
  is GREEN. Proving HEAD green in a throwaway worktree before pushing is what caught it —
  do not skip that step on a shared tree.

## Ripple + close-out

- **PRD** — the clock contract said time is *"an abstract clock advanced by active play"*.
  It now names the single exception: `sleep`, at your own corner, instant and priced, a
  lever for skipping **dead time, never the game**. `prd:drift` CLEAN.
- **Plan DONE + archived** to `project/archive/`; dropped from the reading queue. Its
  Status names what did **not** ship (option F; the R1 player) and why both were
  deliberate — so a cold reader cannot mistake the gaps for oversights.
- **Snapshot** records the verb, HR-36 and the skip-blind ruling; culled back to its
  120-line cap (the doc-budgets gate made me displace, which is the point of the cap).

## The taste scorecard — run late, and it found something real

I **skipped the ADR-135 two-pass flow** during the build and only caught it when the
human asked what was left. Ran **Pass 2 alone** (retro-writing a "before" brief would be
a lie): **14 ✔ · 1 ✘ · 6 —** on the button, its hover and the line's routing. The card is
on HR-36.

The **✘ is the useful part — P9, discover-don't-spawn: nothing tells the player the verb
exists.** The R4 beat grants the corner and the button simply appears beside Rest. It is
visible where the player already looks, but **unannounced** — which risks leaving FB-408's
itch alive for the very player this shipped for. A scorecard run *before* the build would
have caught it before the build; that is exactly the cost of skipping Pass 1, and it is
the argument for the rule.

**Ruled by the human (2026-07-12): the verb gets its OWN TINY BEAT AT THE CORNER** — a
one-off moment the first time you stand in your corner after R4, so it is **discovered in
place** rather than promised in advance on the grant line. Recorded on **ADR-187** as the
follow-up. **NOT BUILT** — it arrived at the exit, and starting a fresh feature mid-
checkpoint would have left it half-wired.

## Next intended steps

1. **BUILD THE ANNOUNCE BEAT** — now a real plan:
   [`opus-2026-07-12-sleep-announce-beat.md`](../../docs/plans/opus-2026-07-12-sleep-announce-beat.md),
   in the reading queue. *(It was originally recorded ONLY as an ADR bullet + a snapshot
   line + a journal entry — see "The recording bug" below.)* The plan **corrects ADR-187's
   follow-up**: no new write-once flag is needed — `enqueueScene` already once-guards a
   played scene, and `works.ts` has a per-node seen-flag idiom, so the latch is free.
2. **HR-36 is the human's** — press Sleep three times running (the market-day wait) and
   judge whether the line wears out. If it does, the fix is a **shorter canon line**, not
   a different take.
3. Then unchanged: T2 rungs/fog · telemetry distillation (6 usable FB-8 reports) · the
   save-format addendum.

## Landmines

- **Body ≠ belly.** `satiety` is the **body 体** (rest refills it); `hunger` is the
  **belly** (the kura ration refills it). The ruling's phrase "no rest refill → the
  belly slides" is not implementable literally — withholding a rest refill touches the
  *body*. The belly's only lever is the day-boundary ration, so that is where the
  teeth went (`SLEEP_MEAL_FRACTION`).
- The missed-pot belly loss is **pro-rated by what the kura could actually serve** — an
  empty kura serves no meal to sleep through, so a starving player is not
  double-punished.

## The recording bug — leftover work that isn't a plan VANISHES

The human, on reading where I had recorded the ruled-but-unbuilt announce beat (ADR-187
follow-up + snapshot line + journal + HR-36):

> **"If it's not in `docs/plans/` it will be lost and not built."**
> "When I wake up and look at the project, I think: if it's not in human-in-the-loop, or
> in my reading queue, or in `docs/plans/`, then it doesn't exist — it just vanishes into
> the 100s of commits."

He is right, and the failure is structural, not a lapse of memory. **The session brief
names startable work from `docs/plans/`.** An ADR bullet is *canon* (read when you already
know to look); a journal entry is *history*; a snapshot line is *prose a human skims*. None
of them is a **queue**. Work recorded only there is read, never picked up.

So the ruling became a real plan
([`opus-2026-07-12-sleep-announce-beat.md`](../../docs/plans/opus-2026-07-12-sleep-announce-beat.md)),
and the error mode itself is being fixed at three rungs (this session, below).

## The fix — three rungs, and the gate found year-old debt on its first run

Per AGENTS.md's own law (*push each rule to the highest rung that can **soundly** hold it —
gate > hook > skill > norm, calibrated so a gate never cries wolf*):

- **GATE (teeth) — `deferred-work`, the 19th gate** (`src/scripts/verify-deferred-work.ts`).
  A **shouted** `NOT built` / `RULED BUT NOT` in canon (`decisions.md`) or the snapshot must
  cite a **home** — a path into `plans/`, `BACKLOG.md`, `roadmap.md` or `human-in-the-loop/` —
  **within a line of the declaration**. RED otherwise.
- **RITUAL (judgment) — Checkpoint step 4, the leftover-work sweep**
  (`working-agreements.md`), and `/prepare-to-exit` may now only print **BYE** if the sweep is
  done. A new OOPS case: *"leftover work has no queue."* The gate cannot read a journal's
  intent; this step is what covers the quiet case.
- **CONTEXT (reach) — AGENTS.md**, always loaded, so it fires without anyone invoking a skill.

**Calibration is the whole job here, and it took three passes against the real tree** — a gate
that cries wolf gets bypassed within a week, and one with a hole is a false green (PH3):

1. Matching the bare word `UNBUILT` immediately red **ADR-117**, whose *title* is "the PRD's
   primary job is the forward spec of the **UNBUILT**" — a noun, not deferred work. Dropped.
2. Accepting a home cited **anywhere in the bullet** let the snapshot's resume line pass while
   citing **no plan of its own** — an unrelated T2 plan link elsewhere in the same numbered item
   covered for it. Tightened to a **±1-line window**.
3. Accepting a bare **`HR-nn`/`HD-nn`** let it pass again — those ids are sprinkled everywhere
   ("Human-gated: HD-40 + HR-1"), so *proximity to an id proves nothing*. Homes must now be
   **paths**. A pointer you can follow cannot be satisfied by accident.

RED-proved both ways: strip the plan pointer from ADR-187's follow-up (my original sin) or from
the snapshot's resume line, and the gate reds on exactly that line; restore it and it greens.

**On its first run it found real, orphaned debt:** **ADR-135** deferred the closed distill loop
("*is NOT built*") with the human's blessing — and no queue anywhere carried it. It has been
unowned since. Now parked in [`BACKLOG.md`](../BACKLOG.md), which is where the human's own
ruling said it belonged all along.
