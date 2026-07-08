// map-sheets/water.ts — the WATER treatment (spec L5). On an Edo survey sheet the
// river is the showpiece: banks with brush weight, a water tone between them,
// current threads (suiha-mon) that carry direction, and the built works — weir,
// sluices, bridge — reading as human work in gold. Everything seeded (rng only),
// token-coloured, and composed from brush.ts.

import type { Pt } from './geom';
import { along, normalAt, offsetPolyline, resample } from './geom';
import { brushStroke, hatchArea, inkLine, rng, stipple, sv, waveComb, wash } from './brush';

/** Interpolate a half-width at fraction t from a width profile. */
function widthAt(profile: readonly { t: number; w: number }[], t: number): number {
  if (profile.length === 0) return 30;
  let lo = profile[0]!;
  let hi = profile[profile.length - 1]!;
  for (const p of profile) {
    if (p.t <= t && p.t >= lo.t) lo = p;
    if (p.t >= t && p.t <= hi.t) hi = p;
  }
  if (hi.t === lo.t) return lo.w;
  const f = (t - lo.t) / (hi.t - lo.t);
  return lo.w + (hi.w - lo.w) * f;
}

/** The river — wash between offset banks, tapered bank strokes, current threads
 *  broken into runs, shoal ticks at the slack edges. Flow = increasing t. */
export function river(
  parent: SVGElement,
  centerline: readonly Pt[],
  o: { seed: string; w?: number; widthProfile?: { t: number; w: number }[] },
): void {
  const r = rng(o.seed);
  const prof = o.widthProfile ?? [{ t: 0, w: o.w ?? 30 }];
  const line = resample(centerline, 26);
  const n = line.length;
  // per-point half-widths (with a light seeded breathing so banks never read CAD)
  const half = line.map((_, i) => {
    const t = i / (n - 1);
    return (widthAt(prof, t) / 2) * (1 + (r() - 0.5) * 0.14);
  });
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const [nx, ny] = normalAt(line, i);
    left.push([line[i]![0] + nx * half[i]!, line[i]![1] + ny * half[i]!]);
    right.push([line[i]![0] - nx * half[i]!, line[i]![1] - ny * half[i]!]);
  }
  // the water tone — a closed wash between the banks
  wash(parent, [...left, ...[...right].reverse()], {
    seed: `${o.seed}-tone`,
    fill: 'var(--steel-0)',
    opacity: 0.85,
    amp: 3,
  });
  // the banks — tapered structural brush lines (the drawn edge of the land)
  brushStroke(parent, left, {
    seed: `${o.seed}-bl`,
    w: 3.2,
    color: 'var(--silver-dim)',
    opacity: 0.85,
    taperIn: 0.06,
    taperOut: 0.06,
    amp: 2,
  });
  brushStroke(parent, right, {
    seed: `${o.seed}-br`,
    w: 2.4,
    color: 'var(--silver-dim)',
    opacity: 0.7,
    taperIn: 0.06,
    taperOut: 0.06,
    amp: 2,
  });
  // current threads — 2-3 broken runs riding the line (suiha-mon)
  const threads = 3;
  for (let k = 0; k < threads; k++) {
    const off = (k - (threads - 1) / 2) * 0.42; // fraction of half-width
    let t0 = 0.04 + r() * 0.1;
    while (t0 < 0.92) {
      const t1 = Math.min(0.96, t0 + 0.1 + r() * 0.14);
      const seg: Pt[] = [];
      for (let s = t0; s <= t1; s += 0.02) {
        const i = Math.min(n - 1, Math.round(s * (n - 1)));
        const [nx, ny] = normalAt(line, i);
        seg.push([line[i]![0] + nx * half[i]! * off, line[i]![1] + ny * half[i]! * off]);
      }
      if (seg.length > 1) {
        inkLine(parent, seg, {
          seed: `${o.seed}-cur-${k}-${t0.toFixed(2)}`,
          w: 0.9,
          color: 'var(--silver-dim)',
          opacity: 0.5,
          amp: 1.2,
        });
      }
      t0 = t1 + 0.08 + r() * 0.16;
    }
  }
  // shoal ticks — short slack-water strokes hugging the inside of bends
  for (let i = 0; i < 6; i++) {
    const t = 0.1 + r() * 0.8;
    const { p, tan } = along(line, t);
    const side = r() > 0.5 ? 1 : -1;
    const hw = widthAt(prof, t) / 2;
    const bx = p[0] - tan[1] * hw * 0.6 * side;
    const by = p[1] + tan[0] * hw * 0.6 * side;
    for (let s = 0; s < 3; s++) {
      inkLine(
        parent,
        [
          [bx - tan[0] * (7 + s * 3), by - tan[1] * (7 + s * 3)],
          [bx + tan[0] * (7 + s * 3), by + tan[1] * (7 + s * 3)],
        ],
        {
          seed: `${o.seed}-shoal-${i}-${s}`,
          w: 0.8,
          color: 'var(--silver-faint)',
          opacity: 0.6,
          amp: 0.8,
        },
      );
    }
  }
}

/** A pool — standing water (wash + combs), or a DRAINED bed: rim, cracked mud,
 *  no water tone (the T1 re-survey retires the upstream pools this way). */
export function pool(
  parent: SVGElement,
  cx: number,
  cy: number,
  rad: number,
  o: { seed: string; drained?: boolean },
): void {
  const r = rng(o.seed);
  const ring: Pt[] = [];
  const steps = 9;
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const rr = rad * (0.82 + r() * 0.3) * (1 + Math.sin(a * 2) * 0.08);
    ring.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.7]);
  }
  if (o.drained) {
    inkLine(parent, [...ring, ring[0]!], {
      seed: `${o.seed}-rim`,
      w: 1.2,
      color: 'var(--ink-soft)',
      opacity: 0.8,
      amp: 2,
    });
    hatchArea(parent, ring, {
      seed: `${o.seed}-crack`,
      angle: 32,
      spacing: 9,
      w: 0.8,
      color: 'var(--ink-faint)',
      opacity: 0.7,
    });
    stipple(parent, ring, {
      seed: `${o.seed}-dry`,
      step: 14,
      prob: 0.3,
      r: 0.9,
      color: 'var(--ink-faint)',
      opacity: 0.6,
    });
    return;
  }
  wash(parent, ring, { seed: `${o.seed}-tone`, fill: 'var(--steel-0)', opacity: 0.9, amp: 2.5 });
  brushStroke(parent, [...ring, ring[0]!], {
    seed: `${o.seed}-edge`,
    w: 1.8,
    color: 'var(--silver-dim)',
    opacity: 0.7,
    taperIn: 0.03,
    taperOut: 0.03,
    amp: 1.5,
  });
  waveComb(parent, cx, cy - rad * 0.12, rad * 0.9, `${o.seed}-c1`, { opacity: 0.55 });
  waveComb(parent, cx + rad * 0.2, cy + rad * 0.28, rad * 0.6, `${o.seed}-c2`, { opacity: 0.4 });
}

/** The weir — an EVENT on the river (spec L3; inbox drain FB: "I don't
 *  physically see the weir"): a structural gold bar clean across the water,
 *  two courses of laid stones riding it, stake ticks on the downstream face,
 *  and the water's own testimony — a foam step of wave-combs just below. */
export function weirBar(
  parent: SVGElement,
  at: Pt,
  angleDeg: number,
  o: { seed: string; len?: number },
): void {
  const r = rng(o.seed);
  const len = o.len ?? 54;
  const a = (angleDeg * Math.PI) / 180;
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  const g = sv('g');
  // the bar itself — one heavy tapered stroke bank-to-bank (structure weight)
  brushStroke(
    g,
    [
      [at[0] - dx * (len / 2 + 5), at[1] - dy * (len / 2 + 5)],
      [at[0] + dx * (len / 2 + 5), at[1] + dy * (len / 2 + 5)],
    ],
    { seed: `${o.seed}-bar`, w: 4.4, color: 'var(--gold-dim)', opacity: 0.95, amp: 0.8 },
  );
  // two courses of squared stones on the bar
  const stones = Math.max(5, Math.round(len / 12));
  for (let course = 0; course < 2; course++) {
    const off = course === 0 ? -3.4 : 3.4;
    for (let i = 0; i < stones; i++) {
      const t = (i + 0.5) / stones - 0.5 + (course === 1 ? 0.5 / stones : 0);
      const sx = at[0] + dx * len * t - dy * off + (r() - 0.5) * 2;
      const sy = at[1] + dy * len * t + dx * off + (r() - 0.5) * 2;
      g.append(
        sv('rect', {
          x: String(sx - 6.5),
          y: String(sy - 4),
          width: '13',
          height: '8',
          fill: 'var(--steel-2)',
          stroke: 'var(--gold-dim)',
          'stroke-width': '1.6',
          transform: `rotate(${angleDeg + (r() - 0.5) * 12} ${sx} ${sy})`,
        }),
      );
    }
  }
  // stake ticks driven along the downstream face
  for (let i = 0; i < stones - 1; i++) {
    const t = (i + 1) / stones - 0.5;
    const sx = at[0] + dx * len * t - dy * 10;
    const sy = at[1] + dy * len * t + dx * 10;
    inkLine(
      g,
      [
        [sx, sy],
        [sx + (r() - 0.5) * 2, sy + 8],
      ],
      { seed: `${o.seed}-stk-${i}`, w: 1.6, color: 'var(--gold-dim)', opacity: 0.85, amp: 0.5 },
    );
  }
  // the fall — foam combs just downstream say WEIR the way water says it
  waveComb(g, at[0] - dy * 16, at[1] + dx * 16, len * 0.62, `${o.seed}-fall1`, { opacity: 0.7 });
  waveComb(g, at[0] - dy * 27, at[1] + dx * 27, len * 0.4, `${o.seed}-fall2`, { opacity: 0.5 });
  parent.append(g);
}

/** An irrigation ditch — and it must read as WATER at fit zoom, not a road
 *  (rubric R4: blind pass 2 read the old hairline pair as "a path" and its
 *  works as "a gold vein"): tapered cut banks at working weight, the dark
 *  ditch cut, a broken current thread RIDING the water (the river's suiha
 *  idiom at ditch scale), and downstream chevrons. silted = the far reach
 *  breaks up into dots and dies (the half-lost work the field-hands hint at). */
export function channel(
  parent: SVGElement,
  pts: readonly Pt[],
  o: { seed: string; silted?: boolean },
): void {
  const line = resample(pts, 18);
  const a = offsetPolyline(line, 2.3);
  const b = offsetPolyline(line, -2.3);
  if (!o.silted) {
    // the water first — on the night sheet a thin dark cut is INVISIBLE (the
    // pass-2 "reads as a road" miss); moonlit water is a soft silver sheen
    // between the banks
    inkLine(parent, line, {
      seed: `${o.seed}-wet`,
      w: 3.4,
      color: 'var(--silver-dim)',
      opacity: 0.3,
    });
    brushStroke(parent, a, {
      seed: `${o.seed}-a`,
      w: 2,
      color: 'var(--silver-dim)',
      opacity: 0.9,
      taperIn: 0.05,
      taperOut: 0.05,
      amp: 1.4,
    });
    brushStroke(parent, b, {
      seed: `${o.seed}-b`,
      w: 1.6,
      color: 'var(--silver-dim)',
      opacity: 0.75,
      taperIn: 0.05,
      taperOut: 0.05,
      amp: 1.4,
    });
    // water IN the ditch — broken current runs down the centre; a road has none
    const r = rng(`${o.seed}-cur`);
    let t0 = 0.05 + r() * 0.08;
    while (t0 < 0.9) {
      const t1 = Math.min(0.95, t0 + 0.12 + r() * 0.16);
      const seg: Pt[] = [];
      for (let s = t0; s <= t1; s += 0.03) seg.push(along(line, s).p);
      if (seg.length > 1) {
        inkLine(parent, seg, {
          seed: `${o.seed}-cur-${t0.toFixed(2)}`,
          w: 1,
          color: 'var(--silver)',
          opacity: 0.55,
          amp: 1.1,
        });
      }
      t0 = t1 + 0.1 + r() * 0.18;
    }
    let len = 0;
    for (let i = 1; i < line.length; i++) {
      len += Math.hypot(line[i]![0] - line[i - 1]![0], line[i]![1] - line[i - 1]![1]);
    }
    flowTicks(parent, line, { seed: `${o.seed}-flow`, count: Math.max(3, Math.round(len / 170)) });
    // sedge along the cut — the accessory that says WET the way the weir reeds
    // do: small diverging flicks off the bank, alternating sides down the run
    const sr = rng(`${o.seed}-sedge`);
    const flicks = Math.max(4, Math.round(len / 95));
    for (let i = 0; i < flicks; i++) {
      const t = 0.06 + ((i + sr() * 0.6) / flicks) * 0.88;
      const { p, tan } = along(i % 2 === 0 ? a : b, Math.min(0.96, t));
      const side = i % 2 === 0 ? -1 : 1;
      const bx = p[0] + tan[1] * 1.5 * side;
      const by = p[1] - tan[0] * 1.5 * side;
      const h = 4.5 + sr() * 3;
      for (const lean of [-0.55, 0, 0.5] as const) {
        inkLine(
          parent,
          [
            [bx, by],
            [bx + lean * h + tan[1] * side * h * 0.35, by - h + sr() * 1.5],
          ],
          {
            seed: `${o.seed}-sg-${i}-${lean}`,
            w: 0.8,
            color: 'var(--silver-dim)',
            opacity: 0.75,
            amp: 0.4,
          },
        );
      }
    }
    return;
  }
  // silted: the first stretch holds, then the line breaks and fades
  const cut = Math.max(2, Math.floor(line.length * 0.45));
  inkLine(parent, a.slice(0, cut), {
    seed: `${o.seed}-a`,
    w: 1.1,
    color: 'var(--silver-dim)',
    opacity: 0.6,
  });
  inkLine(parent, b.slice(0, cut), {
    seed: `${o.seed}-b`,
    w: 1.1,
    color: 'var(--silver-dim)',
    opacity: 0.5,
  });
  inkLine(parent, a.slice(cut - 1), {
    seed: `${o.seed}-a2`,
    w: 1,
    color: 'var(--ink-faint)',
    dash: '2 7',
    opacity: 0.7,
  });
  inkLine(parent, b.slice(cut - 1), {
    seed: `${o.seed}-b2`,
    w: 1,
    color: 'var(--ink-faint)',
    dash: '2 8',
    opacity: 0.55,
  });
}

/** A sluice gate — a small bar across the ditch + two posts: built work, gold. */
export function sluiceGate(parent: SVGElement, at: Pt, angleDeg: number, seed: string): void {
  const a = (angleDeg * Math.PI) / 180;
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  brushStroke(
    parent,
    [
      [at[0] - dx * 9, at[1] - dy * 9],
      [at[0] + dx * 9, at[1] + dy * 9],
    ],
    { seed: `${seed}-bar`, w: 3.4, color: 'var(--gold-dim)', opacity: 0.9, amp: 0.6 },
  );
  for (const s of [-1, 1] as const) {
    inkLine(
      parent,
      [
        [at[0] + dx * 10 * s, at[1] + dy * 10 * s - 4],
        [at[0] + dx * 10 * s, at[1] + dy * 10 * s + 4],
      ],
      { seed: `${seed}-p${s}`, w: 1.6, color: 'var(--gold-dim)', opacity: 0.85, amp: 0.4 },
    );
  }
}

/** A plank footbridge — two bearers + plank ticks (the way to Matsuzō's bank). */
export function bridge(
  parent: SVGElement,
  at: Pt,
  angleDeg: number,
  o: { seed: string; len?: number },
): void {
  const r = rng(o.seed);
  const len = o.len ?? 46;
  const a = (angleDeg * Math.PI) / 180;
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  for (const s of [-1, 1] as const) {
    inkLine(
      parent,
      [
        [at[0] - dx * (len / 2), at[1] - dy * (len / 2) + s * 3.2],
        [at[0] + dx * (len / 2), at[1] + dy * (len / 2) + s * 3.2],
      ],
      { seed: `${o.seed}-br${s}`, w: 1.8, color: 'var(--gold-dim)', opacity: 0.9, amp: 0.8 },
    );
  }
  const planks = Math.max(5, Math.round(len / 7));
  for (let i = 0; i < planks; i++) {
    const t = (i + 0.5) / planks - 0.5;
    const px = at[0] + dx * len * t;
    const py = at[1] + dy * len * t;
    inkLine(
      parent,
      [
        [px - dy * 5, py + dx * 5],
        [px + dy * 5, py - dx * 5],
      ],
      {
        seed: `${o.seed}-pl${i}`,
        w: 1.1,
        color: 'var(--gold-dim)',
        opacity: 0.7 + r() * 0.2,
        amp: 0.5,
      },
    );
  }
}

/** Downstream chevrons — the flow direction, readable at a glance (spec R2). */
export function flowTicks(
  parent: SVGElement,
  centerline: readonly Pt[],
  o: { seed: string; count?: number },
): void {
  const r = rng(o.seed);
  const count = o.count ?? 6;
  for (let i = 0; i < count; i++) {
    const t = 0.08 + ((i + r() * 0.5) / count) * 0.86;
    const { p, tan } = along(centerline, t);
    const s = 5 + r() * 2;
    // a chevron pointing downstream (+tangent)
    for (const side of [-1, 1] as const) {
      inkLine(
        parent,
        [
          [
            p[0] - tan[0] * s - tan[1] * s * 0.7 * side,
            p[1] - tan[1] * s + tan[0] * s * 0.7 * side,
          ],
          [p[0] + tan[0] * s, p[1] + tan[1] * s],
        ],
        {
          seed: `${o.seed}-ft-${i}-${side}`,
          w: 1,
          color: 'var(--silver-dim)',
          opacity: 0.65,
          amp: 0.6,
        },
      );
    }
  }
}

/** A leased fish weir — a V of stake dots, apex upstream, opening downstream. */
export function fishWeir(parent: SVGElement, at: Pt, angleDeg: number, seed: string): void {
  const r = rng(seed);
  const a = (angleDeg * Math.PI) / 180;
  // the V opens along the flow: arms run downstream from the apex
  const fx = Math.sin(a); // downstream direction (perpendicular to the bar angle)
  const fy = Math.cos(a);
  const g = sv('g', { fill: 'var(--silver-dim)' });
  for (const side of [-1, 1] as const) {
    for (let i = 0; i < 5; i++) {
      const d = 3 + i * 5;
      const sx = at[0] + fx * d + Math.cos(a) * d * 0.55 * side + (r() - 0.5) * 1.5;
      const sy = at[1] + fy * d + Math.sin(a) * d * 0.55 * side + (r() - 0.5) * 1.5;
      g.append(sv('circle', { cx: sx.toFixed(1), cy: sy.toFixed(1), r: '1.3' }));
    }
  }
  parent.append(g);
}
