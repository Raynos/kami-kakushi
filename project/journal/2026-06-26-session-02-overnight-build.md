# Session 02 — 2026-06-26 (overnight) — PRD V2.2 + M0/M1/M2 build

## ☀️ SUMMARY (read this first)

The **autonomous overnight build session.** Goal (human-signed `/goal`): take the PRD from V2.1 → **V2.2**
(apply all of Block N + N.1 to `docs/living/prd.md`, with auto review/audit/fix), then **execute the roadmap** —
build **M0 + M1 + M2a + M2b** — and deliver a **playable, fun, polished, itch-ready demo** for the morning.
No human at the keyboard; work alone.

**Live state:** `memory/project-status.md`. This file is the chronological log (append at the BOTTOM).

---

## 1 · PRD V2.2 — applying Block N (in flight via Workflow `wf_c01fa208-7d1`)

A Workflow weaves all 32 Block N decisions + 7 Block N.1 defaults into `docs/living/prd.md` as **6 serial
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
decisions into docs/living/prd.md (§6 schema, §4 balance — Name now a REAL T2 gate at 8.4K+19.6K=28K, analytic
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

## 7 · Playtest → combat-balance fix (the dead-end the playtest caught)

The headless auto-play (tmp/playtest.mjs) caught a real fun-killer: at R3 a level-1 MC **lost every wolf
fight** (combatXp stayed 0 → never leveled → soft dead-end), AND the analytic forecast (31%) didn't match
the sim (~0%). Fixes: (1) the per-foe forecast now SAMPLES the real sim (48 fixed-seed fights) → honest
(the closed form over/under-states a lopsided race; analytic kept for the M6 gate); (2) the **monkey is now
a level-1 winnable starter foe** (the grindable set sorts easiest-first) so the win→XP→level→harder-foe loop
has traction; (3) per-hit damage spread (~±30%) for texture. Re-playtest: the MC climbs **1→4** over 200
fights, monotonic, no stalls/anomalies, zero console errors. Combat tab now shows e.g. monkey "◆ 98% Steady",
wolf "◆ 2% Risky" — an honest forecast that guides the grind. M2 tests rewritten to assert the sampled
progression. **51 tests green.**

This is exactly what the playtest discipline is for — and the demo arc is now genuinely fun end-to-end.

## 8 · The signature beat — rank-up seal press

A promotion now presses the house hanko: a vermilion seal stamps down (ease-press overshoot, mix-blend so
the paper grain shows through), "PROMOTED · {kanji} · {rank title}", held ~1s then lifts — reduced-motion safe.
The ui-design §6.2 signature juice moment, now live (audit/qa-10-rankup-seal.png).

## 9 · UX fixes from the first human playthrough

Five fixes from live play: (1) the Settings close-X is larger (2.25rem hit-area) with an INDIGO hover
(vermilion is reserved for the seal, per the bible — not a routine affordance); (2) the event log now reads
NEWEST-AT-BOTTOM in chronological order (a story reads top-to-bottom, not reversed) and new lines CASCADE in
one-by-one with auto-scroll (the text-adventure feel) — staggered reveal queue, reduced-motion-safe, DOM capped
at the ring; (3) "New game" and "Import" now close the Settings panel so the fresh/loaded game is visible.
Screenshots: audit/log-cascade-*.png, audit/settings-*.png.

## 10 · Doc-reality sync (audit → fix)

A 5-agent audit cross-checked all ~40 markdown files against the built reality and found ~25 stale items:
verdict was code + project-status + journal + ADRs accurate, but ~a dozen design/process docs still read
"pre-build / DRAFT / PLAN", with no milestone tracker and the D-021 docs-explosion overdue. Fixed (Phase 1 me
+ Phase 2 a 10-agent parallel pass): created the living **docs/living/roadmap.md** (M0–M2b ✅ / M3–M7 provisional);
reclassified qa-playtesting from a "plan" → a LIVING GUIDE and moved docs/plans/→docs/ (20+ refs fixed);
graduated the QA harness tmp/→scripts/; prd.md masthead→V2.2 + §7.2 completion banner + "§7 approved" notes;
prd_human_feedback Block N/N.1 marked ✅ APPLIED + precedence pointer + footer; ADRs annotated + **D-046**
(build-cycle-complete); ui-design/fun-factor/qa-playtesting DRAFT/PLAN→LIVING; CLAUDE/README/working-agreements
present-tensed; root README age 17→~18 + seed-prompt pointer; names.ts Yagoemon→Yagōemon; filed review R1.
Raw audit + fix reports snapshotted in brainstorms/raw/. verify green (51 tests) throughout.

## 11 · Docs/feedback reorg (human-directed)

Reorganized per the human: NEW top-level **human-feedback/** (live human-feedback inbox, one dated file per session;
human-feedback/README.md) with **human-feedback/prd_human_feedback.md** (the finished PRD-feedback record, banner
marks it ARCHIVED). Moved the living design docs into **docs/living/** (prd, ui-design, fun-factor,
qa-playtesting, roadmap) and the **ADR ledger → docs/living/decisions.md** (it is live/append-only, so history/
was the wrong bucket — dissolved docs/history/). All cross-references rewritten programmatically (tmp/relink.mjs,
20 files) + bare path-mention seds; a link-checker (tmp/linkcheck.mjs) confirms 0 new broken links (only frozen
archive/ + a template placeholder remain). docs/README + CLAUDE.md Layout updated to the new structure. verify
green (51 tests). Broader top-level-hierarchy reorg = proposed to the human, NOT executed.

## 12 · `project/` umbrella reorg (Phase 1 — human-directed)

Cut top-level clutter (8 markdown dirs → fewer) by folding the agentic-process dirs under one **`project/`**
umbrella (human picked "Option A"): `memory→project/status`, `journal→project/journal`,
`brainstorms→project/brainstorms`, `feedback→project/human-feedback`, `human-in-the-loop→project/queue` …then the
human steered that last one back, so **`project/human-in-the-loop`** (kept its descriptive name),
`audit→project/audit`, `archive→project/archive`. All via `git mv` (history preserved). Cross-references
rewritten ONCE with a prefix-aware rewriter (tmp/relink2.mjs — resolve link vs OLD dir → remap prefix →
re-express vs NEW dir); link-checker confirms only the 3 pre-existing acceptable broken links (frozen
`archive/prd-v1.md`×2 + a PARKED-THREADS template placeholder). **Lesson burned in:** blanket lookbehind seds
for bare label/prose mentions corrupt `../`-relative links inside moved files, and the rewriter is NOT
idempotent — recovery was `git checkout -- '*.md'` (git mv preserved content at new paths) then relink2 exactly
once; bare label/prose fixed by hand on root files only (CLAUDE.md/README.md have no `../` links). CLAUDE.md
Layout + project/status snapshot present-tensed to the new tree. Config also moved: `.githooks/pre-commit`
(journal regex `^project/journal/`, status path), `scripts/snapshot-research.sh` (raw dest),
`eslint.config.js` (ignore `project/archive/**`). verify green (51 tests). Phase 2 (index.html + scripts → src/)
next.

## 13 · `src/` consolidation (Phase 2 — human-directed)

Pulled the web entry + dev/maintenance scripts under `src/` (human: "push harder on index.html in src/ and
scripts in src/scripts"). `git mv index.html → src/index.html` and `scripts/ → src/scripts/`. Vite now uses
**`root: 'src'`** (so it serves `src/index.html`) with **`build.outDir: '../dist'`** + `emptyOutDir: true`
(output still lands at repo-root `dist/`, itch-relative-base unchanged); index.html's entry became
`/app/main.ts` (root-absolute under root=src). Knock-on edits: **Vitest** inherits Vite's root, so
`test.include` → `['**/*.test.ts']` (root-relative — all 51 tests live under src/); `tsconfig` include drops
the now-redundant `scripts`; `eslint` ignore + node-globals override repointed to `src/scripts/**`; `package.json`
`tsx scripts/… → tsx src/scripts/…`; the two TS scripts' `'../src/core' → '../core'`; **snapshot-research.sh**
`repo_root` climbs `../..` (one dir deeper); **qa-shots.mjs** `OUT 'audit' → 'project/audit'` (a Phase-1 miss —
the audit dir had moved). Doc path-refs (`scripts/x` → `src/scripts/x`) fixed in CLAUDE/README/prd/qa-playtesting/
roadmap/status; frozen `archive/prd-v1.md` left as-is. **Verified end-to-end:** `npm run verify` green (51 tests,
Vitest root=src), `npm run build` clean (42 KB JS / 14 KB CSS → dist/), dev server serves src/index.html +
transpiles `/app/main.ts` (200), and the headless QA harness drove the full cold-open→combat→rank-up→mobile
sequence with **no console errors** (screenshots in project/audit/). Top-level is now just `docs/ project/ src/`
(+ generated dist/ tmp/).
