# Session 17 — 2026-06-29 — Relabel the PRD V2.2 → V2.3 (the 6-tier reshape batch)

**Summary:** Human asked whether the PRD should be V2.2 or V2.3 given the 6-tier reshape was rippled in.
Git archaeology confirmed the minor-version pattern (V2.1 = lock a decision batch → V2.2 = ripple it into
the body); the 2026-06-29 reshape (ADRs **D-048–D-069** + 5 forks, commit `3040844`, Part 1 of `path-to-v0.3`)
is structurally the *same* event but was still flying under the stale **V2.2** label from 2026-06-26. Bumped
all self-declared PRD version labels to **V2.3** (commit `2e63deb`). Doc-only relabel — no design/canon change.

This file is HISTORY, not live state — the live snapshot is `project/status/project-status.md`.

## Version chronology (for the record)
- **PRD V2** — full rewrite mapping the 79 V2 decisions; assembled `63d7f89` (2026-06-26 18:43).
- **PRD V2.1** — lock the 32 post-battery + 7 set-aside decisions (Block N/N.1, ADR D-043); `dbb8d1d`/`e44a7cd`.
- **PRD V2.2** — ripple Block N/N.1 into the body; `2b8d5e9` (2026-06-26 23:41).
- **PRD V2.3** — ripple the 6-tier reshape (D-048–D-069 + 5 forks) into the body; ripple `3040844`, relabel `2e63deb` (2026-06-29).

## What changed (commit `2e63deb`)
- `docs/living/prd.md` (stub index) — status header → V2.3 **+ a new line citing WHY** (D-048–D-069 + forks,
  commit `3040844`); all **7 section-table rows** → V2.3.
- `docs/living/prd/01,02,03,04,05,07-*.md` — each section's self-declared status header → V2.3; the §2
  provenance footer "reshaped to PRD V2 →" → V2.3. (§6 never had a version header → left as-is; the table
  row covers it.)
- `project/status/project-status.md` — live Phase line now states **PRD at V2.3** (reshape doc-ripple done;
  build against it = Part 2, pending), while preserving the true fact that the **demo (M0–M2) was built
  against V2.2**.
- `verify-prd` GREEN (7 sections present, contiguous, linked).

## Deliberately NOT changed (annotate-don't-delete)
- "**V2 decisions / the 79 V2 / Block L–M / LOCKED V2 §1**" — these name the *decision-set*, not the doc
  version. Renaming them to "V2.3" would be factually wrong.
- **ADR-log history** in `decisions.md` (D-043 "PRD V2.1 decisions", "Recorded for PRD V2.1", "built against
  V2.2") — true at the time; left intact.

## Next intended steps
1. (Unchanged from session-16.) Human reads & signs off the re-scoped `path-to-v0.3` Part 2 (reading queue),
   then **Part 2 → Movement 1**: the T0-M1/M2 audit → gap report → re-implement 🟡/🔴 lines.
2. **R1** (the human's M0–M2 fun/taste call) still open.

## Landmines
- **V2.3 is a doc-only version.** The reshape changed the PRD *text*; `docs/content/` regen + the §4 magnitude
  numbers are still Part 2 work. So "PRD at V2.3" and "code built at V2.2-era" legitimately coexist until
  Part 2 lands — do NOT read the V2.3 label as "the build matches V2.3."
- This was a labeling correction, **not** a design decision → no ADR. If a future version-policy needs to be
  durable canon, that would be its own ADR.
