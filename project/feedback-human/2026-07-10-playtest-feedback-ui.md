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

### FB-216 · The protagonist's speech colour — ✅ (landed by the vn-speech lane)
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
**Fixed in:** `85d8b43` — the **vn-speech lane** landed it as **FB-234**, collapsing
the protagonist to one token and setting `--v-player: #8ec9ff` (asagi sky-blue,
~10:1 on steel). Exactly the chroma-not-lightness diagnosis above. This FB-216
entry stays as the analysis record; the capture's sidecar is stamped `fb: 234`.
**Distilled rule → `ui-design.md` §2 (graduated):** separate a voice by CHROMA,
not lightness — and trust neither HSL saturation nor ΔE. The old `#e3ecff` read
"100% saturated" yet carried CIELAB C* 10.2, *below* the narrator's 17.9, beating
it on lightness alone; and its ΔE₇₆ was the *larger* of the two. The axis of
separation is what the eye reads, not the distance.

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

### Distilled rule → `docs/guides/qa-playtesting.md` §9 (graduated)
**A DEV tool that OBSERVES the game must not perturb it.** Freeze the shell before
you photograph it (pinning any live CSS transition — `transition: none` snaps it to
its target); never rasterise on the interaction the human is waiting on (run the
~600 ms `domToPng` at submit, where a beat is expected, and hop
`requestAnimationFrame` → `setTimeout(0)` to let a hidden node paint first, since
rAF fires *before* paint); and never yank the ground from under a live session
(TST2) — the dev server serves an inert `/@vite/client`, and `index.html` *links*
the stylesheet, because a JS-imported one is served as a JS module that imports
that client back in.

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

### FB-258 · Remove "Save .md" from the capture error dialog — ✅
**Verbatim:** _"In the error modal remove 'save .md' i dont want that behavior lol"_
**Reading:** it was the last door back to the failure mode `a343554` set out to
kill — a note stranded in `~/Downloads`, where it reads as "captured" while the
inbox stays empty.
**Fixed in:** `capture.ts` — the button, `downloadFallback()` and the dialog's
`filename` plumbing are gone. The dialog is now **Retry · Copy note · Discard**;
Copy is the one escape hatch, and it can only land wherever the human pastes it.
The clipboard-unavailable message now points at `pnpm run dev` + Retry rather
than at a button that no longer exists.
**Verified:** a RED-able test asserts the dialog's buttons are exactly
`['Retry', 'Copy note', 'Discard']`, that it contains no "Save", and that nothing
downloads on Discard.

### FB-259 · The bucket dropdown was an unstyleable OS widget — ✅
**Verbatim:** _"Ugh that picked is so ugly, can you change it to something better?"_
(screenshot: the native `<datalist>` popup — a white slab in system font, over the
ink-dark overlay)
**Reading:** `<input list=…>` renders its popup as an **OS widget**. It takes no
CSS at all: not the ground, not the type, not the border. There is no styling fix.
**Fixed in:** `capture.ts` — a real combobox. A text input (so minting a bucket
stays one keystroke away — FB-217 made it mandatory) over our own `role=listbox`,
in the overlay's palette (`#26221E` ground, `#7A6C59` border, Mincho serif).
Filters recents as you type; an unknown name gets a gold **＋ new bucket "…"** row
first, because minting is the common case. ↑/↓ + Enter pick without sending
(⌘/Ctrl+Enter still sends); **Escape closes the menu, and only a second Escape
closes the note**; pointerdown elsewhere dismisses it.
Two bugs found while building it, both now covered: the menu is body-mounted
(the note box is `overflow:hidden` for `resize:both`, and would clip it), so it
needed **its own** `data-kami-capture-menu` marker — sharing `data-kami-capture`
made `querySelector` find the menu instead of the box — and it needs a z-index
**above** the box, or the later-appended box paints straight over it.
**Verified:** 9 RED-able tests (no datalist; no shadowing; focus-suggests;
type-filters; mint-row present / absent when exact; arrows+Enter pick without
sending; pointerdown picks; Escape closes menu-then-box; teardown leaves no
orphan listbox on `<body>`), plus a screenshot of the real thing.

### FB-337 · Capture shot takes ~10 s with the map open — ✅
**Verbatim:** _"Bug for feedback, if the map is open then the whole dom 2 png
thing takes too long. / We need a new strategy because the elements in the SVG
are just too mcuh."_
**Reading:** exactly right, and measured: `domToPng` clones every DOM node and
inlines its computed styles one by one. The map sheet is one SVG of **15,583
elements**, so the shot goes 956 nodes / 722 ms (map closed) → 16,553 nodes /
**10.4 s** (map open) — a ten-second main-thread stall at submit.
**Fixed in:** `capture-screenshot.ts` — the new strategy the note asks for:
don't let the walker see the big SVG at all. Any `<svg>` over 500 descendants
is pre-rasterised by the **browser's own renderer** (~160 ms for the map):
serialize it, embed the page's same-origin CSS into the clone, resolve the
`var(--…)` tokens against the live cascade, draw it through an `Image` →
canvas at its on-screen rect × DPR, swap the flat `<img>` in, and **filter the
original out of the walk** — hiding alone is not enough, the cloner walks
`display:none` subtrees too (measured: 16 s, *worse*). Restores the DOM after;
any failure falls back to the slow walked path (a screenshot is a best-effort
viewing aid, never allowed to break the capture).
Two things an SVG-as-image loses, both restored explicitly: it is a separate
document, so **page stylesheets** don't reach it (the pills' kanji + captions
are `.t0v2-kanji { fill: var(--ink) }`-class-styled — without the embedded CSS
they rasterised default-black on the near-black ground; the human caught the
text loss live after my first eyeball check passed a shrunken full-page shot —
a false green, PH3) and **custom properties** don't reach it (the var() pass;
fonts are fine, `--font-head/body` are system stacks).
**Verified in a real browser** (the captured save, 1496×752 @dpr2): map-open
shot **10.4 s → 863 ms**, map-closed path unchanged, and the raw map raster
dumped at full size and checked against the live SVG — every pill kanji
(堰・竈・庭・薪・門・田・廃), caption, edge note and the title cartouche
present. No unit test by design: this module is the injected DOM half of the
capture split (jsdom has no canvas/Image); the headless timing run above is
the repro record.
**Distilled rule:** a DOM-walking rasteriser and a huge retained-mode SVG don't
mix — flatten the SVG through the native renderer first and shoot the flat
pixels. (Joins the FB-218/219 family in qa-playtesting.md §9: observe without
perturbing, and keep the shot off the interaction path.)

### FB-260 · "Test" — ✅ not a defect
**Verbatim:** _"Test"_ (picked element: `panel "do"` — the "What you can do" heading)
**Reading:** a **smoke test** of the rebuilt capture UI, taken on build `b9abe14`
right after FB-217 (mandatory bucket) and before the tab reloaded. It round-tripped
correctly: the bucket was enforced, and the note, save, sidecar and screenshot all
landed in `feedback-ui/`. No code change; the capture *is* the verification.
**Fixed in:** `e5d3a01` (the capture-UI work it exercised). Stamped `done` so the
bucket can archive — say the word and I will pull it back out.
