<!-- knobs: openCap=3  keepFlagsCap=2  maxVariants=3  ttlDays=14  halfLifeDays=7 -->

# UI variant registry (the `diverge` skill's source of truth)

The single source of truth for in-flight UI variant diverges. One row per open diverge. Drives the lazy debt
sweep run at every session start and every diverge (see [`.claude/skills/diverge/SKILL.md`](../../.claude/skills/diverge/SKILL.md)).

> **⚠ MODEL CHANGED — D-075 (2026-06-30, refines D-073).** Variants no longer live on a `diverge/<surface>`
> **branch** or as screenshots — they live **in the codebase**, switchable live via the **DEV panel** (DEV-only,
> stripped from prod). **Full 2–3 working variants always** (diverge-LITE retired), and **each variant is its own
> line item in `human-in-the-loop/review.md`** (reviewed live by toggling). `main`'s resting flag-debt is now
> "**zero PROD debt**" (the DEV toggle carries the alternates). The branch-based §§ of the skill + this log's
> tables below are being **re-worked alongside the DEV-panel build** (v0.3.1); the rows below are the v0.3 history.

**Invariant (D-075):** every variant in the codebase ⇔ a **review.md line item** (and a row here). Variants live
in-codebase behind the **DEV-panel toggle**; prod ships only the self-picked default (zero prod flag-debt).

## Open diverges (branch-preserved; `main` is flag-free) — cap 3

`status`: `open` · `auto-confirmed` (TTL lapsed, self-pick promoted) · `deferred-single-idea` (shipped
flag-free at cap; re-offer a real diverge when a slot frees). Closed rows move to the Closed crosswalk below.

| surface | self-pick | 1-line why | R-item | branch | contact sheet | opened | expires | status |
|---|---|---|---|---|---|---|---|---|
| _(none open — all v0.3 diverges decided; see Closed crosswalk)_ | | | | | | | | |

**Diverge-LITE (single-idea, time-boxed — re-diverge owed if they don't land):** the 3 smaller T0-M4 breadth
panels shipped on one ui-design-faithful direction each under the overnight time-box, NOT a full 2–3-variant
contact sheet — **craft panel** (`screens/breadth/craft-panel.png`), **tiny market** (Work-tab panel),
**Quests tab** (`screens/breadth/quests-tab.png`). All flagged in **R3** so the human can request a real
diverge on any. (Mentor dialogue routes into the existing log → no new surface, no diverge owed.)

## Durable kept-flags (the `keep-flags` exception) — cap 2 repo-wide

| surface | flags | owner | expires | added |
|---|---|---|---|---|
| _(none)_ | | | | |

## Closed (crosswalk)

| surface | R# | winner | who / when | branch-was |
|---|---|---|---|---|
| House-Influence panel (M2·6) | R2 | **A** — continuous ink grade-bar (indigo→gold, ticks at Good/Great/Excellent + 朱 Ascend CTA) over B's segmented 3-band meter (B also rendered buggy) | self-pick · session-19 (2026-06-29) | folder-preserved (`screens/diverge-influence/` + DECISION.md) |
| Walkable estate map (T0-M4-F4) | R3 | **A** — focused "you are here + paths" (ink place-names, danger-ring ⚠) over B's whole-map grid (better once the graph grows in T1) | self-pick · session-19 (2026-06-29) | folder-preserved (`screens/diverge-map/` + DECISION.md) |
