# Session 61 — 2026-07-03 — session-brief: leading-token plan status parse

**Summary:** Fixed a cry-wolf bug in `src/scripts/session-brief.sh` — it tagged
a plan DONE (nudging archival) whenever the Status line contained
`done|complete|shipped|✅` *anywhere*, so a `✅ LOCKED` plan (ratified but
unbuilt) got mis-tagged every session, as did the master plan once its Status
gained a mid-line word "DONE". The brief now classifies by the **leading status
token** (the word right after `Status:`, glyph skipped), and only a DONE-class
token (done/complete/shipped/superseded/archived) means archivable. Defined the
Status-line vocabulary in `docs/plans/README.md`; reconciled the master plan +
annotated F1a (which scopes the fuller machine-token migration).

## What changed
- `src/scripts/session-brief.sh` — replaced the substring match
  (`grep -qiE 'done|complete|shipped|✅'` on the whole Status line) with a
  leading-token parse: strip `**` + the `Status:` label + the leading glyph,
  take the first `[A-Za-z]+` word, and DONE-class it against
  `^(done|complete|completed|shipped|archived|superseded)$`. The glyph is
  decoration; a mid-line "done" is never examined. Updated the block comment.
- `docs/plans/README.md` — new **Status-line vocabulary** section: the canonical
  leading tokens (DONE/COMPLETE/SHIPPED → graduate; SUPERSEDED/ARCHIVED →
  graduate; LOCKED → stays active; IN PROGRESS/ACTIVE/BUILDING, DRAFT/PROPOSED,
  BLOCKED/PLACEHOLDER → active) and the rule the brief enforces (only a leading
  DONE-class token is archivable; a ✅ glyph or a mid-line "done" is NOT signal).
- `docs/plans/fable-process-master-plan.md` — reworded the Status parenthetical
  so it's accurate under the new rule (leading token stays 🔧 IN PROGRESS; the
  mid-line "DONE" is not the signal). Includes the human's uncommitted
  `🔧 IN PROGRESS` edit from the working tree.
- `docs/plans/fable-process-F1a-mechanical-checkpoint.md` — annotated §0.6 (the
  bug's receipt): this targeted fix landed ahead of F1a, don't redo it; F1a's
  Phase 5 machine-token vocabulary still stands.

## Next intended steps
1. F1a's Phase 5 will re-parse whatever closed machine-token vocabulary the
   checkpoint tool lands — this fix is compatible (same leading-token concept).

## Landmines
- `docs/plans/README.md` still ends with a stale "(No active plans right now…)"
  closer — deliberately left; F1a §2.1's generated `active-plans` region owns it.
- README.md itself lists as ▶️ active in the brief (no Status line → not
  DONE-classed). Pre-existing behavior, unchanged by this fix; F1a will exempt
  the README when it formalizes the token vocabulary.
- The parser also treats a leading `SUPERSEDED`/`ARCHIVED` token as archivable
  (matches F1a §2.2's auto-archive set); the task named DONE/COMPLETE/SHIPPED —
  no current plan uses SUPERSEDED, so today's output is identical either way.
