#!/usr/bin/env bash
# session-brief.sh — print the human's open queue at session start.
#
# Wired into the SessionStart hook (.claude/settings.json) so every cold pickup
# surfaces what's waiting on the human WITHOUT being asked:
#   0. playtest inbox headline (per-bucket in-progress capture counts, biggest
#      bucket first — the very first line, so a "gm"/"gn" turn opens with it)
#   1. human TODOs        (project/todo-human.md ## TODO — unticked tasks)
#   2. the reading queue  (project/todo-human.md ## Reading queue — unticked sign-offs)
#   3. pending PRD changes (project/status/pending-prd-changes.md — locked canon not yet applied)
#   4. open decisions     (project/human-in-the-loop/decisions.md — HD-items)
#   5. open reviews       (project/human-in-the-loop/review.md — HR-items)
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

# --- herdr: other agents live on THIS working tree (shared-tree safety) ---------
# Delegates to the shared herdr-peers helper (clean no-op without herdr — D-124:
# optional local tooling, never a hard dependency). The helper does one fast local
# socket call by the SCRIPT (not an agent round-trip), so the brief stays ≤5s.
# Prints nothing in the common solo case (no noise). Advisory only; never blocks.
herdr_shared_tree() {
  # Include-self mode: the helper returns a 4th column (peer|self) so we can show
  # WHICH row is this session. Gate on the PEER count (self never counts) — so the
  # callout fires only when ≥1 OTHER agent shares the tree; a solo session stays
  # silent even though our own row is in the output.
  local rows
  rows="$(HERDR_PEERS_INCLUDE_SELF=1 bash "$ROOT/src/scripts/herdr-peers.sh" "$ROOT" 2>/dev/null || true)"
  [[ -n "$rows" ]] || return 0

  # grep -c exits 1 on zero matches — the || true keeps set -e from killing the
  # whole brief when this session is the only agent on the tree.
  local peer_count; peer_count="$(printf '%s\n' "$rows" | awk -F'\t' 'NF>=4 && $4=="peer"' | grep -c . || true)"
  [[ "${peer_count:-0}" -gt 0 ]] || return 0  # solo (only self on tree) → no noise

  local total=$((peer_count + 1))
  add "### ⚠️ Shared tree — ${peer_count} OTHER agent(s) live here, plus you (${total} total)"
  local pane status goal role label
  while IFS=$'\t' read -r pane status goal role; do
    [[ -n "$pane" ]] || continue
    if [[ "$role" == "self" ]]; then
      label="**you** (this session)"
    else
      label="$status"
    fi
    if [[ -n "$goal" ]]; then add "- \`$pane\` — $label · _${goal}_"; else add "- \`$pane\` — $label"; fi
  done <<<"$rows"
  add "> One of the rows above is **this session** (marked _you_) — the ${peer_count} without that mark are the other agent(s). Respect shared-tree safety: stage **only your own paths** (never \`git add -A\`); never \`stash\`/\`checkout\`/\`restore\` files you didn't author. A push may be **correctly** blocked by another agent's red WIP — leave it local, don't \`SKIP_VERIFY\` it onto \`main\`. (\`herdr agent list\` for the live picture.)"
  add ""
}

# --- Inbox headline: per-bucket in-progress capture counts, the very first line -
# The human wants the feedback-inbox shape at a glance without asking an agent, in
# the exact shape:
#   Playtest inbox - r0 (25 in progress) dev (11 in progress) the-log (4 in progress)
# Every capture still sitting in pending/ counts as IN PROGRESS — the bucket is the
# unit, and it stays in progress until it is fully drained and ARCHIVED out of
# pending/. A mid-drain status:"done" stamp on one sidecar does NOT retire that
# capture from the human's view (the earlier "OPEN only" count read 8/22/4 while the
# buckets actually held 11/25/4), so we count ALL sidecars, done or not. One capture
# == one <stamp>.json sidecar. Biggest bucket first. Silent when pending/ is empty.
inbox_rows=""
for d in project/playtest-inbox/pending/*/; do
  [[ -d "$d" ]] || continue
  bucket="$(basename "$d")"
  [[ "$bucket" == ".claims" ]] && continue
  n=0
  for j in "$d"*.json; do
    [[ -e "$j" ]] || continue
    n=$((n + 1))
  done
  [[ "$n" -gt 0 ]] && inbox_rows+="${n} ${bucket}"$'\n'
done
if [[ -n "$inbox_rows" ]]; then
  # Biggest bucket first (numeric desc); render "<bucket> (<n> in progress)".
  inbox_line="$(printf '%s' "$inbox_rows" | sort -rn \
    | awk '{ printf "%s%s (%s in progress)", sep, $2, $1; sep=" " }')"
  add "Playtest inbox - ${inbox_line}"
  add ""
fi

add "## 🧑‍⚖️ Human-in-the-loop brief (auto-surfaced at session start)"
add ""
add "> ⏱️ **Opening turn ≤5s — relay this brief with ZERO tool calls.** Everything you need (queue, reviews, commits, the active-plan tag) is already inlined below. Do **not** run \`git\`/\`Read\`/\`verify\` or open any file just to brief — even one round-trip costs several seconds and blows the budget. Defer every verify-against-git check to when you actually pick the work up."
add ""
add "_Surface these to the human early. Full lists: \`$HUMAN_TODO\`, \`$DECISIONS\`, \`$REVIEWS\`._"
add ""

# --- hooksPath floor: the whole enforcement lattice is opt-in on this config ----
# Belt for clones that never ran `pnpm install` (the "prepare" script is the braces).
# Loud, first thing in the brief — an unwired clone commits without ANY gate.
hooks_path="$(git config core.hooksPath 2>/dev/null || true)"
if [[ "$hooks_path" != ".githooks" ]]; then
  add "### 🚨 UNGATED CLONE — \`core.hooksPath\` is ${hooks_path:-unset} (expected \`.githooks\`)"
  add "> Every commit/push gate (verify, journal, attribution, TODO guard) is OFF in this clone."
  add "> Fix NOW: \`git config core.hooksPath .githooks\` (or \`pnpm install\`, which wires it via \`prepare\`)."
  add ""
fi

# herdr: warn up front if other agents share this working tree (no-op without herdr).
herdr_shared_tree

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

# --- Open decisions (HD-items) and reviews (HR-items): heading lines with 🔲 ----
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

add_open_items "$DECISIONS" "🔀 Open decisions (HD-items)"
add_open_items "$REVIEWS" "👁️ Open reviews (HR-items)"

# --- What to DO next: an INVESTIGATION nudge, NOT a stored/parsed task list -----
# We deliberately keep no "next tasks" file and compute no answer here — both would
# rot and become one more thing to maintain. Instead the agent identifies the next
# autonomous work itself, from the live project state (git history + the docs that
# are already kept current), and VERIFIES rather than trusts: e.g. done plans are
# archived to project/archive/ (docs/plans/ holds only LIVE plans) — so a plan still
# in docs/plans/ marked done just hasn't been archived yet. This block orients that.
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
# Playtest capture inbox (F3) — an AGENT-facing async nudge (distinct from the human
# queue): captures dropped in-game via the ` overlay wait here to be metabolized.
# SILENT at zero (no busywork nudge); drain oldest-first with /drain-inbox.
inbox_n="$(find project/playtest-inbox/pending -maxdepth 1 -name '*.md' 2>/dev/null | wc -l | tr -d ' ' || true)"
if [[ "${inbox_n:-0}" -gt 0 ]]; then
  add "- 📥 **Playtest inbox:** ${inbox_n} capture(s) waiting in \`project/playtest-inbox/pending/\` — drain with \`/drain-inbox\`."
fi
# Live drain-lane claims (ADR-171) — parallel drains are sanctioned; surface who
# holds which lane so a fresh session claims before touching the inbox. SILENT at
# zero. Claims are git-ignored ephemera; liveness is checked at claim time, not here.
claims_n="$(find project/playtest-inbox/pending/.claims -name '*.json' 2>/dev/null | wc -l | tr -d ' ' || true)"
if [[ "${claims_n:-0}" -gt 0 ]]; then
  claim_lanes="$(find project/playtest-inbox/pending/.claims -name '*.json' -exec basename {} .json \; 2>/dev/null | sort | tr '\n' ' ' || true)"
  add "- 🔒 **Drain lanes claimed:** ${claim_lanes}— check \`tsx src/scripts/inbox-claim.ts list\` before draining (claim yours first; ADR-171)."
fi
# Real-play telemetry (F8) — the "morning shout": surface reports NEWER than the last
# balance(t0) commit so fresh human-pacing data is ambient in every agent's context
# (the delivery loop's card 3). SILENT at zero — a gate that cries wolf teaches deafness.
# Report files are git-ignored (local sensor data); README.md is the committed contract.
#
# The count is USABLE reports, not files: the drop middleware garbage-collects anything the
# balance flow must ignore anyway (time-tainted runs, runs shorter than one in-band rung —
# src/telemetry/retention.ts), so what survives on disk is exactly what's worth reading. This
# stays dumb on purpose: ONE home for the policy, in TS, not a second copy in bash. It once
# counted 24 files — 15 speed-run exhaust, 8 twenty-second pokes, 1 real session — and shouted
# every morning about play that never happened.
last_balance_epoch="$(git log -1 --format=%ct --grep='^balance(' 2>/dev/null || true)"
tele_n=0
for f in project/telemetry/*.md; do
  [[ -e "$f" && "$(basename "$f")" != "README.md" ]] || continue
  if [[ -z "${last_balance_epoch:-}" ]] || [[ "$(stat -f %m "$f" 2>/dev/null || stat -c %Y "$f" 2>/dev/null || echo 0)" -gt "$last_balance_epoch" ]]; then
    tele_n=$((tele_n + 1))
  fi
done
if [[ "$tele_n" -gt 0 ]]; then
  add "- 📊 **Real-play telemetry:** ${tele_n} usable report(s) in \`project/telemetry/\` (untainted, ≥1 in-band rung of attended time) newer than the last balance commit — read them before touching balance (qa-playtesting.md §2 step 0; distill conclusions per the folder README)."
fi
# Main's latest CI conclusion — time-boxed (2s) so a slow/absent gh never hangs or
# aborts the brief (set -e safe via 2>/dev/null + trailing || true → empty string).
# NB: macOS has no `timeout` binary (GNU coreutils), which silently killed this
# probe for weeks — perl's alarm+exec is the portable time-box (alarm survives exec).
ci_state="$(perl -e 'alarm shift @ARGV; exec @ARGV' 2 gh run list -L 1 -b main -w verify.yml --json conclusion,status --jq '.[0] | (.status + "/" + (.conclusion // "—"))' 2>/dev/null || true)"
if [[ -n "$ci_state" ]]; then
  add "- 🔦 **CI (main, verify.yml):** \`$ci_state\`"
else
  add "- 🔦 **CI (main):** _(status unavailable)_"
fi
# Plans in docs/plans/ — normally all ACTIVE (done plans get archived to
# project/archive/); tag each from its OWN status line so a not-yet-archived done
# plan is flagged (and nudged to archive) rather than mistaken for active.
# Classify by the LEADING status token — the word right after "Status:" (the
# glyph is decoration, skipped) — NOT a substring anywhere in the line. The token
# comes from the CLOSED six-word vocabulary (§2.2): PROPOSED · LOCKED · IN-PROGRESS
# · DONE · PARKED · SUPERSEDED. Only a leading DONE or SUPERSEDED means "archivable"
# — this MUST agree with src/scripts/checkpoint.ts (the co-parser + the verify gate).
# A ✅ glyph or a mid-line "done" is NOT the signal, so a plan whose Status leads
# with LOCKED / IN-PROGRESS / PROPOSED / PARKED stays tagged active. See the
# Status-line vocabulary in docs/plans/README.md.
if [[ -d "$PLANS_DIR" ]]; then
  plans="$(ls -1 "$PLANS_DIR"/*.md 2>/dev/null | sort -r)"
  if [[ -n "$plans" ]]; then
    add "- 📐 **Plans in \`$PLANS_DIR\`** — the *active* plans (done ones are archived to \`project/archive/\`); open one for its sequenced steps:"
    while IFS= read -r p; do
      sl="$(head -8 "$p" | grep -m1 -iE 'status' || true)"
      # Strip the bold markers + the "Status:" label + the leading glyph, then
      # take the first alphabetic word — that's the canonical status token.
      tok="$(printf '%s' "$sl" | sed -E 's/\*\*//g; s/^[[:space:]]*[Ss]tatus[[:space:]]*:?[[:space:]]*//' | grep -oiE '[A-Za-z]+' | head -1 || true)"
      if printf '%s' "$tok" | grep -qiE '^(done|superseded)$'; then
        add "  - ✅ \`$p\` — DONE (archive it to \`project/archive/\`)"
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
