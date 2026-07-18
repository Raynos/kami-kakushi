// pictograms/glyphs.ts — the #15 A/B's eleven item pictograms, drawn to the
// stroke grammar in this dir's README: 32×32 grid, ≤5 paths per glyph, ONE
// weight (2.0) + ONE colour (var(--ink)), all jitter through the shared
// map-sheets brush hand (rng/scrawl — TST1: one jitter home; TST2:
// seeded-deterministic, golden-pinned). Pure SVG-DOM emitters — no DOM
// reads, no game imports. DEV-only (reached via the protos-pane sheet
// alone); NOTHING here ships without the A/B's HR verdict.
//
// API idiom follows brush.ts G-7: emitters take (parent, …, o) with the
// seed in a named opts type.

import { rng, scrawl, sv } from '../map-sheets/brush';
import type { SeedOpts } from '../map-sheets/brush';
import type { Pt } from '../map-sheets/geom';

/** The drawing cell — glyphs are authored on a 32×32 unit grid. */
export const PICTO_GRID = 32;

/** ONE weight register (grammar law) — every line stroke is this wide. */
const W = 2;
/** ONE jitter amplitude — subtle enough to survive 16px row scale. */
const AMP = 0.7;
/** ONE colour — the cooled-emoji column is the colourful one. */
const INK = 'var(--ink)';

// ── the three stroke emitters (each appends exactly ONE path) ──────────────

function inkPath(parent: SVGElement, d: string): SVGPathElement {
  const p = sv('path', {
    d,
    fill: 'none',
    stroke: INK,
    'stroke-width': String(W),
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  });
  parent.append(p);
  return p;
}

/** One open brush stroke through pts. */
function line(parent: SVGElement, pts: readonly Pt[], seed: string): void {
  inkPath(parent, scrawl(pts, seed, AMP));
}

/** One closed brush stroke (outline silhouettes). */
function ring(parent: SVGElement, pts: readonly Pt[], seed: string): void {
  inkPath(parent, scrawl(pts, seed, AMP, true));
}

/** Several short ticks as ONE path (one stroke by the grammar's count). */
function ticks(
  parent: SVGElement,
  segs: readonly (readonly Pt[])[],
  seed: string,
): void {
  inkPath(parent, segs.map((s, i) => scrawl(s, `${seed}:${i}`, AMP)).join(' '));
}

/** A dot cluster as ONE filled path (grain, embers) — arc-pair subpaths. */
function dots(
  parent: SVGElement,
  centers: readonly Pt[],
  r: number,
  seed: string,
): void {
  const rand = rng(seed);
  let d = '';
  for (const [x, y] of centers) {
    const rad = Number((r * (0.8 + rand() * 0.4)).toFixed(2));
    const cx = Number((x + (rand() - 0.5) * 2 * AMP).toFixed(1));
    const cy = Number((y + (rand() - 0.5) * 2 * AMP).toFixed(1));
    d += `M${cx - rad},${cy} a${rad},${rad} 0 1,0 ${rad * 2},0 a${rad},${rad} 0 1,0 ${-rad * 2},0 `;
  }
  parent.append(sv('path', { d: d.trimEnd(), fill: INK, stroke: 'none' }));
}

/** A small solid shape as ONE filled path (the deed's seal). */
function solid(parent: SVGElement, pts: readonly Pt[], seed: string): void {
  parent.append(
    sv('path', { d: scrawl(pts, seed, AMP, true), fill: INK, stroke: 'none' }),
  );
}

/** An n-gon approximating a circle, for ring()/solid(). */
function circlePts(cx: number, cy: number, r: number, n = 14): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return pts;
}

// ── the eleven glyphs ──────────────────────────────────────────────────────

export const PICTOGRAM_IDS = [
  'rice',
  'coin',
  'wood',
  'sake',
  'deed',
  'blade',
  'straw_mat',
  'bowl',
  'bedding',
  'hearth',
  'chest',
] as const;

export type PictogramId = (typeof PICTOGRAM_IDS)[number];

type Painter = (g: SVGGElement, seed: string) => void;

const GLYPHS: Readonly<Record<PictogramId, Painter>> = {
  // A bowed grain ear: stem, one leaf, the head heavy with grain.
  rice: (g, seed) => {
    line(
      g,
      [
        [12, 28],
        [13, 20],
        [16, 12],
        [21, 8],
      ],
      `${seed}:stem`,
    );
    line(
      g,
      [
        [13, 21],
        [9, 17],
        [7, 12],
      ],
      `${seed}:leaf`,
    );
    dots(
      g,
      [
        [18, 10],
        [21, 7],
        [24, 5],
        [26, 8],
        [23, 10],
        [26, 12],
        [22, 13],
        [25, 15],
        [20, 12],
      ],
      1.5,
      `${seed}:grain`,
    );
  },

  // A round mon coin with its square hole.
  coin: (g, seed) => {
    ring(g, circlePts(16, 16, 11), `${seed}:rim`);
    ring(
      g,
      [
        [12.5, 12.5],
        [19.5, 12.5],
        [19.5, 19.5],
        [12.5, 19.5],
      ],
      `${seed}:hole`,
    );
  },

  // A log end-on: end ring, heartwood dot, long body, bark ticks.
  wood: (g, seed) => {
    ring(g, circlePts(8.5, 16, 5.5, 12), `${seed}:end`);
    dots(g, [[8.5, 16]], 1.4, `${seed}:heart`);
    line(
      g,
      [
        [10, 11.5],
        [27, 12.5],
        [28, 16],
        [27, 19.5],
        [10, 20.5],
      ],
      `${seed}:body`,
    );
    ticks(
      g,
      [
        [
          [15, 14.5],
          [20, 15],
        ],
        [
          [18, 17.5],
          [23, 18],
        ],
      ],
      `${seed}:bark`,
    );
  },

  // A tokkuri flask, a small cup at its side.
  sake: (g, seed) => {
    ring(
      g,
      [
        [13, 5],
        [17, 5],
        [16.5, 9],
        [20, 12],
        [21.5, 18],
        [20, 25],
        [11, 25],
        [9.5, 18],
        [11, 12],
        [13.5, 9],
      ],
      `${seed}:flask`,
    );
    line(
      g,
      [
        [24, 21],
        [24.5, 25.5],
        [29, 25.5],
        [29.5, 21],
      ],
      `${seed}:cup`,
    );
  },

  // A paper leaf, two lines of writing, the solid seal pressed low.
  deed: (g, seed) => {
    ring(
      g,
      [
        [9, 5],
        [23, 6],
        [24, 27],
        [8, 26],
      ],
      `${seed}:leaf`,
    );
    ticks(
      g,
      [
        [
          [12, 11],
          [20, 11],
        ],
        [
          [12, 15],
          [18, 15],
        ],
      ],
      `${seed}:text`,
    );
    solid(
      g,
      [
        [16.5, 19.5],
        [21, 20],
        [20.5, 24],
        [16, 23.5],
      ],
      `${seed}:seal`,
    );
  },

  // A curved blade, tsuba tick, short wrapped grip.
  blade: (g, seed) => {
    ring(
      g,
      [
        [27, 4],
        [24, 10],
        [18, 17],
        [12, 21],
        [10.5, 19.5],
        [15, 13],
        [22, 7],
      ],
      `${seed}:edge`,
    );
    line(
      g,
      [
        [8, 18],
        [15, 25],
      ],
      `${seed}:tsuba`,
    );
    line(
      g,
      [
        [9.5, 22.5],
        [5, 27],
      ],
      `${seed}:grip`,
    );
  },

  // A flat woven mat, laid in perspective: the panel, its weave, the
  // bound edge — deliberately NOT the log's circle+body construction.
  straw_mat: (g, seed) => {
    ring(
      g,
      [
        [5, 21],
        [14, 10.5],
        [27, 12.5],
        [18, 23],
      ],
      `${seed}:panel`,
    );
    ticks(
      g,
      [
        [
          [9, 19.5],
          [17.5, 13],
        ],
        [
          [12.5, 20.5],
          [21, 14],
        ],
        [
          [16, 21.5],
          [24, 15],
        ],
      ],
      `${seed}:weave`,
    );
    line(
      g,
      [
        [5, 23],
        [18, 25],
      ],
      `${seed}:bind`,
    );
  },

  // A bowl silhouette on its foot ring.
  bowl: (g, seed) => {
    ring(
      g,
      [
        [6, 11],
        [26, 11],
        [24, 17],
        [20, 21],
        [12, 21],
        [8, 17],
      ],
      `${seed}:body`,
    );
    line(
      g,
      [
        [13, 21.5],
        [12.5, 25],
        [19.5, 25],
        [19, 21.5],
      ],
      `${seed}:foot`,
    );
  },

  // A folded futon: two soft slabs, the fold's curl at the left.
  bedding: (g, seed) => {
    ring(
      g,
      [
        [8, 13],
        [26, 13],
        [26.5, 18],
        [8, 18],
      ],
      `${seed}:top`,
    );
    ring(
      g,
      [
        [8, 18],
        [26.5, 18],
        [26, 23.5],
        [8, 23.5],
      ],
      `${seed}:base`,
    );
    line(
      g,
      [
        [8, 13],
        [5.5, 15.5],
        [6, 20.5],
        [8, 23],
      ],
      `${seed}:fold`,
    );
  },

  // An irori: the sunken square pit, the hook line, the hung pot.
  hearth: (g, seed) => {
    ring(
      g,
      [
        [7, 18],
        [25, 18],
        [25, 27],
        [7, 27],
      ],
      `${seed}:pit`,
    );
    line(
      g,
      [
        [16, 3],
        [16, 11],
      ],
      `${seed}:hook`,
    );
    ring(
      g,
      [
        [11.5, 11],
        [20.5, 11],
        [19.5, 16.5],
        [12.5, 16.5],
      ],
      `${seed}:pot`,
    );
    dots(
      g,
      [
        [13, 22.5],
        [17, 23.5],
        [20, 21.5],
      ],
      1.1,
      `${seed}:embers`,
    );
  },

  // A long nagamochi chest: lid, body, feet, the ring handle.
  chest: (g, seed) => {
    ring(
      g,
      [
        [5, 9.5],
        [27, 9.5],
        [26.5, 13],
        [5.5, 13],
      ],
      `${seed}:lid`,
    );
    ring(
      g,
      [
        [6, 13],
        [26, 13],
        [26, 24],
        [6, 24],
      ],
      `${seed}:body`,
    );
    ticks(
      g,
      [
        [
          [8.5, 24],
          [8.5, 27.5],
        ],
        [
          [23.5, 24],
          [23.5, 27.5],
        ],
      ],
      `${seed}:feet`,
    );
    ring(g, circlePts(16, 18, 2, 8), `${seed}:handle`);
  },
};

/** Draw one pictogram into `parent`: appends (and returns) a `<g>` holding
 *  the glyph's strokes, authored on the PICTO_GRID cell. The caller owns
 *  placement/scaling (a transform on the returned group or a viewBox). */
export function drawPictogram(
  parent: SVGElement,
  id: PictogramId,
  o: SeedOpts,
): SVGGElement {
  const g = sv('g', { class: `picto picto-${id}` }) as SVGGElement;
  GLYPHS[id](g, `picto:${id}:${o.seed}`);
  parent.append(g);
  return g;
}
