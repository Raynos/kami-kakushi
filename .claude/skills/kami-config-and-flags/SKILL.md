---
name: kami-config-and-flags
description: >-
  The catalog of every configuration flag, escape hatch, and lever in
  kami-kakushi (re-derive greps included): SKIP_* commit/push escapes (SKIP_VERIFY,
  SKIP_JOURNAL, SKIP_QUEUE, SKIP_ATTRIB, …), Claude-hook escapes
  (SKIP_SWEEPGUARD, SKIP_DEVGUARD, KAMI_ALLOW_MULTI_DEV, …), script env
  vars (VERIFY_FULL, UPDATE_MAP_GOLDEN, SHIP_DEV_TOOLS, QA_URL),
  vite build-time defines (__DEV_TOOLS__, __VERSION__), URL boot params
  (?dev, ?fixture, ?bal.<path>, ?story-<bundle>), and the balance
  cockpit lever pattern (ADR-134). Load when: a commit or push is
  BLOCKED by a hook and you need the right (or no) escape; you're about
  to type any SKIP_*/KAMI_* var; you need a DEV/QA boot param; you're
  adding a new flag, env var, define, URL param, or cockpit lever; or
  you're asking "how do I bypass X", "what does SKIP_X do", "how do I
  turn on the DEV panel", "how do I override a balance number".
---

# kami-config-and-flags

Every flag in this repo is an escape from a quality gate or a lever
into DEV behavior. This skill is the reference catalog — one table per
axis, each row anchored to the enforcing file:line — plus the
add-a-flag checklist and the greps to re-derive every table (flags are
the fastest-drifting fact class here).

Jargon: a **gate** is one entry in the verify roster
(`src/scripts/gates.ts` — count them with
`grep -c "name: '" src/scripts/gates.ts`, 21 as of 2026-07-18; never
hand-type the count). A **hook** is either a git
hook (`.githooks/`) or a Claude Code PreToolUse/PostToolUse hook
(`.claude/hooks/`, wired in `.claude/settings.json:12-75`). Glossary
for ADR/FB/PH/TST tags: see `kami-domain-reference`.

## §0 · Ground rules before reaching for ANY flag

- **An escape is for the stated legitimate case only, never to make a
  red gate green** (PH3 — done is earned). If verify is RED, fix it or
  leave the commit unmade; never `SKIP_VERIFY=1` a red tree toward
  `main` (AGENTS.md checkpoint rule).
- **`SKIP_VERIFY=1` combined with `git push` is hard-BLOCKED** (exit 2)
  by `.claude/hooks/guard-bash-safety.sh:40-49`. There is no sanctioned
  way for an agent to push red.
- **Tree-wide destructive git ops have NO escape var at all**
  (`git restore/checkout .`, bare `git stash`, `git reset --hard`,
  `git clean -f` without paths — guard-bash-safety.sh:72-113,
  ADR-196).
  Naming explicit paths you authored IS the escape.
- **Prefer the narrow flag over the broad one**: lane flags
  (`SKIP_CODE_VERIFY`/`SKIP_DOCS_VERIFY`) over `SKIP_VERIFY`
  (pre-commit:22-25). Both lane flags at once = a full skip; the runner
  tells you to say `SKIP_VERIFY=1` instead (verify-run.ts:248).
- **Read current values from the file, don't trust this doc or your
  memory** — a co-agent's uncommitted WIP may sit in the working tree;
  committed canon is `git show HEAD:<path>`. (E.g. never hardcode
  `SCHEMA_VERSION`; read it in `src/core/constants.ts` — see
  `kami-save-and-schema`.)

## §1 · Commit/push escape flags (git hooks, `.githooks/`)

Usage shape: `FLAG=1 git commit -m … -- <paths>` (env prefix on the
git command).

| Flag | What it skips | When legitimate | Enforced at |
|---|---|---|---|
| `SKIP_VERIFY=1` | The WHOLE verify at commit and at push | Last resort only; prefer the lane flags. Blocked outright when combined with `git push` (guard-bash-safety.sh:40-49) | pre-commit:37, pre-push:16 |
| `SKIP_CODE_VERIFY=1` | The `code`-scoped gates; docs gates still run (~1s) | Docs-only commit | verify-scope.ts:25; forcibly unset at push via `env -u` (pre-push:36) |
| `SKIP_DOCS_VERIFY=1` | The `docs`-scoped gates | Pure-code commit | verify-scope.ts:26; same push unset (pre-push:36) |
| `SKIP_BUDGET=1` | The 8s HARD verify-time cap (ADR-176) | A genuinely loaded machine — never a slow test (tag that `// @slow` instead) | pre-commit:65 |
| `SKIP_JOURNAL=1` | The journal-entry-staged gate | Trivial commit | pre-commit:284 |
| `SKIP_QUEUE=1` | Reading-queue gate: new `docs/plans/*.md` must be listed in `project/todo-human.md` same-commit | A plan genuinely not for the human (rare) | pre-commit:165 |
| `SKIP_PLAN_TEMPLATE=1` | Plan-template gate on brand-NEW plans (`verify-plan-template.ts --staged`) | A genuinely exempt doc | pre-commit:224 |
| `SKIP_HUMAN_TODO=1` | Block on agent-added lines under `## TODO` in todo-human.md | The human dictated that TODO verbatim (human ruling, 2026-07-06) | pre-commit:241 |
| `SKIP_DOCBUDGET=1` | The STANDALONE doc-budget re-check pre-commit runs when `SKIP_VERIFY=1` is set | A human-blessed cap raise, same-day, while the cap edit is discussed | pre-commit:273; caps live only in src/scripts/verify-doc-budgets.ts:32-49 |
| `SKIP_BALANCE_FRESH=1` | Balance-report freshness WARN (warn-only anyway) | Silencing a known-stale report mid-series | pre-commit:129 |
| `SKIP_MAP_SIGNPOST=1` | Map-sheets golden-pin signpost WARN (warn-only) | Silencing during a look-neutral refactor | pre-commit:144 |
| `SKIP_HERDR_PEERS=1` | The live-co-agent FYI listing (advisory) | Almost never needed | pre-commit:92, pre-push:24 |
| `SKIP_E2E_WARN=1` | Pre-push e2e blast-radius advisory | Silencing when you just ran `pnpm run test:e2e` locally (the lane runs ~50s locally across 3 Playwright projects — qa-playtesting.md) | pre-push:48 |
| `SKIP_ATTRIB=1` | commit-msg `Assisted-by:` trailer check | A genuinely human-authored commit ONLY | commit-msg:21 |
| `VERIFY_FULL=1` | (Adds, not skips) runs the `@slow` vitest tests too | Set automatically by pre-push (pre-push:36) and CI (verify.yml); set it yourself to pre-flight a push | vitest-verify.ts:32 |

Budget knob overrides (rare, tuning only): `PRECOMMIT_SOFT_S` /
`PRECOMMIT_HARD_S` (default 5/8, pre-commit:33-34).

**Retired — do not propagate:** the old standalone snapshot line-cap
gate and its `SKIP_SNAPSHOT`/`SNAPSHOT_MAX_LINES` vars are gone
(zero grep hits in `.githooks/` + `src/scripts/`, 2026-07-18). The
live mechanism is the `doc-budgets` verify gate; the escape is
`SKIP_DOCBUDGET=1` above.

## §2 · Claude-hook escapes (`.claude/hooks/`)

Wired in `.claude/settings.json:12-75`; these fire on YOUR tool calls
(PreToolUse Bash / Edit / Write), before git ever runs.

| Flag | What it escapes | When legitimate | Enforced at |
|---|---|---|---|
| `SKIP_SWEEPGUARD=1` | guard-git-add-all.sh — the shared-index sweep guard (`git add -A/./-u`, `git add <tracked>`, `commit -a`, bare `git commit` without ` -- <pathspec>`) | Deliberate whole-index commit, rare. **Every use is auto-logged** to `project/status/sweepguard-ledger.md` (guard-git-add-all.sh:27-33) and auto-committed by `.githooks/post-commit` | guard-git-add-all.sh:27,135 |
| `SKIP_PUSHCLAIM=1` | guard-bash-safety.sh's bare-`git push` block (ADR-196 push mutex — normal path is `pnpm run push`) | ONLY when the push-mutex machinery itself is broken AND the human has said to push around it; the normal answer is always `pnpm run push` (the mutex exists because of a push→reject→rebase loop — 218 rejects/548 sessions, per the hook's own comment) | guard-bash-safety.sh:54-56 |
| `SKIP_HERDRGUARD=1` | guard-herdr-send.sh — blocks `herdr agent send` to a dead pane (prose executes as shell — 2026-07-10 incident), self-sends, `pane run` at live agents | You really do want text+Enter at that pane | guard-herdr-send.sh:38 |
| `SKIP_DEVGUARD=1` | guard-dev-server.sh entirely (second-server + kill-the-holder blocks on :5264) | A human-coordinated restart of the shared server | guard-dev-server.sh:28,37 |
| `KAMI_ALLOW_MULTI_DEV=1` | Both the vite `singleServerGuard` and the Claude dev-server hook | A deliberate throwaway server on ANOTHER port — this is exactly how the e2e lane runs on :5265 (playwright.config.ts:40). NEVER to start a rival on :5264 | vite.config.ts:120, guard-dev-server.sh:37 |
| `SKIP_INBOX_GUARD=1` | guard-inbox-pending.sh — blocks hand-editing machine-written `project/playtest-inbox/pending/*.md` (drain state belongs on the `.json` sidecars, ADR-171) | Repairing a corrupted capture file WITH the human | guard-inbox-pending.sh:21 |
| `SKIP_MDWRAP=1` | md-prose-width.sh — the advisory ~72-char prose-width nudge (PostToolUse; never blocks — the write already happened) | Silencing on tables/URLs/CJK-heavy files | md-prose-width.sh:29 |
| — (none) | enforce-headless-qa.sh — unconditionally denies headed-browser MCP tools; QA is headless (`qa-shots.mjs` / `__qa`) | No escape by design | .claude/settings.json:49 |
| — (none) | guard-bash-safety.sh tree-wide destructive git ops | No escape var (ADR-196); name explicit paths instead | guard-bash-safety.sh:72-113 |

`PUSH_CLAIMED=1` is internal — `src/scripts/push-main.sh:29-31` marks
its own mutex-held push so the guard passes it. Never set it by hand;
use `pnpm run push`.

## §3 · Script & environment flags

| Flag | What it does | Default | Read at |
|---|---|---|---|
| `VERIFY_CONCURRENCY` | Verify worker-pool size | CPU count | verify-run.ts:147 |
| `VERIFY_BUDGET_MS` / `VERIFY_SOFT_MS` / `VERIFY_BUDGET_RUNS` | `--budget` mode hard/soft targets + sample count | 8000 / 5000 / 3 | verify-run.ts:341-343 |
| `UPDATE_MAP_GOLDEN=1` | Regenerates the map golden pin instead of comparing: `UPDATE_MAP_GOLDEN=1 pnpm exec vitest run src/ui/map-sheets/golden.test.ts` | unset | golden.test.ts:101 (usage in its header :11). Regenerate DELIBERATELY only — the pin is the committed look (map-sheets skill owns the workflow) |
| `SHIP_DEV_TOOLS` | `0/false/no/off` STRIPS client-side DEV tools from the prod build (post-T0 hard strip, ADR-138); any other value (incl. unset) ships them default-off | ship (T0 policy) | vite.config.ts:99-101; verify-dev-strip.sh:25 reads the SAME env |
| `KAMI_VITE_CLIENT=1` | Restores vite's REAL `/@vite/client` (error overlay + HMR) instead of the inert stub | stub (no auto-reload — TST2) | vite.config.ts:242 |
| `KAMI_INBOX_NO_COMMIT=1` | Disables the playtest-inbox auto-commit of captures | auto-commit on | playtest-inbox.ts:273 |
| `QA_URL` | Target URL for the headless QA drivers (`qa-shots.mjs`, `map-audit-shots.mjs`, `save-smoke.mjs`) | `http://localhost:5264/` | qa-shots.mjs:8, map-audit-shots.mjs:16, save-smoke.mjs:7. (The old `playtest.mjs` was retired/deleted 2026-07-18; the live fight handle is `__qa.fight(mobId)`, main.ts:632) |
| `LEDGER_AUTOCOMMIT=1` | Internal recursion cut for post-commit's sweepguard-ledger auto-commit | unset | post-commit:13. Never set by hand |
| `BUILD_VERSION` / `BUILD_SHA` / `BUILD_DATE` | Override the version/build stamp (CI, reproducible builds) | package.json version / git short-hash / commit date | vite.config.ts:85-89 |
| `GH_PAGES_WORKTREE=/path` | gh-pages deploy worktree location | `../gh-pages-kami-kakushi` | gh-pages.sh:31, ship.sh:28 (deploy is human-gated — see `/ship`) |

Minor knobs, listed for completeness: `DEV_SPACE_LABEL` /
`DEV_READY_TIMEOUT_MS` (herdr-dev-space.sh:16-20),
`HERDR_PEERS_INCLUDE_SELF=1` (herdr-peers.sh:23; session-brief.sh:89
sets it).

## §4 · Vite build-time defines

Defined in `vite.config.ts:291-298`; globals declared for TS in the
env types. Statically-false defines dead-code-eliminate their `&&`
branches — that IS the prod strip mechanism (ADR-138).

| Define | Value | Notes |
|---|---|---|
| `__VERSION__` | `BUILD_VERSION` env or `v` + package.json version (AC-21 single source) | vite.config.ts:85,291 |
| `__BUILD_SHA__` | `BUILD_SHA` env or `git rev-parse --short HEAD` (`'dev'` fallback) | vite.config.ts:86-87,292 |
| `__BUILD_DATE__` | `BUILD_DATE` env or `git log -1 --format=%cs` | vite.config.ts:88-89,293 |
| `__DEV_TOOLS__` | `command === 'serve' \|\| SHIP_DEV_TOOLS` — build-time INCLUSION axis | vite.config.ts:298 |

`__DEV_TOOLS__` is only half the gate: runtime ACTIVATION is
`resolveDevGating(isDev, hasTools, search)` in
`src/app/dev-gating.ts:31-43` — pure, so its truth table is the
unit-tested (RED-able) proof a prod bundle is default-inert. TRAP: in
dev serve, define values install at runtime via `/@vite/env`; the
inert client stub must keep importing it or `__DEV_TOOLS__` /
`__VERSION__` are undefined and boot throws (vite.config.ts:27-30).

## §5 · URL boot params

| Param | Effect | Gated by | Read at |
|---|---|---|---|
| `?dev=yes\|1\|true\|on` / `?dev=no\|0\|false\|off` | Runtime DEV opt-in/out. Dev serve: panel default-ON, `?dev=no` opts out, but `qa` STAYS ON (e2e drives `__qa`). Prod: both default-OFF, `?dev=yes` opts in | `__DEV_TOOLS__` in bundle | dev-gating.ts:17-18,36-42 |
| `?fixture=<name>` | Boot into a named scenario save (FB-6); backs up the real run first, routes through the normal import→migrate→validate path | `__DEV_TOOLS__ && gating.qa` | main.ts:199-204 |
| `?instanttext=1` | Zeroes the narrative pacing (typewriter + reveal cascade) so harness/e2e drives aren't clocked by it; player-invisible, folds out of prod builds | dev serve only (`import.meta.env.DEV`) | render.ts:434-437 (`QA_INSTANT_TEXT`); used by src/tests/e2e/helpers.ts:70 |
| `?<surfaceId>=<variantId>` | Select an ADR-075 diverge variant (guarded: ignored unless a real variant of that surface); picks mirror back into the URL, default keeps a clean URL (FB-18) | DEV panel mounted | dev.ts:160-168,182-197 |
| `?story-<bundleId>=<takeId>` | Select an ADR-139 story take (same guard + URL-mirror pattern; `canon` = clean URL) | DEV panel mounted | dev.ts:170-174,210-222 |
| `?bal.<path>=<value>` | Hydrate balance-cockpit lever overrides from the URL (shareable tune links). Deliberately OUTSIDE the dev-panel gate so a shared link works under `?dev=no` | `__DEV_TOOLS__` in bundle | main.ts:803-806 (`cockpit.hydrate()`); dev-cockpit.ts:369-371 |
| `?telemetry=no\|0\|off\|false` | Opt OUT of FB-8 attended-time telemetry — REQUIRED for automated/agent runs so machine time never pollutes the human's pacing sensor | dev serve only | main.ts:314-316 |
| `?t1-map-demo` / `?t2-map-demo` | Open the tier map review sheet straight from boot (shareable "look at the map" link); first one wins; no T0 param (the real Map tab ships it, FB-364) | DEV panel mounted | dev.ts:654-664 |

## §6 · Balance cockpit levers (ADR-134 / ADR-059 / FB-7)

The pattern (all in `src/core/content/balance.ts`):

- A curated lever is an **`export let`** binding (e.g.
  `RICE_PER_RAKE`, balance.ts:59-62) — `let` so the cockpit can
  reassign it live; only balance.ts itself reassigns, through
  `__setBalanceLever(path, value)` (balance.ts:734).
- `readBalanceLever(path)` (balance.ts:630) and the setter are
  explicit switches that MUST stay in lockstep (balance.ts:626-631);
  the cockpit's registry round-trip test is the guard.
- `BALANCE_CANON` (balance.ts:882) freezes every lever's module-init
  value — a plain literal, captured before any setter runs, so canon
  is derived, never hand-copied. `__resetBalanceLevers()`
  (balance.ts:929) restores it.
- The UI + export-diff builder live in `src/ui/dev-cockpit.ts`
  (curated `BALANCE_LEVERS` registry :52; `buildTuneArtifact` renders
  the committable `old → new` markdown).

**The law (ADR-134): the HUMAN tunes by slider; an agent only
TRANSCRIBES.** An agent never moves a slider into canon on the human's
behalf — it reads the exported artifact from
`project/playtest-inbox/` and applies the exact `old → new` edits
(stale-canon guard first). Apply flow:
`docs/guides/qa-playtesting.md` §1; a balance magnitude change then
owes the ADR-132 machine verdict (`pnpm run verify:balance` →
`balance:report`, report diff committed WITH the change) — sim
methodology is owned by `kami-balance-analysis-toolkit`.

**Test-leak trap:** vitest runs `isolate: false`; a test that calls
`__setBalanceLever` without `__resetBalanceLevers()` in teardown
leaks into the next file. Full leak mechanics (which module states
leak, the sanctioned isolate-drop trade): kami-debugging-playbook §1.

## §7 · Add-a-flag checklist, per class

Before adding ANY flag, ask which rung holds the rule (gate > hook >
skill > norm, AGENTS.md) — a flag is an ESCAPE and every escape widens
the bypass surface. Then:

1. **New commit-gate escape (`SKIP_*` in `.githooks/`)** — add the
   `[ "${SKIP_X:-0}" != "1" ]` guard next to the check; document it in
   the hook's header Bypass block (pre-commit:22-27 is the pattern);
   name the ONE legitimate case in the block message itself; add the
   row here. If the bypass should be auditable, copy the
   sweepguard-ledger pattern (guard-git-add-all.sh:27-33 +
   post-commit).
2. **New Claude-hook escape** — early-exit on the env var AND match it
   inline in the command text (guard-dev-server.sh:28,37 does both —
   env prefixes inside the Bash tool call are text, not process env);
   print the escape in the block message; wire in
   `.claude/settings.json` (takes effect on session restart).
3. **New script env var** — read via `process.env`/`${VAR:-default}`
   with a safe default; document in the script header `Usage:` line
   (qa-shots.mjs:3 pattern).
4. **New vite define** — add to `define` in vite.config.ts (env-var
   override wins, :291-298); keep prod-strippable code behind
   `__DEV_TOOLS__ && …`; extend `resolveDevGating` if it needs runtime
   gating — it is PURE so extend its unit-tested truth table
   (dev-gating.test.ts) as the RED-able strip proof.
5. **New URL param** — follow the guard-against-stale-value pattern
   (dev.ts:160-168: ignore unless the value is a registered id) and
   the clean-URL default mirror; keep it inside the narrowest gate
   (`gating.qa` vs `gating.panel` vs ungated-by-design like `?bal.` /
   `?telemetry` — copy their stated reasons, main.ts:313-316,801-803).
6. **New cockpit lever** — five touches in lockstep: the `export let`
   binding, `readBalanceLever`, `__setBalanceLever`, `BALANCE_CANON`,
   and the `BALANCE_LEVERS` registry entry in dev-cockpit.ts. The
   round-trip test catches a missed switch arm. Adding a lever is
   agent-safe; MOVING one into canon is not (§6 law).

## When NOT to use this skill

- What a specific verify gate checks and how to fix its RED →
  `kami-verify-gates`. Verify anatomy, lanes, budget, CI map,
  dev-server law → `kami-build-and-env`.
- Whether a change needs human sign-off at all → `kami-change-control`
  (no flag here routes around it).
- Driving the game headlessly / the `__qa` surface →
  `kami-debugging-playbook` and the `capture-game-states` skill.
- Schema/save fields (`SCHEMA_VERSION`, migrations) →
  `kami-save-and-schema`.
- Balance sim methodology and proofs →
  `kami-balance-analysis-toolkit`.
- Releasing (`SHIP_DEV_TOOLS` in anger, gh-pages) → the `/ship` skill
  (human-invoked only). Map pin workflow → `map-sheets`.
- Game-state story flags (`setFlag(state, 'x')`) are NOT config —
  that's core state (ADR-179); see `kami-extension-recipes`.

## Provenance and maintenance

Authored 2026-07-18 from repo state at HEAD `4bfb3ba3` (a co-agent had
uncommitted WIP in `src/ui/` + a journal file; every fact above was
read from committed-or-clean files). Volatile facts date-stamped
inline: gate count 21, doc-budget caps, e2e ~50s, T0 ship-dev-tools
default.

Re-derive each table (run these when this skill smells stale):

```bash
# §1 — git-hook escapes + their lines
grep -rn "SKIP_[A-Z_0-9]*\|PRECOMMIT_[A-Z_]*\|VERIFY_FULL" .githooks/
# §2 — Claude-hook escapes + wiring
grep -rn "SKIP_[A-Z_0-9]*\|KAMI_[A-Z_]*" .claude/hooks/*.sh
grep -n "hooks/" .claude/settings.json
# §3 — every env var scripts/configs read
grep -rhoE "process\.env[.\['\"]+[A-Z_0-9]+" src/scripts \
  vite.config.ts playwright.config.ts \
  | grep -oE "[A-Z_0-9]+$" | sort -u
grep -rhoE '\$\{[A-Z_0-9]{4,}' src/scripts/*.sh .githooks/* \
  .claude/hooks/*.sh | grep -oE "[A-Z_0-9]+" | sort -u
# §4 — defines
grep -n "define:" -A 10 vite.config.ts
# §5 — URL params
grep -rn "URLSearchParams\|location.search" src/app src/ui --include="*.ts"
# §6 — lever registry vs canon
grep -n "__setBalanceLever\|BALANCE_CANON\|readBalanceLever" \
  src/core/content/balance.ts src/ui/dev-cockpit.ts
# gate count (never hand-type it)
grep -c "name: '" src/scripts/gates.ts
```
