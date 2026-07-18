# Session 215 — 2026-07-18 — reading-script interleave: t0-story.md spine fixed

**Summary:** Shipped
`docs/plans/fable-2026-07-18-reading-script-interleave.md` (now
archived). `docs/content/t0-story.md` reads R1→R7 continuous: the
emitter walks RANKS and folds rung-homed scene-defs into the ladder
(`r2-yard-hand` under R2 via its `rung R2` trigger; `count` /
`count-resolve` under R5 and `r7-dream` under R7 via the new `reading:
RN` meta key). Scope note: the plan named only the R5 pair; `r7-dream`
was added by the human's live call (identical rung-ascension pattern —
`intents.ts:384` enqueues it at R7, same as `count` at R5).

## What changed

- `src/scripts/narrative/story-doc.ts` — the rung ladder now iterates
  `RANKS` (R0 excluded, D-110) and emits a section per rung carrying its
  `## rung` beat plus every ladder-placed scene-def (`reading:` meta or
  a `rung <R#>` trigger, via `placedRungOf`); the generalized section
  keeps only genuinely ladder-external defs.
- `src/scripts/narrative/parse.ts` — `reading` added to RESERVED + the
  scene-def meta whitelist (any other block still rejects it).
- `src/scripts/narrative/validate.ts` — `reading:` must name a ladder
  rung R1–R7 (derived from RANKS), and REDs on a rung-triggered def (one
  placement source).
- `src/scripts/narrative/story-doc.test.ts` — NEW spine test (COMMIT
  lane, ~6ms): parses the REAL authoring sources, asserts one rung
  heading per RANKS rung in ascending order and no ladder-placed def in
  the generalized section. **RED-proven** against the pre-fix emitter
  first (both assertions failed: missing R2/R5 headings; `r2-yard-hand`
  filed under Generalized).
- `src/scripts/narrative/validate.test.ts` — 4 new reading-key tests
  (clean use · non-ladder rank REDs ×2 · rung-trigger conflict REDs ·
  non-scene-def block rejects at parse).
- `src/core/content/narrative/scenes.md` — `reading: R5` on `count` +
  `count-resolve`, `reading: R7` on `r7-dream` (doc placement only).
- `src/core/content/narrative/README.md` — grammar section documents
  `reading:` (+ md-wrap reflow of the file).
- `docs/content/t0-story.md` — regenerated; the visible payoff. All
  runtime `*.gen.ts` registries byte-identical (the key is inert —
  `emitSceneDef` copies only named meta), confirmed via git status after
  `pnpm run gen:narrative`.
- `docs/plans/fable-2026-07-18-reading-script-interleave.md` — Status →
  ✅ DONE, graduated to `project/archive/`; its reading-queue line
  removed from `project/todo-human.md` (the human directed the build).
- The plan's BACKLOG line was already out (removed at plan authoring).

## Next intended steps

1. Nothing queued from this work — the payoff lands under HR-38's feet
   (the full-sweep story review now reads a continuous spine).

## Landmines

- `reading:` restates a code-scripted home (`intents.ts:383/384`); if
  the accusation night or the R7 dream ever moves rungs, the meta line
  must move with it — a content-review catch, accepted in the plan.
- Commit had to wait for a shared-tree green window: stamp-book (w7) and
  estate craft-pass (w3) WIP held oxfmt/tsgo/vitest/review-link red
  mid-session; my slice was verified green in isolation first.
