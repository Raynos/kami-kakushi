# Session 128 — root tidy: move the loose top-level files

**Branch:** `storywave-cutover` · **Model:** Claude Opus 4.8

## What & why

The human flagged "weight" at the repo root. Surveyed it: of 17 tracked root
files, 15 are pinned by tooling (package.json, tsconfig, vite/playwright config,
dotfiles) or convention (README, CHANGELOG, CLAUDE.md, AGENTS.md) and must stay.
Only the genuinely-loose stragglers moved:

- `playcheck.baseline.json` → `src/playcheck.baseline.json` (only `src/playcheck.ts`
  + its test read it; both `../` → `./`; `.oxfmtrc.json` ignore path updated).
- `repo-map.md` → `docs/repo-map.md` (its 60 internal root-relative links
  reprefixed with `../`; `AGENTS.md` `@`-include + link updated;
  `verify-doc-budgets.ts` budget path updated).
- `raw/` → `project/raw/` (reference screenshots; `docs/repo-map.md` +
  `docs/living/taste.md` links updated).

Not moved: `e2e/` → deferred to a human TODO (`project/todo-human.md`), on the
human's instruction — it's wired into `playwright.config.ts` + CI and the tree
had multiple live agents, so it needs a quiet tree.

## Verification

My change is orthogonal to logic — path strings, docs, oxfmt config. Proven
green in isolation: `typecheck` ✓, `lint` ✓, `playcheck.test.ts` ✓ (reads moved
baseline), `verify-doc-budgets` ✓ (reads moved repo-map). The full `verify` is
RED from **pre-existing g4 WIP** on this branch (sim/persistence/autoMode arc
tests) — no file I touched is in those tests' graph. Committed locally by
pathspec with `SKIP_CODE_VERIFY`; **not pushed** (don't fight another agent's
red).

## Next intended steps

- When the tree is quiet, action the `e2e/` → `src/tests/e2e/` TODO.
