---
name: capture-game-states
description: Drive an HTML5 game headlessly from a browser and capture its visual states as lossless screenshots or short recordings, for QA and before/after comparisons. Use when asked to screenshot/record the game, audit its look, capture a specific screen/state, or compare visual variants.
---

# Capture game states (screenshots + recordings)

Capture any of the game's visual states 1:1 from a headless browser, for QA and visual audits. Two
modes: **static screenshot** (freeze a frame and shoot) and **short recording** (record → frames →
contact sheet → pick the lossless candidate).

## Prerequisite — a DEV-only play API

This works best when the game exposes a **DEV-only play API on `window`** (e.g. `window.__qa`) that
wraps the same actions the UI sends to the core, plus read access to state and loop control. Design
target (see `docs/plans/playtesting.md` if/when it exists):

- **Read:** `state()` — the current snapshot.
- **Drive:** the game's verbs (the same intents the UI dispatches), advance/tick, new/load/save.
- **Loop control:** `pause()`, `resume()`, `step(ms)` (advance exactly one frame), `frames(n,ms)`.
- **Force rare states:** helpers to jump straight to a late unlock, a low-probability outcome, or a
  terminal screen that a short natural run won't reach.

> `step()` is the core capture primitive: it lets you **freeze, advance one deterministic frame, and
> shoot** — used by both the screenshot and recording paths.

## Setup

Run the dev server, then drive via **Playwright MCP** or **Chrome DevTools MCP**
(`navigate` / `evaluate` / `take_screenshot`). Prefer **headful** — headless can miss
semi-transparent DOM overlays (menus, modals), which are often half the UI.

## Recipe A — static state screenshot

1. Navigate to the dev URL; assert the play API exists (`window.__qa`).
2. Drive to the target state (play naturally where you can; force the rare ones).
3. `__qa.pause(); __qa.step()` to settle exactly one frame.
4. Take a screenshot to a file under an `audit/` folder.
5. Stray overlay left on screen? Hide the offending `position:fixed` element, `step()`, reshoot.

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
