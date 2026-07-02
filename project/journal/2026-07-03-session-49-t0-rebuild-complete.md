# Session 49 — 2026-07-03 — autonomous T0 rebuild COMPLETE (v0.3.5, deployed)

## ☀️ SUMMARY (read this first)

The human granted **full autonomy** (scope-locked in ADRs **D-107–D-116**) to
rebuild T0 against the round-1–3 playtest feedback (F86–F117 in
[`../human-feedback/2026-07-02-playtest.md`](../human-feedback/2026-07-02-playtest.md)).
That rebuild is now **COMPLETE, green on `origin/main`, and deployed** — the game
is live at **raynos.github.io/kami-kakushi** as **v0.3.5**. Eight lanes shipped
(render engine · economy re-core · 6-tab IA · estate-map diverge · rung-up story
beats · log/UI polish · deep housing · combat voice), each verified through the
whole player path, plus a **12th verify gate** (`verify-changelog`) and a backfilled
top-level `CHANGELOG.md`. Two adversarial audits (economy balance, deploy gate) ran
and are captured. **All F86–F117 statuses are now flipped to ✅** in the feedback
doc (28 items), with the genuinely-deferred parts noted inline on their Fixed-in
lines.

**This file is HISTORY — the live "current state / how to resume" is
[`../status/project-status.md`](../status/project-status.md).** What's left is a
**human async queue** (review passovers, DEV-variant picks, balance-watch,
cast-read) + a **deferred/owed engineering tail** (see the last two sections),
none of it blocking the deployed build.

---

## 1 · The eight lanes (all shipped + on `origin/main`, green)

Everything funnelled through the serial `render.ts` lane (append-only reconcile
engine, lane ①), so the whole UI stays flash-free.

1. **Append-only render engine** — `reconcile.ts`; the whole UI reconciles instead
   of re-innerHTML'ing, so nothing flashes and the log/VN typewriter survive
   re-renders. The load-bearing substrate every other lane built on.
2. **Economy re-core Ph1–4 + audited** (D-107/108/109/113) — koku split into
   **coin + rice**; the rice loop (sell / eat / store); mon → monme → ryō display
   scaling; **koku reframed as House standing** (a pillar, not a wallet). Adversarial
   economy audit ran (see §2).
3. **IA 6-tab reorg** (D-116) — Work · Map · Estate · Inventory · Character · Combat,
   revealed incrementally; **vendors-as-people** (the pedlar is discovered + talked
   to at a map node, `people.ts`, F99/F109); nav→Now flavor routing (F114).
4. **Estate-map diverge** (F102, D-075) — the map split into a "where you are now"
   flavor panel + a terse click-to-navigate map; **7 working variants (V5A–V5G)**
   behind the DEV toggle. Self-picked default; live human pick owed (R7).
5. **Rung-up story beats** (D-110, F97/F103) — core + UI: every rung promotion is a
   **player-triggered VN beat** (pending → beat → apply), motivating each unlock;
   the mis-routed combat-log line is gone. SCHEMA bumped 5 → 6.
6. **Log / UI polish** — Chat log tab (F111) · Now-expiry timer decoupled from the
   active view (F115) · footer de-overlap (F92) · About modal + clickable version
   (F104) · rung-in-header (F106) · the F116 duplicate-ladder removal · F117 log-
   column rebalance.
7. **Deep housing T0** (D-111, F89) — a **home** with belongings / comfort you can
   rest in, in the Inventory tab. Shipped ONE prod default only — the mandatory
   D-075 diverge is **owed** (R6, see §7).
8. **Combat-log voice polish** — narration vs speaker voices assigned at emission
   (pure-core), so the renderer prefixes + colours consistently (F91).

## 2 · The two adversarial audits

- **Economy balance-watch** — an adversarial pass over the re-cored economy found
  **4 liquid tuning items** (rice out-produces its sinks → coin too abundant; the
  koku/standing capstone lands too fast). I did **NOT** silently re-tune — the pace
  is the human's feel-call (D-059 keeps balance liquid). Written up in
  `../audit/reports/2026-07-02-economy-balance-watch.md`; surfaced in the human
  queue.
- **Deploy-gate audit** — an adversarial check of the gh-pages deploy path before
  shipping (does the built `dist/` actually serve the live player path; does the
  version stamp / CHANGELOG link resolve on the real host). Fed the decision to add
  the `verify-changelog` gate (§4).

## 3 · The deploys (v0.3.4 → v0.3.5)

- **v0.3.4** — the bulk of lanes ①–⑥ + the economy re-core; first deploy of the
  rebuilt T0.
- **v0.3.5** — deep housing (lane ⑦) + combat voice (⑧) + the final log/UI polish;
  the current live build. `CHANGELOG.md` carries both entries (backfilled v0.1.0 →
  v0.3.5 from the repo's own tags/log/roadmap/journals, F105).

## 4 · The verify-changelog gate (12th gate)

`npm run verify` now runs **12 gates** (was 11): the new **`verify-changelog`**
asserts the `CHANGELOG.md` top entry matches the single-source version
(package.json) — so a version bump can't ship without its changelog line, and vice
versa (A21 version-single-source, given teeth). Roster owned by
`src/scripts/verify-run.ts`; gates run in parallel under the 5s soft drift budget.

---

## Next intended steps (current)

The deployed build is a clean checkpoint. What remains is **not** blocking:

1. **Human async queue** (surfaced in `../status/project-status.md` + the live
   trackers) — the review passover on the reshaped T0; the DEV-variant picks
   (estate-map V5A–G = R7; the **owed** home/Inventory diverge = R6); the
   rung-cast + R0→R7 beat read (R8); the 4 balance-watch tuning calls.
2. **Work the deferred engineering tail** (§ below) as the human's picks land — the
   home-panel diverge is the highest-value owed item (D-075 debt).

## Landmines / DEFERRED + OWED tail (current)

Genuinely-deferred work, noted inline on the relevant F-items' Fixed-in lines and
gathered here so a cold resume sees it:

- **Home/Inventory-panel D-075 diverge is OWED** (F89, R6) — the deep-housing pass
  shipped a single prod default; the mandatory 2–3 live DEV variants were **not**
  built (the autonomous rebuild ran headless and can't author + self-review live UI
  variants). Design debt, not a reviewed surface — run the `diverge` skill on it.
- **The 'lord' voice needs a core `VoiceCategory` extension** — the voice/speaker
  colour system (F26/F91) has no category for a lord/superior speaker yet; adding one
  is a pure-core `VoiceCategory` enum + palette extension, deferred until that cast
  arrives.
- **Economy Phase 5 (status tokens)** — the re-core landed Ph1–4; Phase 5 (koku /
  House-standing expressed as diegetic **status tokens**) is designed-but-unbuilt.
- **Home grows with rung** — the T0 home is static; making the home/belongings
  surface expand as you climb rungs/tiers is deferred (pairs with the per-tier tail
  below).
- **Per-tier / per-rung NPC placement** (F113) — the starting grain-store now stays
  reachable (bug fixed), but the design where the cast's *positions* on map nodes
  shift each tier/rung is deferred.
- **Balance-watch tuning** (§2) — the 4 liquid items are the human's feel-call; left
  un-tuned on purpose (D-059).

- **Shared tree:** Fable's **UI-v2 prototype** (`prototype/`, `ui-demos/`, etc.) is
  a separate taste-call spike — untouched by this rebuild; leave it alone on resume.
