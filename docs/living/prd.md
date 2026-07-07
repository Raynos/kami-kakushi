# Kamikakushi — Product Requirements Document (PRD)

> **Status: PRD V2.3 — reshaped from the 79 human-signed V2 decisions** (Block L `Q1–Q56` + Block M `FU1–FU23`)
> **+ Block N (32 post-battery) + Block N.1 (7); ADRs ADR-043/ADR-044/ADR-045**
> (2026-06-26; see [`2026-06-26-prd-human-feedback.md`](../../project/feedback-human/2026-06-26-prd-human-feedback.md) §§L–N).
> **V2.3 (2026-06-29):** the 6-tier reshape — ADRs **ADR-048–ADR-069** + the 5 finalized forks — rippled into the body
> (Part 1 of `path-to-v0.3`; commit `3040844`). Per **ADR ADR-022 (governing)** these
> V2 decisions **supersede** any conflicting prior lock / canon / ADR — **most-recent-wins, annotate-don't-delete.**
> The V2 **LOCKED INTENT** is frozen per **ADR ADR-021** (the freeze-framing below); the §4 balance numbers and the
> §7 MS2–MS7 milestone detail stay **provisional** and are re-planned after each playtest. No code is written until
> §7 (the roadmap) is approved. *(Satisfied 2026-06-26: §7 approved → MS0–M2b built & verify-green; MS3–MS7 provisional.)*
>
> **Working title:** *Kamikakushi* (神隠し, "spirited away"). A single-player, story-driven
> **incremental RPG** set in Edo-period rural Japan, built as a static HTML5 + TypeScript web game,
> deployable to itch.io.

## How to read this document

This PRD plans the **whole saga in full detail up front**, authored and reviewed one section at a time.
It is one living spec **split per-section** — this file is the index + preamble, and each authored
section lives in its own file under [`prd/`](prd/) (linked below); sections still to be written appear
as in-place placeholders. Each section is drafted in full, walked through with the human,
revised, and its load-bearing decisions locked as ADRs.

| § | Section | Status |
|---|---------|--------|
| 1 | Vision, pillars, factions, world & endgame | **PRD V2.3 — locked intent** |
| 2 | Systems & mechanics catalog | **PRD V2.3** |
| 3 | Incremental unlock ladder (UI-as-progression) | **PRD V2.3** |
| 4 | Combat, progression & balance model | **PRD V2.3 — numbers provisional** |
| 5 | Full act-by-act narrative & content | **PRD V2.3** |
| 6 | Tech architecture & data model | **PRD V2.3** |
| 7 | Milestone roadmap, v1 scope & deployment | **PRD V2.3 — MS2–MS7 provisional** |

> **FRAMING — the freeze line (ADR ADR-021, refines ADR-020).** Read this PRD as **LOCKED INTENT vs.
> PROVISIONAL IMPLEMENTATION**, *not* "vision vs. plan." **LOCKED INTENT (the destinations — frozen):** §1
> vision + the hard human constraints (no magic; mediocre start; trade ≤⅓; active-only v1; the four
> pillars; the estate spine) + the human-signed **acceptance criteria** tagged `LOCKED` in §4 — the
> **≥30-min-per-rank floor**, the **≈70/30 deeds/seasonal** split, the **≈28.5 h v1 budget** (a **FLOOR / minimum**,
> not a ceiling — ADR-016-as-annotated per FU18), and the **tier-gate TARGETS** (the V2 **hybrid good/great/excellent**
> pillar profile, Q7/FU10). **PROVISIONAL IMPLEMENTATION (the route — liquid, revised via playtest):**
> everything tagged `proposed v1 balance` (the §4 yields/levers/magnitudes) and the **§7 MS2–MS7** milestone
> detail — these *hit* the locked targets, so the levers move while the targets do not. The **v1 scope**
> (full **T0–T2**, no pre-planned descope — §7.4.2) is **orthogonal and still LOCKED**: it fixes *what*
> ships, not the provisional *how*. **Do NOT explode this doc yet** — **MS0 + MS1 build against this PRD
> as-is**; full sign-off and the one-time reorganisation come **after the first build-and-play cycle**, on
> ground that has survived contact with play. Then §1 + the locked constraints freeze as a tagged vision
> snapshot, §7 moves to a living `docs/living/roadmap.md` ("MS0–MS1 committed; MS2–MS7 provisional, re-planned after
> each playtest"), and the §4 numbers move to generated `docs/content/` tables. **MS2–MS7 are never frozen
> as canon** (per ADR ADR-021).
> *(Update 2026-06-26: the first build-and-play cycle is complete — **MS0–M2b are built, verify-green and
> play-tested**, and the living roadmap now exists at [`roadmap.md`](roadmap.md). The remaining one-time
> reorg — freezing §1 as a tagged vision snapshot and moving the §4 numbers to generated `docs/content/`
> ([`content/t0-content.md`](../content/t0-content.md) already exists) — is the queued next step.)*

> **FRAMING 2 — the frontier line (ADR ADR-117, 2026-07-03; refines ADR-097).** This
> PRD's **primary job is the forward spec of the UNBUILT** (T1–T5, endgame).
> Once a tier's human taste review closes, its built slices **compress** — one
> per-tier, human-signed sweep across §2–§6 — to intent + acceptance criteria +
> pointers (code / generated `docs/content/` / ADRs); the pre-compression text
> graduates verbatim to `project/archive/`. Until T0's sweep: only the §4
> illustrative magnitudes are ripple-frozen (see the §4 banner); everything
> else stays hand-current.

---

## Sections

The PRD is split per-section (ASCII filenames — no `§` in paths) to kill the monolith-truncation
failure class. Each file is one top-level section, verbatim.

- [§1 — Vision, Pillars, Factions, World & Endgame](prd/01-vision.md)
- [§2 — Systems & Mechanics Catalog](prd/02-systems.md)
- [§3 — Incremental Unlock Ladder (UI-as-progression)](prd/03-unlock-ladder.md)
- [§4 — Combat, Progression & Balance Model](prd/04-combat-balance.md)
- [§5 — Act-by-Act Narrative & Content](prd/05-narrative.md)
- [§6 — Tech Architecture & Data Model](prd/06-tech-architecture.md)
- [§7 — Milestone Roadmap, v1 Scope & Deployment](prd/07-roadmap-scope.md)
