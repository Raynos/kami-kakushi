# Session 207c — 2026-07-14 — skills-audit rulings + trigger boosts

**Summary:** the human walked ALL seven questions/decisions from the
session-207 skills audit in two AskUserQuestion batches (the two-turn
diff→"ask" flow). Every ask is now CLOSED — rulings recorded in the
report's new "Rulings" section. Three skills got their frontmatter
`description:` (the always-loaded trigger surface) rewritten to fire
more often, per the human's steer; two drafts were rejected as too
long (prompt-token cost) and re-cut before approval.

## What changed

- `.claude/skills/battery/SKILL.md` — description: leads with the
  CHEAP modes (diff re-audit / mini), fences the full battery to
  milestone/pre-ship/human-ask, tells agents to SELF-INVOKE instead
  of improvising ad-hoc audits. (Human: keep the skill, use it more,
  no full battery now — too expensive.)
- `.claude/skills/tdd/SKILL.md` — description: agent-shaped triggers
  (reproducible bug → failing test FIRST; pure-core features; any
  new test → mutation-check). ~310 chars (first draft ~560,
  rejected for length).
- `.claude/skills/grill-me/SKILL.md` — description: MANDATORY for
  any human interview — "a skill-less grilling is a FAIL" (human's
  framing); wider phrasings (brainstorm / think-through / poke
  holes / floated idea). ~395 chars (first draft ~590, rejected).
- `project/audit/reports/2026-07-14-skills-audit.md` — "Rulings"
  section: all 7 asks closed (handoff keep · battery keep+boost ·
  tdd keep+boost · prd-compress dormant · distill-taste dormant ·
  other descriptions untouched · grill-me keep+boost).
- `project/todo-human.md` — audit report cleared from the reading
  queue (engaged this session — ADR-089 implicit sign-off).

## Next intended steps

1. None queued from the audit — every ask is closed. Watch whether
   battery/tdd/grill-me actually fire more in coming sessions; if
   not, the next rung is an AGENTS.md nudge line (deliberately NOT
   added yet — descriptions are themselves always-loaded).

## Landmines

- Description length = per-prompt token cost on every request; the
  human rejected two boost drafts over exactly this. Keep future
  description edits near original size.
- The audit report's tier tables and line counts are pre-brevity-pass
  history; the Rulings + postscript sections are the live word.
