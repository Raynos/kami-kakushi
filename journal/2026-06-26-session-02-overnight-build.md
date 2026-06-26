# Session 02 — 2026-06-26 (overnight) — PRD V2.2 + M0/M1/M2 build

## ☀️ SUMMARY (read this first)

The **autonomous overnight build session.** Goal (human-signed `/goal`): take the PRD from V2.1 → **V2.2**
(apply all of Block N + N.1 to `docs/prd.md`, with auto review/audit/fix), then **execute the roadmap** —
build **M0 + M1 + M2a + M2b** — and deliver a **playable, fun, polished, itch-ready demo** for the morning.
No human at the keyboard; work alone.

**Live state:** `memory/project-status.md`. This file is the chronological log (append at the BOTTOM).

---

## 1 · PRD V2.2 — applying Block N (in flight via Workflow `wf_c01fa208-7d1`)

A Workflow weaves all 32 Block N decisions + 7 Block N.1 defaults into `docs/prd.md` as **6 serial
section-scoped clusters** (§6 → §4 → §2 → §3 → §1/§5 → §7; serial because it's one 7k-line file, no write
races) + **parallel sibling-doc** edits (new ADRs D-044 crash-recovery / D-045 a11y-ink in `decisions.md`;
the a11y update in `ui-design.md`). Each agent makes surgical edits + returns a structured report. After it
lands: snapshot, audit pass, commit V2.2.

## 2 · Toolchain scaffold (verify-green) — DONE

Vite 5 + TS (strict + noUncheckedIndexedAccess/exactOptionalPropertyTypes) + Vitest 2 + ESLint 9 (flat) +
Prettier. The **pure-core ESLint boundary** is live: `src/core/**` bans `Math.random`, `Math.pow`/exp/log/trig
(integer-pow only; `sqrt` whitelisted), DOM/window/`Date.now`/`indexedDB`, and imports from ui/app/persistence.
`npm run verify` = tsc + eslint + prettier + vitest + verify-content + `gen:docs --check`. Production build:
~15 KB JS (6 KB gz) + 7 KB CSS — itch-ready.

## 3 · M0 — DONE, verify-green (34 tests)

- **core/** the one seeded RNG (splitmix64 via BigInt, cursors = JSON-safe draw-count integers — exact 53-bit;
  per-stream combat/loot/seasonal/worldgen + stateless `deriveDayKeyed` weather/lunar). `reduce`/`tick`
  (tick folds one tick at a time → `tick(s,a+b)===tick(tick(s,a),b)` asserted). The reveal engine
  (surfaces registry + write-once `unlocked` latch + rewards bus + ring-buffer event log). Selectors
  (satietyMax/hpMax/season/year/lunar/staminaRate, all derived). K/M/B formatter (table-tested).
- **persistence/** the FULL multi-backend redundant save (IndexedDB + localStorage + sessionStorage, atomic
  redundant write, app-identity magic field, monotonic save-counter newest-wins + timestamp tiebreaker,
  additive schema + migration chain, base64 export/import, **crash-recovery ring + crash-counter + safe-mode
  rollback + poison-suppression** — D-044, load-validation D-Q9). All injected/testable.
- **ui/** the woodblock/ink renderer (washi paper + feTurbulence grain, sumi key-block frames, the event-log
  hero, K/M/B tabular vitals, reveal ink-in, reduced-motion-safe) + the **cold open** (wake → ground the
  folklore via physician Ryōan → first dream-fragment ZERO bonus → rake rice → rest).
- **app/** composition root: active-only tick loop scaffold, crash boundary (D-044), debounced + interval
  autosave-to-all-backends + on-hide, the DEV `window.__qa` play API.
- **NPC names** centralised in `core/content/names.ts` (renamed the Yagyū echo Munenori→Sadayori,
  Jūbei→Tsuneoka, and Edogawa echo Ranpo→Ryōan per Block N D-Q-name-collision / N.1 #3 — to RECONCILE with the
  workflow's chosen names once it lands).

## 3b · NEXT (this session, continuing)

- M1 — T0 Phase-1 labour spine (R0→R2 rung-meter, skills, world-clock/seasons, soft stamina, first nav reveal).
- M2a/M2b — combat (auto-resolve + analytic win-rate; bestiary/equipment/durability/loot→craft).
- Reconcile `names.ts` with the workflow's renames; commit V2.2 (docs) → M0 → M1 → M2.
- Full QA + visual polish pass (headless drive + screenshot review vs `ui-design.md`); itch packaging.

---

## 4 · M2 (a+b) — combat — DONE, verify-green (50 tests) + headless visual QA

A complete combat slice, the demo's emotional spike:
- **core/combat.ts** — derived MC stats (level + weapon × durability band × satiety throttle);
  mob stats from `MobDef.level` (same curve family, Block N.1 #1); the **ANALYTIC closed-form
  win-rate** (race-to-kill, no sampling — D-Q-winrate): fresh-MC-vs-wolf = **30.6%**, in the LOCKED
  20–35% band; trained (Lv3) ~96%; the seeded auto-resolve sim (byte-identical replay).
- **core/fight.ts** — win → combat-XP (→ character level, heals+offers the axe at Lv2) + koku;
  **loss = soft, self-recovering setback** (limp to safety + forced rest, never lose level/gear/XP —
  §4.6.6 LOCKED, no death-spiral). The **scripted grain-store wolf** = the humbling guaranteed-survival
  beat that opens R3.
- **Combat tab** (3rd nav reveal, 武) — combat rank + XP, equipped weapon + **graded durability band**
  + repair (wood sink), equip the woodlot **axe** (2nd weapon at Lv2), the foe list with **forecasts**
  (good/fair/risky) + Fight + auto-fight ("leave it running"). Bestiary fills by encounter.
- A **rank-up refreshes vitals** (a renewal beat) so combat unlocks with the MC rested → honest forecasts.

Demo arc now complete: cold open → labour R0–R2 → the wolf (R3) → combat grind. M0+M1+M2 = a playable,
fun, woodblock-polished vertical slice. Screenshots: audit/qa-0[1-8]-*.png.

NEXT: finish PRD V2.2 (workflow), QA/polish sweep, itch packaging (About/Credits, favicon, build stamp).

---

## 5 · PRD V2.2 — DONE (Block N applied + audit-fix)

Two background workflows: (1) the main apply (8 agents, ~71 min, 886K tok) wove all 32 Block N + 7 Block N.1
decisions into docs/prd.md (§6 schema, §4 balance — Name now a REAL T2 gate at 8.4K+19.6K=28K, analytic
win-rate, enemy model; §2/§3/§1/§5/§7) — **943 insertions**; the 2 new ADRs D-044 (crash-recovery) /
D-045 (a11y-ink) in decisions.md; the a11y update in ui-design.md. (2) An audit-fix (3 agents) reconciled the
cross-section residuals: stale prose names (Munenori→Shigemasa, Jūbei→Kihei, Ranpo→Sōan), T2 "3–4"→"4",
§2.2 appraisal boolean→counter, §7 lunar de-bundling, §2.12 order-free quest model. names.ts reconciled to
the canonical V2.2 set (Shigemasa/Kihei/Sōan). Raw outputs snapshotted in brainstorms/raw/.

## 6 · Demo polish

Title bar (神隠し KAMIKAKUSHI + ⚙ Settings); a Settings/About modal (build stamp · MIT code + reserved
content · itch content descriptors · export/import save · reduced-motion + text-scale + pause a11y);
an inline-SVG seal favicon; the a11y win-rate fix (meaning in ink, hue only on a pip + word — D-Q-a11y).
Full headless QA sweep (audit/qa-0[1-9]-*.png) — woodblock-coherent, zero console errors.
