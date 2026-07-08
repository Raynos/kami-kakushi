// estate-sheet/sheet-b.ts — VARIANT B · the flat section-cut: one long
// south-facing section-elevation — the house cut open like a dollhouse,
// rooms in a row (cut members hatched, the period cut-plane convention),
// roof profiles above, yards and gate as a faint foreground strip, and the
// ruin's elevation rising BEHIND at the same ken scale (H4). Reads at a
// glance; the more pictorial document. Same house.ts geometry, same fixture
// ink states (H5) as variant A — the two sheets cannot disagree.

import { brushStroke, inkLine, rng, sv, tip, wash } from '../map-sheets/brush';
import {
  altarNiche,
  boardDesk,
  cartouche,
  freshStamp,
  hatchArea,
  kenBar,
  legendBox,
  roofProfile,
  ruinBackdrop,
  smokeWisp,
  stallRange,
  struckMark,
  txt,
  wallFace,
} from './elevation';
import { ROOMS, RUIN, STALLS } from './house';
import type { RoomDef, RoomId } from './house';
import type { EstateFixture } from './fixture';

export const SHEET_B_W = 1240;
export const SHEET_B_H = 640;

const KEN = 30;
/** plan-x (ken) → sheet x */
const bx = (k: number): number => 60 + (k + 2) * KEN;

const GY = 520; // the cut row's ground line
const BGY = 484; // the background row's ground line (behind, higher)
const RUIN_GY = 430; // the ruin's own ground — clear of the lived ridgeline,
// so its rubble and grass never read as damage ON a lived roof

function room(id: RoomId): RoomDef {
  return ROOMS.find((r) => r.id === id)!;
}

/** Paint variant B into a root group. */
export function paintSheetB(root: SVGElement, fx: EstateFixture): void {
  // ── the paper ──
  wash(
    root,
    [
      [8, 8],
      [SHEET_B_W - 8, 8],
      [SHEET_B_W - 8, SHEET_B_H - 8],
      [8, SHEET_B_H - 8],
    ],
    { seed: 'b:paper', fill: 'var(--steel-1)', opacity: 0.7, amp: 3 },
  );

  // ── the ruin, rising behind everything (H4) ──
  ruinBackdrop(root, RUIN_GY, {
    seed: 'b:ruin',
    ken: KEN,
    toX: bx,
    revealed: fx.ruinRevealed,
    masses: RUIN,
  });
  if (fx.ruinRevealed) {
    txt(root, bx(13.5), RUIN_GY - 6.9 * KEN - 12, '本邸', { size: 22, color: 'var(--silver-hi)' });
    txt(root, bx(16), RUIN_GY - 6.9 * KEN - 10, '改', { size: 11, color: 'var(--shu)' });
  } else {
    txt(root, bx(13.5), RUIN_GY - 6.9 * KEN - 12, '廃', {
      size: 14,
      color: 'var(--silver-faint)',
      opacity: 0.9,
    });
  }

  // ── the background row: what stands north of the cut (faint — depth) ──
  const back = sv('g', { opacity: '0.6' });
  for (const id of ['tokuRoom', 'shoin', 'kura'] as const) {
    const rm = room(id);
    const ink = fx.rooms[id];
    const x0 = bx(rm.rect[0]);
    const x1 = bx(rm.rect[2]);
    wallFace(back, x0, x1, BGY - rm.eave * KEN, BGY, {
      seed: `b:bg:${id}`,
      postStep: 30,
      plaster: rm.plaster,
      closed: ink.state === 'closed',
    });
    roofProfile(back, x0, x1, BGY - rm.eave * KEN, BGY - rm.ridge * KEN, {
      seed: `b:bg:${id}:r`,
      fresh: ink.fresh,
    });
    txt(back, (x0 + x1) / 2, BGY - rm.ridge * KEN - 7, rm.kanji, {
      size: 10,
      color: 'var(--silver-hi)',
    });
    if (ink.fresh) freshStamp(back, x1 - 8, BGY - rm.ridge * KEN - 10, { seed: `b:bg:${id}:n` });
  }
  root.append(back);

  // ── the cut row: the house opened along the corridor line ──
  cutRoom(root, room('westWing'), fx);
  cutRoom(root, room('mainBody'), fx);
  cutRoom(root, room('eastWing'), fx);
  cutRoom(root, room('stable'), fx);

  // ── the foreground strip: yards, gate, well — what stands south of the cut ──
  paintForeground(root, fx);

  // ── furniture ──
  cartouche(root, 1146, 36, { seed: 'b:cart', revealed: fx.ruinRevealed });
  txt(root, 1136, 200, fx.label, {
    size: 10,
    color: 'var(--ink-soft)',
    vertical: true,
    anchor: 'start',
  });
  kenBar(root, 70, 600, { seed: 'b:ken', ken: KEN });
  legendBox(root, 1108, 556, { seed: 'b:leg' });
  root.append(
    sv('rect', {
      x: '2',
      y: '2',
      width: String(SHEET_B_W - 4),
      height: String(SHEET_B_H - 4),
      fill: 'none',
      stroke: 'var(--silver-faint)',
    }),
  );
}

// ── the cut convention ───────────────────────────────────────────────────────

/** A cut structural member — the honest grey of the section plane (E6). */
function cutPost(root: SVGElement, x: number, topY: number, seed: string): void {
  const poly: [number, number][] = [
    [x - 3.2, topY],
    [x + 3.2, topY],
    [x + 3.2, GY],
    [x - 3.2, GY],
  ];
  wash(root, poly, { seed: `${seed}:w`, fill: 'var(--steel-hi)', opacity: 0.2, amp: 0.6 });
  hatchArea(root, poly, {
    seed: `${seed}:h`,
    angle: 46,
    spacing: 4.5,
    color: 'var(--silver-faint)',
    w: 0.8,
  });
  inkLine(
    root,
    [
      [x - 3.2, topY],
      [x - 3.2, GY],
    ],
    { seed: `${seed}:l`, color: 'var(--silver)', w: 1.4, amp: 0.5 },
  );
  inkLine(
    root,
    [
      [x + 3.2, topY],
      [x + 3.2, GY],
    ],
    { seed: `${seed}:r`, color: 'var(--silver)', w: 1.4, amp: 0.5 },
  );
}

function cutRoom(root: SVGElement, rm: RoomDef, fx: EstateFixture): void {
  const ink = fx.rooms[rm.id];
  const x0 = bx(rm.rect[0]);
  const x1 = bx(rm.rect[2]);
  const eaveY = GY - rm.eave * KEN;
  const g = sv('g');
  // the interior, seen into: dark when closed, breathing when open
  wash(
    g,
    [
      [x0, eaveY],
      [x1, eaveY],
      [x1, GY],
      [x0, GY],
    ],
    {
      seed: `b:${rm.id}:in`,
      fill: 'var(--steel-0)',
      opacity: ink.state === 'closed' ? 0.5 : 0.14,
      amp: 1.2,
    },
  );
  if (ink.state === 'closed') {
    // the far wall's shutters, glimpsed in the dark — kept, not lost
    const rr = rng(`b:${rm.id}:sh`);
    for (let x = x0 + 8; x < x1 - 6; x += 9 + rr() * 3) {
      inkLine(
        g,
        [
          [x, eaveY + 6],
          [x, GY - 4],
        ],
        {
          seed: `b:${rm.id}:s${Math.round(x)}`,
          color: 'var(--ink-faint)',
          w: 0.9,
          opacity: 0.55,
          amp: 0.4,
        },
      );
    }
    inkLine(
      g,
      [
        [x0 + 5, (eaveY + GY) / 2],
        [x1 - 5, (eaveY + GY) / 2],
      ],
      { seed: `b:${rm.id}:tie`, color: 'var(--ink-soft)', w: 1.6, opacity: 0.8, amp: 1 },
    );
  } else if (rm.id === 'stable') {
    stallRange(g, x0, eaveY, x1, GY, {
      seed: 'b:stalls',
      stalls: Math.max(4, Math.round(STALLS * ((rm.rect[2] - rm.rect[0]) / 10))),
      muleAt: 1,
      mode: 'elev',
    });
  } else {
    // tatami floor ticks + a breathing interior
    const rr = rng(`b:${rm.id}:tat`);
    for (let x = x0 + 10; x < x1 - 8; x += 13 + rr() * 3) {
      inkLine(
        g,
        [
          [x, GY - 2.5],
          [x + 6, GY - 2.5],
        ],
        {
          seed: `b:${rm.id}:t${Math.round(x)}`,
          color: 'var(--ink-faint)',
          w: 0.8,
          opacity: 0.7,
          amp: 0.3,
        },
      );
    }
  }
  if (rm.id === 'mainBody') {
    // the corridor's far wall carries the alcove — worship in a hallway (H3)
    altarNiche(g, bx(16.2), GY - 8, 'b:alcove', 'elev');
    txt(g, bx(10.4), GY - 9, '廊下', { size: 8.5, color: 'var(--ink-faint)', font: 'body' });
  }
  // the floor / ground beam
  brushStroke(
    g,
    [
      [x0 - 2, GY],
      [x1 + 2, GY],
    ],
    { seed: `b:${rm.id}:fl`, w: 2.4, color: 'var(--silver-dim)' },
  );
  // cut members at the section plane
  cutPost(g, x0, eaveY, `b:${rm.id}:cpL`);
  cutPost(g, x1, eaveY, `b:${rm.id}:cpR`);
  // the roof
  roofProfile(g, x0, x1, eaveY, GY - rm.ridge * KEN, { seed: `b:${rm.id}:r`, fresh: ink.fresh });
  // seal + reviser marks
  const cxp = (x0 + x1) / 2;
  if (rm.id === 'mainBody') {
    if (fx.ruinRevealed) {
      txt(g, cxp - 12, GY - rm.ridge * KEN - 8, '母屋', {
        size: 12,
        color: 'var(--silver-hi)',
        opacity: 0.75,
      });
      struckMark(g, [cxp - 28, GY - rm.ridge * KEN - 11], [cxp + 4, GY - rm.ridge * KEN - 13], {
        seed: 'b:mstrike',
      });
      txt(g, cxp + 22, GY - rm.ridge * KEN - 8, '客殿', { size: 12, color: 'var(--shu)' });
    } else {
      txt(g, cxp, GY - rm.ridge * KEN - 8, '母屋', { size: 13, color: 'var(--silver-hi)' });
    }
  } else {
    txt(g, cxp, GY - rm.ridge * KEN - 7, rm.kanji, { size: 11, color: 'var(--silver-hi)' });
  }
  if (ink.fresh) freshStamp(g, x1 - 10, eaveY - 12, { seed: `b:${rm.id}:new` });
  if (ink.struck)
    struckMark(g, [x0 + 8, eaveY - 3], [x0 + 46, eaveY - 7], { seed: `b:${rm.id}:struck` });
  tip(g as unknown as SVGElement, rm.en);
  root.append(g);
}

// ── the foreground strip ─────────────────────────────────────────────────────

function paintForeground(root: SVGElement, fx: EstateFixture): void {
  const g = sv('g');
  // the swept forecourt band
  wash(
    g,
    [
      [bx(5.5), GY + 22],
      [bx(21.5), GY + 22],
      [bx(21.5), GY + 62],
      [bx(5.5), GY + 62],
    ],
    { seed: 'b:court', fill: 'var(--steel-hi)', opacity: 0.12, amp: 2 },
  );
  // the kitchen, standing in front of the west wing (its true ground)
  const kitchen = room('kitchen');
  const kink = fx.rooms.kitchen;
  const kg = sv('g', { opacity: '0.85' });
  const kx0 = bx(kitchen.rect[0]);
  const kx1 = bx(kitchen.rect[2]);
  // seated a step lower than the wing behind it, so its gold can't be
  // mis-attributed to the west wing (blind-pass iter-2)
  const kGround = GY + 42;
  wallFace(kg, kx0, kx1, kGround - kitchen.eave * KEN, kGround, { seed: 'b:kit', postStep: 26 });
  roofProfile(kg, kx0, kx1, kGround - kitchen.eave * KEN, kGround - kitchen.ridge * KEN, {
    seed: 'b:kitr',
    fresh: kink.fresh,
  });
  boardDesk(kg, kx0 + (kx1 - kx0) * 0.6, kGround - 12, 'b:board', 'elev');
  smokeWisp(kg, kx0 + (kx1 - kx0) * 0.35, kGround - kitchen.ridge * KEN - 2, 'b:smoke');
  txt(kg, (kx0 + kx1) / 2, kGround + 12, '竈', { size: 10, color: 'var(--silver-hi)' });
  if (kink.fresh) freshStamp(kg, kx1 - 8, kGround - kitchen.ridge * KEN - 10, { seed: 'b:kitn' });
  g.append(kg);
  // Sōan's lean-to + the woodshed, small at the west end
  const sick = room('sickroom');
  const sg = sv('g', { opacity: '0.8' });
  const sx0 = bx(0.4);
  const sx1 = bx(2.6);
  wallFace(sg, sx0, sx1, GY + 30 - sick.eave * KEN, GY + 30, { seed: 'b:sick', postStep: 20 });
  roofProfile(sg, sx0, sx1, GY + 30 - sick.eave * KEN, GY + 30 - sick.ridge * KEN, {
    seed: 'b:sickr',
    leanTo: true,
  });
  txt(sg, (sx0 + sx1) / 2, GY + 42, '薬', { size: 9, color: 'var(--silver-hi)' });
  g.append(sg);
  const shed = room('woodshed');
  const wg = sv('g', { opacity: '0.8' });
  const wx0 = bx(2.9);
  const wx1 = bx(4.6);
  wallFace(wg, wx0, wx1, GY + 52 - shed.eave * KEN, GY + 52, { seed: 'b:shed', postStep: 18 });
  roofProfile(wg, wx0, wx1, GY + 52 - shed.eave * KEN, GY + 52 - shed.ridge * KEN, {
    seed: 'b:shedr',
  });
  txt(wg, (wx0 + wx1) / 2, GY + 63, '薪', { size: 9, color: 'var(--silver-hi)' });
  g.append(wg);
  // the well — posts, beam, the hanging bucket
  const wx = bx(17.6);
  const wy = GY + 46;
  for (const dx of [-7, 7]) {
    inkLine(
      g,
      [
        [wx + dx, wy],
        [wx + dx, wy - 16],
      ],
      { seed: `b:wellp${dx}`, color: 'var(--silver-dim)', w: 1.4, amp: 0.4 },
    );
  }
  inkLine(
    g,
    [
      [wx - 10, wy - 16],
      [wx + 10, wy - 16],
    ],
    { seed: 'b:wellb', color: 'var(--silver-dim)', w: 1.4, amp: 0.4 },
  );
  inkLine(
    g,
    [
      [wx, wy - 16],
      [wx, wy - 6],
    ],
    { seed: 'b:wellr', color: 'var(--ink-faint)', w: 0.9, amp: 0.3 },
  );
  inkLine(
    g,
    [
      [wx - 4, wy],
      [wx + 4, wy],
      [wx + 3, wy + 3],
      [wx - 3, wy + 3],
      [wx - 4, wy],
    ],
    { seed: 'b:wellring', color: 'var(--silver-dim)', w: 1.2, amp: 0.4 },
  );
  // the gate — the one formal way in, front and centre-south
  const gate = room('gate');
  const gg = sv('g', { opacity: '0.9' });
  const gx0 = bx(11);
  const gx1 = bx(15);
  const gGround = GY + 60;
  wallFace(gg, bx(8.6), gx0, gGround - 1.1 * KEN, gGround, { seed: 'b:gwallW', postStep: 30 });
  wallFace(gg, gx1, bx(17.4), gGround - 1.1 * KEN, gGround, { seed: 'b:gwallE', postStep: 30 });
  wallFace(gg, gx0, gx1, gGround - gate.eave * KEN, gGround, { seed: 'b:gate', postStep: 22 });
  roofProfile(gg, gx0, gx1, gGround - gate.eave * KEN, gGround - gate.ridge * KEN, {
    seed: 'b:gater',
  });
  brushStroke(
    gg,
    [
      [gx0 + 10, gGround],
      [gx1 - 10, gGround],
    ],
    { seed: 'b:thresh', w: 2.4, color: 'var(--silver-dim)', dry: true },
  );
  txt(gg, (gx0 + gx1) / 2, gGround + 13, '門', { size: 10, color: 'var(--silver-hi)' });
  g.append(gg);
  tip(g as unknown as SVGElement, 'the yards — forecourt, well, and the one formal gate');
  root.append(g);
}
