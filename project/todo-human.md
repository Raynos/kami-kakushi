# Human TODO — tasks + reading queue awaiting the human

> **Live queue, open items only.** Closed items are removed, not struck — git
> history is the record. This is separate from `project/human-in-the-loop/`
> (`H`-decisions + `R`-reviews); both sections here are auto-surfaced at session
> start by `src/scripts/session-brief.sh`. Work the human has deliberately
> parked lives in [`BACKLOG.md`](BACKLOG.md), which the brief never nags.
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

- [ ] **Design glance (s88 e2e finding):** at R3 a player can hold a Battered
  blade with **no visible mend path** — `verb-repair` reveals at R4 by design
  (`ranks.ts:150`), so the win-rate sags for a stretch with no CTA. Intended
  tension, or should a mend affordance (or at least a hint) exist earlier?
- [ ] **UX glance (s88 e2e finding):** restoring a save on a **fresh
  device/profile** requires replaying the whole intro first — the Settings
  entry (→ Saves → Import) lives in the shell footer, hidden until the VN
  releases the shell. OK, or should a cold boot offer an import path?

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

- [ ] `docs/plans/fable-2026-07-05-context-hardening.md` — **context-hardening
  plan** (the audit + your four meta-questions, made durable): P1 auto-wire
  `core.hooksPath` → P2 a RED-able `verify:tooling` meta-suite (nightly) → P3
  guardrail coverage/dedupe → P4 context diet (namespace collisions, diverge
  archive, checkpoint-bullet compression, budget-cap AGENTS.md/repo-map).
  H21 (worktrees) + H22 (journal shape) were filed and CLOSED same-day —
  both → status quo, archived. **Read to nod P1–P3; P4 lands per-cut with
  your review.**
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
- [ ] `docs/plans/fable-2026-07-05-requirements-rung-progression.md` —
  **requirements-based rung progression** (F121 → grilled 2026-07-05 → ADR
  D-137): the plan for the direction you locked live — points model fully
  deleted; hidden anything-goes requirements per rung; rounded-% bar (5–10
  chunk updates); flavor line per completion; 100% alone unlocks the rung
  beat; F5 markdown authoring; bands re-derive; all R0–R7. Read to confirm
  the 7 phases + sequencing before the build starts.
