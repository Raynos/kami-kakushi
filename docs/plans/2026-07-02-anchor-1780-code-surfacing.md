# Plan — Surface the 1780 anchor in game code (src/*.ts)

> **Status:** 🆕 proposed — hand-off plan for another agent. **Scope: tiny.**
> Code follow-up to the (landed, docs-only) setting anchor
> **[ADR D-105](../living/decisions.md)** and its doc ripple
> ([archived plan](../../project/archive/2026-07-02-anchor-1780-setting.md)).
> **Source:** human steer, 2026-07-02 ("make a small `src/` .ts plan for 1780
> I can hand to another agent"). Defaults in force: **B1** (relative Year-N
> calendar, 1780 as flavour) **+ A2** (light off-screen "hard times" texture).

## 0. Context — what's already done vs. what this plan covers

The **docs** are anchored to 1780 already (PRD §1.3, §5 cold-open note,
`ui-design.md`, README top-note). This plan is **only** the small amount of
**game code** that surfaces the anchor to a player. It is deliberately minimal
because the calendar model does **not** change under B1.

**Reachable-now (do these):** the T0 cold-open grounding line.
**Deferred-until-built (note only):** the A2 rumour tidbit (needs the T2
rumour board, not yet built); the live *nengō* readout (B2, declined).

## 1. The one concrete change — ground the cold open in 1780

**File:** `src/core/content/coldOpen.ts` — the `COLD_OPEN.wake` string (pure-core
DATA, no DOM/Date). Add a light seasonal-year grounding clause so the opening
reads as *spring, An'ei 9 (1780)* without asserting a mechanic.

- **Current:**
  `wake: 'You open your eyes. Straw beneath you, the smell of wet rice, a low roof you do not know.'`
- **Target (illustrative — match the house voice, don't copy verbatim):** weave
  in *"a cold spring — the ninth year of An'ei"* as ambient prose, e.g. a second
  clause or a following sentence. Keep it **flavour**, never a HUD claim.

**Guardrails (binding — from D-105):**
- **Real year, fictional geography & politics.** The year is real; do **not**
  name a real place, daimyō, official, or the shōgun. "An'ei 9 / 1780" is the
  only real-world token introduced.
- **B1 holds — no calendar-model change.** Do **NOT** touch `year()` in
  `src/core/selectors.ts` (`1 + floor(day / (DAYS_PER_SEASON * SEASONS.length))`)
  or the `SEASON_TAG` readout in `src/ui/render.ts`. The on-screen calendar
  stays the relative **Year-N + season** it is today. The intro line is the
  *opening* year; the counter stays relative.
- **Pure-core discipline.** `coldOpen.ts` stays DOM/Date-free, immutable data.

## 2. Tests to update (this WILL go red first — good)

`COLD_OPEN.wake` is asserted by the cold-open / intro-flow suite. Changing the
string is a **RED-able** edit (R3): update the fixture(s) to the new text, and
confirm the assertion is on the *grounding intent*, not a brittle full-string
copy where avoidable. Likely touch-points (grep `COLD_OPEN` / `wake`):

- `src/core/intro-flow.test.ts` (cold-open sequence)
- `src/ui/render.test.ts`, `src/ui/dev.test.ts` (if they assert the wake line)

Run `npm run verify` — all gates green — before committing.

## 3. Deferred — do NOT build now, just know where it lands

- **A2 rumour tidbit → when the T2 rumour board is built.** The "hard times down
  the road" flavour is authored in the PRD (§5, T2 optional-content list). When
  someone builds the T2 inn rumours board (content data, not yet in `src/`), add
  it as one optional rumour entry: off-screen, **no plot, no mechanics, no
  INVESTIGATE, resolves to nothing**, never names the era. It belongs beside the
  other T2 rumours (future `src/core/content/` rumour data), not in the cold open.
- **B2 live nengō readout — declined (out of scope).** Surfacing the real
  era-year (An'ei 9 → Tenmei 1 at the first New Year) would need a day→nengō
  mapping and drags the famine-era name on-screen. Revisit post-v1 only if the
  human asks; **not** part of this plan.

## 4. Definition of done

- [ ] `COLD_OPEN.wake` grounds the open in spring / An'ei 9 (1780), in the house
      voice, as flavour (no HUD/mechanic claim).
- [ ] `year()` selector and the `SEASON_TAG` calendar readout **unchanged** (B1).
- [ ] No real place / daimyō / official / shōgun named (D-018, D-105).
- [ ] Cold-open / intro tests updated to the new wake text; the assertion could
      have gone RED.
- [ ] `npm run verify` green; commit; graduate this plan to `project/archive/`.

## 5. Out of scope

- The A2 rumour tidbit (deferred to the T2 board — §3).
- The live nengō readout / any calendar-model change (B2 — declined).
- Any change to place/house names or the fiction denylist (preserved).
