# Session — 2026-06-28 — battery skill (formalize the ad-hoc audits)

## ☀️ SUMMARY (read this first)

Turned our most-repeated heavyweight workflow into **one repeatable skill**. We'd run a multi-lens stress-test
"battery" ~four times ad-hoc (PRD V2, state-of-the-game v0.1, v0.2) — ~40 raw snapshots in `brainstorms/raw/`,
scored reports in `audit/reports/` — but every battery reinvented its own lens set, naming, and de-dup approach,
and nothing tracked *which lenses had run*. Evaluated GarenP's [`claude-project-kit/battery/SKILL.md`](https://github.com/GarenP/claude-project-kit/blob/master/battery/SKILL.md)
(human-requested) and adopted it, **adapted to our taxonomy** rather than vendored.

- **New skill:** [`.claude/skills/battery/SKILL.md`](../../.claude/skills/battery/SKILL.md) — 4-step method
  (consult registry → run lenses via Workflow → archive 5 artifacts → report), two modes (full / mini),
  anti-drift self-resolution boundary, lessons log.
- **New ledger:** [`project/audit/experiment-registry.md`](../audit/experiment-registry.md) — seeded
  retroactively from all three prior batteries so the **novelty rule** (≥1 fresh lens per full battery) has
  history to work against. Lists 4 never-yet-run candidate lenses for next time.
- **Wired:** `project/audit/README.md` now points at the registry + the skill.

**Lens menu (the human's call: keep skill's + keep ours, cull only the unrelated):**
- **Kept ours:** the 7 signed scores (fun / ui-polish / prd-faithful / readme-spirit / human-feedback /
  incremental / laziness) + roadmap + 4 blind-spots (rough-edges / macro-gap / test-integrity / onboarding) +
  the convergence critic.
- **Kept from the skill, re-skinned:** doc-consistency, persona-simulation, economy-arithmetic,
  instruction-coherence, failure-state-walking, ui-state-correctness.
- **Culled as unrelated** to a single-player offline HTML5 game: *business-ops*. *Adversarial-security* not run
  as such — kept only its useful kernel as **save-integrity** (corrupt/legacy/tampered localStorage + `migrate()`),
  the one real attack surface.

## Adaptation notes (vs the source skill)

Re-skinned every path to our taxonomy: transcripts → `brainstorms/raw/` (via `snapshot-research.sh`, verbatim);
synthesis → `audit/reports/`; registry → `audit/experiment-registry.md`; ledger routing → `docs/living/decisions.md`
ADRs + `human-in-the-loop/` H/R-items; lessons → `audit/battery-lessons.md`. Method is explicitly a **Workflow**
(pipeline lenses → convergence critic, structured-output schema, adversarial refutation for big claims) rather
than the source's loose "run agents in parallel."

## Notes / open

- **No code changes** — skill + docs only. `npm run verify` untouched (still green, 99 tests).
- This is arguably a "how we work" change. Did **not** write an ADR — it formalizes existing practice rather than
  changing locked intent. If the human wants it locked, add an ADR in `decisions.md`.

**NEXT (the human's):** unchanged — action H1–H6, then build the macro engine. The battery skill is ready for the
**next** gate (e.g. a pre-macro-engine spec battery, or a v0.3 build battery — pick a fresh lens from the
registry's "never yet run" list).
