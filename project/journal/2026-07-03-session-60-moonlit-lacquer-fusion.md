# Session 60 — 2026-07-03 — Moonlit × Lacquer fusion demos (07–09)

## ☀️ SUMMARY (read this first)

The human is torn between `ui-demos/` **01 Moonlit** and **04 Lacquer** and asked
for **3 fusion variants** built as demos **07–09** to feel which pulls. Ran a
7-way blind Opus fan-out (one organizing-principle per agent) → a taste judge →
a **spanning trio**: **07 Andon** (warmth-as-place), **08 Night Seal**
(warmth-as-you), **09 Damascene Duet** (a third steel substrate). Idea/ranking in
[`project/brainstorms/2026-07-03-moonlit-lacquer-fusion.md`](../brainstorms/2026-07-03-moonlit-lacquer-fusion.md);
build spec + model-routing in
[`docs/plans/opus-2026-07-03-ui-demos-07-09-moonlit-lacquer.md`](../../docs/plans/opus-2026-07-03-ui-demos-07-09-moonlit-lacquer.md).
This file is HISTORY; live state = `project/status/project-status.md`.

---

## 1 · Fan-out + ranking + durable capture (docs commit)

- Read both parents deeply (CSS + main.js + the VARIANT-SPEC) — the key build
  insight: **each fusion forks ONE parent's three files and re-skins**, keeping
  the parent's proven engine wiring + reconcile + mobile/iOS trap fixes intact.
- Workflow `moonlit-lacquer-fusion-ideation` (7 idea agents → 1 judge, all Opus,
  8 agents, 0 errors). Snapshotted raw verbatim to
  `project/brainstorms/raw/2026-07-03-moonlit-lacquer-fusion-ideation-wtw1qor6c.json`.
- Chosen trio spans 3 orthogonal fusion axes (warmth-as-place / -as-you /
  -transcended); bases = 04, 01, 04. Order 07→08→09 is a deliberate gradient
  (both coexist → one dominant + traveling accent → neither, a third thing).

### What changed (this commit)
- `project/brainstorms/2026-07-03-moonlit-lacquer-fusion.md` — NEW: 7 concepts +
  ranking + the chosen trio.
- `docs/plans/opus-2026-07-03-ui-demos-07-09-moonlit-lacquer.md` — NEW: build spec
  (fork-don't-greenfield), per-variant design, model-routing (Opus ×4), DoD.
- `project/todo-human.md` — plan added to the reading queue.
- `project/human-in-the-loop/review.md` — R9 extended with 07/08/09.
- `project/journal/…session-60…` — this file.

## 2 · Build + QA + gallery wiring

- Built via **3 parallel resumable Opus agents** (one per variant, disjoint dirs
  → parallel-safe on the shared tree). Each forked its parent's 3 files, kept the
  proven engine/reconcile/mobile machinery, transformed the design language, and
  self-verified (Playwright desktop + WebKit-iPhone arc, screenshot self-review).
  All three returned clean: **0 console errors, 0 per-element overflow** on
  desktop (1440×900) and phone (393px), full arc R0→R3 + VN + ceremony + all tabs.
- **Orchestrator QA (R2, my own eyes):** reviewed the key frames of each against
  VARIANT-SPEC §3 + taste T1–T4 and each concept's named slop-risk. Verdicts:
  - **07 Andon** — two-light read lands (cold-open title grades gold→silver; warm
    lamp vs cool window; gold mullion carries the terminator — no mud). Ship.
  - **08 Night Seal** — "cold house, one warm seal" reads; ceremony grows the
    cursor into the stamp (continuity payoff); "01 + red cursor" collapse
    defeated by lacquer material + the paper-log inversion. Ship.
  - **09 Damascene Duet** — genuine third steel substrate; silver=state/gold=value
    split legible; strike floods vermillion; nunome keeps quiet fields alive;
    gunmetal/trophy both defeated; dark recessed log avoids the empty-paper dial.
    Ship.
  - Residual items are **taste dials for the human**, captured in the plan's
    "Known taste dials" — I did NOT silently tune them (R5: the human is the
    taste arbiter; the demos exist for the pick).
- Wired all three into `ui-demos/index.html` as the **single writer** (intro
  updated; three `<li>` rows with axis-flavoured DNA tags). Local server confirms
  the gallery lists + serves all three.

### What changed (this commit)
- `ui-demos/07-andon/`, `ui-demos/08-night-seal/`, `ui-demos/09-damascene/` — NEW
  full variants (index.html + style.css + main.js each).
- `ui-demos/index.html` — gallery intro + three rows for 07–09.
- `docs/plans/opus-2026-07-03-ui-demos-07-09-moonlit-lacquer.md` — Status → BUILT;
  DoD ticked; "Known taste dials" section added.
- this journal.

## Next intended steps
1. Checkpoint push `main` so the Vercel demo carries 07–09 (for the human's iOS
   review). **If the pre-push gate goes red on the concurrent F1a agent's
   in-flight `src/scripts` WIP, do NOT override** — leave the commit local, note
   it, and push once their tree is green.
2. On the human's R9 pick: tune the chosen variant's taste dials, or run a
   refine/blend round; archive this plan.

## Landmines
- **Shared tree, live:** a concurrent agent is building **F1a** (mechanical
  checkpoint) — `package.json`, `src/scripts/verify-run.ts` + new `checkpoint.ts`
  / `gates.ts` / `gen-regions.ts`, and it also edits `project/status/project-status.md`.
  I staged ONLY my `ui-demos/` + plan + journal by explicit path; left all of
  theirs (incl. the snapshot) untouched. The snapshot update for the fusion demos
  is deferred to avoid sweeping their WIP into my commit.
- ui-demos is excluded from Prettier/ESLint but served as ES modules from repo
  root — relative `../shared/` imports, no build step, no external requests. So
  the commit uses `SKIP_CODE_VERIFY=1` (the code lane can't judge ui-demos and
  would only run against the other agent's in-flight src changes).
- Concurrent build agents' QA teardown `pkill` swept up my local review server
  twice (exit 144) — a stable server is only safe once all build agents finish.
- Cross-variant dial (inherent to the game's sparse story content, not a bug): the
  *bright* paper logs (07 window, 08 well) read empty at low line-counts; 09's
  dark steel log sidesteps it.

## 3 · Demo 10 — Andon Steel (the human's synthesis, follow-on session)

After reviewing 07–09 the human landed on a specific remix (verbatim: *"Andon, in
the color scheme of damascene, remove the cross net / nunome bg. But the cold-open
is like 06, the behavior, with the GBA text scrolling."*). Paused mid-spec →
handoff to `tmp/handoff-demo-10-andon-damascene.md` → resumed and built.

- **Built via one Opus agent**, forking 07 Andon into `ui-demos/10-andon-steel/`
  (index.html + style.css 1220 + main.js 912). First launch **misfired** (returned
  in 1.5s, 0 tool uses, stray `_authorised:true`) — relaunched, second run built
  it clean. Changes: remap 07's `:root` → Damascene steel tokens + retreat every
  structural surface to steel; **remove the nunome** (3 sites + Andon's grain +
  shoji lattice); **port 06's `playColdOpen` typewriter** (title→sub→char-by-char
  lede at 24ms/char behind a gold caret→verb; RM-safe; fires once).
- **My own-eyes QA:** the GBA typewriter cold-open is the standout (reads like a
  JRPG title card); the flat steel reads **alive** (gold keylines + silver rim +
  gold terminator spine carry it — nunome not missed); bimetal split holds; dark
  steel log-well sidesteps the bright-empty dial; ceremony = the damascene lozenge
  on a vermillion field-flood. 0 console errors, 0 overflow desktop+phone.
- Known dials → the plan's "Known dials (demo 10)": Damascene sans vs Andon's
  condensed (one-line revert); seal-press red-flood not ported (only the cursor
  blooms). Both minor, left for the human's R9 call (R5).
- Wired into the gallery (07–10) + R9 (10th row) as single writer.

### What changed (this commit)
- `ui-demos/10-andon-steel/` — NEW variant (index.html + style.css + main.js).
- `ui-demos/index.html` — gallery intro (07–10) + the Andon Steel row.
- `project/human-in-the-loop/review.md` — R9 extended with demo 10.
- `docs/plans/opus-2026-07-03-ui-demos-07-09-moonlit-lacquer.md` — `## 10` section
  → BUILT; DoD ticked; "Known dials (demo 10)" added.
- this journal (§3).

### Landmines (demo 10)
- The push carries the **F1a co-agent's 4 finished checkpoint commits** (they
  committed but didn't push) plus their live WIP is verified by the pre-push gate —
  if red, leave local, don't override.
- Background build agents can misfire (instant 0-tool return) — check the dir got
  created before trusting the report; relaunch, don't resume a no-op.
