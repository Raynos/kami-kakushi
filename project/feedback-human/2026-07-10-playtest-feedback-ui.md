# Playtest feedback — 2026-07-10 (async inbox capture)

Source: the in-game capture inbox (`project/playtest-inbox/`), **feedback-ui**
bucket — drained via `/drain-inbox`. Three drain lanes ran concurrently on this
shared tree; the human assigned F-number blocks per bucket, and **feedback-ui
owns FB-215…FB-224** (cold-open FB-197…214, r0 FB-225…249, dev FB-250…254).
Status legend: 🔲 open · 🔧 in progress · ✅ fixed · 🅿️ parked · 💬 needs-discussion.

## Feedback UI (bucket `feedback-ui`, sessions of 2026-07-10 11:34–12:21)

### FB-215 · Pause the whole game engine while the feedback window is open — ✅
**Verbatim:** _"Is it possible to somehow globally pause the whole game / game
engine when the feedback window is open so the game does not continue playing,
text does not continue rendering, the VN does not continue scrolling etc. Then I
can really clearly target what we are talking about."_
**Reading:** aiming at a moving target. Nothing was frozen: `paused` gated only
the auto-mode loop; the ActionClock's in-flight timers, the log + VN typewriters,
the reveal cascades, the fresh-divider fade and every CSS keyframe kept running
under the note box.
**Fixed in:** `src/app/freeze-clock.ts` (new) — everything the shell animates or
advances with is a `window.setTimeout`/`setInterval` (17 sites in `render.ts`
alone, plus the ActionClock and the auto-step heartbeat), so rather than retrofit
a `frozen` check into each — a check that could never stay exhaustive — the
freeze wraps the ONE thing they all pass through. `freeze()` cancels every
pending timer and banks its *remaining* time; `thaw()` re-arms each with exactly
that remainder, so a 2 s auto-advance with 1.4 s left still has 1.4 s left, and
an interval resumes on its own phase. Timers armed *while* frozen bank at full
delay, so the per-char typewriter (which schedules its own next step) simply
stops mid-word and resumes mid-word. CSS motion isn't a timer, so
`<html class="frozen">` pauses `animation-play-state` on everything; running
transitions are left alone on purpose (all sub-400 ms — cutting them would snap
the element to its end value, a visible jump at the moment of freeze).
The freeze starts on the `` ` `` **keypress**, not at box-open, so the screen is
already still while hover-picking. Every exit thaws (Esc from pick, Esc from the
box, submit, unmount). DEV-only; `raw` hands the overlay back the unpatched
timers so its own toast and click-swallow guard keep ticking.
**Verified:** 10 RED-able unit tests (`freeze-clock.test.ts`, mutation-checked —
dropping `disarm()` fails 5 of them), plus a live browser probe: `.frozen` on
pick, a game timer scheduled during the freeze does not fire, thaw after send.

### FB-216 · The protagonist's speech colour — 💬 re-routed
**Verbatim:** _"The text color of my spoken text in the ask/chat mode is
different color from in the intro text, we need a unique and specific color for
the main cahracter, and it needs to be very obvouis, I think I like the blue idea
but the contrast is too low with blue of the background. / The white is too close
to the gray/white of the narrator."_
**Reading:** two defects. (1) The protagonist speaks in **three** colours
depending on surface — `--v-player #e3ecff` (chat/VN), `--rokusho #99a2bf`
(`.speech.player`, the intro), `--ai #cdd6ee` (untagged quotes) — a plain
one-source-per-value violation. (2) The value itself: `--v-player` is hue **222°**
and `--v-narrator #9aa4c4` is hue **224°** — the *same hue*, so it reads as
"narrator, but whiter". Contrast is not the problem (14.8:1 vs 7.1:1 on
`--washi`); **chroma** is.
**Status:** the human chose (AskUserQuestion, this session) to collapse the
protagonist to one token and wire 3 swatches live behind the DEV Story switcher
for a taste call (ADR-075). **Not landed here:** `src/ui/render.ts` and
`styles.css:1520` (`.vn-speech`) are a shared fix surface across all three drain
buckets, and the speaker-colour cluster is being re-grouped into a single lane
(cross-agent notice, human go-ahead). The capture stays in `pending/` for that
lane; the analysis above is the handoff.
**Doc-update plan:** whichever lane lands it files the HR-item + the swatch
toggle; `ui-design.md` absorbs "a voice is distinguished by chroma, not lightness".

### FB-217 · The bucket must be mandatory — ✅
**Verbatim:** _"The feedback UI I want the bucket to be mandatory, so it dont
want to be able to submit without a bucket and I guess I'll just keep creating
named buckets."_
**Reading:** an unbucketed note lands in a per-session file that
`/drain-inbox <bucket>` can never scope a pass to, so it just sits there.
**Fixed in:** `capture.ts` — `submit()` refuses a blank/whitespace bucket, rings
the field vermilion, swaps the footer hint for "Name a bucket before sending —
it routes the drain", and focuses it. The world stays **frozen** through the
refusal (the human is still writing the capture). Typing a name clears the nag.
`capture-format` still knows how to write a session file — the archive is full of
them — the UI just never asks it to.
**Verified:** 4 RED-able tests (refusal, whitespace-only, nag-clears-and-sends,
refusal-does-not-thaw).

### FB-218 · The feedback UI has a bad perf problem — ✅
**Verbatim:** _"Feedback UI has some kind of really bad perf issue in it, it's
not smooth at all. when you click some elements or hit esc."_
**Reading:** same root cause as FB-219 — see below. Measured on the captured
state (R1, 912 nodes, 1496×752 @dpr2): `snapshotDom(document.body)` is **one
unbroken 581–644 ms main-thread block**, kicked off inside `openBox()`. Esc (and
anything else) queued behind it.
**Fixed in:** the FB-219 commit (one root cause, one fix).

### FB-219 · The delay between the pick-click and the box opening — ✅
**Verbatim:** _"Yeah the delay between clicking the select element and the text
box section opening is too long, there's something borked here."_
**Reading:** `openBox()` created the note box and then, in the same task, kicked
`domToPng`. The box was in the DOM but **unpainted for ~670 ms**.
**Profile** (real browser, the captured save): `domToCanvas` ≈ 635 ms (DOM clone
+ inline styles + `foreignObject` layout), PNG encode ≈ 23 ms. So `scale`, the
encode format and `requestIdleCallback` are all dead ends — measured `scale: 1`
at 643 ms and WebP at 628 ms — and an `OffscreenCanvas`/Worker is impossible: the
clone and layout are main-thread by construction.
**Fixed in:** the rasteriser moves to **submit**, which FB-215's freeze makes
pixel-identical to pick (nothing can move in between). At pick we now do zero
raster work. At submit the box hides, we wait for a real paint
(`requestAnimationFrame` → *raw* `setTimeout(0)`; rAF alone fires **before**
paint and would still block the frame), *then* rasterise the still-frozen screen
with the highlight lit and the overlay's own nodes filtered out.
**Verified in a real browser:** box-visible latency **674 ms → 17 ms**; submit
takes ~723 ms and posts a 580 KB PNG showing the ringed element and no note box.
Plus 4 RED-able tests (no raster at pick; box hidden + highlight lit + not yet
thawed when the shot runs; paint-before-shot ordering; works with no freeze).

### Distilled rule → `docs/guides/qa-playtesting.md`
A DEV tool that observes the game must not perturb it. Freeze the shell before
you photograph it, and never rasterise on the interaction the human is waiting on.

### FB-256 · The action button's progress bar kept animating while frozen — ✅
**Verbatim:** _"Well the progress bar on the action button didnt freeze"_ /
_"You never got that animation to freeze during feedback, the one on the button."_
**Reading:** FB-215's freeze banks `setTimeout`/`setInterval` and pauses CSS
**animations** (`.frozen { animation-play-state: paused }`). `.act-bar` is neither:
`paintActBar` sets an inline **transition** (`width ${remainingMs}ms linear`), and a
transition has no play-state to pause. `transition: none` is not a fix either — it
snaps the element to its target, slamming a half-full bar to 100%.
Two defects, actually. The visual one above, and a silent one: `ActionClock.status()`
derives its fraction from `Date.now()`, so even with the bar pinned it would **jump
forward on thaw** by however long the human spent writing the note.
**Fixed in:**
- `freeze-clock.ts` — on freeze, for every element carrying an inline `transition`,
  read each transitioning property's **current computed value**, write it inline,
  and only then cut the transition. Thaw restores the original inline values.
- `action-clock.ts` — `setFrozen(on)` stops the wall clock the module reads
  (`frozenAt` holds the reading, `frozenTotal` accrues the debt). Freezing is
  **silent**; thawing **notifies**, so the renderer repaints each bar from its true
  remaining time — which is what restarts the transition correctly.
- `main.ts` — composes the two in order: freeze ⇒ ActionClock first (silently), then
  bank timers + pin; thaw ⇒ un-pin + re-arm, then let the ActionClock notify.
Deliberately **no `render.ts` change** — another lane held it, and routing the repaint
through the ActionClock's existing `onChange` subscription proved cleaner anyway.
**Verified in a real browser** (the human's captured R1 save, a live timed action):
bar width `27.75px` at freeze → `27.75px` after 1200 ms frozen (delta **0**), resuming
with a single 0.8 px frame on thaw. RED-proof: with the pin disabled the same probe
shows the bar sliding **85.8 px** during the freeze. Plus 5 RED-able unit tests
(pin-before-cut ordering, no-inline-transition untouched, `status()` held, thaw
notifies / freeze does not, freeze with nothing in flight); both mutation-checked.

### FB-257 · The dev server must never full-reload the live game — ✅
**Verbatim:** _"My fucking game just refreshed lol wtf. why would it do that."_ /
_"no turn off the fucking FULL RELOAD the game in vite server. I NEVER WANT FULL
RELOAD THE GAME"_ / _"vite server restarts shouldnt F5 my current browser game
session"_ / _"Why do we even do non standard imports in javascript of css files"_
**Reading:** three lanes edit `src/` against one dev server the human plays on.
`vite.config.ts` statically imports `src/scripts/playtest-inbox.ts` +
`telemetry-drop.ts`, making them **config dependencies** — vite re-execs the
config whenever one changes, the `@vite/client` websocket drops, and on reconnect
the client calls `location.reload()`. The human's run died mid-play.
**Why the previous fix (a343554) didn't hold:** it set `server.hmr = false` and
concluded, from an A/B, that this closed the restart path. It does not. Measured
today: the HMR websocket **still accepts a 101 upgrade** under `hmr: false`, and a
restart still reloads an open page (`navigations 1 → 2`, page marker lost). Worse,
`dev-server-config.test.ts` asserted `hmr === false` *as a proxy for* "cannot
reload" — a **false green** that stayed green through the live regression (PH3).
**Two real causes, both closed:**
1. Vite 5 injects `<script src="/@vite/client">` into index.html regardless of
   `hmr`. Stripping that tag is **not enough**: vite's dev CSS transform turns a
   JS-imported stylesheet into a JS module that imports the client itself
   (`createHotContext` → `import.meta.hot`, `updateStyle`/`removeStyle`). The
   client loaded through `ui/styles.css` and opened the socket anyway.
2. So we now serve our **own** `/@vite/client` (`INERT_VITE_CLIENT`,
   `vite.config.ts`): the three symbols the CSS shim imports, no websocket, no
   `location.reload()`. It must still `import '/@vite/env'` — in dev vite does
   **not** statically replace `define` values; `env.mjs` assigns `__DEV_TOOLS__`
   / `__VERSION__` onto `globalThis` at runtime. Dropping that import makes
   `boot()` throw `__DEV_TOOLS__ is not defined` (found the hard way).
**And the magic went away:** `import './styles.css'` was a bundler convention
buying nothing for one global sheet — it is now a plain
`<link rel="stylesheet">` in `index.html`. Standard HTML, still hashed + minified
by `vite build` (`dist/assets/index-<hash>.css`), served as real `text/css` in
dev, and it paints styled on the first frame. Nothing imports the client now.
**Verified:** isolated server on :5199, page open, hard restart →
`navsAfterRestart: 1`, in-page marker survived, zero websockets. Game boots
(`__qa` present), tokens resolve, `pnpm run build` emits the hashed stylesheet,
`verify-dev-strip.sh` green. 6 RED-able tests replace the false green;
mutation-checked (restore `location.reload` → red; drop the env import → red).
**Fixed in:** (this commit).
