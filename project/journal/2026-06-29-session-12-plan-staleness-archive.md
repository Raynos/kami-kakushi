# Session 12 — 2026-06-29 — path-to-v0.3 staleness reconcile + archive completed plans

**Summary:** Human asked whether `path-to-v0.3.md` had gone stale. It had — 3 of its 4 gated blockers
(op-model **D**, roadmap **C**, the PRD-**split** sub-step of **B**) had all cleared since it was written,
leaving only **B's content ripple → E the build**. Refreshed the plan to reflect that, **archived** the two
now-complete plans (op-model v2 FINAL, roadmap re-axe proposal), fixed all cross-refs, and **simplified the
human reading queue** down to the two docs still needing sign-off.

## What changed
- `docs/plans/2026-06-29-path-to-v0.3.md` — added a session-12 status-refresh banner; marked **D done**
  (op-model v2 FINAL) + the **PRD-split done** in §1/§2; rewrote §3 gates + §6 next-steps to the real
  **ripple → build** sequence (annotate-don't-delete).
- `project/status/pending-prd-changes.md` — ticked the **⓪ PRD-SPLIT** "DO FIRST" checkbox (shipped `303a63f`,
  was stale at `[ ]`). 37 content-ripple items remain.
- **Archived** (the two plans were already in `project/archive/` at HEAD but stray working copies lingered in
  `docs/plans/` — `git mv` reconciled it + added ARCHIVED banners):
  - `project/archive/2026-06-29-operating-model-v2-final.md` — ARCHIVED (executed session-09); fixed internal
    links (sibling-relative now).
  - `project/archive/2026-06-29-roadmap-reaxe-proposal.md` — ARCHIVED (promoted session-11); fixed internal links.
- Cross-ref fixes for the moved files: `docs/living/decisions.md`, `docs/living/roadmap.md`,
  `docs/content/t1-content.md`, `docs/content/t2-content.md` (`../plans/…` / `docs/plans/…` → `project/archive/…`).
- `project/docs-to-read-for-human.md` — **simplified to a terse live queue**: removed the done/read entries
  (roadmap ✅ promoted, op-model ✅ built) + the foundation/map sections; only the 2 sign-off-pending docs remain
  (path-to-v0.3 + pending-prd-changes).

## Next intended steps
1. **R1** + the human's **extra PRD feedback** (both still on the human) — feedback unblocks B.
2. **B — the content ripple** (Workflow per `pending-prd-changes.md`, 37 items) → regen + verify.
3. **E — the build**, spine-first.

## Landmines
- `docs/plans/` now holds **only** `path-to-v0.3.md`; the other two are in `project/archive/`. Journals,
  human-feedback, and audit reports still link the old `docs/plans/` paths — those are **historical record,
  left as-is** (only living/active docs were re-pointed).
- `prd.md` body is still **STALE on the 6-tier model** until B clears — read it with `pending-prd-changes.md` open.
