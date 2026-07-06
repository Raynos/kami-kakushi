---
name: project-status
description: Live one-screen snapshot — current state + how to resume
metadata:
  type: project
---

# Project status

> **A SNAPSHOT, not a log — REPLACE in place, never append** (the `doc-budgets`
> gate caps it at 120 lines). The lossless record is [`../journal/`](../journal),
> so deleting stale state here is correct, never a loss. No dated "Phase update"
> bullets — those are journal entries.

## The game

A grounded, story-driven **incremental RPG** in mid-Edo (1780, An'ei 9, fictional)
rural Japan. A mediocre ~18yo (true name **Tahei**) wakes amnesiac on a declining
lower-samurai (*goshi*) estate (the **Kurosawa** house) and rises through **6 tiers**
(T0 Estate-tutorial · T1 Estate-full · T2 Village · T3 Region · T4 Castle-town ·
T5 Edo). **v1 scope = T0→T3.** Signature: **the UI itself unlocks incrementally.**
No magic; growth only through perseverance; no reset.
Spec: [`../../docs/living/prd.md`](../../docs/living/prd.md).

## Where we are now

- **PRD V2.3** — the 6-tier reshape is fully rippled; `prd.md` is a stub index →
  per-section files `docs/living/prd/*`. §4 balance + §7 MS2–MS7 stay provisional (ADR-059).
- **v0.3.0–v0.3.7 shipped** the full T0 MS0–MS4 arc (FB-1–FB-117) + the **autonomous
  T0 rebuild** (2026-07-03, ADRs **ADR-107–ADR-116**): append-only render engine ·
  economy re-core (koku=House **standing**) · 7-tab IA · estate-map · rung VN
  beats (SCHEMA 6) · `CHANGELOG.md` + `verify-changelog` gate.
- **✅ Agent-default audit + v0.3.5 deltas** (ADRs **ADR-118–ADR-125**: 7-tab IA ·
  rice spoilage/cap · cook/storage · R5 wall-weapon · home→R3). **R7 capstone**
  DESIGNED (ADR-125), build DEFERRED to T1. `emergent-node-actions` → a plan.
- **✅ THE TASTE LOCK (ADR-126, s57):** top layer locked WITH the human → `taste.md`
  (pyramid, 21 principles, 150-cap) · `ui-design.md` 1159→351 (tokens GENERATED)
  · `doc-budgets` gate · **✅ FB-10 built (s77 — two-pass taste flow, ADR-135)**.
- **✅ UI-v2 direction LOCKED (historical R9 → ADR-127): 10 Andon Steel**; 01–09
  anchored in `ui-demos/`; the `src/` port is a future build, washi ships till
  then. (The live **HR-9** id now = the story reader, closed 2026-07-06.)
- **✅ THE FB-1–FB-10 PROCESS WAVE IS COMPLETE** (ADR-117 frontier PRD; CI ·
  inbox · sim · narrative · saves · cockpit · /ship · taste two-pass · telemetry).
- **✅ s90 context-hardening DONE (archived):** hooksPath auto-wired ·
  `verify:tooling` nightly · **ADR-140 id collapse** · caps.
- **✅ s88 e2e + HD-23/24 DONE:** 3-project browser lane (desktop · journeys ·
  persistence · ratchet), CI green 25s; HD-23 R3 mend-hint **ADR-141** · HD-24 cold-open restore **ADR-142** (s94, hint HR-10).
- **✅ s92 ADR-139 NARRATIVE DIVERGE:** standing 3+-takes rule (skill +
  AGENTS.md) + DEV Story surfaces — takes compiler · live set-switcher ·
  **galley** reader (HR-9 ✅ same-day; drain FB-122–125). `takes/` empty —
  awaits the first real bundle (the human-kicked beat redesign).

## Waiting on the human

- **REVIEW PASSOVER** 🔲 (HR-1) — play/review the **freshly-redeployed** T0 (VN intro,
  log v2, **7-tab IA**, economy re-core + rice spoilage/cap, estate-map, rung beats,
  R5 wall-weapon).
- **DEV-variant picks** 🔲 — live in the DEV panel: estate-map **V5A–G** (HR-7),
  home/Inventory **A/B/C** (HR-6, now BUILT — list · 一間 room · 持ち物帳 ledger) +
  older surfaces (HR-2/HR-5). Pick each live → I strip the rest (zero flag-debt).
- **Rung cast + R0→R7 beats** 🔲 (HR-8) — drafted for your read (3 faces: pedlar
  Tokubei, Rokusuke, smith Tōzō). `project/archive/opus-2026-07-02-rung-up-story-transitions.md`.
- **UI-v2 build** ⏳ — direction locked (ADR-127). Open: are HR-2/HR-5/HR-6/HR-7
  (washi-UI picks) still wanted as interim polish now UI-v2 supersedes them?
- **Story track kickoffs** 🔲 — the 2 TODOs: fable **audit** of story/narrative,
  then the fable **beat redesign** (fresh sessions; the redesign = the first
  real ADR-139 bundle, reviewed in the new Story surfaces).

(Live lists: `project/human-in-the-loop/review.md` + `project/todo-human.md`.)

## Deferred / owed tail (engineering — not blocking the deploy)

**R7 capstone side-quests** → T1 (`capstone-t0-branch.md`) · **status-token
ladder** → T1–T5 · home grows w/ rung · NPC placement (FB-113) · balance feel-tune
· `emergent-node-actions` (Phase 0).

## Toolchain

Vite 5 + TS (strict, `tsgo`) + Vitest 2 + oxlint + oxfmt. Pure-core oxlint
boundary (no Math.random/pow/DOM/Date.now in `src/core`). `npm run verify` runs
in parallel via `verify-run.ts` (roster: [`gates.ts`](../../src/scripts/gates.ts)):
<!-- gen:begin gate-roster (npm run checkpoint — do not edit inside) -->
**17 gates**: tsgo, oxlint, oxfmt, vitest, verify-content, verify-prd,
gen-docs, fixtures, gen-narrative, gen-prd-regions, pacing, playcheck,
md-links, milestone-integrity, verify-changelog, doc-budgets, checkpoint.
<!-- gen:end gate-roster -->
**`pre-commit`** runs `verify` + reading-queue/journal/snapshot gates; **`pre-push`**
blocks red. **HMR OFF** (`vite.config.ts`) — FB-5. `npm run dev` · `build` · `build:itch`.

## Code & repo layout

- `src/core` — pure (rng, state, intents/reduce, step/tick, unlock/rewards/log,
  skills, ranks, combat, fight, ascension, pillars, selectors, format, `content/*`
  incl. `rungBeats.ts`/`people.ts`) · `src/persistence` (save layer, SCHEMA 6) ·
  `src/ui` (render.ts + reconcile.ts + styles.css) · `src/app/main.ts` (composition
  root + `window.__qa`) · `src/scripts/*`. ADR ledger: `docs/living/decisions.md`.
- **3 top-level dirs:** `docs/` (truth) · `project/` (agentic process) · `src/` (code).

## How to resume

> 🎮 **v0.3.7 pushed 2026-07-05 via `/ship`** (tooling-only refresh — FB-10 taste +
> /ship v2 + FB-8 plan lock; nothing player-facing; gh-pages `f4697b5` ← `b1b3403`,
> not live-verified). On `origin/main` (green), live at raynos.github.io/kami-kakushi; ADRs **ADR-107–ADR-125**.
> Open = the human queue above; the deferred tail (R7-capstone once **T1**) is next.

1. Read the **newest journal** (then skim prior sessions) + `todo-human.md` for forks:
   <!-- gen:begin resume-journal (npm run checkpoint — do not edit inside) -->
   [`journal/2026-07-06-session-94-hd23-hd24.md`](../journal/2026-07-06-session-94-hd23-hd24.md)
   <!-- gen:end resume-journal -->
2. `npm install` → `npm run verify` (green) → `npm run dev` (→ localhost:5173).
   Use **`?dev=no`** for the true player layout. FB-5 to reload (HMR off).
3. Drive **headless-only** (hook-enforced — NEVER open a headed browser, incl. from
   subagents): `window.__qa` or `node src/scripts/qa-shots.mjs`. `newGame()` to reset.
4. **Next autonomous work** — the FB-1–FB-10 wave is DONE; next: **requirements
   rung progression** (`fable-2026-07-05-requirements-rung-progression.md`,
   ADR-137, human phase-confirm pending) or **UI-v2 Andon Steel migration**
   (needs the human's lock). Phase-2 economy redesign = human-parked in
   `project/BACKLOG.md`, don't pick up unprompted. Balance liquid (ADR-059) —
   every change runs ADR-132 (`verify:balance` → report diff → `--summary`).
5. **Shared tree:** stage only your own files by explicit pathspec commit.
