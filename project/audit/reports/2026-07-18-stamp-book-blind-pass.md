# Blind pass — the compact seal-strip (ADR-201 / HR-46)

Session 214, two fresh-eyes blind readers over the headless captures
(`project/audit/screens/2026-07-18-stamp-book-diverge/`, git-ignored
local), graded against the rubric in `src/ui/stamp-book/README.md`.
Reader 1: variant A (R4 · R7 · mobile · popover). Reader 2: B (R4 ·
R7 · mobile) + C (R4).

## Rubric verdicts

| Q | A · concertina | B · rail | C · pages |
|---|---|---|---|
| 1 how far along | ✅ 5/8 + 8/8 + direction read | ✅ instant | ⚠️ header only (2 slots shown) |
| 2 what's next | ✅ "The accused", 0 of 4 | ✅ | ✅ |
| 3 hardest stretch | ✅ found the knot, right stretch | — (no thread by approach) | ❌ thread read as a GLITCH |
| 4 lean stretch | ❌ "thread looks uniform" — thin ink didn't read | — | — |
| 5 artifact vs widget | ✅ "mostly a carried artifact" | ✅ mostly | ⚠️ weakest — carousel-cells |

## Findings checklist (ADR-188 — ticked as fixed)

- [x] **A/next-slot count contrast** — "0 of 4" used `--ink-faint`,
  whose own token contract says DECORATIVE only, never load-bearing
  text. → `--ink-soft` (concertina + pages). FIXED this session.
- [x] **A/lean ink invisible** — the dry-thin stroke reads uniform at
  compact scale. → lean stroke thinner (0.9) + opacity 0.55 so the
  die-back is visible. FIXED this session (subtlety re-judged at the
  next capture; if it still doesn't read, the popover/caption carries
  it — noted in HR-46).
- [x] **A/scroll affordance** — the edge-clipped panel read as a
  defect ("The day-har…"), not as "more book this way"; mobile
  especially. → thin scrollbar + edge-fade overlays on `.sbc-scroll`.
  FIXED this session.
- [ ] **A/popover requirement list** — the next-seal popover names the
  count but not the four requirements. DEFERRED: the requirement
  flavor lines are authored content; wiring them into the popover is
  a small follow-up, noted in HR-46 for the pick conversation.
- [ ] **C/thread-as-glitch** — the cross-spread stroke reads as a
  rendering artifact, not wear. DEV-only alternate; logged for the
  human's pick context (a C pick would need the thread re-drawn
  page-local, entering/leaving at page edges). NOT fixed.
- [ ] **C/paging affordance** — ‹ › sit together in the corner;
  readers ~70% sure it pages. DEV-only; logged, NOT fixed.
- [ ] **B/mobile hierarchy** — rtl grid-wrap exiles the next-goal
  cell to bottom-right on 390px. Inherent to the approach; logged,
  NOT fixed.
- [ ] **A+B/counter & captions read as chrome** — deliberate (TST4
  glance + P19 two registers); no change, recorded as the readers'
  honest tension between fiction and legibility.

## Both readers, unprompted

The 朱印帳 framing, hand-pressed rotated seals, and right→left fill
sold the artifact; the widget-breaks named were the header counter
(kept — TST4) and C's card frames. Nobody could name a rung the data
hides (ruling 5 held: future slots leaked nothing).
