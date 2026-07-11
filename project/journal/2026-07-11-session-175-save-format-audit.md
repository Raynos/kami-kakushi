# Session 175 — 2026-07-11 — Save-format audit + streamline plan

**Summary:** Audited the save-file format end-to-end (the human's standing
"audit the save-file format" TODO, requested directly this session). Verdict:
the architecture already matches the "src is truth, save is facts" doctrine
(ADR-179 derived visibility, additive hydration, ADR-161 clean break, UI prefs
outside the save) — but the LOG is 86–97% of every save and ~85% of its
entries still persist authored prose verbatim, which is both the bloat and the
stale-render carrier. Wrote the streamline plan + a `src/persistence/README.md`
format doc; no code changed.

## What changed

- `src/persistence/README.md` — NEW: the save-layer orientation doc — module
  map, envelope + storage keys, the stored/derived/reset-on-load doctrine, the
  log-descriptor rule, the three schema-growth rungs (additive field →
  migration → generation bump; **renames need a migration**), and the
  fixtures-not-hand-edits testing path.
- `docs/plans/fable-2026-07-11-save-format-streamline.md` — NEW plan: 5 audit
  findings + 5 steps. Headline numbers (measured on fixtures):
  `pre-ascension` = 124 KB state / 120 KB log / 461 of 541 entries keyless
  (102 KB prose). Steps: (1) finish the Stage-C descriptor migration for the
  keyless emitters (narrative/scene/dialogue, `unlock.ts` reveal lines,
  discovery, works, perk/reward inlines) re-rendering from their OWN
  registries via a namespace resolver (log-content stays a leaf); (2) drop
  `validateState`'s `...base` spread (whitelist rebuild — retired fields age
  out); (3) missing `sitePools` key hydrates FRESH, not depleted
  (`?? 0` bug-hazard for a site added/renamed mid-generation); (4) DEV-only
  orphaned-id load report; (5) `weaponDurability` fallback from the weapon def.
- `project/todo-human.md` — removed the completed "Audit & review of the
  save-file format" TODO (human commissioned it directly this session); queued
  the plan in the reading queue.

## Next intended steps

1. Human reads the plan → greenlight → build steps 1–5 (step 1 is one commit
   per emitter file, C2…C8 cadence; regenerate fixtures once at the end).

## Checkpoint (end of session)

Snapshot's "Next (autonomous)" now leads with the save-format streamline
plan. fd73d92d reached origin via a co-agent's push; this checkpoint commit
carries only the snapshot + this note.

## Landmines

- Shared tree: `src/ui/dev.ts`, `src/ui/render.ts`, `src/ui/map-variants/*`
  are other agents' dirty WIP; session-174's journal file sits STAGED in the
  shared index — this session committed by explicit file pathspec only.
- Plan step 1's cycle risk: `core/content/log-content.ts` must stay a leaf —
  use resolver registration, never let it import surfaces/scenes.
