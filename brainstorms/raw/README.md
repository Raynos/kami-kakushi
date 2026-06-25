# `brainstorms/raw/` — verbatim workflow-output snapshots

Durable, timestamped, **verbatim** copies of the raw JSON results produced by `Workflow` runs (and any
other agent research worth preserving). **Cheap insurance:** workflow results otherwise live only in
ephemeral session scratch (`<session>/tasks/<id>.output`) and are **lost when the session ends**.

- **Filename:** `YYYY-MM-DD-<descriptive-slug>-<taskid>.json`.
- **Verbatim, not curated.** These are raw outputs. The curated source-of-truth lives in `../`
  (brainstorms discovery) and `../../docs/` (living design). If a distillation turns out lossy, recover
  the detail here.
- **Snapshot helper:** `scripts/snapshot-research.sh <output-file> <slug>`.
- **Do not hand-edit** these files — they are archival.
- Only snapshot **workflow** result files (a single JSON object with a `result` key). Do **not** copy
  subagent (Agent-tool) `*.output` files — those are huge JSONL conversation transcripts.

See the **"Durable capture of workflow/subagent outputs"** convention in
[`../../CLAUDE.md`](../../CLAUDE.md).
