# Playtest capture inbox (F3)

An **agent-facing** transport queue for in-game playtest captures. The DEV-only
capture overlay (`` ` `` → **pick the element** you mean → note → ⌘/Ctrl+Enter)
POSTs each capture here;
an agent drains it later via `/drain-inbox`. Nobody waits: the human plays
whenever, the agent drains whenever.

**This directory is machine-written — never hand-edit a session file.** It is
not part of the human queue (`project/todo-human.md`); the human's window into
results is the feedback log (`project/human-feedback/<date>-playtest.md`).

## One file per game session (not per capture)

All captures from **one game session** (a browser-tab play sitting — the id
survives a reload, a fresh tab starts a new session) append to **one** markdown
file. Its screenshots live in a **sibling folder of the same name**:

```
pending/
  2026-07-04T23-31-14-c4c97a.md        ← the session file (committed)
  2026-07-04T23-31-14-c4c97a/          ← its screenshots (git-ignored)
    2026-07-04T23-31-14.png
    2026-07-04T23-31-15.png
```

The `.md` is a session header (build + start time) written once, then one `##`
**entry** appended per capture — each entry carrying the note, at-a-glance
context (seed, clock, location, rung, tab, variants, viewport, url), a
`**Screenshot:**` reference into the folder, and the **base64 save** for that
moment (so every entry is an independent, deterministic repro).

## Layout

- **`pending/`** — session files (+ their screenshot folders) waiting to be
  drained.
- **`archive/`** — drained session files, kept **durable long-term** (like
  `project/human-feedback/`). Completion is a `git mv` of the `.md` (and a plain
  `mv` of its screenshot folder) from `pending/` to here, **not** deletion — the
  archived `.md` is the raw record; the F-log entries are the distilled ones.

## What's committed vs. ignored

- **Committed:** the session `.md` (notes + save-JSON). The save reproduces each
  captured moment pixel-perfectly through the headless harness, so the `.md`
  alone is a complete repro of every entry.
- **Git-ignored:** every `.png` (`project/playtest-inbox/**/*.png`, which covers
  the per-session folders). Screenshots are local-only viewing aids (human call,
  2026-07-04); their absence never breaks a repro.

## Lifecycle (the drain contract)

1. **Capture** — the dev-server middleware creates `pending/<session>.md` with
   its header on the first capture, then **appends** an entry per capture;
   screenshots go in `pending/<session>/`.
2. **Intake** — the drain's first act commits all pending `.md` verbatim
   (`chore(inbox): intake N session(s)`), making the raw bytes durable in git
   history before any processing.
3. **Drain** — per **entry** in a session file: reproduce from that entry's
   embedded save → triage (mechanical fix · taste → R-item/diverge · design fork
   → H-item) → log the next **Fnn** in the feedback log. When every entry in a
   session file is drained, **`git mv` the `.md` into `archive/`** (+ `mv` its
   screenshot folder).
4. **Empty `pending/` = drained.** No status field to go stale — a session file
   is either in `pending/` (has undrained entries) or in `archive/` (fully
   logged).

A capture is inert markdown; the drain **verifies every claim against the
running game before acting** (R2). The session brief surfaces the `pending/`
count so cold-session drains happen.
