// map-sheets/built.ts — BUILDINGS, WALLS & RUIN for the T0/T1 survey sheets (spec
// L3 + L4). Buildings are ink pictograms in the ezu manner: filled roof masses with
// a lit plane, a shadow plane, a heavy tapered ridge, a shadow-side eave stroke and
// rafter ticks — never wireframes. Ruin is DEPICTED: broken dry-brush wall runs,
// robbed footings as stone dots, collapsed roof planes, rubble stipple, grass
// breaching the floors. Everything composes from brush.ts, is seeded-deterministic,
// and stays on the Andon Steel tokens (silver = survey ink · gold = built/worked
// structure · steel = paper and shadow).

import {
  sv,
  rng,
  inkLine,
  brushStroke,
  wash,
  stipple,
  resample,
  offsetPolyline,
  bbox,
  pointInPoly,
  type Pt,
} from './brush';

// ── local-frame helpers ──────────────────────────────────────────────────────

type Xf = (p: Pt) => Pt;

/** Rotate-then-translate local pictogram coords into world coords. */
function frame(cx: number, cy: number, angleDeg: number): Xf {
  const a = (angleDeg * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return ([x, y]) => [cx + x * c - y * s, cy + x * s + y * c];
}

function fpts(pts: readonly Pt[], t: Xf): Pt[] {
  return pts.map(t);
}

/** A short bowed ink tick (rafter ends, posts, steps) — low scrawl amp so it stays crisp. */
function tick(
  parent: SVGElement,
  a: Pt,
  b: Pt,
  seed: string,
  w: number,
  color: string,
  op = 1,
): void {
  inkLine(parent, [a, b], { seed, w, color, amp: 0.4, opacity: op });
}

/** A small grass tuft — a fan of 3–5 flick strokes breaching a floor or threshold. */
function tuft(parent: SVGElement, x: number, y: number, seed: string, s = 1): void {
  const r = rng(seed);
  const n = 3 + Math.floor(r() * 3);
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i / Math.max(1, n - 1) - 0.5) * (1.15 + r() * 0.5);
    const len = (3.5 + r() * 4) * s;
    const tipX = x + Math.cos(a) * len;
    const tipY = y + Math.sin(a) * len;
    inkLine(
      parent,
      [
        [x, y],
        [(x + tipX) / 2 + (r() - 0.5) * 1.6, (y + tipY) / 2 + 0.8],
        [tipX, tipY],
      ],
      {
        seed: `${seed}b${i}`,
        w: 0.8,
        color: 'var(--ink-soft)',
        amp: 0.4,
        opacity: 0.9,
      },
    );
  }
}

/** A small squared (dressed) stone — outline + an occasional face hairline. */
function squaredStone(
  parent: SVGElement,
  x: number,
  y: number,
  w: number,
  h: number,
  angleDeg: number,
  seed: string,
): void {
  const r = rng(seed);
  const t = frame(x, y, angleDeg);
  const hw = w / 2;
  const hh = h / 2;
  const c = fpts(
    [
      [-hw, -hh],
      [hw, -hh],
      [hw, hh],
      [-hw, hh],
      [-hw, -hh],
    ],
    t,
  );
  inkLine(parent, c, { seed: `${seed}o`, w: 1.1, color: 'var(--ink-soft)', amp: 0.5 });
  if (r() < 0.55) {
    inkLine(
      parent,
      fpts(
        [
          [-hw * 0.5, -hh],
          [hw * 0.3, hh],
        ],
        t,
      ),
      {
        seed: `${seed}f`,
        w: 0.8,
        color: 'var(--ink-faint)',
        amp: 0.3,
        opacity: 0.9,
      },
    );
  }
}

// ── roofs ────────────────────────────────────────────────────────────────────

/** A roof mass — the basic building pictogram of the sheet (spec L3). Period ezu
 *  drew buildings as solid roof forms, not floor plans: a lit north plane
 *  (steel-hi) and a shadowed south plane (steel-0) meet at a heavy tapered silver
 *  ridge; the shadow-side eave carries a working-weight stroke, the lit eave a
 *  hairline, and rafter ticks mark the eave edge. Hip roofs pull the ridge short
 *  of the ends; gables run it eave to eave. */
export function roofMass(
  parent: SVGElement,
  cx: number,
  cy: number,
  w: number,
  h: number,
  o: { seed: string; angleDeg?: number; style?: 'hip' | 'gable'; tone?: string },
): void {
  const r = rng(o.seed);
  const ang = (o.angleDeg ?? 0) + (r() - 0.5) * 2.2;
  const t = frame(cx, cy, ang);
  const hw = w / 2;
  const hh = h / 2;
  const style = o.style ?? 'hip';
  const tone = o.tone ?? 'var(--steel-2)';
  const amp = Math.min(2, 0.7 + w * 0.01);
  const corners: Pt[] = [
    [-hw, -hh],
    [hw, -hh],
    [hw, hh],
    [-hw, hh],
  ];

  // eave-overhang halo — a mid-tone rim of roof just proud of the two planes
  wash(parent, fpts(corners, t), { seed: `${o.seed}:face`, fill: tone, amp: amp * 1.2 });

  // seat shadow — the mass sits ON the ground, never floats
  inkLine(
    parent,
    fpts(
      [
        [-hw + 2, hh + 2.6],
        [0, hh + 3.2],
        [hw + 1, hh + 2.8],
      ],
      t,
    ),
    {
      seed: `${o.seed}:seat`,
      w: 2.6,
      color: 'var(--steel-0)',
      amp: 0.8,
    },
  );

  const inset = style === 'hip' ? Math.min(hh * 0.95, w * 0.3) : 0;
  const ra: Pt = [-hw + inset, 0];
  const rb: Pt = [hw - inset, 0];
  const inn = 1.5; // planes sit just inside the eave halo
  const lit: Pt[] = [
    [-hw + inn, -hh + inn],
    [hw - inn, -hh + inn],
    [rb[0], -0.5],
    [ra[0], -0.5],
  ];
  wash(parent, fpts(lit, t), { seed: `${o.seed}:lit`, fill: 'var(--steel-hi)', amp: amp * 0.7 });
  // the lamplit glaze — silver-faint lifts the north plane clear of the ground
  wash(parent, fpts(lit, t), {
    seed: `${o.seed}:litg`,
    fill: 'var(--silver-faint)',
    amp: amp * 0.7,
  });
  wash(
    parent,
    fpts(
      [
        [ra[0], 0.5],
        [rb[0], 0.5],
        [hw - inn, hh - inn],
        [-hw + inn, hh - inn],
      ],
      t,
    ),
    {
      seed: `${o.seed}:shad`,
      fill: 'var(--steel-0)',
      amp: amp * 0.7,
      opacity: 0.5,
    },
  );

  // shingle courses — fine texture so a large roof never reads flat
  if (w >= 76) {
    const courses = Math.min(3, Math.max(2, Math.floor(h / 30)));
    for (let i = 1; i <= courses; i++) {
      const f = i / (courses + 1);
      const yN = -f * hh;
      const yS = f * hh;
      const insN = style === 'hip' ? inset * (1 - f) : 0;
      if (r() > 0.25) {
        const sh = r() * w * 0.1;
        inkLine(
          parent,
          fpts(
            [
              [-hw + insN + 4 + sh, yN],
              [hw - insN - 4 - r() * w * 0.08, yN],
            ],
            t,
          ),
          {
            seed: `${o.seed}:cN${i}`,
            w: 0.7,
            color: 'var(--ink-faint)',
            amp: 1.2,
            opacity: 0.7,
          },
        );
      }
      if (r() > 0.35) {
        inkLine(
          parent,
          fpts(
            [
              [-hw + insN + 4 + r() * w * 0.08, yS],
              [hw - insN - 4 - r() * w * 0.1, yS],
            ],
            t,
          ),
          {
            seed: `${o.seed}:cS${i}`,
            w: 0.7,
            color: 'var(--ink-faint)',
            amp: 1.2,
            opacity: 0.6,
          },
        );
      }
    }
  }

  // plane-break lines: hips to the corners, or heavier gable ends
  if (style === 'hip') {
    const hipW = Math.min(1.4, 0.9 + w * 0.004);
    inkLine(parent, fpts([ra, [-hw, -hh]], t), {
      seed: `${o.seed}:h1`,
      w: hipW,
      color: 'var(--ink-soft)',
      amp: 0.7,
    });
    inkLine(parent, fpts([ra, [-hw, hh]], t), {
      seed: `${o.seed}:h2`,
      w: hipW,
      color: 'var(--ink-soft)',
      amp: 0.7,
    });
    inkLine(parent, fpts([rb, [hw, -hh]], t), {
      seed: `${o.seed}:h3`,
      w: hipW,
      color: 'var(--ink-soft)',
      amp: 0.7,
    });
    inkLine(parent, fpts([rb, [hw, hh]], t), {
      seed: `${o.seed}:h4`,
      w: hipW,
      color: 'var(--ink-soft)',
      amp: 0.7,
    });
  } else {
    inkLine(
      parent,
      fpts(
        [
          [-hw, -hh],
          [-hw, hh],
        ],
        t,
      ),
      { seed: `${o.seed}:g1`, w: 1.7, color: 'var(--ink-soft)', amp: 0.6 },
    );
    inkLine(
      parent,
      fpts(
        [
          [hw, -hh],
          [hw, hh],
        ],
        t,
      ),
      { seed: `${o.seed}:g2`, w: 1.7, color: 'var(--ink-soft)', amp: 0.6 },
    );
  }

  // eaves: lit hairline north, working-weight shadow stroke south
  inkLine(
    parent,
    fpts(
      [
        [-hw, -hh],
        [hw, -hh],
      ],
      t,
    ),
    { seed: `${o.seed}:eN`, w: 0.8, color: 'var(--silver-wire)', amp: 0.7 },
  );
  brushStroke(
    parent,
    fpts(
      [
        [-hw - 1, hh],
        [0, hh],
        [hw + 1, hh],
      ],
      t,
    ),
    {
      seed: `${o.seed}:eS`,
      w: Math.min(2.4, 1.5 + w * 0.006),
      color: 'var(--silver-dim)',
      amp: 0.9,
      taperIn: 0.08,
      taperOut: 0.1,
    },
  );

  // THE ridge — the structural stroke; dry breakup on long runs. Width follows the
  // roof's own scale so a small outbuilding never wears a great hall's ridge.
  const over = Math.min(3, w * 0.025);
  const rw = Math.max(2.2, Math.min(4.4, 1.7 + Math.min(w, h) * 0.028));
  brushStroke(
    parent,
    fpts(
      [
        [ra[0] - over, 0],
        [(ra[0] + rb[0]) / 2, 0],
        [rb[0] + over, 0],
      ],
      t,
    ),
    {
      seed: `${o.seed}:ridge`,
      w: rw,
      color: 'var(--silver)',
      amp: 0.7,
      wobble: 0.12,
      taperIn: 0.14,
      taperOut: 0.16,
      dry: rb[0] - ra[0] > 95,
    },
  );

  // rafter ticks along the shadow eave — hand-spaced, some missing
  if (w >= 42) {
    for (let x = -hw + 5; x <= hw - 5; x += 8 + r() * 5) {
      if (r() < 0.16) continue;
      tick(
        parent,
        t([x, hh + 0.5]),
        t([x + (r() - 0.5) * 1.6, hh + 2.2 + r() * 1.4]),
        `${o.seed}:rt${x.toFixed(0)}`,
        0.8,
        'var(--ink-soft)',
        0.9,
      );
    }
  }
}

/** A narrow ridged corridor roof (the watari-rōka strip joining house parts) —
 *  lighter than roofMass: a tone strip with a working-weight ridge and hairline eaves. */
function corridorRoof(
  parent: SVGElement,
  t: Xf,
  x0: number,
  x1: number,
  y: number,
  hh: number,
  seed: string,
): void {
  const strip: Pt[] = [
    [x0, y - hh],
    [x1, y - hh],
    [x1, y + hh],
    [x0, y + hh],
  ];
  wash(parent, fpts(strip, t), { seed: `${seed}:f`, fill: 'var(--steel-hi)', amp: 1 });
  wash(parent, fpts(strip, t), { seed: `${seed}:g`, fill: 'var(--silver-faint)', amp: 1 });
  inkLine(
    parent,
    fpts(
      [
        [x0, y - hh],
        [x1, y - hh],
      ],
      t,
    ),
    { seed: `${seed}:n`, w: 0.8, color: 'var(--silver-wire)', amp: 0.5 },
  );
  inkLine(
    parent,
    fpts(
      [
        [x0, y + hh],
        [x1, y + hh],
      ],
      t,
    ),
    { seed: `${seed}:s`, w: 1.2, color: 'var(--silver-dim)', amp: 0.5 },
  );
  brushStroke(
    parent,
    fpts(
      [
        [x0, y],
        [(x0 + x1) / 2, y],
        [x1, y],
      ],
      t,
    ),
    {
      seed: `${seed}:r`,
      w: 2.2,
      color: 'var(--silver-dim)',
      amp: 0.7,
      taperIn: 0.1,
      taperOut: 0.1,
    },
  );
}

/** The guest house — ONE winged residence (spec L3, bible G6): a hipped central
 *  hall, two gabled wings joined by a ridged corridor running behind the hall, the
 *  kitchen mass on the WEST flank (threshold step facing the paddies), the shoin
 *  block at the north end, engawa lines along the south face. Returns the world
 *  anchors of its parts so zone seals can sit on their rooms. */
export function wingedHouse(
  parent: SVGElement,
  at: Pt,
  o: { seed: string; scale?: number; angleDeg?: number },
): { hall: Pt; eastWing: Pt; westWing: Pt; corridor: Pt; kitchen: Pt; shoin: Pt } {
  const s = o.scale ?? 1;
  const r = rng(o.seed);
  const ang = (o.angleDeg ?? 0) + (r() - 0.5) * 1.6;
  const t = frame(at[0], at[1], ang);
  const S = (p: Pt): Pt => [p[0] * s, p[1] * s];
  const T: Xf = (p) => t(S(p));

  // corridor strips (drawn first — the hall overlaps their inner ends)
  corridorRoof(parent, T, 44, 78, -14, 7, `${o.seed}:corE`);
  corridorRoof(parent, T, -78, -44, -14, 7, `${o.seed}:corW`);

  // kitchen — tucked against the hall's south-west corner, service edge west
  roofMass(parent, ...T([-56, 30]), 34 * s, 24 * s, {
    seed: `${o.seed}:kit`,
    angleDeg: ang,
    style: 'gable',
  });

  // wings — gable ridges running north–south (footprint 42 wide × 78 long)
  roofMass(parent, ...T([96, -4]), 78 * s, 42 * s, {
    seed: `${o.seed}:wE`,
    angleDeg: ang + 90,
    style: 'gable',
  });
  roofMass(parent, ...T([-96, -4]), 78 * s, 42 * s, {
    seed: `${o.seed}:wW`,
    angleDeg: ang - 90,
    style: 'gable',
  });

  // shoin block at the north end + its connecting boards
  roofMass(parent, ...T([10, -46]), 34 * s, 24 * s, {
    seed: `${o.seed}:sho`,
    angleDeg: ang,
    style: 'hip',
  });
  inkLine(
    parent,
    fpts(
      [
        [5, -34],
        [5, -28],
      ],
      T,
    ),
    { seed: `${o.seed}:sb1`, w: 1, color: 'var(--ink-soft)', amp: 0.4 },
  );
  inkLine(
    parent,
    fpts(
      [
        [15, -34],
        [15, -28],
      ],
      T,
    ),
    { seed: `${o.seed}:sb2`, w: 1, color: 'var(--ink-soft)', amp: 0.4 },
  );

  // the hall — dominant, drawn last so it reads in front
  roofMass(parent, ...T([0, 2]), 96 * s, 62 * s, {
    seed: `${o.seed}:hall`,
    angleDeg: ang,
    style: 'hip',
  });

  // the shrine-alcove corridor marked on-plan across the hall (survey annotation)
  inkLine(
    parent,
    fpts(
      [
        [-44, -14],
        [0, -14],
        [44, -14],
      ],
      T,
    ),
    {
      seed: `${o.seed}:onplan`,
      w: 0.8,
      color: 'var(--ink-faint)',
      amp: 0.7,
      opacity: 0.9,
    },
  );

  // engawa — double veranda hairline along the hall's south eave, with an east return
  inkLine(
    parent,
    fpts(
      [
        [-40, 37],
        [42, 37],
      ],
      T,
    ),
    { seed: `${o.seed}:en1`, w: 0.8, color: 'var(--ink-soft)', amp: 0.6 },
  );
  inkLine(
    parent,
    fpts(
      [
        [-36, 40.5],
        [44, 40.5],
      ],
      T,
    ),
    { seed: `${o.seed}:en2`, w: 0.8, color: 'var(--ink-faint)', amp: 0.6 },
  );
  inkLine(
    parent,
    fpts(
      [
        [44, 37],
        [50, 24],
      ],
      T,
    ),
    { seed: `${o.seed}:en3`, w: 0.8, color: 'var(--ink-faint)', amp: 0.6 },
  );

  // kitchen threshold — step + board facing the paddies (west)
  tick(parent, T([-74, 25]), T([-74, 35]), `${o.seed}:kt1`, 1.1, 'var(--ink-soft)');
  tick(parent, T([-77.5, 27]), T([-77.5, 33]), `${o.seed}:kt2`, 0.8, 'var(--ink-faint)');

  return {
    hall: T([0, 12]),
    eastWing: T([96, -4]),
    westWing: T([-96, -4]),
    corridor: T([0, -14]),
    kitchen: T([-56, 30]),
    shoin: T([10, -46]),
  };
}

/** The kura — drawn the ezu way, as a small elevational glyph: a white-plaster
 *  body (steel-hi lifted with a silver-faint glaze — the brightest built surface
 *  on the sheet) under a heavy dark overhanging roof, namako-lattice hairlines on
 *  the lower body, a dark door slit. Must read instantly distinct from wooden roofs. */
export function kura(
  parent: SVGElement,
  cx: number,
  cy: number,
  o: { seed: string; scale?: number },
): void {
  const s = o.scale ?? 1;
  const r = rng(o.seed);
  const t = frame(cx, cy, (r() - 0.5) * 3);
  const S: Xf = (p) => t([p[0] * s, p[1] * s]);

  // plaster body — triple wash lifts it toward white: the brightest built surface
  const body: Pt[] = [
    [-15, -8],
    [15, -8],
    [15, 14],
    [-15, 14],
  ];
  wash(parent, fpts(body, S), { seed: `${o.seed}:b1`, fill: 'var(--steel-hi)', amp: 0.8 });
  wash(parent, fpts(body, S), { seed: `${o.seed}:b2`, fill: 'var(--silver-faint)', amp: 0.8 });
  wash(parent, fpts(body, S), { seed: `${o.seed}:b3`, fill: 'var(--silver-faint)', amp: 1 });
  inkLine(
    parent,
    fpts(
      [
        [-15, -8],
        [-15, 14],
        [15, 14],
        [15, -8],
      ],
      S,
    ),
    {
      seed: `${o.seed}:bo`,
      w: 1.1,
      color: 'var(--ink-soft)',
      amp: 0.5,
    },
  );

  // namako lattice — crossed hairlines on the lower body; the course count, skirt
  // height, and door placement vary by seed so a row of kura never reads stamped
  const doorX = (r() - 0.5) * 10;
  const skirt = 3 + r() * 2.5;
  const cells = 2 + Math.floor(r() * 2); // lattice cells per side of the door
  const latW = 9 / cells;
  for (let side = -1; side <= 1; side += 2) {
    for (let i = 0; i < cells; i++) {
      const xa = doorX + side * (4 + i * latW);
      const xb = doorX + side * (4 + (i + 1) * latW);
      if (Math.min(xa, xb) < -14 || Math.max(xa, xb) > 14) continue;
      inkLine(
        parent,
        fpts(
          [
            [xa, 13],
            [xb, skirt],
          ],
          S,
        ),
        {
          seed: `${o.seed}:nA${side}${i}`,
          w: 0.7,
          color: 'var(--ink-faint)',
          amp: 0.3,
        },
      );
      inkLine(
        parent,
        fpts(
          [
            [xa, skirt],
            [xb, 13],
          ],
          S,
        ),
        {
          seed: `${o.seed}:nB${side}${i}`,
          w: 0.7,
          color: 'var(--ink-faint)',
          amp: 0.3,
        },
      );
    }
  }

  // door slit
  wash(
    parent,
    fpts(
      [
        [doorX - 3, skirt],
        [doorX + 3, skirt],
        [doorX + 3, 14],
        [doorX - 3, 14],
      ],
      S,
    ),
    {
      seed: `${o.seed}:d`,
      fill: 'var(--steel-0)',
      amp: 0.4,
    },
  );

  // the heavy dark roof cap, overhanging
  wash(
    parent,
    fpts(
      [
        [-20, -8],
        [20, -8],
        [13, -19],
        [-13, -19],
      ],
      S,
    ),
    {
      seed: `${o.seed}:roof`,
      fill: 'var(--steel-0)',
      amp: 0.7,
    },
  );
  inkLine(
    parent,
    fpts(
      [
        [-20, -8],
        [20, -8],
      ],
      S,
    ),
    { seed: `${o.seed}:eave`, w: 1.4, color: 'var(--silver-dim)', amp: 0.5 },
  );
  brushStroke(
    parent,
    fpts(
      [
        [-15, -19],
        [0, -19.5],
        [15, -19],
      ],
      S,
    ),
    {
      seed: `${o.seed}:ridge`,
      w: 3.2 * Math.max(0.8, s),
      color: 'var(--silver)',
      amp: 0.7,
      taperIn: 0.15,
      taperOut: 0.15,
    },
  );
  // munefuda end-caps on the ridge
  tick(parent, S([-14, -22.5]), S([-14, -17]), `${o.seed}:m1`, 1.2, 'var(--silver-dim)');
  tick(parent, S([14, -22.5]), S([14, -17]), `${o.seed}:m2`, 1.2, 'var(--silver-dim)');
  // ground shadow line
  inkLine(
    parent,
    fpts(
      [
        [-16, 15.5],
        [16, 16],
      ],
      S,
    ),
    { seed: `${o.seed}:g`, w: 1, color: 'var(--ink-faint)', amp: 0.6, opacity: 0.8 },
  );
}

/** A lean-to (katanagare) — one mono-pitch plane propped against a wall or on
 *  posts: high-edge working stroke, low shadow eave, two prop ticks. Sōan's
 *  sickroom register: small, attached, humble. */
export function leanTo(
  parent: SVGElement,
  cx: number,
  cy: number,
  o: { seed: string; angleDeg?: number },
): void {
  const r = rng(o.seed);
  const t = frame(cx, cy, (o.angleDeg ?? 0) + (r() - 0.5) * 2.5);
  const c: Pt[] = [
    [-15, -9],
    [15, -9],
    [15, 9],
    [-15, 9],
  ];
  wash(parent, fpts(c, t), { seed: `${o.seed}:f`, fill: 'var(--steel-2)', amp: 1 });
  // single pitch: tone slides dark toward the low (south) eave
  wash(
    parent,
    fpts(
      [
        [-14, 0],
        [14, 0],
        [14, 8],
        [-14, 8],
      ],
      t,
    ),
    {
      seed: `${o.seed}:s`,
      fill: 'var(--steel-0)',
      amp: 0.7,
      opacity: 0.65,
    },
  );
  wash(
    parent,
    fpts(
      [
        [-14, -8],
        [14, -8],
        [14, -2],
        [-14, -2],
      ],
      t,
    ),
    { seed: `${o.seed}:l`, fill: 'var(--steel-hi)', amp: 0.7 },
  );
  // high edge carries the structure stroke; low eave the shadow line
  brushStroke(
    parent,
    fpts(
      [
        [-16, -9],
        [0, -9],
        [16, -9],
      ],
      t,
    ),
    {
      seed: `${o.seed}:hi`,
      w: 2.6,
      color: 'var(--silver)',
      amp: 0.8,
      taperIn: 0.12,
      taperOut: 0.12,
    },
  );
  inkLine(
    parent,
    fpts(
      [
        [-15, 9],
        [15, 9],
      ],
      t,
    ),
    { seed: `${o.seed}:lo`, w: 1.6, color: 'var(--silver-dim)', amp: 0.7 },
  );
  inkLine(
    parent,
    fpts(
      [
        [-15, -9],
        [-15, 9],
      ],
      t,
    ),
    { seed: `${o.seed}:e1`, w: 1, color: 'var(--ink-soft)', amp: 0.5 },
  );
  inkLine(
    parent,
    fpts(
      [
        [15, -9],
        [15, 9],
      ],
      t,
    ),
    { seed: `${o.seed}:e2`, w: 1, color: 'var(--ink-soft)', amp: 0.5 },
  );
  // prop posts under the low eave
  tick(parent, t([-9, 9.5]), t([-9.5, 13]), `${o.seed}:p1`, 1.2, 'var(--ink-soft)');
  tick(parent, t([9, 9.5]), t([9.5, 13]), `${o.seed}:p2`, 1.2, 'var(--ink-soft)');
}

/** A small gabled outbuilding (woodshed register) — a compact roofMass with a
 *  door gap tick on the shadow side. */
export function shed(
  parent: SVGElement,
  cx: number,
  cy: number,
  o: { seed: string; scale?: number; angleDeg?: number },
): void {
  const s = o.scale ?? 1;
  roofMass(parent, cx, cy, 38 * s, 26 * s, {
    seed: `${o.seed}:r`,
    angleDeg: o.angleDeg ?? 0,
    style: 'gable',
  });
  const r = rng(o.seed);
  const t = frame(cx, cy, (o.angleDeg ?? 0) + (r() - 0.5) * 2.2);
  // door: a dark slit breaking the south eave
  wash(
    parent,
    fpts(
      [
        [-4 * s, 8 * s],
        [4 * s, 8 * s],
        [4 * s, 13 * s],
        [-4 * s, 13 * s],
      ],
      t,
    ),
    {
      seed: `${o.seed}:d`,
      fill: 'var(--steel-0)',
      amp: 0.4,
    },
  );
  tick(
    parent,
    t([-4 * s, 13.5 * s]),
    t([4 * s, 13.5 * s]),
    `${o.seed}:step`,
    1,
    'var(--ink-soft)',
    0.9,
  );
}

// ── the gate ─────────────────────────────────────────────────────────────────

/** A roofed gate drawn as an EVENT (spec L3): gable gate-roof over paired pillar
 *  ticks, flanking wall stubs, door leaves, and the worn threshold — the pale
 *  trodden ground that says people pass HERE. `ruined` swaps it for the crumbled
 *  great-gate: one collapsed roof plane, a fallen lintel across the passage, a
 *  leaning post, rubble and grass where the doors were (spec L4). */
export function gatehouse(
  parent: SVGElement,
  at: Pt,
  angleDeg: number,
  o: { seed: string; ruined?: boolean; scale?: number },
): void {
  const s = o.scale ?? 1;
  const r = rng(o.seed);
  const t = frame(at[0], at[1], angleDeg + (r() - 0.5) * 2);
  const T: Xf = (p) => t([p[0] * s, p[1] * s]);

  // worn threshold — trodden pale ground through the passage; a second glaze and
  // wheel-rut hairlines say people pass HERE
  const thr: Pt[] = [
    [-9, 20],
    [9, 20],
    [11, 6],
    [9, -16],
    [-9, -16],
    [-11, 6],
  ];
  wash(parent, fpts(thr, T), {
    seed: `${o.seed}:thr`,
    fill: 'var(--steel-hi)',
    amp: 2.4,
    opacity: o.ruined ? 0.45 : 0.9,
  });
  if (!o.ruined) {
    wash(
      parent,
      fpts(
        [
          [-6, 18],
          [6, 18],
          [7, 4],
          [6, -13],
          [-6, -13],
          [-7, 4],
        ],
        T,
      ),
      {
        seed: `${o.seed}:thr2`,
        fill: 'var(--silver-faint)',
        amp: 2,
      },
    );
    inkLine(
      parent,
      fpts(
        [
          [-3.4, 19],
          [-3, 2],
          [-3.6, -15],
        ],
        T,
      ),
      {
        seed: `${o.seed}:rutW`,
        w: 0.8,
        color: 'var(--ink-faint)',
        amp: 0.8,
        opacity: 0.9,
      },
    );
    inkLine(
      parent,
      fpts(
        [
          [3.6, 19],
          [3, 3],
          [3.4, -15],
        ],
        T,
      ),
      {
        seed: `${o.seed}:rutE`,
        w: 0.8,
        color: 'var(--ink-faint)',
        amp: 0.8,
        opacity: 0.9,
      },
    );
  }

  if (!o.ruined) {
    // flanking wall stubs — the lived wall runs into the gate
    wallRun(parent, [T([-42, 0]), T([-28, 0]), T([-16, 0])], {
      seed: `${o.seed}:stW`,
      state: 'neat',
    });
    wallRun(parent, [T([16, 0]), T([28, 0]), T([42, 0])], { seed: `${o.seed}:stE`, state: 'neat' });
    // door leaves, ajar
    inkLine(
      parent,
      fpts(
        [
          [-7, 5],
          [-2, 10],
        ],
        T,
      ),
      { seed: `${o.seed}:d1`, w: 1.2, color: 'var(--ink-soft)', amp: 0.4 },
    );
    inkLine(
      parent,
      fpts(
        [
          [7, 5],
          [3, 11],
        ],
        T,
      ),
      { seed: `${o.seed}:d2`, w: 1.2, color: 'var(--ink-soft)', amp: 0.4 },
    );
    // pillars — paired heavy ticks either side of the passage
    tick(parent, T([-10, 10]), T([-10, 16]), `${o.seed}:p1`, 2.6, 'var(--silver)');
    tick(parent, T([10, 10]), T([10, 16]), `${o.seed}:p2`, 2.6, 'var(--silver)');
    tick(parent, T([-10, -10]), T([-10, -15]), `${o.seed}:p3`, 2.2, 'var(--silver-dim)');
    tick(parent, T([10, -10]), T([10, -15]), `${o.seed}:p4`, 2.2, 'var(--silver-dim)');
    // the gate roof rides over everything — a full gabled bay, the sheet's EVENT
    roofMass(parent, ...T([0, 0]), 42 * s, 21 * s, {
      seed: `${o.seed}:roof`,
      angleDeg,
      style: 'gable',
    });
    // threshold step
    tick(parent, T([-8, 18]), T([8, 18]), `${o.seed}:step`, 1.1, 'var(--ink-soft)', 0.9);
  } else {
    // flanking walls survive only as broken standing runs
    wallRun(parent, [T([-46, 0]), T([-30, -1]), T([-14, 0])], {
      seed: `${o.seed}:stW`,
      state: 'standing',
    });
    wallRun(parent, [T([14, 0]), T([30, 1]), T([46, 0])], {
      seed: `${o.seed}:stE`,
      state: 'standing',
    });
    // one collapsed roof plane, slumped at the wrong angle
    const plane: Pt[] = [
      [-19, -10],
      [1, -13],
      [6, -3],
      [-14, 3],
    ];
    wash(parent, fpts(plane, T), { seed: `${o.seed}:pl`, fill: 'var(--steel-2)', amp: 1.2 });
    wash(
      parent,
      fpts(
        [
          [-16, -4],
          [4, -8],
          [6, -3],
          [-14, 3],
        ],
        T,
      ),
      {
        seed: `${o.seed}:pls`,
        fill: 'var(--steel-0)',
        amp: 0.8,
        opacity: 0.7,
      },
    );
    brushStroke(
      parent,
      fpts(
        [
          [-20, -10],
          [-8, -12],
          [3, -13],
        ],
        T,
      ),
      {
        seed: `${o.seed}:plr`,
        w: 3.2,
        color: 'var(--silver-dim)',
        amp: 1.4,
        dry: true,
        taperOut: 0.3,
      },
    );
    // the fallen lintel lies diagonally across the passage
    brushStroke(
      parent,
      fpts(
        [
          [-11, 6],
          [1, 8],
          [13, 11],
        ],
        T,
      ),
      {
        seed: `${o.seed}:lintel`,
        w: 3.6,
        color: 'var(--silver-dim)',
        amp: 1,
        dry: true,
        taperIn: 0.06,
        taperOut: 0.12,
      },
    );
    // one post standing, one leaning
    tick(parent, T([-9, 9]), T([-9, 15]), `${o.seed}:p1`, 2.4, 'var(--silver-dim)');
    tick(parent, T([9, 8]), T([13, 14]), `${o.seed}:p2`, 2.2, 'var(--silver-dim)');
    // rubble where the doors were + grass in the threshold
    const rub: Pt[] = [
      [-12, 2],
      [14, 4],
      [12, 16],
      [-8, 15],
    ];
    stipple(parent, fpts(rub, T), {
      seed: `${o.seed}:rub`,
      step: 5,
      prob: 0.6,
      r: 1,
      color: 'var(--ink-faint)',
    });
    squaredStone(parent, ...T([5, 13]), 6 * s, 4 * s, 24, `${o.seed}:q1`);
    squaredStone(parent, ...T([-7, 10]), 5 * s, 4 * s, -30, `${o.seed}:q2`);
    tuft(parent, ...T([-3, 16]), `${o.seed}:t1`, s);
    tuft(parent, ...T([8, 18]), `${o.seed}:t2`, s * 0.8);
  }
}

// ── walls ────────────────────────────────────────────────────────────────────

/** A wall in one of its three lives (spec L4). `neat` — the lived wall: a
 *  gold-dim built line with an inner hairline and post ticks. `standing` — ruin
 *  still upright: heavy dry-brush runs broken by gaps, rubble dots at the breaks.
 *  `robbed` — quarried to the ground: only footing stones remain, a dotted
 *  stone-trace where the courses were carted away. */
export function wallRun(
  parent: SVGElement,
  pts: readonly Pt[],
  o: { seed: string; state: 'neat' | 'standing' | 'robbed' },
): void {
  if (pts.length < 2) return;
  const r = rng(o.seed);
  if (o.state === 'neat') {
    brushStroke(parent, pts, {
      seed: `${o.seed}:main`,
      w: 3,
      color: 'var(--gold-dim)',
      amp: 1.1,
      wobble: 0.12,
      taperIn: 0.04,
      taperOut: 0.05,
    });
    inkLine(parent, offsetPolyline(resample(pts, 14), 2.8), {
      seed: `${o.seed}:inner`,
      w: 0.8,
      color: 'var(--silver-wire)',
      amp: 0.8,
    });
    const posts = resample(pts, 24);
    for (let i = 1; i < posts.length - 1; i++) {
      const a = posts[i - 1]!;
      const b = posts[i + 1]!;
      const p = posts[i]!;
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      const nx = -(b[1] - a[1]) / len;
      const ny = (b[0] - a[0]) / len;
      const e = 2.4 + r() * 1;
      tick(
        parent,
        [p[0] - nx * e, p[1] - ny * e],
        [p[0] + nx * e, p[1] + ny * e],
        `${o.seed}:pt${i}`,
        1.5,
        'var(--gold-dim)',
      );
    }
  } else if (o.state === 'standing') {
    const line = resample(pts, 6);
    let i = 0;
    let seg = 0;
    while (i < line.length - 1) {
      const run = Math.min(line.length - 1, i + 6 + Math.floor(r() * 10));
      if (run - i >= 2) {
        brushStroke(parent, line.slice(i, run + 1), {
          seed: `${o.seed}:run${seg}`,
          w: 3.6 + r() * 1,
          color: 'var(--silver-dim)',
          amp: 1.8,
          wobble: 0.3,
          dry: true,
          taperIn: 0.12,
          taperOut: 0.28,
        });
        // rubble dots spill at the break
        const end = line[run]!;
        for (let k = 0; k < 2 + Math.floor(r() * 2); k++) {
          parent.append(
            sv('circle', {
              cx: (end[0] + (r() - 0.5) * 8).toFixed(1),
              cy: (end[1] + (r() - 0.5) * 8).toFixed(1),
              r: (0.8 + r() * 0.9).toFixed(2),
              fill: 'var(--ink-faint)',
            }),
          );
        }
      }
      i = run + 2 + Math.floor(r() * 4);
      seg++;
    }
  } else {
    // robbed: footing stones with pilfered gaps
    const stones = resample(pts, 11);
    for (let i = 0; i < stones.length; i++) {
      if (r() < 0.24) continue; // a stone carted off
      const a = stones[Math.max(0, i - 1)]!;
      const b = stones[Math.min(stones.length - 1, i + 1)]!;
      const angle = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI + (r() - 0.5) * 26;
      const p = stones[i]!;
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      const nx = -(b[1] - a[1]) / len;
      const ny = (b[0] - a[0]) / len;
      const off = (r() - 0.5) * 2.4;
      const tt = frame(p[0] + nx * off, p[1] + ny * off, angle);
      const w = 2.2 + r() * 1.6;
      const h = 1.6 + r() * 1.2;
      const c = fpts(
        [
          [-w, -h],
          [w, -h],
          [w, h],
          [-w, h],
        ],
        tt,
      );
      parent.append(
        sv('path', {
          d: `M${c.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(' L')} Z`,
          fill: 'var(--ink-soft)',
          opacity: '0.8',
        }),
      );
    }
  }
}

// ── ruin ─────────────────────────────────────────────────────────────────────

/** A collapsed roof (spec L4) — two roof planes slumped at wrong angles with a
 *  gap of bare ground between them, broken dry ridge fragments, rubble spilled at
 *  one end, grass breaching the floor. Ruin depicted, never notated. */
export function fallenRoof(
  parent: SVGElement,
  cx: number,
  cy: number,
  w: number,
  h: number,
  o: { seed: string; angleDeg?: number },
): void {
  const r = rng(o.seed);
  const t = frame(cx, cy, (o.angleDeg ?? 0) + (r() - 0.5) * 3);
  const hw = w / 2;
  const hh = h / 2;

  // plane A — the larger slab, tilted one way
  const tA = frame(...t([-hw * 0.42, -hh * 0.1]), -13 + (r() - 0.5) * 6);
  const aw = w * 0.3;
  const ah = h * 0.44;
  wash(
    parent,
    fpts(
      [
        [-aw, -ah],
        [aw, -ah * 0.8],
        [aw * 0.9, ah],
        [-aw, ah * 0.86],
      ],
      tA,
    ),
    {
      seed: `${o.seed}:A`,
      fill: 'var(--steel-2)',
      amp: 1.6,
    },
  );
  wash(
    parent,
    fpts(
      [
        [-aw * 0.9, 0],
        [aw * 0.9, -ah * 0.1],
        [aw * 0.85, ah * 0.9],
        [-aw * 0.9, ah * 0.8],
      ],
      tA,
    ),
    {
      seed: `${o.seed}:As`,
      fill: 'var(--steel-0)',
      amp: 1,
      opacity: 0.7,
    },
  );
  brushStroke(
    parent,
    fpts(
      [
        [-aw * 1.05, -ah],
        [0, -ah * 0.86],
        [aw, -ah * 0.78],
      ],
      tA,
    ),
    {
      seed: `${o.seed}:Ar`,
      w: 3.4,
      color: 'var(--silver-dim)',
      amp: 1.6,
      dry: true,
      taperOut: 0.34,
    },
  );
  inkLine(
    parent,
    fpts(
      [
        [-aw, -ah],
        [-aw, ah * 0.86],
      ],
      tA,
    ),
    { seed: `${o.seed}:Ae`, w: 1.1, color: 'var(--ink-soft)', amp: 0.8 },
  );

  // plane B — smaller, tipped the other way, past the gap
  const tB = frame(...t([hw * 0.5, hh * 0.14]), 21 + (r() - 0.5) * 8);
  const bw = w * 0.22;
  const bh = h * 0.36;
  wash(
    parent,
    fpts(
      [
        [-bw, -bh],
        [bw, -bh],
        [bw * 1.06, bh * 0.9],
        [-bw * 0.84, bh],
      ],
      tB,
    ),
    {
      seed: `${o.seed}:B`,
      fill: 'var(--steel-2)',
      amp: 1.4,
    },
  );
  wash(
    parent,
    fpts(
      [
        [-bw * 0.9, bh * 0.1],
        [bw, 0],
        [bw, bh * 0.9],
        [-bw * 0.8, bh],
      ],
      tB,
    ),
    {
      seed: `${o.seed}:Bs`,
      fill: 'var(--steel-0)',
      amp: 0.9,
      opacity: 0.65,
    },
  );
  brushStroke(
    parent,
    fpts(
      [
        [-bw, -bh],
        [bw * 0.5, -bh * 0.9],
        [bw * 1.1, -bh * 0.6],
      ],
      tB,
    ),
    {
      seed: `${o.seed}:Br`,
      w: 3,
      color: 'var(--silver-dim)',
      amp: 1.5,
      dry: true,
      taperIn: 0.2,
      taperOut: 0.3,
    },
  );

  // sagging tie-beam bridging the gap
  inkLine(
    parent,
    [t([-hw * 0.12, -hh * 0.24]), t([hw * 0.12, hh * 0.02]), t([hw * 0.3, -hh * 0.1])],
    {
      seed: `${o.seed}:beam`,
      w: 1.6,
      color: 'var(--ink-soft)',
      amp: 1.4,
    },
  );

  // rubble spill at the east end
  const rub = fpts(
    [
      [hw * 0.55, hh * 0.5],
      [hw * 1.05, hh * 0.3],
      [hw * 1.1, hh * 0.95],
      [hw * 0.5, hh * 1.0],
    ],
    t,
  );
  stipple(parent, rub, {
    seed: `${o.seed}:rub`,
    step: 6,
    prob: 0.55,
    r: 1,
    color: 'var(--ink-faint)',
  });
  squaredStone(parent, ...t([hw * 0.8, hh * 0.7]), 7, 5, 15 + r() * 30, `${o.seed}:q1`);

  // grass breaching between the planes and at the west edge
  tuft(parent, ...t([hw * 0.1, -hh * 0.05]), `${o.seed}:t1`, 1);
  tuft(parent, ...t([-hw * 0.05, hh * 0.42]), `${o.seed}:t2`, 0.9);
  tuft(parent, ...t([-hw * 0.86, hh * 0.5]), `${o.seed}:t3`, 0.8);
}

/** A rubble field (spec L4) — an ash-tone wash over the ground, two stipple
 *  registers of broken stone, a few squared dressed blocks (the robbed masonry
 *  that never got carted), and grass tufts working up through it all. */
export function rubbleField(parent: SVGElement, poly: readonly Pt[], o: { seed: string }): void {
  const r = rng(o.seed);
  wash(parent, poly, { seed: `${o.seed}:ash`, fill: 'var(--steel-2)', amp: 4, opacity: 0.7 });
  // ground scatter — sparse, so the HEAPS below carry the rubble reading
  stipple(parent, poly, {
    seed: `${o.seed}:s1`,
    step: 13,
    prob: 0.32,
    r: 1,
    color: 'var(--ink-faint)',
  });
  stipple(parent, poly, {
    seed: `${o.seed}:s2`,
    step: 24,
    prob: 0.3,
    r: 1.5,
    color: 'var(--ink-soft)',
    opacity: 0.85,
  });

  const { x0, y0, x1, y1 } = bbox(poly);
  const area = (x1 - x0) * (y1 - y0);
  const inside = (want: number, place: (x: number, y: number, i: number) => void): void => {
    let placed = 0;
    for (let tries = 0; tries < want * 14 && placed < want; tries++) {
      const x = x0 + r() * (x1 - x0);
      const y = y0 + r() * (y1 - y0);
      if (!pointInPoly([x, y], poly)) continue;
      place(x, y, placed);
      placed++;
    }
  };
  // rubble HEAPS — collapse doesn't scatter evenly: dense stone piles where walls
  // and beams came down, each an oval of packed dots around a couple of blocks
  inside(Math.max(2, Math.min(5, Math.round(area / 11000))), (hx, hy, i) => {
    const hr = 9 + r() * 9;
    const squash = 0.55 + r() * 0.3;
    const heap: Pt[] = [];
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      heap.push([
        hx + Math.cos(a) * hr * (0.8 + r() * 0.4),
        hy + Math.sin(a) * hr * squash * (0.8 + r() * 0.4),
      ]);
    }
    stipple(parent, heap, {
      seed: `${o.seed}:hp${i}`,
      step: 3.6,
      prob: 0.72,
      r: 1.1,
      color: 'var(--ink-soft)',
    });
    squaredStone(
      parent,
      hx + (r() - 0.5) * hr,
      hy + (r() - 0.5) * hr * squash,
      5 + r() * 3.5,
      3.5 + r() * 2,
      r() * 180,
      `${o.seed}:hq${i}`,
    );
  });
  inside(Math.max(2, Math.min(6, Math.round(area / 8500))), (x, y, i) => {
    squaredStone(parent, x, y, 5.5 + r() * 4, 4 + r() * 2.5, r() * 180, `${o.seed}:q${i}`);
  });
  inside(Math.max(3, Math.min(9, Math.round(area / 5200))), (x, y, i) => {
    tuft(parent, x, y, `${o.seed}:t${i}`, 0.8 + r() * 0.5);
  });
}

// ── small stones & yard furniture ────────────────────────────────────────────

/** A standing stone in one of four period registers: `jizo` — a round-topped
 *  stele with the unexplained offering dots at its foot; `boundary` — a squat
 *  squared marker; `grave` — an upright slab on a plinth; `graveEmpty` — the
 *  swept, weeded, stoneless plot: a clean rectangle with rake arcs and NO slab. */
export function stoneMarker(
  parent: SVGElement,
  x: number,
  y: number,
  kind: 'jizo' | 'boundary' | 'grave' | 'graveEmpty',
  seed: string,
): void {
  const r = rng(seed);
  const tilt = (r() - 0.5) * 6;
  // per-seed stature: no two stones on the sheet stand quite alike
  const kw = 0.88 + r() * 0.26;
  const kh = 0.85 + r() * 0.34;
  const t0 = frame(x, y, tilt);
  const t: Xf = (p) => t0([p[0] * kw, p[1] * kh]);
  if (kind === 'jizo') {
    // round-topped stele
    const body: Pt[] = [
      [-3.4, 6],
      [-3.6, -2],
      [-2.4, -5.6],
      [0, -6.8],
      [2.4, -5.6],
      [3.6, -2],
      [3.4, 6],
    ];
    wash(parent, fpts(body, t), {
      seed: `${seed}:b`,
      fill: 'var(--steel-hi)',
      amp: 0.5,
      stroke: 'var(--silver-dim)',
      strokeW: 1.2,
    });
    // the carved figure hinted: a head dot + body stroke
    parent.append(
      sv('circle', {
        cx: String(t([0, -3])[0]),
        cy: String(t([0, -3])[1]),
        r: '1.1',
        fill: 'none',
        stroke: 'var(--ink-soft)',
        'stroke-width': '0.7',
      }),
    );
    inkLine(
      parent,
      fpts(
        [
          [0, -1.6],
          [0, 3.6],
        ],
        t,
      ),
      { seed: `${seed}:f`, w: 0.8, color: 'var(--ink-soft)', amp: 0.3 },
    );
    tick(parent, t([-4.4, 6.6]), t([4.4, 6.8]), `${seed}:base`, 1.3, 'var(--silver-dim)');
    // offerings — small bright marks at the foot, never explained
    for (let i = 0; i < 3; i++) {
      const p = t([-2.6 + i * 2.6 + (r() - 0.5) * 1.2, 8.6 + (r() - 0.5) * 1.4]);
      parent.append(
        sv('circle', {
          cx: p[0].toFixed(1),
          cy: p[1].toFixed(1),
          r: (0.9 + r() * 0.5).toFixed(2),
          fill: 'var(--silver)',
        }),
      );
    }
  } else if (kind === 'boundary') {
    const body: Pt[] = [
      [-3.6, 4.6],
      [-3.8, -3.4],
      [-2.6, -4.8],
      [2.6, -4.6],
      [3.8, -3.2],
      [3.6, 4.6],
    ];
    wash(parent, fpts(body, t), {
      seed: `${seed}:b`,
      fill: 'var(--steel-2)',
      amp: 0.5,
      stroke: 'var(--silver-dim)',
      strokeW: 1.4,
    });
    tick(parent, t([-2.2, -1]), t([2.2, -1.2]), `${seed}:c`, 0.7, 'var(--ink-faint)', 0.9);
    tick(parent, t([-4.6, 5.4]), t([4.6, 5.4]), `${seed}:base`, 1.6, 'var(--silver-dim)');
  } else if (kind === 'grave') {
    const body: Pt[] = [
      [-2.6, 6],
      [-2.8, -6.4],
      [0, -7.6],
      [2.8, -6.4],
      [2.6, 6],
    ];
    wash(parent, fpts(body, t), {
      seed: `${seed}:b`,
      fill: 'var(--steel-2)',
      amp: 0.5,
      stroke: 'var(--silver-dim)',
      strokeW: 1.1,
    });
    inkLine(
      parent,
      fpts(
        [
          [0, -4.6],
          [0, 2.6],
        ],
        t,
      ),
      { seed: `${seed}:k`, w: 0.7, color: 'var(--ink-faint)', amp: 0.3, opacity: 0.9 },
    );
    // plinth
    inkLine(
      parent,
      fpts(
        [
          [-4.6, 6],
          [-4.8, 8.2],
          [4.8, 8.4],
          [4.6, 6],
        ],
        t,
      ),
      { seed: `${seed}:pl`, w: 1, color: 'var(--ink-soft)', amp: 0.4 },
    );
  } else {
    // graveEmpty — the swept plot: clean outline, rake arcs, nothing standing
    const c: Pt[] = [
      [-9, -6.5],
      [9, -6.5],
      [9, 6.5],
      [-9, 6.5],
      [-9, -6.5],
    ];
    inkLine(parent, fpts(c, t), {
      seed: `${seed}:o`,
      w: 1.1,
      color: 'var(--silver-dim)',
      amp: 0.35,
    });
    for (let i = 0; i < 3; i++) {
      const yy = -3.4 + i * 3.2;
      inkLine(
        parent,
        fpts(
          [
            [-6.6, yy + 0.8],
            [0, yy - 0.6],
            [6.6, yy + 0.8],
          ],
          t,
        ),
        {
          seed: `${seed}:rake${i}`,
          w: 0.7,
          color: 'var(--ink-faint)',
          amp: 0.35,
          opacity: 0.85,
        },
      );
    }
  }
}

/** The well — a ring of laid stones around a dark mouth, crowned by the 井
 *  crib-frame (igeta), the four crossed beams every period sheet uses to say
 *  "well" at a glance. */
export function well(parent: SVGElement, x: number, y: number, seed: string): void {
  const r = rng(seed);
  const t = frame(x, y, (r() - 0.5) * 14);
  // dark mouth
  parent.append(sv('circle', { cx: String(x), cy: String(y), r: '3.8', fill: 'var(--steel-0)' }));
  // laid stone ring — short heavy chords with gaps
  const n = 9;
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2 + (r() - 0.5) * 0.14;
    const a1 = a0 + (Math.PI * 2) / n - 0.16;
    const rad = 6 + (r() - 0.5) * 0.9;
    inkLine(
      parent,
      [
        [x + Math.cos(a0) * rad, y + Math.sin(a0) * rad],
        [x + Math.cos((a0 + a1) / 2) * (rad + 0.5), y + Math.sin((a0 + a1) / 2) * (rad + 0.5)],
        [x + Math.cos(a1) * rad, y + Math.sin(a1) * rad],
      ],
      { seed: `${seed}:s${i}`, w: 2, color: 'var(--silver-dim)', amp: 0.3 },
    );
  }
  // the 井 crib over the mouth
  const b = 9.6;
  const g = 3.4;
  inkLine(
    parent,
    fpts(
      [
        [-b, -g],
        [b, -g],
      ],
      t,
    ),
    { seed: `${seed}:i1`, w: 1.3, color: 'var(--ink)', amp: 0.4 },
  );
  inkLine(
    parent,
    fpts(
      [
        [-b, g],
        [b, g],
      ],
      t,
    ),
    { seed: `${seed}:i2`, w: 1.3, color: 'var(--ink)', amp: 0.4 },
  );
  inkLine(
    parent,
    fpts(
      [
        [-g, -b],
        [-g, b],
      ],
      t,
    ),
    { seed: `${seed}:i3`, w: 1.3, color: 'var(--ink)', amp: 0.4 },
  );
  inkLine(
    parent,
    fpts(
      [
        [g, -b],
        [g, b],
      ],
      t,
    ),
    { seed: `${seed}:i4`, w: 1.3, color: 'var(--ink)', amp: 0.4 },
  );
}

/** A rising smoke wisp — a wavering hairline with a couple of drift dots. */
function smokeWisp(parent: SVGElement, x: number, y: number, seed: string, len = 26): void {
  const r = rng(seed);
  const drift = (r() - 0.5) * 10 - 4;
  inkLine(
    parent,
    [
      [x, y],
      [x + drift * 0.3 + (r() - 0.5) * 4, y - len * 0.35],
      [x + drift * 0.7 + (r() - 0.5) * 5, y - len * 0.7],
      [x + drift + (r() - 0.5) * 6, y - len],
    ],
    { seed: `${seed}:w`, w: 1, color: 'var(--ink-faint)', amp: 2.2, opacity: 0.9 },
  );
  for (let i = 0; i < 2; i++) {
    const p: Pt = [x + drift * (1.1 + i * 0.25) + (r() - 0.5) * 5, y - len * (1.05 + i * 0.18)];
    parent.append(
      sv('circle', {
        cx: p[0].toFixed(1),
        cy: p[1].toFixed(1),
        r: (0.7 + r() * 0.5).toFixed(2),
        fill: 'var(--ink-faint)',
        opacity: '0.7',
      }),
    );
  }
}

/** The forge — a small dark gabled workshop with a vent box on the roof. `lit`
 *  opens the door on a gold ember (the ONE warm point — built/worked structure at
 *  work) with a smoke wisp at the vent; cold is shut, barred, and dark. */
export function forge(
  parent: SVGElement,
  x: number,
  y: number,
  o: { seed: string; lit?: boolean },
): void {
  const r = rng(o.seed);
  const ang = (r() - 0.5) * 4;
  const t = frame(x, y, ang);
  roofMass(parent, x, y, 32, 21, {
    seed: `${o.seed}:r`,
    angleDeg: ang,
    style: 'gable',
    tone: 'var(--steel-2)',
  });
  // vent box astride the ridge
  inkLine(
    parent,
    fpts(
      [
        [5, -2.6],
        [10, -2.6],
        [10, 2.6],
        [5, 2.6],
        [5, -2.6],
      ],
      t,
    ),
    {
      seed: `${o.seed}:v`,
      w: 1,
      color: 'var(--ink-soft)',
      amp: 0.3,
    },
  );
  // door in the south face
  wash(
    parent,
    fpts(
      [
        [-8, 7],
        [-2, 7],
        [-2, 11.5],
        [-8, 11.5],
      ],
      t,
    ),
    { seed: `${o.seed}:d`, fill: 'var(--steel-0)', amp: 0.4 },
  );
  if (o.lit) {
    // the ember — gold glow low in the doorway
    const e = t([-5, 10]);
    parent.append(
      sv('circle', {
        cx: e[0].toFixed(1),
        cy: e[1].toFixed(1),
        r: '3.4',
        fill: 'var(--gold-dim)',
        opacity: '0.4',
      }),
    );
    parent.append(
      sv('circle', { cx: e[0].toFixed(1), cy: e[1].toFixed(1), r: '1.5', fill: 'var(--gold)' }),
    );
    // spill of warm light on the threshold
    tick(parent, t([-8.5, 12.5]), t([-1.5, 12.8]), `${o.seed}:spill`, 1, 'var(--gold-dim)', 0.8);
    const v = t([7.5, -3]);
    smokeWisp(parent, v[0], v[1], `${o.seed}:smoke`, 24);
  } else {
    // shut: a bar across the door, no light anywhere
    tick(parent, t([-9.5, 9]), t([-0.5, 9.5]), `${o.seed}:bar`, 1.3, 'var(--ink-soft)');
  }
}

/** The old stable court's range — a LONG gabled building combed by stall-division
 *  ticks (far too many stalls for the one mule), the stall-front posts marching
 *  along the open south side, a rack standing outside and rake arcs in the yard. */
export function stableRange(
  parent: SVGElement,
  at: Pt,
  o: { seed: string; stalls: number; angleDeg?: number },
): void {
  const r = rng(o.seed);
  const ang = (o.angleDeg ?? 0) + (r() - 0.5) * 1.6;
  const t = frame(at[0], at[1], ang);
  const bay = 13;
  const w = o.stalls * bay + 14;
  const h = 24;
  const hw = w / 2;
  const hh = h / 2;
  roofMass(parent, at[0], at[1], w, h, { seed: `${o.seed}:r`, angleDeg: ang, style: 'gable' });
  // stall divisions — survey ticks crossing the south plane + front posts
  for (let i = 1; i < o.stalls; i++) {
    const xx = -hw + 7 + i * bay + (r() - 0.5) * 1.2;
    inkLine(
      parent,
      fpts(
        [
          [xx, -1],
          [xx, hh - 1],
        ],
        t,
      ),
      {
        seed: `${o.seed}:div${i}`,
        w: 0.8,
        color: 'var(--ink-faint)',
        amp: 0.4,
        opacity: 0.95,
      },
    );
    tick(
      parent,
      t([xx, hh + 0.5]),
      t([xx + (r() - 0.5) * 1.2, hh + 4.5]),
      `${o.seed}:post${i}`,
      1.3,
      'var(--ink-soft)',
    );
  }
  // THE YARD — the zone is the open drill ground, the range is its edge (inbox
  // drain FB: "expected an outdoor training zone, not a building"): a swept
  // tone off the open side, rake sweeps across its whole width, two straw
  // drill-dummies standing in it, the rack at its corner.
  const yd = 46;
  wash(
    parent,
    fpts(
      [
        [-hw * 0.94, hh + 3],
        [hw * 0.94, hh + 3],
        [hw * 0.94, hh + 3 + yd],
        [-hw * 0.94, hh + 3 + yd],
      ],
      t,
    ),
    { seed: `${o.seed}:yardwash`, fill: 'var(--steel-hi)', opacity: 0.07, amp: 2.5 },
  );
  for (let i = 0; i < 5; i++) {
    const yy = hh + 8 + i * (yd / 5.4);
    inkLine(
      parent,
      fpts(
        [
          [-hw * 0.82, yy + 1.2],
          [0, yy - 1.4],
          [hw * 0.82, yy + 1.4],
        ],
        t,
      ),
      {
        seed: `${o.seed}:rake${i}`,
        w: 0.7,
        color: 'var(--ink-faint)',
        amp: 0.5,
        opacity: 0.75,
      },
    );
  }
  // straw drill-dummies — post, crossbar, head, straw skirt (drawn folk-simple)
  for (const [ux, uy, us] of [
    [-hw * 0.42, hh + yd * 0.52, 1] as const,
    [hw * 0.26, hh + yd * 0.4, 0.88] as const,
  ]) {
    const base = t([ux, uy]);
    const top = t([ux, uy - 11 * us]);
    inkLine(parent, [base, top], {
      seed: `${o.seed}:dm${ux.toFixed(0)}p`,
      w: 1.5,
      color: 'var(--ink-soft)',
      amp: 0.3,
    });
    inkLine(parent, [t([ux - 5 * us, uy - 7.5 * us]), t([ux + 5 * us, uy - 7.5 * us])], {
      seed: `${o.seed}:dm${ux.toFixed(0)}c`,
      w: 1.3,
      color: 'var(--ink-soft)',
      amp: 0.3,
    });
    parent.append(
      sv('circle', {
        cx: String(top[0]),
        cy: String(top[1] - 2),
        r: String(2.3 * us),
        fill: 'none',
        stroke: 'var(--ink-soft)',
        'stroke-width': '1.2',
      }),
    );
    for (const lean of [-1, 0, 1]) {
      inkLine(parent, [t([ux + lean * 1.6, uy]), t([ux + lean * 3.4, uy + 4.4])], {
        seed: `${o.seed}:dm${ux.toFixed(0)}s${lean}`,
        w: 0.8,
        color: 'var(--ink-faint)',
        amp: 0.2,
        opacity: 0.85,
      });
    }
  }
  // the rack at the yard's far corner
  const rp = t([hw * 0.7, hh + yd * 0.82]);
  dryingRack(parent, rp[0], rp[1], `${o.seed}:rack`);
}

/** A drying rack — posts, two lashed rails, and a few hung things flapping from
 *  the top rail. Reads as work in progress, not architecture. */
export function dryingRack(parent: SVGElement, x: number, y: number, seed: string): void {
  const r = rng(seed);
  const t = frame(x, y, (r() - 0.5) * 5);
  // posts
  tick(parent, t([-11, -7]), t([-11.5, 7]), `${seed}:p1`, 1.4, 'var(--ink-soft)');
  tick(parent, t([0.5, -7.5]), t([0, 7]), `${seed}:p2`, 1.4, 'var(--ink-soft)');
  tick(parent, t([11.5, -7]), t([11, 7]), `${seed}:p3`, 1.4, 'var(--ink-soft)');
  // rails
  inkLine(
    parent,
    fpts(
      [
        [-13, -5.5],
        [0, -6.2],
        [13, -5.6],
      ],
      t,
    ),
    { seed: `${seed}:r1`, w: 1.2, color: 'var(--silver-dim)', amp: 0.5 },
  );
  inkLine(
    parent,
    fpts(
      [
        [-13, 0.5],
        [0, 0],
        [13, 0.4],
      ],
      t,
    ),
    { seed: `${seed}:r2`, w: 1, color: 'var(--silver-dim)', amp: 0.5 },
  );
  // hung things
  const n = 4 + Math.floor(r() * 3);
  for (let i = 0; i < n; i++) {
    const xx = -10 + (i / (n - 1)) * 20 + (r() - 0.5) * 2.5;
    if (Math.abs(xx) < 1.6) continue; // the middle post
    inkLine(
      parent,
      fpts(
        [
          [xx, -5.6],
          [xx + (r() - 0.5) * 1.6, -5.6 + 3 + r() * 3],
        ],
        t,
      ),
      {
        seed: `${seed}:h${i}`,
        w: 0.9,
        color: 'var(--ink-soft)',
        amp: 0.4,
        opacity: 0.9,
      },
    );
  }
}

/** A charcoal clamp — the earthen kiln mound of the woodlot economy: a domed
 *  wash with a heavy shoulder stroke, flank hatching, a course of vent holes;
 *  `smoking` sends wisps up from the crown (the clamp back in rotation). */
export function charcoalClamp(
  parent: SVGElement,
  x: number,
  y: number,
  o: { seed: string; smoking?: boolean },
): void {
  const r = rng(o.seed);
  const t = frame(x, y, (r() - 0.5) * 4);
  // dome
  const dome: Pt[] = [];
  const rx = 14;
  const ry = 10;
  for (let i = 0; i <= 10; i++) {
    const a = Math.PI - (i / 10) * Math.PI;
    dome.push([Math.cos(a) * rx, -Math.sin(a) * ry + 3]);
  }
  wash(parent, fpts([...dome, [rx, 4.5], [-rx, 4.5]], t), {
    seed: `${o.seed}:d`,
    fill: 'var(--steel-2)',
    amp: 0.9,
  });
  // shoulder stroke over the dome curve
  brushStroke(parent, fpts(dome, t), {
    seed: `${o.seed}:sh`,
    w: 2.4,
    color: 'var(--silver-dim)',
    amp: 0.7,
    taperIn: 0.12,
    taperOut: 0.12,
  });
  // base line + door
  inkLine(
    parent,
    fpts(
      [
        [-rx - 1, 4.5],
        [0, 5],
        [rx + 1, 4.5],
      ],
      t,
    ),
    { seed: `${o.seed}:b`, w: 1.4, color: 'var(--ink-soft)', amp: 0.5 },
  );
  wash(
    parent,
    fpts(
      [
        [-2.4, 0],
        [2.4, 0],
        [2, 4.5],
        [-2, 4.5],
      ],
      t,
    ),
    { seed: `${o.seed}:door`, fill: 'var(--steel-0)', amp: 0.4 },
  );
  // flank hatching on the shadow side
  for (let i = 0; i < 4; i++) {
    const xx = 4 + i * 2.6;
    inkLine(
      parent,
      fpts(
        [
          [xx, -ry * 0.66 + 3 + i * 1.6],
          [xx + 2.2, 3.6],
        ],
        t,
      ),
      {
        seed: `${o.seed}:hx${i}`,
        w: 0.7,
        color: 'var(--ink-faint)',
        amp: 0.3,
        opacity: 0.9,
      },
    );
  }
  // vent holes along the mid-course
  for (let i = 0; i < 5; i++) {
    const a = Math.PI * (0.22 + i * 0.14);
    const p = t([Math.cos(Math.PI - a) * rx * 0.78, -Math.sin(a) * ry * 0.55 + 3]);
    parent.append(
      sv('circle', {
        cx: p[0].toFixed(1),
        cy: p[1].toFixed(1),
        r: '1',
        fill: 'var(--steel-0)',
        stroke: 'var(--ink-faint)',
        'stroke-width': '0.5',
      }),
    );
  }
  if (o.smoking) {
    const c = t([0, -ry + 2]);
    smokeWisp(parent, c[0], c[1], `${o.seed}:s1`, 26);
    const c2 = t([4, -ry + 3.5]);
    smokeWisp(parent, c2[0], c2[1], `${o.seed}:s2`, 18);
  }
}
