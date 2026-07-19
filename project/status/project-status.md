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

- **✅ SAVE = FACTS ONLY (ADR-186 + s192):** the log is a DERIVED view
  re-rendered from current `src/`, lines addressed by NAME (v11→v12).
- **✅ PROGRESSION = ONE MODEL (ADR-182/183):** flat points DEAD — a
  rung promotes when its authored requirement list is 100% done; T1+
  lists span BOTH tracks — canon, **no teeth yet**.
- **✅ SLEEP (ADR-187):** time moves without work — one press = one
  dawn at the woodshed bed (R4+), priced. Sim SKIP-BLIND.
- **✅ ZONE-REVEAL LAW (ADR-184):** zones open only inside VNs (≤2 per
  rung-up); five side-quest VNs; woodshed at R4; fog stands.
- **✅ SICKROOM MEND LANE (ADR-164/197, s202):** HP mends ONLY at the
  sickroom — `treat` (mon-only, hides when broke) + `rest_sickroom`
  (free pallet day); cook heal SEVERED (food = belly). Band [3, 28].
- **✅ TAKE SYSTEM = ONE FUNNEL (ADR-198, s200):** a DEV take flip
  re-renders EVERYTHING (logged lines incl.); takes gen-compile to
  flat maps behind a HARD prose-only gate; ten setters → ONE overlay.
- **✅ SEAL-BOOK STRIP (ADR-201, s214):** the run record as a compact
  Character-tab strip + afterglow + R1 line. **HR-46 · HR-47**.
- **✅ SHELL DEFECTS — and a DEAD VERB (s219):** three 390px defects
  fixed; **`End the 季` was unclickable at EVERY viewport** — the season
  wheel was never reachable. Audit queued (jsdom can't hit-test).
- **✅ PICTOGRAM A/B (#15, s216):** 11 marks both ways, blind-passed:
  **picto 10/11 PASS · emoji 8/11 FAIL**. Verdict: **HR-48**.
- **⏸️ BEAST REGISTER (#4, s217):** 獣譜 plates blind-passed ×2 (8/9,
  facture short) → **PARKED as DEV ref**; **HR-5 addendum** = verdict.
- **✅ TALK SYSTEM COMPLETE (FB-415/ADR-200, s210+s218):** asks at every
  person; 18 labels + answers, 3 discovery hints. **HR-45 · HR-49/50/51**.
- **✅ BODY SPLIT (ADR-178) · ESTATE (ADR-177):** works chain
  (**HR-27**) · diverges (**HR-29/HR-30**). **✅ FOUNDATIONS:** bible
  (ADR-150) · PRD freeze cancelled (ADR-168) · UI-v2/taste lock
  (ADR-144/126). **NOT DONE:** Phase-2 economy.
- **🧊 PARKED:** Plan K · T1 emergent-nodes · T2 rungs/fog
  (`docs/plans/t1/` · `t2/`, human 2026-07-17).

## Waiting on the human

The live queue: [`../human-in-the-loop/`](../human-in-the-loop).

- **HR-1** 🔲 — play the full T0 arc: fun & pacing (look certified).
- **HD-40** 🔲 — **the kitchen-only pot.** BUILT, one line turns it on;
  held on the old [3,25] band — [3,28] + no cook-mend: worth a re-sim.
- **HR-42** 🔲 — the R3 **delight line** (`adr190-nudge`, 3 takes).
- **HR-33 + HR-32b** 🔲 — the four zone-reveal VNs; announce shape?
- **ONE home for every pick: DEV → Review** — Story ⇄ Variants behind
  one switch; each row carries its **HR-n**. **Story** 🔲 HR-18…21 ·
  HR-27 · HR-39 · HR-40 · HR-42 · HR-43 · HR-49/50/51 · **Variants** 🔲
  HR-6 · HR-5 · HR-2A–D · HR-29/30 · HR-45 · HR-46.

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
   [`journal/2026-07-18-session-219-phone-shell-defects.md`](../journal/2026-07-18-session-219-phone-shell-defects.md)
   <!-- gen:end resume-journal -->
2. `pnpm install` → `pnpm run verify` (green) → reuse the shared dev
   server on localhost:5264 (never spawn/kill your own). **`?dev=no`**
   for the true player layout; the page NEVER auto-reloads (FB-257).
3. Drive **headless-only** (hook-enforced): `window.__qa` / `node src/scripts/qa-shots.mjs`.
4. **Next (autonomous):** the live `docs/plans/` queue — the s219
   **unreachable-verb audit** (were R2+ bands signed against a season
   turn no player could make?); pictogram follow-ups; bestiary PARKED.
5. **Shared tree (ADR-196 locks live):** pathspec commits only; push
   with **`pnpm run push`** (bare `git push` is blocked; lane held →
   commits stay local by design). Render-split LANDED (session 203):
   surface work goes in `src/ui/render|dev/`, not the shells.

<!-- rewrite-debt: 18/20 · last full rewrite: 2026-07-13 -->
