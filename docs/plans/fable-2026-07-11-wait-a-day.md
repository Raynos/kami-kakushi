# Give the player a way to pass dead time — the wait-a-day lever

**Status:** 📋 PROPOSED (2026-07-11, session 178)
**Confidence:** ( 15% Opus, 85% Fable ) — the mechanics are small; the judgment
is a pacing/design call (what waiting *means* in this game), which sits with
the human over this option map first.
**Template:** build

## Who builds this — Fable or Opus?

- **Phase 0 (this doc): the design pick** — human decision over the option
  map below; no build until an option is picked (the pick is the plan's
  whole point — FB-408 asked "Should we implement a wait a day button?").
- **Phase 1 (build the picked option):** mechanical — a new intent + a
  sited button + tests; **Opus-safe** once the option and its guard-rails
  are picked. The only taste-bearing piece is the one flavor line a skip
  emits (ADR-139 mini-diverge, any session can run it).

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

**Recommendation (self-picked default, PH4 — override freely):** **D + F**,
as a pair: D gives every rung a universal, fiction-caused day-ender; F
answers the specific market itch where it was felt, with the price shown.
B/C rejected outright (TST3 / active-only violations); E is already ~covered
by the autos. If only one may ship, ship **D** — it strengthens the home
loop the FB-409 fix just built, and the market wait then reads "sleep, walk
over in the morning", which is honest fiction.

**How it balances (applies to D and F):**

- The **price is the existing day-boundary sink** (ADR-163/ADR-178): shō/day
  from the kura + belly drain — no new constants; a skip on a short kura is
  felt immediately (hunger → poor rests → slow work, the ADR-178 teeth).
- **Forecast = reality (AC-6):** the button's hover shows the exact skip
  price through the same selector the reducer applies.
- **Refusal guards** reuse the FB-403 class: no skip during a timed action,
  a live VN, or a pending night-watch stage.
- **Pacing bands:** the sim's greedy persona gets the skip so t0-pacing.md's
  bands stay honest; expected effect — R1–R2 medians shrink slightly (less
  filler labour while waiting on 水・土), which the band [3,25] absorbs.

## Steps

> Step 1 is the decision; steps 2–4 build ONLY the picked option.

1. **Human picks an option** (the map above; my recommendation: **D + F**).
   Recorded as an ADR via the HD flow — this changes what the game's time
   is.
2. **Core intent** — add the picked skip intent(s) to `src/core/intents.ts`
   (guards: no in-flight timed action, intro done, no live VN; the skip
   advances whole ticks through the existing `advanceClock`, so day-boundary
   pricing fires exactly as today) + INTENT_TIMING classification.
3. **UI affordance** — site the button per the picked option (gate away-row
   / rest verb upgrade); AC-6: the hover forecast shows the price ("the
   house will eat N shō; belly −M") through the same selector the reducer
   uses. One skip flavor line, ADR-139 mini-diverge (3 takes).
4. **Balance pass** — ADR-132: `verify:balance` + `balance:report`, commit
   the regenerated `docs/content/t0-pacing.md`; extend the sim's greedy
   persona to use the skip where optimal so the pacing envelope sees it.

## Verification

- Unit (could go RED): a skip fires `onDayBoundary` exactly N times (rice
  drawn = N × shō/day, derived from the balance source, never a literal);
  refusal guards no-op mid-action / mid-VN / on a pending watch.
- Sim: `verify:balance` GREEN with the skip-aware persona; the t0-pacing.md
  diff IS the before/after (ADR-132).
- Player-reach (PH6): e2e — load the `rung-R1` fixture at the gate
  off-market, press the wait affordance, assert Yohei's live row appears and
  the kura count dropped by the forecast amount; capture a screenshot of the
  price forecast for the review.

## Sync ripple

- **PRD:** §6.3 (clock contract) gains the skip intent's classification —
  via `/prd-ripple` after the build lands; none until then (plan-stage).
- **Story-bible:** none — waiting is mechanics; the one flavor line rides
  the ADR-139 bundle, not bible canon.
- **Living docs / registries:** `docs/content/t0-pacing.md` regenerates
  (ADR-132); `gen:narrative` for the skip-line bundle; roadmap untouched
  (this is a T0 polish item, not a milestone).
- **CHANGELOG:** rides the next version bump's section; none now.

## Human-in-the-loop

- **The pick itself** — this plan IS the decision surface; on your read,
  either name an option here or I file it as an HD-item with D+F as the
  proposed default. Locking it becomes an ADR (it changes what time means).
- The skip flavor line: ADR-139 3-take diverge + its HR bundle (build
  phase).
- No taste-scorecard Pass 1 yet — no surface is being built until the pick.

## Non-goals

- **No season skipping** — seasons stay manual (`advance_season`, storywave
  G1); a day-skip never crosses a season boundary silently.
- **No wall-clock/offline time** — the active-only contract (PRD §6.9)
  stands; this lever moves GAME days, not real ones.
- **No zone-content rebalance** — that's the sibling plan
  (`fable-2026-07-11-zone-rung-rebalance.md`); this plan only prices the
  waiting the zones currently force.

## Risks

- **Scarcity erosion** is the real risk (option F especially): if playtest
  shows the 水・土 rhythm stops mattering, the fallback is D-only (one day
  per sleep, walk home first) — cheap rollback, the intent is additive.
- **Pacing-band drift:** a skip-aware sim may pull R1–R2 under the 3-min
  floor; if so the band or the market cadence (not the skip) is the lever
  to revisit, with the human.
- **Seam:** this plan owns `src/core/intents.ts` (skip intent), the gate
  away-row (`src/ui/render.ts` who's-here block), and reads `step.ts`
  read-only. In-flight neighbours: the zone-rung rebalance plan (same
  Do-panel region — land AFTER it or rebase the button siting) and the
  FB-410 zone-section diverge (owns the Do-panel's look — the away-row
  button must ride whichever variant wins). No live herdr peer holds these
  files (w2:p5 is on plan-audit docs).
