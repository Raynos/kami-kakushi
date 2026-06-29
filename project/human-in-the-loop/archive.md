# Decisions archive (closed H-items)

A **lean crosswalk** of resolved `H`-items — the closed index for [`decisions.md`](decisions.md)
(which holds **open** items only). One line per item; IDs never reused.

This file is an **index, not the record**. The durable "why" lives in the **ADR** it graduated to
([`../../docs/living/decisions.md`](../../docs/living/decisions.md)); the verbatim human intent lives in
[`../human-feedback/`](../human-feedback). Don't re-paste prose here — link.

> **Graduation rule.** A resolved H-item graduates to an **ADR** when it's a decision future-us needs
> the *rationale* for. Purely **mechanical / structural** items (e.g. splitting a file) get an archive
> row but **no ADR** — recording a no-op decision as an ADR only dilutes the log. See the
> [README](README.md) for the full lifecycle.

| H# | Title | Resolution (one line) | → ADR | Date | Intent |
|----|-------|-----------------------|-------|------|--------|
| H1 | Pacing-floor visible before M6 | Ship real D-049 pacing as default + a DEV-only speed toggle | **D-056** | 2026-06-29 | [decision-session](../human-feedback/2026-06-29-decision-session.md) |
| H2 | Humbling first fight (20–35%) | Keep the signed 20–35% **single-fight** win-rate band | **D-058** | 2026-06-29 | [decision-session](../human-feedback/2026-06-29-decision-session.md) |
| H3 | Tease the macro layer now | Resolved by the tier reshape — active + locked-silhouette teaser | **D-055** (+D-048…D-055) | 2026-06-29 | [decision-session](../human-feedback/2026-06-29-decision-session.md) |
| H4 | Ban "SHIPPED (slice)" | Milestone-integrity rule (all-DoD-or-amend + CI manifest) | **D-054** | 2026-06-29 | [decision-session](../human-feedback/2026-06-29-decision-session.md) |
| H5 | Seed-breadth scope | Showcase-in-miniature; 2nd weapon found/crafted, not gifted | **D-052** | 2026-06-29 | [decision-session](../human-feedback/2026-06-29-decision-session.md) |
| H6 | Active-only vs idle bar | Keep active-only; wall-time catch-up (don't pause on hidden) | **D-053** | 2026-06-29 | [decision-session](../human-feedback/2026-06-29-decision-session.md) |
| H7 | `ship-gate` skill | **Don't build** — rides H10's defer; D-054 owns the policy | **D-070** | 2026-06-29 | [h-item-decisions](../human-feedback/2026-06-29-h-item-decisions.md) |
| H8 | Split the 7k-line PRD | Split into `prd/§1…§7` (mechanical) — batched in the PRD ripple | _none (mechanical)_ — [pending-prd-changes](../status/pending-prd-changes.md) | 2026-06-29 | [decision-session](../human-feedback/2026-06-29-decision-session.md) |
| H9 | `resolve-queue` skill | **Drop** — resolve decision queues by hand | **D-070** | 2026-06-29 | [h-item-decisions](../human-feedback/2026-06-29-h-item-decisions.md) |
| H10 | Operating Model v2 | **Defer** the bundle; adopt the lean pre-commit gate ad hoc | **D-070** (defer) + **D-071** (gate) | 2026-06-29 | [h-item-decisions](../human-feedback/2026-06-29-h-item-decisions.md) |
