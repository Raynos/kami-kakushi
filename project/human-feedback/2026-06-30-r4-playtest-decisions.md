# 2026-06-30 — R4 + variant-process decisions (human-steered)

The human went through the open v0.3 questions via AskUserQuestion. This is the
source-of-truth capture; the formal locks land as ADRs (D-075+) and the build as a
plan. Verbatim direction is quoted; my reading follows each.

## Game-design decisions

### 1 · Clock (R4#1) — ACTIVE-ONLY PAUSE is canon

Resolves the D-053 vs D-013 contradiction. The code is right (pause the sim on
`document.hidden`, no offline catch-up); the contradictory ADR wording is what's
wrong. → **Action:** fix the D-053 text to say active-only-pause; no code change.

### 2 · Combat (R4#3) — attrition, NO auto-heal, loss stops autopilot

Verbatim: _"Combat should fight the enemy, it should do atks, the enemy should
atk back, both you and the enemy lose HP until someone hits 0 and 'dies'. There
should be no auto-heal. When you hit 0 HP you should lose the fight and auto
combat should stop."_
→ **Reading:** the fight is a visible HP-attrition exchange (you ↔ enemy trade
attacks until one reaches 0 = death). The **auto-loop must NOT auto-heal** (remove
the `main.ts` HP-management). Reaching **0 HP = a lost fight**, and that **stops
auto-combat** (no grinding at the floor). Supersedes the current auto-heal loop.

### 3 · Standing & koku (R4#6) — standing is DEED-based, koku is a TIGHT economy

Verbatim: _"Standing and pillars should not be Koku based or wealth based. We do
need to balance koku and have more sinks then you can earn money for. You
shouldn't be rich until T5."_
→ **Reading:** keep standing/pillars **purely deed-based** (actions, never money) —
do NOT couple wealth→ascension. Separately, **tighten the koku economy**: always
**more sink opportunity than income**, so the player is never rich until **T5**.
(This reframes the "koku runs dry / surplus materials" rough edges as *intended* —
just add more sinks so koku is always worth spending.)

### 4 · Breadth (R4#5) — make ≥1 surface LOAD-BEARING; first = a map node

Breadth must not be pure chrome. **First load-bearing surface = a map node that
gates a deed/yield** — walking there unlocks a deed source or better yield, tying
the map to **standing via deeds** (not koku). Others can follow.

### 5 · a11y colours — KEEP the deeper tones

The WCAG-AA darkening (cinnabar kanji / bronze "Excellent" / darker mute) is
confirmed. No change.

## Process / variant conventions (the bigger one)

### 6 · Diverge v2 — full variants, a DEV panel, per-variant review items

From the R2/R3 answers + the follow-up. The human couldn't pick variants because
they can't **see** them, and rejected the "diverge-LITE" shortcut.
- Verbatim (R3): _"full 2-3 variants or nothing, what is the lite version in the
  middle."_ → **Retire diverge-LITE.** Every new/major UI surface gets a **full
  2–3 variants**, always. No single-idea shortcut.
- Verbatim (R2): _"Can we have a dev panel in the UI, it can have all the dev
  features like speed up… add all the variants with a toggle in the dev panel…
  don't implement buggy variants, fix the variants."_ → Build a **DEV panel in the
  UI** (speed-up + the other `__qa` dev tools as buttons) with a **live variant
  toggle**, so variants are **viewable in the running UI** (not just branch
  screenshots). Every variant must actually **work** (fix the buggy ones).
- New (this message): _"once variants exist, each variant that exists in the
  codebase should be added as a line item to human-in-the-loop/review.md."_ →
  Each in-codebase variant = its **own review.md line item** for the human to
  review/pick (via the live DEV-panel toggle).
- **Implication:** this evolves **D-073** — variants now live **in the codebase**
  (DEV-only toggle, stripped from prod) rather than only as `diverge/<surface>`
  branch screenshots. → new **ADR D-075** refines D-073; update CLAUDE.md, the
  `diverge` skill, the variants-log, and review.md.

## Build sequence (proposed)

1. **DEV panel + live variant toggle** (the enabler — unblocks the human reviewing
   any variant) + **fix the buggy influence-B variant**.
2. **Full 2–3 variants** for the diverge-LITE surfaces (craft / market / quests) +
   re-offer influence/map as live toggles; **each variant → a review.md line item**.
3. **Combat rework** (attrition, no auto-heal, 0-HP-loss stops autopilot).
4. **Koku economy tighten** (more sinks; poor-until-T5; standing stays deed-based).
5. **Load-bearing map node** (a node gates a deed/yield).
6. **Clock ADR text fix** (active-only pause; doc-only) — anytime.

Open design Qs to resolve while building: the combat attrition presentation
(round-by-round vs summarised), the exact koku sink set, the DEV-panel layout, and
how variants coexist in code (a `?variant=` / DEV-state switch).
