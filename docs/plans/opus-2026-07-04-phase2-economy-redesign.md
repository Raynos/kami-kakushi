# T0 Phase-2 economy redesign — make the back half EARN its ~1:1

**Status:** 📋 PROPOSED — awaiting sign-off (design divergence; human picks the loop)

> **What this is.** The REAL Phase-2 redesign that ADR-133 queued as the follow-on
> to the quick threshold hotfix. ADR-133 locked the *law* (Phase 2 ≈ Phase 1 in
> wall-time, `PHASE2_PHASE1_RATIO_BAND = [0.8, 1.2]`, a hard `verify:balance`
> gate) and a stopgap hotfix greens that gate by *stretching a threshold*. But
> the band gate proves **duration**, not **fun** — a threshold-only stretch is 83
> minutes of clicking one repeated action, exactly the "dead consolidation half"
> the PRD (§1.6.4 / §3.0.1) warns against. **This plan owns the fun.** It makes
> T0 Phase 2 a real, textured ~40–83-min chunk: multiple deed sources, the estate
> visibly BUILDING (E0→E1 as pacing beats), authored reveals, meaningful choices.
>
> **This plan is DESIGN-DIVERGENT on purpose.** §2 proposes 2–3 genuinely
> distinct answers to "what is the Phase-2 loop"; it deliberately does **not**
> pre-collapse to one. The human (or the parent, with the human's steer) picks
> the loop before any building starts. Everything downstream (§3–§8) is written
> to hold for whichever loop is chosen, flagging where the choice changes the
> work.

---

## Who builds this — Fable or Opus?

**Verdict: Opus for the design + core loop; a cheaper model may take the
mechanical tail (constant wiring, doc regen, persona-bot plumbing) once the loop
is locked.** This is the taste-and-fun-critical heart of T0 — it decides what the
player *does* for the back half of the tier, it is bound to the four taste values
and the fun-factor doc, and it touches the pure-core economy that every later
tier's Phase 2 inherits (ADR-133 made 1:1 a general law). That judgment
concentrates in the design pass and the core reducer/selector work. Split:

- **Phase 0 (design lock) — Opus.** Run `diverge` on the loop options in §2 with
  the human; lock the chosen loop + its provisional magnitudes. This is where the
  fun lives or dies; do not delegate.
- **Phase 1–3 (core loop + reveals + balance) — Opus.** The pure-core deed
  sources, the staged-build state machine, the seasonal-judge interaction, and
  the RED-able tests that assert the *design levers* (not collapsed metrics) are
  Opus work — a mis-derived fixture or a tautological test here is a false green
  on the game's spine (PH3).
- **Phase 4 (UI surfaces) — Opus to design the variants (ADR-075 diverge), a
  cheaper model MAY implement a locked variant.** New Phase-2 surfaces (a
  build-progress tracker; if Option C, an allocation panel) are new UI → ADR-075
  mandatory. Opus authors the 2–3 working variants + self-picks the default; a
  Sonnet-class builder can wire an already-designed variant.
- **Mechanical tail — cheaper model OK.** Once the loop + magnitudes are locked:
  regenerating `docs/content/t0-pacing.md`, wiring new balance constants that are
  already specified, extending the sim personas to exercise the new intents, and
  the PRD gen-region regen are mechanical and cheaply delegable (with an Opus
  review of the balance verdict). Per ADR-124 these inherit the parent model unless
  the human routes otherwise; the smaller-model drop is the sanctioned
  exploration/boilerplate exception only.

**Model-routing note (ADR-124):** nothing here self-authorizes an Opus→Fable
switch; the cheaper-model lines above are *proposals for the human to approve*,
scoped to plainly-mechanical sub-phases.

---

## 1 · Design goal

**Make T0 Phase 2 a real, ~1:1 (≈40–83 wall-min) *fun* chunk — not a
threshold-inflated slog.** Phase 2 must have its own texture, distinct from the
Phase-1 rung climb it mirrors in length:

- **Multiple deed sources**, not one repeated `do_activity`. The player should
  have several things worth doing that all feed the Estate pillar, each with its
  own cadence and its own reason.
- **The estate visibly BUILDING.** E0 Foreclosure's-Edge → E1 Stabilising should
  advance as a *sequence of authored pacing beats* (the shinden paying out, the
  workshop's first recorded yield, the granary stocked, the house off the cliff),
  not a silent number climbing to 480. The PRD already promises this
  (§3.2 "T0 Phase 2 — what the back half REVEALS"; §3.3 the "E1 Stabilising —
  the estate STANDS (build complete)" row) — T0 never delivered it.
- **New authored reveals** across the window, so a breadth of beat arrives
  *singly* over ~40–80 min (the fractal-incrementality rule, §3.0 rule 1).
- **Meaningful choices** — at minimum a store-vs-sell / drive-this-work-vs-that
  decision that makes the grind *active*, not autopilot.

**Reasoned from the four taste values (`taste.md`):**

- **TST1 · One home.** Every new deed source and the build-progress read live in
  the **Estate tab** (its existing home) — no capability operable from two tabs;
  reuse the influence panel + the `--attr-*` pigments + the typewriter/beat
  primitives, never fork a local variant.
- **TST2 · Never yank the ground.** The influence/standing panel is *watched* the
  whole of Phase 2 — it must patch/append, never wholesale-reset when a build
  stage completes or a deed source unlocks. A stage-completion is an appended
  beat + an in-place bar advance, not a rebuild.
- **TST3 · Fiction causes mechanics.** Each deed source and each build stage is
  *discovered via a beat* — the shinden reclamation *pays out* and that reveals
  it as a recurring earner; the workshop's first yield *fires a line*. Nothing
  spawns; the story the R4–R7 rungs already promised (the shinden, workshops,
  granary, long-house) is what *causes* the Phase-2 economy.
- **TST4 · Never guess state.** The lagging-Estate read is surfaced from the FIRST
  Phase-2 season (§2.16(b) / §3.2) — the bar reads plainly "Estate is still
  short," each deed source states its rate, and the build stage shows how far to
  the next beat. yet-another-idle-rpg's "many small visible progressions" is the
  reference register.

**Reasoned from `fun-factor.md`:** Phase 2 today fails the "is it fun" bar
because it is a rubber-stamp (~0.4 min, one action, zero decisions). Fun here is
the *legible compounding climb* + *authored beats punctuating the grind* — the
same texture that makes the Phase-1 climb work, re-voiced for "building a house
up" instead of "climbing rungs." The redesign must clear the fun bar by
*measurable-absence proxies* (variety of intents issued, beats fired, decisions
taken across the window) — but only a human certifies presence (PH5). A live MCP
playtest of the full Phase-2 window is a DoD gate (PH6), not just the sim.

**A tension to resolve at design-lock (raised in the HD-19 brainstorm, Q2):**
literal 1:1 makes T0 total ~2.8 h. The human called 1:1 "a better random ass
default," tunable in playtest — so the redesign MAY instead rebalance the
*split* of a ~90-min T0 (shorten Phase 1 too), rather than bolt ~83 min onto the
existing ~83-min Phase 1. **This is a human call** (see Open Questions Q1); the
mechanics below hold either way — they change the Phase-2 *content*, and the
ratio band is satisfied by tuning the two sides' magnitudes.

---

## 2 · The loop options (DIVERGE — do not pre-collapse)

Three genuinely distinct answers to "what is the T0 Phase-2 loop." Each is a
*working* approach, not a sketch; the human picks one (or a coherent hybrid) at
Phase-0 design-lock. Remember the hard PRD constraint: **T0 reveals ONE pillar
(Estate)** — so "categories" are *sub-sources within Estate*, never new pillars
(Arms is T1). And **the core loop is the MC's own actions, NOT a management sim**
(§3 constraints) — Option C must respect this.

### Option A — Multi-deed-category grind (the "many earners" loop)

Replace the single `ESTATE_DEED_PER_ACT` producer with **several distinct Estate
deed sources**, each tied to a labour/quest activity the R2–R6 rungs already
taught, each with its own per-deed magnitude and cadence:

- *shinden reclamation* (farm the reclaimed paddy → a land deed),
- *workshop yield* (craft/work the workshop → a treasury deed),
- *granary stocking* (haul/store rice past a threshold → a stores deed),
- *watch/defend* (the DEFEND activity — recognised, but at T0 it feeds Estate
  standing as "the house is safer," since Arms is T1-gated).

Each source banks through the same `accrueDeed` per-deed cap (the cap finally
*binds* — its existing forward-headroom doc, `pillars.ts` L35, becomes live).
The player rotates among them for variety; the seasonal judge pays the 70/30
share on the aggregate high-water.

- **Texture:** variety of action, the per-deed cap creating a "spread your work"
  incentive, the seasonal judge as a rhythmic payout beat.
- **Tradeoffs:** closest to the existing engine (lowest core risk — it's mostly
  new *sources* feeding the existing `applyEstateDeed`/`seasonalJudge`); but on
  its own it's still "grind, just with 4 buttons" — needs the build-stage beats
  (Option B) layered on to feel like *building*, not just *accumulating*.
- **UI:** mostly reuses the Estate/influence panel + deed log. A multi-source
  deed log MAY warrant a **ADR-075 diverge** (how to show 4 concurrent earners
  legibly, TST4) — flag at build time; likely light.

### Option B — Staged estate-BUILD milestones (the "watch it rise" loop)

Make **the E0→E1 build itself the spine of Phase 2.** Phase 2 is a *sequence of
authored build stages* — each stage is a gated milestone (a deed/coin threshold)
that, when reached, **fires a full authored reveal beat** and advances the
estate's visible state:

1. the cracked kura mended (already `improve_estate` U1) →
2. the drill yard cleared / night-watch set (U2) →
3. the first shinden reclaimed and bearing (U3) →
4. the long-house raised — the house stands (U4) →
5. **E1 "Stabilising" — the estate STANDS** (the build-complete beat, §3.3) →
   which coincides with clearing the EXCELLENT gate → ascension.

Progress between stages comes from banking Estate deeds (any source), so the
grind *drives a visible build* with a beat at each stage. This directly delivers
the PRD's promised "E1 Stabilising completes as a Phase-2 beat" that T0 never
shipped.

- **Texture:** the strongest *fun* answer — the estate literally rises before
  your eyes, each stage an old-school "learned box" reveal (TST3), the pacing
  carried by beats not just a bar. Maps 1:1 onto the existing `ESTATE_STAGES`
  ladder and `improve_estate`, re-gated off *deeds* (or deeds+coin) instead of
  pure coin.
- **Tradeoffs:** needs the stages re-paced to fill ~40–80 min (today U1–U4 are a
  coin sink reachable fast); risks feeling *linear* (one path) unless paired with
  Option A's multiple earners feeding it. The build-stage state must be
  derivable/append-only (TST2) — a stage completing must never rebuild the panel.
- **UI:** a **build-progress tracker** surface (stages + the next-beat ETA) is a
  new/majorly-restyled surface → **ADR-075 diverge REQUIRED.** Lives in the Estate
  tab (TST1).

### Option C — Light allocation layer (the "steward's choices" loop)

Add a **thin allocation/decision layer**: each season (or each build phase) the
player *directs the house's recovery* — choose which work to drive (fields vs
workshop vs defense vs stores), and the choice trades off (drive the shinden and
the granary lags; the seasonal store-vs-sell rice timing already exists as a
model). Deeds accrue toward Estate from whichever track you push, with
diminishing returns per track (so spreading vs specialising is a real decision).

- **Texture:** the most *decision-dense* answer — every season is a small
  meaningful choice, the seasonal judge is the payoff clock, and the rice
  store-vs-sell timing lever (already built, `RICE_SELL_PRICE_BY_SEASON` +
  spoilage + kura cap) folds in naturally.
- **Tradeoffs:** **highest design risk** — it flirts with the PRD's hard "NOT a
  management sim" line (§3 constraints; §3.2.1 frames field-administration as
  "the MC's own quests/offices — NOT a management layer"). Must be kept as *the
  MC choosing which of his own labours to do next*, not an abstract allocation
  dashboard. If it drifts into a management UI it violates canon — a design-lock
  risk the human must weigh.
- **UI:** an allocation/choice surface → **ADR-075 diverge REQUIRED**, and a taste
  review specifically against the "not a management sim" constraint.

### Recommended shape (a self-picked default, per R4 — the human overrides)

**A + B layered** is the strongest fun-and-canon answer: multiple deed earners
(A) *driving* a visible staged build (B), with the seasonal judge as the payout
rhythm. It reuses the existing engine (A is low-risk on core; B maps onto
`ESTATE_STAGES`), delivers the PRD's promised build-completes-as-a-beat, and
needs exactly one new UI surface (the build tracker, ADR-075). Option C's best
idea (the store-vs-sell timing lever) is *already built* and can enrich A+B
without adopting the management-layer risk. **This is a proposal, not a
decision** — the diverge board in Phase 0 puts all three (and the A+B hybrid) in
front of the human.

---

## 3 · How it hits ~1:1 and how the sim VERIFIES it

**The acceptance test is the FB-4 sim's ratio band.** ADR-133 adds
`PHASE2_PHASE1_RATIO_BAND = [0.8, 1.2]` to `balance.ts` (single-sourced, AC-21) and
a hard `verify:balance` envelope gate. The redesign is *accepted* iff, across
**all 5 fixed seeds × all 3 personas** (greedy, idler, explorer):

```
phase2Wall / phase1Wall  ∈  [0.8, 1.2]
```

where `phase1Wall` = wall-min to reach the capstone rung and `phase2Wall` = the
capstone→ascension window. The sim already computes the pieces:
`metrics.ts` records `phase2Intents = total − capstoneAtIntent` (L277); the
ratio is `phase2Intents / capstoneAtIntent` (both → wall via the 480 ms model).
The envelope lands in `src/sim/envelopes.ts` alongside `PHASE2_RUNG` (L19), which
today explicitly marks the window "report-only, see HD-19" — ADR-133 flips it to a
gated verdict.

**Why the redesign can hit the band where a threshold-stretch is a false green:**

- The band gate measures *duration*. Both the stopgap and this redesign can green
  it. The difference is **what fills the duration**: the stopgap fills ~83 min
  with one repeated intent (the sim's `phase2Intents` climbs but the *variety* is
  ~1); the redesign fills it with multiple deed sources + staged beats.
- **So the sim's job here is dual:** (1) the *duration* verdict (the ADR-133 ratio
  band — the hard gate), and (2) a *texture* proxy that guards against a
  regression back to single-action grind. Add report-only metrics the personas
  surface: **distinct Phase-2 intent types issued**, **build stages reached**,
  **seasonal judges fired** in the window. These are *reported* (not gated — a
  fun proxy proves absence, not presence, R5/ADR-132), but a drop to "1 distinct
  intent" in the report is the visible alarm that the loop collapsed back to a
  slog. (Gating a fun-proxy would cry wolf — keep it report-only per ADR-132's
  sound-rung rule.)

**Persona work the sim needs (mechanical, but load-bearing):** the current
personas only issue `do_activity` + `ascend` in Phase 2 (see the "Skipped
intents" report — greedy/idler never issue `improve_estate`, `sell_rice`, etc.).
For the sim to *measure* the redesigned loop, the personas must exercise the new
Phase-2 intents (the new deed sources, `improve_estate` re-gated, the allocation
choice if Option C). This is why the redesign and the persona update ship
together — otherwise the sim measures a Phase 2 the bots never actually play
(a false green: the arc "closes" but via the old thin path).

**Tuning to land in-band:** the per-source deed magnitudes, the per-deed cap, the
build-stage thresholds, and the EXCELLENT band (`ESTATE_BANDS`) are the levers.
All are **PROVISIONAL / liquid (ADR-059)** — this plan does NOT canonise numbers.
The flow is: pick magnitudes → `pnpm run balance:sim` → read the ratio → adjust →
repeat until all 15 cells sit inside `[0.8, 1.2]` with margin. Because the ratio
is *relative*, the Phase-1/Phase-2 split rebalance (Open Q1) is just a choice of
which side to move.

---

## 4 · Pure-core boundary

**Lands in `src/core/` (deterministic, unit-tested):**

- **The deed sources** — extend `pillars.ts`: today `applyEstateDeed` banks one
  fixed `ESTATE_DEED_PER_ACT`. The redesign parameterises the deed magnitude by
  *source* (a data table of source→magnitude in `content/balance.ts`), still
  routed through the single `accrueDeed` per-deed cap. The `do_activity` reducer
  (`intents.ts` L566) already calls `applyEstateDeed` in Phase 2 — extend it to
  pass the activity's source; add reducer hooks on the other earner intents
  (DEFEND/quest, workshop craft, granary store) so they bank their source's deed.
  All pure, all folding through `accrueDeed`.
- **The staged build state (Option B)** — the E0→E1 stage is **derived**, not a
  new stored flag where avoidable (§3.0.1(5) / §6.4 "no stored phase flag"
  ethos). The build stage is a pure function of banked Estate value / deeds vs
  the `ESTATE_STAGES` thresholds (re-gated off deeds, or deeds+coin). If a stage
  needs a persisted "reached" bit for its one-time beat, it lives in `flags`
  (append-only, the reveal-bus pattern), not a bespoke field.
- **The allocation state (Option C, if chosen)** — the current-directed-track is
  minimal stored state; the per-track diminishing-returns curve is a pure fn.
- **The ratio + texture metrics** — already in `src/sim/metrics.ts`/`envelopes.ts`
  (the sim consumes the pure core; the ratio is computed from pure-core intent
  counts, no renderer involvement).

**Route forecasts/previews through the SAME pure-core fn (AC-6).** The Estate
panel's "distance to EXCELLENT / to the next build stage / seasons-to-gate"
forecast MUST read the same pure functions the accrual uses — e.g. a
`phase2Forecast(state)` selector that both the shown ETA and (where relevant) the
sim consult, so the displayed "Estate is still short" read can never drift from
the real gate (TST4 "displayed == tested"; the ascension gate-readiness already
follows this pattern per the roadmap's DISPLAYED==TESTED rows).

**Stays in the renderer (DOM/canvas):** the Estate-tab layout, the build-progress
tracker widget, the deed-log rendering, the allocation control (Option C) — all
consume the pure-core data as plain values (TST2 append-only render; never
wholesale-reset the watched panel on a stage/deed tick).

---

## 5 · Balance-change protocol (ADR-132)

This redesign touches balance magnitudes → the full ADR-132 machine-verdict flow is
**mandatory**, not optional:

1. Change the constants in `src/core/content/balance.ts` (deed-source table,
   per-deed cap, stage thresholds, `ESTATE_BANDS` if retuned) — all annotated
   PROVISIONAL / liquid (ADR-059).
2. `pnpm run verify:balance` (`balance-sim --check`) — the hard envelope verdict,
   now including the ADR-133 ratio band. Iterate magnitudes until all 15 cells are
   in-band.
3. `pnpm run balance:report` — regenerate `docs/content/t0-pacing.md`. Its
   `git diff` **IS** the before/after of the change (the Phase-2 rows go from
   ~0.4 min to ~40–83 min; the report gains the texture metrics).
4. **Commit `t0-pacing.md` WITH the code change** (same commit), and paste the
   `balance-sim --summary` per-rung/ratio deltas into the commit body.
5. The `--check-fresh` fingerprint WARN (ADR-132 §5a) catches a magnitude change
   that forgot the report regen; don't bypass it.

Full flow reference: `docs/living/qa-playtesting.md` §2.

---

## 6 · Milestones / phases with DoD (each names a RED-able test)

Sequenced so **nothing ships half-reachable (PH6)** — every phase leaves the game
playable by a human, and the sim green. Each DoD names a test that **could have
gone RED** (ADR-088), asserts a **design lever** not a collapsed metric, and
derives fixtures from the **source of truth** (the balance constants), never a
copied magic number.

**Phase 0 — Design lock (Opus; no code).**
Run `diverge` on §2's options with the human; lock the loop + provisional
magnitudes + the Phase-1/Phase-2-split call (Open Q1). Write the locked shape
back into this plan (or a short follow-up).
*DoD:* the human has picked a loop; magnitudes drafted as liquid constants.
*(No test — a design gate. The stopgap hotfix + ADR-133 gate must already be landed
so the ratio band exists to build against.)*

**Phase 1 — Multi-source deeds in pure core (Opus).**
Parameterise `applyEstateDeed` by source; add the deed-source table; wire the
earner intents to bank their source through `accrueDeed`.
*DoD test (RED-able):* a `pillars.test.ts` / `economy.test.ts` case that drives
several distinct Phase-2 earner intents and asserts **each source banks its own
source-magnitude, capped by `perDeedCap` derived from `ESTATE_BANDS.good ·
PER_DEED_CAP_NUM/100`** (fixture from the constant, not a literal), and that a
Phase-1 earner banks **zero** (the phase gate holds). Goes RED if a source is
mis-routed, the cap stops binding, or Phase-1 accrual leaks.

**Phase 2 — The staged build as pacing beats (Opus) [if Option B / A+B].**
Re-gate `ESTATE_STAGES` progression off Phase-2 deeds (or deeds+coin); fire the
authored reveal beat + the E1 "Stabilising — the estate STANDS" build-complete
beat at the final stage.
*DoD test (RED-able):* a `t0-arc.test.ts` / `ascension.test.ts` extension that
drives the real Phase-2 grind and asserts **the build stages advance in order and
each fires its beat exactly once (append-only, TST2), the E1-complete beat fires
before/at the EXCELLENT gate, and the stage boundaries are derived from the
`ESTATE_STAGES` thresholds** (source of truth). RED if a stage is skipped, a beat
double-fires (TST2 violation), or the build-complete beat is missing.

**Phase 3 — Balance land the ratio (Opus; ADR-132 flow).**
Tune magnitudes; run the ADR-132 protocol until all 15 sim cells sit inside
`[0.8, 1.2]`. Extend the personas to issue the new Phase-2 intents; add the
report-only texture metrics.
*DoD test (RED-able):* the `verify:balance` ratio-band envelope (the ADR-133 hard
gate) is GREEN across 3 personas × 5 seeds **AND** the tripwire vitest
(`pacing-envelope.test.ts`, canonical seed) asserts the ratio is in-band. Proven
RED-able by construction: revert to the old single-source magnitude → the ratio
collapses to ~0.005 → the gate reddens naming the ratio (mirror of ADR-132's R5
threshold-×3 RED proof). The texture metrics are **report-only** (not gated — fun
proxy, ADR-132 sound-rung rule).

**Phase 4 — The Phase-2 UI surfaces (Opus design, cheaper-model build OK).**
The build-progress tracker (Option B) and, if Option C, the allocation control —
each a new/majorly-restyled surface → **ADR-075 diverge**: 2–3 working variants
behind the DEV-panel toggle, self-pick a prod default, one HR-item per variant in
`review.md`. Route the panel's ETA/forecast through the Phase-2 pure-core
selector (AC-6). Live-MCP-playtest the full window (PH6 — a human-reachable Phase 2,
not just a sim-green one).
*DoD test (RED-able):* a selector unit test that the shown "distance to EXCELLENT
/ next stage" equals the pure-core forecast (DISPLAYED==TESTED, TST4) — RED if the
renderer computes its own drifting estimate. Plus the ADR-088 **tier-level** duty:
the full-arc e2e + invariants test named in this tier's DoD must now cover the
redesigned Phase 2 (extend, don't fork).

**Phase 5 — PRD ripple + docs (cheaper-model OK; see §8).**

---

## 7 · Relationship to the stopgap hotfix (the migration)

**This plan SUPERSEDES the stopgap's threshold inflation.** ADR-133 ships a quick
T0 Phase-2 hotfix so the new hard ratio gate is green on landing (a gate must be
green-able — PH3). That hotfix is explicitly a *stopgap*: it stretches a threshold
(likely the `ESTATE_BANDS.excellent` deed gate and/or `ESTATE_DEED_PER_ACT`) to
pad the window to ~1:1 with **minimal texture** — it greens *duration* but not
*fun* (ADR-133 "Known debt (PH5)").

**Migration when this redesign lands:**

- The stopgap's inflated single-source threshold is **replaced**, not kept — the
  redesign redistributes the "83 minutes" across multiple deed sources + staged
  beats. The stopgap's `ESTATE_BANDS`/`ESTATE_DEED_PER_ACT` values are re-derived
  from scratch against the new multi-source economy (Phase 3), so the stopgap's
  magic threshold number does not survive.
- **The ratio band gate and its plumbing are KEPT** — the ADR-133 gate,
  `PHASE2_PHASE1_RATIO_BAND`, the envelope, the tripwire test. The redesign keeps
  the *same acceptance test green*, just via a real economy instead of a padded
  threshold. No gate churn.
- **Continuity:** at every commit the gate stays green (the stopgap holds the
  line until Phase 3's retune lands in-band), so `main` is never red on the ratio
  during the redesign. If a mid-redesign commit would go out-of-band, land it
  behind the DEV toggle / keep it local until Phase 3 closes (never
  `SKIP_VERIFY`-override a red ratio onto `main`).
- The stopgap should carry a `// SUPERSEDED by opus-2026-07-04-phase2-economy-
  redesign` breadcrumb at its threshold so the swap is obvious.

---

## 8 · PRD ripple (ADR-117)

**Yes — targeted ripple (this changes a BUILT system).** Run `/prd-ripple` after
the redesign lands. Classification (Flow 1):

- **System/narrative change → targeted ripple + note the ADR.** The Phase-2
  *economy shape* changes (single-source → multi-source + staged build), and the
  §3.2 "T0 Phase 2 — what the back half REVEALS" + §3.3 "E1 Stabilising build
  complete" prose finally becomes *true of the build* (today it describes an
  ambition T0 never shipped). The build is the territory — reconcile the PRD's
  Phase-2 prose to what now ships.
- **Balance numbers → NO §4 prose edit** (magnitudes are liquid; they live in
  `balance.ts` + the generated `t0-pacing.md`, not hand-typed in the PRD).
- Any facts that are **derivable** (stage counts, deed-source list) should
  transclude as **gen-regions** (the `gen-prd-regions` gate) rather than be
  hand-maintained, so they can't drift.
- Then `pnpm run prd:drift` for the game→PRD punch-list; clear what the change
  staled.
- **An ADR:** the *loop choice* itself (which of §2's options ships) is a
  design decision worth an ADR entry in `decisions.md` (it refines ADR-133's
  "queued follow-on" into the concrete loop), single-sourced so the PRD points at
  it rather than restating.

**Generalises forward (ADR-133 is a general law):** because 1:1 is now every
tier's Phase-2 law, the T0 loop chosen here is the *template* T1-M4 / T2-M4 build
their Phase-2 economies against (the roadmap's T1-M4-F1 already says "reuses the
T0 Phase-2 / influence surface (no new DIVERGE)"). Design the T0 loop so it
*scales* — multi-source deeds + staged build generalise cleanly to the 2-, 3-,
4-pillar tiers (each pillar gets its own sources + build stages).

---

## Open questions for the human

- **Q1 — Literal 1:1 (~83 min bolted on, T0 total ~2.8 h) OR rebalance the split
  of a ~90-min T0 (shorten Phase 1 too)?** ADR-133 locked the *ratio*, not the
  *absolute* — and the HD-19 brainstorm (Q2) flagged this exact tension. The
  mechanics below work either way; the answer sets the magnitude-tuning target in
  Phase 3. **This is a direction call only a human makes.**
- **Q2 — Which loop (§2)?** A (many earners) / B (staged build) / C (allocation)
  / the recommended **A+B hybrid**. Decided at Phase-0 diverge. Note Option C's
  "not a management sim" canon risk (§3 constraints).
- **Q3 — Should the store-vs-sell rice timing lever (already built) be folded in
  as a Phase-2 decision**, or kept as ambient economy? It's a cheap way to add a
  meaningful choice to any of the three loops.
- **Q4 — Deed-source gating:** should T0 Estate standing bank from ALL labour, or
  only estate-relevant work (farm/haul, not forage/woodcut)? `pillars.ts` L40
  already flags this as "a separate T1 balance/design call" — the multi-source
  redesign forces the question at T0.
