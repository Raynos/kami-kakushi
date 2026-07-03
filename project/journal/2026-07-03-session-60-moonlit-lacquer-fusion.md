# Session 60 — 2026-07-03 — Moonlit × Lacquer fusion demos (07–09)

## ☀️ SUMMARY (read this first)

The human is torn between `ui-demos/` **01 Moonlit** and **04 Lacquer** and asked
for **3 fusion variants** built as demos **07–09** to feel which pulls. Ran a
7-way blind Opus fan-out (one organizing-principle per agent) → a taste judge →
a **spanning trio**: **07 Andon** (warmth-as-place), **08 Night Seal**
(warmth-as-you), **09 Damascene Duet** (a third steel substrate). Idea/ranking in
[`project/brainstorms/2026-07-03-moonlit-lacquer-fusion.md`](../brainstorms/2026-07-03-moonlit-lacquer-fusion.md);
build spec + model-routing in
[`docs/plans/opus-2026-07-03-ui-demos-07-09-moonlit-lacquer.md`](../../docs/plans/opus-2026-07-03-ui-demos-07-09-moonlit-lacquer.md).
This file is HISTORY; live state = `project/status/project-status.md`.

---

## 1 · Fan-out + ranking + durable capture (docs commit)

- Read both parents deeply (CSS + main.js + the VARIANT-SPEC) — the key build
  insight: **each fusion forks ONE parent's three files and re-skins**, keeping
  the parent's proven engine wiring + reconcile + mobile/iOS trap fixes intact.
- Workflow `moonlit-lacquer-fusion-ideation` (7 idea agents → 1 judge, all Opus,
  8 agents, 0 errors). Snapshotted raw verbatim to
  `project/brainstorms/raw/2026-07-03-moonlit-lacquer-fusion-ideation-wtw1qor6c.json`.
- Chosen trio spans 3 orthogonal fusion axes (warmth-as-place / -as-you /
  -transcended); bases = 04, 01, 04. Order 07→08→09 is a deliberate gradient
  (both coexist → one dominant + traveling accent → neither, a third thing).

### What changed (this commit)
- `project/brainstorms/2026-07-03-moonlit-lacquer-fusion.md` — NEW: 7 concepts +
  ranking + the chosen trio.
- `docs/plans/opus-2026-07-03-ui-demos-07-09-moonlit-lacquer.md` — NEW: build spec
  (fork-don't-greenfield), per-variant design, model-routing (Opus ×4), DoD.
- `project/todo-human.md` — plan added to the reading queue.
- `project/human-in-the-loop/review.md` — R9 extended with 07/08/09.
- `project/journal/…session-60…` — this file.

## Next intended steps
1. Build 07/08/09 — one resumable Opus agent per variant (fork its parent →
   reskin/recompose → self-verify per VARIANT-SPEC §4.3). Disjoint dirs →
   parallel-safe.
2. QA each myself (drive + screenshot R0–R3 + moments + mobile; score vs §3 +
   taste T1–T4); fix anything off.
3. Wire `ui-demos/index.html` (gallery rows 07–09); keep R9 current; checkpoint +
   push so the Vercel demo updates.

## Landmines
- Build agents must touch **only** their own `ui-demos/0N-<name>/` dir — never the
  shared gallery `index.html`, `shared/`, or each other's dirs (shared-tree
  safety). I wire the gallery as the single writer.
- ui-demos is excluded from Prettier/ESLint but is still served as ES modules from
  repo root — relative `../shared/` imports, no build step, no external requests.
- The three concepts each carry a named slop-risk (Andon terminator mud; Night
  Seal "01 + red cursor"; Damascene gunmetal/trophy) — QA must judge those
  specifically, not just "does it render".
