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

## Decisions locked (same session, later — ADR-149)

The human answered all four review forks via AskUserQuestion: substrate =
wire BOTH behind a DEV toggle, pick live during HR-12 · Phase A + full
Phase B now (ground/void wash waits for the substrate pick) · Phase C now,
while hot · and the reframe: **the maps are player-bound** — built in the
DEV panel first as a standalone unit, to swap into the real game when it
is rewritten to match the story bible. ADR-149 records it; HR-12 updated
(the substrate pick is now part of the live review); the brainstorm doc's
status flipped to LOCKED. Build begins: Phase A (capture fix + fresh
blind pass) → substrate toggle → Phase B → Phase C.

## Phase A + the substrate steer (same session, later still)

Phase A done: the capture script graduated to
`src/scripts/map-audit-shots.mjs` with the LOD fix (it now flips
`data-zoom` the way the shell's zoom does — the old tmp/ script hid the
`.ms-fine` register from every iter1–5 shot); 14 corrected captures in
`project/audit/screens/2026-07-07-t0t1-map-postpolish/`; two fresh blind
readers scored them (report:
`project/audit/reports/2026-07-07-t0t1-map-blind-pass-2.md`). Result:
every M-line passes except **R4 on T0** (the irrigation channel reads as
a ROAD — it wears path grammar) and the R13 west-wing-CLOSED half on T1;
R15's terrace-numeral read is direct proof the capture fix mattered
(numerals live in the fine register pass 1 could never see). The washi
substrate A/B (ADR-149 decision 1) was built, screenshotted, and **killed
by the human before commit** ("doesn't fit the style of the rest") —
night-indigo is the committed substrate, ADR-149 amended, HR-12's
substrate question closed, the sheet.ts washi edits reverted un-committed.
Phase B next: R4 water grammar, west-wing shutters, fine-register
population, ground texture (night, earned), forest strata, wing fills,
label collisions.

## Phase B, first batch (same session, later)

The two M-line misses + the composure wart, all verified by fresh
captures at each step:

- **R4 — the channel reads as WATER now** (`water.ts channel()`): tapered
  brush banks at working weight, a moonlit silver sheen between them (a
  dark cut is invisible on the night sheet — the root of the "road"
  miss), broken current threads (the river's suiha idiom at ditch
  scale), more downstream chevrons, and sedge flicks along the cut — the
  same accessory grammar that makes the weir reeds read wet.
- **The "gold vein" dies:** `terraceRun` gains `fresh` — T1's re-stacked
  walls keep the gold; T0's old stone drops to survey silver.
- **R13 — the west wing reads CLOSED:** the faint veil becomes an amado
  slat grille + a tied cross over the south door; shuttered-but-tended.
- **V-6 — the house cluster composes:** `drawSealLayer` runs a greedy
  deterministic caption pass (below → above → suppressed-to-tooltip,
  boxes tested against every chip + placed caption); suppressed seals go
  fully quiet (hover/roster carry name + marks). The 改・東棟成 note
  moves above the wing; the inner-garden anchor drops into the garden
  gap, clear of the shoin chip.
