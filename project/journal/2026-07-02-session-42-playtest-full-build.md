# Session 42 — 2026-07-02 — playtest full build (F1–F61 all shipped)

## ☀️ SUMMARY (read this first)

A marathon build session: the live, human-steered v0.3.2 playtest produced **61
taste items (F1–F61)** and **every one was built, committed, and pushed to
`origin/main` (green)** — fanned out across parallel subagents while the human
was away, on the mandate to "keep building autonomously." The reshape turns the
prototype UI into a proper idle-RPG app shell with a **full-screen VN
interactive intro** (dialogue tree + perks), a **filterable log v2** (incl. a
transient "Now" channel), a polished **DEV panel**, a **multi-panel matrix**,
and the **F22** work-stamina/health split. Two ADRs landed: **D-104**
(full-screen VN scene for story-significant interactive NPCs) and **D-106**
(multi-panel layout as reveal-gated slices + DEV axes). Settled taste rules
graduated to `ui-design.md`.

**This file is HISTORY, not live state.** The live snapshot is
[`../status/project-status.md`](../status/project-status.md); the verbatim
feedback + per-item status is
[`../human-feedback/2026-07-02-playtest.md`](../human-feedback/2026-07-02-playtest.md).
The build now **awaits the human's REVIEW PASSOVER**. (Earlier part of the arc:
[`2026-07-02-session-41-playtest-polish.md`](2026-07-02-session-41-playtest-polish.md).)

**Discipline notes:** all driving stayed **headless-only** (hook-enforced — no
headed browser, incl. from subagents). A **concurrent worker** owns the separate
**1780 setting anchor (D-105)** stream — its files/notes/journal
(`2026-07-02-session-42-anchor-1780.md`) were left untouched.

---

## 1 · App-shell overhaul (F1–F10)

Restyled the prototype into an established idle-RPG shell: a **dark-ink ground**
filling the viewport, a **~1200px centered paper column**, a **fixed
header/footer**, **100dvh with no page scroll** (panes scroll internally), the
**message/story log moved to the RIGHT** column, **smooth** log auto-scroll, a
**compact/dense** pass on type + controls, and a **`?dev=no`** opt-out that fully
suppresses the DEV panel so the true player layout can be previewed. Root cause
of the "off-center + white strip" was the DEV panel reserving a layout gutter —
fixed by making it a fixed overlay reserving zero layout space.

## 2 · Log v2 — filter tabs + the transient "Now" channel (F9, F20, F26–F28, F50–F53, F58, F59)

The event log became a filterable surface: segmented **filter tabs — Story ·
Progress · Combat · Work · All · Now** (ordered by importance, work-noise
trails). The **"Now"** tab is a transient scratch for fleeting flavor (rest/
labour spam) whose entries **fade ~15s** after appearing and **slide the rest
up**, keeping the permanent channels clean. Lines carry **speaker-name prefixes
+ voice colours** (narrator / NPC-by-category / player), **in-session unread**
dots (history is never "unread" at load), and **land-at-bottom** on tab switch.

## 3 · Interactive intro — full-screen VN scene + dialogue tree + perks (F12–F15, F23, F39–F48, F54–F57)

The intro became the game's **sole prod presentation** (D-104): a **full-screen
VN scene** that **hides the whole shell** and inks the UI in afterward. It runs a
**GBA typewriter** (left-aligned, so it doesn't jitter), and a **Fallout-style
dialogue TREE** — a hub of ask-topics the player explores (`ask_topic`, per-NPC
memory, dialogue schema bumped 3→4) before making the story-continuation
**decision**. The balanced +1/−1 choices now read as **PERK UNLOCKS** (a named
perk + a standalone description + the mechanics, old-school JRPG boxes), and the
outcome routes to **Progress**, not Work. The VN scene owns the live reveal; the
log is an instant historical transcript.

## 4 · DEV panel polish (F16–F18, F34–F38, F49)

Split into **Settings / Variants** sub-tabs; variants are recency-ordered
collapsible summaries with **per-surface V-numbers (V6A/B/C)**, a **fixed
New-game footer** (outside the scroll region, de-duplicated), **URL-persisted**
variant selections (pick writes `?surface=variant`, load applies), and a
**speed control** that highlights the active step and adds **16×**.

## 5 · Multi-panel matrix (F11, ADR D-106)

Built the multi-panel dashboard as **reveal-gated slices** (panels appear as
their surface unlocks, reconciled with the incremental-reveal signature) plus
**4 arrangements × 3 framings** exposed as DEV axes — M1 + M2, recorded as ADR
**D-106**.

## 6 · F22 — split work-stamina vs health

A core-mechanics change: **work-stamina** (spent by labour, refilled by **Rest**)
and **health** (spent in combat, recovered by **Cook**) are now distinct meters
with distinct recovery actions, plus an auto-loop rest-guard.

## 7 · Misc + robustness (F24, F25, F29–F32, F60, F61)

Settings modal → tabs with an **About** default (F29/F31/F33); **text-scale
decoupled** from layout (scales type tokens only, F30); a **full-screen error
modal** replacing the blank/partial crash page (F61); **New-game resets the UI**
to zero state (F25); **cheap DEV teleports** (no CPU-spinning sim loop, F24);
**auto-state resets on load** (no resumed auto-ing, F32). F60 (a render crash)
was confirmed a **transient HMR mid-edit artifact**, cleared when the build
landed green.

---

## Next intended steps (current)

1. **The human's REVIEW PASSOVER** of the reshaped game (the big gate) — VN intro
   + dialogue tree, log v2, multi-panel matrix, DEV-panel variant picks.
2. Once the human **locks the variant picks**, **prune the DEV variant dead-code**
   (D-075 zero PROD flag-debt) — prod ships only the chosen defaults.
3. Grow the **F47 dialogue-tree ask-hub content** (more topics per NPC) as the
   story expands; extend the VN pattern to the next story-significant NPC (D-104).
4. **Balance is liquid** (D-059) — stamina/health magnitudes, perk deltas, and
   pacing are all tunable from playtest data, not frozen.

## Landmines (current)

- The **1780 setting anchor (D-105)** stream is a **separate concurrent worker's**
  — leave its files, notes, and `…session-42-anchor-1780.md` journal untouched.
- Driving is **headless-only** (hook-enforced) — never open a headed browser,
  including from subagents; use `window.__qa` / `node src/scripts/qa-shots.mjs`.
- A stale autorun save may load — call `newGame()` to see the true opening.
- DEV variant surfaces still carry alternates behind the toggle until the human
  locks picks; don't strip them before the review (that's step 2 above).
