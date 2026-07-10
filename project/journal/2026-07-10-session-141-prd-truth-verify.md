# Session 141 — 2026-07-10 — verify src/ vs the ADR-168 truth-sync + fix the residue

**Summary:** Independent verification that the shipped game matches the fresh
ADR-168 PRD/story-bible truth-sync (s136): machine checks green, 4 parallel
verifier agents checked ~110 prose claims, ~103 clean. Committed the audit
report, applied the 7 doc-side fixes, filed HD-36 for the one code-side
contradiction (Munemasa speaking in T0).

## What changed

- `project/audit/reports/2026-07-10-prd-truth-sync-src-verification.md` — NEW:
  the full verification report (method, mismatches, cleared suspicions).
  Committed separately (`ad70f67`); session header corrected s140→s141 here.
- `docs/living/prd/01-vision.md` — dropped the `outcome: t3done` pseudo-token
  (no such identifier ships; ending marked v1-frontier).
- `docs/living/prd/02-systems.md` — §2.3c dropped the nonexistent `fatigue`
  field (hurt-body texture = derived `lowHpWorkMult`); §2.4b/§2.4c market-
  saturation damper + `MarketState` rescoped to T2-frontier with the shipped
  T0 soft-cap named (Yohei's purse + stock caps; only the season rice price
  ships).
- `docs/living/prd/06-tech-architecture.md` — SCHEMA_VERSION 8→10 (§6.4
  header); RNG cursor list gains `discovery` (§6.2 table); e2e lane described
  as 2 mobile profiles + desktop (was "mobile lane").
- `docs/living/prd/07-roadmap-scope.md` — RNG cursor list gains `discovery`
  (invariants block); deploy-primary aligned to §6.1 truth (GitHub Pages via
  `/ship` primary, itch.io secondary) in the intro, the §7.3 pointer, and the
  §7.3 opening.
- `project/human-in-the-loop/decisions.md` — **HD-36 filed**: two R7 `{lord}`
  flavor lines have Munemasa speaking "from the veranda" vs the synced
  "never met in T0" canon; the covering HD-30 closed without touching them.
  Recommended: re-derive via narrative-diverge (ADR-139).

## Next intended steps

1. Human rules HD-36 → if (a), a small ADR-139 narrative-diverge unit for the
   two R7 `{lord}` lines (also repoint the stale HD-30 flag at
   `requirements.md:24`).
2. Optional future sweep: §4's ~17 diverged illustrative constants (enemy/XP
   curves) predate the sync and sit under the ADR-168 disclaimer — could be
   strike-and-pointed or gen-regioned if they keep confusing readers.

## Landmines

- The §4 enemy/XP-curve numbers in the PRD are STILL illustrative-stale by
  design (`balance.ts` is the live truth per the §4 preamble) — do not
  "fix" them piecemeal without deciding gen-region vs strike-and-point.
- Journal s140 belongs to another agent's drain session; this session is 141.
