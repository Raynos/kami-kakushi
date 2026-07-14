// map-sheets/village.ts — the T2 valley vocabulary (map-spec §6.3 D4): the new
// seeded pictograms a wide mura-ezu needs that the estate sheets never did — a
// village block, a lane, a market, temple + torii, a mill wheel, a ferry crossing,
// a quarry scar, the mountain-dogs' camp, a hill shrine. Same laws as the estate
// vocabulary: composed from brush.ts, seeded-deterministic (TST2), Andon tokens
// only, brush-alive + seed-jittered (never a stamped grid — spec L6). Buildings
// reuse built.roofMass so the whole valley reads in one hand.

import {
  brushStroke,
  fineLayer,
  inkLine,
  rng,
  stipple,
  sv,
  tip,
  wash,
} from './brush';
import { edgeNormal, resample, type Pt } from './geom';
import { roofMass, shed } from './built';

type Xf = (p: Pt) => Pt;
function frame(cx: number, cy: number, angleDeg: number): Xf {
  const a = (angleDeg * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return ([x, y]) => [cx + x * c - y * s, cy + x * s + y * c];
}
function fpts(pts: readonly Pt[], t: Xf): Pt[] {
  return pts.map(t);
}

export interface HouseClusterOpts {
  readonly seed: string;
  readonly count: number;
  readonly spread: number;
}

/** A cluster of village houses — small gabled roof pictograms scattered brush-alive
 *  around an origin (spec D1: whole compounds/houses as pictograms, not room-by-room).
 *  Sizes/angles/positions all seed-jittered so a village never reads stamped. */
export function houseCluster(
  parent: SVGElement,
  at: Pt,
  o: HouseClusterOpts,
): void {
  const r = rng(o.seed);
  const [ox, oy] = at;
  // a loose grid-ish scatter so houses face the lane but never line up perfectly
  for (let i = 0; i < o.count; i++) {
    const ang = (i / o.count) * Math.PI * 2 + r() * 1.4;
    const rad = o.spread * (0.25 + r() * 0.75);
    const x = ox + Math.cos(ang) * rad;
    const y = oy + Math.sin(ang) * rad * 0.72; // valley floor foreshortening
    const w = 30 + r() * 16;
    const h = 20 + r() * 8;
    roofMass(parent, x, y, w, h, {
      seed: `${o.seed}:h${i}`,
      angleDeg: (r() - 0.5) * 30,
      style: r() < 0.5 ? 'gable' : 'hip',
    });
  }
}

/** A village lane — a trodden pale ground stroke with a fine dash centre, the
 *  street register (wider + calmer than a work-path road). */
export function villageLane(
  parent: SVGElement,
  pts: readonly Pt[],
  o: { seed: string },
): void {
  brushStroke(parent, pts, {
    seed: `${o.seed}:u`,
    w: 14,
    color: 'var(--steel-hi)',
    opacity: 0.6,
    taperIn: 0.06,
    taperOut: 0.06,
    amp: 2,
  });
  inkLine(parent, pts, {
    seed: `${o.seed}:d`,
    w: 1,
    color: 'var(--ink-faint)',
    dash: '10 8',
    opacity: 0.7,
    amp: 2,
  });
}

/** The market square — swept open ground with rows of stall awnings (small tented
 *  ticks). Season-stocked in the fiction; here, the standing rows of a market. */
export function marketSquare(
  parent: SVGElement,
  ground: readonly Pt[],
  o: { seed: string },
): void {
  const r = rng(o.seed);
  wash(parent, ground, {
    seed: `${o.seed}:g`,
    fill: 'var(--steel-hi)',
    opacity: 0.5,
    amp: 3,
  });
  wash(parent, ground, {
    seed: `${o.seed}:g2`,
    fill: 'var(--silver-faint)',
    opacity: 0.5,
    amp: 2,
  });
  // rake/traffic arcs so it reads swept, not blank
  const fine = fineLayer(parent);
  const xs = ground.map((p) => p[0]);
  const ys = ground.map((p) => p[1]);
  const x0 = Math.min(...xs);
  const x1 = Math.max(...xs);
  const y0 = Math.min(...ys);
  const y1 = Math.max(...ys);
  // two rows of stalls — a ridge tick + two post ticks each (a market awning)
  for (let row = 0; row < 2; row++) {
    const sy = y0 + (y1 - y0) * (0.32 + row * 0.4);
    for (let sx = x0 + 16; sx < x1 - 10; sx += 26 + r() * 8) {
      const jx = sx + (r() - 0.5) * 5;
      const w = 9 + r() * 4;
      inkLine(
        parent,
        [
          [jx - w, sy],
          [jx + w, sy],
        ],
        {
          seed: `${o.seed}:aw${row}${sx.toFixed(0)}`,
          w: 1.6,
          color: 'var(--silver-dim)',
          amp: 0.6,
        },
      );
      inkLine(
        fine,
        [
          [jx - w + 1, sy],
          [jx - w + 1, sy + 6],
        ],
        {
          seed: `${o.seed}:p1${row}${sx.toFixed(0)}`,
          w: 0.8,
          color: 'var(--ink-soft)',
          amp: 0.3,
        },
      );
      inkLine(
        fine,
        [
          [jx + w - 1, sy],
          [jx + w - 1, sy + 6],
        ],
        {
          seed: `${o.seed}:p2${row}${sx.toFixed(0)}`,
          w: 0.8,
          color: 'var(--ink-soft)',
          amp: 0.3,
        },
      );
    }
  }
}

/** A torii — the shrine gate glyph: two posts, a curved kasagi lintel + a straight
 *  nuki below it. The valley's folk-faith mark. */
export function torii(
  parent: SVGElement,
  at: Pt,
  o: { seed: string; scale?: number },
): void {
  const s = o.scale ?? 1;
  const r = rng(o.seed);
  const t = frame(at[0], at[1], (r() - 0.5) * 3);
  const T: Xf = (p) => t([p[0] * s, p[1] * s]);
  // posts
  brushStroke(parent, [T([-10, 12]), T([-10, -14])], {
    seed: `${o.seed}:pL`,
    w: 2.6 * s,
    color: 'var(--shu)',
    amp: 0.5,
    taperIn: 0.04,
    taperOut: 0.04,
  });
  brushStroke(parent, [T([10, 12]), T([10, -14])], {
    seed: `${o.seed}:pR`,
    w: 2.6 * s,
    color: 'var(--shu)',
    amp: 0.5,
    taperIn: 0.04,
    taperOut: 0.04,
  });
  // kasagi — the curved top lintel, overhanging
  brushStroke(parent, [T([-16, -14]), T([0, -16]), T([16, -14])], {
    seed: `${o.seed}:k`,
    w: 3 * s,
    color: 'var(--shu)',
    amp: 0.5,
    taperIn: 0.1,
    taperOut: 0.1,
  });
  // nuki — the straight tie beam
  inkLine(parent, [T([-12, -7]), T([12, -7])], {
    seed: `${o.seed}:n`,
    w: 1.8 * s,
    color: 'var(--shu)',
    amp: 0.4,
    opacity: 0.9,
  });
}

/** The temple/shrine — a hip-roofed hall with a torii before it and a small stone
 *  or two (Ekai's, the register of the vanished). Bigger than a village house. */
export function templeGlyph(
  parent: SVGElement,
  at: Pt,
  toriiAt: Pt,
  o: { seed: string },
): void {
  torii(parent, toriiAt, { seed: `${o.seed}:torii`, scale: 1.1 });
  roofMass(parent, at[0], at[1], 56, 40, {
    seed: `${o.seed}:hall`,
    style: 'hip',
  });
  // a small subsidiary hall / gate behind
  roofMass(parent, at[0] + 34, at[1] - 30, 30, 22, {
    seed: `${o.seed}:sub`,
    style: 'gable',
    angleDeg: 8,
  });
  // approach stones from the torii to the hall
  const fine = fineLayer(parent);
  for (let i = 0; i < 5; i++) {
    const tt = i / 4;
    const px = toriiAt[0] + (at[0] - toriiAt[0]) * tt;
    const py = toriiAt[1] + (at[1] - toriiAt[1]) * tt;
    fine.append(
      sv('circle', {
        cx: px.toFixed(1),
        cy: py.toFixed(1),
        r: '1.4',
        fill: 'var(--silver-dim)',
        opacity: '0.75',
      }),
    );
  }
  tip(
    parent.appendChild(sv('g')),
    'Ekai keeps the register of the vanished here',
  );
}

/** The mill — a small building on a race off the river, with a waterwheel: a ring
 *  of paddle ticks on the water side. */
export function millWheel(
  parent: SVGElement,
  at: Pt,
  race: readonly Pt[],
  o: { seed: string },
): void {
  // the race — a fine double channel line drawn from river to wheel
  inkLine(parent, race, {
    seed: `${o.seed}:race`,
    w: 1.4,
    color: 'var(--silver-dim)',
    amp: 1,
  });
  shed(parent, at[0], at[1], { seed: `${o.seed}:house`, scale: 1.1 });
  // the wheel — a circle with radial paddle ticks, on the river (west) side
  const wx = at[0] - 22;
  const wy = at[1] + 8;
  const rad = 13;
  parent.append(
    sv('circle', {
      cx: wx.toFixed(1),
      cy: wy.toFixed(1),
      r: String(rad),
      fill: 'none',
      stroke: 'var(--silver)',
      'stroke-width': '1.6',
    }),
  );
  parent.append(
    sv('circle', {
      cx: wx.toFixed(1),
      cy: wy.toFixed(1),
      r: String(rad - 4),
      fill: 'none',
      stroke: 'var(--ink-soft)',
      'stroke-width': '0.9',
      opacity: '0.8',
    }),
  );
  const r = rng(o.seed);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + r() * 0.2;
    inkLine(
      parent,
      [
        [wx + Math.cos(a) * (rad - 4), wy + Math.sin(a) * (rad - 4)],
        [wx + Math.cos(a) * rad, wy + Math.sin(a) * rad],
      ],
      { seed: `${o.seed}:pad${i}`, w: 1, color: 'var(--silver-dim)', amp: 0.2 },
    );
  }
}

/** The ferry — two landing stubs on opposite banks + a rope line across + a small
 *  boat glyph (Funakichi's; where no bridge reaches). */
export function ferryLanding(
  parent: SVGElement,
  east: Pt,
  west: Pt,
  o: { seed: string },
): void {
  // landing planks on each bank
  for (const [bx, by, tag] of [
    [east[0], east[1], 'E'],
    [west[0], west[1], 'W'],
  ] as const) {
    inkLine(
      parent,
      [
        [bx - 8, by - 4],
        [bx + 8, by - 2],
        [bx + 8, by + 5],
        [bx - 8, by + 3],
      ],
      {
        seed: `${o.seed}:land${tag}`,
        w: 1.4,
        color: 'var(--silver-dim)',
        amp: 0.5,
      },
    );
  }
  // the rope across
  inkLine(
    parent,
    [east, [(east[0] + west[0]) / 2, (east[1] + west[1]) / 2 + 4], west],
    {
      seed: `${o.seed}:rope`,
      w: 0.9,
      color: 'var(--ink-soft)',
      dash: '3 4',
      opacity: 0.85,
      amp: 1,
    },
  );
  // the boat — a slim hull glyph mid-river
  const mx = (east[0] + west[0]) / 2;
  const my = (east[1] + west[1]) / 2 + 3;
  const t = frame(mx, my, 8);
  wash(
    parent,
    fpts(
      [
        [-11, -3.5],
        [11, -2.5],
        [9, 3],
        [-9, 2.5],
      ],
      t,
    ),
    { seed: `${o.seed}:hull`, fill: 'var(--steel-0)', amp: 0.5 },
  );
  inkLine(parent, [t([-11, -3.5]), t([11, -2.5])], {
    seed: `${o.seed}:gun`,
    w: 1,
    color: 'var(--silver-dim)',
    amp: 0.3,
  });
}

/** The old quarry — a stepped dressed-stone scar (benched cuts + squared blocks +
 *  spoil), the cuts MATCHING the ruin's robbed footings (spec: the village took
 *  the main house apart here). */
export function quarryScar(
  parent: SVGElement,
  poly: readonly Pt[],
  o: { seed: string },
): void {
  const r = rng(o.seed);
  // the cut face — a pale exposed-rock wash
  wash(parent, poly, {
    seed: `${o.seed}:face`,
    fill: 'var(--steel-hi)',
    opacity: 0.4,
    amp: 3,
  });
  // benched cut lines — the straight-edged steps a quarry leaves (deliberately
  // un-scrawled: the squareness is the wrong thing that ties it to the ruin)
  const xs = poly.map((p) => p[0]);
  const ys = poly.map((p) => p[1]);
  const x0 = Math.min(...xs);
  const x1 = Math.max(...xs);
  const y0 = Math.min(...ys);
  const y1 = Math.max(...ys);
  for (let i = 1; i <= 3; i++) {
    const yy = y0 + ((y1 - y0) * i) / 4;
    inkLine(
      parent,
      [
        [x0 + 12, yy],
        [x1 - 12, yy + (r() - 0.5) * 4],
      ],
      {
        seed: `${o.seed}:bench${i}`,
        w: 1.3,
        color: 'var(--silver-dim)',
        amp: 0.4,
        opacity: 0.9,
      },
    );
  }
  // squared blocks cut and stacked at the foot
  for (let i = 0; i < 6; i++) {
    const bx = x0 + 14 + r() * (x1 - x0 - 28);
    const by = y1 - 8 - r() * 20;
    const t = frame(bx, by, (r() - 0.5) * 16);
    const w = 6 + r() * 4;
    const h = 4 + r() * 2;
    parent.append(
      sv('path', {
        d: `M${fpts(
          [
            [-w, -h],
            [w, -h],
            [w, h],
            [-w, h],
          ],
          t,
        )
          .map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`)
          .join(' L')} Z`,
        fill: 'none',
        stroke: 'var(--ink-soft)',
        'stroke-width': '1',
        opacity: '0.85',
      }),
    );
  }
  // spoil scatter
  stipple(parent, poly, {
    seed: `${o.seed}:spoil`,
    step: 12,
    prob: 0.35,
    r: 1.1,
    color: 'var(--ink-faint)',
    opacity: 0.7,
  });
}

/** The mountain-dogs' camp — a rough palisade ring of stakes, a couple of lean
 *  tents, and a campfire (sticks + a shu ember). Up a side draw, off the floor. */
export function banditCamp(
  parent: SVGElement,
  at: Pt,
  o: { seed: string },
): void {
  const r = rng(o.seed);
  const [cx, cy] = at;
  // palisade — a ring of leaning stake ticks
  const rad = 46;
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const px = cx + Math.cos(a) * rad;
    const py = cy + Math.sin(a) * rad * 0.8;
    inkLine(
      parent,
      [
        [px, py + 6],
        [px + (r() - 0.5) * 4, py - 6 - r() * 3],
      ],
      { seed: `${o.seed}:stk${i}`, w: 1.4, color: 'var(--ink-soft)', amp: 0.4 },
    );
  }
  // two lean tents
  for (const [dx, dy] of [
    [-14, -6],
    [12, 8],
  ] as const) {
    const t = frame(cx + dx, cy + dy, (r() - 0.5) * 12);
    wash(
      parent,
      fpts(
        [
          [-12, 6],
          [0, -8],
          [12, 6],
        ],
        t,
      ),
      {
        seed: `${o.seed}:tent${dx}`,
        fill: 'var(--steel-2)',
        amp: 0.6,
      },
    );
    inkLine(parent, [t([-12, 6]), t([0, -8]), t([12, 6])], {
      seed: `${o.seed}:tentl${dx}`,
      w: 1.2,
      color: 'var(--silver-dim)',
      amp: 0.4,
    });
  }
  // the campfire — crossed sticks + a shu ember
  inkLine(
    parent,
    [
      [cx - 6, cy + 4],
      [cx + 6, cy - 2],
    ],
    {
      seed: `${o.seed}:f1`,
      w: 1.2,
      color: 'var(--ink-soft)',
      amp: 0.3,
    },
  );
  inkLine(
    parent,
    [
      [cx + 6, cy + 4],
      [cx - 6, cy - 2],
    ],
    {
      seed: `${o.seed}:f2`,
      w: 1.2,
      color: 'var(--ink-soft)',
      amp: 0.3,
    },
  );
  parent.append(
    sv('circle', {
      cx: String(cx),
      cy: String(cy + 1),
      r: '2.2',
      fill: 'var(--shu)',
      opacity: '0.9',
    }),
  );
}

/** A hill shrine — a tiny torii + a stone; the flank folk-faith scatter. */
export function hillShrine(
  parent: SVGElement,
  at: Pt,
  o: { seed: string },
): void {
  torii(parent, [at[0], at[1] - 2], { seed: `${o.seed}:t`, scale: 0.55 });
  parent.append(
    sv('circle', {
      cx: String(at[0] + 9),
      cy: String(at[1] + 4),
      r: '2.2',
      fill: 'var(--steel-2)',
      stroke: 'var(--silver-dim)',
      'stroke-width': '1',
    }),
  );
}

/** A drawn contour/scarp hachure band along a flank ridgeline — reuses the road
 *  idiom for a valley-wall shoulder so the flanks read as rising ground. */
export function flankShoulder(
  parent: SVGElement,
  pts: readonly Pt[],
  o: { seed: string },
): void {
  const line = resample(pts, 60);
  inkLine(parent, line, {
    seed: `${o.seed}:r`,
    w: 1.6,
    color: 'var(--ink-soft)',
    amp: 3,
    opacity: 0.8,
  });
  // downslope hachure ticks toward the valley floor (interior side)
  for (let i = 1; i < line.length - 1; i++) {
    const a = line[i - 1]!;
    const b = line[i + 1]!;
    const [nx, ny] = edgeNormal(a, b);
    const p = line[i]!;
    // point ticks toward valley centre (x ~1600)
    const dir = p[0] < 1600 ? 1 : -1;
    inkLine(
      parent,
      [
        [p[0], p[1]],
        [p[0] + nx * 10 * dir, p[1] + ny * 10 * dir],
      ],
      {
        seed: `${o.seed}:h${i}`,
        w: 0.8,
        color: 'var(--ink-faint)',
        amp: 0.5,
        opacity: 0.6,
      },
    );
  }
}
