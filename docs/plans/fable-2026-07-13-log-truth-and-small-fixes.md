# Make the ADR log tell the truth, and land the four small fixes

**Status:** 🔧 IN PROGRESS (2026-07-13, session-197 pickup; proposed
session-187)

**Pre-build rulings (human, 2026-07-13, session-197 Q&A):**

- **H3:** the retired rice-withdraw intent **rejects loudly** (visible
  log-line refusal, RED-able in the test) — not a silent no-op.
- **H6:** pure MIT text, `Copyright (c) 2026 Jake Verbaten`; the About
  modal keeps carrying the content all-rights-reserved split (no
  carve-out note in the LICENSE file itself).
- **ADR-068 retirement** re-confirmed; **HD-40 still open**, so
  ADR-184 gets the "held, pending HD-40" wording as written.
- **M3 fallout:** fix latent tier-arithmetic errors locally; stop and
  surface if they sprawl beyond a handful.
- **Sequencing:** the human picked ADRs-first (w2:p5 reported done),
  but at pickup w2:p5's ADR-192 entry sat UNCOMMITTED in
  `decisions.md` — go-condition unmet, so the executing agent flipped
  to small-fixes-first (step 5), pinged w2:p5 to land ADR-192, and
  holds the `decisions.md` sitting until that commit exists. New ADRs
  take numbers at write time (193+ as of the ping).
**Confidence:** ( 90% Opus, 10% Fable ) — mechanical truth work against
file:line evidence already gathered; no taste, no fiction.
**Template:** ops

## Who builds this — Fable or Opus?

**Opus.** Every edit is a transcription of a ruling the human already
made (the 2026-07-13 finding walk, recorded in the session-187
journal) against evidence already verified twice. Zero taste calls.

## Goal

The ADR log stops misleading in both directions (stale `BUILD TODO`s
for shipped work; ✅ claims for unbuilt mechanisms), today's human
rulings land as record, and the four smallest ruled fixes ship: the
rice-withdraw retirement (H3), the `TierId` type (M3), the `save-e2e`
`beforeAll` one-liner (M8), and the root `LICENSE` (H6).

This is the executor of the 2026-07-12 sweep's S1/S5/S6 doc scope, as
re-ruled finding-by-finding by the human on 2026-07-13. Parent survey
(all file:line evidence):
[`opus-2026-07-12-adr-embedded-work.md`](../../project/archive/opus-2026-07-12-adr-embedded-work.md)
(archived with this split).

## Go conditions

- The 2026-07-13 rulings stand (they are the newest human steer,
  ADR-022).
- No co-agent is mid-edit in `docs/living/decisions.md` (check herdr
  peers; the log is one file and merge pain is real).
- HD-40 is still open when ADR-184's text is corrected — the edit says
  "held, pending HD-40"; if HD-40 has since closed, transcribe its
  ruling instead.

## Procedure

1. **Strike the stale markers (append-only, ADR-022):**
   ADR-098/100/101/102's `BUILD TODO (v0.3.2)` lines → strikethrough +
   ✅-shipped pointers (`render.ts:280-290`, `balance.ts:197` +
   `combat.ts:73-76`, the stance axis, `weapons.ts`). ADR-094 →
   superseded by ADR-153 (`step.ts:27-29` tombstone). ADR-099 →
   superseded by ADR-163. ADR-106 → superseded by ADR-144's shipped
   shell. ADR-127's open picks → one-line note that they live as
   HR-2A/2B/5/6.
2. **Flip ADR-179 ▶️ → ✅** (fully built: `state.unlocked` gone,
   v10→v11 migration, `SCHEMA_VERSION = 11`), leaving its owed S7 PRD
   ripple named.
3. **Correct ADR-184:** "cooking is SITED" → held, pending HD-40; fix
   the stale `reveals.ts:50-51` comment in the same commit.
4. **Write the three new ADRs** (next free numbers; note the ADR-147
   numbering gap while there):
   - **Retire ADR-068:** T0 ships silent — the 2026-07-07 mute (the
     synth cues read comedic) is canon, confirmed 2026-07-13; HR-1 is
     judged silent knowingly; audio returns as a future concern with
     real samples, not synth. (The built `sfx.ts` engine stays parked.)
   - **Merchant state (extends ADR-163 §5):** merchants get permanent
     state — inventory + money, every buy/sell mutates it, diminishing
     sell prices per item (human, 2026-07-13). Build plan:
     [`fable-2026-07-13-merchant-state.md`](fable-2026-07-13-merchant-state.md).
   - **The sweep omnibus:** one ADR recording the 2026-07-13
     finding-walk rulings with pointers to each new home (H1→sickroom
     plan, H4→greeting-ids plan, M7→live-swap plan, M1/M4/M5/M6/M9→
     `t1/`, M2→`t2/`, the six tier placeholders), so the log's own
     drift-fix is itself in the log.
5. **The four small fixes**, each its own verify-green commit:
   - **H3:** retire the RICE withdraw path — `intents.ts:1267` rejects
     (or drops) `withdraw` of rice; remove the "Withdraw all rice" row
     (`render.ts:~5396`) and the vestigial-rows comment. Coin
     deposit/withdraw stays.
   - **M3:** `type TierId = 0|1|2|3|4|5|6`; `state.tier: TierId`
     (`state.ts:239`); a tier display-name table as the single source.
   - **M8:** `save-e2e`'s `playToAscension` moves into `beforeAll`
     (`src/persistence/save-e2e.test.ts:44`).
   - **H6:** root `LICENSE` (MIT) matching the About modal's
     `Code: MIT` (`render.ts:625`); content stays all-rights-reserved
     (already stated in the modal, not the LICENSE).

## Verification

- **H3:** a RED-able `intents.test.ts` case — `withdraw` of rice is
  refused / absent while coin withdraw still works; the storehouse UI
  renders no rice-withdraw button.
- **M3:** `tsgo` green is the check — an out-of-range tier literal now
  fails to compile (could go RED; the bare `number` never could).
- **M8:** full-lane vitest green; the suite's wall-time should not
  regress (spot-check `VERIFY_FULL=1`).
- **Docs:** `pnpm run verify` docs lane green — `deferred-work`,
  `verify-plan-template`, `inbox-ledger` all stay green; every ADR
  edit is backed by the parent survey's file:line evidence.
- **No player-reach capture needed** — the only player-visible change
  is a removed vestigial button (H3), covered by the UI assertion
  above.

## Sync ripple

- **PRD:** the ADR-179 flip re-surfaces its owed ripple in
  `docs/living/prd/06-tech-architecture.md` — run `/prd-ripple` for it
  in this pass (it is exactly the "unlock-latch" edit ADR-179 names).
  The audio retirement: check `docs/living/prd/` for an SFX promise
  and annotate if present.
- **Story-bible:** none — no fiction moves; the mute and the market
  are mechanics-record edits.
- **Living docs / registries:** none regenerated — H3/M3/M8 touch no
  balance magnitudes (the withdraw verb moves no prices), so no
  ADR-132 flow. `docs/repo-map.md`: add one line for the new
  `docs/plans/tn/` far-tier dir.
- **CHANGELOG:** none — no version bump ships this plan.

## Aftermath

- The parent survey sits in `project/archive/` as the evidence record;
  its reading-queue line is removed (superseded by the five child
  queue lines).
- The next `decisions.md` reader finds no stale queue-shaped lies; the
  `deferred-work` gate guards the shouted case going forward.
- `BACKLOG.md` untouched — nothing here was parked-never-nag.

## Risks

- **Shared tree, one hot file:** `decisions.md` is 3,700+ lines and
  other agents cite it constantly. Do all ADR edits in ONE sitting,
  commit by explicit pathspec, re-check `git diff --cached
  --name-only` (a co-agent may stage it).
- **ADR numbering race:** another session may take the next ADR number
  mid-edit — take the numbers at write time, not from this plan.
- **The ADR-068 retirement reverses a human-signed ✅** — the entry
  must read as the human's own call (2026-07-07 mute, 2026-07-13
  confirmation), never as agent override.
- **M3 may surface latent type errors** in code doing tier arithmetic
  (`tier + 1`); widening helpers may be needed — keep the fix local,
  never weaken to `number`.
