# Playtest feedback — 2026-07-10 (async inbox capture)

Source: the in-game capture inbox (`project/playtest-inbox/`),
**new-game-screen** bucket — drained via `/drain-inbox` (ADR-171 parallel lane;
captures FB-stamped at capture time). Status legend: 🔲 open · 🔧 in progress ·
✅ fixed · 🅿️ parked · 💬 needs-discussion.

## New game screen (bucket `new-game-screen`)

### FB-314 · The cold-open title card grows as its text types in — ✅
**Verbatim:** _"I fucking saw the height of this box change over time based on
the interior content, this box needs to be fixed height, not dynamic based on
the text inside."_
**Reading:** the `.coldopen .frame` title card (神隠し / Kamikakushi / the lede /
"Open your eyes") is a flex column whose height follows its content. The staged
GBA typewriter in `applyColdOpenReveal` (`render.ts`) does
`node.textContent = ''` then re-types each line character-by-character, so the
title, roman and the multi-line lede each **collapse to zero height when
cleared and grow back as characters fill in** — the whole card grows and the
CTA slides down through the reveal. A TST2 violation: a watched surface must
never resize under the reader.
**Fixed in:** `render.ts` — at reveal start the full authored text is already
present on all three lines (the "restore a cancelled slice" step), so right
there we measure and pin each line's full height as an inline `min-height`
before the typewriter empties and refills it. A typed prefix never wraps to
more lines than the full text, so the pinned height is a safe ceiling; the card
holds a fixed size for the whole reveal. No-op under jsdom (0 height) and the
reduced-motion / QA everything-at-once path.
**Verified in a real headless browser** (the captured 1496×752 @dpr2, fresh
pre-awake cold-open, 75 samples across the ~4.5 s staged reveal): the lede typed
from 1 → 132 chars while `.coldopen .frame` height held **304 px, Δ 0 px** —
including every sample where the lede was actively typing. RED-able by
construction: before the pin the same measurement showed the card growing as
the lede wrapped to more lines.
