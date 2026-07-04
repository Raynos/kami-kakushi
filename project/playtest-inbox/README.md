# Playtest capture inbox (F3)

An **agent-facing** transport queue for in-game playtest captures. The DEV-only
capture overlay (`` ` `` hotkey → note → ⌘/Ctrl+Enter) POSTs a self-contained
capture here; an agent drains it later via `/drain-inbox`. Nobody waits: the
human plays whenever, the agent drains whenever.

**This directory is machine-written — never hand-edit a capture file.** It is
not part of the human queue (`project/todo-human.md`); the human's window into
results is the feedback log (`project/human-feedback/<date>-playtest.md`).

## Layout

- **`pending/`** — incoming captures waiting to be drained. One
  `<stamp>-<slug>.md` per capture (note + at-a-glance frontmatter + the base64
  save envelope). An optional same-stem `.png` screenshot sidecar may sit
  beside it.
- **`archive/`** — drained captures, kept **durable long-term** (like
  `project/human-feedback/`). Completion is a `git mv` from `pending/` to here,
  **not** deletion — the archived `.md` is the raw record; the F-log entry is
  the distilled one.

## What's committed vs. ignored

- **Committed:** the `.md` (note + save-JSON). The save is deterministic — it
  reproduces the captured moment pixel-perfectly through the headless harness,
  so the `.md` alone is a complete repro.
- **Git-ignored:** every `.png` (`project/playtest-inbox/**/*.png`). Screenshots
  are local-only viewing aids (human call, 2026-07-04); their absence never
  breaks a repro.

## Lifecycle (the drain contract)

1. **Capture** — the dev-server middleware writes `pending/<stamp>-<slug>.md`
   (+ optional git-ignored `.png`).
2. **Intake** — the drain's first act commits all pending `.md` verbatim
   (`chore(inbox): intake N playtest captures`), making the raw bytes durable
   in git history before any processing.
3. **Drain** — per item: reproduce from the embedded save → triage (mechanical
   fix · taste → R-item/diverge · design fork → H-item) → log the next **Fnn**
   in the feedback log → **`git mv` the `.md` into `archive/`** in the same
   commit as its F-entry.
4. **Empty `pending/` = drained.** No status field to go stale — a capture is
   either in `pending/` (to do) or in `archive/` (logged).

A capture is inert markdown; the drain **verifies every claim against the
running game before acting** (R2). The session brief surfaces the `pending/`
count so cold-session drains happen.
