// DEV-only T0 V2 REVIEW MAP — the rebooted story-bible zone roster, drawn as a
// survey sheet BEFORE the game is rebuilt to match. A full-screen modal opened
// from the DEV panel (Story tab); READ-ONLY and fully self-contained: it renders
// from ITS OWN node data (distilled verbatim-faithfully from
// docs/story-bible/tiers/t0.md, the 2026-07-07 walked-whole tier sheet), never
// from src/core — the whole point is reviewing the NEW territory before any
// engine node exists for it. Imported only by dev.ts, so it rides the DEV fold
// (tree-shaken from prod with the rest of the panel).
//
// LAYOUT (human steer, 2026-07-07): a brand-new geography for the V2 scope —
// NOT the shipped ezu sheet extended. The world canvas is BIG (2400×1600) so
// nothing squishes; the view pans (drag) and zooms (wheel / ⊕⊖ / fit), opening
// at full-sheet fit. The ground plan is T1-AWARE: every T1 zone (t1.md) has
// reserved, empty ground it can land on without moving a T0 seal —
//   · Upstream pools (combat)      → the river's upper reach, top-left
//   · Terraced paddies (up+low)    → the slope between field margins and ruin
//   · Let-go terraces (combat)     → the scrub above those, under the hills
//   · Woodlot proper + clamp       → beyond the woodlot edge, top-right
//   · Boundary stones / far fields → the river-side ground west of the paddies
//   · Downstream shallows (combat) → the river below the weir reeds, Matsuzō's
//   · Family plot                  → the knoll between ruin and compound
//   · Kura interior · Workshops · East/West wings · Inner garden · Shoin
//                                  → inside the compound (the faint closed-wing
//                                    blocks drawn on the main house today)
// The T1 map will be this sheet, bigger — same world, more seals.
//
// Interactions: click/Enter a seal (or a roster row — the roster also flies the
// view to the zone) → the detail pane reads that zone's full node-grammar entry
// (blurb · actions · who · the wrong thing · combat shape); header pills toggle
// the 戦/人/怪 mark layers; selecting the Night rounds draws its patrol rail.
// Esc / × / scrim-click closes.

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
      1.3,
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
    1.3,
    { opacity: '0.7' },
  );
}

/** A roofed building footprint (walls + hips + ridge). `faint` = closed/derelict. */
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
        1.8,
        true,
      ),
      fill: 'var(--steel-2)',
      stroke: col,
      'stroke-width': '1.6',
      'stroke-linejoin': 'round',
      ...(faint ? { 'stroke-dasharray': '5 4' } : {}),
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
    stroke(parent, scrawl([a, b], seed + a.join() + 'h', 0.9), col, 1, { opacity: '0.8' });
  }
  stroke(
    parent,
    scrawl(
      [
        [rx0, cy],
        [rx1, cy],
      ],
      seed + 'r',
      1,
    ),
    col,
    1.7,
  );
}

/** Hillside hachure band along an arc. */
function hachure(parent: SVGElement, pts: readonly Pt[], seed: string): void {
  const r = rng(seed);
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i]!;
    const [bx, by] = pts[i + 1]!;
    const steps = Math.max(2, Math.round(Math.hypot(bx - ax, by - ay) / 22));
    for (let s = 0; s < steps; s++) {
      const t = (s + 0.5) / steps;
      const x = ax + (bx - ax) * t + (r() - 0.5) * 4;
      const y = ay + (by - ay) * t + (r() - 0.5) * 4;
      const dx = (by - ay) / Math.hypot(bx - ax, by - ay);
      const dy = -(bx - ax) / Math.hypot(bx - ax, by - ay);
      const len = 7 + r() * 6;
      stroke(parent, `M${x},${y} l${dx * len},${Math.abs(dy) * len}`, 'var(--ink-faint)', 1, {
        opacity: '0.55',
      });
    }
  }
}

// ── the T0 V2 node roster — docs/story-bible/tiers/t0.md §"The zones" verbatim-
//    distilled (17 entries). Coordinates are display-only WORLD placement on the
//    2400×1600 sheet (see the T1 reservation plan in the header comment). ──────

const WORLD = { w: 2400, h: 1600 } as const;

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
    x: 400,
    y: 1120,
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
    x: 350,
    y: 1330,
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
    x: 1230,
    y: 1370,
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
    x: 1230,
    y: 1150,
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
    x: 1465,
    y: 1245,
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
    x: 1015,
    y: 1085,
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
    x: 1290,
    y: 880,
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
    x: 1560,
    y: 1020,
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
    x: 862,
    y: 1180,
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
    x: 1810,
    y: 1200,
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
    x: 645,
    y: 1005,
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
    x: 700,
    y: 655,
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
    x: 1960,
    y: 760,
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
    x: 1020,
    y: 320,
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
    x: 1330,
    y: 430,
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
    x: 1640,
    y: 310,
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
    x: 1400,
    y: 1440,
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
  // gate → paddies (the west road)
  {
    pts: [
      [1170, 1385],
      [980, 1340],
      [850, 1230],
      [790, 1120],
    ],
    seed: 'r-gp',
  },
  // gate → weir (southwest)
  {
    pts: [
      [1175, 1400],
      [880, 1450],
      [600, 1380],
      [455, 1220],
    ],
    seed: 'r-gw',
  },
  // weir → reeds (down the bank)
  {
    pts: [
      [395, 1180],
      [370, 1270],
    ],
    seed: 'r-wr',
  },
  // paddies → field margins
  {
    pts: [
      [660, 900],
      [690, 760],
    ],
    seed: 'r-pm',
  },
  // gate → drill yard (east)
  {
    pts: [
      [1290, 1385],
      [1580, 1360],
      [1740, 1280],
    ],
    seed: 'r-gd',
  },
  // compound north-east corner → woodlot edge
  {
    pts: [
      [1665, 1000],
      [1810, 900],
      [1905, 810],
    ],
    seed: 'r-cw',
  },
  // woodlot → bamboo grove (up the hill)
  {
    pts: [
      [1935, 620],
      [1790, 430],
      [1690, 350],
    ],
    seed: 'r-wg',
  },
  // orchard → grove
  {
    pts: [
      [1405, 385],
      [1545, 330],
    ],
    seed: 'r-og',
  },
  // compound north wall → the rope line / orchard fork (the way up)
  {
    pts: [
      [1250, 810],
      [1265, 620],
      [1295, 500],
    ],
    seed: 'r-co',
  },
  // gate → south, off the sheet (the village road — T2 ground, fading out)
  {
    pts: [
      [1230, 1415],
      [1225, 1500],
      [1235, 1580],
    ],
    seed: 'r-gs',
  },
];

/** The Night rounds patrol rail — drawn only while that node is selected. */
const NIGHT_ROUTE: readonly Pt[] = [
  [1400, 1420],
  [1240, 1355],
  [1230, 1165],
  [1550, 1000],
  [1470, 1230],
  [1795, 1195],
  [1415, 1430],
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
      baseFrequency: '0.009',
      numOctaves: '2',
      seed: '7',
      result: 'n',
    }),
    sv('feDisplacementMap', { in: 'SourceGraphic', in2: 'n', scale: '4' }),
  );
  defs.append(filter);
  svg.append(defs);

  // plate + double survey frame
  svg.append(
    sv('rect', {
      x: '8',
      y: '8',
      width: String(WORLD.w - 16),
      height: String(WORLD.h - 16),
      fill: 'var(--steel-1)',
    }),
    sv('rect', {
      x: '8',
      y: '8',
      width: String(WORLD.w - 16),
      height: String(WORLD.h - 16),
      fill: 'none',
      stroke: 'var(--silver-wire)',
      'stroke-width': '1.5',
    }),
    sv('rect', {
      x: '22',
      y: '22',
      width: String(WORLD.w - 44),
      height: String(WORLD.h - 44),
      fill: 'none',
      stroke: 'var(--key)',
      'stroke-width': '1.8',
    }),
  );

  const art = sv('g', { filter: `url(#${uid}-w)` }); // wobbled linework
  const seals = sv('g'); // crisp text/click layer
  svg.append(art, seals);

  // ── the land: hills across the north, the river down the west ──
  const hill1: Pt[] = [
    [90, 200],
    [560, 120],
    [1100, 90],
    [1700, 105],
    [2320, 175],
  ];
  const hill2: Pt[] = [
    [560, 275],
    [950, 225],
    [1320, 245],
  ];
  const hill3: Pt[] = [
    [1780, 210],
    [2100, 240],
    [2330, 300],
  ];
  stroke(art, scrawl(hill1, 'h1', 4), 'var(--ink-faint)', 1.2, { opacity: '0.75' });
  stroke(art, scrawl(hill2, 'h2', 4), 'var(--ink-faint)', 1.2, { opacity: '0.7' });
  stroke(art, scrawl(hill3, 'h3', 4), 'var(--ink-faint)', 1.2, { opacity: '0.7' });
  hachure(art, hill1, 'hh1');
  hachure(art, hill2, 'hh2');
  hachure(art, hill3, 'hh3');

  // the river: from the hills (upstream — the T1 pools' reach) south past the
  // weir and off the sheet (downstream — Matsuzō's shallows, T1)
  const river: Pt[] = [
    [470, 60],
    [420, 220],
    [350, 400],
    [310, 600],
    [300, 800],
    [330, 980],
    [390, 1110],
    [380, 1240],
    [340, 1380],
    [300, 1500],
    [290, 1580],
  ];
  stroke(art, scrawl(river, 'rv-a', 4), 'var(--silver-dim)', 2.2, { opacity: '0.45' });
  stroke(
    art,
    scrawl(
      river.map(([x, y]) => [x + 10, y + 3] as const),
      'rv-b',
      4,
    ),
    'var(--silver-dim)',
    1.4,
    { opacity: '0.3' },
  );
  // the weir bar across the water + the jizō on the bank
  stroke(
    art,
    scrawl(
      [
        [368, 1125],
        [428, 1118],
      ],
      'weir-bar',
      1,
    ),
    'var(--silver)',
    4,
    { opacity: '0.8' },
  );
  const jizo = sv('g');
  jizo.append(
    sv('circle', {
      cx: '450',
      cy: '1078',
      r: '5',
      fill: 'none',
      stroke: 'var(--silver-wire)',
      'stroke-width': '1.4',
    }),
    sv('rect', {
      x: '445',
      y: '1083',
      width: '10',
      height: '13',
      fill: 'none',
      stroke: 'var(--silver-wire)',
      'stroke-width': '1.4',
    }),
  );
  tip(jizo, 'The weir-jizō — offerings appear that nobody admits to leaving');
  art.append(jizo);
  // reed clumps along the reeds' stretch of bank
  const rReed = rng('reeds');
  for (let i = 0; i < 9; i++) {
    const bx = 320 + rReed() * 90;
    const by = 1250 + rReed() * 130;
    for (let k = -1; k <= 1; k++) {
      stroke(
        art,
        `M${bx},${by} q${k * 4 + (rReed() - 0.5) * 2},${-8 - rReed() * 5} ${k * 7},${-13 - rReed() * 5}`,
        'var(--ink-faint)',
        1,
      );
    }
  }

  // ── roads ──
  for (const { pts, seed } of ROADS) {
    stroke(art, scrawl(pts, seed, 3.5), 'var(--gold-dim)', 7, { opacity: '0.28' });
    stroke(art, scrawl(pts, seed + 'c', 3.5), 'var(--ink-soft)', 1.6, {
      'stroke-dasharray': '10 8',
      opacity: '0.7',
    });
  }
  // the hidden sett — field margins → under the ruined wall (the 怪 layer owns it)
  const sett = stroke(
    art,
    scrawl(
      [
        [740, 610],
        [840, 500],
        [905, 425],
      ],
      'sett',
      3,
    ),
    'var(--shu)',
    1.4,
    { 'stroke-dasharray': '3 8', opacity: '0.5', class: 't0v2-m-wrong' },
  );
  tip(sett, "The old sett — a way in under the ruined compound's wall nobody official knows");

  // ── the estate compound: a BIG walled court (over half the tier lives here;
  //    T1 opens its interiors, so the house carries faint closed wings today) ──
  const wall: Pt[] = [
    [950, 820],
    [1430, 795],
    [1650, 875],
    [1668, 1165],
    [1525, 1300],
    [1120, 1318],
    [942, 1235],
    [928, 985],
  ];
  art.append(
    sv('path', {
      d: scrawl(wall, 'cw', 3, true),
      fill: 'rgba(216,185,120,0.045)',
      stroke: 'var(--key)',
      'stroke-width': '2',
      'stroke-linejoin': 'round',
    }),
  );
  // the gate breaking the south wall
  stroke(
    art,
    scrawl(
      [
        [1206, 1332],
        [1206, 1306],
      ],
      'g-p1',
      1,
    ),
    'var(--silver)',
    3.2,
  );
  stroke(
    art,
    scrawl(
      [
        [1254, 1330],
        [1254, 1304],
      ],
      'g-p2',
      1,
    ),
    'var(--silver)',
    3.2,
  );
  stroke(
    art,
    scrawl(
      [
        [1198, 1305],
        [1262, 1303],
      ],
      'g-l',
      1,
    ),
    'var(--silver)',
    3,
  );
  // the main house — and its CLOSED wings, faint (T1's interior frontier:
  // east/west wings, the inner garden between them, the shoin)
  building(art, 1200, 960, 250, 135, 'omoya');
  building(art, 1042, 945, 105, 175, 'wing-w', true);
  const wingW = art.lastElementChild;
  if (wingW) tip(wingW as SVGElement, 'The west wing — shuttered (T1 ground)');
  building(art, 1362, 945, 105, 175, 'wing-e', true);
  const wingE = art.lastElementChild;
  if (wingE) tip(wingE as SVGElement, 'The east wing — shuttered (T1 ground)');
  building(art, 1560, 965, 76, 58, 'kura-b'); // the kura
  building(art, 1467, 1200, 42, 32, 'shed'); // the woodshed hut
  building(art, 880, 1132, 52, 34, 'sick', true); // the sickroom lean-to (outside the wall)
  // a well in the forecourt (a lived-in court, not a box)
  art.append(
    sv('circle', {
      cx: '1310',
      cy: '1120',
      r: '7',
      fill: 'none',
      stroke: 'var(--silver-wire)',
      'stroke-width': '1.5',
    }),
  );
  // Yohei's stall — a small awning outside the gate (market days)
  const stall = sv('g');
  stroke(
    stall,
    scrawl(
      [
        [1300, 1408],
        [1330, 1408],
      ],
      'stall-a',
      1,
    ),
    'var(--gold-dim)',
    2,
  );
  stroke(
    stall,
    scrawl(
      [
        [1302, 1408],
        [1302, 1424],
      ],
      'stall-b',
      0.6,
    ),
    'var(--gold-dim)',
    1.5,
  );
  stroke(
    stall,
    scrawl(
      [
        [1328, 1408],
        [1328, 1424],
      ],
      'stall-c',
      0.6,
    ),
    'var(--gold-dim)',
    1.5,
  );
  tip(stall, "Yohei's pedlar stall — sets up on market days; his coin is finite per visit");
  art.append(stall);

  // ── the home paddies: three terraced parcels + water ticks ──
  const parcels: readonly { pts: readonly Pt[]; seed: string }[] = [
    {
      pts: [
        [505, 862],
        [762, 848],
        [782, 938],
        [518, 952],
      ],
      seed: 'p1',
    },
    {
      pts: [
        [492, 966],
        [792, 952],
        [806, 1042],
        [502, 1056],
      ],
      seed: 'p2',
    },
    {
      pts: [
        [508, 1070],
        [800, 1058],
        [786, 1148],
        [522, 1160],
      ],
      seed: 'p3',
    },
  ];
  for (const { pts, seed } of parcels) {
    art.append(
      sv('path', {
        d: scrawl(pts, seed, 3, true),
        fill: 'rgba(216,185,120,0.06)',
        stroke: 'var(--key)',
        'stroke-width': '1.6',
        'stroke-linejoin': 'round',
      }),
    );
    const r = rng(seed + 'w');
    for (let i = 0; i < 2; i++) {
      const hy = (pts[0]![1] + pts[2]![1]) / 2 - 9 + i * 18 + (r() - 0.5) * 4;
      stroke(
        art,
        scrawl(
          [
            [pts[0]![0] + 40, hy],
            [pts[1]![0] - 40, hy],
          ],
          seed + 'h' + i,
          1.2,
        ),
        'var(--ink-faint)',
        1,
        { opacity: '0.7' },
      );
    }
  }
  // boundary stones far beyond the worked rows, on the river side (the wrong thing)
  const bstones = sv('g', { class: 't0v2-m-wrong' });
  for (const [bx, by] of [
    [415, 880],
    [400, 1000],
    [420, 1105],
  ] as const) {
    bstones.append(
      sv('rect', {
        x: String(bx),
        y: String(by),
        width: '8',
        height: '12',
        fill: 'none',
        stroke: 'var(--shu)',
        'stroke-width': '1.2',
        opacity: '0.55',
        transform: `rotate(${(bx % 7) - 3} ${bx} ${by})`,
      }),
    );
  }
  tip(
    bstones,
    'Boundary stones far beyond the worked rows — the fields were once four times wider',
  );
  art.append(bstones);
  // field-margin setts: burrow mouths in the strip above the parcels
  const rSett = rng('setts');
  for (let i = 0; i < 6; i++) {
    const sx = 560 + rSett() * 260;
    const sy = 700 + rSett() * 110;
    art.append(
      sv('circle', {
        cx: String(sx),
        cy: String(sy),
        r: '3',
        fill: 'var(--steel-0)',
        stroke: 'var(--ink-faint)',
        'stroke-width': '1',
      }),
    );
  }

  // ── the ruined compound (north): broken walls, fallen gate, the rope line ──
  const ruinWall: Pt[] = [
    [860, 205],
    [1180, 185],
    [1200, 395],
    [880, 415],
  ];
  art.append(
    sv('path', {
      d: scrawl(ruinWall, 'ru-w', 5, true),
      fill: 'none',
      stroke: 'var(--silver-faint)',
      'stroke-width': '1.6',
      'stroke-dasharray': '12 9',
      opacity: '0.8',
    }),
  );
  stroke(
    art,
    scrawl(
      [
        [930, 260],
        [1000, 250],
        [985, 295],
      ],
      'ru-r1',
      4,
      true,
    ),
    'var(--silver-faint)',
    1.2,
    { opacity: '0.6' },
  );
  stroke(
    art,
    scrawl(
      [
        [1050, 270],
        [1130, 262],
        [1120, 325],
        [1060, 330],
      ],
      'ru-r2',
      4.5,
      true,
    ),
    'var(--silver-faint)',
    1.2,
    { opacity: '0.6' },
  );
  // the crumbled great gate (south face) + the rope across the approach
  stroke(
    art,
    scrawl(
      [
        [1005, 418],
        [1018, 396],
      ],
      'ru-g1',
      1.8,
    ),
    'var(--silver-faint)',
    2.8,
    { opacity: '0.7' },
  );
  stroke(
    art,
    scrawl(
      [
        [1040, 416],
        [1032, 398],
      ],
      'ru-g2',
      1.8,
    ),
    'var(--silver-faint)',
    2.8,
    { opacity: '0.7' },
  );
  const rope = stroke(
    art,
    scrawl(
      [
        [950, 455],
        [1030, 445],
        [1110, 452],
      ],
      'rope',
      2.5,
    ),
    'var(--shu)',
    1.5,
    { 'stroke-dasharray': '6 5', opacity: '0.55' },
  );
  tip(rope, 'The rope and the warning — LOCKED all tier');

  // ── the orchard: fruit trees in courtyard ROWS (the wrongness is the layout) ──
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      tree(art, 1260 + col * 42, 300 + row * 42, 9, `or-${row}-${col}`);
    }
  }
  stroke(
    art,
    scrawl(
      [
        [1248, 262],
        [1400, 262],
      ],
      'or-path',
      1.6,
    ),
    'var(--ink-faint)',
    1,
    { 'stroke-dasharray': '4 6', opacity: '0.5' },
  );

  // ── the bamboo grove: vertical culm strokes with leaf ticks ──
  const rBam = rng('bam');
  for (let i = 0; i < 16; i++) {
    const bx = 1565 + rBam() * 150;
    const by = 175 + rBam() * 80;
    stroke(
      art,
      scrawl(
        [
          [bx, by + 34],
          [bx + (rBam() - 0.5) * 5, by],
        ],
        `bam-${i}`,
        1,
      ),
      'var(--ink-soft)',
      1.3,
      { opacity: '0.75' },
    );
    stroke(art, `M${bx},${by + 8} l${5 + rBam() * 4},${-4 - rBam() * 3}`, 'var(--ink-soft)', 1, {
      opacity: '0.6',
    });
  }
  // the cut-bamboo waymark (a 怪 layer item)
  const waymark = stroke(
    art,
    scrawl(
      [
        [1548, 300],
        [1548, 268],
      ],
      'waymark',
      1,
    ),
    'var(--shu)',
    2,
    { opacity: '0.6', class: 't0v2-m-wrong' },
  );
  tip(waymark, 'The cut-bamboo waymark, renewed each season — far too old a habit');

  // ── the woodlot: loose trees + char-marked stumps + the road east off-sheet ──
  const spots: readonly Pt[] = [
    [1900, 590],
    [1955, 560],
    [2015, 600],
    [1925, 680],
    [1990, 665],
    [2050, 630],
    [2070, 700],
  ];
  spots.forEach(([tx, ty], i) => tree(art, tx, ty, 10, `wl-${i}`));
  const stumps = sv('g', { class: 't0v2-m-wrong' });
  for (const [sx, sy] of [
    [1880, 700],
    [2035, 730],
  ] as const) {
    stumps.append(
      sv('circle', {
        cx: String(sx),
        cy: String(sy),
        r: '4.5',
        fill: 'none',
        stroke: 'var(--shu)',
        'stroke-width': '1.2',
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
        [2020, 800],
        [2180, 815],
        [2350, 805],
      ],
      'wl-road',
      2.5,
    ),
    'var(--ink-soft)',
    2.6,
    { 'stroke-dasharray': '9 8', opacity: '0.45' },
  );

  // ── the night-rounds patrol rail (hidden until that node is selected) ──
  const rail = sv('g', { class: 't0v2-nightrail' });
  stroke(rail, scrawl(NIGHT_ROUTE, 'rail', 3.5), 'var(--shu)', 2, {
    'stroke-dasharray': '4 9',
    opacity: '0.85',
  });
  const lantern = sv('circle', {
    cx: '1400',
    cy: '1420',
    r: '7',
    fill: 'none',
    stroke: 'var(--shu)',
    'stroke-width': '1.8',
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

    const bw = 46;
    const bh = 44;
    // invisible hit-target spanning seal + caption (the ezu WebKit-gap lesson)
    g.append(
      sv('rect', {
        x: String(n.x - 70),
        y: String(n.y - bh / 2 - 8),
        width: '140',
        height: String(bh + 62),
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
          y: String(n.y + 10),
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
        y: String(n.y + bh / 2 + 22),
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
    const step = 34;
    let mx = n.x - ((marks.length - 1) * step) / 2;
    for (const m of marks) {
      const mt = sv(
        'text',
        {
          x: String(mx),
          y: String(n.y + bh / 2 + 46),
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
        [80, 140],
        [80, 78],
      ],
      'north-a',
      1.2,
    ),
    'var(--silver)',
    2.2,
  );
  stroke(
    north,
    scrawl(
      [
        [70, 92],
        [80, 74],
        [90, 92],
      ],
      'north-h',
      1,
    ),
    'var(--silver)',
    2.2,
  );
  north.append(
    sv(
      'text',
      {
        x: '80',
        y: '176',
        'text-anchor': 'middle',
        class: 't0v2-kanji',
        style: 'font-size:26px;fill:var(--silver);',
      },
      '北',
    ),
  );
  tip(north, 'North');
  seals.append(north);

  const cart = sv('g');
  cart.append(
    sv('rect', {
      x: '2286',
      y: '48',
      width: '58',
      height: '330',
      fill: 'var(--steel-2)',
      stroke: 'var(--key)',
      'stroke-width': '1.6',
    }),
  );
  const title = sv('text', {
    x: '2315',
    y: '72',
    class: 't0v2-kanji',
    style:
      'writing-mode:vertical-rl;font-size:28px;letter-spacing:8px;fill:var(--silver);text-anchor:start;',
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
      'NOT wired to the game. Drag to pan · scroll to zoom · roster rows fly to the zone. ' +
      'The empty ground is deliberate: every T1 zone has reserved room (see t1.md).',
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
  .t0v2-controls { display:flex; gap:.3rem; margin-left:auto; margin-right:2.4rem; align-items:center; }
  .t0v2-pill, .t0v2-zoom { font:12px/1.4 ui-monospace,SFMono-Regular,monospace; cursor:pointer;
    border:1px solid var(--silver-faint); border-radius:3px; padding:.15rem .5rem;
    background:var(--steel-2); color:var(--ink-soft); }
  .t0v2-pill[data-on] { background:var(--gold-dim); color:var(--void); border-color:var(--gold); font-weight:700; }
  .t0v2-zoom:hover, .t0v2-pill:hover { color:var(--ink); border-color:var(--silver); }
  .t0v2-zoomgroup { display:flex; gap:.2rem; margin-right:.5rem; }
  .t0v2-body { flex:1 1 auto; min-height:0; display:flex; gap:.8rem; margin-top:.8rem; }
  .t0v2-mapwrap { flex:1 1 auto; min-width:0; position:relative; border:1px solid var(--silver-faint);
    background:var(--void); overflow:hidden; }
  .t0v2-mapwrap svg { display:block; width:100%; height:100%; cursor:grab; touch-action:none; }
  .t0v2-mapwrap svg.t0v2-panning { cursor:grabbing; }
  .t0v2-hint { position:absolute; left:.6rem; bottom:.45rem; font-size:11px;
    color:var(--ink-faint); pointer-events:none; }
  .t0v2-aside { flex:0 0 330px; min-height:0; overflow-y:auto; padding-right:.4rem;
    display:flex; flex-direction:column; gap:.45rem; }
  @media (max-width: 900px) {
    .t0v2-body { flex-direction:column; }
    .t0v2-aside { flex:1 1 auto; }
  }
  .t0v2-kanji { font-family:var(--font-head); font-size:30px; fill:var(--ink); }
  .t0v2-caption { font-family:var(--font-body); font-size:17px; fill:var(--ink-soft); }
  .t0v2-mark { font-family:var(--font-head); font-size:18px; }
  .t0v2-m-combat { fill:var(--ink-soft); }
  .t0v2-m-folk { fill:var(--silver-dim); }
  .t0v2-m-wrong { fill:var(--shu); opacity:.8; }
  .t0v2-sealbox { fill:var(--steel-2); stroke:var(--silver-wire); stroke-width:1.6; }
  .t0v2-k-estate .t0v2-sealbox { stroke:var(--gold); }
  .t0v2-k-grounds .t0v2-sealbox { stroke:var(--gold-dim); }
  .t0v2-k-combat .t0v2-sealbox { stroke:var(--ink-soft); stroke-dasharray:6 4; }
  .t0v2-k-activity .t0v2-sealbox { stroke:var(--shu); stroke-dasharray:3 4; }
  .t0v2-k-scenery { opacity:.62; }
  .t0v2-k-scenery .t0v2-sealbox { stroke:var(--silver-faint); stroke-dasharray:4 5; }
  .t0v2-node { cursor:pointer; outline:none; }
  .t0v2-node:hover .t0v2-sealbox, .t0v2-node:focus-visible .t0v2-sealbox {
    stroke:var(--gold-hi); stroke-width:2.4; }
  .t0v2-node:hover .t0v2-caption { fill:var(--ink); }
  .t0v2-node[data-sel] .t0v2-sealbox { stroke:var(--shu); stroke-width:2.8; }
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

  const controls = hd('div', 't0v2-controls');
  head.append(controls);
  card.append(head);

  const body = hd('div', 't0v2-body');
  const mapWrap = hd('div', 't0v2-mapwrap');
  const svg = sv('svg', {
    viewBox: `0 0 ${WORLD.w} ${WORLD.h}`,
    role: 'img',
    'aria-label': 'T0 V2 survey plan — the story-bible zone draft',
    preserveAspectRatio: 'xMidYMid meet',
  });
  mapWrap.append(svg);
  mapWrap.append(hd('div', 't0v2-hint', 'drag to pan · scroll to zoom'));
  const aside = hd('div', 't0v2-aside');
  body.append(mapWrap, aside);
  card.append(body);

  // ── the view: pan (drag) + zoom (wheel / buttons), viewBox-driven ──
  const vb: { x: number; y: number; w: number; h: number } = {
    x: 0,
    y: 0,
    w: WORLD.w,
    h: WORLD.h,
  };
  const applyVb = (): void => {
    svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
  };
  const clampVb = (): void => {
    vb.w = Math.min(Math.max(vb.w, 320), WORLD.w * 1.15);
    vb.h = (vb.w * WORLD.h) / WORLD.w;
    const m = vb.w * 0.25; // let the sheet edge pull in a bit, never lose it
    vb.x = Math.min(Math.max(vb.x, -m), WORLD.w + m - vb.w);
    vb.y = Math.min(
      Math.max(vb.y, -(m * WORLD.h) / WORLD.w),
      WORLD.h + (m * WORLD.h) / WORLD.w - vb.h,
    );
  };
  /** client → world coords (getScreenCTM handles viewBox + letterboxing). */
  const toWorld = (cx: number, cy: number): { x: number; y: number } => {
    const m = svg.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    const p = new DOMPoint(cx, cy).matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  };
  const zoomAt = (cx: number, cy: number, factor: number): void => {
    const p = toWorld(cx, cy);
    vb.w *= factor;
    vb.h *= factor;
    clampVb();
    applyVb();
    // keep the world point under the cursor stationary: re-measure and shift
    const now = toWorld(cx, cy);
    vb.x += p.x - now.x;
    vb.y += p.y - now.y;
    clampVb();
    applyVb();
  };
  svg.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, e.deltaY > 0 ? 1.18 : 1 / 1.18);
    },
    { passive: false },
  );
  let dragging = false;
  let dragMoved = false;
  let dragStart = { x: 0, y: 0 };
  svg.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    dragging = true;
    dragMoved = false;
    dragStart = toWorld(e.clientX, e.clientY);
    svg.classList.add('t0v2-panning');
  });
  svg.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const p = toWorld(e.clientX, e.clientY);
    const dx = dragStart.x - p.x;
    const dy = dragStart.y - p.y;
    if (!dragMoved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
      dragMoved = true;
      // capture only once a REAL drag starts — capturing on pointerdown would
      // retarget the derived click to the svg and node selection would go dead
      svg.setPointerCapture(e.pointerId);
    }
    if (!dragMoved) return;
    vb.x += dx;
    vb.y += dy;
    clampVb();
    applyVb();
  });
  const endDrag = (): void => {
    dragging = false;
    svg.classList.remove('t0v2-panning');
  };
  svg.addEventListener('pointerup', endDrag);
  svg.addEventListener('pointercancel', endDrag);

  const fit = (): void => {
    vb.x = 0;
    vb.y = 0;
    vb.w = WORLD.w;
    vb.h = WORLD.h;
    applyVb();
  };
  /** Fly the view to a node (roster navigation) — a readable close-up. */
  const focusNode = (id: string): void => {
    const n = NODES.find((x) => x.id === id);
    if (!n) return;
    vb.w = 900;
    vb.h = (900 * WORLD.h) / WORLD.w;
    vb.x = n.x - vb.w / 2;
    vb.y = n.y - vb.h / 2;
    clampVb();
    applyVb();
  };

  // zoom buttons + layer pills
  const zoomGroup = hd('div', 't0v2-zoomgroup');
  const zoomBtn = (label: string, act: () => void, aria: string): void => {
    const b = hd('button', 't0v2-zoom', label);
    b.type = 'button';
    b.setAttribute('aria-label', aria);
    b.addEventListener('click', () => act());
    zoomGroup.append(b);
  };
  const centre = (): { x: number; y: number } => {
    const r = svg.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };
  zoomBtn(
    '⊕',
    () => {
      const c = centre();
      zoomAt(c.x, c.y, 1 / 1.35);
    },
    'Zoom in',
  );
  zoomBtn(
    '⊖',
    () => {
      const c = centre();
      zoomAt(c.x, c.y, 1.35);
    },
    'Zoom out',
  );
  zoomBtn('⤢ fit', fit, 'Fit the whole sheet');
  controls.append(zoomGroup);

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
    controls.append(pill);
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
      renderOverview(aside, (nid) => {
        select(nid);
        focusNode(nid);
      });
    }
  };
  for (const [id, g] of nodeEls) {
    g.setAttribute('tabindex', '0');
    g.setAttribute('role', 'button');
    g.addEventListener('click', () => {
      if (dragMoved) return; // a pan that ended on a seal is not a selection
      select(selected === id ? null : id);
    });
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
