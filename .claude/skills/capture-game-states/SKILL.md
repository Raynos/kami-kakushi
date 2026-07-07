---
name: capture-game-states
description: Drive an HTML5 game headlessly from a browser and capture its visual states as lossless screenshots or short recordings, for QA and before/after comparisons. Use when asked to screenshot/record the game, audit its look, capture a specific screen/state, or compare visual variants.
---

# Capture game states (screenshots + recordings)

Capture any of the game's visual states 1:1 from a headless browser, for QA and visual audits. Two
modes: **static screenshot** (freeze a frame and shoot) and **short recording** (record → frames →
contact sheet → pick the lossless candidate).

## Prerequisite — the DEV-only play API (`window.__qa`)

The game exposes a **DEV-only play API on `window.__qa`** (`import.meta.env.DEV`, stripped from prod)
that wraps the same actions the UI sends to the core, plus read access and loop control. The
**authoritative method list is [`docs/guides/qa-playtesting.md`](../../../docs/guides/qa-playtesting.md)
§1** — the verbs you'll use here:

- **Read:** `state()` — the current snapshot; `reveals()`, `pacing()`.
- **Drive:** the game's verbs (`dispatch(intent)` + wrappers like `activity`, `fight`, `faceWolf`),
  `tick(dt)` (advance the sim one step), `newGame`/`save`/`load`.
- **Loop control:** `pause()`, `resume()`, `frames(n)` (re-render N frames *without* advancing the sim).
- **Force rare states:** `forceState(patch)`, `jumpToPhase2()`, `jumpToAscension()`, `toRung`/`toTier` —
  jump straight to a late unlock or a screen a short natural run won't reach.

> `frames(1)` (render one frame) and `tick(dt)` (advance one sim step) are the capture primitives: pause,
> settle/advance one deterministic frame, and shoot — used by both the screenshot and recording paths.
> *(There is no `__qa.step()`; use `frames(1)`/`tick`.)*

## Setup — HEADLESS ONLY

Run the dev server (`pnpm run dev`), then drive the game **headlessly** — never a
headed browser window ([qa-playtesting.md](../../../docs/guides/qa-playtesting.md)
§0; the `.claude/hooks/enforce-headless-qa.sh` PreToolUse hook **blocks** the
Playwright MCP / Chrome DevTools MCP browser tools, so don't reach for them):

- **`node src/scripts/qa-shots.mjs`** — the tracked headless screenshot gallery
  (outputs land in `project/audit/screens/latest/`); `playtest.mjs` is its
  play-driver sibling.
- **An ad-hoc headless page** for states the gallery doesn't cover: a short node
  script under `tmp/` (playwright chromium, `headless: true`) that navigates to
  the dev URL, `evaluate`s `window.__qa.…` verbs, and screenshots to a file.
  Semi-transparent DOM overlays (menus, modals) render fine under modern
  headless chromium — screenshot the *page*, not the canvas alone, so overlays
  are included.

## Recipe A — static state screenshot

1. Navigate to the dev URL; assert the play API exists (`window.__qa`).
2. Drive to the target state (play naturally where you can; force the rare ones).
3. `__qa.pause(); __qa.frames(1)` to settle exactly one frame.
4. Take a screenshot to a file under an `audit/` folder.
5. Stray overlay left on screen? Hide the offending `position:fixed` element, `frames(1)`, reshoot.

## Recipe B — short recording → frames → contact sheet

Record the canvas via `MediaRecorder` over `canvas.captureStream(fps)` while the loop runs in real
time, pull the blob out of the browser **to a file** (use the MCP `filename` param so the binary is
diverted to disk, not flooded into context), then on disk:

```sh
ffmpeg -v error -i clip.webm -vf scale=256:-1 frame_%03d.jpg     # split into frames
montage frame_*.jpg -tile 11x -geometry +2+2 contact.jpg          # ONE scannable contact sheet
# scan contact.jpg (a single Read), pick frame N, pull it lossless:
ffmpeg -v error -i clip.webm -vf select=eq(n\,N) -vframes 1 candidate.png
```

The contact sheet lets you judge ~100 frames in one image instead of one Read per frame. For
judging fine visual quality, pull the final candidate as a **lossless PNG** (webm codec adds
artifacts — fine for motion, not for detail scoring).

## When to force vs. play-and-sample

Default to **playing naturally** and sampling — it's faithful for transitions/animation. **Force**
only the rare/terminal states a short run won't reach (a late unlock, a low-prob outcome, a win/lose
screen). Capture terminal states **last** (they may end the session), or reload to continue.

## Build the checklist

Enumerate the game's distinct states (menus, each core-loop screen, each unlock panel, transitions,
win/lose) once — that list becomes the repeatable audit checklist.
