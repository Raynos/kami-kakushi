# Simplify the story-take swap system — one shape, one funnel

**Status:** ✅ DIRECTION LOCKED (human, 2026-07-13, session-200 ask):
**hard gate** on prose-only takes (a structural variant must use the
`native:` escape) · **D included** (context keys, schema bump rides
the wave) · **build now, A → B → C → D**, each step verify-green on
its own. Building in session-200+.

## Why the current system keeps breaking

Session-200 shipped four fixes to the same underlying design in one
sitting (dialogue overlay · log re-derive · positional twin · the
keyed rake-cap emit). Each fix was real, but the class of bug is
structural. Two root causes:

**1. A take is the wrong shape.** Takes compile to full scene DEFS
(greeting arrays, topics, options) with their OWN blind-authored
`<!--#slug-->` line ids. But the game addresses a logged line by the
id baked under CANON — so every consumer needs id-reconciliation
(the runtime positional-twin heuristic), and a take with a different
line count silently half-works. Yet the policy (takes/README) is
already "a take varies PROSE ONLY; ids, gates, options, triggers
stay canon." The shape carries structure the policy forbids varying.

**2. There is no single text funnel.** "Swap a take" is implemented
~11 times: per-class render-read subs (`subRungScene`, `subIntroScene`,
`subScene`, `subFlavor`, `subColdOpen`, `subReqObjective`) + ~9
per-concern core setters (`__setRequirementFlavorOverride`,
`__setDiscoveryFlavorOverride`, `__setJudgeFlavorOverride`,
`__setRakeCapLineOverride`, `__setRestOpenLineOverride`,
`__setSleepLineOverride`, `__setSleepAnnounceLineOverride`,
`__setWorksFlavorOverride`, `__setIntroTitleOverride`,
`__setDialogueTextOverride`) + now `__setLogTakeOverrides`. dev.ts's
`syncReqFlavor` hand-mirrors all of them. Every new unit class adds
plumbing; every forgotten mirror is a silent "didn't flip live" bug
(dialogue, then the log classes, then rake-cap — all session-200
finds). 24 setter references + 15 sub* call sites today.

## The proposal

### A. A take IS a flat text map (gen-time canonicalization)

`gen:narrative` already knows the canon def for every unit while
compiling takes. Emit each take as
`Readonly<Record<contentKey, string>>` — the SAME address space the
log already persists (`intro.dream.opt.dream-dwell.say`,
`beat.R3.greeting.<canon-id>`, `flavor.sleep`,
`dialogue.genemon-open.gen-rake`, …). The compiler maps the take's
blind slugs onto canon ids positionally ONCE, at gen time, where a
mismatch can fail LOUD:

- take line count ≠ canon → the gate names the unit and the orphan
  lines ("take b of hd30-nengu greeting: canon has 5, take has 4 —
  line 5 would never re-voice"). Today that's a silent no-flip.
- the state-compatible law becomes machine-checked instead of a
  README norm.

The runtime positional-twin heuristic (log-render.ts, session-200)
DELETES — the reconciliation moved to the one place that has both
sides and a place to error.

The DEV reader/galley still renders side-by-side: it walks the CANON
def for structure and reads take text by key (it already knows the
key scheme — `readerUnitsOf` builds these strings today).

### B. One overlay, one setter, one funnel

- ONE core module (`core/content/story-overlay.ts`, a leaf):
  `__setStoryOverlay(map: Record<contentKey, string> | null)` +
  `storyText(key): string | undefined`.
- `renderLogLine(key, params)` consults the overlay FIRST, then the
  canon resolvers. It is already the one place a stored descriptor
  becomes prose — this makes it the one place a TAKE becomes prose,
  for all three read moments (emit, save-load, DEV repaint).
- Emit sites simplify: a keyed narrative emission passes contentKey
  and NO text (the Stage-C mechanical form rewards.ts already
  renders) — emit-time and re-derive-time can then never disagree,
  and the per-line wrapper fns (`rakeCapLine()`, `restOpenLine()`,
  `sleepLine()`, `sleepAnnounceLine()`, …) + their setters delete.
- dev.ts `syncReqFlavor` collapses to: flatten the effective takes'
  records into one map, call one setter. (~150 lines → ~15.)
- Render-read surfaces (Progress objectives, cold-open title card,
  VN active-scene lines) call the same `storyText(key) ?? canon`
  helper instead of bespoke `sub*` fns.

Parametrized lines (`coldOpen.rake`, `pillar.judge`, `home.rest`,
activity lines) keep their resolvers; a take overlays the TEMPLATE
source where one exists (flavor keys) or is not divergeable — same
as today, but stated in one place.

### C. Gate the keyless-emission class

A verify-lane test drives the full-arc sim and asserts every
non-ephemeral `narration`/`system` log entry carries a `contentKey`
(explicit allowlist for the deliberate exceptions, if any survive B).
The rake-cap bug (emitted keyless, invisible to every swap) becomes
impossible to reintroduce. Highest sound rung: it's a content
invariant, never cries wolf.

### D. Key the 幕-head `context` (closes the last residue)

Entries persist `context` as baked prose; intro-title flips can't
reach logged heads. Add `contextKey` (e.g. `intro-title.dream`)
beside it, render-derive in DEV like text. Save-shape change +
migration (old entries keep baked context — TST2 for real saves).
Optional; smallest value, only piece needing a migration.

## Sequencing (each lands alone, verify-green)

1. **A** — gen-time flat takes + loud mismatch gate (kills the id
   problem at the root; deletes the twin heuristic).
2. **B** — single overlay/funnel (deletes ~9 setters + 15 sub sites;
   TST1: one home).
3. **C** — the keyless gate.
4. **D** — contextKey, if wanted.

A and B are independent enough to review separately but B is much
smaller after A. Estimate: A ~half day (compiler + reader + gate +
tests), B ~half day (mostly deletion), C ~1h, D ~2h.

## What this deliberately does NOT change

- The bundle/take authoring format (`takes/*/bundle.md`, blind
  authorship, per-take .md files) — authors keep their own slugs;
  the COMPILER reconciles.
- The Review-tab UX, HR-item flow, per-unit override pills.
- Canon registries and the FB-5 narrative pipeline.
- Prod: everything stays DEV-gated and strip-checked.

## Open questions for the human

1. Lock the "prose-only takes" policy as an enforced gate (A)? A
   future take that NEEDS a structural variant (extra option, new
   topic) would then require the `native:` escape (a real code
   diverge), not a story take.
2. Is D (context keying) worth a save-schema bump now, or park it?
