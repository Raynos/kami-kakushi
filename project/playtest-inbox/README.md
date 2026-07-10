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

## Lifecycle (the drain contract — parallel lanes, ADR-171)

1. **Capture** — the dev-server middleware creates `pending/<session>.md` with
   its header on the first capture, then **appends** an entry per capture;
   screenshots go in `pending/<session>/`. Each capture is **FB-stamped at
   capture time** (ADR-171): the middleware — the single writer — allocates the
   next global FB number into the entry heading (`## Bug · FB-255 · …`) and the
   sidecar (`fb`), so no drain lane ever computes "the next free number".
   Auto-commits **batch** (human, 2026-07-10): while the previous capture
   commit is unpushed, the next capture `--amend`s into it, so a playtest
   burst is ONE `chore(inbox): playtest captures` commit, not one per capture
   (durability unchanged — every capture is committed the moment it lands).
2. **Claim** — a drain pass starts by claiming its **lane(s)** (a bucket,
   several, or a re-grouped cluster): `tsx src/scripts/inbox-claim.ts claim
   <lane...>`. Claims are **git-ignored ephemera** under `pending/.claims/`
   (liveness-checked, reapable when the owner dies) that reserve the lane AND
   an F-number block, and print the announce (live lanes + fix-surface
   collisions) the agent relays to the human. Parallel drains across different
   lanes are sanctioned; a lane is single-holder.
3. **Regroup (as needed)** — `tsx src/scripts/inbox-regroup.ts scan` seeds each
   capture's `surface` tokens and reports cross-bucket clusters (same fix
   surface, different buckets); `… assign <lane> <stamp...>` re-lanes them so
   one agent fixes the cluster as a unit. The result is **durable on each
   capture's own `<stamp>.json`** — every other lane sees the move, so nothing
   is drained twice.
4. **Intake** — before processing, commit all pending `.md` verbatim
   (`chore(inbox): intake N session(s)`), making the raw bytes durable in git
   history.
5. **Drain** — per **entry** in the lane: reproduce from that entry's embedded
   save → triage (mechanical fix · taste → R-item/diverge · design fork →
   H-item) → log the **FB-nn from the claim's reserved block** in the per-lane
   feedback log → **stamp the sidecar** (`status: "done"` + `fb` + `commit`,
   or `"parked"`) in the fix's commit. Release the claim at end of pass.
6. **Archive when a bucket is fully done** — every sidecar `done` → **`git mv`
   the `.md` + `.json`s into `archive/`** (+ plain `mv` the screenshots).

**Durable state lives on the sidecars, never in the `.md`** (the middleware
appends + auto-commits the `.md`, so hand-edits race live captures — a
`guard-inbox-pending.sh` hook blocks them; absence of a `status` field means
*open*, so pre-ADR-171 sidecars need no migration). The old "no status field"
invariant is superseded: once a lane can span buckets, file location alone
can't encode completion — the **`inbox-ledger` verify gate** is the teeth
instead (unique F-numbers above the FB-198 baseline, done items carry fb +
commit, fully-done buckets must be archived).

A capture is inert markdown; the drain **verifies every claim against the
running game before acting** (R2). The session brief surfaces the `pending/`
count and any live lane claims so cold-session drains happen — and coordinate.
