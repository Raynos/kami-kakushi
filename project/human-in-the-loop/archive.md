# Human-in-the-loop archive (closed H-items + R-items)

A **lean crosswalk** of resolved `H`-decisions and `R`-reviews — the closed index for
[`decisions.md`](decisions.md) and [`review.md`](review.md) (which hold **open** items only). One line per
item; IDs never reused.

This file is an **index, not the record**. The durable "why" lives in the **ADR** it graduated to
([`../../docs/living/decisions.md`](../../docs/living/decisions.md)); the verbatim human intent lives in
[`../human-feedback/`](../human-feedback). Don't re-paste prose here — link.

> **Graduation rule.** A resolved item graduates to an **ADR** when it's a decision future-us needs the
> *rationale* for. Purely **mechanical / structural** items get an archive row but **no ADR**. A closed
> `R`-review (a taste/playtest call) archives the same way once its verdict lands — moved out of `review.md`
> into the **Reviews** section below. See the [README](README.md) for the full lifecycle.

## Decisions (closed H-items)

| H# | Title | Resolution (one line) | → ADR | Date | Intent |
|----|-------|-----------------------|-------|------|--------|
| H1 | Pacing-floor visible before M6 | Ship real D-049 pacing as default + a DEV-only speed toggle | **D-056** | 2026-06-29 | [decision-session](../human-feedback/2026-06-29-decision-session.md) |
| H2 | Humbling first fight (20–35%) | Keep the signed 20–35% **single-fight** win-rate band | **D-058** | 2026-06-29 | [decision-session](../human-feedback/2026-06-29-decision-session.md) |
| H3 | Tease the macro layer now | Resolved by the tier reshape — active + locked-silhouette teaser | **D-055** (+D-048…D-055) | 2026-06-29 | [decision-session](../human-feedback/2026-06-29-decision-session.md) |
| H4 | Ban "SHIPPED (slice)" | Milestone-integrity rule (all-DoD-or-amend + CI manifest) | **D-054** | 2026-06-29 | [decision-session](../human-feedback/2026-06-29-decision-session.md) |
| H5 | Seed-breadth scope | Showcase-in-miniature; 2nd weapon found/crafted, not gifted | **D-052** | 2026-06-29 | [decision-session](../human-feedback/2026-06-29-decision-session.md) |
| H6 | Active-only vs idle bar | Active-only; ~~wall-time catch-up (don't pause on hidden)~~ **⤴ REVERSED by D-079 (2026-06-30): active-only PAUSE on hidden** (the D-053 text is the fix) | **D-053** → **D-079** | 2026-06-29 | [decision-session](../human-feedback/2026-06-29-decision-session.md) |
| H7 | `ship-gate` skill | **Don't build** — rides H10's defer; D-054 owns the policy | **D-070** | 2026-06-29 | [h-item-decisions](../human-feedback/2026-06-29-h-item-decisions.md) |
| H8 | Split the 7k-line PRD | Split into `prd/§1…§7` (mechanical) — batched in the PRD ripple | _none (mechanical)_ — *(ripple tracker retired 2026-06-29)* | 2026-06-29 | [decision-session](../human-feedback/2026-06-29-decision-session.md) |
| H9 | `resolve-queue` skill | **Drop** — resolve decision queues by hand | **D-070** | 2026-06-29 | [h-item-decisions](../human-feedback/2026-06-29-h-item-decisions.md) |
| H10 | Operating Model v2 | **Defer** the bundle; adopt the lean pre-commit gate ad hoc | **D-070** (defer) + **D-071** (gate) | 2026-06-29 | [h-item-decisions](../human-feedback/2026-06-29-h-item-decisions.md) |
| H11 | T0 material-surplus sink (2nd craft recipe?) | **Option C** — accept surplus as WAI for the miniature; material economy is a T1+ concern (battery #15 closed) | **D-095** | 2026-07-01 | [h11-material-surplus](../human-feedback/2026-07-01-h11-material-surplus.md) |
| H12 | Version source: footer showed v0.2, not v0.3.1 | Single-source the displayed version from **package.json** (→ 0.3.1); git tags never read by game/HTML/TS | **D-096** | 2026-07-01 | [session-38 journal](../journal/2026-07-01-session-38-doc-staleness-reconcile.md) |

## Reviews (closed R-items)

| R# | Title | Resolution (one line) | → ADR / outcome | Date | Intent |
|----|-------|-----------------------|-----------------|------|--------|
| R3 | T0-M4 breadth diverge picks | Superseded — folded into the unified per-variant **R2** review | **D-075** (diverge v2) | 2026-06-30 | [r4-playtest-decisions](../human-feedback/2026-06-30-r4-playtest-decisions.md) |
| R4 | v0.3 fidelity-battery judgment queue (6 calls) | All 6 decided via AskUserQuestion (clock / fork / auto-combat / cold-open / breadth / koku) | **D-076…D-079** (+D-056) | 2026-06-30 | [r4-playtest-decisions](../human-feedback/2026-06-30-r4-playtest-decisions.md) |

> _Open reviews live in [`review.md`](review.md): **R1** (playtest) · **R2** (UI variants, per-variant, D-075)._
