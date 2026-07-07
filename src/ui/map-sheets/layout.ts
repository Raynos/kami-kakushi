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

import type { Pt } from './brush';

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
  'drill-yard': { x: 2318, y: 1362 },
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
};

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
    { x: 640, y: 300, r: 42 },
    { x: 702, y: 358, r: 32 },
    { x: 642, y: 414, r: 26 },
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
  weir: { at: [506, 1192] as Pt, angleDeg: 100 },
  /** the weir-jizō on the near bank — offerings nobody admits to (unexplained) */
  jizo: [560, 1152] as Pt,
  bridge: { at: [488, 1242] as Pt, angleDeg: 100 },
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
    { at: [432, 1800] as Pt, angleDeg: 95 },
    { at: [446, 1902] as Pt, angleDeg: 100 },
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
    [1150, 520],
    [1750, 470],
    [2340, 510],
    [2360, 1046],
  ] as readonly Pt[],
  /** stretches still standing (heavy broken brush, not footings) */
  standing: [
    [
      [1400, 495],
      [1750, 470],
      [1980, 485],
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
    { x: 1700, y: 770, w: 205, h: 115, angleDeg: -4 },
    { x: 1500, y: 890, w: 135, h: 85, angleDeg: 7 },
    { x: 1895, y: 905, w: 150, h: 88, angleDeg: -9 },
    { x: 1640, y: 655, w: 110, h: 64, angleDeg: -11 },
    { x: 1795, y: 1012, w: 95, h: 58, angleDeg: 6 },
  ],
  /** the old barracks row along the west wall */
  barracksRow: [
    { x: 1275, y: 740, w: 88, h: 46, angleDeg: 84 },
    { x: 1300, y: 880, w: 88, h: 46, angleDeg: 86 },
    { x: 1325, y: 1020, w: 88, h: 46, angleDeg: 88 },
  ],
  /** the ORIGINAL family temple-alcove (the guest-house alcove is its echo) */
  templeAlcove: [2020, 720] as Pt,
  /** rubble ground around the core */
  rubble: [
    [1440, 640],
    [1990, 600],
    [2050, 980],
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
  house: { at: [2130, 1215] as Pt, scale: 1.35, angleDeg: 0 },
  kura: [2310, 1118] as Pt,
  woodshed: [1978, 1442] as Pt,
  sickroom: [1962, 1338] as Pt,
  /** the old stable court = the drill yard: stalls for twenty, one mule (G6) */
  stable: { at: [2312, 1330] as Pt, stalls: 10, angleDeg: 90 },
  workshops: [2308, 1242] as Pt,
  /** the forecourt — swept ground sized for a household five times this one */
  forecourt: [
    [2000, 1330],
    [2300, 1330],
    [2300, 1480],
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
  orchard: { origin: [1800, 930] as Pt, cols: 6, rows: 4, spacing: 47, angleDeg: -3 },
  /** the bamboo grove behind the precinct — the monkeys' ground */
  grove: [
    [1905, 322],
    [2262, 310],
    [2300, 478],
    [1952, 495],
  ] as readonly Pt[],
  /** the eastern forest mass (thickens east; its NW boundary is the BURN LINE) */
  forest: [
    [2700, 300],
    [3150, 250],
    [3160, 1700],
    [2760, 1600],
    [2660, 1000],
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
  ] as readonly Pt[],
  /** the hill track east through the woodlot — over the pass */
  eastTrack: [
    [2322, 1300],
    [2520, 1242],
    [2750, 1120],
    [3000, 1032],
    [3160, 990],
  ] as readonly Pt[],
  /** the upstream path along the east bank — the temple country (the packet's road) */
  upstream: [
    [560, 1140],
    [592, 900],
    [640, 620],
    [700, 380],
    [742, 140],
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
    [2050, 490],
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

/** Period distance notes at the exits — the sheet says where the world continues. */
export const NOTES: readonly {
  readonly x: number;
  readonly y: number;
  readonly text: string;
  readonly vertical?: boolean;
  readonly t1Only?: boolean;
}[] = [
  { x: 2192, y: 1700, text: '村へ 半里', vertical: true },
  { x: 2596, y: 1198, text: '峠道', vertical: true },
  { x: 602, y: 582, text: '上流 寺領へ', vertical: true },
  { x: 2136, y: 2010, text: '村道', vertical: true, t1Only: true },
  { x: 3062, y: 952, text: '隣谷へ', vertical: true, t1Only: true },
  { x: 706, y: 232, text: '山径', vertical: true, t1Only: true },
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
