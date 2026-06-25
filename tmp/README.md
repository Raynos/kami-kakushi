# `tmp/` — repo-local scratchpad

Throwaway working space for agentic and manual development: intermediate results, scratch scripts,
generated artifacts you're about to inspect, notes-in-progress. Use this **instead of** the global
system temp / session scratchpad so working files stay inside the repo and are easy to find.

## Rules

- **Git-ignored.** Everything here is ignored except this `README.md` (see `.gitignore`:
  `tmp/*` + `!tmp/README.md`). The folder is tracked only so it exists on a fresh clone.
- **Disposable.** Assume anything in `tmp/` can be deleted at any time. Never put the only copy of
  something important here.
- **Graduate what matters.** If a file is worth keeping, move it to its real home:
  - durable design / "what the game is now" → [`docs/`](../docs/)
  - raw discovery / research capture → [`brainstorms/`](../brainstorms/)
  - QA screenshots / recordings / findings → [`audit/`](../audit/)
  - session logs → [`journal/`](../journal/)

See the **Temporary files** convention in [`../CLAUDE.md`](../CLAUDE.md).
