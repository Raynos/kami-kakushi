# Session 161 — 2026-07-10 — inbox drain: r0 + dev (+ vn-overlay, work-actions clusters)

**Summary:** Drained the r0 + dev lanes (9 captures, ADR-171 claim w6:p1),
pulling the vn-overlay (cold-open partner) and work-actions (r1 partner)
clusters into the pass. Root-caused the dev triplet (FB-358/359/360) to two
render early-return bugs; refuted FB-353 (fixtures are provably current) and
FB-329 (map fog + travel gating already shipped).

## What changed
- `src/ui/render.ts` — FB-358: renderNav activeTab fallback hoisted above the
  <2-tabs early return. (Later entries appended per commit below.)
- `src/ui/render.test.ts` — RED-able jsdom test for the tab-set-collapse swap.
- `project/feedback-human/2026-07-10-playtest-dev.md` — dev-lane F-entries.

## Log
- Claimed r0+dev; collision announce → human steered: pull cold-open partner,
  pull the r1 work-actions partner (not in w2:p5's log-panel pull). Re-laned
  both clusters, intake-committed the 5 sidecars (`06f73cc1`).
- Reproduced all 9 headlessly (tmp/drain-repro-r0dev.mjs + probes): FB-358
  visually confirmed; FB-359/360 = stale `.vn-scene` overlay after newGame
  during a VN (pre-awake render branch never tears it down); FB-353 refuted
  (all 9 fixtures import clean, schemaVersion 10); FB-329 already true in the
  build (未測 fog + canMove reveal gating).
- Wholesale proposal approved; forks picked: rake cap = 50 total for R0,
  silent echo = `Nameless: "…"`, Rung-up = promotion kicker.
- FB-358 fixed (this commit).
- FB-359/FB-360 fixed: teardownIntroScene() in the pre-awake render branch
  (RED-proven); the whole dev triplet was one cascade.
- FB-334 fixed: the DEV action-card unit reads "body" (the meter's name).
- FB-327 fixed: r1-kept silent option echoes as `Nameless: "…"` (say: override).
- FB-328 fixed: promotion kicker + target-rank line above the Rung up button.
- FB-324 fixed: RAKE_CAP=50 total (balance lever + rakesDone counter + AC-6
  refusal + cap line + auto-rake disarm); fixtures regen; balance GREEN (Δ 0.0).
- FB-353 + FB-329 answered (💬): fixtures provably current (the staleness was
  FB-358's UI bug); map fog + movement lock already shipped.
