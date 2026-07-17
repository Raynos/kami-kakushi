// map-sheets/layout.ts — THE ONE GEOGRAPHY (spec §0). Every landmark of the estate
// world in a single shared coordinate system: the T1 sheet renders the full WORLD;
// the T0 sheet renders T0_WINDOW — a crop of the same world, so T1 is T0 *revealed*,
// never rearranged. Pure data: no DOM, no drawing — the sheet compositions marry
// these coordinates to the primitive library.
//
// The spatial story this data must tell (spec G1–G12):
//   hills north · river west flowing N→S · the great RUINED precinct centre-north ·
//   the lived-in guest house tucked into its SE CORNER (the twist, in geography) ·
//   paddies between house and river · everything worked is a fraction of the old
//   traces · roads that go somewhere.

import type { Pt } from './geom';
import { VALLEY_ANCHORS } from './valley';

export const WORLD = { w: 3200, h: 2100 } as const;

/** The T0 crop — same world units (3:2, matches the sheet aspect). Pulled west +
 *  north far enough that the river corridor and the foothills read on the T0
 *  sheet too (rubric R2/R3). */
export const T0_WINDOW = { x: 430, y: 330, w: 2220, h: 1480 } as const;

// ── zone seal anchors (ids = nodes.ts; room:true = an interior/room-scale seal —
//    drawn smaller, caption zoom-gated so the house never drowns in chips) ────────
export interface Anchor {
  readonly x: number;
  readonly y: number;
  readonly room?: boolean;
}

export const ANCHORS: Readonly<Record<string, Anchor>> = {
  // T0 — the guest house & skirts
  weir: { x: 585, y: 1105 },
  'weir-reeds': { x: 610, y: 1372 },
  gate: { x: 2140, y: 1568 },
  forecourt: { x: 2145, y: 1398 },
  woodshed: { x: 1978, y: 1458 },
  kitchen: { x: 2028, y: 1288, room: true },
  shrine: { x: 2130, y: 1178, room: true },
  kura: { x: 2310, y: 1030 },
  sickroom: { x: 1950, y: 1332, room: true },
  'drill-yard': { x: 2272, y: 1346 },
  paddies: { x: 1670, y: 1668 },
  'field-margins': { x: 1424, y: 1652 },
  woodlot: { x: 2565, y: 1145 },
  ruined: { x: 1650, y: 820 },
  orchard: { x: 1905, y: 1005 },
  grove: { x: 2095, y: 425 },
  'night-rounds': { x: 2242, y: 1560 },
  // T1 — the land at true extent + the wings
  'terraced-paddies': { x: 965, y: 905 },
  'woodlot-clamp': { x: 2870, y: 590 },
  'flood-works': { x: 610, y: 760 },
  'kura-interior': { x: 2310, y: 1124, room: true },
  workshops: { x: 2318, y: 1250, room: true },
  'boundary-fields': { x: 1730, y: 1965 },
  'family-plot': { x: 2378, y: 492 },
  'upstream-pools': { x: 665, y: 330 },
  'letgo-terraces': { x: 990, y: 606 },
  'downstream-shallows': { x: 445, y: 1852 },
  'east-wing': { x: 2258, y: 1172, room: true },
  'west-wing': { x: 2002, y: 1172, room: true },
  'inner-garden': { x: 2130, y: 1085, room: true },
  shoin: { x: 2058, y: 1098, room: true },
  // T2 — the valley (spec §6; positions live in valley.ts beside their geometry)
  ...VALLEY_ANCHORS,
};

// ── ground washes (L1 substrate) — one home for the wash geography ──────────
export const WASHES = {
  /** the valley floor — a broad quiet band below the hills */
  valley: [
    [30, 560],
    [1200, 480],
    [2400, 500],
    [3170, 560],
    [3170, 2070],
    [30, 2070],
  ] as readonly Pt[],
  /** the worked heart — a lighter breath around compound + fields */
  heart: [
    [1300, 1450],
    [2400, 1420],
    [2450, 1900],
    [1350, 1950],
  ] as readonly Pt[],
  /** the river meadow — a damp strip along the east bank, one tone apart */
  riverMeadow: [
    [560, 620],
    [760, 700],
    [700, 1300],
    [640, 1900],
    [470, 1900],
    [540, 1250],
  ] as readonly Pt[],
  /** the hill skirt — colluvium under the foothills, a shade deeper (stops at
   *  the forest's west edge — it must never stripe THROUGH the tree mass) */
  hillSkirt: [
    [30, 640],
    [1250, 545],
    [2380, 585],
    [2560, 640],
    [2540, 700],
    [2360, 660],
    [1250, 650],
    [30, 750],
  ] as readonly Pt[],
  /** where the sparse life-scatter lives (the whole worked valley floor) */
  lifeBand: [
    [60, 620],
    [3140, 640],
    [3140, 2040],
    [60, 2040],
  ] as readonly Pt[],
} as const;

// ── terrain ──────────────────────────────────────────────────────────────────
export const HILLS = {
  /** the far range — the valley's north wall */
  range1: [
    [100, 240],
    [700, 140],
    [1400, 100],
    [2200, 120],
    [3100, 200],
  ] as readonly Pt[],
  /** the nearer, lower tier */
  range2: [
    [1150, 310],
    [1850, 265],
    [2560, 305],
  ] as readonly Pt[],
  /** the low NE shoulder above the family plot & forest */
  neRidge: [
    [2300, 420],
    [2700, 380],
    [3050, 430],
  ] as readonly Pt[],
  /** the near foothill skirt — low enough that the T0 window catches real hills */
  foothills: [
    [600, 470],
    [1250, 418],
    [1950, 432],
    [2520, 468],
  ] as readonly Pt[],
} as const;

// ── the river (flows N→S — G2) + water works (G3) ───────────────────────────
export const RIVER = {
  centerline: [
    [760, 90],
    [640, 300],
    [560, 520],
    [500, 760],
    [480, 1000],
    [520, 1220],
    [500, 1420],
    [450, 1650],
    [410, 1880],
    [400, 2060],
  ] as readonly Pt[],
  /** narrow in the hills, widening downstream */
  widthProfile: [
    { t: 0, w: 22 },
    { t: 0.35, w: 30 },
    { t: 0.7, w: 38 },
    { t: 1, w: 44 },
  ],
} as const;

export const WATER = {
  /** T1: the silted pools behind the breach — drained after R4 (drawn drained + red-struck) */
  pools: [
    { x: 592, y: 308, r: 38 },
    { x: 566, y: 370, r: 30 },
    { x: 592, y: 436, r: 24 },
  ],
  /** the old breach in the bank — the stones were TAKEN; T1 shows it CLOSED in fresh work */
  breach: { at: [566, 528] as Pt, angleDeg: 68 },
  /** T1 flood-works: intake channels running east toward the terraces */
  worksChannels: [
    [
      [520, 780],
      [660, 810],
      [800, 855],
      [880, 890],
    ],
    [
      [512, 730],
      [640, 752],
      [780, 782],
    ],
  ] as readonly (readonly Pt[])[],
  worksSluice: { at: [516, 756] as Pt, angleDeg: 75 },
  /** the T0 weir — the estate's water right, leased from Matsuzō */
  weir: { at: [502, 1192] as Pt, angleDeg: 8 },
  /** the weir-jizō on the near bank — offerings nobody admits to (unexplained) */
  jizo: [560, 1152] as Pt,
  bridge: { at: [488, 1242] as Pt, angleDeg: 8 },
  /** Matsuzō's hut — HIS side of the water (west bank) */
  matsuzoHut: [436, 1276] as Pt,
  /** the main irrigation channel: weir → home paddies (the one stroke that matters) */
  mainChannel: [
    [524, 1196],
    [700, 1258],
    [950, 1330],
    [1200, 1425],
    [1420, 1520],
    [1520, 1580],
    [1572, 1604],
  ] as readonly Pt[],
  /** feeder ditches — the channel visibly JOINS the paddy grid (both blind
   *  readers watched it dissolve short of the fields) */
  paddyDitches: [
    [
      [1520, 1582],
      [1502, 1690],
    ],
    [
      [1570, 1602],
      [1706, 1582],
    ],
  ] as readonly (readonly Pt[])[],
  channelSluice: { at: [1425, 1524] as Pt, angleDeg: 40 },
  /** the silted branch — the hidden sluice the field-work keeps hinting at (T0);
   *  repaired + extended in T1 (fresh ink) */
  siltedBranch: [
    [960, 1336],
    [1060, 1420],
    [1140, 1500],
    [1220, 1560],
  ] as readonly Pt[],
  /** the weir reeds — slack water just downstream of the weir, east bank */
  reeds: [
    [522, 1268],
    [612, 1298],
    [640, 1400],
    [560, 1442],
    [508, 1330],
  ] as readonly Pt[],
  /** T1 downstream shallows — Matsuzō's stretch: fish weirs + the otters' den in
   *  DRESSED STONE (squared blocks in a wild bank — a wrong thing) */
  fishWeirs: [
    { at: [432, 1800] as Pt, angleDeg: 5 },
    { at: [446, 1902] as Pt, angleDeg: 12 },
  ],
  otterDen: [472, 1858] as Pt,
} as const;

// ── the old precinct — the RUIN (G4) ─────────────────────────────────────────
export const PRECINCT = {
  /** the great ring, mostly robbed to footings (the village quarried the stones).
   *  OPEN polyline on purpose: the stretch the guest compound sits on is the
   *  guest house's own NEAT wall — the old circuit visibly continues into the
   *  repaired corner (G5, the twist in geography). Runs guest-SW → W → N → E →
   *  guest-NE. */
  wall: [
    [1893, 1524],
    [1780, 1530],
    [1350, 1500],
    [1170, 1080],
    [1150, 565],
    [1750, 515],
    [2340, 555],
    [2360, 1046],
  ] as readonly Pt[],
  /** stretches still standing (heavy broken brush, not footings) */
  standing: [
    [
      [1400, 540],
      [1750, 515],
      [1980, 530],
    ],
    [
      [2350, 700],
      [2360, 1040],
    ],
  ] as readonly (readonly Pt[])[],
  /** the crumbled GREAT gate — the old seat's face, south wall */
  greatGate: { at: [1750, 1522] as Pt, angleDeg: 0 },
  /** the ghost approach — the old road to the great gate, grass-grown, parallel
   *  to the living road (two roads south: one alive, one dead) */
  ghostApproach: [
    [1750, 1535],
    [1768, 1735],
    [1798, 1950],
  ] as readonly Pt[],
  /** the fallen main-house group (the jin'ya core) — sized to DOMINATE: the ruin
   *  is the biggest built thing on the sheet, or the twist reads backwards */
  fallenRoofs: [
    { x: 1700, y: 775, w: 244, h: 138, angleDeg: -4 },
    { x: 1490, y: 900, w: 162, h: 100, angleDeg: 7 },
    { x: 1905, y: 908, w: 178, h: 104, angleDeg: -9 },
    { x: 1632, y: 648, w: 132, h: 76, angleDeg: -11 },
    { x: 1800, y: 1015, w: 112, h: 66, angleDeg: 6 },
    { x: 1545, y: 742, w: 118, h: 70, angleDeg: -2 },
  ],
  /** the old barracks row along the west wall */
  barracksRow: [
    { x: 1275, y: 740, w: 102, h: 54, angleDeg: 84 },
    { x: 1300, y: 880, w: 102, h: 54, angleDeg: 86 },
    { x: 1325, y: 1020, w: 102, h: 54, angleDeg: 88 },
  ],
  /** the ORIGINAL family temple-alcove (the guest-house alcove is its echo) */
  templeAlcove: [2020, 720] as Pt,
  /** rubble ground around the core */
  rubble: [
    [1440, 640],
    [1990, 600],
    [2000, 952],
    [1480, 1030],
  ] as readonly Pt[],
  /** the old inner garden — overgrown (grass + feral tangle, no water) */
  innerGardenOld: [
    [1540, 1060],
    [1820, 1050],
    [1840, 1200],
    [1560, 1215],
  ] as readonly Pt[],
  /** the ROPE — the household's refusal, drawn: posts + a sagging line walling the
   *  lived corner off from the dead precinct (N + W of the guest compound) */
  rope: [
    [1898, 1495],
    [1898, 1062],
    [1922, 1035],
    [2340, 1046],
  ] as readonly Pt[],
} as const;

// ── the guest house — the lived-in SE corner (G5/G6) ─────────────────────────
export const GUEST = {
  /** the neat wall — visibly a REPAIRED stretch of the precinct's own SE corner */
  wall: [
    [1900, 1040],
    [2360, 1040],
    [2360, 1520],
    [1900, 1520],
  ] as readonly Pt[],
  gate: { at: [2140, 1520] as Pt, angleDeg: 0 },
  /** the winged residence (anchors refined by the drawing at composition) */
  house: { at: [2130, 1215] as Pt, scale: 1.22, angleDeg: 0 },
  kura: [2310, 1118] as Pt,
  woodshed: [1978, 1442] as Pt,
  sickroom: [1962, 1338] as Pt,
  /** the old stable court = the drill yard: stalls for twenty, one mule (G6) */
  stable: { at: [2312, 1330] as Pt, stalls: 10, angleDeg: 90 },
  workshops: [2308, 1242] as Pt,
  /** the forecourt — swept ground sized for a household five times this one */
  forecourt: [
    [2000, 1330],
    [2242, 1330],
    [2242, 1480],
    [2000, 1480],
  ] as readonly Pt[],
  well: [2105, 1362] as Pt,
  vegRows: [
    [1856, 1540],
    [2010, 1540],
    [2010, 1626],
    [1856, 1626],
  ] as readonly Pt[],
  dryingRacks: [
    [1885, 1598],
    [1922, 1602],
  ] as readonly Pt[],
} as const;

// ── fields (G7) ──────────────────────────────────────────────────────────────
export const FIELDS = {
  homePaddies: [
    [
      [1460, 1570],
      [1680, 1560],
      [1700, 1662],
      [1478, 1674],
    ],
    [
      [1700, 1566],
      [1892, 1560],
      [1906, 1650],
      [1716, 1660],
    ],
    [
      [1490, 1690],
      [1760, 1678],
      [1776, 1790],
      [1512, 1804],
    ],
    [
      [1780, 1676],
      [1930, 1668],
      [1944, 1770],
      [1794, 1788],
    ],
  ] as readonly (readonly Pt[])[],
  /** ghost bunds — the fields were once FOUR TIMES wider (drawn, faint) */
  ghostBunds: [
    [760, 1555],
    [1450, 1545],
    [1470, 1930],
    [800, 1958],
  ] as readonly Pt[],
  ghostBundsSouth: [
    [1520, 1830],
    [1950, 1800],
    [1975, 1965],
    [1545, 1985],
  ] as readonly Pt[],
  /** the margins — the paddy fringe where the setts are */
  margins: [
    [1352, 1600],
    [1470, 1590],
    [1500, 1860],
    [1390, 1875],
  ] as readonly Pt[],
  /** the badger sett-line running UNDER the precinct wall (a way in nobody official knows) */
  settLine: [
    [1420, 1592],
    [1398, 1540],
    [1372, 1498],
  ] as readonly Pt[],
  /** T1 worked terraces climbing the NW slope (numbered 一..五) */
  terraces: {
    baseline: [
      [800, 1010],
      [1105, 952],
    ] as readonly Pt[],
    count: 5,
    depth: 34,
    numberFrom: 1,
  },
  /** T1 let-go terraces above — the numbering keeps counting (六..九) into scrub */
  letgo: {
    baseline: [
      [850, 712],
      [1105, 662],
    ] as readonly Pt[],
    count: 4,
    depth: 30,
    numberFrom: 6,
  },
} as const;

// ── the wilds (G8) ───────────────────────────────────────────────────────────
export const WILDS = {
  /** the old compound's orchard — courtyard rows gone feral, aligned to the RUIN */
  orchard: {
    origin: [1842, 968] as Pt,
    cols: 5,
    rows: 4,
    spacing: 45,
    angleDeg: -3,
  },
  /** the bamboo grove behind the precinct — the monkeys' ground */
  grove: [
    [1900, 398],
    [2258, 384],
    [2298, 542],
    [1950, 556],
  ] as readonly Pt[],
  /** the eastern forest mass (thickens east; its NW boundary is the BURN LINE) */
  forest: [
    [2700, 300],
    [3150, 250],
    [3160, 1700],
    [2760, 1600],
    [2620, 1380],
    [2570, 1160],
    [2652, 985],
    [2705, 500],
  ] as readonly Pt[],
  /** the too-straight firebreak edge — a fire nobody dates, held by someone */
  burnLine: [
    [2652, 985],
    [2782, 740],
    [2900, 522],
  ] as readonly Pt[],
  /** the woodlot edge — scattered conifers between precinct and forest */
  woodlotScatter: [
    [2440, 820],
    [2740, 800],
    [2760, 1500],
    [2470, 1480],
  ] as readonly Pt[],
  /** T1: the charcoal clamp deep in the lot */
  clamp: [2865, 645] as Pt,
  /** the family plot on the NE slope (T1 seal; the ground exists in T0 too) */
  gravePlot: { at: [2452, 502] as Pt, w: 92, h: 62 },
} as const;

// ── roads (G10) — brown work-worn lines that GO somewhere ────────────────────
export const ROADS = {
  /** the living approach: gate → the village, south off-sheet */
  village: [
    [2140, 1524],
    [2152, 1660],
    [2172, 1810],
    [2130, 2060],
    [2114, 2110], // off the sheet edge — the road LEAVES (R7; the T2-V6 lesson)
  ] as readonly Pt[],
  /** the hill track east through the woodlot — over the pass */
  eastTrack: [
    [2322, 1300],
    [2520, 1242],
    [2750, 1120],
    [3000, 1032],
    [3160, 990],
    [3212, 968], // off the sheet edge (R7)
  ] as readonly Pt[],
  /** the upstream path along the east bank — the temple country (the packet's road) */
  upstream: [
    [560, 1140],
    [592, 900],
    [640, 620],
    [700, 380],
    [742, 140],
    [758, -8], // off the sheet edge (R7)
  ] as readonly Pt[],
  /** the daily work path: gate → paddies → weir */
  workPath: [
    [2128, 1512],
    [1950, 1580],
    [1700, 1622],
    [1450, 1640],
    [1150, 1562],
    [800, 1402],
    [562, 1212],
  ] as readonly Pt[],
  /** compound → orchard → bamboo grove (the raid corridor, walked in reverse) */
  grovePath: [
    [2050, 1092],
    [1982, 952],
    [2000, 700],
    [2050, 535],
  ] as readonly Pt[],
  /** east track spur → the charcoal clamp (T1) */
  clampPath: [
    [2750, 1120],
    [2810, 900],
    [2862, 690],
  ] as readonly Pt[],
  /** work path spur → the terraces (T1) */
  terracePath: [
    [1150, 1562],
    [1040, 1330],
    [960, 1100],
    [922, 1012],
  ] as readonly Pt[],
  /** the Bon path: compound → the family plot (T1) */
  bonPath: [
    [2340, 1046],
    [2408, 820],
    [2444, 612],
    [2452, 545],
  ] as readonly Pt[],
} as const;

/** Period distance notes at the exits — the sheet says where the world
 *  continues. ENGLISH (FB-181/183: a player must understand where a road
 *  goes; the old kanji forms sat unread — and unpainted: no painter consumed
 *  this data until the 2026-07-09 R7 fix wired it). Translations of the
 *  original authored notes, not new fiction. */
export const NOTES: readonly {
  readonly x: number;
  readonly y: number;
  readonly text: string;
  readonly t1Only?: boolean;
}[] = [
  // FB-413 — 25 units clear of the R1 fog frontier (edge ≈ y1725 here): the
  // baseline sat 13 units off while the fog's displacement filter jitters ±14,
  // so a renderer rasterizing the filter differently could eat glyph bottoms.
  { x: 2196, y: 1688, text: 'to the village — half a ri' },
  { x: 2450, y: 1275, text: 'the pass road — east' },
  { x: 620, y: 468, text: 'upstream — the temple lands' },
  { x: 2050, y: 2032, text: 'the village road', t1Only: true },
  { x: 2930, y: 926, text: 'to the next valley', t1Only: true },
  { x: 700, y: 218, text: 'a mountain path', t1Only: true },
];

/** Story annotations in the surveyor's own hand — the document SAYS what the
 *  drawing alone stopped saying at fit zoom (the 2026-07-09 ensemble blind
 *  pass: R5 nesting read INVERTED 0/3, R6 shrinkage unread, R8 never
 *  recovered). English per FB-181/183; every line is transcribed from
 *  committed canon (nodes.ts wrong-lines · spec §4 · the DEV tooltips),
 *  never newly-authored fiction. */
export const SURVEY_NOTES: readonly {
  readonly x: number;
  readonly y: number;
  readonly text: string;
  readonly t1Only?: boolean;
}[] = [
  // R5 — the nesting, said in the document's voice
  { x: 880, y: 1032, text: 'the old precinct wall — robbed to footings' },
  { x: 1600, y: 1180, text: "the house keeps the old ring's corner" },
  // R6 — the shrinkage
  { x: 950, y: 1748, text: 'the old fields — four times this, let go' },
  { x: 648, y: 872, text: 'boundary stone — the old line' },
  // R8 — the stable court under the drill yard. FB-414: y sits 30 below the
  // stable building's footprint so the caption never runs across the drawing.
  { x: 2380, y: 1432, text: 'the old stables — stalls for twenty' },
];

/** The night-rounds patrol rail (drawn when 夜 is selected) — gate → kura →
 *  forecourt → paddy edge → gate. */
export const NIGHT_ROUTE: readonly Pt[] = [
  [2160, 1508],
  [2255, 1468],
  [2300, 1340],
  [2305, 1130],
  [2200, 1090],
  [2050, 1102],
  [1990, 1252],
  [1985, 1420],
  [2062, 1482],
  [2160, 1508],
];

/** T1: the round GROWS with the estate — the same loop plus the works stretch. */
export const NIGHT_ROUTE_T1: readonly Pt[] = [
  [2160, 1508],
  [2255, 1468],
  [2300, 1340],
  [2305, 1130],
  [2310, 1075],
  [2200, 1058],
  [2050, 1080],
  [1990, 1252],
  [1930, 1560],
  [1892, 1600],
  [1985, 1470],
  [2062, 1482],
  [2160, 1508],
];

/** The hooded new-moon lantern thread — leaves the yard's far edge, goes UPSTREAM.
 *  Never keyed in the legend: the sheet's authored mystery (G11). */
export const LANTERN_THREAD: readonly Pt[] = [
  [1996, 1200],
  [1620, 1188],
  [1120, 1150],
  [760, 1060],
  [640, 850],
];

/** Boundary stones — the estate's legal edge, far beyond everything worked (G9).
 *  `newer` = the river-side stone that stands a field short, fresher than its
 *  brothers (T1's banked village-track dispute). */
export const BOUNDARY_STONES: readonly {
  readonly x: number;
  readonly y: number;
  readonly newer?: boolean;
  readonly t1Only?: boolean;
}[] = [
  { x: 622, y: 902 },
  { x: 642, y: 1424, newer: true },
  { x: 1205, y: 1718 },
  { x: 2550, y: 762 },
  { x: 1252, y: 1988, t1Only: true },
  { x: 1752, y: 2002, t1Only: true },
  { x: 2252, y: 1978, t1Only: true },
  { x: 2902, y: 902, t1Only: true },
  { x: 2872, y: 1552, t1Only: true },
];
