<!-- knobs: openCap=3  keepFlagsCap=2  maxVariants=3  ttlDays=14  halfLifeDays=7 -->

# UI variant registry (the `diverge` skill's source of truth)

The single source of truth for in-flight UI variant diverges. One row per open diverge. Drives the lazy debt
sweep run at every session start and every diverge (see [`.claude/skills/diverge/SKILL.md`](../../.claude/skills/diverge/SKILL.md)).

**Invariant:** every `diverge/<surface>` git branch ⇔ exactly one **open** row here. `main`'s resting
flag-debt is zero — losing variants live only on their branch + committed screenshots, never as `?variant=`
flags in `main` (the sole exception is the capped `keep-flags` table below).

> Empty until the first UI surface is diverged. The supporting infra (`qa-shots.mjs --variant`,
> `src/scripts/variant-gc.mjs`, the pre-commit isolation guard) is built JIT on that first diverge — see the
> skill's §0.

## Open diverges (branch-preserved; `main` is flag-free) — cap 3

| surface | self-pick | 1-line why | R-item | branch | contact sheet | opened | expires | status |
|---|---|---|---|---|---|---|---|---|
| _(none)_ | | | | | | | | |

## Durable kept-flags (the `keep-flags` exception) — cap 2 repo-wide

| surface | flags | owner | expires | added |
|---|---|---|---|---|
| _(none)_ | | | | |

## Closed (crosswalk)

| surface | R# | winner | who / when | branch-was |
|---|---|---|---|---|
| _(none)_ | | | | |
