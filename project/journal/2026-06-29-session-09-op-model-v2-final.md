# Session 09 — 2026-06-29 — Operating Model v2 FINAL (the H10 resolution)

**Summary:** Synthesized the human's 8 directives into a single decided plan,
[`docs/plans/2026-06-29-operating-model-v2-final.md`](../../docs/plans/2026-06-29-operating-model-v2-final.md),
that **supersedes both** prior op-model drafts (the maximalist implementation + the lite reel-back, now
**archived**). Key finding: **measured** the gate suite — full `npm run verify` runs in **3.03s** (~3.2s with
`pacing:check`), so pre-commit can run *everything* inside the 5s box (no fast-subset needed). All 4 review
forks resolved by the human; 4 pre-execution decisions (X-1…X-4) surfaced and left for the human's go. **No
code built yet** — this is a planning checkpoint; execution is gated on the human's X-1…X-4 answers + the
concurrent roadmap agent clearing the docs lane.

## What changed
- `docs/plans/2026-06-29-operating-model-v2-final.md` — **NEW.** The FINAL plan. §0 measurements, §1 routing of
  the 8 directives, §2 six workstreams (A pre-commit=full-verify, B 5s drift guard, C diverge skill, D scoped
  playcheck, E PRD-split, F ADRs/CLAUDE.md), §3 what's dropped, §4 conflict-aware build order, §5 forks
  RESOLVED, §6 pre-execution decisions X-1…X-4.
- `project/archive/2026-06-28-operating-model-v2-implementation.md` — **moved** (git mv) from `docs/plans/`.
- `project/archive/2026-06-29-operating-model-v2-lite-reelback.md` — **moved** (git mv) from `docs/plans/`.
- `project/docs-to-read-for-human.md` — replaced the ②b lite-reelback entry with the FINAL plan; updated the map.
- `docs/plans/2026-06-29-path-to-v0.3.md` — repointed the op-model ref to FINAL; PRD-split name → ASCII.
- `project/status/pending-prd-changes.md` — repointed op-model refs to FINAL; PRD-split filenames → **ASCII**
  (`prd/01-vision.md … 07-roadmap-scope.md`, per the human's steer — no unicode `§` in filenames).

## Decisions captured
- **Measurement:** full `verify` = 3.03s; +`pacing:check` ≈ 3.2s; vitest = 0.96s/99 tests; tsc 0.60s; eslint
  0.61s; prettier 0.49s; smoke 0.13s; pacing:check 0.16s. **The whole suite fits the 5s box.**
- **Forks:** F-1=a (warn-in-hook + hard `verify:budget`), F-2=a (thin `src/playcheck.ts`), F-3=a (`prd.md` →
  stub index), F-4=no-dup (roadmap owned by a **concurrent agent** — this plan must NOT touch roadmap docs).
- **PRD split ASCII map:** §1→`01-vision` · §2→`02-systems` · §3→`03-unlock-ladder` · §4→`04-combat-balance` ·
  §5→`05-narrative` · §6→`06-tech-architecture` · §7→`07-roadmap-scope`.

## Next intended steps
1. **Human answers X-1…X-4** (playcheck-timing · diverge×autonomy · drift-automation · E/F-vs-roadmap-agent).
2. Then execute the conflict-free lane **A → B → D → C**; hold **E → F** until the roadmap agent clears `docs/`.
3. Final adversarial review pass over A–F before declaring v2 done.

## Landmines
- **Concurrent roadmap agent is live in `docs/` + `pending-prd-changes.md`.** I edited
  `pending-prd-changes.md` + `path-to-v0.3.md` this session — watch for cross-agent edit collisions. Do NOT
  build E/F (doc-heavy) until that lane clears.
- **ADR IDs D-070–D-072 are provisional** — re-confirm next-free at apply; the roadmap agent may also be adding
  ADRs (it owns D-060 = the re-axe).
- **Whole-repo verify-on-commit** (once A lands) means any dirty file *anywhere* blocks any commit — fine when
  green, but two active agents can cross-block; `SKIP_VERIFY=1` is the escape.
- Historical `prd/§…` refs intentionally left in journals/archive/raw-snapshots/closed-feedback (immutable logs).

---

## Build log — Workstream A+B (drift-aware full-verify gate) — LANDED

**What:** pre-commit now runs the full `npm run verify` (~3–4.5s) instead of the content-aware fast subset, so
commits can't be red and now run the **test suite** (the old hook's blind spot). Wrapped in a soft 5s drift
timer (green/amber/red; appends `tmp/precommit-timings.tsv`; **never blocks on time**). Added
`npm run verify:budget` (the explicit hard-fail check — per-gate breakdown + median-of-3) and a non-blocking
`pre-push` hook that surfaces it loudly. `pacing:check` folded into `verify`.

**Files:** `.githooks/pre-commit` (rewrite) · `.githooks/pre-push` (new) · `src/scripts/verify-budget.ts` (new) ·
`package.json` (verify += pacing:check; + verify:budget script).

**Verified:** `npm run verify` PASS · `npm run verify:budget` → median 4.46s / 0.54s headroom (inflated by the
concurrent diverge-design workflow); vitest is the fattest gate (32%). X-3 honored: noisy, never blocking.

**Also fixed:** a stray `</content>` this journal leaked on first write, and the same class of leak
(`</content></invoke>`) pre-existing at the EOF of `project/status/pending-prd-changes.md`.

**Next:** Workstream D (playcheck — build-now per X-1) → C (diverge skill, from the design-panel workflow).
E/F held per X-4.

---

## Build log — Workstream D (playcheck) — LANDED

**What:** `src/playcheck.ts` — the fun-factor §3 vector asserted headlessly over the REAL engine, RATCHET mode.
Deliberately **non-redundant**: `minutesPerRung` stays owned by `pacing:check` and the combat win-curve by
`m2.test` (both already in `verify`); playcheck **hard-gates the two §3 proxies nothing else measures** —
`firstActionMs` (the <5s cold-open hook) and `maxDeadTimeMs` (no-dead-time) — and presents the whole vector as
a dashboard. Reuses `walkPacing()` + `foeForecasts()` (the reel-back's "pure wiring").

**Baseline (blessed):** firstActionMs 0.48s · maxDeadTimeMs 0.48s · monkey curve 0.32/0.67/0.88/0.99/1.00 ·
R0/R1/R2 = 31.1/35.4/38.3 min. Gate: firstActionMs absolute 5s cap; maxDeadTimeMs ratchet = max(1.5×baseline,
3s floor) so sub-3s noise never trips.

**Teeth:** `src/playcheck.test.ts` proves the pure `evaluate()` passes the green build but goes RED on a slow
hook (9s) or a dead-time regression (99s). The diverge design panel `diverge-skill-design` completed; raw
snapshot at `project/brainstorms/raw/2026-06-29-diverge-skill-design.json`.

**Files:** `src/playcheck.ts` (new) · `src/playcheck.test.ts` (new) · `playcheck.baseline.json` (new, blessed) ·
`package.json` (playcheck + playcheck:check; verify += playcheck:check) · `.prettierignore` (+baseline).

**Verified:** full `npm run verify` PASS (incl. playcheck:check + the teeth test; 103 tests).

**Next:** Workstream C (author `.claude/skills/diverge/SKILL.md` from the design panel). E/F held per X-4.

---

## Build log — Workstream C (diverge skill) — SKILL.md + registry LANDED (CLAUDE.md rule + ADR deferred to F)

**What:** authored `.claude/skills/diverge/SKILL.md` from the verified design panel. Spine =
**branch-preservation**: the winner collapses into `main` **flag-free**; losing variants live on a retained
`diverge/<surface>` git branch + committed screenshots, so `main`'s resting flag-debt is **ZERO** — directly
answering the human's X-2 flag-rot worry. Caps: 3 open diverges · 2 durable kept-flags · 3 variants/set.
Self-pick rubric (Intentionality hard-gate + conservative tiebreak); R-item with a 14-day **auto-confirm** TTL
so silence is safe & lossless. Created the registry stub `project/audit/variants-log.md`.

**Deferred — build JIT on the first real diverge** (can't test variant tooling with no `src/ui/variants/`):
`qa-shots --variant`, `src/scripts/variant-gc.mjs`, the pre-commit isolation guard. Documented in the skill §0.

**Held to Workstream F (X-4):** the CLAUDE.md "design by divergence" rule + the ADR (D-071) — doc-heavy,
collision-prone with the live roadmap agent. *Directive #2/#4's CLAUDE.md change is queued, not dropped.*

**Files:** `.claude/skills/diverge/SKILL.md` (new) · `project/audit/variants-log.md` (new registry stub).

**Next:** E + F held per X-4 until the roadmap agent clears the docs lane → F lands CLAUDE.md rule + ADRs
D-070…D-072; E does the ASCII PRD split. Then the final adversarial review over A–F.

---

## Build log — Adversarial review of A/B/D/C + 15 fixes — LANDED

**What:** ran a `Workflow` adversarial review (4 lenses → each finding skeptic-verified) over the committed
op-model infra. **15 findings confirmed, 0 refuted** — all in conflict-free files, all fixed this batch. Report:
`project/audit/reports/2026-06-29-opmodel-v2-review.md`; raw snapshot
`project/brainstorms/raw/2026-06-29-opmodel-review.json`.

**Highlights:**
- **Gate infra:** pre-commit journal-gate SIGPIPE (pipefail + `grep -q`) → here-string; `verify-budget` median
  failure now exits 2 (not 1, the over-budget code); a mistyped `VERIFY_BUDGET_MS` no longer silently disables
  the guard (validated → exit 2).
- **playcheck:** the gates had no real teeth — `firstActionMs` had only the 5s cap, `maxDeadTimeMs`'s ratchet was
  inert under the 3s floor. Reworked to a `3× baseline / 2s floor` ratchet on both (now reads `base.firstActionMs`);
  the test was tautological (derived its own baseline) → now loads the **committed** baseline + exercises the
  ratchet boundary (2.1s RED / 1.9s GREEN); reward signal gained `level↑`. **De-duped the policy**: extracted
  `focusedOptimalIntent()` in pacing-report, both it and playcheck call it — `pacing:check` confirms identical
  numbers.
- **diverge skill:** 5 process gaps closed (first-diverge §0 setup; blend promotes to main + resets TTL; single-
  idea files a `deferred-single-idea` tracker; keep-flags-at-cap is gated; "untouched" = no human verdict).

**Files:** `.githooks/pre-commit` · `src/scripts/verify-budget.ts` · `src/scripts/pacing-report.ts` (extract
`focusedOptimalIntent`) · `src/playcheck.ts` · `src/playcheck.test.ts` · `.claude/skills/diverge/SKILL.md` ·
`project/audit/variants-log.md` · `project/audit/reports/2026-06-29-opmodel-v2-review.md` (new).

**Verified:** `npm run verify` PASS (104 tests); `pacing:check` unchanged; `VERIFY_BUDGET_MS=5s` → exit 2.

**Status:** the conflict-free lane (A/B/D/C) is built, reviewed, and hardened. **E + F remain held per X-4**
(roadmap agent still live). Awaiting the human's go on the docs lane.

---

## Build log — Workstream E TOOLING (split-prd + verify-prd) — READY, not applied

**What (conflict-free prep while E is held under X-4 — touches only `src/scripts/`, never `docs/`):** built the
mechanical PRD-split tooling so E becomes one command when the roadmap agent clears the docs lane. **NOT run
against `docs/living/`** — tested against a `tmp/` copy.
- `src/scripts/split-prd.ts` — splits `docs/living/prd.md`'s `# §1…§7` into ASCII-named files under
  `docs/living/prd/` + rewrites `prd.md` as a stub index (preamble + links). **Asserts a byte-exact round-trip**
  (preamble + concat(sections) == original) before writing anything; dry-run by default, `--apply` to write.
- `src/scripts/verify-prd.ts` — the completeness gate: 7 ASCII sections present, contiguous §1…§7, non-
  truncated, linked from the index. **SAFE-WHEN-ABSENT** (exits 0 if not split yet) so it can wire into
  `verify` now or at split time without breaking the build.

**Tested (tmp copy, `docs/` untouched):** dry-run + apply → round-trip OK (758,580 chars); **independent**
reconstruction (preamble + 7 files) **byte-IDENTICAL** to the original (zero content lost); `verify-prd` OK on
the split + correctly skips when absent.

**To apply E when the lane clears:** `tsx src/scripts/split-prd.ts --apply` → wire `verify-prd` into the
`verify` script → repoint the ~10 live inbound `prd.md` refs (they resolve to the stub index regardless). NOT
wired into `verify` yet (kept atomic with E).

**Files:** `src/scripts/split-prd.ts` (new) · `src/scripts/verify-prd.ts` (new).

---

## Build log — Workstream E (PRD split) — APPLIED (roadmap lane cleared)

**What:** ran `split-prd.ts --apply` → `docs/living/prd.md` (7,651 lines) split into **7 ASCII section files**
under `docs/living/prd/` (`01-vision` … `07-roadmap-scope`) + `prd.md` rewritten as a **66-line stub index**
(preamble + links). Round-trip asserted byte-exact (758,580 chars). Wired `verify-prd` into `verify` (the
completeness gate, now live). Confirmed **nothing parses `prd.md` content** (gen-docs/verify-content don't read
it) → the split is non-breaking; the 72 inbound `prd.md` refs resolve to the stub index. Updated the `names.ts`
§1.8 comment ref to the section file.

**Verified:** `verify` PASS (104 tests + verify-prd OK); `verify:budget` median **3.87s / 1.13s headroom** (9 gates).

**Files:** `docs/living/prd.md` (→ stub index) · `docs/living/prd/{01..07}-*.md` + `README.md` (new) ·
`package.json` (verify += verify-prd) · `src/core/content/names.ts` (comment ref).

---

## Build log — Workstream F (ADRs + CLAUDE.md) — LANDED; D-070/D-071 RECONCILED

**⚠️ Key reconciliation:** the roadmap agent had committed (pre-session, `64ad701`) **D-070** (*defer* v2;
`diverge`+`playcheck` **HELD**) and **D-071** (the content-aware **<5s subset** hook) — both the **opposite** of
this session's "v2 FINAL" build. Per **newest-human-steer-wins**, **D-072 supersedes both** (annotated
`⛔ REVERSED by D-072 (2026-06-29)`, struck-not-deleted). This is exactly the collision X-4 guarded against.

**New ADRs (each with a `created_date:`, previewing the requested convention):**
- **D-072** — Operating Model v2 ADOPTED; full-`verify` pre-commit + 5s drift guard. **Supersedes D-070 + D-071.**
- **D-073** — Design by divergence (the mandatory `diverge` gate; promotes DS#10, un-held from D-070).
- **D-074** — Experience is a continuous ratchet (`playcheck`), scoped (un-held from D-070).

**CLAUDE.md:** pre-commit line → full `verify` (~3s) + `SKIP_VERIFY` + the drift guard; **+ "Design by
divergence" rule + the enforcement-ladder sentence** (gate > hook > skill > norm); listed the `diverge` skill.
Updated the FINAL plan's F section to the real numbers + the supersession.

**Files:** `docs/living/decisions.md` (D-072–074 + D-070/071 annotations) · `CLAUDE.md` ·
`docs/plans/2026-06-29-operating-model-v2-final.md`.

**v2 FINAL is now fully built (A–F).** Next: the human's follow-on ask — audit all ADRs for staleness +
backfill `created_date:` across the log.

---

## Build log — ADR `created_date` backfill — DONE (human request)

**What:** added `- **created_date:** YYYY-MM-DD` to all **73** `### D-0XX` ADRs — dates = **git
first-appearance** (range-encoded: D-001–017 = 06-25 · 018–045 = 06-26 · 046–047 = 06-27 · 048–055 = 06-28 ·
056–074 = 06-29). Updated the **Template + legend** so it's the convention going forward — the date is what
disambiguates *newest-steer-wins* when two ADRs touch the same ground. (D-043 left as-is — it's a `##` group
header with its date already in-title.) One-shot backfill via a throwaway `tmp/` script.

**Files:** `docs/living/decisions.md`.

**Next:** the staleness audit (a fan-out workflow over the ADR log → annotate the stale/superseded ones).

---

## Build log — ADR staleness audit — DONE (human request)

**What:** ran a 5-batch fan-out workflow over the 74 ADRs (each batch verified by a convergence critic against
the actual bodies). Applied **15 annotations**:
- **10 supersessions** (heading was ✅ + clean; a later reshape amended it): D-007/008/012/013/016/017/018/028,
  the D-043 group header, and the **D-056…D-069 batch header** (which still said op-model v2 was "deferred/HELD"
  — now `⛔ SUPERSEDED by D-072–D-074`).
- **5 tier-renumber notes** (decision holds, tier number dated): D-009/010/014/026/040 (incl. fixing **Edo T4→T5**).
- Added the **`🔁 Amended`** marker to the legend.

**Skipped deliberately** (documented in the report): 6 negligible "leave" ADRs (D-019/023/030/031/035/047),
low-confidence **D-036** (the auditor's "no Origin pillar" was a misread — Origin is a *faction*), and the
`prd.md §X` deep-links (PRD-split repointing for the future content ripple, **not** decision staleness).

Report: `project/audit/reports/2026-06-29-adr-staleness-audit.md`; raw snapshot in `project/brainstorms/raw/`.

**Files:** `docs/living/decisions.md` (15 annotations + legend) · `project/audit/reports/2026-06-29-adr-staleness-audit.md` (new).

**Session 09 complete:** op-model v2 FINAL built A–F + reviewed/hardened + the PRD split + `created_date`
backfill + this ADR staleness audit. The decision log is now internally consistent with the post-reshape,
post-v2 reality.

---

## Build log — verify gates PARALLELIZED — DONE (human request)

**What:** the human noticed the 5s budget was tight while `vitest` is only ~30% of it. Replaced the sequential
`verify` `&&` chain with **`src/scripts/verify-run.ts`** — a worker-pool runner (default concurrency = CPU
count; `VERIFY_CONCURRENCY` to override) that fans the **9 independent read-only gates** out, captures each
one's output, and **joins at the end** (failures print their captured output; exit non-zero on any failure).

**Result: ~1.7s wall (median 1.64s), down from ~4s — 3.36s of headroom under the 5s budget.** The 4 heavy gates
(vitest/prettier/eslint/tsc, all ~1.5–1.65s) now overlap, so the total ≈ the slowest single gate.

Folded the budget check into **`verify-run --budget`** (median-of-3 + per-gate critical path) and **deleted**
the old `verify-budget.ts`. Kept the sequential chain as **`verify:seq`** for clean single-stream debug output.
Updated D-072 (Refined: parallel) + the CLAUDE.md pre-commit line.

**Verified:** `verify` OK 1.6s; planted a type error → reported **tsc + eslint** failures *with output* + exit 1
(2/9 gates), reverted → green. The pre-commit drift timer now runs comfortably green (~2s).

**Files:** `src/scripts/verify-run.ts` (new) · `src/scripts/verify-budget.ts` (deleted) · `package.json`
(verify → verify-run; +verify:seq; verify:budget → --budget) · `CLAUDE.md` · `decisions.md` (D-072 refined).

---

## Checkpoint — session-09 close

**State:** working tree clean; v2 FINAL (A–F) + the parallel-`verify` perf win + the `created_date` backfill +
the ADR staleness audit are all committed & `verify`-green. Refreshed the live snapshot
(`project/status/project-status.md`: verify chain → parallel `verify-run`, ADR range → D-074, the PRD-split-done
note + a session-09 phase bullet) and ticked op-model FINAL **BUILT** in the reading queue.

**⚠️ Process note (mea culpa):** I used `git add -A` earlier and **swept some of the concurrent roadmap agent's
uncommitted work** (`docs/living/roadmap.md`, `path-to-v0.3.md`, the forks-finalized ledger) into commits
`9ea5b6b` + `0bc1b42`. The content is intact & correct — **not** rewriting shared `main` history (would collide
with the live agent). **Fix going forward: stage files explicitly, never `git add -A` with a second agent live.**

**Resume:** op-model v2 / H10 is **DONE** (no longer a gate). The next big thing remains the **batched
PRD/doc/code reshape ripple** (gated on the human's extra PRD feedback) + **R1** (human plays the demo). The
PRD is now split — edit `docs/living/prd/0N-*.md`, not the `prd.md` stub.
