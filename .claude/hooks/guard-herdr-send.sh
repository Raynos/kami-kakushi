#!/usr/bin/env bash
# PreToolUse(Bash) guard — never type prose into a pane that has no live agent.
#
# Why: `herdr agent send <target> "msg"` accepts ANY pane id (herdr's targets
# include "legacy pane ids") and types the text BLINDLY — it does not check that
# an agent is listening. When the target's agent has exited, the pane is a bare
# SHELL, so the prose lands at the `$` prompt and the mandated follow-up
# `herdr pane send-keys <pane> Enter` EXECUTES IT AS A SHELL COMMAND.
# Seen 2026-07-10: a lane-coordination message hit a pane whose claude had quit;
# bash answered `syntax error near unexpected token '('` and the message was lost.
# Verified: `herdr agent send <dead-pane> …` returns {"type":"ok"} and types anyway.
#
# The repo norm verified AFTER the Enter (`herdr agent read`) — one step too late.
# `herdr agent get <target>` already answers this definitively BEFORE the send:
# it returns `.result.agent` for a live agent and `{"error":{"code":
# "agent_not_found"}}` otherwise (note: exit status is 0 either way — parse JSON,
# never `$?`).
#
# Contract: reads the PreToolUse JSON on stdin, inspects .tool_input.command, exits 2
# (blocking) with a stderr explanation, else 0 (allow).
#   BLOCKS: `herdr agent send` at a target with no live agent (a shell, or a stale
#           pane id whose agent exited/restarted);
#           `herdr agent send` at THIS session's own pane (self-send);
#           `herdr pane run` at a LIVE agent pane (run = text+Enter, a shell verb —
#           it submits mid-typing; agent panes use send → send-keys → read).
#   PASSES:  sends to live agents, `pane run`/`pane send-text` at shell panes,
#            every non-herdr command, and anything when herdr can't be reached
#            (fail-open: a guard that blocks on its own outage cries wolf).
# Escape: SKIP_HERDRGUARD=1.

set -euo pipefail

cmd="$(jq -r '.tool_input.command // empty' 2>/dev/null || true)"
[ -z "$cmd" ] && exit 0

# Only ever look at herdr sends. Cheap bail-out keeps this off the hot path.
printf '%s' "$cmd" | grep -qE 'herdr[[:space:]]+(agent[[:space:]]+send|pane[[:space:]]+run)([[:space:]]|$)' || exit 0
printf '%s' "$cmd" | grep -q 'SKIP_HERDRGUARD=1' && exit 0
command -v herdr >/dev/null 2>&1 || exit 0   # not inside herdr → nothing to guard

# Newlines flattened first: a multi-line message must not truncate the segment we
# scan (the same bug that once false-BLOCKED guard-git-add-all.sh 3x in a session).
cmd_flat="$(printf '%s' "$cmd" | tr '\n' ' ')"

# First non-flag token after the verb — herdr puts <target> immediately after it,
# ahead of any message text, so a ';' or quote inside the message can't reach us.
target_after() {
  local seg rest tok
  seg="$(printf '%s' "$cmd_flat" | grep -oE "$1[^;&|]*" | head -1 || true)"
  [ -z "$seg" ] && return 1
  rest="${seg#*"$2"}"
  rest="${rest//\"/}"; rest="${rest//\'/}"
  read -ra _toks <<< "$rest" || true
  for tok in "${_toks[@]:-}"; do
    case "$tok" in -*) continue ;; esac   # a flag, not the target
    printf '%s' "$tok"; return 0
  done
  return 1
}

# Resolve a target through herdr's own registry. Echoes the live agent's pane_id,
# or nothing when no agent is registered there. Distinguishes "no agent" from
# "herdr unreachable" via the exit code so the caller can fail open.
#   0 = live agent (pane_id on stdout) | 1 = definitively no agent | 2 = unknown
resolve_agent() {
  local json code pane
  # 2>&1 is load-bearing: herdr prints the success payload to stdout but the
  # {"error":{"code":"agent_not_found"}} payload to STDERR. Discarding stderr made
  # a dead pane look like "herdr unreachable", and the fail-open path waved the
  # send straight through — i.e. the guard silently missed the exact bug it exists
  # to catch. Merge the streams, then classify on the JSON.
  json="$(herdr agent get "$1" 2>&1 || true)"
  [ -z "$json" ] && return 2
  pane="$(printf '%s' "$json" | jq -r '.result.agent.pane_id // empty' 2>/dev/null || true)"
  [ -n "$pane" ] && { printf '%s' "$pane"; return 0; }
  code="$(printf '%s' "$json" | jq -r '.error.code // empty' 2>/dev/null || true)"
  [ "$code" = "agent_not_found" ] && return 1
  return 2   # socket down / unexpected shape → don't block real work
}

live_roster() {
  herdr agent list 2>/dev/null \
    | jq -r '.result.agents[]? | "    \(.pane_id)  \(.agent)  [\(.agent_status)]  \(.custom_status // "-")"' \
    2>/dev/null || printf '    (herdr agent list unavailable)\n'
}

# ---------------------------------------------------------------- agent send
if printf '%s' "$cmd_flat" | grep -qE 'herdr[[:space:]]+agent[[:space:]]+send([[:space:]]|$)'; then
  t="$(target_after 'herdr[[:space:]]+agent[[:space:]]+send' 'send' || true)"
  if [ -n "$t" ]; then
    pane="$(resolve_agent "$t")" && rc=0 || rc=$?

    if [ "$rc" = 1 ]; then
      cat >&2 <<EOF
BLOCKED by .claude/hooks/guard-herdr-send.sh: '$t' has NO live agent.

'herdr agent send' types text BLINDLY into whatever occupies that pane. There is
no agent listening at '$t' (herdr: agent_not_found) — it is a SHELL. Your message
would land at a bash prompt, and the 'pane send-keys $t Enter' you send next would
EXECUTE IT AS A SHELL COMMAND (2026-07-10: a coordination message did exactly this
and died on 'syntax error near unexpected token').

A pane id goes stale the moment that agent exits or is restarted. Re-read the
roster and send to a pane that is actually live right now:

$(live_roster)

Then: herdr agent get <pane>   # must return an agent, NOT agent_not_found
      herdr agent send <pane> "msg"
      herdr pane send-keys <pane> Enter
      herdr agent read <pane>   # confirm: the message shows, the input line is empty

If you really mean to type into a shell pane, say so explicitly:
    herdr pane send-text $t "..."      (or: SKIP_HERDRGUARD=1)
EOF
      exit 2
    fi

    if [ "$rc" = 0 ] && [ -n "${HERDR_PANE_ID:-}" ] && [ "$pane" = "$HERDR_PANE_ID" ]; then
      cat >&2 <<EOF
BLOCKED by .claude/hooks/guard-herdr-send.sh: '$t' is THIS session's own pane ($HERDR_PANE_ID).

You are about to type a message into your own input box. That is never what a
cross-agent message means — it will sit in your prompt and be read back as if the
human had typed it. Pick a co-agent's pane:

$(live_roster)
EOF
      exit 2
    fi
  fi
fi

# ------------------------------------------------------------------ pane run
# 'pane run' = text + a real Enter in one request. At an AGENT pane that submits
# whatever is in the input box the instant it lands — including a half-typed line
# the agent is composing. It is a SHELL verb; agent panes go send → send-keys.
if printf '%s' "$cmd_flat" | grep -qE 'herdr[[:space:]]+pane[[:space:]]+run([[:space:]]|$)'; then
  t="$(target_after 'herdr[[:space:]]+pane[[:space:]]+run' 'run' || true)"
  if [ -n "$t" ] && pane="$(resolve_agent "$t")"; then
    cat >&2 <<EOF
BLOCKED by .claude/hooks/guard-herdr-send.sh: 'herdr pane run' at agent pane '$pane'.

'pane run' sends text AND a real Enter in one request — it is meant for SHELL
panes. Fired at an agent it submits immediately, with no chance to notice a
mid-typing collision with the agent's own input before it goes.

Use the three-step form so the collision is visible before you submit:
    herdr agent send $pane "msg"
    herdr pane send-keys $pane Enter
    herdr agent read $pane

Escape (you really do want text+Enter at this pane): SKIP_HERDRGUARD=1.
EOF
    exit 2
  fi
fi

exit 0
