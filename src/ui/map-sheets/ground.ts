// map-sheets/ground.ts — the scene composition: the ONE world (layout.ts) drawn
// through the primitive library, with tier DELTAS as parameters (spec §1/§2):
// T0 and T1 paint the identical geography; what differs is state — pools wet vs
// drained-and-red-struck, the breach open vs closed in fresh work, the forge cold
// vs lit, terrace numerals absent vs counting, the reviser's red layer. No zone
// content here (nodes.ts) and no chrome (sheet.ts): only place.

import type { Pt } from './geom';
import { bbox, pointInPoly } from './geom';
import { brushStroke, fineLayer, inkLine, inkText, rng, stipple, sv, tip, wash } from './brush';
import { bambooGrove, grassTufts, orchardRows, pine, reedBed, treeMass } from './flora';
import { furrows, ghostBunds, paddyBlock, sweptCourt, terraceRun } from './fields';
import {
  charcoalClamp,
  dryingRack,
  fallenRoof,
  forge,
  gatehouse,
  kura,
  leanTo,
  rubbleField,
  shed,
  stableRange,
  stoneMarker,
  wallRun,
  well,
  wingedHouse,
} from './built';
import { bridge, channel, fishWeir, flowTicks, pool, river, sluiceGate, weirBar } from './water';
import { groundWashBand, hachureBand, hillRange } from './terrain';
import {
  BOUNDARY_STONES,
  WASHES,
  FIELDS,
  GUEST,
  HILLS,
  LANTERN_THREAD,
  NOTES,
  PRECINCT,
  RIVER,
  ROADS,
  SURVEY_NOTES,
  WATER,
  WILDS,
  WORLD,
} from './layout';
import type { Tier } from './nodes';

/** A work-worn road: a warm tapered under-stroke + a fine dash overlay, one idiom
 *  for every route on the sheet (ghost roads pass ghost=true). */
function road(art: SVGElement, pts: readonly Pt[], seed: string, ghost = false): void {
  if (ghost) {
    inkLine(art, pts, {
      seed: `${seed}-g`,
      w: 1.6,
      color: 'var(--ink-faint)',
      dash: '3 11',
      opacity: 0.55,
      amp: 3,
    });
    return;
  }
  brushStroke(art, pts, {
    seed: `${seed}-u`,
    w: 8,
    color: 'var(--steel-2)',
    opacity: 1,
    taperIn: 0.04,
    taperOut: 0.04,
    amp: 2.5,
  });
  inkLine(art, pts, {
    seed: `${seed}-d`,
    w: 1.5,
    color: 'var(--ink-soft)',
    dash: '9 7',
    opacity: 0.9,
    amp: 2.5,
  });
}

/** The reviser's red — a small 朱 annotation (T1's re-survey voice; spec §2). */
function redNote(
  art: SVGElement,
  x: number,
  y: number,
  text: string,
  why: string,
  horizontal = false,
): void {
  const g = sv('g');
  inkText(g, x, y, text, { size: 16, color: 'var(--shu)', opacity: 1, vertical: !horizontal });
  tip(g, why);
  art.append(g);
}

/** Everything a tier changes about the ONE world, as one declarative record
 *  (G-4 from the session-115 review: the old `fresh` boolean branched at ~15
 *  sites and left T2 — whose whole job is revealing the ruin — an invasive
 *  rewrite; a T2 column here is now ADDITIVE). */
export interface TierDelta {
  /** the re-survey: this tier's new work reads fresh-ink/gold */
  readonly fresh: boolean;
  readonly poolsDrained: boolean;
  readonly worksSilted: boolean;
  readonly clampSmoking: boolean;
  readonly forgeLit: boolean;
  readonly terraceCount: number;
  readonly terraceNumbers: boolean;
  readonly orchardFeral: boolean;
  /** roads drawn as faint ghosts (not yet worked) this tier */
  readonly ghostRoads: { clamp: boolean; terrace: boolean; bon: boolean };
  /** T2's hook: the precinct honestly named + drawn as reclaimed ground.
   *  NO tier sets it yet — its drawing is T2 build work, but the seam exists. */
  readonly ruinRevealed: boolean;
}

export const TIER_DELTA: Readonly<Record<Tier, TierDelta>> = {
  T0: {
    fresh: false,
    poolsDrained: false,
    worksSilted: true,
    clampSmoking: false,
    forgeLit: false,
    terraceCount: 2,
    terraceNumbers: false,
    orchardFeral: true,
    ghostRoads: { clamp: true, terrace: true, bon: true },
    ruinRevealed: false,
  },
  T1: {
    fresh: true,
    poolsDrained: true,
    worksSilted: false,
    clampSmoking: true,
    forgeLit: true,
    terraceCount: 5,
    terraceNumbers: true,
    orchardFeral: false,
    ghostRoads: { clamp: false, terrace: false, bon: false },
    ruinRevealed: false,
  },
  // T2 is drawn by t2-ground.ts (the valley), NOT paintWorld — this record only
  // exists because TIER_DELTA is Record<Tier,…>. ruinRevealed: true is T2's
  // signature honesty flip (spec §6.2 — the ruin named as the main house).
  T2: {
    fresh: true,
    poolsDrained: true,
    worksSilted: false,
    clampSmoking: true,
    forgeLit: true,
    terraceCount: 5,
    terraceNumbers: true,
    orchardFeral: false,
    ghostRoads: { clamp: false, terrace: false, bon: false },
    ruinRevealed: true,
  },
};

/** Paint the whole world; returns seal-anchor refinements (room seals snap to the
 *  drawn house). The T0 sheet crops this via its viewBox window — nothing moves. */
export function paintWorld(art: SVGElement, tier: Tier): Map<string, Pt> {
  const overrides = new Map<string, Pt>();
  const d = TIER_DELTA[tier];
  const fresh = d.fresh;

  // ── 0 · substrate: the sheet plate + valley washes (spec L1) ──
  art.append(
    sv('rect', {
      x: '8',
      y: '8',
      width: String(WORLD.w - 16),
      height: String(WORLD.h - 16),
      fill: 'var(--steel-1)',
    }),
  );
  // the wash geography lives in layout.WASHES (one home — spec §0/§4)
  groundWashBand(art, [...WASHES.valley], {
    seed: 'wash-valley',
    tone: 'var(--steel-2)',
    opacity: 0.35,
  });
  groundWashBand(art, [...WASHES.hillSkirt], {
    seed: 'wash-skirt',
    tone: 'var(--steel-0)',
    opacity: 0.3,
  });
  groundWashBand(art, [...WASHES.riverMeadow], {
    seed: 'wash-meadow',
    tone: 'var(--steel-hi)',
    opacity: 0.14,
  });
  groundWashBand(art, [...WASHES.heart], {
    seed: 'wash-heart',
    tone: 'var(--steel-2)',
    opacity: 0.45,
  });
  // the life scatter — the V-1 void fix, earned by rendering (ADR-149): sparse
  // hand marks across the whole valley floor so empty ground reads as DRAWN
  // paper — grass ticks, a pebble, a bare-patch breath — never a stamped grid
  {
    const lr = rng('valley-life');
    const band = WASHES.lifeBand;
    for (let yy = 660; yy < 2020; yy += 115) {
      for (let xx = 90; xx < 3120; xx += 115) {
        const p: Pt = [xx + (lr() - 0.5) * 96, yy + (lr() - 0.5) * 96];
        if (lr() > 0.46 || !pointInPoly(p, band)) continue;
        const kind = lr();
        if (kind < 0.62) {
          // a small grass tick pair
          for (const lean of [-1, 1] as const) {
            inkLine(
              art,
              [
                [p[0], p[1]],
                [p[0] + lean * (1.6 + lr() * 1.6), p[1] - 2.8 - lr() * 2],
              ],
              {
                seed: `vl-${xx}-${yy}-${lean}`,
                w: 0.9,
                color: 'var(--ink-faint)',
                amp: 0.3,
                opacity: 0.95,
              },
            );
          }
        } else if (kind < 0.86) {
          // a pebble
          art.append(
            sv('circle', {
              cx: p[0].toFixed(1),
              cy: p[1].toFixed(1),
              r: (0.8 + lr() * 0.7).toFixed(2),
              fill: 'var(--ink-faint)',
              opacity: '0.7',
            }),
          );
        } else {
          // a bare-patch breath — a short horizontal scuff
          inkLine(
            art,
            [
              [p[0] - 3 - lr() * 3, p[1]],
              [p[0] + 3 + lr() * 3, p[1] + (lr() - 0.5) * 1.4],
            ],
            {
              seed: `vl-${xx}-${yy}-s`,
              w: 0.7,
              color: 'var(--ink-faint)',
              amp: 0.5,
              opacity: 0.55,
            },
          );
        }
      }
    }
  }

  // ── 1 · terrain: the north wall of the valley (G1) ──
  hillRange(art, HILLS.range1, { seed: 'hills-far', rows: 3 });
  hillRange(art, HILLS.range2, { seed: 'hills-near', rows: 2, scale: 0.7 });
  hillRange(art, HILLS.neRidge, { seed: 'hills-ne', rows: 1, scale: 0.5 });
  hillRange(art, HILLS.foothills, { seed: 'hills-foot', rows: 1, scale: 0.38 });
  hachureBand(art, HILLS.range2, { seed: 'hach-near', side: 1 });

  // ── 2 · the eastern forest (G8): mass, burn line, woodlot scatter ──
  treeMass(art, WILDS.forest, { seed: 'forest', density: 0.72, floor: true });
  // the too-straight firebreak edge — drawn as a clean cut in the mass
  inkLine(art, WILDS.burnLine, {
    seed: 'burnline',
    w: 1.4,
    color: 'var(--ink-faint)',
    opacity: 0.8,
    amp: 0.7, // deliberately UN-scrawled: the straightness is the wrong thing
  });
  {
    // the woodlot edge — scattered conifers thinning toward the precinct
    const r = alongScatter(WILDS.woodlotScatter, 26, 'woodlot-scatter');
    for (const [x, y, s] of r)
      pine(art, x, y, 7 + s * 5, { seed: `wl-${x.toFixed(0)}-${y.toFixed(0)}` });
    // char-darkened stumps (T0's undated marks)
    stipple(art, WILDS.woodlotScatter, {
      seed: 'stumps',
      step: 90,
      prob: 0.4,
      r: 1.8,
      color: 'var(--ink-soft)',
      opacity: 0.7,
    });
  }
  charcoalClamp(art, WILDS.clamp[0], WILDS.clamp[1], { seed: 'clamp', smoking: d.clampSmoking });

  // ── 3 · fields (G7): the worked fraction + the ghost of the old extent ──
  ghostBunds(art, FIELDS.ghostBunds, { seed: 'ghost-w' });
  ghostBunds(art, FIELDS.ghostBundsSouth, { seed: 'ghost-s' });
  for (let i = 0; i < FIELDS.homePaddies.length; i++) {
    paddyBlock(art, FIELDS.homePaddies[i]!, { seed: `paddy-${i}`, rowAngleDeg: -4 + i * 3 });
  }
  furrows(art, GUEST.vegRows, { seed: 'veg', angleDeg: 88 });
  for (const [x, y] of GUEST.dryingRacks) dryingRack(art, x, y, { seed: `rack-${x}` });
  // the margins: scrubby fringe + the sett-line running under the precinct wall
  grassTufts(art, FIELDS.margins, { seed: 'margins', density: 0.7 });
  inkLine(art, FIELDS.settLine, {
    seed: 'sett',
    w: 1,
    color: 'var(--ink-faint)',
    dash: '2 5',
    opacity: 0.7,
  });
  // the old-fields country between terraces and ghost bunds — a few life-marks so
  // the emptiness reads as LAND let go, not unpainted sheet
  grassTufts(
    art,
    [
      [850, 1150],
      [1080, 1130],
      [1100, 1300],
      [880, 1320],
    ],
    { seed: 'oldfields-1', density: 0.5 },
  );
  grassTufts(
    art,
    [
      [1150, 1320],
      [1360, 1300],
      [1380, 1470],
      [1180, 1490],
    ],
    { seed: 'oldfields-2', density: 0.4 },
  );
  pine(art, 1352, 1232, 9, { seed: 'lone-fieldpine' });
  // the NW terraces: T0 shows two worked strips + scrub above (no numbers yet —
  // reading them is T1's R1 round); T1 works all five and the stones COUNT (G7)
  terraceRun(art, FIELDS.terraces.baseline, {
    seed: 'terr',
    count: d.terraceCount,
    depth: FIELDS.terraces.depth,
    fresh, // the re-stacked walls are new work (gold) only on the re-survey
    ...(d.terraceNumbers ? { numberFrom: FIELDS.terraces.numberFrom } : {}),
  });
  terraceRun(art, FIELDS.letgo.baseline, {
    seed: 'letgo',
    count: FIELDS.letgo.count,
    depth: FIELDS.letgo.depth,
    letGo: true,
    ...(d.terraceNumbers ? { numberFrom: FIELDS.letgo.numberFrom } : {}),
  });

  // ── 4 · water (G2/G3): the river, the works, the one channel that matters ──
  river(art, RIVER.centerline, { seed: 'river', widthProfile: [...RIVER.widthProfile] });
  flowTicks(art, RIVER.centerline, { seed: 'flow', count: 7 });
  for (const p of WATER.pools)
    pool(art, p.x, p.y, p.r, { seed: `pool-${p.x}`, drained: d.poolsDrained });
  if (fresh) {
    // the re-survey strikes the drained pools in red
    inkLine(
      art,
      [
        [WATER.pools[0]!.x - 52, WATER.pools[0]!.y - 30],
        [WATER.pools[2]!.x + 20, WATER.pools[2]!.y + 14],
      ],
      { seed: 'pool-strike', w: 2.5, color: 'var(--shu)', opacity: 0.85 },
    );
    // seated just west of the pool group, off the water (FB drain: it floated)
    redNote(
      art,
      505,
      368,
      '改・涸',
      'The re-survey: the pools drained when the breach closed (R4)',
    );
    // the kanji alone read as DISASTER to fresh eyes (R14 inverted 0/3 —
    // "drying, ominous"); the reviser's gloss says what the red means
    inkText(art, 452, 300, 'pools drained —', { size: 12, color: 'var(--shu)', opacity: 0.95 });
    inkText(art, 452, 318, 'the breach closed', { size: 12, color: 'var(--shu)', opacity: 0.95 });
    inkText(art, 452, 336, 'ditches cut anew', { size: 12, color: 'var(--shu)', opacity: 0.95 });
  }
  // the old breach: open robbed gap in T0; closed in fresh stone in T1
  breachMark(art, tier);
  for (const ch of WATER.worksChannels) channel(art, ch, { seed: 'works', silted: d.worksSilted });
  sluiceGate(art, WATER.worksSluice.at, WATER.worksSluice.angleDeg, { seed: 'works-sluice' });
  weirBar(art, WATER.weir.at, WATER.weir.angleDeg, { seed: 'weir' });
  channel(art, WATER.mainChannel, { seed: 'main-ch' });
  for (let i = 0; i < WATER.paddyDitches.length; i++)
    channel(art, WATER.paddyDitches[i]!, { seed: `pd-${i}` });
  sluiceGate(art, WATER.channelSluice.at, WATER.channelSluice.angleDeg, { seed: 'ch-sluice' });
  channel(art, WATER.siltedBranch, { seed: 'silt-br', silted: d.worksSilted });
  bridge(art, WATER.bridge.at, WATER.bridge.angleDeg, { seed: 'bridge' });
  reedBed(art, WATER.reeds, { seed: 'reeds' });
  for (const fw of WATER.fishWeirs) fishWeir(art, fw.at, fw.angleDeg, { seed: `fw-${fw.at[0]}` });
  // the otters' den — dressed stone in a wild bank (a wrong thing, drawn small)
  {
    const g = fineLayer(art);
    for (const [dx, dy] of [
      [0, 0],
      [14, 6],
      [5, 14],
    ] as const) {
      g.append(
        sv('rect', {
          x: String(WATER.otterDen[0] + dx),
          y: String(WATER.otterDen[1] + dy),
          width: '13',
          height: '8',
          fill: 'none',
          stroke: 'var(--silver-dim)',
          'stroke-width': '1',
          opacity: '0.8',
        }),
      );
    }
    tip(g, 'The otters den in DRESSED stone — squared blocks, in a riverbank');
  }
  // Matsuzō's hut — his side of the water
  shed(art, WATER.matsuzoHut[0], WATER.matsuzoHut[1], { seed: 'matsuzo', scale: 0.8 });
  // the weir-jizō + the offerings nobody admits to
  stoneMarker(art, WATER.jizo[0], WATER.jizo[1], 'jizo', { seed: 'jizo' });

  // ── 5 · roads (G10) — they go somewhere ──
  road(art, ROADS.village, 'rd-village');
  road(art, ROADS.eastTrack, 'rd-east');
  road(art, ROADS.upstream, 'rd-up');
  road(art, ROADS.workPath, 'rd-work');
  road(art, ROADS.grovePath, 'rd-grove');
  road(art, ROADS.clampPath, 'rd-clamp', d.ghostRoads.clamp); // faint till the clamp turns
  road(art, ROADS.terracePath, 'rd-terr', d.ghostRoads.terrace);
  road(art, ROADS.bonPath, 'rd-bon', d.ghostRoads.bon);
  // the ghost approach — the dead road to the great gate, beside the living one
  road(art, PRECINCT.ghostApproach, 'rd-ghost', true);
  // exit + story notes, the surveyor's English hand (FB-181/183) — the 2026-07-09
  // ensemble pass: R7 failed because the exit notes were DEAD DATA (never
  // painted) and roads read as internal lanes; R5/R6/R8 failed because the
  // nesting/shrinkage/stable story lived only in inference and DEV tooltips.
  // Fit-visible on purpose — the misses happen at fit zoom, never in .ms-fine.
  for (const n of NOTES) {
    if (n.t1Only && tier === 'T0') continue;
    inkText(art, n.x, n.y, n.text, { size: 14, color: 'var(--ink-soft)', opacity: 0.92 });
  }
  for (const n of SURVEY_NOTES) {
    if (n.t1Only && tier === 'T0') continue;
    inkText(art, n.x, n.y, n.text, { size: 13, color: 'var(--ink-soft)', opacity: 0.85 });
  }

  // ── 6 · the old precinct — the RUIN (G4): footings, standing runs, fallen roofs ──
  // d.ruinRevealed is T2's seam: when a tier finally NAMES the precinct, its
  // reclaimed drawing branches HERE (that drawing is T2 build work — today every
  // tier keeps the ruin locked scenery, and this painter is the only touchpoint;
  // the golden pin guards against an accidental flip).
  void d.ruinRevealed;
  // a whisper of court-tone inside the ring: the dead precinct's ground reads as
  // GROUND, not as unpainted sheet
  wash(art, [...PRECINCT.wall], {
    seed: 'prec-ground',
    fill: 'var(--steel-2)',
    opacity: 0.33, // lifted from 0.26 — the enclosure must read as ONE old ground
    amp: 6, //         at fit zoom (R5: the nesting read inverted without it)
  });
  rubbleField(art, PRECINCT.rubble, { seed: 'rubble' });
  // OPEN ring on purpose: the missing stretch is the guest compound's neat wall —
  // the old circuit runs INTO the repaired corner (G5)
  wallRun(art, PRECINCT.wall, { seed: 'prec-wall', state: 'robbed' });
  for (const s of PRECINCT.standing)
    wallRun(art, s, { seed: `prec-stand-${s[0]![0]}`, state: 'standing' });
  gatehouse(art, PRECINCT.greatGate.at, PRECINCT.greatGate.angleDeg, {
    seed: 'great-gate',
    ruined: true,
    scale: 1.9,
  });
  // the great gate's collapse spills forward — the fallen lintel + rubble apron
  // that make the dead entrance READ at fit view
  fallenRoof(art, PRECINCT.greatGate.at[0] + 34, PRECINCT.greatGate.at[1] + 26, 62, 34, {
    seed: 'gate-lintel',
    angleDeg: 12,
  });
  rubbleField(
    art,
    [
      [1698, 1492],
      [1808, 1488],
      [1818, 1568],
      [1690, 1572],
    ],
    { seed: 'gate-rubble' },
  );
  for (const f of PRECINCT.fallenRoofs)
    fallenRoof(art, f.x, f.y, f.w, f.h, { seed: `fallen-${f.x}`, angleDeg: f.angleDeg });
  for (const b of PRECINCT.barracksRow)
    fallenRoof(art, b.x, b.y, b.w, b.h, { seed: `barr-${b.x}`, angleDeg: b.angleDeg });
  // the original temple-alcove — a small ruined shrine in the inner domain
  fallenRoof(art, PRECINCT.templeAlcove[0], PRECINCT.templeAlcove[1], 46, 30, {
    seed: 'temple-old',
    angleDeg: -6,
  });
  grassTufts(art, PRECINCT.innerGardenOld, { seed: 'old-garden', density: 1.7 });
  // the old garden's ornamental trees, gone wild among the tufts
  pine(art, 1592, 1128, 9, { seed: 'garden-pine-1' });
  pine(art, 1768, 1096, 8, { seed: 'garden-pine-2' });
  // the rope — posts + a sagging line: the household's refusal, drawn
  ropeLine(art);

  // ── 7 · the orchard & the grove (G8) ──
  orchardRows(art, WILDS.orchard.origin, {
    seed: 'orchard',
    cols: WILDS.orchard.cols,
    rows: WILDS.orchard.rows,
    spacing: WILDS.orchard.spacing,
    angleDeg: WILDS.orchard.angleDeg,
    feral: d.orchardFeral, // the re-survey reclaims the rows (the dog chain paid)
  });
  bambooGrove(art, WILDS.grove, { seed: 'grove' });

  // ── 8 · the guest house — the lived corner (G5/G6) ──
  sweptCourt(art, GUEST.forecourt, { seed: 'forecourt' });
  wallRun(art, [...GUEST.wall, GUEST.wall[0]!], { seed: 'guest-wall', state: 'neat' });
  gatehouse(art, GUEST.gate.at, GUEST.gate.angleDeg, { seed: 'guest-gate', scale: 1.25 });
  const house = wingedHouse(art, GUEST.house.at, {
    seed: 'house',
    scale: GUEST.house.scale,
    angleDeg: GUEST.house.angleDeg,
  });
  // the alcove corridor seal sits on the JOINING corridor (hall → east wing),
  // never the great roof — there it reads as "the house is a shrine" (blind-
  // reader finding)
  overrides.set('shrine', [(house.hall[0] + house.eastWing[0]) / 2, house.hall[1] - 8]);
  overrides.set('kitchen', house.kitchen);
  overrides.set('east-wing', house.eastWing);
  overrides.set('west-wing', house.westWing);
  overrides.set('shoin', house.shoin);
  overrides.set('inner-garden', [
    (house.eastWing[0] + house.westWing[0]) / 2,
    Math.min(house.eastWing[1], house.westWing[1]) - 14, // in the garden gap, clear of the shoin chip
  ]);
  // the WEST wing is CLOSED (both tiers — Katsuhide's things; the household keeps
  // it like an open one): the amado grille + a tied cross over the door — the
  // drawn refusal, legible at FIT zoom (blind pass 2 read the old faint veil as
  // nothing and called the wings simply "opened" — R13's closed half must land).
  // Shuttered-but-TENDED: the slats are neat and regular, no ghost-ruin.
  {
    const [wx, wy] = house.westWing;
    wash(
      art,
      [
        [wx - 36, wy - 42],
        [wx + 36, wy - 42],
        [wx + 36, wy + 42],
        [wx - 36, wy + 42],
      ],
      { seed: 'west-veil', fill: 'var(--steel-0)', opacity: 0.5, amp: 2 },
    );
    const slats = rng('west-slats');
    for (let y = wy - 34; y <= wy + 34; y += 7.5) {
      const j = (slats() - 0.5) * 1.6;
      inkLine(
        art,
        [
          [wx - 29, y + j],
          [wx + 29, y + j],
        ],
        {
          seed: `shutter-${y.toFixed(0)}`,
          w: 1.2,
          color: 'var(--ink-soft)',
          opacity: 0.75,
          amp: 0.5,
        },
      );
    }
    // the tied cross over the south door — sealed, deliberately
    inkLine(
      art,
      [
        [wx - 13, wy + 26],
        [wx + 13, wy + 42],
      ],
      { seed: 'west-tie-a', w: 1.8, color: 'var(--silver-dim)', opacity: 0.9, amp: 0.6 },
    );
    inkLine(
      art,
      [
        [wx + 13, wy + 26],
        [wx - 13, wy + 42],
      ],
      { seed: 'west-tie-b', w: 1.8, color: 'var(--silver-dim)', opacity: 0.9, amp: 0.6 },
    );
  }
  if (fresh) {
    // the tier's build spine: the east wing + shoin read as NEW WOOD (a light
    // fresh-timber veil) and the reviser's red names the work
    const [ex, ey] = house.eastWing;
    wash(
      art,
      [
        [ex - 36, ey - 42],
        [ex + 36, ey - 42],
        [ex + 36, ey + 42],
        [ex - 36, ey + 42],
      ],
      { seed: 'east-fresh', fill: 'var(--steel-hi)', opacity: 0.16, amp: 2 },
    );
    // sits above the wing, clear of the Workshops caption cluster (L9)
    redNote(art, ex - 6, ey - 66, '改・東棟成', 'The east wing, rebuilt (R4–R6)', true);
    // ADR-151 hybrid: ONE fresh repair reaches INTO the dead precinct — the
    // wall stretch north of the lived corner re-stacked in new work. The ruin
    // itself stays untouched (its reveal is T2); this is the household's first
    // hand laid on the old ground, a promise the sheet keeps quiet about.
    wallRun(
      art,
      [
        [1899, 1032],
        [1897, 962],
      ],
      { seed: 'precinct-mend', state: 'neat' },
    );
    redNote(art, 1868, 964, '改・繕', 'The old wall, mended a few ken past the rope — why?');
    redNote(
      art,
      house.shoin[0] - 44,
      house.shoin[1] - 6,
      '改',
      'The shoin — the first room of the main house brought back, board by board (R7)',
    );
  }
  kura(art, GUEST.kura[0], GUEST.kura[1], { seed: 'kura' });
  shed(art, GUEST.woodshed[0], GUEST.woodshed[1], { seed: 'woodshed', scale: 0.9 });
  leanTo(art, GUEST.sickroom[0], GUEST.sickroom[1], { seed: 'sickroom', angleDeg: 90 });
  stableRange(art, GUEST.stable.at, {
    seed: 'stable',
    stalls: GUEST.stable.stalls,
    angleDeg: GUEST.stable.angleDeg,
  });
  shed(art, GUEST.workshops[0], GUEST.workshops[1], { seed: 'workshop', scale: 1 });
  forge(art, GUEST.workshops[0] - 26, GUEST.workshops[1] + 18, { seed: 'forge', lit: d.forgeLit });
  well(art, GUEST.well[0], GUEST.well[1], { seed: 'well' });

  // ── 9 · the family plot (drawn both tiers; sealed in T1) + the bounds (G9) ──
  gravePlotMark(art, tier);
  for (const s of BOUNDARY_STONES) {
    if (s.t1Only && tier === 'T0') continue;
    // scaled up so the bounds are FINDABLE at fit view (rubric R6)
    const sg = sv('g', {
      transform: `translate(${s.x} ${s.y}) scale(1.5) translate(${-s.x} ${-s.y})`,
    });
    art.append(sg);
    stoneMarker(sg, s.x, s.y, 'boundary', { seed: `bstone-${s.x}` });
    if (s.newer && tier === 'T1') {
      const g = fineLayer(art);
      inkText(g, s.x + 16, s.y - 10, '新?', { size: 11, color: 'var(--shu)', opacity: 0.8 });
      tip(g, 'This stone is NEWER than its brothers — and stands a field short of the old line');
    }
  }

  // ── 10 · the mysteries the legend never explains (G11/G12) ──
  inkLine(art, LANTERN_THREAD, {
    seed: 'lantern',
    w: 1,
    color: 'var(--shu)',
    dash: '1.5 10',
    opacity: 0.4,
  });

  return overrides;
}

/** The old breach — T0: a robbed gap (the stones WALKED); T1: closed, fresh work. */
function breachMark(art: SVGElement, tier: Tier): void {
  const [bx, by] = WATER.breach.at;
  const g = sv('g');
  if (tier === 'T1') {
    brushStroke(
      g,
      [
        [bx - 20, by - 14],
        [bx + 22, by + 12],
      ],
      { seed: 'breach-fix', w: 6, color: 'var(--gold-dim)', opacity: 0.85 },
    );
    redNote(art, bx + 46, by + 6, '改・塞', 'The breach, CLOSED at R4 — the pools drained with it');
    // English gloss beside the kanji stamp (R14 — the repair must READ as repair)
    inkText(art, bx + 66, by - 2, 'breach closed — new stone', {
      size: 12,
      color: 'var(--shu)',
      opacity: 0.95,
    });
    tip(g, 'The old breach — closed in fresh stone (R4); the robbed hollows still read beside it');
  } else {
    tip(
      g,
      'The old breach — dressed stone does not wash away; it walks. The flood came through a hole people made',
    );
  }
  // the robbed hollows — where the dressed stones were taken (both tiers)
  for (const [dx, dy, rot] of [
    [-6, -18, -16],
    [38, 4, 22],
    [12, 26, -6],
  ] as const) {
    g.append(
      sv('rect', {
        x: String(bx + dx),
        y: String(by + dy),
        width: '16',
        height: '9',
        fill: 'none',
        stroke: 'var(--ink-faint)',
        'stroke-width': '1.1',
        opacity: '0.7',
        transform: `rotate(${rot} ${bx + dx} ${by + dy})`,
      }),
    );
  }
  art.append(g);
}

/** The rope walling the lived corner off from the dead precinct — posts + sag. */
function ropeLine(art: SVGElement): void {
  const g = sv('g');
  const pts = PRECINCT.rope;
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i]!;
    const [bx, by] = pts[i + 1]!;
    const segs = Math.max(1, Math.round(Math.hypot(bx - ax, by - ay) / 90));
    for (let s = 0; s < segs; s++) {
      const t0 = s / segs;
      const t1 = (s + 1) / segs;
      const p0: Pt = [ax + (bx - ax) * t0, ay + (by - ay) * t0];
      const p1: Pt = [ax + (bx - ax) * t1, ay + (by - ay) * t1];
      const mid: Pt = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 + 7]; // the sag
      inkLine(g, [p0, mid, p1], {
        seed: `rope-${i}-${s}`,
        w: 1.35,
        color: 'var(--ink-soft)',
        opacity: 1,
        amp: 1,
      });
      // the post at each span's start
      inkLine(
        g,
        [
          [p0[0], p0[1] + 3],
          [p0[0], p0[1] - 10],
        ],
        {
          seed: `rpost-${i}-${s}`,
          w: 2,
          color: 'var(--ink-soft)',
          opacity: 1,
          amp: 0.6,
        },
      );
    }
  }
  tip(g, 'The rope and the warning — the ruin is not entered, and not discussed');
  art.append(g);
}

/** The family plot: a small walled grave terrace; ONE plot swept and stoneless.
 *  T0: a quiet old fence (silver ink). T1: NEWLY gold-fenced — so the 新 badge
 *  reads as "newly fenced," never "the graveyard moved" (blind-reader finding). */
function gravePlotMark(art: SVGElement, tier: Tier): void {
  const { at, w, h } = WILDS.gravePlot;
  const [cx, cy] = at;
  const g = sv('g');
  const ring: Pt[] = [
    [cx - w / 2, cy - h / 2],
    [cx + w / 2, cy - h / 2],
    [cx + w / 2, cy + h / 2],
    [cx - w / 2, cy + h / 2],
    [cx - w / 2, cy - h / 2],
  ];
  if (tier === 'T1') {
    wallRun(g, ring, { seed: 'grave-wall', state: 'neat' });
  } else {
    inkLine(g, ring, {
      seed: 'grave-fence-old',
      w: 1.2,
      color: 'var(--silver-dim)',
      opacity: 0.8,
      amp: 1.5,
    });
  }
  let i = 0;
  for (const [dx, dy] of [
    [-28, -10],
    [-9, -12],
    [10, -10],
    [29, -12],
    [-28, 12],
    [-9, 14],
    [29, 13],
  ] as const) {
    stoneMarker(g, cx + dx, cy + dy, 'grave', { seed: `grave-${i++}` });
  }
  // the swept, weeded, STONELESS plot — the register's unstruck line, in earth
  stoneMarker(g, cx + 10, cy + 13, 'graveEmpty', { seed: 'grave-empty' });
  tip(g, 'The family plot — and one plot swept and weeded with NO stone in it');
  art.append(g);
}

/** Deterministic scatter points inside a polygon (x, y, size 0..1). */
function alongScatter(
  poly: readonly Pt[],
  count: number,
  seed: string,
): [number, number, number][] {
  // jittered rejection sampling on the polygon's bbox — seeded, so stable
  const pts: [number, number, number][] = [];
  const r = rng(seed);
  const { x0, y0, x1, y1 } = bbox(poly);
  let guard = 0;
  while (pts.length < count && guard++ < count * 12) {
    const x = x0 + r() * (x1 - x0);
    const y = y0 + r() * (y1 - y0);
    if (pointInPoly([x, y], poly)) pts.push([x, y, r()]);
  }
  return pts;
}
