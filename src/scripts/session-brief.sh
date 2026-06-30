#!/usr/bin/env bash
# session-brief.sh — print the human's open queue at session start.
#
# Wired into the SessionStart hook (.claude/settings.json) so every cold pickup
# surfaces what's waiting on the human WITHOUT being asked:
#   1. human TODOs        (project/todo-human.md ## TODO — unticked tasks)
#   2. the reading queue  (project/todo-human.md ## Reading queue — unticked sign-offs)
#   3. pending PRD changes (project/status/pending-prd-changes.md — locked canon not yet applied)
#   4. open decisions     (project/human-in-the-loop/decisions.md — H-items)
#   5. open reviews       (project/human-in-the-loop/review.md — R-items)
# ...then a "what to DO next" nudge so a cold pickup knows where the work lives:
#   6. next autonomous work — NOT a maintained list. Just points at the sources
#      that are ALREADY kept current (the active plan(s), project-status.md, the
#      latest journal) and asks the agent to name the startable workstream(s) —
#      OFTEN JUST ONE (the active plan); "up to 3" is a cap for genuinely-parallel
#      work, not a quota to pad to. This must be FAST (≤5s): the agent relays
#      THIS output with ZERO tool calls — every signal it needs (queue, reviews,
#      commits, active-plan tag) is already inlined below. Even one git/Read/verify
#      round-trip costs several seconds and blows the budget; the deeper
#      verify-against-git check is for when the work is PICKED UP, not the brief.
#      No new file to keep in sync; the script names the current files so the agent
#      doesn't have to hunt — but it must NOT open them just to brief.
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

HUMAN_TODO="project/todo-human.md"
PENDING_PRD="project/status/pending-prd-changes.md"
DECISIONS="project/human-in-the-loop/decisions.md"
REVIEWS="project/human-in-the-loop/review.md"
PROJECT_STATUS="project/status/project-status.md"
PLANS_DIR="docs/plans"
JOURNAL_DIR="project/journal"
ROADMAP="docs/living/roadmap.md"

# Accumulate the whole brief into one buffer, then emit it to stdout at the end.
BRIEF=""
add() { BRIEF+="$1"$'\n'; }

# Extract top-level unticked items "- [ ]" under a given "## <heading>" section,
# stopping at the next "## " heading. Drops the checkbox and the ** bold markers.
section_items() {
  local file="$1" heading="$2"
  awk -v target="## $heading" '
    /^## / { insec = ($0 == target); next }
    insec && /^- \[ \] / { sub(/^- \[ \] /, "- "); gsub(/\*\*/, ""); print }
  ' "$file"
}

add "## 🧑‍⚖️ Human-in-the-loop brief (auto-surfaced at session start)"
add ""
add "> ⏱️ **Opening turn ≤5s — relay this brief with ZERO tool calls.** Everything you need (queue, reviews, commits, the active-plan tag) is already inlined below. Do **not** run \`git\`/\`Read\`/\`verify\` or open any file just to brief — even one round-trip costs several seconds and blows the budget. Defer every verify-against-git check to when you actually pick the work up."
add ""
add "_Surface these to the human early. Full lists: \`$HUMAN_TODO\`, \`$DECISIONS\`, \`$REVIEWS\`._"
add ""

# --- Human TODO + reading queue: section-aware unticked checkboxes -------------
if [[ -f "$HUMAN_TODO" ]]; then
  add "### 📌 TODO — tasks awaiting the human"
  todo_items="$(section_items "$HUMAN_TODO" "TODO")"
  if [[ -n "$todo_items" ]]; then
    add "$todo_items"
  else
    add "- _(none open)_"
  fi
  add ""

  add "### 📋 Reading queue — awaiting read & sign-off"
  reading_items="$(section_items "$HUMAN_TODO" "Reading queue")"
  if [[ -n "$reading_items" ]]; then
    add "$reading_items"
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

# --- What to DO next: an INVESTIGATION nudge, NOT a stored/parsed task list -----
# We deliberately keep no "next tasks" file and compute no answer here — both would
# rot and become one more thing to maintain. Instead the agent identifies the next
# autonomous work itself, from the live project state (git history + the docs that
# are already kept current), and VERIFIES rather than trusts: e.g. done plans linger
# in docs/plans/ (they're not always archived), so file order is NOT "what's active"
# — only each plan's own Status line is. This block just orients that investigation.
add "## 🤖 Next autonomous work — name the startable workstream(s)"
add ""
add "_No stored task list. In your opening relay, name the **startable autonomous workstream(s)** — **often just the one active plan tagged ▶️ below; \"up to 3\" is a cap for genuinely-parallel work, not a quota to pad to** (don't split one plan's steps into three \"tasks\"). Keep it **FAST (≤5s)**: name them straight from THIS output — the ▶️/✅ plan tags and the commits are already inlined, so **make ZERO tool calls to brief** (no \`git\`, no \`Read\`, no \`verify\`, don't open the plan). The deeper verify-don't-trust check is for when you actually pick the work up, not the brief. Skip human-gated items (playtests, taste calls, design decisions). Where the signal lives:_"
add ""

# Recent commits — the freshest "what just happened" (git is the source of truth).
recent="$(git log --oneline -6 2>/dev/null || true)"
if [[ -n "$recent" ]]; then
  add "- 🔀 **Recent commits** (momentum — read more with \`git log\`):"
  while IFS= read -r c; do add "  - $c"; done <<<"$recent"
fi
# Plans in docs/plans/ — tag each DONE-vs-active from its OWN status line, because
# finished plans are not reliably archived (so "newest file" ≠ "active plan").
if [[ -d "$PLANS_DIR" ]]; then
  plans="$(ls -1 "$PLANS_DIR"/*.md 2>/dev/null | sort -r)"
  if [[ -n "$plans" ]]; then
    add "- 📐 **Plans in \`$PLANS_DIR\`** — open the *active* one for the sequenced steps (done plans linger here — trust the Status line, not the filename):"
    while IFS= read -r p; do
      sl="$(head -8 "$p" | grep -m1 -iE 'status' || true)"
      if printf '%s' "$sl" | grep -qiE 'done|complete|shipped|✅'; then
        add "  - ✅ \`$p\` — looks DONE (skip)"
      else
        add "  - ▶️ \`$p\` — maybe active (open it; confirm via Status + commits)"
      fi
    done <<<"$plans"
  else
    add "- 📐 **Plans:** _(none in \`$PLANS_DIR\` — use the roadmap below)_"
  fi
fi
# The live snapshot — its "How to resume → Next, in order" block is the agenda.
[[ -f "$PROJECT_STATUS" ]] && add "- 🧭 **Live snapshot** — the \"How to resume → Next, in order\" block: \`$PROJECT_STATUS\`"
# The newest journal — the freshest "what just happened + next intended steps".
latest_journal="$(ls -1 "$JOURNAL_DIR"/*.md 2>/dev/null | grep -Ev '/(README|_TEMPLATE)\.md$' | sort | tail -1)"
[[ -n "$latest_journal" ]] && add "- 📓 **Latest journal** — its \"Next intended steps\": \`$latest_journal\`"
# The milestone tracker — the wider horizon when the plans are exhausted.
[[ -f "$ROADMAP" ]] && add "- 🗺️ **Roadmap** — the wider horizon (status legend ✅/🔧/🆕/⏳ → next 🆕/⏳ slice): \`$ROADMAP\`"
add ""

# Emit to stdout → injected into Claude's context by the SessionStart hook.
printf '%s' "$BRIEF"
