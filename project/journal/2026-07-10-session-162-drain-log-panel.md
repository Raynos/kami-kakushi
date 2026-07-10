# 2026-07-10 · session 162 — drain: the [log-panel] cluster lane (FB-315..FB-344)

**Lane:** `log-panel` (ADR-171 cluster — 12 `the-log` + 2 `r1` captures re-laned
per the collision announce + the human's steer). Claimed `w2:p5`.

**Scope:** 14 captures over the log panel, wholesale-proposed and approved in
one pass (all 14, re-anchor-when-pinned divider policy, speaker-style zone
prefix). Nine fix groups A–I; one commit per group; F-entries in
`project/feedback-human/2026-07-10-playtest-log-panel.md`.

## Landed

- **C · FB-316/FB-317 — scene-card integrity.** Reproduced with the capture's
  save: the 幕 card fractured into bordered fragments (raw background gaps),
  lintels on arbitrary fragments. Core: `choose_intro`'s react + both ask-hubs'
  answer lines now carry their scene context; CSS: an in-card speaker break is
  padding, not a margin gap; renderer: no duplicate lintel when a run reopens.
  New dialogue-tree test asserts total context coverage (RED on any gap).
  Fixtures regenerated (stored log entries now carry context). The render.ts
  lintel-dedup hunks ride the next render commit (w6:p1's surgical index was
  in flight — shared-tree discipline).

- **D · FB-318/FB-319 — readout reveals post-intro.** `readout-body` /
  `readout-rice` now unlock on `awake && !introActive`, so revealPass lands
  their Story lines on the intro-completing reduce — right after the cold-open
  VN, never mid-scene. engine/m1 tests updated to the new timing (+ a new
  post-intro reveal test); fixtures regenerated.

## Next intended steps

- A · FB-315/FB-331 — VN-read lines pre-marked seen (no chat replay) —
  CODE DONE + verified live; commit waits on w6:p1's CLEAR (shared render.ts)
- B · FB-330 — VN-end instant re-pin
- E · FB-321/FB-322 — typewriter styled reveal
- F · FB-323 — divider re-anchor when pinned
- G · FB-325/FB-326 — Now lamp coalesce re-stamp + bg wash
- H · FB-320 — Story vn/all sub-toggle
- I · FB-344 — zone arrival speaker prefix
- Wrap: sidecars, archive `the-log`, release claim
