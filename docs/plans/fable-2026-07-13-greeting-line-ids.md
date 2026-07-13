# Greeting lines get authored ids, so old saves stop pointing at neighbours

**Status:** 📋 PROPOSED (2026-07-13, session-187)
**Confidence:** ( 90% Opus, 10% Fable ) — a codec/migration fix under a
named ADR limit; no fiction is written, only re-keyed.
**Template:** build

## Who builds this — Fable or Opus?

**Opus.** Descriptor plumbing, a grammar field, a resolver re-route,
and a migration — mechanical throughout. No new voiced text (the lines
themselves are untouched; they only gain ids).

## Why

**ADR-186's own "Known limit", promoted to a build by the human
(2026-07-13 finding walk, H4).** `greeting.<i>` / `stage.<i>` log
descriptors are **positional**: re-ordering a scene's greeting lines in
the narrative `.md` silently re-points an old save's log line to its
neighbour, and the orphaned-id sensor cannot see it (the index still
resolves). The ADR names the fix: authored ids.

**Why now:** the ADR-185 re-voice waves (HR-34/36/37/38, open) are
precisely the class of edit that reorders scene lines — the corruption
risk is live while they land. Evidence:
`project/archive/opus-2026-07-12-adr-embedded-work.md` (H4).

## What exists today

**Survey date: 2026-07-13 (session-187), source-verified.**

- `src/core/content/log-render.ts:80` and `:122` — two resolvers match
  `/^greeting\.(\d+)$/` and index into the scene's line array by
  position.
- The narrative grammar (`src/core/content/narrative/`, FB-5) authors
  greeting/stage lines as ordered prose blocks with no per-line id;
  `gen:narrative` compiles them into `*.gen.ts` registries.
- ADR-186 established keyed descriptors elsewhere; a keyless legacy
  entry rehydrates verbatim (the migration precedent to follow).

## Steps

1. **Ids in the grammar.** Give greeting/stage lines authored ids in
   the narrative `.md` spec (per its README's declared grammar; if
   this exceeds the grammar, prefer extending the grammar over a
   `native:` hatch — ids are data, not logic). `gen:narrative` emits
   them into the registries.
2. **Descriptors carry the id.** New log entries write
   `greeting.<id>`; the resolvers at `log-render.ts:80/:122` resolve
   by id first, falling back to positional for legacy `<digit>`
   descriptors (which rehydrate verbatim per ADR-186 — never re-point
   them).
3. **Migration.** If the save schema needs a bump, follow the v10→v11
   precedent; old positional descriptors stay readable forever
   (fallback), new saves are id-keyed only.
4. **Regenerate.** `gen:narrative` + `fixtures:regen` (the fixtures'
   saved logs change shape); commit generated outputs with the change.

## Verification

- **The test that could not exist before (the point of the plan):** a
  RED-able codec test — re-order two greeting lines in a narrative
  fixture, prove an existing save's log line still resolves to the
  SAME text (fails on main today by construction).
- Round-trip: keyed descriptors survive save→load byte-stable; legacy
  positional entries still render.
- `gen-narrative` gate green (byte-compare); full vitest lane green.
- **Player-reach proof (PH6):** load a pre-change fixture save in the
  live `:5173` build after a line reorder and read the log — the old
  lines show their original text.

## Sync ripple

- **PRD:** none — descriptor keying is below the PRD's altitude
  (§6 already describes the descriptor log per ADR-186; verify no
  sentence names positional greetings — annotate if one does).
- **Story-bible:** none — no fiction changes; ids are invisible to the
  reader.
- **Living docs / registries:** `gen:narrative` outputs +
  `src/fixtures/saves/*.json` regenerate; the narrative README's
  grammar section documents the id field.
- **CHANGELOG:** none — rides the next release's section.

## Human-in-the-loop

- None to file — mechanical save-integrity work, human-ruled in the
  walk. No taste surface, no diverge.
- **Priority note for the human queue:** land this BEFORE (or early
  in) the ADR-185 re-voice waves; each wave that reorders lines
  without it widens the corruption window.

## Non-goals

- **Not re-keying every descriptor family** — only the
  greeting/stage positional class ADR-186 flagged; already-keyed
  families are untouched.
- **Not changing any line's text** — the re-voice waves own that.

## Risks

- **Seam (shared tree):** owns `src/core/content/log-render.ts`, the
  narrative grammar + generator, `src/fixtures/`. The re-voice waves
  (Fable sessions, HR-34/36/37/38) edit the same narrative `.md`
  files — coordinate: ids land first, waves rebase on them.
- **Fixture churn:** regenerated saves touch files co-agents may hold;
  land core change + fixture regen together (crowded-tree protocol).
- **Grammar creep:** keep the id field minimal (a slug per line);
  anything smarter (auto-derived ids from text hashes) breaks on the
  very edits this plan defends against — reject it.
