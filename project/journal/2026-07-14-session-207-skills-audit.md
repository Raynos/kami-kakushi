# Session 207 — 2026-07-14 — skills audit: is `.claude/skills/` dead weight?

**Summary:** the human asked for an audit of the 16 repo skills
(worried about count + rot). Evidence-triangulated each one (git
history minus reformat sweeps · journal mentions with word-collision
control · produced artifacts · cross-refs · dead-link check). Result:
10 alive/load-bearing, 2 dormant by design (`prd-compress`,
`distill-taste` — parked per their ADRs), 3 needing a human call
(`handoff` retire candidate · `battery` maintained-but-unfired since
2026-06-29 · `tdd` is a pointer-target reference, not a live skill).
Zero dead links in any SKILL.md; all descriptions together cost only
~1.6k always-loaded tokens, so count is not the problem.

## What changed

- `project/audit/reports/2026-07-14-skills-audit.md` — NEW, the full
  report: method, three tiers, per-skill evidence, the 3 asks.
- `project/todo-human.md` — reading-queue entry for the report (same
  commit as authoring, per the queue rule).

## Next intended steps

1. Human reads the report → rules on the 3 asks (retire `handoff`? ·
   `battery`: recommit a v0.4 run alongside HR-1, or park? · `tdd`:
   keep as reference or fold-and-archive).
2. Agent executes whichever culls/moves are approved (repo-map.md
   lines ride along with any retirement).

## Landmines

- Journal greps for skill names collide with common words ("ship",
  "battery", "diverge") — the report's counts used slash-invocation
  and artifact evidence, not bare word counts. Don't re-derive usage
  from bare greps.
- `last-touched` dates on skill dirs are inflated by mass sweeps
  (the 07-13 printWidth reformat, ADR/rename sweeps) — read commit
  subjects before calling a skill "actively maintained".
