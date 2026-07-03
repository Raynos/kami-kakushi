# Session 51 — 2026-07-03 — PRD ripple tooling plan (D-117 Phase 0)

**Summary:** The human asked whether the PRD diet has a buildable-now slice —
can rippling from the game back into the PRD be partially automated, or
failing that, become a skill? Answer: both. Authored
`docs/plans/2026-07-03-prd-ripple-tooling.md`: a `prd:drift` fact reporter
(the game's typed registries — the same ones `gen-docs.ts` already exports —
diffed against PRD prose, plus a retired-terms tripwire), one pilot
gen-region (§3 T0 rung names) reusing the mechanical-checkpoint plan's
splicer module, and two skills (`/prd-ripple` for Flow 1 routing,
`/prd-compress` dormant until R1 closes). Grounded first: `verify-prd` is
structural-only today (no fact checks), so the drift tool is genuinely new
surface.

## What changed

- `docs/plans/2026-07-03-prd-ripple-tooling.md` — NEW: the plan (4 phases,
  Opus-routable; the eventual compression sweep stays Fable + human-signed).
- `project/todo-human.md` — queued the plan (same-commit queue gate).

## Next intended steps

1. Human reads the plan (queued); Ph1 (`prd:drift`) is independently
   buildable on sign-off — or autonomously, since it adds only a report.
2. Coordinate `gen-regions.ts` ownership with the mechanical-checkpoint
   plan: first-lander owns, the other imports.

## Landmines

- The semantic prose ripple is deliberately NOT automated — Flow 1 routing
  + the punch-list is the honest ceiling; don't let a future session
  auto-write PRD prose from diffs.
- Bulk PRD transclusion waits for the human-signed compression sweep (Q3);
  the pilot region is one already-shipped fact slice, filed as a queued
  diff.
