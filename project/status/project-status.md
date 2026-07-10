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
is the story-bible canon** as of **v0.4.0** — the storywave T0 rewrite is live.
Canon = [`docs/story-bible/`](../../docs/story-bible/README.md): **SEVEN tiers**
(Estate-household · Estate-land · Valley · Region · Castle-town · Domain · Edo),
time-skips, the ruin/guest-house twist, the succession knot. **T0 is BUILT &
shipped; T1+ are specced, not built** ([`prd.md`](../../docs/living/prd.md)). No
magic; no reset.

## Where we are now

- **✅ STORYWAVE CLOSURE DONE (s134, 2026-07-10):** every post-ship-review finding
  fixed or human-ruled — ADR-166 (Autumn refuses) · ADR-167 (the full fiction
  wave; HR-18…HR-21 review LIVE in DEV → Story) · six-step grades · the idler
  repaired. Finding→commit map: the review report's addendum. Plan archived.
- **✅ PRD TRUTH-SYNC DONE (s136) & VERIFIED (s141):** freeze CANCELLED
  (ADR-168/169); §1–§7 speak the shipped game. s141 sweep (~110 claims vs
  src/): 7 doc residues fixed; its canon breach closed s153 (HD-36 → ADR-175,
  HR-25). T2 reputation WEB beats the bible's single track (ADR-169; T2 plan
  owes reconciliation).
- **✅ STORYWAVE SHIPPED v0.4.0 (s125–131):** the bible-canon T0 rewrite is LIVE on
  gh-pages (tag `v0.4.0`); all three storywave plans archived.
- **✅ HD-35 RULED & APPLIED (s144, ADR-172):** R3/Phase-2 re-paced — R3 20.0
  [19.0–20.3] min ∈ [3,22] (XP_K 5→20, COOK_HP 14→35), deed base 0.22→0.6 keeps
  the ADR-133 ratio at [0.95–0.97]; the ADR-148-interim scope DELETED — full
  R0–R6 band verdicts + the R7 ratio gate are the live `verify:balance` teeth.
  Greedy T0 ≈ 2.5 h sim wall. Combat curve R4+ kills still parked.
- **✅ COLD-OPEN REARC DONE (s143, HD-37 → ADR-173):** three acts live
  (memory→soan→genemon, three picks, reworked title card); both diverge units
  picked into canon — **HR-22/HR-23** review live (DEV → Story, incl. the new
  title-card swap). Plan archived.
- **🧊 PARKED:** Plan K authored-depth demo (`docs/plans/t1/`; prototypes ⭐
  `project/prototypes/authored-depth-demo/`) + the T1 emergent-node plan
  (`docs/plans/t1/`). Un-park = human.
- **✅ THE BIBLE — DONE & BLESSED (s109–116, ADR-150):** 7 tier sheets · full cast ·
  register-rules law · THE FALL. The human signed off the whole read (s116).
- **✅ UI-v2 Andon Steel SHIPPED + PH5-CERTIFIED (s98):** the steel palette
  (ADR-144); `taste.md` 21-principle lock (ADR-126) + the FB-10 two-pass flow.
- **✅ MAPS PLAYER-BOUND (s112–119):** T0/T1 sheets = the player map (HR-12 ✅, golden
  pin, blind-pass); T2 valley sheet BUILT (`?t2-map-demo`) — **NOT DONE: T2
  rungs/fog (§6.1).**
- **✅ PHASE-2 ECONOMY (ADR-145):** the A+B deed-source loop; FB-121 rungs (hidden
  lists + %-bar, points meter dead). **✅ TIMED ACTIONS (ADR-148):** ActionClock.

## Waiting on the human

- **HR-1** 🔲 — play/review the full T0 arc for fun & pacing (the LOOK is UI-v2
  certified; this is the fun/taste call on the live storywave build).
- **HR-18…HR-21 + HR-25** 🔲 — the fiction-wave picks (overlays · discoveries ·
  judge lines · node reads) + the R7 lord-unstaged lines (HD-36 → ADR-175), all
  reviewed LIVE via DEV → Story. *(HD-33…36 closed 2026-07-10; none open.)*
- **DEV-variant picks** 🔲 — kept live for a detailed pass: home (HR-6) ·
  bestiary (HR-5) · the HR-2 bundle · map travel presence (HR-26 — walk a zone
  edge; silence ships A). Picks → the agent strips the alternates.
  *(HR-9/HR-11 closed INTERIM 2026-07-10 — they retire with the ADR-177 redesign.)*

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
  skills, ranks, combat, ascension, pillars, selectors, `content/*` incl.
  `narrative/`, `scenes`, seasons) · `src/persistence` (save layer, SCHEMA 10,
  clean-break) · `src/ui` (render.ts + dev.ts) · `src/app/main.ts` (root +
  `window.__qa`) · `src/scripts/*`. ADR ledger: `docs/living/decisions.md`.
- **3 top-level dirs:** `docs/` (truth) · `project/` (process) · `src/` (code).

## How to resume

> 🎮 **v0.4.0 "the storywave release" shipped 2026-07-09 via `/ship`** — the
> bible-canon T0 rewrite, live at raynos.github.io/kami-kakushi (s133–s135 ✅).

1. Read the **newest journal** (then skim prior) + `todo-human.md` for forks:
   <!-- gen:begin resume-journal (pnpm run checkpoint — do not edit inside) -->
   [`journal/2026-07-10-session-165-fix-brief-lane-status.md`](../journal/2026-07-10-session-165-fix-brief-lane-status.md)
   <!-- gen:end resume-journal -->
2. `pnpm install` → `pnpm run verify` (green) → `pnpm run dev` (→ localhost:5173).
   Use **`?dev=no`** for the true player layout. The page NEVER auto-reloads
   (FB-257) — hit F5 yourself to pick up new code.
3. Drive **headless-only** (hook-enforced): `window.__qa` / `node src/scripts/qa-shots.mjs`.
4. **Next (autonomous):** the **estate redesign** is DIRECTION LOCKED (ADR-177,
   `docs/plans/fable-2026-07-10-estate-upgrades-redesign.md`) — Phase 1
   (fiction diverge) startable; or **T2 rungs/fog** (plan ready + greenlit:
   `docs/plans/t2/opus-2026-07-09-t2-rungs-fog.md`; S1 caveat: `T2_RUNG_LADDER`
   is DEV-preview-only); or drain the fresh `diverge` inbox bucket (ADR-171
   claim first; all older lanes archived, s164). Human-gated: HR-1 + HR-18…25
   + the body-split plan Phase-0 (reading queue). Combat R4+ → inbox.
5. **Shared tree:** stage only your own files by explicit pathspec commit.

<!-- rewrite-debt: 22/20 — REWRITE OWED (deferred: co-agent WIP in flight) · last full rewrite: 2026-07-09 -->
