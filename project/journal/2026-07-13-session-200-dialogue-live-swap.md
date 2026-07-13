# Session 200 — 2026-07-13 — dialogue live-swaps, and the log re-voices

**Summary:** Built the dialogue-live-swap plan (M7, "wire it now").
The human first locked its four open forks — the big one: a DEV
take-switch re-renders EVERYTHING, logged lines included, superseding
the old "logged history never rewrites" carve-out FOR DEV SWITCHING.
Dialogue now swaps through a core text overlay (whole-dialogue units,
text-only), and the DEV log repaint re-derives every keyed entry from
the current registries + overlays, so a flip re-voices history and
canon restores on switch-back. Proven headless against the live
`:5173` build with a synthetic take (deleted after capture).

## What changed

- `docs/plans/fable-2026-07-13-dialogue-live-swap.md` — Locked
  decisions section (the four human rulings), step 0 (log storage
  survey), Status ✅; archived to `project/archive/`.
- `src/core/content/dialogue.ts` — `__setDialogueTextOverride` +
  `dialogueLineText` (the declaring-module DEV overlay, keyed
  `<dialogueId>.<lineId>`, TEXT only — ids/gates stay canon);
  `getDialogueLine` + `nextDialogueLines` read through it.
- `src/core/content/log-render.ts` — the `dialogue.` resolver routes
  through the overlay-aware `dialogueLineText` (still non-throwing).
- `src/core/index.ts` — export the two new symbols.
- `src/ui/dev.ts` — `syncReqFlavor` forwards the effective
  `dialogue:` take defs into the core overlay; `dialogue:` joined
  `LIVE_UNITS` (now exported for the RED-able test); the reader-only
  comment block rewritten to the session-200 ruling.
- `src/ui/render.ts` — `devRederivedEntry`: at paint, a keyed log
  entry re-derives its prose from the registries + overlays
  (`__DEV_TOOLS__`-gated; unresolvable keys keep stored prose, same
  as codec). The HD-41 epoch repaint already rebuilds the view on a
  flip — this makes the repaint re-voice.
- Tests — `dialogue.test.ts` (overlay semantics + log-resolver
  reach), `dev.test.ts` (overlay rides the switcher; per-unit
  override; `LIVE_UNITS` coverage), `render.test.ts`
  (`devRederivedEntry`). Full suite 1373 green (`VERIFY_FULL=1`).
- `.claude/skills/narrative-diverge/SKILL.md` — dialogue moved from
  the "can't yet swap live" list to the covered list; noted the
  logged-line re-voice.
- Headless proof: `tmp/m7-proof.mjs` + `tmp/m7-shots/` (git-ignored)
  — rung-R1 fixture, flip take A → the LOGGED gen-rake line
  re-voices; flip Canon → history restores.

## Next intended steps

1. The session-200 "DEV switch re-renders everything" ruling should
   be recorded as an ADR — fold it into the log-truth plan's sweep
   omnibus (ADR-195, in flight in w3:p3 this same day) or the next
   free number; the ruling text lives in the archived plan's Locked
   decisions.
2. Known residue (deliberate): a logged line's 幕-head `context` is
   baked UNKEYED, so intro-title flips still don't re-voice logged
   heads; the cold-open `coldOpen.rake` key is canon logic carried
   by no take. Key `context` if the human ever wants full coverage.

## Landmines

- Shared tree: `src/core/index.ts` was co-dirty with w3:p3's M3
  (TierId) hunk — my commit waited for their commit to land first
  (coordinated via herdr).
- The overlay is TEXT-only by ruling: a future take that wants to
  change gating is a mechanics change, not a diverge unit.
