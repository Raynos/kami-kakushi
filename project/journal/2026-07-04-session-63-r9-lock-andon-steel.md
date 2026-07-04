# Session 63 — 2026-07-04 — R9 locked: 10 Andon Steel is UI-v2

**Summary:** The human closed **R9** — *"we choose andon 10, lock that in"* — so
**demo 10 Andon Steel** is the locked direction for the game's next UI generation.
Recorded as **ADR D-127**; R9 graduated to the human-in-the-loop archive; the
fusion plan archived; 07–09 (and the whole 01–10 field) anchored in `ui-demos/`
as the exploration record (not deleted). No code touched — this is a direction
lock, not the port.

## What changed
- `docs/living/decisions.md` — **new ADR D-127** (R9 → 10 Andon Steel as UI-v2's
  direction; anchors 01–09; **🔁 amends D-126** — resolves its "visual identity
  provisional pending R9" clause: Andon Steel supersedes woodblock/washi *as the
  target*; ⏳ the `src/` port is a future, not-yet-scoped build; surfaces the open
  R2/R5/R6/R7-still-wanted? question).
- `project/human-in-the-loop/review.md` — **removed the R9 block** (open-items-only).
- `project/human-in-the-loop/archive.md` — added the **R9 closed row** (→ D-127) +
  refreshed the open-reviews footer (R1/R2/R5/R6/R7/R8).
- `docs/plans/opus-2026-07-03-ui-demos-07-09-moonlit-lacquer.md` → **archived** to
  `project/archive/` (git mv); Status line flipped to ✅ DONE, last DoD box checked.
- `ui-demos/index.html` — locked-winner banner + ★-tagged the 10 Andon Steel row +
  fixed the archived-plan footer pointer.
- `project/status/project-status.md` — snapshot: R9 → LOCKED (10 Andon Steel);
  "waiting on human" now tracks the interim-polish question, not the pick.

## Next intended steps
1. **Human's call:** are R2/R5/R6/R7 (today's washi-UI variant picks) still wanted
   as interim polish now that UI-v2 supersedes them? (Surfaced in D-127 + snapshot.)
2. When the human wants it: **scope a UI-v2 build plan** — port demo 10's language
   (`ui-demos/10-andon-steel/`) into the real game (`src/ui`), which owns the
   rewrite of `ui-design.md` + `taste.md`'s visual-identity sections.
3. Otherwise autonomous work stays on the fable-process wave (F1b Ph2–4 → F2…F10).

## Landmines
- **D-127 does NOT touch the shipping game.** The current washi build still ships;
  Andon Steel is a `ui-demos/` mock until a port plan lands. Don't confuse the lock
  with a live restyle.
- **Anchor, don't delete.** 01–09 stay in `ui-demos/` on purpose (archive-don't-
  remove; it's a mock staging ground, no PROD flag-debt). The real strip happens
  when UI-v2 is ported into `src/`.
- **R2/R5/R6/R7 left OPEN deliberately** — closing them is the human's call, not
  mine (they may still want interim polish on the washi UI).
