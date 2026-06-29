# Session 16 — 2026-06-29 — Re-scope v0.3: re-baseline T0-M1/M2 + T0-M3 & T0-M4 back-to-back

**Summary:** Human steers three scope changes into the v0.3 plan (`docs/plans/2026-06-29-path-to-v0.3.md`),
restructuring Part 2 of the build: (1) **T0-M3 and T0-M4 ship back-to-back** in v0.3 (coupled/intertwined — the
spine needs R4–R7 to climb and M4 is what makes those rungs worth climbing; spine-first order preserved *within*
the release); (2) **audit, review & re-implement T0-M1 and T0-M2** — v0.2 was built against an older PRD, so parts
are unimplemented / wrong / lazy, and the blanket "carry-forward + retune" (DS#19/OQ-4) is downgraded to
*carry-forward-earned-per-fun-slice-by-audit*; (3) the plan must contain **formal audits/reviews/batteries against
both the source code AND the running game** to prove PRD-fidelity (not a subset / half-assed prototype). Also a
small doc-hygiene commit earlier: an upward cross-ref in `roadmap.md` naming §7 as its governing contract.

This file is HISTORY, not live state — the live snapshot is `project/status/project-status.md`.

## What changed
- `docs/living/roadmap.md` — added an upward cross-ref blockquote: §7 (`prd/07-roadmap-scope.md`) is this
  roadmap's **governing contract** (§7 owns *what/scope*, roadmap owns *how/order*; on conflict §7 wins on scope,
  roadmap wins on sequence). Closes the asymmetry where §7.2 pointed *down* but nothing pointed *up*. (commit `511e0fa`)
- `docs/plans/2026-06-29-path-to-v0.3.md` — **Part 2 restructured into three movements:**
  - **Scope blockquote** rewritten: v0.3 = re-baseline T0-M1/M2 → T0-M3 spine → T0-M4 breadth; M3+M4 back-to-back
    (coupled), spine-first held *within* the release (decision #18 / OQ-2 preserved).
  - **"Carry forward — keep, don't rebuild"** → **"Carry forward vs. re-baseline — what's trusted, what's
    audited"**: architecture/infra carries forward unconditionally; T0-M1/M2 *content & behaviour* is audited
    against the current PRD before it's trusted. Supersedes the blanket DS#19/OQ-4 carry-forward framing.
  - **Build steps** → **three movements:** Movement 1 (steps 0a/0b/0c — source-code audit + built-game audit via
    `battery` + `capture-game-states` → gap report classifying each DoD line ✅/🟡/🔴 → re-implement the gaps),
    Movement 2 (the T0-M3 spine, steps 1–9, thin, prove it closes), Movement 3 (the T0-M4 breadth, new steps 10–15:
    first quest, LINEAR koku flywheel, mentor lore-talk + tiny market, walkable T0 map, stance/ability reveals,
    found/crafted 2nd weapon).
  - **Step 7** relabelled the T0-M2 combat retune as the codified Movement-1 re-baseline fix.
  - **Code-application checklist** rows for the flywheel + content registries flipped from "T0-M4 (OUT of cut)" →
    "Movement 3 / T0-M4, now IN" (steps 10–15); SFX module moved from "optional ride-along" → in-scope (Movement 1
    juice + step 12 lore-talk).
  - **Risks**: reframed the R4–R7 risk to "spine-first must hold *within* the release"; added two new risks —
    re-baseline scope-creep (hold to the gap report, PRD-DoD-bounded) and audit-theatre (two-pronged 0a+0b audit,
    cite a screenshot/failing test per 🟡/🔴).
  - **Step 9 / closing / intro / one-liner** updated to reflect all three movements; Movement-1's built-game audit
    (0b) now feeds R1 (agent = PRD-fidelity; R1 = the human's taste call).

## Next intended steps
1. Human reads & signs off the re-scoped `path-to-v0.3` Part 2 (still in the reading queue).
2. On sign-off, **start Part 2 → Movement 1**: the T0-M1/M2 audit (source-code 0a + built-game 0b) → gap report in
   `project/audit/reports/` → re-implement 🟡/🔴 lines.
3. **R1** (the human's M0–M2 fun/taste call) is still open in parallel — Movement-1 0b will hand the human a
   structured PRD-fidelity report + screenshots to inform it.

## Landmines
- This is a **release-bundling + quality-bar** change, NOT a game-design change — the milestones and their content
  are unchanged; only which release they ship in and how rigorously T0-M1/M2 is verified. So it lives in the plan,
  not a new ADR. (If the human wants the re-baseline mandate as durable canon, it could graduate to an ADR
  amending DS#19/OQ-4 — flagged but not done.)
- The `roadmap.md` milestone tracker still lists T0-M3 and T0-M4 as separate milestones — correct; release-grouping
  is the *plan's* job, not the roadmap's. Don't "fix" the roadmap to merge them.
- Movement 1 is the open-ended risk: hold it to the gap report (only 🟡/🔴 re-implemented), PRD-DoD-bounded, not a
  vibes polish pass.
