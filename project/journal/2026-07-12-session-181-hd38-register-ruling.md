# Session 181 — HD-38 ruled: the T0 register canon (ADR-185)

**Date:** 2026-07-12 · **Model:** Opus · **Shape:** a piece-by-piece HD-38
walkthrough with the human, then Wave 0 of the re-voice plan.

## What happened

The human asked to be run through **HD-38** — the four direction forks (D1–D4)
from the 2026-07-11 narrative register audit — *"carefully together, piece by
piece, because the plan is supposed to be built by fable and this is opus."*
Mid-session they added that **Fable is at 100% of its weekly cap**, which is
what ultimately moved Wave 0's drafting onto Opus.

Each fork was put separately, and each was **re-verified against the source
before it was put** (PH2 — the audit is another agent's work, not to be
relayed on trust). That check changed the outcome twice.

## The rulings (all four adopted → ADR-185)

- **D1 — audience + clarity floor: adopted, floor as an OUTCOME test.** §0.9.6
  locks the 14–21 / light-novel reader (the project had **no audience statement
  anywhere** before today). §0.5.5 now binds ALL fiction text; §0.5.1's *"cut"*
  means **say less**, never *make the reader assemble it*. The plan's proposed
  **per-scene device quota was rejected** — the disease is **inference load**,
  not grammar (*"Water first, always."* is a verbless fragment and clear;
  *"You are learning the house's true size by what it will let itself be seen
  without."* is a well-formed sentence and a wall), and a quota is both
  unenforceable and gameable. The teeth is the **blind paraphrase pass**, which
  can actually go RED. Binds T1+ now.
- **D2 — Genemon two-voice: adopted.** Book voice = the ledger (which is what
  finally makes the clip *mean* something); man voice = plain complete
  sentences for all talk.
- **D3 — MC interiority: adopted, bounded.** Attention + intent, **never
  memory** — recall is the dream's job on the dream's cadence (§0.5.4), and an
  interior line that lets him remember would cannibalize the dream, the T3
  reunion, and every misreading in the cast at once. Things and counts, never
  feelings. **§0.5.8 person locked** in the same breath: *"you"* = what you
  live, *"he"* = the overheard register, until R7 names him.
- **D4 — scope: "worst-first, then a full sweep"** (the human's words) — not
  either/or.

## The two audit findings the source-check overturned

1. **The R0 reward lines stay third-person.** The audit read them as an R0
   misstep and wanted them flipped to second person. But **every** rung reward
   line, R0→R7, is third-person overheard speech — it is the device the R7
   naming pays off. Asked directly, the human confirmed the *"Genemon at the R0
   rung-up"* flag was the **Terms speech** (the R1 beat, which fires at that
   rung-up), not these lines. That promoted the Terms scene to **W1** and
   deleted a wave.
2. **The cold open needs no re-lead.** The audit says it *"leads with the dream
   inventory."* The authored order is `lede → weir → wake → dream` — already
   concrete-first. The real burden is **Intro 1**, which replays the dream
   verbatim and then makes the game's **first choice** a pick among three
   abstractions drawn from things the MC cannot remember.

## Landed

Wave 0 (canon) in full: **ADR-185** · `01-laws.md` (§0.5.1 reworded · §0.5.5 =
the clarity floor · §0.5.8 person, new · §0.9.6 audience, new) · `04-cast.md`
(Genemon's two voices · the MC's bounded inner line) · PRD §1.3 reader-and-
register paragraph · HD-38 closed + archived + verbatim intent captured · the
plan re-ranked to W1–W6 and flipped to 🔧 LOCKED.

## Shared-tree state — READ THIS BEFORE PUSHING

- **The tree is RED, and it is not mine.** A co-agent is mid-refactor across
  `src/core/content/{market,people,ranks,surfaces}.ts` + a new
  `src/core/reveals.ts`; `surfaces.ts:173` throws `ReferenceError: getNode is
  not defined`, which takes down the `checkpoint` and `gen-prd-regions` gates.
  My change is markdown-only and cannot cause a `ReferenceError`.
- **Proven, not assumed** (PH3): I copied my 8 changed docs onto a clean
  `HEAD` worktree and ran the docs lane there — `gen-prd-regions` went
  **green**, confirming the red is theirs. So this commit went in with
  `SKIP_VERIFY=1` and **stays local**; per the working agreement, don't fight
  someone else's red and never push one.
- **One real thing is left undone on purpose.** The proof also showed
  `docs/plans/README.md`'s generated region is stale — my plan's Status flipped
  PROPOSED → LOCKED. I did **not** run `checkpoint` and commit it, because the
  co-agent has that same file dirty (they're archiving save-format-streamline
  through it) and committing it would sweep their in-flight work. Whoever
  pushes next should `pnpm run checkpoint` and stage the README then.

## Next intended steps

**W1 — the Terms scene** (`rung-beats.md` R1): 3 blind Opus takes
(*plain-and-warm* / *plain-and-dry* / *minimum-change*) → blind paraphrase pass
→ scorecard Pass 2 per take → pick + redlines → `takes/` bundle on the DEV
story switcher → HR item. The human's acceptance test is playing R0→R1 live.
