# Session 131 — 2026-07-09 — HD-30 supplemental prose wave + the scene-def swap

**Summary:** Drained the last `[dev — …]` placeholders the G4 cutover left in
shipped src — the nengu-autumn-frame VN beat (a real 3-take diverge, self-picked
Take C) + ~18 short "texture" lines — all authored in §0.5 register. To honor
ADR-139 ("a doc-only review is not a review; wiring the swap is PART of the
diverge") the session **built a new `dev.subScene` swap for generalized
scene-defs** so the nengu alternates review LIVE in DEV → Story. Filed **HR-17**
(the review gate); **HD-30** now BUILT, awaiting that sign-off — the last gate
before G7 (still human-initiated).

## What changed

Prose migration (placeholders → authored, in-register):
- `src/core/content/surfaces.ts` — 13 reveal lines authored (body/rice/coin
  readouts, rest verb, the 8 sited nodes, wage-collect); 3 stale `[dev]` comments
  cleaned.
- `src/core/intents.ts` — bare-corner rest line + the wage-collected log line.
- `src/core/step.ts` — the nengu reckoning log line (felt, never numbered).
- `src/app/main.ts` — the clean-break save-retirement notice (in-fiction).
- `src/core/content/narrative/requirements.md` — r3-grain-watch + r7-nengu flavor
  + drive lines.
- `src/core/content/narrative/scenes.md` — the `nengu-autumn-frame` body = Take C
  (+ one grafted image from Take A); provenance comment points at the open bundle.
- Regenerated `*.gen.ts` + `docs/content/t0-story.md`; fixtures re-baselined
  (prose is serialized into log states).

The scene-def swap mechanism (ADR-139 — generalized scenes were the one VN type
with no live swap):
- `src/scripts/narrative/emit.ts` — extracted `emitSceneDefBody` (the RungScene
  payload) so takes can reuse a scene-def body.
- `src/scripts/narrative/takes.ts` — emit `scene-def` blocks from take files →
  a `scenes` field (keyed by scene id).
- `src/ui/storyTakes.ts` — `StoryTake.scenes?: Partial<Record<string, RungScene>>`.
- `src/ui/dev.ts` — `subScene(scene)` (mirror of `subRungScene`, keyed
  `scene:<id>`) + the Story-pane comment now lists generalized scenes.
- `src/ui/render.ts` — `activeVn` substitutes the active scene-def via `subScene`
  (guarded `__DEV_TOOLS__ && dev`; trigger/once stay canon → never re-fires).
- `src/ui/dev.test.ts` — 3 RED-able tests: fixture identity/swap/override + a
  **real-registry** end-to-end guard (the authored hd30-nengu take swaps).

The bundle:
- `src/core/content/narrative/takes/hd30-nengu/{bundle.md,take-a.md,take-b.md}` —
  the open diverge (Canon=Take C in scenes.md; A=Chiyo's arithmetic, B=day-book
  register). Pruned on HR-17 sign-off.
- Deleted the superseded `t0v2/hd30/` staging (never committed; content now lives
  in canon + the bundle + src).

Queue:
- `project/human-in-the-loop/review.md` — **HR-17** (the nengu pick + texture
  lines).
- `project/human-in-the-loop/decisions.md` — **HD-30** marked BUILT, → HR-17.

## Next intended steps
1. **Human:** review HR-17 (DEV → Story → hd30-nengu; toggle Canon/A/B; advance
   an R7 fixture to the Autumn season-exit to see it live). Closing HR-17 closes
   HD-30.
2. **G7 (human-initiated only):** once HD-30 closes, `/ship` per the plan's G7 DoD
   — never agent-initiated.
3. OWED: balance re-baseline (`verify:balance` ratio + regen `t0-pacing.md`),
   still batched from the G4 cutover.

## Landmines
- **The nengu alternates are the ONLY generalized scene-def diverge so far.** The
  swap wires through `scenes` (keyed by scene id) — distinct from `rungBeats`
  (by rank) and `introScenes` (by id). Don't confuse the three unit keys
  (`rung:` / `intro:` / `scene:`).
- All three nengu takes are **narration-only** (empty decision) → trivially
  state-compatible. A future scene-def diverge WITH a decision must keep option
  ids/flags/memory identical to canon (the takes/README rule) or the swap forks
  state.
- `t0v2/hd30/` is gone; the durable record of the wave is canon + the bundle +
  this journal. Don't look for the staging files.
- The DEV Story tab now shows **1 open bundle** — expected, and now KEPT (see
  addendum). Do NOT auto-prune it.

## Addendum — reader fix + ship-line close-outs

Human review surfaced a bug + a steer:
- **Bug (fixed, `d709550`):** the "Explore this diverge" reader page was BLANK
  for hd30-nengu — the galley never handled the `scene:` unit type
  (`readerUnitsOf`/`readerUnitLines`/`LIVE_UNITS`). Wired it (canon reads the
  live SCENES registry via `sceneById`); RED-able guard on the real bundle.
- **Human steer (2026-07-09):** signed off HR-17 (Take C canon) but asked to
  **leave the diverge lying around** → the `hd30-nengu` bundle is KEPT, not
  pruned (ADR-022 override of the takes/README prune rule; noted in bundle.md).
- **Close-outs:** HR-17 → archive (Reviews, signed off); HD-30 → archive
  (Decisions, run & built); plan Status flipped to "🔧 BUILT to the ship line".
  **HR-8 stays OPEN** — its condition is "when the new text SHIPS to players"
  (gh-pages), so it closes at G7, in the post-`/ship` cascade, not now.

**The ship line.** G0–G6 + HD-30 are done and green. The ONLY remaining step is
G7 = `/ship` (user-invoked; never agent-initiated). Recommended order: the
human's rung-by-rung QA (tomorrow) → OWED balance re-baseline (post-QA, so it
reflects any QA tuning) → `/ship`. On ship I cascade: HR-8 moot, Plan A's A5
closure, and archive all three storywave plans.
