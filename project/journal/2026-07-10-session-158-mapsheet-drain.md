# Session 158 — 2026-07-10 — drain the mapsheet inbox lane (FB-339..341)

**Summary:** Claimed the `mapsheet` lane (ADR-171) and drained all 3 captures
with the human's wholesale go-ahead: **FB-341** (bug — far map seals read
clickable but click dead) fixed test-first; **FB-339** (question — port the T0
prototype viewer's zoom/pan/fit/full onto the live map tab) approved and
ported; **FB-340** (question — travel presence: a real position marker +
animated zone-to-zone movement) routed to an ADR-075 diverge lane (2–3 working
variants, HR-items). F-entries in
`project/feedback-human/2026-07-10-playtest-mapsheet.md`.

## What changed
- `src/ui/map-variants/sheet-map.ts` — FB-341: far seals (revealed, beyond one
  step) stamp `data-far` + `aria-disabled`; `cursor:pointer` + the gold hover
  glow now scope to `[role="button"]` (wireTravel'd seals only). Root cause:
  the class-level pointer + any-non-locked hover made adjacency-gated seals
  look walkable (repro'd live from the capture save — at the gate, only the
  forecourt is a legal step).
- `src/ui/render.test.ts` — new RED-able test: at the gate a revealed woodshed
  seal is inert (no role, no pointer, click dispatches no `move_to`).
- `src/ui/map-variants/sheet-map.ts` — FB-339: the DEV survey viewer's
  interaction layer ported onto the live map tab — wheel/pinch zoom, drag pan,
  ⊕/⊖/fit/full controls, the map-spec L10 fine-register zoom gate. View +
  maximize state live at module level so the sig-guard rebuild keeps the
  player's framing (TST2). Golden pin green (no geometry change). Note for QA
  scripts: `move_to` is TIMED (ADR-148) — a seal click's effect lands after the
  walk duration; only `__qa.dispatch` is instant.
- FB-340 diverge (ADR-075) BUILT — `sheet-map.ts` gains a `presence` mode
  ('glide' ships; 'steps'/'follow' reachable only from dev.ts): three walk
  idioms all driving the ONE here-ring (P2), animated only on a real one-hop
  walk (load/teleport never animates; reduced-motion instant; the rAF timeline
  aborts if the sheet is replaced — TST2). `dev.ts` registers
  `travel-presence` (A · glide seal — self-picked default, rubric 22/24 · B ·
  ink footsteps 20 · C · the sheet walks 18); `render.ts` folds the variant
  into the map sig so the panel toggle repaints; `shared.ts` gains
  `buildMapCtx` (the ONE ctx source — render.ts + dev.ts, TST1). **HR-26**
  files the review bundle with the Pass-1 brief + per-variant scorecards.
  Verified live headlessly per variant (overlay plays + cleans up; C pans the
  view to centre at the player's zoom). Strip posture: T0 ships DEV tools
  default-off (ADR-138) — variant code rides `?dev=yes` like every other
  diverge; `verify-dev-strip.sh` green.
- Sidecars stamped done (FB-339 913ce02b · FB-340 this commit · FB-341
  975fa3cd); the `mapsheet` bucket archived; lane claim released end of pass.

- `src/ui/map-variants/sheet-map.ts` + `src/ui/render.test.ts` — HOTFIX: the
  FB-339 chrome called `getScreenCTM`/`DOMPoint`/`setPointerCapture` unguarded;
  jsdom implements none, so the pre-push FULL vitest lane went RED when a
  full-mount sweep clicked the zoom buttons (blocked every push — flagged by
  w2:p5). Feature-checked all three + a RED-able jsdom interaction test
  (proven RED unguarded via stash).

## Next intended steps
1. The human's HR-26 pick (travel presence) — promote if B/C wins, retire the
   alternates; silence ships A.
2. Remaining inbox lanes (the-log 12 · r1 12 · r0 4 · dev 3 · feedback-ui 2 ·
   new-game-screen 1 · cold-open 1) — claim the next lane when picked up.
