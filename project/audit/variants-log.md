<!-- knobs: openCap=3  keepFlagsCap=2  maxVariants=3  ttlDays=14  halfLifeDays=7 -->

# UI variant registry (the `diverge` skill's source of truth)

The single source of truth for in-flight UI variant diverges. One row per open diverge. Drives the lazy debt
sweep run at every session start and every diverge (see [`.claude/skills/diverge/SKILL.md`](../../.claude/skills/diverge/SKILL.md)).

**Invariant:** every `diverge/<surface>` git branch ⇔ exactly one **open** row here. `main`'s resting
flag-debt is zero — losing variants live only on their branch + committed screenshots, never as `?variant=`
flags in `main` (the sole exception is the capped `keep-flags` table below).

> **Note (v0.3, session-19):** the standard skill keeps losing variants on a `diverge/<surface>` git branch,
> but v0.3's UI work ran on a **shared working tree** (multiple live agents) where a `git switch` would clobber
> another agent's WIP — so v0.3 used **folder-preservation** instead (committed variant screenshots + a
> `DECISION.md` under `project/audit/screens/<surface>/`), same 2–3-approach discipline, zero `main` flag-debt.
> "branch-was" reads *folder-preserved* for those rows.

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
