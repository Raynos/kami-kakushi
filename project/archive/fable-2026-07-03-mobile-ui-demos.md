# Mobile support for the ui-demos remaster variants

**Status: ✅ done (2026-07-03).** All six variants + the gallery landed with
mobile support, desktop verified unchanged per variant; no variant hit the
fork wall. Journal: `2026-07-03-session-56-ui-demos-mobile.md`. Human ask:
the six `ui-demos/` variants don't work on iOS Safari/Chrome — make them work
on a phone (iPhone 16 class).

## Who builds this — Fable or Opus?

**Fable** (this session + six parent-inherited Fable subagents, one per
variant). Confidence: ( 10% Opus, 90% Fable ). Recomposing each variant's layout for a phone *in that variant's own
design language* is taste-concentrated work end-to-end — no phase is mechanical
enough to route down.

## The call: responsive in place, not a `mobile-ui-demos/` fork

The human explicitly delegated this fork ("if you think editing ./ui-demos to
work for both … do that"). Decision: **edit `ui-demos/` in place** — one
implementation, desktop + phone. Why:

1. **R9 (the taste call on these demos) is open** — one deployed URL the human
   can review on laptop *and* iPhone beats two artifacts; during review
   iteration every tweak would need doing twice in a ~12k-line fork that
   drifts within days.
2. **The winning variant graduates to prod wiring** (D-075 pass in `src/`),
   and prod needs responsive anyway — media queries here are forward-work,
   not throwaway.
3. **Desktop risk is containable**: every mobile rule lives behind a
   `max-width` / `hover: none` guard, so desktop rendering is untouched —
   proven per-variant with before/after desktop screenshots.

**Human steer (mid-flight, 2026-07-03):** if responsive CSS hits a mega wall,
implement twice — one really-good laptop UI + one really-good mobile UI —
rather than one compromised responsive layer that makes both shitty. The
architecture already halfway honors this (desktop CSS is byte-untouched; the
mobile layer is a fresh recomposition, not a squeeze), and the **escape hatch
is pre-authorized per variant**: an agent that can't reach really-good inside
the shared markup reports the wall, and that variant gets a dedicated mobile
implementation instead.

## The contract

The durable mobile contract is **`ui-demos/shared/VARIANT-SPEC.md` §4** (added
with this plan) — single source; this plan doesn't duplicate it. Highlights:
desktop-unchanged law, in-language recomposition, log stays first-class,
`100dvh` + safe-area insets, ≥44pt tap targets, hover→active twins, no
horizontal scroll, WebKit (real iOS engine) verification protocol.

## Execution

- Six parallel subagents, **one per variant, own directory only** (shared/
  needs are reported back, handled centrally). Gallery `index.html` handled
  by the parent.
- One shared static server for the fleet; each agent drives its variant with
  repo-local Playwright: desktop no-drift check (chromium 1440×900
  before/after) + full R0→R3 tap-driven arc on emulated iPhone in **WebKit**,
  reviewing its own screenshots against VARIANT-SPEC §3 + §4 and
  `docs/living/taste.md`.
- Parent reviews each agent's shots + diff, commits centrally (explicit
  paths only — another agent is active in this tree).

## Out of scope

- Prod (`src/`) mobile wiring — that's the post-R9 D-075 pass.
- Landscape polish (must be *functional*, not beautiful).
- Vercel redeploy (outward-facing) — surfaced to the human, not run.

## D-075 note

No new divergence pass here: the six variants *are* the divergence. Mobile
recomposition of each existing variant keeps 1:1 variant identity.
