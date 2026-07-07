# Session 115 — 2026-07-07 — T0/T1 map rebuild: fresh-eyes review

**Summary:** Verify-don't-trust review of the map rebuild (dea6b08 +
402f189): two independent code-review agents (primitive library;
composition + shell) + a direct visual pass on fresh post-polish captures
(no committed capture showed the post-polish code — took `tmp/
iter6-postpolish/`). Verdict: genuinely strong architecture (pure
primitives, deterministic, token-themed, clean shell), with three findings
that matter: (1) a capture-harness bug hid the `.ms-fine` zoom register in
EVERY capture the blind readers scored (`viewBox` set directly →
`data-zoom` never flips); (2) L10 is mostly unwired anyway — ~42/~92 fine
elements out of ~17,000/sheet (measured); (3) the ground plane still reads
as void, not paper, in large regions (the spec's own §3 warning). Full
review + ranked Phase A–D next-steps map:
`project/brainstorms/2026-07-07-t0t1-map-review-next-level.md` (queued for
the human, pairs with HR-12).

## What changed
- `project/brainstorms/2026-07-07-t0t1-map-review-next-level.md` — the
  review + next-level map (authored this session).
- `project/todo-human.md` — reading-queue entry for it.
- No code changes; `tmp/iter6-postpolish/` holds the fresh captures +
  the corrected fine-layer proof shots (git-ignored scratch).

## Key findings (the why)
- Capture bug confirmed two ways: code (`sheet.ts:414` CSS gate keyed on
  `data-zoom`, which only `zoomAt`/fit update) and screen (forcing
  `data-zoom='near'` at capture reveals rake arcs + room captions absent
  from every iter1–5 shot). In-game zoom unaffected.
- The blind-pass M-line results stand (M-lines don't hinge on fine
  detail), but the L10 register is unverified by fresh eyes.
- Element counts measured live: T0 16,875 / T1 17,040 SVG elements;
  fine register 42 / 92. Node collapse (single-path hatch/stipple,
  defs/use glyphs) is the big perf lever; the whole-map
  feTurbulence+feDisplacementMap filter is the zoom-hitch risk.
- Tier delta is `fresh: boolean` at ~15 sites with no ruin-reveal hook —
  T2's map (whose job is revealing the ruin) would be invasive today.

## Next intended steps
1. Await the human's read of the review + the HR-12 taste verdict (craft
   priorities may be redirected).
2. Then Phase A (fix + commit the capture script, fresh blind pass on
   corrected captures) → Phase B (fine register, ground plane, channel
   emphasis) as the natural autonomous workstream.

## Landmines
- Another agent (w2:p2) is live in this tree on story-bible docs —
  pathspec commits only, own paths.
- Phase C (node collapse / geom refactor) needs the golden-hash pin AND
  role-named seeds first, or refactors will silently reshuffle the look.
