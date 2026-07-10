# Session 163 — 2026-07-10 — inbox drain: new-game-screen + feedback-ui

**Summary:** Drained the new-game-screen + feedback-ui lanes (3 captures,
ADR-171 claim w6:p2, no collisions). One real bug (FB-314, the cold-open card
resizing under the typewriter) fixed and headless-verified; FB-356/357 were
capture-overlay smoke tests, closed as not-defects.

## What changed
- `src/ui/render.ts` — FB-314: `applyColdOpenReveal` pins each typed line's full
  height (`min-height`) before the typewriter empties + refills it, so the
  cold-open card holds a fixed size through the reveal (TST2).
- `project/feedback-human/2026-07-10-playtest-new-game-screen.md` — FB-314 entry (new).
- `project/feedback-human/2026-07-10-playtest-feedback-ui.md` — FB-356/357 entries.

## Log
- Claimed new-game-screen + feedback-ui (w6:p2); regroup scan showed no
  cross-bucket clusters; announce clean (log-panel live under w2:p5, no overlap).
  Pending already auto-committed → intake commit a no-op.
- Triaged: FB-356 ("test a screenshto"), FB-357 ("test a map screenshot") = test
  captures. FB-314 = real layout bug on the `.coldopen .frame` title card.
- Root-caused FB-314 by code trace: the staged GBA typewriter clears each line to
  '' then re-types char-by-char, so the lines collapse + grow and the card resizes
  / the CTA slides down through the reveal.
- Fix + headless verify (tmp/fb314-check.mjs, 1496×752 @dpr2, 75 samples across
  the reveal): lede typed 1→132 chars, `.coldopen .frame` height held 304px, Δ 0px
  — including every actively-typing sample. Human approved the proposal wholesale.
- Stamped all 3 sidecars done; archived both buckets.
