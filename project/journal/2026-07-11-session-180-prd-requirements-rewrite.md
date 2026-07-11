# Session 180 — 2026-07-11 — rewrite the PRD to one progression model (ADR-182)

## ☀️ SUMMARY (read this first)

The session started as plan-triage (size + route the five active plans), then
picked up `fable-2026-07-11-prd-rungmeter-textsync` — and immediately hit an
intent-level fork the plan's own Go conditions said to hard-stop on. The human
ruled it; the ruling **rescoped the plan** and became **ADR-182**.

This file is HISTORY. Live state: `project/status/project-status.md`.

---

## 1 · Plan triage (the ask)

Sized all five active plans for Opus and routed them. Verdict: four are
Opus-safe, one (`t0-narrative-revoice`) keeps a Fable-shaped core in its canon
wave and per-wave picks. Estimates: textsync 1.5–2.5h · zone-rung 2–3h ·
wait-a-day 3–4h · save-format 5–8h · re-voice 12–18h.

The non-obvious finding, verified in code rather than taken from the plans:
`unlock.ts` is the single reveal-emit site and imports BOTH `SURFACES` and
`RANKS`, so **save-format must land before zone-rung** — once reveal lines
persist as `reveal.<surfaceId>` descriptors, zone-rung's moved ceremony lines
re-render correctly in existing saves instead of staying stale forever. The
reverse order bakes in exactly the bug save-format exists to kill.

## 2 · The fork: was the rung-meter dead everywhere, or only at T0?

Running the plan's step-1 grep for real turned up **105 hits** across six PRD
sections (the plan said ~90; §6 alone had 12 remnants, not 7). But the hits
weren't classifiable, because canon contradicted itself:

- **ADR-137** says the points model is *"fully deleted, not wrapped"* — but
  scopes itself to rungs R0–R7, which is T0's ladder. Silent on T1+.
- **ADR-024** ("the rung-meter accrual law") stood **unsuperseded on paper**.
- **§4/§6 had been hand-annotated "T1+ frontier"** — implying the meter survived
  as the T1/T2 plan.
- **The code said dead:** no `rungMeter` / `estateService` / `combatRank` /
  `thresholdForRung` anywhere. Only a tombstone comment at `state.ts:200`.

Per PH2 (the build wins where doc and build disagree) this is drift — but
whether the *forward* model keeps a meter is intent, not description, so it went
to the human rather than being self-decided.

## 3 · The ruling (human, 2026-07-11) → ADR-182

> *"rung meters are no longer flat points, they are always objective and
> criteria based that are unique per rung, and can be as many or as few as
> needed."*

> *"I have no idea why we would strike stuff, the PRD is a living document, git
> history exists. We rewrite the PRD to reflect the current live plan."*

So: the ADR-137 requirements model is the progression model at **every tier**. A
"rung meter" survives only as the *name* of the player-facing % bar; what it
measures is that rung's authored list of objective criteria.

**Landed (`docs/living/decisions.md`):**

- **ADR-182** — the ruling + its consequences.
- **ADR-024** → ⛔ SUPERSEDED, annotated in place (never deleted — ADR-022).
- **ADR-025** → 🔁 partly superseded: the three-track de-confliction *stands*;
  only Combat Rank's mechanism becomes a criteria list.

**Plan rescoped** (`fable-2026-07-11-prd-rungmeter-textsync.md`): confidence
flips to 90% Opus (the Fable-shaped judgment was the frontier classification —
the ruling deleted that bucket); rewrite-in-place, no strikethroughs; and
**step 4 inverts** — the drift-scanner teeth were rejected only because
surviving frontier prose would cry wolf, and no such prose survives, so they
now go IN (AC-11: the gate is finally the sound rung).

## What changed

- `docs/living/decisions.md` — ADR-182 added; ADR-024 + ADR-025 annotated.
- `docs/plans/fable-2026-07-11-prd-rungmeter-textsync.md` — rescope block.
- `docs/plans/README.md` — regenerated index (Status 📋 → 🔧).

## Next intended steps

1. Sweep the six PRD sections — one commit per section file, docs-only lane,
   rewriting flat-points/threshold/AND-gate prose to the requirements model.
2. Add the dead vocabulary to `prd-drift.ts` RETIRED (`rungMeter`,
   `thresholdForRung`, `RUNG_POINTS_PER_ACT`, AND-gate) — **not** the bare
   phrase "rung meter", which stays legal.
3. `pnpm run prd:drift` clean + full `verify` → snapshot → push.

## Landmines

- **Shared tree, 3 co-agents live** (w2:p5 save-format, w6:p1 story takes, w3:p3
  zone-rung) with WIP in `src/ui/`. This sweep is docs-only — commit by explicit
  file pathspec, `SKIP_CODE_VERIFY=1`, and never stage their paths.
- **gen-regions are not hand-editable.** `01-vision.md` and `03-unlock-ladder.md`
  carry `<!-- gen:begin … -->` regions; edits inside them are reverted by the
  `gen-prd-regions` gate. Rewrite around them.
- The plans README index is a generated region — a plan's Status change stales
  it, so `pnpm run checkpoint` before committing a plan edit.
