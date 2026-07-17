# Session 210 — 2026-07-18 — build the FB-415 talk-system redesign

## ☀️ SUMMARY (read this first)

Building `docs/plans/fable-2026-07-17-talk-system-redesign.md`
(state-derived asks + authored beats, D1–D8). Pre-build Q&A with the
human locked four execution rulings (recorded in the plan's Status
block): all-Fable build, step 4 fires after the diverge SELF-PICK,
defaults accepted with a **full-T0 floor** (every person×rung with
talk today still talks after the port — nothing broken at any rung),
and variant (c) emerges during the diverge rather than pre-shaped.

This file is HISTORY, not live state — the live snapshot is
`project/status/project-status.md`.

---

## 1 · Pre-build rulings captured into the plan

Ran the plan's open questions past the human (AskUserQuestion):
routing, step-4 gate, the two non-blocking defaults, variant (c).
Amended the plan: Status → IN PROGRESS + a Rulings block; step 2
gains the full-T0 floor (re-homed lines and/or placeholder asks
cover later rungs — authored waves upgrade placeholders, never
create coverage); the Risks "ships with only the R0–R2 seed"
fallback is bounded by the no-broken-rung ruling.

<!-- append further entries below, in order -->

---

## Next intended steps (current)

1. Step 1 — core ask engine (`src/core/asks.ts`, TDD): ask defs +
   `availableAsks` selector, `asksHeard` save-schema bump +
   migration test, `ask` intent (no log emission).
2. Step 2 — authoring pipeline: `## ask` grammar in
   `src/core/content/narrative/` + `gen:narrative` registry; R0–R2
   seed.
3. Herdr-check `w8:p1` (VN-modal co-agent) before step 3's diverge.

## Landmines (current)

- Shared tree: `w8:p1` is live on VN-adjacent UI — this plan must
  not edit VN scene modules; the VN-lite variant reuses their
  primitives.
- The full-T0 floor means step 4's re-homing is NOT optional
  stretch — the engine + port land as one shippable unit; don't
  retire `talk_to` until the port covers every rung.
