# Session 92 — 2026-07-06 — D-139: narrative diverge designed & locked

**Summary:** grilled the human on "diverge, but for story/narrative" (six
AskUserQuestion rounds, ~23 questions) and promoted the result to canon: ADR
**D-139** (every story element ships from 3+ takes), an always-loaded
AGENTS.md bullet, the new **`narrative-diverge`** skill, and a build plan for
the two in-game review surfaces. The sibling fable audit/redesign TODOs were
explicitly left untouched (fresh-context work the human kicks off).

## What changed

- `project/brainstorms/2026-07-06-narrative-diverge-design.md` — the full
  Q&A capture (Q1–Q23) + synthesis; the session's source of truth.
- `docs/living/decisions.md` — **D-139** appended: scope (fiction-voiced
  text, own unit size), distinctness bar (dramatic choices, not
  paraphrases), blind one-agent-per-take authoring, scorecard+canon-fit
  self-pick, bundled human review, DEV-only alternates pruned at sign-off.
- `AGENTS.md` — always-loaded "Story diverges too (D-139)" bullet beside the
  D-075 UI-diverge bullet (a buried skill doesn't fire).
- `.claude/skills/narrative-diverge/SKILL.md` — new sibling skill: entry
  gate, 9-step procedure, anti-patterns.
- `docs/plans/fable-2026-07-06-narrative-dev-surfaces.md` — PROPOSED plan
  for the story-variant set-switcher + read-only full-page script-reader
  modal (D-138 `__DEV_TOOLS__` gating; sign-off stays conversational).
- `project/todo-human.md` — plan added to the reading queue.

## Next intended steps

1. Human reads the DEV-surfaces plan → lock routing → build kicks off.
2. Human kicks off the fable audit + fable redesign TODOs in fresh sessions;
   the redesign is the first big D-139 application (retro coverage of T0).
3. Until the DEV surfaces exist, any narrative-diverge bundle is reviewed
   from its R-item/review doc (skill §2.7 interim note).

## Entry 2 — DEV-surfaces build: Phase 1+2 (take-set compiler)

Plan locked live with the human (routing = Fable end-to-end this session ·
lighter D-075 split: switcher single-idea, modal full-diverge · build now,
before the redesign). Built the compiler half:

- `src/scripts/narrative/takes.ts` — `parseBundleMeta` (bundle.md grammar:
  `# bundle`, top meta, `## take` sections w/ brief/scorecard/file) +
  `emitStoryTakes` (reuses the canon per-scene emitters, exported from
  emit.ts).
- `src/scripts/gen-narrative.ts` — scans `narrative/takes/*/`, always emits
  `src/ui/storyTakes.gen.ts` (stable empty registry when no bundle open),
  byte-compared by the existing gate. (These two tracked-file edits were
  swept into the co-agent's ADR-140 rename commit c3aed3e — content correct,
  attribution note here.)
- `src/ui/storyTakes.ts` — hand-written types (`StoryTakeBundle`/`StoryTake`)
  + gen re-export; imported ONLY from the dev fold.
- `src/core/content/narrative/takes/` — README (format + the
  state-compatibility rule: takes substitute what the player READS, never
  option ids/flags/memory) + `demo-r1/` DEMO bundle (2 alternate registers of
  the R1 beat, clearly-labeled tooling fixture; prune when a real bundle
  lands).
- `src/scripts/narrative/takes.test.ts` — 7 RED-able tests (parser errors
  cite authoring file:line; emitter output through the canon emitters;
  empty-registry stability).

## Entry 3 — DEV-surfaces build: Phase 3 (Story set-switcher, live)

- `src/ui/dev.ts` — DevApi grows the ADR-139 story API: `storyBundles`,
  `get/setStoryTake` (URL-persisted `?story-<bundle>=<take>`),
  `get/setStoryUnit` (per-unit override beats the set), `subRungScene` /
  `subIntroScene` (identity when canon), `storyEpoch()`. New **Story** tab
  (5th pane, count-badged) — per-bundle block: Canon/take set buttons +
  active brief, per-unit rows only for multi-unit bundles, display-only
  hint. `createDevApi(bundles = STORY_TAKE_BUNDLES)` injectable for tests.
- `src/ui/render.ts` — `activeVn` substitutes via the dev gate
  (`__DEV_TOOLS__ && dev`); the VN scene key folds in `storyEpoch()` so a
  take swap rebuilds the append-only transcript (found live: without it the
  transcript never re-drew — the smoke caught it, the unit tests didn't).
- `src/ui/dev.test.ts` — +5 RED-able tests (injected bundles; identity /
  set-substitution / override-beats-set / unknown-id rejection / panel
  mount+badge).
- **Proven live, headless** (`tmp/story-swap-smoke.mjs`, R6): fixture
  `rung-beat-ready` → beat live → canon→B→C→canon round-trip, each swap
  visible in the running VN. Screenshot `tmp/story-swap-smoke.png`.

## Landmines

- Do NOT pre-wire or brief the audit/redesign sessions from this one — the
  human explicitly wants them unpoisoned (Q10).
- The TODO line "Implement & design a diverge for story & narrative" is
  half-done (design canon; surfaces unbuilt) — left in place; the human
  section is human-authored, so removal is their call / prepare-to-exit's.
- R8 stays open as-is (Q21) — don't fold it into the redesign.
