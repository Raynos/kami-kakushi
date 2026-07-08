// map-sheets/flora.ts — VEGETATION for the T0/T1 survey sheets (spec L6): a SYSTEM,
// never a stamp. Every glyph derives from period map-pictograms — the kuniezu needle-pad
// pine, drooping bamboo leaf-flicks, the round orchard crown — and every placement is
// seed-varied in silhouette, scale and rotation so no two trees read identical. Composes
// brush.ts only; all randomness flows through rng(seed) — one seed, one identical grove.

import { brushStroke, inkLine, rng, stipple, sv, wash, waveComb } from './brush';
import { bbox, edgeNormal, pointInPoly, resample } from './geom';
import type { Pt } from './geom';

const TAU = Math.PI * 2;

// Tones (Andon Steel only): silver = the drawn survey ink; the ink ramp recedes texture
// by TONE + weight (never opacity-to-invisible — spec L2 contrast floor).
const NEEDLE = 'var(--silver-dim)';
const TRUNK = 'var(--ink-soft)';
const PAD = 'var(--silver-faint)';
const CULM = 'var(--silver-dim)';
const LEAF = 'var(--silver-dim)';
const REED = 'var(--silver-dim)';
const GRASS = 'var(--ink-soft)';
const FLOOR = 'var(--ink-faint)';
const FOREST_WASH = 'var(--steel-0)';
const GROVE_WASH = 'var(--steel-hi)';

/** Stable per-call sub-seed factory — every inner mark gets its own derived seed. */
function seedSeq(base: string): () => string {
  let i = 0;
  return () => `${base}:${i++}`;
}

/** Min distance from a point to the polygon boundary (for edge-density falloff). */
function distToEdge(p: Pt, poly: readonly Pt[]): number {
  let best = Infinity;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [ax, ay] = poly[j]!;
    const [bx, by] = poly[i]!;
    const dx = bx - ax;
    const dy = by - ay;
    const l2 = dx * dx + dy * dy || 1;
    const t = Math.max(0, Math.min(1, ((p[0] - ax) * dx + (p[1] - ay) * dy) / l2));
    best = Math.min(best, Math.hypot(p[0] - (ax + dx * t), p[1] - (ay + dy * t)));
  }
  return best;
}

/** Trunk/branch limb: a tapered brushStroke when long enough to carry a belly, a
 *  hairline ink tick when the glyph is too small for the brush polygon to survive. */
function limb(
  parent: SVGElement,
  pts: readonly Pt[],
  seed: string,
  w: number,
  color = TRUNK,
): void {
  let len = 0;
  for (let i = 1; i < pts.length; i++)
    len += Math.hypot(pts[i]![0] - pts[i - 1]![0], pts[i]![1] - pts[i - 1]![1]);
  if (len >= 15) {
    brushStroke(parent, pts, { seed, w, color, taperIn: 0.1, taperOut: 0.42, amp: 0.7 });
  } else {
    inkLine(parent, pts, { seed, w: Math.max(0.8, w * 0.55), color, amp: 0.4 });
  }
}

/** One pine needle-pad: an OPAQUE steel cloud (it occludes the trunk behind it — the
 *  layered-crown depth of the period pictogram) carrying a real ink MASS — doubled
 *  silver body + combed interior needle strokes — a silver ridge along its top, a quiet
 *  under-arc, and needle ticks bristling from the ridge. `sweep` biases the whole pad's
 *  needles leeward (the wind-leant variant); `tuft` bristles it all round (scrub). */
function needlePad(
  parent: SVGElement,
  sd: () => string,
  r: () => number,
  cx: number,
  cy: number,
  w: number,
  h: number,
  o: { sweep?: number; tuft?: boolean } = {},
): void {
  const sweep = o.sweep ?? 0;
  const blob: Pt[] = [];
  const n = 9;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU;
    blob.push([
      cx + Math.cos(a) * (w / 2) * (0.82 + r() * 0.34) - Math.sin(a) * sweep * w * 0.05,
      cy + Math.sin(a) * (h / 2) * (0.72 + r() * 0.5),
    ]);
  }
  const amp = Math.max(0.8, w * 0.04);
  wash(parent, blob, { seed: sd(), fill: 'var(--steel-hi)', amp });
  wash(parent, blob, { seed: sd(), fill: PAD, amp });
  wash(parent, blob, { seed: sd(), fill: PAD, amp });
  // combed needle layers inside the pad — the crown is brushed foliage, never a rim
  const combs = Math.max(2, Math.round(h / 4));
  for (let i = 0; i < combs; i++) {
    const v = (i + 0.6) / (combs + 0.4) - 0.35; // -0.35..~0.55 of half-height
    const yl = cy + v * h * 0.7;
    const hw = (w / 2) * Math.sqrt(Math.max(0.05, 1 - v * v * 2.4)) * (0.55 + r() * 0.35);
    const x0 = cx - hw + sweep * h * 0.3;
    const x1 = cx + hw + sweep * h * 0.3;
    inkLine(
      parent,
      [
        [x0, yl + (r() - 0.5) * 1.4],
        [x1, yl + (r() - 0.5) * 1.4],
      ],
      {
        seed: sd(),
        w: 0.85,
        amp: 0.5,
        color: NEEDLE,
        opacity: 0.85,
      },
    );
  }
  const ridge: Pt[] = [];
  const m = 6;
  for (let i = 0; i <= m; i++) {
    const ux = (i / m) * 2 - 1;
    ridge.push([
      cx + ux * (w / 2) * 0.98,
      cy - Math.sqrt(Math.max(0, 1 - ux * ux)) * (h / 2) * (0.75 + r() * 0.3),
    ]);
  }
  inkLine(parent, ridge, { seed: sd(), w: 1.2, amp: 0.5, color: NEEDLE });
  // quiet under-arc closes the pad's belly so the cloud reads as a mass, not a lid
  const under: Pt[] = [];
  for (let i = 0; i <= 4; i++) {
    const ux = (i / 4) * 2 - 1;
    under.push([
      cx + ux * (w / 2) * 0.88,
      cy + Math.sqrt(Math.max(0, 1 - ux * ux)) * (h / 2) * (0.55 + r() * 0.25),
    ]);
  }
  inkLine(parent, under, { seed: sd(), w: 0.75, amp: 0.4, color: TRUNK, opacity: 0.85 });
  const ticks = Math.max(5, Math.round(w / 3.4)) + (o.tuft ? 3 : 0);
  for (let i = 0; i < ticks; i++) {
    const ux = ((i + 0.5) / ticks) * 2 - 1;
    let px: number;
    let py: number;
    let a: number;
    if (o.tuft) {
      // scrub tuft: needles radiate around the whole upper body
      const ta = Math.PI + ((i + 0.5) / ticks) * Math.PI + (r() - 0.5) * 0.3;
      px = cx + Math.cos(ta) * (w / 2) * 0.85;
      py = cy + Math.sin(ta) * (h / 2) * 0.8;
      a = ta + (r() - 0.5) * 0.4;
    } else {
      px = cx + ux * (w / 2) * 0.92;
      py = cy - Math.sqrt(Math.max(0, 1 - ux * ux)) * (h / 2) * 0.82;
      a = -Math.PI / 2 + ux * 0.8 + sweep * 0.7 + (r() - 0.5) * 0.3;
    }
    const len = h * (0.3 + r() * 0.3) * (o.tuft ? 1.15 : 1);
    inkLine(
      parent,
      [
        [px, py],
        [px + Math.cos(a) * len, py + Math.sin(a) * len],
      ],
      {
        seed: sd(),
        w: 0.8,
        amp: 0.25,
        color: NEEDLE,
      },
    );
  }
}

/** ONE brush pine — the survey's conifer pictogram. Five silhouettes selected by seed
 *  (kasa umbrella · two-step · wind-leant · tall three-tier · scrub), with seed-jittered
 *  scale, rotation and trunk lean, so a hillside of pines never reads stamped. */
export function pine(
  parent: SVGElement,
  x: number,
  y: number,
  s: number,
  seed: string,
  o?: { dim?: boolean },
): void {
  const r = rng(seed);
  const sd = seedSeq(seed);
  const variant = Math.floor(r() * 5) % 5;
  const k = s * (0.9 + r() * 0.2);
  const rot = (r() - 0.5) * 9;
  const lean = (r() - 0.5) * 0.36;
  const g = sv('g', {
    // deep-interior trees recede by TONE (ink ramp), never by opacity (L2)
    ...(o?.dim ? { style: '--silver-dim: var(--ink-soft)' } : {}),
    transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)})`,
  });
  parent.append(g);
  const tw = Math.max(0.9, k * 0.055);
  const pad = (
    px: number,
    py: number,
    pw: number,
    ph: number,
    po: { sweep?: number; tuft?: boolean } = {},
  ): void => needlePad(g, sd, r, px * k, py * k, pw * k, ph * k, po);
  const limbTo = (pts: readonly Pt[], w = tw): void =>
    limb(
      g,
      pts.map((p): Pt => [p[0] * k, p[1] * k]),
      sd(),
      w,
    );
  switch (variant) {
    case 0: // kasa — one broad flat umbrella pad on a bare stem
      limbTo([
        [0, 0],
        [lean * 0.35, -0.42],
        [lean * 0.62, -0.72],
      ]);
      pad(lean * 0.62, -0.78, 1.05, 0.3);
      break;
    case 1: // two-step — a clearly-dropped side pad under the main crown
      limbTo([
        [0, 0],
        [lean * 0.3, -0.45],
        [lean * 0.48, -0.88],
      ]);
      limbTo(
        [
          [lean * 0.22, -0.36],
          [-0.3 + lean * 0.3, -0.46],
        ],
        tw * 0.6,
      );
      pad(-0.36 + lean * 0.3, -0.52, 0.52, 0.24);
      pad(lean * 0.48 + 0.06, -0.95, 0.6, 0.26);
      break;
    case 2: {
      // wind-leant — trunk swept hard, pads elongated + needles streaming leeward
      const d = lean >= 0 ? 1 : -1;
      const L = d * (0.45 + Math.abs(lean) * 0.5);
      limbTo([
        [0, 0],
        [L * 0.4, -0.32],
        [L * 0.88, -0.52],
      ]);
      pad(L * 0.95, -0.6, 0.68, 0.2, { sweep: d * 0.9 });
      pad(L * 0.42, -0.4, 0.42, 0.16, { sweep: d * 0.9 });
      break;
    }
    case 3: // tall three-tier — narrow pads with open trunk between them
      limbTo([
        [0, 0],
        [lean * 0.25, -0.52],
        [lean * 0.4, -1.04],
      ]);
      limbTo(
        [
          [lean * 0.12, -0.42],
          [-0.17 + lean * 0.15, -0.48],
        ],
        tw * 0.55,
      );
      pad(-0.2 + lean * 0.15, -0.5, 0.4, 0.18);
      pad(0.16 + lean * 0.3, -0.76, 0.44, 0.19);
      pad(lean * 0.42, -1.08, 0.34, 0.2);
      break;
    default: // scrub — short, thick-stemmed, one round bristling tuft
      limbTo(
        [
          [0, 0],
          [lean * 0.22, -0.3],
        ],
        tw * 1.4,
      );
      pad(lean * 0.24, -0.46, 0.56, 0.42, { tuft: true });
  }
}

/** Scalloped canopy edge along a polygon — the period way to bound a forest mass:
 *  small outward brush-bulges instead of a surveyor's straightedge. */
function scallopEdge(
  parent: SVGElement,
  poly: readonly Pt[],
  seed: string,
  o: { color: string; w: number; step: number; bulge: number; opacity?: number },
): void {
  const r = rng(seed);
  const pts = resample([...poly, poly[0]!], o.step);
  if (pts.length < 3) return;
  let d = `M${pts[0]![0].toFixed(1)},${pts[0]![1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]!;
    const b = pts[i]!;
    const mx = (a[0] + b[0]) / 2;
    const my = (a[1] + b[1]) / 2;
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    let nx = -(b[1] - a[1]) / len;
    let ny = (b[0] - a[0]) / len;
    if (pointInPoly([mx + nx * 3, my + ny * 3], poly)) {
      nx = -nx;
      ny = -ny;
    }
    const bg = o.bulge * (0.6 + r() * 0.8);
    d += ` Q${(mx + nx * bg).toFixed(1)},${(my + ny * bg).toFixed(1)} ${b[0].toFixed(1)},${b[1].toFixed(1)}`;
  }
  parent.append(
    sv('path', {
      d,
      fill: 'none',
      stroke: o.color,
      'stroke-width': String(o.w),
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      ...(o.opacity !== undefined ? { opacity: String(o.opacity) } : {}),
    }),
  );
}

/** A forest MASS — how the survey draws woodland it will not count tree by tree:
 *  a dark under-wash, a scalloped canopy edge, and pines thick at the silhouette,
 *  thinning inward (the mapmaker inks the edge he can see). Optional stipple floor. */
export function treeMass(
  parent: SVGElement,
  poly: readonly Pt[],
  o: { seed: string; density?: number; floor?: boolean },
): void {
  const r = rng(o.seed);
  const sd = seedSeq(o.seed);
  wash(parent, poly, { seed: sd(), fill: FOREST_WASH, opacity: 0.8, amp: 5 });
  if (o.floor)
    stipple(parent, poly, { seed: sd(), step: 30, prob: 0.4, r: 1, color: FLOOR, opacity: 0.6 });
  // implied canopy — distant-crown bump scribbles between the drawn pines, so the
  // interior reads as continuous woodland, never as washed void (the anti-wireframe rule);
  // they recede by TONE (ink-soft under silver pines), not by vanishing opacity
  const { x0: bx0, y0: by0, x1: bx1, y1: by1 } = bbox(poly);
  for (let yy = by0 + 14; yy < by1; yy += 26) {
    for (let xx = bx0 + 14; xx < bx1; xx += 26) {
      const p: Pt = [xx + (r() - 0.5) * 22, yy + (r() - 0.5) * 22];
      if (r() > 0.55 || !pointInPoly(p, poly) || distToEdge(p, poly) < 8) continue;
      const bumps = 2 + Math.floor(r() * 2);
      const bw = 7 + r() * 6;
      let d = `M${p[0].toFixed(1)},${p[1].toFixed(1)}`;
      for (let j = 0; j < bumps; j++) {
        const nx = p[0] + (j + 1) * bw;
        d += ` Q${(p[0] + (j + 0.5) * bw).toFixed(1)},${(p[1] - (3.5 + r() * 3.5)).toFixed(1)} ${nx.toFixed(1)},${(p[1] + (r() - 0.5) * 2).toFixed(1)}`;
      }
      parent.append(
        sv('path', {
          d,
          fill: 'none',
          stroke: TRUNK,
          'stroke-width': '0.9',
          'stroke-linecap': 'round',
          opacity: '0.8',
        }),
      );
    }
  }
  scallopEdge(parent, poly, sd(), { color: NEEDLE, w: 1.8, step: 15, bulge: 5 });
  const step = 24 / Math.sqrt(o.density ?? 1);
  const { x0, y0, x1, y1 } = bbox(poly);
  const spots: { p: Pt; s: number }[] = [];
  for (let yy = y0 + step / 2; yy < y1; yy += step) {
    for (let xx = x0 + step / 2; xx < x1; xx += step) {
      const p: Pt = [xx + (r() - 0.5) * step * 0.9, yy + (r() - 0.5) * step * 0.9];
      if (!pointInPoly(p, poly)) continue;
      const d = distToEdge(p, poly);
      if (d < 4) continue;
      const near = 1 - Math.min(d / 34, 1);
      if (r() > 0.28 + 0.65 * near) continue;
      spots.push({ p, s: 14 + r() * 8 + (1 - near) * (6 + r() * 8) });
    }
  }
  spots.sort((a, b) => a.p[1] - b.p[1]);
  spots.forEach((sp, i) =>
    pine(parent, sp.p[0], sp.p[1], sp.s, `${o.seed}:t${i}`, {
      dim: distToEdge(sp.p, poly) > 56,
    }),
  );
}

/** A drooping fan of bamboo leaf-flicks from one node — the 个-stroke cluster every
 *  period painter used: three-to-four quick blades pointing down and out. */
function leafSpray(
  parent: SVGElement,
  sd: () => string,
  r: () => number,
  x: number,
  y: number,
  lean: number,
  len: number,
): void {
  const count = 4 + (r() < 0.45 ? 1 : 0);
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1) - 0.5;
    const a = Math.PI / 2 + t * 1.7 + lean * 0.8 + (r() - 0.5) * 0.25;
    const l = len * (0.7 + r() * 0.6);
    inkLine(
      parent,
      [
        [x, y],
        [x + Math.cos(a) * l, y + Math.sin(a) * l],
      ],
      {
        seed: sd(),
        w: 1.3,
        amp: 0.4,
        color: LEAF,
      },
    );
  }
}

/** A cluster of leaning culms with joints and leaf sprays (shared by clump + grove). */
function culmClump(
  parent: SVGElement,
  sd: () => string,
  r: () => number,
  x: number,
  y: number,
  s: number,
  lean: number,
  leafiness: number,
): void {
  const n = 4 + Math.floor(r() * 4);
  const tops: { p: Pt; a: number }[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1) - 0.5;
    const bx = x + t * s * 0.2 + (r() - 0.5) * s * 0.05;
    const cl = lean + t * 0.24 + (r() - 0.5) * 0.1;
    const h = s * (0.7 + r() * 0.5);
    const tipx = bx + Math.sin(cl) * h;
    const tipy = y - Math.cos(cl) * h;
    const w = Math.min(1.5, Math.max(0.7, s * 0.032)) * (0.8 + r() * 0.4);
    inkLine(
      parent,
      [
        [bx, y],
        [(bx + tipx) / 2 - Math.sin(cl) * h * 0.04, y - h * 0.5],
        [tipx, tipy],
      ],
      { seed: sd(), w, amp: 0.4, color: CULM },
    );
    if (r() < 0.55) {
      for (const f of [0.35, 0.62]) {
        const jx = bx + Math.sin(cl) * h * f;
        const jy = y - Math.cos(cl) * h * f;
        inkLine(
          parent,
          [
            [jx - 1.6, jy],
            [jx + 1.6, jy],
          ],
          {
            seed: sd(),
            w: 0.7,
            amp: 0.15,
            color: CULM,
          },
        );
      }
    }
    tops.push({ p: [tipx, tipy], a: cl });
  }
  for (const tp of tops)
    if (r() < 0.3 + 0.7 * leafiness) leafSpray(parent, sd, r, tp.p[0], tp.p[1], tp.a, s * 0.32);
  const extra = Math.round(leafiness * (2 + r() * 2));
  for (let i = 0; i < extra; i++) {
    const tp = tops[Math.floor(r() * tops.length)]!;
    const f = 0.55 + r() * 0.35;
    leafSpray(parent, sd, r, x + (tp.p[0] - x) * f, y + (tp.p[1] - y) * f, tp.a, s * 0.24);
  }
}

/** A massed bamboo clump — leaning culms fanning from one root-hold, joint ticks,
 *  leaf-flick sprays at the tips: the take-yabu mark of the estate's rear ground. */
export function bambooClump(
  parent: SVGElement,
  x: number,
  y: number,
  s: number,
  seed: string,
): void {
  const r = rng(seed);
  const sd = seedSeq(seed);
  culmClump(parent, sd, r, x, y, s * (0.9 + r() * 0.2), (r() - 0.5) * 0.44, 1);
}

/** A grove MASS — a raised wash + vertical culm-hatch for the uncountable interior,
 *  with individually-readable culm clumps leaning outward all along the silhouette
 *  (the painter details only the stems the lamplight catches at the edge). */
export function bambooGrove(parent: SVGElement, poly: readonly Pt[], o: { seed: string }): void {
  const r = rng(o.seed);
  const sd = seedSeq(o.seed);
  wash(parent, poly, { seed: sd(), fill: GROVE_WASH, opacity: 0.65, amp: 5 });
  const { x0, y0, x1, y1 } = bbox(poly);
  // massed interior culms — grouped parallel strokes sharing one lean (a stand of
  // stems, never lone rain-dashes), with the odd leaf flick at a group's head
  for (let yy = y0 + 7; yy < y1; yy += 14) {
    for (let xx = x0 + 7; xx < x1; xx += 14) {
      const p: Pt = [xx + (r() - 0.5) * 12, yy + (r() - 0.5) * 12];
      if (r() > 0.6 || !pointInPoly(p, poly) || distToEdge(p, poly) < 5) continue;
      const cl = (r() - 0.5) * 0.3;
      const gn = 2 + (r() < 0.5 ? 1 : 0);
      let headX = p[0];
      let headY = p[1];
      for (let g = 0; g < gn; g++) {
        const ox = (g - (gn - 1) / 2) * (2.4 + r() * 1.4);
        const dl = 10 + r() * 11;
        const bx = p[0] + ox;
        const by = p[1] + (r() - 0.5) * 3;
        const tx = bx + Math.sin(cl) * dl;
        const ty = by - Math.cos(cl) * dl;
        inkLine(
          parent,
          [
            [bx, by],
            [tx, ty],
          ],
          {
            seed: sd(),
            w: 0.7,
            amp: 0.25,
            color: FLOOR,
            opacity: 0.9,
          },
        );
        if (g === Math.floor(gn / 2)) {
          headX = tx;
          headY = ty;
        }
        // a joint tick mid-culm — the node is what says BAMBOO
        if (r() < 0.5) {
          const jf = 0.4 + r() * 0.25;
          const jx = bx + (tx - bx) * jf;
          const jy = by + (ty - by) * jf;
          inkLine(
            parent,
            [
              [jx - 1.4, jy],
              [jx + 1.4, jy],
            ],
            { seed: sd(), w: 0.7, amp: 0.1, color: FLOOR, opacity: 0.85 },
          );
        }
      }
      if (r() < 0.45) {
        for (const dir of [-1, 1]) {
          const a = Math.PI / 2 + cl + dir * (0.9 + r() * 0.3);
          inkLine(
            parent,
            [
              [headX, headY],
              [headX + Math.cos(a) * 3.4, headY + Math.sin(a) * 3.4],
            ],
            { seed: sd(), w: 0.8, amp: 0.15, color: FLOOR, opacity: 0.9 },
          );
        }
      }
    }
  }
  for (let yy = y0 + 14; yy < y1; yy += 30) {
    for (let xx = x0 + 14; xx < x1; xx += 30) {
      const p: Pt = [xx + (r() - 0.5) * 24, yy + (r() - 0.5) * 24];
      if (!pointInPoly(p, poly) || distToEdge(p, poly) < 14) continue;
      if (r() < 0.42) culmClump(parent, sd, r, p[0], p[1], 12 + r() * 8, (r() - 0.5) * 0.3, 0.35);
    }
  }
  const ring = resample([...poly, poly[0]!], 27);
  for (let i = 1; i < ring.length; i++) {
    const a = ring[i - 1]!;
    const b = ring[i]!;
    let [nx, ny] = edgeNormal(a, b);
    const mx = (a[0] + b[0]) / 2;
    const my = (a[1] + b[1]) / 2;
    if (pointInPoly([mx + nx * 4, my + ny * 4], poly)) {
      nx = -nx;
      ny = -ny;
    }
    const inset = 5 + r() * 6;
    culmClump(
      parent,
      sd,
      r,
      mx - nx * inset,
      my - ny * inset,
      19 + r() * 12,
      nx * 0.44 + (r() - 0.5) * 0.12,
      0.95,
    );
  }
}

/** A round-crown orchard tree — the fruit-tree pictogram: short trunk, one bumpy
 *  crown circle, a couple of interior foliage arcs. `feral` breaks the pruned shape
 *  with escaping tangle strokes and a water-shoot — neglect made visible (G8). */
export function fruitTree(
  parent: SVGElement,
  x: number,
  y: number,
  s: number,
  seed: string,
  o: { feral?: boolean } = {},
): void {
  const r = rng(seed);
  const sd = seedSeq(seed);
  const k = s * (0.88 + r() * 0.24);
  const cx = x + (r() - 0.5) * k * 0.12;
  const cy = y - k * 0.68;
  limb(
    parent,
    [
      [x, y],
      [x + (cx - x) * 0.5 + (r() - 0.5) * k * 0.06, y - k * 0.3],
      [cx, cy + k * 0.2],
    ],
    sd(),
    Math.max(0.9, k * 0.06),
  );
  // the fork — two branch ticks opening into the crown (a tree, not a stone)
  for (const side of [-1, 1]) {
    inkLine(
      parent,
      [
        [cx, cy + k * 0.22],
        [cx + side * k * (0.1 + r() * 0.1), cy + k * (0.02 - r() * 0.08)],
      ],
      { seed: sd(), w: 0.9, amp: 0.4, color: TRUNK },
    );
  }
  const blob: Pt[] = [];
  const n = 11;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU;
    blob.push([
      cx + Math.cos(a) * k * 0.42 * (0.82 + r() * 0.34),
      cy + Math.sin(a) * k * 0.38 * (0.82 + r() * 0.34),
    ]);
  }
  wash(parent, blob, { seed: sd(), fill: PAD, amp: 1.7 });
  wash(parent, blob, { seed: sd(), fill: PAD, amp: 1.7 });
  // broken bumpy outline — three-to-four overlapping arcs with lifted-brush gaps and
  // varied weight, so the crown reads drawn, never a closed CAD balloon
  const ring = resample([...blob, blob[0]!], 3.5);
  const arcsN = 3 + (r() < 0.4 ? 1 : 0);
  for (let i = 0; i < arcsN; i++) {
    const start = Math.floor((i / arcsN) * ring.length + r() * ring.length * 0.06);
    const span = Math.floor((ring.length / arcsN) * (0.75 + r() * 0.35));
    const seg: Pt[] = [];
    for (let j = 0; j <= span; j++) seg.push(ring[(start + j) % ring.length]!);
    if (seg.length < 2) continue;
    inkLine(parent, seg, {
      seed: sd(),
      w: Math.max(0.9, k * 0.045) * (0.8 + r() * 0.5),
      amp: 0.9,
      color: NEEDLE,
    });
  }
  const arcs = 2 + (r() < 0.5 ? 1 : 0);
  for (let i = 0; i < arcs; i++) {
    const a0 = r() * TAU;
    const rad = k * (0.12 + r() * 0.18);
    const pts: Pt[] = [];
    for (let j = 0; j <= 3; j++) {
      const a = a0 + (j / 3) * 1.6;
      pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]);
    }
    inkLine(parent, pts, { seed: sd(), w: 0.8, amp: 0.7, color: TRUNK, opacity: 0.9 });
  }
  if (o.feral) {
    const tangles = 3 + Math.floor(r() * 3);
    for (let i = 0; i < tangles; i++) {
      const a = r() * TAU;
      const a1 = a + (r() - 0.5) * 1.2;
      const r0 = k * (0.2 + r() * 0.15);
      const r1 = k * (0.5 + r() * 0.35);
      const p0: Pt = [cx + Math.cos(a) * r0, cy + Math.sin(a) * r0];
      const p2: Pt = [cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1];
      inkLine(parent, [p0, [(p0[0] + p2[0]) / 2, (p0[1] + p2[1]) / 2], p2], {
        seed: sd(),
        w: 0.85,
        amp: 2.4,
        color: TRUNK,
      });
    }
    if (r() < 0.7) {
      const wx = cx + (r() - 0.5) * k * 0.2;
      inkLine(
        parent,
        [
          [wx, cy + k * 0.1],
          [wx + (r() - 0.5) * k * 0.12, cy - k * 0.45],
          [wx + (r() - 0.5) * k * 0.2, cy - k * 0.72],
        ],
        { seed: sd(), w: 0.9, amp: 0.8, color: TRUNK },
      );
    }
  }
}

/** A small splayed stalk fan (reeds, grass) — outer stalks bow outward; reeds can
 *  carry a drooping seed-head tick. */
function stalkFan(
  parent: SVGElement,
  sd: () => string,
  r: () => number,
  x: number,
  y: number,
  o: {
    n: number;
    h: number;
    spread: number;
    bow: number;
    w: number;
    color: string;
    opacity?: number;
    heads?: boolean;
  },
): void {
  for (let i = 0; i < o.n; i++) {
    const t = o.n === 1 ? 0 : i / (o.n - 1) - 0.5;
    const a = -Math.PI / 2 + t * o.spread + (r() - 0.5) * 0.14;
    const h = o.h * (0.65 + r() * 0.55);
    const bx = x + t * o.h * 0.18;
    const dx = Math.cos(a);
    const dy = Math.sin(a);
    const bow = t * o.bow * h + (r() - 0.5) * o.bow * h * 0.3;
    const mid: Pt = [bx + dx * h * 0.55 - dy * bow * 0.35, y + dy * h * 0.55 + dx * bow * 0.35];
    const tipP: Pt = [bx + dx * h - dy * bow, y + dy * h + dx * bow];
    inkLine(parent, [[bx, y], mid, tipP], {
      seed: sd(),
      w: o.w,
      amp: 0.3,
      color: o.color,
      ...(o.opacity !== undefined ? { opacity: o.opacity } : {}),
    });
    if (o.heads && Math.abs(t) < 0.26 && r() < 0.75) {
      const ha = a + (r() < 0.5 ? 1 : -1) * (1.1 + r() * 0.4);
      inkLine(parent, [tipP, [tipP[0] + Math.cos(ha) * 3, tipP[1] + Math.sin(ha) * 3]], {
        seed: sd(),
        w: 1.4,
        amp: 0.15,
        color: o.color,
      });
    }
  }
}

/** A reed bed — tufts thick in the slack water (the polygon's interior), thinning to
 *  the current's edge, with a few suiha-mon wave-combs in the open gaps between. */
export function reedBed(parent: SVGElement, poly: readonly Pt[], o: { seed: string }): void {
  const r = rng(o.seed);
  const sd = seedSeq(o.seed);
  const { x0, y0, x1, y1 } = bbox(poly);
  const placed: Pt[] = [];
  for (let yy = y0 + 9; yy < y1; yy += 18) {
    for (let xx = x0 + 9; xx < x1; xx += 18) {
      const p: Pt = [xx + (r() - 0.5) * 14, yy + (r() - 0.5) * 14];
      if (!pointInPoly(p, poly)) continue;
      const slack = Math.min(distToEdge(p, poly) / 26, 1);
      if (r() > 0.1 + 0.55 * slack) continue;
      stalkFan(parent, sd, r, p[0], p[1], {
        n: 4 + Math.floor(r() * 3),
        h: 8 + r() * 6 + slack * 4,
        spread: 1.1,
        bow: 0.35,
        w: 0.85,
        color: REED,
        heads: true,
      });
      placed.push(p);
    }
  }
  let combs = 0;
  for (let tries = 0; tries < 80 && combs < 4; tries++) {
    const p: Pt = [x0 + r() * (x1 - x0), y0 + r() * (y1 - y0)];
    if (!pointInPoly(p, poly) || distToEdge(p, poly) < 12) continue;
    if (placed.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < 20)) continue;
    waveComb(parent, p[0], p[1], 18 + r() * 12, sd(), { opacity: 0.6 });
    combs++;
  }
}

/** Sparse grass tufts — the ruin-floor / margin tick (spec L4: grass breaching floors):
 *  small splayed flicks in the receding ink tone, never a lawn. */
export function grassTufts(
  parent: SVGElement,
  poly: readonly Pt[],
  o: { seed: string; density?: number },
): void {
  const r = rng(o.seed);
  const sd = seedSeq(o.seed);
  const step = 26 / Math.sqrt(o.density ?? 1);
  const { x0, y0, x1, y1 } = bbox(poly);
  for (let yy = y0 + step / 2; yy < y1; yy += step) {
    for (let xx = x0 + step / 2; xx < x1; xx += step) {
      const p: Pt = [xx + (r() - 0.5) * step * 0.9, yy + (r() - 0.5) * step * 0.9];
      if (!pointInPoly(p, poly)) continue;
      if (r() > 0.4) continue;
      stalkFan(parent, sd, r, p[0], p[1], {
        n: 3 + Math.floor(r() * 2),
        h: 4 + r() * 3.5,
        spread: 1.5,
        bow: 0.5,
        w: 0.75,
        color: GRASS,
        opacity: 0.9,
      });
    }
  }
}

/** Grid-planted orchard rows — trees on a courtyard grid (aligned to walls, not to the
 *  fields — G5/G8's tell). `feral` tangles every crown and seeds grass between trunks,
 *  but the planting GRID stays readable: that wrongness — a garden kept by no one,
 *  still holding its lines — is story, not noise. */
export function orchardRows(
  parent: SVGElement,
  origin: Pt,
  o: {
    seed: string;
    cols: number;
    rows: number;
    spacing: number;
    angleDeg?: number;
    feral?: boolean;
  },
): void {
  const r = rng(o.seed);
  const sd = seedSeq(o.seed);
  const ang = ((o.angleDeg ?? 0) * Math.PI) / 180;
  const ex: Pt = [Math.cos(ang), Math.sin(ang)];
  const ey: Pt = [-Math.sin(ang), Math.cos(ang)];
  const jit = (o.feral ? 0.11 : 0.05) * o.spacing;
  const at = (c: number, w: number): Pt => [
    origin[0] + c * ex[0] + w * ey[0],
    origin[1] + c * ex[1] + w * ey[1],
  ];
  for (let row = 0; row < o.rows; row++) {
    for (let col = 0; col < o.cols; col++) {
      const p = at(
        col * o.spacing + (r() - 0.5) * jit * 2,
        row * o.spacing + (r() - 0.5) * jit * 2,
      );
      const s = o.spacing * (o.feral ? 0.52 + r() * 0.3 : 0.56 + r() * 0.14);
      fruitTree(parent, p[0], p[1], s, `${o.seed}:o${row}-${col}`, {
        feral: o.feral === true && r() < 0.85,
      });
      if (o.feral && col < o.cols - 1 && r() < 0.55) {
        const q = at((col + 0.5) * o.spacing + (r() - 0.5) * 8, row * o.spacing + (r() - 0.5) * 8);
        stalkFan(parent, sd, r, q[0], q[1], {
          n: 3,
          h: 4.5 + r() * 3,
          spread: 1.5,
          bow: 0.5,
          w: 0.75,
          color: GRASS,
          opacity: 0.9,
        });
      }
    }
  }
}
