# Shard decisions.md into banded files behind a prd-style index

**Status:** ✅ DONE (2026-07-13, session 199 — byte-identical
reconstruction proven against HEAD; 195 entry headings preserved;
deferred-work gate proven RED-able on a band; `tree-claim.ts adr`
reads its high-water from the bands)
**Confidence:** ( 80% Opus, 20% Fable ) — a content-preserving
mechanical transform with a machine-checkable diff; judgment was
spent in ADR-196.
**Template:** ops

## Goal

`docs/living/decisions.md` is the #4 hot file (126 commits, 28
cross-scope rapid re-touches) and 4,070 lines / 224 ADR headings —
every ADR write rewrites one giant file, and agents load 4k lines
to read one ruling. **ADR-196 §5** (human's own proposal, grill
capture
[2026-07-13-multi-agent-contention-fixes.md](../../project/brainstorms/2026-07-13-multi-agent-contention-fixes.md)
Q7): shard it into `docs/living/decisions/` band files —
`000.md` (ADR-001–049), `050.md`, `100.md`, `150.md`, … — with
`decisions.md` remaining as the prd-style index (precedent:
`docs/living/prd.md` + `docs/living/prd/`). Verified this session:
**zero** `#adr-N` anchor deep-links exist anywhere; 313 files
reference `decisions.md` by plain path, which keeps resolving.

## Go conditions

- `git status docs/living/decisions.md` clean — no co-agent
  mid-ADR write (check herdr peers; announce before starting).
- The locks plan's `adr` claim lane
  ([fable-2026-07-13-contention-locks.md](fable-2026-07-13-contention-locks.md))
  ideally landed first (nice-to-have, not blocking — the shard
  works without it).
- No backup needed beyond git — the transform is verified against
  HEAD before commit.

## Procedure

1. **Survey script consumers.** `grep -rn "decisions.md"
   src/scripts/ .githooks/ .claude/` — any gate/script that READS
   the file (e.g. the `deferred-work` gate, session-brief) gets
   its read path widened to `decisions.md` + `decisions/*.md` in
   the same commit. List findings in the commit body.
2. **Cut the bands.** Create `docs/living/decisions/000.md`,
   `050.md`, `100.md`, `150.md` (~1k lines each): each opens with
   a one-line header naming its ADR range + a pointer back to the
   index; ADR entries move VERBATIM (append-only record — no
   rewording, PH: the record is lossless).
3. **Rewrite `decisions.md` as the index:** the existing preamble
   (numbering norms, ADR-146/148 gap note) + a per-band TOC (band
   file → ADR range → the handful of governing ADRs called out,
   e.g. ADR-022). New ADRs append to the NEWEST band; the index
   states the rule.
4. **Verify content-preservation (AC-15):** `cat` the preamble +
   bands in order, `git diff --word-diff --no-index` against
   HEAD's `decisions.md` — the only acceptable diffs are the band
   headers/TOC scaffolding; assert output is NUL-free; count by
   characters. Paste the check into the commit body.
5. **Ripple the two always-loaded maps:** `docs/repo-map.md` +
   AGENTS.md lines that describe `decisions.md` gain the dir; the
   `write-plan` guide / templates that cite it need no change
   (path unchanged for the index).
6. **Commit by pathspec** (index + bands + script edits + journal
   + this plan's Status flip), announce via herdr so co-agents
   append new ADRs to `decisions/150.md`, not the index.

## Verification

- The Step 4 word-diff: could go RED on any lost/reworded ADR
  line — that is the whole check, run before commit and quoted in
  the commit body.
- `pnpm run verify` FULL green (proves no gate read-path broke —
  the `deferred-work` gate still finds its markers).
- `grep -c "^### ADR-" docs/living/decisions/*.md` sums to the
  pre-split count (224).

## Sync ripple

- **PRD:** none — process/doc layout, no game change.
- **Story-bible:** none — no fiction.
- **Living docs / registries:** repo-map.md + AGENTS.md per
  Step 5; no gen registries read decisions.md.
- **CHANGELOG:** none — no version bump.

## Aftermath

- herdr announce: "new ADRs go in `docs/living/decisions/150.md`
  (or the current newest band); `decisions.md` is now the index."
- Journal entry; plan Status → ✅ and archive to
  `project/archive/` per checkpoint flow.
- Later (locks plan): the index gate can add a duplicate-ADR-
  number check across bands (sound content invariant).

## Risks

- **Seam:** owns `docs/living/decisions.md` +
  `docs/living/decisions/` (new) + any script whose read path
  widens (Step 1). decisions.md is the #4 hot file — do the cut
  in a quiet moment, clean `git status` on it, single sitting
  (<1 h). Live plans (sickroom / merchant / dialogue-live-swap)
  cite ADRs by number in prose only — unaffected.
- A co-agent landing an ADR mid-transform = merge pain on a 4k-
  line file — hence the Go condition + announce.
- Scripts with a hardcoded `decisions.md` path missed by Step 1's
  grep: caught by FULL verify (Step 4/Verification) going red, or
  by the gate simply not firing — mitigate by grepping `.github/`
  workflows too.

## Who builds this — Fable or Opus?

Opus. Mechanical, diff-verified, single sitting. Fable adds
nothing here; the taste calls (band size, index shape) are already
locked in ADR-196.
