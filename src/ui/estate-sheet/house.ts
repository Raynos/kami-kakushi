// estate-sheet/house.ts — THE ONE HOUSE GEOMETRY (TST1): every room's plan
// rectangle (in ken 間), elevation heights, and the ruin backdrop masses, as
// pure data. Both variant compositions (sheet-a fold-up, sheet-b section-cut)
// draw FROM this — the two sheets can never drift into two different houses.
// Facts derive from the story bible's estate anatomy (05-world.md) via the
// module README (the standalone E1 spec); the bible wins every disagreement.
//
// Plan coordinates: x grows EAST, y grows SOUTH (0,0 = the compound's NW
// corner). The compound is ~26 × 20 ken; the ruin looms BEYOND y<0 (north).

export type RoomId =
  | 'gate'
  | 'mainBody'
  | 'kitchen'
  | 'eastWing'
  | 'westWing'
  | 'tokuRoom'
  | 'shoin'
  | 'kura'
  | 'woodshed'
  | 'sickroom'
  | 'stable';

export interface RoomDef {
  readonly id: RoomId;
  readonly kanji: string;
  readonly en: string;
  /** plan rect in ken: [x0, y0, x1, y1] */
  readonly rect: readonly [number, number, number, number];
  /** elevation: eave (wall-top) height and ridge height, in ken */
  readonly eave: number;
  readonly ridge: number;
  /** white-plaster storehouse body (the kura) — lighter wall fill */
  readonly plaster?: boolean;
  /** lean-to: single roof slope, no ridge mass */
  readonly leanTo?: boolean;
}

/** The compound wall extent, in ken. */
export const COMPOUND = { x0: 0, y0: 0, x1: 26, y1: 20 } as const;

/** The rooms + yard buildings. Order = paint order (north → south works for
 *  the section-cut's overdraw too). */
export const ROOMS: readonly RoomDef[] = [
  // the inner north end (T1's unlock arc)
  {
    id: 'tokuRoom',
    kanji: '局',
    en: "Toku's room",
    rect: [9, 3.4, 11.6, 5.2],
    eave: 1.5,
    ridge: 2.5,
  },
  { id: 'shoin', kanji: '書院', en: 'the Shoin', rect: [13, 2.8, 17, 5.2], eave: 1.6, ridge: 2.8 },
  // the winged residence
  { id: 'westWing', kanji: '西', en: 'West wing', rect: [3, 5.5, 8, 10.5], eave: 1.7, ridge: 2.9 },
  {
    id: 'mainBody',
    kanji: '母屋',
    en: 'the main body',
    rect: [8, 5, 18, 11],
    eave: 1.9,
    ridge: 3.4,
  },
  {
    id: 'eastWing',
    kanji: '東',
    en: 'East wing',
    rect: [18, 5.5, 23, 10.5],
    eave: 1.7,
    ridge: 2.9,
  },
  {
    id: 'kitchen',
    kanji: '竈',
    en: 'kitchen & board',
    rect: [5, 10.4, 8.2, 13.4],
    eave: 1.5,
    ridge: 2.4,
  },
  // the yards
  {
    id: 'kura',
    kanji: '蔵',
    en: 'the kura',
    rect: [22.4, 1, 25.4, 4.6],
    eave: 2,
    ridge: 3.2,
    plaster: true,
  },
  {
    id: 'stable',
    kanji: '稽',
    en: 'drill yard (old stable court)',
    rect: [23.4, 6.5, 25.6, 16.5],
    eave: 1.5,
    ridge: 2.2,
  },
  { id: 'woodshed', kanji: '薪', en: 'woodshed', rect: [1, 16.6, 3.6, 19], eave: 1.1, ridge: 1.8 },
  {
    id: 'sickroom',
    kanji: '薬',
    en: "Sōan's sickroom",
    rect: [0.4, 12, 2.6, 14.4],
    eave: 1,
    ridge: 1.5,
    leanTo: true,
  },
  {
    id: 'gate',
    kanji: '門',
    en: 'gate & gateyard',
    rect: [11, 19.2, 15, 20.8],
    eave: 1.7,
    ridge: 2.6,
  },
] as const;

export const ROOM_BY_ID: ReadonlyMap<RoomId, RoomDef> = new Map(ROOMS.map((r) => [r.id, r]));

/** The corridor joining the wings through the main body (drawn on-plan; the
 *  shrine alcove niche sits IN it — H3's wrongness). y-band in ken. */
export const CORRIDOR = { x0: 3, x1: 23, y0: 7.4, y1: 8.6 } as const;
/** The alcove niche: a half-ken square on the corridor's north side. */
export const ALCOVE = { x: 16.2, y: 7.4 } as const;

/** Forecourt (swept ground, oversized — its edge reaches past the front it
 *  serves) + the well ring. */
export const FORECOURT = { x0: 5.5, y0: 13.8, x1: 21.5, y1: 19.2 } as const;
export const WELL = { x: 17.6, y: 15.4 } as const;

/** Stall divisions in the stable range — housing for twenty, holding one mule. */
export const STALLS = 12;
export const MULE_STALL = 4; // index from the north end

/** The ruin backdrop beyond the north wall (H4): masses at the SAME ken
 *  scale, positioned in compound-x, rising from the north-wall line.
 *  Heights in ken — the great gate doubles the lived house's tallest ridge. */
export interface RuinMass {
  readonly kind: 'wall' | 'gate' | 'fallen';
  readonly x0: number;
  readonly x1: number;
  /** standing height in ken (for 'fallen': the collapse's high edge) */
  readonly h: number;
  readonly seed: string;
}

export const RUIN: readonly RuinMass[] = [
  { kind: 'wall', x0: -3, x1: 3.5, h: 2.6, seed: 'ruin-w1' },
  { kind: 'fallen', x0: 4, x1: 8.5, h: 1.4, seed: 'ruin-f1' },
  { kind: 'gate', x0: 9.5, x1: 17.5, h: 6.8, seed: 'ruin-gate' },
  { kind: 'wall', x0: 18.5, x1: 22, h: 3.4, seed: 'ruin-w2' },
  { kind: 'fallen', x0: 22.5, x1: 27, h: 1.1, seed: 'ruin-f2' },
  { kind: 'wall', x0: 27.5, x1: 31, h: 2.1, seed: 'ruin-w3' },
] as const;
