# Session 129 — 2026-07-09 — storywave G5 (VERDICT reconciliation) + G6 (e2e / drift / QA)

## ☀️ SUMMARY (read this first)

Finishing the storywave build on `main` (G0→G4 landed prior). This session
runs **G5** — the one-version VERDICT reconciliation audit — and **G6** — the
e2e rewrite, the retired-name drift sweep, and the QA screenshot pass.

This file is HISTORY, not live state; the live snapshot is
`project/status/project-status.md`.

---

## 1 · G5 — VERDICT reconciliation (per-unit completeness audit)

A text-level PH2 audit: per unit (u0–u9 + `flavor/`), diff the live narrative
sources against the unit's `t0v2/*/VERDICT.md` pick + required redlines. The
audit was fanned out over read-only Explore agents; I (single writer) applied
the fixes. **Headline: G4.1's migration was remarkably thorough — nearly every
required redline was already applied. Only U5 (the Count) had two genuinely
missed blocking redlines, now fixed.**

### Per-unit reconciliation checklist

| Unit | Pick | Live source location | Redlines |
|---|---|---|---|
| u0 cold-open | Take A | `cold-open.md` + `intro.md` (soan scene) + `requirements.md` R0 | ✅ all applied — r0-knot chiasmus rewritten to "The Carrier's Hitch…"; day-count reconciled to "Fed, three days". Human-flags (not defects): "Taken at the weir" echo; deliberate "Day four, by mine" seed. |
| u1 R1 day-hand | take-c | `rung-beats.md` R1 + `requirements.md` | ✅ all applied — r1-the-meals count-only; "He looked at you once."; one Naoyuki form; ~80 wrap. |
| u2 R2 (SILENT) | take-c | `scenes.md` `r2-yard-hand` scene-def (rung-beats.md holds only a pointer comment) | ✅ all applied — genuinely speakerless/narration-only; rice narration ends at "Rice keeps."; aphorisms thinned; "One measure the day" unit-vague. Optional doorpost salvage correctly left unapplied. |
| u3 R3 grain-watch | take-b | `rung-beats.md` R3 + `requirements.md` | ✅ all applied — Sōan ellipsis cut; "A watch that wanders…" absent; O-Hisa bare (no false steward tag); ledger-close de-duped; take-A req skeleton lifted, flavor rewritten. |
| u4 R4 pupil | take-b | `rung-beats.md` R4 | ✅ all applied — alcove glimpse added (narration-only); echo template broken to one; "That is the whole of why…" deleted; empty-watch pinned. |
| u5 R5 the Count | take-c | `scenes.md` `count`/`count-resolve` scene-defs | ⚠️ **2 MISSED → FIXED this session** (see below). Redlines 1 (Naoyuki break-offs ≤2) + 3 ("It takes as long as it takes." / "It is not malice." deleted) were already applied. |
| u6 R6 trusted-hand | take-c | `rung-beats.md` R6 | ✅ blocking applied — "Everything walks downhill but the rain." cut; final paragraph trimmed; pedlar→Yohei. ⏭ **Deferred (HD-30):** the "one man, name unknown" @-reuse echo (the count-back epilogue has no rung-beat form yet). ⚑ **Surface:** MC lines rendered as narrator `>` quotes rather than `Nameless:` (systematic pre-R7 convention — see Landmines). |
| u7 R7 named-hand | take-b | `rung-beats.md` R7 + `scenes.md` `r7-dream` | ✅ blocking applied — Item/Count/Condition recast to plain Genemon speech; "fine as sieved ash" cut; "An entry can be amended" graft IS live (r7-mine). ⏭ take-A morning-after log line un-applied — VERDICT classes it **Recommended / non-blocking** (HD-30). Stale migration comment corrected. |
| u8 side-beats | C base + A grafts | `scenes.md` (grove/Bon/lease/dog/crest) | ✅ all 5 redlines applied — Bon = A whole; "quiet that night" banked line cut; A's sb-dog-coda grafted; A blocks POV-converted to 2nd person; fed dog re-priced onto MC's share; petal count relative ("one more"). ⚑ same narrator-quote-vs-`Nameless:` nit on grafted MC lines. |
| u9 dialogue | per-character mix | `dialogue.md` | ✅ all applied — 13/13 characters present, each matching its assigned take; Shinnosuke speaker fixed (narrator→steward key); soan-ledger line added; O-Yae jizō-rumor added; flag vocabulary unified. Note: Shinnosuke rides the generic `steward` voice (not a dedicated `shinnosuke` voice); Naoyuki keys re-pointed to `heir`/`official`. |
| flavor | both sheets (redlined) | `flavor.md` | ✅ all 6 redlines applied — new-moon line single-sourced (cut); `mob-otter` absent (T1); whetstone maxim cut; big-male de-duped; weir-rats completion varied; field-guide snap-closes rationed to one. Action-labels deliberately not migrated (mechanical micro-labels, not renderer prose). |

### U5 fixes applied (the only real misses)

1. **Redline 2 — the unconditional new-moon narration.** `scenes.md:149-151`
   shipped *"Twice, on the new-moon rounds, you have seen a hooded lantern…"* as
   plain narration. The VERDICT forbade shipping it unconditionally (the player
   may never have walked a new-moon round → a false claimed memory) and ruled:
   flag-gate on a real sighting **or cut**. No `saw-hooded-lantern` flag exists
   (the crossing is night-round texture only, never latched), so I **cut** the
   beat — the judge's authorized option — and left a migration comment recording
   why. The new-moon lantern still lives as night-round flavor (sb-dog-coda),
   so the motif is not lost.
2. **Redline 4 — the un-flattened epigram.** `scenes.md:58` kept the
   antithesis *"Nobody arranged that. It arranged itself."* The VERDICT required
   flattening to one plain sentence (keeping "It is still not a name." as the one
   narration epigram). Flattened to **"Nobody arranged that."** (the plain half;
   the take's own words — a reduction, not invented prose).

Also corrected a stale migration comment at `rung-beats.md:402-409` that wrongly
claimed the "An entry can be amended" graft could not be applied (it is live).

`pnpm run gen:narrative` re-run; fixtures regenerated (the R5 scene text is
embedded in R6+ save snapshots — 4 fixtures moved). Full verify green (17 gates).

No new `[dev — …]` gaps introduced this session; no fiction invented.

---

## Next intended steps (current)
1. G6 — rewrite `e2e/` specs to the new arc (Yohei stall / R3 night round /
   clean-break persistence / re-anchored layout text).
2. G6 — the drift sweep: fix residual retired-name hits in `src/` + `e2e/`.
3. G6 — QA screenshot pass (if the harness runs) into `project/audit/screens/`.

## Landmines (current)
- **`Nameless:` vs narrator-quote (surface for the human).** G4.1 adopted a
  wave-wide convention (documented `rung-beats.md:6-8`) rendering the MC's
  pre-R7 lines as narrator `>` quotes instead of `Nameless:`-labelled speech.
  Several VERDICTs (u6 r1 explicitly) asked for `You:`→`Nameless:` on MC lines;
  u8's grafted Bon/crest MC lines are also bare narration quotes. This is a
  deliberate systematic choice interacting with the engine's `playerSpeaker`
  ladder, NOT a per-line redline miss — flagged for a human taste call rather
  than mass-rewritten (mass-relabelling could itself be wrong). u6's "His." MC
  line was dropped (not relabelled) in the decide restructuring.
- **HD-30 open gaps** still gate G7: the u6 count-back epilogue @-echo and the
  u7 take-A morning-after log line have no rung-beat form yet.
- Drift-sweep note: `Oyuki`/`Osen` grep terms false-positive on
  "Na**oyuki**" (current heir) / "ch**osen**" — always word-boundary the sweep.
