# `brainstorms/raw/` — verbatim workflow-output snapshots

Durable, timestamped, **verbatim** copies of the raw JSON results produced by `Workflow` runs (and any
other agent research worth preserving). **Cheap insurance:** workflow results otherwise live only in
ephemeral session scratch (`<session>/tasks/<id>.output`) and are **lost when the session ends**.

> **Git-ignored (`*.json`) — local-disk-only insurance.** These snapshots are **not tracked** (they
> bloated the repo) and live on **local disk only**. Their *only* job is **local session-resume
> insurance**: if the internet drops, a bug hits, or you accidentally `Ctrl+C` mid-run, the raw output
> is still here to resume from. They survive session end but **do not reach the remote**, so they're
> **lost on machine loss** — never treat a raw `.json` as durable archival.
>
> **Durable = markdown + committed.** Anything that must survive (reach the remote, be reviewed, be
> acted on) **must be distilled into markdown** in `../` / `../../docs/` and committed — that markdown
> is the source of truth. It should be **far smaller** than the `.json` it came from (curated signal,
> not the verbatim transcript); if it isn't smaller, it wasn't distilled.

- **Filename:** `YYYY-MM-DD-<descriptive-slug>-<taskid>.json`.
- **Verbatim, not curated.** These are raw outputs. The curated source-of-truth lives in `../`
  (brainstorms discovery) and `../../docs/` (living design). If a distillation turns out lossy, recover
  the detail here.
- **Snapshot helper:** `scripts/snapshot-research.sh <output-file> <slug>`.
- **Do not hand-edit** these files — they are archival.
- Only snapshot **workflow** result files (a single JSON object with a `result` key). Do **not** copy
  subagent (Agent-tool) `*.output` files — those are huge JSONL conversation transcripts.

This file is the **canonical** statement of the durable-capture rule; AGENTS.md
(Conventions → "Durable capture of workflow / subagent outputs") carries the short
form + a pointer here.
