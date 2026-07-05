# Audit — /prd-ripple + prd:drift: did they actually assist D-117?

**Date:** 2026-07-05 (session 83) · **Requested by:** the human ("it's unclear
if they actually assisted in implementing the PRD on a diet system") ·
**Scope:** the `/prd-ripple` skill, `src/scripts/prd-drift.ts`,
`gen-prd-regions`, and the pre-commit nudge — implementation soundness +
evidence of real-world assistance.

## Verdict

**YES — they assisted, with receipts** (three drift catches rippled to canon
before this audit, a fourth during it). But the audit found **two soundness
defects** in the drift detector — a masked-name false-CLEAN and an unscanned
spec-altitude registry hiding 3 real drift items — **both fixed + tested in
this session** (commit: `feat(scripts): prd-drift whole-word match + quest
coverage`).

## Evidence of assistance (verified in git, not assumed)

| Receipt | What happened |
|---|---|
| `e612401` | stance names rippled to the PRD + ripple-during-T0 locked (D-128) |
| `58a94e0` | §4 weapon ripple + T0 roster gen-regions (D-128/D-129) |
| `e82ce6c` | today: prd:drift caught 3 unrippled cast names (D-110 rung companions) → rippled |
| this audit | the upgraded detector surfaced 3 spec-invisible built quests → rippled (§5 T0.7) |

Mechanism checks, all verified live:

- **Pre-commit nudge** (`.githooks/pre-commit:95`) — fires on
  `src/core/content/*` staged without a PRD touch; warn-only (A11);
  `balance.ts` correctly EXCLUDED (§4 is ripple-frozen — nudging a PRD edit
  there would push against canon).
- **gen-prd-regions** — 3 live regions (t0-rung-titles, t0-weapon-roster,
  t0-bestiary), `--check` verify gate, derived-fixture tests. Drift-proof by
  construction for those chunks.
- **The skill procedure** — run end-to-end this session; the four-way
  classification routed correctly (system/narrative, BUILT → targeted ripple,
  no new ADR since D-110 carries the why).
- **Footprint honesty** — since D-117, ~15 content-registry commits vs 3
  ripple commits is *by design*: the F5 narrative + log-content migrations
  moved text without changing spec facts. No missed-ripple backlog was found
  beyond what the detector defects hid (below).

## Defects found

1. **Masked-name false-CLEAN (FIXED).** `mentioned()` used substring
   `includes()`: "Toku" (the Dowager) counted as mentioned via
   Toku*bei*/Toku*jirō*/Toku*emon* — proven counterfactually (delete every
   real Dowager mention; the check still passed). Fixed with
   `hasWholeWord()` — unicode-aware boundaries (`\p{L}`, not `\b`, so
   Tōzō/Sōan match correctly). NAMES holds 19/19 under the strict matcher, so
   no latent drift was hiding behind the bug *today* — but the failure mode
   was real and silent (R3: a false green is worse than no check).
2. **QUESTS unscanned (FIXED).** 3 of 4 built T0 quest titles appeared
   nowhere in the PRD and no check could see them. Quest titles are above
   spec altitude (a whole built quest is more spec-visible than a mob name);
   now in SPEC-ALTITUDE, and the 3 titles are rippled into §5 T0.7 as the
   named PEST/HUNT/CLEAR/DEFEND starting set T1.7 already referenced by type.
3. **ACTIVITIES + ESTATE_STAGES (accepted, documented).** Verb-phrase labels
   ("Patch the kura") that the PRD states as prose ("kura patched &
   re-roofed") — label-presence over them would cry wolf (A11). Added to the
   INFORMATIONAL band (coverage visible, never drift), with the reasoning in
   a source comment.
4. **RETIRED list is hand-maintained (open, norm-rung).** The retired-terms
   config depends on each rename ADR's author remembering to add an entry in
   the same commit. No sound gate can enforce it (the checker can't know a
   rename happened); it stays a norm — flagged here so it's a *known* norm.
5. **No tests on the matching layer (FIXED).** The pure fns were untestable
   (top-level CLI). Extracted + CLI-guarded (the gen-prd-regions idiom);
   8 unit tests, the masking + unicode-boundary cases RED against
   `includes()`/`\b` implementations. The CLI itself stays untested by
   choice — coupling tests to the live PRD corpus would go red on unrelated
   prose edits.
6. **Scope is presence-only (by design, honest).** Semantic drift (mechanics
   described wrongly in prose) is explicitly out of scope — the header says
   so, the report is warn-rung, and D-117's answer to semantic staleness is
   the compression sweep + human review, not a lint. No action.

## What this does NOT change

The T0 compression sweep (Flow 2, `/prd-compress`) stays dormant: its trigger
(R1) is open, and the backlogged Phase-2 economy redesign will re-core T0's
economy first. The detector upgrades make the *interim* ripple regime
(D-128: ripple during T0, no backlog) materially more trustworthy — which was
the point of the audit question.
