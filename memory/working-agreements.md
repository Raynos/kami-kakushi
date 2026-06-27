---
name: working-agreements
description: How to work on this repo — cadence, autonomy, the commit/journal gate
metadata:
  type: feedback
---

# Working agreements

**Cadence:** many small commits; journal each session in [`../journal/`](../journal/) — a chronological
log (summary at top, **append entries at the bottom, never prepend**; live state lives in
[`project-status.md`](project-status.md), see [`../journal/README.md`](../journal/README.md)); durable design
in [`../docs/`](../docs/) (living docs, edited in place); per-fact memory here. Locked design
decisions are recorded as ADRs in [`../docs/history/decisions.md`](../docs/history/decisions.md).

**Commit gate:** keep the build working, and stage a `journal/` change every commit (enforced by
`.githooks/pre-commit`; `SKIP_JOURNAL=1` for trivial commits). Gate every commit on `npm run verify`
(tsc + eslint + prettier + vitest + verify-content + gen:docs --check), recorded in
[project-status](project-status.md).

**Autonomy:** pick the next task → build → verify → commit → journal → repeat. Stop and ask only for
(1) decisions that change what the game *is*, and (2) outward-facing / hard-to-reverse actions (push,
deploy, delete) — never without explicit approval. State lives in commits + journal so a compaction
never loses progress.

**Architecture rule:** keep game logic in a **pure core** (no DOM/canvas imports), deterministic
(one seeded RNG) and testable; the renderer consumes it as plain data.
