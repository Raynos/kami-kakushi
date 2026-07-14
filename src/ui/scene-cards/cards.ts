// scene-cards/cards.ts — the E2 graphics-exploration DEV demo (#12, the VN
// scene-card pilot), v2: after the human's slop verdict on v1's figurative
// room-scenes, rebuilt in the 1+2 rescue direction
// (project/brainstorms/2026-07-08-e2-scene-card-rescue.md):
//
//   1 · KAGE-E — full-commitment silhouette theatre. Flat depth planes, no
//     perspective, no room. Every figure a PURE flat silhouette in STRICT
//     PROFILE — no grays, no fold lines; all character lives in the crafted
//     outline (a nose/chin notch in the outline is silhouette practice; drawn
//     facial features stay banned). The MC inverts to a figure-scale PAPER
//     VOID cut out of the ground shadow (fill-rule evenodd) — the
//     spirited-away man is the one non-shadow.
//   2 · PRINT-CRAFT — fake the PRESS, not the drawing. A dark keyblock layer
//     (silhouettes, props) over flat color blocks that are deliberately
//     MISREGISTERED a few px off the keyblock, with baren/paper grain
//     (feTurbulence alpha masks) inside the fills. Perfect registration is
//     the tell of SVG art; the slip is what reads "printed object".
//
// Still the lightweight human-pulled demo (one version, no diverge, ahead of
// the E2.1 grammar spec — docs/plans/fable-2026-07-08-graphics-explorations.md).
// **PARKED (human, 2026-07-08):** both demo versions stay in code as concept
// references — this v2 (the kept look) and cards-v1.ts (the slop-ruled
// figurative take) — and neither advances until E2 un-parks.
// DEV-only (imported by ui/dev.ts alone); ZERO game integration — the
// prototype-first law. Seeded-deterministic; Andon tokens only; each card's
// single tint is its speaker's VN voice colour (--v-physician / --v-steward).

import {
  brushStroke,
  inkLine,
  rng,
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

/** A keyblock silhouette — one flat near-black mass; the craft is the outline.
 *  Low scrawl amp on purpose: kage-e reads CUT, not wobbled. */
function silhouette(
  parent: SVGElement,
  pts: readonly Pt[],
  seed: string,
): SVGPathElement {
  const p = sv('path', {
    d: scrawl(pts, seed, 1.5, true),
    fill: 'var(--void)',
    stroke: 'none',
    opacity: '0.95',
  });
  parent.append(p);
  return p;
}

/** The caption cartouche — a vermillion seal-frame with vertical role-kanji.
 *  Lives in the misregistered colour layer: a seal is a second press. */
function cartouche(
  parent: SVGElement,
  kanji: string,
  roman: string,
  seed: string,
): void {
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

/** The card's layer stack — background paper, colour blocks under/over the
 *  keyblock (both riding the same registration slip), and the keyblock. */
interface Layers {
  readonly paper: SVGGElement;
  readonly colorUnder: SVGGElement;
  readonly key: SVGGElement;
  readonly colorOver: SVGGElement;
}

// ── card 1 · Sōan — the sickroom ("You're awake.") ────────────────────────────
//
// Planes: the physician's cool paper field · three flat slat-light bands
// raking down onto the ground shadow · the roof beam bleeding off both edges ·
// the ground band with the MC cut OUT of it, lying where the light lands ·
// Sōan kneeling seiza in profile, bowed toward him.

function paintSoanCard(l: Layers): void {
  // paper field — the voice tint laid flat over washi
  const field: Pt[] = [
    [6, 6],
    [714, 6],
    [714, 399],
    [6, 399],
  ];
  wash(l.paper, field, { seed: 'soan-paper', fill: 'var(--washi)', amp: 2 });
  wash(l.paper, field, {
    seed: 'soan-tint',
    fill: 'var(--v-physician)',
    opacity: 0.22,
    amp: 2,
  });

  // slat-light — three flat bands falling from the beam onto the void (the
  // light falls INTO the cutout, for free, via evenodd)
  for (let i = 0; i < 3; i++) {
    const tx = 62 + i * 52;
    const bx = 130 + i * 72;
    wash(
      l.colorUnder,
      [
        [tx, 56],
        [tx + 30, 55],
        [bx + 62, 292],
        [bx, 295],
      ],
      {
        seed: `soan-band-${i}`,
        fill: 'var(--silver-hi)',
        opacity: i === 1 ? 0.13 : 0.1,
        amp: 2,
      },
    );
  }

  // the roof beam — one heavy keyblock bar bleeding off both edges
  brushStroke(
    l.key,
    [
      [-8, 46],
      [728, 38],
    ],
    {
      seed: 'soan-beam',
      w: 20,
      color: 'var(--void)',
      opacity: 0.95,
      taperIn: 0.04,
      taperOut: 0.04,
    },
  );

  // the ground shadow band, with the MC cut OUT of it — the spirited-away man
  // as a figure-scale paper void (never a face; the profile IS the drawing)
  const band: Pt[] = [
    [6, 290],
    [714, 285],
    [714, 399],
    [6, 399],
  ];
  // fully INSIDE the band (a ridge poking past the band's edge reads as
  // mountains, not a man), and every bump an ARC of points — a lone peak
  // vertex renders as a spike, a rounded run of points as a sleeping body
  const mc: Pt[] = [
    [102, 324], // heels
    [106, 314], // toes, turned up —
    [112, 309], //   the arch —
    [118, 313], //   set down
    [136, 315], // ankles
    [146, 314], // shins
    [160, 306], // the knees rise —
    [172, 301], //   crest —
    [184, 304], //   and fall
    [194, 310],
    [212, 314], // thigh
    [232, 315], // hip
    [250, 311],
    [262, 306], // the chest rises —
    [274, 301], //   he is breathing —
    [286, 303], //   and eases
    [296, 308],
    [306, 313], // the neck dip
    [313, 307], // chin, tipped up
    [318, 301],
    [323, 303], // the notch
    [327, 297], // nose to the rafters
    [332, 300],
    [338, 305], // brow
    [344, 311], // crown
    [348, 318], // back of the head
    [350, 324],
    [345, 330], // nape on the mat
    [320, 335],
    [270, 338],
    [210, 339],
    [150, 337],
    [115, 332],
    [104, 328],
  ];
  const bandG = sv('g');
  const bandPath = sv('path', {
    d: `${scrawl(band, 'soan-band-edge', 3, true)} ${scrawl(mc, 'soan-mc', 0.7, true)}`,
    'fill-rule': 'evenodd',
    fill: 'var(--void)',
    stroke: 'none',
    opacity: '0.95',
  });
  bandG.append(bandPath);
  tip(bandG, 'the spirited-away — the one shape the shadow does not own');
  l.key.append(bandG);

  // Sōan — seiza in strict profile, bowed toward the bed; sleeve, nape, and
  // tucked chin carry the whole character (outline only, never features)
  const soanG = sv('g');
  silhouette(
    soanG,
    [
      [462, 180], // crown, bowed forward
      [490, 188], // back of the skull
      [492, 210], // nape — the step that makes the neck
      [510, 220], // shoulder-back
      [524, 252], // the bent back
      [530, 286], // low back
      [534, 318], // heels — sinking into the ground shadow
      [446, 318], // base front, in the shadow
      [440, 300], // shin
      [448, 286], // knee
      [424, 278], // the kimono sleeve — a BOLD hanging triangle
      [420, 262], // sleeve tip
      [442, 248], // wrist
      [452, 234], // chest
      [448, 224], // collar — step in before the jaw
      [432, 216], // chin, tucked
      [440, 208], // the notch under the nose
      [428, 200], // nose — outline only, never features
      [438, 192], // bridge
      [443, 186], // brow
    ],
    'soan-fig',
  );
  tip(soanG, `${NAMES.physician} the physician sits back on his heels.`);
  l.key.append(soanG);

  cartouche(l.colorOver, '医', NAMES.physician, 'soan');
}

// ── card 2 · Genemon — the grain-store ("On your feet, then.") ────────────────
//
// Planes: the steward's dry-ochre paper field · a toppled tawara sunk in the
// ground shadow, its rice pouring out as the card's one bright colour block ·
// Genemon stooped in profile over the loss, hands clasped behind · the rake
// oversized in the foreground, bleeding off the frame.

function paintGenemonCard(l: Layers): void {
  const field: Pt[] = [
    [6, 6],
    [714, 6],
    [714, 399],
    [6, 399],
  ];
  wash(l.paper, field, { seed: 'gen-paper', fill: 'var(--washi)', amp: 2 });
  wash(l.paper, field, {
    seed: 'gen-tint',
    fill: 'var(--v-steward)',
    opacity: 0.22,
    amp: 2,
  });

  // a low dusk band above the ground shadow — the one hint of depth
  wash(
    l.colorUnder,
    [
      [6, 268],
      [714, 262],
      [714, 300],
      [6, 304],
    ],
    { seed: 'gen-dusk', fill: 'var(--gold)', opacity: 0.05, amp: 3 },
  );

  // the ground shadow band
  wash(
    l.key,
    [
      [6, 290],
      [714, 285],
      [714, 399],
      [6, 399],
    ],
    { seed: 'gen-band', fill: 'var(--void)', opacity: 0.95, amp: 3 },
  );

  // the tawara — toppled, half-sunk in the shadow, its arc against the field
  const baleG = sv('g');
  const bale: Pt[] = [];
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    bale.push([300 + Math.cos(a) * 72, 288 + Math.sin(a) * 32]);
  }
  silhouette(baleG, bale, 'gen-bale');
  tip(
    baleG,
    'Half a season’s stores, spilled where the kura door gave way in the rains.',
  );
  l.key.append(baleG);

  // Genemon — standing profile, stooped by years of keeping, hands clasped
  // behind the back; the head thrust forward reads the reproach
  const genG = sv('g');
  silhouette(
    genG,
    [
      [536, 148], // crown
      [558, 154], // back of the skull
      [556, 172], // nape — the step that makes the neck
      [572, 184], // shoulder-back
      [588, 214], // the stoop — the back bows out
      [596, 238], // hands clasped behind —
      [590, 250], //   the knuckle notch —
      [598, 258], //   the second hand
      [588, 290], // robe back
      [594, 318], // hem, sinking into the shadow
      [524, 318], // hem front
      [530, 286], // the robe front falls straight
      [526, 248],
      [534, 216], // chest
      [536, 200], // collar
      [530, 194], // throat
      [518, 188], // chin, thrust forward
      [524, 180], // the notch under the nose
      [514, 174], // nose — outline only, never features
      [522, 166], // bridge
      [526, 162], // brow
    ],
    'gen-fig',
  );
  tip(
    genG,
    `${NAMES.elder}, steward of this house — he keeps the little it has left to keep.`,
  );
  l.key.append(genG);

  // the rake — foreground plane, oversized, bleeding off the frame corner
  brushStroke(
    l.key,
    [
      [-8, 400],
      [150, 178],
    ],
    { seed: 'gen-rake', w: 9, color: 'var(--void)', opacity: 0.95 },
  );
  brushStroke(
    l.key,
    [
      [124, 166],
      [184, 200],
    ],
    { seed: 'gen-rake-bar', w: 6, color: 'var(--void)', opacity: 0.95 },
  );
  // the tine comb — parallel teeth hanging off the crossbar
  for (let i = 0; i < 5; i++)
    inkLine(
      l.key,
      [
        [130 + i * 12, 172 + i * 7],
        [117 + i * 12, 195 + i * 7],
      ],
      { seed: `gen-tine-${i}`, color: 'var(--void)', w: 3.5, opacity: 0.95 },
    );

  // the spill — the card's one bright colour block, pouring from the bale's
  // mouth across the shadow and off the frame; rice reads as pressed colour
  const spillG = sv('g');
  const spill: Pt[] = [
    [356, 290],
    [470, 310],
    [590, 344],
    [680, 378],
    [720, 394],
    [720, 399],
    [560, 399],
    [430, 346],
    [352, 312],
  ];
  wash(spillG, spill, {
    seed: 'gen-spill',
    fill: 'var(--gold)',
    opacity: 0.4,
    amp: 4,
  });
  stipple(spillG, spill, {
    seed: 'gen-rice',
    step: 9,
    prob: 0.5,
    r: 1.2,
    color: 'var(--gold-hi)',
    opacity: 0.9,
  });
  // strays past the drift's edge
  stipple(
    spillG,
    [
      [340, 280],
      [700, 350],
      [714, 399],
      [420, 399],
    ],
    {
      seed: 'gen-strays',
      step: 26,
      prob: 0.3,
      r: 1,
      color: 'var(--gold-hi)',
      opacity: 0.5,
    },
  );
  l.colorOver.append(spillG);

  // rope crossings + the coiled end-cap, pressed in the tint colour over the
  // bale's ink — the second block showing its slip against the keyblock
  for (const [i, bx] of [258, 314].entries()) {
    inkLine(
      l.colorOver,
      [
        [bx, 262],
        [bx + 14, 314],
      ],
      {
        seed: `gen-rope-a${i}`,
        color: 'var(--v-steward)',
        w: 2.2,
        opacity: 0.85,
      },
    );
    inkLine(
      l.colorOver,
      [
        [bx + 14, 262],
        [bx, 314],
      ],
      {
        seed: `gen-rope-b${i}`,
        color: 'var(--v-steward)',
        w: 2.2,
        opacity: 0.85,
      },
    );
  }
  const cap: Pt[] = [];
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    cap.push([358 + Math.cos(a) * 15, 286 + Math.sin(a) * 17]);
  }
  l.colorOver.append(
    sv('path', {
      d: scrawl(cap, 'gen-cap', 1.6, true),
      fill: 'none',
      stroke: 'var(--v-steward)',
      'stroke-width': '2',
      opacity: '0.85',
    }),
  );

  cartouche(l.colorOver, '家令', NAMES.elder, 'gen');
}

// ── the cards + modal ─────────────────────────────────────────────────────────

interface SceneCard {
  readonly id: string;
  readonly paint: (l: Layers) => void;
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

/** A grain mask — feTurbulence noise eaten into the layer's alpha: baren
 *  streaks on the paper, fine press mottle in the colour blocks. */
function grainFilter(
  defs: SVGElement,
  id: string,
  o: { bf: string; slope: number; intercept: number; seed: string },
): void {
  const f = sv('filter', {
    id,
    x: '-2%',
    y: '-2%',
    width: '104%',
    height: '104%',
  });
  const ct = sv('feComponentTransfer', { in: 'n', result: 'a' });
  ct.append(
    sv('feFuncA', {
      type: 'linear',
      slope: String(o.slope),
      intercept: String(o.intercept),
    }),
  );
  f.append(
    sv('feTurbulence', {
      type: 'fractalNoise',
      baseFrequency: o.bf,
      numOctaves: '2',
      seed: o.seed,
      result: 'n',
    }),
    ct,
    sv('feComposite', { in: 'SourceGraphic', in2: 'a', operator: 'in' }),
  );
  defs.append(f);
}

/** One card: paper → colour blocks (misregistered) → keyblock → colour-over
 *  (same slip) → crisp frame. */
function buildCard(def: SceneCard): SVGSVGElement {
  const uid = `scn-${++uidCounter}`;
  const svg = sv('svg', {
    viewBox: `0 0 ${CARD_W} ${CARD_H}`,
    preserveAspectRatio: 'xMidYMid meet',
  }) as SVGSVGElement;
  const defs = sv('defs');
  // the keyblock's hand-cut wobble
  const wob = sv('filter', {
    id: `${uid}-w`,
    x: '-3%',
    y: '-3%',
    width: '106%',
    height: '106%',
  });
  wob.append(
    sv('feTurbulence', {
      type: 'fractalNoise',
      baseFrequency: '0.012',
      numOctaves: '2',
      seed: '7',
      result: 'n',
    }),
    sv('feDisplacementMap', { in: 'SourceGraphic', in2: 'n', scale: '2.5' }),
  );
  defs.append(wob);
  grainFilter(defs, `${uid}-gp`, {
    bf: '0.006 0.08',
    slope: 0.35,
    intercept: 0.78,
    seed: '5',
  });
  grainFilter(defs, `${uid}-gc`, {
    bf: '0.55',
    slope: 0.9,
    intercept: 0.35,
    seed: '9',
  });
  svg.append(defs);

  // the registration slip — seeded per card, a few px, the press's honesty
  const r = rng(`reg-${def.id}`);
  const dx = (2.4 + r() * 1.6) * (r() < 0.5 ? 1 : -1);
  const dy = -(1.4 + r() * 1.4);
  const slip = `translate(${dx.toFixed(1)} ${dy.toFixed(1)})`;

  const paper = sv('g', { filter: `url(#${uid}-gp)` });
  const colorUnder = sv('g', { filter: `url(#${uid}-gc)`, transform: slip });
  const key = sv('g', { filter: `url(#${uid}-w)` });
  const colorOver = sv('g', { filter: `url(#${uid}-gc)`, transform: slip });
  svg.append(paper, colorUnder, key, colorOver);
  def.paint({ paper, colorUnder, key, colorOver });

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
export function openSceneCards(): HTMLElement {
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
      'E2 demo v2 · PARKED — kage-e scene cards (the cold open · fixture text, zero integration)',
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
      'Kage-e silhouette theatre under a two-block press: strict-profile shadow ' +
        'figures on flat planes, the MC a paper void cut out of the ground shadow, ' +
        'colour blocks deliberately misregistered off the keyblock, baren grain in ' +
        'the fills. One voice-colour field per speaker; a card like this sits above ' +
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
