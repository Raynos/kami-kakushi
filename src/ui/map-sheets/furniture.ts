// map-sheets/furniture.ts — SHEET FURNITURE (spec L8): the survey's own voice. The
// cartouche, legend, scale bar, north mark, frame, creases, distance notes and seals
// that make the drawing read as a COMMISSIONED, REVISED period document rather than a
// diagram. Everything composes from brush.ts (seeded, token-coloured, brush-alive);
// silver = drawn state, gold = the frame keyline, shu = the reviser's red only.

import { sv, rng, scrawl, inkLine, brushStroke, wash, inkText, resample, type Pt } from './brush';

/** Closed hand-scrawled rect path (corners + side midpoints so long sides waver). */
function rectRing(x: number, y: number, w: number, h: number): Pt[] {
  return [
    [x, y],
    [x + w / 2, y],
    [x + w, y],
    [x + w, y + h / 2],
    [x + w, y + h],
    [x + w / 2, y + h],
    [x, y + h],
    [x, y + h / 2],
  ];
}

/** Four tapered brush strokes forming a frame, corners overrun so they read hand-joined. */
function brushFrame(
  parent: SVGElement,
  x: number,
  y: number,
  w: number,
  h: number,
  o: { seed: string; w: number; color: string },
): void {
  const v = Math.max(2.5, o.w * 1.1); // corner overrun — strokes cross, never mitred
  const side = (pts: Pt[], sub: string): void =>
    brushStroke(parent, pts, {
      seed: `${o.seed}:${sub}`,
      w: o.w,
      color: o.color,
      taperIn: 0.06,
      taperOut: 0.08,
      amp: 1.1,
      wobble: 0.14,
    });
  side(
    [
      [x - v, y],
      [x + w + v, y],
    ],
    'n',
  );
  side(
    [
      [x + w, y - v],
      [x + w, y + h + v],
    ],
    'e',
  );
  side(
    [
      [x + w + v, y + h],
      [x - v, y + h],
    ],
    's',
  );
  side(
    [
      [x, y + h + v],
      [x, y - v],
    ],
    'w',
  );
}

export interface HankoOpts {
  readonly seed: string;
  /** side of the square, px (default 32) */
  readonly size?: number;
}

/**
 * A red seal square (印) pressed on the sheet — the reviser's mark. Period surveys
 * carry vermillion seals wherever an official hand touched the record; a real
 * impression is never perfect, so the border is double-struck with uneven ink, the
 * square sits slightly tilted, and a faint press-ghost fills the field.
 */
export function hankoSeal(
  parent: SVGElement,
  x: number,
  y: number,
  char: string,
  o: HankoOpts,
): void {
  const size = o.size ?? 32;
  const r = rng(`${o.seed}:hanko`);
  const tilt = (r() < 0.5 ? -1 : 1) * (2.5 + r() * 4.5);
  const g = sv('g', { transform: `rotate(${tilt.toFixed(1)} ${x} ${y})` });
  const h = size / 2;
  const ring = rectRing(x - h, y - h, size, size);
  // press ghost — the pad's uneven kiss inside the border
  g.append(
    sv('path', {
      d: scrawl(ring, `${o.seed}:ghost`, size * 0.04, true),
      fill: 'var(--shu)',
      opacity: '0.14',
      stroke: 'none',
    }),
  );
  // double-struck border: a heavy pass + an offset lighter pass = uneven ink take-up
  g.append(
    sv('path', {
      d: scrawl(ring, `${o.seed}:b1`, size * 0.032, true),
      fill: 'none',
      stroke: 'var(--shu)',
      'stroke-width': (size * 0.085).toFixed(2),
      'stroke-linejoin': 'round',
      opacity: '0.9',
    }),
  );
  g.append(
    sv('path', {
      d: scrawl(ring, `${o.seed}:b2`, size * 0.028, true),
      fill: 'none',
      stroke: 'var(--shu)',
      'stroke-width': (size * 0.045).toFixed(2),
      'stroke-linejoin': 'round',
      opacity: '0.42',
    }),
  );
  const cs = size * 0.58;
  inkText(g, x + (r() - 0.5) * size * 0.06, y + cs * 0.36 + (r() - 0.5) * size * 0.04, char, {
    size: cs,
    color: 'var(--shu)',
  });
  parent.append(g);
}

export interface CartoucheOpts {
  readonly seed: string;
  /** vertical kanji title, e.g. 黒沢家領内絵図・改 */
  readonly title: string;
  /** optional smaller left-hand column (era / commission line) */
  readonly sub?: string;
}

/**
 * The bordered title block — the 題簽 (daisen) slip of an Edo estate map: a raised
 * paper slip in the sheet's corner carrying the survey's name in a vertical column,
 * framed heavy, with the reviser's red 改 seal pressed below it. The loudest piece
 * of furniture on the sheet, on purpose — it names the document.
 */
export function cartouche(parent: SVGElement, x: number, y: number, o: CartoucheOpts): void {
  const mainSize = 21;
  const subSize = 12;
  const padX = 12;
  const padY = 16;
  const mainW = mainSize * 1.5;
  const subW = o.sub ? subSize * 1.8 : 0;
  const titleH = o.title.length * mainSize * 1.06;
  const subH = o.sub ? o.sub.length * subSize * 1.08 : 0;
  const W = padX * 2 + mainW + subW;
  const H = padY * 2 + Math.max(titleH, subH);
  const g = sv('g');
  // the pasted slip — a raised steel tone lifting off whatever ground it lands on
  wash(g, rectRing(x, y, W, H), {
    seed: `${o.seed}:paper`,
    fill: 'var(--steel-hi)',
    opacity: 0.96,
    amp: 2,
  });
  // inner gold keyline first, heavy silver brush frame over it — kept inside the
  // frame's wobble so it stays a visible second voice (contrast floor, spec L2)
  g.append(
    sv('path', {
      d: scrawl(rectRing(x + 6, y + 6, W - 12, H - 12), `${o.seed}:key`, 0.9, true),
      fill: 'none',
      stroke: 'var(--gold)',
      'stroke-width': '1.35',
      'stroke-linejoin': 'round',
      opacity: '0.92',
    }),
  );
  brushFrame(g, x, y, W, H, { seed: `${o.seed}:frame`, w: 3.4, color: 'var(--silver)' });
  const titleX = x + W - padX - mainW / 2;
  inkText(g, titleX, y + padY + titleH / 2, o.title, {
    size: mainSize,
    color: 'var(--silver)',
    vertical: true,
  });
  if (o.sub) {
    inkText(g, x + padX + subW / 2, y + padY + subH / 2, o.sub, {
      size: subSize,
      color: 'var(--silver-dim)',
      vertical: true,
    });
  }
  hankoSeal(g, titleX, y + H + 26, '改', { seed: `${o.seed}:kai`, size: 30 });
  parent.append(g);
}

export interface LegendEntry {
  /** the survey mark itself — a kanji seal char */
  readonly mark: string;
  /** optional CSS class on the mark text so sheet CSS can tint it (e.g. shu) */
  readonly markClass?: string;
  /** short English gloss, body face */
  readonly gloss: string;
}

export interface LegendOpts {
  readonly seed: string;
  readonly entries: readonly LegendEntry[];
  /** header, default 凡例 */
  readonly title?: string;
  /** box width, px (default 178) */
  readonly w?: number;
}

/**
 * The 凡例 legend box — kuni-ezu surveys carry a small framed table decoding the
 * surveyor's own marks. One row per mark: the kanji in its seal-chip square (the
 * sheet's live label grammar, so the legend teaches by resemblance) + a one-line
 * gloss in the body face. The mystery marks stay OUT of it by design (G12).
 */
export function legendBox(parent: SVGElement, x: number, y: number, o: LegendOpts): void {
  const r = rng(`${o.seed}:legend`);
  const W = o.w ?? 178;
  const pad = 12;
  const headerH = 28;
  const rowH = 27;
  const H = pad + headerH + o.entries.length * rowH + pad - 2;
  const g = sv('g');
  wash(g, rectRing(x, y, W, H), {
    seed: `${o.seed}:paper`,
    fill: 'var(--steel-2)',
    opacity: 0.94,
    amp: 2,
  });
  brushFrame(g, x, y, W, H, { seed: `${o.seed}:frame`, w: 2.1, color: 'var(--silver-dim)' });
  inkText(g, x + W / 2, y + pad + 12, o.title ?? '凡例', { size: 14, color: 'var(--silver)' });
  inkLine(
    g,
    [
      [x + 10, y + pad + headerH - 6],
      [x + W - 10, y + pad + headerH - 6],
    ],
    {
      seed: `${o.seed}:rule`,
      w: 0.8,
      color: 'var(--silver-wire)',
      amp: 0.8,
    },
  );
  const chip = 19;
  o.entries.forEach((e, i) => {
    const cy = y + pad + headerH + i * rowH + rowH / 2;
    const cx = x + pad + chip / 2;
    // the seal-chip square, each pressed a hair off true
    const rot = (r() - 0.5) * 5;
    const cg = sv('g', { transform: `rotate(${rot.toFixed(1)} ${cx} ${cy})` });
    cg.append(
      sv('path', {
        d: scrawl(
          rectRing(cx - chip / 2, cy - chip / 2, chip, chip),
          `${o.seed}:chip${i}`,
          0.8,
          true,
        ),
        fill: 'none',
        stroke: 'var(--silver-wire)',
        'stroke-width': '0.9',
        'stroke-linejoin': 'round',
      }),
    );
    // mark text: fill by ATTRIBUTE so a markClass CSS rule can tint it (class > attr)
    cg.append(
      sv(
        'text',
        {
          x: String(cx),
          y: (cy + 4.9).toFixed(1),
          'text-anchor': 'middle',
          fill: 'var(--silver)',
          style: 'font-family:var(--font-head);font-size:13.5px;',
          ...(e.markClass ? { class: e.markClass } : {}),
        },
        e.mark,
      ),
    );
    g.append(cg);
    g.append(
      sv(
        'text',
        {
          x: String(x + pad + chip + 9),
          y: (cy + 4.4).toFixed(1),
          fill: 'var(--ink-soft)',
          style: 'font-family:var(--font-body);font-size:13px;',
        },
        e.gloss,
      ),
    );
  });
  parent.append(g);
}

export interface ScaleBarOpts {
  readonly seed: string;
  /** the measure the bar spans, e.g. 一町 */
  readonly label: string;
  /** tick divisions (default 6 — 間 subdivisions of the 町) */
  readonly ticks?: number;
  /** bar length, px (default 168) */
  readonly length?: number;
}

/**
 * A period scale bar — Edo surveys state their measure as a ruled brush line divided
 * into 間/町 units, the whole span named (e.g. 一町 = 60 ken). Drawn as a tapered
 * baseline with hand-set tick divisions, the end ticks strongest.
 */
export function scaleBar(parent: SVGElement, x: number, y: number, o: ScaleBarOpts): void {
  const r = rng(`${o.seed}:scale`);
  const len = o.length ?? 168;
  const n = Math.max(2, o.ticks ?? 6);
  const g = sv('g');
  brushStroke(
    g,
    [
      [x, y],
      [x + len, y],
    ],
    {
      seed: `${o.seed}:base`,
      w: 2.4,
      color: 'var(--silver)',
      taperIn: 0.05,
      taperOut: 0.08,
      amp: 0.7,
      wobble: 0.1,
    },
  );
  for (let i = 0; i <= n; i++) {
    const tx = x + (len * i) / n + (r() - 0.5) * 1.2;
    const end = i === 0 || i === n;
    const tall = end ? 10 : i === n / 2 ? 7.5 : 5.5;
    inkLine(
      g,
      [
        [tx, y + 1.5],
        [tx, y - tall],
      ],
      {
        seed: `${o.seed}:t${i}`,
        w: end ? 1.7 : 1.3,
        color: end ? 'var(--silver)' : 'var(--silver-dim)',
        amp: 0.5,
      },
    );
  }
  inkText(g, x + len / 2, y + 17, o.label, {
    size: 12.5,
    color: 'var(--ink-soft)',
    angle: (r() - 0.5) * 3,
  });
  parent.append(g);
}

/**
 * The north mark — period sheets orient by a brush arrow with the character 北 at
 * its head rather than a compass rose. One tapering upstroke, a two-flick head, the
 * character above; the whole mark set a few degrees off true, as a hand would.
 */
export function northArrow(parent: SVGElement, x: number, y: number, seed: string): void {
  const r = rng(`${seed}:north`);
  const tilt = (r() - 0.5) * 7;
  const g = sv('g', { transform: `rotate(${tilt.toFixed(1)} ${x} ${y})` });
  // the upstroke: fat belly low, one long draw to a point at the tip
  brushStroke(
    g,
    [
      [x, y + 36],
      [x, y - 18],
    ],
    {
      seed: `${seed}:shaft`,
      w: 5.6,
      color: 'var(--silver)',
      taperIn: 0.18,
      taperOut: 0.5,
      amp: 0.5,
      wobble: 0.08,
    },
  );
  // head flicks: drawn FROM the tip outward-down with an outward bow, fat where
  // they load off the shaft, lifting to nothing — joined, never a detached vee
  brushStroke(
    g,
    [
      [x - 0.5, y - 16.5],
      [x - 7.5, y - 10],
      [x - 12, y - 0.5],
    ],
    {
      seed: `${seed}:hl`,
      w: 4.1,
      color: 'var(--silver)',
      taperIn: 0.1,
      taperOut: 0.55,
      amp: 0.4,
    },
  );
  brushStroke(
    g,
    [
      [x + 0.5, y - 16.5],
      [x + 6.5, y - 10.5],
      [x + 12, y - 0.5],
    ],
    {
      seed: `${seed}:hr`,
      w: 4.1,
      color: 'var(--silver)',
      taperIn: 0.1,
      taperOut: 0.55,
      amp: 0.4,
    },
  );
  inkText(g, x, y - 26, '北', { size: 20, color: 'var(--silver)' });
  parent.append(g);
}

export interface BorderOpts {
  readonly seed: string;
}

/**
 * The double survey frame — a drawn sheet rules its own margin: an outer silver
 * hairline (the trimmed edge) + an inner gold keyline (the surveyed field) + small
 * gold corner ticks where the keyline was squared off the mounting board.
 */
export function sheetBorder(parent: SVGElement, w: number, h: number, o: BorderOpts): void {
  const g = sv('g');
  const ring = (inset: number): Pt[] =>
    resample(
      [
        [inset, inset],
        [w - inset, inset],
        [w - inset, h - inset],
        [inset, h - inset],
        [inset, inset],
      ],
      110,
    ).slice(0, -1);
  g.append(
    sv('path', {
      d: scrawl(ring(10), `${o.seed}:outer`, 1.2, true),
      fill: 'none',
      stroke: 'var(--silver-dim)',
      'stroke-width': '0.9',
      'stroke-linejoin': 'round',
    }),
  );
  g.append(
    sv('path', {
      d: scrawl(ring(20), `${o.seed}:key`, 1, true),
      fill: 'none',
      stroke: 'var(--gold-dim)',
      'stroke-width': '1.15',
      'stroke-linejoin': 'round',
    }),
  );
  // corner ticks — short gold reinforcements over the keyline corners
  const k = 20;
  const t = 12;
  const corners: [Pt, Pt, Pt][] = [
    [
      [k, k],
      [k + t, k],
      [k, k + t],
    ],
    [
      [w - k, k],
      [w - k - t, k],
      [w - k, k + t],
    ],
    [
      [w - k, h - k],
      [w - k - t, h - k],
      [w - k, h - k - t],
    ],
    [
      [k, h - k],
      [k + t, h - k],
      [k, h - k - t],
    ],
  ];
  corners.forEach(([c, a, b], i) => {
    inkLine(g, [c, a], { seed: `${o.seed}:ct${i}a`, w: 2, color: 'var(--gold)', amp: 0.5 });
    inkLine(g, [c, b], { seed: `${o.seed}:ct${i}b`, w: 2, color: 'var(--gold)', amp: 0.5 });
  });
  parent.append(g);
}

export interface CreaseOpts {
  readonly seed: string;
}

/**
 * Fold creases — a carried map folds 3×3, and the folds stay in the paper: two
 * vertical + two horizontal VERY faint wavering lines at the third-marks, quieter
 * than any linework (ink-faint, ~0.35). Pure sheet-material voice, never data.
 */
export function foldCreases(parent: SVGElement, w: number, h: number, o: CreaseOpts): void {
  const r = rng(`${o.seed}:crease`);
  const g = sv('g');
  const line = (pts: Pt[], sub: string): void => {
    inkLine(g, resample(pts, 130), {
      seed: `${o.seed}:${sub}`,
      w: 1.05,
      color: 'var(--ink-faint)',
      opacity: 0.3 + r() * 0.1,
      amp: 2.6,
    });
  };
  line(
    [
      [w / 3, 6],
      [w / 3, h - 6],
    ],
    'v1',
  );
  line(
    [
      [(2 * w) / 3, 6],
      [(2 * w) / 3, h - 6],
    ],
    'v2',
  );
  line(
    [
      [6, h / 3],
      [w - 6, h / 3],
    ],
    'h1',
  );
  line(
    [
      [6, (2 * h) / 3],
      [w - 6, (2 * h) / 3],
    ],
    'h2',
  );
  parent.append(g);
}

export interface DistanceNoteOpts {
  readonly seed: string;
  /** hand tilt in degrees; seeded a few degrees off true when omitted */
  readonly angleDeg?: number;
  /** set the note vertically (for notes running along a north-south road) */
  readonly vertical?: boolean;
}

/**
 * A period distance note — 道法 (michinori) annotations at the road exits: a small
 * ink line like 村へ 半里 telling the traveller what lies off the sheet and how far.
 * Ink-soft, hand-tilted, seated on a faint brush flick so it belongs to the paper.
 */
export function distanceNote(
  parent: SVGElement,
  x: number,
  y: number,
  text: string,
  o: DistanceNoteOpts,
): void {
  const r = rng(`${o.seed}:note`);
  const angle = o.angleDeg ?? (r() < 0.5 ? -1 : 1) * (3 + r() * 4);
  const g = sv('g', { transform: `rotate(${angle.toFixed(1)} ${x} ${y})` });
  const size = 12.5;
  inkText(g, x, y, text, {
    size,
    color: 'var(--ink-soft)',
    ...(o.vertical !== undefined ? { vertical: o.vertical } : {}),
  });
  const span = [...text].length * size * (o.vertical ? 1.06 : 0.86);
  const flick: Pt[] = o.vertical
    ? [
        [x + size * 0.75, y - span / 2 + 3],
        [x + size * 0.75, y + span / 2 - 3],
      ]
    : [
        [x - span / 2 + 2, y + 4.5],
        [x + span / 2 - 2, y + 4.5],
      ];
  inkLine(g, flick, {
    seed: `${o.seed}:flick`,
    w: 0.8,
    color: 'var(--ink-faint)',
    opacity: 0.45,
    amp: 1.4,
  });
  parent.append(g);
}
