# Session 102 — 2026-07-07 — remove game sound for now

**Summary:** Human call — the synth SFX cues read too comedic, so pull sound out
for now (reversibly). Silenced at the wiring layer, not by ripping the engine:
`buildSettings` now mutes the ONE shared `sfx` instance at mount and the
user-facing "Sound" toggle is dropped, so every caller no-ops — including
`main.ts`'s per-deed `sfx.hit()`, since they all share that instance.

## What changed
- `src/ui/render.ts` — replaced the Sound on/off toggle-button block with a
  one-time `hooks.sfx.setMuted(true)` in `buildSettings` (runs once at mount,
  before any dispatch), and removed `sound` from the comfort-row `append`.

## Why this shape
- **Shared-tree safety.** `src/app/main.ts` (which creates the sfx instance and
  fires the taiko `hit()`) had another agent's uncommitted `compositeStrokes`
  capture WIP — off-limits to stage. Muting the shared instance from `render.ts`
  silences `main.ts`'s caller too, so no contested file is touched.
- **Reversible ("for now").** The engine (`src/ui/sfx.ts`) and its tests are left
  fully intact; this is a wiring-level silence. Restoring is un-dropping the
  toggle button — no engine work.

## Verification
- `tsc --noEmit` clean; `render` / `sfx` / `dev` / `affordance-coverage` suites
  green (145 tests). No test asserted the Sound toggle's existence.

## Next intended steps
- None — self-contained. If the human wants sound gone permanently later, rip the
  engine + cue calls + `createSfx` wiring in one pass (needs `main.ts`).
