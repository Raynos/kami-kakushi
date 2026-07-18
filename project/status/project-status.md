---
name: project-status
description: Live one-screen snapshot — current state + how to resume
metadata:
  type: project
---

# Project status

> **A SNAPSHOT, not a log — REPLACE in place, never append**
> (`doc-budgets` caps it at 120 lines; **every edit must bump the
> rewrite-debt counter at the bottom**; at the threshold it is
> rewritten fresh). Lossless record: [`../journal/`](../journal).

## The game

A grounded, story-driven **incremental RPG** in mid-Edo (1780,
fictional) rural Japan: a nameless man rises through a declining
*gōshi* house. No magic; no reset. Canon — the **seven tiers**,
time-skips, the ruin/guest-house twist, the succession knot — is
[`docs/story-bible/`](../../docs/story-bible/README.md). **T0 is BUILT
& shipped** at v0.4.0 (raynos.github.io/kami-kakushi); **T1+ are
specced, not built** ([`prd.md`](../../docs/living/prd.md)).

## Where we are now

- **✅ SAVE = FACTS ONLY, `src/` IS TRUTH (ADR-186 + s192):** the log is
  a DERIVED VIEW — a line re-renders from current `src/`, addressed by
  **NAME** (v11→v12), so a reorder can't re-point an old save's line.
- **✅ PROGRESSION = ONE MODEL, ALL TIERS (ADR-182/183):** the
  flat-points rung-meter is **DEAD at every tier** — a rung promotes
  when its **authored objective-requirement list** is 100% done. Every
  T1+ list must span BOTH tracks — canon, **no teeth yet**.
- **✅ SLEEP — TIME MOVES WITHOUT WORK (ADR-187):** a `sleep` verb at
  your woodshed corner (R4+, the only bed) — one press = one dawn,
  priced: acts forfeited, the house still eats. Sim SKIP-BLIND.
- **✅ ZONE-REVEAL LAW (ADR-184):** a zone opens **only inside a VN**;
  a rung-up VN opens **≤2** (gated). Five zones earn side-quest VNs;
  the woodshed rides to **R4**. Fog stands: sheet CLIPS, one viewer.
- **✅ SICKROOM MEND LANE (ADR-164/197, s202):** HP mends ONLY at the
  sickroom — `treat` (mon-only, hides when broke) + `rest_sickroom`
  (free pallet day); cook heal SEVERED (food = belly). Band [3, 28].
- **✅ TAKE SYSTEM = ONE FUNNEL (ADR-198, s200):** a DEV take flip
  re-renders EVERYTHING (logged lines incl.); takes gen-compile to
  flat maps behind a HARD prose-only gate; ten setters → ONE overlay.
- **✅ SEAL-BOOK STRIP (ADR-201, s214):** the run record as a compact
  Character-tab strip (v16 record; 3 variants, blind-passed) + the
  afterglow beat + the R1 intro line. Picks: **HR-46 · HR-47**.
- **✅ BODY SPLIT (ADR-178) · ESTATE (ADR-177):** works chain
  (**HR-27**) · diverges (**HR-29/HR-30**). **✅ FOUNDATIONS:** bible
  (ADR-150) · PRD freeze cancelled (ADR-168) · UI-v2/taste lock
  (ADR-144/126). **NOT DONE:** Phase-2 economy.
- **🧊 PARKED:** Plan K · T1 emergent-nodes (`docs/plans/t1/`) · T2
  rungs/fog (`docs/plans/t2/`, human 2026-07-17).

## Waiting on the human

The live queue: [`../human-in-the-loop/`](../human-in-the-loop).

- **HR-1** 🔲 — play the full T0 arc: the fun & pacing call on the
  live build (the LOOK is already UI-v2 certified).
- **HD-40** 🔲 — **the kitchen-only pot.** BUILT, one line turns it on;
  held — priced out of the old [3,25] band (R3 31.6). The band is
  [3,28] now (ADR-197) and cook no longer mends: worth a re-sim.
- **HR-42** 🔲 — the R3 **delight line**: the one pick in T0 that pays
  (+1 agi) is back (ADR-190); 3 takes at DEV → Story
  `adr190-nudge`.
- **HR-33** + **HR-32b** 🔲 — the four zone-reveal VNs; and does a zone
  announce itself VN-only, or VN + map-ink?
- **ONE home for every pick: DEV → Review** — Story ⇄ Variants behind
  one switch; each row carries its **HR-n**. **Story** 🔲 HR-18…21 ·
  HR-27 · HR-39 · HR-40 · HR-42 · HR-43 · **Variants** 🔲 HR-6 · HR-5 ·
  HR-2A–D · HR-29/30 · HR-45 · HR-46.

## Toolchain

Vite 5 + TS (strict, `tsgo`) + Vitest 2 + oxlint + oxfmt. Pure-core
oxlint boundary (no Math.random/pow/DOM/Date.now in `src/core`).
`pnpm run verify` runs in parallel via `verify-run.ts` (roster:
[`gates.ts`](../../src/scripts/gates.ts)):
<!-- gen:begin gate-roster (pnpm run checkpoint — do not edit inside) -->
**21 gates**: tsgo, oxlint, oxfmt, vitest, verify-content, verify-prd,
gen-docs, fixtures, gen-narrative, gen-prd-regions, pacing, playcheck,
md-links, milestone-integrity, verify-changelog, doc-budgets,
checkpoint, inbox-ledger, review-link, deferred-work, human-todo.
<!-- gen:end gate-roster -->
**`pre-commit`** runs `verify` + reading-queue/journal/snapshot gates;
**`pre-push`** blocks red. **No auto-reload** — inert `/@vite/client`,
FB-257. `dev`·`build`·`/ship`.

## Code & repo layout

- `src/core` (pure: rules, state, content incl. `narrative/`) ·
  `src/persistence` (save layer, SCHEMA 16) · `src/ui` (shells over
  `render/` views · `dev/` panes · `styles/` — the render-split)
  · `src/app/main.ts` (root + `window.__qa`)
  · `src/scripts/*`. Full map: [`repo-map.md`](../../docs/repo-map.md);
  ADR ledger: `docs/living/decisions.md` (index) + `decisions/` bands
  — new ADRs: newest band, number via `tree-claim.ts adr` (ADR-196).
- **3 top-level dirs:** `docs/` (truth) · `project/` (process) ·
  `src/` (code).

## How to resume

1. Read the **newest journal** + `todo-human.md` for forks:
   <!-- gen:begin resume-journal (pnpm run checkpoint — do not edit inside) -->
   [`journal/2026-07-18-session-217-bestiary-plates.md`](../journal/2026-07-18-session-217-bestiary-plates.md)
   <!-- gen:end resume-journal -->
2. `pnpm install` → `pnpm run verify` (green) → reuse the shared dev
   server on localhost:5264 (never spawn/kill your own). **`?dev=no`**
   for the true player layout; the page NEVER auto-reloads (FB-257).
3. Drive **headless-only** (hook-enforced): `window.__qa` / `node src/scripts/qa-shots.mjs`.
4. **Next (autonomous):** the FB-415 ask-answer waves (ADR-139) ·
   the bestiary-plates / pictogram-AB plans (`docs/plans/`).
5. **Shared tree (ADR-196 locks live):** pathspec commits only; push
   with **`pnpm run push`** (bare `git push` is blocked; lane held →
   commits stay local by design). Render-split LANDED (session 203):
   surface work goes in `src/ui/render|dev/`, not the shells.

<!-- rewrite-debt: 14/20 · last full rewrite: 2026-07-13 -->
