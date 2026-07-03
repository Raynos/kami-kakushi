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

- [ ] **⭐ Redo the taste-distillation + ui-design rewrite WITH FABLE** — this is
  critical enough to warrant a dedicated, human-in-the-loop re-pass, not just the
  autonomous first cut. Tonight's `docs/living/taste.md` (the 117-item taste
  standard) + the `ui-design.md` reconciliation are the highest-leverage artifacts
  of the session — they set the bar every future feature is built to. Sit with
  Fable (the design agent), review/rework them together, and lock the taste bar
  you actually want. Treat the autonomous version as a **strong first draft**, not
  the final word.

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

**⭐ Tonight's headline — the taste standard (the key read):**

- [ ] `docs/living/taste.md` — ⭐ **THE TASTE STANDARD**: the cross-cutting design
  taste distilled from ALL 117 of your feedback items — ~12–16 memorable
  meta-principles + a pre-build / pre-ship checklist, so future features are built
  to your standard with **less feedback needed**. *(Redo it WITH FABLE — the ⭐ TODO
  above.)*

**Owed reviews / taste calls (async, no rush):**

- [ ] `docs/plans/opus-2026-07-03-emergent-node-actions.md` — **emergent node
  actions** (graduated from the parked brainstorm into a plan): you *discover* what
  to do at a map node via rumours / low-chance events / description hints, not a
  static list. Phase 0 = a design pass (grill-me/diverge) to lock the open shape
  questions; then build (T0-later/T1, NOT R0/R1). D-114/D-115/D-116-adjacent.

_(The **UI-remaster variants** — the six live demos + their plan — are tracked as
**R9** in `human-in-the-loop/review.md`; review them there, live.)_

**Process-improvement plans + the PRD-diet session (2026-07-03, from the
496-commit git-log retro):**

- [ ] `docs/plans/fable-process-S1-mechanical-checkpoint.md` — **the mechanical
  checkpoint** (retro suggestion #1): generate the process layer's derivable
  sections (gate roster, active-plans list, plan-status tokens, queue paths)
  via a `checkpoint.ts` + a 13th verify gate. Found live drift as receipts:
  the gate-count sentence says 11 (there are 12), `docs/plans/README.md`
  claims "no active plans", and session-brief mis-tags LOCKED plans as DONE.
- [ ] `docs/plans/fable-process-S2-playtest-capture-inbox.md` — **playtest capture
  inbox** (suggestion #2): backquote-hotkey in-game note box → Vite
  dev-middleware → `project/playtest-inbox/` → a `/drain-inbox` skill. Your
  synchronous feedback typing becomes async play-and-dump; repro via
  state+seed+variants, no screenshots needed.
- [ ] `docs/plans/fable-process-S4-balance-sim-gates.md` — **persona-bot balance
  sim** (suggestion #4): greedy/idler/explorer bots over the real reducers,
  pacing envelopes derived from `balance.ts`, on-demand `verify:balance` + a
  generated pacing report whose diff rides every balance change.
- [ ] `project/brainstorms/2026-07-03-prd-on-a-diet.md` — **the PRD-diet
  session record** (→ ADR D-117): your 6 locked answers + the derived flows +
  **2 Claude-picked defaults awaiting your override** (audit baseline for
  compressed territory; §6 folded into the T0 sweep).
- [ ] `docs/plans/fable-process-S5-prd-ripple-tooling.md` — **PRD ripple tooling**
  (D-117 Phase 0, the buildable-NOW slice you asked for): a `prd:drift`
  reporter (game registries → PRD punch-list; retired-terms tripwire), one
  pilot gen-region (§3 T0 rung names, drift-PROOF), and two skills —
  `/prd-ripple` (Flow 1 routing per change) + `/prd-compress` (dormant
  until R1 closes; the sweep itself stays Fable + human-signed).
- [ ] `docs/plans/fable-process-N1-balance-cockpit.md` — **the balance-tuning
  cockpit** (top10 #1, your 5/5 pick): a DEV-panel Balance tab of live
  sliders over the curated `balance.ts` levers (the 4 balance-watch items
  first), URL-persisted overrides that NEVER touch saves, live ETA readouts
  (capstone/next-rung), and an **export-diff** artifact an agent applies as
  a reviewed commit. Grounded: live-binding override mechanism verified
  against real access patterns; one frozen constant (`AUTO_REPEAT_MS`)
  excluded.
- [ ] `docs/plans/fable-process-N10-ship-skill.md` — **the `/ship` release
  skill** (top10 #10): one human-invoked command for the whole train — bump
  → CHANGELOG → verify → **isolated temp-worktree build of HEAD** (never
  ships co-agents' WIP) → deploy → **live-site version PROOF** (fetches the
  deployed bundle, requires the new version + build SHA) → record. Found 4
  real gaps in today's deploy path, incl. dirty-tree builds and a
  silently-stranded gh-pages commit.
- [ ] `docs/plans/fable-process-N7-taste-bar-enforcement.md` — **taste-bar
  enforcement PLACEHOLDER** (top10 #7): deliberately thin — the mechanism
  sketch (per-surface self-scorecards attached to R-items) parked until you
  lock `taste.md` with the other session; redone in full then.
- [ ] `docs/plans/fable-process-N3-github-actions-ci.md` — **GitHub Actions
  CI** (top10 #3, your spec): two parallel jobs (verify + build/strip) ≈
  1.5 min wall vs the 5-min target — setup dominates, so a 6-way split
  would fork the gate roster into YAML for nothing; nightly stub for the
  slow suites; **web-grounded oxlint/oxfmt verdicts**: two-tier lint (oxlint
  can't express the `new Date()` core ban), oxfmt only behind a zero-diff
  parity proof.
- [ ] `docs/plans/fable-process-N5-scenario-saves.md` — **scenario save
  library** (top10 #5): six generated fixture saves (pre-wolf, rung-beat,
  post-loss, worn-weapon, pre-ascension, wealthy-idler) — one-click load
  from a DEV "Scenarios" tab / `?fixture=`, byte-stable regen, your real
  run auto-backed-up before every load.
- [ ] `docs/plans/fable-process-N6-play-telemetry.md` — **real-play
  telemetry** (top10 #6): your attended-time spec as a pure, unit-proven
  sessionizer — the 5/20/5 case is a named test asserting exactly 10 min;
  grounded finding: hidden pauses the sim but **blur does not**, so the
  report shows ticks vs attended side by side.
- [ ] `docs/plans/fable-process-N8-narrative-format.md` — **narrative
  authoring format** (top10 #8): story as structured markdown (worked
  example: the REAL R3 Kihei beat, round-trip faithful), compiler emits the
  typed registries, 12 referential-integrity validations, byte-preserving
  migration proof. Bonus finding: R7 speaks Shigemasa in 'official' voice
  while canon says 'lord' — exactly what the validator would catch.

_(All the 2026-07-02 T0-build plans + both 2026-07-03 v0.3.5 plans (build +
cleanup-docs) + the R7-capstone design plan are **BUILT/DONE and archived to
`project/archive/`** — the git history + `decisions.md` (D-107…D-125) + the journal
are the record. Their owed bits live as R-items in `human-in-the-loop/review.md`
[R6 home-panel diverge, R7 estate-map pick, R9 UI-remaster] + the economy
balance-watch above.)_
