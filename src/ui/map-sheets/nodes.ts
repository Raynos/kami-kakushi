// The T0/T1 review-map zone rosters — bible-distilled CONTENT only (verbatim from
// docs/story-bible/tiers/t0.md + t1.md via dev-t0v2-map.ts, the 2026-07-07 walked-whole
// sheets). Positions live in layout.ts (the ONE master geography) — a node here is
// pure narrative data: what the zone IS, never where it sits or how it draws.

export type ZoneKind = 'estate' | 'grounds' | 'combat' | 'activity' | 'scenery';
export type Tier = 'T0' | 'T1';

export interface SheetNode {
  readonly id: string;
  readonly kanji: string;
  readonly name: string;
  readonly kind: ZoneKind;
  readonly blurb: string;
  readonly actions: readonly string[];
  readonly who: readonly string[];
  readonly wrong: string;
  readonly combat?: string;
}

export const KIND_META: Record<ZoneKind, { chip: string; label: string }> = {
  estate: { chip: '屋敷', label: 'estate' },
  grounds: { chip: '野良', label: 'grounds' },
  combat: { chip: '戦', label: 'combat zone' },
  activity: { chip: '夜廻', label: 'combat activity' },
  scenery: { chip: '封', label: 'locked scenery' },
};

export const T0_NODES: readonly SheetNode[] = [
  {
    id: 'weir',
    kanji: '堰',
    name: 'The Weir & riverbank',
    kind: 'grounds',
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
    blurb: 'His corner: a mat, a chipped bowl, the comfort floor.',
    actions: ['Rest / recover', 'Keep his few things'],
    who: ['O-Sato leaves mended things without knocking (later rungs)'],
    wrong: 'None — this node is the one warmth the tier allows, and it is earned.',
  },
  {
    id: 'kitchen',
    kanji: '竈',
    name: 'The Kitchen threshold',
    kind: 'estate',
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

export const T1_NODES: readonly SheetNode[] = [
  {
    id: 'terraced-paddies',
    kanji: '棚',
    name: 'The Terraced paddies (upper & lower)',
    kind: 'grounds',
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
export const T1_NOTES: Readonly<Record<string, string>> = {
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
  gate:
    "R0's morning muster goes out through it with the paid crews — the first work beyond " +
    "the yard. Yohei's stall keeps its market days in its shadow. (The precinct's GREAT " +
    "gate stays crumbled and roped — that reveal is T2's.)",
  ruined:
    'Still locked, still not discussed — no new work touches it while everything around ' +
    "it is rebuilt. The restored inner garden's stepping-stone path runs to a gate that " +
    'opens on the rope: the compound was designed to walk INTO it.',
  shrine: "Entered now — the kura key makes him a neighbour of Toku's habit (R3).",
};

export const T1_IDS: ReadonlySet<string> = new Set(T1_NODES.map((n) => n.id));

export function rosterFor(tier: Tier): readonly SheetNode[] {
  // T1 KEEPS the T0 'ruined compound' node (story-bible 05-world: the ruin is
  // locked scenery until the T2 reveal — T1 never enters it; the wings arc is
  // the GUEST HOUSE's interior, not the ruin's).
  return tier === 'T0' ? T0_NODES : [...T0_NODES, ...T1_NODES];
}
