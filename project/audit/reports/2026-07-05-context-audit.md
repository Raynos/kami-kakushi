# Audit — the agentic scaffolding: AGENTS.md, hooks, skills, hookify

**Date:** 2026-07-05 (session 86) · **Requested by:** the human (TODO: "Ask
Fable 5 to review the context — AGENTS.md, the pre-commit hook, the git hooks,
the skills, hookify, etc. A fresh-eyes pass over the agentic scaffolding for
drift / bloat / gaps") · **Auditor:** Fable 5 · **Scope:** AGENTS.md +
repo-map.md + `.claude/rules/`, `.githooks/` (pre-commit / pre-push /
commit-msg), `.claude/` (settings, hooks, 4 hookify rules, all 13 skills),
`src/scripts/session-brief.sh`, the philosophy register, working-agreements.

## Method

Every artifact above read in full by the auditing session; two read-only sweep
agents ran in parallel — (a) a dead-reference sweep (31 files, **209 references
checked**), (b) a 10-claim mechanism-vs-reality verification (gate roster, npm
scripts, hook behaviors, CI, version single-sourcing). Agent claims were
spot-verified before being believed (R2).

## Verdict

**The scaffolding is fundamentally healthy.** The enforcement lattice AGENTS.md
describes is real — every named gate exists in the 17-gate roster, every named
npm script exists, the hooks do what the docs claim, version single-sourcing is
genuinely bound by `verify-changelog`, and only **3 of 209** references were
dead (two of them inside a section already marked retired). The findings are
**2 HIGH, 5 MEDIUM, and a low tail** — the doc-drift half **fixed this
session**; the enforcement-shape half is **proposed below** (process shape is
the human's call, not the agent's).

## Findings

### 🔴 HIGH

**F1 · `capture-game-states` walked agents into the headless-QA wall — FIXED.**
The skill's Setup said "drive via **Playwright MCP** or **Chrome DevTools MCP**
… **Prefer headful**" — the exact tool prefixes `.claude/settings.json` routes
to `enforce-headless-qa.sh`, which **unconditionally denies** them (hook added
Jul 1; the skill predates it, Jun 30). Any agent following the skill as written
gets hard-blocked, and the "prefer headful" advice directly contradicts
qa-playtesting.md §0 "HEADLESS ONLY". Same stale family inside
qa-playtesting.md itself: §0 mode-3 said "MCP browser drive", the §0 reviewer
bullet said "With Playwright MCP + Chrome DevTools MCP", and §7 Tooling still
advertised "MCP browser servers (headless): … both available". *Fixed: skill
Setup rewritten to the headless drivers (`qa-shots.mjs` / ad-hoc headless
page); qa-playtesting §0+§7 remnants aligned to the hook.*

**F2 · The git hooks are not self-installing, and nothing verifies they're
wired — PROPOSAL.** The entire commit/push lattice (verify gate, journal gate,
queue gate, attribution gate, red-push refusal) hangs on a manual
`git config core.hooksPath .githooks`, mentioned only in comments/docs. No
setup script, npm hook, or session-brief check exists; a fresh clone (or a
worktree tool that resets config) runs with **zero enforcement and zero
warning**. This clone is wired (verified), so it's a latent gap, not a live
incident — but it's the single highest-leverage hole found. *Proposed fix
(pick one):* an npm `"prepare"` script that sets hooksPath on `npm install`,
or a session-brief loud-warn when `git config core.hooksPath` ≠ `.githooks`.

### 🟠 MEDIUM

**F3 · AGENTS.md named the wrong gate-roster owner — FIXED.** AGENTS.md said
the roster is owned by `src/scripts/verify-run.ts`; it's `src/scripts/gates.ts`
(gates.ts self-describes as the single source; verify-run.ts imports `GATES`
from it; `.githooks/pre-commit:4` and the working-agreements gen-region agree).
Ironic instance of exactly the drift the pre-commit header warns about.

**F4 · The session brief's CI line was permanently dead on macOS — FIXED.**
`session-brief.sh` time-boxed `gh` with `timeout`, which macOS doesn't ship
(no coreutils) → the probe always failed → every brief printed "CI (main):
(status unavailable)" — silently, for weeks (gh itself answers in <1s and main
is green). Replaced with a portable `perl -e 'alarm … ; exec …'` time-box;
verified live: the brief now renders `completed/success`.

**F5 · The PRD split wasn't reflected in the PRD's own preamble or repo-map —
FIXED.** `docs/living/prd.md` is a 77-line index; the 7,700-line body lives in
`docs/living/prd/01…07`. But prd.md's "How to read" still said "a single
living document — every authored section lives below, in order", and repo-map
called prd.md "the merged PRD / vision spec". Both now describe the split.
(The pre-commit PRD-touch grep `^docs/living/prd/` was already correct.)

**F6 · The diverge skill carries ~140 lines of retired mechanics that
contradict its live sections — PROPOSAL.** §0/§3/§4/§7/§8 describe the
never-built branch/`?variant=`/contact-sheet/GC model; the header disclaimer
says "do not follow their mechanics", but the contradictions are live inside
one file: §4 calls `variants-log.md` "the single source of truth" while §6
says "there is no … variants-log.md/branch registry"; the §7 checklists demand
contact sheets and `diverge/*` branches. Both dead references found by the
sweep live here (`src/scripts/variant-gc.mjs`, `src/ui/variants/`). A mid-file
reader (or a section-targeted retrieval) can follow retired steps despite the
header. *Proposed:* graduate §0/§3/§4/§7/§8 verbatim to
`project/archive/<date>-diverge-v1-rationale.md` with a forward pointer
(append-only norm honored), leaving the skill = header + §1/§2/§5/§6.

**F7 · `no-tree-mutation` misses the most destructive shared-tree commands —
PROPOSAL.** The hookify pattern covers `stash` / `restore` / `checkout` but
not **`git switch`** (the modern checkout), **`git reset --hard`** (nukes the
whole shared tree), or **`git clean -f`**. Warn-rung extension, near-zero
false-positive risk: append `|git\s+switch\s+(?!-c\b)|git\s+reset\s+--hard|
git\s+clean\b` (shape to taste). Left to the human — hookify rules are
human-authored process shape.

### 🟡 LOW

- **F8 · AGENTS.md described `/drain-inbox` as a solo sweep — FIXED.** The
  skill (v2) is interactive: batches of ≤5, proposals first, the human's
  go-ahead gates any fix (§4). AGENTS.md's "an agent drains whenever
  (reproduce → triage → log → archive)" hid that gate; now stated.
- **F9 · `settings.local.json` stale/broad allows — human's own file, prune
  suggested.** One-off session approvals linger (`sed` RICE_PER_RAKE edits
  both directions, `node tmp/mobile-ui/...`), plus broad `Bash(git add *)`,
  `Bash(git restore *)`, `Bash(cd *)` — the first two pre-approve command
  shapes the guards/norms then have to catch (the add-guard blocks broad adds
  anyway; restore only gets a hookify *warn*). Untracked file; not touched.
- **F10 · `no-skip-verify-push` is evadable** by `export SKIP_VERIFY=1` in a
  prior command or `git -C . push` (regex wants adjacent `git push` with the
  var inline). Heuristic rung, documented as such — note, not a defect; the
  pre-push hook itself (not the hookify rule) is the real gate, but an
  exported var also defeats *it* by design (`SKIP_VERIFY` is the sanctioned
  bypass). Fine as calibrated.
- **F11 · commit-msg trailer check is laxer than its spec.** Spec: trailer at
  the end, after a blank line. Gate: any non-comment line matching
  `^Assisted-by: …` anywhere passes. Deliberate-looking A11 calibration
  (avoids false blocks); note only.
- **F12 · `no-bulk-git-add` (hookify, warn) duplicates `guard-git-add-all.sh`
  (hook, block)** on the same patterns → double message per offense. Harmless
  belt-and-braces; cull or keep as taste.
- **F13 · `battery` references `project/audit/battery-lessons.md` which
  doesn't exist yet** (the lessons log). Fine if created on first lesson —
  worth a "(create if absent)" parenthetical next time the skill is touched.
- **F14 · `warn-shell-write-source` misses `./src/` and absolute paths** in
  redirect targets (pattern anchors on bare `src/`). Warn-rung; note only.

### 🔵 Notes — undocumented-but-real (mostly fine where it is)

- The two PreToolUse guard hooks aren't mentioned in AGENTS.md (the norms they
  enforce are). Arguably correct — mechanisms fire regardless — but one line
  under "How to work here" would spare agents rediscovering why a command was
  denied.
- pre-commit knobs undocumented outside the hook itself: `SKIP_HERDR_PEERS`,
  `SKIP_BALANCE_FRESH`, `SKIP_DOCBUDGET`, `PRECOMMIT_BUDGET_S/AMBER_S`; plus
  advisory behaviors (staged-set echo, herdr FYI, PRD-drift nudge,
  balance-freshness warn, plan model-prefix warn). Hook comments are a fine
  home; no action.
- 7 of 17 gates are never named in always-loaded docs (verify-content,
  verify-prd, gen-docs, pacing, playcheck, md-links, checkpoint) — fine, the
  gen-region roster in working-agreements.md is the canonical list.
- CI is a 7-workflow fan-out (verify, verify-nightly, build, lint, test,
  typecheck, e2e); only e2e.yml is documented in repo-map. One line there
  wouldn't hurt.
- session-brief still supports the retired `pending-prd-changes.md` tracker —
  deliberate (repo-map says the pattern may recur); harmless.

## What checked out clean (verified, not assumed)

- **Gate roster:** all 17 gates exist with real scripts; every gate AGENTS.md
  names individually (gen-narrative, gen-prd-regions, verify-changelog,
  fixtures, milestone-integrity, doc-budgets) is in the roster; parallel
  execution claim true.
- **npm scripts:** all 9 referenced in the always-loaded docs exist.
- **pre-commit:** implements exactly the documented flags + gates; the
  reading-queue gate's two rungs (plans hard-block / brainstorms+reports loud
  warn) match the docs; the journal gate and SIGPIPE here-string fix are as
  described.
- **pre-push:** full roster on every push, lane flags force-unset, red refused.
- **commit-msg:** trailer + SKIP_ATTRIB + merge/revert/fixup auto-skip, as
  spec'd.
- **e2e lane:** workflow real; exactly two mobile profiles (Pixel 7 chromium +
  iPhone SE WebKit), as repo-map describes.
- **Version single-sourcing (A21/A22):** vite injects `__VERSION__` from
  package.json (0.3.7); CHANGELOG has the matching section; the gate binds
  them.
- **ship.sh / snapshot-research.sh / herdr-peers.sh / checkpoint.ts:** exist
  and match their descriptions; `prepare-to-exit` correctly holds no copy of
  the ritual (working-agreements is the declared SoT).
- **References:** 3 dead / 209 — exceptionally tight for this doc volume.
- **Skills in good current shape:** ship, taste-scorecard, prd-ripple,
  prd-compress, distill-taste, drain-inbox, tdd (+sub-docs), grill-me,
  handoff, battery (modulo F13). Frontmatter `disable-model-invocation` is
  set on exactly the user-only skills.

## Bloat assessment

The always-loaded context earns its size — it's mechanisms, not state. Two
exceptions worth judgment:

1. **The AGENTS.md checkpoint bullet (~40 lines)** is a near-full third copy
   of working-agreements.md §Checkpoint (which `prepare-to-exit` declares the
   single source). They agree today; that's drift-in-waiting. *Proposed:*
   compress the bullet to ~8 lines (the three non-negotiables + pointer).
2. **diverge's retired sections** — see F6.

## Punch-list for the human

Fixed this session (drift-alignment to already-locked reality; report + fixes
land in the same commit): **F1, F3, F4, F5, F8**.

Proposals awaiting your steer (enforcement/process shape — deliberately not
self-applied):

1. **F2 — wire-or-warn `core.hooksPath`** (npm `prepare`, or a session-brief
   loud-warn). Highest leverage; I'd take this first on a nod.
2. **F7 — extend `no-tree-mutation`** to `switch` / `reset --hard` / `clean`.
3. **F6 — archive diverge's retired sections** (verbatim, forward pointer).
4. **Bloat #1 — compress the AGENTS.md checkpoint bullet** to a pointer.
5. **F9 — prune `settings.local.json`** (your file: the two sed one-offs, the
   tmp scripts, and consider narrowing `git add *` / `git restore *`).
6. **F12 — keep or cull** the duplicate `no-bulk-git-add` hookify warn.
