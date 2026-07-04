# Plan — herdr repo integration (guarded-hybrid)

**Status:** ✅ DONE — all five builds (helper + B1–B5) shipped & tested live
2026-07-04; verified on disk + observed live (session brief callout + commit-time
peer FYI) and confirmed complete by the human 2026-07-05. Authored 2026-07-04;
decisions locked with the human via AskUserQuestion the same day (see below).

Wire the [herdr](https://herdr.dev) terminal-workspace manager into how we work in
this repo, so the fact that **multiple Claude agents share one working tree** (the
repo's #1 live risk) is surfaced at the moments it matters, and the dev/playtest
server is a stable shared resource rather than a per-task job. herdr is **optional
local tooling**, never a hard dependency.

## Who builds this — Fable or Opus?

**Verdict: Fable-buildable, Opus-authored/owned here.** These are small, guarded
shell/hook edits with a clear spec and no game-design judgment — squarely in
Fable's lane (mechanical, well-scoped). It is being built by the current **Opus**
session because the human is actively steering herdr setup in-session; per D-124 an
Opus session doesn't route to Fable without an explicit steer, and none was given.
If this is picked up later as batch work, it can be Fable-routed. **Confidence:
( 60% Opus, 40% Fable )** — leans Fable on mechanics; stays Opus because it's
live, interactive, and touches the always-loaded session-brief/hook surface where a
subtle guard mistake is costly.

## Locked decisions (human, 2026-07-04)

1. **Coupling → guarded hybrid.** Every repo addition is wrapped so it **no-ops
   without herdr** (`[ "${HERDR_ENV:-}" = "1" ]` and `command -v herdr`). The repo
   still clones and runs clean for anyone not using herdr.
2. **Build all four**, plus a refinement on the dev server (below).
3. **Enforcement → advisory only.** Concurrent-agent safety surfaces in the brief
   and as a warning; it **never blocks** a commit or push. herdr is optional, so a
   hard gate would cry wolf whenever it's absent — this matches the repo rule
   "push each rule to the highest rung that can *soundly* hold it."
4. **Skill → self-updating from upstream.** Done, global (`~/.claude/skills/herdr/`),
   not in this repo. `update.sh` refreshes `SKILL.md` verbatim from
   `raw.githubusercontent.com/ogulcancelik/herdr/master/SKILL.md`.

## Shared helper (extracted so the logic isn't copied three ways)

`src/scripts/herdr-peers.sh` — the single source of shared-tree awareness, reused by
the brief, pre-commit, and pre-push. Emits TSV `<pane>\t<status>\t<goal>` for every
**other** agent whose cwd is inside this repo root, excluding my own pane. The goal
column is each agent's **status-line label**, pulled from `herdr agent explain
<pane> --json` (the matched `osc_title` rule's `region_preview`) — so the surfaces
can show *"w1:p1 working — 'Build F4 balance-sim gates'"*, not a bare count. Prints
nothing (exit 0) when herdr is absent / solo — callers treat any output as "peers
exist".

## The five builds

### B1 · Concurrent-agent awareness in `session-brief.sh` (highest value)
`src/scripts/session-brief.sh` already runs at `SessionStart`. Add a guarded block
that lists **other** agents whose `cwd` is inside **this repo root**, excluding my
own pane (`$HERDR_PANE_ID`). Output e.g.:

> ⚠️ **2 other agents live in this tree** — respect shared-tree safety (stage only
> your own paths, never `git add -A`): `w1:p1` working · `w1:p2` working

- Uses `herdr agent list` (a <100ms local socket call **by the script**, not an
  agent round-trip) → keeps the brief ≤5s.
- Filters by `cwd` prefix = repo root so it's "who else is on THIS tree", not the
  whole machine. Excludes self. If none, prints nothing (no noise for the common
  solo case).

### B2 · Pre-push shared-tree advisory
`.githooks/pre-push` runs the full verify and can be blocked by **another agent's
red WIP** (a documented pain). Before verify runs, a guarded advisory echoes any
**other working agents** on this tree to stderr, so "someone else's red" is legible
rather than mysterious. **Advisory only** — never changes the block/no-block
outcome.

### B3 · Dev/playtest server in a fixed shared workspace (not an ephemeral pane)
**Human refinement:** the dev server should live in a dedicated, persistent
**workspace** ("dev-server" / "shared tools"), not a split pane in whoever's
current pane — so it survives across tasks and agents.

`src/scripts/herdr-dev-space.sh`:
- Find-or-create a workspace labelled `dev-server` (reuse if present — never spawn
  a second), `--no-focus`, cwd = repo root.
- In it, run `npm run dev` (find-or-reuse the pane; don't stack duplicate servers).
- `herdr wait output … --match` the Vite ready line, then print the URL + pane id.
- Idempotent: re-running attaches to the existing server instead of starting a new
  one. Guarded: prints a plain instruction and exits 0 if `HERDR_ENV` is unset.

### B4 · Human-in-the-loop notifications
When an agent files an H/R-item or hits a blocking fork, `herdr notification show
--sound request` pings the human (serves D-083 "surface, don't block"). Delivered
as a documented convention + a tiny guarded wrapper `src/scripts/herdr-notify.sh`
so callers don't repeat the guard. Opt-in; agents call it when they'd otherwise
leave a fork sitting unseen. Without herdr, the message still goes to stderr (not
lost).

### B5 · Commit-time peer FYI (human ask, 2026-07-04)
`SessionStart` (B1) fires once, so a long-running agent never re-learns who joined
the tree. `.githooks/pre-commit` echoes the peer roster (via the shared helper) at
every commit — the natural cadence for a working agent, and the exact moment
shared-tree awareness matters. Advisory only; `SKIP_HERDR_PEERS=1` mutes it. (A
`UserPromptSubmit` injection could also cover human-interactive turns — deferred;
pre-commit covers the common case.)

## Guard helper

All repo scripts share one guard idiom (inlined, not a new dependency):
`[ "${HERDR_ENV:-}" = "1" ] && command -v herdr >/dev/null 2>&1` — if false, the
feature is a clean no-op (or prints the manual fallback and exits 0).

## Sequencing / build status

**All five built + tested live 2026-07-04** (helper → B1 → B2 → B5 → B3 → B4):
- ✅ `herdr-peers.sh` — emits peer TSV with goal text.
- ✅ B1 — brief renders the shared-tree callout (verified: 2 peers + goals).
- ✅ B2 — pre-push advisory wired.
- ✅ B5 — pre-commit FYI wired (`SKIP_HERDR_PEERS=1` mutes).
- ✅ B3 — dev-space create+attach idempotency verified (server on :5174).
- ✅ B4 — notify wrapper fired a real desktop notification.

Deferred / optional follow-ups: `UserPromptSubmit` peer injection (belt-and-braces
for hour-long no-commit stretches); documenting the helpers in AGENTS.md / repo-map
if the team adopts them widely.

## Non-goals / guardrails

- **No hard dependency on herdr** anywhere — verify, hooks, and scripts all pass
  identically with herdr absent.
- **No new maintained tracker files** — extend existing files (session-brief,
  pre-push); new files are executable scripts, not hand-updated state.
- **Advisory, not enforcement** — B1/B2 never block; they inform.
