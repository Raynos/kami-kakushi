# Estate section + upgrades — a redesign is owed

**Status:** ~~PARKED direction note~~ **SUPERSEDED same-day** — the human pulled
it forward (2026-07-10, "turn it into a plan"); the live artifact is
[`docs/plans/fable-2026-07-10-estate-upgrades-redesign.md`](../../docs/plans/fable-2026-07-10-estate-upgrades-redesign.md)
(the BACKLOG row was removed with the pull-forward). This note stays as the
seed record.
**Raised by:** the human, 2026-07-10, in-session: locking the Estate-tab diverge
picks *"for now"* (**V0A · estate-a**, **V1A · tracker-a**), with the explicit
steer — *"Honestly the whole estate section and upgrades needs a lot of love and
thought."*

This file just captures the flag and seeds the questions so the eventual design
pass starts from something durable. It does **not** propose a solution — that's
the "thought" the human is asking for, and design direction is human-owned.

## What "the estate section + upgrades" is today

The **Estate 家 tab** and its **upgrade ladder** — the two surfaces just locked:

- **The Estate section** (`estate-a`, HR-9) — the improve card + house-rooms
  cards. The FB-157 quick-fix de-framed them ("border soup") into quiet
  key-dim sections. It renders from R1; the Phase-2 build content fills at R7.
- **The build tracker** (`tracker-a`, HR-11) — ladder rows reading the pure-core
  `estateBuild` selector (built ◆ · next ▹ gauge · locked ▢ unnamed).
- **Upgrades = the estate stages** (`src/core/content/estate.ts` `ESTATE_STAGES`,
  E0→E1 … `MAX_ESTATE_STAGE`). The `improve_estate` intent spends coin (+ a deed
  gate) to advance `estateStage`; each stage compounds two levers —
  `satietyMaxBonus` and the labour-yield multiplier (`estateYieldNum`, the
  ADR-051 coin flywheel) — plus the kura rice cap. The E1 build-complete beat
  ("the estate STANDS") fires once at U4.

So "estate + upgrades" spans **fiction** (the storywave re-fictioned the build to
repair / reclamation), **economy** (the coin flywheel + caps), and **three UI
surfaces** (section, tracker, and the E1 cutaway parked at HR-16 "needs more
work"). The diverge picks only settled the *presentation of the current shape* —
the human's flag is about the **shape itself**.

## Why it doesn't sit right yet (what to interrogate)

Open questions to seed the design pass — none answered here on purpose:

1. **Is the upgrade ladder fun, or just a coin sink?** The stages compound
   satiety + yield + cap. Does advancing *feel* like reclaiming a fallen estate,
   or like buying stat lines? (PH5 — a compiling flywheel is the floor.)
2. **Does the fiction cause the mechanics (TST3)?** The build is now
   repair/reclamation in canon — does the section *read* as restoring a house,
   or as a menu of purchases? Where's the discovered-not-spawned reveal?
3. **One home for everything (TST1)?** Estate section, build tracker, E1 cutaway
   (HR-16), the rooms cards — are these one coherent surface or several stapled
   together? The "border soup" complaint suggests the latter.
4. **Pacing** — the section is visible from R1 but only *fills* at R7 (Phase 2).
   Is a mostly-empty, teasing surface from R1→R7 the right call, or does it read
   as dead space for most of T0?
5. **The E1 cutaway** (HR-16, okoshi-ezu, "needs more work") is the natural
   centrepiece for a reclamation fiction but was parked. Does the redesign pull
   it forward as the anchor, or is it a separate track?

## Interim state (what's locked "for now")

- Prod ships **estate-a + tracker-a** (unchanged — they were already the
  defaults). No code churn from this steer.
- The DEV alternates (estate-b/c, tracker-b/c) are **KEPT as reference**, not
  stripped — a redesign will likely supersede all of them, and they cost zero
  prod debt (DEV-only, stripped from the prod bundle).
- HR-9 + HR-11 archived as interim picks; this note + a BACKLOG row carry the
  redesign forward.

## Related canon

- HR-16 (archive) — E1 estate cutaway parked at "needs more work".
- HR-7 (archive) / ADR-115/116 — the estate *map* surface (絵図) is resolved and
  separate from this.
- ADR-051 (coin flywheel), ADR-107 (coin→stage), ADR-145 (E1 build-complete
  beat), FB-157 (the quick-fix that shipped estate-a).
