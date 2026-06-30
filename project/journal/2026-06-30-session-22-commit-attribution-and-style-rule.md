# Session 22 — 2026-06-30 — enforce `Assisted-by` attribution + commit-message-style rule

**Summary:** Closed the human's commit-convention TODOs. Switched AI attribution from the harness
default `Co-Authored-By: Claude` (which GitHub renders as a co-author/committer — the thing we were
moving away from) to an `Assisted-by: AGENT_NAME:MODEL_VERSION` trailer, and **enforced** it with a
new `.githooks/commit-msg` gate (highest-rung principle). Ported depscan's `commit-message-style`
into the **native Claude Code `.claude/rules/` format** (50/72 + Conventional-Commits subject + the
trailer). Did **not** adopt depscan's `no-commit-without-approval` rule — it's the opposite of this
repo's autonomous, commit-as-you-go workflow.

## What changed
- **`.githooks/commit-msg` (new, executable)** — blocks any commit whose message lacks a well-formed
  `Assisted-by: NAME:VERSION` trailer. `commit-msg`, not `pre-commit`, because pre-commit runs
  before the message exists and can't see it. Auto-skips merge/revert/fixup/squash/amend messages;
  bypass a genuine human commit with `SKIP_ATTRIB=1`. Tested 5 cases (missing→block, valid→pass,
  Co-Authored-By-only→block, merge→skip, SKIP_ATTRIB→skip).
- **`.claude/rules/commit-message-style.md` (new)** — first file in `.claude/rules/`. No `paths:`
  → loads every session (Claude Code's native rule mechanism; confirmed format against the memory
  docs). Conventional-Commits subject + 50/72 body + the `Assisted-by` trailer, with good/bad
  examples.
- **`CLAUDE.md`** — the "AI Commit Attribution (Required)" section (added earlier this session) now
  notes it's enforced by `.githooks/commit-msg` and cross-refs the style rule.
- **`project/todo-human.md`** — marked the `claude`-committer TODO and the commit-message-best-
  practices TODO resolved (with residual notes); appended a new TODO: consider `CLAUDE.md` →
  `AGENTS.md` (Claude Code reads CLAUDE.md, supports AGENTS.md only via `@import`/symlink).

## My style calls (human said "make your own choices")
- **Kept Conventional-Commits prefixes** (repo already uses them; machine-readable) rather than
  depscan's plain non-technical subjects.
- **Allowed implementation specifics in the body** (this is a dev repo, not a product changelog) —
  but the body must still *lead with intent*, not a file list.

## Next intended steps
1. History rewrite to strip old `Co-Authored-By` trailers (+ the raw-JSON blobs) — one combined,
   human-approved `git filter-repo` + force-push. Still queued for the human.
2. Optional: elevate further if desired (e.g. lint commit subjects in `verify`), but the hook is
   sufficient for now.

## Landmines
- The `commit-msg` hook fires on **every** commit in this repo (it can't tell AI from human). A
  human committing by hand must use `SKIP_ATTRIB=1` or include the trailer — documented in the hook
  and CLAUDE.md.
- `.claude/rules/` is a real native feature (per the memory docs) but relatively new — if a teammate
  is on an old Claude Code build the rule simply won't load (degrades to "not enforced as context",
  no breakage). The hook enforcement is independent of Claude Code version.
