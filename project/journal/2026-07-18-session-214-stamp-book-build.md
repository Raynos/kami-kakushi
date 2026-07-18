# Session 214 — 2026-07-18 — stamp book: live rulings + the compact build

**Summary:** The human picked the stamp-book resume plan off the
queue and asked to be grilled on its open decisions directly. Five
rulings landed live (grill capture:
`project/brainstorms/2026-07-18-stamp-book-decisions.md`, locked as
**ADR-201**): afterglow + Character-tab Record panel home (the
step-3 HD closed live, never filed); the MC's OWN seal-book; the big
re-scope — **compact, ≤20% of screen, gym-badge style with future
slots**, not the prototype's full-screen modal; per-seal inspect
popover for depth; next-rung-named / rest-mystery future slots. Then
BUILD: the plan went ACTIVE and the compact stamp-book build started.

## What changed

- `project/brainstorms/2026-07-18-stamp-book-decisions.md` — NEW:
  the grill capture (Q1–Q5, verbatim scale steer).
- `docs/living/decisions/150.md` — ADR-201 (the five rulings).
- `docs/plans/fable-2026-07-18-stamp-book-resume.md` — Status →
  ACTIVE; Rulings section added; step 3 struck CLOSED; the step-2
  core-seam risk re-surveyed (talk-system core is committed — clear).

## Steps 1+2 landed (same session)

- `src/ui/stamp-book/README.md` → the full E3.1 spec at compact
  scale (fiction table with the granting hands bible-grounded, the
  compact grammar, the blind rubric).
- **SCHEMA_VERSION 15→16 (ADR-201 run record):** additive
  `rungRecord` (dated presses; appended only in `applyPromotion`,
  R0 seeded at creation) + `defeatDays` (appended where
  `soanLedger` grows). Identity migration; hydration defaults `[]`
  (old saves' pressed set derives from ladder position — seals
  render undated, never synthesized). Fixtures regenerated in the
  same commit.
- `src/ui/stamp-book/from-state.ts` — the ONE derivation feeding
  every variant; the data shape itself enforces ruling 5 (future
  slots carry no identity). 7 tests in `from-state.test.ts`
  (registry-derived expectations; real engine drives, no pokes).

## Taste Pass 1 — the constraint brief (before authoring any variant)

Full 21-walk; n/a skipped silently (P3 voice, P7 A±, P8 crash, P11/P12
typewriter+VN, P13 rewards, P16 log routing, P18 transcripts, P21
app-info — no log/scene/text-flow surface here).

- **P1** — the Record panel is the ONE player home for the run record;
  the full-screen proto stays a DEV-reference door only, never a
  second home. The header rung readout stays CURRENT-status; the strip
  is the RECORD (history + future) — distinct capabilities, no dup.
- **P2** — reuse brush.ts primitives + Andon tokens + the `.frame` /
  `skill-head` section idiom; ONE shared popover primitive serves all
  variants; no local forks of seal drawing between variants (shared
  compact-draw helpers).
- **P4** — never wholesale-reset on tick: prod path is build-once +
  repaint ONLY when the derived key (rung, record length, defeats,
  reqs-done, season) changes; idle ticks churn nothing.
- **P5** — the strip is a fixed-height card; the popover OVERLAYS
  (absolute), never reflows the strip; C's leafing repaints in place
  at fixed size.
- **P6** — complete at 390px: the strip keeps a min drawing width and
  scrolls inside its own box (opens at the frontier end); no ghost
  boxes (section absent until its tab shows).
- **P9/TST3** — no new spawn machinery: the section rides the
  Character tab's existing reveal; the afterglow ceremony beat is a
  NAMED follow-up step (plan), not silently dropped.
- **P15-shape** — no spoilers: future slots blank silhouettes, next
  slot named only — enforced IN THE DATA (from-state gives variants
  no future identity).
- **P17** — pressed / next / future visually distinct at a glance; the
  inspected seal highlights while its popover is open; dismiss =
  outside-click/Esc.
- **P19** — two registers inside one card: the seals + thread breathe
  (ceremony), the captions/dates are tight tiny chrome type.
- **P20** — bounded: card height ≤ ~180px (≤20% of a laptop viewport,
  the ADR-201 ruling), no raw `vw`, internal scroll only.
- **TST4** — the glance answers: how many pressed (n/8), what's next
  (name), how close (reqs n/m) — all visible without interaction.
- **V-TST2 (derived)** — seeded-deterministic jitter per seal id: the
  strip NEVER re-jitters between repaints (same state ⇒ same pixels).
- **V-ADR-139 (derived)** — this pass adds NO fiction-voiced prose:
  popover text is mechanical labels + registry facts (title, kanji,
  granter name, date); the book's remembered-notes lines are a named
  ADR-139 unit deferred to the HR bundle.

## The compact diverge landed (same session)

- **Three working variants** over the ONE `stripFromState`
  derivation: **A · concertina** (ships inline —
  `render/character.ts` + `stamp-book/concertina.ts`), **B · badge
  rail** + **C · open pages** (DEV-only, `variant-renderers.ts` +
  `stamp-book/rail.ts`/`pages.ts`). Shared craft in
  `stamp-book/compact-draw.ts` (seal press · await frame ·
  silhouette · thread stretch · the ONE inspect popover).
- **Home wired:** `characterRecord` pane opens the Character tab
  (`render.ts` sliceDo), build-once + keyed repaint (P4);
  `characterHasContent` deliberately untouched — the record never
  forces the tab open early.
- **Registry + queue:** `dev-surfaces.ts` row (`stamp-book`, rung 2,
  HR-46) + the HR-46 bundle in review.md (brief + per-variant
  scorecards + why-A). Mid-build the review-link gate REDed the
  tree on the not-yet-filed HR-46 — w8:p1 + w3:p3 pinged; filed
  immediately, gate re-verified green, both notified (herdr
  protocol: get → send → Enter → read).
- **Verification:** golden pin per variant
  (`compact-golden.test.ts` + `.hash.json`, UPDATE_STAMP_GOLDEN
  regen); headless captures (a/b/c at rung-R4, R7, 390px mobile,
  popover) in `project/audit/screens/2026-07-18-stamp-book-diverge/`
  (git-ignored, local); `verify-dev-strip.sh` green (T0 mode:
  server-coupled markers absent; client DEV tools ship default-off
  by design — the generic diverge step-9 "0 hits" expectation is
  superseded by this repo's T0 contract).
- **Pass 2 scorecards:** A/B/C each 11✔ · 1✘ · 9— — the one ✘ is
  shared and NAMED (P10: no story line names the book yet; the
  afterglow beat + an ADR-139 intro line are the plan's next step).
  P17's inspected-highlight was a knew-and-missed caught in
  scoring and FIXED before filing (markEl + `.sbc-inspected`).
  §5 rubric: A 20 · B 20 · C 17; tie broken conservative on
  Intentionality → A stays the default.

## Blind pass + redlines (same session)

Two fresh readers over the captures; report + ADR-188 checklist:
`project/audit/reports/2026-07-18-stamp-book-blind-pass.md`. A's
grammar fully read; ruling 5 held (nothing future leaked). Three
fixes landed off it: the next-slot count moved off the
decorative-only `--ink-faint` token; lean ink made visibly dying
(0.9 @ 0.55); scroll edge-fades + thin scrollbar so the clipped
panel reads as "more book this way". Deferred, logged in the HR:
C's thread-as-glitch + paging affordance, B's mobile wrap
hierarchy, the next-seal popover requirement list. Pin regenerated
deliberately with the fixes.

## The afterglow landed (same session, "go")

- `showSealAfterglow` (render/modals.ts, beside the rank-up seal it
  extends — TST1): after a rank ceremony the compact strip presents
  ONCE, scrolled to the fresh seal, the seal pressing in
  (`.sbc-pressing` wrapper-g so CSS scale composes over the seal's
  own rotation); click/Esc or ~4s dismisses; reduced-motion honored.
- Trigger mirrors the slop-warning latch (render.ts):
  `pendingAfterglow` on the exact promotion diff, held until the
  rung-up VN + scene queue close AND any slop scrim is answered —
  story first, consent second, ceremony after.
- Proven headless: `rung-R2` → `__qa.toRung('R3')` → afterglow
  captured (`afterglow-R3.png`), Esc dismissed clean.
- Choreography is the shipped concertina's; a B/C pick at HR-46
  would bring its own (named there).

## The sealbook-intro story unit landed (same session)

- **ADR-139 run:** three blind agents, three distinct dramatic
  briefs (A procedural warmth · B private possession · C the record
  as witness — commitments, not paraphrases). **B picked**: "No name
  yet — but a page that says you are" — binds the strip to the
  namelessness→naming spine and ruling 3 (the MC's OWN book); C the
  named runner-up (clean R5 Count foreshadow); one period fix in
  integration (shirt → breast of the robe).
- **Wiring:** canon in `flavor.md` (`### sealbookIntro`); emitter in
  `applyPromotion` (R1 only, narration channel, key
  `flavor.sealbookIntro` — the FB-324 rake-cap pattern); alternates
  in `takes/sealbook-intro/` (bundle hr: HR-47, rung R1); `flavor`
  already in LIVE_UNITS so the swap is live, logged lines re-voice
  (ADR-198). The R0 seed press deliberately predates the reveal.
- **HR-47 filed** (review.md, R1 section): canon read + alternates +
  briefs + scorecards + the NEW-FACT proposal (hired hands carry a
  seal-book — written nowhere in the bible; the pick blesses or
  rejects it).
- **Proven:** gen + fixtures regen green (the line is in the R1+
  fixture descriptors); live probe — the line renders in the R1
  story log. Full verify 21/21.

## Next intended steps

1. HR-46 (variant) + HR-47 (the line + the bible new-fact) await
   the human; alternates stay DEV-only. The plan is then done save
   the pick-driven prod promotion/prune.
