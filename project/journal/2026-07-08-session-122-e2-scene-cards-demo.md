# Session 122 — 2026-07-08 — E2 scene-card demo (Sōan & Genemon)

**Summary:** The human pulled the E2 VN scene-card exploration forward as a
single lightweight demo (same move as the s121 E3 stamp book: one version,
no diverge, ahead of the E2.1 grammar spec) — two woodblock vignette cards
for the existing cold open's VN characters, Sōan and Genemon. Built
`src/ui/scene-cards/` behind DEV → Story → "⤢ Scene cards"; zero game
integration (the prototype-first law).

## What changed

- `src/ui/scene-cards/cards.ts` — NEW: `openSceneCards()`, the DEV modal +
  both card painters. Sōan card: the sickroom waking — slat-light in the
  physician's voice tint falling onto the straw bed, Sōan kneeling as a
  featureless silhouette, the MC drawn as a **figure-scale void** (the
  spirited-away man as the absence the light falls around). Genemon card:
  the grain-store — the kura door off its hinge, a toppled tawara bale
  spilling stipple-rice in the steward's ochre, the rake set to the work,
  Genemon standing over the loss. Both: vermillion caption cartouche
  (医 / 家令), one focal mass on a horizon band, seeded-deterministic,
  Andon tokens only, brush primitives reused from `map-sheets/brush.ts`,
  quotes verbatim from `cold-open.md` / `intro.md` / `dialogue.md` (the
  story bible has moved on — the demo illustrates the card idea, not
  current canon).
- `src/ui/scene-cards/README.md` — NEW: status, the embodied composition
  grammar (E2.1 will spec it properly), the gated later steps.
- `src/ui/dev.ts` — one Story-pane entry ("⤢ Scene cards — E2 VN pilot
  demo"), directly under the E3 stamp-book button.
- `docs/plans/fable-2026-07-08-graphics-explorations.md` — E2 status note
  (demo pulled forward, s122; E2.1+ still gate everything beyond it).
- `docs/living/graphics-concepts.md` — #12 row: demo-built note.

## Verification

- Headless screenshot loop (repo law: headless-only QA) via a throwaway
  `tmp/scn-shot.mjs` driving the real DEV panel; two visual iterations
  (rounder head blobs, curved robe-fold strokes instead of regular hatch,
  light shafts re-aimed to land on the bed, rake un-tangled from the bale).
  `pnpm run typecheck` green; full `verify` at commit.

## Next intended steps

1. The human looks at the demo (DEV → Story → "⤢ Scene cards") and rules:
   kill / keep exploring (the E2 kill criterion stays a valid SUCCESS).
2. If kept: the plan's real track — E2.1 composition-grammar spec
   (docs-only) → HR read → the one-moment E2.3 diverge.

## Landmines

- The 5173 dev server serves SPA-fallback HTML for `/src/*` module URLs —
  you can NOT `import()` a source module straight off the dev server for a
  QA shot; drive the real DEV-panel UI instead (see `tmp/scn-shot.mjs`
  pattern, git-ignored).
- Storywave Plan B owns `src/**`; this demo touched the shared `dev.ts`
  only for its one menu entry, per the plan's seam rule.
