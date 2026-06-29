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
