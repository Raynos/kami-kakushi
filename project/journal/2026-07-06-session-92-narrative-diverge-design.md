# Session 92 — 2026-07-06 — D-139: narrative diverge designed & locked

**Summary:** grilled the human on "diverge, but for story/narrative" (six
AskUserQuestion rounds, ~23 questions) and promoted the result to canon: ADR
**D-139** (every story element ships from 3+ takes), an always-loaded
AGENTS.md bullet, the new **`narrative-diverge`** skill, and a build plan for
the two in-game review surfaces. The sibling fable audit/redesign TODOs were
explicitly left untouched (fresh-context work the human kicks off).

## What changed

- `project/brainstorms/2026-07-06-narrative-diverge-design.md` — the full
  Q&A capture (Q1–Q23) + synthesis; the session's source of truth.
- `docs/living/decisions.md` — **D-139** appended: scope (fiction-voiced
  text, own unit size), distinctness bar (dramatic choices, not
  paraphrases), blind one-agent-per-take authoring, scorecard+canon-fit
  self-pick, bundled human review, DEV-only alternates pruned at sign-off.
- `AGENTS.md` — always-loaded "Story diverges too (D-139)" bullet beside the
  D-075 UI-diverge bullet (a buried skill doesn't fire).
- `.claude/skills/narrative-diverge/SKILL.md` — new sibling skill: entry
  gate, 9-step procedure, anti-patterns.
- `docs/plans/fable-2026-07-06-narrative-dev-surfaces.md` — PROPOSED plan
  for the story-variant set-switcher + read-only full-page script-reader
  modal (D-138 `__DEV_TOOLS__` gating; sign-off stays conversational).
- `project/todo-human.md` — plan added to the reading queue.

## Next intended steps

1. Human reads the DEV-surfaces plan → lock routing → build kicks off.
2. Human kicks off the fable audit + fable redesign TODOs in fresh sessions;
   the redesign is the first big D-139 application (retro coverage of T0).
3. Until the DEV surfaces exist, any narrative-diverge bundle is reviewed
   from its R-item/review doc (skill §2.7 interim note).

## Landmines

- Do NOT pre-wire or brief the audit/redesign sessions from this one — the
  human explicitly wants them unpoisoned (Q10).
- The TODO line "Implement & design a diverge for story & narrative" is
  half-done (design canon; surfaces unbuilt) — left in place; the human
  section is human-authored, so removal is their call / prepare-to-exit's.
- R8 stays open as-is (Q21) — don't fold it into the redesign.
