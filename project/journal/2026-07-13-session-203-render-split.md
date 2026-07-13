# Session 203 — 2026-07-13 — the render-split job: rulings locked, then the run

## ☀️ SUMMARY (read this first)

The human walked the open decisions of
`docs/plans/fable-2026-07-13-render-split.md` and ruled: **start
now if quiet** (not overnight), **render-split lands before
merchant-state**, **all Fable, no Opus delegation**. This session
transcribes the rulings, waits for the quiet window (w1:p3 to
finish), then runs the four-file split job to completion. This
file is HISTORY; live state is `project/status/project-status.md`.

---

## 1 · Rulings transcribed

Verified the go-condition facts first (all four files clean;
dialogue-live-swap + contention-locks landed & archived; w1:p3
still live). Then via AskUserQuestion the human ruled the three
open forks. Edits:

- `docs/plans/fable-2026-07-13-render-split.md` — Status →
  ▶️ IN PROGRESS; new **Rulings** section; go-condition check
  noted; routing section's Opus-subagent allowance struck
  (superseded by Ruling 3).
- `docs/plans/fable-2026-07-13-merchant-state.md` — sequencing
  stamp: builds only after render-split lands (it edits the
  market UI inside render.ts).

## 2 · Quiet window opened; baseline captured (+ a harness fix)

w1:p3 exited; tree clean; only this session live. Baseline: full
verify green (the push), e2e lane green (115 passed), the
qa-shots gallery green ×2, DEV-panel tab shots via an ad-hoc
script. Found & fixed pre-existing rot in
`src/scripts/qa-shots.mjs`: its two naive intro clicks predate
the fused sickroom intro, so the shell never mounted and shots
04+ pictured the VN. It now plays the intro like the (green)
e2e helpers do (hurry typewriter → ask/decide/Continue per
scene), on desktop, mobile, and after the step-10 newGame.
Noise measurement: two identical-code gallery runs differ on 4
of 13 shots (typewriter/timing: 01-cold-open, 02b-intro-played,
06-mobile-r2, 10-rankup-seal) — those get judged diffs at Step
5; the other 9 must be pixel-identical. Baseline set:
`tmp/render-split-baseline/` (run-a/run-b/dev-a + dev-shots.mjs).

## 3 · The worktree job — steps 1 + 2a–2i done

In worktree `.claude/worktrees/render-split` (branch
`worktree-render-split`, base de212d25). Step 1: dev.ts →
dev/ module set (commit 121c11c3; DEV-panel tabs pixel-identical
to baseline). Step 2 so far, one surface per commit, full suite
green each time (1,397 tests): market (bb81b0df), quests,
inventory, combat+character, estate trio, map+who's-here,
settings modal, overlays/modals, actions. render.ts 6,766 →
3,754. Mid-step pixel check: gallery diffs are only the
known-noisy typewriter shots + the About modal's build-hash
stamp (explained, rejected). Extraction pattern: create<X>View
(ctx) factories; surface-private refs become instance state;
shared mount state (activeTab, openPersonId, lastState, paused)
threads as getters/setters — never a copied snapshot.

## 4 · Steps 2j–4 + the proof + the landing

Log (createLogView + pure log-lines), VN (createVnView), and
vitals extracted — render.ts ends at 1,594 (the shell). Step 3:
styles.css → a pure @import index over nine styles/*.css files
(reconstruction identical modulo blank lines). Step 4:
render.test.ts mirror-split into nine per-surface files +
test-utils, all @slow, suite count unchanged (1,397). The split
surfaced a latent leak — a log reveal timer outliving its mount
(thrown after jsdom teardown) — fixed with the same
isConnected guard tickExpiry already carried. Proof: FULL
verify 20 gates green ×3, e2e 115 green, final gallery + DEV
tabs byte-identical outside the two pre-measured noise classes
(typewriter timing; the About build-hash stamp). Landed as a
fast-forward of main inside the quiet window (main never moved
off the base). Plan archived; repo-map carries the module map;
merchant-state unblocked against render/market.ts.

## Next intended steps (current)

1. Regenerate + commit the QA gallery on landed main (the
   harness's intro fix renamed the 02b/02c shots).
2. Re-run tmp/hotfiles.py after ~5 days (the Aftermath watch).
3. Merchant-state is next in docs/plans/ — Opus-routed, builds
   against render/market.ts.

## Landmines (current)

- styles.css is now an @import INDEX — its import order IS the
  cascade; never reorder, never add rules to the index itself.
- Muscle memory says "edit render.ts / dev.ts" — surface work
  now lands in src/ui/render/ and src/ui/dev/ modules.
