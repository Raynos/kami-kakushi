# The three 390px shell defects — diagnosis, fixes, evidence

**Plan:**
[`docs/plans/fable-2026-07-18-phone-shell-defects.md`](../../../docs/plans/fable-2026-07-18-phone-shell-defects.md)
**Session:** 219 · 2026-07-18 · baseline `4d7aef3d`

**Repro** (the diagnosis scripts were throwaways under git-ignored
`tmp/`; this is the whole recipe): drive the shared dev server headless
at **390×844**, load `?fixture=rung-R6` (also checked on `rung-R7` and
`wealthy-idler` — all three reproduce), click the Estate 家 tab, then
`__qa.pause()`. Read geometry with `getBoundingClientRect()` /
`getComputedStyle()`, and hit-test controls with `elementFromPoint()` at
their own centre — that last one is what exposed the dead season wheel.

## Taste-scorecard Pass 1 — the constraint brief (ADR-135, before building)

Only the principles that bear on three shell-layout defect fixes; one
line each — what this work must DO to honour it.

- **P6 · Complete or absent** (the dominant one — all three defects are
  P6 violations verbatim: "no controls overlapping their own text, no
  clipped stacks"). Every fixed surface must be fully painted at 390px:
  no element may occlude another's text, and no glyph may be cut.
- **P5 · Frames are stable.** The log band's height must not change as
  entries arrive — a fix that makes the band grow/shrink per entry
  trades a clip for a jump, which is worse.
- **P20 · Viewport-fixed dashboard, log bounded.** The footer stays
  pinned and the log stays bounded — the fix adds honest rows to the
  phone grid, never a page scrollbar.
- **P19 · Two registers.** The footer/dock is CHROME: it may go tight
  and dense to fit 390px, but the log band is READING and keeps its air.
- **TST4 · Never guess state.** The life bar must READ its value: at
  1/100 the bar must look near-empty and (per ADR-076's `.bar.low`
  contract) alarm-coloured, matching its numeral.
- **TST2 · Don't yank the ground.** No fix may resize or rebuild a
  surface under the reader mid-tick; verified by capture, not assumed.

Not applicable: P9–P15 (no fiction touched), P1–P3 (nothing moves home),
P16–P18 (no routing/transcript change).

## Diagnosis — measured, not eyeballed

### Defect 1 · the log band slices its prose mid-glyph

**Not an overlap.** The geometric overlap test (log box vs every
`.pane`/`.card`/`.panel`) returned **empty** on all three fixtures — the
band does not sit ON the Standing panel. What the readers saw is the
collapsed band clipping its OWN content:

- `.log-lines` collapsed: `max-height: 2.5em` → `clientHeight` **36px**,
  `scrollHeight` **21303**, `scrollTop` **21267** (pinned to bottom).
- The newest entry is a **132.4px** wrapped block; the line box is
  **20.88px**.
- 36px ÷ 20.88px = **1.72 line boxes** — the window height is not a
  whole multiple of the line, so its **top edge always lands mid-line**,
  cutting glyphs horizontally.
- The FB-168 collapsed rule sets `-webkit-mask: none; mask: none`,
  **removing** the base `.log-lines` top-fade (`linear-gradient(to
  bottom, transparent 0, #000 0.9em)`) that exists precisely to soften
  that top edge. Without it the cut is hard — which is what reads as
  "sliced mid-glyph" and as "an empty border stub" (the band's 10px top
  padding above a half-glyph row).

**Root cause:** the collapsed band's height is not line-quantised AND
its softening mask was disabled.

### Defect 2 · the season pill occludes the footer

**A grid-cell collision.** At ≤920px both elements are placed in the
same cell:

- `.shell > .appbar-footer { grid-area: footer }` — y 789.7, h 54.3
- `.shell > .clock-dock { grid-area: footer; justify-self: center }` — y
  804.4, x 68.5, w 253.1

The dock (season tag + weekday + the `End the … 季` button, 121.5px) is
centred **on top of** the footer's own content. At 390px the footer's
`foot-left` (神隠し + KAMIKAKUSHI + version) is squeezed by the overlay
until the wordmark wraps `し` to its own line — exactly the reader's
report. `justify-content: space-between` cannot help: the dock is not a
flex child of the footer, it is a second grid item in the same area.

**Root cause:** two grid items sharing one area, with no row of the
dock's own.

### Defect 2b · the season wheel is DEAD at every viewport (found in passing)

While measuring the collision: `.shell > .clock-dock` carries
`pointer-events: none` (shell-layout.css — so the dock never eats a tap
on the nav rail it overlays at ≥921px). The **`End the … 季` button lives
inside that dock**, so it inherits `pointer-events: none`.

Hit-test at the button's own centre point:

| viewport | computed `pointer-events` | `elementFromPoint` hits |
|---|---|---|
| 1440×900 | `none` | `NAV` (the rail behind) |
| 390×844 | `none` | `.settings-btn` |

The click **never reaches the button** — on desktop *or* phone. The
manual season wheel (a core R2+ player verb, storywave G1/G4.9) has been
unreachable. This is a PH6 defect ("if a player can't reach it, it
doesn't exist"), strictly worse than the three cosmetic ones, and it
sits in the same CSS block as defect 2 — so it is fixed here rather than
re-queued.

### Defect 3 · the life bar reads full at 1/100

**The fill math is correct; the READ is wrong** — two causes:

- `healthFill.style.width` is **`1%`** → a **1.1px** sliver inside a
  110px track. Correct per `vitals.ts:162`, but invisible.
- `.bar` paints an outer ring `box-shadow: 0 0 0 1px
  var(--silver-faint)` around the full 110px track. At 6px tall, a
  silver-outlined 110px pill with no visible fill **reads as a full
  light bar**.
- **`.bar.low` never fires visually** — and the cause is **specificity,
  not source order**, so no reordering could have fixed it. Every
  per-meter fill colour is `.vital.<meter> .bar > span` **(0,3,1)**; the
  alarm is `.bar.low > span` **(0,2,1)**. The alarm loses outright.
  `header-nav-rung.css:30` added a *second* (0,3,1) health fill (flat
  `--rokusho`) on top, which also beat `shell-layout.css`'s gradient on
  source order — a duplicate, but not the reason the alarm was dead.
  Measured at 1 HP: `classList` contains `low`, but computed
  `background-color` is `rgb(153,162,191)` (`--rokusho`, silver-blue)
  and `background-image` is `none`. The ADR-076 promise — "turning
  vermilion when hurt so 'heal now' reads at a glance" — has never been
  kept.

**Root cause:** an invisible sub-pixel fill plus a dead alarm colour,
inside a track whose ring reads as fill.

## Fixes

**Defect 1 · the log band** (`shell-layout.css`, `render/log.ts`)

- The collapsed band is now a **fixed** `height: calc(2 * 1.45em)` — was
  `max-height`, which let the strip grow as the log filled. Fixed height
  means the band is identical at one entry and at a thousand (P5).
- The base top-fade mask is **kept**, and deepened to `1.45em` (a whole
  line box) for the collapsed state. The window's top edge lands
  mid-line by construction — no height avoids that — so the fix is to
  make that edge *read* as prose scrolling under the frame. The upper
  partial row now dissolves and the newest line reads crisp and alone,
  which is the single-line strip FB-168 asked for.
- **Also fixed (same band, plan step 3's "scroll bounds"):** folding the
  expanded sheet left the reader's scroll offset untouched, so the strip
  returned showing a line ~1300px adrift instead of the newest. The fold
  path now re-pins to the foot, as the expand path already did (P18).

**Defect 2 · the footer** (`shell-layout.css`, `footer-modals.css`)

- The phone grid gains a **`clock` row**: the dock is no longer a second
  item in the footer's cell, so nothing is painted over anything.
- The row still didn't fit — measured **~396px of content in ~368px** —
  so the **roman transliteration is dropped at ≤920px** (frees ~93px).
  It was a second rendering of the name standing beside 神隠し itself; the
  full name still lives in the About modal. Both remaining labels are
  pinned `nowrap` so a future squeeze can't silently re-wrap them.

**Defect 2b · the dead season wheel** (`shell-layout.css`)

- `.shell > .clock-dock .season-end { pointer-events: auto }` — re-arms
  exactly the button, leaving the dock itself passive so it still never
  eats a nav-tab tap.

**Defect 3 · the life bar** (`shell-layout.css`, `header-nav-rung.css`,
`render/vitals.ts`)

- **Visibility floor:** all three meters route through a new
  `fillWidth()`; a non-zero value paints at least 3%. A true zero still
  paints nothing, so "empty" and "nearly empty" stay distinct, and the
  numeral beside the bar remains the exact value.
- **The alarm now fires.** `.bar.low > span` was losing on
  **specificity**, not source order — every per-meter fill colour is
  (0,4) against the alarm's (0,3). The alarm rule now names each meter,
  so it outranks them. At 1 HP the fill measures `rgb(126,36,20) →
  rgb(222,90,58)`; it measured `rgb(153,162,191)` before.
- The duplicate flat `--rokusho` health fill in `header-nav-rung.css` is
  deleted — the fill belongs to one rule pair now (P2).

## Verification

**Captures** — written to
`project/audit/screens/2026-07-18-phone-shell-defects/`,
`<fixture>-before.png` / `-after.png` at 390×844 on all three fixtures.
That folder is **git-ignored** (as all `audit/screens/` are), so the
images are local-only; the measured tables below are the committed
evidence and are self-sufficient. Both halves of each pair come from the
same build — `before` re-creates the pre-fix cascade at runtime via CSS
overrides plus the honest 1% fill, so the only difference in a pair is
the fix itself.

**Measured, could-go-RED checks:**

| check | before | after |
|---|---|---|
| season wheel, desktop | `winter(0)` → `winter(0)` DEAD | `winter(0)` → `new-year(1)` ✅ |
| season wheel, phone | `winter(0)` → `winter(0)` DEAD | `winter(0)` → `new-year(1)` ✅ |
| life fill painted @1/100 | 1.1px | 3.23px |
| life fill colour @1/100 | `rgb(153,162,191)` | `rgb(126,36,20)→rgb(222,90,58)` |
| footer `foot-left` height | 46.1px (wrapped) | 23px (one line) |
| footer/dock overlap | dock inside footer cell | own row, 0 overlap |
| log band height, 1 vs 12 ticks | — | 63.9px → 63.9px (stable) |
| band offset after refold | 1309px adrift | 0px (pinned) |

**Tests** (both mutation-checked — each was made to fail by reverting
its fix, then restored):

- `render.test.ts` — "a surviving sliver of life still PAINTS". RED
  without the floor: `expected 2 to be greater than or equal to 3`.
  Derives `max` from the rendered numeral, never a magic number.
- `render/log.test.ts` — "the phone log band re-pins … when folded". RED
  without the fix: `expected 1200 to be 5000`. Stubs a real
  `scrollHeight`/`clientHeight` so it cannot pass on jsdom's 0 === 0.

**Player-reach (PH6):** all four sit on the always-shipped shell and
were driven live at 390px on `?fixture=rung-R6/R7/wealthy-idler`. The
season wheel's fix is itself a player-reach restoration.

## Taste-scorecard Pass 2 — verdicts against the Pass 1 brief

- **P6 · Complete or absent** ✅ — no element occludes another's text at
  390px; no label wraps; the band's cut edge now dissolves. The three
  reported defects were all P6, and all three measure clean.
- **P5 · Frames are stable** ✅ — the band is a fixed height by
  construction (`height`, not `max-height`); measured identical across
  12 ticks. [briefed]
- **P20 · Viewport-fixed, log bounded** ✅ — footer still pinned, log
  still bounded, no page scrollbar; the fix added a grid row rather than
  letting content spill.
- **P19 · Two registers** ✅ — the compression fell entirely on chrome
  (the footer's roman name); the log band kept its reading air.
- **TST4 · Never guess state** ✅ — the life bar now reads its numeral:
  near-empty and vermilion at 1/100.
- **TST2 · Don't yank the ground** ✅ — expand/fold verified intact and
  the refold now lands on the newest line rather than a stale offset.

**✘ / open:** none blocking. One thing deliberately **not** chased: the
`.bar` track's outer `silver-faint` ring still gives an empty groove a
faint bar-like outline. With a vermilion pip and an exact numeral the
read is now unambiguous, so changing a token that every meter shares was
not worth the blast radius — recorded here rather than fixed.
