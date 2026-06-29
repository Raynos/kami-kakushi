# Operating Model v2 — "v2-lite" reel-back map

> **What this is.** A reel-back analysis of [`2026-06-28-operating-model-v2-implementation.md`](2026-06-28-operating-model-v2-implementation.md)
> (H10), produced 2026-06-29 after the human called the v2 plan *"a draft and overengineered."* It maps what
> to **drop / cut / keep** and proposes a leaner scope. **Advisory — for the human's separate H10 review.**
> Nothing here is applied; H10 stays review-only until signed off.
>
> **Headline:** the full plan = **4 new bespoke `verify`-gates + 1 ceremony script + 2 skills + 4 ADRs + a
> CLAUDE.md rewrite (~1 week)**. The genuinely high-value core is ~2 things. v2-lite ≈ **2–3 sessions**.
>
> **2026-06-29 decisions already folded in** (these override the original analysis where noted):
> diverge = **MANDATORY** (human steer, not opt-in) · roadmap re-axe = **nested per-tier** (not flat S0–S4;
> see [`2026-06-29-roadmap-reaxe-proposal.md`](2026-06-29-roadmap-reaxe-proposal.md)) · H8 PRD-split = decided
> **separately** (split as part of the batched ripple, not "absorbed by H10").

## 1 · MOOT / already-done (drop on sight)

- **H4 / "ban SHIPPED-slice"** — proposed as plan §2 + §7 ADR (its "D-049"), but **D-054 already shipped it**
  ("Resolves H4" + the CI manifest check). The milestone-integrity ADR is redundant; only the *fun-slice
  re-axe* is novel.
- **ADR-numbering collision** — §7 proposes **D-048–D-051**, but the tier reshape **consumed D-048–D-055**.
  Every ADR number in §7/§8 is stale → renumber to **D-056+** at apply time.
- **H8 (PRD split)** is *claimed*-absorbed but the plan contains **no mechanism** for it — it was orphaned.
  (Now decided on its own: split into `prd/§1…§7.md` as part of the batched ripple.)
- **`pacing-report.ts --check` already exists and already goes red** — wiring it into `verify` is **hours,
  not a week**.

## 2 · OVERENGINEERED / cuttable (the core of the reel-back)

- **§5 Corrections→Checks gate (`check-feedback-closed.ts` + the "Enforced-as" column)** — highest ceremony,
  lowest ROI. A build-gate that greps your feedback-log markdown for a non-empty cell is brittle
  process-for-its-own-sake (F1–F4 were 4 trivial UI fixes). → **Make it a CLAUDE.md norm, not a red gate.**
- **§3 `ship-slice.ts` ceremony** — a halt-on-fail that asserts an audit file *exists with the right `##`
  headers*. Gating on the *presence/shape* of a markdown file is theater (the plan admits it "can enforce the
  audit's presence + shape, not its honesty"). → **Collapse to `ship` = `verify` + `playcheck --slice`.**
- **§2c slice-manifest + `check-slice-manifest.ts`** — a second bespoke gate that greps for test-name
  strings; overlaps D-054's manifest check. → **Fold into D-054's existing mechanism**, don't build a parallel one.
- **The "Enforcement Ladder" CLAUDE.md framework** — elegant but meta-doctrine; the bar is lean. → **One
  sentence, not a section.**
- **§4 `diverge` as a mandatory gate** — the original reel-back flagged this as 2–3×'ing every panel's UI
  cost and recommended opt-in. **⚠️ OVERRIDDEN 2026-06-29: the human chose MANDATORY.** Kept as a mandatory
  contact-sheet gate; the cost is accepted as the anti-slop price.

## 3 · LEAN KEEP

- **#0 — pre-commit hook runs `verify`** (~20 lines + `SKIP_VERIFY=1`). The keystone — *"the agent can
  currently commit red."* Highest leverage, near-zero cost. **Do first.**
- **#1 — `playcheck`** — the one substantial, justified build, but **scope it down**: ship **ratchet-mode in
  `verify`** with the ~4 proxies that are pure wiring (`minutesPerRung` via `walkPacing()`, `combatWinCurve`,
  `firstActionMs`, `maxDeadTimeMs`). **Defer** the other ~4 proxies + threshold-mode until a slice needs them.

## 4 · Proposed v2-lite scope (~2–3 sessions, vs ~1 week)

1. **#0 hook → `verify`** (+`SKIP_VERIFY=1`). *Hours.* — do first.
2. **Wire the existing `pacing:check` into `verify`.** *Hours.*
3. **`playcheck` ratchet, 4 wiring-proxies, ratchet-mode in `verify`.** *~1 session.*
4. **Re-axe the roadmap** → the **nested per-tier** structure (Tier → Milestones → Fun-slices). *Hours (doc) → 1 ADR.*
5. **`diverge` skill — MANDATORY contact-sheet gate** (per the human's steer). *~1 session, independent.*
6. **CLAUDE.md: +2 norm-lines** (report-pessimistically; corrections-become-checks) — **norms, not gates.**

Net: drops 3 of 4 new gates + the ceremony script + 3 of 4 ADRs.

## 5 · The §0 forks (D-a…D-f), re-stated + recommendation

| Fork | Question | Reco |
|---|---|---|
| **D-a** | Full `verify` per commit? | **Yes** — agent isn't latency-sensitive; `SKIP_VERIFY=1` for docs. |
| **D-b** | Re-axe M3–M7 → slices? | **Yes — DECIDED** (nested per-tier; the single highest-value idea). |
| **D-c** | Ban SHIPPED-slice? | **MOOT — done by D-054.** Drop the fork. |
| **D-d** | `playcheck` in `verify` (ratchet) vs ship-only? | **Ratchet-in-verify if <5s; measure first** (plan's own caveat). |
| **D-e** | Divergence mandatory? | **MANDATORY — DECIDED** (human steer; overrides the reel-back's opt-in reco). |
| **D-f** | Are the slice cuts right? | Now the **nested per-tier** cut — the human's design call via the roadmap proposal. |

## 6 · For the human's review

The lean spine is **#0 (verify-on-commit) → #1 (playcheck ratchet)**. The rest is process ceremony to weigh
against velocity. The mandatory `diverge` gate is the one place you've chosen *more* rigor than the reel-back
suggested. Decide D-a/D-d at review; D-b/D-c/D-e are settled; D-f flows from the roadmap proposal.
