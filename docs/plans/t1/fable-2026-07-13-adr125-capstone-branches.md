# Placeholder: the R7 capstone branch side quests (ADR-125)

**Status:** PARKED (2026-07-13, session-187 — placeholder created on
the human's ruling in the 2026-07-13 finding walk: every
tier-deferred ADR gets a plan-home so tier planning inherits it)
**Confidence:** ( 30% Opus, 70% Fable ) — quest design + fiction; the
signed T0 design still needs authored content.
**Template:** build

## Who builds this — Fable or Opus?

Fable-leaning at unpark: the three side quests are story content
(unique items, unlocks, the branch fiction); registry plumbing is
mechanical.

## Why

**ADR-125 (human, 2026-07-03):** each tier's capstone rung choice is a
BRANCH — each option unlocks a unique **next-tier side quest** with a
unique item + unlock; others lock out (replay driver). The T0 design
is **signed** (the R7 Shigemasa beat: devoted / ambitious / humble →
three named quests), but the quests themselves are T1 content and are
built nowhere. This placeholder is their queue-home (2026-07-13 walk,
LOW-4 ruling). Build-ready detail:
`project/archive/opus-2026-07-03-t1-capstone-branch.md`.

## What exists today

**Survey date: 2026-07-13.** The R7 rung VN + values choice exists
(the T0 capstone beat); no side-quest content, items, or lock-out
plumbing for the three branches exists in `src/`.

## Steps

1. At T1 planning: re-verify the archived design against the current
   quest/requirement engines first (PH2 — the game was heavily rebuilt
   since 2026-07-03).
2. Expand into a real plan: quest registry entries, the three unique
   items, the branch lock-out plumbing (one path per playthrough).
3. Author the per-branch fiction — an ADR-139 3-take diverge per
   quest, HR-bundled.

## Verification

Owed by the expanded plan: RED-able branch lock-out tests, plus the
player-reach proof (PH6) — a live drive of one full branch from the R7
choice through its side quest via a fixture save. This placeholder:
template gate green.

## Sync ripple

- **PRD:** none now — the pattern is already PRD canon via ADR-125.
- **Story-bible:** none now — the branch fiction ripples at build.
- **Living docs / registries:** none while parked.
- **CHANGELOG:** none.

## Human-in-the-loop

None now; each quest's fiction is an ADR-139 bundle at build.

## Non-goals

- Building now — the quests are T1 content no player can reach (PH6).
- Re-litigating the signed T0 branch design (devoted / ambitious /
  humble → the three named quests) — human-signed, ADR-022.

## Risks

The archived plan is a 2026-07-03 snapshot of a heavily-rebuilt game —
treat it as design intent, re-derive every integration point at
unpark.
