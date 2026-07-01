# docs/

Design docs — **living documents**, each the *current* truth for its concern, edited **in place** (no stale
"v2" copies; the *why* of a change goes to a journal entry / an ADR).

- **[`living/`](living)** — the actively-maintained docs:
  - [`prd.md`](living/prd.md) — a **stub index**; the spec lives in the per-section files
    [`living/prd/`](living/prd) (`01-vision … 07-roadmap-scope` + a `README`).
  - [`decisions.md`](living/decisions.md) — the **ADR log** (`D-000…`): every locked decision + *why*
    (append-only, but live — moved here from the old `history/`).
  - [`roadmap.md`](living/roadmap.md) — the living milestone tracker (**v0.3 shipped the full T0 M0–M4
    arc**; later tiers provisional).
  - [`ui-design.md`](living/ui-design.md) — the woodblock/ink UI design-language bible.
  - [`sfx-spec.md`](living/sfx-spec.md) — the minimal audio-cue contract (3 cues built in `src/ui/sfx.ts`).
  - [`fun-factor.md`](living/fun-factor.md) — what fun *is* & how to keep it high.
  - [`qa-playtesting.md`](living/qa-playtesting.md) — how Claude drives & play-tests the game.
- **[`philosophy/`](philosophy)** — the **R1–R6 operating register** (the how/why/what-to-reason
  philosophies; D-080…D-085), each summarised in AGENTS.md.
- **[`plans/`](plans)** — pre-canon **implementation plans / proposals** awaiting sign-off; **active
  only** — a plan **graduates to [`../project/archive/`](../project/archive)** the moment it's done.
- **[`content/`](content)** — **generated** balance/content tables (`t0/t1/t2-content.md`, by
  `src/scripts/gen-docs.ts`, gate-checked by `gen:docs --check`). Do not hand-edit.

Human feedback lives **outside** `docs/`: the consolidated PRD-steering record is archived at
[`../human-feedback/2026-06-26-prd-human-feedback.md`](../project/human-feedback/2026-06-26-prd-human-feedback.md); live feedback is in
[`../human-feedback/`](../project/human-feedback).

**Docs-explosion status (D-020/D-021).** The build-and-play trigger is met (**v0.3 — the full T0 M0–M4 arc
shipped, verify-green, play-tested**), so the §7 roadmap now lives as [`living/roadmap.md`](living/roadmap.md),
the §4 balance is generating into [`content/`](content), and the PRD has split into per-section files under
[`living/prd/`](living/prd). Queued: freeze **only** the §1 vision + locked constraints + signed
acceptance targets as a tagged snapshot, and finish migrating §4 to generated tables. M2–M7 are **never**
frozen as canon.

Keep it **Markdown only**; runnable tools and game code live under `src/` / `src/scripts/`.
