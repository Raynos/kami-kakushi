# Session 93 — 2026-07-06 — hookify bash rules → one native PreToolUse guard

**Summary:** The human flagged the hookify warn messages as too verbose and the
double-fire (hookify has no pre-only mode — every `event: bash` rule injects
its message on BOTH PreToolUse and PostToolUse) as annoying. Replaced all
three hookify bash rules with one native PreToolUse(Bash) hook,
`.claude/hooks/guard-bash-safety.sh`, with heavily trimmed messages (~30 words
per warn vs ~90, fired once instead of twice).

## What changed

- `.claude/hooks/guard-bash-safety.sh` — NEW native guard. Warns (JSON
  `systemMessage`, exit 0) on tree-mutating git commands (`stash` / `restore` /
  `checkout` / `switch` — branch-creation `-b`/`-c` exempt — / `reset --hard` /
  `clean -f`) and on shell redirection into `src/`; BLOCKS (exit 2) the
  `SKIP_VERIFY=… git push` combo. Tested with a 16-case battery
  (`tmp/test-guard-bash-safety.sh`, git-ignored): all warn/block/pass cases
  behave; combined commands stack both warnings.
- `.claude/settings.json` — wired the new hook into the existing
  PreToolUse(Bash) matcher, after `guard-git-add-all.sh`.
- Deleted `.claude/hookify.no-tree-mutation.local.md`,
  `.claude/hookify.no-skip-verify-push.local.md`,
  `.claude/hookify.warn-shell-write-source.local.md` — superseded by the
  native hook (full original texts live in git history). The hookify plugin
  itself stays enabled (the `/hookify` skills remain useful); with zero rules
  its hooks are no-ops.

## Next intended steps

1. None — self-contained. If a future hookify rule is bash-shaped, prefer
   extending `guard-bash-safety.sh` (one fire, lean message) over a new
   hookify rule.

## Landmines

- The trimmed warn texts drop the exemption explanations on purpose: the
  regexes already exclude exempt forms, so the message never fired for them.
- Testing this hook is self-referential: a Bash command whose literal text
  contains a trigger pattern (e.g. the SKIP_VERIFY+push string) gets blocked
  by the hook itself — put test cases in a script file and run that.
