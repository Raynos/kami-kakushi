# Session 218 — 2026-07-18 — the talk-plan ask waves (ADR-139)

## ☀️ SUMMARY (read this first)

Finishing `docs/plans/fable-2026-07-17-talk-system-redesign.md`: the
per-person ADR-139 ask-answer waves — the only remaining work after
s210 shipped steps 1–5 — plus the deferred wave-1 wiring (journal
s210 §3: takes bundles could not yet carry ask units). Three domain
bundles (asking-voice labels · house answers · village answers +
discovery hints), each 3 blind takes → self-pick → HR item.

Crowded tree: co-agents live on pictogram-ab (w2), bestiary (w8),
phone-shell (w4) — s216/s217 journal numbers are theirs; every commit
here is file-level pathspec with a staged-set recheck.

This file is HISTORY, not live state — the live snapshot is
`project/status/project-status.md`.

---

## 1 · Wave-1 wiring — ask units reach the story overlay

The s210 §3 deferral, closed:

- **Takes compiler** (`src/scripts/narrative/takes.ts`): `## ask`
  blocks in take docs canonicalize against canon asks — the label
  always re-voices (`ask.<id>.label`; the parser requires `label:`),
  static answer lines re-voice a SUBSET by canon line id
  (`ask.<id>.<lineId>`, the dialogue pattern). Prose-only gate REDs:
  unknown ask id · unknown line id · missing line id · prose on a
  native-answered canon ask · native-key mismatch. 5 RED proofs in
  `takes.test.ts`.
- **Lazy label** (`src/core/content/asks.ts`): `AskDef.label` is now
  a getter through `storyText('ask.<id>.label')` — ASKS is built at
  module load, before any DEV take is active, so a plain field froze
  canon. The answer closure was already overlay-aware (s210).
- **Native branch prose re-homed to flavor keys** (the adr187-sleep
  precedent): house-wants (2 branches → `askHouseWantsTop/Ladder`)
  and body-mend (3 branches → `askMendSound/Marked/Down`) now live in
  `narrative/flavor.md`, read via `flavorLine()`; `«rank»`/`«next»`
  are runtime tokens ask-natives.ts substitutes AFTER the overlay
  lookup (rank titles are state, not NAMES — `{key}` can't carry
  them). Text unchanged verbatim (mechanical re-home; Wave B upgrades
  the words). Drift pin in `asks.test.ts` (the discoveries hintKeys
  pattern).
- **DEV reader**: `unitOfKey` maps `ask.*` → `ask:<id>`;
  `readerUnitLines` renders ask units (label as a player line +
  static lines, take columns filter by covered keys); `LIVE_UNITS`
  gains `ask` — ask units are live-switchable, not reader-only.

Known DEV-only wrinkle, on purpose: default ask freshness is a
text-digest of the answer (s210 §6), so flipping a take that changes
an answer re-lights heard asks in a DEV session. Prod never sets the
overlay; canon saves are untouched.

Verified: full `pnpm run verify` green (21 gates), the new RED proofs
among them. `md:wrap` on flavor.md reflowed the WHOLE file and merged
a comment into prose (gen RED at flavor.md:195) — reverted, re-added
hand-wrapped; wrap tool is unsafe on files with mixed authored widths.

## 2 · The three ask waves — 9 blind takes, 3 picks, 3 HR items

Restructure first: labels-only takes are illegal on STATIC asks (the
parser demands label + native-or-prose), so the waves re-bundled by
what's legal AND coherent: **ask-voice** = the 14 native asks' labels
(label-only takes legal) · **ask-house** = the standing ask + the
house-wants/mend flavor branches · **ask-village** = the three static
village asks + the NEW D2 discovery-hint asks. One gap caught
mid-flight: the standing ask's label belonged to no wave — each W-B
author was messaged for it in their take's voice (blind preserved).

Ran the ADR-139 procedure whole: Pass-1 brief (committed working copy
`tmp/ask-waves-pass1.md`) → 3 distinct dramatic briefs per bundle → 9
independent blind authors (general-purpose agents, parent model) → 9
verbatim captures in `tmp/ask-waves-takes/` → Pass-2 scorecards + self
picks (`tmp/ask-waves-pass2-verdicts.md`). Picks — all three landed on
take b, independently: **W-A "the ladder is audible"** (address-first
up the house, yard-talk down — the standing fiction made audible),
**W-B "the man behind the book"** (ledger fact + exactly one human
beat — the regard mechanic voiced), **W-C "work talk only"** (the
world leaks through the labour; the material hints are the corpus's
best P15 pointing).

Landed: asks.md re-voiced whole (18 labels + 3 static answers) + 3
NEW asks (`matsuzo-waters` · `oume-margins` · `rokusuke-timber`,
native `waters-hint`/`margins-hint`/`timber-hint` branching on the
discovery latches — text-digest freshness re-lights each ask when a
find changes the answer); flavor.md gains the 7 hint branch keys and
the 5 house/mend branches at pick voice; bundles `ask-voice` /
`ask-house` / `ask-village` hold the six losing takes, live in the
DEV Story switcher; HR-49/50/51 filed (HR-48 was taken by the
pictogram co-agent mid-session). Pass-2 demerits that killed takes:
P10 prop-contracts (a mattock the game can't hand over), invented
drill canon, asserted surveillance, two-sentence chrome labels.

<!-- append further entries below, in order -->

---

## Next intended steps (current)

1. Land the two commits (wiring · waves) in a green co-agent window.
2. Close the plan: Status ✅ → archive → snapshot → checkpoint push.

## Landmines (current)

- Crowded tree (3 co-agents): pathspec-commit file-by-file, recheck
  `git diff --cached --name-only` before every commit; journal
  numbers race (s216/s217 taken mid-session).
- HR numbers race with co-agents — claim them by editing review.md
  LATE, immediately before the commit that files them.
- `md:wrap` reflows whole files — never run it on flavor.md again;
  hand-wrap new sections.
