#!/usr/bin/env bash
# session-brief.sh — print the human's open queue at session start.
#
# Wired into the SessionStart hook (.claude/settings.json) so every cold pickup
# surfaces what's waiting on the human WITHOUT being asked:
#   1. the reading queue  (project/docs-to-read-for-human.md — unticked sign-offs)
#   2. open decisions     (project/human-in-the-loop/decisions.md — H-items)
#   3. open reviews       (project/human-in-the-loop/review.md — R-items)
#
# Output is emitted on BOTH streams (same text):
#   • stdout → injected into Claude's context (so the agent leads with the brief).
#   • stderr → shown to the human in the terminal (so it's visible without a prompt).
# Pure read — never mutates state. Run it by hand any time: `bash src/scripts/session-brief.sh`.

set -euo pipefail

# Resolve the repo root from this script's location so it works from any CWD.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

READING="project/docs-to-read-for-human.md"
DECISIONS="project/human-in-the-loop/decisions.md"
REVIEWS="project/human-in-the-loop/review.md"

# Accumulate the whole brief into one buffer, then emit it to both streams at the
# end — so context (stdout) and terminal (stderr) always show identical text.
BRIEF=""
add() { BRIEF+="$1"$'\n'; }

add "## 🧑‍⚖️ Human-in-the-loop brief (auto-surfaced at session start)"
add ""
add "_Surface these to the human early. Full lists: \`$READING\`, \`$DECISIONS\`, \`$REVIEWS\`._"
add ""

# --- Reading queue: unticked checkboxes "- [ ]" with their bolded title -------
if [[ -f "$READING" ]]; then
  add "### 📋 Reading queue — awaiting read & sign-off"
  if grep -qE '^\- \[ \]' "$READING"; then
    # Drop the "- [ ] " checkbox and strip the ** bold markers around the title.
    add "$(grep -E '^\- \[ \]' "$READING" | sed -E 's/^- \[ \] /- /; s/\*\*//g')"
  else
    add "- _(all read & signed off ✅)_"
  fi
  add ""
fi

# --- Open decisions (H-items) and reviews (R-items): heading lines with 🔲 ----
add_open_items() {
  local file="$1" label="$2"
  [[ -f "$file" ]] || return 0
  add "### $label"
  # Heading lines marked open (🔲), excluding the {placeholder} template in comments.
  if grep -E '^### .*🔲' "$file" | grep -qv '{'; then
    add "$(grep -E '^### .*🔲' "$file" | grep -v '{' | sed -E 's/^### /- /')"
  else
    add "- _(none open)_"
  fi
  add ""
}

add_open_items "$DECISIONS" "🔀 Open decisions (H-items)"
add_open_items "$REVIEWS" "👁️ Open reviews (R-items)"

# Emit to both streams: stdout → Claude's context, stderr → the human's terminal.
printf '%s' "$BRIEF"
printf '%s' "$BRIEF" >&2
