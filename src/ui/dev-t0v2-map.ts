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

const T0_NODES: readonly T0V2Node[] = [
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

// ── the T1 layer — docs/story-bible/tiers/t1.md verbatim-distilled. The T1 map
//    IS the T0 sheet plus these: same world, same carried seals, new zones on
//    the ground the T0 layout reserved for them (the whole point of the plan).

type Tier = 'T0' | 'T1';

const T1_NODES: readonly T0V2Node[] = [
  {
    id: 'terraced-paddies',
    kanji: '棚',
    name: 'The Terraced paddies (upper & lower)',
    kind: 'grounds',
    x: 565,
    y: 505,
    blurb: "The estate's real farmland beyond the home paddy; R1's round.",
    actions: [
      "Field work at scale (the deed engine's T1 heart)",
      'Re-stack terrace walls',
      'Manage the sluice water',
    ],
    who: ["Denshichi's crews at season peaks"],
    wrong:
      'The terrace stones are NUMBERED — cut numerals running far past the terraces that ' +
      'still exist; the hillside above was let go, terrace by terrace, and the numbers ' +
      'still count it.',
  },
  {
    id: 'woodlot-clamp',
    kanji: '炭',
    name: 'The Woodlot proper & charcoal clamp',
    kind: 'grounds',
    x: 2090,
    y: 480,
    blurb:
      "T0 saw the edge; this is the lot. R2's ground — his charcoal is the first thing the " +
      'house SELLS that his hands made.',
    actions: [
      "Fell timber (the works' material)",
      'Coal the clamp (the charcoal that feeds the mon lane)',
      "Overnight clamp-tending — the tier's peaceful solitude vigils",
    ],
    who: ['Nobody, by design'],
    wrong:
      "T0's undated char marks resolve into a BURN LINE WITH A STRAIGHT EDGE — a firebreak " +
      'someone cut and held. The lot survived a fire the household has never once mentioned.',
  },
  {
    id: 'flood-works',
    kanji: '樋',
    name: 'The Weir & flood-works',
    kind: 'grounds',
    x: 385,
    y: 775,
    blurb: 'Channels, sluices, the leased screens — and the OLD BREACH.',
    actions: [
      'Mend the works (repair-labour)',
      "R4: close the breach's upstream pools — PERMANENTLY drains the Weir-reeds rat " +
        'pressure (fixing the land fixes the combat zone, on-screen)',
    ],
    who: ['Matsuzō across the water', 'Sōan passing on rounds'],
    wrong:
      "The breach isn't storm damage — THE STONES WERE TAKEN. Dressed stone doesn't wash " +
      'away; it walks. The flood came through a hole people made.',
  },
  {
    id: 'kura-interior',
    kanji: '庫',
    name: 'The Kura interior',
    kind: 'estate',
    x: 1615,
    y: 905,
    blurb: "R3's ground; the key's whole meaning.",
    actions: [
      'Warden the stores (the seasonal inventory up close)',
      'Read the old ledgers (ambient story)',
      "Keep the alcove's corridor swept — around Toku's rites, never touching them",
    ],
    who: ['Toku at the alcove', 'Genemon on audit days'],
    wrong:
      'The CUT PAGE-STUBS — a run of pages razored from the old ledgers, all from the same ' +
      'years. The missing years are the ones nobody talks about.',
  },
  {
    id: 'workshops',
    kanji: '工',
    name: 'The Workshops',
    kind: 'estate',
    x: 1590,
    y: 1155,
    blurb: "Heikichi's joiner's bench; the cold forge until R6.",
    actions: [
      'Assist the joiner (craft learning)',
      "Make and mend tools (durables the mon lane doesn't have to buy)",
      'Forge work once Tetsuji lights it (R6)',
    ],
    who: ['Heikichi', 'Tetsuji, late tier', 'Shinnosuke on the wall — the mirror follows the work'],
    wrong:
      'The tool racks hold SOOT SHADOWS — outlines of tools long gone, racks sized for ' +
      "thirty men's kit. The compression, written in absence.",
  },
  {
    id: 'boundary-fields',
    kanji: '界',
    name: 'The Boundary stones & far fields',
    kind: 'grounds',
    x: 500,
    y: 1240,
    blurb:
      "The estate's legal edge, far past the worked rows; the boar's ground, and the wolf's " +
      'return at R6.',
    actions: [
      'Walk the bounds (the reclamation survey)',
      'Clear far fields (expansion labour)',
      'The boar chain',
    ],
    who: ['Nobody; crews only at pushes'],
    wrong:
      'One stone on the river side is NEWER than its brothers, and stands a field short of ' +
      'where the terrace numbering says it should. Someone moved the line inward. (Banked ' +
      'for T2 — a village-track dispute waiting.)',
    combat:
      "Authored chain — the boar chain feeds the wolf's ground. The R6 set-piece: the wolf " +
      "met in DAYLIGHT, in the open fields — DECIDE: won, or spared (T0's dark-to-the-stores " +
      'visit, deliberately inverted).',
  },
  {
    id: 'family-plot',
    kanji: '墓',
    name: 'The Family plot',
    kind: 'estate',
    x: 945,
    y: 615,
    blurb: "The Kurosawa dead; Bon #2's ground.",
    actions: ['Tend the graves (a kura-warden-adjacent duty)', 'The Bon observance'],
    who: ['Toku for the rites', 'The household at Bon'],
    wrong:
      'One plot SWEPT AND WEEDED WITH NO STONE IN IT — ground held for a burial nobody will ' +
      "schedule. (The register's unstruck line, in earth.)",
  },
  {
    id: 'upstream-pools',
    kanji: '淵',
    name: 'The Upstream pools',
    kind: 'combat',
    x: 450,
    y: 200,
    blurb: 'The silted pools behind the old breach; the rat source itself, finally reachable.',
    actions: [
      'Clear the swarms at the water',
      'R4: the breach repair DRAINS it — the zone converts to quiet works-ground',
    ],
    who: ['Nobody sane'],
    wrong: 'The pools exist at all — water standing where the works once ran it away.',
    combat:
      'Grindable loop that ENDS — rat swarms thick at the water, a marten den as the ' +
      'mini-cap; RETIRED by the R4 breach repair (the Weir-reeds pressure drops for good).',
  },
  {
    id: 'letgo-terraces',
    kanji: '荒',
    name: 'The Let-go terraces',
    kind: 'combat',
    x: 530,
    y: 340,
    blurb:
      'The scrub hillside above the worked rows, where the numbered stones keep counting. ' +
      "Boar setts; the monkey troop's fallback ground. T0's orchard, escalated.",
    actions: ['Clear it stage by stage — each cleared stage becomes a RECLAIMABLE TERRACE'],
    who: ["Denshichi's crews once a stage is safe"],
    wrong: "The numbering (shared with the paddies' rows above).",
    combat:
      'Authored chain — combat converts to reclamation converts to income; the terrace ' +
      'numbers come back into use one by one.',
  },
  {
    id: 'downstream-shallows',
    kanji: '瀬',
    name: 'The Downstream shallows',
    kind: 'combat',
    x: 330,
    y: 1455,
    blurb:
      "Matsuzō's stretch of river, where KAWAUSO — otters — raid the leased fish weirs. In " +
      'the stories the otter shapeshifts and drowns men; in daylight it is wet, greedy, and ' +
      'mundane (kernel #1). Damage lands on HIS side of the lease.',
    actions: [
      'Drive the otters (worst in autumn when the fish run fat)',
      'Mend the fish weirs',
      'Settle the damage — in coin or labour',
    ],
    who: ['Matsuzō, counting losses'],
    wrong: 'The otters den in STONEWORK — dressed stone, in a riverbank.',
    combat: 'Grindable loop — autumn peaks.',
  },
  {
    id: 'east-wing',
    kanji: '東',
    name: 'The East wing',
    kind: 'estate',
    x: 1385,
    y: 1005,
    blurb: "The tier's interior frontier, cleared room by room (from R4 — tool-first).",
    actions: [
      'Repair rooms (works-labour with Heikichi)',
      'Carry and clear',
      'Warden its keys from R6',
    ],
    who: [
      'O-Sato airing ahead of the work — one room was hers',
      'Chiyo begins using the first restored room',
    ],
    wrong:
      'The fittings are MISMATCHED — good pieces from many rooms consolidated into few. The ' +
      'house ate itself to keep face, and the furniture remembers.',
  },
  {
    id: 'west-wing',
    kanji: '西',
    name: 'The West wing',
    kind: 'scenery',
    x: 1005,
    y: 985,
    blurb:
      "Closed, all tier. Katsuhide's things are stored there; at R6 the crates cross INTO " +
      "it, at the threshold, from Naoyuki's own hands. The MC never enters — the door is a " +
      'fact, not a lock to pick.',
    actions: ['None — the threshold only (R6, the crates crossing)'],
    who: ['O-Sato sweeps its corridor as ordinary duty'],
    wrong:
      'The household keeps the closed wing like an open one — and nobody finds that ' +
      'strange. Not a mystery: a portrait of the refusal.',
  },
  {
    id: 'inner-garden',
    kanji: '苑',
    name: 'The Inner garden',
    kind: 'estate',
    x: 1200,
    y: 843,
    blurb:
      "Between the wings; overgrown, then tended — the tier's recovery-flavor node (T0's " +
      'woodshed warmth, promoted).',
    actions: ['Clear and tend (light labour)', 'Gather for the kitchen and Sōan'],
    who: ['Chiyo walks it once it is decent', 'Shinnosuke cuts through it against instruction'],
    wrong:
      'The stepping-stone path runs to a gate in the wall — and the gate opens on the rope ' +
      'and the ruin. The garden was designed to walk INTO the compound.',
  },
  {
    id: 'shoin',
    kanji: '書',
    name: 'The Shoin',
    kind: 'estate',
    x: 1130,
    y: 960,
    blurb:
      "Restored last, for the scene; Heikichi's and the MC's joint work — the last boards " +
      'set alone. Then: the register, the last entry, the unstruck line.',
    actions: ['The restoration (R7, board by board)', 'The register scene'],
    who: ['Heikichi', 'Shigemasa, once — his only scene'],
    wrong:
      "The salvage marks in its timbers — the shoin's bones came from the compound " +
      '("Good wood. Came from over there."), said as craft, dated never.',
  },
];

/** What T1 changes about a CARRIED T0 zone (shown in its detail pane on the T1 map). */
const T1_NOTES: Readonly<Record<string, string>> = {
  'weir-reeds':
    'The pressure visibly drops once the upstream pools drain (R4) — fixing the land fixes ' +
    'the combat zone.',
  grove: 'The monkey troop keeps the Let-go terraces as its fallback ground.',
  'night-rounds':
    'The route GROWS with the estate — every building brought back adds a stretch, ' +
    'all-combat end to end. Rats fade after R4; winter puts feral dogs on it; spring adds ' +
    "a cornered boar sow as the night apex (the wolf's set-piece stays the tier's peak).",
  'drill-yard':
    "Carries forward — Shinnosuke now drills too, badly; Tetsuji's forge opens the " +
    'equipment lane at R6.',
  orchard: "Reclaimed rows — Heikichi's dusk lantern walk names where the lanterns hung.",
  woodshed:
    'R6, the room offered: a restored east-wing room, a door of his own — take it, or keep ' +
    'the woodshed. (If the T0 yard dog was fed, it follows him — or keeps the woodshed for him.)',
  kitchen:
    "R5: Genemon's papers finally LEAVE the kitchen for the steward's room — T0's " +
    'wrong-thing, repaired on screen. The debt panel unlocks IN that room.',
  ruined: "Still roped, all tier — but the inner garden's gate is found to open onto it.",
  shrine: "Entered now — the kura key makes him a neighbour of Toku's habit (R3).",
};

const T1_IDS = new Set(T1_NODES.map((n) => n.id));

function rosterFor(tier: Tier): readonly T0V2Node[] {
  return tier === 'T0' ? T0_NODES : [...T0_NODES, ...T1_NODES];
}

/** T1-only roads — the land zones hang off the T0 network. */
const T1_ROADS: readonly { pts: readonly Pt[]; seed: string }[] = [
  // paddies → terraced paddies (up the slope)
  {
    pts: [
      [610, 880],
      [575, 700],
      [565, 580],
    ],
    seed: 't1-pt',
  },
  // terraces → let-go terraces (the numbering keeps going)
  {
    pts: [
      [548, 445],
      [535, 395],
    ],
    seed: 't1-tl',
  },
  // weir → flood-works (up the bank)
  {
    pts: [
      [395, 1060],
      [385, 950],
      [390, 850],
    ],
    seed: 't1-wf',
  },
  // flood-works → the breach → the pools (upstream)
  {
    pts: [
      [385, 700],
      [400, 480],
      [435, 290],
    ],
    seed: 't1-fp',
  },
  // reeds → downstream shallows (Matsuzō's stretch)
  {
    pts: [
      [355, 1395],
      [335, 1430],
    ],
    seed: 't1-rs',
  },
  // the way up → family plot (off the ruin path)
  {
    pts: [
      [1255, 700],
      [1090, 650],
      [1005, 628],
    ],
    seed: 't1-fp2',
  },
  // woodlot edge → the lot proper & the clamp
  {
    pts: [
      [2000, 690],
      [2065, 585],
      [2085, 535],
    ],
    seed: 't1-wc',
  },
  // the west road → boundary stones & far fields
  {
    pts: [
      [700, 1355],
      [590, 1300],
      [540, 1270],
    ],
    seed: 't1-bf',
  },
];

/** The T1 night round — grown by the estate-build (workshops + east wing legs). */
const NIGHT_ROUTE_T1: readonly Pt[] = [
  [1400, 1420],
  [1240, 1355],
  [1230, 1165],
  [1385, 1030],
  [1550, 1000],
  [1590, 1140],
  [1470, 1230],
  [1795, 1195],
  [1415, 1430],
];

// ── the sheet painter ─────────────────────────────────────────────────────────

let uidCounter = 0;

function paintSheet(svg: SVGSVGElement, nodeEls: Map<string, SVGGElement>, tier: Tier): void {
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
  const tierRoads = tier === 'T1' ? [...ROADS, ...T1_ROADS] : ROADS;
  for (const { pts, seed } of tierRoads) {
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
  if (wingW) {
    tip(
      wingW as SVGElement,
      tier === 'T0' ? 'The west wing — shuttered (T1 ground)' : 'The west wing — closed, all tier',
    );
  }
  // the east wing opens through T1 (tool-first, R4+) — solid there, faint in T0
  building(art, 1362, 945, 105, 175, 'wing-e', tier === 'T0');
  const wingE = art.lastElementChild;
  if (wingE && tier === 'T0') tip(wingE as SVGElement, 'The east wing — shuttered (T1 ground)');
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
  if (tier === 'T1') paintT1Art(art);

  const rail = sv('g', { class: 't0v2-nightrail' });
  stroke(rail, scrawl(tier === 'T1' ? NIGHT_ROUTE_T1 : NIGHT_ROUTE, 'rail', 3.5), 'var(--shu)', 2, {
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
  for (const n of rosterFor(tier)) {
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
    // a gold 新 tick beside seals that are NEW in T1 (the side-by-side review cue)
    if (tier === 'T1' && T1_IDS.has(n.id)) {
      const badge = sv(
        'text',
        {
          x: String(n.x + bw / 2 + 6),
          y: String(n.y - bh / 2 + 8),
          class: 't0v2-newbadge',
        },
        '新',
      );
      tip(badge, 'New ground in T1');
      g.append(badge);
    }
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

/** The T1-only ground art, painted onto the reserved ground (t1.md's land + wings). */
function paintT1Art(art: SVGElement): void {
  // the terraced paddies — stepped parcels up the NW slope
  const terraces: readonly { pts: readonly Pt[]; seed: string }[] = [
    {
      pts: [
        [488, 430],
        [700, 418],
        [716, 478],
        [498, 490],
      ],
      seed: 't1p1',
    },
    {
      pts: [
        [478, 502],
        [724, 490],
        [736, 548],
        [488, 560],
      ],
      seed: 't1p2',
    },
    {
      pts: [
        [492, 572],
        [740, 560],
        [728, 618],
        [502, 630],
      ],
      seed: 't1p3',
    },
  ];
  for (const { pts, seed } of terraces) {
    art.append(
      sv('path', {
        d: scrawl(pts, seed, 3, true),
        fill: 'rgba(216,185,120,0.06)',
        stroke: 'var(--key)',
        'stroke-width': '1.6',
        'stroke-linejoin': 'round',
      }),
    );
  }
  // the let-go terraces — the same shapes gone to scrub, dashed, still NUMBERED
  const letgo: readonly { pts: readonly Pt[]; seed: string }[] = [
    {
      pts: [
        [452, 288],
        [640, 276],
        [652, 330],
        [462, 342],
      ],
      seed: 't1l1',
    },
    {
      pts: [
        [462, 354],
        [660, 342],
        [672, 396],
        [474, 408],
      ],
      seed: 't1l2',
    },
  ];
  const rL = rng('t1-letgo');
  for (const { pts, seed } of letgo) {
    art.append(
      sv('path', {
        d: scrawl(pts, seed, 3.4, true),
        fill: 'none',
        stroke: 'var(--silver-faint)',
        'stroke-width': '1.4',
        'stroke-dasharray': '7 6',
        opacity: '0.8',
      }),
    );
    for (let i = 0; i < 4; i++) {
      const tx = pts[0]![0] + 20 + rL() * 160;
      const ty = pts[0]![1] + 8 + rL() * 40;
      for (let k = -1; k <= 1; k++) {
        stroke(
          art,
          `M${tx},${ty} q${k * 4},${-6 - rL() * 4} ${k * 7},${-10 - rL() * 4}`,
          'var(--ink-faint)',
          1,
        );
      }
    }
  }
  // the numbered terrace stones, running PAST the worked rows (the wrong thing)
  const stones = sv('g', { class: 't0v2-m-wrong' });
  for (const [sx, sy] of [
    [470, 610],
    [462, 480],
    [452, 336],
    [446, 262],
  ] as const) {
    stones.append(
      sv('rect', {
        x: String(sx),
        y: String(sy),
        width: '7',
        height: '11',
        fill: 'none',
        stroke: 'var(--shu)',
        'stroke-width': '1.1',
        opacity: '0.55',
      }),
    );
  }
  tip(stones, 'The numbered terrace stones — the numerals run far past the terraces that exist');
  art.append(stones);

  // the upstream pools — standing water behind the breach; the breach itself a
  // stone-robbed gap in the bank (dressed stones walked, they didn't wash)
  for (const [px, py, pw, seed] of [
    [452, 262, 40, 't1-pool1'],
    [500, 300, 30, 't1-pool2'],
  ] as const) {
    art.append(
      sv('path', {
        d: scrawl(
          [
            [px - pw, py],
            [px, py - pw * 0.45],
            [px + pw, py],
            [px, py + pw * 0.5],
          ],
          seed,
          3,
          true,
        ),
        fill: 'var(--steel-0)',
        stroke: 'var(--silver-dim)',
        'stroke-width': '1',
        opacity: '0.85',
      }),
    );
  }
  const breach = sv('g', { class: 't0v2-m-wrong' });
  for (const [bx, by, rot] of [
    [368, 452, -18],
    [412, 470, 24],
  ] as const) {
    breach.append(
      sv('rect', {
        x: String(bx),
        y: String(by),
        width: '16',
        height: '9',
        fill: 'none',
        stroke: 'var(--shu)',
        'stroke-width': '1.2',
        opacity: '0.55',
        transform: `rotate(${rot} ${bx} ${by})`,
      }),
    );
  }
  tip(breach, 'The old breach — the stones were TAKEN; the flood came through a hole people made');
  art.append(breach);

  // the flood-works — channels fanning from the river toward the paddies + a sluice tick
  for (const [seed, pts] of [
    [
      't1-ch1',
      [
        [335, 790],
        [430, 830],
        [500, 880],
      ],
    ],
    [
      't1-ch2',
      [
        [340, 730],
        [450, 760],
        [520, 800],
      ],
    ],
  ] as const) {
    stroke(art, scrawl(pts as readonly Pt[], seed, 2.5), 'var(--silver-dim)', 1.2, {
      opacity: '0.5',
    });
  }
  stroke(
    art,
    scrawl(
      [
        [352, 758],
        [372, 752],
      ],
      't1-sluice',
      0.8,
    ),
    'var(--silver)',
    3,
    { opacity: '0.8' },
  );

  // the downstream shallows — fish-weir chevrons in Matsuzō's stretch + the den stones
  for (const [vx, vy] of [
    [318, 1440],
    [342, 1490],
    [322, 1530],
  ] as const) {
    stroke(
      art,
      `M${vx - 12},${vy - 10} L${vx},${vy} L${vx + 12},${vy - 10}`,
      'var(--ink-soft)',
      1.3,
      { opacity: '0.7' },
    );
  }
  const den = sv('g', { class: 't0v2-m-wrong' });
  for (const [dx2, dy2] of [
    [368, 1500],
    [380, 1512],
  ] as const) {
    den.append(
      sv('rect', {
        x: String(dx2),
        y: String(dy2),
        width: '12',
        height: '7',
        fill: 'none',
        stroke: 'var(--shu)',
        'stroke-width': '1.1',
        opacity: '0.55',
      }),
    );
  }
  tip(den, 'The otters den in STONEWORK — dressed stone, in a riverbank');
  art.append(den);

  // the family plot — a small walled square on the knoll; one plot swept, stoneless
  art.append(
    sv('path', {
      d: scrawl(
        [
          [910, 580],
          [982, 574],
          [988, 632],
          [916, 638],
        ],
        't1-plot',
        2,
        true,
      ),
      fill: 'none',
      stroke: 'var(--silver-wire)',
      'stroke-width': '1.2',
      opacity: '0.8',
    }),
  );
  for (const [gx, gy] of [
    [928, 598],
    [946, 594],
    [964, 592],
    [930, 620],
  ] as const) {
    stroke(art, `M${gx},${gy + 8} l0,-8`, 'var(--silver-wire)', 2.4, { opacity: '0.8' });
  }
  const empty = sv('circle', {
    cx: '962',
    cy: '620',
    r: '6',
    fill: 'none',
    stroke: 'var(--shu)',
    'stroke-width': '1',
    'stroke-dasharray': '2 3',
    opacity: '0.6',
    class: 't0v2-m-wrong',
  });
  tip(empty, 'One plot swept and weeded with NO STONE in it');
  art.append(empty);

  // the woodlot proper — a denser stand past the edge, the clamp dome + its smoke,
  // and the firebreak: a burn line with a STRAIGHT edge (the wrong thing)
  const rW = rng('t1-lot');
  for (let i = 0; i < 9; i++) {
    tree(art, 2110 + rW() * 220, 370 + rW() * 130, 9 + rW() * 3, `t1-lt${i}`);
  }
  stroke(
    art,
    scrawl(
      [
        [2072, 540],
        [2090, 518],
        [2110, 540],
      ],
      't1-clamp',
      1.2,
    ),
    'var(--silver-wire)',
    2,
  );
  stroke(
    art,
    scrawl(
      [
        [2091, 512],
        [2086, 494],
        [2094, 478],
      ],
      't1-smoke',
      2,
    ),
    'var(--ink-faint)',
    1.2,
    { opacity: '0.5' },
  );
  const firebreak = stroke(art, 'M2064,346 L2258,392', 'var(--shu)', 1.4, {
    'stroke-dasharray': '9 5',
    opacity: '0.5',
    class: 't0v2-m-wrong',
  });
  tip(firebreak, 'The burn line with a STRAIGHT edge — a firebreak someone cut and held');

  // the boundary stones & far fields — faint expansion parcels + the stone row,
  // with ONE newer stone standing a field short (the wrong thing)
  for (const [seed, pts] of [
    [
      't1-ff1',
      [
        [430, 1180],
        [600, 1170],
        [612, 1250],
        [442, 1260],
      ],
    ],
    [
      't1-ff2',
      [
        [448, 1272],
        [618, 1262],
        [606, 1340],
        [458, 1350],
      ],
    ],
  ] as const) {
    art.append(
      sv('path', {
        d: scrawl(pts as readonly Pt[], seed as string, 3.2, true),
        fill: 'none',
        stroke: 'var(--silver-faint)',
        'stroke-width': '1.3',
        'stroke-dasharray': '6 6',
        opacity: '0.75',
      }),
    );
  }
  for (const [sx, sy] of [
    [402, 1200],
    [396, 1290],
  ] as const) {
    art.append(
      sv('rect', {
        x: String(sx),
        y: String(sy),
        width: '8',
        height: '12',
        fill: 'none',
        stroke: 'var(--ink-faint)',
        'stroke-width': '1.1',
      }),
    );
  }
  const newer = sv('rect', {
    x: '432',
    y: '1244',
    width: '8',
    height: '12',
    fill: 'none',
    stroke: 'var(--shu)',
    'stroke-width': '1.3',
    opacity: '0.7',
    class: 't0v2-m-wrong',
  });
  tip(newer, 'The newer stone — a field short of where the terrace numbering says it should stand');
  art.append(newer);

  // the workshops — Heikichi's bench along the compound's east side
  building(art, 1600, 1120, 52, 36, 't1-shop');

  // the inner garden — stepping stones between the wings, running to a gate in
  // the north wall… which opens on the rope and the ruin
  for (const [gx, gy] of [
    [1196, 872],
    [1206, 850],
    [1216, 828],
  ] as const) {
    art.append(
      sv('circle', {
        cx: String(gx),
        cy: String(gy),
        r: '3',
        fill: 'var(--steel-2)',
        stroke: 'var(--silver-wire)',
        'stroke-width': '1',
      }),
    );
  }
  const gardenGate = stroke(
    art,
    scrawl(
      [
        [1222, 812],
        [1236, 806],
      ],
      't1-ggate',
      0.8,
    ),
    'var(--shu)',
    2.2,
    { opacity: '0.55', class: 't0v2-m-wrong' },
  );
  tip(gardenGate, 'The garden gate — it opens on the rope and the ruin');
}

// ── the detail pane ───────────────────────────────────────────────────────────

function renderOverview(aside: HTMLElement, select: (id: string) => void, tier: Tier): void {
  const roster = rosterFor(tier);
  aside.textContent = '';
  aside.append(
    hd('div', 't0v2-aside-title', tier === 'T0' ? 'T0 V2 — the zone draft' : 'T1 — the zone draft'),
  );
  const src = hd(
    'div',
    't0v2-aside-src',
    tier === 'T0'
      ? 'Source: docs/story-bible/tiers/t0.md (walked whole, 2026-07-07). Review artifact — ' +
          'NOT wired to the game. Drag to pan · scroll to zoom · roster rows fly to the zone. ' +
          'The empty ground is deliberate: every T1 zone has reserved room (see t1.md).'
      : 'Source: docs/story-bible/tiers/t1.md (walked whole, 2026-07-07). The SAME sheet as ' +
          'T0, grown: new zones (新, gold) land on the ground T0 reserved; carried zones keep ' +
          'their seals (their detail notes what T1 changes). Drag to pan · scroll to zoom · ' +
          'roster rows fly to the zone.',
  );
  aside.append(src);
  const counts = roster.reduce<Record<ZoneKind, number>>(
    (acc, n) => ((acc[n.kind] = (acc[n.kind] ?? 0) + 1), acc),
    { estate: 0, grounds: 0, combat: 0, activity: 0, scenery: 0 },
  );
  aside.append(
    hd(
      'div',
      't0v2-aside-sum',
      tier === 'T0'
        ? `${roster.length} nodes — ${counts.estate} estate · ${counts.grounds} grounds · ` +
            `${counts.combat} combat zones · ${counts.activity} combat activity · ` +
            `${counts.scenery} locked scenery. Shapes: 3 grindable loops · 1 authored chain · ` +
            '1 repeatable mini-dungeon (the Night rounds).'
        : `${roster.length} nodes (${T1_NODES.length} new in T1) — ${counts.estate} estate · ` +
            `${counts.grounds} grounds · ${counts.combat} combat zones · ${counts.activity} ` +
            `combat activity · ${counts.scenery} locked/closed. Shapes: grindable loops (the ` +
            'pools RETIRE at R4; the shallows; the carried T0 loops) · authored chains (the ' +
            'let-go terraces; the boar chain) · the R6 wolf set-piece in daylight · the Night ' +
            'rounds, grown building by building.',
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
    const group = roster.filter((n) => n.kind === kind);
    if (group.length === 0) continue;
    aside.append(hd('div', 't0v2-roster-head', `${KIND_META[kind].chip} ${KIND_META[kind].label}`));
    for (const n of group) {
      const row = hd('button', 't0v2-roster-row');
      row.type = 'button';
      row.append(hd('span', 't0v2-roster-kanji', n.kanji), hd('span', undefined, n.name));
      if (tier === 'T1' && T1_IDS.has(n.id)) row.append(hd('span', 't0v2-roster-new', '新'));
      row.addEventListener('click', () => select(n.id));
      aside.append(row);
    }
  }
}

function renderDetail(aside: HTMLElement, n: T0V2Node, back: () => void, tier: Tier): void {
  aside.textContent = '';
  const backBtn = hd('button', 't0v2-back', '← all zones');
  backBtn.type = 'button';
  backBtn.addEventListener('click', back);
  aside.append(backBtn);

  const head = hd('div', 't0v2-detail-head');
  head.append(hd('span', 't0v2-detail-kanji', n.kanji), hd('span', 't0v2-detail-name', n.name));
  aside.append(head);
  const chips = hd('div', 't0v2-chiprow');
  chips.append(
    hd(
      'div',
      `t0v2-chip t0v2-chip-${n.kind}`,
      `${KIND_META[n.kind].chip} · ${KIND_META[n.kind].label}`,
    ),
  );
  if (tier === 'T1' && T1_IDS.has(n.id))
    chips.append(hd('div', 't0v2-chip t0v2-chip-new', '新 · new in T1'));
  aside.append(chips);
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
  const t1note = T1_NOTES[n.id];
  if (tier === 'T1' && t1note) {
    aside.append(hd('div', 't0v2-detail-label', 'What T1 changes here'));
    aside.append(hd('p', 't0v2-detail-combat', t1note));
  }
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
  .t0v2-newbadge { font-family:var(--font-head); font-size:17px; fill:var(--gold); }
  .t0v2-roster-new { font-family:var(--font-head); color:var(--gold); flex:0 0 auto;
    margin-left:auto; font-size:12px; }
  .t0v2-chiprow { display:flex; gap:.35rem; }
  .t0v2-chip-new { border-color:var(--gold); color:var(--gold); }
  .t0v2-detail-combat { font-size:13px; line-height:1.5; color:var(--ink-soft); margin:0; }
  .t0v2-detail-wrong { font-size:13px; line-height:1.55; color:var(--shu); margin:0; opacity:.9; }
`;

/** Open the T0 V2 review map as a full-screen modal. Returns the scrim. */
export function openT0V2Map(): HTMLElement {
  return openTierMap('T0');
}

/** Open the T1 review map — the same sheet, grown to t1.md's roster. */
export function openT1Map(): HTMLElement {
  return openTierMap('T1');
}

function openTierMap(tier: Tier): HTMLElement {
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
  close.setAttribute('aria-label', `Close the ${tier} map`);
  card.append(close);

  const head = hd('div', 't0v2-head');
  const title = hd('div', 'modal-title');
  const kami = hd('span', 'kami', '絵図・改');
  const roman = hd(
    'span',
    'roman',
    tier === 'T0'
      ? 'T0 V2 — the story-bible zone draft'
      : 'T1 — the land & the wings (the same sheet, grown)',
  );
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
    'aria-label': `${tier} survey plan — the story-bible zone draft`,
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
    const n = rosterFor(tier).find((x) => x.id === id);
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
  paintSheet(svg, nodeEls, tier);

  let selected: string | null = null;
  const select = (id: string | null): void => {
    if (selected) delete nodeEls.get(selected)?.dataset.sel;
    selected = id;
    if (id) {
      const g = nodeEls.get(id);
      if (g) g.dataset.sel = '1';
      if (id === 'night-rounds') svg.setAttribute('data-night', '1');
      else svg.removeAttribute('data-night');
      const n = rosterFor(tier).find((x) => x.id === id)!;
      renderDetail(aside, n, () => select(null), tier);
    } else {
      svg.removeAttribute('data-night');
      renderOverview(
        aside,
        (nid) => {
          select(nid);
          focusNode(nid);
        },
        tier,
      );
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
