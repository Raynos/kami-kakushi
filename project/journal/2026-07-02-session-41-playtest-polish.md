# Session 41 — 2026-07-02 — live playtest polish + intro/layout clusters

## ☀️ SUMMARY (read this first)

A live human-steered playtest of the v0.3.2 build. The human played and gave
rapid taste feedback (16 items, F1–F16), captured verbatim in
[`project/human-feedback/2026-07-02-playtest.md`](../human-feedback/2026-07-02-playtest.md)
— each with a distilled taste rule. **F1–F10, F14, and F16 shipped this session**;
the settled taste rules **graduated into
[`ui-design.md`](../../docs/living/ui-design.md)** (new §4.7 app-shell contract +
§4.8 density). The human then handed off an **autonomous run** ("keep building,
with variants"); the remaining intro/story + layout features are sequenced in
[`docs/plans/2026-07-02-playtest-polish-build.md`](../../docs/plans/2026-07-02-playtest-polish-build.md).
_This file is HISTORY; live state is
[`project-status.md`](../status/project-status.md)._

**Also this session — a process incident + fix:** a fix subagent opened a HEADED
Chrome via the Playwright MCP (it "verified in the app"). Killed it, closed the
browser, left the human's real Chrome untouched. Root cause: the headless-QA
PreToolUse hook was wired but not firing; it was **anchored so it actually fires**
(`7dd1c80`, authored in-tree during the session). Standing rule saved to memory:
never give fix subagents browser tools / never ask them to "verify in the app" —
headless-only.

---

## 1 · The playtest feedback loop (F1–F16)

The human asked for a durable capture system: every item logged verbatim + a
distilled taste rule + the doc it graduates to. Set up
`project/human-feedback/2026-07-02-playtest.md` with a streamlined template
(fixes land inline → the commit is the record, no prospective "fix plan").

## 2 · Shipped inline (F1–F10, F14, F16)

- **F1–F6, F8, F7 — app-shell overhaul** (`f3ad6a9`, `7642fd7`, and earlier): no
  raw white (ink ground), wider centered ~1200px paper column, fixed
  header/footer, 100dvh no-page-scroll (panes scroll internally), story log moved
  to the RIGHT column, smooth log scroll, `?dev=no` opt-out, cold-open CTA
  centered. Root cause of the white/off-center was a `#app paddingRight:16rem`
  gutter the DEV panel reserved — deleted; panel is now a fixed bottom-right
  overlay.
- **F10 — compact pass** (`8e229f0`): shrank the `:root` type/spacing scale +
  control height (44→32px) + root font (90%) so the dense chrome stops starving
  the content.
- **F14 — cold-open slow reveal** (`c1b6d82`): title→roman→lede stagger in, CTA
  wakes in after ~4.5s; roomier frame padding. **D-075 variants** (A staged-fade
  default in render.ts; B GBA-typewriter + C line-by-line ma DEV-only in dev.ts).
- **F16 — DEV panel restructure** (`fac9f7f`): Settings/Variants sub-tabs;
  variants are recency-ordered (newest on top) collapsible summaries.

## 3 · Taste rules → ui-design.md (`e2c0e73`)

Graduated the 10 shipped rules into `ui-design.md` as design law (§4.7 app-shell,
§4.8 density + the atmospheric-surface exception, §5.1 smooth scroll, §5.5 lone-CTA
axis), reconciling the 44px-vs-32px conflict (mobile ≥44, desktop ~32). A "Pending"
note records the in-flight cluster without asserting unbuilt behavior.

## 4 · Autonomous handoff — the remaining clusters

The human stepped away and said keep building with variants; approve/prune later.
Plan `docs/plans/2026-07-02-playtest-polish-build.md` sequences it: **[done] DEV
panel restructure → [done] cold-open reveal →** then **F15 story-cascade-after-open
(folded into the intro cluster — risky alone), F9 filterable log (diverge), F12
GBA story-typewriter, F13 interactive intro (respond to Sōan — likely an ADR),
F11 multi-panel (biggest)**. F9/F11/F12/F13/F15 remain.

---

## Next intended steps (current)

1. **F9 — filterable log** (diverge A tabs / B chips / C segmented; channels
   Story/Work/Combat/Progression/All; default Story). Needs the core LogEntry
   channel set mapped to categories — read that first.
2. **F12 + F15 + F13 as the intro cluster** — slow GBA typewriter for the STORY
   channel only, the waking narration cascading AFTER open-eyes, and the
   respond-to-Sōan interactive intro (design-heavy; may want human input on
   tone/branches → an ADR).
3. **F11 — multi-panel layout** — biggest; reconcile with reveal-based
   progression (panels appear as surfaces unlock). Likely its own plan/ADR.

## Landmines (current)

- **Headless-only, always.** Never hand a subagent browser tools or ask it to
  "verify in the app" (see the incident above + memory). The headless-QA hook now
  fires (`7dd1c80`), but don't rely on it — instruct every build agent explicitly.
- **Single stylesheet + single render.ts** — all UI code funnels through
  `src/ui/styles.css` + `src/ui/render.ts` + `src/ui/dev.ts`; serialize code
  builds (one agent at a time on those) to avoid clobbering. Markdown captures run
  in parallel.
- **D-075 flag-debt discipline:** a new variant's DEFAULT ships in render.ts;
  alternates live in dev.ts (stripped from prod). The cold-open reveal follows
  this (default fade in render.ts, B/C in dev.ts).
- **F15 is subtle** — the cascade already sets `firstRender=false` pre-awake so
  the waking batch cascades; don't "fix" it blind. It's really an intro-timing
  issue best solved with F12/F13.
