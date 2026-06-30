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

## 3 · Veto-approved A-items landed (human: "that table 16 items approved")

The human approved the whole propose-then-veto table; all 16 landed in a second
commit (the F1/F2/E1/A4/A14/A16 rows were already in commit 1):
- `project/status/working-agreements.md` — **Multi-agent coordination §** (A1/A2:
  commit-by-explicit-path + on-green; scatter-gather disjoint leaves; audit =
  tree write-lock) + **Process discipline §** (A11 enforcement-ladder calibration;
  A13 most-important≠safe-alone; A12 reconcile-ADR-vs-build; A23 hand-off
  reconcile; A7 retros-read-JSONL).
- `AGENTS.md` Conventions — A6 (route derived feedback through the same pure-core
  fn), A20 (acyclic core / shared glue for cross-cutting emitters), A21 (version
  label single-source), A15 (content-transform verify: word-diff + NUL-free).
- `.claude/skills/battery/SKILL.md` — `canon-vs-build` lens (A12) + forward-spec
  audit method (A22, regression/mutation split + refute the GREEN).
- `docs/living/qa-playtesting.md` — A18 (calibrate the sim + back-solve).
- `docs/living/ui-design.md` — A19 taste heuristics (continuous ink > segmented
  pips; focused diegetic view > god's-eye grid).
- `.claude/skills/diverge/SKILL.md` — A19 diverge-integrity (implement-by-intent;
  wire the decision-log into cleanup; name a corner-cut).
- Capture table marked APPROVED+landed; `todo-human.md` veto TODO cleared.

## 4 · v0.3.1 plan threaded + skill-audit report retired

- `docs/plans/2026-06-30-v0.3.1-build.md` — threaded the new canon through the
  active build plan (no scope change): a **Process canon** subsection (D-086…D-088
  + norms) + per-step annotations — Step 2 (a11y + A19 taste heuristics + diverge
  integrity), Step 3 combat (D-086 tension grounds no-auto-heal; A6 same-fn
  forecast; test-discipline), Step 4 koku (D-086 + A4 invariants), Step 5
  after-state (F2 canon), Step 7 (judge self-inflation A4; milestone gate backstops
  D-088), and the DoD (D-088 tier tests named; test-discipline; a11y soft-check;
  diff re-audit P1) + the R1 hand-off (diff re-audit + artifact reconcile A23).
- **Retired** `project/audit/reports/2026-06-30-skill-shelfware-audit.md` — the
  human: "if it has no actions to take then i dont need it." Both its actions are
  done (grill-me path fix; diverge staleness already queued to v0.3.1), so the
  findings were folded into the capture doc (the durable record) and the standalone
  report deleted. Reading queue + snapshot updated to empty.

## Next intended steps (current)

1. Run a **repo-wide stale-markdown / docs sweep** (ultracode workflow) on the
   quiesced tree → distill findings → propose process changes.
2. Then back to the **v0.3.1 build** (DEV panel → variants → combat → koku → map
   node), the pre-existing active plan (now process-canon-aligned).

## TDD / skills-usage — what changed, what's left (for the human relay)

- **Improved:** test-discipline lifted into **AGENTS.md Conventions** (always-loaded
  → fires every time, vs buried in the opt-in tdd skill); D-088 makes per-tier
  e2e+invariants a **DoD contract**; tdd skill demoted to the deep procedure;
  grill-me path bug fixed; all skills confirmed wired.
- **Left (a real gap):** the per-test discipline is a **norm**, not a gate — docs
  don't guarantee behaviour. The teeth would be the **milestone-integrity verify
  gate** (battery #20 / D-054), already queued in v0.3.1 Step 7, which also
  backstops D-088. Open question for the human: push any further to a gate, or
  keep as a norm?

## Landmines (current)

- A8/A9 were folded into the qa-playtesting a11y note though they're technically
  in the propose-then-veto set — flagged to the human as vetoable (trivial to trim).
- D-088 is a **proposed** ADR pending the human's explicit nod (they named two
  ADRs; I argued for the third). If vetoed, demote to a norm.
- The propose-then-veto items are **NOT committed** — they live only in the capture
  table until the human's veto pass.
