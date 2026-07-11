# Session 180 — the Zone do-panel's variant D (the human's C+A combination)

**Date:** 2026-07-11 · **Branch:** main

## What the human asked for

Reviewing the FB-410 Zone do-panel diverge (HR-32) live, the human landed
between two takes:

> "Let's lock in a combination of V0C and V0A. For V0C I like the design / CSS.
> For V0A I like the flavor text that's there for each zone. Build a V0D which
> is like V0C but with some text between the hero and the button rows."

So: **C's ink-scene banner frame, carrying the zone's flavor line between the
hero head and the verb stack.**

## What landed

- **`zone-d` — "D · banner + standing line"** (`src/ui/dev.ts`), DEV-only like
  B/C, registered in `SURFACES` so it toggles live and hydrates from
  `?zone=zone-d` (FB-18). It shares C's whole render path — same head, same
  full-width verb stack, same real intents, same actionKey stamping — and adds
  one `<p class="zb-blurb">` after the head.
- **The line is the SAME seasonal node read the Map's you-are-here card
  resolves** (`nodeSeasonalBlurb(here, season(state))`, map.ts) — not a second
  copy of the prose (TST1: one source). It therefore breathes by season for
  free (C5a unit 5); at the paddies in winter it reads *"…Winter lays the fields
  off — stubble, frost, the water let out…"*.
- **The seasonal text joins the signature guard**, so a season turn repaints the
  pane and an idle tick still repaints nothing (P4/TST2 holds under the toggle).
- **CSS** (`styles.css`): `.zone-banner .zb-blurb` — soft ink, `--fs-small`, an
  inked left rule, no box of its own. C's frame is otherwise untouched.
- **Test** (`dev.test.ts`): routing + the line's *position* (between `.zb-head`
  and the first `.verb`) + text derived from `nodeSeasonalBlurb` (never a copied
  string) + the rest button still driving the REAL intent. **RED-proved**:
  deleting the append line fails it, restoring it passes.
- **HR-32** gains its D line item + scorecard (19✔ · 2✘): it inherits C's ✘ P19
  ceremony register, and knowingly ✘ P1 — the standing description now reads in
  two homes (Zone + Map), which FB-406/TST1 had ruled against. **That rule is
  overridden by human intent** (ADR-022): the placement is exactly what the
  human is buying. Flagged in the HR item so the pick is made with eyes open.

## Open thread for the human

If D is picked, FB-406's "the standing description keeps its one home on the Map
tab" needs a ripple, and the Map card's blurb needs a keep-or-drop call (it may
still earn its place as the *survey* read while the Zone panel carries the
*standing* read). Prod default stays **A** until the human toggles (zero prod
flag-debt — ADR-075).

## The human locked D, same session — the diverge is CLOSED

> "Yeah lets lock in V0D its decided, remove the other variants, remove the
> variant from the dev menu."

So D stopped being a variant and became **the Zone panel**:

- **Shipped by re-dressing the PROD path, NOT by promoting the variant's code.**
  This is the load-bearing call. D-as-a-variant was a *simplified* re-presentation
  — it lacked the rake auto's reveal-after-N + "⏸ waiting" armed state (FB-367/
  FB-368), the inline lock-hints (FB-368), the rake's exhaustion refusal
  (FB-324), the rest effect-line (FB-346), the live-round stage blurb, and the
  "walk to the gate to post the watch" summons. Promoting the variant file would
  have silently regressed all of them. Instead `render.ts` keeps its incremental
  machinery and now wears D's frame: `.zone-banner` (hero kanji + name + kicker)
  → `.zb-blurb` (the seasonal standing line) → the existing verb rows.
- **Deleted:** the `zone` surface from `SURFACES` (no toggle in the DEV menu),
  `renderZoneVariant` + `areaLabelOf` (~260 lines), the zone-placard / zone-ledger
  / `.zb-rowline` CSS, the `.zone-variant-host`, the `What you can do` h2 (the
  banner's kicker carries it), and the per-area `h3` head + static area blurb —
  labours are spatial, so that group only ever names the ground the banner just
  named. `.area-head` is now dead CSS; gone too. The zone variants were the sole
  users of 16 imports in `dev.ts` — a clean cut, not a load-bearing one.
- **Tests:** the four variant-routing tests are replaced by (a) one dev.test that
  the DEV registry carries **no** zone surface (zero flag-debt, ADR-075), and (b)
  a render.test on the SHIPPED banner — hero names the node, the standing line is
  derived from `nodeSeasonalBlurb` (never a copied string), it sits between the
  hero and the first verb, no `.area-head` survives, and an idle re-render churns
  nothing (P4/TST2). Full suite green incl. the `@slow` lane (18 gates, 45s).
- **Doc ripple (the map was wrong, so the map got fixed):** ADR-116's FB-406 note
  claimed the Map card is "the ONE home for the zone text". It isn't any more —
  amended: the standing read now renders in **two surfaces off one source**
  (`nodeSeasonalBlurb` — one value, two reads; TST1 holds). What FB-406 actually
  forbade — zone text spamming the Now/Story log on every move — stands. The
  matching comments in `intents.ts` + `render.test.ts` were fixed with it.
- **HR-32 closed** → graduated to `human-in-the-loop/archive.md`.

## Next intended steps

- The three plans in the reading queue remain unstarted.
