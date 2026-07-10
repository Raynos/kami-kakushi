---
name: project-status
description: Live one-screen snapshot — current state + how to resume
metadata:
  type: project
---

# Project status

> **A SNAPSHOT, not a log — REPLACE in place, never append** (`doc-budgets` caps
> it at 120 lines; **every edit must bump the rewrite-debt counter at the bottom**,
> and at the threshold the doc gets rewritten fresh). The lossless record is
> [`../journal/`](../journal) — culling stale state here is correct, never a loss.

## The game

A grounded, story-driven **incremental RPG** in mid-Edo (1780, fictional) rural
Japan: a nameless man rises through a declining *gōshi* house. **The shipped game
is the story-bible canon** as of **v0.4.0** — the storywave T0 rewrite is live.
Canon = [`docs/story-bible/`](../../docs/story-bible/README.md): **SEVEN tiers**
(Estate-household · Estate-land · Valley · Region · Castle-town · Domain · Edo),
time-skips, the ruin/guest-house twist, the succession knot. **T0 is BUILT &
shipped; T1+ are specced, not built** ([`prd.md`](../../docs/living/prd.md)). No
magic; no reset.

## Where we are now

- **✅ STORYWAVE CLOSURE DONE (s134, 2026-07-10):** every post-ship-review finding
  fixed or human-ruled — ADR-166 (Autumn is a TRUE refusing gate) · ADR-167 (the
  full fiction wave: 5 season overlays · 3 hidden discoveries · per-grade judge
  lines · 16 zones × 6 seasons of node reads; HR-18…HR-21 review LIVE in DEV →
  Story) · the dark side-beats/cast/log-texture wired · six-step grades · the
  one-scene intro · prd-drift widened + RED-proven · the idler persona repaired
  (fullLadder, all seeds). Finding→commit map: the review report's closing
  addendum. Plan archived.
- **✅ STORYWAVE SHIPPED v0.4.0 (s125–131):** the bible-canon T0 rewrite is LIVE on
  gh-pages (tag `v0.4.0`); all three storywave plans archived.
- **OWED → HD-34 (design):** the Phase-2 ratio breach ([4.0–4.9] vs [0.8,1.2]) ·
  the idler-ascension expectation · B8's free pool refill — sim evidence attached.
  `verify:balance` now runs ~17 min (the repaired idler plays to the guard).
  Combat curve R4+ kills still parked.
- **🧊 PARKED:** Plan K authored-depth demo (`docs/plans/t0/`; prototypes ⭐
  `project/prototypes/authored-depth-demo/`) + the T1 emergent-node plan
  (`docs/plans/t1/`). Un-park = human.
- **✅ THE BIBLE — DONE & BLESSED (s109–116, ADR-150):** 7 tier sheets · full cast ·
  register-rules law · THE FALL. The human signed off the whole read (s116).
- **✅ UI-v2 Andon Steel SHIPPED + PH5-CERTIFIED (s98):** the steel palette
  (ADR-144); `taste.md` 21-principle lock (ADR-126) + the FB-10 two-pass flow.
- **✅ MAPS PLAYER-BOUND (s112–119):** T0/T1 sheets = the player map (HR-12 ✅, golden
  pin, blind-pass); T2 valley sheet BUILT (`?t2-map-demo`) — **NOT DONE: T2
  rungs/fog (§6.1).**
- **✅ PHASE-2 ECONOMY (ADR-145):** the A+B deed-source loop; FB-121 rungs (hidden
  lists + %-bar, points meter dead). **✅ TIMED ACTIONS (ADR-148):** ActionClock.

## Waiting on the human

- **HR-1** 🔲 — play/review the full T0 arc for fun & pacing (the LOOK is UI-v2
  certified; this is the fun/taste call on the live storywave build).
- **HR-18…HR-21** 🔲 — the C5a fiction-wave picks (overlays · discoveries · judge
  lines · node reads), reviewed LIVE via DEV → Story. **HD-33** 🔲 (the frozen
  §1's pre-reboot tables) · **HD-34** 🔲 (the three balance design calls).
- **DEV-variant picks** 🔲 — kept live for a detailed pass: estate-section (HR-9) ·
  home (HR-6) · bestiary (HR-5) · the HR-2 bundle · Phase-2 build-beat + tracker
  (HR-10/HR-11). Picks → the agent strips the alternates (zero prod flag-debt).
- Closed on the storywave ship: HR-8, HR-12, HR-14, HR-16, HR-17 (→
  `human-in-the-loop/archive.md`).

## Toolchain

Vite 5 + TS (strict, `tsgo`) + Vitest 2 + oxlint + oxfmt. Pure-core oxlint boundary
(no Math.random/pow/DOM/Date.now in `src/core`). `pnpm run verify` runs in parallel
via `verify-run.ts` (roster: [`gates.ts`](../../src/scripts/gates.ts)):
<!-- gen:begin gate-roster (pnpm run checkpoint — do not edit inside) -->
**17 gates**: tsgo, oxlint, oxfmt, vitest, verify-content, verify-prd,
gen-docs, fixtures, gen-narrative, gen-prd-regions, pacing, playcheck,
md-links, milestone-integrity, verify-changelog, doc-budgets, checkpoint.
<!-- gen:end gate-roster -->
**`pre-commit`** runs `verify` + reading-queue/journal/snapshot gates; **`pre-push`**
blocks red. **HMR OFF** (`vite.config.ts`) — FB-5. `pnpm run dev` · `build` · `/ship`.

## Code & repo layout

- `src/core` — pure (rng, state, intents/reduce, step/tick, unlock/rewards/log,
  skills, ranks, combat, ascension, pillars, selectors, `content/*` incl.
  `narrative/`, `scenes`, seasons) · `src/persistence` (save layer, SCHEMA 10,
  clean-break) · `src/ui` (render.ts + dev.ts) · `src/app/main.ts` (root +
  `window.__qa`) · `src/scripts/*`. ADR ledger: `docs/living/decisions.md`.
- **3 top-level dirs:** `docs/` (truth) · `project/` (process) · `src/` (code).

## How to resume

> 🎮 **v0.4.0 "the storywave release" shipped 2026-07-09 via `/ship`** — the
> bible-canon T0 rewrite (six-season year, kura economy, body economies, new cast).
> Live at raynos.github.io/kami-kakushi. Session 133 then AUDITED the whole wave
> (6-agent review + map-sheets audit): ship real, engine sound, no src/ criticals —
> but two closure debts were mapped into plans. Sessions 134+135 executed them
> in parallel and BOTH are ✅ DONE + archived: **storywave-closure (s134)** — see
> "Where we are now" — and **map-sheets fixes (s135)** — the blind-pass loop is
> now a 3-reader ensemble and ALL THREE sheets pass it (T0 M 7/7 · T1 M 12/12 ·
> T2 M 6/6); canon strings carry a 13-name retired-name guard test.

1. Read the **newest journal** (then skim prior) + `todo-human.md` for forks:
   <!-- gen:begin resume-journal (pnpm run checkpoint — do not edit inside) -->
   [`journal/2026-07-09-session-135-map-sheets-fixes.md`](../journal/2026-07-09-session-135-map-sheets-fixes.md)
   <!-- gen:end resume-journal -->
2. `pnpm install` → `pnpm run verify` (green) → `pnpm run dev` (→ localhost:5173).
   Use **`?dev=no`** for the true player layout. FB-5 to reload (HMR off).
3. Drive **headless-only** (hook-enforced): `window.__qa` / `node src/scripts/qa-shots.mjs`.
4. **Next (autonomous):** the closure work is DONE — the frontier is
   **T2 rungs/fog** (plan ready + human-greenlit:
   `docs/plans/t2/opus-2026-07-09-t2-rungs-fog.md` — carries the S1 caveat:
   `T2_RUNG_LADDER` is DEV-preview-only; derive from core when the schedule
   exists), or drain the playtest inbox as the human QAs. Human-gated:
   HR-1 + HR-18…21 (DEV → Story) + HD-33/HD-34. Combat R4+ = a design
   call, NOT a fix → inbox.
5. **Shared tree:** stage only your own files by explicit pathspec commit.

<!-- rewrite-debt: 5/20 · last full rewrite: 2026-07-09 (bump on every edit; rewrite at 20) -->
