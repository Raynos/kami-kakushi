# 2026-07-14 · session 205 — the reading queue was rotting invisibly

## What happened

The human asked what was in their reading queue; the session brief
said "all read & signed off ✅" while `project/todo-human.md` actually
held two live entries plus a pile of debris. Two independent bugs
stacked:

1. **Entry-removal rot in `todo-human.md`.** Past sessions clearing
   queue entries deleted only the first few lines of each wrapped
   multi-line entry, leaving orphaned tails (`satiety-only)`, the
   story-take rationale fragment, the re-voice plan's description with
   its link line gone). Three `[x]` archived entries also sat in place
   despite the header's own "closed items are removed, not struck"
   rule, and two live-looking entries were stranded *below* the
   "what belongs here" blockquote.
2. **The brief's parser couldn't see wrapped entries at all.**
   `section_items()` in `src/scripts/session-brief.sh` matched only
   the one-line `- [ ] item` form; every entry written in the
   72-char-wrapped style (`- [ ]` alone, text on the next line) was
   silently invisible — so the queue read as empty regardless.

## What changed

- `project/todo-human.md`: reading queue rebuilt clean — kept the two
  genuinely-open items (the quest-shapes brainstorm; the T2 rungs+fog
  plan, moved back above the blockquote); removed the three `[x]`
  archived entries, all orphan fragments, and the archived re-voice
  plan's remains (its owed bits live as HR-34/36/37/38).
- `src/scripts/session-brief.sh`: `section_items()` now also handles
  the wrapped checkbox form, so wrapped queue entries surface in the
  brief. Verified: the brief now lists both entries.

## Next intended steps

- None specific to this fix. The deeper norm for future sessions:
  when clearing a wrapped queue entry, delete the WHOLE entry (all
  its continuation lines), and delete rather than tick.

## Part 2 — teeth, so it can't rot again

Two follow-ups on the human's ask ("fix session-brief; fix the
process to keep todo-human tidy"):

- `session-brief.sh` `section_items()` now JOINS an entry's wrapped
  continuation lines into one output line — the brief carries the
  whole entry (link + description), not just its first physical line
  (the printWidth TODO used to truncate at "when all the agents").
- New **`human-todo` verify gate** (`verify-human-todo.ts`, gate #21):
  REDs the four observed rot patterns in `todo-human.md`'s TODO +
  Reading-queue sections — ticked `[x]` entries, orphan fragments
  from part-deleted wrapped entries, links into `project/archive/`,
  and plain non-checkbox bullets (invisible to the brief). Blockquote
  lines exempt (never cries wolf on the header/footer prose). Proven
  RED-able against the actual pre-cleanup file (19 hits) and green on
  the clean one; takes an optional path arg so the RED case stays
  provable.

## Part 3 — the printWidth flip (100 → 80)

The human called the tree quiet and green-lit the parked TODO: flipped
`.oxfmtrc.json` `printWidth` 100 → 80 and `.editorconfig`'s code
`max_line_length` to match, then `pnpm run format` (~320 files, pure
mechanical reflow) in the same commit so the `oxfmt` gate never sees a
red window. Two ripples the reformat itself caused: `log-lines.ts`
needed a second format pass, and `docs/content/ui-tokens.md`
regenerated via `pnpm run gen:docs`. Full verify green (21 gates).
TODO entry removed as done.
