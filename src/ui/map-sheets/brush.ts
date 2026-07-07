// map-sheets/brush.ts — the ink toolkit (DEV fold). Every mark on the T0/T1 review
// sheets is drawn through these: seeded-deterministic (a given seed always paints the
// identical sheet — TST2), token-coloured (Andon Steel vars only), and brush-alive
// (tapered variable-width strokes, never uniform CAD polylines — spec L2). Pure
// SVG-DOM emitters: no game imports, no RNG outside rng(), no Date/Math.random.

export const NS = 'http://www.w3.org/2000/svg';

export function sv<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs?: Record<string, string>,
  text?: string,
): SVGElementTagNameMap[K] {
  const e = document.createElementNS(NS, tag);
  if (attrs) for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (text !== undefined) e.textContent = text;
  return e;
}

export function tip(elm: SVGElement, text: string): void {
  elm.append(sv('title', undefined, text));
}

/** Deterministic PRNG (fnv1a → xorshift-mix) — every open paints the same sheet. */
export function rng(seed: string): () => number {
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

export type Pt = readonly [number, number];

// ── geometry helpers ─────────────────────────────────────────────────────────

export function bbox(pts: readonly Pt[]): { x0: number; y0: number; x1: number; y1: number } {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const [x, y] of pts) {
    if (x < x0) x0 = x;
    if (y < y0) y0 = y;
    if (x > x1) x1 = x;
    if (y > y1) y1 = y;
  }
  return { x0, y0, x1, y1 };
}

export function pointInPoly([px, py]: Pt, poly: readonly Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]!;
    const [xj, yj] = poly[j]!;
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Even-step resample of a polyline (keeps ends exactly). */
export function resample(pts: readonly Pt[], step: number): Pt[] {
  if (pts.length < 2) return [...pts];
  const out: Pt[] = [pts[0]!];
  let carry = 0;
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1]!;
    const [bx, by] = pts[i]!;
    const seg = Math.hypot(bx - ax, by - ay);
    if (seg === 0) continue;
    let d = step - carry;
    while (d < seg) {
      const t = d / seg;
      out.push([ax + (bx - ax) * t, ay + (by - ay) * t]);
      d += step;
    }
    carry = seg - (d - step);
  }
  const last = pts[pts.length - 1]!;
  const tail = out[out.length - 1]!;
  if (Math.hypot(last[0] - tail[0], last[1] - tail[1]) > step * 0.25) out.push(last);
  else out[out.length - 1] = last;
  return out;
}

/** The point a fraction t (0..1) along a polyline, + its unit tangent. */
export function along(pts: readonly Pt[], t: number): { p: Pt; tan: Pt } {
  const segs: number[] = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i]![0] - pts[i - 1]![0], pts[i]![1] - pts[i - 1]![1]);
    segs.push(d);
    total += d;
  }
  let want = Math.min(Math.max(t, 0), 1) * total;
  for (let i = 0; i < segs.length; i++) {
    if (want <= segs[i]! || i === segs.length - 1) {
      const f = segs[i]! === 0 ? 0 : want / segs[i]!;
      const [ax, ay] = pts[i]!;
      const [bx, by] = pts[i + 1]!;
      const len = segs[i]! || 1;
      return {
        p: [ax + (bx - ax) * f, ay + (by - ay) * f],
        tan: [(bx - ax) / len, (by - ay) / len],
      };
    }
    want -= segs[i]!;
  }
  return { p: pts[0]!, tan: [1, 0] };
}

/** Offset a polyline sideways (left of travel = positive d) via vertex normals. */
export function offsetPolyline(pts: readonly Pt[], d: number): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)]!;
    const b = pts[Math.min(pts.length - 1, i + 1)]!;
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const nx = -(b[1] - a[1]) / len;
    const ny = (b[0] - a[0]) / len;
    out.push([pts[i]![0] + nx * d, pts[i]![1] + ny * d]);
  }
  return out;
}

// ── path builders ────────────────────────────────────────────────────────────

/** Hand-scrawled path: jittered vertices, bowed segments (the surveyed brush line). */
export function scrawl(pts: readonly Pt[], seed: string, amp = 2.2, close = false): string {
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

export interface InkOpts {
  readonly seed?: string;
  readonly w?: number;
  readonly color?: string;
  readonly opacity?: number;
  readonly dash?: string;
  readonly amp?: number;
}

/** A fine scrawled ink stroke — the hairline/working-line register (spec L2 W1–W3). */
export function inkLine(parent: SVGElement, pts: readonly Pt[], o: InkOpts = {}): SVGPathElement {
  const p = sv('path', {
    d: scrawl(pts, o.seed ?? 'ink', o.amp ?? 1.6),
    fill: 'none',
    stroke: o.color ?? 'var(--ink-soft)',
    'stroke-width': String(o.w ?? 1.2),
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    ...(o.opacity !== undefined ? { opacity: String(o.opacity) } : {}),
    ...(o.dash ? { 'stroke-dasharray': o.dash } : {}),
  });
  parent.append(p);
  return p;
}

export interface BrushOpts {
  readonly seed: string;
  /** base width at the stroke's belly */
  readonly w: number;
  readonly color?: string;
  readonly opacity?: number;
  /** fraction of length spent ramping in/out (taper) */
  readonly taperIn?: number;
  readonly taperOut?: number;
  /** width noise, as a fraction of w */
  readonly wobble?: number;
  /** path jitter amplitude */
  readonly amp?: number;
  /** dry-brush breakup over the tail of the stroke */
  readonly dry?: boolean;
}

/** THE structural stroke — a tapered, variable-width brush line rendered as a filled
 *  polygon (spec L2 W4): pressure swells in the belly, tapers at both ends, and can
 *  break up dry at the tail. Never a uniform polyline. */
export function brushStroke(parent: SVGElement, pts: readonly Pt[], o: BrushOpts): void {
  const r = rng(o.seed);
  const step = Math.max(7, o.w * 1.8);
  const line = resample(pts, step).map(
    (p): Pt => [p[0] + (r() - 0.5) * 2 * (o.amp ?? 1.8), p[1] + (r() - 0.5) * 2 * (o.amp ?? 1.8)],
  );
  if (line.length < 2) return;
  const tIn = o.taperIn ?? 0.16;
  const tOut = o.taperOut ?? 0.2;
  const wob = o.wobble ?? 0.16;
  const n = line.length;
  const widths: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const ease = (v: number): number => Math.sin(Math.min(v, 1) * Math.PI * 0.5) ** 0.85;
    const prof = ease(t / tIn) * ease((1 - t) / tOut);
    widths.push(Math.max(0.35, o.w * prof * (1 + (r() - 0.5) * 2 * wob)));
  }
  // dry-brush: split the tail into fragments with widening gaps
  const runs: { from: number; to: number }[] = [];
  if (o.dry) {
    let from = 0;
    for (let i = Math.floor(n * 0.7); i < n - 1; i++) {
      if (r() < 0.28) {
        runs.push({ from, to: i });
        from = i + 1;
      }
    }
    runs.push({ from, to: n - 1 });
  } else {
    runs.push({ from: 0, to: n - 1 });
  }
  for (const run of runs) {
    if (run.to - run.from < 1) continue;
    const left: Pt[] = [];
    const right: Pt[] = [];
    for (let i = run.from; i <= run.to; i++) {
      const a = line[Math.max(0, i - 1)]!;
      const b = line[Math.min(n - 1, i + 1)]!;
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      const nx = -(b[1] - a[1]) / len;
      const ny = (b[0] - a[0]) / len;
      const hw = widths[i]! / 2;
      left.push([line[i]![0] + nx * hw, line[i]![1] + ny * hw]);
      right.push([line[i]![0] - nx * hw, line[i]![1] - ny * hw]);
    }
    right.reverse();
    const all = [...left, ...right];
    let d = `M${all[0]![0].toFixed(1)},${all[0]![1].toFixed(1)}`;
    for (let i = 1; i < all.length; i++) d += ` L${all[i]![0].toFixed(1)},${all[i]![1].toFixed(1)}`;
    d += ' Z';
    parent.append(
      sv('path', {
        d,
        fill: o.color ?? 'var(--silver-dim)',
        stroke: 'none',
        ...(o.opacity !== undefined ? { opacity: String(o.opacity) } : {}),
      }),
    );
  }
}

export interface WashOpts {
  readonly seed: string;
  readonly fill: string;
  readonly opacity?: number;
  /** edge scrawl amplitude — soft hand-cut edges */
  readonly amp?: number;
  readonly stroke?: string;
  readonly strokeW?: number;
}

/** A flat token-colour ground wash with a hand-cut edge (spec L1 — flat fills only,
 *  texture comes from strokes layered ON washes, never raster grain). */
export function wash(parent: SVGElement, pts: readonly Pt[], o: WashOpts): SVGPathElement {
  const p = sv('path', {
    d: scrawl(pts, o.seed, o.amp ?? 5, true),
    fill: o.fill,
    ...(o.opacity !== undefined ? { opacity: String(o.opacity) } : {}),
    ...(o.stroke
      ? { stroke: o.stroke, 'stroke-width': String(o.strokeW ?? 1), 'stroke-linejoin': 'round' }
      : { stroke: 'none' }),
  });
  parent.append(p);
  return p;
}

export interface StippleOpts {
  readonly seed: string;
  /** grid step between candidate dots */
  readonly step?: number;
  /** chance a candidate dot lands */
  readonly prob?: number;
  readonly r?: number;
  readonly color?: string;
  readonly opacity?: number;
}

/** Sparse dot texture inside a polygon (forest floor, rubble, scree). */
export function stipple(parent: SVGElement, poly: readonly Pt[], o: StippleOpts): void {
  const r = rng(o.seed);
  const step = o.step ?? 26;
  const { x0, y0, x1, y1 } = bbox(poly);
  const g = sv('g', {
    fill: o.color ?? 'var(--ink-faint)',
    ...(o.opacity !== undefined ? { opacity: String(o.opacity) } : {}),
  });
  for (let y = y0; y <= y1; y += step) {
    for (let x = x0; x <= x1; x += step) {
      if (r() > (o.prob ?? 0.5)) continue;
      const px = x + (r() - 0.5) * step;
      const py = y + (r() - 0.5) * step;
      if (!pointInPoly([px, py], poly)) continue;
      g.append(
        sv('circle', {
          cx: px.toFixed(1),
          cy: py.toFixed(1),
          r: ((o.r ?? 1.1) * (0.6 + r() * 0.8)).toFixed(2),
        }),
      );
    }
  }
  parent.append(g);
}

export interface HatchOpts {
  readonly seed: string;
  /** hatch angle in degrees */
  readonly angle?: number;
  readonly spacing?: number;
  readonly color?: string;
  readonly w?: number;
  readonly opacity?: number;
}

/** Hatch fill clipped to a polygon by sampling — the ink way to shade an area. */
export function hatchArea(parent: SVGElement, poly: readonly Pt[], o: HatchOpts): void {
  const r = rng(o.seed);
  const ang = ((o.angle ?? 38) * Math.PI) / 180;
  const dx = Math.cos(ang);
  const dy = Math.sin(ang);
  const { x0, y0, x1, y1 } = bbox(poly);
  const diag = Math.hypot(x1 - x0, y1 - y0);
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const spacing = o.spacing ?? 14;
  const g = sv('g', {
    stroke: o.color ?? 'var(--ink-faint)',
    'stroke-width': String(o.w ?? 1),
    'stroke-linecap': 'round',
    fill: 'none',
    ...(o.opacity !== undefined ? { opacity: String(o.opacity) } : {}),
  });
  const sampleStep = 6;
  for (let off = -diag / 2; off <= diag / 2; off += spacing) {
    const offJ = off + (r() - 0.5) * spacing * 0.35;
    // scan along the hatch line; emit sub-segments where inside the polygon
    let segStart: Pt | null = null;
    let prev: Pt | null = null;
    for (let s = -diag / 2; s <= diag / 2 + sampleStep; s += sampleStep) {
      const px = cx + dx * s - dy * offJ;
      const py = cy + dy * s + dx * offJ;
      const inside = s <= diag / 2 && pointInPoly([px, py], poly);
      if (inside && !segStart) segStart = [px, py];
      if (!inside && segStart && prev) {
        if (Math.hypot(prev[0] - segStart[0], prev[1] - segStart[1]) > sampleStep) {
          g.append(
            sv('path', {
              d: `M${segStart[0].toFixed(1)},${segStart[1].toFixed(1)} L${prev[0].toFixed(1)},${prev[1].toFixed(1)}`,
            }),
          );
        }
        segStart = null;
      }
      prev = [px, py];
    }
    if (segStart && prev && Math.hypot(prev[0] - segStart[0], prev[1] - segStart[1]) > sampleStep)
      g.append(
        sv('path', {
          d: `M${segStart[0].toFixed(1)},${segStart[1].toFixed(1)} L${prev[0].toFixed(1)},${prev[1].toFixed(1)}`,
        }),
      );
  }
  parent.append(g);
}

/** Nested shallow water-comb arcs (suiha-mon) — pools, slack water, below weirs. */
export function waveComb(
  parent: SVGElement,
  cx: number,
  cy: number,
  w: number,
  seed: string,
  o: { color?: string; opacity?: number; rows?: number } = {},
): void {
  const r = rng(seed);
  const rows = o.rows ?? 3;
  const g = sv('g', {
    stroke: o.color ?? 'var(--silver-dim)',
    fill: 'none',
    'stroke-linecap': 'round',
    opacity: String(o.opacity ?? 0.5),
  });
  for (let i = 0; i < rows; i++) {
    const rw = w * (1 - i * 0.28) * (0.9 + r() * 0.2);
    const ry = cy + i * (w * 0.16);
    const bow = w * 0.1 * (1 + r() * 0.4);
    g.append(
      sv('path', {
        d: `M${(cx - rw / 2).toFixed(1)},${ry.toFixed(1)} Q${cx.toFixed(1)},${(ry - bow).toFixed(1)} ${(cx + rw / 2).toFixed(1)},${ry.toFixed(1)}`,
        'stroke-width': String(1.1 - i * 0.15),
      }),
    );
  }
  parent.append(g);
}

/** Small ink text set INTO the drawing (stone numerals, period notes) — rides the
 *  art layer's wobble, which is the point. */
export function inkText(
  parent: SVGElement,
  x: number,
  y: number,
  text: string,
  o: {
    size?: number;
    color?: string;
    opacity?: number;
    angle?: number;
    vertical?: boolean;
    anchor?: 'start' | 'middle' | 'end';
  } = {},
): SVGTextElement {
  const t = sv(
    'text',
    {
      x: String(x),
      y: String(y),
      'text-anchor': o.anchor ?? 'middle',
      style:
        `font-family:var(--font-head);font-size:${o.size ?? 13}px;` +
        `fill:${o.color ?? 'var(--ink-soft)'};` +
        (o.vertical ? 'writing-mode:vertical-rl;' : ''),
      ...(o.opacity !== undefined ? { opacity: String(o.opacity) } : {}),
      ...(o.angle ? { transform: `rotate(${o.angle} ${x} ${y})` } : {}),
    },
    text,
  );
  parent.append(t);
  return t;
}

/** The fine-detail layer — hidden at far zoom by the shell (spec L10: the fit view
 *  stays composed; the close view pays craft). */
export function fineLayer(parent: SVGElement): SVGGElement {
  const g = sv('g', { class: 'ms-fine' }) as SVGGElement;
  parent.append(g);
  return g;
}
