---
name: project-status
description: Live one-screen snapshot — current state + how to resume
metadata:
  type: project
---

# Project status

> **This file is a SNAPSHOT, not a log. REPLACE in place — do NOT append.** Keep
> it to one screen (~a `pre-commit` cap enforces it). The lossless "how it got
> here" record is [`../journal/`](../journal) — so deleting stale state here is
> correct, never a loss. **No dated "Phase update — (session-NN)" bullets** — those
> are journal entries; if you're tempted to add one, you're writing the wrong file.

## The game

A grounded, story-driven **incremental RPG** in mid-Edo (~18th c., fictional) rural
Japan. A mediocre ~18yo (true name **Tahei**) wakes amnesiac on a declining
lower-samurai (*goshi*) estate (the **Kurosawa** house) and rises through **6 tiers**
(T0 Estate-tutorial · T1 Estate-full · T2 Village · T3 Region · T4 Castle-town ·
T5 Edo), growing **House Influence** (4 pillars; one per tier). **v1 scope = T0→T3.**
Signature: **the UI itself unlocks incrementally.** No magic; growth only through
perseverance; no reset. Spec: [`../../docs/living/prd.md`](../../docs/living/prd.md).

## Where we are now

- **PRD: V2.3** — the 6-tier reshape (ADRs D-048–D-069 + 5 forks) is fully rippled
  into the body. `prd.md` is a stub index → the spec lives in per-section files
  `docs/living/prd/01-vision.md … 07-roadmap-scope.md`. §4 balance numbers + §7
  M2–M7 detail stay **provisional** (D-021/D-059, liquid — tuned by playtest).
- **v0.3 shipped** — the **T0 M0–M4 arc** plays end-to-end, the macro spine **closes**
  (`t0-arc.test.ts`), a11y-100, twice-audited. Site: <https://raynos.github.io/kami-kakushi/>.
- **v0.3.1 — BUILT + audited** (green): DEV-panel + variants (D-075) · combat rework +
  **bank** + auto-modes · koku tightening (D-092) · **SPATIAL MAP** (D-093) · 11th gate (D-054).
- **v0.3.2 — BUILT (Plan B, session-40; on `origin/main`, all green).** Closed the
  build-behind gap so the build matches the reconciled PRD — **all of §A (A1–A10) + §C**,
  each a verified/pushed commit (`8e5cb52`…`3084872`): the PRD **5-attr + accuracy/evasion
  combat model** + glass-cannon/tank stances (A1/A2) · crafted **yari** (A3) · estate
  **E→U** rename (A4) · **HUNT/CLEAR/DEFEND** quests (A6) · staggered combat reveals + a
  **Bestiary** (A7, D-075 diverge → **R5**) · interior-house reveals (A8) · richer mob
  roster — rats/viper/troop (A9) · **bandit gated to T2** (A10) · gen-docs completeness (C).
  Balance magnitudes **liquid** (D-059) — for playtest. Plan (archived):
  [`../archive/2026-07-01-v0.3.2-build-close-the-gap.md`](../archive/2026-07-01-v0.3.2-build-close-the-gap.md).
- **v0.3.2 PLAYTEST UI OVERHAUL — IN PROGRESS (2026-07-02, session-41).** A live
  human-steered playtest → 16 taste items (F1–F16, in
  `human-feedback/2026-07-02-playtest.md`). **F1–F10, F14, F16, F9 shipped** (app-shell:
  ink ground · ~1200px centered column · fixed header/footer · 100dvh no-page-scroll ·
  log-RIGHT · smooth scroll · compact pass; cold-open slow reveal + D-075 variants;
  DEV-panel Settings/Variants restructure). Settled rules **graduated to ui-design.md**
  (§4.7/§4.8). Autonomous run building the rest — plan:
  [`../../docs/plans/2026-07-02-playtest-polish-build.md`](../../docs/plans/2026-07-02-playtest-polish-build.md).
  **Still to build:** F12 typewriter · F13 interactive intro (wants human input) ·
  F11 multi-panel · F15 (folded into the intro cluster).
- **Operating philosophy:** the **R1–R6 register** (no-clock · verify-don't-trust ·
  done-is-earned · bias-to-motion · if-it-isn't-fun · if-a-player-can't-reach-it) lives
  in [`../../docs/philosophy/`](../../docs/philosophy/README.md), summarised in AGENTS.md.
- **Process canon (2026-06-30):** v0.3 retro adopted — **D-086** (tension>generosity) · **D-087**
  (loop done-rule) · **D-088** (e2e+invariants/tier = hard DoD) · **D-089** (implicit queue sign-off).
- **Deferred to T1:** the §4 6-tier balance re-derivation (D-092) + the material-sink
  (H11 closed WAI, D-095) — T1-tier balance decoupled from T0, best derived with T1 +
  playtest data (liquid/D-059).

## Waiting on the human

- **R1** 🔲 — play/taste call on the **T0 build** (fun · pacing · look): the spatial map,
  the combat rework (HP accrues, no auto-heal, the loss bites wealth), the bank, tightened koku.
- **R2** 🔲 — review the UI variants **live in the DEV panel** (D-075) — now incl. the **Estate-map**
  A/B/C (paths list · 絵地図 schematic · 道中記 ledger).
- **Reading queue:** the **2026-07-02 playtest-polish build plan** is live
  (`docs/plans/`). (Plans A + B — DONE + archived.)

(Live lists: `project/human-in-the-loop/review.md` + `project/todo-human.md`.)

## Toolchain

Vite 5 + TS (strict) + Vitest 2 + ESLint 9 (flat) + Prettier. Pure-core ESLint
boundary (no Math.random/pow/DOM/Date.now in `src/core`). `npm run verify` = **11
gates** (tsc, eslint, prettier, vitest, verify-content, verify-prd, gen:docs --check,
pacing:check, playcheck:check, md-links, milestone-integrity) run **in parallel** via `src/scripts/verify-run.ts`
(well under the 5s drift budget — `npm run verify:budget` checks it; don't hard-code a figure). **`.githooks/pre-commit`**
runs full `verify` + a non-blocking drift timer + the reading-queue/journal/snapshot
gates; **`.githooks/pre-push`** runs `verify` on every push and **blocks on red**
(`SKIP_VERIFY=1` overrides). `npm run dev` · `npm run build` (→ `dist/`, itch-ready)
· `npm run build:itch` (zip). Enable hooks once per clone:
`git config core.hooksPath .githooks`.

## Code & repo layout

- `src/core` — pure (rng, state, intents/reduce, step/tick, unlock/rewards/log,
  skills, ranks, combat, fight, ascension, pillars, selectors, format, `content/*`)
  · `src/persistence` (save layer) · `src/ui` (render.ts + styles.css) ·
  `src/app/main.ts` (composition root + `window.__qa`) · `src/index.html` (web entry,
  Vite `root: 'src'` → repo-root `dist/`) · `src/scripts/*` (verify/gen/QA/dev scripts).
- **3 content top-level dirs:** `docs/` (current truth — `living/` design docs,
  `content/` generated tables) · `project/` (agentic process: `status/` [this file],
  `journal/`, `brainstorms/`, `human-feedback/`, `human-in-the-loop/`, `audit/`,
  `archive/`) · `src/` (game code + web entry + dev/QA scripts). ADR ledger:
  `docs/living/decisions.md`.

## How to resume

> 🎮 **v0.3.2 PLAYTEST is LIVE with the human (2026-07-02).** They play → give taste
> feedback (F-items in `human-feedback/2026-07-02-playtest.md`) → I fix inline / build
> with D-075 variants. The human stepped away mid-session and asked me to **keep building
> autonomously**; the plan `docs/plans/2026-07-02-playtest-polish-build.md` is the spine.

1. Read the **newest journal** (session-41) + the feedback doc's status column
   (✅ vs 🔧 vs 💬) + the plan's build order.
2. `npm install` → `npm run verify` (green) → `npm run dev` (→ http://localhost:5173/).
   Use **`?dev=no`** to preview the true player layout (no DEV panel).
3. Drive **headless-only** (hook-enforced — NEVER open a headed browser, incl. from
   subagents): `window.__qa` or `node src/scripts/qa-shots.mjs`. `newGame()` to see the
   real opening (a stale autorun save may load).
4. **Continue the build** top-down through the plan (F9 → intro cluster F12/F13/F15 →
   F11). Serialize code builds on the single `styles.css`/`render.ts`/`dev.ts`.
5. **Open for the human:** **R1** (fun/pacing/look) · **R2** (UI variants — now incl. the
   **cold-open reveal** A/B/C) · **R5** (Bestiary). They'll lock variants + I prune the
   dead code. **Also queued:** the **1780 setting anchor** plan (ADR **D-105**) — awaits a
   read + confirming its two forks (Tenmei famine / calendar); then the small doc ripple lands.
