# Session 32 — 2026-06-30 — land the v0.3 process learnings

## ☀️ SUMMARY (read this first)

The human read the v0.3 retrospective
([`../brainstorms/2026-06-30-v03-process-learnings.md`](../brainstorms/2026-06-30-v03-process-learnings.md)
— its in-context retro + a 23-item independent JSONL re-pass) and steered which
learnings to adopt and how. Source-of-truth capture:
[`../human-feedback/2026-06-30-process-learnings-decisions.md`](../human-feedback/2026-06-30-process-learnings-decisions.md).

Key shape the human set: **an ADR records a decision the _human_ made — so a
retrospective does NOT dump 30+ ADRs.** Genuine human decisions → ADRs; the rest
fold into living docs / skills as **norms**. Three ADRs (**D-086** tension over
generosity · **D-087** loop done-rule keep-finding-work · **D-088** e2e+invariants
per tier = hard DoD contract). The taste/process forks landed as canon/norms; the
**~16 remaining hygiene/process A-items wait on a human veto pass** (propose-then-
veto, the open TODO).

A second thread: the human challenged whether the skills are even used/wired
("its useless to append to a skill everyone ignores"). A read-only subagent
audited all 7 — **all wired, the tdd shelf-ware risk already fixed by lifting
test-discipline into AGENTS.md Conventions this session.** Report:
[`../audit/reports/2026-06-30-skill-shelfware-audit.md`](../audit/reports/2026-06-30-skill-shelfware-audit.md).

This file is HISTORY; live state is
[`../status/project-status.md`](../status/project-status.md).

---

## 1 · The decision rounds (AskUserQuestion ×3 + steers)

The human made these calls (capture has verbatim):
- **Difficulty bias → tension over generosity is canon** (D-086). Generosity
  (auto-heal, autopilot, loose economy) must be *justified*, never a default.
- **Loop done-rule → keep finding work + flag low-value honestly** (D-087).
- **e2e + invariants per tier → hard DoD contract** (D-088, extends D-054).
- **a11y on new UI → soft check, NOT a gate** (norm; eye + Lighthouse catch
  disjoint classes, both run).
- **re-audit-the-diff → a runnable skill** (battery "diff" mode) + a norm.
- **after-state (F2) → fun-factor canon + a battery "…and then what?" check.**
- **economic invariants (A4) → fun-factor canon + economy-arithmetic lens.**
- **test discipline → pulled UP into AGENTS.md Conventions** (not buried in the
  unused tdd skill — the human's shelf-ware insight).
- **audio (A5) → keep light, opportunistic.**
- **the rest → propose-then-veto** (table in the capture).

## 2 · What landed this session (the DECIDED items)

- `docs/living/decisions.md` — **ADRs D-086, D-087, D-088** appended (with the
  "ADR = a human decision, not a learning" guardrail header).
- `AGENTS.md` — new **Test discipline** Conventions bullet (RED-able · fixtures-
  from-source · assert-the-lever · e2e+invariants per tier per D-088), always-
  loaded; the tdd skill demoted to the procedure it points to.
- `docs/living/fun-factor.md` — canon: §6 fun-killer rows (reflexive generosity /
  stale after-state / buffer≠flywheel); §4 lever notes (tension-default D-086,
  audio A5); §2.4 onboarding F1 (teach at the moment of need).
- `.claude/skills/battery/SKILL.md` — new `tension/scarcity` lens; refreshed
  `onboarding` (F1/F2) + `economy-arithmetic` (A4) lenses; new **diff re-audit**
  mode (P1).
- `docs/living/qa-playtesting.md` — §4 a11y soft-check norm (F3/A10) + A8
  (verify-the-oddity) + A9 (drive deep state). *(A8/A9 rode along — vetoable.)*
- `project/status/working-agreements.md` — D-087 loop done-rule + P1 re-audit
  norm.
- `.claude/skills/grill-me/SKILL.md` — capture-path fix (`project/brainstorms/`).
- `project/human-feedback/2026-06-30-process-learnings-decisions.md` — the capture
  (decisions + the propose-then-veto table + the skill-audit outcome).
- `project/todo-human.md` — learnings doc signed off; added the veto-pass TODO +
  the skill-audit report (FYI).
- `project/audit/reports/2026-06-30-skill-shelfware-audit.md` — the subagent audit.

## Next intended steps (current)

1. **Human veto pass** on the propose-then-veto table (~16 A-items: A1/A2 multi-
   agent, A6/A11/A12/A13/A15/A18/A19/A20/A21/A22/A23, A7 retro-JSONL). Then land
   the approved ones (battery `canon-vs-build` lens, working-agreements multi-agent
   §, conventions for A6/A20/A21, etc.).
2. Update `project-status.md` snapshot + checkpoint (push) once the veto resolves.
3. Then back to the **v0.3.1 build** (DEV panel → variants → combat → koku → map
   node), the pre-existing active plan.

## Landmines (current)

- A8/A9 were folded into the qa-playtesting a11y note though they're technically
  in the propose-then-veto set — flagged to the human as vetoable (trivial to trim).
- D-088 is a **proposed** ADR pending the human's explicit nod (they named two
  ADRs; I argued for the third). If vetoed, demote to a norm.
- The propose-then-veto items are **NOT committed** — they live only in the capture
  table until the human's veto pass.
