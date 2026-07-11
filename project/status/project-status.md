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

- **✅ PROGRESSION = ONE MODEL, ALL TIERS (s180, ADR-182/183):** the flat-points
  rung-meter (threshold table, AND-gate with story flags) is **DEAD at every
  tier**, not just T0 — a rung promotes when its **authored objective-requirement
  list** is 100% done. PRD (6 sections) + roadmap + t1/t2-content rewritten;
  `prd-drift` RETIRES the dead vocabulary (proven RED-able). **ADR-183:** every
  T1+ rung's list must hold ≥1 requirement from EACH track — **canon, no teeth
  yet** (no track field in code; the check ships with T1 authoring).
- **✅ ESTATE REDESIGN — ALL PHASES DONE (s168, ADR-177):** works discovery chain
  (**HR-27**) · Schedule A one-tab-per-rung + Works 普請/Estate 家 diverges
  (**HR-29/HR-30**) · repair verbs + inputs. Plan archived.
- **✅ FOG/REVEAL WAVE (s171):** live-map fog covers the window; the T0 sheet
  CLIPS (no T1 leak); ONE viewer engine for DEV sheets + live map; no zone
  predates its introduction (the always-open set is EMPTY).
- **✅ BODY SPLIT (s167, ADR-178):** Body 体 (work fuel) + Belly 腹 (food store;
  teeth = rest quality) — core + two-bar UI + PRD §2.3; verdict Δ≈0.
- **✅ v0.4.0 STORYWAVE SHIPPED & CLOSED (s125–144):** bible-canon T0 rewrite live
  on gh-pages (tag `v0.4.0`); post-ship review closed (ADR-166/167); PRD
  truth-synced, freeze CANCELLED (ADR-168/169); cold open re-arced (ADR-173);
  HD-35 re-pace ruled (ADR-172 — R3 ≈20 min; the R0–R6 bands + R7 ratio gate are
  the live `verify:balance` teeth; greedy T0 ≈ 2.5 h sim). Combat R4+ kills
  parked (inbox).
- **✅ FOUNDATIONS:** bible blessed (s116, ADR-150) · UI-v2 Andon Steel + the
  taste.md 21-principle lock (ADR-144/126) · T0/T1 map sheets = the player map
  (golden pin, blind-pass); T2 valley sheet BUILT (`?t2-map-demo`) — **NOT DONE:
  T2 rungs/fog** · Phase-2 economy (ADR-145) · timed actions (ADR-148).
- **🧊 PARKED:** Plan K authored-depth demo + the T1 emergent-node plan (both
  `docs/plans/t1/`). Un-park = human.

## Waiting on the human

- **HR-1** 🔲 — play/review the full T0 arc for fun & pacing (the LOOK is UI-v2
  certified; this is the fun/taste call on the live storywave build).
- **Story picks (DEV → Story)** 🔲 — HR-18…HR-21 (overlays · discoveries ·
  judge lines · node reads) + **HR-27** (the works discovery chain, incl. the
  R2-silence note) + **HR-28** (the three intro scene heads, FB-362).
- **DEV-variant picks (ADR-075)** 🔲 — home (HR-6) · bestiary (HR-5) · HR-2A–D
  (market · influence · craft · quests) · works (HR-29) · estate (HR-30). Picks
  → the agent strips the alternates.

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
   [`journal/2026-07-11-session-180-prd-requirements-rewrite.md`](../journal/2026-07-11-session-180-prd-requirements-rewrite.md)
   <!-- gen:end resume-journal -->
2. `pnpm install` → `pnpm run verify` (green) → reuse the shared dev server on
   localhost:5173 (never spawn/kill your own). **`?dev=no`** for the true
   player layout. The page NEVER auto-reloads (FB-257) — F5 to pick up code.
3. Drive **headless-only** (hook-enforced): `window.__qa` / `node src/scripts/qa-shots.mjs`.
4. **Next (autonomous):** **zone-reveal law** — 🔒 LOCKED 2026-07-12
   (`docs/plans/fable-2026-07-11-zone-rung-rebalance.md`): *a zone opens only
   in a VN; a rung-up VN opens ≤2*. Stages 0–2 (ADR + ≤2 gate · derived
   `seenReveals` re-arm · rewire `ranks.ts`) are cheap; Stage 3 is the five-VN
   wave and nothing ships until it lands. Adds no save field, by design. Or
   **save-format streamline** (audited s175, human
   wants src-as-truth: `docs/plans/fable-2026-07-11-save-format-streamline.md`
   — steps 2–5 small, step 1 = per-emitter log-descriptor commits); or **T2
   rungs/fog** (greenlit: `docs/plans/t2/opus-2026-07-09-t2-rungs-fog.md`; S1
   caveat: `T2_RUNG_LADDER` is DEV-preview-only); or **telemetry distillation**
   (6 usable FB-8 reports newer than the last balance commit — read + commit
   the pacing note before any balance work); or drain the playtest inbox when
   captures land (ADR-171 — claim a lane first). Human-gated: HR-1 + the
   story/variant picks above + **HD-38** (the T0 narrative register ruling
   D1–D4 — unblocks `docs/plans/fable-2026-07-11-t0-narrative-revoice.md`,
   the audited-worst-first T0 re-voice; audit: s176).
5. **Shared tree:** stage only your own files by explicit pathspec commit.

<!-- rewrite-debt: 9/20 · last full rewrite: 2026-07-11 -->
