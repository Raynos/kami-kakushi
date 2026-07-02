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
- **v0.3.2 — BUILT (Plan B, session-40; `origin/main`, green).** Closed the build-behind
  gap to the reconciled PRD — **all of §A (A1–A10) + §C**: 5-attr accuracy/evasion combat,
  yari, estate E→U, HUNT/CLEAR/DEFEND quests, Bestiary (R5), interior reveals, gen-docs.
- **PLAYTEST UI OVERHAUL — 3 rounds, F1–F115 (2026-07-02; on `main`, green).** Live
  human-steered playtest (`human-feedback/2026-07-02-playtest.md`). **R1+R2 (F1–F85, sessions
  42/44):** app-shell overhaul · append-only **VN intro** (D-104, no flash, typewrite, dialogue
  tree, attribute-colour perks) · **log v2** (Story·Progress·Combat·Work·All·Now) · **multi-panel
  LOCKED** to 屏風 + soft cards (D-106) · **1780 cold-open** (D-105). ADRs D-104/105/106.
- **v0.3.3 — round-3 quick wins SHIPPED (session-45; `origin/main`, green).** F86–F115
  captured; the reachable subset shipped (`06ec6f3`…`ed27169`): intro auto-advance +
  gray-asked-topics + NPC prefix + flicker-free reconcile (F86–F90) · byōbu Work-fold fix +
  estate-upgrade→Estate tab (F94/F100) · DEV New-Game backup/restore (F95/F96/F101) ·
  pure-core flavor voice (F91/F93) · **v0.3.3** + top-level `CHANGELOG.md` (F104/F105).
  **3 big rocks planned, NOT built** (scope-call → `todo-human.md`): append-only
  rendering-engine, rung-up story beats (F97/99/103), home/belongings. The render/design
  queue funnels through `render.ts` (serial) — held behind the economy ripple.
- **Operating philosophy:** the **R1–R6 register** (no-clock · verify-don't-trust · done-is-
  earned · bias-to-motion · if-it-isn't-fun · reachable) → [`../../docs/philosophy/`](../../docs/philosophy/README.md), in AGENTS.md.
- **Process canon:** v0.3 retro — **D-086** (tension>generosity) · **D-087** (loop done-rule)
  · **D-088** (e2e+invariants/tier DoD) · **D-089** (implicit queue sign-off).
- **Deferred to T1:** the §4 6-tier balance re-derivation (D-092) + material-sink (H11 WAI,
  D-095) — T1 balance decoupled from T0, best derived with T1 + playtest data (D-059).

## Waiting on the human

- **REVIEW PASSOVER** 🔲 — the big one: play/review the **playtest reshape** (F1–F115) —
  the append-only VN intro + dialogue tree, log v2, the LOCKED multi-panel (byōbu + soft
  cards), density + log-font, 1780 cold-open, + the v0.3.3 round-3 quick wins.
- **3 design scope-calls** 🔲 — the append-only rendering engine, rung-up story beats, and
  home/belongings docs await your go/no-go (`todo-human.md` reading queue).
- **R1** 🔲 — play/taste call on the **T0 build** (fun · pacing · look): spatial map,
  combat rework (HP accrues, no auto-heal, loss bites wealth), the bank, tightened koku.
- **R2** 🔲 — remaining UI variants **live in the DEV panel** (D-075), incl. Estate-map
  A/B/C + the other playtest surfaces (multi-panel is now locked, not a variant).
- **UI-v2 gallery** 🔲 — `prototype/index.html`: 7 diegetic framings (session-46) →
  pick one → `diverge` (D-075); verdicts: `brainstorms/2026-07-02-ui-v2-fable-session.md`. ⚠️ commit local-only — push `main` when green.

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

> 🎮 **Round-3 quick wins SHIPPED → v0.3.3 (2026-07-02).** F1–F115 captured; F1–F85 +
> the round-3 subset are built + on `origin/main` (green). **NEXT BUILD = economy Phase 1**
> (concurrent worker, plan verified GO this session). The render/design queue + the 3 new
> design docs wait behind it. **Awaits the human's REVIEW PASSOVER + 3 scope-calls.**

1. Read the **newest journals** (session-42/44 = F1–F85, **session-45 = F86–F115**) + the
   feedback doc. **Note: HMR is OFF** (`vite.config.ts`) — hit F5 to see dev changes.
2. `npm install` → `npm run verify` (green) → `npm run dev` (→ http://localhost:5173/).
   Use **`?dev=no`** to preview the true player layout (no DEV panel).
3. Drive **headless-only** (hook-enforced — NEVER open a headed browser, incl. from
   subagents): `window.__qa` or `node src/scripts/qa-shots.mjs`. `newGame()` to see the
   real opening.
4. **koku RE-CORE is the active build** (concurrent worker): koku=standing · coin
   mon→monme→ryō=money · rice=resource (D-107/108/109). Plan A ripple **done** (archived);
   **Plan B Phase 1** (pure-core koku→coin + rice + v4→v5 migration) verified GO, next.
   **No parallel builds during the ripple**; the render/design queue funnels through
   `render.ts` (serial), so it's held until the economy lands.
5. **Open for the human:** **REVIEW PASSOVER** · the **3 design scope-calls** · **R1**
   (fun/pacing) · **R2** (DEV variants) · **R5** (Bestiary).
