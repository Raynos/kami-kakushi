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

---

## 1b · Ph1 BUILT — `prd:drift` live, 19 real gaps found (same session, later)

Built Ph1 autonomously (report-only, no canon): `src/scripts/prd-drift.ts`
+ `npm run prd:drift` (+ `--strict`) + a warn-only pre-commit nudge
(content-registry commits without a PRD touch; `balance.ts` excluded — §4
magnitudes are ripple-frozen, so nudging there would push against D-117).

- **Findings:** 19 presence gaps — §3's pre-reshape rung titles (6/8
  missing), §4's weapon roster diverges from the build (axe vs kama-yari),
  4/8 mobs, stance ids, and the R8-pending cast trio. All in T0-sweep
  territory → left as the quantified sweep backlog, NOT hand-rippled
  (deliberate DoD deviation, noted in the plan's Ph1 build notes).
- **The tool cried wolf on run #1:** the retired-terms tripwire hit §2's
  real-name DENYLIST — the one line where retired names belong. Calibrated:
  a hit line that names the successor is a documented rename, not drift.
  Retired-terms now genuinely clean (3 allowed lines).
- **Could-go-RED proof:** `--strict` exits 1 today on real data.
- **⚠️ Shared-index sweep (f84aff9):** the Ph1 commit unintentionally
  carried 4 files the PARALLEL session had staged between my `git add` and
  my retry-after-prettier-fail: `src/core/content/voices.ts` + new
  `voices.test.ts`, `src/ui/render.ts`, `src/ui/styles.css` (their 'lord'-
  voice work). Their content is intact, verify-green, and pushed — only
  the commit attribution is mixed; no action needed by them (git sees no
  diff on their next commit). Lesson recorded to memory: in this shared
  tree, re-check `git diff --cached --name-only` immediately before EVERY
  commit retry — the index is shared and moves under you.

## 2 · Second-wave suggestions: 25 → top 10 (same session, later)

The human asked for a wider ideation pass: 25 process-improvement
candidates, ranked, top 10 kept, 15 discarded. Authored
`project/brainstorms/2026-07-03-process-top10.md` (ranked by human-time
leverage × compounding × feasibility × non-overlap with the four in-flight
plans; discards summarized by category at the bottom) and queued it. The
human intends to pick 1–2; each pick becomes a full `docs/plans/` plan
before any build. Recommended pair: #1 balance-tuning cockpit + #3 CI.
