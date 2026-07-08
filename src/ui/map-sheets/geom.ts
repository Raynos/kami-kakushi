// map-sheets/geom.ts — the ONE geometry home (G-5). Pure point/polygon/polyline
// math for the sheet toolkit: no DOM, no rng of its own, no tokens. Every module
// takes its geometry from here; brush.ts keeps only ink (path builders + emitters).
// The golden pin (golden.test.ts) freezes the rendered output, so everything in
// this file is bit-exact with the code it replaced — an rng passed in is consumed
// in the identical order (call order IS part of the pinned look).

export type Pt = readonly [number, number];

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

export function polyLen(pts: readonly Pt[]): number {
  let len = 0;
  for (let i = 1; i < pts.length; i++)
    len += Math.hypot(pts[i]![0] - pts[i - 1]![0], pts[i]![1] - pts[i - 1]![1]);
  return len;
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

/** Unit normal of the a→b edge (left of travel). */
export function edgeNormal(a: Pt, b: Pt): Pt {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  return [-(b[1] - a[1]) / len, (b[0] - a[0]) / len];
}

/** Unit normal at vertex i of a polyline (left of travel), from clamped neighbours —
 *  the one vertex-normal in the toolkit (was re-derived inline ~5×, G-5). */
export function normalAt(pts: readonly Pt[], i: number): Pt {
  return edgeNormal(pts[Math.max(0, i - 1)]!, pts[Math.min(pts.length - 1, i + 1)]!);
}

/** Offset a polyline sideways (left of travel = positive d) via vertex normals. */
export function offsetPolyline(pts: readonly Pt[], d: number): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < pts.length; i++) {
    const [nx, ny] = normalAt(pts, i);
    out.push([pts[i]![0] + nx * d, pts[i]![1] + ny * d]);
  }
  return out;
}

/** Shrink a polygon toward its centroid. NOTE: centroid-scale is an approximation —
 *  on elongated polygons the long sides inset less than asked (the paddies lean on
 *  this look, which the golden pin freezes); a true edge-offset inset would be a
 *  deliberate, pin-regenerating visual change, not a refactor. */
export function insetPoly(poly: readonly Pt[], inset: number): Pt[] {
  let cx = 0;
  let cy = 0;
  for (const [x, y] of poly) {
    cx += x;
    cy += y;
  }
  cx /= poly.length;
  cy /= poly.length;
  return poly.map(([x, y]): Pt => {
    const d = Math.hypot(x - cx, y - cy) || 1;
    const f = Math.max(0, d - inset) / d;
    return [cx + (x - cx) * f, cy + (y - cy) * f];
  });
}

export interface ScanRunsOpts {
  /** row direction in degrees */
  readonly angleDeg: number;
  /** distance between rows */
  readonly spacing: number;
  /** consumed exactly ONCE per row (the offset jitter) — rng call order is pinned */
  readonly r: () => number;
  /** row-offset jitter, as a fraction of spacing */
  readonly jitter: number;
  /** sample step along each row; also the minimum kept run length */
  readonly step: number;
  /** first row sits at -diag/2 + phase (hatch uses 0; field rows use spacing/2) */
  readonly phase?: number;
}

/** Parallel scan rows clipped inside a polygon by sampling — the shared scanline
 *  engine behind hatch fills, transplant rows, furrows and the ghost-bund grid
 *  (G-5: hatchArea and fields.rowSegments were two copies of this loop). Each
 *  returned segment is one inside-run of one row. */
export function scanlineRuns(poly: readonly Pt[], o: ScanRunsOpts): { a: Pt; b: Pt }[] {
  const ang = (o.angleDeg * Math.PI) / 180;
  const dx = Math.cos(ang);
  const dy = Math.sin(ang);
  const { x0, y0, x1, y1 } = bbox(poly);
  const diag = Math.hypot(x1 - x0, y1 - y0);
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const out: { a: Pt; b: Pt }[] = [];
  for (let off = -diag / 2 + (o.phase ?? 0); off <= diag / 2; off += o.spacing) {
    const oj = off + (o.r() - 0.5) * o.spacing * o.jitter;
    let start: Pt | null = null;
    let prev: Pt | null = null;
    for (let s = -diag / 2; s <= diag / 2 + o.step; s += o.step) {
      const px = cx + dx * s - dy * oj;
      const py = cy + dy * s + dx * oj;
      const inside = s <= diag / 2 && pointInPoly([px, py], poly);
      if (inside && !start) start = [px, py];
      if (!inside && start && prev) {
        if (Math.hypot(prev[0] - start[0], prev[1] - start[1]) > o.step)
          out.push({ a: start, b: prev });
        start = null;
      }
      prev = [px, py];
    }
  }
  return out;
}
