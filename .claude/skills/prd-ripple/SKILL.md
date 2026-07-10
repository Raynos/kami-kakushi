---
name: prd-ripple
description: After a BUILT-system design change, classify it (Flow 1) and ripple only what that class demands into the PRD — then run prd:drift and clear what the change staled. Use after any code change that alters a shipped system, narrative beat, or content registry, or when the human says "ripple the PRD" / "does this need a PRD edit?".
argument-hint: "What changed? (the system / narrative / balance edit you just made)"
---

# PRD ripple (Flow 1 — the day-to-day design change)

> Encodes **Flow 1** of the ADR-117 "PRD on a diet" decision
> ([`project/brainstorms/2026-07-03-prd-on-a-diet.md`](../../../project/brainstorms/2026-07-03-prd-on-a-diet.md),
> Flows 1–2, human-locked). The **punch-list replaces memory**: instead of
> recalling which PRD prose a change staled, classify the change, ripple only
> what its class demands, then let [`prd:drift`](../../../src/scripts/prd-drift.ts)
> tell you what's still adrift. **Routing:** the classification + any prose is the
> agent's job; an **intent-level** change stops for the human. This skill is
> Opus-runnable — no judgment beyond the four-way classify below.

## When this fires

After **any built-system design change** — a code edit that alters a **shipped**
system, a narrative beat, or a content registry (`src/core/content/*`). A
pre-commit **WARN** already nudges you: a staged commit touching
`src/core/content/*` without touching `docs/living/prd/` prints a loud reminder
(never blocks — AC-11). This skill is that reminder's procedure.

## Step 1 — classify the change (the four-way cut)

Read the diff and place it in exactly one class:

| Class | What it is | The ripple |
|---|---|---|
| **Balance number** | a constant / threshold / price / curve / multiplier tuning nudge | **NO §4 edit.** §4's magnitudes are provisional/sim-owned by design (ADR-168 — the live truth is `balance.ts` + the generated `t0-pacing.md`). Code + tests (+ the pacing report). An **ADR only** when the change is a *design-level re-derivation*, not a tuning nudge. |
| **System / narrative (BUILT territory)** | a shipped system's behaviour, a shipped rung/beat, a registry entry | Code + **ADR (the why)** + a **targeted PRD ripple** (Q5 status quo — ripple *continues* until that tier's compression event retires it). Edit only the subsections the change staled. |
| **Intent-level** | changes what the game **IS** (the vision values / acceptance criteria) | **STOP — not autonomous.** Human decision → ADR + PRD edit. Record the fork; do not self-decide (PH4). **Text-sync is NOT intent (ADR-168):** the PRD is never frozen — fixing §1 prose that describes a game that no longer ships is the system/narrative class, agent-safe. |
| **Frontier (unbuilt)** | T1–T5 / endgame design not yet built | Edit the **fat frontier sections directly** — that's where forward design lives (Q1). Full detail welcome; no drift risk (the frontier is *supposed* to lead the build). |

**If in doubt between "balance number" and "system/narrative":** ask *did a
design lever's meaning change, or only its value?* Value-only → balance number
(no §4 edit). Meaning → system/narrative (ripple + ADR).

## Step 2 — ripple only what the class demands

- Make the targeted subsection edits (system/narrative + frontier classes only).
- **Never** re-type a derivable fact into prose — if it lives in a registry and
  the build == end-state intent, transclude it as a **gen-region**
  ([`gen-prd-regions.ts`](../../../src/scripts/gen-prd-regions.ts), F1b Ph2's
  pattern) so it can't drift again. Numbers stay OUT (§4 magnitudes are sim-owned, never transcluded — ADR-168).
- Wrote an ADR? Add it to
  [`docs/living/decisions.md`](../../../docs/living/decisions.md).

## Step 3 — run `prd:drift` and clear what the change staled

```
pnpm run prd:drift          # the report — the game→PRD ripple punch-list
pnpm run prd:drift -- --strict   # exits 1 on any drift (scripted use)
```

The report is **one-directional** (game → PRD) and **never a gate** (prose
matching is heuristic — AC-11). Read the **SPEC-ALTITUDE presence** gaps: any
built entity your change added/renamed that is now missing from the PRD is your
ripple's remaining work. Clear the gaps your change caused; a frontier-only gap
(an unbuilt entity absent by design) is **not** yours to fix.

## Step 4 — verify + commit

`pnpm run verify` (green), then commit code + ADR + PRD ripple together with a
body that leads with the *why*. The
[`gen-prd-regions`](../../../src/scripts/gates.ts) gate keeps any transcluded
region honest by construction.

---

**Compression, not ripple?** When a whole **tier's** taste review (its HR-item)
closes and you want to *compress* that tier's fat prose to intent + acceptance
criteria, that's **Flow 2** — a different, human-signed, **Fable-routed** event.
Use [`/prd-compress`](../prd-compress/SKILL.md), not this skill.
