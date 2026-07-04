# Plan — UI-v2: the Andon Steel migration (v0.3.6)

**Status: 🖊️ PROPOSED — interactive co-authoring with the human (session 63,
2026-07-04). NOT approved to build.** Open decisions are marked **❓** and get
locked with the human before the milestone that needs them. Built on two grounding
analyses (this session): the Andon Steel design-language catalog + the current-UI
delta/locks map. The reference build is `ui-demos/10-andon-steel/`.

## Premise (locked)

- **D-127:** Andon Steel is UI-v2's direction, and (human, 2026-07-04) it is a
  **FULL REPLACEMENT** of the washi/woodblock identity — not a "dark edition"
  beside it, no coexistence toggle. The old identity retires.
- **`ui-demos/10-andon-steel/` is a VISUAL target only.** We port its *design
  language* (tokens, bimetal semantics, compositional ideas, the animation
  *looks*). We do **NOT** port its code, and we **copy zero bugs**.
- **Keep our engine.** `src/ui/reconcile.ts` (keyed append-only reconcile, CSS-
  transition meters) + `src/ui/render.ts` (build-once/patch, view-gating, number-
  pop, log scroll-preservation, the existing typewriter/stagger machinery) + the
  **7-tab IA** are all **style-agnostic — untouched**. UI-v2 only changes *what
  classes / tokens / SVG the engine emits*, never how it emits.
- **The pure core is untouched entirely** — no rule, number, or loop changes. This
  is a presentation migration.

### Do-NOT-copy (from the demo's throwaway mock — the catalog's list)
The demo ignores the engine's `events[]` and re-renders every surface ~2×/sec by
string-diffing innerHTML; hand-rolls a fragile log reconcile; pokes the DOM for
meters/pops; chains cold-open timers with a redundant double-fire safety net;
mutates `eng.state` directly in one "documented hack"; uses `onclick=""` iOS hacks
and non-null-safe reads. **None of this crosses into `src/`.** We rebuild every
one of those behaviours on our real reconcile engine.

## Who builds this — Fable or Opus?

**Verdict: Opus for the design milestones (M1–M6); the doc-ripple (M7) is
Fable-eligible.** The theme/material/layout/motion work is taste-critical creative
UI — exactly the judgment D-124 keeps on the parent model; subagents inherit Opus,
no lateral/down-tier switch. The pure-mechanical alias re-point (M1's first step)
and the M7 doc-ripple (retire woodblock phrasing → steel) are the only
Fable-sanctioned slices, and only once the *look* is locked. Proposed for the
human to approve; not self-licensed.

## The two axes (your framing)

Every change is classified on **both** axes so we can order by risk *and* keep the
theme-vs-flow line bright.

**Change-type — what kind of thing moves:**
- **① THEME** — color / type / texture. Pure CSS-token + material swaps. *The game
  plays identically; it only looks different.*
- **② LAYOUT** — composition / structure (where things sit).
- **③ FLOW / BEHAVIOR** — interaction / motion / cadence (how it feels to act).

**Risk tier — how much can break, how reversible:**
- **LOW** — token/CSS-only, rides the engine untouched, revert = flip a variable.
- **MED** — new material recipes / component restyles / redesigned cold-open.
- **HIGH** — anything touching the interaction model or composition.

## The migration levers (grounded in the analysis)

- **Semantic aliases** `styles.css:68-87` (~14: `--bg/surface/surface-deep/text/
  text-2/line/link/num-key/delta-*/seal` + `--pillar-*`). Re-point → **most of the
  palette moves with zero component edits.** ① THEME · **LOW**.
- **8-role → 3-role collapse.** Washi's 8 pigment roles reduce to silver=state /
  gold=value / vermillion=commit; roles like `--rokusho/kihada/murasaki/attr-*`
  lose meaning and fold into the steel ramp. ① THEME · **LOW–MED**.
- **Material recipes** — `.paper` feTurbulence grain, `.frame` woodblock triple-
  inset border, `.hanko-css`, bokashi gradients → **blackened-steel plates** (1px
  gold keyline + silver top-rim), the **dark recessed log well**, textures dropped.
  ① THEME · **MED** (biggest CSS rewrite).
- **Cold-open** → **GBA typewriter open** (the current one is a static title card;
  the typewriter cadence already exists in `render.ts`). ③ FLOW · **MED**.
- **VN nameplate + rank-up/ascension seals** → steel re-skin (keep the VN/ceremony
  *contract* D-104/D-110/D-062; re-skin the materials). ①/③ · **MED**.
- **Commit-seal cursor + vermillion bloom** — ~~the demo's signature net-new
  BEHAVIOR~~ **CUT (human, 2026-07-04): no red flash on click.** Not ported. We keep
  the game's existing seal-press feedback; vermillion stays reserved for the
  rank-up / ascension beats (M4), not per-click. This removes the highest-risk item
  from the whole migration.
- **Andon composition** (left-rail nav + right-hand log "window" + center desk) vs
  keeping today's full-width multi-panel workspace re-skinned. ② LAYOUT ·
  **MED–HIGH**. **❓ adopt or keep (see Open decisions).**

## The phased milestones (ordered low → high risk)

Each milestone is a coherent, **buildable + playtestable** slice. You playtest
R0/R1 after the early ones and steer before we touch anything risky.

- **M1 · Steel palette core** — ① THEME · LOW. Re-point the ~14 semantic aliases;
  collapse the 8-role palette to the bimetal. No component/engine edits. *First
  playtest gate: R0/R1 look steel, play identically.*
- **M2 · Steel materials** — ① THEME · MED. Re-author plates (keyline + silver
  top-rim), the dark recessed log well, meters (gold thread in steel groove);
  drop paper-grain + woodblock frame + bokashi. *Second playtest gate.*
- **M3 · GBA-typewriter cold-open** — ③ FLOW · MED. Redesign the cold-open surface
  to type the lede char-by-char (reuse `TYPE_MS_PER_CHAR`), RM-safe, one-shot.
- **M4 · VN + ceremony re-skin** — ①/③ · MED. Steel VN nameplate/scroll; rank-up +
  T0→T1 ascension seals restyled to the vermillion-commit motif. Contract kept.
- **M5 · Layout → Andon composition** — ② LAYOUT · MED–HIGH. **❓ OPTIONAL** — only
  if we choose to adopt the rail+window composition; else this milestone is
  "keep-composition, already reskinned by M1–M2" and drops out.
- ~~**M6 · Commit-seal cursor**~~ — **CUT** (human: no red-flash-on-click).
- **M6 · Doc ripple + lock retirement** — Fable-eligible. Rewrite the visual-
  identity sections of `ui-design.md`, the pointer line in `taste.md`, and the
  woodblock phrases across the four PRD files; new ADR retiring the D-018 washi
  lock (keep its "CSS-only, no asset pipeline" constraint). Runs `/prd-ripple`.

## What changes flow vs theme (the explicit split you asked for)

- **Pure theme — the game plays IDENTICALLY, only looks different:** M1, M2, and
  M4's materials. Zero flow change; the pure core never moves.
- **Flow / behavior changes:** M3 (cold-open cadence) and M5 (layout — where things
  sit), *if* we adopt it. These are the ones to scrutinize and playtest hardest.
  (The commit-seal cursor — the only other flow change — is **cut**.)
- **Rules / numbers / core loop:** untouched in every milestone.

## Locks that unlock (the ripple — M7)

Adopting UI-v2 reopens the woodblock canon. D-127 is the meta-unlock (already
declares it superseded *as the target*). The concrete list:
- **ADRs:** **D-018** (THE woodblock lock — palette/type/frames/grain/hanko; rewrite
  aesthetic, keep the CSS-only constraint) · **D-126** visual-identity clause
  (resolved) · **D-045** a11y ink rule (steel needs its own contrast guarantees) ·
  **D-068** SFX-justification re-caption · **D-104/D-110/D-062** ceremony *materials*
  (structure kept) · **D-106/D-115** + **R2/R5/R6/R7** flagged possibly-moot (❓).
- **Docs:** `ui-design.md` §1/§2/§3/§4.1/§6/§7/§9 (visual sections) · `taste.md`
  the one woodblock pointer line · PRD woodblock phrases in `01-vision`,
  `02-systems`, `06-tech-architecture`, `07-roadmap-scope`. IA + render-contract +
  the 4 taste values all **survive**.

## Open decisions ❓ (lock with the human before the dependent milestone)

1. **Layout depth (gates M5).** Keep today's composition and only re-skin it
   (lowest risk, fastest to a playable steel R0/R1) — or also adopt Andon's
   left-rail + right-log-window composition? Recommend: **re-skin first, decide
   M5 after you've played the M1–M2 steel look.**
2. ~~Commit-seal cursor~~ — **RESOLVED (human, 2026-07-04): CUT.** No red flash on
   click; M6-cursor removed.
3. **R2/R5/R6/R7 interim picks.** Are the open washi-UI variant reviews still wanted
   as interim polish, or dropped now UI-v2 supersedes them? (Carried from D-127.)
4. **Version.** `v0.3.6` (incremental, per your ask) or `v0.4.0` (this is a UI
   *generation*)? Default: **v0.3.6** as you said.

## Definition of done (per milestone)

- `npm run verify` green; **headless** capture of R0/R1 (+ the milestone's surface)
  via `qa-shots.mjs` / `__qa`; **the human playtests R0/R1 and signs off** before
  the next milestone. Each milestone commits + journals as it lands.
- Engine untouched (reconcile/render contract intact); zero copied demo bugs;
  reduced-motion + touch paths verified for any FLOW milestone.
- Final: M7 ripple green (`prd:drift` clean), the woodblock locks retired by ADR.
