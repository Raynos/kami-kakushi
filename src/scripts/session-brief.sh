#!/usr/bin/env bash
# session-brief.sh — print the human's open queue at session start.
#
# Wired into the SessionStart hook (.claude/settings.json) so every cold pickup
# surfaces what's waiting on the human WITHOUT being asked:
#   1. the reading queue  (project/docs-to-read-for-human.md — unticked sign-offs)
#   2. open decisions     (project/human-in-the-loop/decisions.md — H-items)
#   3. open reviews       (project/human-in-the-loop/review.md — R-items)
#
# Output goes to stdout, which the hook injects into Claude's context. Pure read —
# never mutates state. Run it by hand any time: `bash src/scripts/session-brief.sh`.

set -euo pipefail

# Resolve the repo root from this script's location so it works from any CWD.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

READING="project/docs-to-read-for-human.md"
DECISIONS="project/human-in-the-loop/decisions.md"
REVIEWS="project/human-in-the-loop/review.md"

echo "## 🧑‍⚖️ Human-in-the-loop brief (auto-surfaced at session start)"
echo
echo "_Surface these to the human early. Full lists: \`$READING\`, \`$DECISIONS\`, \`$REVIEWS\`._"
echo

# --- Reading queue: unticked checkboxes "- [ ]" with their bolded title -------
if [[ -f "$READING" ]]; then
  echo "### 📋 Reading queue — awaiting read & sign-off"
  if grep -qE '^\- \[ \]' "$READING"; then
    # Drop the "- [ ] " checkbox and strip the ** bold markers around the title.
    grep -E '^\- \[ \]' "$READING" | sed -E 's/^- \[ \] /- /; s/\*\*//g' || true
  else
    echo "- _(all read & signed off ✅)_"
  fi
  echo
fi

# --- Open decisions (H-items) and reviews (R-items): heading lines with 🔲 ----
print_open_items() {
  local file="$1" label="$2"
  [[ -f "$file" ]] || return 0
  echo "### $label"
  # Heading lines marked open (🔲), excluding the {placeholder} template in comments.
  if grep -E '^### .*🔲' "$file" | grep -qv '{'; then
    grep -E '^### .*🔲' "$file" | grep -v '{' | sed -E 's/^### /- /'
  else
    echo "- _(none open)_"
  fi
  echo
}

print_open_items "$DECISIONS" "🔀 Open decisions (H-items)"
print_open_items "$REVIEWS" "👁️ Open reviews (R-items)"
