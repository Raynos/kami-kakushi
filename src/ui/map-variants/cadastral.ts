// REAL-map diverge take J · CADASTRAL KOKUDAKA MAP — see
// docs/plans/fable-2026-07-06-estate-real-map-options.md (direction #6).
// A kenchi-survey hybrid: the LEFT half is a genuine plan-view DRAWING of the
// estate (hand-jittered parcel outlines, terrace bunds, tree scribbles, brushed
// roads, a survey cartouche); the RIGHT half is the paired 検地帳 register —
// one numbered row per surveyed parcel carrying its purpose, labour marks,
// foes and people. Improvements (estateStage U1–U4, reopened house rooms)
// annotate the margin in red seal-script AND visibly amend the drawing.
// Built by a dedicated subagent; this module is the take's ONLY file.
import type { MapCtx } from './shared';
import type { GameState, Intent } from '../../core';
import { ACTIVITIES, ESTATE_STAGES, MOBS, PEOPLE } from '../../core';
import {
  fogFrontier,
  getNode,
  h,
  isNeighbour,
  revealedDepths,
  wireGated,
  wireTravel,
} from './shared';

// ── tiny SVG helper ──────────────────────────────────────────────────────────
const NS = 'http://www.w3.org/2000/svg';
function s<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs?: Record<string, string>,
  text?: string,
): SVGElementTagNameMap[K] {
  const e = document.createElementNS(NS, tag);
  if (attrs) for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (text !== undefined) e.textContent = text;
  return e;
}

// ── the hand-surveyed sheet: per-parcel geometry (viewBox 0 0 680 520) ───────
// Point lists carry baked-in jitter so the outlines read hand-inked, not boxed.
interface ParcelGeo {
  /** closed outline (polygon points, jittered) */
  readonly pts: readonly (readonly [number, number])[];
  /** kanji label anchor */
  readonly label: readonly [number, number];
  /** the small survey-seal square (parcel number) */
  readonly seal: readonly [number, number];
  /** you-are-here survey-flag anchor */
  readonly pin: readonly [number, number];
  /** centroid-ish anchor for the unsurveyed fog wash */
  readonly fog: readonly [number, number];
  /** purpose glyph for the register (田/林/山/門/蔵/場) */
  readonly purpose: string;
  /** ground wash fill */
  readonly fill: string;
}

const GEO: Record<string, ParcelGeo> = {
  'deep-satoyama': {
    // the ridge (bottom edge) is SHARED verbatim with near-satoyama's top edge
    // so the boundary inks as ONE hand line, not a doubled zigzag band.
    pts: [
      [18, 18],
      [662, 18],
      [662, 96],
      [590, 104],
      [510, 96],
      [420, 108],
      [330, 100],
      [240, 112],
      [150, 102],
      [80, 114],
      [18, 108],
    ],
    label: [72, 58],
    seal: [204, 32],
    pin: [330, 62],
    fog: [340, 62],
    purpose: '山',
    fill: 'var(--steel-0)',
  },
  'near-satoyama': {
    pts: [
      [18, 108],
      [80, 114],
      [150, 102],
      [240, 112],
      [330, 100],
      [420, 108],
      [510, 96],
      [590, 104],
      [662, 96],
      [662, 204],
      [600, 212],
      [530, 224],
      [470, 208],
      [400, 226],
      [330, 212],
      [255, 228],
      [185, 214],
      [120, 230],
      [60, 218],
      [18, 226],
    ],
    label: [548, 152],
    seal: [624, 130],
    pin: [340, 168],
    fog: [340, 165],
    purpose: '山',
    fill: 'var(--steel-1)',
  },
  'woodlot-edge': {
    pts: [
      [22, 240],
      [96, 234],
      [162, 240],
      [232, 246],
      [238, 300],
      [230, 350],
      [150, 356],
      [70, 350],
      [24, 342],
    ],
    label: [52, 268],
    seal: [212, 260],
    pin: [186, 300],
    fog: [128, 296],
    purpose: '林',
    fill: 'var(--steel-1)',
  },
  'home-paddies': {
    pts: [
      [432, 240],
      [520, 232],
      [590, 238],
      [660, 232],
      [658, 326],
      [570, 334],
      [498, 328],
      [436, 332],
    ],
    label: [452, 262],
    seal: [636, 252],
    pin: [560, 262],
    fog: [548, 282],
    purpose: '田',
    fill: 'rgba(216,185,120,0.07)',
  },
  'gate-forecourt': {
    pts: [
      [252, 306],
      [330, 300],
      [408, 304],
      [414, 372],
      [410, 430],
      [340, 438],
      [284, 434],
      [256, 430],
    ],
    label: [268, 330],
    seal: [388, 346],
    pin: [376, 400],
    fog: [332, 370],
    purpose: '門',
    fill: 'var(--steel-hi)',
  },
  kura: {
    pts: [
      [430, 356],
      [488, 350],
      [538, 354],
      [540, 440],
      [478, 446],
      [434, 442],
    ],
    label: [444, 374],
    seal: [446, 420],
    pin: [470, 433],
    fog: [485, 398],
    purpose: '蔵',
    fill: 'var(--steel-2)',
  },
  'drill-yard': {
    pts: [
      [62, 380],
      [148, 374],
      [228, 378],
      [232, 440],
      [228, 486],
      [140, 490],
      [70, 486],
      [64, 438],
    ],
    label: [80, 404],
    seal: [206, 396],
    pin: [180, 444],
    fog: [146, 432],
    purpose: '場',
    fill: 'var(--steel-2)',
  },
};

// Roads (brushed) between adjacent parcels — drawn full when both ends are
// surveyed, as a fading dashed stub when one end is still unsurveyed ground.
const ROADS: readonly { a: string; b: string; d: string; trail?: boolean }[] = [
  { a: 'gate-forecourt', b: 'kura', d: 'M406 394 C 416 392, 424 392, 434 394' },
  { a: 'gate-forecourt', b: 'drill-yard', d: 'M258 410 C 246 412, 240 414, 228 416' },
  { a: 'gate-forecourt', b: 'woodlot-edge', d: 'M264 318 C 252 310, 244 304, 234 296' },
  { a: 'gate-forecourt', b: 'home-paddies', d: 'M404 314 C 418 304, 428 296, 440 290' },
  { a: 'home-paddies', b: 'near-satoyama', d: 'M524 240 C 522 234, 520 228, 518 220' },
  { a: 'woodlot-edge', b: 'near-satoyama', d: 'M140 240 C 142 234, 144 230, 148 224' },
  {
    a: 'near-satoyama',
    b: 'deep-satoyama',
    d: 'M344 210 C 336 180, 352 150, 342 118',
    trail: true,
  },
];

// hand-placed marks: foes + people per node (survey annotations on the sheet)
const FOE_SPOTS: Record<string, readonly (readonly [number, number])[]> = {
  'gate-forecourt': [[288, 360]],
  'home-paddies': [
    [478, 302],
    [612, 300],
  ],
  'near-satoyama': [
    [434, 174],
    [236, 188],
  ],
  'deep-satoyama': [[248, 76]],
  'woodlot-edge': [[200, 330]],
  'drill-yard': [],
};
const PERSON_SPOTS: Record<string, readonly (readonly [number, number])[]> = {
  'gate-forecourt': [[286, 414]],
  'woodlot-edge': [[92, 336]],
};

// survey numbering: MAP_NODES order is stable; kanji numerals for the seals
const NUMERALS = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
const SURVEY_ORDER = [
  'kura',
  'gate-forecourt',
  'home-paddies',
  'woodlot-edge',
  'near-satoyama',
  'deep-satoyama',
  'drill-yard',
];
const numeralOf = (id: string): string => NUMERALS[SURVEY_ORDER.indexOf(id)] ?? '？';

const YIELD_KANJI: Record<string, string> = { rice: '米', coin: '銭', wood: '薪', sansai: '菜' };

// people standing on a node right now (place-gate + presence, per ADR-114)
function peopleOn(nodeId: string, state: GameState) {
  return PEOPLE.filter(
    (p) =>
      p.node === nodeId &&
      (p.placeGate === undefined || state.unlocked.includes(p.placeGate)) &&
      (p.presence === undefined || p.presence(state)),
  );
}
// grindable foes surveyed on a node (scripted story beats + later-tier threats stay off the sheet)
function foesOn(nodeId: string, state: GameState) {
  return MOBS.filter((m) => m.area === nodeId && !m.scripted && (m.minTier ?? 0) <= state.tier);
}

const HOUSE_ROOMS: readonly { flag: string; kanji: string; label: string }[] = [
  { flag: 'house-omoya', kanji: '母屋', label: 'the main house' },
  { flag: 'house-workshops', kanji: '作業場', label: 'the workshops' },
  { flag: 'house-granary', kanji: '穀蔵', label: 'the granary' },
  { flag: 'house-study', kanji: '書院', label: 'the study' },
];

// ── drawing details ──────────────────────────────────────────────────────────
function ptsToPath(pts: readonly (readonly [number, number])[]): string {
  return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x} ${y}`).join(' ') + ' Z';
}

/** double-inked hand outline: the main stroke + a slightly offset ghost pass */
function inkOutline(g: SVGGElement, d: string, stroke: string, w = 1.5): void {
  g.append(
    s('path', {
      d,
      fill: 'none',
      stroke,
      'stroke-width': String(w),
      'stroke-linejoin': 'round',
      class: 'cad-outline',
    }),
    s('path', {
      d,
      fill: 'none',
      stroke,
      'stroke-width': String(w * 0.6),
      'stroke-linejoin': 'round',
      opacity: '0.4',
      transform: 'translate(0.9,1.2)',
    }),
  );
}

function tree(g: SVGGElement, x: number, y: number, r = 5): void {
  // a two-tier pine, the period map-maker's shorthand: stacked boughs + a trunk
  g.append(
    s('path', {
      d:
        `M${x - r} ${y} Q${x} ${y - r * 0.9} ${x + r} ${y} ` +
        `M${x - r * 0.7} ${y - r * 0.8} Q${x} ${y - r * 1.7} ${x + r * 0.7} ${y - r * 0.8} ` +
        `M${x - r * 0.4} ${y - r * 1.5} Q${x} ${y - r * 2.2} ${x + r * 0.4} ${y - r * 1.5} ` +
        `M${x} ${y} L${x} ${y + r}`,
      fill: 'none',
      stroke: 'var(--ink-soft)',
      'stroke-width': '1.1',
      opacity: '0.85',
      'stroke-linecap': 'round',
    }),
  );
}
function tuft(g: SVGGElement, x: number, y: number): void {
  g.append(
    s('path', {
      d: `M${x} ${y} l2 -5 M${x + 3} ${y} l1 -4 M${x - 3} ${y} l-1 -4`,
      fill: 'none',
      stroke: 'var(--ink-faint)',
      'stroke-width': '1',
      'stroke-linecap': 'round',
    }),
  );
}

function svgLabel(g: SVGGElement, geo: ParcelGeo, node: { label: string; kanji?: string }): void {
  const [x, y] = geo.label;
  const short = node.label.replace(/\s*\(.*\)$/, ''); // the sheet carries the short name; the register the full one
  g.append(
    s(
      'text',
      { x: String(x), y: String(y), fill: 'var(--silver)', 'font-size': '20', lang: 'ja' },
      node.kanji ?? '',
    ),
    s(
      'text',
      { x: String(x), y: String(y + 13), fill: 'var(--ink-soft)', 'font-size': '9.5' },
      short,
    ),
  );
}

function surveySeal(g: SVGGElement, x: number, y: number, numeral: string): void {
  g.append(
    s('rect', {
      x: String(x),
      y: String(y),
      width: '15',
      height: '15',
      fill: 'none',
      stroke: 'var(--gold-dim)',
      'stroke-width': '1',
    }),
    s(
      'text',
      {
        x: String(x + 7.5),
        y: String(y + 11.5),
        fill: 'var(--gold)',
        'font-size': '10',
        'text-anchor': 'middle',
        lang: 'ja',
      },
      numeral,
    ),
  );
}

/** the vermillion survey flag — you are here */
function herePin(g: SVGGElement, x: number, y: number): void {
  const pin = s('g', { class: 'cad-here' });
  pin.append(
    s('circle', {
      cx: String(x),
      cy: String(y),
      r: '13',
      fill: 'rgba(191,59,37,0.10)',
      stroke: 'var(--shu)',
      'stroke-width': '1',
      opacity: '0.75',
      'stroke-dasharray': '2 3',
    }),
    s('ellipse', {
      cx: String(x),
      cy: String(y + 1),
      rx: '8',
      ry: '2.8',
      fill: 'none',
      stroke: 'var(--shu)',
      'stroke-width': '1.2',
    }),
    s('line', {
      x1: String(x),
      y1: String(y),
      x2: String(x),
      y2: String(y - 24),
      stroke: 'var(--shu-deep)',
      'stroke-width': '2',
    }),
    s('path', { d: `M${x} ${y - 24} L${x + 15} ${y - 19} L${x} ${y - 14} Z`, fill: 'var(--shu)' }),
  );
  pin.append(s('title', undefined, 'You stand here'));
  g.append(pin);
}

/** the 険 danger seal (ink-mark, never ⚠) */
function dangerSeal(g: SVGGElement, x: number, y: number, gated: boolean): void {
  g.append(
    s('rect', {
      x: String(x),
      y: String(y),
      width: '15',
      height: '15',
      fill: gated ? 'rgba(191,59,37,0.12)' : 'none',
      stroke: 'var(--shu-deep)',
      'stroke-width': '1',
    }),
    s(
      'text',
      {
        x: String(x + 7.5),
        y: String(y + 11.5),
        fill: 'var(--shu-hi)',
        'font-size': '10',
        'text-anchor': 'middle',
        lang: 'ja',
      },
      '険',
    ),
  );
}

/** a red seal-script margin stamp (改 / 開 / 新) */
function redSeal(kanji: string): HTMLElement {
  const seal = h('span');
  seal.textContent = kanji;
  seal.lang = 'ja';
  seal.style.cssText =
    'display:inline-flex;align-items:center;justify-content:center;width:1.15rem;height:1.15rem;' +
    'border:1px solid var(--shu);color:var(--shu-hi);font-size:.7rem;flex:none;' +
    'transform:rotate(-2deg);background:rgba(191,59,37,0.08);';
  return seal;
}

// per-parcel interior drawing (ground truth of the survey illustration)
function drawInterior(g: SVGGElement, id: string, state: GameState): void {
  const stage = state.estateStage;
  if (id === 'deep-satoyama') {
    for (const [x, y] of [
      [60, 50],
      [110, 74],
      [170, 44],
      [225, 82],
      [300, 46],
      [380, 72],
      [450, 44],
      [520, 74],
      [590, 50],
      [640, 74],
      [250, 60],
      [480, 88],
    ] as const)
      tree(g, x, y, 4.6);
    // the ridge stroke — the wild reads darker and denser
    g.append(
      s('path', {
        d: 'M40 92 Q 180 66 330 88 T 640 84',
        fill: 'none',
        stroke: 'var(--ink-faint)',
        'stroke-width': '1',
        opacity: '0.6',
      }),
    );
  }
  if (id === 'near-satoyama') {
    for (const [x, y] of [
      [60, 168],
      [130, 190],
      [200, 158],
      [300, 152],
      [420, 150],
      [500, 186],
      [620, 190],
      [270, 182],
      [560, 132],
    ] as const)
      tree(g, x, y, 3.8);
    for (const [x, y] of [
      [100, 208],
      [240, 198],
      [370, 196],
      [450, 200],
      [560, 206],
    ] as const)
      tuft(g, x, y);
  }
  if (id === 'woodlot-edge') {
    for (const [x, y] of [
      [40, 260],
      [78, 250],
      [120, 262],
      [166, 252],
    ] as const)
      tree(g, x, y, 3.8);
    // the stable footprint + its yard
    g.append(
      s('rect', {
        x: '44',
        y: '306',
        width: '46',
        height: '26',
        fill: 'none',
        stroke: 'var(--silver-dim)',
        'stroke-width': '1.1',
      }),
      s('line', {
        x1: '44',
        y1: '319',
        x2: '90',
        y2: '319',
        stroke: 'var(--silver-faint)',
        'stroke-width': '1',
      }),
      s('text', { x: '50', y: '324', 'font-size': '8', fill: 'var(--ink-soft)' }, 'stables'),
      // the road that leaves the valley westward
      s('path', {
        d: 'M42 332 C 34 330, 28 328, 20 326',
        fill: 'none',
        stroke: 'var(--silver-dim)',
        'stroke-width': '2',
        opacity: '0.6',
        'stroke-linecap': 'round',
      }),
    );
  }
  if (id === 'home-paddies') {
    // terraced strips stepping down the slope: bund lines + staggered dividers
    const bunds = [
      'M436 262 Q 540 254 656 258',
      'M438 288 Q 545 280 658 284',
      'M436 310 Q 548 304 658 306',
    ];
    for (const d of bunds)
      g.append(
        s('path', {
          d,
          fill: 'none',
          stroke: 'var(--gold-dim)',
          'stroke-width': '0.9',
          opacity: '0.8',
        }),
      );
    for (const d of [
      'M500 240 L498 262',
      'M572 258 L570 288',
      'M492 288 L494 310',
      'M600 284 L602 306',
      'M540 310 L538 330',
    ])
      g.append(
        s('path', {
          d,
          fill: 'none',
          stroke: 'var(--gold-dim)',
          'stroke-width': '0.8',
          opacity: '0.6',
        }),
      );
    // alternate strips carry a faint gold wash — rice land is value
    g.append(
      s('path', {
        d: 'M436 262 Q 540 254 656 258 L 658 284 Q 545 280 438 288 Z',
        fill: 'rgba(216,185,120,0.15)',
        stroke: 'none',
      }),
      s('path', {
        d: 'M436 310 Q 548 304 658 306 L 658 326 L 570 334 L 498 328 L 436 332 Z',
        fill: 'rgba(216,185,120,0.12)',
        stroke: 'none',
      }),
    );
  }
  if (id === 'gate-forecourt') {
    // the estate gate on the south edge: two posts + beam, facing the approach road
    g.append(
      s('path', {
        d: 'M322 434 L322 420 M342 434 L342 420 M316 421 L348 421',
        fill: 'none',
        stroke: 'var(--silver)',
        'stroke-width': '2',
        'stroke-linecap': 'round',
      }),
    );
    // swept-ground arcs (the forecourt is kept)
    for (const d of [
      'M280 380 Q 310 372 340 380',
      'M292 398 Q 322 390 352 398',
      'M306 362 Q 332 356 358 362',
    ])
      g.append(s('path', { d, fill: 'none', stroke: 'var(--silver-faint)', 'stroke-width': '1' }));
    if (stage >= 4) {
      // U4 — the long-house re-roofed (NE of the court, clear of the label),
      // the crest re-hung above a mended gate; the register's 改 row names it
      const lh = s('g');
      lh.append(
        s('rect', {
          x: '346',
          y: '310',
          width: '60',
          height: '19',
          fill: 'none',
          stroke: 'var(--gold)',
          'stroke-width': '1.1',
        }),
        s('line', {
          x1: '346',
          y1: '319.5',
          x2: '406',
          y2: '319.5',
          stroke: 'var(--gold-dim)',
          'stroke-width': '0.8',
        }),
        s('title', undefined, 'The long-house, re-roofed — the crest re-hung (U4)'),
      );
      g.append(lh);
      g.append(
        // the family crest above the gate — a small gold mon
        s('circle', {
          cx: '332',
          cy: '412',
          r: '4.5',
          fill: 'none',
          stroke: 'var(--gold)',
          'stroke-width': '1',
        }),
        s('path', { d: 'M332 409 L335 412 L332 415 L329 412 Z', fill: 'var(--gold)' }),
      );
    }
  }
  if (id === 'kura') {
    // the storehouse footprint, plan view: outer wall + roof ridge + door tick
    if (stage >= 1) {
      // U1 — mended: the outline closes, a red mending seal sits on the corner
      g.append(
        s('rect', {
          x: '454',
          y: '378',
          width: '62',
          height: '38',
          fill: 'none',
          stroke: 'var(--silver-dim)',
          'stroke-width': '1.2',
        }),
        s('line', {
          x1: '454',
          y1: '397',
          x2: '516',
          y2: '397',
          stroke: 'var(--silver-faint)',
          'stroke-width': '1',
        }),
        s('rect', {
          x: '512',
          y: '372',
          width: '12',
          height: '12',
          fill: 'rgba(191,59,37,0.10)',
          stroke: 'var(--shu)',
          'stroke-width': '0.9',
          transform: 'rotate(-4 518 378)',
        }),
        s(
          'text',
          {
            x: '518',
            y: '381.5',
            fill: 'var(--shu-hi)',
            'font-size': '8.5',
            'text-anchor': 'middle',
            lang: 'ja',
          },
          '改',
        ),
      );
    } else {
      // U0 — the cracked kura: a broken outline with a crack scrawl at the gap
      g.append(
        s('path', {
          d: 'M480 378 L454 378 L454 416 L516 416 L516 392',
          fill: 'none',
          stroke: 'var(--silver-dim)',
          'stroke-width': '1.2',
        }),
        s('path', {
          d: 'M516 388 l-3 -3 l4 -3 l-3 -3',
          fill: 'none',
          stroke: 'var(--ink-faint)',
          'stroke-width': '1',
        }),
        s('path', {
          d: 'M486 378 l3 4 l4 -3',
          fill: 'none',
          stroke: 'var(--ink-faint)',
          'stroke-width': '1',
        }),
        s('line', {
          x1: '454',
          y1: '397',
          x2: '516',
          y2: '397',
          stroke: 'var(--silver-faint)',
          'stroke-width': '1',
          'stroke-dasharray': '3 3',
        }),
      );
    }
    g.append(
      s('line', {
        x1: '482',
        y1: '416',
        x2: '492',
        y2: '416',
        stroke: 'var(--silver)',
        'stroke-width': '2.4',
      }),
    );
  }
  if (id === 'drill-yard') {
    if (stage >= 2) {
      // U2 — cleared and raked, a night-watch brazier set
      for (let i = 0; i < 6; i++) {
        const x = 84 + i * 22;
        g.append(
          s('line', {
            x1: String(x),
            y1: '416',
            x2: String(x + 10),
            y2: '452',
            stroke: 'var(--silver-faint)',
            'stroke-width': '1',
          }),
        );
      }
      g.append(
        s('circle', {
          cx: '206',
          cy: '462',
          r: '4',
          fill: 'none',
          stroke: 'var(--gold-dim)',
          'stroke-width': '1',
        }),
        s('path', {
          d: 'M206 458 q-2 -4 0 -6 q2 3 0 6',
          fill: 'none',
          stroke: 'var(--gold)',
          'stroke-width': '1',
        }),
        s(
          'text',
          { x: '176', y: '474', 'font-size': '7.5', fill: 'var(--ink-soft)' },
          'night-watch',
        ),
      );
    } else {
      // choked with scrub until the U2 clearing
      for (const [x, y] of [
        [96, 428],
        [130, 446],
        [168, 424],
        [200, 448],
        [110, 466],
        [176, 468],
        [146, 434],
      ] as const)
        tuft(g, x, y);
    }
  }
}

/** the fallow strip east of the kura → the U3 shinden (new paddy) amendment */
function drawFallowOrShinden(root: SVGGElement, state: GameState): void {
  const g = s('g');
  if (state.estateStage >= 3) {
    const d = 'M556 352 L648 348 L652 424 L560 428 Z';
    g.append(s('path', { d, fill: 'rgba(216,185,120,0.12)', stroke: 'none' }));
    inkOutline(g, d, 'var(--gold-dim)', 1.1);
    g.append(
      s('path', {
        d: 'M558 378 Q 604 374 650 376',
        fill: 'none',
        stroke: 'var(--gold-dim)',
        'stroke-width': '0.8',
        opacity: '0.8',
      }),
      s('path', {
        d: 'M560 402 Q 606 398 651 400',
        fill: 'none',
        stroke: 'var(--gold-dim)',
        'stroke-width': '0.8',
        opacity: '0.8',
      }),
      s(
        'text',
        {
          x: '580',
          y: '392',
          fill: 'var(--shu-hi)',
          'font-size': '12',
          lang: 'ja',
          transform: 'rotate(-2 580 392)',
        },
        '新田',
      ),
      s('title', undefined, 'The first shinden — new paddy broken from the fallow (U3)'),
    );
  } else {
    // fallow ground — scrub, unclaimed, waiting on the house's rise
    for (const [x, y] of [
      [576, 372],
      [612, 388],
      [590, 410],
      [634, 366],
      [566, 398],
      [628, 412],
    ] as const)
      tuft(g, x, y);
    g.append(
      s('text', { x: '584', y: '442', fill: 'var(--ink-faint)', 'font-size': '8' }, 'fallow'),
    );
  }
  root.append(g);
}

// ── the register (right half) ────────────────────────────────────────────────
function chip(text: string, borderColor: string, title?: string): HTMLElement {
  const c = h('span');
  c.textContent = text;
  c.style.cssText =
    `display:inline-block;padding:0 .3rem;border:1px solid ${borderColor};border-radius:2px;` +
    'font-size:.68rem;line-height:1.35;color:var(--ink);background:var(--steel-hi);white-space:nowrap;';
  if (title) c.title = title;
  return c;
}

function registerRow(
  nodeId: string,
  ctx: MapCtx,
  state: GameState,
  interactive: 'travel' | 'gated' | 'here' | 'inert',
): HTMLElement {
  const node = getNode(nodeId);
  const row = h('div');
  row.style.cssText =
    'display:flex;gap:.45rem;padding:.35rem .4rem;border-bottom:1px solid var(--silver-faint);align-items:flex-start;' +
    (interactive === 'here'
      ? 'background:var(--steel-hi);border-left:3px solid var(--shu);padding-left:.35rem;'
      : 'border-left:3px solid transparent;padding-left:.35rem;') +
    (interactive === 'gated' ? 'opacity:.62;' : '');
  // the survey-seal numeral — the pairing key back to the drawing
  const seal = h('span', undefined, numeralOf(nodeId));
  seal.lang = 'ja';
  seal.style.cssText =
    'flex:none;width:1.2rem;height:1.2rem;display:inline-flex;align-items:center;justify-content:center;' +
    'border:1px solid var(--gold-dim);color:var(--gold);font-size:.72rem;margin-top:.1rem;';
  row.append(seal);

  const body = h('div');
  body.style.cssText = 'display:flex;flex-direction:column;gap:.15rem;min-width:0;flex:1;';
  const head = h('div');
  head.style.cssText = 'display:flex;gap:.35rem;align-items:baseline;flex-wrap:wrap;';
  const kanji = h('span', undefined, node.kanji ?? '');
  kanji.lang = 'ja';
  kanji.style.cssText = 'color:var(--silver);font-size:.95rem;';
  const name = h('span', undefined, node.label);
  name.style.cssText = 'color:var(--ink);font-size:.78rem;';
  const purpose = h('span', undefined, GEO[nodeId]?.purpose ?? '');
  purpose.lang = 'ja';
  purpose.style.cssText =
    'border:1px solid var(--gold-dim);color:var(--gold-dim);font-size:.62rem;padding:0 .2rem;margin-left:auto;';
  head.append(kanji, name);
  if (interactive === 'here') {
    const here = h('span', undefined, '現在');
    here.lang = 'ja';
    here.style.cssText =
      'color:var(--shu-hi);font-size:.66rem;border:1px solid var(--shu-deep);padding:0 .2rem;';
    head.append(here);
  }
  if (node.dangerRing) {
    const dm = h('span', undefined, '険');
    dm.lang = 'ja';
    dm.style.cssText = 'color:var(--shu-hi);font-size:.7rem;';
    dm.title = interactive === 'gated' ? ctx.gateReason : 'Dangerous ground';
    head.append(dm);
  }
  if (interactive === 'travel') {
    const go = h('span', undefined, '→');
    go.style.cssText = 'color:var(--gold);font-size:.75rem;';
    go.title = 'Walk there';
    head.append(go);
  }
  head.append(purpose);
  body.append(head);

  // labour marks — what work this parcel carries, with its yield in gold numerals;
  // parcels that carry no field labour still get their survey annotation
  const NOTES: Record<string, string> = {
    kura: 'the house stores — rice and coin are banked here',
    'drill-yard': 'arms practice — the house keeps its hand',
  };
  const note = NOTES[nodeId];
  if (note) {
    const n = h('div', undefined, note);
    n.style.cssText = 'font-size:.7rem;color:var(--ink-soft);';
    body.append(n);
  }
  const acts = ACTIVITIES.filter((a) => a.area === nodeId);
  for (const a of acts) {
    const line = h('div');
    line.style.cssText =
      'display:flex;gap:.3rem;align-items:baseline;font-size:.7rem;color:var(--ink-soft);';
    const marks = Object.entries(a.yields)
      .filter(([, n]) => (n ?? 0) > 0)
      .map(([r, n]) => `${YIELD_KANJI[r] ?? r}+${n}`)
      .join(' ');
    const verb = h('span', undefined, a.label);
    verb.style.cssText = 'min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
    const y = h('span', undefined, marks);
    y.lang = 'ja';
    y.style.cssText = 'color:var(--gold);font-variant-numeric:tabular-nums;flex:none;';
    line.append(verb, y);
    body.append(line);
  }

  // foes + people — who and what holds this ground
  const foes = foesOn(nodeId, state);
  const folk = peopleOn(nodeId, state);
  if (foes.length > 0 || folk.length > 0) {
    const who = h('div');
    who.style.cssText = 'display:flex;gap:.25rem;flex-wrap:wrap;';
    for (const m of foes) who.append(chip(m.kanji + ' ' + m.label, 'var(--silver-faint)', m.blurb));
    for (const p of folk) {
      const pc = chip(p.name, `var(--v-${p.voice}, var(--silver-dim))`, p.tell ?? p.name);
      who.append(pc);
    }
    body.append(who);
  }
  row.append(body);

  if (interactive === 'travel') {
    wireTravel(row, nodeId, ctx);
    row.addEventListener('mouseenter', () => (row.style.background = 'var(--steel-hi)'));
    row.addEventListener('mouseleave', () => (row.style.background = ''));
  } else if (interactive === 'gated') {
    wireGated(row, nodeId, ctx);
  }
  return row;
}

// ── the take ─────────────────────────────────────────────────────────────────
export function renderMapCadastral(
  container: HTMLElement,
  ctx: MapCtx,
  state: GameState,
  dispatch: (intent: Intent) => void,
): void {
  void dispatch; // travel goes through ctx.move (the real move_to)
  container.textContent = '';

  const depths = revealedDepths(ctx.revealed);
  const fog = fogFrontier(ctx.revealed);
  const modeOf = (id: string): 'travel' | 'gated' | 'here' | 'inert' => {
    if (id === ctx.here) return 'here';
    if (!isNeighbour(ctx, id)) return 'inert';
    return getNode(id).dangerRing && !ctx.condOk ? 'gated' : 'travel';
  };

  // the sheet is the hero (full width); the paired register runs beneath it —
  // half map, half ledger, joined by the numbered survey seals.
  const wrap = h('div', 'cad-wrap');
  wrap.style.cssText = 'display:flex;gap:.6rem;flex-direction:column;';

  // ── the drawn sheet ──
  const sheetBox = h('div');
  sheetBox.style.cssText =
    'border:1px solid var(--key);background:var(--steel-1);position:relative;';
  const svg = s('svg', { viewBox: '0 0 680 520', width: '100%', role: 'img' });
  svg.style.cssText = 'display:block;font-family:var(--font-body);';
  sheetBox.append(svg);

  const defs = s('defs');
  const blur = s('filter', {
    id: 'cad-fogblur',
    x: '-60%',
    y: '-60%',
    width: '220%',
    height: '220%',
  });
  blur.append(s('feGaussianBlur', { stdDeviation: '9' }));
  defs.append(blur);
  svg.append(defs);

  // the sheet ground + the double survey frame + the faint cadastral grid
  svg.append(s('rect', { x: '0', y: '0', width: '680', height: '520', fill: 'var(--steel-1)' }));
  const grid = s('g');
  for (let x = 70; x < 680; x += 54)
    grid.append(
      s('line', {
        x1: String(x),
        y1: '16',
        x2: String(x),
        y2: '504',
        stroke: 'var(--silver)',
        opacity: '0.045',
        'stroke-width': '1',
      }),
    );
  for (let y = 70; y < 520; y += 54)
    grid.append(
      s('line', {
        x1: '16',
        y1: String(y),
        x2: '664',
        y2: String(y),
        stroke: 'var(--silver)',
        opacity: '0.045',
        'stroke-width': '1',
      }),
    );
  svg.append(grid);
  svg.append(
    s('rect', {
      x: '10',
      y: '10',
      width: '660',
      height: '500',
      fill: 'none',
      stroke: 'var(--key)',
      'stroke-width': '1.4',
    }),
    s('rect', {
      x: '15',
      y: '15',
      width: '650',
      height: '490',
      fill: 'none',
      stroke: 'var(--silver-faint)',
      'stroke-width': '0.8',
    }),
  );

  // surveyed parcels
  for (const id of SURVEY_ORDER) {
    if (!depths.has(id)) continue;
    const geo = GEO[id];
    if (!geo) continue;
    const node = getNode(id);
    const mode = modeOf(id);
    const g = s('g', { class: 'cad-parcel' + (mode === 'travel' ? ' cad-go' : '') });
    const d = ptsToPath(geo.pts);
    g.append(s('path', { d, fill: geo.fill, stroke: 'none' }));
    drawInterior(g, id, state);
    inkOutline(g, d, 'var(--silver-dim)', 1.5);
    if (mode === 'travel') {
      // a quiet gold survey-line just inside a walkable border — the "you may step here" cue
      g.append(
        s('path', {
          d,
          fill: 'none',
          stroke: 'var(--gold-dim)',
          'stroke-width': '1',
          'stroke-dasharray': '7 5',
          opacity: '0.8',
          transform: 'translate(0,0) scale(1)',
        }),
      );
    }
    if (mode === 'gated') {
      // a live but barred step: a red inner survey line — do not pass yet
      g.append(
        s('path', {
          d,
          fill: 'none',
          stroke: 'var(--shu-deep)',
          'stroke-width': '1.2',
          'stroke-dasharray': '5 4',
          opacity: '0.9',
        }),
      );
    }
    svgLabel(g, geo, node);
    surveySeal(g, geo.seal[0], geo.seal[1], numeralOf(id));
    if (node.dangerRing) dangerSeal(g, geo.seal[0], geo.seal[1] + 18, mode === 'gated');
    // foe marks — the surveyor's hazard notes
    const foes = foesOn(id, state);
    FOE_SPOTS[id]?.forEach(([fx, fy], i) => {
      const m = foes[i];
      if (!m) return;
      const fg = s('g');
      fg.append(
        s('circle', {
          cx: String(fx),
          cy: String(fy - 4.5),
          r: '11',
          fill: 'var(--steel-1)',
          'fill-opacity': '0.5',
          stroke: 'var(--silver-faint)',
          'stroke-width': '1',
        }),
        s(
          'text',
          {
            x: String(fx),
            y: String(fy),
            fill: 'var(--ink)',
            'font-size': m.kanji.length > 1 ? '9.5' : '13',
            'text-anchor': 'middle',
            lang: 'ja',
          },
          m.kanji,
        ),
      );
      fg.append(s('title', undefined, `${m.label} — ${m.blurb}`));
      g.append(fg);
    });
    // people pinned as name-chips on their parcel
    const folk = peopleOn(id, state);
    PERSON_SPOTS[id]?.forEach(([px, py], i) => {
      const p = folk[i];
      if (!p) return;
      const w = p.name.length * 6 + 12;
      const pg = s('g');
      pg.append(
        s('rect', {
          x: String(px),
          y: String(py),
          width: String(w),
          height: '15',
          rx: '3',
          fill: 'var(--steel-hi)',
          stroke: `var(--v-${p.voice}, var(--silver-dim))`,
          'stroke-width': '1',
        }),
        s('circle', {
          cx: String(px + 8),
          cy: String(py + 7.5),
          r: '2.2',
          fill: `var(--v-${p.voice}, var(--silver-dim))`,
        }),
        s(
          'text',
          { x: String(px + 14), y: String(py + 11), fill: 'var(--ink)', 'font-size': '9' },
          p.name,
        ),
      );
      pg.append(s('title', undefined, p.tell ?? p.name));
      g.append(pg);
    });
    if (id === ctx.here) herePin(g, geo.pin[0], geo.pin[1]);
    if (mode === 'travel') wireTravel(g as unknown as HTMLElement, id, ctx);
    else if (mode === 'gated') {
      wireGated(g as unknown as HTMLElement, id, ctx);
      // wireGated sets .title, which is inert on an SVG element — a real <title>
      // child carries the gate reason as the native tooltip on the sheet.
      g.append(s('title', undefined, ctx.gateReason));
    }
    svg.append(g);
  }

  // the fallow / shinden strip lives on the sheet once its ground (the kura's
  // east margin) is surveyed — it amends at U3
  if (depths.has('kura')) {
    const amend = s('g');
    drawFallowOrShinden(amend, state);
    svg.append(amend);
  }

  // roads — full ink when both ends surveyed; a fading stub toward fog
  for (const r of ROADS) {
    const aIn = depths.has(r.a);
    const bIn = depths.has(r.b);
    if (!aIn && !bIn) continue;
    if (aIn && bIn) {
      svg.append(
        s('path', {
          d: r.d,
          fill: 'none',
          stroke: 'var(--silver-faint)',
          'stroke-width': r.trail ? '5' : '8',
          'stroke-linecap': 'round',
        }),
        s('path', {
          d: r.d,
          fill: 'none',
          stroke: 'var(--silver)',
          opacity: '0.7',
          'stroke-width': r.trail ? '1.6' : '2.4',
          'stroke-linecap': 'round',
          ...(r.trail ? { 'stroke-dasharray': '5 4' } : {}),
        }),
      );
    } else {
      svg.append(
        s('path', {
          d: r.d,
          fill: 'none',
          stroke: 'var(--silver-dim)',
          'stroke-width': '1.4',
          'stroke-dasharray': '3 5',
          opacity: '0.4',
          'stroke-linecap': 'round',
        }),
      );
    }
  }
  // the approach road south of the gate (always, once the forecourt is surveyed)
  if (depths.has('gate-forecourt'))
    svg.append(
      s('path', {
        d: 'M332 504 C 330 482, 334 458, 332 436',
        fill: 'none',
        stroke: 'var(--silver-faint)',
        'stroke-width': '6',
        'stroke-linecap': 'round',
      }),
      s('path', {
        d: 'M332 504 C 330 482, 334 458, 332 436',
        fill: 'none',
        stroke: 'var(--silver-dim)',
        'stroke-width': '2',
        'stroke-linecap': 'round',
      }),
    );

  // fog-of-war — unsurveyed ground reads as blank margin under a 未検 mark
  for (const [fogId] of fog) {
    const geo = GEO[fogId];
    if (!geo) continue;
    const [fx, fy] = geo.fog;
    const fgrp = s('g', { class: 'cad-fog' });
    fgrp.append(
      s('ellipse', {
        cx: String(fx),
        cy: String(fy),
        rx: '62',
        ry: '40',
        fill: 'var(--void)',
        opacity: '0.85',
        filter: 'url(#cad-fogblur)',
      }),
      s('ellipse', {
        cx: String(fx),
        cy: String(fy),
        rx: '48',
        ry: '30',
        fill: 'none',
        stroke: 'var(--silver-faint)',
        'stroke-width': '1',
        'stroke-dasharray': '2 5',
      }),
      s(
        'text',
        {
          x: String(fx),
          y: String(fy + 2),
          fill: 'var(--ink-soft)',
          'font-size': '13',
          'text-anchor': 'middle',
          lang: 'ja',
        },
        '未検',
      ),
      s(
        'text',
        {
          x: String(fx),
          y: String(fy + 15),
          fill: 'var(--ink-faint)',
          'font-size': '7.5',
          'text-anchor': 'middle',
        },
        'unsurveyed',
      ),
    );
    svg.append(fgrp);
  }

  // survey furniture: the cartouche, the north mark, the scale bar
  const cart = s('g');
  cart.append(
    s('rect', {
      x: '26',
      y: '400',
      width: '30',
      height: '100',
      fill: 'var(--steel-2)',
      stroke: 'var(--gold-dim)',
      'stroke-width': '1.2',
    }),
    s('rect', {
      x: '29',
      y: '403',
      width: '24',
      height: '94',
      fill: 'none',
      stroke: 'var(--silver-faint)',
      'stroke-width': '0.7',
    }),
    s(
      'text',
      {
        x: '41',
        y: '409',
        fill: 'var(--silver)',
        'font-size': '12.5',
        'text-anchor': 'start',
        lang: 'ja',
        style: 'writing-mode:vertical-rl;text-orientation:upright;letter-spacing:1px;',
      },
      '黒澤領検地図',
    ),
  );
  svg.append(cart);
  svg.append(
    s(
      'text',
      {
        x: '636',
        y: '484',
        fill: 'var(--silver-dim)',
        'font-size': '14',
        'text-anchor': 'middle',
        lang: 'ja',
      },
      '北',
    ),
    s('path', {
      d: 'M636 494 L636 466 M631 473 L636 466 L641 473',
      fill: 'none',
      stroke: 'var(--silver-dim)',
      'stroke-width': '1.2',
    }),
    s('line', {
      x1: '470',
      y1: '492',
      x2: '560',
      y2: '492',
      stroke: 'var(--silver-dim)',
      'stroke-width': '1.2',
    }),
    s('line', {
      x1: '470',
      y1: '487',
      x2: '470',
      y2: '497',
      stroke: 'var(--silver-dim)',
      'stroke-width': '1.2',
    }),
    s('line', {
      x1: '560',
      y1: '487',
      x2: '560',
      y2: '497',
      stroke: 'var(--silver-dim)',
      'stroke-width': '1.2',
    }),
    s(
      'text',
      {
        x: '515',
        y: '487',
        fill: 'var(--ink-soft)',
        'font-size': '9',
        'text-anchor': 'middle',
        lang: 'ja',
      },
      '一町',
    ),
  );

  // hover affordance for walkable parcels (scoped style — this module's DOM only)
  const style = h('style');
  style.textContent =
    '.cad-go:hover .cad-outline{stroke:var(--gold);}' +
    '.cad-go:hover path[fill]:first-child{filter:brightness(1.15);}' +
    '.cad-parcel[data-locked]{cursor:not-allowed;}';
  wrap.append(style);
  wrap.append(sheetBox);

  // ── the register (検地帳) ──
  const reg = h('div');
  reg.style.cssText =
    'border:1px solid var(--key);background:var(--steel-1);display:flex;flex-direction:column;';
  const regHead = h('div');
  regHead.style.cssText =
    'display:flex;align-items:baseline;gap:.4rem;padding:.4rem .5rem;border-bottom:1px solid var(--key-dim);';
  const regKanji = h('span', undefined, '検地帳');
  regKanji.lang = 'ja';
  regKanji.style.cssText = 'color:var(--silver);font-size:.95rem;';
  const regLabel = h('span', undefined, 'LAND REGISTER');
  regLabel.style.cssText =
    'font-family:var(--font-num);font-size:.6rem;letter-spacing:.14em;color:var(--silver-dim);';
  regHead.append(regKanji, regLabel);
  reg.append(regHead);

  // one numbered row per surveyed parcel, in survey order — two ledger columns
  const rows = h('div');
  rows.style.cssText =
    'display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));column-gap:.6rem;';
  for (const id of SURVEY_ORDER) {
    if (!depths.has(id)) continue;
    rows.append(registerRow(id, ctx, state, modeOf(id)));
  }
  // unsurveyed frontier rows — blank entries, never named (reveal-as-plot)
  for (const [fogId] of fog) {
    void fogId;
    const row = h('div');
    row.style.cssText =
      'display:flex;gap:.45rem;padding:.35rem .4rem .35rem .35rem;border-bottom:1px solid var(--silver-faint);' +
      'border-left:3px solid transparent;align-items:center;opacity:.65;';
    const seal = h('span', undefined, '？');
    seal.style.cssText =
      'flex:none;width:1.2rem;height:1.2rem;display:inline-flex;align-items:center;justify-content:center;' +
      'border:1px dashed var(--silver-faint);color:var(--ink-faint);font-size:.72rem;';
    const t = h('span');
    const tk = h('span', undefined, '未検');
    tk.lang = 'ja';
    tk.style.cssText = 'color:var(--ink-soft);font-size:.8rem;margin-right:.35rem;';
    const te = h('span', undefined, 'ground not yet surveyed');
    te.style.cssText = 'color:var(--ink-soft);font-size:.72rem;font-style:italic;';
    t.append(tk, te);
    row.append(seal, t);
    rows.append(row);
  }
  reg.append(rows);

  // the house rooms — register entries with re-opened seals (屋敷)
  const rooms = HOUSE_ROOMS.filter((r) => state.unlocked.includes(r.flag));
  if (rooms.length > 0) {
    const secHead = h('div');
    secHead.style.cssText =
      'display:flex;gap:.4rem;align-items:baseline;padding:.4rem .5rem .2rem;color:var(--silver-dim);';
    const sk = h('span', undefined, '屋敷');
    sk.lang = 'ja';
    sk.style.cssText = 'color:var(--silver);font-size:.85rem;';
    const sl = h('span', undefined, 'THE HOUSE');
    sl.style.cssText = 'font-family:var(--font-num);font-size:.58rem;letter-spacing:.14em;';
    secHead.append(sk, sl);
    reg.append(secHead);
    for (const r of rooms) {
      const row = h('div');
      row.style.cssText =
        'display:flex;gap:.45rem;padding:.25rem .5rem;align-items:center;font-size:.74rem;color:var(--ink-soft);';
      const rk = h('span', undefined, r.kanji);
      rk.lang = 'ja';
      rk.style.cssText = 'color:var(--ink);font-size:.85rem;min-width:3.2em;';
      row.append(redSeal('開'), rk, h('span', undefined, r.label + ' — reopened'));
      reg.append(row);
    }
  }

  // the amendments margin — estate improvements in red seal-script (改)
  if (state.estateStage > 0) {
    const secHead = h('div');
    secHead.style.cssText =
      'display:flex;gap:.4rem;align-items:baseline;padding:.4rem .5rem .2rem;border-top:1px solid var(--key-dim);margin-top:.2rem;';
    const sk = h('span', undefined, '改');
    sk.lang = 'ja';
    sk.style.cssText = 'color:var(--shu-hi);font-size:.85rem;';
    const sl = h('span', undefined, 'AMENDMENTS');
    sl.style.cssText =
      'font-family:var(--font-num);font-size:.58rem;letter-spacing:.14em;color:var(--silver-dim);';
    secHead.append(sk, sl);
    reg.append(secHead);
    for (const st of ESTATE_STAGES) {
      if (state.estateStage < st.stage) break;
      const row = h('div');
      row.style.cssText =
        'display:flex;gap:.45rem;padding:.25rem .5rem;align-items:center;font-size:.74rem;color:var(--ink-soft);';
      const nm = h('span', undefined, st.label);
      nm.style.cssText = 'color:var(--ink);';
      nm.title = st.blurb;
      row.append(redSeal(NUMERALS[st.stage - 1] ?? '改'), nm);
      reg.append(row);
    }
  }

  const foot = h('div');
  foot.style.cssText =
    'padding:.3rem .5rem;font-size:.62rem;color:var(--ink-faint);margin-top:auto;';
  foot.textContent = 'Click a bordering parcel (or its row) to walk there.';
  reg.append(foot);

  wrap.append(reg);
  container.append(wrap);
}
