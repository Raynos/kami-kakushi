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

---

## Addendum — Operating Model v2 (process retro → draft for sign-off)

Jake pushed past the tactical skills (H7–H9) to the real question: **why is there so much babysitting,
and what high-level process change reduces it.** Did a deep retro of the last 3 days and drafted a full
operating-model proposal.

- **Draft:** [`project/brainstorms/2026-06-28-operating-model-v2.md`](../brainstorms/2026-06-28-operating-model-v2.md)
  — PROPOSAL, pending Jake's sign-off (it changes CLAUDE.md + the milestone model).
- **Thesis:** autonomy is a *feedback-loop* problem, not a spec-completeness one — the 7k PRD bought
  *less* autonomy. Babysitting = 4 taxes on Jake's attention (Detection / Redirection / Verification /
  Repetition), each with one root cause + one fix.
- **Organizing principle — the Enforcement Ladder:** Gate > Hook > Skill > Rule. Push every quality rule
  as far up as it'll go. Key finding: the project lives mostly on rung 4 (norms); the one hook checks
  *journal only*; `verify` has **no fun/pacing/playcheck**; `pacing:check` exists but **isn't wired into
  `verify`**. Lots of un-skippable enforcement is one wiring change away.
- **Five systems:** #1 Experience Gate (`playcheck` — the keystone; substrate already in `__qa`), #2
  Fun-slice Roadmap re-axe + Slice-DoD manifest (folds in H7, answers H4), #3 Honest-by-default self-
  audit (battery, built), #4 Design-by-Divergence (`diverge` skill — Jake explicitly wants 3 variants
  for everything), #5 Corrections→Checks (the meta-lever — babysitting decays). Plus #0: make the
  pre-commit hook run the gate, not just the journal.
- **Re-axed roadmap proposed:** S0 Hook (shipped) · S1 Inner-Loop-closes (ratify/expose v0.2) · S2 Macro
  Horizon (the audit's #1 gap) · S3 Valley breadth · S4 Region payoff — each fun-complete, DoD =
  playcheck-green.

**NEXT:** Jake reacts to the draft → I turn the signed parts into ADRs + a CLAUDE.md/roadmap rewrite,
then build in dependency order (#0 hook first, #1 playcheck keystone next).

---

## Addendum 2 — the *exactly-how* plan + wiring it so it can't be forgotten

Jake steered: **don't build/commit ADRs, CLAUDE.md, or new skills** — instead produce a reviewable
`docs/plans/` doc spelling out *exactly how* I'd do each thing, so he can read/steer first. Then: **wire a
HITL item that it must be done + update project-status.**

- **Plan (review-only, nothing applied):**
  [`docs/plans/operating-model-v2-implementation.md`](../../docs/plans/operating-model-v2-implementation.md)
  — per-system *exactly-how* (#0 hook, #1 `playcheck` keystone, #2 roadmap re-axe + slice-manifest, #3 ship
  ceremony, #4 `diverge` skill, #5 corrections→checks), with the **real code sketches** (grounded in the
  actual `createInitialState`/`reduce` core API that `pacing-report.ts` already uses), the **proposed ADR
  text (D-048…D-051)**, the **exact CLAUDE.md edits**, and a **§8 checkbox checklist** + **§0 forks (D-a…D-f)**
  for Jake to mark up. Nothing applied — embedded blocks are PROPOSALS.
- **Wired (so it can't be lost):** **⭐ H10** in `human-in-the-loop/decisions.md` — REVIEW+DECIDE the plan,
  marked ⛔ blocks the next build phase, absorbs H4 + H7–H9. **project-status.md** now leads with a ⭐ TOP
  PRIORITY bullet pointing at the plan + H10, and the resume "Next" is re-sequenced to the v2 build order.
- **Key finding that grounds it:** the keystone is mostly *assembly* — `pacing-report.ts` already drives the
  pure core headlessly with a `--check` gate; `playcheck` generalizes it to the fun-factor §3 vector + bot
  policies + a baseline ratchet. And the enforcement gap is one wiring change: `verify` has no
  fun/pacing/playcheck, and the only git hook checks journal staging — nothing stops a red/hollow commit.

**NEXT (the human's):** review `docs/plans/operating-model-v2-implementation.md` → answer §0 D-a…D-f + mark
the §8 checklist → I build the ✅'d parts, keystone first (#0 hook → #1 playcheck). Until then: review-only.

---

## Addendum 3 — `project/docs-to-read-for-human.md` (a read-&-review sign-off index)

Human-requested: a top-level index of docs needing **"read & reviewed" sign-off** — *distinct from* the
`human-in-the-loop/` **action** queue. Seeded with the three the human named: the v2 implementation plan +
the two v0.2 audit reports (`state-of-the-game-v0.2` + `v0.2-changelog`). Each a checkbox + what-it-is +
what-to-decide; a footer points at the tier-reshape inbox item + the HITL queue so nothing live is missed.
