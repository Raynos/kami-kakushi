# T0/T1 map sheets — fresh-eyes review + the next-level map

**Status:** review complete; forks LOCKED by the human 2026-07-07 via
AskUserQuestion → **ADR-149** (substrate = live A/B toggle · Phase A+B now ·
Phase C now · the maps are PLAYER-BOUND — they swap into the real game with
the story-bible rewrite). §5's phases are now the active workstream.
**Scope:** the rebuilt `src/ui/map-sheets/` (commits dea6b08 + 402f189) —
implementation, tooling, and the captured output — plus a ranked next-steps
map. Review by one fresh session (Fable) with two independent code-review
agents (primitive library; composition + shell) and a direct visual pass on
fresh post-polish captures (`tmp/iter6-postpolish/`, taken this session —
no committed capture showed the post-polish code). HR-12 (the human's live
taste call) stays open and is NOT replaced by this review.

---

## 1 · Verdict up front

The rebuild is genuinely good work — a real architecture, not cosmetic
layering: `brush.ts` (seeded, dependency-free ink toolkit) → six
primitive modules that import ONLY brush (grep-verified, zero layout/scene
coupling) → `ground.ts` scene composition with tier deltas → thin sheets
(18 / 76 lines) → a shared modal shell with correct cleanup. Deterministic
(no `Math.random`/`Date.now` anywhere in the fold), CSS-token themed (no
hardcoded colors — a player-facing reskin is a stylesheet), and the spec's
one-geography promise holds on screen: T1 is T0 revealed, nothing moves.

Three findings matter most, in order:

1. **The verification loop never saw the fine layer** (capture bug — §3).
   Every headless capture, including everything the blind readers scored,
   had the L10 zoom-reward register hidden.
2. **L10 is mostly unwired anyway** (§2): the fine register holds only
   ~42 (T0) / ~92 (T1) of ~17,000 SVG elements per sheet. "Fit stays
   composed, zoom pays craft" is currently: fit carries nearly all the
   detail; zoom mostly reveals captions.
3. **The ground plane is the craft gap** (§4): large regions still read
   as void, not paper — the one failure mode the spec's own §3 warned
   about ("atmosphere earned by rendering, not by darkness").

## 2 · Implementation review (two independent agents, converged)

What's strong (verified, so it doesn't need re-checking):

- Primitive purity: `built/water/flora/fields/terrain/furniture` import
  only `brush`; T2+ sheets reuse them unchanged.
- Determinism clean; float seeds stabilized with `toFixed`.
- Shell: cursor-anchored wheel zoom via `getScreenCTM().inverse()`;
  drag-vs-click disambiguation done right (deferred pointer capture);
  listener cleanup complete; layer pills + night rail are pure CSS
  attribute toggles, no re-render.
- Seal positions snap to drawn geometry via `paintWorld`'s returned
  overrides — the drawing is the single source. `wingedHouse` returns
  part-anchors for this. Right seam.
- DEV-strip: gating is correct (`__DEV_TOOLS__` → tree-shake), though
  per ADR-138 the T0 ship config (`SHIP_DEV_TOOLS=true`) intentionally
  ships the fold today.

The gaps, ranked:

- **G-1 · L10 LOD unwired.** Stall divisions, rake arcs, shingle courses,
  namako lattice, shutter ticks, jizō offerings all draw always-on;
  only room captions, terrace numerals, the otter den and one note ride
  `.ms-fine` (`sheet.ts:414` gate at `vb.w ≤ FR.w*0.62`).
- **G-2 · Node weight.** ~17,000 elements/sheet (measured live).
  `hatchArea` emits one `<path>` per scanline segment (`brush.ts:364`),
  `stipple` one `<circle>` per dot, each pine ~30–70 nodes, no
  `<defs>/<use>/<pattern>` anywhere. Single-path concatenation +
  glyph reuse is a 10–100× node collapse left on the table.
- **G-3 · Whole-map turbulence filter.** `feTurbulence` +
  `feDisplacementMap` wrap the entire art group (`sheet.ts:54–71`) —
  the main zoom-hitch risk: zoom can force re-rasterizing the full
  filtered group.
- **G-4 · Tier delta is a boolean.** `fresh = tier === 'T1'` branches at
  ~15 sites in three idioms; the ruin is drawn tier-blind with no
  reveal hook — T2 (whose whole job is revealing the ruin) would be an
  invasive edit today. A `TIER_DELTA` record + `ruinRevealed` flag
  makes T2 additive.
- **G-5 · Geometry core duplicated.** `rowSegments` (fields) duplicates
  `hatchArea`'s scanline-clip; per-point normals reimplemented ~5×;
  two competing polygon-inset ops (`insetPoly`'s centroid-scale is
  wrong for elongated paddies). Missing: `scanlineClip`, `normalAt`,
  `polyLen` in one geom home.
- **G-6 · Spec-§4 leaks in `ground.ts`.** Hardcoded world coords (wash
  polygons, old-field quads, three lone pines) + two raw-`<rect>`
  one-offs (otter den `ground.ts:271`, robbed hollows `:505`) that
  should be primitives / layout data.
- **G-7 · API drift.** Seed positional in ~7 primitives vs `o.seed`
  elsewhere; option types re-inlined ~30×; emitters inconsistently
  return nodes vs void. One idiom pass fixes it.
- **G-8 · `seedSeq` is call-order-dependent** (`flora.ts:37`) — one
  inserted mark reshuffles every downstream seed; defeats stable
  visual regression.
- **G-9 · No pinch zoom** — `touch-action:none` + wheel-only means touch
  pans but cannot zoom.

## 3 · Tooling review (the loop, not just the script)

The blind-reader loop (capture → fresh blind describe → judge vs the
R1–R18 rubric) is the best QA idea in this workstream — it caught the
invisible twist and the wings canon error the maker couldn't see. Keep
it. But:

- **T-1 · The capture bug (found this session).** `map-audit-shots.mjs`
  sets the SVG `viewBox` directly, so `data-zoom` never flips and
  `.ms-fine` stayed hidden in EVERY capture — the blind readers scored
  sheets with rake arcs, room captions, terrace numerals invisible.
  Confirmed by a corrected capture (`tmp/iter6-postpolish/
  t0-07-deep-FINE.png`): the forecourt gains rake sweeps, room seals
  gain captions. In-game zoom is unaffected (wheel/buttons go through
  `zoomAt`). PH3 note: the M-line passes are real (M-lines don't
  depend on fine detail), but the L10 register is UNVERIFIED.
- **T-2 · The loop's tool is git-ignored.** The capture script lives in
  `tmp/` — the load-bearing QA harness for these sheets isn't
  committed. It should graduate to `src/scripts/` beside
  `qa-shots.mjs`.
- **T-3 · The loop is manual.** Agents were spawned by hand; iteration
  artifacts live in git-ignored `tmp/iter1–5`. A small committed
  runner (capture + a blind-describe/judge Workflow + a committed
  report in `project/audit/reports/`) makes re-verification one
  command after any map change.
- **T-4 · No regression pin.** Nothing locks the look; a refactor (e.g.
  the G-2 node collapse) could silently degrade the sheets. Cheapest
  sound pin: golden-hash the emitted path `d`-strings per sheet+seed
  (goes RED on any geometry change, then regen intentionally) — pairs
  with fixing G-8 first.
- **T-5 · Post-polish captures didn't exist** until this session — the
  polish commit landed after iter5 closed. iter6 now covers it
  (polish items confirmed on screen: T0 legend drops 新, shrine seal
  on the corridor, ditches join the paddy grid, kura seal on the
  building).
- The hand-rolled-SVG choice (no rough.js/d3) is validated: determinism,
  token theming, and the primitives contract needed exactly this.

## 4 · Output review (my own eyes, iter6 post-polish captures)

What lands: the one geography reads across both sheets; the G5 twist is
drawn (precinct footings running into the neat gold wall — T0's blind
reader led with it); hills/bamboo/orchard have brush life; the survey
furniture (cartouche, 凡例, scale bar, fold creases, distance notes,
reviser's red) sells "commissioned, revised document"; the modal shell
reads composed and the roster panel is well-typeset.

The craft gaps to the AA bar, ranked by visual payoff:

- **V-1 · Void, not paper (L1).** Large flat near-black regions — T0's
  centre-west between ruin/paddies/river, T1's mid-band and south —
  read as unrendered ground at fit AND at zoom. The washes are too
  quiet to register as substrate; empty must still read as washi.
- **V-2 · Zoom doesn't pay yet (L10).** Deep zoom shows bare ground
  around good buildings — direct consequence of G-1; fixing the fine
  register fixes both the fit view's composure and the close view's
  reward.
- **V-3 · The channel at fit (G3).** "The single most functional line on
  the sheet" is legible at quadrant zoom but nearly vanishes at fit —
  it needs one weight/contrast step up, it is the sheet's causal spine.
- **V-4 · The forest mass reads stamped (L6).** The burn-line straight
  edge is canon, but the T1 woodlot's uniform glyph density + flat
  under-wash parallelogram read mechanical; wants scale/tone strata
  and broken non-canon edges.
- **V-5 · Wing fill registration.** At deep zoom the wings show offset
  double-rect fills that read as mis-registered planes rather than
  roof shading; the west-wing "closed veil" vs east "fresh" contrast
  is too subtle to carry its story.
- **V-6 · Label micro-collisions** at the T1 house cluster (改/新 marks
  vs seals) — minor.

## 5 · Next steps — the ranked map

**Phase A — verification integrity (cheap, first):**
1. Fix the capture script (set `data-zoom` with the viewBox), graduate
   it to `src/scripts/map-audit-shots.mjs`, recapture.
2. One fresh blind pass on corrected captures — closes the unverified
   fine register (T-1) and the post-polish gap (T-5).

**Phase B — craft to the AA bar (the visible wins):**
3. Populate the fine register (G-1): move always-on micro-detail into
   `fineLayer`, add the missing L10 marks — delivers V-2 and lightens
   the fit view in one move.
4. Ground-plane pass (V-1): stronger wash differentiation + sparse
   paper-tone texture so emptiness reads as sheet, not void.
5. Channel emphasis at fit (V-3); forest strata + edge life (V-4);
   wing plane cleanup (V-5).

**Phase C — engine hardening (before any T2 sheet):**
6. Node collapse (G-2): single-path hatch/stipple, `<defs>/<use>` tree
   glyphs; re-evaluate the whole-map displacement filter (G-3).
7. Tier-delta record + `ruinRevealed` hook (G-4); geom core extraction
   + API idiom pass (G-5/G-7); role-named seeds (G-8).
8. Golden-hash regression pin, wired as a gate (T-4) — after G-8.

**Phase D — the horizon (human decisions, not mine):**
9. **The player-facing map.** These sheets are DEV review surfaces; per
   PH6 a player can't reach them, so as *game* content they don't
   exist yet. The engine is reusable by construction (primitive
   purity, token theming) — whether/when T0's game grows a map surface
   (and in what fiction-caused form) is a design call → HD-item when
   the time comes.
10. Pinch zoom (G-9) matters the moment any map surface is
    player-reachable on mobile.

Phases A+B are a natural next autonomous workstream once HR-12's taste
verdict lands (the human may redirect the craft priorities); Phase C
gates T2 map work, not current play.
