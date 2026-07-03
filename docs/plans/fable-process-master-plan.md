# Process-wave master plan — build order + merge map (F1–F10)

**Status: 📋 PROPOSED — ordering discussed with the human 2026-07-03; the
F-numbering below is the human's call (files renamed from the S/N series).**
**created_date:** 2026-07-03

Orders the ten open process-wave plans by (a) what builds first, (b) impact
on the game, (c) impact on implementing the *other* plans, and (d) how to
avoid subagents trampling shared files when each plan is built atomically by
a single agent. This is an ordering map, not a build plan — no code lands
from this doc; each plan keeps its own "Who builds this".

**File naming:** each plan is `fable-process-F<rank>-<slug>.md` where
`<rank>` is its build-order position below. The F1 rank is two files —
`F1a` (mechanical checkpoint, builds first) and `F1b` (PRD ripple
tooling) — because they are one merged build lane (see Merges #1).

## Rename map (provenance — journals/brainstorms cite the old names)

| Old (S/N series) | New (F build order) |
|---|---|
| `fable-process-S1-mechanical-checkpoint.md` | `fable-process-F1a-mechanical-checkpoint.md` |
| `fable-process-S5-prd-ripple-tooling.md` | `fable-process-F1b-prd-ripple-tooling.md` |
| `fable-process-N3-github-actions-ci.md` | `fable-process-F2-github-actions-ci.md` |
| `fable-process-S2-playtest-capture-inbox.md` | `fable-process-F3-playtest-capture-inbox.md` |
| `fable-process-S4-balance-sim-gates.md` | `fable-process-F4-balance-sim-gates.md` |
| `fable-process-N8-narrative-format.md` | `fable-process-F5-narrative-format.md` |
| `fable-process-N5-scenario-saves.md` | `fable-process-F6-scenario-saves.md` |
| `fable-process-N1-balance-cockpit.md` | `fable-process-F7-balance-cockpit.md` |
| `fable-process-N6-play-telemetry.md` | `fable-process-F8-play-telemetry.md` |
| `fable-process-N10-ship-skill.md` | `fable-process-F9-ship-skill.md` |
| `fable-process-N7-taste-bar-enforcement.md` | `fable-process-F10-taste-bar-enforcement.md` |

## TL;DR — the order

| # | Plan | Wave / lane | Why here |
|---|---|---|---|
| F1a·F1b | **mechanical checkpoint** (a) + **PRD ripple tooling** (b, one lane) | Wave 0, alone | Highest meta-leverage; the token migration touches EVERY live plan file, so nothing else may be in flight; `gen-regions.ts` built once for both |
| F2 | **GitHub Actions CI** (Ph1–2) | Wave 0 | Clean-room verify for all later commits; extracts the strip gate BEFORE four plans extend it; the nightly rung F4 needs |
| F3 | **playtest capture inbox** | Wave 1, lane A (DEV tooling) | Owns the shared transport F7 + F8 need; the F-loop is the proven top quality signal |
| F4 | **balance sim gates** | Wave 1, lane B | Machine alarm on the known capstone-pacing hole; isolated territory (`src/sim/`) |
| F5 | **narrative format** | Wave 1, lane C | Content-velocity multiplier + makes R8 readable; isolated territory; Ph1 is Fable work |
| F6 | **scenario saves** | lane A, after F3 | Fixtures are F7's start-states + QA one-liners |
| F7 | **balance cockpit** | lane A, after F3+F6 (F4 done by then) | The tool that fixes the four balance-watch feel items; consumes transport, fixtures, re-verify flow |
| F8 | **play telemetry** | lane A, last | Ph4 needs F3; third pacing leg; DEV-panel touch serialized behind F6/F7 |
| F9 | **/ship skill** | Wave 2 | Self-scored 2/5; composes with F2's extraction |
| F10 | **taste-bar enforcement** | blocked | Placeholder by design — re-plan when taste.md locks (the ⭐ Fable-redo TODO) |

## Ranking by criterion

**Biggest impact on implementing other plans (meta-leverage):**

1. **F1a (checkpoint)** — every later plan adds verify gates (F1b,
   F2, F5, F6) and every later plan eventually flips ✅ DONE: after F1a, the
   gate-roster docs regenerate and archival/queue-reconciliation is one
   command instead of the `docs(queue)`/`chore(repo)` commit class. It also
   fixes the session-brief mis-tag that misreports plan status to every
   session.
2. **F2 Ph1–2 (CI)** — every subsequent plan's commits get clean-checkout
   verification (the shared dirty worktree is exactly where multi-agent
   plan-building goes wrong); the nightly is `verify:balance`'s rung; the
   `verify-dev-strip.sh` extraction must land before F3/F6/F7/F8 each
   extend the marker loop, or four plans edit a file F2 then relocates.
   Ph3 (oxlint/oxfmt) is optional and buys the budget headroom the
   incoming gates (checkpoint, gen-regions, fixtures:check,
   gen-narrative) will spend.
3. **F3 (inbox)** — owns the vite middleware + inbox dir + drain lifecycle
   that F7's export and F8's Ph4 ride. Landing it first deletes both
   plans' "whichever lands first ships the handler" ambiguity.
4. **F6 (fixtures)** — fixtures make every later plan's DoD cheaper to
   drive (`?fixture=` one-liners for cockpit, QA shots, capture repro).
5. **F4 (sim)** — `verify:balance` guards every balance change the cockpit
   produces; personas later feed fixture generation.

**Biggest impact on the game itself:**

- The needle-mover is the **balance cluster**: F4 (measure: the ~30 s
  capstone vs ~85 min intent becomes a machine alarm) → F7 (the human
  actually fixes the four balance-watch feel items in a 10-minute
  session) → F8 (what play *really* costs in attended minutes). F3 feeds
  the whole loop — the F1–F117 feedback record says human playtest capture
  is the highest-ROI signal in the repo.
- **F5 (narrative)** is the biggest *content* lever: story authored as
  text, R8 reviewable as one readable page, and every future tier's
  narrative gets cheaper. Long-term it may out-impact everything above; it
  just doesn't gate anything else, so it runs in its own lane rather than
  first.
- F1, F2, F9 are process-only: near-zero direct game impact, but they
  de-risk and cheapen everything that does have it.

## The trampling map (why lanes exist)

Hot files, by number of plans touching them:

- **`src/app/main.ts` — 5 plans** (F3 overlay mount + tab stamp, F4 Ph3
  `autoStep` extraction, F7 `__qa.balance`, F6 `__qa.loadFixture` +
  `?fixture=`, F8 telemetry wiring). The single hottest collision zone.
- **`src/ui/dev.ts` — 3 plans** (F7 Balance tab, F6 Scenarios tab, F8
  Telemetry section — all grow the same sub-tab bar).
- **`gh-pages.sh` step-1b marker loop — 6 plans** (F3, F6, F7, F8 add
  markers; F2 extracts it; F9 reuses it from a temp worktree).
- **`verify-run.ts` GATES — 5 plans** (F1a extracts to `gates.ts`;
  F1b, F5, F6 append gates; F2 Ph3 swaps the lint entries).
- **`vite.config.ts`** (F3 plugin; F7 fallback transport) and
  **`qa-playtesting.md`** (F3, F4, F6, F7, F8 doc sections).

Consequences:

- **Wave 0 is serial and the F1 lane (F1a→F1b) runs alone** — its
  status-token migration
  edits every live plan's Status line; concurrent builds would collide
  with their own plan files (the no-parallel-build-during-ripple rule).
- **F3 → F6 → F7 → F8 is ONE serialized lane** — they share `main.ts`,
  `dev.ts`, the marker loop, and `qa-playtesting.md`. Never concurrent.
- **F4 and F5 are parallel-safe lanes** (`src/sim/`, content/narrative
  territory). One caveat: F4 Ph3 touches `main.ts` (autoStep
  extraction) — schedule that phase between lane-A items, or accept a
  small rebase.
- GATES appends are one-line list edits — safe across lanes once F1a's
  `gates.ts` extraction has landed.

## Merge verdicts

1. **MERGE the build lane: F1a-checkpoint ⊕ F1b-ripple (remaining
   phases).**
   Both plans name `src/scripts/gen-regions.ts` as shared infrastructure;
   the old "first-lander owns it" clause was exactly the trampling hazard
   when two atomic subagents build concurrently. Resolved by binding, not
   racing: **one builder does checkpoint Phases 1–5 and ripple Ph2–Ph4 in
   the same lane**, checkpoint first, `gen-regions.ts` built once. The two
   docs stay separate (different review surfaces — the ripple plan's Ph2
   edits PRD canon and the human sees that diff); the merge is of the
   *build*, not the files — hence the shared F1 rank, split `F1a`/`F1b`
   in build order. Ripple Ph1 (`prd:drift`) is already built, so the
   remainder is small.
2. **DON'T merge F3 + F7 + F8 into a mega-plan** — ~1,200 lines of
   combined spec is too much for one atomic agent to build without
   compressing quality (R1). The composition contracts are already
   written into each plan; what was missing is a decided order.
   **Resolved: F3 owns the transport, period.** F7 and F8 import it;
   neither ships a handler. (F7 §6b and its risk 6 edited accordingly.)
3. **No merge for the DEV-panel trio (F6/F7/F8)** — each sub-tab is a
   ~20-line addition; serialization inside lane A is sufficient.
4. **F2's `verify-dev-strip.sh` extraction lands before lane A starts**
   so all four new strip markers accumulate in one script instead of
   each editing `gh-pages.sh` and then F2 relocating the loop under
   them.
5. **F9 stays separate and late** — it composes with F2's extraction
   and its own plan scores it 2/5.
6. **F10 stays a placeholder** — merging or scheduling it now would wire
   enforcement against a draft taste.md, which the plan itself forbids.
   Its trigger is the ⭐ "redo taste-distillation with Fable" TODO
   closing.

## Sequencing risks this ordering retires

- The gen-regions double-build (checkpoint vs ripple) — retired by
  merge #1.
- The transport double-build (F3 vs F7) — retired by merge #2.
- Four plans editing a marker loop that F2 then moves — retired by #4.
- F1a's plan-file migration racing other builders — retired by Wave 0
  isolation.
- `main.ts`/`dev.ts` concurrent edits — retired by the lane-A serial
  order.

## What this doc does NOT decide

- Model routing per plan (each plan's "Who builds this" stands; the
  human ratifies).
- Whether F2 Ph3 (oxlint/oxfmt) runs at all — optional, revisit when
  the gate count actually pressures the 5 s budget.
- R-item / taste-call ordering — human-gated, out of scope here.
