# Placeholder: parallel reputation tracks — village · origin (ADR-160)

**Status:** PARKED (2026-07-13, session-187 — placeholder created on
the human's ruling in the 2026-07-13 finding walk: every
tier-deferred ADR gets a plan-home so tier planning inherits it)
**Confidence:** ( 60% Opus, 40% Fable ) — track state is engine work;
the tracks' voice (stranger's surcharge, the missing man's rumor) is
fiction.
**Template:** build

## Who builds this — Fable or Opus?

Decided at T2 planning when this unparks: the track state shape and
pricing hooks are mechanical (Opus); the tracks' surface voice — the
stranger's surcharge, the missing man's rumor — is fiction (Fable).

## Why

**ADR-160 (2026-07-07):** the VILLAGE (from T2) and the ORIGIN TOWN
(T3) carry reputation tracks fully distinct from house rungs — never
converting 1:1; in T6 the ladder's subject flips to the HOUSE's Edo
standing (H0→H7). "Rep-track state lands with the T2 build (the state
SHAPE may land earlier with docket #1's enum work)." This placeholder
is its queue-home (2026-07-13 walk, LOW-4 ruling). The village track's
*internal shape* is further ruled by **ADR-169** (the multi-node web —
see its own placeholder).

## What exists today

**Survey date: 2026-07-13.** No rep-track state exists —
`src/core/state.ts` carries house rungs as the only standing, and no
village/origin field appears anywhere in `src/core/`. Correct for
T0/T1 (PH6).

## Steps

1. At T2 planning: re-verify the state shape against the tree (PH2),
   then design the track state — the village web per ADR-169, the
   origin track arriving at T3.
2. Wire the surcharge/pricing hooks (a stranger pays more; standing
   softens it — curves sim-owned, ADR-132).
3. Write the never-converts-1:1 invariant as a RED-able test.
4. Merge with the ADR-169 web placeholder into one T2 rep plan.

## Verification

Owed by the expanded plan: the RED-able never-converts invariant,
plus the player-reach proof (PH6) — a live drive of the stranger's
surcharge falling as standing rises, from a T2 fixture save. This
placeholder: template gate green.

## Sync ripple

- **PRD:** none now — §2.15 re-sources at A2 per the ADR.
- **Story-bible:** none now.
- **Living docs / registries:** none while parked.
- **CHANGELOG:** none.

## Human-in-the-loop

None now; the tracks' surface voice is ADR-139 material at build.

## Non-goals

- Building now — no T2 player exists to reach it (PH6).
- The T6 flip (the ladder's subject becoming the HOUSE's Edo
  standing) — its own far-tier moment, re-planned then.

## Risks

Staleness at unpark (PH2); double-home risk with ADR-169's
reconciliation — T2 planning should merge this and the web placeholder
into one rep plan.
