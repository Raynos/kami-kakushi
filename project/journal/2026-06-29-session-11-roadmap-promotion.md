# Session 11 — 2026-06-29 — Finalize the 5 forks + PROMOTE the roadmap re-axe to living canon

**Summary:** Ran the human through the **5 remaining provisional forks** on the roadmap re-axe proposal and
got **finalized decisions** (all five confirmed the recommended defaults). On the human's go-ahead, **promoted
the proposal → `docs/living/roadmap.md`** — retiring the old M0–M7 milestone tracker — and rippled the
"promoted" state through the reading queue, the path-to-v0.3 conductor, and the live status snapshot. Also
settled a naming question: **T2 stays "Village"** (consistent with the social-scale ladder
Estate→Village→Region→Castle-town→Edo) with a **sharpened subtitle** — *"the valley beyond your gate"* — rather
than a rename. This file is HISTORY; the live snapshot is `project/status/project-status.md`.

## Decisions locked (the 5 forks — ledger: `project/human-feedback/2026-06-29-roadmap-forks-finalized.md`)
1. **Hour floors (#1)** → ACCEPT AS PROVISIONAL (T1 ~5–8h · T2 ~8–10h · ≈40 min/rung; §4 liquid, D-059;
   re-derives at Ship-M1-F2).
2. **E-stage → tier + retinue (#2)** → DEFAULT (E1→E2 in T1; E2→E3+ to T2+; first retinue Gohei & Yatarō in T1).
3. **T1 rung titles + two-track meter (#3)** → ACCEPT BOTH (Estate-Service + Combat-Rank sub-meters, Phase-1
   AND-gate; titles restyled later).
4. **Rival-house T2/T3 split (#4)** → DEFAULT (introduce + contest begins at T2; climax — Naoyuki ally-flip, G7
   dethroning — at T3).
5. **Deed-band magnitudes (#5)** → ACCEPT AS PROVISIONAL.
- **T2 name** → KEEP "Village" + sharper subtitle (no canon rename ripple).

## What changed
- `docs/living/roadmap.md` — **PROMOTED.** Reframed top matter PROPOSAL→LIVING (dropped the staleness banner),
  fixed the one sibling-relative link (`../plans/…op-model-v2-final.md`), sharpened the T2 heading, added M0–M2b
  commit provenance, and closed the forks section (all 5 RESOLVED). (The bare `cp` of the proposal was already
  committed in `0bc1b42` via a concurrent `git add -A`; these are the reframe edits on top.)
- `docs/plans/2026-06-29-roadmap-reaxe-proposal.md` — ✅ PROMOTED banner; retained as the as-reviewed artifact.
- `project/docs-to-read-for-human.md` — roadmap entry → ✅ PROMOTED (map + entry); no sign-off needed.
- `docs/plans/2026-06-29-path-to-v0.3.md` — Workstream C + next-step #2 + the ungated line marked ✅ done.
- `project/status/project-status.md` — resume step (b) marked done; latest-journal pointer → this file.
- `project/human-feedback/2026-06-29-roadmap-forks-finalized.md` — the fork-decisions ledger (NEW; committed in
  `0bc1b42` after a concurrent sweep — intact).

## Next intended steps
1. **PRD ripple — `prd/07-roadmap-scope.md` is now STALE.** The PRD was split into 7 files (`303a63f`,
   Workstream E); `prd/07` still reflects the pre-promotion roadmap. Reconcile §07 to the new living roadmap
   (this is part of the `pending-prd-changes.md` ripple, Workstream B) — the human flagged it directly.
2. The rest of the batched reshape ripple (PRD body 5-tier→6-tier, etc.) per `pending-prd-changes.md`.
3. R1 (the human play/taste call) still open.

## Landmines
- **CONCURRENCY (session-10 redux).** A parallel agent is active — it `git add -A`-swept my untracked ledger +
  the bare `cp`'d roadmap.md into its commit `0bc1b42` ("ADR staleness audit"). Recovered cleanly: ledger is
  intact + committed; the roadmap reframe edits were uncommitted and committed here via **explicit pathspec** to
  avoid sweeping the agent's in-flight work. The agent is mid-refactor of the verify scripts
  (`verify-budget.ts`→`verify-run.ts`, `package.json`, `CLAUDE.md` updated to ~1.7s parallel `verify-run.ts`) and
  is editing `decisions.md` / `journal-09` — **all excluded from this commit.**
- Committed with `SKIP_VERIFY=1` (docs-only; and the working tree carries the concurrent agent's half-finished
  verify refactor, which would fail `npm run verify` through no fault of this change). Journal gate honored.
- The old M0–M7 tracker now lives only in git history (pre-`0bc1b42`); the new roadmap's carry-forward table
  preserves the M0–M2b→T0 mapping + commit hashes.
