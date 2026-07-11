# Sync the PRD's rung-meter prose to the shipped ADR-137 requirements model

**Status:** 📋 PROPOSED (2026-07-11, session-179)
**Confidence:** ( 20% Opus, 80% Fable ) — the per-hit frontier-vs-shipped
classification is canon judgment; the rewording itself is mechanical once
classified.
**Template:** ops

## Goal

This is the sole remainder from the session-179 `/prd-ripple`
(`2a678bda`, journal `2026-07-11-session-179-prd-ripple-arriveat.md`).
That ripple synced §6's shipped-architecture prose to the ADR-137
requirements model (FB-121: the meter/threshold/storyGate AND-gate is
DELETED; a rung promotes when its authored hidden requirement list in
`content/requirements.ts` is 100% done) — verified against the build:
no `rungMeter`/threshold survives anywhere in the rank code.

But the rest of the PRD still speaks the old language. Surveyed
2026-07-11 against the working tree at `2a678bda`:

- ~90 candidate `rung-meter` / `AND-gate` lines across
  `docs/living/prd/01-vision.md` (14) · `02-systems.md` (25) ·
  `03-unlock-ladder.md` (16) · `04-combat-balance.md` (19) ·
  `06-tech-architecture.md` (7 remnants) · `07-roadmap-scope.md` (9).
- NOT all are drift: §6's progression-state table rules "the two-meter
  `ranks[tier]` shape is T1+ frontier", and §4 already annotates some
  of it (e.g. `04-combat-balance.md:342` "Levers (T1+ frontier)").
  Frontier prose is *supposed* to lead the build (prd-ripple Q1).
- A cold reader of §2.15/§3.0.1/§4.1.1 today, though, reads the
  meter/AND-gate as how the SHIPPED T0 game promotes. It is not
  (ADR-137). That mis-description is the drift to fix — agent-safe
  text-sync per ADR-168 ("where the PRD describes a game that no
  longer ships, fixing it is the system/narrative class").

Record: FB-121 · ADR-137 (the requirements model) · ADR-168 (PRD never
frozen, text-sync agent-safe) · session-179 journal ("Deliberately NOT
touched" names this exact pass). The scoping of the sweep itself is
agent-proposed — the human asked for this plan (2026-07-11).

## Go conditions

- **No human sign-off needed to start** — text-sync of built territory
  is agent-safe (ADR-168). HARD STOP inside the work: if any hit turns
  out to be intent-level (the meter is load-bearing vision, not just
  stale description), stop and file an HD-item rather than self-decide.
- **Seam check at start-of-work:** re-confirm no live plan or herdr
  peer has `docs/living/prd/*.md` in flight (at survey time: the
  narrative-revoice plan owns narrative sources, the save-format plan
  owns save code — neither touches the PRD; w1's wait-day design may
  eventually ripple §2/§4, so announce this sweep to w1 before step 2).
- Working tree at/after `2a678bda` (the §6 sync this builds on).

## Procedure

1. **Inventory & classify (the judgment step).** Grep all six section
   files for `rung-meter|rungmeter|rung meter|AND-gate`; classify every
   hit into exactly one of: **T0-SHIPPED-DESC** (describes the shipped
   game → reword), **T1+FRONTIER** (forward design → keep, annotate if
   a cold reader would misread it as shipped), **ALREADY-OK**
   (documented-rename / already-annotated lines). Write the inventory
   to `tmp/rungmeter-inventory.md` (git-ignored scratch); it is the
   worklist for steps 2–4 and the evidence for the Verification claim.
2. **Reword T0-SHIPPED-DESC hits, one commit per section file**
   (docs-only lane, `SKIP_CODE_VERIFY=1`, explicit pathspec). The
   replacement phrasing mirrors §3:57 / §6's synced rows: authored
   hidden requirement list, 100% done readies the player-triggered VN
   beat, player reads a rounded % bar. §4 magnitudes stay untouched
   (sim-owned, ADR-168 — this sweep moves ZERO numbers).
3. **Annotate kept T1+FRONTIER prose** where misreadable — a short
   parenthetical "(T1+ frontier — shipped T0 promotes on the ADR-137
   requirement list)" in the pattern §4:342 already uses. §4.1.1 ("the
   rung-meter accrual law") is the big one: re-head it as the T1+
   frontier lever-spec it now is; its T0-describing rows reword per
   step 2.
4. **Explicitly consider and reject the drift-scanner teeth.** Do NOT
   add `rung-meter` to `prd-drift.ts`'s retired terms — the surviving
   frontier prose would make it cry wolf permanently (AC-11: a gate
   that can't hold soundly stays a norm). Record the rejection in the
   closing journal so the question doesn't recur.
5. **Close out:** `pnpm run prd:drift` + full `pnpm run verify` green →
   journal entry + snapshot → push `main` → flip this plan's Status and
   archive it (checkpoint handles the move).

## Verification

- **Re-grep proof (could go RED):** after steps 2–3, the step-1 grep
  over the six files returns ONLY hits classified T1+FRONTIER-annotated
  or ALREADY-OK — zero unannotated meter/AND-gate lines describing the
  shipped game. The inventory file is the checkable baseline.
- `pnpm run prd:drift` CLEAN and the `gen-prd-regions` gate green after
  every per-section commit (regions must not be edited by hand).
- **Content-preserving transform check (AC-15):** review each section's
  change as `git diff --word-diff` TEXT mode; the diff must show only
  prose rewording/annotation — no table-row deletions, no number edits.
- No player-reach proof — docs-only ops, no runtime surface (PH6 n/a).

## Sync ripple

- **PRD:** the object of this plan (§1/§2/§3/§4/§6/§7 prose sync).
- **Story-bible:** none — the meter/requirements distinction is
  mechanics altitude; no fiction text changes.
- **Living docs / registries:** none — ADR-137/ADR-168 already record
  the why (no new ADR; the journal notes step 4's rejection). No
  balance/content magnitudes move, so no ADR-132 pacing report.
- **CHANGELOG:** none — no version bump ships this.

## Aftermath

- Closing journal entry (inventory summary + the step-4 rejection),
  snapshot regen, push.
- Tell w1 (wait-day design) the sweep landed, so any §2/§4 ripple it
  later writes starts from the new phrasing.
- Plan archives to `project/archive/` at DONE.

## Risks

- **Over-deleting frontier canon** — the sweep's one real landmine.
  Mitigation: classification inventory FIRST (step 1), annotate-don't-
  delete as the default for anything ambiguous, and the intent-level
  hard stop in Go conditions.
- **Seam:** this plan owns `docs/living/prd/*.md` prose (not the
  gen-regions) for its duration. In-flight neighbours at survey time:
  `fable-2026-07-11-t0-narrative-revoice` (narrative sources — no
  overlap), `fable-2026-07-11-save-format-streamline` (save code — no
  overlap), w1's wait-day work (possible future §2/§4 ripple —
  announce before step 2, land this sweep first).
- **Rollback:** one commit per section file → `git revert` per section;
  no generated files move.

## Who builds this — Fable or Opus?

- **Step 1 (classify)** is where the judgment concentrates — reading
  each passage against ADR-137/§6 canon and ruling shipped-vs-frontier.
  Fable.
- **Steps 2–5** are mechanical once the inventory exists; Opus could
  execute them from the inventory, but the work is small enough that
  splitting sessions costs more than it saves. Default: one Fable
  sitting. ( 20% Opus, 80% Fable )
