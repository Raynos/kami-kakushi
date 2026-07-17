#!/usr/bin/env bash
# PreToolUse(Bash) guard — ONE dev server, in the shared herdr playtest pane.
#
# The recurring footgun (human, 2026-07-10): a concurrent agent wants to observe
# the game, runs `pnpm run dev`, hits the vite singleServerGuard — whose message
# used to literally say `kill <pid>` — dutifully kills the herdr pane's server,
# spawns its OWN, and the shared dev server dies out from under everyone else.
#
# Contract: reads the PreToolUse JSON on stdin, inspects .tool_input.command.
#   • start-a-dev-server cmd (pnpm/npm/yarn/bun dev, bare `vite`/`vite serve`)
#       AND :5264 already held  → exit 2 (block): reuse the running one.
#       AND :5264 free          → exit 0 + warn (nudge toward the herdr pane).
#   • kill-the-dev-server cmd (pkill vite, kill of the :5264 holder, xargs kill)
#       AND :5264 held          → exit 2 (block): never kill+respawn the shared one.
# Exits 0 silently otherwise.
#
# False-positive discipline: trigger tokens quoted as DATA (a git commit message,
# an echo, a grep) must NOT fire. Two defenses — (1) a first-word allowlist of
# text-carrying commands is skipped wholesale; (2) start/kill verbs are matched
# only at a command position (line start or after a ; & | ( operator), never
# after a bare space inside a quoted argument.
#
# Escapes: SKIP_DEVGUARD=1 (env or inline) bypasses; KAMI_ALLOW_MULTI_DEV=1 too
# (it's vite's own bypass for a deliberate throwaway server on another port).

set -euo pipefail

[ "${SKIP_DEVGUARD:-}" = 1 ] && exit 0

cmd="$(jq -r '.tool_input.command // empty' 2>/dev/null || true)"
[ -z "$cmd" ] && exit 0

has() { printf '%s' "$cmd" | grep -qE "$1"; }

# Inline escape tokens (matched as text, like guard-bash-safety.sh does for
# SKIP_VERIFY) — an agent that types either prefix means it on purpose.
has '(SKIP_DEVGUARD|KAMI_ALLOW_MULTI_DEV)=1' && exit 0

# ── First-word allowlist — text-carrying commands quote triggers as DATA ─────
# Strip leading env-assignments / nohup / env / timeout wrappers, take word 1.
first="$(printf '%s' "$cmd" \
  | sed -E 's/^[[:space:]]*(([A-Za-z_][A-Za-z0-9_]*=[^[:space:]]+|nohup|env|timeout[[:space:]]+[0-9smh.]+)[[:space:]]+)*//' \
  | awk 'NR==1{print $1}')"
# NR==1 — on a MULTILINE command (a git commit -m with a body), plain
# '{print $1}' prints word 1 of EVERY line, the case-match fails, and
# trigger tokens inside the quoted message fire the guard (2026-07-18:
# a commit message about the dev-server LAW was blocked as a kill).
first="${first##*/}" # basename, so /usr/bin/git → git
case "$first" in
git | echo | printf | cat | jq | tee | grep | rg | egrep | sed | awk | head | tail | less | bat | node | tsx)
  exit 0
  ;;
esac

DEV_PORT=5264

# Command position: line start or right after a ; & | ( operator (+ optional
# env-assignment / nohup / env / timeout wrappers). NOT a bare space, so a
# trigger inside a quoted argument that survived the allowlist still won't fire.
B='(^|[;&|(])[[:space:]]*([A-Za-z_][A-Za-z0-9_]*=[^[:space:]]+[[:space:]]+|nohup[[:space:]]+|env[[:space:]]+|timeout[[:space:]]+[0-9smh.]+[[:space:]]+)*'

# ── Detect a "start a dev server" command ───────────────────────────────────
# pnpm/npm/yarn/bun (run) dev, or bare/npx `vite` / `vite serve` — but NEVER
# `vite build`, `vite preview`, or `vitest` (all legitimately load this config).
starts_dev=0
has "${B}(pnpm|npm|yarn|bun)([[:space:]]+run)?[[:space:]]+dev([[:space:]]|$)" && starts_dev=1
if has "${B}(npx[[:space:]]+)?(\./node_modules/\.bin/)?vite([[:space:]]+(serve|--?[a-zA-Z])|[[:space:]]*($|[;&|]))" \
  && ! has "${B}(npx[[:space:]]+)?(\./node_modules/\.bin/)?vite[[:space:]]+(build|preview)([[:space:]]|$)"; then
  starts_dev=1
fi

# ── Detect a "kill the dev server" command ──────────────────────────────────
kills_maybe=0
has "${B}(pkill|killall)([[:space:]]|$)" && has '[Vv]ite' && kills_maybe=1
has "${B}kill([[:space:]]|$)" && kills_maybe=1
has 'xargs([[:space:]]+-[^;&|]*)*[[:space:]]+kill([[:space:]]|$)' && kills_maybe=1
has ":${DEV_PORT}([^0-9]|$)" && has '[Kk]ill' && kills_maybe=1

# Only pay the lsof cost when the command is actually dev-server-shaped.
holder=""
if [ "$starts_dev" = 1 ] || [ "$kills_maybe" = 1 ]; then
  holder="$(lsof -ti "tcp:${DEV_PORT}" -sTCP:LISTEN 2>/dev/null | head -1 || true)"
fi

# ── BLOCK: starting a second dev server while one is already running ─────────
if [ "$starts_dev" = 1 ] && [ -n "$holder" ]; then
  cat >&2 <<EOF
BLOCKED by .claude/hooks/guard-dev-server.sh: a dev server is ALREADY running
on :${DEV_PORT} (pid ${holder}) — the shared herdr playtest pane.

Do NOT start a second one and do NOT kill this one. Reuse it:
  • the headless drivers (qa-shots.mjs / playtest.mjs) already point at
    http://localhost:${DEV_PORT} — as does any ad-hoc headless-chromium script.
  • a running server survives across YOUR session; spawning + killing is the
    exact churn that keeps taking it down for the human and other agents.

If it seems wedged (listening but not serving), restart it IN the shared
herdr dev-server pane (Ctrl-C there, then pnpm run dev — human-ruled
2026-07-18); a coordinated restart is SKIP_DEVGUARD=1, never a private
respawn. (Deliberate throwaway on another port? KAMI_ALLOW_MULTI_DEV=1.)
EOF
  exit 2
fi

# ── BLOCK: killing the running shared dev server ────────────────────────────
if [ "$kills_maybe" = 1 ] && [ -n "$holder" ]; then
  # Confirm the kill actually targets our holder: pkill/killall vite, kill of
  # the exact holder pid, an xargs-kill, or any kill that names the dev port.
  targets=0
  has "${B}(pkill|killall)([[:space:]]+-[^;&|]*)*[[:space:]]+[^;&|]*[Vv]ite" && targets=1
  has 'xargs([[:space:]]+-[^;&|]*)*[[:space:]]+kill([[:space:]]|$)' && targets=1
  has ":${DEV_PORT}([^0-9]|$)" && targets=1
  has "${B}kill([[:space:]]+-[0-9A-Za-z]+)*([[:space:]]+[^;&|]*)*[[:space:]]${holder}([[:space:]]|$)" && targets=1
  if [ "$targets" = 1 ]; then
    cat >&2 <<EOF
BLOCKED by .claude/hooks/guard-dev-server.sh: this would kill the dev server
on :${DEV_PORT} (pid ${holder}) — the shared herdr playtest pane.

Kill+respawn is exactly the churn that keeps taking the server down for the
human and the other agents in this shared tree. Leave it running and reuse
:${DEV_PORT}. If it genuinely must be restarted, do it IN the shared herdr
dev-server pane (human-ruled 2026-07-18), with SKIP_DEVGUARD=1 for the
coordinated restart — never a private respawn.
EOF
    exit 2
  fi
fi

# ── WARN: no server yet — prefer the herdr pane over a session-owned one ─────
if [ "$starts_dev" = 1 ] && [ -z "$holder" ]; then
  jq -n --arg p "$DEV_PORT" '{systemMessage: ("🖥️ No dev server on :" + $p + ". Start it in the SHARED herdr dev-server pane (human-ruled 2026-07-18), not as a background server owned by THIS session — a session-owned server dies on your restart and gets re-spawned, which is the churn we are trying to kill. Proceeding.")}'
fi

exit 0
