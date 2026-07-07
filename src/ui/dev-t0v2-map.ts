// DEV-only T0 V2 REVIEW MAP — the rebooted story-bible zone roster, drawn as a
// survey sheet BEFORE the game is rebuilt to match. A full-screen modal opened
// from the DEV panel (Story tab); READ-ONLY and fully self-contained: it renders
// from ITS OWN node data (distilled verbatim-faithfully from
// docs/story-bible/tiers/t0.md, the 2026-07-07 walked-whole tier sheet), never
// from src/core — the whole point is reviewing the NEW territory before any
// engine node exists for it. Imported only by dev.ts, so it rides the DEV fold
// (tree-shaken from prod with the rest of the panel).
//
// Interactions: click/Enter a seal (or a roster row) → the detail pane reads
// that zone's full node-grammar entry (blurb · actions · who · the wrong thing
// · combat shape); header pills toggle the 戦/人/怪 mark layers; selecting the
// Night rounds draws its patrol rail. Esc / × / scrim-click closes.

// ── tiny SVG/DOM helpers (ezu.ts's idiom, re-implemented so this module stays
//    standalone — ezu keeps its helpers private and MUST stay untouched) ──────

const NS = 'http://www.w3.org/2000/svg';

function sv<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs?: Record<string, string>,
  text?: string,
): SVGElementTagNameMap[K] {
  const e = document.createElementNS(NS, tag);
  if (attrs) for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (text !== undefined) e.textContent = text;
  return e;
}

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

function tip(elm: SVGElement, text: string): void {
  elm.append(sv('title', undefined, text));
}

/** Deterministic PRNG (fnv1a → xorshift-mix) — every open paints the same sheet. */
function rng(seed: string): () => number {
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

type Pt = readonly [number, number];

/** Hand-scrawled path: jittered vertices, bowed segments (the surveyed brush line). */
function scrawl(pts: readonly Pt[], seed: string, amp = 2.2, close = false): string {
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

function stroke(
  parent: SVGElement,
  d: string,
  colour: string,
  width: number,
  extra?: Record<string, string>,
): SVGPathElement {
  const p = sv('path', {
    d,
    fill: 'none',
    stroke: colour,
    'stroke-width': String(width),
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    ...extra,
  });
  parent.append(p);
  return p;
}

/** A brush pine (the period map-tree). */
function tree(parent: SVGElement, x: number, y: number, s: number, seed: string): void {
  const r = rng(seed);
  const tiers = s > 8.5 ? 3 : 2;
  for (let t = 0; t < tiers; t++) {
    const yt = y - 2 - t * (s * 0.55);
    const w = s * (1.05 - t * 0.3) + (r() - 0.5) * 1.5;
    stroke(
      parent,
      scrawl(
        [
          [x - w, yt],
          [x + (r() - 0.5) * 2, yt - s * 0.85],
          [x + w, yt],
        ],
        `${seed}a${t}`,
        1,
      ),
      'var(--ink-soft)',
      1.1,
      { opacity: '0.7' },
    );
  }
  stroke(
    parent,
    scrawl(
      [
        [x, y - 2],
        [x + (r() - 0.5) * 2, y + s * 0.45],
      ],
      seed + 't',
      0.6,
    ),
    'var(--ink-soft)',
    1.1,
    { opacity: '0.7' },
  );
}

/** A roofed building footprint (walls + hips + ridge), simplified from ezu's. */
function building(
  parent: SVGElement,
  cx: number,
  cy: number,
  w: number,
  hgt: number,
  seed: string,
  faint = false,
): void {
  const x0 = cx - w / 2;
  const y0 = cy - hgt / 2;
  const x1 = cx + w / 2;
  const y1 = cy + hgt / 2;
  const col = faint ? 'var(--silver-faint)' : 'var(--silver-wire)';
  parent.append(
    sv('path', {
      d: scrawl(
        [
          [x0, y0],
          [x1, y0],
          [x1, y1],
          [x0, y1],
        ],
        seed + 'w',
        1.6,
        true,
      ),
      fill: 'var(--steel-2)',
      stroke: col,
      'stroke-width': '1.4',
      'stroke-linejoin': 'round',
    }),
  );
  const ins = Math.min(w, hgt) * 0.32;
  const rx0 = x0 + ins;
  const rx1 = x1 - ins;
  for (const [a, b] of [
    [[x0, y0] as Pt, [rx0, cy] as Pt],
    [[x0, y1] as Pt, [rx0, cy] as Pt],
    [[x1, y0] as Pt, [rx1, cy] as Pt],
    [[x1, y1] as Pt, [rx1, cy] as Pt],
  ] as const) {
    stroke(parent, scrawl([a, b], seed + a.join() + 'h', 0.8), col, 0.9, { opacity: '0.8' });
  }
  stroke(
    parent,
    scrawl(
      [
        [rx0, cy],
        [rx1, cy],
      ],
      seed + 'r',
      0.9,
    ),
    col,
    1.5,
  );
}

/** Hillside hachure band along an arc. */
function hachure(parent: SVGElement, pts: readonly Pt[], seed: string): void {
  const r = rng(seed);
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i]!;
    const [bx, by] = pts[i + 1]!;
    const steps = Math.max(2, Math.round(Math.hypot(bx - ax, by - ay) / 14));
    for (let s = 0; s < steps; s++) {
      const t = (s + 0.5) / steps;
      const x = ax + (bx - ax) * t + (r() - 0.5) * 3;
      const y = ay + (by - ay) * t + (r() - 0.5) * 3;
      const dx = (by - ay) / Math.hypot(bx - ax, by - ay);
      const dy = -(bx - ax) / Math.hypot(bx - ax, by - ay);
      const len = 5 + r() * 4;
      stroke(parent, `M${x},${y} l${dx * len},${Math.abs(dy) * len}`, 'var(--ink-faint)', 0.8, {
        opacity: '0.55',
      });
    }
  }
}

// ── the T0 V2 node roster — docs/story-bible/tiers/t0.md §"The zones" verbatim-
//    distilled (17 entries: 12 estate/grounds + 4 combat zones + the Night
//    rounds activity). Coordinates are display-only sheet placement. ───────────

type ZoneKind = 'estate' | 'grounds' | 'combat' | 'activity' | 'scenery';

interface T0V2Node {
  readonly id: string;
  readonly kanji: string;
  readonly name: string;
  readonly kind: ZoneKind;
  readonly x: number;
  readonly y: number;
  readonly blurb: string;
  readonly actions: readonly string[];
  readonly who: readonly string[];
  readonly wrong: string;
  readonly combat?: string;
}

const KIND_META: Record<ZoneKind, { chip: string; label: string }> = {
  estate: { chip: '屋敷', label: 'estate' },
  grounds: { chip: '野良', label: 'grounds' },
  combat: { chip: '戦', label: 'combat zone' },
  activity: { chip: '夜廻', label: 'combat activity' },
  scenery: { chip: '封', label: 'locked scenery' },
};

const NODES: readonly T0V2Node[] = [
  {
    id: 'weir',
    kanji: '堰',
    name: 'The Weir & riverbank',
    kind: 'grounds',
    x: 190,
    y: 600,
    blurb: 'Where the river left him; the weir-jizō stands here.',
    actions: [
      'Mend the weir screen',
      'Haul stone',
      'hidden: search the reeds — his washed-up bundle, a water-ruined paper',
    ],
    who: ['Sōan passes on his rounds'],
    wrong:
      'Offerings appear at the jizō that nobody admits to leaving — a long-running mystery ' +
      '(it has an authored answer, revealed in a later tier).',
  },
  {
    id: 'weir-reeds',
    kanji: '葦',
    name: 'The Weir reeds',
    kind: 'combat',
    x: 170,
    y: 735,
    blurb:
      'River rats gnaw the weir screens the house leases from Matsuzō; every screen lost is coin owed.',
    actions: [
      'Clear the rats (repeatable)',
      'Mend the screens (repair-labour)',
      'Wade the shallows',
    ],
    who: ['Matsuzō counts the damage from his side of the water'],
    wrong:
      'The rats always come from UPSTREAM — something upstream feeds them (a T1 thread: the old ' +
      'breach pools).',
    combat: 'Grindable loop — rats vs the leased screens; rats swarm at harvest storage.',
  },
  {
    id: 'gate',
    kanji: '門',
    name: 'The Gate & gateyard',
    kind: 'estate',
    x: 560,
    y: 758,
    blurb:
      "The estate's face, kept barely. Yohei's pedlar stall sets up here on market days — THE " +
      'market comes to him.',
    actions: ['Gate-watch', 'Sweep', 'Receive / see off', "Trade at Yohei's stall (market days)"],
    who: [
      'Kihei crosses at watch-change',
      'Yohei on his market days',
      'Iori lodges here in the New Year & Bon seasons',
    ],
    wrong: "The gate's crest board is newer than the gate — the old one is not discussed.",
  },
  {
    id: 'forecourt',
    kanji: '庭',
    name: 'The Forecourt',
    kind: 'estate',
    x: 560,
    y: 620,
    blurb: "The working heart of the guest house's outer court.",
    actions: ['Rake (the first verb)', 'Haul', 'Stack', 'Odd jobs'],
    who: ["Genemon's window overlooks it; the day-book lives off it"],
    wrong: 'The court is sized for a household five times this one.',
  },
  {
    id: 'woodshed',
    kanji: '薪',
    name: 'The Woodshed',
    kind: 'estate',
    x: 660,
    y: 690,
    blurb: 'His corner: a mat, a chipped bowl, the comfort floor.',
    actions: ['Rest / recover', 'Keep his few things'],
    who: ['O-Sato leaves mended things without knocking (later rungs)'],
    wrong: 'None — this node is the one warmth the tier allows, and it is earned.',
  },
  {
    id: 'kitchen',
    kanji: '竈',
    name: 'The Kitchen threshold & board-side',
    kind: 'estate',
    x: 445,
    y: 545,
    blurb: "Meals at the threshold; the board is where the household's shape is overheard.",
    actions: ['Eat (recovery)', 'Overhear (ambient story)', 'Later: carry dishes in'],
    who: [
      'O-Sato rules it',
      'Shinnosuke interrogates from it',
      'Genemon states terms at it',
      'O-Yae, the scullery day-girl, by day (the gossip conduit)',
    ],
    wrong:
      "The steward's papers share the kitchen — an estate compressed into a guest house (the " +
      'twist, hiding in plain sight).',
  },
  {
    id: 'shrine',
    kanji: '祠',
    name: 'The Shrine-alcove corridor',
    kind: 'estate',
    x: 545,
    y: 498,
    blurb:
      'A family altar in a CORRIDOR — compressed worship, the twist again. Glimpsed once in T0, ' +
      'entered in T1.',
    actions: ['Glimpse only (this tier)'],
    who: ['Toku tends it'],
    wrong:
      'Rites set out for a dead man — and the straw sandals face AWAY from the house, renewed ' +
      'this year.',
  },
  {
    id: 'kura',
    kanji: '蔵',
    name: 'The Kura exterior & grain-store',
    kind: 'estate',
    x: 700,
    y: 560,
    blurb: "The working storehouse; the grain-watch's post.",
    actions: ['Load / unload', 'The night watch (R3)', 'The wolf fight'],
    who: ['Kihei sets the watch'],
    wrong:
      "The kura's seal-plate carries a crest with ONE more petal than the gate's — the old " +
      "seat's crest; nobody reads it aloud.",
  },
  {
    id: 'sickroom',
    kanji: '薬',
    name: "Sōan's sickroom",
    kind: 'estate',
    x: 385,
    y: 668,
    blurb:
      'A lean-to surgery off the outer court. Defeat is never game-over — you are carried here ' +
      'and lose days.',
    actions: ['Treatment (injury recovery)', 'The R0 examination', 'Quiet questions not asked'],
    who: ['Sōan'],
    wrong: 'He keeps notes on the MC’s healing in a ledger he closes when anyone enters.',
  },
  {
    id: 'drill-yard',
    kanji: '稽',
    name: 'The Drill yard',
    kind: 'grounds',
    x: 845,
    y: 655,
    blurb: "The old stable court, repurposed; Kihei's ground. Opens at R4 — as Kihei's need.",
    actions: [
      'Drills (combat skills)',
      'Spar (safe, with Kihei, from R4)',
      "The field-guide's first pages",
    ],
    who: ['Kihei, always', 'Shinnosuke watching from the wall'],
    wrong: 'Stable stalls for twenty horses; the house owns one mule.',
  },
  {
    id: 'paddies',
    kanji: '田',
    name: 'The Home paddy & vegetable rows',
    kind: 'grounds',
    x: 275,
    y: 480,
    blurb: "The guest house's skirts; the labour baseline — the deed engine's heart.",
    actions: ['Field work', 'Seasonal planting / harvest'],
    who: [
      'Rokusuke-class hired hands come and go',
      'Otoku-class village women at harvest',
      "O-Ume's plot at the edge",
    ],
    wrong:
      'Boundary stones stand far beyond the worked rows — the fields were once four times wider.',
  },
  {
    id: 'field-margins',
    kanji: '畦',
    name: 'The Field margins',
    kind: 'combat',
    x: 255,
    y: 345,
    blurb:
      "Tanuki and badger setts at the paddy's edge, raiding the drying racks and seed stores. " +
      'Folk-loaded animals played PLAIN (kernel #1).',
    actions: ['Drive the raiders (repeatable, harvest peaks)', 'Dig the setts', 'Set watch'],
    who: ["O-Ume's plot borders the worst of it; she thanks the kami, not the MC"],
    wrong:
      "An old sett runs UNDER the ruined compound's wall — a way in that nobody official knows " +
      'exists.',
    combat: 'Grindable loop — seasonal peaks at harvest.',
  },
  {
    id: 'woodlot',
    kanji: '林',
    name: 'The Woodlot edge',
    kind: 'grounds',
    x: 960,
    y: 370,
    blurb:
      "Kindling and forage country; the wolf's ground before R3. Nobody here — the first " +
      'solitude node.',
    actions: [
      'Gather kindling',
      'Forage',
      'hidden: the silted sluice the field-work keeps hinting at',
    ],
    who: ['Nobody — that is the point'],
    wrong: 'Char marks on old stumps — a burn nobody dates.',
  },
  {
    id: 'ruined',
    kanji: '廃',
    name: 'The ruined compound',
    kind: 'scenery',
    x: 445,
    y: 215,
    blurb:
      'Beyond a rope and a warning: roofs fallen, a great gate crumbled, walls the village ' +
      'quarried for stones. LOCKED all tier; not even named honestly.',
    actions: ['None — scenery, locked all tier'],
    who: ['Nobody — and the household refuses to look at it'],
    wrong: 'The whole node.',
  },
  {
    id: 'orchard',
    kanji: '園',
    name: 'The Overgrown orchard',
    kind: 'combat',
    x: 645,
    y: 260,
    blurb:
      "The old compound's orchard gone wild; feral dogs den in it, bold from lean winters " +
      '(dogs bolden in Winter).',
    actions: [
      'Drive the dogs (a staged combat chain)',
      'RECLAIM the orchard — repair-labour turns a threat into a food source',
    ],
    who: ['Nobody goes there; Kihei calls it "the dogs’ yard" without irony'],
    wrong:
      'Fruit trees planted in courtyard rows — an orchard laid out by someone who expected ' +
      'paths and lanterns.',
    combat:
      'Authored chain — feral-dog stages → reclamation (combat converts to repair and income). ' +
      'Side-beat: the dog that stays.',
  },
  {
    id: 'grove',
    kanji: '竹',
    name: 'The Bamboo grove',
    kind: 'combat',
    x: 815,
    y: 175,
    blurb:
      'Behind the compound; the monkey troop raids the vegetable rows from it (peaks ' +
      'Summer / Bon).',
    actions: [
      'Patrol',
      'Drive the raiders (recurring skirmishes; loot the pilfered goods back)',
      'Cut bamboo (craft material)',
    ],
    who: ['Shinnosuke sneaks here against all instruction'],
    wrong:
      'A cut-bamboo waymark renewed each season — far too old a habit for anyone who’ll ' +
      'claim it.',
    combat: "Grindable loop — the troop's big male is its mini-cap.",
  },
  {
    id: 'night-rounds',
    kanji: '夜',
    name: 'The Night rounds',
    kind: 'activity',
    x: 655,
    y: 795,
    blurb:
      'A combat ACTIVITY, not a map state — no day/night system. "Begin the night round" at its ' +
      'post by the gate puts the MC on rails through several zones in their night state: clear ' +
      "each of enemies to finish, or fall and wake in Sōan's sickroom.",
    actions: ['Begin the night round (the FIRST round is a quest; after that, repeatable)'],
    who: ['Kihei designs the round; from R3 it is his and the MC’s alone'],
    wrong:
      "On new-moon rounds, someone crosses the yard's far edge, lantern hooded, going upstream " +
      '(Toku — the packet, seeded visually long before R5 names it).',
    combat:
      'Repeatable mini-dungeon — the escalation across rungs: rats in the store → a marten → ' +
      "the R3 WOLF as the arc's climax.",
  },
];

/** Roads/paths between zones (display adjacency for review — engine edges come later). */
const ROADS: readonly { pts: readonly Pt[]; seed: string }[] = [
  // gate → paddies (west road)
  {
    pts: [
      [505, 745],
      [400, 690],
      [340, 600],
      [310, 540],
    ],
    seed: 'r-gp',
  },
  // gate → weir (southwest)
  {
    pts: [
      [505, 762],
      [380, 775],
      [280, 735],
      [225, 655],
    ],
    seed: 'r-gw',
  },
  // weir → reeds (the bank)
  {
    pts: [
      [195, 640],
      [180, 695],
    ],
    seed: 'r-wr',
  },
  // paddies → field margins
  {
    pts: [
      [270, 430],
      [258, 388],
    ],
    seed: 'r-pm',
  },
  // gate → drill yard (east)
  {
    pts: [
      [615, 745],
      [745, 705],
      [812, 675],
    ],
    seed: 'r-gd',
  },
  // compound east wall → woodlot edge
  {
    pts: [
      [755, 600],
      [865, 520],
      [930, 425],
    ],
    seed: 'r-cw',
  },
  // woodlot → bamboo grove (up the hill)
  {
    pts: [
      [935, 320],
      [880, 240],
      [845, 205],
    ],
    seed: 'r-wg',
  },
  // orchard → grove
  {
    pts: [
      [690, 240],
      [770, 200],
    ],
    seed: 'r-og',
  },
  // compound north side → orchard (the way up past the rope)
  {
    pts: [
      [600, 480],
      [618, 380],
      [635, 305],
    ],
    seed: 'r-co',
  },
];

/** The Night rounds patrol rail — drawn only while that node is selected. */
const NIGHT_ROUTE: readonly Pt[] = [
  [655, 780],
  [572, 742],
  [560, 640],
  [688, 588],
  [660, 672],
  [828, 660],
  [668, 778],
];

// ── the sheet painter ─────────────────────────────────────────────────────────

let uidCounter = 0;

function paintSheet(svg: SVGSVGElement, nodeEls: Map<string, SVGGElement>): void {
  const uid = `t0v2-${++uidCounter}`;
  const defs = sv('defs');
  const filter = sv('filter', {
    id: `${uid}-w`,
    x: '-5%',
    y: '-5%',
    width: '110%',
    height: '110%',
  });
  filter.append(
    sv('feTurbulence', {
      type: 'fractalNoise',
      baseFrequency: '0.013',
      numOctaves: '2',
      seed: '7',
      result: 'n',
    }),
    sv('feDisplacementMap', { in: 'SourceGraphic', in2: 'n', scale: '3.5' }),
  );
  defs.append(filter);
  svg.append(defs);

  // plate + double survey frame
  svg.append(
    sv('rect', { x: '8', y: '8', width: '1184', height: '844', fill: 'var(--steel-1)' }),
    sv('rect', {
      x: '8',
      y: '8',
      width: '1184',
      height: '844',
      fill: 'none',
      stroke: 'var(--silver-wire)',
      'stroke-width': '1',
    }),
    sv('rect', {
      x: '18',
      y: '18',
      width: '1164',
      height: '824',
      fill: 'none',
      stroke: 'var(--key)',
      'stroke-width': '1.2',
    }),
  );

  const art = sv('g', { filter: `url(#${uid}-w)` }); // wobbled linework
  const seals = sv('g'); // crisp text/click layer
  svg.append(art, seals);

  // ── the land: hills across the north, the river down the west ──
  const hill1: Pt[] = [
    [60, 120],
    [260, 78],
    [520, 60],
    [820, 70],
    [1130, 105],
  ];
  const hill2: Pt[] = [
    [300, 145],
    [560, 118],
    [880, 128],
    [1140, 160],
  ];
  stroke(art, scrawl(hill1, 'h1', 3), 'var(--ink-faint)', 1, { opacity: '0.75' });
  stroke(art, scrawl(hill2, 'h2', 3), 'var(--ink-faint)', 1, { opacity: '0.7' });
  hachure(art, hill1, 'hh1');
  hachure(art, hill2, 'hh2');

  const river: Pt[] = [
    [235, 30],
    [200, 150],
    [150, 300],
    [128, 450],
    [150, 560],
    [190, 620],
    [175, 700],
    [150, 790],
    [140, 850],
  ];
  stroke(art, scrawl(river, 'rv-a', 3), 'var(--silver-dim)', 1.6, { opacity: '0.45' });
  stroke(
    art,
    scrawl(
      river.map(([x, y]) => [x + 7, y + 2] as const),
      'rv-b',
      3,
    ),
    'var(--silver-dim)',
    1.1,
    { opacity: '0.3' },
  );
  // the weir bar across the water + the jizō beside it
  stroke(
    art,
    scrawl(
      [
        [168, 612],
        [216, 606],
      ],
      'weir-bar',
      1,
    ),
    'var(--silver)',
    3,
    {
      opacity: '0.8',
    },
  );
  const jizo = sv('g');
  jizo.append(
    sv('circle', {
      cx: '232',
      cy: '585',
      r: '4',
      fill: 'none',
      stroke: 'var(--silver-wire)',
      'stroke-width': '1.2',
    }),
    sv('rect', {
      x: '228',
      y: '589',
      width: '8',
      height: '10',
      fill: 'none',
      stroke: 'var(--silver-wire)',
      'stroke-width': '1.2',
    }),
  );
  tip(jizo, 'The weir-jizō — offerings appear that nobody admits to leaving');
  art.append(jizo);

  // ── roads ──
  for (const { pts, seed } of ROADS) {
    stroke(art, scrawl(pts, seed, 3), 'var(--gold-dim)', 5, { opacity: '0.3' });
    stroke(art, scrawl(pts, seed + 'c', 3), 'var(--ink-soft)', 1.3, {
      'stroke-dasharray': '8 6',
      opacity: '0.7',
    });
  }
  // the hidden sett — field margins → under the ruined wall (the 怪 layer owns it)
  const sett = stroke(
    art,
    scrawl(
      [
        [268, 322],
        [330, 290],
        [395, 268],
      ],
      'sett',
      2.5,
    ),
    'var(--shu)',
    1.1,
    { 'stroke-dasharray': '2 6', opacity: '0.55', class: 't0v2-m-wrong' },
  );
  tip(sett, "The old sett — a way in under the ruined compound's wall nobody official knows");

  // ── the estate compound: wall, main house, kura, woodshed, sickroom lean-to ──
  const wall: Pt[] = [
    [408, 470],
    [640, 452],
    [758, 505],
    [762, 700],
    [648, 742],
    [472, 740],
    [402, 655],
  ];
  art.append(
    sv('path', {
      d: scrawl(wall, 'cw', 2.6, true),
      fill: 'rgba(216,185,120,0.045)',
      stroke: 'var(--key)',
      'stroke-width': '1.6',
      'stroke-linejoin': 'round',
    }),
  );
  // the gate breaking the south wall
  stroke(
    art,
    scrawl(
      [
        [549, 748],
        [549, 730],
      ],
      'g-p1',
      0.8,
    ),
    'var(--silver)',
    2.4,
  );
  stroke(
    art,
    scrawl(
      [
        [571, 748],
        [571, 730],
      ],
      'g-p2',
      0.8,
    ),
    'var(--silver)',
    2.4,
  );
  stroke(
    art,
    scrawl(
      [
        [544, 730],
        [576, 730],
      ],
      'g-l',
      0.8,
    ),
    'var(--silver)',
    2.2,
  );
  building(art, 520, 522, 128, 66, 'omoya'); // the main house (steward's papers inside)
  building(art, 700, 528, 54, 40, 'kura-b'); // the kura
  building(art, 662, 662, 34, 26, 'shed'); // the woodshed hut
  building(art, 388, 640, 40, 26, 'sick', true); // the sickroom lean-to (off the outer court)
  // Yohei's stall — a small awning outside the gate (market days)
  const stall = sv('g');
  stroke(
    stall,
    scrawl(
      [
        [598, 772],
        [622, 772],
      ],
      'stall-a',
      0.8,
    ),
    'var(--gold-dim)',
    1.6,
  );
  stroke(
    stall,
    scrawl(
      [
        [600, 772],
        [600, 784],
      ],
      'stall-b',
      0.5,
    ),
    'var(--gold-dim)',
    1.2,
  );
  stroke(
    stall,
    scrawl(
      [
        [620, 772],
        [620, 784],
      ],
      'stall-c',
      0.5,
    ),
    'var(--gold-dim)',
    1.2,
  );
  tip(stall, "Yohei's pedlar stall — sets up on market days; his coin is finite per visit");
  art.append(stall);

  // ── the paddies: three terraced parcels + water ticks ──
  const parcels: readonly { pts: readonly Pt[]; seed: string }[] = [
    {
      pts: [
        [195, 420],
        [340, 408],
        [355, 462],
        [205, 472],
      ],
      seed: 'p1',
    },
    {
      pts: [
        [188, 482],
        [352, 472],
        [362, 528],
        [196, 540],
      ],
      seed: 'p2',
    },
    {
      pts: [
        [200, 550],
        [356, 540],
        [346, 596],
        [214, 606],
      ],
      seed: 'p3',
    },
  ];
  for (const { pts, seed } of parcels) {
    art.append(
      sv('path', {
        d: scrawl(pts, seed, 2.6, true),
        fill: 'rgba(216,185,120,0.06)',
        stroke: 'var(--key)',
        'stroke-width': '1.3',
        'stroke-linejoin': 'round',
      }),
    );
    const r = rng(seed + 'w');
    for (let i = 0; i < 2; i++) {
      const hy = (pts[0]![1] + pts[2]![1]) / 2 - 6 + i * 12 + (r() - 0.5) * 3;
      stroke(
        art,
        scrawl(
          [
            [pts[0]![0] + 26, hy],
            [pts[1]![0] - 26, hy],
          ],
          seed + 'h' + i,
          0.9,
        ),
        'var(--ink-faint)',
        0.8,
        { opacity: '0.7' },
      );
    }
  }
  // boundary stones far beyond the worked rows (the paddies' wrong thing, drawn)
  const bstones = sv('g', { class: 't0v2-m-wrong' });
  for (const [bx, by] of [
    [95, 400],
    [88, 500],
    [102, 590],
  ] as const) {
    bstones.append(
      sv('rect', {
        x: String(bx),
        y: String(by),
        width: '6',
        height: '9',
        fill: 'none',
        stroke: 'var(--ink-faint)',
        'stroke-width': '1',
        transform: `rotate(${(bx % 7) - 3} ${bx} ${by})`,
      }),
    );
  }
  tip(
    bstones,
    'Boundary stones far beyond the worked rows — the fields were once four times wider',
  );
  art.append(bstones);
  // field-margin setts: little burrow dots along the paddies' north edge
  const rSett = rng('setts');
  for (let i = 0; i < 5; i++) {
    const sx = 205 + rSett() * 130;
    const sy = 380 + rSett() * 24;
    art.append(
      sv('circle', {
        cx: String(sx),
        cy: String(sy),
        r: '2.4',
        fill: 'var(--steel-0)',
        stroke: 'var(--ink-faint)',
        'stroke-width': '0.8',
      }),
    );
  }

  // ── the ruined compound (north): broken walls, fallen gate, the rope line ──
  const ruinWall: Pt[] = [
    [330, 150],
    [560, 132],
    [575, 265],
    [340, 285],
  ];
  art.append(
    sv('path', {
      d: scrawl(ruinWall, 'ru-w', 4, true),
      fill: 'none',
      stroke: 'var(--silver-faint)',
      'stroke-width': '1.4',
      'stroke-dasharray': '10 7',
      opacity: '0.8',
    }),
  );
  // fallen roofs — collapsed footprint fragments inside
  stroke(
    art,
    scrawl(
      [
        [380, 190],
        [430, 182],
        [418, 214],
      ],
      'ru-r1',
      3,
      true,
    ),
    'var(--silver-faint)',
    1,
    {
      opacity: '0.6',
    },
  );
  stroke(
    art,
    scrawl(
      [
        [470, 200],
        [530, 194],
        [522, 240],
        [478, 244],
      ],
      'ru-r2',
      3.4,
      true,
    ),
    'var(--silver-faint)',
    1,
    {
      opacity: '0.6',
    },
  );
  // the crumbled great gate (south face) + the rope across the approach
  stroke(
    art,
    scrawl(
      [
        [440, 288],
        [452, 270],
      ],
      'ru-g1',
      1.4,
    ),
    'var(--silver-faint)',
    2.2,
    {
      opacity: '0.7',
    },
  );
  stroke(
    art,
    scrawl(
      [
        [468, 286],
        [462, 272],
      ],
      'ru-g2',
      1.4,
    ),
    'var(--silver-faint)',
    2.2,
    {
      opacity: '0.7',
    },
  );
  const rope = stroke(
    art,
    scrawl(
      [
        [392, 316],
        [460, 308],
        [530, 314],
      ],
      'rope',
      2,
    ),
    'var(--shu-dim, var(--shu))',
    1.2,
    {
      'stroke-dasharray': '5 4',
      opacity: '0.6',
    },
  );
  tip(rope, 'The rope and the warning — LOCKED all tier');

  // ── the orchard: fruit trees in courtyard ROWS (the wrongness is the layout) ──
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      tree(art, 596 + col * 30, 210 + row * 32, 7, `or-${row}-${col}`);
    }
  }
  stroke(
    art,
    scrawl(
      [
        [588, 196],
        [700, 196],
      ],
      'or-path',
      1.4,
    ),
    'var(--ink-faint)',
    0.8,
    {
      'stroke-dasharray': '3 5',
      opacity: '0.5',
    },
  );

  // ── the bamboo grove: vertical culm strokes with leaf ticks ──
  const rBam = rng('bam');
  for (let i = 0; i < 14; i++) {
    const bx = 762 + rBam() * 110;
    const by = 120 + rBam() * 60;
    stroke(
      art,
      scrawl(
        [
          [bx, by + 26],
          [bx + (rBam() - 0.5) * 4, by],
        ],
        `bam-${i}`,
        0.8,
      ),
      'var(--ink-soft)',
      1.1,
      {
        opacity: '0.75',
      },
    );
    stroke(art, `M${bx},${by + 6} l${4 + rBam() * 3},${-3 - rBam() * 2}`, 'var(--ink-soft)', 0.8, {
      opacity: '0.6',
    });
  }
  // the cut-bamboo waymark (a 怪 layer item)
  const waymark = stroke(
    art,
    scrawl(
      [
        [756, 195],
        [756, 172],
      ],
      'waymark',
      0.8,
    ),
    'var(--shu)',
    1.6,
    {
      opacity: '0.6',
      class: 't0v2-m-wrong',
    },
  );
  tip(waymark, 'The cut-bamboo waymark, renewed each season — far too old a habit');

  // ── the woodlot: loose trees + char-marked stumps + the road east off-sheet ──
  const spots: readonly Pt[] = [
    [925, 320],
    [965, 300],
    [1010, 330],
    [945, 400],
    [995, 385],
    [1040, 360],
    [1055, 415],
  ];
  spots.forEach(([tx, ty], i) => tree(art, tx, ty, 8, `wl-${i}`));
  const stumps = sv('g', { class: 't0v2-m-wrong' });
  for (const [sx, sy] of [
    [905, 430],
    [1015, 445],
  ] as const) {
    stumps.append(
      sv('circle', {
        cx: String(sx),
        cy: String(sy),
        r: '3.5',
        fill: 'none',
        stroke: 'var(--shu)',
        'stroke-width': '1',
        opacity: '0.55',
      }),
    );
  }
  tip(stumps, 'Char marks on old stumps — a burn nobody dates');
  art.append(stumps);
  stroke(
    art,
    scrawl(
      [
        [1005, 470],
        [1090, 480],
        [1170, 472],
      ],
      'wl-road',
      2,
    ),
    'var(--ink-soft)',
    2.2,
    {
      'stroke-dasharray': '7 6',
      opacity: '0.45',
    },
  );

  // ── the night-rounds patrol rail (hidden until that node is selected) ──
  const rail = sv('g', { class: 't0v2-nightrail' });
  stroke(rail, scrawl(NIGHT_ROUTE, 'rail', 3), 'var(--shu)', 1.6, {
    'stroke-dasharray': '3 7',
    opacity: '0.85',
  });
  const lantern = sv('circle', {
    cx: '655',
    cy: '780',
    r: '5',
    fill: 'none',
    stroke: 'var(--shu)',
    'stroke-width': '1.4',
  });
  tip(lantern, 'The round begins and ends at its post by the gate');
  rail.append(lantern);
  art.append(rail);

  // ── node seals + marks (the interactive layer) ──
  for (const n of NODES) {
    const g = sv('g', { class: `t0v2-node t0v2-k-${n.kind}` }) as SVGGElement;
    g.dataset.zone = n.id;
    seals.append(g);
    nodeEls.set(n.id, g);

    const bw = 34;
    const bh = 32;
    // invisible hit-target spanning seal + caption (the ezu WebKit-gap lesson)
    g.append(
      sv('rect', {
        x: String(n.x - 46),
        y: String(n.y - bh / 2 - 6),
        width: '92',
        height: String(bh + 40),
        fill: 'transparent',
      }),
    );
    const tilt = ((rng(`tilt-${n.id}`)() - 0.5) * 3).toFixed(2);
    g.append(
      sv('rect', {
        x: String(n.x - bw / 2),
        y: String(n.y - bh / 2),
        width: String(bw),
        height: String(bh),
        transform: `rotate(${tilt} ${n.x} ${n.y})`,
        class: 't0v2-sealbox',
      }),
    );
    g.append(
      sv(
        'text',
        {
          x: String(n.x),
          y: String(n.y + 7),
          'text-anchor': 'middle',
          class: 't0v2-kanji',
        },
        n.kanji,
      ),
    );
    const cap = sv(
      'text',
      {
        x: String(n.x),
        y: String(n.y + bh / 2 + 15),
        'text-anchor': 'middle',
        class: 't0v2-caption',
      },
      n.name.replace(/^The /, ''),
    );
    g.append(cap);

    // the mark row: 戦 combat · 人 folk (count) · 怪 wrong thing — layer-toggleable
    const marks: { glyph: string; cls: string; why: string }[] = [];
    if (n.kind === 'combat' || n.kind === 'activity') {
      marks.push({ glyph: '戦', cls: 't0v2-m-combat', why: n.combat ?? 'combat' });
    }
    if (n.who.length > 0 && !n.who[0]!.startsWith('Nobody')) {
      marks.push({
        glyph: `人${n.who.length > 1 ? `×${n.who.length}` : ''}`,
        cls: 't0v2-m-folk',
        why: n.who.join(' · '),
      });
    }
    if (!n.wrong.startsWith('None')) {
      marks.push({ glyph: '怪', cls: 't0v2-m-wrong', why: n.wrong });
    }
    const step = 24;
    let mx = n.x - ((marks.length - 1) * step) / 2;
    for (const m of marks) {
      const mt = sv(
        'text',
        {
          x: String(mx),
          y: String(n.y + bh / 2 + 31),
          'text-anchor': 'middle',
          class: `t0v2-mark ${m.cls}`,
        },
        m.glyph,
      );
      tip(mt, m.why);
      g.append(mt);
      mx += step;
    }
    tip(g, n.name);
  }

  // ── sheet furniture: north mark + title cartouche ──
  const north = sv('g');
  stroke(
    north,
    scrawl(
      [
        [64, 96],
        [64, 52],
      ],
      'north-a',
      1,
    ),
    'var(--silver)',
    1.6,
  );
  stroke(
    north,
    scrawl(
      [
        [57, 62],
        [64, 50],
        [71, 62],
      ],
      'north-h',
      0.8,
    ),
    'var(--silver)',
    1.6,
  );
  north.append(
    sv(
      'text',
      {
        x: '64',
        y: '120',
        'text-anchor': 'middle',
        class: 't0v2-kanji',
        style: 'font-size:17px;fill:var(--silver);',
      },
      '北',
    ),
  );
  tip(north, 'North');
  seals.append(north);

  const cart = sv('g');
  cart.append(
    sv('rect', {
      x: '1112',
      y: '34',
      width: '42',
      height: '244',
      fill: 'var(--steel-2)',
      stroke: 'var(--key)',
      'stroke-width': '1.2',
    }),
  );
  const title = sv('text', {
    x: '1133',
    y: '52',
    class: 't0v2-kanji',
    style:
      'writing-mode:vertical-rl;font-size:19px;letter-spacing:5px;fill:var(--silver);text-anchor:start;',
  });
  title.textContent = '黒沢家領内絵図・改';
  tip(cart, 'Survey plan of the Kurosawa holdings, REVISED — the T0 V2 zone draft');
  cart.append(title);
  seals.append(cart);
}

// ── the detail pane ───────────────────────────────────────────────────────────

function renderOverview(aside: HTMLElement, select: (id: string) => void): void {
  aside.textContent = '';
  aside.append(hd('div', 't0v2-aside-title', 'T0 V2 — the zone draft'));
  const src = hd(
    'div',
    't0v2-aside-src',
    'Source: docs/story-bible/tiers/t0.md (walked whole, 2026-07-07). Review artifact — ' +
      'NOT wired to the game; the engine rebuild comes after this roster is signed.',
  );
  aside.append(src);
  const counts = NODES.reduce<Record<ZoneKind, number>>(
    (acc, n) => ((acc[n.kind] = (acc[n.kind] ?? 0) + 1), acc),
    { estate: 0, grounds: 0, combat: 0, activity: 0, scenery: 0 },
  );
  aside.append(
    hd(
      'div',
      't0v2-aside-sum',
      `${NODES.length} nodes — ${counts.estate} estate · ${counts.grounds} grounds · ` +
        `${counts.combat} combat zones · ${counts.activity} combat activity · ` +
        `${counts.scenery} locked scenery. Shapes: 3 grindable loops · 1 authored chain · ` +
        '1 repeatable mini-dungeon (the Night rounds).',
    ),
  );
  const legend = hd('div', 't0v2-aside-legend');
  for (const [glyph, why] of [
    ['戦', 'combat here'],
    ['人', 'folk here'],
    ['怪', 'a wrong thing — every one has an authored answer'],
  ] as const) {
    const row = hd('div', 't0v2-legend-row');
    row.append(hd('span', 't0v2-legend-glyph', glyph), hd('span', undefined, why));
    legend.append(row);
  }
  aside.append(legend);

  // the full roster, grouped by kind — a completeness checklist for the review
  const order: readonly ZoneKind[] = ['estate', 'grounds', 'combat', 'activity', 'scenery'];
  for (const kind of order) {
    const group = NODES.filter((n) => n.kind === kind);
    if (group.length === 0) continue;
    aside.append(hd('div', 't0v2-roster-head', `${KIND_META[kind].chip} ${KIND_META[kind].label}`));
    for (const n of group) {
      const row = hd('button', 't0v2-roster-row');
      row.type = 'button';
      row.append(hd('span', 't0v2-roster-kanji', n.kanji), hd('span', undefined, n.name));
      row.addEventListener('click', () => select(n.id));
      aside.append(row);
    }
  }
}

function renderDetail(aside: HTMLElement, n: T0V2Node, back: () => void): void {
  aside.textContent = '';
  const backBtn = hd('button', 't0v2-back', '← all zones');
  backBtn.type = 'button';
  backBtn.addEventListener('click', back);
  aside.append(backBtn);

  const head = hd('div', 't0v2-detail-head');
  head.append(hd('span', 't0v2-detail-kanji', n.kanji), hd('span', 't0v2-detail-name', n.name));
  aside.append(head);
  aside.append(
    hd(
      'div',
      `t0v2-chip t0v2-chip-${n.kind}`,
      `${KIND_META[n.kind].chip} · ${KIND_META[n.kind].label}`,
    ),
  );
  aside.append(hd('p', 't0v2-detail-blurb', n.blurb));

  const section = (label: string, items: readonly string[]): void => {
    aside.append(hd('div', 't0v2-detail-label', label));
    const ul = hd('ul', 't0v2-detail-list');
    for (const item of items) {
      const li = hd('li', undefined, item.replace(/^hidden: /, ''));
      if (item.startsWith('hidden:')) {
        li.prepend(hd('span', 't0v2-hidden-tag', '隠 hidden · '));
      }
      ul.append(li);
    }
    aside.append(ul);
  };
  section('Actions', n.actions);
  section("Who's there", n.who);
  if (n.combat) {
    aside.append(hd('div', 't0v2-detail-label', 'Combat shape'));
    aside.append(hd('p', 't0v2-detail-combat', n.combat));
  }
  aside.append(hd('div', 't0v2-detail-label', 'The wrong thing'));
  aside.append(hd('p', 't0v2-detail-wrong', `怪 ${n.wrong}`));
}

// ── the modal ─────────────────────────────────────────────────────────────────

const CSS = `
  .t0v2-card { max-width:none; width:100%; height:calc(100dvh - 2rem); overflow:hidden;
    display:flex; flex-direction:column; }
  .t0v2-head { display:flex; align-items:center; gap:.6rem; flex-wrap:wrap; }
  .t0v2-pills { display:flex; gap:.3rem; margin-left:auto; margin-right:2.4rem; }
  .t0v2-pill { font:12px/1.4 ui-monospace,SFMono-Regular,monospace; cursor:pointer;
    border:1px solid var(--silver-faint); border-radius:3px; padding:.15rem .5rem;
    background:var(--steel-2); color:var(--ink-soft); }
  .t0v2-pill[data-on] { background:var(--gold-dim); color:var(--void); border-color:var(--gold); font-weight:700; }
  .t0v2-body { flex:1 1 auto; min-height:0; display:flex; gap:.8rem; margin-top:.8rem; }
  .t0v2-mapwrap { flex:1 1 auto; min-width:0; border:1px solid var(--silver-faint);
    background:var(--void); display:flex; align-items:center; justify-content:center; }
  .t0v2-mapwrap svg { display:block; width:100%; height:100%; }
  .t0v2-aside { flex:0 0 330px; min-height:0; overflow-y:auto; padding-right:.4rem;
    display:flex; flex-direction:column; gap:.45rem; }
  @media (max-width: 900px) {
    .t0v2-body { flex-direction:column; }
    .t0v2-aside { flex:1 1 auto; }
  }
  .t0v2-kanji { font-family:var(--font-head); font-size:19px; fill:var(--ink); }
  .t0v2-caption { font-family:var(--font-body); font-size:13px; fill:var(--ink-soft); }
  .t0v2-mark { font-family:var(--font-head); font-size:13px; }
  .t0v2-m-combat { fill:var(--ink-soft); }
  .t0v2-m-folk { fill:var(--silver-dim); }
  .t0v2-m-wrong { fill:var(--shu); opacity:.8; }
  .t0v2-sealbox { fill:var(--steel-2); stroke:var(--silver-wire); stroke-width:1.3; }
  .t0v2-k-estate .t0v2-sealbox { stroke:var(--gold); }
  .t0v2-k-grounds .t0v2-sealbox { stroke:var(--gold-dim); }
  .t0v2-k-combat .t0v2-sealbox { stroke:var(--ink-soft); stroke-dasharray:5 3; }
  .t0v2-k-activity .t0v2-sealbox { stroke:var(--shu); stroke-dasharray:2 3; }
  .t0v2-k-scenery { opacity:.62; }
  .t0v2-k-scenery .t0v2-sealbox { stroke:var(--silver-faint); stroke-dasharray:3 4; }
  .t0v2-node { cursor:pointer; outline:none; }
  .t0v2-node:hover .t0v2-sealbox, .t0v2-node:focus-visible .t0v2-sealbox {
    stroke:var(--gold-hi); stroke-width:1.8; }
  .t0v2-node:hover .t0v2-caption { fill:var(--ink); }
  .t0v2-node[data-sel] .t0v2-sealbox { stroke:var(--shu); stroke-width:2; }
  .t0v2-node[data-sel] .t0v2-kanji { fill:var(--shu-hi, var(--shu)); }
  .t0v2-nightrail { display:none; }
  svg[data-night] .t0v2-nightrail { display:inline; }
  svg[data-combat='off'] .t0v2-m-combat { display:none; }
  svg[data-folk='off'] .t0v2-m-folk { display:none; }
  svg[data-wrong='off'] .t0v2-m-wrong { display:none; }
  .t0v2-aside-title { font-family:var(--font-head); font-size:1.05rem; color:var(--ink); }
  .t0v2-aside-src, .t0v2-aside-sum { font-size:12px; color:var(--ink-faint); line-height:1.5; }
  .t0v2-aside-legend { display:flex; flex-direction:column; gap:.15rem; margin:.2rem 0; }
  .t0v2-legend-row { display:flex; gap:.45rem; font-size:12px; color:var(--ink-soft); }
  .t0v2-legend-glyph { font-family:var(--font-head); color:var(--ink); }
  .t0v2-roster-head { margin-top:.5rem; font-size:11px; letter-spacing:.08em;
    text-transform:uppercase; color:var(--gold-dim); }
  .t0v2-roster-row { display:flex; gap:.5rem; align-items:baseline; text-align:left;
    background:none; border:none; border-bottom:1px solid var(--steel-2); padding:.22rem .1rem;
    font:13px/1.4 var(--font-body); color:var(--ink-soft); cursor:pointer; }
  .t0v2-roster-row:hover { color:var(--ink); background:var(--steel-2); }
  .t0v2-roster-kanji { font-family:var(--font-head); color:var(--ink); flex:0 0 auto; }
  .t0v2-back { align-self:flex-start; background:none; border:1px solid var(--silver-faint);
    border-radius:3px; padding:.15rem .5rem; color:var(--ink-soft); cursor:pointer;
    font:12px/1.4 ui-monospace,monospace; }
  .t0v2-back:hover { color:var(--ink); border-color:var(--silver); }
  .t0v2-detail-head { display:flex; gap:.55rem; align-items:baseline; }
  .t0v2-detail-kanji { font-family:var(--font-head); font-size:1.7rem; color:var(--ink); }
  .t0v2-detail-name { font-family:var(--font-head); font-size:1.05rem; color:var(--ink); }
  .t0v2-chip { align-self:flex-start; font-size:11px; letter-spacing:.06em; border-radius:3px;
    padding:.1rem .45rem; border:1px solid var(--silver-faint); color:var(--ink-soft); }
  .t0v2-chip-combat, .t0v2-chip-activity { border-color:var(--shu); color:var(--shu); }
  .t0v2-chip-estate { border-color:var(--gold); color:var(--gold); }
  .t0v2-chip-scenery { border-style:dashed; }
  .t0v2-detail-blurb { font-size:13.5px; line-height:1.55; color:var(--ink); margin:0; }
  .t0v2-detail-label { margin-top:.35rem; font-size:11px; letter-spacing:.08em;
    text-transform:uppercase; color:var(--gold-dim); }
  .t0v2-detail-list { margin:.1rem 0 0; padding-left:1.1rem; font-size:13px; line-height:1.5;
    color:var(--ink-soft); }
  .t0v2-hidden-tag { color:var(--shu); font-size:11px; }
  .t0v2-detail-combat { font-size:13px; line-height:1.5; color:var(--ink-soft); margin:0; }
  .t0v2-detail-wrong { font-size:13px; line-height:1.55; color:var(--shu); margin:0; opacity:.9; }
`;

/** Open the T0 V2 review map as a full-screen modal. Returns the scrim. */
export function openT0V2Map(): HTMLElement {
  const scrim = hd('div', 'modal-scrim');
  // the DEV panel floats at z-index 9999 and would overlap the aside's corner —
  // this modal is a full-screen review surface, so it goes above the panel.
  scrim.style.zIndex = '10000';
  const card = hd('div', 'modal-card frame t0v2-card');
  scrim.append(card);

  const style = document.createElement('style');
  style.textContent = CSS;
  card.append(style);

  const close = hd('button', 'modal-close', '×');
  close.type = 'button';
  close.setAttribute('aria-label', 'Close the T0 V2 map');
  card.append(close);

  const head = hd('div', 't0v2-head');
  const title = hd('div', 'modal-title');
  const kami = hd('span', 'kami', '絵図・改');
  const roman = hd('span', 'roman', 'T0 V2 — the story-bible zone draft');
  title.append(kami, roman);
  head.append(title);

  // the mark-layer pills (戦 / 人 / 怪) — all on by default; state lives on the svg
  const pills = hd('div', 't0v2-pills');
  head.append(pills);
  card.append(head);

  const body = hd('div', 't0v2-body');
  const mapWrap = hd('div', 't0v2-mapwrap');
  const svg = sv('svg', {
    viewBox: '0 0 1200 860',
    role: 'img',
    'aria-label': 'T0 V2 survey plan — the story-bible zone draft',
    preserveAspectRatio: 'xMidYMid meet',
  });
  mapWrap.append(svg);
  const aside = hd('div', 't0v2-aside');
  body.append(mapWrap, aside);
  card.append(body);

  for (const [attr, label] of [
    ['combat', '戦 combat'],
    ['folk', '人 folk'],
    ['wrong', '怪 wrong things'],
  ] as const) {
    const pill = hd('button', 't0v2-pill', label);
    pill.type = 'button';
    pill.dataset.on = '1';
    pill.addEventListener('click', () => {
      const on = !pill.dataset.on;
      if (on) pill.dataset.on = '1';
      else delete pill.dataset.on;
      svg.setAttribute(`data-${attr}`, on ? 'on' : 'off');
    });
    pills.append(pill);
  }

  const nodeEls = new Map<string, SVGGElement>();
  paintSheet(svg, nodeEls);

  let selected: string | null = null;
  const select = (id: string | null): void => {
    if (selected) delete nodeEls.get(selected)?.dataset.sel;
    selected = id;
    if (id) {
      const g = nodeEls.get(id);
      if (g) g.dataset.sel = '1';
      if (id === 'night-rounds') svg.setAttribute('data-night', '1');
      else svg.removeAttribute('data-night');
      const n = NODES.find((x) => x.id === id)!;
      renderDetail(aside, n, () => select(null));
    } else {
      svg.removeAttribute('data-night');
      renderOverview(aside, (nid) => select(nid));
    }
  };
  for (const [id, g] of nodeEls) {
    g.setAttribute('tabindex', '0');
    g.setAttribute('role', 'button');
    g.addEventListener('click', () => select(selected === id ? null : id));
    g.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Enter') select(selected === id ? null : id);
    });
  }
  select(null);

  const dismiss = (): void => {
    document.removeEventListener('keydown', onKey);
    scrim.remove();
  };
  const onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') dismiss();
  };
  close.addEventListener('click', dismiss);
  scrim.addEventListener('click', (e) => {
    if (e.target === scrim) dismiss();
  });
  document.addEventListener('keydown', onKey);

  document.body.append(scrim);
  return scrim;
}
