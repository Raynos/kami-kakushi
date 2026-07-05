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
# SELF-EXCLUSION — by SESSION ID, not pane. The calling shell's HERDR_PANE_ID is
# the Bash-tool subshell's pane (e.g. w2:p1), which does NOT match the pane herdr
# registered THIS agent under (e.g. w1:p3) — so a pane match silently fails and the
# agent lists ITSELF as a peer (the "1 other agent" phantom on a solo session). The
# reliable key is the Claude session id: the agent's agent_session.value equals
# CLAUDE_CODE_SESSION_ID. We match on that (pane_id stays a best-effort fallback).
#
# INCLUDE-SELF MODE — set HERDR_PEERS_INCLUDE_SELF=1 to ALSO emit the current agent,
# as a 4-column line  <pane>\t<status>\t<goal>\tself  (peers get a trailing `peer`).
# This lets session-brief show "…and one of them is YOU" explicitly. The DEFAULT
# (env unset) stays the 3-column peers-only contract the git hooks parse — so this
# is backward compatible: pre-commit/pre-push are unchanged.
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
herdr agent list 2>/dev/null \
  | ROOT="$ROOT" \
    HERDR_PANE_ID="${HERDR_PANE_ID:-}" \
    CLAUDE_CODE_SESSION_ID="${CLAUDE_CODE_SESSION_ID:-}" \
    HERDR_PEERS_INCLUDE_SELF="${HERDR_PEERS_INCLUDE_SELF:-}" \
    python3 -c '
import sys, json, os, subprocess

root = os.environ["ROOT"]
my_pane = os.environ.get("HERDR_PANE_ID", "")
my_session = os.environ.get("CLAUDE_CODE_SESSION_ID", "")
include_self = os.environ.get("HERDR_PEERS_INCLUDE_SELF", "") == "1"
MAX = 8  # never enrich more than this many agents (bounds socket calls)

def on_tree(cwd):
    return cwd == root or cwd.startswith(root + "/")

def is_self(a):
    # Primary key: the Claude session id (agent_session.value). The pane id is only a
    # fallback — the caller-shell HERDR_PANE_ID is the Bash subshell pane, which does
    # NOT match the pane herdr registered this agent under, so a pane match alone
    # would miss and the agent would list itself as a peer.
    sess = (a.get("agent_session") or {}).get("value") or ""
    if my_session and sess == my_session:
        return True
    if my_pane and a.get("pane_id") == my_pane:
        return True
    return False

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

# Split on-tree agents into peers (others) and self. Peers are always emitted; self
# is emitted only in include-self mode (4th column marks the role).
agents = []  # (pane, status, role) — peers first, self last
for a in data.get("result", {}).get("agents", []):
    cwd = a.get("cwd") or a.get("foreground_cwd") or ""
    if not on_tree(cwd):
        continue
    role = "self" if is_self(a) else "peer"
    if role == "self" and not include_self:
        continue
    agents.append((a.get("pane_id", "?"), a.get("agent_status", "?"), role))
agents.sort(key=lambda t: t[2] == "self")  # peers first, self last

for i, (pane, status, role) in enumerate(agents):
    goal = goal_of(pane) if i < MAX else ""
    if include_self:
        print("%s\t%s\t%s\t%s" % (pane, status, goal, role))
    else:
        print("%s\t%s\t%s" % (pane, status, goal))
' 2>/dev/null || true
