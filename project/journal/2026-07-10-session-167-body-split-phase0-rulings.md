# Session 167 — 2026-07-10 — body-split plan Phase 0 ruled (ADR-178)

**Summary:** The human asked for all open questions & decisions in the
body-split plan (`docs/plans/fable-2026-07-10-body-split-hunger-stamina.md`)
via AskUserQuestion. The plan's four Phase-0 forks were surfaced in one round
and all four ruled: **Option C** (stamina short-cycle + hunger daily-cycle),
display names **Body 体 + Belly 腹**, hunger **only slows in T0** (starvation
consequences allowed T1+), and the FB-343 food verbs **re-home to the
Inventory tab** once Schedule A (ADR-177) lands. Transcribed as **ADR-178**;
plan Status flipped to PHASE 0 RULED. Docs-only session — nothing built.

## What changed
- `docs/living/decisions.md` — appended ADR-178 (the four rulings + why +
  consequences).
- `docs/plans/fable-2026-07-10-body-split-hunger-stamina.md` — Status line →
  ✅ PHASE 0 RULED; Phase 0 bullet rewritten as the ruled record.

## Next intended steps
1. Phase 1 (core model, test-first — Opus-safe per the plan's routing): the
   new `hunger` store + drain/refill in `step.ts`/`intents.ts`, selectors,
   save-schema migration, invariants test (ADR-088 lane).
2. Phase 2 (UI two-bar header, taste-scorecard both passes) after Phase 1.
3. Phase 3 (ADR-132 balance verdict, telemetry step 0) last.

## Landmines
- The Inventory re-home (ruling 4) depends on Schedule A's R4 Inventory tab
  (ADR-177 Phase 2) landing first — until then eat/cook stay zone actions.
- Bar names are canon NOW (FB-334's law): any interim UI text touching the
  satiety readout should already say Body 体, and Phase 2 must not surface
  internal field names.

## Phase 1+ — the body split built (core model, same session, 2026-07-11)

The human said "build the whole plan" after ruling Phase 0, so the ADR-178 core
model landed next (Phases 2–3 follow):

- **Core:** `character.hunger` (0..HUNGER_MAX, flat cap) joins satiety;
  `adjustHunger` lives in `state.ts` so `step.ts` feeds it acyclically. The day
  boundary drains `HUNGER_PER_DAY`, then the existing kura ration
  (CONSUMPTION_SHO_PER_DAY) restores `HUNGER_MEAL_RESTORE` pro-rated by what
  the kura served — a stocked kura MAINTAINS the belly; famine is felt.
  `eat_rice` → belly (EAT_RICE_HUNGER; satiety untouched — the FB-345 split);
  `cook_meal` keeps its HP mend + adds COOK_HUNGER_RESTORE. The teeth:
  `restQuality`/`restRefill` selectors (flat ≥ HUNGER_FLAT_ABOVE, floor
  HUNGER_REST_FLOOR — slows, never blocks); the `rest` reducer routes through
  `restRefill` (AC-6 — the forecast reads the same selector).
- **Persistence:** additive hydration (`numAdditive` → COLD_OPEN_HUNGER) — no
  schema bump, no false "mended" notice; save.test.ts proves the pre-split-save
  path.
- **Tests:** `src/core/body-split.test.ts` (15 — drain/ration/pro-rating/
  clamps/split/teeth, all fixture values derived from balance constants);
  economy.test eat_rice describe rewritten to belly semantics; invariants test
  asserts the hunger clamp band across the full arc.
- **Lever rename:** EAT_RICE_SATIETY → EAT_RICE_HUNGER (cockpit lever + guard
  updated). A deprecated `EAT_RICE_SATIETY` alias remains for render.ts's two
  display reads (co-edited by other sessions) — the Phase-2 belly-UI commit
  deletes both reads and the alias.

### Shared-tree discipline (why this commit is shaped oddly)

Four of my files (`intents.ts`, `index.ts`, `selectors.ts`,
`economy.test.ts`) were co-edited in-flight by the estate-p1 (ADR-177 works)
and story-fixes (FB-362 intro titles) sessions, whose WIP depends on their own
uncommitted files — a pathspec commit would have swept a red HEAD. So: crafted
HEAD+my-hunks blobs for those four, proved the EXACT commit content green in an
isolated worktree (`git worktree` at 0bb3b0b7 + my files only:
**18/18 gates, VERIFY_FULL, 80s**), staged blob-precise via
`git update-index --cacheinfo`, and committed with `SKIP_VERIFY=1` (the shared
tree was red from the co-agents' WIP — their estate/works/map tests, not mine).
Fixtures + gen-docs artifacts were regenerated INSIDE the worktree so they
embed no co-agent WIP content. Same pattern w2:p5 used for 0bb3b0b7 this hour.

## Next intended steps (updated)

1. Phase 2 — the belly bar UI (render.ts) once the estate-p1/story-fixes WIP
   lands (render.ts is theirs right now); taste-scorecard Pass 1 before, Pass 2
   after; delete the EAT_RICE_SATIETY alias in the same commit.
2. Phase 3 — telemetry step 0 → `verify:balance` → `balance:report` → commit
   the regenerated `docs/content/t0-pacing.md` (ADR-132).
3. `/prd-ripple` for the vitals-model system change.

## Phases 2–3 — the belly UI + the balance verdict (2026-07-11)

- **Phase 2 (UI):** the belly bar joined the header vitals as the FB-345
  two-bar group — the exact body idiom (column vital, 110px bar, quiet
  `cur/max` number, hover name "Belly 腹"), a warm rice-straw fill (distinct
  from body's verdant + life's silver), revealed WITH `readout-stamina`, low
  flag exactly when `restQuality < 1` (AC-6). Eat/cook/rest hover titles +
  the DEV act-cards re-derived from the new selectors (`restRefill` forecasts
  the true degraded rest). Verified headless against the live :5173 server
  (screenshot: body 100/100 · belly 60/100). Taste Pass 2: all briefed
  constraints held (one idiom · build-once/patch · complete-or-absent ·
  fiction-carrying hover · exact numbers); no blind spots.
  Shared-tree wrinkle: the estate session's `b3921564` swept my in-flight
  render.ts belly hunks into ITS commit (green — my Phase-1 exports were
  already in HEAD); `26bb9ac7` landed the remaining CSS + test + alias
  removal, again worktree-proven (18/18 at ba36efdc).
- **Phase 3 (ADR-132):** telemetry step 0 — 6 reports read; only R0 has an
  attended rung row (23.6 min vs sim 4.3, the known read-the-story gap) and
  none cover the eat_rice loop, so no attended-pacing conclusion applies to
  the split. `verify:balance` GREEN (3 personas × 5 seeds); `balance:report`
  byte-identical (fingerprint 5ea9892eb4fa0ace) — **the split moved no T0
  pacing** (by design: Option C left the act economy untouched; the kura
  ration maintains the belly on the same rice sink that already existed).
  Nothing to re-tune; no t0-pacing.md diff to commit.
- **Ripple:** PRD §2.3 rewritten to the two-store model (+ index row + two
  §2.4/§2.6 cross-refs); ui-design §5.3 vitals paragraph now names all three
  vitals and the shared idiom; `prd:drift` CLEAN. fun-factor.md untouched —
  the push-your-luck idle read is unchanged (rest still free, work still
  satiety-priced).
- **Plan:** Status → ✅ DONE, archived to `project/archive/`.
- **Left open:** the FB-345/FB-334/FB-335 r1-lane sidecars still owe their
  drain stamps (the r1 lane is claimed by another session — theirs to stamp).
