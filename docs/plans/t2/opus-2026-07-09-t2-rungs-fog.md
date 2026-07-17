# T2 (Valley) map — rungs + fog

**Status: ⏳ PARKED (human, 2026-07-17 — T2 work waits; pull forward
when T2 opens). Was READY TO BUILD (human-greenlit 2026-07-09).
Mechanics-only — no
golden-pin regen, no HR-item** (the fog is unhashed shell-runtime paint; the
default T2 render stays byte-identical). Best done as a focused pass: the fog
geometry wants live visual iteration via `?t2-map-demo`.

Captured from a read-only research agent (session 2026-07-09). The T2 sheet is
DRAWN (`?t2-map-demo`) but static — map-spec §6.1 "NOT DONE": no rung ladder
bound to zones, no fog/reveal. This adds both, matching how **T0** does it (T1
has neither — T2 is the second tier to get this, not the third).

## How T0 does rungs + fog (the mechanism to mirror)

All four pieces are **runtime-only, none golden-pinned**:

- **Rung ladder** — `RUNG_LADDER: Record<string,number>` (`nodes.ts:26`) maps
  zone-id → rung. `zonesAtRung(rung)` (`reveal.ts:107`) = `(id) => (RUNG_LADDER[id]
  ?? 1) <= rung`, the seal-visibility predicate. (`SheetNode.rung` at nodes.ts:22
  is declared-but-unused — the live mechanism reads the map.)
- **Fog geometry** — `REVEAL: RevealStage[]` (`reveal.ts:33`); each stage
  `{ rung, known?: Pt[], blobs?: Pt[][], ghosts?: Pt[], notes?: RevealNote[] }`.
  `known` = surveyed polygon (fog = window − poly, early stages); `blobs` = only
  these pockets stay fogged (late); `ghosts` = dashed 未 chips teasing next rung;
  `notes` = English rumor lines. Coords in **T0_WINDOW** units.
- **Painter** — `paintReveal(svg, art, seals, stage)` (`reveal.ts:113`).
  **Hardcoded to T0**: `const fr = T0_WINDOW` (reveal.ts:120) + a T0 `FURNITURE_HOLES`
  table (reveal.ts:97) that punches cartouche/north-arrow/scale-bar out of the fog.
- **Shell wiring** — `sheet.ts:743–768`, gated `if (tier === 'T0')`: a
  "rung: all / R1 / R3 / R5 / R7" pill cycles `STAGES=[null,1,3,5,7]`, clears
  `.ms-reveal`, toggles seal `display` via `zonesAtRung`, calls `paintReveal`.
- **Integrity gate** (`integrity.test.ts`) — every `RUNG_LADDER` id is a real T0
  zone at rung 1..7; `REVEAL` rungs strictly increasing 1..7 with fog geometry on
  every non-final stage.

**Golden-pin line:** `golden.test.ts` hashes ONLY the ground draw
(`paintT2Ground` → `paintValley`+`paintFurniture`). `paintReveal` +
`zonesAtRung` gating are shell-runtime, NOT hashed. Default T2 renders
`revealed=true`, no fog. → **rungs+fog is mechanics-only.** It crosses into
look/HR territory only if you edit `valley.ts`/`t2-ground.ts` geometry, or make
fog the DEFAULT render, or do the §6.2 `ruinRevealed` honesty re-label (a separate
taste beat — OUT of scope here).

## Build steps

1. **`nodes.ts`** — add `export const T2_RUNG_LADDER: Readonly<Record<string,number>>`
   (T2 zone-ids → rung, R1..R7). Seed from spec §6.1 story-order (estate/guest/
   gatehouse works R1; Asagiri + well + ferry + gorge early; market/mill R4;
   bandit-camp R5–R6; quarry/hill-shrines late). Placeholder numbers, revised by
   playtest (mirror the nodes.ts:25 comment). Export alongside `RUNG_LADDER`
   (smallest blast radius; T0 untouched).
2. **`reveal.ts`** — add `export const T2_REVEAL: readonly RevealStage[]` in VALLEY
   coords (frame `0,0,3200,4300`): early stages survey estate-north + south road;
   later open the village, then flanks/camp; final bare. **Generalize the painter:**
   `zonesAtRung(rung, ladder = RUNG_LADDER)`; `paintReveal(svg, art, seals, stage,
   frame, holes)` — replace `const fr = T0_WINDOW` with the passed `frame`, and
   pass T2 furniture holes computed from the frame (north-arrow ~(84,96),
   cartouche ~(frame.w−112,48), scale-bar ~(264,frame.h−54); or empty if T2 stages
   only use `blobs` that never overlap furniture). Filter uid already frame-scoped.
3. **`sheet.ts`** — broaden `if (tier === 'T0')` at :743 to also handle T2:
   per-tier `STAGES` (T2 e.g. `[null,1,4,5,7]`), `REVEAL` source, ladder; pass
   `frameFor(tier)` (the already-computed `FR`) + the tier's holes into
   `paintReveal`. The rest of the block is tier-agnostic once parameterized.
4. **`integrity.test.ts`** — mirror the T0 assertions for T2: every
   `T2_RUNG_LADDER` id ∈ `T2_NODES` at rung 1..7; `T2_REVEAL` strictly increasing
   1..7 with fog geometry on every non-final stage. Derive fixtures from live data
   (no copied ids).
5. **Verify** — `vitest run src/ui/map-sheets/` (integrity green; **golden pin MUST
   stay GREEN** — if RED you touched the drawn ground, back it out). Live-drive
   `?t2-map-demo`: click the rung pill through stages, confirm seals gate + fog
   paints/clears, no furniture fogged, no console errors (the PH6 reach check).
   Then `pnpm run verify`.

## The one soft edge — the rumor `notes`

The fog polygons are data (safe). The English rumor `notes` are fiction-voiced
text a player reads → strictly ADR-139 narrative-diverge territory. For a first
mechanics pass, keep notes minimal/placeholder and flag for a later prose diverge
(same posture T0's stages took), rather than treating this as a full narrative
deliverable.

## Audit caveat (map-sheets audit S1, appended 2026-07-09 — session 135)

`T2_RUNG_LADDER` is **DEV-preview-only**, exactly as T0's is (the audit's
S1): the live map derives visibility from core `ctx.revealed` and must
NEVER read the ladder table; the seeded numbers are never the canon
schedule. Note the sibling precedent landed this session: T0's
`RUNG_LADDER` is now **derived** from core `ranks.ts` `rewardOnReach.unlock`
`room-*` flags (single source, TST1) — when T2's real unlock schedule
exists in core, derive rather than transcribe, and say so in the table's
doc comment.
