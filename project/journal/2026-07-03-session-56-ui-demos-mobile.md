# Session 56 — 2026-07-03 — ui-demos: mobile (iOS WebKit) support for all six variants

**Summary:** all six `ui-demos/` remaster variants + the gallery now work on
phones (iPhone 16 class, iOS Safari/Chrome = WebKit) — one implementation,
responsive in place, desktop rendering verified unchanged per variant. The
durable mobile contract landed as **VARIANT-SPEC §4**; the plan
(`fable-2026-07-03-mobile-ui-demos.md`, archived on landing) records the
in-place-vs-fork call and the human's mid-flight steer ("if responsive hits a
mega wall, implement twice — never let both experiences go mediocre"; also
saved to agent memory). No variant hit the wall.

## What changed

- `ui-demos/shared/VARIANT-SPEC.md` — new **§4 Mobile** contract (three mobile
  laws, ≤920px structure, touch/iOS specifics, verification protocol), grown
  during the run with cross-variant findings: iOS click-synthesis trap, the
  393×659 visual viewport, the per-element overflow assert (scrollWidth
  false-greens in WebKit), flex min-content contribution trap, `clip-path`
  hit-testing clip, tick-re-render pane-scroll reset, the summons-ready
  tap-path friction.
- `ui-demos/0{1..6}-*/{index.html,style.css,main.js}` — six parallel Fable
  subagents, one per variant, each recomposing its own design language for
  the phone (all mobile rules behind `@media (max-width: 920px)` /
  `(hover: none)`): 01 bottom tab bar + crest-on-active + JRPG dialogue-box
  log band; 02 the journal "closes" to a single page, bookmarks become the
  bottom thumb bar; 03 chunky bottom tabs + live log ticker + full-screen
  record sheet; 04 lacquer tray nav + persistent paper log band; 05 log sewn
  under the vitals + bottom-hem cloth tags; 06 folding log peek strip +
  bottom paper tabs, both themes. Every variant: full-width unmissable
  summons banner, safe-area insets, ≥40px targets, `100dvh`.
- `ui-demos/index.html` — gallery mobile layer (names unwrapped, full-width
  descriptions, tap states); desktop byte-identical.
- `project/archive/fable-2026-07-03-mobile-ui-demos.md` — the plan, archived
  done-on-landing.
- `project/todo-human.md` — reading-queue entry for the plan.
- `project/status/project-status.md` — mobile-pass line brought current.

## Verification (per variant, two layers)

1. Agent layer: desktop 1440×900 before/after screenshot compare (byte- or
   pixel-identical modulo animation phase — zero layout drift, 06 in both
   themes); full tap-driven WebKit iPhone arc (cold open → intro VN → R0–R3 →
   wolf → summons → ceremony → all tabs; 28–51 screens each) with per-screen
   asserts + zero console errors; landscape functional.
2. Independent layer (coordinator): per-element horizontal-bounds audit
   (`tmp/mobile-ui/overflow-audit2.mjs`) across all six variants × stages
   R0–R3 in WebKit — zero overflows, zero console errors — plus visual
   spot-review of 2 shots per variant against taste.md.

## Notes

- The R9 human shortlist (6 → 3: 01 Moonlit · 04 Lacquer · 06 Washi) landed
  mid-run (`2c71840`); the mobile pass covered all six anyway — already
  in-flight, and it keeps a later blend/refine round phone-ready.
- Vercel redeploy of <https://kami-kakushi-ui-demos.vercel.app> NOT done
  (outward-facing) — surfaced to the human.

## Next intended steps

1. Human: try the deployed variants on a real iPhone once redeployed
   (safe-area insets can't be verified in emulation — the one open check).
2. R9 next step (winner / refine / blend among 01·04·06) is the human's call.

## Landmines

- **The commit is LOCAL; push deliberately deferred.** At commit time `verify`
  was red from a co-agent's `.claude/worktrees/agent-*/` checkout — md-links
  (72 dead relative links, all inside that worktree copy) + prettier (their
  WIP `src/ui/render.ts`) scan it. Nothing in this diff is implicated (other
  10/12 gates green), so this commit used the sanctioned `SKIP_VERIFY=1`
  local-commit escape and did NOT push red. **Gate follow-up worth doing:**
  exclude `.claude/worktrees/` from md-links + prettier in
  `src/scripts/verify-run.ts` — a transient agent worktree red is a gate
  crying wolf (A11). Push `main` once the tree verifies green.

- The demo engines tick every 480ms — desktop screenshot diffs are never
  byte-stable on animated screens; judge by eye (documented in §4.3).
- `env(safe-area-inset-*)` is always 0 in Playwright — safe-area padding is
  verified by construction only.
- 05-aizome exposes `window.__eng`, 01-moonlit `window.__moonlit` — DEV/QA
  hooks for tap-driving the summons state; demo-only, documented in-file.
