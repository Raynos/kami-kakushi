# Session 164 — 2026-07-10 — drain the r1 lane (9 items)

**Agent:** Claude Code (claude-fable-5), pane w1:p3.
**Lane:** `r1` (claimed via inbox-claim; no fix-surface collisions —
`log-panel`/`feedback-ui`/`new-game-screen` live under other agents).

## What happened

- Reproduced all 9 open r1 captures (headless vs :5173 + capture screenshots +
  code grounding at HEAD); proposed the lane wholesale; human ruled the four
  forks: FB-345 body split → **plan, don't build**; FB-332 Work→Zone → **do
  now**; FB-336 map default-big → **yes**; FB-333 day canon → **月..日, day 0 =
  Monday**.
- FB-338/FB-342 were already ruled by the estate plan's Phase 0 (ADR-177):
  estate leaves R1, weir locked-until-named — logged + stamped here, build
  lands with that plan.

## Per-item log

- FB-332 ✅ — Work tab renamed **Zone**; who's-here 衆 + talk-to-reveal wares
  moved Map → Zone (render.ts), tests updated (render.test.ts, e2e journeys).
