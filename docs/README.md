# docs/

Design docs — **living documents**, each the *current* truth for its concern, edited **in place** (no stale
"v2" copies; the *why* of a change goes to a journal entry / an ADR).

- **[`living/`](living)** — the actively-maintained docs:
  - [`prd.md`](living/prd.md) — the single living PRD (top-matter + §§1–7); the current truth for the design.
  - [`decisions.md`](living/decisions.md) — the **ADR log** (`D-000…`): every locked decision + *why*
    (append-only, but live — moved here from the old `history/`).
  - [`roadmap.md`](living/roadmap.md) — the living milestone tracker (M0–M2b shipped; M3–M7 provisional).
  - [`ui-design.md`](living/ui-design.md) — the woodblock/ink UI design-language bible.
  - [`fun-factor.md`](living/fun-factor.md) — what fun *is* & how to keep it high.
  - [`qa-playtesting.md`](living/qa-playtesting.md) — how Claude drives & play-tests the game.
- **[`content/`](content)** — **generated** balance/content tables (`t0-content.md`, by
  `src/scripts/gen-docs.ts`, gate-checked by `gen:docs --check`). Do not hand-edit.

Human feedback lives **outside** `docs/`: the consolidated PRD-steering record is archived at
[`../human-feedback/2026-06-26-prd-human-feedback.md`](../project/human-feedback/2026-06-26-prd-human-feedback.md); live feedback is in
[`../human-feedback/`](../project/human-feedback).

**Docs-explosion status (D-020/D-021).** The build-and-play trigger is met (M0–M2b built, verify-green,
play-tested), so the §7 roadmap now lives as [`living/roadmap.md`](living/roadmap.md) and the §4 balance is
generating into [`content/`](content). Queued: freeze **only** the §1 vision + locked constraints + signed
acceptance targets as a tagged snapshot, and finish migrating §4 to generated tables. M2–M7 are **never**
frozen as canon.

Keep it **Markdown only**; runnable tools and game code live under `src/` / `src/scripts/`.
