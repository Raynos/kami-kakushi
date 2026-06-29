# Operating Model v2 — **FINAL** (the H10 resolution)

> ✅ **ARCHIVED 2026-06-29 (executed).** Built & adopted end-to-end (session-09): parallel-`verify` pre-commit +
> drift guard, `playcheck` ratchet, `diverge` skill, the PRD split, ADRs **D-072–D-074** (D-072 reverses the
> earlier "defer v2" call). The canon now lives in the gates/hooks/skills + those ADRs; this plan is retained
> as the **as-executed historical artifact — do not edit.**

> **What this is.** The decided, build-ready operating-model plan. It **superseded both** prior drafts —
> [`operating-model-v2-implementation.md`](./2026-06-28-operating-model-v2-implementation.md)
> (the maximalist ~1-week version) and
> [`operating-model-v2-lite-reelback.md`](./2026-06-29-operating-model-v2-lite-reelback.md)
> (the drop/cut/keep reel-back). Both are also **archived** here under `project/archive/`. This file was the canon
> plan for **H10**.
>
> **Authored 2026-06-29** from the human's 8 directives (this session) + **measured** gate timings (not
> guessed). The headline measurement reshapes the whole pre-commit story (see §0).
>
> **Status: plan, not yet applied.** When the human OKs a workstream, that workstream gets built. Routing of
> the 8 directives across the three live docs is in §1.

---

## 0 · The measurement that changes everything (real numbers, this machine, 2026-06-29)

The original plan budgeted "~15–30s" for `verify` and built an elaborate content-aware fast-subset hook to
dodge it. **Measured, the whole suite is an order of magnitude faster:**

| Gate | Time | | Gate | Time |
|---|---|---|---|---|
| `tsc --noEmit` | 0.60s | | `vitest run` (99 tests / 13 files) | 0.96s |
| `eslint .` | 0.61s | | `verify-content` | 0.17s |
| `prettier --check .` | 0.49s | | `gen:docs --check` | 0.15s |
| `smoke` (core boot) | 0.13s | | `pacing:check` | 0.16s |
| **Full `npm run verify` end-to-end** | **3.03s** | | **+ `pacing:check`** | **~3.2s** |

**Consequence:** the full `verify` + `pacing:check` runs in **~3.2s — comfortably inside the 5s box.** So
pre-commit does **not** need to cherry-pick a fast subset (the current content-aware hook *skips the test
suite by design* — its biggest blind spot). It can run **everything**, every commit, and still be fast. This
collapses directives #3 and #6 into a one-line hook and makes the **drift guard (#7)** the only subtle part.

---

## 1 · Routing the 8 directives (what lives here vs. elsewhere)

Per the human's steer — *anything that belongs in the roadmap or the pending-PRD doc goes there, not here.*

| # | Directive | Home | Why |
|---|---|---|---|
| **1** | Fun slices into the roadmap | → **roadmap re-axe plan** (already done) | The [re-axe proposal](2026-06-29-roadmap-reaxe-proposal.md) **already** nests Tier→Milestones→Fun-slices and bakes **DIVERGE / playcheck** in as forward DoD contracts. This plan only *defines the gates* those slices reference. |
| **2** | `diverge` skill + CLAUDE.md | **HERE** — Workstream **C** | New process artifact. |
| **3** | `verify` in pre-commit (5s budget) | **HERE** — Workstream **A** | Measured: full `verify` fits. |
| **4** | Design-by-divergence ADR + CLAUDE.md | **HERE** — Workstream **C** + **F** | ADR + rules. |
| **5** | PRD split + fix all PRD refs | **HERE** — Workstream **E** (mechanical); downstream *content* ripple stays in **[pending-prd-changes.md](../../project/status/pending-prd-changes.md)** | The split itself is an operating-model fix (kills the truncation failure class); the per-section content edits are already tracked as item ⓪ + the ripple checklist there. |
| **6** | `pacing:check` into `verify` | **HERE** — Workstream **A** | 0.16s; fold into the `verify` script. |
| **7** | 5s-budget drift sanity check | **HERE** — Workstream **B** (the one genuinely new design) | Nothing exists yet. |
| **8** | Implement `playcheck` (scoped) | **HERE** — Workstream **D** | Ratchet, 4 wiring-proxies, reuse `pacing-report`. |

---

## 2 · Workstreams

### A · Pre-commit runs the full gate (directives #3 + #6) — *do first, ~30 min*

**Decision:** retire the content-aware fast-subset hook; run the **full `verify`** (which now *includes*
`pacing:check`) on every commit. The current hook's deliberate "does NOT run the test suite" is the gap we're
closing — **tests (0.96s) are the highest-value thing the current hook skips.**

1. **Fold `pacing:check` into the `verify` npm script** so there's one gate name:
   ```jsonc
   "verify": "tsc --noEmit && eslint . && prettier --check . && vitest run && tsx src/scripts/verify-content.ts && tsx src/scripts/gen-docs.ts --check && npm run pacing:check && npm run playcheck:check"
   ```
   (`playcheck:check` added by Workstream D; until then the clause is omitted.)
2. **Rewrite `.githooks/pre-commit`'s `run_checks`** to a single `npm run --silent verify`, keep the
   `SKIP_VERIFY=1` escape (docs-only commits) and the unchanged journal-hygiene gate.
3. Wrap it in the **drift timer** from Workstream B.

> **Why not keep the clever content-aware hook?** At 3.2s for *everything*, the per-file routing buys nothing
> and costs the test-suite blind spot. Simpler hook, complete coverage, still fast.

### B · The 5s-budget drift guard (directive #7) — *the new design, ~1 session*

**The problem:** the 5s box is real today but **will drift** as the codebase grows (5.1k LOC / 99 tests now).
We want to *know* the moment it crosses, on the machine that matters, under real conditions — and never block a
commit just because the laptop was busy.

**The design — a soft, self-reporting timer in the hook (warn, never fail):**

1. The pre-commit wraps its `verify` run in a wall-clock timer. After it completes:
   - **< 4.0s (green):** silent.
   - **4.0–5.0s (amber):** print `⚠ pre-commit took {X}s — approaching the 5s budget.`
   - **> 5.0s (red):** print a prominent `⚠⚠ pre-commit took {X}s — OVER the 5s budget. Time to trim or speed
     up the gate (see docs/plans/.../#B).` **Still exits 0** — a slow machine must not block a commit.
2. **Trend visibility:** append `{epoch}\t{seconds}\t{loc}\t{testcount}` to a git-ignored
   `tmp/precommit-timings.tsv` each run, so drift is a readable curve, not a surprise. (Cheap; `tmp/` is
   already git-ignored.)
3. **A deliberate `verify:budget` script** (`src/scripts/verify-budget.ts`): runs `verify` 3× cold, takes the
   median, prints the per-gate breakdown + the headroom, and **exits non-zero if median > 5.0s**. This is the
   one place a hard-fail lives — and it only fires **when explicitly invoked** (it's a decision tool, not a
   passive gate).
4. **A `pre-push` hook** (`.githooks/pre-push`) runs `verify:budget` and prints its verdict **loudly**, but
   **always exits 0 — it never blocks the push.** So drift gets surfaced at a natural checkpoint (push) without
   ever stopping the work in flight.

> **The X-3 principle (human, 2026-06-29): noisy, never blocking.** All three signals — the in-hook commit
> timer, the `pre-push` `verify:budget` verdict, and the `verify:budget` script itself — are *loud* about drift
> so an agent **chooses** to debug the budget when it makes sense (in the background, between tasks). **None of
> them hard-block** the commit/push of whatever bug or feature is in flight. The single hard-fail is reserved
> for an **explicit** `npm run verify:budget` — the moment you actually sit down to decide the box is blown and
> act (trim a gate, parallelize, or raise the box deliberately).

### C · The `diverge` skill + its rule (directives #2 + #4) — *~1 session, independent*

Locked **MANDATORY** for new/major UI surfaces (DS#10, human's 2026-06-29 steer). The core loop is the
original plan's §4: frame within the woodblock/ink bible → generate **2–3 genuinely distinct variants** (behind
a `?variant=A|B|C` DEV flag) → screenshot each headlessly via `capture-game-states` → self-review each against
`ui-design.md` → emit **one contact sheet** `tmp/variants/<surface>/contact.md` → **self-pick** (X-2) → file an
**R-item**. Tweaks are exempt.

**But X-2 promotes this from a process doc to a real design problem.** Self-pick + R-item means losing variants
**persist behind DEV flags until the human resolves the R-item** → unmanaged, that's *feature-flag debt that
rots the build*. So `.claude/skills/diverge/SKILL.md` must additionally specify (design panel
`diverge-skill-design` is producing this):

- **A bounded variant feature-flag model** — variants vary the **render layer only** (the pure core stays
  single), isolated per-surface so deletion is a clean cut.
- **A flag lifecycle + GC** — create → live behind `?variant=` → human picks/blends/rejects → **losers deleted,
  winner promoted to the plain render path, flag + dead code removed.**
- **A flag-debt discipline** — a **WIP cap** on concurrent unresolved variant-sets, a **variant-flag registry**,
  and what the agent must do at the cap; a debt readout surfaced to the human.
- **An autonomy policy** — self-pick criteria, R-item filing, and a **stale-R-item escalation/expiry** default
  (so unreviewed variants auto-resolve to the self-pick rather than accumulating forever).

- The CLAUDE.md rule + ADR land in Workstream F.

### D · `playcheck` — scoped (directive #8) — *~1 session*

The one substantial build, **scoped per the reel-back**: ratchet-mode only, the **4 proxies that are pure
wiring** (defer the other ~4 + threshold/slice mode until a slice needs them — those live as forward DoD
contracts in the roadmap).

- **Reuse, don't rebuild:** `pacing-report.ts` already drives the pure core in Node and already computes
  `minutesPerRung` (via `walkPacing()`) + sampled win-rate. Build a **thin `src/playcheck.ts`** (not the
  original's whole `src/playcheck/` tree) that lifts those symbols into a 4-field `ProxyVector`:
  `minutesPerRung` · `combatWinCurve` · `firstActionMs` · `maxDeadTimeMs`.
- **`playcheck.baseline.json`** — the committed ratchet. `playcheck:check` (ratchet mode) fails only on a
  **regression below baseline**; the baseline rises when a slice ships. Pinned seed (`SEED = 20260626`), single
  uninterrupted `newGame→play` run (qa-playtesting §3 invariant).
- **Wire into `verify`** (the `playcheck:check` clause in Workstream A) once it's green and measured < ~0.5s.
- **Prove it has teeth:** revert the v0.2 combat curve on a throwaway branch → `playcheck:check` must go red on
  `combatWinCurve`. That red is the proof.

> **Threshold/slice mode is deferred,** not dropped — when the roadmap's first fun-slice ships, it gets its
> absolute §3 targets then. The roadmap already references "scoped `playcheck` ratchet (4 wiring-proxies)" as a
> cross-cutting forward contract.

### E · Split the PRD (directive #5) — *mechanical, ~1 session; downstream ripple tracked elsewhere*

This is item **⓪ DO FIRST** in [pending-prd-changes.md](../../project/status/pending-prd-changes.md) (DS#6 /
H8) — pulled into this plan because it's an operating-model fix: it **removes the truncation failure class**
that has bitten doc edits.

- **Split** `docs/living/prd.md` (7651 lines, §1–§7) → **per-section files with ASCII (not unicode) names**
  (human's 2026-06-29 steer — no `§` in filenames) + a tiny `prd/README.md` index. **Zero content change** —
  a pure mechanical cut. The locked file map:

  | § | Title | File |
  |---|---|---|
  | §1 | Vision, Pillars, Factions, World & Endgame | `docs/living/prd/01-vision.md` |
  | §2 | Systems & Mechanics Catalog | `docs/living/prd/02-systems.md` |
  | §3 | Incremental Unlock Ladder (UI-as-progression) | `docs/living/prd/03-unlock-ladder.md` |
  | §4 | Combat, Progression & Balance Model | `docs/living/prd/04-combat-balance.md` |
  | §5 | Act-by-Act Narrative & Content | `docs/living/prd/05-narrative.md` |
  | §6 | Tech Architecture & Data Model | `docs/living/prd/06-tech-architecture.md` |
  | §7 | Milestone Roadmap, v1 Scope & Deployment | `docs/living/prd/07-roadmap-scope.md` |

  (Ordered numeric prefix → sorts correctly; short ASCII slug → self-documenting. The `§N` notation stays in
  *prose* headings inside the files; only the **filenames** are ASCII.)
- **Add a completeness check** (`src/scripts/verify-prd.ts` or fold into `verify-content`): every section file
  present, no section truncated, the index links resolve. Wire into `verify`.
- **Fix all PRD references** — **72 files** reference `prd.md` today. Most are historical (journals,
  `brainstorms/raw/` JSON snapshots) and should be **left as-is** (immutable logs). Update the **live** pointers
  only: `CLAUDE.md`, `README.md`, `docs/README.md`, `docs/living/{roadmap,fun-factor,qa-playtesting,decisions}.md`,
  `project/status/*`, `project/docs-to-read-for-human.md`, and `src/scripts/session-brief.sh` /
  `src/core/content/names.ts` if they path to it. Strategy: keep `prd.md` as a **stub index** that links the
  per-section files, so stale links still resolve to the index rather than 404.
- **Routing:** the *content* edits to each section (the tier reshape, pacing, combat, …) **stay in
  pending-prd-changes.md's ripple checklist** — splitting just means each of those edits now lands in a small
  file. This workstream is **only the split + checker + live-ref fixups.**

### F · ADRs + CLAUDE.md edits (directive #4) — *~30 min, after C/D land*

**New ADRs — APPLIED as D-072–D-074** (the roadmap agent had since added D-070/D-071, so the planned D-070+
numbering shifted up; D-072 explicitly **supersedes** those two — see below):

- **D-072 — Operating Model v2 ADOPTED; full-`verify` pre-commit + a 5s drift guard. SUPERSEDES D-070 + D-071.**
  D-070 had *deferred* v2 and D-071 recorded the content-aware <5s subset hook; the human's "v2 FINAL" reversal
  this session adopts the bundle and runs the whole suite (measured ~3.2s) instead of the subset. Both reversed
  ADRs annotated `⛔ REVERSED by D-072` (annotate-don't-delete).
- **D-073 — Design by divergence.** The mandatory `diverge` gate (branch-preservation → zero `main` flag-debt);
  promotes **DS#10** from steer to canon (un-held from D-070).
- **D-074 — Experience is a continuous ratchet (`playcheck`), scoped.** The 2 owned proxies run in `verify`
  every commit; absolute per-slice thresholds attach when a slice ships. Un-held from D-070.

**CLAUDE.md edits:**
- *How to work here* → the pre-commit line gains "runs the full `verify` (~3s) — bypass docs-only with
  `SKIP_VERIFY=1`" (it currently says the hook is fast-subset).
- *Conventions* → **+2 lines:** **Design by divergence** (the D-073 rule) and **one** lean enforcement-ladder
  sentence ("push each quality rule to the highest rung that can hold it: gate > hook > skill > norm" — a
  sentence, not the original's section).
- *Layout* → list the `diverge` skill alongside the others.
- **Norms, not gates** (the reel-back's call, kept): "report pessimistically, prove optimistically" and
  "every correction becomes a check" go in as **CLAUDE.md norms** — **no** `check-feedback-closed` /
  `ship-slice` gate is built (those were the over-engineering the reel-back cut).

---

## 3 · What this plan deliberately DROPS (from the original §3/§5/§2c)

Carried over from the reel-back's verdict, so it's on the record:

- ❌ **`check-feedback-closed.ts` + the `Enforced-as` column** → a CLAUDE.md **norm**, not a red gate.
- ❌ **`ship-slice.ts` ceremony** (asserting an audit file *exists with the right headers*) → collapse to
  `ship` = `verify` + the slice's `playcheck` threshold, if/when needed.
- ❌ **`slice-manifest.json` + `check-slice-manifest.ts`** → **D-054's** existing CI manifest check already
  covers milestone integrity; don't build a parallel grep-gate.
- ❌ **The "Enforcement Ladder" section** → one sentence in *Conventions*.

---

## 4 · Build sequence

**Reordered for the concurrent-roadmap-agent (F-4): code/infra first, doc-heavy held.**

```
── conflict-free lane (touches .githooks/, package.json, src/, .claude/skills/) ──
A  pre-commit = full verify + pacing:check    (~30 min)   ◄ do first, immediate safety win
B  drift guard (in-hook timer + verify:budget)(~1 sess)   ◄ pairs with A
D  playcheck (4 proxies, ratchet, in verify)  (~1 sess)   ◄ gated on X-1
C  diverge skill                              (~1 sess)   ◄ independent; behavior gated on X-2
── HELD until the roadmap agent clears the docs lane (X-4) ──
E  PRD split + completeness check + ref fixups (~1 sess)   ◄ stub-index prd.md (F-3)
F  ADRs D-072–D-074 + CLAUDE.md edits         (~30 min)   ◄ after C/D land + docs lane clear
── final ──
✓  adversarial review pass over A–F before declaring v2 done
```

**Total ≈ 2–3 sessions** (matches the reel-back's lean estimate; the original was ~1 week).

---

## 5 · Forks — RESOLVED (human, 2026-06-29)

| Fork | Resolution |
|---|---|
| **F-1 · Drift guard severity** | **(a)** — warn-in-hook (green/amber/red, never blocks) + a hard-fail `verify:budget` script as the deliberate check. |
| **F-2 · `playcheck` home** | **(a)** — thin `src/playcheck.ts` reusing `pacing-report` symbols. |
| **F-3 · `prd.md` after the split** | **(a)** — becomes a stub **index** linking the `prd/0N-*.md` files; the 72 stale refs still resolve. |
| **F-4 · directive #1 routing** | **No duplication** — fun-slices-into-roadmap is owned by **a separate, concurrently-active roadmap agent**. This plan only *defines* the gate-contracts (DIVERGE, `playcheck`) those slices reference; **it must not edit `roadmap.md` or the re-axe proposal.** |

> **Concurrency rule (from F-4):** a second agent is live in the **roadmap / `docs/`** space. To avoid
> mid-edit collisions, this plan's build order is **reordered** (§4): the **code/infra** workstreams
> (A/B/D/C — `.githooks/`, `package.json`, `src/`, `.claude/skills/`) land first; the **doc-heavy** ones
> (**E** PRD split, **F** ADRs/CLAUDE.md) are **held** until the roadmap agent is done.

---

## 6 · Pre-execution decisions — RESOLVED (human, 2026-06-29) — execution cleared

The forks settled *what to build*; these settled *how to execute*. **All resolved — the build is go**
(conflict-free lane now; E/F held per X-4).

| # | Decision | Resolution |
|---|---|---|
| **X-1 · `playcheck` timing** | **Build now.** The harness reuses `pacing-report` and is reshape-agnostic; only the baseline JSON churns, and it guards the T0 reshape build from regressions as it lands. |
| **X-2 · `diverge` × autonomy** | **Self-pick + file R-item** (never blocks). **BUT** the human flagged the consequence: losing variants persist behind DEV flags ⇒ **flag debt**. So `diverge` is designed as a **bounded feature-flag A/B/C system** — the skill must specify the variant-flag **lifecycle, a WIP cap, GC-on-resolution, and explicit maintenance + autonomy best-practices** so the flags can't rot the build. *(Design panel running: workflow `diverge-skill-design`.)* |
| **X-3 · drift-guard automation** | **Both — but noisy, never blocking.** Ship the `verify:budget` script (hard-fails **only when explicitly run** — it's a decision tool) **and** a `pre-push` hook that runs it as a **loud, non-blocking** warning, **plus** the in-hook commit timer. Principle: the gates are *loud enough that an agent chooses to debug drift when it makes sense*, but **never hard-block the task in flight**. |
| **X-4 · when do E + F land?** | **Hold E/F** until the human confirms the roadmap agent has cleared the `docs/` lane. |

**Notes (defaults taken):**
- **Pre-commit whole-repo `verify`:** `eslint .` + `prettier --check .` now run repo-wide every commit — so any
  unformatted/lint-dirty file *anywhere* (incl. one the roadmap agent leaves) blocks the commit. Correct
  behavior (the repo should be green), but with two agents active it can cross-block; `SKIP_VERIFY=1` is the
  escape. The redundant `smoke` step drops from the hook (`verify`'s `tsc`+tests subsume it).
- **ADR IDs:** *(resolved at apply)* the roadmap agent **did** add D-070/D-071 meanwhile — and they *deferred*
  v2, the opposite of this plan. The new ADRs landed as **D-072–D-074**, with **D-072 explicitly superseding
  D-070 + D-071** (both annotated `⛔ REVERSED`). The collision X-4 guarded against was real and is reconciled.
- **PRD section sizes:** §2/§4/§5 stay large (~1.4–1.6k lines each) even after the 7-way split; that's per DS#6
  ("per-section files"). The 7.6k-monolith truncation class is gone; sub-splitting is out of scope.
- **Commit cadence:** one commit per workstream (project norm); each leaves the build green + a journal entry.
- **Final pass:** after A–D land, an **adversarial review** (multi-lens: hook correctness, drift-timer math,
  `playcheck` teeth, diverge quality, ADR consistency) before declaring v2 done.

Answer **X-1…X-4** (or "defaults are fine") and I'll execute A → B → D → C, then E → F once the roadmap lane clears.
