// estate-sheet/sheet-a.ts — VARIANT A · the fold-up okoshi-ezu proper: the
// floor plan at the sheet's centre, wall elevations hinged flat off its
// edges (fold tabs + hinge dashes — the sheet admits it wants to be cut out
// and stood up), loose side pieces for the east/west faces and the winged
// residence's south face, and the ruin as an UN-folded backdrop elevation
// pinned along the north edge, taller than any folded wall (H4). Truest to
// the genre; the riskier read. All geometry from house.ts; all state ink
// from the fixture (H5).

import { brushStroke, inkLine, sv, tip, wash } from '../map-sheets/brush';
import type { Pt } from '../map-sheets/geom';
import {
  altarNiche,
  boardDesk,
  cartouche,
  foldHinge,
  freshStamp,
  hatchArea,
  kenBar,
  legendBox,
  rakeArcs,
  roofProfile,
  ruinBackdrop,
  smokeWisp,
  stallRange,
  struckMark,
  tatamiPlan,
  txt,
  wallFace,
  wellRing,
} from './elevation';
import {
  ALCOVE,
  COMPOUND,
  CORRIDOR,
  FORECOURT,
  MULE_STALL,
  ROOMS,
  RUIN,
  STALLS,
  WELL,
} from './house';
import type { RoomDef } from './house';
import type { EstateFixture } from './fixture';

export const SHEET_A_W = 1200;
export const SHEET_A_H = 1010;

const KEN = 24;
const PX = 250; // plan west edge
const PY = 300; // plan north edge (the north hinge)

const kx = (k: number): number => PX + k * KEN;
const ky = (k: number): number => PY + k * KEN;

/** Paint variant A into a root group. */
export function paintSheetA(root: SVGElement, fx: EstateFixture): void {
  // ── the paper ──
  wash(
    root,
    [
      [8, 8],
      [SHEET_A_W - 8, 8],
      [SHEET_A_W - 8, SHEET_A_H - 8],
      [8, SHEET_A_H - 8],
    ],
    { seed: 'a:paper', fill: 'var(--steel-1)', opacity: 0.7, amp: 3 },
  );

  // ── the ruin backdrop, un-folded along the north edge (H4) ──
  const ruinGround = PY - 34;
  ruinBackdrop(root, ruinGround, {
    seed: 'a:ruin',
    ken: KEN,
    toX: kx,
    revealed: fx.ruinRevealed,
    masses: RUIN,
  });
  // its honest / dishonest name
  if (fx.ruinRevealed) {
    txt(root, kx(13.5), ruinGround - 6.9 * KEN - 14, '本邸', {
      size: 20,
      color: 'var(--silver-hi)',
    });
    txt(root, kx(15.6), ruinGround - 6.9 * KEN - 12, '改', { size: 10, color: 'var(--shu)' });
  } else {
    txt(root, kx(13.5), ruinGround - 6.9 * KEN - 14, '廃', {
      size: 13,
      color: 'var(--silver-faint)',
      opacity: 0.9,
    });
  }
  // the rope line between the lived corner and the dead precinct — outside
  // every legend (E8)
  inkLine(
    root,
    [
      [kx(-1), PY - 16],
      [kx(27), PY - 18],
    ],
    { seed: 'a:rope', color: 'var(--shu)', w: 1, dash: '2 7', opacity: 0.55, amp: 2 },
  );

  // ── the north fold: the compound's north wall, upright above the hinge ──
  wallFace(root, kx(0), kx(26), PY - 1.1 * KEN, PY, { seed: 'a:nwall', postStep: 46 });
  foldHinge(root, [kx(0), PY], [kx(26), PY], { seed: 'a:hinge-n', tabSide: -1, tabs: 3 });

  // ── the plan ──
  paintPlan(root, fx);

  // ── the south fold: south wall + the gate elevation, folded DOWN ──
  const sy = ky(20);
  wallFace(root, kx(0), kx(11), sy, sy + 1.2 * KEN, { seed: 'a:swall-w', postStep: 44 });
  wallFace(root, kx(15), kx(26), sy, sy + 1.2 * KEN, { seed: 'a:swall-e', postStep: 44 });
  // the gate — an EVENT: its roof reaching further down (away) than the wall
  const gate = ROOMS.find((r) => r.id === 'gate')!;
  wallFace(root, kx(11), kx(15), sy, sy + gate.eave * KEN, { seed: 'a:gatewall', postStep: 24 });
  roofProfile(root, kx(11), kx(15), sy + gate.eave * KEN, sy + gate.ridge * KEN, {
    seed: 'a:gateroof',
    flip: true,
  });
  txt(root, kx(13), sy + gate.ridge * KEN + 16, '門', { size: 12, color: 'var(--silver-hi)' });
  // the worn threshold
  brushStroke(
    root,
    [
      [kx(11.6), sy + 2],
      [kx(14.4), sy + 2],
    ],
    { seed: 'a:thresh', w: 2.6, color: 'var(--silver-dim)', dry: true },
  );
  foldHinge(root, [kx(0), sy], [kx(26), sy], { seed: 'a:hinge-s', tabSide: 1, tabs: 3 });

  // ── loose pieces (the cut-out parts of the paper model) ──
  paintWestPiece(root, fx);
  paintEastPiece(root, fx);
  paintResidencePiece(root, fx);

  // ── furniture ──
  cartouche(root, 60, 56, { seed: 'a:cart', revealed: fx.ruinRevealed });
  kenBar(root, 66, 936, { seed: 'a:ken', ken: KEN });
  legendBox(root, 1040, 918, { seed: 'a:leg' });
  txt(root, 60, 246, fx.label, {
    size: 11,
    color: 'var(--ink-soft)',
    vertical: true,
    anchor: 'start',
  });
  // the sheet border — crisp
  root.append(
    sv('rect', {
      x: '2',
      y: '2',
      width: String(SHEET_A_W - 4),
      height: String(SHEET_A_H - 4),
      fill: 'none',
      stroke: 'var(--silver-faint)',
    }),
  );
}

// ── the plan centre ──────────────────────────────────────────────────────────

function paintPlan(root: SVGElement, fx: EstateFixture): void {
  // compound ground
  wash(
    root,
    [
      [kx(COMPOUND.x0), ky(COMPOUND.y0)],
      [kx(COMPOUND.x1), ky(COMPOUND.y0)],
      [kx(COMPOUND.x1), ky(COMPOUND.y1)],
      [kx(COMPOUND.x0), ky(COMPOUND.y1)],
    ],
    { seed: 'a:ground', fill: 'var(--steel-2)', opacity: 0.5, amp: 2.5 },
  );
  // the forecourt — swept tone, oversized (its edge reaching past the front
  // it serves — H3's quiet version)
  wash(
    root,
    [
      [kx(FORECOURT.x0), ky(FORECOURT.y0)],
      [kx(FORECOURT.x1), ky(FORECOURT.y0)],
      [kx(FORECOURT.x1), ky(FORECOURT.y1)],
      [kx(FORECOURT.x0), ky(FORECOURT.y1)],
    ],
    { seed: 'a:court', fill: 'var(--steel-hi)', opacity: 0.13, amp: 2 },
  );
  rakeArcs(root, kx(FORECOURT.x0), ky(FORECOURT.y0), kx(FORECOURT.x1), ky(FORECOURT.y1), 'a:rake');
  wellRing(root, kx(WELL.x), ky(WELL.y), 7, 'a:well');

  // the compound wall — the structural boundary (gate gap on the south)
  const wallPts: Pt[] = [
    [kx(11), ky(20)],
    [kx(0), ky(20)],
    [kx(0), ky(0)],
    [kx(26), ky(0)],
    [kx(26), ky(20)],
    [kx(15), ky(20)],
  ];
  brushStroke(root, wallPts, { seed: 'a:wall', w: 3.2, color: 'var(--silver)', wobble: 0.2 });

  // the corridor joining the wings — drawn UNDER the rooms' outlines
  inkLine(
    root,
    [
      [kx(CORRIDOR.x0), ky(CORRIDOR.y0)],
      [kx(CORRIDOR.x1), ky(CORRIDOR.y0)],
    ],
    { seed: 'a:cor1', color: 'var(--silver-dim)', w: 1.2, amp: 0.8 },
  );
  inkLine(
    root,
    [
      [kx(CORRIDOR.x0), ky(CORRIDOR.y1)],
      [kx(CORRIDOR.x1), ky(CORRIDOR.y1)],
    ],
    { seed: 'a:cor2', color: 'var(--silver-dim)', w: 1.2, amp: 0.8 },
  );
  altarNiche(root, kx(ALCOVE.x), ky(ALCOVE.y) - 5, 'a:alcove', 'plan');

  // rooms
  for (const room of ROOMS) {
    if (room.id === 'gate') continue; // the gate lives on the south fold
    paintPlanRoom(root, room, fx);
  }

  // the stable court's raked drill ground beside the range
  rakeArcs(root, kx(19.4), ky(11), kx(23.2), ky(16), 'a:drill');
  txt(root, kx(21.2), ky(13.6), '稽', { size: 12, color: 'var(--silver-hi)' });
}

function paintPlanRoom(root: SVGElement, room: RoomDef, fx: EstateFixture): void {
  const ink = fx.rooms[room.id];
  const [x0k, y0k, x1k, y1k] = room.rect;
  const x0 = kx(x0k);
  const y0 = ky(y0k);
  const x1 = kx(x1k);
  const y1 = ky(y1k);
  const g = sv('g');
  const fresh = ink.fresh === true;
  // room outline — gold when this era's work, silver otherwise
  const outline: Pt[] = [
    [x0, y0],
    [x1, y0],
    [x1, y1],
    [x0, y1],
    [x0, y0],
  ];
  brushStroke(g, outline, {
    seed: `a:${room.id}:o`,
    w: fresh ? 2.6 : 2,
    color: fresh ? 'var(--gold)' : 'var(--silver)',
    wobble: 0.18,
  });
  if (room.plaster) {
    wash(
      g,
      [
        [x0, y0],
        [x1, y0],
        [x1, y1],
        [x0, y1],
      ],
      { seed: `a:${room.id}:pl`, fill: 'var(--silver-faint)', opacity: 0.3, amp: 1.4 },
    );
  }
  if (ink.state === 'closed') {
    // closed-but-kept: a light diagonal shut-hatch + the tie band — clearly
    // not floor, clearly not ruin-ink
    hatchArea(
      g,
      [
        [x0 + 2, y0 + 2],
        [x1 - 2, y0 + 2],
        [x1 - 2, y1 - 2],
        [x0 + 2, y1 - 2],
      ],
      {
        seed: `a:${room.id}:shut`,
        angle: 45,
        spacing: 8.5,
        color: 'var(--ink-faint)',
        w: 0.7,
        opacity: 0.55,
      },
    );
    inkLine(
      g,
      [
        [x0 + 2, (y0 + y1) / 2],
        [x1 - 2, (y0 + y1) / 2],
      ],
      { seed: `a:${room.id}:tie`, color: 'var(--ink-soft)', w: 1.6, amp: 1 },
    );
  } else if (room.id === 'stable') {
    stallRange(g, x0, y0, x1, y1, {
      seed: 'a:stalls',
      stalls: STALLS,
      muleAt: MULE_STALL,
      mode: 'plan',
    });
  } else if (room.id !== 'kura' && room.id !== 'woodshed' && room.id !== 'sickroom') {
    // mats belong to the living rooms; the service floors are earth & board
    tatamiPlan(g, x0, y0, x1, y1, { seed: `a:${room.id}:tat` });
  }
  if (room.id === 'kitchen') {
    boardDesk(g, x0 + (x1 - x0) * 0.62, y0 + (y1 - y0) * 0.3, 'a:board', 'plan');
    // the threshold step on the WEST face (toward the paddies)
    brushStroke(
      g,
      [
        [x0 - 3, y0 + (y1 - y0) * 0.55],
        [x0 - 3, y1 - 6],
      ],
      { seed: 'a:kstep', w: 2.2, color: 'var(--silver-dim)' },
    );
  }
  // the room's seal
  const cxp = (x0 + x1) / 2;
  const cyp = (y0 + y1) / 2;
  if (room.id === 'mainBody') {
    // H5's honesty seam made visible at the room label
    if (fx.ruinRevealed) {
      txt(g, cxp - 10, cyp - 12, '母屋', { size: 13, color: 'var(--silver-hi)', opacity: 0.75 });
      struckMark(g, [cxp - 26, cyp - 15], [cxp + 5, cyp - 17], { seed: 'a:mstrike' });
      txt(g, cxp + 22, cyp - 12, '客殿', { size: 13, color: 'var(--shu)' });
    } else {
      txt(g, cxp, cyp - 12, '母屋', { size: 14, color: 'var(--silver-hi)' });
    }
  } else if (room.id !== 'stable') {
    txt(g, cxp, cyp + 4, room.kanji, { size: 11, color: 'var(--silver-hi)', opacity: 0.95 });
  }
  if (fresh) freshStamp(g, x1 - 10, y0 + 10, { seed: `a:${room.id}:new` });
  if (ink.struck)
    struckMark(g, [x0 + 4, y1 - 6], [x0 + (x1 - x0) * 0.4, y1 - 10], { seed: `a:${room.id}:strk` });
  tip(g as unknown as SVGElement, room.en);
  root.append(g);
}

// ── the loose pieces ─────────────────────────────────────────────────────────

function pieceCaption(root: SVGElement, x: number, y: number, label: string, seed: string): void {
  txt(root, x, y, label, { size: 10, color: 'var(--ink-soft)', font: 'body' });
  // cut marks — scissors dashes around a loose piece
  inkLine(
    root,
    [
      [x - 34, y + 5],
      [x + 34, y + 5],
    ],
    { seed, color: 'var(--ink-faint)', w: 0.8, dash: '4 4', amp: 0.4 },
  );
}

/** 西面 — the kitchen's west face (the service edge toward the paddies) +
 *  Sōan's lean-to. */
function paintWestPiece(root: SVGElement, fx: EstateFixture): void {
  const ground = 640;
  const x0 = 66;
  const kw = 3 * KEN; // kitchen face width (its plan depth)
  const kitchen = ROOMS.find((r) => r.id === 'kitchen')!;
  const kfresh = fx.rooms.kitchen.fresh === true;
  wallFace(root, x0, x0 + kw, ground - kitchen.eave * KEN, ground, { seed: 'a:wk', postStep: 26 });
  roofProfile(root, x0, x0 + kw, ground - kitchen.eave * KEN, ground - kitchen.ridge * KEN, {
    seed: 'a:wkr',
    fresh: kfresh,
  });
  if (kfresh) freshStamp(root, x0 + kw - 6, ground - kitchen.ridge * KEN - 8, { seed: 'a:wknew' });
  smokeWisp(root, x0 + kw * 0.42, ground - kitchen.ridge * KEN - 2, 'a:wksmoke');
  // the lean-to beside it
  const sick = ROOMS.find((r) => r.id === 'sickroom')!;
  const sx = x0 + kw + 14;
  const sw = 2.2 * KEN;
  wallFace(root, sx, sx + sw, ground - sick.eave * KEN, ground, { seed: 'a:ws', postStep: 22 });
  roofProfile(root, sx, sx + sw, ground - sick.eave * KEN, ground - sick.ridge * KEN, {
    seed: 'a:wsr',
    leanTo: true,
  });
  txt(root, sx + sw / 2, ground - 8, '薬', { size: 9, color: 'var(--silver-hi)' });
  foldHinge(root, [x0 - 4, ground], [sx + sw + 4, ground], {
    seed: 'a:whinge',
    tabSide: 1,
    tabs: 2,
  });
  pieceCaption(root, x0 + (sw + kw + 14) / 2, ground + 30, '西面 — the west face', 'a:wcut');
}

/** 東面 — the old stable court's long face: housing for twenty, one mule. */
function paintEastPiece(root: SVGElement, _fx: EstateFixture): void {
  const ground = 640;
  const x0 = 916;
  const stable = ROOMS.find((r) => r.id === 'stable')!;
  const w = 10 * KEN;
  wallFace(root, x0, x0 + w, ground - stable.eave * KEN, ground, {
    seed: 'a:est',
    postStep: 60,
  });
  stallRange(root, x0, ground - stable.eave * KEN, x0 + w, ground, {
    seed: 'a:estalls',
    stalls: STALLS,
    muleAt: MULE_STALL,
    mode: 'elev',
  });
  roofProfile(root, x0, x0 + w, ground - stable.eave * KEN, ground - stable.ridge * KEN, {
    seed: 'a:estr',
  });
  // the rack, empty
  for (const dx of [26, 34, 42]) {
    inkLine(
      root,
      [
        [x0 + w - dx, ground - 3],
        [x0 + w - dx + 4, ground - 14],
      ],
      { seed: `a:rack${dx}`, color: 'var(--silver-dim)', w: 1.1, amp: 0.4 },
    );
  }
  foldHinge(root, [x0 - 4, ground], [x0 + w + 4, ground], {
    seed: 'a:ehinge',
    tabSide: 1,
    tabs: 2,
  });
  pieceCaption(root, x0 + w / 2, ground + 30, '東面 — the old stable court', 'a:ecut');
}

/** 御殿南面 — the winged residence's south face: one building, two wings, the
 *  joining corridor behind (E2's elevation read). */
function paintResidencePiece(root: SVGElement, fx: EstateFixture): void {
  const ground = 950;
  const px0 = 340;
  const toX = (k: number): number => px0 + (k - 3) * KEN; // piece spans plan x 3..23
  const west = ROOMS.find((r) => r.id === 'westWing')!;
  const main = ROOMS.find((r) => r.id === 'mainBody')!;
  const east = ROOMS.find((r) => r.id === 'eastWing')!;
  // main body first (behind), wings in front overlapping its ends
  for (const [room, tag] of [
    [main, 'm'],
    [west, 'w'],
    [east, 'e'],
  ] as const) {
    const ink = fx.rooms[room.id];
    const rx0 = toX(room.rect[0]);
    const rx1 = toX(room.rect[2]);
    wallFace(root, rx0, rx1, ground - room.eave * KEN, ground, {
      seed: `a:res${tag}`,
      postStep: 34,
      closed: ink.state === 'closed',
    });
    roofProfile(root, rx0, rx1, ground - room.eave * KEN, ground - room.ridge * KEN, {
      seed: `a:res${tag}r`,
      fresh: ink.fresh,
    });
    if (ink.fresh)
      freshStamp(root, rx1 - 8, ground - room.ridge * KEN - 8, { seed: `a:res${tag}n` });
    if (ink.struck)
      struckMark(
        root,
        [rx0 + 6, ground - room.eave * KEN - 2],
        [rx0 + 40, ground - room.eave * KEN - 6],
        {
          seed: `a:res${tag}s`,
        },
      );
  }
  // the engawa line along the front
  inkLine(
    root,
    [
      [toX(3.4), ground + 3],
      [toX(22.6), ground + 3],
    ],
    { seed: 'a:engawa', color: 'var(--silver-dim)', w: 1.3, amp: 0.8 },
  );
  pieceCaption(root, toX(13), ground + 32, '御殿南面 — the house, its two wings', 'a:rescut');
}
