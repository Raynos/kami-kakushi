# R7 capstone branch — design plan (STUB)

**Status:** 🌱 STUB — awaiting a design pass; **no code, no design decided yet**.
Split out of the v0.3.5 build plan 2026-07-03 (human call) so the seven
mechanical deltas can be built by a subagent while this gets the design attention
it needs. Source decision: the agent-default audit
([`project/audit/reports/2026-07-03-agent-default-decision-audit.md`](../../project/audit/reports/2026-07-03-agent-default-decision-audit.md),
D-121).

## Who builds this — Fable or Opus?

**Design pass: Opus** (per D-124, inherit the parent's model; no Fable unless the
human routes there). This is a *design* task first — a `grill-me` / `diverge`
pass, then a short signed design — **then** a small Opus build. It is **not** part
of the v0.3.5 build subagent's scope.

## The decision so far (locked)

- **D-121 (human, 2026-07-03):** the **R7 → T0→T1 capstone choice must be a real
  mechanical branch** — the pick changes something a player can feel, not just a
  remembered story flag.
- **Handling (human, 2026-07-03):** **design it separately first.** Don't rush the
  branch into the mechanical sweep; give it its own pass and sign-off.

## What's NOT decided (the design pass owns these)

- **The shape of the branch.** Candidate shapes surfaced but not chosen:
  - a **lasting stat / playstyle boon** carried into T1 (e.g. labour-leaning vs
    combat-leaning modifier);
  - an **unlocked path / ally** into T1 (diverging content);
  - something else the design pass invents.
- **How many choices**, what each *is* narratively (the R7 beat already exists —
  `rungBeats.ts` R7 — as a "light branch"; this upgrades its payload).
- **How big** the mechanical difference should be (it lands at the T0→T1 seam, so
  it colours the whole next tier — powerful, but must not unbalance T1).
- **Reversibility / visibility** — is the choice remembered-and-shown, and can it
  ever be re-chosen? (Probably not — no respec is a standing lock, D-051.)

## Process (fill this in during the design pass)

1. **`grill-me`** the branch: what does the R7 pick *mean* to the player, and what
   T1 fantasy does each side promise? Capture to `project/brainstorms/`.
2. Optionally **`diverge`** 2–3 concrete branch designs.
3. Land a **signed design** (here or a sibling doc), then a small build task:
   `src/core/content/rungBeats.ts` (R7 option payloads) + the state field the
   branch reads + where the consequence applies + a test asserting the two picks
   diverge (could have gone RED when it was flag-only).

## Done-when

A human-signed branch design exists **and** is built: the two (or more) R7 picks
produce a mechanically-distinct outcome carried into T1, covered by a test.
