# Session 154 — 2026-07-10 — cold-open sign-offs (HR-22/HR-23) + story SV-tags

**Summary:** The human locked in both R0 cold-open narrative diverges and asked
for referenceable IDs on story takes (they had none, unlike the UI variants'
`V5`-style tags). HR-22 memory act → Take A (already canon; alternates pruned).
HR-23 Genemon's scene → Take A, an **override** of the take-C self-pick (take A's
prose swapped into canon). DEV Story pane now tags every take `SV{n}{LETTER}`.

## What changed
- `src/ui/dev.ts` — story-take referenceable IDs. New `stag` map assigns each
  bundle `SV{registryIndex}` (mirrors the Variants pane's registry-pinned
  V-tags); the Story pane bundle title, take buttons (`SV{n}A`, `SV{n}·Canon`),
  and the explore-page title now carry the tag. Registry order pins a tag to its
  bundle so it never shifts on rung-reorder; it shifts only when an *earlier*
  bundle is pruned.
- `src/core/content/narrative/intro.md` — scene `genemon` asks + decide reworded
  to Take A ("the intake entry"). Ask/decide **ids and stat/perk/memory effects
  unchanged** (state-compatible); only prose changed.
- `src/core/content/narrative/dialogue.md` — `gen-greet` (the @-reused greeting)
  swapped to Take A's opener ("On your feet the fourth day…").
- Deleted `takes/hd37-cold-open-a/` + `takes/hd37-cold-open-b/` (both signed off
  → pruned per the takes/README rule; git history keeps the losing takes).
- Regenerated `intro.gen.ts`, `dialogue.gen.ts`, `storyTakes.gen.ts` (11 open
  bundles, was 13), `docs/content/t0-story.md`, and all `src/fixtures/saves/*`
  (narrative text is embedded in the deterministic saves).
- `project/human-in-the-loop/review.md` — removed HR-22 + HR-23 (open → closed).
- `project/human-in-the-loop/archive.md` — added the two sign-off rows.

## Next intended steps
1. Nothing owed on these two. Remaining open story HR-items: HR-18..HR-21, HR-24
   (+ the R1..R7 surface reviews). Drain the 1 pending playtest capture when the
   human's ready.

## Landmines
- HR-ids are reused across the archive (annotated inline on collision) — the new
  HR-22 row is tagged "(cold open — id reused; MEMORY-ACT row)" to disambiguate
  from the existing HR-22 colour row.
- Genemon Take A re-introduces the "being counted" register that Take C was
  self-picked to *avoid* across acts (dream act is also inventory/counting). The
  human made that override deliberately — noted, not a defect.
