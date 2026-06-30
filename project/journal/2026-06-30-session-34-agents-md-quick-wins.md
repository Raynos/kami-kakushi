<!-- Copy to journal/{YYYY-MM-DD}-session-{NN}[-{topic}].md. ONE file per session. -->

# Session 34 — 2026-06-30 — AGENTS.md quick-win dedup / extraction

**Summary:** Following the AGENTS.md audit, applied the agreed quick wins to shrink
always-loaded context and remove duplication — collapse the attribution section to
a pointer, extract the dir map to a root `repo-map.md` (`@`-included back), trim the
durable-capture + freeze bullets to short forms pointing at their canonical homes,
and stop hard-coding the gate count/roster (a project-status duplication). All
docs; `verify` green (10 gates, incl. `md-links`).

## What changed
- `AGENTS.md` —
  - **Attribution section** → short paragraph + pointer; canonical spec flipped to
    `.claude/rules/commit-message-style.md` (already auto-loaded every session, so
    the inline copy was redundant context).
  - **Layout section** → a 3-line pointer + `@repo-map.md` include (the full dir
    map now lives in `repo-map.md`, editable on its own but still in context).
  - **Durable-capture convention** → short paragraph + pointer to
    `project/brainstorms/raw/README.md` (the canonical two-tier rule).
  - **Freeze = locked intent** → principle + pointer to **D-021** in
    `decisions.md` (dropped the stale current-state parenthetical).
  - **Commit-gate bullet** → stop hard-coding "10 gates [roster]"; point to
    `verify-run.ts` as the single-source roster owner (was duplicating
    project-status / working-agreements and prone to drift).
- `repo-map.md` (**new, root**) — the extracted directory map; root-placed so its
  links stay identical to AGENTS.md's originals (no `../` rebasing). Brainstorms
  entry trimmed to point at the two dir READMEs.
- `.claude/rules/commit-message-style.md` — "Canonical spec" line flipped to name
  itself canonical (AGENTS.md carries the short form).
- `project/brainstorms/raw/README.md` — back-pointer updated: this README is now
  the canonical durable-capture statement (was pointing to CLAUDE.md/AGENTS.md).

## Next intended steps
1. Open question from the human (this thread): a deeper portability-oriented
   reorganization of AGENTS.md — split generic agentic-gamedev guidance from
   kami-specific guidance, reorder sections to flow, and purge any remaining
   project-status duplication. To be written up as a `docs/plans/` proposal for
   sign-off before executing (it touches "how we work" canon).

## Landmines
- The `@repo-map.md` include is a Claude Code memory-import feature, not validated
  by `verify`; confirmed the link target exists + verify-green, but the actual
  transclusion isn't gate-checked. If repo-map.md is renamed/moved, update the
  `@`-line in AGENTS.md.
- repo-map.md sits at repo root (alongside README/AGENTS/CLAUDE) by explicit human
  request — unusual placement, intentional.

---

## Follow-on — lightweight general→specific reorg (same session)

The human declined the bigger `docs/plans/` portable-extraction proposal and asked
instead for a **small in-file reorg** so AGENTS.md flows general → kami-specific.
Done (no prose rewrites, just regrouping):

- Added a one-line **flow note** to the intro (general → specific) and named the
  new section in the Philosophy intro's pointer.
- New **`## Kami-kakushi specifics`** section (was `## Layout`) gathers the
  kami-path-bound bullets moved out of Conventions — **Docs taxonomy**, **Freeze =
  locked intent**, **Temporary files → `./tmp/`** — plus a new **"Live state lives
  in the snapshot, not here"** rule (encodes the human's "don't duplicate
  project-status" point), then the `@repo-map.md` include.
- **Conventions** now holds only the portable engineering/process rules.
- Fixed the two "Docs taxonomy" cross-refs (the session-disposable bullet +
  repo-map.md) to point at the new section. verify green (10 gates).

Net AGENTS.md shape: Philosophy → How to work here → Conventions (portable) →
Kami-kakushi specifics (bindings + repo map) → AI Commit Attribution.
