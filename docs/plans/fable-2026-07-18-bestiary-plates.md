# Bestiary plates — the drawn field guide (#4)

**Status:** 📋 PROPOSED (2026-07-18, session 211)
**Confidence:** ( 25% Opus, 75% Fable ) — creature silhouettes under
stroke discipline are the highest slop-risk drawing on the slate; the
spec and the judging are the plan's center of gravity.
**Template:** build

## Who builds this — Fable or Opus?

- **Spec + plate grammar + craft rounds (steps 1–2, 4): Fable** —
  whether a code-drawn kejōrō reads as a creature or a blob is pure
  taste-adjacent craft.
- **DEV surface + variant wiring (steps 3, 5): either.**
- **Blind-pass readers: fresh-eyes subagents**, model inherited
  (D-124).

## Why

Graphics register **#4** (PARKED SOON): *"Bestiary field-guide
plates — the HR-5 panel, elevated"*; home CONFIRMED as the Combat-tab
Bestiary panel. The pitch
(`project/brainstorms/2026-07-08-novel-graphics-directions.md:73`):
each creature as a naturalist's survey sketch — silhouette built from
the map's primitive discipline, annotation callouts, habitat note,
"sighted at" cross-reference; fiction: *"a scholar the house pays
sketches what the night brings"*; machinery: the exact loop the map
proved (spec § → rubric → blind pass — *"can a cold reader tell the
kejōrō plate from the nure-onna plate?"*), with **AC-6**: the drawn
threat marks derive from the same stats the fight uses. The shelf's
queue condition ("behind the top 3") is satisfied — the explore slate
ran to completion 2026-07-08. Pull-forward: the human's 2026-07-18
ask ("Make a plan for bestiary plates", the overnight-burn triage).

## What exists today

Surveyed **2026-07-18** at `9e2dff3c`:

- **HR-5 is OPEN** — three working panel variants live behind the DEV
  toggle (`src/ui/dev-surfaces.ts:220`): `bestiary-a` field-guide
  cards (default, shipped) · `bestiary-b` danger ledger ·
  `bestiary-c` 図鑑 scroll, whose "portrait" is a KANJI mark that
  inks in once faced — no drawing anywhere yet.
- All variants feed from one derivation, `bestiaryEntries(state)`
  (`src/ui/dev/variant-renderers.ts:299`; A ships inline in the
  combat render).
- The foe registry: `src/core/content/enemies.ts` — per foe: kanji
  (川鼠 · 狸 · 穴熊 · 猿 · 猿王 · 野犬 · 内鼠 · 貂 · 狼 …), the tell,
  its one map node (`area`), and the combat stats.
- The drawing toolkit: `src/ui/map-sheets/brush.ts`; the
  estate-sheet precedent for a module-local spec + golden pin +
  blind-pass loop (`src/ui/estate-sheet/README.md`).
- Prototype-first precedent: estate-sheet and stamp-book both built
  DEV-only without a pre-read HR — plates are NOT map-sheets work
  (they reuse brush code without extending `map-spec.md`), so the
  map skill's spec-first-then-human-reads law does not bind here;
  the spec and the plates go to the human TOGETHER (step 5).

## Steps

1. **The spec** — `src/ui/bestiary-plates/README.md`: the document
   fiction (whose hand draws — PROPOSED, not canon: Sōan's
   night-book, the physician who already keeps a book that "enters
   you in it the same as the mule"; the human rules in the HR, and
   ADR-139 governs any voiced text), the plate grammar (silhouette
   stroke budget per foe, one weight, annotation callouts,
   measurement marks, habitat + sighted-at line derived from
   `area`), the unfaced state (hatched blank plate — scout by
   fighting), and the rubric (cold reader names each faced foe from
   its silhouette; tells read; threat marks match the stats).
2. **The drawing module** — `src/ui/bestiary-plates/plates.ts`:
   `drawPlate(enemyId, seed, faced)` — deterministic, Andon tokens,
   fed ONLY by `enemies.ts` + the same pure-core combat-stats fn the
   fight forecast uses (AC-6 at the ink layer); golden hash pin.
3. **The contact-sheet DEV surface** — one `protoBtn` in
   `src/ui/dev/protos-pane.ts` ("⤢ Bestiary plates"): every foe,
   faced AND unfaced states, at panel scale + enlarged.
4. **The blind pass** — a Workflow of ≥3 fresh readers: name each
   faced foe from its plate alone; read each tell; report to
   `project/audit/reports/`. Iterate craft until the rubric holds —
   **two rounds max** (see Risks).
5. **The ADR-075 fork into HR-5** — wire plates as a DEV-only
   OPTION on the open review: a `bestiary-d` variant (plates as the
   panel) via `dev-surfaces.ts` + `variant-renderers.ts`, and note
   that a winning `bestiary-c` could instead adopt plates in its
   portrait slot. Append a dated HR-5 addendum (ids stable, never
   renumber — ADR-192). The pick stays the human's; the shipped
   default does not change in this plan.

## Verification

- **Golden hash pin** on the plate set (RED on drift).
- **Blind-pass report** with the named pass bar from the spec
  (proposed: every faced foe named by ≥2 of 3 cold readers, tells
  matched — RED-able, and failure is a recordable verdict).
- **AC-6 test** (vitest, COMMIT lane): the plate's threat-mark tier
  is derived from the same combat-stats fn the forecast uses —
  RED if a hand-copied threat table sneaks in.
- **Player-reach (PH6):** the DEV contact sheet driven live
  (capture in the report); if `bestiary-d` wires in, a live
  Combat-tab drive at `?fixture=rung-R3` behind the DEV toggle.
  Nothing ships to prod until HR-5 closes with a plates verdict.

## Sync ripple

- **PRD:** none until a plates variant ships (then `/prd-ripple`;
  expected class: presentation of an existing system).
- **Story-bible:** none by this plan — the scholar/night-book
  fiction stays a PROPOSAL inside the spec, flagged as non-canon;
  adopting it is the HR's call and lands via the story flow
  (ADR-139) as its own unit.
- **Living docs / registries:** `graphics-concepts.md` row 4 →
  this plan; `dev-surfaces.ts` bestiary row grows variant d (the
  review-link gate keeps HR-5 ↔ toggle true both ways).
- **CHANGELOG:** none — no version bump.

## Human-in-the-loop

- **HR-5 addendum** (spec + plates + the d-option), one coherent
  bundle — never a new competing review item.
- Taste-scorecard Pass 1 before drawing (P2 intentionality · TST3
  the fiction owns the document · TST4 unfaced-vs-faced readable at
  a glance); Pass 2 on the built plates.
- **ADR-139:** plate field-note PROSE (if any variant carries it) is
  fiction-voiced → 3+ blind takes; annotation MARKS and derived
  stat/habitat lines are mechanical, exempt.

## Non-goals

- No variant pick, no change to the shipped bestiary default.
- No new foes, no combat-mechanics changes, no bestiary data model
  changes — plates render what `enemies.ts` already knows.
- No plates for unfaced foes beyond the hatched blank (no spoilers).

## Risks

- **Highest slop risk on the slate** — creature illustration is
  exactly where "drawn by code" collapses into blobs. Kill switch:
  if the blind pass can't clear after two craft rounds, PARK with
  the report as the verdict record (REFERENCE tag in the register),
  exactly like the scene-cards precedent — don't force it.
- **Seam:** new dir `src/ui/bestiary-plates/**` is unshared; shared
  touches are one line in `protos-pane.ts` + the `dev-surfaces.ts` /
  `variant-renderers.ts` rows (step 5 only). Check herdr peers +
  the staged set before each commit; the active talk-system plan
  owns `src/core/content/*` — this plan only reads `enemies.ts`.
- Rollback: everything is DEV-gated; reverting the step-5 commit
  removes the option cleanly (review-link gate proves the HR text
  and toggles stay consistent).
