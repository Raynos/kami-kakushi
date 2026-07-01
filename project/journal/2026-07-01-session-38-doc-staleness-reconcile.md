# Session 38 — 2026-07-01 — reconcile PRD & roadmap vs the v0.3.1 build

**Summary:** Human worried the PRD and roadmap went stale in the v0.3.0 → v0.3.1
build (source of truth now in `src/`). Ran a 3-way fresh-eyes audit
(ADRs+journals / PRD+roadmap / the `src` pure core) and hand-verified every sharp
finding against the code. **Verdict: docs are largely NOT stale** — the ADR log
and PRD §4 (§4.6.6b/c/d, §4.2.2) were already rippled for v0.3.1 as it built. Real
drift was narrow: 3 stale lines in `roadmap.md`'s carry-forward prose (fixed) + 2
genuine judgment calls surfaced as H-items. Full report in
`project/audit/reports/2026-07-01-doc-staleness-reconcile.md`.

## What changed
- `docs/living/roadmap.md` — 3 provisional-narrative fixes to the "Already
  SHIPPED" prose: repair is now wood **+ a soft koku fee** (D-092) at lines 73 &
  106; the flywheel ladder is **E1→E4** not E1→E3 (E4 long-house added v0.3.1 ·
  D-092/§4.6.6d) at line 123.
- `project/audit/reports/2026-07-01-doc-staleness-reconcile.md` — new: the audit
  method, the "not-stale" verdict, the confirmed drift, and the 2 surfaced calls.
- `project/human-in-the-loop/decisions.md` — filed **H1** (version: the built
  game footer shows **v0.2**, since the build was never tagged v0.3.x — A21
  single-source violation) and **H2** (E-stage numbering collision: code E1–E4
  vs design E0→E3 with E4–E5 parked).
- `project/todo-human.md` — added the report to the reading queue.

## Verify-don't-trust catches (R2)
- The first sweep agent read `roadmap.md` and **mislabeled it as the PRD** — its
  "banking/retreat/judge absent from the PRD" claim was false; the real PRD is an
  index (`prd.md`, 69 lines) splitting into `prd/0N-*.md`, and §4 already covers
  all of it. Reading the actual §4 file overturned the finding before any edit.
- The "E1→E3 is stale everywhere" first impression was wrong: E0→E3 elsewhere is a
  **different axis** (narrative condition stages), not the code's purchase ladder.
  Only `roadmap.md:123` (the D-051 flywheel line) was genuinely stale.

## Next intended steps
1. Await human on **H1** (tag v0.3.1? align package.json?) and **H2** (E-stage
   rename). Neither is agent-resolvable — both are release/design-canon calls.
2. If H1 → "tag it": one `git tag v0.3.1` makes footer + git + docs agree.

## Landmines
- **Do NOT "fix" the version by bumping `package.json` alone** — nothing reads it
  for display; `__VERSION__` is git-tag-sourced (`git describe`). A lone bump is a
  false green (R3). The footer will still say v0.2 until a tag exists.
- Two E-stage schemes coexist by design (condition E0→E3 vs purchase E1–E4). Don't
  blanket-rewrite one into the other — the overlap is H2, unresolved.
- PRD §4 is the *detailed* balance canon; `roadmap.md` is the *order/how*. When
  they disagree on a shipped mechanic, §4 + the code win (roadmap prose lags).

---

## Update — version single-sourced from package.json (H12 → D-096)

Human resolved the version call: **package.json is the single source of truth for
the displayed version; git tags are never read by the game/HTML/TS.** (Note: my
first pass mislabeled the two surfaced items H1/H2 — but H1–H11 are already used
in `archive.md`, and IDs are never reused; corrected to **H12** (version) and
**H13** (E-stage). H12 is now resolved, H13 stays open.)

**What changed:**
- `package.json` — version 0.3.0 → **0.3.1**.
- `vite.config.ts` — `VERSION` now derives from `package.json` (`v${pkg.version}`),
  not `git describe --tags`; the build **SHA** switched to a **tag-free** raw short
  hash (`rev-parse --short HEAD`); `BUILD_VERSION` env still overrides for CI.
- `src/vite-env.d.ts` — comment updated (from package.json, not "clean tag").
- ADR **D-096** added; **H12** graduated to it + archived; `decisions.md` now holds
  only the open **H13**.

**Verified (R3):** `npm run build` → footer bundle string reads
`Built agentically with Claude Code · v0.3.1 · build 692ab58 · 2026-07-01` — zero
`v0.2` leaks in `dist/`.

## Still open
- **H13** — the E-stage numbering collision (code E1–E4 vs design E0→E3 + parked
  E4–E5). Unresolved; a design-canon call for the human.

---

## Update — the "docs mostly current" call was WRONG; deep reconciliation opened

The human pushed back hard (rightly): combat, the map, and activity-locations were
**completely redone** in v0.3.1, so "roadmap/PRD are mostly up to date" was a false
green (R3). Three independent drift-hunters confirmed: **6 of 7 PRD sections stale,
5 significantly** — only §4 (combat-balance) was rippled. §6 data-model is the worst
(missing `banked`, all four auto-mode fields, wrong `location` model, wrong quest
shape, an off-by-one day bug); §3 untouched by both reshapes; §2 combat + §5 + §7 +
roadmap forward-tiers all pre-v0.3.1.

**Two human steers reframed the whole job (both now govern):**
1. **Best-of-both, bidirectional.** Don't punch the PRD to match `src/`. Drift has a
   DIRECTION: PRD-stale (signed ADR → update PRD, preserve the why) · build-behind
   (good PRD idea the code skipped → KEEP it, file a build TODO) · genuine fork →
   human. Only PRD-stale updates the PRD.
2. **Standalone, end-state v1.0.0 PRD (D-097).** The PRD documents the finished game,
   reads standalone, cross-links to `docs/` — NO inline ADR refs / build-nuance /
   provisional scaffolding. §7 describes v1.0.0, not a per-build changelog. Recorded
   as **D-097** (refines D-021).

**In flight:** a corrected reconciliation **workflow** (run `wf_6af639b4-3a9`) —
ground-truth (code+journals+ADRs) → per-section bidirectional reconcile + doctrine
audit → adversarial direction-adjudication → transformation plan. Output will land as
a durable plan in `docs/plans/` + a reconciliation report; then the section rewrites.

## Next intended steps (superseding the earlier "wrap-up")
1. Consume the workflow → write the durable transformation plan (`docs/plans/`) +
   reconciliation ledger (fix-PRD / keep-PRD+build-TODO / human-forks).
2. Execute the PRD rewrite section-by-section (best-of-both + end-state doctrine),
   human-reviewable, sequenced per the plan.
