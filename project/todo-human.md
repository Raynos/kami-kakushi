# Human TODO — tasks + reading queue awaiting the human

> **Live queue, open items only.** Closed items are removed, not struck — git
> history is the record. This is separate from `project/human-in-the-loop/`
> (`H`-decisions + `R`-reviews); both sections here are auto-surfaced at session
> start by `src/scripts/session-brief.sh`.
>
> - **TODO** — loose tasks only you can do.
> - **Reading queue** — durable docs you haven't read or discussed yet (how the
>   agent surfaces the markdown it generated, so nothing goes unseen).
>
> **Sign-off is implicit — you never tick anything off (D-089).** Reading a doc,
> or discussing / working on it together, counts as sign-off: the agent then
> clears it and keeps this list clean for you. `/prepare-to-exit` reconciles the
> queue and asks (via AskUserQuestion) to confirm any removal it can't infer.

## TODO

- [ ] **Ask Fable 5 to review the context** — AGENTS.md, the pre-commit hook, the
  git hooks (`.githooks/`), the skills (`.claude/skills/`), hookify, etc. A
  fresh-eyes pass over the agentic scaffolding for drift / bloat / gaps.
- [ ] **Ask Fable 5 to review the current integration / e2e tests** — worry: the
  tests may be written as unit tests and not actually exercise the whole UI
  end-to-end. Want a real integration test that drives the UI + game as a player
  experiences it in Chrome (Playwright or similar), not just pure-core assertions.

_(The ⭐ taste-redo TODO **closed 2026-07-03** — done WITH Fable: D-126 lock →
taste.md rewritten (149→150 lines, prediction-tested 24/24) → ui-design culled
→ register + `doc-budgets` gate shipped. The two rewritten docs sit in the
reading queue below for your lock read; the F10 re-plan trigger has fired.)_

## Reading queue

> **What belongs here** — a durable doc whose purpose is for you to read or sign
> off: a **plan** (`docs/plans/`), a **brainstorm / retrospective for adoption**
> (`project/brainstorms/`), an **audit / battery report** (`project/audit/reports/`),
> or a **design doc awaiting a taste call**. Added in the commit that authors it
> (a pre-commit gate hard-blocks a new `docs/plans/` doc missing here,
> loud-warns the rest).
>
> **An ARCHIVED doc (`project/archive/`) NEVER belongs here** — archiving means it's
> done/superseded, and git history + `decisions.md` + the journal are its record.
> When a plan/doc is archived, remove its queue entry in the same move (any still-owed
> bit lives as an R-item in `human-in-the-loop/review.md`, not here).

**Owed reviews / taste calls (async, no rush):**

- [ ] `docs/plans/opus-2026-07-04-phase2-economy-redesign.md` — **T0 Phase-2
  economy redesign** (the REAL fix D-133 queued after the stopgap hotfix): makes
  T0 Phase 2 a ~1:1, ~40–83-min *fun* chunk instead of a threshold-inflated slog.
  **DESIGN-DIVERGENT** — proposes 3 distinct loops (multi-deed grind · staged
  estate-BUILD beats · light allocation layer; recommends the A+B hybrid) for you
  to pick at a Phase-0 diverge. **Two open direction calls need you:** literal 1:1
  (T0 → ~2.8 h) vs. rebalance a ~90-min split, and which loop ships. **Read to
  pick the loop + the split → then Phase-0 diverge starts.**
- [ ] `docs/plans/opus-2026-07-04-ui-v2-andon-steel-migration.md` — **UI-v2 Andon
  Steel migration** (v0.3.6): **BUILD-READY** full-replacement remaster plan,
  co-authored with you. All calls locked (full replacement · Andon composition ·
  Western fonts · cursor cut · re-theme all variants · straight-on-main). **7 build
  cards** M1 palette → M2 materials → M3 composition → M4 GBA cold-open → M5
  VN/ceremony → M6 variant surfaces (R2/R5/R6/R7) → M7 doc ripple, each with
  `file:line` anchors + acceptance criteria, written for a Sonnet-class builder;
  4 reference appendices (token map · material CSS · fonts · variant recipe).
  **Read to LOCK → then I start M1.**
- [ ] `docs/plans/opus-2026-07-03-emergent-node-actions.md` — **emergent node
  actions** (graduated from the parked brainstorm into a plan): you *discover* what
  to do at a map node via rumours / low-chance events / description hints, not a
  static list. Phase 0 = a design pass (grill-me/diverge) to lock the open shape
  questions; then build (T0-later/T1, NOT R0/R1). D-114/D-115/D-116-adjacent.

_(**R9 is CLOSED (2026-07-04 → 10 Andon Steel, D-127).** The UI-remaster field
(01–09 + demo 10) stays anchored in `ui-demos/`; the winner now feeds the Andon
Steel migration plan queued above.)_

**Process-improvement plans + the PRD-diet session (2026-07-03, from the
496-commit git-log retro):**

_(The **master plan** — `docs/plans/fable-process-master-plan.md`, the
F1–F10 build order + merge map — was ratified in-session 2026-07-03 and its
queue entry cleared; the plans below are renamed + reordered to match it.)_

- [ ] **Canon-diff read (F1b Ph2 pilot region)** — the gen-region now transcludes
  the **build's** R0→R7 rung titles into **§3.2** of
  `docs/living/prd/03-unlock-ladder.md` (above the ladder table) — the
  *mechanical* titles, honestly flagged as reconciled to the §3.2 *narrative*
  titles by the future R1-gated sweep. **Review that diff** (it edits canon).
  _(The F1b plan itself is closed + archived — reframe call made 2026-07-04.)_
- [ ] `project/brainstorms/2026-07-05-requirements-based-rung-progression.md` —
  **your F121 proposal**: replace the raw rung points meter (476/1100) with a
  finite **checklist of named requirements** per rung, completable in any order
  (R0 = rake 100/200/300/400/500 rice → 20/40/60/80/100%). A progression-model
  redesign — needs your scope call (replace vs wrap the points model?) before a
  design pass / plan.
- [ ] `project/brainstorms/2026-07-03-prd-on-a-diet.md` — **the PRD-diet
  session record** (→ ADR D-117): your 6 locked answers + the derived flows +
  **2 Claude-picked defaults awaiting your override** (audit baseline for
  compressed territory; §6 folded into the T0 sweep).
- [ ] `docs/plans/fable-process-F7-balance-cockpit.md` — **the balance-tuning
  cockpit** (top10 #1, your 5/5 pick): a DEV-panel Balance tab of live
  sliders over the curated `balance.ts` levers (the 4 balance-watch items
  first), URL-persisted overrides that NEVER touch saves, live ETA readouts
  (capstone/next-rung), and an **export-diff** artifact an agent applies as
  a reviewed commit. Grounded: live-binding override mechanism verified
  against real access patterns; one frozen constant (`AUTO_REPEAT_MS`)
  excluded.
- [ ] `docs/plans/fable-process-F8-play-telemetry.md` — **real-play
  telemetry** (top10 #6): your attended-time spec as a pure, unit-proven
  sessionizer — the 5/20/5 case is a named test asserting exactly 10 min;
  grounded finding: hidden pauses the sim but **blur does not**, so the
  report shows ticks vs attended side by side.
- [ ] `docs/plans/fable-process-F9-ship-skill.md` — **the `/ship` release
  skill** (top10 #10): one human-invoked command for the whole train — bump
  → CHANGELOG → verify → **isolated temp-worktree build of HEAD** (never
  ships co-agents' WIP) → deploy → **live-site version PROOF** (fetches the
  deployed bundle, requires the new version + build SHA) → record. Found 4
  real gaps in today's deploy path, incl. dirty-tree builds and a
  silently-stranded gh-pages commit.
- [ ] `docs/plans/fable-process-F10-taste-bar-enforcement.md` — **taste-bar
  enforcement PLACEHOLDER** (top10 #7): deliberately thin — the mechanism
  sketch (per-surface self-scorecards attached to R-items) parked until you
  lock `taste.md` with the other session; redone in full then.

_(All the 2026-07-02 T0-build plans + both 2026-07-03 v0.3.5 plans (build +
cleanup-docs) + the R7-capstone design plan are **BUILT/DONE and archived to
`project/archive/`** — the git history + `decisions.md` (D-107…D-125) + the journal
are the record. Their owed bits live as R-items in `human-in-the-loop/review.md`
[R6 home-panel diverge, R7 estate-map pick, R9 UI-remaster] + the economy
balance-watch above.)_
