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
- FB-333 ✅ — day-name canon `DAY_OF_WEEK_NAMES` (day 0 = Monday 月); clock now
  season + weekday, year/day-counter dropped.
- FB-335 ✅ — body meter gets life-style `cur/max` numbers + a hover title
  naming what fills/drains it.
- FB-336 ✅ — Map tab defaults big: log column folds away (CSS off the
  `data-active-tab` stamp), sheet first, you-are-here card below.
- FB-346 ✅ — tooltips standardized: every do-panel action carries a one-line
  cost/effect title from the paying selectors (AC-6); disabled reasons win.
- FB-345 💬 — body-split plan authored (3 options, rec. C: stamina short-cycle
  + hunger daily-cycle), queued for reading, NOT built (human ruling).
- FB-343 💬 — eat-rice stays a zone action for now; its re-home is a named
  Phase-0 ruling in the body-split plan.
- FB-338/FB-342 💬 — F-entries logged pointing at the ADR-177 rulings (estate
  plan owns the builds); sidecars stamped with the ruling commit.
- All 9 lane sidecars stamped done; the r1 bucket archived (every sidecar in
  it done, incl. the log-panel + work-actions lanes' items); claim released.

## Next intended steps

- The body-split plan awaits the human's Phase-0 rulings (reading queue).
- HR-27-adjacent: none — the drain surfaced no new HR items; the four forks
  were ruled in-session via AskUserQuestion.
- pending/ is EMPTY — the whole inbox is drained.
- e2e follow-up — the market-loop journey re-anchored to the Zone tab (the
  who's-here move); local e2e: 83/84 green, the one red being the documented
  webkit stale-hit-test flake under parallel load (passes solo, CI retries).
