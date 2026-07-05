# Session 88 — 2026-07-05 — the desktop-journey e2e lane (P1–P5)

**Built:** `docs/plans/fable-2026-07-05-desktop-journey-e2e.md`, all five phases.
**Routing note:** the plan locked "Opus builds all phases"; the human then handed
the build directly to this (Fable) session — newest steer supersedes (D-022).

## What landed (in commit order)

- `f18bd8a` — `test:e2e` scripts pin `NO_PROXY=localhost` (a stale sandbox proxy
  env made Playwright's webServer probe hang for the full 60s timeout).
- `ff0f0ba` — **P1**: `desktop-chromium` project (1280×800),
  `desktop-layout.spec.ts` (two-column byōbu integrity, 18px pointer floor,
  drift guard), `press()` tap/click switch, journeys run on desktop.
- `789841a` — **P5.2**: `boot()` settles on conditions (`fonts.ready` + 2 rAF),
  not a fixed 400ms sleep.
- `7b6ce21` — **P2**: `journeys.spec.ts`, all 8 story-beat flows on every
  project; fixtures `rice-at-gate` + `at-kura-with-coin` added;
  `post-loss-broke` now carries sansai (earned by real hauling + foraging);
  `worn-weapon-no-wood` moved R3→R4 (see finding below).
- `a6003f9` — **P3**: `persistence.spec.ts` — reload-resume, export→import
  through the shipped settings UI across contexts, mid-intro refresh (T2).
- `dc7cbbe` — **P4**: `affordance-coverage.test.ts` — the intent→affordance
  ratchet in the verify vitest gate (compile-trip for new intents + runtime
  sweep for orphaned controls).
- P5 items 1/3/4 (sfx measure, capture-format regex import, pacing comment)
  were already landed by s85/s86 (`4b8721f`) — verified, not redone.

## Findings (scope surprises, surfaced not worked around)

1. **`verb-repair` is an R4 unlock by design** (`ranks.ts:150`): the plan's
   repair-bind journey assumed the R3 `worn-weapon-no-wood` waypoint could press
   Repair; no player can before R4 (only the reducer). The fixture moved up one
   rung so the UI-layer bind is real. Worth a design glance: an R3 player CAN
   hold a Battered blade with no visible mend path — intended per the ranks.ts
   comment, but it is a stretch where win-rate sags with no CTA.
2. **`wealthy-idler` carries zero rice AND coin** (everything banked), so the
   market/kura journeys needed the two new fixtures the plan anticipated.
3. **A brand-new profile can't reach Import until after the whole intro** — the
   settings button lives in the shell footer, hidden through the VN. The
   persistence test works around it honestly (imports over a live run); flagging
   the UX: a returning player restoring a save on a new device must replay the
   intro first.
4. **RED-proofs demonstrated:** the desktop two-column invariant (leaked the
   ≤720px collapse to all widths → RED), the autosave debounce (no-oped → RED),
   the coverage ratchet (5 intents uncovered mid-build → RED; the inverse check
   then caught `set_auto_rake` misclassified in the allowlist).

## State of the lane

Full run: **70 → 81 tests** across 3 projects, ~50s local (intro journey ~25s,
own 120s budget), comfortably inside the ≤3min CI target. `verify` holds at
~4.6s. CI (`e2e.yml`) confirmation pending the checkpoint push.

## Next intended steps

- Watch `e2e.yml` on the push; on green, archive the plan to `project/archive/`.
- The R3 repair-gap design glance (finding 1) and the fresh-profile import UX
  (finding 3) are candidates for the human's queue if they bother anyone.

## Close-out (appended)

CI green on `27086bb`: verify workflows + `e2e.yml` (3 projects, 81 tests,
~50s Playwright run inside a 3m08s job wall incl. setup) — the DoD's last box.
Plan flipped DONE and archived to `project/archive/`; the two design findings
(R3 mend-path gap, fresh-profile import behind the intro) queued as human
TODOs in `project/todo-human.md`.
