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

## Entry 4 — DEV-surfaces build: Phase 4 (script-reader modal, full diverge)

- `src/ui/dev.ts` — `openStoryReader(bundles, initial?)`: full-page
  read-only modal cloning `.modal-scrim`/`.modal-card frame`/`.modal-close`;
  three genuinely-distinct reading variants behind header pills (the FULL
  ADR-075 diverge of this surface): **annotated** (play-order script,
  alternates nested), **galley** (canon+takes side-by-side per unit),
  **stage** (one take end-to-end, local pills, canon-fallback chips).
  Script lines instant-paint with `log-line voice-*` speaker colours (P12:
  review instrument, not story scope). Entry: Story pane → "⤢ Explore
  story". Esc / scrim / × dismiss.
- `src/ui/dev.test.ts` — +3 RED-able reader tests (canon text asserted via
  the LIVE registry, alternates render, stage take-switch, Esc dismiss).
- Taste flow: Pass-1 brief in the brainstorm's build appendix; Pass-2
  per-variant scorecards + self-pick (**annotated**) filed as **HR-9** with
  the switcher confirmation bundled in.
- Screenshots (desktop + 390px, all variants): `tmp/reader-*.png`.

## Entry 5 — Phase 5 proofs + plan close

- **Strip proof:** `SHIP_DEV_TOOLS=0` build → verify-dev-strip (strip mode)
  green; 0 hits for take strings (`Ledger-cold`/`storyTakes`/`Explore
  story`) in `dist/`. Ship-mode build → gate green; take strings ride the
  DEV fold as intended (T0 default-off, `?dev=yes`).
- **Prune proof:** parking `takes/demo-r1/` + regen → canon `.gen.ts` +
  `t0-story.md` byte-identical (shasum), `storyTakes.gen.ts` collapses to
  the stable empty registry; restore regenerates in sync.
- Plan **archived** → `project/archive/fable-2026-07-06-narrative-dev-surfaces.md`
  (Status ✅; the human remainder is HR-9).

## Entry 6 — HR-9 lean applied

Human leaned **B — Galley columns** in-session: the reader now opens on
galley; A/C stay live behind the pills until the verdict is firm (HR-9
remains open with the 390px h-scroll caveat flagged for the confirming
pass).

## Entry 7 — inbox drain: the human's live review of the reader (FB-122…125)

Four captures from the human's in-game HR-9 review sitting, drained
interactively (batch approved via AskUserQuestion):

- **FB-122** wider → the card is full-viewport (no rem cap).
- **FB-123** double border under scroll → the framed card no longer scrolls;
  title + pills pin, the content pane scrolls (frame key-lines intact).
- **FB-124** identical Tokubei lines read as a broken swap → demo takes now
  vary Tokubei per register; the galley reader DIMS lines byte-identical to
  canon ("shared with canon" ≠ "failed substitution").
- **FB-125** the HR-9 verdict went FIRM mid-drain: **Galley wins** — the
  human asked for annotated + stage to be removed. Retired (code deleted;
  recoverable from git history + the HR-9 record); HR-9 closed → archive.

## Entry 8 — drain landed; HR-9 CLOSED

FB-122/123 in 298b94f (+ oxfmt now ignores `project/playtest-inbox` — the
overlay's compact JSON sidecars were red-blocking every commit).
FB-124/125 in this commit: galley-only reader (variants retired), shared
lines dim, demo Tokubei varied per register, HR-9 → ✅ archive row, drained
session archived — `pending/` is empty.

## Landmines

- Do NOT pre-wire or brief the audit/redesign sessions from this one — the
  human explicitly wants them unpoisoned (Q10).
- The TODO line "Implement & design a diverge for story & narrative" is
  half-done (design canon; surfaces unbuilt) — left in place; the human
  section is human-authored, so removal is their call / prepare-to-exit's.
- R8 stays open as-is (Q21) — don't fold it into the redesign.
- The demo bundle `demo-r1` is single-unit, so the switcher's per-unit
  override ROWS have no live UI exercise yet (covered by unit tests only);
  the first multi-unit real bundle should eyeball them.
- The floating DEV panel overlays the reader modal's right edge (z-order)
  — noted in HR-9's scorecards as the shared ✘; collapse the panel while
  reading, or fix if the human flags it.
- Prune flow = delete `takes/<bundle>/` + `npm run gen:narrative` + commit
  both; proven canon-safe (Entry 5).
