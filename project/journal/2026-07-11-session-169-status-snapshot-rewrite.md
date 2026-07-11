# Session 169 — 2026-07-11 — status-snapshot full rewrite (debt 24/20)

**Summary:** The human called the snapshot rewrite due (the counter agreed:
24/20, REWRITE OWED since 2026-07-09, deferred behind co-agent WIP). Rewrote
[`project-status.md`](../status/project-status.md) fresh from the s168 journal
+ the live human queue. En route, fixed a real gate bug and cleared two
pre-existing stale-generated-docs reds that were blocking any docs commit.

## What changed

- **`project/status/project-status.md`** — full rewrite (110/120 lines):
  leads with estate Phase 1 done (ADR-177, HR-27) + Phase 2 startable; adds
  the FB-361…373 drain wave; compresses the storywave-era closures
  (s125–s144) into one block; syncs the waiting-on-human list to the live HR
  set (HR-25 closed; HR-27/HR-28 added); resume step 2 now says reuse the
  shared :5173 server. Counter reset to 0/20, rewrite date 2026-07-11.
- **`src/scripts/verify-doc-budgets.ts`** — the rewrite-debt gate blocked its
  own sanctioned reset (the threshold WARN says "reset to 0/20"; the
  monotonic check REDs any decrease — no reset had ever happened since the
  counter was born 2026-07-09). Fix: a reset passes ONLY as the full-rewrite
  pair — `0/20` AND an advanced `last full rewrite:` date; a bare 0 without a
  new date still REDs (verified both directions live).
- **`docs/content/t0-content.md` + `docs/living/prd/01-vision.md`** —
  regenerated; they'd gone stale at HEAD (`tab-inventory`/`tab-estate`/
  `panel-house-influence` reveal moves from the works-chain + drain commits),
  redding `gen-docs`/`gen-prd-regions` for every docs commit.

## Next intended steps

- Estate redesign Phase 2 (Schedule A tab moves + the Works 普請/Estate 家
  diverges) remains the startable plan step.
- Human-gated: HR-1 + the story picks (HR-18…21, 27, 28) + the DEV-variant
  picks (HR-2A–D, 5, 6, 26).

## Landmines

- The rewrite-debt reset is only valid as the pair (0 + new date) — a partial
  edit that touches the counter line without a genuine full rewrite will
  correctly RED.
