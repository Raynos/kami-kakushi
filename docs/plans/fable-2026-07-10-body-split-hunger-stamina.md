# The body split — hunger vs stamina as two legible stores

**Status:** 📋 PROPOSED — authored from the r1 inbox drain (FB-345 ruling:
_"Come up with a full on plan and schedule it in docs/plans/ but dont build
it"_). Nothing here is built; Phase 0 is the human's ruling pass.
**Confidence:** ( 30% Opus, 70% Fable ) — the load-bearing work is the design
ruling + the balance re-tune feel (Phases 0/3); the core-model mechanics and
UI transcription (Phases 1–2) are Opus-safe once ruled.
**Sources:** FB-334 (_"rest +18 satiety?"_), FB-335 (_"does this render
Satiety or body or stamin?"_), FB-345 (verbatim below) — all r1-lane captures,
2026-07-10; the estate plan's non-goal note (this thread is "real, adjacent,
owned by its own drain thread").

> **FB-345 verbatim:** _"I definitely feel like the whole game has merged the
> notion of 'stamina' and 'hunger' / Like theres a bar for hunger and energy
> from food / And a bar for stamina and how much you can work. / I think those
> can be two bars shown above, body with two bars next to them or someone?"_

## Who builds this — Fable or Opus?

- **Phase 0 (rulings)** — the human, walked by **Fable** (design forks with
  balance-feel consequences; mirrors the estate plan's Phase-0 pattern).
- **Phase 1 (core model)** — **Opus-safe**: mechanical once the option is
  ruled (new store + drain/refill rules + selectors, test-first).
- **Phase 2 (UI)** — **Opus-safe** with the taste-scorecard Pass 1 brief; the
  two-bar header layout is small and the FB-335 readout idiom already exists.
- **Phase 3 (balance re-tune)** — **Fable**: pacing feel + the ADR-132
  machine-verdict flow + telemetry step 0.

## The problem (what the build actually is today)

One store carries both concepts. `character.satiety` (displayed **"body"**,
FB-334 vocabulary) is:

- **drained by work** — every timed act costs `SATIETY_PER_ACT` (labour,
  rake), i.e. it behaves as *stamina*;
- **refilled by food AND rest** — `SATIETY_PER_REST` (+ home comfort bonus),
  `EAT_RICE_SATIETY`, cook — i.e. it also behaves as *hunger/food energy*;
- **throttling the day** via `staminaRate()` (flat above
  `STAMINA_FLAT_ABOVE`, ramping to `STAMINA_RATE_FLOOR` — slows, never
  blocks);
- **capped by growth** — `satietyMax()` grows with combat level + estate
  stages + home comfort.

HP is separate (combat-only, mends by eating — ADR-050/ADR-076). The merge is
real, deliberate simplification — and the human reads it as TWO ideas wearing
one bar.

## Design options (Phase 0 picks ONE)

- **Option A — full split, coupled stores.** `hunger` drains by TIME (per
  tick/day) and by nothing else; food refills hunger only. `stamina` drains by
  WORK; rest refills stamina; **hunger gates stamina recovery** (hungry rest
  is poor rest) and low hunger applies the `staminaRate` throttle. Two bars.
  The classic idle-survival loop; deepest, most levers, biggest re-tune.
- **Option B — split display, one store.** Keep ONE pool; render *work
  charge* (short cycle: spent by acts, rest refills) and *nourishment* (the
  slow floor food maintains) as two derived bars over the same store. Zero
  balance ripple, but arguably re-states the confusion with more ink — the
  two bars would move in lockstep.
- **Option C — stamina short-cycle + hunger daily-cycle.** `stamina` is the
  per-act fuel (today's satiety, unchanged numbers); `hunger` is a NEW slow
  daily store food maintains, whose only teeth are a rest-quality/rate
  multiplier (no starvation death; T0 stays gentle). Middle cost: core adds
  one store + one coupling, existing balance mostly survives.

**Recommendation: Option C.** It honors the human's read (food-energy vs
work-capacity are visibly different bars moving on different clocks) without
re-tuning every act cost in T0 (ADR-172 pacing stands), and it keeps the
"eating mends wounds" HP coupling untouched.

## Phases (build order after Phase 0 rules)

1. **Phase 0 — rulings (human):** pick A/B/C; name the two bars (body 体 +
   what — belly 腹? provisions?); rule whether hunger can kill or only slow
   (recommend: only slow, T0); rule the FB-343 re-home (do food verbs move to
   the future Inventory tab once Schedule A lands, or stay zone actions?).
2. **Phase 1 — core model (test-first, tdd skill):** the ruled store(s) +
   drain/refill in `step.ts`/`intents.ts`, selectors mirroring
   `satietyMax`/`staminaRate`, save-schema migration, autoplay/defeat
   interactions, invariants test (ADR-088 lane).
3. **Phase 2 — UI:** the header two-bar group (FB-335 idiom: label + bar +
   `cur/max` + hover title per bar), forecasts/act-cards/tooltips re-derived
   from the same selectors (AC-6 — FB-346's titles pick the change up for
   free), taste-scorecard both passes.
4. **Phase 3 — balance verdict:** telemetry step 0 (read
   `project/telemetry/` first), `verify:balance` → `balance:report`, commit
   the regenerated `docs/content/t0-pacing.md` with the change (ADR-132).

## Ripple map (what else must move)

- **PRD:** §4 balance numbers are provisional — ripple via `/prd-ripple`
  (system change → targeted edit + ADR).
- **Story bible:** none expected (no fiction promises a single body bar).
- **Docs:** `ui-design.md` vitals section; `fun-factor.md` if the idle loop's
  push-your-luck read changes.
- **Vocabulary:** FB-334's law extends — internal field names never surface;
  the two DISPLAY names are canon the moment Phase 0 picks them.

## Non-goals

- No starvation-death mechanic in T0 (unless Phase 0 rules otherwise).
- No HP-model change (eating-heals stays, ADR-050/ADR-076).
- No re-tune of act costs/yields beyond what the ruled option forces
  (ADR-172 stands).
