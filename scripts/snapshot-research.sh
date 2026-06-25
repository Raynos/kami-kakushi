#!/usr/bin/env bash
# Snapshot a workflow's raw .output JSON verbatim into brainstorms/raw/ as durable,
# timestamped insurance. Workflow results otherwise live ONLY in ephemeral session
# scratch (<session>/tasks/<id>.output) and are LOST when the session ends.
#
# Usage:
#   scripts/snapshot-research.sh <path-to-output-file> <slug>
# Example:
#   scripts/snapshot-research.sh \
#     /private/tmp/claude-.../tasks/w56sdr98l.output estate-restoration-s1-w56sdr98l
#
# Produces:  brainstorms/raw/<YYYY-MM-DD>-<slug>.json   (verbatim copy)
#
# NOTE: snapshot only WORKFLOW result files (a single JSON object with a "result" key).
# Do NOT snapshot subagent (Agent-tool) *.output files — those are huge JSONL transcripts.
set -euo pipefail

src="${1:?usage: snapshot-research.sh <output-file> <slug>}"
slug="${2:?usage: snapshot-research.sh <output-file> <slug>}"

if [ ! -f "$src" ]; then
  echo "error: source not found: $src" >&2
  exit 1
fi

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
dest_dir="$repo_root/brainstorms/raw"
mkdir -p "$dest_dir"
dest="$dest_dir/$(date +%Y-%m-%d)-${slug}.json"

cp "$src" "$dest"
bytes=$(wc -c < "$dest" | tr -d ' ')
echo "snapshotted (${bytes} bytes): ${dest#"$repo_root"/}"
