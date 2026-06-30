# Session 23 — 2026-06-30 — R4 playtest decisions + process conventions

## ☀️ SUMMARY (read this first)

> HISTORY (how it got here), not live state — the live snapshot is
> [`../status/project-status.md`](../status/project-status.md).

The v0.3 overnight build shipped (session-19). This session the human **went through the open v0.3
questions interactively** (two `AskUserQuestion` batches) and steered a batch of design + process
decisions, all now **locked as ADRs D-075…D-079** and sequenced into a build plan. No code was
written — this was decisions, capture, and doc-lifecycle hygiene. Everything is on `origin/main`,
`verify` green throughout.

## 1 · The R4 design/taste decisions (→ ADRs D-076…D-079)

Resolved the v0.3 fidelity-battery judgment queue (R4) via AskUserQuestion. Capture (verbatim
direction): [`../human-feedback/2026-06-30-r4-playtest-decisions.md`](../human-feedback/2026-06-30-r4-playtest-decisions.md).

- **D-079 · Clock (R4#1):** **active-only PAUSE** is canon (pause on `document.hidden`, no offline
  catch-up). The code is right; D-053's "wall-time catch-up" text is the bug (doc fix, no code). This
  also **reverses H6** (annotated in the archive).
- **D-076 · Combat (R4#3):** a fight is a visible **HP-attrition exchange** (you ↔ enemy trade attacks
  to 0 = death). **NO auto-heal** in the auto-loop. **0 HP = a lost fight → autopilot stops.** (My
  "Recommended: keep autonomous" was overruled — the human wants the stakes back.)
- **D-078 · Breadth (R4#5):** ≥1 breadth surface is **load-bearing**; first = a **map node gating a
  deed/yield** (ties the map to standing via deeds).
- **D-077 · Standing/koku (R4#6):** standing/pillars stay **deed-based, NEVER wealth-coupled** (the
  opposite of my "Recommended: couple wealth"). Separately **tighten koku** — more sinks than income,
  not rich until T5.
- a11y colour darkening (the WCAG-AA fix): **confirmed, keep the deeper tones.**

## 2 · Diverge v2 — the variant-process change (→ ADR D-075, refines D-073)

The human couldn't pick UI variants because they couldn't **see** them, and rejected the
"diverge-LITE" corner I'd cut overnight. New model:
- **FULL 2–3 working variants always** (diverge-LITE retired; no buggy variants).
- Variants live **in the codebase**, switchable live via a **DEV panel** (DEV-only, stripped from
  prod) — reviewed in the running UI, not branch screenshots.
- **Each variant = its own line item in `review.md`.**
- Rippled into CLAUDE.md, the `diverge` skill (banner + principles; the detailed §§ rewrite waits on
  the DEV-panel build), the variants-log, and review.md (R2 restructured per-variant).

## 3 · Conventions adopted this session (from the human + the parallel agent)

- **Commit attribution (the other agent landed it; I adopted it):** every AI commit ends with
  `Assisted-by: AGENT_NAME:MODEL_VERSION` (e.g. `Assisted-by: Claude Code:claude-opus-4-8[1m]`) —
  **never** `Co-Authored-By:`, no emoji banner. Hook-enforced (`.githooks/commit-msg`). Used from the
  queue-cleanup commit onward.
- **Markdown prose width ~80 (a SUGGESTION, not a gate):** added to CLAUDE.md + working-agreements +
  memory; markdown is `.prettierignore`'d so it can't be hard-blocked (CJK/URLs/tables exempt).
  Reflowed the v0.3 changelog as the exemplar (478-char table rows → bullet sections ≤80).
- **HITL archive flow for R-items:** `archive.md` now has **Decisions + Reviews** sections; closed
  R-reviews graduate there (like H-decisions) and leave `review.md` open-only. README + CLAUDE.md updated.

## 4 · Doc-lifecycle hygiene

- **Archived** the fully-executed `path-to-v0.3.md` plan → `project/archive/` (both parts done).
- **Closed R4** in review.md (→ the archive Reviews section); **R3** folded into R2.
- **Reading queue trimmed:** the v0.3 changelog + the fidelity battery removed (read/actioned); only
  the process-learnings retrospective remains (awaiting a pick-which-to-adopt).
- Wrote the **process-learnings retrospective** (`../brainstorms/2026-06-30-v03-process-learnings.md`).

## 5 · What's queued (the v0.3.1 build — NOT started)

Plan: [`../../docs/plans/2026-06-30-v0.3.1-build.md`](../../docs/plans/2026-06-30-v0.3.1-build.md).
Sequence: **(1)** DEV panel + variant toggle (+ fix buggy influence-B) · **(2)** full 2–3 variants for
craft/market/quests + influence/map into the toggle (each a review item) · **(3)** combat rework
(D-076) · **(4)** koku sinks + tighten (D-077) · **(5)** load-bearing map node (D-078) · **(6)** clock
doc-fix (D-079) · **(7)** battery engineering leftovers (the seasonal-judge-fires-0× cadence bug, DOM
tests, DEV-harness smoke, dead-flag cleanup, milestone-integrity gate, UI nits).

**Still on the human:** the **R1 playtest** (best after the combat rework lands) + **read the
process-learnings** doc (pick which to adopt). Everything else is the agent's to build.

## ⚠ Shared-tree note

A second agent worked the whole session (commit-attribution rule, todo-human rename, gitignore raw
snapshots — sessions 20–22). One slip: a bare `git commit` of mine co-committed their staged
JSON-deletion (intended work, harmless). Lesson reinforced: **commit by explicit path** on this tree.
