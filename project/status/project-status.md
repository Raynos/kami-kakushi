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
  gap to the reconciled PRD — **all of §A (A1–A10) + §C** (`8e5cb52`…`3084872`): PRD
  **5-attr + accuracy/evasion combat** + glass-cannon/tank (A1/A2) · **yari** (A3) · estate
  **E→U** rename (A4) · **HUNT/CLEAR/DEFEND** quests (A6) · combat reveals + **Bestiary**
  (A7, R5) · interior reveals (A8) · richer mobs (A9) · **bandit→T2** (A10) · gen-docs (C).
- **v0.3.2 PLAYTEST UI OVERHAUL — DONE (2026-07-02; on `main`, green).** Two rounds of a
  live human-steered playtest → **F1–F85, ALL built** (`human-feedback/2026-07-02-playtest.md`).
  **R1 (F1–F61, session-42):** app-shell overhaul (dark-ink · centered col · fixed header/
  footer · 100dvh · log-RIGHT · `?dev=no`) · full-screen **VN intro** (D-104) · **log v2**
  (Story·Progress·Combat·Work·All·Now) · DEV-panel polish · **F22** stamina/health · error
  modal. **R2 (F62–F85, session-44):** VN intro **rebuilt append-only** (no flash; all text
  typewrites; fixed card sticks-to-bottom; static right; ask→done→decide; choose→reply→
  Continue; **attribute-colour** perks) · **multi-panel LOCKED** to 屏風 folding + soft cards
  (variants pruned, D-106); log full-width/sticky/≥⅓vw · pedlar in-flow · **DEV rung menu**
  R0–R7+descend · **1780 cold-open** (D-105) · **two density registers** + persisted
  **log-font stepper** · HMR off. ADRs **D-104/D-105/D-106**; taste rules → ui-design.md;
  5 plans archived. **Awaits the human's REVIEW PASSOVER.**
- **Operating philosophy:** the **R1–R6 register** (no-clock · verify-don't-trust ·
  done-is-earned · bias-to-motion · if-it-isn't-fun · if-a-player-can't-reach-it) lives
  in [`../../docs/philosophy/`](../../docs/philosophy/README.md), summarised in AGENTS.md.
- **Process canon (2026-06-30):** v0.3 retro adopted — **D-086** (tension>generosity) · **D-087**
  (loop done-rule) · **D-088** (e2e+invariants/tier = hard DoD) · **D-089** (implicit queue sign-off).
- **Deferred to T1:** the §4 6-tier balance re-derivation (D-092) + the material-sink
  (H11 closed WAI, D-095) — T1-tier balance decoupled from T0, best derived with T1 +
  playtest data (liquid/D-059).

## Waiting on the human

- **REVIEW PASSOVER** 🔲 — the big one: play/review the **v0.3.2 playtest reshape**
  (F1–F85) — the append-only VN intro + dialogue tree, log v2, the LOCKED multi-panel
  (byōbu + soft cards), density + log-font, 1780 cold-open.
- **R1** 🔲 — play/taste call on the **T0 build** (fun · pacing · look): spatial map,
  combat rework (HP accrues, no auto-heal, loss bites wealth), the bank, tightened koku.
- **R2** 🔲 — remaining UI variants **live in the DEV panel** (D-075), incl. Estate-map
  A/B/C + the other playtest surfaces (multi-panel is now locked, not a variant).

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

> 🎮 **v0.3.2 PLAYTEST BUILD is DONE (2026-07-02).** All 85 feedback items (F1–F85 in
> `human-feedback/2026-07-02-playtest.md`) are built + committed (green). R2 = the
> append-only VN intro, the LOCKED multi-panel (byōbu + soft cards), density + log-font,
> 1780 cold-open. It now **awaits the human's REVIEW PASSOVER**.

1. Read the **newest journals** (session-42 = F1–F61, session-44 = F62–F85) + the feedback
   doc for the arc. **Note: HMR is OFF** (`vite.config.ts`) — hit F5 to see dev changes.
2. `npm install` → `npm run verify` (green) → `npm run dev` (→ http://localhost:5173/).
   Use **`?dev=no`** to preview the true player layout (no DEV panel).
3. Drive **headless-only** (hook-enforced — NEVER open a headed browser, incl. from
   subagents): `window.__qa` or `node src/scripts/qa-shots.mjs`. `newGame()` to see the
   real opening (a stale autorun save may load).
4. **After the human's review:** apply round-3 feedback in the same inline loop; perk
   magnitudes + dialogue-topic content stay liquid (D-059). The multi-panel is LOCKED
   (variants pruned) — no dead-code left to prune there.
5. **Open for the human:** the **REVIEW PASSOVER** (above) · **R1** (fun/pacing) ·
   **R2** (DEV variants) · **R5** (Bestiary). **koku RE-CORE** (concurrent worker): decided +
   PRD-rippled — koku=standing · coin mon→monme→ryō=money · rice=resource; ADRs **D-107/108/109**; Plan A ripple **done** (archived), **Plan B** (T0 code build) unblocked, not built.
