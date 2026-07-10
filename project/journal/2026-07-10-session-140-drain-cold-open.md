# Session 140 — 2026-07-10 — draining the cold-open playtest bucket (batch 1)

**Summary:** `/drain-inbox cold open` — the cold-open bucket holds 14 captures
from the human's 11:32 playtest of the reshaped cold open. This session drains
the oldest 5 (entry 6 folded in — same element as entry 5), all approved
wholesale: Space/Enter advance the VN (FB-197), the `You:` player-speech
grammar form + intro retags (FB-198), the fresh-divider made anchored + 30s
(FB-199), and the Continue button centred/enlarged (FB-200). F-entries in
`project/feedback-human/2026-07-10-playtest.md`.

## Commits

- **FB-197** — Space/Enter advance the VN scene: a per-scene document keydown
  handler routing to the same `introAdvance()` the click path uses; guarded
  against focused controls + open modals; removed on teardown. Two RED-able
  tests (the first genuinely went RED against a `Document`-target crash in
  jsdom before the `instanceof HTMLElement` guard).
- **FB-198** — the `You:` player-speech grammar form (the gap both intro.md and
  rung-beats.md had documented as a deferral): emits `voice: 'player'` with no
  static name; `playerSpeaker(state)` resolves the nameplate in the ONE log
  funnel (`applyRewards`) + the VN transcript, so the You:→Nameless:→Gonbei
  flips are automatic. All 11 narrator-quote MC lines retagged (intro 2,
  scenes 3, rung-beats 6); compiler RED tests for the form + its (voice)
  override rejection.
- **FB-199** — the fresh divider anchored + 30s (`FRESH_DIVIDER_TTL_MS`, one
  exported constant for the log and the VN): a live divider never relocates or
  stacks — new lines re-arm its fade — and it lives 30s past the last new line
  (was 4.5s). Source-derived timing test.

## Cross-lane notes

- Parallel drain lanes sanctioned mid-session (w3:p3 relay, human go-ahead):
  this lane owns cold-open, F-block FB-197..214. The voice-colour captures
  (11:39:11 · 11:39:59 · 11:43:03) are PARKED here — re-grouped cross-bucket
  into one `.vn-speech` lane for a single coherent fix.
- FB-198/FB-199 committed under SKIP_VERIFY in a co-agent red window
  (freeze-clock.ts / capture.ts / journeys.spec.ts, w6:p2 WIP); this lane's
  roster hand-run green each time. Held local until a green push window.
- FB-200 (Continue button CSS) waited out styles.css carrying w6:p2's
  uncommitted FB-215 hunk (a background poll; ~2 min), then landed clean —
  committing the file earlier would have swept their work.
- **FB-200** — Continue centred in the outcome column, air above the perk
  card, padding + font up to `--fs-body` (folds capture 6, same element).
  Live headless verify against the capture's save: 71×33 → 91×36, centred.
- Post-fix live verification (headless, `tmp/qa-drain-verify.mjs`): FB-197
  Space completes a mid-type line (10 → 309 chars); FB-198 the VN shows
  `You: "No."` / `You: "What name did I give?…"` in the real cold open.

## Batch 2 (human go-ahead: "do the rest of the batches")

- Lane claimed per ADR-171 (`inbox-claim.ts claim cold-open`, block
  FB-220..233); batch-1 sidecars stamped done (FB-220/221 = per-capture alias
  numbers for the two folded captures); the vn-speech colour cluster stamped
  `parked` with `lane: vn-speech`.
- **FB-222** — Progress unread dot after the cold open: the FB-59 baseline
  seeding never ran while the VN early-returned `render()`, so the intro-END
  render swallowed the mid-intro perk milestone as history. Seeding extracted
  to `seedLogSeenOnce` and called in the VN branch too. RED-proven test (real
  `choose_intro` flow) + live headless confirm.
- **FB-223** 💬 — "the cold open changed completely" is the deliberate C4.9
  fusion (v0.4.0), answered in the F-log; re-expanding the intro's decision
  surface is an intent call the human can promote to an HD-item.
- **FB-224/225/226** — the rake teach cooldown: `RAKE_TEACH_COOLDOWN_MS`
  (12s seed) applies while `rakeTeachPending(deliveredDialogue)` (the three
  gen-rake/keep/kept beats), so each teach line finishes typing before the
  next press. Bound derived from the registry + `TYPE_CADENCE_MS` (test);
  balance sim fingerprint unchanged (Δ 0.0, intentWallMs unmodelled by
  design). Live-verified 7s → ~17s during the beat, 7s after.
- **FB-227** (human ask mid-drain) — the cold open's GBA gold-block caret
  (`co-typing`) now rides the VN typing line too (same primitive, TST1);
  clears when the block yields to the panel. Test + live screenshot.

## The vn-speech lane (human: "do the three parked ones + other buckets")

- **FB-228..234** — the whole speech-colour cluster in one pass (3 parked
  cold-open + 3 r0 + 1 feedback-ui): `--v-player` → #8ec9ff asagi (the
  human's "obvious blue, more contrast"); VN narration unified on
  `--v-narrator`; `.spoken`/`.vn-spoken` 8px speech indent; and
  `inferQuoteVoice` — a narrator line's embedded quotes tint with the sole
  named NPC's voice (ambiguous stays neutral), one inference feeding the
  log's `.speech` spans and the VN's `--voice`. Three RED-able tests; live
  verify against the r0 capture's save. Cold-open bucket fully done →
  archived; r0/feedback-ui speech sidecars re-laned + stamped.
- w6:p2's FB-216 handoff honoured: the dead `.speech.player` rokushō rule
  removed (the MC's THIRD colour), and the human's mid-drain ruling (one
  token + three swatches, live) shipped as the DEV → Story "MC colour"
  swatch trio → **HR-22** (A #8ec9ff ships until picked).
- F-number race survived: w6:p2's old relayed block (FB-215..224) collided
  with my claim-tool block on FB-220 — caught by the inbox-ledger gate,
  resolved by herdr message (they renumbered; my 220..227 were already
  pushed). The claim tool is now the ONLY block source.
- Queued next (human, mid-lane): RE-OPEN the cold-open design (FB-223 — the
  human saw a better cold open than the C4.9 fusion) — needs the design
  conversation, not a drain fix.

## HD-37 — the cold-open re-arc (ruled + planned)

- The human re-opened the C4.9 fusion mid-session (FB-223 → HD-37) and RULED:
  restore all three acts + three sequential picks, hybrid (take-a soan prose
  stays act 2) + fresh ADR-139 diverges for the dream + Genemon acts (seeded
  from `b221d6e~1`). Plan authored + queued:
  `docs/plans/t0/fable-2026-07-10-cold-open-rearc.md`.
- Process hardening from this session's cross-agent friction: the herdr
  send-needs-Enter recipe documented (AGENTS.md bullet +
  working-agreements § Cross-agent messaging) after three coordination
  messages sat unsubmitted; the capture tool's pre-allocated fb collision +
  the vitest unhandled-error push blocker were both relayed to w6:p2 and
  resolved same-session.

## HR-22 closed — asagi sky locked

- The human locked **A · asagi sky #8ec9ff** same-session ("lock in asagi
  sky") — already the shipped token, so the close is pure cleanup: the DEV
  Story swatch trio stripped from dev.ts (zero flag-debt), HR-22 →
  archive.md. Git history keeps swatches B/C.

## Post-checkpoint follow-ups (human asks)

- **FB-235** — the FB-228 collision's TRUE root cause found and fixed: claims
  recorded `pane: 'unknown'` (the CLI only read `--pane`, never
  `HERDR_PANE_ID`), failed the liveness probe as DEAD, and the capture-time
  allocator rightly ignored the "dead" claim's reserved block. `inbox-claim`
  now defaults the pane from `HERDR_PANE_ID` (+ a loud WARN when unknown);
  proven live — a fresh claim reads `w6:p1 … alive`. The capture allocator
  itself was already correct (new captures stamped FB-261..263, unique).
- FB-228's distilled rules graduated to `ui-design.md` §2 (one token per
  voice per surface · narration=ground/speech=figure+indent · quote-tint by
  unambiguous inference); the chroma-vs-lightness law was already distilled
  by the co-agent lane (FB-216/FB-234).

- ui-design.md §2 distillation committed as a COORDINATED CARRY: my FB-228
  laws hunk + w6:p2's chroma-vs-lightness paragraph (FB-216/FB-234) in one
  commit, on their explicit "option 2, yes — take both hunks" handoff (they
  checkpointed their other files clean of the shared file).

## Next intended steps

- The human reads the HD-37 plan → step 1 (mechanical restore) can start on
  green-light; the two diverge units follow (Fable-routed briefs).
- The r0 + dev buckets still hold open captures for whoever drains next.
