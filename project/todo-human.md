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

- [ ] `docs/plans/opus-2026-07-03-emergent-node-actions.md` — **emergent node
  actions** (graduated from the parked brainstorm into a plan): you *discover* what
  to do at a map node via rumours / low-chance events / description hints, not a
  static list. Phase 0 = a design pass (grill-me/diverge) to lock the open shape
  questions; then build (T0-later/T1, NOT R0/R1). D-114/D-115/D-116-adjacent.

_(The **UI-remaster variants** — the six live demos + the **Moonlit × Lacquer
fusion demos 07–10** (Andon · Night Seal · Damascene · Andon Steel) + their
build-spec plan — are tracked as **R9** in `human-in-the-loop/review.md`; review
them there, live. Plan cleared from this queue: engaged + built this session.)_

**Process-improvement plans + the PRD-diet session (2026-07-03, from the
496-commit git-log retro):**

_(The **master plan** — `docs/plans/fable-process-master-plan.md`, the
F1–F10 build order + merge map — was ratified in-session 2026-07-03 and its
queue entry cleared; the plans below are renamed + reordered to match it.)_

- [ ] `docs/plans/fable-process-F1b-prd-ripple-tooling.md` — **PRD ripple tooling**
  (D-117 Phase 0, the buildable-NOW slice you asked for; second half of the
  F1 build lane, after F1a): a `prd:drift` reporter (game registries →
  PRD punch-list; retired-terms tripwire), one pilot gen-region (§3 T0 rung
  names, drift-PROOF), and two skills — `/prd-ripple` (Flow 1 routing per
  change) + `/prd-compress` (dormant until R1 closes; the sweep itself stays
  Fable + human-signed).
- [ ] `project/brainstorms/2026-07-03-prd-on-a-diet.md` — **the PRD-diet
  session record** (→ ADR D-117): your 6 locked answers + the derived flows +
  **2 Claude-picked defaults awaiting your override** (audit baseline for
  compressed territory; §6 folded into the T0 sweep).
- [ ] `docs/plans/fable-process-F2-github-actions-ci.md` — **GitHub Actions
  CI** (top10 #3, your spec): two parallel jobs (verify + build/strip) ≈
  1.5 min wall vs the 5-min target — setup dominates, so a 6-way split
  would fork the gate roster into YAML for nothing; nightly stub for the
  slow suites; **web-grounded oxlint/oxfmt verdicts**: two-tier lint (oxlint
  can't express the `new Date()` core ban), oxfmt only behind a zero-diff
  parity proof.
- [ ] `docs/plans/fable-process-F3-playtest-capture-inbox.md` — **playtest capture
  inbox** (suggestion #2): backquote-hotkey in-game note box → Vite
  dev-middleware → `project/playtest-inbox/` → a `/drain-inbox` skill. Your
  synchronous feedback typing becomes async play-and-dump; repro via
  state+seed+variants, no screenshots needed. Owns the transport F7/F8 reuse.
- [ ] `docs/plans/fable-process-F4-balance-sim-gates.md` — **persona-bot balance
  sim** (suggestion #4): greedy/idler/explorer bots over the real reducers,
  pacing envelopes derived from `balance.ts`, on-demand `verify:balance` + a
  generated pacing report whose diff rides every balance change.
- [ ] `docs/plans/fable-process-F5-narrative-format.md` — **narrative
  authoring format** (top10 #8): story as structured markdown (worked
  example: the REAL R3 Kihei beat, round-trip faithful), compiler emits the
  typed registries, 12 referential-integrity validations, byte-preserving
  migration proof. Bonus finding: R7 speaks Shigemasa in 'official' voice
  while canon says 'lord' — exactly what the validator would catch.
- [ ] `docs/plans/fable-process-F6-scenario-saves.md` — **scenario save
  library** (top10 #5): six generated fixture saves (pre-wolf, rung-beat,
  post-loss, worn-weapon, pre-ascension, wealthy-idler) — one-click load
  from a DEV "Scenarios" tab / `?fixture=`, byte-stable regen, your real
  run auto-backed-up before every load.
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
