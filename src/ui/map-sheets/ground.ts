// map-sheets/ground.ts — the scene composition: the ONE world (layout.ts) drawn
// through the primitive library, with tier DELTAS as parameters (spec §1/§2):
// T0 and T1 paint the identical geography; what differs is state — pools wet vs
// drained-and-red-struck, the breach open vs closed in fresh work, the forge cold
// vs lit, terrace numerals absent vs counting, the reviser's red layer. No zone
// content here (nodes.ts) and no chrome (sheet.ts): only place.

import type { Pt } from './brush';
import {
  bbox,
  brushStroke,
  fineLayer,
  inkLine,
  inkText,
  pointInPoly,
  rng,
  stipple,
  sv,
  tip,
  wash,
} from './brush';
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
  FIELDS,
  GUEST,
  HILLS,
  LANTERN_THREAD,
  PRECINCT,
  RIVER,
  ROADS,
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

/** Paint the whole world; returns seal-anchor refinements (room seals snap to the
 *  drawn house). The T0 sheet crops this via its viewBox window — nothing moves. */
export function paintWorld(art: SVGElement, tier: Tier): Map<string, Pt> {
  const overrides = new Map<string, Pt>();
  const fresh = tier === 'T1'; // the re-survey: the tier's new work reads fresh

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
  // the valley floor — a broad quiet band below the hills
  groundWashBand(
    art,
    [
      [30, 560],
      [1200, 480],
      [2400, 500],
      [3170, 560],
      [3170, 2070],
      [30, 2070],
    ],
    { seed: 'wash-valley', tone: 'var(--steel-2)', opacity: 0.35 },
  );
  // the worked heart — a lighter breath around compound + fields
  groundWashBand(
    art,
    [
      [1300, 1450],
      [2400, 1420],
      [2450, 1900],
      [1350, 1950],
    ],
    { seed: 'wash-heart', tone: 'var(--steel-2)', opacity: 0.45 },
  );

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
    for (const [x, y, s] of r) pine(art, x, y, 7 + s * 5, `wl-${x.toFixed(0)}-${y.toFixed(0)}`);
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
  charcoalClamp(art, WILDS.clamp[0], WILDS.clamp[1], { seed: 'clamp', smoking: fresh });

  // ── 3 · fields (G7): the worked fraction + the ghost of the old extent ──
  ghostBunds(art, FIELDS.ghostBunds, { seed: 'ghost-w' });
  ghostBunds(art, FIELDS.ghostBundsSouth, { seed: 'ghost-s' });
  for (let i = 0; i < FIELDS.homePaddies.length; i++) {
    paddyBlock(art, FIELDS.homePaddies[i]!, { seed: `paddy-${i}`, rowAngleDeg: -4 + i * 3 });
  }
  furrows(art, GUEST.vegRows, { seed: 'veg', angleDeg: 88 });
  for (const [x, y] of GUEST.dryingRacks) dryingRack(art, x, y, `rack-${x}`);
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
  pine(art, 1352, 1232, 9, 'lone-fieldpine');
  // the NW terraces: T0 shows two worked strips + scrub above (no numbers yet —
  // reading them is T1's R1 round); T1 works all five and the stones COUNT (G7)
  terraceRun(art, FIELDS.terraces.baseline, {
    seed: 'terr',
    count: tier === 'T1' ? FIELDS.terraces.count : 2,
    depth: FIELDS.terraces.depth,
    ...(tier === 'T1' ? { numberFrom: FIELDS.terraces.numberFrom } : {}),
  });
  terraceRun(art, FIELDS.letgo.baseline, {
    seed: 'letgo',
    count: FIELDS.letgo.count,
    depth: FIELDS.letgo.depth,
    letGo: true,
    ...(tier === 'T1' ? { numberFrom: FIELDS.letgo.numberFrom } : {}),
  });

  // ── 4 · water (G2/G3): the river, the works, the one channel that matters ──
  river(art, RIVER.centerline, { seed: 'river', widthProfile: [...RIVER.widthProfile] });
  flowTicks(art, RIVER.centerline, { seed: 'flow', count: 7 });
  for (const p of WATER.pools) pool(art, p.x, p.y, p.r, { seed: `pool-${p.x}`, drained: fresh });
  if (fresh) {
    // the re-survey strikes the drained pools in red
    inkLine(
      art,
      [
        [WATER.pools[0]!.x - 60, WATER.pools[0]!.y - 30],
        [WATER.pools[2]!.x + 55, WATER.pools[2]!.y + 28],
      ],
      { seed: 'pool-strike', w: 2.5, color: 'var(--shu)', opacity: 0.85 },
    );
    redNote(
      art,
      736,
      372,
      '改・涸',
      'The re-survey: the pools drained when the breach closed (R4)',
    );
  }
  // the old breach: open robbed gap in T0; closed in fresh stone in T1
  breachMark(art, tier);
  for (const ch of WATER.worksChannels) channel(art, ch, { seed: 'works', silted: !fresh });
  sluiceGate(art, WATER.worksSluice.at, WATER.worksSluice.angleDeg, 'works-sluice');
  weirBar(art, WATER.weir.at, WATER.weir.angleDeg, { seed: 'weir' });
  channel(art, WATER.mainChannel, { seed: 'main-ch' });
  for (let i = 0; i < WATER.paddyDitches.length; i++)
    channel(art, WATER.paddyDitches[i]!, { seed: `pd-${i}` });
  sluiceGate(art, WATER.channelSluice.at, WATER.channelSluice.angleDeg, 'ch-sluice');
  channel(art, WATER.siltedBranch, { seed: 'silt-br', silted: !fresh });
  bridge(art, WATER.bridge.at, WATER.bridge.angleDeg, { seed: 'bridge' });
  reedBed(art, WATER.reeds, { seed: 'reeds' });
  for (const fw of WATER.fishWeirs) fishWeir(art, fw.at, fw.angleDeg, `fw-${fw.at[0]}`);
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
  stoneMarker(art, WATER.jizo[0], WATER.jizo[1], 'jizo', 'jizo');

  // ── 5 · roads (G10) — they go somewhere ──
  road(art, ROADS.village, 'rd-village');
  road(art, ROADS.eastTrack, 'rd-east');
  road(art, ROADS.upstream, 'rd-up');
  road(art, ROADS.workPath, 'rd-work');
  road(art, ROADS.grovePath, 'rd-grove');
  road(art, ROADS.clampPath, 'rd-clamp', !fresh); // faint till the clamp turns (T1 R2)
  road(art, ROADS.terracePath, 'rd-terr', tier === 'T0');
  road(art, ROADS.bonPath, 'rd-bon', tier === 'T0');
  // the ghost approach — the dead road to the great gate, beside the living one
  road(art, PRECINCT.ghostApproach, 'rd-ghost', true);

  // ── 6 · the old precinct — the RUIN (G4): footings, standing runs, fallen roofs ──
  // a whisper of court-tone inside the ring: the dead precinct's ground reads as
  // GROUND, not as unpainted sheet
  wash(art, [...PRECINCT.wall], {
    seed: 'prec-ground',
    fill: 'var(--steel-2)',
    opacity: 0.26,
    amp: 6,
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
  pine(art, 1592, 1128, 9, 'garden-pine-1');
  pine(art, 1768, 1096, 8, 'garden-pine-2');
  // the rope — posts + a sagging line: the household's refusal, drawn
  ropeLine(art);

  // ── 7 · the orchard & the grove (G8) ──
  orchardRows(art, WILDS.orchard.origin, {
    seed: 'orchard',
    cols: WILDS.orchard.cols,
    rows: WILDS.orchard.rows,
    spacing: WILDS.orchard.spacing,
    angleDeg: WILDS.orchard.angleDeg,
    feral: tier === 'T0', // T1 reclaims the rows (the dog chain paid)
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
    Math.min(house.eastWing[1], house.westWing[1]) - 52,
  ]);
  // the WEST wing is CLOSED (both tiers — Katsuhide's things; the household keeps
  // it like an open one): a dimming veil + shutter ticks, the drawn refusal
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
      { seed: 'west-veil', fill: 'var(--steel-0)', opacity: 0.42, amp: 2 },
    );
    for (let i = 0; i < 3; i++) {
      inkLine(
        art,
        [
          [wx - 20 + i * 20, wy - 30],
          [wx - 20 + i * 20, wy + 30],
        ],
        { seed: `shutter-${i}`, w: 1.1, color: 'var(--ink-faint)', opacity: 0.8, amp: 0.8 },
      );
    }
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
    redNote(art, ex + 2, ey + 86, '改・東棟成', 'The east wing, rebuilt (R4–R6)', true);
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
  forge(art, GUEST.workshops[0] - 26, GUEST.workshops[1] + 18, { seed: 'forge', lit: fresh });
  well(art, GUEST.well[0], GUEST.well[1], 'well');

  // ── 9 · the family plot (drawn both tiers; sealed in T1) + the bounds (G9) ──
  gravePlotMark(art, tier);
  for (const s of BOUNDARY_STONES) {
    if (s.t1Only && tier === 'T0') continue;
    // scaled up so the bounds are FINDABLE at fit view (rubric R6)
    const sg = sv('g', {
      transform: `translate(${s.x} ${s.y}) scale(1.5) translate(${-s.x} ${-s.y})`,
    });
    art.append(sg);
    stoneMarker(sg, s.x, s.y, 'boundary', `bstone-${s.x}`);
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
    stoneMarker(g, cx + dx, cy + dy, 'grave', `grave-${i++}`);
  }
  // the swept, weeded, STONELESS plot — the register's unstruck line, in earth
  stoneMarker(g, cx + 10, cy + 13, 'graveEmpty', 'grave-empty');
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
