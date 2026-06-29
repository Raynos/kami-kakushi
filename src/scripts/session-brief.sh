#!/usr/bin/env bash
# session-brief.sh — print the human's open queue at session start.
#
# Wired into the SessionStart hook (.claude/settings.json) so every cold pickup
# surfaces what's waiting on the human WITHOUT being asked:
#   1. the reading queue  (project/docs-to-read-for-human.md — unticked sign-offs)
#   2. pending PRD changes (project/status/pending-prd-changes.md — locked canon not yet applied)
#   3. open decisions     (project/human-in-the-loop/decisions.md — H-items)
#   4. open reviews       (project/human-in-the-loop/review.md — R-items)
#
# Output goes to stdout, which the SessionStart hook injects into Claude's context
# (so the agent can lead the session by relaying the brief). NOTE: a SessionStart
# hook's output is NOT painted into the TUI scrollback on success — stdout feeds the
# model's context, and stderr is only visible in transcript mode (Ctrl-R). So the
# brief surfaces via the agent's first reply, not on its own. Run it by hand any
# time to see it directly: `bash src/scripts/session-brief.sh`.
# Pure read — never mutates state.

set -euo pipefail

# Resolve the repo root from this script's location so it works from any CWD.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

READING="project/docs-to-read-for-human.md"
PENDING_PRD="project/status/pending-prd-changes.md"
DECISIONS="project/human-in-the-loop/decisions.md"
REVIEWS="project/human-in-the-loop/review.md"

# Accumulate the whole brief into one buffer, then emit it to stdout at the end.
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

# --- Pending PRD changes: locked canon (ADRs) not yet rippled into docs/code ---
# Not a human action — an agent-facing flag: until applied, prd.md is STALE on these
# points and the ADRs + this tracker are the source of truth. Count unticked "- [ ]".
if [[ -f "$PENDING_PRD" ]]; then
  open_prd="$(grep -cE '^[[:space:]]*- \[ \]' "$PENDING_PRD" || true)"
  if [[ "${open_prd:-0}" -gt 0 ]]; then
    add "### 📥 Pending PRD changes — locked canon NOT yet applied"
    add "- ⚠️ **${open_prd}** decided change(s) not yet rippled into \`prd.md\` / docs / code — see \`$PENDING_PRD\`."
    add "  Until applied, that tracker + the ADRs are the source of truth; \`prd.md\` is **stale** on those points."
    add ""
  fi
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

# Emit to stdout → injected into Claude's context by the SessionStart hook.
printf '%s' "$BRIEF"
