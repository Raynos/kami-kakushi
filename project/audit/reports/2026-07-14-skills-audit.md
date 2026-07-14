# Skills audit — is `.claude/skills/` carrying dead weight?

**Date:** 2026-07-14 · **Auditor:** Fable session 207 · **Scope:**
the 16 repo skills in `.claude/skills/` (global/plugin skills out of
scope).

**Verdict up front:** the roster is healthier than feared. 10 of 16 are
alive and load-bearing, 3 are dormant *by design*, and only **3 need a
human call**: `handoff` (retire candidate), `battery` (maintained but
hasn't fired in 15 days — recommit or park), and `tdd` (a reference doc
wearing a skill costume). The always-loaded context cost of all 16
descriptions is only **~1.6k tokens**, so the *count* is not itself a
problem — dead weight here costs maintenance sweeps, not context.

## Method

Evidence triangulated per skill, none of it self-reported:

- **Git history** — creation date, real (non-sweep) edits. Mass
  reformats (e.g. the 07-13 printWidth flip) inflate `last-touched`;
  commit subjects were read to separate real maintenance from sweeps.
- **Journal mentions** — 235 journal files grepped; slash-invocation
  mentions (`/skill-name`) counted separately since bare words like
  "ship"/"battery"/"diverge" collide with prose.
- **Artifacts** — did the skill's output actually land? (reports,
  brainstorms, archived inbox buckets, plans, screens dirs, registry
  rows).
- **Cross-references** — hard links from AGENTS.md / docs / gates /
  other skills (structural load-bearing-ness).
- **Dead-link check** — every relative link in every SKILL.md resolves.
  **Zero dead links found** — hygiene is good across the board.

## Tier A — alive and load-bearing (10) · keep

| Skill | Evidence |
|---|---|
| `diverge` | ADR-075 mandatory; 47 journal files mention it this week; 12 commits of real evolution |
| `narrative-diverge` | ADR-139 mandatory; 8 mentions this week; feeds ~10 open HR bundles |
| `taste-scorecard` | Invoked *from inside* both diverge flows (their §2 steps); 4 mentions this week |
| `map-sheets` | The mandatory map entry point (2026-07-08 rule); 6 slash mentions |
| `drain-inbox` | 48 archived inbox buckets; 10 slash mentions; `inbox-ledger` gate depends on its protocol |
| `write-plan` | 26 plans authored since it landed 07-11; `verify-plan-template` gate is its teeth |
| `prepare-to-exit` | The checkpoint ritual; 12 slash mentions; leftover-work sweep lives in it |
| `ship` | The only sanctioned release path (bare `pnpm version` is unsafe in the shared tree); ~15 slash mentions |
| `prd-ripple` | ADR-117 flow; 13 slash mentions |
| `capture-game-states` | 20+ dated `project/audit/screens/` dirs; also driven indirectly by `map-blind-pass` |

`grill-me` rides along here too: low cadence but genuinely alive
(2026-07-08 pillar-model grill; "ran a grill-me triage" in a recent
journal; 53 brainstorms in its output dir). No action.

## Tier B — dormant by design (2) · keep, no action

- **`prd-compress`** — has **never fired** (its 3 journal mentions are
  the sessions that *built* it). But AGENTS.md explicitly parks it:
  "dormant until that tier's taste HR-item closes", human-signed,
  Fable-routed. Dormancy is the spec. 493 chars of context cost.
- **`distill-taste`** — fired **once**, at creation (2026-07-03, the
  taste-redo P4). It waits for a *new feedback corpus*; taste.md is
  deliberately capped. Correctly parked. 348 chars.

## Tier C — needs a human call (3)

### 1. `handoff` — retire candidate

23 lines, adopted ~1:1 from mattpocock 2026-06-29, **never edited
since**. Used twice, both around 2026-07-03 (`tmp/handoff-*.md`) —
before the checkpoint discipline matured. Its job is now covered
structurally: "the session is disposable; the repo is the memory"
(commits + journal + snapshot) plus `/prepare-to-exit` *is* the
handoff, continuously. Recent journal hits on "handoff" are the
English word, not the skill.

**Recommendation:** archive the skill dir's SKILL.md rationale to
`project/archive/` and delete the skill; remove its line from
repo-map.md. Cost of keeping is near-zero (~100 chars), so "keep as
harmless" is defensible — but it's the one clear-cut cull.

### 2. `battery` — maintained but not firing; recommit or park

The odd one out: **8 commits of maintenance** (most recently ADR-188,
2026-07-13) against a registry whose **last run row is 2026-06-29** —
15 days of policy edits to a skill that never fired in that window.
Recent journal mentions of "battery" are *citations of old findings*
("battery #19"), not runs. Only one report in `audit/reports/` is a
battery output.

Its own trigger list says "at a milestone / pre-build / pre-ship
gate" — and those gates keep passing without it (the 07-09 storywave
post-ship review, the 07-11 plan-quality audit, and the map
blind-passes were all run as ad-hoc audits or the `map-blind-pass`
workflow instead).

**Recommendation (pick one):**
- **Recommit** — HR-1 (the live v0.4.0 T0 fun/pacing/look review) is
  the natural slot: run a full battery on the v0.4 build before/with
  that review, which also refreshes the novelty registry; or
- **Park** — move the skill's slot to BACKLOG.md and accept that the
  lighter ad-hoc audits + map-blind-pass have absorbed its role. Then
  stop paying maintenance sweeps on it.

The current state — maintained but unfired — is the worst of both.

### 3. `tdd` — a reference doc, not a live skill

126 lines, adopted 2026-06-29, one real content edit ever. Zero
journal mentions since 07-07. AGENTS.md itself explains why: the
ambient test-discipline rule was **deliberately hoisted out of it**
("a standing rule buried in a never-invoked skill doesn't fire").
What remains is the deep red→green→refactor procedure, which nobody
invokes — but AGENTS.md's test-discipline bullet *points at it* as
the canonical deep procedure, so it is structurally referenced.

**Recommendation:** keep, but reclassify mentally as a pointer-target
reference (like a guide), not an active skill. If you want the cull:
fold its two real deltas (brittle-RNG warning, false-green/mutation
check) into the AGENTS.md bullet and archive the rest. Low stakes
either way.

## Context-cost note

All 16 frontmatter descriptions total ~6.5k chars ≈ **1.6k tokens**
always-loaded. The heaviest are `diverge` (720), `narrative-diverge`
(716), `prd-ripple` (661), `battery` (608) — all Tier A or under
review. Trimming descriptions would buy little; don't bother.

## Summary of asks

1. **`handoff`** — OK to retire? (clear-cut; agent can execute)
2. **`battery`** — recommit (v0.4 battery alongside HR-1) or park to
   BACKLOG? (design-cadence call, yours)
3. **`tdd`** — keep as reference (default) or fold-and-archive?

Everything else: no action. No dead links, no orphaned references,
and the dormant pair are parked exactly as their ADRs intended.
