# Session 134 — 2026-07-09 — storywave closure: rulings + execution begins

**Summary:** the human read the closure plan
(`docs/plans/fable-2026-07-09-storywave-closure.md`), ruled every surfaced
fork live via AskUserQuestion, and went AFK with this Fable session executing
the whole plan (C0→C5) end-to-end autonomously. C0 pre-flight landed: every
B-finding re-verified live against the tree (none pre-fixed; line refs hold),
both design forks recorded as ADRs, the plan annotated + flipped IN
EXECUTION.

## The rulings (verbatim record: `project/feedback-human/2026-07-09-storywave-closure-rulings.md`)

- **HD-31 → the REFUSING gate (ADR-166)** — reverses the plan's keep-as-built
  default: Autumn's exit refuses until that year's nengu is reckoned; the
  refused attempt triggers the nengu scene; completion reckons (kura draw +
  flag latches); annual re-arm; the latched `nengu-reckoned` still serves R7.
- **HD-32 → the FULL fiction wave now (ADR-167)** — units 1–5 incl.
  per-season node flavor at PER-SEASON diverge units (6 units × 3 takes).
- **Routing** — Fable executes the whole plan this session (overrides the
  plan's 80%-Opus table for this execution).
- **C3 gate scope** — WIDEN the prd-drift retired-terms scan to
  `fun-factor.md` / `ui-design.md` / `qa-playtesting.md` (allowance rows).
- Standing steers: adjacent misses the plan didn't catch are in scope
  (mechanical on sight; design-shaped → HD/HR-items); no blocking asks for
  the rest of the session — defaults + async-override items instead.

## What changed (C0)

- `docs/living/decisions.md` — ADR-166 (refusing gate) + ADR-167 (fiction
  wave in full).
- `project/human-in-the-loop/archive.md` — HD-31/HD-32 rows (ruled same-day,
  never sat open).
- `project/feedback-human/2026-07-09-storywave-closure-rulings.md` — NEW.
- `docs/plans/fable-2026-07-09-storywave-closure.md` — Status → IN EXECUTION;
  ruling annotations at C0.2/C0.3, C1.4's gate block, C3's scope check, C5a's
  options, the routing section.
- `project/status/project-status.md` — resume block points at this execution.
- This journal.

## C0 verification notes (PH2)

- B1: `O-Sato` ×4 in `src/ui/map-sheets/nodes.ts:122,133,491,508` — confirmed,
  and confirmed absent elsewhere in `src/`.
- B2: `night-rounds.ts` FALL still skips the bleed (comment still says
  "DORMANT"); `fight.ts:166-179` carries the bleed + the dead `lostRice` read
  (B5). B4: `autoplay.ts:405` reads `resources.rice`. B6/B7: reducer guards
  absent as reported; `season.test.ts` does not exist; `step.ts` auto-reckons
  the nengu in `advanceSeason` (the ADR-166 target). Combat-rework debt: 3
  `it.skip` + TODO(g4-tests) patches confirmed.
- ADR-166 implementation note discovered in pre-flight: `nengu-reckoned`
  latches ONCE but Autumn recurs — the refusing gate must key on a per-year
  seam (e.g. the seasonsPassed of the last reckoning), not the latched flag,
  which keeps serving R7 unchanged.

## Next intended steps

C1 (build fixes, one commit per step) → C2 (docs sweep) → C3 (gate hardening,
RED-proof vs pre-C2 tree) → C4 (wire the dark world) → C5a (fiction wave,
ADR-139) + C5b (balance re-baseline). Each phase checkpoints (commit →
journal append → snapshot → push).

---

## C1.1 — B1 name-sync (O-Sato → O-Hisa)

Four player-visible `who:` strings in `src/ui/map-sheets/nodes.ts` carried the
bible-retired "O-Sato" (→ O-Hisa). Fixed; side-panel text only, no geometry,
no pin regen. Durable guard: `names.ts` gains `RETIRED_NAMES` (the content-side
single source — O-Sato, Oyuki, Okimi, Jinbei, Akagi, Shigemasa, Tokubei) and
the map-sheets integrity test sweeps every node's content strings against it —
seen RED against the pre-fix tree (all four hits), GREEN after. Adjacent-canon
check: "Heikichi" in a nodes action string verified bible-canon (04-cast).
Note: the C0 push was blocked by the co-agent's (w2:p5) unformatted WIP —
left local per "don't fight someone else's red"; cleared later this session.

## C1.2 — B2/B3 night-round fall bleed fold

`applyCarriedLossBleed` extracted to `defeat.ts` (one home); fight loss +
night-round fall both call it; dead `lostRice` read deleted (rice kura-only —
cannot bleed by construction); the fall now logs via the same `combat.loss`
key. B3: the test sweeps the REAL `NIGHT_ROUNDS` registry (materials-only
rewards across seeds; fall bleeds the constant-derived slice) — RED-proven
against the HEAD engine. Fixtures regenerated (loss path feeds waypoints).
ADR-132: `t0-pacing.md` was STALE since the rewrite (fingerprint 64b47624 →
780ad790); regenerated. Sim verdict: 6 RED (idler R1 soft-lock ×5 + Phase-2
ratio ~7–8.7 vs [0.8,1.2]) — verified PRE-EXISTING at HEAD by swapping the
diff out; the bleed fold is sim-neutral; the reconciliation is C5b's owed
re-baseline. All 24 telemetry reports are v0.3.x/tainted → C5b distill.

## C1.3 — B4 dead autoplay branch re-pointed to the kura

The Phase-2 steward's sell-rice lever read `resources.rice` (never written
post-G4.5) so it never fired. The intent ladder's own step-2b comment ("Rice
is sold first (above)") shows the lever is MEANT to fire — re-pointed to
`banked.rice` and gated on `isMarketDay` (mirrors the reducer's no-op guards
so a shut stall can't stall the policy loop; the sell terminates by shrinking
the pile). ADR-132: Phase-2 ratio nudged [7.33–8.65]→[7.24–8.54] (the lever
now fires; still the pre-existing C5b band breach), idler REDs unchanged;
report + fixtures regenerated.
