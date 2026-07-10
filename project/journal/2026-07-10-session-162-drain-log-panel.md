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

- **I · FB-344 — zone arrival prefix.** `move_to`'s ephemeral arrival line now
  carries the node's `label` as its speaker → the Now view reads
  "Kura: <the description>" via the existing styled speaker prefix (the
  human's pick: speaker-style, not a literal "Zone …:"). people.test asserts
  the speaker from the node registry; fixtures regenerated.

- **A · FB-315/FB-331 — VN-read is READ.** Scene-context lines arriving while a
  VN is live pre-mark themselves seen per matching filter; verified live — no
  Chat dot post-VN, no one-by-one replay (was: dot + 4-line typewriter replay).
  Context-less mid-VN arrivals keep their FB-222 dots.
- **B · FB-330 — VN-end lands dead still.** The VN-forced story filter now goes
  through a real `setLogFilter` repaint (no stale mixed DOM); the transcript
  backlog appends with no reveal anim; the reveal render jumps the log to the
  foot before the first visible frame (shell was display:none — every scroll
  write had been a no-op). Verified live: footGap 0, zero .reveal on reveal.
  Rides with the C renderer hunk (no duplicate lintel on a same-scene reopen).

- **G · FB-325/FB-326 — the Now lamp.** Confirmed hole: a coalesced repeat
  (same key, ×N bump) never re-stamped, so a player grinding one verb never
  saw the lamp re-light after its first 10s window. `stampEphemeral` now
  re-stamps on a count bump (lamp re-lights + that line's fade restarts);
  `.tab-now.live` gains a warm gold background wash (the bare text tint read
  as "no change"). Verified: re-lights on rake #2, lapses clean when idle.

- **E · FB-321/FB-322 — styled typewriter.** `typeLine` now builds the line
  FULLY STYLED up front (buildLogLine → renderLineContent) and reveals its text
  progressively ACROSS the styled text nodes — quotes wear their `.speech`
  tint/italics from the first character (was: bare text node, styling snapped
  on at finalize). Verified live via a forced narrator-quote line: `.speech`
  present at 7 chars in, quote fills styled, tail continues. NOTE: the hunk
  landed inside w6:p1's `fd934341` (their surgical stage picked up my
  in-flight worktree hunk) — content correct, attribution noted here + to them.

- **F · FB-323 — the 新 divider re-anchors when pinned.** Two holes closed: a
  reader pinned at the foot (= read everything) now gets the divider MOVED to
  just above each incoming block (scrolled-up keeps FB-199's anchored
  boundary), and a coalesced ×N bump counts as new text — the marker slides in
  front of the bumped line. Verified live: burst→divider above it, second
  burst→re-anchored, coalesce→marked.

- **H · FB-320 — the Story vn/all sub-toggle.** Story expands when selected: a
  mini vn/all segmented pair beside the tab. `vn` keeps only the scene
  (context-carrying) lines — the MAIN story; `all` is today's full channel
  (default). Pure `storySubMatches` in log-filter.ts (unit-tested); every
  current-view visibility check routes through one `lineVisible` helper.
  Verified live: 33→24 lines under vn (all scene-lines), hides on Chat,
  remembered on return.

## Close-out

All 14 captures fixed (9 fix groups, 7 commits + 1 hunk carried by w6:p1's
`fd934341`). F-entries appended to
`project/feedback-human/2026-07-10-playtest-log-panel.md` (second-pass
section, FB-315..FB-344). All 14 sidecars stamped done+fb+commit; `the-log`
bucket merge-archived onto its earlier archive (`archive/the-log.md`, second
drain pass marker); the 2 r1 sidecars stamped in place — the r1 bucket stays
pending (11 other captures open, unclaimed at the time). `log-panel` claim
released.

Remaining pending at close: r1 (11) · feedback-ui · new-game-screen (other
lanes were being drained live by co-agents through this pass).

Shared-tree note: heavy live co-editing with w6:p1 all session — surgical
index staging both ways; one of my hunks (the FB-321 typeLine rewrite) rode
their fd934341 (staging race, content intended + verified; cross-noted).
