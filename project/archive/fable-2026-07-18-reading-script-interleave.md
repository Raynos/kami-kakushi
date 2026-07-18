# t0-story.md — interleave rung-triggered scenes into the ladder

**Status:** ✅ DONE (2026-07-18, session 215 — shipped; scope grew
by one under the human's live call: `r7-dream` also gained
`reading: R7`, the same rung-ascension pattern as `count`)
**Confidence:** ( 75% Opus, 25% Fable ) — mechanical emitter work; the
only judgment is the shape of the one grammar-meta addition.
**Template:** process

## Who builds this — Fable or Opus?

One sitting, one builder — Opus-capable throughout (emitter + meta
key + test). No taste calls; the grammar-shape call is made in this
plan, not at build time.

## Why

The W6 full-tier cold read (2026-07-12) found the generated reading
script `docs/content/t0-story.md` runs **R1 → R3 → R4 → R6 → R7**:
R2's beat (`r2-yard-hand`, the silent rung) and R5's (`count` /
`count-resolve`, the accusation night) are scene-defs, so the emitter
files them under "Generalized scenes" instead of in the rung ladder.
A cold reader — *including the human reviewing story* — hits two
holes in the spine and cannot tell the tier is continuous. The game
plays in the right order; it is the REVIEW SURFACE that misleads.
Recorded in `project/BACKLOG.md` (T2 section, "parked as minor");
pulled forward by the human 2026-07-18 ("Make a plan for 4", the
overnight-burn triage). This is queue compression: HR-38 (the full
sweep) and every future story review reads this doc.

## What exists today

Surveyed **2026-07-18** at `9e2dff3c`:

- Emitter: `src/scripts/narrative/story-doc.ts` lines 174–199 — rung
  blocks render in ladder order, then ALL scene-defs flat under
  `## Generalized scenes (G3.5 stub)`.
- `r2-yard-hand` carries a machine-readable trigger —
  `trigger: rung R2` (`src/core/content/narrative/scenes.md:577`).
- `count` / `count-resolve` carry `trigger: scripted`
  (`scenes.md:72,161`); their R5 home lives only in code —
  `src/core/intents.ts:385` enqueues `count` when the ascension
  target is `R5`.
- Grammar machinery: `src/scripts/narrative/parse.ts` +
  `validate.ts`; drift teeth: the `gen-narrative` verify gate
  (byte-compare of all `*.gen.ts` + `t0-story.md`).
- Current doc headers confirm the holes: `## R1/R3/R4/R6/R7` at
  `docs/content/t0-story.md:141,196,249,326,369` — no R2, no R5.

## Steps

1. **Emitter interleave** — `story-doc.ts`: a scene-def whose
   trigger parses as `rung RN` renders inside the ladder at its rung
   (under the rung heading, its trigger as small print) and leaves
   the generalized section.
2. **The `reading: RN` meta key** — optional, scene-def only,
   reading-script placement ONLY (zero runtime meaning; the
   registries must not change behavior). `validate.ts` rejects an
   unknown rank id or the key on a non-scene-def block. Author it
   onto `count` + `count-resolve` (`reading: R5`). Chosen over
   hard-coding the placement in the emitter, which would hand-copy
   `intents.ts:385` into a second home (single-source rule); the
   grammar's `native:`-not-growth caution is honored — this is a doc
   annotation, not runtime grammar.
3. **Regenerate + commit** — `pnpm run gen:narrative`;
   `t0-story.md` now reads R1→R7 complete, the generalized section
   keeping only genuinely ladder-external defs (season-exit, flag,
   scripted-without-reading). Confirm the runtime `*.gen.ts` output
   is byte-identical apart from any inert meta passthrough — if the
   new key leaks into `scenes.gen.ts`, strip it at emit.
4. **The spine test** — `src/scripts/narrative/story-doc.test.ts`
   (COMMIT lane, ~ms): `emitStoryDoc` output contains one
   `## R<n> ·` heading per rung R1–R7 in ascending order, derived
   from `RANKS` (the source of truth, never a copied count), and no
   rung-placed def remains in the generalized section.

## Teeth

- The existing **`gen-narrative` gate** already REDs doc drift
  (byte-compare) — unchanged, it now guards the interleaved form.
- The **spine test** adds the continuity invariant at the highest
  sound rung (a vitest in the COMMIT lane; adds milliseconds against
  the ADR-176 8s budget).
- **Proof of RED:** run the spine test against the pre-fix emitter
  first — it fails on the missing R2/R5 (that run is the RED proof;
  record it in the commit body/journal).

## Verification

- The spine test above (RED-proven, then green).
- Eyeball the regenerated `t0-story.md` header list (R1–R7, in
  order; `count`/`count-resolve` under R5, `r2-yard-hand` under R2).
- `pnpm run verify` green (the gen-narrative gate proves
  no-hand-edit + registry byte-stability).
- Player-reach: n/a — the player never sees this doc; it is review
  machinery. The "reach" that matters is the human's read path,
  `docs/content/t0-story.md` itself.

## Sync ripple

- **PRD:** none — review tooling; no shipped system changes.
- **Story-bible:** none — zero canon text changes; the authoring
  sources gain only inert `reading:` meta lines.
- **Living docs / registries:**
  `src/core/content/narrative/README.md` grammar section documents
  `reading:`; the `project/BACKLOG.md` entry comes OUT in the commit
  that lands this (the plan is its pull-forward home).
- **CHANGELOG:** none — no version bump.

## Human-in-the-loop

None blocking — no HR/HD filed; no taste surface. The plan itself
sits in the reading queue (this commit). The payoff lands under
HR-38's feet: the sweep review reads a continuous spine.

## Non-goals

- No interleaving of season-exit / flag-triggered defs — they are
  genuinely ladder-external and stay in the generalized section.
- No reordering of the asks / requirements sections.
- No runtime behavior change of any kind.

## Risks

- **Seam — the live one:** the talk-system build (session 210, in
  flight NOW) holds uncommitted changes in this exact machinery
  (`story-doc.ts` grew the FB-415 ask section; the gen-narrative
  gate). **Land only after session 210's work is committed and
  green**; the rebase is trivial but must be done eyes-open.
- `reading: R5` restates what `intents.ts:385` does and could drift
  if the accusation night ever moves rungs — accepted: it lives
  beside the content in the reviewed authoring source, and a
  mismatch is a content-review catch, not a silent runtime bug.
- Owns: `src/scripts/narrative/{story-doc,parse,validate}.ts` + the
  new test + `scenes.md` meta lines + regenerated
  `docs/content/t0-story.md` + the BACKLOG line removal.

## Rollback

Revert the emitter/test commit; the `reading:` meta keys are inert
without it (validate tolerates them only while the feature exists —
revert both together, they land as one commit anyway).
