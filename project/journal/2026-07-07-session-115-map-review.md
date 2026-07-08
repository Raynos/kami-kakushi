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

## The rung-reveal illustration (same session, human ask mid-flight)

The human asked to SEE how the T0 map opens rung by rung. Built as an
overlay script on the real sheet (`tmp/rung-reveal.mjs` — zero game-code
changes): four states T0R1/R3/R5/R7 with fog as UNSURVEYED PAPER (the
family's own survey simply stops at a scrawled edge; furniture exists
from R1), 未 ghost chips as next-rung hints, rumor notes in the fiction's
voice (堰ヨリ水来ル · 古キ構ヘ有リト云フ), the ruin + grove held as the
LAST fog masses so the G5 twist lands at R7/Phase-2. Renders:
`project/audit/screens/2026-07-07-t0-rung-reveal/` (local). Design
write-up + the sheet-vs-地図 unlock-source fork:
`project/brainstorms/2026-07-07-t0-map-rung-reveal.md` (queued).

## Four forks locked + HR-12 closed (same session, later — ADR-151)

The human answered the next four forks (AskUserQuestion): the sheet
BECOMES the player map (地図 renders it, seals = nodes, one unlock
source) · the rung-reveal mechanism builds NOW (placeholder ladder,
build plan edits the table later) · Phase B → Phase C order · **HR-12 =
PASS** from the session renders. ADR-151 records it; HR-12 graduated to
archive.md (id collision with the FB-121 HR-12 noted). Next: /drain-inbox
(the human dropped concrete T0/T1 sheet feedback) → Phase B remainder →
rung mechanism → Phase C.

## Inbox drain, batch 1 of 1 — the 17-capture map session (later still)

The human's map playtest session (17 captures, one file) drained
interactively: triaged into mechanical fixes / geometry nudges / three
forks, all approved via AskUserQuestion — **T1 canon = HYBRID** (guest
compound stays the rebuild core; ONE fresh element reaches into the
precinct edge as a T2 promise) · **JP marginalia = strip to
player-legible** · **LOD = fade, same gate** · batch = fix all. Two
capture-TOOL bugs found while grounding (map-modal screenshots come out
empty; the element picker returns null inside the modal) — logged, fix
queued. First landing (this commit): the strip — marks/pills/legends/
hanko/新/notes gone, cartouche English gloss, user-select fix, caption
contrast, LOD fade. Geometry + craft + hybrid-canon landings follow.

Second landing — the geometry batch (layout.ts, one geography): the ruin
core grows ~18% + a sixth fallen mass (the 5× canon now SHOWS), the
guest house steps down to scale 1.22, the orchard moves off the rubble
core, the precinct N wall drops ~45u so the bamboo grove gets its own
ground below the foothills, the upstream pools re-seat on the river's
west bank (strike ends on the pool group, 改・涸 note clear of the
water), and a forest tongue reaches into the T0 window's east edge.
All verified on fresh captures of both sheets.

Third landing — craft + canon (drain items 5/6/8/11 + the hybrid):

- The weir is an EVENT: the old bar ran ALONG the river (angleDeg 100 —
  the real reason nobody saw it); now a gold two-course stone bar
  crosses bank-to-bank with stakes and a foam step below. The
  footbridge + T1 fish weirs get the same crossing fix.
- Bamboo reads bamboo: interior culms taller with mid-culm joint
  ticks, bigger nodding edge clumps.
- The drill yard is a YARD: swept ground west of the stall range, rake
  sweeps, two straw drill-dummies, the rack in the corner; the seal
  anchors on the yard; the forecourt yields its east end.
- 'Kitchen threshold & board-side' → 'The Kitchen threshold'.
- ADR-151 hybrid canon element: on T1 one stretch of the precinct wall
  north of the lived corner is re-stacked in fresh work + 改・繕 — the
  first hand laid on the old ground; the ruin core stays untouched.

Drain closed: FB-178..FB-196 logged in
`project/feedback-human/2026-07-07-playtest.md` (17 sheet items — all ✅,
FB-193 as the ADR-151 hybrid — + the two capture-TOOL bugs FB-195/196
left 🔲 open, fix queued); the session file + JSONs archived
(`playtest-inbox/archive/2026-07-07T22-29-33-9aa00d*`). pending/ is
empty. Next: FB-195/196 tool fix, then Phase B remainder (fine register,
ground texture, forest strata, wing fills) → rung mechanism → Phase C.

FB-195/196 fixed (the capture tool itself): the snapshotter now
rasterises a `shotRoot` (main passes document.body — the map scrim
mounts there, outside #app, which is why every map shot came out empty;
the overlay's own note box is filtered from the shot), and the pick-mode
resolver accepts Element instead of HTMLElement (the sheet is SVG top to
bottom — every pick nulled). Seals now label as `map-sheet seal "<zone>"`
with a data-zone-anchored selector. Two RED-able regression tests; the
body-shot verified live with the modal open (centre pixel = sheet plate,
86% of the mid scanline sheet-ish).

Phase B batch 2 — the fine register + the ground plane:

- The L10 register POPULATED: roof shingle courses, rafter ticks, kura
  namako lattice, jizō offering dots, grave rake arcs, drill-yard rake
  sweeps all ride `.ms-fine` now (register 42/92 → 104/124 elements;
  the fit view sheds the micro-clutter, the close view pays craft).
- Forest depth strata: pine() gains `dim` (deep-interior trees recede
  by TONE per L2 — a scoped --silver-dim rebind); treeMass dims trees
  >56u from the edge. The stamped read breaks.
- The V-1 void fix, earned: wash geography moves to layout.WASHES (part
  of the §4 leak closed) + two new bands (hill-skirt colluvium, river
  meadow) + a seeded valley-wide life scatter (grass ticks · pebbles ·
  bare-patch scuffs, ~150 marks) so empty ground reads as DRAWN paper.
  One regression caught on capture: the skirt striped THROUGH the
  forest mass — trimmed to stop at its west edge.

The rung-reveal MECHANISM shipped (ADR-151): `reveal.ts` — fog as
unsurveyed paper (evenodd mask + scrawled survey edge + pegs, its own
displacement filter), 未 ghost chips + ENGLISH rumor notes (the strip
policy reconciled with the hint design), furniture holes so the family's
document never fogs — every input a data table (`REVEAL` stages +
`RUNG_LADDER` placeholder in nodes.ts; the build plan edits data, not
code). A DEV previewer pill (段) on the T0 sheet cycles 全→R1→R3→R5→R7;
verified live through the full cycle, no console errors.

Phase C opens — the golden pin first (sequencing judgment: the wholesale
role-named-seed refactor would RESHUFFLE the HR-12-passed look, so it is
SKIPPED; the pin freezes the current rendering and every refactor proves
itself against it). `golden.test.ts` (jsdom) hashes both grounds' full
draw-attribute streams + node counts (17,107 / 17,154) into
`golden.hash.json`; regen = `UPDATE_MAP_GOLDEN=1 vitest run …` committed
WITH the intentional change. RED-proven: a 1-unit weir nudge fails both
tiers; reverted, green.

Blind pass 3 (Phase B close): every M-line passes on both sheets — R4
and R13's closed-half confirmed in the readers' own words; R16 became
the T1 headline ("not one drop of red ink… a held breath"); V-1 closed
("the sheet feels like paper, not a void"). Report:
`project/audit/reports/2026-07-08-t0t1-map-blind-pass-3.md`. The one
shared nit (Gate/Night-rounds caption collision) fixed by extending the
caption pass to ALL seals — which surfaced a real bug (a candidate box
colliding with the seal's OWN inflated chip; self-exclusion added).
Golden pin untouched (seals are shell-layer, not hashed ground).

Pinch zoom (G-9, player-bound per ADR-151): the shell tracks live
pointers; two fingers zoom about their midpoint through the existing
zoomAt path (a second finger ends the pan — the gesture becomes a
pinch). Verified by synthetic two-pointer spread: 3x finger spread =
exactly 3x viewBox zoom, centred, no errors. Phase C remaining: geom
core extraction · node collapse (defs/use + single-path hatch/stipple)
· tier-delta record + ruinRevealed · turbulence filter eval · API idiom
pass — all under the golden pin now.

Tier-delta record (G-4): the lone `fresh` boolean that branched at ~15
sites becomes ONE declarative `TIER_DELTA: Record<Tier, TierDelta>`
(fresh · poolsDrained · worksSilted · clampSmoking · forgeLit ·
terraceCount/Numbers · orchardFeral · ghostRoads · ruinRevealed). T2 is
now an additive column, and `ruinRevealed` is the explicit seam at the
ruin painter for T2's reveal. Golden pin GREEN throughout — the refactor
is provably look-neutral.

Node collapse (G-2, first tranche): hatchArea emits ONE multi-subpath
path (was one element per scanline segment — a hill flank cost 40-60);
stipple emits ONE filled path of arc-pair dots (a rubble field cost
hundreds of circles). 17,107/17,154 → ~15.6k live elements; visually
indistinguishable on capture (rubble, hachures, pool cracks intact).
Golden pin REGENERATED with the change (the pin's intended flow).
DELIBERATELY SKIPPED: <use>-deduplicating trees — per-tree seeded
uniqueness is the L6 anti-stamp rule, a design feature not an
inefficiency.
