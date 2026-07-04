#!/usr/bin/env bash
# herdr-dev-space.sh — ensure the dev/playtest server is up in a FIXED shared
# workspace, and print its URL. Idempotent: re-running ATTACHES to the existing
# server instead of starting a second one.
#
# Why a dedicated workspace (not a split pane): the server is a shared resource that
# should outlive any one task or agent (human call, 2026-07-04). So it lives in its
# own persistent "dev-server" workspace, created --no-focus so it never steals your
# pane. Any agent runs this and gets the same one server.
#
# Guarded: a clean no-op with a manual fallback when herdr is absent (D-124: herdr
# is optional local tooling, never a hard dependency).
#
#   bash src/scripts/herdr-dev-space.sh
#
# Env: DEV_SPACE_LABEL (default "dev-server"), DEV_READY_TIMEOUT_MS (default 30000).
set -uo pipefail

LABEL="${DEV_SPACE_LABEL:-dev-server}"
TIMEOUT="${DEV_READY_TIMEOUT_MS:-30000}"
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

# --- Fallback when herdr isn't available: tell the caller how to do it by hand. ---
if [ "${HERDR_ENV:-}" != "1" ] || ! command -v herdr >/dev/null 2>&1 || ! command -v python3 >/dev/null 2>&1; then
  echo "herdr not available — start the dev server yourself:  (cd '$ROOT' && npm run dev)" >&2
  exit 0
fi

# All JSON orchestration in Python — robust find-or-create, attach-or-start.
DEV_SPACE_LABEL="$LABEL" DEV_READY_TIMEOUT_MS="$TIMEOUT" DEV_ROOT="$ROOT" python3 - <<'PY'
import json, os, re, subprocess, sys

LABEL = os.environ["DEV_SPACE_LABEL"]
ROOT = os.environ["DEV_ROOT"]
TIMEOUT = os.environ.get("DEV_READY_TIMEOUT_MS", "30000")
URL_RE = re.compile(r"http://localhost:\d+")


def herdr(*args, timeout=None):
    """Run a herdr CLI command; return (parsed_json_or_None, raw_stdout)."""
    try:
        out = subprocess.run(["herdr", *args], capture_output=True, text=True,
                             timeout=timeout)
    except Exception:
        return None, ""
    raw = out.stdout or ""
    try:
        return json.loads(raw), raw
    except Exception:
        return None, raw


def find_workspace():
    data, _ = herdr("workspace", "list")
    if not data:
        return None
    for w in data.get("result", {}).get("workspaces", []):
        if w.get("label") == LABEL:
            return w.get("workspace_id") or w.get("number")
    return None


def create_workspace():
    data, _ = herdr("workspace", "create", "--cwd", ROOT, "--label", LABEL, "--no-focus")
    w = (data or {}).get("result", {}).get("workspace", {})
    return w.get("workspace_id") or w.get("number")


def first_pane(ws):
    data, _ = herdr("pane", "list", "--workspace", str(ws))
    panes = (data or {}).get("result", {}).get("panes", [])
    return panes[0].get("pane_id") if panes else None


def pane_url(pane):
    _, raw = herdr("pane", "read", str(pane), "--source", "recent", "--lines", "80")
    m = URL_RE.search(raw)
    return m.group(0) if m else None


ws = find_workspace() or create_workspace()
if not ws:
    print(f"herdr-dev-space: could not resolve the '{LABEL}' workspace", file=sys.stderr)
    sys.exit(1)

pane = first_pane(ws)
if not pane:
    print(f"herdr-dev-space: workspace '{ws}' has no pane to run in", file=sys.stderr)
    sys.exit(1)

url = pane_url(pane)
if url:
    print(f"dev server already up in workspace '{LABEL}' ({ws}), pane {pane}")
    print(f"  URL: {url}   (re-run this script any time to re-attach)")
    sys.exit(0)

print(f"starting dev server in workspace '{LABEL}' ({ws}), pane {pane}…", file=sys.stderr)
herdr("pane", "run", str(pane), "npm run dev")
# Block until Vite prints its URL (best-effort; never fatal on timeout).
herdr("wait", "output", str(pane), "--match", r"localhost:\d+", "--regex",
      "--timeout", TIMEOUT, timeout=(int(TIMEOUT) / 1000 + 5))
url = pane_url(pane)

if url:
    print(f"dev server ready in workspace '{LABEL}' ({ws}), pane {pane}")
    print(f"  URL: {url}   (persists across tasks/agents; re-run to re-attach)")
else:
    print(f"dev server started in pane {pane} but no URL detected within {TIMEOUT}ms —", file=sys.stderr)
    print(f"  inspect:  herdr pane read {pane} --source recent --lines 40", file=sys.stderr)
    sys.exit(1)
PY
