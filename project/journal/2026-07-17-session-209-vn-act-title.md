# Session 209 — 2026-07-17 — VN modal act title (which VN am I in?)

**Summary:** The full-screen VN modal only named the *speaker*
(nameplate seal + name); the human couldn't tell WHICH scene they were
in. Added the scene's 幕-head act title to the nameplate — the SAME
`context` label the scene's lines group under in the Story log, so the
modal and the log read identically (TST1 · one label, one
source-of-meaning; TST4 · never guess state).

## What changed
- `src/ui/render.ts` — `introNameplate()` takes an optional `title`;
  when present it appends a right-aligned `.vn-act` label (幕
  curtain-mark + gold small-caps), reusing the Story log's `.scene-head`
  idiom.
- `src/ui/render/vn.ts` — `VnScene` gains `title?`; `activeVn` fills it
  per source, mirroring the core's log `context`:
  - intro → `introSceneTitle(sub)` (authored `title:` / take overlay)
  - rung → `${rank.title} promotion` (from `RANKS`)
  - scene → `activeScene.id.replace(/-/g, ' ')`
- `src/ui/styles/verbs-vn.css` — `.vn-act` / `.vn-act-mark` /
  `.vn-act-label` (margin-left:auto, gold, uppercase,
  ellipsis-truncated).
- `src/ui/render/vn.test.ts` — asserts the nameplate carries
  `introSceneTitle(SOAN)` in `.vn-act-label` (RED-able: fails without
  the wiring). All 345 ui tests green.

## Verification
- typecheck clean; `vitest src/ui/` = 345 passed.
- Live self-vet on a throwaway `:5266` server (shared `:5264` was down —
  not spawned/killed): the cold-open modal shows `幕 WHAT THE WATER
  TAKES` top-right, cleanly clear of the `夢 A memory` plate.

## Next intended steps
1. Human taste call: is the label placement/weight right? (small tweak,
   not a diverge — one idiom reused, ADR-075 one-line-tweak exemption.)

## Landmines
- The scene-source title logic is DUPLICATED from the core's log
  `context` (intents.ts / scenes.ts) rather than shared — kept to 3
  lines with a pointer comment; if the log's context derivation changes,
  update both.
