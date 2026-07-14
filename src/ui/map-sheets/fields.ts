// map-sheets/fields.ts — FIELDS & GROUND USE (DEV fold). The worked-land register of
// the estate survey (spec L7 + G7): washed paddy blocks with transplant rows and bund
// outlines, the GHOST bunds of the shrunken estate, terrace runs with numbered stones,
// dry-field furrow hatching, and swept-court ground. Every mark composes brush.ts —
// seeded-deterministic, Andon-Steel tokens only, brush-alive (no uniform CAD lines).

import {
  brushStroke,
  fineLayer,
  inkLine,
  inkText,
  rng,
  wash,
  type SeedOpts,
} from './brush';
import {
  along,
  bbox,
  insetPoly,
  offsetPolyline,
  pointInPoly,
  resample,
  scanlineRuns,
} from './geom';
import type { Pt } from './geom';

// ── internal geometry ────────────────────────────────────────────────────────

/** The field-row engine — geom.scanlineRuns at the transplant-row register (G-5):
 *  5-unit sampling, rows phased half a spacing in from the bbox edge. */
function rowSegments(
  poly: readonly Pt[],
  angleDeg: number,
  spacing: number,
  r: () => number,
  jitter: number,
): { a: Pt; b: Pt }[] {
  return scanlineRuns(poly, {
    angleDeg,
    spacing,
    r,
    jitter,
    step: 5,
    phase: spacing / 2,
  });
}

/** The stretch of a polyline between fractions t0..t1 of its point run. */
function slicePolyline(pts: readonly Pt[], t0: number, t1: number): Pt[] {
  const rs = resample(pts, 6);
  const i0 = Math.max(0, Math.floor(t0 * (rs.length - 1)));
  const i1 = Math.min(rs.length - 1, Math.ceil(t1 * (rs.length - 1)));
  return rs.slice(i0, i1 + 1);
}

/** A field-bund outline drawn edge-by-edge: each side its own tapered brush pull,
 *  overlapping slightly at the corners the way a surveyor rejoins a line — never one
 *  continuous CAD loop. */
function bundOutline(
  parent: SVGElement,
  poly: readonly Pt[],
  seed: string,
  w: number,
  color: string,
): void {
  const r = rng(seed);
  const n = poly.length;
  for (let i = 0; i < n; i++) {
    const a = poly[i]!;
    const b = poly[(i + 1) % n]!;
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (len < 4) continue;
    const ux = (b[0] - a[0]) / len;
    const uy = (b[1] - a[1]) / len;
    const ext = Math.min(4, len * 0.12);
    const pts: Pt[] = [
      [a[0] - ux * ext, a[1] - uy * ext],
      [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2],
      [b[0] + ux * ext, b[1] + uy * ext],
    ];
    brushStroke(parent, pts, {
      seed: `${seed}:e${i}`,
      w: w * (0.88 + r() * 0.3),
      color,
      taperIn: 0.22,
      taperOut: 0.26,
      amp: 1.3,
    });
  }
}

const KANJI_DIGIT = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

/** 1..99 as period kanji numerals (一 二 三 … 十 十一 … 二十一 …). */
function kanjiNum(n: number): string {
  if (n < 1) return '〇';
  if (n < 10) return KANJI_DIGIT[n]!;
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return (
    (tens > 1 ? KANJI_DIGIT[tens]! : '') +
    '十' +
    (ones ? KANJI_DIGIT[ones]! : '')
  );
}

/** A terrace-count stone: small irregular washed stone + its kanji numeral (the
 *  T1 wrong-thing made legible — the numbering runs on into the scrub, G7). */
function stoneNumeral(
  parent: SVGElement,
  [x, y]: Pt,
  n: number,
  seed: string,
): void {
  const r = rng(seed);
  const wide = n >= 10;
  const rad = (wide ? 9 : 7.2) + r() * 1.2;
  const k = 7;
  const pts: Pt[] = [];
  for (let i = 0; i < k; i++) {
    const a = (i / k) * Math.PI * 2 + r() * 0.25;
    const rr = rad * (0.92 + r() * 0.16);
    pts.push([
      x + Math.cos(a) * rr * (wide ? 1.2 : 1),
      y + Math.sin(a) * rr * 0.85,
    ]);
  }
  wash(parent, pts, {
    seed: `${seed}:s`,
    fill: 'var(--steel-hi)',
    amp: 0.5,
    stroke: 'var(--silver-wire)',
    strokeW: 0.7,
  });
  inkText(parent, x, y + 3.6, kanjiNum(n), {
    size: wide ? 9 : 10.5,
    color: 'var(--ink)',
  });
}

/** A scrub tuft — a small fan of grass pulls where the field has let go. */
function scrubTuft(
  parent: SVGElement,
  [x, y]: Pt,
  seed: string,
  scale = 1,
): void {
  const r = rng(seed);
  const blades = 4 + Math.floor(r() * 3);
  for (let i = 0; i < blades; i++) {
    const a =
      -Math.PI / 2 + (i / Math.max(1, blades - 1) - 0.5) * (1.1 + r() * 0.6);
    const len = (6 + r() * 5) * scale;
    inkLine(
      parent,
      [
        [x, y],
        [x + Math.cos(a) * len + (r() - 0.5) * 2, y + Math.sin(a) * len],
      ],
      { seed: `${seed}:b${i}`, w: 0.9, color: 'var(--ink-soft)', amp: 0.7 },
    );
  }
}

// ── exports ──────────────────────────────────────────────────────────────────

export interface PaddyBlockOpts {
  readonly seed: string;
  readonly rowAngleDeg?: number;
  readonly wet?: boolean;
}

/** A worked paddy block (spec L7): pale water-tone wash (wet) or drier earth tone,
 *  transplant-row dashes at the field's row angle, and a working-weight bund outline —
 *  the period surveyor's way of saying "this square is planted and holds water".
 *  wet=false drops the silver water sheen for a drier ground. */
export function paddyBlock(
  parent: SVGElement,
  poly: readonly Pt[],
  o: PaddyBlockOpts,
): void {
  const wet = o.wet ?? true;
  const r = rng(o.seed);
  wash(parent, poly, {
    seed: `${o.seed}:wash`,
    fill: 'var(--steel-hi)',
    opacity: wet ? 0.95 : 0.55,
    amp: 3,
  });
  if (wet)
    wash(parent, poly, {
      seed: `${o.seed}:sheen`,
      fill: 'var(--silver-faint)',
      amp: 3,
    });
  const { x0, y0, x1, y1 } = bbox(poly);
  const minDim = Math.min(x1 - x0, y1 - y0);
  const spacing = Math.max(7, Math.min(12, minDim / 8));
  const rows = rowSegments(
    insetPoly(poly, 6),
    o.rowAngleDeg ?? 0,
    spacing,
    r,
    0.22,
  );
  for (let i = 0; i < rows.length; i++) {
    const { a, b } = rows[i]!;
    // stagger each row's start so dash phases never align into a grid
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const sh = (r() * 8) / len;
    const a2: Pt = [a[0] + (b[0] - a[0]) * sh, a[1] + (b[1] - a[1]) * sh];
    const mid: Pt = [
      (a2[0] + b[0]) / 2 + (r() - 0.5) * 2.5,
      (a2[1] + b[1]) / 2 + (r() - 0.5) * 2.5,
    ];
    inkLine(parent, [a2, mid, b], {
      seed: `${o.seed}:row${i}`,
      w: 1,
      color: wet ? 'var(--silver-dim)' : 'var(--ink-soft)',
      dash: `${(3 + r() * 1.2).toFixed(1)} ${(4.5 + r() * 1.6).toFixed(1)}`,
      amp: 0.9,
      opacity: wet ? 0.9 : 0.8,
    });
  }
  bundOutline(parent, poly, `${o.seed}:bund`, 2, 'var(--silver-dim)');
}

export interface GhostBundsOpts {
  readonly seed: string;
  readonly cell?: number;
  readonly angleDeg?: number;
}

/** The FADED traces of former field bunds (G7 — the estate was four times wider; this
 *  is that, drawn): a faint dotted irregular grid filling the polygon, stretches lost
 *  where the stones were robbed or ploughed out. angleDeg (optional extra) aligns the
 *  ghost grid with a living block's pattern so the traces read as its continuation. */
export function ghostBunds(
  parent: SVGElement,
  poly: readonly Pt[],
  o: GhostBundsOpts,
): void {
  const r = rng(o.seed);
  const cell = o.cell ?? 46;
  const baseAng = o.angleDeg ?? (r() - 0.5) * 6;
  const dirs: [number, string][] = [
    [baseAng, 'h'],
    [baseAng + 87 + r() * 5, 'v'],
  ];
  for (const [ang, sfx] of dirs) {
    const segs = rowSegments(poly, ang, cell * (0.88 + r() * 0.26), r, 0.4);
    for (let i = 0; i < segs.length; i++) {
      const { a, b } = segs[i]!;
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const pieces = Math.max(1, Math.round(len / (cell * 1.7)));
      for (let p = 0; p < pieces; p++) {
        if (r() < 0.16) continue; // a robbed / ploughed-out stretch
        const t0 = p / pieces + r() * 0.03;
        const t1 = (p + 1) / pieces - r() * 0.04;
        if (t1 - t0 < 0.05) continue;
        let pa: Pt = [a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0];
        let pb: Pt = [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1];
        // each surviving stretch drifts a little off the true line and cocks a hair
        // out of square — a robbed bund is remembered ground, not a survey line
        const rot = (r() - 0.5) * 0.06;
        const mx0 = (pa[0] + pb[0]) / 2;
        const my0 = (pa[1] + pb[1]) / 2;
        const turn = ([x, y]: Pt): Pt => [
          mx0 + (x - mx0) * Math.cos(rot) - (y - my0) * Math.sin(rot),
          my0 + (x - mx0) * Math.sin(rot) + (y - my0) * Math.cos(rot),
        ];
        pa = turn(pa);
        pb = turn(pb);
        const mid: Pt = [
          (pa[0] + pb[0]) / 2 + (r() - 0.5) * 6,
          (pa[1] + pb[1]) / 2 + (r() - 0.5) * 6,
        ];
        inkLine(parent, [pa, mid, pb], {
          seed: `${o.seed}:${sfx}${i}-${p}`,
          w: 1,
          color: 'var(--ink-faint)',
          dash: '1.7 6.5',
          amp: 1.8,
        });
      }
    }
  }
}

export interface TerraceRunOpts {
  readonly seed: string;
  readonly count: number;
  readonly depth: number;
  readonly letGo?: boolean;
  readonly numberFrom?: number;
  /** true = the walls read as NEW work (T1's re-stacked runs, gold); false/absent
   *  = old laid stone in survey silver (T0 — blind pass 2 read the gold there as
   *  an unexplained "vein", and on the old survey nothing at the terraces is new) */
  readonly fresh?: boolean;
}

/** Stacked terrace strips climbing from the baseline (draw the baseline left→right and
 *  the run climbs up-sheet): each strip a paddy wash held by a retaining-wall brush
 *  stroke — gold for walls in work (built structure), dry-broken silver fragments with
 *  scrub tufts and NO water tone when the run has been let go. numberFrom sets tiny
 *  kanji count-stones at the strip ends (fine layer, L10); the numerals keep counting
 *  on let-go strips — the T1 wrong thing. */
export function terraceRun(
  parent: SVGElement,
  baseline: readonly Pt[],
  o: TerraceRunOpts,
): void {
  const r = rng(o.seed);
  const base = resample(baseline, 14);
  const first = base[0]!;
  const last = base[base.length - 1]!;
  const runAngle =
    (Math.atan2(last[1] - first[1], last[0] - first[0]) * 180) / Math.PI;
  const edges: Pt[][] = [base];
  let acc = 0;
  for (let i = 0; i < o.count; i++) {
    acc += o.depth * (0.85 + r() * 0.3);
    edges.push(offsetPolyline(base, -acc));
  }
  const fine = o.numberFrom === undefined ? null : fineLayer(parent);
  for (let i = 0; i < o.count; i++) {
    const lo = edges[i]!;
    const hi = edges[i + 1]!;
    const strip: Pt[] = [...lo, ...[...hi].reverse()];
    if (o.letGo) {
      wash(parent, strip, {
        seed: `${o.seed}:w${i}`,
        fill: 'var(--steel-2)',
        opacity: 0.8,
        amp: 2.5,
      });
    } else {
      // each strip a held paddy: alternating water tone + its own transplant rows
      // (quiet steel washes — the paddyBlock register; the old steel-hi + solid
      // silver-faint pair read as one giant pale slab at fit view)
      wash(parent, strip, {
        seed: `${o.seed}:w${i}`,
        fill: 'var(--steel-2)',
        opacity: i % 2 === 0 ? 0.68 : 0.5,
        amp: 2.5,
      });
      const rows = rowSegments(insetPoly(strip, 5), runAngle, 8.5, r, 0.2);
      for (let q = 0; q < rows.length; q++) {
        const { a, b } = rows[q]!;
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
        const sh = (r() * 8) / len;
        const a2: Pt = [a[0] + (b[0] - a[0]) * sh, a[1] + (b[1] - a[1]) * sh];
        inkLine(parent, [a2, b], {
          seed: `${o.seed}:row${i}-${q}`,
          w: 0.9,
          color: 'var(--silver-dim)',
          dash: `${(2.8 + r()).toFixed(1)} ${(4.5 + r() * 1.5).toFixed(1)}`,
          amp: 0.8,
          opacity: 0.85,
        });
      }
    }
    if (o.letGo) {
      // broken wall: fragments with fallen-out gaps, dry brush
      const frags = 2 + Math.floor(r() * 2);
      for (let f = 0; f < frags; f++) {
        const t0 = f / frags + r() * 0.06;
        const t1 = (f + 1) / frags - (0.06 + r() * 0.12);
        if (t1 - t0 < 0.08) continue;
        brushStroke(parent, slicePolyline(lo, t0, t1), {
          seed: `${o.seed}:wall${i}f${f}`,
          w: 2.6,
          color: 'var(--ink-soft)',
          dry: true,
          amp: 1.7,
          wobble: 0.32,
        });
      }
      const tufts = 2 + Math.floor(r() * 3);
      for (let t = 0; t < tufts; t++) {
        const { p } = along(lo, 0.08 + r() * 0.82);
        scrubTuft(
          parent,
          [p[0], p[1] - o.depth * (0.25 + r() * 0.5)],
          `${o.seed}:tuft${i}-${t}`,
          0.8 + r() * 0.5,
        );
      }
    } else {
      // the wall's cast shadow onto the strip below, then the built stone line
      inkLine(parent, offsetPolyline(lo, 2.2), {
        seed: `${o.seed}:sha${i}`,
        w: 1.5,
        color: 'var(--steel-0)',
        amp: 1.2,
        opacity: 0.85,
      });
      brushStroke(parent, lo, {
        seed: `${o.seed}:wall${i}`,
        w: 2.6,
        color: o.fresh ? 'var(--gold-dim)' : 'var(--silver-dim)',
        taperIn: 0.07,
        taperOut: 0.09,
        amp: 1.4,
        wobble: 0.22,
        dry: r() < 0.3,
      });
    }
    if (fine && o.numberFrom !== undefined) {
      const end = lo[lo.length - 1]!;
      stoneNumeral(
        fine,
        [end[0] + 7, end[1] - o.depth * (0.35 + r() * 0.2)],
        o.numberFrom + i,
        `${o.seed}:num${i}`,
      );
    }
  }
  // the run's top lip — a lighter bund line closing the highest strip
  inkLine(parent, edges[o.count]!, {
    seed: `${o.seed}:top`,
    w: 1.3,
    color: o.letGo ? 'var(--ink-faint)' : 'var(--ink-soft)',
    amp: 1.6,
  });
}

export interface FurrowsOpts {
  readonly seed: string;
  readonly angleDeg?: number;
}

/** Dry-field furrow hatching (vegetable rows, L7): hand-pulled plough rows over a
 *  drier ground tone. The whole plot shares one plough bow (the ox turns the same way
 *  every pass) while each row keeps its own waver, stops short of the headland by its
 *  own margin, and now and then breaks mid-field — never a screen-tone hatch. */
export function furrows(
  parent: SVGElement,
  poly: readonly Pt[],
  o: FurrowsOpts,
): void {
  const r = rng(o.seed);
  wash(parent, poly, {
    seed: `${o.seed}:wash`,
    fill: 'var(--steel-2)',
    opacity: 0.75,
    amp: 3,
  });
  const { x0, y0, x1, y1 } = bbox(poly);
  const minDim = Math.min(x1 - x0, y1 - y0);
  const spacing = Math.max(6, Math.min(10, minDim / 10));
  const plotBow = (r() - 0.5) * 0.14; // one shared plough drift for the whole plot
  const segs = rowSegments(
    insetPoly(poly, 5),
    o.angleDeg ?? 0,
    spacing,
    r,
    0.3,
  );
  for (let i = 0; i < segs.length; i++) {
    if (r() < 0.06) continue; // a row the plough skipped
    const { a, b } = segs[i]!;
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (len < 12) continue;
    const ux = (b[0] - a[0]) / len;
    const uy = (b[1] - a[1]) / len;
    const nx = -uy;
    const ny = ux;
    // headland margins: each row pulls up short of the bund by its own amount
    const in0 = 2 + r() * 7;
    const in1 = 2 + r() * 7;
    const bow = plotBow * len * (0.6 + r() * 0.8);
    const row = (t: number): Pt => {
      const d = in0 + (len - in0 - in1) * t;
      const off = bow * Math.sin(Math.PI * t) + (r() - 0.5) * 1.6;
      return [a[0] + ux * d + nx * off, a[1] + uy * d + ny * off];
    };
    const pieces: [number, number][] =
      r() < 0.2 && len > 60
        ? [
            [0, 0.32 + r() * 0.18],
            [0.58 + r() * 0.14, 1],
          ] // a break where the plough lifted
        : [[0, 1]];
    for (let p = 0; p < pieces.length; p++) {
      const [t0, t1] = pieces[p]!;
      const pts: Pt[] = [];
      const steps = 4;
      for (let s = 0; s <= steps; s++)
        pts.push(row(t0 + ((t1 - t0) * s) / steps));
      inkLine(parent, pts, {
        seed: `${o.seed}:f${i}-${p}`,
        w: 0.8 + r() * 0.8,
        color: 'var(--ink-soft)',
        amp: 1.1,
        opacity: 0.65 + r() * 0.3,
      });
    }
  }
  bundOutline(parent, poly, `${o.seed}:edge`, 1.3, 'var(--ink-soft)');
}

/** Swept-court ground (L7): a clean lifted tone — the yard kept bare and brushed —
 *  with rake sweeps in the fine layer (L10 zoom reward). The broom works ONE way
 *  across the court, so the sweeps are long shallow arcs in a shared direction, each
 *  pass a close group of 2–3 tine lines; one small turn-swirl where the sweeper came
 *  about. The way a surveyor notes ground that is TENDED rather than grown. */
export function sweptCourt(
  parent: SVGElement,
  poly: readonly Pt[],
  o: SeedOpts,
): void {
  const r = rng(o.seed);
  wash(parent, poly, {
    seed: `${o.seed}:wash`,
    fill: 'var(--steel-hi)',
    opacity: 0.62,
    amp: 3.5,
  });
  const fine = fineLayer(parent);
  const inner = insetPoly(poly, 7);
  // one dominant sweep direction for the whole court
  const sweepAng = r() * 180;
  const bands = rowSegments(inner, sweepAng, 20 + r() * 6, r, 0.35);
  const bandBow = r() < 0.5 ? -1 : 1; // the broom curls the same way pass after pass
  for (let i = 0; i < bands.length; i++) {
    if (r() < 0.18) continue; // the swept ground shows only most passes
    const { a, b } = bands[i]!;
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (len < 30) continue;
    const ux = (b[0] - a[0]) / len;
    const uy = (b[1] - a[1]) / len;
    const nx = -uy;
    const ny = ux;
    // one pass is a long stretch of the band, staggered pass to pass
    const t0 = r() * 0.25 * (i % 2 === 0 ? 1 : 0.4);
    const t1 = Math.min(1, t0 + 0.55 + r() * 0.45);
    const in0 = len * t0;
    const in1 = len * t1;
    const bow = (9 + r() * 9) * bandBow;
    const spine = (t: number): Pt => {
      const d = in0 + (in1 - in0) * t;
      const off = bow * Math.sin(Math.PI * t);
      return [a[0] + ux * d + nx * off, a[1] + uy * d + ny * off];
    };
    const steps = 10;
    const spinePts: Pt[] = [];
    for (let s = 0; s <= steps; s++) spinePts.push(spine(s / steps));
    // the rake's tines: 2–3 close parallel lines make one pass, each breaking up
    // where the broom skipped — never one unbroken wire
    const tines = 2 + Math.floor(r() * 2);
    for (let k = 0; k < tines; k++) {
      const off = (k - (tines - 1) / 2) * (3 + r() * 0.8);
      const pts = offsetPolyline(spinePts, off).filter((p) =>
        pointInPoly(p, inner),
      );
      if (pts.length < 3) continue;
      let run: Pt[] = [];
      const flush = (fI: number): void => {
        if (run.length >= 2)
          inkLine(fine, run, {
            seed: `${o.seed}:p${i}t${k}f${fI}`,
            w: 0.7 + r() * 0.4,
            color: 'var(--ink-faint)',
            amp: 0.6,
            opacity: 0.7 + r() * 0.3,
          });
        run = [];
      };
      let frag = 0;
      for (const p of pts) {
        if (run.length >= 2 && r() < 0.14) {
          flush(frag++);
          continue; // the skip — one sample's worth of bare ground
        }
        run.push(p);
      }
      flush(frag);
    }
  }
  // the turn-swirl: one spot where the sweeper came about (concentric part-arcs)
  let anchor: Pt | null = null;
  const { x0, y0, x1, y1 } = bbox(inner);
  for (let tries = 0; tries < 20 && !anchor; tries++) {
    const q: Pt = [
      x0 + (0.15 + r() * 0.7) * (x1 - x0),
      y0 + (0.15 + r() * 0.7) * (y1 - y0),
    ];
    if (pointInPoly(q, inner)) anchor = q;
  }
  if (anchor) {
    const baseA = ((sweepAng + 90) * Math.PI) / 180 + (r() - 0.5) * 0.5;
    for (let aI = 0; aI < 3; aI++) {
      const rad = 10 + aI * (4.5 + r() * 1.5);
      const span = 1.6 + r() * 0.8;
      const a0 = baseA - span / 2;
      const steps = 10;
      const run: Pt[] = [];
      for (let sI = 0; sI <= steps; sI++) {
        const a = a0 + (span * sI) / steps;
        const p: Pt = [
          anchor[0] + Math.cos(a) * rad,
          anchor[1] + Math.sin(a) * rad,
        ];
        if (pointInPoly(p, inner)) run.push(p);
      }
      if (run.length >= 3)
        inkLine(fine, run, {
          seed: `${o.seed}:sw${aI}`,
          w: 0.8,
          color: 'var(--ink-faint)',
          amp: 0.6,
        });
    }
  }
}
