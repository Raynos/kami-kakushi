# Session 186 — 2026-07-13 — the prose norm drops from 80 to 72

**Summary:** The human hit soft-wrap in an 80-column pane and ruled the
markdown prose norm down from **≈80 to ≈72 characters**. Ran the change
through every LIVE site that states or *executes* the width — the AGENTS.md
convention, working-agreements, two skills/workflows, the narrative authoring
spec, and the one place it was real code (`gen-regions.ts`'s `wrap()` default,
which hard-folds the generated gate-roster regions). 19 gates green.

## The diagnosis (worth keeping)

The wrap the human saw wasn't purely a width problem. Two distinct causes:

1. **The gutter.** An editor's line numbers + fold/sign column eat ~8 columns
   before a character of prose renders — so an "80-char" source line needs an
   88-column window. 72 restores the headroom, and doubles as the git-commit
   body width, so one number now covers prose and commits.
2. **Unbreakable tokens.** Long inline links (`[text](../../docs/plans/long-slug.md)`)
   and backticked paths are single atoms — *no* wrap width fixes them.
   Narrowing to 65 would have churned more paragraphs and still not fixed
   these. The AGENTS.md bullet now says so explicitly and points at
   reference-style links / shorter relative paths as the actual remedy.

## What changed

- `AGENTS.md` — the "Markdown prose width" convention bullet: 80 → 72, with the
  gutter rationale, the git-body coincidence, and the unbreakable-token caveat.
  **This bullet is the only always-loaded statement of the norm** — it is what
  makes agents write `docs/plans/*.md` at the given width. Nothing in
  `plan-authoring.md`, the `write-plan` skill, or `docs/plans/templates/`
  mentions a width at all (verified by grep); plans inherit it purely from here.
- `project/status/working-agreements.md` — the one-line restatement, + why.
- `src/scripts/gen-regions.ts` — `wrap()` default `78` → `72`. **The only
  executable site.** It hard-folds the generated `gate-roster` regions.
- `src/scripts/checkpoint.ts` — its explicit `wrap(…, 78)` → `72` to match.
- `project/status/project-status.md` + `working-agreements.md` — the generated
  `gate-roster` region, reflowed by `pnpm run checkpoint` (78 → 72 cols). This
  is a regen, not a hand-edit.
- `.claude/skills/ship/SKILL.md` — the CHANGELOG-authoring instruction (~80 → ~72).
- `.claude/workflows/map-blind-pass.js` — the blind-pass report prompt (~80 → ~72).
- `src/core/content/narrative/README.md` — the FB-5 authoring spec's hard-wrap
  rule + the heading-exemption bullet.
- `src/core/content/narrative/takes/works-cause/bundle.md` — the take-author brief.

## Deliberately NOT changed

- **`.oxfmtrc.json`'s `printWidth: 100`** — that's the TypeScript formatter, and
  markdown is on its ignore list. Unrelated to the prose norm; left alone.
- **`project/journal/`, `project/archive/`, `project/brainstorms/`** — historical
  records under the append-only rule. Their "~80" mentions are accurate history
  of what the norm *was*; rewriting them would be falsifying the record.
- **`src/core/content/narrative/t0v2/u1-r1-day-hand/VERDICT.md`** — likewise a
  record of a past review.
- **Existing docs at 80.** The norm explicitly says don't mass-retrofit; mixed
  widths are invisible once rendered. New/edited prose gets 72 from here on.
- **`.claude/worktrees/agent-*/`** — a co-agent's worktree; not mine to touch.

## Next intended steps

1. Nothing pending — the norm is canon and every executable site follows it.
2. If reflow churn ever becomes a real annoyance, the escalation is a `verify`
   *warn* (never a hard gate — CJK/URLs/tables make it cry wolf).

## Landmines

- **`wrap()` is load-bearing.** Changing its default rewrites every generated
  gen-region, and the `gen-prd-regions` / `checkpoint` gates **byte-compare**.
  Touch the width → run `pnpm run gen:prd-regions` **and** `pnpm run checkpoint`
  in the same change, or the gates go red. (`gen:prd-regions` was a no-op here:
  those regions' lines already sat under 72.)
- Shared tree: `docs/plans/opus-2026-07-12-sleep-announce-beat.md`,
  `project/todo-human.md`, and the co-agent's own session-185 journal were dirty
  throughout and are **not** in this commit.
