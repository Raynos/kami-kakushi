# DAIFUKUCHO 大福帳 — The Steward's Desk

## 1. THESIS
The screen is not a page about the game — it is a steward's desk seen from directly above, and every object on it (ledger, soroban, hanko, slips, key, strongbox) *is* a control or a readout. This makes the incremental loop tactile — numbers become beads that click, actions become stamps that thunk, history becomes ink that dries — so "number goes up" is felt in the hands, not read in a header bar.

## 2. WIREFRAME (~1440px)

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  cedar desk plane — warm wood grain, raking daylight from upper-left           │
│ ┌───────────┐ ┌──────────────────────────────────┐ ┌────────────────────────┐  │
│ │ SLIP-     │ │      DAIFUKUCHO (open book)      │ │  SOROBAN (vertical)    │  │
│ │ CALENDAR  │ │  ┌────────────┬────────────────┐ │ │  ═╪═╪═╪═╪═╪═╪═        │  │
│ │ 安永九年  │ │  │ verso:     │ recto:         │ │ │  rice coin wood sansai│  │
│ │ 春・十四日│ │  │ RUNG page  │ living log,    │ │ │  beads = carried pools│  │
│ │ ◐ moon    │ │  │ 手代→門番  │ brush-in lines │ │ ├────────────────────────┤  │
│ ├───────────┤ │  │ meter=ink  │ "You rake the  │ │ │ KURA KEY on cord ──►  │  │
│ │ QUEST     │ │  │ column     │ spilled rice…" │ │ │ LACQUER STRONGBOX     │  │
│ │ SLIPS     │ │  │ filling    │ (+3 rice)      │ │ │ (banked pools, lid    │  │
│ │ (string-  │ │  └────────────┴────────────────┘ │ │  opens = deposit UI)  │  │
│ │  bound)   │ └──────────────────────────────────┘ └────────────────────────┘  │
│ ├───────────┤ ┌──────────────────────────────────┐ ┌────────────────────────┐  │
│ │ ESTATE    │ │  HANKO TRAY — stamps = verbs     │ │ DESK EDGE: whetstone,  │  │
│ │ MAP as    │ │ [田][採][樵][鍛][蔵][門] + walk  │ │ carrying-pole (durab.  │  │
│ │ folded    │ │  receipt slips slide in here ──► │ │ = visible wear), HP =  │  │
│ │ picture-  │ │                                  │ │ SOAN'S CHIT tucked in  │  │
│ │ map 絵図  │ └──────────────────────────────────┘ │ book; settings = inkstone│ │
│ └───────────┘                                      └────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────┘
```

Mobile: the desk becomes a scroll *down* the desk's length — book first, soroban docked as a persistent bottom rail, hanko tray as a thumb-reach fan; objects never reflow into cards.

## 3. ANATOMY
- **Log** — the recto page of the open daifukucho; entries brush in top-to-bottom, older pages turn back (scroll = page-riffle).
- **Verbs** — the hanko tray: six carved stamps, one per activity. A stamp greys with distance — you must *walk* first: tapping a far stamp slides a small walking-slip ("to the okuyama — 2 ticks") before it inks.
- **Vitals** — HP is Soan the physician's chit tucked into the book's gutter (a brushed number + a red fold when hurt); meals cooked = the chit re-inked.
- **Resources** — carried = soroban beads (five rods: rice/coin/wood/sansai/drops); banked = inside the strongbox, opened by clicking the kura key *only when standing at the kura node*.
- **Rung meter** — the verso page: a vertical ink column filling toward the next rung's name, written but un-stamped.
- **Map & walking** — a folded ezu picture-map, seven inked nodes, your position a small red dot that walks.
- **Combat** — a field-report slip slides onto the desk over the tray: foe sketch (bestiary un-fogs here), forecast as the steward's pencilled margin note ("勝算 二分九厘 — 29%"), stance = three brush-circles (下・中・上) you tick.
- **Quests/market/skills** — string-bound slips at left; pedlar's bill unrolls across the whole desk when he visits; skills are marginalia tallies in the book's gutter (農 正正一).
- **Settings** — the inkstone, lifted.

## 4. SIGNATURE MOVE
**The stamp-and-slip.** Every action is a hanko pressed: the stamp dips (scale 0.96, 90ms), *thunks*, and a small washi receipt slides out from under it onto the desk — "薪三束 wood +3" — then, one beat later, the matching soroban beads click over and the log line brushes itself in. Cause (stamp) → artifact (slip) → consequence (beads, ink). Slips accumulate loosely for the current day, then are speared onto the harigata spike at day's end — your session, physically piled.

## 5. KEY MOMENTS
- **(a) Deed tick** — stamp thunk → slip slides 240ms → one bead eases over with a click → log line draws in. Quiet; no colour.
- **(b) Fight** — report slip slides in, foe sketched in three strokes, forecast pencilled, stance circled; the fight annotates itself stroke by stroke down the slip; a red 勝 or black 負 chop lands with the screen's one permitted thump.
- **(c) Rung-up** — the whole book lifts and turns a page (600ms, paper sound implied by motion); the new rung's name is already written in heavy display mincho; the house seal (vermilion, the reserved accent) presses onto it.
- **(d) Seasonal judge** — a double red rule strikes across the recto; every rod of the soroban sweeps to zero in one satisfying tilt-reset; the koku line is restated in red on a fresh audit page.
- **(e) Panel reveal** — a new object is *placed on the desk* by an unseen hand from off-screen edge (e.g. Kihei's yard opens → the whetstone slides in), with one log line. Locked systems exist as visible mysteries: a string-tied bundle you can nudge but not open.
- **(f) Minute one** — a bare desk in half-light: one page, one stamp (田), the soroban's rods empty and un-labelled. Everything else is dark wood.

## 6. MATERIAL & TYPE
Palette: **kuri-cedar #6B4A2E** (desk), **washi #E8DFC8** (paper), **sumi #2B241C** (ink — never #000), **shu vermilion #B03A2E** (seal/audit only — the reserved accent), **roiro lacquer #3A2F28** (strongbox/soroban frame), **karashi #C9A227** (brass fittings, sparing). Type: **Toppan Bunkyu Midashi Mincho** for rung names/seals (display), **Hiragino Mincho ProN** for log prose, **Klee** for marginalia/forecast pencil notes, **Iowan Old Style** for Latin numerals — tabular, reserved-width. Depth = material logic: slips overlap slips with a 1px ink-edge and paper-tone shift; feTurbulence grain on washi and wood; zero drop-shadows.

## 7. MOTION SCRIPT
1. Slip slide-in: translateX 40px→0, cubic-bezier(.2,.9,.3,1), 240ms.
2. Soroban bead: translateY per bead, ease-out-back (subtle), 180ms, staggered 40ms — the count-up.
3. Log brush-in: clip-path inset reveal left→right, linear, 30ms/char.
4. Page turn (rung-up): 3D-less fake — page scales/skews via two stacked halves, 600ms ease-in-out.
5. Judge sweep: all beads translate together, 400ms ease-in, then 120ms settle.
Reduced-motion: slips/beads/pages appear at final state instantly; the log still "dries" via a 200ms opacity step so causality survives.

## 8. FUN AMPLIFIERS
1. **Beads are countable objects** — 47 rice is a physical arrangement you learn to read at a glance; a bead clicking over is felt progress even peripherally.
2. **Slips pile up** — the day's work is literally on the desk; spearing them at dusk is a free end-of-session dopamine ritual.
3. **The book thickens** — turned pages accumulate a visible fore-edge; long-term progress has mass.

## 9. RISKS
1. **Legibility** — object-UI can bury state. Mitigation: every object carries one clear tabular numeral in a fixed spot; hover/tap lifts it 4px with a plain-text label.
2. **Kitsch** — "cute Japanese desk" slides into theme-park. Mitigation: hard cap of six surface tones, no ornament that isn't functional, vermilion strictly rationed to seal/audit.
3. **Performance** — many textured SVGs + bead animations. Mitigation: feTurbulence baked once to reusable pattern fills; beads animate transform-only; slips capped at ~12 in DOM (older ones merge onto the spike as one group).
