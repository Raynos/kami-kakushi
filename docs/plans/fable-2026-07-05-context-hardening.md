# Plan — context hardening (from the 2026-07-05 context audit)

**Status:** PROPOSED — awaiting the human's read; phases 1–3 are build-ready on
a nod, phase 4 needs per-cut sign-off.
**Confidence:** ( 70% Opus, 30% Fable ) — see routing below.
**Sources:** [`project/audit/reports/2026-07-05-context-audit.md`](../../project/audit/reports/2026-07-05-context-audit.md)
(the audit) + the follow-up assessment discussed with the human (2026-07-05,
session 86): top-10 ranking, context/token-efficiency verdicts, unknown
unknowns. This plan is that conversation made durable.

## Who builds this — Fable or Opus?

- **Phases 1–3: Opus.** Mechanical, fully specified here (scripts, fixtures,
  regex extensions); the judgment was spent in the audit. Each step has a
  RED-able DoD.
- **Phase 4: Fable + the human.** Editorial cuts to always-loaded canon —
  wrong-cut risk is silent meaning-loss, the D-117-compression class of work.
  Each cut is its own commit; the human reviews diffs, not prose promises.

## Why (one paragraph)

The audit's verdict: the enforcement lattice is real and healthy, but (a) the
whole thing is opt-in on an unverified `core.hooksPath`, (b) the fail-open
advisory layer has no way to go RED (the session-brief CI probe was dead for
weeks; nothing says what else is dead right now), and (c) the always-loaded
context layer has no budget cap and a few self-contradiction/namespace traps.
Fix order = leverage per line changed.

---

## Phase 1 — wire the floor (hooksPath) 〔~30 min〕

1. **`package.json`**: add `"prepare": "git config core.hooksPath .githooks || true"`
   — npm runs `prepare` on every `npm install`, so any fresh clone that can
   build is also gated. `|| true` keeps non-repo installs (tarball/CI oddity)
   from failing.
2. **`src/scripts/session-brief.sh`**: loud one-line warn at the top of the
   brief when `git config core.hooksPath` ≠ `.githooks` — the belt for clones
   that never ran `npm install`.

**DoD (RED-able):** scratch-clone sim in `tmp/`: clone → `npm install` →
`core.hooksPath` is set AND a journal-less commit is blocked; then
`git config --unset core.hooksPath` → the brief prints the warn. Reverting
step 1 makes the sim fail (proves the check bites).

## Phase 2 — make the advisory layer RED-able (`verify:tooling`) 〔~2 h〕

A meta-suite for the ~20 process scripts/hooks that currently have zero tests
(the game has 797; the scaffolding has none — that's where both silent
failures lived). New `src/scripts/verify-tooling.ts` + npm script
`verify:tooling`, wired into **`verify-nightly.yml` only** — NOT the commit
roster (D-072's 5s budget is sacred).

Checks, all fixture-driven so each can go RED:

1. **Syntax/executability**: every `.githooks/*` + `.claude/hooks/*.sh` passes
   `bash -n` and is `+x`.
2. **guard-git-add-all.sh matrix**: pipe canned PreToolUse JSON through the
   hook — `git add -A`, `git add .`, `git commit -am`, bare `git commit` must
   exit 2; pathspec adds, `git commit … -- path`, `--amend`,
   `SKIP_SWEEPGUARD=1` must exit 0. A regex regression goes RED.
3. **commit-msg matrix**: good trailer passes; missing/malformed trailer,
   colon-in-name fail; `Merge`/`fixup!` first-lines auto-pass.
4. **hookify rules parse**: frontmatter well-formed, `pattern:` compiles as a
   regex, plus a small must-match / must-not-match string list per rule (this
   is also where Phase 3's pattern extension gets its fixtures).
5. **Probe liveness**: the brief's CI probe command path returns non-empty
   when `gh` is present (the exact failure class of the `timeout` bug);
   `herdr-peers.sh` exits 0 both with and without herdr.

**DoD (RED-able):** mutation test in the suite's own fixtures — break one
guard regex in a temp copy → suite RED; restore → green. Nightly wire-up
proven by one intentionally-red run on a branch (CI-red-proof via isolated
worktree, per the established pattern).

## Phase 3 — guardrail coverage + dedupe 〔~1 h〕

1. **Extend `no-tree-mutation`** (warn-rung stays warn) to the three worst
   uncovered commands:
   `git switch` (except `-c`/`-C`) · `git reset --hard` · `git clean` with
   force. Fixtures land in the Phase-2 rule matrix first (red), then the
   pattern (green).
2. **Cull `no-bulk-git-add`** ⚠️ *needs-nod (your hookify rule)*: it warns on
   the exact patterns `guard-git-add-all.sh` already blocks — double message
   per offense, zero added protection. Recommend delete; keep if you want
   belt-and-braces.
3. **`settings.local.json` prune** ⚠️ *human-owned file — your 5 minutes, not
   an agent edit*: drop the two `sed` RICE_PER_RAKE one-offs, the
   `node tmp/mobile-ui/*` entries, and consider narrowing
   `Bash(git restore *)` / `Bash(git add *)` — they pre-approve what the
   guards then have to catch.
4. **Micro-hygiene** (one commit): battery skill gains "(create if absent)"
   on `battery-lessons.md`; repo-map gains one line naming the CI fan-out
   (verify / verify-nightly / build / lint / test / typecheck / e2e).

**DoD:** Phase-2 suite green with the new fixtures; a `git switch main`
dry-run in a scratch session draws the warn.

## Phase 4 — context diet 〔judgment; per-cut sign-off〕

Order chosen so each cut is independently revertable (one commit each):

1. **Namespace collisions** — smallest cut, do first:
   - AGENTS.md's taste values `T1–T4` → **`V1–V4`** (taste.md, the SoT,
     already uses V1–V4 — AGENTS.md is drifted, and `T#` collides with game
     tiers T0–T5).
   - Philosophies `R1–R6` → **`PH1–PH6`** (collides with review R-items
     R1–R8) across docs/philosophy/ + AGENTS.md §Philosophy + any ADR
     back-refs a grep finds. ⚠️ *needs-nod: touches the philosophy register's
     identity; pure relabel, zero prose change.*
2. **diverge skill** — graduate §0/§3/§4/§7/§8 (the retired
   branch/`?variant=`/contact-sheet/GC model, ~140 lines, both dead refs)
   verbatim to `project/archive/2026-07-05-diverge-v1-branch-model.md` with a
   forward pointer; live skill keeps header + §1/§2/§5/§6. A15 discipline:
   text-mode word-diff proves content moved, not changed.
3. **AGENTS.md checkpoint bullet** — compress ~40 lines to ~8 (the three
   non-negotiables + pointer); `working-agreements.md → Checkpoint` is already
   the declared SoT (`prepare-to-exit` holds no copy for exactly this reason).
4. **Budget-cap the always-loaded layer** — add to `verify-doc-budgets.ts`:
   AGENTS.md ≤ 420 (currently 402; ratchet to ~350 after cut 3), repo-map.md
   ≤ 160 (currently 147). Same rung as project-status/taste/ui-design — the
   only always-loaded docs *without* a cap today. `SKIP_DOCBUDGET=1` remains
   the human-blessed raise path.

**DoD:** every cut = one commit whose diff the human can review; word-diff
attached for cut 2; `verify` green throughout; the caps go RED when exceeded
(prove once via a scratch over-length edit, then revert).

## Deliberately NOT in this plan (H-items — filed, then closed same-day)

- **H21 — per-agent worktrees vs the shared tree: CLOSED → A, status quo**
  (human, 2026-07-05: no appetite for the weight of per-agent
  worktrees/branches/merging). Consequence: the shared-tree guards are
  load-bearing **permanently**, which *raises* the value of P2 (test the
  guards) and P3 (extend their coverage).
- **H22 — journal shape for routine commits: CLOSED → A, status quo**
  (human, 2026-07-05: hand journals stay; `SKIP_JOURNAL=1` already covers
  trivial commits). The 4× write-up cost is accepted as the price of the
  on-disk memory model — no gate change.
- `AGENTS.md` prose-register rewrite beyond cut 3 — only worth doing after
  the caps exist and only with you (it's your voice in that file).

## Sequencing

P1 → P2 → P3 in order, any session, no human gate except the two ⚠️ items.
P4 starts only after you've read this plan (each cut lands solo). H21/H22
closed 2026-07-05 (both → status quo); nothing here was blocked on them.
