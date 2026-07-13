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

- **✅ SAVE = FACTS ONLY, `src/` IS TRUTH (ADR-186):** the log is a
  DERIVED VIEW — a line persists as a descriptor and re-renders from
  current `src/`, so a reword reaches every existing save (gated).
- **✅ PROGRESSION = ONE MODEL, ALL TIERS (ADR-182/183):** the
  flat-points rung-meter is **DEAD at every tier** — a rung promotes
  when its **authored objective-requirement list** is 100% done. Every
  T1+ list must span BOTH tracks — canon, **no teeth yet**.
- **✅ SLEEP — TIME MOVES WITHOUT WORK (ADR-187):** a `sleep` verb at
  **your woodshed corner (R4+, the only bed)** — one press = one dawn,
  INSTANT, and priced: the day's acts are forfeited, the house still
  eats, you slept through the pot. The sim stays **SKIP-BLIND**
  (pinned). The announce beat is BUILT — read it at **HR-40**.
- **✅ ZONE-REVEAL LAW (ADR-184):** a zone opens **only inside a VN**;
  a rung-up VN opens **≤2** (gated). Five zones earn side-quest VNs;
  the woodshed rides to **R4**. Fog stands: sheet CLIPS, one viewer.
- **✅ BODY SPLIT (ADR-178):** Body 体 (work fuel) + Belly 腹 (food
  store; teeth = rest quality) — core + two-bar UI + PRD §2.3.
- **✅ ESTATE REDESIGN (ADR-177):** works chain (**HR-27**) ·
  Works/Estate diverges (**HR-29/HR-30**) · repair verbs.
- **✅ FOUNDATIONS:** bible blessed (ADR-150) · PRD freeze CANCELLED
  (ADR-168/169) · UI-v2 Andon Steel + taste.md's 21-principle lock
  (ADR-144/126) · T0/T1 map sheets = the player map; T2 sheet BUILT
  (`?t2-map-demo`). **NOT DONE: T2 rungs/fog** · Phase-2 economy ·
  timed actions.
- **🧊 PARKED:** Plan K + the T1 emergent-node plan
  (`docs/plans/t1/`). Un-park = human.

## Waiting on the human

The live queue: [`../human-in-the-loop/`](../human-in-the-loop).

- **HR-1** 🔲 — play the full T0 arc: the fun & pacing call on the
  live build (the LOOK is already UI-v2 certified).
- **HD-40** 🔲 — **the kitchen-only pot.** Picked, BUILT, one line
  turns it on — held because the sim prices its walk at **R3 31.6
  wall-min, outside the signed [3,25] band** (ADR-056 is yours to
  move). Four levers in the item.
- **HR-41** 🔲 — the objective line: the treatment is settled (B
  shipped), the open call is its **voice** (3 takes at DEV → Story
  `SV18`; the pick writes the HD-41 ADR).
- **HR-33** + **HR-32b** 🔲 — the four zone-reveal VNs, and whether a
  zone announces itself VN-only or VN + map-ink.
- **ONE home for every pick: DEV → Review** — Story ⇄ Variants behind
  one switch; each row carries its **HR-n**. **Story** 🔲 HR-18…21 ·
  HR-27 · HR-28 · HR-39 · HR-40 · **Variants** 🔲 HR-6 · HR-5 ·
  HR-2A–D · HR-29/30.

## Toolchain

Vite 5 + TS (strict, `tsgo`) + Vitest 2 + oxlint + oxfmt. Pure-core
oxlint boundary (no Math.random/pow/DOM/Date.now in `src/core`).
`pnpm run verify` runs in parallel via `verify-run.ts` (roster:
[`gates.ts`](../../src/scripts/gates.ts)):
<!-- gen:begin gate-roster (pnpm run checkpoint — do not edit inside) -->
**20 gates**: tsgo, oxlint, oxfmt, vitest, verify-content, verify-prd,
gen-docs, fixtures, gen-narrative, gen-prd-regions, pacing, playcheck,
md-links, milestone-integrity, verify-changelog, doc-budgets,
checkpoint, inbox-ledger, review-link, deferred-work.
<!-- gen:end gate-roster -->
**`pre-commit`** runs `verify` + reading-queue/journal/snapshot gates;
**`pre-push`** blocks red. **No auto-reload** — inert `/@vite/client`,
FB-257. `dev`·`build`·`/ship`.

## Code & repo layout

- `src/core` (pure: rules, state, content incl. `narrative/`) ·
  `src/persistence` (save layer, SCHEMA 11) · `src/ui` (render.ts +
  dev.ts + dev-surfaces.ts) · `src/app/main.ts` (root + `window.__qa`)
  · `src/scripts/*`. Full map: [`repo-map.md`](../../docs/repo-map.md);
  ADR ledger: `docs/living/decisions.md`.
- **3 top-level dirs:** `docs/` (truth) · `project/` (process) ·
  `src/` (code).

## How to resume

1. Read the **newest journal** + `todo-human.md` for forks:
   <!-- gen:begin resume-journal (pnpm run checkpoint — do not edit inside) -->
   [`journal/2026-07-13-session-195-the-queue-reads-at-72.md`](../journal/2026-07-13-session-195-the-queue-reads-at-72.md)
   <!-- gen:end resume-journal -->
2. `pnpm install` → `pnpm run verify` (green) → reuse the shared dev
   server on localhost:5173 (never spawn/kill your own). **`?dev=no`**
   for the true player layout; the page NEVER auto-reloads (FB-257).
3. Drive **headless-only** (hook-enforced): `window.__qa` /
   `node src/scripts/qa-shots.mjs`.
4. **Next (autonomous):** the **ADR-sweep split** — start with
   `docs/plans/fable-2026-07-13-log-truth-and-small-fixes.md`, then
   its `fable-2026-07-13-*` siblings — merchant-state ·
   sickroom-hp-mend · dialogue-live-swap — **sequenced** (they share
   `intents.ts`). Then **T2 rungs/fog** · **telemetry** (7 reports).
5. **Shared tree:** stage only your own files by explicit pathspec
   commit. **`VERIFY_FULL=1 pnpm run verify` before you push** — the
   commit lane skips `@slow`, so a green commit can still red a push.

<!-- rewrite-debt: 0/20 · last full rewrite: 2026-07-13 -->
