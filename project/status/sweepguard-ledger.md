# Sweep-guard bypass ledger (ADR-196)

Every `SKIP_SWEEPGUARD=1` use is appended here by
`.claude/hooks/guard-git-add-all.sh` (date · pane · command) and
auto-staged into the next commit by `.githooks/pre-commit`. The point:
bypasses of the shared-index safety rules are VISIBLE in diffs and
`git log -p`, not buried in 1.8 GB of session transcripts (34 historic
uses were invisible until the 2026-07-13 contention analysis dug).

An entry here is not an accusation — some bypasses are legitimate
(deliberate whole-index commits, template false-blocks). It is a
record. If a pattern of entries clusters on one rule, that rule needs
redesign, not more bypasses.

## Entries
- 2026-07-13 17:14 · w1:p3 · `git diff --cached --name-only && SKIP_VERIFY=1 SKIP_JOURNAL=1 SKIP_SWEEPGUARD=1 git commit -m "fix(core): the rake-cap line emits KEYED — takes can reach it  fb324-rake-cap never flipped live (human r`
