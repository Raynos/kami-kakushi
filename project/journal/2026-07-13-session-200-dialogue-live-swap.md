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

## Follow-up (same session) — the take-flip scroll yank

The human verified live and caught a bug: flipping a take repaints
the log via `setLogFilter`, whose FB-51 land-at-bottom re-pinned the
view — losing the reader's scroll position mid-compare (TST2). Fix
in `render.ts` renderLog's epoch branch: capture pin-state +
`scrollTop` before the repaint and restore both unless the reader
was already pinned to the foot. Verified headless: scrollTop 1165 →
1165 across a flip (was: yanked to bottom).

## Follow-up (same session) — the DEV panel drags by its header

Review ergonomics (human ask): the panel covered the log lines under
review with no way to move it. It now drags by the ⚙ DEV header —
the FB-3 feedback-box pointer idiom: the first >4px of movement
converts the bottom/right anchor to left/top and the panel follows
the pointer (clamped on-screen); a plain press-and-release stays the
collapse/expand click; session-local, reseats at the corner on
reload. Two RED-able jsdom tests + a real-browser drive (drag −400/
−300 lands exactly, no accidental expand, click still toggles).

## Follow-up (same session) — logged scene lines re-derive too

Human repro: flipping hd38-w4-intro didn't re-voice the log. Root
cause: the log's `intro`/`beat`/`scene`/`flavor` resolvers read the
canon registries — only dialogue had an overlay. Fix: log-render.ts
gains `__setLogTakeOverrides` (effective take DEFS for the four
scene-shaped classes), synced by dev.ts beside the other overlays;
the resolvers read through it, so the DEV repaint AND a save load
voice the selected takes. RED-able switcher→renderLogLine tests.
Note for reviewers: hd38-w4-intro's takes share canon's dream
NARRATION byte-for-byte — the diverge lives in the decision
option lines (say/react), so that's where a flip visibly moves.

## Follow-up (same session) — the full-sweep audit, and three more fixes

The human asked the right question: did I check ALL the diverges?
No — so a programmatic sweep ran every bundle × take × unit through
the switcher and compared resolved text. Findings + fixes:

1. **Positional twin (log-render.ts):** takes are authored BLIND
   with their own `<!--#slug-->` line ids, so a logged line's
   canon-baked id missed the take def — hd30-nengu was 100% dead,
   c5a-overlays / hd38-w1 / hd38-w2 / works-cause partially. When
   the id lookup misses now, the resolver finds the id's position
   in the CANON def and reads the take's element there. Residual
   NO-RESOLVEs are takes with fewer elements than canon (nothing to
   map to — they keep stored prose).
2. **rake-cap emitted keyless (intents.ts):** the human's live
   repro — fb324-rake-cap never flipped because the cap line had no
   contentKey. Now keyed `flavor.rakeCapLine`; fixtures regen rides
   the same commit.
3. **adr190-nudge was never broken** — my first sweep skipped the
   `opt.*.bonus`/`.perk` keys; with them included it flips.

Human sign-offs the same sitting: **fb402-rest-open (HR-31 closed),
fb362-intro-titles (HR-28 closed), fb324-rake-cap** — all locked to
canon and pruned from the DEV area (git history + the review
records keep the alternates); the m7-dlg-proof synthetic deleted
(purpose served). Registry now 19 open bundles.

## Follow-up (same session) — refactor step A lands: gen-time canonicalization

The locked simplification's step A: every take now ALSO compiles to
a flat contentKey→text map + greeting/answer SEQUENCES, canonicalized
against the canon parsed docs at gen time behind the HARD prose-only
gate (unknown unit/key/dialogue-id, option/topic count mismatch, and
stat-nudge presence all RED the gen, naming bundle · take · unit).
Design refinement found by running the gate over all 19 real bundles:
every violation was NARRATION-RUN length only (greetings + topic
answers) — that's pacing, part of a take's authored voice — so runs
stay free-length sequences; the interactive skeleton is id-stable and
hard-gated. Additive: the def-shaped fields remain until step B
migrates the consumers. Compiler + type + 16 tests; consumers
untouched.

## Follow-up (same session) — step B1: the ONE story overlay

The funnel is in: `core/content/story-overlay.ts` (a leaf) holds the
single `__setStoryOverlay(text, seq)` + `storyText`/`storySeq` reads.
`renderLogLine` consults the overlay FIRST on an exact key; narration
RUNS resolve via `storySeq` (canon id → canon position → the take's
line, min-bounded). All TEN per-concern setters deleted (requirement/
discovery/judge/rake-cap/rest/sleep/sleep-announce/works/intro-title/
dialogue) plus the short-lived `__setLogTakeOverrides` + positional
twin; every reader now goes through the funnel; `dev.ts`'s sync
collapsed to one flatten over the gen-canonicalized `text`/`seq`
maps. Remaining as B2: migrate the `sub*` render-read path + the
reader galley onto the flat maps, then drop the def-shaped take
fields from the compiler. (Mid-refactor the stale index.ts re-export
briefly took the shared dev server down — w3:p3 flagged it; restored
within the same slice.)

## Follow-up (same session) — step B2: flat maps everywhere, defs retired

The render-read half: the six `sub*` fns rebuild scenes from the ONE
overlay (`rebuildScene` — take words on canon structure, identity
when uncovered, sub-object identity preserved); the reader galley
enumerates units from the flat maps and renders take columns via
`takeSceneView`; the compiler emits ONLY meta + `text` + `seq` (the
nine def-shaped take fields deleted from StoryTake). Live-proven on
the shared server: hd38-w4-intro flips a logged option line and
restores. Remaining: step C (the keyless-gate hole) and step D
(context keys, schema bump).

## Follow-up (same session) — step C: the keyless gate grows a static half

Why rake-cap escaped the existing full-arc keyless gate: its corpus
only sees emitters a fixture playthrough REACHES, and the cap fires
behind a condition the arc never hits. The gate now has a static
half — a brace-matching scan of src/core source: every durable-
channel log literal must name a contentKey in its own braces
(ephemeral lines exempt; a def-site literal keyed at its emit funnel
declares `// keyless-ok: <where>`). First run caught the WHOLE
quest-completion line class keyless (11 lines — the arcs never
complete quests, so the runtime gate was blind to them) plus the
±attribute line; all keyed now (`flavor.quest*`, `attr.<id>` with a
new resolver).

## Follow-up (same session) — step D: the 幕-head context is keyed

The last re-voice gap closes: `LogEntry.contextKey`
(`intro-title.<sceneId>`) persists beside the baked `context`; the
codec and the DEV repaint re-derive the head through the same funnel
(`renderLogLine` → the overlay-aware `introSceneTitle`). Schema
v12→v13 (identity migration — additive field; pre-v13 entries keep
their baked heads, TST2). Note: no OPEN bundle carries intro-title
takes right now (fb362 was signed off + pruned this same session),
so the live behavior is covered by the resolver/codec tests until
the next intro-title diverge.

## Follow-up (same session) — the sickroom land's e2e fallout

The mobile e2e lane (not a verify gate) was red from the landed
sickroom mechanism: the cook/heal journey still expected a meal to
heal (ADR-164 severed it), and the worn-weapon fixture regenerated
DEGENERATE — hp 1 (nothing mends in-field on the new arc) and the
woodlot site pool at 0 (the rebalanced climb drains it), so the
repair journey's chop yielded nothing. Fixes: the cook journey is
now the ADR-197 mend-lane journey (cook never cues nor heals; the
free pallet day mends); the fixture spec turns the season (the
manual G1 verb — pools refill) and closes on a pallet day, with a
RED-able pool expectation. Full e2e 115 green.

**Finding, not built:** banked wood is deliberately unreachable
(spend-from-store) but REPAIR consumes CARRIED wood only — with a
drained pool, the bind's only exit is the free `advance_season`
verb. Fine while the season verb is free; re-check if seasons ever
gain a cost.

## Follow-up (same session) — the sickroom-mend diverge (HR-43)

The sickroom plan's last open piece (step 4, held for the refactor):
three blind takes for the treat/pallet result lines. The fiction
moved out of the log-content leaf into FLAVOR keys (`sickroomTreat`/
`sickroomRest`), resolved by a `sickroom.` dispatch entry that
appends the mechanics suffix — so takes are number-free and swap
through the ADR-198 funnel with zero new wiring (the refactor's
first real proof: the bundle needed ONLY markdown). Canon = take A
"the body ledger"; B "the body speaks" + C "the craftsman's floor"
live in DEV → Story; the seed prose is archived in HR-43.
Live-proven: the pallet line emits in the active take's voice and
logged lines re-voice on flip. Plan archived — fully done.

## Landmines

- Shared tree: `src/core/index.ts` was co-dirty with w3:p3's M3
  (TierId) hunk — my commit waited for their commit to land first
  (coordinated via herdr).
- The overlay is TEXT-only by ruling: a future take that wants to
  change gating is a mechanics change, not a diverge unit.
