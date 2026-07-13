# The five T1 seams the ADR sweep homed (parked until T1 planning)

**Status:** PARKED (2026-07-13, session-187 — parked until the T1
planning pass; every item human-ruled "home in t1/" in the 2026-07-13
finding walk)
**Confidence:** ( 60% Opus, 40% Fable ) — mostly engine seams (Opus);
the combat-timing review and meet-NPC scene framing carry design/taste
judgment where Fable may be routed at pickup.
**Template:** build

## Who builds this — Fable or Opus?

Decided at T1 planning, per item: M4/M5 are pure engine (Opus); M6
frames story scenes and M1 is a felt-pacing design review — route
those with the human when unparked.

## Why

The 2026-07-12 ADR sweep found five T1-scoped mechanisms living only
in ADR prose — canon a tier-planning pass would have to re-derive. The
human ruled each "home in t1/" (2026-07-13 finding walk). This plan is
that home: T1 planning inherits it instead of re-reading 3,700 lines
of `decisions.md`. Evidence + file:line grounding:
`project/archive/opus-2026-07-12-adr-embedded-work.md` (M1, M4, M5,
M6, M9).

## What exists today

**Survey date: 2026-07-13 (session-187), source-verified.**

- **M1 · Combat timing (ADR-148):** fights are the only INSTANT act
  (`src/core/content/timing.ts:143`) — excluded "pending its own
  review", which never ran. Human ruling 2026-07-13: **defer to a T1
  combat review** (decide alongside ADR-103's interactive-combat
  question, same subsystem).
- **M4 · Both-tracks teeth (ADR-183/HD-39):** `RequirementDef` has no
  `track` field (`requirements-engine.ts:32-40`), no `verify-content`
  invariant — correctly deferred (vacuous green until T1 rungs exist,
  PH3).
- **M5 · Multi-pillar tier-up predicate (ADR-159):** only the
  degenerate T0 case exists (`ascension.ts:22`,
  `estateGrade === 'EXCELLENT'`); the real rule (every revealed pillar
  ≥ GOOD, exactly one EXCELLENT + one GREAT) is unwritten.
- **M6 · Meet-an-NPC trigger (ADR-104 "Future work"):** `SceneTrigger`
  kinds are `rung|season-exit|flag|verb|scripted` (`scenes.ts:31-36`);
  no first-encounter kind, every meeting hand-wired — pays off when
  T1's cast lands.
- **M9 · Home tiers grow with rung (ADR-111):** deferred T1+ seam,
  honestly marked in code (`render.ts:5594-5596`, `home.ts:19`);
  belongings + set bonuses ARE built.

## Steps

At unpark (the T1 planning pass), split per item into the T1 build
plans; the sequencing below is the inherited recommendation:

1. **M1** — run the combat-timing review WITH ADR-103's
   interactive-combat decision (one combat conversation, not two).
2. **M4 + M5** — land together: the `track` field, the verify-content
   both-tracks invariant, and the general tier-up predicate + RED-able
   test, all testable once T1 rungs/pillars exist.
3. **M6** — add the `meet` trigger kind; migrate one T0 hand-wired
   encounter as proof; new T1 cast uses it from day one.
4. **M9** — fold into whatever T1 plan owns the home/estate
   progression surface.

## Verification

Owed by the unparked plans, not this one; the inherited bar: each
mechanism ships with a test that could only go RED once T1 content
exists (that is WHY they are parked — building now yields vacuous
greens, PH3), plus the player-reach proof (PH6) — a live drive or
fixture-based capture of the mechanism from a T1 save. This plan's
own check: the `deferred-work` gate and plan-template gate stay green
with it in the tree.

## Sync ripple

- **PRD:** none now — each item ripples with its T1 build
  (`/prd-ripple` then).
- **Story-bible:** none now — M6 touches scene *framing*, not canon.
- **Living docs / registries:** none — no code moves while parked.
- **CHANGELOG:** none.

## Human-in-the-loop

- Nothing to file now — all five were ruled in the 2026-07-13 walk.
- At unpark: M1's review is a human pacing call (HD-item then); M6's
  scene framing gets the ADR-139/075 treatment if it grows player-
  facing surface.

## Non-goals

- **Building any of the five now** — the park is the point (PH6: no
  T1 player exists; PH3: no honest RED available).
- **M3 (`TierId`) and M7 (dialogue live-swap)** — pulled forward by
  the human instead; they live in the log-truth and live-swap plans.

## Risks

- **Staleness at unpark:** every file:line above is a 2026-07-13
  snapshot — the T1 planning pass must re-verify against the tree
  (PH2) before building; treat this plan as a map, not the territory.
- **Ruling drift:** if a newer human steer touches combat timing or
  tier-up shape before T1, the newest steer wins (ADR-022) — update or
  strike the item here rather than building the stale ruling.
