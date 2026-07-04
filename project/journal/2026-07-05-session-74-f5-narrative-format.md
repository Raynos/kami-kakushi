# Session 74 — 2026-07-05 — F5: narrative authoring format (story as text, TS generated)

## ☀️ SUMMARY (read this first)

Building the F5 plan (`docs/plans/fable-process-F5-narrative-format.md`) end to
end — all four phases in this session per the human's routing call. Story
content becomes structured-markdown source under `src/core/content/narrative/`;
`gen-narrative` compiles it to generated `.ts` registries; the hand-written
modules keep their types/helpers and re-export the data. This file is HISTORY —
live state is `project/status/project-status.md`.

Human calls locked at session start (AskUserQuestion): format mostly-as-written
(small liberties OK, documented in the format README); Fable builds all four
phases; migrate now (don't wait for R8); Shigemasa's R7 `'official'` voice is
INTENTIONAL — keep it, allowlist the Ph2 WARN.

---

## 1 · Ph1 — format spec + compiler + rung-beats back-port

- `src/scripts/narrative/parse.ts` — md → AST, every node carries authoring
  file:line; reserved-key annotation grammar; HTML comments = authorial notes.
- `src/scripts/narrative/emit.ts` — AST → TS source; speakers emitted as
  references (`NPC_NAME.kihei`, `NAMES.pedlar`) so renames stay single-source;
  `after:` compiles to the `asked.has()` gate closure.
- `src/scripts/gen-narrative.ts` — CLI mirroring gen-docs: bare = write,
  `--check` = byte-compare (drift error names the `.md` to edit). Output piped
  through **oxfmt** (documented liberty: the plan said prettier; the repo
  formatter is oxfmt) so the gen file passes `oxfmt --check` untouched.
- `src/core/content/narrative/rung-beats.md` — the R1→R7 beats as a readable
  script. NOT hand-transcribed: seeded by a throwaway inverse transcriber
  (`tmp/transcribe-rung-beats.ts`, git-ignored) driving the format from the
  live `RUNG_BEATS`, so the prose is byte-faithful by construction.
- `src/core/content/narrative/README.md` — the format spec + liberties.
- `src/core/content/rungBeats.gen.ts` — the generated registry.
- `src/core/content/narrative-equivalence.test.ts` — TEMPORARY (retires at the
  flip): deep-equal over serializable fields + behavioral gate equality over
  the complete `asked.has()` domain (∅ + every singleton + a foreign id + one
  pair).
- **Could-go-RED proof performed:** mutated one word (`day-hire`→`night-hire`)
  in the `.md`, regenerated, test went RED; reverted, green, `--check` in sync.
  (First attempt at the mutation hit a hard-wrap seam and no-op'd — the sed
  pattern spanned two lines; lesson: verify the mutation landed before trusting
  the green.)
- `package.json` — `gen:narrative` + `gen:narrative:check` scripts.
- Full `npm run verify` green (16 gates, ~4.9s) pre-flip.

## Next intended steps

1. Flip: `rungBeats.ts` drops its literal, re-exports from `rungBeats.gen.ts`;
   retire the equivalence test in the same commit; `rung-beats.test.ts` (the
   D-110 e2e suite) must pass unchanged — that's the standing seal.
2. Ph2 — validation roster in `validate.ts` (each RED-able), `VOICE_CATEGORIES`
   in voices.ts, the `gen-narrative` gate joins `gates.ts`, `verify:budget`.
3. Ph3 — intro/dialogue/cold-open back-port (same equivalence discipline).
4. Ph4 — `docs/content/t0-story.md` reading doc + R8 pointer + repo-map.

## Landmines

- The transcriber lives in `tmp/` (git-ignored) — Ph3 reuses the pattern; if
  the session dies, regenerate it from this journal's description or re-derive.
- Two other agents are live in this tree (day-labourer hover fix; F3/F4
  parallelism check) — staging is by explicit path only.
- `rungBeats.gen.ts` imports `type { RungScene } from './rungBeats'` while
  rungBeats.ts (post-flip) imports the data back — type-only, erased, no
  runtime cycle.

---

## 2 · Ph1 flip — rungBeats.ts re-exports the generated data

- `src/core/content/rungBeats.ts` — 655 → 91 lines: the literal + the
  narr()/says()/pedlar() helpers retire; types + helpers stay; the module
  re-exports `RUNG_BEATS` from `rungBeats.gen.ts` (zero import churn).
- `narrative-equivalence.test.ts` deleted at the flip per the plan (it would
  compare a re-export to itself); the D-110 `rung-beats.test.ts` suite passed
  UNCHANGED over the generated data — that's the standing seal.
- One shared-tree pause: a co-agent's in-flight `src/ui/capture.ts` red
  (unused var) blocked the commit's verify; waited for their tree to green
  rather than touching a file I don't own.

---

## 3 · Ph2 — validation roster + the gen-narrative verify gate

- `src/scripts/narrative/validate.ts` — the §3 roster over the AST, every
  finding citing authoring file:line: speaker resolution, real voices
  (`VOICE_CATEGORIES`), globally-unique topic/option ids, `after:` resolution
  (non-self, non-cyclic), memory NPC + ±3 warmth clamp, bonus attr / stance
  rosters, motivates ⊆ SURFACE_IDS **and verbatim-equal to
  `RANKS[rank].rewardOnReach.unlock`** (the coherence check rungBeats.ts asked
  for — probed against real data first: all 7 rungs hold), rank keys real +
  no R0 + no duplicates. WARN (not error) on off-register voice overrides,
  with the human-signed allowlist `shigemasa:official` (ruled intentional
  2026-07-05).
- `src/core/content/voices.ts` — `VOICE_CATEGORIES` runtime roster derived
  from an exhaustive `Record<VoiceCategory, true>` (union drift = tsc error
  both directions; the one hand-written enabling change).
- `src/scripts/narrative/validate.test.ts` — 25 RED proofs, one per
  validation, fixtures derived from RANKS/NPC/ATTR/STANCE sources of truth.
- `gates.ts` — `gen-narrative` joins the roster (scope 'code'; 17 gates).
- DoD proofs: hand-editing `rungBeats.gen.ts` → gate RED naming the `.md`
  (performed + reverted); `verify:budget` median 4.16s, 0.84s headroom.
