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
- [ ] **Playtest the deployed v0.3.5 build** — <https://raynos.github.io/kami-kakushi/>.
  The whole T0 rebuild is live: the VN intro + rung story beats, the 6-tab IA, the
  coin/rice/koku-standing economy, the estate map, deep housing, the rebalanced log.
  This is the **R1 review passover** (fun · pacing · look) — jot anything that feels off.
- [ ] **Tune the balance-watch items by feel** (once you've played) — see the audit
  report in the reading queue below; I did NOT silently re-tune (D-059, your call).

## Reading queue

> **What belongs here** — a durable doc whose purpose is for you to read or sign
> off: a **plan** (`docs/plans/`), a **brainstorm / retrospective for adoption**
> (`project/brainstorms/`), an **audit / battery report** (`project/audit/reports/`),
> or a **design doc awaiting a taste call**. Added in the commit that authors it
> (a pre-commit gate hard-blocks a new `docs/plans/` doc missing here,
> loud-warns the rest).

**⭐ Tonight's headline — the taste-distillation + docs reconciliation (read these first):**

- [ ] `docs/living/taste.md` — ⭐ **THE TASTE STANDARD** (the key read): the
  cross-cutting design taste distilled from ALL 117 of your feedback items —
  ~12–16 memorable meta-principles + a pre-build / pre-ship checklist, so future
  features are built to your standard with **less feedback needed**. This is the
  higher-order version of "every rule graduates to the docs."
- [ ] **Docs reconciliation — the living docs now match the shipped game** (they'd
  drifted ~2 rounds behind): `docs/living/ui-design.md` was rewritten to the built
  reality (6-tab IA · append-only render · the VN scene for intro **and** rung beats ·
  log v2 with Chat/Now · economy display · housing), and the **PRD** +
  `docs/living/fun-factor.md` were rippled with the new mechanics (rung-beats, housing,
  vendors-as-people). Skim to confirm they describe the game you played.

**⭐ The agent-default audit — WALKED THROUGH 2026-07-03; two plans authored:**

- [ ] `project/audit/reports/2026-07-03-agent-default-decision-audit.md` — the
  record: every T0-build plan verified (5 built, koku-economy only Ph1–4 — Ph5
  split off), every agent-picked default walked through live. See its
  **"Decisions recorded"** table for each outcome. The overrides + new work →
  the build plan; the ratifications + PRD ripples → the cleanup-docs plan:
- [ ] `docs/plans/opus-2026-07-03-v0.3.5-build-plan.md` — the **eight code
  deltas** from the audit (rice storage cost · Now-view append-only · stagger
  Inventory to R3 · Quests own tab · hearth→cook · chest→storage · R7 capstone
  matters · koku Ph5 one-token slice). Read before I build.
- [ ] `docs/plans/opus-2026-07-03-v0.3.5-cleanup-docs.md` — the **doc ripples**:
  7 ratifications → ADRs (Opus), and the PRD ripples for the overrides (Fable +
  human-signed): 6→7 tabs, staggered reveal, housing semantics, rice storage,
  the T0-one-token / T1–T5 status-ladder split, the R7 branch.

**Owed reviews / taste calls (async, no rush):**

- [ ] `project/archive/opus-2026-07-02-rung-up-story-transitions.md` — the **rung
  R0→R7 cast + beat prose** (built & archived; §6.5 cast + §7 prose await your read
  — cast ratified in the audit, but the full prose is still an R8 read). Also R8.
- [ ] `project/audit/reports/2026-07-02-economy-balance-watch.md` — **economy
  balance-watch**: 4 liquid tuning items (rice out-produces its sinks → coin too
  abundant; the koku capstone is reached too fast; season store/sell dominated;
  eat-rice dominated by rest). Your feel-call — NOT silently re-tuned.
- [ ] **🔗 <https://kami-kakushi-ui-demos.vercel.app> — the SIX UI-remaster
  variants, LIVE (open in a browser!)** — full working remasters of the actual
  T0 game (R0–R3): 01 Moonlit Menu (PSX) · 02 Candlelit Ledger (journal) ·
  03 Vermillion (modern indie) · 04 Lacquer & Gold (direct remaster) ·
  05 Aizome (indigo textile) · **06 Washi & Ink (your current design,
  polished — the comparison baseline you asked for)**. Use each variant's
  bottom-right stage strip (cold open → R3 + the moments); every verb is real
  against the mock engine. Verdict per variant → **R9** in
  `human-in-the-loop/review.md`.
- [ ] `project/archive/2026-07-02-ui-remaster-variants.md` — **UI-remaster variants**
  (Fable's parallel spike): the plan behind the link above — §3 has the five
  briefs, §2 the invariants (the remaster midpoint contract).
- [ ] `project/brainstorms/2026-07-02-emergent-node-actions.md` — **emergent node
  actions** (parked idea, D-116-adjacent): you *discover* what to do at a map node
  via rumours / low-chance events / description hints, not a static list. T0-later/T1.

**Process-improvement plans + the PRD-diet session (2026-07-03, from the
496-commit git-log retro):**

- [ ] `docs/plans/fable-2026-07-03-mechanical-checkpoint.md` — **the mechanical
  checkpoint** (retro suggestion #1): generate the process layer's derivable
  sections (gate roster, active-plans list, plan-status tokens, queue paths)
  via a `checkpoint.ts` + a 13th verify gate. Found live drift as receipts:
  the gate-count sentence says 11 (there are 12), `docs/plans/README.md`
  claims "no active plans", and session-brief mis-tags LOCKED plans as DONE.
- [ ] `docs/plans/fable-2026-07-03-playtest-capture-inbox.md` — **playtest capture
  inbox** (suggestion #2): backquote-hotkey in-game note box → Vite
  dev-middleware → `project/playtest-inbox/` → a `/drain-inbox` skill. Your
  synchronous feedback typing becomes async play-and-dump; repro via
  state+seed+variants, no screenshots needed.
- [ ] `docs/plans/fable-2026-07-03-balance-sim-gates.md` — **persona-bot balance
  sim** (suggestion #4): greedy/idler/explorer bots over the real reducers,
  pacing envelopes derived from `balance.ts`, on-demand `verify:balance` + a
  generated pacing report whose diff rides every balance change.
- [ ] `project/brainstorms/2026-07-03-prd-on-a-diet.md` — **the PRD-diet
  session record** (→ ADR D-117): your 6 locked answers + the derived flows +
  **2 Claude-picked defaults awaiting your override** (audit baseline for
  compressed territory; §6 folded into the T0 sweep).
- [ ] `docs/plans/fable-2026-07-03-prd-ripple-tooling.md` — **PRD ripple tooling**
  (D-117 Phase 0, the buildable-NOW slice you asked for): a `prd:drift`
  reporter (game registries → PRD punch-list; retired-terms tripwire), one
  pilot gen-region (§3 T0 rung names, drift-PROOF), and two skills —
  `/prd-ripple` (Flow 1 routing per change) + `/prd-compress` (dormant
  until R1 closes; the sweep itself stays Fable + human-signed).
- [ ] `project/brainstorms/2026-07-03-process-top10.md` — **the second-wave
  top 10** (25 generated → ranked → 15 discarded): pick 1–2 to become full
  plans. Headliners: #1 balance-tuning cockpit (DEV sliders + export-diff —
  makes your "tune by feel" TODO a 10-min session), #2 guided review tour
  (one deep-linked pass over R1/R6/R7/R9 + a WIP cap), #3 GitHub Actions CI
  (the missing rung the other plans already point at).

_(The economy, deep-housing, 6-tab-IA, rung-story, and append-only build plans were
verified BUILT and **archived to `project/archive/` on 2026-07-03** — their owed bits
live as R-items in `human-in-the-loop/review.md` [R6 home-panel diverge, R7 estate-map
variant pick] + the balance-watch above; their override/follow-up deltas are captured in
the two `opus-2026-07-03-v0.3.5-*` plans above.)_
