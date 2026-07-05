# Session 78 — 2026-07-05 — F9: the /ship release-train skill

**Summary:** Walked the human through the F9 plan interactively (all §8
open questions via AskUserQuestion); every default ratified except **itch
is OUT of the train entirely** (no `--itch` flag) and the **arg grammar is
`patch (default) | minor | x.y.z`** (no AskUserQuestion fallback at
step 1). Plan flipped to 🔨 IN-PROGRESS with a ratified-decisions block;
F9 removed from the reading queue (read in-session, D-089). Building Ph1
next: `src/scripts/ship.sh` + `.claude/skills/ship/SKILL.md`.

## What changed

- `docs/plans/fable-process-F9-ship-skill.md` — Status → 🔨 IN-PROGRESS;
  ratified-decisions block added; itch bits struck (§3.8, §5, §6, §7 Ph1,
  §8.5); step-1 bump grammar superseded.
- `project/todo-human.md` — F9 reading-queue entry removed (read
  in-session).
- `project/journal/2026-07-05-session-78-f9-ship-skill.md` — this file.

## Next intended steps

1. Build Ph1: `ship.sh` (preflight ancestor check → temp worktree of HEAD
   at `tmp/ship/wt` → `npm ci` → `verify` → temp copy of `gh-pages.sh`
   with `GH_PAGES_WORKTREE` pointing at the real sibling → live-site
   proof polling `__VERSION__` + `__BUILD_SHA__`) + `SKILL.md`
   (user-invoked only, one payload confirm).
2. Human runs `/ship` for the real v0.3.6 — Ph1's DoD.
3. Ph2 hardening (stranded gh-pages commit push, `--verify-live`, resume
   detection, working-agreements one-liner).

## Landmines

- Shared tree: the F8 agent is live and will edit `gh-pages.sh`'s strip
  marker loop — F9 must NOT edit that file (it reuses the temp worktree's
  copy verbatim). Stage own paths only.
- v0.3.6 stays a patch unless the human says otherwise at /ship time.
