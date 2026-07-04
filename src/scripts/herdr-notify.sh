#!/usr/bin/env bash
# herdr-notify.sh — ping the human with a desktop notification when an agent hits
# something worth surfacing async: a just-filed H-item / R-item, or a blocking fork
# it's about to leave for a human call. Serves D-083 ("surface, don't block") — the
# agent keeps moving and the human sees the flag without watching the pane.
#
# Guarded: a clean no-op without herdr, but the message is NOT lost — it still goes
# to stderr for the transcript (D-124: herdr optional, never a hard dependency).
#
#   bash src/scripts/herdr-notify.sh "<title>" ["<body>"]
#   bash src/scripts/herdr-notify.sh "F4 needs a call" "persona-bot thresholds ambiguous"
set -uo pipefail

title="${1:-}"
body="${2:-}"
if [ -z "$title" ]; then
  echo "usage: herdr-notify.sh <title> [body]" >&2
  exit 2
fi

if [ "${HERDR_ENV:-}" != "1" ] || ! command -v herdr >/dev/null 2>&1; then
  echo "🔔 (for the human) ${title}${body:+ — ${body}}" >&2
  exit 0
fi

args=(notification show "$title" --sound request)
[ -n "$body" ] && args+=(--body "$body")
herdr "${args[@]}" >/dev/null 2>&1 || true
