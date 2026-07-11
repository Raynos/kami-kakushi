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

- **✅ SAVE = FACTS ONLY, `src/` IS TRUTH (s180, ADR-186):** the log is a DERIVED
  VIEW — every line persists as a descriptor and re-renders from current `src/`,
  so a reword reaches every existing save (302 keyless lines → **0**, gated).
  `validateState` is a whitelist rebuild (retired fields age out); weapon wear +
  `sitePools` derive from the registries; a DEV orphaned-id sensor reports content
  renames. Fixtures store descriptors (zero prose on disk).
- **✅ PROGRESSION = ONE MODEL, ALL TIERS (s180, ADR-182/183):** the flat-points
  rung-meter (threshold table, AND-gate with story flags) is **DEAD at every
  tier**, not just T0 — a rung promotes when its **authored objective-requirement
  list** is 100% done. PRD (6 sections) + roadmap + t1/t2-content rewritten;
  `prd-drift` RETIRES the dead vocabulary (proven RED-able). **ADR-183:** every
  T1+ rung's list must hold ≥1 requirement from EACH track — **canon, no teeth
  yet** (no track field in code; the check ships with T1 authoring).
- **✅ ESTATE REDESIGN — ALL PHASES DONE (s168, ADR-177):** works discovery chain
  (**HR-27**) · Works 普請/Estate 家 diverges (**HR-29/HR-30**) · repair verbs.
- **✅ ZONE-REVEAL LAW (s182, ADR-184):** a zone opens **only inside a VN**; a rung-up
  VN opens **≤2** (a `verify-content` gate). R1 opened 4 zones, 3 empty (FB-407/8/9) →
  now **1**. Five zones earn side-quest VNs (`core/reveals.ts`): gate · kitchen ·
  margins · reeds (`sb-lease` — it already existed) · sickroom; the woodshed rides to
  R4, where the home it promises is granted. `seenReveals` **re-arms** (a re-rung zone
  re-announces). Pacing ±0.0. Fog wave (s171) stands: sheet CLIPS, one viewer engine.
- **✅ BODY SPLIT (s167, ADR-178):** Body 体 (work fuel) + Belly 腹 (food store;
  teeth = rest quality) — core + two-bar UI + PRD §2.3; verdict Δ≈0.
- **✅ v0.4.0 STORYWAVE SHIPPED & CLOSED (s125–144):** bible-canon T0 live on
  gh-pages (tag `v0.4.0`); PRD truth-synced, freeze CANCELLED (ADR-168/169); HD-35
  re-pace ruled (ADR-172 — R3 ≈20 min; the bands are the `verify:balance` teeth).
- **✅ FOUNDATIONS:** bible blessed (ADR-150) · UI-v2 Andon Steel + taste.md's 21-principle
  lock (ADR-144/126) · T0/T1 map sheets = the player map (golden pin, blind-pass); T2 sheet
  BUILT (`?t2-map-demo`) — **NOT DONE: T2 rungs/fog** · Phase-2 economy · timed actions.
- **🧊 PARKED:** Plan K + the T1 emergent-node plan (`docs/plans/t1/`). Un-park = human.

## Waiting on the human

- **HR-1** 🔲 — play/review the full T0 arc for fun & pacing (the LOOK is UI-v2
  certified; this is the fun/taste call on the live storywave build).
- **HD-40** 🔲 — **the kitchen-only pot.** You picked it, it is BUILT, one line turns
  it on — held because the sim prices its walk at **R3 22.7 → 31.6 wall-min, outside
  the signed [3,25] band** (ADR-056 is yours to move). Four levers in the item.
- **HR-33** 🔲 (story) + **HR-32b** 🔲 (announce) — the four zone-reveal VNs (take A
  canon; **take B is the one that answers "the people are pure flavor"**), and
  VN-only vs VN+map-ink. Both live in the DEV panel.
- **Story picks (DEV → Story)** 🔲 — HR-18…HR-21 · **HR-27** (works chain) ·
  **HR-28** (intro heads). **DEV-variant picks (ADR-075)** 🔲 — HR-6 · HR-5 ·
  HR-2A–D · HR-29 · HR-30. A pick → the agent strips the alternates.

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
   [`journal/2026-07-12-session-183-sleep-the-day-away.md`](../journal/2026-07-12-session-183-sleep-the-day-away.md)
   <!-- gen:end resume-journal -->
2. `pnpm install` → `pnpm run verify` (green) → reuse the shared dev server on
   localhost:5173 (never spawn/kill your own). **`?dev=no`** for the true
   player layout. The page NEVER auto-reloads (FB-257) — F5 to pick up code.
3. Drive **headless-only** (hook-enforced): `window.__qa` / `node src/scripts/qa-shots.mjs`.
4. **Next (autonomous):** **T2 rungs/fog** (`docs/plans/t2/…`; `T2_RUNG_LADDER` is
   DEV-preview-only) · **telemetry distillation** (6 usable FB-8 reports newer than
   the last balance commit) · the save-format **addendum** (the re-arm is DONE with
   ADR-184; what remains is the two `SPECIAL_FACTS` surfaces bypassing the rung
   schedule, and the **save-migration policy** — machinery exists (`migrate.ts` + the
   ADR-161 courteous restart); the missing rule is *when a content move bumps the
   generation vs. ships a migration step*). **In flight:** wait-a-day (w2) ·
   T0 re-voice (w6, ADR-185). Human-gated: **HD-40** + HR-1 + the picks above.
5. **Shared tree:** stage only your own files by explicit pathspec commit.
   **`VERIFY_FULL=1 pnpm run verify` before you push** — the commit lane skips
   `@slow`, so a green commit can still red the push (bit s180).

<!-- rewrite-debt: 12/20 · last full rewrite: 2026-07-11 -->
