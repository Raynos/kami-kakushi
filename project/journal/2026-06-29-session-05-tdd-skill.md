# Session 05 — 2026-06-29 — adopt the mattpocock TDD skill (~1:1)

**Summary:** Evaluated and adopted the [mattpocock/skills · tdd](https://github.com/mattpocock/skills/tree/main/skills/engineering/tdd)
skill into `.claude/skills/tdd/`. Started with a heavy multi-agent "naturalization" analysis (4 lenses +
red-team `Workflow`); the human reversed course twice — (1) greenlit the skill (H10 is a *plan to review*,
**not** a repo freeze) and (2) asked to adopt the source **close to 1:1**, changing only what doesn't fit,
and noted a preference for **fast integration/system tests with real UI over unit tests**. Final result is
the 4 source files copied near-verbatim with three surgical edits + two repo notes.

## What changed
- **New skill** `.claude/skills/tdd/{SKILL,tests,mocking,refactoring}.md` — near-verbatim copies. Surgical
  deltas (only what didn't fit): the user-approval planning gate → our autonomy carve-out (proceed; ADR
  only for public-core-contract / what-the-game-is changes); `CONTEXT.md` → `docs/living/decisions.md`;
  `/codebase-design` skill → the pure-core boundary in `CLAUDE.md`. Additive notes: `mocking.md` "seed,
  don't mock" (pure core + seeded RNG); `tests.md`/`SKILL.md` "prefer fast integration/system tests" with
  real exemplars (`src/ui/render.test.ts` jsdom real-renderer, `src/core/economy.test.ts` real reducer).
- **Adoption record** `docs/plans/2026-06-29-tdd-skill-integration-proposal.md` — rewritten from the
  rejected heavy-naturalization proposal to a 1:1 record + 4 **candidate edits pending human approval**
  (A narrow trigger / B brittle-RNG warning / C false-green mutation check / D commit-cadence note).
- **Raw snapshot** `project/brainstorms/raw/2026-06-29-tdd-skill-integration.json` (the 4-lens+red-team
  workflow output, verbatim).
- **Freeze-wording correction** (per human: "we didn't freeze the repo") in the decision-session ledger
  (#11), the H10 item, and project-status — op-model v2 is a plan to review when it's time, not a
  moratorium; individual improvements are greenlit ad hoc. *(Left UNSTAGED — those are shared hot docs
  other agents are mid-editing; see Landmines.)*

## Why
- The repo already practices ~80% of the skill (pure-core, public-interface tests, seeded determinism,
  qa-playtesting §0's "drive real code paths"). The human wanted source fidelity over a heavy rewrite, so
  the net change is small and the skill's own integration-test creed matches the human's test preference.
- Measured `npm run verify` = **3.10s** (99 tests green) — logged as input to the H10 pre-commit-gate fork.

## Next intended steps
1. Ask the human one-by-one about candidate edits A–D (this session's open loop).
2. Optional/deferred: list `tdd` in CLAUDE.md's skills enumeration + cross-ref qa-playtesting §0 (held back
   to avoid racing parallel agents in those hot files).

## Landmines
- **Parallel agents active this session.** `project/status/project-status.md` and
  `project/human-in-the-loop/decisions.md` were rewritten under me mid-edit. My commit stages **only the
  new files I exclusively own** (the skill, the snapshot, the proposal, this journal); the freeze-wording
  edits to the 3 shared docs are left **unstaged** so I don't capture other agents' in-progress work — they
  land with the next commit of those files.
- Session numbering: another agent took `session-04-decision-session`; this is `session-05`.

## Addendum — candidate edits B + C applied
Human approved 2 of the 4 candidates: **B** (brittle-RNG-test warning → `tests.md`: assert relations/bounds
on RNG paths, never exact seeded values) and **C** (false-green / mutation check → `SKILL.md` new "Confirm
the test has teeth" section). **Declined A** (keep the verbatim trigger description) and **D** (commit-cadence
note). Also launched a subagent to copy the upstream `productivity/handoff` skill into `.claude/skills/handoff/`.

## Addendum 2 — `handoff` skill adopted (via subagent)
Copied the upstream `productivity/handoff` skill into `.claude/skills/handoff/SKILL.md` ~1:1 (a single
file; the source is one file). Frontmatter verbatim, incl. `argument-hint` + `disable-model-invocation:
true` (user-invoked only — `/handoff` won't auto-fire). Two adaptations (diff-verified): save location →
repo-local git-ignored `tmp/` (CLAUDE.md forbids the global scratchpad); the artifact list + a note map it
onto our resumability machinery (`project/journal/` + `project/status/project-status.md`) — the handoff doc
is a transient `tmp/` aid for one fresh agent, NOT a replacement for the journal/status. Verbatim source
snapshot left at `tmp/handoff-src/` (git-ignored). Committed scoped (subagent did no git, per the shared-tree
hazard).
