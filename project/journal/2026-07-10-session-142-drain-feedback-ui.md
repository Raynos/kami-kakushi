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

---

## FB-257 — the dev server was reloading the human's live game (2026-07-10, later)

Mid-drain the human's game F5'd itself. Not my writes: three lanes edit `src/`
against one dev server, and `vite.config.ts` statically imports
`src/scripts/playtest-inbox.ts` — a **config dependency**. Vite re-execs the config
when one changes, `@vite/client`'s socket drops, and the client calls
`location.reload()`.

The prior fix (`a343554`) set `server.hmr = false` and its test asserted exactly
that, reasoning that no HMR ⇒ no reload. **Both were wrong.** Under `hmr: false`
the HMR websocket still accepts a 101 upgrade, and I reproduced the reload on an
isolated server (`navigations 1 → 2`). The test was a **false green** — a config
value standing in for a behaviour — and it never went red while the bug ran
loose. Textbook PH3.

Two layers to the real fix:

1. **Stripping the injected `<script src="/@vite/client">` from index.html is not
   enough.** Vite's dev CSS transform serves a JS-imported stylesheet as a *JS
   module* that imports the client for `createHotContext`/`updateStyle`/
   `removeStyle`. The client came in through `ui/styles.css`.
2. **Serve our own `/@vite/client`** (`INERT_VITE_CLIENT`): those three symbols,
   no websocket, no `location.reload()`. It must still `import '/@vite/env'` —
   dev does NOT statically replace `define`; `env.mjs` installs `__DEV_TOOLS__`
   etc. onto `globalThis` at runtime. Omitting it made `boot()` throw
   `__DEV_TOOLS__ is not defined`, which cost me a confused A/B before I saw that
   the *committed* config also left the token unreplaced in the served text.

Also removed the magic the human objected to: `import './styles.css'` is a
bundler convention that earns its keep with many component sheets. We have one
global sheet, so it bought nothing — and it cost us this bug. It is now
`<link rel="stylesheet" href="./ui/styles.css">`. `vite build` still hashes and
minifies it; dev serves real `text/css`; first paint is styled.

**Verified:** isolated :5199 server, page open, hard restart → 0 navigations,
in-page marker survived, no websockets. Game boots, `pnpm run build` emits
`dist/assets/index-<hash>.css`, `verify-dev-strip.sh` green.

## What changed (FB-257)
- `vite.config.ts` — `INERT_VITE_CLIENT` + `VITE_CLIENT_PATH` exports; a
  `configureServer` middleware serving them ahead of vite's transform middleware.
  `KAMI_VITE_CLIENT=1` restores the real client.
- `src/index.html` — links the stylesheet.
- `src/ui/index.ts` — no longer imports it.
- `src/scripts/dev-server-config.test.ts` — the false green replaced by 6 RED-able
  tests (no reload/navigation in the stub, no socket, the `/@vite/env` import, the
  CSS-shim exports, the link-not-import rule, the polling watcher).

## Note for other lanes
A dev-server restart no longer reloads an open page, but it still *drops in-flight
requests*. And `vite.config.ts`'s static imports of `src/scripts/*` remain the
reason restarts happen at all — worth making lazy if it ever bites again.

---

## FB-256 — the progress bar kept sliding under the frozen screen

The human caught what FB-215 missed twice. `.frozen` pauses keyframe **animations**;
`.act-bar` is an inline **transition** (`width ${remainingMs}ms linear`) and has no
play-state. `transition: none` would snap it to 100%. So `freeze-clock` now *pins*:
read each transitioning property's live computed value, write it inline, then cut the
transition; thaw restores the original inline values.

There was a second, invisible half: `ActionClock.status()` reads `Date.now()`, so the
bar would have jumped forward on thaw by the length of the note-writing pause. Added
`setFrozen(on)` — silent on freeze (a repaint there would re-arm the transition we are
about to pin), notifying on thaw (that repaint restarts the transition with its true
remainder). `main.ts` orders the pair.

No `render.ts` edit: another lane held it, and routing the thaw repaint through the
ActionClock's existing `onChange` subscription is the better seam regardless.

**Verified in a browser** on the captured R1 save: bar 27.75px → 27.75px across a
1200ms freeze (delta 0). With the pin disabled the same probe measures an 85.8px
slide — so the check can go red.

## F-number churn
Three lanes, two numbering schemes. The relay block (feedback-ui = FB-215..224) was
superseded by the ADR-171 claim tool, whose high-water had already granted FB-220..233
elsewhere — committed and pushed, so immovable. Renumbered my two in-session findings
to **FB-256** (progress bar) and **FB-257** (dev-server reload, was FB-220);
`inbox-claim list` now reports high-water FB-257, next block FB-258. Lesson: take the
number from the tool, not from a grep of the F-logs.
