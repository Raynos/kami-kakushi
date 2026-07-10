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
- (this session, later commits) FB-340 diverge — see the per-commit entries
  below.

- `src/ui/map-variants/sheet-map.ts` + `src/ui/render.test.ts` — HOTFIX: the
  FB-339 chrome called `getScreenCTM`/`DOMPoint`/`setPointerCapture` unguarded;
  jsdom implements none, so the pre-push FULL vitest lane went RED when a
  full-mount sweep clicked the zoom buttons (blocked every push — flagged by
  w2:p5). Feature-checked all three + a RED-able jsdom interaction test
  (proven RED unguarded via stash).

## Next intended steps
1. FB-339 — port wheel/pinch zoom, drag pan, fit + full from
   `src/ui/map-sheets/sheet.ts` onto `renderMapSheet`; blind-pass after.
2. FB-340 — travel-presence diverge (marker + move animation), variants behind
   the DEV toggle, HR-items filed.
3. Stamp all 3 sidecars + archive the `mapsheet` bucket; release the claim.
