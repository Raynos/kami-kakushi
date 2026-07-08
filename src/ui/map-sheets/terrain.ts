// map-sheets/terrain.ts — the land itself (DEV fold). Hills, slope marks, and substrate
// washes for the T0/T1 survey sheets, in the Edo village-map (mura-ezu) idiom: mountains
// are overlapping fish-scale brush profiles in depth rows over a faint under-mass, slopes
// carry jittered hachure ticks, and the valley floor is a flat hand-cut wash. Everything
// composes brush.ts primitives, is seed-deterministic, and stays on Andon Steel tokens
// (spec §3 L1/L2/L7). Baselines are drawn WEST→EAST (left→right); hills stack screen-up.

import { brushStroke, hatchArea, inkLine, rng, sv, wash } from './brush';
import { along, normalAt, offsetPolyline, polyLen, resample, type Pt } from './geom';

// ── internals ────────────────────────────────────────────────────────────────

/** One of five hill-silhouette families — dome / peak / shouldered / twin-crest /
 *  hog-back — with per-hill apex + sharpness jitter, so a range never reads as a
 *  stamped glyph row (spec L6's "never identical" rule applied to terrain). */
function pickProfile(r: () => number): (t: number) => number {
  const apex = 0.38 + r() * 0.26;
  const sharp = 0.9 + r() * 1.3;
  const bell = (t: number, a: number, s: number): number => {
    const u = t < a ? t / a : (1 - t) / (1 - a);
    return Math.sin(Math.max(0, Math.min(u, 1)) * Math.PI * 0.5) ** s;
  };
  const kind = Math.floor(r() * 5);
  if (kind === 0) return (t) => bell(t, apex, 1.05);
  if (kind === 1) return (t) => bell(t, apex, sharp + 1.1);
  if (kind === 2) {
    const sa = apex > 0.5 ? apex - 0.3 : apex + 0.32;
    const sh = 0.34 + r() * 0.24;
    return (t) => Math.max(bell(t, apex, sharp), sh * bell(t, sa, 1.3));
  }
  if (kind === 3) {
    const a2 = Math.min(0.9, apex + 0.28 + r() * 0.18);
    const h2 = 0.6 + r() * 0.28;
    return (t) => Math.max(bell(t, apex, sharp + 0.6), h2 * bell(t, a2, sharp + 0.6));
  }
  return (t) => bell(t, apex, 0.8) ** 1.4 * (0.92 + 0.08 * Math.sin(t * Math.PI));
}

interface HillArgs {
  readonly base: Pt;
  readonly tan: Pt;
  readonly hw: number;
  readonly h: number;
  /** 0 = farthest row … 1 = front row */
  readonly depth: number;
  /** which flank carries the texture strokes (+1 = offsetPolyline-positive side) */
  readonly shadow: 1 | -1;
  readonly seed: string;
}

/** One hill of a range: solid body mass (occludes the row behind — the fish-scale
 *  overlap), nested contour echoes under the crest, shun flank strokes on the shadow
 *  side, then the tapered crest silhouette on top. */
function drawHill(g: SVGElement, a: HillArgs): void {
  const r = rng(a.seed);
  const prof = pickProfile(r);
  const up: Pt = [a.tan[1], -a.tan[0]];
  const n = Math.max(14, Math.round(a.hw / 4.5));
  const sil: Pt[] = [];
  let ci = 0;
  let best = -1;
  for (let i = 0; i <= n; i++) {
    const s = i / n;
    const ht = a.h * prof(s);
    sil.push([
      a.base[0] + a.tan[0] * (s * 2 - 1) * a.hw + up[0] * ht,
      a.base[1] + a.tan[1] * (s * 2 - 1) * a.hw + up[1] * ht,
    ]);
    if (ht > best) {
      best = ht;
      ci = i;
    }
  }
  // body mass — a near-solid steel wash so nearer scales occlude the row behind (L1);
  // the bottom edge tucks shallow + jittered so no slab line shows below the feet
  const drop = 5 + a.h * 0.06;
  const lf = sil[0]!;
  const rf = sil[n]!;
  const body: Pt[] = [
    ...sil,
    [rf[0] - up[0] * drop, rf[1] - up[1] * drop],
    [
      (rf[0] + lf[0]) / 2 + (r() - 0.5) * 8 - up[0] * (drop + (r() - 0.5) * 4),
      (rf[1] + lf[1]) / 2 - up[1] * (drop + (r() - 0.5) * 4),
    ],
    [lf[0] - up[0] * drop, lf[1] - up[1] * drop],
  ];
  wash(g, body, {
    seed: `${a.seed}:body`,
    fill: 'var(--steel-2)',
    opacity: 0.88 + a.depth * 0.12,
    amp: 2.2,
  });
  // nested contour echoes hanging from the crest — the fish-scale interior
  const crest = sil[ci]!;
  const echoN = a.depth > 0.6 ? 3 : 2;
  for (let k = 1; k <= echoN; k++) {
    const f = 1 - k * (0.17 + r() * 0.05);
    if (f < 0.25) break;
    const i0 = Math.round(n * (0.09 + r() * 0.13));
    const i1 = n - Math.round(n * (0.09 + r() * 0.13));
    const echo: Pt[] = [];
    for (let i = i0; i <= i1; i++)
      echo.push([crest[0] + (sil[i]![0] - crest[0]) * f, crest[1] + (sil[i]![1] - crest[1]) * f]);
    inkLine(g, echo, {
      seed: `${a.seed}:e${k}`,
      w: (1.3 + a.depth * 0.4) * (1 - (k - 1) * 0.16),
      color: 'var(--ink-soft)',
      amp: 1.1,
      opacity: a.depth > 0.6 ? 1 : 0.75,
    });
  }
  const flankLen = a.shadow > 0 ? n - ci : ci;
  if (a.depth > 0.6 && flankLen > 3) {
    // front row: slope-parallel hatch shading the shadow flank — the tonal mass that
    // keeps big hills from reading as empty outlines
    const iFoot = a.shadow > 0 ? n : 0;
    const half: Pt[] = [];
    for (let i = ci; i !== iFoot; i += a.shadow) half.push(sil[i]!);
    half.push(sil[iFoot]!);
    half.push([crest[0] - up[0] * best, crest[1] - up[1] * best]);
    const ang = (Math.atan2(sil[iFoot]![1] - crest[1], sil[iFoot]![0] - crest[0]) * 180) / Math.PI;
    hatchArea(g, half, {
      seed: `${a.seed}:shade`,
      angle: ang,
      spacing: 7.5,
      w: 1,
      color: 'var(--ink-soft)',
      opacity: 0.45,
    });
  } else if (flankLen > 3) {
    // back rows: a few shun flank ribs — short down-slope strokes on the shadow side
    const ribs = Math.max(3, Math.round(3 + r() * 3));
    for (let j = 0; j < ribs; j++) {
      const t = 0.15 + r() * 0.62;
      const fi = Math.min(
        n - 1,
        Math.max(1, ci + a.shadow * Math.max(2, Math.round(flankLen * t))),
      );
      const p0 = sil[fi]!;
      const p1 = sil[Math.min(n, Math.max(0, fi + a.shadow * 2))]!;
      const dl = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) || 1;
      const dx = (p1[0] - p0[0]) / dl;
      const dy = (p1[1] - p0[1]) / dl;
      const len = a.h * (0.24 + r() * 0.34);
      const sx = p0[0] - up[0] * (2.5 + r() * 2);
      const sy = p0[1] - up[1] * (2.5 + r() * 2);
      const ex = sx + dx * len - up[0] * len * 0.25;
      const ey = sy + dy * len - up[1] * len * 0.25;
      inkLine(
        g,
        [
          [sx, sy],
          [(sx + ex) / 2 + dx * 2, (sy + ey) / 2 + dy * 2],
          [ex, ey],
        ],
        {
          seed: `${a.seed}:rib${j}`,
          w: 1.1 + r() * 0.6,
          color: 'var(--ink-soft)',
          amp: 0.8,
          opacity: 0.75,
        },
      );
    }
  }
  // the crest silhouette — THE structural stroke, tapered, dry at the front
  const crestW = (1.35 + a.depth * 1.55) * (0.8 + Math.min(a.h / 70, 1) * 0.35);
  brushStroke(g, sil, {
    seed: `${a.seed}:crest`,
    w: crestW,
    color:
      a.depth > 0.72
        ? 'var(--silver-dim)'
        : a.depth > 0.35
          ? 'var(--ink-soft)'
          : 'var(--ink-faint)',
    taperIn: 0.08,
    taperOut: 0.1,
    wobble: 0.24,
    amp: 1.4,
    dry: a.depth > 0.6 && a.hw > 66 && r() < 0.4,
  });
}

// ── exports ──────────────────────────────────────────────────────────────────

export interface HillRangeOpts {
  readonly seed: string;
  /** depth rows, back to front (default 3, clamped 1–4) */
  readonly rows?: number;
  /** overall size multiplier (default 1) */
  readonly scale?: number;
}

/** An Edo-map mountain band along `baseline` (drawn west→east; hills stack screen-up,
 *  i.e. north). The period convention: a range is not a contour but a PARADE of
 *  overlapping brush hill profiles — each a solid mass with fish-scale interior
 *  strokes — in 2–3 depth rows over a faint under-wash, nearer scales occluding the
 *  farther. Silhouette family, size, and lean jitter per hill so nothing reads
 *  stamped. This fills the sheet's north with PLACE, never a polyline (spec L7). */
export function hillRange(parent: SVGElement, baseline: readonly Pt[], o: HillRangeOpts): void {
  if (baseline.length < 2) return;
  const rows = Math.max(1, Math.min(4, Math.round(o.rows ?? 3)));
  const scale = o.scale ?? 1;
  const r = rng(o.seed);
  const shadow: 1 | -1 = r() < 0.5 ? 1 : -1;
  const total = polyLen(baseline);
  const g = sv('g', { class: 'ms-hills' });
  parent.append(g);

  // the faint under-mass the rows sit on (L1: the north reads as ground, not void) —
  // its top edge undulates loosely behind the back-row crests so it never reads boxy
  const liftStep = 44 * scale;
  const rm = rng(`${o.seed}:mass`);
  const rs = resample(baseline, 52);
  const massTop: Pt[] = [];
  for (let i = 0; i < rs.length; i++) {
    // the RIGHT of travel (screen-up for a W→E baseline) = the negated vertex normal
    const [nx, ny] = normalAt(rs, i);
    // taper the mass to nothing at both ends — no vertical wall seams
    const edge = Math.min(1, i / 2.2, (rs.length - 1 - i) / 2.2);
    const lift = ((rows - 1) * liftStep + (26 + rm() * 52) * scale) * (0.12 + 0.88 * edge);
    massTop.push([rs[i]![0] - nx * lift, rs[i]![1] - ny * lift]);
  }
  const massBot = offsetPolyline(rs, 22 * scale).reverse();
  wash(g, [...massTop, ...massBot], {
    seed: `${o.seed}:mass`,
    fill: 'var(--steel-2)',
    opacity: 0.34,
    amp: 8,
  });

  for (let row = 0; row < rows; row++) {
    const depth = rows === 1 ? 1 : row / (rows - 1);
    const lift = (rows - 1 - row) * liftStep;
    const hw0 = (52 + 34 * depth) * scale;
    let dist = hw0 * (0.05 + r() * 0.55);
    let idx = 0;
    while (dist < total - hw0 * 0.1) {
      const hw = hw0 * (0.72 + r() * 0.62);
      const h = hw * (0.5 + r() * 0.4) * (0.72 + depth * 0.28);
      const { p, tan } = along(baseline, dist / total);
      const rot = (r() - 0.5) * 0.14;
      const cs = Math.cos(rot);
      const sn = Math.sin(rot);
      const tj: Pt = [tan[0] * cs - tan[1] * sn, tan[0] * sn + tan[1] * cs];
      const up: Pt = [tj[1], -tj[0]];
      const wobbleLift = lift + (r() - 0.5) * 10 * scale;
      const base: Pt = [p[0] + up[0] * wobbleLift, p[1] + up[1] * wobbleLift];
      drawHill(g, { base, tan: tj, hw, h, depth, shadow, seed: `${o.seed}:r${row}h${idx}` });
      dist += hw * (0.9 + r() * 0.55);
      idx++;
    }
  }
}

export interface HachureOpts {
  readonly seed: string;
  /** which side of the line the ticks fall on (+1 = brush.offsetPolyline's positive side) */
  readonly side?: 1 | -1;
  /** nominal tick length (default 15) */
  readonly len?: number;
}

/** One-sided slope hachure along `pts` — the surveyor's short down-slope ticks marking
 *  a scarp or bank edge. Length, angle, and spacing all jitter, long-short alternation
 *  plus dropped ticks give the hand's rhythm; deliberately SUBORDINATE to hillRange
 *  (an accent mark, fine-weight ink, never a structure line — spec L7). */
export function hachureBand(parent: SVGElement, pts: readonly Pt[], o: HachureOpts): void {
  if (pts.length < 2) return;
  const r = rng(o.seed);
  const side = o.side ?? 1;
  const len = o.len ?? 15;
  const g = sv('g', { class: 'ms-hachure' });
  parent.append(g);
  const rs = resample(pts, 7);
  for (let i = 1; i < rs.length - 1; i++) {
    if (r() < 0.12) continue; // a dropped tick — the hand skips
    const a = rs[i - 1]!;
    const b = rs[i + 1]!;
    const p = rs[i]!;
    const dl = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const tx = (b[0] - a[0]) / dl;
    const ty = (b[1] - a[1]) / dl;
    const nx = -ty * side;
    const ny = tx * side;
    const rot = (r() - 0.5) * 0.5;
    const cs = Math.cos(rot);
    const sn = Math.sin(rot);
    const dx = nx * cs - ny * sn;
    const dy = nx * sn + ny * cs;
    const tickLen = len * (0.55 + r() * 0.7) * (i % 2 === 0 ? 1 : 0.62);
    const x0 = p[0] + dx * 1.5 + tx * (r() - 0.5) * 4;
    const y0 = p[1] + dy * 1.5 + ty * (r() - 0.5) * 4;
    const ex = x0 + dx * tickLen;
    const ey = y0 + dy * tickLen;
    inkLine(
      g,
      [
        [x0, y0],
        [(x0 + ex) / 2 + tx * tickLen * 0.12, (y0 + ey) / 2 + ty * tickLen * 0.12],
        [ex, ey],
      ],
      {
        seed: `${o.seed}:t${i}`,
        w: 0.95 + r() * 0.5,
        color: r() < 0.25 ? 'var(--ink-faint)' : 'var(--ink-soft)',
        amp: 0.7,
      },
    );
  }
}

export interface RidgeLineOpts {
  readonly seed: string;
  readonly w?: number;
}

/** A tapered crest stroke for a minor rise — a knoll or spur too small for hillRange.
 *  Period maps mark these with a single pressed brush line that swells in the belly
 *  and dries out at the tail; a few faint settling ticks under it keep it reading as
 *  ground rather than a stray scratch. */
export function ridgeLine(parent: SVGElement, pts: readonly Pt[], o: RidgeLineOpts): void {
  if (pts.length < 2) return;
  const w = o.w ?? 2.2;
  const g = sv('g', { class: 'ms-ridge' });
  parent.append(g);
  brushStroke(g, pts, {
    seed: o.seed,
    w,
    color: 'var(--ink-soft)',
    taperIn: 0.24,
    taperOut: 0.36,
    wobble: 0.22,
    amp: 1.7,
    dry: w <= 2.6, // a heavy ridge keeps its body — dry tails detach at big widths
  });
  const r = rng(`${o.seed}:ticks`);
  const side = r() < 0.5 ? 1 : -1;
  const nTicks = 3 + Math.floor(r() * 3);
  for (let i = 0; i < nTicks; i++) {
    const { p, tan } = along(pts, 0.18 + r() * 0.64);
    const nx = -tan[1] * side;
    const ny = tan[0] * side;
    const tickLen = w * (3 + r() * 2.6);
    const rot = (r() - 0.5) * 0.4;
    const cs = Math.cos(rot);
    const sn = Math.sin(rot);
    const dx = nx * cs - ny * sn;
    const dy = nx * sn + ny * cs;
    inkLine(
      g,
      [
        [p[0] + dx * 2, p[1] + dy * 2],
        [p[0] + dx * (2 + tickLen), p[1] + dy * (2 + tickLen)],
      ],
      { seed: `${o.seed}:tk${i}`, w: 0.95, color: 'var(--ink-soft)', amp: 0.6, opacity: 0.8 },
    );
  }
}

export interface GroundWashBandOpts {
  readonly seed: string;
  readonly tone: string;
  readonly opacity?: number;
}

/** A broad substrate wash with hand-cut edges — the valley-floor / field / water tone
 *  bands every period sheet lays down FIRST, so empty ground reads as the paper of a
 *  worked drawing, never unrendered void (spec L1). Thin wrapper over brush.wash so
 *  every sheet names its substrate the same way. */
export function groundWashBand(
  parent: SVGElement,
  poly: readonly Pt[],
  o: GroundWashBandOpts,
): void {
  if (poly.length < 3) return;
  // resample the perimeter so even a 4-corner polygon gets an organic, wobbling edge
  // (a straight segment with no intermediate points can't be hand-cut by scrawl)
  const perim = polyLen([...poly, poly[0]!]);
  const step = Math.max(14, Math.min(44, perim / 24));
  const ring = resample([...poly, poly[0]!], step);
  if (ring.length > 1) ring.pop(); // wash() closes the path itself
  wash(parent, ring, { seed: o.seed, fill: o.tone, opacity: o.opacity ?? 0.5, amp: 6.5 });
}
