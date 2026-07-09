# Playtest capture inbox (FB-3)

An **agent-facing** transport queue for in-game playtest captures. The DEV-only
capture overlay (`` ` `` → **pick the element** you mean → set **kind**
(Bug/Question) + optional **bucket** → note → ⌘/Ctrl+Enter)
POSTs each capture here;
an agent drains it later via `/drain-inbox` (one **bucket** per pass). Nobody
waits: the human plays whenever, the agent drains whenever.

**Kind + bucket** (added 2026-07-09). Each capture carries a **kind** — `Bug`
(a defect to fix) or `Question` (something the human is exploring, to
answer/discuss) — shown in the entry heading. It may also carry a **bucket** (a
free-typed group like `map feedback`, `dev tooling`, `R0 feedback`): grouped
captures accumulate into one `pending/<bucket-slug>.md` **across sessions and
builds**, so `/drain-inbox <bucket>` drains just that bucket. Ungrouped captures
fall back to the per-session file below.

**This directory is machine-written — never hand-edit a session file.** It is
not part of the human queue (`project/todo-human.md`); the human's window into
results is the feedback log (`project/feedback-human/<date>-playtest.md`).

## One file per bucket, or per game session when ungrouped

Captures are keyed to **one** markdown file by a **file key** — the **bucket
slug** when grouped, else the **game-session id** (a browser-tab play sitting; the
id survives a reload, a fresh tab starts a new session). Its per-capture sidecars
live in a **sibling folder of the same name**:

```
pending/
  map-feedback.md                      ← a BUCKET file — spans sessions/builds (committed)
  map-feedback/
    2026-07-04T23-31-14.json           ← save + logs + context + kind/group/provenance (committed)
    2026-07-04T23-31-14.png            ← screenshot (git-ignored)
  2026-07-04T23-31-14-c4c97a.md        ← an UNGROUPED session file (committed)
  2026-07-04T23-31-14-c4c97a/
    2026-07-04T23-31-15.json
    2026-07-04T23-31-15.png
```

The `.md` gets a header written once (a **bucket** header for a bucket file, a
**session** header — build + start time — for an ungrouped one), then one `##`
**entry** appended per capture. Each entry heading names the **kind**
(`## Bug ·` / `## Question ·`) and is otherwise **lean and human-readable** — the
note, the picked `**Element:**`, a `**Screenshot:**` link, and a `**Details:**`
link to that capture's `<stamp>.json`. The **heavy machine data** (the base64
save, the recent log lines, the full at-a-glance context, and `kind` / `group` /
`session` / `build`) lives in the `.json`, so the `.md` never bloats with inline
base64. Each `.json` is an independent, deterministic repro
(`__qa.load(<its save>)`). A bucket file accumulates captures **across sessions
and builds** — so each entry's `.json` records its own source session + build.

## Layout

- **`pending/`** — session files (+ their screenshot folders) waiting to be
  drained.
- **`archive/`** — drained session files, kept **durable long-term** (like
  `project/feedback-human/`). Completion is a `git mv` of the `.md` + the
  folder's `.json`s (and a plain `mv` of the git-ignored `.png`s) from `pending/`
  to here, **not** deletion — the archived `.md` + `.json`s are the raw record;
  the F-log entries are the distilled ones.

## What's committed vs. ignored

- **Committed:** the session `.md` (lean, human-readable notes) **and** each
  capture's `<stamp>.json` (save + logs + context). The `.json`'s save
  reproduces the moment pixel-perfectly through the headless harness, so the
  `.md` + its `.json`s are a complete repro of every entry.
- **Git-ignored:** every `.png` (`project/playtest-inbox/**/*.png`). Screenshots
  are local-only viewing aids (human call, 2026-07-04); their absence never
  breaks a repro.

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
