# Session 76 — 2026-07-05 — F7 balance-tuning cockpit (AFK autonomous build)

## ☀️ SUMMARY (read this first)

Building the **F7 balance-tuning cockpit**
(`docs/plans/fable-process-F7-balance-cockpit.md`) end-to-end as an AFK
autonomous build. A DEV-only slider panel over a curated set of `balance.ts`
feel levers: drag mid-run → feel it → export the touched keys as a committable
artifact an agent transcribes back to canon. The HUMAN owns which numbers feel
right (D-059); the cockpit never moves a slider into canon on an agent's behalf.

Four up-front decisions locked with the human (AskUserQuestion):
1. **Push each green phase** to origin/main (leave local if a co-agent's red
   blocks the tree).
2. **Restructure to strip clean** if the setter leaks into prod (Risk 1) —
   *did not materialise*, Rollup tree-shakes it.
3. **balance.ts only** — content-side levers parked for v2.
4. **Propose W1–W4 tunings as review-only** — `?bal.*` URLs + R-items, never
   committed to canon (the post-build task).

This file is HISTORY, not live state — the live snapshot is
`project/status/project-status.md`.

---

## 1 · Ph1 — override layer + 3 levers, end-to-end ✅

The crux (§1): ES named imports are **live bindings**, so converting a curated
lever from `export const` → `export let` and reassigning it *in the declaring
module* propagates to every importer's next read. Verified against the real code
(`intents.ts:483` reads `RICE_PER_RAKE` at dispatch time, etc.).

**Built:**
- `src/core/content/balance.ts` — `const`→`let` for `RICE_PER_RAKE`,
  `EAT_RICE_SATIETY`, `SATIETY_PER_REST`; added `readBalanceLever` /
  `__setBalanceLever` / `__resetBalanceLevers` + a frozen `BALANCE_CANON`
  snapshot (single source for canon — no copied magic numbers). The
  `balance-override:` throw string is the strip marker.
- `src/core/index.ts` — named exports of the hook (tree-shakable).
- `src/ui/dev-cockpit.ts` — the controller (set/read/canon/touched/reset/
  exportMarkdown/subscribe), the pure `buildTuneArtifact` diff builder, the
  `BALANCE_LEVERS` registry, and `mountBalanceCockpit` (the Balance sub-tab UI).
- `src/ui/dev.ts` — a 4th sub-tab **Balance**; re-exports `createBalanceCockpit`
  so `dev-cockpit.ts` stays imported only here (rides the DEV fold). The tab bar
  now **wraps** (two rows of two) so the 4th tab is reachable (was clipping).
- `src/app/main.ts` — creates the cockpit (onChange = app re-render; meta =
  build stamp + seed + clock), attaches it to `__qa.balance`, passes it to the
  panel.
- `src/scripts/verify-dev-strip.sh` — added `balance-override` to the strip-gate
  marker loop.
- Tests: `src/ui/dev-cockpit.test.ts` — exact artifact bytes, live-binding
  propagation, subscribe, save-non-leak. `src/ui/dev.test.ts` — patched the 7
  `mountDevPanel` sites for the new required `cockpit` opt.

**DoD — all met:**
- Headless on the REAL dev server (`tmp/f7-ph1-dod.mjs`): `__qa.balance.set(
  'RICE_PER_RAKE', 10)` → `rake_rice` gained **exactly 10**; reset → gained 3
  again; `exportMarkdown` emitted the exact `old → new` line; **zero console
  errors**. (RED-able: a dead live binding gives 3, not 10.)
- `npm run build` + grep `dist/assets/*.js`: **0 hits** for `balance-override`
  and `__KAMI_DEV_PANEL__` — Risk 1 (namespace re-export pinning the setter)
  did NOT occur; `verify-dev-strip.sh` green.
- Save-non-leak vitest green; overrides live in module bindings, never the save
  envelope.
- `npm run verify` — **17 gates green**; full suite 728→735 tests.

## 2 · Ph2 — full curated lever set + persistence + live feedback ✅

**Built:**
- `balance.ts` — 16 more scalars `const`→`let`; both switches (`readBalanceLever`
  / `__setBalanceLever`) + `BALANCE_CANON` extended to the **full §2 set (35
  levers)**, structured map paths (`ESTATE_BANDS.*`, `RUNG_METER_THRESHOLDS.*`,
  `STANCE_MODS.*.{atk,taken}Mult`, `RICE_SELL_PRICE_BY_SEASON.*`) mutating their
  runtime object in place via local casts. Kept the two-switch shape the plan
  chose; `BALANCE_CANON` stays a PLAIN literal (references bindings, never the
  switch) so the whole DEV hook still tree-shakes.
- `dev-cockpit.ts` — the full registry (groups/watch tags/guards/`appliesAt`);
  `bal.*` URL **hydrate + mirror + clean-URL reset** (F18 pattern, inert under
  vitest); the **§5 live readouts** (next-rung ETA · capstone ETA · eat-vs-rest ·
  rice→coin), selector-derived, recomputed on every override.
- `dev.ts` — `DevQa.state()` added; `getState: qa.state` threaded to the readouts.
- `main.ts` — `cockpit.hydrate()` at boot (outside `if (dev)` so `?dev=no` still
  applies a shared tune link).
- Tests — registry/CANON lockstep, every-path round-trip (tripwire vs a future
  `Object.freeze`), structured-path in-place mutation.

**DoD — all met (headless `tmp/f7-ph2-dod.mjs`):** F5 with
`?bal.EAT_RICE_SATIETY=36` hydrates + the row shows `30 → 36 (+20%)`; the
capstone-ETA readout moves live when `ESTATE_BANDS.excellent` is dragged
(`480 → 2000` ⇒ `96.0 → 400.0 min`); reset-all restores byte-identical canon +
a clean URL; a set mirrors `?bal.RICE_PER_RAKE=7`; zero console errors. Prod
strip re-measured: **0 hits** for `balance-override` (the bigger CANON + switches
still tree-shake). `npm run verify` — **17 gates green**.

**Notable finding (for the W-proposals):** the live readouts show the capstone is
ALREADY ~96 min under current canon (`ESTATE_DEED_PER_ACT` is now `0.04`, the
D-133 fractional stopgap) — the balance-watch's "~30 s capstone" is STALE. W4 may
need no tune; the tool surfaced it.

## 3 · Ph3 — export transport + agent apply flow ✅

**Built:**
- `dev-cockpit.ts` — `buildTuneArtifact` now emits the **mirror & re-verify
  block** (+ a conditional `ranks.ts` mirror bullet when a
  `RUNG_METER_THRESHOLDS.*` lever moves), and structured paths get a field-edit
  line (not `export let`). New `exportPayload()` shapes the F3 CaptureBody
  (colon-free `<stamp>-balance-tune` session). The Balance pane grows an **Export
  tune → inbox** button + note input; the transport POSTs to the F3 endpoint
  (`CAPTURE_ENDPOINT`) **verbatim — no new handler** — with a clipboard +
  file-download fallback.
- `qa-playtesting.md` — the **agent apply-flow** section (stale-canon guard →
  exact edits + ranks mirror → re-verify → commit-and-delete) + the ~10-min
  human tuning-session recipe.
- Tests — the artifact rides the **real F3 handler** (`resolveCapture` +
  `writeCapture` → correct `.md` + sidecar); the mount POSTs the right body;
  the download fallback fires on POST failure.

**DoD — all met:**
- Real dev server (no-commit throwaway on :5199): tuned 2 levers (a scalar +
  `RUNG_METER_THRESHOLDS.R7`) → **Export** → the file landed at
  `pending/<stamp>-balance-tune.md` with correct frontmatter, both exact
  old→new lines, and the ranks.ts mirror bullet; zero console errors. (Cleaned
  up — no repo pollution.)
- Fallback download proven (unit).
- **Worked apply (throwaway, reverted — D-059/decision #4):** the artifact's
  old-string matched `balance.ts` verbatim (stale-canon guard passes); applied
  `RICE_PER_RAKE 3→4` + `gen:docs` + `verify` → the loop correctly SURFACED the
  honest REDs (fixtures stale + a balance-sensitive test) an apply is meant to
  surface; reverted → **canon byte-identical**, verify green (17 gates). No
  invented number committed to canon.

## 4 · Ph4 — polish + docs wiring ✅

- **decisions.md** — **D-134** (the override mechanism + the human-tunes /
  agent-transcribes division + the strip proof + the ~96-min capstone finding).
- **AGENTS.md** — the balance-verdict convention now points to the cockpit +
  "an agent never moves a slider into canon on the human's behalf (D-134/D-059)".
- **CHANGELOG.md** — an `[Unreleased] → Internal` entry (DEV-only, no version
  bump — not player-facing).
- **qa-playtesting.md** — the apply-flow + ~10-min recipe (landed in Ph3).
- Verified the rung-threshold mirror the artifact emits is REAL —
  `verify-content.ts:60` enforces `RUNG_METER_THRESHOLDS[r.id] ===
  RankDef.meterThreshold`.
- Plan **Status → ✅** and `git mv` to `project/archive/`; the generated
  active-plans region (`docs/plans/README.md`) + reading queue updated by
  `npm run checkpoint`. Full verify green (17 gates).

## 5 · Post-build — W1–W4 review-only tuning proposals (decision #4) ✅

Candidates derived from the live-feel readouts + the balance-watch, surfaced as
`?bal.*` URLs + review item **R10** (`human-in-the-loop/review.md`) with the full
analysis in `project/brainstorms/2026-07-05-f7-w-proposals.md`. **Nothing on
canon** — the human feels each on the sliders and exports their final numbers.

- **W4 — no change proposed** (D-133 already lands the capstone at ~96 min; the
  watch item was stale).
- **W1** `RICE_PER_RAKE 3→2` · **W2** `RICE_SELL_PRICE_BY_SEASON.autumn 3→4` ·
  **W3** `EAT_RICE_COST 3→2`. Combined URL hydrates clean (headless-verified, 3
  touched, 0 errors).

**F7 COMPLETE** — all four phases + the review-only proposals shipped to
`origin/main` (Ph1 `1a04aa0`, Ph2 `b749a4b`, Ph3 `210c205`, Ph4 `46bd9ed`).

## 6 · R10 — the human adopted the W-tunings; applied to canon ✅

The human reviewed the proposals and said "apply your recommendations and close
R9" — their explicit sign-off IS the D-059 human decision (D-022: newest intent
governs). Corrected an ID collision along the way: **R9 was already the archived
UI-remaster review** (→ D-127), so the balance review is **R10** (fixed in
review.md / brainstorm / archive.md).

**Applied to `balance.ts` (human-adopted):**
- W1 `RICE_PER_RAKE 3 → 2` · W2 `RICE_SELL_PRICE_BY_SEASON.autumn 3 → 4` ·
  W3 `EAT_RICE_COST 3 → 2`. **W4 unchanged** (D-133 already lands the capstone
  ~96 min).

**Re-verify (D-132 flow):** `gen:docs` → `verify:balance` (all signed bands
green — R5/R6 in band, **rung pacing Δ +0.0** since rice/coin don't touch the
per-act rung meter, Phase-2 ratio 0.94 in band) → `balance:report` (regen
`t0-pacing.md`) → `fixtures:regen` (3 saves restated). Fixed 4 of my own
dev-cockpit tests that hard-coded `RICE_PER_RAKE=3` — now derive from
`BALANCE_CANON` (the D-086 lesson, self-inflicted + corrected). Full verify green
(17 gates), 753 tests.

R10 graduated to `human-in-the-loop/archive.md`.

## Landmines (current)

- **Shared tree, co-agent (w2:p2) live** in `log-content.ts` / `intents.ts` +
  the fixtures. Their C-stage commits transiently restale fixtures — if a push/
  commit blocks on `fixtures`, it's theirs; leave local, don't `SKIP_VERIFY` red
  onto main. Stage only F7 paths by explicit path.
- The override switches (`readBalanceLever` / `__setBalanceLever` in
  `balance.ts`) must stay in lockstep with the cockpit registry + `BALANCE_CANON`
  — the round-trip test is the tripwire. Structured paths mutate in place; a
  future `Object.freeze` on a map would silently no-op a set (the test catches it).
- `BALANCE_CANON` MUST stay a plain literal (never computed from the
  switch/access) or the whole DEV hook stops tree-shaking → `balance-override`
  leaks the strip gate.

## Landmines (current)

- **Shared tree, 3 co-agents.** The "reduce save file size" agent (w2:p2) owns
  `src/core/log.ts` / `rewards.ts` / `step.ts` / `content/log-content.ts` + the
  regen'd `src/fixtures/saves/*.json` — **do not stage/commit/touch those**.
  Stage only F7 paths by explicit path.
- Ph2 structured-path levers mutate their runtime object **in place**
  (`(ESTATE_BANDS as {...}).excellent = v`) — readonly/as-const is compile-time
  only. Extend the `readBalanceLever`/`__setBalanceLever` switches together.
- `RUNG_METER_THRESHOLDS.*` levers must carry the `content/ranks.ts`
  `meterThreshold` mirror in the export (verify-content enforces 1:1) — that's a
  Ph3 artifact concern.
