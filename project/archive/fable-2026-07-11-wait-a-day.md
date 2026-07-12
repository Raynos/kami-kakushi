# Give the player a way to pass dead time — the wait-a-day lever

**Status:** ✅ DONE (built 2026-07-12, session 183 — **ADR-187**; commits
`7b94ca47` · `ca582470` · `bfa72df8` · `b92b859c`). Phase 0 ruled by the human
(**D alone**, R4-home-sited, teeth on both levers, one day per press, sim
skip-blind); Phase 1 shipped: the `sleep` intent + `SLEEP_MEAL_FRACTION` seed +
`sleepForecast` (AC-6), the button beside Rest at the corner, the 3-take line
diverge (canon = C, HR-36), and the regenerated pacing report. **Verified in the
running game** (headless at `:5173`, `rung-R4` fixture): day +1 waking at dawn,
3 shō drawn, belly −12.5, body untouched; three presses = −9 shō, −37.5 belly.
**One thing is open and it is the human's:** HR-36 — press Sleep three times
running and judge whether the line wears out.
**Two things did NOT ship, both deliberate:** option **F** (a wait-button on the
gate) is dead by ruling, and the **R1 player who asked for this (FB-408) still has
no lever** — a nobody has no bed, and that itch is content's job, not the skip's.
**Confidence:** ( 15% Opus, 85% Fable ) — the mechanics are small; the judgment
is a pacing/design call (what waiting *means* in this game), which sits with
the human over this option map first.
**Template:** build

## Who builds this — Fable or Opus?

- **Phase 0 (this doc): the design pick** — ✅ **CLOSED** (human, 2026-07-12 —
  ADR-187). The pick was the plan's whole point (FB-408 asked "Should we
  implement a wait a day button?"); every fork below is now ruled.
- **Phase 1 (build the picked option):** mechanical — a new intent + a
  sited button + tests; **Opus-safe** once the option and its guard-rails
  are picked. The only taste-bearing piece is the one flavor line a skip
  emits (ADR-139 mini-diverge, any session can run it). **Opus is building
  it** (this session).

## Why

FB-408 (human capture, 2026-07-11, `r1` lane): _"What are the market days
are they frequent enough ? Should we implement a wait a day button ?"_ —
asked at the gate & gateyard, standing in a zone whose only content (Yohei's
stall) is elsewhere in time. Sibling captures FB-407/FB-409 (same session)
show the underlying itch: rungs where a zone has nothing to DO right now.
The dimmed schedule row ("Yohei — sets up on market days 水・土 — wait for
one", landed `07d1523d`) tells the player WHEN; this plan decides whether the
game gives them a lever to GET there without grinding filler.

The human explicitly requested this plan: _"Write a plan for the mechanical
wait a day button, what does it mean, how do you balance it ? Within the plan
list all the options & pros & cons."_ (2026-07-11, this session).

## What exists today

Survey date 2026-07-11 (HEAD `c6c6cb26`), all source-verified this session:

- **Time only moves through acts.** `advanceClock(state, ticks)` folds
  `singleTick` one tick at a time (`src/core/step.ts`); every act costs
  `TICKS_PER_ACT = 2` (`src/core/content/balance.ts`) against
  `TICKS_PER_DAY = 24` (`src/core/constants.ts`) — 12 acts to a day.
  There is NO idle wall-clock time: the tick loop is active-only (PRD §6.9).
- **A day boundary is already priced.** `onDayBoundary` (step.ts) drains the
  belly (`HUNGER_PER_DAY`) and feeds the household its steady shō/day from
  the kura, restoring the belly pro-rated by what the kura could serve
  (ADR-163/ADR-178) — so skipped days are NOT free: they eat stores and, on
  a short kura, they hurt.
- **Market scarcity is the beat being waited on.** `YOHEI_MARKET_DAYS =
  [2, 5]` (`src/core/content/market.ts`) — Wednesday 水 + Saturday 土, so
  the stall returns every 3–4 days; his finite purse (`YOHEI_PURSE_MON`) is
  the mon-inflow soft cap. Seasons are MANUAL (`advance_season`), so a
  day-skip never silently crosses a season.
- **Rest is already the "stop working" verb** (`rest`, timed 4000 ms,
  `src/core/content/timing.ts`), newly sited at the woodshed corner
  (FB-402/FB-409, `c6c6cb26`).

## The option map (the deliverable — all options, pros & cons)

**A · No button (status quo).** Waiting is implicit: you fill the days with
other work.
- Pros: market scarcity stays a real planning beat; zero build; the idle
  genre's default (there is always *something* to grind).
- Cons: exactly the FB-407/408/409 complaint — at rungs where a zone is
  empty, "fill the days" is filler; the player asked for the lever.

**B · Instant free "wait a day" button (global).** One click = +24 ticks.
- Pros: kills dead time outright; day-boundary pricing (rice + belly)
  already makes it non-free; trivial to build.
- Cons: collapses the market beat to on-demand ("skip-skip-sell"); a global
  chrome button with no fiction (violates TST3 — nothing in the world
  causes it); makes the attended-time pacing bands (3–25 min/rung,
  t0-pacing.md) partly meaningless since skipping compresses them at will.

**C · Timed "wait" action (real seconds per game day).** A day-skip as an
ADR-148 timed action (e.g. a 20–30 s bar), like travel.
- Pros: preserves time-as-cost; diegetic-ish (you are waiting somewhere).
- Cons: watching a bar is strictly worse than playing — it converts dead
  game-time into dead real-time; contradicts the active-only design (PRD
  §6.9: no wall-clock idling).

**D · "Sleep until morning" — an upgrade of rest, sited at your corner.**
Resting AT the woodshed corner (panel-home granted) optionally ends the day:
skip to next morning, apply the (sited, FB-409) rest refill once.
- Pros: the fiction causes the mechanic (TST3 — sleeping is how humans skip
  time); one home (TST1 — it extends the existing rest verb, no new chrome);
  compounds the woodshed's new purpose; naturally paced (one day per use,
  you must walk home first).
- Cons: doesn't directly answer "wait AT THE GATE for the market";
  sleep-spamming through a lean winter is possible (guard: the day-boundary
  rice/belly price, which bites hardest exactly when stores are short).

**E · "Work till dusk" macro.** Auto-repeat the current labour until the day
ends.
- Pros: idle-native; the economy keeps flowing while time passes.
- Cons: not a waiting lever at all — it needs work to exist, and the
  complaint arises precisely where NO work exists; the auto-toggles
  (FB-146/FB-266) already approximate it.

**F · Targeted "wait for the market day" — sited on the gate's away row.**
The FB-408 dimmed row grows a button: skip to the NEXT market morning
(1–3 days), with the consumption forecast shown before you commit.
- Pros: exactly the captured player intent; sited + diegetic (you wait for
  him at the gate); self-limiting (only exists at the gate, only
  off-market); the multi-day price (shō/day × days, belly) is a real
  decision on a short kura.
- Cons: the strongest scarcity erosion — the 水・土 rhythm becomes a menu
  option; multi-day skips can blow past night-watch/quest windows (guard:
  refuse while a quest step or watch is pending, same guard class as the
  VN/timed-action refusals).

~~**Recommendation (self-picked default, PH4 — override freely):** **D + F**,
as a pair.~~ → **SUPERSEDED by the human's ruling, 2026-07-12 (ADR-187): D
ALONE.** The gate grows no wait button. See "The ruling" below.

## The ruling (human, 2026-07-12 — ADR-187)

Phase 0 is closed. The five forks, as ruled:

1. **The option: D alone.** A `sleep` verb at your woodshed corner. **F is
   rejected** — no wait-button on the gate's Yohei row.
2. **Sleep is a HOME verb: R4+, and R1 is left unserved — on purpose.**
   `panel-home` chains to `tab-inventory`, which ADR-184 put at **R4**, so
   the FB-408 player (at R1, at the gate) does **not** get this lever. That
   is not a hole: ADR-184 already signed the fiction — *"R1 never says where
   you sleep — you are a nobody; you have no bed"* — and **a man with no bed
   cannot sleep the day away.** The offered alternative (a rough sleep
   anywhere from R0, mirroring the open-rest law) was declined: it would buy
   R1 a lever at the cost of the one thing R4's corner is for. The R1–R3
   empty-zone itch is a **content** problem, answered by the sibling
   zone-rung rebalance — not by a skip.
3. **One press = one day boundary, always.** Wake at dawn; three presses to
   reach 水 from 日. No multi-day jump.
4. **Teeth on both levers** (the plan's "the day-boundary sink is price
   enough" was **checked and found false** — see below).
5. **The balance sim stays SKIP-BLIND** (standing ruling): the greedy
   persona never sleeps, so the pacing bands keep measuring real play and
   this build cannot stall on a band violation (the HD-40 failure mode).

**How it balances — the price of a slept day.** The plan's claim that the
existing day-boundary sink prices a skip is **wrong**, and the survey caught
it: `HUNGER_MEAL_RESTORE (25) == HUNGER_PER_DAY (25)` *by design* — a stocked
kura MAINTAINS the belly — so a skipped day on a full kura would cost **3 shō
and nothing else**. Near-free. The ruled price:

- **You earn nothing** — sleep forfeits every remaining tick of today (the
  acts you'd have worked are gone). Sleeping early costs more; the verb
  prices itself, no constant needed.
- **The house still eats** — `CONSUMPTION_SHO_PER_DAY` leaves the kura on a
  slept boundary exactly as on a worked one.
- **You slept through the pot** — on a slept boundary the ration restores only
  `SLEEP_MEAL_FRACTION` (SIM-OWNED SEED, 0.5) of the belly it would have. The
  belly **slides on a run of sleeps**, into ADR-178's teeth (a hungry body
  rests poorly and works slowly) — exactly where a skip-spammer belongs.
- **Sleeping is not resting** — no body refill. `rest` (2 ticks) stays the only
  way to put the body back, and strictly the efficient one. Sleep buys time,
  and only time.
- **Forecast = reality (AC-6):** the button's hover reads the exact price (shō
  drawn, belly lost) through the **same selector the reducer applies**.
- **INSTANT, not a timed bar** (ADR-148): a waiting bar would convert dead game
  time into dead real time (option C's fatal flaw). The safety is legibility,
  not delay.
- **Refusal guards:** no sleep mid-VN (intro / rung beat / live scene) or away
  from your corner; the shell already hides the verb row behind a live VN, and
  the reducer refuses independently (pure-core guard, not a UI accident).

## Steps

> Step 1 is the decision (✅ closed — ADR-187); steps 2–5 build **option D only**.

1. ✅ **Human picks an option** — **D alone**, R4-home-sited, teeth on both
   levers, one day per press, sim skip-blind. Recorded as **ADR-187** (it
   changes what the game's time is).
2. **Core** — the `sleep` intent (`src/core/intents.ts`) + its
   `INTENT_TIMING` classification (INSTANT); the `SLEEP_MEAL_FRACTION` seed
   (`content/balance.ts`); a `sleepForecast` selector (`selectors.ts`) that
   is the ONE source both the reducer and the hover read (AC-6). Sleep
   advances `TICKS_PER_DAY − tick` whole ticks through the existing
   `advanceClock`, so exactly ONE `onDayBoundary` fires and the ration draw
   is today's code, unchanged; the missed-pot belly loss is applied on top,
   pro-rated by what the kura could actually serve (an empty kura serves no
   meal to sleep through — it cannot double-punish).
3. **UI** — `sleep` joins the meta-verb row beside "Rest a moment"
   (`availableActions` → `META_LABELS`), visible ONLY at the woodshed with
   `panel-home`. Its hover reads the exact price from `sleepForecast` ("the
   house eats N shō · belly −M · you wake at dawn").
4. **Narrative** — one sleep line, ADR-139 mini-diverge (3 blind takes, DEV
   story-switcher swap, HR bundle). Core-emitted → the declaring-module
   setter pattern (`__setSleepLineOverride`, the `restOpenLine` idiom).
5. **Balance pass** — ADR-132: `verify:balance` + `balance:report`. The sim
   is **skip-blind by ruling**, so `docs/content/t0-pacing.md` must
   regenerate **byte-identical** — that no-op diff IS the proof the ruling
   held (a moved band would mean the sim learned to sleep, which is a RED).

## Verification

- Unit (could go RED): a sleep fires `onDayBoundary` **exactly once** (rice
  drawn == `CONSUMPTION_SHO_PER_DAY`, read from the balance source, never a
  literal); it lands at `tick === 0` of `day + 1` from ANY starting tick; the
  belly loss == the day's drain minus the **fractioned** ration (so a run of
  sleeps slides it, and a full-kura sleep is NOT belly-neutral — the exact
  bug the survey caught); an EMPTY kura sleeps without double-punishing; the
  body is **unchanged** (sleeping is not resting); refusal guards no-op away
  from the corner, pre-`panel-home`, and mid-VN.
- Sim: `verify:balance` GREEN and `t0-pacing.md` **byte-identical** (the
  skip-blind ruling's proof).
- Player-reach (PH6): the `rung-R4` fixture (generated — the rung where the
  corner becomes yours), walk to the woodshed, press Sleep, assert the day
  advanced by one, the kura dropped by the ration, the belly slid, and the
  sleep line landed. Screenshot the hover forecast for the review.

## Sync ripple

- **PRD:** §6.3 (clock contract) gains the `sleep` intent's classification —
  time now moves by a second means, and that is a PRD-visible fact. Via
  `/prd-ripple` once the build lands.
- **Story-bible:** none — waiting is mechanics; the one sleep line rides the
  ADR-139 bundle, not bible canon. (The *fiction* it leans on — "no bed at
  R1" — is already ADR-184's, signed.)
- **Living docs / registries:** `docs/content/t0-pacing.md` regenerates
  (ADR-132) — and must come back **byte-identical**; `gen:narrative` for the
  sleep-line bundle; roadmap untouched (a T0 polish item, not a milestone).
- **CHANGELOG:** rides the next version bump's section; none now.
- **decisions.md:** ADR-187 ✅ (landed with this plan's lock).

## Human-in-the-loop

- ✅ **The pick itself** — ruled 2026-07-12 (D alone, R4-sited, teeth, one day
  per press, sim skip-blind) → **ADR-187**.
- **HR-36** — the sleep line's ADR-139 3-take bundle, reviewed live in the DEV
  Story switcher (build phase).
- **Taste-scorecard Pass 1** — runs on the verb row before the button is built
  (the surface is small: one button + its forecast hover).

## Non-goals

- **No season skipping** — seasons stay manual (`advance_season`, storywave
  G1); a day-skip never crosses a season boundary silently.
- **No wall-clock/offline time** — the active-only contract (PRD §6.9)
  stands; this lever moves GAME days, not real ones.
- **No zone-content rebalance** — that's the sibling plan
  (`fable-2026-07-11-zone-rung-rebalance.md`); this plan only prices the
  waiting the zones currently force.

## Risks

- ~~**Scarcity erosion**~~ — **retired by the ruling.** F is dead, so the 水・土
  rhythm is only reachable by owning a bed and paying rice + hunger per dawn.
  The rhythm survives.
- ~~**Pacing-band drift**~~ — **retired by the ruling.** The sim is skip-blind,
  so no band can move. If a future session teaches the persona to sleep, that
  is a new decision and it reopens this risk.
- **The R1 player still has nothing** (accepted, eyes open). FB-408 asked at
  R1 and gets no lever from this plan. If the zone-rung rebalance does not
  fill R1–R3's empty zones with real content, the itch returns — and the
  answer is still content, not a skip (ADR-187).
- **Teeth calibration.** `SLEEP_MEAL_FRACTION = 0.5` is a SEED: three sleeps
  to reach a market day cost ~9 shō and slide the belly ~37 points. If that
  reads punishing in play, it is a **cockpit** dial (ADR-134), not a redesign.
- **Seam:** this plan owns the `sleep` intent (`src/core/intents.ts`), the
  meta-verb row's Sleep button (`src/ui/render.ts`), `SLEEP_MEAL_FRACTION`
  (`content/balance.ts`), `sleepForecast` (`selectors.ts`) and the sleep line
  (`content/narrative/flavor.md` + `flavor.ts`); it reads `step.ts` read-only.
  The zone-rung rebalance plan it was told to land after is **✅ done and
  archived** (ADR-184, `a4863592`/`5f667ef9`), so that seam is clear.
