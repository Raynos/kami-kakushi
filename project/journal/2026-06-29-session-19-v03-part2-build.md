# Session 19 — 2026-06-29 — v0.3 Part 2: the build (re-baseline → T0-M3 spine → T0-M4 breadth)

## ☀️ SUMMARY (read this first)

> This file is **HISTORY** (how it got here), not live state — the live snapshot is
> [`../status/project-status.md`](../status/project-status.md).

The human gave a full mandate: **implement `path-to-v0.3` Part 2 end-to-end** — Movement 1 (re-baseline the
shipped T0-M1/M2 against the current 6-tier PRD), Movement 2 (the **T0-M3 spine**: live Estate pillar + the BIG
T0→T1 ascension), Movement 3 (the **T0-M4 breadth**: quest, koku flywheel, market, walkable map, found/crafted
2nd weapon) — **and verify the v0.3 build respects the roadmap**. Running autonomously: many small verify-green
commits, `diverge` on new UI surfaces, milestone-integrity (D-054) so every DoD line resolves to a real test.

**Where it stands:** Movement-1 **audit is done** (the gate for everything downstream). A 21-agent source-code
fidelity Workflow + a headless built-game pass produced the
[gap report](../audit/reports/2026-06-29-t0-m1-m2-rebaseline.md): **27 🟢 / 10 🟡 / 14 🔴 across 51 DoD lines**,
zero NEEDS-HUMAN conflicts. Verdict: the **foundation is PRD-faithful** (cold-open, labour ladder, signed
20–35% first-fight band, DISPLAYED==TESTED — all clean), the **spine/combat-correctness contracts are not**
(HP-carry D-050 absent, 2nd weapon still a grant, no-stance-dominated test missing, no-stranding property
*violated* 8/8 seeds, estate sink power-neutral, mentor/dialogue + SFX wholly unbuilt). The report cleanly
splits **true re-baseline gaps** (fix in 0c) from **expected v0.3 mutation targets** (influence state = M2,
yield-estate = M3).

---

## 1 · Movement 1 · audit (0a source-code + 0b built-game) — DONE

**0a — source-code fidelity (Workflow `wf_9a2f2c37-20a`).** 21 agents (10 per-slice auditors + 10 adversarial
verifiers + 1 convergence critic), 1.16M tokens, 357 tool uses, ~13.5 min. Each fun-slice audited against its
exact roadmap DoD + governing ADR, every line classified 🟢/🟡/🔴 with `file:line` evidence; the verifier
independently tried to refute each gap *and* each clean claim (the audit-theatre mitigation). Raw verbatim
snapshot: `project/brainstorms/raw/2026-06-29-t0-m1-m2-rebaseline-audit.json` (206 KB).

**0b — built-game (headless).** Drove the running dev build through the cold-open→labour→first-wolf→gear arc
via `qa-shots.mjs`; reviewed each screenshot with vision. Look holds (woodblock/ink, no console errors); the
three felt gaps confirmed = **silent (no SFX)**, **no visible HP / HP doesn't carry**, **mentors are prose not
a dialogue system**. Folded into the gap report's 0b section (also feeds R1).

**Deliverable:** [`project/audit/reports/2026-06-29-t0-m1-m2-rebaseline.md`](../audit/reports/2026-06-29-t0-m1-m2-rebaseline.md)
— the 10-priority re-implementation backlog. Movement-1 0c scope = P1 HP-carry, P2 no-stance-dominated, P3
found/crafted weapon, P4 no-stranding bug+test, P7 mentor/dialogue, P8 SFX+DEV-speed, P9 wear-axis, P10 doc
reconcile. (P5 yield-estate → M3 T0-M4-F2; P6 influence state → M2 T0-M3-F1.)

---

## Next intended steps (current)
1. **0c re-implement** the Movement-1 gaps in priority order (TDD, verify-green per commit), starting with the
   HP-carry spine (P1) + no-stance-dominated (P2) — combat correctness gates the rest.
2. Then Movement 2 (T0-M3 spine) → Movement 3 (T0-M4 breadth) → roadmap-respect verification.

## Landmines (current)
- **P4 no-stranding is a real BUG, not just a missing test** — fresh-L1/no-wood strands at Broken before L2 on
  8/8 seeds. The retune (durabilityMax / wear / XP-gap / starting-wood) must make the property hold, not just
  assert it.
- **HP-carry has THREE reset sites**, not one: loss-branch `fight.ts:112-115`, level-up `fight.ts:54`, AND rank
  promotion `ranks.ts:51-54` (verifier-found). All three full-heal — re-evaluate each against D-050.
- **DISPLAYED==TESTED is defined on the SAMPLED forecast** (analytic monkey@L1=0.447 is out-of-band; the band
  is on `foeForecasts` sampled=0.320). Don't "fix" combat against the analytic number.
- Dev server runs in background on :5174 (HMR) — restart after schema bumps if saved state breaks.
