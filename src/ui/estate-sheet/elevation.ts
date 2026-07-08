// estate-sheet/elevation.ts — the okoshi-ezu drawing vocabulary: elevation-
// grammar emitters (wall faces, roof profiles, shutters, stalls, the ruin
// backdrop, house-scale paper furniture) shared by BOTH variant compositions.
// Ink comes from map-sheets/brush.ts (reused code — this module is part of a
// STANDALONE experiment, not the map-sheets system); every emitter follows
// its idiom: (parent, …geometry, o: XxxOpts), seeded-deterministic, Andon
// tokens only, brush-alive (no uniform CAD polylines on structure).

import {
  brushStroke,
  hatchArea,
  inkLine,
  rng,
  scrawl,
  stipple,
  sv,
  tip,
  wash,
} from '../map-sheets/brush';
import type { Pt } from '../map-sheets/geom';

// ── text (the stamp-book precedent: brush.inkText is head-font only) ─────────

export interface TxtOpts {
  readonly size: number;
  readonly color: string;
  readonly font?: 'head' | 'body';
  readonly vertical?: boolean;
  readonly anchor?: 'start' | 'middle' | 'end';
  readonly opacity?: number;
  readonly angle?: number;
}

export function txt(
  parent: SVGElement,
  x: number,
  y: number,
  text: string,
  o: TxtOpts,
): SVGTextElement {
  const t = sv(
    'text',
    {
      x: String(x),
      y: String(y),
      'text-anchor': o.anchor ?? 'middle',
      style:
        `font-family:var(--font-${o.font ?? 'head'});font-size:${o.size}px;` +
        `fill:${o.color};` +
        (o.vertical ? 'writing-mode:vertical-rl;' : ''),
      ...(o.opacity !== undefined ? { opacity: String(o.opacity) } : {}),
      ...(o.angle ? { transform: `rotate(${o.angle} ${x} ${y})` } : {}),
    },
    text,
  );
  parent.append(t);
  return t;
}

// ── walls & roofs (elevation faces) ──────────────────────────────────────────

export interface WallOpts {
  readonly seed: string;
  /** post rhythm in px (a post stroke every ~postStep) */
  readonly postStep?: number;
  /** white-plaster storehouse body — lighter fill, few posts */
  readonly plaster?: boolean | undefined;
  /** closed-but-kept: vertical shutter boards + a tie mark (H5) */
  readonly closed?: boolean | undefined;
  readonly opacity?: number;
}

/** A wall FACE seen from the yard: flat tone, post-and-beam rhythm, and —
 *  when closed — shutter boards drawn like an open room kept. */
export function wallFace(
  parent: SVGElement,
  x0: number,
  x1: number,
  topY: number,
  groundY: number,
  o: WallOpts,
): void {
  const fill = o.plaster ? 'var(--silver-faint)' : 'var(--steel-2)';
  wash(
    parent,
    [
      [x0, topY],
      [x1, topY],
      [x1, groundY],
      [x0, groundY],
    ],
    { seed: `${o.seed}:w`, fill, opacity: o.opacity ?? (o.plaster ? 0.5 : 0.75), amp: 1.6 },
  );
  const r = rng(`${o.seed}:posts`);
  const step = o.postStep ?? 34;
  if (!o.plaster) {
    for (let x = x0 + step * (0.6 + r() * 0.5); x < x1 - 4; x += step * (0.9 + r() * 0.25)) {
      inkLine(
        parent,
        [
          [x, topY + 1.5],
          [x, groundY - 1],
        ],
        { seed: `${o.seed}:p${Math.round(x)}`, color: 'var(--silver-dim)', w: 1.5, amp: 0.8 },
      );
    }
  }
  // sill / ground beam
  inkLine(
    parent,
    [
      [x0, groundY],
      [x1, groundY],
    ],
    { seed: `${o.seed}:sill`, color: 'var(--silver-dim)', w: 1.8, amp: 1 },
  );
  if (o.closed) {
    const rr = rng(`${o.seed}:shut`);
    for (let x = x0 + 5; x < x1 - 4; x += 7.5 + rr() * 2.5) {
      inkLine(
        parent,
        [
          [x, topY + 4],
          [x, groundY - 3],
        ],
        {
          seed: `${o.seed}:s${Math.round(x)}`,
          color: 'var(--ink-faint)',
          w: 1,
          opacity: 0.8,
          amp: 0.5,
        },
      );
    }
    // the tie holding the shutters — one horizontal band
    inkLine(
      parent,
      [
        [x0 + 3, (topY + groundY) / 2],
        [x1 - 3, (topY + groundY) / 2],
      ],
      { seed: `${o.seed}:tie`, color: 'var(--ink-soft)', w: 2, amp: 1.2 },
    );
  }
}

export interface RoofOpts {
  readonly seed: string;
  /** this era's fresh work — gold ridge + gold rafter ticks (H5) */
  readonly fresh?: boolean | undefined;
  /** lean-to: a single slope, no ridge mass */
  readonly leanTo?: boolean;
  /** ridge overhang beyond the walls, px */
  readonly overhang?: number;
  /** fold-out elevation drawn away from the plan (variant A's south fold):
   *  rafter ticks point back toward the ground line */
  readonly flip?: boolean;
}

/** A roof PROFILE in elevation: filled mass, heavy ridge stroke (gold when
 *  fresh), eave line, sparse rafter ticks. */
export function roofProfile(
  parent: SVGElement,
  x0: number,
  x1: number,
  eaveY: number,
  ridgeY: number,
  o: RoofOpts,
): void {
  const ov = o.overhang ?? 7;
  const structure = o.fresh ? 'var(--gold)' : 'var(--silver)';
  if (o.leanTo) {
    // single slope: high edge at x1 side
    const pts: Pt[] = [
      [x0 - ov, eaveY],
      [x1 + 2, ridgeY],
    ];
    wash(
      parent,
      [
        [x0 - ov, eaveY],
        [x1 + 2, ridgeY],
        [x1 + 2, eaveY],
      ],
      { seed: `${o.seed}:rm`, fill: 'var(--steel-hi)', opacity: 0.14, amp: 1.2 },
    );
    brushStroke(parent, pts, { seed: `${o.seed}:slope`, w: 3, color: structure, dry: true });
    return;
  }
  const midL = x0 + (x1 - x0) * 0.24;
  const midR = x1 - (x1 - x0) * 0.24;
  // the roof mass
  wash(
    parent,
    [
      [x0 - ov, eaveY],
      [midL, ridgeY],
      [midR, ridgeY],
      [x1 + ov, eaveY],
    ],
    { seed: `${o.seed}:rm`, fill: 'var(--steel-hi)', opacity: o.fresh ? 0.22 : 0.14, amp: 1.4 },
  );
  // hips
  inkLine(
    parent,
    [
      [x0 - ov, eaveY],
      [midL, ridgeY],
    ],
    { seed: `${o.seed}:hl`, color: 'var(--silver-dim)', w: 1.6, amp: 1 },
  );
  inkLine(
    parent,
    [
      [midR, ridgeY],
      [x1 + ov, eaveY],
    ],
    { seed: `${o.seed}:hr`, color: 'var(--silver-dim)', w: 1.6, amp: 1 },
  );
  // THE ridge — the structure stroke
  brushStroke(
    parent,
    [
      [midL - 2, ridgeY],
      [midR + 2, ridgeY],
    ],
    { seed: `${o.seed}:ridge`, w: 3.6, color: structure },
  );
  // eave line
  brushStroke(
    parent,
    [
      [x0 - ov, eaveY],
      [x1 + ov, eaveY],
    ],
    { seed: `${o.seed}:eave`, w: 2.2, color: o.fresh ? 'var(--gold-dim)' : 'var(--silver-dim)' },
  );
  // sparse rafter ticks under the eave
  const r = rng(`${o.seed}:ticks`);
  const tick = o.flip ? -3.4 : 3.4;
  for (let x = x0 + 6; x < x1 - 4; x += 11 + r() * 6) {
    inkLine(
      parent,
      [
        [x, eaveY],
        [x - 2, eaveY + tick],
      ],
      {
        seed: `${o.seed}:t${Math.round(x)}`,
        color: o.fresh ? 'var(--gold-dim)' : 'var(--ink-faint)',
        w: 0.9,
        opacity: 0.8,
        amp: 0.4,
      },
    );
  }
}

// ── plan-view marks (variant A's centre) ─────────────────────────────────────

export interface TatamiOpts {
  readonly seed: string;
  readonly step?: number;
  readonly color?: string;
}

/** Tatami grid inside a plan room — fine register; the close view pays craft. */
export function tatamiPlan(
  parent: SVGElement,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  o: TatamiOpts,
): void {
  const step = o.step ?? 13;
  const g = sv('g', { class: 'es-fine' });
  const r = rng(o.seed);
  // a floor texture, not masonry: faint hairlines, sparse bond verticals
  for (let y = y0 + step; y < y1 - 2; y += step) {
    inkLine(
      g,
      [
        [x0 + 1.5, y],
        [x1 - 1.5, y],
      ],
      {
        seed: `${o.seed}:h${Math.round(y)}`,
        color: o.color ?? 'var(--ink-faint)',
        w: 0.55,
        opacity: 0.38,
        amp: 0.4,
      },
    );
  }
  let odd = r() > 0.5;
  for (let y = y0; y < y1 - 2; y += step) {
    const yb = Math.min(y + step, y1 - 1.5);
    for (let x = x0 + (odd ? step * 2.5 : step * 1.5); x < x1 - 2; x += step * 3) {
      inkLine(
        g,
        [
          [x, y + 1.5],
          [x, yb],
        ],
        {
          seed: `${o.seed}:v${Math.round(x)}-${Math.round(y)}`,
          color: o.color ?? 'var(--ink-faint)',
          w: 0.55,
          opacity: 0.38,
          amp: 0.4,
        },
      );
    }
    odd = !odd;
  }
  parent.append(g);
}

export interface HingeOpts {
  readonly seed: string;
  /** which side of the edge the paste-tabs sit, +1 or −1 (screen-y direction) */
  readonly tabSide?: 1 | -1;
  readonly tabs?: number;
}

/** A fold hinge (variant A): the dash line the paper folds on + paste tabs —
 *  the sheet admits it wants to be cut out and stood up (D2). */
export function foldHinge(parent: SVGElement, a: Pt, b: Pt, o: HingeOpts): void {
  inkLine(parent, [a, b], {
    seed: `${o.seed}:h`,
    color: 'var(--ink-soft)',
    w: 1.1,
    dash: '7 5',
    amp: 0.5,
    opacity: 0.9,
  });
  const n = o.tabs ?? 2;
  const side = o.tabSide ?? 1;
  const r = rng(`${o.seed}:tabs`);
  for (let i = 1; i <= n; i++) {
    const t = i / (n + 1) + (r() - 0.5) * 0.06;
    const cx = a[0] + (b[0] - a[0]) * t;
    const cy = a[1] + (b[1] - a[1]) * t;
    // trapezoid tab along the edge (assumes near-axis-aligned hinge edges)
    const horiz = Math.abs(b[0] - a[0]) > Math.abs(b[1] - a[1]);
    const wHalf = 11;
    const d = 7 * side;
    const p: Pt[] = horiz
      ? [
          [cx - wHalf, cy],
          [cx - wHalf + 4, cy + d],
          [cx + wHalf - 4, cy + d],
          [cx + wHalf, cy],
        ]
      : [
          [cx, cy - wHalf],
          [cx + d, cy - wHalf + 4],
          [cx + d, cy + wHalf - 4],
          [cx, cy + wHalf],
        ];
    const path = sv('path', {
      d: scrawl(p, `${o.seed}:tab${i}`, 1, true),
      fill: 'var(--steel-2)',
      'fill-opacity': '0.5',
      stroke: 'var(--ink-faint)',
      'stroke-width': '0.9',
    });
    parent.append(path);
  }
}

// ── the stable court (H3's loudest wrongness) ────────────────────────────────

export interface StallOpts {
  readonly seed: string;
  readonly stalls: number;
  /** the one occupied stall (index from the low end) */
  readonly muleAt: number;
  /** 'plan' divides across y; 'elev' divides across x */
  readonly mode: 'plan' | 'elev';
}

/** Stall divisions for twenty horses, holding one mule: repeated dividers +
 *  the single small animal. */
export function stallRange(
  parent: SVGElement,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  o: StallOpts,
): void {
  const n = o.stalls;
  if (o.mode === 'plan') {
    const step = (y1 - y0) / n;
    for (let i = 1; i < n; i++) {
      inkLine(
        parent,
        [
          [x0 + 1, y0 + i * step],
          [x1 - 1, y0 + i * step],
        ],
        { seed: `${o.seed}:d${i}`, color: 'var(--silver-dim)', w: 1, opacity: 0.85, amp: 0.5 },
      );
    }
    const my = y0 + (o.muleAt + 0.5) * step;
    muleGlyph(parent, (x0 + x1) / 2, my, Math.min(step * 0.62, (x1 - x0) * 0.4), {
      seed: `${o.seed}:mule`,
    });
  } else {
    const step = (x1 - x0) / n;
    for (let i = 1; i < n; i++) {
      inkLine(
        parent,
        [
          [x0 + i * step, y0 + 2],
          [x0 + i * step, y1 - 1],
        ],
        { seed: `${o.seed}:d${i}`, color: 'var(--silver-dim)', w: 1, opacity: 0.85, amp: 0.5 },
      );
    }
    const mx = x0 + (o.muleAt + 0.5) * step;
    muleGlyph(parent, mx, y1 - (y1 - y0) * 0.32, Math.min(step * 0.8, (y1 - y0) * 0.75), {
      seed: `${o.seed}:mule`,
    });
  }
}

export interface MuleOpts {
  readonly seed: string;
}

/** One small brush mule — an ink silhouette, not an illustration: body stroke,
 *  leg ticks, neck + long ears. Seed-jittered so it reads hand-drawn. */
export function muleGlyph(
  parent: SVGElement,
  cx: number,
  cy: number,
  s: number,
  o: MuleOpts,
): void {
  const r = rng(o.seed);
  const g = sv('g');
  const bw = s;
  const bh = s * 0.34;
  // body — one bellied stroke
  brushStroke(
    g,
    [
      [cx - bw / 2, cy],
      [cx, cy - bh * 0.35 - r() * 2],
      [cx + bw / 2 - s * 0.12, cy - bh * 0.1],
    ],
    { seed: `${o.seed}:b`, w: bh, color: 'var(--silver-dim)', taperIn: 0.3, taperOut: 0.24 },
  );
  // legs
  for (const t of [0.16, 0.34, 0.68, 0.86]) {
    const lx = cx - bw / 2 + bw * t + (r() - 0.5) * 1.5;
    inkLine(
      g,
      [
        [lx, cy + bh * 0.1],
        [lx + (r() - 0.5) * 2, cy + bh * 1.15],
      ],
      { seed: `${o.seed}:l${t}`, color: 'var(--silver-dim)', w: 1.1, amp: 0.4 },
    );
  }
  // neck + head, ears long (a mule, not a horse)
  const hx = cx + bw / 2 + s * 0.08;
  const hy = cy - bh * 0.9;
  inkLine(
    g,
    [
      [cx + bw / 2 - s * 0.14, cy - bh * 0.2],
      [hx, hy],
    ],
    { seed: `${o.seed}:n`, color: 'var(--silver-dim)', w: 2.2, amp: 0.6 },
  );
  inkLine(
    g,
    [
      [hx, hy],
      [hx + s * 0.14, hy + s * 0.05],
    ],
    { seed: `${o.seed}:hd`, color: 'var(--silver-dim)', w: 1.8, amp: 0.4 },
  );
  for (const dx of [-0.02, 0.07]) {
    inkLine(
      g,
      [
        [hx + s * dx, hy],
        [hx + s * dx + 1, hy - s * 0.17],
      ],
      { seed: `${o.seed}:e${dx}`, color: 'var(--silver-dim)', w: 1, amp: 0.3 },
    );
  }
  tip(g as unknown as SVGElement, 'housing for twenty · one mule');
  parent.append(g);
}

// ── the ruin backdrop (H4 — the scale-shock indoors) ─────────────────────────

export interface RuinOpts {
  readonly seed: string;
  /** px per ken */
  readonly ken: number;
  /** compound-x → px */
  readonly toX: (kx: number) => number;
  /** the honesty seam: named 本邸 only when revealed (H5) */
  readonly revealed: boolean;
  /** masses: from house.ts RUIN */
  readonly masses: readonly {
    readonly kind: 'wall' | 'gate' | 'fallen';
    readonly x0: number;
    readonly x1: number;
    readonly h: number;
    readonly seed: string;
  }[];
}

/** The old precinct's remains at the SAME ken scale, rising from a ground
 *  line: broken wall runs, the crumbled great gate towering past every lived
 *  ridge, fallen roof planes, rubble, grass breach. Depicted, never honestly
 *  named (pre-reveal: a curt 廃 only). */
export function ruinBackdrop(parent: SVGElement, groundY: number, o: RuinOpts): void {
  const g = sv('g');
  // ash band behind everything
  const xa = o.toX(Math.min(...o.masses.map((m) => m.x0))) - 8;
  const xb = o.toX(Math.max(...o.masses.map((m) => m.x1))) + 8;
  wash(
    g,
    [
      [xa, groundY - o.ken * 3.1],
      [xb, groundY - o.ken * 3.1],
      [xb, groundY],
      [xa, groundY],
    ],
    { seed: `${o.seed}:ash`, fill: 'var(--steel-2)', opacity: 0.3, amp: 6 },
  );
  for (const m of o.masses) {
    const x0 = o.toX(m.x0);
    const x1 = o.toX(m.x1);
    const top = groundY - m.h * o.ken;
    const r = rng(`${o.seed}:${m.seed}`);
    if (m.kind === 'wall') {
      // a standing stretch with a broken, stepped top edge
      const steps = 4 + Math.floor(r() * 3);
      const topPts: Pt[] = [[x0, groundY - m.h * o.ken * (0.55 + r() * 0.3)]];
      for (let i = 1; i <= steps; i++) {
        const tx = x0 + ((x1 - x0) * i) / steps;
        topPts.push([tx, top + (r() - 0.35) * m.h * o.ken * 0.5]);
      }
      wash(g, [[x0, groundY], ...topPts, [x1, groundY]], {
        seed: `${o.seed}:${m.seed}:m`,
        fill: 'var(--steel-hi)',
        opacity: 0.12,
        amp: 2,
      });
      brushStroke(g, topPts, {
        seed: `${o.seed}:${m.seed}:top`,
        w: 2.8,
        color: 'var(--silver-dim)',
        dry: true,
        wobble: 0.3,
      });
      inkLine(
        g,
        [
          [x0, groundY],
          [topPts[0]![0], topPts[0]![1]],
        ],
        {
          seed: `${o.seed}:${m.seed}:l`,
          color: 'var(--silver-dim)',
          w: 1.4,
          amp: 1.2,
        },
      );
      inkLine(
        g,
        [
          [x1, groundY],
          [topPts[topPts.length - 1]![0], topPts[topPts.length - 1]![1]],
        ],
        {
          seed: `${o.seed}:${m.seed}:r`,
          color: 'var(--silver-dim)',
          w: 1.4,
          amp: 1.2,
        },
      );
      // masonry courses — what says WALL, not hill: faint broken bed-joints
      for (let c = 1; c <= 2; c++) {
        const cy = groundY - (m.h * o.ken * c) / 3.2;
        inkLine(
          g,
          [
            [x0 + 3 + r() * 5, cy + (r() - 0.5) * 3],
            [x1 - 3 - r() * 5, cy + (r() - 0.5) * 3],
          ],
          {
            seed: `${o.seed}:${m.seed}:c${c}`,
            color: 'var(--ink-faint)',
            w: 0.9,
            opacity: 0.7,
            dash: '9 5',
            amp: 0.8,
          },
        );
      }
      // rubble shed at the wall's foot
      stipple(
        g,
        [
          [x0 - 4, groundY - 6],
          [x1 + 4, groundY - 6],
          [x1 + 6, groundY],
          [x0 - 6, groundY],
        ],
        { seed: `${o.seed}:${m.seed}:rb`, step: 7, prob: 0.4, r: 0.9, color: 'var(--ink-faint)' },
      );
    } else if (m.kind === 'gate') {
      // the crumbled great gate: two heavy piers + a sagging lintel/roof mass
      const pw = (x1 - x0) * 0.16;
      for (const [px0, px1, hs] of [[x0, x0 + pw, 1] as const, [x1 - pw, x1, 0.92] as const]) {
        wash(
          g,
          [
            [px0, groundY],
            [px0 + 1, top + m.h * o.ken * (1 - hs) + o.ken * 0.9],
            [px1 - 1, top + m.h * o.ken * (1 - hs) + o.ken * 0.95],
            [px1, groundY],
          ],
          { seed: `${o.seed}:${m.seed}:p${px0}`, fill: 'var(--steel-hi)', opacity: 0.16, amp: 2 },
        );
        brushStroke(
          g,
          [
            [px0 + 2, groundY],
            [px0 + 3, top + m.h * o.ken * (1 - hs) + o.ken * 0.9],
          ],
          { seed: `${o.seed}:${m.seed}:ps${px0}`, w: 3.4, color: 'var(--silver-dim)', dry: true },
        );
      }
      // the sagging great roof silhouette
      const sag = o.ken * 0.5;
      const roofPts: Pt[] = [
        [x0 - o.ken * 0.5, top + o.ken * 1.15],
        [x0 + (x1 - x0) * 0.3, top + sag * (0.4 + r() * 0.4)],
        [x0 + (x1 - x0) * 0.62, top + sag * (0.3 + r() * 0.5)],
        [x1 + o.ken * 0.5, top + o.ken * 1.05],
      ];
      wash(g, [...roofPts, [x1, top + o.ken * 1.7], [x0, top + o.ken * 1.75]], {
        seed: `${o.seed}:${m.seed}:rm`,
        fill: 'var(--steel-hi)',
        opacity: 0.18,
        amp: 2.4,
      });
      brushStroke(g, roofPts, {
        seed: `${o.seed}:${m.seed}:ridge`,
        w: 4.2,
        color: 'var(--silver)',
        dry: true,
        wobble: 0.26,
      });
      // gap where the doors were — grass breaching the threshold
      grassTufts(g, x0 + pw + 4, x1 - pw - 4, groundY, `${o.seed}:${m.seed}:grass`, 5);
    } else {
      // a fallen roof plane — collapsed geometry + rubble
      wash(
        g,
        [
          [x0, groundY],
          [x0 + (x1 - x0) * 0.2, top],
          [x1, groundY - (top - groundY) * -0.24],
          [x1, groundY],
        ],
        { seed: `${o.seed}:${m.seed}:f`, fill: 'var(--steel-hi)', opacity: 0.1, amp: 2 },
      );
      brushStroke(
        g,
        [
          [x0, groundY],
          [x0 + (x1 - x0) * 0.24, top],
          [x1, groundY - m.h * o.ken * 0.24],
        ],
        { seed: `${o.seed}:${m.seed}:fs`, w: 2.4, color: 'var(--silver-dim)', dry: true },
      );
      stipple(
        g,
        [
          [x0, groundY - m.h * o.ken * 0.5],
          [x1, groundY - m.h * o.ken * 0.5],
          [x1, groundY],
          [x0, groundY],
        ],
        { seed: `${o.seed}:${m.seed}:rub`, step: 8, prob: 0.4, r: 0.9, color: 'var(--ink-faint)' },
      );
      grassTufts(g, x0, x1, groundY, `${o.seed}:${m.seed}:g`, 3);
    }
  }
  tip(g as unknown as SVGElement, o.revealed ? '本邸 — the Main house' : '…the ruined compound');
  parent.append(g);
}

/** A few grass tufts breaching a ground line. */
export function grassTufts(
  parent: SVGElement,
  x0: number,
  x1: number,
  groundY: number,
  seed: string,
  n: number,
): void {
  const r = rng(seed);
  for (let i = 0; i < n; i++) {
    const x = x0 + (x1 - x0) * ((i + 0.5) / n) + (r() - 0.5) * 6;
    for (let b = 0; b < 3; b++) {
      inkLine(
        parent,
        [
          [x, groundY],
          [x + (b - 1) * 2.6 + (r() - 0.5) * 2, groundY - 4.5 - r() * 4],
        ],
        { seed: `${seed}:${i}:${b}`, color: 'var(--silver-dim)', w: 0.9, opacity: 0.8, amp: 0.4 },
      );
    }
  }
}

// ── the reviser's marks (H5) ─────────────────────────────────────────────────

export interface StampOpts {
  readonly seed: string;
}

/** A small 新 stamp in the reviser's red — what this survey added. */
export function freshStamp(parent: SVGElement, cx: number, cy: number, o: StampOpts): void {
  const r = rng(o.seed);
  const s = 9;
  const rot = ((r() - 0.5) * 14).toFixed(1);
  const g = sv('g', { transform: `rotate(${rot} ${cx} ${cy})` });
  const p = sv('path', {
    d: scrawl(
      [
        [cx - s, cy - s],
        [cx + s, cy - s],
        [cx + s, cy + s],
        [cx - s, cy + s],
      ],
      `${o.seed}:f`,
      1.6,
      true,
    ),
    fill: 'none',
    stroke: 'var(--shu)',
    'stroke-width': '1.6',
    opacity: '0.92',
  });
  g.append(p);
  txt(g, cx, cy + 4.4, '新', { size: 12, color: 'var(--shu)' });
  tip(g as unknown as SVGElement, 'the reviser: new work this survey');
  parent.append(g);
}

/** The reviser's strike — a shu stroke through what a repair replaced. */
export function struckMark(parent: SVGElement, a: Pt, b: Pt, o: StampOpts): void {
  brushStroke(parent, [a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 2], b], {
    seed: `${o.seed}:x`,
    w: 2.4,
    color: 'var(--shu)',
    opacity: 0.85,
    taperIn: 0.3,
    taperOut: 0.3,
  });
}

// ── paper furniture at house scale ───────────────────────────────────────────

export interface CartoucheOpts {
  readonly seed: string;
  /** the honesty seam: 母屋起絵図 pre-reveal · 客殿起絵図 + 改 after (H1/H5) */
  readonly revealed: boolean;
}

/** The title cartouche + hanko. The sheet believes the 母屋 lie until the
 *  reveal turns its own name honest. */
export function cartouche(parent: SVGElement, x: number, y: number, o: CartoucheOpts): void {
  const w = 46;
  const h = 148;
  const g = sv('g');
  wash(
    g,
    [
      [x, y],
      [x + w, y],
      [x + w, y + h],
      [x, y + h],
    ],
    {
      seed: `${o.seed}:bg`,
      fill: 'var(--steel-1)',
      opacity: 0.9,
      amp: 1.6,
      stroke: 'var(--silver-dim)',
      strokeW: 1.4,
    },
  );
  inkLine(
    g,
    [
      [x + 3, y + 3],
      [x + w - 3, y + 3],
      [x + w - 3, y + h - 3],
      [x + 3, y + h - 3],
      [x + 3, y + 3],
    ],
    { seed: `${o.seed}:in`, color: 'var(--silver-faint)', w: 0.8, amp: 0.8 },
  );
  txt(g, x + w / 2, y + 12, o.revealed ? '客殿起絵図' : '母屋起絵図', {
    size: 17,
    color: 'var(--silver-hi)',
    vertical: true,
    anchor: 'start',
  });
  // the hanko
  const hy = y + h - 22;
  const hs = 13;
  const hk = sv('path', {
    d: scrawl(
      [
        [x + w / 2 - hs / 2, hy - hs / 2],
        [x + w / 2 + hs / 2, hy - hs / 2],
        [x + w / 2 + hs / 2, hy + hs / 2],
        [x + w / 2 - hs / 2, hy + hs / 2],
      ],
      `${o.seed}:hanko`,
      1.2,
      true,
    ),
    fill: 'var(--shu)',
    opacity: '0.85',
  });
  g.append(hk);
  txt(g, x + w / 2, hy + 3.6, '改', { size: 9, color: 'var(--steel-0)' });
  if (o.revealed) {
    // the reveal's own correction beside the title, in the reviser's hand
    txt(g, x + w + 9, y + 12, '母屋トハ誤リ', {
      size: 9,
      color: 'var(--shu)',
      vertical: true,
      anchor: 'start',
      opacity: 0.9,
    });
  }
  tip(
    g as unknown as SVGElement,
    o.revealed
      ? 'fold-up plan of the GUEST HOUSE — the survey corrects its oldest lie'
      : 'fold-up plan of the main house (so the household believes)',
  );
  parent.append(g);
}

export interface KenBarOpts {
  readonly seed: string;
  readonly ken: number;
  readonly units?: number;
}

/** The period scale bar: alternating filled ken segments + 間 label. */
export function kenBar(parent: SVGElement, x: number, y: number, o: KenBarOpts): void {
  const n = o.units ?? 5;
  const g = sv('g');
  for (let i = 0; i < n; i++) {
    const seg = sv('path', {
      d: scrawl(
        [
          [x + i * o.ken, y],
          [x + (i + 1) * o.ken, y],
          [x + (i + 1) * o.ken, y + 5],
          [x + i * o.ken, y + 5],
        ],
        `${o.seed}:s${i}`,
        0.8,
        true,
      ),
      fill: i % 2 === 0 ? 'var(--silver-dim)' : 'none',
      stroke: 'var(--silver-dim)',
      'stroke-width': '1',
    });
    g.append(seg);
  }
  txt(g, x + (n * o.ken) / 2, y + 17, `${n}間`, {
    size: 10,
    color: 'var(--ink-soft)',
    font: 'body',
  });
  parent.append(g);
}

export interface LegendOpts {
  readonly seed: string;
}

/** The 凡例 — decodes REPAIR marks only (新 fresh · shu strike · shutters).
 *  The ruin and the alcove-in-a-corridor stay deliberately outside it. */
export function legendBox(parent: SVGElement, x: number, y: number, o: LegendOpts): void {
  const w = 118;
  const h = 64;
  const g = sv('g');
  wash(
    g,
    [
      [x, y],
      [x + w, y],
      [x + w, y + h],
      [x, y + h],
    ],
    {
      seed: `${o.seed}:bg`,
      fill: 'var(--steel-1)',
      opacity: 0.85,
      amp: 1.4,
      stroke: 'var(--silver-faint)',
      strokeW: 1,
    },
  );
  txt(g, x + w / 2, y + 13, '凡例', { size: 11, color: 'var(--silver-hi)' });
  // 新 — fresh work
  brushStroke(
    g,
    [
      [x + 8, y + 26],
      [x + 26, y + 26],
    ],
    { seed: `${o.seed}:gold`, w: 2.6, color: 'var(--gold)' },
  );
  txt(g, x + 32, y + 29.5, '新 — this season’s work', {
    size: 8.4,
    color: 'var(--ink-soft)',
    font: 'body',
    anchor: 'start',
  });
  // strike — replaced
  brushStroke(
    g,
    [
      [x + 8, y + 40],
      [x + 26, y + 38.5],
    ],
    { seed: `${o.seed}:shu`, w: 2, color: 'var(--shu)', opacity: 0.85 },
  );
  txt(g, x + 32, y + 43, '改 — struck by the reviser', {
    size: 8.4,
    color: 'var(--ink-soft)',
    font: 'body',
    anchor: 'start',
  });
  // shutters — closed-but-kept
  for (const dx of [10, 15, 20]) {
    inkLine(
      g,
      [
        [x + dx, y + 50],
        [x + dx, y + 58],
      ],
      { seed: `${o.seed}:sh${dx}`, color: 'var(--ink-faint)', w: 1, amp: 0.3 },
    );
  }
  txt(g, x + 32, y + 56.5, 'closed — kept, not lost', {
    size: 8.4,
    color: 'var(--ink-soft)',
    font: 'body',
    anchor: 'start',
  });
  parent.append(g);
}

// ── small life marks ─────────────────────────────────────────────────────────

/** Hearth smoke — one wavering thin line rising. */
export function smokeWisp(parent: SVGElement, x: number, y: number, seed: string): void {
  const r = rng(seed);
  const pts: Pt[] = [[x, y]];
  let cx = x;
  for (let i = 1; i <= 4; i++) {
    cx += (r() - 0.5) * 10;
    pts.push([cx, y - i * (9 + r() * 4)]);
  }
  inkLine(parent, pts, {
    seed: `${seed}:l`,
    color: 'var(--silver-faint)',
    w: 1.1,
    opacity: 0.7,
    amp: 2.4,
  });
}

/** The well ring (plan): double scrawled circle. */
export function wellRing(
  parent: SVGElement,
  cx: number,
  cy: number,
  rad: number,
  seed: string,
): void {
  for (const [rr, w] of [
    [rad, 1.8],
    [rad * 0.62, 1],
  ] as const) {
    const steps = 10;
    const pts: Pt[] = [];
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
    }
    inkLine(parent, pts, { seed: `${seed}:${rr}`, color: 'var(--silver-dim)', w, amp: 0.7 });
  }
}

/** Rake arcs over swept ground (plan) — sparse concentric combs. */
export function rakeArcs(
  parent: SVGElement,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  seed: string,
): void {
  const g = sv('g', { class: 'es-fine' });
  const r = rng(seed);
  // ORDERLY broom passes — aligned shallow arc rows, so the ground reads
  // swept (raked, tended), never scrub. All arcs bow the same way.
  const rowStep = 26;
  const colStep = 34;
  for (let y = y0 + rowStep * 0.7; y < y1 - 6; y += rowStep) {
    for (
      let x = x0 + colStep * 0.5 + ((Math.round(y) % 2) * colStep) / 2;
      x < x1 - 10;
      x += colStep
    ) {
      if (r() < 0.25) continue;
      const wArc = 20 + r() * 6;
      const bow = 3.2 + r() * 1.4;
      const pts: Pt[] = [];
      for (let s = 0; s <= 4; s++) {
        const t = s / 4;
        pts.push([x + wArc * t, y - Math.sin(t * Math.PI) * bow]);
      }
      inkLine(g, pts, {
        seed: `${seed}:${Math.round(x)}-${Math.round(y)}`,
        color: 'var(--ink-faint)',
        w: 0.7,
        opacity: 0.5,
        amp: 0.3,
      });
    }
  }
  parent.append(g);
}

/** The steward's board-in-the-kitchen (H3): a tiny desk + hanging ledger. */
export function boardDesk(
  parent: SVGElement,
  x: number,
  y: number,
  seed: string,
  mode: 'plan' | 'elev',
): void {
  const g = sv('g');
  if (mode === 'plan') {
    inkLine(
      g,
      [
        [x - 6, y - 4],
        [x + 6, y - 4],
        [x + 6, y + 4],
        [x - 6, y + 4],
        [x - 6, y - 4],
      ],
      { seed: `${seed}:d`, color: 'var(--silver-dim)', w: 1.1, amp: 0.5 },
    );
    inkLine(
      g,
      [
        [x - 3.5, y - 1.5],
        [x + 3.5, y - 1.5],
      ],
      { seed: `${seed}:b1`, color: 'var(--ink-faint)', w: 0.8, amp: 0.3 },
    );
    inkLine(
      g,
      [
        [x - 3.5, y + 1.2],
        [x + 2, y + 1.2],
      ],
      { seed: `${seed}:b2`, color: 'var(--ink-faint)', w: 0.8, amp: 0.3 },
    );
  } else {
    // elevation: desk profile + the ledger hanging on its hook
    inkLine(
      g,
      [
        [x - 7, y],
        [x + 7, y],
      ],
      { seed: `${seed}:top`, color: 'var(--silver-dim)', w: 1.6, amp: 0.4 },
    );
    for (const dx of [-5.4, 5.4]) {
      inkLine(
        g,
        [
          [x + dx, y],
          [x + dx, y + 7],
        ],
        { seed: `${seed}:lg${dx}`, color: 'var(--silver-dim)', w: 1.1, amp: 0.3 },
      );
    }
    inkLine(
      g,
      [
        [x + 11, y - 12],
        [x + 11, y - 4],
      ],
      { seed: `${seed}:hook`, color: 'var(--ink-soft)', w: 0.9, amp: 0.3 },
    );
    inkLine(
      g,
      [
        [x + 8.6, y - 4],
        [x + 13.4, y - 4],
        [x + 13.4, y + 2.5],
        [x + 8.6, y + 2.5],
        [x + 8.6, y - 4],
      ],
      { seed: `${seed}:ledg`, color: 'var(--ink-soft)', w: 0.9, amp: 0.4 },
    );
  }
  tip(g as unknown as SVGElement, 'the board & day-book — a steward’s room that isn’t');
  parent.append(g);
}

/** The shrine alcove IN the corridor (H3): a torii-less niche — two posts, a
 *  shelf, the offering dot. */
export function altarNiche(
  parent: SVGElement,
  x: number,
  y: number,
  seed: string,
  mode: 'plan' | 'elev',
): void {
  const g = sv('g');
  if (mode === 'plan') {
    // a tiny shrine glyph, not a door: two posts + a wide lintel jutting off
    // the corridor's north line, the offering dot between the posts
    for (const dx of [-4, 4]) {
      inkLine(
        g,
        [
          [x + dx, y + 3],
          [x + dx, y - 5],
        ],
        { seed: `${seed}:p${dx}`, color: 'var(--gold-dim)', w: 1.3, amp: 0.3 },
      );
    }
    inkLine(
      g,
      [
        [x - 6.5, y - 5],
        [x + 6.5, y - 5],
      ],
      { seed: `${seed}:lintel`, color: 'var(--gold-dim)', w: 1.6, amp: 0.3 },
    );
    const dot = sv('circle', {
      cx: String(x),
      cy: String(y),
      r: '1.4',
      fill: 'var(--gold-dim)',
    });
    g.append(dot);
  } else {
    for (const dx of [-6, 6]) {
      inkLine(
        g,
        [
          [x + dx, y],
          [x + dx, y - 13],
        ],
        { seed: `${seed}:p${dx}`, color: 'var(--gold-dim)', w: 1.4, amp: 0.4 },
      );
    }
    inkLine(
      g,
      [
        [x - 8, y - 13],
        [x + 8, y - 13],
      ],
      { seed: `${seed}:sh`, color: 'var(--gold-dim)', w: 1.6, amp: 0.4 },
    );
    const dot = sv('circle', {
      cx: String(x),
      cy: String(y - 5),
      r: '1.6',
      fill: 'var(--gold-dim)',
    });
    g.append(dot);
  }
  tip(g as unknown as SVGElement, 'a shrine alcove… in a corridor');
  parent.append(g);
}

// re-export the hatch for compositions that shade cut planes
export { hatchArea };
