# Session 155 — 2026-07-10 — FB-337: 10 s capture shot with the map open; inbox bulk commits

**Summary:** drained the `feedback-ui` lane (1 capture, FB-337). The capture
overlay's DOM→PNG shot took ~10.4 s with the map open — `domToPng` walks all
15,583 SVG elements, inlining computed styles per node. New strategy (the note
asked for one): pre-rasterise any heavy SVG through the browser's own renderer
(~160 ms), swap a flat `<img>` in, filter the original out of the walk. Map-open
shot: **10.4 s → ~860 ms**. Round 2 mid-land: the human caught the pill text
rasterising black-on-black (page CSS doesn't reach a standalone SVG document) —
fixed by embedding the page's same-origin CSS into the clone. Also (human
steer, this session): the inbox middleware's one-auto-commit-per-capture spam
is replaced by amend-batching — a burst of captures folds into ONE
`chore(inbox): playtest captures` commit.

## What changed
- `src/ui/capture-screenshot.ts` — `flattenHeavySvgs()` (FB-337): >500-descendant
  SVGs pre-rasterised (serialize + embed page CSS + resolve `var()` against the
  live cascade + Image→canvas at rect×DPR), swapped for a flat `<img>`, the
  original filtered out of the `domToPng` walk (hiding alone isn't enough — the
  cloner walks `display:none` subtrees; measured 16 s, worse). A HIDDEN heavy
  svg (the map pane persists in the DOM after its first visit) is marked +
  filtered with no raster at all — round 3, human-caught: shots from other
  tabs were still ~10 s. Restore after; every failure falls back to the slow
  walked path.
- `src/scripts/playtest-inbox.ts` — `commitCapture` amend-batches: HEAD an
  unpushed `chore(inbox): playtest captures` commit → `--amend` into it, else a
  fresh commit. One commit per burst instead of one per capture.
- `src/scripts/playtest-inbox.test.ts` — amend-branch tests.
- `AGENTS.md` + `project/playtest-inbox/README.md` +
  `docs/guides/qa-playtesting.md` — auto-commit wording updated to the batch
  behaviour.
- `project/feedback-human/2026-07-10-playtest-feedback-ui.md` — FB-337 entry (✅).
- feedback-ui sidecar stamped done; bucket archived.

## Verification
- Headless timing (`tmp/fb337-repro.mjs`, the captured save, 1496×752 @dpr2):
  map closed 703 ms / map open 863 ms (was 10,374 ms); raw map raster dumped at
  full size and checked — every pill kanji, caption, edge note, cartouche
  present. The human separately confirmed the speed live.
- The first fidelity check was a **false green** (shrunken full-page eyeball
  missed the lost text; the human caught it live) — the re-check reviews the
  raster at natural size, PH3.
- `commitCapture` amend logic: RED-able unit tests (amend when HEAD matches +
  unpushed; fresh commit on subject mismatch / pushed HEAD / no reader).

## Next intended steps
1. `pending/` still holds the r0, r1, the-log, new-game-screen lanes (~23 open
   captures) plus two cross-bucket clusters (`work-actions`, `log-panel`) —
   claim + drain next.
2. The review stack (HR-1, HR-24, HR-2A–2D, HR-5/6/9/11, HR-18–21) still awaits
   the human.

## Addendum (same session)

- The human live-tested the shot mid-land and filed 8 more feedback-ui
  captures (FB-347…FB-355): a speed test, the text-loss trio (FB-348–350,
  fixed by round 2's CSS embed), and smoke tests — all covered by the two
  FB-337 commits (`781344d`, `a0fe0af`).
- The inbox bulk-commit change (`commitCapture` amend-batching + docs) landed
  as its own commit after the FB-337 pair.

## Landmines
- The heavy-SVG raster embeds page CSS wholesale; a future rule that styles svg
  internals via a selector needing ancestors OUTSIDE the svg (e.g. `body.x svg
  text`) won't match in the standalone document. Symptom: that style silently
  missing from capture screenshots only.
- `commitCapture --amend` identifies its own commits by exact subject match and
  refuses when HEAD is on any remote branch; a co-agent commit landing in the
  sub-ms between probe and amend could still be folded in (accepted — fail-soft,
  reflog-recoverable, and the index lock serialises the common case).
