// scene-cards/cards-v1.ts — the PARKED v1 of the E2 scene-card demo, kept in
// code by the human's call (2026-07-08) as a reference for the concepts it
// carries (the figurative room-scene approach, the lit void-MC, the slat
// light, the caption cartouche). v1 got the human's SLOP verdict — v2
// (cards.ts, kage-e + misregistered press) is the kept look; NEITHER advances
// until the human un-parks E2. Original v1 header follows.
//
// scene-cards/cards.ts — the E2 graphics-exploration DEV demo (#12, the VN
// scene-card pilot): two composed woodblock vignettes for the cold open's VN
// scenes — Sōan's sickroom and Genemon's grain-store — drawn ENTIRELY by code
// from the existing brush toolkit (map-sheets/brush.ts). Human-pulled
// 2026-07-08 as a single lightweight demo AHEAD of the E2.1 grammar spec: one
// version, no diverge (docs/plans/fable-2026-07-08-graphics-explorations.md).
// DEV-only (imported by ui/dev.ts alone); ZERO game integration — the
// prototype-first law. Seeded-deterministic; Andon tokens only.
//
// The composition grammar this demo embodies (E2.1 will spec it properly):
// - ONE focal mass per card, set against a dominant horizon band; the rest of
//   the frame stays negative space (the still, composed frame IS the look).
// - Figures are featureless silhouette masses — NEVER faces, never literal
//   action. The MC goes further: a figure-scale VOID, the spirited-away man
//   drawn as the absence the light falls around.
// - A caption cartouche (the vermillion seal-frame, vertical role-kanji) marks
//   the card the way a print's title cartouche does.
// - The card's single tint is the speaker's existing VN voice colour
//   (--v-physician / --v-steward) so the cards belong to the dialogue system
//   they'd one day sit above.

import {
  brushStroke,
  hatchArea,
  inkLine,
  scrawl,
  stipple,
  sv,
  tip,
  wash,
} from '../map-sheets/brush';
import type { Pt } from '../map-sheets/geom';
import { NAMES } from '../../core/content/names';

const CARD_W = 720;
const CARD_H = 405;

function hd<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text !== undefined) e.textContent = text;
  return e;
}

/** Ink text with a choosable font register (same helper idiom as stamp-book). */
function txt(
  parent: SVGElement,
  x: number,
  y: number,
  text: string,
  o: {
    size: number;
    color: string;
    font?: 'head' | 'body';
    vertical?: boolean;
    anchor?: 'start' | 'middle' | 'end';
    opacity?: number;
  },
): SVGTextElement {
  const t = sv(
    'text',
    {
      x: String(x),
      y: String(y),
      'text-anchor': o.anchor ?? 'middle',
      style:
        `font-family:var(--font-${o.font ?? 'head'});font-size:${o.size}px;` +
        `fill:${o.color};` +
        (o.vertical ? 'writing-mode:vertical-rl;' : ''),
      ...(o.opacity !== undefined ? { opacity: String(o.opacity) } : {}),
    },
    text,
  );
  parent.append(t);
  return t;
}

/** A featureless head-blob — a dense ring scrawled closed (never a face). */
function headPts(cx: number, cy: number, r: number): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * 1.06]);
  }
  return pts;
}

/** Two or three curved robe-fold strokes — brushwork, never a regular hatch. */
function robeFolds(parent: SVGElement, folds: readonly (readonly Pt[])[], seed: string): void {
  for (const [i, f] of folds.entries())
    inkLine(parent, f, {
      seed: `${seed}-fold-${i}`,
      color: 'var(--washi-deep)',
      w: 1.6,
      opacity: 0.4,
      amp: 2.4,
    });
}

/** The caption cartouche — a vermillion seal-frame with vertical role-kanji,
 *  top-right like a print's title cartouche. */
function cartouche(parent: SVGElement, kanji: string, roman: string, seed: string): void {
  const x0 = 646;
  const y0 = 26;
  const w = 48;
  const h = 44 + kanji.length * 34;
  const frame: Pt[] = [
    [x0, y0],
    [x0 + w, y0],
    [x0 + w, y0 + h],
    [x0, y0 + h],
  ];
  parent.append(
    sv('path', {
      d: scrawl(frame, `cart-${seed}`, 3, true),
      fill: 'var(--washi-deep)',
      stroke: 'var(--shu)',
      'stroke-width': '2.4',
      'stroke-linejoin': 'round',
      opacity: '0.92',
    }),
  );
  txt(parent, x0 + w / 2, y0 + h / 2 - (kanji.length * 26) / 2 + 4, kanji, {
    size: 24,
    color: 'var(--shu-hi)',
    vertical: true,
    anchor: 'start',
  });
  txt(parent, x0 + w / 2, y0 + h + 16, roman, {
    size: 10,
    color: 'var(--ink-faint)',
    font: 'body',
  });
}

// ── card 1 · Sōan — the sickroom ("You're awake.") ────────────────────────────

function paintSoanCard(art: SVGElement): void {
  // the ground — a dark interior, most of the frame left as negative space
  wash(
    art,
    [
      [6, 6],
      [714, 6],
      [714, 399],
      [6, 399],
    ],
    { seed: 'soan-bg', fill: 'var(--washi-deep)', amp: 2 },
  );

  // the low roof — one heavy beam, a few rafters rising off the frame
  brushStroke(
    art,
    [
      [14, 86],
      [706, 76],
    ],
    { seed: 'soan-beam', w: 9, color: 'var(--ink-soft)', opacity: 0.5 },
  );
  const rafters: [Pt, Pt][] = [
    [
      [148, 84],
      [118, 14],
    ],
    [
      [398, 80],
      [376, 10],
    ],
    [
      [648, 78],
      [630, 8],
    ],
  ];
  for (const [i, [a, b]] of rafters.entries())
    brushStroke(art, [a, b], {
      seed: `soan-rafter-${i}`,
      w: 4.4,
      color: 'var(--ink-faint)',
      opacity: 0.4,
    });

  // the floor — the horizon band; straw laid in low gold hatch
  inkLine(
    art,
    [
      [10, 302],
      [710, 296],
    ],
    { seed: 'soan-horizon', color: 'var(--ink-faint)', w: 1.4, opacity: 0.6 },
  );
  const floor: Pt[] = [
    [10, 300],
    [710, 295],
    [710, 400],
    [10, 400],
  ];
  hatchArea(art, floor, {
    seed: 'soan-straw',
    angle: 6,
    spacing: 10,
    color: 'var(--gold-dim)',
    opacity: 0.16,
    w: 1,
  });
  stipple(art, floor, {
    seed: 'soan-chaff',
    step: 30,
    prob: 0.4,
    r: 1,
    color: 'var(--gold-dim)',
    opacity: 0.3,
  });

  // light through the slats — three shafts in the physician's cool tint,
  // falling from the unseen wall to land ON the bed where the MC lies
  for (let i = 0; i < 3; i++) {
    const tx = 42 + i * 46;
    const bx = 128 + i * 84;
    wash(
      art,
      [
        [tx, 90],
        [tx + 26, 89],
        [bx + 82, 326],
        [bx + 30, 330],
      ],
      {
        seed: `soan-shaft-${i}`,
        fill: 'var(--v-physician)',
        opacity: 0.075 + (i % 2) * 0.02,
        amp: 2,
      },
    );
    wash(
      art,
      [
        [bx + 14, 328],
        [bx + 96, 324],
        [bx + 88, 350],
        [bx + 22, 354],
      ],
      { seed: `soan-pool-${i}`, fill: 'var(--v-physician)', opacity: 0.12, amp: 3 },
    );
  }

  // the straw bed — a lighter mat catching the light
  const mat: Pt[] = [
    [128, 310],
    [352, 305],
    [358, 352],
    [122, 356],
  ];
  wash(art, mat, { seed: 'soan-mat', fill: 'var(--washi-shade)', amp: 3 });
  hatchArea(art, mat, {
    seed: 'soan-mat-straw',
    angle: 4,
    spacing: 7,
    color: 'var(--gold-dim)',
    opacity: 0.22,
    w: 0.9,
  });

  // the MC — a figure-scale VOID lying in the light: the spirited-away man
  // drawn as the absence the light falls around (never a face)
  const mcBody: Pt[] = [
    [162, 332],
    [200, 316],
    [258, 309],
    [300, 314],
    [312, 326],
    [300, 340],
    [242, 347],
    [182, 345],
  ];
  const mcG = sv('g');
  wash(mcG, mcBody, {
    seed: 'soan-mc',
    fill: 'var(--void)',
    amp: 2.5,
    stroke: 'var(--ink-faint)',
    strokeW: 1,
  });
  wash(mcG, headPts(330, 324, 13), {
    seed: 'soan-mc-head',
    fill: 'var(--void)',
    amp: 1.6,
    stroke: 'var(--ink-faint)',
    strokeW: 1,
  });
  tip(mcG, 'the spirited-away — a figure-scale void; the man the light falls around');
  art.append(mcG);

  // Sōan — kneeling, sat back on his heels, facing the bed; a featureless mass
  wash(
    art,
    [
      [420, 340],
      [540, 335],
      [544, 351],
      [416, 353],
    ],
    { seed: 'soan-shadow', fill: 'var(--void)', opacity: 0.5, amp: 3 },
  );
  const soanG = sv('g');
  const soanBody: Pt[] = [
    [488, 226],
    [468, 240],
    [448, 270],
    [432, 300],
    [428, 334],
    [530, 332],
    [524, 282],
    [518, 246],
    [504, 230],
  ];
  wash(soanG, soanBody, { seed: 'soan-body', fill: 'var(--ink-soft)', amp: 2.5, opacity: 0.92 });
  wash(soanG, headPts(494, 208, 16), {
    seed: 'soan-head',
    fill: 'var(--ink-soft)',
    amp: 1.8,
    opacity: 0.92,
  });
  robeFolds(
    soanG,
    [
      [
        [474, 248],
        [458, 286],
        [452, 328],
      ],
      [
        [498, 244],
        [502, 288],
        [506, 328],
      ],
    ],
    'soan',
  );
  tip(soanG, `${NAMES.physician} the physician sits back on his heels.`);
  art.append(soanG);

  // the medicine chest at his knee — the physician's one emblem
  wash(
    art,
    [
      [372, 298],
      [412, 295],
      [414, 331],
      [370, 333],
    ],
    {
      seed: 'soan-chest',
      fill: 'var(--washi-shade)',
      amp: 1.6,
      stroke: 'var(--ink-faint)',
      strokeW: 1,
    },
  );
  inkLine(
    art,
    [
      [373, 309],
      [412, 307],
    ],
    { seed: 'soan-drawer1', color: 'var(--ink-faint)', w: 1, opacity: 0.7 },
  );
  inkLine(
    art,
    [
      [372, 320],
      [413, 318],
    ],
    { seed: 'soan-drawer2', color: 'var(--ink-faint)', w: 1, opacity: 0.7 },
  );

  cartouche(art, '医', NAMES.physician, 'soan');
}

// ── card 2 · Genemon — the grain-store ("On your feet, then.") ────────────────

function paintGenemonCard(art: SVGElement): void {
  wash(
    art,
    [
      [6, 6],
      [714, 6],
      [714, 399],
      [6, 399],
    ],
    { seed: 'gen-bg', fill: 'var(--washi-deep)', amp: 2 },
  );

  // the kura's bones — heavy posts and a top beam
  brushStroke(
    art,
    [
      [18, 64],
      [702, 58],
    ],
    { seed: 'gen-beam', w: 8, color: 'var(--ink-soft)', opacity: 0.5 },
  );
  brushStroke(
    art,
    [
      [34, 62],
      [37, 344],
    ],
    { seed: 'gen-post-l', w: 8, color: 'var(--ink-faint)', opacity: 0.5 },
  );
  brushStroke(
    art,
    [
      [694, 58],
      [696, 342],
    ],
    { seed: 'gen-post-r', w: 8, color: 'var(--ink-faint)', opacity: 0.5 },
  );

  // the doorway the rains took — a pale gap of daylight, the door leaning off it
  wash(
    art,
    [
      [74, 96],
      [168, 92],
      [170, 336],
      [72, 340],
    ],
    { seed: 'gen-gap', fill: 'var(--silver)', opacity: 0.07, amp: 2.5 },
  );
  wash(
    art,
    [
      [88, 102],
      [150, 99],
      [152, 332],
      [86, 336],
    ],
    { seed: 'gen-gap2', fill: 'var(--silver)', opacity: 0.05, amp: 2 },
  );
  inkLine(
    art,
    [
      [70, 94],
      [72, 340],
    ],
    { seed: 'gen-jamb-l', color: 'var(--ink-faint)', w: 1.6, opacity: 0.7 },
  );
  inkLine(
    art,
    [
      [172, 92],
      [174, 338],
    ],
    { seed: 'gen-jamb-r', color: 'var(--ink-faint)', w: 1.6, opacity: 0.7 },
  );
  const door: Pt[] = [
    [178, 150],
    [242, 166],
    [216, 344],
    [158, 330],
  ];
  wash(art, door, {
    seed: 'gen-door',
    fill: 'var(--washi-shade)',
    amp: 2,
    stroke: 'var(--ink-faint)',
    strokeW: 1.2,
  });
  inkLine(
    art,
    [
      [198, 158],
      [178, 336],
    ],
    { seed: 'gen-plank1', color: 'var(--ink-faint)', w: 1, opacity: 0.6 },
  );
  inkLine(
    art,
    [
      [220, 162],
      [198, 340],
    ],
    { seed: 'gen-plank2', color: 'var(--ink-faint)', w: 1, opacity: 0.6 },
  );

  // the floor — board seams running long
  inkLine(
    art,
    [
      [10, 312],
      [710, 306],
    ],
    { seed: 'gen-horizon', color: 'var(--ink-faint)', w: 1.4, opacity: 0.6 },
  );
  for (const [i, y] of [342, 370, 392].entries())
    inkLine(
      art,
      [
        [12, y],
        [708, y - 4],
      ],
      { seed: `gen-board-${i}`, color: 'var(--ink-faint)', w: 1, opacity: 0.35 },
    );

  // the tawara — a rice bale toppled on its side, ropes still crossed
  const bale: Pt[] = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    bale.push([336 + Math.cos(a) * 68, 320 + Math.sin(a) * 26]);
  }
  wash(art, bale, { seed: 'gen-bale', fill: 'var(--gold-dim)', opacity: 0.38, amp: 2.5 });
  hatchArea(art, bale, {
    seed: 'gen-bale-straw',
    angle: 5,
    spacing: 6,
    color: 'var(--gold-dim)',
    opacity: 0.4,
    w: 0.9,
  });
  for (const [i, bx] of [308, 356].entries()) {
    inkLine(
      art,
      [
        [bx, 298],
        [bx + 12, 342],
      ],
      { seed: `gen-rope-a${i}`, color: 'var(--ink-soft)', w: 1.6, opacity: 0.8 },
    );
    inkLine(
      art,
      [
        [bx + 12, 298],
        [bx, 342],
      ],
      { seed: `gen-rope-b${i}`, color: 'var(--ink-soft)', w: 1.6, opacity: 0.8 },
    );
  }
  wash(art, headPts(402, 320, 19), {
    seed: 'gen-bale-end',
    fill: 'var(--washi-shade)',
    amp: 1.6,
    stroke: 'var(--ink-soft)',
    strokeW: 1.2,
  });

  // the spilled half-season — rice fanning from the bale's mouth in the
  // steward's dry ochre; the card's focal mass
  const spillG = sv('g');
  const spill: Pt[] = [
    [404, 312],
    [522, 330],
    [604, 366],
    [624, 398],
    [438, 398],
    [396, 342],
  ];
  wash(spillG, spill, { seed: 'gen-spill-wash', fill: 'var(--v-steward)', opacity: 0.05, amp: 4 });
  stipple(spillG, spill, {
    seed: 'gen-rice',
    step: 8,
    prob: 0.55,
    r: 1.15,
    color: 'var(--v-steward)',
    opacity: 0.75,
  });
  const halo: Pt[] = [
    [398, 306],
    [548, 322],
    [640, 362],
    [668, 400],
    [420, 402],
    [386, 340],
  ];
  stipple(spillG, halo, {
    seed: 'gen-rice-halo',
    step: 13,
    prob: 0.4,
    r: 1,
    color: 'var(--v-steward)',
    opacity: 0.35,
  });
  tip(spillG, 'Half a season’s stores, spilled where the kura door gave way in the rains.');
  art.append(spillG);

  // the rake — set to the work already, leaning clear of the bale, head down
  brushStroke(
    art,
    [
      [258, 128],
      [230, 326],
    ],
    { seed: 'gen-rake', w: 3.6, color: 'var(--ink-soft)', opacity: 0.75 },
  );
  inkLine(
    art,
    [
      [210, 322],
      [252, 332],
    ],
    { seed: 'gen-rake-bar', color: 'var(--ink-soft)', w: 2.4, opacity: 0.85 },
  );
  for (let i = 0; i < 4; i++)
    inkLine(
      art,
      [
        [214 + i * 11, 326 + i * 2.4],
        [217 + i * 11, 340 + i * 2],
      ],
      { seed: `gen-tine-${i}`, color: 'var(--ink-soft)', w: 1.6, opacity: 0.85 },
    );

  // Genemon — standing over the loss, a stooped featureless mass, hands kept
  wash(
    art,
    [
      [516, 346],
      [606, 342],
      [610, 356],
      [512, 358],
    ],
    { seed: 'gen-shadow', fill: 'var(--void)', opacity: 0.5, amp: 3 },
  );
  const genG = sv('g');
  const genBody: Pt[] = [
    [542, 196],
    [528, 210],
    [522, 246],
    [526, 290],
    [522, 342],
    [596, 340],
    [592, 288],
    [598, 244],
    [584, 206],
    [560, 194],
  ];
  wash(genG, genBody, { seed: 'gen-body', fill: 'var(--ink-soft)', amp: 2.5, opacity: 0.92 });
  wash(genG, headPts(552, 174, 15), {
    seed: 'gen-head',
    fill: 'var(--ink-soft)',
    amp: 1.8,
    opacity: 0.92,
  });
  robeFolds(
    genG,
    [
      [
        [544, 214],
        [538, 268],
        [534, 336],
      ],
      [
        [576, 212],
        [582, 270],
        [586, 334],
      ],
    ],
    'gen',
  );
  inkLine(
    genG,
    [
      [525, 262],
      [595, 258],
    ],
    { seed: 'gen-obi', color: 'var(--washi-deep)', w: 2.2, opacity: 0.5 },
  );
  tip(genG, `${NAMES.elder}, steward of this house — he keeps the little it has left to keep.`);
  art.append(genG);

  cartouche(art, '家令', NAMES.elder, 'gen');
}

// ── the cards + modal ─────────────────────────────────────────────────────────

interface SceneCard {
  readonly id: string;
  readonly paint: (art: SVGElement) => void;
  readonly speaker: string;
  readonly voiceVar: string;
  readonly role: string;
  readonly place: string;
  readonly quote: string;
}

const CARDS: readonly SceneCard[] = [
  {
    id: 'soan',
    paint: paintSoanCard,
    speaker: NAMES.physician,
    voiceVar: 'var(--v-physician)',
    role: 'the physician',
    place: 'the sickroom — a cold spring, the ninth year of An’ei',
    quote:
      '“You’re awake. No kami carried you off, whatever the village wants to ' +
      'believe. A flood took you, and a blow to the head took the rest.”',
  },
  {
    id: 'genemon',
    paint: paintGenemonCard,
    speaker: NAMES.elder,
    voiceVar: 'var(--v-steward)',
    role: 'steward of the house',
    place: 'the grain-store — where the kura door gave way in the rains',
    quote:
      `“On your feet, then. I am ${NAMES.elder}, steward of this house, and I ` +
      'keep the little it has left to keep.”',
  },
];

let uidCounter = 0;

/** One card: the woodblock vignette under a paper-grain wobble, bordered crisp. */
function buildCard(def: SceneCard): SVGSVGElement {
  const uid = `scnv1-${++uidCounter}`;
  const svg = sv('svg', {
    viewBox: `0 0 ${CARD_W} ${CARD_H}`,
    preserveAspectRatio: 'xMidYMid meet',
  }) as SVGSVGElement;
  const defs = sv('defs');
  const filter = sv('filter', {
    id: `${uid}-w`,
    x: '-3%',
    y: '-3%',
    width: '106%',
    height: '106%',
  });
  filter.append(
    sv('feTurbulence', {
      type: 'fractalNoise',
      baseFrequency: '0.012',
      numOctaves: '2',
      seed: '7',
      result: 'n',
    }),
    sv('feDisplacementMap', { in: 'SourceGraphic', in2: 'n', scale: '3' }),
  );
  defs.append(filter);
  svg.append(defs);
  const art = sv('g', { filter: `url(#${uid}-w)` });
  svg.append(art);
  def.paint(art);
  // crisp frame outside the wobble
  svg.append(
    sv('rect', {
      x: '2',
      y: '2',
      width: String(CARD_W - 4),
      height: String(CARD_H - 4),
      fill: 'none',
      stroke: 'var(--silver-faint)',
    }),
  );
  return svg;
}

const CSS = `
  .scn-card { max-width: 860px; width: 100%; max-height: calc(100dvh - 2rem);
    display: flex; flex-direction: column; }
  .scn-scroll { flex: 1 1 auto; min-height: 0; margin-top: .7rem; overflow-y: auto;
    display: flex; flex-direction: column; gap: 1.1rem; }
  .scn-fig { margin: 0; }
  .scn-fig svg { display: block; width: 100%; height: auto;
    border: 1px solid var(--silver-faint); background: var(--void); }
  .scn-cap { font-size: 12px; color: var(--ink-soft); margin-top: .45rem;
    line-height: 1.45; }
  .scn-cap .scn-name { font-family: var(--font-head); font-size: 14px; }
  .scn-cap .scn-quote { display: block; margin-top: .15rem; font-style: italic; }
  .scn-hint { flex: 0 0 auto; font-size: 11px; color: var(--ink-faint);
    margin-top: .5rem; }
`;

/** Open the E2 scene-card demo as a DEV modal. Returns the scrim. */
export function openSceneCardsV1(): HTMLElement {
  const scrim = hd('div', 'modal-scrim');
  // above the DEV panel (z-index 9999), same as the map review sheets
  scrim.style.zIndex = '10000';
  const card = hd('div', 'modal-card frame scn-card');
  scrim.append(card);

  const style = document.createElement('style');
  style.textContent = CSS;
  card.append(style);

  const close = hd('button', 'modal-close', '×');
  close.type = 'button';
  close.setAttribute('aria-label', 'Close the scene cards');
  card.append(close);

  const title = hd('div', 'modal-title');
  title.append(
    hd('span', 'kami', '絵詞'),
    hd(
      'span',
      'roman',
      'E2 demo v1 · PARKED — VN scene cards (the cold open · fixture text, zero integration)',
    ),
  );
  card.append(title);

  const scroll = hd('div', 'scn-scroll');
  for (const def of CARDS) {
    const fig = hd('figure', 'scn-fig');
    fig.append(buildCard(def));
    const cap = hd('figcaption', 'scn-cap');
    const name = hd('span', 'scn-name', def.speaker);
    name.style.color = def.voiceVar;
    cap.append(name, document.createTextNode(` — ${def.role} · ${def.place}`));
    cap.append(hd('span', 'scn-quote', def.quote));
    fig.append(cap);
    scroll.append(fig);
  }
  card.append(scroll);
  card.append(
    hd(
      'div',
      'scn-hint',
      'Two composed woodblock vignettes for the cold open’s VN scenes — the grammar ' +
        'demo: one focal mass on a horizon band, figures as featureless silhouettes ' +
        '(never faces), the MC a figure-scale void, a vermillion caption cartouche, ' +
        'one voice-colour tint per speaker. Where it goes: a card like this sits above ' +
        'its VN scene. DEV-only demo; hover the figures.',
    ),
  );

  const dispose = (): void => {
    document.removeEventListener('keydown', onKey);
    scrim.remove();
  };
  const onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') dispose();
  };
  document.addEventListener('keydown', onKey);
  close.addEventListener('click', dispose);
  scrim.addEventListener('click', (e) => {
    if (e.target === scrim) dispose();
  });

  document.body.append(scrim);
  return scrim;
}
