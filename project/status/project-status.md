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
is the story-bible canon** as of **v0.4.0** — the storywave T0 rewrite is live at
raynos.github.io/kami-kakushi. Canon =
[`docs/story-bible/`](../../docs/story-bible/README.md): **SEVEN tiers**
(Estate-household · Estate-land · Valley · Region · Castle-town · Domain · Edo),
time-skips, the ruin/guest-house twist, the succession knot. **T0 is BUILT &
shipped; T1+ are specced, not built** ([`prd.md`](../../docs/living/prd.md)). No
magic; no reset.

## Where we are now

- **✅ ESTATE REDESIGN — ALL PHASES DONE (s168, ADR-177):** Phase 1 the works
  discovery chain (works-cause diverge, pick C; weir fiction-gated,
  FB-338/FB-342; **HR-27**) · Phase 2 Schedule A one-tab-per-rung + the Works
  普請/Estate 家 diverges (**HR-29/HR-30**) · Phase 3 repair verbs + inputs.
  Plan (archived):
  [`fable-2026-07-10-estate-upgrades-redesign.md`](../archive/fable-2026-07-10-estate-upgrades-redesign.md).
- **✅ FOG/REVEAL WAVE (s171, FB-377…387):** live-map fog covers the whole
  window; the T0 sheet CLIPS to its window (no T1 world leak); ONE viewer
  engine (`map-sheets/viewer.ts`) for the DEV sheets + the live map; and NO
  zone predates its introduction — weir/kitchen/sickroom/forecourt all
  fiction-revealed (the always-open set is EMPTY).
- **✅ BODY SPLIT DONE (s167, ADR-178):** Body 体 (work fuel) + Belly 腹 (daily
  food store; teeth = rest quality) — core + two-bar UI + PRD §2.3; verdict Δ≈0.
- **✅ FB DRAIN WAVE (s168+, FB-361…373):** titlebar retired (name+version in
  footer), vitals as one-line rows, no hover-raise on disabled verbs, Map-tab
  heading dropped, cold-open cards split per scene, rakeCapLine into FLAVOR,
  T0 map-demo entries retired, travel footsteps synced to the move timer.
- **✅ v0.4.0 STORYWAVE SHIPPED & CLOSED (s125–144):** the bible-canon T0
  rewrite live on gh-pages (tag `v0.4.0`); post-ship review fully closed
  (ADR-166/167); PRD truth-synced, freeze CANCELLED (ADR-168/169, verified
  s141); cold open re-arced to three acts (ADR-173); HD-35 re-pace ruled
  (ADR-172 — R3 ≈20 min, full R0–R6 band verdicts + the R7 ratio gate are the
  live `verify:balance` teeth; greedy T0 ≈ 2.5 h sim wall). Combat curve R4+
  kills still parked (inbox).
- **✅ FOUNDATIONS:** the bible done & blessed (s116, ADR-150) · UI-v2 Andon
  Steel + the taste.md 21-principle lock (ADR-144/126) · T0/T1 map sheets =
  the player map (golden pin, blind-pass); T2 valley sheet BUILT
  (`?t2-map-demo`) — **NOT DONE: T2 rungs/fog** · Phase-2 economy (ADR-145) ·
  timed actions (ADR-148).
- **🧊 PARKED:** Plan K authored-depth demo + the T1 emergent-node plan (both
  `docs/plans/t1/`). Un-park = human.

## Waiting on the human

- **HR-1** 🔲 — play/review the full T0 arc for fun & pacing (the LOOK is UI-v2
  certified; this is the fun/taste call on the live storywave build).
- **Story picks (DEV → Story)** 🔲 — HR-18…HR-21 (overlays · discoveries ·
  judge lines · node reads) + **HR-27** (the works discovery chain, incl. the
  R2-silence note) + **HR-28** (the three intro scene heads, FB-362).
- **DEV-variant picks (ADR-075)** 🔲 — home (HR-6) · bestiary (HR-5) · the
  HR-2A–D bundle (market · influence · craft · quests). Picks → the agent
  strips the alternates. *(HR-31 porter presence CONFIRMED 2026-07-11 —
  rings deleted, travel ×2 + band [3, 25], piece on the kanji.)*

## Toolchain

Vite 5 + TS (strict, `tsgo`) + Vitest 2 + oxlint + oxfmt. Pure-core oxlint boundary
(no Math.random/pow/DOM/Date.now in `src/core`). `pnpm run verify` runs in parallel
via `verify-run.ts` (roster: [`gates.ts`](../../src/scripts/gates.ts)):
<!-- gen:begin gate-roster (pnpm run checkpoint — do not edit inside) -->
**18 gates**: tsgo, oxlint, oxfmt, vitest, verify-content, verify-prd,
gen-docs, fixtures, gen-narrative, gen-prd-regions, pacing, playcheck,
md-links, milestone-integrity, verify-changelog, doc-budgets, checkpoint,
inbox-ledger.
<!-- gen:end gate-roster -->
**`pre-commit`** runs `verify` + reading-queue/journal/snapshot gates; **`pre-push`**
blocks red. **No auto-reload** — inert `/@vite/client`, FB-257. `dev`·`build`·`/ship`.

## Code & repo layout

- `src/core` — pure (rng, state, intents/reduce, step/tick, unlock/rewards/log,
  skills, ranks, combat, ascension, pillars, works, selectors, `content/*` incl.
  `narrative/`, `scenes`, seasons) · `src/persistence` (save layer, SCHEMA 11
  — ADR-179 derived reveal; clean-break at v10) · `src/ui` (render.ts +
  dev.ts) · `src/app/main.ts` (root +
  `window.__qa`) · `src/scripts/*`. ADR ledger: `docs/living/decisions.md`.
- **3 top-level dirs:** `docs/` (truth) · `project/` (process) · `src/` (code).

## How to resume

1. Read the **newest journal** (then skim prior) + `todo-human.md` for forks:
   <!-- gen:begin resume-journal (pnpm run checkpoint — do not edit inside) -->
   [`journal/2026-07-11-session-178-inbox-drain-thelog-r1.md`](../journal/2026-07-11-session-178-inbox-drain-thelog-r1.md)
   <!-- gen:end resume-journal -->
2. `pnpm install` → `pnpm run verify` (green) → reuse the shared dev server on
   localhost:5173 (never spawn/kill your own). **`?dev=no`** for the true
   player layout. The page NEVER auto-reloads (FB-257) — F5 to pick up code.
3. Drive **headless-only** (hook-enforced): `window.__qa` / `node src/scripts/qa-shots.mjs`.
4. **Next (autonomous):** **save-format streamline** (audited s175, human
   wants src-as-truth: `docs/plans/fable-2026-07-11-save-format-streamline.md`
   — steps 2–5 small, step 1 = per-emitter log-descriptor commits); or **T2
   rungs/fog** (greenlit: `docs/plans/t2/opus-2026-07-09-t2-rungs-fog.md`; S1
   caveat: `T2_RUNG_LADDER` is DEV-preview-only); or **telemetry distillation**
   (6 usable FB-8 reports newer than the last balance commit — read + commit
   the pacing note before any balance work); or drain the playtest inbox when
   captures land (ADR-171 — claim a lane first). Human-gated: HR-1 + the
   story/variant picks above + **HD-38** (the T0 narrative register ruling
   D1–D4 — unblocks `docs/plans/fable-2026-07-11-t0-narrative-revoice.md`,
   the audited-worst-first T0 re-voice; audit: s176).
5. **Shared tree:** stage only your own files by explicit pathspec commit.

<!-- rewrite-debt: 6/20 · last full rewrite: 2026-07-11 -->
