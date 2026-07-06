// REAL-map diverge take L · KAMON MEDALLION MAP (direction #9 of
// docs/plans/fable-2026-07-06-estate-real-map-options.md).
//
// Each area of the estate is a circular ENGRAVED MEDALLION — a struck steel die
// carrying a real miniature line-engraved scene (terraced paddies, the woodlot
// trees, the kura storehouse) — connected by DAMASCENED road inlays (gold line
// inlay hammered into steel). Medallions gain embellishment rings as the estate
// improves (U0 bare rim → chased ring → gold inlay → beading → crest studs);
// reopened house rooms engrave more of the main house into the forecourt die.
// Fog-of-war ground renders as BLANK unstruck plate discs — a die not yet cut.
//
// Bimetal discipline (ui-design.md §1–2): SILVER = state/labels/scene linework,
// GOLD = value/keylines/inlay (the roads, the embellishment rings, one bright-cut
// accent per scene), VERMILLION spent ONLY on you-are-here + genuine danger.
import type { GameState, Intent } from '../../core';
import { ACTIVITIES, MOBS, PEOPLE } from '../../core';
import type { MapCtx } from './shared';
import { fogFrontier, MAP_NODES, revealedDepths, wireGated, wireTravel } from './shared';

const NS = 'http://www.w3.org/2000/svg';

// ── palette roles (tokens from styles.css :root) ─────────────────────────────
const LINE = 'var(--silver)'; // scene linework — a bright burin cut catching light
const BRIGHT = 'var(--silver-hi)'; // the brightest cuts (catchlights on the work)
const FINE = 'var(--silver-dim)'; // hatch / shading — the shallower cuts
const GOLD = 'var(--gold-dim)'; // inlay base
const GOLD_HI = 'var(--gold)'; // inlay glint / value accent
const SHU = 'var(--shu)'; // you-are-here / danger ONLY

// ── fixed hand-placed layout — reads as the valley: satoyama outward (top),
//    the home ground (kura / forecourt / yards) low and central. ──────────────
const R = 72; // struck medallion radius
const FOG_R = 52; // blank (unstruck) disc radius
const POS: Record<string, { x: number; y: number }> = {
  'deep-satoyama': { x: 500, y: 96 },
  'near-satoyama': { x: 500, y: 302 },
  'home-paddies': { x: 225, y: 425 },
  'woodlot-edge': { x: 775, y: 425 },
  'gate-forecourt': { x: 500, y: 560 },
  kura: { x: 300, y: 700 },
  'drill-yard': { x: 700, y: 700 },
};
const VIEW_W = 1000;
const VIEW_H = 852;

// The estate proper — the dies that gain embellishment rings as U-stages land.
// (The satoyama is wild ground; the wild is never embellished.)
const ESTATE_NODES = new Set([
  'kura',
  'gate-forecourt',
  'home-paddies',
  'woodlot-edge',
  'drill-yard',
]);

// Labour skill → the engraved pip glyph.
const SKILL_GLYPH: Record<string, string> = {
  farming: '農',
  conditioning: '荷',
  woodcutting: '樵',
  foraging: '採',
};

// ── tiny SVG builders ────────────────────────────────────────────────────────
function sv<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs?: Record<string, string>,
): SVGElementTagNameMap[K] {
  const e = document.createElementNS(NS, tag);
  if (attrs) for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  return e;
}

interface Stroke {
  s?: string; // stroke colour
  w?: number; // width
  o?: number; // opacity
  f?: string; // fill
  dash?: string;
  cap?: string;
}

function pth(d: string, st: Stroke = {}): SVGPathElement {
  const p = sv('path', {
    d,
    fill: st.f ?? 'none',
    stroke: st.s ?? LINE,
    'stroke-width': String(st.w ?? 1.2),
    opacity: String(st.o ?? 1),
    'stroke-linecap': st.cap ?? 'round',
    'stroke-linejoin': 'round',
  });
  if (st.dash) p.setAttribute('stroke-dasharray', st.dash);
  return p;
}

function circ(cx: number, cy: number, r: number, st: Stroke = {}): SVGCircleElement {
  const c = sv('circle', {
    cx: String(cx),
    cy: String(cy),
    r: String(r),
    fill: st.f ?? 'none',
    stroke: st.s ?? 'none',
    'stroke-width': String(st.w ?? 1),
    opacity: String(st.o ?? 1),
  });
  if (st.dash) c.setAttribute('stroke-dasharray', st.dash);
  return c;
}

function txt(
  x: number,
  y: number,
  content: string,
  size: number,
  fill: string,
  extra?: Record<string, string>,
): SVGTextElement {
  const t = sv('text', {
    x: String(x),
    y: String(y),
    'text-anchor': 'middle',
    'font-size': String(size),
    fill,
    'font-family': 'var(--font-body, Georgia, serif)',
    ...extra,
  });
  t.textContent = content;
  return t;
}

/** Parallel hatch strokes clipped by the caller — the burin shading field. */
function hatchLines(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  step: number,
  angleLen: number,
  st: Stroke,
): SVGGElement {
  const g = sv('g');
  for (let x = x0; x <= x1; x += step) {
    g.append(pth(`M${x} ${y0} l${angleLen} ${y1 - y0}`, st));
  }
  return g;
}

// ── the engraved miniature scenes (local coords, disc centre = 0,0) ──────────

/** 蔵 — the storehouse: stone plinth, namako-kabe cross-plaster walls, heavy
 *  tiled gable roof, the high barred window, the door you woke behind. */
function sceneKura(): SVGGElement {
  const g = sv('g');
  // stone plinth + joint ticks
  g.append(pth('M-40 34 H40', { w: 1.2 }));
  g.append(pth('M-37 27 H37', { w: 1 }));
  for (const x of [-28, -14, 0, 14, 28]) g.append(pth(`M${x} 27 V34`, { s: FINE, o: 0.8 }));
  // walls
  g.append(pth('M-31 -6 V27 M31 -6 V27', { w: 1.2 }));
  g.append(pth('M-31 8 H31', { s: FINE, o: 0.7 }));
  // namako lattice (the sea-cucumber cross plaster) on the lower wall band
  for (let i = -3; i <= 2; i++) {
    g.append(pth(`M${i * 10 - 1} 27 L${i * 10 + 9} 9`, { s: FINE, o: 0.65 }));
    g.append(pth(`M${i * 10 + 9} 27 L${i * 10 - 1} 9`, { s: FINE, o: 0.65 }));
  }
  // heavy gable roof + under-eave + slope hatch (tile courses)
  g.append(pth('M-42 -5 L0 -33 L42 -5', { w: 1.6 }));
  g.append(pth('M-35 -6 L0 -28 L35 -6', { w: 0.9, o: 0.9 }));
  // tile hatching parallel to each slope
  for (let i = 1; i <= 5; i++) {
    const off = i * 4.6;
    g.append(pth(`M${-40 + off} -6 L${-2} ${-31 + off * 0.16}`, { s: FINE, o: 0.55 }));
    g.append(pth(`M${40 - off} -6 L${2} ${-31 + off * 0.16}`, { s: FINE, o: 0.55 }));
  }
  // ridge cap — the one bright-cut gold inlay of this die
  g.append(pth('M-7 -33 H7', { s: GOLD_HI, w: 2, o: 0.9 }));
  // door (double leaf) + gold pivot studs
  g.append(pth('M-9 6 V27 H9 V6 Z M0 6 V27', { w: 1.1 }));
  g.append(circ(-5, 16, 1.1, { f: GOLD, o: 0.9 }));
  g.append(circ(5, 16, 1.1, { f: GOLD, o: 0.9 }));
  // high barred window
  g.append(pth('M15 -1 H25 V6 H15 Z', { w: 0.9 }));
  g.append(pth('M18.3 -1 V6 M21.6 -1 V6', { s: FINE, o: 0.9 }));
  // swept ground
  g.append(pth('M-52 40 Q-20 37 10 40', { s: FINE, o: 0.6 }));
  g.append(pth('M14 42 Q34 39 50 42', { s: FINE, o: 0.5 }));
  return g;
}

/** 門前 — the gate & forecourt, the main house rising behind it as rooms
 *  reopen: omoya roof (solid once reopened; a ruin-dashed silhouette before),
 *  workshops wing with smoke, granary annex, the study's lit lattice window. */
function sceneGate(unlocked: readonly string[]): SVGGElement {
  const g = sv('g');
  const has = (id: string): boolean => unlocked.includes(id);
  // ── the main house behind (upper field) ──
  if (has('house-omoya')) {
    // the omoya stands: solid hipped roof + ridge + eave + wall posts
    g.append(pth('M-50 -14 L-12 -40 L28 -16', { w: 1.4 }));
    g.append(pth('M-44 -14 L-12 -35 L23 -15', { w: 0.8, o: 0.85 }));
    g.append(pth('M-46 -14 H26', { w: 0.9 }));
    g.append(pth('M-40 -14 V-6 M-12 -14 V-6 M18 -14 V-7', { s: FINE, o: 0.8 }));
    for (let i = 1; i <= 3; i++) {
      g.append(pth(`M${-46 + i * 8} -15 L${-14 - i * 2} ${-38 + i * 1.2}`, { s: FINE, o: 0.5 }));
    }
    g.append(pth('M-16 -42 H-8', { s: GOLD, w: 1.4, o: 0.85 })); // ridge inlay
  } else {
    // the house is a ruin — a faint dashed silhouette only
    g.append(pth('M-50 -14 L-12 -40 L28 -16', { s: FINE, o: 0.7, dash: '3 4' }));
  }
  if (has('house-workshops')) {
    // west wing + a smoke curl off the forge-room
    g.append(pth('M-60 -8 L-46 -20 L-32 -8', { w: 1.1 }));
    g.append(pth('M-58 -8 H-34', { w: 0.8 }));
    g.append(pth('M-46 -24 q-3 -4 0 -8 q3 -4 0 -8', { s: FINE, o: 0.8 }));
  }
  if (has('house-granary')) {
    // east annex — the rebuilt granary
    g.append(pth('M30 -10 L42 -21 L54 -10', { w: 1.1 }));
    g.append(pth('M32 -10 H52 M42 -10 V-4 M38 -4 H46', { w: 0.8, o: 0.9 }));
  }
  if (has('house-study')) {
    // the study's lattice window in the wall band, lamp-lit — a gold-inlaid pane
    g.append(pth('M-38 -13 H-28 V-7 H-38 Z', { s: GOLD, w: 0.9 }));
    g.append(pth('M-34.7 -13 V-7 M-31.4 -13 V-7 M-38 -10 H-28', { s: GOLD, w: 0.6, o: 0.8 }));
    g.append(circ(-33, -10, 4.5, { f: GOLD_HI, o: 0.16 }));
  }
  // ── the gate itself (front, lower field) ──
  g.append(pth('M-17 30 V-4 M17 30 V-4', { w: 1.8 })); // posts
  g.append(pth('M-25 -4 H25', { w: 1.4 })); // lintel
  g.append(pth('M-21 2 H21', { w: 0.9 })); // secondary beam
  g.append(pth('M-28 -6 L-23 -12 H23 L28 -6 Z', { w: 1.1 })); // tiled cap
  for (const x of [-14, -5, 4, 13]) g.append(pth(`M${x} -12 V-6`, { s: FINE, o: 0.7 }));
  g.append(pth('M-23 -12 H23', { s: GOLD, w: 1.2, o: 0.8 })); // cap ridge inlay
  // door leaves, half open
  g.append(pth('M-15 30 V0 M-15 8 H-3 M-3 8 V30', { s: FINE, o: 0.8 }));
  // ── the swept forecourt: broom-sweep arcs ──
  g.append(pth('M-46 38 Q-16 32 14 38', { s: FINE, o: 0.6 }));
  g.append(pth('M-30 44 Q0 38 30 44', { s: FINE, o: 0.55 }));
  g.append(pth('M6 34 Q30 30 48 35', { s: FINE, o: 0.5 }));
  return g;
}

/** 田圃 — terraced paddies stepping down the slope: bund lines, gold water
 *  gleam in each terrace, seedling tick-rows, the bund path descending. */
function scenePaddies(): SVGGElement {
  const g = sv('g');
  // four terraces, each a bund curve; water hatch + seedling rows inside
  const terraces = [
    'M-56 -22 Q-10 -32 52 -18',
    'M-58 -6 Q-8 -16 56 -2',
    'M-58 12 Q-6 2 56 14',
    'M-54 30 Q-4 20 52 32',
  ];
  for (const t of terraces) g.append(pth(t, { w: 1.7 }));
  // water gleam — short gold strokes riding each terrace (the value accent)
  const gleams: Array<[number, number]> = [
    [-40, -25],
    [-14, -28],
    [16, -26],
    [38, -23],
    [-44, -9],
    [-12, -12],
    [20, -10],
    [44, -6],
    [-42, 9],
    [-10, 6],
    [22, 8],
    [42, 11],
    [-36, 27],
    [-4, 24],
    [28, 27],
  ];
  for (const [x, y] of gleams) g.append(pth(`M${x} ${y} h7`, { s: GOLD_HI, w: 1.4, o: 0.75 }));
  // seedling ticks — paired small 'v' strokes in rows
  const rows: Array<[number, number]> = [
    [-30, -26],
    [2, -28],
    [30, -24],
    [-32, -10],
    [4, -13],
    [32, -8],
    [-28, 7],
    [6, 5],
    [34, 9],
    [-22, 25],
    [12, 23],
  ];
  for (const [x, y] of rows) {
    for (let i = 0; i < 3; i++) {
      g.append(pth(`M${x + i * 6} ${y} l1.6 -3 l1.6 3`, { s: FINE, o: 0.9, w: 1 }));
    }
  }
  // the bund path stepping down (right side)
  g.append(pth('M40 -30 L48 -16 L42 0 L50 16 L44 32', { s: BRIGHT, o: 0.55, w: 1, dash: '4 3' }));
  return g;
}

/** 杣 — the stable yard giving onto the woodlot: stable roof + stalls left,
 *  broadleaf stand right, the road leaving the valley off the die's edge. */
function sceneWoodlot(): SVGGElement {
  const g = sv('g');
  // stable: low roof, posts, two stall openings, hay ticks
  g.append(pth('M-60 2 L-41 -13 L-22 2', { w: 1.4 }));
  g.append(pth('M-56 2 H-26', { w: 1 }));
  g.append(pth('M-55 2 V22 M-41 2 V22 M-27 2 V22', { w: 1 }));
  g.append(pth('M-55 22 H-27', { w: 1 }));
  g.append(pth('M-52 8 H-44 M-38 8 H-30', { s: FINE, o: 0.8 })); // stall rails
  for (let i = 1; i <= 3; i++) {
    g.append(pth(`M${-58 + i * 5} 2 L${-43 + i * 2} ${-11 + i * 1.5}`, { s: FINE, o: 0.5 }));
  }
  g.append(pth('M-50 20 l3 -4 M-46 20 l3 -4', { s: GOLD, w: 0.8, o: 0.6 })); // hay glint
  // the woodlot: three broadleaf trees — curved trunks, scalloped canopies
  const tree = (x: number, y: number, s: number): void => {
    g.append(pth(`M${x} ${y} q${-2 * s} ${-8 * s} ${1 * s} ${-14 * s}`, { w: 1.3 }));
    g.append(pth(`M${x + 0.4 * s} ${y - 8 * s} l${4 * s} ${-3 * s}`, { w: 0.9 })); // branch
    // canopy: stacked scallop arcs (engraver's cloud-foliage)
    g.append(
      pth(
        `M${x - 9 * s} ${y - 12 * s} q${3 * s} ${-6 * s} ${9 * s} ${-5 * s} q${7 * s} ${-4 * s} ${11 * s} ${2 * s} q${4 * s} ${5 * s} ${-2 * s} ${7 * s} q${-5 * s} ${4 * s} ${-11 * s} ${1 * s} q${-8 * s} ${1 * s} ${-7 * s} ${-5 * s} Z`,
        { w: 1.1 },
      ),
    );
    // inner foliage hatch
    g.append(
      pth(`M${x - 4 * s} ${y - 15 * s} q${4 * s} ${-2 * s} ${8 * s} 0`, { s: FINE, o: 0.7 }),
    );
    g.append(
      pth(`M${x - 2 * s} ${y - 12 * s} q${3 * s} ${-1.5 * s} ${7 * s} ${-0.5 * s}`, {
        s: FINE,
        o: 0.6,
      }),
    );
  };
  tree(16, 26, 1.15);
  tree(42, 22, 0.95);
  tree(30, 34, 0.75);
  // the road that leaves the valley — running off the medallion's edge
  g.append(pth('M-20 40 Q10 34 30 44 Q45 52 58 56', { w: 1, o: 0.8 }));
  g.append(pth('M-16 45 Q12 39 30 49 Q44 56 55 61', { w: 1, o: 0.8 }));
  g.append(pth('M2 40 h4 M20 43 h4 M38 51 h4', { s: FINE, o: 0.7 })); // cart ruts
  return g;
}

/** A conifer glyph — trunk + two chevron tiers (the engraver's sugi). */
function conifer(x: number, y: number, s: number, st: Stroke): SVGGElement {
  const g = sv('g');
  g.append(pth(`M${x} ${y} V${y - 9 * s}`, { ...st, w: (st.w ?? 1) * 1.1 }));
  g.append(
    pth(`M${x - 4.4 * s} ${y - 3 * s} L${x} ${y - 10 * s} L${x + 4.4 * s} ${y - 3 * s}`, st),
  );
  g.append(
    pth(`M${x - 3 * s} ${y - 6.4 * s} L${x} ${y - 12 * s} L${x + 3 * s} ${y - 6.4 * s}`, st),
  );
  return g;
}

/** 里山 — the managed hill-forest: one clean hill contour, conifers in tended
 *  rows on the slope, the gathering path zigzagging up, sansai tufts. */
function sceneNearSatoyama(): SVGGElement {
  const g = sv('g');
  // the hill
  g.append(pth('M-60 30 Q-30 -28 12 -16 Q44 -8 60 18', { w: 1.8 }));
  g.append(pth('M-52 30 Q-26 -14 8 -6', { s: FINE, o: 0.55 })); // inner contour
  // tended rows of conifers along the slope (managed = regular)
  const rows: Array<[number, number, number]> = [
    [-38, 10, 0.85],
    [-24, 2, 0.9],
    [-10, -4, 0.95],
    [-30, 24, 0.8],
    [-16, 16, 0.85],
    [-2, 10, 0.9],
    [12, 4, 0.9],
    [26, 10, 0.85],
    [12, 22, 0.8],
    [28, 26, 0.75],
    [42, 20, 0.7],
  ];
  for (const [x, y, s] of rows) g.append(conifer(x, y, s, { w: 0.9, o: 0.9 }));
  // the gathering path, zigzag up the slope
  g.append(pth('M-4 40 L8 28 L-2 16 L12 4 L4 -6', { s: BRIGHT, o: 0.6, w: 1.1, dash: '4 3' }));
  // sansai tufts at the path's foot — three-stroke fern fans
  for (const [x, y] of [
    [-14, 36],
    [16, 38],
    [2, 44],
  ] as Array<[number, number]>) {
    g.append(
      pth(`M${x} ${y} l-3 -5 M${x} ${y} l0 -6 M${x} ${y} l3 -5`, { s: GOLD, w: 0.8, o: 0.6 }),
    );
  }
  return g;
}

/** 奥山 — the wild hill-forest: double ridge, dense overlapping conifers,
 *  gloom hatch between, the boar's wallow and its hoof-prints. */
function sceneDeepSatoyama(): SVGGElement {
  const g = sv('g');
  // two steep ridgelines
  g.append(pth('M-60 24 L-30 -26 L-6 -8 L22 -34 L60 14', { w: 1.5 }));
  g.append(pth('M-46 24 L-24 -12 L-4 4', { s: FINE, o: 0.6 }));
  // dense, irregular wild conifers — overlapping, big and small
  const wild: Array<[number, number, number, number]> = [
    [-40, 8, 1.2, 1],
    [-28, 16, 1.0, 0.85],
    [-16, 6, 1.35, 1],
    [-4, 18, 1.1, 0.9],
    [8, 2, 1.3, 1],
    [20, 12, 1.15, 0.9],
    [34, 22, 1.0, 0.85],
    [30, 0, 1.25, 1],
    [46, 12, 0.9, 0.8],
    [-8, -8, 0.9, 0.75],
    [16, -14, 0.8, 0.7],
  ];
  for (const [x, y, s, o] of wild) g.append(conifer(x, y, s, { w: 1, o }));
  // gloom — hatch shading in the understorey
  g.append(pth('M-34 20 h6 M-20 24 h6 M-6 26 h6 M10 22 h6 M26 28 h6', { s: FINE, o: 0.7 }));
  g.append(pth('M-27 24 h5 M-13 28 h5 M3 30 h5 M19 26 h5', { s: FINE, o: 0.5 }));
  // the boar's wallow (bottom right): a churned mud hollow + hoof-prints
  g.append(pth('M22 38 q8 -5 18 -1 q6 3 -1 6 q-10 4 -17 -1 q-3 -2 0 -4 Z', { w: 1 }));
  g.append(pth('M27 39 h8 M25 42 h10', { s: FINE, o: 0.8 }));
  g.append(pth('M14 46 h10 M30 48 h12 M46 44 h8', { s: FINE, o: 0.5 })); // churned ground
  for (const [x, y] of [
    [12, 42],
    [6, 46],
    [18, 47],
  ] as Array<[number, number]>) {
    g.append(pth(`M${x} ${y} l1.4 2 M${x + 3} ${y} l-1.4 2`, { s: FINE, o: 0.9, w: 0.9 }));
  }
  return g;
}

/** 稽古場 — the drill yard: the weapon rack with leaning staves, the bound
 *  straw dummy on its post, the raked ground. */
function sceneDrillYard(): SVGGElement {
  const g = sv('g');
  // weapon rack (left): two posts + crossbar, three staves leaning
  g.append(pth('M-48 28 V-8 M-16 28 V-8', { w: 1.4 }));
  g.append(pth('M-52 -8 H-12', { w: 1.2 }));
  g.append(pth('M-52 -3 H-12', { s: FINE, o: 0.7 }));
  g.append(pth('M-44 28 L-36 -20', { w: 1.1 })); // bō
  g.append(pth('M-36 28 L-30 -22 l3 -5', { w: 1.1 })); // naginata + blade
  g.append(pth('M-27 -27 l3 -5', { s: BRIGHT, w: 1.2, o: 0.9 }));
  g.append(pth('M-27 28 L-23 -18', { w: 1.1 })); // bokken
  g.append(pth('M-25 -18 h4', { s: GOLD, w: 1, o: 0.8 })); // tsuba glint
  // straw dummy (right): post, bound straw body, the struck target ring
  g.append(pth('M30 34 V-20', { w: 1.4 }));
  g.append(pth('M22 -16 q8 -6 16 0 q3 10 0 20 q-8 6 -16 0 q-3 -10 0 -20 Z', { w: 1.5 }));
  g.append(pth('M22 -8 h16 M22 -2 h16 M22 4 h16', { s: FINE, o: 0.85 })); // straw bindings
  g.append(pth('M25 -13 l2 3 M31 -15 l1 3 M37 -13 l-2 3', { s: FINE, o: 0.6 })); // straw ends
  g.append(circ(30, -4, 3.2, { s: SHU, w: 1, o: 0.55 })); // the struck mark — a faint hazard-red ring
  // raked ground lines
  g.append(pth('M-54 36 H-6 M2 38 H52', { s: FINE, o: 0.55 }));
  g.append(pth('M-46 41 H0 M8 43 H46', { s: FINE, o: 0.45 }));
  return g;
}

function sceneFor(nodeId: string, state: GameState): SVGGElement {
  switch (nodeId) {
    case 'kura':
      return sceneKura();
    case 'gate-forecourt':
      return sceneGate(state.unlocked);
    case 'home-paddies':
      return scenePaddies();
    case 'woodlot-edge':
      return sceneWoodlot();
    case 'near-satoyama':
      return sceneNearSatoyama();
    case 'deep-satoyama':
      return sceneDeepSatoyama();
    case 'drill-yard':
      return sceneDrillYard();
    default:
      return sv('g');
  }
}

// ── the crest-pips: labour / foes / people engraved on the lower rim ─────────
interface Pip {
  glyph: string;
  tip: string;
  kind: 'labour' | 'foe' | 'person';
}

function pipsFor(nodeId: string, state: GameState): Pip[] {
  const pips: Pip[] = [];
  for (const a of ACTIVITIES) {
    if (a.area !== nodeId) continue;
    pips.push({ glyph: SKILL_GLYPH[a.skill] ?? '業', tip: a.label, kind: 'labour' });
  }
  for (const m of MOBS) {
    if (m.area !== nodeId) continue;
    if ((m.minTier ?? 0) > state.tier) continue; // not reachable this tier
    if (m.scripted) continue; // a story beat, not a resident foe
    pips.push({ glyph: m.kanji, tip: `${m.label} — Lv ${m.level}`, kind: 'foe' });
  }
  for (const p of PEOPLE) {
    if (p.node !== nodeId) continue;
    if (p.placeGate && !state.unlocked.includes(p.placeGate)) continue;
    if (p.presence && !p.presence(state)) continue;
    pips.push({ glyph: '人', tip: p.tell ? `${p.name} — ${p.tell}` : p.name, kind: 'person' });
  }
  return pips;
}

// ── medallion furniture ──────────────────────────────────────────────────────

/** Coin reeding — short radial ticks around the rim (the struck-die edge). */
function reeding(r: number, count: number, o: number): SVGGElement {
  const g = sv('g');
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    g.append(pth(`M${(r - 2.4) * c} ${(r - 2.4) * s} L${r * c} ${r * s}`, { s: LINE, w: 0.7, o }));
  }
  return g;
}

/** The U-stage embellishment rings — the die grows richer as the estate does. */
function stageRings(stage: number): SVGGElement {
  const g = sv('g');
  if (stage >= 1) g.append(circ(0, 0, R - 7, { s: LINE, w: 0.8, o: 0.7, dash: '1.5 3' })); // chased ring
  if (stage >= 2) g.append(circ(0, 0, R - 4, { s: GOLD, w: 1.1, o: 0.9 })); // gold inlay ring
  if (stage >= 3) {
    g.append(circ(0, 0, R - 11, { s: GOLD_HI, w: 1, o: 0.85, dash: '0.2 5' })); // beaded gold
  }
  if (stage >= 4) {
    // crest studs — eight gold diamonds set into the rim
    for (let i = 0; i < 8; i++) {
      const a = ((i + 0.5) / 8) * Math.PI * 2;
      const x = (R - 4) * Math.cos(a);
      const y = (R - 4) * Math.sin(a);
      g.append(
        pth(`M${x} ${y - 2.6} L${x + 2.6} ${y} L${x} ${y + 2.6} L${x - 2.6} ${y} Z`, {
          s: GOLD_HI,
          w: 0.9,
          f: 'rgba(216,185,120,0.28)',
        }),
      );
    }
  }
  return g;
}

// ── roads: damascened gold-in-steel line inlay ───────────────────────────────
function road(
  a: { x: number; y: number },
  b: { x: number; y: number },
  live: boolean,
): SVGGElement {
  const g = sv('g');
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const pad = R + 9;
  const x1 = a.x + ux * pad;
  const y1 = a.y + uy * pad;
  const x2 = b.x - ux * pad;
  const y2 = b.y - uy * pad;
  const d = `M${x1} ${y1} L${x2} ${y2}`;
  if (!live) {
    // a road only rumoured — a faint dashed hairline into the fog
    g.append(pth(d, { s: 'var(--silver-faint)', w: 1.2, dash: '3 6' }));
    return g;
  }
  // the hammered channel in the plate…
  g.append(pth(d, { s: 'var(--steel-hi)', w: 8, cap: 'round' }));
  g.append(pth(d, { s: 'var(--steel-0)', w: 5.5, cap: 'round' }));
  // …the gold wire laid into it…
  g.append(pth(d, { s: GOLD, w: 1.7 }));
  // …and the hammer-set glints along the inlay
  g.append(pth(d, { s: GOLD_HI, w: 1.7, dash: '2.5 8', o: 0.9 }));
  return g;
}

// ── the renderer ─────────────────────────────────────────────────────────────
export function renderMapKamon(
  container: HTMLElement,
  ctx: MapCtx,
  state: GameState,
  dispatch: (intent: Intent) => void,
): void {
  void dispatch; // all movement goes through ctx.move (the real move_to)
  const depths = revealedDepths(ctx.revealed);
  const fog = fogFrontier(ctx.revealed);

  const wrap = document.createElement('div');
  wrap.className = 'kamon-map';

  const style = document.createElement('style');
  style.textContent = [
    '.kamon-map{max-width:720px;margin:0 auto;}',
    '.kamon-map svg{display:block;width:100%;height:auto;}',
    '.kamon-map g[data-node]{outline:none;}',
    '.kamon-map g[data-node]:not([data-locked]) .kamon-rim{transition:stroke .18s ease, stroke-width .18s ease;}',
    '.kamon-map g[data-node]:not([data-locked]):hover .kamon-rim,',
    '.kamon-map g[data-node]:not([data-locked]):focus-visible .kamon-rim{stroke:var(--silver-hi);stroke-width:2;}',
    '.kamon-map g[data-node]:not([data-locked]):hover .kamon-halo,',
    '.kamon-map g[data-node]:not([data-locked]):focus-visible .kamon-halo{opacity:.5;}',
    '.kamon-map g[data-locked]{cursor:not-allowed;}',
    '@media (prefers-reduced-motion: reduce){.kamon-map .kamon-rim{transition:none;}}',
  ].join('\n');
  wrap.append(style);

  const svg = sv('svg', {
    viewBox: `0 0 ${VIEW_W} ${VIEW_H}`,
    role: 'img',
    'aria-label': 'The estate as engraved medallions joined by inlaid roads',
  });

  // defs: the struck-plate face gradient + per-die scene clips
  const defs = sv('defs');
  const grad = sv('radialGradient', { id: 'kamonFace', cx: '38%', cy: '30%', r: '80%' });
  const stop = (off: string, col: string): SVGStopElement =>
    sv('stop', { offset: off, 'stop-color': col });
  grad.append(stop('0%', '#232837'), stop('55%', '#1a1e29'), stop('100%', '#12141d'));
  defs.append(grad);
  const fogGrad = sv('radialGradient', { id: 'kamonBlank', cx: '42%', cy: '34%', r: '78%' });
  fogGrad.append(stop('0%', '#191c26'), stop('100%', '#101219'));
  defs.append(fogGrad);
  const clip = sv('clipPath', { id: 'kamonScene' });
  clip.append(circ(0, 0, R - 10));
  defs.append(clip);
  svg.append(defs);

  // ── roads first (under the dies) ──
  const roadLayer = sv('g');
  const drawn = new Set<string>();
  for (const node of MAP_NODES) {
    for (const nb of node.neighbors) {
      const key = node.id < nb ? `${node.id}|${nb}` : `${nb}|${node.id}`;
      if (drawn.has(key)) continue;
      drawn.add(key);
      const a = POS[node.id];
      const b = POS[nb];
      if (!a || !b) continue;
      const aKnown = depths.has(node.id);
      const bKnown = depths.has(nb);
      if (aKnown && bKnown) roadLayer.append(road(a, b, true));
      else if ((aKnown && fog.has(nb)) || (bKnown && fog.has(node.id))) {
        roadLayer.append(road(a, b, false));
      }
      // both unknown → no road at all (never spoil the shape of the world)
    }
  }
  svg.append(roadLayer);

  // ── the struck medallions (revealed ground) ──
  for (const node of MAP_NODES) {
    if (!depths.has(node.id)) continue;
    const pos = POS[node.id];
    if (!pos) continue;
    const here = node.id === ctx.here;
    const isNb = ctx.neighbours.some((n) => n.id === node.id);
    const gated = isNb && node.dangerRing === true && !ctx.condOk;

    const g = sv('g', { transform: `translate(${pos.x} ${pos.y})` });

    // halo (lit for the current die; a hover glint for walkable neighbours)
    const halo = circ(0, 0, R + 7, {
      s: here ? GOLD_HI : GOLD,
      w: here ? 5 : 3,
      o: here ? 0.3 : 0,
    });
    halo.setAttribute('class', 'kamon-halo');
    if (here) g.append(circ(0, 0, R + 13, { s: GOLD, w: 8, o: 0.1 }));
    g.append(halo);

    // the die: back blank, engraved face, rim
    g.append(circ(0, 0, R + 5, { f: 'var(--steel-0)', s: 'var(--silver-faint)', w: 1 }));
    g.append(circ(0, 0, R, { f: 'url(#kamonFace)' }));
    const rim = circ(0, 0, R, {
      s: here ? GOLD_HI : 'var(--silver-wire)',
      w: here ? 2.4 : 1.3,
    });
    rim.setAttribute('class', 'kamon-rim');
    g.append(rim);
    g.append(reeding(R, 96, 0.22));
    g.append(circ(0, 0, R - 10, { s: 'var(--silver-faint)', w: 0.7 })); // scene bezel

    // the engraved-plate field: faint diagonal burin hatch under the scene
    const field = sv('g', { 'clip-path': 'url(#kamonScene)' });
    field.append(hatchLines(-R, -R, R, R, 7, 26, { s: BRIGHT, w: 0.5, o: 0.05 }));
    // the miniature scene, engraved into the face
    const scene = sceneFor(node.id, state);
    scene.setAttribute('opacity', gated ? '0.55' : '1');
    field.append(scene);
    g.append(field);

    // embellishment rings — the estate dies grow richer with each U-stage
    if (ESTATE_NODES.has(node.id)) g.append(stageRings(state.estateStage));

    // danger mark — 険 in ink; vermillion only while the gate is truly shut
    if (node.dangerRing) {
      g.append(
        txt(R * 0.62, -R * 0.6, '険', 15, gated ? SHU : 'var(--ink-soft)', {
          'font-weight': '600',
        }),
      );
    }

    // crest-pips along the lower rim: labour · foes · people
    const pips = pipsFor(node.id, state);
    const span = 26; // degrees between pips
    pips.forEach((pip, i) => {
      const deg = 90 + (i - (pips.length - 1) / 2) * span;
      const a = (deg * Math.PI) / 180;
      const px = 55 * Math.cos(a);
      const py = 55 * Math.sin(a);
      const pg = sv('g');
      const edge = pip.kind === 'labour' ? GOLD : pip.kind === 'person' ? BRIGHT : LINE;
      pg.append(circ(px, py, 7.5, { f: 'var(--steel-1)', s: edge, w: 0.9, o: 0.95 }));
      const fs = pip.glyph.length > 1 ? 5.5 : 8.5; // two-char kanji shrink to fit the pip
      pg.append(
        txt(px, py + fs / 2.9, pip.glyph, fs, pip.kind === 'labour' ? GOLD_HI : 'var(--ink)'),
      );
      const title = sv('title');
      title.textContent = pip.tip;
      pg.append(title);
      g.append(pg);
    });

    // you-are-here: the vermillion crest-pip set at the die's crown
    if (here) {
      const pip = sv('g');
      pip.append(circ(0, -R, 9, { f: SHU, s: 'var(--shu-hi)', w: 1.2 }));
      pip.append(
        pth(`M0 ${-R - 4.5} L4.5 ${-R} L0 ${-R + 4.5} L-4.5 ${-R} Z`, {
          s: 'var(--steel-0)',
          w: 1.1,
        }),
      );
      const title = sv('title');
      title.textContent = 'You are here';
      pip.append(title);
      g.append(pip);
    }

    // nameplate under the die — kanji struck large, the label in small chrome
    g.append(
      txt(0, R + 27, node.kanji ?? '', 21, here ? 'var(--silver-hi)' : 'var(--silver)', {
        'font-weight': '600',
      }),
    );
    g.append(
      txt(0, R + 44, node.label, 11.5, 'var(--ink-soft)', {
        'font-family': 'var(--font-num, system-ui, sans-serif)',
        'letter-spacing': '0.04em',
      }),
    );

    // navigation wiring — the real move_to / the gate reason
    if (gated) {
      wireGated(g as unknown as HTMLElement, node.id, ctx);
      // wireGated sets elm.title (an HTML property) — inert on an SVG <g>, so
      // also mount the real SVG <title> tooltip carrying the gate reason.
      const title = sv('title');
      title.textContent = ctx.gateReason;
      g.prepend(title);
    } else if (isNb && !here) {
      wireTravel(g as unknown as HTMLElement, node.id, ctx);
      const title = sv('title');
      title.textContent = `Walk to ${node.label}`;
      g.append(title);
    }

    svg.append(g);
  }

  // ── the fog frontier: blank unstruck discs — dies not yet cut ──
  for (const [fogId] of fog) {
    const pos = POS[fogId];
    if (!pos) continue;
    // position only — the die is NEVER named before it is struck
    const g = sv('g', { transform: `translate(${pos.x} ${pos.y})` });
    g.append(circ(0, 0, FOG_R + 4, { f: 'var(--steel-0)', s: 'var(--silver-faint)', w: 0.8 }));
    g.append(circ(0, 0, FOG_R, { f: 'url(#kamonBlank)', s: 'var(--silver-faint)', w: 1 }));
    // raw-plate turning marks — the lathe has touched it, the burin has not
    g.append(circ(0, 0, FOG_R - 9, { s: 'var(--silver-faint)', w: 0.6, o: 0.7 }));
    g.append(pth(`M${-FOG_R + 14} ${-FOG_R + 26} l14 -8`, { s: FINE, o: 0.5, w: 0.7 }));
    g.append(pth(`M${FOG_R - 30} ${FOG_R - 20} l12 -7`, { s: FINE, o: 0.4, w: 0.7 }));
    g.append(txt(0, 7, '？', 20, FINE, { opacity: '0.85' }));
    const title = sv('title');
    title.textContent = 'Unknown ground';
    g.append(title);
    svg.append(g);
  }

  // the engraver's signature line, small, bottom-right of the sheet
  const sig = txt(VIEW_W - 24, VIEW_H - 14, '紋章図', 12, 'var(--ink-faint)', {
    'text-anchor': 'end',
    opacity: '0.8',
  });
  svg.append(sig);

  wrap.append(svg);
  container.append(wrap);
}
