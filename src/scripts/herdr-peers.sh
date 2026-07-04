#!/usr/bin/env bash
# herdr-peers.sh — list OTHER agents live on THIS working tree, with their goal.
#
# The single source of shared-tree awareness, reused by three surfaces:
#   - src/scripts/session-brief.sh  (SessionStart callout)
#   - .githooks/pre-commit          (commit-time FYI — long-running agents)
#   - .githooks/pre-push            (a RED you didn't cause is legible)
#
# Emits one TAB-separated line per peer agent:  <pane_id>\t<status>\t<goal>
# (goal = the agent's OSC title / status-line label, best-effort; may be empty.)
# Prints NOTHING and exits 0 when: herdr is absent, HERDR_ENV≠1, python3 is
# missing, or no other agent shares this tree. So callers can treat any output as
# "there are peers" and no output as "solo / not applicable" — a clean no-op
# without herdr (D-124: optional local tooling, never a hard dependency).
#
# Arg 1 (optional): repo root to filter by. Defaults to `git rev-parse` / PWD.
set -uo pipefail

ROOT="${1:-}"
if [ -z "$ROOT" ]; then
  ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
fi

[ "${HERDR_ENV:-}" = "1" ]                 || exit 0
command -v herdr   >/dev/null 2>&1         || exit 0
command -v python3 >/dev/null 2>&1         || exit 0

# One `agent list` for the peer set + status; one `agent explain --json` per peer to
# enrich with the goal (OSC title). Capped so a crowded machine can't blow the budget.
herdr agent list 2>/dev/null | ROOT="$ROOT" HERDR_PANE_ID="${HERDR_PANE_ID:-}" python3 -c '
import sys, json, os, subprocess

root = os.environ["ROOT"]
me = os.environ.get("HERDR_PANE_ID", "")
MAX = 8  # never enrich more than this many peers (bounds socket calls)

def on_tree(cwd):
    return cwd == root or cwd.startswith(root + "/")

def goal_of(pane):
    # Pull the agents OSC title (its status-line goal) from `agent explain --json`.
    try:
        out = subprocess.run(["herdr", "agent", "explain", pane, "--json"],
                             capture_output=True, text=True, timeout=2)
        info = json.loads(out.stdout)
    except Exception:
        return ""
    for rule in info.get("evaluated_rules", []):
        if rule.get("region") == "osc_title":
            preview = ((rule.get("evidence", {}) or {}).get("region_preview", "") or "").strip()
            # Drop a single leading spinner/glyph (e.g. the braille progress char)
            # when it is followed by a space: "⠐ Review F4 plan" -> "Review F4 plan".
            if len(preview) > 1 and preview[1] == " " and not preview[0].isalnum():
                preview = preview[2:]
            return preview.strip()
    return ""

try:
    data = json.load(sys.stdin)
except Exception:
    sys.exit(0)

peers = []
for a in data.get("result", {}).get("agents", []):
    if a.get("pane_id") == me:
        continue
    cwd = a.get("cwd") or a.get("foreground_cwd") or ""
    if not on_tree(cwd):
        continue
    peers.append((a.get("pane_id", "?"), a.get("agent_status", "?")))

for i, (pane, status) in enumerate(peers):
    goal = goal_of(pane) if i < MAX else ""
    print("%s\t%s\t%s" % (pane, status, goal))
' 2>/dev/null || true
