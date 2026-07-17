# Talk system redesign (FB-415): Brainstorm / Discovery Notes

Date: 2026-07-17 · Goal: work out what "chatting" with characters IS —
the gameplay point and the story point — and turn the answers into a
`docs/plans/` plan for the redesign.

Origin: playtest capture FB-415 (r0 bucket, 2026-07-13). Verbatim core:
_"Characters are a button and you get a random low context line. This
is the RPG game flavor text equivelant of walking up to a character in
a village and pressing A to speak and you get nothing just some flavor
text. That the flavor text goes into the 'Story' panel, if we wanted
flavor text it could go into 'Now'. This who 'chatting' feature need a
deep dive / brainstorm / interactive redesign."_

What the human LIKES (keep): characters have a location in a zone; you
can interact with them.

## What the build does today (grounding, read from code)

- `vn`-depth people (Genemon): each press of "Speak with X" dispatches
  `talk_to`, which delivers their **next gate-satisfied authored line**
  into the **Story log** (C4.2 — a sequenced cursor, not random; but
  the sequencing is invisible, so it FEELS random). The conversation
  "stays open" ("Ask X more") until you walk off.
- `small`/`tiny` people: the button toggles a greeting line / wares
  panel (traders open `renderMarket`).

## Summary / key decisions

- **D1 (Q1): talking = INFO + STORY BEATS.** Everyday talks yield
  actionable information; authored conversation beats are reserved for
  story moments. A relationship/favor system is NOT this — out of
  scope (parked, T1+ candidate).
- **D2 (Q2): payload = house wants · body & mend · discovery hints.**
  Market talk stays at the stall (TST1).
- **D3 (Q3): the SHAPE is an ADR-075 diverge** — 2–3 working variants
  spanning topic-asks ↔ VN-lite, picked live in the DEV panel.
- **D4 (Q4): info renders INLINE in the talk surface only; story
  beats alone write to the Story log.**
- **D5 (Q5 + steer): cast = everyone present, presence RUNG-SCOPED**
  — a sparse person × rung ask matrix; presence is an authoring lever.
- **D6 (Q6): state-driven refresh + a newness mark; exhausted asks
  dim but stay pressable.**
- **D7 (Q7): asks are FREE** (story beats may still advance time).
- **D8 (Q8): re-home ALL existing C4.2 lines** — ask answer, story
  beat, or cut; one talk system ships.

**Outcome: promoted to
`docs/plans/fable-2026-07-17-talk-system-redesign.md` (same
session).** These are plan-level decisions, deliberately NOT ADRs yet —
the diverge pick + the shipped system lock them (ADR at ship, per
ADR-075's flow).

## Q&A log

### Q1 — the gameplay point of talking
- Asked: what is talking FOR, mechanically? (a) info lever
  (b) relationship lever (c) story delivery only (d) info + story
  beats.
- Captured: **(d) Info + story beats** — the recommended mix,
  confirmed. Everyday point = "I want to know something"; story
  conversations happen at authored moments, not per-press.
- Flags: none.

### Q3 — the interaction shape
- Asked: what happens on "Speak with X" — (1) topic asks in the
  person row · (2) state-picked single line · (3) VN-lite conversation
  panel.
- Captured: _"Something between 1 & 3 maybe diverge would help."_ —
  **the shape is a DIVERGE (ADR-075)**: build 2–3 working variants
  spanning the topic-asks ↔ VN-lite range (e.g. in-row asks · a
  conversation panel with asks inside it · a hybrid), DEV-toggle
  switchable, human picks live. The plan must scope the diverge, not
  pre-decide the winner.
- Flags: none.

### Q4 — where talk lines land
- Asked: inline-only + beats→Story · info→Chat + beats→Story ·
  everything→Now.
- Captured: **inline + beats→Story** (recommended, confirmed): info
  answers render only in the talk surface (ephemeral, where you're
  looking); authored story-beat conversations are the ONLY talk that
  writes to the Story log. Fixes the FB-415 complaint directly.
- Flags: none.

### Q5 — the T0 talk cast
- Asked: Genemon + Sōan only · everyone present · Genemon-first.
- Captured: **EVERYONE present** — every who's-here person gets at
  least one live ask. Yohei's stall stays the market home (Q2), but he
  is still a person and gets ask(s) too — just not price-direction
  duplicates.
- Flags: authoring scope — every ask answer is fiction-voiced text, so
  ADR-139 narrative-diverge applies; the plan must bundle the takes
  sanely (coherent bundles, not 25 atomized calls).
- **Steer (human, mid-grill): presence is RUNG-SCOPED.** _"Not all
  characters have to present in the same locations in every rung of
  tier 0. Just because a character is there at rung 5 and has story or
  game specific info or other flavor text to share doesnt mean he's
  also there at rung 1."_ — "everyone present" means everyone present
  AT THAT RUNG/ZONE; the ask matrix is sparse (person × rung), and
  presence itself is an authoring lever the plan must expose, not a
  constant. (The build already has present/away who's-here logic.)
- Grounding: the T0 roster is 13 people (genemon, kihei, soan, ohisa,
  shinnosuke, toku, naoyuki, yohei[tiny], oyae, matsuzo, iori, oume,
  rokusuke) — most already `vn`-depth in `content/people.ts`.

### Q2 — the info payload (T0 domains)
- Asked: which info domains should everyday talk carry in T0? Offered:
  house wants (Genemon) · market sense (Yohei) · body & mend (Sōan) ·
  discovery hints.
- Captured: **house wants + body & mend + discovery hints**. Market
  sense EXCLUDED — Yohei's stall is already its own surface (wares
  panel + the HR-44 stall-speaks bundle); talk doesn't duplicate it
  (TST1: one home per capability).
- Flags: none.

### Q6 — freshness + newness display
- Asked: when do asks refresh, how does newness show?
- Captured: **state-driven + mark** (recommended, confirmed): answers
  change only when game state moves (rung, works, health, season) —
  never a hidden timer; the person row wears a newness mark while any
  unheard ask exists; exhausted asks dim but stay pressable (same
  answer, honest about having nothing new). Kills the "feels random"
  read (TST4).
- Flags: none.

### Q7 — the cost of talking
- Asked: free · tiny tick cost · first-free-then-cost.
- Captured: **FREE** (recommended, confirmed) — asks never spend the
  day-hand; curiosity untaxed, the info layer teaches the game.
  Story-beat conversations may still advance time where the fiction
  demands it.
- Flags: none.

### Q8 — migration of the existing lines
- Asked: re-home all existing C4.2 talk lines vs let the old cursor
  coexist during rollout.
- Captured: **RE-HOME ALL** (recommended, confirmed) — every existing
  line becomes an ask answer, a story beat, or is cut; the press-A
  dispenser dies with the redesign; ONE talk system ships (TST1).
- Flags: none.

## Parking lot (tangents / parallel threads)

## Open flags (pending input)
