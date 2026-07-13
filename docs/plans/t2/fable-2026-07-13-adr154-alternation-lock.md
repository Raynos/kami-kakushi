# Placeholder: the inside/outside rung alternation hard lock (ADR-154)

**Status:** PARKED (2026-07-13, session-187 — placeholder created on
the human's ruling in the 2026-07-13 finding walk: every
tier-deferred ADR gets a plan-home so tier planning inherits it)
**Confidence:** ( 70% Opus, 30% Fable ) — a map/travel gating engine;
the one authored crossing (T2-R5) is a story beat.
**Template:** build

## Who builds this — Fable or Opus?

Decided at T2 planning; the gating engine is mechanical, the T2-R5
bandits crossing is fiction.

## Why

**ADR-154 (2026-07-07):** rungs alternate INSIDE/OUTSIDE the estate;
in **T2 and T3 the alternation is a HARD LOCK** (inside rung locks the
world out; outside rung locks the estate closed), T4 drops it; T2-R5
is the one authored crossing (the bandits hit the works). "A
map/travel gating engine lands with the T2 build; no T0/T1 engine
work." This placeholder is that engine's queue-home (2026-07-13 walk,
LOW-4 ruling).

## What exists today

**Survey date: 2026-07-13.** No travel-gating engine exists; T0/T1
alternation is narrative rhythm only (correct per the ADR). The T2
rungs/fog plan (`opus-2026-07-09-t2-rungs-fog.md`, greenlit) owns
adjacent T2 map mechanics — the lock engine should be planned with or
right after it.

## Steps

1. At T2 planning: re-verify the map/travel code against the tree
   (PH2), and sequence against the t2-rungs-fog plan (same map
   subsystem — decide which lands first).
2. Expand into a real plan: the lock state per rung parity, map
   gating, forced-scope action filtering (inside rung = estate only;
   outside rung = estate closed).
3. Author the T2-R5 bandits crossing — the one scripted breach — as an
   ADR-139 diverge at build.

## Verification

Owed by the expanded plan (lock tests per rung parity + a live drive
of a locked rung, PH6). This placeholder: template gate green.

## Sync ripple

- **PRD:** none now — §1.5.1/§3 re-anchor at A2 per the ADR.
- **Story-bible:** none now — `tiers/t2.md` already carries it.
- **Living docs / registries:** none while parked.
- **CHANGELOG:** none.

## Human-in-the-loop

None now; the T2-R5 crossing beat is an ADR-139 bundle at build.

## Non-goals

- Building now — the lock gates tiers no player can reach (PH6).
- Adding any T0/T1 mechanical lock — the ADR says alternation is
  narrative rhythm only there.
- Owning fog/reveal mechanics — those live in the t2-rungs-fog plan.

## Risks

Staleness at unpark (PH2 re-verify); interaction with the fog/reveal
painter — one map subsystem, coordinate the plans.
