# Session 107 — 2026-07-07 — BACKLOG restructure: T1 plans + stale-pointer guard

**Summary:** Reshaped `project/BACKLOG.md` per the human's steer — it now holds
parked *notes*, not pointers to plans. Deferred-tier plans live as real docs in a
new `docs/plans/<tier>/` subfolder (invisible to the flat "active plans"
scanners, so not nagged as startable). Added a `checkpoint` guard that RED-flags
any `docs/plans/…` reference in BACKLOG whose target has archived out of
`docs/plans/` (the exact drift that left two stale T0 pointers).

## What changed
- `src/scripts/checkpoint.ts` — new pure `extractPlanRefs` / `stalePlanRefs` +
  `staleBacklogRefs` wrapper; wired into `--check` (RED) and write-mode (WARN).
  Runs as the existing `checkpoint` verify gate + inside `pnpm run checkpoint`
  (so prepare-to-exit covers it for free — no skill edit needed).
- `src/scripts/checkpoint.test.ts` — 6 RED-able tests for the two pure fns.
- `project/BACKLOG.md` — rewrote the header (parked NOTES, not plan-pointers);
  removed the 2 stale T0 pointers (their plans archived days ago) + both T1
  items; kept the T2 inn-board note.
- `docs/plans/t1/opus-2026-07-07-emergent-node-extensions.md` — NEW: the emergent
  node-discovery extensions (was a BACKLOG bullet) as a durable PARKED plan.
- `docs/living/{decisions.md,roadmap.md,prd/03-unlock-ladder.md}` — repaired the
  capstone links to the `../plans/t1/…` path. (The capstone move to `t1/` was
  already committed by the concurrent story-reboot agent, but it left these
  inbound links dangling at the old flat path — these fixes make the tree green.)

## Next intended steps
1. Push when the shared tree has a green window (concurrent agent w2:p2 is live in
   the story docs).
2. The parked drain-inbox capture (cursor flicker, `2026-07-07T13-06-19-66f8f3`)
   still needs a repro + the human's steer — bring the proposal.

## Landmines
- **Shared tree:** w2:p2 (Fable story-reboot) is editing `docs/living/` (roadmap,
  prd, decisions) concurrently — the same files my link-repairs touch. Re-check
  the staged set before every commit; stage explicit paths only.
- The emergent-extensions plan is committed with `SKIP_QUEUE=1` (parked, not
  for-immediate-read) — the reading-queue gate hard-blocks a new `docs/plans/*.md`
  otherwise, and the case glob matches the `t1/` subfolder.
- Flat scanners (`checkpoint.ts planFiles()`, `session-brief.sh`) do NOT recurse
  into `docs/plans/<tier>/` — that invisibility is the *point* (parked plans
  aren't listed as active), but a tier-folder plan won't get token-validated.
