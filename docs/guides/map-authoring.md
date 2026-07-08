# Map authoring — how to build, edit, and verify the survey sheets

**A living guide** (process, not canon). The complete procedure set for working
on `src/ui/map-sheets/` — written so a NON-Fable session (Opus/Sonnet) can do
map work safely: the taste that shipped T0/T1 is externalized here as laws,
checklists, and a machine-runnable verification loop. Companions:
[`map-spec.md`](map-spec.md) (what T0/T1 depict + the §5 blind rubric),
[`map-styles.md`](map-styles.md) (scale classes + designing NEW tier sheets),
the [module README](../../src/ui/map-sheets/README.md), and the
[`map-sheets` skill](../../.claude/skills/map-sheets/SKILL.md) (the entry
point that routes to a section of this guide).

## §0 · Orientation, and when to escalate

The sheets are **player-bound** (ADR-149/151): the T0/T1 survey drawings become
the game's real map in the storywave build. The current rendering **passed the
human's taste review (HR-12)** — your job when editing is to change exactly
what you intend and provably nothing else. Three escalation rules:

- **New tier sheet / new scale class** → spec first, human reads it (an
  HR-item), build only after the nod (human ruling, 2026-07-08). Procedure in
  [`map-styles.md`](map-styles.md) §4.
- **Fiction-voiced text** (zone blurbs, rumor notes, names a player reads) →
  ADR-139 narrative-diverge, not a solo edit.
- **A restyle of the sheet's look** (substrate, stroke language, palette) → a
  taste call: ADR-135 two-pass scorecard + an HR-item. Geometry/craft work
  under the existing look needs neither.

## §1 · The five laws (why, and what enforces each)

1. **Deterministic** — one seed paints one identical sheet (TST2: the ground
   never shifts under the player; also what makes the golden pin possible).
   ALL randomness is `rng(seed)` from `brush.ts`; no `Math.random`/`Date`.
   *Enforced by:* the golden pin (any nondeterminism = flaky RED immediately).
2. **Tokens only** — Andon Steel vars; silver = drawn state, gold = built
   structure, shu = reviser's red (spec §3). A hex literal breaks theme
   consistency silently. *Enforced by:* review; grep `#[0-9a-f]` before commit.
3. **Brush-alive** — tapered strokes, seed-jittered glyphs, never a stamped
   grid (spec L2/L6 — the anti-AI-slop line). Micro-detail goes in the
   `.ms-fine` register (`fineLayer(parent)`) so fit view stays composed and
   zoom pays craft (L10). *Enforced by:* the blind-pass rubric R11.
4. **One geography** — `layout.ts` is THE world; T0 = a crop. Tiers may only
   differ by `TIER_DELTA` state. Moving a landmark between tiers is a canon
   error (it broke the original maps — see the archived rebuild plan's audit).
   *Enforced by:* `integrity.test.ts` (anchors/rosters) + the rubric R12.
5. **Pin-guarded** — `golden.test.ts` re-renders both grounds in jsdom and
   hashes every element's tag + draw attributes in document order against
   `golden.hash.json`. *This is the contract that makes map work safe for any
   model:* a refactor proves itself look-neutral (pin GREEN, no regen); a
   visual change is loud (RED) and lands only with a deliberately regenerated
   pin + eyeballed captures in the same commit.

## §2 · Workflow: edit existing geometry or craft

1. Find the data, not the drawing: positions/polygons live in `layout.ts`
   (`ANCHORS`, `WASHES`, `FIELDS`, `GUEST`, `PRECINCT`, `RIVER`, `ROADS`,
   `WATER`, `WILDS`, `HILLS`); the painter that consumes them is `ground.ts`.
   Only reach into a primitive module if the *idiom* itself changes.
2. Make the edit. Run the pin: `pnpm exec vitest run src/ui/map-sheets/`.
   - Pin **GREEN** and you meant to change the look → you edited dead data;
     find the real site.
   - Pin **RED** (expected for a visual change) → capture BEFORE deciding:
     `pnpm run dev` (if not up) → `node src/scripts/map-audit-shots.mjs
     tmp/my-change/` → **look at the images yourself** (Read the PNGs). Both
     sheets — a `layout.ts` edit can ripple into the other tier's frame.
3. Satisfied → regenerate the pin and commit it WITH the change:
   `UPDATE_MAP_GOLDEN=1 pnpm exec vitest run src/ui/map-sheets/golden.test.ts`.
   Never regen to silence a RED you can't explain.
4. Look-bearing change (a blind reader might read the sheet differently) → run
   the blind-pass loop (§5). Pure craft polish (a stroke weight, a jitter) →
   your own capture review is enough.
5. Commit by pathspec (shared tree); `pnpm run verify` green; the commit body
   says what changed visually and why the pin regen is intentional.

## §3 · Workflow: add a zone

A zone = narrative data + a seal anchor + drawn ground + (T0) a reveal rung.
`integrity.test.ts` fails until the set is complete — let it drive you:

1. **`nodes.ts`** — add the `SheetNode` to `T0_NODES` and/or `T1_NODES`: id,
   kanji seal char, name, kind, blurb, actions, who, the WRONG THING (every
   zone carries one visible wrongness — spec §1; it's the sheet's storytelling
   spine). Zone text is fiction-voiced → ADR-139 applies to new prose.
2. **`layout.ts`** — an `ANCHORS` entry (world units; `room: true` for
   interior seals so the house doesn't drown in chips).
3. **`ground.ts`** — draw the zone's ground from primitives, keyed off
   `TIER_DELTA` if it differs by tier. Position data belongs in `layout.ts`,
   not inline (the spec-§4 rule; G-6 was the cleanup of exactly this leak).
4. **T0 rung gate** — add the id to `RUNG_LADDER` (`nodes.ts`); if the fog
   frontier moves, extend the matching `REVEAL` stage polys/ghosts/notes
   (`reveal.ts` — data only). Rumor notes are ENGLISH (the strip policy,
   FB-181/183: no unexplained kanji on a player-bound sheet).
5. If the zone changes what the sheets *depict*, update
   [`map-spec.md`](map-spec.md) (living) — and if a cold reader SHOULD now
   recover something new, add/adjust a §5 rubric line.
6. Pin regen (§2 steps 2–3) → blind pass (§5) → verify → pathspec commit.

## §4 · Workflow: a new primitive (terrain / building / feature)

1. Pick the vocabulary module (`terrain` / `water` / `fields` / `flora` /
   `built` / `furniture`). Geometry helpers you need probably exist in
   `geom.ts` — extend THERE, never inline (one geom home, G-5).
2. Follow the API idiom (stated in `brush.ts`'s header): emitter =
   `(parent, …geometry, o: XxxOpts)` with `readonly seed: string` in a named
   exported Opts interface (`SeedOpts` if seed-only); return the one element
   appended, `null` if nothing, `void` only for many-element emitters.
3. Determinism discipline: take `o.seed`, derive sub-seeds as template strings
   (`` `${o.seed}:lid` ``) — stable, insertion-safe. `seedSeq` sequences are
   call-order-dependent: fine within one glyph, but know that inserting a call
   reshuffles everything after it (pin RED — regen deliberately).
4. Craft bar (spec §3): stroke weights live on the L2 ladder — hairline ~0.8 ·
   fine ~1.2 · working ~1.8–2.2 · structure ~3–4.5 (tapered `brushStroke`,
   never uniform). 3–5 silhouette variants + rotation/scale jitter for any
   repeated glyph (L6 — never a stamp; this is a design feature, so do NOT
   `<defs>/<use>`-dedupe glyph shapes for perf). Micro-detail → `fineLayer`.
5. Node budget: sheets sit ~15.6k elements; the pin's blowup guard fails past
   25k. Area textures emit ONE multi-subpath `<path>` (see `hatchArea`/
   `stipple` — the G-2 idiom), not per-mark elements.
6. Wire it into `ground.ts` from `layout.ts` data → §2's pin/capture flow.

## §5 · Verification — the blind-pass loop

The loop that shipped T0/T1 at the AA bar, runnable by any agent:

1. **Capture** — dev server up →
   `node src/scripts/map-audit-shots.mjs project/audit/screens/<date>-<slug>/`
   (fit + quadrants + deep zoom, both sheets; flips `data-zoom` so the fine
   register is IN the shots — never screenshot the modal by hand for this).
2. **Blind describe** — one fresh agent per sheet, given ONLY the images
   (no repo access in the prompt): *"Describe the place this survey sheet
   depicts — geography, settlement, water, what seems old/new/wrong."* The
   agent must not read `map-spec.md`; blindness is the point (PH2).
3. **Judge** — an agent scores each description against
   [`map-spec.md`](map-spec.md) §5: every **M** line must be recovered; ≥ half
   the **S** lines. A miss names the drawing gap to fix; iterate.
4. **Report** — a scored report in `project/audit/reports/` (committed).

**One command:** the `map-blind-pass` workflow
(`.claude/workflows/map-blind-pass.js`) runs capture → describe → judge →
report; its loop agents run on Sonnet (human-blessed routing, 2026-07-08).
Invoke via the Workflow tool, **scoped to the sheet you edited**:
`{ name: 'map-blind-pass', args: { sheets: ['T1'] } }` — most edits change
one sheet's read. Run the FULL both-sheet pass (`{ name: 'map-blind-pass' }`)
only when it earns its cost: shared geometry moved (`layout.ts` — R12 needs
cross-sheet agreement), an HR/milestone close, or a new tier's acceptance.
Run frequency: look-bearing changes only — refactors ride the pin (free) and
craft tweaks need just your own capture review.

## §6 · Model routing — what needs whom

- **Any model, safely** (pin + rubric + integrity test carry the risk):
  geometry edits, zone additions under the existing idiom, new primitives
  following §4, tier-delta columns, perf work under a green pin.
- **Fable / human taste** : a new scale class's style definition, rubric
  authoring for a new tier's spec (map-styles §4 — the spec is the
  taste-heavy artifact; the human reads it before build), any restyle of the
  committed look (ADR-135 + HR-item).
- Subagents you spawn inherit your model (D-124); route the blind-pass
  describe/judge agents as-is — blindness matters more than model size there.

## §7 · Gotchas ledger (paid for; don't re-buy)

- **Captures must flip `data-zoom`.** Setting the SVG viewBox directly
  bypasses the shell's zoom handler and hides `.ms-fine` — this bug silently
  blinded five blind passes (s115 T-1). `map-audit-shots.mjs` does it right.
- **Full-page screenshots of the modal need `shotRoot: document.body`** — the
  map scrim mounts on body, outside `#app` (FB-195).
- **The pin renders at collect time** in jsdom; a 1ms test run is normal (the
  ~700ms is in "collect"). RED output names tag/attr counts — diff the hash
  file only after you've seen captures.
- **`toFixed(1)` is part of the pinned stream** — don't "clean up" number
  formatting in emitters.
- **The caption pass excludes a seal's own chip** when collision-testing
  (self-exclusion bug, s115 blind pass 3) — extend `drawSealLayer`'s pass, not
  per-seal hacks.
- **The paper-warp filter suspends during zoom** (G-3, ~10ms/frame) — don't
  add whole-sheet filters without measuring a zoom trace.
- **`insetPoly` is centroid-scale** (documented in `geom.ts`) — elongated
  polygons inset unevenly; the pinned look leans on it. A true edge-offset
  inset is a visual change with a pin regen, not a refactor.
- **JP text on the sheet is design-gated**: seals/kanji glyphs stay; anything
  a player must UNDERSTAND is English or glossed (the FB-181/183 strip).
