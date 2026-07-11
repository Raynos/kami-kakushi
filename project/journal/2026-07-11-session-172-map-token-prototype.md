# Session 172 — 2026-07-11 — physical-token map presence prototype

**Summary:** Built the human-requested feel-test prototype: a physical piece
(koma / miniature / go stone / pilgrim hat) sitting on the REAL T0 survey
sheet, travelling between zones as a linear animation — the proposed
replacement for the flat shu square/circle/footsteps presence marks (FB-340 /
HR-26 territory). Lives in `project/prototypes/map-token-presence/`.

## What changed
- `project/prototypes/map-token-presence/physical-token/t0-sheet.svg` — the
  real T0 sheet baked standalone: harvested the live render (headless, via
  `openTierMap('T0')` per the map-audit-shots idiom), embedded the sheet's CSS
  rules + the 54 resolved Andon Steel custom properties into an inline
  `<style>` so the SVG renders faithfully with zero external deps (3.4 MB).
- `project/prototypes/map-token-presence/physical-token/index.html` — the
  prototype: token layer overlaid on the baked sheet in the same viewBox
  coordinates; T0 zone anchors copied from `layout.ts` as labeled mock data.
  Four token builds (将棋 koma with bevel/grain/主 kanji · upright wooden
  miniature with shu sash · polished go stone with the gold 黒 mon · true
  top-down 笠 pilgrim hat with swaying gait + sandal tips), three movement
  idioms (walk + fading shu footprint stamps · slide · lift & place with the
  shadow separating and softening under the lifted piece), optional camera
  follow (zoom-in lerp during travel, eases back to fit on arrival). Travel is
  linear constant-speed per the ask; click a zone seal or anywhere on the
  sheet.
- `project/prototypes/README.md` — new `map-token-presence/` plan-folder
  section (no owning plan yet; prototype precedes plan).
- `project/todo-human.md` — reading-queue entry (play the prototype).

## Next intended steps
1. Human plays the prototype → verdict per token + movement idiom (⭐/REFERENCE
   tags into the prototypes README).
2. If it lands: an owning plan for wiring a token presence into the live map
   tab (`src/ui/map-variants/sheet-map.ts`, the FB-340 presence layer) —
   respecting the golden pin (the token layer is shell/overlay, not hashed
   ground).

## Landmines
- `t0-sheet.svg` is a BAKED CAPTURE (2026-07-11) — it will drift from the live
  sheet as map work lands; re-bake via `tmp/extract-t0-sheet.mjs` +
  `tmp/bake-t0-svg.mjs` if the prototype needs refreshing (both scripts are
  git-ignored scratch; the journal is their record).
- Headless QA hook blocks the playwright MCP (headed) — drive prototype shots
  through node playwright scripts, same as the game.

---

## Entry 2 — round 2: the human steers the feel-test live

Live feedback while iterating: (1) koma / go stone / pilgrim hat are "not the
fit" — REMOVED (builds recoverable at `73300fa1`); the miniature/peon idiom is
the theme. (2) First miniature set was too samey ("the same robe with one
piece of flare") and mis-sized — first too large vs the zone-seal labels, then
0.55 too small; landed on 0.82 (+50%, the human's middle ground). (3) Needed to
zoom in AND STAY zoomed to compare sculpts — added a persistent manual camera
(scroll-to-zoom at cursor, drag-to-pan, drag suppresses travel clicks; camera
follow now zooms at least as far as the manual view).

New sculpt set — divergent in material / silhouette / base / gait:
- 根付 **porter** — boxwood netsuke, bundle high on the back, staff, heavy waddle
- 塗 **painted lord** — indigo kamishimo wings + gold mon, lacquer base, glides
- 切絵 **ink cutout** — flat sumi paper-cut walker on a wood block, tilts
- 埴輪 **clay peon** — fired-clay flared cylinder, hollow eyes, stomps

Zone landings now offset ~46 units south of the seal so the piece stands
BESIDE the label, never behind it (first vet showed it hidden by the seal box).

Self-vetted headlessly per sculpt (zoomed crops via the `window.__proto` QA
hook); porter + cutout were redrawn once after the first vet read muddled.

---

## Entry 3 — the verdict + the owning plan

Human verdict: **⭐ the 根付 porter, walk + footprints idiom**; the other three
sculpts are REFERENCE. Locked constraint: on the real map the piece is an
**indicator only** — display-only, derived from game state, animated by real
`move_to` actions (clicking a walkable seal); never freely movable — the
prototype's click-anywhere travel is prototype-only.

Authored the owning plan
`docs/plans/fable-2026-07-11-map-porter-presence.md`: port the sculpt into
`src/ui/map-variants/porter-token.ts` (+ pure walk-math helper), replace the
resting here-ring, ride the existing `travelPresenceRef` / ActionClock driver
(footprints + follow + P12/P14 kept), DEV toggle v1/v2 with v2 default,
sequenced AFTER the in-flight map-viewer one-engine extraction (same file).
Prototype README tagged (⭐/REFERENCE + owner), reading queue swapped to the
plan (prototype entry cleared per ADR-089 — played & picked).

---

## Entry 4 — the porter goes LIVE (plan executed)

Built FB-340 v2 end-to-end per the plan + the AskUserQuestion decisions:

- `src/ui/map-variants/porter-math.ts` — pure walk math (linear `walkPoint`,
  bounded `gaitAt`, `PORTER_STAND_Y`/`PORTER_SCALE`), unit-tested (7 tests,
  fixtures derived from the module's own constants).
- `src/ui/map-variants/porter-token.ts` — the sculpt, ported from the
  prototype onto new `--piece-*` tokens (styles.css; ui-tokens.md regenerated).
  Display-only: pointer-events none, aria-hidden. jsdom-tested (4 tests:
  contract class, per-mount gradient ids, no hex leaks).
- `sheet-map.ts` — `presenceVariantRef` ('porter' default | 'rings' v1);
  resting porter mounts beside the here seal (both branches, incl. unsurveyed
  ground); the travel player walks the piece on the STANDING lane
  (anchor + PORTER_STAND_Y) so departure/arrival match the resting spot
  exactly; destination ring is v1-only (dropped in v2 — human call); westward
  walks mirror the sculpt; gait freezes when the clock pauses.
- `dev.ts` — `presence` variant surface (porter default, rings kept for
  comparison until HR-31 confirms → then v1 deletes); `syncPresence()` mirrors
  the pick into the declaring-module ref; `render.ts` mapSignature carries the
  variant so a DEV flip repaints.
- Verified: full `VERIFY_FULL=1 pnpm run verify` green (18 gates); live
  headless run on the shared :5173 — resting mount ✓, real move_to fired the
  walk ✓, two porters only during transit ✓, zero destination rings ✓, overlay
  removed + one resting porter on arrival ✓, no console errors. Captures in
  `project/audit/screens/2026-07-11-porter-presence/`.
- Paperwork: ADR-180 · HR-26 archived (superseded) · HR-31 filed (confirm +
  v1 deletion) with the Pass-1 brief + Pass-2 scorecard (8✔ · 0✘ · 13—; P6
  borderline flagged: forecourt feet graze the 門 seal top). PRD: no §edit —
  the PRD never describes the presence marker (prd:drift currently red on a
  co-agent's mid-flight ADR-179 refactor, not this change).

## Next intended steps
1. Human looks at HR-31 live → confirm → delete v1 rings + the DEV toggle.
2. If the 門 graze bothers the eye: tune `PORTER_STAND_Y` (test guards >95).

## Landmines
- The presence variant ref is module-level state in sheet-map.ts — prod never
  writes it; only dev.ts's syncPresence touches it.
- The walking piece uses gradient id `porter-wood-walk` vs `-rest` — two
  porters legitimately coexist during transit; tests pin the namespacing.

### Taste Pass 2 — the full 21-walk (porter variant; v1 unchanged, not re-walked)

P1 ✔ piece is the one here-mark (v2 deletes both rings; v1 survives only as
the named HR-31 comparison toggle) · P2 ✔ reused footprints/driver/tokens ·
P3 — · P4 ✔ transform-patched, overlay torn down whole, sig-guard untouched ·
P5 — · P6 ✔ borderline (forecourt feet graze the 門 seal top — named in
HR-31) · P7 — · P8 — · P9 — · P10 — · P11 — · P12 — (typewriter n/a; the
motion-reduce path is the presence P12 guard, kept) · P13 — · P14 ✔ the walk
is a live response to the player's own move (P14 guard kept) · P15 ✔ no
destination preview, piece exists only where you are · P16 — · P17 ✔ shu seal
stroke + piece; far-zoom position readable · P18 — · P19 ✔ the piece stays in
the quiet chrome register (no ceremony, ~walk-length animation only) ·
P20 — · P21 — · TST1–4 ✔ (TST3: the piece is the surveyor's marker ON the
sheet artifact; TST2: mid-walk rebuild aborts cold via svg.isConnected).
Tally: 8✔ · 0✘ · 13— — zero knew-and-missed, zero blind spots; one borderline
✔ (P6) named forward.
