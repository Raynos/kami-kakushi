# Session 13 — 2026-06-29 — audit + restructure path-to-v0.3 into two clean parts

**Summary:** Human asked to audit & clean up `docs/plans/2026-06-29-path-to-v0.3.md` — it had grown messy with
done/stale content. Ran a 3-way grounded Workflow audit (verify the "done" claims · pin true remaining doc work ·
scope the v0.3 build delta), then rewrote the plan into **Part 1 · Docs & process (the PRD ripple)** + **Part 2 ·
Build v0.3 (TypeScript)**, stripping everything already-done into a short "Already done" footer. No ADR/canon
changes — pre-canon plan doc only.

## What changed
- `docs/plans/2026-06-29-path-to-v0.3.md` — full rewrite. Old shape (backlog table + status banner + §3 gates +
  §4 sequencing options + §5/§6) collapsed; the now-DONE workstreams A/C/D + PRD-split removed from the body into
  a terse footer. New shape: a 1-line "where we are" + a 3-row status table, then two top-level parts —
  **Part 1** (the ~41-item doc/PRD content ripple, grouped, gated on human PRD feedback) and **Part 2** (the
  spine-first v0.3 build: carry-forward list + 9 ordered build steps + explicitly-OUT + risks).
- `project/brainstorms/raw/2026-06-29-path-to-v03-audit.json` — verbatim snapshot of the audit Workflow output (insurance).
- **Housekeeping consistency sweep** (the 3 ungated fixes the audit flagged): `pending-prd-changes.md` — flipped the
  roadmap-re-axe box to `[x]` (now **41 open / 3 done**, was 42/2) + repointed its 4 stale plan links + marked the
  "stale pointers to fix" note resolved; `project-status.md` — "37"→"~41" ripple figure; repointed the 2 remaining
  archived-plan links in the historical records (`human-feedback/2026-06-29-decision-session.md`, `audit/reports/
  2026-06-28-state-of-the-game-v0.2.md`, `audit/reports/2026-06-29-roadmap-reaxe-review.md`). No broken `docs/plans/`
  links remain (outside journal/raw snapshots).

## Audit findings (grounded against the repo)
- **All 5 "done" claims CONFIRMED:** A (ADRs D-056–D-069, `3f24fe6`) · C (`roadmap.md` promoted) · D (op-model v2
  FINAL, D-072–D-074, pre-commit verify, diverge skill, verify-run.ts) · PRD-split (stub + `prd/01..07`, `303a63f`)
  · commit `929ace6` present. No refutations.
- **Stale count caught:** the plan + `project-status.md` say "37 ripple items"; the tracker actually has **42 raw
  boxes / 2 ticked**, with one box (roadmap re-axe, `pending-prd-changes.md:124`) already-done-but-unflipped →
  **~41 genuinely open**.
- **Build delta scoped:** v0.3 = roadmap **T0-M3** (close the first four-pillar macro loop — live Estate pillar +
  BIG T0→T1 ascension on thin R0→R7) + the coupled **T0-M2 HP-carry** retune. The House-Influence panel is pure
  decoration today (no `influence`/`tier`/`pillarDeltas` in GameState; rung ladder dead-ends at R3).

## Next intended steps
1. ✅ **DONE (this session)** — the 3 ungated housekeeping fixes: flipped the roadmap-re-axe box (→ 41 open / 3
   done), fixed the "37"→"~41" figure, repointed all archived-plan links.
2. **(gated on human's extra PRD feedback)** Part 1 — the batched content ripple via a Workflow.
3. **(gated on Part 1's code edits)** Part 2 — the spine-first build, in the 9 documented steps.
4. Still on the human: **R1** (M0–M2 fun/taste call) + the **extra PRD feedback**.

## Landmines
- The "37 ripple items" figure in `project-status.md:112` is now confirmed STALE (actual ~41) — don't trust it; the
  tracker box-count is ground truth.
- Part 2 can technically start build-first (ADRs are source-of-truth, D-022) but §4 balance numbers are LIQUID
  (D-059) — keep them single-sourced in `balance.ts` so a post-ripple re-tune is cheap.
- This was a docs-only commit (`SKIP_VERIFY=1`); no code touched, no `verify` run needed.
