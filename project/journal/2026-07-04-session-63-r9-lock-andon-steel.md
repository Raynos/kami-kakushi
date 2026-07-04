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

---

## Continued — UI-v2 plan drafting + ui-demos deploy (same session)

After the R9 lock the human asked to (a) redeploy all 10 ui-demos and (b)
start an **interactive** plan to port Andon Steel into the real game.

- **Deployed `ui-demos/` to Vercel prod** (human-approved outward action) —
  `npx vercel --prod --cwd ui-demos`, aliased to
  <https://kami-kakushi-ui-demos.vercel.app>; all 10 (+ index R9 banner) return
  200. Auth was already present (`raynos`).
- **Two grounding analyses** (parallel Explore agents): the Andon Steel
  design-language + do-NOT-copy catalog, and the current-UI delta + the
  design-language locks that reopen. Both distilled into the plan (not snapshotted
  raw — they were Explore agents, not Workflows).
- **Drafted `docs/plans/opus-2026-07-04-ui-v2-andon-steel-migration.md`**
  (Status: PROPOSED) — risk-tiered (theme/layout/flow × low/med/high) milestones
  M1 steel palette → M6 doc ripple; premise = full replacement (human), keep our
  reconcile/render engine, copy zero demo bugs. Queued in `todo-human.md`.
- **Human decision folded in:** the **commit-seal cursor is CUT** ("no red flash
  on click") — removes the highest-risk item. Recorded in the plan (struck, with
  the why).

**All plan decisions locked (human, live this session):** full replacement · adopt
the Andon composition · cursor CUT · re-theme ALL open variants then choose
(R2/R5/R6/R7) · **Western fonts** (retire the Japanese brush type) · **straight on
main** (no flag/branch) · v0.3.6.

**Plan is now BUILD-READY** (human asked for enough detail that a Sonnet-class model
could build it). Two more Explore extractions folded in: the exact washi→steel
**token map** + **material CSS recipes** + font swap, and the exact `render.ts`
**shell seams** (Approach A: re-parent log/nav, grid on `.shell` — safe because
reconcilers key on element identity) + the `dev.ts` **variant-add recipe** + which
tests move. Rewrote the plan into **7 build cards** (M1 palette → M2 materials → M3
composition → M4 GBA cold-open → M5 VN/ceremony → M6 variant surfaces → M7 doc
ripple), each with file:line anchors, keep-intact contracts, and acceptance criteria
(incl. a11y + tests + mobile), plus 4 reference appendices. **No build started** —
awaiting the human's LOCK.

**Landmine — shared tree is BUSY:** the F1b agent (session-64) is editing the
index + `project-status.md` (gate roster now 15) concurrently. Commit ONLY own
files by explicit path (`git commit -o -- <paths>`); a blanket `git add`
swept their staged F1b files into my index once (caught by the checkpoint gate).
