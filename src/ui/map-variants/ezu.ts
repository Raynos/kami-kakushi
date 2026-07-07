// THE estate map — 絵図 EZU SURVEY PLAN, a hand-surveyed Edo estate plan,
// top-down: paddies as irregular gold-keylined parcels, buildings as roofed
// footprints with kanji seals, brushed roads, a north mark, a title cartouche.
// Born as take H of the HR-7 real-map diverge
// (docs/plans/fable-2026-07-06-estate-real-map-options.md #1) and picked by the
// human as the shipped map (2026-07-07, "V7D"); render.ts mounts it behind a
// signature guard so it repaints only when an input it reads changes.
//
// The drawing EVOLVES with the run: U1 mends the kura roof-line, U2 clears the
// drill-yard scrub, U3 inks the reclaimed shinden parcel, U4 adds the
// long-house footprint + re-hangs the crest at the gate; reopened house rooms
// stamp their kanji seal onto the main-house footprint. Unsurveyed ground past
// the frontier is blank sheet with a faint 未測 wash (reveal-as-plot — never
// named). All jitter is DETERMINISTICALLY seeded, so a re-render repaints the
// identical sheet (TST2 — the ground never shifts under the player).
import type { MapCtx } from './shared';
import { fogFrontier, getNode, revealedDepths, wireGated, wireTravel } from './shared';
import type { GameState, Intent } from '../../core';
import { ACTIVITIES, MOBS, PEOPLE } from '../../core';

const NS = 'http://www.w3.org/2000/svg';

// ── tiny SVG helpers ──────────────────────────────────────────────────────────

function sv<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs?: Record<string, string>,
  text?: string,
): SVGElementTagNameMap[K] {
  const e = document.createElementNS(NS, tag);
  if (attrs) for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (text !== undefined) e.textContent = text;
  return e;
}

/** Attach a native tooltip (`<title>`) — textContent only, never markup. */
function tip(elm: SVGElement, text: string): void {
  elm.append(sv('title', undefined, text));
}

/** Deterministic PRNG from a string seed (fnv1a → xorshift-mix) — the hand
 *  wobble must repaint IDENTICALLY every render. */
function rng(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822519);
    h = Math.imul(h ^ (h >>> 13), 3266489917);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

type Pt = readonly [number, number];

/** A hand-scrawled path through `pts`: each vertex jittered, each segment bowed
 *  through a perturbed midpoint (quadratic) — the surveyed-by-brush line. */
function scrawl(pts: readonly Pt[], seed: string, amp = 2.2, close = false): string {
  const r = rng(seed);
  const j = (p: Pt): Pt => [p[0] + (r() - 0.5) * 2 * amp, p[1] + (r() - 0.5) * 2 * amp];
  const q = pts.map(j);
  if (close) q.push(q[0]!);
  const p0 = q[0]!;
  let d = `M${p0[0].toFixed(1)},${p0[1].toFixed(1)}`;
  for (let i = 1; i < q.length; i++) {
    const [ax, ay] = q[i - 1]!;
    const [bx, by] = q[i]!;
    const mx = (ax + bx) / 2 + (r() - 0.5) * 2 * amp * 1.5;
    const my = (ay + by) / 2 + (r() - 0.5) * 2 * amp * 1.5;
    d += ` Q${mx.toFixed(1)},${my.toFixed(1)} ${bx.toFixed(1)},${by.toFixed(1)}`;
  }
  if (close) d += ' Z';
  return d;
}

function stroke(
  parent: SVGElement,
  d: string,
  colour: string,
  width: number,
  extra?: Record<string, string>,
): SVGPathElement {
  const p = sv('path', {
    d,
    fill: 'none',
    stroke: colour,
    'stroke-width': String(width),
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    ...extra,
  });
  parent.append(p);
  return p;
}

// ── the hand-placed survey layout (display-only coordinates) ─────────────────
// North is up; the satoyama hills rise to the top of the sheet, the estate
// compound sits low, the kura by its south wall. Roads bend through `via`
// points so nothing reads as a straight diagram edge.

const POS: Record<string, { x: number; y: number }> = {
  kura: { x: 375, y: 668 },
  'gate-forecourt': { x: 520, y: 545 },
  'home-paddies': { x: 225, y: 455 },
  'woodlot-edge': { x: 770, y: 430 },
  'drill-yard': { x: 758, y: 648 },
  'near-satoyama': { x: 465, y: 265 },
  'deep-satoyama': { x: 530, y: 105 },
};

// `pa`/`pb` override the drawn endpoints (a road meets a compound at its GATE
// or wall-edge, never at the surveyor's seal-point in the middle of the yard).
const ROADS: readonly { a: string; b: string; via: readonly Pt[]; pa?: Pt; pb?: Pt }[] = [
  { a: 'kura', b: 'gate-forecourt', via: [[452, 628]], pa: [408, 668], pb: [514, 610] },
  {
    a: 'gate-forecourt',
    b: 'home-paddies',
    via: [
      [382, 528],
      [308, 496],
    ],
    pa: [424, 566],
  },
  {
    a: 'gate-forecourt',
    b: 'woodlot-edge',
    via: [
      [652, 498],
      [712, 468],
    ],
    pa: [614, 528],
  },
  { a: 'gate-forecourt', b: 'drill-yard', via: [[646, 618]], pa: [534, 610] },
  {
    a: 'home-paddies',
    b: 'near-satoyama',
    via: [
      [275, 385],
      [355, 320],
    ],
  },
  {
    a: 'woodlot-edge',
    b: 'near-satoyama',
    via: [
      [700, 350],
      [580, 300],
    ],
  },
  { a: 'near-satoyama', b: 'deep-satoyama', via: [[490, 190]] },
];

// ── period furniture pieces ───────────────────────────────────────────────────

/** A brush pine — the period map-tree: tiered canopy arcs over a trunk tick. */
function tree(
  parent: SVGElement,
  x: number,
  y: number,
  s: number,
  seed: string,
  dark = false,
): void {
  const r = rng(seed);
  const c = dark ? 'var(--silver-dim)' : 'var(--ink-soft)';
  const op = dark ? '0.9' : '0.7';
  const tiers = s > 8.5 ? 3 : 2;
  for (let t = 0; t < tiers; t++) {
    const yt = y - 2 - t * (s * 0.55);
    const w = s * (1.05 - t * 0.3) + (r() - 0.5) * 1.5;
    stroke(
      parent,
      scrawl(
        [
          [x - w, yt],
          [x + (r() - 0.5) * 2, yt - s * 0.85],
          [x + w, yt],
        ],
        `${seed}a${t}`,
        1,
      ),
      c,
      1.1,
      { opacity: op },
    );
  }
  stroke(
    parent,
    scrawl(
      [
        [x, y - 2],
        [x + (r() - 0.5) * 2, y + s * 0.45],
      ],
      seed + 't',
      0.6,
    ),
    c,
    1.1,
    {
      opacity: op,
    },
  );
}

/** A roofed building footprint, top-down: wall rectangle + hip lines + ridge.
 *  `brokenRidge` draws the U0 caved roof-line (mended at U1+). */
function building(
  parent: SVGElement,
  cx: number,
  cy: number,
  w: number,
  h: number,
  seed: string,
  opts?: { brokenRidge?: boolean; faint?: boolean },
): void {
  const x0 = cx - w / 2;
  const y0 = cy - h / 2;
  const x1 = cx + w / 2;
  const y1 = cy + h / 2;
  const col = opts?.faint ? 'var(--silver-faint)' : 'var(--silver-wire)';
  // wall footprint
  const wall = sv('path', {
    d: scrawl(
      [
        [x0, y0],
        [x1, y0],
        [x1, y1],
        [x0, y1],
      ],
      seed + 'w',
      1.6,
      true,
    ),
    fill: 'var(--steel-2)',
    stroke: col,
    'stroke-width': '1.5',
    'stroke-linejoin': 'round',
  });
  parent.append(wall);
  // hip lines corner → ridge ends
  const ins = Math.min(w, h) * 0.32;
  const ry = cy;
  const rx0 = x0 + ins;
  const rx1 = x1 - ins;
  for (const [a, b] of [
    [
      [x0, y0],
      [rx0, ry],
    ],
    [
      [x0, y1],
      [rx0, ry],
    ],
    [
      [x1, y0],
      [rx1, ry],
    ],
    [
      [x1, y1],
      [rx1, ry],
    ],
  ] as const) {
    stroke(parent, scrawl([a, b], seed + a.join() + 'h', 0.8), col, 0.9, { opacity: '0.8' });
  }
  // ridge — mended (one clean stroke) vs broken (two slumped fragments + fallen-tile ticks)
  if (opts?.brokenRidge) {
    const gap = (rx1 - rx0) * 0.36;
    stroke(
      parent,
      scrawl(
        [
          [rx0, ry],
          [rx0 + gap, ry + 3],
        ],
        seed + 'r1',
        1,
      ),
      col,
      1.4,
    );
    stroke(
      parent,
      scrawl(
        [
          [rx1 - gap, ry + 3.5],
          [rx1, ry],
        ],
        seed + 'r2',
        1,
      ),
      col,
      1.4,
    );
    const r = rng(seed + 'tiles');
    for (let i = 0; i < 4; i++) {
      const tx = rx0 + gap + (rx1 - rx0 - 2 * gap) * r();
      const ty = ry - 2 + r() * 6;
      stroke(parent, `M${tx},${ty} l${2 + r() * 3},${(r() - 0.5) * 3}`, col, 1, { opacity: '0.7' });
    }
  } else {
    stroke(
      parent,
      scrawl(
        [
          [rx0, ry],
          [rx1, ry],
        ],
        seed + 'r',
        0.9,
      ),
      col,
      1.6,
    );
  }
}

/** A grass tuft — the choked drill-yard scrub (swept away at U2+). */
function tuft(parent: SVGElement, x: number, y: number, seed: string): void {
  const r = rng(seed);
  for (let i = -1; i <= 1; i++) {
    stroke(
      parent,
      `M${x},${y} q${i * 3 + (r() - 0.5) * 2},${-5 - r() * 3} ${i * 5},${-8 - r() * 3}`,
      'var(--ink-faint)',
      0.9,
    );
  }
}

/** Hillside hachure band — short slanted contour ticks along an arc. */
function hachure(parent: SVGElement, pts: readonly Pt[], seed: string, dark = false): void {
  const r = rng(seed);
  const c = dark ? 'var(--silver-dim)' : 'var(--ink-faint)';
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i]!;
    const [bx, by] = pts[i + 1]!;
    const steps = Math.max(2, Math.round(Math.hypot(bx - ax, by - ay) / 14));
    for (let s = 0; s < steps; s++) {
      const t = (s + 0.5) / steps;
      const x = ax + (bx - ax) * t + (r() - 0.5) * 3;
      const y = ay + (by - ay) * t + (r() - 0.5) * 3;
      // tick roughly perpendicular-down from the contour (hills shade downhill)
      const dx = (by - ay) / Math.hypot(bx - ax, by - ay);
      const dy = -(bx - ax) / Math.hypot(bx - ax, by - ay);
      const len = 5 + r() * 4;
      stroke(parent, `M${x},${y} l${dx * len},${Math.abs(dy) * len}`, c, 0.8, {
        opacity: dark ? '0.5' : '0.55',
      });
    }
  }
}

// ── per-node ground art (only drawn once SURVEYED / revealed) ────────────────

function drawKura(g: SVGElement, state: GameState): void {
  const { x, y } = POS.kura!;
  building(g, x, y - 6, 74, 46, 'kura-b', { brokenRidge: state.estateStage < 1 });
  // door-bar tick on the south wall (re-hung at U1 — reads as the mended store)
  if (state.estateStage >= 1) {
    stroke(
      g,
      scrawl(
        [
          [x - 8, y + 17],
          [x + 8, y + 17],
        ],
        'kura-bar',
        0.6,
      ),
      'var(--silver-wire)',
      1.8,
    );
  }
}

function drawGate(g: SVGElement, state: GameState): void {
  const { x, y } = POS['gate-forecourt']!;
  // compound wall — an irregular walled forecourt, gold keyline (a holding, value)
  const wall: Pt[] = [
    [x - 92, y - 62],
    [x + 78, y - 70],
    [x + 96, y - 6],
    [x + 84, y + 52],
    [x + 26, y + 62],
    [x - 24, y + 58],
    [x - 88, y + 44],
    [x - 100, y - 12],
  ];
  const compound = sv('path', {
    d: scrawl(wall, 'gate-wall', 2.4, true),
    fill: 'rgba(216,185,120,0.045)',
    stroke: 'var(--key)',
    'stroke-width': '1.6',
    'stroke-linejoin': 'round',
  });
  g.append(compound);
  // the gate itself — posts + lintel breaking the south wall
  const gx = x - 2;
  const gy = y + 60;
  stroke(
    g,
    scrawl(
      [
        [gx - 11, gy + 7],
        [gx - 11, gy - 9],
      ],
      'gate-p1',
      0.8,
    ),
    'var(--silver)',
    2.4,
  );
  stroke(
    g,
    scrawl(
      [
        [gx + 11, gy + 7],
        [gx + 11, gy - 9],
      ],
      'gate-p2',
      0.8,
    ),
    'var(--silver)',
    2.4,
  );
  stroke(
    g,
    scrawl(
      [
        [gx - 16, gy - 9],
        [gx + 16, gy - 9],
      ],
      'gate-l',
      0.8,
    ),
    'var(--silver)',
    2.2,
  );
  // U4 — the family crest re-hung above the mended gate: a small mon (ring + inner square)
  if (state.estateStage >= 4) {
    const mon = sv('g');
    const c = sv('circle', {
      cx: String(gx),
      cy: String(gy - 17),
      r: '5',
      fill: 'none',
      stroke: 'var(--gold)',
      'stroke-width': '1.2',
    });
    const sq = sv('rect', {
      x: String(gx - 2.4),
      y: String(gy - 19.4),
      width: '4.8',
      height: '4.8',
      fill: 'var(--gold)',
      transform: `rotate(45 ${gx} ${gy - 17})`,
    });
    mon.append(c, sq);
    tip(mon, 'The Kurosawa crest, re-hung above the mended gate (U4)');
    g.append(mon);
  }
  // the main house (omoya) footprint inside the compound
  building(g, x - 38, y - 26, 76, 44, 'gate-omoya');
  // reopened rooms stamp their kanji seal onto the house footprint
  const ROOMS: readonly (readonly [string, string, string])[] = [
    ['house-omoya', '母屋', 'the main house, reopened'],
    ['house-workshops', '工房', 'the workshops, reopened'],
    ['house-granary', '米蔵', 'the granary, reopened'],
    ['house-study', '書院', 'the study, reopened'],
  ];
  const open = ROOMS.filter(([id]) => state.unlocked.includes(id));
  open.forEach(([, kanji, why], i) => {
    // reopened rooms stamp in as a 2×2 grid of seals under the house's south face
    const rx = x - 38 + (i % 2 === 0 ? -18 : 18);
    const ry = y + 14 + Math.floor(i / 2) * 21;
    const sealG = sv('g');
    sealG.append(
      sv('rect', {
        x: String(rx - 15),
        y: String(ry - 11),
        width: '30',
        height: '17',
        fill: 'var(--steel-1)',
        stroke: 'var(--silver-faint)',
        'stroke-width': '0.8',
      }),
    );
    const t = sv(
      'text',
      { x: String(rx), y: String(ry + 3), class: 'ezu-roomseal', 'text-anchor': 'middle' },
      kanji,
    );
    sealG.append(t);
    tip(sealG, why);
    g.append(sealG);
  });
  // U4 — the raised long-house, a narrow footprint along the east wall
  if (state.estateStage >= 4) {
    building(g, x + 62, y - 4, 30, 88, 'gate-nagaya');
    const t = sv(
      'text',
      { x: String(x + 62), y: String(y + 4), class: 'ezu-microseal', 'text-anchor': 'middle' },
      '長屋',
    );
    tip(t, 'The long-house, raised at U4');
    g.append(t);
  }
  // a small well by the house (a lived-in compound, not a box)
  g.append(
    sv('circle', {
      cx: String(x + 40),
      cy: String(y + 30),
      r: '5',
      fill: 'none',
      stroke: 'var(--silver-wire)',
      'stroke-width': '1.2',
    }),
  );
  stroke(
    g,
    scrawl(
      [
        [x + 35, y + 30],
        [x + 45, y + 30],
      ],
      'gate-well',
      0.5,
    ),
    'var(--silver-wire)',
    0.8,
  );
}

function drawPaddies(g: SVGElement, state: GameState): void {
  const { x, y } = POS['home-paddies']!;
  // terraced parcels stepping DOWN the slope (NE high → SW low) — each an
  // irregular quad, gold keyline, thin water hatching inside.
  const parcels: readonly { pts: readonly Pt[]; seed: string }[] = [
    {
      pts: [
        [x - 42, y - 78],
        [x + 52, y - 92],
        [x + 64, y - 48],
        [x - 30, y - 40],
      ],
      seed: 'pd1',
    },
    {
      pts: [
        [x - 62, y - 36],
        [x + 62, y - 44],
        [x + 72, y - 2],
        [x - 52, y + 4],
      ],
      seed: 'pd2',
    },
    {
      pts: [
        [x - 76, y + 10],
        [x + 68, y + 2],
        [x + 56, y + 44],
        [x - 66, y + 50],
      ],
      seed: 'pd3',
    },
    {
      pts: [
        [x - 60, y + 56],
        [x + 30, y + 50],
        [x + 20, y + 86],
        [x - 48, y + 88],
      ],
      seed: 'pd4',
    },
  ];
  const drawParcel = (pts: readonly Pt[], seed: string, isNew = false): void => {
    const p = sv('path', {
      d: scrawl(pts, seed, 2.6, true),
      fill: 'rgba(216,185,120,0.06)',
      stroke: isNew ? 'var(--gold)' : 'var(--key)',
      'stroke-width': isNew ? '1.6' : '1.3',
      'stroke-linejoin': 'round',
    });
    g.append(p);
    // water hatching — short horizontal brush ticks
    const r = rng(seed + 'w');
    const xs = pts.map((q) => q[0]);
    const ys = pts.map((q) => q[1]);
    const cx = xs.reduce((a, b) => a + b) / xs.length;
    const cy = ys.reduce((a, b) => a + b) / ys.length;
    const wHalf = (Math.max(...xs) - Math.min(...xs)) / 2 - 16;
    for (let i = 0; i < 3; i++) {
      const hy = cy - 8 + i * 8 + (r() - 0.5) * 3;
      const off = (r() - 0.5) * 14;
      stroke(
        g,
        scrawl(
          [
            [cx - wHalf * 0.7 + off, hy],
            [cx + wHalf * 0.7 + off, hy],
          ],
          seed + 'h' + i,
          0.9,
        ),
        'var(--ink-faint)',
        0.8,
        { opacity: '0.7' },
      );
    }
  };
  for (const { pts, seed } of parcels) drawParcel(pts, seed);
  // U3 — the reclaimed shinden: a NEW parcel breaks ground below the terraces
  if (state.estateStage >= 3) {
    drawParcel(
      [
        [x - 40, y + 96],
        [x + 44, y + 90],
        [x + 56, y + 126],
        [x - 26, y + 130],
      ],
      'pd-new',
      true,
    );
    const t = sv(
      'text',
      {
        x: String(x + 6),
        y: String(y + 114),
        class: 'ezu-microseal ezu-gold',
        'text-anchor': 'middle',
      },
      '新田',
    );
    tip(t, 'The first shinden, reclaimed at U3');
    g.append(t);
  }
}

function drawWoodlot(g: SVGElement): void {
  const { x, y } = POS['woodlot-edge']!;
  // stable footprint at the yard's west side
  building(g, x - 42, y + 14, 52, 34, 'wl-stable');
  // the woodlot — a loose stand of trees north-east of the yard
  const spots: readonly Pt[] = [
    [x + 18, y - 34],
    [x + 52, y - 22],
    [x + 84, y - 38],
    [x + 40, y + 6],
    [x + 76, y + 2],
    [x + 104, y - 12],
    [x + 62, y + 34],
    [x + 98, y + 26],
  ];
  spots.forEach(([tx, ty], i) => tree(g, tx, ty, 8, `wl-t${i}`));
  // the road that leaves the valley — brushed east off the sheet, fading
  stroke(
    g,
    scrawl(
      [
        [x + 40, y + 52],
        [x + 110, y + 58],
        [x + 165, y + 52],
      ],
      'wl-road',
      2,
    ),
    'var(--ink-soft)',
    2.4,
    { 'stroke-dasharray': '7 6', opacity: '0.45' },
  );
}

function drawDrill(g: SVGElement, state: GameState): void {
  const { x, y } = POS['drill-yard']!;
  // the yard parcel — an open ground, silver-wired (worked ground, not a holding)
  const p = sv('path', {
    d: scrawl(
      [
        [x - 52, y - 34],
        [x + 54, y - 42],
        [x + 62, y + 26],
        [x - 44, y + 34],
      ],
      'dy-p',
      2.4,
      true,
    ),
    fill: 'var(--steel-2)',
    stroke: 'var(--silver-wire)',
    'stroke-width': '1.3',
    'stroke-linejoin': 'round',
    'stroke-dasharray': state.estateStage < 2 ? '3 4' : '',
  });
  g.append(p);
  if (state.estateStage < 2) {
    // U0/U1 — the yard is choked: scrub tufts across the ground
    const r = rng('dy-scrub');
    for (let i = 0; i < 7; i++) {
      tuft(g, x - 38 + r() * 84, y - 22 + r() * 44, `dy-tf${i}`);
    }
  } else {
    // U2+ — cleared, a weapon-rack stands at the yard's edge
    const rx = x - 26;
    const ry = y - 18;
    stroke(
      g,
      scrawl(
        [
          [rx, ry],
          [rx, ry + 16],
        ],
        'dy-r1',
        0.6,
      ),
      'var(--silver)',
      1.8,
    );
    stroke(
      g,
      scrawl(
        [
          [rx + 22, ry],
          [rx + 22, ry + 16],
        ],
        'dy-r2',
        0.6,
      ),
      'var(--silver)',
      1.8,
    );
    stroke(
      g,
      scrawl(
        [
          [rx - 3, ry + 4],
          [rx + 25, ry + 4],
        ],
        'dy-r3',
        0.6,
      ),
      'var(--silver)',
      1.4,
    );
    stroke(
      g,
      scrawl(
        [
          [rx - 3, ry + 10],
          [rx + 25, ry + 10],
        ],
        'dy-r4',
        0.6,
      ),
      'var(--silver)',
      1.4,
    );
  }
}

function drawNearSato(g: SVGElement): void {
  const { x, y } = POS['near-satoyama']!;
  // managed hill: two contour arcs with hachure, spaced tree rows between
  const c1: Pt[] = [
    [x - 150, y + 62],
    [x - 60, y + 34],
    [x + 60, y + 40],
    [x + 160, y + 66],
  ];
  const c2: Pt[] = [
    [x - 120, y + 6],
    [x - 30, y - 18],
    [x + 80, y - 12],
    [x + 150, y + 14],
  ];
  stroke(g, scrawl(c1, 'ns-c1', 3), 'var(--ink-faint)', 1, { opacity: '0.75' });
  stroke(g, scrawl(c2, 'ns-c2', 3), 'var(--ink-faint)', 1, { opacity: '0.75' });
  hachure(g, c1, 'ns-h1');
  hachure(g, c2, 'ns-h2');
  // managed rows — evenly-spaced trees (a tended forest, not a wild one)
  const rows: readonly Pt[] = [
    [x - 95, y - 34],
    [x - 45, y - 42],
    [x + 8, y - 40],
    [x + 60, y - 44],
    [x + 112, y - 32],
    [x - 68, y - 4],
    [x - 14, y - 8],
    [x + 40, y - 6],
    [x + 94, y + 2],
  ];
  rows.forEach(([tx, ty], i) => tree(g, tx, ty, 7.5, `ns-t${i}`));
}

function drawDeepSato(g: SVGElement): void {
  const { x, y } = POS['deep-satoyama']!;
  // wild hill — steeper hachure, denser and darker growth
  const c1: Pt[] = [
    [x - 170, y + 66],
    [x - 60, y + 40],
    [x + 70, y + 46],
    [x + 170, y + 70],
  ];
  stroke(g, scrawl(c1, 'ds-c1', 3.4), 'var(--ink-faint)', 1, { opacity: '0.8' });
  hachure(g, c1, 'ds-h1', true);
  const r = rng('ds-wild');
  for (let i = 0; i < 14; i++) {
    const tx = x - 140 + r() * 280;
    const ty = y - 52 + r() * 76;
    tree(g, tx, ty, 7 + r() * 4, `ds-t${i}`, true);
  }
  // the boar's wallow — a small mud pool deep in the stand
  const pool = sv('path', {
    d: scrawl(
      [
        [x + 88, y - 8],
        [x + 106, y - 14],
        [x + 116, y - 4],
        [x + 102, y + 4],
      ],
      'ds-pool',
      2,
      true,
    ),
    fill: 'var(--steel-0)',
    stroke: 'var(--ink-faint)',
    'stroke-width': '0.9',
  });
  tip(pool, 'a churned wallow in the mud');
  g.append(pool);
}

const GROUND_ART: Record<string, (g: SVGElement, state: GameState) => void> = {
  kura: drawKura,
  'gate-forecourt': drawGate,
  'home-paddies': drawPaddies,
  'woodlot-edge': (g) => drawWoodlot(g),
  'drill-yard': drawDrill,
  'near-satoyama': (g) => drawNearSato(g),
  'deep-satoyama': (g) => drawDeepSato(g),
};

// where each node's SEAL (the click target) sits relative to its ground art
const SEAL_OFF: Record<string, { dx: number; dy: number }> = {
  kura: { dx: -70, dy: 8 },
  'gate-forecourt': { dx: -2, dy: 102 },
  'home-paddies': { dx: -118, dy: -46 },
  'woodlot-edge': { dx: -52, dy: -76 },
  'drill-yard': { dx: 4, dy: 74 },
  'near-satoyama': { dx: -158, dy: -50 },
  'deep-satoyama': { dx: 176, dy: -14 },
};

// ── the what's-where marks (labour / foes / people) ──────────────────────────

interface Mark {
  readonly glyph: string;
  readonly colour: string;
  readonly why: string;
}

function marksFor(id: string, ctx: MapCtx, state: GameState): Mark[] {
  const out: Mark[] = [];
  for (const a of ACTIVITIES) {
    if (a.area === id && ctx.revealed.has(a.surface)) {
      out.push({ glyph: '労', colour: 'var(--gold-dim)', why: a.label });
    }
  }
  for (const m of MOBS) {
    if (m.area === id && !m.scripted && !(m.minTier && m.minTier > 0)) {
      out.push({ glyph: m.kanji ?? '獣', colour: 'var(--ink-soft)', why: m.label });
    }
  }
  for (const p of PEOPLE) {
    if (p.node !== id) continue;
    if (p.placeGate && !state.unlocked.includes(p.placeGate)) continue;
    if (p.presence && !p.presence(state)) continue;
    out.push({ glyph: '人', colour: 'var(--silver-dim)', why: p.tell ?? p.name });
  }
  return out;
}

// ── the take ──────────────────────────────────────────────────────────────────

let renderCounter = 0;

export function renderMapEzu(
  container: HTMLElement,
  ctx: MapCtx,
  state: GameState,
  dispatch: (intent: Intent) => void,
): void {
  void dispatch; // movement goes through ctx.move (the real move_to)
  const uid = `ezu${++renderCounter}`;

  const style = document.createElement('style');
  style.textContent = `
    .ezu-wrap { border: 1px solid var(--silver-faint); background: var(--void); padding: 6px; }
    .ezu-wrap svg { display: block; width: 100%; height: auto; }
    .ezu-seal-kanji { font-family: var(--font-head); fill: var(--ink); }
    .ezu-caption { font-family: var(--font-body); font-size: 13px; fill: var(--ink-soft); }
    .ezu-mark { font-family: var(--font-head); font-size: 13px; }
    .ezu-roomseal { font-family: var(--font-head); font-size: 13px; fill: var(--silver-dim); }
    .ezu-microseal { font-family: var(--font-head); font-size: 12px; fill: var(--ink-soft); }
    .ezu-gold { fill: var(--gold-dim); }
    .ezu-node[data-node] { outline: none; }
    .ezu-node[data-node]:not([data-locked]):hover .ezu-sealbox,
    .ezu-node[data-node]:not([data-locked]):focus-visible .ezu-sealbox {
      stroke: var(--gold-hi); stroke-width: 1.8;
    }
    .ezu-node[data-node]:not([data-locked]):hover .ezu-caption { fill: var(--ink); }
    .ezu-node[data-locked] { opacity: 0.62; cursor: not-allowed; }
  `;

  const wrap = document.createElement('div');
  wrap.className = 'ezu-wrap';
  const svg = sv('svg', {
    viewBox: '0 0 1000 780',
    role: 'img',
    'aria-label': 'Survey plan of the Kurosawa estate',
  });
  wrap.append(svg);

  // hand-wobble filter for the linework layers (text stays crisp, off-filter)
  const defs = sv('defs');
  const filter = sv('filter', {
    id: `${uid}-w`,
    x: '-5%',
    y: '-5%',
    width: '110%',
    height: '110%',
  });
  filter.append(
    sv('feTurbulence', {
      type: 'fractalNoise',
      baseFrequency: '0.013',
      numOctaves: '2',
      seed: '7',
      result: 'n',
    }),
    sv('feDisplacementMap', { in: 'SourceGraphic', in2: 'n', scale: '3.5' }),
  );
  defs.append(filter);
  svg.append(defs);

  // ── the sheet: steel plate + double survey frame ──
  svg.append(
    sv('rect', { x: '8', y: '8', width: '984', height: '764', fill: 'var(--steel-1)' }),
    sv('rect', {
      x: '8',
      y: '8',
      width: '984',
      height: '764',
      fill: 'none',
      stroke: 'var(--silver-wire)',
      'stroke-width': '1',
    }),
    sv('rect', {
      x: '18',
      y: '18',
      width: '964',
      height: '744',
      fill: 'none',
      stroke: 'var(--key)',
      'stroke-width': '1.2',
    }),
  );

  const depths = revealedDepths(ctx.revealed);
  const fog = fogFrontier(ctx.revealed);
  const art = sv('g', { filter: `url(#${uid}-w)` }); // wobbled linework
  const seals = sv('g'); // crisp seals/labels/marks — no filter
  svg.append(art, seals);

  // ── roads (brushed, only over surveyed ground; a fading stub toward fog) ──
  for (const { a, b, via, pa: oa, pb: ob } of ROADS) {
    const aOn = depths.has(a);
    const bOn = depths.has(b);
    if (!aOn && !bOn) continue;
    const pa = oa ?? ([POS[a]!.x, POS[a]!.y] as const);
    const pb = ob ?? ([POS[b]!.x, POS[b]!.y] as const);
    const pts: Pt[] = [pa, ...via, pb];
    if (aOn && bOn) {
      // a brushed road: a warm ochre body wash + a dotted travellers' line over it
      stroke(art, scrawl(pts, `rd-${a}-${b}`, 3), 'var(--gold-dim)', 6, { opacity: '0.38' });
      stroke(art, scrawl(pts, `rd-${a}-${b}-c`, 3), 'var(--ink-soft)', 1.5, {
        'stroke-dasharray': '8 6',
        opacity: '0.8',
      });
    } else {
      // one end unsurveyed — the road trails off after a few brush lengths
      const from = aOn ? pts : [...pts].reverse();
      const [sx0, sy0] = from[0]!;
      const [nx, ny] = from[1]!;
      const sx = sx0 + (nx - sx0) * 0.3;
      const sy = sy0 + (ny - sy0) * 0.3;
      const ex = sx0 + (nx - sx0) * 0.62;
      const ey = sy0 + (ny - sy0) * 0.62;
      stroke(
        art,
        scrawl(
          [
            [sx, sy],
            [ex, ey],
          ],
          `rds-${a}-${b}`,
          2.5,
        ),
        'var(--ink-soft)',
        1.6,
        {
          'stroke-dasharray': '6 10',
          opacity: '0.4',
        },
      );
    }
  }

  // ── the stream that waters the paddies (drawn once they're surveyed) —
  //    down from the hills, along the terraces, off the sheet's west edge ──
  if (depths.has('home-paddies')) {
    const course: Pt[] = [
      [432, 318],
      [372, 342],
      [318, 388],
      [300, 432],
      [290, 486],
      [268, 522],
    ];
    stroke(art, scrawl(course, 'stream-a', 3), 'var(--silver-dim)', 1.2, { opacity: '0.4' });
    stroke(
      art,
      scrawl(
        course.map(([cx, cy]) => [cx + 4, cy + 3] as const),
        'stream-b',
        3,
      ),
      'var(--silver-dim)',
      1,
      { opacity: '0.3' },
    );
  }

  // ── surveyed ground art ──
  for (const id of depths.keys()) {
    const g = sv('g');
    GROUND_ART[id]?.(g, state);
    art.append(g);
  }

  // ── unsurveyed ground — a blank wash with a faint 未測 (never named) ──
  for (const [fogId] of fog) {
    const p = POS[fogId];
    if (!p) continue;
    const r = rng(`fog-${fogId}`);
    const blob: Pt[] = [];
    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2;
      const rad = 46 + r() * 26;
      blob.push([p.x + Math.cos(ang) * rad * 1.5, p.y + Math.sin(ang) * rad * 0.8]);
    }
    const wash = sv('path', {
      d: scrawl(blob, `fogp-${fogId}`, 5, true),
      fill: 'var(--steel-0)',
      stroke: 'var(--silver-faint)',
      'stroke-width': '1',
      'stroke-dasharray': '4 7',
      opacity: '0.85',
    });
    art.append(wash);
    const t = sv('text', {
      x: String(p.x),
      y: String(p.y - 4),
      'text-anchor': 'middle',
      class: 'ezu-caption',
      style: 'font-size: 15px; fill: var(--ink-faint);',
    });
    t.append(
      sv('tspan', { x: String(p.x), dy: '0' }, '未'),
      sv('tspan', { x: String(p.x), dy: '17' }, '測'),
    );
    tip(t, 'Unsurveyed ground');
    seals.append(t);
  }

  // ── node seals — the click targets ──
  for (const id of depths.keys()) {
    const node = getNode(id);
    const p = POS[id];
    if (!p) continue;
    const off = SEAL_OFF[id] ?? { dx: 0, dy: 0 };
    const sx = p.x + off.dx;
    const sy = p.y + off.dy;
    const here = id === ctx.here;
    const nb = ctx.neighbours.some((n) => n.id === id);
    const gated = nb && !!node.dangerRing && !ctx.condOk;
    const walkable = nb && !gated;

    const g = sv('g', { class: 'ezu-node' });
    seals.append(g);

    const kanji = node.kanji ?? '？';
    const wide = kanji.length > 1;
    const bw = wide ? 52 : 32;
    const bh = 30;
    // an invisible hit-target spanning seal + caption + marks — without it the group's pointer
    // target has GAPS (seal→caption), so a tap at its centre falls through to the plate rect
    // (WebKit hit-testing broke the e2e walk) and a finger between glyphs misses the node.
    g.append(
      sv('rect', {
        x: String(sx - Math.max(bw, 84) / 2),
        y: String(sy - bh / 2 - 6),
        width: String(Math.max(bw, 84)),
        height: String(bh + 44),
        fill: 'transparent',
      }),
    );
    const tilt = ((rng(`tilt-${id}`)() - 0.5) * 3).toFixed(2);
    const box = sv('rect', {
      x: String(sx - bw / 2),
      y: String(sy - bh / 2),
      width: String(bw),
      height: String(bh),
      fill: here ? 'rgba(191,59,37,0.10)' : 'var(--steel-2)',
      stroke: here ? 'var(--shu)' : walkable ? 'var(--gold)' : 'var(--silver-wire)',
      'stroke-width': here ? '1.8' : '1.3',
      'stroke-dasharray': gated ? '4 3' : '',
      transform: `rotate(${tilt} ${sx} ${sy})`,
      class: 'ezu-sealbox',
    });
    const kt = sv('text', {
      x: String(sx),
      y: String(sy + 6.5),
      'text-anchor': 'middle',
      class: 'ezu-seal-kanji',
      style: `font-size: 19px; ${here ? 'fill: var(--shu-hi);' : walkable ? 'fill: var(--silver-hi);' : ''}`,
    });
    kt.textContent = kanji;
    g.append(box, kt);

    // the vermillion you-are-here hanko ring (the sheet's lone hot mark)
    if (here) {
      const ring = sv('circle', {
        cx: String(sx),
        cy: String(sy),
        r: '24',
        fill: 'none',
        stroke: 'var(--shu)',
        'stroke-width': '1.4',
        opacity: '0.9',
        transform: `rotate(${tilt} ${sx} ${sy})`,
      });
      tip(ring, 'You are here');
      g.append(ring);
    }

    // danger nodes wear the 険 ink-mark beside the seal (never on the metal budget)
    if (node.dangerRing) {
      const dk = sv('text', {
        x: String(sx + bw / 2 + 10),
        y: String(sy + 6),
        class: 'ezu-seal-kanji',
        style: 'font-size: 14px; fill: var(--ink-soft);',
      });
      dk.textContent = '険';
      tip(dk, 'Dangerous ground');
      g.append(dk);
    }

    // caption + the what's-where mark row
    const cap = sv('text', {
      x: String(sx),
      y: String(sy + bh / 2 + 16),
      'text-anchor': 'middle',
      class: 'ezu-caption',
    });
    cap.textContent = node.label;
    g.append(cap);
    if (gated) {
      const why = sv('text', {
        x: String(sx),
        y: String(sy + bh / 2 + 31),
        'text-anchor': 'middle',
        class: 'ezu-caption',
        style: 'font-size: 11px; fill: var(--ink-faint);',
      });
      why.textContent = `険 — ${ctx.gateReason}`;
      g.append(why);
    }
    const marks = marksFor(id, ctx, state);
    // variable-width mark row (some foe kanji are two glyphs — 稲鼠, 猿群)
    const widths = marks.map((m) => m.glyph.length * 14 + 7);
    const total = widths.reduce((a, b) => a + b, 0);
    let mx = sx - total / 2;
    marks.forEach((m, i) => {
      const w = widths[i]!;
      const mt = sv('text', {
        x: String(mx + w / 2),
        y: String(sy + bh / 2 + (gated ? 46 : 32)),
        'text-anchor': 'middle',
        class: 'ezu-mark',
        style: `fill: ${m.colour};`,
      });
      mt.textContent = m.glyph;
      tip(mt, m.why);
      g.append(mt);
      mx += w;
    });

    // wiring — real travel / the gated reason (never on the here-node)
    const asHtml = g as unknown as HTMLElement;
    if (walkable && !here) {
      wireTravel(asHtml, id, ctx);
      tip(g, `Walk to ${node.label}`);
    } else if (gated && !here) {
      wireGated(asHtml, id, ctx);
    }
  }

  // ── sheet furniture: north mark, title cartouche, legend, scale bar ──
  // north mark (top-left): a brushed arrow + 北
  const north = sv('g');
  stroke(
    north,
    scrawl(
      [
        [64, 96],
        [64, 52],
      ],
      'north-a',
      1,
    ),
    'var(--silver)',
    1.6,
  );
  stroke(
    north,
    scrawl(
      [
        [57, 62],
        [64, 50],
        [71, 62],
      ],
      'north-h',
      0.8,
    ),
    'var(--silver)',
    1.6,
  );
  north.append(
    sv(
      'text',
      {
        x: '64',
        y: '120',
        'text-anchor': 'middle',
        class: 'ezu-seal-kanji',
        style: 'font-size: 17px; fill: var(--silver);',
      },
      '北',
    ),
  );
  tip(north, 'North');
  seals.append(north);

  // title cartouche (top-right): the survey's name, written vertically
  const cart = sv('g');
  cart.append(
    sv('rect', {
      x: '918',
      y: '34',
      width: '42',
      height: '210',
      fill: 'var(--steel-2)',
      stroke: 'var(--key)',
      'stroke-width': '1.2',
    }),
  );
  const title = sv('text', {
    x: '939',
    y: '52',
    class: 'ezu-seal-kanji',
    style:
      'writing-mode: vertical-rl; font-size: 20px; letter-spacing: 6px; fill: var(--silver); text-anchor: start;',
  });
  title.textContent = '黒沢家領内絵図';
  tip(cart, 'Survey plan of the Kurosawa holdings');
  cart.append(title);
  seals.append(cart);

  // legend (bottom-left): the mark key — quiet, decorative-register
  const legend = sv('g');
  legend.append(
    sv('rect', {
      x: '34',
      y: '706',
      width: '252',
      height: '40',
      fill: 'var(--steel-2)',
      stroke: 'var(--silver-faint)',
      'stroke-width': '1',
    }),
  );
  const legendText = sv('text', {
    x: '46',
    y: '731',
    class: 'ezu-caption',
    style: 'font-size: 13px; fill: var(--ink-faint);',
  });
  const legendParts: readonly (readonly [string, string])[] = [
    ['労', ' work  '],
    ['獣', ' beasts  '],
    ['人', ' folk  '],
    ['険', ' peril'],
  ];
  for (const [glyph, label] of legendParts) {
    const gs = sv('tspan', { style: 'fill: var(--ink-soft); font-family: var(--font-head);' });
    gs.textContent = glyph;
    const ls = sv('tspan');
    ls.textContent = label;
    legendText.append(gs, ls);
  }
  legend.append(legendText);
  seals.append(legend);

  // scale bar (bottom-right): a surveyor's cho — pure furniture, ink-faint
  const scale = sv('g');
  stroke(
    scale,
    scrawl(
      [
        [812, 736],
        [902, 736],
      ],
      'scale-b',
      0.7,
    ),
    'var(--ink-faint)',
    1.4,
  );
  stroke(scale, 'M812,731 l0,10', 'var(--ink-faint)', 1.2);
  stroke(scale, 'M902,731 l0,10', 'var(--ink-faint)', 1.2);
  scale.append(
    sv(
      'text',
      {
        x: '857',
        y: '726',
        'text-anchor': 'middle',
        class: 'ezu-caption',
        style: 'font-size: 11px; fill: var(--ink-faint);',
      },
      '一町',
    ),
  );
  seals.append(scale);

  container.append(style, wrap);
}
