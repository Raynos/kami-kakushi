// map-sheets/valley.ts — the T2 VALLEY extension of the one geography (map-spec §6).
// The estate world (layout.ts WORLD, y 0..2100) is the NORTH of this sheet; the
// valley floor + Asagiri village extend SOUTH of it, on the SAME coordinate system —
// so T1 is a crop of T2 and no landmark moves (spec V5/VG-*). Pure data: no DOM, no
// drawing. The T2 composition (t2-ground.ts) marries these coordinates + the estate
// data to the primitive library, drawing the estate DEMOTED to a compound pictogram.
//
// The spatial story this data must tell (spec §6.0):
//   estate NORTH/upstream · the river the valley's spine (N→S) · a GORGE pinch
//   between estate and village · Asagiri DOWNSTREAM/south on the east bank with its
//   public works (well · market · temple · headman · mill · ferry) · the quarry that
//   ate the ruin's stones on a flank · the mountain-dogs' camp up a side draw · the
//   road on out of the valley south.

import type { Pt } from './geom';

/** The T2 frame — the whole valley. The estate (WORLD 3200×2100) holds the north;
 *  the valley floor runs south to Asagiri, ~half a ri down. Taller than the 3:2
 *  estate window on purpose: a valley sheet reads down its river. */
export const VALLEY = { x: 0, y: 0, w: 3200, h: 4300 } as const;

// ── the river's southward course (continues layout.RIVER past the estate) ────────
// The estate river exits ~[400,2060]; this picks it up and runs it down through the
// gorge, past the mill, to the ferry crossing at Asagiri and on out of the valley.
export const RIVER_SOUTH = {
  centerline: [
    [400, 2060],
    [430, 2250],
    [470, 2430],
    [516, 2600], // the gorge pinch
    [560, 2800],
    [618, 3010],
    [688, 3170], // the mill race leaves here
    [744, 3380],
    [772, 3560], // the ferry crossing
    [812, 3820],
    [864, 4180],
  ] as readonly Pt[],
  widthProfile: [
    { t: 0, w: 44 },
    { t: 0.28, w: 26 }, // pinched at the gorge
    { t: 0.55, w: 50 },
    { t: 1, w: 66 }, // broad and deep at the crossing (why the ferry exists)
  ],
} as const;

/** The gorge — the banks pinch to a narrow tapered channel (why the ferry exists,
 *  not a ford). A squared old cutting in the wall reads as a wrong thing. */
export const GORGE = {
  at: [516, 2600] as Pt,
  /** the two crowding valley-wall shoulders that make the pinch */
  westWall: [
    [360, 2440],
    [452, 2560],
    [470, 2700],
    [360, 2820],
  ] as readonly Pt[],
  eastWall: [
    [700, 2440],
    [590, 2560],
    [576, 2700],
    [700, 2840],
  ] as readonly Pt[],
  /** the squared cutting nobody in the valley claims (a wrong thing) */
  cutting: [548, 2640] as Pt,
} as const;

// ── the valley walls & woods (the flanks framing the floor, extending south) ─────
export const VALLEY_HILLS = {
  /** the west flank ridgeline running south */
  westRidge: [
    [120, 2200],
    [180, 2600],
    [150, 3100],
    [210, 3600],
    [170, 4100],
  ] as readonly Pt[],
  /** the east flank ridgeline running south */
  eastRidge: [
    [3020, 2200],
    [2960, 2650],
    [3010, 3150],
    [2940, 3650],
    [3000, 4120],
  ] as readonly Pt[],
} as const;

export const VALLEY_WOODS = {
  /** the west flank wood mass */
  west: [
    [40, 2160],
    [420, 2220],
    [470, 2760],
    [360, 3300],
    [430, 3900],
    [300, 4260],
    [40, 4260],
  ] as readonly Pt[],
  /** the east flank wood mass (thickening from the estate forest) */
  east: [
    [2680, 2100],
    [3160, 2160],
    [3160, 4260],
    [2760, 4260],
    [2560, 3700],
    [2640, 3100],
    [2560, 2560],
  ] as readonly Pt[],
} as const;

// ── the valley washes (L1 substrate, extended south of the estate) ───────────────
export const VALLEY_WASHES = {
  /** the valley floor below the estate — a broad quiet band down to the frame foot */
  floor: [
    [180, 2080],
    [3020, 2080],
    [3040, 4240],
    [160, 4240],
  ] as readonly Pt[],
  /** the settled ground around Asagiri — a lighter, worked breath (east bank) */
  village: [
    [860, 3180],
    [1780, 3200],
    [1820, 3860],
    [900, 3880],
  ] as readonly Pt[],
  /** the river meadow — the damp strip continuing along the banks south */
  meadow: [
    [420, 2160],
    [640, 2260],
    [560, 2900],
    [720, 3300],
    [860, 3760],
    [700, 4160],
    [500, 4160],
    [480, 3400],
    [420, 2760],
  ] as readonly Pt[],
} as const;

// ── ASAGIRI (朝霧) — the village, downstream on the east bank (spec VG5) ──────────
export const VILLAGE = {
  /** the street — the village's spine, N→S along the east bank */
  street: [
    [1080, 3230],
    [1120, 3420],
    [1160, 3600],
    [1200, 3780],
  ] as readonly Pt[],
  /** house clusters east of the street — blocks of small roofs, not room-by-room.
   *  Each: an origin + a rough count; the primitive scatters brush-alive roofs. */
  clusters: [
    { at: [1300, 3300] as Pt, count: 5, spread: 120 },
    { at: [1460, 3460] as Pt, count: 6, spread: 140 },
    { at: [1320, 3620] as Pt, count: 5, spread: 130 },
    { at: [1520, 3720] as Pt, count: 4, spread: 110 },
    // a few houses on the near (west-of-street) side toward the river too
    { at: [980, 3520] as Pt, count: 3, spread: 90 },
  ],
  /** the well — the village's honest heart (R0's "the well goes quiet") */
  well: [1150, 3380] as Pt,
  /** the market square — an open block with stall rows on market days */
  market: {
    ground: [
      [1330, 3470],
      [1520, 3470],
      [1520, 3600],
      [1330, 3600],
    ] as readonly Pt[],
    at: [1425, 3535] as Pt,
  },
  /** the headman's (Mohei's) house — the one house drawn a size up, walled yard */
  headman: {
    at: [1330, 3320] as Pt,
    yard: [
      [1270, 3280],
      [1410, 3280],
      [1410, 3400],
      [1270, 3400],
    ] as readonly Pt[],
  },
  /** the shrine & temple (Ekai's, the register of the vanished) — south edge */
  temple: { at: [1560, 3760] as Pt, torii: [1470, 3760] as Pt },
  /** the mill (Kyūbei's) — a waterwheel on a race off the river, above the village */
  mill: {
    at: [700, 3120] as Pt,
    race: [
      [688, 3150],
      [742, 3140],
      [790, 3180],
    ] as readonly Pt[],
  },
  /** the ferry (Funakichi's) — a landing + rope crossing where no bridge reaches */
  ferry: { east: [810, 3560] as Pt, west: [640, 3560] as Pt },
} as const;

// ── the valley's edges carry the trouble (spec §6.1) ─────────────────────────────
export const VALLEY_FEATURES = {
  /** the old quarry — a dressed-stone scar on the west flank; sled tracks toward
   *  the ruin (north) and the village (south). Its cuts MATCH the ruin's footings. */
  quarry: {
    at: [340, 2360] as Pt,
    scar: [
      [250, 2260],
      [440, 2280],
      [460, 2470],
      [270, 2480],
    ] as readonly Pt[],
  },
  /** the mountain-dogs' camp — a palisade + fires up a side draw, OFF the floor
   *  (Seiroku's). Town-made gear here is the T4 shadow (a wrong thing). */
  camp: { at: [230, 2700] as Pt },
  /** hill shrines — tiny roadside shrine glyphs up the flanks */
  hillShrines: [[2560, 2840] as Pt, [200, 3040] as Pt, [2760, 3480] as Pt] as readonly Pt[],
  /** the moved boundary stone — the T1 "fresher" stone, now a field INTO Asagiri's
   *  land (the village-track dispute made visible) */
  movedStone: [660, 2860] as Pt,
} as const;

// ── the valley roads (they connect the valley to the wider world; spec V6) ───────
export const VALLEY_ROADS = {
  /** the estate's south road CONTINUES to Asagiri (layout.ROADS.village → here) */
  toVillage: [
    [2130, 2060],
    [2040, 2280],
    [1840, 2520],
    [1600, 2780],
    [1400, 3020],
    [1250, 3220],
    [1140, 3340],
  ] as readonly Pt[],
  /** on out of the valley, south past Asagiri — to the region / castle town (T3+) */
  onward: [
    [1200, 3780],
    [1100, 3990],
    [980, 4220],
  ] as readonly Pt[],
  /** the ferry approach — street → landing → west bank */
  ferryApproach: [
    [1140, 3520],
    [980, 3550],
    [810, 3560],
    [640, 3560],
    [520, 3480],
  ] as readonly Pt[],
  /** the camp track — down the side draw to the ferry road (the night-roads trouble) */
  campTrack: [
    [230, 2740],
    [360, 2960],
    [470, 3200],
    [520, 3460],
  ] as readonly Pt[],
  /** the quarry sled tracks — up toward the ruin, down toward the village */
  quarryTracks: [
    [
      [360, 2340],
      [560, 2200],
      [820, 2060],
    ],
    [
      [380, 2440],
      [560, 2700],
      [760, 3040],
    ],
  ] as readonly (readonly Pt[])[],
} as const;

/** The T2 night-roads rail (drawn when 夜 is selected) — the valley patrol: the
 *  ferry crossing → the village → up the estate road → and back down. Where the
 *  mountain-dogs' pressure falls after dark (spec §6.1). */
export const NIGHT_ROUTE_T2: readonly Pt[] = [
  [810, 3560],
  [1140, 3400],
  [1400, 3020],
  [1840, 2520],
  [2130, 2080],
  [1600, 2780],
  [1250, 3230],
  [980, 3550],
  [810, 3560],
];

/** Period distance notes at the T2 exits — where the valley continues. */
export const VALLEY_NOTES: readonly {
  readonly x: number;
  readonly y: number;
  readonly text: string;
  readonly vertical?: boolean;
}[] = [
  { x: 940, y: 4160, text: 'to the castle town', vertical: true },
  { x: 606, y: 2360, text: 'upstream · temple country', vertical: true },
];

/** The T2 seal anchors — added to layout.ANCHORS (the shell reads ANCHORS[id]).
 *  Kept here beside the geometry they name; layout.ts spreads them in. */
export const VALLEY_ANCHORS: Readonly<Record<string, { x: number; y: number }>> = {
  // the estate, DEMOTED — the two seals the reveal re-labels (spec §6.2)
  'guest-house': { x: 2130, y: 1300 },
  'main-house-ruin': { x: 1650, y: 860 },
  'gatehouse-works': { x: 1770, y: 1560 },
  // Asagiri's public works
  asagiri: { x: 1250, y: 3470 },
  'asagiri-well': { x: 1150, y: 3380 },
  market: { x: 1425, y: 3535 },
  'headman-house': { x: 1330, y: 3320 },
  temple: { x: 1560, y: 3760 },
  mill: { x: 700, y: 3120 },
  ferry: { x: 810, y: 3560 },
  // the valley's edges
  gorge: { x: 516, y: 2600 },
  quarry: { x: 340, y: 2360 },
  'bandit-camp': { x: 230, y: 2700 },
  'hill-shrines': { x: 2560, y: 2840 },
  'valley-woods': { x: 2820, y: 2560 },
  'night-roads': { x: 640, y: 3560 },
  'moved-stone': { x: 660, y: 2860 },
} as const;
