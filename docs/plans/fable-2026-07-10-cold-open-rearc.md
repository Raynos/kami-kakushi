# The cold-open re-arc — three acts, three picks (HD-37)

**Status:** 🔨 IN-PROGRESS — steps 1–2 LANDED (2026-07-10: the three-act
restore + the ADR-132 balance gate, `verify` 18/18 + `verify:balance` GREEN);
next: step 3 (diverge unit A). Human ran the decision walkthrough in-session
(2026-07-10, supersedes the queued full read) and gave the go: full arc,
this session. Verdicts: act order `dream → soan → genemon` ✓ · title-card
lede REWORKED to fit dreaming-first (not moved, not kept) · nine perks
restore AS-WAS (sim is the gate) · ~2× cold-open length ACCEPTED (FB-8
telemetry watches).
**Confidence:** ( 30% Opus, 70% Fable ) — the engine/restore half is mechanical
(Opus-safe); the two narrative-diverge units + the act-seam prose judgments
concentrate taste (Fable-leaning).

## The ruling (HD-37, human 2026-07-10)

The C4.9 one-scene fusion is re-opened: the human played the live cold open and
wants the pre-C4.9 shape back — _"I saw a cold open that was better then what
we have right now."_ AskUserQuestion verdicts, 2026-07-10:

- **Restore all three elements** — the memory/dream beat · Genemon's own
  scene · three sequential perk picks (character *building*, not a one-pick
  declaration).
- **Approach: hybrid + fresh diverge** — the human-verdicted take-a sickroom
  prose STAYS as the middle act; the restored acts (dream + Genemon) are
  re-authored via **narrative-diverge (ADR-139)**, seeded by (not copied from)
  the pre-C4.9 fiction.

## What exists to build on

- The FULL pre-C4.9 three-scene intro is at **`b221d6e~1`**
  (`src/core/content/narrative/intro.md`): `soan` → `dream` → `genemon`, each
  with a 3-option net-zero decide + perk (9 perks total across the arc).
- The engine's `introBeat` cursor already walks multi-scene intros (it did
  pre-C4.9); C4.9 only shrank the data + the validator's
  `INTRO_SCENE_ORDER = ['soan']` (`src/scripts/narrative/validate.ts:53`).
- The You:→Nameless: flip latches on the **soan** pick
  (`intents.ts` `choose_intro`, `scene.id === 'soan'`) — with soan as act 2,
  act 3's MC lines correctly read `Nameless:` (bible R0: the flip is
  witnessed mid-cold-open). Act-order decision below.

## Steps

1. **Structure first (mechanical restore, no fiction yet).** Restore `dream` +
   `genemon` scene skeletons into `intro.md` from `b221d6e~1` (prose marked
   `<!-- seed: pre-C4.9, to be diverged -->`), reorder `INTRO_SCENE_ORDER`,
   regen, fix the intro e2e/journey specs + fixtures (`post-cold-open` etc.),
   and re-verify the flip point: **act order is `dream → soan → genemon`**
   (memory fragments before waking fits the fiction; soan stays the name
   beat). Full verify + the mobile-journey intro path green before any prose
   work.
2. **Balance gate (ADR-132).** Three net-zero picks + three perks per run vs
   today's one: run `verify:balance` + `balance:report`; the sim personas'
   intro pick behavior may need a persona rule (greedy/idler/explorer pick
   deterministically). Perk power stays the pre-C4.9 nine until playtest says
   otherwise — commit the t0-pacing diff with the change.
3. **Narrative-diverge unit A — the memory/dream act** (ADR-139: 3 blind
   takes, distinct dramatic briefs; DEV → Story switcher review; per-take
   taste scorecards; self-pick + HR-item).
4. **Narrative-diverge unit B — Genemon's scene** (same procedure; must keep
   canon seams: the day-book idiom, the daybook/daybookVerbs reuse keys, the
   R0 "rakes; hauls" wage line).
5. **Act seams + the fresh-eyes pass.** The take-a soan prose keeps its
   verdicted lines; only the inter-act connective tissue may be touched (a
   redline-style diff for the human). One full playthrough capture
   (screenshots) attached to the HR-item.
6. **Ripple:** `/prd-ripple` (system/narrative class — §3.1 cold open), the
   story-bible t0 sheet if the act order differs from its text, CHANGELOG on
   the next `/ship`.

## Who builds this — Fable or Opus?

Step 1–2 (restore, validator, e2e, balance): **either** — mechanical, gated.
Steps 3–5 (the two diverge units + seams): **Fable-routed** briefs/judging per
the ADR-139 pattern; blind take agents inherit the session model (D-124).

## Risks

- The 3-pick arc lengthens the cold open (~2× reading time): pacing telemetry
  (FB-8) should watch the first fresh run after ship.
- 9 perks re-enter the economy — step 2's sim verdict is the gate, but perk
  *fun* balance is HR territory, flagged in the unit-A/B HR-items.
- The dream act pre-wake vs the FB-14 title-card lede ("Open your eyes")
  ordering needs one taste look in step 1 (the card currently narrates waking
  BEFORE the VN opens). **RULED (human, 2026-07-10): rework the card line** —
  a new lede that fits dreaming-first; fiction-voiced, so it diverges
  (folded into unit A's scope, step 3).
