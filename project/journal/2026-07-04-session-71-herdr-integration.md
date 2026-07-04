# Session 71 — 2026-07-04 — herdr repo integration (guarded-hybrid)

**Summary:** Onboarded to the herdr terminal-workspace manager (we're running
multiple Claude agents in it, sharing this one working tree) and wired it into
how-we-work behind clean `HERDR_ENV` guards — so the shared-tree/multi-agent risk
is surfaced where it matters and the dev server lives in a fixed shared workspace.
Installed the herdr Claude integration + a self-updating global skill; decisions
locked with the human via AskUserQuestion. Plan:
`docs/plans/opus-2026-07-04-herdr-repo-integration.md`.

## What changed
- `src/scripts/herdr-peers.sh` — NEW. Shared helper: emits TSV `<pane>\t<status>\t
  <goal>` for other agents on THIS tree (goal = each agent's status-line label via
  `herdr agent explain --json`). Clean no-op without herdr.
- `src/scripts/session-brief.sh` — B1: a `HERDR_ENV`-guarded "⚠️ Shared tree" callout
  at session start listing peer agents + their goals (delegates to the helper).
- `.githooks/pre-commit` — B5 (human ask): commit-time peer FYI via the helper, so a
  long-running agent re-learns who's on the tree at its natural cadence. Advisory
  only; `SKIP_HERDR_PEERS=1` mutes.
- `.githooks/pre-push` — B2: pre-verify advisory naming other agents, so a RED you
  didn't cause is legible. Advisory only; never changes the push outcome.
- `src/scripts/herdr-dev-space.sh` — NEW (B3). Find-or-create a persistent
  `dev-server` workspace (human refinement: a fixed SPACE, not an ephemeral pane),
  start `npm run dev`, wait for the Vite URL. Idempotent: re-run attaches.
- `src/scripts/herdr-notify.sh` — NEW (B4). Guarded wrapper for `herdr notification
  show --sound request` to ping the human on a filed H/R-item or a blocking fork
  (D-083). Without herdr, the message still goes to stderr.
- `docs/plans/opus-2026-07-04-herdr-repo-integration.md` — NEW. The plan + locked
  decisions + build status.
- (global, NOT in repo) `~/.claude/skills/herdr/` — installed the herdr agent skill
  verbatim from upstream + `update.sh` to refresh it; ran `herdr integration install
  claude` (SessionStart hook links each pane to its Claude session/transcript).

## Verified live
- Brief renders the callout with 2 peers + their goals.
- `herdr-dev-space.sh`: run 1 created+started (server on :5174), run 2 attached.
- `herdr-notify.sh`: fired a real desktop notification.
- `herdr-peers.sh`: emits correct peer TSV.

## Next intended steps
1. Optional B-follow-ups (deferred): a `UserPromptSubmit` peer injection for
   hour-long no-commit stretches; document the helpers in AGENTS.md / repo-map if
   the team adopts them widely.
2. Optionally add the read-only `herdr` subcommands to the settings allowlist.

## Landmines
- **Shared tree, multiple live agents.** At session time `todo-human.md`,
  `package.json`, `src/scripts/playtest-inbox.ts`, `src/ui/capture-format.ts` and the
  F2 archival were other agents' WIP — staged ONLY my own paths, never `git add -A`.
- herdr is OPTIONAL everywhere: every addition no-ops without `HERDR_ENV=1`. No gate,
  hook, or script gains a hard dependency on it (D-124; advisory rung only).
- The integration does session LINKAGE, not per-turn state — live state is still
  inferred from the terminal title (`herdr agent explain`). It fires on `SessionStart`,
  so it takes effect on a session's NEXT start, not an already-running pane.
