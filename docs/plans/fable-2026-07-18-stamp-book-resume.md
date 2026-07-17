# Stamp book (E3) — spec, state feed, home, and the look diverge

**Status:** 📋 PROPOSED (2026-07-18, session 211)
**Confidence:** ( 30% Opus, 70% Fable ) — the stamp grammar and the
look diverge are Fable craft; the state feed and DEV wiring are
mechanical.
**Template:** build

## Who builds this — Fable or Opus?

- **E3.1 spec + the stamp grammar (step 1): Fable** — document
  fiction + drawing grammar, the taste-carrying half.
- **State feed + core history audit (step 2): Opus-capable** — pure
  mechanics, but it lands in crowded core files (see Risks), so
  whoever holds the tree that day.
- **The look diverge (step 4): Fable**, one independent pass per
  variant per the diverge skill.

## Why

Graphics concepts **#8 ❤️ + #10**, folded at the 2026-07-08 triage;
the human's verdict on the built demo: **"yeah good, continue later"**
(`docs/living/graphics-concepts.md` EXPLORED row; HR archive). The
register + `src/ui/stamp-book/README.md` both name the resume track:
E3.1 spec + stamp grammar → the home HD-item → ADR-075 diverge →
golden pin + blind-pass → integration. Integration was gated on
storywave **Plan B — which SHIPPED v0.4.0**
(`project/archive/fable-2026-07-07-storywave-game.md`; the A5 closure
note in `project/archive/fable-2026-07-07-storywave-docs.md`), so the
gate is satisfied. Pull-forward: the human's 2026-07-18 ask ("Make a
plan for 2", the overnight-burn triage).

## What exists today

Surveyed **2026-07-18** at `9e2dff3c`:

- `src/ui/stamp-book/book.ts` (513 lines) — `openStampBook()`:
  full-screen modal, seeded-deterministic, Andon tokens, `brush.ts`
  reuse, reads right→left. **Fixture-fed only** —
  `src/ui/stamp-book/fixture.ts` is a static R0–R7 run; it reads no
  game state.
- Reached via DEV panel → Story pane → "⤢ Stamp book"
  (`src/ui/dev/protos-pane.ts:41`). No spec section, no golden pin,
  no blind-pass yet (the README says so explicitly).
- **Unknown, to verify in step 2:** whether the core state records
  the run history the book needs (the day/season of each ascension,
  crisis marks for thread knots). If not, a minimal pure-core record
  is in scope.

## Steps

1. **E3.1 spec** — grow `src/ui/stamp-book/README.md` into the full
   spec on the estate-sheet model: the document fiction (whose book
   is this, whose hand presses each seal — must derive from the
   story bible; the bible wins), the stamp grammar (seal form per
   rung, thread knots at crises, dry passages through lean
   stretches), and the blind-reader rubric. File the spec in the
   HR bundle (step 5) for the human's read.
2. **The state feed** — audit `src/core/state.ts` + the ascension
   reducer for what a run actually records. If ascension
   days/history are already derivable, write
   `src/ui/stamp-book/from-state.ts`; if not, add the minimal core
   record (ascension log kept by the reducer) + persistence
   migration + `pnpm run fixtures:regen` — core change and fixture
   regen land in ONE commit (crowded-tree rule). The fixture file
   stays as the DEV-demo fallback.
3. **The home HD-item** — file the HD the README names: where the
   book lives for a real player. Proposed default (ships DEV-only
   until the HD closes): a Record panel opened from the Character
   tab; alternates: the Progress tab, or the rank-ceremony modal's
   afterglow. Never blocks — the diverge proceeds against the
   default.
4. **The ADR-075 diverge** — 2–3 WORKING look variants behind the
   DEV variants registry (`src/ui/dev-surfaces.ts` row, review-link
   gate kept true): e.g. A · concertina spread (the current
   prototype elevated) · B · one page per rung, thread in the margin
   · C · cover-first ceremonial reveal. Each variant:
   taste-scorecard Pass 2, golden pin, blind pass. Any
   fiction-voiced caption text a variant adds is an ADR-139
   narrative-diverge unit, not a freehand line.
5. **The HR bundle** — one HR item: spec read + per-variant lines +
   how-to-review (`?fixture=rung-R7` → open the book), self-picked
   default named.

## Verification

- **Golden hash pin** per variant (RED on drift; regen deliberate).
- **Derivation test** (vitest, COMMIT lane): the book built from a
  fixture save asserts stamps == rungs reached and knots == recorded
  crises, derived from `rungThreshold`/the ascension record — never
  copied counts (the ambient test rule).
- **Blind pass**: fresh readers grade the book against the spec
  rubric ("which rung was hardest? where was the run lean?");
  report to `project/audit/reports/`.
- **Player-reach (PH6):** until the HD closes, reach = the DEV panel
  drive (capture in the report) — sanctioned prototype-first ground.
  Prod integration is step-gated on the HD + HR closures and ships
  as its own commit with a live-drive capture at `rung-R7`.

## Sync ripple

- **PRD:** none now — a presentation of existing progression. If the
  integrated surface ships, run `/prd-ripple` then (expected class:
  built-system presentation, no §4 edit).
- **Story-bible:** no new canon authored here; the document fiction
  must cite existing bible facts (02-house / 03-tiers). If the
  fiction needs a NEW fact (who keeps the book), that's a story-flow
  addition proposed in the HR, not written into the bible by this
  plan.
- **Living docs / registries:** `graphics-concepts.md` row 8+10
  forward track → this plan; `dev-surfaces.ts` gains the variants
  row (review-link gate).
- **CHANGELOG:** none — no version bump ships here.

## Human-in-the-loop

- **HD** (the home) + **HR** (spec + variant bundle), both filed
  with self-picked defaults so nothing blocks (PH4).
- Taste-scorecard Pass 1 before the diverge; Pass 2 per variant.
- ADR-139 obligation on any fiction-voiced caption text.

## Non-goals

- No emaki story scroll (#13 — separate concept, gated on #12's
  vignette grammar proving out).
- No T1+ stamp content; the book ends at the T0 ladder until the
  next tier ships.
- No achievements/meta system — the book renders the run the game
  already records.

## Risks

- **The core seam is the live one:** step 2 may touch
  `src/core/state.ts`, `src/persistence/migrate.ts`/`validate.ts`
  and regenerate `src/fixtures/saves/*` — exactly the files the
  active talk-system plan holds dirty in this tree right now (git
  status, 2026-07-18). **Step 2 lands only after the talk-system
  session's changes are committed and green**; re-survey before
  starting it.
- Everything else (`src/ui/stamp-book/**`) is unshared ground; the
  `protos-pane.ts`/`dev-surfaces.ts` touches are one-line, pathspec
  committed after a staged-set check.
- Rollback: the book is DEV-gated until the final step; reverting
  any commit restores the prior pin.
