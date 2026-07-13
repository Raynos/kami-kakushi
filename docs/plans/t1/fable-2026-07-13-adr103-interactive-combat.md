# Placeholder: interactive, resumable mid-fight combat (ADR-103)

**Status:** PARKED (2026-07-13, session-187 — placeholder created on
the human's ruling in the 2026-07-13 finding walk: every
tier-deferred ADR gets a plan-home so tier planning inherits it)
**Confidence:** ( 40% Opus, 60% Fable ) — combat *feel* is a taste
surface; route at unpark.
**Template:** build

## Who builds this — Fable or Opus?

Decided at T1/T2 planning; the encounter UI and pacing are
taste-heavy, the state machine is mechanical.

## Why

**ADR-103 (human, 2026-07-01): DEFER, don't retire.** The PRD's
interactive, resumable mid-fight combat (`CombatEncounterState` + a
`combat_action` intent) is explicitly **forward-tier (T1/T2
ability-slot combat)** — auto-resolve stays the T0 spine. This
placeholder is its queue-home (2026-07-13 walk, LOW-4 ruling).

## What exists today

**Survey date: 2026-07-13.** Fights resolve atomically to a summary
line (`src/core/fight.ts`, auto-grind per ADR-076/090/091); no
`CombatEncounterState`, no `combat_action`. That is correct for T0.

## Steps

1. At T1/T2 planning: expand this into a real plan — encounter state,
   turn intents, resume-across-save, the ability-slot layer.
2. Run it WITH the combat-timing review parked in
   [`fable-2026-07-13-t1-seams-parked.md`](fable-2026-07-13-t1-seams-parked.md)
   (M1) — one combat conversation.
3. Re-verify ADR-103 + the PRD §6.3/§6.4 forward-tier markers first
   (PH2).

## Verification

Owed by the expanded plan (RED-able encounter tests + a live-drive
player-reach proof). This placeholder: template gate green.

## Sync ripple

- **PRD:** none now — §6.3/§6.4 already mark it forward-tier.
- **Story-bible:** none now.
- **Living docs / registries:** none while parked.
- **CHANGELOG:** none.

## Human-in-the-loop

None now; the expanded plan will need the human on combat feel
(likely a diverge, ADR-075).

## Non-goals

- Building anything now — no T1 player exists to reach it (PH6), and
  a combat state machine with no encounters is a vacuous green (PH3).
- Changing T0's auto-resolve spine — ADR-103 explicitly keeps it.
- Deciding the ability-slot design here — that is the expanded plan's
  job, with the human.

## Risks

Staleness — re-verify all citations at unpark; the newest human steer
on combat supersedes this placeholder (ADR-022).
