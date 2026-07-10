# Session 142 — 2026-07-10 — drain the `feedback-ui` bucket: freeze the shell, unblock the capture box

**Summary:** Drained 4 of the 5 `feedback-ui` captures (FB-215, FB-217, FB-218,
FB-219). The headline is a new **shell freeze** (`src/app/freeze-clock.ts`): `` ` ``
now holds the whole game still — auto-play, the ActionClock, every typewriter, all
CSS animation — until the capture is sent. That freeze is what let the ~600 ms
screenshot rasteriser move off the interaction: the note box now paints in **17 ms
instead of 674 ms**. FB-216 (the protagonist's speech colour) is analysed but
deliberately **not landed** — `render.ts` / `.vn-speech` are a shared surface being
re-grouped into one lane. No ADR needed.

## What changed
- `src/app/freeze-clock.ts` — **new.** A DEV-only freezable wrapper around
  `window.setTimeout`/`setInterval`. `freeze()` cancels every pending timer and banks
  its remaining time; `thaw()` re-arms with exactly that remainder (intervals resume
  on their own phase). Timers armed *while* frozen bank at full delay, so the
  self-scheduling per-char typewriter stops and resumes mid-word. `raw` exposes the
  unpatched natives for the overlay's own chrome. Installed first in `boot()`, before
  anything else can arm a timer.
- `src/app/freeze-clock.test.ts` — **new.** 10 tests on a virtual timer host.
  Mutation-checked: dropping `disarm()` from `freeze()` fails 5 of them.
- `src/app/main.ts` — install the freeze (DEV-only, folds to `undefined` in prod) and
  inject it into `mountCapture`.
- `src/ui/styles.css` — `.frozen *` pauses `animation-play-state`. Running transitions
  are deliberately untouched (all sub-400 ms; cutting them would snap to the end value).
- `src/ui/capture.ts` — freeze on `enterPick()` (not box-open, so hover-picking is
  already still); thaw on every exit. **No rasterisation at pick.** `submit()` hides the
  box, waits for a real paint (rAF → *raw* `setTimeout(0)` — rAF alone fires before
  paint), rasterises the still-frozen screen, composites the pen strokes, then thaws.
  Bucket is now **mandatory** (FB-217): a blank one rings the field, nags in the footer,
  and refuses the send without thawing.
- `src/ui/capture-screenshot.ts` — the shot filter now excludes every overlay-owned node
  (note box, error dialog, and the markup canvas, whose strokes the compositor re-draws —
  photographing them too would ink each annotation twice).
- `src/ui/capture.test.ts` — synchronous `afterPaint` injection; a `fakeFreeze()` harness;
  10 new tests across the freeze contract and the mandatory bucket. Both mutation-checked.
- `project/feedback-human/2026-07-10-playtest-feedback-ui.md` — **new.** FB-215…FB-219.

## Notes
- **Three drain lanes ran concurrently on this shared tree.** A co-agent had already
  committed FB-197 and claimed FB-198–200 before I allocated numbers; the human then
  assigned per-bucket blocks (feedback-ui = FB-215…224). I verified the claim against
  `git log` rather than taking it on trust, and renumbered. Worth remembering: **grep
  the committed tree, not just `project/feedback-human/*.md`, before taking an F-number.**
- The freeze deliberately does **not** touch `render.ts` — a co-agent held it uncommitted,
  and wrapping the window clock turned out to be the better design anyway (one home,
  exhaustive by construction, no 17-call-site retrofit).
- Profiling that drove FB-218/FB-219 (real browser, the captured save): `domToPng` is one
  unbroken 581–644 ms main-thread block; `domToCanvas` is ~635 ms of it and the PNG encode
  only ~23 ms. `scale: 1` (643 ms) and WebP (628 ms) change nothing — the cost is the DOM
  clone and `foreignObject` layout, which no Worker can take off the main thread.

## Next intended steps
1. Drain the `dev` bucket's single capture (FB-250: a DEV toggle for per-action hover
   detail — cost, rewards, timing).
2. FB-216 (protagonist speech colour) — hand to whichever lane owns the `.vn-speech`
   cluster; the analysis and the human's chosen route are in the feedback file.
3. `feedback-ui.md` stays in `pending/` until FB-216 lands (one entry undrained).
